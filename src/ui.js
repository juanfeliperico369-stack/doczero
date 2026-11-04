/* ============================================================
   DOC ELEMENT · UI  (pantallas, laboratorio, forja, frascos, batalla)
   ============================================================ */
'use strict';
(function () {
const D = DE, { DB, NUC, BAT, esc, fHTML } = D;
const Q = new URLSearchParams(location.search);
const TEST = Q.has('test'), FAST = TEST || Q.has('fast');
const KEY = TEST ? 'docelement.test' : CFG.SAVE_KEY;
const MAXE = CFG.MAX_ENERGY;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
let S = D.newState(), QUIET = false;

/* ---------- guardado ---------- */
function load() { try { const raw = localStorage.getItem(KEY); S = D.sanitize(raw ? JSON.parse(raw) : null); } catch (e) { S = D.newState(); } }
let saveT = 0;
function save(now) { if (QUIET) return; clearTimeout(saveT); const f = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }; if (now) f(); else saveT = setTimeout(f, 300); }

/* ---------- sonido (sintetizado, sin archivos) ---------- */
let AC = null;
const SFX = { tap: [[660], .05, 'square', .03], bond: [[880], .08, 'triangle', .05], ok: [[523, 659, 784], .1, 'triangle', .06], bad: [[220, 160], .16, 'sawtooth', .04], boom: [[110, 60], .3, 'sawtooth', .08], hit: [[440, 880], .07, 'square', .04], heal: [[300, 200], .12, 'sine', .05], fuse: [[200, 400, 800], .13, 'sine', .07], win: [[523, 659, 784, 1046], .13, 'triangle', .07], lose: [[392, 330, 262], .18, 'triangle', .06] };
function sfx(k) {
  if (!S.set.snd || TEST || QUIET) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const P = SFX[k]; if (!P) return; let t = AC.currentTime;
    P[0].forEach(f => { const o = AC.createOscillator(), g = AC.createGain(); o.type = P[2]; o.frequency.value = f; g.gain.setValueAtTime(P[3], t); g.gain.exponentialRampToValueAtTime(.0001, t + P[1]); o.connect(g).connect(AC.destination); o.start(t); o.stop(t + P[1] + .02); t += P[1] * .8; });
  } catch (e) { }
}
function vib(ms) { if (S.set.vib && !TEST && navigator.vibrate) try { navigator.vibrate(ms); } catch (e) { } }

/* ---------- toast / efectos ---------- */
function toast(msg, cls) {
  const t = $('#toast'), d = document.createElement('div'); if (cls) d.className = cls; d.innerHTML = msg; t.appendChild(d);
  while (t.children.length > 3) t.firstChild.remove(); setTimeout(() => d.remove(), FAST ? 400 : 2600);
}
function boom(x, y) { const b = document.createElement('div'); b.className = 'boom'; b.style.left = x + 'px'; b.style.top = y + 'px'; document.body.appendChild(b); setTimeout(() => b.remove(), 650); }
function shake(el) { el = el || $('#main'); el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }
const tagChips = (t, max) => Object.keys(t).slice(0, max || 9).map(k => `<i title="${TAGS[k][0]}">${TAGS[k][1]} ${TAGS[k][0]}${t[k] > 1 ? ' ' + '•'.repeat(t[k]) : ''}</i>`).join('');
const tagWords = t => Object.keys(t).map(k => TAGS[k][1] + ' ' + TAGS[k][0]).join(' · ');
const spaced = s => esc(s).split('').join('');

/* ---------- modal ---------- */
let modalClose = true;
function modal(html, close = true) {
  const ov = $('#ov'); modalClose = close;
  ov.innerHTML = '<div class="sheet" role="dialog" aria-modal="true">' + (close ? '<button class="x" data-act="close" aria-label="Cerrar">✕</button>' : '') + html + '</div>';
  ov.hidden = false; return ov.firstChild;
}
function closeModal() { const ov = $('#ov'); ov.hidden = true; ov.innerHTML = ''; }

/* ---------- anuncios (marcadores offline; adaptador listo para AdSense/AdMob) ---------- */
const HOUSE = ['▶ Mira el video de este nivel en el canal de One Zero', '☕ Doc Element es gratis. Apóyalo con 1 USD en la Página Oficial', 'Versión PRO sin anuncios: 3 USD, todo desbloqueado para siempre', '¿Sabías que el oro de tu anillo nació en el choque de dos estrellas de neutrones?', 'Temporada 2 próximamente: FÁRMACOS · niveles 11–20'];
const ADS = {
  on: () => CFG.EDITION !== 'pro',
  rails() {
    if (!ADS.on()) { document.body.classList.add('pro'); return; }
    const box = i => `<div class="vert">Espacio publicitario</div><div class="adbox"><span class="pag">Anuncio</span><b>${i % 2 ? 'Doc Element' : 'One Zero'}</b>${esc(HOUSE[i % HOUSE.length])}</div><div class="vert">Valla ${i + 1}</div>`;
    $('#railL').innerHTML = box(0); $('#railR').innerHTML = box(1);
    $('#adMobile').innerHTML = 'Anuncio · <b>' + esc(HOUSE[(Date.now() / 6e4 | 0) % HOUSE.length]) + '</b>';
  },
  inter(cb) {
    if (!ADS.on() || QUIET) return cb();
    const el = document.createElement('div'); el.className = 'adcd'; el.setAttribute('role', 'dialog');
    el.innerHTML = `<div class="pag">Publicidad · vuelves en</div><div class="n">3</div><div class="w">${esc(HOUSE[Math.random() * HOUSE.length | 0])}</div><div class="m">El juego es gratis gracias a los anuncios. Nada se te cobra.</div>`;
    document.body.appendChild(el); let n = 3;
    const tick = () => { n--; if (n <= 0) { el.remove(); cb(); return; } el.querySelector('.n').textContent = n; setTimeout(tick, FAST ? 15 : 1000); };
    setTimeout(tick, FAST ? 15 : 1000);
  }
};

/* ---------- HUD y pestañas ---------- */
function hud() {
  $('#hLv').innerHTML = 'N<b>' + S.cur + '</b>';
  $('#hEn').innerHTML = '⚡<b>' + Math.round(S.en) + '</b>';
  $('#hSc').innerHTML = '★<b>' + D.totalStars(S) + '</b> · <b>' + S.sc + '</b>';
}
let TAB = 'lab';
function setTab(t) {
  TAB = t; $$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.arg === t));
  $$('.tab').forEach(x => x.classList.toggle('on', x.id === 't-' + t));
  if (t === 'fr') { renderFr(); $('#tabs [data-arg=fr] .dot') && $('#tabs [data-arg=fr] .dot').remove(); }
  if (t === 'bt') renderMap();
  if (t === 'tx') renderTx();
  if (t === 'lab') { requestAnimationFrame(resize); }
}
function dotFr() { const b = $('#tabs [data-arg=fr]'); if (TAB !== 'fr' && !b.querySelector('.dot')) b.insertAdjacentHTML('beforeend', '<span class="dot"></span>'); }

/* ============================================================
   LABORATORIO MOLECULAR (canvas)
   ============================================================ */
