/* ============================================================
   DOC ELEMENT · DUELOS (LAN y Bluetooth)
   LAN: WebRTC directo entre navegadores de la misma red, sin servidor. El "apretón de manos"
        viaja en un código corto (QR para escanear o texto para pegar).
   BLUETOOTH: los navegadores no permiten conexión Bluetooth directa entre teléfonos. El reto
        viaja por Compartir (Bluetooth, Quick Share, AirDrop o archivo) y el rival devuelve su tiempo.
   Ambos modos usan el mismo Duelo de síntesis: 5 moléculas con la misma semilla; gana el más rápido.
   ============================================================ */
'use strict';
(function () {
const K = () => DE.k, $ = s => document.querySelector(s), esc = DE.esc;
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const hex2b = h => { let o = ''; for (let i = 0; i < h.length; i += 3) { const n = parseInt(h.substr(i, 3).padEnd(3, '0'), 16); o += B64[n >> 6] + B64[n & 63]; } return o; };
const b2hex = (s, len) => { let o = ''; for (let i = 0; i < s.length; i += 2) o += ((B64.indexOf(s[i]) << 6) | B64.indexOf(s[i + 1])).toString(16).padStart(3, '0'); return o.slice(0, len); };

/* ---------- empaquetar / desempaquetar la descripción de sesión (SDP) ---------- */
function pack(desc) {
  const s = desc.sdp, g = k => ((s.match(new RegExp('a=' + k + ':(.+)')) || [])[1] || '').trim();
  const fp = g('fingerprint').split(' ')[1].replace(/:/g, '').toLowerCase();
  const cands = [...s.matchAll(/a=candidate:\S+ \d+ udp \d+ (\S+) (\d+) typ (host|srflx)/gi)].map(m => m[1] + ',' + m[2] + (m[3] === 'srflx' ? ',s' : ''));
  return ['DE' + (desc.type === 'offer' ? 'O' : 'A'), g('ice-ufrag'), g('ice-pwd'), hex2b(fp), [...new Set(cands)].slice(0, 6).join(';')].join('|');
}
function unpack(code) {
  const [h, u, p, fb, cs] = String(code).trim().split('|');
  if (!/^DE[OA]$/.test(h) || !u || !p || !fb) throw new Error('Código inválido');
  const type = h === 'DEO' ? 'offer' : 'answer', F = b2hex(fb, 64).match(/../g).join(':').toUpperCase();
  const cl = (cs || '').split(';').filter(Boolean).map((c, i) => { const [ip, port, t] = c.split(','); return `a=candidate:${i + 1} 1 udp ${2122260223 - i * 100} ${ip} ${port} typ ${t === 's' ? 'srflx raddr 0.0.0.0 rport 0' : 'host'} generation 0\r\n`; }).join('');
  const sdp = `v=0\r\no=- ${Date.now()} 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=msid-semantic: WMS\r\nm=application 9 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 0.0.0.0\r\n${cl}a=ice-ufrag:${u}\r\na=ice-pwd:${p}\r\na=ice-options:trickle\r\na=fingerprint:sha-256 ${F}\r\na=setup:${type === 'offer' ? 'actpass' : 'active'}\r\na=mid:0\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n`;
  return { type, sdp };
}

/* ---------- conexión ---------- */
const Net = { pc: null, dc: null, role: null, state: 'idle', rival: null, seed: 0, me: null, onMsg: null, log: [] };
function waitIce(pc, ms) { return new Promise(res => { if (pc.iceGatheringState === 'complete') return res(); const t = setTimeout(res, ms || 2500); pc.addEventListener('icegatheringstatechange', () => { if (pc.iceGatheringState === 'complete') { clearTimeout(t); res(); } }); }); }
function newPc() {
  close(); const pc = new RTCPeerConnection({ iceServers: [] }); Net.pc = pc; Net.state = 'wait';
  pc.addEventListener('connectionstatechange', () => { if (['failed', 'disconnected', 'closed'].includes(pc.connectionState) && Net.state === 'open') { Net.state = 'lost'; K().toast('Se perdió la conexión con el rival', 'bad'); render(); } });
  return pc;
}
function bind(dc) {
  Net.dc = dc;
  dc.onopen = () => { Net.state = 'open'; send({ t: 'hi', name: myName(), v: CFG.VERSION }); K().sfx('ok'); render(); };
  dc.onmessage = e => { let m; try { m = JSON.parse(e.data); } catch (x) { return; } Net.log.push(m); handle(m); };
  dc.onclose = () => { if (Net.state === 'open') { Net.state = 'lost'; render(); } };
}
async function host() { const pc = newPc(); Net.role = 'host'; bind(pc.createDataChannel('de', { ordered: true })); await pc.setLocalDescription(await pc.createOffer()); await waitIce(pc); return pack(pc.localDescription); }
async function join(code) { const pc = newPc(); Net.role = 'guest'; pc.ondatachannel = e => bind(e.channel); await pc.setRemoteDescription(unpack(code)); await pc.setLocalDescription(await pc.createAnswer()); await waitIce(pc); return pack(pc.localDescription); }
async function accept(code) { if (!Net.pc) throw new Error('Primero crea la sala'); await Net.pc.setRemoteDescription(unpack(code)); }
function send(m) { try { if (Net.dc && Net.dc.readyState === 'open') { Net.dc.send(JSON.stringify(m)); return true; } } catch (e) { } return false; }
function close() { try { Net.dc && Net.dc.close(); } catch (e) { } try { Net.pc && Net.pc.close(); } catch (e) { } Net.pc = Net.dc = null; Net.state = 'idle'; Net.rival = null; }
const myName = () => (K().S().name || 'Doc').slice(0, 16);

/* ---------- duelo ---------- */
function startDuel(seed) {
  Net.seed = seed; Net.me = { idx: 0, el: 0, done: false }; Net.rival = Object.assign(Net.rival || {}, { idx: 0, el: 0, done: false });
  K().startChallenge('duel', seed, { rival: Net.rival, onProg: (idx, el) => { Net.me.idx = idx; Net.me.el = el; send({ t: 'prog', idx, el }); }, onEnd: total => { Net.me.done = true; Net.me.el = total; send({ t: 'done', el: total }); result(); } });
}
function handle(m) {
  const k = K();
  if (m.t === 'hi') { Net.rival = Object.assign(Net.rival || {}, { name: String(m.name || 'Rival').slice(0, 16) }); k.toast('Conectado con ' + esc(Net.rival.name), 'ok'); render(); }
  else if (m.t === 'start') { k.closeModal(); k.toast('¡Duelo! Semilla ' + m.seed, 'ok'); startDuel(m.seed | 0); }
  else if (m.t === 'prog') { if (Net.rival) { Net.rival.idx = m.idx | 0; Net.rival.el = +m.el || 0; k.renderSide(); } }
  else if (m.t === 'done') { if (Net.rival) { Net.rival.done = true; Net.rival.el = +m.el || 0; k.renderSide(); if (Net.me && Net.me.done) result(); else k.toast(esc(Net.rival.name) + ' terminó: ' + fmt(Net.rival.el), 'bad'); } }
  if (Net.onMsg) Net.onMsg(m);
}
const fmt = s => s == null ? '—' : Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0') + '.' + Math.floor((s * 10) % 10);
function result() {
  const k = K(), me = Net.me, rv = Net.rival || {};
  const wait = !rv.done, win = !wait && me.el <= rv.el;
  k.modal(`<div class="pag">Duelo LAN · semilla ${Net.seed}</div><h2 class="mega">${wait ? 'Esperando al rival…' : win ? '¡Ganaste!' : 'Ganó ' + esc(rv.name || 'el rival')}</h2><div class="kv"><b>${esc(myName())}</b><span class="${win ? 'ok' : ''}">${fmt(me.el)}</span><b>${esc(rv.name || 'Rival')}</b><span class="${!wait && !win ? 'ok' : ''}">${wait ? rv.idx + '/5…' : fmt(rv.el)}</span></div>${!wait ? `<div class="row" style="margin-top:12px">${Net.role === 'host' ? '<button class="btn pri" data-act="duelAgain">Revancha ▸</button>' : '<span class="m">El anfitrión puede pedir revancha.</span>'}<button class="btn gh" data-act="close">Cerrar</button></div>` : ''}`);
  if (!wait) { k.sfx(win ? 'win' : 'lose'); k.say(win ? 'win' : 'lose'); }
}

/* ---------- QR: dibujar y escanear ---------- */
function qrCanvas(text) {
  const q = qrcode(0, 'L'); q.addData(text); q.make(); const n = q.getModuleCount(), s = Math.max(3, Math.floor(260 / (n + 8))), c = document.createElement('canvas');
  c.width = c.height = (n + 8) * s; const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.fillStyle = '#000';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (q.isDark(y, x)) g.fillRect((x + 4) * s, (y + 4) * s, s, s);
  c.className = 'qr'; return c;
}
let SCAN = null;
async function scan(onCode) {
  stopScan(); const box = $('#scanBox'); if (!box) return;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { K().toast('Este navegador no permite la cámara: pega el código', 'bad'); return; }
  try {
    const st = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    const v = document.createElement('video'); v.setAttribute('playsinline', ''); v.muted = true; v.srcObject = st; box.innerHTML = ''; box.appendChild(v); await v.play();
    const cv = document.createElement('canvas'), g = cv.getContext('2d', { willReadFrequently: true });
    const bd = 'BarcodeDetector' in window ? new window.BarcodeDetector({ formats: ['qr_code'] }) : null;
    SCAN = { st, alive: true };
    const loop = async () => {
      if (!SCAN || !SCAN.alive) return;
      if (v.readyState >= 2) {
        let txt = null;
        try { if (bd) { const r = await bd.detect(v); if (r[0]) txt = r[0].rawValue; } } catch (e) { }
        if (!txt && window.jsQR) { cv.width = v.videoWidth; cv.height = v.videoHeight; g.drawImage(v, 0, 0); const r = jsQR(g.getImageData(0, 0, cv.width, cv.height).data, cv.width, cv.height, { inversionAttempts: 'dontInvert' }); if (r) txt = r.data; }
        if (txt && /^DE[OA]\|/.test(txt)) { stopScan(); K().sfx('ok'); onCode(txt); return; }
      }
      setTimeout(loop, 180);
    };
    loop();
  } catch (e) { K().toast('Sin permiso de cámara: pega el código', 'bad'); }
}
function stopScan() { if (SCAN) { SCAN.alive = false; SCAN.st.getTracks().forEach(t => t.stop()); SCAN = null; } }

/* ---------- interfaz ---------- */
let VIEW = 'home', CODE = '', BUSY = false;
function open(v) { VIEW = v || 'home'; render(); }
function render() {
  const k = K(); if (!k) return; stopScan();
  const st = Net.state, rv = Net.rival;
  const head = `<div class="pag">Multijugador · Duelo de síntesis</div><h2 class="mega">Duelo</h2><p>5 moléculas iguales para los dos (misma semilla). Gana quien las sintetice más rápido. Saltar una molécula suma +30 s.</p><div class="row"><label class="m">Tu nombre: <input id="dName" maxlength="16" value="${esc(myName())}" class="inp"></label></div>`;
  let body = '';
  if (VIEW === 'home') body = `<div class="gcols"><div class="boxed"><div class="spaced">LAN · Wi-Fi</div><p class="m sm">Juego en vivo, misma red Wi-Fi o punto de acceso del teléfono. Sin internet ni servidor.</p><div class="row"><button class="btn pri" data-act="lanHost">Crear sala</button><button class="btn" data-act="lanJoin">Unirme</button></div></div><div class="boxed"><div class="spaced">Bluetooth</div><p class="m sm">El reto viaja por Bluetooth / Quick Share / AirDrop con Compartir. Juegas tú, el rival juega el mismo reto y te devuelve su tiempo.</p><div class="row"><button class="btn pri" data-act="btCreate">Crear reto</button><button class="btn" data-act="btAccept">Aceptar reto</button></div></div></div>`;
  else if (VIEW === 'host') body = st === 'open' ? `<div class="film">Conectado con ${esc(rv && rv.name || 'rival')}</div><div class="row" style="margin-top:10px"><button class="btn pri" data-act="duelGo">⚔ Empezar duelo</button><button class="btn gh" data-act="lanClose">Desconectar</button></div>`
    : `<div class="qrrow"><div id="qrBox" class="qrbox">${CODE ? '' : '<span class="m">Preparando sala…</span>'}</div><div><p class="m sm">1. Tu rival toca <b>Unirme</b> y escanea este QR (o pega el código).<br>2. Escanea el QR de respuesta que aparece en su pantalla.</p><textarea id="codeOut" class="inp" readonly rows="3">${esc(CODE)}</textarea><div class="row"><button class="btn gh sm" data-act="copyCode">Copiar código</button><button class="btn sm" data-act="scanAns">📷 Escanear respuesta</button></div><textarea id="codeIn" class="inp" rows="2" placeholder="…o pega aquí la respuesta (DEA|…)"></textarea><button class="btn pri sm" data-act="lanAccept">Conectar</button><div id="scanBox" class="scanbox"></div></div></div>`;
  else if (VIEW === 'join') body = st === 'open' ? `<div class="film">Conectado con ${esc(rv && rv.name || 'anfitrión')}. Esperando a que empiece el duelo…</div>`
    : CODE ? `<div class="qrrow"><div id="qrBox" class="qrbox"></div><div><p class="m sm">Muestra este QR al anfitrión para que lo escanee (o envíale el código).</p><textarea id="codeOut" class="inp" readonly rows="3">${esc(CODE)}</textarea><button class="btn gh sm" data-act="copyCode">Copiar código</button><p class="m sm">Conectando…</p></div></div>`
      : `<div class="row"><button class="btn pri" data-act="scanOffer">📷 Escanear QR de la sala</button></div><textarea id="codeIn" class="inp" rows="3" placeholder="…o pega el código de la sala (DEO|…)"></textarea><button class="btn pri sm" data-act="lanJoinGo">Unirme</button><div id="scanBox" class="scanbox"></div>`;
  else if (VIEW === 'btAccept') body = `<p class="m">Pega el reto que te enviaron por Bluetooth / Quick Share, o abre el archivo .txt.</p><textarea id="codeIn" class="inp" rows="3" placeholder="DUELO-DOC-ELEMENT …"></textarea><div class="row"><button class="btn pri" data-act="btAcceptGo">Jugar reto</button><label class="btn gh">Abrir archivo<input type="file" id="btFile" accept=".txt,text/plain" hidden></label></div>`;
  k.modal(head + body + (VIEW !== 'home' ? '<div class="row" style="margin-top:10px"><button class="btn gh sm" data-act="duel">← Volver</button></div>' : ''));
  const box = $('#qrBox'); if (box && CODE) { box.innerHTML = ''; try { box.appendChild(qrCanvas(CODE)); } catch (e) { box.textContent = 'QR no disponible: usa el código'; } }
  const nm = $('#dName'); if (nm) nm.addEventListener('change', () => { k.S().name = nm.value.trim().slice(0, 16) || 'Doc'; k.save(); });
  const f = $('#btFile'); if (f) f.addEventListener('change', () => { const r = new FileReader(); r.onload = () => { $('#codeIn').value = r.result; }; if (f.files[0]) r.readAsText(f.files[0]); });
}
const btEncode = (seed, el) => 'DUELO-DOC-ELEMENT|1|' + seed + '|' + (el == null ? '' : Math.round(el * 10)) + '|' + encodeURIComponent(myName());
function btDecode(t) { const m = String(t).match(/DUELO-DOC-ELEMENT\|1\|(\d+)\|(\d*)\|([^\s|]*)/); if (!m) throw new Error('Reto inválido'); return { seed: +m[1], el: m[2] ? +m[2] / 10 : null, name: decodeURIComponent(m[3] || 'Rival') }; }
function btPlay(seed, rival) {
  K().startChallenge('async', seed, { rival: rival ? { name: rival.name, idx: 5, el: rival.el, done: rival.el != null } : null, onEnd: total => {
    const k = K(); const code = btEncode(seed, total); let verdict = '';
    if (rival && rival.el != null) verdict = total <= rival.el ? '¡Ganaste a ' + esc(rival.name) + '!' : esc(rival.name) + ' fue más rápido';
    k.modal(`<div class="pag">Duelo por Bluetooth · semilla ${seed}</div><h2 class="mega">${verdict || 'Reto listo'}</h2><div class="kv"><b>Tu tiempo</b><span class="ok">${fmt(total)}</span>${rival && rival.el != null ? `<b>${esc(rival.name)}</b><span>${fmt(rival.el)}</span>` : ''}</div><p class="m">${rival ? 'Devuélvele tu resultado' : 'Envíale el reto a tu rival'} por Bluetooth, Quick Share o AirDrop:</p><textarea class="inp" rows="2" readonly>${esc(code)}</textarea><div class="row"><button class="btn pri" data-act="btShare" data-arg="${esc(code)}">⇪ Compartir (Bluetooth)</button><button class="btn gh" data-act="close">Cerrar</button></div>`);
    if (verdict) k.sfx(total <= rival.el ? 'win' : 'lose');
  } });
}
async function act(a, arg) {
  const k = K(); if (BUSY) return;
  try {
    if (a === 'duel') { if (Net.state !== 'open') { close(); CODE = ''; } open(Net.state === 'open' ? (Net.role === 'host' ? 'host' : 'join') : 'home'); }
    else if (a === 'lanHost') { if (typeof RTCPeerConnection === 'undefined') return k.toast('Este navegador no soporta WebRTC', 'bad'); CODE = ''; open('host'); BUSY = true; CODE = await host(); BUSY = false; render(); }
    else if (a === 'lanJoin') { CODE = ''; close(); open('join'); }
    else if (a === 'lanJoinGo') { const c = ($('#codeIn') || {}).value || ''; BUSY = true; CODE = await join(c); BUSY = false; render(); }
    else if (a === 'scanOffer') scan(async c => { BUSY = true; CODE = await join(c); BUSY = false; render(); });
    else if (a === 'scanAns') scan(async c => { await accept(c); k.toast('Conectando…'); });
    else if (a === 'lanAccept') { await accept(($('#codeIn') || {}).value || ''); k.toast('Conectando…'); }
    else if (a === 'copyCode') { try { await navigator.clipboard.writeText(CODE); k.toast('Código copiado', 'ok'); } catch (e) { const t = $('#codeOut'); if (t) { t.select(); document.execCommand('copy'); } } }
    else if (a === 'duelGo' || a === 'duelAgain') { const seed = (Math.random() * 1e6) | 0; if (!send({ t: 'start', seed })) return k.toast('Sin conexión', 'bad'); k.closeModal(); startDuel(seed); }
    else if (a === 'lanClose') { close(); open('home'); }
    else if (a === 'btCreate') { k.closeModal(); btPlay((Math.random() * 1e6) | 0, null); }
    else if (a === 'btAccept') open('btAccept');
    else if (a === 'btAcceptGo') { const r = btDecode(($('#codeIn') || {}).value || ''); k.closeModal(); btPlay(r.seed, r); }
    else if (a === 'btShare') { await k.shareOut('⚗ Te reto a un duelo en Doc Element. Abre el juego → Menú → Duelo → Bluetooth → Aceptar reto y pega:\n' + arg, 'reto-doc-element.txt'); }
  } catch (e) { BUSY = false; k.toast(esc(e.message || 'Error'), 'bad'); }
}
['duel', 'lanHost', 'lanJoin', 'lanJoinGo', 'scanOffer', 'scanAns', 'lanAccept', 'copyCode', 'duelGo', 'duelAgain', 'lanClose', 'btCreate', 'btAccept', 'btAcceptGo', 'btShare'].forEach(a => { DE.ACTX = DE.ACTX || {}; DE.ACTX[a] = arg => act(a, arg); });
DE.net = { Net, qrCanvas, pack, unpack, host, join, accept, send, close, startDuel, btEncode, btDecode, btPlay, open, act, fmt };
})();
