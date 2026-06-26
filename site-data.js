(function () {
  const CONFIG = window.MBL_SUPABASE || {};
  const GA_MEASUREMENT_ID = String(window.MBL_GA_MEASUREMENT_ID || CONFIG.googleAnalyticsId || "").trim();
  const GTM_CONTAINER_ID = String(window.MBL_GTM_ID || CONFIG.googleTagManagerId || "").trim();
  const SITE_NAME = "MY BUSINESS LIFE";
  const STORAGE_KEYS = {
    visitor: "mbl_visitor_id",
    session: "mbl_session_id",
  };
  const CONSENT_KEY = "mbl_cookie_consent_v3";
  let googleAnalyticsReady = false;
  let googleTagManagerReady = false;
  let googleConsentInitialized = false;

  const readStoredConsent = () => {
    try {
      const raw = window.localStorage.getItem(CONSENT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  };

  if (!window.mblConsent) {
    const storedConsent = readStoredConsent();
    window.mblConsent = {
      essential: true,
      analytics: Boolean(storedConsent?.analytics),
      marketing: Boolean(storedConsent?.marketing),
      savedAt: storedConsent?.savedAt || null,
    };
  }

  const isConfigured = () =>
    Boolean(CONFIG.enabled && CONFIG.url && CONFIG.anonKey && /^https?:\/\//.test(CONFIG.url));

  const hasGoogleAnalytics = () => /^G-[A-Z0-9]+$/i.test(GA_MEASUREMENT_ID);

  const hasGoogleTagManager = () => /^GTM-[A-Z0-9]+$/i.test(GTM_CONTAINER_ID);

  const ensureGoogleRuntime = () => {
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function () {
        window.dataLayer.push(arguments);
      };

    if (!googleConsentInitialized) {
      window.gtag("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      googleConsentInitialized = true;
    }
  };

  const ensureGoogleAnalytics = () => {
    if (googleAnalyticsReady || !hasGoogleAnalytics()) return false;

    ensureGoogleRuntime();

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
    document.head.appendChild(script);

    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      send_page_view: false,
    });

    googleAnalyticsReady = true;
    return true;
  };

  const ensureGoogleTagManager = () => {
    if (googleTagManagerReady || !hasGoogleTagManager()) return false;

    ensureGoogleRuntime();
    window.dataLayer.push({
      event: "gtm.js",
      "gtm.start": new Date().getTime(),
    });

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_CONTAINER_ID)}`;
    document.head.appendChild(script);

    googleTagManagerReady = true;
    return true;
  };

  const updateGoogleConsent = (consent) => {
    if (!hasGoogleAnalytics() && !hasGoogleTagManager()) return;

    ensureGoogleRuntime();

    if (consent?.analytics) {
      window.gtag?.("consent", "update", {
        analytics_storage: "granted",
        ad_storage: consent.marketing ? "granted" : "denied",
        ad_user_data: consent.marketing ? "granted" : "denied",
        ad_personalization: consent.marketing ? "granted" : "denied",
      });
      ensureGoogleTagManager();
      ensureGoogleAnalytics();
      return;
    }

    window.gtag?.("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  };

  const sendGoogleAnalyticsEvent = (eventName, metadata) => {
    if (!window.mblConsent?.analytics || (!hasGoogleAnalytics() && !hasGoogleTagManager())) return;

    updateGoogleConsent(window.mblConsent);
    const eventPayload = {
      page_title: document.title || SITE_NAME,
      page_location: window.location.href,
      page_path: normalizePath(),
      ...(metadata || {}),
    };

    if (hasGoogleTagManager()) {
      window.dataLayer?.push({
        event: eventName,
        ...eventPayload,
      });
    }

    if (hasGoogleAnalytics()) {
      window.gtag?.("event", eventName, eventPayload);
    }
  };

  const normalizePath = () => {
    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    const search = new URLSearchParams(window.location.search);
    const kept = new URLSearchParams();

    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((key) => {
      const value = search.get(key);
      if (value) kept.set(key, value);
    });

    const query = kept.toString();
    return query ? `${path}?${query}` : path;
  };

  const getUtm = () => {
    const search = new URLSearchParams(window.location.search);
    return ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].reduce((values, key) => {
      const value = search.get(key);
      if (value) values[key] = value.slice(0, 180);
      return values;
    }, {});
  };

  const safeReferrer = () => {
    if (!document.referrer) return "";

    try {
      const url = new URL(document.referrer);
      return `${url.origin}${url.pathname}`.slice(0, 500);
    } catch (error) {
      return "";
    }
  };

  const getStorageId = (storage, key) => {
    try {
      const current = storage.getItem(key);
      if (current) return current;

      const next =
        window.crypto && window.crypto.randomUUID
          ? window.crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      storage.setItem(key, next);
      return next;
    } catch (error) {
      return "";
    }
  };

  const restInsert = async (table, payload) => {
    if (!isConfigured()) return { ok: false, skipped: true };

    const response = await fetch(`${CONFIG.url.replace(/\/+$/, "")}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: CONFIG.anonKey,
        Authorization: `Bearer ${CONFIG.anonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Supabase insert failed for ${table}`);
    }

    return { ok: true };
  };

  const firstPartySignal = async (payload) => {
    const response = await fetch("/api/pulse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });

    if (!response.ok) throw new Error("First-party signal failed");
    return response.json().catch(() => ({ ok: true }));
  };

  const pageContext = () => ({
    page_path: normalizePath(),
    page_title: document.title || SITE_NAME,
  });
  let pageViewTracked = false;

  const trackEvent = async (eventType, metadata) => {
    if (!window.mblConsent?.analytics) return { ok: false, skipped: true };

    const sessionId = getStorageId(window.sessionStorage, STORAGE_KEYS.session);
    const visitorId = getStorageId(window.localStorage, STORAGE_KEYS.visitor);
    const payload = {
      event_type: eventType,
      path: normalizePath(),
      page_title: document.title || SITE_NAME,
      referrer: safeReferrer(),
      session_id: sessionId,
      visitor_id: visitorId,
      utm: getUtm(),
      metadata: metadata || {},
    };

    firstPartySignal(payload).catch(() => {});
    return restInsert("analytics_events", payload);
  };

  const mapCommonLead = (payload) => ({
    source: payload.source || "site-vitrine",
    page_path: payload.path || payload.page_path || normalizePath(),
    page_title: payload.page || payload.page_title || document.title || SITE_NAME,
    name: payload.nom || payload.name || null,
    email: payload.email,
    phone: payload.telephone || payload.phone || null,
    profile: payload.profil || payload.profile || null,
    need: payload.besoin || payload.need || null,
    message: payload.message || null,
    payload,
  });

  const submitContact = async (payload) => {
    if (!payload?.email) throw new Error("Email is required");

    const result = await restInsert("contact_requests", mapCommonLead(payload));
    sendGoogleAnalyticsEvent("generate_lead", {
      form_source: payload.source || "site-vitrine",
      need: payload.besoin || payload.need || "",
    });
    trackEvent("form_submit", {
      source: payload.source || "site-vitrine",
      hasEmail: Boolean(payload.email),
      need: payload.besoin || payload.need || "",
    }).catch(() => {});
    return result;
  };

  const submitDiagnostic = async (payload) => {
    if (!payload?.email) throw new Error("Email is required");

    const result = await restInsert("diagnostic_requests", {
      source: payload.source || "diagnostic-premium",
      page_path: payload.path || payload.page_path || normalizePath(),
      page_title: payload.page || payload.page_title || document.title || SITE_NAME,
      name: payload.nom || payload.name || null,
      email: payload.email,
      phone: payload.telephone || payload.phone || null,
      profile: payload.profil || payload.profile || null,
      need: payload.besoin || payload.need || null,
      summary: payload.synthese || payload.summary || null,
      answers: payload.reponses || payload.answers || {},
      message: payload.message || null,
      payload,
    });

    sendGoogleAnalyticsEvent("diagnostic_submit", {
      form_source: payload.source || "diagnostic-premium",
      need: payload.besoin || payload.need || "",
      summary: payload.synthese || payload.summary || "",
    });
    trackEvent("diagnostic_submit", {
      source: payload.source || "diagnostic-premium",
      need: payload.besoin || payload.need || "",
      summary: payload.synthese || payload.summary || "",
    }).catch(() => {});
    return result;
  };

  const trackPageView = () => {
    if (pageViewTracked) return;
    pageViewTracked = true;
    sendGoogleAnalyticsEvent("page_view", {
      page_title: document.title || SITE_NAME,
      page_location: window.location.href,
      page_path: normalizePath(),
    });
    trackEvent("page_view").catch(() => {});
  };

  window.MBLData = {
    isConfigured,
    pageContext,
    submitContact,
    submitDiagnostic,
    trackGoogleEvent: sendGoogleAnalyticsEvent,
    trackEvent,
    trackPageView,
  };

  if (window.mblConsent?.analytics) {
    updateGoogleConsent(window.mblConsent);
    trackPageView();
  }

  window.addEventListener("mbl:cookie-consent", (event) => {
    updateGoogleConsent(event.detail);
    if (event.detail?.analytics) trackPageView();
  });
})();
