update public.prospect_projects
set
  payload = coalesce(payload, '{}'::jsonb) || jsonb_build_object(
    'functional_analysis',
    'Parcours commercial multi-étapes depuis mobile ou tablette : client, véhicule, assurance, documents et validation finale
Création de dossier terrain avec synchronisation immédiate vers l’agence
Centralisation des données client, véhicule, contrat et pièces jointes dans une base unique
Gestion documentaire métier : cartes grises, RIB, photos, scans et documents contractuels
Interface agence pour visualiser, qualifier, compléter et suivre chaque dossier en temps réel
Workflow multi-utilisateurs avec rôles différenciés entre terrain, agence et administratif',
    'technical_recommendations',
    'Application web responsive premium accessible sur mobile, tablette et desktop sans friction
Authentification sécurisée avec gestion fine des rôles et des droits d’accès
Base de données centralisée PostgreSQL pour fiabiliser les dossiers et éviter les ressaisies
Stockage structuré et sécurisé des documents avec sauvegardes automatiques
Génération de documents métier et signature électronique dans le parcours utilisateur
Architecture API prête à accueillir des intégrations futures Sage, Clearbus ou autres outils tiers',
    'budget_estimate',
    'Phase 1 — Socle métier : 14 500 € HT
Exploitation, maintenance et supervision : 290 € HT / mois
Phase 2 et suivantes : chiffrage complémentaire après validation des priorités métier
Retour sur investissement visé : réduction rapide des ressaisies, du papier et des erreurs opérationnelles',
    'development_phases',
    'Phase 0 — Cadrage détaillé : ateliers métier, arbitrages fonctionnels et validation du périmètre prioritaire
Phase 1 — UX / UI et prototype : parcours terrain, structure des dossiers et validation des écrans clés
Phase 2 — Développement du socle : acquisition terrain, back-office agence, documents et base de données
Phase 3 — Recette et ajustements : tests métier, corrections, sécurisation des flux et finalisation
Phase 4 — Mise en production : ouverture de la plateforme, transfert, accompagnement et support initial',
    'technologies_envisaged',
    'Frontend : application web responsive premium pour usage terrain et agence
Back-end : API métier sécurisée pour centraliser les flux et les automatisations
Base de données : PostgreSQL pour structurer durablement les dossiers et l’historique
Documents : génération PDF et stockage sécurisé des pièces jointes
Sécurité : gestion des rôles, traçabilité des actions et sauvegardes automatiques
Infrastructure : hébergement cloud supervisé, monitoring et maintenance continue',
    'future_evolutions',
    'Facturation automatisée et gestion des avoirs
Suivi des dossiers assurances et relances
Gestion des encaissements
Calcul des commissions commerciales
Reporting avancé
Intégrations Sage / Clearbus
Application mobile native si nécessaire'
  ),
  updated_at = now()
where public_ref = 'new-pare-brise-phase-1-demo';
