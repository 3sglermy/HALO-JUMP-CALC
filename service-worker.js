self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('halo-cache').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/css/style.css',
        '/js/script.js',
        '/manifest.webmanifest',
        '/icons/icon-192.png',
        '/icons/icon-144.png',
        '/icons/apple-touch-icon.png'
      ]);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
