let data; // tabella del CSV

let rotte = ["Western Mediterranean", "Central Mediterranean", "Eastern Mediterranean"];
let rotteMaiuscolo = ["WESTERN MEDITERRANEAN", "CENTRAL MEDITERRANEAN", "EASTERN MEDITERRANEAN"];
let anni = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

// layout 
let altezzaHeader = 15; 
let yEtichette = [];
let yBasi = []; 

// colori
let bianco = "#e9eef5";
let chiaro = "#bcc9d8";
let scuro = "#0b1626";
let grigioScuro = "#4a5a70";
let bluNotte = "#18294a"; // cerchi

let spazioCerchi = 2.5; // spazio vuoto tra un cerchio e l'altro 

// misure della pagina in modo che queste si adattino alla finestra che NB puo sempre essewre più piccola o più grande
let scala; // quanto ingrandire o rimpicciolire testi e cerchi
let margineLati; // spazio vuoto a sinistra e a destra della pagina
let larghezzaAnno; // spazio orizzontale occupato da ogni anno

// ogni riga è un incidente --> un incidente per ogni casella i
let numeroIncidenti = 0;
let rottaIncidente = []; // rotta dell'incidente (0 Western, 1 Central, 2 Eastern)
let annoIncidente = []; // anno dell'incidente (0 = 2014, 1 = 2015...)
let vittimeIncidente = []; // morti e dispersi dell'incidente
let xCerchio = []; // x del cerchio
let yCerchio = []; // quanto il cerchio sta sopra la base 
let raggioCerchio = []; // raggio del cerchio

// DA CAPIRE MEGLIO numeri di ogni cella (una rotta in un anno): la cella è la casella rotta * 13 + anno --> 
let totVittime = [];
let totIncidenti = [];
let pesi = []; // somma delle aree dei cerchi della cella: dà la forma all'onda
let quanti = []; // quanti cerchi ho già sistemato nella cella
let lista = []; // cerchi già sistemati: quelli della cella partono dalla casella cella * 300
let maxPerCella = 300;

let totaliRotta = [0, 0, 0];
let totaleVittime = 0;
let maxVittime = 0; // incidente più grande (per la legenda)

// grandezza dei cerchi (in px nel mockup, come i 9.6 * s del livello 3)
let diametroMinimo = 2.5; // cerchio di un incidente con 1 vittima
let diametroMassimo = 26; // cerchio dell'incidente più grande (1022 vittime)

let altezzaMenu = 65; // altezza dell'header nel CSS (uguale al livello 3)

let rottaSelezionata = -1; // rotta se ci passo sotto col mouse (-1 = nessuna)
let annoSelezionato = -1; // anno sotto il mouse (-1 = nessuno)

async function setup() {
  createCanvas(windowWidth, windowHeight - altezzaMenu); // come nel livello 3: tolgo l'altezza del menu, così la pagina non scorre
  data = await loadTable("assets/mediterraneo.csv", ",", "header");

  // adatto le misure del mockup alla finestra
  scala = width / 1440;
  if (height / 900 < scala) {
    scala = height / 900;
  }

  //layout
  let yInizio = altezzaHeader + 175 * scala; 
  let yFine = height - 125 * scala; 
  let altezzaOnda = 115 * scala; 
  let spazioTraRotte = (yFine - yInizio - 3 * altezzaOnda) / 2; 
  for (let rotta = 0; rotta < 3; rotta++) {
    yEtichette[rotta] = yInizio + rotta * (altezzaOnda + spazioTraRotte); // nome della rotta
    yBasi[rotta] = yEtichette[rotta] + altezzaOnda; // base della sua onda
  }
  margineLati = width * 0.0278;
  larghezzaAnno = (width - 2 * margineLati) / 13;

  // ciclo passa per 39 celle 
  for (let cella = 0; cella < 39; cella++) {
    totVittime[cella] = 0;
    totIncidenti[cella] = 0;
  }

  // salvo ogni incidente
  for (let i = 0; i < data.getRowCount(); i++) { // leggo ogni riga del CSV
    let rotta = -1; // si parte con rotta -1 = non so ancora
    for (let numero = 0; numero < 3; numero++) {
      if (data.getString(i, "migration route") == rotte[numero]) {
        rotta = numero;
      }
    }
    let anno = data.getNum(i, "incident year") - 2014; //in modo che gli array partano da 0
    let vittime = data.getNum(i, "total number of dead and missing"); //prende il numero tot di morti e dispersi nell'incidente

    if (rotta >= 0 && anno >= 0 && anno < 13) {
      rottaIncidente[numeroIncidenti] = rotta;
      annoIncidente[numeroIncidenti] = anno;
      vittimeIncidente[numeroIncidenti] = vittime;
      xCerchio[numeroIncidenti] = 0;
      yCerchio[numeroIncidenti] = 0;
      raggioCerchio[numeroIncidenti] = 0;
      numeroIncidenti = numeroIncidenti + 1;

      totVittime[rotta * 13 + anno] = totVittime[rotta * 13 + anno] + vittime; //trovo la cella della rotta e dell'anno e aggiungo le vittime
      totIncidenti[rotta * 13 + anno] = totIncidenti[rotta * 13 + anno] + 1;
      totaliRotta[rotta] = totaliRotta[rotta] + vittime;
      totaleVittime = totaleVittime + vittime; //numero grande in alto
      if (vittime > maxVittime) { // cerco incidente più grande 
        maxVittime = vittime;
      }
    }
  }

  disponiCerchi(); // chiamo la funzione che calcola le posizioni dei cerchi dicendole di eseguire il codice.
  //NB: la metto qui perche prima devo scrivere tutti i dati e poi penso alle poszioni delle palline
}

