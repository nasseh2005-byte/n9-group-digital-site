(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = matchMedia('(pointer: coarse)').matches;
  const normalize = (value) => String(value || '')
    .toLocaleLowerCase(document.documentElement.lang === 'en' ? 'en' : 'ar')
    .normalize('NFKD')
    .replace(/[\u064b-\u065f]/g, '')
    .trim();

  const locales = window.N9_TRANSLATIONS || {};
  let currentLang = document.documentElement.lang === 'en' ? 'en' : 'ar';
  const originalTitle = document.title;
  const descriptionMeta = document.querySelector('meta[name="description"]');
  const originalDescription = descriptionMeta?.content || '';
  const staticText = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!/[\u0600-\u06ff]/.test(node.nodeValue || '')) return NodeFilter.FILTER_REJECT;
      if (node.parentElement?.closest('script, style')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  while (walker.nextNode()) staticText.push({ node: walker.currentNode, original: walker.currentNode.nodeValue });
  const staticAttributes = [];
  for (const element of document.querySelectorAll('[aria-label], [title], [placeholder], [alt]')) {
    for (const name of ['aria-label', 'title', 'placeholder', 'alt']) {
      const original = element.getAttribute(name);
      if (original && /[\u0600-\u06ff]/.test(original)) staticAttributes.push({ element, name, original });
    }
  }
  function translated(original) {
    if (currentLang !== 'en') return original;
    return locales.en?.text?.[original] || locales.en?.attributes?.[original] || original;
  }
  const englishUI = () => locales.en?.dynamic?.ui || {};
  const formatText = (template, values = {}) => String(template || '').replace(/\{(\w+)\}/g,
    (_, key) => String(values[key] ?? ''));
  function translateStaticText() {
    for (const { node, original } of staticText) {
      const value = original.trim();
      if (!value) continue;
      const start = original.indexOf(value);
      node.nodeValue = original.slice(0, start) + translated(value) + original.slice(start + value.length);
    }
    for (const { element, name, original } of staticAttributes) element.setAttribute(name, translated(original));
    document.title = currentLang === 'en' ? (locales.en?.title || originalTitle) : originalTitle;
    if (descriptionMeta) descriptionMeta.content = currentLang === 'en'
      ? (locales.en?.description || originalDescription) : originalDescription;
  }
  translateStaticText();

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
          const tx = width * (width < 530 ? .5 : document.documentElement.dir === 'ltr' ? .73 : .27)
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
      const lightTheme = document.documentElement.dataset.theme === 'light';
      for (const star of ambient) {
        ctx.beginPath();
        ctx.fillStyle = lightTheme ? `rgba(42,67,112,${star.alpha * .75})` : `rgba(210,224,255,${star.alpha})`;
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
        const selected = distance < 100;
        ctx.beginPath();
        ctx.fillStyle = selected ? (lightTheme ? 'rgba(145,91,28,.95)' : 'rgba(229,199,127,.95)')
          : (lightTheme ? `rgba(45,72,119,${star.alpha})` : `rgba(204,223,255,${star.alpha})`);
        ctx.arc(star.x, star.y, selected ? star.radius * 1.55 : star.radius, 0, Math.PI * 2);
        ctx.fill();
        if (selected && distance < 70) {
          ctx.beginPath();
          ctx.strokeStyle = lightTheme
            ? `rgba(143,93,31,${(1 - distance / 70) * .24})`
            : `rgba(222,192,120,${(1 - distance / 70) * .24})`;
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }
      if (!reducedMotion) requestAnimationFrame(drawStars);
    }

    let touchReset;
    function aimAt(event) {
      const bounds = hero.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      hero.style.setProperty('--nebula-x', `${pointer.x / width * 100}%`);
      hero.style.setProperty('--nebula-y', `${pointer.y / height * 100}%`);
      if (reducedMotion) drawStars();
    }
    hero.addEventListener('pointermove', aimAt, { passive: true });
    hero.addEventListener('pointerdown', (event) => {
      clearTimeout(touchReset);
      pointer.down = true;
      aimAt(event);
    }, { passive: true });
    hero.addEventListener('pointerleave', (event) => {
      if (event.pointerType === 'touch') return;
      pointer.x = -9999;
      pointer.y = -9999;
      pointer.down = false;
      if (reducedMotion) drawStars();
    });
    window.addEventListener('pointerup', (event) => {
      pointer.down = false;
      if (event.pointerType === 'touch') touchReset = setTimeout(() => {
        pointer.x = -9999;
        pointer.y = -9999;
        if (reducedMotion) drawStars();
      }, 900);
    });
    window.addEventListener('resize', layoutStars, { passive: true });
    document.addEventListener('n9-themechange', () => { if (reducedMotion) drawStars(); });
    document.addEventListener('n9-languagechange', layoutStars);
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
    const navigation = new Map();
    for (const link of $$('.desktop-nav a, .mobile-quick-nav a')) {
      const id = link.hash.slice(1);
      if (!navigation.has(id)) navigation.set(id, []);
      navigation.get(id).push(link);
    }
    const sectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const links of navigation.values()) for (const link of links) link.removeAttribute('aria-current');
        for (const link of navigation.get(entry.target.id) || []) link.setAttribute('aria-current', 'location');
      }
    }, { rootMargin: '-25% 0px -60% 0px' });
    for (const id of navigation.keys()) {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    }

    if (!reducedMotion) {
      const revealTargets = $$('.section-head, .service-card, .tech-item, .process-step, .project-card, .planner-form, .brief-summary, .faq-list');
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
    },
    sms: {
      title: 'SMS WEB | N9 SMS', category: 'أرشفة الرسائل · منصة ويب',
      description: 'مساحة عمل لتنظيم رسائل الشركات والبحث فيها ومطابقتها وتصدير أدلتها.',
      features: ['استيراد أرشيف XML لكل شركة', 'البحث والمطابقة بمعرّف أو قائمة Excel', 'تصدير PNG وPDF وZIP'],
      url: 'https://sms-kappa-beige.vercel.app/'
    }
  };
  function localizedProject(key) {
    const original = projectData[key];
    if (currentLang !== 'en') return original;
    const english = locales.en?.dynamic?.projects?.[key];
    return english ? { ...original, ...english } : original;
  }
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
    $('#project-count').textContent = currentLang === 'en'
      ? formatText(englishUI().projectCount, { visible, total: projectCards.length })
      : `عرض ${visible} من ${projectCards.length} أعمال`;
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
  updateProjects();

  const detailDialog = $('#detail-dialog');
  let currentProjectKey = null;
  function showProjectDetails(key) {
    const project = localizedProject(key);
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
    if (!detailDialog.open) detailDialog.showModal();
    currentProjectKey = key;
  }
  function openProject(key) { showProjectDetails(key); }
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
        cursor.textContent = currentLang === 'en'
          ? card.classList.contains('service-card') ? englishUI().cursor?.service : englishUI().cursor?.project
          : card.classList.contains('service-card') ? 'خطّط لمشروعك ↗' : 'تفاصيل المشروع ↗';
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
  const goalOptions = $$('input[name="goal"]', form);
  const priorityOptions = $$('input[name="priority"]', form);
  const description = $('#brief-description');
  const storageKey = 'n9-brief-choices-v1';
  const recommendations = {
    'موقع إلكتروني': {
      'جذب عملاء جدد': { ar: ['موقع يحوّل الزيارة إلى تواصل', 'اجعل خدماتك واضحة من أول لحظة، وقدّم للزائر طريقاً سهلاً للتواصل معك.'], en: ['A website that turns visits into conversations', 'Present your services clearly and give visitors an easy way to reach you.'], options: ['تصميم وهوية مخصصة', 'تحسين الظهور في البحث', 'حجوزات أو طلبات'] },
      'تنظيم العمل': { ar: ['موقع متصل بعملياتك', 'اجمع الطلبات والمتابعة في مسار واحد يمنح فريقك وقتاً أكبر لخدمة العملاء.'], en: ['A website connected to your workflow', 'Bring requests and follow-up into one clear flow for your team.'], options: ['لوحة تحكم', 'حجوزات أو طلبات', 'تكاملات API'] },
      'إطلاق خدمة جديدة': { ar: ['انطلاقة واضحة لخدمتك الجديدة', 'قدّم فكرتك بهوية قوية وتجربة تساعد العملاء على اتخاذ الخطوة التالية.'], en: ['A clear launch for your new service', 'Introduce your offer with a strong identity and a clear next step for customers.'], options: ['تصميم وهوية مخصصة', 'حجوزات أو طلبات', 'لغات متعددة'] }
    },
    'نظام SaaS': {
      'جذب عملاء جدد': { ar: ['منصة تبدأ مع أول عميل', 'امنح المستخدمين تجربة دخول واضحة وخدمة يسهل البدء بها.'], en: ['A platform ready for its first customers', 'Give users a clear entry point and a service that is easy to start using.'], options: ['حسابات مستخدمين', 'تصميم وهوية مخصصة', 'تكاملات API'] },
      'تنظيم العمل': { ar: ['مساحة عمل تجمع فريقك', 'تابع ما يحدث من لوحة واحدة، وحدد من يصل إلى كل جزء من النظام.'], en: ['One workspace for your team', 'Track work from one dashboard and give each person the access they need.'], options: ['لوحة تحكم', 'حسابات مستخدمين', 'تكاملات API'] },
      'إطلاق خدمة جديدة': { ar: ['منتج رقمي قابل للنمو', 'ابدأ بالوظائف الأهم، ثم وسّع التجربة بحسب استخدام عملائك.'], en: ['A digital product built to grow', 'Start with the essential features, then expand with your customers’ needs.'], options: ['حسابات مستخدمين', 'لوحة تحكم', 'لغات متعددة'] }
    },
    'حل تقني حسب الطلب': {
      'جذب عملاء جدد': { ar: ['رحلة عميل مصممة لك', 'اربط كل نقطة تواصل بخطوة واضحة تناسب جمهورك وطبيعة خدمتك.'], en: ['A customer journey designed for you', 'Connect every touchpoint to a clear next step that fits your service.'], options: ['حجوزات أو طلبات', 'تكاملات API', 'تصميم وهوية مخصصة'] },
      'تنظيم العمل': { ar: ['عمليات أقل تعقيداً', 'اربط أدواتك وامنح فريقك لوحة متابعة بدلاً من التنقل بين أنظمة متفرقة.'], en: ['Simpler daily operations', 'Connect your tools and give your team one place to follow the work.'], options: ['تكاملات API', 'لوحة تحكم', 'حسابات مستخدمين'] },
      'إطلاق خدمة جديدة': { ar: ['حل خاص يفتح خدمة جديدة', 'ابنِ تجربة تناسب فكرتك بدقة، مع أساس يمكن توسيعه لاحقاً.'], en: ['A tailored foundation for a new service', 'Build around your idea with room to expand as it develops.'], options: ['حسابات مستخدمين', 'تكاملات API', 'لغات متعددة'] }
    },
    'تطبيق جوال': {
      'جذب عملاء جدد': { ar: ['علامتك أقرب إلى عملائك', 'قدّم خدمة سهلة الوصول مع تجربة جوال تدعو العملاء للعودة.'], en: ['Keep your brand closer to customers', 'Offer an accessible mobile experience that customers can return to.'], options: ['تصميم وهوية مخصصة', 'إشعارات فورية', 'حسابات مستخدمين'] },
      'تنظيم العمل': { ar: ['تجربة متنقلة لفريقك وعملائك', 'اجعل المهام والمستجدات متاحة في الوقت المناسب من أي مكان.'], en: ['A mobile flow for your team and customers', 'Keep tasks and updates within reach, wherever work happens.'], options: ['لوحة تحكم', 'حسابات مستخدمين', 'إشعارات فورية'] },
      'إطلاق خدمة جديدة': { ar: ['انطلاقة على iPhone وAndroid', 'ابدأ بتجربة واضحة للوظائف الأساسية، ثم طوّرها مع جمهورك.'], en: ['Launch on iPhone and Android', 'Start with a focused core experience and grow it with your audience.'], options: ['تصميم وهوية مخصصة', 'حسابات مستخدمين', 'إشعارات فورية'] }
    }
  };
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (saved && typeof saved === 'object') {
      serviceOptions.find((input) => input.value === saved.service)?.click();
      const savedGoal = goalOptions.find((input) => input.value === saved.goal);
      if (savedGoal) savedGoal.checked = true;
      priorityOptions.forEach((input) => { input.checked = Array.isArray(saved.priorities) && saved.priorities.includes(input.value); });
    }
  } catch { /* Storage can be disabled by the browser. */ }

  function updateBrief() {
    const service = serviceOptions.find((input) => input.checked)?.value || 'موقع إلكتروني';
    const goal = goalOptions.find((input) => input.checked)?.value || 'جذب عملاء جدد';
    const priorities = priorityOptions.filter((input) => input.checked).map((input) => input.value);
    const note = description.value.trim();
    const brief = englishUI().brief || {};
    const serviceLabel = currentLang === 'en' ? brief.serviceValues?.[service] || service : service;
    const goalLabel = currentLang === 'en' ? brief.goalValues?.[goal] || goal : goal;
    const priorityLabels = currentLang === 'en'
      ? priorities.map((priority) => brief.priorityValues?.[priority] || priority) : priorities;
    $('#summary-service').textContent = serviceLabel;
    $('#summary-goal').textContent = goalLabel;
    $('#summary-priorities').textContent = priorityLabels.length
      ? priorityLabels.join(' · ')
      : currentLang === 'en' ? brief.noPriorities : 'حدد ما يهمك من القائمة';
    $('#char-count').textContent = `${description.value.length} / 500`;
    $$('.service-card').forEach((card) => {
      card.classList.toggle('is-selected', $('.service-select', card).dataset.service === service);
    });
    const suggestion = recommendations[service]?.[goal];
    if (suggestion) {
      const [title, copy] = currentLang === 'en' ? suggestion.en : suggestion.ar;
      $('#recommendation-title').textContent = title;
      $('#recommendation-copy').textContent = copy;
      const optionList = $('#recommendation-options');
      optionList.replaceChildren();
      for (const value of suggestion.options) {
        const input = priorityOptions.find((item) => item.value === value);
        if (!input) continue;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'recommendation-option';
        button.setAttribute('aria-pressed', String(input.checked));
        button.textContent = `${input.checked ? '✓' : '+'} ${currentLang === 'en' ? brief.priorityValues?.[value] || value : value}`;
        button.addEventListener('click', () => { input.checked = !input.checked; updateBrief(); });
        optionList.append(button);
      }
    }
    const message = currentLang === 'en' ? [
      brief.greeting,
      formatText(brief.serviceLine, { service: serviceLabel }),
      formatText(brief.goalLine, { goal: goalLabel }),
      formatText(brief.prioritiesLine, { priorities: priorityLabels.length ? priorityLabels.join(', ') : brief.decideTogether }),
      note ? formatText(brief.ideaLine, { note }) : null
    ].filter(Boolean).join('\n') : [
      'مرحباً N9 GROUP، أود مناقشة مشروع جديد.',
      `نوع المشروع: ${service}`,
      `هدف المشروع: ${goal}`,
      `الأولويات: ${priorities.length ? priorities.join('، ') : 'نحددها معاً'}`,
      note ? `فكرة المشروع: ${note}` : null
    ].filter(Boolean).join('\n');
    $('#brief-whatsapp').href = `https://wa.me/966530021367?text=${encodeURIComponent(message)}`;
    const subject = currentLang === 'en' ? brief.emailSubject : 'طلب مشروع جديد — N9 GROUP';
    $('#brief-email').href = `mailto:nasseh2005@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    try { localStorage.setItem(storageKey, JSON.stringify({ service, goal, priorities })); }
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
  $$('.service-card').forEach((card) => card.addEventListener('click', (event) => {
    if (event.target.closest('button')) return;
    $('.service-select', card)?.click();
  }));

  // Keyboard search indexes sections and actual project names.
  const commandDialog = $('#command-dialog');
  const commandInput = $('#command-search');
  const commands = [
    { title: 'خدماتنا', kind: 'قسم', href: '#services', section: 'services' },
    { title: 'قوتنا التقنية', kind: 'قسم', href: '#technology', section: 'technology' },
    { title: 'رحلة التنفيذ', kind: 'قسم', href: '#process', section: 'process' },
    { title: 'أعمالنا', kind: 'قسم', href: '#projects', section: 'projects' },
    { title: 'خطتك', kind: 'قسم', href: '#planner', section: 'planner' },
    { title: 'التواصل', kind: 'قسم', href: '#contact', section: 'contact' },
    ...Object.entries(projectData).map(([key, project]) => ({ title: project.title, kind: 'مشروع', key }))
  ];
  function commandTitle(item) {
    if (currentLang !== 'en') return item.title;
    return item.key ? localizedProject(item.key).title
      : englishUI().commands?.sections?.[item.section] || item.title;
  }
  function commandKind(item) {
    if (currentLang !== 'en') return item.kind;
    return item.key ? englishUI().commands?.projectKind : englishUI().commands?.sectionKind;
  }
  function renderCommands() {
    const query = normalize(commandInput.value);
    const results = $('#command-results');
    results.replaceChildren();
    const matches = commands.filter((item) => !query || normalize(
      `${item.title} ${item.kind} ${commandTitle(item)} ${commandKind(item)}`
    ).includes(query)).slice(0, 9);
    for (const item of matches) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = `${commandTitle(item)} · ${commandKind(item)}`;
      button.addEventListener('click', () => {
        commandDialog.close();
        if (item.href) document.querySelector(item.href)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
        else openProject(item.key);
      });
      results.append(button);
    }
    if (!matches.length) results.textContent = currentLang === 'en'
      ? englishUI().commands?.noResults : 'لا توجد نتيجة مطابقة.';
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
      toast(currentLang === 'en' ? englishUI().feedback?.emailCopied : 'تم نسخ البريد الإلكتروني.');
    } catch {
      toast(currentLang === 'en' ? englishUI().feedback?.emailCopyFailed : 'تعذّر النسخ تلقائياً؛ يمكنك تحديد البريد ونسخه.');
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
    if (choice.outcome === 'accepted') toast(currentLang === 'en'
      ? englishUI().feedback?.siteInstalled : 'أُضيف الموقع إلى جهازك.');
    installPrompt = undefined;
    $('#install-site').hidden = true;
  });
  $('#share-site').addEventListener('click', async () => {
    const url = location.origin + location.pathname;
    try {
      if (navigator.share) await navigator.share({ title: 'N9 GROUP', url });
      else {
        await navigator.clipboard.writeText(url);
        toast(currentLang === 'en' ? englishUI().feedback?.linkCopied : 'تم نسخ رابط الموقع.');
      }
    } catch (error) {
      if (error?.name !== 'AbortError') toast(currentLang === 'en'
        ? englishUI().feedback?.shareFailed : 'تعذّرت المشاركة من هذا المتصفح.');
    }
  });

  const themeButton = $('#theme-toggle');
  const languageButton = $('#language-toggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  function updateSwitches() {
    const light = document.documentElement.dataset.theme === 'light';
    const english = currentLang === 'en';
    $('.theme-icon', themeButton).textContent = light ? '☾' : '☀';
    $('.theme-label', themeButton).textContent = light
      ? (english ? 'Dark' : 'داكن') : (english ? 'Light' : 'فاتح');
    themeButton.setAttribute('aria-label', light
      ? (english ? 'Switch to dark mode' : 'تفعيل الوضع الداكن')
      : (english ? 'Switch to light mode' : 'تفعيل الوضع الفاتح'));
    themeButton.setAttribute('aria-pressed', String(light));
    languageButton.textContent = english ? 'العربية' : 'EN';
    languageButton.lang = english ? 'ar' : 'en';
    languageButton.setAttribute('aria-label', english ? 'التبديل إلى العربية' : 'Switch to English');
    if (themeMeta) themeMeta.content = light ? '#f4f7fc' : '#05070d';
  }
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('n9-theme', theme); } catch { /* Theme still works without storage. */ }
    updateSwitches();
    document.dispatchEvent(new Event('n9-themechange'));
  }
  themeButton.addEventListener('click', () => setTheme(
    document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'
  ));
  function setLanguage(language) {
    currentLang = language === 'en' ? 'en' : 'ar';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'en' ? 'ltr' : 'rtl';
    try { localStorage.setItem('n9-language', currentLang); } catch { /* Language still works without storage. */ }
    const url = new URL(location.href);
    if (currentLang === 'en') url.searchParams.set('lang', 'en');
    else url.searchParams.delete('lang');
    history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    translateStaticText();
    updateProjects();
    updateBrief();
    if (commandDialog.open) renderCommands();
    if (detailDialog.open && currentProjectKey) showProjectDetails(currentProjectKey);
    const activeStep = $('.process-step.is-active');
    if (activeStep) $('#process-name').textContent = $('h3', activeStep).textContent;
    updateSwitches();
    document.dispatchEvent(new Event('n9-languagechange'));
  }
  languageButton.addEventListener('click', () => setLanguage(currentLang === 'en' ? 'ar' : 'en'));
  try { localStorage.setItem('n9-language', currentLang); } catch { /* No persistent preference. */ }
  updateSwitches();
})();
