import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Fallback to manually reading .env.local if the Next.js server wasn't restarted
const getEnvVar = (key: string) => {
  if (process.env[key]) return process.env[key];
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const content = fs.readFileSync(envPath, 'utf8');
    const line = content.split('\n').find(l => l.startsWith(`${key}=`));
    if (line) return line.split('=')[1].trim().replace(/['"]/g, '');
  } catch (e) {
    return undefined;
  }
};

let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: getEnvVar('EMAIL_USER'),
      pass: getEnvVar('EMAIL_PASS'),
    },
  });
  return transporter;
};

export const sendOTP = async (to: string, otp: string) => {
  const sender = getEnvVar('EMAIL_USER');
  const mailOptions = {
    from: sender,
    to,
    subject: 'Your DevJourney Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaeb; border-radius: 12px; text-align: center;">
        <h2 style="color: #1a1a1a;">Welcome to DevJourney!</h2>
        <p style="color: #4a4a4a; font-size: 16px;">Please use the following verification code to complete your registration:</p>
        <div style="background-color: #f4f4f5; padding: 20px; border-radius: 8px; margin: 24px 0;">
          <h1 style="color: #6366f1; margin: 0; font-size: 32px; letter-spacing: 4px;">${otp}</h1>
        </div>
        <p style="color: #71717a; font-size: 14px;">This code will expire in 10 minutes.</p>
        <p style="color: #71717a; font-size: 12px; margin-top: 32px;">If you didn't request this code, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    await getTransporter().sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};
