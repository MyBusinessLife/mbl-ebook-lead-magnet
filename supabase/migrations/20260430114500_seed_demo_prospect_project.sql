insert into public.prospect_projects (
  id,
  status,
  source_type,
  public_ref,
  client_name,
  client_email,
  client_company,
  project_title,
  service_line,
  short_pitch,
  client_context,
  objectives,
  solution_overview,
  scope_details,
  deliverables,
  rollout_plan,
  timeline_notes,
  collaboration_notes,
  next_step,
  admin_notes,
  payload
)
values (
  'f1df5d46-7779-4d27-99b1-2fa9f6875530',
  'sent',
  'manual',
  'carrosserie-phase1-demo',
  'Projet démonstration',
  'prospect.carrosserie@example.com',
  'Prospect carrosserie - démo',
  'Structuration métier carrosserie - Phase 1',
  'Logiciel métier sur-mesure',
  'Remplacer une organisation éclatée par une solution unique, cohérente et performante pour centraliser, automatiser et sécuriser l''activité.',
  $$Je vous remercie pour votre retour très complet ainsi que pour le temps consacré à la présentation détaillée de votre fonctionnement actuel.

Votre niveau de précision permet de bien comprendre la réalité terrain de votre activité ainsi que les problématiques importantes que vous rencontrez au quotidien.

Après analyse, il apparaît clairement que votre besoin dépasse largement une simple optimisation de fichiers Excel. Nous sommes sur un véritable projet de structuration métier visant à centraliser, automatiser et sécuriser l’ensemble de votre activité.

L’objectif est donc de remplacer une organisation aujourd’hui éclatée (logiciel métier, Excel, Trello, Sage, mails, scans, papier) par une solution unique, cohérente et performante.$$,
  $$Suppression du papier terrain
Suppression d’une grande partie des ressaisies
Centralisation instantanée des informations
Réduction des erreurs
Gain de temps significatif pour les équipes
Meilleure organisation des dossiers$$,
  $$Afin d’avancer de manière efficace, rentable et sécurisée, nous proposons de structurer le projet en plusieurs phases.

L’idée est de commencer par une Phase 1 ciblée, permettant de supprimer immédiatement les principales pertes de temps et d’apporter un gain opérationnel rapide.

Objectif de la Phase 1 : digitaliser l’acquisition terrain et centraliser la création et le suivi des dossiers clients.$$,
  $$Interface commerciale (tablette / mobile via navigateur)
Création de dossiers clients directement sur le terrain
Saisie des informations (client, véhicule, assurance, etc.)
Upload de documents (carte grise, RIB, photos, etc.)
Signature électronique des documents
Centralisation automatique des dossiers côté agence
Interface back-office agence
Visualisation et gestion des dossiers en temps réel
Génération des Ordres de Réparation (OR)
Génération des documents principaux (devis, OR, documents contractuels)
Archivage automatique des documents
Mise en place d’une base de données centralisée
Structuration des dossiers et des informations
Accès multi-utilisateurs sécurisé$$,
  $$Hébergement sécurisé
Sauvegardes automatiques
Maintenance corrective
Supervision technique
Assistance$$,
  $$Facturation automatisée et gestion des avoirs
Suivi des dossiers assurances et relances
Gestion des encaissements
Calcul des commissions commerciales
Reporting avancé
Intégrations Sage / Clearbus
Application mobile native si nécessaire$$,
  $$Phase 1 : 14 500 € HT
Gestion de la plateforme : 290 € HT / mois
Approche : démarrer vite avec un socle rentable puis enrichir progressivement$$,
  $$Cette approche permet de démarrer rapidement avec une solution concrète, utile et rentable, tout en gardant une vision claire sur l’évolution complète du projet.

L’objectif est de construire un outil solide, sans surcomplexifier dès le départ, tout en apportant un gain opérationnel immédiat.

Nous restons bien entendu disponibles pour échanger et ajuster cette première phase selon les priorités métier.$$,
  'Valider le périmètre de la Phase 1, arbitrer les priorités métier puis lancer le cadrage détaillé.',
  'Proposition de démonstration intégrée depuis le brief utilisateur du 30/04/2026.',
  jsonb_build_object(
    'seed_label', 'demo-proposition-carrosserie',
    'source_copy',
    $$Bonjour,

Je vous remercie pour votre retour très complet ainsi que pour le temps consacré à la présentation détaillée de votre fonctionnement actuel.

Votre niveau de précision permet de bien comprendre la réalité terrain de votre activité ainsi que les problématiques importantes que vous rencontrez au quotidien.

Après analyse, il apparaît clairement que votre besoin dépasse largement une simple optimisation de fichiers Excel. Nous sommes sur un véritable projet de structuration métier visant à centraliser, automatiser et sécuriser l’ensemble de votre activité.

L’objectif est donc de remplacer une organisation aujourd’hui éclatée (logiciel métier, Excel, Trello, Sage, mails, scans, papier) par une solution unique, cohérente et performante.

━━━━━━━━━━━━━━━━━━
Notre approche
━━━━━━━━━━━━━━━━━━

Afin d’avancer de manière efficace, rentable et sécurisée, nous vous proposons de structurer le projet en plusieurs phases.

L’idée est de commencer par une Phase 1 ciblée, permettant de supprimer immédiatement les principales pertes de temps et d’apporter un gain opérationnel rapide.

━━━━━━━━━━━━━━━━━━
PHASE 1 — Mise en place du socle métier (prioritaire)
━━━━━━━━━━━━━━━━━━

Objectif :
Digitaliser l’acquisition terrain et centraliser la création et le suivi des dossiers clients.

Cette première phase comprend :

• Interface commerciale (tablette / mobile via navigateur)
• Création de dossiers clients directement sur le terrain
• Saisie des informations (client, véhicule, assurance, etc.)
• Upload de documents (carte grise, RIB, photos, etc.)
• Signature électronique des documents
• Centralisation automatique des dossiers côté agence

• Interface back-office agence
• Visualisation et gestion des dossiers en temps réel
• Génération des Ordres de Réparation (OR)
• Génération des documents principaux (devis, OR, documents contractuels)
• Archivage automatique des documents

• Mise en place d’une base de données centralisée
• Structuration des dossiers et des informations
• Accès multi-utilisateurs sécurisé

━━━━━━━━━━━━━━━━━━
Bénéfices immédiats
━━━━━━━━━━━━━━━━━━

• Suppression du papier terrain
• Suppression d’une grande partie des ressaisies
• Centralisation instantanée des informations
• Réduction des erreurs
• Gain de temps significatif pour les équipes
• Meilleure organisation des dossiers

━━━━━━━━━━━━━━━━━━
Budget Phase 1
━━━━━━━━━━━━━━━━━━

14 500 € HT

Cette phase constitue une base solide, directement exploitable et déjà fortement rentable pour votre activité.

━━━━━━━━━━━━━━━━━━
Gestion de la plateforme
━━━━━━━━━━━━━━━━━━

Afin de garantir la stabilité et la sécurité de la solution :

• hébergement sécurisé
• sauvegardes automatiques
• maintenance corrective
• supervision technique
• assistance

Abonnement :

290 € HT / mois

━━━━━━━━━━━━━━━━━━
Évolutions possibles (Phase 2 et suivantes)
━━━━━━━━━━━━━━━━━━

Une fois cette base en place, il sera possible d’ajouter progressivement :

• facturation automatisée et gestion des avoirs
• suivi des dossiers assurances et relances
• gestion des encaissements
• calcul des commissions commerciales
• reporting avancé
• intégrations Sage / Clearbus
• application mobile native si nécessaire

━━━━━━━━━━━━━━━━━━
Conclusion
━━━━━━━━━━━━━━━━━━

Cette approche permet de démarrer rapidement avec une solution concrète, utile et rentable, tout en gardant une vision claire sur l’évolution complète du projet.

L’objectif est de construire un outil solide, sans surcomplexifier dès le départ, tout en vous apportant un gain opérationnel immédiat.

Je reste bien entendu disponible pour échanger et ajuster cette première phase selon vos priorités métier.$$,
    'created_from', 'codex-admin-seed'
  )
)
on conflict (id) do update
set
  status = excluded.status,
  source_type = excluded.source_type,
  public_ref = excluded.public_ref,
  client_name = excluded.client_name,
  client_email = excluded.client_email,
  client_company = excluded.client_company,
  project_title = excluded.project_title,
  service_line = excluded.service_line,
  short_pitch = excluded.short_pitch,
  client_context = excluded.client_context,
  objectives = excluded.objectives,
  solution_overview = excluded.solution_overview,
  scope_details = excluded.scope_details,
  deliverables = excluded.deliverables,
  rollout_plan = excluded.rollout_plan,
  timeline_notes = excluded.timeline_notes,
  collaboration_notes = excluded.collaboration_notes,
  next_step = excluded.next_step,
  admin_notes = excluded.admin_notes,
  payload = excluded.payload,
  updated_at = now();
