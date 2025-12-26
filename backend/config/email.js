const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

const sendBookingConfirmation = async (booking) => {
  const html = `
    <h1>Booking Confirmation - Urban Bistro</h1>
    <p>Dear ${booking.customerName},</p>
    <p>Your table reservation has been confirmed!</p>
    <h3>Booking Details:</h3>
    <ul>
      <li><strong>Date:</strong> ${booking.date}</li>
      <li><strong>Time:</strong> ${booking.time}</li>
      <li><strong>Guests:</strong> ${booking.guests}</li>
      <li><strong>Table:</strong> ${booking.tableName}</li>
      <li><strong>Booking ID:</strong> ${booking.id}</li>
    </ul>
    <p>We look forward to serving you!</p>
    <p>Best regards,<br>Urban Bistro Team</p>
  `;
  
  return sendEmail(booking.email, 'Booking Confirmation - Urban Bistro', html);
};

module.exports = {
  sendEmail,
  sendBookingConfirmation
};
