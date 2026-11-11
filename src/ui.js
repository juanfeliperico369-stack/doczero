/* ============================================================
   DOC ELEMENT · UI (horizontal primero)
   Laboratorio guiado · Reactor · Forja · Destilación · Frascos · Batalla · Personajes
   ============================================================ */
'use strict';
(function () {
const D = DE, { DB, NUC, BAT, REACT, SORT, esc, fHTML } = D;
const Q = new URLSearchParams(location.search);
const TEST = Q.has('test'), FAST = TEST || Q.has('fast');
const KEY = TEST ? 'docelement.test' : CFG.SAVE_KEY, MAXE = CFG.MAX_ENERGY;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
let S = D.newState(), QUIET = false;
const dOf = L => DIFF[(L || S.cur) - 1] || DIFF[0];
const curL = () => MIS ? MIS.L : S.cur;
const COMMON = ['H', 'Li', 'C', 'N', 'O', 'F', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ca', 'Fe', 'Cu'];
let CH = null;
const labEls = () => CH ? COMMON : D.labElements(S);
const fmtT = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0') + '.' + Math.floor((s * 10) % 10);
const PT0 = {};

/* ---------- guardado ---------- */
function load() { try { const raw = localStorage.getItem(KEY); S = D.sanitize(raw ? JSON.parse(raw) : null); } catch (e) { S = D.newState(); } S.seen = S.seen || {}; }
let saveT = 0;
function save(now) { if (QUIET) return; clearTimeout(saveT); const f = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }; if (now) f(); else saveT = setTimeout(f, 300); }

/* ---------- sonido sintetizado ---------- */
let AC = null;
const SFX = { tap: [[660], .05, 'square', .03], bond: [[880], .08, 'triangle', .05], ok: [[523, 659, 784], .1, 'triangle', .06], bad: [[220, 160], .16, 'sawtooth', .04], boom: [[110, 60], .3, 'sawtooth', .08], hit: [[440, 880], .07, 'square', .04], crit: [[880, 1320, 1760], .06, 'square', .05], heal: [[300, 200], .12, 'sine', .05], fuse: [[200, 400, 800], .13, 'sine', .07], pour: [[520, 620], .06, 'sine', .05], win: [[523, 659, 784, 1046], .13, 'triangle', .07], lose: [[392, 330, 262], .18, 'triangle', .06] };
function sfx(k) {
  if (!S.set.snd || TEST || QUIET) return;
  try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); const P = SFX[k]; if (!P) return; let t = AC.currentTime;
    if (k === 'boom' || k === 'fuse') { const n = AC.sampleRate * .45 | 0, bf = AC.createBuffer(1, n, AC.sampleRate), d = bf.getChannelData(0); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, k === 'boom' ? 2 : 4); const sn = AC.createBufferSource(), fl = AC.createBiquadFilter(), gn = AC.createGain(); fl.type = 'lowpass'; fl.frequency.setValueAtTime(k === 'boom' ? 1400 : 3000, t); fl.frequency.exponentialRampToValueAtTime(120, t + .4); gn.gain.value = k === 'boom' ? .28 : .1; sn.buffer = bf; sn.connect(fl).connect(gn).connect(AC.destination); sn.start(t); }
    P[0].forEach(f => { const o = AC.createOscillator(), g = AC.createGain(); o.type = P[2]; o.frequency.value = f; g.gain.setValueAtTime(P[3], t); g.gain.exponentialRampToValueAtTime(.0001, t + P[1]); o.connect(g).connect(AC.destination); o.start(t); o.stop(t + P[1] + .02); t += P[1] * .8; });
  } catch (e) { }
}
/* ---------- música procedimental (sin archivos): cambia con el modo de juego ---------- */
const MUS = { ctx: null, g: null, lp: null, mode: 'menu', timer: 0, step: 0, next: 0,
  M: { lab: { bpm: 84, root: 57, sc: [0, 3, 5, 7, 10], pad: [0, 7, 12] }, battle: { bpm: 132, root: 52, sc: [0, 1, 5, 7, 8], pad: [0, 7], bass: 1 }, sort: { bpm: 96, root: 60, sc: [0, 2, 4, 7, 9], pad: [0, 4, 7] }, menu: { bpm: 70, root: 55, sc: [0, 3, 7, 10, 14], pad: [0, 7, 15] } },
  start() { if (MUS.ctx || !S.set.mus || TEST || QUIET) return; try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); MUS.ctx = AC; MUS.g = AC.createGain(); MUS.g.gain.value = .045; MUS.g.connect(AC.destination); MUS.lp = AC.createBiquadFilter(); MUS.lp.type = 'lowpass'; MUS.lp.frequency.value = 800; MUS.lp.connect(MUS.g); MUS.next = AC.currentTime + .1; MUS.timer = setInterval(MUS.sched, 100); } catch (e) { } },
  stop() { clearInterval(MUS.timer); MUS.timer = 0; try { MUS.g && MUS.g.disconnect(); } catch (e) { } MUS.ctx = MUS.g = MUS.lp = null; },
  note(f, t, d, type, vol, dest) { const o = MUS.ctx.createOscillator(), g = MUS.ctx.createGain(); o.type = type; o.frequency.value = f; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + Math.min(.08, d / 4)); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(dest || MUS.g); o.start(t); o.stop(t + d + .05); },
  sched() { const c = MUS.ctx; if (!c) return; const m = MUS.M[MUS.mode] || MUS.M.lab, sp = 60 / m.bpm / 2, hz = n => 440 * Math.pow(2, (n - 69) / 12);
    while (MUS.next < c.currentTime + .35) { const t = MUS.next, s = MUS.step++;
      if (s % 16 === 0) m.pad.forEach(p => MUS.note(hz(m.root - 12 + p), t, sp * 15, 'sawtooth', .22, MUS.lp));
      const r = Math.sin(s * 12.9898 + m.root) * 43758.5453, pick = Math.floor((r - Math.floor(r)) * m.sc.length);
      if (s % 2 === 0 || m.bass) MUS.note(hz(m.root + 12 + m.sc[pick] + (s % 32 > 15 ? 12 : 0)), t, sp * 1.6, 'triangle', .3);
      if (m.bass && s % 4 === 0) MUS.note(hz(m.root - 24), t, sp * 1.8, 'sine', .9);
      MUS.next += sp; } }
};
function vib(ms) { if (S.set.vib && !TEST && !QUIET && navigator.vibrate) try { navigator.vibrate(ms); } catch (e) { } }

/* ---------- toast / efectos / modal ---------- */
function toast(msg, cls) { if (QUIET) return; const t = $('#toast'), d = document.createElement('div'); if (cls) d.className = cls; d.innerHTML = msg; t.appendChild(d); while (t.children.length > 3) t.firstChild.remove(); setTimeout(() => d.remove(), FAST ? 400 : 2600); }
function boom(x, y) { if (QUIET) return; const b = document.createElement('div'); b.className = 'boom'; b.style.left = x + 'px'; b.style.top = y + 'px'; document.body.appendChild(b); setTimeout(() => b.remove(), 650); }
function shake(el) { if (QUIET) return; el = el || $('#app'); if (!el) return; el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }
const tagChips = (t, max) => Object.keys(t).slice(0, max || 9).map(k => `<i title="${TAGS[k][0]}">${TAGS[k][1]} ${TAGS[k][0]}${t[k] > 1 ? ' ' + '•'.repeat(t[k]) : ''}</i>`).join('');
const tagWords = t => Object.keys(t).map(k => TAGS[k][1] + ' ' + TAGS[k][0]).join(' · ');
const spaced = s => esc(s);
let modalClose = true;
function modal(html, close = true) { const ov = $('#ov'); modalClose = close; ov.innerHTML = '<div class="sheet" role="dialog" aria-modal="true">' + (close ? '<button class="x" data-act="close" aria-label="Cerrar">✕</button>' : '') + html + '</div>'; ov.hidden = false; return ov.firstChild; }
function closeModal() { const ov = $('#ov'); ov.hidden = true; ov.innerHTML = ''; }

/* ---------- anuncios: APAGADOS (CFG.ADS=false). Adaptador listo para parchar al final ---------- */
const ADS = { on: () => CFG.ADS && CFG.EDITION !== 'pro', inter(cb) { cb(); } };

/* ---------- personajes y comunicaciones ---------- */
const rankN = () => { const s = D.totalStars(S); return s >= 420 ? 4 : s >= 240 ? 3 : s >= 140 ? 2 : s >= 30 ? 1 : 0; };
const SEASON = L => L > 30 ? ['4', 'Organismos'] : L > 20 ? ['3', 'Genes'] : L > 10 ? ['2', 'Fármacos'] : ['1', 'Núcleo'];
let TQ = [], TCB = null;
function showLine(l) {
  const [who, mood, text] = l, el = $('#comms'); if (!el) return;
  $('#cPor').innerHTML = who === 'doc' ? D.CH.doc(mood, rankN()) : D.CH.eter(mood);
  $('#cWho').textContent = who === 'doc' ? 'DOC' : 'ÉTER';
  $('#cTxt').textContent = text; el.className = 'who-' + who;
  $('#cNext').hidden = !TQ.length && !TCB; $('#cNext').textContent = TQ.length ? '▸ ' + TQ.length : '▸';
  el.classList.remove('say'); void el.offsetWidth; el.classList.add('say');
}
function talk(lines, cb) { TQ = lines.slice(); TCB = cb || null; nextLine(); }
function nextLine() { const l = TQ.shift(); if (!l) { const f = TCB; TCB = null; $('#cNext') && ($('#cNext').hidden = true); f && f(); return; } showLine(l); }
function say(key) { const a = DIALOG[key]; if (a && !TQ.length) showLine(a[Math.random() * a.length | 0]); }

/* ---------- HUD y navegación ---------- */
function hud() {
  $('#hLv').innerHTML = 'Nivel <b>' + S.cur + '</b>';
  $('#hEn').innerHTML = '⚡<b>' + Math.round(S.en) + '</b>';
  $('#hSc').innerHTML = '★<b>' + D.totalStars(S) + '</b>';
  $('#hRk').textContent = D.rankOf(S);
}
let TAB = 'nave', NEWFR = false;
function setTab(t) {
  if (!['nave', 'lab', 'fr', 'bt', 'tx'].includes(t)) t = 'nave';
  TAB = t; document.body.classList.toggle('hub', t === 'nave'); document.body.classList.toggle('noside', t === 'fr' || t === 'tx');
  const com = $('#comms'), hc = $('#hubCom'); if (com && hc) { if (t === 'nave') { if (com.parentNode !== hc) hc.appendChild(com); } else if (com.parentNode !== $('#side')) $('#side').prepend(com); }
  if (t === 'nave') renderHub();
  $$('.tab').forEach(x => x.classList.toggle('on', x.id === 't-' + t));
  if (t === 'fr') { renderFr(); NEWFR = false; }
  if (t === 'bt') renderMap();
  if (t === 'tx') renderTx();
  if (t === 'lab') requestAnimationFrame(resize);
  roomBar(); renderSide();
}
function dotFr() { if (TAB !== 'fr') NEWFR = true; }

/* ============================================================
   LABORATORIO MOLECULAR (canvas) con plano guía
   ============================================================ */