function draw() {
  clear();
  textFont("dm-sans");
  textAlign(LEFT, TOP);
  noStroke();

  trovaCella();
  disegnaTitolo();
  disegnaFlussi();
  disegnaAnni();
  disegnaLegenda();
  if (rottaSelezionata != -1) {
    disegnaFinestra(); //NB: la dinestra che si apre per vedere nel dettaglio sta x ultima 
    // perchè deve essere disegnata sopra a tutto il resto
  }
}

// clic su una rotta in un anno: apro il livello 2
function mouseClicked() {
  if (rottaSelezionata != -1) {
    window.location.href = "livello-2.html?rotta=" + rotte[rottaSelezionata] + "&anno=" + anni[annoSelezionato];
  }
}

// POSIZIONI CERCHI

// decide dove va ogni cerchio
function disponiCerchi() {
  // 1. svuoto le celle
  for (let cella = 0; cella < 39; cella++) {
    pesi[cella] = 0;
    quanti[cella] = 0;
  }

  // 2. calcolo la grandezza di ogni cerchio e quanto spazio occupa in tutto ogni cella
  for (let i = 0; i < numeroIncidenti; i++) {
    // diametro tra diametroMinimo (1 vittima) e diametroMassimo (1022 vittime).
    // uso sqrt perché è l'AREA del cerchio che deve crescere con le vittime
    let diametro = map(sqrt(vittimeIncidente[i]), 1, sqrt(maxVittime), diametroMinimo, diametroMassimo) * scala;
    raggioCerchio[i] = diametro / 2;

    let raggioConSpazio = raggioCerchio[i] + spazioCerchi * scala;
    let cella = rottaIncidente[i] * 13 + annoIncidente[i];
    pesi[cella] = pesi[cella] + raggioConSpazio * raggioConSpazio;
  }

  // 3. faccio cadere i cerchi nell'ordine del CSV
  for (let i = 0; i < numeroIncidenti; i++) {
    cadiNellAnno(i);

    // segno tra i cerchi già sistemati della sua cella
    let cella = rottaIncidente[i] * 13 + annoIncidente[i];
    lista[cella * maxPerCella + quanti[cella]] = i;
    quanti[cella] = quanti[cella] + 1;
  }
}

