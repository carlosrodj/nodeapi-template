import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import sinonStubsPromise from 'sinon-stub-promise';
import fs from 'fs';
import DatabaseMock from '../../utils/database.mock';
import Utils from '../../utils/utils';
import MailClient, { EMAIL_TYPES } from '../../../app/lib/mailer/mailer.client';

chai.use(sinonChai);
sinonStubsPromise(sinon);

describe('MailClient', () => {
  describe('Smoke test', () => {
    it('should exist MailClient', () => {
      expect(MailClient).to.be.exist;
    });

    it('should exist method process in MailClient', () => {
      expect(MailClient).itself.to.respondsTo('send');
    });
  });

  describe('test methods', () => {
    before(DatabaseMock.start);

    after(DatabaseMock.end);

    describe('send', () => {
      it('should error when send email with emailType not configured', (done) => {
        MailClient.send('teste@gmail.com', 'fackeEmailType', null, (err) => {
          expect(err).to.be.exist;
          expect(err).to.be.an.instanceof(Error);
          done();
        });
      });

      it('should error when readfile template', (done) => {
        const stub = sinon.stub(fs, 'readFile');
        stub.callsFake((file, callback) => {
          callback(new Error('Fake error'));
        });
        MailClient.send('teste@gmail.com', EMAIL_TYPES.create_account.name, {name: 'teste', email: 'teste@gmail.com'}, (err) => {
          expect(err).to.be.exist;
          expect(err).to.be.an.instanceof(Error);
          stub.restore();
          done();
        });

      });

      it('should be send email', (done) => {
        const stub = sinon.stub(MailClient.client, 'sendMail');
        stub.callsFake((params) => {
          expect(params).to.be.exist;
          expect(params).to.include({to: 'teste@gmail.com', subject: EMAIL_TYPES.create_account.subject});
          stub.restore();
          done();
        });
        MailClient.send('teste@gmail.com', EMAIL_TYPES.create_account.name, {name: 'teste', email: 'teste@gmail.com'});
      });

    });

  });
});
