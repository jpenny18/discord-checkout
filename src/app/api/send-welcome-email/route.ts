import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Add debug logging for API key presence
console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, password, firstName } = await request.json();

    if (!email || !password || !firstName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Attempting to send email to:', email);
    
    try {
      const result = await resend.emails.send({
        from: 'Ascendant Academy <onboarding@resend.dev>',
        to: email,
        subject: 'Welcome to Ascendant Academy - Your Account Details',
        html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="color-scheme" content="light dark" />
            <meta name="supported-color-schemes" content="light dark" />
            <title>Welcome to Ascendant Academy</title>
            <style>
              /* Reset styles */
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }

              /* Base styles */
              body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                color: #333333;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }

              /* Container */
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
              }

              /* Header */
              .header {
                text-align: center;
                padding: 30px 0;
                background: linear-gradient(135deg, #151515 0%, #1a1a1a 100%);
                border-radius: 8px;
              }

              .header img {
                max-width: 200px;
                height: auto;
                margin-bottom: 20px;
              }

              .header h1 {
                color: #ffc62d;
                font-size: 28px;
                margin: 0;
                line-height: 1.4;
              }

              /* Content */
              .content {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 8px;
                margin: 20px 0;
                border: 1px solid #e0e0e0;
              }

              /* Credentials box */
              .credentials-box {
                background: #f8f9fa;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
              }

              .credentials-box h2 {
                color: #333;
                font-size: 20px;
                margin-bottom: 15px;
              }

              .credentials-box p {
                margin: 10px 0;
                color: #666;
              }

              /* CTA Button */
              .cta-button {
                display: inline-block;
                background-color: #ffc62d;
                color: #1a1a1a !important;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
                margin: 10px 0;
                text-align: center;
                transition: background-color 0.3s ease;
              }

              .cta-button:hover {
                background-color: #e6b325;
              }

              .button-container {
                text-align: center;
                margin: 20px 0;
              }

              /* Footer */
              .footer {
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 12px;
                background: #f8f9fa;
                border-radius: 8px;
              }

              /* Mobile responsiveness */
              @media screen and (max-width: 600px) {
                .container {
                  padding: 10px;
                }

                .content {
                  padding: 15px;
                }

                .header h1 {
                  font-size: 24px;
                }

                .cta-button {
                  width: 100%;
                  padding: 12px 20px;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img
                  src="https://images.squarespace-cdn.com/content/633b282f66006a532ef90a21/58026c80-ad9d-4a80-9a6d-249948356a70/A-removebg-preview.png"
                  alt="Ascendant Academy"
                />
                <h1>Welcome to Ascendant Academy, ${firstName}!</h1>
              </div>

              <div class="content">
                <p style="font-size: 16px; line-height: 1.6; color: #666; margin-bottom: 20px;">
                  Thank you for joining Ascendant Academy! We're excited to have you on board. Your account has been created and you're ready to start your journey.
                </p>

                <div class="credentials-box">
                  <h2>Your Account Details</h2>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Password:</strong> ${password}</p>
                  <p style="color: #ff9800; margin-top: 15px;">
                    For security reasons, we recommend changing your password after your first login.
                  </p>
                </div>

                <div class="button-container">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="cta-button" style="margin-right: 10px;">
                    Access Dashboard
                  </a>
                  <a href="https://discord.gg/vRt4dhGnz3" class="cta-button" style="background-color: #5865F2;">
                    Join Discord Community
                  </a>
                </div>

                <p style="font-size: 16px; line-height: 1.6; color: #666; margin: 20px 0;">
                  Get started by:
                </p>
                <ul style="color: #666; margin-left: 20px; line-height: 1.6;">
                  <li>Logging into your dashboard</li>
                  <li>Joining our Discord community</li>
                  <li>Exploring our educational content</li>
                  <li>Setting up your trading preferences</li>
                </ul>
              </div>

              <div class="footer">
                <p>© ${new Date().getFullYear()} Ascendant Academy. All rights reserved.</p>
                <p style="margin-top: 10px;">support@ascendantacademy.com</p>
              </div>
            </div>
          </body>
        </html>
        `,
      });
      console.log('Email send result:', result);
      return NextResponse.json({ success: true, result });
    } catch (emailError: any) {
      console.error('Resend API Error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email', details: emailError?.message || 'Unknown error' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('General error:', error);
    return NextResponse.json(
      { error: 'Failed to send welcome email', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
} 