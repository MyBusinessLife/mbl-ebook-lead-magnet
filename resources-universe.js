import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const root = document.querySelector("[data-resources-universe]");
const canvas = document.querySelector("#resourcesUniverseCanvas");
const BACKGROUND_AUDIO_VOLUME = 0.82;

if (!root || !canvas) {
  document.body?.classList.remove("is-page-loading");
} else {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const verifyMode = new URLSearchParams(window.location.search).has("verify");

  const fields = {
    title: document.querySelector("[data-universe-title]"),
    type: document.querySelector("[data-universe-type]"),
    text: document.querySelector("[data-universe-text]"),
    chips: document.querySelector("[data-universe-chips]"),
    format: document.querySelector("[data-universe-format]"),
    goal: document.querySelector("[data-universe-goal]"),
    link: document.querySelector("[data-universe-link]"),
    panel: document.querySelector("[data-universe-panel]"),
    backdrop: document.querySelector("[data-universe-backdrop]"),
    close: document.querySelector("[data-universe-close]"),
    open: document.querySelector("[data-universe-open]"),
    audio: document.querySelector("[data-universe-audio]"),
    fallback: root.querySelector(".resources-universe-fallback"),
  };

  const resourceData = [
    {
      key: "software",
      title: "Logiciel sur-mesure",
      type: "Ebook premium",
      description:
        "Un ebook premium pour comprendre comment centraliser vos donnees, automatiser vos taches et construire un outil metier reellement adapte.",
      format: "Lecture + PDF",
      goal: "Comprendre avant d'investir",
      cta: "Ouvrir l'ebook",
      href: "ebook.html",
      chips: ["Ebook", "Logiciel", "Automatisation"],
      color: 0xff8b5d,
      accent: 0xff6a2e,
      radius: 5.2,
      size: 1.06,
      speed: 0.16,
      angle: 0.2,
      tiltX: 0.24,
      tiltZ: 0.1,
      ring: true,
      ringColor: 0xffb08a,
      detailSatellites: [
        { radius: 1.9, size: 0.16, speed: 0.95, color: 0xffc79f, tiltX: 0.38, tiltZ: 0.12 },
        { radius: 2.7, size: 0.2, speed: -0.72, color: 0x7ce8f4, tiltX: -0.42, tiltZ: 0.24 },
        { radius: 3.5, size: 0.12, speed: 1.18, color: 0xff8b5d, tiltX: 0.2, tiltZ: -0.18 },
      ],
    },
    {
      key: "website",
      title: "Site internet moderne",
      type: "Ebook premium",
      description:
        "Une ressource pour voir comment un site moderne devient un vrai outil de croissance avec suivi des visites, dashboard et meilleure conversion.",
      format: "Lecture + PDF",
      goal: "Moderniser et mesurer",
      cta: "Ouvrir l'ebook",
      href: "ebook-site-internet.html",
      chips: ["Ebook", "Web", "Tracking"],
      color: 0x7ce8f4,
      accent: 0x2ecce3,
      radius: 7.3,
      size: 0.86,
      speed: 0.11,
      angle: 1.7,
      tiltX: -0.18,
      tiltZ: 0.26,
      ring: false,
      detailSatellites: [
        { radius: 1.6, size: 0.13, speed: 1.02, color: 0xe7fcff, tiltX: 0.28, tiltZ: 0.18 },
        { radius: 2.35, size: 0.18, speed: -0.88, color: 0x2ecce3, tiltX: -0.36, tiltZ: 0.22 },
        { radius: 3.15, size: 0.11, speed: 1.26, color: 0xffe2c5, tiltX: 0.14, tiltZ: -0.24 },
      ],
    },
    {
      key: "ai",
      title: "Agents IA",
      type: "Ebook premium",
      description:
        "Comprenez comment integrer des agents IA utiles, cadres et connectes a vos outils sans perdre le controle operationnel.",
      format: "Lecture + PDF",
      goal: "Automatiser avec controle",
      cta: "Ouvrir l'ebook",
      href: "ebook-agents-ia.html",
      chips: ["Ebook", "IA", "Workflows"],
      color: 0xe9f4ff,
      accent: 0x8de6f0,
      radius: 9.1,
      size: 0.78,
      speed: 0.09,
      angle: 3.05,
      tiltX: 0.3,
      tiltZ: -0.15,
      ring: false,
      detailSatellites: [
        { radius: 1.85, size: 0.14, speed: 0.92, color: 0xffffff, tiltX: 0.44, tiltZ: 0.28 },
        { radius: 2.6, size: 0.17, speed: -0.76, color: 0x8de6f0, tiltX: -0.48, tiltZ: 0.16 },
        { radius: 3.25, size: 0.12, speed: 1.08, color: 0x7ce8f4, tiltX: 0.18, tiltZ: -0.22 },
      ],
    },
    {
      key: "repair",
      title: "Reparation informatique",
      type: "Ebook premium",
      description:
        "Diagnostiquez un probleme PC, comprenez les priorites et decidez plus sereinement avant une intervention ou un remplacement.",
      format: "Lecture + PDF",
      goal: "Diagnostiquer avant d'agir",
      cta: "Ouvrir l'ebook",
      href: "ebook-reparation-informatique.html",
      chips: ["Ebook", "PC", "Diagnostic"],
      color: 0x69cfe3,
      accent: 0x1c8fa3,
      radius: 11.4,
      size: 0.72,
      speed: 0.075,
      angle: 4.4,
      tiltX: -0.32,
      tiltZ: 0.18,
      ring: true,
      ringColor: 0x65d2df,
      detailSatellites: [
        { radius: 1.5, size: 0.12, speed: 1.18, color: 0xffffff, tiltX: 0.3, tiltZ: 0.1 },
        { radius: 2.1, size: 0.16, speed: -0.86, color: 0x69cfe3, tiltX: -0.32, tiltZ: 0.28 },
        { radius: 2.85, size: 0.1, speed: 1.28, color: 0x9ce8f1, tiltX: 0.22, tiltZ: -0.18 },
      ],
    },
    {
      key: "cases",
      title: "Cas clients",
      type: "References",
      description:
        "Explorez des transformations concretes, des gains mesurables et la maniere dont MY BUSINESS LIFE structure des projets reels.",
      format: "Page de preuves",
      goal: "Voir des cas reels",
      cta: "Voir les cas clients",
      href: "cas-clients.html",
      chips: ["References", "Business", "Proof"],
      color: 0xffa778,
      accent: 0xff8b5d,
      radius: 13.1,
      size: 0.68,
      speed: 0.06,
      angle: 5.45,
      tiltX: 0.18,
      tiltZ: -0.22,
      ring: false,
      detailSatellites: [
        { radius: 1.45, size: 0.1, speed: 0.9, color: 0xffe0c4, tiltX: 0.22, tiltZ: 0.18 },
        { radius: 2.2, size: 0.14, speed: -0.64, color: 0xff8b5d, tiltX: -0.28, tiltZ: 0.12 },
      ],
    },
    {
      key: "blog",
      title: "Blog MY BUSINESS LIFE",
      type: "Guides",
      description:
        "Un hub de contenus SEO et experts pour clarifier le web, le logiciel, l'automatisation, la securite et l'informatique du quotidien.",
      format: "Articles",
      goal: "Apprendre avant de choisir",
      cta: "Lire le blog",
      href: "blog.html",
      chips: ["Blog", "SEO", "Conseils"],
      color: 0xf7f9fc,
      accent: 0xffffff,
      radius: 14.9,
      size: 0.64,
      speed: 0.05,
      angle: 2.15,
      tiltX: 0.12,
      tiltZ: 0.34,
      ring: false,
      detailSatellites: [
        { radius: 1.5, size: 0.11, speed: 1.04, color: 0xffffff, tiltX: 0.34, tiltZ: 0.2 },
        { radius: 2.3, size: 0.14, speed: -0.72, color: 0x8de6f0, tiltX: -0.3, tiltZ: 0.26 },
      ],
    },
    {
      key: "credit",
      title: "Credit d'impot",
      type: "Guide pratique",
      description:
        "Une page claire pour comprendre le credit d'impot de 50 pour cent sur l'assistance informatique a domicile et ce que cela change vraiment.",
      format: "Guide simple",
      goal: "Comprendre le reste a charge",
      cta: "Ouvrir le guide",
      href: "credit-impot-assistance-informatique.html",
      chips: ["Guide", "Domicile", "Credit d'impot"],
      color: 0x9ce8f1,
      accent: 0x7ce8f4,
      radius: 17.0,
      size: 0.58,
      speed: 0.04,
      angle: 0.9,
      tiltX: -0.1,
      tiltZ: -0.34,
      ring: false,
      detailSatellites: [
        { radius: 1.4, size: 0.1, speed: 1.12, color: 0xffffff, tiltX: 0.28, tiltZ: 0.12 },
        { radius: 2.05, size: 0.12, speed: -0.78, color: 0x7ce8f4, tiltX: -0.34, tiltZ: 0.2 },
      ],
    },
  ];
  const resourceByKey = new Map(resourceData.map((item) => [item.key, item]));

  const metrics = {
    frames: 0,
    selected: null,
    hover: null,
    ready: false,
    cameraDistance: 0,
    pointer: { x: 0, y: 0 },
    audioOn: false,
    shipProgress: 1,
  };

  window.MBL_RESOURCES_UNIVERSE_METRICS = metrics;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07131c, 0.014);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
  camera.position.set(0, 6.5, 21);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: verifyMode,
  });

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = false;
  controls.minDistance = 8;
  controls.maxDistance = 28;
  controls.minPolarAngle = Math.PI * 0.18;
  controls.maxPolarAngle = Math.PI * 0.82;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0;
  controls.target.set(0, 0.2, 0);

  const universe = new THREE.Group();
  scene.add(universe);

  const parallax = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  };

  const ambient = new THREE.AmbientLight(0xbfeeff, 1.18);
  const fill = new THREE.DirectionalLight(0xdff8ff, 1.25);
  fill.position.set(5, 8, 6);
  const coreLight = new THREE.PointLight(0x7ce8f4, 2.8, 42, 1.6);
  coreLight.position.set(0, 0, 0);
  scene.add(ambient, fill, coreLight);

  const core = new THREE.Group();
  universe.add(core);

  const backgroundSun = new THREE.Group();
  backgroundSun.position.set(-23, 13, -52);
  scene.add(backgroundSun);

  const backgroundSunBody = new THREE.Mesh(
    new THREE.SphereGeometry(8.8, 42, 42),
    new THREE.MeshBasicMaterial({
      color: 0xffdb57,
      transparent: true,
      opacity: 0.98,
    }),
  );
  backgroundSun.add(backgroundSunBody);

  const backgroundSunHalo = new THREE.Mesh(
    new THREE.SphereGeometry(12.8, 38, 38),
    new THREE.MeshBasicMaterial({
      color: 0xffd95e,
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
    }),
  );
  backgroundSun.add(backgroundSunHalo);

  const backgroundSunOuterHalo = new THREE.Mesh(
    new THREE.SphereGeometry(17.8, 34, 34),
    new THREE.MeshBasicMaterial({
      color: 0xffb326,
      transparent: true,
      opacity: 0.08,
      depthWrite: false,
    }),
  );
  backgroundSun.add(backgroundSunOuterHalo);

  const backgroundSunLight = new THREE.PointLight(0xffcf4a, 10.5, 220, 1.04);
  backgroundSunLight.position.copy(backgroundSun.position);
  scene.add(backgroundSunLight);

  const backgroundSunCore = new THREE.Mesh(
    new THREE.SphereGeometry(5.6, 36, 36),
    new THREE.MeshBasicMaterial({
      color: 0xfff6b0,
      transparent: true,
      opacity: 0.98,
    }),
  );
  backgroundSun.add(backgroundSunCore);

  const backgroundSunCorona = new THREE.Group();
  backgroundSun.add(backgroundSunCorona);
  const sunFlames = [];

  for (let index = 0; index < 26; index += 1) {
    const theta = (index / 26) * Math.PI * 2;
    const phi = (index % 2 === 0 ? 0.9 : 1.25) + (Math.random() - 0.5) * 0.34;
    const direction = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.cos(phi) * 0.92,
      Math.sin(phi) * Math.sin(theta),
    ).normalize();

    const flame = new THREE.Mesh(
      new THREE.ConeGeometry(0.9 + Math.random() * 0.36, 3 + Math.random() * 2.2, 10, 1, true),
      new THREE.MeshBasicMaterial({
        color: index % 3 === 0 ? 0xff8e3b : index % 2 === 0 ? 0xffc84a : 0xfff2a8,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    flame.position.copy(direction).multiplyScalar(9.1 + Math.random() * 0.35);
    flame.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    flame.rotateX(Math.PI);
    backgroundSunCorona.add(flame);

    sunFlames.push({
      mesh: flame,
      direction,
      phase: Math.random() * Math.PI * 2,
      baseScale: 0.85 + Math.random() * 0.55,
      drift: 0.86 + Math.random() * 0.44,
    });
  }

  const corePlanet = new THREE.Mesh(
    new THREE.SphereGeometry(1.7, 42, 42),
    new THREE.MeshStandardMaterial({
      color: 0x16364a,
      roughness: 0.34,
      metalness: 0.24,
      emissive: 0x0e2432,
      emissiveIntensity: 0.34,
    }),
  );
  core.add(corePlanet);

  const coreInner = new THREE.Mesh(
    new THREE.SphereGeometry(1.18, 36, 36),
    new THREE.MeshStandardMaterial({
      color: 0x235670,
      roughness: 0.16,
      metalness: 0.22,
      emissive: 0x1c8fa3,
      emissiveIntensity: 0.42,
    }),
  );
  core.add(coreInner);

  const coreGlow = new THREE.Mesh(
    new THREE.SphereGeometry(2.65, 28, 28),
    new THREE.MeshBasicMaterial({
      color: 0x7ce8f4,
      transparent: true,
      opacity: 0.075,
      depthWrite: false,
    }),
  );
  core.add(coreGlow);

  const coreRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.6, 0.03, 16, 220),
    new THREE.MeshBasicMaterial({
      color: 0x7ce8f4,
      transparent: true,
      opacity: 0.24,
    }),
  );
  coreRing.rotation.x = Math.PI * 0.62;
  coreRing.rotation.z = Math.PI * 0.22;
  core.add(coreRing);

  const coreRingSecondary = new THREE.Mesh(
    new THREE.TorusGeometry(3.5, 0.018, 12, 220),
    new THREE.MeshBasicMaterial({
      color: 0xffa26a,
      transparent: true,
      opacity: 0.14,
    }),
  );
  coreRingSecondary.rotation.x = Math.PI * 0.48;
  core.add(coreRingSecondary);

  const starGeometry = new THREE.BufferGeometry();
  const starCount = 520;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);

  for (let index = 0; index < starCount; index += 1) {
    const radius = 34 + Math.random() * 28;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[index * 3 + 1] = radius * Math.cos(phi) * 0.7;
    positions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

    const color = new THREE.Color(Math.random() > 0.6 ? 0x7ce8f4 : 0xf7f9fc);
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }

  starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  );
  scene.add(stars);

  const resourceObjects = new Map();
  const interactives = [];
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const scaleVector = new THREE.Vector3();
  const focusVector = new THREE.Vector3(0, 0.2, 0);
  const focusTarget = new THREE.Vector3(0, 0.2, 0);
  const worldPosition = new THREE.Vector3();
  const focusLook = new THREE.Vector3(0, 0.2, 0);
  const focusCameraPosition = new THREE.Vector3();
  const focusDirection = new THREE.Vector3(0.22, 0.12, 1);
  const overviewCamera = new THREE.Vector3(0, 6.5, 21);
  const overviewTarget = new THREE.Vector3(0, 0.2, 0);
  const pressState = {
    active: false,
    x: 0,
    y: 0,
  };
  const detailSystem = new THREE.Group();
  detailSystem.visible = false;
  scene.add(detailSystem);
  let detailPivots = [];
  let detailBillboards = [];
  const ship = new THREE.Group();
  ship.visible = true;
  scene.add(ship);

  const shipBody = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.15, 0.95, 6, 18),
    new THREE.MeshStandardMaterial({
      color: 0xf2f7ff,
      roughness: 0.18,
      metalness: 0.62,
      emissive: 0x26485d,
      emissiveIntensity: 0.2,
    }),
  );
  shipBody.rotation.z = Math.PI * 0.5;
  ship.add(shipBody);

  const shipCabin = new THREE.Mesh(
    new THREE.SphereGeometry(0.19, 16, 16),
    new THREE.MeshStandardMaterial({
      color: 0x7ce8f4,
      roughness: 0.08,
      metalness: 0.22,
      emissive: 0x7ce8f4,
      emissiveIntensity: 0.48,
      transparent: true,
      opacity: 0.94,
    }),
  );
  shipCabin.position.set(0.18, 0.12, 0);
  ship.add(shipCabin);

  const shipWingGeometry = new THREE.BoxGeometry(0.44, 0.05, 0.84);
  const shipWingMaterial = new THREE.MeshStandardMaterial({
    color: 0xb9d4e5,
    roughness: 0.26,
    metalness: 0.44,
    emissive: 0x173345,
    emissiveIntensity: 0.16,
  });
  const shipWingLeft = new THREE.Mesh(shipWingGeometry, shipWingMaterial);
  shipWingLeft.position.set(-0.04, 0, 0.32);
  ship.add(shipWingLeft);
  const shipWingRight = shipWingLeft.clone();
  shipWingRight.position.z = -0.32;
  ship.add(shipWingRight);

  const shipEngine = new THREE.Mesh(
    new THREE.ConeGeometry(0.11, 0.36, 12, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0xffcc5c,
      transparent: true,
      opacity: 0.82,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  shipEngine.rotation.z = -Math.PI * 0.5;
  shipEngine.position.set(-0.7, 0, 0);
  ship.add(shipEngine);

  const shipGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.34, 14, 14),
    new THREE.MeshBasicMaterial({
      color: 0xffa84d,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    }),
  );
  shipGlow.position.set(-0.54, 0, 0);
  ship.add(shipGlow);

  const shipState = {
    active: false,
    progress: 1,
    startTime: 0,
    duration: 2.5,
    fromKey: null,
    toKey: null,
    from: new THREE.Vector3(0, 2.5, 0),
    to: new THREE.Vector3(0, 2.5, 0),
    control: new THREE.Vector3(0, 4.2, 0),
    current: new THREE.Vector3(0, 2.5, 0),
    targetOrbitPhase: 0,
  };
  const shipCurve = new THREE.QuadraticBezierCurve3(
    shipState.from.clone(),
    shipState.control.clone(),
    shipState.to.clone(),
  );
  const shipDirection = new THREE.Vector3(1, 0, 0);
  const shipLook = new THREE.Vector3();
  const shipOffset = new THREE.Vector3();
  const tempFrom = new THREE.Vector3();
  const tempTo = new THREE.Vector3();
  const tempMid = new THREE.Vector3();
  const tempPerp = new THREE.Vector3();
  const tempOrbit = new THREE.Vector3();
  const tempUp = new THREE.Vector3(0, 1, 0);
  const audioState = {
    element: null,
    enabled: false,
    started: false,
    userMuted: false,
  };

  let selectedKey = null;
  let hoverKey = null;
  let frameId = null;
  let visible = true;
  let lastInteractionWasKeyboard = false;
  let viewMode = "overview";
  root.dataset.viewMode = viewMode;
  setAudioButtonState(false);

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

  function makeLabelTexture(item) {
    const labelCanvas = document.createElement("canvas");
    labelCanvas.width = 720;
    labelCanvas.height = 220;
    const ctx = labelCanvas.getContext("2d");
    const accent = new THREE.Color(item.accent);
    const accentCss = `rgba(${Math.round(accent.r * 255)}, ${Math.round(accent.g * 255)}, ${Math.round(accent.b * 255)}, 0.94)`;

    ctx.clearRect(0, 0, labelCanvas.width, labelCanvas.height);
    ctx.fillStyle = "rgba(6, 19, 28, 0.74)";
    roundRect(ctx, 16, 16, 688, 188, 28);
    ctx.fill();

    ctx.strokeStyle = accentCss;
    ctx.lineWidth = 4;
    roundRect(ctx, 16, 16, 688, 188, 28);
    ctx.stroke();

    ctx.fillStyle = accentCss;
    ctx.font = "900 28px Inter, Arial, sans-serif";
    ctx.fillText(item.type.toUpperCase(), 44, 74);

    ctx.fillStyle = "#f7f9fc";
    ctx.font = "900 48px Inter, Arial, sans-serif";
    wrapText(ctx, item.title, 44, 140, 580, 50);

    const texture = new THREE.CanvasTexture(labelCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }

  function makeCoreLabelTexture() {
    const labelCanvas = document.createElement("canvas");
    labelCanvas.width = 920;
    labelCanvas.height = 250;
    const ctx = labelCanvas.getContext("2d");

    ctx.clearRect(0, 0, labelCanvas.width, labelCanvas.height);
    ctx.fillStyle = "rgba(6, 19, 28, 0.78)";
    roundRect(ctx, 18, 20, 884, 210, 34);
    ctx.fill();

    ctx.strokeStyle = "rgba(124, 232, 244, 0.9)";
    ctx.lineWidth = 4;
    roundRect(ctx, 18, 20, 884, 210, 34);
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 164, 108, 0.96)";
    ctx.font = "900 28px Inter, Arial, sans-serif";
    ctx.fillText("COEUR DIGITAL", 52, 78);

    ctx.fillStyle = "#f7f9fc";
    ctx.font = "900 60px Inter, Arial, sans-serif";
    ctx.fillText("MY BUSINESS LIFE", 52, 156);

    const texture = new THREE.CanvasTexture(labelCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }

  function makeDetailBadgeTexture(text, accentValue) {
    const badgeCanvas = document.createElement("canvas");
    badgeCanvas.width = 560;
    badgeCanvas.height = 136;
    const ctx = badgeCanvas.getContext("2d");
    const accent = new THREE.Color(accentValue);
    const accentCss = `rgba(${Math.round(accent.r * 255)}, ${Math.round(accent.g * 255)}, ${Math.round(accent.b * 255)}, 0.95)`;

    ctx.clearRect(0, 0, badgeCanvas.width, badgeCanvas.height);
    ctx.fillStyle = "rgba(6, 19, 28, 0.84)";
    roundRect(ctx, 10, 10, 540, 116, 28);
    ctx.fill();

    ctx.strokeStyle = accentCss;
    ctx.lineWidth = 3;
    roundRect(ctx, 10, 10, 540, 116, 28);
    ctx.stroke();

    ctx.fillStyle = accentCss;
    ctx.fillRect(34, 40, 48, 8);

    ctx.fillStyle = "#f7f9fc";
    ctx.font = "900 38px Inter, Arial, sans-serif";
    ctx.fillText(text, 108, 78);

    const texture = new THREE.CanvasTexture(badgeCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }

  function setAudioButtonState(enabled) {
    metrics.audioOn = enabled;
    root.dataset.audioOn = enabled ? "true" : "false";
    if (!fields.audio) return;
    fields.audio.setAttribute("aria-pressed", enabled ? "true" : "false");
    fields.audio.setAttribute("aria-label", enabled ? "Couper l'ambiance sonore" : "Activer l'ambiance sonore");
    fields.audio.textContent = enabled ? "Couper le son" : "Activer le son";
  }

  async function ensureSoundtrackStart() {
    if (audioState.userMuted) return;
    if (!audioState.element) {
      audioState.element = new Audio(encodeURI("assets/sons/musique de fond.mp3"));
      audioState.element.loop = true;
      audioState.element.preload = "auto";
      audioState.element.volume = BACKGROUND_AUDIO_VOLUME;
      audioState.element.muted = false;
      audioState.element.setAttribute("playsinline", "");
      audioState.started = true;
    }

    try {
      audioState.element.volume = BACKGROUND_AUDIO_VOLUME;
      audioState.element.muted = false;
      audioState.element.currentTime = audioState.element.currentTime || 0;
      await audioState.element.play();
      audioState.enabled = true;
      setAudioButtonState(true);
    } catch {
      audioState.enabled = false;
      setAudioButtonState(false);
    }
  }

  async function toggleSoundtrack(forceState) {
    const shouldEnable = typeof forceState === "boolean" ? forceState : !audioState.enabled;
    if (shouldEnable) {
      audioState.userMuted = false;
      await ensureSoundtrackStart();
      return;
    }

    audioState.enabled = false;
    audioState.userMuted = true;
    setAudioButtonState(false);
    audioState.element?.pause();
  }

  function getPlanetWorldPositionByKey(key, target) {
    const resource = resourceObjects.get(key);
    if (!resource) return false;
    scene.updateMatrixWorld(true);
    resource.planetGroup.getWorldPosition(target);
    return true;
  }

  function queueShipTravel(nextKey, previousKey = null, instant = false) {
    const nextResource = resourceObjects.get(nextKey);
    if (!nextResource) return;

    if (previousKey && getPlanetWorldPositionByKey(previousKey, tempFrom)) {
      shipState.from.copy(tempFrom);
    } else if (!shipState.active && shipState.progress >= 1) {
      shipState.from.copy(ship.position.lengthSq() > 0.001 ? ship.position : new THREE.Vector3(0, 2.6, 0));
    } else {
      shipState.from.copy(shipState.current);
    }

    getPlanetWorldPositionByKey(nextKey, tempTo);
    shipState.to.copy(tempTo);

    tempMid.copy(shipState.from).lerp(shipState.to, 0.5);
    tempPerp.copy(shipState.to).sub(shipState.from).cross(tempUp);
    if (tempPerp.lengthSq() < 0.0001) {
      tempPerp.set(0.8, 0, 0.3);
    }
    tempPerp.normalize().multiplyScalar(Math.min(2.2, shipState.from.distanceTo(shipState.to) * 0.12));
    shipState.control
      .copy(tempMid)
      .add(tempPerp)
      .add(new THREE.Vector3(0, Math.max(2.4, shipState.from.distanceTo(shipState.to) * 0.2), 0));

    shipCurve.v0.copy(shipState.from);
    shipCurve.v1.copy(shipState.control);
    shipCurve.v2.copy(shipState.to);

    shipState.fromKey = previousKey;
    shipState.toKey = nextKey;
    shipState.duration = instant ? 0.01 : Math.min(3.2, 1.65 + shipState.from.distanceTo(shipState.to) * 0.08);
    shipState.startTime = performance.now() * 0.001;
    shipState.progress = instant ? 1 : 0;
    shipState.active = !instant;
    shipState.targetOrbitPhase = Math.random() * Math.PI * 2;

    if (instant) {
      shipState.current.copy(shipState.to);
      ship.position.copy(shipState.to);
    }
  }

  function primeSoundtrackFromEvent(event) {
    if (audioState.enabled || audioState.userMuted) return;
    updatePointer(event);
    const key = getHitKey();
    if (!key) return;
    void ensureSoundtrackStart();
  }

  function createOrbit(radius, color) {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0);
    const points = curve.getPoints(180).map((point) => new THREE.Vector3(point.x, 0, point.y));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return new THREE.LineLoop(
      geometry,
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.18,
      }),
    );
  }

  function createPlanet(item) {
    const orbitGroup = new THREE.Group();
    orbitGroup.rotation.x = item.tiltX;
    orbitGroup.rotation.z = item.tiltZ;
    universe.add(orbitGroup);

    const orbitLine = createOrbit(item.radius, item.accent);
    orbitGroup.add(orbitLine);

    const pivot = new THREE.Group();
    pivot.rotation.y = item.angle;
    orbitGroup.add(pivot);

    const planetGroup = new THREE.Group();
    planetGroup.position.x = item.radius;
    planetGroup.userData.key = item.key;
    pivot.add(planetGroup);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(item.size, 36, 36),
      new THREE.MeshStandardMaterial({
        color: item.color,
        roughness: 0.48,
        metalness: 0.18,
        emissive: item.accent,
        emissiveIntensity: 0.12,
      }),
    );
    sphere.userData.key = item.key;
    planetGroup.add(sphere);

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(item.size * 1.36, 30, 30),
      new THREE.MeshBasicMaterial({
        color: item.accent,
        transparent: true,
        opacity: 0.09,
        depthWrite: false,
      }),
    );
    planetGroup.add(glow);

    let ring = null;
    if (item.ring) {
      ring = new THREE.Mesh(
        new THREE.TorusGeometry(item.size * 1.48, item.size * 0.08, 14, 120),
        new THREE.MeshBasicMaterial({
          color: item.ringColor || item.accent,
          transparent: true,
          opacity: 0.32,
        }),
      );
      ring.rotation.x = Math.PI * 0.48;
      ring.rotation.z = Math.PI * 0.18;
      planetGroup.add(ring);
    }

    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(item.size * 2.8, item.size * 0.84),
      new THREE.MeshBasicMaterial({
        map: makeLabelTexture(item),
        transparent: true,
        depthWrite: false,
      }),
    );
    label.position.set(0, item.size * 2.05, 0);
    label.userData.key = item.key;
    planetGroup.add(label);

    interactives.push(sphere, label);
    resourceObjects.set(item.key, {
      item,
      orbitGroup,
      orbitLine,
      pivot,
      planetGroup,
      sphere,
      glow,
      ring,
      label,
    });
  }

  resourceData.forEach(createPlanet);

  const coreLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(6.9, 1.88),
    new THREE.MeshBasicMaterial({
      map: makeCoreLabelTexture(),
      transparent: true,
      depthWrite: false,
    }),
  );
  coreLabel.position.set(0, 3.45, 0);
  core.add(coreLabel);

  function updatePanel(key) {
    const resource = resourceByKey.get(key);
    if (!resource) return;

    const previousKey = selectedKey;
    selectedKey = key;
    metrics.selected = key;
    root.dataset.selectedKey = key;
    root.style.setProperty("--resource-accent", `#${resource.accent.toString(16).padStart(6, "0")}`);
    if (previousKey !== key) {
      queueShipTravel(key, previousKey, !metrics.ready);
    }

    if (fields.type) fields.type.textContent = resource.type;
    if (fields.title) fields.title.textContent = resource.title;
    if (fields.text) fields.textContent = resource.description;
    if (fields.format) fields.format.textContent = resource.format;
    if (fields.goal) fields.goal.textContent = resource.goal;
    if (fields.link) {
      fields.link.href = resource.href;
      fields.link.textContent = resource.cta || "Ouvrir la ressource";
      fields.link.setAttribute("aria-label", `${resource.cta || "Ouvrir la ressource"} : ${resource.title}`);
    }

    if (fields.chips) {
      fields.chips.innerHTML = "";
      resource.chips.forEach((chipText) => {
        const chip = document.createElement("span");
        chip.textContent = chipText;
        fields.chips.appendChild(chip);
      });
    }
  }

  function openPanel(options = {}) {
    root.classList.add("is-panel-open");
    fields.panel?.setAttribute("aria-hidden", "false");
    fields.backdrop?.setAttribute("aria-hidden", "false");
    fields.open?.setAttribute("aria-expanded", "true");
    fields.open?.classList.add("is-hidden");
    if (options.focusClose) {
      window.requestAnimationFrame(() => {
        fields.close?.focus();
      });
    }
  }

  function closePanel(options = {}) {
    root.classList.remove("is-panel-open");
    fields.panel?.setAttribute("aria-hidden", "true");
    fields.backdrop?.setAttribute("aria-hidden", "true");
    fields.open?.setAttribute("aria-expanded", "false");
    fields.open?.classList.remove("is-hidden");
    if (options.restoreTrigger) {
      fields.open?.focus();
    }
  }

  function clearDetailSystem() {
    detailPivots = [];
    detailBillboards = [];
    while (detailSystem.children.length) {
      const child = detailSystem.children.pop();
      child.traverse?.((node) => {
        if (node.material?.map) node.material.map.dispose?.();
        node.geometry?.dispose?.();
        if (Array.isArray(node.material)) {
          node.material.forEach((material) => material?.dispose?.());
        } else {
          node.material?.dispose?.();
        }
      });
    }
    detailSystem.visible = false;
  }

  function createDetailOrbit(radius, color, opacity = 0.22) {
    return new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.012, 12, 180),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
      }),
    );
  }

  function buildDetailSystem(resource) {
    clearDetailSystem();
    if (!resource) return;

    const aura = new THREE.Mesh(
      new THREE.SphereGeometry(resource.size * 3.2, 24, 24),
      new THREE.MeshBasicMaterial({
        color: resource.accent,
        transparent: true,
        opacity: 0.08,
        depthWrite: false,
      }),
    );
    detailSystem.add(aura);

    const orbitA = createDetailOrbit(resource.size * 2.6, resource.accent, 0.26);
    orbitA.rotation.x = Math.PI * 0.58;
    detailSystem.add(orbitA);

    const orbitB = createDetailOrbit(resource.size * 3.6, 0xffffff, 0.12);
    orbitB.rotation.x = Math.PI * 0.28;
    orbitB.rotation.z = Math.PI * 0.34;
    detailSystem.add(orbitB);

    const orbitC = createDetailOrbit(resource.size * 4.5, resource.accent, 0.14);
    orbitC.rotation.x = Math.PI * 0.78;
    orbitC.rotation.z = Math.PI * 0.14;
    detailSystem.add(orbitC);

    (resource.detailSatellites || []).forEach((satellite, index) => {
      const pivot = new THREE.Group();
      pivot.rotation.x = satellite.tiltX || 0;
      pivot.rotation.z = satellite.tiltZ || 0;
      pivot.rotation.y = index * 1.9;
      detailSystem.add(pivot);

      const body = new THREE.Group();
      body.position.x = satellite.radius;
      pivot.add(body);

      const moon = new THREE.Mesh(
        new THREE.SphereGeometry(satellite.size, 18, 18),
        new THREE.MeshStandardMaterial({
          color: satellite.color,
          emissive: satellite.color,
          emissiveIntensity: 0.18,
          roughness: 0.38,
          metalness: 0.18,
        }),
      );
      body.add(moon);

      const moonGlow = new THREE.Mesh(
        new THREE.SphereGeometry(satellite.size * 1.8, 16, 16),
        new THREE.MeshBasicMaterial({
          color: satellite.color,
          transparent: true,
          opacity: 0.09,
          depthWrite: false,
        }),
      );
      body.add(moonGlow);

      const signalRing = new THREE.Mesh(
        new THREE.TorusGeometry(satellite.size * 1.9, satellite.size * 0.12, 10, 80),
        new THREE.MeshBasicMaterial({
          color: resource.accent,
          transparent: true,
          opacity: 0.24,
        }),
      );
      signalRing.rotation.x = Math.PI * 0.56;
      body.add(signalRing);

      detailPivots.push({
        pivot,
        body,
        speed: satellite.speed,
      });
    });

    resource.chips.slice(0, 3).forEach((chip, index) => {
      const pivot = new THREE.Group();
      pivot.rotation.y = index * 2.12 + 0.2;
      detailSystem.add(pivot);

      const badgeAnchor = new THREE.Group();
      badgeAnchor.position.set(resource.size * (4.5 + index * 0.6), (index - 1) * 0.52, 0);
      pivot.add(badgeAnchor);

      const badge = new THREE.Mesh(
        new THREE.PlaneGeometry(1.85, 0.46),
        new THREE.MeshBasicMaterial({
          map: makeDetailBadgeTexture(chip, resource.accent),
          transparent: true,
          opacity: 0.9,
          depthWrite: false,
        }),
      );
      badgeAnchor.add(badge);

      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 16, 16),
        new THREE.MeshBasicMaterial({
          color: resource.accent,
          transparent: true,
          opacity: 0.92,
        }),
      );
      marker.position.x = -1.08;
      badgeAnchor.add(marker);

      const link = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.62, 10),
        new THREE.MeshBasicMaterial({
          color: resource.accent,
          transparent: true,
          opacity: 0.26,
        }),
      );
      link.rotation.z = Math.PI * 0.5;
      link.position.x = -0.76;
      badgeAnchor.add(link);

      detailPivots.push({
        pivot,
        body: badgeAnchor,
        speed: 0.18 + index * 0.04,
      });
      detailBillboards.push(badgeAnchor);
    });

    detailSystem.visible = true;
  }

  function enterPlanetFocus(options = {}) {
    if (!selectedKey) return;
    const resource = resourceByKey.get(selectedKey);
    if (!resource) return;
    viewMode = "focus";
    metrics.mode = viewMode;
    root.dataset.viewMode = viewMode;
    controls.enabled = false;
    controls.autoRotate = false;
    hoverKey = null;
    canvas.classList.remove("is-hovering");
    buildDetailSystem(resource);
    openPanel(options);
  }

  function exitPlanetFocus(options = {}) {
    if (selectedKey) {
      const activeResource = resourceObjects.get(selectedKey);
      if (activeResource) {
        activeResource.planetGroup.getWorldPosition(focusTarget);
        controls.target.copy(focusTarget);
        controls.update();
      }
    }
    viewMode = "overview";
    metrics.mode = viewMode;
    root.dataset.viewMode = viewMode;
    clearDetailSystem();
    closePanel(options);
  }

  function setSize() {
    const rect = root.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    const mobile = width < 760;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, mobile ? 1.3 : 1.8);

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = mobile ? 50 : 42;
    overviewCamera.set(0, mobile ? 7.2 : 6.5, mobile ? 24 : 21);
    if (viewMode === "overview" && selectedKey === null) {
      camera.position.copy(overviewCamera);
    }
    controls.minDistance = mobile ? 9 : 8;
    controls.maxDistance = mobile ? 30 : 28;
    camera.updateProjectionMatrix();
    controls.update();
  }

  function updatePointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    metrics.pointer = {
      x: Number(pointer.x.toFixed(3)),
      y: Number(pointer.y.toFixed(3)),
    };

    parallax.targetX = pointer.x * 0.65;
    parallax.targetY = pointer.y * 0.45;
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

  function selectPlanet(event) {
    updatePointer(event);
    const key = getHitKey();
    if (!key) return;
    void ensureSoundtrackStart();
    updatePanel(key);
    enterPlanetFocus({ focusClose: lastInteractionWasKeyboard });
  }

  function cycleSelection(direction) {
    if (!resourceData.length) return;
    void ensureSoundtrackStart();
    const currentIndex = resourceData.findIndex((item) => item.key === selectedKey);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + direction + resourceData.length) % resourceData.length;
    updatePanel(resourceData[nextIndex].key);
  }

  function handleKeydown(event) {
    if (event.defaultPrevented) return;
    lastInteractionWasKeyboard = true;

    if (event.key === "Escape") {
      if (root.classList.contains("is-panel-open")) {
        event.preventDefault();
        exitPlanetFocus({ restoreTrigger: true });
      }
      return;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      cycleSelection(1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      cycleSelection(-1);
    } else if (event.key === "Enter" || event.key === " ") {
      if (document.activeElement === fields.link || document.activeElement === fields.close) return;
      event.preventDefault();
      if (!selectedKey) {
        updatePanel(resourceData[0].key);
      }
      enterPlanetFocus({ focusClose: true });
    }
  }

  function easeInOutCubic(value) {
    return value < 0.5 ? 4 * value * value * value : 1 - (Math.pow(-2 * value + 2, 3) / 2);
  }

  function updateShip(t, activeResource) {
    const enginePulse = 1 + Math.sin(t * 8.4) * 0.18;
    shipEngine.scale.set(enginePulse * 1.08, 1.16 + enginePulse * 0.18, enginePulse * 1.08);
    shipGlow.scale.setScalar(enginePulse * (shipState.active ? 1.45 : 1.12));

    if (shipState.active) {
      const progress = Math.min(1, (t - shipState.startTime) / shipState.duration);
      const eased = easeInOutCubic(progress);
      shipCurve.getPointAt(eased, shipState.current);
      shipCurve.getPointAt(Math.min(0.995, eased + 0.025), shipLook);
      ship.position.copy(shipState.current);
      ship.lookAt(shipLook);
      ship.rotateY(Math.PI * 0.5);
      ship.rotateZ(Math.sin(t * 5.2) * 0.08);
      shipState.progress = progress;
      metrics.shipProgress = Number(progress.toFixed(3));

      if (progress >= 1) {
        shipState.active = false;
        shipState.progress = 1;
      }
      return;
    }

    if (activeResource) {
      activeResource.planetGroup.getWorldPosition(tempOrbit);
      const orbitRadius = activeResource.item.size * (viewMode === "focus" ? 2.9 : 2.15);
      shipOffset.set(
        Math.cos(t * 0.72 + shipState.targetOrbitPhase) * orbitRadius,
        activeResource.item.size * 0.64 + Math.sin(t * 1.35 + shipState.targetOrbitPhase) * 0.22,
        Math.sin(t * 0.72 + shipState.targetOrbitPhase) * orbitRadius * 0.82,
      );
      tempOrbit.add(shipOffset);
      shipState.current.lerp(tempOrbit, reduceMotion ? 1 : 0.08);
      activeResource.planetGroup.getWorldPosition(tempTo);
      shipLook.copy(tempTo);
    } else {
      shipLook.set(universe.position.x, universe.position.y + 0.4, universe.position.z);
      tempOrbit.set(
        universe.position.x + Math.cos(t * 0.36) * 3.3,
        universe.position.y + 2.4 + Math.sin(t * 1.2) * 0.32,
        universe.position.z + Math.sin(t * 0.36) * 2.6,
      );
      shipState.current.lerp(tempOrbit, reduceMotion ? 1 : 0.04);
    }

    ship.position.copy(shipState.current);
    ship.lookAt(shipLook);
    ship.rotateY(Math.PI * 0.5);
    ship.rotateZ(Math.sin(t * 3.4) * 0.05);
    metrics.shipProgress = 1;
  }

  function render(time = 0) {
    frameId = null;
    const t = time * 0.001;
    metrics.frames += 1;

    parallax.x += (parallax.targetX - parallax.x) * 0.03;
    parallax.y += (parallax.targetY - parallax.y) * 0.03;
    universe.position.x = parallax.x;
    universe.position.y = parallax.y;

    core.rotation.y = t * 0.06;
    corePlanet.rotation.y = t * 0.11;
    coreInner.rotation.y = -t * 0.18;
    coreGlow.scale.setScalar(1 + Math.sin(t * 1.2) * 0.05);
    coreRing.rotation.z = t * 0.1;
    coreRingSecondary.rotation.y = t * 0.06;
    coreLabel.lookAt(camera.position);
    backgroundSun.rotation.y = t * 0.012;
    backgroundSunBody.scale.setScalar(1 + Math.sin(t * 0.68) * 0.03);
    backgroundSunCore.scale.setScalar(1 + Math.cos(t * 0.94) * 0.04);
    backgroundSunHalo.scale.setScalar(1 + Math.sin(t * 0.55) * 0.06);
    backgroundSunOuterHalo.scale.setScalar(1 + Math.cos(t * 0.42) * 0.07);
    backgroundSunLight.intensity = 10.5 + Math.sin(t * 0.62) * 0.9;
    sunFlames.forEach((flame, index) => {
      const flicker = 1 + Math.sin(t * flame.drift + flame.phase) * 0.34;
      flame.mesh.position.copy(flame.direction).multiplyScalar(9 + flicker * 0.72);
      flame.mesh.scale.set(0.92 + flicker * 0.18, flame.baseScale + flicker * 0.54, 0.92 + flicker * 0.18);
      flame.mesh.material.opacity = 0.18 + ((Math.sin(t * (flame.drift + 0.24) + flame.phase + index) + 1) * 0.5) * 0.16;
      flame.mesh.rotateY(0.0024);
    });
    stars.rotation.y = t * 0.01;

    resourceObjects.forEach((resource, key) => {
      const { item, orbitLine, pivot, sphere, glow, ring, label, planetGroup } = resource;
      const active = key === selectedKey;
      const hovered = key === hoverKey;
      const focusActive = viewMode === "focus" && active;
      const speed = reduceMotion ? 0 : item.speed;
      const pulse = reduceMotion ? 0 : Math.sin(t * 1.5 + item.radius) * 0.03;

      pivot.rotation.y += speed * 0.0036;
      sphere.rotation.y += speed * 0.022;
      planetGroup.rotation.y += speed * 0.018;

      const targetScale = focusActive ? 1.28 + pulse * 0.6 : active ? 1.16 + pulse : hovered ? 1.08 + pulse * 0.6 : 1;
      scaleVector.set(targetScale, targetScale, targetScale);
      planetGroup.scale.lerp(scaleVector, 0.08);
      orbitLine.material.opacity += (((focusActive ? 0.38 : active ? 0.24 : hovered ? 0.22 : 0.18) - orbitLine.material.opacity) * 0.08);
      glow.material.opacity += (((focusActive ? 0.28 : active ? 0.22 : hovered ? 0.15 : 0.09) - glow.material.opacity) * 0.08);
      sphere.material.emissiveIntensity += (((focusActive ? 0.42 : active ? 0.34 : hovered ? 0.2 : 0.12) - sphere.material.emissiveIntensity) * 0.08);
      label.material.opacity += (((focusActive ? 0.08 : active ? 1 : hovered ? 0.82 : 0.58) - label.material.opacity) * 0.08);
      label.scale.lerp(scaleVector.setScalar(focusActive ? 0.72 : 1), 0.08);

      if (ring) {
        ring.rotation.z += speed * 0.004;
        ring.material.opacity += (((focusActive ? 0.44 : active ? 0.32 : 0.24) - ring.material.opacity) * 0.08);
      }

      label.lookAt(camera.position);
    });

    const activeResource = selectedKey ? resourceObjects.get(selectedKey) : null;
    updateShip(t, activeResource);

    if (viewMode === "focus" && activeResource) {
      activeResource.planetGroup.getWorldPosition(worldPosition);
      focusTarget.copy(worldPosition);
      focusLook.lerp(focusTarget, reduceMotion ? 1 : 0.08);
      focusDirection.copy(camera.position).sub(worldPosition).normalize();
      if (focusDirection.lengthSq() < 0.001) {
        focusDirection.set(0.18, 0.1, 1).normalize();
      }
      focusCameraPosition
        .copy(worldPosition)
        .add(focusDirection.multiplyScalar(Math.max(3.9, activeResource.item.size * 5.4)))
        .add(new THREE.Vector3(0.12, Math.max(0.7, activeResource.item.size * 1.2), 0));

      camera.position.lerp(focusCameraPosition, reduceMotion ? 1 : 0.08);
      camera.lookAt(focusLook);

      detailSystem.position.lerp(worldPosition, reduceMotion ? 1 : 0.14);
      detailPivots.forEach((detail) => {
        detail.pivot.rotation.y += detail.speed * 0.01;
        detail.body.rotation.y += detail.speed * 0.014;
      });
      detailSystem.lookAt(camera.position);
      detailBillboards.forEach((badgeAnchor) => {
        badgeAnchor.lookAt(camera.position);
      });
      metrics.cameraDistance = Number(camera.position.distanceTo(focusLook).toFixed(3));
    } else {
      detailSystem.visible = false;
      controls.enabled = true;
      controls.autoRotate = false;
      controls.update();
      metrics.cameraDistance = Number(camera.position.distanceTo(controls.target).toFixed(3));
    }

    renderer.render(scene, camera);

    if (!metrics.ready) {
      metrics.ready = true;
      root.dataset.ready = "true";
      document.body.classList.add("is-resources-universe-ready");
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
    audioState.element?.pause();
    audioState.element = null;
    renderer.dispose();
    starGeometry.dispose();
  }

  fields.open?.setAttribute("aria-expanded", "false");
  setSize();
  render(0);

  const resizeObserver = new ResizeObserver(setSize);
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

  canvas.addEventListener("pointermove", updateHover, { passive: true });
  canvas.addEventListener("pointerdown", (event) => {
    lastInteractionWasKeyboard = false;
    primeSoundtrackFromEvent(event);
    pressState.active = true;
    pressState.x = event.clientX;
    pressState.y = event.clientY;
  });
  canvas.addEventListener("pointerup", (event) => {
    if (!pressState.active) return;
    const deltaX = Math.abs(event.clientX - pressState.x);
    const deltaY = Math.abs(event.clientY - pressState.y);
    pressState.active = false;
    if (deltaX < 8 && deltaY < 8) {
      selectPlanet(event);
    }
  });
  canvas.addEventListener("pointercancel", () => {
    pressState.active = false;
  });
  canvas.addEventListener("pointerleave", () => {
    hoverKey = null;
    metrics.hover = null;
    pressState.active = false;
    canvas.classList.remove("is-hovering");
  });
  controls.addEventListener("start", () => {
    lastInteractionWasKeyboard = false;
    canvas.classList.add("is-dragging");
  });
  controls.addEventListener("end", () => {
    canvas.classList.remove("is-dragging");
  });
  fields.close?.addEventListener("click", () => {
    exitPlanetFocus({ restoreTrigger: true });
  });
  fields.backdrop?.addEventListener("click", () => {
    exitPlanetFocus();
  });
  fields.open?.addEventListener("click", () => {
    void ensureSoundtrackStart();
    if (!selectedKey) {
      updatePanel(resourceData[0].key);
    }
    enterPlanetFocus({ focusClose: true });
  });
  fields.audio?.addEventListener("click", () => {
    void toggleSoundtrack();
  });

  window.addEventListener("resize", setSize, { passive: true });
  window.addEventListener("beforeunload", dispose, { once: true });
  window.addEventListener("keydown", handleKeydown);

  if (reduceMotion) {
    controls.autoRotate = false;
    renderer.render(scene, camera);
  }
}
