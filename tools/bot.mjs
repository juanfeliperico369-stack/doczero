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
const views = [{ name: 'movil', viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true }, { name: 'pc', viewport: { width: 1366, height: 768 } }];
let fails = 0;
for (const v of views) {
  const ctx = await browser.newContext({ viewport: v.viewport, hasTouch: !!v.hasTouch, isMobile: !!v.isMobile, deviceScaleFactor: 1 });
  const page = await ctx.newPage(), errs = [];
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await page.goto(url); await page.waitForSelector('#cover');
  const click = async (sel) => { await page.locator(sel).first().click(); await page.waitForTimeout(40); };
  const ui = [];
  try {
    if (shots) await page.screenshot({ path: `${shots}/${v.name}-portada.png` });
    await click('[data-act=newgame]'); await click('[data-act=sskip]');
    await page.waitForSelector('.sheet [data-act=go]'); await click('.sheet [data-act=go]');
    await click('#tray [data-arg=H]'); await click('#tray [data-arg=H]'); await click('[data-act=synth]');
    ui.push('1-1 por clics: ' + (await page.evaluate(() => DE.ui.state().prog['1-0'] || 0)) + '★');
    await page.evaluate(() => DE.ui.closeModal());
    // tocar el lienzo con el puntero real: crear O, enlazar O–O y tocar el enlace para hacerlo doble
    await click('[data-act=go][data-arg="1,1"], [data-act=open][data-arg="1,1"]').catch(() => {});
    await page.evaluate(() => DE.ui.openProblem(1, 1)); await click('.sheet [data-act=go]');
    await click('#tray [data-arg=O]'); await click('#tray [data-arg=O]');
    const pos = await page.evaluate(() => { const r = document.getElementById('cv').getBoundingClientRect(), L = DE.ui.Lab, [a, b] = L.atoms; const s = (x, y) => [(x - L.view.x) * L.view.z + r.width / 2 + r.left, (y - L.view.y) * L.view.z + r.height / 2 + r.top]; return [s((a.x + b.x) / 2, (a.y + b.y) / 2), s(a.x, a.y)]; });
    if (v.hasTouch) await page.touchscreen.tap(...pos[0]); else await page.mouse.click(...pos[0]);
    await page.waitForTimeout(40); await click('[data-act=synth]');
    ui.push('1-2 O=O tocando el enlace: ' + (await page.evaluate(() => DE.ui.state().prog['1-1'] || 0)) + '★');
    await page.evaluate(() => DE.ui.closeModal());
    if (shots && v.name === 'movil') { await page.evaluate(() => { DE.ui.buildSmiles('CC(=O)OC1=CC=CC=C1C(=O)O', 0, 0); }); await page.waitForTimeout(120); await page.screenshot({ path: `${shots}/${v.name}-lab.png` }); await page.evaluate(() => DE.ui.clearLab(true)); }
    for (const t of ['fr', 'bt', 'tx', 'lab']) await click(`#tabs [data-arg=${t}]`);
    await click('[data-act=mode][data-arg=forge]'); await click('.nuc >> nth=0'); await click('.nuc >> nth=1'); await click('[data-act=fuse]');
    ui.push('forja p+n: ' + (await page.evaluate(() => !!DE.ui.state().nuc.D)));
    await click('[data-act=mode][data-arg=mol]');
    for (const a of ['guide', 'credits', 'settings', 'diag']) { await click('#bMenu'); await click(`.sheet [data-act=${a}]`); await page.waitForTimeout(a === 'diag' ? 1500 : 30); await page.evaluate(() => DE.ui.closeModal()); }
    if (shots && v.name === 'pc') { await page.evaluate(() => DE.ui.setTab('bt')); await page.waitForTimeout(80); await page.screenshot({ path: `${shots}/${v.name}-mapa.png` }); }
  } catch (e) { errs.push('UI: ' + e.message.split('\n')[0]); }
  const res = await page.evaluate(n => { const a = DE.test.selfTest(), s = DE.test.solver(), m = DE.test.monkey(n, n * 7 + 1); return { a, s, m }; }, N);
  const bad = res.a.errors.length + res.s.failed.length + res.m.errors.length + errs.length;
  fails += bad;
  console.log(`\n== ${v.name} ${v.viewport.width}x${v.viewport.height} ==`);
  console.log('UI:', ui.join(' · '));
  console.log('Datos:', res.a.stats, '| errores', res.a.errors.length, '| avisos', res.a.warnings.length);
  res.a.errors.forEach(e => console.log('  ✕', e)); res.a.warnings.slice(0, 8).forEach(w => console.log('  ⚠', w));
  console.log(`Solver: ${res.s.solved}/100 resueltos · ${res.s.stars}★ · Eternio ${res.s.eternio} · fusiones de recarga ${res.s.farm}`); res.s.failed.forEach(e => console.log('  ✕', e));
  console.log(`Monkey: ${res.m.games} partidas · ${res.m.actions} acciones · ${res.m.errors.length} errores`); res.m.errors.slice(0, 15).forEach(e => console.log('  ✕', e));
  console.log('Consola/página:', errs.length); errs.slice(0, 10).forEach(e => console.log('  ✕', e));
  await ctx.close();
}
await browser.close();
console.log(fails ? `\nRESULTADO: ${fails} problemas` : '\nRESULTADO: OK, 0 errores');
process.exit(fails ? 1 : 0);
