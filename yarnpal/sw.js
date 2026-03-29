const CACHE = 'yarnpal-v1';
const ASSETS = ['/', '/index.html', '/css/style.css', '/js/counter.js', '/js/projects.js', '/js/timer.js', '/js/app.js'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))));
self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));