const Lab = { atoms: [], bonds: [], sel: null, uid: 1, view: { x: 0, y: 0, z: 1 }, hist: [], mode: 'mol', dirty: true };
const A = id => Lab.atoms.find(a => a.id === id);
const bsum = id => Lab.bonds.reduce((s, b) => s + (b.a === id || b.b === id ? b.o : 0), 0);
const deg = id => Lab.bonds.reduce((s, b) => s + (b.a === id || b.b === id ? 1 : 0), 0);
const cap = a => a.mono ? 2 - deg(a.id) : D.maxVal(a.el) - bsum(a.id);
const need = a => { if (a.mono) return 0; const f = D.freeOf(a.el, bsum(a.id)); return f < 0 ? 0 : f; };
const bondOf = (x, y) => Lab.bonds.find(b => (b.a === x && b.b === y) || (b.a === y && b.b === x));
const nbrs = id => Lab.bonds.filter(b => b.a === id || b.b === id).map(b => A(b.a === id ? b.b : b.a)).filter(Boolean);
function snap() { Lab.hist.push(JSON.stringify([Lab.atoms, Lab.bonds, Lab.uid])); if (Lab.hist.length > 40) Lab.hist.shift(); }
function undo() { const s = Lab.hist.pop(); if (!s) return toast('Nada que deshacer'); [Lab.atoms, Lab.bonds, Lab.uid] = JSON.parse(s); Lab.sel = null; redraw(); }
function redraw() { Lab.dirty = true; }
let CW = 300, CH = 300, DPR = 1, ctx = null;
function resize() {
  const cv = $('#cv'); if (!cv) return; const r = cv.parentElement.getBoundingClientRect();
  if (r.width < 2) return; DPR = Math.min(2, window.devicePixelRatio || 1); CW = r.width; CH = r.height;
  cv.width = Math.round(CW * DPR); cv.height = Math.round(CH * DPR); ctx = cv.getContext('2d'); redraw();
}
const w2s = (x, y) => [(x - Lab.view.x) * Lab.view.z + CW / 2, (y - Lab.view.y) * Lab.view.z + CH / 2];
const s2w = (x, y) => [(x - CW / 2) / Lab.view.z + Lab.view.x, (y - CH / 2) / Lab.view.z + Lab.view.y];
const rad = a => a.mono ? 0 : a.el === 'H' ? 13 : 19;
const colOf = el => { const z = D.SYM[el]; return z ? D.CAT[D.catOf(z)][1] : '#fff'; };
function freeSpot() {
  const cx = Lab.view.x, cy = Lab.view.y;
  for (let r = 0; r < 14; r++) for (let k = 0, n = Math.max(1, r * 6); k < n; k++) {
    const g = k / n * Math.PI * 2, x = cx + Math.cos(g) * r * 72, y = cy + Math.sin(g) * r * 72;
    if (!Lab.atoms.some(a => Math.hypot(a.x - x, a.y - y) < (a.mono ? 80 : 58))) return { x, y };
  }
  return { x: cx, y: cy };
}
function nearSpot(p, L) {
  const nb = nbrs(p.id); let best = { x: p.x + L, y: p.y }, bs = -1e9;
  for (let k = 0; k < 16; k++) {
    const g = k / 16 * Math.PI * 2 - Math.PI / 2, x = p.x + Math.cos(g) * L, y = p.y + Math.sin(g) * L; let sc = 0;
    for (const n of nb) { let d = Math.abs(Math.atan2(n.y - p.y, n.x - p.x) - g) % (Math.PI * 2); if (d > Math.PI) d = Math.PI * 2 - d; sc -= Math.max(0, 1.3 - d) * 12; }
    for (const o of Lab.atoms) { const dd = Math.hypot(o.x - x, o.y - y); if (dd < 52) sc -= 52 - dd; }
    if (sc > bs) { bs = sc; best = { x, y }; }
  }
  return best;
}
function pickNext(n, s) {
  if (n && !n.mono && need(n) > 0) { Lab.sel = n.id; return; }
  if (n && n.mono && cap(n) > 0) { Lab.sel = n.id; return; }
  if (s && !s.mono && need(s) > 0) { Lab.sel = s.id; return; }
  const st = s || n; if (!st) { Lab.sel = null; return; }
  const seen = new Set([st.id]), q = [st.id];
  while (q.length) { const v = q.shift(), a = A(v); if (a && !a.mono && need(a) > 0) { Lab.sel = v; return; } for (const b of Lab.bonds) { const u = b.a === v ? b.b : b.b === v ? b.a : null; if (u != null && !seen.has(u)) { seen.add(u); q.push(u); } } }
  Lab.sel = null;
}
function spawn(el) {
  if (Lab.atoms.length >= 90) return toast('Mesa llena: sintetiza o limpia el laboratorio', 'bad');
  snap(); const s = Lab.sel != null ? A(Lab.sel) : null, na = { id: Lab.uid++, el, x: 0, y: 0 };
  if (s && !s.mono && cap(s) > 0 && D.maxVal(el) > 0) {
    Object.assign(na, nearSpot(s, el === 'H' || s.el === 'H' ? 46 : 64)); Lab.atoms.push(na); Lab.bonds.push({ a: s.id, b: na.id, o: 1 }); sfx('bond'); pickNext(na, s);
  } else { Object.assign(na, freeSpot()); Lab.atoms.push(na); Lab.sel = D.maxVal(el) > 0 ? na.id : null; sfx('tap'); }
  redraw(); return na.id;
}
function spawnMono(id) {
  snap(); const s = Lab.sel != null ? A(Lab.sel) : null, na = { id: Lab.uid++, el: id, mono: id, x: 0, y: 0 };
  if (s && s.mono && cap(s) > 0) { Object.assign(na, nearSpot(s, 96)); Lab.atoms.push(na); Lab.bonds.push({ a: s.id, b: na.id, o: 1 }); sfx('bond'); Lab.sel = na.id; }
  else { Object.assign(na, freeSpot()); Lab.atoms.push(na); Lab.sel = na.id; sfx('tap'); }
  redraw(); return na.id;
}
function tapAtom(id) {
  const a = A(id); if (!a) return;
  if (Lab.sel == null || Lab.sel === id || !A(Lab.sel)) { Lab.sel = Lab.sel === id ? null : id; sfx('tap'); redraw(); return; }
  const s = A(Lab.sel);
  if (!!s.mono !== !!a.mono) { toast('Los monómeros solo se unen con monómeros', 'bad'); Lab.sel = id; redraw(); return; }
  if (bondOf(s.id, a.id)) { Lab.sel = id; sfx('tap'); redraw(); return; }
  if (cap(s) < 1 || cap(a) < 1) { const f = cap(s) < 1 ? s : a; if (!f.mono) toast(esc(f.el) + ' no tiene manos libres (valencia ' + D.valence(f.el).join(' o ') + ')'); Lab.sel = id; redraw(); return; }
  snap(); Lab.bonds.push({ a: s.id, b: a.id, o: 1 }); sfx('bond'); vib(8);
  if (a.mono) Lab.sel = a.id; else pickNext(a, s); redraw();
}
function tapBond(b) {
  snap(); const x = A(b.a), y = A(b.b);
  if (x.mono || b.o >= 3 || cap(x) < 1 || cap(y) < 1) { Lab.bonds.splice(Lab.bonds.indexOf(b), 1); sfx('bad'); toast('Enlace borrado'); }
  else { b.o++; sfx('bond'); vib(8); }
  redraw();
}
function delSel() {
  if (Lab.sel == null) return toast('Selecciona un átomo para borrarlo');
  snap(); const id = Lab.sel, nb = nbrs(id)[0];
  Lab.atoms = Lab.atoms.filter(a => a.id !== id); Lab.bonds = Lab.bonds.filter(b => b.a !== id && b.b !== id);
  Lab.sel = nb ? nb.id : null; sfx('tap'); redraw();
}
function clearLab(silent) { if (!Lab.atoms.length) return; if (!silent) snap(); Lab.atoms = []; Lab.bonds = []; Lab.sel = null; redraw(); }
const AUTOH = new Set(['B', 'C', 'N', 'O', 'Si', 'P', 'S', 'F', 'Cl', 'Br', 'I']);
function autoH() {
  const tg = Lab.atoms.filter(a => !a.mono && AUTOH.has(a.el) && need(a) > 0);
  if (!tg.length) return toast('No hay manos libres que llenar con hidrógeno');
  snap(); let n = 0;
  tg.forEach(a => { for (let k = need(a); k > 0; k--) { const h = { id: Lab.uid++, el: 'H', ...nearSpot(a, 46) }; Lab.atoms.push(h); Lab.bonds.push({ a: a.id, b: h.id, o: 1 }); n++; } });
  Lab.sel = null; sfx('bond'); toast('⚡H: ' + n + ' hidrógenos añadidos'); redraw();
}
function toGraph(list) {
  const atoms = list || Lab.atoms, ix = new Map(atoms.map((a, i) => [a.id, i]));
  return { atoms: atoms.map(a => ({ el: a.el, mono: a.mono })), bonds: Lab.bonds.filter(b => ix.has(b.a) && ix.has(b.b)).map(b => ({ a: ix.get(b.a), b: ix.get(b.b), o: b.o })) };
}
/* identifica un componente: devuelve {ok, kind, id, msg} */
function identify(sg) {
  const n = sg.atoms.length;
  if (sg.atoms.every(a => a.mono)) {
    const dg = sg.atoms.map(() => 0); sg.bonds.forEach(b => { dg[b.a]++; dg[b.b]++; });
    if (n < 3) return { ok: false, msg: 'Cadena muy corta: une al menos 3 monómeros.' };
    if (sg.bonds.length !== n - 1 || dg.some(d => d > 2)) return { ok: false, msg: 'Un polímero lineal es una cadena sin ramas ni anillos.' };
    const ms = [...new Set(sg.atoms.map(a => a.mono))].sort(), mk = ms.join('+');
    const pid = DB.polyByKey[mk];
    if (pid) return { ok: true, kind: 'poly', id: pid, n };
    const id = 'XP' + D.djb(mk), tags = {};
    ms.forEach(m => { const p = Object.values(DB.poly).find(q => q.mk === m); const t = p ? p.tags : { seal: 2 }; for (const k in t) tags[k] = Math.min(3, Math.max(tags[k] || 0, t[k])); });
    const f = ms.map(m => DB.comp[m].f).join('/');
    return { ok: true, kind: 'hyb', id, n, def: { id, key: 'P:' + mk, f: '(' + f + ')n', name: 'Copolímero experimental ' + 'ΑΒΓΔΕΖΗΘ'[parseInt(D.djb(mk), 36) % 8] + '-' + ms.length, tags, hyb: 1, poly: 1, groups: ['copolímero'], desc: 'Cadena teórica que alterna ' + ms.map(m => DB.comp[m].name).join(', ') + '. Sus propiedades combinan las de cada homopolímero.' } };
  }
  if (n === 1) {
    const el = sg.atoms[0].el, z = D.SYM[el], c = D.catOf(z);
    if (D.maxVal(el) === 0 || ['alk', 'alkt', 'tran', 'post', 'lan', 'act', 'metd'].includes(c)) return { ok: true, kind: 'el', id: 'el:' + el };
    return { ok: false, msg: 'Un átomo de ' + D.elem(z).name + ' solo es un radical inestable: necesita ' + D.maxVal(el) + ' enlace(s).' };
  }
  const sums = D.bondSums(sg), bad = sg.atoms.map((a, i) => D.valence(a.el).includes(sums[i]) ? null : a.el).filter(Boolean);
  if (bad.length) return { ok: false, msg: 'Inestable: ' + bad.length + ' átomo(s) con manos libres (' + [...new Set(bad)].join(', ') + ').' };
  const key = D.molKey(sg), id = DB.byKey[key];
  if (id) return { ok: true, kind: 'mol', id };
  const def = D.makeHybrid(sg); return { ok: true, kind: 'hyb', id: def.id, def };
}
function layoutOf(list) {
  const cx = list.reduce((s, a) => s + a.x, 0) / list.length, cy = list.reduce((s, a) => s + a.y, 0) / list.length, ix = new Map(list.map((a, i) => [a.id, i]));
  return { a: list.map(a => [a.mono ? '*' + a.mono : a.el, Math.round(a.x - cx), Math.round(a.y - cy)]), b: Lab.bonds.filter(b => ix.has(b.a) && ix.has(b.b)).map(b => [ix.get(b.a), ix.get(b.b), b.o]) };
}
function synth() {
  if (!Lab.atoms.length) { toast('El laboratorio está vacío: toca un átomo de la bandeja'); return []; }
  const g = toGraph(), comps = D.components(g), made = [], fails = [], gone = new Set();
  for (const c of comps) {
    const sg = D.subgraph(g, c), list = c.map(i => Lab.atoms[i]), r = identify(sg);
    if (!r.ok) { fails.push(r); continue; }
    if (r.kind === 'el') { if (S.el[r.id.slice(3)] !== 1) S.el[r.id.slice(3)] = 1; list.forEach(a => gone.add(a.id)); made.push(r); continue; }
    if (r.kind === 'hyb' && !S.hyb[r.id]) { S.hyb[r.id] = r.def; S.st.hyb++; }
    const first = !S.fr[r.id]; const e = S.fr[r.id] || (S.fr[r.id] = { c: 0, t: Date.now() });
    e.c++; if (!e.lay && list.length <= 70) e.lay = layoutOf(list);
    r.first = first; made.push(r); list.forEach(a => gone.add(a.id));
  }
  if (made.length) {
    S.st.synth += made.length;
    const cvr = $('#cv').getBoundingClientRect();
    if (!QUIET) Lab.atoms.filter(a => gone.has(a.id)).slice(0, 4).forEach(a => { const [x, y] = w2s(a.x, a.y); boom(cvr.left + x, cvr.top + y); });
    Lab.atoms = Lab.atoms.filter(a => !gone.has(a.id)); Lab.bonds = Lab.bonds.filter(b => !gone.has(b.a) && !gone.has(b.b)); Lab.sel = null; Lab.hist = [];
    made.forEach(r => {
      const nm = nameOf(r.id);
      if (r.id === 'H2O' && r.first) { toast('¡BUM! 2H₂ + O₂ → 2H₂O · la cámara contuvo la explosión', 'ok'); sfx('boom'); shake(); }
      else toast((r.first ? '¡NUEVO! ' : '') + (r.kind === 'hyb' ? '⚠ HÍBRIDO · ' : r.kind === 'el' ? 'Elemento puro · ' : '') + nm.html, r.first ? 'ok' : '');
      if (r.first) dotFr();
    });
    sfx('ok'); vib(20); missionCheck(made); save();
  }
  if (fails.length) { fails.forEach(f => toast(f.msg, 'bad')); if (!made.length) { sfx('bad'); shake($('#cvWrap')); S.en = Math.max(0, S.en - 2); Lab.flash = 1; } }
  redraw(); hud(); return made;
}
function nameOf(id) {
  if (id.startsWith('el:')) { const s = id.slice(3), e = D.elBySym(s) || { name: s === 'Ubh' && S.eternio ? 'Eternio' : s }; return { html: esc(s) + ' · ' + esc(e.name), f: s, name: e.name }; }
  if (DB.comp[id]) return { html: fHTML(DB.comp[id].f) + ' · ' + esc(DB.comp[id].name), f: DB.comp[id].f, name: DB.comp[id].name };
  if (DB.poly[id]) { const p = DB.poly[id]; return { html: esc(p.name), f: p.mk, name: p.name }; }
  const h = S.hyb[id]; return h ? { html: fHTML(h.f) + ' · ' + esc(h.name), f: h.f, name: h.name } : { html: esc(id), f: id, name: id };
}
/* construir desde SMILES (bot de pruebas y "ver estructura") */
function buildSmiles(smi, ox, oy) {
  const g = D.parseSmiles(smi), ids = [], base = freeSpot(); ox = ox == null ? base.x : ox; oy = oy == null ? base.y : oy;
  const adj = g.atoms.map(() => []); g.bonds.forEach(b => { adj[b.a].push(b.b); adj[b.b].push(b.a); });
  const order = [], seen = new Set([0]), q = [0]; while (q.length) { const v = q.shift(); order.push(v); for (const u of adj[v]) if (!seen.has(u)) { seen.add(u); q.push(u); } }
  order.forEach((v, k) => {
    const par = adj[v].find(u => ids[u] != null); const a = { id: Lab.uid++, el: g.atoms[v].el, x: ox, y: oy };
    if (k && par != null) Object.assign(a, nearSpot(A(ids[par]), 56));
    Lab.atoms.push(a); ids[v] = a.id;
    for (const u of adj[v]) if (ids[u] != null) { const b = g.bonds.find(b => (b.a === v && b.b === u) || (b.a === u && b.b === v)); Lab.bonds.push({ a: ids[u], b: a.id, o: b.o }); }
  });
  redraw(); return ids;
}
/* ---------- dibujo ---------- */
function draw() {
  if (!ctx) return; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, CW, CH);
  const z = Lab.view.z, gs = 32 * z;
  if (gs > 10) { ctx.fillStyle = 'rgba(164,44,255,.22)'; const [ox, oy] = w2s(0, 0); for (let x = ((ox % gs) + gs) % gs; x < CW; x += gs) for (let y = ((oy % gs) + gs) % gs; y < CH; y += gs) ctx.fillRect(x - .75, y - .75, 1.5, 1.5); }
  for (const b of Lab.bonds) {
    const x = A(b.a), y = A(b.b); if (!x || !y) continue;
    const [x1, y1] = w2s(x.x, x.y), [x2, y2] = w2s(y.x, y.y);
    if (x.mono) { ctx.strokeStyle = '#2dffb3'; ctx.lineWidth = 4 * z; ctx.setLineDash([8 * z, 6 * z]); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.setLineDash([]); continue; }
    const t = D.bondType(x.el, y.el); ctx.strokeStyle = t === 'iónico' ? '#ff2fb3' : t === 'covalente polar' ? '#39c8ff' : '#c9a2ff';
    ctx.lineWidth = 2.2 * z; if (t === 'iónico') ctx.setLineDash([5 * z, 4 * z]);
    const L = Math.hypot(x2 - x1, y2 - y1) || 1, nx = -(y2 - y1) / L, ny = (x2 - x1) / L, off = b.o === 1 ? [0] : b.o === 2 ? [-3.2, 3.2] : [-5, 0, 5];
    for (const o of off) { ctx.beginPath(); ctx.moveTo(x1 + nx * o * z, y1 + ny * o * z); ctx.lineTo(x2 + nx * o * z, y2 + ny * o * z); ctx.stroke(); }
    ctx.setLineDash([]);
  }
  for (const a of Lab.atoms) {
    const [x, y] = w2s(a.x, a.y), sel = a.id === Lab.sel;
    if (a.mono) {
      const w = 82 * z, h = 34 * z; ctx.fillStyle = '#03100b'; ctx.strokeStyle = sel ? '#ffc23a' : '#2dffb3'; ctx.lineWidth = (sel ? 3 : 2) * z;
      ctx.beginPath(); ctx.rect(x - w / 2, y - h / 2, w, h); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#e9f6ff'; ctx.font = (15 * z) + 'px Titulos,Arial Narrow,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(D.fUni(DB.comp[a.mono].f), x, y + 1);
      continue;
    }
    const r = rad(a) * z, c = colOf(a.el), nd = need(a);
    ctx.fillStyle = '#05010c'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    ctx.strokeStyle = c; ctx.globalAlpha = .25; ctx.lineWidth = 7 * z; ctx.stroke(); ctx.globalAlpha = 1; ctx.lineWidth = 2 * z; ctx.stroke();
    if (sel) { ctx.strokeStyle = '#ffc23a'; ctx.lineWidth = 2.5 * z; ctx.setLineDash([4 * z, 3 * z]); ctx.beginPath(); ctx.arc(x, y, r + 6 * z, 0, 7); ctx.stroke(); ctx.setLineDash([]); }
    ctx.fillStyle = '#e9f6ff'; ctx.font = ((a.el.length > 1 ? 16 : 19) * z * (a.el === 'H' ? .8 : 1)) + 'px Titulos,Arial Narrow,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(a.el, x, y + 1);
    if (nd > 0) {
      const nb = nbrs(a.id), base = nb.length ? Math.atan2(nb.reduce((s, n) => s + n.y - a.y, 0), nb.reduce((s, n) => s + n.x - a.x, 0)) + Math.PI : -Math.PI / 2;
      ctx.fillStyle = Lab.flash ? '#ff2fb3' : '#ff6fd0';
      for (let k = 0; k < nd; k++) { const g = base + (k - (nd - 1) / 2) * .62; ctx.beginPath(); ctx.arc(x + Math.cos(g) * (r + 5 * z), y + Math.sin(g) * (r + 5 * z), 2.6 * z, 0, 7); ctx.fill(); }
    }
  }
  Lab.flash = 0;
}
function analysis() {
  const el = $('#ana'); if (!el) return;
  if (!Lab.atoms.length) { el.innerHTML = '<span class="m">Mesa vacía · toca un átomo de la bandeja</span>'; return; }
  const g = toGraph(), comps = D.components(g), si = Lab.sel != null ? Lab.atoms.findIndex(a => a.id === Lab.sel) : -1;
  const c = comps.find(c => c.includes(si)) || comps.sort((a, b) => b.length - a.length)[0], sg = D.subgraph(g, c);
  if (sg.atoms.some(a => a.mono)) { el.innerHTML = `<span class="fm">⛓ ${c.length}×</span><span class="m">${esc([...new Set(sg.atoms.map(a => DB.comp[a.mono].name))].join(' + '))}</span>` + (c.length >= 3 ? '<span class="ok">✓ cadena lista</span>' : '<span class="bad">mínimo 3</span>'); return; }
  const cnt = D.countOf(sg), sums = D.bondSums(sg), miss = sg.atoms.reduce((s, a, i) => s + Math.max(0, D.freeOf(a.el, sums[i])), 0), stable = sg.atoms.every((a, i) => D.valence(a.el).includes(sums[i]));
  const gr = sg.atoms.length > 1 ? D.groupsOf(sg).slice(0, 2).join(', ') : '';
  el.innerHTML = `<span class="fm">${fHTML(D.hill(cnt))}</span><span class="m">${D.molarMass(cnt).toFixed(2).replace('.', ',')} g/mol</span>` + (stable && sg.atoms.length > 1 ? '<span class="ok">✓ estable</span>' : `<span class="bad">⚠ ${miss ? 'faltan ' + miss + ' enlace(s)' : 'inestable'}</span>`) + (gr ? `<span class="m">· ${esc(gr)}</span>` : '') + (comps.length > 1 ? `<span class="m">· ${comps.length} piezas</span>` : '');
}
function fit() {
  if (!Lab.atoms.length) { Lab.view = { x: 0, y: 0, z: 1 }; return redraw(); }
  const xs = Lab.atoms.map(a => a.x), ys = Lab.atoms.map(a => a.y), w = Math.max(...xs) - Math.min(...xs) + 120, h = Math.max(...ys) - Math.min(...ys) + 120;
  Lab.view = { x: (Math.max(...xs) + Math.min(...xs)) / 2, y: (Math.max(...ys) + Math.min(...ys)) / 2, z: D.clamp(Math.min(CW / w, CH / h), .35, 1.6) }; redraw();
}
function zoom(f) { Lab.view.z = D.clamp(Lab.view.z * f, .35, 2.2); redraw(); }
function hitAtom(sx, sy) { const [x, y] = s2w(sx, sy); for (let i = Lab.atoms.length - 1; i >= 0; i--) { const a = Lab.atoms[i]; if (a.mono ? Math.abs(a.x - x) < 44 && Math.abs(a.y - y) < 20 : Math.hypot(a.x - x, a.y - y) < rad(a) + 7) return a; } return null; }
function hitBond(sx, sy) {
  const [x, y] = s2w(sx, sy); let best = null, bd = 11 / Lab.view.z;
  for (const b of Lab.bonds) { const p = A(b.a), q = A(b.b); const dx = q.x - p.x, dy = q.y - p.y, L2 = dx * dx + dy * dy || 1, t = D.clamp(((x - p.x) * dx + (y - p.y) * dy) / L2, .15, .85), d = Math.hypot(p.x + t * dx - x, p.y + t * dy - y); if (d < bd) { bd = d; best = b; } }
  return best;
}
function bindCanvas() {
  const cv = $('#cv'), P = new Map(); let st = null, pinch = null;
  const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.addEventListener('pointerdown', e => {
    cv.setPointerCapture(e.pointerId); const p = pos(e); P.set(e.pointerId, p);
    if (P.size === 2) { const [a, b] = [...P.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), z: Lab.view.z }; st = null; return; }
    const at = hitAtom(...p), bd = at ? null : hitBond(...p);
    st = { at: at && at.id, bd, p, v: { ...Lab.view }, moved: false, snapped: false };
  });
  cv.addEventListener('pointermove', e => {
    if (!P.has(e.pointerId)) return; const p = pos(e); P.set(e.pointerId, p);
    if (pinch && P.size === 2) { const [a, b] = [...P.values()]; Lab.view.z = D.clamp(pinch.z * Math.hypot(a[0] - b[0], a[1] - b[1]) / (pinch.d || 1), .35, 2.2); redraw(); return; }
    if (!st) return; const dx = p[0] - st.p[0], dy = p[1] - st.p[1];
    if (!st.moved && Math.hypot(dx, dy) < 7) return; st.moved = true;
    if (st.at != null) { const a = A(st.at); if (!a) return; if (!st.snapped) { snap(); st.snapped = true; } const [wx, wy] = s2w(...p); a.x = wx; a.y = wy; }
    else { Lab.view.x = st.v.x - dx / Lab.view.z; Lab.view.y = st.v.y - dy / Lab.view.z; }
    redraw();
  });
  const up = e => {
    P.delete(e.pointerId); if (P.size < 2) pinch = null; if (!st) return;
    if (!st.moved) { if (st.at != null) tapAtom(st.at); else if (st.bd) tapBond(st.bd); else { Lab.sel = null; redraw(); } }
    st = null;
  };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', e => { P.delete(e.pointerId); pinch = null; st = null; });
  cv.addEventListener('wheel', e => { e.preventDefault(); zoom(e.deltaY < 0 ? 1.1 : 1 / 1.1); }, { passive: false });
}
function renderTray() {
  const els = D.labElements(S);
  let h = '<div class="tsec">Átomos</div>' + els.map(s => { const z = D.SYM[s], v = D.valence(s); return `<button class="at" style="--c:${colOf(s)}" data-act="spawn" data-arg="${s}" aria-label="${esc(D.elem(z).name)}"><span class="z">${z}</span><span class="v">${v.join('/')}</span><span class="s">${s}</span><span class="n">${esc(D.elem(z).name)}</span></button>`; }).join('');
  const monos = Object.keys(S.fr).filter(id => DB.comp[id] && DB.comp[id].mono);
  if ((S.unl >= 8 || S.set.sandbox) && monos.length) h += '<div class="tsec">Monómeros</div>' + monos.map(id => `<button class="at mono" style="--c:#2dffb3" data-act="mono" data-arg="${id}"><span class="s">${fHTML(DB.comp[id].f)}</span><span class="n">${esc(DB.comp[id].name)}</span></button>`).join('');
  $('#tray').innerHTML = h;
}
function coach() {
  const c = $('#coach'); if (!c) return;
  if (MIS) { c.innerHTML = '<b>MISIÓN · ' + esc(MIS.p.t.toUpperCase()) + '</b><br>' + esc(MIS.p.d); return; }
  c.innerHTML = Lab.atoms.length ? '' : '<b>ÉTER</b><br>Toca un átomo de la bandeja. Ve a BATALLA para ver tus problemas.';
}
function setMode(m) {
  Lab.mode = m; $$('.lmode button').forEach(b => b.classList.toggle('on', b.dataset.arg === m));
  $('#molPane').hidden = m !== 'mol'; $('#forgePane').hidden = m !== 'forge';
  if (m === 'forge') renderForge(); else requestAnimationFrame(resize);
}

