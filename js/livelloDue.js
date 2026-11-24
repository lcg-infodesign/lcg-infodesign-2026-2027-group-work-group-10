// LIVELLO 2 · gli incidenti di una rotta in un anno
/* rotta e anno arrivano dall'indirizzo della pagina, il prof
consiglia di usare la funzione getURLParams   */

let data; // tabella del CSV
let rotta = "Central Mediterranean"; // rotta mostrata se l'indirizzo non ne indica una
let anno = 2023; // anno mostrato se l'indirizzo non ne indica uno
let incidentiRotta = []; // tutti gli incidenti della rotta, di tutti gli anni
let bolle = []; // incidenti dell'anno scelto, con posizione e pallini
let mensili = []; // mensili[anno][mese] = vittime, per le barre dei bottoni
let maxMese = 1; // mese con più vittime della rotta (altezza massima delle barre)
let totaleAnno = { vittime: 0, morti: 0, dispersi: 0 };

let ROTTE = ["Western Mediterranean", "Central Mediterranean", "Eastern Mediterranean"];
let ANNI = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
let MESI = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

// finestra di 1440x900px
let altezza_header = 57;
let y_centro = 453; // linea centrale delle bolle
let meta_altezza = 175; // metà dello spazio verticale delle bolle per capire dove sono centrate e distribuirle sopra e sotto

// pallini dentro le bolle (secondo le misure del mockup)
let diametro_grande = 8; // 10 persone
let diametro_piccolo = 3; // 1 persona
let area_grande = 121; // spazio occupato da un pallino grande
let area_piccolo = 30; // spazio occupato da un pallino piccolo

let altezza_menu = 65; // altezza dell'header nel CSS
let passo = 11; // distanza tra i pallini
let bolla_sopra = -1; // -1 = nessuna

// colori
let bianco = "#e9eef5";
let chiaro = "#bcc9d8";
let scuro = "#0b1626";
let grigio_scuro = "#4a5a70";
let blu_notte = "#16294a"; // bolle
let rosso = "#de4c55"; // confirmed dead
let bordo = "#5d7699"; // bordo dei bottoni degli anni

async function setup() {
  createCanvas(windowWidth, windowHeight - altezza_menu);
  angleMode(DEGREES);
  data = await loadTable("assets/mediterraneo.csv", ",", "header"); 

  let parametri = getURLParams();

  /* devo decodificare la rotta perché nell'URL i caratteri speciali sono codificati
  ed altrimenti arriverebbero come "Western%20Mediterranean" e non "Western Mediterranean" 
  dovendoli poi confrontare con .getString non arriverebbero i risultati */
  if (parametri.rotta) {
    let richiesta = decodeURIComponent(parametri.rotta);
    for (let r = 0; r < ROTTE.length; r++) {
      if (ROTTE[r] == richiesta) {
        rotta = richiesta;
      }
    }
  }

  // controllo che il parametro anno sia stato fornito
  if (parametri.anno) {
    // converto in numero intero e lo memorizzo come "richiesto"
    let richiesto = int(parametri.anno);
    // controllo che il numero sia compreso tra il primo e l'ultimo anno della lista ANNI
    if (richiesto >= ANNI[0] && richiesto <= ANNI[ANNI.length - 1]) {
      anno = richiesto; // se è valido lo memorizzo come anno corrente
    }
  }

  // versione provvisoria
  for (let i = 0; i < data.getRowCount(); i++) {
    let riga = data.getRow(i);
    if (riga.getString("migration route") == rotta) {
      incidentiRotta.push(riga);
      if (numero(riga, "incident year") == anno) {
        bolle.push(nuovaBolla(riga));
      }
    }
  }
  disponiBolle();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - altezza_menu);
  disponiBolle();
}

// cerchio vuoto = 10 persone, punto = 1 persona
function nuovaBolla(riga) {
  let totale = numero(riga, "total number of dead and missing");
  let morti = min(numero(riga, "number of dead"), totale); // in 3 righe i dispersi sono negativi
  let dispersi = totale - morti;

  let pallini = [];
  aggiungiPallini(pallini, floor(morti / 10), true, true);
  aggiungiPallini(pallini, morti % 10, false, true);
  aggiungiPallini(pallini, floor(dispersi / 10), true, false);
  aggiungiPallini(pallini, dispersi % 10, false, false);

  let colonne = max(1, ceil(sqrt(pallini.length)));
  let righe = ceil(pallini.length / colonne);
  for (let i = 0; i < pallini.length; i++) {
    pallini[i].x = (i % colonne - (colonne - 1) / 2) * passo;
    pallini[i].y = (floor(i / colonne) - (righe - 1) / 2) * passo;
  }

  return {
    id: riga.getString("main id"),
    pallini: pallini,
    raggioBase: (colonne * passo) / 2 * 1.42 + 4,
    x: 0, y: 0, raggio: 0, s: 1,
  };
}

