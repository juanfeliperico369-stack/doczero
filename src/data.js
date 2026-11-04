/* ============================================================
   DOC ELEMENT · DATA  (Temporada 1: NÚCLEO · niveles 1–10)
   Todo el contenido del juego vive aquí. El motor lo valida en DE.test.selfTest().
   ============================================================ */
'use strict';
const CFG = {
  VERSION: '1.0.0',
  EDITION: 'free',          // 'free' = con anuncios · 'pro' = sin anuncios (3 USD en tiendas)
  DONATE_URL: '',           // Página Oficial → donaciones (vacío = "próximamente")
  CHANNEL_URL: '',          // canal multiplataforma con los videos de cada nivel
  SAVE_KEY: 'docelement.v1',
  MAX_ENERGY: 999,
  STUDIO: 'One Zero', PUBLISHER: 'Infinite Tree'
};

/* ---------- Tabla periódica: símbolo nombre masa (Z = posición) ---------- */
const ELEM_RAW = 'H Hidrógeno 1.008|He Helio 4.0026|Li Litio 6.94|Be Berilio 9.0122|B Boro 10.81|C Carbono 12.011|N Nitrógeno 14.007|O Oxígeno 15.999|F Flúor 18.998|Ne Neón 20.18|Na Sodio 22.99|Mg Magnesio 24.305|Al Aluminio 26.982|Si Silicio 28.085|P Fósforo 30.974|S Azufre 32.06|Cl Cloro 35.45|Ar Argón 39.948|K Potasio 39.098|Ca Calcio 40.078|Sc Escandio 44.956|Ti Titanio 47.867|V Vanadio 50.942|Cr Cromo 51.996|Mn Manganeso 54.938|Fe Hierro 55.845|Co Cobalto 58.933|Ni Níquel 58.693|Cu Cobre 63.546|Zn Zinc 65.38|Ga Galio 69.723|Ge Germanio 72.63|As Arsénico 74.922|Se Selenio 78.971|Br Bromo 79.904|Kr Kriptón 83.798|Rb Rubidio 85.468|Sr Estroncio 87.62|Y Itrio 88.906|Zr Circonio 91.224|Nb Niobio 92.906|Mo Molibdeno 95.95|Tc Tecnecio 98|Ru Rutenio 101.07|Rh Rodio 102.91|Pd Paladio 106.42|Ag Plata 107.87|Cd Cadmio 112.41|In Indio 114.82|Sn Estaño 118.71|Sb Antimonio 121.76|Te Telurio 127.6|I Yodo 126.9|Xe Xenón 131.29|Cs Cesio 132.91|Ba Bario 137.33|La Lantano 138.91|Ce Cerio 140.12|Pr Praseodimio 140.91|Nd Neodimio 144.24|Pm Prometio 145|Sm Samario 150.36|Eu Europio 151.96|Gd Gadolinio 157.25|Tb Terbio 158.93|Dy Disprosio 162.5|Ho Holmio 164.93|Er Erbio 167.26|Tm Tulio 168.93|Yb Iterbio 173.05|Lu Lutecio 174.97|Hf Hafnio 178.49|Ta Tantalio 180.95|W Wolframio 183.84|Re Renio 186.21|Os Osmio 190.23|Ir Iridio 192.22|Pt Platino 195.08|Au Oro 196.97|Hg Mercurio 200.59|Tl Talio 204.38|Pb Plomo 207.2|Bi Bismuto 208.98|Po Polonio 209|At Astato 210|Rn Radón 222|Fr Francio 223|Ra Radio 226|Ac Actinio 227|Th Torio 232.04|Pa Protactinio 231.04|U Uranio 238.03|Np Neptunio 237|Pu Plutonio 244|Am Americio 243|Cm Curio 247|Bk Berkelio 247|Cf Californio 251|Es Einstenio 252|Fm Fermio 257|Md Mendelevio 258|No Nobelio 259|Lr Lawrencio 262|Rf Rutherfordio 267|Db Dubnio 268|Sg Seaborgio 269|Bh Bohrio 270|Hs Hasio 269|Mt Meitnerio 278|Ds Darmstatio 281|Rg Roentgenio 282|Cn Copernicio 285|Nh Nihonio 286|Fl Flerovio 289|Mc Moscovio 290|Lv Livermorio 293|Ts Teneso 294|Og Oganesón 294';

/* Valencias usadas en el laboratorio (suma de órdenes de enlace permitida por átomo) */
const VALENCE = { H:[1],He:[0],Li:[1],Be:[2],B:[3],C:[4],N:[3],O:[2],F:[1],Ne:[0],Na:[1],Mg:[2],Al:[3],Si:[4],P:[3,5],S:[2,4,6],Cl:[1],Ar:[0],K:[1],Ca:[2],Ti:[4],Cr:[3],Mn:[2],Fe:[2,3],Co:[2,3],Ni:[2],Cu:[1,2],Zn:[2],Br:[1],Kr:[0],Ru:[2,3,4],Ag:[1],Sn:[2,4],I:[1],Xe:[0],Pt:[2,4],Au:[1,3],Hg:[1,2],Pb:[2,4],U:[4,6],Rn:[0],Og:[0] };
/* Electronegatividad de Pauling (tipo de enlace: ΔEN > 1,7 = iónico) */
const EN = { H:2.2,Li:.98,Be:1.57,B:2.04,C:2.55,N:3.04,O:3.44,F:3.98,Na:.93,Mg:1.31,Al:1.61,Si:1.9,P:2.19,S:2.58,Cl:3.16,K:.82,Ca:1,Ti:1.54,Cr:1.66,Mn:1.55,Fe:1.83,Co:1.88,Ni:1.91,Cu:1.9,Zn:1.65,Br:2.96,Ru:2.2,Ag:1.93,Sn:1.96,I:2.66,Pt:2.28,Au:2.54,Hg:2,Pb:2.33,U:1.38 };

/* Etiquetas de propiedades (cartas de batalla) */
const TAGS = {
  acid:['Ácido','pH↓'], base:['Base','pH↑'], oxi:['Oxidante','⊕'], fuel:['Combustible','♨'], inert:['Inerte','◎'],
  cool:['Refrigerante','❄'], solv:['Polar / hidrata','≈'], org:['Disolvente orgánico','⌬'], struct:['Estructural','⬢'],
  seal:['Sellante / aislante','▣'], cond:['Conductor','ϟ'], bio:['Biológico','✚'], anti:['Antiséptico','✕'],
  rad:['Radiactivo','☢'], shield:['Blindaje','⛨'], salt:['Electrolito','±'], nrg:['Energía','✦'], med:['Fármaco','℞']
};
/* Elementos como cartas (los diatómicos se usan como molécula) */
const ELTAGS = { He:'inert2,cool1',Li:'cond1,nrg1',Be:'struct2',B:'struct1',C:'fuel1,struct1',Ne:'inert2',Na:'fuel1,cond1',Mg:'fuel2,struct1',Al:'struct2,cond2',Si:'struct1,cond1',P:'fuel2',S:'anti1,fuel1',Ar:'inert3',Ca:'struct1,bio1',Fe:'struct3,cond1',Cu:'cond3,anti1',Ru:'struct2,cond1',Au:'cond2,inert2',Pb:'shield3,struct1',U:'rad3,nrg3',Ubh:'nrg3,shield3,struct3' };