// ogni pallino si mette nella posizione vuota 
// quindi il mucchio cresce
function cadiNellAnno(i) {
  let rotta = rottaIncidente[i];
  let anno = annoIncidente[i];
  let cella = rotta * 13 + anno;
  let raggio = raggioCerchio[i];
  let spazio = spazioCerchi * scala;

  // il cerchio può stare solo dentro il suo anno +  mezzo spazio dai bordi così non tocca l'anno vicino
  let xSinistra = margineLati + anno * larghezzaAnno + raggio + spazio / 2;
  let xDestra = margineLati + (anno + 1) * larghezzaAnno - raggio - spazio / 2;

  let punteggioMigliore = 100000;

  // provo tutte le x dell'anno
  for (let x = xSinistra; x <= xDestra; x = x + 1) {

    let y = -raggio;
    for (let n = 0; n < quanti[cella]; n++) {
      let altro = lista[cella * maxPerCella + n];
      let dx = x - xCerchio[altro];
      let minima = raggioCerchio[altro] + raggio + spazio; // i centri devono stare almeno a questa distanza
      if (dx * dx < minima * minima) {
        let ySopra = yCerchio[altro] - sqrt(minima * minima - dx * dx); // appoggiato sopra l'altro
        if (ySopra < y) {
          y = ySopra;
        }
      }
    }

// ogni anno ha un peso. Se l'onda saltasse da un peso piccolo a uno grande al confine tra due anni, verrebbe un gradino. 
// Per evitarlo, tra il centro di uno e il centro di un altro l'altezza cresce piano piano

    // passa piano piano dal peso di un anno a quello dopo
    let posizione = (x - margineLati - larghezzaAnno / 2) / larghezzaAnno; // 0 = centro degli anni, mi dice a che punto sono
    let onda = pesi[cella];
    if (posizione > 0 && posizione < 12) { //serve x 2014 e 2026 che hanno un solo anno vicino
      let annoPrima = int(posizione);
      onda = map(posizione, annoPrima, annoPrima + 1, pesi[rotta * 13 + annoPrima], pesi[rotta * 13 + annoPrima + 1]);
    }

    //  tengo la x dove il mucchio è più basso rispetto all'onda
    let punteggio = (-y + raggio) / (onda + 1); 
    // (-y + raggio) quanto è alto il mucchio in quel punto se ci metto il pallino
    //onda --> quanto dobrebbe essere alto li
    //divido x ottenere quanto è gia pieno
    if (punteggio < punteggioMigliore) {
      punteggioMigliore = punteggio;
      xCerchio[i] = x;
      yCerchio[i] = y; //in modo che il pallino vada nel posto + vuoto di tutti
    }
  }
}

// MOUSE

// in quale rotta e in quale anno si trova il mouse
function trovaCella() {
  rottaSelezionata = -1; //il mouse non è su niente
  annoSelezionato = -1; //il mouse non è su niente
  if (mouseX > margineLati && mouseX < width - margineLati) { 
    //x controllare che il mouse non sia nei margini a sinistra o a destra dove non ci sono anni.
    
    let anno = int((mouseX - margineLati) / larghezzaAnno); //x capire in quale colonna si trova il mouse
    for (let rotta = 0; rotta < 3; rotta++) { //x capire quale rotta sono sopra col mouse
      let alto = yEtichette[rotta] + 20 * scala;
      let basso = yBasi[rotta] + 10 * scala;

      if (mouseY > alto && mouseY < basso && totIncidenti[rotta * 13 + anno] > 0) {
        rottaSelezionata = rotta;
        annoSelezionato = anno;
        //Se il mouse è tra alto e basso  e in quella cella c'è almeno un incidente 
        // allora ha trovato la cella e si segna rotta e anno.
      }
    }
  }
}

// DISEGNO

// scrive un numero con la virgola delle migliaia  
// seguito da una parola
function scriviNumero(n, dopo, x, y) {
  if (n < 1000) {
    text(n + dopo, x, y);
  } else {
    let migliaia = int(n / 1000);
    let resto = n % 1000;
    let zeri = "";
    if (resto < 100) {
      zeri = "0";
    }
    if (resto < 10) {
      zeri = "00";
    }
    text(migliaia + "," + zeri + resto + dopo, x, y);
  }
}

function disegnaTitolo() {
  fill(bianco);
  textSize(58 * scala);
  textWeight(700);
  text("Mediterranean", margineLati, altezzaHeader + 51 * scala);
  fill(chiaro);
  textSize(38 * scala);
  textWeight(500);
  text("2014–2026", margineLati, altezzaHeader + 110 * scala);

  push();
  textAlign(RIGHT, TOP);
  fill(bianco);
  textSize(92 * scala);
  textWeight(700);
  scriviNumero(totaleVittime, "", width - margineLati, altezzaHeader + 41 * scala);
  textSize(22 * scala);
  textWeight(400);
  text("victims", width - margineLati, altezzaHeader + 122 * scala);
  pop();
}

