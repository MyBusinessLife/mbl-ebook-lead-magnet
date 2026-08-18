alter table public.ads_leads
  add column if not exists appointment_at timestamptz;

create index if not exists ads_leads_appointment_at_idx
on public.ads_leads (appointment_at);
