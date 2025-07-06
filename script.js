// Estados globais
let estadoInicial = null;
let estadoAtual1 = null;
let estadoAtual2 = null;
let executando = false;
let intervaloExecucao = null;

// Função para criar estado inicial aleatório (igual para ambos tabuleiros)
function criarEstadoInicial() {
  const estado = Array(8).fill().map(() => Array(8).fill(''));
  const posicoesDisponiveis = [];
  
  // Gerar todas posições possíveis
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      posicoesDisponiveis.push([i, j]);
    }
  }
  
  // Embaralhar posições (usando o mesmo seed para ambos tabuleiros)
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
  
  // Selecionar 8 posições para as rainhas
  for (let i = 0; i < 8; i++) {
    const [linha, coluna] = posicoesEmbaralhadas[i];
    estado[linha][coluna] = 'Q';
  }
  
  return estado;
}

// Função para criar o tabuleiro visual
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

// Função para atualizar um tabuleiro com um estado específico
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

// Função para iniciar/pausar a execução
function iniciarPausarExecucao() {
  const botao = document.getElementById('controle-btn');
  
  if (!executando) {
    // Iniciar execução
    executando = true;
    botao.textContent = 'Pausar';
    
    // Iniciar o loop de execução
    intervaloExecucao = setInterval(() => {
      // Atualizar estados através de funções externas
      if (typeof proximoEstadoTrio === 'function') {
        estadoAtual1 = proximoEstadoTrio(estadoAtual1);
        atualizarTabuleiro("tabuleiro1", estadoAtual1);
      }
      
      if (typeof proximoEstadoDupla === 'function') {
        estadoAtual2 = proximoEstadoDupla(estadoAtual2);
        atualizarTabuleiro("tabuleiro2", estadoAtual2);
      }
    }, 500); // Atualiza a cada 500ms
  } else {
    // Pausar execução
    executando = false;
    botao.textContent = 'Continuar';
    
    if (intervaloExecucao) {
      clearInterval(intervaloExecucao);
      intervaloExecucao = null;
    }
  }
}

// Função para reiniciar o jogo
function reiniciarJogo() {
  // Pausar execução se estiver em andamento
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

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  // Criar botões de controle
  const controles = document.createElement('div');
  controles.id = 'controles';
  controles.style.display = 'flex';
  controles.style.justifyContent = 'center';
  controles.style.gap = '10px';
  controles.style.margin = '20px';
  
  const controleBtn = document.createElement('button');
  controleBtn.id = 'controle-btn';
  controleBtn.textContent = 'Iniciar Simulação';
  controleBtn.style.padding = '10px 20px';
  
  const reiniciarBtn = document.createElement('button');
  reiniciarBtn.id = 'reiniciar-btn';
  reiniciarBtn.textContent = 'Reiniciar Jogo';
  reiniciarBtn.style.padding = '10px 20px';
  
  controles.appendChild(controleBtn);
  controles.appendChild(reiniciarBtn);
  
  // Inserir controles antes do container de tabuleiros
  const container = document.getElementById('container-tabuleiros');
  document.body.insertBefore(controles, container);
  
  // Configurar eventos
  controleBtn.addEventListener('click', iniciarPausarExecucao);
  reiniciarBtn.addEventListener('click', reiniciarJogo);
  
  // Configurar jogo inicial
  estadoInicial = criarEstadoInicial();
  estadoAtual1 = JSON.parse(JSON.stringify(estadoInicial));
  estadoAtual2 = JSON.parse(JSON.stringify(estadoInicial));
  
  criarTabuleiro("tabuleiro1");
  criarTabuleiro("tabuleiro2");
  atualizarTabuleiro("tabuleiro1", estadoAtual1);
  atualizarTabuleiro("tabuleiro2", estadoAtual2);
});