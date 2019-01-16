import 'babel-polyfill';
import mongoose from 'mongoose';
import uuid from 'uuid';
import bcrypt from 'bcrypt';
import moment from 'moment';
import Constants from '../config/constants';

const { Schema } = mongoose;

const GENRE = { MALE: 'M', FEMALE: 'F' };

const validateEmail = (email) => {
  const emailRegex = /^[-a-z0-9%S_+]+(\.[-a-z0-9%S_+]+)*@(?:[a-z0-9-]{1,63}\.){1,125}[a-z]{2,63}$/i;
  return emailRegex.test(email);
};

const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: validateEmail,
  },
  password: {
    type: String,
    match: [/.{6}.*?/, 'A senha deve ter no mínimo 6 caracteres'],
    required: true,
  },
  token: String,
  token_date: Date,
  genre: {
    type: String,
    enum: Object.values(GENRE),
  },
  email_validated: {
    type: Boolean,
    default: false,
    required: true,
  },
  birth_date: {
    type: Date,
    set: (value) => {
      if (value && typeof value === 'string') {
        value = moment(value, 'DD/MM/YYYY').toDate();
      }
      return value;
    },
  },
  uuid: {
    type: String,
    required: true,
    default: (() => uuid.v4()),
  },
}, {
  timestamps: true,
});

UserSchema.virtual('active').get(function active() {
  return this.email_validated ||
    moment(this.createdAt).isAfter(moment(new Date()).subtract(Constants.user.max_time_await_validate_email, 'hours'));
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform(doc, obj) {
    obj.id = obj.uuid;
    delete obj._id;
    delete obj.__v;
    delete obj.uuid;
    delete obj.password;
    delete obj.token;
    delete obj.token_date;
    delete obj.active;
    obj.createdAt = moment(obj.createdAt).format('DD/MM/YYYY');
    obj.updatedAt = moment(obj.updatedAt).format('DD/MM/YYYY');
    if (obj.birth_date) {
      obj.birth_date = moment(obj.birth_date).format('DD/MM/YYYY');
    }
    return obj;
  },
});

const setToken = (user) => {
  user.token = uuid.v4();
  user.token_date = new Date();
};

const encodePassword = (model, callback) => {
  if (model.isModified('password')) {
    const { saltRounds } = Constants.security;
    model._hashPassword(model.password, saltRounds, (err, hash) => {
      model.password = hash;
      callback();
    });
  } else {
    callback();
  }
};

UserSchema
  .pre('save', function preSave(done) {
    encodePassword(this, () => {
      if (this.isNew) {
        setToken(this);
      }
      done();
    });
  });

UserSchema.path('email')
  .validate(function validate(email) {
    return new Promise((resolve, reject) => {
      UserModel.findByEmail(email)
        .then((user) => {
          !user || user.uuid === this.uuid ? resolve() : reject();
        }).catch((err) => {
          reject(err);
        });
    });
  }, 'Email já em uso');

UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   */
  authenticate(password) {
    return bcrypt.compareSync(password, this.password);
  },

  /**
   * Create password hash
   */
  _hashPassword(password, saltRounds = Constants.security.saltRounds, callback) {
    return bcrypt.hash(password, saltRounds, callback);
  },
};

UserSchema.statics.findByEmail = function findByEmail(email) {
  if (!email) {
    throw new Error('email deve ser informado!');
  }
  return this.findOne({ email });
};

UserSchema.statics.setToken = async function staticSetToken(email) {
  if (!email) {
    throw new Error('email deve ser informado!');
  }
  const user = await this.findOne({ email });
  if (user) {
    setToken(user);
    return user.save();
  }
  throw new Error('email não encontrado');
};

UserSchema.statics.isValidToken = async function staticIsValidToken(token) {
  const user = await this.findOne({ token });
  return user !== null;
};

UserSchema.statics.updatePassword = async function staticUpdatePassword(token, password) {
  const user = await this.findOne({ token });
  if (user) {
    user.password = password;
    user.token = null;
    user.token_date = null;
    user.email_validated = true;
    return user.save();
  }
  throw new Error('token inválido');
};

UserSchema.statics.validateEmail = async function staticValidateEmail(token) {
  const user = await this.findOne({ token });
  if (user) {
    user.email_validated = true;
    user.token = null;
    user.token_date = null;
    return user.save();
  }
  throw new Error('token inválido');
};

UserSchema.statics.validateUser = function staticValidateUser(email, password) {
  return new Promise((resolve, reject) => {
    if (!email) {
      reject(new Error('email deve ser informado!'));
    } else {
      this.findOne({ email }).then((user) => {
        resolve(user && user.authenticate(password) ? user : null);
      }).catch((err) => {
        reject(err);
      });
    }
  });
};


const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

export default UserModel;
export { GENRE };
