// Verifica la app publicada: carga, service worker activo, abre sin conexión, instalable (CDP), manifiesto y etiquetas.
// Uso: node tools/verify-pages.mjs [url]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const URL0 = process.argv[2] || 'https://juanfeliperico369-stack.github.io/doczero/';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage(), errs = [], R = {};
page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
const res = await page.goto(URL0 + '?v=' + Date.now(), { waitUntil: 'load' });
R.http = res.status(); await page.waitForSelector('#cover', { timeout: 15000 }); R.carga = true;
R.version = await page.evaluate(() => DE.CFG.VERSION);
R.sw = await page.evaluate(async () => { const r = await navigator.serviceWorker.ready; for (let i = 0; i < 50 && r.active && r.active.state !== 'activated'; i++) await new Promise(f => setTimeout(f, 200)); return r.active ? r.active.state : 'none'; });
await page.reload({ waitUntil: 'load' });
R.controla = await page.evaluate(() => !!navigator.serviceWorker.controller);
R.caches = await page.evaluate(async () => (await caches.keys()).join(','));
const cdp = await ctx.newCDPSession(page);
const inst = await cdp.send('Page.getInstallabilityErrors'); R.instalabilidad = inst.installabilityErrors.map(e => e.errorId);
const man = await cdp.send('Page.getAppManifest'); R.manifiesto = { errores: (man.errors || []).length, url: man.url };
R.meta = await page.evaluate(() => { const q = s => { const e = document.querySelector(s); return e ? (e.content || e.href) : null; }; return { appleCapable: q('meta[name="apple-mobile-web-app-capable"]'), appleTitle: q('meta[name="apple-mobile-web-app-title"]'), viewport: q('meta[name=viewport]'), ogImage: q('meta[property="og:image"]'), ogUrl: q('meta[property="og:url"]'), apple: q('link[rel="apple-touch-icon"]'), icon: q('link[rel=icon]') }; });
for (const f of ['manifest.webmanifest', 'sw.js', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png', 'compartir.png', 'favicon.png', '.nojekyll']) { const r = await ctx.request.get(URL0 + f); R['archivo ' + f] = r.status(); }
await ctx.setOffline(true);
await page.reload({ waitUntil: 'load' }).catch(e => errs.push('offline reload: ' + e.message));
R.sinConexion = await page.locator('#cover').count().then(n => n > 0).catch(() => false);
const p2 = await ctx.newPage(); await p2.goto(URL0, { waitUntil: 'load' }).catch(e => errs.push('offline nueva pestaña: ' + e.message)); R.sinConexionNuevaPestana = await p2.locator('#cover').count() > 0;
await ctx.setOffline(false);
R.erroresConsola = errs;
console.log(JSON.stringify(R, null, 2));
await browser.close();
const ok = R.http === 200 && R.sw === 'activated' && R.controla && R.sinConexion && R.sinConexionNuevaPestana && !R.instalabilidad.length && !errs.length;
console.log(ok ? 'VERIFICACIÓN: OK' : 'VERIFICACIÓN: FALLA'); process.exit(ok ? 0 : 1);
