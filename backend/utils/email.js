const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or any other email provider
    auth: {
      user: process.env.EMAIL,  // Your email (e.g., from Gmail)
      pass: process.env.EMAIL_PASSWORD,  // Your email password (use environment variables for security)
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.log('Error sending email:', error);
  }
};

module.exports = sendEmail;
