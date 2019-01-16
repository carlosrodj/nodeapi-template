import AuthController from '../controllers/auth.controller';

export default {
  '/auth': { to: AuthController, action: 'authenticate' },
  '/auth/recover POST': { to: AuthController, action: 'recoverPassword', secure: false },
  '/auth/validate_token POST': { to: AuthController, action: 'validateToken', secure: false },
  '/auth/update_password POST': { to: AuthController, action: 'updatePassword', secure: false },

};
