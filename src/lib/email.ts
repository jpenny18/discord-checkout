import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailParams {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail({ to, subject, text, html }: EmailParams) {
  try {
    const result = await resend.emails.send({
      from: 'Ascendant Academy <support@ascendantcapital.ca>',
      to,
      subject,
      text,
      html,
    });

    if (result.error) {
      throw result.error;
    }

    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
} 