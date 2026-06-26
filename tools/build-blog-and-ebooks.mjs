import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const blogDir = path.join(root, "blog");
fs.mkdirSync(blogDir, { recursive: true });

const site = "https://mybusinesslife.fr";
const updated = "2026-04-17";

const articles = [
  {
    slug: "logiciel-sur-mesure-vs-saas",
    category: "Logiciel sur-mesure",
    readTime: "7 min",
    title: "Logiciel sur-mesure ou SaaS : comment choisir sans ralentir votre entreprise",
    description:
      "Comparez logiciel sur-mesure et SaaS pour choisir l'outil le plus adapté à vos process, vos données, votre budget et vos objectifs de croissance.",
    keyword: "logiciel sur-mesure vs SaaS",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=82",
    alt: "Tableau de bord logiciel avec indicateurs de performance",
    accent: "APP",
    sections: [
      {
        heading: "Le bon outil est celui qui colle à votre métier",
        html: [
          "Un SaaS peut être excellent quand votre besoin est standard, rapide à déployer et peu différenciant. Le logiciel sur-mesure devient pertinent dès que votre méthode de travail, vos données ou vos règles métier créent votre avantage.",
          "La vraie question n'est donc pas “SaaS ou sur-mesure ?”. La vraie question est : quelle partie de votre activité mérite un outil pensé pour elle ?",
        ],
        bullets: ["Process spécifiques", "Données sensibles ou dispersées", "Besoins de reporting métier", "Équipe qui perd du temps en ressaisie"],
      },
      {
        heading: "Le coût caché des outils standards",
        html: [
          "Les abonnements semblent simples au départ. Mais lorsque chaque service ajoute son propre outil, les données se fragmentent et les équipes compensent à la main.",
          "Les coûts visibles sont les licences. Les coûts invisibles sont les heures perdues, les erreurs, les doublons et les décisions prises avec des informations incomplètes.",
        ],
      },
      {
        heading: "Quand le sur-mesure devient une décision rentable",
        html: [
          "Un logiciel sur-mesure est intéressant quand il automatise des actions répétées, centralise l'information et réduit les frictions opérationnelles. Il doit produire un gain mesurable : temps économisé, meilleure visibilité, moins d'erreurs, meilleure expérience client.",
          "Chez MY BUSINESS LIFE, l'approche consiste à cadrer le besoin avant de développer : comprendre les usages, prioriser les fonctionnalités et livrer une base évolutive.",
        ],
      },
      {
        heading: "La méthode simple pour choisir",
        html: ["Listez les tâches répétitives, les outils utilisés, les données critiques et les irritants quotidiens. Si le même problème revient chaque semaine, il mérite probablement un outil plus intelligent."],
        bullets: ["Gardez le SaaS pour les besoins génériques", "Créez du sur-mesure pour les process différenciants", "Connectez les données plutôt que multiplier les exports", "Mesurez le gain attendu avant de décider"],
      },
    ],
    checklistTitle: "Signaux qu'un logiciel sur-mesure devient pertinent",
    checklist: ["Votre équipe ressaisit les mêmes informations", "Votre reporting dépend d'exports manuels", "Vos outils ne communiquent pas", "Votre activité a des règles métier propres", "Vous voulez piloter en temps réel"],
    ctaTitle: "Vous hésitez entre SaaS et logiciel métier ?",
    ctaText: "Décrivez votre fonctionnement actuel et obtenez une première lecture claire du meilleur scénario.",
    ctaUrl: "/diagnostic.html?theme=software#diagnostic-simulator",
    ctaLabel: "Qualifier mon besoin logiciel",
    related: ["automatiser-taches-repetitives", "dashboard-business", "agents-ia-entreprise"],
  },
  {
    slug: "site-internet-moderne-dashboard",
    category: "Site internet",
    readTime: "6 min",
    title: "Pourquoi un site internet moderne doit suivre ses visites avec un dashboard",
    description:
      "Un site moderne ne se limite pas au design : il doit mesurer les visites, les clics, les formulaires et les pages qui convertissent.",
    keyword: "site internet moderne dashboard",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=82",
    alt: "Ordinateur affichant des statistiques de site internet",
    accent: "WEB",
    sections: [
      {
        heading: "Un site vitrine sans mesure avance à l'aveugle",
        html: [
          "Avoir un beau site est important. Savoir ce qu'il produit l'est encore plus. Sans suivi des visites, vous ne savez pas quelles pages attirent, rassurent ou bloquent vos prospects.",
          "Un dashboard transforme votre site en outil de pilotage : sources de trafic, pages consultées, clics sur les CTA, demandes reçues et améliorations prioritaires.",
        ],
      },
      {
        heading: "Les indicateurs qui changent vraiment les décisions",
        html: ["Le bon dashboard ne noie pas l'utilisateur sous les chiffres. Il montre les signaux qui aident à décider rapidement."],
        bullets: ["Pages les plus consultées", "Clics sur les boutons clés", "Demandes de contact", "Sources de trafic", "Taux de rebond et parcours mobile"],
      },
      {
        heading: "Design premium et conversion vont ensemble",
        html: [
          "Une interface moderne améliore la perception de sérieux. Mais la conversion vient de la clarté : promesse lisible, preuve, CTA visibles, formulaire simple et contenu rassurant.",
          "MY BUSINESS LIFE conçoit des sites qui donnent envie de contacter, tout en gardant une lecture mesurable de ce qui fonctionne.",
        ],
      },
      {
        heading: "Le site devient un actif vivant",
        html: [
          "Un site performant n'est pas figé. Il évolue grâce aux données : une page se simplifie, un CTA se déplace, une offre devient plus claire, une ressource attire de nouveaux visiteurs.",
          "Le suivi permet d'améliorer par petites décisions régulières plutôt que par refonte lourde tous les trois ans.",
        ],
      },
    ],
    checklistTitle: "Ce qu'un site moderne devrait mesurer",
    checklist: ["Visites par source", "Pages qui génèrent des demandes", "Clics sur les CTA", "Performance mobile", "Formulaires envoyés", "Contenus les plus consultés"],
    ctaTitle: "Votre site mérite une lecture claire.",
    ctaText: "Cadrez votre projet web et identifiez les fonctionnalités utiles : tracking, dashboard, formulaire intelligent, SEO et conversion.",
    ctaUrl: "/diagnostic.html?theme=web#diagnostic-simulator",
    ctaLabel: "Cadrer mon projet web",
    related: ["refonte-site-web", "site-web-seo-local", "dashboard-business"],
  },
  {
    slug: "agents-ia-entreprise",
    category: "Agents IA",
    readTime: "8 min",
    title: "Agents IA en entreprise : les cas d'usage vraiment utiles",
    description:
      "Découvrez comment les agents IA peuvent qualifier des demandes, préparer des réponses, analyser des documents et automatiser des workflows sans perdre le contrôle.",
    keyword: "agents IA entreprise",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=82",
    alt: "Interface abstraite représentant une intelligence artificielle connectée",
    accent: "IA",
    sections: [
      {
        heading: "Un agent IA n'est pas un gadget",
        html: [
          "Un agent IA utile ne se contente pas de répondre à des questions. Il doit comprendre un objectif, utiliser des données cadrées, respecter des règles et préparer une action exploitable.",
          "La différence se fait dans l'intégration : un agent connecté à vos formulaires, vos documents, votre CRM ou vos workflows devient un véritable assistant métier.",
        ],
      },
      {
        heading: "Les cas d'usage les plus rentables",
        html: ["Les meilleurs sujets sont souvent les plus simples : ceux qui reviennent tous les jours et mobilisent du temps humain sans créer beaucoup de valeur."],
        bullets: ["Qualification de demandes entrantes", "Synthèse de documents", "Préparation de réponses client", "Analyse de tickets support", "Compte rendu et reporting", "Aide à la décision commerciale"],
      },
      {
        heading: "Le contrôle humain reste indispensable",
        html: [
          "Un agent IA doit travailler avec des garde-fous : validation humaine, sources identifiées, limites claires, historique des actions et données protégées.",
          "Chez MY BUSINESS LIFE, l'objectif n'est pas de remplacer la compétence humaine, mais d'enlever les tâches répétitives autour de cette compétence.",
        ],
      },
      {
        heading: "Comment démarrer sans se disperser",
        html: [
          "Le bon départ consiste à choisir un seul parcours : par exemple qualifier les demandes, préparer des devis, trier des tickets ou résumer des documents.",
          "On mesure ensuite le temps gagné, la qualité des réponses et les actions déclenchées avant d'étendre l'agent à d'autres usages.",
        ],
      },
    ],
    checklistTitle: "Préparer un projet agent IA",
    checklist: ["Choisir un cas d'usage précis", "Identifier les données utiles", "Définir les règles de validation", "Prévoir les intégrations", "Mesurer le temps gagné"],
    ctaTitle: "Vous voulez un agent IA utile, pas un chatbot gadget ?",
    ctaText: "Le diagnostic IA aide à cadrer le bon cas d'usage et les connexions nécessaires.",
    ctaUrl: "/diagnostic.html?theme=ai#diagnostic-simulator",
    ctaLabel: "Cadrer mes agents IA",
    related: ["automatiser-taches-repetitives", "logiciel-sur-mesure-vs-saas", "dashboard-business"],
  },
  {
    slug: "automatiser-taches-repetitives",
    category: "Automatisation",
    readTime: "7 min",
    title: "Automatiser les tâches répétitives : par où commencer sans se tromper",
    description:
      "Méthode simple pour identifier les tâches à automatiser, éviter les automatismes fragiles et créer des gains de temps mesurables.",
    keyword: "automatiser tâches répétitives entreprise",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=82",
    alt: "Personne travaillant sur un ordinateur portable avec des outils digitaux",
    accent: "AUTO",
    sections: [
      {
        heading: "Commencez par les irritants quotidiens",
        html: [
          "L'automatisation réussie part rarement d'une technologie. Elle part d'un irritant : copier-coller des données, envoyer les mêmes relances, vérifier des informations, créer des documents répétitifs.",
          "Le meilleur premier projet est celui qui se répète souvent, qui suit des règles claires et qui consomme du temps sans demander une forte expertise.",
        ],
      },
      {
        heading: "Les workflows faciles à fiabiliser",
        html: ["Certains flux se prêtent particulièrement bien à l'automatisation car ils ont des déclencheurs simples et des étapes prévisibles."],
        bullets: ["Notification après formulaire", "Création de fiche client", "Relance automatique", "Synchronisation d'outils", "Génération de documents", "Reporting hebdomadaire"],
      },
      {
        heading: "Attention aux automatisations bricolées",
        html: [
          "Une automatisation fragile peut créer plus de stress que de gain. Il faut prévoir les erreurs, les données manquantes, les doublons et les exceptions.",
          "Un flux professionnel doit être observable : vous devez savoir ce qui s'est déclenché, ce qui a échoué et comment corriger.",
        ],
      },
      {
        heading: "Mesurer avant d'étendre",
        html: [
          "Avant d'automatiser toute l'entreprise, mesurez un premier flux : temps gagné, erreurs évitées, satisfaction équipe, visibilité sur les demandes.",
          "Cette méthode permet de construire une automatisation solide, puis de l'étendre progressivement.",
        ],
      },
    ],
    checklistTitle: "Un bon candidat à l'automatisation",
    checklist: ["Se répète souvent", "Suit des règles claires", "Consomme du temps", "Crée des erreurs humaines", "Peut être mesuré facilement"],
    ctaTitle: "Un flux vous fait perdre du temps chaque semaine ?",
    ctaText: "Décrivez-le et obtenez un parcours clair pour l'automatiser proprement.",
    ctaUrl: "/diagnostic.html?theme=automation#diagnostic-simulator",
    ctaLabel: "Identifier mes automatisations",
    related: ["agents-ia-entreprise", "logiciel-sur-mesure-vs-saas", "diagnostic-digital"],
  },
  {
    slug: "reparation-pc-lent",
    category: "Réparation ordinateur",
    readTime: "6 min",
    title: "PC lent : les causes fréquentes et les bonnes solutions",
    description:
      "Votre ordinateur est lent ? Comprenez les causes possibles : stockage saturé, mémoire insuffisante, virus, disque fatigué, logiciels trop lourds ou système mal optimisé.",
    keyword: "pc lent réparation ordinateur",
    image: "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1400&q=82",
    alt: "Réparation et diagnostic de matériel informatique",
    accent: "PC",
    sections: [
      {
        heading: "Un PC lent n'a pas toujours besoin d'être remplacé",
        html: [
          "Quand un ordinateur ralentit, la première réaction est souvent de penser qu'il est trop vieux. Pourtant, beaucoup de lenteurs viennent d'un stockage saturé, d'un disque fatigué, d'un manque de mémoire ou de logiciels mal configurés.",
          "Un diagnostic évite de payer pour une solution inutile : parfois une optimisation suffit, parfois une réparation est pertinente, parfois le remplacement est plus rationnel.",
        ],
      },
      {
        heading: "Les symptômes à observer",
        html: ["Avant l'intervention, notez les moments où le problème apparaît. Cette observation aide énormément à orienter le diagnostic."],
        bullets: ["Démarrage très long", "Ventilateur bruyant", "Applications qui se bloquent", "Navigateur lent", "Messages d'erreur", "Batterie qui chute rapidement"],
      },
      {
        heading: "Les solutions possibles",
        html: [
          "Selon le cas, la solution peut être logicielle ou matérielle : nettoyage du système, suppression de programmes inutiles, vérification sécurité, migration SSD, ajout de RAM ou récupération de données.",
          "L'objectif est de choisir l'action qui améliore vraiment l'usage quotidien, sans vendre une intervention disproportionnée.",
        ],
      },
      {
        heading: "Quand demander de l'aide",
        html: [
          "Si l'ordinateur contient des données importantes, évitez les manipulations au hasard. Une mauvaise action peut compliquer une récupération ou aggraver une panne disque.",
          "MY BUSINESS LIFE propose un parcours de diagnostic pour qualifier rapidement le symptôme et préparer une demande claire.",
        ],
      },
    ],
    checklistTitle: "À vérifier avant de faire réparer",
    checklist: ["Depuis quand le PC ralentit", "Espace disque disponible", "Messages d'erreur", "Dernière sauvegarde", "Usage principal", "Données importantes à protéger"],
    ctaTitle: "Votre ordinateur ralentit votre journée ?",
    ctaText: "Décrivez le symptôme et obtenez une demande de diagnostic claire.",
    ctaUrl: "/diagnostic.html?theme=repair#diagnostic-simulator",
    ctaLabel: "Lancer le diagnostic PC",
    related: ["assistance-informatique-domicile-credit-impot", "choisir-ordinateur-professionnel", "securite-informatique"],
  },
  {
    slug: "assistance-informatique-domicile-credit-impot",
    category: "Assistance à domicile",
    readTime: "7 min",
    title: "Assistance informatique à domicile : comprendre le crédit d'impôt de 50%",
    description:
      "Explication simple du crédit d'impôt pour assistance informatique et internet à domicile, du plafond spécifique et du reste à charge possible.",
    keyword: "assistance informatique domicile crédit d'impôt",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=1400&q=82",
    alt: "Technicien aidant une personne à domicile avec son ordinateur",
    accent: "HOME",
    sections: [
      {
        heading: "Le principe en une phrase",
        html: [
          "L'assistance informatique et internet à domicile fait partie des services à la personne pouvant ouvrir droit, sous conditions, à un crédit d'impôt égal à 50% des dépenses payées.",
          "L'administration fiscale précise une limite spécifique de 3 000 € par an et par foyer fiscal pour l'assistance informatique et internet à domicile. Vous pouvez consulter la source officielle sur <a href=\"https://www.impots.gouv.fr/particulier/questions/jai-regle-une-facture-pour-un-depannage-informatique-mon-domicile-puis-je\" target=\"_blank\" rel=\"noopener\">impots.gouv.fr</a>.",
        ],
      },
      {
        heading: "Ce que cela change pour le client",
        html: [
          "Concrètement, le dispositif peut réduire fortement le coût réel d'une intervention éligible. Selon les modalités disponibles, l'avance immédiate peut même permettre de ne régler que le reste à charge.",
          "La formulation doit rester précise : le bénéfice dépend de votre situation, de l'éligibilité de la prestation et des règles fiscales applicables.",
        ],
      },
      {
        heading: "Les besoins souvent concernés",
        html: ["L'assistance à domicile couvre surtout l'aide à l'usage, l'installation, la configuration et l'accompagnement informatique."],
        bullets: ["Installation d'ordinateur", "Connexion internet", "Paramétrage imprimante", "Aide email et sauvegarde", "Nettoyage logiciel", "Accompagnement outils du quotidien"],
      },
      {
        heading: "Pourquoi un diagnostic reste utile",
        html: [
          "Toutes les demandes ne relèvent pas de la même intervention. Une panne matérielle lourde, une récupération complexe ou un achat de matériel peuvent nécessiter un autre parcours.",
          "Le diagnostic MY BUSINESS LIFE sépare réparation, assistance à domicile, achat matériel et besoin professionnel pour orienter la demande sans confusion.",
        ],
      },
    ],
    checklistTitle: "Avant de demander une assistance à domicile",
    checklist: ["Décrire le problème simplement", "Préciser le matériel concerné", "Indiquer votre système", "Lister les accessoires", "Sauvegarder si possible", "Préparer vos identifiants sans les transmettre par message"],
    ctaTitle: "Vous voulez une aide informatique à domicile ?",
    ctaText: "Lancez le parcours adapté à l'assistance à domicile et préparez une demande claire.",
    ctaUrl: "/diagnostic.html?theme=home-support#diagnostic-simulator",
    ctaLabel: "Préparer mon assistance",
    related: ["reparation-pc-lent", "choisir-ordinateur-professionnel", "securite-informatique"],
  },
  {
    slug: "choisir-ordinateur-professionnel",
    category: "Matériel informatique",
    readTime: "7 min",
    title: "Choisir un ordinateur professionnel : RAM, SSD, écran et usage réel",
    description:
      "Guide simple pour choisir un ordinateur professionnel selon l'usage : bureautique, création, mobilité, logiciel métier, stockage et budget.",
    keyword: "choisir ordinateur professionnel RAM SSD",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=82",
    alt: "Ordinateur portable professionnel posé sur un bureau",
    accent: "MAT",
    sections: [
      {
        heading: "Le bon ordinateur dépend de l'usage, pas de la fiche technique seule",
        html: [
          "Un ordinateur trop faible ralentit chaque journée. Un ordinateur surdimensionné immobilise du budget inutilement. Le bon choix part de vos logiciels, de vos fichiers, de votre mobilité et de votre durée d'utilisation prévue.",
          "La RAM, le stockage SSD, l'écran, l'autonomie et la connectique doivent être choisis ensemble.",
        ],
      },
      {
        heading: "Les critères qui comptent vraiment",
        html: ["Pour un achat durable, il faut traduire les caractéristiques techniques en confort quotidien."],
        bullets: ["RAM pour garder plusieurs applications ouvertes", "SSD pour vitesse et fiabilité", "Écran adapté à la fatigue visuelle", "Autonomie si vous vous déplacez", "Connectique pour écrans et accessoires", "Garantie et réparabilité"],
      },
      {
        heading: "Éviter les mauvais arbitrages",
        html: [
          "Le piège fréquent consiste à économiser sur la RAM ou le stockage puis à perdre du temps pendant des années. À l'inverse, une configuration très puissante n'a pas d'intérêt si l'usage reste simple.",
          "MY BUSINESS LIFE aide à sélectionner une configuration cohérente avec l'activité : particulier, étudiant, indépendant, équipe administrative ou usage plus créatif.",
        ],
      },
      {
        heading: "Préparer votre demande d'achat",
        html: [
          "Avant de demander conseil, notez vos logiciels, votre usage principal, la taille des fichiers, vos besoins de mobilité et les périphériques existants.",
          "Le parcours de diagnostic matériel permet de collecter ces informations sans jargon.",
        ],
      },
    ],
    checklistTitle: "Informations utiles pour choisir",
    checklist: ["Usage principal", "Logiciels utilisés", "Besoin de mobilité", "Taille de stockage", "Nombre d'écrans", "Accessoires à connecter"],
    ctaTitle: "Vous voulez acheter le bon matériel du premier coup ?",
    ctaText: "Décrivez votre usage et recevez une demande claire pour une configuration adaptée.",
    ctaUrl: "/diagnostic.html?theme=hardware#diagnostic-simulator",
    ctaLabel: "Préparer mon achat matériel",
    related: ["reparation-pc-lent", "assistance-informatique-domicile-credit-impot", "securite-informatique"],
  },
  {
    slug: "refonte-site-web",
    category: "Développement web",
    readTime: "6 min",
    title: "Refonte de site web : les signaux qu'il est temps de moderniser",
    description:
      "Découvrez les signes qui montrent qu'un site doit être refondu : design daté, mobile faible, manque de confiance, SEO limité et demandes insuffisantes.",
    keyword: "refonte site web moderne",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=82",
    alt: "Écran de développement web et refonte de site",
    accent: "REF",
    sections: [
      {
        heading: "Votre site parle avant vous",
        html: [
          "Un visiteur se fait une opinion très vite. Si le site paraît ancien, confus ou lent, il peut douter de la qualité de votre offre avant même de lire vos contenus.",
          "Une refonte ne doit pas seulement embellir. Elle doit clarifier votre positionnement, renforcer la confiance et guider le visiteur vers l'action.",
        ],
      },
      {
        heading: "Les signaux à prendre au sérieux",
        html: ["Certains symptômes montrent que le site ne joue plus son rôle commercial."],
        bullets: ["Design daté", "Mobile peu confortable", "Messages flous", "CTA invisibles", "Pages lentes", "Aucun suivi des demandes", "SEO insuffisant"],
      },
      {
        heading: "Refondre sans tout jeter",
        html: [
          "Une bonne refonte conserve ce qui fonctionne : offres claires, pages bien référencées, preuves, contenus utiles. Elle simplifie le reste.",
          "L'audit permet de décider quelles pages garder, fusionner, enrichir ou supprimer.",
        ],
      },
      {
        heading: "Le résultat attendu",
        html: [
          "Le nouveau site doit être plus lisible, plus rapide, plus crédible et plus mesurable. Le visiteur comprend mieux, agit plus facilement et l'entreprise suit enfin les signaux utiles.",
        ],
      },
    ],
    checklistTitle: "Avant une refonte",
    checklist: ["Lister les pages importantes", "Identifier les offres à clarifier", "Analyser les demandes reçues", "Définir les CTA", "Prévoir le tracking", "Préserver les pages SEO utiles"],
    ctaTitle: "Votre site ne reflète plus votre niveau ?",
    ctaText: "Cadrez une refonte moderne, SEO et orientée conversion.",
    ctaUrl: "/diagnostic.html?theme=web#diagnostic-simulator",
    ctaLabel: "Cadrer ma refonte",
    related: ["site-internet-moderne-dashboard", "site-web-seo-local", "dashboard-business"],
  },
  {
    slug: "dashboard-business",
    category: "Pilotage",
    readTime: "7 min",
    title: "Dashboard business : les indicateurs utiles pour piloter sans se noyer",
    description:
      "Un dashboard business doit rendre les décisions plus simples : ventes, demandes, production, délais, erreurs, satisfaction et priorités.",
    keyword: "dashboard business indicateurs",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=82",
    alt: "Dashboard business affichant des indicateurs",
    accent: "DATA",
    sections: [
      {
        heading: "Un dashboard n'est pas un tableau rempli de chiffres",
        html: [
          "Un bon dashboard aide à décider. Il doit donc faire ressortir les indicateurs qui changent réellement l'action : ce qui augmente, ce qui bloque, ce qui mérite une attention immédiate.",
          "Le danger est de vouloir tout afficher. Plus il y a de chiffres, moins l'information prioritaire se voit.",
        ],
      },
      {
        heading: "Les indicateurs à choisir selon le métier",
        html: ["Chaque activité a ses signaux. L'objectif est de suivre peu d'indicateurs, mais les bons."],
        bullets: ["Demandes entrantes", "Temps de traitement", "Taux d'erreur", "Retards", "Chiffre d'affaires", "Sources de leads", "Charge équipe"],
      },
      {
        heading: "Connecter le dashboard aux outils réels",
        html: [
          "Un dashboard devient puissant quand il se connecte aux formulaires, logiciels métier, fichiers, CRM ou outils de production. La donnée remonte automatiquement et reste à jour.",
          "C'est souvent là que logiciel sur-mesure, automatisation et agents IA se complètent.",
        ],
      },
      {
        heading: "Rendre la donnée utilisable",
        html: [
          "La donnée doit être lisible par les équipes, pas seulement par les profils techniques. Des cartes, alertes, statuts et vues simples aident à agir rapidement.",
        ],
      },
    ],
    checklistTitle: "Un dashboard utile répond à ces questions",
    checklist: ["Qu'est-ce qui demande une action ?", "Qu'est-ce qui ralentit ?", "Où perd-on du temps ?", "Quelles demandes convertissent ?", "Quels chiffres doivent être suivis chaque semaine ?"],
    ctaTitle: "Vos données existent déjà, mais elles ne parlent pas assez ?",
    ctaText: "Voyons comment les centraliser dans un dashboard lisible.",
    ctaUrl: "/diagnostic.html?theme=software#diagnostic-simulator",
    ctaLabel: "Cadrer mon dashboard",
    related: ["logiciel-sur-mesure-vs-saas", "site-internet-moderne-dashboard", "automatiser-taches-repetitives"],
  },
  {
    slug: "securite-informatique",
    category: "Sécurité informatique",
    readTime: "6 min",
    title: "Sécurité informatique : les gestes simples qui évitent les gros problèmes",
    description:
      "Sauvegardes, mots de passe, mises à jour, antivirus, phishing : les bonnes bases pour protéger un ordinateur personnel ou professionnel.",
    keyword: "sécurité informatique ordinateur",
    image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&w=1400&q=82",
    alt: "Cadenas numérique représentant la sécurité informatique",
    accent: "SEC",
    sections: [
      {
        heading: "La sécurité commence par les habitudes",
        html: [
          "La plupart des problèmes graves viennent de bases négligées : mot de passe réutilisé, sauvegarde absente, mise à jour repoussée, lien frauduleux ou pièce jointe douteuse.",
          "Quelques règles simples réduisent fortement les risques du quotidien.",
        ],
      },
      {
        heading: "Les protections essentielles",
        html: ["Le but n'est pas de devenir expert en cybersécurité, mais de supprimer les failles les plus courantes."],
        bullets: ["Mots de passe uniques", "Double authentification", "Sauvegarde régulière", "Mises à jour", "Antivirus actif", "Vigilance phishing"],
      },
      {
        heading: "Particulier ou pro : le risque n'est pas le même",
        html: [
          "Un particulier veut protéger ses photos, documents, comptes et moyens de paiement. Une entreprise doit aussi protéger ses fichiers clients, accès métiers, messagerie et données commerciales.",
          "La bonne approche dépend donc de l'usage, du niveau de risque et des outils utilisés.",
        ],
      },
      {
        heading: "Quand faire vérifier son ordinateur",
        html: [
          "Si vous constatez des ralentissements soudains, fenêtres étranges, redirections navigateur ou connexions inhabituelles, mieux vaut demander un diagnostic avant de continuer à utiliser l'appareil normalement.",
        ],
      },
    ],
    checklistTitle: "Checklist sécurité de base",
    checklist: ["Sauvegarde récente", "Mots de passe uniques", "Double authentification", "Système à jour", "Antivirus actif", "Compte administrateur protégé"],
    ctaTitle: "Vous voulez vérifier un ordinateur ou sécuriser vos usages ?",
    ctaText: "Le diagnostic oriente la demande selon votre situation.",
    ctaUrl: "/diagnostic.html?theme=repair#diagnostic-simulator",
    ctaLabel: "Faire un diagnostic sécurité",
    related: ["reparation-pc-lent", "assistance-informatique-domicile-credit-impot", "choisir-ordinateur-professionnel"],
  },
  {
    slug: "diagnostic-digital",
    category: "Diagnostic",
    readTime: "5 min",
    title: "Diagnostic digital : pourquoi clarifier le besoin avant de demander un devis",
    description:
      "Un diagnostic digital évite les devis flous : site internet, logiciel, automatisation, agents IA, réparation ou achat matériel.",
    keyword: "diagnostic digital devis",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=82",
    alt: "Réunion de cadrage digital avec notes et ordinateur",
    accent: "DIAG",
    sections: [
      {
        heading: "Un bon devis commence par un bon cadrage",
        html: [
          "Demander un prix sans avoir clarifié le besoin mène souvent à des comparaisons impossibles. Deux prestataires peuvent répondre à deux visions différentes du même problème.",
          "Le diagnostic sert à transformer une idée floue en demande structurée : objectif, contexte, contraintes, urgence, utilisateurs et résultat attendu.",
        ],
      },
      {
        heading: "Chaque thème a ses propres questions",
        html: ["Un projet web, un logiciel métier, un agent IA et une réparation PC ne se qualifient pas avec les mêmes critères."],
        bullets: ["Web : objectifs, contenu, SEO, tracking", "Logiciel : process, données, utilisateurs", "IA : cas d'usage, sources, validation", "Réparation : symptôme, urgence, matériel", "Matériel : usage, RAM, stockage, mobilité"],
      },
      {
        heading: "Le client gagne en clarté",
        html: [
          "Un diagnostic bien conçu évite les allers-retours inutiles et aide le client à formuler ce qu'il veut vraiment. C'est aussi une preuve de sérieux : l'écoute vient avant la proposition.",
        ],
      },
      {
        heading: "Une expérience plus simple",
        html: [
          "Chez MY BUSINESS LIFE, le parcours diagnostic s'adapte au thème choisi pour ne montrer que les questions utiles. L'objectif est d'obtenir une demande claire sans submerger l'utilisateur.",
        ],
      },
    ],
    checklistTitle: "Ce qu'un diagnostic doit produire",
    checklist: ["Un besoin qualifié", "Une priorité claire", "Les contraintes connues", "Le bon interlocuteur", "Une prochaine action simple"],
    ctaTitle: "Vous ne savez pas par où commencer ?",
    ctaText: "Choisissez votre thème et laissez le parcours poser les bonnes questions.",
    ctaUrl: "/diagnostic.html#diagnostic-simulator",
    ctaLabel: "Lancer le diagnostic",
    related: ["automatiser-taches-repetitives", "site-internet-moderne-dashboard", "reparation-pc-lent"],
  },
  {
    slug: "site-web-seo-local",
    category: "SEO",
    readTime: "7 min",
    title: "SEO local : comment un site web peut attirer plus de clients autour de vous",
    description:
      "Structure de pages, contenus locaux, performance, avis, maillage interne et suivi des demandes : les bases d'un SEO local utile.",
    keyword: "SEO local site web",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1400&q=82",
    alt: "Recherche web et stratégie SEO locale sur ordinateur",
    accent: "SEO",
    sections: [
      {
        heading: "Le SEO local repose sur la confiance et la clarté",
        html: [
          "Pour attirer des clients proches de vous, votre site doit expliquer clairement ce que vous faites, pour qui, où et pourquoi vous êtes fiable.",
          "Le design compte, mais la structure compte autant : titres, pages services, zones desservies, preuves, FAQ et appels à l'action.",
        ],
      },
      {
        heading: "Les pages à ne pas négliger",
        html: ["Un site local performant doit répondre aux recherches concrètes des clients."],
        bullets: ["Page service claire", "Page contact complète", "Preuves et cas clients", "FAQ par besoin", "Pages ressources", "Données structurées"],
      },
      {
        heading: "Mesurer les demandes, pas seulement les visites",
        html: [
          "Le trafic seul ne suffit pas. Il faut suivre les formulaires, clics téléphone, clics email, prises de rendez-vous et pages qui précèdent la demande.",
          "Un dashboard simple permet de savoir quels contenus apportent vraiment des opportunités.",
        ],
      },
      {
        heading: "Construire dans la durée",
        html: [
          "Le SEO local progresse avec des contenus utiles, une structure propre, une performance correcte et une amélioration régulière des pages qui comptent.",
        ],
      },
    ],
    checklistTitle: "Bases SEO local à vérifier",
    checklist: ["Titre clair par page", "Ville ou zone si pertinent", "Services détaillés", "CTA visibles", "FAQ utile", "Suivi des conversions"],
    ctaTitle: "Votre site peut devenir une source de demandes mieux qualifiées.",
    ctaText: "Cadrez une création ou une refonte SEO avec suivi des conversions.",
    ctaUrl: "/diagnostic.html?theme=web#diagnostic-simulator",
    ctaLabel: "Cadrer mon site SEO",
    related: ["site-internet-moderne-dashboard", "refonte-site-web", "dashboard-business"],
  },
  {
    slug: "centre-de-formation-site-web",
    category: "Cas web",
    readTime: "5 min",
    title: "Site web pour centre de formation : crédibilité, demandes et suivi des visites",
    description:
      "Un centre de formation doit rassurer vite : programmes, preuves, financement, demandes de contact et dashboard de suivi.",
    keyword: "site web centre de formation",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=82",
    alt: "Groupe en formation autour d'un ordinateur",
    accent: "EDU",
    sections: [
      {
        heading: "Un centre de formation vend de la confiance",
        html: [
          "Avant de demander des informations, un visiteur veut comprendre le programme, le niveau, les débouchés, les modalités et la crédibilité de l'organisme.",
          "Un site moderne doit donc clarifier les parcours et rendre le contact évident.",
        ],
      },
      {
        heading: "Les contenus qui rassurent",
        html: ["Les pages doivent répondre aux objections avant même l'appel."],
        bullets: ["Programmes lisibles", "Public concerné", "Modalités", "Financement", "Témoignages", "FAQ", "Demande de rappel"],
      },
      {
        heading: "Le dashboard aide à améliorer les pages",
        html: [
          "En suivant les visites et les demandes, le centre identifie les formations les plus consultées, les pages qui rassurent et les endroits où le visiteur quitte le parcours.",
        ],
      },
      {
        heading: "Une image plus professionnelle",
        html: [
          "MY BUSINESS LIFE a accompagné un centre de formation dans une présence web plus crédible et plus lisible. Ce type de refonte aide à attirer davantage de visiteurs et à mieux transformer l'intérêt en contact.",
        ],
      },
    ],
    checklistTitle: "À prévoir pour un site de formation",
    checklist: ["Catalogue clair", "CTA par formation", "Suivi des demandes", "FAQ financement", "Preuves et avis", "Dashboard de visites"],
    ctaTitle: "Vous avez un projet de site pour une activité de formation ?",
    ctaText: "Cadrez les pages, le parcours et les indicateurs utiles.",
    ctaUrl: "/diagnostic.html?theme=web#diagnostic-simulator",
    ctaLabel: "Cadrer mon site formation",
    related: ["site-internet-moderne-dashboard", "refonte-site-web", "site-web-seo-local"],
  },
  {
    slug: "entreprise-audiovisuel-site-premium",
    category: "Cas web",
    readTime: "5 min",
    title: "Entreprise audiovisuelle : pourquoi un site premium change la perception client",
    description:
      "Pour une entreprise d'audiovisuel, le site doit montrer le niveau créatif, rassurer sur la méthode et convertir les visiteurs en demandes qualifiées.",
    keyword: "site premium entreprise audiovisuel",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1400&q=82",
    alt: "Caméra professionnelle et production audiovisuelle",
    accent: "AV",
    sections: [
      {
        heading: "L'image perçue doit être au niveau du service vendu",
        html: [
          "Une entreprise audiovisuelle vend une qualité d'exécution, un regard, une fiabilité et une capacité à raconter. Son site doit immédiatement refléter ce niveau.",
          "Un design premium, des cas clairs et un parcours fluide peuvent faire la différence entre une visite oubliée et une demande entrante.",
        ],
      },
      {
        heading: "Ce que le visiteur doit comprendre vite",
        html: ["Le visiteur doit pouvoir se projeter en quelques secondes."],
        bullets: ["Types de productions", "Style visuel", "Références", "Méthode de travail", "Délais indicatifs", "Demande de brief"],
      },
      {
        heading: "Le tracking donne de la visibilité commerciale",
        html: [
          "Les contenus les plus regardés, les clics sur les projets et les demandes de brief montrent ce qui intéresse vraiment les prospects.",
          "Cette donnée permet d'ajuster les pages et les CTA sans intuition approximative.",
        ],
      },
      {
        heading: "Un site qui rend l'offre plus crédible",
        html: [
          "MY BUSINESS LIFE a travaillé sur une présence web pour une entreprise d'audiovisuel afin de renforcer la crédibilité, clarifier l'offre et mieux valoriser les demandes.",
        ],
      },
    ],
    checklistTitle: "À soigner pour une entreprise audiovisuelle",
    checklist: ["Portfolio rapide à parcourir", "Images optimisées", "Brief clair", "CTA projet", "Preuves clients", "Dashboard de visites"],
    ctaTitle: "Votre site doit refléter votre niveau créatif.",
    ctaText: "Cadrez un site premium orienté image, preuve et demandes qualifiées.",
    ctaUrl: "/diagnostic.html?theme=web#diagnostic-simulator",
    ctaLabel: "Cadrer mon site premium",
    related: ["site-internet-moderne-dashboard", "refonte-site-web", "centre-de-formation-site-web"],
  },
];

