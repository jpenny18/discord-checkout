import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, name, orderId, plan, amount, discordUsername } = await request.json();

    // Here you would integrate with your email service (e.g., SendGrid, AWS SES, etc.)
    // For now, we'll just log the email details
    console.log('Sending confirmation email to:', email, {
      name,
      orderId,
      plan,
      amount,
      discordUsername,
    });

    // In production, you would send an actual email here
    // Example email content:
    const emailContent = `
      Dear ${name},

      Thank you for joining Ascendant Academy! Your payment has been processed successfully.

      Order Details:
      - Order ID: ${orderId}
      - Plan: ${plan}
      - Amount: $${amount}
      - Discord Username: ${discordUsername}

      Next Steps:
      1. Join our Discord server using your registered username (${discordUsername})
      2. Check your Discord DMs for login credentials
      3. Access your training materials through our platform
      4. Schedule your onboarding call

      If you have any questions, please don't hesitate to reach out to our support team.

      Welcome to the community!

      Best regards,
      Ascendant Academy Team
    `;

    console.log('Email content:', emailContent);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send confirmation email' },
      { status: 500 }
    );
  }
} 