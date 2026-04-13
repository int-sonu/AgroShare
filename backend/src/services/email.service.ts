import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetEmail = async (email: string, resetUrl: string) => {
  await transporter.sendMail({
    from: `"Support" <${process.env.EMAIL_USER}>`,

    to: email,
    subject: 'Password Reset',
    html: `
      <h2>Password Reset</h2>
      <p>Click below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link expires in 10 minutes.</p>
      
    `,
  });
};

export const sendReservationExpiredEmail = async (email: string, machineName: string) => {
  await transporter.sendMail({
    from: `"Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reservation Expired',
    html: `
      <h2>Reservation Expired</h2>
      <p>Your reservation for <strong>${machineName}</strong> has expired as the payment was not completed within 6 hours.</p>
      <p>The machine is now available for others to book.</p>
    `,
  });
};
