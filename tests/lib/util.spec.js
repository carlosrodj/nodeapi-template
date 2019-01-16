import { expect } from 'chai';
import Util from '../../app/lib/util';

describe('Util', () => {
  describe('Smoke test', () => {
    it('should exist Util', () => {
      expect(Util).to.be.exist;
    });

    it('should exist method removeDuplicateSpaces in Util', () => {
      expect(Util).itself.respondsTo('removeDuplicateSpaces')
    });

    it('should exist method formatDecimal in Util', () => {
      expect(Util).itself.respondsTo('formatDecimal')
    });

    it('should exist method formatDate in Util', () => {
      expect(Util).itself.respondsTo('formatDecimal')
    });

    it('should exist method formatNumber in Util', () => {
      expect(Util).itself.respondsTo('formatDecimal')
    });
  });

  it('should call removeDuplicateSpaces with param "teste     teste" return  value "teste teste"', () => {
    expect(Util.removeDuplicateSpaces('teste     teste')).to.be.eql('teste teste');
  });

  it('should call formatDecimal with param "1.234,56"', () => {
    expect(Util.formatDecimal('1.234,56')).to.be.eql(1234.56);
  });

  it('should call formatDecimal with param "1,0000"', () => {
    expect(Util.formatDecimal('1,0000   ')).to.be.eql(1);
  });

  it('should call formatDecimal with param "1,00200"', () => {
    expect(Util.formatDecimal('1,00200   ')).to.be.eql(1.002);
  });

  it('should call formatDecimal with param ""', () => {
    expect(Util.formatDecimal('')).to.be.null;
  });

  it('should call formatDate with param "2018-03-21T12:54:53-03:00"', () => {
    expect(Util.formatDate('2018-03-21T12:54:53-03:00')).to.be.eql('2018-03-21 12:54');
  });

  it('should call formatDate with param ""', () => {
    expect(Util.formatDate('')).to.be.null;
  });

  it('should call formatNumber with param "1,000   "', () => {
    expect(Util.formatDecimal('1   ')).to.be.eql(1);
  });

  it('should call formatNumber with param ""', () => {
    expect(Util.formatNumber('')).to.be.null;
  });

});