const Lab = { atoms: [], bonds: [], sel: null, uid: 1, view: { x: 0, y: 0, z: 1 }, hist: [], mode: 'mol', dirty: true, ghost: null, hover: null };
const A = id => Lab.atoms.find(a => a.id === id);
const bsum = id => Lab.bonds.reduce((s, b) => s + (b.a === id || b.b === id ? b.o : 0), 0);
const deg = id => Lab.bonds.reduce((s, b) => s + (b.a === id || b.b === id ? 1 : 0), 0);
const cap = a => a.mono ? 2 - deg(a.id) : D.maxVal(a.el) - bsum(a.id);
const need = a => { if (a.mono) return 0; const f = D.freeOf(a.el, bsum(a.id)); return f < 0 ? 0 : f; };
const bondOf = (x, y) => Lab.bonds.find(b => (b.a === x && b.b === y) || (b.a === y && b.b === x));
const nbrs = id => Lab.bonds.filter(b => b.a === id || b.b === id).map(b => A(b.a === id ? b.b : b.a)).filter(Boolean);
function snap() { Lab.hist.push(JSON.stringify([Lab.atoms, Lab.bonds, Lab.uid])); if (Lab.hist.length > 40) Lab.hist.shift(); }
function undo() { const s = Lab.hist.pop(); if (!s) return toast('Nada que deshacer'); [Lab.atoms, Lab.bonds, Lab.uid] = JSON.parse(s); Lab.sel = null; syncGhost(); redraw(); }
function redraw() { Lab.dirty = true; }
function syncGhost() { const g = Lab.ghost; if (!g) return; g.atoms.forEach(s => s.f = null); Lab.atoms.forEach(a => { if (a.slot != null && g.atoms[a.slot]) g.atoms[a.slot].f = a.id; }); }
let CW = 300, CHh = 300, DPR = 1, ctx = null;
function resize() {
  const cv = $('#cv'); if (!cv) return; const r = cv.parentElement.getBoundingClientRect();
  if (r.width < 2) return; DPR = Math.min(2, window.devicePixelRatio || 1); CW = r.width; CHh = r.height;
  cv.width = Math.round(CW * DPR); cv.height = Math.round(CHh * DPR); ctx = cv.getContext('2d'); redraw();
}
const w2s = (x, y) => [(x - Lab.view.x) * Lab.view.z + CW / 2, (y - Lab.view.y) * Lab.view.z + CHh / 2];
const s2w = (x, y) => [(x - CW / 2) / Lab.view.z + Lab.view.x, (y - CHh / 2) / Lab.view.z + Lab.view.y];
const rad = a => a.mono ? 0 : a.el === 'H' ? 13 : 19;
const colOf = el => { const z = D.SYM[el]; return z ? D.CAT[D.catOf(z)][1] : '#fff'; };
function freeSpot() {
  const cx = Lab.view.x, cy = Lab.view.y;
  for (let r = 0; r < 14; r++) for (let k = 0, n = Math.max(1, r * 6); k < n; k++) {
    const g = k / n * Math.PI * 2, x = cx + Math.cos(g) * r * 72, y = cy + Math.sin(g) * r * 72;
    if (!Lab.atoms.some(a => Math.hypot(a.x - x, a.y - y) < (a.mono ? 80 : 58)) && !(Lab.ghost && Lab.ghost.atoms.some(s => !s.f && Math.hypot(s.x - x, s.y - y) < 40))) return { x, y };
  }
  return { x: cx, y: cy };
}
function nearSpot(p, L, skip) {
  const nb = nbrs(p.id).filter(n => n.id !== skip); let best = { x: p.x + L, y: p.y }, bs = -1e9;
  for (let k = 0; k < 16; k++) {
    const g = k / 16 * Math.PI * 2 - Math.PI / 2, x = p.x + Math.cos(g) * L, y = p.y + Math.sin(g) * L; let sc = 0;
    for (const n of nb) { let d = Math.abs(Math.atan2(n.y - p.y, n.x - p.x) - g) % (Math.PI * 2); if (d > Math.PI) d = Math.PI * 2 - d; sc -= Math.max(0, 1.3 - d) * 12; }
    for (const o of Lab.atoms) { if (o.id === skip) continue; const dd = Math.hypot(o.x - x, o.y - y); if (dd < 52) sc -= 52 - dd; }
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
/* ranura del plano para un elemento: junto a la selección, junto a algo colocado, o la primera */
function ghostSlot(el) {
  const g = Lab.ghost; if (!g) return -1;
  const free = g.atoms.map((s, i) => !s.f && s.el === el ? i : -1).filter(i => i >= 0); if (!free.length) return -1;
  const filled = new Set(g.atoms.map((s, i) => s.f ? i : -1).filter(i => i >= 0));
  const adj = i => g.bonds.filter(b => b.a === i || b.b === i).map(b => b.a === i ? b.b : b.a);
  const selSlot = Lab.sel != null && A(Lab.sel) ? A(Lab.sel).slot : null;
  if (selSlot != null) { const c = free.find(i => adj(i).includes(selSlot)); if (c != null) return c; }
  const c = free.find(i => adj(i).some(j => filled.has(j))); if (c != null) return c;
  if (!filled.size) { const heavy = free.slice().sort((a, b) => adj(b).length - adj(a).length); return heavy[0]; }
  return -1;
}
function fillSlot(a, i) {
  const g = Lab.ghost; a.slot = i; g.atoms[i].f = a.id; a.x = g.atoms[i].x; a.y = g.atoms[i].y;
  g.bonds.forEach(b => { if (b.a !== i && b.b !== i) return; const j = b.a === i ? b.b : b.a, o = g.atoms[j].f; if (o && !bondOf(a.id, o) && cap(a) > 0 && cap(A(o)) > 0) Lab.bonds.push({ a: o, b: a.id, o: 1 }); });
}
function spawn(el) {
  if (Lab.atoms.length >= 90) return toast('Mesa llena: sintetiza o limpia el laboratorio', 'bad');
  snap(); const s = Lab.sel != null ? A(Lab.sel) : null, na = { id: Lab.uid++, el, x: 0, y: 0 };
  const gi = ghostSlot(el);
  if (gi >= 0) { Lab.atoms.push(na); fillSlot(na, gi); sfx('bond'); pickNext(na, s && bondOf(s.id, na.id) ? s : null); }
  else if (s && !s.mono && cap(s) > 0 && D.maxVal(el) > 0) { Object.assign(na, nearSpot(s, el === 'H' || s.el === 'H' ? 46 : 64)); Lab.atoms.push(na); Lab.bonds.push({ a: s.id, b: na.id, o: 1 }); sfx('bond'); pickNext(na, s); }
  else { Object.assign(na, freeSpot()); Lab.atoms.push(na); Lab.sel = D.maxVal(el) > 0 ? na.id : null; sfx('tap'); }
  vib(6); redraw(); return na.id;
}
function spawnMono(id) {
  snap(); const s = Lab.sel != null ? A(Lab.sel) : null, na = { id: Lab.uid++, el: id, mono: id, x: 0, y: 0 };
  if (s && s.mono && cap(s) > 0) { Object.assign(na, nearSpot(s, 96)); Lab.atoms.push(na); Lab.bonds.push({ a: s.id, b: na.id, o: 1 }); sfx('bond'); Lab.sel = na.id; }
  else { Object.assign(na, freeSpot()); Lab.atoms.push(na); Lab.sel = na.id; sfx('tap'); }
  redraw(); return na.id;
}
/* une dos átomos si las reglas lo permiten; devuelve '' o el motivo */
function link(s, a) {
  if (!!s.mono !== !!a.mono) return 'Los monómeros solo se unen con monómeros';
  if (bondOf(s.id, a.id)) return 'ya';
  if (cap(s) < 1 || cap(a) < 1) { const f = cap(s) < 1 ? s : a; return f.mono ? 'Cada monómero se une como máximo a dos vecinos' : f.el + ' no tiene manos libres (valencia ' + D.valence(f.el).join(' o ') + ')'; }
  snap(); Lab.bonds.push({ a: s.id, b: a.id, o: 1 }); sfx('bond'); vib(8); return '';
}
function tapAtom(id) {
  const a = A(id); if (!a) return;
  if (Lab.sel == null || Lab.sel === id || !A(Lab.sel)) { Lab.sel = Lab.sel === id ? null : id; sfx('tap'); redraw(); return; }
  const s = A(Lab.sel), why = link(s, a);
  if (why === 'ya') { Lab.sel = id; sfx('tap'); }
  else if (why) { toast(esc(why)); Lab.sel = id; }
  else if (a.mono) Lab.sel = a.id; else pickNext(a, s);
  redraw();
}
function tapBond(b) {
  snap(); const x = A(b.a), y = A(b.b);
  if (x.mono || b.o >= 3 || cap(x) < 1 || cap(y) < 1) { Lab.bonds.splice(Lab.bonds.indexOf(b), 1); sfx('bad'); toast('Enlace borrado'); }
  else { b.o++; sfx('bond'); vib(8); toast(b.o === 2 ? 'Enlace DOBLE: cada átomo usa 2 manos' : 'Enlace TRIPLE: 3 manos cada uno'); }
  redraw();
}
function dropAtom(id) { // al soltar un átomo arrastrado: se une al que tenga debajo o encaja en su plano
  const a = A(id); if (!a) return; const t = Lab.atoms.find(o => o.id !== id && (o.mono ? Math.abs(o.x - a.x) < 50 && Math.abs(o.y - a.y) < 26 : Math.hypot(o.x - a.x, o.y - a.y) < 34));
  Lab.hover = null;
  if (t) {
    const why = link(t, a); if (why && why !== 'ya') toast(esc(why), 'bad');
    Object.assign(a, nearSpot(t, a.mono ? 96 : (a.el === 'H' || t.el === 'H') ? 46 : 64, a.id));
    if (!why) pickNext(a, t); redraw(); return;
  }
  const g = Lab.ghost;
  if (g && a.slot == null) { const i = g.atoms.findIndex(s => !s.f && s.el === a.el && Math.hypot(s.x - a.x, s.y - a.y) < 30); if (i >= 0) { fillSlot(a, i); sfx('bond'); } }
  redraw();
}
function delSel() {
  if (Lab.sel == null) return toast('Selecciona un átomo para borrarlo');
  snap(); const id = Lab.sel, nb = nbrs(id)[0];
  Lab.atoms = Lab.atoms.filter(a => a.id !== id); Lab.bonds = Lab.bonds.filter(b => b.a !== id && b.b !== id);
  Lab.sel = nb ? nb.id : null; syncGhost(); sfx('tap'); redraw();
}
function clearLab(silent) { if (!Lab.atoms.length) return; if (!silent) snap(); Lab.atoms = []; Lab.bonds = []; Lab.sel = null; syncGhost(); redraw(); }
const AUTOH = new Set(['B', 'C', 'N', 'O', 'Si', 'P', 'S', 'F', 'Cl', 'Br', 'I']);
function autoH() {
  const tg = Lab.atoms.filter(a => !a.mono && AUTOH.has(a.el) && need(a) > 0);
  if (!tg.length) return toast('No hay manos libres que llenar con hidrógeno');
  if (!labEls().includes('H')) return toast('Aún no tienes hidrógeno', 'bad');
  const c = MIS && MIS.ch ? 0 : dOf(curL()).ah; if (c && S.en < c) return toast('⚡H cuesta ⚡' + c + ' en este nivel', 'bad');
  snap(); let n = 0; S.en -= c;
  tg.forEach(a => { for (let k = need(a); k > 0; k--) { const h = { id: Lab.uid++, el: 'H', ...nearSpot(a, 46) }; Lab.atoms.push(h); Lab.bonds.push({ a: a.id, b: h.id, o: 1 }); n++; } });
  Lab.sel = null; sfx('bond'); toast('⚡H: ' + n + ' hidrógenos' + (c ? ' · −⚡' + c : '')); hud(); redraw();
}
function toGraph(list) {
  const atoms = list || Lab.atoms, ix = new Map(atoms.map((a, i) => [a.id, i]));
  return { atoms: atoms.map(a => ({ el: a.el, mono: a.mono })), bonds: Lab.bonds.filter(b => ix.has(b.a) && ix.has(b.b)).map(b => ({ a: ix.get(b.a), b: ix.get(b.b), o: b.o })) };
}
function identify(sg) {
  const n = sg.atoms.length;
  if (sg.atoms.every(a => a.mono)) {
    const dg = sg.atoms.map(() => 0); sg.bonds.forEach(b => { dg[b.a]++; dg[b.b]++; });
    if (n < 3) return { ok: false, msg: 'Cadena muy corta: une al menos 3 monómeros.' };
    if (sg.bonds.length !== n - 1 || dg.some(d => d > 2)) return { ok: false, msg: 'Un polímero lineal es una cadena sin ramas ni anillos.' };
    const ms = [...new Set(sg.atoms.map(a => a.mono))].sort(), mk = ms.join('+'), pid = DB.polyByKey[mk];
    if (pid) return { ok: true, kind: 'poly', id: pid, n };
    const id = 'XP' + D.djb(mk), tags = {};
    ms.forEach(m => { const p = Object.values(DB.poly).find(q => q.mk === m); const t = p ? p.tags : { seal: 2 }; for (const k in t) tags[k] = Math.min(3, Math.max(tags[k] || 0, t[k])); });
    return { ok: true, kind: 'hyb', id, n, def: { id, key: 'P:' + mk, f: '(' + ms.map(m => DB.comp[m].f).join('/') + ')n', name: 'Copolímero experimental ' + 'ΑΒΓΔΕΖΗΘ'[parseInt(D.djb(mk), 36) % 8] + '-' + ms.length, tags, hyb: 1, poly: 1, groups: ['copolímero'], desc: 'Cadena teórica que alterna ' + ms.map(m => DB.comp[m].name).join(', ') + '. Sus propiedades combinan las de cada homopolímero.' } };
  }
  if (n === 1) {
    const el = sg.atoms[0].el, z = D.SYM[el], c = D.catOf(z);
    if (D.maxVal(el) === 0 || ['alk', 'alkt', 'tran', 'post', 'lan', 'act', 'metd'].includes(c)) return { ok: true, kind: 'el', id: 'el:' + el };
    return { ok: false, msg: 'Un ' + D.elem(z).name + ' solo es un radical: le sobran ' + D.maxVal(el) + ' mano(s). Únelo a algo.' };
  }
  const sums = D.bondSums(sg), bad = sg.atoms.map((a, i) => D.valence(a.el).includes(sums[i]) ? null : a.el).filter(Boolean);
  if (bad.length) return { ok: false, msg: 'Inestable: ' + bad.length + ' átomo(s) con manos libres (' + [...new Set(bad)].join(', ') + '). Mira los puntos rosados.' };
  const key = D.molKey(sg), id = DB.byKey[key];
  if (id) return { ok: true, kind: 'mol', id };
  const def = D.makeHybrid(sg); return { ok: true, kind: 'hyb', id: def.id, def };
}
function layoutOf(list) {
  const cx = list.reduce((s, a) => s + a.x, 0) / list.length, cy = list.reduce((s, a) => s + a.y, 0) / list.length, ix = new Map(list.map((a, i) => [a.id, i]));
  return { a: list.map(a => [a.mono ? '*' + a.mono : a.el, Math.round(a.x - cx), Math.round(a.y - cy)]), b: Lab.bonds.filter(b => ix.has(b.a) && ix.has(b.b)).map(b => [ix.get(b.a), ix.get(b.b), b.o]) };
}
function store(id, k, lay) { const first = !S.fr[id]; const e = S.fr[id] || (S.fr[id] = { c: 0, t: Date.now() }); e.c += k || 1; if (!e.lay && lay) e.lay = lay; if (first) dotFr(); return first; }
function synth() {
  if (!Lab.atoms.length) { toast('El laboratorio está vacío: toca un átomo de la bandeja'); return []; }
  const g = toGraph(), comps = D.components(g), made = [], fails = [], gone = new Set();
  for (const c of comps) {
    const sg = D.subgraph(g, c), list = c.map(i => Lab.atoms[i]), r = identify(sg);
    if (!r.ok) { fails.push(r); continue; }
    if (r.kind === 'el') { if (S.el[r.id.slice(3)] !== 1) S.el[r.id.slice(3)] = 1; list.forEach(a => gone.add(a.id)); made.push(r); continue; }
    if (r.kind === 'hyb' && !S.hyb[r.id]) { S.hyb[r.id] = r.def; S.st.hyb++; }
    r.first = store(r.id, 1, list.length <= 70 ? layoutOf(list) : null); made.push(r); list.forEach(a => gone.add(a.id));
  }
  if (made.length) {
    S.st.synth += made.length; const cvr = $('#cv').getBoundingClientRect(), goneA = Lab.atoms.filter(a => gone.has(a.id));
    goneA.slice(0, 3).forEach(a => { const [x, y] = w2s(a.x, a.y); boom(cvr.left + x, cvr.top + y); });
    if (goneA.length) { const cx = goneA.reduce((q, a) => q + a.x, 0) / goneA.length, cy = goneA.reduce((q, a) => q + a.y, 0) / goneA.length, t = performance.now() / 1000; goneA.forEach(a => { Lab.vanish.push({ x: a.x, y: a.y, el: a.el, mono: a.mono, cx, cy, t0: t }); fxBurst(a.x, a.y, [a.mono ? '#2dffb3' : colOf(a.el), '#ffc23a'], 5); }); made.forEach((m, k) => Lab.labels.push({ x: cx, y: cy - 20 - k * 22, text: (m.first ? '¡NUEVO! ' : '') + D.fUni(nameOf(m.id).f), c: m.kind === 'hyb' ? '#ff2fb3' : m.first ? '#ffc23a' : '#2dffb3', t0: t })); }
    Lab.atoms = Lab.atoms.filter(a => !gone.has(a.id)); Lab.bonds = Lab.bonds.filter(b => !gone.has(b.a) && !gone.has(b.b)); Lab.sel = null; Lab.hist = []; syncGhost();
    made.forEach(r => toast((r.first ? '¡NUEVO! ' : '') + (r.kind === 'hyb' ? '⚠ HÍBRIDO · ' : r.kind === 'el' ? 'Elemento puro · ' : '') + nameOf(r.id).html, r.first ? 'ok' : ''));
    if (made.some(r => r.kind === 'hyb' && r.first)) say('hybrid'); else if (!S.st.firstSay) { S.st.firstSay = 1; talk(DIALOG.first); }
    sfx('ok'); vib(20); if (BT) launch(made); else missionCheck(made); save(); renderTray();
  }
  if (fails.length) { fails.forEach(f => toast(esc(f.msg), 'bad')); if (!made.length) { sfx('bad'); shake($('#cvWrap')); S.en = Math.max(0, S.en - 2); Lab.flash = 1; say('unstable'); } }
  redraw(); hud(); return made;
}
function nameOf(id) {
  if (id.startsWith('el:')) { const s = id.slice(3), e = D.elBySym(s) || { name: s === 'Ubh' && S.eternio ? 'Eternio' : s }; return { html: esc(s) + ' · ' + esc(e.name), f: s, name: e.name }; }
  if (id[0] === '@') return nameOf('el:' + id.slice(1));
  if (DB.comp[id]) return { html: fHTML(DB.comp[id].f) + ' · ' + esc(DB.comp[id].name), f: DB.comp[id].f, name: DB.comp[id].name };
  if (DB.poly[id]) { const p = DB.poly[id]; return { html: esc(p.name), f: p.mk, name: p.name }; }
  const h = S.hyb[id]; return h ? { html: fHTML(h.f) + ' · ' + esc(h.name), f: h.f, name: h.name } : { html: esc(id), f: id, name: id };
}
function buildSmiles(smi, ox, oy) {
  const g = D.parseSmiles(smi), P = D.layout2D(g), base = freeSpot(), ids = [];
  ox = ox == null ? base.x : ox; oy = oy == null ? base.y : oy;
  g.atoms.forEach((at, i) => { const a = { id: Lab.uid++, el: at.el, x: ox + P[i][0], y: oy + P[i][1] }; Lab.atoms.push(a); ids.push(a.id); });
  g.bonds.forEach(b => Lab.bonds.push({ a: ids[b.a], b: ids[b.b], o: b.o }));
  redraw(); return ids;
}
const BPC = {};
const bpOf = (id, h) => BPC[id + h] || (BPC[id + h] = D.blueprint(DB.comp[id].smiles[0], h));
/* ---------- guía paso a paso ---------- */
function guideStep() {
  const tid = MIS && MIS.p.k === 'm' ? MIS.p.id : BT && Lab.ghost ? Lab.ghost.id : null; if (!tid) return null;
  const g = Lab.ghost, cnt = D.countOf(toGraph()), tg = DB.comp[tid].cnt;
  if (g) {
    const filled = new Set(g.atoms.map((s, i) => s.f ? i : -1).filter(i => i >= 0));
    if (filled.size < g.atoms.length) {
      const adj = i => g.bonds.filter(b => b.a === i || b.b === i).map(b => b.a === i ? b.b : b.a);
      let i = g.atoms.findIndex((s, k) => !s.f && adj(k).some(j => filled.has(j)));
      if (i < 0) i = g.atoms.map((s, k) => k).filter(k => !g.atoms[k].f).sort((a, b) => adj(b).length - adj(a).length)[0];
      return { k: 'place', el: g.atoms[i].el, slot: i };
    }
    for (const b of g.bonds) { const x = g.atoms[b.a].f, y = g.atoms[b.b].f, lb = bondOf(x, y); if (!lb) return { k: 'link', a: x, b: y }; if (lb.o < b.o) return { k: 'bond', bond: lb, o: b.o }; }
    if (!g.withH && Lab.atoms.some(a => AUTOH.has(a.el) && need(a) > 0)) return { k: 'autoH' };
  } else {
    const miss = Object.keys(tg).filter(e => (cnt[e] || 0) < tg[e]);
    if (miss.length) return { k: 'count', miss: miss.map(e => e + '×' + (tg[e] - (cnt[e] || 0))).join(' ') };
    if (Lab.atoms.some(a => need(a) > 0)) return { k: 'free' };
  }
  return { k: 'synth' };
}
function stepText(st) {
  if (!st) return '';
  const nm = el => '<b class="hl">' + esc(el) + '</b>';
  return { place: () => 'Toca ' + nm(st.el) + ' en la bandeja: irá a la pieza punteada que brilla.', link: () => 'Arrastra un átomo sobre el otro para unirlos.', bond: () => 'Toca el <b class="hl">enlace que parpadea</b>: todavía hay manos libres → enlace ' + (st.o === 2 ? 'DOBLE' : 'TRIPLE') + '.', autoH: () => 'Toca <b class="hl">⚡H</b>: llena las manos libres con hidrógeno.', count: () => 'Te falta: ' + esc(st.miss), free: () => 'Hay manos libres (puntos rosados): únelas o toca un enlace.', synth: () => BT ? '¡Listo! Pulsa <b class="hl">⚗ LANZAR</b> contra la amenaza.' : '¡Completo! Pulsa <b class="hl">⚗ CREAR</b>.' }[st.k]();
}
/* ---------- efectos visuales del laboratorio ---------- */
Lab.fx = []; Lab.vanish = []; Lab.labels = []; Lab.animT = 0;
function fxBurst(x, y, cols, n) { if (QUIET) return; const t = performance.now() / 1000; for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, v = 40 + Math.random() * 140; Lab.fx.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t0: t, life: .45 + Math.random() * .4, c: cols[i % cols.length], r: 1.5 + Math.random() * 2.5 }); } if (Lab.fx.length > 400) Lab.fx.splice(0, Lab.fx.length - 400); Lab.animT = t + 1; }
function drawFx(now, z) {
  Lab.vanish = Lab.vanish.filter(v => now - v.t0 < .38);
  Lab.vanish.forEach(v => { const k = (now - v.t0) / .38, x = v.x + (v.cx - v.x) * k * k, y = v.y + (v.cy - v.y) * k * k, [sx, sy] = w2s(x, y), r = (v.el === 'H' ? 13 : 19) * z * (1 - k); ctx.globalAlpha = 1 - k; ctx.strokeStyle = v.mono ? '#2dffb3' : colOf(v.el); ctx.lineWidth = 3 * z; ctx.beginPath(); ctx.arc(sx, sy, Math.max(1, r), 0, 7); ctx.stroke(); });
  Lab.fx = Lab.fx.filter(p => now - p.t0 < p.life);
  Lab.fx.forEach(p => { const k = (now - p.t0) / p.life, d = now - p.t0, [sx, sy] = w2s(p.x + p.vx * d, p.y + p.vy * d + 60 * d * d); ctx.globalAlpha = 1 - k; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(sx, sy, p.r * z, 0, 7); ctx.fill(); });
  Lab.labels = Lab.labels.filter(l => now - l.t0 < 1.3);
  Lab.labels.forEach(l => { const k = (now - l.t0) / 1.3, [sx, sy] = w2s(l.x, l.y - 50 * k); ctx.globalAlpha = k < .7 ? 1 : 1 - (k - .7) / .3; ctx.fillStyle = l.c; ctx.font = (20 * Math.max(.8, z)) + 'px Titulos,Arial Narrow,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowColor = l.c; ctx.shadowBlur = 10; ctx.fillText(l.text, sx, sy); ctx.shadowBlur = 0; });
  ctx.globalAlpha = 1;
  if (Lab.fx.length || Lab.vanish.length || Lab.labels.length) Lab.animT = now + .1;
}
/* ---------- dibujo ---------- */
function draw() {
  if (!ctx) return; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, CW, CHh);
  const z = Lab.view.z, gs = 32 * z, now = performance.now() / 1000, pulse = .5 + .5 * Math.sin(now * 5);
  if (gs > 10) { ctx.fillStyle = 'rgba(164,44,255,.2)'; const [ox, oy] = w2s(0, 0); for (let x = ((ox % gs) + gs) % gs; x < CW; x += gs) for (let y = ((oy % gs) + gs) % gs; y < CHh; y += gs) ctx.fillRect(x - .75, y - .75, 1.5, 1.5); }
  const st = guideStep(), F = w => (w * z) + 'px Titulos,Arial Narrow,sans-serif';
  if (Lab.ghost) { // plano punteado
    const g = Lab.ghost; ctx.setLineDash([4 * z, 4 * z]); ctx.lineWidth = 1.5 * z;
    g.bonds.forEach(b => { const p = g.atoms[b.a], q = g.atoms[b.b]; if (p.f && q.f) return; const [x1, y1] = w2s(p.x, p.y), [x2, y2] = w2s(q.x, q.y); ctx.strokeStyle = 'rgba(143,179,255,.45)'; const L = Math.hypot(x2 - x1, y2 - y1) || 1, nx = -(y2 - y1) / L, ny = (x2 - x1) / L; (b.o === 1 ? [0] : b.o === 2 ? [-3, 3] : [-5, 0, 5]).forEach(o => { ctx.beginPath(); ctx.moveTo(x1 + nx * o * z, y1 + ny * o * z); ctx.lineTo(x2 + nx * o * z, y2 + ny * o * z); ctx.stroke(); }); });
    g.atoms.forEach((s, i) => { if (s.f) return; const [x, y] = w2s(s.x, s.y), r = (s.el === 'H' ? 13 : 19) * z, hot = st && st.k === 'place' && st.slot === i; ctx.strokeStyle = hot ? `rgba(255,194,58,${.5 + .5 * pulse})` : 'rgba(143,179,255,.5)'; ctx.lineWidth = (hot ? 3 : 1.5) * z; ctx.beginPath(); ctx.arc(x, y, r + (hot ? pulse * 4 * z : 0), 0, 7); ctx.stroke(); ctx.fillStyle = hot ? '#ffc23a' : 'rgba(143,179,255,.55)'; ctx.font = F(s.el === 'H' ? 14 : 18); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s.el, x, y + 1); });
    ctx.setLineDash([]);
  }
  for (const b of Lab.bonds) {
    const x = A(b.a), y = A(b.b); if (!x || !y) continue;
    const [x1, y1] = w2s(x.x, x.y), [x2, y2] = w2s(y.x, y.y);
    if (x.mono) { ctx.strokeStyle = '#2dffb3'; ctx.lineWidth = 4 * z; ctx.setLineDash([8 * z, 6 * z]); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.setLineDash([]); continue; }
    if (!b.t0) { b.t0 = now; if (!QUIET && Lab.atoms.length < 60) fxBurst((x.x + y.x) / 2, (x.y + y.y) / 2, ['#ffc23a', '#e9f6ff'], 4); }
    const young = now - b.t0 < .3; if (young) Lab.animT = now + .1;
    const t = D.bondType(x.el, y.el), hot = (st && st.k === 'bond' && st.bond === b) || young;
    ctx.strokeStyle = hot ? `rgba(255,194,58,${.4 + .6 * pulse})` : t === 'iónico' ? '#ff2fb3' : t === 'covalente polar' ? '#39c8ff' : '#c9a2ff';
    ctx.lineWidth = (hot ? 4 : 2.4) * z; if (t === 'iónico' && !hot) ctx.setLineDash([5 * z, 4 * z]);
    const L = Math.hypot(x2 - x1, y2 - y1) || 1, nx = -(y2 - y1) / L, ny = (x2 - x1) / L, off = b.o === 1 ? [0] : b.o === 2 ? [-3.4, 3.4] : [-5.5, 0, 5.5];
    for (const o of off) { ctx.beginPath(); ctx.moveTo(x1 + nx * o * z, y1 + ny * o * z); ctx.lineTo(x2 + nx * o * z, y2 + ny * o * z); ctx.stroke(); }
    ctx.setLineDash([]);
  }
  for (const a of Lab.atoms) {
    const [x, y] = w2s(a.x, a.y), sel = a.id === Lab.sel, hv = Lab.hover && Lab.hover.id === a.id;
    if (a.mono) {
      const w = 82 * z, h = 34 * z; ctx.fillStyle = '#03100b'; ctx.strokeStyle = hv ? (Lab.hover.ok ? '#2dffb3' : '#ff2fb3') : sel ? '#ffc23a' : '#2dffb3'; ctx.lineWidth = (sel || hv ? 3 : 2) * z;
      ctx.beginPath(); ctx.rect(x - w / 2, y - h / 2, w, h); ctx.fill(); ctx.stroke();
      const fr = cap(a); ctx.fillStyle = '#ff6fd0'; [-1, 1].slice(0, fr).forEach(sx => { ctx.beginPath(); ctx.arc(x + sx * (w / 2 + 5 * z), y, 3 * z, 0, 7); ctx.fill(); });
      ctx.fillStyle = '#e9f6ff'; ctx.font = F(15); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(D.fUni(DB.comp[a.mono].f), x, y + 1);
      continue;
    }
    if (!a.t0) a.t0 = now; const ag = now - a.t0, pop = ag < .32 ? (Lab.animT = now + .1, 1 + Math.sin(Math.min(1, ag / .32) * Math.PI) * .35 - (1 - Math.min(1, ag / .12)) * .6) : 1;
    const r = rad(a) * z * Math.max(.3, pop), c = colOf(a.el), nd = need(a);
    if (hv) { ctx.strokeStyle = Lab.hover.ok ? '#2dffb3' : '#ff2fb3'; ctx.lineWidth = 3 * z; ctx.beginPath(); ctx.arc(x, y, r + 9 * z, 0, 7); ctx.stroke(); }
    ctx.fillStyle = '#05010c'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    ctx.strokeStyle = c; ctx.globalAlpha = .25; ctx.lineWidth = 7 * z; ctx.stroke(); ctx.globalAlpha = 1; ctx.lineWidth = 2 * z; ctx.stroke();
    if (sel) { ctx.strokeStyle = '#ffc23a'; ctx.lineWidth = 2.5 * z; ctx.setLineDash([4 * z, 3 * z]); ctx.beginPath(); ctx.arc(x, y, r + 6 * z, now * 2, now * 2 + 7); ctx.stroke(); ctx.setLineDash([]); }
    ctx.fillStyle = '#e9f6ff'; ctx.font = F((a.el.length > 1 ? 16 : 19) * (a.el === 'H' ? .8 : 1)); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(a.el, x, y + 1);
    { const happy = nd === 0 && (nbrs(a.id).length > 0 || D.maxVal(a.el) === 0), fx = x + r * .8, fy = y - r * .8, fr = 6.8 * z, fc = happy ? '#2dffb3' : '#ff6fd0';
      ctx.fillStyle = happy ? '#06261b' : '#2a0820'; ctx.strokeStyle = fc; ctx.lineWidth = 1.4 * z; ctx.beginPath(); ctx.arc(fx, fy, fr, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = fc;
      ctx.beginPath(); ctx.arc(fx - 2.3 * z, fy - 1.6 * z, .95 * z, 0, 7); ctx.arc(fx + 2.3 * z, fy - 1.6 * z, .95 * z, 0, 7); ctx.fill(); ctx.beginPath();
      if (happy) ctx.arc(fx, fy + .2 * z, 3 * z, .18 * Math.PI, .82 * Math.PI); else ctx.arc(fx, fy + 4.6 * z, 3 * z, 1.2 * Math.PI, 1.8 * Math.PI); ctx.stroke(); }
    if (nd > 0) { // manos libres: pequeños conectores
      const nb = nbrs(a.id), base = nb.length ? Math.atan2(nb.reduce((s, n) => s + n.y - a.y, 0), nb.reduce((s, n) => s + n.x - a.x, 0)) + Math.PI : -Math.PI / 2;
      ctx.strokeStyle = ctx.fillStyle = Lab.flash ? '#ff2fb3' : '#ff6fd0'; ctx.lineWidth = 2 * z;
      for (let k = 0; k < nd; k++) { const g = base + (k - (nd - 1) / 2) * .62, x0 = x + Math.cos(g) * r, y0 = y + Math.sin(g) * r, x1 = x + Math.cos(g) * (r + 7 * z), y1 = y + Math.sin(g) * (r + 7 * z); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.beginPath(); ctx.arc(x1, y1, 2.8 * z, 0, 7); ctx.fill(); }
    }
  }
  Lab.flash = 0;
  $$('#tray .hint, .tools-v .hint, #bSyn.hint').forEach(e => e.classList.remove('hint'));
  if (st) { if (st.k === 'place') { const b = $(`#tray [data-arg="${st.el}"]`); b && b.classList.add('hint'); } if (st.k === 'autoH') $('#bAH').classList.add('hint'); if (st.k === 'synth') $('#bSyn').classList.add('hint'); }
  const co = $('#coach'); if (co) co.innerHTML = st ? stepText(st) : BT ? '☣ Construye algo con la propiedad que pide el escáner y pulsa <b class="hl">⚗ LANZAR</b>' : (!Lab.atoms.length && !MIS ? 'Toca un átomo de la bandeja para empezar · ▶ en el panel sigue la historia' : '');
  drawFx(now, z);
}
function analysis() {
  const el = $('#ana'); if (!el) return;
  if (TAB !== 'lab' || Lab.mode !== 'mol') { el.innerHTML = ''; return; }
  if (!Lab.atoms.length) { el.innerHTML = '<span class="m">Mesa vacía</span>'; return; }
  const g = toGraph(), comps = D.components(g), si = Lab.sel != null ? Lab.atoms.findIndex(a => a.id === Lab.sel) : -1;
  const c = comps.find(c => c.includes(si)) || comps.slice().sort((a, b) => b.length - a.length)[0], sg = D.subgraph(g, c);
  if (sg.atoms.some(a => a.mono)) { el.innerHTML = `<span class="fm">⛓ ${c.length}×</span> <span class="m">${esc([...new Set(sg.atoms.map(a => DB.comp[a.mono].name))].join(' + '))}</span> ` + (c.length >= 3 ? '<span class="ok">✓ cadena lista</span>' : '<span class="bad">mínimo 3</span>'); return; }
  const cnt = D.countOf(sg), sums = D.bondSums(sg), miss = sg.atoms.reduce((s, a, i) => s + Math.max(0, D.freeOf(a.el, sums[i])), 0), stable = sg.atoms.every((a, i) => D.valence(a.el).includes(sums[i]));
  const gr = sg.atoms.length > 1 ? D.groupsOf(sg).filter(x => x !== 'anillo').slice(0, 2).join(', ') : '';
  el.innerHTML = `<span class="fm">${fHTML(D.hill(cnt))}</span> <span class="m">${D.molarMass(cnt).toFixed(2).replace('.', ',')} g/mol</span><br>` + (stable && sg.atoms.length > 1 ? '<span class="ok">😀 ¡todos felices! (estable)</span>' : `<span class="bad">😟 ${miss ? miss + ' mano(s) libre(s)' : 'inestable'}</span>`) + (gr ? ` <span class="m">· ${esc(gr)}</span>` : '') + (comps.length > 1 ? ` <span class="m">· ${comps.length} piezas</span>` : '');
}
function fit(list) {
  list = list || Lab.atoms; if (!list.length) { Lab.view = { x: 0, y: 0, z: 1 }; return redraw(); }
  const xs = list.map(a => a.x), ys = list.map(a => a.y), w = Math.max(...xs) - Math.min(...xs) + 130, h = Math.max(...ys) - Math.min(...ys) + 130;
  Lab.view = { x: (Math.max(...xs) + Math.min(...xs)) / 2, y: (Math.max(...ys) + Math.min(...ys)) / 2, z: D.clamp(Math.min(CW / w, CHh / h), .35, 1.4) }; redraw();
}
function zoom(f) { Lab.view.z = D.clamp(Lab.view.z * f, .35, 2.2); redraw(); }
function hitAtom(sx, sy) { const [x, y] = s2w(sx, sy); for (let i = Lab.atoms.length - 1; i >= 0; i--) { const a = Lab.atoms[i]; if (a.mono ? Math.abs(a.x - x) < 44 && Math.abs(a.y - y) < 20 : Math.hypot(a.x - x, a.y - y) < rad(a) + 8) return a; } return null; }
function hitBond(sx, sy) {
  const [x, y] = s2w(sx, sy); let best = null, bd = 12 / Lab.view.z;
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
    if (st.at != null) {
      const a = A(st.at); if (!a) return; if (!st.snapped) { snap(); st.snapped = true; } const [wx, wy] = s2w(...p); a.x = wx; a.y = wy;
      const t = Lab.atoms.find(o => o.id !== a.id && (o.mono ? Math.abs(o.x - a.x) < 50 && Math.abs(o.y - a.y) < 26 : Math.hypot(o.x - a.x, o.y - a.y) < 34));
      Lab.hover = t ? { id: t.id, ok: !!t.mono === !!a.mono && !bondOf(t.id, a.id) && cap(t) > 0 && cap(a) > 0 } : null;
    } else { Lab.view.x = st.v.x - dx / Lab.view.z; Lab.view.y = st.v.y - dy / Lab.view.z; }
    redraw();
  });
  const up = e => {
    P.delete(e.pointerId); if (P.size < 2) pinch = null; if (!st) return;
    if (!st.moved) { if (st.at != null) tapAtom(st.at); else if (st.bd) tapBond(st.bd); else { Lab.sel = null; redraw(); } }
    else if (st.at != null) dropAtom(st.at);
    st = null;
  };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', e => { P.delete(e.pointerId); pinch = null; st = null; Lab.hover = null; });
  cv.addEventListener('wheel', e => { e.preventDefault(); zoom(e.deltaY < 0 ? 1.1 : 1 / 1.1); }, { passive: false });
}
function renderTray() {
  const els = labEls();
  let h = els.map(s => { const z = D.SYM[s], v = D.valence(s); return `<button class="at" style="--c:${colOf(s)}" data-act="spawn" data-arg="${s}" aria-label="${esc(D.elem(z).name)}"><span class="z">${z}</span><span class="v">${v[0] ? '✋' + Math.max(...v) : '·'}</span><span class="s">${s}</span><span class="n">${esc(D.elem(z).name)}</span></button>`; }).join('');
  const monos = Object.keys(S.fr).filter(id => DB.comp[id] && DB.comp[id].mono);
  if ((S.unl >= 8 || S.set.sandbox) && monos.length) h += '<span class="tsec">Monómeros</span>' + monos.map(id => `<button class="at mono" style="--c:#2dffb3" data-act="mono" data-arg="${id}"><span class="s">${fHTML(DB.comp[id].f)}</span><span class="n">${esc(DB.comp[id].name)}</span></button>`).join('');
  const t = $('#tray'); if (t) t.innerHTML = h; redraw();
}
const synT = t => { const e = $('#bSyn .t'); if (e) e.textContent = t; };
function setMode(m) {
  Lab.mode = m; $$('.lmode button').forEach(b => b.classList.toggle('on', b.dataset.arg === m));
  $('#molPane').hidden = m !== 'mol'; $('#forgePane').hidden = m !== 'forge'; $('#reactPane').hidden = m !== 'react';
  if (m === 'forge') renderForge(); else if (m === 'react') renderReact(); else requestAnimationFrame(resize);
  roomBar(); renderSide();
}

