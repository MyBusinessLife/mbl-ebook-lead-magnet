import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js";

const canvas = document.getElementById("cyberGameCanvas");

if (canvas) {
  const arenaEl = document.querySelector("[data-cyber-game]");
  const statusEl = document.getElementById("cyberStatus");
  const promptEl = document.getElementById("cyberPrompt");
  const objectiveEl = document.getElementById("cyberObjective");
  const scoreEl = document.getElementById("cyberScore");
  const timerEl = document.getElementById("cyberTimer");
  const comboEl = document.getElementById("cyberCombo");
  const uptimeEl = document.getElementById("cyberUptime");
  const repairedEl = document.getElementById("cyberRepaired");
  const incidentsEl = document.getElementById("cyberIncidents");
  const bestComboEl = document.getElementById("cyberBestCombo");
  const threatEl = document.getElementById("cyberThreat");
  const targetEl = document.getElementById("cyberTarget");
  const targetDetailEl = document.getElementById("cyberTargetDetail");
  const repairFillEl = document.getElementById("cyberRepairFill");
  const incidentListEl = document.getElementById("cyberIncidentList");
  const feedEl = document.getElementById("cyberFeed");
  const introEl = document.getElementById("cyberIntro");
  const endcardEl = document.getElementById("cyberEndcard");
  const endTitleEl = document.getElementById("cyberEndTitle");
  const endSummaryEl = document.getElementById("cyberEndSummary");
  const actionButtons = document.querySelectorAll("[data-game-action]");
  const touchMoveButtons = document.querySelectorAll("[data-touch-move]");
  const touchRepairButton = document.querySelector("[data-touch-action='repair']");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchViewport = window.matchMedia("(pointer: coarse)").matches;
  const MISSION_DURATION = 75;
  const MAX_ACTIVE_INCIDENTS = isTouchViewport ? 3 : 4;
  const PLAYER_SPEED = 4.8;
  const PLAYER_ACCEL = 11.5;
  const REPAIR_RADIUS = 1.6;
  const REPAIR_RATE = 0.82;
  const INCIDENT_LABELS = [
    "Fibre optique instable",
    "Cluster IA en boucle",
    "Surchauffe alimentation",
    "Cache quantique saturé",
    "Latence coeur réseau",
    "Ventilation rack hors plage",
  ];

  const rackBlueprints = createRackBlueprints();
  const input = {
    up: false,
    down: false,
    left: false,
    right: false,
    repair: false,
  };
  const state = createInitialState();
  const view = createView();
  let previousTime = performance.now();
  let uiListStamp = 0;
  let scriptedElapsed = 0;

  window.MBL_CYBER_GAME = {
    state,
    restart: restartGame,
    start: startMission,
    pause: () => setPaused(true),
    resume: () => setPaused(false),
  };
  window.render_game_to_text = renderGameToText;
  window.advanceTime = advanceTime;

  bindEvents();
  restartGame();
  resizeRenderer();
  requestAnimationFrame(frame);

  function createInitialState() {
    return {
      missionDuration: MISSION_DURATION,
      timeRemaining: MISSION_DURATION,
      score: 0,
      combo: 1,
      bestCombo: 1,
      repaired: 0,
      uptime: 100,
      running: false,
      paused: false,
      gameOver: false,
      awaitingStart: true,
      targetId: null,
      nearestIncidentId: null,
      prompt: "Cliquez sur « Démarrer la mission », puis rejoignez le rack orange ou rouge indiqué.",
      objective: "Cliquez sur démarrer, allez au rack orange ou rouge, puis maintenez E pour le réparer.",
      status: "Tutoriel prêt. Lisez les 4 étapes puis démarrez la mission.",
      endTitle: "",
      endSummary: "",
      threat: "Faible",
      player: {
        x: 0,
        z: 3.4,
        vx: 0,
        vz: 0,
        facing: 0,
        bob: 0,
      },
      alarm: 0,
      spawnCooldown: 1.2,
      racks: rackBlueprints.map((blueprint, index) => ({
        ...blueprint,
        pulse: index * 0.43,
        severity: 0,
        incidentLevel: 0,
        repairProgress: 0,
        cooldown: 0,
        issue: "",
        state: "idle",
        overloadAnnounced: false,
      })),
      uiDirty: true,
      feed: [],
    };
  }

  function createRackBlueprints() {
    const racks = [];
    const zStart = -8.2;
    const zStep = 3.15;

    for (let lane = 0; lane < 6; lane += 1) {
      const z = zStart + lane * zStep;
      racks.push({
        id: `SRV-${lane + 1}A`,
        label: `SRV-${lane + 1}A`,
        side: "left",
        position: { x: -3.95, z },
        servicePoint: { x: -1.95, z },
      });
      racks.push({
        id: `SRV-${lane + 1}B`,
        label: `SRV-${lane + 1}B`,
        side: "right",
        position: { x: 3.95, z },
        servicePoint: { x: 1.95, z },
      });
    }

    return racks;
  }

  function createView() {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.34;
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x031019, 0.028);

    const camera = new THREE.PerspectiveCamera(64, 1, 0.1, 60);
    const world = new THREE.Group();
    scene.add(world);

    const glowTexture = createGlowTexture();
    const gridTexture = createGridTexture();

    const ambientLight = new THREE.AmbientLight(0xcdf4ff, 1.68);
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.18);
    const tealLight = new THREE.PointLight(0x1c8fa3, 14.5, 30, 2);
    const orangeLight = new THREE.PointLight(0xff6a2e, 11.6, 30, 2);
    const backLight = new THREE.PointLight(0x9beeff, 7.8, 24, 2);
    const aisleLight = new THREE.PointLight(0xb8f3ff, 7.2, 28, 2);
    keyLight.position.set(2.8, 7.8, 6.6);
    tealLight.position.set(-4.3, 4.1, 0.8);
    orangeLight.position.set(4.1, 4.2, -0.8);
    backLight.position.set(0, 5.1, -7.2);
    aisleLight.position.set(0, 2.8, 2.2);
    scene.add(ambientLight, keyLight, tealLight, orangeLight, backLight, aisleLight);

    const floorBase = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 24),
      new THREE.MeshStandardMaterial({
        color: 0x0b1b27,
        roughness: 0.72,
        metalness: 0.36,
        emissive: 0x0a1822,
        emissiveIntensity: 0.44,
      }),
    );
    floorBase.rotation.x = -Math.PI * 0.5;
    floorBase.receiveShadow = true;
    world.add(floorBase);

    const floorGrid = new THREE.Mesh(
      new THREE.PlaneGeometry(12.5, 22.5),
      new THREE.MeshBasicMaterial({
        map: gridTexture,
        transparent: true,
        opacity: 0.98,
        depthWrite: false,
      }),
    );
    floorGrid.rotation.x = -Math.PI * 0.5;
    floorGrid.position.y = 0.02;
    world.add(floorGrid);

    const floorStripMaterial = new THREE.MeshBasicMaterial({
      color: 0x1c8fa3,
      transparent: true,
      opacity: 0.88,
    });
    const floorAccentA = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 22), floorStripMaterial);
    floorAccentA.position.set(-1.9, 0.04, 0);
    const floorAccentB = floorAccentA.clone();
    floorAccentB.position.x = 1.9;
    world.add(floorAccentA, floorAccentB);

    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x102635,
      roughness: 0.48,
      metalness: 0.48,
      emissive: 0x0d2130,
      emissiveIntensity: 0.55,
    });
    const sideWallGeometry = new THREE.BoxGeometry(0.34, 4.6, 24);
    const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    leftWall.position.set(-5.45, 2.3, 0);
    const rightWall = leftWall.clone();
    rightWall.position.x = 5.45;
    world.add(leftWall, rightWall);

    const endWallGeometry = new THREE.BoxGeometry(11.6, 4.6, 0.3);
    const farWall = new THREE.Mesh(endWallGeometry, wallMaterial);
    farWall.position.set(0, 2.3, -11.6);
    const nearWall = farWall.clone();
    nearWall.position.z = 11.6;
    world.add(farWall, nearWall);

    const ceiling = new THREE.Mesh(
      new THREE.BoxGeometry(11.6, 0.24, 24),
      new THREE.MeshStandardMaterial({
        color: 0x08141d,
        roughness: 0.44,
        metalness: 0.36,
        emissive: 0x06131c,
        emissiveIntensity: 0.2,
      }),
    );
    ceiling.position.set(0, 4.48, 0);
    world.add(ceiling);

    for (const side of [-1, 1]) {
      for (let index = 0; index < 6; index += 1) {
        const accent = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 2.7, 0.12),
          new THREE.MeshBasicMaterial({
            color: index % 2 === 0 ? 0x1c8fa3 : 0xff6a2e,
            transparent: true,
            opacity: 0.78,
          }),
        );
        accent.position.set(side * 4.86, 2.02, -8.2 + index * 3.15);
        world.add(accent);
      }
    }

    const haloMaterial = new THREE.MeshBasicMaterial({
      color: 0x1c8fa3,
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const tealHalo = new THREE.Mesh(new THREE.PlaneGeometry(8.4, 4.8), haloMaterial);
    tealHalo.position.set(-0.8, 2.4, -6.8);
    world.add(tealHalo);

    const amberHalo = new THREE.Mesh(
      new THREE.PlaneGeometry(5.6, 3.4),
      new THREE.MeshBasicMaterial({
        color: 0xff6a2e,
        transparent: true,
        opacity: 0.08,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    amberHalo.position.set(1.8, 2.1, -0.8);
    world.add(amberHalo);

    const showcase = new THREE.Group();
    showcase.position.set(0.2, 0, -2.2);
    world.add(showcase);

    const showcaseBodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x173446,
      roughness: 0.22,
      metalness: 0.5,
      emissive: 0x0f3244,
      emissiveIntensity: 0.8,
    });

    const showcaseScreenMaterials = [0x1c8fa3, 0xff6a2e, 0x9beeff].map((color) =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.92,
      }),
    );

    [-1.15, 0, 1.15].forEach((x, index) => {
      const tower = new THREE.Mesh(new THREE.BoxGeometry(0.72, 2.4 + index * 0.22, 0.72), showcaseBodyMaterial);
      tower.position.set(x, 1.25 + index * 0.1, 0);
      showcase.add(tower);

      for (let band = 0; band < 4; band += 1) {
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.14, 0.76), showcaseScreenMaterials[(index + band) % showcaseScreenMaterials.length]);
        stripe.position.set(x, 0.55 + band * 0.42, 0.39);
        showcase.add(stripe);
      }
    });

    const showcaseRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.04, 10, 90),
      new THREE.MeshBasicMaterial({
        color: 0x1c8fa3,
        transparent: true,
        opacity: 0.34,
      }),
    );
    showcaseRing.rotation.x = Math.PI * 0.5;
    showcaseRing.position.y = 0.18;
    showcase.add(showcaseRing);

    for (let i = 0; i < 6; i += 1) {
      const z = -8.1 + i * 3.2;
      const lightBar = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.08, 0.22),
        new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? 0x1c8fa3 : 0xff6a2e,
          transparent: true,
          opacity: 0.62,
        }),
      );
      lightBar.position.set(0, 4.22, z);
      world.add(lightBar);
    }

    const rackRefs = new Map();
    state.racks.forEach((rack) => {
      const visual = createRackVisual(rack, glowTexture);
      rackRefs.set(rack.id, visual);
      world.add(visual.group);
    });

    const player = createPlayerVisual(glowTexture);
    world.add(player.group);

    const repairBeam = createRepairBeam();
    world.add(repairBeam);

    const targetMarker = createTargetMarker(glowTexture);
    world.add(targetMarker.group);

    const targetGuide = createTargetGuide();
    world.add(targetGuide);

    const ambientParticles = createAmbientParticles(glowTexture, reduceMotion ? 70 : 130);
    world.add(ambientParticles.points);

    const sparkField = createSparkField(glowTexture, reduceMotion ? 48 : 96);
    world.add(sparkField.points);

    return {
      renderer,
      scene,
      camera,
      world,
      rackRefs,
      player,
      repairBeam,
      targetMarker,
      targetGuide,
      ambientParticles,
      sparkField,
    };
  }

  function createGlowTexture() {
    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 128;
    textureCanvas.height = 128;
    const context = textureCanvas.getContext("2d");

    if (!context) {
      return null;
    }

    const gradient = context.createRadialGradient(64, 64, 8, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.35, "rgba(255,255,255,0.52)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  function createGridTexture() {
    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 512;
    textureCanvas.height = 512;
    const context = textureCanvas.getContext("2d");

    if (!context) {
      return null;
    }

    context.fillStyle = "#07131c";
    context.fillRect(0, 0, 512, 512);

    context.strokeStyle = "rgba(28, 143, 163, 0.32)";
    context.lineWidth = 2;
    for (let x = 0; x <= 512; x += 64) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, 512);
      context.stroke();
    }

    for (let y = 0; y <= 512; y += 64) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(512, y);
      context.stroke();
    }

    context.strokeStyle = "rgba(255, 106, 46, 0.16)";
    context.lineWidth = 1;
    for (let x = 0; x <= 512; x += 32) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, 512);
      context.stroke();
    }

    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1.1, 2.2);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  function createRackVisual(rack, glowTexture) {
    const group = new THREE.Group();
    group.position.set(rack.position.x, 1.42, rack.position.z);
    group.rotation.y = rack.side === "left" ? Math.PI * 0.5 : -Math.PI * 0.5;

    const shellMaterial = new THREE.MeshStandardMaterial({
      color: 0x163242,
      roughness: 0.32,
      metalness: 0.7,
      emissive: 0x10374b,
      emissiveIntensity: 0.58,
    });
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.38, 2.84, 1.26), shellMaterial);
    group.add(body);

    const bezel = new THREE.Mesh(
      new THREE.BoxGeometry(1.08, 2.44, 0.08),
      new THREE.MeshStandardMaterial({
        color: 0x10212d,
        roughness: 0.18,
        metalness: 0.44,
        emissive: 0x0c2230,
        emissiveIntensity: 0.32,
      }),
    );
    bezel.position.z = 0.67;
    group.add(bezel);

    const screenMaterials = [];
    for (let index = 0; index < 5; index += 1) {
      const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x1c465c,
        roughness: 0.16,
        metalness: 0.36,
        emissive: 0x1c8fa3,
        emissiveIntensity: 0.84,
      });
      const screen = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.18, 0.05), screenMaterial);
      screen.position.set(0, 0.78 - index * 0.42, 0.74);
      group.add(screen);
      screenMaterials.push(screenMaterial);
    }

    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6a2e,
      roughness: 0.18,
      metalness: 0.44,
      emissive: 0xff6a2e,
      emissiveIntensity: 0.42,
    });
    const accentBar = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.08, 0.05), accentMaterial);
    accentBar.position.set(0, -1.02, 0.74);
    group.add(accentBar);

    const padMaterial = new THREE.MeshBasicMaterial({
      color: 0x1c8fa3,
      transparent: true,
      opacity: 0.26,
      depthWrite: false,
    });
    const servicePad = new THREE.Mesh(new THREE.PlaneGeometry(1.46, 1.46), padMaterial);
    servicePad.position.set(0, -1.4, 1.85);
    servicePad.rotation.x = -Math.PI * 0.5;
    group.add(servicePad);

    const beaconMaterial = new THREE.SpriteMaterial({
      map: glowTexture,
      color: 0x1c8fa3,
      transparent: true,
      opacity: 0.34,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const beacon = new THREE.Sprite(beaconMaterial);
    beacon.position.set(0, 1.96, 0.1);
    beacon.scale.set(1.9, 1.9, 1.9);
    group.add(beacon);

    const rackLight = new THREE.PointLight(0x1c8fa3, 1.15, 4.4, 2);
    rackLight.position.set(0, 0.42, 0.88);
    group.add(rackLight);

    return {
      group,
      shellMaterial,
      screenMaterials,
      accentMaterial,
      servicePad,
      padMaterial,
      beacon,
      beaconMaterial,
      rackLight,
    };
  }

  function createPlayerVisual(glowTexture) {
    const group = new THREE.Group();

    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x163447,
      roughness: 0.28,
      metalness: 0.34,
      emissive: 0x1c8fa3,
      emissiveIntensity: 0.32,
    });
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6a2e,
      roughness: 0.18,
      metalness: 0.42,
      emissive: 0xff6a2e,
      emissiveIntensity: 0.36,
    });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.9, 0.34), bodyMaterial);
    torso.position.y = 1.08;
    group.add(torso);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.21, 18, 18),
      new THREE.MeshStandardMaterial({
        color: 0xbbe8f4,
        roughness: 0.24,
        metalness: 0.18,
        emissive: 0x1c8fa3,
        emissiveIntensity: 0.18,
      }),
    );
    head.position.y = 1.74;
    group.add(head);

    const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.62, 0.2), accentMaterial);
    backpack.position.set(0, 1.08, -0.28);
    group.add(backpack);

    const toolArm = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.62), accentMaterial);
    toolArm.position.set(0.28, 1.06, 0.08);
    toolArm.rotation.x = Math.PI * 0.12;
    group.add(toolArm);

    const legA = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.72, 0.16), bodyMaterial);
    legA.position.set(-0.12, 0.38, 0);
    const legB = legA.clone();
    legB.position.x = 0.12;
    group.add(legA, legB);

    const groundRing = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture,
        color: 0x9beeff,
        transparent: true,
        opacity: 0.32,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    groundRing.position.y = 0.08;
    groundRing.scale.set(1.6, 1.6, 1.6);
    group.add(groundRing);

    return {
      group,
      torso,
      toolArm,
      accentMaterial,
      groundRing,
    };
  }

  function createRepairBeam() {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, 0], 3));

    const material = new THREE.LineBasicMaterial({
      color: 0xffb891,
      transparent: true,
      opacity: 0.9,
    });

    const line = new THREE.Line(geometry, material);
    line.visible = false;
    return line;
  }

  function createTargetGuide() {
    const guidePoints = 7;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(guidePoints * 3), 3));

    const material = new THREE.LineBasicMaterial({
      color: 0x9beeff,
      transparent: true,
      opacity: 0.78,
    });

    const line = new THREE.Line(geometry, material);
    line.visible = false;
    return line;
  }

  function createTargetMarker(glowTexture) {
    const group = new THREE.Group();

    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 3.5, 20, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0xff8a52,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    beam.position.y = 1.7;
    group.add(beam);

    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(0.28, 0.62, 18),
      new THREE.MeshBasicMaterial({
        color: 0xff8a52,
        transparent: true,
        opacity: 0.96,
      }),
    );
    cone.rotation.z = Math.PI;
    cone.position.y = 3.56;
    group.add(cone);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.035, 10, 40),
      new THREE.MeshBasicMaterial({
        color: 0x9beeff,
        transparent: true,
        opacity: 0.72,
      }),
    );
    ring.rotation.x = Math.PI * 0.5;
    ring.position.y = 0.08;
    group.add(ring);

    const outerRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.78, 0.04, 12, 48),
      new THREE.MeshBasicMaterial({
        color: 0xff6a2e,
        transparent: true,
        opacity: 0.42,
      }),
    );
    outerRing.rotation.x = Math.PI * 0.5;
    outerRing.position.y = 0.04;
    group.add(outerRing);

    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture,
        color: 0xff6a2e,
        transparent: true,
        opacity: 0.34,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    glow.position.y = 1.8;
    glow.scale.set(2.1, 4.2, 2.1);
    group.add(glow);

    group.visible = false;
    return { group, beam, cone, ring, outerRing, glow };
  }

  function createAmbientParticles(glowTexture, count) {
    const positions = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let index = 0; index < count; index += 1) {
      const x = randomBetween(-5.4, 5.4);
      const y = randomBetween(0.6, 4.2);
      const z = randomBetween(-10.8, 10.8);
      positions[index * 3] = x;
      positions[index * 3 + 1] = y;
      positions[index * 3 + 2] = z;
      base[index * 3] = x;
      base[index * 3 + 1] = y;
      base[index * 3 + 2] = z;
      speeds[index] = 0.4 + Math.random() * 1.2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      map: glowTexture,
      color: 0x9beeff,
      size: 0.12,
      transparent: true,
      opacity: 0.54,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return {
      points: new THREE.Points(geometry, material),
      positions,
      base,
      speeds,
    };
  }

  function createSparkField(glowTexture, count) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setDrawRange(0, 0);

    const material = new THREE.PointsMaterial({
      map: glowTexture,
      size: 0.18,
      transparent: true,
      opacity: 0.92,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return {
      points: new THREE.Points(geometry, material),
      positions,
      colors,
      max: count,
    };
  }

  function bindEvents() {
    actionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.gameAction === "start") {
          startMission();
          return;
        }

        if (button.dataset.gameAction === "restart") {
          restartGame();
          return;
        }

        if (button.dataset.gameAction === "pause") {
          if (state.awaitingStart) {
            setStatus("Lisez le tutoriel puis cliquez sur « Démarrer la mission ».");
            state.uiDirty = true;
            return;
          }
          setPaused(!state.paused);
        }
      });
    });

    window.addEventListener("keydown", (event) => handleKey(event, true));
    window.addEventListener("keyup", (event) => handleKey(event, false));

    touchMoveButtons.forEach((button) => {
      const direction = button.dataset.touchMove;
      if (!direction) return;
      bindTouchButton(button, () => setTouchDirection(direction, true), () => setTouchDirection(direction, false));
    });

    if (touchRepairButton) {
      bindTouchButton(
        touchRepairButton,
        () => {
          input.repair = true;
        },
        () => {
          input.repair = false;
        },
      );
    }

    window.addEventListener("resize", resizeRenderer);

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(resizeRenderer);
      observer.observe(canvas);
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden && state.running && !state.gameOver) {
        setPaused(true);
      }
    });

    canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      setStatus("Le contexte WebGL a ete perdu. Rechargez la page pour relancer la mission.");
      state.paused = true;
      state.running = false;
      state.uiDirty = true;
    });
  }

  function bindTouchButton(button, onPress, onRelease) {
    const release = () => {
      button.classList.remove("is-pressed");
      onRelease();
    };

    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      button.classList.add("is-pressed");
      onPress();
    });
    button.addEventListener("pointerup", release);
    button.addEventListener("pointerleave", release);
    button.addEventListener("pointercancel", release);
  }

  function setTouchDirection(direction, value) {
    if (direction === "up") input.up = value;
    if (direction === "down") input.down = value;
    if (direction === "left") input.left = value;
    if (direction === "right") input.right = value;
  }

  function handleKey(event, isPressed) {
    const code = event.code;
    const isMovementKey =
      code === "ArrowUp" ||
      code === "ArrowDown" ||
      code === "ArrowLeft" ||
      code === "ArrowRight" ||
      code === "KeyW" ||
      code === "KeyA" ||
      code === "KeyS" ||
      code === "KeyD" ||
      code === "KeyZ" ||
      code === "KeyQ" ||
      code === "Space" ||
      code === "KeyE";

    if (isMovementKey) {
      event.preventDefault();
    }

    if (code === "ArrowUp" || code === "KeyW" || code === "KeyZ") input.up = isPressed;
    if (code === "ArrowDown" || code === "KeyS") input.down = isPressed;
    if (code === "ArrowLeft" || code === "KeyA" || code === "KeyQ") input.left = isPressed;
    if (code === "ArrowRight" || code === "KeyD") input.right = isPressed;
    if (code === "Space" || code === "KeyE") input.repair = isPressed;

    if (isPressed && code === "Enter" && state.awaitingStart) {
      startMission();
    }

    if (isPressed && code === "KeyP") {
      setPaused(!state.paused);
    }

    if (isPressed && code === "KeyR") {
      restartGame();
    }
  }

  function restartGame() {
    const nextState = createInitialState();
    Object.assign(state, nextState);
    scriptedElapsed = 0;
    state.racks.forEach((rack) => resetRack(rack));
    setPaused(false, false);
    state.running = false;
    spawnIncident(true);
    pushFeed("Console MBL : mission prête, premier rack en surveillance.");
    setStatus("Tutoriel prêt. Démarrez la mission puis suivez le rack en alerte.");
    updateIntroOverlay(true);
    updateEndcard(false);
    state.uiDirty = true;
  }

  function startMission() {
    if (!state.awaitingStart || state.gameOver) return;
    state.awaitingStart = false;
    state.running = true;
    state.prompt = currentPrompt();
    state.objective = "Tenez 75 secondes au-dessus de 82% d'uptime.";
    pushFeed("Console MBL : intervention engagée, uptime sous surveillance.");
    setStatus("Mission démarrée. Stabilisez le datacenter.");
    updateIntroOverlay(false);
    state.uiDirty = true;
  }

  function updateIntroOverlay(visible) {
    if (!introEl) return;
    introEl.hidden = !visible;
  }

  function resetRack(rack) {
    rack.severity = 0;
    rack.incidentLevel = 0;
    rack.repairProgress = 0;
    rack.cooldown = 0;
    rack.issue = "";
    rack.state = "idle";
    rack.overloadAnnounced = false;
  }

  function setPaused(nextPaused, markStatus = true) {
    if (state.awaitingStart) {
      updateEndcard(false);
      return;
    }

    state.paused = Boolean(nextPaused) && !state.gameOver;
    state.running = !state.paused;

    const pauseButtons = document.querySelectorAll("[data-game-action='pause']");
    pauseButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(state.paused));
      button.textContent = state.paused ? "Reprendre" : "Pause";
    });

    if (state.paused) {
      state.prompt = "Mission en pause. Reprenez quand vous êtes prêt.";
      if (markStatus) setStatus("Mission mise en pause.");
      state.endTitle = "Mission en pause";
      state.endSummary = "Les systèmes sont figés jusqu'à la reprise.";
      updateEndcard(true);
    } else if (!state.gameOver) {
      state.prompt = currentPrompt();
      if (markStatus) setStatus("Mission reprise.");
      updateEndcard(false);
    }

    state.uiDirty = true;
  }

  function endMission(title, summary, statusMessage) {
    state.gameOver = true;
    state.paused = false;
    state.running = false;
    state.endTitle = title;
    state.endSummary = summary;
    state.prompt = summary;
    setStatus(statusMessage);
    updateEndcard(true);
    state.uiDirty = true;
  }

  function updateEndcard(visible) {
    if (!endcardEl) return;
    endcardEl.hidden = !visible;
    if (endTitleEl) endTitleEl.textContent = state.endTitle || "Mission terminée";
    if (endSummaryEl) endSummaryEl.textContent = state.endSummary || "Relancez une intervention pour repartir.";
  }

  function frame(now) {
    const delta = Math.min((now - previousTime) / 1000, 0.05);
    previousTime = now;

    resizeRenderer();
    updateSimulation(delta, now / 1000);
    renderScene(now / 1000);
    renderUi(now);

    requestAnimationFrame(frame);
  }

  function advanceTime(ms) {
    const step = 1000 / 60;
    const steps = Math.max(1, Math.round(ms / step));

    for (let index = 0; index < steps; index += 1) {
      scriptedElapsed += step / 1000;
      updateSimulation(step / 1000, scriptedElapsed);
    }

    renderScene(scriptedElapsed);
    renderUi(performance.now());
  }

  function updateSimulation(delta, elapsed) {
    updatePlayer(delta);
    updateNearestTarget();

    if (state.awaitingStart) {
      state.prompt = "Cliquez sur « Démarrer la mission », puis rejoignez le rack orange ou rouge indiqué.";
      return;
    }

    if (state.paused || state.gameOver) {
      state.prompt = state.gameOver ? state.endSummary : "Mission en pause. Reprenez quand vous êtes prêt.";
      return;
    }

    state.timeRemaining = Math.max(0, state.timeRemaining - delta);

    if (state.timeRemaining <= 0) {
      const summary = `Score ${Math.round(state.score)} · ${state.repaired} racks stabilisés · uptime final ${Math.round(state.uptime)}%.`;
      endMission("Fin de mission", summary, "Temps écoulé. Mission terminée.");
      return;
    }

    updateIncidents(delta);

    state.spawnCooldown -= delta;
    if (state.spawnCooldown <= 0) {
      spawnIncident(false);
    }

    const activeRacks = state.racks.filter((rack) => rack.state !== "idle");
    const criticalCount = activeRacks.filter((rack) => rack.state === "critical").length;
    const alarmTarget = Math.min(1, activeRacks.length * 0.16 + criticalCount * 0.24 + (100 - state.uptime) * 0.0065);
    state.alarm += (alarmTarget - state.alarm) * Math.min(1, delta * 4);

    if (state.uptime <= 0) {
      state.uptime = 0;
      const summary = `Le datacenter a lâché après ${state.repaired} réparations. Meilleure série ${state.bestCombo}.`;
      endMission("Panne générale", summary, "Uptime critique. Le datacenter est tombé.");
      return;
    }

    state.prompt = currentPrompt();
    state.uiDirty = true;
  }

  function updatePlayer(delta) {
    const horizontal = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    const vertical = (input.down ? 1 : 0) - (input.up ? 1 : 0);
    const direction = new THREE.Vector2(horizontal, vertical);

    if (direction.lengthSq() > 1) {
      direction.normalize();
    }

    const targetVx = direction.x * PLAYER_SPEED;
    const targetVz = direction.y * PLAYER_SPEED;
    const accel = Math.min(1, delta * PLAYER_ACCEL);

    state.player.vx += (targetVx - state.player.vx) * accel;
    state.player.vz += (targetVz - state.player.vz) * accel;
    state.player.x = clamp(state.player.x + state.player.vx * delta, -2.75, 2.75);
    state.player.z = clamp(state.player.z + state.player.vz * delta, -9.4, 9.4);

    if (direction.lengthSq() > 0.001) {
      state.player.facing = Math.atan2(direction.x, direction.y);
    }

    state.player.bob += Math.hypot(state.player.vx, state.player.vz) * delta * 1.6;
  }

  function updateNearestTarget() {
    let nearestActive = null;
    let nearestActiveDistance = Infinity;
    let repairTarget = null;
    let repairDistance = Infinity;

    state.racks.forEach((rack) => {
      if (rack.state === "idle") return;
      const distance = distanceToServicePoint(rack);
      if (distance < nearestActiveDistance) {
        nearestActiveDistance = distance;
        nearestActive = rack;
      }
      if (distance <= REPAIR_RADIUS && distance < repairDistance) {
        repairDistance = distance;
        repairTarget = rack;
      }
    });

    state.targetId = repairTarget?.id ?? null;
    state.nearestIncidentId = nearestActive?.id ?? null;
  }

  function updateIncidents(delta) {
    let activeCount = 0;
    let criticalCount = 0;
    let repairingRack = state.targetId ? rackById(state.targetId) : null;

    state.racks.forEach((rack) => {
      if (rack.state === "idle") {
        rack.repairProgress = 0;
        rack.cooldown = Math.max(0, rack.cooldown - delta);
        return;
      }

      activeCount += 1;

      const nearAndRepairing = repairingRack?.id === rack.id && input.repair;
      if (nearAndRepairing) {
        rack.state = "repairing";
        rack.repairProgress = clamp(
          rack.repairProgress + delta * REPAIR_RATE * (1 + (state.combo - 1) * 0.08),
          0,
          1,
        );
      } else {
        rack.repairProgress = Math.max(0, rack.repairProgress - delta * 0.22);
      }

      const escalation = delta * (0.11 + rack.severity * 0.028);
      rack.incidentLevel = clamp(rack.incidentLevel + escalation, 0, 1);
      if (rack.incidentLevel >= 0.62 && rack.state !== "repairing") {
        rack.state = "critical";
      } else if (rack.state !== "repairing") {
        rack.state = "warning";
      }

      const drain = rack.state === "critical" ? 0.62 + rack.severity * 0.18 : 0.22 + rack.severity * 0.08;
      state.uptime = Math.max(0, state.uptime - drain * delta);

      if (rack.state === "critical") {
        criticalCount += 1;
        if (rack.incidentLevel >= 1 && !rack.overloadAnnounced) {
          rack.overloadAnnounced = true;
          state.combo = 1;
          pushFeed(`${rack.label} est passe en surcharge critique.`);
          setStatus(`${rack.label} est au bord de la panne. Priorite absolue.`);
        }
      }

      if (rack.repairProgress >= 1) {
        completeRepair(rack);
      }
    });

    if (activeCount === 0 && state.timeRemaining > 0) {
      state.objective = "Balayez l'allée et anticipez le prochain incident.";
    } else {
      state.objective = criticalCount > 0
        ? "Priorité aux racks critiques : stabilisez-les avant l'effondrement."
        : "Maintenez l'uptime et préparez le prochain couloir de service.";
    }

    state.threat = currentThreatLevel(activeCount, criticalCount);
  }

  function spawnIncident(force) {
    const activeCount = state.racks.filter((rack) => rack.state !== "idle").length;
    if (!force && activeCount >= MAX_ACTIVE_INCIDENTS) {
      state.spawnCooldown = randomBetween(0.9, 1.6);
      return;
    }

    let candidates = state.racks.filter((rack) => rack.state === "idle" && rack.cooldown <= 0);
    if (!candidates.length) {
      state.spawnCooldown = randomBetween(0.8, 1.5);
      return;
    }

    if (force) {
      const centerCandidates = candidates.filter((rack) => Math.abs(rack.position.z) <= 3.5);
      if (centerCandidates.length) {
        candidates = centerCandidates;
      }
    }

    const rack = candidates[Math.floor(Math.random() * candidates.length)];
    const pressure = 1 - state.timeRemaining / MISSION_DURATION;
    const roll = Math.random();
    const severity = roll > 0.8 - pressure * 0.18 ? 3 : roll > 0.42 ? 2 : 1;

    rack.severity = severity;
    rack.incidentLevel = severity === 3 ? 0.64 : 0.24 + Math.random() * 0.16;
    rack.repairProgress = 0;
    rack.issue = INCIDENT_LABELS[Math.floor(Math.random() * INCIDENT_LABELS.length)];
    rack.state = rack.incidentLevel >= 0.62 ? "critical" : "warning";
    rack.overloadAnnounced = false;
    rack.cooldown = 0;

    const label = rack.state === "critical" ? "critique" : "alerte";
    pushFeed(`${rack.label} en ${label} · ${rack.issue}.`);
    setStatus(`Incident détecté sur ${rack.label}. ${rack.issue}.`);

    const cadenceBase = 3.2 - pressure * 1.15;
    state.spawnCooldown = randomBetween(Math.max(1.35, cadenceBase), Math.max(1.8, cadenceBase + 1.3));
    state.uiDirty = true;
  }

  function completeRepair(rack) {
    const scoreGain = Math.round(140 + rack.severity * 32 + (state.combo - 1) * 34 + state.uptime * 0.35);
    state.score += scoreGain;
    state.repaired += 1;
    state.combo = Math.min(9, state.combo + 1);
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    state.uptime = Math.min(100, state.uptime + 2.4 + rack.severity * 0.7);

    pushFeed(`${rack.label} stabilisé +${scoreGain} points.`);
    setStatus(`${rack.label} réparé. Uptime sécurisé.`);

    rack.severity = 0;
    rack.incidentLevel = 0;
    rack.repairProgress = 0;
    rack.cooldown = randomBetween(2.2, 4.8);
    rack.issue = "";
    rack.state = "idle";
    rack.overloadAnnounced = false;
    state.uiDirty = true;
  }

  function renderScene(elapsed) {
    updateCamera(elapsed);
    updatePlayerVisual(elapsed);
    updateRackVisuals(elapsed);
    updateAmbientParticles(elapsed);
    updateSparkField(elapsed);
    updateRepairBeam();
    updateTargetGuide(elapsed);
    updateTargetMarker(elapsed);
    view.renderer.render(view.scene, view.camera);
  }

  function updateCamera(elapsed) {
    const aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);
    const baseX = aspect < 1 ? 1.15 : 1.75;
    const baseHeight = aspect < 1 ? 4.15 : 3.75;
    const baseDistance = aspect < 1 ? 7.9 : 6.8;
    const sway = reduceMotion ? 0 : Math.sin(elapsed * 0.75) * 0.08;
    const shake = reduceMotion ? 0 : state.alarm * 0.06 * Math.sin(elapsed * 9);
    const targetX = clamp(baseX + state.player.x * 0.24 + sway, -1.8, 2.4);
    const targetY = Math.min(4.18, baseHeight + state.alarm * 0.18);
    const targetZ = clamp(state.player.z + baseDistance + shake, -2.8, 9.3);

    view.camera.position.x += (targetX - view.camera.position.x) * 0.08;
    view.camera.position.y += (targetY - view.camera.position.y) * 0.08;
    view.camera.position.z += (targetZ - view.camera.position.z) * 0.08;
    view.camera.lookAt(
      clamp(state.player.x * 0.32 - 0.08, -1.5, 1.5),
      1.52,
      clamp(state.player.z - 2.4, -8.4, 6.6),
    );
  }

  function updatePlayerVisual(elapsed) {
    const bob = Math.sin(state.player.bob * 2.2) * 0.06;
    view.player.group.position.set(state.player.x, bob, state.player.z);
    view.player.group.rotation.y = state.player.facing;
    view.player.torso.position.y = 1.08 + bob * 0.22;
    view.player.toolArm.rotation.z = input.repair ? Math.sin(elapsed * 18) * 0.12 : 0;
    view.player.accentMaterial.emissiveIntensity = input.repair ? 0.68 : 0.36;
    view.player.groundRing.material.opacity = 0.26 + state.alarm * 0.22;
    view.player.groundRing.scale.setScalar(1.45 + Math.sin(elapsed * 5) * 0.05 + state.alarm * 0.16);
  }

  function updateRackVisuals(elapsed) {
    state.racks.forEach((rack) => {
      const ref = view.rackRefs.get(rack.id);
      if (!ref) return;

      let lightColor = 0x1c8fa3;
      let emissiveIntensity = 0.52;
      let accentIntensity = 0.3;
      let padOpacity = 0.28;
      let beaconOpacity = 0.3;

      if (rack.state === "warning") {
        lightColor = 0xff8a52;
        emissiveIntensity = 0.52 + Math.sin(elapsed * 6 + rack.pulse) * 0.12;
        accentIntensity = 0.52;
        padOpacity = 0.44;
        beaconOpacity = 0.38;
      }

      if (rack.state === "critical") {
        lightColor = 0xff6a2e;
        emissiveIntensity = 0.7 + Math.sin(elapsed * 10 + rack.pulse) * 0.2;
        accentIntensity = 0.72;
        padOpacity = 0.58;
        beaconOpacity = 0.54;
      }

      if (rack.state === "repairing") {
        lightColor = 0x9beeff;
        emissiveIntensity = 0.76 + Math.sin(elapsed * 18 + rack.pulse) * 0.16;
        accentIntensity = 0.58;
        padOpacity = 0.68;
        beaconOpacity = 0.6;
      }

      ref.shellMaterial.emissive.setHex(lightColor);
      ref.shellMaterial.emissiveIntensity = emissiveIntensity * 0.36;
      ref.accentMaterial.emissive.setHex(lightColor);
      ref.accentMaterial.emissiveIntensity = accentIntensity;
      ref.padMaterial.color.setHex(lightColor);
      ref.padMaterial.opacity = padOpacity;
      ref.beaconMaterial.color.setHex(lightColor);
      ref.beaconMaterial.opacity = beaconOpacity;
      ref.beacon.scale.setScalar(1.1 + rack.incidentLevel * 0.9 + Math.sin(elapsed * 8 + rack.pulse) * 0.08);
      ref.rackLight.color.setHex(lightColor);
      ref.rackLight.intensity = 1.2 + rack.incidentLevel * 3;
      ref.group.position.y = 1.42 + Math.sin(elapsed * 3 + rack.pulse) * 0.02 * (rack.state === "idle" ? 0.4 : 1);

      ref.screenMaterials.forEach((screenMaterial, index) => {
        const bandPulse = Math.sin(elapsed * (index + 2) * 0.8 + rack.pulse) * 0.04;
        screenMaterial.color.setHex(rack.state === "idle" ? 0x143447 : lightColor);
        screenMaterial.emissive.setHex(lightColor);
        screenMaterial.emissiveIntensity = emissiveIntensity * 0.65 + bandPulse;
      });
    });
  }

  function updateAmbientParticles(elapsed) {
    const attribute = view.ambientParticles.points.geometry.getAttribute("position");
    for (let index = 0; index < view.ambientParticles.speeds.length; index += 1) {
      const speed = view.ambientParticles.speeds[index];
      const baseX = view.ambientParticles.base[index * 3];
      const baseY = view.ambientParticles.base[index * 3 + 1];
      const baseZ = view.ambientParticles.base[index * 3 + 2];
      view.ambientParticles.positions[index * 3] = baseX + Math.sin(elapsed * speed + index * 0.33) * 0.08;
      view.ambientParticles.positions[index * 3 + 1] = baseY + Math.cos(elapsed * speed * 0.8 + index * 0.27) * 0.12;
      view.ambientParticles.positions[index * 3 + 2] = baseZ + Math.sin(elapsed * speed * 0.4 + index * 0.11) * 0.18;
    }
    attribute.needsUpdate = true;
  }

  function updateSparkField(elapsed) {
    let cursor = 0;
    const activeRacks = state.racks.filter((rack) => rack.state !== "idle");
    const perRack = reduceMotion ? 8 : 12;

    activeRacks.forEach((rack, rackIndex) => {
      for (let index = 0; index < perRack && cursor < view.sparkField.max; index += 1) {
        const t = elapsed * (1.6 + rack.severity * 0.24) + index * 0.31 + rackIndex * 0.18;
        const radius = 0.18 + (index % 4) * 0.05;
        const height = 0.5 + ((t * 1.35) % 1) * 2.2;
        const x = rack.position.x + Math.cos(t * 7.2) * radius;
        const y = height;
        const z = rack.position.z + Math.sin(t * 5.2) * radius;
        const positionIndex = cursor * 3;
        view.sparkField.positions[positionIndex] = x;
        view.sparkField.positions[positionIndex + 1] = y;
        view.sparkField.positions[positionIndex + 2] = z;

        const critical = rack.state === "critical";
        view.sparkField.colors[positionIndex] = critical ? 1 : 0.6;
        view.sparkField.colors[positionIndex + 1] = critical ? 0.5 : 0.92;
        view.sparkField.colors[positionIndex + 2] = critical ? 0.18 : 1;
        cursor += 1;
      }
    });

    view.sparkField.points.geometry.setDrawRange(0, cursor);
    view.sparkField.points.geometry.getAttribute("position").needsUpdate = true;
    view.sparkField.points.geometry.getAttribute("color").needsUpdate = true;
  }

  function updateRepairBeam() {
    const target = state.targetId ? rackById(state.targetId) : null;
    const shouldShow = Boolean(target && input.repair && !state.paused && !state.gameOver);
    view.repairBeam.visible = shouldShow;

    if (!shouldShow || !target) {
      return;
    }

    const positions = view.repairBeam.geometry.getAttribute("position");
    positions.setXYZ(0, state.player.x + 0.28, 1.1, state.player.z + 0.08);
    positions.setXYZ(1, target.servicePoint.x, 1.24, target.servicePoint.z);
    positions.needsUpdate = true;
  }

  function updateTargetGuide(elapsed) {
    const highlightRack = rackById(state.targetId || state.nearestIncidentId);
    const shouldShow = Boolean(highlightRack && !state.gameOver && !state.paused);
    view.targetGuide.visible = shouldShow;

    if (!shouldShow || !highlightRack) {
      return;
    }

    const positions = view.targetGuide.geometry.getAttribute("position");
    const startX = state.player.x;
    const startZ = state.player.z;
    const endX = highlightRack.servicePoint.x;
    const endZ = highlightRack.servicePoint.z;

    for (let index = 0; index < positions.count; index += 1) {
      const t = positions.count === 1 ? 1 : index / (positions.count - 1);
      const lift = Math.sin(t * Math.PI) * 0.08;
      positions.setXYZ(
        index,
        THREE.MathUtils.lerp(startX, endX, t),
        0.08 + lift + Math.sin(elapsed * 6 + index * 0.7) * 0.01,
        THREE.MathUtils.lerp(startZ, endZ, t),
      );
    }

    positions.needsUpdate = true;
    view.targetGuide.material.opacity = state.targetId ? 0.96 : 0.72;
  }

  function updateTargetMarker(elapsed) {
    const highlightRack = rackById(state.targetId || state.nearestIncidentId);
    const shouldShow = Boolean(highlightRack && !state.gameOver);
    view.targetMarker.group.visible = shouldShow;

    if (!shouldShow || !highlightRack) {
      return;
    }

    const markerColor =
      highlightRack.state === "critical" ? 0xff5e5e : highlightRack.state === "repairing" ? 0x9beeff : 0xff8a52;
    const markerGlowColor = highlightRack.state === "repairing" ? 0x9beeff : 0xff6a2e;
    const pulse = 1 + Math.sin(elapsed * 5.4) * 0.08;

    view.targetMarker.group.position.set(
      highlightRack.servicePoint.x,
      Math.sin(elapsed * 4.8) * 0.03,
      highlightRack.servicePoint.z,
    );
    view.targetMarker.group.rotation.y = elapsed * 1.2;
    view.targetMarker.cone.material.color.setHex(markerColor);
    view.targetMarker.beam.material.color.setHex(markerColor);
    view.targetMarker.ring.material.color.setHex(markerGlowColor);
    view.targetMarker.outerRing.material.color.setHex(markerColor);
    view.targetMarker.glow.material.color.setHex(markerGlowColor);
    view.targetMarker.glow.material.opacity = highlightRack.state === "repairing" ? 0.5 : 0.38;
    view.targetMarker.beam.material.opacity = highlightRack.state === "critical" ? 0.28 : 0.18;
    view.targetMarker.ring.scale.setScalar(1.05 + Math.sin(elapsed * 6.8) * 0.05);
    view.targetMarker.outerRing.scale.setScalar(pulse);
  }

  function renderUi(now) {
    if (!state.uiDirty && now - uiListStamp < 180) {
      return;
    }

    const activeCount = state.racks.filter((rack) => rack.state !== "idle").length;
    const targetRack = state.targetId ? rackById(state.targetId) : null;
    const nearestRack = state.nearestIncidentId ? rackById(state.nearestIncidentId) : null;

    setText(objectiveEl, state.objective);
    setText(scoreEl, String(Math.round(state.score)));
    setText(timerEl, `${Math.ceil(state.timeRemaining)}s`);
    setText(comboEl, `x${state.combo}`);
    setText(uptimeEl, `${Math.round(state.uptime)}%`);
    setText(repairedEl, String(state.repaired));
    setText(incidentsEl, String(activeCount));
    setText(bestComboEl, `x${state.bestCombo}`);
    setText(threatEl, state.threat);
    setText(promptEl, state.prompt);
    setText(targetEl, targetRack ? targetRack.label : nearestRack ? nearestRack.label : "Aucune alerte active");
    setText(
      targetDetailEl,
      state.awaitingStart && nearestRack
        ? `Rejoignez le halo lumineux devant ${nearestRack.label}, puis maintenez E pour réparer.`
        : targetRack
        ? `${targetRack.issue} · Maintenez la réparation jusqu'à 100%.`
        : nearestRack
          ? `${nearestRack.issue} · Rejoignez le halo lumineux devant ce rack pour le stabiliser.`
          : "Restez mobile dans l'allée centrale pour couvrir les deux rangées.",
    );
    setText(statusEl, state.status);

    if (repairFillEl) {
      const progress = targetRack ? Math.round(targetRack.repairProgress * 100) : 0;
      repairFillEl.style.width = `${progress}%`;
    }

    if (endTitleEl) endTitleEl.textContent = state.endTitle || "Mission terminée";
    if (endSummaryEl) endSummaryEl.textContent = state.endSummary || "Relancez une intervention pour repartir.";

    if (incidentListEl) {
      const items = state.racks
        .filter((rack) => rack.state !== "idle")
        .sort((a, b) => b.incidentLevel - a.incidentLevel)
        .map((rack) => {
          const cls = rack.state === "repairing" ? "is-repairing" : rack.state === "critical" ? "is-critical" : "is-warning";
          const level = rack.state === "repairing" ? "REPAIR" : rack.state === "critical" ? "CRITIQUE" : "ALERTE";
          return `
            <div class="cyber-incident-item ${cls}">
              <strong>${rack.label}</strong>
              <span>${level} · ${Math.round(rack.incidentLevel * 100)}% pression</span>
              <small>${rack.issue}</small>
            </div>
          `;
        });

      incidentListEl.innerHTML = items.length ? items.join("") : `<div class="cyber-feed-item"><strong>Rien à signaler</strong><span>Le datacenter tient pour le moment.</span></div>`;
    }

    if (feedEl) {
      const items = state.feed.map(
        (entry) => `
          <div class="cyber-feed-item">
            <strong>${entry.title}</strong>
            <span>${entry.body}</span>
          </div>
        `,
      );
      feedEl.innerHTML = items.length ? items.join("") : `<div class="cyber-feed-item"><strong>Console calme</strong><span>Les prochains incidents s'afficheront ici.</span></div>`;
    }

    state.uiDirty = false;
    uiListStamp = now;
  }

  function pushFeed(message) {
    const parts = message.split(" : ");
    const title = parts.length > 1 ? parts[0] : "MBL Ops";
    const body = parts.length > 1 ? parts.slice(1).join(" : ") : message;
    state.feed.unshift({ title, body });
    state.feed = state.feed.slice(0, 4);
    state.uiDirty = true;
  }

  function setStatus(message) {
    state.status = message;
    state.uiDirty = true;
  }

  function currentPrompt() {
    if (state.gameOver) {
      return state.endSummary;
    }

    if (state.awaitingStart) {
      return "Cliquez sur « Démarrer la mission », puis rejoignez le rack orange ou rouge indiqué.";
    }

    if (state.targetId) {
      const rack = rackById(state.targetId);
      return `${rack.label} à portée. Bien : maintenez E ou Espace jusqu'à 100%.`;
    }

    if (state.nearestIncidentId) {
      const rack = rackById(state.nearestIncidentId);
      return `Rejoignez ${rack.label}. Placez-vous sur le halo lumineux devant le rack, puis maintenez E.`;
    }

    return "Patrouillez dans l'allée. Le prochain incident peut tomber à tout moment.";
  }

  function currentThreatLevel(activeCount, criticalCount) {
    if (state.uptime < 45 || criticalCount >= 2) return "Critique";
    if (criticalCount >= 1 || activeCount >= 3) return "Eleve";
    if (activeCount >= 1) return "Sous controle";
    return "Faible";
  }

  function rackById(id) {
    return state.racks.find((rack) => rack.id === id) || null;
  }

  function distanceToServicePoint(rack) {
    return Math.hypot(state.player.x - rack.servicePoint.x, state.player.z - rack.servicePoint.z);
  }

  function resizeRenderer() {
    const width = Math.max(1, Math.round(canvas.clientWidth));
    const height = Math.max(1, Math.round(canvas.clientHeight));
    const pixelRatio = Math.min(window.devicePixelRatio || 1, reduceMotion ? 1.5 : 2);
    view.renderer.setPixelRatio(pixelRatio);
    view.renderer.setSize(width, height, false);
    view.camera.aspect = width / height;
    view.camera.updateProjectionMatrix();
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function setText(element, value) {
    if (element && element.textContent !== value) {
      element.textContent = value;
    }
  }

  function renderGameToText() {
    const targetRack = state.targetId ? rackById(state.targetId) : null;
    const nearestRack = state.nearestIncidentId ? rackById(state.nearestIncidentId) : null;
    const activeRacks = state.racks
      .filter((rack) => rack.state !== "idle")
      .sort((a, b) => b.incidentLevel - a.incidentLevel)
      .slice(0, 4)
      .map((rack) => ({
        id: rack.id,
        state: rack.state,
        issue: rack.issue,
        pressure: Math.round(rack.incidentLevel * 100),
        servicePoint: {
          x: Number(rack.servicePoint.x.toFixed(2)),
          z: Number(rack.servicePoint.z.toFixed(2)),
        },
      }));

    return JSON.stringify({
      mode: state.awaitingStart ? "tutorial" : state.gameOver ? "game_over" : state.paused ? "paused" : "live",
      coordinates: "origin center of corridor, x left/right, z forward/back along aisle",
      player: {
        x: Number(state.player.x.toFixed(2)),
        z: Number(state.player.z.toFixed(2)),
      },
      score: Math.round(state.score),
      combo: state.combo,
      uptime: Math.round(state.uptime),
      timeRemaining: Number(state.timeRemaining.toFixed(1)),
      targetRack: targetRack
        ? {
            id: targetRack.id,
            issue: targetRack.issue,
            repairProgress: Math.round(targetRack.repairProgress * 100),
            servicePoint: {
              x: Number(targetRack.servicePoint.x.toFixed(2)),
              z: Number(targetRack.servicePoint.z.toFixed(2)),
            },
          }
        : null,
      nearestRack: nearestRack
        ? {
            id: nearestRack.id,
            state: nearestRack.state,
            servicePoint: {
              x: Number(nearestRack.servicePoint.x.toFixed(2)),
              z: Number(nearestRack.servicePoint.z.toFixed(2)),
            },
          }
        : null,
      activeRacks,
      prompt: state.prompt,
    });
  }
}
