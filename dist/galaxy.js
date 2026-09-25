/* N9 solar-system introduction. Orbits are an artistic illustration, not a scale model. */
(() => {
  const mount = document.getElementById('galaxy-app');
  if (!mount) return;

  const planetData = [
    { id: 'mercury', angle: 3.58, pace: 1.65, size: 12 },
    { id: 'venus', angle: 5.22, pace: 1.27, size: 19 },
    { id: 'earth', angle: 0.18, pace: 1, size: 21 },
    { id: 'mars', angle: 4.25, pace: .81, size: 16 },
    { id: 'jupiter', angle: 1.02, pace: .58, size: 43 },
    { id: 'saturn', angle: 2.45, pace: .44, size: 37 },
    { id: 'uranus', angle: 5.66, pace: .32, size: 27 },
    { id: 'neptune', angle: 3.04, pace: .25, size: 26 }
  ];
  const order = ['sun', ...planetData.map(planet => planet.id)];
  const copy = {
    ar: {
      universe: 'N9 / عالم من الإمكانات',
      orbitNote: 'المدارات تصور فني مبسط',
      instruction: 'اختر كوكبًا لتكتشفه',
      navigation: 'كواكب المنظومة الشمسية',
      controls: 'التحكم بالمجرة',
      play: 'تشغيل حركة الكواكب',
      pause: 'إيقاف حركة الكواكب مؤقتًا',
      soundOn: 'تشغيل صوت الفضاء الهادئ',
      soundOff: 'إيقاف صوت الفضاء',
      speed: 'سرعة الحركة',
      reset: 'العودة إلى مركز المجرة',
      close: 'إغلاق معلومات الكوكب',
      brand: 'للحلول الرقمية المتطورة',
      discover: 'تابع الاكتشاف',
      soon: 'N9 AI COMING SOON',
      stage: 'مجرة N9 التفاعلية. اسحب لتغيير المشهد أو استخدم السهمين لتدوير الكواكب.',
      planets: {
        sun: ['الشمس', 'قلب المنظومة الشمسية', 'نجم يمدّ الأرض والكواكب بالضوء والحرارة.'],
        mercury: ['عطارد', 'الأقرب إلى الشمس', 'أصغر كواكب المنظومة الشمسية، وعامه أقصر من أعوام بقية الكواكب.'],
        venus: ['الزهرة', 'الكوكب الأكثر حرارة', 'غلافه الجوي الكثيف يحبس الحرارة، فتفوق حرارة سطحه كل الكواكب.'],
        earth: ['الأرض', 'موطننا الأزرق', 'الكوكب الوحيد الذي نعرف وجود حياة عليه حتى الآن.'],
        mars: ['المريخ', 'الكوكب الأحمر', 'لون تربته من أكاسيد الحديد، وعلى سطحه آثار مياه قديمة.'],
        jupiter: ['المشتري', 'عملاق المنظومة', 'أكبر الكواكب، وفي غلافه الجوي عاصفة تُعرف بالبقعة الحمراء الكبرى.'],
        saturn: ['زحل', 'ملك الحلقات', 'تحيط به حلقات واسعة تتكون في معظمها من الجليد والصخور.'],
        uranus: ['أورانوس', 'العملاق الجليدي المائل', 'يدور حول محوره بزاوية ميل كبيرة، فيبدو كأنه يتدحرج في مداره.'],
        neptune: ['نبتون', 'آخر الكواكب', 'أبعد الكواكب عن الشمس، وتتحرك في غلافه الجوي رياح شديدة.']
      }
    },
    en: {
      universe: 'N9 / A UNIVERSE OF POSSIBILITIES',
      orbitNote: 'Orbits are an artistic illustration',
      instruction: 'Choose a planet to explore',
      navigation: 'Solar system planets',
      controls: 'Galaxy controls',
      play: 'Play planet motion',
      pause: 'Pause planet motion',
      soundOn: 'Turn on quiet space ambience',
      soundOff: 'Turn off space ambience',
      speed: 'Orbit speed',
      reset: 'Return to the galaxy center',
      close: 'Close planet information',
      brand: 'ADVANCED DIGITAL SOLUTIONS',
      discover: 'DISCOVER WHAT WE BUILD',
      soon: 'N9 AI COMING SOON',
      stage: 'Interactive N9 galaxy. Drag to explore or use the arrow keys to rotate the planets.',
      planets: {
        sun: ['Sun', 'The center of our solar system', 'The star that gives Earth and the planets light and warmth.'],
        mercury: ['Mercury', 'Closest to the Sun', 'The smallest planet, with a shorter year than any other planet.'],
        venus: ['Venus', 'The hottest planet', 'Its thick atmosphere traps heat, making it hotter than any other planet.'],
        earth: ['Earth', 'Our blue home', 'The only planet where we know life exists so far.'],
        mars: ['Mars', 'The red planet', 'Iron-rich soil gives it its color; traces of ancient water remain.'],
        jupiter: ['Jupiter', 'Giant of the solar system', 'The largest planet is home to the Great Red Spot, a vast storm.'],
        saturn: ['Saturn', 'The ringed planet', 'Its broad rings are made mostly of ice and rocky material.'],
        uranus: ['Uranus', 'The tilted ice giant', 'Its axis has a dramatic tilt, so it appears to roll along its orbit.'],
        neptune: ['Neptune', 'The outermost planet', 'The farthest planet from the Sun has powerful winds in its atmosphere.']
      }
    }
  };

  mount.innerHTML = `
    <div class="n9gal-wrap">
      <div class="n9gal-topline"><span class="n9gal-kicker"></span><span class="n9gal-orbit-note"></span></div>
      <div class="n9gal-sky" tabindex="0" role="group">
        <div class="n9gal-nebula" aria-hidden="true"></div>
        <div class="n9gal-stars" aria-hidden="true"></div>
        <div class="n9gal-orbits" aria-hidden="true"></div>
        <button class="n9gal-core" type="button" data-planet="sun">
          <span class="n9gal-sunlight" aria-hidden="true"></span>
          <span class="n9gal-core-disc" aria-hidden="true"><img src="assets/n9-group-mark.svg" alt="" width="132" height="132"></span>
          <span class="n9gal-brand" aria-hidden="true"><strong>N9</strong><small></small></span>
        </button>
        <div class="n9gal-planets"></div>
        <div class="n9gal-info" hidden aria-live="polite">
          <button class="n9gal-info-close" type="button" aria-label=""></button>
          <span class="n9gal-info-count"></span>
          <h2 class="n9gal-info-title"></h2>
          <strong class="n9gal-info-lead"></strong>
          <p class="n9gal-info-fact"></p>
        </div>
        <div class="n9gal-drag-hint"></div>
      </div>
      <div class="n9gal-toolbar">
        <div class="n9gal-planet-nav" role="group"></div>
        <div class="n9gal-controls" role="group">
          <button class="n9gal-control n9gal-motion" type="button"><span class="n9gal-control-icon" aria-hidden="true">Ⅱ</span></button>
          <button class="n9gal-control n9gal-speed" type="button"><span class="n9gal-speed-value" aria-hidden="true">1×</span></button>
          <button class="n9gal-control n9gal-sound" type="button" aria-pressed="false"><span class="n9gal-control-icon" aria-hidden="true">♪</span></button>
          <button class="n9gal-control n9gal-reset" type="button"><span class="n9gal-control-icon" aria-hidden="true">◎</span></button>
        </div>
      </div>
      <div class="n9gal-footline">
        <div class="n9gal-ai"><span class="n9gal-ai-stars" aria-hidden="true">✦ · ✧</span><span>N9 <b>AI</b> COMING SOON</span><span class="n9gal-ai-stars" aria-hidden="true">✧ · ✦</span></div>
        <a class="n9gal-scroll" href="#intro"><span></span><span class="n9gal-scroll-arrow" aria-hidden="true">↓</span></a>
      </div>
    </div>`;

  const sky = mount.querySelector('.n9gal-sky');
  const orbits = mount.querySelector('.n9gal-orbits');
  const stars = mount.querySelector('.n9gal-stars');
  const planetLayer = mount.querySelector('.n9gal-planets');
  const nav = mount.querySelector('.n9gal-planet-nav');
  const info = mount.querySelector('.n9gal-info');
  const motionButton = mount.querySelector('.n9gal-motion');
  const speedButton = mount.querySelector('.n9gal-speed');
  const soundButton = mount.querySelector('.n9gal-sound');
  const resetButton = mount.querySelector('.n9gal-reset');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const speedValues = [.5, 1, 2];
  let speedIndex = 1;
  let selected = null;
  let phase = 0;
  let viewAngle = 0;
  let lastFrame = 0;
  let frameId = 0;
  let isPlaying = !reducedMotion.matches;
  let inView = true;
  let dragStart = null;
  let audio = null;
  let soundOn = false;
  let audioRequest = 0;

  const pseudoRandom = (seed) => {
    let value = seed >>> 0;
    return () => {
      value = (value * 1664525 + 1013904223) >>> 0;
      return value / 4294967296;
    };
  };
  const random = pseudoRandom(90209);
  const starFragment = document.createDocumentFragment();
  for (let index = 0; index < 112; index++) {
    const star = document.createElement('i');
    star.className = 'n9gal-star';
    star.style.left = `${(random() * 100).toFixed(2)}%`;
    star.style.top = `${(random() * 100).toFixed(2)}%`;
    star.style.width = star.style.height = `${random() > .9 ? 3 : random() > .55 ? 2 : 1}px`;
    star.style.setProperty('--star-opacity', `${(.22 + random() * .7).toFixed(2)}`);
    star.style.animationDelay = `${(-random() * 6).toFixed(2)}s`;
    starFragment.append(star);
  }
  stars.append(starFragment);

  for (const planet of planetData) {
    const ring = document.createElement('span');
    ring.className = 'n9gal-orbit';
    ring.dataset.orbit = planet.id;
    orbits.append(ring);
    const button = document.createElement('button');
    button.className = `n9gal-planet n9gal-planet--${planet.id}`;
    button.type = 'button';
    button.dataset.planet = planet.id;
    button.innerHTML = '<span class="n9gal-planet-disc" aria-hidden="true"></span><span class="n9gal-planet-label" aria-hidden="true"></span>';
    planetLayer.append(button);
    planet.button = button;
    planet.ring = ring;
  }
  for (const id of order) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `n9gal-nav-item n9gal-nav-item--${id}`;
    button.dataset.select = id;
    button.innerHTML = '<span class="n9gal-nav-dot" aria-hidden="true"></span><span class="n9gal-nav-name"></span>';
    nav.append(button);
  }

  function language() { return document.documentElement.lang === 'en' ? 'en' : 'ar'; }
  function localize() {
    const lang = language();
    const labels = copy[lang];
    mount.dir = lang === 'ar' ? 'rtl' : 'ltr';
    mount.querySelector('.n9gal-kicker').textContent = labels.universe;
    mount.querySelector('.n9gal-orbit-note').textContent = labels.orbitNote;
    mount.querySelector('.n9gal-drag-hint').textContent = labels.instruction;
    mount.querySelector('.n9gal-brand small').textContent = labels.brand;
    mount.querySelector('.n9gal-scroll span').textContent = labels.discover;
    sky.setAttribute('aria-label', labels.stage);
    nav.setAttribute('aria-label', labels.navigation);
    mount.querySelector('.n9gal-controls').setAttribute('aria-label', labels.controls);
    mount.querySelector('.n9gal-core').setAttribute('aria-label', `${labels.planets.sun[0]} — N9 ${labels.brand}`);
    mount.querySelector('.n9gal-info-close').setAttribute('aria-label', labels.close);
    motionButton.setAttribute('aria-label', isPlaying ? labels.pause : labels.play);
    speedButton.setAttribute('aria-label', `${labels.speed}: ${speedValues[speedIndex]}×`);
    soundButton.setAttribute('aria-label', soundOn ? labels.soundOff : labels.soundOn);
    resetButton.setAttribute('aria-label', labels.reset);
    for (const planet of planetData) {
      const name = labels.planets[planet.id][0];
      planet.button.setAttribute('aria-label', name);
      planet.button.querySelector('.n9gal-planet-label').textContent = name;
    }
    for (const button of nav.querySelectorAll('button')) {
      button.querySelector('.n9gal-nav-name').textContent = labels.planets[button.dataset.select][0];
      button.setAttribute('aria-label', labels.planets[button.dataset.select][0]);
    }
    if (selected) showInfo(selected);
  }

  function showInfo(id) {
    selected = id;
    const entry = copy[language()].planets[id];
    info.hidden = false;
    sky.classList.add('has-info');
    info.querySelector('.n9gal-info-count').textContent = `${String(order.indexOf(id) + 1).padStart(2, '0')} / 09`;
    info.querySelector('.n9gal-info-title').textContent = entry[0];
    info.querySelector('.n9gal-info-lead').textContent = entry[1];
    info.querySelector('.n9gal-info-fact').textContent = entry[2];
    mount.querySelectorAll('[data-planet], [data-select]').forEach((button) => {
      const active = button.dataset.planet === id || button.dataset.select === id;
      button.classList.toggle('is-selected', active);
      if (button.dataset.select) button.setAttribute('aria-pressed', String(active));
    });
  }
  function clearInfo() {
    selected = null;
    info.hidden = true;
    sky.classList.remove('has-info');
    mount.querySelectorAll('[data-planet], [data-select]').forEach((button) => {
      button.classList.remove('is-selected');
      if (button.dataset.select) button.setAttribute('aria-pressed', 'false');
    });
  }

  function layout() {
    const width = sky.clientWidth;
    const height = sky.clientHeight;
    const mobile = width < 700;
    const outerX = Math.min(width * (mobile ? .455 : .43), 585);
    const outerY = Math.min(height * (mobile ? .36 : .36), mobile ? 205 : 255);
    const innerX = mobile ? Math.max(53, outerX * .31) : Math.max(119, outerX * .27);
    const innerY = mobile ? Math.max(43, outerY * .28) : Math.max(66, outerY * .3);
    const centerX = width / 2;
    const centerY = height * (mobile ? .47 : .48);
    mount.style.setProperty('--n9gal-center-x', `${centerX}px`);
    mount.style.setProperty('--n9gal-center-y', `${centerY}px`);
    planetData.forEach((planet, index) => {
      const ratio = index / (planetData.length - 1);
      const rx = innerX + (outerX - innerX) * ratio;
      const ry = innerY + (outerY - innerY) * ratio;
      const ring = planet.ring;
      ring.style.left = `${centerX}px`;
      ring.style.top = `${centerY}px`;
      ring.style.width = `${rx * 2}px`;
      ring.style.height = `${ry * 2}px`;
      planet.rx = rx;
      planet.ry = ry;
      planet.centerX = centerX;
      planet.centerY = centerY;
      planet.button.style.setProperty('--planet-size', `${Math.round(planet.size * (mobile ? .76 : 1))}px`);
    });
    render();
  }
  function render() {
    for (const planet of planetData) {
      const angle = planet.angle + phase * planet.pace + viewAngle;
      const depth = (Math.sin(angle) + 1) / 2;
      planet.button.style.left = `${planet.centerX + Math.cos(angle) * planet.rx}px`;
      planet.button.style.top = `${planet.centerY + Math.sin(angle) * planet.ry}px`;
      planet.button.style.zIndex = depth > .49 ? '8' : '3';
      planet.button.style.setProperty('--planet-depth', (0.84 + depth * .3).toFixed(3));
    }
  }
  function frame(now) {
    if (!isPlaying || !inView) { frameId = 0; lastFrame = 0; return; }
    if (lastFrame) phase += Math.min((now - lastFrame) / 1000, .05) * .115 * speedValues[speedIndex];
    lastFrame = now;
    render();
    frameId = requestAnimationFrame(frame);
  }
  function updateMotion() {
    motionButton.querySelector('span').textContent = isPlaying ? 'Ⅱ' : '▶';
    motionButton.setAttribute('aria-pressed', String(isPlaying));
    motionButton.setAttribute('aria-label', isPlaying ? copy[language()].pause : copy[language()].play);
    if (isPlaying && inView && !frameId) frameId = requestAnimationFrame(frame);
    if (!isPlaying && frameId) { cancelAnimationFrame(frameId); frameId = 0; lastFrame = 0; }
  }

  function createAudio() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    const context = new AudioContextClass();
    const master = context.createGain();
    master.gain.value = 0;
    master.connect(context.destination);
    for (const [frequency, level] of [[55, .56], [82.4, .26], [110.2, .1]]) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.value = level;
      oscillator.connect(gain).connect(master);
      oscillator.start();
    }
    return { context, master };
  }
  async function updateAudio() {
    const request = ++audioRequest;
    if (soundOn && !audio) {
      try { audio = createAudio(); } catch { audio = null; }
    }
    if (soundOn && !audio) { soundOn = false; soundButton.disabled = true; }
    soundButton.setAttribute('aria-pressed', String(soundOn));
    soundButton.classList.toggle('is-on', soundOn);
    soundButton.setAttribute('aria-label', soundOn ? copy[language()].soundOff : copy[language()].soundOn);
    if (audio) {
      const { context, master } = audio;
      if (soundOn && !document.hidden) {
        try {
          await context.resume();
          if (request !== audioRequest) return;
          master.gain.setTargetAtTime(.014, context.currentTime, .35);
        } catch { soundOn = false; }
      } else {
        master.gain.setTargetAtTime(0, context.currentTime, .12);
        setTimeout(() => { if ((!soundOn || document.hidden) && context.state === 'running') context.suspend().catch(() => {}); }, 600);
      }
    }
    soundButton.setAttribute('aria-pressed', String(soundOn));
    soundButton.classList.toggle('is-on', soundOn);
    soundButton.setAttribute('aria-label', soundOn ? copy[language()].soundOff : copy[language()].soundOn);
  }

  mount.addEventListener('click', (event) => {
    const select = event.target.closest('[data-planet], [data-select]');
    if (select && mount.contains(select)) showInfo(select.dataset.planet || select.dataset.select);
  });
  info.querySelector('.n9gal-info-close').addEventListener('click', clearInfo);
  motionButton.addEventListener('click', () => { isPlaying = !isPlaying; updateMotion(); });
  speedButton.addEventListener('click', () => {
    speedIndex = (speedIndex + 1) % speedValues.length;
    const speed = speedValues[speedIndex];
    speedButton.querySelector('span').textContent = `${speed}×`;
    speedButton.setAttribute('aria-label', `${copy[language()].speed}: ${speed}×`);
  });
  soundButton.addEventListener('click', () => { soundOn = !soundOn; updateAudio(); });
  resetButton.addEventListener('click', () => { phase = 0; viewAngle = 0; clearInfo(); render(); sky.focus({ preventScroll: true }); });
  sky.addEventListener('keydown', (event) => {
    if (event.target !== sky) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      viewAngle += event.key === 'ArrowRight' ? .16 : -.16;
      render();
    }
  });
  sky.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button, a')) return;
    dragStart = { x: event.clientX, angle: viewAngle, id: event.pointerId };
    sky.setPointerCapture(event.pointerId);
    sky.classList.add('is-dragging');
  });
  sky.addEventListener('pointermove', (event) => {
    if (!dragStart || event.pointerId !== dragStart.id) return;
    viewAngle = dragStart.angle + (event.clientX - dragStart.x) * .009;
    render();
  });
  function endDrag(event) {
    if (dragStart && event.pointerId === dragStart.id) {
      dragStart = null;
      sky.classList.remove('is-dragging');
    }
  }
  sky.addEventListener('pointerup', endDrag);
  sky.addEventListener('pointercancel', endDrag);
  sky.addEventListener('lostpointercapture', endDrag);
  document.addEventListener('n9-languagechange', localize);
  document.addEventListener('visibilitychange', () => { if (audio && soundOn) updateAudio(); });
  reducedMotion.addEventListener?.('change', (event) => { if (event.matches) { isPlaying = false; updateMotion(); } });
  if ('ResizeObserver' in window) new ResizeObserver(layout).observe(sky);
  else window.addEventListener('resize', layout);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) updateMotion();
      else if (frameId) { cancelAnimationFrame(frameId); frameId = 0; lastFrame = 0; }
    }, { threshold: .02 }).observe(mount);
  }
  localize();
  nav.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', 'false'));
  updateMotion();
  layout();
})();