const articlesBySlug = new Map(articles.map((article) => [article.slug, article]));

const ebooks = [
  {
    file: "ebook-agents-ia.html",
    bodyClass: "ebook-upgrade ai-ebook",
    serviceLabel: "Agents IA premium",
    metaTitle: "MY BUSINESS LIFE | Ebook agents IA pour professionnels",
    metaDescription:
      "Ebook MY BUSINESS LIFE : comprendre comment les agents IA peuvent automatiser, qualifier, synthétiser et accélérer vos équipes sans perdre le contrôle.",
    heroTitle: "Pourquoi vos équipes vont gagner du temps avec des agents IA utiles",
    heroSubtitle:
      "Découvrez comment cadrer des agents IA connectés à vos données, vos règles métier et vos workflows pour automatiser sans perdre la maîtrise.",
    trust: ["Agents IA", "PDF inclus", "Contrôle humain"],
    previewKpis: ["Brief", "Docs", "Actions"],
    previewFlow: ["Demande", "IA", "Validation", "Action"],
    mockupTitle: "Agents IA utiles",
    mockupSubtitle: "Qualification, synthèse, workflows",
    readerTitle: "Lisez l'ebook IA directement dans la page",
    readerText:
      "Un format court et concret pour comprendre où l'IA peut vraiment aider votre entreprise, avec une approche cadrée, mesurable et professionnelle.",
    studyKicker: "Automatisation intelligente",
    studyTitle: "Et si vos équipes avaient un assistant métier fiable ?",
    studyText:
      "MY BUSINESS LIFE vous aide à identifier les bons cas d'usage, connecter les données utiles et déployer des agents IA avec validation humaine, sécurité et objectifs mesurables.",
    ctaUrl: "diagnostic.html?theme=ai#diagnostic-simulator",
    source: "ebook-agents-ia",
    pdfFilename: "ebook-agents-ia-mbl.pdf",
    pdfFooterText: "Agents IA utiles, cadrés et connectés à votre métier",
    formLegend: "Mini formulaire de cadrage agents IA",
    inputLabel: "Cas d'usage envisagé",
    inputPlaceholder: "Qualifier les leads, analyser des documents, assister le support...",
    selectLabel: "Niveau d'avancement",
    selectOptions: ["Je veux comprendre les possibilités", "J'ai un cas d'usage précis", "Je veux connecter l'IA à mes outils", "Je veux sécuriser un projet IA"],
    emailPlaceholder: "vous@entreprise.fr",
    submitLabel: "Préparer mon diagnostic IA",
    pages: [
      {
        type: "cover",
        title: "Agents IA : automatiser sans perdre le contrôle",
        subtitle: "La méthode pour gagner du temps avec une IA utile, cadrée et connectée",
        signature: "MY BUSINESS LIFE",
      },
      {
        type: "cards",
        title: "Vos équipes perdent du temps sur des tâches qui se répètent ?",
        cards: [
          { title: "Demandes à trier", text: "Les messages entrants doivent être lus, compris, classés et transmis." },
          { title: "Réponses répétitives", text: "Les mêmes explications reviennent chaque semaine avec peu de valeur ajoutée." },
          { title: "Documents dispersés", text: "L'information utile existe, mais elle est lente à retrouver." },
          { title: "Reporting manuel", text: "Les synthèses et comptes rendus prennent du temps et arrivent trop tard." },
        ],
        conclusion: "Ce n'est pas seulement un problème de charge. C'est un problème d'orchestration.",
      },
      {
        type: "saas",
        title: "Le piège de l'IA gadget",
        bullets: [
          "Un chatbot générique sans contexte métier",
          "Des réponses impossibles à vérifier",
          "Aucune connexion aux outils réels",
          "Pas de validation humaine",
          "Des données sensibles mal cadrées",
        ],
        conclusion: "Une IA utile doit être intégrée, mesurable et contrôlable.",
      },
      {
        type: "stats",
        title: "Ce que l'IA peut changer quand elle est bien cadrée",
        stats: [
          { value: "24/7", label: "préqualification possible des demandes et collecte d'informations utiles." },
          { value: "x2", label: "vitesse de préparation sur des tâches documentaires répétitives." },
          { value: "0 flou", label: "sur les règles : sources, limites, validation et prochaine action." },
        ],
        conclusion: "Le gain vient du cadre, pas de la magie.",
      },
      {
        type: "benefits",
        title: "Et si l'IA préparait le travail avant vos équipes ?",
        subtitle:
          "Un agent IA peut qualifier, résumer, prioriser, préparer et orienter, pendant que l'humain garde la décision.",
        benefits: ["Qualification", "Synthèse", "Support", "Documents", "Reporting"],
      },
      {
        type: "cards",
        title: "Ce que l'agent IA change vraiment",
        cards: [
          { title: "Commercial", text: "Les demandes arrivent avec un contexte plus clair et une priorité." },
          { title: "Support", text: "Les tickets sont résumés, classés et préparés pour répondre plus vite." },
          { title: "Administratif", text: "Les documents sont analysés et les informations clés extraites." },
          { title: "Pilotage", text: "Les signaux récurrents deviennent visibles dans un dashboard." },
          { title: "Équipe", text: "Le temps humain se concentre sur la décision et la relation." },
        ],
        conclusion: "L'IA devient utile quand elle prépare une action concrète.",
      },
      {
        type: "compare",
        title: "Avant / Après",
        before: ["Demandes à lire une par une", "Réponses copiées-collées", "Documents longs à parcourir", "Priorités floues"],
        after: ["Demandes qualifiées", "Réponses préparées", "Synthèses exploitables", "Actions priorisées"],
      },
      {
        type: "case",
        title: "Cas concret : équipe commerciale et support",
        subtitle:
          "Un agent IA peut préqualifier les demandes, extraire les informations clés, proposer une synthèse et préparer la prochaine action avant validation humaine.",
        results: [
          { value: "Brief", label: "plus clair avant échange humain" },
          { value: "Temps", label: "réduit sur les tâches répétitives" },
          { value: "Contrôle", label: "validation humaine conservée" },
        ],
        conclusion: "Le bon agent IA n'agit pas à la place de l'équipe. Il accélère ce qu'elle fait déjà bien.",
      },
      {
        type: "cards",
        title: "La méthode MY BUSINESS LIFE",
        cards: [
          { title: "Cadrage", text: "On choisit un cas d'usage précis et mesurable." },
          { title: "Données", text: "On identifie les sources utiles et les limites." },
          { title: "Règles", text: "On définit ce que l'agent peut faire ou non." },
          { title: "Validation", text: "On garde une décision humaine quand elle compte." },
          { title: "Connexion", text: "On relie l'agent aux outils utiles." },
        ],
        conclusion: "Une IA premium commence par une architecture claire.",
      },
      {
        type: "final",
        title: "Et si on cadrait votre premier agent IA ?",
        subtitle:
          "Vous voulez gagner du temps sans dégrader la qualité ni perdre le contrôle ? Parlons de vos tâches répétitives et construisons un agent IA utile, sécurisé et connecté à votre métier.",
      },
    ],
  },
  {
    file: "ebook-reparation-informatique.html",
    bodyClass: "ebook-upgrade repair-ebook",
    serviceLabel: "Réparation & assistance",
    metaTitle: "MY BUSINESS LIFE | Ebook réparation informatique",
    metaDescription:
      "Ebook MY BUSINESS LIFE : comprendre les pannes ordinateur, savoir quoi vérifier et décider entre réparation, optimisation, assistance ou remplacement.",
    heroTitle: "Pourquoi votre ordinateur mérite un vrai diagnostic avant réparation",
    heroSubtitle:
      "Comprenez les symptômes, évitez les mauvaises décisions et préparez une demande claire pour PC lent, écran cassé, mot de passe perdu, données ou assistance à domicile.",
    trust: ["Diagnostic clair", "PDF inclus", "Assistance à domicile"],
    previewKpis: ["PC lent", "Écran", "Données"],
    previewFlow: ["Symptôme", "Cause", "Option", "Action"],
    mockupTitle: "Réparation PC",
    mockupSubtitle: "Diagnostic, données, assistance",
    readerTitle: "Lisez l'ebook réparation directement dans la page",
    readerText:
      "Un guide simple pour comprendre ce qui peut arriver à un ordinateur et préparer une demande lisible avant toute intervention.",
    studyKicker: "Diagnostic informatique",
    studyTitle: "Et si on identifiait la bonne solution avant d'agir ?",
    studyText:
      "MY BUSINESS LIFE vous aide à distinguer optimisation, réparation, assistance à domicile, récupération de données ou remplacement de matériel.",
    ctaUrl: "diagnostic.html?theme=repair#diagnostic-simulator",
    source: "ebook-reparation-informatique",
    pdfFilename: "ebook-reparation-informatique-mbl.pdf",
    pdfFooterText: "Réparation informatique, diagnostic clair et assistance à domicile",
    formLegend: "Mini formulaire de diagnostic informatique",
    inputLabel: "Symptôme principal",
    inputPlaceholder: "PC lent, écran cassé, mot de passe perdu, virus, données...",
    selectLabel: "Type de besoin",
    selectOptions: ["Réparation ordinateur", "Assistance à domicile", "Récupération de données", "Achat ou remplacement matériel"],
    emailPlaceholder: "vous@email.fr",
    submitLabel: "Préparer mon diagnostic PC",
    pages: [
      {
        type: "cover",
        title: "Réparation ordinateur : comprendre avant de payer trop cher",
        subtitle: "Le guide pour identifier les symptômes, protéger vos données et choisir la bonne action",
        signature: "MY BUSINESS LIFE",
      },
      {
        type: "cards",
        title: "Le problème n'est pas toujours là où on le croit",
        cards: [
          { title: "PC lent", text: "Le ralentissement peut venir du disque, de la RAM, du système ou de logiciels trop lourds." },
          { title: "Écran cassé", text: "La dalle, la nappe, la charnière ou la carte graphique peuvent être en cause." },
          { title: "Mot de passe perdu", text: "La solution dépend du système, du compte et de la protection des données." },
          { title: "Données sensibles", text: "Une mauvaise manipulation peut compliquer une récupération." },
        ],
        conclusion: "Un bon diagnostic évite une mauvaise réparation.",
      },
      {
        type: "saas",
        title: "Les erreurs fréquentes avant intervention",
        bullets: [
          "Télécharger des logiciels de nettoyage douteux",
          "Réinitialiser sans sauvegarde",
          "Forcer un disque qui fait du bruit",
          "Acheter un nouveau PC trop vite",
          "Comparer des prix sans comparer les causes",
        ],
        conclusion: "Le plus cher est souvent d'agir trop vite.",
      },
      {
        type: "stats",
        title: "Ce que vous devez protéger d'abord",
        stats: [
          { value: "Données", label: "photos, documents, factures, comptes et fichiers clients éventuels." },
          { value: "Usage", label: "ce que vous devez pouvoir faire chaque jour sans blocage." },
          { value: "Temps", label: "une solution claire évite les essais inutiles et les retours." },
        ],
        conclusion: "La réparation doit servir votre usage, pas seulement réparer une pièce.",
      },
      {
        type: "benefits",
        title: "Et si le diagnostic guidait la bonne décision ?",
        subtitle:
          "Le bon parcours distingue optimisation logicielle, réparation matérielle, assistance à domicile, récupération de données ou remplacement.",
        benefits: ["Symptôme", "Urgence", "Données", "Matériel", "Usage réel"],
      },
      {
        type: "cards",
        title: "Les situations à qualifier",
        cards: [
          { title: "Écran ou clavier", text: "Identifier la pièce, le modèle et les signes associés." },
          { title: "Lenteur", text: "Comprendre depuis quand et dans quelles applications." },
          { title: "Virus ou sécurité", text: "Repérer les alertes, comportements étranges et risques." },
          { title: "Données", text: "Définir ce qui est à sauver avant toute action." },
          { title: "Assistance", text: "Installer, configurer et accompagner à domicile si le besoin est éligible." },
        ],
        conclusion: "Chaque problème mérite ses propres questions.",
      },
      {
        type: "compare",
        title: "Réparer / Optimiser / Remplacer",
        before: ["Symptôme flou", "Aucune sauvegarde", "Action au hasard", "Coût difficile à comprendre"],
        after: ["Cause probable", "Données protégées", "Solution adaptée", "Prochaine étape claire"],
      },
      {
        type: "case",
        title: "Assistance à domicile et crédit d'impôt",
        subtitle:
          "Selon l'administration fiscale, l'assistance informatique et internet à domicile peut ouvrir droit, sous conditions, à un crédit d'impôt de 50% des dépenses, dans une limite spécifique de 3 000 € par an et par foyer fiscal.",
        results: [
          { value: "50%", label: "de crédit d'impôt potentiel sous conditions" },
          { value: "3 000€", label: "limite annuelle spécifique par foyer fiscal" },
          { value: "Domicile", label: "pour l'assistance informatique et internet" },
        ],
        conclusion:
          "Pour une aide à domicile éligible, le reste à charge peut être nettement réduit selon votre situation.",
      },
      {
        type: "cards",
        title: "Checklist avant de demander de l'aide",
        cards: [
          { title: "Symptôme", text: "Décrivez ce qui se passe avec des mots simples." },
          { title: "Moment", text: "Notez depuis quand et après quel événement." },
          { title: "Modèle", text: "Indiquez marque, modèle et système si possible." },
          { title: "Données", text: "Précisez ce qui doit absolument être protégé." },
          { title: "Usage", text: "Expliquez ce que vous voulez pouvoir refaire rapidement." },
        ],
        conclusion: "Une demande claire accélère la bonne prise en charge.",
      },
      {
        type: "final",
        title: "Et si on qualifiait votre problème informatique ?",
        subtitle:
          "PC lent, écran cassé, mot de passe perdu, virus, données ou assistance à domicile : lancez le diagnostic et préparez une demande claire, sans jargon inutile.",
      },
    ],
  },
];

