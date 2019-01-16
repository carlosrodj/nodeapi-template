import { Router } from 'express';
import path from 'path';
import merge from 'lodash/merge';
import fs from 'fs';

import errorHandler from './middleware/errorhandler';

const routes = new Router();

routes.use(errorHandler);

class Route {
  constructor() {
    this.routesBind = [];
  }

  findRoutesFiles() {
    fs.readdirSync(path.join(__dirname, 'routes')).forEach((file) => {
      this.bindFileRoute(file);
    });
  }
  /* eslint-disable */
  bindFileRoute(file) {
    this.routesBind.push(require(path.join(__dirname, "routes", file)));
  }
  /* eslint-enable */

  bindRoutes() {
    this.routesBind.forEach((route) => {
      Route.bindRoute(route);
    });
  }

  static bindRoute(route) {
    Object.keys(route.default).map((pathRoute) => {
      let configs = route.default[pathRoute];
      configs = merge({ secure: true }, configs);
      const splitPath = pathRoute.split(' ');
      let method = splitPath.length === 1 ? 'GET' : splitPath[1];
      method = method.toLocaleLowerCase();
      routes[method](configs.secure ? `/secure${splitPath[0]}` : splitPath[0], Route.bindFunctionTo(configs));
    });
  }

  /* eslint-disable */
  static bindFunctionTo(configs) {
    return (req, res, next) => {
      if(configs.to[configs.action]){
        configs.to[configs.action](req, res, next);
      }else{
        new configs.to()[configs.action](req, res, next);
      }

    };
  }
  /* eslint-enable */

  init() {
    this.findRoutesFiles();
    this.bindRoutes();
  }
}

new Route().init();

export default routes;