/* ============================================================
   FORJA NUCLEAR
   ============================================================ */
const Forge = { slots: [null, null, null], flux: 0, log: [] };
const nucSort = (a, b) => { const x = NUC.parse(a), y = NUC.parse(b); return x.z - y.z || x.a - y.a; };
function renderForge() {
  const items = Forge.slots.map(k => k && NUC.parse(k)), r = NUC.fuse(items, Forge.flux);
  const sl = (k, i) => k ? (() => { const p = NUC.parse(k); return `<button class="slot" style="border-color:${colOf(D.elem(p.z).sym)}" data-act="unslot" data-arg="${i}" aria-label="Quitar">${NUC.label(p.z, p.a)}<small>${esc(NUC.name(p.z, p.a))}</small></button>`; })() : `<button class="slot empty" data-act="noop" aria-label="Vacío">+</button>`;
  let pv = '<span class="m">Toca núcleos de abajo para llenar las ranuras. Z y A se suman.</span>';
  const zs = items.filter(Boolean);
  if (zs.length || Forge.flux) {
    const calc = 'Z = ' + (zs.map(p => p.z).join(' + ') || '0') + ' = ' + r.Z + ' · A = ' + ([...zs.map(p => p.a), ...(Forge.flux ? [Forge.flux + 'n'] : [])].join(' + ') || '0') + ' = ' + r.A;
    if (r.ok) { const p = r.prod, e = D.elem(p.z), tag = { stable: '<span class="ok">ESTABLE</span>', decay: '<span class="gold">DECAE ' + r.steps.join(' ') + '</span>', island: '<span class="ok">ISLA DE ESTABILIDAD</span>', shv: '<span class="bad">SUPERPESADO · vive milisegundos</span>' }[r.kind];
      pv = `<div class="m">${calc}</div><div class="big">→ ${NUC.label(p.z, p.a)} ${esc(p.z === 126 && S.eternio ? 'Eternio' : e.name)}</div>${tag}${NUC.radio(p.z, p.a) && r.kind !== 'shv' ? ' <span class="gold">☢ radiactivo</span>' : ''} · <span class="${r.net >= 0 ? 'ok' : 'bad'}">⚡ ${r.net >= 0 ? '+' : ''}${r.net}</span>${r.msg ? '<div class="m">' + esc(r.msg) + '</div>' : ''}`; }
    else pv = `<div class="m">${calc}</div><div class="bad">${esc(r.msg)}</div>`;
  }
  const nucs = Object.keys(S.nuc).sort(nucSort).map(k => { const p = NUC.parse(k); if (!p) return ''; return `<button class="nuc" style="--c:${colOf(D.elem(Math.max(1, p.z)).sym)}" data-act="nuc" data-arg="${k}">${NUC.label(p.z, p.a)}<small>Z${p.z} A${p.a}</small></button>`; }).join('');
  $('#forgePane').innerHTML = `<div class="forge"><div class="slots">${sl(Forge.slots[0], 0)}<span class="plus">+</span>${sl(Forge.slots[1], 1)}<span class="plus">+</span>${sl(Forge.slots[2], 2)}<span class="plus">+</span><div class="flux" aria-label="Flujo de neutrones"><button data-act="flux" data-arg="-1">−</button><span>${Forge.flux}n</span><button data-act="flux" data-arg="1">+</button></div></div>
  <div class="prev" id="fprev">${pv}</div>
  <div class="row"><button class="btn pri" style="flex:1" data-act="fuse">☢ FUSIONAR</button><button class="btn gh" data-act="fclear">✕</button><button class="btn gh" data-act="flux" data-arg="10">+10n</button></div>
  <div class="sec-t">Núcleos descubiertos (reutilizables)</div><div class="nucs">${nucs}</div>
  <div class="sec-t">Bitácora de la forja</div><div class="flog">${Forge.log.slice(-6).reverse().map(esc).join('<br>') || 'Sin fusiones todavía. Prueba p + n.'}</div></div>`;
}
function addNuc(k) { const i = Forge.slots.indexOf(null); Forge.slots[i < 0 ? 2 : i] = k; sfx('tap'); renderForge(); }
function fuse() {
  const items = Forge.slots.map(k => k && NUC.parse(k)), r = NUC.fuse(items, Forge.flux);
  if (!r.ok) {
    if (r.cost > S.en) { toast('Energía insuficiente', 'bad'); return r; }
    S.en -= r.cost; toast(r.msg, 'bad'); sfx('bad'); shake($('#forgePane')); Forge.log.push('✕ ' + r.msg); hud(); renderForge(); return r;
  }
  if (r.net < 0 && S.en + r.net < 0) { toast('Energía insuficiente: necesitas ⚡' + (-r.net) + '. Fusiona núcleos ligeros (D + D) o resuelve problemas.', 'bad'); sfx('bad'); return r; }
  S.en = D.clamp(S.en + r.net, 0, MAXE); S.st.fuse++;
  const p = r.prod, e = D.elem(p.z), k = NUC.key(p.z, p.a), sym = e.sym;
  let msg;
  if (r.kind === 'shv') { if (!S.el[sym]) S.el[sym] = 'det'; msg = '☢ ' + NUC.label(p.z, p.a) + ' ' + e.name + ' detectado: decae en milisegundos'; }
  else {
    const newN = !S.nuc[k]; S.nuc[k] = 1; const newE = S.el[sym] !== 1 && p.z > 1; if (newE) S.el[sym] = 1;
    if (p.z === 126 && r.kind === 'island') S.eternio = 1;
    msg = (newE ? '¡ELEMENTO NUEVO! ' : newN ? '¡Núcleo nuevo! ' : '') + NUC.label(p.z, p.a) + ' ' + (p.z === 126 && S.eternio ? 'Eternio' : e.name) + (r.steps.length ? ' (' + r.steps.join(' ') + ')' : '');
    if (newE) { renderTray(); dotFr(); }
  }
  Forge.log.push(NUC.label(p.z, p.a) + ' ← ' + Forge.slots.filter(Boolean).join(' + ') + (Forge.flux ? ' + ' + Forge.flux + 'n' : '') + ' · ⚡' + (r.net >= 0 ? '+' : '') + r.net);
  toast(msg, 'ok'); sfx('fuse'); vib(30); const pv = $('#fprev'); if (pv) { pv.classList.remove('fuseFx'); void pv.offsetWidth; pv.classList.add('fuseFx'); }
  renderForge(); hud(); save();
  if (MIS && MIS.p.k === 'f') { const q = MIS.p; if (p.z === q.z && (!q.a || q.a === p.a) && (q.det ? true : r.kind !== 'shv') && (!q.isl || r.kind === 'island')) completeMission(); }
  return r;
}

