# DOC ELEMENT — Guía de contexto para continuar el proyecto (humano o IA)

> Lee esto primero. Resume TODO lo decidido para que cualquier IA continúe sin perder contexto.
> Créditos obligatorios: **One Zero por Infinite Tree**.

## 1. Visión
- Juego web educativo, arcade, 2D y texto, **offline**, de química real: crear elementos (forja nuclear), moléculas, polímeros y luego fármacos, organismos y universos.
- No es otro BitLife: el núcleo son **bloques conectables** (átomos/monómeros) que forman ideas reales; cada combinación cuenta otra historia.
- Trama: despiertas de la criogenia en la nave alquimista **Ouroboros**; la IA **ÉTER** te enseña ciencia; te vuelves un científico loco ("Doc") que forja el **Eternio (Z = 126)** y, a futuro, se convierte en un ente de la creación.
- Referencias: The Right Mix, tabla periódica, Rick y Morty, Skywire, Plague Inc, Little Alchemy.
- Géneros: educativo, puzzle, arcade, aventura, ciencia ficción, mazmorras (mapa de nodos), exploración, laboratorio, cartas (mazo de batalla), estrategia, construcción, sandbox.

## 2. Negocio (decidido por el autor)
- Normal: todo desbloqueado + anuncios (Play Store, Página Oficial, iOS). PRO: sin anuncios, 3 USD (Steam, Play Store, Epic, Microsoft Store, Amazon Games, iOS). Donaciones solo en la Página Oficial. Futuro: juego de cartas físico. También Facebook Games y descargas directas (Windows, Mac, Linux). Lanzamiento escalonado.
- Interruptor en código: `CFG.EDITION = 'free' | 'pro'` (data.js). `CFG.DONATE_URL` y `CFG.CHANNEL_URL` vacíos = "próximamente".
- Anuncios: marcadores offline. Vallas laterales verticales (PC ≥1180 px), franja inferior en móvil, e intersticial de 3 s tras cada fallo. Adaptador `ADS` en ui.js (`rails()`, `inter(cb)`): ahí se conecta AdSense/AdMob.
- Cada nivel tiene 1 guion de video (pestaña TRANSMISIÓN: teoría, dato curioso y ficción, narrado por Doc). La meta es 100 videos, 1 por nivel.

## 3. Estética y personajes
- Revista EMSAY / INDUSTRY ART (PDF y juego del autor) → banda superior, títulos gigantes condensados, cajas de borde grueso con mayúsculas espaciadas, números en contorno, marco de película, sello "Lab advisory", pies "PAG". Paleta pedida: negro total, bordes morados (`--pur #a42cff`), letra azul (`--ink #39c8ff`); acentos magenta (error), ámbar (pista/estrellas), verde (éxito).
- **HORIZONTAL primero** (decisión del autor): HUD arriba · navegación vertical a la izquierda · escenario al centro · panel lateral derecho (comunicaciones con personajes + misión + análisis). En teléfonos en vertical aparece "Gira tu dispositivo" (⛶ pantalla completa + bloqueo de orientación, o "seguir en vertical" con diseño apilado).
- **DOC** (chars.js, SVG original): tupé asimétrico morado, visor de un ojo, traje de criogenia con el emblema Ouroboros; evoluciona con el rango (0 despierto → 4 ente: bata con manchas, ojos que brillan, aura). Ánimos: neutral, feliz, sorpresa, loco, triste, enojado. NO copiar personajes existentes.
- **ÉTER**: IA de la nave, un ojo dentro de una serpiente que se muerde la cola; seca y sarcástica (tono de humor tipo ciencia ficción animada, guion original).
- Fuentes embebidas: "Titulos" (TeX Gyre Heros Cn Bold, GUST) e Inter (OFL). Símbolos Unicode del sistema.

