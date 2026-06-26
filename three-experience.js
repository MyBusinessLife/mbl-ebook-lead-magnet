import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js";

const root = document.querySelector("[data-three-lab]");
const canvas = document.querySelector("#mblThreeCanvas");
const viewport = canvas?.closest(".three-viewport");

const serviceData = {
  web: {
    label: "WEB",
    title: "Site premium",
    text: "Une présence digitale claire, rapide et mesurable.",
    href: "developpement-web.html",
    color: 0xff6a2e,
    position: new THREE.Vector3(-2.8, 1.25, 0.1),
  },
  software: {
    label: "APP",
    title: "Logiciel métier",
    text: "Un outil sur-mesure pour centraliser les process et les données.",
    href: "logiciel-sur-mesure.html",
    color: 0x1c8fa3,
    position: new THREE.Vector3(2.55, 1.08, 0.2),
  },
  automation: {
    label: "AUTO",
    title: "Automatisation",
    text: "Des flux fiables pour réduire les tâches répétitives.",
    href: "automatisation.html",
    color: 0xff6a2e,
    position: new THREE.Vector3(-2.95, -0.78, 0.15),
  },
  pilotage: {
    label: "DATA",
    title: "Pilotage",
    text: "Des dashboards lisibles pour décider sans attendre.",
    href: "logiciel-sur-mesure.html",
    color: 0x2ecce3,
    position: new THREE.Vector3(0, -1.52, 0.35),
  },
  ai: {
    label: "IA",
    title: "Agents IA",
    text: "Des assistants métier cadrés, connectés et contrôlables.",
    href: "agents-ia.html",
    color: 0xf7f9fc,
    position: new THREE.Vector3(0, 1.9, -0.25),
  },
  repair: {
    label: "PC",
    title: "Informatique",
    text: "Réparation, assistance, matériel et diagnostic clair.",
    href: "reparation-ordinateur.html",
    color: 0x65d2df,
    position: new THREE.Vector3(2.95, -0.8, 0.15),
  },
};

if (!root || !canvas) {
  throw new Error("Three.js root is missing.");
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const verifyMode = new URLSearchParams(window.location.search).has("verify");
const metrics = {
  frames: 0,
  selected: "web",
  hover: null,
  dragRotation: { x: 0, y: 0 },
  ready: false,
};

window.MBL_THREE_METRICS = metrics;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(0, 0.56, 7.2);

const renderer = new THREE.WebGLRenderer({
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

const world = new THREE.Group();
scene.add(world);

const moduleGroup = new THREE.Group();
world.add(moduleGroup);

const lineGroup = new THREE.Group();
world.add(lineGroup);

const ambient = new THREE.AmbientLight(0xd7f8ff, 1.35);
const key = new THREE.DirectionalLight(0xffffff, 2.3);
const tealLight = new THREE.PointLight(0x1c8fa3, 3.6, 10);
const orangeLight = new THREE.PointLight(0xff6a2e, 3.2, 10);

key.position.set(2, 4, 4);
tealLight.position.set(-2.4, 1.6, 3.2);
orangeLight.position.set(2.4, -1.4, 2.8);
scene.add(ambient, key, tealLight, orangeLight);

const coreMaterial = new THREE.MeshStandardMaterial({
  color: 0x102637,
  roughness: 0.36,
  metalness: 0.62,
  emissive: 0x0a5160,
  emissiveIntensity: 0.28,
});

const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.82, 4), coreMaterial);
core.position.z = 0.08;
world.add(core);

const innerCore = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.42, 2),
  new THREE.MeshStandardMaterial({
    color: 0xff6a2e,
    roughness: 0.22,
    metalness: 0.44,
    emissive: 0xff6a2e,
    emissiveIntensity: 0.36,
  }),
);
world.add(innerCore);

const commandCenter = new THREE.Group();
commandCenter.position.set(0, -0.14, -0.58);
world.add(commandCenter);

const dashboardFrame = new THREE.Mesh(
  new THREE.BoxGeometry(3.05, 1.58, 0.16, 1, 1, 1),
  new THREE.MeshStandardMaterial({
    color: 0x102637,
    roughness: 0.3,
    metalness: 0.58,
    emissive: 0x0b4050,
    emissiveIntensity: 0.22,
  }),
);
dashboardFrame.position.z = -0.18;
commandCenter.add(dashboardFrame);

const dashboardScreen = new THREE.Mesh(
  new THREE.PlaneGeometry(2.76, 1.26),
  new THREE.MeshBasicMaterial({
    color: 0x07131c,
    transparent: true,
    opacity: 0.88,
  }),
);
dashboardScreen.position.z = -0.08;
commandCenter.add(dashboardScreen);