/* ============================================================
   MISIONES, RECOMPENSAS Y FALLOS
   ============================================================ */
let MIS = null;
function giftLevel(L) { (LEVELS[L - 1].gift || []).forEach(s => { if (S.el[s] !== 1) S.el[s] = 1; }); }
function startProblem(L, i) {
  closeModal(); const p = LEVELS[L - 1].P[i]; if (!p) return;
  if (!D.problemOpen(S, L, i)) return toast('Resuelve primero el problema anterior', 'bad');
  if (p.k === 'b') return openDeck(L, i);
  MIS = { L, i, p, t: p.T, T: p.T }; $('#mbar').hidden = false; updMbar();
  setTab('lab'); setMode(p.k === 'f' ? 'forge' : 'mol'); coach(); renderTray();
}
function updMbar() {
  if (!MIS) return; const p = MIS.p, tgt = p.k === 'f' ? 'Z ' + p.z + (p.a ? ' · A ' + p.a : '') + ' ' + D.elem(p.z).name : nameOf(p.id).html;
  $('#mbar .mt').innerHTML = '<b class="gold">' + MIS.L + '·' + (MIS.i + 1) + '</b> ' + esc(p.t) + ' → ' + tgt;
  const tm = $('#mbar .tm'); tm.textContent = Math.ceil(MIS.t); tm.classList.toggle('low', MIS.t < 15);
  $('#mbar .bar').style.width = (100 * MIS.t / MIS.T) + '%';
}
function missionCheck(made) { if (!MIS || (MIS.p.k !== 'm' && MIS.p.k !== 'p')) return; if (made.some(r => r.id === MIS.p.id)) completeMission(); }
function endMission() { MIS = null; $('#mbar').hidden = true; coach(); }
function completeMission() {
  const m = MIS; if (!m) return; const used = 1 - m.t / m.T, stars = used <= .4 ? 3 : used <= .7 ? 2 : 1;
  endMission(); win(m.L, m.i, stars, Math.round(m.t) * 2);
}
function failMission(why) {
  const m = MIS; endMission(); const p = m.p;
  const hint = p.k === 'f' ? 'Receta posible: ' + p.r.replace(/\+/g, ' + ') : 'Revisa la valencia de cada átomo: ' + nameOf(p.id).html;
  lose(m.L, m.i, why, hint);
}
function win(L, i, stars, bonus) {
  const k = D.pk(L, i), was = D.levelDone(S, L), prev = S.prog[k] || 0;
  S.prog[k] = Math.max(prev, stars); const sc = 100 * stars + bonus; S.sc += sc; S.en = D.clamp(S.en + 20 + 10 * stars, 0, MAXE); S.st.win++;
  let up = false; if (!was && D.levelDone(S, L) && S.unl === L && L < LEVELS.length) { S.unl = L + 1; giftLevel(L + 1); up = true; }
  save(true); hud(); sfx('win'); vib([30, 40, 60]);
  const lvl = LEVELS[L - 1], done = !was && D.levelDone(S, L), next = i < 9 ? i + 1 : null;
  const isEnd = L === LEVELS.length && done;
  modal(`<div class="pag">Nivel ${L} · Problema ${i + 1} / 10</div><div class="boxed spaced" style="margin-top:8px">Resuelto</div><h2 class="mega">${esc(lvl.P[i].t)}</h2><div class="stars">${'★'.repeat(stars)}<span style="opacity:.25">${'★'.repeat(3 - stars)}</span></div><p>+${sc} puntos · ⚡ +${20 + 10 * stars}</p>` +
    (done ? `<div class="film" style="margin:10px 0">Nivel ${L} completado: ${esc(lvl.t)}.${up ? ' Se abre el nivel ' + (L + 1) + ': ' + esc(LEVELS[L].t) + '.' : ''}</div><p class="m">Doc Element es gratis y siempre lo será. Si te enseñó algo, puedes apoyar con <b class="gold">1 USD</b> (opcional).</p>` : '') +
    `<div class="row" style="margin-top:12px">${isEnd ? '<button class="btn pri" data-act="ending">Final de temporada ▸</button>' : next != null ? `<button class="btn pri" data-act="open" data-arg="${L},${next}">Siguiente ▸</button>` : up ? `<button class="btn pri" data-act="lvl" data-arg="${L + 1}">Nivel ${L + 1} ▸</button>` : ''}<button class="btn gh" data-act="tomap">Mapa</button>${done ? '<button class="btn gh" data-act="donate">☕ Donar</button>' : ''}</div>`);
  if (up) S.cur = L + 1; renderMap(); renderTray();
}
function lose(L, i, why, hint) {
  S.st.fail++; save(); sfx('lose'); vib(120);
  ADS.inter(() => modal(`<div class="pag">Nivel ${L} · Problema ${i + 1} / 10</div><div class="boxed spaced bad" style="margin-top:8px;border-color:var(--mag)">Fallo</div><h2 class="mega">${esc(LEVELS[L - 1].P[i].t)}</h2><p class="w">${esc(why)}</p><div class="film" style="margin:10px 0">ÉTER: ${hint}</div><div class="row"><button class="btn pri" data-act="open" data-arg="${L},${i}">Reintentar</button><button class="btn gh" data-act="close">Laboratorio</button></div>`));
}

