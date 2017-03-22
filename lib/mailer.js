const nodemailer = require('nodemailer');
const config = require('../config/main');

const transporter = nodemailer.createTransport(config.mail);

module.exports = class Mailer {
  static send(options) {
    const mailOptions = {
      from: '"FastTrac" <admin@localhost>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    transporter.sendMail(mailOptions, (error, info) => {
      console.log(error, `Message sent: ${info.messageId} ${info.response}`);
    });

    return 'OK';
  }
};
