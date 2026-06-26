update public.prospect_projects
set
  payload = jsonb_set(
    coalesce(payload, '{}'::jsonb),
    '{mockups}',
    jsonb_build_array(
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
        'note', 'L''objectif est de rendre la création de dossier fluide, rapide et fiable dès la première interaction avec le client.',
        'imageSrc', 'assets/proposals/new-pare-brise/mobile.png',
        'imageAlt', 'Maquette mobile de création de dossier client NEW PARE BRISE',
        'imageOrientation', 'portrait'
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
        'note', 'Cette vue pose les bases d''un outil agence capable d''industrialiser le suivi tout en restant simple à prendre en main.',
        'imageSrc', 'assets/proposals/new-pare-brise/pc.png',
        'imageAlt', 'Maquette back-office NEW PARE BRISE avec tableau de bord et suivi des dossiers',
        'imageOrientation', 'landscape'
      )
    ),
    true
  ),
  updated_at = now()
where public_ref = 'new-pare-brise-phase-1-demo';
