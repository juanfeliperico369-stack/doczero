# Doc Element

Juego educativo arcade y offline de química real: forja elementos, construye moléculas y polímeros, balancea reacciones y resuelve los problemas del universo a bordo de la nave alquimista Ouroboros.

**One Zero por Infinite Tree.**

- **Jugar en línea / instalar:** https://juanfeliperico369-stack.github.io/doczero/ (funciona sin internet después de la primera visita).
- **HTML autónomo:** `index.html` (ábrelo como archivo).
- **Compilar:** `node tools/build.mjs` → `index.html` + `dist/web/` (app web para GitHub Pages).
- **Probar:** `node tools/bot.mjs 100` (UI en móvil y PC, datos, 100 problemas, duelo LAN, 100 partidas aleatorias) · `node tools/verify-pages.mjs` (sitio publicado).
- **APK:** `ANDROID_HOME=~/android-sdk bash tools/apk.sh`.
- Contexto completo para continuar: [`docs/GUIA_IA.md`](docs/GUIA_IA.md) · Cambios: [`docs/BITACORA.md`](docs/BITACORA.md).
- Librerías incluidas: qrcode-generator (MIT, Kazuhiko Arase) y jsQR (Apache-2.0, ver `src/vendor/jsQR.LICENSE`).
