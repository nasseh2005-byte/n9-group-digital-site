/* A separate, image-led journey through our galaxy and solar system. */
(() => {
  const mount = document.getElementById('solar-app');
  if (!mount) return;

  const bodies = [
    { id: 'sun', type: 'star' },
    { id: 'mercury', type: 'rocky' },
    { id: 'venus', type: 'rocky' },
    { id: 'earth', type: 'rocky' },
    { id: 'mars', type: 'rocky' },
    { id: 'jupiter', type: 'gas' },
    { id: 'saturn', type: 'gas' },
    { id: 'uranus', type: 'ice' },
    { id: 'neptune', type: 'ice' }
  ];

  // Short facts are based on NASA Science's solar-system and planet overviews.
  const copy = {
    ar: {
      galaxyTag: 'رحلة عبر الكون',
      galaxyTitle: 'من قلب المجرة، إلى كواكبنا.',
      galaxyText: 'اقترب من عالمنا عبر صور فضائية حقيقية، ثم اختر أي كوكب لتكتشف قصته.',
      galaxyEnter: 'ادخل المنظومة الشمسية',
      galaxyPosition: 'درب التبانة / ذراع الجبار',
      systemTag: 'رحلة تفاعلية / المنظومة الشمسية',
      systemTitle: 'كل عالم له قصة.',
      systemHint: 'اختر الشمس أو أحد الكواكب. اسحب للتنقل بينها.',
      back: 'العودة إلى المجرة',
      previous: 'العالم السابق',
      next: 'العالم التالي',
      motionOff: 'إيقاف الحركة',
      motionOn: 'تشغيل الحركة',
      soundOn: 'تشغيل صوت الفضاء الهادئ',
      soundOff: 'إيقاف صوت الفضاء',
      onward: 'اكتشف حلول N9 الرقمية',
      credit: 'صور وحقائق من NASA Science',
      scale: 'الأحجام والمسافات هنا عرض بصري غير مقياس.',
      of: 'من',
      types: { star: 'نجم', rocky: 'كوكب صخري', gas: 'عملاق غازي', ice: 'عملاق جليدي' },
      bodies: {
        sun: ['الشمس', 'قلب النظام الشمسي', 'نجمنا هو مصدر الضوء والحرارة، وتجذب جاذبيته كواكب المنظومة إلى مداراتها.'],
        mercury: ['عطارد', 'الأقرب إلى الشمس', 'أصغر كواكب المنظومة الشمسية وأقربها إلى نجمنا.'],
        venus: ['الزهرة', 'الكوكب الأشد حرارة', 'غلافه الجوي الكثيف يحبس الحرارة، فتكون حرارة سطحه أعلى من عطارد.'],
        earth: ['الأرض', 'كوكبنا الأزرق', 'عالمنا هو المكان الوحيد الذي نعرف حتى الآن بوجود حياة عليه.'],
        mars: ['المريخ', 'الكوكب الأحمر', 'لون سطحه المائل إلى الحمرة سببه أكاسيد الحديد، وتظهر فيه آثار ماء قديم.'],
        jupiter: ['المشتري', 'أكبر كواكب المنظومة', 'عملاق غازي تشتهر غيومه بالبقعة الحمراء الكبرى، وهي عاصفة هائلة.'],
        saturn: ['زحل', 'عالم الحلقات', 'تحيط به حلقات واسعة تتكون في معظمها من قطع الجليد والصخور.'],
        uranus: ['أورانوس', 'الكوكب المائل', 'عملاق جليدي يدور على جانبِه تقريباً، وهو ما يمنحه فصولاً شديدة الاختلاف.'],
        neptune: ['نبتون', 'أبعد الكواكب', 'عالم أزرق بعيد، تهب في غلافه الجوي رياح من الأسرع في المنظومة الشمسية.']
      }
    },
    en: {
      galaxyTag: 'A JOURNEY THROUGH SPACE',
      galaxyTitle: 'From our galaxy to our worlds.',
      galaxyText: 'Move closer to home through real space imagery, then choose a planet and discover its story.',
      galaxyEnter: 'ENTER THE SOLAR SYSTEM',
      galaxyPosition: 'MILKY WAY / ORION SPUR',
      systemTag: 'INTERACTIVE JOURNEY / SOLAR SYSTEM',
      systemTitle: 'Every world has a story.',
      systemHint: 'Choose the Sun or a planet. Swipe to move between them.',
      back: 'BACK TO THE GALAXY',
      previous: 'Previous world',
      next: 'Next world',
      motionOff: 'Pause motion',
      motionOn: 'Play motion',
      soundOn: 'Turn on quiet space ambience',
      soundOff: 'Turn off space ambience',
      onward: 'EXPLORE N9 DIGITAL SOLUTIONS',
      credit: 'Images and facts from NASA Science',
      scale: 'Sizes and distances are an artistic view, not to scale.',
      of: 'OF',
      types: { star: 'STAR', rocky: 'ROCKY PLANET', gas: 'GAS GIANT', ice: 'ICE GIANT' },
      bodies: {
        sun: ['Sun', 'Heart of the solar system', 'Our star supplies light and heat. Its gravity holds the planets in their orbits.'],
        mercury: ['Mercury', 'Closest to the Sun', 'The smallest planet in the solar system is also the nearest to our star.'],
        venus: ['Venus', 'The hottest planet', 'Its thick atmosphere traps heat, making its surface hotter than Mercury.'],
        earth: ['Earth', 'Our blue planet', 'Our world is the only place where we know life exists so far.'],
        mars: ['Mars', 'The red planet', 'Iron oxides color its surface red, where traces of ancient water remain.'],
        jupiter: ['Jupiter', 'The largest planet', 'A gas giant whose clouds hold the Great Red Spot, an enormous storm.'],
        saturn: ['Saturn', 'The ringed world', 'Its broad rings are made mostly of pieces of ice and rock.'],
        uranus: ['Uranus', 'The tilted planet', 'This ice giant spins almost on its side, giving it unusual seasons.'],
        neptune: ['Neptune', 'The farthest planet', 'A distant blue world with some of the fastest winds in the solar system.']
      }
    }
  };

  const asset = id => `assets/nasa/${id}.webp`;
  const bodyMarkup = body => `
    <button class="n9sol-choice" type="button" data-body="${body.id}" aria-pressed="false">
      <span class="n9sol-choice-art n9sol-body n9sol-body--${body.id}"><img src="${asset(body.id)}" alt="" loading="lazy" width="80" height="80"></span>
      <span class="n9sol-choice-name"></span>
    </button>`;

  mount.innerHTML = `
    <div class="n9sol" data-view="galaxy" data-selected="sun">
      <div class="n9sol-galaxy-view">
        <div class="n9sol-galaxy-photo" aria-hidden="true"></div>
        <div class="n9sol-galaxy-shade" aria-hidden="true"></div>
        <div class="n9sol-galaxy-stars" aria-hidden="true"></div>
        <div class="n9sol-galaxy-content">
          <span class="n9sol-kicker n9sol-galaxy-tag"></span>
          <h2 class="n9sol-galaxy-title"></h2>
          <p class="n9sol-galaxy-text"></p>
          <button class="n9sol-enter" type="button"><span class="n9sol-enter-label"></span><span aria-hidden="true">↗</span></button>
        </div>
        <div class="n9sol-galaxy-coordinates" aria-hidden="true"><span class="n9sol-galaxy-position"></span><span>01 / 02</span></div>
      </div>

      <div class="n9sol-system-view" aria-hidden="true">
        <div class="n9sol-system-atmosphere" aria-hidden="true"></div>
        <header class="n9sol-system-head">
          <button class="n9sol-back" type="button"><span aria-hidden="true">↙</span><span class="n9sol-back-label"></span></button>
          <span class="n9sol-kicker n9sol-system-tag"></span>
        </header>
        <div class="n9sol-system-heading"><h2 class="n9sol-system-title"></h2><p class="n9sol-system-hint"></p></div>
        <div class="n9sol-scene" tabindex="0" role="group">
          <div class="n9sol-sun-halo" aria-hidden="true"></div>
          <div class="n9sol-distant-sun n9sol-body n9sol-body--sun" aria-hidden="true"><img src="${asset('sun')}" alt="" loading="lazy" width="460" height="460"></div>
          <div class="n9sol-feature">
            <div class="n9sol-feature-art n9sol-body n9sol-body--sun"><img src="${asset('sun')}" alt="" width="460" height="460"></div>
            <div class="n9sol-feature-copy" aria-live="polite" aria-atomic="true">
              <span class="n9sol-feature-index"></span>
              <span class="n9sol-feature-type"></span>
              <h3 class="n9sol-feature-name"></h3>
              <strong class="n9sol-feature-lead"></strong>
              <p class="n9sol-feature-fact"></p>
            </div>
          </div>
          <div class="n9sol-scene-controls">
            <button class="n9sol-arrow n9sol-previous" type="button" aria-label=""><span aria-hidden="true">←</span></button>
            <span class="n9sol-counter" aria-hidden="true"></span>
            <button class="n9sol-arrow n9sol-next" type="button" aria-label=""><span aria-hidden="true">→</span></button>
          </div>
        </div>
        <nav class="n9sol-choices" aria-label=""><div class="n9sol-choice-track">${bodies.map(bodyMarkup).join('')}</div></nav>
        <div class="n9sol-footer">
          <div class="n9sol-footer-actions"><div class="n9sol-sensory-controls"><button class="n9sol-motion" type="button" aria-pressed="true"><span class="n9sol-motion-icon" aria-hidden="true">Ⅱ</span><span class="n9sol-motion-label"></span></button><button class="n9sol-sound" type="button" aria-pressed="false"><span class="n9sol-sound-icon" aria-hidden="true">♪</span><span class="n9sol-sound-label"></span></button></div><a class="n9sol-onward" href="#intro"><span class="n9sol-onward-label"></span><span aria-hidden="true">↗</span></a></div>
          <p class="n9sol-source"><a href="https://science.nasa.gov/solar-system/" target="_blank" rel="noopener noreferrer" class="n9sol-credit"></a><span aria-hidden="true"> · </span><span class="n9sol-scale"></span></p>
        </div>
      </div>
      <div class="n9sol-ai" aria-label="N9 AI COMING SOON"><span>N9 AI COMING SOON</span></div>
    </div>`;

  const root = mount.querySelector('.n9sol');
  const galaxyView = root.querySelector('.n9sol-galaxy-view');
  const systemView = root.querySelector('.n9sol-system-view');
  const featureArt = root.querySelector('.n9sol-feature-art');
  const featureImage = featureArt.querySelector('img');
  const scene = root.querySelector('.n9sol-scene');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let selected = 0;
  let motion = !reducedMotion.matches;
  let pointerStart = null;
  let audio = null;
  let soundOn = false;
  let audioRequest = 0;

  function language() { return document.documentElement.lang === 'en' ? 'en' : 'ar'; }
  function setText(selector, value) { root.querySelector(selector).textContent = value; }

  function localize() {
    const c = copy[language()];
    setText('.n9sol-galaxy-tag', c.galaxyTag);
    setText('.n9sol-galaxy-title', c.galaxyTitle);
    setText('.n9sol-galaxy-text', c.galaxyText);
    setText('.n9sol-enter-label', c.galaxyEnter);
    setText('.n9sol-galaxy-position', c.galaxyPosition);
    setText('.n9sol-system-tag', c.systemTag);
    setText('.n9sol-system-title', c.systemTitle);
    setText('.n9sol-system-hint', c.systemHint);
    setText('.n9sol-back-label', c.back);
    setText('.n9sol-motion-label', motion ? c.motionOff : c.motionOn);
    setText('.n9sol-sound-label', soundOn ? c.soundOff : c.soundOn);
    setText('.n9sol-onward-label', c.onward);
    setText('.n9sol-credit', c.credit);
    setText('.n9sol-scale', c.scale);
    root.querySelector('.n9sol-choices').setAttribute('aria-label', language() === 'en' ? 'Choose a celestial body' : 'اختر جرماً سماوياً');
    root.querySelector('.n9sol-previous').setAttribute('aria-label', c.previous);
    root.querySelector('.n9sol-next').setAttribute('aria-label', c.next);
    root.querySelector('.n9sol-scene').setAttribute('aria-label', c.systemHint);
    root.querySelectorAll('.n9sol-choice').forEach((button, index) => {
      const name = c.bodies[bodies[index].id][0];
      button.querySelector('.n9sol-choice-name').textContent = name;
      button.setAttribute('aria-label', name);
    });
    updateBody(false);
  }

  function updateBody(animate = true) {
    const body = bodies[selected];
    const c = copy[language()];
    const [name, lead, fact] = c.bodies[body.id];
    root.dataset.selected = body.id;
    featureArt.className = `n9sol-feature-art n9sol-body n9sol-body--${body.id}`;
    featureImage.src = asset(body.id);
    featureImage.width = body.id === 'saturn' ? 620 : 460;
    featureImage.height = 460;
    setText('.n9sol-feature-index', `${String(selected + 1).padStart(2, '0')} / ${String(bodies.length).padStart(2, '0')}`);
    setText('.n9sol-feature-type', c.types[body.type]);
    setText('.n9sol-feature-name', name);
    setText('.n9sol-feature-lead', lead);
    setText('.n9sol-feature-fact', fact);
    setText('.n9sol-counter', `${String(selected + 1).padStart(2, '0')} ${c.of} ${String(bodies.length).padStart(2, '0')}`);
    root.querySelectorAll('.n9sol-choice').forEach((button, index) => {
      const active = index === selected;
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (animate && motion) {
      featureArt.classList.remove('is-arriving');
      void featureArt.offsetWidth;
      featureArt.classList.add('is-arriving');
    }
    if (root.dataset.view === 'system') {
      const nav = root.querySelector('.n9sol-choices');
      const choice = root.querySelector('.n9sol-choice.is-selected');
      const navRect = nav.getBoundingClientRect();
      const choiceRect = choice.getBoundingClientRect();
      const delta = choiceRect.left < navRect.left ? choiceRect.left - navRect.left - 8 : choiceRect.right > navRect.right ? choiceRect.right - navRect.right + 8 : 0;
      if (delta) nav.scrollBy({ left: delta, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    }
  }

  function select(index) {
    selected = (index + bodies.length) % bodies.length;
    updateBody();
  }

  function showSystem() {
    root.dataset.view = 'system';
    systemView.setAttribute('aria-hidden', 'false');
    galaxyView.setAttribute('aria-hidden', 'true');
    root.querySelector('.n9sol-back').focus({ preventScroll: true });
  }

  function showGalaxy() {
    root.dataset.view = 'galaxy';
    systemView.setAttribute('aria-hidden', 'true');
    galaxyView.setAttribute('aria-hidden', 'false');
    root.querySelector('.n9sol-enter').focus({ preventScroll: true });
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
    const button = root.querySelector('.n9sol-sound');
    if (soundOn && !audio) {
      try { audio = createAudio(); } catch { audio = null; }
    }
    if (soundOn && !audio) { soundOn = false; button.disabled = true; }
    if (audio) {
      const { context, master } = audio;
      if (soundOn && !document.hidden) {
        try {
          await context.resume();
          if (request !== audioRequest) return;
          master.gain.setTargetAtTime(.012, context.currentTime, .4);
        } catch { soundOn = false; }
      } else {
        master.gain.setTargetAtTime(0, context.currentTime, .15);
        setTimeout(() => { if ((!soundOn || document.hidden) && context.state === 'running') context.suspend().catch(() => {}); }, 650);
      }
    }
    button.setAttribute('aria-pressed', String(soundOn));
    button.classList.toggle('is-on', soundOn);
    button.querySelector('.n9sol-sound-icon').textContent = soundOn ? '♫' : '♪';
    setText('.n9sol-sound-label', soundOn ? copy[language()].soundOff : copy[language()].soundOn);
  }

  // A failed image leaves its named CSS planet silhouette visible.
  mount.addEventListener('error', event => {
    if (event.target instanceof HTMLImageElement && event.target.closest('.n9sol-body')) {
      event.target.parentElement.classList.add('is-fallback');
    }
  }, true);
  featureImage.addEventListener('load', () => featureArt.classList.remove('is-fallback'));

  root.querySelector('.n9sol-enter').addEventListener('click', showSystem);
  root.querySelector('.n9sol-back').addEventListener('click', showGalaxy);
  root.querySelector('.n9sol-previous').addEventListener('click', () => select(selected - 1));
  root.querySelector('.n9sol-next').addEventListener('click', () => select(selected + 1));
  root.querySelectorAll('.n9sol-choice').forEach((button, index) => button.addEventListener('click', () => select(index)));
  root.querySelector('.n9sol-motion').addEventListener('click', () => {
    motion = !motion;
    root.classList.toggle('is-paused', !motion);
    root.querySelector('.n9sol-motion').setAttribute('aria-pressed', String(motion));
    root.querySelector('.n9sol-motion-icon').textContent = motion ? 'Ⅱ' : '▶';
    localize();
  });
  root.querySelector('.n9sol-sound').addEventListener('click', () => { soundOn = !soundOn; updateAudio(); });
  scene.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const forward = document.documentElement.dir === 'rtl' ? event.key === 'ArrowLeft' : event.key === 'ArrowRight';
      select(selected + (forward ? 1 : -1));
    }
  });
  scene.addEventListener('pointerdown', event => {
    if (event.target.closest('button, a')) return;
    pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
  });
  scene.addEventListener('pointerup', event => {
    if (!pointerStart || event.pointerId !== pointerStart.id) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) select(selected + (dx < 0 ? 1 : -1));
  });
  scene.addEventListener('pointercancel', () => { pointerStart = null; });
  document.addEventListener('n9-languagechange', localize);
  document.addEventListener('visibilitychange', () => { if (audio && soundOn) updateAudio(); });
  reducedMotion.addEventListener?.('change', event => {
    if (event.matches) {
      motion = false;
      root.classList.add('is-paused');
      root.querySelector('.n9sol-motion').setAttribute('aria-pressed', 'false');
      root.querySelector('.n9sol-motion-icon').textContent = '▶';
      localize();
    }
  });
  if (!motion) root.classList.add('is-paused');
  localize();
})();
