/* ============================================================
   DOC ELEMENT · ENGINE  (química, núcleos, batalla, partida)
   Sin DOM: se puede probar en Node o en el bot.
   ============================================================ */
'use strict';
const DE = (typeof window !== 'undefined' ? (window.DE = window.DE || {}) : {});

/* ---------- utilidades ---------- */
const djb = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function mulberry(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const SUPD = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUBD = '₀₁₂₃₄₅₆₇₈₉';
const sup = n => String(n).split('').map(d => SUPD[+d] || d).join('');
const subU = n => String(n).split('').map(d => SUBD[+d] || d).join('');
const parseTags = s => { const o = {}; (s || '').split(',').filter(Boolean).forEach(t => { const m = t.match(/^([a-z]+)(\d)$/); if (m) o[m[1]] = +m[2]; }); return o; };

/* ---------- tabla periódica ---------- */
const ELEMENTS = [null];
const SYM = {};
ELEM_RAW.split('|').forEach((r, i) => { const [s, n, m] = r.split(' '); ELEMENTS.push({ z: i + 1, sym: s, name: n, mass: +m }); SYM[s] = i + 1; });
const SYS_R = ['nil', 'un', 'bi', 'tri', 'cuad', 'pent', 'hex', 'sept', 'oct', 'enn'], SYS_S = 'nubtqphsoe';
function sysName(z) {
  const d = String(z).split('').map(Number);
  let n = d.map(x => SYS_R[x]).join('') + 'io';
  n = n.replace('ennnil', 'ennil').replace(/(bi|tri)io$/, '$1o');
  return { sym: d.map(x => SYS_S[x]).join('').replace(/^./, c => c.toUpperCase()), name: n[0].toUpperCase() + n.slice(1) };
}
function catOf(z) {
  if ([2, 10, 18, 36, 54, 86, 118].includes(z)) return 'noble';
  if ([3, 11, 19, 37, 55, 87].includes(z)) return 'alk';
  if ([4, 12, 20, 38, 56, 88].includes(z)) return 'alkt';
  if ([9, 17, 35, 53, 85, 117].includes(z)) return 'hal';
  if ([1, 6, 7, 8, 15, 16, 34].includes(z)) return 'nonm';
  if ([5, 14, 32, 33, 51, 52].includes(z)) return 'metd';
  if (z >= 57 && z <= 71) return 'lan';
  if (z >= 89 && z <= 103) return 'act';
  if (z > 118) return 'shv';
  if ((z >= 21 && z <= 30) || (z >= 39 && z <= 48) || (z >= 72 && z <= 80) || (z >= 104 && z <= 112)) return 'tran';
  return 'post';
}
const CAT = { noble: ['Gas noble', '#c77dff'], alk: ['Alcalino', '#ff2fb3'], alkt: ['Alcalinotérreo', '#ff8a3d'], hal: ['Halógeno', '#5affd9'], nonm: ['No metal', '#39c8ff'], metd: ['Metaloide', '#2dffb3'], lan: ['Lantánido', '#ff7ad9'], act: ['Actínido', '#ff5a7a'], tran: ['Transición', '#ffc23a'], post: ['Post-transición', '#a8ff60'], shv: ['Superpesado', '#ffffff'] };
function elem(z) {
  if (ELEMENTS[z]) return ELEMENTS[z];
  const s = sysName(z); return { z, sym: s.sym, name: s.name, mass: z * 2.5, sys: 1 };
}
const elBySym = s => SYM[s] ? ELEMENTS[SYM[s]] : null;
function valence(sym) {
  if (VALENCE[sym]) return VALENCE[sym];
  const z = SYM[sym]; if (!z) return [0];
  return { noble: [0], alk: [1], alkt: [2], hal: [1], nonm: [2], metd: [3], lan: [3], act: [3], tran: [2, 3], post: [2, 3], shv: [0] }[catOf(z)];
}
const maxVal = sym => Math.max(...valence(sym));
function tablePos(z) {
  if (z === 1) return [1, 1]; if (z === 2) return [1, 18];
  const P = [[3, 10, 2], [11, 18, 3], [19, 36, 4], [37, 54, 5], [55, 86, 6], [87, 118, 7]];
  for (const [a, b, p] of P) {
    if (z < a || z > b) continue;
    const k = z - a;
    if (p <= 3) return [p, k < 2 ? k + 1 : k + 11];
    if (p <= 5) return [p, k + 1];
    if (k < 2) return [p, k + 1];
    if (k <= 16) return [p + 3, k + 1];        // fila f (La–Lu / Ac–Lr)
    return [p, k - 13];
  }
  return [10, ((z - 119) % 18) + 1];
}

/* ---------- fórmulas ---------- */
function parseFormula(f) {
  const st = [{}]; let i = 0;
  while (i < f.length) {
    const c = f[i];
    if (c === '(') { st.push({}); i++; continue; }
    if (c === ')') { i++; let n = ''; while (/\d/.test(f[i] || '')) n += f[i++]; const g = st.pop(), t = st[st.length - 1]; for (const k in g) t[k] = (t[k] || 0) + g[k] * (+n || 1); continue; }
    const m = f.slice(i).match(/^([A-Z][a-z]?)(\d*)/); if (!m) throw new Error('fórmula inválida ' + f);
    const t = st[st.length - 1]; t[m[1]] = (t[m[1]] || 0) + (+m[2] || 1); i += m[0].length;
  }
  return st[0];
}
function hill(cnt) {
  const ks = Object.keys(cnt).filter(k => cnt[k] > 0);
  let order;
  if (cnt.C) order = ['C', ...(cnt.H ? ['H'] : []), ...ks.filter(k => k !== 'C' && k !== 'H').sort()];
  else order = ks.sort((a, b) => (EN[a] || 2) - (EN[b] || 2) || a.localeCompare(b));
  return order.map(k => k + (cnt[k] > 1 ? cnt[k] : '')).join('');
}
const fHTML = f => esc(f).replace(/(\d+)/g, '<sub>$1</sub>');
const fUni = f => f.replace(/\d+/g, d => subU(d));
const sameCount = (a, b) => { const k = new Set([...Object.keys(a), ...Object.keys(b)]); for (const x of k) if ((a[x] || 0) !== (b[x] || 0)) return false; return true; };
function molarMass(cnt) { let m = 0; for (const k in cnt) { const e = elBySym(k); m += (e ? e.mass : 0) * cnt[k]; } return m; }

/* ---------- SMILES simplificado ---------- */
function parseSmiles(s) {
  const atoms = [], bonds = [], hc = [], stack = [], rings = {};
  let i = 0, prev = -1, bo = 1;
  while (i < s.length) {
    const c = s[i];
    if (c === '(') { stack.push(prev); i++; continue; }
    if (c === ')') { prev = stack.pop(); i++; continue; }
    if (c === '-' || c === '=' || c === '#') { bo = c === '-' ? 1 : c === '=' ? 2 : 3; i++; continue; }
    if (/\d/.test(c)) {
      if (rings[c] !== undefined) { bonds.push({ a: rings[c].a, b: prev, o: Math.max(bo, rings[c].o) }); delete rings[c]; }
      else rings[c] = { a: prev, o: bo };
      bo = 1; i++; continue;
    }
    let el, h = -1;
    if (c === '[') {
      const j = s.indexOf(']', i); const m = s.slice(i + 1, j).match(/^([A-Z][a-z]?)(H(\d*))?$/);
      if (!m) throw new Error('átomo inválido en ' + s);
      el = m[1]; h = m[2] ? (m[3] === '' ? 1 : +m[3]) : 0; i = j + 1;
    } else {
      const two = s.substr(i, 2);
      if (two === 'Cl' || two === 'Br') { el = two; i += 2; }
      else if ('BCNOPSFIH'.includes(c)) { el = c; i++; if (c === 'H') h = 0; }
      else throw new Error('símbolo inválido "' + c + '" en ' + s);
    }
    if (!SYM[el]) throw new Error('elemento desconocido ' + el);
    const idx = atoms.length; atoms.push({ el }); hc.push(h);
    if (prev >= 0) bonds.push({ a: prev, b: idx, o: bo });
    bo = 1; prev = idx;
  }
  if (Object.keys(rings).length) throw new Error('anillo sin cerrar en ' + s);
  const n = atoms.length, sum = Array(n).fill(0);
  bonds.forEach(b => { sum[b.a] += b.o; sum[b.b] += b.o; });
  for (let k = 0; k < n; k++) {
    let h = hc[k];
    if (h < 0) { const v = valence(atoms[k].el).find(v => v >= sum[k]); if (v === undefined) throw new Error('valencia excedida en ' + atoms[k].el + ' (' + s + ')'); h = v - sum[k]; }
    for (let q = 0; q < h; q++) { const hi = atoms.length; atoms.push({ el: 'H' }); bonds.push({ a: k, b: hi, o: 1 }); }
  }
  return { atoms, bonds };
}

/* ---------- análisis de grafos moleculares ----------
   g = {atoms:[{el,mono?}], bonds:[{a,b,o}]} (índices) */
function adjOf(g) { const adj = g.atoms.map(() => []); g.bonds.forEach(b => { adj[b.a].push([b.b, b.o]); adj[b.b].push([b.a, b.o]); }); return adj; }
function components(g) {
  const adj = adjOf(g), seen = new Array(g.atoms.length).fill(false), out = [];
  for (let i = 0; i < g.atoms.length; i++) {
    if (seen[i]) continue; const q = [i], c = []; seen[i] = true;
    while (q.length) { const v = q.pop(); c.push(v); for (const [u] of adj[v]) if (!seen[u]) { seen[u] = true; q.push(u); } }
    out.push(c.sort((a, b) => a - b));
  }
  return out;
}
function subgraph(g, idx) {
  const map = new Map(idx.map((v, k) => [v, k]));
  return { atoms: idx.map(v => g.atoms[v]), bonds: g.bonds.filter(b => map.has(b.a) && map.has(b.b)).map(b => ({ a: map.get(b.a), b: map.get(b.b), o: b.o })) };
}
function wlHash(g) {
  const adj = adjOf(g), n = g.atoms.length;
  let lab = g.atoms.map(a => a.el);
  for (let it = 0; it < Math.min(n, 14); it++) lab = lab.map((l, i) => djb(l + '(' + adj[i].map(([j, o]) => o + lab[j]).sort().join(',') + ')'));
  return djb(lab.slice().sort().join('|'));
}
function bondSums(g) { const s = g.atoms.map(() => 0); g.bonds.forEach(b => { s[b.a] += b.o; s[b.b] += b.o; }); return s; }
function freeOf(el, sum) { const v = valence(el).find(v => v >= sum); return v === undefined ? -1 : v - sum; }
const isOrganic = g => g.bonds.some(b => { const x = g.atoms[b.a].el, y = g.atoms[b.b].el; return (x === 'C' && (y === 'H' || y === 'C')) || (y === 'C' && x === 'H'); });
function countOf(g) { const c = {}; g.atoms.forEach(a => c[a.el] = (c[a.el] || 0) + 1); return c; }
function molKey(g) { return isOrganic(g) ? 'H:' + wlHash(g) : 'F:' + hill(countOf(g)); }
function groupsOf(g) {
  const adj = adjOf(g), at = g.atoms, out = new Set();
  const nb = i => adj[i].map(([j, o]) => ({ el: at[j].el, o, j }));
  const bo = (i, j) => { const x = adj[i].find(([u]) => u === j); return x ? x[1] : 0; }, bk = (i, j) => Math.min(i, j) + '-' + Math.max(i, j), arom = new Set();
  at.forEach((a, s) => { if (a.el !== 'C') return; const dfs = p => { const v = p[p.length - 1]; if (p.length === 6) { if (bo(v, s)) { const c = [...p, s]; let d = 0; for (let k = 0; k < 6; k++) if (bo(c[k], c[k + 1]) === 2) d++; if (d === 3) for (let k = 0; k < 6; k++) arom.add(bk(c[k], c[k + 1])); } return; } for (const [u] of adj[v]) if (at[u].el === 'C' && u > s && !p.includes(u)) dfs([...p, u]); }; dfs([s]); });
  if (arom.size) out.add('aromático');
  const metals = new Set(['Li', 'Na', 'K', 'Mg', 'Ca', 'Al', 'Fe', 'Cu', 'Zn', 'Ag', 'Au', 'Pb', 'U', 'Ru', 'Be']);
  at.forEach((a, i) => {
    const N = nb(i);
    if (a.el === 'C') {
      const dO = N.filter(x => x.el === 'O' && x.o === 2).length, sO = N.filter(x => x.el === 'O' && x.o === 1);
      if (dO) {
        const ohs = sO.filter(x => nb(x.j).some(y => y.el === 'H')), ors = sO.filter(x => nb(x.j).some(y => y.el === 'C' && y.j !== i));
        if (ohs.length) out.add('ácido carboxílico'); else if (ors.length) out.add('éster');
        else if (N.some(x => x.el === 'N')) out.add('amida');
        else if (N.some(x => x.el === 'H')) out.add('aldehído'); else if (N.filter(x => x.el === 'C').length >= 2) out.add('cetona');
      }
      if (N.some(x => x.el === 'C' && x.o === 2 && !arom.has(bk(i, x.j)))) out.add('alqueno');
      if (N.some(x => x.el === 'C' && x.o === 3)) out.add('alquino');
      if (N.some(x => x.el === 'N' && x.o === 3)) out.add('nitrilo');
      if (N.some(x => ['F', 'Cl', 'Br', 'I'].includes(x.el))) out.add('haluro');
    }
    if (a.el === 'O') {
      const cs = N.filter(x => x.el === 'C'), hs = N.filter(x => x.el === 'H');
      if (N.some(x => x.el === 'O')) out.add('peróxido');
      if (hs.length === 1 && cs.length === 1 && !nb(cs[0].j).some(y => y.el === 'O' && y.o === 2)) out.add('alcohol');
      if (hs.length === 1 && N.some(x => metals.has(x.el))) out.add('hidróxido');
      if (cs.length === 2 && !cs.some(c => nb(c.j).some(y => y.el === 'O' && y.o === 2))) out.add('éter');
    }
    if (a.el === 'N' && N.every(x => x.o === 1) && N.some(x => x.el === 'C') && N.some(x => x.el === 'H')) out.add('amina');
    if (a.el === 'N' && N.some(x => x.el === 'N')) out.add('enlace N–N');
  });
  if (g.bonds.length >= g.atoms.length && g.atoms.length > 2) out.add('anillo');
  return [...out];
}
function bondType(e1, e2) { const d = Math.abs((EN[e1] || 1.8) - (EN[e2] || 1.8)); return d > 1.7 ? 'iónico' : d >= 0.4 ? 'covalente polar' : 'covalente apolar'; }

/* ---------- catálogo ---------- */
const DB = { comp: {}, poly: {}, byKey: {}, polyByKey: {}, errors: [] };
function buildDB() {
  DB.comp = {}; DB.byKey = {}; DB.poly = {}; DB.polyByKey = {}; DB.errors = [];
  COMPOUNDS.forEach(r => {
    const [id, f, name, smi, tags, desc, flags] = r;
    const c = { id, f, name, tags: parseTags(tags), desc, mono: (flags || '').includes('M'), s2: (flags || '').includes('S2'), keys: [], smiles: smi.split(' ') };
    try {
      const want = parseFormula(f);
      c.smiles.forEach(s => {
        const g = parseSmiles(s);
        if (!sameCount(countOf(g), want)) DB.errors.push(id + ': SMILES ' + s + ' da ' + hill(countOf(g)) + ' y no ' + f);
        const k = molKey(g);
        if (DB.byKey[k] && DB.byKey[k] !== id) DB.errors.push(id + ': clave repetida con ' + DB.byKey[k]);
        DB.byKey[k] = id; c.keys.push(k); c.g = c.g || g;
      });
      c.cnt = want; c.mass = molarMass(want); c.atoms = Object.values(want).reduce((a, b) => a + b, 0);
      c.groups = groupsOf(c.g); c.org = isOrganic(c.g);
      if (c.mono && !c.g.bonds.some(b => b.o === 2 && c.g.atoms[b.a].el === 'C' && c.g.atoms[b.b].el === 'C')) DB.errors.push(id + ': monómero sin C=C');
    } catch (e) { DB.errors.push(id + ': ' + e.message); }
    if (DB.comp[id]) DB.errors.push('id repetido ' + id);
    DB.comp[id] = c;
  });
  POLYMERS.forEach(([id, mk, name, tags, desc]) => {
    const ms = mk.split('+');
    ms.forEach(m => { if (!DB.comp[m] || !DB.comp[m].mono) DB.errors.push(id + ': monómero inválido ' + m); });
    if (ms.slice().sort().join('+') !== mk) DB.errors.push(id + ': monómeros fuera de orden');
    DB.poly[id] = { id, mk, ms, name, tags: parseTags(tags), desc };
    DB.polyByKey[mk] = id;
  });
}
buildDB();

/* ---------- híbridos (compuestos teóricos) ---------- */
const GREEK = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ';
const ROOT = { C: 'carb', N: 'azo', O: 'oxi', S: 'tio', Si: 'sil', F: 'fluor', Cl: 'clor', P: 'fosf', B: 'bor', Fe: 'ferr', Cu: 'cupr', Al: 'alum', Mg: 'magn', Na: 'sod', Li: 'lit', Ca: 'calc', H: 'hidr', Be: 'beril', U: 'uran', Ru: 'ruten', Au: 'aur', Pb: 'plumb' };
function makeHybrid(g) {
  const cnt = countOf(g), key = molKey(g), h = parseInt(djb(key), 36);
  const heavy = Object.keys(cnt).filter(k => k !== 'H').sort((a, b) => cnt[b] - cnt[a] || a.localeCompare(b));
  const r1 = ROOT[heavy[0]] || (heavy[0] || 'H').toLowerCase(), r2 = heavy[1] ? (ROOT[heavy[1]] || heavy[1].toLowerCase()) : '';
  const maxO = g.bonds.reduce((m, b) => Math.max(m, b.o), 1), grp = groupsOf(g);
  const suf = ['ano', 'eno', 'ino'][maxO - 1];
  const nm = (grp.includes('anillo') ? 'Ciclo' + r2 + r1 : (r2 ? r2 + r1 : r1)) + suf;
  const name = nm[0].toUpperCase() + nm.slice(1) + ' ' + GREEK[h % 24] + '-' + (h % 97);
  const t = {}, add = (k, v) => t[k] = Math.min(3, (t[k] || 0) + v);
  if (grp.includes('ácido carboxílico')) add('acid', 2);
  if (grp.includes('amina')) add('base', 1);
  if (grp.includes('hidróxido')) add('base', 2);
  if (Object.keys(cnt).every(k => k === 'C' || k === 'H')) add('fuel', cnt.C >= 3 ? 3 : 2);
  if (grp.includes('alqueno') || grp.includes('alquino')) add('fuel', 1);
  if (grp.includes('peróxido')) add('oxi', 2);
  if (grp.includes('haluro')) add('anti', 1);
  if (grp.includes('alcohol')) { add('solv', 1); add('anti', 1); }
  if (grp.includes('aldehído')) add('anti', 1);
  if (grp.includes('anillo') && (cnt.C || 0) >= 5) add('org', 1);
  if (grp.includes('aromático')) add('org', 1);
  if (grp.includes('enlace N–N') || grp.includes('alquino')) add('nrg', 1);
  if (grp.includes('amina') && grp.includes('ácido carboxílico')) add('bio', 2);
  if (heavy.some(k => ['Si', 'Al', 'Mg', 'Ca', 'Be'].includes(k)) && cnt.O) add('struct', 1);
  if (heavy.some(k => ['Cu', 'Fe', 'Al', 'Au'].includes(k))) add('cond', 1);
  if (heavy.some(k => ['Na', 'K', 'Li', 'Mg', 'Ca'].includes(k)) && heavy.some(k => ['Cl', 'F', 'Br', 'I'].includes(k))) add('salt', 1);
  if (g.atoms.length - (cnt.H || 0) >= 10) add('struct', 1);
  if (!Object.keys(t).length) t.org = 1;
  return { id: 'X' + djb(key), key, f: hill(cnt), name, tags: t, cnt, mass: molarMass(cnt), groups: grp, hyb: 1,
    desc: 'Compuesto teórico fuera del catálogo de ÉTER. Grupos: ' + (grp.join(', ') || 'ninguno reconocido') + '. Propiedades predichas por sus grupos funcionales.' };
}

/* ---------- forja nuclear ---------- */
const NUC = {
  key(z, a) { return z === 0 ? 'n' : z === 1 && a === 1 ? 'p' : z === 1 && a === 2 ? 'D' : z === 1 && a === 3 ? 'T' : elem(z).sym + a; },
  parse(k) { if (k === 'n') return { z: 0, a: 1 }; if (k === 'p') return { z: 1, a: 1 }; if (k === 'D') return { z: 1, a: 2 }; if (k === 'T') return { z: 1, a: 3 };
    const m = k.match(/^([A-Z][a-z]*)(\d+)$/); if (!m) return null; let z = SYM[m[1]]; if (!z) { for (let q = 119; q < 140; q++) if (sysName(q).sym === m[1]) z = q; } return z ? { z, a: +m[2] } : null; },
  label(z, a) { return z === 0 ? 'n' : z === 1 && a === 1 ? 'p⁺' : sup(a) + elem(z).sym; },
  name(z, a) { return z === 0 ? 'Neutrón' : z === 1 && a === 1 ? 'Protón' : z === 1 && a === 2 ? 'Deuterio' : z === 1 && a === 3 ? 'Tritio' : elem(z).name + '-' + a; },
  zs(a) { return a / (1.98 + 0.0155 * Math.pow(a, 2 / 3)); },
  be(z, a) {
    const r = BE_REAL[z + '-' + a]; if (r !== undefined) return r;
    if (a <= 1) return 0;
    const n = a - z; let B = 15.75 * a - 17.8 * Math.pow(a, 2 / 3) - 0.711 * z * (z - 1) / Math.cbrt(a) - 23.7 * (a - 2 * z) * (a - 2 * z) / a;
    const d = 11.18 / Math.sqrt(a); if (z % 2 === 0 && n % 2 === 0) B += d; else if (z % 2 === 1 && n % 2 === 1) B -= d;
    return Math.max(0, B);
  },
  radio(z, a) { return z >= 84 || z === 43 || z === 61 || (z === 1 && a === 3) || z > 103; },
  fuse(ins, flux) {
    flux = flux | 0; const items = ins.filter(Boolean);
    const R = { ok: false, steps: [], cost: 0, gain: 0, net: 0, Z: 0, A: 0, kind: 'fail', prod: null, msg: '' };
    if (items.length + (flux > 0 ? 1 : 0) < 2) { R.msg = 'Necesitas al menos dos partículas.'; return R; }
    let Z = 0, A = flux, bar = 0, cz = 0, ca = 0;
    items.forEach(it => { if (cz > 0 && it.z > 0) bar += 1.44 * cz * it.z / (1.2 * (Math.cbrt(ca) + Math.cbrt(it.a))); cz += it.z; ca += it.a; Z += it.z; A += it.a; });
    R.Z = Z; R.A = A; R.cost = Math.round(bar * 0.25 + flux);
    const done = (z, a, kind, msg) => {
      R.prod = { z, a }; R.kind = kind; R.ok = true; R.msg = msg || '';
      const dE = NUC.be(z, a) - items.reduce((s, it) => s + NUC.be(it.z, it.a), 0);
      R.dE = dE; R.gain = dE > 0 ? Math.round(dE * 1.5) : 0; R.cost += dE < 0 ? Math.round(-dE * 0.3) : 0; R.net = R.gain - R.cost; return R;
    };
    const fail = (msg, kind) => { R.kind = kind || 'fail'; R.msg = msg; R.net = -R.cost; return R; };
    if (Z === 0) return fail('Sin protones no hay elemento: los neutrones solos no forman núcleos ligados.');
    if (Z > 137) return fail('Z > 137: el “límite de Feynman”. Ningún modelo admite un núcleo así.', 'feynman');
    if (Z >= 104) {
      const a2 = A - 2, N = a2 - Z; R.steps.push('evaporación 2n');
      if (N < Z) return fail('Demasiados pocos neutrones: el núcleo se fisiona al instante.', 'fission');
      const isl = Z >= 114 && Z <= 126 && N >= 176 && N <= 190;
      return done(Z, a2, isl ? 'island' : 'shv', isl ? 'Isla de estabilidad: vida media larga (predicción).' : 'Superpesado detectado: decae por α en milisegundos.');
    }
    if (A === 5 || A === 8) return fail(A === 8 ? '⁸Be se parte en dos ⁴He en 10⁻¹⁶ s. No hay núcleos estables con A = 8.' : 'No existen núcleos estables con A = 5: se rompen al instante.', 'gap');
    if (A <= 4) {
      const ok = { '1-1': 1, '1-2': 1, '1-3': 1, '2-3': 1, '2-4': 1 };
      if (ok[Z + '-' + A]) return done(Z, A, 'stable');
      const cand = [1, 2].filter(z => ok[z + '-' + A]).sort((x, y) => Math.abs(x - Z) - Math.abs(y - Z))[0];
      if (!cand) return fail('Ese núcleo no existe ligado.');
      for (let z = Z; z !== cand; z += cand > z ? 1 : -1) R.steps.push(cand > z ? 'β⁻' : 'β⁺');
      return done(cand, A, 'decay');
    }
    if (A < Z) return fail('Más protones que masa: imposible.');
    const zs = NUC.zs(A); let z = Z;
    while (Math.abs(z - zs) > 1.5) { if (z > zs) { z--; R.steps.push('β⁺'); } else { z++; R.steps.push('β⁻'); } }
    return done(z, A, R.steps.length ? 'decay' : 'stable');
  }
};

/* ---------- batalla ---------- */
const BAT = {
  CD: 1.2, COMBO_T: 6, AMMO: 2, AMMO_MUL: 1.5, SYN: 5,
  eff(card, ph) {
    if (ph.hx && ph.hx.includes(card.id.replace(/^el:/, ''))) return -6;
    let e = 0; for (const t in card.tags) e += card.tags[t] * ((ph.w[t] || 0) - (ph.h[t] || 0)); return e;
  },
  mult: combo => Math.min(2, 1 + 0.2 * Math.max(0, combo - 1)),
  fatigue: n => Math.max(0.35, 1 - 0.15 * (n || 0)),          // la amenaza se vuelve resistente a lo que repites
  build: (heavy, h) => 1.2 + 0.5 * heavy + (h ? 0.8 : 0),      // segundos estimados para construir (validador y bot)
  cpow: c => (1 + Math.min(1.5, (c.heavy || 1) / 8)) * (c.kind === 'hyb' ? 0.85 : 1), // complejidad: lo difícil de armar pega más
  phaseOf(p, n) { const q = n === 2 && p.ph2 ? p.ph2 : p; return { d: q.d, w: parseTags(q.w), h: parseTags(q.h), hx: (q.hx || '').split(',').filter(Boolean) }; },
  WIN: 1.6, WIN_ON: .34,
  inWin: b => !!b.crit && (b.cyc % BAT.WIN) < BAT.WIN_ON,
  create(p, deck, diff) {
    diff = diff || {}; const ammo = {}; deck.forEach(c => ammo[c.id] = BAT.AMMO);
    return { p, deck, ammo, uses: {}, launches: 0, hp: p.hp, max: p.hp, t: p.T, T: p.T, integ: 100, combo: 0, comboT: 0, maxCombo: 0, cd: {}, phase: 1, ph: BAT.phaseOf(p, 1), over: false, win: false, spikeT: 5, ev: [], cyc: .8, crit: diff.crit || 0, rg: (diff.rg || 0) * (p.boss ? 1.5 : 1), crits: 0 };
  },
  step(b, dt) {
    if (b.over) return;
    b.t -= dt; b.cyc += dt; b.integ -= b.p.dps * dt; b.comboT -= dt; if (b.comboT <= 0) b.combo = 0;
    if (b.rg && b.hp > 0) b.hp = Math.min(b.max, b.hp + b.rg * dt);
    for (const k in b.cd) b.cd[k] = Math.max(0, b.cd[k] - dt);
    b.spikeT -= dt; if (b.spikeT <= 0) { b.spikeT = 5; b.integ -= b.p.dps * 2; b.ev.push({ k: 'spike' }); }
    if (b.integ <= 0 || b.t <= 0) { b.integ = Math.max(0, b.integ); b.over = true; b.win = false; b.why = b.integ <= 0 ? 'La integridad de la nave llegó a 0 %.' : 'Se acabó el tiempo.'; }
  },
  hit(b, card, mul, f) {
    const e = BAT.eff(card, b.ph), crit = e > 0 && BAT.inWin(b); let dmg, kind; f = f == null ? 1 : f;
    if (e > 0) { b.combo++; b.comboT = BAT.COMBO_T; b.maxCombo = Math.max(b.maxCombo, b.combo); dmg = Math.round(e * mul * card.pow * BAT.mult(b.combo) * (crit ? 1.5 : 1) * f); b.hp -= dmg; kind = 'hit'; if (crit) b.crits++; }
    else if (e < 0) { b.combo = 0; dmg = Math.round(-e * mul * card.pow); b.hp = Math.min(b.max, b.hp + Math.round(dmg / 2)); b.integ -= 4; kind = 'heal'; }
    else { b.combo = 0; dmg = 1; b.hp -= 1; kind = 'none'; }
    if (b.phase === 1 && b.p.ph2 && b.hp <= b.max / 2) { b.phase = 2; b.ph = BAT.phaseOf(b.p, 2); b.ev.push({ k: 'phase' }); }
    if (b.hp <= 0) { b.hp = 0; b.over = true; b.win = true; b.stars = b.integ >= 70 ? 3 : b.integ >= 40 ? 2 : 1; }
    return { e, dmg, kind, crit, f };
  },
  throw(b, card) { // munición preparada (cartas de los frascos): 3 tiros por carta
    if (b.over || (b.cd[card.id] || 0) > 0 || !(b.ammo[card.id] > 0)) return null;
    b.cd[card.id] = BAT.CD; b.ammo[card.id]--; return BAT.hit(b, card, BAT.AMMO_MUL);
  },
  launch(b, card) { // sustancia sintetizada en vivo durante la batalla: mucho más fuerte
    if (b.over) return null; const f = BAT.fatigue(b.uses[card.id]); b.uses[card.id] = (b.uses[card.id] || 0) + 1; b.launches++;
    return BAT.hit(b, Object.assign({}, card, { pow: BAT.cpow(card) }), BAT.SYN, f);
  }
};
function cardPow(c) { return c.kind === 'el' ? 1 : c.kind === 'poly' ? 1.6 : c.kind === 'hyb' ? 0.9 : 1 + Math.min(0.5, (c.atoms || 2) / 40); }

/* ---------- partida ---------- */
function newState() {
  return { v: 1, intro: 0, unl: 1, cur: 1, prog: {}, el: { H: 1, O: 1 }, nuc: { p: 1, n: 1 }, fr: {}, hyb: {}, en: 100, sc: 0,
    set: { snd: 1, mus: 1, vib: 1, sandbox: 0 }, seen: {}, pt: {}, daily: { last: '', streak: 0, best: {} }, name: 'Doc', eternio: 0, end: 0, st: { synth: 0, fuse: 0, win: 0, fail: 0, hyb: 0 } };
}
function sanitize(S) {
  const d = newState();
  if (!S || typeof S !== 'object' || S.v !== 1) return d;
  for (const k in d) if (S[k] === undefined || typeof S[k] !== typeof d[k]) S[k] = d[k];
  for (const k in d.set) if (S.set[k] === undefined) S.set[k] = d.set[k];
  for (const k in d.st) if (typeof S.st[k] !== 'number') S.st[k] = 0;
  S.en = clamp(+S.en || 0, 0, CFG.MAX_ENERGY); S.sc = Math.max(0, +S.sc || 0);
  S.unl = clamp(S.unl | 0, 1, LEVELS.length); S.cur = clamp(S.cur | 0, 1, S.unl);
  return S;
}
const pk = (L, i) => L + '-' + i;
function levelDone(S, L) { for (let i = 0; i < 10; i++) if (!S.prog[pk(L, i)]) return false; return true; }
function problemOpen(S, L, i) { return L <= S.unl && (i === 0 || !!S.prog[pk(L, i - 1)]); }
function starsOf(S, L) { let s = 0; for (let i = 0; i < 10; i++) s += S.prog[pk(L, i)] || 0; return s; }
function totalStars(S) { let s = 0; for (const k in S.prog) s += S.prog[k]; return s; }
function rankOf(S) { const s = totalStars(S); return s >= 270 ? 'Ente de la Creación' : s >= 200 ? 'Doc Element' : s >= 120 ? 'Alquimista' : s >= 50 ? 'Aprendiz' : 'Despierto'; }
function labElements(S) {
  if (S.set.sandbox) return ELEMENTS.slice(1).filter(e => e.z <= 30 || ['Ru', 'Ag', 'Au', 'Pb', 'U', 'Br', 'I', 'Sn', 'Pt'].includes(e.sym)).map(e => e.sym);
  return Object.keys(S.el).filter(s => S.el[s] === 1 && SYM[s]).sort((a, b) => SYM[a] - SYM[b]);
}
function cardFromId(S, id) {
  if (id.startsWith('el:')) { const s = id.slice(3), z = SYM[s] || 126, e = elem(z); const tg = parseTags(ELTAGS[s === 'Ubh' ? 'Ubh' : s] || ''); return { id, kind: 'el', name: z === 126 && S.eternio ? 'Eternio' : e.name, f: s, tags: tg, pow: 1 }; }
  if (DB.poly[id]) { const p = DB.poly[id]; return { id, kind: 'poly', name: p.name, f: '(' + p.ms.map(m => DB.comp[m].f).join('/') + ')n', tags: p.tags, pow: 1.6, heavy: 6, blocks: 3 }; }
  if (DB.comp[id]) { const c = DB.comp[id]; const k = { id, kind: 'mol', name: c.name, f: c.f, tags: c.tags, atoms: c.atoms, heavy: c.atoms - (c.cnt.H || 0), hasH: !!c.cnt.H }; k.pow = cardPow(k); return k; }
  if (S.hyb[id]) { const h = S.hyb[id]; const cn = h.cnt || {}; return { id, kind: 'hyb', name: h.name, f: h.f, tags: h.tags, pow: 0.9, heavy: Math.max(1, Object.keys(cn).reduce((s, e) => s + (e === 'H' ? 0 : cn[e]), 0)), hasH: !!cn.H }; }
  return null;
}
function allCards(S) {
  const out = [];
  Object.keys(S.el).forEach(s => { if (S.el[s] === 1 && Object.keys(parseTags(ELTAGS[s] || '')).length) out.push(cardFromId(S, 'el:' + s)); });
  Object.keys(S.fr).forEach(id => { const c = cardFromId(S, id); if (c && Object.keys(c.tags).length) out.push(c); });
  return out.filter(Boolean);
}


/* ---------- distribución 2D (planos de moléculas) ---------- */
function layout2D(g) {
  const n = g.atoms.length, adj = adjOf(g);
  if (!n) return [];
  const L = (i, j) => (g.atoms[i].el === 'H' || g.atoms[j].el === 'H') ? 46 : 62;
  const relax = P => {
    for (let it = 0, step = 1; it < 300; it++, step *= .99) {
      const F = P.map(() => [0, 0]);
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
        const dx = P[j][0] - P[i][0], dy = P[j][1] - P[i][1], d = Math.hypot(dx, dy) || .1;
        if (d < 150) { const f = 1800 / (d * d); F[i][0] -= dx / d * f; F[i][1] -= dy / d * f; F[j][0] += dx / d * f; F[j][1] += dy / d * f; }
      }
      g.bonds.forEach(b => { const i = b.a, j = b.b, dx = P[j][0] - P[i][0], dy = P[j][1] - P[i][1], d = Math.hypot(dx, dy) || .1, f = (d - L(i, j)) * .35; F[i][0] += dx / d * f; F[i][1] += dy / d * f; F[j][0] -= dx / d * f; F[j][1] -= dy / d * f; });
      for (let i = 0; i < n; i++) { const m = Math.hypot(F[i][0], F[i][1]), lim = 9 * step, k = m > lim ? lim / m : 1; P[i][0] += F[i][0] * k; P[i][1] += F[i][1] * k; }
    }
    return P;
  };
  const cross = P => {
    let c = 0; const B = g.bonds;
    const ccw = (a, b, q) => (q[1] - a[1]) * (b[0] - a[0]) > (b[1] - a[1]) * (q[0] - a[0]);
    for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
      const x = B[i], y = B[j]; if (x.a === y.a || x.a === y.b || x.b === y.a || x.b === y.b) continue;
      const p1 = P[x.a], p2 = P[x.b], p3 = P[y.a], p4 = P[y.b];
      if (ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4)) c++;
    }
    return c;
  };
  const bfs = () => {
    const P = new Array(n), seen = new Array(n).fill(false), q = [[0, null]]; P[0] = [0, 0]; seen[0] = true;
    while (q.length) {
      const [v, ain] = q.shift(), ch = adj[v].map(x => x[0]).filter(u => !seen[u]), k = ch.length;
      ch.forEach((u, i) => { const a = ain == null ? -Math.PI / 2 + i * 2 * Math.PI / k : ain + (k === 1 ? (v % 2 ? .55 : -.55) : -1.1 + i * 2.2 / (k - 1)); P[u] = [P[v][0] + Math.cos(a) * L(v, u), P[v][1] + Math.sin(a) * L(v, u)]; seen[u] = true; q.push([u, a]); });
    }
    for (let i = 0; i < n; i++) if (!P[i]) P[i] = [i * 30, 80];
    return P;
  };
  const r = mulberry(n * 7 + g.bonds.length); let best = null, bs = Infinity;
  for (let t = 0; t < (n > 3 ? 8 : 1); t++) {
    const P = relax(t ? g.atoms.map((_, i) => { const a = i / n * 6.283 + r() * 2, R = 40 + r() * 80; return [Math.cos(a) * R, Math.sin(a) * R]; }) : bfs());
    const sc = cross(P) * 1e5 + g.bonds.reduce((s, b) => { const d = Math.hypot(P[b.a][0] - P[b.b][0], P[b.a][1] - P[b.b][1]) - L(b.a, b.b); return s + d * d; }, 0);
    if (sc < bs) { bs = sc; best = P; } if (bs < 50) break;
  }
  const cx = best.reduce((s, p) => s + p[0], 0) / n, cy = best.reduce((s, p) => s + p[1], 0) / n;
  return best.map(p => [Math.round(p[0] - cx), Math.round(p[1] - cy)]);
}
function blueprint(smi, withH) {
  const g = parseSmiles(smi), P = layout2D(g), keep = g.atoms.map((a, i) => withH || a.el !== 'H' ? i : -1).filter(i => i >= 0), ix = new Map(keep.map((v, k) => [v, k]));
  return { atoms: keep.map(i => ({ el: g.atoms[i].el, x: P[i][0], y: P[i][1] })), bonds: g.bonds.filter(b => ix.has(b.a) && ix.has(b.b)).map(b => ({ a: ix.get(b.a), b: ix.get(b.b), o: b.o })), cnt: countOf(g) };
}

