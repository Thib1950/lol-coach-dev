const CACHE_NAME = "lol-coach-runtime-v3";
const APP_SHELL = ["./", "./index.html", "./style.css?v=20261116-1", "./app.js?v=20261116-2"];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).catch(() => {}));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith("lol-coach-runtime-") && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  const isAppDocument = request.mode === "navigate" || /\.(?:css|js)$/.test(url.pathname);
  if (!isAppDocument) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const fresh = await fetch(new Request(request, { cache: "no-store" }));
      if (fresh && fresh.ok) cache.put(request, fresh.clone());
      return fresh;
    } catch (error) {
      const cached = await cache.match(request) || await cache.match("./index.html");
      if (cached) return cached;
      throw error;
    }
  })());
});
