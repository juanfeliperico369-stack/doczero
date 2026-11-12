/* ============================================================
   DOC ELEMENT · LA NAVE OUROBOROS (menú principal dibujado)
   Corte lateral de la nave: cada sala es un botón (data-act="room").
   Solo dibuja: qué hace cada sala lo decide ui.js (openRoom).
   vm = { next, threat, locks:{id:texto}, newFr, nFr, lvl, mood, rank }
   ============================================================ */
'use strict';
(function () {
/* salas: r = [x, y, ancho, alto] o p = contorno; t = posición del letrero; doc = [x, piso] donde se para Doc; b = insignia */
const ROOMS = [
  { id: 'forge', n: 'Forja', s: 'crear elementos', ic: '☢', r: [124, 126, 180, 170], doc: [272, 296] },
  { id: 'react', n: 'Reactor', s: 'mezclar sustancias', ic: '⇄', r: [310, 126, 160, 170], doc: [438, 296] },
  { id: 'lab', n: 'Laboratorio', s: 'armar moléculas', ic: '⚛', r: [476, 126, 300, 170], doc: [528, 296] },
  { id: 'gen', n: 'Genética', s: 'leer el ADN', ic: '⚭', r: [782, 126, 160, 170], doc: [908, 296] },
  { id: 'puente', n: 'Puente', s: 'misiones y amenazas', ic: '☣', p: 'M948 126 H1040 C1140 126 1226 204 1243 296 H948Z', t: [958, 156], doc: [990, 296], b: [1192, 196], bb: [948, 126, 295, 170] },
  { id: 'bodega', n: 'Bodega', s: 'tus frascos', ic: '⚱', r: [124, 304, 180, 170], doc: [272, 474] },
  { id: 'destil', n: 'Destilería', s: 'separar líquidos', ic: '⚗', r: [310, 304, 170, 170], doc: [450, 474] },
  { id: 'eter', n: 'ÉTER', s: 'mente de la nave', ic: '◉', r: [486, 304, 150, 170] },
  { id: 'cryo', n: 'Criogenia', s: 'escuela y memoria', ic: '❄', r: [642, 304, 200, 170], doc: [810, 474] },
  { id: 'cult', n: 'Cultivo', s: 'seres vivos', ic: '❀', r: [848, 304, 170, 170], doc: [988, 474] },
  { id: 'tx', n: 'Transmisiones', s: 'videos de Doc', ic: '▶', p: 'M1024 304 H1243 C1226 396 1140 474 1040 474 H1024Z', t: [1034, 334], doc: [1124, 466], b: [1196, 336], bb: [1024, 304, 219, 170] },
  { id: 'obs', n: 'Observatorio', s: 'átomos y luz', ic: '✺', p: 'M596 14 H884 V110 H596Z', bb: [596, 14, 288, 96], t: [602, 56], b: [872, 30], ext: 1 },
  { id: 'antena', n: 'Antena', s: 'reto diario y duelos', ic: '📡', p: 'M900 18 H1130 V108 H900Z', bb: [900, 18, 230, 90], t: [1004, 52], b: [1114, 32], ext: 1 }
];
const ROOM = {}; ROOMS.forEach(r => ROOM[r.id] = r);
const esc = s => DE.esc(s);
const rect = (x, y, w, h, c, ex) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${c || ''}" ${ex || ''}/>`;
/* ---------- interiores ---------- */
const IN = {
  forge: () => `<rect x="130" y="287" width="168" height="8" fill="url(#haz)"/>
    <circle cx="194" cy="236" r="44" class="k3 thick dash"/><circle cx="194" cy="236" r="32" class="k2"/>${[0, 90, 180, 270].map(a => `<rect x="188" y="186" width="12" height="10" class="f1 k2" transform="rotate(${a} 194 236)"/>`).join('')}
    <circle cx="194" cy="236" r="15" fill="url(#gcore)"/><g class="spin" style="transform-origin:194px 236px"><circle cx="232" cy="236" r="5.5" fill="#39c8ff"/><circle cx="156" cy="236" r="5.5" fill="#ff2fb3"/></g>
    <text x="194" y="242" class="ico">☢</text>`,
  react: () => `<path d="M360 180 V186 M346 180 H374" class="k2"/>
    <path d="M350 186 V208 A30 30 0 1 0 370 208 V186" class="k1 thick f0"/><path d="M332 240 A30 30 0 0 0 388 240 Z" fill="#ff2fb3" opacity=".75"/>
    <circle class="bub" cx="352" cy="236" r="3" fill="#ffb3e6"/><circle class="bub b2" cx="366" cy="232" r="2.4" fill="#ffb3e6"/><circle class="bub b3" cx="360" cy="240" r="2" fill="#ffb3e6"/>
    ${rect(344, 274, 32, 14, 'f1 k2')}<path class="flame" d="M352 274 Q360 256 368 274Z" fill="#ffc23a" style="transform-origin:360px 274px"/>`,
  lab: () => `${rect(700, 190, 66, 46, 'f0 k1')}<text x="733" y="219" class="mono">H₂O</text><path d="M733 236 V246" class="k1"/>
    <path d="M606 208 H692" class="k2"/>${['#39c8ff', '#ff2fb3', '#2dffb3', '#ffc23a'].map((c, i) => `<rect x="${612 + i * 21}" y="186" width="12" height="21" rx="4" fill="${c}" opacity=".85"/><rect x="${614 + i * 21}" y="181" width="8" height="6" class="f1"/>`).join('')}
    ${rect(488, 246, 210, 9, 'bench')}${rect(498, 255, 7, 36, 'f1')}${rect(682, 255, 7, 36, 'f1')}
    <g class="float"><path d="M578 236 L608 222 L638 236" class="k5"/><circle cx="608" cy="222" r="13" fill="#ff2fb3"/><circle cx="576" cy="237" r="8" fill="#e9f6ff"/><circle cx="640" cy="237" r="8" fill="#e9f6ff"/></g>`,
  gen: () => { let a = '', b = '', r = ''; for (let i = 0; i <= 12; i++) { const y = 186 + i * 8.5, s = Math.sin(i * .55) * 20; a += (i ? 'L' : 'M') + (826 + s) + ' ' + y; b += (i ? 'L' : 'M') + (826 - s) + ' ' + y; if (i % 2 === 0) r += `<path d="M${826 + s} ${y} H${826 - s}" stroke="${['#2dffb3', '#ff2fb3', '#39c8ff', '#c77dff'][i / 2 % 4]}" stroke-width="3"/>`; }
    return `${r}<path d="${a}" class="k1 thick"/><path d="${b}" class="k2 thick"/>${rect(796, 280, 60, 9, 'bench')}`; },
  puente: vm => `<clipPath id="win"><path d="M1046 188 H1160 C1178 200 1194 228 1206 258 H1046Z"/></clipPath>
    <g clip-path="url(#win)"><rect x="1046" y="188" width="164" height="72" fill="#02010a"/>${STARS(1046, 188, 160, 70, 18, 7)}<circle cx="1158" cy="232" r="22" fill="url(#gplan)"/><ellipse cx="1158" cy="232" rx="36" ry="7" class="k3" opacity=".7"/>${vm.threat ? '<g class="alarm"><circle cx="1088" cy="224" r="18" fill="#ff2fb3" opacity=".35"/><text x="1088" y="233" class="ico big">☣</text></g>' : ''}</g>
    <path d="M1046 188 H1160 C1178 200 1194 228 1206 258 H1046Z" class="k1 thick"/>
    ${rect(1040, 262, 150, 22, 'f1 k2')}${[0, 1, 2, 3, 4, 5].map(i => `<circle class="led l${i % 3}" cx="${1054 + i * 14}" cy="273" r="3.5"/>`).join('')}<text x="1162" y="279" class="mono sm">N${vm.lvl}</text>`,
  bodega: vm => `${[[134, 422], [184, 422], [158, 376]].map(([x, y]) => `<g>${rect(x, y, 46, 46, 'f1 k3')}<path d="M${x} ${y}L${x + 46} ${y + 46}M${x + 46} ${y}L${x} ${y + 46}" class="k3" opacity=".5"/></g>`).join('')}
    <text x="181" y="406" class="mono">${vm.nFr}</text>${vm.newFr ? '<g class="alarm"><circle cx="226" cy="372" r="9" fill="#ff2fb3"/><text x="226" y="377" class="badge">✦</text></g>' : ''}`,
  destil: () => `${[['#39c8ff', '#ff2fb3', '#2dffb3'], ['#ffc23a', '#39c8ff', '#ffc23a'], ['#2dffb3', '#ff2fb3', '#c77dff'], ['#c77dff', '', '']].map((c, i) => { const x = 322 + i * 24; return c.map((k, j) => k ? rect(x + 2, 446 - j * 22, 14, 21, '', `fill="${k}" opacity=".85"`) : '').join('') + `<path d="M${x} 382 V460 Q${x} 468 ${x + 9} 468 Q${x + 18} 468 ${x + 18} 460 V382" class="k1"/>`; }).join('')}
    <path d="M330 376 Q350 360 370 376 T410 376" class="k2"/>`,
  eter: vm => `${[[492, 352, 528, 380], [630, 352, 594, 380], [492, 450, 526, 424], [630, 450, 596, 424]].map(([a, b, c, d]) => `<path d="M${a} ${b} Q${(a + c) / 2} ${b + 20} ${c} ${d}" class="k2"/>`).join('')}
    <circle cx="561" cy="402" r="58" class="k2 dash spin" style="transform-origin:561px 402px"/>${DE.CH.eter(vm.eter || 'neutral').replace('<svg ', '<svg x="511" y="352" width="100" height="100" ')}`,
  cryo: vm => `<text x="812" y="404" class="mono">${vm.awake || 0}/5</text><text x="812" y="422" class="rs mid">despiertos</text>${[650, 694, 738].map((x, i) => `<g><rect x="${x}" y="356" width="38" height="112" rx="19" class="${i && i > (vm.awake || 0) ? 'pod' : 'pod open'}"/>${i && i > (vm.awake || 0) ? `<circle cx="${x + 19}" cy="384" r="8" fill="#8fb3ff" opacity=".5"/><path d="M${x + 7} 420 Q${x + 19} 396 ${x + 31} 420 V452 H${x + 7}Z" fill="#8fb3ff" opacity=".35"/>` : `<path d="M${x + 38} 360 L${x + 50} 368 V460 L${x + 38} 466" class="k1"/>`}<circle class="led l${i}" cx="${x + 19}" cy="364" r="3"/></g>`).join('')}`,
  cult: () => `<path d="M862 462 Q862 392 902 392 Q942 392 942 462Z" class="k5 f0" opacity=".9"/><path d="M902 462 V420 M902 432 Q886 420 880 428 Q890 440 902 436 M902 424 Q918 410 926 420 Q914 432 902 428" class="k5"/>
    <ellipse cx="902" cy="466" rx="44" ry="6" class="k1"/>${rect(856, 466, 92, 6, 'bench')}`,
  tx: () => `${rect(1036, 360, 74, 46, 'f0 k1 thick')}<path d="M1066 372 L1084 383 L1066 394Z" fill="#ffc23a"/><path d="M1046 410 H1100 M1073 406 V418" class="k2"/>
    <circle cx="1180" cy="362" r="18" class="k2"/><circle cx="1180" cy="362" r="4" fill="#a42cff"/>${[0, 72, 144, 216, 288].map(a => `<circle cx="1180" cy="351" r="3.5" class="f1" transform="rotate(${a} 1180 362)"/>`).join('')}`,
  antena: () => `<path d="M934 108 V74" class="k2 thick"/><path d="M906 44 Q922 84 962 76" class="k1 thick f0"/><path d="M922 60 L946 40" class="k1"/><circle cx="948" cy="38" r="4" fill="#ffc23a"/>
    <g class="wave"><path d="M958 30 Q968 38 962 50" class="k3"/><path d="M966 22 Q982 38 970 58" class="k3" opacity=".6"/></g>`,
  obs: () => `<path d="M748 112 A62 58 0 0 1 872 112Z" fill="rgba(57,200,255,.1)" class="k1 thick"/><path d="M768 112 A42 40 0 0 1 852 112 M810 54 V112" class="k1" opacity=".45"/>${STARS(754, 64, 110, 44, 9, 11)}
    <g transform="rotate(-28 810 100)"><rect x="800" y="52" width="20" height="50" rx="4" class="f1 k3"/><rect x="796" y="48" width="28" height="10" rx="3" class="f1 k3"/></g><circle cx="810" cy="104" r="6" fill="#ffc23a"/>`
};
/* estrellas con semilla (siempre iguales) */
function STARS(x, y, w, h, n, seed) { const r = DE.mulberry(seed); let s = ''; for (let i = 0; i < n; i++) { const a = r(); s += `<circle cx="${(x + r() * w).toFixed(1)}" cy="${(y + r() * h).toFixed(1)}" r="${(.6 + a * 1.4).toFixed(1)}" class="${a > .8 ? 'tw' : 'st'}"/>`; } return s; }
const HULL = 'M110 112 H1040 C1150 112 1246 196 1262 300 C1246 404 1150 488 1040 488 H110 L84 462 V138Z';
function hull(dim) {
  return `<path d="M170 112 L250 58 H332 L384 112Z M170 488 L250 542 H332 L384 488Z" class="fin"/>
    ${[150, 270, 390].map(y => `<path class="flame${dim ? ' dim' : ''}" d="M44 ${y + 12} Q${dim ? 22 : 6} ${y + 30} 44 ${y + 48}Z" style="transform-origin:44px ${y + 30}px"/><path d="M44 ${y} L84 ${y + 10} V${y + 50} L44 ${y + 60}Z" class="noz"/>`).join('')}
    <path d="${HULL}" class="hull"/><circle cx="292" cy="88" r="13" class="k5"/><path d="M302 79 l7 -4 -1 8z" fill="#2dffb3"/>`;
}
function plate(r) {
  const [x, y] = r.t || [r.r[0] + 10, r.r[1] + 30];
  return `<text x="${x}" y="${y}" class="rn">${esc(r.n)}</text><text x="${x}" y="${y + 18}" class="rs">${esc(r.s)}</text>`;
}
function badge(r) { const [bx, by] = r.b || [r.r[0] + r.r[2] - 20, r.r[1] + 22]; return `<g class="bdg"><circle cx="${bx}" cy="${by}" r="15"/><text x="${bx}" y="${by + 7}" class="badge">!</text></g>`; }
function lock(r, why) {
  const [x, y, w, h] = r.r || r.bb, cx = x + w / 2, cy = y + h / 2 + 8;
  return `${rect(x, y, w, h, 'shade')}<rect x="${cx - 13}" y="${cy - 8}" width="26" height="20" rx="3" class="f1 k3"/><path d="M${cx - 8} ${cy - 8} V${cy - 15} A8 8 0 0 1 ${cx + 8} ${cy - 15} V${cy - 8}" class="k3 thick"/><text x="${cx}" y="${cy + 34}" class="rs mid">${esc(why)}</text>`;
}
function svg(vm) {
  vm = Object.assign({ locks: {}, lvl: 1, nFr: 0, mood: 'feliz', rank: 0 }, vm);
  let rooms = '';
  ROOMS.forEach(r => {
    const lk = vm.locks[r.id], nx = vm.next === r.id && !lk, shape = r.p ? `<path d="${r.p}" class="rbg"/>` : rect(...r.r, 'rbg');
    rooms += `<g class="room${nx ? ' next' : ''}${lk ? ' lock' : ''}${r.ext ? ' ext' : ''}" data-act="room" data-arg="${r.id}" role="button" tabindex="0" aria-label="${esc(r.n + ': ' + r.s + (lk ? ' (' + lk + ')' : nx ? ' · siguiente misión' : ''))}">${shape}<g class="rin">${IN[r.id](vm)}</g>${plate(r)}${lk ? lock(r, lk) : ''}${nx ? badge(r) : ''}</g>`;
  });
  const spot = (ROOM[vm.next] && ROOM[vm.next].doc && !vm.locks[vm.next] ? ROOM[vm.next] : ROOM.lab).doc;
  const crew = (vm.crew || []).map((c, i) => `<g class="crew" data-act="crew" data-arg="${c.i}" role="button" tabindex="0" aria-label="${esc(c.n)}: tócalo para un consejo" transform="translate(${c.at[0] - 22} ${c.at[1] - 91}) scale(.45)"><g class="docb" style="animation-delay:-${i * .7}s">${DE.CH.body(c.mood || 'neutral', 0, c.look)}</g></g>`).join('');
  const docG = `<g class="docw" data-act="custom" role="button" tabindex="0" aria-label="Tu personaje: tócalo para cambiar su aspecto" transform="translate(${spot[0] - 30} ${spot[1] - 122}) scale(.6)"><g class="docb">${DE.CH.body(vm.mood, vm.rank)}</g></g>`;
  return `<svg id="ship" viewBox="0 0 1280 600" preserveAspectRatio="xMidYMid meet" aria-label="Nave Ouroboros">
  <defs><pattern id="haz" width="16" height="8" patternUnits="userSpaceOnUse" patternTransform="skewX(-40)"><rect width="8" height="8" fill="#ffc23a"/><rect x="8" width="8" height="8" fill="#000"/></pattern>
   <radialGradient id="gcore"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="#ffc23a"/><stop offset="1" stop-color="#ff2fb3" stop-opacity="0"/></radialGradient>
   <radialGradient id="gplan" cx=".35" cy=".35"><stop offset="0" stop-color="#8fb3ff"/><stop offset=".6" stop-color="#4d1785"/><stop offset="1" stop-color="#05010b"/></radialGradient>
   <linearGradient id="ghull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1050"/><stop offset=".5" stop-color="#140630"/><stop offset="1" stop-color="#22093f"/></linearGradient></defs>
  <g class="sky">${STARS(0, 0, 1280, 600, 90, 3)}</g>
  ${hull()}
  <path d="M124 126 H1040 C1140 126 1226 204 1244 300 C1226 396 1140 474 1040 474 H124Z" class="inner"/>
  ${rooms}
  ${rect(124, 296, 1120, 8, 'deck')}
  ${crew}${docG}
  <text x="214" y="520" class="stencil">OUROBOROS</text>
  </svg>`;
}
DE.ship = { svg, hull, ROOMS, ROOM, HULL };
})();
