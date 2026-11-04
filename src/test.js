/* ============================================================
   DOC ELEMENT · BOT DE PRUEBAS
   selfTest(): valida datos y que los 100 problemas tengan solución.
   solver():   juega los 10 niveles completos con las mismas funciones de la UI.
   monkey(n):  n partidas con acciones al azar buscando errores e invariantes rotas.
   Uso: menú ☰ → Bot de pruebas · consola: DE.test.monkey(100) · node tools/bot.mjs
   ============================================================ */
'use strict';
(function () {
const D = DE, { DB, NUC, BAT } = D;
const recipe = r => { const it = []; let fl = 0; r.split('+').forEach(t => { const m = t.match(/^(\d+)n$/); if (m) fl = +m[1]; else it.push(t); }); return { it, fl }; };
const elsOf = id => DB.comp[id] ? Object.keys(DB.comp[id].cnt) : [];
function pool(els, L) {
  const S = { el: {}, fr: {}, hyb: {} }; els.forEach(s => S.el[s] = 1);
  for (const id in DB.comp) if (elsOf(id).every(e => els.has(e))) S.fr[id] = 1;
  if (L >= 8) for (const id in DB.poly) if (DB.poly[id].ms.every(m => S.fr[m])) S.fr[id] = 1;
  return D.allCards(S);
}
function simBattle(p, cards) {
  const ph = [BAT.phaseOf(p, 1), p.ph2 ? BAT.phaseOf(p, 2) : null];
  let t = 0;
  for (let k = 0; k < (p.ph2 ? 2 : 1); k++) {
    const hp = p.ph2 ? p.hp / 2 : p.hp;
    const best = cards.map(c => ({ c, d: BAT.eff(c, ph[k]) * 2 * c.pow })).filter(x => x.d > 0).sort((a, b) => b.d - a.d).slice(0, 2);
    if (!best.length) return { ok: false, why: 'sin cartas efectivas en fase ' + (k + 1) };
    t += hp / (best.reduce((s, x) => s + x.d, 0) / BAT.CD);
  }
  const loss = p.dps * t + Math.floor(t / 5) * p.dps * 2;
  return { ok: t <= p.T * 0.75 && loss <= 85, t, loss };
}
function selfTest() {
  const E = [], W = [];
  if (D.ELEMENTS.length !== 119) E.push('Tabla periódica incompleta: ' + (D.ELEMENTS.length - 1));
  DB.errors.forEach(e => E.push('Catálogo: ' + e));
  COMPOUNDS.forEach(r => { const raw = (r[4] || '').split(',').filter(Boolean); if (raw.length !== Object.keys(D.parseTags(r[4])).length) E.push(r[0] + ': etiqueta mal escrita "' + r[4] + '"'); raw.forEach(t => { if (!TAGS[t.replace(/\d$/, '')]) E.push(r[0] + ': etiqueta desconocida ' + t); }); if (!r[5]) E.push(r[0] + ': sin descripción'); });
  POLYMERS.forEach(r => Object.keys(D.parseTags(r[3])).forEach(t => { if (!TAGS[t]) E.push(r[0] + ': etiqueta ' + t); }));
  Object.keys(ELTAGS).forEach(s => Object.keys(D.parseTags(ELTAGS[s])).forEach(t => { if (!TAGS[t]) E.push('ELTAGS ' + s + ': ' + t); }));
  if (LEVELS.length !== 10) E.push('Se esperaban 10 niveles');
  const els = new Set(), nucs = new Set(['p', 'n']); let nb = 0, nf = 0, nm = 0;
  LEVELS.forEach((L, li) => {
    (L.gift || []).forEach(s => els.add(s));
    if (L.P.length !== 10) E.push('Nivel ' + L.n + ': ' + L.P.length + ' problemas');
    if (!L.tx || !L.tx.teo || !L.tx.dato || !L.tx.fic) E.push('Nivel ' + L.n + ': transmisión incompleta');
    L.P.forEach((p, i) => {
      const tag = L.n + '-' + (i + 1) + ' ' + p.t + ': ';
      if (!p.t || !p.d || !(p.T > 0)) E.push(tag + 'texto o tiempo faltante');
      if (p.k === 'm') { nm++; if (!DB.comp[p.id]) E.push(tag + 'compuesto inexistente ' + p.id); else { const miss = elsOf(p.id).filter(e => !els.has(e)); if (miss.length) E.push(tag + 'faltan elementos ' + miss.join(',')); } }
      else if (p.k === 'p') { nm++; const q = DB.poly[p.id]; if (!q) E.push(tag + 'polímero inexistente'); else { if (L.n < 8) E.push(tag + 'polímeros se desbloquean en el nivel 8'); q.ms.forEach(m => elsOf(m).forEach(e => { if (!els.has(e)) E.push(tag + 'monómero sin elemento ' + e); })); } }
      else if (p.k === 'f') {
        nf++; const { it, fl } = recipe(p.r); const ins = it.map(k => NUC.parse(k));
        it.forEach(k => { if (!nucs.has(k)) E.push(tag + 'la receta usa ' + k + ' que aún no se puede tener'); });
        const r = NUC.fuse(ins, fl);
        if (!r.ok) { E.push(tag + 'receta falla: ' + r.msg); return; }
        if (r.prod.z !== p.z || (p.a && r.prod.a !== p.a)) E.push(tag + 'receta da Z' + r.prod.z + ' A' + r.prod.a);
        if (p.isl && r.kind !== 'island') E.push(tag + 'no cae en la isla');
        if (!p.det && r.kind === 'shv') E.push(tag + 'producto inestable');
        if (-r.net > CFG.MAX_ENERGY) E.push(tag + 'cuesta más energía que el máximo');
        if (r.kind !== 'shv') { nucs.add(NUC.key(r.prod.z, r.prod.a)); const s = D.elem(r.prod.z).sym; if (D.SYM[s] || r.prod.z === 126) els.add(s); }
      } else if (p.k === 'b') {
        nb++; [p.w, p.h, p.ph2 && p.ph2.w, p.ph2 && p.ph2.h].filter(Boolean).forEach(s => Object.keys(D.parseTags(s)).forEach(t => { if (!TAGS[t]) E.push(tag + 'etiqueta ' + t); }));
        if (!(p.hp > 0 && p.dps > 0) || !p.sc) E.push(tag + 'datos de batalla incompletos');
        const cards = pool(els, L.n), r = simBattle(p, cards);
        if (!r.ok) E.push(tag + 'no se puede ganar con lo disponible (' + (r.why || 't=' + r.t.toFixed(1) + 's, daño ' + r.loss.toFixed(0) + '%') + ')');
        const eff = cards.filter(c => BAT.eff(c, BAT.phaseOf(p, 1)) > 0);
        if (eff.length < 2) W.push(tag + 'solo ' + eff.length + ' carta efectiva');
      } else E.push(tag + 'tipo desconocido ' + p.k);
    });
  });
  return { ok: !E.length, errors: E, warnings: W, stats: Object.keys(DB.comp).length + ' compuestos · ' + Object.keys(DB.poly).length + ' polímeros · ' + nm + ' síntesis · ' + nf + ' forjas · ' + nb + ' batallas' };
}

/* juega todo el contenido como lo haría una persona que sabe la respuesta */
function prep(U, S, p) { // antes de una batalla crea las mejores cartas posibles con lo descubierto
  const els = new Set(D.labElements(S)), L = S.cur, ph = [BAT.phaseOf(p, 1), p.ph2 ? BAT.phaseOf(p, 2) : null].filter(Boolean);
  const best = pool(els, L).map(c => ({ c, v: Math.max(...ph.map(q => BAT.eff(c, q))) * c.pow })).filter(x => x.v > 0).sort((a, b) => b.v - a.v).slice(0, 4);
  best.forEach(({ c }) => {
    if (S.fr[c.id] || c.kind === 'el') return; U.clearLab(true);
    if (c.kind === 'mol') U.buildSmiles(DB.comp[c.id].smiles[0]);
    else { const ms = DB.poly[c.id].ms; U.Lab.sel = null; for (let q = 0; q < Math.max(3, ms.length * 2); q++) U.spawnMono(ms[q % ms.length]); }
    U.synth();
  });
  U.clearLab(true);
}
function solver() {
  const U = D.ui, keep = JSON.stringify(U.state()), out = { solved: 0, failed: [], farm: 0 };
  U.quiet(true);
  try {
    const S0 = D.newState(); S0.intro = 1; U.setState(S0); U.clearLab(true);
    for (const L of LEVELS) {
      U.state().cur = L.n;
      L.P.forEach((p, i) => {
        const S = U.state(), k = D.pk(L.n, i);
        try {
          if (p.k === 'b') {
            prep(U, S, p);
            U.startProblem(L.n, i); const cards = D.allCards(S);
            const score = c => Math.max(BAT.eff(c, BAT.phaseOf(p, 1)), p.ph2 ? BAT.eff(c, BAT.phaseOf(p, 2)) : 0) * c.pow;
            const ids = cards.sort((a, b) => score(b) - score(a)).slice(0, 4).map(c => c.id);
            U.startBattle(L.n, i, ids);
            for (let s = 0; s < 3000 && U.BT(); s++) { const b = U.BT().b; b.deck.forEach((c, q) => { if (U.BT() && BAT.eff(c, b.ph) > 0) U.throwCard(q); }); U.tick(0.1); }
          } else {
            U.startProblem(L.n, i); U.clearLab(true);
            if (p.k === 'm') { U.buildSmiles(DB.comp[p.id].smiles[0]); U.synth(); }
            else if (p.k === 'p') { const ms = DB.poly[p.id].ms; U.Lab.sel = null; for (let q = 0; q < Math.max(3, ms.length * 2); q++) U.spawnMono(ms[q % ms.length]); U.synth(); }
            else {
              const { it, fl } = recipe(p.r), need = -NUC.fuse(it.map(x => NUC.parse(x)), fl).net;
              while (S.en < need) { U.Forge.slots = ['D', 'D', null]; U.Forge.flux = 0; U.fuse(); out.farm++; if (out.farm > 5000) throw new Error('granja infinita'); }
              U.Forge.slots = [it[0] || null, it[1] || null, it[2] || null]; U.Forge.flux = fl; U.fuse();
            }
          }
        } catch (e) { out.failed.push(L.n + '-' + (i + 1) + ' excepción: ' + e.message); }
        if (U.MIS()) { out.failed.push(L.n + '-' + (i + 1) + ' misión sin completar'); U.failMission('bot'); }
        if (S.prog[k]) out.solved++; else if (!out.failed.some(f => f.startsWith(L.n + '-' + (i + 1) + ' '))) out.failed.push(L.n + '-' + (i + 1) + ' sin resolver');
        U.closeModal();
      });
      if (L.n < 10 && U.state().unl !== L.n + 1) out.failed.push('No se abrió el nivel ' + (L.n + 1));
    }
    out.eternio = !!U.state().eternio; out.stars = D.totalStars(U.state());
  } finally { U.quiet(false); U.setState(JSON.parse(keep)); U.clearLab(true); U.closeModal(); }
  return out;
}

/* partidas aleatorias */
function monkey(n, seed) {
  const U = D.ui, r = D.mulberry(seed || 1), keep = JSON.stringify(U.state()), errors = [];
  const pickA = a => a[Math.floor(r() * a.length)];
  let actions = 0; U.quiet(true);
  const elsAll = ['H', 'C', 'N', 'O', 'F', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ca', 'Fe', 'Cu', 'He', 'Li', 'Ar', 'U', 'Pb'];
  const ACTS = {
    spawn: () => U.spawn(pickA(D.labElements(U.state()))),
    tapAtom: () => { const a = pickA(U.Lab.atoms); if (a) U.tapAtom(a.id); },
    tapBond: () => { const b = pickA(U.Lab.bonds); if (b) U.tapBond(b); },
    synth: () => U.synth(), autoH: () => U.autoH(), undo: () => U.undo(), del: () => { const a = pickA(U.Lab.atoms); if (a) { U.Lab.sel = a.id; U.delSel(); } },
    mono: () => { const m = Object.keys(U.state().fr).filter(id => DB.comp[id] && DB.comp[id].mono); if (m.length) U.spawnMono(pickA(m)); },
    smiles: () => { const c = pickA(Object.values(DB.comp)); U.buildSmiles(pickA(c.smiles)); if (r() < .7) U.synth(); },
    problem: () => { const S = U.state(), L = 1 + Math.floor(r() * S.unl), i = Math.floor(r() * 10); if (D.problemOpen(S, L, i)) U.startProblem(L, i); },
    battle: () => { const S = U.state(), L = 1 + Math.floor(r() * S.unl), i = Math.floor(r() * 10), p = LEVELS[L - 1].P[i]; if (p.k === 'b' && D.problemOpen(S, L, i)) U.startBattle(L, i, D.allCards(S).slice(0, 4).map(c => c.id)); },
    throw: () => { if (U.BT()) U.throwCard(Math.floor(r() * 4)); },
    tick: () => U.tick(r() * 3),
    fuse: () => { const ks = Object.keys(U.state().nuc); U.Forge.slots = [pickA(ks), r() < .8 ? pickA(ks) : null, r() < .4 ? pickA(ks) : null]; U.Forge.flux = r() < .5 ? 0 : Math.floor(r() * 40); U.fuse(); },
    tab: () => U.setTab(pickA(['lab', 'fr', 'bt', 'tx'])), mode: () => U.setMode(pickA(['mol', 'forge'])),
    detail: () => { const S = U.state(), ids = [...Object.keys(S.fr), ...Object.keys(S.el).map(s => 'el:' + s)]; if (ids.length) U.detail(pickA(ids)); },
    modal: () => pickA([U.menu, U.guide, U.credits, U.settings, () => U.txLevel(1 + Math.floor(r() * 10))])(),
    close: () => U.closeModal(), render: () => U.render(), flee: () => U.flee(),
    abandon: () => { if (U.MIS()) U.failMission('bot'); }
  };
  const names = Object.keys(ACTS), weights = { spawn: 9, tapAtom: 6, tapBond: 3, synth: 4, autoH: 2, smiles: 2, tick: 5, throw: 5, fuse: 4 };
  const bag = names.flatMap(k => Array(weights[k] || 1).fill(k));
  try {
    for (let g = 0; g < n; g++) {
      const S0 = D.newState(); S0.intro = 1; S0.unl = 1 + Math.floor(r() * 10); S0.cur = S0.unl;
      for (let L = 1; L < S0.unl; L++) for (let i = 0; i < 10; i++) S0.prog[D.pk(L, i)] = 1 + Math.floor(r() * 3);
      elsAll.forEach(s => { if (r() < .6 || s === 'H' || s === 'O') S0.el[s] = 1; });
      ['D', 'He4', 'C12', 'O16', 'Fe56', 'Ru102', 'Pb204', 'U238'].forEach(k => { if (r() < .5) S0.nuc[k] = 1; });
      Object.keys(DB.comp).forEach(id => { if (r() < .25) S0.fr[id] = { c: 1, t: g }; });
      S0.en = Math.floor(r() * 999); S0.set.sandbox = r() < .2 ? 1 : 0;
      U.setState(S0); U.clearLab(true); U.closeModal();
      for (let a = 0; a < 160; a++) {
        const act = pickA(bag); actions++;
        try { ACTS[act](); } catch (e) { errors.push('partida ' + g + ' acción ' + a + ' ' + act + ': ' + e.message); if (errors.length > 40) throw new Error('demasiados errores'); }
        if (a % 20 === 19) {
          const S = U.state(), bad = [];
          if (!Number.isFinite(S.en) || S.en < 0 || S.en > CFG.MAX_ENERGY) bad.push('energía ' + S.en);
          if (!Number.isFinite(S.sc)) bad.push('puntaje');
          U.Lab.bonds.forEach(b => { const x = U.Lab.atoms.find(q => q.id === b.a), y = U.Lab.atoms.find(q => q.id === b.b); if (!x || !y) bad.push('enlace huérfano'); else if (!x.mono && (b.o < 1 || b.o > 3)) bad.push('orden ' + b.o); });
          U.Lab.atoms.forEach(q => { if (!Number.isFinite(q.x) || !Number.isFinite(q.y)) bad.push('posición NaN'); if (!q.mono) { const s = U.Lab.bonds.reduce((t, b) => t + (b.a === q.id || b.b === q.id ? b.o : 0), 0); if (s > D.maxVal(q.el)) bad.push(q.el + ' con ' + s + ' enlaces'); } });
          try { const j = D.sanitize(JSON.parse(JSON.stringify(S))); if (j.v !== 1) bad.push('guardado'); } catch (e) { bad.push('JSON ' + e.message); }
          if (bad.length) errors.push('partida ' + g + ' acción ' + a + ': ' + [...new Set(bad)].join(', '));
        }
      }
      if (U.BT()) { U.flee(); U.tick(.1); }
      if (U.MIS()) U.failMission('bot');
    }
  } catch (e) { errors.push('abortado: ' + e.message); }
  finally { U.quiet(false); U.setState(JSON.parse(keep)); U.clearLab(true); U.closeModal(); }
  return { games: n, actions, errors };
}
DE.test = { selfTest, solver, monkey, simBattle };
})();
