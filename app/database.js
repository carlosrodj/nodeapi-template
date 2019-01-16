import mongoose from 'mongoose';
import Constants from './config/constants';

// Use native promises
mongoose.Promise = global.Promise;

mongoose.connection.on('error', (err) => {
  throw err;
});

mongoose.connect(Constants.mongo.uri);
