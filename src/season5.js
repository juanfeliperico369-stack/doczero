/* ============================================================
   DOC ELEMENT · TEMPORADA 5: TESIS (niveles 41–50)
   Orbitales, tabla periódica, luz y espectros, estrellas, energía, electricidad, materiales,
   catálisis, cuántica y el Demonio de Maxwell (experimento mental). Sala nueva: Observatorio (obs.js).
   ============================================================ */
'use strict';
TAGS.luz = ['Luminoso', '✺'];
TAGS.cuant = ['Cuántico', 'ψ'];
Object.assign(ELTAGS, { He: 'inert2,cool1,cuant2', Ne: 'inert2,luz2', Na: (ELTAGS.Na || 'fuel1,cond1') + ',luz1', Mg: (ELTAGS.Mg || 'fuel2,struct1') + ',luz2', Si: (ELTAGS.Si || 'struct1,cond1') + ',cuant2', Ag: 'cond3,luz1,anti1', Ti: 'struct3,luz1' });
(function () {
  const add = (id, t) => { const c = COMPOUNDS.find(c => c[0] === id); if (c) c[4] += ',' + t; };
  [['CaO', 'luz2'], ['C2H2', 'luz1'], ['ZNO', 'luz1'], ['C6H6', 'cuant2'], ['H2', 'cuant1'], ['C8H8', 'cuant1'], ['SiH4', 'cuant1'], ['ADE', 'cuant1']].forEach(([id, t]) => add(id, t));
})();
COMPOUNDS.push(
 ['NAFT','C10H8','Naftaleno','C1=CC=C2C=CC=CC2=C1','org2,cuant2','Dos anillos de benceno unidos por un lado. Sus electrones se reparten por las dos «rosquillas».'],
 ['AGCL','AgCl','Cloruro de plata','[Ag]Cl','luz2,anti1','Se oscurece con la luz: la base de la fotografía en blanco y negro durante más de un siglo.'],
 ['ZNSO4','ZnSO4','Sulfato de zinc','[Zn]1OS(=O)(=O)O1','cond2,salt1','Lo que queda disuelto en la pila de Daniell cuando el zinc suelta sus electrones.'],
 ['LI2O','Li2O','Óxido de litio','[Li]O[Li]','cond1,base1','El producto de las baterías experimentales de litio-aire.'],
 ['LICOO2','LiCoO2','Óxido de litio y cobalto','[Li]O[Co]=O','cond2,nrg2','El polo positivo de muchas baterías de teléfonos y portátiles.'],
 ['SICL4','SiCl4','Tetracloruro de silicio','Cl[Si](Cl)(Cl)Cl','cond1,struct1','Paso intermedio para purificar el silicio de los chips.'],
 ['TIO2','TiO2','Dióxido de titanio','O=[Ti]=O','luz2,struct1,shield1,cuant1','El blanco de la pintura y de muchos protectores solares. Con luz ultravioleta descompone suciedad.'],
 ['MGB2','MgB2','Diboruro de magnesio','[Mg]1B=B1','cond3,cuant2','Superconductor descubierto en 2001: por debajo de −234 °C conduce la electricidad sin ninguna resistencia.']
);
REACTIONS.push(
 ['R_DAN','Pila de Daniell','@Zn+CuSO4=ZNSO4+@Cu',-217,'El zinc cede electrones al cobre a través de un cable: así fluye la corriente.'],
 ['R_LIAIR','Batería de litio-aire','4@Li+O2=2LI2O',-1196,'El litio «respira» oxígeno y libera mucha energía: una batería del futuro.'],
 ['R_SICL','Silicio a cloruro','@Si+2Cl2=SICL4',-657,'El silicio impuro se convierte en un líquido que se destila hasta quedar purísimo.'],
 ['R_SIEM','Proceso Siemens','SICL4+2H2=@Si+4HCl',240,'El hidrógeno devuelve el silicio, ahora con una impureza en mil millones.'],
 ['R_MEOH','Metanol desde CO₂','CO2+3H2=CH3OH+H2O',-49,'Un catalizador de cobre y zinc convierte CO₂ en combustible líquido.'],
 ['R_AGCL','Fotografía','2AGCL=2@Ag+Cl2',254,'La luz rompe el cloruro de plata: aparecen granos de plata oscura, la imagen.'],
 ['R_TIO2','Titanio en llamas','@Ti+O2=TIO2',-944,'El titanio arde con luz blanca muy brillante.'],
 ['R_MGB2','Superconductor','@Mg+2@B=MGB2',-92,'Magnesio y boro forman un material sin resistencia eléctrica cuando se enfría mucho.']
);
DIFF.push(
 {g:1,fail:1,ah:9,bal:0,crit:1,rg:1.2},{g:1,fail:1,ah:9,bal:0,crit:1,rg:1.3},{g:1,fail:1,ah:9,bal:0,crit:1,rg:1.4},{g:0,fail:1,ah:9,bal:0,crit:1,rg:1.5},{g:0,fail:1,ah:9,bal:0,crit:1,rg:1.6},
 {g:0,fail:1,ah:10,bal:0,crit:1,rg:1.7},{g:0,fail:1,ah:10,bal:0,crit:1,rg:1.8},{g:0,fail:1,ah:10,bal:0,crit:1,rg:1.9},{g:0,fail:1,ah:10,bal:0,crit:1,rg:2},{g:0,fail:1,ah:10,bal:0,crit:1,rg:2}
);
STORY.s5i = [
  ['doc','loco','MI TESIS','Forjé elementos, curé mentes, leí genes y creé vida. Ahora voy a escribir la teoría de todo.'],
  ['eter','neutral','LAS REGLAS','Para dominar la realidad primero tienes que conocer sus reglas: electrones, luz y energía.'],
  ['eter','enojado','EL OBSERVATORIO','Abrí el observatorio del techo. Allí verás los átomos por dentro y la luz de las estrellas.'],
  ['doc','sorpresa','TEMPORADA 5: TESIS','Orbitales, espectros, estrellas, energía, electricidad… y un demonio que no respeta las leyes.']
];
STORY.s5e = [
  ['eter','sorpresa','SEGUNDA LEY','El demonio cerró su compuerta: para elegir tenía que recordar, y recordar cuesta energía.'],
  ['doc','feliz','TESIS APROBADA','No dominé la realidad. Aprendí sus reglas, que es casi mejor.'],
  ['eter','neutral','FASE DIOS','Ahora quieres crear especies, elementos y universos. Niveles 51–100… cuidado con lo que deseas, Doc.']
];
const e = (mode, x) => Object.assign({ k: 'e', mode }, x);
const ob = (mode, x) => Object.assign({ k: 'o', mode, room: 'obs', ic: '✺' }, x);
LEVELS.push(
{ n:41, t:'ORBITALES', s:'El edificio de los electrones', gift:[],
  talk:[['doc','loco','Mi tesis empieza por dentro del átomo.'],['eter','neutral','Los electrones viven en pisos y cajas. Cómo se acomodan decide cuántas manos tiene cada átomo en tu laboratorio.']],
  tx:{ teo:'Los electrones se ordenan en capas y subcapas (s, p, d) llamadas orbitales. Llenan primero lo de menor energía (Aufbau), se reparten uno por caja antes de emparejarse (regla de Hund) y en cada caja caben dos con giros opuestos (principio de Pauli). Los electrones sin pareja explican cuántos enlaces forma un átomo.',
       dato:'El orden de llenado tiene sorpresas: el 4s se llena antes que el 3d porque tiene un poco menos de energía.',
       fic:'Dibujé el oxígeno como un edificio de dos pisos. Le sobraban dos inquilinos solos: sus dos manos.' },
  P:[
   e('orb',{z:3,t:'Litio',d:'Toca la caja vacía más baja para poner cada electrón.',T:70}),
   e('orb',{z:6,t:'Carbono',d:'Seis electrones. En el piso 2p, uno por caja.',T:80}),
   e('orb',{z:8,t:'Oxígeno',d:'Ocho electrones: ¿cuántos quedan sin pareja?',T:80}),
   ob('ord',{rule:'Orden de llenado (de menor a mayor energía)',items:['1s','2s','2p','3s','3p','4s','3d','4p'],t:'La escalera',d:'Toca los pisos en el orden en que se llenan.',T:80}),
   e('orb',{z:7,t:'Nitrógeno',d:'Tres electrones solos en el 2p: tres manos.',T:80}),
   {k:'b',t:'Chispa estática',d:'Los electrones se acumulan en la alfombra de la cubierta.',sc:'Electrones acumulados · descargas',w:'cond2,inert1',h:'fuel1',hp:330,T:60,dps:1.6},
   e('orb',{z:11,t:'Sodio',d:'Un electrón solitario en el piso 3s.',T:90}),
   {k:'m',id:'NAFT',t:'Naftaleno',d:'Dos anillos de benceno pegados por un lado: diez carbonos.',T:320},
   e('orb',{z:16,t:'Azufre',d:'Dieciséis electrones.',T:100}),
   {k:'b',boss:1,t:'El electrón fantasma',d:'Un electrón que parece estar en todas partes a la vez… hasta que lo miras.',sc:'Nube de probabilidad',w:'cuant2,cond1',h:'nrg1',hp:340,T:90,dps:1.6,ph2:{d:'Se esconde en otro orbital',w:'cond2,luz1',h:'nrg1'}}
  ]},
{ n:42, t:'TABLA PERIÓDICA', s:'Un mapa, no una lista', gift:[],
  talk:[['eter','neutral','Cada fila de la tabla es un piso nuevo de electrones. Cada columna tiene los mismos electrones sueltos: por eso sus átomos se parecen.'],['doc','sorpresa','¡Por eso el sodio y el potasio explotan igual en el agua!']],
  tx:{ teo:'Mendeléyev ordenó los elementos en 1869 y dejó huecos para elementos que aún no se conocían. Hoy sabemos por qué funciona: los elementos de una misma columna tienen igual número de electrones en su última capa y se comportan parecido.',
       dato:'Mendeléyev predijo el «eka-silicio» con 15 años de anticipación: se descubrió en 1886 y se llamó germanio.',
       fic:'Pegué la tabla periódica en la pared del laboratorio. ÉTER me corrigió: la había colgado de cabeza.' },
  P:[
   ob('cls',{rule:'Misma columna, mismas manos',cats:['1 mano','2 manos','0 manos (gas noble)'],items:[['Litio',0],['Sodio',0],['Cloro',0],['Magnesio',1],['Oxígeno',1],['Azufre',1],['Neón',2],['Argón',2],['Calcio',1]],t:'Familias',d:'¿Cuántas manos tiene cada elemento?',T:90}),
   e('orb',{z:12,t:'Magnesio',d:'Doce electrones: dos en el 3s.',T:90}),
   e('orb',{z:9,t:'Flúor',d:'Le falta uno para llenar su piso: por eso es tan reactivo.',T:90}),
   {k:'m',id:'MgO',t:'Flash de magnesio',d:'Óxido de magnesio: lo que queda de la luz blanca del flash.',T:200},
   e('orb',{z:19,t:'Potasio',d:'Atento: el 4s va antes que el 3d.',T:110}),
   {k:'b',t:'Metal alcalino en el agua',d:'Un trozo de potasio cae en el tanque de agua.',sc:'Hidrógeno y llamas violetas',w:'inert2,seal1',h:'solv2',hp:330,T:60,dps:1.6},
   {k:'r',id:'R_KCL',t:'Alcalino y halógeno',d:'Potasio + cloro → cloruro de potasio. Columna 1 con columna 17.',T:150},
   e('orb',{z:20,t:'Calcio',d:'Veinte electrones.',T:110}),
   ob('ord',{rule:'Mendeléyev: ordena por masa atómica',items:['Hidrógeno','Helio','Litio','Berilio','Boro','Carbono','Nitrógeno'],t:'Como en 1869',d:'Del más liviano al más pesado.',T:80}),
   {k:'b',boss:1,t:'El hueco de la tabla',d:'Un elemento sin descubrir reclama su casilla.',sc:'Casilla vacía · elemento desconocido',w:'cuant2,struct1',h:'nrg1',hp:370,T:90,dps:1.6,ph2:{d:'Cambia de columna',w:'cond2,luz1',h:'nrg1'}}
  ]},
{ n:43, t:'LUZ', s:'Cada átomo tiene su color', gift:['Ag'],
  talk:[['eter','neutral','Cuando un electrón baja de un piso alto a uno bajo, suelta luz de un color exacto. Cada elemento tiene su código de barras de colores.'],['doc','feliz','¡Un DNI de luz!']],
  tx:{ teo:'Al calentar un elemento, sus electrones saltan a pisos altos y al bajar emiten luz de longitudes de onda exactas: su espectro de emisión. Así se identifican elementos a distancia y así funcionan las pruebas de llama y los fuegos artificiales.',
       dato:'El helio se descubrió en 1868 en el espectro del Sol, 27 años antes de encontrarlo en la Tierra. Su nombre viene de Helios, el Sol.',
       fic:'Quemé sal en el mechero y la llama se puso amarilla. ÉTER: «Sodio. Lo sabría con los ojos cerrados».' },
  P:[
   e('esp',{mix:['Na'],opts:['Na','H','Ne','Hg'],t:'Farola amarilla',d:'Las farolas antiguas brillan de un amarillo puro.',T:60}),
   e('esp',{mix:['H'],opts:['He','H','Li','Ca'],t:'El gas más simple',d:'Cuatro rayas: rojo, celeste, azul y violeta.',T:60}),
   {k:'m',id:'AGCL',t:'Cloruro de plata',d:'Plata y cloro: el químico de las fotos antiguas.',T:120},
   {k:'r',id:'R_AGCL',t:'Fotografía',d:'La luz rompe el cloruro de plata: plata oscura + cloro.',T:150},
   e('esp',{mix:['Ne'],opts:['Ne','Na','Hg','Sr'],t:'Letrero de neón',d:'Muchas rayas rojas y naranjas.',T:70}),
   {k:'b',t:'Apagón total',d:'Las luces de la nave se apagan.',sc:'Oscuridad · pánico en las cubiertas',w:'luz2,nrg1',h:'cool1',hp:300,T:60,dps:1.6},
   e('esp',{mix:['Cu'],opts:['Ba','Cu','Mg','Fe'],t:'Llama verde',d:'Dos elementos dan llama verde. ¿Cuál es este?',T:70}),
   e('esp',{mix:['Sr','Na'],opts:['Sr','Li','Na','K','Cu'],t:'Fuegos artificiales',d:'Rojo y amarillo en el cielo: dos elementos.',T:100}),
   e('esp',{mix:['O'],opts:['O','Hg','Cu','Ne'],t:'Aurora',d:'El verde de las auroras viene de un gas del aire.',T:80}),
   {k:'b',boss:1,t:'El eclipse',d:'Algo se come la luz de la nave.',sc:'Absorbe todos los colores',w:'luz2,shield1',h:'nrg1',hp:320,T:90,dps:1.6,ph2:{d:'Solo deja pasar el infrarrojo',w:'luz1,cool2',h:'fuel1'}}
  ]},
{ n:44, t:'ESTRELLAS', s:'Fábricas de elementos', gift:[],
  talk:[['doc','sorpresa','¿De dónde salió el carbono de mi cuerpo?'],['eter','neutral','De una estrella que explotó antes de que existiera el Sol. Vamos a repetir su receta en la forja.']],
  tx:{ teo:'Las estrellas fusionan hidrógeno en helio. Al envejecer, unen tres núcleos de helio en carbono (proceso triple alfa) y siguen con oxígeno, neón, magnesio y silicio hasta llegar al hierro. Los elementos más pesados nacen en explosiones de estrellas y en choques de estrellas de neutrones.',
       dato:'En 2017 se observó el choque de dos estrellas de neutrones (GW170817): fabricó varias veces la masa de la Tierra en oro y platino.',
       fic:'Recreé el corazón de una estrella en la forja. ÉTER bajó la potencia antes de que fuera demasiado realista.' },
  P:[
   {k:'f',z:6,a:12,t:'Triple alfa',d:'Tres núcleos de helio-4 → carbono-12, como en las gigantes rojas.',r:'He4+He4+He4',T:150},
   {k:'f',z:8,a:16,t:'Oxígeno estelar',d:'Carbono-12 + helio-4.',r:'C12+He4',T:140},
   e('esp',{mix:['H','He'],opts:['H','He','Li','Na','Ne'],t:'Estrella joven',d:'Casi toda estrella es hidrógeno y helio.',T:100}),
   {k:'f',z:10,a:20,t:'Neón estelar',d:'Oxígeno-16 + helio-4.',r:'O16+He4',T:140},
   {k:'f',z:14,a:28,t:'Silicio de las estrellas',d:'Oxígeno-16 + carbono-12.',r:'O16+C12',T:150},
   {k:'b',t:'Viento solar',d:'Una tormenta de partículas golpea el casco.',sc:'Partículas cargadas · tormenta',w:'shield2,cond1',h:'nrg1',hp:300,T:60,dps:1.6},
   {k:'f',z:26,a:56,t:'El final: hierro',d:'Dos silicios dan níquel-56, que decae dos veces hasta hierro-56. Ahí se detienen las estrellas.',r:'Si28+Si28',T:160},
   e('esp',{mix:['H','He','Na','Fe'],opts:['H','He','Na','Fe','Ne','Cu'],t:'Nuestro Sol',d:'Cuatro elementos se ven en la luz del Sol. Márcalos todos.',T:130}),
   {k:'f',z:79,a:197,t:'Kilonova: oro',d:'Hierro + rutenio + flúor + 20 neutrones: oro, como en el choque de dos estrellas de neutrones.',r:'Fe56+Ru102+F19+20n',T:170},
   {k:'b',boss:1,t:'Supernova',d:'Una estrella cercana estalla.',sc:'Onda de choque · radiación',w:'shield3,struct1',h:'nrg2',hp:320,T:90,dps:1.6,ph2:{d:'Llega la radiación',w:'shield2,antid1',h:'rad1'}}
  ]},
{ n:45, t:'ENERGÍA', s:'Nada se crea, nada se destruye', gift:[],
  talk:[['eter','neutral','La energía no se crea ni se destruye: se transforma. Y siempre se escapa un poco como calor.'],['doc','loco','¡Haré una máquina que no pierda nada!'],['eter','enojado','Eso dijeron miles antes que tú.']],
  tx:{ teo:'Primera ley de la termodinámica: la energía se conserva. Segunda ley: en cada transformación una parte se dispersa como calor y el desorden (entropía) del universo aumenta. Por eso no existe el movimiento perpetuo.',
       dato:'Tus músculos aprovechan cerca del 25 % de la energía de la comida para moverse; el resto se vuelve calor. Por eso sudas al hacer ejercicio.',
       fic:'Construí mi máquina de movimiento perpetuo. Se detuvo a los 4 minutos. ÉTER cronometró cada segundo.' },
  P:[
   {k:'r',id:'R_CH4',t:'Combustión',d:'Metano + oxígeno: la energía química se vuelve calor y luz.',T:140},
   ob('cls',{rule:'¿Libera o absorbe calor?',cats:['Libera calor (exotérmica)','Absorbe calor (endotérmica)'],items:[['Quemar madera',0],['Derretir hielo',1],['Fotosíntesis',1],['Respiración',0],['Cocinar un huevo',1],['Calentador de manos de hierro',0],['Evaporar agua',1]],t:'Calor que entra y sale',d:'Clasifica cada proceso.',T:90}),
   {k:'m',id:'UREA',t:'Compresa fría',d:'La urea, al disolverse en agua, absorbe calor: así funcionan algunas compresas frías.',T:200},
   {k:'b',t:'Fuga de calor',d:'Una compuerta se abre al espacio.',sc:'La cubierta se enfría · −40 °C',w:'fuel2,nrg1',h:'cool2',hp:330,T:60,dps:1.6},
   {k:'r',id:'R_FE',t:'Calentador de manos',d:'El hierro en polvo se oxida despacio y calienta tus manos.',T:140},
   ob('ord',{rule:'Del más frío al más caliente',items:['Cero absoluto (−273 °C)','Nitrógeno líquido (−196 °C)','Hielo seco (−78 °C)','Agua congelándose (0 °C)','Cuerpo humano (37 °C)','Agua hirviendo (100 °C)','Llama de vela (1000 °C)','Superficie del Sol (5500 °C)'],t:'Termómetro cósmico',d:'Ordena las temperaturas.',T:90}),
   {k:'r',id:'R_MEOH',t:'Combustible desde CO₂',d:'CO₂ + 3 H₂ → metanol + agua: una forma real de reciclar CO₂.',T:160},
   {k:'s',n:7,mix:['CH3OH','C2H5OH','H2O','ACET','C3H6O','ETER','CH3COOH'],t:'Destilación fraccionada',d:'Cada líquido hierve a su propia temperatura.',T:200},
   {k:'b',t:'Máquina de movimiento perpetuo',d:'Doc la encendió de todas formas.',sc:'Imposible · se recalienta',w:'cool2,seal1',h:'nrg2',hp:330,T:60,dps:1.6},
   {k:'b',boss:1,t:'La muerte térmica',d:'Todo tiende al desorden: la nave se enfría por partes.',sc:'Entropía máxima',w:'nrg2,fuel1',h:'cool1',hp:410,T:90,dps:1.6,ph2:{d:'El calor se reparte por igual',w:'fuel2,oxi1',h:'cool1'}}
  ]},
{ n:46, t:'ELECTRICIDAD', s:'Electrones en movimiento', gift:[],
  talk:[['doc','loco','¡Voy a encender la nave con un limón!'],['eter','neutral','Un limón da menos de un voltio. Pero la idea es correcta: dos metales distintos y un líquido.']],
  tx:{ teo:'Una pila convierte energía química en eléctrica: un metal suelta electrones (se oxida) y otro los recibe (se reduce) a través de un cable. En la pila de Daniell el zinc se disuelve y el cobre se deposita. Las baterías de litio de tu teléfono mueven iones de litio entre dos polos.',
       dato:'Alessandro Volta construyó la primera pila en 1800 apilando discos de zinc y cobre separados por cartón con agua salada. De su nombre viene el «voltio».',
       fic:'Conecté cien limones en serie. Encendí una bombilla diminuta y ÉTER aplaudió, por primera vez sin sarcasmo.' },
  P:[
   {k:'r',id:'R_DAN',t:'Pila de Daniell',d:'Zinc + sulfato de cobre → sulfato de zinc + cobre.',T:150},
   {k:'m',id:'ZNSO4',t:'Sulfato de zinc',d:'Un zinc unido a dos oxígenos de un sulfato.',T:140},
   ob('cls',{rule:'¿Deja pasar la electricidad?',cats:['Conductor','Semiconductor','Aislante'],items:[['Cobre',0],['Silicio',1],['Plástico',2],['Agua salada',0],['Vidrio',2],['Germanio',1],['Oro',0],['Caucho',2]],t:'Conductores',d:'Clasifica cada material.',T:90}),
   {k:'r',id:'R_ELEC',t:'Electrólisis',d:'La electricidad rompe el agua: lo contrario de una pila.',T:140},
   {k:'m',id:'LI2O',t:'Óxido de litio',d:'Dos litios y un oxígeno.',T:120},
   {k:'b',t:'Cortocircuito',d:'Dos cables pelados se tocan.',sc:'Chispas · cables derretidos',w:'seal2,inert1',h:'cond2',hp:330,T:60,dps:1.6},
   {k:'r',id:'R_LIAIR',t:'Batería de litio-aire',d:'Litio + oxígeno → óxido de litio. Balancea.',T:160},
   {k:'m',id:'LICOO2',t:'Polo de batería',d:'Litio, cobalto y dos oxígenos: está dentro de tu teléfono.',T:200},
   {k:'b',t:'Batería hinchada',d:'Una batería se calentó demasiado.',sc:'Litio sobrecalentado · riesgo de fuego',w:'cool2,inert1',h:'fuel1,oxi1',hp:330,T:60,dps:1.6},
   {k:'b',boss:1,t:'Tormenta eléctrica',d:'Un rayo cae sobre el casco de la nave.',sc:'Mil millones de voltios',w:'cond3,seal1',h:'nrg2',hp:450,T:90,dps:1.6,ph2:{d:'La corriente corre por los cables',w:'seal2,inert1',h:'cond1'}}
  ]},
{ n:47, t:'MATERIALES', s:'Cosas que no existían', gift:['Ti','B'],
  talk:[['eter','neutral','El silicio de los chips se purifica hasta tener una impureza en mil millones.'],['doc','feliz','¡Más puro que mis intenciones!']],
  tx:{ teo:'Los semiconductores como el silicio conducen solo un poco, y esa conducción se puede controlar: así se fabrican los transistores de todos los chips. El titanio es ligero y fuerte, y algunos compuestos dejan de oponer resistencia a la electricidad cuando se enfrían mucho: son superconductores.',
       dato:'Un chip moderno tiene miles de millones de transistores, cada uno miles de veces más delgado que un cabello.',
       fic:'Purifiqué silicio para fabricarle a ÉTER un cerebro nuevo. Lo rechazó: dijo que el suyo era de colección.' },
  P:[
   {k:'r',id:'R_SICL',t:'Silicio a cloruro',d:'Silicio + 2 Cl₂ → SiCl₄, un líquido fácil de purificar.',T:150},
   {k:'r',id:'R_SIEM',t:'Proceso Siemens',d:'SiCl₄ + 2 H₂ → silicio puro + 4 HCl.',T:160},
   {k:'m',id:'TIO2',t:'Dióxido de titanio',d:'Un titanio con dos dobles enlaces a oxígeno: el blanco de la pintura.',T:120},
   {k:'r',id:'R_TIO2',t:'Titanio en llamas',d:'Titanio + oxígeno → dióxido de titanio.',T:140},
   {k:'m',id:'MGB2',t:'Superconductor',d:'Un magnesio unido a dos boros, que a su vez tienen un doble enlace entre ellos.',T:160},
   {k:'b',t:'Fatiga del metal',d:'Aparecen grietas microscópicas en el casco.',sc:'Grietas en el casco',w:'struct3',h:'acid1',hp:330,T:60,dps:1.6},
   {k:'r',id:'R_MGB2',t:'Horno de superconductores',d:'Magnesio + 2 boros → diboruro de magnesio.',T:150},
   {k:'s',n:7,mix:['SiO2','SICL4','TIO2','Al2O3','Fe2O3','CuO','ZNO'],t:'Separar minerales',d:'Siete materiales en polvo mezclados.',T:200},
   {k:'b',t:'Chip sobrecalentado',d:'El procesador central de ÉTER se recalienta.',sc:'Procesador a 120 °C',w:'cool2,cond1',h:'fuel1',hp:300,T:60,dps:1.6},
   {k:'b',boss:1,t:'El material imposible',d:'ÉTER diseñó un material que se repara solo… y ahora no deja de crecer.',sc:'Material autorreplicante (ficción)',w:'struct2,cuant1',h:'bio1',hp:450,T:90,dps:1.6,ph2:{d:'Absorbe los metales del casco',w:'acid2,oxi1',h:'struct1'}}
  ]},
{ n:48, t:'CATÁLISIS', s:'Atajos químicos', gift:[],
  talk:[['eter','neutral','Un catalizador acelera una reacción sin gastarse. Tus enzimas son catalizadores.'],['doc','loco','¡Un atajo! Eso es lo mío.']],
  tx:{ teo:'Un catalizador ofrece un camino que necesita menos energía para empezar: la reacción va más rápido y él sale intacto. El hierro acelera la síntesis del amoníaco (Haber-Bosch), el platino limpia los gases de los autos y las enzimas aceleran millones de veces las reacciones de tu cuerpo.',
       dato:'Cerca de la mitad del nitrógeno de tu cuerpo pasó por una fábrica de amoníaco de Haber-Bosch: está en los fertilizantes de lo que comes.',
       fic:'Le puse un catalizador a mi café. ÉTER dijo que eso no existe. El café se enfrió igual de rápido.' },
  P:[
   {k:'r',id:'R_HABER',t:'Haber-Bosch',d:'Nitrógeno + hidrógeno → amoníaco, con hierro como catalizador.',T:150},
   {k:'r',id:'R_H2O2',t:'Catalasa',d:'Una enzima de tu hígado rompe el agua oxigenada a toda velocidad.',T:130},
   ob('ord',{rule:'Cómo actúa un catalizador',items:['Las moléculas llegan','Se pegan al catalizador','Sus enlaces se debilitan','Se forma el producto','El producto se suelta','El catalizador queda libre otra vez'],t:'El atajo',d:'Ordena los pasos.',T:90}),
   {k:'r',id:'R_SO3',t:'Proceso de contacto',d:'2 SO₂ + O₂ → 2 SO₃, con óxido de vanadio como catalizador.',T:150},
   {k:'b',t:'Reacción descontrolada',d:'Un catalizador equivocado acelera todo.',sc:'Temperatura en aumento',w:'cool2,inert1',h:'fuel1',hp:330,T:60,dps:1.6},
   {k:'r',id:'R_METG',t:'Reacción de Sabatier',d:'En la Estación Espacial convierten CO₂ en metano y agua con un catalizador.',T:160},
   {k:'m',id:'NH3',t:'Amoníaco experto',d:'Sin plano ni fórmula.',T:100},
   ob('cls',{rule:'¿Se gasta o no se gasta?',cats:['Catalizador (no se gasta)','Reactivo (se gasta)'],items:[['Enzima catalasa',0],['Agua oxigenada',1],['Hierro de Haber-Bosch',0],['Nitrógeno de Haber-Bosch',1],['Platino del auto',0],['Gasolina',1]],t:'Catalizador o reactivo',d:'Clasifica cada sustancia.',T:90}),
   {k:'b',t:'Catalizador envenenado',d:'El azufre bloquea el catalizador de la planta de aire.',sc:'Azufre en el catalizador',w:'oxi2,base1',h:'acid1',hp:280,T:60,dps:1.6},
   {k:'b',boss:1,t:'La enzima loca',d:'Una enzima acelera todas las reacciones de la nave al mismo tiempo.',sc:'Reacciones un millón de veces más rápidas',w:'cool2,antid1',h:'nrg1',hp:250,T:90,dps:1.6,ph2:{d:'Ahora digiere los plásticos',w:'antid2,inert1',h:'seal1'}}
  ]},
{ n:49, t:'CUÁNTICA', s:'Lo pequeño es raro', gift:[],
  talk:[['doc','sorpresa','Si lo miro, cambia. Si no lo miro, ¿qué hace?'],['eter','neutral','Bienvenido a la mecánica cuántica. Nadie la entiende del todo, pero funciona.']],
  tx:{ teo:'A escala atómica la energía viene en paquetes (cuantos), los electrones se comportan a la vez como partícula y como onda, y solo se puede calcular la probabilidad de dónde están. Gracias a eso existen los láseres, los LED, los chips y la resonancia magnética.',
       dato:'El color de un LED depende de su material. El LED azul eficiente, clave para la luz LED blanca, ganó el Nobel de Física de 2014.',
       fic:'Metí un gato en una caja para un experimento mental. ÉTER me recordó que el experimento era mental. El gato está bien.' },
  P:[
   e('orb',{z:26,t:'Hierro',d:'Seis electrones en el 3d: primero uno por caja.',T:140}),
   e('orb',{z:30,t:'Zinc',d:'El 3d completo.',T:150}),
   e('esp',{mix:['Hg'],opts:['Hg','Ne','Na','H','Ba'],t:'Tubo fluorescente',d:'Muchas lámparas tienen un poco de este metal líquido.',T:80}),
   {k:'m',id:'C6H6',t:'Benceno cuántico',d:'Sus electrones no están en un enlace fijo: se reparten por todo el anillo.',T:120},
   ob('ord',{rule:'De menor a mayor energía',items:['Ondas de radio','Microondas','Infrarrojo','Luz visible','Ultravioleta','Rayos X','Rayos gamma'],t:'La luz invisible',d:'Ordena los tipos de luz.',T:80}),
   {k:'b',t:'Efecto túnel',d:'Partículas atraviesan las paredes del reactor.',sc:'Fugas imposibles',w:'cuant2,shield1',h:'struct1',hp:220,T:60,dps:1.6},
   e('orb',{z:35,t:'Bromo',d:'Treinta y cinco electrones.',T:160}),
   e('esp',{mix:['H','He','Ca'],opts:['H','He','Ca','K','Sr','Li'],t:'Estrella lejana',d:'Tres elementos en su luz.',T:120}),
   {k:'b',mut:10,t:'El gato de Schrödinger',d:'Experimento mental: su debilidad cambia cada 10 s.',sc:'Superposición',w:'cuant2,luz1',h:'nrg1',hp:330,T:60,dps:1.6,ph2:{d:'Lo miraste y cambió',w:'cond2,shield1',h:'nrg1'}},
   {k:'b',boss:1,mut:12,t:'Ruido cuántico',d:'El ordenador de la nave da respuestas al azar. Su debilidad cambia cada 12 s.',sc:'Bits que son 0 y 1 a la vez',w:'cuant2,cond1',h:'nrg1',hp:350,T:90,dps:1.6,ph2:{d:'Se entrelaza con ÉTER',w:'luz2,shield1',h:'nrg1'}}
  ]},
{ n:50, t:'EL DEMONIO DE MAXWELL', s:'La defensa de la tesis', gift:[],
  talk:[['eter','enojado','Un demonio ordena moléculas sin gastar energía. Si lo logra, tu tesis no vale nada.'],['doc','sorpresa','Eso rompería la segunda ley.'],['eter','neutral','Exacto. Defiende tu tesis.']],
  tx:{ teo:'El demonio de Maxwell es un experimento mental de 1867: un ser diminuto abre una compuerta solo a las moléculas rápidas y separa lo caliente de lo frío sin gastar energía. Se resolvió más de un siglo después: para elegir, el demonio tiene que medir y borrar información, y eso cuesta energía. La segunda ley sigue en pie.',
       dato:'En 1961 Rolf Landauer demostró que borrar un bit de información desprende un mínimo de calor. En 2012 se midió en el laboratorio.',
       fic:'El demonio era ficción; mi tesis, no. La defendí ante ÉTER, que me puso un 10… «para no tener que volver a escucharla».' },
  P:[
   {k:'b',t:'Primera compuerta',d:'Las moléculas rápidas se van todas a un lado.',sc:'Un lado caliente, otro frío',w:'cool2,nrg1',h:'fuel1',hp:280,T:60,dps:1.6},
   e('orb',{z:32,t:'Germanio',d:'El elemento que Mendeléyev predijo.',T:160}),
   e('esp',{mix:['Ne','Hg','Na'],opts:['Ne','Hg','Na','H','He','Cu'],t:'Ciudad de noche',d:'Neones, tubos y farolas: tres elementos.',T:140}),
   {k:'f',z:20,a:40,t:'Calcio estelar',d:'Silicio-28 + carbono-12.',r:'Si28+C12',T:150},
   {k:'b',t:'El demonio separa',d:'Un lado de la nave hierve y el otro se congela.',sc:'Calor separado del frío',w:'cool1,fuel1,inert1',h:'cond1',hp:240,T:60,dps:1.6},
   {k:'r',id:'R_DAN',t:'Batería de emergencia',d:'Una pila de Daniell para el sistema de respaldo.',T:150},
   {k:'s',n:8,mix:['ZNSO4','LI2O','LICOO2','SICL4','TIO2','AGCL','NAFT','MGB2'],t:'Ordenar el caos',d:'Ocho sustancias de tu tesis, todas mezcladas.',T:220},
   {k:'b',fat:2,t:'Demonio adaptativo',d:'Recuerda lo que lanzas: la resistencia crece el doble de rápido.',sc:'Memoria del demonio',w:'cuant2,cond1',h:'luz1',hp:260,T:60,dps:1.6},
   e('orb',{z:36,t:'Kriptón',d:'Un gas noble: todos sus pisos llenos.',T:170}),
   {k:'b',boss:1,fat:2,mut:12,t:'EL DEMONIO DE MAXWELL',d:'Mide cada molécula que lanzas y abre la compuerta solo a las que le convienen. Varía, mira el escáner y no te repitas.',sc:'Rompe la segunda ley (ficción)',w:'cuant2,nrg1,luz1',h:'cool1',hp:260,T:90,dps:1.6,ph2:{d:'Borra su memoria para seguir midiendo',w:'cool2,cond1',h:'nrg1'}}
  ]}
);
