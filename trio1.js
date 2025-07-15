const TAMANHO = 8;

function contar_conflitos(solucao_parcial_atual, coluna_atual, possivel_linha){
    let total_conflitos = 0
    for(coluna = 0; coluna < coluna_atual; coluna++){
        let linha_rainha = solucao_parcial_atual[coluna];

        if((linha_rainha === possivel_linha) || Math.abs(linha_rainha - possivel_linha) === Math.abs(coluna - coluna_atual)){
            total_conflitos++;
        }
    }
    return total_conflitos;
}

function busca_solucao(coluna_atual, opcoes_validas, movimentos, solucao_parcial, estado_inicial){
    if(movimentos > 10000){ //evitar looping infinito
        return {solucao: [], movs: movimentos};
    }

    if(coluna_atual === TAMANHO){ //se chegou a ultima coluna, obteve uma solução
        return {solucao: solucao_parcial.slice(), movs: movimentos};
    }

    let candidatos = [];

    if(opcoes_validas[coluna_atual].has(estado_inicial[coluna_atual])){ //testa se a linha do estado inicial é valida, se sim será a primeira candidata
        candidatos.push(estado_inicial[coluna_atual]);
    }

    let restantes = [];
    for(linha_disponivel of opcoes_validas[coluna_atual]){ //armazena as outras linhas possiveis em 'restantes'
        if(linha_disponivel !== estado_inicial[coluna_atual] || !candidatos.includes(linha_disponivel)){
            restantes.push(linha_disponivel)
        }
    }

    //min-conflicts
    const ordenado = [...restantes].sort((a, b) => { //ordena 'restantes' de acordo com o menor numero de conflitos e adiciona a candidatos 
        return contar_conflitos(solucao_parcial, coluna_atual, a) - contar_conflitos(solucao_parcial, coluna_atual, b);
    });
    candidatos.push(...ordenado); //candidatos agora tem as linhas validas para testar ordenadas

    //otimização para "podar" galhos da busca que seriam invalidos
    for(linha of candidatos){
        movimentos++; 
        solucao_parcial[coluna_atual] = linha;

        let novas_opcoes_validas = opcoes_validas.map(s => new Set(s));
        let valido = true;

        for(coluna_futura = coluna_atual + 1; coluna_futura < TAMANHO; coluna_futura++){
            let novos_conflitos = [linha, linha+(coluna_futura-coluna_atual), linha-(coluna_futura-coluna_atual)]; //calcula as direções/posições que atacadas pela rainha
            
            novos_conflitos = novos_conflitos.filter(x => x >= 0 && x < TAMANHO)

            for (const ataque of novos_conflitos) {
                novas_opcoes_validas[coluna_futura].delete(ataque);
            }

            if(novas_opcoes_validas[coluna_futura].size === 0){ //se não há opcoes_validas, a escolha é invalida
                valido = false;
                break;
            }
        }
        if(!valido){ //
            continue;
        }

        const ret = busca_solucao(coluna_atual + 1, novas_opcoes_validas, movimentos, solucao_parcial, estado_inicial);
        
        if (ret.solucao.length){ //se existe um resultado de busca_solucao, retorna
            return ret; 
        }
        movimentos = ret.movs;

        if(!ret.solucao.size === 0){
            return { solucao: solucao_parcial.slice(), movs: movimentos };
        }
    }
    return { solucao: [], movs: movimentos };
}

function proximoEstadoTrio(estado) {
  // Primeira chamada: calcular solução completa
  if (trioSolucao.length === 0) {
    const inicial = estadoParaVetor(estado);
    const solucao_parcial = Array(TAMANHO).fill(null);
    const opcoes_validas = Array.from({ length: TAMANHO }, () => {
      const set = new Set();
      for (let i = 0; i < TAMANHO; i++) {
        set.add(i);
      }
      return set;
    });

    const resultado = busca_solucao(0, opcoes_validas, 0, solucao_parcial, inicial);
    trioSolucao = resultado.solucao;
    trioPassoAtual = 0;
  }

  // Executar um passo por chamada (coloca rainha na próxima coluna)
  const vetorParcial = Array(TAMANHO).fill(null);
  for (let i = 0; i <= trioPassoAtual && i < TAMANHO; i++) {
    vetorParcial[i] = trioSolucao[i];
  }

  trioPassoAtual++;
  if (trioPassoAtual > TAMANHO) trioPassoAtual = TAMANHO;

  return vetorParaEstado(vetorParcial);
}

/*========================================================main===========================================================*/
const inicial = []; //posiciona 8 rainhas aleatóriamente 
for (let i = 0; i < TAMANHO; i++) {
    inicial.push(Math.floor(Math.random() * TAMANHO));
}

console.log(`Estado inicial: ${inicial.join(" ")}`);


const solucao_parcial = Array(TAMANHO).fill(null);

const opcoes_validass = Array.from({ length: TAMANHO }, () => {
    const newSet = new Set();
    for (let i = 0; i < TAMANHO; i++) {
        newSet.add(i);
    }
    return newSet;
});

//buca_solucao(coluna que está sendo modificada, linhas validas na coluna, iterações, solução momentanea, posicionamento das rainhas)
console.time("Velocidade");
const resultado = busca_solucao(0, opcoes_validass, 0, solucao_parcial, inicial);
console.timeEnd("Velocidade");

const solucao = resultado.solucao;
const movs = resultado.movs;

if (solucao.length > 0) {
    console.log(`Solução em ${movs} movimentos: ${solucao.join(" ")}`);
} else {
    console.log(`Não encontrou solução em ${movs} movimentos.`);
}
