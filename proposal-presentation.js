(function () {
  const config = window.MBL_SUPABASE || {};
  const params = new URLSearchParams(window.location.search);
  const refAliases = {
    "carrosserie-phase1-demo": "new-pare-brise-phase-1-demo",
  };
  const requestedRef = params.get("ref");
  const publicRef = refAliases[requestedRef] || requestedRef;
  const projectStatusLabels = {
    draft: "Brouillon",
    sent: "Envoyé",
    viewed: "Consulté",
    accepted: "Accepté",
    refused: "Refusé",
    archived: "Archivé",
  };
  const defaultCtaUrl =
    "https://calendly.com/contact-mybusinesslife/etude-de-besoins-logiciel-sur-mesure";
  const proposalOverride =
    window.MBL_PROPOSAL_OVERRIDE && typeof window.MBL_PROPOSAL_OVERRIDE === "object"
      ? window.MBL_PROPOSAL_OVERRIDE
      : null;
  const proposalPreloads =
    window.MBL_PROPOSAL_PRELOADS && typeof window.MBL_PROPOSAL_PRELOADS === "object"
      ? window.MBL_PROPOSAL_PRELOADS
      : null;
  const defaultTheme = {
    companyName: "MY BUSINESS LIFE",
    tagline: "Présentation projet",
    accent: "#ff6a2e",
    accentStrong: "#ff7a40",
    teal: "#1c8fa3",
    surface: "#143447",
    surfaceSoft: "rgba(20, 52, 71, 0.12)",
    text: "#f7f9fc",
    muted: "rgba(247, 249, 252, 0.72)",
    grid: "rgba(28, 143, 163, 0.08)",
    pageBackground: "#f6f9fc",
    pagePanel: "#ffffff",
    pageInk: "#07131c",
    pageMuted: "rgba(11, 24, 33, 0.72)",
  };

  const elements = {
    heroTitle: document.querySelector("#proposalHeroTitle"),
    heroSubtitle: document.querySelector("#proposalHeroSubtitle"),
    heroMeta: document.querySelector("#proposalHeroMeta"),
    visualTitle: document.querySelector("#proposalVisualTitle"),
    visualService: document.querySelector("#proposalVisualService"),
    visualStatus: document.querySelector("#proposalVisualStatus"),
    brandMark: document.querySelector("#proposalBrandMark"),
    intro: document.querySelector("#presentationIntro"),
    page: document.querySelector("#proposalPage"),
    pageCounter: document.querySelector("#proposalPageCounter"),
    thumbnails: document.querySelector("#proposalThumbnailList"),
    prev: document.querySelector("#proposalPrevPage"),
    next: document.querySelector("#proposalNextPage"),
    primaryCta: document.querySelector("#proposalPrimaryCta"),
    secondaryCta: document.querySelector("#proposalSecondaryCta"),
    downloadButtons: Array.from(
      document.querySelectorAll("#proposalDownloadTop, #proposalDownloadHero, #proposalDownloadViewer"),
    ),
  };

  let pages = [];
  let currentPage = 0;
  let currentProject = null;
  let currentTheme = { ...defaultTheme };
  let isDownloadingPdf = false;

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function splitLines(value) {
    return String(value || "")
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function splitParagraphs(value) {
    return String(value || "")
      .split(/\n{2,}/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function lineToCard(line, index) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex > 0) {
      return {
        title: line.slice(0, separatorIndex).trim(),
        text: line.slice(separatorIndex + 1).trim(),
      };
    }

    return {
      title: `Point ${index + 1}`,
      text: line,
    };
  }

  function normalizeArray(value) {
    if (Array.isArray(value)) return value;
    return [];
  }

  function chunkArray(items, chunkSize) {
    const chunks = [];
    for (let index = 0; index < items.length; index += chunkSize) {
      chunks.push(items.slice(index, index + chunkSize));
    }
    return chunks;
  }

  function payloadText(payload, key) {
    const value = payload?.[key];
    return typeof value === "string" ? value.trim() : "";
  }

  function slugify(value) {
    return String(value || "presentation-projet")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
  }

  function hexToRgb(value) {
    if (!value || typeof value !== "string") return { r: 255, g: 106, b: 46 };
    const hex = value.trim().replace("#", "");
    const normalized =
      hex.length === 3 ? hex.split("").map((part) => `${part}${part}`).join("") : hex;

    if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return { r: 255, g: 106, b: 46 };

    return {
      r: Number.parseInt(normalized.slice(0, 2), 16),
      g: Number.parseInt(normalized.slice(2, 4), 16),
      b: Number.parseInt(normalized.slice(4, 6), 16),
    };
  }

  function resolveTheme(project) {
    const branding = project?.payload?.branding || {};
    return {
      ...defaultTheme,
      companyName: branding.companyName || project?.client_company || defaultTheme.companyName,
      tagline: branding.tagline || project?.service_line || defaultTheme.tagline,
    };
  }

  function applyBrandTheme(theme) {
    currentTheme = theme;
    document.body.style.setProperty("--proposal-accent", theme.accent || defaultTheme.accent);
    document.body.style.setProperty("--proposal-accent-strong", theme.accentStrong || theme.accent || defaultTheme.accent);
    document.body.style.setProperty("--proposal-teal", theme.teal || defaultTheme.teal);
    document.body.style.setProperty("--proposal-surface", theme.surface || defaultTheme.surface);
    document.body.style.setProperty("--proposal-surface-soft", theme.surfaceSoft || defaultTheme.surfaceSoft);
    document.body.style.setProperty("--proposal-text", theme.text || defaultTheme.text);
    document.body.style.setProperty("--proposal-muted", theme.muted || defaultTheme.muted);
    document.body.style.setProperty("--proposal-grid", theme.grid || defaultTheme.grid);
    document.body.style.setProperty("--proposal-page-bg", theme.pageBackground || defaultTheme.pageBackground);
    document.body.style.setProperty("--proposal-page-panel", theme.pagePanel || defaultTheme.pagePanel);
    document.body.style.setProperty("--proposal-page-ink", theme.pageInk || defaultTheme.pageInk);
    document.body.style.setProperty("--proposal-page-muted", theme.pageMuted || defaultTheme.pageMuted);

    if (elements.brandMark) {
      elements.brandMark.textContent = "MY BUSINESS LIFE";
    }
  }

  function renderList(items) {
    return `
      <ul class="ebook-list">
        ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    `;
  }

  function renderParagraphs(items) {
    return items.map((item) => `<p>${escapeHtml(item)}</p>`).join("");
  }

  function buildPages(project) {
    const objectives = splitLines(project.objectives);
    const scope = splitLines(project.scope_details);
    const deliverables = splitLines(project.deliverables);
    const rollout = splitLines(project.rollout_plan);
    const contextParagraphs = splitParagraphs(project.client_context);
    const solutionParagraphs = splitParagraphs(project.solution_overview);
    const timelineLines = splitLines(project.timeline_notes);
    const collaborationParagraphs = splitParagraphs(project.collaboration_notes);
    const payload = project.payload || {};
    const mockups = normalizeArray(payload.mockups);
    const functionalAnalysisLines = splitLines(payloadText(payload, "functional_analysis"));
    const technicalRecommendationLines = splitLines(payloadText(payload, "technical_recommendations"));
    const budgetEstimateLines = splitLines(payloadText(payload, "budget_estimate"));
    const developmentPhaseLines = splitLines(payloadText(payload, "development_phases"));
    const technologiesLines = splitLines(payloadText(payload, "technologies_envisaged"));
    const futureEvolutionLines = splitLines(payloadText(payload, "future_evolutions"));
    const moduleCatalog = normalizeArray(payload.module_catalog).filter((module) => module && typeof module === "object");
    const proposalPages = [
      {
        type: "cover",
        title: project.project_title || "Présentation projet",
        subtitle:
          project.short_pitch ||
          "Une proposition structurée, claire et orientée décision pour faire avancer votre projet.",
        signature: project.client_company || project.client_name || "MY BUSINESS LIFE",
      },
      {
        type: "story",
        title: "Contexte et besoin",
        intro:
          contextParagraphs[0] ||
          "Cette page résume le besoin exprimé, les priorités identifiées et le contexte à prendre en compte.",
        paragraphs: contextParagraphs.length
          ? contextParagraphs
          : ["Le contexte détaillé sera partagé et validé avec vous avant lancement."],
        sidebarTitle: "Objectifs visés",
        sidebarItems: objectives.length
          ? objectives
          : ["Clarifier le besoin", "Sécuriser le périmètre", "Donner une prochaine étape claire"],
      },
    ];

    if (functionalAnalysisLines.length) {
      proposalPages.push({
        type: "list",
        title: "Analyse fonctionnelle du besoin",
        intro:
          "Cette analyse traduit le besoin terrain en parcours, données et opérations à couvrir dans le futur outil.",
        spotlightTitle: "Points fonctionnels clés",
        items: functionalAnalysisLines,
        conclusion:
          "Cette base fonctionnelle sert à sécuriser le cadrage avant le développement et à aligner les priorités métier.",
      });
    }

    if (solutionParagraphs.length) {
      proposalPages.push({
        type: "story",
        title: "Notre approche",
        intro:
          solutionParagraphs[0] ||
          "MY BUSINESS LIFE prépare une réponse sur-mesure, cadrée et adaptée à la réalité métier.",
        paragraphs: solutionParagraphs.length
          ? solutionParagraphs
          : ["La solution est pensée pour rendre l'activité plus simple, plus lisible et plus performante."],
        sidebarTitle: "Cap visé",
        sidebarItems: [
          project.service_line || "Solution sur-mesure",
          "Prioriser les gains immédiats",
          "Structurer la suite sans complexifier le départ",
        ],
      });
    }

    if (technicalRecommendationLines.length) {
      proposalPages.push({
        type: "list",
        title: "Recommandations techniques",
        intro:
          "Ces choix techniques sont pensés pour livrer un outil robuste, simple à maintenir et évolutif dans le temps.",
        spotlightTitle: "Socle technique recommandé",
        items: technicalRecommendationLines,
        conclusion:
          "L'objectif est de poser une architecture fiable dès le départ, sans surcomplexifier la première phase.",
      });
    }

    if (scope.length) {
      proposalPages.push({
        type: "list",
        title: "Périmètre prioritaire",
        intro:
          "Cette première étape concentre les fonctionnalités qui suppriment les pertes de temps et structurent le socle métier.",
        spotlightTitle: "Périmètre conseillé",
        items: scope,
        conclusion:
          "Le but est de démarrer avec un périmètre utile, lisible et déjà fortement rentable pour l'activité.",
      });
    }

    if (moduleCatalog.length) {
      chunkArray(moduleCatalog, 4).forEach((moduleChunk, chunkIndex, chunks) => {
        const isFirstChunk = chunkIndex === 0;
        const isLastChunk = chunkIndex === chunks.length - 1;

        proposalPages.push({
          type: "module-grid",
          title: isFirstChunk
            ? "Découpage du projet par modules"
            : `Modules complémentaires ${chunkIndex + 1}/${chunks.length}`,
          intro: isFirstChunk
            ? "Le projet est structuré en modules clairs pour valider le périmètre, le budget et les priorités sans ambiguïté."
            : "Chaque bloc ajoute une capacité métier concrète pour couvrir toute la chaîne opérationnelle et administrative.",
          modules: moduleChunk,
          conclusion: isLastChunk
            ? "Ce découpage permet d'arbitrer rapidement les priorités tout en conservant une vision complète du projet cible."
            : "",
        });
      });
    }

    mockups.forEach((mockup, index) => {
      proposalPages.push({
        type: "mockup",
        title: mockup.title || `Maquette ${index + 1}`,
        subtitle: mockup.subtitle || "",
        eyebrow: mockup.eyebrow || `Mockup ${String(index + 1).padStart(2, "0")}`,
        badges: normalizeArray(mockup.badges),
        metrics: normalizeArray(mockup.metrics),
        modules: normalizeArray(mockup.modules),
        note: mockup.note || "",
        imageSrc: mockup.imageSrc || "",
        imageAlt: mockup.imageAlt || "",
        imageOrientation: mockup.imageOrientation || "",
      });
    });

    if (objectives.length) {
      proposalPages.push({
        type: "cards",
        title: "Bénéfices immédiats",
        cards: objectives.slice(0, 6).map(lineToCard),
        conclusion:
          "Chaque gain visé sert à fluidifier les opérations, fiabiliser les données et alléger la charge quotidienne.",
      });
    }

    if (budgetEstimateLines.length || timelineLines.length) {
      proposalPages.push({
        type: "cards",
        title: "Estimation budgétaire",
        cards: (budgetEstimateLines.length ? budgetEstimateLines : timelineLines)
          .slice(0, 6)
          .map(lineToCard),
        conclusion:
          "L'estimation budgétaire permet d'arbitrer sereinement la première phase et de préparer la suite sans ambiguïté.",
      });
    }

    if (developmentPhaseLines.length) {
      proposalPages.push({
        type: "list",
        title: "Planning de développement par phases",
        intro:
          "Le projet est découpé en étapes lisibles pour garder de la visibilité, valider au bon moment et avancer sans friction.",
        spotlightTitle: "Phases proposées",
        items: developmentPhaseLines,
        conclusion:
          "Ce planning donne un ordre logique de production, de validation et de mise en service.",
      });
    }

    if (technologiesLines.length) {
      proposalPages.push({
        type: "cards",
        title: "Technologies envisagées",
        cards: technologiesLines.slice(0, 6).map(lineToCard),
        conclusion:
          "La stack est choisie pour répondre au besoin métier, rester maintenable et ouvrir la voie aux futures évolutions.",
      });
    }

    if (deliverables.length) {
      proposalPages.push({
        type: "list",
        title: "Gestion de la plateforme",
        intro:
          "Au-delà du développement, MY BUSINESS LIFE encadre la stabilité, la sécurité et l'accompagnement de la solution.",
        items: deliverables,
        conclusion: "La plateforme reste suivie, sécurisée et exploitable dans la durée.",
      });
    }

    if (futureEvolutionLines.length || rollout.length || collaborationParagraphs.length) {
      proposalPages.push({
        type: "story",
        title: "Possibilités d’évolution future",
        intro:
          collaborationParagraphs[0] ||
          "Une fois la base en place, le projet peut évoluer progressivement selon les priorités métier.",
        paragraphs: collaborationParagraphs.length
          ? collaborationParagraphs
          : [
              "MY BUSINESS LIFE garde une logique simple : cadrer, produire, valider puis faire évoluer l'outil de façon cohérente.",
            ],
        sidebarTitle: "Évolutions possibles",
        sidebarItems: futureEvolutionLines.length
          ? futureEvolutionLines
          : rollout.length
          ? rollout
          : ["Automatisations supplémentaires", "Visibilité renforcée", "Nouveaux modules métier"],
      });
    }

    proposalPages.push({
      type: "final",
      title: "Prochaine étape recommandée",
      subtitle:
        project.next_step ||
        "Valider le cadrage, ajuster le périmètre puis planifier la prochaine étape avec MY BUSINESS LIFE.",
      clientName: project.client_name || "",
      serviceLine: project.service_line || "",
      status: project.status || "draft",
    });

    return proposalPages;
  }

  function renderMockupPage(page) {
    const hasImage = Boolean(page.imageSrc);
    const stageClass = hasImage
      ? `proposal-mockup-stage proposal-mockup-stage--visual ${escapeHtml(
          page.imageOrientation === "portrait" ? "is-portrait" : "is-landscape",
        )}`
      : "proposal-mockup-stage";

    return `
      <div class="proposal-mockup-shell">
        <div class="proposal-mockup-head">
          <span class="proposal-mockup-kicker">${escapeHtml(page.eyebrow || "Mockup")}</span>
          <h2 class="ebook-title">${escapeHtml(page.title)}</h2>
          <p class="ebook-subtitle">${escapeHtml(page.subtitle || "")}</p>
          <div class="proposal-mockup-badges">
            ${page.badges.map((item) => `<span class="proposal-mockup-badge">${escapeHtml(item)}</span>`).join("")}
          </div>
        </div>

        <div class="${stageClass}">
          ${
            hasImage
              ? `
                <div class="proposal-mockup-media">
                  <div class="proposal-mockup-window">
                    <strong>${escapeHtml(page.subtitle || "Vue fonctionnelle")}</strong>
                    <p>${escapeHtml(
                      page.note ||
                        "Le prototype permet de projeter clairement l'outil cible et d'aligner les priorités métier.",
                    )}</p>
                  </div>
                  <figure class="proposal-mockup-figure ${escapeHtml(
                    page.imageOrientation === "portrait" ? "is-portrait" : "is-landscape",
                  )}">
                    <img
                      src="${escapeHtml(page.imageSrc)}"
                      alt="${escapeHtml(page.imageAlt || page.title || "Maquette projet")}"
                      loading="eager"
                      decoding="async"
                    />
                  </figure>
                </div>
              `
              : `
                <aside class="proposal-mockup-sidebar">
                  <div class="proposal-mockup-logo">
                    <strong>${escapeHtml(currentTheme.companyName || "Client")}</strong>
                    <span>${escapeHtml(currentTheme.tagline || "Projet métier")}</span>
                  </div>
                  <div class="proposal-mockup-dotlist" aria-hidden="true">
                    <span class="proposal-mockup-dot"></span>
                    <span class="proposal-mockup-dot"></span>
                    <span class="proposal-mockup-dot"></span>
                  </div>
                  <small>Prototype visuel pour cadrer la logique métier avant production.</small>
                </aside>

                <div class="proposal-mockup-main">
                  <div class="proposal-mockup-toolbar">
                    <strong>${escapeHtml(page.title)}</strong>
                    <span class="proposal-mockup-badge">Prototype premium</span>
                  </div>
                  <div class="proposal-mockup-window">
                    <strong>${escapeHtml(page.subtitle || "Vue fonctionnelle")}</strong>
                    <p>${escapeHtml(
                      page.note ||
                        "Le prototype permet de projeter clairement l'outil cible et d'aligner les priorités métier.",
                    )}</p>
                  </div>
                  <div class="proposal-mockup-metrics">
                    ${page.metrics
                      .map(
                        (metric) => `
                          <div class="proposal-mockup-metric">
                            <strong>${escapeHtml(metric.value || "")}</strong>
                            <span>${escapeHtml(metric.label || "")}</span>
                          </div>
                        `,
                      )
                      .join("")}
                  </div>
                  <div class="proposal-mockup-panels">
                    ${page.modules
                      .map(
                        (module) => `
                          <div class="proposal-mockup-panel">
                            <strong>${escapeHtml(module.label || "")}</strong>
                            <span>${escapeHtml(module.value || "")}</span>
                          </div>
                        `,
                      )
                      .join("")}
                  </div>
                </div>
              `
          }

          <aside class="proposal-mockup-rail proposal-mockup-rail--summary">
            <div class="proposal-mockup-rail-card">
              <strong>Parcours cible</strong>
              <span>Terrain -> agence -> documents -> suivi centralisé</span>
            </div>
            <div class="proposal-mockup-metrics">
              ${page.metrics
                .map(
                  (metric) => `
                    <div class="proposal-mockup-metric">
                      <strong>${escapeHtml(metric.value || "")}</strong>
                      <span>${escapeHtml(metric.label || "")}</span>
                    </div>
                  `,
                )
                .join("")}
            </div>
            <div class="proposal-mockup-panels">
              ${page.modules
                .map(
                  (module) => `
                    <div class="proposal-mockup-panel">
                      <strong>${escapeHtml(module.label || "")}</strong>
                      <span>${escapeHtml(module.value || "")}</span>
                    </div>
                  `,
                )
                .join("")}
            </div>
            <div class="proposal-mockup-rail-card proposal-mockup-note">
              <strong>Pourquoi cette maquette ?</strong>
              <p>${escapeHtml(page.note || "Cette vue sert à visualiser rapidement les gains et les flux clés à structurer.")}</p>
            </div>
          </aside>
        </div>
      </div>
    `;
  }

  function renderPageContent(page) {
    if (page.type === "cover") {
      return `
        <div>
          <img class="ebook-cover-logo" src="assets/logo.png" alt="Logo MY BUSINESS LIFE" />
          <h2 class="ebook-title">${escapeHtml(page.title)}</h2>
          <p class="ebook-subtitle">${escapeHtml(page.subtitle)}</p>
        </div>
        <div class="ebook-signature">${escapeHtml(page.signature)}</div>
      `;
    }

    if (page.type === "story") {
      return `
        <div class="proposal-page-stack">
          <h2 class="ebook-title">${escapeHtml(page.title)}</h2>
          <div class="proposal-dual-grid">
            <div class="proposal-page-stack">
              <p class="ebook-subtitle">${escapeHtml(page.intro)}</p>
              ${renderParagraphs(page.paragraphs)}
            </div>
            <aside class="proposal-note-grid" aria-label="${escapeHtml(page.sidebarTitle)}">
              <div class="proposal-note">
                <strong>${escapeHtml(page.sidebarTitle)}</strong>
                ${renderList(page.sidebarItems)}
              </div>
            </aside>
          </div>
        </div>
      `;
    }

    if (page.type === "list") {
      return `
        <div class="proposal-page-stack">
          <h2 class="ebook-title">${escapeHtml(page.title)}</h2>
          <p class="ebook-subtitle">${escapeHtml(page.intro)}</p>
          <div class="proposal-spotlight">
            <strong>${escapeHtml(page.spotlightTitle || "Périmètre conseillé")}</strong>
            ${renderList(page.items)}
          </div>
        </div>
        <p class="ebook-conclusion">${escapeHtml(page.conclusion)}</p>
      `;
    }

    if (page.type === "cards") {
      return `
        <div>
          <h2 class="ebook-title">${escapeHtml(page.title)}</h2>
          <div class="ebook-content ebook-grid three">
            ${page.cards
              .map(
                (card) => `
                  <div class="ebook-card">
                    <strong>${escapeHtml(card.title)}</strong>
                    <span>${escapeHtml(card.text)}</span>
                  </div>
                `,
              )
              .join("")}
          </div>
        </div>
        <p class="ebook-conclusion">${escapeHtml(page.conclusion)}</p>
      `;
    }

    if (page.type === "module-grid") {
      return `
        <div class="proposal-page-stack">
          <h2 class="ebook-title">${escapeHtml(page.title)}</h2>
          <p class="ebook-subtitle">${escapeHtml(page.intro || "")}</p>
          <div class="proposal-module-grid">
            ${page.modules
              .map((module, index) => {
                const moduleItems = normalizeArray(module.items).slice(0, 4);
                return `
                  <article class="proposal-module-card">
                    <div class="proposal-module-head">
                      <span class="proposal-module-index">${escapeHtml(
                        module.index || String(index + 1).padStart(2, "0"),
                      )}</span>
                      <div>
                        <strong>${escapeHtml(module.title || "Module")}</strong>
                        <small>${escapeHtml(module.subtitle || "")}</small>
                      </div>
                    </div>
                    <div class="proposal-module-meta">
                      <span>${escapeHtml(module.duration || "Durée à confirmer")}</span>
                      <span>${escapeHtml(module.budget || "Budget à confirmer")}</span>
                    </div>
                    ${
                      moduleItems.length
                        ? `
                          <ul class="proposal-module-list">
                            ${moduleItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                          </ul>
                        `
                        : ""
                    }
                  </article>
                `;
              })
              .join("")}
          </div>
          ${page.conclusion ? `<p class="ebook-conclusion">${escapeHtml(page.conclusion)}</p>` : ""}
        </div>
      `;
    }

    if (page.type === "mockup") {
      return renderMockupPage(page);
    }

    if (page.type === "final") {
      return `
        <div class="proposal-page-stack">
          <h2 class="ebook-title">${escapeHtml(page.title)}</h2>
          <p class="ebook-subtitle">${escapeHtml(page.subtitle)}</p>
          <div class="proposal-pill-grid">
            <div class="proposal-pill">
              <strong>Projet</strong>
              <span>${escapeHtml(page.serviceLine || "À cadrer avec MY BUSINESS LIFE")}</span>
            </div>
            <div class="proposal-pill">
              <strong>Statut</strong>
              <span>${escapeHtml(projectStatusLabels[page.status] || page.status)}</span>
            </div>
            <div class="proposal-pill">
              <strong>Interlocuteur</strong>
              <span>${escapeHtml(page.clientName || "Prospect MY BUSINESS LIFE")}</span>
            </div>
            <div class="proposal-pill">
              <strong>Action</strong>
              <span>Valider, ajuster ou planifier la suite.</span>
            </div>
          </div>
          <div class="cta-final-actions">
            <button class="button button-secondary" type="button" data-download-pdf>Télécharger le PDF</button>
            <a class="button button-primary" href="${escapeHtml(defaultCtaUrl)}" target="_blank" rel="noopener">Planifier un échange</a>
            <a class="button button-secondary" href="contact.html">Poser une question</a>
          </div>
        </div>
      `;
    }

    return `
      <div class="proposal-empty-state">
        <strong>Présentation indisponible</strong>
        <p>Cette page n'a pas pu être construite correctement.</p>
      </div>
    `;
  }

  function buildPageMarkup(page, index) {
    return `
      <div class="ebook-inner ${page.type === "cover" ? "ebook-cover" : ""}">
        <div class="ebook-page-meta">
          <span>MY BUSINESS LIFE</span>
          <span class="ebook-page-number">${String(index + 1).padStart(2, "0")} / ${pages.length}</span>
        </div>
        ${renderPageContent(page)}
      </div>
    `;
  }

  function updateThumbnails(index) {
    elements.thumbnails.querySelectorAll(".thumbnail-button").forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === index);
      button.setAttribute("aria-current", buttonIndex === index ? "page" : "false");
    });
  }

  function renderPage(index, options = {}) {
    const page = pages[index];
    const shouldAnimate = options.animate !== false && elements.page.innerHTML.trim() !== "";

    const update = () => {
      elements.page.className = `ebook-page-card ${page.type === "cover" ? "ebook-cover" : ""}`;
      elements.page.innerHTML = buildPageMarkup(page, index);

      elements.pageCounter.textContent = `${index + 1} / ${pages.length}`;
      elements.prev.disabled = index === 0;
      elements.next.disabled = index === pages.length - 1;
      updateThumbnails(index);
      requestAnimationFrame(() => elements.page.classList.remove("is-changing"));
    };

    if (!shouldAnimate) {
      update();
      return;
    }

    elements.page.classList.add("is-changing");
    window.setTimeout(update, 130);
  }

  function setPage(index) {
    currentPage = Math.min(Math.max(index, 0), pages.length - 1);
    renderPage(currentPage);
  }

  function renderThumbnails() {
    elements.thumbnails.innerHTML = pages
      .map(
        (page, index) => `
          <button class="thumbnail-button" type="button" data-page-index="${index}">
            <span class="thumbnail-index">${String(index + 1).padStart(2, "0")}</span>
            <span class="thumbnail-title">${escapeHtml(page.title)}</span>
          </button>
        `,
      )
      .join("");
  }

  function showFallback(message) {
    pages = [
      {
        type: "final",
        title: "Présentation indisponible",
        subtitle: message,
        clientName: "",
        serviceLine: "",
        status: "draft",
      },
    ];
    applyBrandTheme(defaultTheme);
    elements.heroTitle.textContent = "Présentation projet indisponible";
    elements.heroSubtitle.textContent = message;
    elements.heroMeta.innerHTML = `<span>Référence invalide</span><span>Vérifiez le lien</span><span>Support MY BUSINESS LIFE</span>`;
    elements.visualTitle.textContent = "Lien introuvable";
    elements.visualService.textContent = "Cette présentation n'est pas accessible.";
    elements.visualStatus.textContent = "Indisponible";
    elements.intro.textContent = "Le lien public n'a pas retourné de projet exploitable.";
    renderThumbnails();
    renderPage(0, { animate: false });
  }

  function getLocalProject() {
    if (proposalOverride) return proposalOverride;
    if (!proposalPreloads) return null;
    return proposalPreloads[publicRef] || proposalPreloads[requestedRef] || null;
  }

  function applyProjectData(data) {
    currentProject = data;
    applyBrandTheme(resolveTheme(data));
    pages = buildPages(data);

    document.title = `${data.project_title || "Présentation projet"} | MY BUSINESS LIFE`;
    elements.heroTitle.textContent = data.project_title || "Présentation projet";
    elements.heroSubtitle.textContent =
      data.short_pitch ||
      "Une proposition structurée, claire et orientée décision pour faire avancer votre projet.";
    elements.heroMeta.innerHTML = `
      <span class="proposal-client-chip">${escapeHtml(projectStatusLabels[data.status] || data.status || "Projet")}</span>
      <span>${escapeHtml(data.service_line || "Projet sur-mesure")}</span>
      <span>Réf. ${escapeHtml(requestedRef || data.public_ref || "local-premium")}</span>
    `;
    elements.visualTitle.textContent = data.project_title || "Présentation premium";
    elements.visualService.textContent = data.service_line || "Cadrage, périmètre, prochaines étapes";
    elements.visualStatus.textContent = projectStatusLabels[data.status] || data.status || "Projet";
    elements.intro.textContent =
      data.client_name || data.client_company
        ? `Présentation préparée pour ${[data.client_name, data.client_company].filter(Boolean).join(" · ")}.`
        : "Une présentation claire du besoin, de la solution et des prochaines étapes.";

    if (elements.primaryCta && data.payload?.contact_cta_url) {
      elements.primaryCta.href = data.payload.contact_cta_url;
    }

    renderThumbnails();
    renderPage(0, { animate: false });
    updateDownloadButtons(false);
  }

  function drawWrappedText(doc, text, x, y, maxWidth, lineHeight, options = {}) {
    const lines = doc.splitTextToSize(String(text || ""), maxWidth);
    doc.text(lines, x, y, { baseline: "top", ...options });
    return y + lines.length * lineHeight;
  }

  function drawRoundedCard(doc, x, y, width, height, fill, stroke) {
    doc.setFillColor(fill.r, fill.g, fill.b);
    doc.setDrawColor(stroke.r, stroke.g, stroke.b);
    doc.roundedRect(x, y, width, height, 4, 4, "FD");
  }

  function drawPdfHeader(doc, index) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(235, 238, 242);
    doc.text(currentTheme.companyName || "MY BUSINESS LIFE", 18, 18);
    doc.text(`${String(index + 1).padStart(2, "0")} / ${pages.length}`, 176, 18);
  }

  function drawPdfFooter(doc, index) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(110, 118, 125);
    doc.text(currentProject?.service_line || "Présentation projet", 18, 286);
    doc.text(`Page ${index + 1}`, 178, 286);
  }

  function drawPdfCover(doc, page) {
    const accent = hexToRgb(currentTheme.accent);
    doc.setFillColor(18, 18, 18);
    doc.rect(0, 0, 210, 297, "F");
    doc.setFillColor(accent.r, accent.g, accent.b);
    doc.roundedRect(140, 26, 44, 140, 6, 6, "F");
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.6);
    doc.line(18, 205, 72, 205);
    doc.setTextColor(255, 244, 234);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(30);
    drawWrappedText(doc, page.title, 18, 72, 150, 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(237, 225, 216);
    drawWrappedText(doc, page.subtitle, 18, 150, 146, 7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(accent.r, accent.g, accent.b);
    doc.text(page.signature, 18, 226);
  }

  function drawPdfStory(doc, page, index) {
    const accent = hexToRgb(currentTheme.accent);
    doc.setFillColor(249, 248, 246);
    doc.rect(0, 0, 210, 297, "F");
    drawPdfHeader(doc, index);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(20, 20, 20);
    drawWrappedText(doc, page.title, 18, 28, 122, 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11.5);
    doc.setTextColor(85, 85, 85);
    let cursorY = drawWrappedText(doc, page.intro, 18, 52, 118, 5.8);
    cursorY += 6;
    page.paragraphs.forEach((paragraph) => {
      cursorY = drawWrappedText(doc, paragraph, 18, cursorY, 118, 5.4);
      cursorY += 5;
    });

    drawRoundedCard(doc, 144, 34, 48, 162, { r: 255, g: 250, b: 246 }, { r: 235, g: 223, b: 208 });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(accent.r, accent.g, accent.b);
    doc.text(page.sidebarTitle, 150, 48);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.6);
    doc.setTextColor(65, 65, 65);
    let sideY = 60;
    page.sidebarItems.forEach((item) => {
      doc.setFillColor(accent.r, accent.g, accent.b);
      doc.circle(151.5, sideY + 1.5, 1.4, "F");
      sideY = drawWrappedText(doc, item, 156, sideY - 1, 30, 4.7);
      sideY += 5;
    });

    drawPdfFooter(doc, index);
  }

  function drawPdfList(doc, page, index) {
    const accent = hexToRgb(currentTheme.accent);
    doc.setFillColor(249, 248, 246);
    doc.rect(0, 0, 210, 297, "F");
    drawPdfHeader(doc, index);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(20, 20, 20);
    drawWrappedText(doc, page.title, 18, 28, 170, 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11.5);
    doc.setTextColor(85, 85, 85);
    drawWrappedText(doc, page.intro, 18, 50, 170, 5.8);
    drawRoundedCard(doc, 18, 74, 174, 150, { r: 255, g: 252, b: 249 }, { r: 237, g: 227, b: 214 });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(accent.r, accent.g, accent.b);
    doc.text("Périmètre conseillé", 26, 88);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.8);
    doc.setTextColor(55, 55, 55);
    let listY = 101;
    page.items.slice(0, 14).forEach((item) => {
      doc.setFillColor(accent.r, accent.g, accent.b);
      doc.circle(27.5, listY + 1.5, 1.35, "F");
      listY = drawWrappedText(doc, item, 32, listY - 1, 148, 4.8);
      listY += 4;
    });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(26, 26, 26);
    drawWrappedText(doc, page.conclusion, 18, 238, 174, 5.5);
    drawPdfFooter(doc, index);
  }

  function drawPdfCards(doc, page, index) {
    const accent = hexToRgb(currentTheme.accent);
    doc.setFillColor(249, 248, 246);
    doc.rect(0, 0, 210, 297, "F");
    drawPdfHeader(doc, index);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(20, 20, 20);
    drawWrappedText(doc, page.title, 18, 28, 170, 10);
    const fill = { r: 255, g: 251, b: 247 };
    const stroke = { r: 238, g: 228, b: 214 };
    const cardWidth = 84;
    const cardHeight = 52;
    page.cards.slice(0, 6).forEach((card, indexCard) => {
      const col = indexCard % 2;
      const row = Math.floor(indexCard / 2);
      const x = 18 + col * 90;
      const y = 66 + row * 60;
      drawRoundedCard(doc, x, y, cardWidth, cardHeight, fill, stroke);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(accent.r, accent.g, accent.b);
      drawWrappedText(doc, card.title, x + 6, y + 7, cardWidth - 12, 5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.2);
      doc.setTextColor(60, 60, 60);
      drawWrappedText(doc, card.text, x + 6, y + 20, cardWidth - 12, 4.4);
    });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(26, 26, 26);
    drawWrappedText(doc, page.conclusion, 18, 252, 174, 5.5);
    drawPdfFooter(doc, index);
  }

  function drawPdfMockup(doc, page, index) {
    const accent = hexToRgb(currentTheme.accent);
    const surface = hexToRgb(currentTheme.surface);
    doc.setFillColor(249, 248, 246);
    doc.rect(0, 0, 210, 297, "F");
    drawPdfHeader(doc, index);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(accent.r, accent.g, accent.b);
    doc.text(page.eyebrow || "Mockup", 18, 32);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(23);
    doc.setTextColor(20, 20, 20);
    drawWrappedText(doc, page.title, 18, 40, 170, 9);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11.4);
    doc.setTextColor(82, 82, 82);
    drawWrappedText(doc, page.subtitle, 18, 58, 170, 5.8);

    drawRoundedCard(doc, 18, 78, 174, 142, { r: 24, g: 24, b: 24 }, { r: accent.r, g: accent.g, b: accent.b });
    drawRoundedCard(doc, 26, 90, 32, 112, { r: 35, g: 35, b: 35 }, { r: 60, g: 60, b: 60 });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(255, 244, 234);
    drawWrappedText(doc, currentTheme.companyName || "Client", 30, 102, 22, 4.2);

    drawRoundedCard(doc, 64, 90, 90, 24, surface, { r: 72, g: 72, b: 72 });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(255, 244, 234);
    doc.text(page.title, 70, 102);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(221, 221, 221);
    drawWrappedText(doc, page.note || "Prototype visuel métier", 70, 108, 78, 4.2);

    page.metrics.slice(0, 3).forEach((metric, metricIndex) => {
      const x = 64 + metricIndex * 30;
      drawRoundedCard(doc, x, 120, 26, 26, { r: 255, g: 251, b: 247 }, { r: accent.r, g: accent.g, b: accent.b });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(accent.r, accent.g, accent.b);
      drawWrappedText(doc, metric.value, x + 4, 126, 18, 4.2);
    });

    page.modules.slice(0, 3).forEach((module, moduleIndex) => {
      const x = 64 + moduleIndex * 36;
      drawRoundedCard(doc, x, 154, 32, 38, { r: 248, g: 246, b: 243 }, { r: 232, g: 223, b: 210 });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.8);
      doc.setTextColor(22, 22, 22);
      drawWrappedText(doc, module.label, x + 4, 160, 24, 4.2);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(88, 88, 88);
      drawWrappedText(doc, module.value, x + 4, 171, 24, 3.8);
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(26, 26, 26);
    drawWrappedText(doc, page.note || "", 18, 232, 174, 5.4);
    drawPdfFooter(doc, index);
  }

  function drawPdfFinal(doc, page, index) {
    const accent = hexToRgb(currentTheme.accent);
    doc.setFillColor(249, 248, 246);
    doc.rect(0, 0, 210, 297, "F");
    drawPdfHeader(doc, index);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(20, 20, 20);
    drawWrappedText(doc, page.title, 18, 34, 170, 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(85, 85, 85);
    drawWrappedText(doc, page.subtitle, 18, 60, 170, 6);
    const fill = { r: 255, g: 251, b: 247 };
    const stroke = { r: 238, g: 228, b: 214 };
    const entries = [
      ["Projet", page.serviceLine || "À cadrer avec MY BUSINESS LIFE"],
      ["Statut", projectStatusLabels[page.status] || page.status],
      ["Interlocuteur", page.clientName || "Prospect MY BUSINESS LIFE"],
      ["Action", "Valider, ajuster ou planifier la suite"],
    ];
    entries.forEach((entry, cardIndex) => {
      const col = cardIndex % 2;
      const row = Math.floor(cardIndex / 2);
      const x = 18 + col * 90;
      const y = 108 + row * 52;
      drawRoundedCard(doc, x, y, 84, 40, fill, stroke);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(accent.r, accent.g, accent.b);
      doc.text(entry[0], x + 6, y + 12);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.2);
      doc.setTextColor(65, 65, 65);
      drawWrappedText(doc, entry[1], x + 6, y + 18, 72, 4.6);
    });
    doc.setFillColor(accent.r, accent.g, accent.b);
    doc.roundedRect(18, 224, 82, 18, 4, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(24, 24, 24);
    doc.text("Planifier un échange", 31, 235.5);
    doc.link(18, 224, 82, 18, { url: defaultCtaUrl });
    drawPdfFooter(doc, index);
  }

  function drawPdfPage(doc, page, index) {
    if (page.type === "cover") {
      drawPdfCover(doc, page, index);
      return;
    }
    if (page.type === "story") {
      drawPdfStory(doc, page, index);
      return;
    }
    if (page.type === "list") {
      drawPdfList(doc, page, index);
      return;
    }
    if (page.type === "cards") {
      drawPdfCards(doc, page, index);
      return;
    }
    if (page.type === "mockup") {
      drawPdfMockup(doc, page, index);
      return;
    }
    drawPdfFinal(doc, page, index);
  }

  async function downloadPdf() {
    if (isDownloadingPdf) return;

    const pdfLib = window.jspdf;
    if (!pdfLib?.jsPDF || !pages.length) {
      window.print();
      return;
    }

    isDownloadingPdf = true;
    updateDownloadButtons(true);

    try {
      if (window.html2canvas) {
        await downloadPdfFromDom();
        return;
      }

      const { jsPDF } = pdfLib;
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      pages.forEach((page, index) => {
        if (index > 0) doc.addPage();
        drawPdfPage(doc, page, index);
      });

      const filename =
        currentProject?.payload?.pdf_filename ||
        `${slugify(currentProject?.project_title || currentTheme.companyName || "presentation-projet")}.pdf`;

      doc.save(filename);
    } finally {
      isDownloadingPdf = false;
      updateDownloadButtons(false);
    }
  }

  function updateDownloadButtons(disabled) {
    elements.downloadButtons.forEach((button) => {
      button.disabled = disabled;
      button.classList.toggle("is-disabled", disabled);
    });
  }

  async function waitForImages(container) {
    const images = Array.from(container.querySelectorAll("img"));
    if (!images.length) return;

    await Promise.all(
      images.map(
        (image) =>
          new Promise((resolve) => {
            if (image.complete && image.naturalWidth > 0) {
              resolve();
              return;
            }

            const done = () => resolve();
            image.addEventListener("load", done, { once: true });
            image.addEventListener("error", done, { once: true });
          }),
      ),
    );
  }

  async function downloadPdfFromDom() {
    const pdfLib = window.jspdf;
    const html2canvas = window.html2canvas;
    const { jsPDF } = pdfLib;
    const filename =
      currentProject?.payload?.pdf_filename ||
      `${slugify(currentProject?.project_title || currentTheme.companyName || "presentation-projet")}.pdf`;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const renderHost = document.createElement("section");

    renderHost.className = "proposal-pdf-render";
    renderHost.setAttribute("aria-hidden", "true");

    pages.forEach((page, index) => {
      const article = document.createElement("article");
      article.className = `ebook-page-card proposal-pdf-page ${page.type === "cover" ? "ebook-cover" : ""}`;
      article.innerHTML = buildPageMarkup(page, index);
      renderHost.appendChild(article);
    });

    document.body.appendChild(renderHost);

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      await waitForImages(renderHost);

      await new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)));

      const pageNodes = Array.from(renderHost.querySelectorAll(".proposal-pdf-page"));
      for (let index = 0; index < pageNodes.length; index += 1) {
        const pageNode = pageNodes[index];
        const canvas = await html2canvas(pageNode, {
          backgroundColor: null,
          scale: Math.min(window.devicePixelRatio || 1, 2),
          useCORS: true,
          allowTaint: true,
          logging: false,
        });

        const imageData = canvas.toDataURL("image/png");
        const pdfWidth = 210;
        const pdfHeight = 297;
        const margin = 6;
        const maxWidth = pdfWidth - margin * 2;
        const maxHeight = pdfHeight - margin * 2;
        const widthRatio = maxWidth / canvas.width;
        const heightRatio = maxHeight / canvas.height;
        const ratio = Math.min(widthRatio, heightRatio);
        const drawWidth = canvas.width * ratio;
        const drawHeight = canvas.height * ratio;
        const drawX = (pdfWidth - drawWidth) / 2;
        const drawY = (pdfHeight - drawHeight) / 2;

        if (index > 0) doc.addPage();
        doc.addImage(imageData, "PNG", drawX, drawY, drawWidth, drawHeight, undefined, "FAST");
      }

      doc.save(filename);
    } finally {
      renderHost.remove();
    }
  }

  async function loadProject() {
    updateDownloadButtons(true);

    const localProject = getLocalProject();
    if (localProject) {
      applyProjectData(localProject);
      return;
    }

    if (!publicRef) {
      showFallback("Le lien partagé est incomplet.");
      return;
    }

    if (!config.enabled || !config.url || !config.anonKey || !window.supabase?.createClient) {
      showFallback("La configuration de lecture n'est pas encore disponible.");
      return;
    }

    const client = window.supabase.createClient(config.url, config.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await client.rpc("get_public_prospect_project", { p_ref: publicRef });

    if (error || !data) {
      showFallback("Cette présentation n'existe pas ou n'est plus accessible.");
      return;
    }

    applyProjectData(data);

    try {
      await client.rpc("mark_public_prospect_project_view", { p_ref: publicRef });
      if (data.status === "sent") {
        elements.visualStatus.textContent = projectStatusLabels.viewed;
      }
    } catch (error) {
      // Le suivi de lecture est utile mais ne doit jamais bloquer l'affichage de la proposition.
    }
  }

  elements.prev?.addEventListener("click", () => setPage(currentPage - 1));
  elements.next?.addEventListener("click", () => setPage(currentPage + 1));
  elements.thumbnails?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-page-index]");
    if (!button) return;
    setPage(Number(button.dataset.pageIndex));
  });

  document.addEventListener("click", (event) => {
    const downloadTrigger = event.target.closest("[data-download-pdf], #proposalDownloadTop, #proposalDownloadHero, #proposalDownloadViewer");
    if (downloadTrigger) {
      downloadPdf();
    }
  });

  loadProject();
})();
