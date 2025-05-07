const sgMail = require('@sendgrid/mail');

// Set the API key
sgMail.setApiKey(process.env.SMTP_PASSWORD);

const sendEmail = async options => {
  const msg = {
    to: options.email, // Recipient email
    from: process.env.FROM_EMAIL, // Verified sender email
    subject: options.subject, // Email subject
    text: options.message, // Email body
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error.response ? error.response.body : error.message);
    throw new Error('Email sending failed');
  }
};

module.exports = sendEmail;