/* ============================================================
   REACTOR (ecuaciones: Little Alchemy + The Right Mix)
   ============================================================ */
const React_ = { L: [], R: [], route: 0, auto: false };
function stock() {
  const c = Object.keys(S.fr).filter(id => DB.comp[id]);
  const e = Object.keys(S.el).filter(s => S.el[s] === 1 && D.SYM[s] && D.maxVal(s) > 0 && !['H', 'O', 'N', 'F', 'Cl'].includes(s)).map(s => '@' + s);
  return [...c, ...e];
}
function rxList() { const m = REACT.find(React_.L.map(t => t[1])); if (MIS && MIS.p.k === 'r') m.sort((a, b) => (b.id === MIS.p.id) - (a.id === MIS.p.id)); return m; }
function rxNow() { const m = rxList(); return m.length ? m[React_.route % m.length] : null; }
function syncRx(force) {
  const rx = rxNow();
  if (!rx) { React_.R = []; return; }
  if (React_.R.length !== rx.R.length || React_.R.some((t, i) => t[1] !== rx.R[i][1])) { React_.R = rx.R.map(t => [1, t[1]]); force = true; }
  if (force && (dOf(curL()).bal || React_.auto)) { React_.L = rx.L.map(t => [t[0], t[1]]); React_.R = rx.R.map(t => [t[0], t[1]]); }
}
function renderReact() {
  const box = $('#reactPane'); if (!box) return; const rx = rxNow(), bal = rx && REACT.balanced(React_.L, React_.R), assist = dOf(curL()).bal;
  const known = id => id[0] === '@' ? S.el[id.slice(1)] === 1 : !!S.fr[id];
  const term = (t, side, i) => `<span class="term"><span class="cf"><button data-act="rxc" data-arg="${side},${i},-1" aria-label="menos">−</button><b>${t[0]}</b><button data-act="rxc" data-arg="${side},${i},1" aria-label="más">+</button></span><button class="sub" ${side === 'L' ? `data-act="rxdel" data-arg="${i}"` : 'data-act="noop"'}><span>${fHTML(REACT.form(t[1]))}</span><small>${esc(side === 'R' && !known(t[1]) ? '¿? nuevo' : REACT.name(t[1]))}</small></button></span>`;
  const lhs = React_.L.map((t, i) => term(t, 'L', i)).join('<span class="op">+</span>') || '<span class="m">Toca sustancias de tus frascos (abajo)</span>';
  const rhs = rx ? React_.R.map((t, i) => term(t, 'R', i)).join('<span class="op">+</span>') : '<span class="m">?</span>';
  let tbl = '';
  if (rx) { const a = REACT.sum(React_.L), b = REACT.sum(React_.R), ks = [...new Set([...Object.keys(a), ...Object.keys(b)])]; tbl = '<div class="bal"><span class="m">átomos izq|der:</span>' + ks.map(k => `<span class="${(a[k] || 0) === (b[k] || 0) ? 'ok' : 'bad'}">${k} ${a[k] || 0}|${b[k] || 0}</span>`).join('') + '</div>'; }
  const routes = rx ? rxList() : [];
  const want = MIS && MIS.p.k === 'r' && dOf(MIS.L).g >= 2 ? new Set(REACT.rx[MIS.p.id].L.map(t => t[1])) : null;
  const st = stock().map(id => `<button class="nuc${want && want.has(id) && !React_.L.some(t => t[1] === id) ? ' hint' : ''}" style="--c:${id[0] === '@' ? colOf(id.slice(1)) : '#39c8ff'}" data-act="rxadd" data-arg="${esc(id)}"><span>${fHTML(REACT.form(id))}</span><small>${esc(REACT.name(id))}</small></button>`).join('');
  const miss = MIS && MIS.p.k === 'r' ? REACT.rx[MIS.p.id].L.map(t => t[1]).filter(id => !known(id)) : [];
  box.innerHTML = `<div class="rx"><div class="eq"><span class="vat" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M6 12h28l-3 18a6 6 0 0 1-6 5H15a6 6 0 0 1-6-5z" class="vb"/><path d="M9 22h22l-1.4 8a5 5 0 0 1-5 4H15.4a5 5 0 0 1-5-4z" class="vl"/><circle cx="16" cy="18" r="2" class="vbub"/><circle cx="24" cy="15" r="1.6" class="vbub b2"/></svg></span>${lhs}<span class="arrow">→</span>${rhs}</div>
   <div class="row">${tbl}${routes.length > 1 ? `<button class="btn gh sm" data-act="rxroute">Ruta ${React_.route % routes.length + 1}/${routes.length}: ${esc(rx.name)}</button>` : rx ? `<span class="m">${esc(rx.name)}</span>` : ''}</div>
   <div class="row"><button class="btn pri${rx && bal ? ' hint' : ''}" data-act="react" ${React_.L.length ? '' : 'disabled'}>⚗ Reaccionar</button><button class="btn gh" data-act="rxclear">✕</button>${rx && !assist && !bal && !React_.auto ? '<button class="btn gh" data-act="rxhint">Pista ⚡15</button>' : ''}${(assist || React_.auto) && rx ? '<span class="ok sm">ÉTER balanceó la ecuación</span>' : ''}${rx && bal ? '<span class="ok">✓ balanceada · ⚡' + (REACT.energy(rx) >= 0 ? '+' : '') + REACT.energy(rx) + '</span>' : rx ? '<span class="bad">✕ cuenta los átomos de cada lado</span>' : ''}</div>
   ${miss.length ? `<p class="bad sm">Te falta en los frascos: ${miss.map(id => fHTML(REACT.form(id))).join(', ')} · constrúyelo en ⚛ Moléculas</p>` : ''}
   <div class="sec-t">Tus frascos · toca para añadir · toca un reactivo para quitarlo</div><div class="nucs">${st || '<span class="m">Sintetiza sustancias primero.</span>'}</div></div>`;
}
function rxAdd(id) { if (React_.L.some(t => t[1] === id)) return; if (React_.L.length >= 3) return toast('Máximo 3 reactivos'); React_.L.push([1, id]); React_.route = 0; syncRx(true); sfx('tap'); renderReact(); }
function rxCoef(side, i, d) { const arr = side === 'L' ? React_.L : React_.R; if (!arr[i]) return; arr[i][0] = D.clamp(arr[i][0] + d, 1, 12); sfx('tap'); renderReact(); }
function react() {
  syncRx(false); const rx = rxNow();
  if (!rx) { toast('No reaccionan… o ÉTER aún no conoce esa reacción', 'bad'); sfx('bad'); return null; }
  if (!REACT.balanced(React_.L, React_.R)) { S.en = Math.max(0, S.en - 3); toast('¡Desbalance! Nada se crea ni se destruye: iguala los átomos', 'bad'); say('unbal'); sfx('bad'); shake($('#reactPane')); hud(); return null; }
  const E = REACT.energy(rx); if (E < 0 && S.en + E < 0) { toast('Energía insuficiente: necesitas ⚡' + (-E), 'bad'); return null; }
  S.en = D.clamp(S.en + E, 0, MAXE); S.st.react = (S.st.react || 0) + 1;
  React_.R.forEach(([k, id]) => { if (id[0] === '@') { const s = id.slice(1); if (S.el[s] !== 1) { S.el[s] = 1; renderTray(); } } else if (store(id, k, null)) toast('¡NUEVO! ' + nameOf(id).html, 'ok'); });
  toast('⚗ ' + esc(rx.name) + ' · ⚡' + (E >= 0 ? '+' : '') + E, 'ok'); say('react'); sfx(rx.dH < -300 ? 'boom' : 'ok'); vib(30);
  if (rx.dH < -300) { const r = $('#reactPane').getBoundingClientRect(); boom(r.left + r.width / 2, r.top + 60); shake(); }
  save(); hud(); renderReact(); const box = $('#reactPane .rx'); if (box) box.insertAdjacentHTML('afterbegin', `<div class="film">${esc(rx.name)}: ${esc(rx.desc)}</div>`);
  if (MIS && MIS.p.k === 'r' && MIS.p.id === rx.id) completeMission();
  return rx;
}

