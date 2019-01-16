import chai, { expect } from "chai";
import sinonChai from "sinon-chai";
import sinon from "sinon";
import sinonStubsPromise from "sinon-stub-promise";
import { mockReq, mockRes } from "sinon-express-mock";
import DatabaseMock from "../utils/database.mock";
import Utils from "../utils/utils";
import AuthController from "../../app/controllers/auth.controller";
import Constants from '../../app/config/constants';
import UserModel from '../../app/models/user.model';

chai.use(sinonChai);
sinonStubsPromise(sinon);

describe("AuthController", () => {
  describe("Smoke tests", () => {
    it("should exist ", () => {
      expect(AuthController).to.be.exist;
    });

    it("should exist authenticate method", () => {
      expect(AuthController).to.respondTo("authenticate");
    });

    it("should exist recoverPassword method", () => {
      expect(AuthController).to.respondTo("recoverPassword");
    });

    it("should exist validateToken method", () => {
      expect(AuthController).to.respondTo("validateToken");
    });

    it("should exist updatePassword method", () => {
      expect(AuthController).to.respondTo("updatePassword");
    });
  });

  describe("test methods", () => {
    let user;
    let req;
    let res;

    before(done => {
      DatabaseMock.start(() => {
        Utils.bindCatch(
          new UserModel({ email: "teste@teste.com", password: "123456" }).save(), done)
            .then(resp => {
              user = resp;
              done();
            });
      });
    });

    after(done => {
      Utils.bindCatch(UserModel.remove({})).then(() => {
        DatabaseMock.end(done);
      });
    });

    beforeEach(() => {
      req = new mockReq();
      res = new mockRes();
    });

    describe("test authenticate method", () => {
      it("should call with req.currentUser", done => {
        req.currentUser = user;
        res.json.callsFake(resp => {
          expect(resp).to.be.eql(user.toJSON());
          done();
        });
        new AuthController().authenticate(req, res);
      });
    });

    describe("test recoverPassword method ", () => {
      it("should call with req.currentUser", (done) => {
        req = new mockRes({body: {email: user.email}});
        res.sendStatus.callsFake(resp => {
          expect(resp).to.be.eql(200);
          Utils.bindCatch(UserModel.findByEmail("teste@teste.com"), done).then(
            userBD => {
              expect(userBD.token).to.be.exist;
              expect(userBD.token).to.not.be.empty;
              expect(userBD.token_date).to.be.exist;
              expect(userBD.token_date).to.not.null;
              done();
            }
          );
        });
        new AuthController().recoverPassword(req, res);
      });

      it('should call with UserModel.setToken respond with error', (done) => {
        req.currentUser = user;
        const stub = sinon.stub(UserModel, 'setToken');
        res.json.callsFake((resp) => {
          expect(resp.error).to.be.true;
          stub.restore();
          done();
        });
        stub.callsFake(Utils.promiseWithError);
        new AuthController().recoverPassword(req, res);
      });
    });

    describe("test validateToken method", () => {
      it("should call with valid token", done => {
        Utils.bindCatch(UserModel.findByEmail("teste@teste.com"), done).then(
          userBD => {
            req = new mockReq({ body: { token: userBD.token } });
            req.currentUser = user;
            res.sendStatus.callsFake(status => {
              expect(status).to.be.equal(200);
              done();
            });
            new AuthController().validateToken(req, res);
          }
        );
      });

      it("should call with invalid token", done => {
        req = new mockReq({ body: { token: "facketoken" } });
        req.currentUser = user;
        res.json.callsFake(err => {
          expect(err.error).to.be.true;
          done();
        });
        new AuthController().validateToken(req, res);
      });

      it('should call with UserModel.isValidToken respond with error', (done) => {
        req.currentUser = user;
        const stub = sinon.stub(UserModel, 'isValidToken');
        res.json.callsFake((resp) => {
          expect(resp.error).to.be.true;
          stub.restore();
          done();
        });
        stub.callsFake(Utils.promiseWithError);
        new AuthController().validateToken(req, res);
      });
    });

    describe('test updatePassword method', () => {
      it('call with valid token', (done) => {
        Utils.bindCatch(UserModel.findByEmail("teste@teste.com"), done).then(
          userBD => {
            req = new mockReq({ body: { token: userBD.token, password: '1234567'} });
            req.currentUser = user;
            res.sendStatus.callsFake(status => {
              expect(status).to.be.equal(200);
              Utils.bindCatch(UserModel.findByEmail("teste@teste.com"), done).then(
                userUpdateDB => {
                  expect(userUpdateDB.password).to.not.be.equal(userBD.password);
                  expect(userUpdateDB.token).to.be.null;
                  expect(userUpdateDB.token_date).to.be.null;
                  done();
              });
            });
            new AuthController().updatePassword(req, res);
          }
        );
      });

      it('call with invalid token', (done) => {
        req = new mockReq({ body: { token: '12345asdfasdf', password: '1234567'} });
        req.currentUser = user;
        res.json.callsFake(resp => {
          expect(resp.error).to.be.true;
          done();
        });
        new AuthController().updatePassword(req, res);
      });

    });
  });
});
