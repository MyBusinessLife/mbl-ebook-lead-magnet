create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'admin' check (role in ('owner', 'admin')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  role text not null default 'client' check (role in ('client', 'pending', 'viewer', 'editor', 'admin', 'owner')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_profiles_role_idx on public.user_profiles (role);
create index if not exists user_profiles_active_idx on public.user_profiles (active);

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

create table if not exists public.prospect_projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'draft' check (status in ('draft', 'sent', 'viewed', 'accepted', 'refused', 'archived')),
  source_type text not null default 'manual' check (source_type in ('manual', 'contact', 'diagnostic')),
  source_request_id uuid,
  public_ref text not null unique default lower(substr(replace(gen_random_uuid()::text, '-', ''), 1, 16)),
  client_name text,
  client_email text,
  client_company text,
  client_phone text,
  project_title text not null,
  service_line text,
  short_pitch text,
  client_context text,
  objectives text,
  solution_overview text,
  scope_details text,
  deliverables text,
  rollout_plan text,
  timeline_notes text,
  collaboration_notes text,
  next_step text,
  admin_notes text,
  payload jsonb not null default '{}'::jsonb,
  sent_at timestamptz,
  viewed_at timestamptz,
  responded_at timestamptz
);

create index if not exists prospect_projects_created_at_idx on public.prospect_projects (created_at desc);
create index if not exists prospect_projects_status_idx on public.prospect_projects (status);
create index if not exists prospect_projects_client_email_idx on public.prospect_projects (lower(client_email));
create index if not exists prospect_projects_public_ref_idx on public.prospect_projects (public_ref);
create index if not exists prospect_projects_source_idx on public.prospect_projects (source_type, source_request_id);

create or replace function public.current_user_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role
  from (
    select role, 1 as priority
    from public.user_profiles
    where user_id = auth.uid()
      and active = true

    union all

    select role, 2 as priority
    from public.admin_users
    where user_id = auth.uid()
      and active = true
  ) roles
  order by priority
  limit 1;
$$;

create or replace function public.has_admin_role(allowed_roles text[])
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(public.current_user_role() = any(allowed_roles), false);
$$;

create or replace function public.can_view_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.has_admin_role(array['owner', 'admin', 'editor', 'viewer']);
$$;

create or replace function public.can_edit_requests()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.has_admin_role(array['owner', 'admin', 'editor']);
$$;

create or replace function public.can_manage_users()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.has_admin_role(array['owner', 'admin']);
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.has_admin_role(array['owner', 'admin']);
$$;

create or replace function public.is_owner()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.has_admin_role(array['owner']);
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

create or replace function public.set_profile_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
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

  if new.status = 'draft' then
    new.sent_at = null;
    new.viewed_at = null;
    new.responded_at = null;
  end if;

  return new;
end;
$$;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (user_id, email, display_name, role, active)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data->>'display_name', ''),
    'client',
    true
  )
  on conflict (user_id) do update
  set
    email = excluded.email,
    display_name = coalesce(public.user_profiles.display_name, excluded.display_name),
    updated_at = now();

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

drop trigger if exists set_user_profiles_updated_at on public.user_profiles;
create trigger set_user_profiles_updated_at
before update on public.user_profiles
for each row execute function public.set_profile_updated_at();

drop trigger if exists set_prospect_projects_updated_at on public.prospect_projects;
create trigger set_prospect_projects_updated_at
before update on public.prospect_projects
for each row execute function public.set_prospect_project_updated_at();

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();

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

create or replace function public.get_public_prospect_project(p_ref text)
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  project_row public.prospect_projects%rowtype;
begin
  select *
  into project_row
  from public.prospect_projects
  where public_ref = p_ref
  limit 1;

  if project_row.id is null then
    return null;
  end if;

  return jsonb_build_object(
    'id', project_row.id,
    'public_ref', project_row.public_ref,
    'status', project_row.status,
    'created_at', project_row.created_at,
    'updated_at', project_row.updated_at,
    'client_name', project_row.client_name,
    'client_email', project_row.client_email,
    'client_company', project_row.client_company,
    'project_title', project_row.project_title,
    'service_line', project_row.service_line,
    'short_pitch', project_row.short_pitch,
    'client_context', project_row.client_context,
    'objectives', project_row.objectives,
    'solution_overview', project_row.solution_overview,
    'scope_details', project_row.scope_details,
    'deliverables', project_row.deliverables,
    'rollout_plan', project_row.rollout_plan,
    'timeline_notes', project_row.timeline_notes,
    'collaboration_notes', project_row.collaboration_notes,
    'next_step', project_row.next_step,
    'payload', project_row.payload
  );
end;
$$;

