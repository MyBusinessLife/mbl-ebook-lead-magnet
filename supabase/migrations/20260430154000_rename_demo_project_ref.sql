update public.prospect_projects
set
  public_ref = 'new-pare-brise-phase-1-demo',
  updated_at = now()
where public_ref = 'carrosserie-phase1-demo';
