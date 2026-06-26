(() => {
  const app = document.querySelector("[data-diagnostic-app]");
  if (!app) return;

  const routeOptions = [
    {
      value: "web",
      label: "Site internet",
      tag: "WEB",
      text: "Création, refonte, SEO, visites, conversion ou dashboard.",
    },
    {
      value: "software",
      label: "Logiciel métier",
      tag: "APP",
      text: "Outil interne, CRM, planning, devis, facturation ou reporting.",
    },
    {
      value: "ai",
      label: "Agents IA",
      tag: "IA",
      text: "Assistant métier, qualification, support, documents ou reporting.",
    },
    {
      value: "repair",
      label: "Réparation PC",
      tag: "PC",
      text: "Panne, écran cassé, mot de passe, virus, lenteur ou données.",
    },
    {
      value: "home-support",
      label: "Assistance à domicile",
      tag: "HOME",
      text: "Dépannage chez vous, internet, installation et crédit d'impôt 50%.",
    },
    {
      value: "camera",
      label: "Caméras de surveillance",
      tag: "CAM",
      text: "Intérieur, extérieur, alertes, vacances, vision à distance et enregistrement.",
    },
    {
      value: "hardware",
      label: "Achat matériel",
      tag: "MAT",
      text: "PC, configuration, RAM, stockage, écran ou accessoires.",
    },
    {
      value: "automation",
      label: "Automatisation",
      tag: "AUTO",
      text: "Tâches répétitives, relances, documents ou synchronisation.",
    },
    {
      value: "strategy",
      label: "Stratégie digitale",
      tag: "PLAN",
      text: "Audit, priorités, feuille de route ou clarification.",
    },
  ];

  const choice = (value, label, text = "", tag = "") => ({ value, label, text, tag });

  const routes = {
    web: {
      label: "Site internet",
      summary: "Projet web moderne",
      next: "Cadrer objectif, contenus, SEO et mesure des visites.",
      steps: [
        {
          id: "objectif",
          label: "Objectif",
          title: "Quel objectif doit remplir le site ?",
          hint: "On part du résultat attendu, pas seulement du nombre de pages.",
          type: "single",
          options: [
            choice("vitrine", "Présenter l'activité", "Un site clair, crédible et rassurant.", "VIS"),
            choice("refonte", "Moderniser l'existant", "Remettre l'image au niveau de l'entreprise.", "NEW"),
            choice("conversion", "Convertir plus", "Landing page, tunnel, formulaires qualifiés.", "CTA"),
            choice("seo", "Gagner du trafic", "Structure SEO, blog, contenus, suivi des visites.", "SEO"),
            choice("ecommerce", "Vendre en ligne", "Catalogue, paiement, suivi, automatisations.", "SHOP"),
            choice("dashboard", "Suivre les performances", "Dashboard, analytics, leads et reporting.", "DATA"),
          ],
        },
        {
          id: "fonctionnalites",
          label: "Fonctions",
          title: "Quelles fonctionnalités changeraient vraiment la valeur du site ?",
          hint: "Sélectionnez uniquement les éléments utiles à votre activité.",
          type: "multi",
          dense: true,
          options: [
            choice("dashboard", "Dashboard de visites", "Voir trafic, sources, conversions.", "DATA"),
            choice("rdv", "Prise de rendez-vous", "Calendly, agenda ou parcours guidé.", "RDV"),
            choice("forms", "Formulaires qualifiés", "Demandes structurées et exploitables.", "LEAD"),
            choice("blog", "Blog SEO", "Pages conseils et acquisition long terme.", "SEO"),
            choice("crm", "Connexion CRM", "Envoi automatique des contacts.", "CRM"),
            choice("paiement", "Paiement en ligne", "Acompte, réservation ou vente.", "PAY"),
            choice("espace", "Espace client", "Accès privé, documents, suivi.", "VIP"),
            choice("multilingue", "Multilingue", "Développer plusieurs marchés.", "FR"),
          ],
        },
        {
          id: "contenus",
          label: "Contenus",
          title: "Où en sont les contenus et l'identité visuelle ?",
          hint: "Cela permet d'anticiper ce qu'il faut produire ou reprendre.",
          type: "single",
          options: [
            choice("prets", "Textes et images prêts", "La matière principale existe déjà.", "OK"),
            choice("a_creer", "Tout est à créer", "Structure, textes, visuels et angle marketing.", "NEW"),
            choice("a_reprendre", "À reprendre", "Il existe une base, mais elle n'est pas premium.", "UP"),
            choice("identite", "Identité à clarifier", "Logo, couleurs, messages ou positionnement.", "BRAND"),
          ],
        },
        {
          id: "audience",
          label: "Audience",
          title: "Qui doit se reconnaître immédiatement sur le site ?",
          hint: "La page doit parler aux bonnes personnes dès les premières secondes.",
          type: "single",
          options: [
            choice("particuliers", "Particuliers", "Besoin clair, confiance, simplicité.", "B2C"),
            choice("pros", "Professionnels", "Crédibilité, ROI, preuves, efficacité.", "B2B"),
            choice("local", "Clientèle locale", "Référencement local et contact rapide.", "LOC"),
            choice("national", "Marché national", "Image plus forte et acquisition élargie.", "FR"),
          ],
        },
      ],
    },
    software: {
      label: "Logiciel métier",
      summary: "Outil métier sur-mesure",
      next: "Cartographier processus, utilisateurs, données et priorités.",
      steps: [
        {
          id: "processus",
          label: "Processus",
          title: "Quel processus voulez-vous simplifier ?",
          hint: "Choisissez la zone où vous perdez le plus de temps aujourd'hui.",
          type: "single",
          options: [
            choice("planning", "Planning et interventions", "Organisation, suivi, équipes, statuts.", "PLAN"),
            choice("crm", "Clients et opportunités", "Pipeline, relances, historique, suivi.", "CRM"),
            choice("devis", "Devis et facturation", "Documents, marges, paiements, relances.", "DOC"),
            choice("stock", "Stock et achats", "Entrées, sorties, alertes, fournisseurs.", "STK"),
            choice("rh", "RH et équipes", "Absences, temps, documents, suivi interne.", "RH"),
            choice("pilotage", "Pilotage global", "Tableaux de bord et indicateurs clés.", "DATA"),
          ],
        },
        {
          id: "modules",
          label: "Modules",
          title: "Quels modules seraient utiles dès la première version ?",
          hint: "Un bon logiciel commence par un périmètre maîtrisé.",
          type: "multi",
          dense: true,
          options: [
            choice("dashboard", "Dashboard", "Vision claire de l'activité.", "DATA"),
            choice("clients", "Base clients", "Fiches, historique, contacts.", "CRM"),
            choice("documents", "Documents", "Devis, factures, PDF, modèles.", "PDF"),
            choice("planning", "Planning", "Tâches, interventions, agenda.", "CAL"),
            choice("droits", "Droits utilisateurs", "Rôles, accès, sécurité.", "SEC"),
            choice("notifications", "Notifications", "Emails, rappels, alertes.", "MAIL"),
            choice("exports", "Exports", "Excel, PDF, comptabilité.", "XLS"),
            choice("api", "Connexions API", "Outils existants et synchronisation.", "API"),
          ],
        },
        {
          id: "utilisateurs",
          label: "Utilisateurs",
          title: "Combien de personnes utiliseraient l'outil ?",
          hint: "Cela influence les droits, les parcours et la façon de structurer l'interface.",
          type: "single",
          options: [
            choice("solo", "1 personne", "Usage simple et très direct.", "1"),
            choice("small", "2 à 5 personnes", "Collaboration légère.", "5"),
            choice("team", "6 à 20 personnes", "Rôles, suivi, validation.", "20"),
            choice("scale", "20+ personnes", "Process plus structuré.", "20+"),
          ],
        },
        {
          id: "donnees",
          label: "Données",
          title: "Où sont vos données aujourd'hui ?",
          hint: "Le diagnostic prépare la migration ou les connexions nécessaires.",
          type: "multi",
          options: [
            choice("excel", "Excel / Google Sheets", "Tableaux, exports, fichiers partagés.", "XLS"),
            choice("saas", "Logiciels SaaS", "Outils existants à connecter ou remplacer.", "SaaS"),
            choice("papier", "Papier / manuel", "Process à numériser proprement.", "MAN"),
            choice("database", "Base existante", "Données déjà structurées.", "DB"),
          ],
        },
      ],
    },
    repair: {
      label: "Réparation PC",
      summary: "Diagnostic ordinateur",
      next: "Identifier symptôme, appareil, urgence et données sensibles.",
      steps: [
        {
          id: "problemes",
          label: "Problème",
          title: "Quel problème faut-il traiter ?",
          hint: "Vous pouvez sélectionner plusieurs symptômes si nécessaire.",
          type: "multi",
          dense: true,
          options: [
            choice("ecran", "Écran cassé", "Dalle fissurée, affichage noir ou lignes.", "LCD"),
            choice("password", "Mot de passe perdu", "Accès Windows, session ou compte local.", "KEY"),
            choice("lent", "PC très lent", "Démarrage long, blocages, ralentissements.", "SLOW"),
            choice("virus", "Virus ou pop-ups", "Alertes, navigateur pollué, comportements suspects.", "SAFE"),
            choice("demarrage", "Ne démarre plus", "Écran noir, boucle, message d'erreur.", "BOOT"),
            choice("donnees", "Récupération données", "Documents, photos, disque ou clé USB.", "DATA"),
            choice("batterie", "Batterie / charge", "Autonomie faible ou charge impossible.", "BAT"),
            choice("clavier", "Clavier / touchpad", "Touches, pavé tactile ou souris.", "KEY"),
            choice("wifi", "Wi-Fi / réseau", "Connexion instable ou impossible.", "NET"),
            choice("chauffe", "Surchauffe", "Ventilation, bruit, arrêt brutal.", "TEMP"),
            choice("upgrade", "Upgrade", "RAM, SSD, nettoyage, optimisation.", "UP"),
            choice("installation", "Installation logiciel", "Windows, bureautique, outils métier.", "APP"),
          ],
        },
        {
          id: "appareil",
          label: "Appareil",
          title: "Quel type d'appareil est concerné ?",
          hint: "Même si vous n'êtes pas sûr, choisissez l'option la plus proche.",
          type: "single",
          options: [
            choice("portable", "PC portable", "Ordinateur transportable ou laptop.", "LAP"),
            choice("fixe", "PC fixe", "Tour, mini PC ou poste de bureau.", "DESK"),
            choice("mac", "Mac", "MacBook, iMac ou Mac mini.", "MAC"),
            choice("autre", "Je ne sais pas", "On clarifiera le modèle ensuite.", "MBL"),
          ],
        },
        {
          id: "urgence",
          label: "Urgence",
          title: "À quel point l'intervention est-elle urgente ?",
          hint: "Cela permet de prioriser correctement la demande.",
          type: "single",
          options: [
            choice("bloque", "Je suis bloqué", "Impossible de travailler ou d'accéder aux données.", "NOW"),
            choice("rapide", "Cette semaine", "Le problème gêne fortement l'usage.", "7J"),
            choice("confort", "Quand possible", "Optimisation ou souci non bloquant.", "OK"),
            choice("diagnostic", "À diagnostiquer", "Je veux d'abord comprendre la panne.", "ASK"),
          ],
        },
        {
          id: "donnees_pc",
          label: "Données",
          title: "Y a-t-il des données importantes à préserver ?",
          hint: "Cette information change la manière d'intervenir.",
          type: "single",
          options: [
            choice("critiques", "Oui, données sensibles", "Documents, photos ou fichiers professionnels.", "LOCK"),
            choice("backup", "J'ai une sauvegarde", "Une copie existe déjà.", "OK"),
            choice("non", "Non prioritaire", "L'objectif principal est la réparation.", "NO"),
            choice("incertain", "Je ne sais pas", "À vérifier avant toute manipulation.", "ASK"),
          ],
        },
      ],
    },
    "home-support": {
      label: "Assistance informatique à domicile",
      summary: "Intervention à domicile",
      next: "Vérifier le besoin, le domicile, l'urgence et l'éligibilité au crédit d'impôt.",
      steps: [
        {
          id: "besoin_domicile",
          label: "Besoin",
          title: "Quelle aide informatique souhaitez-vous à domicile ?",
          hint: "Le parcours reste centré sur une intervention chez vous.",
          type: "multi",
          dense: true,
          options: [
            choice("depannage", "Dépannage ordinateur", "PC lent, blocage, démarrage, réglages.", "PC"),
            choice("internet", "Internet / Wi-Fi", "Box, réseau, email, navigation, imprimante.", "NET"),
            choice("installation", "Installation", "Ordinateur, logiciel, imprimante, sauvegarde.", "SET"),
            choice("securite", "Sécurité", "Antivirus, mots de passe, sauvegardes.", "SEC"),
            choice("transfert", "Transfert de données", "Migration, fichiers, nouveau PC.", "DATA"),
            choice("prise_en_main", "Prise en main", "Accompagnement simple et pédagogie.", "HELP"),
          ],
        },
        {
          id: "environnement",
          label: "Environnement",
          title: "Dans quel environnement faudra-t-il intervenir ?",
          hint: "Ces éléments changent la préparation de l'intervention.",
          type: "multi",
          options: [
            choice("pc_portable", "PC portable", "Laptop Windows ou MacBook.", "LAP"),
            choice("pc_fixe", "PC fixe", "Tour, mini PC ou poste de bureau.", "DESK"),
            choice("box", "Box internet", "Wi-Fi, routeur, réseau domestique.", "BOX"),
            choice("imprimante", "Imprimante", "Installation, Wi-Fi, scanner.", "PRINT"),
            choice("nouveau_pc", "Nouveau PC", "Mise en route ou transfert.", "NEW"),
            choice("plusieurs", "Plusieurs appareils", "Ordinateur, téléphone, accessoires.", "MULTI"),
          ],
        },
        {
          id: "credit_impot",
          label: "Crédit d'impôt",
          title: "Souhaitez-vous bénéficier du crédit d'impôt de 50% ?",
          hint: "L'assistance informatique à domicile peut être éligible, dans la limite des plafonds applicables.",
          type: "single",
          options: [
            choice("avance", "Oui, avec avance immédiate", "Objectif : ne régler que 50% si le dispositif est applicable.", "50%"),
            choice("declaration", "Oui, via déclaration", "Vous réglez puis déclarez l'avantage fiscal.", "IMP"),
            choice("a_verifier", "À vérifier", "On confirme les conditions avant de promettre l'avantage.", "ASK"),
            choice("non", "Pas nécessaire", "L'intervention reste possible hors avantage fiscal.", "NO"),
          ],
        },
        {
          id: "urgence_domicile",
          label: "Urgence",
          title: "Quand souhaitez-vous être aidé ?",
          hint: "Cela permet de prioriser correctement la demande.",
          type: "single",
          options: [
            choice("bloque", "Je suis bloqué", "Impossible d'utiliser l'ordinateur ou internet.", "NOW"),
            choice("semaine", "Cette semaine", "Le problème gêne l'usage quotidien.", "7J"),
            choice("souple", "Quand possible", "Installation, optimisation ou prise en main.", "OK"),
            choice("conseil", "Je veux d'abord un conseil", "Comprendre avant de planifier.", "ASK"),
          ],
        },
      ],
    },
    camera: {
      label: "Caméras de surveillance",
      summary: "Protection du domicile",
      next: "Qualifier les zones, le niveau de surveillance, la consultation à distance et le contexte du logement.",
      steps: [
        {
          id: "zones_camera",
          label: "Zones",
          title: "Quelles zones souhaitez-vous couvrir ?",
          hint: "Le bon système dépend des accès et espaces vraiment importants à surveiller.",
          type: "multi",
          dense: true,
          options: [
            choice("entree", "Porte d'entrée", "Voir les accès principaux et les allées venues.", "ENT"),
            choice("portail", "Portail / allée", "Suivre les passages extérieurs et arrivées.", "OUT"),
            choice("garage", "Garage", "Protéger un accès secondaire ou le stationnement.", "GAR"),
            choice("jardin", "Jardin / terrasse", "Garder un oeil sur l'extérieur.", "EXT"),
            choice("salon", "Pièce de vie", "Vérifier un espace intérieur ciblé.", "IN"),
            choice("residence", "Résidence secondaire", "Conserver une vision à distance pendant les absences.", "VAC"),
          ],
        },
        {
          id: "objectif_camera",
          label: "Objectif",
          title: "Qu'attendez-vous surtout de l'installation ?",
          hint: "On cherche le bon usage : dissuader, vérifier, comprendre une alerte ou suivre un accès.",
          type: "multi",
          dense: true,
          options: [
            choice("dissuasion", "Dissuader", "Montrer qu'un accès est surveillé.", "SAFE"),
            choice("verification", "Vérifier à distance", "Lever un doute quand vous n'êtes pas sur place.", "APP"),
            choice("vacances", "Partir plus sereinement", "Suivi pendant vacances ou déplacements.", "VAC"),
            choice("livraisons", "Suivre les passages", "Visites, livraisons ou mouvements extérieurs.", "MOVE"),
            choice("animaux", "Surveiller un animal", "Vérifier l'intérieur ponctuellement.", "PET"),
            choice("preuves", "Conserver un historique", "Revoir une séquence ou un événement.", "REC"),
          ],
        },
        {
          id: "contexte_camera",
          label: "Contexte",
          title: "Dans quel contexte faut-il installer les caméras ?",
          hint: "Ces éléments changent le type de matériel, la couverture et la préparation.",
          type: "multi",
          options: [
            choice("interieur", "Seulement intérieur", "Pièces de vie, accès ou résidence secondaire.", "IN"),
            choice("exterieur", "Seulement extérieur", "Entrée, cour, portail, garage ou jardin.", "OUT"),
            choice("mixte", "Intérieur + extérieur", "Vision plus complète du domicile.", "360"),
            choice("wifi", "Wi-Fi à vérifier", "Couverture ou stabilité à contrôler.", "NET"),
            choice("alimentation", "Alimentation à prévoir", "Prises ou passages techniques à cadrer.", "POW"),
            choice("multiusers", "Plusieurs accès mobiles", "Couple, famille ou proches à partager.", "TEAM"),
          ],
        },
        {
          id: "pilotage_camera",
          label: "Pilotage",
          title: "Comment voulez-vous suivre le système au quotidien ?",
          hint: "Le confort vient beaucoup de l'application, des alertes et de la logique d'enregistrement.",
          type: "multi",
          options: [
            choice("alertes", "Alertes smartphone", "Recevoir les événements importants.", "PING"),
            choice("direct", "Vision en direct", "Consulter rapidement depuis le téléphone.", "LIVE"),
            choice("historique", "Historique vidéo", "Pouvoir revoir une séquence plus tard.", "HIS"),
            choice("discret", "Usage discret", "Limiter les notifications et garder une interface simple.", "ZEN"),
            choice("nuit", "Vision nocturne", "Voir clairement le soir et la nuit.", "NIGHT"),
            choice("confidentialite", "Confidentialité", "Cadrer les zones et l'usage intérieur.", "PRIV"),
          ],
        },
      ],
    },
    hardware: {
      label: "Achat matériel informatique",
      summary: "Configuration informatique",
      next: "Définir usage, format, RAM, stockage et contraintes pratiques.",
      steps: [
        {
          id: "materiel",
          label: "Matériel",
          title: "Quel matériel souhaitez-vous choisir ?",
          hint: "Le but est de recommander une configuration adaptée, pas un modèle générique.",
          type: "single",
          options: [
            choice("laptop", "PC portable", "Mobilité, autonomie, poids, confort.", "LAP"),
            choice("desktop", "PC fixe", "Performance, évolutivité, poste de travail.", "DESK"),
            choice("screen", "Écran", "Taille, résolution, double écran, confort.", "LCD"),
            choice("pack", "Pack complet", "Ordinateur, écran, clavier, souris, installation.", "PACK"),
            choice("upgrade", "Amélioration PC", "RAM, SSD, nettoyage, mise à niveau.", "UP"),
            choice("peripherals", "Accessoires", "Station, sauvegarde, réseau, imprimante.", "USB"),
          ],
        },
        {
          id: "usage",
          label: "Usage",
          title: "Quel usage principal prévoyez-vous ?",
          hint: "C'est l'information la plus importante pour éviter un mauvais achat.",
          type: "multi",
          dense: true,
          options: [
            choice("bureau", "Bureautique", "Emails, documents, navigation.", "OFF"),
            choice("etudes", "Études", "Cours, visio, autonomie, transport.", "EDU"),
            choice("pro", "Usage professionnel", "Fiabilité, confort, logiciels métier.", "PRO"),
            choice("creation", "Création vidéo/photo", "Écran, processeur, stockage rapide.", "CPU"),
            choice("dev", "Développement", "RAM, stockage, multi-outils.", "DEV"),
            choice("gaming", "Jeux", "Carte graphique, refroidissement, écran.", "GPU"),
            choice("famille", "Famille", "Usage polyvalent et durable.", "HOME"),
            choice("mobilite", "Mobilité", "Poids, batterie, transport.", "GO"),
          ],
        },
        {
          id: "ram",
          label: "RAM",
          title: "Quelle mémoire RAM visez-vous ?",
          hint: "Choisissez si vous avez déjà une idée, sinon laissez-nous cadrer.",
          type: "single",
          options: [
            choice("8", "8 Go", "Usage léger et configuration maîtrisée.", "8"),
            choice("16", "16 Go", "Confort pour la plupart des usages.", "16"),
            choice("32", "32 Go", "Création, dev, multi-tâche avancé.", "32"),
            choice("64", "64 Go ou plus", "Besoins lourds ou très spécialisés.", "64"),
            choice("advice", "À conseiller", "Vous préférez une recommandation.", "ASK"),
          ],
        },
        {
          id: "stockage",
          label: "Stockage",
          title: "Quel stockage paraît nécessaire ?",
          hint: "On privilégie la vitesse, la fiabilité et l'espace utile.",
          type: "single",
          options: [
            choice("256", "256 Go SSD", "Usage léger, cloud majoritaire.", "256"),
            choice("512", "512 Go SSD", "Équilibre confortable.", "512"),
            choice("1to", "1 To SSD", "Fichiers lourds ou long terme.", "1T"),
            choice("2to", "2 To ou plus", "Création, archives, gros volumes.", "2T"),
            choice("nas", "Stockage partagé", "Sauvegarde, réseau ou équipe.", "NAS"),
            choice("advice", "À conseiller", "À définir selon l'usage.", "ASK"),
          ],
        },
        {
          id: "contraintes",
          label: "Contraintes",
          title: "Quels critères comptent vraiment ?",
          hint: "Ces détails évitent les achats séduisants mais peu adaptés.",
          type: "multi",
          dense: true,
          options: [
            choice("autonomie", "Autonomie", "Tenir une journée ou travailler mobile.", "BAT"),
            choice("silence", "Silence", "Poste discret et agréable.", "SIL"),
            choice("poids", "Poids léger", "Transport fréquent.", "GO"),
            choice("ecran", "Très bon écran", "Confort, couleurs, résolution.", "LCD"),
            choice("garantie", "Garantie / durée", "Fiabilité et tranquillité.", "OK"),
            choice("installation", "Installation incluse", "Mise en route, transfert, sécurité.", "MBL"),
          ],
        },
      ],
    },
    automation: {
      label: "Automatisation",
      summary: "Automatisation de processus",
      next: "Identifier tâches répétitives, outils, volume et niveau de contrôle.",
      steps: [
        {
          id: "taches",
          label: "Tâches",
          title: "Quelles tâches voulez-vous automatiser ?",
          hint: "Choisissez les tâches qui reviennent trop souvent.",
          type: "multi",
          dense: true,
          options: [
            choice("relances", "Relances clients", "Emails, rappels, suivis.", "MAIL"),
            choice("documents", "Documents", "Devis, factures, PDF, modèles.", "PDF"),
            choice("saisie", "Saisie manuelle", "Copier-coller, tableaux, formulaires.", "BOT"),
            choice("reporting", "Reporting", "Tableaux de bord et exports.", "DATA"),
            choice("planning", "Planning", "Notifications, assignations, statuts.", "CAL"),
            choice("sync", "Synchronisation", "Connecter plusieurs outils.", "API"),
          ],
        },
        {
          id: "outils",
          label: "Outils",
          title: "Quels outils utilisez-vous déjà ?",
          hint: "L'automatisation peut connecter ou remplacer certains outils.",
          type: "multi",
          options: [
            choice("excel", "Excel / Sheets", "Tableaux et fichiers partagés.", "XLS"),
            choice("mail", "Email", "Gmail, Outlook, boîtes partagées.", "MAIL"),
            choice("crm", "CRM / ERP", "Outil de gestion déjà en place.", "CRM"),
            choice("agenda", "Agenda", "Google Calendar, Outlook, planning.", "CAL"),
            choice("aucun", "Aucun outil clair", "Process encore dispersé.", "ASK"),
          ],
        },
        {
          id: "volume",
          label: "Volume",
          title: "À quelle fréquence le problème revient-il ?",
          hint: "Plus le volume est régulier, plus le gain peut être important.",
          type: "single",
          options: [
            choice("quotidien", "Tous les jours", "Automatisation prioritaire.", "DAY"),
            choice("hebdo", "Chaque semaine", "Récurrence déjà forte.", "WEEK"),
            choice("mensuel", "Chaque mois", "Gain utile mais à cadrer.", "MONTH"),
            choice("variable", "Variable", "À analyser selon les cas.", "ASK"),
          ],
        },
        {
          id: "controle",
          label: "Contrôle",
          title: "Quel niveau de validation souhaitez-vous garder ?",
          hint: "Certaines automatisations doivent rester supervisées.",
          type: "single",
          options: [
            choice("auto", "Automatique", "Exécution sans validation.", "AUTO"),
            choice("validation", "Avec validation", "Vous gardez le dernier mot.", "OK"),
            choice("mixte", "Mixte", "Selon le type de tâche.", "MIX"),
            choice("incertain", "À définir", "On choisira le bon niveau ensemble.", "ASK"),
          ],
        },
      ],
    },
    ai: {
      label: "Agents IA",
      summary: "Agent IA métier",
      next: "Cadrer objectif, données, contrôle humain et connexions utiles.",
      steps: [
        {
          id: "objectif_ia",
          label: "Objectif",
          title: "Quel rôle voulez-vous confier à un agent IA ?",
          hint: "On part du cas d'usage concret avant de parler technologie.",
          type: "single",
          options: [
            choice("qualification", "Qualifier les demandes", "Analyser les leads, résumer et prioriser.", "LEAD"),
            choice("support", "Assister le support", "Répondre, trier les urgences, guider les clients.", "HELP"),
            choice("interne", "Assistant interne", "Aider les équipes à retrouver les bonnes informations.", "TEAM"),
            choice("documents", "Analyser des documents", "Résumer, extraire, comparer, vérifier.", "DOC"),
            choice("reporting", "Produire des synthèses", "Transformer données et tableaux en décisions.", "DATA"),
            choice("workflow", "Déclencher des actions", "Préparer ou exécuter des workflows contrôlés.", "FLOW"),
          ],
        },
        {
          id: "donnees_ia",
          label: "Données",
          title: "Quelles sources l'agent IA devrait-il comprendre ?",
          hint: "La qualité de l'agent dépend surtout des informations qu'il peut utiliser.",
          type: "multi",
          dense: true,
          options: [
            choice("site", "Formulaires du site", "Demandes entrantes, briefs, devis.", "WEB"),
            choice("crm", "CRM / base clients", "Fiches, historique, opportunités.", "CRM"),
            choice("documents", "Documents internes", "Procédures, offres, contrats, PDF.", "DOC"),
            choice("emails", "Emails", "Boîtes partagées, réponses, relances.", "MAIL"),
            choice("tableaux", "Tableaux / exports", "Excel, Sheets, CSV, reporting.", "XLS"),
            choice("logiciel", "Logiciel métier", "Données et actions de votre outil interne.", "APP"),
            choice("aucune", "Base à créer", "Les règles et contenus doivent être structurés.", "NEW"),
          ],
        },
        {
          id: "utilisateurs_ia",
          label: "Utilisateurs",
          title: "Qui utilisera l'agent IA au quotidien ?",
          hint: "Un agent pour la direction ne se conçoit pas comme un agent pour le support.",
          type: "multi",
          options: [
            choice("direction", "Direction", "Synthèses, arbitrages, pilotage.", "CEO"),
            choice("commercial", "Commercial", "Qualification, relances, argumentaires.", "SALES"),
            choice("support", "Support client", "Réponses, tri, suivi des demandes.", "HELP"),
            choice("operations", "Opérations", "Procédures, tâches, coordination.", "OPS"),
            choice("admin", "Administratif", "Documents, factures, dossiers.", "ADMIN"),
            choice("clients", "Clients", "Assistant visible côté client.", "EXT"),
          ],
        },
        {
          id: "controle_ia",
          label: "Contrôle",
          title: "Quel niveau d'autonomie acceptez-vous ?",
          hint: "Le bon niveau dépend des risques et de la sensibilité des actions.",
          type: "single",
          options: [
            choice("suggestion", "Suggestions uniquement", "L'agent prépare, l'humain décide.", "SAFE"),
            choice("validation", "Action après validation", "L'agent propose, vous validez l'envoi.", "OK"),
            choice("semi_auto", "Semi-automatique", "Certaines actions simples peuvent partir seules.", "MIX"),
            choice("auto_controle", "Automatique avec alertes", "Logs, alertes et contrôles sur les cas sensibles.", "AUTO"),
            choice("a_definir", "À définir", "On choisira le niveau juste ensemble.", "ASK"),
          ],
        },
        {
          id: "connexions_ia",
          label: "Connexions",
          title: "À quels outils l'agent IA devra-t-il se connecter ?",
          hint: "Les connexions déterminent ce que l'agent peut réellement faire.",
          type: "multi",
          dense: true,
          options: [
            choice("site", "Site internet", "Formulaires, chat, landing pages.", "WEB"),
            choice("crm", "CRM", "Contacts, opportunités, suivis.", "CRM"),
            choice("mail", "Email", "Brouillons, réponses, relances.", "MAIL"),
            choice("drive", "Drive / documents", "Dossiers, PDF, fichiers partagés.", "DOC"),
            choice("agenda", "Agenda", "RDV, disponibilités, rappels.", "CAL"),
            choice("logiciel", "Logiciel métier", "Actions internes ou dashboard.", "APP"),
            choice("none", "À définir", "Les outils ne sont pas encore clairs.", "ASK"),
          ],
        },
        {
          id: "risques_ia",
          label: "Cadre",
          title: "Quel point doit être particulièrement sécurisé ?",
          hint: "Un agent IA premium doit être utile, mais aussi maîtrisé.",
          type: "multi",
          options: [
            choice("confidentialite", "Confidentialité", "Données clients, dossiers internes, accès.", "LOCK"),
            choice("exactitude", "Exactitude des réponses", "Éviter les réponses approximatives.", "QA"),
            choice("ton", "Ton de marque", "Réponses alignées avec votre image.", "BRAND"),
            choice("droits", "Droits d'accès", "Qui peut voir ou déclencher quoi.", "SEC"),
            choice("tracabilite", "Traçabilité", "Historique, logs, validations.", "LOG"),
            choice("adoption", "Adoption équipe", "Simplicité, confiance, formation.", "TEAM"),
          ],
        },
      ],
    },
    strategy: {
      label: "Stratégie digitale",
      summary: "Clarification digitale",
      next: "Prioriser objectifs, canaux, outils et prochaines actions.",
      steps: [
        {
          id: "enjeu",
          label: "Enjeu",
          title: "Quel enjeu voulez-vous clarifier en priorité ?",
          hint: "Une bonne stratégie commence par le bon problème.",
          type: "single",
          options: [
            choice("acquisition", "Trouver plus de clients", "SEO, site, contenu, campagnes.", "GO"),
            choice("organisation", "Mieux s'organiser", "Outils, process, automatisations.", "FLOW"),
            choice("image", "Améliorer l'image", "Positionnement, site, messages.", "BRAND"),
            choice("choix", "Choisir les bons outils", "Audit et arbitrage concret.", "TOOLS"),
            choice("roadmap", "Construire une roadmap", "Priorités, étapes, ordre d'action.", "MAP"),
          ],
        },
        {
          id: "presence",
          label: "Présence",
          title: "Quelle est votre présence actuelle ?",
          hint: "Cela aide à ne pas repartir de zéro inutilement.",
          type: "multi",
          options: [
            choice("site", "Site existant", "Une base est déjà en ligne.", "WEB"),
            choice("social", "Réseaux sociaux", "Présence active ou irrégulière.", "SOC"),
            choice("ads", "Publicité", "Campagnes en cours ou passées.", "ADS"),
            choice("crm", "Outils de suivi", "CRM, fichiers, dashboard.", "CRM"),
            choice("none", "Peu de choses", "Besoin de structurer la base.", "NEW"),
          ],
        },
        {
          id: "priorite",
          label: "Priorité",
          title: "Quelle priorité serait la plus utile maintenant ?",
          hint: "On cherche le levier qui peut débloquer la suite.",
          type: "single",
          options: [
            choice("audit", "Audit clair", "Voir ce qui bloque et quoi changer.", "AUD"),
            choice("plan", "Plan d'action", "Savoir quoi faire et dans quel ordre.", "PLAN"),
            choice("execution", "Passer à l'action", "Faire produire les éléments clés.", "RUN"),
            choice("pilotage", "Mesurer les résultats", "Dashboard, indicateurs, décisions.", "DATA"),
          ],
        },
        {
          id: "ressources",
          label: "Ressources",
          title: "Quelles ressources avez-vous déjà ?",
          hint: "La recommandation dépend du temps, des contenus et des outils disponibles.",
          type: "multi",
          options: [
            choice("temps", "Du temps interne", "Quelqu'un peut contribuer.", "TIME"),
            choice("contenus", "Des contenus", "Textes, photos, offres, preuves.", "DOC"),
            choice("outils", "Des outils", "Solutions déjà en place.", "TOOLS"),
            choice("cadre", "Un cadre à définir", "Sans tarif affiché ici.", "CAD"),
            choice("none", "Peu de ressources", "Il faudra aller à l'essentiel.", "MIN"),
          ],
        },
      ],
    },
  };

  const firstStep = {
    id: "besoin",
    label: "Besoin",
    title: "Quel besoin voulez-vous qualifier ?",
    hint: "Le parcours change automatiquement selon votre choix.",
    type: "route",
    options: routeOptions,
  };

  const contactStep = {
    id: "contact",
    label: "Contact",
    title: "Où devons-nous envoyer le retour ?",
    hint: "Votre synthèse est prête. Aucun tarif automatique n'est affiché.",
    type: "contact",
  };

  const selectors = {
    count: app.querySelector("[data-diag-count]"),
    title: app.querySelector("[data-diag-title]"),
    hint: app.querySelector("[data-diag-hint]"),
    progress: app.querySelector("[data-diag-progress]"),
    rail: app.querySelector("[data-diag-rail]"),
    options: app.querySelector("[data-diag-options]"),
    contact: app.querySelector("[data-diag-contact]"),
    prev: app.querySelector("[data-diag-prev]"),
    next: app.querySelector("[data-diag-next]"),
    reset: app.querySelector("[data-diag-reset]"),
    summaryTitle: app.querySelector("[data-diag-summary-title]"),
    summary: app.querySelector("[data-diag-summary]"),
    status: app.querySelector("[data-diag-status]"),
  };

  const state = {
    route: "",
    lockedRoute: false,
    stepIndex: 0,
    answers: {},
    sending: false,
  };

  const alias = {
    site: "web",
    web: "web",
    "site-internet": "web",
    logiciel: "software",
    software: "software",
    app: "software",
    pc: "repair",
    reparation: "repair",
    repair: "repair",
    domicile: "home-support",
    assistance: "home-support",
    "assistance-domicile": "home-support",
    "assistance-informatique": "home-support",
    "assistance-informatique-domicile": "home-support",
    "home-support": "home-support",
    camera: "camera",
    cameras: "camera",
    surveillance: "camera",
    "camera-surveillance": "camera",
    "cameras-surveillance": "camera",
    "installation-camera": "camera",
    "installation-camera-surveillance": "camera",
    materiel: "hardware",
    hardware: "hardware",
    achat: "hardware",
    automatisation: "automation",
    automation: "automation",
    ia: "ai",
    ai: "ai",
    agent: "ai",
    agents: "ai",
    agentsia: "ai",
    "agents-ia": "ai",
    strategie: "strategy",
    strategy: "strategy",
  };

  const themedPageCopy = {
    web: {
      kicker: "Diagnostic site internet",
      title: "Cadrer votre futur site sans questions inutiles.",
      text:
        "Objectif, conversion, SEO, contenus, suivi des visites et fonctionnalités premium : le parcours se concentre uniquement sur votre projet web.",
      introTitle: "Préparez un site moderne, crédible et mesurable.",
      introText:
        "Chaque question aide à clarifier le rôle du site, les contenus à produire, les fonctionnalités utiles et la manière de mesurer les visites.",
    },
    software: {
      kicker: "Diagnostic logiciel métier",
      title: "Qualifier votre logiciel sur-mesure avec les bonnes questions.",
      text:
        "Processus, modules, utilisateurs, données et priorités : le parcours reste concentré sur l'outil métier dont votre organisation a besoin.",
      introTitle: "Transformez votre besoin logiciel en périmètre clair.",
      introText:
        "Le diagnostic identifie les process à simplifier, les modules utiles, les données à centraliser et les rôles à prévoir.",
    },
    repair: {
      kicker: "Diagnostic réparation PC",
      title: "Décrire votre panne sans passer par des questions hors sujet.",
      text:
        "Écran cassé, mot de passe perdu, lenteur, virus, démarrage, batterie ou données : le parcours cible uniquement le problème informatique.",
      introTitle: "Expliquez le symptôme et l'urgence en quelques étapes.",
      introText:
        "Les questions portent sur le type d'appareil, les symptômes, la priorité et les données à préserver avant intervention.",
    },
    "home-support": {
      kicker: "Diagnostic assistance à domicile",
      title: "Préparer une assistance informatique à domicile sans questions inutiles.",
      text:
        "Dépannage chez vous, internet, installation, sécurité, prise en main et crédit d'impôt : le parcours reste concentré sur une intervention à domicile.",
      introTitle: "Expliquez votre besoin et préparez le reste à charge 50%.",
      introText:
        "Les questions portent sur l'aide attendue, l'environnement à domicile, l'urgence et le crédit d'impôt de 50% sous conditions.",
    },
    camera: {
      kicker: "Diagnostic caméras de surveillance",
      title: "Préparer votre installation sans questions hors sujet.",
      text:
        "Zones à couvrir, intérieur, extérieur, alertes, départs en vacances et suivi à distance : le parcours reste concentré sur la protection du domicile.",
      introTitle: "Cadrez votre besoin caméra de manière simple et utile.",
      introText:
        "Les questions portent sur les zones, l'objectif, le contexte du logement et la façon dont vous souhaitez suivre le système au quotidien.",
    },
    hardware: {
      kicker: "Diagnostic matériel informatique",
      title: "Préparer une configuration adaptée à votre usage réel.",
      text:
        "PC portable, fixe, écran, RAM, stockage, mobilité, logiciels et accessoires : le parcours aide à éviter l'achat mal dimensionné.",
      introTitle: "Choisissez le bon matériel avec des critères lisibles.",
      introText:
        "Le diagnostic collecte l'usage, le format souhaité, la mémoire, le stockage et les contraintes qui comptent vraiment.",
    },
    automation: {
      kicker: "Diagnostic automatisation",
      title: "Identifier les tâches à automatiser sans disperser le sujet.",
      text:
        "Relances, documents, saisie, reporting, synchronisation et validations : le parcours reste focalisé sur vos répétitions opérationnelles.",
      introTitle: "Repérez les automatisations qui valent vraiment le coup.",
      introText:
        "Les questions qualifient les tâches répétitives, les outils existants, la fréquence et le niveau de contrôle à conserver.",
    },
    ai: {
      kicker: "Diagnostic agents IA",
      title: "Cadrer un agent IA utile sans questions hors sujet.",
      text:
        "Assistant métier, qualification, support, documents, reporting, données et contrôle humain : le parcours reste concentré sur votre projet IA professionnel.",
      introTitle: "Transformez une idée d'IA en cas d'usage clair.",
      introText:
        "Le diagnostic identifie le rôle de l'agent, les sources de données, les utilisateurs, les connexions utiles et les règles de contrôle à prévoir.",
    },
    strategy: {
      kicker: "Diagnostic stratégie digitale",
      title: "Clarifier vos priorités digitales avant de produire plus.",
      text:
        "Acquisition, organisation, image, outils, roadmap et mesure : le parcours transforme vos idées en direction concrète.",
      introTitle: "Passez d'un ensemble d'idées à une feuille de route.",
      introText:
        "Le diagnostic aide à choisir les bons leviers, prioriser les actions et structurer une trajectoire digitale compréhensible.",
    },
  };

  const pageCopySelectors = {
    heroKicker: document.querySelector("[data-diag-hero-kicker]"),
    heroTitle: document.querySelector("[data-diag-hero-title]"),
    heroText: document.querySelector("[data-diag-hero-text]"),
    introKicker: document.querySelector("[data-diag-intro-kicker]"),
    introTitle: document.querySelector("[data-diag-intro-title]"),
    introText: document.querySelector("[data-diag-intro-text]"),
  };

  const applyThemedPageCopy = () => {
    if (!state.lockedRoute || !state.route) return;

    const copy = themedPageCopy[state.route];
    if (!copy) return;

    if (pageCopySelectors.heroKicker) pageCopySelectors.heroKicker.textContent = copy.kicker;
    if (pageCopySelectors.heroTitle) pageCopySelectors.heroTitle.textContent = copy.title;
    if (pageCopySelectors.heroText) pageCopySelectors.heroText.textContent = copy.text;
    if (pageCopySelectors.introKicker) pageCopySelectors.introKicker.textContent = copy.kicker;
    if (pageCopySelectors.introTitle) pageCopySelectors.introTitle.textContent = copy.introTitle;
    if (pageCopySelectors.introText) pageCopySelectors.introText.textContent = copy.introText;
  };

  const getSteps = () => [
    ...(state.lockedRoute ? [] : [firstStep]),
    ...(state.route ? routes[state.route].steps : []),
    contactStep,
  ];

  const getCurrentStep = () =>
    getSteps()[state.stepIndex] || (state.lockedRoute && state.route ? routes[state.route].steps[0] : firstStep);

  const getOptionLabel = (step, value) => {
    const option = step.options?.find((item) => item.value === value);
    return option?.label || value;
  };

  const formatAnswer = (step, answer) => {
    if (!answer) return "À préciser";
    if (Array.isArray(answer)) return answer.map((item) => getOptionLabel(step, item)).join(", ");
    return getOptionLabel(step, answer);
  };

  const isAnswered = (step) => {
    if (step.type === "contact") return true;
    if (step.type === "route") return Boolean(state.route);
    const answer = state.answers[step.id];
    return Array.isArray(answer) ? answer.length > 0 : Boolean(answer);
  };

  const estimateComplexity = () => {
    if (!state.route) return "À préciser";
    const answers = state.answers;
    const route = routes[state.route];

    if (state.route === "repair") {
      const count = answers.problemes?.length || 0;
      if (count >= 3) return "Diagnostic complet";
      if (answers.urgence === "bloque") return "Prioritaire";
      return "Intervention ciblée";
    }

    if (state.route === "hardware") {
      const count = (answers.usage?.length || 0) + (answers.contraintes?.length || 0);
      if (count >= 5 || answers.ram === "64" || answers.stockage === "2to") return "Configuration avancée";
      return "Configuration à cadrer";
    }

    if (state.route === "camera") {
      const count =
        (answers.zones_camera?.length || 0) +
        (answers.objectif_camera?.length || 0) +
        (answers.contexte_camera?.length || 0) +
        (answers.pilotage_camera?.length || 0);
      if ((answers.contexte_camera || []).includes("mixte") || count >= 8) return "Protection multi-zones";
      if (count >= 5) return "Installation cadrée";
      return "Protection ciblée";
    }

    const selectedCount = Object.values(answers).reduce((total, value) => {
      if (Array.isArray(value)) return total + value.length;
      return total + (value ? 1 : 0);
    }, 0);

    if (selectedCount >= 8) return "Projet structurant";
    if (selectedCount >= 4) return "Projet cadré";
    return route.summary;
  };

  const buildSummaryRows = () => {
    const steps = getSteps();
    const primary = steps.find((step) => step.id !== "besoin" && step.id !== "contact" && state.answers[step.id]);
    const route = state.route ? routes[state.route] : null;

    return [
      ["Besoin", route?.label || "À préciser"],
      ["Analyse", estimateComplexity()],
      [
        "Point clé",
        primary
          ? formatAnswer(primary, state.answers[primary.id])
          : route
            ? "Répondre à la première question"
            : "Choisir un besoin",
      ],
      ["Prochaine étape", route?.next || "Sélectionner un parcours"],
    ];
  };

  const setAnswer = (step, value) => {
    if (step.type === "route") {
      state.route = value;
      state.answers = { besoin: value };
      state.stepIndex = 1;
      render();
      return;
    }

    if (step.type === "multi") {
      const current = Array.isArray(state.answers[step.id]) ? [...state.answers[step.id]] : [];
      const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
      state.answers[step.id] = next;
    } else {
      state.answers[step.id] = value;
    }

    render();
  };

  const renderRail = (steps) => {
    selectors.rail.innerHTML = steps
      .map((step, index) => {
        const status = index === state.stepIndex ? "is-active" : index < state.stepIndex ? "is-done" : "";
        return `<button class="diagnostic-rail-item ${status}" type="button" data-step="${index}" ${
          index === state.stepIndex ? 'aria-current="step"' : ""
        } ${
          index > state.stepIndex || (!state.lockedRoute && index > 1 && !state.route) ? "disabled" : ""
        }><span>${String(index + 1).padStart(2, "0")}</span>${step.label}</button>`;
      })
      .join("");
  };

  const renderOptions = (step) => {
    const isContact = step.type === "contact";
    selectors.options.hidden = isContact;
    selectors.contact.hidden = !isContact;
    selectors.options.classList.toggle("is-dense", Boolean(step.dense));

    if (isContact) return;

    selectors.options.innerHTML = step.options
      .map((option, index) => {
        const answer = step.type === "route" ? state.route : state.answers[step.id];
        const active = Array.isArray(answer) ? answer.includes(option.value) : answer === option.value;
        return `<button class="diagnostic-option ${active ? "is-selected" : ""}" type="button" data-value="${option.value}" aria-pressed="${active}" style="--option-index:${index}">
          <span>${option.tag || "MBL"}</span>
          <strong>${option.label}</strong>
          <small>${option.text}</small>
        </button>`;
      })
      .join("");
  };

  const renderSummary = () => {
    const route = state.route ? routes[state.route] : null;
    selectors.summaryTitle.textContent = route?.summary || "À préciser";
    selectors.summary.innerHTML = buildSummaryRows()
      .map(([term, value]) => `<div><dt>${term}</dt><dd>${value}</dd></div>`)
      .join("");
  };

  const render = () => {
    const steps = getSteps();
    const step = getCurrentStep();
    const total = steps.length;
    const progress = Math.max(8, ((state.stepIndex + 1) / total) * 100);

    selectors.count.textContent = `Étape ${state.stepIndex + 1} sur ${total}`;
    selectors.title.textContent = step.title;
    selectors.hint.textContent = step.hint;
    selectors.progress.style.width = `${progress}%`;

    renderRail(steps);
    renderOptions(step);
    renderSummary();

    selectors.prev.disabled = state.stepIndex === 0 || state.sending;
    selectors.next.disabled = !isAnswered(step) || state.sending;
    selectors.next.textContent = step.type === "contact" ? "Envoyer la demande" : "Continuer";
    selectors.reset.disabled = state.stepIndex === 0 && !state.route;

    app.dataset.route = state.route || "start";
    app.dataset.lockedRoute = state.lockedRoute ? "true" : "false";
  };

  const submitDiagnostic = async () => {
    const form = selectors.contact;
    if (!form.reportValidity()) return;

    const contact = Object.fromEntries(new FormData(form).entries());
    const steps = getSteps();
    const readableAnswers = {};

    steps.forEach((step) => {
      if (step.id === "contact") return;
      const answer = step.type === "route" ? state.route : state.answers[step.id];
      if (!answer) return;
      readableAnswers[step.label] = formatAnswer(step, answer);
    });

    const payload = {
      source: "diagnostic-premium",
      page: document.title,
      submittedAt: new Date().toISOString(),
      ...(window.MBLData?.pageContext?.() || { page_path: window.location.pathname }),
      besoin: state.route ? routes[state.route].label : "À préciser",
      synthese: estimateComplexity(),
      reponses: readableAnswers,
      ...contact,
    };

    state.sending = true;
    selectors.status.textContent = "Envoi de votre diagnostic...";
    render();

    try {
      const dataResult = window.MBLData?.submitDiagnostic
        ? await window.MBLData.submitDiagnostic(payload)
        : { ok: false, skipped: true };

      if (!dataResult?.ok) {
        const response = await fetch(app.getAttribute("data-endpoint") || "/api/diagnostic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Request failed");
      }

      selectors.status.textContent = "Diagnostic reçu. Nous revenons vers vous rapidement.";
      selectors.next.textContent = "Demande envoyée";
      selectors.next.disabled = true;
    } catch (error) {
      const subject = encodeURIComponent("Diagnostic MY BUSINESS LIFE");
      const body = encodeURIComponent(
        [
          `Besoin: ${payload.besoin}`,
          `Synthèse: ${payload.synthese}`,
          `Nom: ${payload.nom}`,
          `Email: ${payload.email}`,
          `Téléphone: ${payload.telephone || ""}`,
          `Profil: ${payload.profil || ""}`,
          "",
          "Réponses:",
          ...Object.entries(payload.reponses).map(([key, value]) => `${key}: ${value}`),
          "",
          `Message: ${payload.message || ""}`,
        ].join("\n"),
      );

      selectors.status.textContent =
        "Le serveur de formulaire n'est pas disponible ici. Votre email va s'ouvrir avec la demande préparée.";

      window.setTimeout(() => {
        window.location.href = `mailto:contact@mybusinesslife.fr?subject=${subject}&body=${body}`;
      }, 550);
    } finally {
      state.sending = false;
      render();
    }
  };

  selectors.options.addEventListener("click", (event) => {
    const button = event.target.closest("[data-value]");
    if (!button) return;
    setAnswer(getCurrentStep(), button.dataset.value);
  });

  selectors.rail.addEventListener("click", (event) => {
    const button = event.target.closest("[data-step]");
    if (!button || button.disabled) return;
    state.stepIndex = Number(button.dataset.step);
    render();
  });

  selectors.prev.addEventListener("click", () => {
    state.stepIndex = Math.max(0, state.stepIndex - 1);
    render();
  });

  selectors.next.addEventListener("click", () => {
    const step = getCurrentStep();
    if (step.type === "contact") {
      submitDiagnostic();
      return;
    }

    if (!isAnswered(step)) return;
    state.stepIndex = Math.min(getSteps().length - 1, state.stepIndex + 1);
    render();
  });

  selectors.reset.addEventListener("click", () => {
    const lockedRoute = state.lockedRoute ? state.route : "";
    state.route = lockedRoute;
    state.stepIndex = 0;
    state.answers = lockedRoute ? { besoin: lockedRoute } : {};
    selectors.contact.reset();
    selectors.status.textContent = "";
    render();
  });

  const params = new URLSearchParams(window.location.search);
  const routeFromUrl = alias[
    (params.get("theme") || params.get("type") || params.get("service") || params.get("parcours") || "").toLowerCase()
  ];
  if (routeFromUrl && routes[routeFromUrl]) {
    state.route = routeFromUrl;
    state.lockedRoute = true;
    state.answers = { besoin: routeFromUrl };
    state.stepIndex = 0;
    applyThemedPageCopy();
  }

  window.render_diagnostic_to_text = () => ({
    route: state.route,
    lockedRoute: state.lockedRoute,
    stepIndex: state.stepIndex,
    totalSteps: getSteps().length,
    title: getCurrentStep().title,
    hint: getCurrentStep().hint,
    answers: state.answers,
    summary: buildSummaryRows(),
    canContinue: !selectors.next.disabled,
    contactVisible: !selectors.contact.hidden,
    optionCount: selectors.options.querySelectorAll(".diagnostic-option").length,
    noTariffDisplayed: !document.body.innerText.toLowerCase().includes("€"),
  });

  render();
})();