/* ============================================================
   BATALLA
   ============================================================ */
let BT = null, DECK = new Set();
function openDeck(L, i) {
  const p = LEVELS[L - 1].P[i], cards = D.allCards(S); DECK = new Set((S.deck || []).filter(id => cards.some(c => c.id === id)).slice(0, 4));
  const list = cards.map(c => `<button class="card ${c.kind === 'el' ? 'el' : c.kind}${DECK.has(c.id) ? ' sel' : ''}" style="--c:${c.kind === 'el' ? colOf(c.f) : ''}" data-act="pick" data-arg="${esc(c.id)}"><span class="k">${{ el: 'ELEM', mol: 'MOL', poly: 'POLI', hyb: 'HÍBR' }[c.kind]}</span><span class="f">${fHTML(c.f)}</span><span class="nm">${esc(c.name)}</span><span class="tg">${tagChips(c.tags, 3)}</span></button>`).join('');
  modal(`<div class="pag">Nivel ${L} · Problema ${i + 1} / 10 · ${p.boss ? 'Jefe' : 'Batalla'}</div><h2 class="mega">${esc(p.t)}</h2><p>${esc(p.d)}</p><div class="film">Escáner: ${esc(p.sc)}<br>Amenaza ${p.hp} · ${p.T} s · drena ${p.dps} %/s</div><div class="sec-t">Elige hasta 4 cartas (<span id="dkn">${DECK.size}</span>/4)</div>` +
    (cards.length ? `<div class="grid">${list}</div>` : '<p class="bad">No tienes cartas. Crea compuestos en el laboratorio.</p>') +
    `<div class="row" style="margin-top:12px;position:sticky;bottom:-16px;background:#000;padding:8px 0"><button class="btn pri" data-act="fight" data-arg="${L},${i}" ${cards.length ? '' : 'disabled'}>☣ ¡A la batalla!</button><button class="btn gh" data-act="close">Volver</button></div>`);
}
function pick(id, el) {
  if (DECK.has(id)) DECK.delete(id); else { if (DECK.size >= 4) return toast('Máximo 4 cartas'); DECK.add(id); }
  el.classList.toggle('sel', DECK.has(id)); const n = $('#dkn'); if (n) n.textContent = DECK.size; sfx('tap');
}
const GLYPH = ['☣', '✹', '☢', '⚠', '❂', '✺', '⌬', '☄', '✷', '⚛'];
function startBattle(L, i, ids) {
  ids = ids || [...DECK]; if (!ids.length) return toast('Elige al menos una carta', 'bad');
  const cards = ids.map(id => D.cardFromId(S, id)).filter(Boolean).slice(0, 4); S.deck = ids.slice(0, 4);
  closeModal(); endMission(); const p = LEVELS[L - 1].P[i], b = BAT.create(p, cards); BT = { b, L, i };
  const el = $('#battle');
  el.innerHTML = `<div class="bt-top"><span class="mega">${esc(p.t)}</span><span class="tm" id="btT">${p.T}</span><button class="btn gh" style="min-height:36px;padding:4px 10px;font-size:15px" data-act="flee">Huir</button></div>
  <div class="bars"><div class="hb"><i id="btHp" style="width:100%"></i><span id="btHpN">${p.hp}</span></div><div class="hb ship"><i id="btIn" style="width:100%"></i><span id="btInN">Nave 100 %</span></div></div>
  <div class="arena" id="arena"><div class="combo" id="btC"></div><div class="threat" id="thr">${GLYPH[(L * 3 + i) % GLYPH.length]}</div><div class="phase" id="btPh">${esc(p.sc)}</div></div>
  <div class="deck">${cards.map((c, k) => `<button class="dk" data-act="throw" data-arg="${k}"><span class="f">${fHTML(c.f)}</span><span class="nm">${esc(c.name)}</span><span class="tg">${tagChips(c.tags, 2)}</span><i class="cd" id="cd${k}" style="height:0"></i></button>`).join('')}</div>`;
  el.hidden = false; sfx('tap');
}
function throwCard(k) {
  if (!BT || BT.b.over) return null; const b = BT.b, c = b.deck[k]; if (!c) return null;
  const r = BAT.throw(b, c); if (!r) return null;
  const ar = $('#arena'), thr = $('#thr');
  if (ar && thr && !TEST) {
    const cb = $$('.dk')[k].getBoundingClientRect(), ab = ar.getBoundingClientRect(), tb = thr.getBoundingClientRect();
    const s = document.createElement('div'); s.className = 'shot'; s.style.left = (cb.left + cb.width / 2 - ab.left - 8) + 'px'; s.style.top = (ab.height - 10) + 'px'; s.style.background = r.kind === 'hit' ? 'var(--ink)' : r.kind === 'heal' ? 'var(--mag)' : '#777'; ar.appendChild(s);
    requestAnimationFrame(() => { s.style.transform = `translate(${tb.left + tb.width / 2 - cb.left - cb.width / 2}px,${-(ab.height - (tb.top - ab.top) - tb.height / 2)}px)`; s.style.opacity = '.2'; });
    setTimeout(() => s.remove(), 320);
  }
  setTimeout(() => {
    if (!ar) return; const pp = document.createElement('div'); pp.className = 'pop';
    pp.style.left = (40 + Math.random() * 20) + '%'; pp.style.top = '34%';
    pp.style.color = r.kind === 'hit' ? 'var(--amb)' : r.kind === 'heal' ? 'var(--mag)' : '#999';
    pp.textContent = r.kind === 'hit' ? '−' + r.dmg + (b.combo > 1 ? ' ×' + BAT.mult(b.combo).toFixed(1) : '') : r.kind === 'heal' ? '¡EMPEORA! +' + Math.round(r.dmg / 2) : 'SIN EFECTO';
    ar.appendChild(pp); setTimeout(() => pp.remove(), 900);
    if (thr) { thr.classList.remove('hit'); void thr.offsetWidth; thr.classList.add('hit'); }
  }, TEST ? 0 : 260);
  sfx(r.kind === 'hit' ? 'hit' : r.kind === 'heal' ? 'heal' : 'tap'); vib(r.kind === 'hit' ? 15 : 60);
  return r;
}
function battleUI() {
  if (!BT) return; const b = BT.b;
  const set = (id, f) => { const e = document.getElementById(id); if (e) f(e); };
  set('btT', e => { e.textContent = Math.max(0, Math.ceil(b.t)); });
  set('btHp', e => e.style.width = (100 * Math.max(0, b.hp) / b.max) + '%'); set('btHpN', e => e.textContent = Math.max(0, Math.round(b.hp)));
  set('btIn', e => e.style.width = Math.max(0, b.integ) + '%'); set('btInN', e => e.textContent = 'Nave ' + Math.max(0, Math.round(b.integ)) + ' %');
  set('btC', e => e.textContent = b.combo > 1 ? 'COMBO ×' + b.combo : '');
  b.deck.forEach((c, k) => set('cd' + k, e => e.style.height = (100 * (b.cd[c.id] || 0) / BAT.CD) + '%'));
  while (b.ev.length) { const ev = b.ev.shift(); if (ev.k === 'spike') { shake($('#battle')); vib(40); } if (ev.k === 'phase') { set('btPh', e => e.innerHTML = '<b class="gold">FASE 2</b> · ' + esc(b.ph.d)); toast('FASE 2: ' + esc(b.ph.d), 'bad'); } }
  if (b.over) endBattle();
}
function endBattle() {
  const { b, L, i } = BT; BT = null; $('#battle').hidden = true; $('#battle').innerHTML = '';
  if (b.win) win(L, i, b.stars, Math.round(b.t) * 3 + b.maxCombo * 10);
  else {
    const p = b.p, w = D.parseTags(p.w), h = D.parseTags(p.h);
    lose(L, i, b.why || 'Retirada.', 'Su debilidad: <b>' + tagWords(w) + '</b>' + (Object.keys(h).length ? ' · la alimenta: ' + tagWords(h) : '') + (p.hx ? ' · empeora con: ' + p.hx.split(',').map(x => nameOf(x).f).join(', ') : '') + '. Crea compuestos con esas propiedades.');
  }
}
function flee() { if (!BT) return; BT.b.over = true; BT.b.win = false; BT.b.why = 'Huiste de la batalla.'; battleUI(); }

