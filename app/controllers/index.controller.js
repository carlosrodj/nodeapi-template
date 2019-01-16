import BaseController from './base.controller';
import Constants from '../config/constants';

class IndexController extends BaseController {
  static index(req, res) {
    res.json({
      version: Constants.version,
    });
  }
}

export default IndexController;
