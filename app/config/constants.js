import path from 'path';
import merge from 'lodash/merge';
import pkg from '../../package.json';

// Default configuations applied to all environments
const defaultConfig = {
  env: process.env.NODE_ENV || 'development',
  get envs() {
    return {
      test: (process.env.NODE_ENV || 'development').trim() === 'test',
      development: (process.env.NODE_ENV || 'development').trim() === 'development',
      production: (process.env.NODE_ENV || 'development').trim() === 'production',
    };
  },
  router: {
    secure_path: /^[/]secure.*/,
  },
  user: {
    max_time_await_validate_email: 48, // Tempo máximo em horas que o usuário pode logar sem validar o email.
  },
  version: pkg.version,
  root: path.normalize(`${__dirname}/../../..`),
  port: process.env.PORT || 4567,
  ip: process.env.IP || '0.0.0.0',
  apiPrefix: '', // Could be /api/resource or /api/v2/resource
  userRoles: ['guest', 'user', 'admin'],

  /**
   * MongoDB configuration options
   */
  mongo: {
    seed: true,
    options: {
      db: {
        safe: true,
      },
    },
  },

  /**
   * Security configuation options regarding sessions, authentication and hashing
   */
  security: {
    sessionSecret: process.env.SESSION_SECRET || '233e52505e7c041b3e73966f4f393cca06f694022b9374d35491f34b0bbf1442c9638eec9951d3be811c0e27dd2d4b58859eab9009e6b51bb8cc0c965dcc30bf',
    sessionExpiration: process.env.SESSION_EXPIRATION || 60 * 60 * 24 * 7, // 1 week
    saltRounds: process.env.SALT_ROUNDS || 12,
  },
};

// Environment specific overrides
const environmentConfigs = {
  development: {
    mongo: {
      port: 17469,
      uri: process.env.MONGO_URI || 'mongodb://userbd:senhabd@ds127329.mlab.com:17469/bancodev',
    },
  },
  test: {
    mongo: {
      port: 17469,
      uri: process.env.MONGO_URI || 'mongodb://userbd:senhabd@ds127329.mlab.com:17469/bancotest',
    },
  },
  production: {
    mongo: {
      port: 17469,
      uri: process.env.MONGO_URI || 'mongodb://userbd:senhabd@ds127329.mlab.com:17469/bancoprod',
    },
  },
};

// Recursively merge configurations
export default merge(defaultConfig, environmentConfigs[process.env.NODE_ENV] || {});
