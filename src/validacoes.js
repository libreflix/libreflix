const regras = require("./config");

function validarAno(ano) {
  return ano >= regras.anoMinimo;
}

function validarDuracao(duracao) {
  return duracao >= regras.duracaoMinima;
}

function validarCamposObrigatorios(dados) {
  if (!dados || typeof dados !== "object") {
    return false;
  }
  return Object.keys(dados).every(function (chave) {
    return dados[chave] !== "";
  });
}

function validarFormulario(dados) {
  if (!validarCamposObrigatorios(dados)) {
    return "Preencha todos os campos obrigatórios!";
  }
  if (!validarAno(dados.year)) {
    return "Ano inválido! Deve ser maior ou igual a " + regras.anoMinimo;
  }
  if (!validarDuracao(dados.duration)) {
    return (
      "Duração inválida! Deve ser maior ou igual a " + regras.duracaoMinima
    );
  }
  return null; // Sem erros
}

module.exports = { validarAno, validarDuracao, validarCamposObrigatorios, validarFormulario };

