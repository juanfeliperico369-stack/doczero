/* ============================================================
   DOC ELEMENT · TEMPORADA 3: GENES (niveles 21–30)
   Bases del ADN, ARN, código genético real, proteínas, mutaciones, edición genética (concepto),
   fuerza, resistencia, telómeros y la Quimera (ficción). Educativo: solo conceptos, sin protocolos.
   ============================================================ */
'use strict';
TAGS.gen = ['Genético', '⚭'];
/* código genético estándar (orden TCAG) y nombres de aminoácidos */
const GENE = {
  B: 'TCAG', CODE: 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG',
  AA: { F: 'Fenilalanina', L: 'Leucina', S: 'Serina', Y: 'Tirosina', '*': 'FIN (stop)', C: 'Cisteína', W: 'Triptófano', P: 'Prolina', H: 'Histidina', Q: 'Glutamina', R: 'Arginina', I: 'Isoleucina', M: 'Metionina (inicio)', T: 'Treonina', N: 'Asparagina', K: 'Lisina', V: 'Valina', A: 'Alanina', D: 'Ácido aspártico', E: 'Ácido glutámico', G: 'Glicina' },
  PAIR: { A: 'T', T: 'A', G: 'C', C: 'G' }, RNA: { A: 'U', T: 'A', G: 'C', C: 'G' },
  comp: (s, rna) => s.split('').map(b => (rna ? GENE.RNA : GENE.PAIR)[b]).join(''),
  aa(cod) { const c = cod.replace(/U/g, 'T'); const i = GENE.B.indexOf(c[0]) * 16 + GENE.B.indexOf(c[1]) * 4 + GENE.B.indexOf(c[2]); return GENE.CODE[i]; },
  seq(n, seed) { const r = DE.mulberry(seed); let s = ''; for (let i = 0; i < n; i++) s += 'ATGC'[Math.floor(r() * 4)]; return s; }
};
COMPOUNDS.push(
 ['GUA','C5H5N5O','Guanina','NC1=NC2=C(N=CN2)C(=O)N1','gen3,bio1','La letra G del ADN. Se empareja con la C mediante tres puentes de hidrógeno.'],
 ['CYT','C4H5N3O','Citosina','NC1=NC(=O)NC=C1','gen3,bio1','La letra C: siempre frente a una G.'],
 ['TIM','C5H6N2O2','Timina','CC1=CNC(=O)NC1=O','gen3,bio1','La letra T, exclusiva del ADN. Frente a ella siempre hay una A.'],
 ['URA','C4H4N2O2','Uracilo','O=C1C=CNC(=O)N1','gen2,bio1','La letra U: reemplaza a la timina en el ARN.'],
 ['RIB','C5H10O5','Ribosa','OCC1OC(O)C(O)C1O','gen2,nrg1','El azúcar del ARN: la "R" de ARN.'],
 ['DRIB','C5H10O4','Desoxirribosa','OCC1OC(O)CC1O','gen2,nrg1','La ribosa sin un oxígeno: la "D" de ADN.'],
 ['SER','C3H7NO3','Serina','NC(CO)C(=O)O','bio3','Aminoácido con un –OH; muchas proteínas se activan cuando le ponen un fosfato.'],
 ['VAL','C5H11NO2','Valina','CC(C)C(N)C(=O)O','bio3,nrg1','Aminoácido esencial: tu cuerpo no lo fabrica, viene de la comida.'],
 ['GLUA','C5H9NO4','Ácido glutámico','NC(CCC(=O)O)C(=O)O','bio3,neuro1','Da el sabor "umami". En la anemia falciforme lo reemplaza una valina.'],
 ['LYS','C6H14N2O2','Lisina','NCCCCC(N)C(=O)O','bio3','Aminoácido esencial con una cola larga terminada en amina.'],
 ['DIP','C5H10N2O3','Glicilalanina','NCC(=O)NC(C)C(=O)O','bio3,med1','Dos aminoácidos unidos por un enlace peptídico: el primer eslabón de toda proteína.'],
 ['CREA','C4H9N3O2','Creatina','CN(CC(=O)O)C(=N)N','nrg2,struct1,bio1','Suplemento real y muy estudiado: recarga la energía rápida del músculo. Con agua y dosis normales, es de los más seguros.']
);
REACTIONS.push(['R_PEP','Enlace peptídico','GLY+ALA=DIP+H2O',8,'Dos aminoácidos se unen y sueltan una molécula de agua: así se fabrican todas las proteínas.']);
DIFF.push(
 {g:1,fail:1,ah:4,bal:0,crit:1,rg:.8},{g:1,fail:1,ah:4,bal:0,crit:1,rg:1},{g:1,fail:1,ah:5,bal:0,crit:1,rg:1},{g:1,fail:1,ah:5,bal:0,crit:1,rg:1.2},{g:1,fail:1,ah:5,bal:0,crit:1,rg:1.4},
 {g:0,fail:1,ah:6,bal:0,crit:1,rg:1.5},{g:0,fail:1,ah:6,bal:0,crit:1,rg:1.6},{g:0,fail:1,ah:7,bal:0,crit:1,rg:1.8},{g:0,fail:1,ah:8,bal:0,crit:1,rg:2},{g:0,fail:1,ah:8,bal:0,crit:1,rg:2}
);
STORY.s3i = [
  ['doc','loco','¿Y SI MEJORO EL CUERPO?','Curé la mente. Ahora quiero más: fuerza, resistencia, juventud. ¡Quiero ser un superhéroe!'],
  ['eter','enojado','EL MANUAL DE LA VIDA','Todo cuerpo sigue un manual escrito con solo cuatro letras: A, T, G y C. Es el ADN.'],
  ['eter','neutral','ÉTICA DE LABORATORIO','Aquí aprenderás cómo se lee y se corrige ese manual, solo como idea. En el mundo real, editar genes humanos tiene reglas estrictas.'],
  ['doc','sorpresa','TEMPORADA 3: GENES','Bases, ARN, proteínas, mutaciones… y algo que crece en la bodega y copia todo lo que hago.']
];
STORY.s3e = [
  ['eter','feliz','QUIMERA DETENIDA','El organismo dejó de copiar. Sus genes quedaron en silencio.'],
  ['doc','feliz','EL MANUAL','No me convertí en superhéroe. Aprendí algo mejor: leer y respetar el manual de la vida.'],
  ['eter','sorpresa','TEMPORADA 4','Ahora quieres crear organismos enteros. Niveles 31–40… la vida no es un juguete, Doc.']
];
const g = (mode, o) => Object.assign({ k: 'g', mode }, o);
LEVELS.push(
{ n:21, t:'ADN', s:'Cuatro letras para escribir la vida', gift:[],
  talk:[['eter','neutral','El ADN es una escalera de caracol. Cada peldaño une dos letras: la A con la T, la G con la C. Nunca al revés.'],['doc','feliz','¡Como darse la mano, pero con letras!']],
  tx:{ teo:'El ADN tiene dos hebras enrolladas en doble hélice. Cada base se une a su pareja: adenina con timina (A–T) y guanina con citosina (G–C). Así, si conoces una hebra, conoces la otra.',
       dato:'Si estiraras el ADN de una sola de tus células, mediría unos 2 metros.',
       fic:'Leí mi propio ADN en el escáner de la Ouroboros. Tres mil millones de letras. ÉTER: «Empieza por seis».' },
  P:[
   {k:'m',id:'ADE',t:'Adenina',d:'La letra A: dos anillos fusionados llenos de nitrógeno.',T:320},
   {k:'m',id:'TIM',t:'Timina',d:'La letra T: un anillo con dos =O y un metilo.',T:280},
   g('pair',{seq:'ATTAGC',t:'A con T',d:'Cada A se une con una T y cada G con una C. Toca la letra que completa cada peldaño.',T:60}),
   {k:'m',id:'GUA',t:'Guanina',d:'La letra G: como la adenina, pero con un =O.',T:340},
   {k:'m',id:'CYT',t:'Citosina',d:'La letra C: un solo anillo con una amina y un =O.',T:280},
   g('pair',{n:10,t:'La escalera doble',d:'Completa la hebra que falta.',T:70}),
   {k:'b',t:'Rayos UV en la cúpula',d:'La luz ultravioleta rompe peldaños del ADN de la tripulación.',sc:'UV-C · bases dañadas',w:'shield2,gen1',h:'rad1',hp:300,T:60,dps:1.5},
   {k:'m',id:'DRIB',t:'Desoxirribosa',d:'Un anillo de cinco con un oxígeno; le falta un –OH.',T:280},
   g('pair',{n:14,t:'Replicación',d:'Así copia una célula su ADN antes de dividirse.',T:80}),
   {k:'b',boss:1,t:'ADN roto',d:'Una tormenta solar partió el ADN de un durmiente.',sc:'Hebras partidas · bases sueltas',w:'gen3,bio1',h:'rad2',hp:420,T:90,dps:1.6,ph2:{d:'Faltan piezas para reparar',w:'gen2,med1',h:'rad1'}}
  ]},
{ n:22, t:'ARN', s:'El mensajero', gift:[],
  talk:[['eter','neutral','El ADN no sale del núcleo. Manda copias: el ARN. Mismo código, pero con U en lugar de T.'],['doc','sorpresa','¿Una fotocopia con una letra cambiada?'],['eter','feliz','Exacto.']],
  tx:{ teo:'La transcripción copia un gen del ADN a ARN mensajero. Las parejas cambian un poco: frente a una A del ADN se pone U (uracilo). El ARN lleva el mensaje hasta los ribosomas.',
       dato:'Las vacunas de ARN mensajero (2020) dan a tus células una copia del mensaje para fabricar una proteína del virus y entrenar al sistema inmune.',
       fic:'Un virus de ARN escapó de una muestra congelada. ÉTER cerró la bodega. Yo abrí el manual.' },
  P:[
   {k:'m',id:'URA',t:'Uracilo',d:'La letra U del ARN: un anillo con dos =O.',T:260},
   {k:'m',id:'RIB',t:'Ribosa',d:'Un anillo de cinco con un oxígeno, tres –OH y una cadena –CH₂OH.',T:300},
   g('rna',{n:8,t:'Transcripción',d:'Copia el ADN a ARN: A→U, T→A, G→C, C→G.',T:60}),
   {k:'b',t:'Virus de ARN',d:'El virus se multiplica en el aire reciclado.',sc:'Virus · se copia sin control',w:'anti2,gen1',h:'bio2',hp:300,T:60,dps:1.5},
   g('rna',{n:12,t:'ARN mensajero',d:'Un gen más largo.',T:70}),
   {k:'s',n:5,mix:['ADE','GUA','CYT','TIM','URA'],t:'Separar las bases',d:'Las cinco letras de la vida, mezcladas.',T:150},
   g('rna',{n:16,t:'Mensaje largo',d:'Sin errores: un ARN equivocado fabrica una proteína equivocada.',T:80}),
   {k:'b',t:'Fiebre viral',d:'El virus dejó fiebre a dos durmientes.',sc:'39,5 °C · cuerpo luchando',w:'med2,cool2',h:'nrg1',hp:300,T:60,dps:1.5},
   {k:'m',id:'H3PO4',t:'El fosfato del esqueleto',d:'Los fosfatos unen los azúcares del ADN y del ARN como una columna.',T:160},
   {k:'b',boss:1,t:'Ribozima rebelde',d:'Un ARN que corta a otros ARN se descontroló.',sc:'ARN que se corta solo',w:'gen2,anti2',h:'bio1',hp:420,T:90,dps:1.6,ph2:{d:'Se copia más rápido',w:'gen3',h:'bio1'}}
  ]},
{ n:23, t:'CÓDIGO', s:'Tres letras, una palabra', gift:[],
  talk:[['eter','neutral','El ribosoma lee el ARN de tres en tres. Cada trío (codón) es un aminoácido. AUG significa "empieza".'],['doc','loco','¡Un idioma de tres letras!']],
  tx:{ teo:'El código genético es casi igual en todos los seres vivos: 64 codones que significan 20 aminoácidos y tres señales de FIN. Leer el ARN de tres en tres y unir los aminoácidos es la traducción.',
       dato:'El código genético se descifró entre 1961 y 1966. El primer codón leído fue UUU: fenilalanina.',
       fic:'Traduje mi primer gen a mano. Era corto: metionina, glicina, fenilalanina, fin. ÉTER: «Acabas de leer la vida».' },
  P:[
   g('trad',{mrna:'AUGGGCUUUUAA',t:'Hola, proteína',d:'Elige el aminoácido de cada codón (usa la tabla). Termina con FIN.',T:70}),
   {k:'m',id:'SER',t:'Serina',d:'El aminoácido con un –CH₂OH.',T:260},
   g('trad',{mrna:'AUGAAAUGGUAG',t:'Cuatro palabras',d:'Otro mensaje corto.',T:70}),
   {k:'m',id:'VAL',t:'Valina',d:'Aminoácido con una ramita de dos metilos.',T:280},
   {k:'b',t:'Mensaje corrupto',d:'Una radiación alteró los mensajes de las células.',sc:'Proteínas defectuosas',w:'gen2,bio1',h:'anti1',hp:320,T:60,dps:1.5},
   g('trad',{mrna:'AUGGCUUCUGUUGGCUAA',t:'Frase química',d:'Seis codones.',T:90}),
   {k:'m',id:'GLUA',t:'Ácido glutámico',d:'Aminoácido con dos ácidos: el del umami.',T:300},
   g('pair',{n:16,t:'Copia de seguridad',d:'Guarda una copia del gen antes de traducir.',T:80}),
   {k:'b',t:'Proteína mal plegada',d:'Una fiebre muy alta desarma las proteínas.',sc:'Proteínas deformadas · 41 °C',w:'bio2,med1,cool1',h:'fuel1',hp:320,T:60,dps:1.5},
   {k:'b',boss:1,t:'El ribosoma loco',d:'Una fábrica de proteínas lee todo al revés.',sc:'Proteínas sin sentido',w:'gen2,bio2',h:'anti1',hp:440,T:90,dps:1.6,ph2:{d:'Se queda sin piezas',w:'bio3',h:'anti1'}}
  ]},
{ n:24, t:'PROTEÍNAS', s:'Cadenas que trabajan', gift:[],
  talk:[['doc','feliz','¿Para qué sirven los aminoácidos?'],['eter','neutral','Encadenados forman proteínas: músculos, enzimas, hormonas como la insulina. Primero aprende a unir dos.']],
  tx:{ teo:'Dos aminoácidos se unen por un enlace peptídico y sueltan agua. Una proteína es una cadena de cientos de ellos que se pliega en una forma exacta; esa forma decide su trabajo.',
       dato:'En 1978 se fabricó insulina humana con bacterias modificadas: fue el primer medicamento de ingeniería genética.',
       fic:'Uní glicina con alanina y el reactor soltó una gota de agua. ÉTER: «Así empieza cada músculo que tienes».' },
  P:[
   {k:'r',id:'R_PEP',t:'Enlace peptídico',d:'Glicina + alanina → dipéptido + agua.',T:150},
   {k:'m',id:'DIP',t:'Dipéptido',d:'Glicina y alanina unidas por un –CO–NH–.',T:320},
   {k:'m',id:'LYS',t:'Lisina',d:'Aminoácido con una cola de cuatro carbonos y una amina al final.',T:320},
   g('trad',{mrna:'UUUGUUAAUCAACACCUUUGUGGU',t:'Insulina',d:'Los primeros ocho aminoácidos de la cadena B de la insulina humana.',T:110}),
   {k:'b',t:'Diabetes tipo 1',d:'Un durmiente no fabrica insulina.',sc:'Glucosa alta · sin insulina',w:'med2,bio2',h:'nrg1',hx:'GLU',hp:330,T:60,dps:1.5},
   {k:'s',n:6,mix:['GLY','ALA','SER','VAL','LYS','GLUA'],t:'Electroforesis',d:'Separa los aminoácidos según su carga.',T:170},
   g('trad',{mrna:'AUGGUGCACCUGACUCCUGAGGAG',t:'Hemoglobina',d:'El inicio de la beta-globina, la proteína que lleva el oxígeno.',T:110}),
   {k:'b',t:'Desnutrición proteica',d:'Meses de comida de nave sin proteínas.',sc:'Músculo perdido · edemas',w:'bio3,nrg1',h:'anti1',hp:330,T:60,dps:1.5},
   g('pair',{n:18,t:'Gen completo',d:'Una hebra larga.',T:90}),
   {k:'b',boss:1,t:'Proteína zombi',d:'Un prión: una proteína mal plegada que deforma a las demás.',sc:'Plegamiento contagioso',w:'anti2,med2',h:'bio2',hp:440,T:90,dps:1.6,ph2:{d:'Forma placas',w:'rad2,anti1',h:'bio1'}}
  ]},
{ n:25, t:'MUTACIONES', s:'Una letra puede cambiarlo todo', gift:[],
  talk:[['eter','triste','En la anemia falciforme, una sola letra cambia: GAG por GTG. La hemoglobina se deforma.'],['doc','sorpresa','¿Una letra entre miles?'],['eter','neutral','Una. Vamos a encontrarla.']],
  tx:{ teo:'Una mutación es un cambio en las letras del ADN. Muchas no hacen nada, otras causan enfermedades y unas pocas dan ventajas. La radiación y algunas sustancias las provocan.',
       dato:'La anemia falciforme cambia un ácido glutámico por una valina en la posición 6 de la beta-globina. Llevar una sola copia protege contra la malaria.',
       fic:'Comparé el gen de un durmiente con el gen sano, letra por letra. Ahí estaba: una T donde debía haber una A.' },
  P:[
   g('fix',{ref:'ATGGTGCACCTGACTCCTGAGGAG',pat:'ATGGTGCACCTGACTCCTGTGGAG',t:'Anemia falciforme',d:'Compara el gen del paciente con el sano. Toca la letra distinta y elige la correcta.',T:90}),
   {k:'b',t:'Radiación cósmica',d:'Partículas de alta energía atraviesan la nave.',sc:'Rayos cósmicos · mutaciones nuevas',w:'shield3,gen1',h:'rad2',hp:340,T:60,dps:1.5},
   g('trad',{mrna:'AUGGUGCACCUGACUCCUGUGGAG',t:'Una letra, una enfermedad',d:'Traduce el gen mutado y mira qué aminoácido cambió.',T:110}),
   {k:'s',n:6,mix:['ADE','GUA','CYT','TIM','URA','DRIB'],t:'Secuenciador',d:'Separa las piezas del ADN para leerlo.',T:170},
   g('fix',{ref:'ATGAGTAAAGGAGAAGAACTTTTC',pat:'ATGAGTAAAGGAGTAGAACTCTTC',t:'Proteína verde fluorescente',d:'Dos errores en el gen que hace brillar a las medusas.',T:110}),
   {k:'b',t:'Mutágeno químico',d:'Un derrame de un compuesto que daña el ADN.',sc:'Sustancia mutágena en el aire',w:'antid2,gen1',h:'oxi1',hp:270,T:60,dps:1.5},
   {k:'m',id:'GUA',t:'Guanina experta',d:'La letra G, sin plano ni fórmula.',T:340},
   g('pair',{n:20,t:'Corrector de errores',d:'Las células corrigen su ADN copiándolo de la hebra buena.',T:95}),
   {k:'b',t:'Tumor por mutación',d:'Una célula acumuló demasiados errores.',sc:'División sin control',w:'rad2,med2,gen1',h:'bio2',hp:350,T:60,dps:1.6},
   {k:'b',boss:1,t:'Mutación en cadena',d:'Los errores se copian de célula en célula.',sc:'Mutaciones que se multiplican',w:'gen3,shield1',h:'rad2',hp:330,T:90,dps:1.6,ph2:{d:'Llegan al ARN',w:'gen2,anti1',h:'rad1'}}
  ]},
{ n:26, t:'EDICIÓN GENÉTICA', s:'Tijeras moleculares', gift:[],
  talk:[['eter','neutral','CRISPR es como un buscar y reemplazar para el ADN: una guía de ARN encuentra el sitio y unas tijeras cortan.'],['doc','loco','¡Corrector ortográfico de la vida!'],['eter','enojado','Que funcione no significa que todo deba hacerse.']],
  tx:{ teo:'La edición genética usa una guía de ARN para encontrar una secuencia exacta y una proteína (Cas9) que corta allí. La célula repara el corte, y se puede aprovechar para cambiar letras. Ya se usa para tratar algunas enfermedades de la sangre.',
       dato:'Jennifer Doudna y Emmanuelle Charpentier ganaron el Nobel de Química 2020 por las tijeras CRISPR-Cas9, que las bacterias usan para defenderse de los virus.',
       fic:'Un virus empezó a reescribir los genes de los durmientes. Le gané con su propia arma: buscar y reemplazar.' },
  P:[
   g('fix',{ref:'ATGAGTAAAGGAGAAGAACTTTTCACT',pat:'ATGAGTAAAGCAGAAGAACTTTTGACT',t:'Tijeras moleculares',d:'Encuentra y corrige los dos errores.',T:110}),
   {k:'b',t:'Virus reescritor',d:'Un virus que cambia letras del ADN.',sc:'Ediciones no autorizadas',w:'anti2,gen2',h:'bio1',hp:350,T:60,dps:1.6},
   g('fix',{ref:'ATGGCCAAGTTGACCAGTGCC',pat:'ATGGCGAAGTTTACCAGTGCA',t:'Edición múltiple',d:'Tres letras equivocadas.',T:130}),
   {k:'m',id:'DRIB',t:'Desoxirribosa experta',d:'Sin plano ni fórmula.',T:300},
   g('rna',{n:18,t:'Guía de ARN',d:'Escribe la guía que llevará las tijeras al sitio.',T:90}),
   {k:'s',n:7,mix:['ADE','GUA','CYT','TIM','URA','RIB','DRIB'],t:'Purificar la guía',d:'La guía debe ir pura o cortará donde no debe.',T:190},
   {k:'b',t:'Corte fuera del blanco',d:'Las tijeras cortaron en el sitio equivocado.',sc:'Daño colateral en el genoma',w:'gen2,med1',h:'anti1',hp:290,T:60,dps:1.6},
   g('pair',{n:22,t:'Reparación por plantilla',d:'La célula copia la plantilla correcta.',T:100}),
   {k:'b',t:'Rechazo inmune',d:'El cuerpo ataca a las células editadas.',sc:'Inflamación · fiebre',w:'med2,cool1',h:'bio1',hp:300,T:60,dps:1.6},
   {k:'b',boss:1,fat:2,t:'El virus que edita',d:'Aprende de cada ataque: lo que repites pierde fuerza el doble de rápido.',sc:'Virus adaptativo · se edita a sí mismo',w:'gen2,anti3',h:'bio2',hp:460,T:90,dps:1.6,ph2:{d:'Reescribe su envoltura',w:'gen3',h:'bio1'}}
  ]},
{ n:27, t:'FUERZA', s:'El sueño del superhéroe', gift:[],
  talk:[['doc','loco','¡Quiero músculos de acero!'],['eter','enojado','Las vacas azules belgas tienen un gen de la miostatina roto y son puro músculo. En humanos no se hace: estúdialo, no lo copies.']],
  tx:{ teo:'La miostatina es una proteína que frena el crecimiento del músculo. Algunos animales nacen con el gen roto y desarrollan músculos enormes. La creatina, en cambio, solo recarga la energía rápida del músculo.',
       dato:'La raza de vacas azul belga y algunos perros whippet tienen mutaciones naturales en el gen de la miostatina.',
       fic:'Me inyecté mi propio suero de fuerza. Funcionó demasiado bien… y mis músculos dejaron de obedecerme.' },
  P:[
   {k:'m',id:'CREA',t:'Creatina',d:'Un glicina con un metilo y un grupo guanidino (C con =NH y –NH₂).',T:300},
   {k:'b',t:'Atrofia muscular',d:'Meses en gravedad cero derriten los músculos.',sc:'Pérdida de masa muscular',w:'bio2,nrg2,struct1',h:'anti1',hp:360,T:60,dps:1.6},
   g('fix',{ref:'ATGCAAAAACTGCAACTC',pat:'ATGCAAAAACTGCAACTC',tgt:'ATGCAAAAACTGTAACTC',t:'Gen de la miostatina',d:'Simulación: cambia el codón 5 por FIN (TAA) para apagar el freno del músculo, como en las vacas azules belgas.',T:90}),
   g('trad',{mrna:'AUGCAAAAACUGCAACUC',t:'Leer la miostatina',d:'Los primeros seis aminoácidos de la miostatina.',T:90}),
   {k:'b',t:'Calambre extremo',d:'Entrenaste sin beber agua.',sc:'Sales perdidas · músculo contraído',w:'salt2,solv2',h:'acid1',hp:360,T:60,dps:1.6},
   {k:'s',n:7,mix:['CREA','GLY','ALA','VAL','LYS','SER','GLUA'],t:'Batido de proteínas',d:'Separa los ingredientes del batido.',T:190},
   g('fix',{ref:'ATGGGCCTGAAAGAAGAG',pat:'ATGGGCCTCAAAGAAGCG',t:'Fibra rápida',d:'Corrige el gen de una fibra muscular.',T:110}),
   {k:'b',t:'Desgarro',d:'El músculo cedió en la forja.',sc:'Fibras rotas · inflamación',w:'med2,struct2',h:'acid1',hp:370,T:60,dps:1.6},
   {k:'m',id:'LYS',t:'Lisina experta',d:'Sin plano ni fórmula.',T:320},
   {k:'b',boss:1,t:'Doc musculoso',d:'Tu suero de fuerza se volvió en tu contra: los músculos no paran de contraerse.',sc:'Músculo descontrolado · corazón forzado',w:'med2,bio2,salt1',h:'nrg2',hx:'CREA',hp:310,T:90,dps:1.6,ph2:{d:'El sistema nervioso se satura',w:'neuro1,med2',h:'nrg2'}}
  ]},
{ n:28, t:'RESISTENCIA', s:'Más oxígeno, más riesgo', gift:[],
  talk:[['eter','neutral','La eritropoyetina (EPO) ordena fabricar glóbulos rojos. Más glóbulos, más oxígeno… y sangre más espesa.'],['doc','sorpresa','¿Por eso es dopaje?'],['eter','feliz','Y por eso es peligroso.']],
  tx:{ teo:'El riñón libera EPO cuando falta oxígeno, y la médula fabrica más glóbulos rojos. En la altura el cuerpo lo hace solo. Usarla como dopaje espesa la sangre y aumenta el riesgo de trombos e infartos.',
       dato:'Los habitantes de los Andes y del Tíbet tienen adaptaciones genéticas distintas para vivir con menos oxígeno.',
       fic:'Quise correr más rápido que la Quimera. ÉTER me recordó que un corazón no se puede reemplazar como un motor.' },
  P:[
   g('trad',{mrna:'AUGGGGGUGCACGAAUGUCCUGCCUGG',t:'Eritropoyetina',d:'El inicio de la EPO (simplificado).',T:120}),
   {k:'b',t:'Hipoxia en la montaña',d:'Aterrizas en un planeta de aire muy fino.',sc:'Oxígeno bajo · mareo',w:'oxi2,nrg1',h:'cool1',hp:300,T:60,dps:1.6},
   g('fix',{ref:'ATGGGGGTGCACGAATGT',pat:'ATGGGTGTGCACGAACGT',t:'Gen del atleta',d:'Corrige el gen (simplificado).',T:110}),
   {k:'b',t:'Sangre espesa',d:'Un pasajero se dopó con EPO.',sc:'Demasiados glóbulos rojos · riesgo de trombos',w:'solv2,med2',h:'nrg1',hp:340,T:60,dps:1.6},
   g('rna',{n:20,t:'Mensajero del riñón',d:'Transcribe el gen.',T:95}),
   {k:'s',n:7,mix:['O2','CO2','H2O','GLU','LAC','NaCl','KCL'],t:'Sangre artificial',d:'Separa los componentes de una sangre sintética.',T:190},
   {k:'m',id:'LAC',t:'Ácido láctico',d:'Lo que tus músculos fabrican cuando les falta oxígeno.',T:220},
   {k:'b',t:'Fatiga láctica',d:'Tus piernas arden después de correr.',sc:'Ácido láctico · pH bajo en el músculo',w:'base2,bio1,solv1',h:'acid2',hp:310,T:60,dps:1.6},
   g('pair',{n:24,t:'Maratón de bases',d:'La hebra más larga hasta ahora.',T:110}),
   {k:'b',boss:1,t:'Corazón al límite',d:'El entrenamiento extremo pone tu corazón en zona roja.',sc:'200 latidos por minuto',w:'med2,oxi2,salt1',h:'nrg2',hx:'CAF',hp:340,T:90,dps:1.6,ph2:{d:'Arritmia',w:'neuro2,med1',h:'nrg2'}}
  ]},
{ n:29, t:'TELÓMEROS', s:'El reloj de la vida', gift:[],
  talk:[['doc','loco','El Eternio no me hizo eterno. ¿Y si alargo mis telómeros?'],['eter','triste','Las células que no envejecen tienen un nombre poco amable: tumor. El tiempo también protege.']],
  tx:{ teo:'Los telómeros son la repetición TTAGGG en la punta de cada cromosoma. Se acortan en cada división, como un reloj. La telomerasa los alarga; está activa en células madre… y en muchos cánceres.',
       dato:'Elizabeth Blackburn, Carol Greider y Jack Szostak ganaron el Nobel de Medicina 2009 por descubrir cómo funcionan los telómeros y la telomerasa.',
       fic:'Alargué los telómeros de un ratón de laboratorio. Vivió más… y ÉTER encontró tres tumores. Cerré el frasco.' },
  P:[
   g('pair',{seq:'TTAGGGTTAGGGTTAGGG',t:'Telómeros: TTAGGG',d:'La secuencia que protege la punta de los cromosomas.',T:90}),
   {k:'b',t:'Envejecimiento acelerado',d:'Un durmiente envejece diez años en un mes.',sc:'Telómeros cortos · células cansadas',w:'gen2,med1,bio1',h:'oxi1',hp:310,T:60,dps:1.6},
   g('fix',{ref:'GGCGGCAGCGGC',pat:'GGCGGTAGCGGC',t:'Progeria',d:'Una letra causa el envejecimiento prematuro (simplificado).',T:90}),
   {k:'m',id:'VITC',t:'Antioxidante',d:'Vitamina C, sin plano ni fórmula.',T:340},
   {k:'b',t:'Radicales libres',d:'Moléculas con manos libres atacan las células.',sc:'Oxidación · daño celular',w:'anti2,bio1,med1',h:'oxi2',hp:370,T:60,dps:1.6},
   g('rna',{seq:'TTAGGGTTAGGGTTAGGGTTAGGG',t:'La telomerasa',d:'Copia la repetición a su ARN molde.',T:110}),
   {k:'s',n:8,mix:['ADE','GUA','CYT','TIM','URA','RIB','DRIB','H3PO4'],t:'Reloj biológico',d:'Ocho piezas del ADN y del ARN.',T:210},
   {k:'b',t:'Células cansadas',d:'Los tejidos ya no se renuevan.',sc:'Divisiones agotadas',w:'gen2,nrg2',h:'anti1',hp:350,T:60,dps:1.6},
   g('trad',{mrna:'AUGGCUGCUAAAGAAUUUCAAUAA',t:'Proteína de la juventud',d:'Ficción: una proteína imaginaria. Tradúcela.',T:120}),
   {k:'b',boss:1,t:'El Tiempo',d:'No es un enemigo que se pueda vencer del todo.',sc:'Entropía biológica',w:'gen2,med2,shield1',h:'rad1',hp:340,T:90,dps:1.6,ph2:{d:'El reloj se acelera',w:'gen3,bio1',h:'rad1'}}
  ]},
{ n:30, t:'LA QUIMERA', s:'Un organismo que copia todo', gift:[],
  talk:[['eter','enojado','En la bodega creció un organismo con genes de varias especies: una quimera. Copia lo que le lanzas.'],['doc','sorpresa','Entonces no puedo repetirme.'],['eter','neutral','Varía, combina e inventa.']],
  tx:{ teo:'Una quimera tiene células con ADN de distintos orígenes. En la naturaleza existen (algunos humanos tienen células de un gemelo perdido). La Quimera de la Ouroboros es ficción.',
       dato:'Las bacterias intercambian genes entre sí (transferencia horizontal): así se esparce la resistencia a los antibióticos.',
       fic:'La Quimera aprendía cada ataque. La vencí cuando dejé de repetirme. ÉTER dijo que eso también es evolución.' },
  P:[
   {k:'b',t:'Primer contacto',d:'Algo se mueve entre los tubos de la bodega.',sc:'Organismo desconocido · ADN mezclado',w:'anti2,gen1',h:'bio2',hp:380,T:60,dps:1.6},
   g('fix',{ref:'ATGTGGAAAGGCTTCCTGGAA',pat:'ATGTGCAAAGGATTCCTGGTA',t:'ADN quimérico',d:'Tres letras ajenas en su gen.',T:130}),
   g('trad',{mrna:'AUGUGGUGGUGGUAA',t:'Su firma',d:'¿Qué escribe su gen?',T:80}),
   {k:'b',t:'La Quimera se divide',d:'Ahora son dos.',sc:'División rápida',w:'anti3,med1',h:'bio2',hp:380,T:60,dps:1.6},
   {k:'m',id:'DIP',t:'Péptido señuelo',d:'Glicilalanina sin ayudas.',T:320},
   {k:'s',n:8,mix:['ADE','GUA','CYT','TIM','URA','GLY','ALA','DIP'],t:'Aislar su ADN',d:'Ocho sustancias y poco espacio.',T:210},
   g('pair',{n:24,t:'Copiar su código',d:'Necesitas una copia para estudiarla.',T:110}),
   {k:'b',fat:2,t:'Mutación adaptativa',d:'Se adapta el doble de rápido.',sc:'Resistencia acelerada',w:'gen2,anti2',h:'bio1',hp:390,T:60,dps:1.6},
   g('rna',{n:24,t:'Silenciar su ARN',d:'Una copia exacta para bloquear su mensaje.',T:110}),
   {k:'b',boss:1,fat:2,t:'LA QUIMERA',d:'Copia lo que lanzas: la resistencia crece el doble de rápido. Varía, combina, inventa.',sc:'Organismo adaptativo · genes de muchas especies',w:'gen2,anti2,med1',h:'bio2',hp:400,T:90,dps:1.6,ph2:{d:'Muta su ADN para resistir',w:'rad2,gen2',h:'bio1'}}
  ]}
);
