import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // Or your preferred service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendChatNotification = async (to: string, senderName: string, message: string) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ Email credentials not set. Skipping notification.');
      return;
  }

  const mailOptions = {
    from: `"FYPMS Messenger" <${process.env.EMAIL_USER}>`,
    to,
    subject: `New Message from ${senderName}`,
    text: `You have a new message from ${senderName} regarding the FYP project:\n\n"${message}"\n\nPlease log in to the portal to reply.`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #003366;">New Academic Message</h2>
        <p><b>${senderName}</b> sent you a message:</p>
        <blockquote style="background: #f4f4f4; padding: 15px; border-left: 5px solid #003366;">
          ${message}
        </blockquote>
        <p>Please log in to the FYPMS Registry Portal to reply.</p>
        <hr style="border: 0; border-top: 1px solid #eee;" />
        <small style="color: #666;">NSBM Green University | Faculty of Computing</small>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('📧 Notification email sent to:', to);
  } catch (err) {
    console.error('❌ Failed to send email:', err);
  }
};
