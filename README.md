# N9 GROUP

موقع تسويقي ثنائي اللغة لشركة N9 GROUP، يعرض تصميم وتطوير المواقع، أنظمة SaaS، الحلول حسب الطلب، وتطوير تطبيقات الجوال. يبدأ بمشهد نجوم وشعار N9 فوق صورة فضائية من NASA، ثم قسم منفصل للمجرة والمنظومة الشمسية بصور حقيقية، وبعده الخدمات والأعمال وأداة إعداد ملخص المشروع. تدعم الواجهة العربية باتجاه RTL والإنجليزية باتجاه LTR، مع وضعين داكن وفاتح.

- **المستودع العام:** https://github.com/nasseh2005-byte/n9-group-digital-site
- **الموقع المنشور على Vercel:** https://n9-group-ashy.vercel.app/

## ما يتضمنه الموقع

- مقدمة سينمائية تعرض شعار N9 وسط نجوم تفاعلية وخلفية من صورة سديم كارينا الملتقطة بتلسكوب Webb. تتفاعل النجوم مع المؤشر واللمس.
- قسم فضائي منفصل يبدأ بصورة لمنطقة مركز درب التبانة ثم يفتح استكشاف الشمس والكواكب الثمانية بصور NASA. اختيار الكوكب أو السحب أو مفتاحا السهم يعرضان معلومات مبسطة عنه. توجد أدوات لإيقاف الحركة وتشغيل صوت فضائي اختياري. الأحجام والمسافات عرض بصري غير مقياس.
- مشهد نجوم آخر يتشكل فيه اسم N9 بجوار رسالة الموقع التجارية، إضافة إلى ظهور تدريجي للأقسام ومؤشر تقدم القراءة. تُحترم إعدادات تقليل الحركة.
- تبديل فوري بين العربية والإنجليزية، وبين الوضع الداكن والفاتح. يُحفظ الاختيار محلياً في المتصفح؛ ويمكن فتح النسخة الإنجليزية باستخدام `?lang=en`.
- عرض ثمانية أعمال، بينها **SMS WEB | N9 SMS**، مع تصفية وبحث فوري ونافذة تفاصيل وروابط للمشاريع. إصدارا iPhone وAndroid الخاصان بـ SMS WEB معروضان بوصفهما **قريباً**.
- أداة «خطتك» لاختيار نوع المشروع وأولوياته وإعداد رسالة واتساب أو بريد. لا تحسب الأداة سعراً أو مدة تنفيذ تلقائياً.
- اختصارات ثابتة للجوال وبطاقات خدمات وأعمال قابلة للسحب أفقياً لتقليل التمرير الطويل.
- اختصار `Ctrl+K` للبحث والتنقل، وبيانات منظمة، وصور متجاوبة، وإمكانية تثبيت الموقع والعمل دون اتصال بعد تخزين الملفات الأساسية في متصفح يدعم ذلك.

## التشغيل

الموقع ثابت ولا يحتاج إلى خطوة بناء أو مفاتيح API. شغّل خادماً محلياً من مجلد `dist`، مثلاً:

```bash
python -m http.server 8765 --directory dist
```

ثم افتح `http://localhost:8765/`. يحتاج تثبيت الموقع والعمل دون اتصال إلى زيارة أولى عبر HTTPS أو localhost حتى يُثبَّت Service Worker وتُخزَّن الملفات الأساسية. يظهر زر التثبيت فقط في المتصفحات التي تتيح طلب التثبيت.

## النشر على Vercel

يرتبط مشروع Vercel المسمى `n9-group` بفرع `main` في مستودع GitHub العام. الملفات الجاهزة للنشر موجودة في `dist/`، ويضبط ملف `vercel.json` في جذر المستودع `outputDirectory` إلى `dist`. لا توجد خطوة بناء؛ بعد دفع التعديلات إلى `main` ينبغي أن يخدم Vercel ملف `dist/index.html` عند `/` وأن تصبح بقية الملفات مثل `/app.js` و`/sw.js` في جذر الرابط العام. كان نشر سابق يعرض 404 لأنه خدم جذر المستودع بدلاً من `dist/`.

يشير `canonical` و`hreflang` وبيانات JSON-LD وخريطة الموقع إلى رابط Vercel المنشور. تبديل اللغة الحالي يحدث في المتصفح، ولا ينشئ صفحات HTML مترجمة مستقلة لمحركات البحث.

## 20 فكرة مطبقة من تجارب وأدوات عالمية

هذه تطبيقات أصلية داخل موقع N9 GROUP مستوحاة من أنماط منشورة لدى شركات التصميم والتطوير. الروابط تشير إلى مراجع الفكرة، ولا تعني نسخ تصميماتها أو استخدام مكتباتها داخل الموقع.