/* ---------- Compuestos reales ----------
   [id, fórmula, nombre, SMILES (alternativas separadas por espacio), etiquetas, descripción, banderas]
   SMILES propio: átomos B C N O P S F Cl Br I con H implícitos; [X] o [XHn] sin H implícitos.
   Bandera M = monómero (tiene C=C y se puede polimerizar). S2 = adelanto de la temporada 2. */
const COMPOUNDS = [
 ['H2','H2','Hidrógeno molecular','[H][H]','fuel3','El combustible más ligero del universo: el hidrógeno forma el 74 % de la materia visible.'],
 ['O2','O2','Oxígeno molecular','O=O','oxi3,bio1','Doble enlace O=O. Sin él no hay fuego ni respiración aeróbica.'],
 ['H2O','H2O','Agua','O','solv3,cool2,shield1','Molécula polar en ángulo de 104,5°. Disuelve más sustancias que cualquier otro líquido y frena neutrones.'],
 ['H2O2','H2O2','Peróxido de hidrógeno','OO','anti3,oxi2','Agua oxigenada: libera oxígeno activo que rompe las paredes de los microbios.'],
 ['N2','N2','Nitrógeno molecular','N#N','inert2,cool2','Triple enlace, uno de los más fuertes de la química. 78 % del aire; líquido a −196 °C.'],
 ['NH3','NH3','Amoníaco','N','base3,cool1','Base débil. El proceso Haber-Bosch lo fabrica con el aire y alimenta como fertilizante a media humanidad.'],
 ['CO2','CO2','Dióxido de carbono','O=C=O','inert2,cool1','Apaga fuegos desplazando el oxígeno. Sólido a −78 °C: hielo seco.'],
 ['CH4','CH4','Metano','C','fuel3','Gas natural. En Titán, la luna de Saturno, llueve metano.'],
 ['LiOH','LiOH','Hidróxido de litio','[Li]O','base3','Absorbió el CO₂ que casi asfixia a la tripulación del Apolo 13 (1970).'],
 ['LiH','LiH','Hidruro de litio','[Li][H]','fuel2,shield2','Sólido que guarda hidrógeno; blindaje de neutrones en reactores espaciales.'],
 ['N2H4','N2H4','Hidracina','NN','fuel3,nrg2','Combustible de satélites y sondas: se descompone sola sobre un catalizador.'],
 ['H2CO3','H2CO3','Ácido carbónico','OC(=O)O','acid1','Nace al disolver CO₂ en agua: la acidez burbujeante de los refrescos.'],
 ['C2H6','C2H6','Etano','CC','fuel3','Dos carbonos con enlace simple; segundo componente del gas natural.'],
 ['C2H4','C2H4','Etileno','C=C','fuel2','Hormona vegetal que madura las frutas y el monómero más usado del mundo.','M'],
 ['C2H2','C2H2','Acetileno','C#C','fuel3,nrg1','Con oxígeno, su llama supera los 3000 °C: soldadura y corte de metales.'],
 ['C3H8','C3H8','Propano','CCC','fuel3','Gas de cocina embotellado.'],
 ['C4H10','C4H10','Butano','CCCC','fuel3','El gas de los encendedores.'],
 ['CH3OH','CH4O','Metanol','CO','fuel2,solv1','Alcohol de madera. Tóxico: puede causar ceguera. Combustible de autos de carrera.'],
 ['C2H5OH','C2H6O','Etanol','CCO','anti2,solv2,fuel1','Al 70 % desnaturaliza las proteínas de bacterias y virus. También es la droga recreativa más consumida del planeta.'],
 ['CH2O','CH2O','Formaldehído','C=O','anti2','Conserva tejidos biológicos; es tóxico y cancerígeno.'],
 ['HCOOH','CH2O2','Ácido fórmico','OC=O','acid2','El ardor de la picadura de hormiga.'],
 ['CH3COOH','C2H4O2','Ácido acético','CC(=O)O','acid2,anti1','El vinagre es ácido acético al 5 %.'],
 ['C3H6O','C3H6O','Acetona','CC(=O)C','org3,solv1','Disolvente de esmaltes y pinturas; tu cuerpo la produce cuando ayunas.'],
 ['C6H6','C6H6','Benceno','C1=CC=CC=C1','org3,fuel2','Anillo aromático. Kekulé contó que soñó su forma: una serpiente mordiéndose la cola, como el emblema de esta nave.'],
 ['HCl','HCl','Ácido clorhídrico','Cl','acid3','Tu estómago lo produce a pH 1–2 para digerir.'],
 ['NaOH','NaOH','Hidróxido de sodio','[Na]O','base3','Soda cáustica: jabones y destapacaños.'],
 ['NaCl','NaCl','Cloruro de sodio','[Na]Cl','salt3','Sal común. Enlace iónico: el sodio cede un electrón al cloro.'],
 ['NaHCO3','NaHCO3','Bicarbonato de sodio','[Na]OC(=O)O','base2,salt1,inert1','Neutraliza ácidos con suavidad y es el polvo de muchos extintores.'],
 ['Cl2','Cl2','Cloro molecular','ClCl','anti3,oxi2','Gas verde amarillento. En dosis mínimas potabiliza el agua; puro es un arma química.'],
 ['NaClO','NaClO','Hipoclorito de sodio','[Na]OCl','anti3,oxi2','La lejía o “cloro” de casa.'],
 ['MgO','MgO','Óxido de magnesio','[Mg]=O','struct2,base1','Resiste 2800 °C: recubre el interior de los hornos.'],
 ['MgOH2','Mg(OH)2','Hidróxido de magnesio','O[Mg]O','base2,med1','Leche de magnesia: antiácido suave.'],
 ['MgCl2','MgCl2','Cloruro de magnesio','Cl[Mg]Cl','salt2','Del agua de mar se extrae el magnesio metálico.'],
 ['CHCl3','CHCl3','Cloroformo','ClC(Cl)Cl','org2,med1','Anestésico del siglo XIX, abandonado por su toxicidad para el hígado.'],
 ['SiO2','SiO2','Dióxido de silicio','O=[Si]=O','struct3,seal1','Cuarzo, arena y vidrio. (En el sólido real cada Si se une a 4 O en red).'],
 ['SiH4','SiH4','Silano','[SiH4]','fuel2','Se inflama solo al contacto con el aire.'],
 ['H2S','H2S','Sulfuro de hidrógeno','S','acid1','Olor a huevo podrido; tóxico a partir de 100 ppm.'],
 ['SO2','SO2','Dióxido de azufre','O=S=O','anti2,acid1','Conserva vinos y frutas secas; los volcanes lo expulsan a toneladas.'],
 ['H2SO4','H2SO4','Ácido sulfúrico','OS(=O)(=O)O','acid3','El químico industrial más producido del mundo. Las nubes de Venus están hechas de él.'],
 ['H3PO4','H3PO4','Ácido fosfórico','OP(=O)(O)O','acid2,bio1','Da acidez a las bebidas de cola; base de los fertilizantes.'],
 ['PH3','PH3','Fosfina','P','fuel2','Su posible detección en Venus (2020) desató un debate sobre vida extraterrestre.'],
 ['CaO','CaO','Óxido de calcio','[Ca]=O','base2,struct1','Cal viva: con agua libera tanto calor que puede hervirla.'],
 ['CaOH2','Ca(OH)2','Hidróxido de calcio','O[Ca]O','base2,struct1','Cal apagada: morteros romanos y corrección de lagos ácidos.'],
 ['CaCO3','CaCO3','Carbonato de calcio','[Ca]1OC(=O)O1','struct2,base1,med1','Conchas, tiza, mármol y pastillas antiácidas.'],
 ['CaCl2','CaCl2','Cloruro de calcio','Cl[Ca]Cl','salt2','Derrite el hielo de las carreteras al bajar el punto de fusión.'],
 ['Fe2O3','Fe2O3','Óxido de hierro (III)','O=[Fe]O[Fe]=O','struct1,oxi1','La herrumbre. Marte es rojo por él.'],
 ['FeO','FeO','Óxido de hierro (II)','[Fe]=O','struct1','Wüstita: abunda en el manto terrestre.'],
 ['Fe3O4','Fe3O4','Magnetita','O=[Fe]O[Fe]O[Fe]=O','struct1,cond1','Imán natural; algunas bacterias y aves la usan como brújula.'],
 ['FeS','FeS','Sulfuro de hierro (II)','[Fe]=S','struct1','Troilita: mineral común en los meteoritos.'],
 ['FeCl3','FeCl3','Cloruro férrico','Cl[Fe](Cl)Cl','acid1,anti1','Graba placas de circuitos y limpia agua turbia.'],
 ['CuO','CuO','Óxido de cobre (II)','[Cu]=O','cond1','Polvo negro que tiñe vidrios y cerámicas de verde y azul.'],
 ['CuSO4','CuSO4','Sulfato de cobre (II)','[Cu]1OS(=O)(=O)O1','anti3','Cristales azules; fungicida y alguicida.'],
 ['Al2O3','Al2O3','Óxido de aluminio','O=[Al]O[Al]=O','struct3,seal1','Corindón: zafiro y rubí. Una capa invisible de él protege al aluminio.'],
 ['C3H6','C3H6','Propileno','C=CC','fuel2','Monómero del polipropileno.','M'],
 ['C2H3Cl','C2H3Cl','Cloruro de vinilo','C=CCl','','Monómero del PVC. Cancerígeno: se maneja en sistemas cerrados.','M'],
 ['C8H8','C8H8','Estireno','C=CC1=CC=CC=C1','org1','Un vinilo unido a un anillo de benceno; da el poliestireno.','M'],
 ['C2F4','C2F4','Tetrafluoroetileno','FC(F)=C(F)F','','En 1938 Roy Plunkett abrió un cilindro de este gas y halló un polvo resbaloso: el teflón.','M'],
 ['C3H3N','C3H3N','Acrilonitrilo','C=CC#N','','Vinilo con grupo nitrilo (C≡N). Base de fibras acrílicas.','M'],
 ['C4H6','C4H6','1,3-Butadieno','C=CC=C','fuel2','Dos dobles enlaces conjugados; materia prima del caucho sintético.','M'],
 ['C5H8','C5H8','Isopreno','C=CC(=C)C','fuel1','Los árboles lo emiten a toneladas; es la unidad del caucho natural.','M'],
 ['HF','HF','Ácido fluorhídrico','F','acid3','Disuelve el vidrio y atraviesa la piel hasta el hueso.'],
 ['SF6','SF6','Hexafluoruro de azufre','FS(F)(F)(F)(F)F','inert3,seal2','Aísla equipos de alta tensión; gas de efecto invernadero 23 500 veces más potente que el CO₂.'],
 ['CCl2F2','CCl2F2','Diclorodifluorometano','FC(F)(Cl)Cl','cool3','Freón-12: refrigerante que dañó la capa de ozono; prohibido por el Protocolo de Montreal (1987).'],
 ['NaF','NaF','Fluoruro de sodio','[Na]F','med1,anti1','Fortalece el esmalte dental.'],
 ['UREA','CH4N2O','Urea','NC(=O)N','bio2','Wöhler la sintetizó en 1828: la primera molécula orgánica creada en laboratorio desde materia inorgánica.'],
 ['GLY','C2H5NO2','Glicina','NCC(=O)O','bio3','El aminoácido más simple; la sonda Rosetta lo detectó en el cometa 67P.'],
 ['ALA','C3H7NO2','Alanina','CC(N)C(=O)O','bio3','Aminoácido abundante en la seda y en tus músculos.'],
 ['GLU','C6H12O6','Glucosa','OCC(O)C(O)C(O)C(O)C=O OCC1OC(O)C(O)C(O)C1O','bio3,nrg2','Combustible de tus células: C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + energía.'],
 ['LAC','C3H6O3','Ácido láctico','CC(O)C(=O)O','acid1,bio1','Tus músculos lo producen cuando trabajan con poco oxígeno.'],
 ['GLYC','C3H8O3','Glicerol','OCC(O)CO','solv2,bio1','El esqueleto de todas las grasas y aceites.'],
 ['CYS','C3H7NO2S','Cisteína','NC(CS)C(=O)O','bio2,anti1','Sus átomos de azufre forman los puentes que dan forma al cabello.'],
 ['ADE','C5H5N5','Adenina','NC1=NC=NC2=C1N=CN2','bio3','La letra “A” del ADN; se ha encontrado en meteoritos.'],
 ['ASP','C9H8O4','Ácido acetilsalicílico','CC(=O)OC1=CC=CC=C1C(=O)O','med3,bio1','La aspirina: Hoffmann la sintetizó en 1897 a partir de una molécula de la corteza del sauce.'],
 ['CAF','C8H10N4O2','Cafeína','CN1C=NC2=C1C(=O)N(C)C(=O)N2C','nrg2,med1','El estimulante más consumido del mundo: bloquea los receptores de adenosina que te dan sueño.','S2'],
 ['PARA','C8H9NO2','Paracetamol','CC(=O)NC1=CC=C(O)C=C1','med3','Analgésico y antifebril. Una sobredosis daña el hígado: la dosis hace al veneno.','S2'],
 ['UO2','UO2','Dióxido de uranio','O=[U]=O','rad3,nrg3','Pastillas de combustible nuclear: un gramo de uranio rinde lo que una tonelada de carbón.']
];

