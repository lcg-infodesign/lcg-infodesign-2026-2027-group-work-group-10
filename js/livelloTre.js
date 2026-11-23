//il livello 3 mostra un incidente specifico. 1 pallino è una persona.

let data; //dataset
let riga; //riga incidente scelto
let altezzaHeader = 15; //spazio tra menu e testi
let bianco = "#e9eef5"; //colore testi principali
let grigio = "#8a99ae"; // colore testi secondari
let linkSopra = false;

let rotteMaiuscolo = {
  "Western Mediterranean": "WESTERN MEDITERRANEAN",
  "Central Mediterranean": "CENTRAL MEDITERRANEAN",
  "Eastern Mediterranean": "EASTERN MEDITERRANEAN",
};

async function setup() {
  createCanvas(windowWidth, windowHeight);
  data = await loadTable("assets/mediterraneo.csv", ",", "header");

  let parametri = getURLParams();
  let id = parametri.id || "2023.MMP0097";

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

  let yLegenda = altezzaHeader + 248 * s;
  fill(grigio);
  circle(m + 5.4 * s, yLegenda + 10 * s, 10.8 * s);
  fill(bianco);
  textSize(22 * s);
  text("= 1 person", m + 24 * s, yLegenda);
}

function mousePressed() {
  if (linkSopra) {
    let myURL =
      "livello-2.html?rotta=" +
      riga.getString("migration route") +
      "&anno=" +
      riga.getString("incident year");
    window.location.href = myURL;
  }
}
