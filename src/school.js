/* ============================================================
   DOC ELEMENT · ESCUELA DE ÉTER (química para bebés) + consejos de primera vez
   Un foco ilumina lo que hay que tocar, una mano animada muestra cómo arrastrar,
   y cada paso avanza solo cuando el jugador lo hace. Imposible fallar.
   ============================================================ */
'use strict';
(function () {
const K = () => DE.k, $ = s => document.querySelector(s);
let CM = null, RUN = null; // RUN = { steps, i, done, c0 }
const L = () => K().Lab;
const atoms = el => L().atoms.filter(a => !a.mono && a.el === el);
const sum = id => L().bonds.reduce((s, b) => s + (b.a === id || b.b === id ? b.o : 0), 0);
const bondEl = (x, y) => L().bonds.find(b => { const p = L().atoms.find(a => a.id === b.a), q = L().atoms.find(a => a.id === b.b); return p && q && ((p.el === x && q.el === y) || (p.el === y && q.el === x)); });
const frc = id => (K().S().fr[id] || {}).c || 0;
const unionRect = rs => { rs = rs.filter(Boolean); if (!rs.length) return null; const l = Math.min(...rs.map(r => r.left)), t = Math.min(...rs.map(r => r.top)), r2 = Math.max(...rs.map(r => r.left + r.width)), b = Math.max(...rs.map(r => r.top + r.height)); return { left: l, top: t, width: r2 - l, height: b - t }; };
const trayEl = el => `#tray [data-arg="${el}"]`;
function ensure() {
  if (CM) return CM; CM = document.createElement('div'); CM.id = 'cm'; CM.hidden = true;
  CM.innerHTML = '<div class="cm-spot"></div><div class="cm-hand"></div><div class="cm-bub"><div class="por cm-por"></div><div class="cm-tx"><b class="cm-t"></b><p class="cm-p"></p><div class="cm-row"></div></div></div>';
  document.body.appendChild(CM); return CM;
}
function rectOf(t) { if (!t) return null; if (typeof t === 'function') return t(); const e = document.querySelector(t); if (!e) return null; const r = e.getBoundingClientRect(); return r.width ? r : null; }
function render() {
  const c = ensure(), st = RUN.steps[RUN.i]; c.hidden = false;
  c.querySelector('.cm-por').innerHTML = st.who === 'doc' ? DE.CH.doc(st.mood || 'feliz', 1) : DE.CH.eter(st.mood || 'feliz');
  c.querySelector('.cm-t').textContent = st.t; c.querySelector('.cm-p').innerHTML = st.p; if (K().voz) K().voz(st.t + '. ' + st.p, st.who || 'eter');
  c.querySelector('.cm-row').innerHTML = (st.btn ? `<button class="btn pri sm" data-act="cmNext">${st.btn}</button>` : '<span class="m sm">Hazlo y sigo solo ✨</span>') + (RUN.skip ? `<button class="btn gh sm" data-act="cmSkip">${RUN.skip}</button>` : '') + `<span class="cm-n">${RUN.i + 1}/${RUN.steps.length}</span>`;
  place(performance.now());
}
function place(t) {
  if (!RUN || !CM || CM.hidden) return; const st = RUN.steps[RUN.i], r = rectOf(st.target), sp = CM.querySelector('.cm-spot'), bub = CM.querySelector('.cm-bub'), hd = CM.querySelector('.cm-hand');
  const W = innerWidth, H = innerHeight, pad = 8;
  if (r) Object.assign(sp.style, { display: 'block', left: (r.left - pad) + 'px', top: (r.top - pad) + 'px', width: (r.width + 2 * pad) + 'px', height: (r.height + 2 * pad) + 'px' });
  else Object.assign(sp.style, { display: 'block', left: W / 2 + 'px', top: H / 2 + 'px', width: '0px', height: '0px' });
  const bw = Math.min(W * .92, 420), bh = bub.offsetHeight || 120; let bx = r ? r.left + r.width / 2 - bw / 2 : (W - bw) / 2, by;
  if (!r) by = (H - bh) / 2; else if (r.top + r.height + pad + bh + 12 < H) by = r.top + r.height + pad + 12; else if (r.top - pad - bh - 12 > 0) by = r.top - pad - bh - 12; else { by = 8; bx = r.left + r.width / 2 > W / 2 ? 8 : W - bw - 8; }
  bub.style.width = bw + 'px'; bub.style.left = Math.max(8, Math.min(W - bw - 8, bx)) + 'px'; bub.style.top = Math.max(8, Math.min(H - bh - 8, by)) + 'px';
  let hp = null;
  if (st.drag) { const d = st.drag(); if (d) { const ph = (t % 1700) / 1700, k = Math.max(0, Math.min(1, (ph - .15) / .55)), e = k * k * (3 - 2 * k); hp = [d[0][0] + (d[1][0] - d[0][0]) * e, d[0][1] + (d[1][1] - d[0][1]) * e]; hd.classList.toggle('press', ph > .1 && ph < .75); } }
  else if (r && !st.btn) { hp = [r.left + r.width / 2, r.top + r.height / 2]; hd.classList.toggle('press', (t % 1000) < 350); }
  if (hp) Object.assign(hd.style, { display: 'block', left: hp[0] + 'px', top: hp[1] + 'px' }); else hd.style.display = 'none';
}
function go(i) {
  if (!RUN) return; RUN.i = i; const st = RUN.steps[i]; if (!st) return finish(true);
  if (st.enter) st.enter(RUN); RUN.c0 = st.count ? frc(st.count) : 0; render();
  if (st.cheer) { K().sfx('win'); K().vib([30, 40, 60]); K().fxBurst && K().fxBurst(0, 0, ['#2dffb3', '#ffc23a', '#39c8ff', '#ff2fb3'], 40); }
}
function next() { if (!RUN) return; K().sfx('ok'); go(RUN.i + 1); }
function finish(completed) {
  const r = RUN; RUN = null; if (CM) CM.hidden = true; if (!r) return;
  if (r.key) { K().S().seen[r.key] = 1; K().save(); }
  if (r.onEnd) r.onEnd(completed);
}
function frame(t) {
  if (!RUN) { autoTips(); return; }
  const st = RUN.steps[RUN.i]; place(t);
  if (st && st.done && st.done(RUN)) { if (!RUN.wait) { RUN.wait = 1; setTimeout(() => { if (RUN) { RUN.wait = 0; next(); } }, 380); } }
}
function run(key, steps, opt) { if (RUN) finish(false); RUN = Object.assign({ key, steps, i: 0, skip: 'Saltar' }, opt || {}); go(0); }

/* ---------- la Escuela: química para bebés ---------- */
function school(onEnd) {
  const k = K(); k.closeModal(); k.setTab('lab'); k.setMode('mol'); k.clearLab(true); L().sel = null; L().view = { x: 0, y: 0, z: 1 };
  const A = el => () => unionRect(atoms(el).map(a => k.atomRect(a.id)));
  run('school', [
    { t: 'Escuela de ÉTER', p: 'Vamos a jugar con <b>átomos</b>: bloques pequeñitos que forman TODO, el agua, el aire y tu cuerpo. Te enseño en un minuto.', btn: '▸ ¡Empezar!', mood: 'feliz' },
    { t: 'Paso 1 · Un átomo', p: 'Toca la <b class="hl">H</b> de abajo. Es el hidrógeno, el átomo más pequeño.', target: trayEl('H'), enter: () => { k.clearLab(true); L().sel = null; }, done: () => atoms('H').length >= 1 },
    { t: '¡Hola, H!', p: 'Mira su carita: está triste 😟 porque tiene una <b>mano libre</b> (el palito rosado). Cada átomo tiene sus manos: la H tiene <b>1</b>.', target: A('H'), btn: '▸ Entendido', enter: () => { L().sel = null; } },
    { t: 'Paso 2 · Otro átomo', p: 'Ahora toca la <b class="hl">O</b>: el oxígeno. ¡Tiene <b>2</b> manos!', target: trayEl('O'), enter: () => { L().sel = null; }, done: () => atoms('O').length >= 1 },
    { t: 'Paso 3 · Darse la mano', p: '<b>Arrastra</b> la H con el dedo y suéltala encima de la O. Cuando dos átomos se dan la mano aparece una rayita: un <b>enlace</b>.', target: () => unionRect([A('H')(), A('O')()]), drag: () => { const h = atoms('H')[0], o = atoms('O')[0]; if (!h || !o) return null; const a = k.atomRect(h.id), b = k.atomRect(o.id); return [[a.left + a.width / 2, a.top + a.height / 2], [b.left + b.width / 2, b.top + b.height / 2]]; }, done: () => !!bondEl('H', 'O') },
    { t: 'Paso 4 · Otra H', p: '¡Bien! La H ya sonríe 😀, pero la O aún tiene una mano libre. Toca la <b class="hl">H</b> de abajo otra vez: irá directo a la O.', target: trayEl('H'), done: () => atoms('O').some(o => sum(o.id) === 2 && L().bonds.filter(b => b.a === o.id || b.b === o.id).every(b => { const n = L().atoms.find(a => a.id === (b.a === o.id ? b.b : b.a)); return n && n.el === 'H' && sum(n.id) === 1; })) },
    { t: 'Paso 5 · ¡Crear!', p: 'Todas las caritas sonríen: nadie tiene manos libres. Eso es una molécula <b>estable</b>. Pulsa <b class="hl">⚗ CREAR</b> para guardarla en tus frascos.', target: '#bSyn', count: 'H2O', done: r => frc('H2O') > r.c0 },
    { t: '¡HICISTE AGUA! 💧', p: '<b>H₂O</b> = 2 H + 1 O. Con esta misma regla se fabrica todo en el universo.', btn: '▸ Siguiente', who: 'doc', mood: 'loco', cheer: 1 },
    { t: 'Paso 6 · Dos oxígenos', p: 'Toca la <b class="hl">O</b> dos veces.', target: trayEl('O'), enter: () => { k.clearLab(true); L().sel = null; }, done: () => atoms('O').length >= 2 },
    { t: 'Paso 7 · Únelas', p: '<b>Arrastra</b> una O encima de la otra.', target: A('O'), drag: () => { const [a, b] = atoms('O'); if (!a || !b) return null; const p = k.atomRect(a.id), q = k.atomRect(b.id); return [[p.left + p.width / 2, p.top + p.height / 2], [q.left + q.width / 2, q.top + q.height / 2]]; }, done: () => !!bondEl('O', 'O') },
    { t: 'Paso 8 · Doble apretón', p: 'Cada O aún tiene una mano libre 😟. Toca la <b class="hl">rayita</b> entre ellas: se darán las dos manos (enlace <b>doble</b>).', target: () => { const b = bondEl('O', 'O'); return b ? k.bondRect(b) : null; }, done: () => { const b = bondEl('O', 'O'); return !!b && b.o >= 2; } },
    { t: 'Paso 9 · ¡Crear!', p: 'Pulsa <b class="hl">⚗ CREAR</b>.', target: '#bSyn', count: 'O2', done: r => frc('O2') > r.c0 },
    { t: '¡OXÍGENO! 🌬️', p: 'O=O es el aire que respiras. Ya sabes las <b>tres reglas</b>:<br>✋ cada átomo tiene sus manos.<br>😀 todas las manos ocupadas = carita feliz.<br>⚗ CREAR guarda la molécula.', btn: '▸ Siguiente', who: 'doc', mood: 'feliz', cheer: 1 },
    { t: 'Las salas de la nave', p: '⇄ <b>Reactor</b>: mezcla moléculas como una receta.<br>☢ <b>Forja</b>: aplasta núcleos y nacen átomos nuevos.<br>⚱ <b>Destilación</b>: separa líquidos por colores.<br>☣ <b>Batalla</b>: lanza moléculas contra los problemas.<br>La primera vez que entres a cada sala te lo explico.', btn: '▸ ¡A jugar!' }
  ], { skip: 'Saltar tutorial', onEnd: done => { k.clearLab(true); if (onEnd) onEnd(done); } });
}
/* ---------- consejos de la primera vez en cada sala ---------- */
const TIPS = {
  tip_react: () => [
    { t: 'El Reactor', p: 'Aquí abajo están tus frascos. Toca <b>dos sustancias</b> para mezclarlas, por ejemplo H₂ y O₂.', target: '#reactPane .nucs', btn: 'Entendido', done: () => K().React.L.length >= 2 },
    { t: 'La receta', p: 'Los números grandes dicen <b>cuántas</b> moléculas de cada una. Si los átomos de los dos lados salen en <span class="ok">verde</span>, la receta está balanceada.', target: '#reactPane .eq', btn: 'Entendido' },
    { t: '¡A mezclar!', p: 'Pulsa <b class="hl">⚗ REACCIONAR</b>. Si los números no cuadran, cámbialos con + y −.', target: '#reactPane [data-act=react]', btn: '¡Vale!' }],
  tip_forge: () => [
    { t: 'La Forja', p: 'Estos son <b>núcleos</b>, las semillas de los átomos: p⁺ es un protón y n un neutrón. Toca dos para meterlos en la máquina.', target: '#forgePane .nucs', btn: 'Entendido', done: () => K().Forge.slots.filter(Boolean).length + (K().Forge.flux ? 1 : 0) >= 2 },
    { t: '¿Qué saldrá?', p: 'Aquí ves el resultado antes de fusionar. <b>Z</b> = protones: dice qué elemento es. <b>A</b> = la masa.', target: '#fprev', btn: 'Entendido' },
    { t: '¡Fusión!', p: 'Pulsa <b class="hl">☢ FUSIONAR</b>. Unir núcleos ligeros te da energía ⚡.', target: '#forgePane [data-act=fuse]', btn: '¡Vale!' }],
  tip_sort: () => [
    { t: 'Destilación', p: 'Cada color es un líquido. Toca un tubo para levantarlo y luego otro para verter la capa de arriba. Solo cae sobre el <b>mismo color</b> o en un tubo <b>vacío</b>. Meta: un color por tubo.', target: '.tubes', btn: '¡Vale!' }],
  tip_gene: () => [
    { t: 'Sala de Genética', p: 'El ADN se escribe con cuatro letras. Las parejas son fijas: <b>A con T</b> y <b>G con C</b> (en el ARN, la T se cambia por <b>U</b>). Toca la letra que falta y la sala te dice si acertaste.', target: '#geneOv .gbody', btn: '¡Vale!' }],
  tip_org: () => [
    { t: 'Sala de Cultivo', p: 'Aquí estudias seres vivos sin tocar ninguno. Lee la pregunta de arriba y toca la respuesta: un círculo <b>?</b>, un botón o una casilla. Si fallas, la sala te explica por qué.', target: '#orgOv .gbody', btn: '¡Vale!' }],
  tip_obs: () => [
    { t: 'Observatorio', p: 'Aquí miras los átomos por dentro. <b>Orbitales</b>: toca la caja más baja libre; primero uno por caja y luego en parejas. <b>Espectros</b>: busca el elemento con las mismas rayas de color que la muestra.', target: '#obsOv .gbody', btn: '¡Vale!' }],
  tip_battle: () => [
    { t: 'La batalla', p: 'Este es el problema. La barra <span class="bad">rosada</span> es su vida; la <span class="ok">verde</span>, tu nave. El reloj está en pausa mientras te explico.', target: '#bstrip', btn: 'Entendido' },
    { t: 'Construye', p: 'Arma moléculas aquí, como siempre. Si ves un plano punteado, síguelo: es la molécula que más daño hace.', target: '#cvWrap', btn: 'Entendido' },
    { t: '¡Lanza!', p: 'Pulsa <b class="hl">⚗ LANZAR</b> para dispararla. Si repites la misma molécula pierde fuerza: varía.', target: '#bSyn', btn: '¡A pelear!' }]
};
function autoTips() {
  const k = K(); if (!k || k.quiet() || !k.S().seen.school && !k.S().intro) return; const s = k.S().seen;
  if (document.getElementById('cover') || document.getElementById('story') || !document.getElementById('ov').hidden) return;
  const key = DE.obs && DE.obs.active() ? 'tip_obs' : DE.org && DE.org.active() ? 'tip_org' : DE.genes && DE.genes.active() ? 'tip_gene' : k.BT() ? 'tip_battle' : k.SO() ? 'tip_sort' : k.TAB() === 'lab' && k.Lab.mode === 'react' ? 'tip_react' : k.TAB() === 'lab' && k.Lab.mode === 'forge' ? 'tip_forge' : null;
  if (key && !s[key] && (key !== 'tip_battle' || $('#bstrip:not([hidden])'))) run(key, TIPS[key](), { skip: 'Cerrar' });
}
function skipTips() { const s = K().S().seen; Object.keys(TIPS).forEach(k => s[k] = 1); s.school = 1; if (RUN) finish(false); }
DE.ACTX = DE.ACTX || {};
DE.ACTX.cmNext = () => next();
DE.ACTX.cmSkip = () => finish(false);
DE.ACTX.school = () => school(() => K().renderSide());
DE.school = { start: school, frame, blocking: () => !!RUN, state: () => RUN ? { key: RUN.key, i: RUN.i, n: RUN.steps.length, btn: !!RUN.steps[RUN.i].btn, t: RUN.steps[RUN.i].t } : null, next, finish, skipTips, run };
})();
