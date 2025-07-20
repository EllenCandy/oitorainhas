// Método "Vizinho Melhor": tenta mover uma rainha para a melhor posição na coluna
let iteracoesDupla = 0; // Contador de iterações para o segundo método

function proximoEstadoDupla(estadoAtual) {
    iteracoesDupla++; // Incrementa o contador de iterações a cada chamada

    // 1. Verificar se o estado atual já é uma solução
    if (verificarSolucao(estadoAtual)) {
        console.log(`🎉 Solução encontrada para o Tabuleiro 2 em ${iteracoesDupla} iterações!`);
        return estadoAtual; // Retorna o estado atual se for uma solução
    }

    // 2. Criar uma cópia do estado
    let melhorEstadoVizinho = JSON.parse(JSON.stringify(estadoAtual));
    let menorConflitos = contarConflitos(estadoAtual);

    // 3. Para cada coluna, tente mover a rainha para a melhor posição possível
    for (let coluna = 0; coluna < 8; coluna++) {
        let linhaRainhaAtual = -1;
        // Encontrar a rainha nesta coluna
        for (let r = 0; r < 8; r++) {
            if (estadoAtual[r][coluna] === 'Q') {
                linhaRainhaAtual = r;
                break;
            }
        }

        if (linhaRainhaAtual === -1) continue; // Não há rainha nesta coluna (não deve acontecer com 8 rainhas)

        // Tentar cada linha nesta coluna
        for (let novaLinha = 0; novaLinha < 8; novaLinha++) {
            // Criar um estado temporário para testar o movimento
            const estadoTeste = JSON.parse(JSON.stringify(estadoAtual));
            estadoTeste[linhaRainhaAtual][coluna] = ''; // Remove a rainha da posição original
            estadoTeste[novaLinha][coluna] = 'Q'; // Coloca na nova posição

            const conflitosVizinho = contarConflitos(estadoTeste);

            // Se encontrarmos um estado vizinho melhor (ou igual, para explorar)
            if (conflitosVizinho < menorConflitos) {
                menorConflitos = conflitosVizinho;
                melhorEstadoVizinho = estadoTeste;
            }
        }
    }

    // 4. Se encontrou um movimento que reduz conflitos, faz o movimento.
    if (menorConflitos < contarConflitos(estadoAtual)) {
        return melhorEstadoVizinho;
    } else {
        // Se não houver movimento que melhore, faz um movimento aleatório para tentar sair de um "plató"
        // (Isso evita que o algoritmo fique preso em um estado sem melhorias)
        console.log("Tabuleiro 2 preso em platô, fazendo movimento aleatório para tentar sair.");
        return moverRainhaAleatoria(estadoAtual);
    }
}

// --- Função Auxiliar Específica para proximoEstadoDupla (coloque junto com ela) ---

// Função para mover uma rainha aleatória para uma posição aleatória (para sair de platôs)
function moverRainhaAleatoria(estado) {
    const novoEstado = JSON.parse(JSON.stringify(estado));

    const rainhasPosicoes = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (novoEstado[r][c] === 'Q') {
                rainhasPosicoes.push([r, c]);
            }
        }
    }

    const [linhaRainha, colunaRainha] = rainhasPosicoes[Math.floor(Math.random() * rainhasPosicoes.length)];

    novoEstado[linhaRainha][colunaRainha] = ''; // Remove a rainha

    let novaLinha, novaColuna;
    do {
        novaLinha = Math.floor(Math.random() * 8);
        novaColuna = Math.floor(Math.random() * 8);
    } while (novoEstado[novaLinha][novaColuna] === 'Q'); // Garante que não caia em outra rainha

    novoEstado[novaLinha][novaColuna] = 'Q'; // Coloca na nova posição

    return novoEstado;
}