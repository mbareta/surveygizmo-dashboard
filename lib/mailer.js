const nodemailer = require('nodemailer');
const config = require('../config/main');

const transporter = nodemailer.createTransport(config.mail);

module.exports = class Mailer {
  static send(options) {
    return new Promise((resolve, reject) => {
      const mailOptions = {
        from: '"FastTrac" <registration@example.com>',
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
      };

      if (!transporter) reject('SMTP transporter missing.');

      transporter.sendMail(mailOptions, (error, info) => {
        error ? reject(error) : resolve(info);
      });
    });
  }
};
