# Bitácora de Doc Element

## v1.1.0 — Pulido: horizontal, guía para principiantes, personajes, reactor y destilación (2026-11-04)
1. Horizontal primero: navegación a la izquierda, escenario al centro y panel de personajes y misión a la derecha. En teléfonos en vertical aparece "gira tu dispositivo" (con pantalla completa y bloqueo de orientación).
2. Conexiones intuitivas: plano punteado de la molécula y la pieza o el enlace que toca brillan. Además, unir = arrastrar un átomo sobre otro, las "manos libres" se dibujan como conectores y hay una lista de átomos (C 1/2…).
3. Dificultad progresiva (tabla DIFF): plano completo, luego sin H, luego lista, luego solo nombre. ⚡H empieza a costar energía, ÉTER deja de balancear las ecuaciones, los críticos exigen timing y las amenazas se propagan. Los niveles 1–2 no castigan por tiempo.
4. Personajes originales en SVG: Doc (evoluciona con el rango) y ÉTER (IA de la nave) en comunicaciones, historia, resultados y diálogos de cada nivel y evento.
5. Referencias aplicadas:
   - Reactor de ecuaciones reales (Little Alchemy y The Right Mix): 37 reacciones, como termita, Haber-Bosch, fotosíntesis o fermentación.
   - Destilación como el puzzle de clasificar agua.
   - Golpe crítico por timing en la batalla (Skywire).
   - Propagación y mutación de amenazas (Plague Inc).
   - Humor de ciencia ficción (Rick y Morty, solo como tono).
6. Contenido rehecho: 100 problemas, ahora 22 síntesis, 17 reacciones, 23 forjas, 6 polímeros, 6 destilaciones y 26 batallas. Hay 3 compuestos nuevos (Li₂CO₃, SO₃, R-22) y frascos de "Bio y fármacos" y "Organismos (T4)".
7. Anuncios apagados (`CFG.ADS=false`): el fallo ya no muestra anuncio, solo la pista de ÉTER y reintentar.
8. Probado con el bot:
   - En móvil horizontal 740×360, PC 1366×768 y móvil vertical: 100/100 problemas resueltos, 12 de ellos siguiendo solo la guía en pantalla.
   - 2×100 partidas al azar (32 000 acciones) sin errores.
   - Clics reales: plano, enlace doble tocando, reactor, arrastrar para unir, destilación y forja.
9. Corregido gracias al bot:
   - Ruta equivocada del reactor con los mismos reactivos.
   - Toque fuera de rango en destilación.
   - Centrado asíncrono del plano.
   - Clase CSS repetida que escondía el panel de diálogo.
   - Subíndices partidos y anillo de benceno cruzado en el plano.
10. Falta:
    - Probar con jugadores reales (niños y expertos) para ajustar tiempos.
    - Música y efectos con más cuerpo.
    - Empaquetar con Capacitor.
    - Temporada 2.
    - Anuncios y donaciones reales.

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
