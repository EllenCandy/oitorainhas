// Método simples: tenta mover uma rainha por vez para uma posição melhor na mesma coluna
let iteracoesTrio = 0; // Contador de iterações para o primeiro método

function proximoEstadoTrio(estadoAtual) {
    iteracoesTrio++; // Incrementa o contador de iterações a cada chamada

    // 1. Verificar se o estado atual já é uma solução
    if (verificarSolucao(estadoAtual)) {
        console.log(`🎉 Solução encontrada para o Tabuleiro 1 em ${iteracoesTrio} iterações!`);
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

    // Se por algum motivo não houver 8 rainhas (estado corrompido), reinicia ou trata erro
    if (rainhasPosicoes.length !== 8) {
        // Isso não deve acontecer com o seu criarEstadoInicial, mas é uma proteção
        console.warn("Estado inválido no Tabuleiro 1: número de rainhas incorreto. Reiniciando busca.");
        return criarEstadoInicial(); // Reinicia com um novo estado inicial
    }

    const [linhaRainha, colunaRainha] = rainhasPosicoes[Math.floor(Math.random() * rainhasPosicoes.length)];

    // 4. Mover a rainha para uma nova posição aleatória **dentro da mesma coluna**
    // Remove a rainha da posição atual
    novoEstado[linhaRainha][colunaRainha] = '';

    let novaLinhaRainha;
    do {
        novaLinhaRainha = Math.floor(Math.random() * 8);
    } while (novaLinhaRainha === linhaRainha); // Garante que a nova linha seja diferente da original

    // Coloca a rainha na nova posição na mesma coluna
    novoEstado[novaLinhaRainha][colunaRainha] = 'Q';

    // Opcional: Para evitar loops infinitos em estados "presos", podemos ter um limite de iterações
    // ou um mecanismo de "recomeçar". Por simplicidade, vamos deixar ele tentar continuamente por enquanto,
    // mas você pode adicionar:
    // if (iteracoesTrio > 10000) { console.log("Limite de iterações atingido, reiniciando..."); return criarEstadoInicial(); }

    return novoEstado; // Retorna o estado modificado
}

// --- Funções Auxiliares (Coloque estas no seu código principal, fora das funções de método) ---

// Função para contar conflitos (quantas rainhas se atacam)
function contarConflitos(estado) {
    let conflitos = 0;
    const rainhas = [];

    // Encontrar todas as posições das rainhas
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (estado[r][c] === 'Q') {
                rainhas.push([r, c]);
            }
        }
    }

    // Para cada rainha, verificar conflitos com as rainhas seguintes
    for (let i = 0; i < rainhas.length; i++) {
        for (let j = i + 1; j < rainhas.length; j++) {
            const [r1, c1] = rainhas[i];
            const [r2, c2] = rainhas[j];

            // Conflito na mesma linha
            if (r1 === r2) {
                conflitos++;
            }
            // Conflito na mesma coluna
            if (c1 === c2) {
                conflitos++;
            }
            // Conflito na mesma diagonal (abs(r1-r2) == abs(c1-c2))
            if (Math.abs(r1 - r2) === Math.abs(c1 - c2)) {
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