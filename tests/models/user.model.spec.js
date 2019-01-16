import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import sinonStubsPromise from 'sinon-stub-promise';
import DatabaseMock from '../utils/database.mock';
import UserModel from '../../app/models/user.model';
import Constants from '../../app/config/constants';
import Utils from '../utils/utils';

chai.use(sinonChai);
sinonStubsPromise(sinon);


describe('UserModel', () => {
  describe('Smoke tests', () => {
    it('should exist UserModel', () => {
      expect(UserModel).to.be.exist;
    });

    it('should exist method toJSON', () => {
      expect(UserModel).to.respondTo('toJSON');
    });

    it('should exist method findByEmail', () => {
      expect(UserModel).itself.to.respondsTo('findByEmail');
    });

    it('should exist method validateUser', () => {
      expect(UserModel).itself.to.respondTo('validateUser');
    });

    it('should exist method validateEmail', () => {
      expect(UserModel).itself.to.respondTo('validateEmail');
    });
  });

  describe('Test methods', () => {

    before(DatabaseMock.start);

    after((done) => {
      Utils.bindCatch(UserModel.remove({}))
        .then(() => {
          DatabaseMock.end(done);
        });
    });

    describe('toJSON', (done) => {
      it('should params {name: "teste", email: "teste@gmail.com"}', () => {
        let user = new UserModel({name: 'teste', email: 'teste@gmail.com'});
        expect(user.toJSON()).to.include({name: 'teste', email: 'teste@gmail.com'});
      });
    });

    describe('findByEmail', () => {
      it('should no param', () => {
        expect(UserModel.findByEmail).to.throw();
      });

      it('should param "teste@gmail.com"', (done) => {
        let user = new UserModel({name: 'teste', email: 'teste@gmail.com', password: '123456'});
        Utils.bindCatch(user.save(), done)
          .then((user) => {
            Utils.bindCatch(UserModel.findByEmail('teste@gmail.com'), done)
              .then((result) => {
                expect(result.toJSON().email).to.equal('teste@gmail.com');
                done();
              });
          });
      });

    });

    describe('validateUser', () => {
      it('shoudl no param', (done) => {
        UserModel.validateUser()
          .then((user) => {
            done(new Error('Not result yet!'));
          }).catch((err) => {
            expect(err).to.be.exist;
            done();
          });
      });

      it('should param "teste2@gmail.com" and "123456"', (done) => {
        let user = new UserModel({name: 'teste 2', email: 'teste2@gmail.com', password: '123456'});
        Utils.bindCatch(user.save(), done)
          .then((user) => {
            Utils.bindCatch(UserModel.validateUser('teste2@gmail.com', '123456'), done)
              .then((result) => {
                expect(result).to.include({email: 'teste2@gmail.com'});
                done();
              });
          });
      });

      it('should findOne method return error', (done) => {
        let stub = sinon.stub(UserModel, 'findOne');
        stub.callsFake(()=>{
          return new Promise((resolve, reject) => {
            reject(new Error('Fake error!'));
          });
        });
        UserModel.validateUser('teste@gmail.com', '123456')
          .then((resolve) => {
            done(new Error('Not expected'));
            stub.restore();
          }).catch((err) => {
            expect(err).to.be.exist;
            done();
            stub.restore();
          });
      });

      it('should don´t modifying password when save user again', (done) => {
        let user = new UserModel({name: 'teste 4', email: 'teste4@gmail.com', password: '123456'});
        Utils.bindCatch(user.save(), done)
          .then((result) => {
            Utils.bindCatch(result.save(), done)
              .then((result2) => {
                expect(result2.password).equal(result.password);
                done();
              });
          });
      });

    });

    describe('validateEmail', () => {

      it('should call with valid token', (done) => {
          let user = new UserModel({name: 'teste8', email: 'teste8@gmail.com', password: '123456'});
          Utils.bindCatch(user.save(), done)
            .then((userBD) => {
              Utils.bindCatch(UserModel.validateEmail(userBD.token))
                .then((user2BD) => {
                  expect(user2BD.email_validated).to.be.true;
                  done();
                });
            });
      });

      it('should call with invalid token', (done) => {
        UserModel.validateEmail('invalid_token')
          .then((user) => {
            done(new Error('Not expected yet!'));
          }).catch((err) => {
            expect(err).to.be.exist;
            done();
          });
      });

    });

    describe('setToken', () => {
      it('should call without param', (done) => {
        UserModel.setToken().then(() =>{
          done(new Error('Not expected yet'));
        }).catch((err) => {
          expect(err).to.be.exist;
          expect(err).to.be.an.instanceOf(Error);
          done();
        });
      });

      it('should call and UserModel.findOne not return user', (done) => {
        const stub = sinon.stub(UserModel, 'findOne');
        stub.resolves(null);
        UserModel.setToken('jjohnys@gmail.com')
          .then(() => {
            done(new Error('Not expected yet!'));
          }).catch((err) => {
            expect(err).to.be.exist;
            expect(err).to.be.an.instanceOf(Error);
            stub.restore();
            done();
          });
      });
    });

    describe('save', () => {

      it('should has token and token_date when save new user', (done) => {
        let user = new UserModel({name: 'teste', email: 'teste9@gmail.com', password: '123456'});
        Utils.bindCatch(user.save(), done)
          .then((userBD) => {
            expect(userBD.token).to.be.exist;
            expect(userBD.token_date).to.be.exist;
            done();
          });
      });

      it('should error when save two user with same email', (done) => {
        let user = new UserModel({name: 'teste', email: 'teste3@gmail.com', password: '123456'});
        Utils.bindCatch(user.save(), done)
          .then((result) => {
            let user2 = new UserModel({name: 'teste', email: 'teste3@gmail.com', password: '123456'});
            user2.save().then((result2) => {
              done(new Error('Not result yet!'));
            }).catch((err) => {
              expect(err).to.be.exist;
              done();
            });
          });
      });

      it('should error when save user with invalid email', (done) => {
        new UserModel({email: 'asdf', password: '123456'}).save()
          .then((user) => {
            done(new Error('Not expected yet!'));
          }).catch((err) => {
            expect(err).to.be.exist;
            done();
          })
      });

      it('should error in UserModel.findByEmail when save user', (done) => {
        let stub = sinon.stub(UserModel, 'findByEmail');
        stub.callsFake(() => {
          return new Promise((resolve, reject) => {
            reject(new Error('Fake Error!'));
          });
        });
        new UserModel({email: 'teste@gmail.com', password: '123456'}).save()
          .then((user) => {
            done(new Error('Not expected yet!'));
            stub.restore();
          }).catch((err) => {
            expect(err).to.be.exist;
            done();
            stub.restore();
          });
      });
    });

  });

});
