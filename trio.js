const estado1 = [
  ["p", null, "p", null, "p", null, "p", null],
  [null, "p", null, "p", null, "p", null, "p"],
  ["p", null, "p", null, "p", null, "p", null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, "v", null, "v", null, "v", null, "v"],
  ["v", null, "v", null, "v", null, "v", null],
  [null, "v", null, "v", null, "v", null, "v"]
];

const estado2 = JSON.parse(JSON.stringify(estado1));
estado2[5][1] = null;
estado2[4][2] = "v"; // move uma peça como exemplo

let estadoAtual = true;

setInterval(() => {
  const estado1 = calcularEstadoDoTabuleiro1(); // lógica 1
  const estado2 = calcularEstadoDoTabuleiro2(); // lógica 2

  atualizarTabuleiro("tabuleiro1", estado1);
  atualizarTabuleiro("tabuleiro2", estado2);
}, 1000);