// cella vuota = 0
function numero(riga, colonna) {
  let valore = riga.getString(colonna);
  if (valore == "") {
    return 0;
  }
  return int(valore);
}

function aggiungiPallini(pallini, quanti, grande, morto) {
  for (let i = 0; i < quanti; i++) {
    pallini.push({ grande: grande, morto: morto, x: 0, y: 0 });
  }
}

// in fila, a capo a fine riga; se non ci stanno, più piccole
function disponiBolle() {
  let sy = scalaY();
  let alto = 170 * sy;
  let basso = height - 30 * sy;
  let s = scala();
  for (let prova = 0; prova < 30; prova++) {
    let x = margine();
    let y = alto;
    let altezzaRiga = 0;
    for (let i = 0; i < bolle.length; i++) {
      let b = bolle[i];
      let d = b.raggioBase * 2 * s;
      if (x + d > width - margine()) {
        x = margine();
        y = y + altezzaRiga + 8 * s;
        altezzaRiga = 0;
      }
      b.s = s;
      b.raggio = d / 2;
      b.x = x + d / 2;
      b.y = y + d / 2 - y_centro * sy; // y dalla linea centrale
      x = x + d + 8 * s;
      altezzaRiga = max(altezzaRiga, d);
    }
    if (y + altezzaRiga <= basso) {
      return;
    }
    s = s * 0.9;
  }
}

function draw() {
  clear();
  textFont("dm-sans");
  textAlign(LEFT, TOP);
  noStroke();
  if (incidentiRotta.length == 0) {
    return;
  }

  disegnaTitolo();
  disegnaBolle();

  // dopo le bolle, così sta davanti
  bolla_sopra = bollaSotto();
  if (bolla_sopra >= 0) {
    let b = bolle[bolla_sopra];
    noFill();
    stroke(bianco);
    strokeWeight(1.5);
    circle(b.x, y_centro * scalaY() + b.y, b.raggio * 2 + 6);
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}

function disegnaTitolo() {
  let s = scala();
  noStroke();
  fill(bianco);
  textSize(58 * s);
  textWeight(700);
  text(rotta, margine(), 40 * s);
  fill(chiaro);
  textSize(38 * s);
  textWeight(400);
  text("Incidents in " + anno, margine(), 108 * s);
}

// -1 se nessuna
function bollaSotto() {
  for (let i = 0; i < bolle.length; i++) {
    let b = bolle[i];
    let dx = mouseX - b.x;
    let dy = mouseY - (y_centro * scalaY() + b.y);
    if (dx * dx + dy * dy < b.raggio * b.raggio) {
      return i;
    }
  }
  return -1;
}

function mousePressed() {
  let i = bollaSotto();
  if (i >= 0) {
    window.location.href = "livello-3.html?id=" + bolle[i].id;
  }
}
function scala() {
  return min(width / 1440, height / 900);
}

function scalaY() {
  return height / 900;
}

function margine() {
  return width * 0.0278;
}

function disegnaBolle() {
    let sy = scalaY();
    for (let i = 0; i < bolle.length; i++) {
    let b = bolle[i];
    let cy = y_centro * sy + b.y;
    noStroke();
    fill(blu_notte);
    circle(b.x, cy, b.raggio * 2);
    for (let j = 0; j < b.pallini.length; j++) {
      disegnaPallino(b.pallini[j], b.x + b.pallini[j].x * b.s, cy + b.pallini[j].y * b.s, b.s);
    }
  }
}

// pallino da 10: cerchio vuoto; pallino da 1: punto pieno. rosso = confirmed dead, chiaro = assumed to be dead
function disegnaPallino(p, x, y, s) {
  let colore = chiaro;
  if (p.morto) {
    colore = rosso;
  }
  if (p.grande) {
    noFill();
    stroke(colore);
    strokeWeight(1.1 * s);
    circle(x, y, diametro_grande * s);
  } else {
    noStroke();
    fill(colore);
    circle(x, y, diametro_piccolo * s);
  }
}