/* ============================================================
   FORJA NUCLEAR
   ============================================================ */
const Forge = { slots: [null, null, null], flux: 0, log: [] };
const nucSort = (a, b) => { const x = NUC.parse(a), y = NUC.parse(b); return x.z - y.z || x.a - y.a; };
function renderForge() {
  const items = Forge.slots.map(k => k && NUC.parse(k)), r = NUC.fuse(items, Forge.flux);
  const sl = (k, i) => k ? (() => { const p = NUC.parse(k); return `<button class="slot" style="--c:${colOf(D.elem(Math.max(1, p.z)).sym)}" data-act="unslot" data-arg="${i}" aria-label="Quitar ${esc(NUC.name(p.z, p.a))}">${NUC.label(p.z, p.a)}<small>${esc(NUC.name(p.z, p.a))}</small></button>`; })() : `<button class="slot empty" data-act="noop" aria-label="Ranura vacía">+<small>núcleo</small></button>`;
  let pv = '<span class="m">Carga núcleos en las ranuras del acelerador. Z (protones) y A (masa) se suman: Z dice qué elemento sale.</span>';
  const zs = items.filter(Boolean);
  if (zs.length || Forge.flux) {
    const calc = 'Z = ' + (zs.map(p => p.z).join(' + ') || '0') + ' = <b>' + r.Z + '</b> · A = ' + ([...zs.map(p => p.a), ...(Forge.flux ? [Forge.flux + 'n'] : [])].join(' + ') || '0') + ' = <b>' + r.A + '</b>';
    if (r.ok) { const p = r.prod, e = D.elem(p.z), tag = { stable: '<span class="ok">ESTABLE</span>', decay: '<span class="gold">DECAE ' + r.steps.join(' ') + '</span>', island: '<span class="ok">ISLA DE ESTABILIDAD</span>', shv: '<span class="bad">SUPERPESADO · vive milisegundos</span>' }[r.kind];
      pv = `<div class="m">${calc}</div><div class="big">→ ${NUC.label(p.z, p.a)} ${esc(p.z === 126 && S.eternio ? 'Eternio' : e.name)}</div>${tag}${NUC.radio(p.z, p.a) && r.kind !== 'shv' ? ' <span class="gold">☢ radiactivo</span>' : ''} · <span class="${r.net >= 0 ? 'ok' : 'bad'}">⚡ ${r.net >= 0 ? '+' : ''}${r.net}</span>${r.msg ? '<div class="m">' + esc(r.msg) + '</div>' : ''}`; }
    else pv = `<div class="m">${calc}</div><div class="bad">${esc(r.msg)}</div>`;
  }
  const want = MIS && MIS.p.k === 'f' && dOf(MIS.L).g >= 2 ? new Set(MIS.p.r.split('+').filter(t => !/^\d+n$/.test(t))) : null;
  const nucs = Object.keys(S.nuc).sort(nucSort).map(k => { const p = NUC.parse(k); if (!p) return ''; const hint = want && want.has(k) && !Forge.slots.includes(k) ? ' hint' : ''; return `<button class="nuc${hint}" style="--c:${colOf(D.elem(Math.max(1, p.z)).sym)}" data-act="nuc" data-arg="${k}">${NUC.label(p.z, p.a)}<small>Z${p.z} A${p.a}</small></button>`; }).join('');
  const pr = r.ok && r.prod, pe = pr && D.elem(pr.z), core = pr ? `<div class="ptile${r.kind === 'shv' ? ' shv' : ''}" style="--c:${colOf(pe.sym)}"><small>${pr.z}</small><b>${esc(pr.z === 126 && S.eternio ? 'Et' : pe.sym)}</b><span>A ${pr.a}</span></div>` : `<div class="ptile q"><b>?</b><span>${zs.length ? 'no funde' : 'vacío'}</span></div>`;
  const ring = `<svg viewBox="0 0 200 200" aria-hidden="true"><path d="M24 24L52 52M176 24L148 52M24 176L52 148M176 176L148 148" class="inj"/><circle cx="100" cy="100" r="72" class="rt"/><circle cx="100" cy="100" r="58" class="ri"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="94" y="20" width="12" height="16" rx="2" class="mg" transform="rotate(${i * 45 + 22.5} 100 100)"/>`).join('')}<g class="beam"><circle cx="100" cy="28" r="5" class="pa"/><circle cx="100" cy="172" r="5" class="pb"/></g><circle cx="100" cy="100" r="40" class="glow"/></svg>`;
  $('#forgePane').innerHTML = `<div class="forge"><div class="fcol"><div class="accel${r.ok ? ' armed' : ''}" id="accel">${ring}<div class="port p0">${sl(Forge.slots[0], 0)}</div><div class="port p1">${sl(Forge.slots[1], 1)}</div><div class="port p2">${sl(Forge.slots[2], 2)}</div>
   <div class="port p3 flux" aria-label="Tanque de neutrones"><button data-act="flux" data-arg="1" aria-label="Más neutrones">+</button><span>${Forge.flux}n</span><button data-act="flux" data-arg="-1" aria-label="Menos neutrones">−</button></div><div class="core">${core}</div></div>
  <div class="fctl"><button class="fuse${r.ok ? ' hint' : ''}" data-act="fuse">☢ Fusionar</button><button class="btn gh sm" data-act="fclear" aria-label="Vaciar ranuras">✕</button><button class="btn gh sm" data-act="flux" data-arg="10">+10n</button></div></div>
  <div class="fcol"><div class="prev" id="fprev">${pv}</div><div class="sec-t">Cápsulas de núcleos · toca para cargar</div><div class="nucs">${nucs}</div>
  <div class="sec-t">Bitácora de la forja</div><div class="flog">${Forge.log.slice(-5).reverse().map(esc).join('<br>') || 'Sin fusiones todavía. Prueba p + n.'}</div></div></div>`;
}
function addNuc(k) { const i = Forge.slots.indexOf(null); Forge.slots[i < 0 ? 2 : i] = k; sfx('tap'); renderForge(); }
function fuse() {
  const items = Forge.slots.map(k => k && NUC.parse(k)), r = NUC.fuse(items, Forge.flux);
  if (!r.ok) { if (r.cost > S.en) { toast('Energía insuficiente', 'bad'); return r; } S.en -= r.cost; toast(esc(r.msg), 'bad'); sfx('bad'); shake($('#forgePane')); Forge.log.push('✕ ' + r.msg); hud(); renderForge(); return r; }
  if (r.net < 0 && S.en + r.net < 0) { toast('Energía insuficiente: necesitas ⚡' + (-r.net) + '. Fusiona núcleos ligeros (D + D) o resuelve problemas.', 'bad'); sfx('bad'); return r; }
  S.en = D.clamp(S.en + r.net, 0, MAXE); S.st.fuse++;
  const p = r.prod, e = D.elem(p.z), k = NUC.key(p.z, p.a), sym = e.sym; let msg;
  if (r.kind === 'shv') { if (!S.el[sym]) S.el[sym] = 'det'; msg = '☢ ' + NUC.label(p.z, p.a) + ' ' + e.name + ' detectado: decae en milisegundos'; }
  else {
    const newN = !S.nuc[k]; S.nuc[k] = 1; const newE = S.el[sym] !== 1 && p.z > 1; if (newE) S.el[sym] = 1;
    if (p.z === 126 && r.kind === 'island') S.eternio = 1;
    msg = (newE ? '¡ELEMENTO NUEVO! ' : newN ? '¡Núcleo nuevo! ' : '') + NUC.label(p.z, p.a) + ' ' + (p.z === 126 && S.eternio ? 'Eternio' : e.name) + (r.steps.length ? ' (' + r.steps.join(' ') + ')' : '');
    if (newE) { renderTray(); dotFr(); say('element'); }
  }
  Forge.log.push(NUC.label(p.z, p.a) + ' ← ' + Forge.slots.filter(Boolean).join(' + ') + (Forge.flux ? ' + ' + Forge.flux + 'n' : '') + ' · ⚡' + (r.net >= 0 ? '+' : '') + r.net);
  toast(msg, 'ok'); sfx('fuse'); vib(30); renderForge(); const pv = $('#fprev'); if (pv) pv.classList.add('fuseFx'); const ac = $('#accel'); if (ac) ac.classList.add('fire');
  hud(); save();
  if (MIS && MIS.p.k === 'f') { const q = MIS.p; if (p.z === q.z && (!q.a || q.a === p.a) && (q.det ? true : r.kind !== 'shv') && (!q.isl || r.kind === 'island')) completeMission(); }
  return r;
}

/* ============================================================
   DESTILACIÓN (puzzle de clasificar líquidos)
   ============================================================ */
const LIQ = ['#39c8ff', '#ff2fb3', '#2dffb3', '#ffc23a', '#a42cff', '#ff7a3d', '#e9f6ff', '#5a7dff'];
let SO = null;
function startSort(L, i) {
  const p = LEVELS[L - 1].P[i], g = SORT.gen(p.n, L * 1000 + i * 17 + (S.st.fail || 0));
  SO = { L, i, p, st: g.st, init: g.st.map(t => t.slice()), sol: g.sol, sel: null, moves: 0, hist: [], t: p.T, T: p.T };
  $('#sortOv').hidden = false; renderSort();
}
function renderSort() {
  if (!SO) return; const el = $('#sortOv'), mix = SO.p.mix;
  el.innerHTML = `<div class="bt-top"><span class="mega">⚱ ${esc(SO.p.t)}</span><span class="m">Movimientos ${SO.moves}</span><span class="tm" id="soT">${Math.ceil(SO.t)}</span><button class="btn gh sm" data-act="sundo">⟲</button><button class="btn gh sm" data-act="sreset">Reiniciar</button><button class="btn gh sm" data-act="squit">Salir</button></div>
  <div class="sbody"><div class="tubes">${SO.st.map((t, k) => `<button class="tube${SO.sel === k ? ' sel' : ''}" data-act="stube" data-arg="${k}" aria-label="Tubo ${k + 1}">${t.map(c => `<i style="background:${LIQ[c]}"><span>${fHTML(DB.comp[mix[c]] ? DB.comp[mix[c]].f : mix[c])}</span></i>`).join('')}</button>`).join('')}</div>
  <div class="legend">${mix.map((m, c) => `<span><i style="background:${LIQ[c]}"></i>${esc(DB.comp[m] ? DB.comp[m].name : m)}</span>`).join('')}</div>
  <p class="m sm">Toca un tubo y luego otro: la capa de arriba se vierte si cae sobre el mismo líquido o en un tubo vacío.</p></div>`;
}
function sortTap(k) {
  if (!SO) return; const st = SO.st; if (!st[k]) return;
  if (SO.sel == null) { if (st[k] && st[k].length) { SO.sel = k; sfx('tap'); } renderSort(); return; }
  if (SO.sel === k) { SO.sel = null; renderSort(); return; }
  if (SORT.can(st, SO.sel, k)) { SO.hist.push(st.map(t => t.slice())); SORT.pour(st, SO.sel, k); SO.moves++; SO.sel = null; sfx('pour'); vib(10);
    if (SORT.solved(st)) { const s = SO; SO = null; $('#sortOv').hidden = true; say('sort'); const used = 1 - Math.max(0, s.t) / s.T; win(s.L, s.i, s.late ? 1 : used <= .4 ? 3 : used <= .7 ? 2 : 1, Math.max(0, Math.round(s.t)) * 2); return; } }
  else { toast('Solo sobre el mismo líquido o en un tubo vacío con espacio'); SO.sel = st[k] && st[k].length ? k : null; sfx('bad'); }
  renderSort();
}

/* ============================================================
   MISIONES, RECOMPENSAS, FALLOS
   ============================================================ */
let MIS = null;
function giftLevel(L) { (LEVELS[L - 1].gift || []).forEach(s => { if (S.el[s] !== 1) S.el[s] = 1; }); }
function nextOpen() { for (let L = 1; L <= S.unl; L++) for (let i = 0; i < 10; i++) if (!S.prog[D.pk(L, i)]) return [L, i]; return null; }
function startProblem(L, i) {
  closeModal(); const p = LEVELS[L - 1].P[i]; if (!p) return;
  if (!D.problemOpen(S, L, i)) return toast('Resuelve primero el problema anterior', 'bad');
  if (CH) chalEnd(true);
  if (L === 31 && !S.seen.s4i) { S.seen.s4i = 1; save(); if (!QUIET) { slides(STORY.s4i, () => { levelTalk(31); startProblem(L, i); }); return; } }
  if (L === 21 && !S.seen.s3i) { S.seen.s3i = 1; save(); if (!QUIET) { slides(STORY.s3i, () => { levelTalk(21); startProblem(L, i); }); return; } }
  if (L === 11 && !S.seen.s2i) { S.seen.s2i = 1; save(); if (!QUIET) { slides(STORY.s2i, () => { levelTalk(11); startProblem(L, i); }); return; } }
  { const k = D.pk(L, i), t = S.pt[k] || (S.pt[k] = {}); t.a = (t.a || 0) + 1; PT0[k] = Date.now(); }
  S.cur = L; hud();
  if (p.k === 'b') return openDeck(L, i);
  endMission();
  if (p.k === 's') { startSort(L, i); return; }
  if (p.k === 'g') { DE.genes.start(L, i); return; }
  if (p.k === 'o') { DE.org.start(L, i); return; }
  MIS = { L, i, p, t: p.T, T: p.T, hint: false, late: false };
  const g = dOf(L).g;
  setTab('lab');
  if (p.k === 'f') setMode('forge');
  else if (p.k === 'r') { React_.L = []; React_.R = []; React_.auto = false; setMode('react'); }
  else {
    setMode('mol'); clearLab(true); Lab.view = { x: 0, y: 0, z: 1 }; Lab.ghost = null;
    if (p.k === 'm' && g >= 2) { const bp = bpOf(p.id, g === 3); Lab.ghost = { atoms: bp.atoms.map(a => ({ ...a, f: null })), bonds: bp.bonds, withH: g === 3 }; const gh = Lab.ghost; requestAnimationFrame(() => { resize(); if (gh && Lab.ghost === gh) fit(gh.atoms); }); }
  }
  renderSide(); renderTray();
}
function endMission() { MIS = null; Lab.ghost = null; redraw(); renderSide(); }
function completeMission() { const m = MIS; if (!m) return; if (m.ch) return chalNext(); const used = 1 - m.t / m.T, stars = m.late ? 1 : used <= .4 ? 3 : used <= .7 ? 2 : 1; endMission(); win(m.L, m.i, stars, Math.round(Math.max(0, m.t)) * 2); }
function failMission(why) {
  const m = MIS; if (!m) return; if (m.ch) { chalEnd(true); return; } endMission(); const p = m.p;
  const hint = p.k === 'f' ? 'Receta posible: ' + esc(p.r.replace(/\+/g, ' + ')) : p.k === 'r' ? 'Ecuación: ' + esc(REACT.rx[p.id].eq.replace(/@/g, '').replace(/\+/g, ' + ').replace('=', ' → ')) : 'Fórmula: ' + fHTML(DB.comp[p.id] ? DB.comp[p.id].f : DB.poly[p.id] ? DB.poly[p.id].mk : p.id) + '. Cuenta las manos de cada átomo.';
  lose(m.L, m.i, why, hint);
}
function missionCheck(made) { if (!MIS || (MIS.p.k !== 'm' && MIS.p.k !== 'p')) return; if (made.some(r => r.id === MIS.p.id)) completeMission(); }
function useHint() {
  if (!MIS) return; const c = MIS.p.k === 'r' ? 15 : 20; if (S.en < c) return toast('Necesitas ⚡' + c, 'bad');
  S.en -= c; MIS.hint = true; if (MIS.i >= 0) { const t = S.pt[D.pk(MIS.L, MIS.i)] || (S.pt[D.pk(MIS.L, MIS.i)] = {}); t.h = (t.h || 0) + 1; } if (MIS.p.k === 'r') { React_.auto = true; syncRx(true); renderReact(); } hud(); renderSide(); sfx('tap');
}
/* ---------- desafíos: reto diario y duelos (5 moléculas con semilla) ---------- */
function dateKey(d) { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function chalList(seed) {
  const r = D.mulberry(seed), cand = Object.values(DB.comp).filter(c => !c.s2 && c.atoms >= 2 && c.atoms <= 16 && Object.keys(c.cnt).every(e => COMMON.includes(e))), out = [];
  [[2, 3], [3, 5], [4, 7], [6, 10], [8, 16]].forEach(([a, b]) => { const pool = cand.filter(c => c.atoms >= a && c.atoms <= b && !out.includes(c.id)); out.push(pool[Math.floor(r() * pool.length)].id); });
  return out;
}
function startChallenge(kind, seed, opt) {
  closeModal(); if (BT) { BT = null; document.body.classList.remove('inbattle'); $('#bstrip').hidden = true; synT('Crear'); } if (SO) { SO = null; $('#sortOv').hidden = true; } endMission();
  CH = Object.assign({ kind, seed, list: chalList(seed), idx: 0, el: 0, skips: 0, rival: null }, opt || {});
  setTab('lab'); setMode('mol'); chalTarget();
  showLine(['eter', 'feliz', kind === 'daily' ? 'Reto diario: cinco moléculas, todos los elementos comunes. El reloj corre.' : 'Duelo: las mismas cinco moléculas para los dos. Que gane la mejor química.']);
}
function chalTarget() { const id = CH.list[CH.idx]; clearLab(true); Lab.ghost = null; Lab.view = { x: 0, y: 0, z: 1 }; MIS = { L: S.cur, i: -1, ch: 1, p: { k: 'm', id, t: 'Reto ' + (CH.idx + 1) + '/' + CH.list.length, d: 'Construye ' + DB.comp[id].name + ' con cualquier elemento común.', T: 1 }, t: 1, T: 1, hint: true }; renderTray(); renderSide(); }
function chalNext() { MIS = null; CH.idx++; sfx('win'); vib(30); if (CH.onProg) CH.onProg(CH.idx, CH.el + CH.skips * 30); if (CH.idx >= CH.list.length) return chalEnd(); toast('✓ ' + CH.idx + '/' + CH.list.length + ' · ' + fmtT(CH.el + CH.skips * 30), 'ok'); chalTarget(); }
function chalSkip() { if (!CH) return; CH.skips++; toast('+30 s de penalización', 'bad'); chalNext(); }
function chalEnd(quit) {
  const c = CH; if (!c) return; CH = null; MIS = null; Lab.ghost = null; renderTray(); renderSide();
  if (quit) { if (c.kind === 'duel' && c.onEnd) c.onEnd(9999); toast('Reto abandonado'); return; }
  const total = c.el + c.skips * 30;
  if (c.kind === 'daily') {
    const today = dateKey(), y = dateKey(new Date(Date.now() - 864e5)), d = S.daily, first = d.last !== today;
    if (first) { d.streak = d.last === y ? d.streak + 1 : 1; d.last = today; S.en = D.clamp(S.en + 50, 0, MAXE); S.sc += 300; }
    d.best[today] = Math.min(d.best[today] || 1e9, total); const ks = Object.keys(d.best).sort(); while (ks.length > 60) delete d.best[ks.shift()];
    save(true); hud(); sfx('win'); say('win');
    const txt = '🔥 Reto diario de Doc Element (' + today + '): 5 moléculas en ' + fmtT(total) + ' · racha ' + d.streak + ' días. ¿Me ganas? ' + CFG.URL;
    modal(`<div class="res"><div class="por big">${D.CH.doc('loco', rankN())}</div><div><div class="pag">Reto diario · ${today}</div><h2 class="mega">${fmtT(total)}</h2><p>Racha: <b class="gold">🔥 ${d.streak} día(s)</b> · mejor de hoy ${fmtT(d.best[today])}${c.skips ? ' · ' + c.skips + ' salto(s)' : ''}${first ? ' · ⚡ +50' : ''}</p><p class="m sm">Vuelve mañana: cada día hay cinco moléculas nuevas, iguales para todo el mundo.</p><div class="row"><button class="btn pri" data-act="dshare" data-arg="${esc(txt)}">⇪ Compartir resultado</button><button class="btn gh" data-act="close">Cerrar</button></div></div></div>`);
    return;
  }
  if (c.onEnd) c.onEnd(total);
}
function win(L, i, stars, bonus) {
  const k = D.pk(L, i), was = D.levelDone(S, L), prev = S.prog[k] || 0;
  S.prog[k] = Math.max(prev, stars); { const t = S.pt[k] || (S.pt[k] = {}); t.w = (t.w || 0) + 1; if (PT0[k]) { t.s = (t.s || 0) + (Date.now() - PT0[k]) / 1000; delete PT0[k]; } }
  const sc = 100 * stars + bonus; S.sc += sc; S.en = D.clamp(S.en + 20 + 10 * stars, 0, MAXE); S.st.win++;
  let up = false; if (!was && D.levelDone(S, L) && S.unl === L && L < LEVELS.length) { S.unl = L + 1; giftLevel(L + 1); up = true; }
  save(true); hud(); sfx('win'); vib([30, 40, 60]);
  const lvl = LEVELS[L - 1], done = !was && D.levelDone(S, L), isEnd = L % 10 === 0 && done; if (up) S.cur = L + 1; const nx = nextOpen();
  say(done ? 'level' : 'win');
  modal(`<div class="res"><div class="por big">${D.CH.doc(stars === 3 ? 'loco' : 'feliz', rankN())}</div><div><div class="pag">Nivel ${L} · Problema ${i + 1} / 10</div><div class="boxed spaced ok-b">Resuelto</div><h2 class="mega">${esc(lvl.P[i].t)}</h2><div class="stars">${[0, 1, 2].map(k => `<span class="${k < stars ? 'on' : 'off'}" style="animation-delay:${.15 + k * .18}s">★</span>`).join('')}</div><p>+${sc} puntos · ⚡ +${20 + 10 * stars}</p>` +
    (done ? `<div class="film">Nivel ${L} completado: ${esc(lvl.t)}.${up ? ' Se abre el nivel ' + (L + 1) + ': ' + esc(LEVELS[L].t) + '.' : ''}</div>` : '') +
    `<div class="row" style="margin-top:10px">${isEnd ? `<button class="btn pri" data-act="ending" data-arg="${L / 10}">Final de temporada ▸</button>` : nx ? `<button class="btn pri" data-act="go" data-arg="${nx[0]},${nx[1]}">Siguiente ▸</button>` : ''}<button class="btn gh" data-act="tomap">Mapa</button><button class="btn gh" data-act="toship">⌂ Nave</button>${done ? '<button class="btn gh" data-act="donate">☕ Apoyar</button>' : ''}</div></div></div>`);
  renderMap(); renderTray(); renderSide(); if (up) levelTalk(L + 1);
}
function lose(L, i, why, hint) {
  S.st.fail++; { const t = S.pt[D.pk(L, i)] || (S.pt[D.pk(L, i)] = {}); t.f = (t.f || 0) + 1; } save(); sfx('lose'); vib(120); say('lose');
  ADS.inter(() => modal(`<div class="res"><div class="por big">${D.CH.doc('triste', rankN())}</div><div><div class="pag">Nivel ${L} · Problema ${i + 1} / 10</div><div class="boxed spaced bad-b">Fallo</div><h2 class="mega">${esc(LEVELS[L - 1].P[i].t)}</h2><p class="w">${esc(why)}</p><div class="film">ÉTER: ${hint}</div><div class="row" style="margin-top:10px"><button class="btn pri" data-act="go" data-arg="${L},${i}">Reintentar ▸</button><button class="btn gh" data-act="close">Laboratorio</button></div></div></div>`));
}

/* ============================================================
   BATALLA (cartas + timing tipo Skywire + propagación tipo Plague Inc)
   ============================================================ */
let BT = null, DECK = new Set();
function openDeck(L, i) {
  const p = LEVELS[L - 1].P[i], cards = D.allCards(S); DECK = new Set((S.deck || []).filter(id => cards.some(c => c.id === id)).slice(0, 4));
  const list = cards.map(c => `<button class="card ${c.kind === 'el' ? 'el' : c.kind}${DECK.has(c.id) ? ' sel' : ''}" style="--c:${c.kind === 'el' ? colOf(c.f) : ''}" data-act="pick" data-arg="${esc(c.id)}"><span class="k">${{ el: 'ELEM', mol: 'MOL', poly: 'POLI', hyb: 'HÍBR' }[c.kind]}</span><span class="f">${fHTML(c.f)}</span><span class="nm">${esc(c.name)}</span><span class="tg">${tagChips(c.tags, 3)}</span></button>`).join('');
  const kid = L <= 2 ? '<p class="ok sm">Consejo: en la batalla aparecerá el plano de una molécula útil. Constrúyela y pulsa ⚗ LANZAR.</p>' : '';
  const rg = dOf(L).rg * (p.boss ? 1.5 : 1);
  modal(`<div class="pag">Nivel ${L} · Problema ${i + 1} / 10 · ${p.boss ? 'Jefe' : 'Batalla'} · síntesis bajo presión</div><h2 class="mega">${esc(p.t)}</h2><p>${esc(p.d)}</p><div class="film">Escáner: ${esc(p.sc)}<br>Amenaza ${p.hp} · ${p.T} s · drena ${p.dps} %/s${rg ? ' · se propaga +' + rg + '/s' : ''}</div>${kid}<p class="m sm">Durante la batalla construyes moléculas en vivo y las LANZAS (×5 de daño, más si son complejas). Repetir la misma sustancia crea resistencia. Estas cartas son munición preparada: 2 tiros cada una.</p><div class="sec-t">Munición: elige hasta 4 cartas (<span id="dkn">${DECK.size}</span>/4) · opcional</div>` +
    (cards.length ? `<div class="grid">${list}</div>` : '<p class="m">Aún no tienes cartas: no importa, construirás en vivo.</p>') +
    `<div class="row sticky"><button class="btn pri" data-act="fight" data-arg="${L},${i}">☣ ¡A la batalla!</button><button class="btn gh" data-act="close">Volver</button></div>`);
}
function pick(id, el) { if (DECK.has(id)) DECK.delete(id); else { if (DECK.size >= 4) return toast('Máximo 4 cartas'); DECK.add(id); } el.classList.toggle('sel', DECK.has(id)); const n = $('#dkn'); if (n) n.textContent = DECK.size; sfx('tap'); }
const GLYPH = ['☣', '✹', '☢', '⚠', '❂', '✺', '⌬', '☄', '✷', '⚛'];
function recommend(b) { // la molécula más rentable que puedes armar ahora (para el plano en niveles guiados)
  const els = new Set(labEls()); let best = null, bv = 0;
  for (const id in DB.comp) {
    const c = DB.comp[id]; if (c.s2 || !Object.keys(c.cnt).every(e => els.has(e))) continue;
    const card = D.cardFromId(S, id), e = BAT.eff(card, b.ph); if (e <= 0) continue;
    const v = e * BAT.cpow(card) * BAT.fatigue(b.uses[id]) / BAT.build(card.heavy, card.hasH) / (1 + c.atoms / 30);
    if (v > bv) { bv = v; best = id; }
  }
  return best;
}
function battleGhost() {
  Lab.ghost = null; if (!BT) return; const g = dOf(BT.L).g; if (g < 2) return redraw();
  const id = recommend(BT.b); if (!id) return redraw();
  const bp = bpOf(id, g === 3); Lab.ghost = { id, atoms: bp.atoms.map(a => ({ ...a, f: null })), bonds: bp.bonds, withH: g === 3 };
  const gh = Lab.ghost; requestAnimationFrame(() => { resize(); if (gh && Lab.ghost === gh) fit(gh.atoms); });
}
function startBattle(L, i, ids) {
  ids = (ids || [...DECK]).slice(0, 4); const cards = ids.map(id => D.cardFromId(S, id)).filter(Boolean); S.deck = ids;
  closeModal(); if (CH) chalEnd(true); endMission(); if (SO) { SO = null; $('#sortOv').hidden = true; }
  const p = LEVELS[L - 1].P[i], b = BAT.create(p, cards, dOf(L)); BT = { b, L, i };
  document.body.classList.add('inbattle'); setTab('lab'); setMode('mol'); clearLab(true); Lab.view = { x: 0, y: 0, z: 1 };
  const st = $('#bstrip');
  st.innerHTML = `<div class="tw"><div class="threat" id="thr">${GLYPH[(L * 3 + i) % GLYPH.length]}</div>${b.crit ? '<div class="ring" id="ring"></div>' : ''}</div>
  <div class="bs-c"><div class="bs-t"><span class="mega">${esc(p.t)}</span><span class="combo" id="btC"></span></div><div class="hb"><i id="btHp" style="width:100%"></i><span id="btHpN">${p.hp}</span></div><div class="hb ship"><i id="btIn" style="width:100%"></i><span id="btInN">Nave 100 %</span></div><div class="phase" id="btPh">${esc(p.sc)}${b.rg ? ' · ☣ se propaga +' + b.rg + '/s' : ''}${p.mut ? ' · ⟳ muta cada ' + p.mut + ' s' : ''}</div></div>
  <div class="bs-r"><span class="tm" id="btT">${p.T}</span><button class="btn gh sm" data-act="flee">Huir</button></div>`;
  st.hidden = false; synT('Lanzar');
  battleGhost(); renderSide(); renderTray(); sfx('tap'); vib(40);
  showLine(['eter', L <= 2 ? 'neutral' : 'enojado', L <= 2 ? 'Construye la molécula del plano y pulsa LANZAR. Lo que fabricas en vivo pega cinco veces más.' : 'Lee el escáner, construye y lanza. Si repites la misma sustancia, se vuelve resistente.']);
}
function shotFx(fromEl, r, label) {
  if (QUIET || TEST) return; const thr = $('#thr'); if (!thr) return;
  const a = (fromEl || $('#bSyn')).getBoundingClientRect(), t = thr.getBoundingClientRect();
  const s = document.createElement('div'); s.className = 'shot'; s.style.left = (a.left + a.width / 2 - 8) + 'px'; s.style.top = (a.top + a.height / 2 - 8) + 'px';
  s.style.background = r.kind === 'hit' ? (r.crit ? 'var(--amb)' : 'var(--ink)') : r.kind === 'heal' ? 'var(--mag)' : '#777'; s.style.color = s.style.background; document.body.appendChild(s);
  requestAnimationFrame(() => { s.style.transform = `translate(${t.left + t.width / 2 - a.left - a.width / 2}px,${t.top + t.height / 2 - a.top - a.height / 2}px)`; s.style.opacity = '.3'; });
  setTimeout(() => s.remove(), 340);
  setTimeout(() => {
    const st = $('#bstrip'); if (!st) return; const pp = document.createElement('div'); pp.className = 'pop';
    pp.style.left = (12 + Math.random() * 40) + '%'; pp.style.top = '42%'; pp.style.color = r.kind === 'hit' ? 'var(--amb)' : r.kind === 'heal' ? 'var(--mag)' : '#999';
    pp.textContent = r.kind === 'hit' ? (r.crit ? '¡CRÍTICO! ' : '') + '−' + r.dmg + (r.f < 1 ? ' · resistencia ×' + r.f.toFixed(2) : '') + (BT && BT.b.combo > 1 ? ' · combo ×' + BAT.mult(BT.b.combo).toFixed(1) : '') : r.kind === 'heal' ? '¡EMPEORA! +' + Math.round(r.dmg / 2) : 'SIN EFECTO';
    if (label) pp.textContent = label + ' ' + pp.textContent;
    st.appendChild(pp); setTimeout(() => pp.remove(), 1000); thr.classList.remove('hit'); void thr.offsetWidth; thr.classList.add('hit');
  }, 300);
}
function throwCard(k) {
  if (!BT || BT.b.over) return null; const b = BT.b, c = b.deck[k]; if (!c) return null;
  const r = BAT.throw(b, c); if (!r) { if (!(b.ammo[c.id] > 0)) toast('Sin munición de ' + esc(c.name) + ': constrúyela'); return null; }
  shotFx($$('#mis .dk')[k], r); renderSide();
  sfx(r.crit ? 'crit' : r.kind === 'hit' ? 'hit' : r.kind === 'heal' ? 'heal' : 'tap'); vib(r.kind === 'hit' ? (r.crit ? 30 : 15) : 60);
  return r;
}
function launch(made) { // lo sintetizado en batalla se lanza contra la amenaza
  if (!BT) return []; const out = [];
  made.forEach(m => {
    if (!BT || BT.b.over) return; const card = D.cardFromId(S, m.id); if (!card) return;
    const r = BAT.launch(BT.b, card); if (!r) return; out.push(r);
    shotFx($('#bSyn'), r, D.fUni(nameOf(m.id).f));
    sfx(r.crit ? 'crit' : r.kind === 'hit' ? 'boom' : 'bad'); vib(r.kind === 'hit' ? 40 : 80);
  });
  if (out.some(r => r.kind === 'heal')) say('lose');
  battleUI(); if (BT) { battleGhost(); renderSide(); }
  return out;
}
function battleUI() {
  if (!BT) return; const b = BT.b, set = (id, f) => { const e = document.getElementById(id); if (e) f(e); };
  set('btT', e => { e.textContent = Math.max(0, Math.ceil(b.t)); e.classList.toggle('low', b.t < 12); });
  set('btHp', e => e.style.width = (100 * Math.max(0, b.hp) / b.max) + '%'); set('btHpN', e => e.textContent = Math.max(0, Math.round(b.hp)) + ' / ' + b.max);
  set('btIn', e => e.style.width = Math.max(0, b.integ) + '%'); set('btInN', e => e.textContent = 'Nave ' + Math.max(0, Math.round(b.integ)) + ' %');
  set('btC', e => e.textContent = b.combo > 1 ? 'COMBO ×' + b.combo : '');
  if (b.crit) set('ring', e => { const f = (b.cyc % BAT.WIN) / BAT.WIN, w = BAT.WIN_ON / BAT.WIN, on = f < w; e.style.transform = 'scale(' + (on ? 1 : 1 + .9 * (1 - (f - w) / (1 - w))) + ')'; e.classList.toggle('on', on); });
  b.deck.forEach((c, k) => set('cd' + k, e => e.style.height = (100 * (b.cd[c.id] || 0) / BAT.CD) + '%'));
  while (b.ev.length) { const ev = b.ev.shift(); if (ev.k === 'spike') { shake($('#bstrip')); vib(40); } if (ev.k === 'phase') { const mu = b.p.mut, wk = Object.keys(b.ph.w).map(t => TAGS[t] ? TAGS[t][0] : t).join(' + '); set('btPh', e => e.innerHTML = '<b class="gold">' + (mu ? '⟳ MUTÓ' : 'FASE 2 · MUTACIÓN') + '</b> · ' + esc(mu && b.phase === 1 ? b.p.sc : b.ph.d) + (mu ? ' · débil a ' + esc(wk) : '')); toast((mu ? '⟳ MUTÓ · ahora es débil a ' + esc(wk) : 'MUTACIÓN: ' + esc(b.ph.d)), 'bad'); battleGhost(); } }
  if (b.over) endBattle();
}
function endBattle() {
  const { b, L, i } = BT; BT = null; document.body.classList.remove('inbattle'); const st = $('#bstrip'); st.hidden = true; st.innerHTML = '';
  synT('Crear'); Lab.ghost = null; clearLab(true); renderSide(); renderTray();
  if (b.win) { fxBurst(0, 0, ['#2dffb3', '#ffc23a', '#39c8ff'], 40); win(L, i, b.stars, Math.round(b.t) * 3 + b.maxCombo * 10 + b.crits * 15 + b.launches * 5); }
  else { const p = b.p, w = D.parseTags(p.w), h = D.parseTags(p.h); lose(L, i, b.why || 'Retirada.', 'Su debilidad: <b>' + tagWords(w) + '</b>' + (Object.keys(h).length ? ' · la alimenta: ' + tagWords(h) : '') + (p.hx ? ' · empeora con: ' + p.hx.split(',').map(x => nameOf(x).f).join(', ') : '') + '. Construye en vivo sustancias con esas propiedades y alterna para evitar la resistencia.'); }
}
function flee() { if (!BT) return; BT.b.over = true; BT.b.win = false; BT.b.why = 'Huiste de la batalla.'; battleUI(); }

/* ============================================================
   PANEL LATERAL: misión + análisis
   ============================================================ */
function renderSide() {
  const box = $('#mis'); if (!box) return;
  if (BT) {
    const b = BT.b;
    box.innerHTML = `<div class="pag">☣ Batalla · N${BT.L}·${BT.i + 1} · lanzadas ${b.launches}</div><div class="m sm">Construye y pulsa <b class="hl">⚗ LANZAR</b>. Lo que repites pierde fuerza (resistencia).</div>` + (b.deck.length ? `<div class="sec-t">Munición preparada · teclas 1–4</div><div class="ars">${b.deck.map((c, k) => `<button class="dk" data-act="throw" data-arg="${k}"><span class="f">${fHTML(c.f)}</span><span class="nm">${esc(c.name)}</span><span class="am">${'●'.repeat(b.ammo[c.id] || 0)}${'○'.repeat(BAT.AMMO - (b.ammo[c.id] || 0))}</span><i class="cd" id="cd${k}" style="height:0"></i></button>`).join('')}</div>` : '<p class="m sm">Sin munición preparada: todo depende de lo que construyas.</p>') + (b.crit ? '<p class="m sm">Lanza cuando el anillo dorado toca la amenaza: CRÍTICO ×1,5.</p>' : '');
    analysis(); return;
  }
  if (MIS && MIS.ch) {
    const c = DB.comp[MIS.p.id], cnt = D.countOf(toGraph()), rv = CH.rival;
    box.innerHTML = `<div class="pag">${{ daily: '🔥 Reto diario', duel: '⚔ Duelo LAN', async: '⚔ Duelo Bluetooth' }[CH.kind]} · ${CH.idx + 1}/${CH.list.length}</div><div class="mt">${esc(c.name)}</div><div class="obj"><b>${fHTML(c.f)}</b></div><div class="chk">${Object.keys(c.cnt).map(e => `<span class="${(cnt[e] || 0) === c.cnt[e] ? 'ok' : (cnt[e] || 0) > c.cnt[e] ? 'bad' : ''}">${e} ${cnt[e] || 0}/${c.cnt[e]}</span>`).join('')}</div><div class="tbar"><i style="width:${CH.idx * 20}%;background:var(--grn)"></i></div>${rv ? `<div class="m sm">Rival ${esc(rv.name || '')}: ${rv.done ? '✓ ' + fmtT(rv.el) : (rv.idx || 0) + '/5'}</div><div class="tbar"><i style="width:${(rv.done ? 5 : rv.idx || 0) * 20}%;background:var(--mag)"></i></div>` : ''}<div class="row"><span class="tm" id="mT">${fmtT(CH.el + CH.skips * 30)}</span><button class="btn gh sm" data-act="chskip">Saltar +30 s</button><button class="btn gh sm" data-act="chquit">Rendirse</button></div>`;
    analysis(); return;
  }
  if (!MIS) {
    const nx = nextOpen(), ready = D.levelDone(S, 1);
    box.innerHTML = `<div class="pag">Sin misión activa</div>${nx ? `<button class="btn pri wide" data-act="go" data-arg="${nx[0]},${nx[1]}">▶ ${esc(LEVELS[nx[0] - 1].P[nx[1]].t)}</button><span class="m sm">Nivel ${nx[0]} · problema ${nx[1] + 1}</span>` : '<span class="ok">¡Temporada completada!</span>'}<div class="row"><button class="btn gh sm" data-act="antena">📡 Retos y duelos${S.daily.streak ? ' · 🔥' + S.daily.streak : ''}</button><button class="btn gh sm" data-act="nave">◂ Nave</button></div>`;
  } else {
    const p = MIS.p, L = MIS.L, g = dOf(L).g, kind = { m: '⚗ Síntesis', p: '⛓ Polímero', f: '☢ Forja', r: '⇄ Reacción' }[p.k];
    let obj = '', list = '';
    if (p.k === 'm') {
      const c = DB.comp[p.id], show = g >= 1 || MIS.hint;
      obj = `<div class="obj">${esc(c.name)}${show ? ' · <b>' + fHTML(c.f) + '</b>' : ''}</div>`;
      if (show) { const cnt = D.countOf(toGraph()); list = '<div class="chk">' + Object.keys(c.cnt).map(e => `<span class="${(cnt[e] || 0) === c.cnt[e] ? 'ok' : (cnt[e] || 0) > c.cnt[e] ? 'bad' : ''}">${e} ${cnt[e] || 0}/${c.cnt[e]}</span>`).join('') + '</div>'; }
      else list = '<button class="btn gh sm" data-act="hint">Pista: fórmula ⚡20</button>';
    } else if (p.k === 'p') obj = `<div class="obj">${esc(DB.poly[p.id].name)} · ${DB.poly[p.id].ms.map(m => fHTML(DB.comp[m].f)).join(' + ')}</div><div class="m sm">Bloques en la bandeja → 3 o más en cadena</div>`;
    else if (p.k === 'f') obj = `<div class="obj">Z ${p.z}${p.a ? ' · A ' + p.a : ''} · ${esc(D.elem(p.z).name)}</div>` + (g >= 1 ? `<div class="m sm">Receta: ${esc(p.r.replace(/\+/g, ' + '))}</div>` : '');
    else if (p.k === 'r') { const rx = REACT.rx[p.id]; obj = `<div class="obj">${esc(rx.name)}</div><div class="m sm">${rx.L.map(t => fHTML(REACT.form(t[1]))).join(' + ')} → ${rx.R.map(t => fHTML(REACT.form(t[1]))).join(' + ')}</div>` + (!dOf(L).bal && !MIS.hint ? '<button class="btn gh sm" data-act="hint">Pista: balancear ⚡15</button>' : ''); }
    const low = MIS.t < 15 && dOf(L).fail;
    box.innerHTML = `<div class="pag">${kind} · N${L}·${MIS.i + 1}</div><div class="mt">${esc(p.t)}</div>${obj}${list}<p class="dsc">${esc(p.d)}</p><div class="tbar"><i id="mBar" style="width:${100 * Math.max(0, MIS.t) / MIS.T}%"></i></div><div class="row"><span class="tm${low ? ' low' : ''}" id="mT">${MIS.late ? 'sin prisa' : Math.ceil(MIS.t) + ' s'}</span><button class="btn gh sm" data-act="abandon">Abandonar</button></div>`;
  }
  analysis();
}
function updTimer() { if (!MIS) return; if (MIS.ch) { const t = $('#mT'); if (t) t.textContent = fmtT(CH.el + CH.skips * 30); return; } const b = $('#mBar'), t = $('#mT'); if (b) b.style.width = (100 * Math.max(0, MIS.t) / MIS.T) + '%'; if (t) { t.textContent = MIS.late ? 'sin prisa' : Math.ceil(MIS.t) + ' s'; t.classList.toggle('low', MIS.t < 15 && dOf(MIS.L).fail); } }

/* ============================================================
   FRASCOS · MAPA · TRANSMISIONES
   ============================================================ */
let FF = 'all';
function renderFr() {
  const box = $('#frBody'); if (!box) return;
  $$('#t-fr .filt button').forEach(b => b.classList.toggle('on', b.dataset.arg === FF));
  if (FF === 'tab') return renderTable(box);
  if (FF === 'org') { box.innerHTML = '<div class="sect"><span class="outline">T4</span><div><div class="pag">Temporada 4 · niveles 31–40</div><h2 class="mega">Organismos</h2></div></div><div class="film">Virus, bacterias y criaturas construidas con bloques de vida. Señal cifrada: aún no tienes el nivel.</div>'; return; }
  const items = [];
  if (FF === 'all' || FF === 'el') Object.keys(S.el).filter(s => S.el[s] === 1).sort((a, b) => (D.SYM[a] || 126) - (D.SYM[b] || 126)).forEach(s => { const z = D.SYM[s] || 126, e = D.elem(z); items.push(`<button class="card el" style="--c:${colOf(D.SYM[s] ? s : 'Og')}" data-act="det" data-arg="el:${s}"><span class="k">Z ${z}</span><span class="f">${esc(s)}</span><span class="nm">${esc(z === 126 && S.eternio ? 'Eternio' : e.name)}</span><span class="tg">${tagChips(D.parseTags(ELTAGS[s] || ''), 2)}</span></button>`); });
  Object.keys(S.fr).sort((a, b) => S.fr[a].t - S.fr[b].t).forEach(id => {
    const kind = DB.comp[id] ? 'mol' : DB.poly[id] ? 'poly' : 'hyb', t = (DB.comp[id] || DB.poly[id] || S.hyb[id] || {}).tags || {};
    if (FF === 'med' ? !(t.med || t.bio) : FF !== 'all' && FF !== kind) return;
    const n = nameOf(id);
    items.push(`<button class="card ${kind}" data-act="det" data-arg="${esc(id)}"><span class="k">${{ mol: 'MOL', poly: 'POLI', hyb: 'HÍBR' }[kind]} ×${S.fr[id].c}</span><span class="f">${DB.poly[id] ? '[' + fHTML(DB.poly[id].ms.map(m => DB.comp[m].f).join('/')) + ']ₙ' : fHTML(n.f)}</span><span class="nm">${esc(n.name)}</span><span class="tg">${tagChips(t, 3)}</span></button>`);
  });
  const tot = Object.keys(DB.comp).length + Object.keys(DB.poly).length, have = Object.keys(S.fr).filter(id => DB.comp[id] || DB.poly[id]).length;
  box.innerHTML = `<div class="sect"><span class="outline">${have}</span><div><div class="pag">descubiertos de ${tot} · ${Object.keys(S.hyb).length} híbridos · ${Object.values(S.el).filter(v => v === 1).length} elementos</div><h2 class="mega">Frascos</h2></div></div>` + (items.length ? `<div class="grid">${items.join('')}</div>` : '<p class="m">Aún no hay nada aquí. Sintetiza en el laboratorio.</p>');
}
function renderTable(box) {
  let h = '';
  for (let z = 1; z <= 118; z++) { const e = D.elem(z), [r, c] = D.tablePos(z), st = S.el[e.sym], col = D.CAT[D.catOf(z)][1]; h += `<button class="${st === 1 ? 'on' : st === 'det' ? 'det' : ''}" style="grid-row:${r > 7 ? r + 1 : r};grid-column:${c};--c:${col}" data-act="det" data-arg="el:${e.sym}" aria-label="${esc(e.name)}">${e.sym}</button>`; }
  const n = Object.values(S.el).filter(v => v === 1).length;
  box.innerHTML = `<div class="sect"><span class="outline">${n}</span><div><div class="pag">elementos descubiertos · toca para ver datos</div><h2 class="mega">Tabla</h2></div></div><div style="overflow-x:auto"><div class="ptab">${h}<div class="gap" style="grid-row:8"></div></div></div><p class="m sm">${Object.entries(D.CAT).map(([k, v]) => `<span style="color:${v[1]}">■</span> ${v[0]}`).join(' · ')}</p>`;
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
  let html, lay = null;
  if (id.startsWith('el:')) {
    const s = id.slice(3), z = D.SYM[s] || 126, e = D.elem(z), st = S.el[s], pos = D.tablePos(z);
    html = `<div class="pag">Elemento · Z ${z}</div><div class="sect"><span class="outline">${z}</span><h2 class="mega">${esc(z === 126 && S.eternio ? 'Eternio' : e.name)}</h2></div><div class="kv"><b>Símbolo</b><span class="w">${esc(s)}</span><b>Masa atómica</b><span>${String(e.mass).replace('.', ',')} u</span><b>Familia</b><span style="color:${D.CAT[D.catOf(z)][1]}">${D.CAT[D.catOf(z)][0]}</span><b>Periodo</b><span>${pos[0] > 7 ? pos[0] - 3 : pos[0]}</span><b>Valencia (manos)</b><span>${D.valence(s).join(' o ')}</span><b>Estado</b><span class="${st === 1 ? 'ok' : st === 'det' ? 'gold' : 'm'}">${st === 1 ? 'Descubierto' : st === 'det' ? 'Detectado (inestable)' : 'Sin descubrir'}</span></div>` + (st === 1 ? `<div class="tg" style="margin-top:10px">${tagChips(D.parseTags(ELTAGS[s] || ''))}</div>` : '') + (z === 126 ? '<p>Ficción casi real: los físicos predicen que el 126 con 184 neutrones sería “doblemente mágico” y viviría mucho más que sus vecinos.</p>' : '');
  } else {
    const c = DB.comp[id] || DB.poly[id] || S.hyb[id]; if (!c) return; const e = S.fr[id] || {}, n = nameOf(id);
    lay = e.lay || (DB.comp[id] ? (() => { const b = bpOf(id, true); return { a: b.atoms.map(a => [a.el, a.x, a.y]), b: b.bonds.map(x => [x.a, x.b, x.o]) }; })() : null);
    html = `<div class="pag">${DB.comp[id] ? 'Compuesto real' : DB.poly[id] ? 'Polímero real' : 'Híbrido · ficción casi real'} · creado ×${e.c || 0}</div><h2 class="mega">${esc(n.name)}</h2><div class="mega" style="font-size:30px;color:var(--wht)">${DB.poly[id] ? '[' + fHTML(DB.poly[id].ms.map(m => DB.comp[m].f).join('/')) + ']ₙ' : fHTML(n.f)}</div><div class="det2">` + (lay ? '<canvas class="mini" id="miniCv" width="300" height="170"></canvas>' : '') + `<div><p>${esc(c.desc)}</p><div class="tg">${tagChips(c.tags)}</div>` +
      (c.mass ? `<div class="kv" style="margin-top:10px"><b>Masa molar</b><span>${c.mass.toFixed(2).replace('.', ',')} g/mol</span>${c.groups && c.groups.length ? `<b>Grupos</b><span>${esc(c.groups.join(', '))}</span>` : ''}${DB.comp[id] && DB.comp[id].mono ? '<b>Uso</b><span class="ok">Monómero: bloque para polímeros</span>' : ''}</div>` : '') + '</div></div>';
  }
  modal(html); const m = $('#miniCv'); if (m && lay) drawMini(m, lay);
}
const ICON = { m: '⚗', p: '⛓', f: '☢', b: '☣', r: '⇄', s: '⚱', g: '⚭', o: '❀' };
/* ============================================================
   LA NAVE: cada sala es un botón dibujado (ship.js)
   ============================================================ */
const ROOM_OF = { m: 'lab', p: 'lab', r: 'react', f: 'forge', s: 'destil', g: 'gen', o: 'cult', b: 'puente' };
const KIND_OF = { destil: 's', gen: 'g', cult: 'o' };
const ENTER = { lab: () => { setTab('lab'); setMode('mol'); }, react: () => { setTab('lab'); setMode('react'); }, forge: () => { setTab('lab'); setMode('forge'); }, bodega: () => setTab('fr'), puente: () => setTab('bt'), tx: () => setTab('tx'), eter: () => menu(), cryo: () => cryoSheet(), antena: () => antenaSheet() };
const ROOM_INFO = { lab: 'Arrastra átomos al centro y únelos por sus manos. Cuando ninguna mano quede libre, pulsa CREAR.', react: 'Mezcla sustancias de tus frascos y balancea la receta: los átomos de los dos lados deben ser iguales.', forge: 'Une núcleos en el acelerador: los protones (Z) dicen qué elemento sale. Así nacen los elementos nuevos.', destil: 'Separa líquidos: vierte capa por capa hasta dejar un solo color por tubo.', gen: 'El ADN se escribe con A, T, G y C. Aquí lo copias, lo traduces y lo reparas.', cult: 'Estudia seres vivos sin tocarlos: partes de la célula, microbios, defensas y brotes.', puente: 'El mapa de misiones y amenazas de cada nivel.', bodega: 'Todo lo que has creado: elementos, compuestos, polímeros e híbridos.', tx: 'Los guiones de video que narra Doc, uno por nivel.', eter: 'La mente de la nave: guía, ajustes, créditos y más.', cryo: 'Aquí despertaste. Los demás durmientes siguen en sus cápsulas.', antena: 'Reto diario y duelos con amigos por LAN o Bluetooth.' };
const firstL = k => { const i = LEVELS.findIndex(l => l.P.some(p => p.k === k)); return i < 0 ? 1 : i + 1; };
function roomLocks() { const lk = {}; [['destil', 's'], ['gen', 'g'], ['cult', 'o']].forEach(([id, k]) => { const n = firstL(k); if (S.unl < n && !S.set.sandbox) lk[id] = 'Se abre en el nivel ' + n; }); return lk; }
function nextInfo() { const nx = nextOpen(); if (!nx) return null; const p = LEVELS[nx[0] - 1].P[nx[1]]; return { L: nx[0], i: nx[1], p, room: ROOM_OF[p.k] || 'lab' }; }
function renderHub() {
  const box = $('#hub'); if (!box) return; const n = nextInfo(), se = SEASON(n ? n.L : S.cur), RM = DE.ship.ROOM;
  box.innerHTML = DE.ship.svg({ next: n && n.room, threat: n && n.p.k === 'b', locks: roomLocks(), newFr: NEWFR, nFr: Object.keys(S.fr).length, lvl: S.cur, mood: n ? 'feliz' : 'loco', rank: rankN(), eter: n && n.p.k === 'b' ? 'enojado' : 'neutral' });
  $('#hubGo').innerHTML = MIS ? `<button class="console" data-act="resume"><span class="ck">◂ Misión en curso</span><b>${esc(MIS.ch ? 'Reto' : MIS.p.t)}</b><small>Volver a la sala · el reloj sigue corriendo</small></button>` : n ? `<button class="console" data-act="go" data-arg="${n.L},${n.i}"><span class="ck">▶ Siguiente misión · ${RM[n.room].ic} ${esc(RM[n.room].n)}</span><b>${esc(n.p.t)}</b><small>Temporada ${se[0]} · nivel ${n.L} · problema ${n.i + 1}</small></button>` : `<button class="console" data-act="antena"><span class="ck">✦ Todo resuelto</span><b>Reto diario y duelos</b><small>en la Antena</small></button>`;
  const lk = roomLocks();
  $('#hubList').innerHTML = DE.ship.ROOMS.map(r => `<button class="hroom${n && n.room === r.id ? ' next' : ''}${lk[r.id] ? ' lock' : ''}" data-act="room" data-arg="${r.id}"><i>${r.ic}</i><b>${esc(r.n)}</b><small>${esc(lk[r.id] || r.s)}</small></button>`).join('');
}
const LABR = { mol: 'lab', react: 'react', forge: 'forge' };
function roomBar() {
  const el = $('#hRoom'); if (!el) return; if (TAB === 'nave') { el.innerHTML = ''; return; }
  const RM = DE.ship.ROOM, cur = TAB === 'lab' ? LABR[Lab.mode] : { fr: 'bodega', bt: 'puente', tx: 'tx' }[TAB], r = RM[cur];
  const doors = TAB === 'lab' ? Object.keys(LABR).filter(m => m !== Lab.mode).map(m => `<button class="door" data-act="mode" data-arg="${m}" aria-label="Ir a ${esc(RM[LABR[m]].n)}"><i>${RM[LABR[m]].ic}</i><span>${esc(RM[LABR[m]].n)}</span></button>`).join('') : '';
  el.innerHTML = `<span class="rname">${r.ic} ${esc(r.n)}</span>${doors}`;
}
function openRoom(id) {
  const r = DE.ship.ROOM[id]; if (!r) return; const lk = roomLocks()[id];
  if (lk) { sfx('bad'); return toast(esc(r.n) + ': ' + esc(lk), 'bad'); }
  sfx('tap'); const n = nextInfo(), here = n && n.room === id, k = KIND_OF[id];
  if (!here && !k && ENTER[id]) return ENTER[id]();
  const done = k ? LEVELS.flatMap(l => l.P.map((p, i) => [l.n, i, p])).filter(([L, i, p]) => p.k === k && S.prog[D.pk(L, i)]).slice(-6).reverse() : [];
  modal(`<div class="pag">Ouroboros · sala</div><h2 class="mega">${r.ic} ${esc(r.n)}</h2><p class="kick">${esc(r.s)}</p><p>${esc(ROOM_INFO[id] || '')}</p>
    ${here ? `<button class="btn pri wide" data-act="go" data-arg="${n.L},${n.i}">▶ Misión: ${esc(n.p.t)} · nivel ${n.L}</button>` : ''}
    <div class="row" style="margin-top:8px">${ENTER[id] ? `<button class="btn gh" data-act="roomin" data-arg="${id}">Entrar sin misión</button>` : ''}${!here && n ? `<button class="btn gh" data-act="go" data-arg="${n.L},${n.i}">Siguiente misión: ${esc(n.p.t)} (${esc(DE.ship.ROOM[n.room].n)})</button>` : ''}</div>
    ${done.length ? `<div class="sec-t">Repetir</div><div class="row">${done.map(([L, i, p]) => `<button class="btn sm" data-act="go" data-arg="${L},${i}">N${L}·${i + 1} ${esc(p.t)} ${'★'.repeat(S.prog[D.pk(L, i)])}</button>`).join('')}</div>` : k && !here ? '<p class="m sm">Todavía no resuelves problemas de esta sala.</p>' : ''}`);
}
function cryoSheet() {
  const eps = [['intro', 'El despertar', 1], ['ending', 'Final de la temporada 1', S.end >= 1], ['s2i', 'Temporada 2', S.seen.s2i], ['s2e', 'Final de la temporada 2', S.end >= 2], ['s3i', 'Temporada 3', S.seen.s3i], ['s3e', 'Final de la temporada 3', S.end >= 3], ['s4i', 'Temporada 4', S.seen.s4i], ['s4e', 'Final de la temporada 4', S.end >= 4]].filter(e => e[2] && STORY[e[0]]);
  modal(`<div class="res"><div class="por big">${D.CH.doc('triste', rankN())}</div><div><div class="pag">Ouroboros · cubierta B</div><h2 class="mega">❄ Criogenia</h2><p>${esc(ROOM_INFO.cryo)}</p><button class="btn pri" data-act="school">🍼 Química para bebés (1 min)</button></div></div>
    <div class="sec-t">Recuerdos · la historia hasta ahora</div><div class="row">${eps.map(e => `<button class="btn sm" data-act="story" data-arg="${e[0]}">▶ ${esc(e[1])}</button>`).join('')}</div>`);
}
function antenaSheet() {
  const ready = D.levelDone(S, 1);
  modal(`<div class="pag">Ouroboros · techo</div><h2 class="mega">📡 Antena</h2><p>${esc(ROOM_INFO.antena)}</p><div class="row"><button class="btn pri" data-act="daily" ${ready ? '' : 'disabled'}>🔥 Reto diario${S.daily.streak ? ' · racha ' + S.daily.streak : ''}</button><button class="btn" data-act="duel" ${ready ? '' : 'disabled'}>⚔ Duelo LAN / Bluetooth</button></div>${ready ? '' : '<p class="m sm">Se activa al completar el nivel 1.</p>'}`);
}
function renderMap() {
  const box = $('#mapBody'); if (!box) return; const L = S.cur, lv = LEVELS[L - 1];
  $('#lvls').innerHTML = LEVELS.map(l => `<button class="${l.n === L ? 'on' : ''} ${D.levelDone(S, l.n) ? 'done' : ''} ${l.n > S.unl ? 'lock' : ''}" data-act="lvl" data-arg="${l.n}" aria-label="Nivel ${l.n}">${l.n > S.unl ? '·' : l.n}</button>`).join('');
  const pts = lv.P.map((p, i) => [60 + i * 96, 112 + Math.sin(i * 1.3) * 56]);
  const nodes = lv.P.map((p, i) => { const k = D.pk(L, i), st = S.prog[k] || 0, open = D.problemOpen(S, L, i), nx = open && !st; return `<button class="node ${p.boss ? 'boss' : ''} ${st ? 'done' : ''} ${open ? '' : 'lock'} ${nx ? 'next' : ''}" style="left:${pts[i][0]}px;top:${pts[i][1]}px" data-act="open" data-arg="${L},${i}" aria-label="Problema ${i + 1}"><span class="ic">${p.boss ? '✹' : ICON[p.k]}</span><span class="nn">${i + 1}</span><span class="st">${st ? '★'.repeat(st) : ''}</span></button>`; }).join('');
  const d = dOf(L), lvlTag = d.g === 3 ? 'Guiado' : d.g === 2 ? 'Aprendiz' : d.g === 1 ? (d.rg <= 1 ? 'Medio' : 'Difícil') : 'Experto', se = SEASON(L);
  box.innerHTML = `<div class="sect"><span class="outline">${L}</span><div><div class="pag">Temporada ${se[0]} · ${se[1]} · ${D.starsOf(S, L)}/30 ★ · dificultad: ${lvlTag}</div><h2 class="mega">${esc(lv.t)}</h2><p class="kick">${esc(lv.s)}</p></div></div>
  <div class="map"><div class="mapin"><svg viewBox="0 0 1020 230" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="#4d1785" stroke-width="3" stroke-dasharray="8 7"/></svg>${nodes}</div></div>
  <div class="row" style="margin-top:8px"><button class="btn" data-act="txl" data-arg="${L}">▶ Transmisión ${L}</button><span class="m sm">⚗ síntesis · ⇄ reacción · ⛓ polímero · ☢ forja · ⚱ destilación · ⚭ genética · ❀ cultivo · ☣ batalla · ✹ jefe · ayudas: ${['solo nombre', 'lista de átomos', 'plano sin H', 'plano completo'][d.g]}</span></div>`;
  const lc = $('#lvls .on'); if (lc && lc.scrollIntoView) lc.scrollIntoView({ inline: 'center', block: 'nearest' });
  const map = $('.map', box), nx = $('.node.next', box); if (map && nx) map.scrollLeft = Math.max(0, parseFloat(nx.style.left) - map.clientWidth / 2);
}
function openProblem(L, i) {
  const p = LEVELS[L - 1].P[i]; if (!D.problemOpen(S, L, i)) return toast('Resuelve primero el problema anterior');
  const st = S.prog[D.pk(L, i)] || 0, kind = p.boss ? 'Jefe' : { m: 'Síntesis', p: 'Polímero', f: 'Forja', b: 'Batalla', r: 'Reacción', s: 'Destilación', g: 'Genética', o: 'Cultivo' }[p.k];
  const tgt = p.k === 'b' ? `Escáner: ${esc(p.sc)}<br>Amenaza ${p.hp}` : p.k === 'f' ? `Objetivo: Z = ${p.z}${p.a ? ' · A = ' + p.a : ''} · ${esc(D.elem(p.z).name)}${p.det ? ' (basta detectarlo)' : ''}` : p.k === 'r' ? `Reacción: ${esc(REACT.rx[p.id].name)}` : p.k === 's' ? `${p.n} sustancias · ${p.n + 2} tubos` : p.k === 'g' ? { pair: 'Completar la doble hélice', rna: 'Transcribir el ADN a ARN', fix: p.tgt ? 'Editar el gen hacia el objetivo' : 'Encontrar y corregir la mutación', trad: 'Traducir los codones a proteína' }[p.mode] : p.k === 'o' ? { cel: 'Señalar las partes de: ' + esc(ORG.CELL[p.cel || 'bact'][0]), ord: 'Ordenar: ' + esc(p.rule || ''), cls: 'Clasificar: ' + esc(p.rule || ''), epi: 'Contener el brote · a salvo ' + p.save + ' o más' }[p.mode] : `Objetivo: ${dOf(L).g ? nameOf(p.id).html : esc(nameOf(p.id).name)}`;
  modal(`<div class="res"><div class="por big">${D.CH.eter(p.k === 'b' ? 'enojado' : 'neutral')}</div><div><div class="pag">Nivel ${L} · Problema ${i + 1} / 10${dOf(L).fail ? '' : ' · sin prisa'}</div><div class="boxed spaced">${spaced(kind)}</div><h2 class="mega">${esc(p.t)}</h2><p>${esc(p.d)}</p><div class="film">${tgt}<br>Tiempo: ${p.T} s</div>${st ? `<div class="stars" style="font-size:22px">${'★'.repeat(st)}</div>` : ''}<div class="row" style="margin-top:10px"><button class="btn pri" data-act="go" data-arg="${L},${i}">${p.k === 'b' ? 'Preparar mazo' : 'Iniciar'} ▸</button><button class="btn gh" data-act="close">Cerrar</button></div></div></div>`);
}
function renderTx() {
  $('#txBody').innerHTML = `<div class="sect"><span class="outline">${S.unl}</span><div><div class="pag">Guiones de video narrados por Doc · 1 por nivel</div><h2 class="mega">Transmisiones</h2></div></div><div class="txg">` + LEVELS.map(l => `<button class="tx-card ${l.n > S.unl ? 'lock' : ''}" data-act="txl" data-arg="${l.n}"><span class="outline">${String(l.n).padStart(2, '0')}</span><span><span class="mega" style="font-size:24px">${esc(l.t)}</span><br><span class="m sm">${l.n > S.unl ? 'Señal cifrada' : esc(l.s)}</span></span></button>`).join('') + '</div>';
}
function txLevel(L) {
  const l = LEVELS[L - 1]; if (L > S.unl) return toast('Señal cifrada: llega al nivel ' + L);
  modal(`<div class="pag">Transmisión ${String(L).padStart(2, '0')} · Guion de video · Narra: Doc</div><h2 class="mega">${esc(l.t)}</h2><p class="kick">${esc(l.s)}</p><div class="tx3"><div><div class="sec-t">Teoría</div><div class="film">${esc(l.tx.teo)}</div></div><div><div class="sec-t">Dato curioso</div><div class="film">${esc(l.tx.dato)}</div></div><div><div class="sec-t">Ficción · bitácora de Doc</div><div class="film">${esc(l.tx.fic)}</div></div></div><div class="row" style="margin-top:10px"><button class="btn pri" data-act="channel">▶ Ver el video</button><button class="btn gh" data-act="close">Cerrar</button></div>`);
}

/* ============================================================
   PORTADA · HISTORIA · MENÚ
   ============================================================ */
function cover() {
  const c = document.createElement('div'); c.className = 'cover'; c.id = 'cover'; const has = S.intro || Object.keys(S.prog).length;
  c.innerHTML = `<div class="cband"><div>${esc(CFG.STUDIO)}</div><div>Temporadas 1–4 · Núcleo, Fármacos, Genes y Organismos</div></div>
  <svg class="cship" viewBox="0 0 1280 600" aria-hidden="true">${DE.ship.hull(1)}</svg><div class="cgrid"><div class="ctitle"><div class="srf">Química real, núcleos, polímeros, vida, ficción y más</div><h1 class="mega">Doc</h1><h1 class="mega b2">Element</h1><span class="kick">¿Sabes de qué está hecho todo?</span></div>
  <div class="cside"><div class="cpor"><div class="por">${D.CH.doc('loco', 2)}</div><div class="por">${D.CH.eter('feliz')}</div></div><div class="ctag">Crea elementos.<br>Resuelve el universo.</div><div class="cbtns">${has ? '<button class="btn pri" data-act="cont">Continuar ▸</button>' : ''}<button class="btn ${has ? 'gh' : 'pri'}" data-act="newgame">${has ? 'Nueva partida' : 'Despertar ▸'}</button>${has ? '<button class="btn gh" data-act="schoolC">🍼 Química para bebés (1 min)</button>' : ''}</div></div></div>
  <div class="cfoot"><span class="pag">Por: ${esc(CFG.STUDIO)} · ${esc(CFG.PUBLISHER)}</span><span class="adv">Lab advisory<b>Verídico</b>Contenido seguro</span><span class="mega">El laboratorio más actual</span></div>`;
  document.body.appendChild(c);
}
let SLIDES = null, SI = 0, AFTER = null;
function slides(list, after) { SLIDES = list; SI = 0; AFTER = after; const el = document.createElement('div'); el.className = 'cover'; el.id = 'story'; document.body.appendChild(el); slide(); }
function slide() {
  const el = $('#story'); if (!el) return; const [who, mood, t, x] = SLIDES[SI];
  el.innerHTML = `<div class="cband"><div>Ouroboros · Bitácora</div><div>${SI + 1} / ${SLIDES.length}</div></div><div class="sgrid">${who === 'doc' ? `<div class="full">${D.CH.full(mood, rankN())}</div>` : `<div class="por huge">${D.CH.eter(mood)}</div>`}<div class="stext"><div class="pag">${who === 'doc' ? 'Doc' : 'ÉTER · IA de la nave'}</div><div class="boxed spaced">${spaced(t)}</div><div class="film">${esc(x)}</div><div class="row"><button class="btn pri" data-act="snext">${SI < SLIDES.length - 1 ? 'Siguiente ▸' : 'Comenzar ▸'}</button><button class="btn gh" data-act="sskip">Saltar</button></div></div></div><div class="cfoot"><span class="pag">Pag ${SI + 1}</span><span class="pag">Doc Element</span></div>`;
}
function endSlides() { const el = $('#story'); if (el) el.remove(); const f = AFTER; AFTER = null; f && f(); }
function levelTalk(L) { if (S.seen['t' + L]) return; S.seen['t' + L] = 1; save(); const t = LEVELS[L - 1].talk; if (t) talk(t); }
function enterGame() {
  const c = $('#cover'); if (c) c.remove(); hud(); renderTray(); setTab(TAB); requestAnimationFrame(resize);
  if (!S.intro) { S.intro = 1; save(); slides(STORY.intro, () => { const go = () => { levelTalk(1); startProblem(1, 0); }; if (DE.school && !S.seen.school) DE.school.start(go); else go(); }); }
  else { levelTalk(S.cur); if (!TQ.length) say('win'); }
}
function menu() { modal(`<div class="pag">Ouroboros · menú</div><h2 class="mega">Menú</h2><div class="grid g3">${[['school', '🍼 Química para bebés'], ['daily', '🔥 Reto diario'], ['duel', '⚔ Duelo LAN / Bluetooth'], ['cards', '🃏 Cartas imprimibles'], ['guide', '📖 Guía'], ['credits', '✦ Créditos'], ['settings', '⚙ Ajustes'], ['donate', '☕ Apoyar'], ['diag', '🤖 Bot de pruebas'], ['tocover', '⌂ Portada']].map(([a, t]) => `<button class="btn gh" data-act="${a}">${t}</button>`).join('')}</div><div class="film" style="margin-top:12px">Rango: ${esc(D.rankOf(S))} · ${D.totalStars(S)} ★ · síntesis ${S.st.synth} · reacciones ${S.st.react || 0} · fusiones ${S.st.fuse} · híbridos ${S.st.hyb} · victorias ${S.st.win} · fallos ${S.st.fail}</div>`); }
function guide() { modal(`<div class="pag">Manual de ÉTER</div><h2 class="mega">Guía</h2><div class="gcols">` + GUIDE.map(([t, x]) => `<div><div class="sec-t">${esc(t)}</div><p>${esc(x)}</p></div>`).join('') + '</div>'); }
function credits() {
  modal(`<div class="pag">Doc Element · v${CFG.VERSION} · Temporadas 1–3: Núcleo, Fármacos y Genes</div><h2 class="mega">Créditos</h2><div class="boxed" style="text-align:center"><div class="mega" style="font-size:42px">${esc(CFG.STUDIO)}</div><div class="spaced" style="font-size:12px;margin:6px 0">por</div><div class="mega" style="font-size:34px;color:var(--grn)">${esc(CFG.PUBLISHER)}</div></div>
  <div class="gcols"><div><div class="sec-t">Idea, historia y dirección</div><p>${esc(CFG.STUDIO)} · ${esc(CFG.PUBLISHER)}</p><div class="sec-t">Personajes</div><p>Doc, el científico despierto · ÉTER, la inteligencia de la Ouroboros.</p></div><div><div class="sec-t">Ciencia</div><p>Datos públicos de química y física nuclear (IUPAC, energías de enlace nuclear de referencia, fórmula semiempírica de Weizsäcker). Los híbridos y la isla de estabilidad son ficción casi real.</p></div><div><div class="sec-t">Tipografías y librerías</div><p>TeX Gyre Heros Condensed (GUST e-foundry, licencia GUST) · Inter (Rasmus Andersson, SIL OFL 1.1) · qrcode-generator (Kazuhiko Arase, MIT) · jsQR (Cosmo Wolfe, Apache-2.0).</p><div class="sec-t">Apoyo</div><p>El juego es gratis. Donación voluntaria en la Página Oficial.</p></div></div><div class="row"><button class="btn pri" data-act="donate">☕ Apoyar</button><button class="btn gh" data-act="close">Cerrar</button></div>`);
}
function settings() {
  const tg = (k, t) => `<button class="btn ${S.set[k] ? 'pri' : 'gh'}" data-act="set" data-arg="${k}">${t}: ${S.set[k] ? 'Sí' : 'No'}</button>`;
  modal(`<div class="pag">Ajustes · tu partida es tuya</div><h2 class="mega">Ajustes</h2><div class="row">${tg('snd', '♪ Sonido')}${tg('mus', '♫ Música')}${tg('vib', '≋ Vibración')}${tg('sandbox', '⚛ Sandbox')}</div><p class="m">Sandbox: todos los elementos comunes en la bandeja para experimentar libremente.</p><div class="sec-t">Partida</div><div class="row"><button class="btn" data-act="export">⇩ Exportar</button><label class="btn">⇧ Importar<input type="file" accept=".json,application/json" id="impF" hidden></label><button class="btn gh" data-act="reset" style="border-color:var(--mag)">Borrar partida</button></div><div class="sec-t">Pruebas con jugadores</div><p class="m sm">El juego anota intentos, fallos, pistas y tiempos por problema (solo en este dispositivo). Exporta el informe para ajustar la dificultad.</p><div class="row"><button class="btn" data-act="report">⇩ Informe de prueba (CSV)</button><button class="btn" data-act="cards">🃏 Cartas imprimibles</button></div>`);
  $('#impF').addEventListener('change', e => { const f = e.target.files[0]; if (!f) return; const rd = new FileReader(); rd.onload = () => { try { const o = D.sanitize(JSON.parse(rd.result)); if (!o.intro && !Object.keys(o.prog).length) throw 0; S = o; S.seen = S.seen || {}; save(true); closeModal(); hud(); renderTray(); setTab(TAB); toast('Partida importada', 'ok'); } catch (x) { toast('Archivo inválido', 'bad'); } }; rd.readAsText(f); });
}
function download(text, fname, mime) { try { const b = new Blob([text], { type: mime || 'text/plain' }), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = fname; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800); toast('Archivo: ' + esc(fname), 'ok'); return true; } catch (e) { toast('No se pudo guardar el archivo', 'bad'); return false; } }
function exportSave() { download(JSON.stringify(S), 'doc-element-partida-' + dateKey() + '.json', 'application/json'); }
async function shareOut(text, fname) { // Compartir del sistema (Bluetooth, Quick Share, AirDrop, WhatsApp…) → portapapeles → archivo
  const C = window.Capacitor;
  try { if (C && C.Plugins && C.Plugins.Share) { await C.Plugins.Share.share({ title: 'Doc Element', text, dialogTitle: 'Enviar por Bluetooth, Quick Share o WhatsApp' }); return 'share'; } } catch (e) { }
  try { if (navigator.share) { if (fname && navigator.canShare) { const f = new File([text], fname, { type: 'text/plain' }); if (navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], title: 'Doc Element', text }); return 'share'; } } await navigator.share({ title: 'Doc Element', text }); return 'share'; } } catch (e) { if (e && e.name === 'AbortError') return 'abort'; }
  try { await navigator.clipboard.writeText(text); toast('Copiado: pégalo donde quieras', 'ok'); return 'copy'; } catch (e) { }
  if (fname) download(text, fname); return 'file';
}
function reportCSV() {
  const rows = [['nivel', 'problema', 'titulo', 'tipo', 'intentos', 'victorias', 'fallos', 'pistas', 'segundos_promedio', 'estrellas']];
  LEVELS.forEach(L => L.P.forEach((p, i) => { const k = D.pk(L.n, i), t = S.pt[k] || {}; rows.push([L.n, i + 1, p.t, p.boss ? 'jefe' : p.k, t.a || 0, t.w || 0, t.f || 0, t.h || 0, t.w ? Math.round((t.s || 0) / t.w) : '', S.prog[k] || 0]); }));
  return rows.map(r => r.map(x => /[",;\n]/.test(String(x)) ? '"' + String(x).replace(/"/g, '""') + '"' : x).join(',')).join('\n');
}
function cardsHTML() {
  const cards = D.allCards(S), K = { el: 'Elemento', mol: 'Molécula', poly: 'Polímero', hyb: 'Híbrido' };
  const desc = c => c.kind === 'el' ? 'Elemento puro de la tabla periódica.' : ((DB.comp[c.id] || DB.poly[c.id] || S.hyb[c.id] || {}).desc || '');
  const one = c => `<div class="c ${c.kind}"><div class="k">${K[c.kind]} · ×${c.pow.toFixed(1)}</div><div class="f">${fHTML(c.f)}</div><div class="n">${esc(c.name)}</div><div class="s">${Object.keys(c.tags).map(t => `<span>${TAGS[t][1]} ${TAGS[t][0]} ${'●'.repeat(c.tags[t])}${'○'.repeat(3 - c.tags[t])}</span>`).join('')}</div><div class="d">${esc(desc(c))}</div><div class="p">DOC ELEMENT · ${esc(CFG.STUDIO)}</div></div>`;
  return `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Cartas · Doc Element</title><style>@page{size:A4;margin:8mm}*{box-sizing:border-box}body{margin:0;background:#fff;font-family:Arial,Helvetica,sans-serif}.g{display:grid;grid-template-columns:repeat(3,63mm);gap:3mm;justify-content:center}.c{width:63mm;height:88mm;border:2.4mm solid #a42cff;background:#05010b;color:#e9f6ff;padding:3mm;display:flex;flex-direction:column;gap:1.4mm;break-inside:avoid;-webkit-print-color-adjust:exact;print-color-adjust:exact}.c.poly{border-color:#2dffb3}.c.hyb{border-color:#ff2fb3;border-style:dashed}.c.el{border-color:#39c8ff}.k{font-size:7pt;letter-spacing:.2em;text-transform:uppercase;color:#ffc23a}.f{font:700 24pt 'Arial Narrow',Impact,sans-serif;color:#39c8ff}.n{font-size:10pt;font-weight:700}.s{display:flex;flex-direction:column;gap:.6mm;font-size:7.5pt}.d{font-size:7pt;color:#8fb3ff;flex:1;overflow:hidden}.p{font-size:6pt;letter-spacing:.3em;color:#5d6c9a;text-align:center}sub{font-size:.6em}</style></head><body><div class="g">${cards.map(one).join('')}</div><script>setTimeout(function(){print()},500)<\/script></body></html>`;
}
function printCards() { const html = cardsHTML(); let w = null; try { w = window.open('', '_blank'); } catch (e) { } if (w && w.document) { w.document.write(html); w.document.close(); } else download(html, 'cartas-doc-element.html', 'text/html'); }
function openLink(u, label) { if (u) { try { window.open(u, '_blank', 'noopener'); } catch (e) { } } else toast(label + ': próximamente en la Página Oficial'); }
function diag() {
  modal('<div class="pag">Diagnóstico</div><h2 class="mega">Bot de pruebas</h2><p id="dg">Validando datos y jugando partidas simuladas…</p>');
  setTimeout(() => { const t0 = performance.now(), a = DE.test.selfTest(), b = DE.test.monkey(15, 7); const el = $('#dg'); if (!el) return; el.innerHTML = `<div class="film">Validación: ${a.errors.length ? '<span class="bad">' + a.errors.length + ' errores</span>' : '<span class="ok">0 errores</span>'} · ${a.warnings.length} avisos<br>${a.stats}<br>Partidas simuladas: ${b.games} · acciones ${b.actions} · <span class="${b.errors.length ? 'bad' : 'ok'}">${b.errors.length} errores</span><br>Tiempo: ${Math.round(performance.now() - t0)} ms</div>` + [...a.errors, ...b.errors].slice(0, 12).map(x => '<p class="bad">' + esc(x) + '</p>').join(''); }, 30);
}
function fullscreen() { const d = document.documentElement; try { const f = d.requestFullscreen || d.webkitRequestFullscreen; const p = f && f.call(d); if (p && p.then) p.then(() => { try { screen.orientation.lock('landscape').catch(() => { }); } catch (e) { } }).catch(() => { }); } catch (e) { } document.body.classList.add('vok'); }

