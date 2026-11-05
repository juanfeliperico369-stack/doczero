/* ============================================================
   DOC ELEMENT · TEMPORADA 2: FÁRMACOS (niveles 11–20)
   Medicinas reales, drogas legales (alcohol, cafeína, nicotina, teobromina), neurotransmisores,
   antídotos, polímeros médicos y medicina nuclear. Las drogas ilegales NO se construyen: aparecen
   como amenazas con información real general; la "Nebulina" es ficción.
   Información educativa, no consejo médico.
   ============================================================ */
'use strict';
TAGS.neuro = ['Neuroactivo', 'ψ'];
TAGS.antid = ['Antídoto', '⚕'];
Object.assign(ELTAGS, { K: 'salt1,cond1', Zn: 'struct1,cond1', Tc: 'rad2', Co: 'rad2,struct1' });
/* propiedades nuevas para compuestos de la temporada 1 */
(function () {
  const set = (id, tags, flags) => { const r = COMPOUNDS.find(c => c[0] === id); if (r) { r[4] = tags; if (flags != null) r[6] = flags; } };
  set('C2H5OH', 'anti2,solv2,fuel1,antid2,neuro1');
  set('CAF', 'neuro2,nrg2', ''); set('PARA', 'med3,cool1', '');
  set('Li2CO3', 'base1,med2,neuro1'); set('CYS', 'bio2,anti1');
})();
COMPOUNDS.push(
 ['SALI','C7H6O3','Ácido salicílico','OC(=O)C1=CC=CC=C1O','med2,anti1,acid1','De la corteza del sauce: hace 2400 años Hipócrates ya recetaba su infusión para el dolor.'],
 ['AC2O','C4H6O3','Anhídrido acético','CC(=O)OC(C)=O','acid1','Dos ácidos acéticos unidos sin su agua: el reactivo que convierte el ácido salicílico en aspirina.'],
 ['IBU','C13H18O2','Ibuprofeno','CC(C)CC1=CC=C(C=C1)C(C)C(=O)O','med3,cool1','Antiinflamatorio: bloquea la enzima COX que fabrica las prostaglandinas del dolor. En exceso daña el estómago y el riñón.'],
 ['NIC','C10H14N2','Nicotina','CN1CCCC1C2=CN=CC=C2','neuro3,fuel1','Alcaloide del tabaco y una de las sustancias más adictivas que existen. Las plantas la fabrican como insecticida.'],
 ['TEO','C7H8N4O2','Teobromina','CN1C=NC2=C1C(=O)NC(=O)N2C','neuro1,nrg1','El estimulante suave del chocolate. Los perros no la eliminan bien: para ellos es tóxica.'],
 ['TAU','C2H7NO3S','Taurina','NCCS(=O)(=O)O','bio1,nrg1','Se descubrió en la bilis del toro (de ahí su nombre). Está en las bebidas energéticas.'],
 ['ACET','C2H4O','Acetaldehído','CC=O','anti1','El hígado convierte el alcohol en esta molécula tóxica: es la gran culpable de la resaca.'],
 ['NAC','C5H9NO3S','N-acetilcisteína','CC(=O)NC(CS)C(=O)O','antid3,med2,bio1','Antídoto de la sobredosis de paracetamol: repone el glutatión que protege al hígado.'],
 ['ETER','C4H10O','Éter dietílico','CCOCC','med2,org2,fuel2','El 16 de octubre de 1846 Morton operó con éter en Boston: nació la anestesia moderna. Es muy inflamable.'],
 ['BENZ','C9H11NO2','Benzocaína','CCOC(=O)C1=CC=C(N)C=C1','med2','Anestésico local de pomadas y pastillas para la garganta: bloquea los canales de sodio de los nervios.'],
 ['LIDO','C14H22N2O','Lidocaína','CCN(CC)CC(=O)NC1=C(C)C=CC=C1C','med3','El anestésico del dentista. También corrige algunas arritmias del corazón.'],
 ['MENT','C10H20O','Mentol','CC(C)C1CCC(C)CC1O','cool2,med1','Activa el receptor TRPM8 de los nervios: no enfría, pero el cerebro siente frío.'],
 ['DOPA','C8H11NO2','Dopamina','NCCC1=CC(O)=C(O)C=C1','neuro3,bio1','El mensajero de la motivación y la recompensa. Muchas drogas actúan secuestrándolo.'],
 ['SERO','C10H12N2O','Serotonina','NCCC1=CNC2=C1C=C(O)C=C2','neuro3,med1','Regula el ánimo, el sueño y el apetito. El 90 % de la del cuerpo está en el intestino.'],
 ['ADRE','C9H13NO3','Adrenalina','CNCC(O)C1=CC(O)=C(O)C=C1','neuro2,med2,nrg1','Epinefrina: la inyección que salva a una persona en choque anafiláctico.'],
 ['MELA','C13H16N2O2','Melatonina','CC(=O)NCCC1=CNC2=C1C=C(OC)C=C2','neuro2,med1','La glándula pineal la libera de noche: le dice al cuerpo que es hora de dormir.'],
 ['GABA','C4H9NO2','Ácido γ-aminobutírico','NCCCC(=O)O','neuro2,med1','El freno principal del cerebro. El alcohol y los calmantes actúan sobre sus receptores.'],
 ['HIST','C5H9N3','Histamina','NCCC1=CN=CN1','bio1,neuro1','La molécula de la alergia: dilata vasos, da picor y cierra los bronquios.'],
 ['VITC','C6H8O6','Ácido ascórbico','OCC(O)C1OC(=O)C(O)=C1O','bio3,med2,anti1','Vitamina C. Su falta causó el escorbuto que mató a miles de marineros hasta 1747.'],
 ['NIAC','C6H5NO2','Ácido nicotínico','OC(=O)C1=CN=CC=C1','bio2,med1','Vitamina B3. Comparte nombre con la nicotina, pero no es adictiva.'],
 ['METF','C4H11N5','Metformina','CN(C)C(=N)NC(=N)N','med2','El antidiabético más recetado del mundo. Viene de una planta: la lila francesa.'],
 ['SULF','C6H8N2O2S','Sulfanilamida','NC1=CC=C(C=C1)S(N)(=O)=O','anti3,med2','El primer antibiótico sintético (1935). Antes de ella, una herida infectada podía ser mortal.'],
 ['APA','C8H12N2O3S','Ácido 6-aminopenicilánico','NC1C2SC(C)(C)C(N2C1=O)C(=O)O','anti3,med3','El núcleo de todas las penicilinas: un anillo de cuatro átomos que rompe la pared de las bacterias (Fleming, 1928).'],
 ['FDG','C6H11FO5','Fluorodesoxiglucosa','OCC1OC(O)C(F)C(O)C1O','med2,bio1','Glucosa con un flúor-18: los tumores la devoran y brillan en el escáner PET.'],
 ['I2','I2','Yodo molecular','II','anti3','La tintura de yodo: antiséptico clásico de heridas desde 1839.'],
 ['ZNO','ZnO','Óxido de zinc','[Zn]=O','med1,shield1,seal1','Pomadas para la piel y protector solar: refleja la luz ultravioleta.'],
 ['KCL','KCl','Cloruro de potasio','[K]Cl','salt3,med1','El corazón necesita potasio para latir. Es parte del suero oral de la OMS.'],
 ['KI','KI','Yoduro de potasio','[K]I','antid2,med2','Las pastillas que se reparten tras un accidente nuclear: llenan la tiroides de yodo normal para que no absorba el yodo-131.'],
 ['NVP','C6H9NO','N-vinilpirrolidona','C=CN1CCCC1=O','','Monómero de la povidona.','M'],
 ['MMA','C5H8O2','Metacrilato de metilo','C=C(C)C(=O)OC','org1','Monómero del acrílico: cemento óseo, lentes y prótesis.','M'],
 ['HEMA','C6H10O3','Metacrilato de 2-hidroxietilo','C=C(C)C(=O)OCCO','solv1','Monómero del hidrogel de las lentes de contacto blandas.','M']
);
POLYMERS.push(
 ['PVP','NVP','Povidona (PVP)','anti2,seal1,med1','Con yodo forma la povidona yodada, el antiséptico de los quirófanos.'],
 ['PMMA','MMA','Polimetacrilato de metilo','struct2,seal2,med1','Acrílico: cemento para fijar prótesis de cadera y lentes intraoculares.'],
 ['PHEMA','HEMA','Poli-HEMA (hidrogel)','seal2,solv2,med1','Absorbe agua y se vuelve blando: las lentes de contacto de 1971 en adelante.']
);
REACTIONS.push(
 ['R_AC2O','Anhídrido acético','2CH3COOH=AC2O+H2O',47,'Al quitar una molécula de agua a dos ácidos acéticos se obtiene el anhídrido.'],
 ['R_ASP','Síntesis de la aspirina','SALI+AC2O=ASP+CH3COOH',-60,'La reacción con la que Felix Hoffmann obtuvo la aspirina en 1897. Hoy se hace en laboratorios escolares.'],
 ['R_ETOX','El hígado trabaja','2C2H5OH+O2=2ACET+2H2O',-370,'La alcohol deshidrogenasa del hígado convierte el etanol en acetaldehído.'],
 ['R_ACOX','Del acetaldehído al vinagre','2ACET+O2=2CH3COOH',-540,'Una segunda enzima lo transforma en ácido acético, inofensivo.'],
 ['R_NAC','Fabricar el antídoto','CYS+AC2O=NAC+CH3COOH',-50,'La cisteína recibe un grupo acetilo: nace la N-acetilcisteína.'],
 ['R_ETHER','Éter de Valerius Cordus','2C2H5OH=ETER+H2O',25,'En 1540 Cordus calentó alcohol con ácido sulfúrico y obtuvo éter.'],
 ['R_KCL','Sales de potasio','2@K+Cl2=2KCL',-873,'El potasio arde en cloro con llama violeta.'],
 ['R_ZNO','Quemar zinc','2@Zn+O2=2ZNO',-700,'El zinc arde con llama verdosa y deja un polvo blanco: el óxido de zinc.']
);
DIFF.push(
 {g:2,fail:1,ah:3,bal:0,crit:1,rg:0.5},{g:2,fail:1,ah:3,bal:0,crit:1,rg:0.8},{g:1,fail:1,ah:4,bal:0,crit:1,rg:1},{g:1,fail:1,ah:4,bal:0,crit:1,rg:1},
 {g:1,fail:1,ah:5,bal:0,crit:1,rg:1.2},{g:1,fail:1,ah:5,bal:0,crit:1,rg:1.2},{g:0,fail:1,ah:6,bal:0,crit:1,rg:1.5},{g:0,fail:1,ah:6,bal:0,crit:1,rg:1.5},
 {g:0,fail:1,ah:8,bal:0,crit:1,rg:1.8},{g:0,fail:1,ah:8,bal:0,crit:1,rg:2}
);
STORY.s2i = [
  ['eter','sorpresa','DESPUÉS DEL ETERNIO','El Eternio no te hizo inmortal: te hizo consciente. Y la consciencia duele.'],
  ['doc','triste','LA DEUDA QUÍMICA','Me late la cabeza, no duermo y tiemblo. Años de criogenia cobran su precio.'],
  ['eter','neutral','LOS SIETE DURMIENTES','Hay siete cápsulas más en la bodega. Sus ocupantes despiertan enfermos… y uno trajo algo consigo: la Nebulina.'],
  ['eter','enojado','LAB ADVISORY','Aquí todo es química real con fines educativos, no consejo médico. Ningún medicamento se toma sin un profesional de la salud.'],
  ['doc','loco','TEMPORADA 2: FÁRMACOS','Medicinas, drogas, antídotos. Si aprendo cómo una molécula cambia el cuerpo y la mente… aprenderé a curar.']
];
STORY.s2e = [
  ['eter','feliz','NEBULINA VENCIDA','La última dosis se disuelve. Los siete durmientes respiran tranquilos.'],
  ['doc','feliz','LA DOSIS','Una molécula puede curar o destruir. La diferencia está en la dosis, la intención y el conocimiento.'],
  ['eter','sorpresa','TEMPORADA 3','Ahora quieres mejorar el cuerpo: fuerza, velocidad, genes. Niveles 21–30… con cuidado, Doc.']
];
LEVELS.push(
{ n:11, t:'DOLOR', s:'Del sauce a la aspirina', gift:[],
  talk:[['doc','triste','Me estalla la cabeza desde que forjé el Eternio.'],['eter','neutral','Entonces empezamos por el dolor. Hace 2400 años se trataba con corteza de sauce. Hoy lo harás tú.']],
  tx:{ teo:'El dolor y la fiebre los amplifican unas moléculas llamadas prostaglandinas, fabricadas por la enzima COX. La aspirina, el ibuprofeno y el paracetamol frenan esa fábrica de formas distintas.',
       dato:'La aspirina se obtuvo en 1897 modificando el ácido salicílico del sauce; el cambio la hizo mucho menos agresiva para el estómago.',
       fic:'Cuando la aspirina cristalizó en el frasco, ÉTER dijo: «Acabas de repetir el primer gran fármaco sintético de la historia».' },
  P:[
   {k:'m',id:'SALI',t:'La corteza del sauce',d:'Un anillo de benceno con un ácido (–COOH) y un –OH vecinos: el ácido salicílico.',T:180},
   {k:'r',id:'R_AC2O',t:'Anhídrido acético',d:'Quítale el agua a dos ácidos acéticos. Balancea tú.',T:150},
   {k:'r',id:'R_ASP',t:'La aspirina de Hoffmann',d:'Ácido salicílico + anhídrido acético → aspirina + ácido acético.',T:150},
   {k:'b',t:'Dolor de cabeza',d:'La migraña de la criogenia vuelve.',sc:'Vasos dilatados · prostaglandinas · dolor 6/10',w:'med2,cool1',h:'',hp:240,T:60,dps:1.4},
   {k:'m',id:'PARA',t:'Paracetamol',d:'Un anillo con un –OH en un extremo y una amida (–NH–CO–CH₃) en el opuesto.',T:220},
   {k:'m',id:'IBU',t:'Ibuprofeno',d:'Un anillo con una cadena isobutilo de un lado y un ácido propiónico del otro.',T:260},
   {k:'b',t:'Rodilla inflamada',d:'Te golpeaste con la cápsula criogénica.',sc:'Inflamación · enzima COX activa',w:'med3',h:'acid1',hp:260,T:60,dps:1.4},
   {k:'s',n:4,mix:['ASP','SALI','CH3COOH','AC2O'],t:'Purificar la aspirina',d:'La aspirina cruda trae restos de reactivos. Sepáralos: así se purifica un fármaco.',T:150},
   {k:'b',t:'Fiebre de 40 °C',d:'Un durmiente despierta ardiendo.',sc:'Hipotálamo en alerta · 40 °C',w:'med2,cool2',h:'nrg1',hp:280,T:60,dps:1.5},
   {k:'b',boss:1,t:'Migraña de criogenia',d:'Un dolor que late con la luz de la nave.',sc:'Dolor pulsátil · luz insoportable · náusea',w:'med2,cool1',h:'nrg1',hp:400,T:90,dps:1.5,ph2:{d:'El dolor se vuelve inflamación',w:'med3',h:'acid1'}}
  ]},
{ n:12, t:'ESTIMULANTES', s:'Cafeína, chocolate, tabaco… y tu cerebro', gift:[],
  talk:[['doc','loco','¡Necesito café! Mucho café.'],['eter','enojado','La cafeína no te da energía: bloquea la señal de cansancio. Estúdiala antes de abusar de ella.']],
  tx:{ teo:'La cafeína y la teobromina se parecen a la adenosina, la molécula que avisa al cerebro que está cansado, y bloquean sus receptores. La nicotina imita a la acetilcolina y libera dopamina: por eso engancha tanto.',
       dato:'Una taza de café tiene unos 95 mg de cafeína. Más de 400 mg al día puede causar taquicardia, temblor e insomnio.',
       fic:'Probé la nicotina en una mosca de laboratorio. Murió en segundos. ÉTER: «Ahora entiendes por qué las plantas la fabrican».' },
  P:[
   {k:'m',id:'CAF',t:'Cafeína',d:'Dos anillos fusionados (purina) con tres grupos metilo.',T:260},
   {k:'m',id:'TEO',t:'Teobromina: el chocolate',d:'Como la cafeína, pero con un metilo menos.',T:260},
   {k:'b',t:'Fatiga extrema',d:'Llevas 20 horas reparando cápsulas.',sc:'Adenosina acumulada · reflejos lentos',w:'nrg2,neuro2',h:'cool1',hp:260,T:60,dps:1.4},
   {k:'m',id:'TAU',t:'Taurina',d:'Un amino, dos carbonos y un ácido sulfónico (S con dos =O y un –OH).',T:160},
   {k:'m',id:'NIC',t:'Nicotina',d:'Un anillo de piridina unido a un anillo de pirrolidina con un metilo. La estudiarás, no la usarás.',T:260},
   {k:'b',t:'Plaga de pulgones',d:'Insectos devoran el invernadero.',sc:'Insectos · sistema nervioso simple',w:'neuro3',h:'bio1',hp:270,T:60,dps:1.4},
   {k:'s',n:4,mix:['CAF','TEO','H2O','GLU'],t:'Descafeinar',d:'Separa la cafeína del extracto: así se hace el café descafeinado.',T:160},
   {k:'b',t:'Taquicardia',d:'Doc tomó cinco tazas de más.',sc:'160 latidos por minuto · temblor',w:'solv2,salt1',h:'neuro2,nrg2',hx:'CAF,TAU',hp:280,T:60,dps:1.5},
   {k:'m',id:'NIAC',t:'Vitamina B3',d:'Ácido nicotínico: un anillo de piridina con un ácido. Se parece a la nicotina, pero es una vitamina.',T:200},
   {k:'b',boss:1,t:'Tripulación sin chispa',d:'Los robots de mantenimiento se apagan uno a uno.',sc:'Energía baja · señales lentas',w:'nrg2,neuro2',h:'cool1',hp:420,T:90,dps:1.5,ph2:{d:'Ahora les falta combustible celular',w:'bio2,nrg1',h:'anti1'}}
  ]},
{ n:13, t:'ALCOHOL Y ANTÍDOTOS', s:'El hígado contra el veneno', gift:[],
  talk:[['eter','neutral','El alcohol es la droga más consumida del planeta. Veamos qué hace tu hígado con él.'],['doc','sorpresa','¿El hígado es un laboratorio químico?'],['eter','feliz','El mejor que tienes.']],
  tx:{ teo:'El hígado oxida el etanol a acetaldehído (tóxico) y luego a ácido acético. Si llega más alcohol del que puede procesar, el acetaldehído se acumula. Muchos antídotos funcionan compitiendo por las mismas enzimas.',
       dato:'El etanol es un antídoto real contra el metanol: la enzima del hígado prefiere el etanol y deja que el metanol se elimine sin volverse veneno.',
       fic:'Un durmiente destiló licor casero en su cápsula. Era metanol. ÉTER: «La química sin conocimiento es una ruleta».' },
  P:[
   {k:'r',id:'R_ETOX',t:'El hígado trabaja',d:'Etanol + oxígeno → acetaldehído + agua. Balancea.',T:160},
   {k:'r',id:'R_ACOX',t:'Del acetaldehído al vinagre',d:'Termina el trabajo del hígado.',T:150},
   {k:'b',t:'Resaca',d:'El acetaldehído golpea la cabeza de un durmiente.',sc:'Acetaldehído en sangre · deshidratación',w:'solv2,salt1,bio1',h:'neuro1',hx:'C2H5OH',hp:280,T:60,dps:1.5},
   {k:'m',id:'CYS',t:'Cisteína',d:'Un aminoácido con un –SH: la materia prima del antídoto.',T:220},
   {k:'r',id:'R_NAC',t:'Fabricar el antídoto',d:'Cisteína + anhídrido acético → N-acetilcisteína + ácido acético.',T:180},
   {k:'b',t:'Sobredosis de paracetamol',d:'Alguien tomó un frasco entero creyendo que era inofensivo.',sc:'Hígado saturado · metabolito tóxico acumulándose',w:'antid3',h:'med1',hx:'PARA',hp:300,T:60,dps:1.5},
   {k:'b',t:'Intoxicación con metanol',d:'El licor casero era metanol: visión borrosa.',sc:'Metanol en sangre · se transforma en ácido fórmico',w:'antid2,solv1',h:'fuel1',hx:'CH3OH',hp:280,T:60,dps:1.5},
   {k:'s',n:5,mix:['C2H5OH','CH3OH','H2O','ACET','CH3COOH'],t:'Destilación fraccionada',d:'Separa el metanol del etanol: los destiladores de verdad descartan la "cabeza".',T:170},
   {k:'m',id:'ACET',t:'Acetaldehído',d:'Dos carbonos y un aldehído (C=O). La molécula de la resaca.',T:120},
   {k:'b',boss:1,t:'Hígado en llamas',d:'La bodega está llena de durmientes intoxicados.',sc:'Hígado sobrecargado · enzimas agotadas',w:'antid2,bio2',h:'neuro1,fuel1',hx:'C2H5OH',hp:400,T:90,dps:1.6,ph2:{d:'Ahora falta energía para regenerar el hígado',w:'bio3,solv1',h:'anti1'}}
  ]},
{ n:14, t:'ANESTESIA', s:'Apagar el dolor sin apagar la vida', gift:[],
  talk:[['eter','neutral','Antes de 1846, una cirugía era una tortura consciente.'],['doc','sorpresa','¿Y qué la cambió?'],['eter','feliz','Una molécula muy simple: el éter.']],
  tx:{ teo:'Los anestésicos generales apagan la consciencia; los locales bloquean los canales de sodio de un nervio para que la señal de dolor no viaje. El mentol engaña al nervio del frío.',
       dato:'La lidocaína se inventó en 1943 y sigue siendo el anestésico local más usado del mundo.',
       fic:'Un robot médico averiado intentó operar sin anestesia. Le enseñé química… a martillazos.' },
  P:[
   {k:'r',id:'R_ETHER',t:'Éter de Valerius Cordus',d:'Dos etanoles pierden un agua y se unen por un oxígeno.',T:150},
   {k:'m',id:'ETER',t:'Éter dietílico',d:'Dos etilos unidos por un oxígeno: C–C–O–C–C.',T:150},
   {k:'b',t:'Cirugía de emergencia',d:'Un durmiente tiene una fractura expuesta.',sc:'Fractura · dolor 10/10',w:'med3',h:'',hp:300,T:60,dps:1.5},
   {k:'m',id:'BENZ',t:'Benzocaína',d:'Un anillo con una amina en un extremo y un éster etílico en el opuesto.',T:260},
   {k:'m',id:'MENT',t:'Mentol',d:'Un anillo de seis carbonos sin dobles enlaces, con un –OH, un metilo y un isopropilo.',T:220},
   {k:'b',t:'Quemadura de la forja',d:'El plasma te alcanzó el brazo.',sc:'Quemadura de segundo grado · piel ardiendo',w:'cool2,med2',h:'fuel2',hp:300,T:60,dps:1.5},
   {k:'m',id:'LIDO',t:'Lidocaína',d:'Un anillo con dos metilos y una amida unida a una amina con dos etilos. Difícil.',T:320},
   {k:'s',n:5,mix:['LIDO','BENZ','MENT','ETER','H2O'],t:'Cromatografía',d:'Separa los anestésicos según lo que avanzan en el papel.',T:180},
   {k:'b',t:'Dolor de muelas',d:'Una caries te llega al nervio.',sc:'Nervio expuesto · caries profunda',w:'med2,cool1',h:'acid1',hp:300,T:60,dps:1.5},
   {k:'b',boss:1,t:'El cirujano fantasma',d:'Un autómata médico averiado opera a los durmientes sin anestesia.',sc:'Bisturí descontrolado · dolor en cadena',w:'med3,cool1',h:'fuel1',hp:440,T:90,dps:1.6,ph2:{d:'Las heridas se inflaman',w:'med2,anti1',h:'bio1'}}
  ]},
{ n:15, t:'NEUROTRANSMISORES', s:'Las moléculas de la mente', gift:[],
  talk:[['doc','sorpresa','¿Mis emociones son… moléculas?'],['eter','neutral','Mensajeros químicos entre neuronas. Las drogas, las medicinas y la luz del sol los modifican.']],
  tx:{ teo:'Las neuronas se hablan con moléculas: dopamina (motivación), serotonina (ánimo), GABA (freno), adrenalina (alerta) y melatonina (sueño). Muchas drogas funcionan imitándolas o impidiendo que se reciclen; por eso alteran tanto la conducta.',
       dato:'La melatonina se fabrica a partir de la serotonina, y esta a partir del triptófano de los alimentos.',
       fic:'Seis meses sin sol en la cara oscura del planeta. La tripulación perdió el ritmo. Yo aprendí a fabricar la noche en un frasco.' },
  P:[
   {k:'m',id:'GABA',t:'El freno del cerebro',d:'Un amino, tres carbonos y un ácido.',T:180},
   {k:'m',id:'DOPA',t:'Dopamina',d:'Un catecol (anillo con dos –OH vecinos) y una cadena de dos carbonos con amina.',T:260},
   {k:'b',t:'Insomnio',d:'Cuatro noches sin dormir.',sc:'Cortisol alto · mente acelerada',w:'neuro2,med1',h:'nrg2',hx:'CAF',hp:300,T:60,dps:1.5},
   {k:'m',id:'SERO',t:'Serotonina',d:'Un indol (benceno fusionado con un anillo de cinco con N) con –OH y una cadena con amina.',T:320},
   {k:'m',id:'MELA',t:'Melatonina',d:'Como la serotonina, pero con un metoxi (–OCH₃) y una amida.',T:320},
   {k:'b',t:'Choque anafiláctico',d:'Una picadura alienígena cierra la garganta de un durmiente.',sc:'Histamina masiva · bronquios cerrándose',w:'neuro2,med2',h:'bio1',hx:'HIST',hp:300,T:60,dps:1.5},
   {k:'m',id:'ADRE',t:'Adrenalina',d:'Un catecol con una cadena –CH(OH)–CH₂–NH–CH₃.',T:280},
   {k:'m',id:'HIST',t:'Histamina',d:'Un imidazol (anillo de cinco con dos N) con una cadena de etilamina.',T:220},
   {k:'b',t:'Noche polar',d:'Seis meses sin sol: la tripulación pierde el ritmo.',sc:'Ritmo circadiano roto · somnolencia de día',w:'neuro2,med1',h:'',hp:320,T:60,dps:1.5},
   {k:'b',boss:1,t:'Virus de la apatía',d:'Un virus informático imita en los robots la falta de dopamina: dejan de querer hacer nada.',sc:'Señales de recompensa apagadas',w:'neuro3,bio1',h:'anti1',hp:390,T:90,dps:1.6,ph2:{d:'Ahora los robots no duermen',w:'neuro2,med1',h:'nrg2'}}
  ]},
{ n:16, t:'ANTISÉPTICOS', s:'Yodo, zinc y polímeros que curan', gift:[],
  talk:[['eter','neutral','Una cirugía sin antisépticos es una puerta abierta a las bacterias.'],['doc','loco','¡Entonces forjaré yodo!']],
  tx:{ teo:'Los antisépticos matan microbios sobre la piel o el instrumental. La povidona yodada libera yodo poco a poco; el óxido de zinc protege y seca la piel. Los polímeros médicos sostienen huesos y lentes.',
       dato:'El cemento óseo de las prótesis de cadera es el mismo acrílico (PMMA) de los acuarios y los letreros.',
       fic:'ÉTER me dejó operar a un durmiente. Pegué su fémur con acrílico. Ahora camina… y me debe un favor.' },
  P:[
   {k:'f',z:53,t:'Yodo',d:'Rutenio-102 + flúor-19 + 6 neutrones: 53 protones, masa 127.',r:'Ru102+F19+6n',T:160},
   {k:'m',id:'I2',t:'Tintura de yodo',d:'Dos yodos unidos.',T:100},
   {k:'f',z:30,t:'Zinc',d:'Cobre-63 + un protón.',r:'Cu63+p',T:130},
   {k:'m',id:'ZNO',t:'Pomada de zinc',d:'Un zinc con doble enlace a un oxígeno.',T:100},
   {k:'m',id:'NVP',t:'N-vinilpirrolidona',d:'Un vinilo unido al nitrógeno de un anillo de cinco con una cetona.',T:220},
   {k:'p',id:'PVP',t:'Povidona',d:'Encadena 3 o más N-vinilpirrolidonas.',T:150},
   {k:'b',t:'Infección de quirófano',d:'Bacterias en el instrumental.',sc:'Bacterias · herida abierta',w:'anti3,seal1',h:'bio2',hp:330,T:60,dps:1.5},
   {k:'m',id:'MMA',t:'Metacrilato de metilo',d:'C=C con un metilo y un éster metílico.',T:200},
   {k:'p',id:'PMMA',t:'Cemento óseo',d:'Encadena metacrilato de metilo.',T:150},
   {k:'b',boss:1,t:'Fractura doble',d:'Un meteorito golpeó la bodega y a un durmiente: casco y fémur rotos.',sc:'Hueso partido · casco abierto',w:'struct2,seal2,med1',h:'acid1',hp:460,T:90,dps:1.6,ph2:{d:'La herida se infecta',w:'anti2,seal1',h:'bio2'}}
  ]},
{ n:17, t:'VITAMINAS Y SALES', s:'Lo que el cuerpo no fabrica', gift:[],
  talk:[['eter','neutral','Desde aquí no hay planos ni fórmulas: solo el nombre. Eres farmacólogo.'],['doc','loco','¡Que tiemble la tabla periódica!']],
  tx:{ teo:'Las vitaminas son moléculas que el cuerpo no fabrica y necesita en pequeñas cantidades. Las sales (sodio, potasio) mantienen el voltaje de nervios y corazón. El suero oral, solo agua, sales y glucosa, salva millones de vidas.',
       dato:'En 1747 James Lind demostró con limones que el escorbuto se curaba: fue uno de los primeros ensayos clínicos de la historia.',
       fic:'Un brote de cólera en la colonia. No hubo milagro: hubo sal, azúcar y agua en la proporción exacta.' },
  P:[
   {k:'f',z:19,t:'Potasio',d:'Cloro-35 + helio-4.',r:'Cl35+He4',T:130},
   {k:'m',id:'KCL',t:'Cloruro de potasio',d:'Potasio y cloro: enlace iónico.',T:100},
   {k:'m',id:'KI',t:'Yoduro de potasio',d:'Potasio y yodo.',T:100},
   {k:'b',t:'Cólera en la colonia',d:'Diarrea severa en los pasajeros despiertos.',sc:'Pérdida masiva de sales y agua',w:'salt3,solv2',h:'acid1',hp:340,T:60,dps:1.6},
   {k:'m',id:'VITC',t:'Vitamina C',d:'Una lactona de cinco con dos –OH en un doble enlace y una cadena de dos carbonos con dos –OH.',T:320},
   {k:'b',t:'Escorbuto',d:'Tres meses sin fruta fresca.',sc:'Encías sangrantes · colágeno débil',w:'bio3,med1',h:'',hp:340,T:60,dps:1.6},
   {k:'m',id:'METF',t:'Metformina',d:'Dos guanidinas unidas, con dos metilos en un nitrógeno.',T:260},
   {k:'b',t:'Hiperglucemia',d:'La glucosa de un durmiente se disparó.',sc:'Glucosa 300 mg/dL · insulina que no responde',w:'med2',h:'nrg2,bio1',hx:'GLU',hp:290,T:60,dps:1.6},
   {k:'s',n:6,mix:['VITC','KCL','NaCl','GLU','H2O','KI'],t:'Suero oral',d:'Separa los ingredientes de un suero mal mezclado.',T:190},
   {k:'b',boss:1,t:'Lluvia de yodo-131',d:'Se rompió un contenedor médico: yodo radiactivo en el aire.',sc:'Yodo-131 · la tiroides lo absorbe',w:'antid2,med1,shield1',h:'rad2',hp:330,T:90,dps:1.6,ph2:{d:'La radiación se acumula en la bodega',w:'shield2,antid1',h:'rad1'}}
  ]},
{ n:18, t:'MEDICINA NUCLEAR', s:'La forja que cura', gift:[],
  talk:[['eter','sorpresa','La misma forja que creó el Eternio puede ver y destruir tumores.'],['doc','feliz','La radiación también puede curar.']],
  tx:{ teo:'Los radiofármacos llevan un átomo radiactivo a un órgano: el flúor-18 en la glucosa ilumina tumores en el PET, el tecnecio-99m muestra huesos y corazón, y el cobalto-60 destruye células enfermas en la radioterapia.',
       dato:'El tecnecio fue el primer elemento creado artificialmente (1937). Hoy se usa en unos 40 millones de estudios médicos al año.',
       fic:'El escáner mostró una sombra en un durmiente. La forja dejó de ser un arma: fue una cámara.' },
  P:[
   {k:'f',z:9,a:18,t:'Flúor-18',d:'Nitrógeno-14 + helio-4: un flúor con un neutrón menos. Vive menos de dos horas.',r:'N14+He4',T:140},
   {k:'m',id:'FDG',t:'El azúcar que brilla',d:'Glucosa en forma de anillo con un flúor en lugar del –OH del carbono 2.',T:320},
   {k:'f',z:43,t:'Tecnecio-99',d:'Hierro-56 + cloro-35 + 8 neutrones.',r:'Fe56+Cl35+8n',T:150},
   {k:'b',t:'Tumor oculto',d:'El PET muestra una masa en un durmiente.',sc:'Células que se dividen sin control',w:'rad3,med1',h:'bio2',hp:340,T:60,dps:1.6},
   {k:'f',z:27,a:60,t:'Cobalto-60',d:'Hierro-56 + protón + 3 neutrones: la fuente de la radioterapia.',r:'Fe56+p+3n',T:150},
   {k:'b',t:'Contaminación radiactiva',d:'Polvo radiactivo en el laboratorio.',sc:'2 Sv acumulados · se necesita masa densa',w:'shield3,antid1',h:'rad2',hp:340,T:60,dps:1.6},
   {k:'s',n:6,mix:['UO2','FDG','KI','H2O','NaCl','I2'],t:'Separar radiofármacos',d:'Cada dosis debe ir pura a su paciente.',T:200},
   {k:'b',t:'Metástasis',d:'Las células del tumor viajaron.',sc:'Focos múltiples',w:'rad2,med2',h:'bio2',hp:350,T:60,dps:1.6},
   {k:'f',z:15,a:32,t:'Fósforo-32',d:'Silicio-28 + deuterio + 2 neutrones: un fósforo radiactivo que alivia el dolor de los huesos con metástasis.',r:'Si28+D+2n',T:150},
   {k:'b',boss:1,t:'La sombra del escáner',d:'La sombra crece en tres durmientes a la vez.',sc:'Tumor agresivo · resistente',w:'rad2,med2,bio1',h:'bio2',hp:460,T:90,dps:1.6,ph2:{d:'Las células se esconden',w:'rad3',h:'bio1'}}
  ]},
{ n:19, t:'ANTIBIÓTICOS', s:'La guerra contra las bacterias… y su resistencia', gift:[],
  talk:[['eter','enojado','Aquí la resistencia no es una regla del juego: es la realidad. Las bacterias aprenden.'],['doc','sorpresa','¿Como las amenazas que se vuelven inmunes cuando repito?'],['eter','neutral','Exacto. Varía o perderás.']],
  tx:{ teo:'Los antibióticos atacan lo que las bacterias tienen y nosotros no: la pared celular (penicilinas) o la fabricación de folato (sulfas). Usarlos mal selecciona a las bacterias resistentes, que sobreviven y se multiplican.',
       dato:'Fleming vio en 1928 que un moho mataba sus bacterias. Advirtió en 1945 que el mal uso de la penicilina crearía resistencia. Tenía razón.',
       fic:'La bodega se volvió un caldo de cultivo. Cada vez que repetía el mismo antibiótico, las bacterias se reían de mí.' },
  P:[
   {k:'m',id:'SULF',t:'Sulfanilamida',d:'Un anillo con una amina en un extremo y una sulfonamida (–SO₂NH₂) en el opuesto.',T:300},
   {k:'b',t:'Neumonía',d:'Bacterias en los pulmones de un durmiente.',sc:'Fiebre · tos · pulmón blanco',w:'anti3,med2',h:'bio2',hp:350,T:60,dps:1.6},
   {k:'m',id:'APA',t:'El núcleo de la penicilina',d:'Un anillo de cuatro (β-lactama) fusionado a uno de cinco con azufre y dos metilos. Experto.',T:420},
   {k:'b',t:'Bacteria resistente',d:'La infección vuelve más fuerte.',sc:'Mutación · bombas que expulsan el antibiótico',w:'anti3,med2',h:'bio2',hp:350,T:60,dps:1.6},
   {k:'s',n:6,mix:['APA','SULF','GLU','NaCl','H2O','CH3COOH'],t:'Caldo de cultivo',d:'Separa los antibióticos del medio de cultivo.',T:200},
   {k:'b',t:'Infección ocular',d:'Una lente de contacto contaminada.',sc:'Conjuntiva roja · visión borrosa',w:'anti2,med2',h:'bio1',hp:350,T:60,dps:1.6},
   {k:'m',id:'HEMA',t:'Monómero de lentes',d:'Metacrilato con un –CH₂CH₂OH en el éster.',T:240},
   {k:'p',id:'PHEMA',t:'Lentes de contacto',d:'Encadena HEMA: un hidrogel que bebe agua.',T:150},
   {k:'b',t:'Sepsis',d:'La infección pasó a la sangre.',sc:'Presión cayendo · fiebre · confusión',w:'anti3,med2,solv1',h:'bio2',hp:360,T:60,dps:1.6},
   {k:'b',boss:1,t:'Superbacteria',d:'Resiste casi todo lo conocido.',sc:'Resistencia múltiple · se adapta rápido',w:'anti3,med2',h:'bio2',hp:460,T:90,dps:1.6,ph2:{d:'Muta su pared celular',w:'anti2,med3',h:'bio2'}}
  ]},
{ n:20, t:'LA NEBULINA', s:'Una droga que el universo no conocía', gift:[],
  talk:[['eter','enojado','La Nebulina no existe en ninguna base de datos. Secuestra la dopamina y muta en cada dosis.'],['doc','loco','Entonces la venceré con algo que tampoco exista. ¡Mis híbridos!'],['eter','sorpresa','Por primera vez, la locura es el plan correcto.']],
  tx:{ teo:'Las drogas sintéticas nuevas se diseñan para escapar de las leyes cambiando pequeños grupos de la molécula; eso las vuelve impredecibles. La medicina responde con antídotos, tratamiento del síndrome de abstinencia y, sobre todo, prevención.',
       dato:'La adicción cambia la química del cerebro: los receptores de dopamina disminuyen y lo cotidiano deja de dar placer. Se puede tratar, y pedir ayuda es parte de la cura.',
       fic:'La Nebulina es ficción, pero su historia no. La vencí con una molécula que nadie había imaginado. ÉTER la bautizó con mi nombre.' },
  P:[
   {k:'b',t:'Primeros casos',d:'Pasajeros despiertos con euforia… y luego vacío.',sc:'Dopamina secuestrada · euforia y caída',w:'neuro2,antid1',h:'nrg1',hp:250,T:60,dps:1.6},
   {k:'m',id:'NAC',t:'Antídoto base',d:'N-acetilcisteína, esta vez sin plano ni fórmula.',T:320},
   {k:'r',id:'R_KCL',t:'Sales para el suero',d:'Potasio + cloro → cloruro de potasio. Balancea.',T:150},
   {k:'b',t:'Abstinencia',d:'Sin la droga, los afectados tiemblan y no duermen.',sc:'Temblores · ansiedad · insomnio',w:'med2,neuro1,salt1',h:'nrg2',hx:'CAF',hp:320,T:60,dps:1.6},
   {k:'m',id:'MELA',t:'Dormir de nuevo',d:'Melatonina, sin ayudas.',T:340},
   {k:'s',n:7,mix:['NAC','MELA','KCL','GLU','H2O','VITC','NaCl'],t:'Cóctel de rehabilitación',d:'Siete sustancias, poco espacio y mucha prisa.',T:220},
   {k:'b',t:'Recaída',d:'La Nebulina vuelve a circular en la bodega.',sc:'Antojo intenso · dopamina baja',w:'neuro2,med2',h:'nrg1',hp:350,T:60,dps:1.6},
   {k:'m',id:'SERO',t:'Serotonina sintética',d:'Serotonina, sin ayudas.',T:340},
   {k:'b',t:'Laboratorio clandestino',d:'Encuentras dónde se fabricaba la Nebulina: hay que neutralizarlo.',sc:'Disolventes inflamables · humo tóxico',w:'inert2,seal2',h:'fuel2,oxi1',hp:350,T:60,dps:1.6},
   {k:'b',boss:1,hyb:2,t:'LA NEBULINA',d:'La droga se concentra en una nube que intenta entrar a todas las cápsulas. Los HÍBRIDOS que inventes hacen el doble de daño: la Nebulina no los reconoce.',sc:'Molécula sintética desconocida · secuestra la dopamina · muta en cada dosis',w:'antid2,neuro2,med1',h:'nrg1',hp:320,T:90,dps:1.3,ph2:{d:'La Nebulina muta para atacar el cuerpo',w:'bio2,antid2',h:'nrg1'}}
  ]}
);