/* ---------- reactor: ecuaciones químicas ---------- */
const REACT = {
  rx: {}, byKey: {}, errors: [],
  parse(eq) { const side = s => s.split('+').map(t => { const m = t.match(/^(\d*)(@?[A-Za-z0-9]+)$/); if (!m) throw new Error('término ' + t); return [m[1] ? +m[1] : 1, m[2]]; }); const [l, r] = eq.split('='); return { L: side(l), R: side(r) }; },
  cnt(id) { if (id[0] === '@') return SYM[id.slice(1)] ? { [id.slice(1)]: 1 } : null; const c = DB.comp[id]; return c ? c.cnt : null; },
  sum(terms) { const o = {}; terms.forEach(([k, id]) => { const c = REACT.cnt(id) || {}; for (const e in c) o[e] = (o[e] || 0) + k * c[e]; }); return o; },
  balanced(L, R) { return sameCount(REACT.sum(L), REACT.sum(R)); },
  key: ids => [...new Set(ids)].sort().join('+'),
  energy: x => clamp(Math.round(-x.dH / 40), -90, 80),
  name(id) { if (id[0] === '@') { const e = elBySym(id.slice(1)); return e ? e.name : id; } return DB.comp[id] ? DB.comp[id].name : id; },
  form(id) { return id[0] === '@' ? id.slice(1) : DB.comp[id] ? DB.comp[id].f : id; },
  build() {
    REACT.rx = {}; REACT.byKey = {}; REACT.errors = [];
    REACTIONS.forEach(([id, name, eq, dH, desc]) => {
      try {
        const { L, R } = REACT.parse(eq);
        [...L, ...R].forEach(([, x]) => { if (!REACT.cnt(x)) REACT.errors.push(id + ': sustancia desconocida ' + x); });
        if (!REACT.balanced(L, R)) REACT.errors.push(id + ': ecuación desbalanceada');
        const k = REACT.key(L.map(t => t[1])); (REACT.byKey[k] = REACT.byKey[k] || []).push(id);
        REACT.rx[id] = { id, name, eq, dH, desc, L, R };
      } catch (e) { REACT.errors.push(id + ': ' + e.message); }
    });
  },
  find(ids) { return (REACT.byKey[REACT.key(ids)] || []).map(id => REACT.rx[id]); }
};
REACT.build();

