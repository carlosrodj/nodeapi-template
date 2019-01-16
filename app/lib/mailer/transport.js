import nodemailer from 'nodemailer';

const transports = [];

transports.push(nodemailer.createTransport({
  host: 'smtp.gmail.com',
  from: 'jjohnys.teste@gmail.com',
  auth: {
    user: 'jjohnys.teste@gmail.com',
    pass: 'paamasdfnafu123**sda1$$',
  },
}));

export default transports;