/* ============================================================
   FRASCOS · MAPA · TRANSMISIONES
   ============================================================ */
let FF = 'all';
function renderFr() {
  const box = $('#frBody'); if (!box) return;
  $$('#t-fr .filt button').forEach(b => b.classList.toggle('on', b.dataset.arg === FF));
  if (FF === 'tab') return renderTable(box);
  const items = [];
  if (FF === 'all' || FF === 'el') Object.keys(S.el).filter(s => S.el[s] === 1).sort((a, b) => (D.SYM[a] || 126) - (D.SYM[b] || 126)).forEach(s => { const z = D.SYM[s] || 126, e = D.elem(z); items.push(`<button class="card el" style="--c:${colOf(D.SYM[s] ? s : 'Og')}" data-act="det" data-arg="el:${s}"><span class="k">Z ${z}</span><span class="f">${esc(s)}</span><span class="nm">${esc(z === 126 && S.eternio ? 'Eternio' : e.name)}</span><span class="tg">${tagChips(D.parseTags(ELTAGS[s] || ''), 2)}</span></button>`); });
  const ids = Object.keys(S.fr).sort((a, b) => S.fr[a].t - S.fr[b].t);
  ids.forEach(id => {
    const kind = DB.comp[id] ? 'mol' : DB.poly[id] ? 'poly' : 'hyb';
    if (FF !== 'all' && FF !== kind) return;
    const n = nameOf(id), t = (DB.comp[id] || DB.poly[id] || S.hyb[id] || {}).tags || {};
    items.push(`<button class="card ${kind}" data-act="det" data-arg="${esc(id)}"><span class="k">${{ mol: 'MOL', poly: 'POLI', hyb: 'HÍBR' }[kind]} ×${S.fr[id].c}</span><span class="f">${DB.poly[id] ? '[' + fHTML(DB.poly[id].ms.map(m => DB.comp[m].f).join('/')) + ']ₙ' : fHTML(n.f)}</span><span class="nm">${esc(n.name)}</span><span class="tg">${tagChips(t, 3)}</span></button>`);
  });
  const tot = Object.keys(DB.comp).length + Object.keys(DB.poly).length, have = Object.keys(S.fr).filter(id => DB.comp[id] || DB.poly[id]).length;
  box.innerHTML = `<div class="sect"><span class="outline">${have}</span><div><div class="pag">de ${tot} sustancias del catálogo · ${Object.keys(S.hyb).length} híbridos</div><h2 class="mega">Frascos</h2></div></div>` + (items.length ? `<div class="grid">${items.join('')}</div>` : '<p class="m">Aún no hay nada aquí. Sintetiza en el laboratorio.</p>');
}
function renderTable(box) {
  let h = '';
  for (let z = 1; z <= 118; z++) {
    const e = D.elem(z), [r, c] = D.tablePos(z), st = S.el[e.sym], col = D.CAT[D.catOf(z)][1];
    h += `<button class="${st === 1 ? 'on' : st === 'det' ? 'det' : ''}" style="grid-row:${r > 7 ? r + 1 : r};grid-column:${c};--c:${col}" data-act="det" data-arg="el:${e.sym}" aria-label="${esc(e.name)}">${e.sym}</button>`;
  }
  const n = Object.values(S.el).filter(v => v === 1).length;
  box.innerHTML = `<div class="sect"><span class="outline">${n}</span><div><div class="pag">elementos descubiertos · toca para ver datos</div><h2 class="mega">Tabla</h2></div></div><div style="overflow-x:auto"><div class="ptab">${h}<div class="gap" style="grid-row:8"></div></div></div><p class="m">${Object.entries(D.CAT).map(([k, v]) => `<span style="color:${v[1]}">■</span> ${v[0]}`).join(' · ')}</p>`;
}
function drawMini(cv, lay) {
  const c = cv.getContext('2d'), W = cv.width, H = cv.height, xs = lay.a.map(a => a[1]), ys = lay.a.map(a => a[2]);
  const w = Math.max(...xs) - Math.min(...xs) + 70, h = Math.max(...ys) - Math.min(...ys) + 70, s = Math.min(W / w, H / h, 1.4), mx = (Math.max(...xs) + Math.min(...xs)) / 2, my = (Math.max(...ys) + Math.min(...ys)) / 2;
  const P = a => [W / 2 + (a[1] - mx) * s, H / 2 + (a[2] - my) * s];
  c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
  lay.b.forEach(([i, j, o]) => { const [x1, y1] = P(lay.a[i]), [x2, y2] = P(lay.a[j]); c.strokeStyle = '#c9a2ff'; c.lineWidth = 2; const L = Math.hypot(x2 - x1, y2 - y1) || 1, nx = -(y2 - y1) / L, ny = (x2 - x1) / L; (o === 1 ? [0] : o === 2 ? [-3, 3] : [-5, 0, 5]).forEach(f => { c.beginPath(); c.moveTo(x1 + nx * f, y1 + ny * f); c.lineTo(x2 + nx * f, y2 + ny * f); c.stroke(); }); });
  lay.a.forEach(a => { const [x, y] = P(a), mono = a[0][0] === '*', el = mono ? a[0].slice(1) : a[0]; c.fillStyle = '#05010c'; c.strokeStyle = mono ? '#2dffb3' : colOf(el); c.lineWidth = 2; c.beginPath(); mono ? c.rect(x - 30 * s, y - 12 * s, 60 * s, 24 * s) : c.arc(x, y, (el === 'H' ? 10 : 15) * s, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#fff'; c.font = (mono ? 11 : el === 'H' ? 12 : 15) * s + 'px Titulos,Arial Narrow,sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(mono ? D.fUni(DB.comp[el].f) : el, x, y + 1); });
}
function detail(id) {
  let html;
  if (id.startsWith('el:')) {
    const s = id.slice(3), z = D.SYM[s] || 126, e = D.elem(z), st = S.el[s], pos = D.tablePos(z);
    html = `<div class="pag">Elemento · Z ${z}</div><div class="sect"><span class="outline">${z}</span><h2 class="mega">${esc(z === 126 && S.eternio ? 'Eternio' : e.name)}</h2></div><div class="kv"><b>Símbolo</b><span class="w">${esc(s)}</span><b>Masa atómica</b><span>${e.mass.toString().replace('.', ',')} u</span><b>Familia</b><span style="color:${D.CAT[D.catOf(z)][1]}">${D.CAT[D.catOf(z)][0]}</span><b>Periodo</b><span>${pos[0] > 7 ? pos[0] - 3 : pos[0]}</span><b>Valencia</b><span>${D.valence(s).join(' o ')}</span><b>Estado</b><span class="${st === 1 ? 'ok' : st === 'det' ? 'gold' : 'm'}">${st === 1 ? 'Descubierto' : st === 'det' ? 'Detectado (inestable)' : 'Sin descubrir'}</span></div>` +
      (st === 1 ? `<div class="tg" style="margin-top:10px">${tagChips(D.parseTags(ELTAGS[s] || ''))}</div>` : '') + (z === 126 ? '<p>Ficción casi real: los físicos predicen que el 126 con 184 neutrones sería “doblemente mágico” y viviría mucho más que sus vecinos.</p>' : '');
  } else {
    const c = DB.comp[id] || DB.poly[id] || S.hyb[id]; if (!c) return; const e = S.fr[id] || {}, n = nameOf(id);
    html = `<div class="pag">${DB.comp[id] ? 'Compuesto real' : DB.poly[id] ? 'Polímero real' : 'Híbrido · ficción casi real'} · creado ×${e.c || 0}</div><h2 class="mega">${esc(n.name)}</h2><div class="mega" style="font-size:34px;color:var(--wht)">${DB.poly[id] ? '[' + fHTML(DB.poly[id].ms.map(m => DB.comp[m].f).join('/')) + ']ₙ' : fHTML(n.f)}</div>` +
      (e.lay ? '<canvas class="mini" id="miniCv" width="320" height="180"></canvas>' : '') + `<p>${esc(c.desc)}</p><div class="tg">${tagChips(c.tags)}</div>` +
      (c.mass ? `<div class="kv" style="margin-top:10px"><b>Masa molar</b><span>${c.mass.toFixed(2).replace('.', ',')} g/mol</span>${c.groups && c.groups.length ? `<b>Grupos</b><span>${esc(c.groups.join(', '))}</span>` : ''}${DB.comp[id] && DB.comp[id].mono ? '<b>Uso</b><span class="ok">Monómero: bloque para polímeros</span>' : ''}</div>` : '');
  }
  modal(html); const m = $('#miniCv'); if (m && S.fr[id] && S.fr[id].lay) drawMini(m, S.fr[id].lay);
}
const ICON = { m: '⚗', p: '⛓', f: '☢', b: '☣' };
function renderMap() {
  const box = $('#mapBody'); if (!box) return; const L = S.cur, lv = LEVELS[L - 1];
  $('#lvls').innerHTML = LEVELS.map(l => `<button class="${l.n === L ? 'on' : ''} ${D.levelDone(S, l.n) ? 'done' : ''} ${l.n > S.unl ? 'lock' : ''}" data-act="lvl" data-arg="${l.n}" aria-label="Nivel ${l.n}">${l.n > S.unl ? '🔒' : l.n}</button>`).join('');
  const pts = lv.P.map((p, i) => [70 + i * 98, 125 + Math.sin(i * 1.3) * 62]);
  const nodes = lv.P.map((p, i) => { const k = D.pk(L, i), st = S.prog[k] || 0, open = D.problemOpen(S, L, i), nx = open && !st; return `<button class="node ${p.boss ? 'boss' : ''} ${st ? 'done' : ''} ${open ? '' : 'lock'} ${nx ? 'next' : ''}" style="left:${pts[i][0]}px;top:${pts[i][1]}px" data-act="open" data-arg="${L},${i}" aria-label="Problema ${i + 1}"><span class="ic">${p.boss ? '✹' : ICON[p.k]}</span><span class="nn">${i + 1}</span><span class="st">${st ? '★'.repeat(st) : ''}</span></button>`; }).join('');
  box.innerHTML = `<div class="sect"><span class="outline">${L}</span><div><div class="pag">Temporada 1 · Núcleo · ${D.starsOf(S, L)}/30 ★</div><h2 class="mega">${esc(lv.t)}</h2></div></div><p class="kick" style="margin:0 0 8px">${esc(lv.s)}</p>
  <div class="map"><div class="mapin"><svg viewBox="0 0 1020 250" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="#4d1785" stroke-width="3" stroke-dasharray="8 7"/></svg>${nodes}</div></div>
  <div class="row" style="margin-top:12px"><button class="btn" data-act="txl" data-arg="${L}">▶ Transmisión ${L}</button><span class="m">⚗ síntesis · ⛓ polímero · ☢ forja · ☣ batalla · ✹ jefe</span></div>
  <div class="film" style="margin-top:12px">Rango: ${esc(D.rankOf(S))} · ${D.totalStars(S)} ★ de 300 · Problemas resueltos: ${Object.keys(S.prog).length}/100</div>`;
  const map = $('.map', box), nx = $('.node.next', box); if (map && nx) map.scrollLeft = Math.max(0, parseFloat(nx.style.left) - map.clientWidth / 2);
}
function openProblem(L, i) {
  const p = LEVELS[L - 1].P[i]; if (!D.problemOpen(S, L, i)) return toast('🔒 Resuelve primero el problema anterior');
  const st = S.prog[D.pk(L, i)] || 0, kind = p.boss ? 'Jefe' : { m: 'Síntesis', p: 'Polímero', f: 'Forja', b: 'Batalla' }[p.k];
  const tgt = p.k === 'b' ? `Escáner: ${esc(p.sc)}<br>Amenaza ${p.hp} · ${p.T} s` : p.k === 'f' ? `Objetivo: Z = ${p.z}${p.a ? ' · A = ' + p.a : ''} · ${esc(D.elem(p.z).name)}${p.det ? ' (basta detectarlo)' : ''}<br>Tiempo: ${p.T} s` : `Objetivo: ${nameOf(p.id).html}<br>Tiempo: ${p.T} s`;
  modal(`<div class="pag">Nivel ${L} · Problema ${i + 1} / 10</div><div class="boxed spaced" style="margin-top:8px;display:inline-block">${spaced(kind)}</div><h2 class="mega">${esc(p.t)}</h2><p>${esc(p.d)}</p><div class="film">${tgt}</div>${st ? `<div class="stars" style="font-size:22px">${'★'.repeat(st)}</div>` : ''}<div class="row" style="margin-top:12px"><button class="btn pri" data-act="go" data-arg="${L},${i}">${p.k === 'b' ? 'Preparar mazo' : 'Iniciar'} ▸</button><button class="btn gh" data-act="close">Cerrar</button></div>`);
}
function renderTx() {
  $('#txBody').innerHTML = `<div class="sect"><span class="outline">${S.unl}</span><div><div class="pag">Guiones de video narrados por Doc · 1 por nivel</div><h2 class="mega">Transmisiones</h2></div></div>` + LEVELS.map(l => `<button class="tx-card ${l.n > S.unl ? 'lock' : ''}" data-act="txl" data-arg="${l.n}"><span class="outline">${String(l.n).padStart(2, '0')}</span><span><span class="mega" style="font-size:28px">${esc(l.t)}</span><br><span class="m">${l.n > S.unl ? 'Señal cifrada · desbloquea el nivel' : esc(l.s)}</span></span></button>`).join('');
}
function txLevel(L) {
  const l = LEVELS[L - 1]; if (L > S.unl) return toast('🔒 Señal cifrada: llega al nivel ' + L);
  modal(`<div class="pag">Transmisión ${String(L).padStart(2, '0')} · Guion de video · Narra: Doc</div><h2 class="mega">${esc(l.t)}</h2><p class="kick">${esc(l.s)}</p><div class="sec-t">Teoría</div><div class="film">${esc(l.tx.teo)}</div><div class="sec-t">Dato curioso</div><div class="film">${esc(l.tx.dato)}</div><div class="sec-t">Ficción · bitácora de Doc</div><div class="film">${esc(l.tx.fic)}</div><div class="row" style="margin-top:12px"><button class="btn pri" data-act="channel">▶ Ver el video</button><button class="btn gh" data-act="close">Cerrar</button></div>`);
}

/* ============================================================
   PORTADA · HISTORIA · MENÚ
   ============================================================ */
const ART = `<svg class="cart" viewBox="0 0 200 200" aria-hidden="true"><defs><radialGradient id="cg"><stop offset="0" stop-color="#a42cff" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs><circle cx="100" cy="100" r="96" fill="url(#cg)"/><g fill="none" stroke-width="2.4"><ellipse cx="100" cy="100" rx="86" ry="30" stroke="#39c8ff"/><ellipse cx="100" cy="100" rx="86" ry="30" stroke="#a42cff" transform="rotate(60 100 100)"/><ellipse cx="100" cy="100" rx="86" ry="30" stroke="#ff2fb3" transform="rotate(120 100 100)"/></g><circle cx="100" cy="100" r="62" fill="none" stroke="#2dffb3" stroke-width="5" stroke-dasharray="330 60" transform="rotate(-80 100 100)"/><path d="M160 74 l12 -4 -4 12z" fill="#2dffb3"/><circle cx="100" cy="100" r="11" fill="#e9f6ff"/></svg>`;
function cover() {
  const c = document.createElement('div'); c.className = 'cover'; c.id = 'cover';
  const has = S.intro || Object.keys(S.prog).length;
  c.innerHTML = `<div class="cband"><div>${esc(CFG.STUDIO)}</div><div>Temporada 1 · Cada semana</div></div><div class="cbody"><div class="srf">Química real, núcleos, polímeros,<br>vida, ficción y más</div><h1 class="mega">Doc</h1>${ART}<h1 class="mega b2">Element</h1><span class="kick">¿Sabes de qué está hecho todo?</span><div class="ctag">Crea elementos.<br>Resuelve el universo.</div><div class="cbtns">${has ? '<button class="btn pri" data-act="cont">Continuar ▸</button>' : ''}<button class="btn ${has ? 'gh' : 'pri'}" data-act="newgame">${has ? 'Nueva partida' : 'Despertar ▸'}</button></div></div><div class="cfoot"><span class="pag">Por: ${esc(CFG.STUDIO)} · ${esc(CFG.PUBLISHER)}</span><span class="adv">Lab advisory<b>Verídico</b>Contenido seguro</span><span class="mega">El laboratorio más actual</span></div>`;
  document.body.appendChild(c);
}
let SLIDES = null, SI = 0, AFTER = null;
function slides(list, after) {
  SLIDES = list; SI = 0; AFTER = after; const el = document.createElement('div'); el.className = 'cover'; el.id = 'story'; document.body.appendChild(el); slide();
}
function slide() {
  const el = $('#story'); if (!el) return; const [t, x] = SLIDES[SI];
  el.innerHTML = `<div class="cband"><div>Ouroboros · Bitácora</div><div>${SI + 1} / ${SLIDES.length}</div></div><div class="cbody" style="justify-content:center;gap:18px"><div class="boxed spaced" style="font-size:clamp(14px,4.4vw,24px)">${spaced(t)}</div><div class="film" style="font-size:clamp(13px,3.8vw,17px);text-align:left;width:100%">${esc(x)}</div><div class="row"><button class="btn pri" data-act="snext">${SI < SLIDES.length - 1 ? 'Siguiente ▸' : 'Comenzar ▸'}</button><button class="btn gh" data-act="sskip">Saltar</button></div></div><div class="cfoot"><span class="pag">Pag ${SI + 1}</span><span class="pag">Doc Element</span></div>`;
}
function endSlides() { const el = $('#story'); if (el) el.remove(); const f = AFTER; AFTER = null; f && f(); }
function enterGame() { const c = $('#cover'); if (c) c.remove(); hud(); renderTray(); setTab(TAB); requestAnimationFrame(resize); if (!S.intro) { S.intro = 1; save(); slides(STORY.intro, () => openProblem(1, 0)); } }
function menu() {
  modal(`<div class="pag">Ouroboros · menú</div><h2 class="mega">Menú</h2><div class="grid" style="grid-template-columns:1fr 1fr">${[['guide', '📖 Guía'], ['credits', '✦ Créditos'], ['settings', '⚙ Ajustes'], ['donate', '☕ Donar'], ['diag', '🤖 Bot de pruebas'], ['tocover', '⌂ Portada']].map(([a, t]) => `<button class="btn gh" data-act="${a}">${t}</button>`).join('')}</div><div class="film" style="margin-top:12px">Rango: ${esc(D.rankOf(S))} · ${D.totalStars(S)} ★ · síntesis ${S.st.synth} · fusiones ${S.st.fuse} · híbridos ${S.st.hyb} · victorias ${S.st.win} · fallos ${S.st.fail}</div>`);
}
function guide() { modal(`<div class="pag">Manual de ÉTER</div><h2 class="mega">Guía</h2>` + GUIDE.map(([t, x]) => `<div class="sec-t">${esc(t)}</div><p>${esc(x)}</p>`).join('')); }
function credits() {
  modal(`<div class="pag">Doc Element · v${CFG.VERSION} · Temporada 1: Núcleo</div><h2 class="mega">Créditos</h2><div class="boxed" style="text-align:center"><div class="mega" style="font-size:44px">${esc(CFG.STUDIO)}</div><div class="spaced" style="font-size:12px;margin:6px 0">por</div><div class="mega" style="font-size:36px;color:var(--grn)">${esc(CFG.PUBLISHER)}</div></div>
  <div class="sec-t">Idea, historia y dirección</div><p>${esc(CFG.STUDIO)} · ${esc(CFG.PUBLISHER)}</p><div class="sec-t">Ciencia</div><p>Datos públicos de química y física nuclear (IUPAC, energías de enlace nuclear de referencia, fórmula semiempírica de Weizsäcker). Lo marcado como híbrido o isla de estabilidad es ficción casi real.</p><div class="sec-t">Tipografías</div><p>TeX Gyre Heros Condensed (GUST e-foundry, licencia GUST) · Inter (Rasmus Andersson, SIL OFL 1.1).</p><div class="sec-t">Apoyo</div><p>El juego es gratis. La única forma de pagar es la donación voluntaria o la versión PRO sin anuncios.</p><div class="row"><button class="btn pri" data-act="donate">☕ Donar 1 USD</button><button class="btn gh" data-act="close">Cerrar</button></div>`);
}
function settings() {
  const tg = (k, t) => `<button class="btn ${S.set[k] ? 'pri' : 'gh'}" data-act="set" data-arg="${k}">${t}: ${S.set[k] ? 'Sí' : 'No'}</button>`;
  modal(`<div class="pag">Ajustes · tu partida es tuya</div><h2 class="mega">Ajustes</h2><div class="row">${tg('snd', '♪ Sonido')}${tg('vib', '≋ Vibración')}${tg('sandbox', '⚛ Sandbox')}</div><p class="m">Sandbox: todos los elementos comunes en la bandeja para experimentar libremente.</p><div class="sec-t">Partida</div><div class="row"><button class="btn" data-act="export">⇩ Exportar</button><label class="btn">⇧ Importar<input type="file" accept=".json,application/json" id="impF" hidden></label><button class="btn gh" data-act="reset" style="border-color:var(--mag)">Borrar partida</button></div><p class="m">Edición: ${CFG.EDITION === 'pro' ? 'PRO (sin anuncios)' : 'Gratis con anuncios · PRO sin anuncios por 3 USD en tiendas'}.</p>`);
  $('#impF').addEventListener('change', e => { const f = e.target.files[0]; if (!f) return; const rd = new FileReader(); rd.onload = () => { try { const o = D.sanitize(JSON.parse(rd.result)); if (!o.intro && !Object.keys(o.prog).length) throw 0; S = o; save(true); closeModal(); hud(); renderTray(); setTab(TAB); toast('Partida importada', 'ok'); } catch (x) { toast('Archivo inválido', 'bad'); } }; rd.readAsText(f); });
}
function exportSave() { try { const b = new Blob([JSON.stringify(S)], { type: 'application/json' }), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'doc-element-partida.json'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); } catch (e) { toast('No se pudo exportar', 'bad'); } }
function openLink(u, label) { if (u) { try { window.open(u, '_blank', 'noopener'); } catch (e) { } } else toast(label + ': próximamente en la Página Oficial'); }
function diag() {
  modal('<div class="pag">Diagnóstico</div><h2 class="mega">Bot de pruebas</h2><p id="dg">Validando datos y jugando partidas simuladas…</p>');
  setTimeout(() => { const t0 = performance.now(), a = DE.test.selfTest(), b = DE.test.monkey(20, 7); const el = $('#dg'); if (!el) return; el.innerHTML = `<div class="film">Validación: ${a.errors.length ? '<span class="bad">' + a.errors.length + ' errores</span>' : '<span class="ok">0 errores</span>'} · ${a.warnings.length} avisos<br>${a.stats}<br>Partidas simuladas: ${b.games} · acciones ${b.actions} · <span class="${b.errors.length ? 'bad' : 'ok'}">${b.errors.length} errores</span><br>Tiempo: ${Math.round(performance.now() - t0)} ms</div>` + [...a.errors, ...b.errors].slice(0, 12).map(x => '<p class="bad">' + esc(x) + '</p>').join(''); }, 30);
}

/* ============================================================
   ACCIONES (delegación de clics)
   ============================================================ */
const two = s => s.split(',').map(Number);
const ACT = {
  close: () => closeModal(), noop() { },
  tab: t => setTab(t), mode: m => setMode(m),
  spawn: s => spawn(s), mono: id => spawnMono(id), synth: () => synth(), autoH: () => autoH(), undo: () => undo(), del: () => delSel(), clear: () => { clearLab(); toast('Laboratorio limpio'); },
  zin: () => zoom(1.2), zout: () => zoom(1 / 1.2), fit: () => fit(),
  nuc: k => addNuc(k), unslot: i => { Forge.slots[+i] = null; renderForge(); }, flux: d => { Forge.flux = D.clamp(Forge.flux + (+d), 0, 40); renderForge(); }, fuse: () => fuse(), fclear: () => { Forge.slots = [null, null, null]; Forge.flux = 0; renderForge(); },
  lvl: L => { L = +L; if (L > S.unl) return toast('🔒 Completa el nivel ' + (L - 1)); closeModal(); S.cur = L; giftLevel(L); save(); hud(); setTab('bt'); },
  open: a => { const [L, i] = two(a); closeModal(); openProblem(L, i); }, go: a => { const [L, i] = two(a); startProblem(L, i); },
  pick: (id, el) => pick(id, el), fight: a => { const [L, i] = two(a); startBattle(L, i); }, throw: k => throwCard(+k), flee: () => flee(),
  abandon: () => { if (MIS) failMission('Abandonaste la misión.'); },
  tomap: () => { closeModal(); setTab('bt'); },
  det: id => detail(id), filt: f => { FF = f; renderFr(); }, txl: L => txLevel(+L),
  menu: () => menu(), guide: () => guide(), credits: () => credits(), settings: () => settings(), diag: () => diag(),
  set: k => { S.set[k] = S.set[k] ? 0 : 1; save(); settings(); if (k === 'sandbox') renderTray(); },
  export: () => exportSave(), reset: () => { if (confirm('¿Borrar toda tu partida? No se puede deshacer.')) { S = D.newState(); save(true); location.reload(); } },
  donate: () => openLink(CFG.DONATE_URL, 'Donaciones'), channel: () => openLink(CFG.CHANNEL_URL, 'Videos'),
  tocover: () => { closeModal(); cover(); },
  cont: () => enterGame(),
  newgame: () => { if ((S.intro || Object.keys(S.prog).length) && !confirm('¿Empezar de cero? Se borrará tu partida actual.')) return; S = D.newState(); save(true); clearLab(true); Forge.log = []; enterGame(); },
  snext: () => { if (SI < SLIDES.length - 1) { SI++; slide(); } else endSlides(); }, sskip: () => endSlides(),
  ending: () => { closeModal(); S.end = 1; save(); slides(STORY.ending, () => credits()); }
};
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) { if (e.target.id === 'ov' && modalClose) closeModal(); return; }
  const f = ACT[b.dataset.act]; if (f) f(b.dataset.arg, b, e);
});
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  if (e.key === 'Escape') { if (!$('#ov').hidden && modalClose) closeModal(); return; }
  if (TAB !== 'lab' || Lab.mode !== 'mol' || !$('#ov').hidden || BT) return;
  if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); delSel(); }
  else if (e.key === 'Enter') synth();
  else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); }
  else if (e.key.toLowerCase() === 'h' && !e.ctrlKey) { const s = D.labElements(S); if (s.includes('H')) spawn('H'); }
});

