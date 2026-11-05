/* Doc Element · service worker: guarda el juego para abrir sin internet */
const CACHE = 'doc-element-v2.0.0';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png', './favicon.png', './compartir.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('doc-element-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const q = e.request; if (q.method !== 'GET' || new URL(q.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(c => c.match(q, { ignoreSearch: true }).then(hit => {
    const net = fetch(q).then(res => { if (res && res.ok && res.type === 'basic') c.put(q, res.clone()); return res; }).catch(() => hit || (q.mode === 'navigate' ? c.match('./index.html') : Response.error()));
    return hit || net;
  })));
});
