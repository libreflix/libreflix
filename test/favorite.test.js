const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const Watch = require('../models/Watch');
const Interaction = require('../models/Interaction');
const FunctionTest = require('../controllers/film');

describe('Casos de testes - favoriteGet', function () {
    let findOneWatchStub, findOneInteractionStub;

    beforeEach(function () {
        findOneWatchStub = sinon.stub(Watch, 'findOne');
        findOneInteractionStub = sinon.stub(Interaction, 'findOne');
    });

    afterEach(function () {
        sinon.restore();
    });

    it('Caso de Teste 1', function (done) {
        findOneWatchStub.yields(null, { id: '123', permalink: 'link' });
        findOneInteractionStub.yields(null, { proofhash: 'aluno1', favorite: true, save: sinon.stub().yields(null) });

        const req = {
            xhr: true,
            accepts: () => 'json',
            params: { permalink: 'link' },
            user: { id: 'user1' },
            body: { u: 'user1' }
        };

        const res = {
            send: function (data) {
                expect(data).to.deep.equal({ success: true });
                done();
            },
            status: function (code) {
                expect(code).to.equal(404);
                return this;
            }
        };

        FunctionTest.favoriteGet(req, res);
    });

    it('Caso de Teste 2', function (done) {
        findOneWatchStub.yields(null, { id: '123', permalink: 'link' });
        findOneInteractionStub.yields(null, { proofhash: 'aluno1', favorite: true, save: sinon.stub().yields(null)});

        const req = {
            xhr: false,
            accepts: () => 'json',
            params: { permalink: 'link' },
            user: { id: 'user1' },
            body: { u: 'user1' }
        };

        const res = {
            send: function (data) {
                expect(data).to.deep.equal({ success: true });
                done();
            }
        };

        FunctionTest.favoriteGet(req, res);
    });

    it('Caso de Teste 3', function (done) {
        findOneWatchStub.yields(null, { id: '123', permalink: 'link' });
        findOneInteractionStub.yields(null, { proofhash: 'aluno1', favorite: true, save: sinon.stub().yields(null)});

        const req = {
            xhr: true,
            accepts: () => 'html',
            params: { permalink: 'link' },
            user: { id: 'user1' },
            body: { u: 'user1' }
        };

        const res = {
            send: function (data) {
                expect(data).to.deep.equal({ success: true });
                done();
            }
        };

        FunctionTest.favoriteGet(req, res);
    });

    it('Caso de Teste 4', function (done) {
        findOneWatchStub.yields(null, { id: '123', permalink: 'link' });

        const req = {
            xhr: false,
            accepts: () => 'html',
            params: { permalink: 'link' }
        };

        const res = {
            send: sinon.spy()
        };

        FunctionTest.favoriteGet(req, res);

        sinon.assert.notCalled(res.send);

        done();
    });

    it('Caso de Teste 5', function (done) {
        findOneWatchStub.yields(null, { id: '123', permalink: 'link' });
        findOneInteractionStub.yields(null, { proofhash: 'aluno2', favorite: false, save: sinon.stub().yields(null)});

        const req = {
            xhr: true,
            accepts: () => 'json',
            params: { permalink: 'link' },
            user: { id: 'user2' },
            body: { u: 'user2' }
        };

        const res = {
            send: function (data) {
                expect(data).to.deep.equal({ success: true });
                done();
            }
        };

        FunctionTest.favoriteGet(req, res);
    });

    it('Caso de Teste 6', function (done) {
        findOneWatchStub.yields(null, { id: '123', permalink: 'outroLink' });
        findOneInteractionStub.yields(null, null);

        const req = {
            xhr: true,
            accepts: () => 'json',
            params: { permalink: 'outroLink' },
            user: { id: 'user3' },
            body: { u: 'user3' }
        };

        const res = {
            send: function (data) {
                expect(data).to.deep.equal({ success: true });
                done();
            }
        };

        FunctionTest.favoriteGet(req, res);
    });
});