/**
 * Interactive Animated Human Model Controller
 * Tailored for Sahla Sharmeen E.K Portfolio
 * Features:
 * - High-resolution transparent character model from image.png (assets/images/character-model.png)
 * - Three.js WebGL rendering with real-time dynamic lighting
 * - Real-time smooth cursor tracking (3D perspective tilt & parallax lerp)
 * - Natural ambient floating & breathing oscillation
 * - Dynamic cosmic rim lighting reacting to mouse position
 * - Multi-stage GSAP ScrollTrigger choreography (Hero -> About -> Lift out of view for What I Do & Timeline)
 */

(function () {
  'use strict';

  // Desktop only for WebGL canvas; mobile uses smooth CSS animated cutout
  if (window.innerWidth <= 768) {
    return;
  }

  const container = document.getElementById('character-model');
  if (!container) return;

  // Scene setup
  const scene = new THREE.Scene();
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;
  const aspect = width / height;

  // Camera framing
  const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
  camera.position.set(0, 0, 2.5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  if (renderer.outputEncoding !== undefined) {
    renderer.outputEncoding = THREE.sRGBEncoding || 3001;
  }
  container.appendChild(renderer.domElement);

  // Dynamic atmospheric lighting
  const ambLight = new THREE.AmbientLight(0xffffff, 1.15);
  scene.add(ambLight);

  const keyLight = new THREE.DirectionalLight(0xfff0fd, 1.3);
  keyLight.position.set(1.5, 2.5, 2.0);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xc2a4ff, 0.95);
  fillLight.position.set(-2.0, 1.5, 1.5);
  scene.add(fillLight);

  // Dynamic mouse-following point light for interactive cosmic sheen
  const pointLight = new THREE.PointLight(0xc2a4ff, 2.8, 6.0);
  pointLight.position.set(0, 0.2, 1.4);
  scene.add(pointLight);

  let characterMesh = null;
  const mouse = { x: 0, y: 0 };
  const targetRotation = { x: 0, y: 0 };

  // Load character texture
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load('assets/images/character-model.png', function (texture) {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    // Aspect ratio of the character model image (416 / 457 ≈ 0.91)
    const charAspect = 416 / 457;
    const planeHeight = 1.82;
    const planeWidth = planeHeight * charAspect;

    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.01,
      roughness: 0.35,
      metalness: 0.1,
      side: THREE.DoubleSide
    });

    characterMesh = new THREE.Mesh(geometry, material);
    characterMesh.position.set(0, -0.04, 0);
    scene.add(characterMesh);

    // Reveal glowing rim once model is ready
    const rim = document.querySelector('.character-rim');
    if (rim) {
      rim.style.opacity = '0.75';
    }

    // ScrollTrigger choreography
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Hero -> About: Glide slightly right, rotate toward content
      gsap.timeline({
        scrollTrigger: {
          trigger: '.landing-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2
        }
      })
      .to(characterMesh.position, { x: 0.40, z: -0.25, duration: 1 }, 0)
      .to(characterMesh.rotation, { y: -0.24, duration: 1 }, 0);

      // What I Do & Beyond: Lift character out of view cleanly so text & timeline are 100% unobstructed
      gsap.timeline({
        scrollTrigger: {
          trigger: '.whatIDO',
          start: 'top 85%',
          end: 'center 45%',
          scrub: 1.0
        }
      })
      .to('.character-model', { y: '-100%', opacity: 0, duration: 1.2, ease: 'power2.inOut' }, 0);
    }
  }, undefined, function (err) {
    console.warn('Character Texture Notice:', err);
  });

  // Cursor tracking
  window.addEventListener('mousemove', function (e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Render Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    if (characterMesh) {
      // Interactive 3D perspective tilt tracking cursor
      targetRotation.y = mouse.x * 0.25;
      targetRotation.x = -mouse.y * 0.18;

      characterMesh.rotation.y = THREE.MathUtils.lerp(characterMesh.rotation.y, targetRotation.y, 0.06);
      characterMesh.rotation.x = THREE.MathUtils.lerp(characterMesh.rotation.x, targetRotation.x, 0.06);

      // Natural breathing & floating motion
      const floatY = Math.sin(time * 2.0) * 0.035;
      const swayX = Math.cos(time * 1.3) * 0.012;
      characterMesh.position.y = -0.04 + floatY;
      if (!window.scrollY || window.scrollY < 80) {
        characterMesh.position.x = swayX;
      }

      // Subtle breathing scale pulse
      const breath = 1.0 + Math.sin(time * 1.8) * 0.008;
      characterMesh.scale.set(breath, breath, 1);

      // Dynamic point light tracking cursor for responsive highlights
      pointLight.position.x = mouse.x * 1.8;
      pointLight.position.y = mouse.y * 1.4 + 0.3;
    }

    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  window.addEventListener('resize', function () {
    if (window.innerWidth <= 768) {
      container.style.display = 'none';
      return;
    } else {
      container.style.display = 'block';
    }

    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

})();