| # | الفكرة المطبقة | أين تظهر | مرجع الفكرة |
|---|---|---|---|
| 1 | نجوم نقطية تتشكل بهوية N9 | لوحة البداية | [Three.js Points](https://threejs.org/docs/pages/Points.html) |
| 2 | تمييز النجوم القريبة من المؤشر وتنافرها | لوحة البداية | [Three.js Raycaster](https://threejs.org/docs/pages/Raycaster.html) |
| 3 | مؤشر بصري مخصص فوق العناصر التفاعلية | التنقل والأعمال | [Framer Custom Cursors](https://www.framer.com/updates/custom-cursors) |
| 4 | سديم لوني يتبع حركة المؤشر | لوحة البداية | [Framer Design](https://www.framer.com/design/) |
| 5 | طبقات نجوم تتحرك مع التمرير | لوحة البداية | [Webflow Interactions 2.0](https://webflow.com/blog/interactions-2-0-release-notes) |
| 6 | ظهور تدريجي للأقسام عند الوصول إليها | الأقسام الرئيسية | [Webflow Interactions](https://university.webflow.com/videos/when-to-use-interactions) |
| 7 | مؤشر يوضح تقدم قراءة الصفحة | أعلى الصفحة | [Motion useScroll](https://motion.dev/docs/react-use-scroll) |
| 8 | رحلة تنفيذ متدرجة مع تحديد المرحلة الحالية | رحلة التنفيذ | [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) |
| 9 | تفاعلات واضحة لأزرار الدعوة للإجراء | الأزرار والبطاقات | [Webflow Interaction Design](https://webflow.com/blog/how-to-design-interactions-effectively) |
| 10 | خيارات خدمة تغيّر ملخص المشروع مباشرة | أداة «خطتك» | [Framer Design](https://www.framer.com/design/) |
| 11 | مؤثرات أخف للشاشات الصغيرة | التصميم المتجاوب | [Webflow Interactions 2.0](https://webflow.com/blog/interactions-2-0-release-notes) |
| 12 | احترام إعداد تقليل الحركة | كامل الموقع | [Framer Reduced Motion](https://www.framer.com/help/articles/reduced-motion-settings/) |
| 13 | تصفية الأعمال حسب نوع المشروع | معرض الأعمال | [Framer Dynamic Filters](https://www.framer.com/help/articles/how-to-add-dynamic-filters/) |
| 14 | بحث فوري في الأعمال مع عدد النتائج | معرض الأعمال | [Framer Dynamic Filters](https://www.framer.com/help/articles/how-to-add-dynamic-filters/) |
| 15 | نافذة تفاصيل خاصة لكل مشروع ورابطه الأصلي | معرض الأعمال | [Framer Detail Pages](https://www.framer.com/help/articles/how-to-create-flexible-cms-detail-pages/) |
| 16 | اختصارات ثابتة للجوال وبطاقات قابلة للسحب | تنقل الجوال والخدمات والأعمال | [web.dev Responsive Web Design](https://web.dev/learn/design/) |
| 17 | أداة تحدد احتياج العميل وتجهز رسالة تواصل | أداة «خطتك» | [Shopify Tools](https://www.shopify.com/tools) كنمط للأدوات المفيدة قبل التواصل |
| 18 | تبديل عربي RTL وإنجليزي LTR يشمل الواجهة والمحتوى التفاعلي | كامل الموقع | [Framer Localization](https://www.framer.com/help/localization/) |
| 19 | بيانات منظمة JSON-LD للخدمات والمؤسسة | رأس الصفحة | [Framer Structured Data](https://www.framer.com/help/articles/structured-data-through-json-ld/) |
| 20 | صور أعمال WebP متجاوبة بأحجام محددة و`srcset` | بطاقات الأعمال | [Cloudflare Responsive Images](https://developers.cloudflare.com/images/optimization/make-responsive-images/) و[web.dev CLS](https://web.dev/articles/optimize-cls) |

تفاصيل إضافية: تحميل صور الأعمال عند الحاجة وفق [web.dev Lazy Loading](https://web.dev/articles/browser-level-image-lazy-loading)، حفظ اختيارات الخدمة والأولويات محلياً، روابط واتساب وبريد بنص مخصص، وتثبيت الموقع مع إتاحة الملفات الأساسية دون اتصال وفق [web.dev PWA](https://web.dev/learn/pwa/getting-started) و[Offline Cookbook](https://web.dev/articles/offline-cookbook). مشهد النجوم من تنفيذ هذا المشروع باستخدام JavaScript وCanvas؛ روابط الجدول مراجع لأفكار التصميم والتفاعل وليست قائمة بمكتبات مستخدمة.

## البنية

- `dist/index.html`: المحتوى والأقسام والبيانات المنظمة وروابط الأصول.
- `dist/locales.js`: النصوص الإنجليزية ومحتوى المشاريع بلغتين.
- `dist/styles.css` و`dist/space-theme.css` و`dist/app.js`: التصميم المتجاوب، تبديل اللغة والمظهر، النجوم، البحث، التصفية وأداة المشروع.
- `dist/intro.css` و`dist/intro.js`: مشهد الافتتاح بالشعار والنجوم.
- `dist/solar.css` و`dist/solar.js`: قسم المجرة والمنظومة الشمسية التفاعلية.
- `dist/sw.js` و`dist/manifest.webmanifest`: التثبيت والتخزين للعمل دون اتصال بعد الزيارة الأولى.
- `dist/assets/` و`dist/icons/`: شعارات الأعمال، صور WebP المتجاوبة، والشعارات والأيقونات المحلية. مصادر صور NASA موثقة في `dist/assets/nasa/SOURCES.md`.
- `vercel.json`: توجيه Vercel لخدمة ملفات `dist/` من جذر الموقع.

الروابط والشعارات المعروضة تخص الجهات المذكورة. صور الفضاء من NASA وفرق المهمات المعتمدة في المصادر ولا تعني تأييد NASA للموقع. لا تعرض الصفحة أرقام أداء أو نتائج تجارية غير مقاسة.
