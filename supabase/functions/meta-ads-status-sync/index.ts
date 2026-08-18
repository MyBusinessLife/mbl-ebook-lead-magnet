import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
  "access-control-allow-methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "content-type": "application/json; charset=utf-8" },
  });

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object") {
    const value = error as Record<string, unknown>;
    return [value.message, value.details, value.hint, value.code]
      .filter((part) => typeof part === "string" && part.length > 0)
      .join(" · ") || JSON.stringify(value);
  }
  return String(error);
}

async function graphAll(version: string, path: string, token: string, fields: string) {
  let next: string | null = `https://graph.facebook.com/${version}/${path}`;
  const rows: Record<string, any>[] = [];

  while (next) {
    const url = new URL(next);
    if (!url.searchParams.has("fields")) url.searchParams.set("fields", fields);
    if (!url.searchParams.has("limit")) url.searchParams.set("limit", "200");
    url.searchParams.set("access_token", token);

    const response = await fetch(url);
    const body = await response.json();
    if (!response.ok) throw new Error(body?.error?.message || `Meta HTTP ${response.status}`);

    rows.push(...(body.data || []));
    next = body.paging?.next || null;
  }

  return rows;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const authHeader = request.headers.get("authorization") || "";
  const userToken = authHeader.replace(/^Bearer\s+/i, "");
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const metaToken = Deno.env.get("META_PAGE_ACCESS_TOKEN") || "";
  const version = Deno.env.get("META_GRAPH_VERSION") || "";

  if (![userToken, supabaseUrl, anonKey, serviceKey, metaToken, version].every(Boolean)) {
    return json({ error: "Missing configuration" }, 503);
  }

  const authClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
  const { data: userData, error: userError } = await authClient.auth.getUser(userToken);
  if (userError || !userData.user) return json({ error: "Unauthorized" }, 401);

  const db = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const { data: profile } = await db.from("user_profiles").select("role,active").eq("user_id", userData.user.id).maybeSingle();
  if (!profile?.active || !["admin", "commercial"].includes(profile.role)) return json({ error: "Forbidden" }, 403);

  try {
    const { data: accounts, error: accountError } = await db.from("ads_accounts")
      .select("id,meta_ad_account_id").eq("active", true).not("meta_ad_account_id", "is", null);
    if (accountError) throw accountError;

    const totals = { campaigns: 0, adsets: 0, ads: 0, synced_at: new Date().toISOString() };

    for (const account of accounts || []) {
      const metaAccount = String(account.meta_ad_account_id).replace(/^act_/, "act_");
      const [campaigns, adsets, ads] = await Promise.all([
        graphAll(version, `${metaAccount}/campaigns`, metaToken, "id,name,status,effective_status,objective,start_time,stop_time"),
        graphAll(version, `${metaAccount}/adsets`, metaToken, "id,name,status,effective_status,campaign_id,start_time,end_time"),
        graphAll(version, `${metaAccount}/ads`, metaToken, "id,name,status,effective_status,campaign_id,adset_id"),
      ]);

      const campaignMap = new Map<string, string>();
      for (const item of campaigns) {
        const { data, error } = await db.from("ads_campaigns").upsert({
          ads_account_id: account.id,
          meta_campaign_id: item.id,
          name: item.name,
          status: item.status,
          effective_status: item.effective_status,
          objective: item.objective || null,
          start_date: item.start_time?.slice(0, 10) || null,
          end_date: item.stop_time?.slice(0, 10) || null,
          active: item.effective_status === "ACTIVE",
          synced_at: totals.synced_at,
        }, { onConflict: "ads_account_id,meta_campaign_id" }).select("id").single();
        if (error) throw error;
        campaignMap.set(item.id, data.id);
      }

      const adsetMap = new Map<string, string>();
      for (const item of adsets) {
        const { data, error } = await db.from("ads_adsets").upsert({
          ads_account_id: account.id,
          ads_campaign_id: campaignMap.get(item.campaign_id) || null,
          meta_adset_id: item.id,
          name: item.name,
          status: item.status,
          effective_status: item.effective_status,
          start_time: item.start_time || null,
          end_time: item.end_time || null,
          synced_at: totals.synced_at,
        }, { onConflict: "ads_account_id,meta_adset_id" }).select("id").single();
        if (error) throw error;
        adsetMap.set(item.id, data.id);
      }

      for (const item of ads) {
        const { error } = await db.from("ads_ads").upsert({
          ads_account_id: account.id,
          ads_campaign_id: campaignMap.get(item.campaign_id) || null,
          ads_adset_id: adsetMap.get(item.adset_id) || null,
          meta_ad_id: item.id,
          name: item.name,
          status: item.status,
          effective_status: item.effective_status,
          synced_at: totals.synced_at,
        }, { onConflict: "ads_account_id,meta_ad_id" });
        if (error) throw error;
      }

      totals.campaigns += campaigns.length;
      totals.adsets += adsets.length;
      totals.ads += ads.length;
    }

    return json({ success: true, ...totals });
  } catch (error) {
    console.error("Meta Ads status sync failed", error);
    return json({ success: false, error: errorMessage(error) });
  }
});
