update public.prospect_projects
set
  payload = coalesce(payload, '{}'::jsonb) || jsonb_build_object(
    'development_phases',
    'Phase 0 — Cadrage détaillé (1 à 2 semaines) : ateliers métier, arbitrages fonctionnels et validation du périmètre prioritaire
Phase 1 — UX / UI et prototype (1 à 2 semaines) : parcours terrain, structure des dossiers et validation des écrans clés
Phase 2 — Développement du socle (4 à 6 semaines) : acquisition terrain, back-office agence, documents et base de données
Phase 3 — Recette et ajustements (1 à 2 semaines) : tests métier, corrections, sécurisation des flux et finalisation
Phase 4 — Mise en production (3 à 5 jours) : ouverture de la plateforme, transfert, accompagnement et support initial'
  ),
  updated_at = now()
where public_ref = 'new-pare-brise-phase-1-demo';
