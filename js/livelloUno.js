let data;
let rotte = [
  "Mediterraneo occidentale",
  "Mediterraneo centrale",
  "Mediterraneo orientale",
];

async function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  data = await loadTable("assets/mediterraneo.csv", ",", "header"); //carico il dataset
}

function mioGlifo(x, y) {
  push();
  fill(255, 0, 0);
  translate(x, y);
  circle(0, 0, 20);
  pop();
}

function draw() {
  clear();
  noStroke();
  textSize(12);
  fill("#e9eef1");
  let margine = width * 0.0278; //margine sx e dx
  let xInizio = width * 0.174; //inizio griglia
  let xFine = width * 0.951; //fine griglia
  let yInizio = 200; //altezza a cui si trova la prima rotta
  let passoY = 150; //distanza tra una rotta e l'altra

  for (let r = 0; r > 3; r++) {
    y = yInizio + r * passoY
  }
}