function nav(prefix = "") {
  const href = (target) => `${prefix}${target}`;
  return `
    <header class="site-header" aria-label="Navigation principale">
      <a class="brand" href="${href("index.html")}" aria-label="MY BUSINESS LIFE">
        <span class="brand-mark"><img src="${href("assets/logo.png")}" alt="" /></span>
        <span class="brand-copy">
          <strong>MY BUSINESS LIFE</strong>
          <small>Digital, organisation, croissance</small>
        </span>
      </a>
      <button class="menu-toggle" type="button" aria-controls="site-navigation" aria-expanded="false">Menu</button>
      <nav id="site-navigation" class="site-nav" aria-label="Menu du site">
        <a href="${href("index.html")}">Accueil</a>
        <a href="${href("services.html")}">Services</a>
        <div class="nav-group">
          <button class="nav-link nav-menu-button" type="button" aria-expanded="false">Particuliers</button>
          <div class="nav-dropdown">
            <a href="${href("particuliers.html")}"><span>Vue d'ensemble</span><small>Domicile, réparation, conseil et matériel.</small></a>
            <a href="${href("assistance-informatique-domicile.html")}"><span>Assistance à domicile</span><small>Dépannage chez vous, crédit d'impôt 50%.</small></a>
            <a href="${href("reparation-ordinateur.html")}"><span>Réparation ordinateur</span><small>PC lent, écran, mot de passe, données.</small></a>
            <a href="${href("achat-materiel-informatique.html")}"><span>Achat matériel</span><small>PC, RAM, stockage, écran et usage.</small></a>
          </div>
        </div>
        <div class="nav-group">
          <button class="nav-link nav-menu-button" type="button" aria-expanded="false">Professionnels</button>
          <div class="nav-dropdown">
            <a href="${href("professionnels.html")}"><span>Vue d'ensemble</span><small>Acquisition, organisation et croissance.</small></a>
            <a href="${href("developpement-web.html")}"><span>Développement web</span><small>Sites premium, SEO et conversion.</small></a>
            <a href="${href("logiciel-sur-mesure.html")}"><span>Logiciel sur-mesure</span><small>Outils métier, dashboards et automatisation.</small></a>
            <a href="${href("automatisation.html")}"><span>Automatisation</span><small>Flux, relances et tâches répétitives.</small></a>
            <a href="${href("agents-ia.html")}"><span>Agents IA</span><small>Assistants métier, workflows et automatisation intelligente.</small></a>
            <a href="${href("strategie-digitale.html")}"><span>Stratégie digitale</span><small>Audit, priorités et feuille de route.</small></a>
          </div>
        </div>
        <a href="${href("diagnostic.html")}">Diagnostic</a>
        <div class="nav-group">
          <button class="nav-link nav-menu-button" type="button" aria-expanded="false">Ressources</button>
          <div class="nav-dropdown">
            <a href="${href("cas-clients.html")}"><span>Cas clients</span><small>Exemples de transformation digitale.</small></a>
            <a href="${href("blog.html")}"><span>Blog</span><small>Guides SEO, IA, web et informatique.</small></a>
            <a href="${href("credit-impot-assistance-informatique.html")}"><span>Crédit d'impôt</span><small>Comprendre le reste à charge 50%.</small></a>
            <a href="${href("jeux.html")}"><span>Jeux</span><small>Puissance 4 MY BUSINESS LIFE.</small></a>
            <a href="${href("ebook.html")}"><span>Ebook logiciel</span><small>Automatiser et centraliser votre activité.</small></a>
            <a href="${href("ebook-site-internet.html")}"><span>Ebook site internet</span><small>Moderniser, suivre et convertir.</small></a>
            <a href="${href("ebook-agents-ia.html")}"><span>Ebook agents IA</span><small>Automatiser sans perdre le contrôle.</small></a>
            <a href="${href("ebook-reparation-informatique.html")}"><span>Ebook réparation</span><small>Diagnostiquer avant d'intervenir.</small></a>
          </div>
        </div>
        <a href="${href("a-propos.html")}">À propos</a>
        <a href="${href("espace-client.html")}">Espace client</a>
        <a class="nav-cta" href="${href("contact.html")}">Contact</a>
      </nav>
    </header>`;
}