## 4. Arquitectura (un solo HTML offline)
```
src/data.js    contenido: elementos, valencias, etiquetas, 79 compuestos, 10 polímeros, 37 REACCIONES, DIFF (dificultad por nivel), STORY/DIALOG, 10 niveles × 10 problemas, guía
src/engine.js  sin DOM: SMILES propio, grafos, hash WL, grupos funcionales (incl. aromático), híbridos, layout2D/blueprint (planos), REACT (ecuaciones), SORT (destilación + solucionador), NUC (forja), BAT (batalla con crítico y propagación), estado
src/chars.js   retratos SVG de Doc y ÉTER
src/ui.js      DOM: portada, historia con retratos, laboratorio guiado, reactor, forja, destilación, frascos, mapa, batalla, panel lateral, menú
src/test.js    bot: selfTest(), solver() (sigue la guía en niveles guiados), monkey(n)
tools/build.mjs → index.html (≈300 KB)   tools/bot.mjs → Playwright: móvil horizontal 740×360, PC 1366×768 y móvil vertical
```
- `node tools/build.mjs` · `node tools/bot.mjs 100 [--shots carpeta]` debe terminar en `RESULTADO: OK, 0 errores`.
- Anuncios APAGADOS (`CFG.ADS=false`); el adaptador `ADS` en ui.js queda para parchar al final. Guardado `localStorage['docelement.v1']`, exportar/importar en Ajustes.

## 5. Reglas exactas
- **Laboratorio**: tocar átomo de la bandeja lo crea (si hay plano, va a la pieza punteada y se une sola a sus vecinas); unir = arrastrar un átomo sobre otro o tocar uno y luego otro; tocar un enlace sube el orden 1→2→3→borrar; ⚡H llena manos libres (costo por nivel). Estable si cada átomo usa una de sus valencias. Orgánicos por hash WL; inorgánicos por fórmula. Estable desconocido → híbrido.
- **Ayudas por nivel (DIFF.g)**: 3 = plano completo + paso que brilla (N1–2) · 2 = plano sin H (N3–4) · 1 = lista de átomos (N5–8) · 0 = solo nombre, fórmula por ⚡20 (N9–10). N1–2 sin derrota por tiempo (solo menos estrellas).
- **Reactor**: reactivos de los frascos (compuestos o elementos puros `@Fe`). Si la combinación es conocida aparecen los productos; los coeficientes deben igualar los átomos (Lavoisier). N1–4 ÉTER balancea (`DIFF.bal`); después a mano o pista ⚡15. Varias rutas con los mismos reactivos (p. ej. CO₂+H₂O → ácido carbónico o fotosíntesis) se eligen con "Ruta". Energía = −ΔH/40 (tope −90…+80).
- **Destilación** (clasificar líquidos): n sustancias × 4 capas + 2 tubos vacíos; verter la capa superior sobre el mismo líquido o en vacío; cada puzzle se genera con semilla y se comprueba resoluble con un solucionador DFS.
- **Forja**: igual que v1 (Z y A se suman, valle de estabilidad, β±, A=5/8 imposibles, Z≥104 evapora 2n, isla Z114–126/N176–190, Feynman Z>137). Los núcleos que pide la misión brillan en niveles guiados.
- **Batalla = síntesis bajo presión (v1.3)**: la amenaza aparece en una franja sobre el laboratorio.
  - Lo que el jugador sintetiza durante la batalla se LANZA: daño = eficacia × 5 × complejidad × combo × crítico × resistencia.
    - Complejidad: `BAT.cpow` = 1 + átomos pesados/8, con tope ×2,5.
    - Resistencia (`BAT.fatigue`): −15 % por cada vez que se repite la misma sustancia, hasta ×0,35.
  - Las cartas de los frascos son munición preparada: 2 tiros cada una, ×1,5 de daño, teclas 1–4.
  - En niveles guiados (g ≥ 2) aparece el plano de la molécula más rentable (`recommend`).
  - Vida ×0,6 respecto a v1.2; T = 60 s (normal) / 90 s (jefe); drenaje ×0,75.
  - El validador simula de forma voraz: munición primero, luego construir lo más rentable con el tiempo `BAT.build(pesados, H)`.
- **Estrellas**: misiones ★★★ <40 % del tiempo, ★★ <70 %; batalla por integridad (≥70 / ≥40).

