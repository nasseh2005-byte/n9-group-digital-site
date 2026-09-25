const CACHE_NAME = 'n9-group-v10';
const CORE = [
  '/', '/index.html', '/styles.css?v=10', '/intro.css?v=10', '/space-theme.css?v=10', '/locales.js?v=10', '/app.js?v=10', '/intro.js?v=10', '/favicon.svg', '/manifest.webmanifest',
  '/icons/icon-192.png', '/icons/icon-512.png',
  '/assets/n9-group-mark.svg', '/assets/sms-web-logo-dark.png', '/assets/sms-web-logo-light.png', '/assets/apple-logo.svg', '/assets/android-logo.svg',
  '/assets/nasa/nebula.webp',
  ...['taksim', 'funland', 'malki', 'middle-east', 'library', 'n9-law']
    .flatMap((name) => [320, 640].map((size) => `/assets/${name}-${size}.webp`))
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
    self.clients.claim()
  ]));
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate' || request.destination === 'script' || request.destination === 'style') {
    event.respondWith(fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)));
      }
      return response;
    }).catch(async () => (await caches.match(request)) || caches.match('/index.html')));
    return;
  }

  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)));
    }
    return response;
  })));
});
