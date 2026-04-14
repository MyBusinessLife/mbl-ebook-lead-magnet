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
      value: "repair",
      label: "Réparation PC",
      tag: "PC",
      text: "Panne, écran cassé, mot de passe, virus, lenteur ou données.",
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
    materiel: "hardware",
    hardware: "hardware",
    achat: "hardware",
    automatisation: "automation",
    automation: "automation",
    strategie: "strategy",
    strategy: "strategy",
  };

  const getSteps = () => [firstStep, ...(state.route ? routes[state.route].steps : []), contactStep];

  const getCurrentStep = () => getSteps()[state.stepIndex] || firstStep;

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
      ["Point clé", primary ? formatAnswer(primary, state.answers[primary.id]) : "Choisir un besoin"],
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
          index > state.stepIndex || (index > 1 && !state.route) ? "disabled" : ""
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
      besoin: state.route ? routes[state.route].label : "À préciser",
      synthese: estimateComplexity(),
      reponses: readableAnswers,
      ...contact,
    };

    state.sending = true;
    selectors.status.textContent = "Envoi de votre diagnostic...";
    render();

    try {
      const response = await fetch(app.getAttribute("data-endpoint") || "/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Request failed");

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
    state.route = "";
    state.stepIndex = 0;
    state.answers = {};
    selectors.contact.reset();
    selectors.status.textContent = "";
    render();
  });

  const params = new URLSearchParams(window.location.search);
  const routeFromUrl = alias[(params.get("type") || params.get("service") || "").toLowerCase()];
  if (routeFromUrl && routes[routeFromUrl]) {
    state.route = routeFromUrl;
    state.answers = { besoin: routeFromUrl };
    state.stepIndex = 1;
  }

  window.render_diagnostic_to_text = () => ({
    route: state.route,
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
