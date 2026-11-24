//il livello 3 mostra un incidente specifico. 1 pallino è una persona.

let data; //dataset
let riga; //riga incidente scelto
let altezzaHeader = 15; //spazio tra menu e testi
let bianco = "#e9eef5"; //colore testi principali
let grigio = "#8a99ae"; // colore testi secondari
let linkSopra = false;

let altezzaMenu = 65; // altezza dell'header nel CSS
let vista = "dead";
let viste = ["dead", "children", "sex"];
let testiBottoni = ["confirmed dead / assumed to be dead", "children", "sex"];
let rosso = "#de4c55";
let verde = "#2bb38a";
let viola = "#a584e8";
let salvia = "#9cbf62";
let ombra = "#34475f";

let rotteMaiuscolo = {
  "Western Mediterranean": "WESTERN MEDITERRANEAN",
  "Central Mediterranean": "CENTRAL MEDITERRANEAN",
  "Eastern Mediterranean": "EASTERN MEDITERRANEAN",
};

async function setup() {
  createCanvas(windowWidth, windowHeight - altezzaMenu);
  data = await loadTable("assets/mediterraneo.csv", ",", "header");

  let parametri = getURLParams();
  let id = parametri.id || "2015.MMP00108";

  riga = data.findRow(id, "main id");
}

function draw() {
  clear();
  textFont("dm-sans");
  textAlign(LEFT, TOP);
  noStroke();
  let s = min(width / 1440, height / 900); //variaile che vale il valore più piccolo tra quelli inseriti
  let m = width * 0.0278; //m vale il 2.78% della larghezza
  let link =
    "← " +
    rotteMaiuscolo[riga.getString("migration route")] +
    " " +
    riga.getString("incident year");

  textSize(max(12 * s, 10));
  linkSopra =
    mouseX > m &&
    mouseX < m + textWidth(link) &&
    mouseY > altezzaHeader + 20 * s &&
    mouseY < altezzaHeader + 38 * s;

  if (linkSopra) {
    fill(bianco);
  } else {
    fill(grigio);
  }

  text(link, m, altezzaHeader + 22 * s);

  let dataIncidente = riga.getString("incident date");
  let parti = dataIncidente.split("-");
  let titolo = int(parti[2]) + " " + riga.getString("month") + " " + parti[0];
  fill(bianco);
  textSize(58 * s);
  text(titolo, m, altezzaHeader + 51 * s);

  let paese = riga.getString("country of incident");
  fill(grigio);
  textSize(38 * s);
  text(paese, m, altezzaHeader + 110 * s);

  let totale = riga.getNum("total number of dead and missing");
  textAlign(RIGHT, TOP);
  fill(bianco);
  textSize(92 * s);
  text(totale, width - m, altezzaHeader + 41 * s);

  textSize(22 * s);
  if (totale == 1) {
    text("victim", width - m, altezzaHeader + 122 * s);
  } else {
    text("victims", width - m, altezzaHeader + 122 * s);
  }
  textAlign(LEFT, TOP);

  let yLegenda = altezzaHeader + 230 * s;
  fill(grigio);
  circle(m + 5.8 * s, yLegenda + 7 * s, 10.8 * s);
  fill(bianco);
  textSize(16 * s);
  text("= 1 person", m + 24 * s, yLegenda);

  let yCampi = height - 193 * s;
  let k = (width - 2 * m) / 1360;
  fill(grigio);
  textSize(max(12 * s, 10));
  text("LOCATION OF INCIDENT", m, yCampi);
  text("CAUSE OF DEATH", m + 375 * k, yCampi);
  text("COUNTRY OF ORIGIN", m + 631 * k, yCampi);
 
  let luogo = riga.getString("location of incident");

  if (luogo == "") {
    luogo = "Not recorded";
  }
  fill(bianco);
  textSize(max(15 * s, 12));
  textLeading(max(21.7 * s, 17));
  text(luogo, m, yCampi + 23 * s, 340 * k, height - yCampi - 43 * s);

  let causa = riga.getString("cause of death");
  if (causa == "") {
    causa = "Not recorded";
  }
  fill(bianco);
  textSize(max(15 * s, 12));
  textLeading(max(21.7 * s, 17));
  text(
    conSpazi(causa),
    m + 375 * k,
    yCampi + 23 * s,
    220 * k,
    height - yCampi - 43 * s,
  );

  let origine = riga.getString("country of origin");
  if (origine == "") {
    origine = "Not recorded";
  }
  text(
    conSpazi(origine),
    m + 631 * k,
    yCampi + 23 * s,
    340 * k,
    height - yCampi - 43 * s,
  );

  disegnaFonte(s, m, k, yCampi);
  disegnaBottoni(s, m);
  disegnaPallini(s, yLegenda, yCampi);

  if (linkSopra || bottoneSotto() >= 0) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}

function mousePressed() {
  let b = bottoneSotto();
  if (b >= 0) {
    vista = viste[b];
  }

  if (linkSopra) {
    let myURL =
      "livello-2.html?rotta=" +
      riga.getString("migration route") +
      "&anno=" +
      riga.getString("incident year");
    window.location.href = myURL;
  }
}

