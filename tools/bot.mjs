// Bot de pruebas de Doc Element (Playwright). Uso: node tools/bot.mjs [partidas] [--shots carpeta]
// 1) compila  2) prueba la UI con clics reales en móvil y PC  3) valida datos  4) resuelve los 100 problemas  5) N partidas aleatorias
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = fileURLToPath(new URL('..', import.meta.url));
execFileSync('node', [root + 'tools/build.mjs'], { stdio: 'inherit' });
const N = +process.argv[2] || 100, shotsAt = process.argv.indexOf('--shots'), shots = shotsAt > 0 ? process.argv[shotsAt + 1] : null;
const url = 'file://' + root + 'index.html?test=1';
const browser = await chromium.launch();
const views = [{ name: 'movil-h', viewport: { width: 740, height: 360 }, hasTouch: true, isMobile: true }, { name: 'pc', viewport: { width: 1366, height: 768 } }, { name: 'movil-v', viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true, quick: true }];
let fails = 0;
for (const v of views) {
  const ctx = await browser.newContext({ viewport: v.viewport, hasTouch: !!v.hasTouch, isMobile: !!v.isMobile, deviceScaleFactor: 1 });
  const page = await ctx.newPage(), errs = [];
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await page.goto(url); await page.waitForSelector('#cover');
  let lastSel = '';
  const click = async (sel) => { lastSel = sel; await page.locator(sel).first().click({ timeout: 8000 }); await page.waitForTimeout(40); };
  const ev = f => page.evaluate(f);
  const ui = [];
  try {
    if (v.quick) {
      ui.push('aviso girar: ' + (await page.locator('#rotate').isVisible()));
      await click('#rotate [data-act=vok]'); ui.push('seguir en vertical: ' + !(await page.locator('#rotate').isVisible()));
      await click('[data-act=newgame]'); await click('[data-act=sskip]'); await click('#tray [data-arg=H]'); await click('#tray [data-arg=H]'); await click('#bSyn');
      ui.push('1-1 en vertical: ' + (await ev(() => DE.ui.state().prog['1-0'] || 0)) + '★');
      if (shots) await page.screenshot({ path: `${shots}/${v.name}.png` });
    } else {
      if (shots) await page.screenshot({ path: `${shots}/${v.name}-portada.png` });
      await click('[data-act=newgame]');
      if (shots) await page.screenshot({ path: `${shots}/${v.name}-historia.png` });
      await click('[data-act=sskip]');
      // 1-1 guiado: plano punteado, la pieza correcta brilla
      ui.push('pista H: ' + (await page.locator('#tray [data-arg=H].hint').count()));
      await click('#tray [data-arg=H]');
      if (shots) await page.screenshot({ path: `${shots}/${v.name}-guia.png` });
      await click('#tray [data-arg=H]'); await click('#bSyn');
      ui.push('1-1 H₂: ' + (await ev(() => DE.ui.state().prog['1-0'] || 0)) + '★');
      await click('.sheet [data-act=go]');
      // 1-2: dos O y tocar el enlace con el puntero real
      await click('#tray [data-arg=O]'); await click('#tray [data-arg=O]');
      const pos = await ev(() => { const r = document.getElementById('cv').getBoundingClientRect(), L = DE.ui.Lab, [a, b] = L.atoms; const s = (x, y) => [(x - L.view.x) * L.view.z + r.width / 2 + r.left, (y - L.view.y) * L.view.z + r.height / 2 + r.top]; return s((a.x + b.x) / 2, (a.y + b.y) / 2); });
      if (v.hasTouch) await page.touchscreen.tap(...pos); else await page.mouse.click(...pos);
      await page.waitForTimeout(40); await click('#bSyn');
      ui.push('1-2 O=O tocando el enlace: ' + (await ev(() => DE.ui.state().prog['1-1'] || 0)) + '★');
      await click('.sheet [data-act=go]');
      // 1-3 reactor con clics: H₂ + O₂ → ÉTER balancea → reaccionar
      await click('#reactPane [data-act=rxadd][data-arg=H2]'); await click('#reactPane [data-act=rxadd][data-arg=O2]');
      if (shots) await page.screenshot({ path: `${shots}/${v.name}-reactor.png` });
      await click('#reactPane [data-act=react]');
      ui.push('1-3 reactor: ' + (await ev(() => DE.ui.state().prog['1-2'] || 0)) + '★');
      await ev(() => DE.ui.closeModal());
      // arrastrar un átomo sobre otro para unirlos (puntero real)
      await click('[data-act=mode][data-arg=mol]'); await ev(() => { DE.ui.clearLab(true); DE.ui.Lab.sel = null; });
      await click('#tray [data-arg=O]'); await ev(() => { DE.ui.Lab.sel = null; }); await click('#tray [data-arg=H]');
      const dd = await ev(() => { const r = document.getElementById('cv').getBoundingClientRect(), L = DE.ui.Lab, [a, b] = L.atoms; const s = (x, y) => [(x - L.view.x) * L.view.z + r.width / 2 + r.left, (y - L.view.y) * L.view.z + r.height / 2 + r.top]; return [s(b.x, b.y), s(a.x, a.y)]; });
      await page.mouse.move(...dd[0]); await page.mouse.down(); await page.mouse.move(dd[0][0] + 20, dd[0][1] + 10, { steps: 3 }); await page.mouse.move(...dd[1], { steps: 6 }); await page.mouse.up();
      ui.push('arrastrar H sobre O une: ' + (await ev(() => DE.ui.Lab.bonds.length === 1)));
      // destilación con clics: resolver con la solución del motor
      await ev(() => { const S = DE.ui.state(); for (let i = 3; i < 7; i++) S.prog['1-' + i] = 1; DE.ui.closeModal(); });
      await ev(() => DE.ui.startProblem(1, 7));
      const sol = await ev(() => DE.ui.SO().sol);
      if (shots) await page.screenshot({ path: `${shots}/${v.name}-destilacion.png` });
      for (const [a, b] of sol) { await click(`.tube[data-arg="${a}"]`); await click(`.tube[data-arg="${b}"]`); }
      ui.push('destilación por clics: ' + (await ev(() => DE.ui.state().prog['1-7'] || 0)) + '★');
      await ev(() => DE.ui.closeModal());
      // batalla con clics y anillo crítico
      await ev(() => { const S = DE.ui.state(); S.prog['1-8'] = 1; S.fr.H2O = { c: 1, t: 1 }; DE.ui.startProblem(1, 9); });
      await ev(() => DE.ui.startBattle(1, 9, ['el:He', 'H2O']));
      await click('.dk >> nth=0');
      if (shots) await page.screenshot({ path: `${shots}/${v.name}-batalla.png` });
      await ev(() => DE.ui.flee()); await ev(() => DE.ui.tick(.1)); await ev(() => DE.ui.closeModal());
      for (const t of ['fr', 'bt', 'tx', 'lab']) await click(`#nav [data-arg=${t}]`);
      await click('[data-act=mode][data-arg=forge]'); await click('#forgePane .nuc >> nth=0'); await click('#forgePane .nuc >> nth=1'); await click('[data-act=fuse]');
      ui.push('forja p+n: ' + (await ev(() => !!DE.ui.state().nuc.D)));
      await click('[data-act=mode][data-arg=mol]');
      for (const a of ['guide', 'credits', 'settings', 'diag']) { await click('[data-act=menu]'); await click(`.sheet [data-act=${a}]`); await page.waitForTimeout(a === 'diag' ? 1500 : 30); await ev(() => DE.ui.closeModal()); }
      if (shots) { await ev(() => DE.ui.setTab('bt')); await page.waitForTimeout(80); await page.screenshot({ path: `${shots}/${v.name}-mapa.png` }); await ev(() => DE.ui.setTab('lab')); }
    }
  } catch (e) { errs.push('UI [' + lastSel + ']: ' + e.message.split('\n')[0]); }
  if (v.quick) { console.log(`\n== ${v.name} ${v.viewport.width}x${v.viewport.height} ==\nUI: ${ui.join(' · ')}\nConsola/página: ${errs.length}`); errs.forEach(e => console.log('  ✕', e)); fails += errs.length + ui.filter(x => /false|: 0★/.test(x)).length; await ctx.close(); continue; }
  const res = await page.evaluate(n => { const a = DE.test.selfTest(), s = DE.test.solver(), m = DE.test.monkey(n, n * 7 + 1); return { a, s, m }; }, N);
  const bad = res.a.errors.length + res.s.failed.length + res.m.errors.length + errs.length + ui.filter(x => /false|: 0★/.test(x)).length;
  fails += bad;
  console.log(`\n== ${v.name} ${v.viewport.width}x${v.viewport.height} ==`);
  console.log('UI:', ui.join(' · '));
  console.log('Datos:', res.a.stats, '| errores', res.a.errors.length, '| avisos', res.a.warnings.length);
  res.a.errors.forEach(e => console.log('  ✕', e)); res.a.warnings.slice(0, 8).forEach(w => console.log('  ⚠', w));
  console.log(`Solver: ${res.s.solved}/100 resueltos · ${res.s.stars}★ · Eternio ${res.s.eternio} · guía ${res.s.guided} · reto diario ${res.s.daily} · recargas ${res.s.farm}`); res.s.failed.forEach(e => console.log('  ✕', e));
  console.log(`Monkey: ${res.m.games} partidas · ${res.m.actions} acciones · ${res.m.errors.length} errores`); res.m.errors.slice(0, 15).forEach(e => console.log('  ✕', e));
  console.log('Consola/página:', errs.length); errs.slice(0, 10).forEach(e => console.log('  ✕', e));
  await ctx.close();
}
// ---------- duelo LAN real entre dos páginas (WebRTC sin servidor) + QR + Bluetooth ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1100, height: 640 } }), errs = [], out = [];
  const A = await ctx.newPage(), B = await ctx.newPage();
  for (const p of [A, B]) { p.on('pageerror', e => errs.push('pageerror: ' + e.message)); await p.goto(url); await p.waitForSelector('#cover'); await p.click('[data-act=newgame]'); await p.click('[data-act=sskip]'); await p.evaluate(() => DE.ui.closeModal()); }
  try {
    await B.evaluate(() => { DE.k.S().name = 'Rival'; });
    const offer = await A.evaluate(() => DE.net.host());
    const qrOk = await A.evaluate(c => { const cv = DE.net.qrCanvas(c), g = cv.getContext('2d'), r = jsQR(g.getImageData(0, 0, cv.width, cv.height).data, cv.width, cv.height); return !!r && r.data === c; }, offer);
    out.push('QR ida y vuelta: ' + qrOk + ' (' + offer.length + ' car.)');
    const ans = await B.evaluate(c => DE.net.join(c), offer);
    await A.evaluate(c => DE.net.accept(c), ans);
    let open = false; for (let i = 0; i < 60 && !open; i++) { await A.waitForTimeout(200); open = await A.evaluate(() => DE.net.Net.state === 'open') && await B.evaluate(() => DE.net.Net.state === 'open'); }
    out.push('LAN conectado: ' + open);
    if (open) {
      await A.waitForTimeout(200); await A.evaluate(() => DE.net.act('duelGo')); await B.waitForTimeout(400);
      const la = await A.evaluate(() => DE.ui.CH() && DE.ui.CH().list.join()), lb = await B.evaluate(() => DE.ui.CH() && DE.ui.CH().list.join());
      out.push('misma semilla: ' + (!!la && la === lb));
      const solve = p => p.evaluate(() => { for (let q = 0; q < 6 && DE.ui.CH(); q++) { DE.ui.tick(2); DE.ui.clearLab(true); DE.ui.buildSmiles(DE.DB.comp[DE.ui.MIS().p.id].smiles[0]); DE.ui.synth(); } });
      await solve(B); await B.waitForTimeout(300); await solve(A); await A.waitForTimeout(600);
      const ra = await A.evaluate(() => ({ me: DE.net.Net.me, rv: DE.net.Net.rival, h: document.querySelector('.sheet h2') && document.querySelector('.sheet h2').textContent }));
      out.push('resultado: ' + ra.h + ' · rival terminó ' + !!(ra.rv && ra.rv.done));
    }
    const btc = await A.evaluate(() => DE.net.btEncode(777, 95.2)); const bt = await B.evaluate(c => DE.net.btDecode(c), btc);
    out.push('reto Bluetooth: ' + (bt.seed === 777 && bt.el === 95.2));
  } catch (e) { errs.push('Duelo: ' + e.message.split('\n')[0]); }
  console.log('\n== duelo LAN / QR / Bluetooth ==\n' + out.join(' · ') + '\nConsola/página: ' + errs.length); errs.forEach(e => console.log('  ✕', e));
  fails += errs.length + out.filter(x => /false|null|undefined/.test(x)).length; await ctx.close();
}
await browser.close();
console.log(fails ? `\nRESULTADO: ${fails} problemas` : '\nRESULTADO: OK, 0 errores');
process.exit(fails ? 1 : 0);
