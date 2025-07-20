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
function iniciarExecucao() {
    const botao = document.getElementById('controle-btn');
    botao.disabled = true; // Impede múltiplos cliques

    estadoInicial = criarEstadoInicial();
    estadoAtual1 = JSON.parse(JSON.stringify(estadoInicial));

    const vec = new Module.Vector();
    for (let i = 0; i < 8; ++i) {
        vec.push_back(estadoInicial[i]);
    }
    estadoAtual2 = vec;

    atualizarTabuleiro("tabuleiro1", estadoInicial);
    atualizarTabuleiro("tabuleiro2", estadoInicial);
    atualizarInfo("info1", 0, '0.00');
    atualizarInfo("info2", 0, '0.00');

    const start1 = performance.now();
    console.time('backtracking');
    const resultado1 = backtracking(estadoAtual1)
    console.timeEnd('backtracking');
    const end1 = performance.now();

    atualizarTabuleiro("tabuleiro1", resultado1.solucao);
    atualizarInfo("info1", resultado1.movs, ((end1 - start1) / 1000).toFixed(6));

    const start2 = performance.now();
    console.time('hill_climbing');
    const resultado2 = Module.hill_climbing(estadoAtual2)
    console.timeEnd('hill_climbing');
    const end2 = performance.now();

    let vals = [];
    for (let i = 0; i < 8; ++i) {
        vals.push(resultado2.queens.get(i));
    }

    atualizarTabuleiro("tabuleiro2", vals);
    atualizarInfo("info2", resultado2.iters, ((end2 - start2) / 1000).toFixed(6));

    botao.disabled = false;
    console.log("🏁 Execução finalizada.");
}

function startBoard() {
    const controles = document.createElement('div');
    controles.id = 'controles';

    const controleBtn = document.createElement('button');
    controleBtn.id = 'controle-btn';
    controleBtn.className = 'controle-btn';
    controleBtn.textContent = 'Executar';

    controles.appendChild(controleBtn);

    const container = document.getElementById('pai-tabuleiros');
    container.parentNode.insertBefore(controles, container.nextSibling);

    controleBtn.addEventListener('click', iniciarExecucao);

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

document.addEventListener('DOMContentLoaded', startBoard);
