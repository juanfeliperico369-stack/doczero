/* ============================================================
   DOC ELEMENT · SALA DE CULTIVO (Temporada 4)
   cel: señalar las partes de una célula · ord: ordenar pasos · cls: clasificar · epi: contener un brote
   Todo es conceptual: dibujos, clasificaciones y un tablero de casillas.
   ============================================================ */
'use strict';
(function () {
const K = () => DE.k, $ = s => document.querySelector(s), esc = DE.esc;
const PU = '#c77dff', BL = '#39c8ff', GR = '#2dffb3', PK = '#ff2fb3', AM = '#ffc23a', BG = '#0b0418';
let OG = null;
const dots = (pts, c) => `<g fill="${c || PK}">${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2"/>`).join('')}</g>`;
const mito = (x, y, a, s) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s || 1})"><ellipse rx="22" ry="10" fill="${BG}" stroke="${AM}" stroke-width="3"/><path d="M-15 0l5-6 5 12 5-12 5 12 5-12 5 6" fill="none" stroke="${AM}" stroke-width="2"/></g>`;
const wave = (d, c, w) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w || 4}" stroke-linecap="round"/>`;
/* dibujos (viewBox 320×190) y marcadores: parte → [x, y del botón, x, y del punto señalado] */
const DRAW = {
  bact: { s: `<rect x="62" y="52" width="196" height="90" rx="45" fill="${BG}" stroke="${PU}" stroke-width="7"/><rect x="70" y="60" width="180" height="74" rx="37" fill="none" stroke="${BL}" stroke-width="2.5"/>`
      + wave('M112 98c8-20 22 16 34-2s22 18 34 2 14-12 22 0', GR) + `<circle cx="216" cy="116" r="8" fill="none" stroke="${AM}" stroke-width="3"/>`
      + dots([[96, 84], [106, 117], [150, 76], [182, 120], [222, 82], [140, 122]]) + wave('M258 97c12-16 16 14 28 0s14 12 26 2', PU, 3),
    m: { par: [34, 32, 76, 64], mem: [130, 20, 130, 60], adn: [150, 172, 150, 100], pla: [252, 172, 219, 123], rib: [40, 156, 106, 117], fla: [298, 54, 290, 94] } },
  animal: { s: `<path d="M160 22c60-6 122 22 124 72s-50 80-122 78S34 140 36 92 100 28 160 22z" fill="${BG}" stroke="${BL}" stroke-width="4"/><circle cx="150" cy="96" r="30" fill="#160830" stroke="${PU}" stroke-width="4"/>`
      + wave('M134 96c6-12 12 10 18 0s10 8 14 0', GR, 3) + mito(232, 70, 25) + mito(88, 132, -20, .9)
      + `<g fill="none" stroke="${GR}" stroke-width="3" stroke-linecap="round"><path d="M200 124q22-10 44 0"/><path d="M202 134q20-9 40 0"/><path d="M206 144q16-7 32 0"/></g><circle cx="92" cy="68" r="9" fill="${PU}"/>`
      + dots([[70, 100], [190, 52], [124, 50], [256, 108], [150, 148]]),
    m: { mem: [22, 40, 58, 56], nuc: [160, 12, 152, 66], mit: [300, 38, 244, 64], rib: [20, 108, 70, 100], gol: [298, 164, 238, 136], lis: [76, 14, 90, 60] } },
  planta: { s: `<rect x="44" y="24" width="232" height="144" rx="14" fill="${BG}" stroke="${GR}" stroke-width="7"/><rect x="53" y="33" width="214" height="126" rx="9" fill="none" stroke="${BL}" stroke-width="2.5"/>`
      + `<rect x="112" y="56" width="110" height="80" rx="26" fill="#0a1c33" stroke="${BL}" stroke-width="2" stroke-dasharray="5 4"/><circle cx="84" cy="122" r="19" fill="#160830" stroke="${PU}" stroke-width="4"/>`
      + `<g fill="#0b2a1c" stroke="${GR}" stroke-width="2.5"><ellipse cx="84" cy="58" rx="17" ry="9"/><ellipse cx="246" cy="62" rx="9" ry="17"/><ellipse cx="170" cy="147" rx="17" ry="8"/></g>`
      + mito(244, 124, 70, .75) + dots([[70, 90], [126, 46], [232, 96], [216, 148], [150, 44]]),
    m: { par: [20, 20, 46, 28], mem: [120, 176, 120, 159], nuc: [20, 150, 70, 128], clo: [302, 36, 252, 54], vac: [167, 96], mit: [302, 132, 254, 126], rib: [20, 84, 70, 90] } },
  virus: { s: `<g stroke="${PK}" stroke-width="3" fill="${PK}">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => { const a = k * Math.PI / 5, c = Math.cos(a), s = Math.sin(a), f = n => n.toFixed(1); return `<line x1="${f(160 + 62 * c)}" y1="${f(95 + 62 * s)}" x2="${f(160 + 76 * c)}" y2="${f(95 + 76 * s)}"/><circle cx="${f(160 + 79 * c)}" cy="${f(95 + 79 * s)}" r="4"/>`; }).join('')}</g>`
      + `<circle cx="160" cy="95" r="62" fill="${BG}" stroke="${AM}" stroke-width="4" stroke-dasharray="3 5"/><polygon points="160,52 197,73 197,117 160,138 123,117 123,73" fill="#160830" stroke="${PU}" stroke-width="4"/>`
      + wave('M140 95c6-16 12 14 20 0s12 12 20-2', GR),
    m: { gen: [40, 166, 148, 100], cap: [284, 162, 197, 112], esp: [286, 24, 226, 48], env: [38, 24, 124, 45] } },
  hongo: { s: `<ellipse cx="246" cy="62" rx="34" ry="27" fill="${BG}" stroke="${AM}" stroke-width="6"/><ellipse cx="140" cy="100" rx="86" ry="62" fill="${BG}" stroke="${AM}" stroke-width="7"/>`
      + `<circle cx="112" cy="92" r="22" fill="#160830" stroke="${PU}" stroke-width="4"/><ellipse cx="172" cy="122" rx="28" ry="20" fill="#0a1c33" stroke="${BL}" stroke-width="2" stroke-dasharray="5 4"/>` + mito(172, 70, -15, .8),
    m: { gem: [300, 24, 262, 48], par: [24, 34, 70, 64], nuc: [24, 152, 98, 106], vac: [292, 166, 196, 128], mit: [150, 14, 168, 62] } }
};
function cellSVG() {
  const d = DRAW[OG.p.cel]; let h = '';
  for (const key in d.m) { const [mx, my, px, py] = d.m[key], ok = OG.found[key];
    if (px != null) h += `<line x1="${mx}" y1="${my}" x2="${px}" y2="${py}" class="ml"/><circle cx="${px}" cy="${py}" r="5" class="md"/>`;
    if (ok) { const an = mx < 60 ? 'start' : mx > 260 ? 'end' : 'middle', tx = mx < 60 ? mx - 13 : mx > 260 ? mx + 13 : mx;
      h += `<g class="mk ok"><circle cx="${mx}" cy="${my}" r="10"/><text x="${mx}" y="${my + 4}" text-anchor="middle">✓</text><text class="nm" x="${tx}" y="${my < 95 ? my + 22 : my - 15}" text-anchor="${an}">${esc(ORG.PART[key][0])}</text></g>`; }
    else h += `<g class="mk" data-act="ogPart" data-arg="${key}"><circle cx="${mx}" cy="${my}" r="13"/><text x="${mx}" y="${my + 6}" text-anchor="middle">?</text></g>`;
  }
  return `<svg class="cellsvg" viewBox="0 0 320 190" role="img" aria-label="${esc(ORG.CELL[OG.p.cel][0])}">${d.s}${h}</svg>`;
}
function start(L, i) {
  const p = LEVELS[L - 1].P[i], k = K(), st = { L, i, p, t: p.T, T: p.T, errs: 0, pos: 0 };
  if (p.mode === 'cel') st.found = {};
  else if (p.mode === 'ord') { const r = DE.mulberry(L * 613 + i * 29), n = p.items.length; let o; do { o = p.items.map((_, j) => j); for (let q = n - 1; q > 0; q--) { const j = Math.floor(r() * (q + 1)); [o[q], o[j]] = [o[j], o[q]]; } } while (o.every((v, j) => v === j)); st.ord = o; }
  else if (p.mode === 'epi') { st.tries = 0; reset(st); }
  OG = st; $('#orgOv').hidden = false; render(); k.sfx('tap');
}
function reset(st) { st.g = ORG.grid(st.p.map); st.left = st.p.per; st.turn = 1; st.moves = []; st.fresh = []; }
function render() {
  if (!OG) return; const p = OG.p, el = $('#orgOv'); let body = '';
  if (p.mode === 'cel') {
    const key = p.q[OG.pos];
    body = `<div class="rule">${esc(ORG.PART[key][2])}</div><div class="lbl">${esc(ORG.CELL[p.cel][0])} · ${OG.pos + 1} de ${p.q.length}</div>${cellSVG()}`;
  } else if (p.mode === 'ord') {
    body = `<div class="rule">${esc(p.rule)}</div><div class="olist">${p.items.slice(0, OG.pos).map((t, j) => `<span class="oi"><b>${j + 1}</b>${esc(t)}</span>`).join('<i>▸</i>') || '<span class="m">Toca el primero…</span>'}</div>
      <div class="lbl">¿Cuál sigue?</div><div class="opts">${OG.ord.filter(j => j >= OG.pos).map(j => `<button class="btn gh" data-act="ogPick" data-arg="${j}">${esc(p.items[j])}</button>`).join('')}</div>`;
  } else if (p.mode === 'cls') {
    const it = p.items[OG.pos];
    body = `<div class="rule">${esc(p.rule)}</div><div class="lbl">${OG.pos + 1} de ${p.items.length}</div><div class="ccard">${esc(it[0])}</div>
      <div class="cats">${p.cats.map((c, j) => `<button class="btn" data-act="ogCat" data-arg="${j}">${esc(c)}</button>`).join('')}</div>
      <div class="olist sm">${p.items.slice(Math.max(0, OG.pos - 3), OG.pos).map(x => `<span class="oi">✓ ${esc(x[0])} → ${esc(p.cats[x[1]])}</span>`).join('')}</div>`;
  } else {
    const g = OG.g, sol = ORG.sol(p), hint = OG.tries >= 2 && OG.moves.every((m, j) => m === sol[j]) ? sol[OG.moves.length] : -1;
    body = `<div class="rule">Protege <b>${OG.left}</b> casilla${OG.left === 1 ? '' : 's'} · A salvo <b>${ORG.safe(g)}</b> · Meta <b>${p.save}</b> o más</div>
      <div class="egrid" style="grid-template-columns:repeat(${g.w},var(--ec))">${g.c.map((v, j) => v === '#' ? '<span class="ec w"></span>' : `<button class="ec ${v === 'X' ? 'x' : v === 'V' ? 'v' : 's'}${OG.fresh.includes(j) ? ' new' : ''}${j === hint ? ' hintc' : ''}" data-act="ogCell" data-arg="${j}" aria-label="${v === 'X' ? 'brote' : v === 'V' ? 'protegida' : 'sana'}">${v === 'V' ? '✚' : ''}</button>`).join('')}</div>
      <div class="m sm"><span class="lg s"></span> sana · <span class="lg v"></span> protegida · <span class="lg x"></span> brote · turno ${OG.turn}</div>`;
  }
  el.innerHTML = `<div class="bt-top"><span class="mega">${p.ic || '❀'} ${esc(p.t)}</span><span class="m">Errores ${OG.errs}</span><span class="tm" id="ogT">${Math.ceil(OG.t)}</span><button class="btn gh sm" data-act="ogQuit">Salir</button></div><div class="gbody"><p class="m sm fbk ${OG.msg ? OG.msg[1] : ''}">${esc(OG.msg ? OG.msg[0] : p.d)}</p>${body}</div>`;
}
function wrong(msg) { const k = K(); OG.errs++; OG.t = Math.max(0, OG.t - 3); k.sfx('bad'); k.vib(60); OG.msg = [msg || '', 'bad']; render(); const b = $('#orgOv .gbody'); if (b) b.classList.add('shake'); }
function right(msg) { const k = K(); k.sfx('bond'); k.vib(10); OG.msg = msg ? [msg, 'ok'] : null; render(); }
function done() {
  const g = OG, k = K(); OG = null; $('#orgOv').hidden = true; const used = 1 - Math.max(0, g.t) / g.T;
  const stars = g.late ? 1 : g.errs === 0 && used <= .45 ? 3 : used <= .75 && g.errs <= 2 ? 2 : 1;
  k.say('win'); k.win(g.L, g.i, stars, Math.max(0, Math.round(g.t)) * 2);
}
function part(key) {
  if (!OG || OG.p.mode !== 'cel' || OG.found[key] || !ORG.PART[key]) return; const want = OG.p.q[OG.pos], P = ORG.PART[key];
  if (key !== want) return wrong(`Eso es ${P[0].toLowerCase()}: ${P[1]}.`);
  OG.found[key] = 1; OG.pos++; if (OG.pos >= OG.p.q.length) return done(); right(`✓ ${P[0]}: ${P[1]}.`);
}
function pick(j) {
  if (!OG || OG.p.mode !== 'ord') return; j = +j; if (j < OG.pos) return;
  if (j !== OG.pos) return wrong(OG.pos ? 'Todavía no: ¿qué viene justo después de «' + OG.p.items[OG.pos - 1] + '»?' : 'Ese no es el primero.');
  OG.pos++; if (OG.pos >= OG.p.items.length) return done(); right();
}
function cat(j) {
  if (!OG || OG.p.mode !== 'cls') return; const it = OG.p.items[OG.pos];
  if (+j !== it[1]) return wrong(`«${it[0]}» va en «${OG.p.cats[it[1]]}».`);
  OG.pos++; if (OG.pos >= OG.p.items.length) return done(); right();
}
function endEpi() {
  const safe = ORG.safe(OG.g), p = OG.p;
  if (safe >= p.save) return done();
  OG.tries++; reset(OG); wrong(`Quedaron a salvo ${safe} y hacían falta ${p.save}. ${OG.tries >= 2 ? 'Sigue la casilla que parpadea.' : 'Prueba a cerrarle el paso un poco más lejos.'}`);
}
function cell(j) {
  if (!OG || OG.p.mode !== 'epi') return; j = +j; const g = OG.g;
  if (g.c[j] !== '.') { if (g.c[j] === 'X') { OG.msg = ['Ahí ya llegó el brote: protege una casilla sana.', 'bad']; render(); } return; }
  g.c[j] = 'V'; OG.moves.push(j); OG.left--; OG.fresh = [];
  if (!ORG.front(g).length) return endEpi();
  if (OG.left <= 0) { OG.fresh = ORG.spread(g); OG.turn++; OG.left = OG.p.per; if (!ORG.front(g).length) return endEpi(); }
  right();
}
function tick(dt) {
  if (!OG) return; OG.t -= dt; const e = $('#ogT'); if (e) { e.textContent = Math.max(0, Math.ceil(OG.t)); e.classList.toggle('low', OG.t < 10); }
  if (OG.t <= 0 && !OG.late) { const k = K(); if (k.dOf(OG.L).fail) { const g = OG; OG = null; $('#orgOv').hidden = true; k.lose(g.L, g.i, 'Se acabó el tiempo.', 'Lee la pregunta con calma: cada error enseña qué es esa parte.'); } else OG.late = true; }
}
function quit() { if (!OG) return; const g = OG, k = K(); OG = null; $('#orgOv').hidden = true; k.lose(g.L, g.i, 'Saliste de la sala de cultivo.', 'Ve despacio: una pregunta a la vez.'); }
/* solución automática (para el bot y el validador) */
function solve() {
  let n = 0;
  while (OG && n++ < 400) { const p = OG.p;
    if (p.mode === 'cel') part(p.q[OG.pos]); else if (p.mode === 'ord') pick(OG.pos); else if (p.mode === 'cls') cat(p.items[OG.pos][1]); else cell(ORG.sol(p)[OG.moves.length]);
  }
}
DE.ACTX = DE.ACTX || {};
Object.assign(DE.ACTX, { ogPart: x => part(x), ogPick: x => pick(x), ogCat: x => cat(x), ogCell: x => cell(x), ogQuit: () => quit() });
DE.org = { start, tick, solve, part, pick, cat, cell, quit, active: () => !!OG, state: () => OG, DRAW };
})();
