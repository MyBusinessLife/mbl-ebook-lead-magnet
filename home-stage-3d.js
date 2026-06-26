import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js";

const canvas = document.querySelector("#stageThreeCanvas");
const panel = canvas?.closest("[data-stage-panel]");
const board = canvas?.closest(".stage-board-3d");
const fallback = board?.querySelector(".stage-board-fallback");

if (canvas && panel && board) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const verifyMode = new URLSearchParams(window.location.search).has("verify");
  const metrics = {
    frames: 0,
    state: panel.dataset.stageActive || "presence",
    hover: null,
    drag: { x: 0, y: 0 },
    ready: false,
  };

  window.MBL_STAGE_THREE_METRICS = metrics;

  const stateOrder = ["presence", "automation", "pilotage"];
  const stateColors = {
    presence: new THREE.Color(0x2ecce3),
    automation: new THREE.Color(0xff6a2e),
    pilotage: new THREE.Color(0xf7f9fc),
  };

  const stageConfigs = {
    presence: {
      accent: stateColors.presence,
      presence: {
        position: [-1.02, 0.18, 0.55],
        rotation: [-0.16, 0.3, -0.06],
        scale: 1.08,
        opacity: 1,
      },
      automation: {
        position: [0.08, -0.46, -0.36],
        rotation: [0.16, -0.32, 0.04],
        scale: 0.82,
        opacity: 0.4,
      },
      pilotage: {
        position: [1.06, 0.04, -0.26],
        rotation: [-0.06, -0.42, 0.08],
        scale: 0.82,
        opacity: 0.46,
      },
    },
    automation: {
      accent: stateColors.automation,
      presence: {
        position: [-1.18, 0.04, -0.22],
        rotation: [-0.1, 0.52, -0.05],
        scale: 0.84,
        opacity: 0.42,
      },
      automation: {
        position: [0, -0.08, 0.5],
        rotation: [0.08, 0.06, 0],
        scale: 1.1,
        opacity: 1,
      },
      pilotage: {
        position: [1.14, -0.06, -0.24],
        rotation: [0.08, -0.52, 0.04],
        scale: 0.78,
        opacity: 0.36,
      },
    },
    pilotage: {
      accent: stateColors.pilotage,
      presence: {
        position: [-1.06, 0.08, -0.26],
        rotation: [-0.12, 0.58, -0.08],
        scale: 0.8,
        opacity: 0.34,
      },
      automation: {
        position: [-0.08, -0.52, -0.38],
        rotation: [0.22, -0.28, 0.02],
        scale: 0.78,
        opacity: 0.34,
      },
      pilotage: {
        position: [1.02, 0.08, 0.54],
        rotation: [-0.12, -0.22, 0.05],
        scale: 1.12,
        opacity: 1,
      },
    },
  };

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0.18, 7.3);

  const renderer = new THREE.WebGLRenderer({
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

  const ambient = new THREE.AmbientLight(0xe4f4ff, 1.22);
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.9);
  const tealLight = new THREE.PointLight(0x2ecce3, 2.4, 16);
  const orangeLight = new THREE.PointLight(0xff6a2e, 2.2, 14);
  keyLight.position.set(-2.8, 4.5, 4.6);
  tealLight.position.set(-2.4, 1.1, 3.4);
  orangeLight.position.set(2.8, -1.2, 3.2);
  scene.add(ambient, keyLight, tealLight, orangeLight);

  const world = new THREE.Group();
  world.position.set(0.1, -0.16, 0);
  scene.add(world);

  const basePlate = new THREE.Mesh(
    new THREE.BoxGeometry(5.2, 0.22, 2.9),
    new THREE.MeshStandardMaterial({
      color: 0x0f2635,
      roughness: 0.3,
      metalness: 0.62,
      emissive: 0x0a2936,
      emissiveIntensity: 0.16,
      transparent: true,
      opacity: 0.92,
    }),
  );
  basePlate.position.set(0, -1.24, -0.12);
  basePlate.rotation.x = -0.08;
  world.add(basePlate);

  const centerOrb = new THREE.Mesh(
    new THREE.SphereGeometry(0.84, 48, 48),
    new THREE.MeshStandardMaterial({
      color: 0x0d2b3a,
      roughness: 0.22,
      metalness: 0.58,
      emissive: 0x113b4f,
      emissiveIntensity: 0.26,
      transparent: true,
      opacity: 0.96,
    }),
  );
  centerOrb.position.set(-0.12, 0.04, 0.16);
  world.add(centerOrb);

  const centerGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 24, 24),
    new THREE.MeshBasicMaterial({
      color: 0xf7f9fc,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
    }),
  );
  centerGlow.position.copy(centerOrb.position);
  centerGlow.position.x += 0.16;
  centerGlow.position.y += 0.14;
  centerGlow.position.z += 0.34;
  world.add(centerGlow);

  const ringA = new THREE.Mesh(
    new THREE.TorusGeometry(1.38, 0.02, 16, 180),
    new THREE.MeshBasicMaterial({
      color: 0x2ecce3,
      transparent: true,
      opacity: 0.54,
    }),
  );
  ringA.rotation.x = Math.PI * 0.5;
  ringA.position.copy(centerOrb.position);
  world.add(ringA);

  const ringB = new THREE.Mesh(
    new THREE.TorusGeometry(2.08, 0.012, 16, 180),
    new THREE.MeshBasicMaterial({
      color: 0xff6a2e,
      transparent: true,
      opacity: 0.24,
    }),
  );
  ringB.rotation.set(Math.PI * 0.3, Math.PI * 0.2, 0);
  ringB.position.set(0.08, 0.08, -0.02);
  world.add(ringB);

  const dustGeometry = new THREE.BufferGeometry();
  const dustCount = 140;
  const dustPositions = new Float32Array(dustCount * 3);
  const dustColors = new Float32Array(dustCount * 3);

  for (let i = 0; i < dustCount; i += 1) {
    const radius = 0.9 + Math.random() * 2.6;
    const angle = Math.random() * Math.PI * 2;
    dustPositions[i * 3] = Math.cos(angle) * radius;
    dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 2.2;
    dustPositions[i * 3 + 2] = Math.sin(angle) * radius * 0.55 - 0.25;

    const color = Math.random() > 0.5 ? stateColors.presence : stateColors.automation;
    dustColors[i * 3] = color.r;
    dustColors[i * 3 + 1] = color.g;
    dustColors[i * 3 + 2] = color.b;
  }

  dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
  dustGeometry.setAttribute("color", new THREE.BufferAttribute(dustColors, 3));

  const dust = new THREE.Points(
    dustGeometry,
    new THREE.PointsMaterial({
      size: 0.026,
      transparent: true,
      opacity: 0.72,
      vertexColors: true,
      depthWrite: false,
    }),
  );
  world.add(dust);

  const interactiveMeshes = [];

  function collectMaterials(group) {
    const materials = [];
    group.traverse((child) => {
      if (!child.material) return;
      const childMaterials = Array.isArray(child.material) ? child.material : [child.material];
      childMaterials.forEach((material) => {
        material.transparent = true;
        materials.push(material);
      });
    });
    return materials;
  }

  function setGroupTarget(group, config) {
    group.userData.targetPosition.set(...config.position);
    group.userData.targetRotation.set(...config.rotation);
    group.userData.targetScale = config.scale;
    group.userData.targetOpacity = config.opacity;
  }

  function createPresenceGroup() {
    const group = new THREE.Group();
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(1.82, 1.08, 0.08),
      new THREE.MeshStandardMaterial({
        color: 0x102637,
        roughness: 0.28,
        metalness: 0.58,
        emissive: 0x103f52,
        emissiveIntensity: 0.24,
      }),
    );
    frame.userData.state = "presence";
    group.add(frame);
    interactiveMeshes.push(frame);

    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.62, 0.88),
      new THREE.MeshBasicMaterial({
        color: 0x07131c,
        transparent: true,
        opacity: 0.9,
      }),
    );
    screen.position.z = 0.05;
    group.add(screen);

    const accentBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.86, 0.06, 0.08),
      new THREE.MeshStandardMaterial({
        color: 0x2ecce3,
        emissive: 0x2ecce3,
        emissiveIntensity: 0.38,
        roughness: 0.28,
        metalness: 0.3,
      }),
    );
    accentBar.position.set(-0.22, -0.24, 0.09);
    group.add(accentBar);

    const chipTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.54, 0.12, 0.08),
      new THREE.MeshStandardMaterial({
        color: 0xff6a2e,
        emissive: 0xff6a2e,
        emissiveIntensity: 0.24,
        roughness: 0.32,
        metalness: 0.22,
      }),
    );
    chipTop.position.set(-0.2, 0.06, 0.09);
    group.add(chipTop);

    const chipSmall = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.1, 0.08),
      new THREE.MeshStandardMaterial({
        color: 0xf7f9fc,
        emissive: 0xf7f9fc,
        emissiveIntensity: 0.16,
        roughness: 0.26,
        metalness: 0.2,
      }),
    );
    chipSmall.position.set(0.42, 0.22, 0.09);
    group.add(chipSmall);

    group.userData.materials = collectMaterials(group);
    group.userData.floatOffset = 0.18;
    group.userData.targetPosition = group.position.clone();
    group.userData.targetRotation = new THREE.Vector3();
    group.userData.targetScale = 1;
    group.userData.targetOpacity = 1;
    return group;
  }

  function createLink(start, end, color) {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const direction = new THREE.Vector3().subVectors(endVec, startVec);
    const length = direction.length();
    const mid = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);

    const link = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, length, 18),
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.22,
        roughness: 0.34,
        metalness: 0.24,
      }),
    );

    link.position.copy(mid);
    link.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    return link;
  }

  function createAutomationGroup() {
    const group = new THREE.Group();
    const nodes = [
      [-0.66, 0.22, 0.08],
      [0.14, 0.52, 0.16],
      [0.68, -0.06, 0.14],
      [-0.12, -0.46, 0.06],
    ];

    [
      [nodes[0], nodes[1]],
      [nodes[1], nodes[2]],
      [nodes[0], nodes[3]],
      [nodes[3], nodes[2]],
    ].forEach(([start, end]) => {
      group.add(createLink(start, end, 0xff6a2e));
    });

    nodes.forEach((position, index) => {
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(index === 1 ? 0.16 : 0.12, 24, 24),
        new THREE.MeshStandardMaterial({
          color: index === 1 ? 0xff6a2e : 0x2ecce3,
          emissive: index === 1 ? 0xff6a2e : 0x2ecce3,
          emissiveIntensity: 0.34,
          roughness: 0.18,
          metalness: 0.26,
        }),
      );
      node.position.set(...position);
      node.userData.state = "automation";
      group.add(node);
      interactiveMeshes.push(node);
    });

    const pulse = new THREE.Mesh(
      new THREE.TorusGeometry(0.56, 0.022, 16, 120),
      new THREE.MeshBasicMaterial({
        color: 0xff6a2e,
        transparent: true,
        opacity: 0.42,
      }),
    );
    pulse.rotation.x = Math.PI * 0.5;
    pulse.position.set(0.02, -0.04, -0.08);
    group.add(pulse);

    group.userData.materials = collectMaterials(group);
    group.userData.floatOffset = -0.22;
    group.userData.pulse = pulse;
    group.userData.targetPosition = group.position.clone();
    group.userData.targetRotation = new THREE.Vector3();
    group.userData.targetScale = 1;
    group.userData.targetOpacity = 1;
    return group;
  }

  function createPilotageGroup() {
    const group = new THREE.Group();
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(1.52, 1.02, 0.08),
      new THREE.MeshStandardMaterial({
        color: 0x102637,
        roughness: 0.24,
        metalness: 0.54,
        emissive: 0x143447,
        emissiveIntensity: 0.2,
      }),
    );
    frame.userData.state = "pilotage";
    group.add(frame);
    interactiveMeshes.push(frame);

    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.3, 0.84),
      new THREE.MeshBasicMaterial({
        color: 0x08131c,
        transparent: true,
        opacity: 0.92,
      }),
    );
    screen.position.z = 0.05;
    group.add(screen);

    const bars = [];
    [-0.42, -0.18, 0.06, 0.3, 0.54].forEach((x, index) => {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.2 + index * 0.12, 0.08),
        new THREE.MeshStandardMaterial({
          color: index > 2 ? 0xff6a2e : 0x2ecce3,
          emissive: index > 2 ? 0xff6a2e : 0x2ecce3,
          emissiveIntensity: 0.3,
          roughness: 0.24,
          metalness: 0.28,
        }),
      );
      bar.position.set(x, -0.24 + bar.geometry.parameters.height * 0.5, 0.08);
      group.add(bar);
      bars.push(bar);
    });

    const pill = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 0.1, 0.08),
      new THREE.MeshStandardMaterial({
        color: 0xf7f9fc,
        emissive: 0xf7f9fc,
        emissiveIntensity: 0.16,
        roughness: 0.22,
        metalness: 0.18,
      }),
    );
    pill.position.set(-0.08, 0.25, 0.08);
    group.add(pill);

    group.userData.materials = collectMaterials(group);
    group.userData.floatOffset = 0.12;
    group.userData.bars = bars;
    group.userData.targetPosition = group.position.clone();
    group.userData.targetRotation = new THREE.Vector3();
    group.userData.targetScale = 1;
    group.userData.targetOpacity = 1;
    return group;
  }

  const presenceGroup = createPresenceGroup();
  const automationGroup = createAutomationGroup();
  const pilotageGroup = createPilotageGroup();
  world.add(presenceGroup, automationGroup, pilotageGroup);

  const stateGroups = {
    presence: presenceGroup,
    automation: automationGroup,
    pilotage: pilotageGroup,
  };

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const cameraTarget = new THREE.Vector3(0, 0.15, 7.3);
  let activeState = metrics.state;
  let hoverState = null;
  let isVisible = true;
  let frameId = null;

  const dragState = {
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    rotationX: -0.08,
    rotationY: -0.12,
    targetX: -0.08,
    targetY: -0.12,
  };

  function setSize() {
    const rect = board.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    const isMobile = width < 640;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.6));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = isMobile ? 40 : 34;
    camera.position.z = isMobile ? 8.1 : 7.3;
    world.scale.setScalar(isMobile ? 0.88 : 1);
    world.position.set(isMobile ? 0.02 : 0.1, isMobile ? -0.18 : -0.16, 0);
    camera.updateProjectionMatrix();
  }

  function syncBoardState(state) {
    activeState = state;
    metrics.state = state;
    board.dataset.stageScene = state;
    const config = stageConfigs[state];
    if (!config) return;

    setGroupTarget(presenceGroup, config.presence);
    setGroupTarget(automationGroup, config.automation);
    setGroupTarget(pilotageGroup, config.pilotage);
  }

  function requestState(state) {
    panel.dispatchEvent(
      new CustomEvent("mbl:stage-request", {
        bubbles: false,
        detail: { key: state },
      }),
    );
  }

  function updatePointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    cameraTarget.x = pointer.x * 0.18;
    cameraTarget.y = 0.15 + pointer.y * 0.12;
  }

  function pickState() {
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(interactiveMeshes, false)[0];
    return hit?.object?.userData?.state || null;
  }

  function beginDrag(event) {
    dragState.active = true;
    dragState.moved = false;
    dragState.startX = event.clientX;
    dragState.startY = event.clientY;
    dragState.lastX = event.clientX;
    dragState.lastY = event.clientY;
    canvas.classList.add("is-dragging");
    canvas.setPointerCapture?.(event.pointerId);
    updatePointer(event);
  }

  function moveDrag(event) {
    updatePointer(event);

    if (!dragState.active) {
      hoverState = pickState();
      metrics.hover = hoverState;
      canvas.classList.toggle("is-hovering", Boolean(hoverState));
      return;
    }

    const dx = event.clientX - dragState.lastX;
    const dy = event.clientY - dragState.lastY;
    const movedDistance =
      Math.abs(event.clientX - dragState.startX) + Math.abs(event.clientY - dragState.startY);

    if (movedDistance > 7) dragState.moved = true;

    dragState.targetY = THREE.MathUtils.clamp(dragState.targetY + dx * 0.0032, -0.6, 0.52);
    dragState.targetX = THREE.MathUtils.clamp(dragState.targetX + dy * 0.0026, -0.24, 0.12);
    dragState.lastX = event.clientX;
    dragState.lastY = event.clientY;
    metrics.drag = {
      x: Number(dragState.targetX.toFixed(3)),
      y: Number(dragState.targetY.toFixed(3)),
    };
  }

  function endDrag(event) {
    if (!dragState.active) return;
    dragState.active = false;
    canvas.classList.remove("is-dragging");
    canvas.releasePointerCapture?.(event.pointerId);

    if (!dragState.moved) {
      updatePointer(event);
      const state = pickState();
      if (state) requestState(state);
    }

    hoverState = pickState();
    metrics.hover = hoverState;
    canvas.classList.toggle("is-hovering", Boolean(hoverState));
  }

  function animateGroup(group, t) {
    group.position.lerp(group.userData.targetPosition, 0.08);
    group.rotation.x += (group.userData.targetRotation.x - group.rotation.x) * 0.08;
    group.rotation.y += (group.userData.targetRotation.y - group.rotation.y) * 0.08;
    group.rotation.z += (group.userData.targetRotation.z - group.rotation.z) * 0.08;

    const scale = group.scale.x + (group.userData.targetScale - group.scale.x) * 0.08;
    group.scale.setScalar(scale);
    group.position.y += Math.sin(t * 1.15 + group.userData.floatOffset) * 0.0025;

    group.userData.materials.forEach((material) => {
      const targetOpacity = group.userData.targetOpacity;
      material.opacity += (targetOpacity - material.opacity) * 0.08;
    });
  }

  function render(time = 0) {
    frameId = null;
    const t = time * 0.001;
    metrics.frames += 1;

    dragState.rotationY += (dragState.targetY - dragState.rotationY) * 0.08;
    dragState.rotationX += (dragState.targetX - dragState.rotationX) * 0.08;

    world.rotation.y = dragState.rotationY + (reduceMotion ? 0 : Math.sin(t * 0.28) * 0.04);
    world.rotation.x = dragState.rotationX;
    centerOrb.rotation.y += reduceMotion ? 0 : 0.0048;
    centerOrb.rotation.x = Math.sin(t * 0.65) * 0.08;
    centerGlow.scale.setScalar(1 + Math.sin(t * 1.6) * 0.06);
    ringA.rotation.z += reduceMotion ? 0 : 0.003;
    ringB.rotation.y += reduceMotion ? 0 : 0.0022;
    dust.rotation.y += reduceMotion ? 0 : 0.0008;

    const accent = stateColors[activeState];
    ringA.material.color.lerp(accent, 0.08);
    ringB.material.color.lerp(accent, 0.04);
    tealLight.color.lerp(accent, 0.08);
    orangeLight.color.lerp(activeState === "automation" ? accent : stateColors.automation, 0.08);

    camera.position.x += (cameraTarget.x - camera.position.x) * 0.035;
    camera.position.y += (cameraTarget.y - camera.position.y) * 0.035;
    camera.lookAt(0, 0, 0);

    animateGroup(presenceGroup, t);
    animateGroup(automationGroup, t);
    animateGroup(pilotageGroup, t);

    automationGroup.userData.pulse.scale.setScalar(1 + Math.sin(t * 1.4) * 0.05);
    pilotageGroup.userData.bars.forEach((bar, index) => {
      const base = 0.92 + index * 0.04;
      const pulse = reduceMotion ? 0 : Math.sin(t * 1.4 + index * 0.6) * 0.05;
      bar.scale.y = base + pulse;
    });

    renderer.render(scene, camera);

    if (!metrics.ready) {
      metrics.ready = true;
      window.MBL_STAGE_THREE_READY = true;
      fallback?.classList.add("is-hidden");
      board.classList.add("is-stage-three-ready");
    }

    if (isVisible && !reduceMotion) {
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
    dustGeometry.dispose();
  }

  panel.addEventListener("mbl:stage-change", (event) => {
    if (!event.detail?.key) return;
    syncBoardState(event.detail.key);
  });

  setSize();
  syncBoardState(activeState);
  render(0);

  const resizeObserver = new ResizeObserver(setSize);
  resizeObserver.observe(board);
  window.addEventListener("resize", setSize, { passive: true });
  window.addEventListener("beforeunload", dispose);

  canvas.addEventListener("pointerdown", beginDrag);
  canvas.addEventListener("pointermove", moveDrag, { passive: true });
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  canvas.addEventListener("pointerleave", () => {
    if (!dragState.active) {
      hoverState = null;
      metrics.hover = null;
      canvas.classList.remove("is-hovering");
    }
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          start();
        } else {
          stop();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(board);
  } else {
    start();
  }

  if (reduceMotion) {
    renderer.render(scene, camera);
  }
}
