drop policy if exists "Editors can delete contact requests" on public.contact_requests;
create policy "Editors can delete contact requests"
on public.contact_requests
for delete
to authenticated
using (public.can_edit_requests());

drop policy if exists "Editors can delete diagnostic requests" on public.diagnostic_requests;
create policy "Editors can delete diagnostic requests"
on public.diagnostic_requests
for delete
to authenticated
using (public.can_edit_requests());

grant delete on public.contact_requests to authenticated;
grant delete on public.diagnostic_requests to authenticated;