function conSpazi(testo) {
  let pezzi = testo.split(",");
  let risultato = pezzi[0];
  for (let i = 1; i < pezzi.length; i++) {
    risultato = risultato + ", " + pezzi[i];
  }
  return risultato;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - altezzaMenu);
}

// come s e m in draw
function scalaPagina() {
  return min(width / 1440, height / 900);
}

function marginePagina() {
  return width * 0.0278;
}

// la pillola si adatta al testo
function larghezzaBottone(i) {
  let s = scalaPagina();
  textSize(max(15 * s, 11));
  return textWidth(testiBottoni[i]) + 38 * s;
}

function xBottone(i) {
  let s = scalaPagina();
  let x = marginePagina();
  for (let j = 0; j < i; j++) {
    x += larghezzaBottone(j) + 8 * s;
  }
  return x;
}

function yBottoni() {
  return altezzaHeader + 170 * scalaPagina();
}

// -1 se nessuno
function bottoneSotto() {
  let s = scalaPagina();
  let y = yBottoni();
  for (let i = 0; i < viste.length; i++) {
    let x = xBottone(i);
    if (mouseX > x && mouseX < x + larghezzaBottone(i) && mouseY > y && mouseY < y + 38 * s) {
      return i;
    }
  }
  return -1;
}

function disegnaBottoni(s, m) {
  let y = yBottoni();
  let h = 38 * s;
  textAlign(CENTER, CENTER);
  textSize(max(15 * s, 11));
  for (let i = 0; i < viste.length; i++) {
    let x = xBottone(i);
    let w = larghezzaBottone(i);
    if (viste[i] == vista) {
      noStroke();
      fill(bianco);
      rect(x, y, w, h, h / 2);
      fill("#0b1626");
    } else {
      noFill();
      strokeWeight(1);
      if (bottoneSotto() == i) {
        stroke(bianco);
      } else {
        stroke("#2c3d57");
      }
      rect(x, y, w, h, h / 2);
      noStroke();
      fill("#bcc9d8");
    }
    text(testiBottoni[i], x + w / 2, y + h / 2);
  }
  textAlign(LEFT, TOP);
}

// campo vuoto = 0
function numero(colonna) {
  let valore = riga.getString(colonna);
  if (valore == "") {
    return 0;
  }
  return int(valore);
}

function gruppiDellaVista() {
  let totale = numero("total number of dead and missing");
  let morti = min(numero("number of dead"), totale); // in 3 righe i dispersi sono negativi
  let dispersi = totale - morti;

  if (vista == "dead") {
    return [
      { n: morti, nome: "confirmed dead · body recovered", colore: rosso, vuoto: false },
      { n: dispersi, nome: "assumed to be dead", colore: grigio, vuoto: true },
    ];
  }

  if (vista == "children") {
    let bambini = min(numero("number of children"), totale);
    return [
      { n: bambini, nome: "children", colore: verde, vuoto: false },
      { n: totale - bambini, nome: "not recorded as children", colore: ombra, vuoto: false },
    ];
  }

  // a volte donne + uomini superano il totale
  let donne = min(numero("number of females"), totale);
  let uomini = min(numero("number of males"), totale - donne);
  return [
    { n: donne, nome: "females", colore: viola, vuoto: false },
    { n: uomini, nome: "males", colore: salvia, vuoto: false },
    { n: totale - donne - uomini, nome: "sex not recorded", colore: ombra, vuoto: false },
  ];
}

function disegnaPallini(s, yLegenda, yCampi) {
  let gruppi = gruppiDellaVista();
  let passo = 14 * s;
  let spazio = 68 * s;
  let alto = yLegenda + 30 * s;
  let basso = yCampi - 34 * s;
  let righeMax = max(1, floor((basso - alto - 82 * s) / passo));

  // stesse colonne per tutti i gruppi, così le altezze si confrontano
  let nMax = 0;
  for (let i = 0; i < gruppi.length; i++) {
    nMax = max(nMax, gruppi[i].n);
  }
  let colonne = max(1, ceil(sqrt(nMax)), ceil(nMax / righeMax));
  let righe = ceil(nMax / colonne);

  textSize(20 * s);
  let larghezzaTotale = 0;
  for (let i = 0; i < gruppi.length; i++) {
    let larghezzaGriglia = min(gruppi[i].n, colonne) * passo;
    gruppi[i].larghezza = max(larghezzaGriglia, 19 * s + textWidth(gruppi[i].nome));
    larghezzaTotale += gruppi[i].larghezza;
    if (i > 0) {
      larghezzaTotale += spazio;
    }
  }

  let altezzaBlocco = 82 * s + righe * passo;
  let y = max(alto, alto + (basso - alto - altezzaBlocco) / 2);
  let x = (width - larghezzaTotale) / 2;
  for (let i = 0; i < gruppi.length; i++) {
    disegnaGruppo(gruppi[i], x, y, colonne, s);
    x += gruppi[i].larghezza + spazio;
  }
}

