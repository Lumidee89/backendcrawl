<<<<<<< HEAD
// services/email.js
=======
>>>>>>> f5a0024 (first commit)
const transporter = require('../config/smtp');

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
<<<<<<< HEAD
      from: process.env.FROM_EMAIL, // Sender's email address
      to, // Recipient's email address
=======
      from: process.env.FROM_EMAIL, 
      to, 
>>>>>>> f5a0024 (first commit)
      subject,
      text,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};

module.exports = sendEmail;
