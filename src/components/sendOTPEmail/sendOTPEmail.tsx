import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function sendOtpEmail(to: string, otp: string) {
  await resend.emails.send({
    from: 'Your App <onboarding@resend.dev>',
    to,
    subject: 'Your OTP Code',
    html: `
      <p>Your verification code is:</p>
      <h2>${otp}</h2>
      <p>This code will expire in 10 minutes.</p>
    `
  });
  console.log(`✅ OTP sent to ${to}`);
}
