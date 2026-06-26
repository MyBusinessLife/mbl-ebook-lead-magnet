import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js";

const root = document.querySelector("[data-home-immersive]");
const canvas = document.querySelector("#homeImmersiveCanvas");

if (!root || !canvas) {
  document.body?.classList.remove("is-page-loading");
} else {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const verifyMode = new URLSearchParams(window.location.search).has("verify");

  const fields = {
    kicker: document.querySelector("[data-home-kicker]"),
    title: document.querySelector("[data-home-title]"),
    text: document.querySelector("[data-home-text]"),
    pointOne: document.querySelector("[data-home-point-one]"),
    pointTwo: document.querySelector("[data-home-point-two]"),
    pointThree: document.querySelector("[data-home-point-three]"),
    proofLabel: document.querySelector("[data-home-proof-label]"),
    proof: document.querySelector("[data-home-proof]"),
    link: document.querySelector("[data-home-link]"),
    fallback: root.querySelector(".immersive-home-fallback"),
  };

  const controls = Array.from(document.querySelectorAll("[data-home-scene]"));

  const scenarios = {
    visibility: {
      kicker: "Scenario actif",
      title: "Visibilite premium",
      text: "Une presence digitale moderne, lisible et mesuree pour attirer des visites utiles et transformer l'interet en prise de contact.",
      pointOne: "Site premium, parcours clair, SEO propre et contenu qui rassure.",
      pointTwo: "Analytics, dashboard de visites et lecture immediate de ce qui attire vraiment.",
      pointThree: "Votre image devient plus credible, plus nette et plus facile a choisir.",
      proofLabel: "Valeur ajoutee",
      proof: "La scene montre comment un site moderne devient le point d'entree d'un systeme plus large, pas juste une vitrine figée.",
      linkHref: "developpement-web.html",
      linkLabel: "Voir la partie web",
      focus: ["presence", "analytics", "software"],
      rotation: { x: -0.08, y: -0.58 },
      cameraZ: 11.4,
    },
    automation: {
      kicker: "Scenario actif",
      title: "Automatisation fiable",
      text: "Les taches repetitives sortent de vos equipes pour devenir des flux fluides, controles et documentes.",
      pointOne: "Relances, synchronisations, formulaires et actions conditionnelles traites automatiquement.",
      pointTwo: "Les agents IA peuvent assister les operations sans casser le cadre metier.",
      pointThree: "Moins de charge mentale, moins d'oublis, plus de vitesse utile.",
      proofLabel: "Valeur ajoutee",
      proof: "La scene met en avant les flux qui circulent entre les modules pour montrer qu'une automatisation serieuse relie les bons points au lieu d'ajouter une couche de complexite.",
      linkHref: "automatisation.html",
      linkLabel: "Voir les automatisations",
      focus: ["automation", "ai", "software"],
      rotation: { x: 0.06, y: 0.44 },
      cameraZ: 11.1,
    },
    pilotage: {
      kicker: "Scenario actif",
      title: "Pilotage et decisions",
      text: "Logiciel metier, dashboards et donnees utiles se regroupent pour vous aider a decider sans attendre la prochaine urgence.",
      pointOne: "Outil sur-mesure, indicateurs lisibles et vues adaptees a chaque role.",
      pointTwo: "La donnee remonte plus vite, les derivees se voient plus tot, les actions se cadrent mieux.",
      pointThree: "Vous pilotez l'activite avec un systeme qui suit votre facon de travailler.",
      proofLabel: "Valeur ajoutee",
      proof: "Le noyau central illustre la centralisation. Les noeuds actifs montrent qu'un bon pilotage depend autant des donnees que des bons processus en amont.",
      linkHref: "logiciel-sur-mesure.html",
      linkLabel: "Voir le pilotage logiciel",
      focus: ["software", "pilotage", "automation"],
      rotation: { x: -0.02, y: 0.06 },
      cameraZ: 10.8,
    },
    support: {
      kicker: "Scenario actif",
      title: "Assistance et equipement",
      text: "Reparer, remettre en etat, conseiller et equiper proprement pour que l'informatique redevienne un support fiable au quotidien.",
      pointOne: "Diagnostic clair, intervention ciblee, accompagnement a domicile ou a distance.",
      pointTwo: "Choix de materiel adapte a l'usage, a la mobilite et a la duree dans le temps.",
      pointThree: "Un besoin concret trouve une reponse simple, lisible et rassurante.",
      proofLabel: "Valeur ajoutee",
      proof: "La scene montre que l'assistance n'est pas isolee : elle reconnecte le materiel, les usages et la continuite de service.",
      linkHref: "assistance-informatique-domicile.html",
      linkLabel: "Voir l'assistance informatique",
      focus: ["support", "hardware", "presence"],
      rotation: { x: 0.12, y: 0.86 },
      cameraZ: 11.6,
    },
  };

  const moduleConfig = {
    presence: {
      label: "WEB",
      title: "Presence",
      subtitle: "Site premium",
      scene: "visibility",
      color: 0xff6a2e,
      position: new THREE.Vector3(-4.6, 1.45, 1.05),
      href: "developpement-web.html",
    },
    analytics: {
      label: "DATA",
      title: "Mesure",
      subtitle: "Visites et conversions",
      scene: "visibility",
      color: 0x2ecce3,
      position: new THREE.Vector3(-1.9, 2.2, -1.2),
      href: "developpement-web.html",
    },
    automation: {
      label: "AUTO",
      title: "Flux",
      subtitle: "Operations automatisees",
      scene: "automation",
      color: 0xff6a2e,
      position: new THREE.Vector3(2.85, 2.05, 0.85),
      href: "automatisation.html",
    },
    ai: {
      label: "IA",
      title: "Agents",
      subtitle: "Assistants cadres",
      scene: "automation",
      color: 0xf7f9fc,
      position: new THREE.Vector3(5.1, 0.9, -1.15),
      href: "agents-ia.html",
    },
    software: {
      label: "APP",
      title: "Logiciel",
      subtitle: "Outil metier",
      scene: "pilotage",
      color: 0x1c8fa3,
      position: new THREE.Vector3(2.55, -2.15, 1.2),
      href: "logiciel-sur-mesure.html",
    },
    pilotage: {
      label: "DASH",
      title: "Pilotage",
      subtitle: "Indicateurs utiles",
      scene: "pilotage",
      color: 0x65d2df,
      position: new THREE.Vector3(-0.55, -2.65, -1.15),
      href: "logiciel-sur-mesure.html",
    },
    hardware: {
      label: "MAT",
      title: "Materiel",
      subtitle: "Config adaptee",
      scene: "support",
      color: 0xffa97d,
      position: new THREE.Vector3(-4.2, -1.7, -1.2),
      href: "achat-materiel-informatique.html",
    },
    support: {
      label: "PC",
      title: "Assistance",
      subtitle: "Reparation et aide",
      scene: "support",
      color: 0x8be8f2,
      position: new THREE.Vector3(5.0, -0.95, 1.2),
      href: "assistance-informatique-domicile.html",
    },
  };

  const moduleKeys = Object.keys(moduleConfig);
  const metrics = {
    frames: 0,
    selected: "visibility",
    hover: null,
    drag: { x: 0, y: 0 },
    pointer: { x: 0, y: 0 },
    ready: false,
  };

  window.MBL_HOME_IMMERSIVE_METRICS = metrics;

  let renderer;
  let scene;
  let camera;
  let world;
  let moduleGroup;
  let particleField;
  let resizeObserver;
  let frameId = null;
  let sceneVisible = true;
  let rendererReady = false;

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const modules = new Map();
  const interactives = [];
  const flowItems = [];
  const labelMeshes = [];
  const cardColumns = [];
  const dashboardBars = [];

  const dragState = {
    active: false,
    moved: false,
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
    rotationX: 0,
    rotationY: 0,
    targetX: -0.04,
    targetY: 0,
    pointerId: null,
  };

  const cameraTarget = {
    x: 0,
    y: 0.68,
    z: scenarios.visibility.cameraZ,
    desiredX: 0,
    desiredY: 0.68,
    desiredZ: scenarios.visibility.cameraZ,
  };

  let activeScenario = "visibility";
  let hoverKey = null;

  function makeCanvasTexture(label, title, subtitle, color) {
    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 768;
    textureCanvas.height = 320;
    const ctx = textureCanvas.getContext("2d");
    const rgb = new THREE.Color(color);
    const accent = `rgba(${Math.round(rgb.r * 255)}, ${Math.round(rgb.g * 255)}, ${Math.round(rgb.b * 255)}, 0.95)`;

    ctx.clearRect(0, 0, textureCanvas.width, textureCanvas.height);
    ctx.fillStyle = "rgba(6, 19, 28, 0.76)";
    roundRect(ctx, 18, 18, 732, 284, 26);
    ctx.fill();

    const border = ctx.createLinearGradient(24, 24, 740, 296);
    border.addColorStop(0, "rgba(28, 143, 163, 0.72)");
    border.addColorStop(0.58, accent);
    border.addColorStop(1, "rgba(247, 249, 252, 0.58)");
    ctx.strokeStyle = border;
    ctx.lineWidth = 4;
    roundRect(ctx, 18, 18, 732, 284, 26);
    ctx.stroke();

    ctx.fillStyle = accent;
    ctx.font = "900 38px Inter, Arial, sans-serif";
    ctx.fillText(label, 48, 82);

    ctx.fillStyle = "#f7f9fc";
    ctx.font = "900 58px Inter, Arial, sans-serif";
    wrapText(ctx, title, 48, 150, 540, 64);

    ctx.fillStyle = "rgba(247, 249, 252, 0.66)";
    ctx.font = "700 26px Inter, Arial, sans-serif";
    wrapText(ctx, subtitle, 48, 238, 560, 34);

    ctx.fillStyle = "rgba(247, 249, 252, 0.62)";
    ctx.font = "800 22px Inter, Arial, sans-serif";
    ctx.fillText("MY BUSINESS LIFE", 48, 284);

    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }

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

  function setPanel(sceneKey) {
    const content = scenarios[sceneKey];
    if (!content) return;

    activeScenario = sceneKey;
    metrics.selected = sceneKey;
    root.dataset.scene = sceneKey;

    if (fields.kicker) fields.kicker.textContent = content.kicker;
    if (fields.title) fields.title.textContent = content.title;
    if (fields.text) fields.textContent = content.text;
    if (fields.pointOne) fields.pointOne.textContent = content.pointOne;
    if (fields.pointTwo) fields.pointTwo.textContent = content.pointTwo;
    if (fields.pointThree) fields.pointThree.textContent = content.pointThree;
    if (fields.proofLabel) fields.proofLabel.textContent = content.proofLabel;
    if (fields.proof) fields.proof.textContent = content.proof;
    if (fields.link) {
      fields.link.href = content.linkHref;
      fields.link.textContent = content.linkLabel;
    }

    dragState.targetX = content.rotation.x;
    dragState.targetY = content.rotation.y;
    cameraTarget.desiredZ = content.cameraZ;

    controls.forEach((button) => {
      const selected = button.dataset.homeScene === sceneKey;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
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
    renderer.toneMappingExposure = 1.08;
    renderer.setClearColor(0x000000, 0);
  }

  function createScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, cameraTarget.y, cameraTarget.z);

    world = new THREE.Group();
    world.position.y = -0.08;
    scene.add(world);

    moduleGroup = new THREE.Group();
    world.add(moduleGroup);

    const ambient = new THREE.AmbientLight(0xd8f6ff, 1.28);
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.3);
    const fillLight = new THREE.PointLight(0x1c8fa3, 4.6, 28);
    const rimLight = new THREE.PointLight(0xff6a2e, 4.2, 26);
    const softLight = new THREE.PointLight(0x8feaf4, 2.2, 18);

    keyLight.position.set(5, 9, 7);
    fillLight.position.set(-6, 4, 6);
    rimLight.position.set(7, -2, 6);
    softLight.position.set(0, 4, -8);
    scene.add(ambient, keyLight, fillLight, rimLight, softLight);

    const floor = new THREE.Mesh(
      new THREE.CylinderGeometry(5.3, 6.2, 0.44, 72),
      new THREE.MeshStandardMaterial({
        color: 0x0b1d29,
        roughness: 0.34,
        metalness: 0.62,
        emissive: 0x0a5160,
        emissiveIntensity: 0.1,
      }),
    );
    floor.position.set(0, -3.14, 0);
    floor.rotation.x = Math.PI * 0.02;
    world.add(floor);

    const floorInner = new THREE.Mesh(
      new THREE.CylinderGeometry(3.7, 4.1, 0.22, 72),
      new THREE.MeshStandardMaterial({
        color: 0x102637,
        roughness: 0.2,
        metalness: 0.48,
        emissive: 0x143447,
        emissiveIntensity: 0.12,
      }),
    );
    floorInner.position.set(0, -2.92, 0);
    world.add(floorInner);

    const ringMaterials = [
      new THREE.MeshBasicMaterial({ color: 0x1c8fa3, transparent: true, opacity: 0.6 }),
      new THREE.MeshBasicMaterial({ color: 0xff6a2e, transparent: true, opacity: 0.42 }),
      new THREE.MeshBasicMaterial({ color: 0xf7f9fc, transparent: true, opacity: 0.22 }),
    ];

    const orbitA = new THREE.Mesh(new THREE.TorusGeometry(3.45, 0.012, 10, 190), ringMaterials[0]);
    const orbitB = new THREE.Mesh(new THREE.TorusGeometry(4.65, 0.01, 10, 200), ringMaterials[1]);
    const orbitC = new THREE.Mesh(new THREE.TorusGeometry(5.55, 0.008, 10, 220), ringMaterials[2]);
    orbitA.rotation.x = Math.PI * 0.48;
    orbitB.rotation.y = Math.PI * 0.55;
    orbitC.rotation.x = Math.PI * 0.66;
    orbitC.rotation.z = Math.PI * 0.22;
    world.add(orbitA, orbitB, orbitC);

    const hub = new THREE.Group();
    hub.position.set(0, -0.45, 0);
    world.add(hub);

    const hubCore = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.98, 4),
      new THREE.MeshStandardMaterial({
        color: 0x112838,
        roughness: 0.28,
        metalness: 0.66,
        emissive: 0x0a5160,
        emissiveIntensity: 0.24,
      }),
    );
    hub.add(hubCore);

    const hubInner = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.48, 3),
      new THREE.MeshStandardMaterial({
        color: 0xff6a2e,
        roughness: 0.18,
        metalness: 0.48,
        emissive: 0xff6a2e,
        emissiveIntensity: 0.42,
      }),
    );
    hub.add(hubInner);

    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(1.42, 42, 42),
      new THREE.MeshBasicMaterial({
        color: 0x1c8fa3,
        transparent: true,
        opacity: 0.06,
        depthWrite: false,
      }),
    );
    hub.add(halo);

    const centralRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.52, 0.028, 18, 180),
      new THREE.MeshStandardMaterial({
        color: 0x65d2df,
        roughness: 0.14,
        metalness: 0.72,
        emissive: 0x1c8fa3,
        emissiveIntensity: 0.36,
      }),
    );
    centralRing.rotation.x = Math.PI * 0.5;
    hub.add(centralRing);

    const dashboard = new THREE.Group();
    dashboard.position.set(0, -1.02, -1.55);
    world.add(dashboard);

    const boardFrame = new THREE.Mesh(
      new THREE.BoxGeometry(4.6, 2.24, 0.2),
      new THREE.MeshStandardMaterial({
        color: 0x102637,
        roughness: 0.28,
        metalness: 0.6,
        emissive: 0x0a4050,
        emissiveIntensity: 0.16,
      }),
    );
    dashboard.add(boardFrame);

    const boardScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(4.16, 1.86),
      new THREE.MeshBasicMaterial({
        color: 0x07131c,
        transparent: true,
        opacity: 0.94,
      }),
    );
    boardScreen.position.z = 0.112;
    dashboard.add(boardScreen);

    for (let index = 0; index < 3; index += 1) {
      const card = new THREE.Mesh(
        new THREE.BoxGeometry(0.82, 0.5, 0.12),
        new THREE.MeshStandardMaterial({
          color: 0x143447,
          roughness: 0.24,
          metalness: 0.44,
          emissive: 0x1c8fa3,
          emissiveIntensity: 0.12,
        }),
      );
      card.position.set(-1.3 + index * 1.3, 0.46, 0.16);
      dashboard.add(card);
      cardColumns.push(card);
    }

    for (let index = 0; index < 6; index += 1) {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.2 + index * 0.1, 0.1),
        new THREE.MeshStandardMaterial({
          color: index % 2 === 0 ? 0xff6a2e : 0x2ecce3,
          roughness: 0.18,
          metalness: 0.36,
          emissive: index % 2 === 0 ? 0xff6a2e : 0x2ecce3,
          emissiveIntensity: 0.28,
        }),
      );
      bar.position.set(-1.36 + index * 0.54, -0.48 + bar.geometry.parameters.height * 0.5, 0.15);
      dashboard.add(bar);
      dashboardBars.push(bar);
    }

    const columnTop = new THREE.Mesh(
      new THREE.BoxGeometry(2.9, 0.1, 0.1),
      new THREE.MeshStandardMaterial({
        color: 0x65d2df,
        roughness: 0.18,
        metalness: 0.3,
        emissive: 0x65d2df,
        emissiveIntensity: 0.18,
      }),
    );
    columnTop.position.set(0.26, 0.86, 0.15);
    dashboard.add(columnTop);

    createModules();
    createParticleField();

    world.userData = {
      hubCore,
      hubInner,
      halo,
      centralRing,
      orbitA,
      orbitB,
      orbitC,
      dashboard,
      boardScreen,
      boardFrame,
      columnTop,
    };
  }

  function createModules() {
    Object.entries(moduleConfig).forEach(([key, config]) => {
      const group = new THREE.Group();
      group.position.copy(config.position);
      group.userData.key = key;

      const accent = new THREE.Color(config.color);

      const anchor = new THREE.Mesh(
        new THREE.CylinderGeometry(0.34, 0.52, 0.18, 36),
        new THREE.MeshStandardMaterial({
          color: 0x112637,
          roughness: 0.28,
          metalness: 0.52,
          emissive: 0x143447,
          emissiveIntensity: 0.1,
        }),
      );
      anchor.position.set(0, -0.72, 0);
      group.add(anchor);

      const pulse = new THREE.Mesh(
        new THREE.CylinderGeometry(0.84, 0.84, 0.02, 36),
        new THREE.MeshBasicMaterial({
          color: config.color,
          transparent: true,
          opacity: 0.12,
          depthWrite: false,
        }),
      );
      pulse.position.set(0, -0.8, 0);
      group.add(pulse);

      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.98, 20),
        new THREE.MeshStandardMaterial({
          color: 0x21485e,
          roughness: 0.24,
          metalness: 0.4,
          emissive: config.color,
          emissiveIntensity: 0.1,
        }),
      );
      stem.position.set(0, -0.28, 0);
      group.add(stem);

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 36, 36),
        new THREE.MeshStandardMaterial({
          color: config.color,
          roughness: 0.18,
          metalness: 0.38,
          emissive: config.color,
          emissiveIntensity: 0.2,
        }),
      );
      sphere.position.y = 0.34;
      sphere.userData.key = key;
      group.add(sphere);

      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.72, 28, 28),
        new THREE.MeshBasicMaterial({
          color: config.color,
          transparent: true,
          opacity: 0.09,
          depthWrite: false,
        }),
      );
      halo.position.y = 0.34;
      group.add(halo);

      const label = new THREE.Mesh(
        new THREE.PlaneGeometry(1.78, 0.74),
        new THREE.MeshBasicMaterial({
          map: makeCanvasTexture(config.label, config.title, config.subtitle, config.color),
          transparent: true,
          depthWrite: false,
        }),
      );
      label.position.set(config.position.x > 0 ? -1.38 : 1.38, -0.62, 0.16);
      label.userData.key = key;
      group.add(label);

      const lineCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, -0.2, 0),
        new THREE.Vector3(config.position.x * 0.46, config.position.y * 0.28, config.position.z * 0.34),
        config.position.clone(),
      );

      const lineGeometry = new THREE.BufferGeometry().setFromPoints(lineCurve.getPoints(68));
      const line = new THREE.Line(
        lineGeometry,
        new THREE.LineBasicMaterial({
          color: config.color,
          transparent: true,
          opacity: 0.22,
        }),
      );
      line.userData.key = key;
      world.add(line);

      const packets = [];
      for (let index = 0; index < 3; index += 1) {
        const packet = new THREE.Mesh(
          new THREE.SphereGeometry(0.065, 14, 14),
          new THREE.MeshBasicMaterial({
            color: config.color,
            transparent: true,
            opacity: 0.84,
            depthWrite: false,
          }),
        );
        packet.userData.offset = index / 3;
        packet.visible = false;
        world.add(packet);
        packets.push(packet);
        flowItems.push({ packet, curve: lineCurve, key });
      }

      moduleGroup.add(group);
      modules.set(key, { group, anchor, pulse, stem, sphere, halo, label, line, packets, config, curve: lineCurve });
      labelMeshes.push(label);
      interactives.push(sphere, label);
    });
  }

  function createParticleField() {
    const particleCount = 320;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let index = 0; index < particleCount; index += 1) {
      const radius = 4.6 + Math.random() * 3.8;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 6.2;
      particlePositions[index * 3] = Math.cos(angle) * radius;
      particlePositions[index * 3 + 1] = y;
      particlePositions[index * 3 + 2] = Math.sin(angle) * radius * 0.54;

      const color = new THREE.Color(Math.random() > 0.5 ? 0x1c8fa3 : 0xff6a2e);
      particleColors[index * 3] = color.r;
      particleColors[index * 3 + 1] = color.g;
      particleColors[index * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    particleField = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        size: 0.04,
        vertexColors: true,
        transparent: true,
        opacity: 0.66,
        depthWrite: false,
      }),
    );

    world.add(particleField);
  }

  function setSize() {
    const rect = root.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(420, Math.floor(rect.height));
    const isMobile = width < 780;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.3 : 1.7);

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = isMobile ? 46 : width > 1360 ? 36 : 40;
    camera.position.y = isMobile ? 1.0 : 0.68;
    cameraTarget.y = camera.position.y;
    world.position.y = isMobile ? -0.26 : -0.08;
    world.scale.setScalar(isMobile ? 0.84 : width > 1360 ? 1.12 : 1);
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

    cameraTarget.desiredX = pointer.x * 0.5;
    cameraTarget.desiredY = camera.position.y + pointer.y * 0.16;
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

  function setScenario(sceneKey) {
    if (!scenarios[sceneKey]) return;
    setPanel(sceneKey);
  }

  function pickModule(event) {
    updatePointer(event);
    const hitKey = getHitKey();
    if (!hitKey) return;
    const config = moduleConfig[hitKey];
    if (!config) return;
    setScenario(config.scene);
  }

  function beginDrag(event) {
    dragState.active = true;
    dragState.moved = false;
    dragState.startX = event.clientX;
    dragState.startY = event.clientY;
    dragState.x = event.clientX;
    dragState.y = event.clientY;
    dragState.pointerId = event.pointerId;
    canvas.classList.add("is-dragging");
    canvas.setPointerCapture?.(event.pointerId);
    updatePointer(event);
  }

  function moveDrag(event) {
    updatePointer(event);

    if (!dragState.active) {
      updateHover(event);
      return;
    }

    const dx = event.clientX - dragState.x;
    const dy = event.clientY - dragState.y;
    const total = Math.abs(event.clientX - dragState.startX) + Math.abs(event.clientY - dragState.startY);

    if (total > 8) dragState.moved = true;

    dragState.targetY += dx * 0.0037;
    dragState.targetX += dy * 0.0034;
    dragState.targetY = THREE.MathUtils.clamp(dragState.targetY, -1.16, 1.16);
    dragState.targetX = THREE.MathUtils.clamp(dragState.targetX, -0.48, 0.42);
    dragState.x = event.clientX;
    dragState.y = event.clientY;
    metrics.drag = {
      x: Number(dragState.targetX.toFixed(3)),
      y: Number(dragState.targetY.toFixed(3)),
    };
  }

  function endDrag(event) {
    if (!dragState.active) return;
    canvas.classList.remove("is-dragging");
    canvas.releasePointerCapture?.(dragState.pointerId ?? event.pointerId);

    if (!dragState.moved) {
      pickModule(event);
    }

    dragState.active = false;
    dragState.pointerId = null;
    updateHover(event);
  }

  function updateModuleState(time) {
    const t = time * 0.001;
    const activeNodes = new Set(scenarios[activeScenario].focus);

    modules.forEach((item, key) => {
      const isFocused = activeNodes.has(key);
      const isHovered = hoverKey === key;
      const pulse = reduceMotion ? 0 : Math.sin(t * 1.45 + item.group.position.x) * 0.04;
      const targetScale = isFocused ? 1.14 + pulse : isHovered ? 1.06 + pulse * 0.6 : 0.92 + pulse * 0.35;
      const highlight = isFocused ? 1 : isHovered ? 0.72 : 0.26;
      const baseY = item.config.position.y;

      item.group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
      item.group.position.y = baseY + (reduceMotion ? 0 : Math.sin(t * 1.1 + baseY) * (isFocused ? 0.08 : 0.04));
      item.halo.material.opacity += (((isFocused ? 0.22 : isHovered ? 0.16 : 0.08) - item.halo.material.opacity) * 0.08);
      item.pulse.material.opacity += (((isFocused ? 0.22 : isHovered ? 0.14 : 0.08) - item.pulse.material.opacity) * 0.08);
      item.line.material.opacity += (((isFocused ? 0.76 : isHovered ? 0.42 : 0.18) - item.line.material.opacity) * 0.08);
      item.sphere.material.emissiveIntensity += (((isFocused ? 0.48 : isHovered ? 0.28 : 0.18) - item.sphere.material.emissiveIntensity) * 0.08);
      item.label.material.opacity += (((isFocused ? 0.98 : isHovered ? 0.72 : 0.08) - item.label.material.opacity) * 0.08);
      item.anchor.material.emissiveIntensity += (((isFocused ? 0.22 : 0.08) - item.anchor.material.emissiveIntensity) * 0.08);

      if (!reduceMotion) {
        item.label.lookAt(camera.position);
      }

      item.packets.forEach((packet, packetIndex) => {
        if (!isFocused) {
          packet.visible = false;
          return;
        }

        packet.visible = true;
        const progress = (t * 0.18 + packetIndex * 0.23 + item.group.position.x * 0.03) % 1;
        const point = item.curve.getPoint(progress);
        packet.position.copy(point);
      });

      item.group.children.forEach((child) => {
        if (child.material && "opacity" in child.material) {
          child.material.needsUpdate = false;
        }
      });

      item.group.userData.highlight = highlight;
    });
  }

  function updateSceneMotion(time) {
    const t = time * 0.001;
    const {
      hubCore,
      hubInner,
      halo,
      centralRing,
      orbitA,
      orbitB,
      orbitC,
      dashboard,
      boardScreen,
      columnTop,
    } = world.userData;

    if (!reduceMotion) {
      dragState.rotationY += (dragState.targetY - dragState.rotationY) * 0.07;
      dragState.rotationX += (dragState.targetX - dragState.rotationX) * 0.07;
      world.rotation.y = dragState.rotationY + Math.sin(t * 0.24) * 0.03;
      world.rotation.x = dragState.rotationX;

      hubCore.rotation.x = t * 0.16;
      hubCore.rotation.y = t * 0.22;
      hubInner.rotation.x = -t * 0.28;
      hubInner.rotation.z = t * 0.26;
      halo.scale.setScalar(1 + Math.sin(t * 1.12) * 0.04);
      centralRing.rotation.z = t * 0.22;

      orbitA.rotation.z = t * 0.12;
      orbitB.rotation.x = Math.PI * 0.1 + t * 0.09;
      orbitC.rotation.y = t * -0.08;

      dashboard.rotation.y = Math.sin(t * 0.34) * 0.04;
      boardScreen.material.opacity = 0.9 + Math.sin(t * 0.9) * 0.04;
      columnTop.scale.x = 1 + Math.sin(t * 0.8) * 0.06;

      cardColumns.forEach((column, index) => {
        column.position.z = 0.1 + Math.sin(t * 1.3 + index * 0.9) * 0.04;
      });

      dashboardBars.forEach((bar, index) => {
        bar.scale.y = 0.86 + Math.sin(t * 1.55 + index * 0.42) * 0.14;
      });

      if (particleField) {
        particleField.rotation.y = t * 0.018;
      }

      cameraTarget.x += (cameraTarget.desiredX - cameraTarget.x) * 0.035;
      cameraTarget.y += (cameraTarget.desiredY - cameraTarget.y) * 0.035;
      cameraTarget.z += (cameraTarget.desiredZ - cameraTarget.z) * 0.045;

      camera.position.x = cameraTarget.x;
      camera.position.y = cameraTarget.y;
      camera.position.z = cameraTarget.z;
      camera.lookAt(0, -0.36, 0);
    } else {
      world.rotation.y = dragState.targetY;
      world.rotation.x = dragState.targetX;
      camera.position.set(0, camera.position.y, cameraTarget.desiredZ);
      camera.lookAt(0, -0.36, 0);
    }
  }

  function render(time = 0) {
    frameId = null;
    metrics.frames += 1;

    updateSceneMotion(time);
    updateModuleState(time);
    renderer.render(scene, camera);

    if (!rendererReady) {
      rendererReady = true;
      metrics.ready = true;
      window.MBL_HOME_IMMERSIVE_READY = true;
      root.dataset.ready = "true";
      document.body.classList.add("is-home-immersive-ready");
      fields.fallback?.classList.add("is-hidden");
    }

    if (sceneVisible && !reduceMotion) {
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
      setPanel(activeScenario);
      render(0);

      resizeObserver = new ResizeObserver(setSize);
      resizeObserver.observe(root);

      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            sceneVisible = entry.isIntersecting;
            if (sceneVisible) {
              start();
            } else {
              stop();
            }
          },
          { threshold: 0.12 },
        );
        observer.observe(root);
      } else {
        start();
      }

      canvas.addEventListener("pointermove", moveDrag, { passive: true });
      canvas.addEventListener("pointerdown", beginDrag);
      canvas.addEventListener("pointerup", endDrag);
      canvas.addEventListener("pointercancel", endDrag);
      canvas.addEventListener("pointerleave", () => {
        if (dragState.active) return;
        hoverKey = null;
        metrics.hover = null;
        canvas.classList.remove("is-hovering");
      });

      controls.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
        button.addEventListener("click", () => setScenario(button.dataset.homeScene));
      });

      window.addEventListener("resize", setSize, { passive: true });
      window.addEventListener("beforeunload", dispose, { once: true });
    } catch (error) {
      console.error("Immersive home scene failed:", error);
      root.dataset.ready = "error";
      fields.fallback?.classList.remove("is-hidden");
    }
  }

  boot();
}