/* ---------- Polímeros: [id, monómeros (ids unidos por +, orden alfabético), nombre, etiquetas, descripción] ---------- */
const POLYMERS = [
 ['PE','C2H4','Polietileno','seal3,struct1,shield1','El plástico más común: bolsas y botellas. También blinda contra neutrones.'],
 ['PP','C3H6','Polipropileno','struct2,seal2','Resiste el calor: envases de microondas, cuerdas y alfombras.'],
 ['PVC','C2H3Cl','Policloruro de vinilo','seal3,struct2','Tuberías, cables y tarjetas.'],
 ['PS','C8H8','Poliestireno','seal2,cool1','Expandido es el icopor o telgopor: 98 % aire, gran aislante térmico.'],
 ['PTFE','C2F4','Teflón (PTFE)','seal3,inert3','Casi nada se le pega ni lo ataca: resiste ácidos hirvientes.'],
 ['PAN','C3H3N','Poliacrilonitrilo','struct3','Precursor de la fibra de carbono: más resistente que el acero y mucho más ligera.'],
 ['PBD','C4H6','Polibutadieno','seal2,struct1','Caucho de llantas y núcleo de las pelotas de golf.'],
 ['PIP','C5H8','Poliisopreno (caucho natural)','seal3','El látex del árbol del caucho.'],
 ['SBR','C4H6+C8H8','Caucho estireno-butadieno','seal3,struct2','Copolímero: el caucho sintético de casi todas las llantas.'],
 ['ABS','C3H3N+C4H6+C8H8','Plástico ABS','struct3,seal1','Copolímero de tres monómeros: el plástico de los bloques de construcción de juguete.']
];