const dashboardGlow = new THREE.Mesh(
  new THREE.PlaneGeometry(2.9, 1.42),
  new THREE.MeshBasicMaterial({
    color: 0x1c8fa3,
    transparent: true,
    opacity: 0.08,
    depthWrite: false,
  }),
);
dashboardGlow.position.z = -0.085;
commandCenter.add(dashboardGlow);

const dashboardWidgets = [];

function addDashboardBar(x, y, width, color, height = 0.055) {
  const bar = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, 0.06),
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.32,
      metalness: 0.4,
      emissive: color,
      emissiveIntensity: 0.36,
    }),
  );
  bar.position.set(x, y, 0.02);
  commandCenter.add(bar);
  dashboardWidgets.push(bar);
  return bar;
}

function addDashboardTile(x, y, width, height, color) {
  const tile = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, 0.07),
    new THREE.MeshStandardMaterial({
      color: 0x143447,
      roughness: 0.36,
      metalness: 0.42,
      emissive: color,
      emissiveIntensity: 0.16,
    }),
  );
  tile.position.set(x, y, 0.015);
  commandCenter.add(tile);

  const accent = new THREE.Mesh(
    new THREE.BoxGeometry(width * 0.72, 0.04, 0.08),
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.28,
      metalness: 0.35,
      emissive: color,
      emissiveIntensity: 0.36,
    }),
  );
  accent.position.set(x, y + height * 0.25, 0.07);
  commandCenter.add(accent);
  dashboardWidgets.push(tile, accent);
}

addDashboardTile(-0.92, 0.34, 0.58, 0.34, 0xff6a2e);
addDashboardTile(-0.2, 0.34, 0.58, 0.34, 0x1c8fa3);
addDashboardTile(0.52, 0.34, 0.58, 0.34, 0xf7f9fc);
addDashboardBar(-0.72, -0.15, 0.98, 0x1c8fa3);
addDashboardBar(-0.64, -0.33, 0.68, 0xff6a2e);
addDashboardBar(0.48, -0.18, 0.92, 0x2ecce3);
addDashboardBar(0.56, -0.36, 0.52, 0xff6a2e);

const dashboardBase = new THREE.Mesh(
  new THREE.CylinderGeometry(0.92, 1.16, 0.18, 48),
  new THREE.MeshStandardMaterial({
    color: 0x0d2534,
    roughness: 0.42,
    metalness: 0.52,
    emissive: 0x0a5160,
    emissiveIntensity: 0.12,
  }),
);
dashboardBase.position.set(0, -1.0, -0.15);
dashboardBase.rotation.x = Math.PI * 0.5;
commandCenter.add(dashboardBase);

const ringMaterials = [
  new THREE.MeshBasicMaterial({ color: 0x1c8fa3, transparent: true, opacity: 0.62 }),
  new THREE.MeshBasicMaterial({ color: 0xff6a2e, transparent: true, opacity: 0.42 }),
  new THREE.MeshBasicMaterial({ color: 0xf7f9fc, transparent: true, opacity: 0.24 }),
];

const rings = [
  new THREE.Mesh(new THREE.TorusGeometry(1.44, 0.008, 8, 150), ringMaterials[0]),
  new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.006, 8, 170), ringMaterials[1]),
  new THREE.Mesh(new THREE.TorusGeometry(2.78, 0.005, 8, 190), ringMaterials[2]),
];

rings[0].rotation.x = Math.PI * 0.5;
rings[1].rotation.y = Math.PI * 0.38;
rings[2].rotation.x = Math.PI * 0.62;
rings[2].rotation.z = Math.PI * 0.16;
world.add(...rings);

const moduleObjects = new Map();
const interactives = [];

