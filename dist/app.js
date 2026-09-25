(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = matchMedia('(pointer: coarse)').matches;
  const normalize = (value) => String(value || '')
    .toLocaleLowerCase('ar')
    .normalize('NFKD')
    .replace(/[\u064b-\u065f]/g, '')
    .trim();

  document.documentElement.classList.add('has-js');

  // The hero uses a sampled text mask: the stars are real points that return to N9.
  const hero = $('.hero');
  const canvas = $('#stars');
  const ctx = canvas?.getContext('2d');
  if (ctx) {
    let width = 0;
    let height = 0;
    let points = [];
    let ambient = [];
    let running = false;
    let parallax = 0;
    const pointer = { x: -9999, y: -9999, down: false };
    const random = (min, max) => Math.random() * (max - min) + min;

    function layoutStars() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const mask = document.createElement('canvas');
      mask.width = Math.max(380, Math.floor(width * .45));
      mask.height = Math.max(260, Math.floor(height * .45));
      const maskContext = mask.getContext('2d');
      if (!maskContext) return;
      maskContext.fillStyle = '#fff';
      maskContext.font = `700 ${Math.min(mask.width * .42, 180)}px Space Grotesk, Arial`;
      maskContext.textAlign = 'center';
      maskContext.textBaseline = 'middle';
      maskContext.fillText('N9', mask.width / 2, mask.height / 2);

      const pixels = maskContext.getImageData(0, 0, mask.width, mask.height).data;
      const step = width < 650 ? 7 : 6;
      points = [];
      for (let y = 0; y < mask.height; y += step) {
        for (let x = 0; x < mask.width; x += step) {
          if (pixels[(y * mask.width + x) * 4 + 3] < 120 || Math.random() < .28) continue;
          const tx = width * (width < 530 ? .5 : .27)
            + (x - mask.width / 2) * Math.min(1.55, width / mask.width * .8);
          const ty = height * (width < 530 ? .82 : .49)
            + (y - mask.height / 2) * 1.28;
          points.push({
            x: tx + random(-40, 40), y: ty + random(-40, 40), tx, ty,
            vx: 0, vy: 0, radius: random(.75, 1.8), alpha: random(.5, 1)
          });
        }
      }
      ambient = Array.from({ length: Math.min(width < 600 ? 90 : 250, Math.floor(width * height / 3300)) }, () => ({
        x: random(0, width), y: random(0, height), radius: random(.35, 1.3),
        alpha: random(.15, .7), depth: random(.05, .3)
      }));
      if (reducedMotion) drawStars();
      else if (!running) {
        running = true;
        requestAnimationFrame(drawStars);
      }
    }

    function drawStars() {
      ctx.clearRect(0, 0, width, height);
      for (const star of ambient) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(210,224,255,${star.alpha})`;
        const y = (star.y + parallax * star.depth) % height;
        ctx.arc(star.x, y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const star of points) {
        const dx = star.x - pointer.x;
        const dy = star.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (!reducedMotion && distance < 95) {
          const force = (1 - distance / 95) * (pointer.down ? 1.8 : .65);
          star.vx += dx / (distance || 1) * force;
          star.vy += dy / (distance || 1) * force;
        }
        star.vx = (star.vx + (star.tx - star.x) * .018) * .88;
        star.vy = (star.vy + (star.ty - star.y) * .018) * .88;
        star.x += star.vx;
        star.y += star.vy;
        const selected = distance < 100 && !coarsePointer && !reducedMotion;
        ctx.beginPath();
        ctx.fillStyle = selected ? 'rgba(229,199,127,.95)' : `rgba(204,223,255,${star.alpha})`;
        ctx.arc(star.x, star.y, selected ? star.radius * 1.55 : star.radius, 0, Math.PI * 2);
        ctx.fill();
        if (selected && distance < 70) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(222,192,120,${(1 - distance / 70) * .24})`;
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }
      if (!reducedMotion) requestAnimationFrame(drawStars);
    }

    if (!coarsePointer && !reducedMotion) {
      hero.addEventListener('pointermove', (event) => {
        const bounds = hero.getBoundingClientRect();
        pointer.x = event.clientX - bounds.left;
        pointer.y = event.clientY - bounds.top;
        hero.style.setProperty('--nebula-x', `${pointer.x / width * 100}%`);
        hero.style.setProperty('--nebula-y', `${pointer.y / height * 100}%`);
      });
      hero.addEventListener('pointerleave', () => {
        pointer.x = -9999;
        pointer.y = -9999;
        pointer.down = false;
      });
      hero.addEventListener('pointerdown', () => { pointer.down = true; });
      window.addEventListener('pointerup', () => { pointer.down = false; });
    }
    window.addEventListener('resize', layoutStars, { passive: true });
    layoutStars();
    document.fonts?.ready.then(layoutStars);
    window.addEventListener('scroll', () => {
      if (window.innerWidth >= 600 && !reducedMotion) parallax = Math.min(window.scrollY, height);
    }, { passive: true });
  }

  // Reading progress, active navigation and motion with a static reduced-motion fallback.
  const progress = $('#scroll-progress');
  const header = $('#site-header');
  let scrollScheduled = false;
  function updateScrollUI() {
    const limit = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${limit > 0 ? Math.min(100, scrollY / limit * 100) : 0}%`;
    header.classList.toggle('is-scrolled', scrollY > 20);
    scrollScheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollScheduled) {
      scrollScheduled = true;
      requestAnimationFrame(updateScrollUI);
    }
  }, { passive: true });
  updateScrollUI();

  if ('IntersectionObserver' in window) {
    const navigation = new Map($$('.desktop-nav a').map((link) => [link.hash.slice(1), link]));
    const sectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const link of navigation.values()) link.removeAttribute('aria-current');
        navigation.get(entry.target.id)?.setAttribute('aria-current', 'location');
      }
    }, { rootMargin: '-25% 0px -60% 0px' });
    for (const id of navigation.keys()) {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    }

    if (!reducedMotion) {
      const revealTargets = $$('.section-head, .service-card, .tech-item, .process-step, .lab-panel, .project-card, .planner-form, .brief-summary, .faq-list');
      const revealObserver = new IntersectionObserver((entries, observer) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }, { threshold: .08, rootMargin: '0px 0px 50px 0px' });
      for (const item of revealTargets) {
        item.classList.add('reveal');
        revealObserver.observe(item);
      }
    }
    const processSteps = $$('.process-step');
    const processObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const step = visible.target;
      processSteps.forEach((item) => item.classList.toggle('is-active', item === step));
      $('#process-number').textContent = String(Number(step.dataset.step) + 1).padStart(2, '0');
      $('#process-name').textContent = $('h3', step).textContent;
    }, { rootMargin: '-20% 0px -35% 0px', threshold: [.15, .5, .9] });
    processSteps.forEach((step) => processObserver.observe(step));
  }

  // A small product demonstration with explicit sample data.
  const initialTasks = [
    { id: 1, title: 'طلب استشارة', stage: 0 },
    { id: 2, title: 'مراجعة مستند', stage: 1 },
    { id: 3, title: 'متابعة موعد', stage: 2 }
  ];
  let tasks = initialTasks.map((task) => ({ ...task }));
  let nextTaskId = 4;
  function renderTasks() {
    for (let stage = 0; stage < 3; stage++) {
      const stack = $(`#stage-${stage}`);
      stack.replaceChildren();
      const stageTasks = tasks.filter((task) => task.stage === stage);
      $(`#count-${stage}`).textContent = stageTasks.length;
      for (const task of stageTasks) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'demo-card';
        button.disabled = task.stage === 2;
        button.setAttribute('aria-label', task.stage === 2
          ? `${task.title} مكتملة`
          : `نقل ${task.title} إلى المرحلة التالية`);
        const title = document.createElement('strong');
        title.textContent = task.title;
        const hint = document.createElement('small');
        hint.textContent = task.stage === 2 ? 'اكتملت المهمة' : 'اضغط للانتقال للمرحلة التالية ↗';
        button.append(title, hint);
        button.addEventListener('click', () => {
          task.stage++;
          renderTasks();
          $('#demo-status').textContent = `انتقلت «${task.title}» إلى ${['جديد', 'قيد العمل', 'مكتمل'][task.stage]}.`;
        });
        stack.append(button);
      }
    }
  }
  renderTasks();
  $('#demo-add').addEventListener('click', () => {
    const task = { id: nextTaskId, title: `مهمة تجريبية ${nextTaskId}`, stage: 0 };
    nextTaskId++;
    tasks.push(task);
    renderTasks();
    $('#demo-status').textContent = `أُضيفت «${task.title}» إلى مرحلة جديد.`;
  });
  $('#demo-reset').addEventListener('click', () => {
    tasks = initialTasks.map((task) => ({ ...task }));
    nextTaskId = 4;
    renderTasks();
    $('#demo-status').textContent = 'أُعيدت البيانات التجريبية إلى بدايتها.';
  });

  // Projects retain ordinary external links if JavaScript is unavailable.
  const projectData = {
    taksim: {
      title: 'تقسيم بوينت', category: 'مطاعم · موقع إلكتروني',
      description: 'حضور رقمي للمطعم التركي يجمع القصة والفروع ومعلومات التجربة.',
      features: ['قصة المطعم وتجربته', 'صفحات الفروع والقوائم', 'معرض صور وفيديو'],
      url: 'https://taksimpoint.sa/'
    },
    funland: {
      title: 'ملاهي جزيرة المرح', category: 'ترفيه · موقع إلكتروني',
      description: 'واجهة ترفيهية عربية تبرز هوية جزيرة المرح وتجربة الزيارة.',
      features: ['عرض الأنشطة والألعاب', 'هوية مرئية مرحة', 'تجربة مناسبة للجوال'],
      url: 'https://funlandinc.vercel.app/ar/'
    },
    malki: {
      title: 'سلطان المالكي للمحاماة', category: 'قطاع قانوني · شريك',
      description: 'شريك قانوني حاضر ضمن أعمال N9 GROUP، مع إبراز هويته المهنية.',
      features: ['هوية قانونية متخصصة', 'شعار الشريك كما قُدّم لنا'],
      url: null
    },
    hall: {
      title: 'قاعة ميديل إيست', category: 'ضيافة ومناسبات · موقع إلكتروني',
      description: 'موقع يعرض القاعة بصورها وتفاصيلها لمساعدة الزائر على استكشاف المكان.',
      features: ['صور للقاعة', 'تفاصيل تجربة المناسبة', 'واجهة عربية'],
      url: 'https://middle-east-celebrations-hall.vercel.app/'
    },
    library: {
      title: 'المكتبة القانونية', category: 'معرفة قانونية · منصة رقمية',
      description: 'منصة للمحتوى القانوني تعرض المواد ضمن تجربة منظمة.',
      features: ['تنظيم المحتوى القانوني', 'هوية N9 Library', 'واجهة للوصول إلى المعرفة'],
      url: 'https://n9-library.vercel.app/'
    },
    ium: {
      title: 'جامعة مينيسوتا الأمريكية الإسلامية', category: 'تعليم · بوابة رقمية',
      description: 'بوابة رقمية للخدمات والأدوات المرتبطة بالجامعة.',
      features: ['خدمات وأدوات رقمية', 'واجهة مستخدم عربية', 'مدخل واضح للبوابة'],
      url: 'https://n9-frontend-7e53.vercel.app/'
    },
    law: {
      title: 'N9 LAW SYSTEM', category: 'LEGAL TECH · SAAS',
      description: 'مساحة عمل قانونية بنموذج SaaS تُظهر توجهنا نحو الأنظمة المتخصصة.',
      features: ['مساحة عمل رقمية', 'تجربة مخصصة للقطاع القانوني', 'نظام قائم على الويب'],
      url: 'https://n9-law-workspace.n9-law-system.workers.dev/'
    }
  };
  const projectCards = $$('.project-card[data-project]');
  let activeFilter = 'all';
  function updateProjects() {
    const query = normalize($('#project-search').value);
    let visible = 0;
    for (const card of projectCards) {
      const matchesFilter = activeFilter === 'all' || card.dataset.category === activeFilter;
      const matchesQuery = !query || normalize(card.textContent).includes(query);
      card.hidden = !(matchesFilter && matchesQuery);
      if (!card.hidden) visible++;
    }
    $('#project-count').textContent = `عرض ${visible} من ${projectCards.length} أعمال`;
    $('#project-empty').hidden = visible > 0;
  }
  $$('.filter-button').forEach((button) => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    $$('.filter-button').forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    updateProjects();
  }));
  $('#project-search').addEventListener('input', updateProjects);

  const detailDialog = $('#detail-dialog');
  function openProject(key) {
    const project = projectData[key];
    if (!project) return;
    $('#detail-category').textContent = project.category;
    $('#detail-title').textContent = project.title;
    $('#detail-description').textContent = project.description;
    const list = $('#detail-features');
    list.replaceChildren();
    for (const feature of project.features) {
      const item = document.createElement('li');
      item.textContent = feature;
      list.append(item);
    }
    const link = $('#detail-link');
    link.hidden = !project.url;
    if (project.url) link.href = project.url;
    detailDialog.showModal();
  }
  projectCards.forEach((card) => card.addEventListener('click', (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if (card.tagName === 'A') event.preventDefault();
    openProject(card.dataset.project);
  }));
  $('.project-detail')?.addEventListener('click', (event) => {
    event.stopPropagation();
    openProject('malki');
  });
  $('#close-detail').addEventListener('click', () => detailDialog.close());
  detailDialog.addEventListener('click', (event) => { if (event.target === detailDialog) detailDialog.close(); });
  if (!coarsePointer && !reducedMotion) {
    const cursor = $('#cursor-label');
    $$('.service-card, .project-card').forEach((card) => {
      card.addEventListener('pointerenter', () => {
        cursor.textContent = card.classList.contains('service-card') ? 'خطّط لمشروعك ↗' : 'تفاصيل المشروع ↗';
        cursor.classList.add('is-visible');
      });
      card.addEventListener('pointermove', (event) => {
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;
      });
      card.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
    });
  }

  // The brief keeps only choices on this device; free text is never saved locally.
  const form = $('#brief-form');
  const serviceOptions = $$('input[name="service"]', form);
  const priorityOptions = $$('input[name="priority"]', form);
  const description = $('#brief-description');
  const storageKey = 'n9-brief-choices-v1';
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (saved && typeof saved === 'object') {
      serviceOptions.find((input) => input.value === saved.service)?.click();
      priorityOptions.forEach((input) => { input.checked = Array.isArray(saved.priorities) && saved.priorities.includes(input.value); });
    }
  } catch { /* Storage can be disabled by the browser. */ }

  function updateBrief() {
    const service = serviceOptions.find((input) => input.checked)?.value || 'موقع إلكتروني';
    const priorities = priorityOptions.filter((input) => input.checked).map((input) => input.value);
    const note = description.value.trim();
    $('#summary-service').textContent = service;
    $('#summary-priorities').textContent = priorities.length ? priorities.join(' · ') : 'حدد ما يهمك من القائمة';
    $('#char-count').textContent = `${description.value.length} / 500`;
    $$('.service-card').forEach((card) => {
      card.classList.toggle('is-selected', $('.service-select', card).dataset.service === service);
    });
    const message = [
      'مرحباً N9 GROUP، أود مناقشة مشروع جديد.',
      `نوع المشروع: ${service}`,
      `الأولويات: ${priorities.length ? priorities.join('، ') : 'نحددها معاً'}`,
      note ? `فكرة المشروع: ${note}` : null
    ].filter(Boolean).join('\n');
    $('#brief-whatsapp').href = `https://wa.me/966530021367?text=${encodeURIComponent(message)}`;
    $('#brief-email').href = `mailto:nasseh2005@gmail.com?subject=${encodeURIComponent('طلب مشروع جديد — N9 GROUP')}&body=${encodeURIComponent(message)}`;
    try { localStorage.setItem(storageKey, JSON.stringify({ service, priorities })); }
    catch { /* The builder still works when storage is unavailable. */ }
  }
  form.addEventListener('input', updateBrief);
  form.addEventListener('change', updateBrief);
  form.addEventListener('submit', (event) => event.preventDefault());
  updateBrief();
  $$('.service-select').forEach((button) => button.addEventListener('click', () => {
    serviceOptions.find((input) => input.value === button.dataset.service).checked = true;
    updateBrief();
    $('#planner').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  }));

  // Keyboard search indexes sections and actual project names.
  const commandDialog = $('#command-dialog');
  const commandInput = $('#command-search');
  const commands = [
    { title: 'خدماتنا', kind: 'قسم', href: '#services' },
    { title: 'قوتنا التقنية', kind: 'قسم', href: '#technology' },
    { title: 'رحلة التنفيذ', kind: 'قسم', href: '#process' },
    { title: 'مختبر N9', kind: 'قسم', href: '#lab' },
    { title: 'أعمالنا', kind: 'قسم', href: '#projects' },
    { title: 'خطتك', kind: 'قسم', href: '#planner' },
    { title: 'التواصل', kind: 'قسم', href: '#contact' },
    ...Object.entries(projectData).map(([key, project]) => ({ title: project.title, kind: 'مشروع', key }))
  ];
  function renderCommands() {
    const query = normalize(commandInput.value);
    const results = $('#command-results');
    results.replaceChildren();
    const matches = commands.filter((item) => !query || normalize(`${item.title} ${item.kind}`).includes(query)).slice(0, 9);
    for (const item of matches) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = `${item.title} · ${item.kind}`;
      button.addEventListener('click', () => {
        commandDialog.close();
        if (item.href) document.querySelector(item.href)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
        else openProject(item.key);
      });
      results.append(button);
    }
    if (!matches.length) results.textContent = 'لا توجد نتيجة مطابقة.';
  }
  function openCommands() {
    commandInput.value = '';
    renderCommands();
    commandDialog.showModal();
    commandInput.focus();
  }
  $('#open-command').addEventListener('click', openCommands);
  $('#close-command').addEventListener('click', () => commandDialog.close());
  commandInput.addEventListener('input', renderCommands);
  commandInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      $('#command-results button')?.click();
    }
  });
  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (!commandDialog.open) openCommands();
    }
  });

  let toastTimer;
  function toast(message) {
    const element = $('#toast');
    element.textContent = message;
    element.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => element.classList.remove('is-visible'), 3200);
  }
  $('#copy-email').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('NASSEH2005@GMAIL.COM');
      toast('تم نسخ البريد الإلكتروني.');
    } catch {
      toast('تعذّر النسخ تلقائياً؛ يمكنك تحديد البريد ونسخه.');
    }
  });
  $$('.faq-list details').forEach((detail) => detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    $$('.faq-list details').forEach((other) => { if (other !== detail) other.open = false; });
  }));

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
  }

  let installPrompt;
  addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installPrompt = event;
    $('#install-site').hidden = false;
  });
  $('#install-site').addEventListener('click', async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') toast('أُضيف الموقع إلى جهازك.');
    installPrompt = undefined;
    $('#install-site').hidden = true;
  });
  $('#share-site').addEventListener('click', async () => {
    const url = location.origin + location.pathname;
    try {
      if (navigator.share) await navigator.share({ title: 'N9 GROUP', url });
      else {
        await navigator.clipboard.writeText(url);
        toast('تم نسخ رابط الموقع.');
      }
    } catch (error) {
      if (error?.name !== 'AbortError') toast('تعذّرت المشاركة من هذا المتصفح.');
    }
  });
})();
