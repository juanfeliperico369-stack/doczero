/* ============================================================
   DOC ELEMENT · PERSONAJES (SVG original, sin imágenes externas)
   DOC: tú. Personalizable (piel, peinado, color de pelo, ojos, traje, accesorio y matraz); por defecto tupé morado,
   visor de un ojo y traje de criogenia. Se vuelve más loco con cada rango (0 despierto → 4 ente).
   ÉTER: la inteligencia de la Ouroboros, un ojo dentro de una serpiente que se muerde la cola
   ánimos: neutral · feliz · sorpresa · loco · triste · enojado
   ============================================================ */
'use strict';
(function () {
const EYE = { neutral: '#39c8ff', feliz: '#2dffb3', sorpresa: '#ffc23a', loco: '#ff2fb3', triste: '#8fb3ff', enojado: '#ff2fb3' };
/* ---------- opciones del personaje (índices o claves; req = estrellas para desbloquear) ---------- */
const OPT = {
  skin: { t: 'Piel', c: ['#f3d6c1', '#d9c3b0', '#c79a78', '#a8775a', '#7d5239', '#573626'], n: ['Muy clara', 'Clara', 'Trigueña', 'Morena', 'Oscura', 'Muy oscura'] },
  hair: { t: 'Peinado', k: ['tupe', 'corto', 'rizos', 'largo', 'mono', 'cresta', 'calvo'], n: ['Tupé', 'Corto', 'Rizos', 'Largo', 'Moño', 'Cresta', 'Rapado'], req: { cresta: 60 } },
  hc: { t: 'Color de pelo', c: ['#5b2bd6', '#1f6fd1', '#d61f8c', '#16a36b', '#7a4a22', '#1c1626', '#b8321f', '#e6e6f0', '#e0a91c'], n: ['Morado', 'Azul', 'Rosa', 'Verde', 'Castaño', 'Negro', 'Rojo', 'Plata', 'Dorado'], req: { 8: 140 } },
  eyes: { t: 'Ojos', k: ['visor', 'gafas', 'antiparras', 'nada'], n: ['Visor', 'Gafas', 'Antiparras', 'Sin nada'] },
  suit: { t: 'Traje', c: ['#0b2a44', '#2a0b44', '#0b3a2a', '#3a0b1a', '#1c1c24', '#dfe8f7'], n: ['Azul noche', 'Morado', 'Verde', 'Granate', 'Grafito', 'Blanco'] },
  acc: { t: 'Accesorio', k: ['nada', 'bufanda', 'audifonos', 'insignia', 'medalla'], n: ['Ninguno', 'Bufanda', 'Audífonos', 'Insignia', 'Medalla'], req: { audifonos: 30, medalla: 240 } },
  fl: { t: 'Matraz', c: ['#ff2fb3', '#2dffb3', '#39c8ff', '#ffc23a'], n: ['Rosa', 'Verde', 'Azul', 'Dorado'] }
};
const LOOK0 = { skin: 1, hair: 'tupe', hc: 0, eyes: 'visor', suit: 0, acc: 'nada', fl: 0 };
let LOOK = Object.assign({}, LOOK0);
/* deja solo valores válidos (sirve también para partidas guardadas o importadas) */
function clean(l) {
  const o = Object.assign({}, LOOK0); if (!l || typeof l !== 'object') return o;
  for (const k in OPT) { const v = l[k], q = OPT[k]; if (q.k ? q.k.includes(v) : Number.isInteger(v) && v >= 0 && v < q.c.length) o[k] = v; }
  return o;
}
const setLook = l => { LOOK = clean(l); return LOOK; };
const shade = (hex, f) => '#' + [1, 3, 5].map(i => Math.round(parseInt(hex.substr(i, 2), 16) * f).toString(16).padStart(2, '0')).join('');
function hairOf(st, c, rank) {
  const g = rank >= 2 ? 'url(#dh' + LOOKC.hc + ')' : c, lock = `<path d="M30 46 Q29 40 31 36" stroke="${c}" stroke-width="3" fill="none"/>`;
  if (st === 'tupe') { const h = 6 + rank * 5; return { b: '', f: `<path d="M29 44 Q27 22 46 18 Q${58 + rank * 2} ${12 - h} ${74 + rank} ${10 - h * .6} Q70 ${20 - h * .2} 72 30 Q74 36 71 44 Q66 30 50 29 Q36 30 29 44Z" fill="${g}"/>` + lock }; }
  if (st === 'corto') return { b: '', f: `<path d="M29 45 Q27 23 50 22 Q73 23 71 45 Q69 33 60 31 Q50 34 40 31 Q31 33 29 45Z" fill="${g}"/>` + lock };
  if (st === 'rizos') { let b = ''; for (let a = 190; a <= 350; a += 20) { const r = a * Math.PI / 180; b += `<circle cx="${(50 + 23 * Math.cos(r)).toFixed(1)}" cy="${(41 + 21 * Math.sin(r)).toFixed(1)}" r="${9 + rank * .6}" fill="${g}"/>`; } return { b, f: [36, 44, 52, 60].map((x, i) => `<circle cx="${x + 2}" cy="${27 + (i % 2) * 2}" r="6.5" fill="${g}"/>`).join('') }; }
  if (st === 'largo') return { b: `<path d="M27 40 Q27 17 50 17 Q73 17 73 40 L76 76 Q70 81 64 76 L63 52 H37 L36 76 Q30 81 24 76Z" fill="${g}"/>`, f: `<path d="M29 45 Q28 21 50 20 Q72 21 71 45 Q65 30 55 32 Q47 26 39 33 Q32 36 29 45Z" fill="${g}"/>` };
  if (st === 'mono') return { b: `<circle cx="50" cy="${14 - rank}" r="${9 + rank * .5}" fill="${g}"/>`, f: `<path d="M29 45 Q27 23 50 22 Q73 23 71 45 Q66 31 50 30 Q34 31 29 45Z" fill="${g}"/>` };
  if (st === 'cresta') { const h = rank * 3; return { b: '', f: `<path d="M44 33 Q43 ${14 - h} 50 ${2 - h} Q57 ${14 - h} 56 33 Q50 30 44 33Z" fill="${g}"/><path d="M31 40 Q33 30 42 27 M69 40 Q67 30 58 27" stroke="${c}" stroke-width="1.5" opacity=".5" fill="none"/>` }; }
  return { b: '', f: '<ellipse cx="43" cy="31" rx="7" ry="3" fill="#fff" opacity=".22"/>' };
}
let LOOKC = LOOK;
function parts(mood, rank, look) {
  mood = mood || 'neutral'; rank = Math.max(0, Math.min(4, rank | 0)); const L = LOOKC = look ? clean(look) : LOOK;
  const skin = OPT.skin.c[L.skin], hc = OPT.hc.c[L.hc], suitC = OPT.suit.c[L.suit], glow = rank >= 3, hr = hairOf(L.hair, hc, rank);
  const brows = { neutral: 'M37 38 L45 37 M55 37 L63 38', feliz: 'M37 36 Q41 34 45 36 M55 36 Q59 34 63 36', sorpresa: 'M37 33 Q41 30 45 33 M55 33 Q59 30 63 33', loco: 'M36 39 L45 34 M55 33 L64 37', triste: 'M37 36 L45 39 M55 39 L63 36', enojado: 'M37 35 L46 39 M54 39 L63 35' }[mood];
  const er = mood === 'sorpresa' ? 4.8 : 4, pupil = glow ? '#2dffb3' : '#120a22';
  const eye = x => mood === 'feliz' ? `<path d="M${x - 4} 44 Q${x} 40 ${x + 4} 44" stroke="#120a22" stroke-width="2.2" fill="none" stroke-linecap="round"/>` : `<ellipse cx="${x}" cy="44" rx="${mood === 'loco' ? 5.4 : er}" ry="${mood === 'loco' ? 5.4 : er}" fill="#fff"/><circle cx="${mood === 'triste' ? x : x + 1}" cy="${mood === 'triste' ? 45.5 : 44}" r="${mood === 'loco' ? 1.3 : 2}" fill="${pupil}"/>`;
  // ojos: visor de un ojo (clásico de Doc, crece con el rango), gafas redondas, antiparras de laboratorio o nada
  const eyes = L.eyes === 'visor' ? eye(41) + `<path d="M52 38 L68 37 Q71 44 67 50 L53 50 Q50 44 52 38Z" fill="#39c8ff" fill-opacity="${mood === 'loco' ? .75 : .45}" stroke="#a42cff" stroke-width="2"/><path d="M68 41 L76 39" stroke="#a42cff" stroke-width="2"/>` + (rank >= 1 ? '<circle cx="60" cy="44" r="2.4" fill="#ff2fb3"/>' : '') + (rank >= 3 ? '<path d="M54 47 L66 47" stroke="#2dffb3" stroke-width="1"/>' : '')
    : L.eyes === 'gafas' ? eye(41) + eye(59) + '<circle cx="41" cy="44" r="7.5" fill="rgba(57,200,255,.14)" stroke="#a42cff" stroke-width="2"/><circle cx="59" cy="44" r="7.5" fill="rgba(57,200,255,.14)" stroke="#a42cff" stroke-width="2"/><path d="M48.5 43 Q50 41.5 51.5 43 M33.5 42 L30 40 M66.5 42 L70 40" stroke="#a42cff" stroke-width="2" fill="none"/>'
    : L.eyes === 'antiparras' ? eye(41) + eye(59) + '<path d="M29 42 H33 M67 42 H71" stroke="#2dffb3" stroke-width="3"/><rect x="32" y="36.5" width="17" height="14" rx="6" fill="rgba(45,255,179,.16)" stroke="#2dffb3" stroke-width="2"/><rect x="51" y="36.5" width="17" height="14" rx="6" fill="rgba(45,255,179,.16)" stroke="#2dffb3" stroke-width="2"/><path d="M35 40 l4 -1" stroke="#fff" stroke-width="1.4" opacity=".7"/>'
    : eye(41) + eye(59);
  const mouth = { neutral: '<path d="M44 58 L56 58" stroke="#5a2a2a" stroke-width="2" stroke-linecap="round"/>', feliz: '<path d="M42 56 Q50 63 58 56" stroke="#5a2a2a" stroke-width="2.2" fill="none" stroke-linecap="round"/>', sorpresa: '<ellipse cx="50" cy="59" rx="3.5" ry="4.5" fill="#3a1520"/>', loco: '<path d="M39 55 Q50 66 61 55 Z" fill="#3a1520"/><path d="M41 56 L59 56 L57 58.5 L43 58.5Z" fill="#fff"/>', triste: '<path d="M43 60 Q50 55 57 60" stroke="#5a2a2a" stroke-width="2.2" fill="none" stroke-linecap="round"/>', enojado: '<path d="M43 59 L57 57" stroke="#5a2a2a" stroke-width="2.4" stroke-linecap="round"/>' }[mood];
  const browC = L.hair === 'calvo' ? shade(skin, .45) : shade(hc, .7);
  // accesorios: cabeza (audífonos), cuello (bufanda) y pecho (insignia, medalla), dibujados distinto en retrato y cuerpo
  const acc = L.acc, ach = acc === 'audifonos' ? '<path d="M27 44 Q27 13 50 13 Q73 13 73 44" stroke="#e9f6ff" stroke-width="3.2" fill="none"/><rect x="22" y="38" width="9" height="15" rx="4" fill="#ff2fb3" stroke="#000" stroke-width="1"/><rect x="69" y="38" width="9" height="15" rx="4" fill="#ff2fb3" stroke="#000" stroke-width="1"/>' : '';
  const neck = acc === 'bufanda' ? '<path d="M37 64 Q50 73 63 64 L65 72 Q50 81 35 72Z" fill="#ffc23a" stroke="#7a4a00" stroke-width="1"/><path d="M55 73 L60 90 L53 90 L51 75Z" fill="#ffc23a" stroke="#7a4a00" stroke-width="1"/>' : '';
  const chest = (x, y) => acc === 'insignia' ? `<g transform="translate(${x} ${y})"><ellipse rx="6" ry="2.4" fill="none" stroke="#ffc23a" stroke-width="1.2"/><ellipse rx="6" ry="2.4" fill="none" stroke="#ffc23a" stroke-width="1.2" transform="rotate(60)"/><ellipse rx="6" ry="2.4" fill="none" stroke="#ffc23a" stroke-width="1.2" transform="rotate(-60)"/><circle r="1.6" fill="#ff2fb3"/></g>`
    : acc === 'medalla' ? `<path d="M${x - 6} ${y - 18} L${x} ${y - 6} L${x + 6} ${y - 18}" stroke="#ff2fb3" stroke-width="3" fill="none"/><circle cx="${x}" cy="${y}" r="6" fill="#ffc23a" stroke="#7a4a00" stroke-width="1.2"/><path d="M${x} ${y - 3} l1 2 2 .3 -1.5 1.4 .4 2.1 -1.9 -1 -1.9 1 .4 -2.1 -1.5 -1.4 2 -.3z" fill="#7a4a00"/>` : '';
  // traje de criogenia con el emblema de la Ouroboros; al subir de rango, bata con manchas
  const suit = `<path d="M12 100 Q14 76 36 70 L50 78 L64 70 Q86 76 88 100Z" fill="${suitC}" stroke="#39c8ff" stroke-width="1.5"/><path d="M36 70 L50 78 L64 70" stroke="#2dffb3" stroke-width="2" fill="none"/><circle cx="50" cy="90" r="5" fill="none" stroke="#2dffb3" stroke-width="1.8" stroke-dasharray="24 6"/>` + (rank >= 2 ? '<path d="M12 100 Q14 76 30 71 L36 100Z M88 100 Q86 76 70 71 L64 100Z" fill="#e6eefc" opacity=".92"/><circle cx="24" cy="90" r="2.6" fill="#ff2fb3"/><circle cx="76" cy="86" r="2" fill="#ffc23a"/>' : '') + chest(acc === 'medalla' ? 50 : 64, acc === 'medalla' ? 90 : 86);
  const scar = rank >= 1 ? `<path d="M33 50 L37 56" stroke="${shade(skin, .78)}" stroke-width="1.3"/>` : '';
  const aura = rank >= 4 ? '<circle cx="50" cy="50" r="47" fill="none" stroke="#ffc23a" stroke-width="1.5" stroke-dasharray="3 5"/>' : '';
  const head = `${hr.b}<rect x="44" y="62" width="12" height="10" fill="${skin}"/><ellipse cx="50" cy="47" rx="20" ry="22" fill="${skin}"/>${hr.f}<path d="${brows}" stroke="${browC}" stroke-width="2.4" fill="none" stroke-linecap="round"/>${eyes}<path d="M50 47 L48 53 L51 53" stroke="${shade(skin, .74)}" stroke-width="1.4" fill="none"/>${mouth}${scar}${glow ? '<circle cx="41" cy="44" r="6" fill="#2dffb3" opacity=".16"/>' : ''}${ach}${neck}`;
  const defs = `<defs><linearGradient id="dh${L.hc}" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${hc}"/><stop offset="1" stop-color="#39c8ff"/></linearGradient></defs>`;
  return { aura, suit, head, defs, skin, suitC, chest, fl: OPT.fl.c[L.fl] };
}
function doc(mood, rank, look) { const p = parts(mood, rank, look); return `<svg viewBox="0 0 100 100" class="pt-doc m-${mood || 'neutral'}" aria-label="Doc">${p.defs}${p.aura}${p.suit}${p.head}</svg>`; }
/* Doc de cuerpo entero (caja 100 × 200, pies en y = 196): traje de criogenia, cinturón de viales y su matraz; con rango 2+ lleva bata */
const ARM = (d, w, c) => `<path d="${d}" stroke="#39c8ff" stroke-width="${w + 3}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
const FLASK = (x, y, c) => `<g transform="translate(${x} ${y})"><path d="M-3 -16 h6 v7 l8 13 q1.5 5 -3.5 5 h-15 q-5 0 -3.5 -5 l8 -13Z" fill="rgba(57,200,255,.14)" stroke="#e9f6ff" stroke-width="1.4"/><path d="M-9.5 1.5 h19 l1.5 2.5 q1 4.5 -3.5 4.5 h-15 q-4.5 0 -3.5 -4.5Z" fill="${c}"/><circle class="bub" cx="-2" cy="-2" r="1.6" fill="#fff" opacity=".7"/><circle class="bub b2" cx="2" cy="-6" r="1.2" fill="#fff" opacity=".7"/></g>`;
function body(mood, rank, look) {
  mood = mood || 'neutral'; rank = Math.max(0, Math.min(4, rank | 0)); const p = parts(mood, rank, look), skin = p.skin, sc = p.suitC, up = mood === 'loco' || mood === 'feliz' || mood === 'sorpresa';
  let s = p.defs + '<ellipse cx="50" cy="197" rx="27" ry="5" fill="#000" opacity=".6"/>';
  s += `<path d="M36 128 L34 186 L47 186 L49 132Z M64 128 L66 186 L53 186 L51 132Z" fill="${sc}" stroke="#39c8ff" stroke-width="1.5"/><path d="M30 184 h18 v10 h-20 q-1 -7 2 -10Z M70 184 h-18 v10 h20 q1 -7 -2 -10Z" fill="#1a0f2e" stroke="#a42cff" stroke-width="1.5"/>`;
  s += ARM('M31 82 Q19 102 22 124', 9, sc);
  s += `<path d="M29 78 Q50 70 71 78 L73 132 Q50 139 27 132Z" fill="${sc}" stroke="#39c8ff" stroke-width="1.6"/><path d="M38 76 L50 86 L62 76" stroke="#2dffb3" stroke-width="2" fill="none"/><circle cx="50" cy="101" r="6" fill="none" stroke="#2dffb3" stroke-width="1.8" stroke-dasharray="28 6"/><rect x="28" y="119" width="44" height="6" fill="#1a0f2e" stroke="#a42cff" stroke-width="1"/><rect x="33" y="112" width="4" height="10" rx="1.6" fill="#ff2fb3"/><rect x="39" y="112" width="4" height="10" rx="1.6" fill="#ffc23a"/><rect x="58" y="112" width="4" height="10" rx="1.6" fill="#2dffb3"/>`;
  if (rank >= 2) s += '<path d="M29 78 Q25 112 23 152 L40 152 L42 86Z M71 78 Q75 112 77 152 L60 152 L58 86Z" fill="#e6eefc" stroke="#8fb3ff" stroke-width="1"/><circle cx="30" cy="140" r="2.6" fill="#ff2fb3"/><circle cx="71" cy="128" r="2" fill="#ffc23a"/><path d="M33 96 h6" stroke="#8fb3ff" stroke-width="1"/>';
  s += p.chest(LOOKC.acc === 'medalla' ? 50 : 62, LOOKC.acc === 'medalla' ? 101 : 94);
  s += `<circle cx="22" cy="125" r="4.6" fill="${skin}"/>`;
  s += up ? ARM('M69 82 Q84 74 86 52', 9, sc) + FLASK(86, 44, p.fl) + `<circle cx="86" cy="48" r="4.6" fill="${skin}"/>` : ARM('M69 82 Q81 102 78 124', 9, sc) + FLASK(80, 134, p.fl) + `<circle cx="78" cy="125" r="4.6" fill="${skin}"/>`;
  return s + `<g transform="translate(0 7)">${p.aura}${p.head}</g>`;
}
function eter(mood) {
  mood = mood || 'neutral'; const c = EYE[mood] || EYE.neutral;
  const lid = { feliz: '<path d="M26 52 Q50 30 74 52" stroke="#e9f6ff" stroke-width="3" fill="none" stroke-linecap="round"/>', enojado: '<path d="M26 40 L74 50" stroke="#ff2fb3" stroke-width="4" stroke-linecap="round"/>', triste: '<path d="M28 58 Q50 66 72 58" stroke="#8fb3ff" stroke-width="3" fill="none"/><path d="M62 62 q3 6 0 9 q-3 -3 0 -9" fill="#8fb3ff"/>' }[mood] || '';
  const iris = mood === 'feliz' ? '' : `<circle cx="50" cy="50" r="${mood === 'sorpresa' ? 14 : 11}" fill="${c}"/><circle cx="50" cy="50" r="${mood === 'sorpresa' ? 4 : 5}" fill="#05010c"/><circle cx="46" cy="46" r="2.4" fill="#fff"/>`;
  return `<svg viewBox="0 0 100 100" class="pt-eter m-${mood}" aria-label="ÉTER"><defs><linearGradient id="eg${mood}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a42cff"/><stop offset="1" stop-color="#39c8ff"/></linearGradient></defs><circle cx="50" cy="50" r="38" fill="#05010c" stroke="url(#eg${mood})" stroke-width="7" stroke-dasharray="200 20" transform="rotate(-62 50 50)"/><path d="M71 15 l9 -3 -3 9z" fill="#39c8ff"/><circle cx="50" cy="50" r="30" fill="none" stroke="${c}" stroke-opacity=".25" stroke-width="1"/><path d="M24 50 Q50 26 76 50 Q50 74 24 50Z" fill="#0b0418" stroke="${c}" stroke-width="2"/>${iris}${lid}</svg>`;
}
const full = (mood, rank, look) => `<svg viewBox="-14 -34 128 236" aria-label="Doc"><g class="docb">${body(mood, rank, look)}</g></svg>`;
DE.CH = { doc, eter, body, full, OPT, LOOK0, clean, setLook, look: () => LOOK };
})();
