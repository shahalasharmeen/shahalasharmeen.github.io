/**
 * Interactive 3D Female Character & Head-Tracking Controller
 * Tailored for Sahla Sharmeen E.K Portfolio
 * Features:
 * - High-detail feminine 3D avatar with rigged armature
 * - Real-time smooth head tracking towards cursor (Head & Neck bones)
 * - Natural eye blinking via Ready Player Me morphTargets
 * - Subtle ambient breathing motion on Spine bones
 * - Multi-stage GSAP ScrollTrigger camera choreography
 * - Non-overlapping layout with text protection
 */

(function () {
  'use strict';

  // Desktop only for optimal rendering performance
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

  // Camera framing the upper torso, face, and hair perfectly centered
  const camera = new THREE.PerspectiveCamera(36, aspect, 0.1, 100);
  camera.position.set(0, 1.48, 1.42);
  camera.lookAt(0, 1.44, 0);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.outputEncoding = THREE.sRGBEncoding || 3001;
  container.appendChild(renderer.domElement);

  // Soft atmospheric lighting for feminine facial tones
  const keyLight = new THREE.DirectionalLight(0xfff0fd, 1.35);
  keyLight.position.set(1.5, 3.0, 2.5);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xc2a4ff, 1.0);
  fillLight.position.set(-2.0, 1.8, 1.8);
  scene.add(fillLight);

  const ambLight = new THREE.AmbientLight(0x281a38, 1.5);
  scene.add(ambLight);

  const rimLight = new THREE.PointLight(0xaf83ff, 2.0, 8);
  rimLight.position.set(0, 2.2, -1.0);
  scene.add(rimLight);

  let avatarScene = null;
  let headBone = null;
  let neckBone = null;
  let spineBone = null;
  let headMesh = null;
  let mouse = { x: 0, y: 0 };
  let blinkTimer = 0;
  let isBlinking = false;
  let blinkWeight = 0;

  // Load Model
  const gltfLoader = new THREE.GLTFLoader();

  gltfLoader.load('models/character.glb', function (gltf) {
    avatarScene = gltf.scene;
    avatarScene.position.set(0, 0, 0);
    avatarScene.scale.set(1, 1, 1);
    scene.add(avatarScene);

    // Identify bones & morph targets
    avatarScene.traverse(function (node) {
      if (node.isBone) {
        const name = node.name.toLowerCase();
        if (name === 'head') headBone = node;
        if (name === 'neck') neckBone = node;
        if (name === 'spine2' || name === 'spine1' || name === 'spine') spineBone = node;
      }
      if (node.isMesh && node.morphTargetDictionary) {
        if (node.name.includes('Head') || node.name.includes('Face')) {
          headMesh = node;
        }
      }
    });

    // Reveal glowing rim once model is ready
    const rim = document.querySelector('.character-rim');
    if (rim) {
      rim.style.opacity = '0.7';
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
      .to(avatarScene.position, { x: 0.35, z: -0.2, duration: 1 }, 0)
      .to(avatarScene.rotation, { y: -0.25, duration: 1 }, 0)
      .to(camera.position, { y: 1.38, z: 1.6, duration: 1 }, 0);

      // About -> What I Do: Shift back slightly
      gsap.timeline({
        scrollTrigger: {
          trigger: '.about-section',
          start: 'top center',
          end: 'bottom top',
          scrub: 1.2
        }
      })
      .to(avatarScene.position, { x: 0.45, z: -0.4, duration: 1 }, 0)
      .to(avatarScene.rotation, { y: -0.4, duration: 1 }, 0);

      // What I Do & Beyond: Lift character out of view cleanly so all content cards and career timeline are 100% unobstructed
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
    console.warn('3D Female Avatar Notice:', err);
  });

  // Cursor tracking
  window.addEventListener('mousemove', function (e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Main Render Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    // Natural head tracking when scrolled near top
    if (headBone && window.scrollY < 600) {
      const maxRotX = 0.22;
      const maxRotY = 0.32;
      headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, mouse.x * maxRotY, 0.06);
      headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, -mouse.y * maxRotX, 0.06);

      if (neckBone) {
        neckBone.rotation.y = THREE.MathUtils.lerp(neckBone.rotation.y, mouse.x * (maxRotY * 0.4), 0.06);
        neckBone.rotation.x = THREE.MathUtils.lerp(neckBone.rotation.x, -mouse.y * (maxRotX * 0.3), 0.06);
      }
    }

    // Natural idle breathing motion
    if (spineBone) {
      spineBone.rotation.x = Math.sin(time * 1.8) * 0.015;
      spineBone.rotation.z = Math.sin(time * 0.9) * 0.005;
    }

    // Realistic natural eye blinking
    blinkTimer += delta;
    if (blinkTimer > 3.8 && !isBlinking) {
      isBlinking = true;
      blinkTimer = 0;
    }
    if (isBlinking) {
      blinkWeight += delta * 12;
      if (blinkWeight > 1) blinkWeight = 1;
      if (blinkTimer > 0.16) {
        blinkWeight -= delta * 14;
        if (blinkWeight <= 0) {
          blinkWeight = 0;
          isBlinking = false;
          blinkTimer = 0;
        }
      }
      if (headMesh && headMesh.morphTargetDictionary) {
        const leftIdx = headMesh.morphTargetDictionary['eyeBlinkLeft'];
        const rightIdx = headMesh.morphTargetDictionary['eyeBlinkRight'];
        if (leftIdx !== undefined) headMesh.morphTargetInfluences[leftIdx] = blinkWeight;
        if (rightIdx !== undefined) headMesh.morphTargetInfluences[rightIdx] = blinkWeight;
      }
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
