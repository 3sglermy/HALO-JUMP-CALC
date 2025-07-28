const CACHE_NAME = "halo-cache-v2"; // increment this for each update!
const urlsToCache = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/script.js",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-144.png",
  "/icons/apple-touch-icon.png"
];

// Install event: cache all your assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // activate new SW immediately
});

// Activate event: clean up old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch event: respond from cache, fallback to network, fallback to offline page
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Try cache first
      if (response) return response;
      // If not in cache, try network
      return fetch(event.request).catch(() => {
        // If navigation request and offline, return cached index.html
        if (event.request.mode === "navigate") {
          return caches.match("/index.html");
        }
      });
    })
  );
});