/* ============================================================
   ACCIONES
   ============================================================ */
const two = s => s.split(',').map(Number);
const ACT = {
  close: () => closeModal(), noop() { }, tab: t => { closeModal(); setTab(t); }, mode: m => setMode(m),
  nave: () => { if (BT) return toast('Termina la batalla o huye primero', 'bad'); closeModal(); setTab('nave'); }, room: id => openRoom(id), roomin: id => { closeModal(); const f = ENTER[id]; if (f) f(); },
  resume: () => { if (!MIS) return setTab('nave'); setTab('lab'); setMode(MIS.ch ? 'mol' : { r: 'react', f: 'forge' }[MIS.p.k] || 'mol'); },
  hubgo: () => { if (MIS) return ACT.resume(); const nx = nextOpen(); if (nx) startProblem(nx[0], nx[1]); else openRoom('lab'); }, story: k => { closeModal(); const n = { ending: 1, s2e: 2, s3e: 3, s4e: 4 }[k]; slides(STORY[k] || STORY.intro, () => { if (n) credits(); }); }, cryo: () => cryoSheet(), antena: () => antenaSheet(),
  spawn: s => spawn(s), mono: id => spawnMono(id), synth: () => synth(), autoH: () => autoH(), undo: () => undo(), del: () => delSel(), clear: () => { clearLab(); toast('Laboratorio limpio'); },
  zin: () => zoom(1.2), zout: () => zoom(1 / 1.2), fit: () => fit(Lab.ghost && !Lab.atoms.length ? Lab.ghost.atoms : null),
  nuc: k => addNuc(k), unslot: i => { Forge.slots[+i] = null; renderForge(); }, flux: d => { Forge.flux = D.clamp(Forge.flux + (+d), 0, 40); renderForge(); }, fuse: () => fuse(), fclear: () => { Forge.slots = [null, null, null]; Forge.flux = 0; renderForge(); },
  rxadd: id => rxAdd(id), rxdel: i => { React_.L.splice(+i, 1); React_.route = 0; syncRx(true); renderReact(); }, rxc: a => { const [s, i, d] = a.split(','); rxCoef(s, +i, +d); }, react: () => react(), rxclear: () => { React_.L = []; React_.R = []; renderReact(); }, rxroute: () => { React_.route++; syncRx(true); renderReact(); }, rxhint: () => useHint(), hint: () => useHint(),
  stube: k => sortTap(+k), sundo: () => { if (SO && SO.hist.length) { SO.st = SO.hist.pop(); SO.moves++; SO.sel = null; renderSort(); } }, sreset: () => { if (SO) { SO.st = SO.init.map(t => t.slice()); SO.hist = []; SO.sel = null; renderSort(); } }, squit: () => { if (SO) { const s = SO; SO = null; $('#sortOv').hidden = true; lose(s.L, s.i, 'Abandonaste la destilación.', 'Primero libera un tubo vacío; luego agrupa colores de a uno.'); } },
  lvl: L => { L = +L; if (L > S.unl) return toast('Completa el nivel ' + (L - 1)); closeModal(); S.cur = L; giftLevel(L); save(); hud(); setTab('bt'); levelTalk(L); },
  open: a => { const [L, i] = two(a); closeModal(); openProblem(L, i); }, go: a => { const [L, i] = two(a); startProblem(L, i); },
  pick: (id, el) => pick(id, el), fight: a => { const [L, i] = two(a); startBattle(L, i); }, throw: k => throwCard(+k), flee: () => flee(),
  abandon: () => { if (MIS) failMission('Abandonaste la misión.'); }, tomap: () => { closeModal(); setTab('bt'); }, toship: () => { closeModal(); setTab('nave'); },
  det: id => detail(id), filt: f => { FF = f; renderFr(); }, txl: L => txLevel(+L), talk: () => nextLine(),
  menu: () => menu(), guide: () => guide(), credits: () => credits(), settings: () => settings(), diag: () => diag(), fs: () => fullscreen(), vok: () => document.body.classList.add('vok'),
  set: k => { S.set[k] = S.set[k] ? 0 : 1; save(); settings(); if (k === 'sandbox') renderTray(); if (k === 'mus') S.set.mus ? MUS.start() : MUS.stop(); },
  daily: () => { if (!D.levelDone(S, 1)) return toast('Completa el nivel 1 primero'); closeModal(); const d = new Date(); startChallenge('daily', d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()); },
  chskip: () => chalSkip(), chquit: () => chalEnd(true), cards: () => printCards(), report: () => download(reportCSV(), 'informe-doc-element-' + dateKey() + '.csv', 'text/csv'), dshare: t => shareOut(t),
  export: () => exportSave(), reset: () => { if (confirm('¿Borrar toda tu partida? No se puede deshacer.')) { S = D.newState(); save(true); location.reload(); } },
  donate: () => openLink(CFG.DONATE_URL, 'Donaciones'), channel: () => openLink(CFG.CHANNEL_URL, 'Videos'),
  tocover: () => { closeModal(); cover(); }, cont: () => enterGame(), schoolC: () => { enterGame(); if (DE.school) DE.school.start(() => renderSide()); },
  newgame: () => { if ((S.intro || Object.keys(S.prog).length) && !confirm('¿Empezar de cero? Se borrará tu partida actual.')) return; S = D.newState(); S.seen = {}; save(true); clearLab(true); Forge.log = []; enterGame(); },
  snext: () => { if (SI < SLIDES.length - 1) { SI++; slide(); } else endSlides(); }, sskip: () => endSlides(),
  ending: n => { closeModal(); S.end = Math.max(S.end || 0, +n || 1); save(); slides(+n === 4 ? STORY.s4e : +n === 3 ? STORY.s3e : +n === 2 ? STORY.s2e : STORY.ending, () => credits()); }
};
document.addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (!b) { if (e.target.id === 'ov' && modalClose) closeModal(); return; } const f = ACT[b.dataset.act] || (DE.ACTX && DE.ACTX[b.dataset.act]); if (f) f(b.dataset.arg, b, e); });
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  if (e.key === 'Escape') { if (!$('#ov').hidden && modalClose) closeModal(); return; }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.getAttribute && e.target.getAttribute('role') === 'button' && e.target.dataset.act) { e.preventDefault(); e.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); return; }
  if (BT && /^[1-4]$/.test(e.key)) { throwCard(+e.key - 1); return; }
  if (TAB !== 'lab' || Lab.mode !== 'mol' || !$('#ov').hidden) return;
  if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); delSel(); }
  else if (e.key === 'Enter') synth();
  else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); }
  else { const s = labEls().find(x => x.toLowerCase() === e.key.toLowerCase()); if (s && !e.ctrlKey && !e.metaKey) spawn(s); }
});

