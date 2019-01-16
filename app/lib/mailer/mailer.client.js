import MailTime from 'mail-time';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const EMAIL_TYPES = {
  create_account: {
    name: 'create_account',
    file: '/templates/create_account.html',
    subject: 'Email de criação de conta',
    accept_params: ['name', 'email', 'token'],
  },
  recover_password: {
    name: 'recover_password',
    file: '/templates/recover_password.html',
    subject: 'Email de recuperação de senha',
    accept_params: ['name', 'email', 'token'],
  },
};

class MailClient {
  static send(to, emailType, params = {}, callback) {
    callback = callback || (() => {});
    if (EMAIL_TYPES[emailType]) {
      MailClient.readFileTemplate(emailType, (err, template) => {
        if (err) return callback(err);
        template = MailClient.replaceParams(emailType, params, template.toString());
        MailClient.sendEmail(to, EMAIL_TYPES[emailType].subject, template);
        return callback();
      });
    } else {
      callback(new Error(`Not emailType configured for ${emailType}`));
    }
  }

  static sendEmail(to, subject, template) {
    MailClient.client.sendMail({
      to,
      subject,
      html: template,
    });
  }

  static readFileTemplate(emailType, callback) {
    fs.readFile(path.join(__dirname, EMAIL_TYPES[emailType].file), callback);
  }

  static replaceParams(emailType, params, template) {
    const acceptedsParams = EMAIL_TYPES[emailType].accept_params;
    acceptedsParams.forEach((acceptedParam) => {
      template = template.replace(new RegExp(`{{${acceptedParam}}}`, 'g'), params[acceptedParam] || '');
    });
    return template;
  }
}

MailClient.client = new MailTime({
  db: mongoose.connections[0],
  type: 'client',
  strategy: 'balancer',
});

export default MailClient;
export { EMAIL_TYPES };
