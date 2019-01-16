import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import sinonStubsPromise from 'sinon-stub-promise';
import { mockReq, mockRes } from 'sinon-express-mock';
import BaseController from '../../app/controllers/base.controller.js';

chai.use(sinonChai);
sinonStubsPromise(sinon);

describe('BaseController', () => {
    it('should call filterParams with param {a: 1, b:2 } and ["a"] return value {a: 1}', () => {
      let params = {a: 1, b: 2}
      expect(new BaseController().filterParams(params, ['a'])).to.deep.equal({a: 1});
    });

    it('should be thow exception when call formatApiError without params', () => {
      expect(new BaseController().formatApiError).to.throw();
    });

    it('should call formatApiError with param {message: "Mensagem"} return the object {message: "Mensagem", error: true}', () =>{
      expect(new BaseController().formatApiError({message: "Mensagem"})).to.deep.equal({error: true, message: "Mensagem"});
    });

    it('should call formatApiError with param {erros: {not_null: {message: "O nome não pode ser em branco.", no_returned_key: false}}} return {error: true, erros: {not_null: "O nome não pode ser em branco."}}', () => {
      expect(new BaseController().formatApiError({errors: {not_null: {message: "O nome não pode ser em branco.", no_returned_key: false}}})).to.deep.equal({error: true, errors: {not_null: {message: "O nome não pode ser em branco.", type: undefined}}});
    });

    it('should call bindResultModel with promisse success', (done) => {
      const res = new mockRes();
      let resolve = null;
      res.json.callsFake((model) => {
        expect(model).to.include({a: 1});
        done();
      });
      new BaseController().bindResultModel(new Promise((resolve, reject) => {
        resolve({toJSON: () => {return {a: 1}}});
      }), res);

    });

    it('should call bindResultModel with promisse error', (done) => {
      const res = new mockRes();
      let reject = null;
      res.json.callsFake((err) => {
        expect(err.error).to.be.true;
        done();
      });
      const promise = new Promise((resolve, reject) => {
        reject(new Error('Fake error'))
      });
      new BaseController().bindResultModel(promise, res);
    });


});