/* ---------- bucle ---------- */
let last = 0, regen = 0;
function tick(dt) {
  if (DE.school && DE.school.blocking()) return;
  if (MIS && MIS.ch) { CH.el += dt; updTimer(); }
  else if (MIS) { MIS.t -= dt; if (MIS.t <= 0 && !MIS.late) { if (dOf(MIS.L).fail) failMission('Se acabó el tiempo.'); else { MIS.late = true; MIS.t = 0; toast('Sin prisa: sigue a tu ritmo (1 ★)'); } } updTimer(); }
  if (SO) { SO.t -= dt; const e = $('#soT'); if (e) e.textContent = Math.max(0, Math.ceil(SO.t)); if (SO.t <= 0 && !SO.late) { if (dOf(SO.L).fail) { const s = SO; SO = null; $('#sortOv').hidden = true; lose(s.L, s.i, 'Se acabó el tiempo.', 'Deja siempre un tubo vacío para maniobrar.'); } else SO.late = true; } }
  if (BT) { BAT.step(BT.b, dt); battleUI(); }
  if (DE.genes) DE.genes.tick(dt);
  if (DE.org) DE.org.tick(dt);
  regen += dt; if (regen >= 2) { regen = 0; if (S.en < 100) { S.en++; hud(); } }
}
let anaT = 0;
function frame(t) {
  const dt = Math.min(.1, (t - (last || t)) / 1000); last = t;
  if (!TEST) tick(dt);
  if (DE.school) DE.school.frame(t);
  if (MUS.ctx) { const mm = BT ? 'battle' : SO ? 'sort' : document.getElementById('cover') || document.getElementById('story') ? 'menu' : 'lab'; if (mm !== MUS.mode) MUS.mode = mm; }
  if (TAB === 'lab' && Lab.mode === 'mol' && (Lab.dirty || Lab.ghost || Lab.sel != null || t / 1000 < Lab.animT || BT)) { const d = Lab.dirty; Lab.dirty = false; draw(); if (d || (anaT += dt) > .5) { anaT = 0; analysis(); if (MIS && MIS.p.k === 'm' && d) renderSide(); } }
  requestAnimationFrame(frame);
}

