/**
 * Interactive Rigged 3D Female Character Controller
 * Tailored for Sahla Sharmeen E.K Portfolio (matching Redoyanul Haque's 3D experience)
 * Features:
 * - High-fidelity 3D rigged female avatar (models/character.glb)
 * - Animated body parts:
 *   * Realistic typing hands and forearms posture & rhythmic typing motion at laptop
 *   * Interactive head and neck tracking visitor cursor smoothly across the screen
 *   * Natural chest/thoracic breathing oscillation
 *   * Natural periodic eye blinking morph targets
 *   * Interactive eyebrow lift and smile on cursor hover
 * - Sleek 3D developer laptop prop with illuminated glowing display and purple screen light
 * - Multi-stage GSAP ScrollTrigger choreography (Hero -> About glide -> Lift out of view before What I Do & Timeline)
 */

(function () {
  'use strict';

  // Desktop only for WebGL canvas; mobile uses smooth CSS animated display
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

  // Camera framing the developer at her laptop (head, shoulders, chest, arms, laptop)
  const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
  camera.position.set(0, 1.40, 1.45);
  camera.lookAt(0, 1.28, 0);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  if (renderer.outputEncoding !== undefined) {
    renderer.outputEncoding = THREE.sRGBEncoding || 3001;
  }
  container.appendChild(renderer.domElement);

  // Atmospheric studio lighting
  const ambLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambLight);

  const keyLight = new THREE.DirectionalLight(0xfff5ea, 1.15);
  keyLight.position.set(1.5, 2.5, 2.0);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xc2a4ff, 0.85);
  fillLight.position.set(-2.0, 1.5, 1.5);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xd8b4fe, 1.35);
  rimLight.position.set(0, 2.0, -1.5);
  scene.add(rimLight);

  // Soft purple screen glow emitted from the laptop toward face and hands
  const laptopScreenLight = new THREE.PointLight(0xc2a4ff, 2.4, 1.6);
  laptopScreenLight.position.set(0, 1.16, 0.28);
  scene.add(laptopScreenLight);

  // Create Sleek Developer Laptop Prop
  const laptopGroup = new THREE.Group();
  
  // 1. Laptop Base / Keyboard deck
  const baseGeo = new THREE.BoxGeometry(0.50, 0.012, 0.34);
  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x1b1726,
    metalness: 0.82,
    roughness: 0.28
  });
  const laptopBase = new THREE.Mesh(baseGeo, darkMetalMat);
  laptopBase.position.set(0, 0, 0);
  laptopGroup.add(laptopBase);

  // 2. Keyboard recess area
  const kbGeo = new THREE.BoxGeometry(0.42, 0.003, 0.19);
  const kbMat = new THREE.MeshStandardMaterial({
    color: 0x0f0c18,
    roughness: 0.85
  });
  const keyboard = new THREE.Mesh(kbGeo, kbMat);
  keyboard.position.set(0, 0.007, -0.02);
  laptopGroup.add(keyboard);

  // 3. Trackpad
  const tpGeo = new THREE.BoxGeometry(0.13, 0.002, 0.08);
  const tpMat = new THREE.MeshStandardMaterial({
    color: 0x241e33,
    roughness: 0.4
  });
  const trackpad = new THREE.Mesh(tpGeo, tpMat);
  trackpad.position.set(0, 0.007, 0.10);
  laptopGroup.add(trackpad);

  // 4. Laptop Screen Lid
  const lidGroup = new THREE.Group();
  lidGroup.position.set(0, 0.006, -0.165); // Hinge location
  lidGroup.rotation.x = -Math.PI * 0.14; // Open at ~115 degrees

  const lidGeo = new THREE.BoxGeometry(0.50, 0.32, 0.012);
  const lidMesh = new THREE.Mesh(lidGeo, darkMetalMat);
  lidMesh.position.set(0, 0.16, 0);
  lidGroup.add(lidMesh);

  // 5. Glowing Emissive Screen Display
  const screenGeo = new THREE.PlaneGeometry(0.46, 0.28);
  const screenMat = new THREE.MeshBasicMaterial({
    color: 0xc2a4ff,
    transparent: true,
    opacity: 0.95
  });
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.set(0, 0.16, 0.007);
  lidGroup.add(screenMesh);

  laptopGroup.add(lidGroup);
  laptopGroup.position.set(0, 0.93, 0.22);
  scene.add(laptopGroup);

  // Rigging references
  let avatarScene = null;
  let headBone = null;
  let neckBone = null;
  let spineBone = null;
  let leftArm = null;
  let rightArm = null;
  let leftForeArm = null;
  let rightForeArm = null;
  let leftHand = null;
  let rightHand = null;
  let faceMesh = null;

  // Base rotations for body parts in typing pose
  const baseRot = {
    leftArm: { x: 0.72, y: 0.14, z: -0.22 },
    rightArm: { x: 0.72, y: -0.14, z: 0.22 },
    leftForeArm: { x: -0.35, y: 0.42, z: 0.06 },
    rightForeArm: { x: -0.35, y: -0.42, z: -0.06 },
    leftHand: { x: -0.10, y: 0.0, z: -0.14 },
    rightHand: { x: -0.10, y: 0.0, z: 0.14 },
    head: { x: 0.16, y: 0.0, z: 0.0 }
  };

  const mouse = { x: 0, y: 0 };
  let isHovered = false;
  let currentHover = 0;

  // Blinking control
  let blinkTimer = 0;
  let isBlinking = false;
  let blinkWeight = 0;

  function setMorphInfluence(targetName, value) {
    if (!faceMesh || !faceMesh.morphTargetDictionary || !faceMesh.morphTargetInfluences) return;
    const idx = faceMesh.morphTargetDictionary[targetName];
    if (idx !== undefined) {
      faceMesh.morphTargetInfluences[idx] = value;
    }
  }

  // Load Rigged 3D Female Avatar
  const gltfLoader = new THREE.GLTFLoader();

  // If DRACOLoader is available on page, hook it up
  if (typeof THREE.DRACOLoader !== 'undefined') {
    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/libs/draco/');
    gltfLoader.setDRACOLoader(dracoLoader);
  }

  gltfLoader.load('models/character.glb', function (gltf) {
    avatarScene = gltf.scene;
    avatarScene.position.set(0, 0, 0);
    avatarScene.scale.set(1, 1, 1);

    // Identify bones and mesh
    avatarScene.traverse(function (child) {
      if (child.isBone) {
        const name = child.name;
        if (name === 'Head') headBone = child;
        else if (name === 'Neck') neckBone = child;
        else if (name === 'Spine2' || (name === 'Spine' && !spineBone)) spineBone = child;
        else if (name === 'LeftArm') leftArm = child;
        else if (name === 'RightArm') rightArm = child;
        else if (name === 'LeftForeArm') leftForeArm = child;
        else if (name === 'RightForeArm') rightForeArm = child;
        else if (name === 'LeftHand') leftHand = child;
        else if (name === 'RightHand') rightHand = child;
      }
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.roughness = Math.max(child.material.roughness || 0.4, 0.35);
          child.material.needsUpdate = true;
        }
        if (child.morphTargetDictionary && (child.name.includes('HighRes') || child.name.includes('Head') || !faceMesh)) {
          faceMesh = child;
        }
      }
    });

    // Pose body parts into typing position at laptop
    if (leftArm) {
      leftArm.rotation.set(baseRot.leftArm.x, baseRot.leftArm.y, baseRot.leftArm.z);
    }
    if (rightArm) {
      rightArm.rotation.set(baseRot.rightArm.x, baseRot.rightArm.y, baseRot.rightArm.z);
    }
    if (leftForeArm) {
      leftForeArm.rotation.set(baseRot.leftForeArm.x, baseRot.leftForeArm.y, baseRot.leftForeArm.z);
    }
    if (rightForeArm) {
      rightForeArm.rotation.set(baseRot.rightForeArm.x, baseRot.rightForeArm.y, baseRot.rightForeArm.z);
    }
    if (leftHand) {
      leftHand.rotation.set(baseRot.leftHand.x, baseRot.leftHand.y, baseRot.leftHand.z);
    }
    if (rightHand) {
      rightHand.rotation.set(baseRot.rightHand.x, baseRot.rightHand.y, baseRot.rightHand.z);
    }
    if (headBone) {
      headBone.rotation.set(baseRot.head.x, baseRot.head.y, baseRot.head.z);
    }

    scene.add(avatarScene);

    // Reveal glowing ambient rim once 3D avatar is ready
    const rim = document.querySelector('.character-rim');
    if (rim) {
      rim.style.opacity = '0.75';
    }

    // GSAP ScrollTrigger Choreography (Redoyan signature)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Hero -> About: Glide right, turn slightly towards about bio
      gsap.timeline({
        scrollTrigger: {
          trigger: '.landing-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2
        }
      })
      .to(avatarScene.position, { x: 0.38, z: -0.22, duration: 1 }, 0)
      .to(laptopGroup.position, { x: 0.38, z: 0.02, duration: 1 }, 0)
      .to(avatarScene.rotation, { y: -0.24, duration: 1 }, 0)
      .to(laptopGroup.rotation, { y: -0.24, duration: 1 }, 0);

      // What I Do & Beyond: Lift character smoothly up and out of view so text, cards, and career timeline are 100% unobstructed
      gsap.timeline({
        scrollTrigger: {
          trigger: '.whatIDO',
          start: 'top 85%',
          end: 'top 20%',
          scrub: 1.0
        }
      })
      .to('.character-model', { y: '-100%', opacity: 0, duration: 1.2, ease: 'power2.inOut' }, 0);
    }
  }, undefined, function (err) {
    console.warn('3D Character GLTF Notice:', err);
  });

  // Cursor tracking
  window.addEventListener('mousemove', function (e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Hover detection on character container
  container.addEventListener('mouseenter', function () {
    isHovered = true;
  });
  container.addEventListener('mouseleave', function () {
    isHovered = false;
  });

  // Render Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    if (avatarScene) {
      // 1. Interactive Head & Neck Tracking (follows mouse)
      if (headBone && window.scrollY < 650) {
        const targetHeadY = mouse.x * 0.32;
        const targetHeadX = baseRot.head.x - mouse.y * 0.18;
        headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, targetHeadY, 0.06);
        headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, targetHeadX, 0.06);

        if (neckBone) {
          neckBone.rotation.y = THREE.MathUtils.lerp(neckBone.rotation.y, mouse.x * 0.14, 0.06);
          neckBone.rotation.x = THREE.MathUtils.lerp(neckBone.rotation.x, -mouse.y * 0.08, 0.06);
        }
      }

      // 2. Natural Chest / Thoracic Breathing
      if (spineBone) {
        spineBone.rotation.x = Math.sin(time * 1.8) * 0.012;
        spineBone.rotation.z = Math.sin(time * 0.9) * 0.004;
      }

      // 3. Realistic Hands & Forearms Typing Motion at Laptop
      if (leftHand && rightHand) {
        leftHand.rotation.x = baseRot.leftHand.x + Math.sin(time * 8.5) * 0.05;
        leftHand.rotation.z = baseRot.leftHand.z + Math.cos(time * 7.5) * 0.035;

        rightHand.rotation.x = baseRot.rightHand.x + Math.cos(time * 9.0) * 0.05;
        rightHand.rotation.z = baseRot.rightHand.z + Math.sin(time * 8.0) * 0.035;

        if (leftForeArm && rightForeArm) {
          leftForeArm.rotation.x = baseRot.leftForeArm.x + Math.sin(time * 4.2) * 0.015;
          rightForeArm.rotation.x = baseRot.rightForeArm.x + Math.cos(time * 4.0) * 0.015;
        }
      }

      // 4. Natural Periodic Eye Blinking
      blinkTimer += delta;
      if (blinkTimer > 3.6 && !isBlinking) {
        isBlinking = true;
        blinkTimer = 0;
      }
      if (isBlinking) {
        blinkWeight += delta * 12;
        if (blinkWeight > 1) blinkWeight = 1;
        if (blinkTimer > 0.14) {
          blinkWeight -= delta * 14;
          if (blinkWeight <= 0) {
            blinkWeight = 0;
            isBlinking = false;
            blinkTimer = 0;
          }
        }
        setMorphInfluence('h_expressions.ReyeClose_h', blinkWeight);
        setMorphInfluence('h_expressions.LeyeClose_h', blinkWeight);
      }

      // 5. Interactive Eyebrow & Smile Blend on Hover
      const targetHoverVal = isHovered ? 1.0 : 0.0;
      currentHover = THREE.MathUtils.lerp(currentHover, targetHoverVal, 0.08);
      setMorphInfluence('h_expressions.RbrowUp_h', currentHover * 0.45);
      setMorphInfluence('h_expressions.LbrowUp_h', currentHover * 0.45);
      setMorphInfluence('h_expressions.RsmileClose_h', currentHover * 0.35);
      setMorphInfluence('h_expressions.LsmileClose_h', currentHover * 0.35);

      // Subtle ambient hover sway
      const swayY = Math.sin(time * 1.5) * 0.008;
      avatarScene.position.y = swayY;
      laptopGroup.position.y = 0.93 + swayY;
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