function makeCanvasTexture(label, title) {
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 512;
  textureCanvas.height = 256;
  const ctx = textureCanvas.getContext("2d");

  ctx.clearRect(0, 0, textureCanvas.width, textureCanvas.height);
  ctx.fillStyle = "rgba(6, 19, 28, 0.74)";
  roundRect(ctx, 18, 18, 476, 220, 24);
  ctx.fill();

  const gradient = ctx.createLinearGradient(24, 24, 488, 230);
  gradient.addColorStop(0, "rgba(28, 143, 163, 0.55)");
  gradient.addColorStop(1, "rgba(255, 106, 46, 0.48)");
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 4;
  roundRect(ctx, 18, 18, 476, 220, 24);
  ctx.stroke();

  ctx.fillStyle = "#ffb08a";
  ctx.font = "900 34px Inter, Arial, sans-serif";
  ctx.fillText(label, 48, 82);

  ctx.fillStyle = "#f7f9fc";
  ctx.font = "900 46px Inter, Arial, sans-serif";
  wrapText(ctx, title, 48, 146, 408, 52);

  ctx.fillStyle = "rgba(247, 249, 252, 0.62)";
  ctx.font = "700 22px Inter, Arial, sans-serif";
  ctx.fillText("MY BUSINESS LIFE", 48, 214);

  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
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

function makeModule(keyName, data) {
  const group = new THREE.Group();
  group.position.copy(data.position);
  group.userData.key = keyName;

  const color = new THREE.Color(data.color);
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 32, 32),
    new THREE.MeshStandardMaterial({
      color,
      roughness: 0.28,
      metalness: 0.38,
      emissive: color,
      emissiveIntensity: 0.18,
    }),
  );
  sphere.userData.key = keyName;
  sphere.userData.baseScale = 1;

  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(0.44, 32, 32),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
    }),
  );

  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(1.48, 0.74),
    new THREE.MeshBasicMaterial({
      map: makeCanvasTexture(data.label, data.title),
      transparent: true,
      depthWrite: false,
    }),
  );
  label.position.set(data.position.x > 0 ? -0.54 : 0.54, -0.58, 0.02);
  label.rotation.y = data.position.x > 0 ? -0.16 : 0.16;
  label.userData.key = keyName;

  group.add(halo, sphere, label);
  moduleGroup.add(group);
  moduleObjects.set(keyName, { group, sphere, halo, label, data });
  interactives.push(sphere, label);

  const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), data.position]);
  const line = new THREE.Line(
    lineGeometry,
    new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.38,
    }),
  );
  line.userData.key = keyName;
  lineGroup.add(line);
}

Object.entries(serviceData).forEach(([keyName, data]) => makeModule(keyName, data));

const particleCount = 360;
const particlePositions = new Float32Array(particleCount * 3);
const particleColors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i += 1) {
  const radius = 2.3 + Math.random() * 3.4;
  const angle = Math.random() * Math.PI * 2;
  const y = (Math.random() - 0.5) * 3.8;
  particlePositions[i * 3] = Math.cos(angle) * radius;
  particlePositions[i * 3 + 1] = y;
  particlePositions[i * 3 + 2] = Math.sin(angle) * radius * 0.46 - 0.4;

  const color = new THREE.Color(Math.random() > 0.55 ? 0x1c8fa3 : 0xff6a2e);
  particleColors[i * 3] = color.r;
  particleColors[i * 3 + 1] = color.g;
  particleColors[i * 3 + 2] = color.b;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

const particles = new THREE.Points(
  particlesGeometry,
  new THREE.PointsMaterial({
    size: 0.028,
    vertexColors: true,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
  }),
);
world.add(particles);

const grid = new THREE.GridHelper(9, 34, 0x1c8fa3, 0x143447);
grid.position.y = -2.2;
grid.position.z = -0.8;
grid.material.transparent = true;
grid.material.opacity = 0.16;
world.add(grid);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const targetCamera = new THREE.Vector3(0, 0.56, 7.2);
let activeKey = "web";
let hoverKey = null;
let sceneVisible = true;
let rendererReady = false;
let frameId = null;

const dragState = {
  active: false,
  moved: false,
  x: 0,
  y: 0,
  startX: 0,
  startY: 0,
  rotationX: 0,
  rotationY: 0,
  targetX: 0,
  targetY: 0,
  pointerId: null,
};

function setSize() {
  const rect = (viewport || root).getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));
  const isMobile = width < 760;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.7);

  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.fov = isMobile ? 50 : 40;
  camera.position.z = isMobile ? 8.5 : 6.75;
  world.position.x = 0;
  world.position.y = isMobile ? -0.2 : -0.04;
  world.scale.setScalar(isMobile ? 0.78 : 1.08);
  camera.updateProjectionMatrix();
}

