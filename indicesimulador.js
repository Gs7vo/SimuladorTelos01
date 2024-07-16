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
  console.log(`Total de repasses processados: ${dados.length}`);
}

// Função de análise das transações por status
function analisarTransacoes(dados) {
  let sucesso = dados.filter((transacao) => transacao.status === "sucesso");
  let falha = dados.filter((transacao) => transacao.status === "falha");

  console.log("Total de repasses bem-sucedidos:", sucesso.length);
  console.log("Total de repasses com falha:", falha.length);

  console.log("Repasses bem-sucedidos por órgão:");
  sucesso.forEach((transacao) => {
    console.log(`Órgão: ${transacao.orgao}, Valor: ${transacao.valor}`);
  });

  console.log("Repasses com falha por órgão:");
  falha.forEach((transacao) => {
    console.log(
      `Órgão: ${transacao.orgao}, Valor: ${transacao.valor}, Motivo: ${transacao.motivo}`
    );
  });
}

// Função principal para processar os dados
async function processarDados() {
  try {
    let dados = await lerDados();
    exibirTotalRepasses(dados);
    analisarTransacoes(dados);
  } catch (err) {
    console.error("Erro ao processar os dados:", err);
  }
}

// Executar a função principal
processarDados();
