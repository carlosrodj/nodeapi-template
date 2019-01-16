import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import sinonStubsPromise from 'sinon-stub-promise';
import { mockReq, mockRes } from 'sinon-express-mock';
import DatabaseMock from '../utils/database.mock';
import UserController from '../../app/controllers/user.controller.js';
import Constants from '../../app/config/constants';
import UserModel from '../../app/models/user.model';
import Utils from '../utils/utils';

chai.use(sinonChai);
sinonStubsPromise(sinon);

describe('UserController', () => {

  describe('Smoke tests', () => {
    it('should exist UserController', () => {
      expect(UserController).to.be.exist;
    });

    it('should exist method index in UserController', () => {
      expect(UserController).to.respondTo('index');
    });

    it('should exist method create in UserController', () => {
      expect(UserController).to.respondTo('create');
    });

    it('should exist method update in UserController', () => {
      expect(UserController).to.respondTo('update');
    });

    it('should exist method validateEmail in UserController', () => {
      expect(UserController).to.respondTo('validateEmail');
    });

  });

  describe('Test methods', () => {

    let req;
    let res;

    before(DatabaseMock.start);

    after((done) => {
      Utils.bindCatch(UserModel.remove({}))
        .then(() => {
          DatabaseMock.end(done);
        });
    });

    beforeEach(() => {
      req = new mockReq();
      res = new mockRes();
    });

    describe('create', (done) => {
      it('should call with body params {email: "teste@gmail.com", password: "123456", genre: "M"}', (done) => {
        req = new mockReq({body: {email: "teste@gmail.com", password: "123456", genre: 'M'}});
        new UserController().create(req, res);
        res.json.callsFake((user) => {
          expect(user).to.include({email: 'teste@gmail.com', genre: 'M'});
          expect(user).not.have.property('password');
          done();
        });
      });
    });

    describe('index', () => {
      it('should call with authenticated user in req', (done) => {
        req.currentUser = {toJSON: () => {return {email: 'teste@gmail.com'}}};
        res.json.callsFake((user) => {
          expect(user).to.include({email: 'teste@gmail.com'});
          done();
        });
        new UserController().index(req, res);
      });
    });

    describe('update', () => {
      it('should call with params {name: "teste", birth_date: "15/03/1991", genre: "M"}', (done) => {
        Utils.bindCatch(new UserModel({email: 'teste2@gmail.com', password: '123456', genre: 'M', birth_date: '15/03/1990'}).save(), done)
          .then((user) => {
            req = new mockReq({ body: { name: 'teste', birth_date: '15/03/1991', genre: 'F'}});
            req.currentUser = user;
            new UserController().update(req, res);
            res.json.callsFake((user) => {
              expect(user).to.include({name: 'teste', email: 'teste2@gmail.com', birth_date: '15/03/1991', genre: 'F'});
              done();
            });
          })
      });
    });

    describe('validateEmail', () => {
      it('should call with valid token', (done) => {
        Utils.bindCatch(new UserModel({email: 'teste3@gmail.com', password: '123456'}).save(), done)
        .then((user) => {
          req = new mockReq({ body: {token: user.token}});
          new UserController().validateEmail(req, res);
          res.sendStatus.callsFake((status) => {
            expect(status).to.be.equals(200);
            done();
          });
        })
      });

      it('should call with invalid token', (done) => {
        req = new mockReq({ body: {token: 'invalid token'}});
          new UserController().validateEmail(req, res);
          res.json.callsFake((err) => {
            expect(err).to.be.exist;
            done();
          });
      });

    });

  });

});
