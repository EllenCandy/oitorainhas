function gerarEstadoComRainhasPretas() {
  const estado = Array.from({ length: 8 }, () => Array(8).fill(null));
  const casasEscuras = [];

  for (let linha = 0; linha < 8; linha++) {
    for (let coluna = 0; coluna < 8; coluna++) {
      if ((linha + coluna) % 2 !== 0) {
        casasEscuras.push([linha, coluna]);
      }
    }
  }

  // Embaralha as casas escuras
  for (let i = casasEscuras.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [casasEscuras[i], casasEscuras[j]] = [casasEscuras[j], casasEscuras[i]];
  }

  // Coloca 8 rainhas pretas
  for (let i = 0; i < 8; i++) {
    const [linha, coluna] = casasEscuras[i];
    estado[linha][coluna] = "Q";
  }

  return estado;
}

// Atualiza os dois tabuleiros com estados aleatórios
setInterval(() => {
  const estado1 = gerarEstadoComRainhasPretas();
  const estado2 = gerarEstadoComRainhasPretas();

  atualizarTabuleiro("tabuleiro1", estado1);
  atualizarTabuleiro("tabuleiro2", estado2);
}, 1000);