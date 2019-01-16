import IndexController from '../controllers/index.controller';

export default {
  '/': { to: IndexController, action: 'index', secure: false },
};
