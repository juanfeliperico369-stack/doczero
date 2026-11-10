# Bitácora de Doc Element

## v2.1.0 — Escuela de ÉTER: química para bebés (2026-11-10)
1. Tutorial interactivo de 14 pasos que no se puede fallar. Se arma agua y oxígeno; un foco dorado ilumina qué tocar, una mano animada enseña a arrastrar y cada paso avanza solo cuando el jugador lo hace.
2. Arranca solo después de la historia inicial en partidas nuevas. También está en la portada ("🍼 Química para bebés") y en el menú.
3. Caritas en cada átomo: triste 😟 con manos libres, feliz 😀 cuando está completo. La regla de la química se ve sin leer.
4. El botón ⚗ SINTETIZAR pasa a ser ⚗ CREAR, y el análisis habla en lenguaje simple ("😀 ¡todos felices!" / "😟 2 manos libres").
5. Consejos de primera vez en cada sala (Reactor, Forja, Destilación, Batalla) con foco y explicación. Los relojes se pausan mientras ÉTER explica.
6. Aviso "Nueva versión lista · toca para actualizar" en la app instalada.
7. Bot: hace la Escuela completa con toques y arrastres reales en celular y PC, y cierra 7 consejos de sala. 200/200 problemas, 0 errores.

## v2.0.0 — Temporada 2: FÁRMACOS (2026-11-05)
1. 10 niveles nuevos (11–20) y 100 problemas: 35 síntesis, 7 reacciones, 7 forjas, 3 polímeros, 8 destilaciones y 40 batallas.
2. Contenido nuevo: 31 compuestos reales (medicinas, drogas legales, neurotransmisores, antídotos, vitaminas, radiofármacos), 3 polímeros médicos y 8 reacciones reales, entre ellas la síntesis escolar de la aspirina y el metabolismo del alcohol.
3. Medicina nuclear en la forja: flúor-18 (PET), tecnecio-99, cobalto-60, fósforo-32, yodo, zinc y potasio.
4. Seguridad: las drogas ilegales no se construyen, aparecen como amenazas con información real. La Nebulina es ficción y se vence con híbridos que el jugador inventa (×2). Hay aviso "educativo, no consejo médico".
5. Historia: Doc despierta a los siete durmientes, con escenas de entrada y final de temporada y diálogos en cada nivel. Hay 10 guiones de video nuevos (teoría, dato curioso, ficción).
6. Rangos extendidos hasta 600★. Mapa, portada y créditos con las dos temporadas.
7. Validación: 0 errores en los 200 problemas. La vida de las amenazas se ajustó automáticamente con el simulador.
8. Bot: 200/200 problemas resueltos (133 lanzamientos en batalla), reto diario, duelo LAN real, 2×100 partidas sin errores y 0 errores de consola.
9. Pendiente: Temporada 3 (curas y mejoras), Bluetooth nativo, firma para Play Store y pruebas con jugadores.

## v1.3.0 — Batalla "síntesis bajo presión" y jugo visual (2026-11-05)
1. La batalla ahora ocurre dentro del laboratorio: la amenaza va en una franja arriba; construyes moléculas en vivo y pulsas ⚗ LANZAR. La química es el arma, y todo el juego tiene un solo corazón.
2. Daño ×5 a lo que se sintetiza en vivo, más si es complejo (átomos pesados). Repetir la misma sustancia crea resistencia, así que el jugador debe variar y crear (como la resistencia bacteriana real).
3. Las cartas de los frascos pasan a ser munición preparada: 2 tiros cada una, teclas 1–4. La preparación ayuda, pero no gana sola.
4. En niveles guiados aparece el plano de la molécula más útil contra la amenaza, para enseñar a un niño a defenderse con química.
5. Rebalance de las 26 batallas con un nuevo validador voraz que simula construir y el tiempo de armado: vida ×0,6, 60 s o 90 s, drenaje ×0,75.
6. Jugo visual: átomos que aparecen con rebote, chispas al enlazar, implosión y partículas al sintetizar, etiquetas flotantes ("¡NUEVO! H₂O"), proyectiles hacia la amenaza, estrellas animadas, transiciones de ventanas y pestañas, y el retrato del personaje que salta al hablar.
7. El bot juega las batallas guiadas siguiendo el plano con clics reales y las difíciles construyendo lo más rentable: 47 lanzamientos, 100/100 problemas resueltos, 2×100 partidas sin errores.
8. Pendiente: probar con jugadores reales el ritmo de construcción en batalla (sobre todo en teléfonos), Temporada 2 y Bluetooth nativo.

## v1.2.0 — Publicación, duelos LAN/Bluetooth, reto diario, música y APK (2026-11-04)
1. Publicado como app web instalable en https://juanfeliperico369-stack.github.io/doczero/ (rama `gh-pages` con `.nojekyll`). Incluye manifest, service worker con caché propia, íconos 192/512/maskable, apple-touch-icon de 180 px, favicon y Open Graph con `compartir.png` 1200×630.
2. Verificado en el enlace publicado con Chrome: carga, service worker activado, abre sin conexión (recarga y pestaña nueva), 0 errores de instalabilidad y 0 errores de consola.
3. Duelo LAN real: WebRTC entre teléfonos de la misma Wi-Fi, sin servidor, emparejados con QR (código de 127 caracteres). Probado con dos páginas: conecta, comparten semilla y se intercambian los resultados.
4. Duelo por Bluetooth: el reto se envía con Compartir (Bluetooth, Quick Share o AirDrop) y el rival devuelve su tiempo. El navegador no permite Bluetooth directo; para tiempo real haría falta un plugin nativo.
5. Reto diario: 5 moléculas iguales para todos cada día, con racha 🔥 y resultado compartible.
6. Música procedimental por modo y efectos de sonido con más cuerpo.
7. Para probar con jugadores: informe CSV por problema y cartas imprimibles (base del juego físico).
8. APK de prueba compilado con Capacitor 7 (horizontal, cámara para el QR, Compartir nativo).
9. Bot: 100/100 problemas resueltos, reto diario y duelo LAN completados, 2×100 partidas sin errores. Corrigió el choque de nombres CH, un reto huérfano al iniciar una batalla y el estado del service worker.
10. Falta:
    - Temporada 2 (fármacos).
    - Bluetooth en tiempo real nativo.
    - Firmar la versión para la Play Store.
    - Pruebas con jugadores reales.

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
