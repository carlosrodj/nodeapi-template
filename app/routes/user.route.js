import UserController from '../controllers/user.controller';

export default {
  '/user': { to: UserController, action: 'index' },
  '/user POST': { to: UserController, action: 'create', secure: false },
  '/user PUT': { to: UserController, action: 'update' },
  '/user/validate_email POST': { to: UserController, action: 'validateEmail', secure: false },
};
