/* ============================================================
   DOC ELEMENT · TEMPORADA 4: ORGANISMOS (niveles 31–40)
   Células, energía, bacterias, virus, hongos, plantas, defensas, resistencia, ecosistemas
   y el Primogénito (ficción). Educativo: microbios solo como idea, sin protocolos ni recetas.
   ============================================================ */
'use strict';
TAGS.inm = ['Inmunidad', '✚'];
TAGS.eco = ['Ecológico', '❀'];
ELTAGS.Zn = 'struct1,cond1,inm1';
/* datos y reglas puras de la sala de Cultivo (sin DOM: las usan el juego, el validador y el bot) */
const ORG = {
  /* parte: [nombre, qué hace, pregunta] */
  PART: {
    mem: ['Membrana', 'la piel de la célula: decide qué entra y qué sale', '¿Qué parte decide qué entra y qué sale?'],
    par: ['Pared celular', 'una armadura rígida por fuera de la membrana', '¿Cuál es la armadura rígida de afuera?'],
    adn: ['ADN', 'el manual de instrucciones, suelto y sin núcleo', '¿Dónde están las instrucciones?'],
    pla: ['Plásmido', 'un anillo pequeño de ADN que las bacterias se pasan entre sí', '¿Cuál es el anillito de ADN que se comparten?'],
    rib: ['Ribosomas', 'las fábricas de proteínas', '¿Quién fabrica las proteínas?'],
    fla: ['Flagelo', 'una cola que gira como hélice para nadar', '¿Con qué nada?'],
    nuc: ['Núcleo', 'la caja fuerte que guarda el ADN', '¿Dónde se guarda el ADN?'],
    mit: ['Mitocondria', 'la central de energía: quema azúcar con oxígeno', '¿Quién produce la energía?'],
    gol: ['Aparato de Golgi', 'el correo: empaqueta y envía las proteínas', '¿Quién empaqueta y envía las proteínas?'],
    lis: ['Lisosoma', 'el centro de reciclaje: digiere lo que sobra', '¿Quién recicla la basura?'],
    clo: ['Cloroplasto', 'el panel solar: fabrica azúcar con luz', '¿Quién fabrica azúcar con la luz?'],
    vac: ['Vacuola', 'el tanque de agua y reservas', '¿Cuál es el tanque de agua?'],
    cap: ['Cápside', 'la caja de proteínas que protege sus genes', '¿Cuál es la caja que protege sus genes?'],
    esp: ['Espículas', 'las llaves con las que se pega a una célula', '¿Con qué se pega a la célula?'],
    gen: ['Material genético', 'ADN o ARN: solo instrucciones para copiarse', '¿Dónde están sus instrucciones?'],
    env: ['Envoltura', 'una capa de grasa: el jabón la rompe', '¿Qué parte rompe el jabón?'],
    gem: ['Yema', 'un brote: así se reproduce la levadura', '¿Por dónde se reproduce?']
  },
  CELL: {
    bact: ['Bacteria', ['par', 'mem', 'adn', 'pla', 'rib', 'fla']],
    animal: ['Célula animal', ['mem', 'nuc', 'mit', 'rib', 'gol', 'lis']],
    planta: ['Célula vegetal', ['par', 'mem', 'nuc', 'clo', 'vac', 'mit', 'rib']],
    virus: ['Virus', ['cap', 'esp', 'gen', 'env']],
    hongo: ['Levadura (hongo)', ['par', 'nuc', 'mit', 'vac', 'gem']]
  },
  /* brote: '.' sano · 'X' infectado · '#' muro · 'V' protegido. Cada turno proteges «per» casillas y luego el brote pasa a las vecinas */
  grid: map => ({ w: map[0].length, h: map.length, c: map.join('').split('') }),
  nb(g, i) { const x = i % g.w, o = []; if (x > 0) o.push(i - 1); if (x < g.w - 1) o.push(i + 1); if (i >= g.w) o.push(i - g.w); if (i < g.w * (g.h - 1)) o.push(i + g.w); return o; },
  front(g) { const f = []; for (let i = 0; i < g.c.length; i++) if (g.c[i] === '.' && ORG.nb(g, i).some(j => g.c[j] === 'X')) f.push(i); return f; },
  spread(g) { const f = ORG.front(g); f.forEach(i => { g.c[i] = 'X'; }); return f; },
  safe: g => g.c.filter(v => v === '.' || v === 'V').length,
  /* simula una lista de casillas protegidas; devuelve cuántas quedan a salvo (−1 si la lista no es válida) */
  run(p, sol) {
    const g = ORG.grid(p.map); let q = 0, guard = 0;
    while (ORG.front(g).length && guard++ < 99) {
      for (let n = 0; n < p.per && ORG.front(g).length; n++) { const i = sol[q++]; if (i == null || g.c[i] !== '.') return -1; g.c[i] = 'V'; }
      ORG.spread(g);
    }
    return ORG.safe(g);
  },
  sol: p => String(p.sol).split(',').map(Number)
};
/* etiquetas nuevas para sustancias que ya existían */
(function () {
  const add = (id, t) => { const c = COMPOUNDS.find(c => c[0] === id); if (c) c[4] += ',' + t; };
  [['VITC', 'inm1'], ['ZNO', 'inm1'], ['HIST', 'inm1'], ['GLU', 'eco1'], ['H2O', 'eco1'], ['CO2', 'eco1'], ['NH3', 'eco2'], ['UREA', 'eco2'], ['C2H4', 'eco1'], ['H3PO4', 'eco1'], ['CaCO3', 'eco1'], ['KCL', 'eco1'], ['CaOH2', 'eco1'], ['SALI', 'eco1'], ['O2', 'eco1']].forEach(([id, t]) => add(id, t));
})();
COMPOUNDS.push(
 ['PIR','C3H4O3','Ácido pirúvico','CC(=O)C(=O)O','nrg2,bio1','El cruce de caminos de la energía: cada glucosa se parte en dos piruvatos.'],
 ['PROP','C3H6O2','Ácido propiónico','CCC(=O)O','anti1,bio1,acid1','Lo fabrican las bacterias del queso suizo. También conserva el pan.'],
 ['DIAC','C4H6O2','Diacetilo','CC(=O)C(C)=O','bio1,org1','El aroma de la mantequilla: lo producen las bacterias lácticas.'],
 ['BUT','C4H8O2','Ácido butírico','CCCC(=O)O','bio2,eco1,nrg1','Tus bacterias intestinales lo fabrican con la fibra, y alimenta a las células del colon.'],
 ['CIT','C6H8O7','Ácido cítrico','OC(=O)CC(O)(CC(=O)O)C(=O)O','acid1,nrg2,bio1,eco1','El ácido de los limones y una pieza central del ciclo de Krebs, la rueda de energía de la mitocondria.'],
 ['BLAC','C3H5NO','β-Lactama','O=C1CCN1','med2,anti2','Un anillo cuadrado y tenso: el corazón de la penicilina. Bloquea la construcción de la pared bacteriana.'],
 ['NAG','C8H15NO6','N-acetilglucosamina','CC(=O)NC1C(O)OC(CO)C(O)C1O','struct2,bio2','Ladrillo de la pared de las bacterias y de la quitina de hongos e insectos.'],
 ['ISO','C6H7N3O','Isoniazida','NNC(=O)C1=CC=NC=C1','med3,anti1','Medicina contra la tuberculosis desde 1952. Se toma durante meses y siempre con control médico.'],
 ['XIL','C5H12O5','Xilitol','OCC(O)C(O)C(O)CO','anti1,nrg1,bio1','Endulza, pero las bacterias de la caries no pueden fermentarlo.'],
 ['ACV','C8H11N5O3','Aciclovir','NC1=NC2=C(N=CN2COCCO)C(=O)N1','med2,gen2','Antiviral que imita a la guanina: el virus lo usa por error y su copia se detiene.'],
 ['TIMOL','C10H14O','Timol','CC1=CC(O)=C(C=C1)C(C)C','anti3,org1,eco1','El antiséptico del tomillo: está en muchos enjuagues bucales.'],
 ['SORB','C6H8O2','Ácido sórbico','CC=CC=CC(=O)O','anti2,eco1','Conservante de alimentos: frena mohos y levaduras.'],
 ['PUT','C4H12N2','Putrescina','NCCCCN','bio2,base1','El olor de lo que se descompone. En dosis mínimas, todas tus células la usan para crecer.'],
 ['FRU','C6H12O6','Fructosa','OCC(=O)C(O)C(O)C(O)CO','nrg3,eco2','El azúcar de la fruta: los mismos átomos que la glucosa, ordenados de otra forma (isómeros).'],
 ['AIA','C10H9NO2','Ácido indolacético','OC(=O)CC1=CNC2=CC=CC=C12','eco3,bio1','Auxina: la hormona que hace crecer a las plantas hacia la luz.'],
 ['MAL','C4H6O5','Ácido málico','OC(=O)CC(O)C(=O)O','acid1,nrg1,eco2','El ácido de las manzanas verdes.'],
 ['AlOH3','Al(OH)3','Hidróxido de aluminio','O[Al](O)O','inm2,base1','Adyuvante: ayuda a que algunas vacunas despierten mejor a las defensas. También es antiácido.'],
 ['TMA','C3H9N','Trimetilamina','CN(C)C','base1,bio1','El olor del pescado pasado: la producen las bacterias al descomponerlo.']
);
REACTIONS.push(
 ['R_GLUC','Glucólisis (simplificada)','GLU+O2=2PIR+2H2O',-20,'La glucosa se parte en dos piruvatos: el primer paso para sacarle energía, en todos los seres vivos.'],
 ['R_LACP','Fermentación láctica','PIR+H2=LAC',-25,'Sin oxígeno, el piruvato recibe hidrógenos y se vuelve ácido láctico: yogur… y agujetas.'],
 ['R_BUTF','Fermentación butírica','GLU=BUT+2CO2+2H2',-60,'Bacterias del intestino y del suelo convierten el azúcar en ácido butírico y gases.'],
 ['R_UREASA','Ureasa','UREA+H2O=CO2+2NH3',30,'Algunas bacterias rompen la urea para rodearse de amoníaco y resistir el ácido.'],
 ['R_METG','Metanogénesis','CO2+4H2=CH4+2H2O',-165,'Las arqueas de los pantanos y del estómago de las vacas respiran CO₂ y sueltan metano.'],
 ['R_QUIM','Quimiosíntesis','CO2+4H2S+O2=CH2O+4@S+3H2O',-50,'En el fondo del mar no hay luz: las bacterias fabrican alimento con la energía del sulfuro de hidrógeno.']
);
DIFF.push(
 {g:1,fail:1,ah:5,bal:0,crit:1,rg:1},{g:1,fail:1,ah:5,bal:0,crit:1,rg:1.2},{g:1,fail:1,ah:6,bal:0,crit:1,rg:1.4},{g:1,fail:1,ah:6,bal:0,crit:1,rg:1.5},{g:0,fail:1,ah:7,bal:0,crit:1,rg:1.6},
 {g:0,fail:1,ah:7,bal:0,crit:1,rg:1.8},{g:0,fail:1,ah:8,bal:0,crit:1,rg:2},{g:0,fail:1,ah:8,bal:0,crit:1,rg:2},{g:0,fail:1,ah:9,bal:0,crit:1,rg:2.2},{g:0,fail:1,ah:9,bal:0,crit:1,rg:2.2}
);
STORY.s4i = [
  ['doc','loco','¡VIDA!','Ya sé leer el manual de la vida. Ahora quiero escribir uno. ¡Voy a crear un organismo!'],
  ['eter','enojado','DESPACIO, DOC','Antes de crear vida hay que entenderla. Empieza por lo más pequeño que está vivo: una célula.'],
  ['eter','neutral','REGLAS DEL CULTIVO','Aquí verás los microbios solo como idea: qué son, cómo se frenan y por qué casi todos son útiles. Nada de recetas.'],
  ['doc','sorpresa','TEMPORADA 4: ORGANISMOS','Células, bacterias, virus, hongos, plantas, defensas… y algo que late en el tanque 7.']
];
STORY.s4e = [
  ['eter','feliz','EQUILIBRIO','El Primogénito dejó de crecer. No lo destruiste: le pusiste un límite, como hace todo ecosistema.'],
  ['doc','triste','MI CRIATURA','Quise fabricar vida para sentirme un dios. Me salió un espejo.'],
  ['doc','feliz','JARDINERO','Ahora cuido el invernadero. Crear resultó fácil; lo difícil es cuidar.'],
  ['eter','sorpresa','TEMPORADA 5','Queda una puerta: la TESIS. Niveles 41–50… ¿se puede dominar la realidad?']
];
const o = (mode, x) => Object.assign({ k: 'o', mode }, x);
LEVELS.push(
{ n:31, t:'CÉLULA', s:'La pieza más pequeña que está viva', gift:[],
  talk:[['eter','neutral','Todo ser vivo está hecho de células. La más sencilla es una bacteria: una bolsa con instrucciones y fábricas.'],['doc','sorpresa','¿Y yo cuántas tengo?'],['eter','feliz','Unos 30 billones. Y otras tantas bacterias de inquilinas.']],
  tx:{ teo:'La célula es la unidad más pequeña de la vida. Las bacterias (procariotas) no tienen núcleo: su ADN flota suelto. Las células de animales, plantas y hongos (eucariotas) guardan el ADN en un núcleo y tienen orgánulos, como las mitocondrias.',
       dato:'En tu cuerpo hay más o menos tantas bacterias como células humanas: unos 30 billones de cada una.',
       fic:'Puse una gota del tanque 7 bajo el microscopio. Algo nadaba. ÉTER: «Salúdala: es tu tatarabuela».' },
  P:[
   o('cel',{cel:'bact',q:['mem','adn','rib'],t:'La bacteria',d:'Lee la pregunta y toca el círculo «?» de la parte correcta.',T:80}),
   {k:'m',id:'GLYC',t:'Glicerol',d:'Tres carbonos, cada uno con un –OH: la base de las grasas de la membrana.',T:300},
   o('ord',{rule:'Del más pequeño al más grande',items:['Átomo','Molécula de agua','Proteína','Virus','Bacteria','Glóbulo rojo','Grano de arena'],t:'¿Qué tan pequeño?',d:'Toca en orden, del más pequeño al más grande.',T:80}),
   o('cel',{cel:'bact',q:['par','fla','pla','mem','rib','adn'],t:'Bacteria completa',d:'Las seis partes de una bacteria.',T:110}),
   {k:'b',t:'Agua contaminada',d:'El tanque de agua se llenó de bacterias.',sc:'Bacterias en el agua · turbidez',w:'anti2,oxi1',h:'nrg1,bio1',hp:330,T:60,dps:1.6},
   o('cel',{cel:'animal',q:['nuc','mit','mem','rib'],t:'Célula animal',d:'Tus células guardan el ADN en un núcleo.',T:90}),
   {k:'m',id:'PIR',t:'Ácido pirúvico',d:'Tres carbonos: un metilo, un C=O y un ácido –COOH.',T:300},
   o('cls',{rule:'¿Guarda su ADN en un núcleo?',cats:['Sin núcleo (procariota)','Con núcleo (eucariota)'],items:[['Bacteria del yogur',0],['Célula de tu piel',1],['Levadura del pan',1],['Salmonela',0],['Célula de una hoja',1],['Arquea de aguas termales',0],['Ameba',1]],t:'Con o sin núcleo',d:'Clasifica cada célula.',T:80}),
   {k:'r',id:'R_GLUC',t:'Glucólisis',d:'Glucosa + oxígeno → 2 piruvatos + 2 aguas (simplificada). Balancea.',T:170},
   {k:'b',boss:1,t:'La biopelícula',d:'Las bacterias se pegaron en una capa babosa que las protege.',sc:'Biopelícula en las tuberías',w:'anti2,org1',h:'bio1,nrg1',hp:450,T:90,dps:1.6,ph2:{d:'Se esconden bajo el limo',w:'oxi2,anti1',h:'bio1'}}
  ]},
{ n:32, t:'ENERGÍA', s:'Respirar o fermentar', gift:[],
  talk:[['doc','sorpresa','¿Las bacterias respiran?'],['eter','neutral','Algunas sí. Otras fermentan: sacan energía del azúcar sin oxígeno. Así se hacen el yogur, el pan y el queso.']],
  tx:{ teo:'Con oxígeno, la célula quema la glucosa por completo en la mitocondria (respiración). Sin oxígeno, la fermenta: las levaduras producen etanol y CO₂; las bacterias lácticas, ácido láctico. Fermentar da mucha menos energía, pero no necesita aire.',
       dato:'Los agujeros del queso suizo son burbujas de CO₂ que sueltan las bacterias propiónicas.',
       fic:'Dejé leche en el tanque equivocado. Al tercer día tenía yogur. ÉTER lo anotó como mi primer experimento exitoso.' },
  P:[
   {k:'r',id:'R_LACP',t:'Fermentación láctica',d:'Piruvato + hidrógeno → ácido láctico: así nace el yogur.',T:150},
   {k:'m',id:'PROP',t:'Ácido propiónico',d:'Tres carbonos en fila y un ácido: el sabor del queso suizo.',T:260},
   o('cel',{cel:'animal',q:['mit','gol','lis','nuc','mem','rib'],t:'La central de energía',d:'Las seis partes de una célula animal.',T:110}),
   {k:'m',id:'DIAC',t:'Diacetilo',d:'Cuatro carbonos con dos C=O seguidos en el centro: el aroma de la mantequilla.',T:280},
   {k:'b',t:'Fermentación desbocada',d:'Los tanques de comida se inflan de gas.',sc:'Levaduras sin control · CO₂ y etanol',w:'cool2,anti1',h:'nrg2',hp:300,T:60,dps:1.6},
   {k:'r',id:'R_BUTF',t:'Fermentación butírica',d:'Glucosa → ácido butírico + 2 CO₂ + 2 H₂.',T:170},
   {k:'m',id:'CIT',t:'Ácido cítrico',d:'Un carbono central con un –OH y un –COOH, y dos brazos –CH₂–COOH.',T:380},
   o('ord',{rule:'El viaje de la energía',items:['Luz del Sol','El cloroplasto fabrica glucosa','Te comes la planta','La mitocondria quema la glucosa','ATP: energía lista para usar','El músculo se mueve'],t:'Del Sol al músculo',d:'Ordena los pasos.',T:90}),
   {k:'s',n:6,mix:['GLU','PIR','LAC','C2H5OH','CO2','BUT'],t:'Fermentador',d:'Separa lo que produce cada microbio.',T:170},
   {k:'b',boss:1,t:'Asfixia celular',d:'Un veneno bloquea las mitocondrias: hay oxígeno, pero las células no pueden usarlo.',sc:'Mitocondrias bloqueadas · sin energía',w:'antid2,nrg2',h:'fuel1',hp:400,T:90,dps:1.6,ph2:{d:'Se acumula ácido láctico',w:'base2,salt1',h:'acid1'}}
  ]},
{ n:33, t:'BACTERIAS', s:'Pequeñas, antiguas y casi siempre útiles', gift:[],
  talk:[['eter','neutral','De cada cien tipos de bacterias, menos de uno te enferma. Las demás hacen el suelo, el queso y parte de tu digestión.'],['doc','loco','¿Y a las malas?'],['eter','neutral','A esas se les rompe la pared. Así funciona la penicilina.']],
  tx:{ teo:'Las bacterias tienen una pared de peptidoglicano: una malla de azúcares, como la N-acetilglucosamina, cosida con péptidos. La penicilina lleva un anillo de cuatro átomos, la β-lactama, que bloquea a la enzima que cose la malla; la bacteria crece y se revienta. Nuestras células no tienen pared, así que no les afecta.',
       dato:'Alexander Fleming descubrió la penicilina en 1928, al ver que un moho había matado las bacterias de una placa olvidada.',
       fic:'Olvidé una placa junto a la ventilación y le creció moho. ÉTER dijo que así empiezan los premios Nobel… y las intoxicaciones.' },
  P:[
   {k:'m',id:'BLAC',t:'El anillo de la penicilina',d:'β-lactama: un cuadrado de tres carbonos y un nitrógeno, con un C=O.',T:260},
   o('epi',{map:['X......'],per:1,save:6,sol:'1',t:'Cierra el paso',d:'El brote pasa a las casillas vecinas. Toca una casilla sana para protegerla y cortarle el camino.',T:60}),
   {k:'m',id:'NAG',t:'Ladrillo de la pared',d:'Una glucosa en anillo que cambia un –OH por –NH–CO–CH₃.',T:400},
   o('cls',{rule:'Casi todas las bacterias son inofensivas o útiles',cats:['Útil','Peligrosa'],items:[['Lactobacilos del yogur',0],['Bacteria del cólera',1],['Rizobios que abonan las raíces',0],['Salmonela',1],['Bacterias de tu intestino',0],['Bacilo de la tuberculosis',1]],t:'¿Amiga o enemiga?',d:'Clasifica cada bacteria.',T:80}),
   {k:'b',t:'Herida infectada',d:'El corte de un tripulante se infectó.',sc:'Bacterias en la herida · pus',w:'anti2,med1',h:'bio1,nrg1',hp:340,T:60,dps:1.6},
   {k:'m',id:'ISO',t:'Isoniazida',d:'Una piridina (benceno con un N) unida a –CO–NH–NH₂.',T:340},
   o('epi',{map:['...X...'],per:1,save:5,sol:'2,5',t:'Dos caminos',d:'Ahora el brote avanza hacia los dos lados. No siempre se salva a todos.',T:70}),
   {k:'m',id:'XIL',t:'Xilitol',d:'Cinco carbonos en fila, cada uno con un –OH.',T:300},
   {k:'b',t:'Caries espacial',d:'Las bacterias de la boca convierten el azúcar en ácido.',sc:'Ácido sobre el esmalte',w:'base1,anti1,salt1',h:'nrg2,acid1',hx:'GLU',hp:220,T:60,dps:1.6},
   {k:'b',boss:1,t:'Neumonía bacteriana',d:'Una bacteria se instaló en los pulmones de un durmiente.',sc:'Bacterias en los pulmones · fiebre',w:'med2,anti2',h:'bio1',hp:450,T:90,dps:1.6,ph2:{d:'Se cubre con una cápsula',w:'med2,inm1',h:'nrg1'}}
  ]},
{ n:34, t:'VIRUS', s:'Un mensaje con caja', gift:[],
  talk:[['eter','neutral','Un virus no come, no respira y no crece. Es un mensaje dentro de una caja: necesita una célula para copiarse.'],['doc','sorpresa','¿Entonces los antibióticos…?'],['eter','enojado','No le hacen nada: no tiene pared que romper. Contra los virus sirven las vacunas, los antivirales y el jabón.']],
  tx:{ teo:'Un virus es material genético (ADN o ARN) dentro de una cápside de proteína; algunos llevan además una envoltura de grasa. No tiene metabolismo: entra en una célula y usa sus ribosomas para copiarse. Por eso los antibióticos no sirven contra ellos.',
       dato:'El jabón rompe la envoltura de grasa de virus como los de la gripe: por eso lavarse las manos 20 segundos funciona.',
       fic:'Un durmiente estornudó dentro de su cápsula. ÉTER selló tres cubiertas antes de que yo dijera «salud».' },
  P:[
   o('cel',{cel:'virus',q:['gen','cap','esp','env'],t:'Anatomía de un virus',d:'Un virus tiene muy pocas piezas.',T:90}),
   o('ord',{rule:'Cómo se copia un virus',items:['Se pega a una célula','Entra','La célula copia sus genes','Los ribosomas fabrican sus piezas','Las piezas se ensamblan','Salen virus nuevos'],t:'El ciclo del virus',d:'Ordena los pasos.',T:90}),
   {k:'m',id:'ACV',t:'Aciclovir',d:'Una guanina con una cadena –CH₂–O–CH₂–CH₂–OH en el lugar del azúcar.',T:420},
   o('cls',{rule:'Los antibióticos solo sirven contra bacterias',cats:['Bacteria','Virus'],items:[['Gripe',1],['Tuberculosis',0],['Resfriado común',1],['Cólera',0],['Sarampión',1],['Salmonelosis',0],['Varicela',1],['Rabia',1]],t:'¿Bacteria o virus?',d:'¿Qué causa cada enfermedad?',T:90}),
   {k:'b',t:'Gripe de a bordo',d:'Tres cubiertas con fiebre.',sc:'Virus respiratorio · fiebre',w:'med2,cool1,inm1',h:'bio1',hp:340,T:60,dps:1.6},
   o('epi',{map:['....#....','.X..#....','.........','....#....'],per:1,save:17,sol:'11,2,21,30',t:'Cuarentena',d:'Hay un solo paso entre las dos cubiertas. Protege la casilla que lo cierra.',T:80}),
   {k:'m',id:'TIMOL',t:'Timol',d:'Un fenol (benceno con –OH) con un metilo y un isopropilo.',T:360},
   {k:'s',n:7,mix:['ACV','TIMOL','C2H5OH','H2O2','NaClO','H2O','I2'],t:'Botiquín antiviral',d:'Un antiviral y seis desinfectantes.',T:190},
   {k:'b',mut:10,t:'Virus mutante',d:'Cambia de forma cada 10 s: mira el escáner antes de lanzar.',sc:'Virus de ARN · muta rápido',w:'med2,gen1',h:'bio1',hp:340,T:60,dps:1.6,ph2:{d:'Cambió sus espículas',w:'anti2,inm1',h:'bio1'}},
   {k:'b',boss:1,mut:12,t:'La gripe estelar',d:'Muta: su debilidad cambia cada 12 s. Mira el escáner antes de lanzar.',sc:'Virus nuevo · salta de cápsula en cápsula',w:'med2,inm1',h:'bio1',hp:380,T:90,dps:1.6,ph2:{d:'Estrena espículas',w:'anti2,gen2',h:'nrg1'}}
  ]},
{ n:35, t:'HONGOS', s:'Levaduras, mohos y setas', gift:[],
  talk:[['doc','feliz','¡Pan! ¡Por fin algo que entiendo!'],['eter','neutral','La levadura es un hongo de una sola célula. Come azúcar y suelta CO₂: por eso sube la masa.']],
  tx:{ teo:'Los hongos no son plantas: no hacen fotosíntesis, se alimentan de materia orgánica y su pared es de quitina, el material del caparazón de los insectos. Hay levaduras (una sola célula), mohos y setas. Son los grandes recicladores del planeta.',
       dato:'El ser vivo más grande conocido es un hongo: una Armillaria de Oregón, en Estados Unidos, que ocupa unos 9 km² bajo el suelo.',
       fic:'El moho de la despensa escribió un círculo perfecto en el pan. ÉTER lo midió. Yo me lo quería comer.' },
  P:[
   o('cel',{cel:'hongo',q:['gem','par','nuc','vac','mit'],t:'La levadura',d:'Un hongo de una sola célula.',T:100}),
   {k:'r',id:'R_FERM',t:'Que suba el pan',d:'Glucosa → 2 etanol + 2 CO₂. Balancea.',T:150},
   {k:'m',id:'SORB',t:'Ácido sórbico',d:'Seis carbonos con dos dobles enlaces alternados y un ácido al final.',T:320},
   o('cls',{rule:'Tres microbios muy distintos',cats:['Bacteria','Virus','Hongo'],items:[['Levadura del pan',2],['Moho del queso azul',2],['Gripe',1],['Pie de atleta',2],['Lactobacilo del yogur',0],['Champiñón',2],['Sarampión',1],['Cólera',0]],t:'¿Quién es quién?',d:'Clasifica cada uno.',T:90}),
   {k:'b',t:'Moho en la despensa',d:'Manchas verdes sobre la comida.',sc:'Moho · esporas en el aire',w:'anti2,cool1',h:'solv1,nrg1',hp:340,T:60,dps:1.6},
   {k:'m',id:'PUT',t:'Putrescina',d:'Cuatro carbonos en fila con una amina en cada punta.',T:260},
   o('ord',{rule:'Cómo recicla un hongo',items:['Cae una hoja','El hongo suelta enzimas','La hoja se deshace en moléculas','El hongo las absorbe','Los minerales vuelven al suelo','Una planta los aprovecha'],t:'Los recicladores',d:'Ordena los pasos.',T:90}),
   {k:'m',id:'APA',t:'El núcleo de la penicilina',d:'Ácido 6-aminopenicilánico: la β-lactama pegada a un anillo con azufre.',T:440},
   {k:'b',t:'Roya en los cultivos',d:'Un hongo cubre las hojas del invernadero.',sc:'Hongo en las hojas',w:'anti2,eco1',h:'solv1',hp:340,T:60,dps:1.6},
   {k:'b',boss:1,t:'El micelio',d:'Una red de hilos de hongo se extiende por los ductos.',sc:'Micelio en los ductos · esporas',w:'anti2,seal1',h:'solv1,bio1',hp:450,T:90,dps:1.6,ph2:{d:'Suelta esporas',w:'seal2,cool1',h:'nrg1'}}
  ]},
{ n:36, t:'PLANTAS', s:'Comer luz', gift:[],
  talk:[['eter','neutral','Una planta fabrica su comida con aire, agua y luz. Todo lo que comes empezó así.'],['doc','loco','¡Quiero un invernadero que crezca en una noche!'],['eter','enojado','Las plantas no tienen prisa. Aprende de ellas.']],
  tx:{ teo:'En los cloroplastos, la clorofila atrapa la luz y la usa para unir CO₂ y agua en glucosa, soltando oxígeno. Las plantas se coordinan con hormonas: la auxina las hace crecer hacia la luz y el etileno madura los frutos.',
       dato:'Un plátano maduro suelta etileno, un gas que hace madurar a las frutas que tiene cerca.',
       fic:'Puse un plátano junto a los tomates verdes del invernadero. Por la mañana estaban rojos. ÉTER lo llamó «química de frutero».' },
  P:[
   o('cel',{cel:'planta',q:['clo','vac','par','nuc'],t:'Célula vegetal',d:'Tiene pared, un gran tanque de agua y paneles solares.',T:90}),
   {k:'r',id:'R_FOTO',t:'Fotosíntesis',d:'6 CO₂ + 6 H₂O → glucosa + 6 O₂. Balancea.',T:170},
   {k:'m',id:'FRU',t:'Fructosa',d:'Seis carbonos en fila: el segundo lleva un C=O y los demás un –OH.',T:360},
   o('ord',{rule:'De la semilla al fruto',items:['Semilla','Raíz','Tallo y hojas','Flor','Polinización','Fruto con semillas'],t:'Una vida de planta',d:'Ordena las etapas.',T:80}),
   {k:'m',id:'AIA',t:'Auxina',d:'Un indol (dos anillos fusionados, uno con N) y una cola –CH₂–COOH.',T:400},
   {k:'b',t:'Invernadero marchito',d:'Las plantas de la nave se quedan sin nutrientes.',sc:'Hojas amarillas · falta nitrógeno',w:'eco2,solv1',h:'salt1',hp:250,T:60,dps:1.6},
   {k:'m',id:'MAL',t:'Ácido málico',d:'Cuatro carbonos: un –COOH en cada punta y un –OH en el segundo.',T:300},
   o('cel',{cel:'planta',q:['mit','rib','mem','clo','vac','par','nuc'],t:'Célula vegetal completa',d:'Las siete partes.',T:120}),
   {k:'s',n:7,mix:['GLU','FRU','MAL','CIT','AIA','C2H4','H2O'],t:'Savia',d:'Azúcares, ácidos y hormonas de una planta.',T:190},
   {k:'b',boss:1,t:'La plaga del invernadero',d:'Insectos y hongos atacan a la vez.',sc:'Hojas mordidas · manchas',w:'eco2,anti1',h:'nrg1',hp:320,T:90,dps:1.6,ph2:{d:'El hongo entra por las heridas',w:'anti2,seal1',h:'solv1'}}
  ]},
{ n:37, t:'DEFENSAS', s:'El ejército de adentro', gift:[],
  talk:[['eter','neutral','Una vacuna le enseña a tu cuerpo una foto del enemigo. Si el de verdad llega, ya lo conoce.'],['doc','feliz','¡Un simulacro!'],['eter','feliz','Exacto. Y cuantos más lo hacen, menos caminos le quedan al brote.']],
  tx:{ teo:'Las defensas tienen dos líneas. La innata actúa en minutos: piel, fiebre y glóbulos blancos que se comen a los invasores. La adaptativa tarda días, pero aprende: los linfocitos B fabrican anticuerpos a la medida y dejan células de memoria. Una vacuna entrena esa memoria sin pasar la enfermedad.',
       dato:'La viruela mató a cientos de millones de personas. Se declaró erradicada en 1980 gracias a la vacunación en anillo: vacunar a todos los contactos alrededor de cada caso.',
       fic:'ÉTER me pidió vacunar a los durmientes de la cubierta 3 antes que a mí. «Tú ya estás inmunizado contra el sentido común», dijo.' },
  P:[
   o('ord',{rule:'Cómo funciona una vacuna',items:['Vacuna: una pieza inofensiva del microbio','Las defensas la detectan','Los linfocitos B fabrican anticuerpos','Quedan células de memoria','Llega el microbio de verdad','Respuesta rápida: no enfermas'],t:'El simulacro',d:'Ordena los pasos.',T:90}),
   {k:'m',id:'AlOH3',t:'Adyuvante',d:'Hidróxido de aluminio: un aluminio con tres –OH.',T:220},
   o('epi',{map:['.......','..X....','.......','.......'],per:2,save:21,sol:'8,16,11,17,0,4',t:'Vacunación en anillo',d:'Ahora tienes 2 protecciones por turno. Rodea el brote.',T:100}),
   {k:'b',t:'Alergia',d:'Las defensas atacan al polen del invernadero.',sc:'Histamina alta · estornudos',w:'med2,cool1',h:'bio1',hx:'HIST',hp:340,T:60,dps:1.6},
   o('cls',{rule:'Tres líneas de defensa',cats:['Barrera','Innata (rápida)','Adaptativa (aprende)'],items:[['Piel',0],['Fiebre',1],['Anticuerpos',2],['Lágrimas',0],['Glóbulo blanco que se come al invasor',1],['Células de memoria',2],['Moco',0]],t:'Líneas de defensa',d:'¿A qué línea pertenece cada una?',T:90}),
   {k:'m',id:'HIST',t:'Histamina experta',d:'La alarma de la alergia, sin plano ni fórmula.',T:300},
   o('epi',{map:['..V...V..','V.X..V...','..V..V.V.','.V..V..V.'],per:1,save:32,sol:'12,1,18',t:'Inmunidad de rebaño',d:'Muchos ya están protegidos (azul). Aprovecha y cierra los huecos.',T:100}),
   {k:'b',t:'Tormenta de citoquinas',d:'Las defensas exageran y dañan al propio cuerpo.',sc:'Inflamación descontrolada',w:'med3,cool1',h:'inm1,bio1',hp:340,T:60,dps:1.6},
   {k:'r',id:'R_H2O2',t:'Estallido oxidativo',d:'Tus glóbulos blancos atacan con agua oxigenada; la catalasa la descompone. Balancea.',T:140},
   {k:'b',boss:1,mut:12,t:'El impostor',d:'Un virus que se disfraza de célula propia y cambia de disfraz cada 12 s.',sc:'Virus camuflado',w:'inm1,med2',h:'bio1',hp:350,T:90,dps:1.6,ph2:{d:'Se disfraza de célula sana',w:'gen2,anti2',h:'nrg1'}}
  ]},
{ n:38, t:'RESISTENCIA', s:'Lo que no las mata…', gift:[],
  talk:[['eter','enojado','Cada vez que un antibiótico se usa mal, sobreviven las bacterias más duras. Y se pasan el truco en plásmidos.'],['doc','sorpresa','¡Evolución en directo!'],['eter','neutral','Por eso se toma solo cuando lo receta un médico, y el tratamiento completo.']],
  tx:{ teo:'La resistencia a los antibióticos es selección natural: en una población siempre hay alguna bacteria que aguanta más. Si el antibiótico se usa sin necesidad o se corta antes de tiempo, esas sobreviven y se multiplican. Además comparten genes de resistencia en plásmidos.',
       dato:'La OMS considera la resistencia a los antibióticos una de las mayores amenazas para la salud mundial: en 2019 se asoció a casi 5 millones de muertes.',
       fic:'Una bacteria del tanque 7 sobrevivió a todo mi botiquín. ÉTER: «No es más fuerte que tú. Solo se reproduce cada veinte minutos».' },
  P:[
   o('ord',{rule:'Cómo nace una superbacteria',items:['Millones de bacterias, casi todas sensibles','Se usa mal un antibiótico','Mueren las sensibles','Sobreviven las resistentes','Se multiplican','Pasan su plásmido a otras'],t:'Selección natural',d:'Ordena los pasos.',T:90}),
   {k:'b',fat:2,t:'Estafilococo resistente',d:'Se adapta el doble de rápido: varía lo que lanzas.',sc:'Bacteria resistente · herida que no cierra',w:'anti2,med2',h:'bio1',hp:350,T:60,dps:1.6},
   o('cel',{cel:'bact',q:['pla','par','rib','fla','adn','mem'],t:'¿Dónde viaja la resistencia?',d:'Empieza por el anillo que se comparten.',T:90}),
   {k:'m',id:'SULF',t:'Sulfanilamida experta',d:'El primer antibacteriano moderno, sin plano ni fórmula.',T:360},
   o('epi',{map:['X...#...X','....#....','.........','....#....'],per:2,save:26,sol:'1,9,6,16,25,35',t:'Brote hospitalario',d:'Dos focos a la vez y 2 protecciones por turno.',T:110}),
   {k:'m',id:'TMA',t:'Trimetilamina',d:'Un nitrógeno con tres metilos.',T:240},
   {k:'b',fat:2,t:'Bacilo multirresistente',d:'Ya resistía dos antibióticos.',sc:'Resistencia múltiple',w:'med2,inm1,anti1',h:'bio1,nrg1',hp:350,T:60,dps:1.6},
   {k:'r',id:'R_UREASA',t:'Ureasa',d:'Urea + agua → CO₂ + 2 amoníaco: el truco de una bacteria para aguantar el ácido del estómago.',T:150},
   {k:'s',n:8,mix:['BLAC','ISO','SULF','APA','TIMOL','C2H5OH','I2','H2O2'],t:'Arsenal completo',d:'Cuatro antibacterianos y cuatro antisépticos.',T:210},
   {k:'b',boss:1,fat:2,mut:14,t:'La superbacteria',d:'Se adapta el doble de rápido y cambia de debilidad cada 14 s.',sc:'Resistente a casi todo',w:'anti3,med1',h:'bio1',hp:420,T:90,dps:1.6,ph2:{d:'Activa otro plásmido',w:'med2,inm1,oxi1',h:'nrg1'}}
  ]},
{ n:39, t:'ECOSISTEMAS', s:'Nadie vive solo', gift:[],
  talk:[['eter','neutral','En un ecosistema, la basura de uno es la comida de otro. Los átomos dan vueltas; nada se desperdicia.'],['doc','sorpresa','¿Y la energía?'],['eter','triste','Esa sí se pierde: en cada bocado se escapa casi toda como calor.']],
  tx:{ teo:'Un ecosistema es una red. Los productores (plantas y algas) capturan la energía del Sol, los consumidores se los comen y los descomponedores (hongos y bacterias) devuelven los nutrientes al suelo. Los átomos se reciclan; la energía no: en cada paso se pierde cerca del 90 %.',
       dato:'En las fuentes hidrotermales del fondo del mar no llega la luz: allí las bacterias fabrican alimento con la energía del sulfuro de hidrógeno.',
       fic:'El invernadero de la Ouroboros es un planeta de bolsillo. Cuando murieron las lombrices, tardé una semana en notar que todo lo demás se moría detrás.' },
  P:[
   o('ord',{rule:'¿Quién se come a quién?',items:['Luz del Sol','Algas','Krill','Pez','Foca','Orca'],t:'Cadena alimenticia',d:'Toca en orden, empezando por la fuente de energía.',T:70}),
   {k:'r',id:'R_METG',t:'Arqueas del metano',d:'CO₂ + 4 H₂ → CH₄ + 2 H₂O. Balancea.',T:160},
   o('cls',{rule:'Tres oficios en todo ecosistema',cats:['Productor','Consumidor','Descomponedor'],items:[['Alga',0],['Vaca',1],['Champiñón',2],['Roble',0],['Águila',1],['Bacteria del suelo',2],['Krill',1],['Musgo',0]],t:'Oficios de la vida',d:'¿Qué hace cada uno?',T:90}),
   {k:'m',id:'BUT',t:'Ácido butírico',d:'Cuatro carbonos en fila y un ácido.',T:260},
   {k:'b',t:'Lago sin oxígeno',d:'Demasiado fertilizante: las algas crecen, mueren y agotan el oxígeno.',sc:'Algas en exceso · peces sin aire',w:'oxi2,eco1,base1',h:'salt1',hp:320,T:60,dps:1.6},
   {k:'r',id:'R_QUIM',t:'Quimiosíntesis',d:'CO₂ + 4 H₂S + O₂ → formaldehído + 4 S + 3 H₂O: vida sin luz.',T:200},
   o('ord',{rule:'El viaje del nitrógeno',items:['N₂ en el aire','Las bacterias lo fijan en la raíz','La planta fabrica proteínas','Un animal se come la planta','Los descomponedores lo liberan','Vuelve al aire'],t:'Ciclo del nitrógeno',d:'Ordena los pasos.',T:90}),
   {k:'s',n:8,mix:['CO2','O2','N2','NH3','CH4','H2O','GLU','H2S'],t:'Biosfera en frascos',d:'Los gases y nutrientes de un planeta vivo.',T:210},
   {k:'b',t:'Especie invasora',d:'Una maleza llegó en una semilla perdida y lo cubre todo.',sc:'Crecimiento sin depredadores',w:'eco2,bio1,acid1',h:'solv1',hp:290,T:60,dps:1.6},
   {k:'b',boss:1,t:'Colapso del invernadero',d:'La biosfera de la nave perdió el equilibrio.',sc:'CO₂ alto · suelo muerto',w:'eco2,base1',h:'fuel1',hp:280,T:90,dps:1.6,ph2:{d:'Faltan descomponedores: no los mates',w:'bio2,eco1',h:'anti1'}}
  ]},
{ n:40, t:'EL PRIMOGÉNITO', s:'La vida no es un juguete', gift:[],
  talk:[['doc','loco','¡Lo hice! Junté todo lo aprendido en una sola célula. ¡Mi criatura!'],['eter','enojado','Rompió el tanque 7. Crece, se copia y cambia. No la venzas a golpes: ponle un límite.'],['doc','triste','Como a mí.']],
  tx:{ teo:'La biología sintética diseña células con funciones nuevas: bacterias que fabrican insulina o levaduras que producen medicinas. Se trabaja con normas de bioseguridad y contención, porque un ser vivo, a diferencia de una molécula, se copia a sí mismo.',
       dato:'En 2010 se arrancó por primera vez una bacteria con un genoma fabricado en el laboratorio. Seguía necesitando una célula ya existente para funcionar.',
       fic:'El Primogénito es ficción. Lo que aprendí con él no: crear es fácil; lo difícil es cuidar lo creado.' },
  P:[
   {k:'b',t:'Algo despertó',d:'Tu criatura rompió el tanque de cultivo.',sc:'Organismo sintético · crece rápido',w:'anti2,cool1',h:'nrg2,bio1',hp:360,T:60,dps:1.6},
   o('cel',{cel:'bact',q:['adn','pla','par','mem','rib','fla'],t:'Su anatomía',d:'Se parece a una bacteria. Repasa sus seis partes.',T:70}),
   o('epi',{map:['....#....','.X.....#.','....#....','##.###.##','....#....'],per:1,save:25,sol:'11,20,3',t:'Sellar la cubierta',d:'Una protección por turno. Busca los pasos estrechos.',T:110}),
   {k:'m',id:'NAG',t:'Su pared, sin ayudas',d:'N-acetilglucosamina sin plano ni fórmula.',T:400},
   {k:'b',mut:10,t:'El Primogénito muta',d:'Cambia de debilidad cada 10 s.',sc:'Mutación rápida',w:'med2,gen1',h:'bio1',hp:360,T:60,dps:1.6,ph2:{d:'Estrena pared',w:'anti2,oxi1',h:'nrg1'}},
   o('ord',{rule:'De lo simple a lo complejo',items:['Átomo','Molécula','Orgánulo','Célula','Tejido','Órgano','Organismo','Ecosistema'],t:'Niveles de la vida',d:'Toca en orden.',T:80}),
   o('cls',{rule:'Cada microbio tiene su medicina',cats:['Antibiótico','Antiviral','Antifúngico'],items:[['Neumonía por bacterias',0],['Herpes',1],['Pie de atleta',2],['Tuberculosis',0],['Gripe',1],['Hongo en las uñas',2],['Cólera',0]],t:'La medicina correcta',d:'¿Qué tipo de medicina se usa en cada caso?',T:90}),
   {k:'b',fat:2,t:'Esporas en los ductos',d:'Se adapta el doble de rápido.',sc:'Esporas resistentes',w:'seal2,anti2',h:'solv1',hp:360,T:60,dps:1.6},
   o('epi',{map:['.........','...#.#...','....X....','...#.#...','.........'],per:2,save:36,sol:'13,21,24,40',t:'Última barrera',d:'El foco está en el centro. Dos protecciones por turno.',T:120}),
   {k:'b',boss:1,fat:2,mut:12,t:'EL PRIMOGÉNITO',d:'Tu creación se adapta el doble de rápido y muta cada 12 s. No repitas, mira el escáner y combina.',sc:'Vida sintética · fuera de control',w:'anti2,med2,eco1',h:'nrg1',hp:430,T:90,dps:1.6,ph2:{d:'Cambia su pared',w:'gen2,inm1,cool1',h:'nrg1'}}
  ]}
);
