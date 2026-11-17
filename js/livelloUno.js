let data;
let rotte = [
  "Western Mediterranean",
  "Central Mediterranean",
  "Eastern Mediterranean",
];

let anno = [
  "2014",
  "2015",
  "2016",
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
];

async function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  data = await loadTable("assets/mediterraneo.csv", ",", "header"); //carico il dataset
}

function mioGlifo(x, y) {
  push(); //salva il tutto
  fill("#060E1A");
  translate(x, y);
  circle(0, 0, 50);
  pop(); //rimette tutto com'era
}

function draw() {
  clear();
  noStroke();
  textFont("dm-sans");
  textWeight(400);
  textSize(12);
  fill("#e9eef1");
  let margine = width * 0.0278; //margine sx e dx
  let xInizio = width * 0.174; //inizio griglia
  let xFine = width * 0.951; //fine griglia
  let yInizio = 200; //altezza a cui si trova la prima rotta
  let passoY = 150; //distanza tra una rotta e l'altra

  for (let r = 0; r < 3; r++) {
    //parto da zero finché r è minore di 3 e aggiungo 1; per le 3 righe
    let y = yInizio + r * passoY; //partenza yInizio + quante righe passano * distanza tra le righe; ogni giro la riga scende di 150px
    noStroke();
    textSize(17);
    text(rotte[r], margine, y + 4); //[r] richiama l'array delle rotte, posizionate a partire da margine sx un po' più in basso

    for (let a = 0; a < 13; a++) {
      //parto da zero finché a è minore di 13 e aggiungo 1; per le
      let x = map(a, 0, 12, xInizio, xFine); //distribuisce i 13 anni da xInizio a xFine
      mioGlifo(x, y);
    }
  }
  push();
  textAlign(CENTER, CENTER);
  for (let a = 0; a < 13; a++) {
    let x = map(a, 0, 12, xInizio, xFine);
    text(anno[a], x, yInizio + 3 * passoY); //x della colonna, una riga sotto l'ultima rotta
  }
  pop();
}