/* Energías de enlace nuclear reales (MeV) para núcleos clave; el resto usa la fórmula semiempírica */
const BE_REAL = {'1-2':2.224,'1-3':8.482,'2-3':7.718,'2-4':28.296,'3-6':31.994,'3-7':39.245,'4-9':58.165,'6-12':92.162,'7-14':104.659,'8-16':127.619,'9-19':147.801,'10-20':160.645,'11-23':186.564,'12-24':198.257,'13-27':224.952,'14-28':236.537,'15-31':262.917,'16-32':271.781,'17-35':298.21,'18-36':306.716,'20-40':342.052,'26-56':492.254,'28-56':483.988,'29-63':551.384,'79-197':1559.4,'82-208':1636.43,'92-238':1801.69};

/* ---------- Historia ---------- */
const STORY = {
  intro: [
    ['TRANSMISIÓN 00','Tu planeta natal murió hace millones de años, a millones de años luz de aquí.'],
    ['CRIOGENIA','Por alguna razón la cápsula se abrió. Creciste dormido: tu cuerpo es adulto y tu mente, una esponja.'],
    ['OUROBOROS','La nave se llama Ouroboros: una nave alquimista. Tiene un laboratorio químico, una forja nuclear y un terminal conectado a una red que aún no entiendes.'],
    ['ÉTER','La inteligencia de la nave te habla: «Aprendes a leer más rápido que cualquier humano registrado. Bien. Lo vas a necesitar».'],
    ['EL PRIMER ERROR','Juntaste hidrógeno y oxígeno sin saber qué eran. La cámara contuvo la explosión. Del humo cayeron gotas: agua.'],
    ['TU SIGUIENTE PASO','ÉTER: «Hazlo de nuevo. Esta vez entendiendo por qué. Si aprendes a crear la materia, quizá aprendas a vencer al tiempo».']
  ],
  ending: [
    ['ELEMENTO 126','La forja se apaga. En la cámara flota un núcleo que no debería existir… y no se desintegra.'],
    ['ETERNIO','ÉTER: «Isla de estabilidad confirmada. Lo llamaré como tú quieras… pero yo diría Eternio».'],
    ['TEMPORADA 2','Ya dominas los núcleos. Ahora toca la mente y el cuerpo: medicinas, drogas y las moléculas que los cambian. Niveles 11–20.']
  ]
};

/* ---------- Niveles ----------
   k: m = sintetizar molécula · p = polímero · f = forja nuclear · b = batalla
   T: segundos · w/h: debilidades / lo que la cura (etiqueta+peso) · hx: compuestos que la empeoran
   r (forja): receta núcleo+núcleo(+k n = flujo de neutrones) · ph2: segunda fase del jefe */
