(function () {
  const config = window.MBL_SUPABASE || {};
  const adminStatusLabels = {
    new: "Nouveau",
    in_progress: "En cours",
    won: "Traité gagné",
    lost: "Traité perdu",
    archived: "Archivé",
  };
  const clientStatusLabels = {
    new: "Reçu",
    in_progress: "En cours",
    won: "Terminé",
    lost: "Clôturé",
    archived: "Archivé",
  };
  const projectStatusLabels = {
    draft: "Brouillon",
    sent: "Envoyé",
    viewed: "Consulté",
    accepted: "Accepté",
    refused: "Refusé",
    archived: "Archivé",
  };
  const roleLabels = {
    client: "Client",
    pending: "En attente",
    viewer: "Lecture seule",
    editor: "Traitement",
    admin: "Admin",
    owner: "Propriétaire",
  };
  const editableRoles = ["client", "pending", "viewer", "editor", "admin", "owner"];
  const adminRoles = ["owner", "admin", "editor", "viewer"];
  const editorRoles = ["owner", "admin", "editor"];
  const managerRoles = ["owner", "admin"];
  const state = {
    adminRequests: [],
    prospectProjects: [],
    client: null,
    days: 30,
    session: null,
    profile: null,
    activeProposalId: null,
    activeAdminTab: "requests",
  };

  const $ = (selector) => document.querySelector(selector);
  const elements = {
    adminStatus: $("#adminStatus"),
    configPanel: $("#configPanel"),
    loginPanel: $("#loginPanel"),
    pendingPanel: $("#pendingPanel"),
    accountPanel: $("#accountPanel"),
    clientPanel: $("#clientPanel"),
    loginForm: $("#loginForm"),
    signupForm: $("#signupForm"),
    authTabs: document.querySelectorAll("[data-auth-tab]"),
    authPanels: document.querySelectorAll("[data-auth-panel]"),
    authStatus: $("#authStatus"),
    authModeCopy: $("#authModeCopy"),
    googleAuthLabel: $("#googleAuthLabel"),
    googleButtons: document.querySelectorAll("[data-google-auth]"),
    passwordForm: $("#passwordForm"),
    loginStatus: $("#loginStatus"),
    signupStatus: $("#signupStatus"),
    passwordStatus: $("#passwordStatus"),
    dashboardPanel: $("#dashboardPanel"),
    logoutButton: $("#logoutButton"),
    pendingLogoutButton: $("#pendingLogoutButton"),
    refreshButton: $("#refreshDashboard"),
    range: $("#adminRange"),
    roleBadge: $("#adminRoleBadge"),
    pageviews: $("#metricPageviews"),
    sessions: $("#metricSessions"),
    contacts: $("#metricContacts"),
    diagnostics: $("#metricDiagnostics"),
    open: $("#metricOpen"),
    topPagesBody: $("#topPagesBody"),
    topPagesMeta: $("#topPagesMeta"),
    dailyChart: $("#dailyChart"),
    dailyMeta: $("#dailyMeta"),
    adminTabs: document.querySelectorAll("[data-admin-tab]"),
    adminTabPanels: document.querySelectorAll("[data-admin-tab-panel]"),
    allRequests: $("#allRequests"),
    allRequestsMeta: $("#allRequestsMeta"),
    leadSearch: $("#leadSearch"),
    leadTypeFilter: $("#leadTypeFilter"),
    leadStatusFilter: $("#leadStatusFilter"),
    proposalStudioPanel: $("#proposalStudioPanel"),
    proposalStudioMeta: $("#proposalStudioMeta"),
    proposalSearch: $("#proposalSearch"),
    proposalStatusFilter: $("#proposalStatusFilter"),
    createProposalButton: $("#createProposalButton"),
    proposalList: $("#proposalList"),
    proposalForm: $("#proposalForm"),
    proposalFormTitle: $("#proposalFormTitle"),
    proposalFormMeta: $("#proposalFormMeta"),
    proposalPublicRef: $("#proposalPublicRef"),
    proposalStatusSelect: $("#proposalStatusSelect"),
    proposalStatusMessage: $("#proposalStatusMessage"),
    proposalOverviewStatus: $("#proposalOverviewStatus"),
    proposalOverviewClient: $("#proposalOverviewClient"),
    proposalOverviewService: $("#proposalOverviewService"),
    proposalOverviewRef: $("#proposalOverviewRef"),
    proposalOverviewSource: $("#proposalOverviewSource"),
    proposalOverviewUpdated: $("#proposalOverviewUpdated"),
    proposalModal: $("#proposalModal"),
    openProposalLink: $("#openProposalLink"),
    copyProposalLink: $("#copyProposalLink"),
    saveProposalButton: $("#saveProposalButton"),
    resetProposalButton: $("#resetProposalButton"),
    proposalModalClosers: document.querySelectorAll("[data-close-proposal-modal]"),
    contactRequests: $("#contactRequests"),
    diagnosticRequests: $("#diagnosticRequests"),
    contactMeta: $("#contactMeta"),
    diagnosticMeta: $("#diagnosticMeta"),
    usersPanel: $("#usersPanel"),
    usersList: $("#usersList"),
    usersMeta: $("#usersMeta"),
    clientRequests: $("#clientRequests"),
    clientRequestsMeta: $("#clientRequestsMeta"),
    clientTotalRequests: $("#clientTotalRequests"),
    clientActiveRequests: $("#clientActiveRequests"),
    clientDoneRequests: $("#clientDoneRequests"),
  };

  const isConfigured = () =>
    Boolean(config.enabled && config.url && config.anonKey && window.supabase?.createClient);

  const role = () => state.profile?.role || "client";
  const isActive = () => Boolean(state.profile?.active);
  const canViewAdmin = () => adminRoles.includes(role()) && isActive();
  const canEditRequests = () => editorRoles.includes(role()) && isActive();
  const canManageUsers = () => managerRoles.includes(role()) && isActive();
  const isClient = () => role() === "client" && isActive();

  const setStatus = (message) => {
    elements.adminStatus.textContent = message || "";
  };

  const setAuthMode = (mode) => {
    const nextMode = mode === "signup" ? "signup" : "login";
    const isSignup = nextMode === "signup";

    elements.authTabs.forEach((tab) => {
      const active = tab.dataset.authTab === nextMode;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    elements.authPanels.forEach((panel) => {
      const active = panel.dataset.authPanel === nextMode;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });

    elements.authModeCopy.textContent = isSignup
      ? "Créez votre accès pour retrouver vos diagnostics et vos demandes."
      : "Retrouvez vos diagnostics, demandes et projets en cours.";
    elements.googleAuthLabel.textContent = isSignup ? "S'inscrire avec Google" : "Continuer avec Google";
    elements.authStatus.textContent = "";
    elements.loginStatus.textContent = "";
    elements.signupStatus.textContent = "";
  };

  const getOAuthRedirectUrl = () => `${window.location.origin}${window.location.pathname}`;

  const setGoogleButtonsDisabled = (disabled) => {
    elements.googleButtons.forEach((button) => {
      button.disabled = disabled;
      button.setAttribute("aria-busy", disabled ? "true" : "false");
    });
  };

  const startGoogleAuth = async (event) => {
    const currentStatus = event.currentTarget.closest(".auth-panel")?.querySelector("#authStatus");
    elements.loginStatus.textContent = "";
    elements.signupStatus.textContent = "";
    if (currentStatus) currentStatus.textContent = "Redirection vers Google...";
    setStatus("Connexion Google en cours...");
    setGoogleButtonsDisabled(true);

    const { error } = await state.client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getOAuthRedirectUrl(),
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      if (currentStatus) currentStatus.textContent = "Connexion Google indisponible.";
      setStatus("Connexion Google indisponible.");
      setGoogleButtonsDisabled(false);
    }
  };

  const formatNumber = (value) => new Intl.NumberFormat("fr-FR").format(Number(value || 0));

  const formatDate = (value) => {
    if (!value) return "";
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  };

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const showView = (view) => {
    elements.configPanel.hidden = view !== "config";
    elements.loginPanel.hidden = view !== "login";
    elements.pendingPanel.hidden = view !== "pending";
    elements.accountPanel.hidden = !(state.session && ["dashboard", "client"].includes(view));
    elements.clientPanel.hidden = view !== "client";
    elements.dashboardPanel.hidden = view !== "dashboard";
    elements.logoutButton.hidden = !["dashboard", "client"].includes(view);
    elements.roleBadge.hidden = !["dashboard", "client"].includes(view);
    elements.range.hidden = view !== "dashboard";
    elements.refreshButton.hidden = view !== "dashboard";
  };

  const updateRoleBadge = () => {
    const label = roleLabels[role()] || role();
    elements.roleBadge.textContent = `Rôle : ${label}`;
  };

  const adminStatusOptions = (current) =>
    Object.entries(adminStatusLabels)
      .map(([value, label]) => `<option value="${value}" ${value === current ? "selected" : ""}>${label}</option>`)
      .join("");

  const roleOptions = (current) =>
    editableRoles
      .map((value) => `<option value="${value}" ${value === current ? "selected" : ""}>${roleLabels[value]}</option>`)
      .join("");

  const projectStatusOptions = (current) =>
    Object.entries(projectStatusLabels)
      .map(([value, label]) => `<option value="${value}" ${value === current ? "selected" : ""}>${label}</option>`)
      .join("");

  const projectStatusTone = (status) => {
    if (status === "accepted") return "is-accepted";
    if (status === "refused") return "is-refused";
    if (status === "viewed") return "is-viewed";
    if (status === "sent") return "is-sent";
    if (status === "archived") return "is-archived";
    return "is-draft";
  };

  const proposalUrl = (publicRef) =>
    publicRef ? `${window.location.origin}/projet-client.html?ref=${encodeURIComponent(publicRef)}` : "#";

  const emptyProposalDraft = () => ({
    id: "",
    source_type: "manual",
    source_request_id: "",
    public_ref: "",
    project_title: "",
    status: "draft",
    client_name: "",
    client_email: "",
    client_company: "",
    client_phone: "",
    service_line: "",
    short_pitch: "",
    client_context: "",
    objectives: "",
    solution_overview: "",
    functional_analysis: "",
    technical_recommendations: "",
    scope_details: "",
    budget_estimate: "",
    development_phases: "",
    deliverables: "",
    technologies_envisaged: "",
    rollout_plan: "",
    timeline_notes: "",
    collaboration_notes: "",
    future_evolutions: "",
    next_step: "",
    admin_notes: "",
    payload: null,
  });

  const extractProposalPayloadFields = (proposal) => {
    const payload = proposal?.payload && typeof proposal.payload === "object" ? proposal.payload : {};
    return {
      functional_analysis: payload.functional_analysis || "",
      technical_recommendations: payload.technical_recommendations || "",
      budget_estimate: payload.budget_estimate || "",
      development_phases: payload.development_phases || "",
      technologies_envisaged: payload.technologies_envisaged || "",
      future_evolutions: payload.future_evolutions || "",
    };
  };

  const requestDetailsText = (row) => {
    const entries = [];
    if (row.summary) entries.push(`Synthèse : ${row.summary}`);
    if (row.message) entries.push(`Message : ${row.message}`);
    if (row.profile) entries.push(`Profil : ${row.profile}`);
    if (row.phone) entries.push(`Téléphone : ${row.phone}`);
    if (row.page_path) entries.push(`Page : ${row.page_path}`);

    if (row.answers && typeof row.answers === "object") {
      Object.entries(row.answers).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") return;
        const output = Array.isArray(value) ? value.join(", ") : typeof value === "object" ? JSON.stringify(value) : value;
        entries.push(`${key} : ${output}`);
      });
    }

    return entries.join("\n");
  };

  const buildProposalDraftFromRequest = (row) => {
    const base = emptyProposalDraft();
    const contactName = row.name || "";
    const contactLabel = contactName || row.email || "Prospect";
    const needLabel = row.need || (row.type === "diagnostic" ? "Diagnostic" : "Demande");
    const contextBlocks = [row.summary, row.message, requestDetailsText(row)].filter(Boolean).join("\n\n");

    return {
      ...base,
      source_type: row.type || "manual",
      source_request_id: row.id || "",
      project_title: `${needLabel} - ${contactLabel}`,
      client_name: contactName,
      client_email: row.email || "",
      client_phone: row.phone || "",
      client_company: row.profile || "",
      service_line: row.need || "",
      short_pitch: row.summary || row.message || `Préparer une proposition claire et structurée pour ${contactLabel}.`,
      client_context: contextBlocks,
      objectives: row.need ? `${row.need}` : "",
      solution_overview: "Décrire ici la réponse MY BUSINESS LIFE, la logique de la solution et la valeur métier.",
      functional_analysis: "Décrire ici les parcours, rôles, données, validations et opérations à couvrir dans l'outil.",
      technical_recommendations:
        "Décrire ici les choix techniques recommandés : architecture, sécurité, hébergement, stockage, API...",
      scope_details: "Lister les modules, le périmètre et les éléments inclus dans la proposition.",
      budget_estimate: "Bloc principal : à estimer\nExploitation / maintenance : à préciser",
      development_phases:
        "Phase 0 — Cadrage détaillé (1 à 2 semaines) : ateliers métier et arbitrages fonctionnels\nPhase 1 — UX / UI et prototype (1 à 2 semaines) : validation des parcours et écrans clés\nPhase 2 — Développement du socle (4 à 6 semaines) : production des modules prioritaires\nPhase 3 — Recette et ajustements (1 à 2 semaines) : tests métier et corrections\nPhase 4 — Déploiement (3 à 5 jours) : mise en ligne et accompagnement initial",
      deliverables: "Présentation du projet\nLivrables fonctionnels\nCadrage détaillé\nSupport de validation",
      technologies_envisaged:
        "Frontend : à définir\nBack-end : à définir\nBase de données : à définir\nInfrastructure : à définir",
      rollout_plan: "Cadrage\nConception\nProduction\nValidation\nDéploiement",
      timeline_notes: "Définir le tempo conseillé après validation du périmètre.",
      collaboration_notes: "Préciser ici les points de validation, le rythme d'échange et le niveau d'accompagnement.",
      future_evolutions: "Lister ici les évolutions futures possibles après la première phase.",
      next_step: "Valider le cadrage, affiner le périmètre puis planifier le lancement.",
    };
  };

  const detailsList = (entries) => {
    const cleanEntries = Object.entries(entries || {}).filter(([, value]) => value !== null && value !== undefined && value !== "");
    if (!cleanEntries.length) return "";

    return `
      <details class="request-details">
        <summary>Détails</summary>
        <dl>
          ${cleanEntries
            .map(
              ([key, value]) => `
                <dt>${escapeHtml(key)}</dt>
                <dd>${escapeHtml(typeof value === "object" ? JSON.stringify(value) : value)}</dd>
              `,
            )
            .join("")}
        </dl>
      </details>
    `;
  };

  const renderMetrics = (summary) => {
    elements.pageviews.textContent = formatNumber(summary.pageviews);
    elements.sessions.textContent = formatNumber(summary.sessions);
    elements.contacts.textContent = formatNumber(summary.contactRequests);
    elements.diagnostics.textContent = formatNumber(summary.diagnosticRequests);
    elements.open.textContent = formatNumber(summary.openRequests);
  };

  const renderTopPages = (pages) => {
    elements.topPagesMeta.textContent = `${pages.length} page${pages.length > 1 ? "s" : ""}`;
    elements.topPagesBody.innerHTML = pages.length
      ? pages
          .map(
            (page) => `
              <tr>
                <td>
                  ${escapeHtml(page.path)}
                  <small>${escapeHtml(page.page_title || "")}</small>
                </td>
                <td>${formatNumber(page.pageviews)}</td>
                <td>${formatNumber(page.sessions)}</td>
              </tr>
            `,
          )
          .join("")
      : `<tr><td colspan="3">Aucune visite enregistrée sur cette période.</td></tr>`;
  };

  const renderDaily = (daily) => {
    const recent = daily.slice(-14);
    const max = Math.max(1, ...recent.map((day) => Number(day.pageviews || 0)));

    elements.dailyMeta.textContent = `${daily.length} jour${daily.length > 1 ? "s" : ""}`;
    elements.dailyChart.classList.toggle("is-empty", !recent.length);
    elements.dailyChart.innerHTML = recent.length
      ? recent
          .map((day) => {
            const height = Math.max(8, Math.round((Number(day.pageviews || 0) / max) * 100));
            return `<span class="daily-bar" style="height:${height}%" title="${escapeHtml(day.day)} : ${formatNumber(day.pageviews)} vues"></span>`;
          })
          .join("")
      : `<p class="empty-state">Aucune donnée pour le moment.</p>`;
  };

  const requestTitle = (row, type) => {
    const name = row.name || row.email || "Demande sans nom";
    const need = row.need || (type === "diagnostic" ? "Diagnostic" : row.source);
    return `${name} - ${need}`;
  };

  const requestTypeLabel = (type) => (type === "diagnostic" ? "Diagnostic" : "Formulaire");

  const requestSourceLabel = (row, type) =>
    [
      type === "diagnostic" ? row.summary : row.source,
      row.page_path,
    ]
      .filter(Boolean)
      .join(" · ");

  const requestDetailsData = (row, itemType) =>
    itemType === "diagnostic"
      ? {
          Besoin: row.need,
          Synthese: row.summary,
          Profil: row.profile,
          Telephone: row.phone,
          Source: row.source,
          Page: row.page_path,
          ...row.answers,
        }
      : {
          Profil: row.profile,
          Besoin: row.need,
          Telephone: row.phone,
          Source: row.source,
          Page: row.page_path,
        };

  const renderRequestDetailRows = (details) => {
    const entries = Object.entries(details || {}).filter(([, value]) => value !== null && value !== undefined && value !== "");
    if (!entries.length) {
      return `<p class="request-table-empty">Aucun détail complémentaire.</p>`;
    }

    return `
      <dl class="request-table-details-grid">
        ${entries
          .map(
            ([key, value]) => `
              <dt>${escapeHtml(key)}</dt>
              <dd>${escapeHtml(typeof value === "object" ? JSON.stringify(value) : value)}</dd>
            `,
          )
          .join("")}
      </dl>
    `;
  };

  const renderRequestActionsCell = (row, itemType) => {
    if (!canEditRequests()) {
      return `<div class="request-row-actions readonly">Lecture seule</div>`;
    }

    return `
      <div class="request-row-actions">
        <button class="button button-secondary button-compact" type="button" data-create-project>Créer projet</button>
        <button class="button button-secondary button-compact button-danger" type="button" data-delete-request>Supprimer</button>
        <button class="button button-primary button-compact" type="button" data-save>Enregistrer</button>
      </div>
    `;
  };

  const renderAdminRequests = (target, rows, type) => {
    target.innerHTML = rows.length
      ? `
          <div class="admin-table-wrap">
            <table class="admin-table request-admin-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Contact</th>
                  <th>Besoin</th>
                  <th>Origine</th>
                  <th>Reçue le</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${rows
                  .map((row) => {
                    const itemType = type || row.type || "contact";
                    const details = requestDetailsData(row, itemType);
                    const linkedProject = findLinkedProject(row.id, itemType);

                    return `
                      <tr class="request-table-row" data-id="${escapeHtml(row.id)}" data-type="${itemType}">
                        <td>
                          <span class="request-type-pill is-${escapeHtml(itemType)}">${escapeHtml(requestTypeLabel(itemType))}</span>
                        </td>
                        <td>
                          <div class="request-table-primary">${escapeHtml(row.name || row.email || "Demande sans nom")}</div>
                          <small>${escapeHtml([row.email, row.profile].filter(Boolean).join(" · ") || "Contact à préciser")}</small>
                          <details class="request-table-disclosure">
                            <summary>Voir le détail</summary>
                            <div class="request-table-disclosure-body">
                              <p class="request-table-message">${escapeHtml(row.message || row.summary || "Aucun message libre.")}</p>
                              ${renderRequestDetailRows(details)}
                              ${
                                canEditRequests()
                                  ? `
                                    <label class="request-inline-note">
                                      <span>Notes internes</span>
                                      <textarea data-notes aria-label="Notes internes de la demande" placeholder="Notes internes">${escapeHtml(row.admin_notes || "")}</textarea>
                                    </label>
                                  `
                                  : ""
                              }
                            </div>
                          </details>
                        </td>
                        <td>
                          <div class="request-table-primary">${escapeHtml(row.need || "À qualifier")}</div>
                          <small>${escapeHtml(linkedProject ? `Projet lié : ${linkedProject.project_title || "Oui"}` : "Aucun projet lié")}</small>
                        </td>
                        <td>
                          <div class="request-table-primary">${escapeHtml(row.source || "Site")}</div>
                          <small>${escapeHtml(requestSourceLabel(row, itemType) || "Origine standard")}</small>
                        </td>
                        <td>
                          <div class="request-table-primary">${escapeHtml(formatDate(row.created_at))}</div>
                        </td>
                        <td>
                          ${
                            canEditRequests()
                              ? `<select class="request-admin-select" data-status aria-label="Statut de la demande">${adminStatusOptions(row.status)}</select>`
                              : `<span class="request-status-label">${escapeHtml(adminStatusLabels[row.status] || row.status)}</span>`
                          }
                        </td>
                        <td>
                          ${renderRequestActionsCell(row, itemType)}
                        </td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
        `
      : `<p class="empty-state">Aucune demande sur cette période.</p>`;
  };

  const requestSearchText = (row) =>
    [
      row.type,
      row.name,
      row.email,
      row.phone,
      row.profile,
      row.need,
      row.summary,
      row.source,
      row.message,
      row.page_path,
      row.page_title,
      row.admin_notes,
      JSON.stringify(row.answers || {}),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

  const proposalSourceText = (item) => {
    if (item?.source_request_id && item?.source_type === "diagnostic") return "Issu d'un diagnostic";
    if (item?.source_request_id && item?.source_type === "contact") return "Issu d'un formulaire";
    return "Création manuelle";
  };

  const proposalCompletion = (item) => {
    const filled = [
      item?.project_title,
      item?.client_name,
      item?.client_email,
      item?.service_line,
      item?.short_pitch,
      item?.client_context,
      item?.objectives,
      item?.solution_overview,
      item?.payload?.budget_estimate,
      item?.payload?.development_phases,
      item?.next_step,
    ].filter((value) => String(value || "").trim()).length;

    const total = 11;
    return {
      filled,
      total,
      percent: Math.round((filled / total) * 100),
    };
  };

  const renderAllAdminRequests = () => {
    const query = (elements.leadSearch?.value || "").trim().toLowerCase();
    const type = elements.leadTypeFilter?.value || "all";
    const status = elements.leadStatusFilter?.value || "all";

    const filtered = state.adminRequests.filter((row) => {
      const matchesType = type === "all" || row.type === type;
      const matchesStatus = status === "all" || row.status === status;
      const matchesSearch = !query || requestSearchText(row).includes(query);
      return matchesType && matchesStatus && matchesSearch;
    });

    const openCount = filtered.filter((row) => ["new", "in_progress"].includes(row.status)).length;
    elements.allRequestsMeta.textContent = `${filtered.length} demande${filtered.length > 1 ? "s" : ""} affichée${filtered.length > 1 ? "s" : ""} · ${openCount} à traiter`;
    renderAdminRequests(elements.allRequests, filtered);
  };

  const renderAdminRequestCollections = () => {
    const contacts = state.adminRequests.filter((row) => row.type === "contact");
    const diagnostics = state.adminRequests.filter((row) => row.type === "diagnostic");

    elements.contactMeta.textContent = `${contacts.length} récent${contacts.length > 1 ? "es" : "e"}`;
    elements.diagnosticMeta.textContent = `${diagnostics.length} récent${diagnostics.length > 1 ? "s" : ""}`;
    renderAllAdminRequests();
    renderAdminRequests(elements.contactRequests, contacts, "contact");
    renderAdminRequests(elements.diagnosticRequests, diagnostics, "diagnostic");
  };

  const syncProposalLink = (publicRef) => {
    const href = proposalUrl(publicRef);
    elements.openProposalLink.href = href;
    elements.openProposalLink.setAttribute("aria-disabled", publicRef ? "false" : "true");
    elements.openProposalLink.classList.toggle("is-disabled", !publicRef);
    elements.copyProposalLink.disabled = !publicRef;
  };

  const setAdminTab = (nextTab) => {
    const availableTab =
      nextTab === "users" && !canManageUsers()
        ? "requests"
        : nextTab || state.activeAdminTab || "requests";

    if (availableTab !== "projects" && !elements.proposalModal?.hidden) {
      closeProposalModal();
    }

    state.activeAdminTab = availableTab;

    elements.adminTabs.forEach((button) => {
      const active = button.dataset.adminTab === availableTab;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
      button.hidden = button.dataset.adminTab === "users" && !canManageUsers();
    });

    elements.adminTabPanels.forEach((panel) => {
      const active = panel.dataset.adminTabPanel === availableTab;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
  };

  const openProposalModal = () => {
    if (!elements.proposalModal) return;
    elements.proposalModal.hidden = false;
    document.body.classList.add("proposal-modal-open");
    window.requestAnimationFrame(() => {
      elements.proposalForm?.elements?.namedItem("project_title")?.focus();
    });
  };

  const closeProposalModal = () => {
    if (!elements.proposalModal) return;
    elements.proposalModal.hidden = true;
    document.body.classList.remove("proposal-modal-open");
  };

  const syncProposalOverview = () => {
    if (!elements.proposalForm) return;

    const form = elements.proposalForm.elements;
    const activeProject = state.activeProposalId
      ? state.prospectProjects.find((item) => item.id === state.activeProposalId)
      : null;
    const status = form.namedItem("status")?.value || "draft";
    const client = form.namedItem("client_company")?.value || form.namedItem("client_name")?.value || "À préciser";
    const service = form.namedItem("service_line")?.value || "À définir";
    const publicRef = form.namedItem("public_ref")?.value || "Non générée";
    const sourceType = form.namedItem("source_type")?.value || "manual";
    const sourceId = form.namedItem("source_request_id")?.value || "";

    if (elements.proposalOverviewStatus) {
      elements.proposalOverviewStatus.textContent = projectStatusLabels[status] || status;
      elements.proposalOverviewStatus.className = `proposal-overview-value ${projectStatusTone(status)}`;
    }
    if (elements.proposalOverviewClient) elements.proposalOverviewClient.textContent = client;
    if (elements.proposalOverviewService) elements.proposalOverviewService.textContent = service;
    if (elements.proposalOverviewRef) elements.proposalOverviewRef.textContent = publicRef;
    if (elements.proposalOverviewSource) {
      elements.proposalOverviewSource.textContent =
        sourceId && sourceType === "diagnostic"
          ? "Issu d'un diagnostic"
          : sourceId && sourceType === "contact"
            ? "Issu d'un formulaire"
            : "Création manuelle";
    }
    if (elements.proposalOverviewUpdated) {
      elements.proposalOverviewUpdated.textContent = activeProject?.updated_at
        ? formatDate(activeProject.updated_at)
        : "Brouillon en préparation";
    }
  };

  const syncProposalEditorAccess = () => {
    if (!elements.proposalForm) return;
    const editable = canEditRequests();

    Array.from(elements.proposalForm.elements).forEach((field) => {
      if (!(field instanceof HTMLElement)) return;
      if (field === elements.copyProposalLink || field === elements.openProposalLink) return;
      if (field.name === "public_ref") return;
      if (field.id === "copyProposalLink") return;
      if (field.id === "openProposalLink") return;
      if ("disabled" in field) field.disabled = !editable;
    });

    elements.openProposalLink.removeAttribute("disabled");
    elements.copyProposalLink.disabled = !elements.proposalPublicRef.value.trim();
  };

  const populateProposalForm = (proposal) => {
    if (!elements.proposalForm) return;

    const draft = {
      ...emptyProposalDraft(),
      ...proposal,
      ...extractProposalPayloadFields(proposal),
    };
    state.activeProposalId = draft.id || null;

    Object.entries(draft).forEach(([key, value]) => {
      const field = elements.proposalForm.elements.namedItem(key);
      if (!field) return;
      field.value = value ?? "";
    });

    if (elements.proposalFormTitle) {
      elements.proposalFormTitle.textContent = draft.id
        ? `Projet : ${draft.project_title || "Sans titre"}`
        : "Créer une présentation projet";
    }

    if (elements.proposalFormMeta) {
      elements.proposalFormMeta.textContent = draft.id
        ? "Modifiez les contenus, ajustez le statut puis partagez le lien public."
        : "Préparez un lien unique prêt à être envoyé.";
    }

    if (elements.proposalStatusSelect) {
      elements.proposalStatusSelect.innerHTML = projectStatusOptions(draft.status || "draft");
    }

    elements.proposalStatusMessage.textContent = "";
    syncProposalLink(draft.public_ref || "");
    syncProposalEditorAccess();
    syncProposalOverview();
    renderProspectProjects();
  };

  const resetProposalForm = () => {
    populateProposalForm(emptyProposalDraft());
  };

  const proposalSearchText = (item) =>
    [
      item.project_title,
      item.client_name,
      item.client_email,
      item.client_company,
      item.service_line,
      item.short_pitch,
      item.client_context,
      item.solution_overview,
      item.payload?.functional_analysis,
      item.payload?.technical_recommendations,
      item.scope_details,
      item.payload?.budget_estimate,
      item.payload?.development_phases,
      item.deliverables,
      item.payload?.technologies_envisaged,
      item.rollout_plan,
      item.timeline_notes,
      item.collaboration_notes,
      item.payload?.future_evolutions,
      item.next_step,
      item.admin_notes,
      item.public_ref,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

  const findLinkedProject = (requestId, requestType) =>
    state.prospectProjects.find(
      (item) => item.source_request_id === requestId && item.source_type === requestType,
    );

  const renderProspectProjects = () => {
    if (!elements.proposalList) return;

    if (elements.proposalStudioPanel) {
      elements.proposalStudioPanel.hidden = !canViewAdmin();
    }
    if (!canViewAdmin()) return;

    const query = (elements.proposalSearch?.value || "").trim().toLowerCase();
    const status = elements.proposalStatusFilter?.value || "all";
    const filtered = state.prospectProjects.filter((item) => {
      const matchesStatus = status === "all" || item.status === status;
      const matchesQuery = !query || proposalSearchText(item).includes(query);
      return matchesStatus && matchesQuery;
    });

    const activeCount = filtered.filter((item) => ["draft", "sent", "viewed"].includes(item.status)).length;
    if (elements.proposalStudioMeta) {
      elements.proposalStudioMeta.textContent = `${filtered.length} projet${filtered.length > 1 ? "s" : ""} · ${activeCount} actif${activeCount > 1 ? "s" : ""}`;
    }

    if (elements.createProposalButton) {
      elements.createProposalButton.hidden = !canEditRequests();
    }
    elements.proposalList.innerHTML = filtered.length
      ? filtered
          .map((item) => {
            const active = state.activeProposalId === item.id;
            const completion = proposalCompletion(item);
            return `
              <article class="proposal-card ${active ? "is-active" : ""}" data-proposal-id="${escapeHtml(item.id)}">
                <div class="proposal-card-head">
                  <div>
                    <p class="proposal-card-kicker">${escapeHtml(item.service_line || proposalSourceText(item))}</p>
                    <h3>${escapeHtml(item.project_title || "Projet sans titre")}</h3>
                  </div>
                  <span class="proposal-status-pill ${projectStatusTone(item.status)}">${escapeHtml(projectStatusLabels[item.status] || item.status)}</span>
                </div>
                <div class="proposal-card-meta-grid">
                  <span><strong>Prospect</strong>${escapeHtml(item.client_name || item.client_email || "À préciser")}</span>
                  <span><strong>Entreprise</strong>${escapeHtml(item.client_company || "À préciser")}</span>
                  <span><strong>Source</strong>${escapeHtml(proposalSourceText(item))}</span>
                  <span><strong>Mise à jour</strong>${escapeHtml(formatDate(item.updated_at || item.created_at))}</span>
                </div>
                <div class="proposal-card-progress">
                  <div class="proposal-card-progress-copy">
                    <span>Complétude</span>
                    <strong>${completion.filled}/${completion.total} blocs</strong>
                  </div>
                  <div class="proposal-progress-bar" aria-hidden="true">
                    <span style="width:${completion.percent}%"></span>
                  </div>
                </div>
                <div class="proposal-card-meta">
                  <span>${escapeHtml(item.public_ref || "Lien non généré")}</span>
                </div>
                <p>${escapeHtml(item.short_pitch || item.service_line || "Présentation à détailler.")}</p>
                <div class="proposal-card-actions">
                  <button class="button button-secondary" type="button" data-proposal-edit="${escapeHtml(item.id)}">Éditer</button>
                  <button class="button button-secondary" type="button" data-proposal-copy="${escapeHtml(item.public_ref || "")}" ${item.public_ref ? "" : "disabled"}>Copier le lien</button>
                  <a class="button button-primary" href="${escapeHtml(proposalUrl(item.public_ref))}" target="_blank" rel="noreferrer noopener">Ouvrir</a>
                </div>
              </article>
            `;
          })
          .join("")
      : `<p class="empty-state">Aucun projet généré pour le moment. Créez-en un depuis un lead ou démarrez un brouillon.</p>`;
  };

  const openProposalEditor = (proposal) => {
    setAdminTab("projects");
    populateProposalForm(proposal);
    openProposalModal();
  };

  const openProposalFromRequest = (row) => {
    const existing = findLinkedProject(row.id, row.type || "manual");
    if (existing) {
      openProposalEditor(existing);
      elements.proposalStatusMessage.textContent = "Projet déjà créé pour cette demande. Vous pouvez le modifier ici.";
      return;
    }

    openProposalEditor(buildProposalDraftFromRequest(row));
    elements.proposalStatusMessage.textContent = "Brouillon prérempli à partir de la demande sélectionnée.";
  };

  const loadProspectProjects = async () => {
    const { data, error } = await state.client
      .from("prospect_projects")
      .select(
        "id,created_at,updated_at,status,source_type,source_request_id,public_ref,client_name,client_email,client_company,client_phone,project_title,service_line,short_pitch,client_context,objectives,solution_overview,scope_details,deliverables,rollout_plan,timeline_notes,collaboration_notes,next_step,admin_notes,payload",
      )
      .order("updated_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    state.prospectProjects = data || [];
    renderProspectProjects();

    if (state.activeProposalId) {
      const refreshed = state.prospectProjects.find((item) => item.id === state.activeProposalId);
      if (refreshed) {
        populateProposalForm(refreshed);
        return;
      }
    }

    if (!elements.proposalForm.elements.namedItem("id")?.value) {
      resetProposalForm();
    }
  };

  const loadAdminRequests = async () => {
    const [contactsResult, diagnosticsResult] = await Promise.all([
      state.client
        .from("contact_requests")
        .select("id,created_at,status,source,page_path,page_title,name,email,phone,profile,need,message,admin_notes")
        .order("created_at", { ascending: false })
        .limit(30),
      state.client
        .from("diagnostic_requests")
        .select("id,created_at,status,source,page_path,page_title,name,email,phone,profile,need,summary,answers,message,admin_notes")
        .order("created_at", { ascending: false })
        .limit(30),
    ]);

    if (contactsResult.error) throw contactsResult.error;
    if (diagnosticsResult.error) throw diagnosticsResult.error;

    const contacts = contactsResult.data || [];
    const diagnostics = diagnosticsResult.data || [];
    state.adminRequests = [
      ...contacts.map((row) => ({ ...row, type: "contact" })),
      ...diagnostics.map((row) => ({ ...row, type: "diagnostic" })),
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    renderAdminRequestCollections();
  };

  const timelineStep = (status) => {
    if (status === "won" || status === "lost" || status === "archived") return 4;
    if (status === "in_progress") return 3;
    return 1;
  };

  const renderTimeline = (status) => {
    const activeStep = timelineStep(status);
    return ["Demande reçue", "Analyse", "En cours", "Finalisation"]
      .map((label, index) => {
        const step = index + 1;
        const stateClass = step < activeStep ? "is-done" : step === activeStep ? "is-active" : "";
        return `<span class="client-step ${stateClass}">${escapeHtml(label)}</span>`;
      })
      .join("");
  };

  const renderClientRequests = (items) => {
    const activeCount = items.filter((item) => ["new", "in_progress"].includes(item.status)).length;
    const doneCount = items.filter((item) => ["won", "lost", "archived"].includes(item.status)).length;

    elements.clientTotalRequests.textContent = formatNumber(items.length);
    elements.clientActiveRequests.textContent = formatNumber(activeCount);
    elements.clientDoneRequests.textContent = formatNumber(doneCount);
    elements.clientRequestsMeta.textContent = `${items.length} demande${items.length > 1 ? "s" : ""}`;

    elements.clientRequests.innerHTML = items.length
      ? items
          .map((item) => `
            <article class="client-request-card">
              <div class="client-request-head">
                <div>
                  <h3>${escapeHtml(item.title)}</h3>
                  <p>${escapeHtml(item.description || "Votre demande est bien enregistrée.")}</p>
                </div>
                <span class="client-status">${escapeHtml(clientStatusLabels[item.status] || item.status)}</span>
              </div>
              <div class="client-timeline" aria-label="Avancement">${renderTimeline(item.status)}</div>
              <p>${escapeHtml(item.nextStep)}</p>
            </article>
          `)
          .join("")
      : `<p class="empty-state">Aucune demande liée à votre email pour le moment. Lancez un diagnostic pour créer un suivi.</p>`;
  };

  const clientNextStep = (status) => {
    if (status === "in_progress") return "MY BUSINESS LIFE traite votre demande. Une prochaine action sera ajoutée dès que le cadrage avance.";
    if (status === "won") return "Le projet est marqué comme terminé. Vous pouvez garder cet historique dans votre espace.";
    if (status === "lost") return "La demande est clôturée. Vous pouvez relancer MY BUSINESS LIFE si le contexte évolue.";
    if (status === "archived") return "La demande est archivée, mais reste consultable dans votre espace.";
    return "Votre demande est reçue. MY BUSINESS LIFE peut maintenant la qualifier et revenir vers vous.";
  };

  const loadClientRequests = async () => {
    const [contactsResult, diagnosticsResult] = await Promise.all([
      state.client
        .from("contact_requests")
        .select("id,created_at,status,source,page_path,page_title,need,message")
        .order("created_at", { ascending: false })
        .limit(50),
      state.client
        .from("diagnostic_requests")
        .select("id,created_at,status,source,page_path,page_title,need,summary,message")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    if (contactsResult.error) throw contactsResult.error;
    if (diagnosticsResult.error) throw diagnosticsResult.error;

    const contactItems = (contactsResult.data || []).map((row) => ({
      id: row.id,
      type: "contact",
      created_at: row.created_at,
      status: row.status,
      title: row.need || "Demande de contact",
      description: row.message || row.page_title,
      nextStep: clientNextStep(row.status),
    }));
    const diagnosticItems = (diagnosticsResult.data || []).map((row) => ({
      id: row.id,
      type: "diagnostic",
      created_at: row.created_at,
      status: row.status,
      title: row.need || "Diagnostic",
      description: row.summary || row.message || row.page_title,
      nextStep: clientNextStep(row.status),
    }));

    renderClientRequests(
      [...contactItems, ...diagnosticItems].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    );
  };

  const renderUsers = (users) => {
    elements.usersMeta.textContent = `${users.length} compte${users.length > 1 ? "s" : ""}`;
    elements.usersList.innerHTML = users.length
      ? users
          .map((user) => {
            const isSelf = user.user_id === state.session?.user?.id;
            return `
              <article class="user-card" data-user-id="${escapeHtml(user.user_id)}">
                <div class="user-main">
                  <h3>${escapeHtml(user.display_name || user.email)}</h3>
                  <div class="user-meta">
                    <span>${escapeHtml(user.email)}</span><br />
                    <span>${escapeHtml(roleLabels[user.role] || user.role)} - ${user.active ? "actif" : "inactif"}</span><br />
                    <span>Créé le ${formatDate(user.created_at)}</span>
                  </div>
                </div>
                <div class="user-actions">
                  <select data-user-role aria-label="Rôle utilisateur" ${isSelf ? "disabled" : ""}>${roleOptions(user.role)}</select>
                  <label class="user-toggle">
                    <input type="checkbox" data-user-active ${user.active ? "checked" : ""} ${isSelf ? "disabled" : ""} />
                    Compte actif
                  </label>
                  <button class="button button-primary" type="button" data-save-user ${isSelf ? "disabled" : ""}>Enregistrer</button>
                </div>
              </article>
            `;
          })
          .join("")
      : `<p class="empty-state">Aucun compte pour le moment.</p>`;
  };

  const loadUsers = async () => {
    elements.usersPanel.hidden = !canManageUsers();
    if (!canManageUsers()) return;

    const { data, error } = await state.client
      .from("user_profiles")
      .select("user_id,email,display_name,role,active,created_at,updated_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;
    renderUsers(data || []);
    setAdminTab(state.activeAdminTab);
  };

  const refreshAdminDashboard = async () => {
    if (!state.session || !canViewAdmin()) return;

    setStatus("Chargement des données...");

    try {
      const { data, error } = await state.client.rpc("get_admin_dashboard", { p_days: state.days });
      if (error) throw error;

      renderMetrics(data.summary || {});
      renderTopPages(data.topPages || []);
      renderDaily(data.daily || []);
      await loadAdminRequests();
      await loadProspectProjects();
      await loadUsers();
      setStatus(`Dernière mise à jour : ${formatDate(new Date().toISOString())}`);
    } catch (error) {
      setStatus("Impossible de charger les données admin.");
    }
  };

  const refreshClientPortal = async () => {
    if (!state.session || !isClient()) return;

    setStatus("Chargement de votre espace...");

    try {
      await loadClientRequests();
      setStatus(`Espace client mis à jour : ${formatDate(new Date().toISOString())}`);
    } catch (error) {
      setStatus("Impossible de charger votre espace client.");
    }
  };

  const saveRequest = async (card) => {
    if (!canEditRequests()) return;

    const id = card.dataset.id;
    const type = card.dataset.type;
    const table = type === "diagnostic" ? "diagnostic_requests" : "contact_requests";
    const button = card.querySelector("[data-save]");
    const status = card.querySelector("[data-status]").value;
    const notesField = card.querySelector("[data-notes]");
    const notes = notesField ? notesField.value.trim() : "";

    button.disabled = true;
    button.textContent = "Enregistrement...";

    try {
      const { error } = await state.client
        .from(table)
        .update({ status, admin_notes: notes || null })
        .eq("id", id);
      if (error) throw error;

      button.textContent = "Enregistré";
      await refreshAdminDashboard();
    } catch (error) {
      button.textContent = "Erreur";
    } finally {
      window.setTimeout(() => {
        button.disabled = false;
        button.textContent = "Enregistrer";
      }, 900);
    }
  };

  const deleteRequest = async (card) => {
    if (!canEditRequests()) return;

    const id = card.dataset.id;
    const type = card.dataset.type;
    const table = type === "diagnostic" ? "diagnostic_requests" : "contact_requests";
    const deleteButton = card.querySelector("[data-delete-request]");
    const label = type === "diagnostic" ? "ce diagnostic" : "cette demande";

    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer ${label} ? Cette action retirera définitivement la ligne de votre espace admin.`,
    );
    if (!confirmed) return;

    deleteButton.disabled = true;
    deleteButton.textContent = "Suppression...";

    try {
      const { data, error } = await state.client.from(table).delete().eq("id", id).select("id");
      if (error) throw error;
      if (!Array.isArray(data) || !data.length) {
        throw new Error("delete-not-applied");
      }

      state.adminRequests = state.adminRequests.filter((row) => !(row.id === id && row.type === type));
      renderAdminRequestCollections();
      setStatus("Demande supprimée.");
    } catch (error) {
      deleteButton.disabled = false;
      deleteButton.textContent = "Supprimer";
      setStatus(
        error?.message === "delete-not-applied"
          ? "Suppression refusée ou non appliquée. Vérifiez les droits de suppression."
          : "Impossible de supprimer cette demande.",
      );
    }
  };

  const saveUser = async (card) => {
    if (!canManageUsers()) return;

    const userId = card.dataset.userId;
    const button = card.querySelector("[data-save-user]");
    const nextRole = card.querySelector("[data-user-role]").value;
    const active = card.querySelector("[data-user-active]").checked;

    button.disabled = true;
    button.textContent = "Enregistrement...";

    try {
      const { error } = await state.client
        .from("user_profiles")
        .update({ role: nextRole, active })
        .eq("user_id", userId);
      if (error) throw error;

      button.textContent = "Enregistré";
      await loadUsers();
    } catch (error) {
      button.textContent = "Erreur";
    } finally {
      window.setTimeout(() => {
        button.disabled = false;
        button.textContent = "Enregistrer";
      }, 900);
    }
  };

  const saveProposal = async () => {
    if (!canEditRequests() || !elements.proposalForm) return;

    elements.proposalStatusMessage.textContent = "Enregistrement...";
    elements.saveProposalButton.disabled = true;

    const formData = new FormData(elements.proposalForm);
    const existingId = formData.get("id")?.toString().trim();
    const existingProject = existingId
      ? state.prospectProjects.find((item) => item.id === existingId)
      : null;
    const existingPayload =
      existingProject?.payload && typeof existingProject.payload === "object"
        ? { ...existingProject.payload }
        : {};
    const proposalPayload = {
      ...existingPayload,
      functional_analysis: formData.get("functional_analysis")?.toString().trim() || null,
      technical_recommendations: formData.get("technical_recommendations")?.toString().trim() || null,
      budget_estimate: formData.get("budget_estimate")?.toString().trim() || null,
      development_phases: formData.get("development_phases")?.toString().trim() || null,
      technologies_envisaged: formData.get("technologies_envisaged")?.toString().trim() || null,
      future_evolutions: formData.get("future_evolutions")?.toString().trim() || null,
    };
    [
      "functional_analysis",
      "technical_recommendations",
      "budget_estimate",
      "development_phases",
      "technologies_envisaged",
      "future_evolutions",
    ].forEach((key) => {
      if (!proposalPayload[key]) delete proposalPayload[key];
    });
    const payload = {
      source_type: formData.get("source_type") || "manual",
      source_request_id: formData.get("source_request_id") || null,
      project_title: formData.get("project_title")?.toString().trim(),
      status: formData.get("status") || "draft",
      client_name: formData.get("client_name")?.toString().trim() || null,
      client_email: formData.get("client_email")?.toString().trim() || null,
      client_company: formData.get("client_company")?.toString().trim() || null,
      client_phone: formData.get("client_phone")?.toString().trim() || null,
      service_line: formData.get("service_line")?.toString().trim() || null,
      short_pitch: formData.get("short_pitch")?.toString().trim() || null,
      client_context: formData.get("client_context")?.toString().trim() || null,
      objectives: formData.get("objectives")?.toString().trim() || null,
      solution_overview: formData.get("solution_overview")?.toString().trim() || null,
      scope_details: formData.get("scope_details")?.toString().trim() || null,
      deliverables: formData.get("deliverables")?.toString().trim() || null,
      rollout_plan: formData.get("rollout_plan")?.toString().trim() || null,
      timeline_notes: formData.get("timeline_notes")?.toString().trim() || null,
      collaboration_notes: formData.get("collaboration_notes")?.toString().trim() || null,
      next_step: formData.get("next_step")?.toString().trim() || null,
      admin_notes: formData.get("admin_notes")?.toString().trim() || null,
      payload: Object.keys(proposalPayload).length ? proposalPayload : null,
    };

    try {
      let savedRow = null;

      if (existingId) {
        const { data, error } = await state.client
          .from("prospect_projects")
          .update(payload)
          .eq("id", existingId)
          .select(
            "id,created_at,updated_at,status,source_type,source_request_id,public_ref,client_name,client_email,client_company,client_phone,project_title,service_line,short_pitch,client_context,objectives,solution_overview,scope_details,deliverables,rollout_plan,timeline_notes,collaboration_notes,next_step,admin_notes,payload",
          )
          .single();
        if (error) throw error;
        savedRow = data;
      } else {
        const { data, error } = await state.client
          .from("prospect_projects")
          .insert(payload)
          .select(
            "id,created_at,updated_at,status,source_type,source_request_id,public_ref,client_name,client_email,client_company,client_phone,project_title,service_line,short_pitch,client_context,objectives,solution_overview,scope_details,deliverables,rollout_plan,timeline_notes,collaboration_notes,next_step,admin_notes,payload",
          )
          .single();
        if (error) throw error;
        savedRow = data;
      }

      await loadProspectProjects();
      if (savedRow) populateProposalForm(savedRow);
      elements.proposalStatusMessage.textContent = existingId
        ? "Projet mis à jour. Le lien public reste le même."
        : "Projet créé. Le lien unique est prêt à être envoyé.";
    } catch (error) {
      elements.proposalStatusMessage.textContent = "Impossible d'enregistrer ce projet.";
    } finally {
      elements.saveProposalButton.disabled = false;
    }
  };

  const copyProposalPublicLink = async (publicRef) => {
    if (!publicRef) return;

    const link = proposalUrl(publicRef);
    try {
      await navigator.clipboard.writeText(link);
      elements.proposalStatusMessage.textContent = "Lien copié dans le presse-papiers.";
    } catch (error) {
      elements.proposalStatusMessage.textContent = `Copiez ce lien : ${link}`;
    }
  };

  const loadCurrentProfile = async () => {
    const { data, error } = await state.client
      .from("user_profiles")
      .select("user_id,email,display_name,role,active")
      .eq("user_id", state.session.user.id)
      .maybeSingle();

    if (error) throw error;
    state.profile = data || {
      user_id: state.session.user.id,
      email: state.session.user.email,
      role: "client",
      active: true,
    };
  };

  const handleSession = async (session) => {
    state.session = session;
    state.profile = null;

    if (!session) {
      showView("login");
      setStatus("Connectez-vous ou créez un accès.");
      return;
    }

    try {
      await loadCurrentProfile();
      updateRoleBadge();

      if (canViewAdmin()) {
        showView("dashboard");
        setAdminTab(state.activeAdminTab);
        await refreshAdminDashboard();
        return;
      }

      if (isClient()) {
        showView("client");
        await refreshClientPortal();
        return;
      }

      showView("pending");
      setStatus("Compte en attente d'activation.");
    } catch (error) {
      showView("pending");
      setStatus("Impossible de vérifier votre accès.");
    }
  };

  const bindEvents = () => {
    elements.authTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        setAuthMode(tab.dataset.authTab);
      });
    });

    elements.googleButtons.forEach((button) => {
      button.addEventListener("click", startGoogleAuth);
    });

    elements.loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      elements.authStatus.textContent = "";
      elements.loginStatus.textContent = "Connexion...";

      const formData = new FormData(elements.loginForm);
      const { error } = await state.client.auth.signInWithPassword({
        email: formData.get("email"),
        password: formData.get("password"),
      });

      elements.loginStatus.textContent = error ? "Connexion refusée." : "";
    });

    elements.signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      elements.authStatus.textContent = "";
      elements.signupStatus.textContent = "Création du compte...";

      const formData = new FormData(elements.signupForm);
      const { error } = await state.client.auth.signUp({
        email: formData.get("email"),
        password: formData.get("password"),
        options: {
          data: {
            display_name: formData.get("display_name") || "",
          },
        },
      });

      if (error) {
        elements.signupStatus.textContent = "Inscription impossible.";
        return;
      }

      elements.signupForm.reset();
      setAuthMode("login");
      elements.loginStatus.textContent = "Compte créé. Connectez-vous pour accéder à votre espace client.";
    });

    elements.passwordForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      elements.passwordStatus.textContent = "Mise à jour...";

      const formData = new FormData(elements.passwordForm);
      const { error } = await state.client.auth.updateUser({
        password: formData.get("password"),
      });

      if (error) {
        elements.passwordStatus.textContent = "Mot de passe non modifié.";
        return;
      }

      elements.passwordForm.reset();
      elements.passwordStatus.textContent = "Mot de passe mis à jour.";
    });

    elements.logoutButton.addEventListener("click", () => {
      state.client.auth.signOut();
    });

    elements.pendingLogoutButton.addEventListener("click", () => {
      state.client.auth.signOut();
    });

    elements.refreshButton.addEventListener("click", refreshAdminDashboard);

    elements.range.addEventListener("change", () => {
      state.days = Number(elements.range.value || 30);
      refreshAdminDashboard();
    });

    elements.leadSearch?.addEventListener("input", renderAllAdminRequests);
    elements.leadTypeFilter?.addEventListener("change", renderAllAdminRequests);
    elements.leadStatusFilter?.addEventListener("change", renderAllAdminRequests);
    elements.adminTabs.forEach((button) => {
      button.addEventListener("click", () => {
        setAdminTab(button.dataset.adminTab);
      });
    });
    elements.proposalSearch?.addEventListener("input", renderProspectProjects);
    elements.proposalStatusFilter?.addEventListener("change", renderProspectProjects);
    elements.createProposalButton?.addEventListener("click", () => {
      setAdminTab("projects");
      resetProposalForm();
      elements.proposalStatusMessage.textContent = "Nouveau brouillon prêt à être complété.";
      openProposalModal();
    });
    elements.proposalForm?.addEventListener("input", syncProposalOverview);
    elements.proposalForm?.addEventListener("change", syncProposalOverview);
    elements.proposalForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      await saveProposal();
    });
    elements.resetProposalButton?.addEventListener("click", () => {
      resetProposalForm();
      elements.proposalStatusMessage.textContent = "Éditeur réinitialisé.";
    });
    elements.copyProposalLink?.addEventListener("click", async () => {
      const publicRef = elements.proposalPublicRef?.value?.trim();
      await copyProposalPublicLink(publicRef);
    });
    elements.proposalModalClosers.forEach((button) => {
      button.addEventListener("click", closeProposalModal);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !elements.proposalModal?.hidden) {
        closeProposalModal();
      }
    });

    document.addEventListener("click", async (event) => {
      const saveButton = event.target.closest("[data-save]");
      if (saveButton) {
        const card = saveButton.closest("[data-id][data-type]");
        if (card) saveRequest(card);
        return;
      }

      const createProjectButton = event.target.closest("[data-create-project]");
      if (createProjectButton) {
        const card = createProjectButton.closest("[data-id][data-type]");
        if (card) {
          const request = state.adminRequests.find(
            (item) => item.id === card.dataset.id && item.type === card.dataset.type,
          );
          if (request) openProposalFromRequest(request);
        }
        return;
      }

      const deleteRequestButton = event.target.closest("[data-delete-request]");
      if (deleteRequestButton) {
        const card = deleteRequestButton.closest("[data-id][data-type]");
        if (card) await deleteRequest(card);
        return;
      }

      const proposalEditButton = event.target.closest("[data-proposal-edit]");
      if (proposalEditButton) {
        const proposal = state.prospectProjects.find((item) => item.id === proposalEditButton.dataset.proposalEdit);
        if (proposal) openProposalEditor(proposal);
        return;
      }

      const proposalCopyButton = event.target.closest("[data-proposal-copy]");
      if (proposalCopyButton) {
        copyProposalPublicLink(proposalCopyButton.dataset.proposalCopy);
        return;
      }

      const proposalModalClose = event.target.closest("[data-close-proposal-modal]");
      if (proposalModalClose) {
        closeProposalModal();
        return;
      }

      const proposalNavButton = event.target.closest("[data-proposal-nav]");
      if (proposalNavButton) {
        const section = document.getElementById(`proposal-section-${proposalNavButton.dataset.proposalNav}`);
        section?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      const saveUserButton = event.target.closest("[data-save-user]");
      if (saveUserButton) {
        const card = saveUserButton.closest("[data-user-id]");
        if (card) saveUser(card);
      }
    });
  };

  const init = async () => {
    if (!isConfigured()) {
      showView("config");
      setStatus("Supabase n'est pas encore configuré.");
      return;
    }

    state.client = window.supabase.createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });

    bindEvents();
    setAuthMode("login");

    state.client.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    const { data } = await state.client.auth.getSession();
    await handleSession(data.session);
  };

  init();
})();
