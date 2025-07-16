// globais
let estadoInicial = null;
let estadoAtual1 = null;
let estadoAtual2 = null;
let executando = false;
let intervaloExecucao = null;

// contadores de iteração e tempo
let iteracoes1 = 0;
let iteracoes2 = 0;
let inicioTempo1 = null;
let inicioTempo2 = null;

// Flags para controlar se um tabuleiro já encontrou a solução
let tabuleiro1Resolvido = false;
let tabuleiro2Resolvido = false;

// estado inicial aleatório
function criarEstadoInicial() {
    const estado = Array(8).fill().map(() => Array(8).fill('')); // matriz 8x8
    const posicoesDisponiveis = []; // armazena coordenadas

    // gerar todas posições possíveis
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            posicoesDisponiveis.push([i, j]);
        }
    }

    // embaralhar posições de forma mais simples
    const posicoesEmbaralhadas = posicoesDisponiveis.sort(() => Math.random() - 0.5);

    // Posicionar 8 rainhas
    for (let i = 0; i < 8; i++) {
        const [linha, coluna] = posicoesEmbaralhadas[i];
        estado[linha][coluna] = 'Q';
    }

    return estado;
}

// --- Funções de Renderização e Controle de UI ---

function criarTabuleiro(id) {
    const tabuleiro = document.getElementById(id);
    tabuleiro.innerHTML = ''; // limpa limpa

    for (let linha = 0; linha < 8; linha++) {
        for (let coluna = 0; coluna < 8; coluna++) {
            const casa = document.createElement("div"); // cada div uma casa
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

    casas.forEach(casa => { // percorre array
        casa.innerHTML = "";
        const linha = parseInt(casa.dataset.linha); // converte string em inteiro
        const coluna = parseInt(casa.dataset.coluna);
        const valor = estado[linha][coluna];

        if (valor === "Q") {
            const rainha = document.createElement("div");
            rainha.classList.add("rainha");
            casa.appendChild(rainha);
        }
    });
}

// Função para atualizar as informações de iterações e tempo na interface
// tempoExibido deve ser uma string formatada (ex: '12.34')
function atualizarInfo(idInfo, iteracoes, tempoExibido) {
    const info = document.getElementById(idInfo);
    info.innerHTML = `
        <p><strong>Iterações:</strong> ${iteracoes}</p>
        <p><strong>Tempo:</strong> ${tempoExibido} s</p>
    `;
}

// Inicia/pausa a execução da simulação
function iniciarPausarExecucao() {
    const botao = document.getElementById('controle-btn');

    if (!executando) {
        executando = true;
        botao.textContent = 'Pausar';
        botao.classList.add('executando');

        // Marca o tempo inicial se ainda não marcado E se o tabuleiro não foi resolvido ainda
        if (inicioTempo1 === null && !tabuleiro1Resolvido) inicioTempo1 = performance.now();
        if (inicioTempo2 === null && !tabuleiro2Resolvido) inicioTempo2 = performance.now();

        // Configura o loop de execução da simulação
        intervaloExecucao = setInterval(() => {
            // Lógica para o Tabuleiro 1 (Método Trio)
            // Só executa se o tabuleiro ainda não estiver resolvido
            if (!tabuleiro1Resolvido) {
                // Chama o método `proximoEstadoTrio` (definido em proximoEstadoTrio.js)
                const novoEstado1 = proximoEstadoTrio(estadoAtual1); 
                
                // Verifica se o NOVO estado é uma solução
                if (verificarSolucao(novoEstado1)) {
                    tabuleiro1Resolvido = true; // Marca como resolvido
                    const tempoDecorrido = (performance.now() - inicioTempo1) / 1000;
                    atualizarInfo("info1", iteracoes1, tempoDecorrido.toFixed(2)); // Atualiza info com tempo final
                    console.log(`🎉 Solução encontrada para o Tabuleiro 1 em ${iteracoes1} iterações!`);
                    console.log(`⏱️ Tabuleiro 1 (Trio) resolveu em ${tempoDecorrido.toFixed(3)} segundos.`);
                } else { 
                    iteracoes1++; // Incrementa iterações apenas se AINDA buscando
                    // Atualiza informações de iterações e tempo parcial
                    atualizarInfo("info1", iteracoes1, ((performance.now() - inicioTempo1) / 1000).toFixed(2));
                }
                estadoAtual1 = novoEstado1; // Atualiza o estado global para o próximo ciclo
                atualizarTabuleiro("tabuleiro1", estadoAtual1); // Redesenha o tabuleiro
            }

            // Lógica para o Tabuleiro 2 (Método Dupla) - similar ao Tabuleiro 1
            if (!tabuleiro2Resolvido) {
                // Chama o método `proximoEstadoDupla` (definido em proximoEstadoDupla.js)
                const novoEstado2 = proximoEstadoDupla(estadoAtual2);

                if (verificarSolucao(novoEstado2)) {
                    tabuleiro2Resolvido = true;
                    const tempoDecorrido = (performance.now() - inicioTempo2) / 1000;
                    atualizarInfo("info2", iteracoes2, tempoDecorrido.toFixed(2));
                    console.log(`🎉 Solução encontrada para o Tabuleiro 2 em ${iteracoes2} iterações!`);
                    console.log(`⏱️ Tabuleiro 2 (Dupla) resolveu em ${tempoDecorrido.toFixed(3)} segundos.`);
                } else { 
                    iteracoes2++;
                    atualizarInfo("info2", iteracoes2, ((performance.now() - inicioTempo2) / 1000).toFixed(2));
                }
                estadoAtual2 = novoEstado2;
                atualizarTabuleiro("tabuleiro2", estadoAtual2);
            }

            // Se ambos os tabuleiros encontraram uma solução, pausa a simulação automaticamente
            if (tabuleiro1Resolvido && tabuleiro2Resolvido) {
                if (executando) { 
                    console.log("Ambos os tabuleiros encontraram uma solução. Pausando simulação.");
                    iniciarPausarExecucao(); // Chama a função para pausar
                }
            }

        }, 500); // Intervalo de 0.5 segundo entre cada passo da simulação
    } else {
        // Lógica para pausar a execução
        executando = false;
        botao.textContent = 'Continuar';
        botao.classList.remove('executando');

        if (intervaloExecucao) {
            clearInterval(intervaloExecucao); // Para o loop de repetição
            intervaloExecucao = null;
        }
    }
}

// Reinicia o jogo para um novo estado inicial
function reiniciarJogo() {
    // Pausa a execução se estiver rodando antes de reiniciar
    if (executando) {
        iniciarPausarExecucao();
    }

    // Regera um novo estado inicial aleatório para a simulação
    estadoInicial = criarEstadoInicial();
    // Cria cópias independentes do estado inicial para ambos os tabuleiros
    estadoAtual1 = JSON.parse(JSON.stringify(estadoInicial));
    estadoAtual2 = JSON.parse(JSON.stringify(estadoInicial));

    // Reseta todos os contadores e flags de resolução
    iteracoes1 = 0;
    iteracoes2 = 0;
    inicioTempo1 = null; // Reseta o tempo de início
    inicioTempo2 = null;
    tabuleiro1Resolvido = false; // Permite que a simulação comece novamente para ambos
    tabuleiro2Resolvido = false;

    // Atualiza a visualização dos tabuleiros com o novo estado inicial
    atualizarTabuleiro("tabuleiro1", estadoAtual1);
    atualizarTabuleiro("tabuleiro2", estadoAtual2);
    // Reinicia as informações exibidas para 0 iterações e tempo "0.00"
    atualizarInfo("info1", 0, '0.00'); 
    atualizarInfo("info2", 0, '0.00'); 

    console.clear(); // Limpa o console do navegador para uma nova rodada de logs
    console.log("Jogo reiniciado! Novos estados iniciais gerados.");
}

// Bloco de código que executa quando o DOM (estrutura HTML) estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    // Cria o container HTML para os botões de controle
    const controles = document.createElement('div');
    controles.id = 'controles';

    // Cria o botão "Iniciar Simulação" / "Pausar"
    const controleBtn = document.createElement('button');
    controleBtn.id = 'controle-btn';
    controleBtn.className = 'controle-btn';
    controleBtn.textContent = 'Iniciar Simulação';

    // Cria o botão "Reiniciar Jogo"
    const reiniciarBtn = document.createElement('button');
    reiniciarBtn.id = 'reiniciar-btn';
    reiniciarBtn.className = 'controle-btn';
    reiniciarBtn.textContent = 'Reiniciar Jogo';

    // Adiciona os botões ao container de controles
    controles.appendChild(controleBtn);
    controles.appendChild(reiniciarBtn);

    // Encontra o elemento no HTML com o ID 'pai-tabuleiros'
    const container = document.getElementById('pai-tabuleiros');
    // Insere o container de controles logo após o container dos tabuleiros no HTML
    container.parentNode.insertBefore(controles, container.nextSibling);

    // Adiciona "escutadores" de eventos de clique aos botões, associando-os às suas funções
    controleBtn.addEventListener('click', iniciarPausarExecucao);
    reiniciarBtn.addEventListener('click', reiniciarJogo);

    // Configuração inicial do jogo quando a página carrega
    estadoInicial = criarEstadoInicial(); // Gera o primeiro estado aleatório das rainhas
    estadoAtual1 = JSON.parse(JSON.stringify(estadoInicial)); // Copia para o Tabuleiro 1
    estadoAtual2 = JSON.parse(JSON.stringify(estadoInicial)); // Copia para o Tabuleiro 2

    // Cria a representação visual dos tabuleiros no HTML
    criarTabuleiro("tabuleiro1");
    criarTabuleiro("tabuleiro2");
    // Atualiza os tabuleiros para mostrar as rainhas nas suas posições iniciais
    atualizarTabuleiro("tabuleiro1", estadoAtual1);
    atualizarTabuleiro("tabuleiro2", estadoAtual2);

    // Cria os elementos DIV para exibir as informações de iterações e tempo
    // Garanta que você tenha estilos CSS para '.info-tabuleiro' e '.rainha'
    const infoContainer1 = document.createElement('div');
    infoContainer1.id = 'info1';
    infoContainer1.className = 'info-tabuleiro';
    // Insere o container de informações após os botões de controle
    controles.parentNode.insertBefore(infoContainer1, controles.nextSibling);

    const infoContainer2 = document.createElement('div');
    infoContainer2.id = 'info2';
    infoContainer2.className = 'info-tabuleiro';
    // Insere o segundo container de informações após o primeiro
    controles.parentNode.insertBefore(infoContainer2, infoContainer1.nextSibling);

    // Atualiza as informações iniciais na tela (0 iterações, tempo '0.00')
    atualizarInfo("info1", 0, '0.00'); 
    atualizarInfo("info2", 0, '0.00'); 
});