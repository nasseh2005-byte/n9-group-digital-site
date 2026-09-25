(() => {
  const mount = document.getElementById('intro-app');
  if (!mount) return;

  const copy = {
    ar: { label: 'مقدمة N9 GROUP', subtitle: 'للحلول الرقمية المتطورة', scroll: 'اكتشف حلولنا' },
    en: { label: 'N9 GROUP introduction', subtitle: 'Advanced Digital Solutions', scroll: 'Explore our solutions' }
  };
  const lang = () => document.documentElement.lang === 'en' ? 'en' : 'ar';

  mount.innerHTML = `
    <div class="n9intro-photo" aria-hidden="true"></div>
    <div class="n9intro-vignette" aria-hidden="true"></div>
    <div class="n9intro-grain" aria-hidden="true"></div>
    <canvas class="n9intro-stars" aria-hidden="true"></canvas>
    <div class="n9intro-glow" aria-hidden="true"></div>
    <div class="n9intro-content">
      <div class="n9intro-mark"><img src="assets/n9-group-mark.svg" width="244" height="244" alt=""></div>
      <div class="n9intro-name" aria-label="N9 GROUP">N9 GROUP</div>
      <span class="n9intro-tagline"></span>
      <span class="n9intro-rule" aria-hidden="true"></span>
    </div>
    <a class="n9intro-scroll" href="#intro"><span class="n9intro-scroll-text"></span><span class="n9intro-scroll-icon" aria-hidden="true"></span></a>
    <a class="n9intro-credit" href="https://science.nasa.gov/asset/webb/cosmic-cliffs-in-the-carina-nebula-nircam-image/" target="_blank" rel="noopener noreferrer">IMAGE: NASA / ESA / CSA / STScI</a>`;

  const section = mount.closest('section');
  const subtitle = mount.querySelector('.n9intro-tagline');
  const scrollText = mount.querySelector('.n9intro-scroll-text');
  function localize() {
    const strings = copy[lang()];
    section?.setAttribute('aria-label', strings.label);
    subtitle.textContent = strings.subtitle;
    scrollText.textContent = strings.scroll;
  }
  localize();
  document.addEventListener('n9-languagechange', localize);

  const canvas = mount.querySelector('canvas');
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const state = { w: 0, h: 0, stars: [], pointer: null, visible: true, frame: 0, raf: 0 };
  let seed = 9019;
  const random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; };

  function measure() {
    const rect = mount.getBoundingClientRect();
    state.w = Math.max(1, Math.round(rect.width));
    state.h = Math.max(1, Math.round(rect.height));
    const pixelRatio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(state.w * pixelRatio);
    canvas.height = Math.round(state.h * pixelRatio);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    seed = 9019;
    const count = Math.min(330, Math.max(125, Math.round(state.w * state.h / 3300)));
    state.stars = Array.from({ length: count }, () => ({
      x: random() * state.w,
      y: random() * state.h,
      radius: random() > .93 ? 1.6 + random() * 1.1 : .35 + random() * .95,
      alpha: .22 + random() * .65,
      phase: random() * Math.PI * 2,
      speed: .005 + random() * .012,
      hue: random() > .84 ? 43 : 209
    }));
    draw();
  }

  function draw() {
    const { w, h, pointer, stars } = state;
    ctx.clearRect(0, 0, w, h);
    const still = reduced.matches;
    const near = [];
    for (const star of stars) {
      const twinkle = still ? 1 : .76 + .24 * Math.sin(state.frame * star.speed + star.phase);
      const dx = pointer ? pointer.x - star.x : 10000;
      const dy = pointer ? pointer.y - star.y : 10000;
      const dist = Math.hypot(dx, dy);
      const influence = Math.max(0, 1 - dist / 130);
      if (influence > .12) near.push({ star, influence });
      const radius = star.radius * (1 + influence * .58);
      const alpha = Math.min(1, star.alpha * twinkle + influence * .32);
      ctx.beginPath();
      ctx.fillStyle = star.hue === 43 ? `rgba(247,218,174,${alpha})` : `rgba(222,237,255,${alpha})`;
      ctx.shadowBlur = radius > 1.3 || influence > .4 ? 12 + influence * 10 : 0;
      ctx.shadowColor = star.hue === 43 ? '#e8c78b' : '#aed3ff';
      ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    if (pointer && near.length > 1) {
      near.sort((a, b) => b.influence - a.influence);
      for (const { star, influence } of near.slice(0, 9)) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(211,231,255,${influence * .24})`;
        ctx.lineWidth = .7;
        ctx.moveTo(pointer.x, pointer.y);
        ctx.lineTo(star.x, star.y);
        ctx.stroke();
      }
    }
  }

  function loop() {
    state.raf = 0;
    if (!state.visible || reduced.matches) return;
    state.frame += 1;
    draw();
    state.raf = requestAnimationFrame(loop);
  }
  function start() { if (!state.raf && state.visible && !reduced.matches) state.raf = requestAnimationFrame(loop); }
  function stop() { if (state.raf) cancelAnimationFrame(state.raf); state.raf = 0; }

  let touchReset;
  function aimAt(event) {
    const rect = mount.getBoundingClientRect();
    state.pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    if (reduced.matches) draw();
  }
  mount.addEventListener('pointermove', aimAt, { passive: true });
  mount.addEventListener('pointerdown', (event) => {
    clearTimeout(touchReset);
    aimAt(event);
  }, { passive: true });
  mount.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'touch') return;
    state.pointer = null;
    if (reduced.matches) draw();
  });
  mount.addEventListener('pointerup', (event) => {
    if (event.pointerType === 'touch') touchReset = setTimeout(() => {
      state.pointer = null;
      if (reduced.matches) draw();
    }, 1000);
  });

  new ResizeObserver(measure).observe(mount);
  new IntersectionObserver(([entry]) => {
    state.visible = entry.isIntersecting;
    if (state.visible) start(); else stop();
  }, { threshold: 0 }).observe(mount);
  reduced.addEventListener?.('change', () => { if (reduced.matches) { stop(); draw(); } else start(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });
  document.addEventListener('n9-themechange', draw);
  measure();
  start();
})();