function disegnaGruppo(gruppo, x, y, colonne, s) {
  let d = 10.8 * s;
  let passo = 14 * s;

  noStroke();
  fill(bianco);
  textSize(40 * s);
  text(conVirgole(gruppo.n), x, y);

  disegnaPallino(gruppo, x + d / 2, y + 63 * s, s);
  noStroke();
  if (gruppo.n > 0) {
    fill(bianco);
  } else {
    fill(grigio);
  }
  textSize(20 * s);
  text(gruppo.nome, x + 19 * s, y + 50 * s);

  for (let i = 0; i < gruppo.n; i++) {
    let colonna = i % colonne;
    let rigaGriglia = floor(i / colonne);
    disegnaPallino(gruppo, x + d / 2 + colonna * passo, y + 82 * s + d / 2 + rigaGriglia * passo, s);
  }
}

// assumed to be dead: solo contorno
function disegnaPallino(gruppo, x, y, s) {
  if (gruppo.vuoto) {
    noFill();
    stroke(gruppo.colore);
    strokeWeight(1.2 * s);
    circle(x, y, 9.6 * s);
  } else {
    noStroke();
    fill(gruppo.colore);
    circle(x, y, 10.8 * s);
  }
}

// 1022 -> "1,022"
function conVirgole(n) {
  if (n < 1000) {
    return "" + n;
  }
  let migliaia = floor(n / 1000);
  let resto = "" + (n % 1000);
  while (resto.length < 3) {
    resto = "0" + resto;
  }
  return migliaia + "," + resto;
}

function disegnaFonte(s, m, k, yCampi) {
  let x = m + 1006 * k;
  let larghezza = 340 * k;
  let interlinea = max(21.7 * s, 17);
  let righeMax = floor((height - yCampi - 43 * s) / interlinea) - 1; // una riga resta libera per i link

  noStroke();
  fill(grigio);
  textSize(max(12 * s, 10));
  text("INFORMATION SOURCE", x, yCampi);

  fill(bianco);
  textSize(max(15 * s, 12));
  let nomi = nomiFonti();
  let elencoRighe = ["Not recorded"];
  if (nomi.length > 0) {
    elencoRighe = righe(unisci(nomi, nomi.length), larghezza);
    // se non ci stanno: "and N more"
    for (let quanti = nomi.length - 1; quanti >= 1 && elencoRighe.length > righeMax; quanti--) {
      let testo = unisci(nomi, quanti) + " and " + (nomi.length - quanti) + " more";
      elencoRighe = righe(testo, larghezza);
    }
  }
  let y = yCampi + 23 * s;
  for (let i = 0; i < elencoRighe.length; i++) {
    text(elencoRighe[i], x, y);
    y += interlinea;
  }
}

function nomiFonti() {
  let pezzi = riga.getString("information source").split(",");
  let nomi = [];
  for (let i = 0; i < pezzi.length; i++) {
    aggiungiSeNuovo(nomi, senzaSpaziExtra(pezzi[i]));
  }
  return nomi;
}

function aggiungiSeNuovo(elenco, valore) {
  if (valore == "") {
    return;
  }
  for (let i = 0; i < elenco.length; i++) {
    if (elenco[i] == valore) {
      return;
    }
  }
  elenco.push(valore);
}

function senzaSpaziExtra(testo) {
  let parole = testo.split(" ");
  let risultato = "";
  for (let i = 0; i < parole.length; i++) {
    let pezzi = parole[i].split("\u00a0");
    for (let j = 0; j < pezzi.length; j++) {
      if (pezzi[j] != "") {
        if (risultato != "") {
          risultato = risultato + " ";
        }
        risultato = risultato + pezzi[j];
      }
    }
  }
  return risultato;
}

function unisci(nomi, quanti) {
  let risultato = nomi[0];
  for (let i = 1; i < quanti; i++) {
    risultato = risultato + ", " + nomi[i];
  }
  return risultato;
}

// a capo parola per parola
function righe(testo, larghezza) {
  let parole = [];
  let tutte = testo.split(" ");
  for (let i = 0; i < tutte.length; i++) {
    let pezzi = spezzaParola(tutte[i], larghezza);
    for (let j = 0; j < pezzi.length; j++) {
      parole.push(pezzi[j]);
    }
  }
  let elenco = [];
  let rigaAttuale = parole[0];
  for (let i = 1; i < parole.length; i++) {
    let prova = rigaAttuale + " " + parole[i];
    if (textWidth(prova) <= larghezza) {
      rigaAttuale = prova;
    } else {
      elenco.push(rigaAttuale);
      rigaAttuale = parole[i];
    }
  }
  elenco.push(rigaAttuale);
  return elenco;
}

// parole più larghe del campo (es. un url)
function spezzaParola(parola, larghezza) {
  let lettere = parola.split("");
  let pezzi = [];
  let pezzo = "";
  for (let i = 0; i < lettere.length; i++) {
    if (pezzo != "" && textWidth(pezzo + lettere[i]) > larghezza) {
      pezzi.push(pezzo);
      pezzo = "";
    }
    pezzo = pezzo + lettere[i];
  }
  pezzi.push(pezzo);
  return pezzi;
}
