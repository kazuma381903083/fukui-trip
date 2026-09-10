'use strict';
const PREFIX = 'fukui-trip-2026-';
const CACHE = PREFIX + 'df760a7db5b3';
const ASSETS = ["./", "./index.html", "./style.css", "./visual.css", "./trip-data.js", "./app.js", "./journey-extras.js", "./manifest.webmanifest", "./credits.html", "./assets/tojinbo.webp", "./assets/eiheiji.webp", "./assets/dinosaur.webp", "./assets/ichijodani.webp", "./assets/icon-192.png", "./assets/icon-512.png"];
const scope = new URL('./', self.location.href);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  // A consistent asset set is cached per release. The worker itself is checked by the browser for updates.
  const relative = './' + url.pathname.slice(scope.pathname.length);
  if (!ASSETS.includes(relative) && request.mode !== 'navigate') return;
  event.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    try { return await fetch(request); }
    catch (error) {
      if (request.mode === 'navigate') return (await cache.match('./index.html')) || Response.error();
      return Response.error();
    }
  }));
});
