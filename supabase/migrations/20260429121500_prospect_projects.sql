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
    'next_step', project_row.next_step
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

drop trigger if exists set_prospect_projects_updated_at on public.prospect_projects;
create trigger set_prospect_projects_updated_at
before update on public.prospect_projects
for each row execute function public.set_prospect_project_updated_at();

alter table public.prospect_projects enable row level security;

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

grant select, insert, update, delete on public.prospect_projects to authenticated;
grant execute on function public.get_public_prospect_project(text) to anon, authenticated;
grant execute on function public.mark_public_prospect_project_view(text) to anon, authenticated;