function footer(prefix = "") {
  const href = (target) => `${prefix}${target}`;
  return `
    <footer class="site-footer premium-footer" aria-label="Pied de page">
      <div class="footer-shell">
        <div>
          <a class="brand footer-brand" href="${href("index.html")}" aria-label="MY BUSINESS LIFE">
            <span class="brand-mark"><img src="${href("assets/logo.png")}" alt="" /></span>
            <span class="brand-copy">
              <strong>MY BUSINESS LIFE</strong>
              <small>Digital, organisation, croissance</small>
            </span>
          </a>
          <p>Des expériences digitales et informatiques premium, pensées pour être simples à comprendre et solides à utiliser.</p>
        </div>
        <div class="footer-column">
          <strong>Services</strong>
          <a href="${href("developpement-web.html")}">Développement web</a>
          <a href="${href("logiciel-sur-mesure.html")}">Logiciel sur-mesure</a>
          <a href="${href("automatisation.html")}">Automatisation</a>
          <a href="${href("agents-ia.html")}">Agents IA</a>
          <a href="${href("assistance-informatique-domicile.html")}">Assistance à domicile</a>
          <a href="${href("reparation-ordinateur.html")}">Réparation ordinateur</a>
          <a href="${href("achat-materiel-informatique.html")}">Achat matériel</a>
        </div>
        <div class="footer-column">
          <strong>Parcours</strong>
          <a href="${href("particuliers.html")}">Particuliers</a>
          <a href="${href("professionnels.html")}">Professionnels</a>
          <a href="${href("diagnostic.html")}">Diagnostic en ligne</a>
          <a href="${href("espace-client.html")}">Espace client</a>
          <a href="${href("contact.html")}">Demander une étude</a>
        </div>
        <div class="footer-column">
          <strong>Ressources</strong>
          <a href="${href("cas-clients.html")}">Cas clients</a>
          <a href="${href("blog.html")}">Blog</a>
          <a href="${href("credit-impot-assistance-informatique.html")}">Crédit d'impôt informatique</a>
          <a href="${href("jeux.html")}">Jeux</a>
          <a href="${href("ebook.html")}">Ebook logiciel</a>
          <a href="${href("ebook-site-internet.html")}">Ebook site internet</a>
          <a href="${href("ebook-agents-ia.html")}">Ebook agents IA</a>
          <a href="${href("ebook-reparation-informatique.html")}">Ebook réparation</a>
          <a href="mailto:contact@mybusinesslife.fr">contact@mybusinesslife.fr</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 MY BUSINESS LIFE. Tous droits réservés.</span>
        <span><a href="${href("mentions-legales.html")}">Mentions légales</a> · <a href="${href("conditions-utilisation.html")}">CGU</a> · <a href="${href("cgv.html")}">CGV</a> · <a href="${href("confidentialite.html")}">Confidentialité</a> · <a href="${href("cookies.html")}">Cookies</a> · <a href="${href("accessibilite.html")}">Accessibilité</a></span>
      </div>
    </footer>`;
}

