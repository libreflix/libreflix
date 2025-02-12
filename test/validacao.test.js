const { expect } = require("chai");
const {
  validarAno,
  validarDuracao,
  validarCamposObrigatorios,
  validarFormulario,
} = require("../src/validacoes");
const regras = require("../src/config");

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

describe("Validação do Formulário", function () {
  it("Deve rejeitar se algum campo obrigatório estiver vazio", function () {
    expect(
      validarFormulario({ title: "", year: 2024, duration: 120 })
    ).to.equal("Preencha todos os campos obrigatórios!");
    expect(
      validarFormulario({ title: "Filme", year: "", duration: 120 })
    ).to.equal("Preencha todos os campos obrigatórios!");
  });

  it("Deve rejeitar anos inválidos", function () {
    expect(
      validarFormulario({ title: "Filme", year: 1800, duration: 120 })
    ).to.equal("Ano inválido! Deve ser maior ou igual a " + regras.anoMinimo);
  });

  it("Deve rejeitar duração inválida", function () {
    expect(
      validarFormulario({ title: "Filme", year: 2024, duration: -10 })
    ).to.equal(
      "Duração inválida! Deve ser maior ou igual a " + regras.duracaoMinima
    );
  });

  it("Deve aceitar um formulário válido", function () {
    expect(validarFormulario({ title: "Filme", year: 2024, duration: 120 })).to
      .be.null;
  });
});
