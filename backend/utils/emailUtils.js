const nodemailer = require('nodemailer');

// Create and export the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Replace with your email service
  auth: {
    user: process.env.EMAIL_USER,  // Uses environment variables for security
    pass: process.env.EMAIL_PASS
  }
});

// function to send an email
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email address
    to,                          // Recipient's email address
    subject,                     // Email subject line
    text                         // Email body text
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
