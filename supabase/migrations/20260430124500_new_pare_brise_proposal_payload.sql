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

update public.prospect_projects
set
  client_name = 'Équipe NEW PARE BRISE',
  client_company = 'NEW PARE BRISE',
  short_pitch = 'Construire un logiciel web métier pour supprimer le papier terrain, centraliser les dossiers vitrage et accélérer toute la chaîne commerciale et agence.',
  payload = jsonb_build_object(
    'pdf_filename', 'proposition-new-pare-brise-phase-1.pdf',
    'branding', jsonb_build_object(
      'companyName', 'NEW PARE BRISE',
      'tagline', 'Remplacement vitrage automobile',
      'accent', '#f58b2a',
      'accentStrong', '#ff7a00',
      'surface', '#161616',
      'surfaceSoft', '#232323',
      'text', '#fff4ea',
      'muted', 'rgba(255, 244, 234, 0.72)',
      'grid', 'rgba(245, 139, 42, 0.10)'
    ),
    'mockups', jsonb_build_array(
      jsonb_build_object(
        'title', 'Vue commerciale terrain',
        'subtitle', 'Ouverture d''un dossier client depuis mobile ou tablette',
        'eyebrow', 'Mockup 01',
        'badges', jsonb_build_array('Client', 'Véhicule', 'Assurance', 'Signature'),
        'metrics', jsonb_build_array(
          jsonb_build_object('value', '15 min', 'label', 'pour ouvrir et qualifier un dossier'),
          jsonb_build_object('value', '0 papier', 'label', 'sur le terrain'),
          jsonb_build_object('value', 'Temps réel', 'label', 'remontée immédiate en agence')
        ),
        'modules', jsonb_build_array(
          jsonb_build_object('label', 'Fiche client', 'value', 'Coordonnées, véhicule, assurance'),
          jsonb_build_object('label', 'Pièces jointes', 'value', 'Carte grise, RIB, photos, scan'),
          jsonb_build_object('label', 'Validation', 'value', 'Signature électronique et envoi agence')
        ),
        'note', 'L''objectif est de rendre la création de dossier fluide, rapide et fiable dès la première interaction avec le client.'
      ),
      jsonb_build_object(
        'title', 'Vue agence / back-office',
        'subtitle', 'Pilotage des dossiers vitrage et génération des documents',
        'eyebrow', 'Mockup 02',
        'badges', jsonb_build_array('Dossiers', 'OR', 'Devis', 'Archivage'),
        'metrics', jsonb_build_array(
          jsonb_build_object('value', '1 vue', 'label', 'sur tous les dossiers en cours'),
          jsonb_build_object('value', 'OR auto', 'label', 'génération accélérée'),
          jsonb_build_object('value', 'Fiable', 'label', 'moins de ressaisies et d''oubli')
        ),
        'modules', jsonb_build_array(
          jsonb_build_object('label', 'Suivi temps réel', 'value', 'Statut du dossier, pièces reçues, priorités'),
          jsonb_build_object('label', 'Documents', 'value', 'OR, devis, documents contractuels'),
          jsonb_build_object('label', 'Coordination', 'value', 'Agence, terrain et administratif alignés')
        ),
        'note', 'Cette vue pose les bases d''un outil agence capable d''industrialiser le suivi tout en restant simple à prendre en main.'
      )
    )
  ),
  updated_at = now()
where public_ref = 'carrosserie-phase1-demo';
