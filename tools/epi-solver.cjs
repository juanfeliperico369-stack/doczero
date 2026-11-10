// busca la mejor solución de cada brote (DFS con memoria; candidatos = sanos a distancia ≤ D del brote)
const fs = require('fs'); const src = ['data', 'season2', 'season3', 'season4', 'engine'].map(f => fs.readFileSync(__dirname + '/../src/' + f + '.js', 'utf8')).join('\n');
globalThis.window = globalThis; eval(src + ';globalThis.__L=LEVELS;globalThis.ORG=ORG;');
function dist(g) { const d = g.c.map(() => 99), q = []; g.c.forEach((v, i) => { if (v === 'X') { d[i] = 0; q.push(i); } }); while (q.length) { const i = q.shift(); ORG.nb(g, i).forEach(j => { if (g.c[j] === '.' && d[j] > d[i] + 1) { d[j] = d[i] + 1; q.push(j); } }); } return d; }
function solve(p, D) {
  const memo = new Map(); let nodes = 0;
  function rec(g) {
    const key = g.c.join(''); if (memo.has(key)) return memo.get(key);
    if (!ORG.front(g).length) { const r = [ORG.safe(g), []]; memo.set(key, r); return r; }
    if (++nodes > 400000) return [ -1, [] ];
    const d = dist(g), cand = []; g.c.forEach((v, i) => { if (v === '.' && d[i] <= D) cand.push(i); });
    let best = [-1, []];
    const place = (g2, n, start, picked) => {
      if (n === 0 || !ORG.front(g2).length) { const g3 = { w: g2.w, h: g2.h, c: g2.c.slice() }; ORG.spread(g3); const r = rec(g3); if (r[0] > best[0]) best = [r[0], picked.concat(r[1])]; return; }
      for (let q = start; q < cand.length; q++) { const i = cand[q]; if (g2.c[i] !== '.') continue; g2.c[i] = 'V'; place(g2, n - 1, q + 1, picked.concat(i)); g2.c[i] = '.'; }
    };
    place({ w: g.w, h: g.h, c: g.c.slice() }, p.per, 0, []);
    memo.set(key, best); return best;
  }
  return rec(ORG.grid(p.map));
}
__L.forEach(L => L.P.forEach((p, i) => { if (p.k !== 'o' || p.mode !== 'epi') return;
  let best = [-1, []]; for (const D of [1, 2, 3]) { const r = solve(p, D); if (r[0] > best[0]) best = r; }
  const tot = ORG.grid(p.map).c.filter(v => v !== '#' && v !== 'X').length;
  console.log(L.n + '-' + (i + 1), p.t, 'per=' + p.per, 'mejor', best[0], '/', tot, 'sol', best[1].join(','), 'check', ORG.run(p, best[1])); }));