const LEVELS = [
{ n:1, t:'DESPERTAR', s:'Hidrógeno, oxígeno y la primera explosión', gift:['H','O'],
  tx:{ teo:'Todo empezó con el hidrógeno: un protón y un electrón. Los átomos se unen compartiendo electrones; cada uno tiene un número de “manos”, su valencia. El hidrógeno tiene una; el oxígeno, dos.',
       dato:'Cada gota de agua que bebes tiene hidrógeno nacido en el Big Bang, hace 13 800 millones de años.',
       fic:'Desperté en la Ouroboros sin saber leer. Mi primer experimento fue una explosión. ÉTER dice que así empiezan todos los universos.' },
  P:[
   {k:'m',id:'H2',t:'Primer enlace',d:'ÉTER: «Tus manos aún tiemblan. Toca H en la bandeja dos veces: los átomos se unirán solos. Luego pulsa SINTETIZAR».',T:120},
   {k:'m',id:'O2',t:'Aire para respirar',d:'El oxígeno tiene dos manos (valencia 2). Une dos oxígenos y toca el enlace para volverlo doble.',T:120},
   {k:'m',id:'H2O',t:'La explosión controlada',d:'La primera vez juntaste hidrógeno y oxígeno y la cámara contuvo la explosión: 2H₂ + O₂ → 2H₂O. Hazlo de nuevo, entendiendo por qué.',T:120},
   {k:'f',z:1,a:2,t:'Deuterio',d:'Abre la FORJA. Un protón y un neutrón, unidos por la fuerza nuclear fuerte, forman deuterio: hidrógeno pesado.',r:'p+n',T:120},
   {k:'b',t:'Sed del invernadero',d:'Las plantas de la bodega 3 se marchitan. La humedad cayó al 4 %.',sc:'Humedad 4 % · tierra agrietada · hojas sin agua',w:'solv3',h:'',hp:70,T:40,dps:1.2},
   {k:'f',z:2,a:4,t:'Helio: el gas del Sol',d:'En el núcleo del Sol el hidrógeno se fusiona en helio. Une dos deuterios en la forja.',r:'D+D',T:120},
   {k:'b',t:'Fuego en el ducto',d:'Una chispa encendió una fuga de hidrógeno. La llama es casi invisible.',sc:'Llama de 2000 °C · combustible H₂ · alimentada por O₂',w:'inert3,cool1',h:'oxi2,fuel2',hp:90,T:40,dps:1.2},
   {k:'m',id:'H2O2',t:'Agua oxigenada',d:'Dos oxígenos enlazados y un hidrógeno en cada extremo: H–O–O–H. Nace un desinfectante.',T:120},
   {k:'b',t:'Moho en los filtros',d:'Esporas grises cubren los filtros del soporte vital.',sc:'Hongos · humedad alta · se alimentan de materia orgánica',w:'anti3,oxi1',h:'solv1,bio1',hp:110,T:40,dps:1.2},
   {k:'b',boss:1,t:'Fuga del reactor de plasma',d:'El reactor de fusión pierde contención: el plasma se derrama por el pasillo.',sc:'Plasma a un millón de grados · campo magnético inestable',w:'cool2,inert2',h:'fuel2,oxi1',hp:260,T:60,dps:1.5,ph2:{d:'El plasma se condensa en vapor sobrecalentado',w:'cool3',h:'fuel1'}}
  ]},
{ n:2, t:'AIRE', s:'Litio, carbono y nitrógeno', gift:[],
  tx:{ teo:'Las estrellas fabrican elementos fusionando núcleos. Tres helios forman carbono (proceso triple alfa). El número de protones (Z) define el elemento; la masa (A) suma protones y neutrones.',
       dato:'En 1970 el Apolo 13 sobrevivió gracias a filtros de hidróxido de litio armados con cinta y cartón.',
       fic:'ÉTER me enseñó a respirar dentro de una nave: el aire también hay que fabricarlo.' },
  P:[
   {k:'f',z:3,t:'Litio',d:'El metal más ligero. Combina helio-4, deuterio y un neutrón: 2 + 1 + 0 = 3 protones.',r:'He4+D+n',T:120},
   {k:'f',z:6,t:'Proceso triple alfa',d:'Tres núcleos de helio-4 chocan casi a la vez y nace el carbono-12. Así se forjó el carbono de tu cuerpo.',r:'He4+He4+He4',T:120},
   {k:'f',z:7,t:'Nitrógeno',d:'Carbono-12 más deuterio: 6 + 1 = 7 protones.',r:'C12+D',T:120},
   {k:'m',id:'N2',t:'Triple enlace',d:'El nitrógeno tiene tres manos. Une dos y toca el enlace hasta volverlo triple: N≡N.',T:120},
   {k:'m',id:'CO2',t:'Aliento de la nave',d:'Un carbono, dos oxígenos y dos dobles enlaces: O=C=O.',T:120},
   {k:'b',t:'Aire viciado',d:'Los purificadores fallan. El CO₂ de la cabina sube al 5 % y te duele la cabeza.',sc:'CO₂ al 5 % · gas de carácter ácido · el Apolo 13 vivió esto',w:'base3',h:'',hp:130,T:45,dps:1.3},
   {k:'m',id:'NH3',t:'Amoníaco',d:'Un nitrógeno con tres hidrógenos: la base que alimenta los cultivos.',T:120},
   {k:'m',id:'CH4',t:'Metano',d:'Un carbono y cuatro hidrógenos. Prueba el botón ⚡H: completa los hidrógenos que faltan.',T:120},
   {k:'b',t:'Congelación del casco',d:'La nave cruza la sombra de un planeta errante: −150 °C en el casco.',sc:'−150 °C · el metal se vuelve frágil · necesitas calor',w:'fuel3',h:'cool3',hp:150,T:45,dps:1.3},
   {k:'b',boss:1,t:'Incendio en los cultivos',d:'Las lámparas de cultivo encendieron la paja seca. El fuego se come el oxígeno de la nave.',sc:'Fuego clase A · 900 °C · consume O₂',w:'inert3,cool1',h:'oxi3,fuel2',hp:320,T:60,dps:1.6,ph2:{d:'Brasas: el fuego se esconde bajo la ceniza',w:'cool3,solv1',h:'oxi2'}}
  ]},
{ n:3, t:'CARBONO', s:'Cuatro manos para construir la vida', gift:[],
  tx:{ teo:'El carbono tiene cuatro enlaces: forma cadenas, ramas y anillos. Enlaces simples (alcanos), dobles (alquenos) y triples (alquinos) cambian la forma y la energía de la molécula.',
       dato:'Hay más compuestos de carbono conocidos que de todos los demás elementos juntos: más de 100 millones.',
       fic:'Soñé con una serpiente que se mordía la cola. Al despertar dibujé un anillo de seis carbonos. ÉTER se rió: «Kekulé soñó lo mismo».' },
  P:[
   {k:'m',id:'C2H6',t:'Etano',d:'Dos carbonos con enlace simple. Usa ⚡H para completar los hidrógenos.',T:110},
   {k:'m',id:'C2H4',t:'Etileno',d:'Doble enlace entre carbonos: la hormona que madura las frutas.',T:110},
   {k:'m',id:'C2H2',t:'Acetileno',d:'Triple enlace C≡C. Su llama corta metal.',T:110},
   {k:'f',z:10,t:'Luces de neón',d:'Carbono-12 más dos helio-4: el neón que iluminará los pasillos.',r:'C12+He4+He4',T:110},
   {k:'m',id:'C2H5OH',t:'Etanol',d:'Agrega un grupo –OH al etano: un alcohol.',T:110},
   {k:'b',t:'Bacterias en el agua',d:'El tanque de agua potable huele mal: flotan colonias de bacterias.',sc:'Bacterias · 10⁸ por mL · se alimentan de nutrientes',w:'anti3',h:'bio2',hp:170,T:45,dps:1.4},
   {k:'m',id:'CH3COOH',t:'Vinagre',d:'Grupo carboxilo –COOH: un carbono con un =O y un –OH.',T:110},
   {k:'m',id:'C6H6',t:'El sueño de Kekulé',d:'Seis carbonos en anillo con enlaces simples y dobles alternados. Cierra el anillo uniendo el último con el primero.',T:150},
   {k:'b',t:'Grasa en los motores',d:'Los rotores están cubiertos de grasa espesa; el agua resbala sin limpiar.',sc:'Grasa apolar · insoluble en agua',w:'org3',h:'',hx:'H2O',hp:190,T:45,dps:1.4},
   {k:'b',boss:1,t:'La Mancha',d:'Una biopelícula viscosa crece en los conductos y bloquea el aire.',sc:'Biopelícula · capa grasa protectora · bacterias dentro',w:'org2,anti1',h:'bio2,solv1',hp:380,T:60,dps:1.7,ph2:{d:'Sin la grasa, las bacterias quedan expuestas',w:'anti3',h:'bio2'}}
  ]},
{ n:4, t:'SAL Y ÁCIDO', s:'Neutralizar es sobrevivir', gift:[],
  tx:{ teo:'Un ácido libera iones H⁺; una base los atrapa. Al juntarse se neutralizan y forman sal y agua: HCl + NaOH → NaCl + H₂O. La escala de pH va de 0 (muy ácido) a 14 (muy básico).',
       dato:'El sodio puro explota en agua, el cloro puro es venenoso… y juntos son la sal de tu comida.',
       fic:'Derramé ácido sobre la consola. ÉTER no se inmutó: «Ahora aprenderás a neutralizar».' },
  P:[
   {k:'f',z:11,t:'Sodio',d:'Neón-20 + deuterio + neutrón: 10 + 1 + 0 = 11 protones, masa 23. Un metal tan reactivo que arde en agua.',r:'Ne20+D+n',T:110},
   {k:'f',z:12,t:'Quema de carbono',d:'En estrellas masivas dos carbonos se fusionan en magnesio-24.',r:'C12+C12',T:110},
   {k:'f',z:17,t:'Cloro',d:'Neón + nitrógeno + un neutrón: 17 protones, masa 35. Usa el FLUJO DE NEUTRONES (+n).',r:'Ne20+N14+1n',T:120},
   {k:'m',id:'HCl',t:'Ácido clorhídrico',d:'Un hidrógeno y un cloro: el ácido de tu estómago.',T:100},
   {k:'m',id:'NaOH',t:'Soda cáustica',d:'Sodio, oxígeno e hidrógeno en cadena: Na–O–H.',T:100},
   {k:'b',t:'Derrame de ácido',d:'Un bidón de ácido clorhídrico se rompió en la bodega de carga.',sc:'pH 0,5 · líquido corrosivo · vapores',w:'base3',h:'acid2',hp:210,T:45,dps:1.5},
   {k:'m',id:'NaCl',t:'Ácido + base = sal',d:'HCl + NaOH → NaCl + H₂O. Une sodio y cloro: un enlace iónico.',T:100},
   {k:'b',t:'Calambres',d:'Sudaste horas en la forja y tus músculos se contraen sin control.',sc:'Electrolitos bajos · faltan iones Na⁺ y Cl⁻',w:'salt3,solv1',h:'',hp:220,T:45,dps:1.5},
   {k:'m',id:'NaClO',t:'Lejía',d:'Sodio, oxígeno y cloro en cadena: Na–O–Cl.',T:100},
   {k:'b',boss:1,t:'Floración de algas tóxicas',d:'El tanque de reciclaje se volvió verde: las algas liberan toxinas.',sc:'Cianobacterias · fotosíntesis activa · toxinas',w:'anti3,oxi1',h:'bio2,salt1',hp:440,T:60,dps:1.8,ph2:{d:'Las algas muertas consumen el oxígeno del agua',w:'oxi3',h:'bio1'}}
  ]},
{ n:5, t:'FORJA ESTELAR', s:'La escalera alfa: del magnesio al calcio', gift:[],
  tx:{ teo:'Las estrellas masivas suben una escalera: a cada núcleo le suman un helio-4 (una partícula alfa). Magnesio → silicio → azufre → argón → calcio. Cada peldaño exige más temperatura.',
       dato:'El calcio de tus huesos y el silicio de tu teléfono se forjaron en estrellas que explotaron antes de que existiera el Sol.',
       fic:'La forja vibraba como una estrella pequeña. ÉTER bajó la voz: «No mires la luz directamente».' },
  P:[
   {k:'f',z:14,t:'Silicio',d:'Magnesio-24 + helio-4.',r:'Mg24+He4',T:100},
   {k:'f',z:16,t:'Azufre',d:'Silicio-28 + helio-4.',r:'Si28+He4',T:100},
   {k:'f',z:18,t:'Argón',d:'Azufre-32 + helio-4.',r:'S32+He4',T:100},
   {k:'f',z:20,t:'Calcio',d:'Argón-36 + helio-4: el último peldaño fácil de la escalera.',r:'Ar36+He4',T:100},
   {k:'f',z:15,t:'Fósforo',d:'Silicio-28 + deuterio + neutrón: 14 + 1 = 15 protones, masa 31.',r:'Si28+D+n',T:100},
   {k:'m',id:'SiO2',t:'Vidrio',d:'El silicio tiene cuatro manos: dos dobles enlaces con oxígeno.',T:100},
   {k:'b',t:'Grieta en la cúpula',d:'Un micrometeorito agrietó la cúpula de observación.',sc:'Fisura de 40 cm · pérdida lenta de presión',w:'struct3,seal1',h:'',hp:250,T:45,dps:1.6},
   {k:'m',id:'H2SO4',t:'Ácido sulfúrico',d:'El azufre usa su valencia 6: dos =O y dos –OH.',T:120},
   {k:'b',t:'Lluvia ácida en Tessar-4',d:'Aterrizas en un planeta cuyos lagos murieron por la lluvia ácida.',sc:'pH 4,2 · sulfatos · peces muertos',w:'base3',h:'acid2',hp:270,T:45,dps:1.6},
   {k:'b',boss:1,t:'Incendio de magnesio',d:'Virutas de magnesio de la forja se encendieron: 3000 °C de luz blanca.',sc:'Fuego clase D · reacciona con agua, CO₂ y N₂',w:'inert2,salt2,struct1',h:'solv2,oxi2',hx:'CO2,N2,H2O',hp:500,T:60,dps:1.9,ph2:{d:'El metal fundido se esparce por el suelo',w:'struct2,inert2',h:'solv2',hx:'CO2,N2,H2O'}}
  ]},
{ n:6, t:'HIERRO', s:'El final de la estrella', gift:[],
  tx:{ teo:'El hierro-56 tiene uno de los núcleos más estables. Fusionar hasta él libera energía; ir más allá la consume. Por eso las estrellas mueren cuando su núcleo se llena de hierro.',
       dato:'El níquel-56 que forman las estrellas decae en cobalto-56 y luego en hierro-56: el hierro de tu sangre vino de una supernova.',
       fic:'ÉTER apagó la forja por primera vez. «Hasta aquí llega una estrella. Lo que sigue, lo pagarás tú».' },
  P:[
   {k:'f',z:26,t:'El final de la estrella',d:'Calcio + carbono + helio = níquel-56, que decae en cobalto y luego en hierro-56.',r:'Ca40+C12+He4',T:110},
   {k:'f',z:29,t:'Cobre',d:'Hierro-56 + litio-7.',r:'Fe56+Li7',T:110},
   {k:'f',z:13,t:'Aluminio',d:'Magnesio-24 + deuterio + neutrón: 12 + 1 = 13 protones, masa 27.',r:'Mg24+D+n',T:110},
   {k:'m',id:'Fe2O3',t:'El color de Marte',d:'Dos hierros con valencia 3 y tres oxígenos: O=Fe–O–Fe=O.',T:110},
   {k:'b',t:'Cable fundido',d:'Un cortocircuito fundió el cable principal del puente de mando.',sc:'Circuito abierto · 0 amperios · falta un conductor',w:'cond3',h:'solv1',hp:300,T:45,dps:1.7},
   {k:'m',id:'Al2O3',t:'Zafiro',d:'Dos aluminios (valencia 3) y tres oxígenos.',T:110},
   {k:'m',id:'Fe3O4',t:'Brújula natural',d:'Tres hierros y cuatro oxígenos: el hierro del centro usa valencia 2 y los extremos, 3.',T:130},
   {k:'b',t:'Corrosión del casco',d:'El casco se oxida tras cruzar una nube de vapor salino.',sc:'Óxido avanzando · sal · humedad',w:'seal2,struct2',h:'salt2,acid1,solv1',hp:320,T:45,dps:1.7},
   {k:'m',id:'CuSO4',t:'Cristales azules',d:'Cobre unido a un grupo sulfato: el cobre cierra un anillo con dos oxígenos del azufre.',T:130},
   {k:'b',boss:1,t:'Biocorrosión del reactor',d:'Bacterias que comen hierro perforan las tuberías del reactor.',sc:'Bacterias reductoras de sulfato · biopelícula sobre metal',w:'anti3',h:'bio2',hp:560,T:60,dps:2.0,ph2:{d:'Las tuberías se debilitan',w:'struct3,seal1',h:'acid2'}}
  ]},
{ n:7, t:'MONÓMEROS', s:'Moléculas con un doble enlace listo para abrirse', gift:[],
  tx:{ teo:'Un monómero es una molécula pequeña con un doble enlace C=C. Ese enlace puede abrirse y unirse a otro monómero, y otro, y otro: así nace un polímero.',
       dato:'El teflón se descubrió por accidente en 1938, cuando un cilindro de gas “vacío” resultó lleno de un polvo blanco resbaloso.',
       fic:'Aprendí a dejar enlaces dobles como promesas: manos que esperan a la siguiente molécula.' },
  P:[
   {k:'f',z:9,t:'Flúor',d:'Carbono-12 + litio-7: el elemento más electronegativo de la tabla.',r:'C12+Li7',T:110},
   {k:'m',id:'C3H6',t:'Propileno',d:'Un doble enlace C=C con un metilo (–CH₃) al lado.',T:110},
   {k:'m',id:'C2H3Cl',t:'Cloruro de vinilo',d:'Etileno con un cloro en lugar de un hidrógeno.',T:110},
   {k:'m',id:'C8H8',t:'Estireno',d:'Un vinilo (CH=CH₂) pegado a un anillo de benceno. Será el poliestireno.',T:160},
   {k:'m',id:'C2F4',t:'Tetrafluoroetileno',d:'C=C con cuatro flúor. El origen del teflón.',T:110},
   {k:'b',t:'Fuga de refrigerante',d:'El circuito de enfriamiento del reactor gotea. La temperatura sube 2 °C por segundo.',sc:'Reactor a 380 °C · subiendo · hay que extraer calor',w:'cool3',h:'fuel1',hp:340,T:45,dps:1.8},
   {k:'m',id:'C4H6',t:'Butadieno',d:'Cuatro carbonos con dos dobles enlaces: C=C–C=C.',T:110},
   {k:'m',id:'C3H3N',t:'Acrilonitrilo',d:'Un vinilo con un grupo nitrilo (C≡N).',T:120},
   {k:'b',t:'Arco eléctrico',d:'Un arco de 10 000 voltios salta en el transformador principal.',sc:'Arco de plasma · alta tensión · aire ionizado',w:'inert2,seal2',h:'cond2,solv2',hp:360,T:45,dps:1.8},
   {k:'b',boss:1,t:'Ácido fluorhídrico',d:'Un tanque de HF se fisura y empieza a disolver las ventanas.',sc:'HF · disuelve el vidrio · atraviesa la piel',w:'base2,struct1',h:'acid2',hx:'SiO2',hp:600,T:60,dps:2.1,ph2:{d:'El HF se evapora en una nube tóxica',w:'base3',h:'acid1'}}
  ]},
{ n:8, t:'POLÍMEROS', s:'Cadenas infinitas', gift:[],
  tx:{ teo:'En la polimerización por adición el doble enlace de cada monómero se abre y se une al siguiente: n estirenos forman [–CH₂–CH(C₆H₅)–]ₙ. Mezclar monómeros distintos crea copolímeros con propiedades nuevas.',
       dato:'Una sola cadena de polietileno puede tener más de 100 000 unidades de etileno.',
       fic:'Tejí la primera cadena y la nave dejó de sangrar aire. ÉTER la llamó “la piel de la Ouroboros”.' },
  P:[
   {k:'p',id:'PE',t:'Polietileno',d:'Tus monómeros ya aparecen como bloques en la bandeja. Une 3 o más etilenos en cadena: [–CH₂–CH₂–]ₙ.',T:110},
   {k:'p',id:'PVC',t:'PVC',d:'Encadena 3 o más cloruros de vinilo.',T:110},
   {k:'p',id:'PS',t:'Poliestireno',d:'Estireno → poliestireno: [–CH₂–CH(C₆H₅)–]ₙ.',T:110},
   {k:'b',t:'Brecha en el casco',d:'Un fragmento perforó el casco y el aire escapa al vacío.',sc:'Agujero de 15 cm · presión cayendo · −270 °C afuera',w:'seal3,struct2',h:'',hp:380,T:45,dps:1.9},
   {k:'p',id:'PTFE',t:'Teflón',d:'Encadena tetrafluoroetileno.',T:110},
   {k:'p',id:'PP',t:'Polipropileno',d:'Encadena propileno.',T:110},
   {k:'b',t:'Ácido en las tuberías',d:'El ácido sulfúrico de la planta de baterías corroe las tuberías metálicas.',sc:'H₂SO₄ al 98 % · ataca metales · no ataca a los fluoropolímeros',w:'seal2,inert2',h:'cond1,acid1',hp:400,T:45,dps:1.9},
   {k:'p',id:'SBR',t:'Caucho sintético',d:'Copolímero: mezcla estireno y butadieno en la misma cadena.',T:120},
   {k:'b',t:'Frío del espacio profundo',d:'El aislamiento térmico de los camarotes se agrietó.',sc:'Pérdida de calor · paredes a −40 °C',w:'seal3',h:'cond2',hp:420,T:45,dps:1.9},
   {k:'b',boss:1,t:'El Devorador',d:'Un enjambre de micrometeoritos golpea la proa; cada impacto abre un cráter.',sc:'10 000 impactos por minuto · 20 km/s',w:'struct3,seal1',h:'',hp:640,T:60,dps:2.2,ph2:{d:'Los cráteres dejan fugas de aire',w:'seal3',h:''}}
  ]},
{ n:9, t:'VIDA', s:'Aminoácidos, azúcares y la primera medicina', gift:[],
  tx:{ teo:'La vida usa pocos elementos —C, H, O, N, P y S— combinados en aminoácidos (proteínas), azúcares (energía) y bases nitrogenadas (ADN). Un fármaco es una molécula que encaja en una proteína y cambia lo que hace.',
       dato:'La sonda Rosetta encontró glicina en un cometa: los ladrillos de la vida viajan por el espacio.',
       fic:'Me corté con una lámina de la forja. Por primera vez la química no era un juego: era mi cuerpo.' },
  P:[
   {k:'m',id:'UREA',t:'Urea',d:'En 1828 Wöhler creó urea en un frasco y derrumbó la idea de que solo los seres vivos fabrican moléculas orgánicas.',T:120},
   {k:'m',id:'GLY',t:'Polvo de cometa',d:'Glicina: un grupo amino (–NH₂), un carbono y un ácido (–COOH).',T:130},
   {k:'m',id:'GLU',t:'Glucosa',d:'Seis carbonos: cinco con –OH y uno con =O. También vale la forma de anillo.',T:200},
   {k:'b',t:'Hambre',d:'Llevas 30 horas sin comer. Tus reservas de glucógeno se agotaron.',sc:'Glucosa en sangre 50 mg/dL · fatiga · temblor',w:'bio2,nrg2',h:'anti1',hp:440,T:45,dps:2.0},
   {k:'m',id:'ALA',t:'Alanina',d:'Como la glicina, pero con un metilo (–CH₃) en el carbono central.',T:140},
   {k:'m',id:'LAC',t:'Ácido láctico',d:'Tus músculos lo producen cuando corren sin oxígeno suficiente.',T:140},
   {k:'b',t:'Infección en la herida',d:'Te cortaste con una lámina de la forja y la herida se inflama.',sc:'Bacterias · pus · enrojecimiento',w:'anti3',h:'bio2',hp:460,T:45,dps:2.0},
   {k:'m',id:'ASP',t:'Aspirina',d:'Un anillo de benceno con dos vecinos: un ácido –COOH y un éster –O–C(=O)–CH₃.',T:240},
   {k:'b',t:'Fiebre',d:'La infección te dejó 39,8 °C de fiebre y dolor de cabeza.',sc:'Prostaglandinas altas · inflamación · 39,8 °C',w:'med3,cool1',h:'',hp:480,T:45,dps:2.0},
   {k:'b',boss:1,t:'La célula se apaga',d:'Tu primera célula sintética se desintegra: le faltan los ladrillos de la vida.',sc:'Membrana rota · sin energía · sin proteínas',w:'bio3,solv1',h:'anti2',hp:700,T:60,dps:2.3,ph2:{d:'La célula necesita energía para dividirse',w:'nrg3,bio1',h:'anti2'}}
  ]},
{ n:10, t:'ETERNIO', s:'La isla de estabilidad', gift:[],
  tx:{ teo:'Más allá del hierro los núcleos se construyen capturando neutrones (procesos s y r, en estrellas gigantes y supernovas). Los físicos predicen una “isla de estabilidad” de superpesados cerca de 114–126 protones y 184 neutrones.',
       dato:'El elemento más pesado creado hasta hoy es el oganesón (118). Sus átomos viven menos de un milisegundo.',
       fic:'ÉTER dejó de corregirme. «Ya no te enseño. Te observo». Esa noche forjé oro… y no sentí nada. Quería el 126.' },
  P:[
   {k:'f',z:44,t:'Rutenio',d:'Más allá del hierro solo se avanza capturando neutrones, como en una supernova: hierro + argón + 10 neutrones.',r:'Fe56+Ar36+10n',T:120},
   {k:'f',z:82,t:'Plomo',d:'Dos rutenios chocan: 88 protones que decaen por β⁺ hasta llegar al plomo.',r:'Ru102+Ru102',T:120},
   {k:'b',t:'Tormenta de rayos gamma',d:'Una estrella cercana colapsa y la radiación gamma golpea la nave.',sc:'Rayos γ · 50 Sv/h · hace falta masa densa',w:'shield3',h:'',hp:500,T:45,dps:2.1},
   {k:'f',z:79,t:'El sueño del alquimista',d:'Los alquimistas soñaron convertir metales en oro. Tú lo forjas núcleo a núcleo: rutenio + cloro + argón + 24 neutrones.',r:'Ru102+Cl35+Ar36+24n',T:140},
   {k:'f',z:92,t:'Uranio',d:'Plomo-204 + neón-20 + 14 neutrones.',r:'Pb204+Ne20+14n',T:130},
   {k:'m',id:'UO2',t:'Combustible nuclear',d:'Uranio con valencia 4 y dos dobles enlaces con oxígeno.',T:110},
   {k:'b',t:'Apagón total',d:'El reactor principal se apagó y las luces de emergencia parpadean.',sc:'0 % de energía · soporte vital en batería',w:'nrg3,rad1',h:'',hp:520,T:45,dps:2.1},
   {k:'f',z:114,det:1,t:'Isla a la vista',d:'Detecta un superpesado: uranio + calcio + helio = 114 protones. Vivirá milisegundos, pero quedará registrado.',r:'U238+Ca40+He4',T:130},
   {k:'b',boss:1,t:'La Entropía',d:'El universo se enfría. ÉTER detecta que la nave pierde orden, molécula a molécula.',sc:'Entropía máxima · todo tiende al desorden',w:'nrg2,shield2,struct1,bio1',h:'',hp:800,T:60,dps:2.4,ph2:{d:'La Entropía ataca la vida misma',w:'bio3,nrg1',h:'anti1'}},
   {k:'f',z:126,isl:1,t:'ETERNIO',d:'Plomo-204 + rutenio-102 + 4 neutrones: 126 protones. Tras evaporar dos neutrones quedan 182: dentro de la isla de estabilidad.',r:'Pb204+Ru102+4n',T:150}
  ]}
];

