// Genera los PNG de la app (íconos, apple-touch-icon, favicon, imagen para compartir) con Chromium.
// Uso: node tools/assets.mjs  → assets/*.png (se versionan; el build solo los copia)
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const r = p => readFileSync(new URL('../' + p, import.meta.url));
const fonts = `@font-face{font-family:T;src:url(data:font/woff;base64,${r('src/fonts/titulos.woff').toString('base64')})}@font-face{font-family:C;font-weight:100 900;src:url(data:font/woff2;base64,${r('src/fonts/cuerpo.woff2').toString('base64')})}`;
global.DE = {}; global.window = global; eval(r('src/chars.js').toString());
const CH = global.DE.CH;
const art = (pad) => `<svg viewBox="0 0 200 200" style="position:absolute;inset:${pad}%;width:${100 - 2 * pad}%;height:${100 - 2 * pad}%"><defs><radialGradient id="g"><stop offset="0" stop-color="#a42cff" stop-opacity=".7"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs><circle cx="100" cy="100" r="98" fill="url(#g)"/><g fill="none" stroke-width="9" stroke-linecap="round"><ellipse cx="100" cy="100" rx="82" ry="30" stroke="#39c8ff"/><ellipse cx="100" cy="100" rx="82" ry="30" stroke="#a42cff" transform="rotate(60 100 100)"/><ellipse cx="100" cy="100" rx="82" ry="30" stroke="#ff2fb3" transform="rotate(120 100 100)"/></g><circle cx="100" cy="100" r="60" fill="none" stroke="#2dffb3" stroke-width="12" stroke-dasharray="320 57" transform="rotate(-80 100 100)"/><path d="M158 63 l20 -6 -6 20z" fill="#2dffb3"/><circle cx="100" cy="100" r="17" fill="#e9f6ff"/></svg>`;
const icon = pad => `<html><body style="margin:0;background:#000;width:100vw;height:100vh;position:relative;overflow:hidden">${art(pad)}</body></html>`;
const share = `<html><head><style>${fonts}*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#000;color:#39c8ff;font-family:C;overflow:hidden;position:relative}
.band{height:64px;background:#4d1785;border-bottom:5px solid #a42cff;display:flex}.band div{flex:1;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;letter-spacing:.4em;font-size:20px}.band div+div{background:#000;color:#39c8ff;border:3px solid #a42cff;margin:7px;letter-spacing:.25em}
.t{position:absolute;left:56px;top:96px;font-family:T;text-transform:uppercase;line-height:.82;text-shadow:0 0 18px rgba(57,200,255,.6)}.t .a{font-size:210px}.t .b{font-size:176px}
.k{position:absolute;left:62px;top:478px;font-family:Georgia,serif;font-style:italic;color:#ff2fb3;font-size:30px}
.p{position:absolute;right:56px;top:110px;display:flex;gap:22px}.p div{width:200px;height:200px;border:5px solid #a42cff;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 40%,#1a0636,#000 70%)}.p svg{width:100%;height:100%}
.g{position:absolute;right:56px;top:350px;width:440px;text-align:right;font-family:T;text-transform:uppercase;font-size:58px;line-height:.9;color:#2dffb3;text-shadow:0 0 14px rgba(45,255,179,.5)}
.f{position:absolute;left:0;right:0;bottom:0;height:62px;background:#0b0418;border-top:5px solid #a42cff;display:flex;align-items:center;justify-content:space-between;padding:0 40px;font-weight:800;letter-spacing:.18em;color:#8fb3ff;font-size:19px;text-transform:uppercase}.f b{font-family:T;color:#e9f6ff;font-size:28px;letter-spacing:.02em;font-weight:400}</style></head>
<body><div class="band"><div>ONE ZERO</div><div>TEMPORADA 1 · NÚCLEO</div></div><div class="t"><div class="a">Doc</div><div class="b">Element</div></div><div class="k">¿Sabes de qué está hecho todo?</div><div class="p"><div>${CH.doc('loco', 2)}</div><div>${CH.eter('feliz')}</div></div><div class="g">Crea elementos.<br>Resuelve el universo.</div><div class="f"><span>Gratis · sin internet · química real</span><b>One Zero · Infinite Tree</b></div></body></html>`;
const browser = await chromium.launch();
const shot = async (html, w, h, file) => { const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 }); await p.setContent(html); await p.waitForTimeout(150); await p.screenshot({ path: new URL('../assets/' + file, import.meta.url).pathname, omitBackground: false }); await p.close(); };
await shot(icon(4), 512, 512, 'icon-512.png');
await shot(icon(4), 192, 192, 'icon-192.png');
await shot(icon(16), 512, 512, 'icon-maskable-512.png');
await shot(icon(8), 180, 180, 'apple-touch-icon.png');
await shot(icon(2), 32, 32, 'favicon.png');
await shot(share, 1200, 630, 'compartir.png');
await browser.close();
console.log('assets listos');