function scripts(prefix = "") {
  return `
    <script src="${prefix}site-config.js?v=4"></script>
    <script src="${prefix}site-data.js?v=7"></script>
    <script src="${prefix}premium-site.js?v=29"></script>`;
}

function articleCard(article, index, prefix = "") {
  return `
    <a class="article-card blog-card-pro" href="${prefix}blog/${article.slug}.html" data-animate style="--delay:${Math.min(index * 45, 240)}ms" data-spotlight>
      <figure>
        <img src="${article.image}" alt="${article.alt}" loading="lazy" decoding="async" />
        <span>${article.accent}</span>
      </figure>
      <div>
        <span class="compact-label">${article.category}</span>
        <h3>${article.title}</h3>
        <p>${article.description}</p>
        <small>${article.readTime} · Guide SEO</small>
      </div>
    </a>`;
}

function blogIndex() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog MY BUSINESS LIFE",
    url: `${site}/blog.html`,
    description: "Guides SEO, web, logiciel, agents IA, automatisation et informatique.",
    publisher: { "@type": "Organization", name: "MY BUSINESS LIFE", url: site },
    blogPost: articles.map((article) => ({
      "@type": "BlogPosting",
      headline: article.title,
      url: `${site}/blog/${article.slug}.html`,
      image: article.image,
      datePublished: updated,
      dateModified: updated,
    })),
  };

  const featured = articles[0];
  const categories = [...new Set(articles.map((article) => article.category))];

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Blog MY BUSINESS LIFE : guides SEO sur site internet moderne, logiciel sur-mesure, automatisation, agents IA, réparation ordinateur, assistance à domicile et matériel informatique." />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${site}/blog.html" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Blog digital, IA, web et informatique | MY BUSINESS LIFE" />
    <meta property="og:description" content="Des guides premium et actionnables pour mieux choisir vos outils, votre site, vos automatisations, vos agents IA et vos solutions informatiques." />
    <meta property="og:image" content="${featured.image}" />
    <title>Blog digital, IA, web et informatique | MY BUSINESS LIFE</title>
    <link rel="stylesheet" href="premium-site.css?v=31" />
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
  </head>
  <body class="premium-page blog-hub-page">
    ${nav("")}
    <main class="premium-main">
      <section class="premium-hero blog-hero-pro" aria-labelledby="blog-title">
        <div data-animate>
          <p class="premium-kicker">Blog MY BUSINESS LIFE</p>
          <h1 id="blog-title">Guides premium pour décider <span>plus vite et mieux</span>.</h1>
          <p class="premium-lead">Articles SEO, IA, web, logiciel, automatisation et informatique pour transformer une question technique en décision claire, rentable et facile à expliquer.</p>
          <div class="premium-actions">
            <a class="button button-primary" href="#articles">Explorer les guides</a>
            <a class="button button-secondary" href="diagnostic.html">Lancer un diagnostic</a>
          </div>
          <div class="blog-topic-row" aria-label="Thématiques du blog">
            ${categories.slice(0, 7).map((category) => `<span>${category}</span>`).join("")}
          </div>
        </div>
        <div class="premium-visual" data-animate="scale">
          <div class="visual-frame blog-command-frame" role="img" aria-label="Illustration animée d'un hub éditorial digital">
            <img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=82" alt="Carnet, ordinateur et stratégie éditoriale digitale" fetchpriority="high" />
            <div class="blog-orbit-card blog-orbit-card-a"><strong>${articles.length}</strong><span>guides SEO</span></div>
            <div class="blog-orbit-card blog-orbit-card-b"><strong>IA</strong><span>agents métier</span></div>
            <div class="visual-card">
              <span>Ressources</span>
              <strong>Un contenu utile avant chaque décision.</strong>
              <p>Chaque article relie pédagogie, stratégie et action concrète.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section-band blog-featured-section" aria-labelledby="featured-title">
        <div class="section-head" data-animate>
          <div><p class="premium-kicker">À lire en premier</p><h2 id="featured-title">Le guide qui évite les mauvais choix d'outils.</h2></div>
          <p>Une décision logicielle impacte le temps, les données, les équipes et la qualité du pilotage.</p>
        </div>
        <a class="blog-featured-card" href="blog/${featured.slug}.html" data-animate data-spotlight>
          <figure>
            <img src="${featured.image}" alt="${featured.alt}" loading="lazy" decoding="async" />
          </figure>
          <div>
            <span class="compact-label">${featured.category}</span>
            <h3>${featured.title}</h3>
            <p>${featured.description}</p>
            <small>${featured.readTime} · Guide stratégique</small>
          </div>
        </a>
      </section>

      <section id="articles" class="section-band" aria-labelledby="articles-title">
        <div class="section-head" data-animate>
          <div><p class="premium-kicker">Articles SEO</p><h2 id="articles-title">Un vrai hub de contenus pour attirer et convertir.</h2></div>
          <p>Des pages structurées, lisibles et maillées vers les diagnostics et ressources MY BUSINESS LIFE.</p>
        </div>
        <div class="blog-grid blog-grid-pro">
          ${articles.map((article, index) => articleCard(article, index, "")).join("")}
        </div>
      </section>

      <section class="section-band dark blog-resource-band" aria-labelledby="ebooks-title">
        <div class="section-head" data-animate>
          <div><p class="premium-kicker">Ebooks gratuits</p><h2 id="ebooks-title">Approfondir avant de passer à l'action.</h2></div>
          <p>Quatre ressources digitales pensées comme des mini-produits premium, lisibles en ligne et téléchargeables en PDF.</p>
        </div>
        <div class="premium-grid cards-4">
          <a class="premium-card resource-card" href="ebook.html" data-spotlight data-animate><span class="service-icon">APP</span><h3>Logiciel sur-mesure</h3><p>Automatisation, données, dashboards et outils métier.</p></a>
          <a class="premium-card resource-card" href="ebook-site-internet.html" data-spotlight data-animate style="--delay:70ms"><span class="service-icon">WEB</span><h3>Site internet moderne</h3><p>Tracking, crédibilité, conversion et dashboard.</p></a>
          <a class="premium-card resource-card" href="ebook-agents-ia.html" data-spotlight data-animate style="--delay:140ms"><span class="service-icon">IA</span><h3>Agents IA</h3><p>Automatiser sans perdre le contrôle humain.</p></a>
          <a class="premium-card resource-card" href="ebook-reparation-informatique.html" data-spotlight data-animate style="--delay:210ms"><span class="service-icon">PC</span><h3>Réparation informatique</h3><p>Comprendre, protéger les données et décider.</p></a>
        </div>
      </section>

      <section class="premium-cta blog-cta" data-animate>
        <p class="premium-kicker">Passer du contenu à l'action</p>
        <h2>Vous avez lu, maintenant clarifions votre besoin.</h2>
        <p>Le diagnostic adapte les questions à votre thème : site internet, logiciel, automatisation, agents IA, réparation, assistance ou matériel.</p>
        <div class="premium-actions">
          <a class="button button-primary" href="diagnostic.html">Lancer un diagnostic</a>
          <a class="button button-secondary" href="contact.html">Parler à MY BUSINESS LIFE</a>
        </div>
      </section>
    </main>
    ${footer("")}
    ${scripts("")}
  </body>
