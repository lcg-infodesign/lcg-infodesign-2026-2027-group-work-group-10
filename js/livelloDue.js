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

// colori
let bianco = "#e9eef5";
let chiaro = "#bcc9d8";
let scuro = "#0b1626";
let grigio_scuro = "#4a5a70";
let blu_notte = "#16294a"; // bolle
let rosso = "#de4c55"; // confirmed dead
let bordo = "#5d7699"; // bordo dei bottoni degli anni

async function setup() {
  createCanvas(windowWidth, windowHeight);
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
}

function draw() {
  clear();
  textFont("dm-sans");
  textAlign(LEFT, TOP);
  noStroke();
  if (incidentiRotta.length == 0) {
    return;
  }

  disegnaBolle();
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