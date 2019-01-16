import UserModel from '../models/user.model';
import BaseController from './base.controller';
import MailClient, { EMAIL_TYPES } from '../lib/mailer/mailer.client';

class UserController extends BaseController {
  constructor() {
    super();
    this.whilelist = ['name', 'email', 'password', 'birth_date', 'genre'];
  }

  index(req, res) {
    res.json(req.currentUser.toJSON());
  }

  create(req, res) {
    const userParams = this.filterParams(req.body, this.whilelist);
    this.bindResultModel(new UserModel(userParams).save(), res, (user) => {
      MailClient.send(user.email, EMAIL_TYPES.create_account.name, { token: user.token });
      return user;
    });
  }

  update(req, res) {
    const promise = UserModel.findOneAndUpdate({ email: req.currentUser.email }, this.filterParams(req.body, ['name', 'birth_date', 'genre']), { new: true }).exec();
    this.bindResultModel(promise, res);
  }

  validateEmail(req, res) {
    UserModel.validateEmail(req.body.token)
      .then(() => {
        res.sendStatus(200);
      }).catch((err) => {
        res.json(this.formatApiError(err));
      });
  }
}

export default UserController;
