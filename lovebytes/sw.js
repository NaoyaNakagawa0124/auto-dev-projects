const CACHE_NAME = 'lovebytes-v1';
const ASSETS = [
  '/', '/index.html', '/css/retro.css', '/js/prompts.js',
  '/js/scrapbook.js', '/js/guestbook.js', '/js/app.js', '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
