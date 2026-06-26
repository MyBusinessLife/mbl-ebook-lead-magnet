create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  role text not null default 'pending' check (role in ('pending', 'viewer', 'editor', 'admin', 'owner')),
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_profiles_role_idx on public.user_profiles (role);
create index if not exists user_profiles_active_idx on public.user_profiles (active);

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

create or replace function public.set_profile_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
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
    'pending',
    false
  )
  on conflict (user_id) do update
  set
    email = excluded.email,
    display_name = coalesce(public.user_profiles.display_name, excluded.display_name),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists set_user_profiles_updated_at on public.user_profiles;
create trigger set_user_profiles_updated_at
before update on public.user_profiles
for each row execute function public.set_profile_updated_at();

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

insert into public.user_profiles (user_id, email, role, active)
select user_id, email, role, active
from public.admin_users
on conflict (user_id) do update
set
  email = excluded.email,
  role = excluded.role,
  active = excluded.active,
  updated_at = now();

alter table public.user_profiles enable row level security;

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

drop policy if exists "Admins can read analytics events" on public.analytics_events;
create policy "Admins can read analytics events"
on public.analytics_events
for select
to authenticated
using (public.can_view_admin());

drop policy if exists "Admins can manage contact requests" on public.contact_requests;
drop policy if exists "Dashboard roles can read contact requests" on public.contact_requests;
create policy "Dashboard roles can read contact requests"
on public.contact_requests
for select
to authenticated
using (public.can_view_admin());

drop policy if exists "Editors can update contact requests" on public.contact_requests;
create policy "Editors can update contact requests"
on public.contact_requests
for update
to authenticated
using (public.can_edit_requests())
with check (public.can_edit_requests());

drop policy if exists "Admins can manage diagnostic requests" on public.diagnostic_requests;
drop policy if exists "Dashboard roles can read diagnostic requests" on public.diagnostic_requests;
create policy "Dashboard roles can read diagnostic requests"
on public.diagnostic_requests
for select
to authenticated
using (public.can_view_admin());

drop policy if exists "Editors can update diagnostic requests" on public.diagnostic_requests;
create policy "Editors can update diagnostic requests"
on public.diagnostic_requests
for update
to authenticated
using (public.can_edit_requests())
with check (public.can_edit_requests());

grant select, update on public.user_profiles to authenticated;
grant execute on function public.current_user_role() to authenticated;
grant execute on function public.has_admin_role(text[]) to authenticated;
grant execute on function public.can_view_admin() to authenticated;
grant execute on function public.can_edit_requests() to authenticated;
grant execute on function public.can_manage_users() to authenticated;
