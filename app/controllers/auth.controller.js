import UserModel from '../models/user.model';
import BaseController from './base.controller';
import MailerClient, { EMAIL_TYPES } from '../lib/mailer/mailer.client';

class AuthController extends BaseController {
  authenticate(req, res) {
    res.json(req.currentUser.toJSON());
  }

  recoverPassword(req, res) {
    UserModel.setToken(req.body.email)
      .then((user) => {
        MailerClient.send(user.email, EMAIL_TYPES.recover_password.name, { name: user.name, token: user.token, email: user.email }, null);
        res.sendStatus(200);
      }).catch((err) => {
        res.json(this.formatApiError(err));
      });
  }

  validateToken(req, res) {
    UserModel.isValidToken(req.body.token)
      .then((resp) => {
        resp ? res.sendStatus(200) : res.json({ error: true, message: 'token inválido' });
      }).catch((err) => {
        res.json(this.formatApiError(err));
      });
  }

  updatePassword(req, res) {
    UserModel.updatePassword(req.body.token, req.body.password)
      .then(() => {
        res.sendStatus(200);
      }).catch((err) => {
        res.json(this.formatApiError(err));
      });
  }
}

export default AuthController;