</html>`;
}

function articlePage(article) {
  const prefix = "../";
  const related = article.related.map((slug) => articlesBySlug.get(slug)).filter(Boolean);
  const headings = article.sections.map((section, index) => ({ id: `section-${index + 1}`, text: section.heading }));
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: updated,
    dateModified: updated,
    author: { "@type": "Organization", name: "MY BUSINESS LIFE", url: site },
    publisher: { "@type": "Organization", name: "MY BUSINESS LIFE", logo: { "@type": "ImageObject", url: `${site}/assets/logo.png` } },
    mainEntityOfPage: `${site}/blog/${article.slug}.html`,
    keywords: [article.keyword, article.category, "MY BUSINESS LIFE"],
  };

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${article.description}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${site}/blog/${article.slug}.html" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${article.title}" />
    <meta property="og:description" content="${article.description}" />
    <meta property="og:image" content="${article.image}" />
    <meta property="article:published_time" content="${updated}" />
    <meta property="article:modified_time" content="${updated}" />
    <title>${article.title} | MY BUSINESS LIFE</title>
    <link rel="stylesheet" href="../premium-site.css?v=31" />
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
  </head>
  <body class="premium-page blog-article-page">
    ${nav(prefix)}
    <main class="premium-main article-premium-main">
      <article class="article-layout" itemscope itemtype="https://schema.org/Article">
        <header class="article-hero">
          <div class="article-hero-copy" data-animate>
            <a class="article-back" href="../blog.html">← Retour au blog</a>
            <p class="premium-kicker">${article.category}</p>
            <h1 itemprop="headline">${article.title}</h1>
            <p class="premium-lead" itemprop="description">${article.description}</p>
            <div class="article-meta">
              <span>${updated}</span>
              <span>${article.readTime}</span>
              <span>${article.keyword}</span>
            </div>
          </div>
          <div class="article-hero-media" data-animate="scale">
            <img src="${article.image}" alt="${article.alt}" itemprop="image" fetchpriority="high" />
            <div class="article-motion-badge"><strong>${article.accent}</strong><span>${article.category}</span></div>
            <span class="article-scan-line" aria-hidden="true"></span>
          </div>
        </header>

        <div class="article-shell">
          <aside class="article-toc" aria-label="Sommaire de l'article" data-animate>
            <strong>Dans ce guide</strong>
            ${headings.map((heading) => `<a href="#${heading.id}">${heading.text}</a>`).join("")}
            <a href="#checklist">Checklist</a>
            <a href="#action">Passer à l'action</a>
          </aside>

          <div class="article-body" itemprop="articleBody">
            ${article.sections
              .map(
                (section, index) => `
                  <section id="section-${index + 1}" data-animate>
                    <h2>${section.heading}</h2>
                    ${section.html.map((paragraph) => `<p>${paragraph}</p>`).join("")}
                    ${section.bullets ? `<ul class="article-list">${section.bullets.map((item) => `<li>${item}</li>`).join("")}</ul>` : ""}
                  </section>`,
              )
              .join("")}

            <section id="checklist" class="article-checklist" data-animate>
              <div>
                <p class="premium-kicker">Checklist</p>
                <h2>${article.checklistTitle}</h2>
              </div>
              <ul>
                ${article.checklist.map((item) => `<li>${item}</li>`).join("")}
              </ul>
            </section>

            <section id="action" class="article-callout" data-animate data-spotlight>
              <p class="premium-kicker">Action recommandée</p>
              <h2>${article.ctaTitle}</h2>
              <p>${article.ctaText}</p>
              <a class="button button-primary" href="${article.ctaUrl}">${article.ctaLabel}</a>
            </section>

            <section class="article-related" aria-labelledby="related-title" data-animate>
              <div class="section-head compact">
                <div><p class="premium-kicker">À lire aussi</p><h2 id="related-title">Guides liés</h2></div>
              </div>
              <div class="blog-grid mini">
                ${related.map((item, index) => articleCard(item, index, "../")).join("")}
              </div>
            </section>
          </div>
        </div>
      </article>
    </main>
    ${footer(prefix)}
    ${scripts(prefix)}
  </body>
</html>`;
}

