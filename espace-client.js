(function () {
  const config = window.MBL_SUPABASE || {};
  const adminStatusLabels = {
    new: "Nouveau",
    in_progress: "En cours",
    no_response: "Pas de réponse",
    won: "Traité gagné",
    lost: "Traité perdu",
    archived: "Archivé",
  };
  const clientStatusLabels = {
    new: "Reçu",
    in_progress: "En cours",
    no_response: "En attente de retour",
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
  const crmStageLabels = {
    new: "Nouveau",
    proposal_sent: "Proposition envoyée",
    follow_up: "À relancer",
    no_response: "Pas de réponse",
    negotiation: "En discussion",
    won: "Signé",
    lost: "Perdu",
  };
  const crmStageOrder = ["new", "proposal_sent", "follow_up", "no_response", "negotiation", "won", "lost"];
  const leadTemperatureLabels = {
    cold: "Froid",
    warm: "Tiède",
    hot: "Chaud",
  };
  const roleLabels = {
    client: "Client",
    pending: "En attente",
    viewer: "Lecture seule",
    editor: "Traitement",
    commercial: "Commercial",
    admin: "Admin",
    owner: "Propriétaire",
  };
  const editableRoles = ["client", "pending", "viewer", "editor", "commercial", "admin", "owner"];
  const adminRoles = ["owner", "admin", "editor", "viewer"];
  const editorRoles = ["owner", "admin", "editor"];
  const managerRoles = ["owner", "admin"];
  const prospectProjectSelect =
    "id,created_at,updated_at,status,crm_stage,deal_probability,estimated_value,lead_temperature,follow_up_at,appointment_at,last_contacted_at,source_type,source_request_id,public_ref,client_name,client_email,client_company,client_phone,project_title,service_line,short_pitch,client_context,objectives,solution_overview,scope_details,deliverables,rollout_plan,timeline_notes,collaboration_notes,next_step,admin_notes,payload";
  const state = {
    adminRequests: [],
    prospectProjects: [],
    client: null,
    days: 30,
    session: null,
    profile: null,
    activeProposalId: null,
    activeProspectId: null,
    activeAdminTab: "requests",
    pendingConfirm: null,
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
    proposalStageFilter: $("#proposalStageFilter"),
    proposalCrmMetrics: $("#proposalCrmMetrics"),
    proposalPlanning: $("#proposalPlanning"),
    proposalPlanningMeta: $("#proposalPlanningMeta"),
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
    prospectModal: $("#prospectModal"),
    prospectModalTitle: $("#prospectModalTitle"),
    prospectModalSubtitle: $("#prospectModalSubtitle"),
    prospectModalStage: $("#prospectModalStage"),
    prospectModalProbability: $("#prospectModalProbability"),
    prospectModalValue: $("#prospectModalValue"),
    prospectModalWeighted: $("#prospectModalWeighted"),
    prospectModalFollowUp: $("#prospectModalFollowUp"),
    prospectModalAppointment: $("#prospectModalAppointment"),
    prospectModalLastContact: $("#prospectModalLastContact"),
    prospectModalContact: $("#prospectModalContact"),
    prospectModalChips: $("#prospectModalChips"),
    prospectModalEmail: $("#prospectModalEmail"),
    prospectModalPhone: $("#prospectModalPhone"),
    prospectModalCompany: $("#prospectModalCompany"),
    prospectModalService: $("#prospectModalService"),
    prospectModalPresentationStatus: $("#prospectModalPresentationStatus"),
    prospectModalRef: $("#prospectModalRef"),
    prospectModalPitch: $("#prospectModalPitch"),
    prospectModalContext: $("#prospectModalContext"),
    prospectModalFollowUpNote: $("#prospectModalFollowUpNote"),
    prospectOpenPublicLink: $("#prospectOpenPublicLink"),
    prospectCopyPublicLink: $("#prospectCopyPublicLink"),
    prospectOpenEditorButton: $("#prospectOpenEditorButton"),
    prospectScheduleFollowUpButton: $("#prospectScheduleFollowUpButton"),
    prospectModalForm: $("#prospectModalForm"),
    prospectModalStatus: $("#prospectModalStatus"),
    followUpModal: $("#followUpModal"),
    followUpForm: $("#followUpForm"),
    followUpModalIntro: $("#followUpModalIntro"),
    followUpStatus: $("#followUpStatus"),
    confirmModal: $("#confirmModal"),
    confirmModalTitle: $("#confirmModalTitle"),
    confirmModalMessage: $("#confirmModalMessage"),
    confirmModalAccept: $("#confirmModalAccept"),
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

  const filterMenuOptions = (container) =>
    container ? Array.from(container.querySelectorAll("[data-filter-option]")) : [];

  const filterMenuSelectedValues = (container) =>
    filterMenuOptions(container)
      .filter((input) => input.checked)
      .map((input) => input.value);

  const filterMenuHasActiveSubset = (container) => {
    const options = filterMenuOptions(container);
    const selected = filterMenuSelectedValues(container);
    return Boolean(options.length && selected.length && selected.length < options.length);
  };

  const filterMenuMatches = (container, value) => {
    if (!container) return true;
    if (!filterMenuHasActiveSubset(container)) return true;
    return filterMenuSelectedValues(container).includes(value);
  };

  const closeFilterMenu = (container) => {
    if (!container) return;
    container.classList.remove("is-open");
    container.querySelector("[data-filter-panel]")?.setAttribute("hidden", "");
    container.querySelector("[data-filter-trigger]")?.setAttribute("aria-expanded", "false");
  };

  const closeAllFilterMenus = (exceptId = "") => {
    document.querySelectorAll("[data-filter-menu].is-open").forEach((menu) => {
      if (exceptId && menu.id === exceptId) return;
      closeFilterMenu(menu);
    });
  };

  const updateFilterMenuLabel = (container) => {
    if (!container) return;
    const trigger = container.querySelector("[data-filter-trigger]");
    if (!trigger) return;

    const options = filterMenuOptions(container);
    const selected = options.filter((input) => input.checked);
    const defaultLabel = container.dataset.defaultLabel || "Filtrer";

    if (!selected.length || selected.length === options.length) {
      trigger.textContent = defaultLabel;
      return;
    }

    const labels = selected.map((input) => input.parentElement?.textContent?.trim() || input.value).filter(Boolean);
    trigger.textContent = labels.length <= 2 ? labels.join(", ") : `${labels.length} sélectionnés`;
  };

  const toggleFilterMenu = (container) => {
    if (!container) return;
    const nextOpen = !container.classList.contains("is-open");
    closeAllFilterMenus(nextOpen ? container.id : "");
    container.classList.toggle("is-open", nextOpen);
    const panel = container.querySelector("[data-filter-panel]");
    const trigger = container.querySelector("[data-filter-trigger]");
    if (panel) panel.hidden = !nextOpen;
    if (trigger) trigger.setAttribute("aria-expanded", String(nextOpen));
  };

  const initFilterMenu = (container, onChange) => {
    if (!container) return;
    const trigger = container.querySelector("[data-filter-trigger]");
    const options = filterMenuOptions(container);
    updateFilterMenuLabel(container);

    trigger?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleFilterMenu(container);
    });

    container.querySelector("[data-filter-panel]")?.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    options.forEach((input) => {
      input.addEventListener("change", () => {
        updateFilterMenuLabel(container);
        onChange?.();
      });
    });
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

  const formatCurrency = (value) => {
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount <= 0) return "À préciser";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateInputValue = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const pad = (part) => String(part).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
      date.getMinutes(),
    )}`;
  };

  const toValidDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const parseDateTimeInput = (value) => {
    const cleanValue = String(value || "").trim();
    if (!cleanValue) return null;
    const date = toValidDate(cleanValue);
    return date ? date.toISOString() : null;
  };

  const startOfToday = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  };

  const endOfToday = () => {
    const now = startOfToday();
    now.setDate(now.getDate() + 1);
    return now;
  };

  const endOfPlanningWeek = () => {
    const now = startOfToday();
    now.setDate(now.getDate() + 7);
    return now;
  };

  const clampPercent = (value, fallback = 15) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.min(100, Math.max(0, Math.round(parsed)));
  };

  const payloadText = (payload, key) =>
    payload && typeof payload === "object" && typeof payload[key] === "string" ? payload[key].trim() : "";

  const weightedPipelineValue = (item) => {
    const probability = clampPercent(item?.deal_probability, 15);
    const value = Number(item?.estimated_value);
    if (!Number.isFinite(value) || value <= 0) return 0;
    return Math.round(value * (probability / 100));
  };

  const inferCrmStage = (item) => {
    if (item?.crm_stage && crmStageLabels[item.crm_stage]) return item.crm_stage;
    if (item?.status === "accepted") return "won";
    if (item?.status === "refused" || item?.status === "archived") return "lost";
    if (item?.status === "viewed") return "follow_up";
    if (item?.status === "sent") return "proposal_sent";
    return "new";
  };

  const normalizeProspectProject = (item) => ({
    ...item,
    payload: item?.payload && typeof item.payload === "object" ? item.payload : {},
    crm_stage: inferCrmStage(item),
    deal_probability: clampPercent(item?.deal_probability, item?.status === "viewed" ? 45 : item?.status === "sent" ? 30 : 15),
    estimated_value: item?.estimated_value === null || item?.estimated_value === undefined ? null : Number(item.estimated_value),
    lead_temperature: leadTemperatureLabels[item?.lead_temperature] ? item.lead_temperature : "warm",
    follow_up_at: item?.follow_up_at || null,
    appointment_at: item?.appointment_at || null,
    last_contacted_at: item?.last_contacted_at || null,
  });

  const followUpHistory = (item) => {
    const history = item?.payload?.crm_follow_up_history;
    return Array.isArray(history) ? history : [];
  };

  const latestFollowUpEntry = (item) => followUpHistory(item)[0] || null;

  const scheduleBadgeText = (value, labels) => {
    const date = toValidDate(value);
    if (!date) return labels.none;
    const diff = date.getTime() - Date.now();
    const dayDiff = Math.round(diff / 86400000);
    if (dayDiff < 0) return `${labels.overdue} · ${formatDate(value)}`;
    if (dayDiff === 0) return `${labels.today} · ${formatDate(value)}`;
    if (dayDiff === 1) return `${labels.tomorrow} · ${formatDate(value)}`;
    return `${labels.upcoming} · ${formatDate(value)}`;
  };

  const followUpBadgeText = (value) =>
    scheduleBadgeText(value, {
      none: "Relance non planifiée",
      overdue: "Relance en retard",
      today: "Relance aujourd'hui",
      tomorrow: "Relance demain",
      upcoming: "Relance prévue",
    });

  const appointmentBadgeText = (value) =>
    scheduleBadgeText(value, {
      none: "Rendez-vous non planifié",
      overdue: "Rendez-vous dépassé",
      today: "Rendez-vous aujourd'hui",
      tomorrow: "Rendez-vous demain",
      upcoming: "Rendez-vous prévu",
    });

  const isDateOverdue = (value) => {
    const date = toValidDate(value);
    return Boolean(date && date.getTime() < Date.now());
  };

  const isFollowUpOverdue = (value) => isDateOverdue(value);

  const syncProjectStatusFromCrmStage = (currentStatus, crmStage) => {
    if (crmStage === "won") return "accepted";
    if (crmStage === "lost") return "refused";
    if (["proposal_sent", "follow_up", "no_response", "negotiation"].includes(crmStage) && currentStatus === "draft") {
      return "sent";
    }
    return currentStatus;
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

  const crmStageOptions = (current) =>
    crmStageOrder
      .map((value) => `<option value="${value}" ${value === current ? "selected" : ""}>${crmStageLabels[value]}</option>`)
      .join("");

  const projectStatusTone = (status) => {
    if (status === "accepted") return "is-accepted";
    if (status === "refused") return "is-refused";
    if (status === "viewed") return "is-viewed";
    if (status === "sent") return "is-sent";
    if (status === "archived") return "is-archived";
    return "is-draft";
  };

  const crmStageTone = (stage) => {
    if (stage === "proposal_sent") return "is-proposal_sent";
    if (stage === "follow_up") return "is-follow_up";
    if (stage === "no_response") return "is-no_response";
    if (stage === "negotiation") return "is-negotiation";
    if (stage === "won") return "is-won";
    if (stage === "lost") return "is-lost";
    return "is-new";
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
    crm_stage: "new",
    deal_probability: 15,
    estimated_value: "",
    lead_temperature: "warm",
    follow_up_at: "",
    appointment_at: "",
    last_contacted_at: "",
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

    const filtered = state.adminRequests.filter((row) => {
      const matchesType = filterMenuMatches(elements.leadTypeFilter, row.type);
      const matchesStatus = filterMenuMatches(elements.leadStatusFilter, row.status);
      const matchesSearch = !query || requestSearchText(row).includes(query);
      return matchesType && matchesStatus && matchesSearch;
    });

    const openCount = filtered.filter((row) => ["new", "in_progress", "no_response"].includes(row.status)).length;
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
    if (availableTab !== "projects" && !elements.prospectModal?.hidden) {
      closeProspectModal();
    }
    if (availableTab !== "projects" && !elements.followUpModal?.hidden) {
      closeFollowUpModal();
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
    syncModalBodyState();
    window.requestAnimationFrame(() => {
      elements.proposalForm?.elements?.namedItem("project_title")?.focus();
    });
  };

  const closeProposalModal = () => {
    if (!elements.proposalModal) return;
    elements.proposalModal.hidden = true;
    syncModalBodyState();
  };

  const syncModalBodyState = () => {
    const hasOpenModal =
      !elements.proposalModal?.hidden || !elements.prospectModal?.hidden || !elements.followUpModal?.hidden || !elements.confirmModal?.hidden;
    document.body.classList.toggle("proposal-modal-open", hasOpenModal);
  };

  const proposalById = (proposalId) => state.prospectProjects.find((item) => item.id === proposalId) || null;

  const syncProspectModalAccess = () => {
    if (!elements.prospectModalForm) return;
    const editable = canEditRequests();
    Array.from(elements.prospectModalForm.elements).forEach((field) => {
      if (!(field instanceof HTMLElement)) return;
      if ("disabled" in field) field.disabled = !editable;
    });
    if (elements.prospectOpenEditorButton) elements.prospectOpenEditorButton.disabled = !editable;
    if (elements.prospectScheduleFollowUpButton) elements.prospectScheduleFollowUpButton.disabled = !editable;
  };

  const populateProspectModal = (proposal) => {
    if (!elements.prospectModalForm) return;
    const item = normalizeProspectProject(proposal);
    const latestFollowUp = latestFollowUpEntry(item);
    const followUpNote = latestFollowUp?.note || payloadText(item.payload, "crm_last_follow_up_note");
    state.activeProspectId = item.id || null;

    if (elements.prospectModalTitle) {
      elements.prospectModalTitle.textContent = item.project_title || "Projet prospect";
    }
    if (elements.prospectModalSubtitle) {
      elements.prospectModalSubtitle.textContent =
        item.short_pitch || "Pilotez la prochaine action, la probabilité de signature et le niveau de maturité du dossier.";
    }
    if (elements.prospectModalStage) {
      elements.prospectModalStage.textContent = crmStageLabels[item.crm_stage] || item.crm_stage;
    }
    if (elements.prospectModalProbability) {
      elements.prospectModalProbability.textContent = `${clampPercent(item.deal_probability, 15)}%`;
    }
    if (elements.prospectModalValue) {
      elements.prospectModalValue.textContent = formatCurrency(item.estimated_value);
    }
    if (elements.prospectModalWeighted) {
      elements.prospectModalWeighted.textContent = formatCurrency(weightedPipelineValue(item));
    }
    if (elements.prospectModalFollowUp) {
      elements.prospectModalFollowUp.textContent = item.follow_up_at ? formatDate(item.follow_up_at) : "Non planifiée";
    }
    if (elements.prospectModalAppointment) {
      elements.prospectModalAppointment.textContent = item.appointment_at ? formatDate(item.appointment_at) : "Non planifié";
    }
    if (elements.prospectModalLastContact) {
      elements.prospectModalLastContact.textContent = item.last_contacted_at ? formatDate(item.last_contacted_at) : "Non renseigné";
    }
    if (elements.prospectModalContact) {
      elements.prospectModalContact.textContent = item.client_name || item.client_email || "Prospect à préciser";
    }
    if (elements.prospectModalEmail) elements.prospectModalEmail.textContent = item.client_email || "-";
    if (elements.prospectModalPhone) elements.prospectModalPhone.textContent = item.client_phone || "-";
    if (elements.prospectModalCompany) elements.prospectModalCompany.textContent = item.client_company || "-";
    if (elements.prospectModalService) elements.prospectModalService.textContent = item.service_line || "-";
    if (elements.prospectModalPresentationStatus) {
      elements.prospectModalPresentationStatus.textContent = projectStatusLabels[item.status] || item.status;
    }
    if (elements.prospectModalRef) elements.prospectModalRef.textContent = item.public_ref || "-";
    if (elements.prospectModalPitch) {
      elements.prospectModalPitch.textContent = item.short_pitch || "Aucun pitch rédigé pour le moment.";
    }
    if (elements.prospectModalContext) {
      elements.prospectModalContext.textContent = item.client_context || "Aucun contexte détaillé pour le moment.";
    }
    if (elements.prospectModalFollowUpNote) {
      elements.prospectModalFollowUpNote.textContent = followUpNote || "Aucune relance enregistrée pour le moment.";
    }
    if (elements.prospectModalChips) {
      elements.prospectModalChips.innerHTML = `
        <span class="crm-chip ${crmStageTone(item.crm_stage)}">${escapeHtml(crmStageLabels[item.crm_stage] || item.crm_stage)}</span>
        <span class="crm-chip is-${escapeHtml(item.lead_temperature)}">${escapeHtml(
          leadTemperatureLabels[item.lead_temperature] || item.lead_temperature,
        )}</span>
        <span class="crm-chip">${escapeHtml(proposalSourceText(item))}</span>
      `;
    }

    if (elements.prospectOpenPublicLink) {
      const publicUrl = proposalUrl(item.public_ref);
      elements.prospectOpenPublicLink.href = publicUrl;
      elements.prospectOpenPublicLink.classList.toggle("is-disabled", !item.public_ref);
      elements.prospectOpenPublicLink.setAttribute("aria-disabled", item.public_ref ? "false" : "true");
    }
    if (elements.prospectCopyPublicLink) {
      elements.prospectCopyPublicLink.disabled = !item.public_ref;
      elements.prospectCopyPublicLink.dataset.publicRef = item.public_ref || "";
    }
    if (elements.prospectOpenEditorButton) {
      elements.prospectOpenEditorButton.dataset.proposalEdit = item.id || "";
    }
    if (elements.prospectScheduleFollowUpButton) {
      elements.prospectScheduleFollowUpButton.dataset.proposalRelance = item.id || "";
    }

    const form = elements.prospectModalForm.elements;
    form.namedItem("id").value = item.id || "";
    form.namedItem("crm_stage").innerHTML = crmStageOptions(item.crm_stage);
    form.namedItem("crm_stage").value = item.crm_stage;
    form.namedItem("lead_temperature").value = item.lead_temperature;
    form.namedItem("deal_probability").value = clampPercent(item.deal_probability, 15);
    form.namedItem("estimated_value").value =
      Number.isFinite(Number(item.estimated_value)) && Number(item.estimated_value) > 0 ? String(Number(item.estimated_value)) : "";
    form.namedItem("follow_up_at").value = formatDateInputValue(item.follow_up_at);
    form.namedItem("appointment_at").value = formatDateInputValue(item.appointment_at);
    form.namedItem("last_contacted_at").value = formatDateInputValue(item.last_contacted_at);
    form.namedItem("next_step").value = item.next_step || "";
    form.namedItem("admin_notes").value = item.admin_notes || "";

    elements.prospectModalStatus.textContent = "";
    syncProspectModalAccess();
    renderProspectProjects();
  };

  const openProspectModal = (proposal) => {
    if (!elements.prospectModal) return;
    setAdminTab("projects");
    populateProspectModal(proposal);
    elements.prospectModal.hidden = false;
    syncModalBodyState();
    window.requestAnimationFrame(() => {
      elements.prospectModalForm?.elements?.namedItem("crm_stage")?.focus();
    });
  };

  const closeProspectModal = () => {
    if (!elements.prospectModal) return;
    elements.prospectModal.hidden = true;
    state.activeProspectId = null;
    syncModalBodyState();
    renderProspectProjects();
  };

  const nextDefaultFollowUp = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    date.setHours(10, 0, 0, 0);
    return date.toISOString();
  };

  const populateFollowUpForm = (proposal) => {
    if (!elements.followUpForm) return;
    const item = normalizeProspectProject(proposal);
    const latestFollowUp = latestFollowUpEntry(item);
    const defaultStage = ["follow_up", "no_response", "negotiation", "won", "lost"].includes(item.crm_stage)
      ? item.crm_stage
      : "follow_up";

    elements.followUpForm.elements.namedItem("id").value = item.id || "";
    elements.followUpForm.elements.namedItem("follow_up_at").value = formatDateInputValue(item.follow_up_at || nextDefaultFollowUp());
    elements.followUpForm.elements.namedItem("crm_stage").value = defaultStage;
    elements.followUpForm.elements.namedItem("deal_probability").value = clampPercent(item.deal_probability, 15);
    elements.followUpForm.elements.namedItem("note").value =
      latestFollowUp?.note || payloadText(item.payload, "crm_last_follow_up_note");
    elements.followUpForm.elements.namedItem("touch_last_contact").checked = true;
    elements.followUpStatus.textContent = "";
    if (elements.followUpModalIntro) {
      elements.followUpModalIntro.textContent = `${item.client_name || item.client_email || "Ce prospect"} peut être relancé sans casser votre rythme de traitement.`;
    }
  };

  const openFollowUpModal = (proposal) => {
    if (!elements.followUpModal) return;
    populateFollowUpForm(proposal);
    elements.followUpModal.hidden = false;
    syncModalBodyState();
    window.requestAnimationFrame(() => {
      elements.followUpForm?.elements?.namedItem("follow_up_at")?.focus();
    });
  };

  const closeFollowUpModal = () => {
    if (!elements.followUpModal) return;
    elements.followUpModal.hidden = true;
    syncModalBodyState();
  };

  const settleConfirmation = (confirmed) => {
    const resolver = state.pendingConfirm;
    state.pendingConfirm = null;
    if (elements.confirmModal) elements.confirmModal.hidden = true;
    syncModalBodyState();
    if (typeof resolver === "function") resolver(confirmed);
  };

  const requestConfirmation = ({ title, message, confirmLabel = "Confirmer" }) =>
    new Promise((resolve) => {
      state.pendingConfirm = resolve;
      elements.confirmModalTitle.textContent = title;
      elements.confirmModalMessage.textContent = message;
      elements.confirmModalAccept.textContent = confirmLabel;
      elements.confirmModal.hidden = false;
      syncModalBodyState();
    });

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
      item.crm_stage,
      crmStageLabels[item.crm_stage],
      item.deal_probability,
      item.estimated_value,
      item.lead_temperature,
      payloadText(item.payload, "crm_last_follow_up_note"),
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

  const renderProposalCrmMetrics = (items) => {
    if (!elements.proposalCrmMetrics) return;

    const pipelineValue = items.reduce((sum, item) => sum + (Number(item.estimated_value) || 0), 0);
    const weightedValue = items.reduce((sum, item) => sum + weightedPipelineValue(item), 0);
    const dueFollowUps = items.filter(
      (item) => ["follow_up", "no_response"].includes(item.crm_stage) || isFollowUpOverdue(item.follow_up_at),
    ).length;
    const noResponseCount = items.filter((item) => item.crm_stage === "no_response").length;
    const plannedAppointments = items.filter((item) => toValidDate(item.appointment_at)).length;
    const averageProbability = items.length
      ? Math.round(items.reduce((sum, item) => sum + clampPercent(item.deal_probability, 15), 0) / items.length)
      : 0;

    elements.proposalCrmMetrics.innerHTML = `
      <article class="proposal-crm-metric">
        <span>Valeur pipeline</span>
        <strong>${escapeHtml(formatCurrency(pipelineValue))}</strong>
        <small>Total estimé des opportunités visibles.</small>
      </article>
      <article class="proposal-crm-metric">
        <span>CA pondéré</span>
        <strong>${escapeHtml(formatCurrency(weightedValue))}</strong>
        <small>Projection pondérée par la probabilité de signature.</small>
      </article>
      <article class="proposal-crm-metric">
        <span>Relances à surveiller</span>
        <strong>${escapeHtml(String(dueFollowUps))}</strong>
        <small>Prospects à rappeler ou sans retour exploitable.</small>
      </article>
      <article class="proposal-crm-metric">
        <span>Probabilité moyenne</span>
        <strong>${escapeHtml(`${averageProbability}%`)}</strong>
        <small>${escapeHtml(
          `${noResponseCount} prospect${noResponseCount > 1 ? "s" : ""} sans réponse · ${plannedAppointments} RDV planifié${
            plannedAppointments > 1 ? "s" : ""
          }`,
        )}</small>
      </article>
    `;
  };

  const planningPriorityItems = (items, dateField = "follow_up_at") =>
    items
      .filter((item) => !["won", "lost"].includes(item.crm_stage))
      .sort((a, b) => {
        const aDue = toValidDate(a[dateField])?.getTime() ?? Number.POSITIVE_INFINITY;
        const bDue = toValidDate(b[dateField])?.getTime() ?? Number.POSITIVE_INFINITY;
        if (aDue !== bDue) return aDue - bDue;
        return new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at);
      });

  const renderPlanningCard = (item, options = {}) => {
    const mode = options.mode === "appointment" ? "appointment" : "follow_up";
    const scheduleAt = mode === "appointment" ? item.appointment_at : item.follow_up_at;
    const scheduleBadge = mode === "appointment" ? appointmentBadgeText(scheduleAt) : followUpBadgeText(scheduleAt);
    const secondaryAction = mode === "appointment"
      ? `<button class="button button-secondary button-compact" type="button" data-proposal-edit="${escapeHtml(item.id)}">Éditer</button>`
      : `<button class="button button-primary button-compact" type="button" data-proposal-relance="${escapeHtml(item.id)}">Relancer</button>`;
    return `
      <article class="crm-planning-item ${mode === "appointment" ? "is-appointment" : ""}">
        <div class="crm-planning-item-head">
          <strong>${escapeHtml(item.client_name || item.client_email || "Prospect à préciser")}</strong>
          <span>${escapeHtml(`${clampPercent(item.deal_probability, 15)}% · ${formatCurrency(item.estimated_value)}`)}</span>
        </div>
        <div class="crm-planning-item-meta">
          <span>${escapeHtml(item.project_title || "Projet sans titre")}</span>
          <span>${escapeHtml(crmStageLabels[item.crm_stage] || item.crm_stage)}</span>
          <span>${escapeHtml(scheduleBadge)}</span>
        </div>
        <div class="crm-planning-item-actions">
          <button class="button button-secondary button-compact" type="button" data-prospect-open="${escapeHtml(item.id)}">Voir</button>
          ${secondaryAction}
        </div>
      </article>
    `;
  };

  const renderProposalPlanning = (items) => {
    if (!elements.proposalPlanning || !elements.proposalPlanningMeta) return;

    const todayStart = startOfToday();
    const todayEnd = endOfToday();
    const weekEnd = endOfPlanningWeek();
    const activeItems = items.filter((item) => !["won", "lost"].includes(item.crm_stage));
    const appointments = planningPriorityItems(activeItems.filter((item) => toValidDate(item.appointment_at)), "appointment_at");
    const priorities = planningPriorityItems(activeItems.filter((item) => !toValidDate(item.appointment_at)));
    const overdue = [];
    const today = [];
    const week = [];
    const unscheduled = [];

    priorities.forEach((item) => {
      if (!item.follow_up_at) {
        if (["follow_up", "no_response", "proposal_sent", "negotiation"].includes(item.crm_stage)) {
          unscheduled.push(item);
        }
        return;
      }

      const dueDate = new Date(item.follow_up_at);
      if (Number.isNaN(dueDate.getTime())) {
        unscheduled.push(item);
        return;
      }

      if (dueDate < todayStart) {
        overdue.push(item);
        return;
      }

      if (dueDate >= todayStart && dueDate < todayEnd) {
        today.push(item);
        return;
      }

      if (dueDate >= todayEnd && dueDate < weekEnd) {
        week.push(item);
        return;
      }

      unscheduled.push(item);
    });

    const totalPlanned = overdue.length + today.length + week.length;
    elements.proposalPlanningMeta.textContent = `${appointments.length} rendez-vous planifié${
      appointments.length > 1 ? "s" : ""
    } · ${totalPlanned} relance${totalPlanned > 1 ? "s" : ""} planifiée${totalPlanned > 1 ? "s" : ""} · ${
      unscheduled.length
    } dossier${unscheduled.length > 1 ? "s" : ""} à cadrer`;

    const columns = [
      {
        key: "appointments",
        title: "Rendez-vous",
        subtitle: "Prospects calés dans l'agenda",
        items: appointments,
        mode: "appointment",
      },
      {
        key: "overdue",
        title: "En retard",
        subtitle: "À reprendre en priorité",
        items: overdue,
        mode: "follow_up",
      },
      {
        key: "today",
        title: "Aujourd'hui",
        subtitle: "Actions à faire maintenant",
        items: today,
        mode: "follow_up",
      },
      {
        key: "week",
        title: "Cette semaine",
        subtitle: "Suivi à maintenir",
        items: week,
        mode: "follow_up",
      },
      {
        key: "unscheduled",
        title: "Plus tard / à cadrer",
        subtitle: "Relance lointaine ou non calée",
        items: unscheduled,
        mode: "follow_up",
      },
    ];

    elements.proposalPlanning.innerHTML = columns
      .map(
        (column) => `
          <section class="crm-planning-column is-${escapeHtml(column.key)}" aria-label="${escapeHtml(column.title)}">
            <div class="crm-planning-column-head">
              <div>
                <strong>${escapeHtml(column.title)}</strong>
                <small>${escapeHtml(column.subtitle)}</small>
              </div>
              <span class="crm-planning-count">${escapeHtml(String(column.items.length))}</span>
            </div>
            <div class="crm-planning-list">
              ${
                column.items.length
                  ? column.items.slice(0, 6).map((item) => renderPlanningCard(item, { mode: column.mode })).join("")
                  : `<p class="crm-planning-empty">Aucun dossier dans cette zone.</p>`
              }
            </div>
          </section>
        `,
      )
      .join("");
  };

  const renderProspectCard = (item) => {
    const active = state.activeProspectId === item.id || state.activeProposalId === item.id;
    const completion = proposalCompletion(item);
    const followUpText = followUpBadgeText(item.follow_up_at);
    const appointmentText = appointmentBadgeText(item.appointment_at);
    const followUpNote = payloadText(item.payload, "crm_last_follow_up_note");
    const weighted = weightedPipelineValue(item);
    const scheduleLabel = item.appointment_at ? "Rendez-vous" : "Relance";
    const scheduleValue = item.appointment_at
      ? formatDate(item.appointment_at)
      : item.follow_up_at
        ? formatDate(item.follow_up_at)
        : "À planifier";

    return `
      <article class="proposal-card crm-card ${active ? "is-active" : ""}" data-proposal-id="${escapeHtml(item.id)}">
        <div class="proposal-card-head">
          <div>
            <p class="proposal-card-kicker">${escapeHtml(item.service_line || proposalSourceText(item))}</p>
            <h3>${escapeHtml(item.project_title || "Projet sans titre")}</h3>
          </div>
          <span class="crm-stage-pill ${crmStageTone(item.crm_stage)}">${escapeHtml(
            crmStageLabels[item.crm_stage] || item.crm_stage,
          )}</span>
        </div>
        <div class="crm-card-status-row">
          <span class="proposal-status-pill ${projectStatusTone(item.status)}">${escapeHtml(
            projectStatusLabels[item.status] || item.status,
          )}</span>
          <span class="crm-temperature-pill is-${escapeHtml(item.lead_temperature)}">${escapeHtml(
            leadTemperatureLabels[item.lead_temperature] || item.lead_temperature,
          )}</span>
        </div>
        <div class="proposal-card-meta-grid">
          <span><strong>Prospect</strong>${escapeHtml(item.client_name || item.client_email || "À préciser")}</span>
          <span><strong>Entreprise</strong>${escapeHtml(item.client_company || "À préciser")}</span>
          <span><strong>Valeur</strong>${escapeHtml(formatCurrency(item.estimated_value))}</span>
          <span><strong>Mise à jour</strong>${escapeHtml(formatDate(item.updated_at || item.created_at))}</span>
        </div>
        <div class="crm-card-metric-grid">
          <article>
            <span>Probabilité</span>
            <strong>${escapeHtml(`${clampPercent(item.deal_probability, 15)}%`)}</strong>
          </article>
          <article>
            <span>Pondéré</span>
            <strong>${escapeHtml(formatCurrency(weighted))}</strong>
          </article>
          <article>
            <span>${escapeHtml(scheduleLabel)}</span>
            <strong>${escapeHtml(scheduleValue)}</strong>
          </article>
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
        <div class="crm-card-highlight-row">
          ${
            item.appointment_at
              ? `<span class="crm-card-highlight is-appointment ${isDateOverdue(item.appointment_at) ? "is-overdue" : ""}">${escapeHtml(
                  appointmentText,
                )}</span>`
              : ""
          }
          ${
            item.follow_up_at || !item.appointment_at
              ? `<span class="crm-card-highlight ${isFollowUpOverdue(item.follow_up_at) ? "is-overdue" : ""}">${escapeHtml(
                  followUpText,
                )}</span>`
              : ""
          }
          ${
            followUpNote
              ? `<span class="crm-card-highlight">${escapeHtml(
                  followUpNote.length > 64 ? `${followUpNote.slice(0, 61)}...` : followUpNote,
                )}</span>`
              : ""
          }
        </div>
        <p>${escapeHtml(item.short_pitch || item.service_line || "Présentation à détailler.")}</p>
        <div class="proposal-card-actions">
          <button class="button button-primary" type="button" data-prospect-open="${escapeHtml(item.id)}">Fiche prospect</button>
          <button class="button button-secondary" type="button" data-proposal-relance="${escapeHtml(item.id)}">Relancer</button>
          <button class="button button-secondary" type="button" data-proposal-edit="${escapeHtml(item.id)}">Éditer</button>
        </div>
      </article>
    `;
  };

  const renderProspectProjects = () => {
    if (!elements.proposalList) return;

    if (elements.proposalStudioPanel) {
      elements.proposalStudioPanel.hidden = !canViewAdmin();
    }
    if (!canViewAdmin()) return;

    const query = (elements.proposalSearch?.value || "").trim().toLowerCase();
    const stageSelection = filterMenuSelectedValues(elements.proposalStageFilter);
    const activeStages = filterMenuHasActiveSubset(elements.proposalStageFilter)
      ? stageSelection
      : crmStageOrder;
    const filtered = state.prospectProjects.filter((item) => {
      const matchesStatus = filterMenuMatches(elements.proposalStatusFilter, item.status);
      const matchesStage = filterMenuMatches(elements.proposalStageFilter, item.crm_stage);
      const matchesQuery = !query || proposalSearchText(item).includes(query);
      return matchesStatus && matchesStage && matchesQuery;
    });

    const activeCount = filtered.filter((item) => !["won", "lost"].includes(item.crm_stage)).length;
    const weighted = filtered.reduce((sum, item) => sum + weightedPipelineValue(item), 0);
    const weightedLabel = weighted > 0 ? `${formatCurrency(weighted)} pondérés` : "projection à préciser";
    if (elements.proposalStudioMeta) {
      elements.proposalStudioMeta.textContent = `${filtered.length} projet${filtered.length > 1 ? "s" : ""} · ${activeCount} actif${
        activeCount > 1 ? "s" : ""
      } · ${weightedLabel}`;
    }
    renderProposalCrmMetrics(filtered);
    renderProposalPlanning(filtered);

    if (elements.createProposalButton) {
      elements.createProposalButton.hidden = !canEditRequests();
    }
    elements.proposalList.innerHTML = filtered.length
      ? `
          <div class="crm-board">
            ${activeStages
              .map((stage) => {
                const stageItems = filtered
                  .filter((item) => item.crm_stage === stage)
                  .sort((a, b) => {
                    const aDue = a.follow_up_at ? new Date(a.follow_up_at).getTime() : Number.POSITIVE_INFINITY;
                    const bDue = b.follow_up_at ? new Date(b.follow_up_at).getTime() : Number.POSITIVE_INFINITY;
                    if (aDue !== bDue) return aDue - bDue;
                    return new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at);
                  });
                const stageValue = stageItems.reduce((sum, item) => sum + weightedPipelineValue(item), 0);
                return `
                  <section class="crm-column is-${escapeHtml(stage)}" aria-label="${escapeHtml(
                    crmStageLabels[stage] || stage,
                  )}">
                    <div class="crm-column-head">
                      <div>
                        <strong>${escapeHtml(crmStageLabels[stage] || stage)}</strong>
                        <small>${escapeHtml(
                          stageValue > 0 ? `${formatCurrency(stageValue)} pondérés` : "Aucune projection pondérée",
                        )}</small>
                      </div>
                      <span class="crm-column-count">${escapeHtml(String(stageItems.length))}</span>
                    </div>
                    <div class="crm-column-list">
                      ${
                        stageItems.length
                          ? stageItems.map(renderProspectCard).join("")
                          : `<p class="empty-state">Aucun prospect dans cette étape.</p>`
                      }
                    </div>
                  </section>
                `;
              })
              .join("")}
          </div>
        `
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
      .select(prospectProjectSelect)
      .order("updated_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    state.prospectProjects = (data || []).map(normalizeProspectProject);
    renderProspectProjects();

    if (state.activeProposalId) {
      const refreshed = state.prospectProjects.find((item) => item.id === state.activeProposalId);
      if (refreshed) {
        populateProposalForm(refreshed);
      }
    }

    if (state.activeProspectId && !elements.prospectModal?.hidden) {
      const refreshedProspect = state.prospectProjects.find((item) => item.id === state.activeProspectId);
      if (refreshedProspect) {
        populateProspectModal(refreshedProspect);
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
    if (status === "in_progress" || status === "no_response") return 3;
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
    const activeCount = items.filter((item) => ["new", "in_progress", "no_response"].includes(item.status)).length;
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
    if (status === "no_response") return "Votre demande reste ouverte. Une relance ou un point de reprise peut être ajouté selon le contexte.";
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

    const confirmed = await requestConfirmation({
      title: "Supprimer la demande",
      message: `Voulez-vous vraiment supprimer ${label} ? Cette action retirera définitivement la ligne de votre espace admin.`,
      confirmLabel: "Supprimer",
    });
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

  const saveProspectCrm = async () => {
    if (!canEditRequests() || !elements.prospectModalForm) return;

    const formData = new FormData(elements.prospectModalForm);
    const id = formData.get("id")?.toString().trim();
    const existingProject = proposalById(id);
    if (!id || !existingProject) return;

    const crmStage = formData.get("crm_stage")?.toString() || existingProject.crm_stage || "new";
    const estimatedValueRaw = formData.get("estimated_value")?.toString().trim();
    const estimatedValue = estimatedValueRaw ? Number(estimatedValueRaw) : null;
    const updatePayload = {
      crm_stage: crmStage,
      deal_probability: clampPercent(formData.get("deal_probability"), existingProject.deal_probability || 15),
      estimated_value: Number.isFinite(estimatedValue) && estimatedValue > 0 ? estimatedValue : null,
      lead_temperature: formData.get("lead_temperature")?.toString() || existingProject.lead_temperature || "warm",
      follow_up_at: parseDateTimeInput(formData.get("follow_up_at")),
      appointment_at: parseDateTimeInput(formData.get("appointment_at")),
      last_contacted_at: parseDateTimeInput(formData.get("last_contacted_at")),
      next_step: formData.get("next_step")?.toString().trim() || null,
      admin_notes: formData.get("admin_notes")?.toString().trim() || null,
      status: syncProjectStatusFromCrmStage(existingProject.status || "draft", crmStage),
    };

    elements.prospectModalStatus.textContent = "Enregistrement...";

    try {
      const { data, error } = await state.client
        .from("prospect_projects")
        .update(updatePayload)
        .eq("id", id)
        .select(prospectProjectSelect)
        .single();
      if (error) throw error;

      await loadProspectProjects();
      if (data) populateProspectModal(data);
      elements.prospectModalStatus.textContent = "Fiche prospect mise à jour.";
    } catch (error) {
      elements.prospectModalStatus.textContent = "Impossible d'enregistrer cette fiche prospect.";
    }
  };

  const saveFollowUp = async () => {
    if (!canEditRequests() || !elements.followUpForm) return;

    const formData = new FormData(elements.followUpForm);
    const id = formData.get("id")?.toString().trim();
    const existingProject = proposalById(id);
    if (!id || !existingProject) return;

    const followUpAt = parseDateTimeInput(formData.get("follow_up_at"));
    const crmStage = formData.get("crm_stage")?.toString() || "follow_up";
    const note = formData.get("note")?.toString().trim() || "";
    const touchLastContact = formData.get("touch_last_contact") === "on";
    const historyEntry = {
      at: new Date().toISOString(),
      scheduled_for: followUpAt,
      stage: crmStage,
      note,
    };
    const existingPayload = existingProject.payload && typeof existingProject.payload === "object" ? { ...existingProject.payload } : {};
    const nextHistory = [historyEntry, ...followUpHistory(existingProject)].slice(0, 12);
    const nextPayload = {
      ...existingPayload,
      crm_follow_up_history: nextHistory,
      crm_last_follow_up_note: note || null,
    };
    if (!note) delete nextPayload.crm_last_follow_up_note;

    elements.followUpStatus.textContent = "Enregistrement...";

    try {
      const { data, error } = await state.client
        .from("prospect_projects")
        .update({
          crm_stage: crmStage,
          deal_probability: clampPercent(formData.get("deal_probability"), existingProject.deal_probability || 15),
          follow_up_at: followUpAt,
          last_contacted_at: touchLastContact ? new Date().toISOString() : existingProject.last_contacted_at,
          payload: nextPayload,
          status: syncProjectStatusFromCrmStage(existingProject.status || "draft", crmStage),
        })
        .eq("id", id)
        .select(prospectProjectSelect)
        .single();
      if (error) throw error;

      await loadProspectProjects();
      closeFollowUpModal();
      if (data && !elements.prospectModal.hidden) populateProspectModal(data);
      setStatus("Relance enregistrée.");
    } catch (error) {
      elements.followUpStatus.textContent = "Impossible d'enregistrer cette relance.";
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
      crm_stage: existingProject?.crm_stage || "new",
      deal_probability: clampPercent(existingProject?.deal_probability, 15),
      estimated_value:
        Number.isFinite(Number(existingProject?.estimated_value)) && Number(existingProject.estimated_value) > 0
          ? Number(existingProject.estimated_value)
          : null,
      lead_temperature: existingProject?.lead_temperature || "warm",
      follow_up_at: existingProject?.follow_up_at || null,
      appointment_at: existingProject?.appointment_at || null,
      last_contacted_at: existingProject?.last_contacted_at || null,
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
          .select(prospectProjectSelect)
          .single();
        if (error) throw error;
        savedRow = data;
      } else {
        const { data, error } = await state.client
          .from("prospect_projects")
          .insert(payload)
          .select(prospectProjectSelect)
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

      if (role() === "commercial" && isActive()) {
        window.location.replace("crm-ads.html");
        return;
      }

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
    initFilterMenu(elements.leadTypeFilter, renderAllAdminRequests);
    initFilterMenu(elements.leadStatusFilter, renderAllAdminRequests);
    elements.adminTabs.forEach((button) => {
      button.addEventListener("click", () => {
        setAdminTab(button.dataset.adminTab);
      });
    });
    elements.proposalSearch?.addEventListener("input", renderProspectProjects);
    initFilterMenu(elements.proposalStatusFilter, renderProspectProjects);
    initFilterMenu(elements.proposalStageFilter, renderProspectProjects);
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
    elements.prospectOpenPublicLink?.addEventListener("click", (event) => {
      if (elements.prospectOpenPublicLink.getAttribute("aria-disabled") === "true") {
        event.preventDefault();
      }
    });
    elements.prospectCopyPublicLink?.addEventListener("click", async () => {
      const publicRef = elements.prospectCopyPublicLink.dataset.publicRef || "";
      await copyProposalPublicLink(publicRef);
      if (elements.prospectModalStatus) {
        elements.prospectModalStatus.textContent = publicRef
          ? "Lien public copié dans le presse-papiers."
          : "Aucun lien public disponible.";
      }
    });
    elements.prospectModalForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      await saveProspectCrm();
    });
    elements.followUpForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      await saveFollowUp();
    });
    elements.confirmModalAccept?.addEventListener("click", () => {
      settleConfirmation(true);
    });
    elements.proposalModalClosers.forEach((button) => {
      button.addEventListener("click", closeProposalModal);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && document.querySelector("[data-filter-menu].is-open")) {
        closeAllFilterMenus();
        return;
      }
      if (event.key !== "Escape") return;
      if (!elements.followUpModal?.hidden) {
        closeFollowUpModal();
        return;
      }
      if (!elements.confirmModal?.hidden) {
        settleConfirmation(false);
        return;
      }
      if (!elements.prospectModal?.hidden) {
        closeProspectModal();
        return;
      }
      if (!elements.proposalModal?.hidden) closeProposalModal();
    });

    document.addEventListener("click", async (event) => {
      if (!event.target.closest("[data-filter-menu]")) {
        closeAllFilterMenus();
      }

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
        if (proposal) {
          if (!elements.followUpModal?.hidden) closeFollowUpModal();
          if (!elements.prospectModal?.hidden) closeProspectModal();
          openProposalEditor(proposal);
        }
        return;
      }

      const prospectOpenButton = event.target.closest("[data-prospect-open]");
      if (prospectOpenButton) {
        const proposal = proposalById(prospectOpenButton.dataset.prospectOpen);
        if (proposal) openProspectModal(proposal);
        return;
      }

      const proposalRelanceButton = event.target.closest("[data-proposal-relance]");
      if (proposalRelanceButton) {
        const proposal = proposalById(proposalRelanceButton.dataset.proposalRelance);
        if (proposal) openFollowUpModal(proposal);
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

      if (event.target.closest("[data-close-prospect-modal]")) {
        closeProspectModal();
        return;
      }

      if (event.target.closest("[data-close-followup-modal]")) {
        closeFollowUpModal();
        return;
      }

      if (event.target.closest("[data-confirm-cancel]")) {
        settleConfirmation(false);
        return;
      }

      const proposalNavButton = event.target.closest("[data-proposal-nav]");
      if (proposalNavButton) {
        const section = document.getElementById(`proposal-section-${proposalNavButton.dataset.proposalNav}`);
        section?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      const proposalCard = event.target.closest(".proposal-card[data-proposal-id]");
      if (proposalCard && !event.target.closest("button, a, input, select, textarea, label, summary")) {
        const proposal = proposalById(proposalCard.dataset.proposalId);
        if (proposal) openProspectModal(proposal);
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
