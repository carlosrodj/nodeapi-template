import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import morgan from 'morgan';
import helmet from 'helmet';
import yes from 'yes-https';

import routes from './routes';
import Constants from './config/constants';
import NFEProcessorJob from './lib/job/nfe.processor.job';
import authenticate from './middleware/authenticate';
import MailServer from './lib/mailer/mailer.server';

const app = express();

// Helmet helps you secure your Express apps by setting various HTTP headers
// https://github.com/helmetjs/helmet
app.use(helmet());

// Enable CORS with various options
// https://github.com/expressjs/cors
app.use(cors());

// Request logger
// https://github.com/expressjs/morgan
app.use(morgan('dev'));

// Parse incoming request bodies
// https://github.com/expressjs/body-parser

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Lets you use HTTP verbs such as PUT or DELETE
// https://github.com/expressjs/method-override
app.use(methodOverride());

// Mount public routes
app.use('/public', express.static(`${__dirname}/public`));

app.use(authenticate);

// Mount API routes
app.use(Constants.apiPrefix, routes);
if (!Constants.envs.test) {
  NFEProcessorJob.init();
  MailServer.init();
  app.use(yes());
}

const server = app.listen(Constants.port, () => {
  // eslint-disable-next-line no-console
  console.log(`
    Port: ${Constants.port}
    Env: ${app.get('env')}
  `);
});

export { server, app };
