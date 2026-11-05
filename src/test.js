/* ============================================================
   DOC ELEMENT · BOT DE PRUEBAS
   selfTest(): valida datos y que los 100 problemas tengan solución con lo que el jugador puede tener.
   solver():   juega los 10 niveles con las funciones de la UI; en niveles guiados sigue la guía paso a paso.
   monkey(n):  n partidas con acciones al azar buscando errores e invariantes rotas.
   Uso: menú ☰ → Bot de pruebas · consola: DE.test.monkey(100) · node tools/bot.mjs
   ============================================================ */
'use strict';
(function () {
const D = DE, { DB, NUC, BAT, REACT, SORT } = D;
const recipe = r => { const it = []; let fl = 0; r.split('+').forEach(t => { const m = t.match(/^(\d+)n$/); if (m) fl = +m[1]; else it.push(t); }); return { it, fl }; };
const elsOf = id => DB.comp[id] ? Object.keys(DB.comp[id].cnt) : [];
function pool(els, L, made) {
  const S = { el: {}, fr: {}, hyb: {} }; els.forEach(s => S.el[s] = 1);
  for (const id in DB.comp) if (elsOf(id).every(e => els.has(e)) || (made && made.has(id))) S.fr[id] = 1;
  if (L >= 8) for (const id in DB.poly) if (DB.poly[id].ms.every(m => S.fr[m])) S.fr[id] = 1;
  return D.allCards(S);
}
const launchable = c => c.kind === 'mol' || c.kind === 'poly' || (c.kind === 'el' && !['nonm', 'hal'].includes(D.catOf(D.SYM[c.f] || 1)));
const buildT = c => c.kind === 'el' ? BAT.build(1, 0) : c.kind === 'poly' ? BAT.build(3, 0) : BAT.build(c.heavy || 1, c.hasH);
/* simulación voraz de la batalla "síntesis bajo presión": munición primero, luego construir lo más rentable */
function simBattle(p, cards, L) {
  const ph = [BAT.phaseOf(p, 1), p.ph2 ? BAT.phaseOf(p, 2) : null], rg = (DIFF[L - 1].rg || 0) * (p.boss ? 1.5 : 1), uses = {};
  let t = 0, hp = p.hp, k = 0;
  const ammo = cards.map(c => ({ c, e: BAT.eff(c, ph[0]) })).filter(x => x.e > 0).sort((a, b) => b.e * b.c.pow - a.e * a.c.pow).slice(0, 2);
  if (ammo.length) { hp -= ammo.reduce((s, x) => s + BAT.AMMO * x.e * BAT.AMMO_MUL * x.c.pow, 0); t += BAT.AMMO * BAT.CD; hp += rg * t; }
  if (p.ph2 && hp <= p.hp / 2) k = 1;
  const syn = cards.filter(launchable);
  for (let g = 0; hp > 0 && t < p.T * 2 && g < 400; g++) {
    let best = null, bv = 0;
    for (const c of syn) { const e = BAT.eff(c, ph[k]); if (e <= 0) continue; const bt = buildT(c), f = BAT.fatigue(uses[c.id]), v = e * BAT.SYN * BAT.cpow(c) * f / bt; if (v > bv) { bv = v; best = { c, e, bt, f }; } }
    if (!best) return { ok: false, why: 'nada que construir sirve en la fase ' + (k + 1), t, loss: 0 };
    t += best.bt; hp += rg * best.bt; hp -= best.e * BAT.SYN * BAT.cpow(best.c) * best.f; uses[best.c.id] = (uses[best.c.id] || 0) + 1;
    if (p.ph2 && k === 0 && hp <= p.hp / 2) k = 1;
  }
  const loss = p.dps * t + Math.floor(t / 5) * p.dps * 2;
  return { ok: hp <= 0 && t <= p.T * 0.85 && loss <= 85, t, loss };
}
function selfTest() {
  const E = [], W = [];
  if (D.ELEMENTS.length !== 119) E.push('Tabla periódica incompleta: ' + (D.ELEMENTS.length - 1));
  DB.errors.forEach(e => E.push('Catálogo: ' + e)); REACT.errors.forEach(e => E.push('Reacción: ' + e));
  COMPOUNDS.forEach(r => { const raw = (r[4] || '').split(',').filter(Boolean); if (raw.length !== Object.keys(D.parseTags(r[4])).length) E.push(r[0] + ': etiqueta mal escrita "' + r[4] + '"'); raw.forEach(t => { if (!TAGS[t.replace(/\d$/, '')]) E.push(r[0] + ': etiqueta desconocida ' + t); }); if (!r[5]) E.push(r[0] + ': sin descripción'); });
  POLYMERS.forEach(r => Object.keys(D.parseTags(r[3])).forEach(t => { if (!TAGS[t]) E.push(r[0] + ': etiqueta ' + t); }));
  Object.keys(ELTAGS).forEach(s => Object.keys(D.parseTags(ELTAGS[s])).forEach(t => { if (!TAGS[t]) E.push('ELTAGS ' + s + ': ' + t); }));
  if (LEVELS.length % 10 || DIFF.length !== LEVELS.length || LEVELS.some((L, i) => L.n !== i + 1)) E.push('Niveles y dificultades no cuadran');
  Object.keys(DIALOG).forEach(k => DIALOG[k].forEach(l => { if (!['doc', 'eter'].includes(l[0]) || !l[2]) E.push('Diálogo ' + k + ' mal formado'); }));
  [...STORY.intro, ...STORY.ending, ...(STORY.s2i || []), ...(STORY.s2e || [])].forEach(l => { if (l.length !== 4) E.push('Historia mal formada: ' + l[2]); });
  const els = new Set(), nucs = new Set(['p', 'n']), made = new Set(); const n = { m: 0, f: 0, b: 0, r: 0, s: 0, p: 0 };
  LEVELS.forEach(L => {
    (L.gift || []).forEach(s => els.add(s));
    if (L.P.length !== 10) E.push('Nivel ' + L.n + ': ' + L.P.length + ' problemas');
    if (!L.tx || !L.tx.teo || !L.tx.dato || !L.tx.fic) E.push('Nivel ' + L.n + ': transmisión incompleta');
    if (!L.talk || !L.talk.length) W.push('Nivel ' + L.n + ': sin diálogo de entrada');
    L.P.forEach((p, i) => {
      const tag = L.n + '-' + (i + 1) + ' ' + p.t + ': '; n[p.k] = (n[p.k] || 0) + 1;
      if (!p.t || !p.d || !(p.T > 0)) E.push(tag + 'texto o tiempo faltante');
      const can = id => id[0] === '@' ? els.has(id.slice(1)) : (DB.comp[id] && (elsOf(id).every(e => els.has(e)) || made.has(id)));
      if (p.k === 'm') { if (!DB.comp[p.id]) E.push(tag + 'compuesto inexistente ' + p.id); else { const miss = elsOf(p.id).filter(e => !els.has(e)); if (miss.length) E.push(tag + 'faltan elementos ' + miss.join(',')); made.add(p.id); } }
      else if (p.k === 'p') { const q = DB.poly[p.id]; if (!q) E.push(tag + 'polímero inexistente'); else { if (L.n < 8) E.push(tag + 'polímeros se desbloquean en el nivel 8'); q.ms.forEach(m => { if (!can(m)) E.push(tag + 'monómero imposible ' + m); }); } }
      else if (p.k === 'r') {
        const rx = REACT.rx[p.id]; if (!rx) { E.push(tag + 'reacción inexistente ' + p.id); return; }
        rx.L.forEach(([, x]) => { if (!can(x)) E.push(tag + 'reactivo imposible todavía: ' + x); });
        if (-REACT.energy(rx) > CFG.MAX_ENERGY) E.push(tag + 'cuesta demasiada energía');
        rx.R.forEach(([, x]) => { if (x[0] === '@') els.add(x.slice(1)); else made.add(x); });
      } else if (p.k === 's') {
        if (!(p.n >= 2 && p.n <= 8) || !p.mix || p.mix.length < p.n) E.push(tag + 'destilación mal definida');
        (p.mix || []).forEach(x => { if (!DB.comp[x]) E.push(tag + 'sustancia inexistente ' + x); });
        for (let f = 0; f < 3; f++) if (!SORT.gen(p.n, L.n * 1000 + i * 17 + f)) E.push(tag + 'puzzle sin solución (semilla ' + f + ')');
      } else if (p.k === 'f') {
        const { it, fl } = recipe(p.r), ins = it.map(k => NUC.parse(k));
        it.forEach(k => { if (!nucs.has(k)) E.push(tag + 'la receta usa ' + k + ' que aún no se puede tener'); });
        const r = NUC.fuse(ins, fl);
        if (!r.ok) { E.push(tag + 'receta falla: ' + r.msg); return; }
        if (r.prod.z !== p.z || (p.a && r.prod.a !== p.a)) E.push(tag + 'receta da Z' + r.prod.z + ' A' + r.prod.a);
        if (p.isl && r.kind !== 'island') E.push(tag + 'no cae en la isla');
        if (!p.det && r.kind === 'shv') E.push(tag + 'producto inestable');
        if (-r.net > CFG.MAX_ENERGY) E.push(tag + 'cuesta más energía que el máximo');
        if (r.kind !== 'shv') { nucs.add(NUC.key(r.prod.z, r.prod.a)); const s = D.elem(r.prod.z).sym; if (D.SYM[s] || r.prod.z === 126) els.add(s); }
      } else if (p.k === 'b') {
        [p.w, p.h, p.ph2 && p.ph2.w, p.ph2 && p.ph2.h].filter(Boolean).forEach(s => Object.keys(D.parseTags(s)).forEach(t => { if (!TAGS[t]) E.push(tag + 'etiqueta ' + t); }));
        if (!(p.hp > 0 && p.dps > 0) || !p.sc) E.push(tag + 'datos de batalla incompletos');
        const cards = pool(els, L.n, made), r = simBattle(p, cards, L.n);
        if (!r.ok) E.push(tag + 'no se puede ganar con lo disponible (' + (r.why || 't=' + r.t.toFixed(1) + 's, daño ' + r.loss.toFixed(0) + '%') + ')');
        const eff = cards.filter(c => BAT.eff(c, BAT.phaseOf(p, 1)) > 0);
        if (eff.length < 2) W.push(tag + 'solo ' + eff.length + ' carta efectiva');
      } else E.push(tag + 'tipo desconocido ' + p.k);
    });
  });
  if (D.ui && D.ui.chalList) for (let sd = 1; sd <= 40; sd++) { const l = D.ui.chalList(sd * 7919); if (l.length !== 5 || new Set(l).size !== 5 || l.some(id => !DB.comp[id])) E.push('Reto con semilla ' + sd + ' mal formado'); }
  if (D.net) { try { const sdp = 'v=0\r\na=ice-ufrag:abcd\r\na=ice-pwd:0123456789abcdefghijklmn\r\na=fingerprint:sha-256 ' + Array.from({ length: 32 }, (_, i) => ((i * 37) & 255).toString(16).padStart(2, '0').toUpperCase()).join(':') + '\r\na=candidate:1 1 udp 2122260223 192.168.1.20 50000 typ host generation 0\r\n', c = D.net.pack({ type: 'offer', sdp }), u = D.net.unpack(c); if (!/192\.168\.1\.20 50000/.test(u.sdp) || !/ice-pwd:0123456789abcdefghijklmn/.test(u.sdp) || !u.sdp.includes(sdp.match(/sha-256 (\S+)/)[1])) E.push('Código LAN no reconstruye la sesión'); const bt = D.net.btDecode(D.net.btEncode(4242, 83.4)); if (bt.seed !== 4242 || bt.el !== 83.4) E.push('Código Bluetooth no reconstruye el reto'); } catch (e) { E.push('Códigos de duelo: ' + e.message); } }
  return { ok: !E.length, errors: E, warnings: W, stats: Object.keys(DB.comp).length + ' compuestos · ' + Object.keys(DB.poly).length + ' polímeros · ' + Object.keys(REACT.rx).length + ' reacciones · ' + n.m + ' síntesis · ' + n.r + ' reacciones · ' + n.f + ' forjas · ' + n.p + ' polímeros · ' + n.s + ' destilaciones · ' + n.b + ' batallas' };
}

/* juega como una persona que sabe la respuesta */
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
function farm(U, S, need, out) { while (S.en < need) { U.Forge.slots = ['D', 'D', null]; U.Forge.flux = 0; U.fuse(); out.farm++; if (out.farm > 6000) throw new Error('granja infinita'); } }
function guided(U, out) { // sigue la guía de la UI sin conocer la molécula
  for (let s = 0; s < 200 && U.MIS(); s++) {
    const st = U.guideStep(); if (!st) return;
    if (st.k === 'place') U.spawn(st.el);
    else if (st.k === 'bond') U.tapBond(st.bond);
    else if (st.k === 'link') { U.Lab.sel = st.a; U.tapAtom(st.b); }
    else if (st.k === 'autoH') U.autoH();
    else if (st.k === 'synth') { U.synth(); out.guided++; return; }
    else return;
  }
}
function fight(U, S, out) { // batalla: munición primero; luego construir y lanzar (guía en niveles guiados)
  for (let s = 0; s < 500 && U.BT(); s++) {
    const b = U.BT().b;
    b.deck.forEach((c, q) => { if (U.BT() && BAT.eff(c, b.ph) > 0 && b.ammo[c.id] > 0) U.throwCard(q); });
    if (!U.BT()) break;
    if (U.Lab.ghost) { // sigue el plano sugerido, como un niño
      const st = U.guideStep(); if (!st) { U.tick(.3); continue; }
      if (st.k === 'place') U.spawn(st.el); else if (st.k === 'bond') U.tapBond(st.bond); else if (st.k === 'link') { U.Lab.sel = st.a; U.tapAtom(st.b); } else if (st.k === 'autoH') U.autoH(); else if (st.k === 'synth') { U.synth(); out.launches++; }
      U.tick(.35); continue;
    }
    const els = new Set(U.labEls()), cand = [];
    for (const id in DB.comp) if (!DB.comp[id].s2 && Object.keys(DB.comp[id].cnt).every(e => els.has(e))) cand.push(D.cardFromId(S, id));
    Object.keys(S.el).forEach(x => { if (S.el[x] === 1 && els.has(x)) { const c = D.cardFromId(S, 'el:' + x); if (launchable(c) && Object.keys(c.tags).length) cand.push(c); } });
    if (S.unl >= 8) for (const id in DB.poly) if (DB.poly[id].ms.every(m => S.fr[m])) cand.push(D.cardFromId(S, id));
    let best = null, bv = 0;
    cand.forEach(c => { const e = BAT.eff(c, b.ph); if (e <= 0) return; const v = e * BAT.cpow(c) * BAT.fatigue(b.uses[c.id]) / buildT(c); if (v > bv) { bv = v; best = c; } });
    if (!best) { U.tick(1); continue; }
    U.clearLab(true);
    if (best.kind === 'el') U.spawn(best.f); else if (best.kind === 'poly') { U.Lab.sel = null; const ms = DB.poly[best.id].ms; for (let q = 0; q < Math.max(3, ms.length * 2); q++) U.spawnMono(ms[q % ms.length]); } else U.buildSmiles(DB.comp[best.id].smiles[0]);
    U.synth(); out.launches++; U.tick(buildT(best));
  }
}
function solver() {
  const U = D.ui, keep = JSON.stringify(U.state()), out = { solved: 0, failed: [], farm: 0, guided: 0, launches: 0 };
  U.quiet(true);
  try {
    const S0 = D.newState(); S0.intro = 1; U.setState(S0); U.clearLab(true);
    for (const L of LEVELS) {
      U.state().cur = L.n;
      L.P.forEach((p, i) => {
        const S = U.state(), k = D.pk(L.n, i), tag = L.n + '-' + (i + 1) + ' ';
        try {
          if (p.k === 'b') {
            prep(U, S, p); U.startProblem(L.n, i); const cards = D.allCards(S);
            const score = c => Math.max(BAT.eff(c, BAT.phaseOf(p, 1)), p.ph2 ? BAT.eff(c, BAT.phaseOf(p, 2)) : 0) * c.pow;
            U.startBattle(L.n, i, cards.sort((a, b) => score(b) - score(a)).slice(0, 4).map(c => c.id));
            fight(U, S, out);
          } else if (p.k === 's') {
            U.startProblem(L.n, i); const so = U.SO(); if (!so) throw new Error('no abrió la destilación');
            so.sol.forEach(([a, b]) => { U.sortTap(a); U.sortTap(b); });
          } else if (p.k === 'r') {
            const rx = REACT.rx[p.id];
            rx.L.forEach(([, id]) => { if (id[0] !== '@' && !S.fr[id]) { U.clearLab(true); U.buildSmiles(DB.comp[id].smiles[0]); U.synth(); } });
            farm(U, S, -REACT.energy(rx), out);
            U.startProblem(L.n, i); rx.L.forEach(([, id]) => U.rxAdd(id));
            if (!DIFF[L.n - 1].bal) { U.React.L = rx.L.map(t => t.slice()); U.React.R = rx.R.map(t => t.slice()); }
            U.react();
          } else {
            U.startProblem(L.n, i);
            if (p.k === 'm') { if (U.Lab.ghost) guided(U, out); else { U.clearLab(true); U.buildSmiles(DB.comp[p.id].smiles[0]); U.synth(); } }
            else if (p.k === 'p') { const ms = DB.poly[p.id].ms; U.Lab.sel = null; for (let q = 0; q < Math.max(3, ms.length * 2); q++) U.spawnMono(ms[q % ms.length]); U.synth(); }
            else { const { it, fl } = recipe(p.r); farm(U, S, -NUC.fuse(it.map(x => NUC.parse(x)), fl).net, out); U.Forge.slots = [it[0] || null, it[1] || null, it[2] || null]; U.Forge.flux = fl; U.fuse(); }
          }
        } catch (e) { out.failed.push(tag + 'excepción: ' + e.message); }
        if (U.MIS()) { out.failed.push(tag + 'misión sin completar' + (U.Lab.ghost ? ' (guía)' : '')); U.failMission('bot'); }
        if (S.prog[k]) out.solved++; else if (!out.failed.some(f => f.startsWith(tag))) out.failed.push(tag + 'sin resolver');
        U.closeModal();
      });
      if (L.n < LEVELS.length && U.state().unl !== L.n + 1) out.failed.push('No se abrió el nivel ' + (L.n + 1));
    }
    out.eternio = !!U.state().eternio; out.stars = D.totalStars(U.state()); out.total = LEVELS.length * 10;
    // reto diario completo con la UI
    const d = new Date(); U.startChallenge('daily', d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate());
    for (let q = 0; q < 6 && U.CH(); q++) { U.clearLab(true); U.buildSmiles(DB.comp[U.MIS().p.id].smiles[0]); U.synth(); }
    out.daily = !U.CH() && U.state().daily.streak >= 1; if (!out.daily) out.failed.push('Reto diario no se completó'); U.closeModal();
  } finally { U.quiet(false); U.setState(JSON.parse(keep)); U.clearLab(true); U.closeModal(); }
  return out;
}

/* partidas aleatorias */
function monkey(n, seed) {
  const U = D.ui, r = D.mulberry(seed || 1), keep = JSON.stringify(U.state()), errors = [];
  const pickA = a => a[Math.floor(r() * a.length)];
  let actions = 0; U.quiet(true);
  const elsAll = ['H', 'C', 'N', 'O', 'F', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ca', 'Fe', 'Cu', 'He', 'Li', 'Ar', 'U', 'Pb'];
  const openP = k => { const S = U.state(), L = 1 + Math.floor(r() * S.unl), i = Math.floor(r() * 10); return (!k || LEVELS[L - 1].P[i].k === k) && D.problemOpen(S, L, i) ? [L, i] : null; };
  const ACTS = {
    spawn: () => U.spawn(pickA(D.labElements(U.state()))),
    tapAtom: () => { const a = pickA(U.Lab.atoms); if (a) U.tapAtom(a.id); },
    tapBond: () => { const b = pickA(U.Lab.bonds); if (b) U.tapBond(b); },
    drop: () => { const a = pickA(U.Lab.atoms), b = pickA(U.Lab.atoms); if (a && b) { a.x = b.x + (r() - .5) * 40; a.y = b.y + (r() - .5) * 40; U.dropAtom(a.id); } },
    synth: () => U.synth(), autoH: () => U.autoH(), undo: () => U.undo(), del: () => { const a = pickA(U.Lab.atoms); if (a) { U.Lab.sel = a.id; U.delSel(); } },
    mono: () => { const m = Object.keys(U.state().fr).filter(id => DB.comp[id] && DB.comp[id].mono); if (m.length) U.spawnMono(pickA(m)); },
    smiles: () => { const c = pickA(Object.values(DB.comp)); U.buildSmiles(pickA(c.smiles)); if (r() < .7) U.synth(); },
    guide: () => { const st = U.guideStep(); if (st && st.k === 'place') U.spawn(st.el); else if (st && st.k === 'bond') U.tapBond(st.bond); },
    problem: () => { const q = openP(); if (q) U.startProblem(q[0], q[1]); },
    battle: () => { const q = openP('b'); if (q) U.startBattle(q[0], q[1], D.allCards(U.state()).slice(0, 4).map(c => c.id)); },
    throw: () => { if (U.BT()) U.throwCard(Math.floor(r() * 4)); },
    tick: () => U.tick(r() * 3),
    fuse: () => { const ks = Object.keys(U.state().nuc); U.Forge.slots = [pickA(ks), r() < .8 ? pickA(ks) : null, r() < .4 ? pickA(ks) : null]; U.Forge.flux = r() < .5 ? 0 : Math.floor(r() * 40); U.fuse(); },
    rx: () => { const ids = [...Object.keys(U.state().fr).filter(id => DB.comp[id]), '@Fe', '@Al', '@Na', '@C', '@S', '@Mg']; if (r() < .3) { U.React.L = []; U.React.R = []; } U.rxAdd(pickA(ids)); if (U.React.L.length) U.rxCoef(r() < .5 ? 'L' : 'R', 0, r() < .5 ? 1 : -1); if (r() < .5) U.react(); },
    rxReal: () => { const rx = pickA(Object.values(REACT.rx)); U.React.L = []; U.React.R = []; rx.L.forEach(([, id]) => U.rxAdd(id)); U.React.L = rx.L.map(t => t.slice()); U.React.R = rx.R.map(t => t.slice()); U.react(); },
    sort: () => { if (!U.SO()) { const q = openP('s'); if (q) U.startProblem(q[0], q[1]); } else U.sortTap(Math.floor(r() * (U.SO().st.length + 1))); },
    hint: () => U.useHint(),
    tab: () => U.setTab(pickA(['lab', 'fr', 'bt', 'tx'])), mode: () => U.setMode(pickA(['mol', 'forge', 'react'])),
    detail: () => { const S = U.state(), ids = [...Object.keys(S.fr), ...Object.keys(S.el).map(s => 'el:' + s)]; if (ids.length) U.detail(pickA(ids)); },
    modal: () => pickA([U.menu, U.guide, U.credits, U.settings, () => U.txLevel(1 + Math.floor(r() * LEVELS.length))])(),
    close: () => U.closeModal(), render: () => U.render(), flee: () => U.flee(), side: () => U.renderSide(),
    abandon: () => { if (U.MIS()) U.failMission('bot'); },
    daily: () => { if (!U.CH()) U.startChallenge(r() < .5 ? 'daily' : 'async', Math.floor(r() * 1e6)); else if (r() < .3) U.chalSkip(); else if (r() < .1) U.chalEnd(true); else if (U.MIS()) { U.clearLab(true); U.buildSmiles(DB.comp[U.MIS().p.id].smiles[0]); U.synth(); } else errors.push('reto activo sin objetivo'); }
  };
  const names = Object.keys(ACTS), weights = { daily: 3, spawn: 9, tapAtom: 6, tapBond: 3, drop: 3, synth: 4, autoH: 2, smiles: 2, guide: 3, tick: 5, throw: 5, fuse: 4, rx: 4, sort: 5 };
  const bag = names.flatMap(k => Array(weights[k] || 1).fill(k));
  try {
    for (let g = 0; g < n; g++) {
      const S0 = D.newState(); S0.intro = 1; S0.unl = 1 + Math.floor(r() * LEVELS.length); S0.cur = S0.unl;
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
          if (U.Lab.ghost) U.Lab.ghost.atoms.forEach(s => { if (s.f && !U.Lab.atoms.some(q => q.id === s.f)) bad.push('plano apunta a átomo borrado'); });
          const so = U.SO(); if (so) { const cnt = {}; so.st.forEach(t => t.forEach(c => cnt[c] = (cnt[c] || 0) + 1)); if (Object.values(cnt).some(v => v !== SORT.CAP) || so.st.some(t => t.length > SORT.CAP)) bad.push('destilación corrupta'); }
          try { const j = D.sanitize(JSON.parse(JSON.stringify(S))); if (j.v !== 1) bad.push('guardado'); } catch (e) { bad.push('JSON ' + e.message); }
          if (bad.length) errors.push('partida ' + g + ' acción ' + a + ': ' + [...new Set(bad)].join(', '));
        }
      }
      if (U.BT()) { U.flee(); U.tick(.1); }
      if (U.CH()) U.chalEnd(true);
      if (U.MIS()) U.failMission('bot');
      if (U.SO()) U.squit();
    }
  } catch (e) { errors.push('abortado: ' + e.message); }
  finally { U.quiet(false); U.setState(JSON.parse(keep)); U.clearLab(true); U.closeModal(); }
  return { games: n, actions, errors };
}
DE.test = { selfTest, solver, monkey, simBattle, launchable, buildT };
})();
