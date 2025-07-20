// Funções Auxiliares para o Problema das Oito Rainhas
// Essas funções são independentes da UI e dos contadores específicos.

// Função para contar conflitos (quantas rainhas se atacam)
function contarConflitos(estado) {
    let conflitos = 0;

    // Para cada rainha, verificar conflitos com as rainhas seguintes
    for (let i = 0; i < 8; i++) {
        for (let j = i + 1; j < 8; j++) {
            if (estado[i] === estado[j]) {
                conflitos++;
            }

            // Conflito na mesma diagonal (abs(r1-r2) == abs(c1-c2))
            if (Math.abs(estado[i] - estado[j]) === Math.abs(i - j)) {
                conflitos++;
            }
        }
    }

    return conflitos;
}

// Função para verificar se um estado é uma solução (0 conflitos)
function verificarSolucao(estado) {
    return contarConflitos(estado) === 0;
}

// Função auxiliar para o método "Vizinho Melhor": move uma rainha aleatória para uma posição aleatória
// Usado para sair de platôs quando nenhuma melhora é encontrada.
function moverRainhaAleatoria(estado) {
    const novoEstado = JSON.parse(JSON.stringify(estado)); // Cria uma cópia profunda

    const rainhasPosicoes = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (novoEstado[r][c] === 'Q') {
                rainhasPosicoes.push([r, c]);
            }
        }
    }

    // Escolhe uma rainha aleatória para mover
    const [linhaRainha, colunaRainha] = rainhasPosicoes[Math.floor(Math.random() * rainhasPosicoes.length)];

    novoEstado[linhaRainha][colunaRainha] = ''; // Remove a rainha da posição atual

    let novaLinha, novaColuna;
    // Encontra uma nova posição aleatória que não seja ocupada por outra rainha
    do {
        novaLinha = Math.floor(Math.random() * 8);
        novaColuna = Math.floor(Math.random() * 8);
    } while (novoEstado[novaLinha][novaColuna] === 'Q'); // Garante que não caia em outra rainha

    novoEstado[novaLinha][novaColuna] = 'Q'; // Coloca a rainha na nova posição

    return novoEstado;
}

// --- Métodos de Simulação ---

// Método 1: Abordagem "Simples" (proximoEstadoTrio)
// Tenta mover uma rainha por vez para uma posição melhor na **mesma coluna**.
// Para quando encontra uma solução válida.
function proximoEstadoTrio(estadoAtual) {
    // 1. Verificar se o estado atual já é uma solução
    if (verificarSolucao(estadoAtual)) {
        return estadoAtual; // Retorna o estado atual se for uma solução
    }

    // 2. Criar uma cópia do estado para não modificar o original
    const novoEstado = JSON.parse(JSON.stringify(estadoAtual));

    // 3. Encontrar uma rainha aleatória para mover
    const rainhasPosicoes = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (novoEstado[r][c] === 'Q') {
                rainhasPosicoes.push([r, c]);
            }
        }
    }

    // Proteção: se por algum motivo não houver 8 rainhas, reinicia com um novo estado
    if (rainhasPosicoes.length !== 8) {
        // Nota: Idealmente, criarEstadoInicial() também estaria aqui se fosse puramente lógico,
        // mas como ele envolve aleatoriedade e é o ponto de partida, o script.js o chamará.
        // Por agora, vamos retornar o estado atual para evitar erros, e o script.js vai tratar o reinício.
        return estadoAtual; // Ou você pode jogar um erro/avisar.
    }

    const [linhaRainha, colunaRainha] = rainhasPosicoes[Math.floor(Math.random() * rainhasPosicoes.length)];

    // 4. Mover a rainha para uma nova posição aleatória **dentro da mesma coluna**
    novoEstado[linhaRainha][colunaRainha] = ''; // Remove a rainha da posição atual

    let novaLinhaRainha;
    do {
        novaLinhaRainha = Math.floor(Math.random() * 8);
    } while (novaLinhaRainha === linhaRainha); // Garante que a nova linha seja diferente da original

    // Coloca a rainha na nova posição na mesma coluna
    novoEstado[novaLinhaRainha][colunaRainha] = 'Q';

    return novoEstado; // Retorna o estado modificado
}

// Método 2: Abordagem "Vizinho Melhor" (proximoEstadoDupla)
// Tenta mover uma rainha para a posição **dentro de sua própria coluna** que resulte no menor número de conflitos.
// Se não encontrar uma melhora, faz um movimento aleatório para tentar sair de um "plató".
// Para quando encontra uma solução.
function proximoEstadoDupla(estadoAtual) {
    // 1. Verificar se o estado atual já é uma solução
    if (verificarSolucao(estadoAtual)) {
        return estadoAtual;
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

        // Tentar cada linha nesta coluna para encontrar a melhor posição
        for (let novaLinha = 0; novaLinha < 8; novaLinha++) {
            // Criar um estado temporário para testar o movimento
            const estadoTeste = JSON.parse(JSON.stringify(estadoAtual));
            estadoTeste[linhaRainhaAtual][coluna] = ''; // Remove a rainha da posição original
            estadoTeste[novaLinha][coluna] = 'Q'; // Coloca na nova posição

            const conflitosVizinho = contarConflitos(estadoTeste);

            // Se encontrarmos um estado vizinho melhor, atualizamos
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
        // console.log("Tabuleiro 2 preso em platô, fazendo movimento aleatório para tentar sair."); // Removido para evitar spam no console
        return moverRainhaAleatoria(estadoAtual);
    }
}
