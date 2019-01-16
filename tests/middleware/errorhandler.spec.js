import { mockReq, mockRes } from 'sinon-express-mock'
import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'
import errorhander from '../../app/middleware/errorhandler'

chai.use(sinonChai);

describe('errorhandler', () => {
    it('should call errorhandler with params null, req, res return status 500 in response', () => {
      const req = new mockReq();
      const res = new mockRes();
      errorhander(null, req, res);
      expect(res.sendStatus).to.be.calledWith(500);
    });

    it('should call errorhandler with params {}, req, res return status 500 and json {message: "Internal Server Error."}', () => {
      const req = new mockReq();
      const res = new mockRes();
      errorhander({}, req, res);
      expect(res.status).to.be.calledWith(500);
      expect(res.json).to.be.calledWith({message: 'Internal Server Error.'});
    });

    it('should call errorhandler with params {message: "um erro"}, req, res return status 500 and json {message: "um erro"}', () => {
      const req = new mockReq();
      const res = new mockRes();
      errorhander( {message: "um erro"}, req, res);
      expect(res.status).to.be.calledWith(500);
      expect(res.json).to.be.calledWith({message: 'um erro'});
    });

    it('should call errorhandler with params {message: "um erro", status: 300}, req, res return status 300 and json {message: "um erro"}', () => {
      const req = new mockReq();
      const res = new mockRes();
      errorhander( {message: "um erro", status: 300}, req, res);
      expect(res.status).to.be.calledWith(300);
      expect(res.json).to.be.calledWith({message: 'um erro'});
    });

    it('should call errorhandler with params {message: "um erro", status: 300, errors:{not_null: {message: "teste", not_return_key: false}}}, req, res return status 300 and json {message: "um erro", errors: {not_null: "teste"}}', () => {
      const req = new mockReq();
      const res = new mockRes();
      errorhander(  {message: "um erro", status: 300, errors:{not_null: {message: "teste", not_return_key: false}}}, req, res);
      expect(res.status).to.be.calledWith(300);
      expect(res.json).to.be.calledWith({message: "um erro", errors: {not_null: "teste"}});
    });
});
