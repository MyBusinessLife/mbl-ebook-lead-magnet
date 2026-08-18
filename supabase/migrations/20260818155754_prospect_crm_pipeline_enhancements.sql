alter table public.contact_requests
drop constraint if exists contact_requests_status_check;

alter table public.contact_requests
add constraint contact_requests_status_check
check (status in ('new', 'in_progress', 'no_response', 'won', 'lost', 'archived'));

alter table public.diagnostic_requests
drop constraint if exists diagnostic_requests_status_check;

alter table public.diagnostic_requests
add constraint diagnostic_requests_status_check
check (status in ('new', 'in_progress', 'no_response', 'won', 'lost', 'archived'));

alter table public.prospect_projects
add column if not exists crm_stage text not null default 'new'
  check (crm_stage in ('new', 'proposal_sent', 'follow_up', 'no_response', 'negotiation', 'won', 'lost')),
add column if not exists deal_probability integer not null default 15
  check (deal_probability >= 0 and deal_probability <= 100),
add column if not exists estimated_value numeric(12,2),
add column if not exists lead_temperature text not null default 'warm'
  check (lead_temperature in ('cold', 'warm', 'hot')),
add column if not exists follow_up_at timestamptz,
add column if not exists appointment_at timestamptz,
add column if not exists last_contacted_at timestamptz;

create index if not exists prospect_projects_crm_stage_idx on public.prospect_projects (crm_stage);
create index if not exists prospect_projects_follow_up_at_idx on public.prospect_projects (follow_up_at);
create index if not exists prospect_projects_appointment_at_idx on public.prospect_projects (appointment_at);

update public.prospect_projects
set
  crm_stage = case
    when status = 'accepted' then 'won'
    when status in ('refused', 'archived') then 'lost'
    when status = 'viewed' then 'follow_up'
    when status = 'sent' then 'proposal_sent'
    else 'new'
  end,
  deal_probability = case
    when status = 'accepted' then 100
    when status in ('refused', 'archived') then 0
    when status = 'viewed' then greatest(coalesce(deal_probability, 15), 45)
    when status = 'sent' then greatest(coalesce(deal_probability, 15), 30)
    else coalesce(deal_probability, 15)
  end,
  lead_temperature = case
    when status = 'accepted' then 'hot'
    when status in ('refused', 'archived') then 'cold'
    when status = 'viewed' then 'hot'
    when status = 'sent' then 'warm'
    else coalesce(lead_temperature, 'warm')
  end
where true;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();

  if new.status <> old.status and new.status in ('won', 'lost', 'archived') then
    new.handled_at = coalesce(new.handled_at, now());
  elsif new.status in ('new', 'in_progress', 'no_response') then
    new.handled_at = null;
  end if;

  return new;
end;
$$;

create or replace function public.set_prospect_project_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();

  if new.status = 'sent' and coalesce(old.status, '') <> 'sent' then
    new.sent_at = coalesce(new.sent_at, now());
  end if;

  if new.status = 'viewed' and coalesce(old.status, '') <> 'viewed' then
    new.viewed_at = coalesce(new.viewed_at, now());
  end if;

  if new.status in ('accepted', 'refused', 'archived') and coalesce(old.status, '') <> new.status then
    new.responded_at = coalesce(new.responded_at, now());
  end if;

  if new.crm_stage in ('won', 'lost') and coalesce(old.crm_stage, '') <> new.crm_stage then
    new.responded_at = coalesce(new.responded_at, now());
  end if;

  if new.status = 'draft' then
    new.sent_at = null;
    new.viewed_at = null;
    new.responded_at = null;
  end if;

  return new;
end;
$$;

create or replace function public.get_admin_dashboard(p_days integer default 30)
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  since_date timestamptz := now() - make_interval(days => greatest(1, least(coalesce(p_days, 30), 365)));
begin
  if not public.can_view_admin() then
    raise exception 'not authorized';
  end if;

  return jsonb_build_object(
    'summary', jsonb_build_object(
      'pageviews', (
        select count(*)
        from public.analytics_events
        where event_type = 'page_view'
          and created_at >= since_date
      ),
      'sessions', (
        select count(distinct session_id)
        from public.analytics_events
        where event_type = 'page_view'
          and created_at >= since_date
          and session_id is not null
      ),
      'contactRequests', (
        select count(*)
        from public.contact_requests
        where created_at >= since_date
      ),
      'diagnosticRequests', (
        select count(*)
        from public.diagnostic_requests
        where created_at >= since_date
      ),
      'openRequests', (
        select count(*)
        from (
          select status from public.contact_requests where status in ('new', 'in_progress', 'no_response')
          union all
          select status from public.diagnostic_requests where status in ('new', 'in_progress', 'no_response')
        ) open_items
      )
    ),
    'daily', (
      select coalesce(jsonb_agg(row_to_json(day_rows)), '[]'::jsonb)
      from (
        select
          date_trunc('day', created_at)::date as day,
          count(*) filter (where event_type = 'page_view') as pageviews,
          count(distinct session_id) filter (where event_type = 'page_view' and session_id is not null) as sessions,
          count(*) filter (where event_type in ('form_submit', 'diagnostic_submit')) as conversions
        from public.analytics_events
        where created_at >= since_date
        group by 1
        order by 1
      ) day_rows
    ),
    'topPages', (
      select coalesce(jsonb_agg(row_to_json(page_rows)), '[]'::jsonb)
      from (
        select
          path,
          max(page_title) as page_title,
          count(*) as pageviews,
          count(distinct session_id) as sessions
        from public.analytics_events
        where event_type = 'page_view'
          and created_at >= since_date
        group by path
        order by pageviews desc, path asc
        limit 10
      ) page_rows
    )
  );
end;
$$;
