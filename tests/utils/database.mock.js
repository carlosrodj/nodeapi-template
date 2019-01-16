import { Mockgoose } from 'mockgoose';
import mongoose from 'mongoose';
import Constants from '../../app/config/constants';


class DatabaseMock {
  static init(callback){
    const mockgoose = new Mockgoose(mongoose);
    mockgoose.prepareStorage().then(() => {
      mongoose.connect(Constants.mongo.uri, (err) => {
        DatabaseMock.mockgoose = mockgoose;
        callback();
      });
    }).catch((err) => {
      callback(err);
    })
  }

  static start(callback){
    if(!DatabaseMock.mockgoose){
      DatabaseMock.init(callback);
    }else{
      callback();
    }
  }

  static end(callback){
    callback();
  }
}

export default DatabaseMock;
