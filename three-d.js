// ============================================================
// 3D AI Portfolio Effects
// ============================================================

// ── 1. Three.js Neural Network Background ──────────────────
(function initThreeBackground() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 80;

  // Particles
  const COUNT = 120;
  const positions = new Float32Array(COUNT * 3);
  const nodeData = [];

  for (let i = 0; i < COUNT; i++) {
    const x = (Math.random() - 0.5) * 160;
    const y = (Math.random() - 0.5) * 100;
    const z = (Math.random() - 0.5) * 60;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    nodeData.push({
      x, y, z,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.08,
      vz: (Math.random() - 0.5) * 0.04,
    });
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: 0x7c3aed,
    size: 1.2,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // Lines between nearby nodes
  const lineMat = new THREE.LineBasicMaterial({ color: 0x2563eb, transparent: true, opacity: 0.18 });
  const lineGeo = new THREE.BufferGeometry();
  const linePositions = [];

  const CONNECT_DIST = 28;
  for (let i = 0; i < COUNT; i++) {
    for (let j = i + 1; j < COUNT; j++) {
      const dx = nodeData[i].x - nodeData[j].x;
      const dy = nodeData[i].y - nodeData[j].y;
      const dz = nodeData[i].z - nodeData[j].z;
      if (Math.sqrt(dx * dx + dy * dy + dz * dz) < CONNECT_DIST) {
        linePositions.push(nodeData[i].x, nodeData[i].y, nodeData[i].z);
        linePositions.push(nodeData[j].x, nodeData[j].y, nodeData[j].z);
      }
    }
  }

  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  // Floating glowing orbs
  const orbColors = [0x2563eb, 0x7c3aed, 0x06b6d4, 0xec4899];
  const orbs = [];
  for (let i = 0; i < 6; i++) {
    const orbGeo = new THREE.SphereGeometry(1.5 + Math.random() * 2, 16, 16);
    const orbMat = new THREE.MeshBasicMaterial({
      color: orbColors[i % orbColors.length],
      transparent: true,
      opacity: 0.35,
      wireframe: false,
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.position.set(
      (Math.random() - 0.5) * 120,
      (Math.random() - 0.5) * 70,
      (Math.random() - 0.5) * 30
    );
    orb.userData = { speed: 0.003 + Math.random() * 0.005, offset: Math.random() * Math.PI * 2 };
    scene.add(orb);
    orbs.push(orb);
  }

  // Mouse parallax
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;

    // Animate nodes
    for (let i = 0; i < COUNT; i++) {
      nodeData[i].x += nodeData[i].vx;
      nodeData[i].y += nodeData[i].vy;
      nodeData[i].z += nodeData[i].vz;
      if (Math.abs(nodeData[i].x) > 80) nodeData[i].vx *= -1;
      if (Math.abs(nodeData[i].y) > 50) nodeData[i].vy *= -1;
      if (Math.abs(nodeData[i].z) > 30) nodeData[i].vz *= -1;
      positions[i * 3] = nodeData[i].x;
      positions[i * 3 + 1] = nodeData[i].y;
      positions[i * 3 + 2] = nodeData[i].z;
    }
    geo.attributes.position.needsUpdate = true;

    // Animate orbs
    orbs.forEach((orb, i) => {
      orb.position.y += Math.sin(t + orb.userData.offset) * 0.05;
      orb.rotation.x += orb.userData.speed;
      orb.rotation.y += orb.userData.speed * 0.7;
    });

    // Mouse parallax on camera
    camera.position.x += (mouseX * 8 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 5 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();
})();


// ── 2. 3D Tilt Effect on Cards ──────────────────────────────
(function initTilt() {
  const cards = document.querySelectorAll(
    '.project-card, .award-card, .skill-category, .stat-item, .education-card, .testimonial-card'
  );

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(800px) rotateY(${dx * 10}deg) rotateX(${-dy * 10}deg) translateZ(10px)`;
      card.style.boxShadow = `${-dx * 12}px ${dy * 12}px 40px rgba(37,99,235,0.25)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)';
      card.style.boxShadow = '';
      card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
})();


// ── 3. AI Cursor Trail ──────────────────────────────────────
(function initCursorTrail() {
  const trail = [];
  const TRAIL_COUNT = 12;

  for (let i = 0; i < TRAIL_COUNT; i++) {
    const dot = document.createElement('div');
    dot.className = 'cursor-trail-dot';
    dot.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      width: ${6 - i * 0.3}px; height: ${6 - i * 0.3}px;
      border-radius: 50%;
      background: hsl(${220 + i * 10}, 90%, 65%);
      opacity: ${1 - i / TRAIL_COUNT};
      transform: translate(-50%, -50%);
      transition: opacity 0.1s;
    `;
    document.body.appendChild(dot);
    trail.push({ el: dot, x: 0, y: 0 });
  }

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animateTrail() {
    let px = mx, py = my;
    trail.forEach((t, i) => {
      t.x += (px - t.x) * (0.35 - i * 0.02);
      t.y += (py - t.y) * (0.35 - i * 0.02);
      t.el.style.left = t.x + 'px';
      t.el.style.top = t.y + 'px';
      px = t.x; py = t.y;
    });
    requestAnimationFrame(animateTrail);
  }
  animateTrail();
})();


// ── 4. Typing Animation for Hero Subtitle ──────────────────
(function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const phrases = [
    'Senior Software Developer',
    'Full-Stack Engineer',
    'React & Node.js Expert',
    'AWS Cloud Architect',
    'AI & GenAI Enthusiast',
    'Team Lead & Mentor',
  ];

  let pi = 0, ci = 0, deleting = false;

  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(type, deleting ? 45 : 80);
  }
  type();
})();


// ── 5. Scroll-triggered section reveal ─────────────────────
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(
    '.timeline-item, .project-card, .award-card, .skill-category, .education-card, .testimonial-card, .stat-item'
  ).forEach(el => {
    el.classList.add('reveal-on-scroll');
    observer.observe(el);
  });
})();


// ── 6. Animated counter for stats ──────────────────────────
(function initCounters() {
  const stats = document.querySelectorAll('.stat-item h3');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const raw = el.textContent.replace(/[^0-9.]/g, '');
      const suffix = el.textContent.replace(/[0-9.]/g, '');
      const target = parseFloat(raw);
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = (Number.isInteger(target) ? Math.round(current) : current.toFixed(1)) + suffix;
        if (current >= target) clearInterval(timer);
      }, 25);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  stats.forEach(s => observer.observe(s));
})();


// ── 7. AI HUD Terminal Overlay in Hero ─────────────────────
(function initHUD() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const lines = [
    '> Initializing neural interface...',
    '> Loading skill matrix... [OK]',
    '> AWS cloud nodes: CONNECTED',
    '> GenAI engine: ACTIVE',
    '> Full-stack runtime: READY',
    '> Deploying portfolio v2.0...',
  ];

  const hud = document.createElement('div');
  hud.id = 'ai-hud';
  hud.style.cssText = `
    position:absolute; bottom:30px; left:30px; z-index:3;
    font-family:'Space Grotesk',monospace; font-size:11px;
    color:rgba(96,165,250,0.7); pointer-events:none;
    line-height:1.8; text-shadow:0 0 8px rgba(96,165,250,0.8);
  `;
  hero.appendChild(hud);

  let li = 0;
  function showLine() {
    if (li >= lines.length) { li = 0; hud.innerHTML = ''; }
    const span = document.createElement('div');
    span.textContent = '';
    hud.appendChild(span);
    let ci = 0;
    const t = setInterval(() => {
      span.textContent = lines[li].slice(0, ++ci);
      if (ci >= lines[li].length) { clearInterval(t); li++; setTimeout(showLine, 900); }
    }, 28);
  }
  showLine();
})();


// ── 8. Glitch Effect on Hero Name ──────────────────────────
(function initGlitch() {
  const title = document.querySelector('.hero-title .highlight');
  if (!title) return;
  const original = title.textContent;

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';

  function glitch() {
    let iter = 0;
    const interval = setInterval(() => {
      title.textContent = original.split('').map((c, i) => {
        if (i < iter) return original[i];
        return c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      if (iter >= original.length) { clearInterval(interval); title.textContent = original; }
      iter += 0.4;
    }, 30);
  }

  // Trigger on load + every 6s
  setTimeout(glitch, 1200);
  setInterval(glitch, 6000);
})();


// ── 9. Scan Line Sweep on Hero ──────────────────────────────
(function initScanLine() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const scan = document.createElement('div');
  scan.style.cssText = `
    position:absolute; left:0; right:0; height:2px; z-index:3;
    background:linear-gradient(90deg,transparent,rgba(96,165,250,0.6),rgba(167,139,250,0.8),rgba(96,165,250,0.6),transparent);
    box-shadow:0 0 20px rgba(96,165,250,0.5);
    pointer-events:none; top:0;
    animation: scanSweep 4s linear infinite;
  `;
  hero.appendChild(scan);

  const style = document.createElement('style');
  style.textContent = `
    @keyframes scanSweep {
      0%   { top: 0%; opacity:0; }
      5%   { opacity:1; }
      95%  { opacity:1; }
      100% { top: 100%; opacity:0; }
    }
  `;
  document.head.appendChild(style);
})();


// ── 10. Matrix Rain on section backgrounds ─────────────────
(function initMatrixRain() {
  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-canvas';
  canvas.style.cssText = `
    position:fixed; top:0; left:0; width:100%; height:100%;
    z-index:-1; pointer-events:none; opacity:0.04;
  `;
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / fontSize);
    drops = Array(cols).fill(1);
  });

  const fontSize = 13;
  let cols = Math.floor(canvas.width / fontSize);
  let drops = Array(cols).fill(1);
  const chars = '01アイウエオカキクケコABCDEF</>{}[]';

  function draw() {
    ctx.fillStyle = 'rgba(5,8,22,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#7c3aed';
    ctx.font = fontSize + 'px monospace';
    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, y * fontSize);
      if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }
  setInterval(draw, 60);
})();


// ── 11. AI Pulse Ring on Profile Image ─────────────────────
(function initPulseRing() {
  const img = document.querySelector('.profile-img');
  if (!img) return;

  for (let i = 0; i < 3; i++) {
    const ring = document.createElement('div');
    ring.style.cssText = `
      position:absolute; border-radius:50%;
      border:2px solid rgba(124,58,237,${0.6 - i * 0.15});
      animation: pulseRing ${1.8 + i * 0.6}s ease-out infinite;
      animation-delay:${i * 0.5}s;
      inset:-${(i + 1) * 12}px;
      pointer-events:none;
    `;
    img.style.position = 'relative';
    img.appendChild(ring);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulseRing {
      0%   { transform:scale(1); opacity:0.8; }
      100% { transform:scale(1.4); opacity:0; }
    }
  `;
  document.head.appendChild(style);
})();


// ── 12. Neon border flicker on nav logo ────────────────────
(function initLogoFlicker() {
  const logo = document.querySelector('.nav-logo h2');
  if (!logo) return;
  setInterval(() => {
    logo.style.filter = `drop-shadow(0 0 ${6 + Math.random() * 10}px rgba(124,58,237,${0.5 + Math.random() * 0.5}))`;
  }, 150);
})();


// ── Experience items scroll reveal ─────────────────────────
(function initExpReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('exp-visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.exp-item').forEach(el => observer.observe(el));
})();


// ── Hero Terminal Typewriter ────────────────────────────────
(function initTerminal() {
  const body = document.getElementById('terminal-body');
  if (!body) return;

  const lines = [
    { type: 'cmd',  text: 'whoami' },
    { type: 'out',  text: 'abhishek-raj  →  Senior Software Developer', cls: 'success' },
    { type: 'cmd',  text: 'cat skills.json | grep expertise' },
    { type: 'out',  text: '"React.js", "NestJS", "AWS", "GenAI", "Microservices"', cls: '' },
    { type: 'cmd',  text: 'git log --oneline -3' },
    { type: 'out',  text: 'a1b2c3  feat: Super App Platform v2.0 shipped', cls: 'success' },
    { type: 'out',  text: 'd4e5f6  feat: D2C cross-sell platform → production', cls: 'success' },
    { type: 'out',  text: 'g7h8i9  feat: Notification engine with BullMQ', cls: 'success' },
    { type: 'cmd',  text: 'echo $STATUS' },
    { type: 'out',  text: '✓ Available for new opportunities', cls: 'warn' },
  ];

  let li = 0, ci = 0;

  function nextLine() {
    if (li >= lines.length) { li = 0; body.innerHTML = ''; setTimeout(nextLine, 1000); return; }
    const l = lines[li];
    const div = document.createElement('div');
    div.className = 't-line';

    if (l.type === 'cmd') {
      div.innerHTML = `<span class="t-prompt">❯</span><span class="t-cmd"></span><span class="t-cursor"></span>`;
      body.appendChild(div);
      const cmdEl = div.querySelector('.t-cmd');
      const cur   = div.querySelector('.t-cursor');
      let i = 0;
      const t = setInterval(() => {
        cmdEl.textContent = l.text.slice(0, ++i);
        if (i >= l.text.length) { clearInterval(t); cur.remove(); li++; setTimeout(nextLine, 300); }
      }, 40);
    } else {
      div.innerHTML = `<span class="t-out ${l.cls || ''}">${l.text}</span>`;
      body.appendChild(div);
      li++; setTimeout(nextLine, 120);
    }
  }
  setTimeout(nextLine, 800);
})();


// ── Skill bar scroll animation ──────────────────────────────
(function initSkillBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.sb-fill').forEach(bar => bar.classList.add('animated'));
      observer.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  const grid = document.querySelector('.skill-bars-grid');
  if (grid) observer.observe(grid);
})();


// ── HUD live clock + CPU readout ───────────────────────────
(function initHUDReadout() {
  const timeEl = document.getElementById('hud-time');
  const cpuEl  = document.getElementById('hud-cpu');
  if (!timeEl) return;

  setInterval(() => {
    const now = new Date();
    timeEl.textContent = now.toTimeString().slice(0,8);
    // fake CPU fluctuation between 12–38%
    cpuEl.textContent = (12 + Math.floor(Math.random() * 26)) + '%';
  }, 1000);
})();


// ── Floating data packets (extra Three.js layer) ────────────
(function initDataPackets() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || !window.THREE) return;

  // inject extra animated rings into the scene via CSS canvas overlay
  const overlay = document.createElement('canvas');
  overlay.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;opacity:0.6;';
  document.querySelector('.hero').appendChild(overlay);

  const ctx = overlay.getContext('2d');
  function resize() { overlay.width = overlay.clientWidth; overlay.height = overlay.clientHeight; }
  resize();
  window.addEventListener('resize', resize);

  const rings = Array.from({length: 5}, (_, i) => ({
    x: Math.random() * overlay.width,
    y: Math.random() * overlay.height,
    r: 20 + Math.random() * 60,
    speed: 0.2 + Math.random() * 0.4,
    opacity: 0,
    growing: true,
    hue: [270, 220, 190, 320, 250][i],
    delay: i * 1200,
    lastTick: Date.now() + i * 1200,
  }));

  function drawRings() {
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    const now = Date.now();
    rings.forEach(ring => {
      if (now < ring.lastTick) return;
      if (ring.growing) { ring.r += ring.speed; ring.opacity = Math.min(ring.opacity + 0.015, 0.5); }
      if (ring.r > 120) { ring.growing = false; ring.opacity -= 0.02; }
      if (ring.opacity <= 0) {
        ring.r = 10 + Math.random() * 30;
        ring.x = Math.random() * overlay.width;
        ring.y = Math.random() * overlay.height;
        ring.growing = true; ring.opacity = 0;
        ring.lastTick = now + Math.random() * 2000;
      }
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${ring.hue},80%,65%,${ring.opacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    requestAnimationFrame(drawRings);
  }
  drawRings();
})();