/* ---------- destilación (clasificación de líquidos) ---------- */
const SORT = {
  CAP: 4,
  top: t => t[t.length - 1],
  can(st, a, b) { return a !== b && st[a].length > 0 && st[b].length < SORT.CAP && (!st[b].length || SORT.top(st[b]) === SORT.top(st[a])); },
  pour(st, a, b) {
    if (!SORT.can(st, a, b)) return 0; const c = SORT.top(st[a]); let n = 0;
    while (st[a].length && SORT.top(st[a]) === c && st[b].length < SORT.CAP) { st[b].push(st[a].pop()); n++; }
    return n;
  },
  solved: st => st.every(t => !t.length || (t.length === SORT.CAP && t.every(x => x === t[0]))),
  solve(st0, limit) {
    limit = limit || 80000; const seen = new Set(), path = []; let nodes = 0;
    const key = st => st.map(t => t.join('')).sort().join('|');
    const dfs = st => {
      if (SORT.solved(st)) return true; if (++nodes > limit) return false;
      const k = key(st); if (seen.has(k)) return false; seen.add(k);
      for (let a = 0; a < st.length; a++) for (let b = 0; b < st.length; b++) {
        if (!SORT.can(st, a, b)) continue;
        if (!st[b].length && st[a].every(x => x === st[a][0])) continue;
        const nx = st.map(t => t.slice()); SORT.pour(nx, a, b); path.push([a, b]);
        if (dfs(nx)) return true; path.pop();
      }
      return false;
    };
    return dfs(st0.map(t => t.slice())) ? path.slice() : null;
  },
  gen(n, seed) {
    const r = mulberry(seed || 1);
    for (let tries = 0; tries < 80; tries++) {
      const u = []; for (let c = 0; c < n; c++) for (let k = 0; k < SORT.CAP; k++) u.push(c);
      for (let i = u.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [u[i], u[j]] = [u[j], u[i]]; }
      const st = []; for (let t = 0; t < n; t++) st.push(u.slice(t * SORT.CAP, t * SORT.CAP + SORT.CAP));
      st.push([], []);
      if (SORT.solved(st) || st.some(t => t.length && t.every(x => x === t[0]))) continue;
      const sol = SORT.solve(st); if (sol) return { st, sol };
    }
    return null;
  }
};

Object.assign(DE, { layout2D, blueprint, REACT, SORT, CFG, ELEMENTS, SYM, CAT, elem, elBySym, catOf, valence, maxVal, tablePos, parseFormula, hill, fHTML, fUni, molarMass, parseSmiles, components, subgraph, wlHash, molKey, groupsOf, bondSums, freeOf, countOf, bondType, DB, buildDB, makeHybrid, NUC, BAT, newState, sanitize, pk, levelDone, problemOpen, starsOf, totalStars, rankOf, labElements, cardFromId, allCards, parseTags, mulberry, esc, sup, clamp, djb });
