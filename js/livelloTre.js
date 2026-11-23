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

function conSpazi(testo) {
  let pezzi = testo.split(",");
  let risultato = pezzi[0];
  for (let i = 1; i < pezzi.length; i++) {
    risultato = risultato + ", " + pezzi[i];
  }
  return risultato;
}
