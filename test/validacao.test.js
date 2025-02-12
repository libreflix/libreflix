const { expect } = require("chai");
const {
  validarAno,
  validarDuracao,
  validarCamposObrigatorios,
} = require("../src/validacoes");

describe("Validação do Ano da Produção", function () {
  it("Deve rejeitar anos menores que 1890", function () {
    expect(validarAno(1800)).to.be.false;
    expect(validarAno(1889)).to.be.false;
  });

  it("Deve aceitar anos de 1890 em diante", function () {
    expect(validarAno(1890)).to.be.true;
    expect(validarAno(2024)).to.be.true;
  });
});

describe("Validação da Duração", function () {
  it("Deve rejeitar valores negativos", function () {
    expect(validarDuracao(-10)).to.be.false;
    expect(validarDuracao(-1)).to.be.false;
  });

  it("Deve aceitar valores positivos", function () {
    expect(validarDuracao(0)).to.be.true;
    expect(validarDuracao(120)).to.be.true;
  });
});

describe("Validação de Campos Obrigatórios", function () {
  it("Deve rejeitar campos vazios", function () {
    expect(validarCamposObrigatorios({ title: "", year: 2024, duration: 120 }))
      .to.be.false;
    expect(
      validarCamposObrigatorios({ title: "Filme", year: "", duration: 120 })
    ).to.be.false;
  });

  it("Deve aceitar campos preenchidos", function () {
    expect(
      validarCamposObrigatorios({ title: "Filme", year: 2024, duration: 120 })
    ).to.be.true;
  });
  it("Deve retornar false se não for um objeto", function () {
    expect(validarCamposObrigatorios(null)).to.be.false;
    expect(validarCamposObrigatorios(undefined)).to.be.false;
    expect(validarCamposObrigatorios(123)).to.be.false;
    expect(validarCamposObrigatorios("texto")).to.be.false;
  });
});