function setService(keyName) {
  if (!serviceData[keyName]) return;
  activeKey = keyName;
  metrics.selected = keyName;

  document.querySelectorAll("[data-three-service]").forEach((button) => {
    const active = button.dataset.threeService === keyName;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  const data = serviceData[keyName];
  dragState.targetY = THREE.MathUtils.clamp(-data.position.x * 0.18, -0.72, 0.72);
  dragState.targetX = THREE.MathUtils.clamp(-data.position.y * 0.05, -0.28, 0.28);

  const title = document.querySelector("[data-three-status-title]");
  const text = document.querySelector("[data-three-status-text]");
  const link = document.querySelector("[data-three-status-link]");

  if (title) title.textContent = data.title;
  if (text) text.textContent = data.text;
  if (link) link.href = data.href;
}

function updatePointer(event) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  targetCamera.x = pointer.x * 0.36;
  targetCamera.y = 0.56 + pointer.y * 0.22;
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
  const hitKey = getHitKey();
  if (hitKey) setService(hitKey);
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

  if (total > 7) dragState.moved = true;

  dragState.targetY += dx * 0.004;
  dragState.targetX += dy * 0.004;
  dragState.targetY = THREE.MathUtils.clamp(dragState.targetY, -0.82, 0.82);
  dragState.targetX = THREE.MathUtils.clamp(dragState.targetX, -0.46, 0.46);
  dragState.x = event.clientX;
  dragState.y = event.clientY;
  metrics.dragRotation = {
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

function render(time = 0) {
  frameId = null;
  const t = time * 0.001;
  metrics.frames += 1;

  if (!reduceMotion) {
    dragState.rotationY += (dragState.targetY - dragState.rotationY) * 0.08;
    dragState.rotationX += (dragState.targetX - dragState.rotationX) * 0.08;
    world.rotation.y = dragState.rotationY + Math.sin(t * 0.22) * 0.04;
    world.rotation.x = dragState.rotationX * 0.72;
    core.rotation.x = t * 0.18;
    core.rotation.y = t * 0.24;
    innerCore.rotation.x = -t * 0.34;
    innerCore.rotation.z = t * 0.28;
    commandCenter.rotation.y = Math.sin(t * 0.32) * 0.04;
    dashboardGlow.material.opacity = 0.08 + Math.sin(t * 1.1) * 0.025;
    dashboardWidgets.forEach((widget, index) => {
      widget.position.z = 0.03 + Math.sin(t * 1.35 + index * 0.7) * 0.014;
    });
    rings[0].rotation.z = t * 0.24;
    rings[1].rotation.x = Math.PI * 0.08 + t * 0.16;
    rings[2].rotation.y = t * -0.13;
    particles.rotation.y = t * 0.025;
    grid.position.z = -0.8 + Math.sin(t * 0.45) * 0.05;

    camera.position.x += (targetCamera.x - camera.position.x) * 0.035;
    camera.position.y += (targetCamera.y - camera.position.y) * 0.035;
    camera.lookAt(0.15, 0, 0);
  }

  moduleObjects.forEach((item, keyName) => {
    const isActive = keyName === activeKey;
    const isHovered = keyName === hoverKey;
    const pulse = reduceMotion ? 0 : Math.sin(t * 2.2 + item.group.position.x) * 0.04;
    const targetScale = isActive ? 1.26 + pulse : isHovered ? 1.1 + pulse * 0.6 : 0.94 + pulse * 0.35;
    item.group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
    item.group.position.y = item.data.position.y + (reduceMotion ? 0 : Math.sin(t * 1.35 + item.data.position.x) * 0.045);
    item.halo.material.opacity += ((isActive ? 0.28 : isHovered ? 0.18 : 0.08) - item.halo.material.opacity) * 0.08;
    item.label.material.opacity += ((isActive ? 1 : isHovered ? 0.88 : 0.72) - item.label.material.opacity) * 0.08;
  });

  renderer.render(scene, camera);

  if (!rendererReady) {
    rendererReady = true;
    metrics.ready = true;
    window.MBL_THREE_READY = true;
    document.body.classList.add("is-three-ready");
    root.dataset.threeReady = "true";
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
  renderer.dispose();
  particlesGeometry.dispose();
}

setSize();
setService(activeKey);
render(0);

const resizeObserver = new ResizeObserver(setSize);
resizeObserver.observe(root);
window.addEventListener("resize", setSize, { passive: true });
window.addEventListener("beforeunload", dispose);

canvas.addEventListener("pointermove", moveDrag, { passive: true });
canvas.addEventListener("pointerdown", beginDrag);
canvas.addEventListener("pointerup", endDrag);
canvas.addEventListener("pointercancel", endDrag);
canvas.addEventListener("pointerleave", () => {
  if (!dragState.active) {
    hoverKey = null;
    metrics.hover = null;
    canvas.classList.remove("is-hovering");
  }
});

document.querySelectorAll("[data-three-service]").forEach((button) => {
  button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
  button.addEventListener("click", () => setService(button.dataset.threeService));
});

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
    { threshold: 0.08 },
  );
  observer.observe(root);
} else {
  start();
}

if (reduceMotion) {
  renderer.render(scene, camera);
}
