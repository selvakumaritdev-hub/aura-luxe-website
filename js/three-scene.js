/**
 * AURA LUXE RESIDENCES - THREE.JS 3D ARCHITECTURAL EXPERIENCE
 * Procedural Modern Luxury Villa with Realistic Architectural Lighting & Materials
 */

(function () {
  'use strict';

  let scene, camera, renderer, villaGroup, poolWater, particles;
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotation = { x: 0.35, y: -0.6 };
  let currentRotation = { x: 0.35, y: -0.6 };
  let isVisible = true;
  let animFrameId = null;

  // Viewpoint Camera Presets
  const VIEW_PRESETS = {
    isometric: { camPos: { x: 22, y: 16, z: 26 }, target: { x: 0, y: 3, z: 0 }, rot: { x: 0.35, y: -0.6 } },
    front: { camPos: { x: 0, y: 8, z: 32 }, target: { x: 0, y: 4, z: 0 }, rot: { x: 0.05, y: 0 } },
    pool: { camPos: { x: 18, y: 6, z: 18 }, target: { x: 4, y: 2, z: 4 }, rot: { x: 0.15, y: -0.7 } },
    top: { camPos: { x: 2, y: 36, z: 8 }, target: { x: 0, y: 0, z: 0 }, rot: { x: 1.2, y: 0 } }
  };

  function initThreeScene() {
    const container = document.getElementById('three-canvas-container');
    const canvas = document.getElementById('three-villa-canvas');
    if (!container || !canvas || typeof THREE === 'undefined') return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Fog
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0a09);
    scene.fog = new THREE.FogExp2(0x0b0a09, 0.025);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(22, 16, 26);
    camera.lookAt(0, 3, 0);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // 4. Lighting Rig
    setupLighting();

    // 5. Build Procedural Luxury Villa Architecture
    villaGroup = new THREE.Group();
    buildArchitecturalVilla();
    scene.add(villaGroup);

    // 6. Atmospheric Dust Particles
    createAtmosphereParticles();

    // 7. Event Listeners (Interaction & Resize)
    setupInteraction(container);
    setupViewPresets();
    setupVisibilityObserver(container);

    window.addEventListener('resize', onWindowResize);

    // 8. Start Render Loop
    animate(0);
  }

  function setupLighting() {
    // Ambient light - Dark obsidian fill with warm tone
    const ambientLight = new THREE.AmbientLight(0x2a2833, 1.2);
    scene.add(ambientLight);

    // Main Golden-Hour Key Light
    const sunLight = new THREE.DirectionalLight(0xffdfa9, 2.2);
    sunLight.position.set(28, 35, 18);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 80;
    sunLight.shadow.camera.left = -22;
    sunLight.shadow.camera.right = 22;
    sunLight.shadow.camera.top = 22;
    sunLight.shadow.camera.bottom = -22;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Cool Sky Fill Light
    const hemiLight = new THREE.HemisphereLight(0x8cb5e5, 0x14161f, 0.7);
    scene.add(hemiLight);

    // Warm Interior Glow PointLights
    const interiorGlow1 = new THREE.PointLight(0xffaa44, 2.5, 16);
    interiorGlow1.position.set(-2, 4.5, 0);
    scene.add(interiorGlow1);

    const interiorGlow2 = new THREE.PointLight(0xffb86c, 2.2, 14);
    interiorGlow2.position.set(4, 7.5, -2);
    scene.add(interiorGlow2);

    // Swimming Pool Underwater Cyan Glow
    const poolGlow = new THREE.PointLight(0x38bdf8, 2.8, 12);
    poolGlow.position.set(5, 0.2, 8);
    scene.add(poolGlow);
  }

  function buildArchitecturalVilla() {
    // --- MATERIALS ---
    const darkConcreteMat = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      roughness: 0.7,
      metalness: 0.15
    });

    const warmWoodMat = new THREE.MeshStandardMaterial({
      color: 0x8a5531,
      roughness: 0.5,
      metalness: 0.1
    });

    const champagneGoldMat = new THREE.MeshStandardMaterial({
      color: 0xc9a96e,
      roughness: 0.3,
      metalness: 0.8
    });

    const stoneSlateMat = new THREE.MeshStandardMaterial({
      color: 0x2e323d,
      roughness: 0.85,
      metalness: 0.05
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.08,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.5,
      reflectivity: 0.9
    });

    const interiorCeilingGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffe6b0
    });

    // 1. Ground & Manicured Lawn
    const groundGeo = new THREE.BoxGeometry(40, 0.5, 36);
    const groundMesh = new THREE.Mesh(groundGeo, stoneSlateMat);
    groundMesh.position.y = -0.25;
    groundMesh.receiveShadow = true;
    villaGroup.add(groundMesh);

    // Lush Garden Grass Patch
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x1d2e20, roughness: 0.9 });
    const grassGeo = new THREE.BoxGeometry(18, 0.1, 14);
    const grassMesh = new THREE.Mesh(grassGeo, grassMat);
    grassMesh.position.set(-9, 0.05, 7);
    grassMesh.receiveShadow = true;
    villaGroup.add(grassMesh);

    // 2. Infinity Pool & Water
    const poolBorderGeo = new THREE.BoxGeometry(12, 0.4, 7);
    const poolBorder = new THREE.Mesh(poolBorderGeo, darkConcreteMat);
    poolBorder.position.set(6, 0.15, 8.5);
    poolBorder.receiveShadow = true;
    villaGroup.add(poolBorder);

    const waterGeo = new THREE.PlaneGeometry(11.2, 6.2, 16, 16);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.1,
      metalness: 0.3,
      transparent: true,
      opacity: 0.82
    });
    poolWater = new THREE.Mesh(waterGeo, waterMat);
    poolWater.rotation.x = -Math.PI / 2;
    poolWater.position.set(6, 0.3, 8.5);
    villaGroup.add(poolWater);

    // 3. Ground Floor Main Living Pavilion (Cantilevered Structure)
    const gfSlabGeo = new THREE.BoxGeometry(16, 0.6, 14);
    const gfSlab = new THREE.Mesh(gfSlabGeo, darkConcreteMat);
    gfSlab.position.set(0, 0.3, -2);
    gfSlab.castShadow = true;
    gfSlab.receiveShadow = true;
    villaGroup.add(gfSlab);

    // GF Glass Walls
    const gfGlassGeo = new THREE.BoxGeometry(13.8, 3.8, 11.8);
    const gfGlass = new THREE.Mesh(gfGlassGeo, glassMat);
    gfGlass.position.set(0, 2.5, -2);
    gfGlass.castShadow = false;
    villaGroup.add(gfGlass);

    // GF Internal Feature Wall (Stone & Wood)
    const gfStoneWallGeo = new THREE.BoxGeometry(4.5, 3.8, 0.5);
    const gfStoneWall = new THREE.Mesh(gfStoneWallGeo, stoneSlateMat);
    gfStoneWall.position.set(-2.5, 2.5, -2);
    gfStoneWall.castShadow = true;
    villaGroup.add(gfStoneWall);

    // 4. Middle Cantilever Floor Plate (First Floor)
    const ffSlabGeo = new THREE.BoxGeometry(18, 0.6, 16);
    const ffSlab = new THREE.Mesh(ffSlabGeo, darkConcreteMat);
    ffSlab.position.set(1.5, 4.7, -1);
    ffSlab.castShadow = true;
    ffSlab.receiveShadow = true;
    villaGroup.add(ffSlab);

    // First Floor Master Suite Structure
    const ffMasterGeo = new THREE.BoxGeometry(11, 3.6, 10);
    const ffMaster = new THREE.Mesh(ffMasterGeo, warmWoodMat);
    ffMaster.position.set(3, 6.8, -2);
    ffMaster.castShadow = true;
    ffMaster.receiveShadow = true;
    villaGroup.add(ffMaster);

    // First Floor Glass Balcony Railing
    const balconyRailGeo = new THREE.BoxGeometry(15.5, 1.1, 0.1);
    const balconyRail = new THREE.Mesh(balconyRailGeo, glassMat);
    balconyRail.position.set(1.5, 5.5, 6.5);
    villaGroup.add(balconyRail);

    // 5. Roof Floating Cantilever Canopy
    const roofSlabGeo = new THREE.BoxGeometry(19.5, 0.5, 17);
    const roofSlab = new THREE.Mesh(roofSlabGeo, darkConcreteMat);
    roofSlab.position.set(1.5, 8.8, -1);
    roofSlab.castShadow = true;
    villaGroup.add(roofSlab);

    // Roof Architectural Gold Accent Trim
    const trimGeo = new THREE.BoxGeometry(19.7, 0.12, 17.2);
    const trimMesh = new THREE.Mesh(trimGeo, champagneGoldMat);
    trimMesh.position.set(1.5, 8.55, -1);
    villaGroup.add(trimMesh);

    // 6. Architectural Vertical Timber Louvers / Slats
    const louverGeo = new THREE.BoxGeometry(0.12, 3.6, 0.4);
    for (let i = 0; i < 14; i++) {
      const louver = new THREE.Mesh(louverGeo, warmWoodMat);
      louver.position.set(-3.5 + i * 0.45, 6.8, 3.1);
      louver.castShadow = true;
      villaGroup.add(louver);
    }

    // 7. Structural Slim Columns (Gold & Charcoal)
    const columnGeo = new THREE.CylinderGeometry(0.18, 0.18, 4.4, 16);
    const colPositions = [
      [-6.5, 2.5, 4],
      [7.5, 2.5, 4],
      [7.5, 2.5, -7]
    ];
    colPositions.forEach(pos => {
      const col = new THREE.Mesh(columnGeo, champagneGoldMat);
      col.position.set(pos[0], pos[1], pos[2]);
      col.castShadow = true;
      villaGroup.add(col);
    });

    // 8. Stepping Stone Path to Entrance
    const stepGeo = new THREE.BoxGeometry(2.4, 0.15, 1.2);
    for (let s = 0; s < 5; s++) {
      const step = new THREE.Mesh(stepGeo, stoneSlateMat);
      step.position.set(-3, 0.1, 5 + s * 1.8);
      step.receiveShadow = true;
      villaGroup.add(step);
    }
  }

  function createAtmosphereParticles() {
    const particleCount = 80;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 35;
      positions[i + 1] = Math.random() * 20;
      positions[i + 2] = (Math.random() - 0.5) * 35;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xc9a96e,
      size: 0.15,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
  }

  function setupInteraction(container) {
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) {
        // Subtle mouse follow parallax when just hovering
        const rect = container.getBoundingClientRect();
        if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
          const normX = (e.clientX - rect.left) / rect.width - 0.5;
          const normY = (e.clientY - rect.top) / rect.height - 0.5;
          targetRotation.y = currentRotation.y + normX * 0.15;
          targetRotation.x = currentRotation.x + normY * 0.1;
        }
        return;
      }

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotation.y += deltaX * 0.006;
      targetRotation.x = Math.max(-0.2, Math.min(0.9, targetRotation.x + deltaY * 0.006));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch support for mobile devices
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      targetRotation.y += deltaX * 0.007;
      targetRotation.x = Math.max(-0.2, Math.min(0.9, targetRotation.x + deltaY * 0.007));

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  function setupViewPresets() {
    const presetButtons = document.querySelectorAll('.view-preset-btn');
    presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        presetButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const presetKey = btn.getAttribute('data-view');
        const preset = VIEW_PRESETS[presetKey];
        if (!preset) return;

        if (typeof gsap !== 'undefined') {
          gsap.to(camera.position, {
            x: preset.camPos.x,
            y: preset.camPos.y,
            z: preset.camPos.z,
            duration: 1.4,
            ease: 'power3.inOut'
          });

          gsap.to(targetRotation, {
            x: preset.rot.x,
            y: preset.rot.y,
            duration: 1.4,
            ease: 'power3.inOut'
          });
        } else {
          camera.position.set(preset.camPos.x, preset.camPos.y, preset.camPos.z);
          targetRotation.x = preset.rot.x;
          targetRotation.y = preset.rot.y;
        }
      });
    });
  }

  function setupVisibilityObserver(container) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.1 });

    observer.observe(container);
  }

  function onWindowResize() {
    const container = document.getElementById('three-canvas-container');
    if (!container || !renderer || !camera) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate(timestamp) {
    animFrameId = requestAnimationFrame(animate);

    if (!isVisible) return;

    const time = timestamp * 0.001;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Smooth rotation interpolation
    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.06;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.06;

    // Slowly auto-rotate if user is not actively dragging
    if (!isDragging && !reduceMotion) {
      targetRotation.y += 0.0012;
    }

    if (villaGroup) {
      villaGroup.rotation.x = currentRotation.x;
      villaGroup.rotation.y = currentRotation.y;
    }

    // Water surface subtle ripple wave
    if (poolWater) {
      if (!reduceMotion) poolWater.position.y = 0.3 + Math.sin(time * 2.5) * 0.02;
    }

    // Atmospheric particles floating movement
    if (particles && !reduceMotion) {
      particles.rotation.y = time * 0.02;
      const positions = particles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(time + positions[i]) * 0.008;
      }
      particles.geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  // Initialize on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeScene);
  } else {
    initThreeScene();
  }

})();