## 6. Contenido actual: Temporada 1 "NÚCLEO" (niveles 1–10, 100 problemas: 22 síntesis · 17 reacciones · 23 forjas · 6 polímeros · 6 destilaciones · 26 batallas)
1. Despertar (H, O; deuterio, ⁴He)
2. Aire (Li, C, N; Apolo 13)
3. Carbono (orgánica, benceno)
4. Sal y ácido (Na, Mg, Cl)
5. Forja estelar (Si, S, Ar, Ca, P)
6. Hierro (Fe, Cu, Al)
7. Monómeros (F)
8. Polímeros
9. Vida (aminoácidos, glucosa, aspirina)
10. Eternio (Ru, Pb, Au, U, Fl, Z = 126)

Adelantos de la temporada 2 ya incluidos como descubrimientos ocultos: cafeína y paracetamol.

## 7. Hoja de ruta (temporadas semanales)
- 11–20 FÁRMACOS: medicinas y drogas conocidas más alguna nueva. Hay que ser realista, cambiar nombres si hace falta y hacer la ficción casi real.
  - Regla de seguridad: solo estructuras moleculares públicas y efectos explicados (receptor, dosis, riesgos).
  - **Nunca** rutas de síntesis, cantidades, purificación ni instrucciones de laboratorio reales para sustancias controladas.
  - Para las drogas ilegales conviene usar análogos ficticios con nombre propio y explicar el mecanismo a nivel general.
- 21–30 COMPUESTOS Y CURAS: potenciadores ficticios ("superhéroe", fuerza, velocidad), modificación genética conceptual.
- 31–40 ORGANISMOS: virus y bacterias como bloques abstractos (estilo Plague Inc.). Sin protocolos reales de patógenos ni mejora de función.
- 41–50 TESIS: dominar la realidad.
- 51–100 FASE DIOS: especies, elementos y universos nuevos; en el nivel 100 se crea un universo.
- Pendiente técnico:
  - Pestaña de organismos (temporada 4).
  - PWA/Capacitor para Android e iOS.
  - Anuncios reales (al final).
  - Videos.
  - Traducciones.
  - Más isómeros y estereoquímica.
  - Modo contrarreloj o "carrera".
  - Editor de niveles.
- Ya hecho en v1.1: reactor de ecuaciones con balanceo, destilación, guía progresiva y personajes.

## 7b. v1.2: publicación, multijugador y extras
- **Enlace público (GitHub Pages, rama `gh-pages`)**: https://juanfeliperico369-stack.github.io/doczero/ . Publicar:
  - `node tools/build.mjs`.
  - Copiar `dist/web/` a la rama `gh-pages`, que lleva `.nojekyll`.
  - Hacer push.
  - Verificar con `node tools/verify-pages.mjs`: carga, service worker activado, abre sin conexión, 0 errores de instalabilidad (CDP) y etiquetas.
- **PWA**:
  - `manifest.webmanifest`: standalone, horizontal, íconos 192, 512 y 512 maskable.
  - `sw.js`: la caché `doc-element-v<versión>` se renueva al cambiar `CFG.VERSION`.
  - `apple-touch-icon.png` de 180 px opaco, `favicon.png` y `compartir.png` 1200×630 para WhatsApp (og:image absoluta).
  - Los gráficos se regeneran con `node tools/assets.mjs`.
- **APK (Android, prueba)**: `ANDROID_HOME=~/android-sdk bash tools/apk.sh` genera `dist/DocElement-v<versión>.apk` (Capacitor 7, debug).
  - Va en horizontal (sensorLandscape) y pide cámara para el QR.
  - Usa el plugin Share para Bluetooth y Quick Share.
  - Para la Play Store hace falta firmar un AAB de release.
