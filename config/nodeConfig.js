
const nodemailer = require('nodemailer');

const nodemailerConfig = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: "theskytrails@gmail.com",
    pass: "whewbkjroqyiirsw",
  }
});

module.exports = nodemailerConfig;