function ebookPage(ebook) {
  const config = {
    productionUrl: `${site}/${ebook.file}`,
    redirectProduction: false,
    ctaUrl: ebook.ctaUrl,
    source: ebook.source,
    pdfFilename: ebook.pdfFilename,
    pdfFooterText: ebook.pdfFooterText,
    formSuccessMessage: "Votre diagnostic est prêt à être préparé. Utilisez le bouton principal pour continuer.",
    pages: ebook.pages,
  };

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${ebook.metaDescription}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${site}/${ebook.file}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${ebook.metaTitle}" />
    <meta property="og:description" content="${ebook.metaDescription}" />
    <meta property="og:url" content="${site}/${ebook.file}" />
    <meta property="og:image" content="${site}/assets/logo.png" />
    <title>${ebook.metaTitle}</title>
    <link rel="stylesheet" href="ebook.css?v=14" />
  </head>
  <body class="${ebook.bodyClass}">
    <div class="page-glow page-glow-a" aria-hidden="true"></div>
    <div class="page-glow page-glow-b" aria-hidden="true"></div>

    <header class="topbar" aria-label="En-tête MY BUSINESS LIFE">
      <a class="brand" href="#top" aria-label="Retour en haut de page">
        <span class="brand-badge">
          <img id="brandLogo" class="brand-logo" src="assets/logo.png" alt="Logo MY BUSINESS LIFE" />
          <span id="brandFallback" class="brand-fallback" aria-hidden="true" hidden>MBL</span>
        </span>
        <span class="brand-text">
          <strong>MY BUSINESS LIFE</strong>
          <span>${ebook.serviceLabel}</span>
        </span>
      </a>

      <nav class="topnav" aria-label="Navigation principale">
        <a href="index.html">Accueil</a>
        <a href="services.html">Services</a>
        <a href="#ebook">Lire</a>
        <a href="blog.html">Blog</a>
        <a href="contact.html">Contact</a>
        <a href="#study">Étude gratuite</a>
        <button class="nav-download" type="button" data-download-pdf>Télécharger le PDF</button>
      </nav>
    </header>

    <main id="top">
      <section class="hero section-reveal" aria-labelledby="hero-title">
        <div class="hero-copy">
          <p class="eyebrow">Lead magnet digital</p>
          <h1 id="hero-title">${ebook.heroTitle}</h1>
          <p class="hero-subtitle">${ebook.heroSubtitle}</p>
          <div class="hero-actions" aria-label="Actions ebook">
            <a class="button button-primary" href="#ebook">Lire l'ebook</a>
            <button class="button button-secondary" type="button" data-download-pdf>Télécharger le PDF</button>
          </div>
          <div class="trust-row" aria-label="Points clés">
            ${ebook.trust.map((item) => `<span>${item}</span>`).join("")}
          </div>
        </div>

        <div class="hero-visual" aria-label="Aperçu premium de l'ebook">
          <div class="visual-panel">
            <div class="software-preview ebook-preview-motion" aria-hidden="true">
              <div class="preview-topbar"><span></span><span></span><span></span></div>
              <div class="preview-layout">
                <div class="preview-sidebar">
                  <strong>MBL</strong><span></span><span></span><span></span><span></span>
                </div>
                <div class="preview-dashboard">
                  <div class="preview-kpis">
                    ${ebook.previewKpis.map((item) => `<span>${item}</span>`).join("")}
                  </div>
                  <div class="preview-chart"><i></i><i></i><i></i><i></i><i></i></div>
                  <div class="preview-flow">
                    ${ebook.previewFlow.map((item) => `<span>${item}</span>`).join("")}
                  </div>
                </div>
              </div>
            </div>
            <div class="ebook-mockup" aria-hidden="true">
              <div class="mockup-spine"></div>
              <div class="mockup-cover">
                <img class="mockup-logo" src="assets/logo.png" alt="" />
                <span class="mockup-kicker">EBOOK MBL</span>
                <strong>${ebook.mockupTitle}</strong>
                <small>${ebook.mockupSubtitle}</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ebook" class="reader-section section-reveal" aria-labelledby="reader-title">
        <div class="section-heading">
          <p class="eyebrow">Lecture intégrée</p>
          <h2 id="reader-title">${ebook.readerTitle}</h2>
          <p>${ebook.readerText}</p>
        </div>

        <div class="reader-shell">
          <aside class="reader-sidebar" aria-label="Pages de l'ebook">
            <div class="sidebar-title">Sommaire</div>
            <div id="thumbnailList" class="thumbnail-list"></div>
          </aside>
          <div class="reader-main">
            <div class="reader-toolbar" aria-label="Commandes du lecteur">
              <div><span class="reader-label">Ebook digital</span><strong id="pageCounter">1 / 10</strong></div>
              <div class="toolbar-actions">
                <button class="icon-button" id="prevPage" type="button" aria-label="Page précédente">Précédent</button>
                <button class="icon-button" id="nextPage" type="button" aria-label="Page suivante">Suivant</button>
              </div>
            </div>
            <article id="ebookPage" class="ebook-page-card ebook-cover" aria-live="polite">
              <div class="ebook-inner ebook-cover">
                <div class="ebook-page-meta"><span>MY BUSINESS LIFE</span><span class="ebook-page-number">01 / 10</span></div>
                <div>
                  <img class="ebook-cover-logo" src="assets/logo.png" alt="Logo MY BUSINESS LIFE" />
                  <h2 class="ebook-title">${ebook.pages[0].title}</h2>
                  <p class="ebook-subtitle">${ebook.pages[0].subtitle}</p>
                </div>
                <div class="ebook-signature">MY BUSINESS LIFE</div>
              </div>
            </article>
            <div class="viewer-actions">
              <button class="button button-secondary" type="button" data-download-pdf>Télécharger le PDF</button>
              <a class="button button-primary" href="${ebook.ctaUrl}" data-cta-link>Demander une étude gratuite</a>
            </div>
          </div>
        </div>
      </section>

      <section id="study" class="cta-section section-reveal" aria-labelledby="cta-title">
        <div class="cta-copy">
          <p class="eyebrow">${ebook.studyKicker}</p>
          <h2 id="cta-title">${ebook.studyTitle}</h2>
          <p>${ebook.studyText}</p>
          <a class="button button-primary" href="${ebook.ctaUrl}" data-cta-link>Demander une étude gratuite</a>
        </div>
        <form class="lead-form" aria-label="${ebook.formLegend}">
          <label>
            <span>${ebook.inputLabel}</span>
            <input type="text" name="need" placeholder="${ebook.inputPlaceholder}" />
          </label>
          <label>
            <span>${ebook.selectLabel}</span>
            <select name="stage">
              ${ebook.selectOptions.map((option) => `<option>${option}</option>`).join("")}
            </select>
          </label>
          <label>
            <span>Email</span>
            <input type="email" name="email" placeholder="${ebook.emailPlaceholder}" autocomplete="email" required />
          </label>
          <button class="button button-primary" type="submit">${ebook.submitLabel}</button>
          <p id="formMessage" class="form-message" role="status"></p>
        </form>
      </section>
    </main>

    <footer class="footer">
      <span>MY BUSINESS LIFE</span>
      <span>${ebook.pdfFooterText}</span>
    </footer>

    <div id="printBook" class="print-book" aria-hidden="true"></div>
    <script>window.MBL_EBOOK_CONFIG = ${JSON.stringify(config, null, 8)};</script>
    <script src="site-config.js?v=4"></script>
    <script src="site-data.js?v=7"></script>
    <script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"></script>
    <script src="ebook.js?v=16"></script>
  </body>
</html>`;
}

function updateSitemap() {
  const sitemapPath = path.join(root, "sitemap.xml");
  let sitemap = fs.readFileSync(sitemapPath, "utf8");
  const entries = [
    ...articles.map((article) => ({ loc: `${site}/blog/${article.slug}.html`, freq: "monthly", priority: "0.6" })),
    ...ebooks.map((ebook) => ({ loc: `${site}/${ebook.file}`, freq: "monthly", priority: "0.7" })),
  ];

  const missing = entries.filter((entry) => !sitemap.includes(`<loc>${entry.loc}</loc>`));
  if (!missing.length) return;

  const xml = missing
    .map((entry) => `  <url><loc>${entry.loc}</loc><lastmod>${updated}</lastmod><changefreq>${entry.freq}</changefreq><priority>${entry.priority}</priority></url>`)
    .join("\n");

  sitemap = sitemap.replace("</urlset>", `${xml}\n</urlset>`);
  fs.writeFileSync(sitemapPath, sitemap);
}

fs.writeFileSync(path.join(root, "blog.html"), blogIndex());
articles.forEach((article) => {
  fs.writeFileSync(path.join(blogDir, `${article.slug}.html`), articlePage(article));
});
ebooks.forEach((ebook) => {
  fs.writeFileSync(path.join(root, ebook.file), ebookPage(ebook));
});
updateSitemap();

console.log(`Generated ${articles.length} articles, ${ebooks.length} ebooks and updated sitemap.`);