/* ---------- arranque ---------- */
function boot() {
  load(); giftLevel(1);
  document.body.innerHTML = `<div id="app">
  <header id="hud"><button class="back" data-act="nave" aria-label="Volver a la nave">◂ Nave</button><div class="brand">Doc<b>Element</b></div><div id="hRoom"></div><span class="chip" id="hLv"></span><span class="chip en" id="hEn"></span><span class="chip" id="hSc"></span><span class="chip rk" id="hRk"></span><span class="sp"></span><button class="hb2" data-act="fs" aria-label="Pantalla completa">⛶</button><button class="hb2" data-act="menu" aria-label="Menú">☰</button></header>
  <main id="stage">
   <div class="tab" id="t-nave"><div id="hub"></div><div id="hubCom"></div><div id="hubGo"></div><div id="hubList"></div></div>
   <div class="tab" id="t-lab">
    <div class="pane" id="molPane"><div id="bstrip" hidden></div><div id="cvWrap"><canvas id="cv"></canvas><div id="coach"></div><div class="cvb panel"><button data-act="zin" aria-label="Acercar"><svg viewBox="0 0 24 24" class="ic" aria-hidden="true"><circle cx="10" cy="10" r="6.5"/><path d="M15 15l6.5 6.5M10 7v6M7 10h6"/></svg><span>Acercar</span></button><button data-act="zout" aria-label="Alejar"><svg viewBox="0 0 24 24" class="ic" aria-hidden="true"><circle cx="10" cy="10" r="6.5"/><path d="M15 15l6.5 6.5M7 10h6"/></svg><span>Alejar</span></button><button data-act="fit" aria-label="Centrar"><svg viewBox="0 0 24 24" class="ic" aria-hidden="true"><circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="1.5"/><path d="M12 1.5v4M12 18.5v4M1.5 12h4M18.5 12h4"/></svg><span>Centrar</span></button></div><div class="tools-v panel"><button data-act="undo" aria-label="Deshacer"><svg viewBox="0 0 24 24" class="ic" aria-hidden="true"><path d="M8 8H3V3"/><path d="M3.6 8A9 9 0 1 1 5 17"/></svg><span>Deshacer</span></button><button data-act="del" aria-label="Quitar"><svg viewBox="0 0 24 24" class="ic" aria-hidden="true"><path d="M6 2l5 15h2l5-15"/><path d="M9.5 12h5"/><circle cx="12" cy="20.5" r="2"/></svg><span>Quitar</span></button><button data-act="clear" aria-label="Vaciar"><svg viewBox="0 0 24 24" class="ic" aria-hidden="true"><path d="M3 9h18l-2.2 9.5a2 2 0 0 1-2 1.5H7.2a2 2 0 0 1-2-1.5z"/><path d="M12 20v2M8 5.5l4-3 4 3"/></svg><span>Vaciar</span></button><button data-act="autoH" id="bAH" aria-label="+H"><svg viewBox="0 0 24 24" class="ic" aria-hidden="true"><path d="M9 3h6M12 3v2"/><rect x="6.5" y="5" width="11" height="17" rx="3"/><path d="M10 10v7M14 10v7M10 13.5h4"/></svg><span>+H</span></button></div><button class="syn" id="bSyn" data-act="synth" aria-label="Crear la molécula"><span class="sico"><svg viewBox="0 0 24 24" class="ic" aria-hidden="true"><path d="M9 2.5h6M10 2.5v6.5L4.6 18.4A2 2 0 0 0 6.3 21.5h11.4a2 2 0 0 0 1.7-3.1L14 9V2.5"/><path d="M6.5 15.5h11"/></svg></span><span class="t">Crear</span></button></div><div id="tray"></div></div>
    <div class="pane" id="reactPane" hidden></div><div class="pane" id="forgePane" hidden></div></div>
   <div class="tab" id="t-fr"><div class="filt">${[['all', 'Todos'], ['el', 'Elementos'], ['mol', 'Compuestos'], ['med', 'Bio y fármacos'], ['poly', 'Polímeros'], ['hyb', 'Híbridos'], ['org', 'Organismos'], ['tab', 'Tabla periódica']].map(([k, t]) => `<button data-act="filt" data-arg="${k}">${t}</button>`).join('')}</div><div class="scroll" id="frBody"></div></div>
   <div class="tab" id="t-bt"><div class="lvls" id="lvls"></div><div class="scroll" id="mapBody"></div></div>
   <div class="tab" id="t-tx"><div class="scroll" id="txBody"></div></div>
  </main>
  <aside id="side"><div id="comms" data-act="talk"><div class="por" id="cPor"></div><div class="cb"><b id="cWho"></b><p id="cTxt"></p></div><button id="cNext" hidden>▸</button></div><div id="mis"></div><div id="ana"></div></aside></div>
  <div class="ov" id="ov" hidden></div><div id="sortOv" hidden></div><div id="geneOv" hidden></div><div id="orgOv" hidden></div><div id="toast" aria-live="polite"></div>
  <div id="rotate"><div class="phone"></div><h2 class="mega">Gira tu dispositivo</h2><p>Doc Element se juega en horizontal.</p><div class="row"><button class="btn pri" data-act="fs">⛶ Pantalla completa</button><button class="btn gh" data-act="vok">Seguir en vertical</button></div></div>`;
  bindCanvas(); window.addEventListener('resize', resize);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(redraw);
  hud(); setTab('nave'); renderTray(); showLine(['eter', 'neutral', 'Bienvenido a la Ouroboros. Toca una sala de la nave o el botón ▶ de abajo.']); cover(); requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { save(true); if (MUS.ctx) MUS.stop(); } });
  document.addEventListener('pointerdown', () => MUS.start());
  if (window.Capacitor) document.body.classList.add('native', 'vok');
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && !window.Capacitor && !TEST) { const had = !!navigator.serviceWorker.controller; navigator.serviceWorker.register('./sw.js').catch(() => { }); navigator.serviceWorker.addEventListener('controllerchange', () => { if (!had || document.querySelector('.upd')) return; const u = document.createElement('button'); u.className = 'upd'; u.textContent = '✦ Nueva versión de Doc Element lista · toca para actualizar'; u.onclick = () => { save(true); location.reload(); }; document.body.appendChild(u); }); }
}
DE.k = { win, lose, dOf, S: () => S, save, toast, modal, closeModal, sfx, vib, say, talk, renderSide, startChallenge, shareOut, download, hud, Lab, Forge, React: React_, fxBurst, setTab, setMode, clearLab, startProblem, quiet: () => QUIET, MIS: () => MIS, BT: () => BT, SO: () => SO, TAB: () => TAB,
  atomRect: id => { const a = A(id), cv = $('#cv'); if (!a || !cv) return null; const c = cv.getBoundingClientRect(), [x, y] = w2s(a.x, a.y), r = (rad(a) || 30) * Lab.view.z + 6; return { left: c.left + x - r, top: c.top + y - r, width: 2 * r, height: 2 * r }; },
  bondRect: b => { const p = A(b.a), q = A(b.b), cv = $('#cv'); if (!p || !q || !cv) return null; const c = cv.getBoundingClientRect(), [x, y] = w2s((p.x + q.x) / 2, (p.y + q.y) / 2); return { left: c.left + x - 16, top: c.top + y - 16, width: 32, height: 32 }; } };
DE.ui = { openRoom, renderHub, roomLocks, TAB: () => TAB, startChallenge, CH: () => CH, chalSkip, chalEnd, chalList, labEls, cardsHTML, reportCSV, shareOut, MUS, Lab, Forge, React: React_, spawn, spawnMono, tapAtom, tapBond, dropAtom, synth, autoH, clearLab, buildSmiles, addNuc, fuse, rxAdd, rxCoef, react, startProblem, startBattle, throwCard, openProblem, setTab, setMode, closeModal, renderMap, renderFr, renderSide, detail, txLevel, menu, guide, credits, settings, endBattle, sortTap, SO: () => SO,
  guideStep, tick, delSel, undo, flee, failMission, useHint, render: () => { draw(); analysis(); }, quiet: v => { QUIET = !!v; }, ADS, state: () => S, setState: s => { S = D.sanitize(s); S.seen = S.seen || {}; hud(); renderTray(); renderSide(); }, MIS: () => MIS, BT: () => BT, squit: () => ACT.squit(), enterGame, identify, toGraph, KEY, TEST, talk, say };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
