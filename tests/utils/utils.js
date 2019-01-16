class Utils{
  static bindCatch(promise, done){
    return promise.catch((err) => {
      done(err);
    });
  }

  static promiseWithError(){
    return new Promise((resolve, reject) => {
      reject(new Error('Fake error'));
    });
  }
}

export default Utils;
