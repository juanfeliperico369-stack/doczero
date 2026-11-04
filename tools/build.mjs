// Une src/ en un solo index.html offline (fuentes embebidas). Uso: node tools/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const r = p => readFileSync(new URL('../' + p, import.meta.url));
const css = r('src/style.css').toString()
  .replace('__TITULOS__', r('src/fonts/titulos.woff').toString('base64'))
  .replace('__CUERPO__', r('src/fonts/cuerpo.woff2').toString('base64'));
const js = ['data', 'engine', 'chars', 'ui', 'test'].map(f => `<script>\n${r('src/' + f + '.js')}\n</script>`).join('\n');
const icon = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#000"/><g fill="none" stroke-width="2"><ellipse cx="16" cy="16" rx="13" ry="5" stroke="#39c8ff"/><ellipse cx="16" cy="16" rx="13" ry="5" stroke="#a42cff" transform="rotate(60 16 16)"/><ellipse cx="16" cy="16" rx="13" ry="5" stroke="#ff2fb3" transform="rotate(120 16 16)"/></g><circle cx="16" cy="16" r="2.5" fill="#fff"/></svg>');
const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#000000"><meta name="color-scheme" content="dark">
<meta name="description" content="Doc Element: crea elementos, moléculas y polímeros con química real y resuelve los problemas del universo. Juego educativo offline.">
<meta name="application-name" content="Doc Element"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">
<title>DOC ELEMENT</title><link rel="icon" href="${icon}">
<style>
${css}
</style></head><body><noscript>Doc Element necesita JavaScript activado.</noscript>
${js}
</body></html>
`;
writeFileSync(new URL('../index.html', import.meta.url), html);
console.log('index.html', (html.length / 1024).toFixed(0) + ' KB');
