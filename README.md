# N9 GROUP

موقع عربي باتجاه RTL لتسويق تصميم المواقع، أنظمة SaaS والحلول التقنية حسب الطلب. الهوية البصرية فضائية بألوان أسود وأزرق داكن مع لمسة ذهبية، ومجرة نجوم تتشكل على هيئة N9 وتتفاعل مع المؤشر.

**الموقع:** https://n9-group-digital.nasseh2005.chatgpt.site/

## التشغيل

الموقع ثابت ولا يحتاج إلى عملية بناء أو مفاتيح API. شغّل خادماً محلياً من مجلد `dist`، مثلاً:

```bash
python -m http.server 8765 --directory dist
```

ثم افتح `http://localhost:8765/`. يحتاج تثبيت التطبيق والعمل دون اتصال إلى زيارة أولى عبر HTTPS أو localhost حتى يُثبَّت Service Worker وتُخزَّن الملفات الأساسية.

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
| 16 | تجربة مصغرة حية لسير عمل SaaS | مختبر N9 | [Stripe Checkout](https://stripe.com/payments/checkout) كنمط لعرض المنتج عملياً |
| 17 | أداة تحدد احتياج العميل وتجهز رسالة تواصل | أداة «خطتك» | [Shopify Tools](https://www.shopify.com/tools) كنمط للأدوات المفيدة قبل التواصل |
| 18 | تجربة عربية باتجاه RTL من الواجهة إلى البيانات | كامل الموقع | [Framer Localization](https://www.framer.com/help/localization/) |
| 19 | بيانات منظمة JSON-LD للخدمات والمؤسسة | رأس الصفحة | [Framer Structured Data](https://www.framer.com/help/articles/structured-data-through-json-ld/) |
| 20 | صور WebP متجاوبة بأحجام محددة و`srcset` | شعارات الأعمال | [Cloudflare Responsive Images](https://developers.cloudflare.com/images/optimization/make-responsive-images/) و[web.dev CLS](https://web.dev/articles/optimize-cls) |

تفاصيل إضافية: تحميل الشعارات عند الحاجة وفق [web.dev Lazy Loading](https://web.dev/articles/browser-level-image-lazy-loading)، نافذة تنقل سريع باختصار `Ctrl+K`، حفظ اختيارات الخدمة والأولويات محلياً، روابط واتساب وبريد بنص مخصص، وتثبيت الموقع مع إتاحة الملفات الأساسية دون اتصال وفق [web.dev PWA](https://web.dev/learn/pwa/getting-started) و[Offline Cookbook](https://web.dev/articles/offline-cookbook).

## البنية

- `dist/index.html`: المحتوى العربي والأقسام والبيانات المنظمة.
- `dist/styles.css`: التصميم المتجاوب والحالات التفاعلية.
- `dist/app.js`: النجوم، البحث، التصفية، العرض التجريبي وأداة المشروع.
- `dist/sw.js` و`dist/manifest.webmanifest`: التثبيت والتخزين للعمل دون اتصال بعد الزيارة الأولى.
- `dist/assets/`: شعارات المشاريع، بنسخ WebP محسنة للشاشات المختلفة.

الروابط والشعارات المعروضة تخص الجهات المذكورة. نموذج SaaS داخل الموقع يستخدم بيانات تجريبية فقط. لا تعرض الصفحة أرقام أداء أو نتائج تجارية غير مقاسة.
