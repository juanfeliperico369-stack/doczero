/* ============================================================
   DOC ELEMENT · SALA DE GENÉTICA (Temporada 3)
   pair: completar la doble hélice (A–T, G–C) · rna: transcribir (A→U)
   fix: encontrar y corregir mutaciones (o editar hacia un objetivo) · trad: traducir codones
   ============================================================ */
'use strict';
(function () {
const K = () => DE.k, $ = s => document.querySelector(s), esc = DE.esc;
const COL = { A: '#2dffb3', T: '#ff2fb3', U: '#ffc23a', G: '#39c8ff', C: '#c77dff' };
let GN = null;
const tile = (b, cls, act, arg) => `<${act ? 'button' : 'span'} class="gt ${cls || ''}" style="--b:${COL[b] || '#333'}"${act ? ` data-act="${act}" data-arg="${arg}"` : ''}>${b}</${act ? 'button' : 'span'}>`;
const strand = (s, f) => '<div class="strand">' + s.split('').map((b, i) => (i && i % 3 === 0 ? '<i class="gap"></i>' : '') + f(b, i)).join('') + '</div>';
function start(L, i) {
  const p = LEVELS[L - 1].P[i], k = K(), st = { L, i, p, t: p.T, T: p.T, errs: 0, pos: 0, sel: null };
  if (p.mode === 'pair' || p.mode === 'rna') { st.seq = p.seq || GENE.seq(p.n, L * 977 + i * 31); st.tgt = GENE.comp(st.seq, p.mode === 'rna'); st.ans = ''; }
  else if (p.mode === 'fix') { st.goal = p.tgt || p.ref; st.pat = p.pat.split(''); }
  else { st.cod = p.mrna.match(/.../g); st.ans = []; st.table = k.dOf(L).g >= 1; const r = DE.mulberry(L * 131 + i * 7), all = Object.keys(GENE.AA), n = k.dOf(L).g >= 1 ? 4 : 6;
    st.opts = st.cod.map(c => { const o = [GENE.aa(c)]; while (o.length < n) { const x = all[Math.floor(r() * all.length)]; if (!o.includes(x)) o.push(x); } for (let q = o.length - 1; q > 0; q--) { const j = Math.floor(r() * (q + 1)); [o[q], o[j]] = [o[j], o[q]]; } return o; }); }
  GN = st; $('#geneOv').hidden = false; render(); k.sfx('tap');
}
function render() {
  if (!GN) return; const p = GN.p, el = $('#geneOv'); let body = '';
  if (p.mode === 'pair' || p.mode === 'rna') {
    const bases = p.mode === 'rna' ? 'AUGC' : 'ATGC';
    body = `<div class="rule">${p.mode === 'rna' ? 'ADN → ARN: <b>A→U</b> · <b>T→A</b> · <b>G→C</b> · <b>C→G</b>' : 'Parejas: <b>A ↔ T</b> · <b>G ↔ C</b>'}</div>
      <div class="lbl">Hebra de ADN</div>${strand(GN.seq, (b, i) => tile(b, i === GN.pos ? 'cur' : ''))}
      <div class="lbl">${p.mode === 'rna' ? 'Tu ARN' : 'Tu hebra'}</div>${strand(GN.tgt, (b, i) => i < GN.pos ? tile(b, 'ok') : i === GN.pos ? '<span class="gt next">?</span>' : '<span class="gt empty">·</span>')}
      <div class="bases">${bases.split('').map(b => `<button class="gb" style="--b:${COL[b]}" data-act="gnTap" data-arg="${b}">${b}</button>`).join('')}</div>`;
  } else if (p.mode === 'fix') {
    const d = GN.pat.map((b, i) => b !== GN.goal[i]);
    body = `<div class="lbl">${p.tgt ? 'Objetivo (gen editado)' : 'Gen sano'}</div>${strand(GN.goal, b => tile(b, 'dim'))}
      <div class="lbl">Gen del paciente · toca la letra distinta</div>${strand(GN.pat.join(''), (b, i) => tile(b, (GN.sel === i ? 'cur' : '') + (d[i] ? '' : ' same'), 'gnSel', i))}
      <div class="m sm">Faltan ${d.filter(Boolean).length} letra(s) por corregir.</div>
      ${GN.sel != null ? `<div class="bases">${'ATGC'.split('').map(b => `<button class="gb" style="--b:${COL[b]}" data-act="gnBase" data-arg="${b}">${b}</button>`).join('')}</div>` : ''}`;
  } else {
    const c = GN.cod[GN.pos];
    body = `<div class="lbl">ARN mensajero · se lee de tres en tres</div><div class="strand">${GN.cod.map((x, i) => `<span class="cod ${i === GN.pos ? 'cur' : i < GN.pos ? 'ok' : ''}">${x.split('').map(b => tile(b)).join('')}</span>`).join('')}</div>
      <div class="lbl">Tu proteína</div><div class="chain">${GN.ans.map(a => `<span class="aa">${a === '*' ? 'FIN' : a}</span>`).join('<i>–</i>') || '<span class="m">…</span>'}</div>
      ${c ? `<div class="lbl">¿Qué significa <b>${c}</b>?</div><div class="opts">${GN.opts[GN.pos].map(a => `<button class="btn gh" data-act="gnAA" data-arg="${a}"><b>${a === '*' ? '■' : a}</b> ${esc(GENE.AA[a])}</button>`).join('')}</div>` : ''}
      ${GN.table ? table(c) : ''}`;
  }
  el.innerHTML = `<div class="bt-top"><span class="mega">⚭ ${esc(p.t)}</span><span class="m">Errores ${GN.errs}</span><span class="tm" id="gnT">${Math.ceil(GN.t)}</span>${p.mode === 'trad' ? `<button class="btn gh sm" data-act="gnTable">📖 ${GN.table ? 'Ocultar' : 'Tabla ⚡10'}</button>` : ''}<button class="btn gh sm" data-act="gnQuit">Salir</button></div><div class="gbody"><p class="m sm">${esc(p.d)}</p>${body}</div>`;
}
function table(hl) {
  let h = '<div class="ctab">'; const B = 'UCAG';
  for (const a of B) for (const c of B) { h += '<div class="crow">'; for (const b of B) { const cod = a + b + c, x = GENE.aa(cod); h += `<span class="${cod === hl ? 'hot' : ''}">${cod} <b>${x === '*' ? '■' : x}</b></span>`; } h += '</div>'; }
  return h + '</div>';
}
function wrong(msg) { const k = K(); GN.errs++; GN.t = Math.max(0, GN.t - 3); k.sfx('bad'); k.vib(60); if (msg) k.toast(msg, 'bad'); const b = $('#geneOv .gbody'); if (b) { b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); } render(); }
function right() { const k = K(); k.sfx('bond'); k.vib(10); render(); }
function done() {
  const g = GN, k = K(); GN = null; $('#geneOv').hidden = true; const used = 1 - Math.max(0, g.t) / g.T;
  const stars = g.late ? 1 : g.errs === 0 && used <= .4 ? 3 : used <= .7 && g.errs <= 2 ? 2 : 1;
  k.say('win'); k.win(g.L, g.i, stars, Math.max(0, Math.round(g.t)) * 2);
}
function tap(b) { if (!GN) return; if (b === GN.tgt[GN.pos]) { GN.pos++; if (GN.pos >= GN.tgt.length) return done(); right(); } else wrong(GN.p.mode === 'rna' ? 'Frente a ' + GN.seq[GN.pos] + ' va ' + GN.tgt[GN.pos] + ' (en el ARN la T se cambia por U)' : 'Frente a ' + GN.seq[GN.pos] + ' siempre va ' + GN.tgt[GN.pos]); }
function sel(i) { if (!GN) return; i = +i; if (GN.pat[i] === GN.goal[i]) return wrong('Esa letra ya está bien: busca la diferente'); GN.sel = i; K().sfx('tap'); render(); }
function base(b) { if (!GN || GN.sel == null) return; if (b !== GN.goal[GN.sel]) return wrong('Mira la letra de arriba en esa misma posición'); GN.pat[GN.sel] = b; GN.sel = null; if (GN.pat.join('') === GN.goal) return done(); right(); }
function aa(x) { if (!GN) return; const c = GN.cod[GN.pos]; if (x !== GENE.aa(c)) return wrong(c + ' no es ' + GENE.AA[x]); GN.ans.push(x); GN.pos++; if (GN.pos >= GN.cod.length) return done(); right(); }
function tick(dt) {
  if (!GN) return; GN.t -= dt; const e = $('#gnT'); if (e) e.textContent = Math.max(0, Math.ceil(GN.t));
  if (GN.t <= 0 && !GN.late) { const k = K(); if (k.dOf(GN.L).fail) { const g = GN; GN = null; $('#geneOv').hidden = true; k.lose(g.L, g.i, 'Se acabó el tiempo.', 'Recuerda: A con T, G con C, y en el ARN la T se cambia por U. Los codones se leen de tres en tres.'); } else GN.late = true; }
}
function quit() { if (!GN) return; const g = GN, k = K(); GN = null; $('#geneOv').hidden = true; k.lose(g.L, g.i, 'Saliste de la sala de genética.', 'Ve despacio: una letra a la vez.'); }
function toggleTable() { if (!GN) return; const k = K(); if (!GN.table) { if (k.dOf(GN.L).g < 1) { if (k.S().en < 10) return k.toast('Necesitas ⚡10', 'bad'); k.S().en -= 10; k.hud(); } GN.table = true; } else GN.table = false; render(); }
/* solución automática (para el bot y el validador) */
function solve() { let n = 0; while (GN && n++ < 400) { if (GN.p.mode === 'pair' || GN.p.mode === 'rna') tap(GN.tgt[GN.pos]); else if (GN.p.mode === 'fix') { const i = GN.pat.findIndex((b, j) => b !== GN.goal[j]); sel(i); base(GN.goal[i]); } else aa(GENE.aa(GN.cod[GN.pos])); } }
DE.ACTX = DE.ACTX || {};
Object.assign(DE.ACTX, { gnTap: b => tap(b), gnSel: i => sel(i), gnBase: b => base(b), gnAA: x => aa(x), gnQuit: () => quit(), gnTable: () => toggleTable() });
DE.genes = { start, tick, solve, tap, sel, base, aa, quit, active: () => !!GN, state: () => GN };
})();
