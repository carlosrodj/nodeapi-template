import * as chai from 'chai';
import app, { server } from '../utils/server.mock';
import constants from '../../app/config/constants';

const expect = chai.expect;

describe('GET /', () => {

  after(() => {
    server.close();
  });

  describe('#200', () => {
    it('should return json', (done) => {
      app.get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.type).to.eql('application/json');
          done();
        });
    });

    it('should return the API version', (done) => {
      app.get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.version).to.eql(constants.version);
          done();
        });
    });
  });
});
