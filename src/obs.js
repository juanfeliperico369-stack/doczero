/* ============================================================
   DOC ELEMENT · OBSERVATORIO (Temporada 5)
   orb: llenar los orbitales de un átomo (Aufbau, Hund y Pauli) → explica las "manos" del laboratorio
   esp: identificar elementos por su espectro de emisión (líneas reales en nm, aproximadas)
   ============================================================ */
'use strict';
(function () {
const K = () => DE.k, $ = s => document.querySelector(s), esc = DE.esc;
/* ---------- orbitales ---------- */
const SUB = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p'];
const CAP = { s: 1, p: 3, d: 5 };
const SUP = n => String(n).split('').map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('');
/* subcapas que necesita Z (más una vacía de distractor) */
function subsFor(z) { const out = []; let left = z; for (const s of SUB) { out.push(s); left -= 2 * CAP[s[1]]; if (left <= 0) break; } const i = SUB.indexOf(out[out.length - 1]); if (SUB[i + 1]) out.push(SUB[i + 1]); return out; }
/* reparto correcto (para validar, resolver y mostrar la configuración) */
function fill(z) { const o = {}; let left = z; for (const s of SUB) { const n = CAP[s[1]], e = Math.max(0, Math.min(left, 2 * n)); o[s] = Array.from({ length: n }, (_, i) => e > i ? (e > n + i ? 2 : 1) : 0); left -= e; if (left <= 0) break; } return o; }
const confOf = b => SUB.filter(s => b[s] && b[s].some(x => x)).map(s => s + SUP(b[s].reduce((a, x) => a + x, 0))).join(' ');
const unpaired = b => Object.values(b).flat().filter(x => x === 1).length;
/* ---------- espectros: líneas de emisión visibles más fuertes (nm, aproximadas) ---------- */
const SPEC = {
  H: [410.2, 434.0, 486.1, 656.3], He: [447.1, 471.3, 492.2, 501.6, 587.6, 667.8, 706.5], Li: [460.3, 610.4, 670.8], Na: [589.0, 589.6],
  K: [404.4, 766.5, 769.9], Ca: [393.4, 396.8, 422.7], Cu: [510.6, 515.3, 521.8], Ba: [455.4, 493.4, 553.5], Sr: [407.8, 421.6, 460.7],
  Ne: [585.2, 588.2, 594.5, 603.0, 609.6, 614.3, 621.7, 626.6, 633.4, 640.2, 650.7, 659.9, 692.9, 703.2], Hg: [404.7, 435.8, 546.1, 577.0, 579.1],
  Fe: [404.6, 432.6, 438.4, 440.5, 495.8, 527.0, 532.8], Mg: [516.7, 517.3, 518.4], O: [557.7, 630.0, 636.4]
};
const SPN = { H: 'Hidrógeno', He: 'Helio', Li: 'Litio', Na: 'Sodio', K: 'Potasio', Ca: 'Calcio', Cu: 'Cobre', Ba: 'Bario', Sr: 'Estroncio', Ne: 'Neón', Hg: 'Mercurio', Fe: 'Hierro', Mg: 'Magnesio', O: 'Oxígeno' };
function wl(nm) { // longitud de onda → color aproximado
  let r = 0, g = 0, b = 0;
  if (nm < 440) { r = (440 - nm) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; } else if (nm < 510) { g = 1; b = (510 - nm) / 20; } else if (nm < 580) { r = (nm - 510) / 70; g = 1; } else if (nm < 645) { r = 1; g = (645 - nm) / 65; } else r = 1;
  const f = nm < 420 ? .35 + .65 * (nm - 380) / 40 : nm > 700 ? .35 + .65 * (780 - nm) / 80 : 1, c = v => Math.round(255 * Math.pow(Math.max(0, v) * f, .8));
  return `rgb(${c(r)},${c(g)},${c(b)})`;
}
const X = nm => ((nm - 380) / 400 * 100).toFixed(2);
const bar = (lines, cls) => `<div class="spec ${cls || ''}">${lines.map(n => `<i style="left:${X(n)}%;background:${wl(n)};box-shadow:0 0 6px ${wl(n)}"></i>`).join('')}</div>`;
const ruler = `<div class="spec rule"></div><div class="specnm"><span>400 nm</span><span>500</span><span>600</span><span>700 nm</span></div>`;
let OB = null;
function start(L, i) {
  const p = LEVELS[L - 1].P[i], k = K(), st = { L, i, p, t: p.T, T: p.T, errs: 0 };
  if (p.mode === 'orb') { st.subs = subsFor(p.z); st.goal = fill(p.z); st.box = {}; st.subs.forEach(s => st.box[s] = Array(CAP[s[1]]).fill(0)); st.n = 0; }
  else { st.mix = p.mix.slice(); st.sel = []; st.lines = [...new Set(p.mix.flatMap(e => SPEC[e]))].sort((a, b) => a - b); }
  OB = st; $('#obsOv').hidden = false; render(); k.sfx('tap');
}
function render() {
  if (!OB) return; const p = OB.p; let body = '';
  if (p.mode === 'orb') {
    const e = D().elem(p.z);
    const rows = OB.subs.slice().reverse().map(s => `<div class="orow"><b>${s}</b><span class="obx">${OB.box[s].map((c, j) => `<button class="ob${c ? ' f' + c : ''}" data-act="obBox" data-arg="${s}:${j}" aria-label="Caja ${j + 1} de ${s}">${c === 2 ? '↑↓' : c ? '↑' : ''}</button>`).join('')}</span></div>`).join('');
    body = `<div class="orb"><div class="ladder"><div class="lbl">Energía ↑</div>${rows}</div>
      <div class="oinfo"><div class="ptile" style="--c:var(--ink)"><small>${p.z}</small><b>${e.sym}</b><span>${esc(e.name)}</span></div>
      <div class="m">Electrones: <b class="w">${OB.n}</b> / ${p.z}</div><div class="conf">${confOf(OB.box) || '—'}</div>
      <div class="rules"><span>① Abajo primero</span><span>② Uno en cada caja antes de emparejar</span><span>③ Máximo 2 por caja (↑↓)</span></div></div></div>`;
  } else {
    const multi = OB.mix.length > 1;
    body = `<div class="rule">${multi ? `Esta luz mezcla <b>${OB.mix.length}</b> elementos: marca todos y pulsa Comprobar.` : 'Compara las rayas de colores: cada elemento tiene su «código de barras».'}</div>
      <div class="lbl">Muestra misteriosa</div>${bar(OB.lines, 'big')}${ruler}
      <div class="sopts">${p.opts.map(x => `<button class="sopt${OB.sel.includes(x) ? ' on' : ''}" data-act="obPick" data-arg="${x}"><b>${x}</b><small>${esc(SPN[x])}</small>${bar(SPEC[x])}</button>`).join('')}</div>
      ${multi ? `<button class="btn pri" data-act="obCheck" ${OB.sel.length ? '' : 'disabled'}>Comprobar (${OB.sel.length})</button>` : ''}`;
  }
  $('#obsOv').innerHTML = `<div class="bt-top"><span class="mega">✺ ${esc(p.t)}</span><span class="m">Errores ${OB.errs}</span><span class="tm" id="obT">${Math.ceil(OB.t)}</span><button class="btn gh sm" data-act="obQuit">Salir</button></div><div class="gbody"><p class="m sm fbk ${OB.msg ? OB.msg[1] : ''}">${esc(OB.msg ? OB.msg[0] : p.d)}</p>${body}</div>`;
}
const D = () => DE;
function wrong(msg) { const k = K(); OB.errs++; OB.t = Math.max(0, OB.t - 3); k.sfx('bad'); k.vib(60); OB.msg = [msg, 'bad']; render(); const b = $('#obsOv .gbody'); if (b) b.classList.add('shake'); }
function right(msg) { const k = K(); k.sfx('bond'); k.vib(10); OB.msg = msg ? [msg, 'ok'] : null; render(); }
function done(extra) {
  const g = OB, k = K(); OB = null; $('#obsOv').hidden = true; const used = 1 - Math.max(0, g.t) / g.T;
  const stars = g.late ? 1 : g.errs === 0 && used <= .45 ? 3 : used <= .75 && g.errs <= 2 ? 2 : 1;
  if (extra) k.toast(extra, 'ok'); k.say('win'); k.win(g.L, g.i, stars, Math.max(0, Math.round(g.t)) * 2);
}
/* el siguiente electrón: la subcapa más baja sin llenar; primero uno por caja, después se emparejan */
function want() { for (const s of OB.subs) { const g = OB.goal[s], b = OB.box[s]; if (!g) return null; const have = b.reduce((a, x) => a + x, 0), need = g.reduce((a, x) => a + x, 0); if (have < need) return { s, single: have < b.length }; } return null; }
function box(arg) {
  if (!OB || OB.p.mode !== 'orb') return; const [s, j] = arg.split(':'), b = OB.box[s], w = want(); if (!b || !w) return; const c = b[+j];
  if (c >= 2) return wrong('Esa caja ya tiene dos electrones (↑↓). En una caja caben como máximo dos, girando al revés.');
  if (SUB.indexOf(s) > SUB.indexOf(w.s)) return wrong(`Primero el piso de abajo: falta llenar ${w.s}. Los electrones ocupan primero la energía más baja.`);
  if (SUB.indexOf(s) < SUB.indexOf(w.s)) return wrong('Ese piso ya está lleno.');
  if (w.single && c === 1) return wrong('Regla de Hund: un electrón en cada caja del piso antes de emparejar.');
  b[+j]++; OB.n++;
  if (OB.n >= OB.p.z) { const e = DE.elem(OB.p.z), u = unpaired(OB.box), v = DE.valence(e.sym); return done(`${e.name}: ${confOf(OB.box)} · ${u} sin pareja${u && v.includes(u) ? ' = ' + u + ' mano' + (u > 1 ? 's' : '') + ' en el laboratorio' : ''}`); }
  right();
}
function pick(x) {
  if (!OB || OB.p.mode !== 'esp') return;
  if (OB.mix.length > 1) { OB.sel = OB.sel.includes(x) ? OB.sel.filter(y => y !== x) : OB.sel.concat(x); K().sfx('tap'); OB.msg = null; return render(); }
  if (x === OB.mix[0]) return done(`¡Es ${SPN[x]}! Sus rayas coinciden una por una.`);
  wrong(`${SPN[x]} tiene otras rayas. Busca un elemento con una raya en cada lugar donde la muestra brilla.`);
}
function check() {
  if (!OB || OB.p.mode !== 'esp') return; const miss = OB.mix.filter(x => !OB.sel.includes(x)), extra = OB.sel.filter(x => !OB.mix.includes(x));
  if (!miss.length && !extra.length) return done('¡Análisis correcto! ' + OB.mix.map(x => SPN[x]).join(', ') + '.');
  wrong(extra.length ? `Sobra ${SPN[extra[0]]}: sus rayas no están en la muestra.` : `Falta uno: quedan rayas de la muestra sin explicar.`);
}
function tick(dt) {
  if (!OB) return; OB.t -= dt; const e = $('#obT'); if (e) { e.textContent = Math.max(0, Math.ceil(OB.t)); e.classList.toggle('low', OB.t < 10); }
  if (OB.t <= 0 && !OB.late) { const k = K(); if (k.dOf(OB.L).fail) { const g = OB; OB = null; $('#obsOv').hidden = true; k.lose(g.L, g.i, 'Se acabó el tiempo.', 'Orbitales: abajo primero, uno por caja y luego en parejas. Espectros: cada raya de la muestra debe tener dueño.'); } else OB.late = true; }
}
function quit() { if (!OB) return; const g = OB, k = K(); OB = null; $('#obsOv').hidden = true; k.lose(g.L, g.i, 'Saliste del observatorio.', 'Ve despacio: un electrón o una raya a la vez.'); }
/* solución automática (para el bot y el validador) */
function solve() {
  let n = 0;
  while (OB && n++ < 200) {
    if (OB.p.mode === 'orb') { const w = want(); if (!w) break; const j = OB.box[w.s].findIndex(c => w.single ? c === 0 : c === 1); box(w.s + ':' + j); }
    else if (OB.mix.length > 1) { OB.sel = OB.mix.slice(); check(); } else pick(OB.mix[0]);
  }
}
DE.ACTX = DE.ACTX || {};
Object.assign(DE.ACTX, { obBox: a => box(a), obPick: x => pick(x), obCheck: () => check(), obQuit: () => quit() });
DE.obs = { start, tick, solve, box, pick, check, quit, active: () => !!OB, state: () => OB, SPEC, fill, subsFor, confOf, want: () => OB && want() };
})();
