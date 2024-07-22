const fs = require("fs");

// Função para ler dados do arquivo JSON
function lerDados() {
  return new Promise((resolve, reject) => {
    fs.readFile("dadossimulador01.json", "utf8", (err, data) => {
      if (err) reject(err);
      resolve(JSON.parse(data));
    });
  });
}

// Função para exibir a quantidade total de repasses
function exibirTotalRepasses(dados) {
  console.log("==== Quantidade Total de Repasses ====");
  console.log(`Total de repasses processados: ${dados.length}`);
  console.log("======================================");
}

// Função de análise das transações por status
function analisarTransacoes(dados) {
  let sucesso = dados.filter((transacao) => transacao.status === "sucesso");
  let falha = dados.filter((transacao) => transacao.status === "falha");

  let valorTotalSucesso = sucesso.reduce((total, transacao) => total + transacao.valor, 0);
  let valorTotalFalha = falha.reduce((total, transacao) => total + transacao.valor, 0);

  console.log("\n==== Análise das Transações por Status ====");
  console.log(`Total de repasses bem-sucedidos: ${sucesso.length}`);
  console.log(`Valor total de repasses bem-sucedidos: R$ ${valorTotalSucesso.toFixed(2)}`);
  console.log(`Total de repasses com falha: ${falha.length}`);
  console.log(`Valor total de repasses com falha: R$ ${valorTotalFalha.toFixed(2)}`);

  console.log("\nRepasses Bem-Sucedidos por Órgão:");
  let sucessoPorOrgao = {};
  sucesso.forEach((transacao) => {
    if (!sucessoPorOrgao[transacao.orgao]) {
      sucessoPorOrgao[transacao.orgao] = { quantidade: 0, valor: 0 };
    }
    sucessoPorOrgao[transacao.orgao].quantidade++;
    sucessoPorOrgao[transacao.orgao].valor += transacao.valor;
  });
  Object.keys(sucessoPorOrgao).forEach((orgao) => {
    console.log(`- Órgão: ${orgao}, Quantidade: ${sucessoPorOrgao[orgao].quantidade}, Valor: R$ ${sucessoPorOrgao[orgao].valor.toFixed(2)}`);
  });

  console.log("\nRepasses com Falha por Órgão:");
  let falhaPorOrgao = {};
  falha.forEach((transacao) => {
    if (!falhaPorOrgao[transacao.orgao]) {
      falhaPorOrgao[transacao.orgao] = { quantidade: 0, valor: 0 };
    }
    falhaPorOrgao[transacao.orgao].quantidade++;
    falhaPorOrgao[transacao.orgao].valor += transacao.valor;
  });
  Object.keys(falhaPorOrgao).forEach((orgao) => {
    console.log(`- Órgão: ${orgao}, Quantidade: ${falhaPorOrgao[orgao].quantidade}, Valor: R$ ${falhaPorOrgao[orgao].valor.toFixed(2)}`);
  });
  console.log("===========================================");
}

// Função de análise das falhas por motivo
function analisarFalhasPorMotivo(dados) {
  let falha = dados.filter((transacao) => transacao.status === "falha");
  let falhaPorMotivo = {};
  falha.forEach((transacao) => {
    if (!falhaPorMotivo[transacao.motivo]) {
      falhaPorMotivo[transacao.motivo] = { quantidade: 0, valor: 0 };
    }
    falhaPorMotivo[transacao.motivo].quantidade++;
    falhaPorMotivo[transacao.motivo].valor += transacao.valor;
  });
  console.log("\nRepasses com Falha por Motivo:");
  Object.keys(falhaPorMotivo).forEach((motivo) => {
    console.log(`- Motivo: ${motivo}, Quantidade: ${falhaPorMotivo[motivo].quantidade}, Valor: R$ ${falhaPorMotivo[motivo].valor.toFixed(2)}`);
  });
  console.log("===========================================");
}

// Função para calcular estatísticas dos repasses
function calcularEstatisticas(dados) {
  if (dados.length === 0) return;

  let maiorValor = dados[0];
  let menorValor = dados[0];
  let repassesPorDia = {};
  let repassesPorOrgao = {};

  dados.forEach((transacao) => {
    if (transacao.valor > maiorValor.valor) maiorValor = transacao;
    if (transacao.valor < menorValor.valor) menorValor = transacao;

    if (!repassesPorDia[transacao.data]) {
      repassesPorDia[transacao.data] = 0;
    }
    repassesPorDia[transacao.data]++;

    if (!repassesPorOrgao[transacao.orgao]) {
      repassesPorOrgao[transacao.orgao] = 0;
    }
    repassesPorOrgao[transacao.orgao]++;
  });

  let diaMaisRepasses = Object.keys(repassesPorDia).reduce((a, b) => repassesPorDia[a] > repassesPorDia[b] ? a : b);
  let orgaoMaisRepasses = Object.keys(repassesPorOrgao).reduce((a, b) => repassesPorOrgao[a] > repassesPorOrgao[b] ? a : b);

  console.log("\n==== Estatísticas dos Repasses ====");
  console.log(`Maior valor de repasse: R$ ${maiorValor.valor.toFixed(2)} (Órgão: ${maiorValor.orgao}, Data: ${maiorValor.data})`);
  console.log(`Menor valor de repasse: R$ ${menorValor.valor.toFixed(2)} (Órgão: ${menorValor.orgao}, Data: ${menorValor.data})`);
  console.log(`Dia com mais repasses: ${diaMaisRepasses}`);
  console.log(`Órgão com mais repasses: ${orgaoMaisRepasses}`);
  console.log("===================================");
}

// Função para exibir detalhes de transações por órgão
function exibirDetalhesPorOrgao(dados, orgaoDesejado) {
  let transacoesOrgao = dados.filter((transacao) => transacao.orgao === orgaoDesejado);
  console.log(`\n==== Detalhes das Transações do Órgão: ${orgaoDesejado} ====\n`);
  transacoesOrgao.forEach((transacao) => {
    console.log(`Data: ${transacao.data}, Valor: R$ ${transacao.valor.toFixed(2)}, Status: ${transacao.status}`);
    if (transacao.status === "falha") {
      console.log(`Motivo: ${transacao.motivo}`);
    }
    console.log("----------------------------------------");
  });
  console.log("===========================================");
}

// Função para verificar e exibir transações com falha sem motivo
function verificarTransacoesInvalidas(dados) {
  let transacoesInvalidas = dados.filter((transacao) => transacao.status === "falha" && !transacao.motivo);
  if (transacoesInvalidas.length > 0) {
    console.log("\n==== Transações com Falha sem Motivo ====\n");
    transacoesInvalidas.forEach((transacao) => {
      console.log(`Data: ${transacao.data}, Órgão: ${transacao.orgao}, Valor: R$ ${transacao.valor.toFixed(2)}`);
      console.log("----------------------------------------");
    });
    console.log("===========================================");
  } else {
    console.log("\nNenhuma transação com falha sem motivo encontrada.");
  }
}

// Função principal para executar o programa
async function main() {
  try {
    let dados = await lerDados();
    exibirTotalRepasses(dados);
    analisarTransacoes(dados);
    analisarFalhasPorMotivo(dados);
    calcularEstatisticas(dados);
    exibirDetalhesPorOrgao(dados, "Ministério da Ciência, Tecnologia e Inovação"); // Exemplo: Exibir detalhes das transações do Ministério da Saúde
    verificarTransacoesInvalidas(dados);
  } catch (error) {
    console.error("Erro ao processar os dados:", error);
  }
}

main();
