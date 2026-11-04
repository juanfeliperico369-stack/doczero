# Bitácora de Doc Element

## v1.0.0 — Temporada 1 "NÚCLEO" (2026-11-04)
1. Creado: juego completo en un solo `index.html` offline (≈245 KB, sin librerías ni internet), generado desde `src/` con `node tools/build.mjs`.
2. Estética de la revista EMSAY e INDUSTRY ART llevada a neón negro, morado y azul: portada de revista, cajas espaciadas, números en contorno, marco de película, vallas verticales y sello "Lab advisory".
3. Laboratorio en canvas con valencias reales, enlaces simples, dobles y triples, ⚡H, deshacer, zoom con pellizco, análisis en vivo (fórmula, masa molar, grupos funcionales) e híbridos procedurales.
4. Forja nuclear (calculadora Z/A): decaimiento β, valle de estabilidad, energías reales y semiempíricas, isla de estabilidad y Eternio (Z 126). Polímeros con bloques de monómeros (PE, PVC, PS, teflón, SBR, ABS…).
5. Contenido: 10 niveles × 10 problemas (43 síntesis, 24 forjas, 33 batallas), 76 compuestos reales, 10 polímeros, 118 elementos, 10 guiones de video, historia de inicio y de final, y guía.
6. Batalla arcade de cartas: debilidades reales, combos, fases de jefe y drenaje de la nave. Un fallo lleva a un anuncio de 3 s y una pista educativa. Donación opcional al final de cada nivel y en los créditos (One Zero por Infinite Tree).
7. Bot de pruebas (`tools/bot.mjs` y ☰ → Bot de pruebas): valida datos y que cada problema tenga solución, juega los 100 problemas, corre 100 partidas aleatorias y hace clics reales en móvil 360×740 y PC 1366×768.
8. Probado: 0 errores de datos, 100/100 problemas resueltos y Eternio logrado, 2 × 100 partidas (32 000 acciones) sin errores, 0 errores de consola.
9. Corregido gracias al bot: 3 recetas nucleares con Z mal sumado, 5 batallas imposibles (drenaje rebalanceado), función no exportada, título desbordado en 360 px y benceno etiquetado como "alqueno" (ahora "aromático").
10. Falta: anuncios y donaciones reales (URL), videos, empaquetado Capacitor/PWA, reacciones A + B → C, temporadas 2–10 y pruebas con jugadores reales para ajustar la dificultad.
