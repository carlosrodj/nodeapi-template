import chai from 'chai';
import chaiHttp from 'chai-http';
import {app, server} from '../../app/server';

chai.use(chaiHttp);

export default chai.request(app);
export {server};