const GUIDE = [
 ['CÓMO SE JUEGA','Cada nivel tiene 10 problemas en un mapa. Hay cuatro tipos: ⚗ SINTETIZAR una molécula, ⛓ POLIMERIZAR, ☢ FORJAR un núcleo y ☣ BATALLA contra una amenaza. Resuelve los 10 para abrir el siguiente nivel. Si fallas o se acaba el tiempo, vuelves a intentarlo.'],
 ['LABORATORIO','Toca un átomo de la bandeja para crearlo. Si hay un átomo seleccionado, el nuevo se enlaza a él. Toca dos átomos para unirlos. Toca un enlace para cambiarlo: simple → doble → triple → borrar. Arrastra para mover; arrastra el fondo para desplazarte. ⚡H completa los hidrógenos. ⚗ SINTETIZAR identifica lo que construiste.'],
 ['VALENCIA','Cada átomo tiene un número fijo de enlaces: H 1 · O 2 · N 3 · C 4 · Na 1 · Mg 2 · Al 3 · Si 4 · Cl 1 · F 1 · P 3 o 5 · S 2, 4 o 6 · Fe 2 o 3 · Cu 1 o 2. Los puntos alrededor del átomo son las manos libres. Una molécula es estable cuando no queda ninguna.'],
 ['HÍBRIDOS','Si construyes una molécula estable que no está en el catálogo de ÉTER, nace un HÍBRIDO: un compuesto teórico con nombre propio. Sus propiedades se predicen por sus grupos funcionales (–OH, –COOH, aminas, dobles enlaces, halógenos…).'],
 ['FORJA NUCLEAR','Pon hasta 3 núcleos y un flujo de neutrones. Z (protones) y A (masa) se suman. Si el núcleo tiene demasiados protones o neutrones, decae (β⁺ o β⁻) hacia el valle de estabilidad. A = 5 y A = 8 no existen. Desde Z = 104 el núcleo pierde 2 neutrones y solo sobrevive en la isla de estabilidad (Z 114–126, N 176–190).'],
 ['ENERGÍA','Fusionar núcleos ligeros (hasta el hierro) DA energía; más allá la CUESTA. Vencer la repulsión eléctrica (barrera de Coulomb) también cuesta. La energía se recarga sola hasta 100 y con cada problema resuelto.'],
 ['BATALLA','Elige hasta 4 cartas de tus frascos. Cada carta tiene propiedades reales (ácido, base, inerte, conductor…). Lee el escáner de la amenaza y deduce su debilidad. Daño = Σ(propiedad × debilidad) − Σ(propiedad × lo que la alimenta) × 2 × potencia × combo. Acertar seguido sube el combo hasta ×2. La amenaza drena la integridad de la nave cada segundo.'],
 ['ESTRELLAS','Síntesis y forja: ★★★ si usas menos del 40 % del tiempo, ★★ menos del 70 %. Batalla: ★★★ con 70 % de integridad o más, ★★ con 40 %. Puntaje = 100 × estrellas + bonificación por tiempo y combo.'],
 ['CIENCIA REAL','Los compuestos, las reacciones nucleares, las energías de enlace (fórmula semiempírica de Weizsäcker) y los datos curiosos son reales. Simplificaciones honestas: los sólidos iónicos se muestran como una sola unidad (NaCl), no como red cristalina, y el valle de estabilidad es una aproximación.'],
 ['TU PARTIDA','Todo se guarda solo en este dispositivo. Desde Ajustes puedes exportar o importar tu partida como archivo. Sin cuentas y sin internet.']
];
