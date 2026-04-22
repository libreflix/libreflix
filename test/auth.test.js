const request = require('supertest');
const app = require('../app');
const sinon = require('sinon');
const nodemailer = require('nodemailer');
const User = require('../models/User');

describe('POST /signup', function () {
  let sendMailStub;

  beforeEach(() => {
    // Stub do sendMail para simular envio de e-mails sem realmente enviar
    sendMailStub = sinon.stub(nodemailer.createTransport(), 'sendMail').resolves();
  });

  afterEach(() => {
    sendMailStub.restore(); // Restaura a função original após cada teste
  });

  it('deve criar um usuário e enviar um e-mail de confirmação', async function () {
    const userData = {
      name: 'Usuário Teste',
      username: 'usertest',
      email: 'usertest@email.com',
      password: 'SenhaForte123!',
    };

    const response = await request(app)
      .post('/signup')
      .send(userData);

    expect(response.status).toBe(302);
    expect(sendMailStub.calledOnce).toBe(true);
    expect(sendMailStub.firstCall.args[0].to).toBe(userData.email);
  });

  it('não deve permitir cadastro com e-mail já existente', async function () {
    await User.create({
      name: 'Usuário Existente',
      username: 'userexist',
      email: 'existente@email.com',
      password: 'SenhaForte123!',
    });

    const response = await request(app)
      .post('/signup')
      .send({
        name: 'Novo Usuário',
        username: 'newuser',
        email: 'existente@email.com',
        password: 'SenhaForte123!',
      });

    expect(response.status).toBe(302);
    expect(sendMailStub.called).toBe(false); // O e-mail não deve ser enviado
  });

  it('não deve permitir cadastro com username já existente', async function () {
    await User.create({
      name: 'Usuário Existente',
      username: 'userexist',
      email: 'existente2@email.com',
      password: 'SenhaForte123!',
    });

    const response = await request(app)
      .post('/signup')
      .send({
        name: 'Novo Usuário',
        username: 'userexist', // Mesmo username
        email: 'novo@email.com',
        password: 'SenhaForte123!',
      });

    expect(response.status).toBe(302);
    expect(sendMailStub.called).toBe(false);
  });

  it('deve lidar com falha no envio do e-mail', async function () {
    sendMailStub.rejects(new Error('Falha no envio do e-mail')); // Simula erro no envio

    const response = await request(app)
      .post('/signup')
      .send({
        name: 'Usuário Teste',
        username: 'usertest2',
        email: 'usertest2@email.com',
        password: 'SenhaForte123!',
      });

    expect(response.status).toBe(302); // Ainda deve redirecionar
    expect(sendMailStub.calledOnce).toBe(true); // O sistema tentou enviar o e-mail
  });
});
