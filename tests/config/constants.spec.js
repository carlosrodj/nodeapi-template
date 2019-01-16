import Constants from '../../app/config/constants';
import { expect } from 'chai';

describe('Constants', () => {
  it('should be exist envs contants', () => {
    expect(Constants.envs).to.be.exist;
    expect(Constants.envs.test).to.be.exist;
    expect(Constants.envs.development).to.be.exist;
    expect(Constants.envs.production).to.be.exist;
  });
});
