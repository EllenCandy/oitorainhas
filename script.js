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

// estado inicial aleatório
function criarEstadoInicial() {
  const estado = Array(8).fill().map(() => Array(8).fill(''));
  const posicoesDisponiveis = [];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      posicoesDisponiveis.push([i, j]);
    }
  }

  const estados = Math.floor(Math.random() * 10000);
  function shuffle(array, estados) {
    const random = () => {
      const x = Math.sin(estados++) * 10000;
      return x - Math.floor(x);
    };

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const posicoesEmbaralhadas = shuffle([...posicoesDisponiveis], estados);

  for (let i = 0; i < 8; i++) {
    const [linha, coluna] = posicoesEmbaralhadas[i];
    estado[linha][coluna] = 'Q';
  }

  return estado;
}

function criarTabuleiro(id) {
  const tabuleiro = document.getElementById(id);
  tabuleiro.innerHTML = '';

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

function atualizarInfo(idInfo, iteracoes, tempoInicio) {
  const info = document.getElementById(idInfo);
  const tempoAtual = ((performance.now() - tempoInicio) / 1000).toFixed(2);
  info.innerHTML = `
    <p><strong>Iterações:</strong> ${iteracoes}</p>
    <p><strong>Tempo:</strong> ${tempoAtual} s</p>
  `;
}

function iniciarPausarExecucao() {
  const botao = document.getElementById('controle-btn');

  if (!executando) {
    executando = true;
    botao.textContent = 'Pausar';
    botao.classList.add('executando');

    // marca o tempo inicial se ainda não marcado
    if (!inicioTempo1) inicioTempo1 = performance.now();
    if (!inicioTempo2) inicioTempo2 = performance.now();

    intervaloExecucao = setInterval(() => {
      if (typeof proximoEstadoTrio === 'function') {
        estadoAtual1 = proximoEstadoTrio(estadoAtual1);
        iteracoes1++;
        atualizarTabuleiro("tabuleiro1", estadoAtual1);
        atualizarInfo("info1", iteracoes1, inicioTempo1);
      }

      if (typeof proximoEstadoDupla === 'function') {
        estadoAtual2 = proximoEstadoDupla(estadoAtual2);
        iteracoes2++;
        atualizarTabuleiro("tabuleiro2", estadoAtual2);
        atualizarInfo("info2", iteracoes2, inicioTempo2);
      }
    }, 500);
  } else {
    executando = false;
    botao.textContent = 'Continuar';
    botao.classList.remove('executando');

    if (intervaloExecucao) {
      clearInterval(intervaloExecucao);
      intervaloExecucao = null;
    }
  }
}

function reiniciarJogo() {
  if (executando) {
    iniciarPausarExecucao();
  }

  estadoInicial = criarEstadoInicial();
  estadoAtual1 = JSON.parse(JSON.stringify(estadoInicial));
  estadoAtual2 = JSON.parse(JSON.stringify(estadoInicial));

  iteracoes1 = 0;
  iteracoes2 = 0;
  inicioTempo1 = null;
  inicioTempo2 = null;

  atualizarTabuleiro("tabuleiro1", estadoAtual1);
  atualizarTabuleiro("tabuleiro2", estadoAtual2);
  atualizarInfo("info1", 0, performance.now());
  atualizarInfo("info2", 0, performance.now());
}

document.addEventListener('DOMContentLoaded', () => {
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

  estadoInicial = criarEstadoInicial();
  estadoAtual1 = JSON.parse(JSON.stringify(estadoInicial));
  estadoAtual2 = JSON.parse(JSON.stringify(estadoInicial));

  criarTabuleiro("tabuleiro1");
  criarTabuleiro("tabuleiro2");
  atualizarTabuleiro("tabuleiro1", estadoAtual1);
  atualizarTabuleiro("tabuleiro2", estadoAtual2);

  atualizarInfo("info1", 0, performance.now());
  atualizarInfo("info2", 0, performance.now());
});
