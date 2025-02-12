function validarAno(ano) {
  return ano >= 1890;
}

function validarDuracao(duracao) {
  return duracao >= 0;
}

function validarCamposObrigatorios(dados) {
  if (!dados || typeof dados !== "object") {
    return false;
  }
  return Object.keys(dados).every(function (chave) {
    return dados[chave] !== "";
  });
}

module.exports = { validarAno, validarDuracao, validarCamposObrigatorios };
