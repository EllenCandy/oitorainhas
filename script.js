// Estados globais
let estadoInicial = null;
let estadoAtual1 = null;
let estadoAtual2 = null;
let executando = false;
let intervaloExecucao = null;

// Função para criar estado inicial aleatório
function criarEstadoInicial() {
  const estado = Array(8).fill().map(() => Array(8).fill(''));
  const posicoesDisponiveis = [];
  
  // Gerar todas posições possíveis
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      posicoesDisponiveis.push([i, j]);
    }
  }
  
  // Embaralhar posições
  const seed = Math.floor(Math.random() * 10000);
  function shuffle(array, seed) {
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
    
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  const posicoesEmbaralhadas = shuffle([...posicoesDisponiveis], seed);
  
  // Posicionar 8 rainhas
  for (let i = 0; i < 8; i++) {
    const [linha, coluna] = posicoesEmbaralhadas[i];
    estado[linha][coluna] = 'Q';
  }
  
  return estado;
}

// Criar tabuleiro visual
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

// Atualizar tabuleiro com estado específico
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

// Iniciar/pausar execução
function iniciarPausarExecucao() {
  const botao = document.getElementById('controle-btn');
  
  if (!executando) {
    // Iniciar execução
    executando = true;
    botao.textContent = 'Pausar';
    botao.classList.add('executando');
    
    // Iniciar loop
    intervaloExecucao = setInterval(() => {
      if (typeof proximoEstadoTrio === 'function') {
        estadoAtual1 = proximoEstadoTrio(estadoAtual1);
        atualizarTabuleiro("tabuleiro1", estadoAtual1);
      }
      
      if (typeof proximoEstadoDupla === 'function') {
        estadoAtual2 = proximoEstadoDupla(estadoAtual2);
        atualizarTabuleiro("tabuleiro2", estadoAtual2);
      }
    }, 500);
  } else {
    // Pausar execução
    executando = false;
    botao.textContent = 'Continuar';
    botao.classList.remove('executando');
    
    if (intervaloExecucao) {
      clearInterval(intervaloExecucao);
      intervaloExecucao = null;
    }
  }
}

// Reiniciar jogo
function reiniciarJogo() {
  // Pausar se estiver executando
  if (executando) {
    iniciarPausarExecucao();
  }
  
  // Regerar estado inicial
  estadoInicial = criarEstadoInicial();
  estadoAtual1 = JSON.parse(JSON.stringify(estadoInicial));
  estadoAtual2 = JSON.parse(JSON.stringify(estadoInicial));
  
  // Atualizar visualização
  atualizarTabuleiro("tabuleiro1", estadoAtual1);
  atualizarTabuleiro("tabuleiro2", estadoAtual2);
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Criar controles
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
  
  // Inserir controles após os tabuleiros
  const container = document.getElementById('container-tabuleiros');
  container.parentNode.insertBefore(controles, container.nextSibling);
  
  // Configurar eventos
  controleBtn.addEventListener('click', iniciarPausarExecucao);
  reiniciarBtn.addEventListener('click', reiniciarJogo);
  
  // Configurar jogo
  estadoInicial = criarEstadoInicial();
  estadoAtual1 = JSON.parse(JSON.stringify(estadoInicial));
  estadoAtual2 = JSON.parse(JSON.stringify(estadoInicial));
  
  criarTabuleiro("tabuleiro1");
  criarTabuleiro("tabuleiro2");
  atualizarTabuleiro("tabuleiro1", estadoAtual1);
  atualizarTabuleiro("tabuleiro2", estadoAtual2);
});