function disegnaFlussi() {
  // nome e totale di ogni rotta
  for (let rotta = 0; rotta < 3; rotta++) {
    textSize(16 * scala); // nome della rotta più grande (prima era 12)
    textWeight(500);
    fill(bianco);
    text(rotteMaiuscolo[rotta], margineLati, yEtichette[rotta]);
    textSize(14 * scala);
    textWeight(400);
    fill(chiaro);
    scriviNumero(totaliRotta[rotta], " victims", margineLati + 240 * scala, yEtichette[rotta] + 2 * scala); // più a destra, perché il nome è più lungo
  }

  // un cerchio per incidente; bianchi quelli della rotta e dell'anno sotto il mouse
  noStroke();
  for (let i = 0; i < numeroIncidenti; i++) {
    if (rottaIncidente[i] == rottaSelezionata && annoIncidente[i] == annoSelezionato) {
      fill(bianco); // cerchi sotto il mouse in bianco
    } else {
      fill(bluNotte);
    }
    circle(xCerchio[i], yBasi[rottaIncidente[i]] + yCerchio[i], raggioCerchio[i] * 2);
  }
}

function disegnaAnni() {
  push();
  textAlign(CENTER, TOP);
  textSize(18 * scala);
  textWeight(400);
  for (let anno = 0; anno < 13; anno++) {
    if (anno == annoSelezionato) {
      fill(bianco);
    } else {
      fill(chiaro);
    }
    text(anni[anno], margineLati + anno * larghezzaAnno + larghezzaAnno / 2, height - 95 * scala);
  }
  pop();
}

function disegnaLegenda() {
  let y = height - 30 * scala; // centro della riga della legenda, in fondo alla pagina

  push();
  textAlign(LEFT, CENTER);
  textSize(15 * scala);
  textWeight(400);

  // cosa vuol dire un cerchio
  fill(bianco);
  text("Each circle is one incident. The bigger the circle, the more victims.", margineLati, y);

  // cerchi di esempio con il loro numero di vittime
  let esempi = [1, 100, 1022]; // vittime dei cerchi di esempio
  let spazi = [85, 115, 130]; 
  let x = width - margineLati - 330 * scala; 

  for (let n = 0; n < 3; n++) {
    let diametro = map(sqrt(esempi[n]), 1, sqrt(maxVittime), diametroMinimo, diametroMassimo) * scala;
    fill(bluNotte);
    circle(x + diametro / 2, y, diametro); // stesso cerchio del disegno
    fill(bianco);
    if (esempi[n] == 1) {
      text("1 victim", x + diametro + 8 * scala, y);
    } else {
      scriviNumero(esempi[n], " victims", x + diametro + 8 * scala, y);
    }
    x = x + spazi[n] * scala;
  }
  pop();
}

// finestra con anno, rotta, vittime e incidenti della cella sotto il mouse
function disegnaFinestra() {
  let cella = rottaSelezionata * 13 + annoSelezionato;
  let larghezza = 250 * scala;
  let altezza = 160 * scala;

  // sopra il flusso per la prima rotta sotto, per non coprire il titolo
  let x = margineLati + annoSelezionato * larghezzaAnno + larghezzaAnno / 2 - larghezza / 2;
  if (x < margineLati) {
    x = margineLati; // non esce a sinistra
  }
  if (x > width - margineLati - larghezza) {
    x = width - margineLati - larghezza; // non esce a destra
  }
  let y = yBasi[rottaSelezionata] - 133 * scala - altezza;
  if (rottaSelezionata == 0) {
    y = yBasi[rottaSelezionata] + 20 * scala;
  }

  noStroke();
  fill(bianco);
  rect(x, y, larghezza, altezza, 8 * scala); // l'ultimo numero arrotonda gli angoli

  let xTesto = x + 16 * scala;
  fill(grigioScuro);
  textSize(12 * scala);
  textWeight(400);
  text(anni[annoSelezionato], xTesto, y + 16 * scala);

  fill(scuro);
  textSize(16 * scala);
  textWeight(500);
  text(rotte[rottaSelezionata], xTesto, y + 33 * scala);

  textSize(28 * scala);
  textWeight(700);
  if (totVittime[cella] == 1) {
    text("1 victim", xTesto, y + 60 * scala);
  } else {
    scriviNumero(totVittime[cella], " victims", xTesto, y + 60 * scala);
  }

  fill(grigioScuro);
  textSize(13 * scala);
  textWeight(400);
  if (totIncidenti[cella] == 1) {
    text("1 incident", xTesto, y + 103 * scala);
  } else {
    text(totIncidenti[cella] + " incidents", xTesto, y + 103 * scala);
  }

  // livello 2
  text("Click to open", xTesto, y + 130 * scala);
}