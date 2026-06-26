create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'admin' check (role in ('owner', 'admin')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_type text not null default 'page_view' check (event_type in ('page_view', 'cta_click', 'form_submit', 'diagnostic_submit')),
  path text not null,
  page_title text,
  referrer text,
  session_id text,
  visitor_id text,
  utm jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists analytics_events_created_at_idx on public.analytics_events (created_at desc);
create index if not exists analytics_events_path_idx on public.analytics_events (path);
create index if not exists analytics_events_event_type_idx on public.analytics_events (event_type);
create index if not exists analytics_events_session_id_idx on public.analytics_events (session_id);

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'in_progress', 'won', 'lost', 'archived')),
  source text not null default 'site-vitrine',
  page_path text,
  page_title text,
  name text,
  email text not null,
  phone text,
  profile text,
  need text,
  message text,
  payload jsonb not null default '{}'::jsonb,
  admin_notes text,
  handled_at timestamptz
);

create index if not exists contact_requests_created_at_idx on public.contact_requests (created_at desc);
create index if not exists contact_requests_status_idx on public.contact_requests (status);
create index if not exists contact_requests_email_idx on public.contact_requests (lower(email));

create table if not exists public.diagnostic_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'in_progress', 'won', 'lost', 'archived')),
  source text not null default 'diagnostic-premium',
  page_path text,
  page_title text,
  name text,
  email text not null,
  phone text,
  profile text,
  need text,
  summary text,
  answers jsonb not null default '{}'::jsonb,
  message text,
  payload jsonb not null default '{}'::jsonb,
  admin_notes text,
  handled_at timestamptz
);

create index if not exists diagnostic_requests_created_at_idx on public.diagnostic_requests (created_at desc);
create index if not exists diagnostic_requests_status_idx on public.diagnostic_requests (status);
create index if not exists diagnostic_requests_email_idx on public.diagnostic_requests (lower(email));

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and active = true
      and role in ('owner', 'admin')
  );
$$;

create or replace function public.is_owner()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and active = true
      and role = 'owner'
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();

  if new.status <> old.status and new.status in ('won', 'lost', 'archived') then
    new.handled_at = coalesce(new.handled_at, now());
  elsif new.status in ('new', 'in_progress') then
    new.handled_at = null;
  end if;

  return new;
end;
$$;

drop trigger if exists set_contact_requests_updated_at on public.contact_requests;
create trigger set_contact_requests_updated_at
before update on public.contact_requests
for each row execute function public.set_updated_at();

drop trigger if exists set_diagnostic_requests_updated_at on public.diagnostic_requests;
create trigger set_diagnostic_requests_updated_at
before update on public.diagnostic_requests
for each row execute function public.set_updated_at();

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
  if not public.is_admin() then
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
          select status from public.contact_requests where status in ('new', 'in_progress')
          union all
          select status from public.diagnostic_requests where status in ('new', 'in_progress')
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

alter table public.admin_users enable row level security;
alter table public.analytics_events enable row level security;
alter table public.contact_requests enable row level security;
alter table public.diagnostic_requests enable row level security;

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
on public.admin_users
for select
to authenticated
using (public.is_admin());

drop policy if exists "Owners can manage admin users" on public.admin_users;
create policy "Owners can manage admin users"
on public.admin_users
for all
to authenticated
using (public.is_owner())
with check (public.is_owner());

drop policy if exists "Public can insert analytics events" on public.analytics_events;
create policy "Public can insert analytics events"
on public.analytics_events
for insert
to anon, authenticated
with check (created_at <= now() + interval '5 minutes');

drop policy if exists "Admins can read analytics events" on public.analytics_events;
create policy "Admins can read analytics events"
on public.analytics_events
for select
to authenticated
using (public.is_admin());

drop policy if exists "Public can create contact requests" on public.contact_requests;
create policy "Public can create contact requests"
on public.contact_requests
for insert
to anon, authenticated
with check (
  status = 'new'
  and admin_notes is null
  and handled_at is null
  and created_at <= now() + interval '5 minutes'
  and updated_at <= now() + interval '5 minutes'
);

drop policy if exists "Admins can manage contact requests" on public.contact_requests;
create policy "Admins can manage contact requests"
on public.contact_requests
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can create diagnostic requests" on public.diagnostic_requests;
create policy "Public can create diagnostic requests"
on public.diagnostic_requests
for insert
to anon, authenticated
with check (
  status = 'new'
  and admin_notes is null
  and handled_at is null
  and created_at <= now() + interval '5 minutes'
  and updated_at <= now() + interval '5 minutes'
);

drop policy if exists "Admins can manage diagnostic requests" on public.diagnostic_requests;
create policy "Admins can manage diagnostic requests"
on public.diagnostic_requests
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

grant usage on schema public to anon, authenticated;
grant insert on public.analytics_events to anon, authenticated;
grant insert on public.contact_requests to anon, authenticated;
grant insert on public.diagnostic_requests to anon, authenticated;
grant select on public.analytics_events to authenticated;
grant select, update on public.contact_requests to authenticated;
grant select, update on public.diagnostic_requests to authenticated;
grant select, insert, update, delete on public.admin_users to authenticated;
grant execute on function public.get_admin_dashboard(integer) to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_owner() to authenticated;

-- After creating your first admin in Supabase Auth, replace the email and run:
-- insert into public.admin_users (user_id, email, role)
-- select id, email, 'owner'
-- from auth.users
-- where email = 'admin@mybusinesslife.fr'
-- on conflict (user_id) do update set role = excluded.role, active = true;
