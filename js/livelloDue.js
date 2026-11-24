// LIVELLO 2 · gli incidenti di una rotta in un anno
/* rotta e anno arrivano dall'indirizzo della pagina, il prof
consiglia di usare la funzione getURLParams   */

let data; // tabella del CSV

async function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  data = await loadTable("assets/mediterraneo.csv", ",", "header"); 

  let parametri = getURLParams();
}

