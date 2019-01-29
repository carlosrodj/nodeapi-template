import nodemailer from 'nodemailer';

const transports = [];

transports.push(nodemailer.createTransport({
  host: 'smtp.gmail.com',
  from: 'emaildeenvio@gmail.com',
  auth: {
    user: 'emaildeenvio@gmail.com',
    pass: 'senhadoemail',
  },
}));

export default transports;
