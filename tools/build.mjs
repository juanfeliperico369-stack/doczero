// Compila Doc Element.
//  index.html            → HTML único y autónomo (sirve abierto como archivo, sin internet)
//  dist/web/             → app web instalable (GitHub Pages / Capacitor): index.html + manifest + sw.js + íconos + .nojekyll
// Uso: node tools/build.mjs
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync } from 'node:fs';
const U = p => new URL('../' + p, import.meta.url);
const r = p => readFileSync(U(p));
const data = r('src/data.js').toString();
const VERSION = data.match(/VERSION: '([^']+)'/)[1], URL0 = data.match(/URL: '([^']+)'/)[1];
const css = r('src/style.css').toString().replace('__TITULOS__', r('src/fonts/titulos.woff').toString('base64')).replace('__CUERPO__', r('src/fonts/cuerpo.woff2').toString('base64'));
const files = ['vendor/qrcode.min.js', 'vendor/jsQR.min.js', 'data.js', 'season2.js', 'season3.js', 'season4.js', 'engine.js', 'chars.js', 'ui.js', 'online.js', 'genes.js', 'cultivo.js', 'school.js', 'test.js'];
const js = files.map(f => `<script>\n${r('src/' + f)}\n</script>`).join('\n');
const desc = 'Doc Element: crea elementos, moléculas y polímeros con química real y resuelve los problemas del universo. Juego educativo gratis, sin internet.';
const icon = 'data:image/png;base64,' + r('assets/favicon.png').toString('base64');
const head = web => `<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#000000"><meta name="color-scheme" content="dark">
<meta name="description" content="${desc}">
<meta name="application-name" content="Doc Element">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Doc Element"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<title>DOC ELEMENT</title>
` + (web ? `<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" sizes="32x32" href="favicon.png">
<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
<meta property="og:type" content="website"><meta property="og:site_name" content="Doc Element"><meta property="og:locale" content="es_ES">
<meta property="og:title" content="Doc Element · Crea elementos. Resuelve el universo.">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${URL0}">
<meta property="og:image" content="${URL0}compartir.png"><meta property="og:image:secure_url" content="${URL0}compartir.png">
<meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Doc Element: portada con Doc y ÉTER">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${URL0}compartir.png">
<link rel="canonical" href="${URL0}">
` : `<link rel="icon" type="image/png" href="${icon}">
`);
const page = web => `<!DOCTYPE html>
<html lang="es"><head>${head(web)}<style>
${css}
</style></head><body><noscript>Doc Element necesita JavaScript activado.</noscript>
${js}
</body></html>
`;
writeFileSync(U('index.html'), page(false));
rmSync(U('dist/web'), { recursive: true, force: true }); mkdirSync(U('dist/web'), { recursive: true });
writeFileSync(U('dist/web/index.html'), page(true));
const ICONS = ['icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png', 'favicon.png', 'compartir.png'];
ICONS.forEach(f => copyFileSync(U('assets/' + f), U('dist/web/' + f)));
writeFileSync(U('dist/web/manifest.webmanifest'), JSON.stringify({
  id: './', name: 'Doc Element', short_name: 'Doc Element', description: desc, lang: 'es', dir: 'ltr',
  start_url: './', scope: './', display: 'standalone', orientation: 'landscape',
  background_color: '#000000', theme_color: '#000000', categories: ['education', 'games'],
  icons: [
    { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
  ]
}, null, 2));
writeFileSync(U('dist/web/sw.js'), `/* Doc Element · service worker: guarda el juego para abrir sin internet */
const CACHE = 'doc-element-v${VERSION}';
const ASSETS = ['./', './index.html', './manifest.webmanifest', ${ICONS.map(f => `'./${f}'`).join(', ')}];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('doc-element-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const q = e.request; if (q.method !== 'GET' || new URL(q.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(c => c.match(q, { ignoreSearch: true }).then(hit => {
    const net = fetch(q).then(res => { if (res && res.ok && res.type === 'basic') c.put(q, res.clone()); return res; }).catch(() => hit || (q.mode === 'navigate' ? c.match('./index.html') : Response.error()));
    return hit || net;
  })));
});
`);
writeFileSync(U('dist/web/.nojekyll'), '');
console.log('index.html', (page(false).length / 1024).toFixed(0) + ' KB · dist/web v' + VERSION);
