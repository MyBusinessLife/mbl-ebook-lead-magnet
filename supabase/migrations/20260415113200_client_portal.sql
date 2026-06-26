alter table public.user_profiles
drop constraint if exists user_profiles_role_check;

alter table public.user_profiles
add constraint user_profiles_role_check
check (role in ('client', 'pending', 'viewer', 'editor', 'admin', 'owner'));

alter table public.user_profiles
alter column role set default 'client';

alter table public.user_profiles
alter column active set default true;

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

drop policy if exists "Clients can read own contact requests" on public.contact_requests;
create policy "Clients can read own contact requests"
on public.contact_requests
for select
to authenticated
using (lower(email) = lower(coalesce(auth.jwt()->>'email', '')));

drop policy if exists "Clients can read own diagnostic requests" on public.diagnostic_requests;
create policy "Clients can read own diagnostic requests"
on public.diagnostic_requests
for select
to authenticated
using (lower(email) = lower(coalesce(auth.jwt()->>'email', '')));
