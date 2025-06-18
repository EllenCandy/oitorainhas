function criarTabuleiro(id) {
  const tabuleiro = document.getElementById(id);
  for (let linha = 0; linha < 8; linha++) {
    for (let coluna = 0; coluna < 8; coluna++) {
      const casa = document.createElement("div");
      casa.classList.add("casa");
      const escura = (linha + coluna) % 2 !== 0;
      casa.classList.add(escura ? "escura" : "clara");
      casa.dataset.linha = linha;
      casa.dataset.coluna = coluna;
      tabuleiro.appendChild(casa);
    }
  }
}

function atualizarTabuleiro(id, estado) {
  const tabuleiro = document.getElementById(id);
  const casas = tabuleiro.querySelectorAll(".casa");

  casas.forEach(casa => {
    casa.innerHTML = "";
    const linha = parseInt(casa.dataset.linha);
    const coluna = parseInt(casa.dataset.coluna);
    const valor = estado[linha][coluna];

    if (valor === "Q") {
    const rainha = document.createElement("div");
    rainha.classList.add("rainha");
    casa.appendChild(rainha);
    }

  });
}

// Cria os dois tabuleiros
criarTabuleiro("tabuleiro1");
criarTabuleiro("tabuleiro2");