create or replace function public.mark_public_prospect_project_view(p_ref text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.prospect_projects
  set
    viewed_at = coalesce(viewed_at, now()),
    status = case when status = 'sent' then 'viewed' else status end,
    updated_at = now()
  where public_ref = p_ref;
end;
$$;

insert into public.user_profiles (user_id, email, role, active)
select user_id, email, role, active
from public.admin_users
on conflict (user_id) do update
set
  email = excluded.email,
  role = excluded.role,
  active = excluded.active,
  updated_at = now();

alter table public.admin_users enable row level security;
alter table public.user_profiles enable row level security;
alter table public.analytics_events enable row level security;
alter table public.contact_requests enable row level security;
alter table public.diagnostic_requests enable row level security;
alter table public.prospect_projects enable row level security;

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

drop policy if exists "Users can read own profile" on public.user_profiles;
create policy "Users can read own profile"
on public.user_profiles
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Admins can read user profiles" on public.user_profiles;
create policy "Admins can read user profiles"
on public.user_profiles
for select
to authenticated
using (public.can_manage_users());

drop policy if exists "Admins can update user profiles" on public.user_profiles;
create policy "Admins can update user profiles"
on public.user_profiles
for update
to authenticated
using (public.can_manage_users())
with check (public.can_manage_users());

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
using (public.can_view_admin());

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
drop policy if exists "Dashboard roles can read contact requests" on public.contact_requests;
create policy "Dashboard roles can read contact requests"
on public.contact_requests
for select
to authenticated
using (public.can_view_admin());

drop policy if exists "Clients can read own contact requests" on public.contact_requests;
create policy "Clients can read own contact requests"
on public.contact_requests
for select
to authenticated
using (lower(email) = lower(coalesce(auth.jwt()->>'email', '')));

drop policy if exists "Editors can update contact requests" on public.contact_requests;
create policy "Editors can update contact requests"
on public.contact_requests
for update
to authenticated
using (public.can_edit_requests())
with check (public.can_edit_requests());

drop policy if exists "Editors can delete contact requests" on public.contact_requests;
create policy "Editors can delete contact requests"
on public.contact_requests
for delete
to authenticated
using (public.can_edit_requests());

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
drop policy if exists "Dashboard roles can read diagnostic requests" on public.diagnostic_requests;
create policy "Dashboard roles can read diagnostic requests"
on public.diagnostic_requests
for select
to authenticated
using (public.can_view_admin());

drop policy if exists "Clients can read own diagnostic requests" on public.diagnostic_requests;
create policy "Clients can read own diagnostic requests"
on public.diagnostic_requests
for select
to authenticated
using (lower(email) = lower(coalesce(auth.jwt()->>'email', '')));

drop policy if exists "Editors can update diagnostic requests" on public.diagnostic_requests;
create policy "Editors can update diagnostic requests"
on public.diagnostic_requests
for update
to authenticated
using (public.can_edit_requests())
with check (public.can_edit_requests());

drop policy if exists "Editors can delete diagnostic requests" on public.diagnostic_requests;
create policy "Editors can delete diagnostic requests"
on public.diagnostic_requests
for delete
to authenticated
using (public.can_edit_requests());

drop policy if exists "Dashboard roles can read prospect projects" on public.prospect_projects;
create policy "Dashboard roles can read prospect projects"
on public.prospect_projects
for select
to authenticated
using (public.can_view_admin());

drop policy if exists "Clients can read own prospect projects" on public.prospect_projects;
create policy "Clients can read own prospect projects"
on public.prospect_projects
for select
to authenticated
using (lower(coalesce(client_email, '')) = lower(coalesce(auth.jwt()->>'email', '')));

drop policy if exists "Editors can create prospect projects" on public.prospect_projects;
create policy "Editors can create prospect projects"
on public.prospect_projects
for insert
to authenticated
with check (public.can_edit_requests());

drop policy if exists "Editors can update prospect projects" on public.prospect_projects;
create policy "Editors can update prospect projects"
on public.prospect_projects
for update
to authenticated
using (public.can_edit_requests())
with check (public.can_edit_requests());

drop policy if exists "Editors can delete prospect projects" on public.prospect_projects;
create policy "Editors can delete prospect projects"
on public.prospect_projects
for delete
to authenticated
using (public.can_edit_requests());

grant usage on schema public to anon, authenticated;
grant insert on public.analytics_events to anon, authenticated;
grant insert on public.contact_requests to anon, authenticated;
grant insert on public.diagnostic_requests to anon, authenticated;
grant select on public.analytics_events to authenticated;
grant select, update, delete on public.contact_requests to authenticated;
grant select, update, delete on public.diagnostic_requests to authenticated;
grant select, insert, update, delete on public.prospect_projects to authenticated;
grant select, insert, update, delete on public.admin_users to authenticated;
grant select, update on public.user_profiles to authenticated;
grant execute on function public.get_admin_dashboard(integer) to authenticated;
grant execute on function public.get_public_prospect_project(text) to anon, authenticated;
grant execute on function public.mark_public_prospect_project_view(text) to anon, authenticated;
grant execute on function public.current_user_role() to authenticated;
grant execute on function public.has_admin_role(text[]) to authenticated;
grant execute on function public.can_view_admin() to authenticated;
grant execute on function public.can_edit_requests() to authenticated;
grant execute on function public.can_manage_users() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_owner() to authenticated;

-- After creating your first admin in Supabase Auth, replace the email and run:
-- insert into public.admin_users (user_id, email, role)
-- select id, email, 'owner'
-- from auth.users
-- where email = 'admin@mybusinesslife.fr'
-- on conflict (user_id) do update set role = excluded.role, active = true;
