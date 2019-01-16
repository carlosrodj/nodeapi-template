import UserModel from '../models/user.model';
import Constants from '../config/constants';

const getUserPassword = (authorization) => {
  const auth = authorization.split(' ');
  const buffer = Buffer.from(auth[1], 'base64');
  return buffer.toString().split(':');
};

const validateUser = (plainAuth, req, res, next) => {
  UserModel.validateUser(plainAuth[0], plainAuth[1])
    .then((result) => {
      if (result && result.active) {
        req.currentUser = result;
        next();
      } else {
        res.sendStatus(401);
      }
    }).catch((err) => {
      next(err);
    });
};

const validateAutorization = (authorization, req, res, next) => {
  if (authorization && authorization.length > 0) {
    const plainAuth = getUserPassword(authorization);
    if (plainAuth.length > 0 && plainAuth[0].length > 0 && plainAuth[1] > 0) {
      validateUser(plainAuth, req, res, next);
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
};

export default function authenticate(req, res, next) {
  if (Constants.router.secure_path.test(req.path)) {
    validateAutorization(req.headers.authorization, req, res, next);
  } else {
    next();
  }
}
