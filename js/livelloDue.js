// LIVELLO 2 · gli incidenti di una rotta in un anno
/* rotta e anno arrivano dall'indirizzo della pagina, il prof
consiglia di usare la funzione getURLParams   */

let data; // tabella del CSV

let ROTTE = ["Western Mediterranean", "Central Mediterranean", "Eastern Mediterranean"];
let ANNI = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
let MESI = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

// colori
let BIANCO = "#e9eef5";
let CHIARO = "#bcc9d8";
let SCURO = "#0b1626";
let GRIGIO_SCURO = "#4a5a70";
let BLU_NOTTE = "#16294a"; // bolle
let ROSSO = "#de4c55"; // confirmed dead
let BORDO = "#5d7699"; // bordo dei bottoni degli anni

async function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  data = await loadTable("assets/mediterraneo.csv", ",", "header"); 

  let parametri = getURLParams();
}

