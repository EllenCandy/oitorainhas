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

function criarEstadoInicial() {
    const random = (lim) => {
        return Math.floor(Math.random() * lim);
    };

    let initial_state = [];

    for(let i = 0; i < 8; ++i){
        initial_state.push(random(7));
    }

    return initial_state;
}

function criarTabuleiro(id) {
    const tabuleiro = document.getElementById(id);
    tabuleiro.innerHTML = ''; // limpa limpa

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

function transpose(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

function atualizarTabuleiro(id, estado) {
    const tabuleiro = document.getElementById(id);

    tabuleiro.innerHTML = ''; // limpa limpa

    let matriz = [];

    for(let i = 0; i< 8; ++i){
        matriz.push([0,0,0,0,0,0,0]);
    }

    for(let linha = 0; linha < 8; ++linha){
        const coluna_rainha = estado[linha];

        for(let coluna = 0; coluna < 8; ++coluna){
            matriz[linha][coluna] = coluna_rainha == coluna ? 1 : 0;
        }
    }

    matriz = transpose(matriz);

    for (let linha = 0; linha < 8; linha++) {
        for(let coluna = 0; coluna < 8; ++coluna){
            const casa = document.createElement("div");
            const escura = (linha + coluna) % 2 !== 0;
            casa.classList.add(escura ? "escura" : "clara");

            if(matriz[linha][coluna] == 1){
                casa.classList.add("rainha");
            } else{
                casa.classList.add("casa");
            }

            tabuleiro.appendChild(casa);
        }
    }
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

        intervaloExecucao = setInterval(() => {
            estadoInicial = criarEstadoInicial();

            estadoAtual1 = JSON.parse(JSON.stringify(estadoInicial));

            const vec = new Module.Vector();
            for(let i = 0; i < 8; ++i){
                vec.push_back(estadoInicial[i]);
            }
            estadoAtual2 = vec;

            const inicioTempo1 = performance.now();

            if (!tabuleiro1Resolvido) {
                const novoEstado1 = proximoEstadoTrio(estadoAtual1); 
                
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

            //tabuleiro 2
            const inicioTempo2 = performance.now();
            const resultado = Module.hill_climbing(estadoAtual2);
            const tempoDecorrido = (performance.now() - inicioTempo2) / 1000;
            let vals = [];

            for(let i = 0; i < 8; ++i){
                vals.push(resultado.queens.get(i));
            }

            atualizarInfo("info2", resultado.iters, tempoDecorrido.toFixed(6));
            atualizarTabuleiro("tabuleiro2", vals); 

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

    estadoInicial = criarEstadoInicial();

    estadoAtual1 = JSON.parse(JSON.stringify(estadoInicial));

    const vec = new Module.Vector();
    for(let i = 0; i < 8; ++i){
        vec.push_back(estadoInicial[i]);
    }
    estadoAtual2 = vec;

    // Reseta todos os contadores e flags de resolução
    iteracoes1 = 0;
    iteracoes2 = 0;
    inicioTempo1 = null; // Reseta o tempo de início
    inicioTempo2 = null;
    tabuleiro1Resolvido = false; // Permite que a simulação comece novamente para ambos
    tabuleiro2Resolvido = false;

    // Atualiza a visualização dos tabuleiros com o novo estado inicial
    atualizarTabuleiro("tabuleiro1", estadoInicial);
    atualizarTabuleiro("tabuleiro2", estadoInicial);
    // Reinicia as informações exibidas para 0 iterações e tempo "0.00"
    atualizarInfo("info1", 0, '0.00'); 
    atualizarInfo("info2", 0, '0.00'); 

    console.clear(); // Limpa o console do navegador para uma nova rodada de logs
    console.log("Jogo reiniciado! Novos estados iniciais gerados.");
}

function startBoard(){
    const controles = document.createElement('div');
    controles.id = 'controles';

    const controleBtn = document.createElement('button');
    controleBtn.id = 'controle-btn';
    controleBtn.className = 'controle-btn';
    controleBtn.textContent = 'Iniciar Simulação';

    const reiniciarBtn = document.createElement('button');
    reiniciarBtn.id = 'reiniciar-btn';
    reiniciarBtn.className = 'controle-btn';
    reiniciarBtn.textContent = 'Reiniciar Jogo';

    controles.appendChild(controleBtn);
    controles.appendChild(reiniciarBtn);

    const container = document.getElementById('pai-tabuleiros');
    container.parentNode.insertBefore(controles, container.nextSibling);

    controleBtn.addEventListener('click', iniciarPausarExecucao);
    reiniciarBtn.addEventListener('click', reiniciarJogo);

    criarTabuleiro("tabuleiro1");
    criarTabuleiro("tabuleiro2");

    const infoContainer1 = document.createElement('div');
    infoContainer1.id = 'info1';
    infoContainer1.className = 'info-tabuleiro';

    controles.parentNode.insertBefore(infoContainer1, controles.nextSibling);

    const infoContainer2 = document.createElement('div');
    infoContainer2.id = 'info2';
    infoContainer2.className = 'info-tabuleiro';
    controles.parentNode.insertBefore(infoContainer2, infoContainer1.nextSibling);

    atualizarInfo("info1", 0, '0.00'); 
    atualizarInfo("info2", 0, '0.00'); 
}

function wasmWaiter(){
    if(!window.wasmIniciado){
        window.setTimeout(wasmWaiter, 100);
    } else{
        startBoard();        
    }
}

document.addEventListener('DOMContentLoaded', wasmWaiter);
