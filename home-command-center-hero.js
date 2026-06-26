import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js";

const root = document.querySelector("[data-command-hero]");
const canvas = document.querySelector("#commandCenterCanvas");

if (!root || !canvas) {
  document.body?.classList.remove("is-page-loading");
} else {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const verifyMode = new URLSearchParams(window.location.search).has("verify");

  const fields = {
    kicker: document.querySelector("[data-command-kicker]"),
    title: document.querySelector("[data-command-title]"),
    text: document.querySelector("[data-command-text]"),
    metricOne: document.querySelector("[data-command-metric-one]"),
    metricTwo: document.querySelector("[data-command-metric-two]"),
    metricThree: document.querySelector("[data-command-metric-three]"),
    tags: document.querySelector("[data-command-tags]"),
    link: document.querySelector("[data-command-link]"),
    fallback: root.querySelector(".command-hero-fallback"),
  };

  const controls = Array.from(document.querySelectorAll("[data-command-focus]"));

  const focusContent = {
    web: {
      kicker: "Business stack",
      title: "Presence web et conversion",
      text: "Une presence premium reliee aux bons outils metier pour rassurer, capter la demande et convertir avec plus de clarte.",
      metricOne: "Site premium, analytics, CRM et tunnel de contact.",
      metricTwo: "Une image plus forte et des opportunites mieux qualifiees.",
      metricThree: "Une vitrine reliee au reste de l'entreprise, pas un bloc isole.",
      tags: ["SEO", "Conversion", "CRM"],
      linkHref: "developpement-web.html",
      linkLabel: "Explorer le web premium",
      focus: ["web", "analytics", "crm"],
      rotation: { x: -0.08, y: -0.52 },
      cameraZ: 12,
    },
    software: {
      kicker: "Business stack",
      title: "Logiciels metier et CRM",
      text: "CRM, facturation, interventions et pilotage se regroupent dans un logiciel adapte a votre facon de travailler.",
      metricOne: "CRM, billing, intervention board, dashboard.",
      metricTwo: "Moins de doubles saisies, plus de visibilite et un meilleur suivi.",
      metricThree: "Le coeur metier est pense comme un systeme durable et evolutif.",
      tags: ["CRM", "Facturation", "Interventions"],
      linkHref: "logiciel-sur-mesure.html",
      linkLabel: "Explorer le logiciel metier",
      focus: ["crm", "billing", "interventions"],
      rotation: { x: -0.02, y: 0.08 },
      cameraZ: 11.4,
    },
    cloud: {
      kicker: "Business stack",
      title: "Cloud, continuite et securite",
      text: "Infrastructure, supervision, sauvegarde et cyberprotection se coordonnent pour faire tourner l'activite sans angle mort.",
      metricOne: "Cloud nodes, sauvegarde, shield, monitoring.",
      metricTwo: "Plus de resilience et moins de zones fragiles dans l'exploitation.",
      metricThree: "Une architecture serieuse qui inspire confiance aux dirigeants comme aux equipes.",
      tags: ["Cloud", "Cyber", "Supervision"],
      linkHref: "services.html",
      linkLabel: "Voir l'infrastructure MBL",
      focus: ["cloud", "security", "monitoring"],
      rotation: { x: 0.03, y: 0.62 },
      cameraZ: 12.1,
    },
    automation: {
      kicker: "Business stack",
      title: "Automatisation et IA operationnelle",
      text: "Les flux importants passent par des automatisations lisibles, controlees et connectees a vos vrais outils.",
      metricOne: "Workflows, AI assistant, triggers, reporting.",
      metricTwo: "Les operations avancent plus vite sans perdre le cadre metier.",
      metricThree: "L'automatisation sert la fiabilite et la performance, pas l'effet gadget.",
      tags: ["Workflows", "IA", "Fiabilite"],
      linkHref: "agents-ia.html",
      linkLabel: "Explorer l'automatisation IA",
      focus: ["automation", "ai", "billing"],
      rotation: { x: 0.06, y: -0.9 },
      cameraZ: 11.7,
    },
    operations: {
      kicker: "Business stack",
      title: "Maintenance, assistance et formation",
      text: "Intervenir, remettre en service, accompagner et former pour que l'outil digital reste utile dans la duree.",
      metricOne: "Interventions, support, knowledge base, formation.",
      metricTwo: "Moins d'arrets, moins d'incertitude, une adoption plus simple.",
      metricThree: "MBL prend autant soin de l'usage concret que de la technique.",
      tags: ["Maintenance", "Support", "Formation"],
      linkHref: "assistance-informatique-domicile.html",
      linkLabel: "Explorer l'assistance MBL",
      focus: ["interventions", "support", "training"],
      rotation: { x: 0.12, y: 1.02 },
      cameraZ: 12.4,
    },
  };

  const moduleConfig = {
    web: {
      kind: "panel",
      label: "WEB",
      title: "Site premium",
      subtitle: "Presence + conversion",
      accent: 0x5fd8ee,
      color: 0x102637,
      position: new THREE.Vector3(-4.6, 2.1, 0.8),
      rotation: new THREE.Euler(-0.16, 0.38, 0.04),
      scenario: "web",
    },
    analytics: {
      kind: "panel",
      label: "DATA",
      title: "Analytics",
      subtitle: "Trafic + ROI",
      accent: 0xf7f9fc,
      color: 0x122a3b,
      position: new THREE.Vector3(-2.3, 3.1, -0.95),
      rotation: new THREE.Euler(-0.12, 0.18, 0.02),
      scenario: "web",
    },
    crm: {
      kind: "panel",
      label: "CRM",
      title: "Relation client",
      subtitle: "Pipeline + suivi",
      accent: 0xff6a2e,
      color: 0x12293b,
      position: new THREE.Vector3(2.9, 2.3, 0.95),
      rotation: new THREE.Euler(-0.14, -0.32, -0.02),
      scenario: "software",
    },
    billing: {
      kind: "panel",
      label: "BILL",
      title: "Facturation",
      subtitle: "Quotes + cash",
      accent: 0x9ae7f1,
      color: 0x102637,
      position: new THREE.Vector3(4.9, 1.0, -0.8),
      rotation: new THREE.Euler(-0.08, -0.5, -0.04),
      scenario: "software",
    },
    interventions: {
      kind: "panel",
      label: "OPS",
      title: "Interventions",
      subtitle: "Tickets + terrain",
      accent: 0xff8a5a,
      color: 0x102637,
      position: new THREE.Vector3(3.1, -2.1, 1.05),
      rotation: new THREE.Euler(0.08, -0.3, 0.04),
      scenario: "operations",
    },
    monitoring: {
      kind: "panel",
      label: "NOC",
      title: "Monitoring",
      subtitle: "Alertes + uptime",
      accent: 0x5fd8ee,
      color: 0x102637,
      position: new THREE.Vector3(-1.2, -2.95, -1.2),
      rotation: new THREE.Euler(0.12, 0.08, 0.02),
      scenario: "cloud",
    },
    cloud: {
      kind: "cluster",
      label: "CLOUD",
      title: "Infrastructure",
      subtitle: "Nodes + backups",
      accent: 0x8ceaf4,
      color: 0x143447,
      position: new THREE.Vector3(-5.3, 0.5, -1.25),
      rotation: new THREE.Euler(0, 0.2, 0),
      scenario: "cloud",
    },
    security: {
      kind: "shield",
      label: "CYBER",
      title: "Protection",
      subtitle: "Shield + policies",
      accent: 0xf7f9fc,
      color: 0x0f2230,
      position: new THREE.Vector3(0.95, 3.45, -1.35),
      rotation: new THREE.Euler(-0.2, -0.08, 0.04),
      scenario: "cloud",
    },
    automation: {
      kind: "flow",
      label: "FLOW",
      title: "Automatisation",
      subtitle: "Triggers + actions",
      accent: 0xff6a2e,
      color: 0x143447,
      position: new THREE.Vector3(-4.15, -2.2, 0.92),
      rotation: new THREE.Euler(0.1, 0.26, -0.04),
      scenario: "automation",
    },
    ai: {
      kind: "capsule",
      label: "AI",
      title: "AI assistant",
      subtitle: "Aide cadre",
      accent: 0xaef1ff,
      color: 0x102637,
      position: new THREE.Vector3(5.5, -0.95, 0.95),
      rotation: new THREE.Euler(0.06, -0.52, 0.06),
      scenario: "automation",
    },
    training: {
      kind: "stack",
      label: "ACA",
      title: "Formation",
      subtitle: "Adoption terrain",
      accent: 0xffa778,
      color: 0x102637,
      position: new THREE.Vector3(-2.85, -3.1, 1.08),
      rotation: new THREE.Euler(0.12, 0.22, 0.02),
      scenario: "operations",
    },
    support: {
      kind: "capsule",
      label: "SUP",
      title: "Support",
      subtitle: "Maintenance IT",
      accent: 0x7ce0ef,
      color: 0x102637,
      position: new THREE.Vector3(1.65, -3.15, -0.9),
      rotation: new THREE.Euler(0.14, -0.08, -0.02),
      scenario: "operations",
    },
  };

  const metrics = {
    frames: 0,
    selected: "web",
    hover: null,
    drag: { x: 0, y: 0 },
    pointer: { x: 0, y: 0 },
    scroll: 0,
    ready: false,
  };

  window.MBL_COMMAND_CENTER_METRICS = metrics;

  let renderer;
  let scene;
  let camera;
  let world;
  let hub;
  let resizeObserver;
  let frameId = null;
  let visible = true;
  let isReady = false;
  let activeFocus = "web";
  let hoverKey = null;

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const modules = new Map();
  const interactives = [];
  const connectionFlows = [];

  const drag = {
    active: false,
    moved: false,
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
    rotationX: 0,
    rotationY: 0,
    targetX: -0.05,
    targetY: -0.18,
    pointerId: null,
  };

  const cameraTarget = {
    x: 0,
    y: 0.86,
    z: focusContent.web.cameraZ,
    desiredX: 0,
    desiredY: 0.86,
    desiredZ: focusContent.web.cameraZ,
  };

  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    words.forEach((word, index) => {
      const test = `${line}${word} `;
      if (ctx.measureText(test).width > maxWidth && index > 0) {
        ctx.fillText(line.trim(), x, y);
        line = `${word} `;
        y += lineHeight;
      } else {
        line = test;
      }
    });
    ctx.fillText(line.trim(), x, y);
  }

  function makePanelTexture(label, title, subtitle, accentColor) {
    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 900;
    textureCanvas.height = 540;
    const ctx = textureCanvas.getContext("2d");
    const color = new THREE.Color(accentColor);
    const accent = `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, 0.95)`;

    ctx.clearRect(0, 0, textureCanvas.width, textureCanvas.height);
    ctx.fillStyle = "rgba(8, 20, 30, 0.84)";
    roundRect(ctx, 26, 26, 848, 488, 34);
    ctx.fill();

    const border = ctx.createLinearGradient(46, 46, 844, 494);
    border.addColorStop(0, "rgba(95, 216, 238, 0.7)");
    border.addColorStop(0.6, accent);
    border.addColorStop(1, "rgba(247, 249, 252, 0.34)");
    ctx.strokeStyle = border;
    ctx.lineWidth = 5;
    roundRect(ctx, 26, 26, 848, 488, 34);
    ctx.stroke();

    ctx.fillStyle = accent;
    ctx.font = "900 42px Inter, Arial, sans-serif";
    ctx.fillText(label, 70, 112);

    ctx.fillStyle = "#f7f9fc";
    ctx.font = "900 68px Inter, Arial, sans-serif";
    wrapText(ctx, title, 70, 208, 620, 72);

    ctx.fillStyle = "rgba(247, 249, 252, 0.72)";
    ctx.font = "700 30px Inter, Arial, sans-serif";
    wrapText(ctx, subtitle, 70, 336, 620, 38);

    ctx.fillStyle = "rgba(247, 249, 252, 0.08)";
    ctx.fillRect(70, 394, 540, 16);
    ctx.fillRect(70, 434, 410, 16);
    ctx.fillRect(70, 474, 250, 16);

    ctx.fillStyle = accent;
    ctx.fillRect(70, 394, 320, 16);
    ctx.fillStyle = "rgba(247, 249, 252, 0.82)";
    ctx.fillRect(70, 434, 220, 16);

    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }

  function makeLabelTexture(label, title, accentColor) {
    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 620;
    textureCanvas.height = 220;
    const ctx = textureCanvas.getContext("2d");
    const color = new THREE.Color(accentColor);
    const accent = `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, 0.96)`;

    ctx.clearRect(0, 0, textureCanvas.width, textureCanvas.height);
    ctx.fillStyle = "rgba(8, 20, 30, 0.74)";
    roundRect(ctx, 14, 14, 592, 192, 28);
    ctx.fill();

    ctx.strokeStyle = accent;
    ctx.lineWidth = 4;
    roundRect(ctx, 14, 14, 592, 192, 28);
    ctx.stroke();

    ctx.fillStyle = accent;
    ctx.font = "900 30px Inter, Arial, sans-serif";
    ctx.fillText(label, 40, 78);

    ctx.fillStyle = "#f7f9fc";
    ctx.font = "900 44px Inter, Arial, sans-serif";
    wrapText(ctx, title, 40, 144, 500, 46);

    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }

  function createRenderer() {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: verifyMode,
    });

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.setClearColor(0x000000, 0);
  }

  function createScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, 1, 0.1, 120);
    camera.position.set(0, cameraTarget.y, cameraTarget.z);

    world = new THREE.Group();
    world.position.y = -0.56;
    scene.add(world);

    const ambient = new THREE.AmbientLight(0xd9f4ff, 1.3);
    const key = new THREE.DirectionalLight(0xffffff, 2.15);
    const cyan = new THREE.PointLight(0x8ceaf4, 3.2, 24);
    const white = new THREE.PointLight(0xffffff, 1.6, 16);
    const orange = new THREE.PointLight(0xff6a2e, 2.2, 22);

    key.position.set(5, 9, 8);
    cyan.position.set(-5, 3, 5);
    white.position.set(0, 5, 0);
    orange.position.set(6, -2, 6);

    scene.add(ambient, key, cyan, white, orange);

    const floor = new THREE.Mesh(
      new THREE.CylinderGeometry(6.4, 7.1, 0.42, 72),
      new THREE.MeshStandardMaterial({
        color: 0x091722,
        roughness: 0.34,
        metalness: 0.74,
        emissive: 0x0f3040,
        emissiveIntensity: 0.1,
      }),
    );
    floor.position.set(0, -3.42, 0);
    world.add(floor);

    const floorInner = new THREE.Mesh(
      new THREE.CylinderGeometry(4.35, 5.0, 0.2, 72),
      new THREE.MeshStandardMaterial({
        color: 0x102637,
        roughness: 0.18,
        metalness: 0.58,
        emissive: 0x143447,
        emissiveIntensity: 0.14,
      }),
    );
    floorInner.position.set(0, -3.1, 0);
    world.add(floorInner);

    const grid = new THREE.GridHelper(14, 26, 0x1c8fa3, 0x143447);
    grid.position.set(0, -3.0, 0);
    grid.material.transparent = true;
    grid.material.opacity = 0.16;
    world.add(grid);

    const ringA = new THREE.Mesh(
      new THREE.TorusGeometry(3.25, 0.026, 18, 200),
      new THREE.MeshStandardMaterial({
        color: 0x66d8ea,
        roughness: 0.12,
        metalness: 0.88,
        emissive: 0x1c8fa3,
        emissiveIntensity: 0.22,
      }),
    );
    ringA.rotation.x = Math.PI * 0.5;
    ringA.position.y = -1.0;
    world.add(ringA);

    const ringB = new THREE.Mesh(
      new THREE.TorusGeometry(4.5, 0.014, 14, 210),
      new THREE.MeshBasicMaterial({
        color: 0xf7f9fc,
        transparent: true,
        opacity: 0.18,
      }),
    );
    ringB.rotation.x = Math.PI * 0.64;
    ringB.rotation.z = Math.PI * 0.22;
    ringB.position.y = -0.48;
    world.add(ringB);

    hub = new THREE.Group();
    hub.position.set(0, -0.54, 0);
    world.add(hub);

    const hubFrame = new THREE.Mesh(
      new THREE.CylinderGeometry(1.86, 2.15, 0.54, 54),
      new THREE.MeshStandardMaterial({
        color: 0x0f2230,
        roughness: 0.22,
        metalness: 0.82,
        emissive: 0x143447,
        emissiveIntensity: 0.18,
      }),
    );
    hub.add(hubFrame);

    const hubGlass = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 1.9, 0.12),
      new THREE.MeshStandardMaterial({
        color: 0x0f2230,
        roughness: 0.08,
        metalness: 0.72,
        transparent: true,
        opacity: 0.6,
        emissive: 0x1c8fa3,
        emissiveIntensity: 0.08,
      }),
    );
    hubGlass.position.set(0, 1.32, 0.22);
    hubGlass.rotation.x = -0.34;
    hub.add(hubGlass);

    const hubCore = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.8, 4),
      new THREE.MeshStandardMaterial({
        color: 0x113142,
        roughness: 0.12,
        metalness: 0.7,
        emissive: 0x1c8fa3,
        emissiveIntensity: 0.3,
      }),
    );
    hubCore.position.y = 0.78;
    hub.add(hubCore);

    const hubInner = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.38, 3),
      new THREE.MeshStandardMaterial({
        color: 0xff6a2e,
        roughness: 0.12,
        metalness: 0.4,
        emissive: 0xff6a2e,
        emissiveIntensity: 0.42,
      }),
    );
    hubInner.position.y = 0.78;
    hub.add(hubInner);

    const hubHalo = new THREE.Mesh(
      new THREE.SphereGeometry(1.3, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x8ceaf4,
        transparent: true,
        opacity: 0.08,
        depthWrite: false,
      }),
    );
    hubHalo.position.y = 0.78;
    hub.add(hubHalo);

    const centerScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(2.56, 1.42),
      new THREE.MeshBasicMaterial({
        color: 0x07131c,
        transparent: true,
        opacity: 0.9,
      }),
    );
    centerScreen.position.set(0, 1.32, 0.3);
    centerScreen.rotation.x = -0.34;
    hub.add(centerScreen);

    for (let index = 0; index < 4; index += 1) {
      const stat = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.24 + index * 0.12, 0.08),
        new THREE.MeshStandardMaterial({
          color: index % 2 === 0 ? 0x8ceaf4 : 0xff6a2e,
          roughness: 0.14,
          metalness: 0.28,
          emissive: index % 2 === 0 ? 0x1c8fa3 : 0xff6a2e,
          emissiveIntensity: 0.18,
        }),
      );
      stat.position.set(-0.68 + index * 0.44, 0.52 + stat.geometry.parameters.height * 0.28, 0.36);
      stat.rotation.x = -0.34;
      hub.add(stat);
      hub.userData.stats = hub.userData.stats || [];
      hub.userData.stats.push(stat);
    }

    hub.userData.hubCore = hubCore;
    hub.userData.hubInner = hubInner;
    hub.userData.hubHalo = hubHalo;
    hub.userData.ringA = ringA;
    hub.userData.ringB = ringB;
    hub.userData.centerScreen = centerScreen;

    Object.entries(moduleConfig).forEach(([key, config]) => createModule(key, config));
  }

  function createPanelBody(config) {
    const group = new THREE.Group();
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(1.95, 1.16, 0.12),
      new THREE.MeshStandardMaterial({
        color: config.color,
        roughness: 0.08,
        metalness: 0.84,
        transparent: true,
        opacity: 0.72,
        emissive: config.accent,
        emissiveIntensity: 0.06,
      }),
    );
    group.add(frame);

    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.76, 1.0),
      new THREE.MeshBasicMaterial({
        map: makePanelTexture(config.label, config.title, config.subtitle, config.accent),
        transparent: true,
        depthWrite: false,
      }),
    );
    screen.position.z = 0.08;
    group.add(screen);

    return { group, interactive: frame, glowTarget: frame };
  }

  function createClusterBody(config) {
    const group = new THREE.Group();
    const nodes = [];
    const positions = [
      new THREE.Vector3(0, 0.44, 0),
      new THREE.Vector3(-0.66, -0.06, 0.12),
      new THREE.Vector3(0.68, -0.1, -0.05),
      new THREE.Vector3(-0.12, -0.76, 0.22),
      new THREE.Vector3(0.38, 0.0, 0.72),
    ];

    positions.forEach((position, index) => {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(index === 0 ? 0.28 : 0.2, 26, 26),
        new THREE.MeshStandardMaterial({
          color: index === 0 ? 0xf7f9fc : config.accent,
          roughness: 0.16,
          metalness: 0.32,
          emissive: config.accent,
          emissiveIntensity: 0.22,
        }),
      );
      sphere.position.copy(position);
      group.add(sphere);
      nodes.push(sphere);
    });

    const links = [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [1, 3],
      [2, 4],
    ];

    links.forEach(([from, to]) => {
      const geometry = new THREE.BufferGeometry().setFromPoints([positions[from], positions[to]]);
      const line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
          color: config.accent,
          transparent: true,
          opacity: 0.48,
        }),
      );
      group.add(line);
    });

    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(1.78, 0.64),
      new THREE.MeshBasicMaterial({
        map: makeLabelTexture(config.label, config.title, config.accent),
        transparent: true,
      }),
    );
    label.position.set(0, -1.24, 0);
    group.add(label);

    return { group, interactive: nodes[0], glowTarget: nodes[0] };
  }

  function createShieldBody(config) {
    const group = new THREE.Group();
    const shield = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.78, 0),
      new THREE.MeshStandardMaterial({
        color: config.accent,
        roughness: 0.16,
        metalness: 0.42,
        emissive: config.accent,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.82,
      }),
    );
    shield.scale.set(0.86, 1.18, 0.4);
    group.add(shield);

    const frame = new THREE.Mesh(
      new THREE.TorusGeometry(1.02, 0.028, 16, 160),
      new THREE.MeshBasicMaterial({
        color: 0x8ceaf4,
        transparent: true,
        opacity: 0.24,
      }),
    );
    frame.rotation.x = Math.PI * 0.5;
    group.add(frame);

    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(1.74, 0.64),
      new THREE.MeshBasicMaterial({
        map: makeLabelTexture(config.label, config.title, config.accent),
        transparent: true,
      }),
    );
    label.position.set(0, -1.18, 0);
    group.add(label);

    return { group, interactive: shield, glowTarget: shield };
  }

  function createFlowBody(config) {
    const group = new THREE.Group();
    const nodes = [];
    const points = [
      new THREE.Vector3(-0.92, 0.34, 0),
      new THREE.Vector3(-0.24, 0.02, 0.06),
      new THREE.Vector3(0.42, 0.34, -0.04),
      new THREE.Vector3(1.0, -0.08, 0.06),
    ];

    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(60));
    const line = new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({
        color: config.accent,
        transparent: true,
        opacity: 0.66,
      }),
    );
    group.add(line);

    points.forEach((position, index) => {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(index === points.length - 1 ? 0.18 : 0.12, 18, 18),
        new THREE.MeshStandardMaterial({
          color: index === 0 ? 0xf7f9fc : config.accent,
          roughness: 0.14,
          metalness: 0.24,
          emissive: config.accent,
          emissiveIntensity: 0.16,
        }),
      );
      sphere.position.copy(position);
      group.add(sphere);
      nodes.push(sphere);
    });

    const packet = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 14, 14),
      new THREE.MeshBasicMaterial({
        color: config.accent,
        transparent: true,
        opacity: 0.94,
      }),
    );
    packet.userData.offset = Math.random();
    group.add(packet);

    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(1.9, 0.68),
      new THREE.MeshBasicMaterial({
        map: makeLabelTexture(config.label, config.title, config.accent),
        transparent: true,
      }),
    );
    label.position.set(0.05, -1.0, 0);
    group.add(label);

    return { group, interactive: nodes[nodes.length - 1], glowTarget: nodes[nodes.length - 1], curve, packet };
  }

  function createCapsuleBody(config) {
    const group = new THREE.Group();
    const shell = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.36, 0.9, 10, 18),
      new THREE.MeshStandardMaterial({
        color: config.color,
        roughness: 0.14,
        metalness: 0.52,
        emissive: config.accent,
        emissiveIntensity: 0.08,
      }),
    );
    shell.rotation.z = Math.PI * 0.08;
    group.add(shell);

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 20, 20),
      new THREE.MeshStandardMaterial({
        color: config.accent,
        roughness: 0.08,
        metalness: 0.26,
        emissive: config.accent,
        emissiveIntensity: 0.2,
      }),
    );
    core.position.y = 0.24;
    group.add(core);

    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(1.7, 0.62),
      new THREE.MeshBasicMaterial({
        map: makeLabelTexture(config.label, config.title, config.accent),
        transparent: true,
      }),
    );
    label.position.set(0, -1.12, 0);
    group.add(label);

    return { group, interactive: shell, glowTarget: shell };
  }

  function createStackBody(config) {
    const group = new THREE.Group();
    const layers = [];
    for (let index = 0; index < 3; index += 1) {
      const layer = new THREE.Mesh(
        new THREE.BoxGeometry(1.16, 0.16, 0.84),
        new THREE.MeshStandardMaterial({
          color: index === 0 ? config.color : 0x16384c,
          roughness: 0.14,
          metalness: 0.5,
          emissive: config.accent,
          emissiveIntensity: index === 0 ? 0.12 : 0.04,
        }),
      );
      layer.position.set(0, index * 0.2, index * -0.1);
      layer.rotation.z = index * 0.04;
      group.add(layer);
      layers.push(layer);
    }

    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(1.72, 0.64),
      new THREE.MeshBasicMaterial({
        map: makeLabelTexture(config.label, config.title, config.accent),
        transparent: true,
      }),
    );
    label.position.set(0, -0.98, 0);
    group.add(label);

    return { group, interactive: layers[0], glowTarget: layers[0] };
  }

  function buildModuleBody(config) {
    switch (config.kind) {
      case "cluster":
        return createClusterBody(config);
      case "shield":
        return createShieldBody(config);
      case "flow":
        return createFlowBody(config);
      case "capsule":
        return createCapsuleBody(config);
      case "stack":
        return createStackBody(config);
      default:
        return createPanelBody(config);
    }
  }

  function createModule(key, config) {
    const shell = new THREE.Group();
    shell.position.copy(config.position);
    shell.rotation.copy(config.rotation);
    shell.userData.key = key;

    const body = buildModuleBody(config);
    shell.add(body.group);
    world.add(shell);

    const connector = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0.62, 0),
      new THREE.Vector3(config.position.x * 0.38, config.position.y * 0.18 + 0.5, config.position.z * 0.3),
      config.position.clone(),
    );

    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(connector.getPoints(58)),
      new THREE.LineBasicMaterial({
        color: config.accent,
        transparent: true,
        opacity: 0.18,
      }),
    );
    world.add(line);

    const pulse = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 14, 14),
      new THREE.MeshBasicMaterial({
        color: config.accent,
        transparent: true,
        opacity: 0.9,
      }),
    );
    pulse.visible = false;
    world.add(pulse);

    body.interactive.userData.key = key;
    interactives.push(body.interactive);

    if (body.curve && body.packet) {
      connectionFlows.push({ packet: body.packet, curve: body.curve, key });
    }

    modules.set(key, {
      shell,
      line,
      pulse,
      connector,
      glowTarget: body.glowTarget,
      interactive: body.interactive,
      config,
    });
  }

  function setPanel(focusKey) {
    const content = focusContent[focusKey];
    if (!content) return;
    activeFocus = focusKey;
    metrics.selected = focusKey;
    root.dataset.focus = focusKey;

    if (fields.kicker) fields.kicker.textContent = content.kicker;
    if (fields.title) fields.title.textContent = content.title;
    if (fields.text) fields.textContent = content.text;
    if (fields.metricOne) fields.metricOne.textContent = content.metricOne;
    if (fields.metricTwo) fields.metricTwo.textContent = content.metricTwo;
    if (fields.metricThree) fields.metricThree.textContent = content.metricThree;
    if (fields.link) {
      fields.link.href = content.linkHref;
      fields.link.textContent = content.linkLabel;
    }

    if (fields.tags) {
      fields.tags.innerHTML = "";
      content.tags.forEach((tag) => {
        const chip = document.createElement("span");
        chip.textContent = tag;
        fields.tags.appendChild(chip);
      });
    }

    drag.targetX = content.rotation.x;
    drag.targetY = content.rotation.y;
    cameraTarget.desiredZ = content.cameraZ;

    controls.forEach((button) => {
      const selected = button.dataset.commandFocus === focusKey;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  function getScrollProgress() {
    const rect = root.getBoundingClientRect();
    const viewport = Math.max(window.innerHeight, 1);
    const progress = THREE.MathUtils.clamp(-rect.top / Math.max(rect.height - viewport * 0.38, 1), 0, 1);
    metrics.scroll = Number(progress.toFixed(3));
    root.style.setProperty("--command-scroll", progress.toFixed(3));
    return progress;
  }

  function setSize() {
    const rect = root.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(560, Math.floor(rect.height));
    const mobile = width < 820;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.7);

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = mobile ? 48 : width > 1400 ? 38 : 42;
    camera.position.y = mobile ? 1.12 : 0.86;
    cameraTarget.y = camera.position.y;
    cameraTarget.desiredY = camera.position.y;
    world.position.y = mobile ? -0.8 : -0.56;
    world.scale.setScalar(mobile ? 0.72 : width > 1400 ? 0.94 : 0.86);
    camera.updateProjectionMatrix();
  }

  function updatePointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

    metrics.pointer = {
      x: Number(pointer.x.toFixed(3)),
      y: Number(pointer.y.toFixed(3)),
    };

    cameraTarget.desiredX = pointer.x * 0.45;
    cameraTarget.desiredY = camera.position.y + pointer.y * 0.12;
  }

  function getHitKey() {
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(interactives, false)[0];
    return hit?.object?.userData?.key || null;
  }

  function updateHover(event) {
    updatePointer(event);
    hoverKey = getHitKey();
    metrics.hover = hoverKey;
    canvas.classList.toggle("is-hovering", Boolean(hoverKey));
  }

  function pickModule(event) {
    updatePointer(event);
    const key = getHitKey();
    if (!key) return;
    const scenario = moduleConfig[key]?.scenario;
    if (scenario) setPanel(scenario);
  }

  function beginDrag(event) {
    drag.active = true;
    drag.moved = false;
    drag.startX = event.clientX;
    drag.startY = event.clientY;
    drag.x = event.clientX;
    drag.y = event.clientY;
    drag.pointerId = event.pointerId;
    canvas.classList.add("is-dragging");
    canvas.setPointerCapture?.(event.pointerId);
    updatePointer(event);
  }

  function moveDrag(event) {
    updatePointer(event);

    if (!drag.active) {
      updateHover(event);
      return;
    }

    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    const total = Math.abs(event.clientX - drag.startX) + Math.abs(event.clientY - drag.startY);

    if (total > 8) drag.moved = true;

    drag.targetY += dx * 0.0036;
    drag.targetX += dy * 0.003;
    drag.targetY = THREE.MathUtils.clamp(drag.targetY, -1.28, 1.28);
    drag.targetX = THREE.MathUtils.clamp(drag.targetX, -0.42, 0.34);
    drag.x = event.clientX;
    drag.y = event.clientY;

    metrics.drag = {
      x: Number(drag.targetX.toFixed(3)),
      y: Number(drag.targetY.toFixed(3)),
    };
  }

  function endDrag(event) {
    if (!drag.active) return;
    drag.active = false;
    drag.pointerId = null;
    canvas.classList.remove("is-dragging");
    canvas.releasePointerCapture?.(event.pointerId);

    if (!drag.moved) {
      pickModule(event);
    }

    updateHover(event);
  }

  function render(time = 0) {
    frameId = null;
    metrics.frames += 1;

    const t = time * 0.001;
    const scroll = getScrollProgress();
    const activeSet = new Set(focusContent[activeFocus].focus);

    if (!reduceMotion) {
      drag.rotationY += (drag.targetY - drag.rotationY) * 0.07;
      drag.rotationX += (drag.targetX - drag.rotationX) * 0.07;
      world.rotation.y = drag.rotationY + Math.sin(t * 0.18) * 0.04;
      world.rotation.x = drag.rotationX - scroll * 0.08;
      world.position.y = (window.innerWidth < 820 ? -0.8 : -0.56) - scroll * 0.18;

      cameraTarget.x += (cameraTarget.desiredX - cameraTarget.x) * 0.04;
      cameraTarget.y += (cameraTarget.desiredY - cameraTarget.y) * 0.04;
      cameraTarget.z += (cameraTarget.desiredZ + scroll * 0.72 - cameraTarget.z) * 0.04;

      camera.position.x = cameraTarget.x;
      camera.position.y = cameraTarget.y + scroll * 0.08;
      camera.position.z = cameraTarget.z;
      camera.lookAt(0, -0.12 - scroll * 0.14, 0);
    }

    if (hub) {
      hub.userData.hubCore.rotation.x = t * 0.18;
      hub.userData.hubCore.rotation.y = t * 0.22;
      hub.userData.hubInner.rotation.x = -t * 0.3;
      hub.userData.hubInner.rotation.z = t * 0.24;
      hub.userData.hubHalo.scale.setScalar(1 + Math.sin(t * 1.2) * 0.05);
      hub.userData.ringA.rotation.z = t * 0.18;
      hub.userData.ringB.rotation.y = t * -0.06;
      hub.userData.centerScreen.material.opacity = 0.84 + Math.sin(t * 0.9) * 0.05;
      (hub.userData.stats || []).forEach((stat, index) => {
        stat.scale.y = 0.88 + Math.sin(t * 1.5 + index * 0.4) * 0.15;
      });
    }

    modules.forEach((module, key) => {
      const isActive = activeSet.has(key);
      const isHovered = hoverKey === key;
      const pulse = reduceMotion ? 0 : Math.sin(t * 1.25 + module.shell.position.x * 0.16) * 0.04;
      const targetScale = isActive ? 1.08 + pulse : isHovered ? 1.03 + pulse * 0.4 : 0.94 + pulse * 0.2;
      const emissiveTarget = isActive ? 0.22 : isHovered ? 0.14 : 0.05;
      const connectorOpacity = isActive ? 0.72 : isHovered ? 0.36 : 0.14;

      module.shell.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
      module.shell.position.y =
        module.config.position.y + (reduceMotion ? 0 : Math.sin(t * 0.9 + module.config.position.x) * (isActive ? 0.08 : 0.04));
      module.line.material.opacity += (connectorOpacity - module.line.material.opacity) * 0.08;

      if (module.glowTarget.material?.emissiveIntensity !== undefined) {
        module.glowTarget.material.emissiveIntensity += (emissiveTarget - module.glowTarget.material.emissiveIntensity) * 0.08;
      }

      module.pulse.visible = isActive;
      if (isActive) {
        const progress = (t * 0.16 + module.config.position.x * 0.03) % 1;
        module.pulse.position.copy(module.connector.getPoint(progress));
      }
    });

    connectionFlows.forEach((flow, index) => {
      const enabled = activeSet.has(flow.key);
      flow.packet.visible = enabled;
      if (!enabled) return;
      const progress = (t * 0.22 + flow.packet.userData.offset + index * 0.08) % 1;
      flow.packet.position.copy(flow.curve.getPoint(progress));
    });

    renderer.render(scene, camera);

    if (!isReady) {
      isReady = true;
      metrics.ready = true;
      root.dataset.ready = "true";
      document.body.classList.add("is-command-hero-ready");
      fields.fallback?.classList.add("is-hidden");
    }

    if (visible && !reduceMotion) {
      frameId = window.requestAnimationFrame(render);
    }
  }

  function start() {
    if (frameId || reduceMotion) return;
    frameId = window.requestAnimationFrame(render);
  }

  function stop() {
    if (!frameId) return;
    window.cancelAnimationFrame(frameId);
    frameId = null;
  }

  function dispose() {
    stop();
    resizeObserver?.disconnect();
    renderer?.dispose();
  }

  function boot() {
    try {
      createRenderer();
      createScene();
      setSize();
      setPanel(activeFocus);
      render(0);

      resizeObserver = new ResizeObserver(setSize);
      resizeObserver.observe(root);

      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start();
            else stop();
          },
          { threshold: 0.08 },
        );
        observer.observe(root);
      } else {
        start();
      }

      controls.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
        button.addEventListener("click", () => setPanel(button.dataset.commandFocus));
      });

      canvas.addEventListener("pointermove", moveDrag, { passive: true });
      canvas.addEventListener("pointerdown", beginDrag);
      canvas.addEventListener("pointerup", endDrag);
      canvas.addEventListener("pointercancel", endDrag);
      canvas.addEventListener("pointerleave", () => {
        if (drag.active) return;
        hoverKey = null;
        metrics.hover = null;
        canvas.classList.remove("is-hovering");
      });

      window.addEventListener("resize", setSize, { passive: true });
      window.addEventListener("scroll", getScrollProgress, { passive: true });
      window.addEventListener("beforeunload", dispose, { once: true });
    } catch (error) {
      console.error("Command center hero failed:", error);
      root.dataset.ready = "error";
      fields.fallback?.classList.remove("is-hidden");
      document.body.classList.remove("is-page-loading");
    }
  }

  boot();
}
