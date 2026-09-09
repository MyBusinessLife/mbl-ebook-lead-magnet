const hero = document.querySelector('[data-laptop-hero]');
const stage = document.querySelector('[data-laptop-stage]');
const toggle = document.querySelector('[data-motion-toggle]');
const sequence = document.querySelector('[data-laptop-sequence]');

async function createLaptop() {
  if (!hero || !stage) return;
  const THREE = await import('./assets/vendor/three-0.160.0.module.min.js');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0b0e10');
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  stage.appendChild(renderer.domElement);
  const camera = new THREE.OrthographicCamera(-10, 10, 5, -5, 0.1, 100);
  camera.position.set(0, 5.5, 19);
  camera.lookAt(0, 0, 0);

  // An offscreen photographic light box gives the metal broad, soft reflections.
  const lightBox = new THREE.Scene();
  lightBox.background = new THREE.Color('#707876');
  const reflector = (width, height, position, rotation, color, intensity) => {
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }));
    plane.material.color.multiplyScalar(intensity);
    plane.position.set(...position);
    plane.rotation.set(...rotation);
    lightBox.add(plane);
  };
  reflector(12, 9, [0, 6, 0], [Math.PI / 2, 0, 0], '#ffffff', 3);
  reflector(4, 12, [-8, 0, 0], [0, Math.PI / 2, 0], '#a4f4ff', 2);
  reflector(8, 10, [8, 0, 0], [0, -Math.PI / 2, 0], '#ffffff', 4);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(lightBox, 0.08);
  scene.environment = environment.texture;
  lightBox.traverse((object) => { object.geometry?.dispose(); object.material?.dispose(); });
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight('#f6fff8', '#242824', 2));
  const keyLight = new THREE.DirectionalLight('#ffffff', 3);
  keyLight.position.set(-2, 8, 6);
  scene.add(keyLight);

  const metal = new THREE.MeshStandardMaterial({ color: '#9aa8b0', metalness: 0.86, roughness: 0.24 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: '#30373c', metalness: 0.8, roughness: 0.25 });
  const black = new THREE.MeshStandardMaterial({ color: '#070b09', roughness: 0.34, metalness: 0.1 });
  const root = new THREE.Group();
  scene.add(root);

  function roundedShape(width, height, radius) {
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;
    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);
    return shape;
  }
  function plate(width, height, thickness, radius, material) {
    const geometry = new THREE.ExtrudeGeometry(roundedShape(width, height, radius), {
      depth: thickness, steps: 1, bevelEnabled: true, bevelSegments: 2,
      bevelSize: 0.026, bevelThickness: 0.022, curveSegments: 8,
    });
    return new THREE.Mesh(geometry, material);
  }
  const deck = plate(7.1, 4.5, 0.14, 0.2, metal);
  deck.rotation.x = -Math.PI / 2;
  root.add(deck);
  const lower = plate(7.02, 4.44, 0.035, 0.2, darkMetal);
  lower.rotation.x = -Math.PI / 2;
  lower.position.y = -0.065;
  root.add(lower);

  function textureCanvas(width, height, draw) {
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    draw(canvas.getContext('2d'), width, height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
    return texture;
  }
  const keyboardTexture = textureCanvas(1536, 620, (ctx, width, height) => {
    ctx.fillStyle = '#64716c'; ctx.fillRect(0, 0, width, height);
    const letters = ['esc 1 2 3 4 5 6 7 8 9 0 - +', 'tab Q W E R T Y U I O P [ ]', 'caps A S D F G H J K L ; enter', 'shift Z X C V B N M , . / shift'];
    ctx.textAlign = 'center'; ctx.font = '18px sans-serif';
    for (let row = 0; row < 4; row++) {
      const keys = letters[row].split(' ');
      const keyWidth = (width - 40) / keys.length;
      keys.forEach((label, index) => {
        const x = 20 + index * keyWidth;
        const y = 16 + row * 110;
        ctx.fillStyle = '#121815'; ctx.beginPath(); ctx.roundRect(x, y, keyWidth - 12, 96, 9); ctx.fill();
        ctx.strokeStyle = '#9aaba4'; ctx.lineWidth = 1.2; ctx.stroke();
        ctx.fillStyle = '#c1d3c8'; ctx.fillText(label, x + (keyWidth - 12) / 2, y + 55);
      });
    }
    [0, 1, 2, 3, 4].forEach((index) => {
      const x = index < 2 ? 20 + index * 140 : index === 2 ? 300 : 1120 + (index - 3) * 180;
      ctx.fillStyle = '#121815'; ctx.beginPath(); ctx.roundRect(x, 458, index === 2 ? 795 : 120, 116, 9); ctx.fill();
      ctx.strokeStyle = '#9aaba4'; ctx.stroke();
    });
  });
  const keyboard = new THREE.Mesh(new THREE.PlaneGeometry(5.9, 2.4), new THREE.MeshBasicMaterial({ map: keyboardTexture, toneMapped: false }));
  keyboard.rotation.x = -Math.PI / 2;
  keyboard.position.set(0, 0.168, -0.53);
  root.add(keyboard);
  const trackpad = plate(2.65, 1.06, 0.003, 0.09, new THREE.MeshStandardMaterial({ color: '#91a199', metalness: 0.75, roughness: 0.34 }));
  trackpad.rotation.x = -Math.PI / 2;
  trackpad.position.set(0, 0.148, 1.25);
  root.add(trackpad);
  for (const x of [-3.23, 3.23]) {
    for (let row = 0; row < 28; row++) {
      const speaker = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.009, 0.016), darkMetal);
      speaker.position.set(x, 0.174, -1.57 + row * 0.072);
      root.add(speaker);
    }
  }
  for (const z of [-1.4, -0.9]) {
    const port = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.07, 0.28), black);
    port.position.set(-3.565, 0.05, z); root.add(port);
  }

  const hinge = new THREE.Group();
  hinge.position.set(0, 0.17, -2.17);
  root.add(hinge);
  const lid = plate(7.1, 4.44, 0.105, 0.18, metal);
  lid.position.set(0, 2.22, -0.13);
  hinge.add(lid);
  const bezel = plate(6.96, 4.29, 0.016, 0.15, black);
  bezel.position.set(0, 2.22, 0.001);
  hinge.add(bezel);

  const screenTexture = textureCanvas(1600, 970, (ctx, width, height) => {
    ctx.fillStyle = '#0d1418'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#a7eeff12'; ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
    for (let y = 0; y < height; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
    ctx.fillStyle = '#eaf6f8';
    ctx.font = 'bold 24px sans-serif'; ctx.fillText('MY BUSINESS LIFE', 70, 72);
    ctx.font = '20px sans-serif'; ctx.fillText('Votre espace. Vos projets.', 70, 112);
    ctx.fillStyle = '#4edbed'; ctx.fillRect(70, 147, 1460, 2);
    ctx.fillStyle = '#eaf6f8'; ctx.font = 'bold 105px sans-serif';
    ctx.fillText('Place aux', 70, 320); ctx.fillText('possibilités.', 70, 438);
    ctx.font = '28px sans-serif'; ctx.fillText('Moins de limites. Plus de liberté.', 74, 512);
    ctx.fillStyle = '#9cf1fa'; ctx.beginPath(); ctx.roundRect(74, 563, 330, 73, 8); ctx.fill();
    ctx.fillStyle = '#0d1418'; ctx.font = '24px sans-serif'; ctx.fillText('Faisons le premier pas', 100, 607);
    // A single continuous ribbon, rendered into the laptop screen rather than page decoration.
    ctx.lineCap = 'round';
    for (let i = 0; i < 32; i++) {
      ctx.strokeStyle = i % 4 === 0 ? '#edfcff' : '#38baca'; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(890 + i * 9, 230);
      ctx.bezierCurveTo(1660 - i * 4, 70, 820 + i * 9, 640, 1430 + i * 3, 590); ctx.stroke();
    }
    ctx.fillStyle = '#90b0ba'; ctx.fillRect(70, 738, 1460, 1);
    ['WEB & DESIGN', 'LOGICIELS MÉTIER', 'INTELLIGENCE ARTIFICIELLE'].forEach((text, index) => {
      ctx.font = 'bold 20px sans-serif'; ctx.fillText(text, 70 + index * 505, 802);
      ctx.font = '22px sans-serif'; ctx.fillText(['Votre présence, réinventée.', 'Votre quotidien, simplifié.', 'Votre potentiel, augmenté.'][index], 70 + index * 505, 850);
    });
  });
  const display = new THREE.Mesh(new THREE.PlaneGeometry(6.68, 4.05), new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false }));
  display.position.set(0, 2.23, 0.051);
  hinge.add(display);
  const webcam = new THREE.Mesh(new THREE.CircleGeometry(0.023, 12), new THREE.MeshBasicMaterial({ color: '#5f7367' }));
  webcam.position.set(0, 4.345, 0.055);
  hinge.add(webcam);

  let width = 1, height = 1, visible = true, paused = false, frame = 0;
  let contextLost = false, pinned = false, scrollDistance = 1, headerHeight = 84;
  let modelScale = 1, modelX = 0, modelY = 0;
  const header = document.querySelector('.site-header');
  const copy = hero.querySelector('.studio-hero-copy');
  let progress = 0, target = 0, pointerX = 0, pointerY = 0;
  let lastTime = 0;
  const clamp = THREE.MathUtils.clamp;
  const render = (time = 0) => {
    frame = 0;
    const dt = Math.min((time - lastTime) / 1000 || 0.016, 0.05);
    lastTime = time;
    const stationary = paused || reducedMotion.matches;
    if (reducedMotion.matches || !pinned) progress = 1;
    else if (!paused) progress = THREE.MathUtils.lerp(progress, target, 1 - Math.exp(-dt * 9));
    hinge.rotation.x = 1.22 - progress * 1.4;
    root.rotation.set(0.05 + (stationary ? 0 : pointerY * 0.025), -0.42 + progress * 0.28 + (stationary ? 0 : pointerX * 0.055), -0.045);
    root.position.set(modelX, modelY, 0);
    root.scale.setScalar(modelScale);
    renderer.render(scene, camera);
    stage.dataset.progress = progress.toFixed(3);
    stage.dataset.ready = 'true';
    hero.style.setProperty('--opening', progress.toFixed(3));
    if (visible && !document.hidden && !stationary && Math.abs(progress - target) > 0.001) frame = requestAnimationFrame(render);
  };
  const schedule = () => { if (!frame && visible && !document.hidden && !contextLost) frame = requestAnimationFrame(render); };
  const readScroll = () => {
    const rect = (sequence || hero).getBoundingClientRect();
    target = pinned ? clamp((headerHeight - rect.top) / (scrollDistance * 0.85), 0, 1) : 1;
    schedule();
  };
  const resize = () => {
    if (contextLost) return;
    headerHeight = header?.getBoundingClientRect().height || 0;
    const viewportHeight = document.documentElement.clientHeight;
    const mobile = stage.clientWidth <= 1100;
    hero.style.setProperty('--copy-height', `${copy.offsetHeight}px`);
    pinned = Boolean(sequence && !reducedMotion.matches && viewportHeight >= (mobile ? 740 : 650));
    scrollDistance = Math.min(900, viewportHeight * 0.95);
    sequence?.style.setProperty('--header-height', `${headerHeight}px`);
    sequence?.style.setProperty('--scroll-distance', `${scrollDistance}px`);
    sequence?.classList.toggle('is-scroll-ready', pinned);
    toggle.hidden = !pinned;
    width = stage.clientWidth; height = stage.clientHeight;
    if (!width || !height) return;
    const viewWidth = mobile ? 10 : 11.7 * width / height;
    const viewHeight = viewWidth * height / width;
    camera.left = -viewWidth / 2; camera.right = viewWidth / 2;
    camera.top = viewHeight / 2; camera.bottom = -viewHeight / 2;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    // Fit the complete opening envelope inside the free space, including on tablets.
    root.position.set(0, 0, 0); root.scale.setScalar(1);
    const bounds = new THREE.Box2();
    const box = new THREE.Box3();
    const point = new THREE.Vector3();
    for (const step of [0, 0.25, 0.5, 0.75, 1]) {
      hinge.rotation.x = 1.22 - step * 1.4;
      root.rotation.set(0.05, -0.42 + step * 0.28, -0.045);
      root.updateMatrixWorld(true); box.setFromObject(root);
      for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) {
        point.set(x, y, z).project(camera);
        bounds.expandByPoint(new THREE.Vector2(point.x * viewWidth / 2, point.y * viewHeight / 2));
      }
    }
    const copyBottom = copy.getBoundingClientRect().bottom - hero.getBoundingClientRect().top;
    const top = mobile ? copyBottom + 12 : 70;
    const bottom = height - (mobile ? 88 : 80);
    const availableHeight = Math.max(140, bottom - top);
    const availableWidth = width * (mobile ? 0.94 : 0.44);
    modelScale = Math.min(availableWidth / width * viewWidth / (bounds.max.x - bounds.min.x), availableHeight / height * viewHeight / (bounds.max.y - bounds.min.y));
    const center = bounds.getCenter(new THREE.Vector2());
    modelX = (mobile ? 0 : viewWidth * 0.245) - center.x * modelScale;
    modelY = ((0.5 - (top + bottom) / 2 / height) * viewHeight - center.y * modelScale) / Math.cos(camera.rotation.x);
    renderer.setSize(width, height, false);
    readScroll();
  };
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) readScroll(); else { cancelAnimationFrame(frame); frame = 0; } });
  observer.observe(hero);
  const resizer = new ResizeObserver(resize);
  resizer.observe(stage);
  resizer.observe(copy);
  if (header) resizer.observe(header);
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('scroll', readScroll, { passive: true });
  document.addEventListener('visibilitychange', schedule);
  hero.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' || reducedMotion.matches || paused) return;
    const rect = hero.getBoundingClientRect();
    pointerX = (event.clientX - rect.left) / width - 0.5;
    pointerY = (event.clientY - rect.top) / height - 0.5;
    schedule();
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; schedule(); });
  reducedMotion.addEventListener('change', () => { toggle.hidden = reducedMotion.matches; resize(); });
  toggle.hidden = reducedMotion.matches;
  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? "Activer l'animation" : "Mettre l'animation en pause";
    schedule();
  });
  renderer.domElement.addEventListener('webglcontextlost', (event) => {
    event.preventDefault(); cancelAnimationFrame(frame); frame = 0;
    contextLost = true;
    sequence?.classList.remove('is-scroll-ready');
    delete stage.dataset.ready; toggle.hidden = true;
  });
  renderer.domElement.addEventListener('webglcontextrestored', () => { contextLost = false; resize(); toggle.hidden = reducedMotion.matches; });
  resize();
}

createLaptop().catch(() => {
  // The photograph and all links remain available when WebGL cannot start.
  stage?.querySelector('canvas')?.remove();
  if (stage) delete stage.dataset.ready;
  if (toggle) toggle.hidden = true;
  sequence?.classList.remove('is-scroll-ready');
});
