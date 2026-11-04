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

## 3. Estética
- La base es la revista *EMSAY / Evolución musical* (PDF del autor) y su juego *INDUSTRY ART*. De ahí salen la banda superior, los títulos gigantes condensados, las mayúsculas espaciadas en cajas de borde grueso, los números grandes en contorno, el marco de película para narración, los bordes punteados, el texto vertical en las vallas, el sello "Lab advisory" y los pies "PAG".
- Paleta pedida: negro total, bordes morados neón (`--pur #a42cff`), letra azul neón (`--ink #39c8ff`). Acentos: magenta (error), ámbar (estrellas), verde (éxito).
- Fuentes embebidas, tomadas del juego del autor: "Titulos" (TeX Gyre Heros Cn Bold, licencia GUST) e Inter (SIL OFL). Los símbolos Unicode (⚗ ☢ ☣ ⚛ ⛓ ✹) salen de la fuente del sistema.

## 4. Arquitectura (un solo HTML)
```
src/data.js    contenido: elementos (118), valencias, EN, etiquetas, 76 compuestos, 10 polímeros, 10 niveles × 10 problemas, historia, guía
src/engine.js  sin DOM: SMILES propio, análisis de grafos, hash WL, grupos funcionales, híbridos, forja nuclear, batalla, estado
src/ui.js      DOM: portada, historia, laboratorio canvas, forja, frascos, mapa, batalla, menú, anuncios, sonido sintetizado
src/test.js    bot: selfTest(), solver(), monkey(n)
src/style.css  estilo (fuentes como __TITULOS__/__CUERPO__, el build las incrusta)
tools/build.mjs → index.html (≈245 KB, sin dependencias)
tools/bot.mjs  Playwright: clics reales móvil 360×740 y PC 1366×768 + selfTest + solver + monkey
```
- Comandos: `node tools/build.mjs` · `node tools/bot.mjs 100` (o `--shots carpeta`).
- En el juego: ☰ → Bot de pruebas. `index.html?test=1` usa otra clave de guardado y anuncios instantáneos.
- Guardado: `localStorage['docelement.v1']`, con exportar/importar JSON en Ajustes. `sanitize()` repara partidas corruptas.

## 5. Reglas exactas
**Química**
- Los átomos tienen valencias (`VALENCE`). Un enlace es de orden 1 a 3. Es estable si la suma de órdenes de cada átomo está en su conjunto de valencias.
- Identificación: los orgánicos (tienen C–H o C–C) se reconocen por estructura con hash Weisfeiler-Lehman, así se distinguen isómeros. Los inorgánicos se reconocen por fórmula (unidad fórmula).
- Molécula estable que no está en el catálogo → **híbrido**: nombre procedural y etiquetas predichas por sus grupos funcionales.
- Tipo de enlace por ΔEN: mayor que 1,7 = iónico (línea discontinua magenta); entre 0,4 y 1,7 = polar.

**Polímeros**
- Nivel ≥ 8: los monómeros (compuestos con bandera M) aparecen como bloques. Una cadena lineal de 3 o más bloques forma un polímero.
- El conjunto de monómeros define cuál (SBR, ABS = copolímeros). Una combinación desconocida da un "Copolímero experimental".

**Forja**
- Hasta 3 núcleos más un flujo de 0 a 40 n. Z y A se suman.
- A ≤ 4: tabla fija (p, D, T, ³He, ⁴He). A = 5 y A = 8 no existen.
- Valle de estabilidad: Zs = A / (1,98 + 0,0155·A^(2/3)). Si |Z − Zs| > 1,5, decae β± paso a paso.
- Z ≥ 104: se evaporan 2 n. Hay isla de estabilidad si Z está entre 114 y 126 y N entre 176 y 190; si no, se detecta y decae. Z > 137 es imposible (límite de Feynman).
- Energía de la fusión: ΔB, con valores reales en `BE_REAL` y fórmula semiempírica en el resto. Ganancia = 1,5·ΔB si es positiva.
- Costo = 0,25·barrera de Coulomb + 1 por neutrón + 0,3·|ΔB| si es negativa. La energía se regenera 1 cada 2 s hasta 100; el máximo es 999.

**Batalla**
- Mazo de hasta 4 cartas. Cada carta tiene etiquetas (0 a 3); la amenaza tiene debilidades `w`, lo que la cura `h` y una lista negra `hx`.
- Eficacia = Σ etiqueta × (w − h). Daño = eficacia × 2 × potencia × combo.
- Potencia: elemento 1; molécula 1 + átomos/40 (máximo 1,5); polímero 1,6; híbrido 0,9.
- Recarga por carta 1,2 s. El combo sube +0,2 por acierto seguido en menos de 2,5 s, hasta ×2.
- Drenaje de la nave = dps (normal 1,2 + 0,1·(N−1); jefe 1,5 + 0,1·(N−1)). Cada 5 s hay un pico de 2×dps.
- Los jefes cambian de fase al 50 %. Estrellas: integridad ≥ 70 → 3, ≥ 40 → 2.

**Misiones y puntaje**
- Síntesis y forja tienen tiempo límite. Estrellas: menos del 40 % del tiempo usado → 3, menos del 70 % → 2.
- Fallo o tiempo agotado → anuncio de 3 s → pista de ÉTER → reintentar.
- Puntaje = 100 × estrellas + bonificación por tiempo y combo. La energía también sube con cada problema resuelto.
- Al completar un nivel aparece la donación opcional de 1 USD.

## 6. Contenido actual: Temporada 1 "NÚCLEO" (niveles 1–10, 100 problemas)
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
  - Reacciones entre moléculas (A + B → C) con balanceo estequiométrico (puede ser la "calculadora química").
  - Pestaña de organismos.
  - PWA/Capacitor para Android e iOS.
  - SDK real de anuncios.
  - Videos.
  - Traducciones.
  - Clasificación del agua.

## 8. Cómo agregar contenido
- **Compuesto:** fila en `COMPOUNDS`: `[id, fórmula, nombre, SMILES (alternativas separadas por espacio), 'etiq3,etiq1', descripción, 'M' si es monómero]`. El bot verifica que el SMILES dé la fórmula y que la clave no se repita.
- **Problema:** objeto en `LEVELS[n].P`. El bot verifica que tenga solución con lo que el jugador puede tener en ese momento: elementos regalados, forjados antes y compuestos posibles.
- Después de cambiar algo: `node tools/bot.mjs 100` debe terminar en `RESULTADO: OK, 0 errores`.
