import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import sinonStubsPromise from 'sinon-stub-promise';
import { mockReq, mockRes } from 'sinon-express-mock';
import moment from 'moment';
import UserModel from '../../app/models/user.model';
import Utils from '../utils/utils';
import authenticate from '../../app/middleware/authenticate';
import DatabaseMock from '../utils/database.mock';
import Constants from '../../app/config/constants';

chai.use(sinonChai);
sinonStubsPromise(sinon);

describe('authenticate', () => {

  describe('Smoke test', () => {
    it('should be exist authenticate', () => {
      expect(authenticate).to.be.exist;
    });
  });

  describe('call authenticate', () => {

    let req;
    let res;

    before(DatabaseMock.start);

    after(DatabaseMock.end);

    beforeEach(() => {
      req = new mockReq();
      res = new mockRes;
    });

    it('should no secure path', (done) => {
      req.path = '/nfe';
      const next = sinon.stub();
      next.callsFake(() => {
        expect(true).to.be.true;
        done();
      });
      authenticate(req, res, next);
    });

    it('should call with no header authorization', (done) => {
      req.path = '/secure/nfe';
      res.sendStatus.callsFake((status) => {
        expect(status).to.be.equal(401);
        done();
      })
      req.headers = {};
      authenticate(req, res, sinon.spy());
    });

    it('should call with invalid header authorization', (done) => {
      req.path = '/secure/nfe';
      res.sendStatus.callsFake((status) => {
        expect(status).to.be.equal(401);
        done();
      })
      req.headers = {authorization: 'Basic asdfasdfiaosudfad='};
      authenticate(req, res, sinon.spy());
    });

    it('should call with valid header authorization and invalid user', (done) => {
      req.path = '/secure/nfe';
      const stub = sinon.stub(UserModel, 'validateUser');
      stub.callsFake(() => {
        return new Promise((resolve, reject) => {
          resolve(null);
        });
      });
      res.sendStatus.callsFake((status) => {
        expect(status).to.be.equal(401);
        stub.restore();
        done();
      });
      req.headers = {authorization: 'Basic dGVzdGVAdGVzdGUuY29tOjEyMzQ1Ng=='};
      authenticate(req, res, sinon.spy());
    });

    it('should call with valid header authorization and valid user', (done) => {
      req.path = '/secure/nfe';
      const stub = sinon.stub(UserModel, 'validateUser');
      const next = sinon.stub();
      stub.callsFake(() => {
        return new Promise((resolve, reject) => {
          resolve({email: 'teste@teste.com', active: true});
        });
      });
      next.callsFake(() => {
        expect(req).to.have.property('currentUser');
        stub.restore();
        done();
      });
      req.headers = {authorization: 'Basic dGVzdGVAdGVzdGUuY29tOjEyMzQ1Ng=='};
      authenticate(req, res, next);
    });

    it('should call with valid header authorization and valid user and fail on call UserModel.validateUser', (done) => {
      req.path = '/secure/nfe';
      const stub = sinon.stub(UserModel, 'validateUser');
      const next = sinon.stub();
      stub.callsFake(() => {
        return new Promise((resolve, reject) => {
          reject(new Error('Fake error'));
        });
      });
      next.callsFake((err) => {
        expect(err).to.be.exist;
        stub.restore();
        done();
      });
      req.headers = {authorization: 'Basic dGVzdGVAdGVzdGUuY29tOjEyMzQ1Ng=='};
      authenticate(req, res, next);
    });

    it('should call with valid header autorization and user not validate email', (done) => {
      Utils.bindCatch(new UserModel({email: 'teste@teste.com', password: '123456', createdAt: moment(new Date()).subtract((Constants.user.max_time_await_validate_email + 1), 'h')}).save(), done)
        .then((user) => {
          res.sendStatus.callsFake((status) => {
            expect(status).to.be.equal(401);
            Utils.bindCatch(user.remove(), done)
              .then(() => {
                done();
              });
          });
          req.headers = {authorization: 'Basic dGVzdGVAdGVzdGUuY29tOjEyMzQ1Ng=='};
          req.path = '/secure/nfe';
          authenticate(req, res, sinon.spy());
        });
    });

  });

});
