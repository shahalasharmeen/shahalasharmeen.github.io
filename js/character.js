/**
 * Interactive 3D Human Character & Head-Tracking Controller
 * Inspired by Redoyanul Haque Portfolio (redoyanulhaque.me)
 * Features:
 * - Real-time 3D Human Model Loader with DRACO compression
 * - Natural Inertial Head Tracking Following Cursor (spine.006 bone lerp)
 * - Skeletal Animations (Typing, Blinking, Keyboard keystrokes)
 * - Screen Emissive Glow Shader Pulse
 * - GSAP ScrollTrigger Multi-Stage Scene Choreography
 */

(function () {
  'use strict';

  // Fallback to optimized static hero on small touch devices
  if (window.innerWidth <= 768) {
    return;
  }

  const container = document.getElementById('character-model');
  if (!container) return;

  // Scene & Canvas Initialization
  const scene = new THREE.Scene();
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;
  const aspect = width / height;

  const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
  camera.position.set(0, 13.1, 24.7);
  camera.zoom = 1.1;
  camera.updateProjectionMatrix();

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  container.appendChild(renderer.domElement);

  // Lighting setup matching Redoyan's aesthetic
  const dirLight = new THREE.DirectionalLight(0xc7b8ff, 1.25);
  dirLight.position.set(-0.47, 5, 4);
  scene.add(dirLight);

  const ambLight = new THREE.AmbientLight(0x2a1a4a, 1.6);
  scene.add(ambLight);

  const pointLight = new THREE.PointLight(0xc2a4ff, 2.2, 50);
  pointLight.position.set(3, 12, 4);
  scene.add(pointLight);

  let mixer, spine006, screenlight, characterScene;
  let mouse = { x: 0, y: 0 };

  // Setup DRACO and GLTF Loaders
  const dracoLoader = new THREE.DRACOLoader();
  dracoLoader.setDecoderPath('draco/');

  const gltfLoader = new THREE.GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);

  // Load Uncompressed / Decrypted GLB Model
  gltfLoader.load('models/character.glb', function (gltf) {
    characterScene = gltf.scene;
    characterScene.position.set(0, 0, 0);
    scene.add(characterScene);

    // Identify bones and screen emissive materials
    characterScene.traverse(function (node) {
      if (node.isBone && (node.name === 'spine.006' || node.name === 'spine006')) {
        spine006 = node;
      }
      if (node.name === 'screenlight' && node.material) {
        screenlight = node;
        node.material.transparent = true;
        node.material.opacity = 0.95;
        node.material.emissive = new THREE.Color(0xc2a4ff);
        node.material.emissiveIntensity = 2.8;
      }
    });

    // Play all bundled skeletal animations
    if (gltf.animations && gltf.animations.length) {
      mixer = new THREE.AnimationMixer(characterScene);

      // Intro Animation
      const introClip = gltf.animations.find(a => a.name === 'introAnimation');
      if (introClip) {
        const introAction = mixer.clipAction(introClip);
        introAction.setLoop(THREE.LoopOnce);
        introAction.clampWhenFinished = true;
        introAction.play();
      }

      // Continuous Typing Loop
      const typingClip = gltf.animations.find(a => a.name === 'typing');
      if (typingClip) {
        const typingAction = mixer.clipAction(typingClip);
        typingAction.play();
        typingAction.timeScale = 1.1;
      }

      // Eye Blinking
      const blinkClip = gltf.animations.find(a => a.name === 'Blink');
      if (blinkClip) {
        mixer.clipAction(blinkClip).play();
      }

      // Keyboard key clicks
      ['key1', 'key2', 'key5', 'key6'].forEach(k => {
        const keyClip = gltf.animations.find(a => a.name === k);
        if (keyClip) {
          mixer.clipAction(keyClip).play();
        }
      });
    }

    // Choreographed GSAP ScrollTrigger Animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Stage 1: Landing -> About (Character rotates and glides left)
      gsap.timeline({
        scrollTrigger: {
          trigger: '.landing-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2
        }
      })
      .to(characterScene.rotation, { y: 0.72, duration: 1 }, 0)
      .to('.character-model', { x: '-24%', duration: 1 }, 0);

      // Stage 2: About -> What I Do (Zoom in, laptop glow intensifies)
      gsap.timeline({
        scrollTrigger: {
          trigger: '.about-section',
          start: 'center 60%',
          end: 'bottom top',
          scrub: 1.2
        }
      })
      .to(camera.position, { z: 18, y: 11, duration: 2 }, 0)
      .to('.character-model', { x: '-15%', duration: 2 }, 0);

      // Stage 3: What I Do -> Career (Character lifts smoothly out of frame)
      gsap.timeline({
        scrollTrigger: {
          trigger: '.whatIDO',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2
        }
      })
      .to('.character-model', { y: '-100%', duration: 2 }, 0);
    }

    // Fade in glowing backdrop rim once 3D scene is loaded
    const rim = document.querySelector('.character-rim');
    if (rim) {
      rim.style.opacity = '0.75';
    }

  }, undefined, function (error) {
    console.warn('3D model load notice:', error);
  });

  // Cursor tracking for realistic head rotation
  window.addEventListener('mousemove', function (e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Render loop with requestAnimationFrame
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    // Smooth head tracking when near top of page
    if (spine006 && window.scrollY < 500) {
      const maxRot = Math.PI / 6;
      spine006.rotation.y = THREE.MathUtils.lerp(spine006.rotation.y, mouse.x * maxRot, 0.05);
      spine006.rotation.x = THREE.MathUtils.lerp(spine006.rotation.x, -mouse.y * 0.25, 0.05);
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
