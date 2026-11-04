/* ============================================================
   DOC ELEMENT · PERSONAJES (SVG original, sin imágenes externas)
   DOC: tú. Tupé morado asimétrico, visor de un ojo y traje de criogenia; se vuelve más loco con cada rango (0 despierto → 4 ente)
   ÉTER: la inteligencia de la Ouroboros, un ojo dentro de una serpiente que se muerde la cola
   ánimos: neutral · feliz · sorpresa · loco · triste · enojado
   ============================================================ */
'use strict';
(function () {
const EYE = { neutral: '#39c8ff', feliz: '#2dffb3', sorpresa: '#ffc23a', loco: '#ff2fb3', triste: '#8fb3ff', enojado: '#ff2fb3' };
function doc(mood, rank) {
  mood = mood || 'neutral'; rank = Math.max(0, Math.min(4, rank | 0));
  const skin = '#d9c3b0', glow = rank >= 3;
  // tupé asimétrico tipo llama: crece y brilla con el rango
  const h = 6 + rank * 5, hairC = rank >= 2 ? 'url(#dh)' : '#5b2bd6';
  const hair = `M29 44 Q27 22 46 18 Q${58 + rank * 2} ${12 - h} ${74 + rank} ${10 - h * .6} Q70 ${20 - h * .2} 72 30 Q74 36 71 44 Q66 30 50 29 Q36 30 29 44Z`;
  const brows = { neutral: 'M37 38 L45 37 M55 37 L63 38', feliz: 'M37 36 Q41 34 45 36 M55 36 Q59 34 63 36', sorpresa: 'M37 33 Q41 30 45 33 M55 33 Q59 30 63 33', loco: 'M36 39 L45 34 M55 33 L64 37', triste: 'M37 36 L45 39 M55 39 L63 36', enojado: 'M37 35 L46 39 M54 39 L63 35' }[mood];
  const er = mood === 'sorpresa' ? 4.8 : 4, pupil = glow ? '#2dffb3' : '#120a22';
  const eyeL = mood === 'feliz' ? '<path d="M37 44 Q41 40 45 44" stroke="#120a22" stroke-width="2.2" fill="none" stroke-linecap="round"/>' : `<ellipse cx="41" cy="44" rx="${mood === 'loco' ? 5.4 : er}" ry="${mood === 'loco' ? 5.4 : er}" fill="#fff"/><circle cx="${mood === 'triste' ? 41 : 42}" cy="${mood === 'triste' ? 45.5 : 44}" r="${mood === 'loco' ? 1.3 : 2}" fill="${pupil}"/>`;
  // visor de un solo ojo (derecho): se vuelve más complejo con el rango
  const visor = `<path d="M52 38 L68 37 Q71 44 67 50 L53 50 Q50 44 52 38Z" fill="#39c8ff" fill-opacity="${mood === 'loco' ? .75 : .45}" stroke="#a42cff" stroke-width="2"/><path d="M68 41 L76 39" stroke="#a42cff" stroke-width="2"/>` + (rank >= 1 ? '<circle cx="60" cy="44" r="2.4" fill="#ff2fb3"/>' : '') + (rank >= 3 ? '<path d="M54 47 L66 47" stroke="#2dffb3" stroke-width="1"/>' : '');
  const mouth = { neutral: '<path d="M44 58 L56 58" stroke="#5a2a2a" stroke-width="2" stroke-linecap="round"/>', feliz: '<path d="M42 56 Q50 63 58 56" stroke="#5a2a2a" stroke-width="2.2" fill="none" stroke-linecap="round"/>', sorpresa: '<ellipse cx="50" cy="59" rx="3.5" ry="4.5" fill="#3a1520"/>', loco: '<path d="M39 55 Q50 66 61 55 Z" fill="#3a1520"/><path d="M41 56 L59 56 L57 58.5 L43 58.5Z" fill="#fff"/>', triste: '<path d="M43 60 Q50 55 57 60" stroke="#5a2a2a" stroke-width="2.2" fill="none" stroke-linecap="round"/>', enojado: '<path d="M43 59 L57 57" stroke="#5a2a2a" stroke-width="2.4" stroke-linecap="round"/>' }[mood];
  // traje de criogenia con el emblema de la Ouroboros; al subir de rango, bata con manchas
  const suit = '<path d="M12 100 Q14 76 36 70 L50 78 L64 70 Q86 76 88 100Z" fill="#0b2a44" stroke="#39c8ff" stroke-width="1.5"/><path d="M36 70 L50 78 L64 70" stroke="#2dffb3" stroke-width="2" fill="none"/><circle cx="50" cy="90" r="5" fill="none" stroke="#2dffb3" stroke-width="1.8" stroke-dasharray="24 6"/>' + (rank >= 2 ? '<path d="M12 100 Q14 76 30 71 L36 100Z M88 100 Q86 76 70 71 L64 100Z" fill="#e6eefc" opacity=".92"/><circle cx="24" cy="90" r="2.6" fill="#ff2fb3"/><circle cx="76" cy="86" r="2" fill="#ffc23a"/>' : '');
  const scar = rank >= 1 ? '<path d="M33 50 L37 56" stroke="#b07a6a" stroke-width="1.3"/>' : '';
  const aura = rank >= 4 ? '<circle cx="50" cy="50" r="47" fill="none" stroke="#ffc23a" stroke-width="1.5" stroke-dasharray="3 5"/>' : '';
  return `<svg viewBox="0 0 100 100" class="pt-doc m-${mood}" aria-label="Doc"><defs><linearGradient id="dh" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#5b2bd6"/><stop offset="1" stop-color="#39c8ff"/></linearGradient></defs>${aura}${suit}<rect x="44" y="62" width="12" height="10" fill="${skin}"/><ellipse cx="50" cy="47" rx="20" ry="22" fill="${skin}"/><path d="${hair}" fill="${hairC}"/><path d="M30 46 Q29 40 31 36" stroke="#5b2bd6" stroke-width="3" fill="none"/><path d="${brows}" stroke="#3b1f7a" stroke-width="2.4" fill="none" stroke-linecap="round"/>${eyeL}${visor}<path d="M50 47 L48 53 L51 53" stroke="#a88470" stroke-width="1.4" fill="none"/>${mouth}${scar}${glow ? '<circle cx="41" cy="44" r="6" fill="#2dffb3" opacity=".16"/>' : ''}</svg>`;
}
function eter(mood) {
  mood = mood || 'neutral'; const c = EYE[mood] || EYE.neutral;
  const lid = { feliz: '<path d="M26 52 Q50 30 74 52" stroke="#e9f6ff" stroke-width="3" fill="none" stroke-linecap="round"/>', enojado: '<path d="M26 40 L74 50" stroke="#ff2fb3" stroke-width="4" stroke-linecap="round"/>', triste: '<path d="M28 58 Q50 66 72 58" stroke="#8fb3ff" stroke-width="3" fill="none"/><path d="M62 62 q3 6 0 9 q-3 -3 0 -9" fill="#8fb3ff"/>' }[mood] || '';
  const iris = mood === 'feliz' ? '' : `<circle cx="50" cy="50" r="${mood === 'sorpresa' ? 14 : 11}" fill="${c}"/><circle cx="50" cy="50" r="${mood === 'sorpresa' ? 4 : 5}" fill="#05010c"/><circle cx="46" cy="46" r="2.4" fill="#fff"/>`;
  return `<svg viewBox="0 0 100 100" class="pt-eter m-${mood}" aria-label="ÉTER"><defs><linearGradient id="eg${mood}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a42cff"/><stop offset="1" stop-color="#39c8ff"/></linearGradient></defs><circle cx="50" cy="50" r="38" fill="#05010c" stroke="url(#eg${mood})" stroke-width="7" stroke-dasharray="200 20" transform="rotate(-62 50 50)"/><path d="M71 15 l9 -3 -3 9z" fill="#39c8ff"/><circle cx="50" cy="50" r="30" fill="none" stroke="${c}" stroke-opacity=".25" stroke-width="1"/><path d="M24 50 Q50 26 76 50 Q50 74 24 50Z" fill="#0b0418" stroke="${c}" stroke-width="2"/>${iris}${lid}</svg>`;
}
DE.CH = { doc, eter };
})();