/* ---------- bucle principal ---------- */
let last = 0, regen = 0;
function tick(dt) {
  if (MIS) { MIS.t -= dt; updMbar(); if (MIS.t <= 0) failMission('Se acabó el tiempo.'); }
  if (BT) { BAT.step(BT.b, dt); battleUI(); }
  regen += dt; if (regen >= 2) { regen = 0; if (S.en < 100) { S.en++; hud(); } }
}
function frame(t) {
  const dt = Math.min(.1, (t - (last || t)) / 1000); last = t;
  if (!TEST) tick(dt);
  if (Lab.dirty && TAB === 'lab' && Lab.mode === 'mol') { Lab.dirty = false; draw(); analysis(); coach(); }
  requestAnimationFrame(frame);
}

/* ---------- arranque ---------- */
function boot() {
  load(); giftLevel(1);
  document.body.innerHTML = `<div id="app"><aside class="rail" id="railL"></aside><main id="main">
  <header id="hud"><div class="brand">Doc<b>Element</b></div><div class="hstats"><span class="chip" id="hLv"></span><span class="chip en" id="hEn"></span><span class="chip" id="hSc"></span></div><button id="bMenu" data-act="menu" aria-label="Menú">☰</button></header>
  <div id="mbar" hidden style="position:relative"><span class="mt"></span><span class="tm"></span><button data-act="abandon">Abandonar</button><i class="bar"></i></div>
  <nav id="tabs"><button data-act="tab" data-arg="lab">Laboratorio</button><button data-act="tab" data-arg="fr">Frascos</button><button data-act="tab" data-arg="bt">Batalla</button><button data-act="tab" data-arg="tx">Transmisión</button></nav>
  <section id="view">
   <div class="tab" id="t-lab"><div class="lmode"><button data-act="mode" data-arg="mol" class="on">⚛ Moléculas</button><button data-act="mode" data-arg="forge">☢ Forja nuclear</button></div>
    <div class="pane" id="molPane"><div id="cvWrap"><canvas id="cv"></canvas><div id="coach"></div><div class="cvb"><button data-act="zin" aria-label="Acercar">＋</button><button data-act="zout" aria-label="Alejar">－</button><button data-act="fit" aria-label="Centrar">⌖</button></div></div>
     <div id="ana"></div><div class="tools"><button data-act="undo" aria-label="Deshacer">⟲</button><button data-act="del" aria-label="Borrar átomo">⌫</button><button data-act="clear" aria-label="Limpiar">✕</button><button data-act="autoH" aria-label="Completar hidrógenos">⚡H</button><button class="syn" data-act="synth">⚗ Sintetizar</button></div><div id="tray"></div></div>
    <div class="pane" id="forgePane" hidden></div></div>
   <div class="tab" id="t-fr"><div class="filt">${[['all', 'Todos'], ['el', 'Elementos'], ['mol', 'Compuestos'], ['poly', 'Polímeros'], ['hyb', 'Híbridos'], ['tab', 'Tabla periódica']].map(([k, t]) => `<button data-act="filt" data-arg="${k}">${t}</button>`).join('')}</div><div class="scroll" id="frBody"></div></div>
   <div class="tab" id="t-bt"><div class="lvls" id="lvls"></div><div class="scroll" id="mapBody"></div></div>
   <div class="tab" id="t-tx"><div class="scroll" id="txBody"></div></div>
  </section><div id="adMobile"></div></main><aside class="rail" id="railR"></aside></div>
  <div class="ov" id="ov" hidden></div><div id="battle" hidden></div><div id="toast" aria-live="polite"></div>`;
  ADS.rails(); bindCanvas(); window.addEventListener('resize', resize);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(redraw);
  setInterval(() => ADS.rails(), 60000);
  hud(); setTab('lab'); renderTray(); cover(); requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(true); });
}
DE.ui = { Lab, Forge, spawn, spawnMono, tapAtom, tapBond, synth, autoH, clearLab, buildSmiles, addNuc, fuse, startProblem, startBattle, throwCard, openProblem, setTab, setMode, closeModal, renderMap, renderFr, detail, txLevel, menu, guide, credits, settings, endBattle,
  tick, delSel, undo, flee, failMission, render: () => { draw(); analysis(); coach(); }, quiet: v => { QUIET = !!v; }, ADS, state: () => S, setState: s => { S = D.sanitize(s); hud(); renderTray(); }, MIS: () => MIS, BT: () => BT, enterGame, identify, toGraph, KEY, TEST };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
