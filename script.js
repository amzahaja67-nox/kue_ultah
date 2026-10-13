    /* --------------------------------------------------------------------------
       1. CANVAS SYSTEM: BOKEH, DUST, SMOKE, CONFETTI & DYNAMIC FIREWORKS
       -------------------------------------------------------------------------- */
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const goldPalette = ['#e6c575', '#c9a44c', '#f5e3ba', '#d4af37', '#ffffff'];
    const confettiPalette = ['#d4af37', '#ffffff', '#e2c27c', '#c73053', '#f0e2b8'];

    const bokehs = [];
    const dustParticles = [];
    const smokeParticles = [];
    const confettis = [];
    const fireworks = [];

    // Subtle, soft bokeh stars
    // Keep the ambient background light while the fireworks remain unchanged.
    for (let i = 0; i < 16; i++) {
      bokehs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 14 + 6,
        color: goldPalette[Math.floor(Math.random() * goldPalette.length)],
        alpha: Math.random() * 0.15 + 0.03,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -Math.random() * 0.25 - 0.05,
      });
    }

    // Floating delicate gold dust
    for (let i = 0; i < 30; i++) {
      dustParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 0.6,
        color: goldPalette[Math.floor(Math.random() * goldPalette.length)],
        alpha: Math.random() * 0.5 + 0.15,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.4 - 0.1,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    function addSmokeParticle(x, y) {
      if (smokeParticles.length >= 40 || Math.random() > 0.35) return;
      smokeParticles.push({
        x: x + (Math.random() - 0.5) * 3,
        y: y,
        size: Math.random() * 2 + 1.5,
        alpha: 0.25,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.9 - 0.5,
        growth: 0.08,
      });
    }

    function spawnConfetti() {
      for (let i = 0; i < 70; i++) {
        confettis.push({
          x: Math.random() * width,
          y: -Math.random() * 150 - 20,
          w: Math.random() * 8 + 5,
          h: Math.random() * 5 + 3,
          color: confettiPalette[Math.floor(Math.random() * confettiPalette.length)],
          vx: (Math.random() - 0.5) * 1.6,
          vy: Math.random() * 2.0 + 1.4,
          rotation: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 5,
          opacity: 0.9,
        });
      }

      // Avoid stacking old confetti when the button is pressed repeatedly.
      if (confettis.length > 140) {
        confettis.splice(0, confettis.length - 140);
      }
    }

    // --- FIREWORKS SYSTEM ---
    function createFireworkExplosion(startX, startY) {
      const particleCount = 70 + Math.floor(Math.random() * 30);
      const colorSet = [
        '#ffd700', '#ff3c6a', '#00e5ff', '#ffffff', 
        '#ff9100', '#e040fb', '#76ff03', '#fff59d', '#ff1744'
      ];
      const primaryColor = colorSet[Math.floor(Math.random() * colorSet.length)];

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 / particleCount) * i + (Math.random() - 0.5) * 0.25;
        const speed = Math.random() * 7 + 2;
        fireworks.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 0.07,
          friction: 0.965,
          alpha: 1,
          decay: Math.random() * 0.014 + 0.008,
          size: Math.random() * 3.2 + 1.5,
          color: Math.random() > 0.25 ? primaryColor : '#ffffff'
        });
      }
    }

    function triggerFireworks() {
      const burstCount = 8;
      for (let b = 0; b < burstCount; b++) {
        setTimeout(() => {
          const x = Math.random() * (width * 0.82) + (width * 0.09);
          const y = Math.random() * (height * 0.45) + (height * 0.1);
          createFireworkExplosion(x, y);
        }, b * 200);
      }
      spawnConfetti();
    }

    /* --- LETTER MODAL LOGIC --- */
    function openLetter() {
      const overlay = document.getElementById('letterOverlay');
      overlay.classList.add('active');
    }

    function closeLetter() {
      const overlay = document.getElementById('letterOverlay');
      overlay.classList.remove('active');
    }

    function closeLetterOnBackdrop(e) {
      if (e.target.id === 'letterOverlay') {
        closeLetter();
      }
    }

    const candleEl = document.getElementById('candleAssembly');

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      // 1. Subtle Bokeh Stars
      for (let b of bokehs) {
        b.x += b.vx;
        b.y += b.vy;
        if (b.y < -b.radius) { b.y = height + b.radius; b.x = Math.random() * width; }

        ctx.save();
        ctx.globalAlpha = b.alpha;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.filter = 'blur(10px)';
        ctx.fill();
        ctx.restore();
      }

      // 2. Floating Dust
      for (let d of dustParticles) {
        d.x += d.vx;
        d.y += d.vy;
        d.alpha += Math.sin(Date.now() * d.pulseSpeed) * 0.008;
        if (d.alpha < 0.1) d.alpha = 0.1;
        if (d.alpha > 0.65) d.alpha = 0.65;

        if (d.y < 0) { d.y = height; d.x = Math.random() * width; }

        ctx.save();
        ctx.globalAlpha = d.alpha;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = d.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = d.color;
        ctx.fill();
        ctx.restore();
      }

      // 3. Smoke Trail
      if (candleEl) {
        const rect = candleEl.getBoundingClientRect();
        const candleX = rect.left + rect.width / 2;
        const candleY = rect.top - 5;
        addSmokeParticle(candleX, candleY);
      }

      for (let i = smokeParticles.length - 1; i >= 0; i--) {
        let s = smokeParticles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.size += s.growth;
        s.alpha -= 0.005;

        if (s.alpha <= 0) {
          smokeParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(210, 195, 175, 0.4)';
        ctx.filter = 'blur(3px)';
        ctx.fill();
        ctx.restore();
      }

      // 4. Fireworks Particles Burst
      for (let i = fireworks.length - 1; i >= 0; i--) {
        let p = fireworks[i];
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          fireworks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

      // 5. Luxury Gold Confetti
      for (let i = confettis.length - 1; i >= 0; i--) {
        let c = confettis[i];
        c.x += c.vx + Math.sin(c.y * 0.02);
        c.y += c.vy;
        c.rotation += c.vRot;

        if (c.y > height + 20) {
          confettis.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate((c.rotation * Math.PI) / 180);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.restore();
      }

      requestAnimationFrame(renderCanvas);
    }

    renderCanvas();

    /* --------------------------------------------------------------------------
       2. GSAP ANIMATIONS
       -------------------------------------------------------------------------- */
    window.addEventListener('DOMContentLoaded', () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      gsap.set('#tierBottom', { y: 50, opacity: 0 });
      gsap.set('#tierMiddle', { y: 50, opacity: 0 });
      gsap.set('#tierTop', { y: 50, opacity: 0 });
      gsap.set('#candleAssembly', { y: -40, opacity: 0 });
      gsap.set('#textContainer', { y: 30, opacity: 0 });

      tl.to('#tierBottom', { y: 0, opacity: 1, duration: 0.7 })
        .to('#tierMiddle', { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
        .to('#tierTop', { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
        .to('#candleAssembly', { y: 0, opacity: 1, duration: 0.7, ease: 'bounce.out' }, '-=0.2')
        .to('#textContainer', {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
          onComplete: () => {
            spawnConfetti();
          }
        }, '-=0.3');

      // Floating Cake Motion
      gsap.to('#cakeAssembly', {
        y: -10,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2.2
      });

      // Refined Soft Glow Animation on Title
      gsap.to('.neon-title', {
        textShadow: `
          0 0 12px rgba(255, 235, 175, 0.8),
          0 0 25px rgba(212, 175, 55, 0.6),
          0 0 45px rgba(180, 135, 30, 0.4)
        `,
        duration: 2.0,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });
  
