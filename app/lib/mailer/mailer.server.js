import MailTime from 'mail-time';
import mongoose from 'mongoose';
import transports from './transport';
import Constants from '../../config/constants';

class MailServer {
  static init() {
    if (!MailServer.server) {
      MailServer.server = new MailTime({
        db: mongoose.connections[0],
        type: 'server',
        strategy: 'balancer',
        transports,
        concatEmails: true,
        concatDelimiter: '<h1>{{{subject}}}</h1>',
        template: MailTime.Template,
        debug: !Constants.envs.production,
      });
    }
  }
}

export default MailServer;