- **Duelo LAN** (`src/online.js`): WebRTC DataChannel sin servidor ni STUN.
  - El SDP se comprime a un código de unos 130 caracteres (`DEO|…` oferta / `DEA|…` respuesta) con ufrag, pwd, huella y candidatos UDP.
  - El código viaja por QR (qrcode-generator, MIT) y se escanea con BarcodeDetector o jsQR (Apache-2.0); también se puede pegar.
  - Mensajes: hi · start{seed} · prog{idx,el} · done{el}.
- **Duelo "Bluetooth"**: el navegador no permite Bluetooth directo entre teléfonos.
  - El reto `DUELO-DOC-ELEMENT|1|semilla|décimas|nombre` se envía con Compartir (Bluetooth, Quick Share, AirDrop).
  - El rival lo pega y juega la misma semilla. Es asíncrono.
  - Tiempo real por Bluetooth requeriría un plugin nativo en el APK (pendiente).
- **Reto diario**: semilla AAAAMMDD, 5 moléculas por niveles de dificultad (`chalList`), racha 🔥 en `S.daily`, se puede compartir el resultado.
- **Música** procedimental por modo (laboratorio, batalla, destilación, menú) y efectos con ruido para explosiones y forja.
- **Informe de prueba CSV** (intentos, victorias, fallos, pistas y tiempos por problema, en `S.pt`) y **cartas imprimibles** A4 de 63×88 mm, base para el juego físico.

## 7c. Temporada 2: FÁRMACOS (v2.0, niveles 11–20, `src/season2.js`)
- Se carga después de `data.js` y amplía COMPOUNDS (+31), POLYMERS (PVP, PMMA, PHEMA), REACTIONS (+8), DIFF, LEVELS, TAGS (`neuro` ψ, `antid` ⚕), ELTAGS (K, Zn, Tc, Co) y STORY (`s2i` entrada, `s2e` final).
- Niveles:
  - 11 Dolor (salicílico, aspirina por reacción real, paracetamol, ibuprofeno)
  - 12 Estimulantes (cafeína, teobromina, taurina, nicotina)
  - 13 Alcohol y antídotos (metabolismo del etanol, NAC, metanol)
  - 14 Anestesia (éter, benzocaína, mentol, lidocaína)
  - 15 Neurotransmisores (GABA, dopamina, serotonina, melatonina, adrenalina, histamina)
  - 16 Antisépticos (I, Zn, I₂, ZnO, povidona, PMMA)
  - 17 Vitaminas y sales (K, KCl, KI, vitamina C, metformina)
  - 18 Medicina nuclear (F-18, FDG, Tc-99, Co-60, P-32)
  - 19 Antibióticos (sulfanilamida, núcleo de penicilina, PHEMA)
  - 20 La Nebulina
- **Regla de seguridad aplicada**:
  - Solo se construyen medicinas y drogas legales con información real de riesgos.
  - Las drogas ilegales no se construyen: aparecen como amenazas con información general.
  - La Nebulina es ficción. Su jefe da ×2 de daño a los HÍBRIDOS (campo `hyb` en el problema): las "drogas/curas nuevas por combinaciones" las inventa el jugador.
  - La entrada de la temporada incluye el aviso "educativo, no consejo médico".
- Dificultad de la temporada 2: g 2 → 0, ⚡H de 3 a 8, propagación de 0,5 a 2. La vida de las amenazas se ajustó con el simulador (script de afinado: −8 % por paso, mínimo 55 %).
- Rangos: Despierto, Aprendiz, Alquimista, Doc Element (240★), Farmacólogo (330★), Maestro de la Mente (420★), Ente de la Creación (540★).

## 8. Cómo agregar contenido
- **Compuesto:** fila en `COMPOUNDS`: `[id, fórmula, nombre, SMILES (alternativas separadas por espacio), 'etiq3,etiq1', descripción, 'M' si es monómero]`. El bot verifica que el SMILES dé la fórmula y que la clave no se repita.
- **Problema:** objeto en `LEVELS[n].P`. El bot verifica que tenga solución con lo que el jugador puede tener en ese momento: elementos regalados, forjados antes y compuestos posibles.
- Después de cambiar algo: `node tools/bot.mjs 100` debe terminar en `RESULTADO: OK, 0 errores`.
