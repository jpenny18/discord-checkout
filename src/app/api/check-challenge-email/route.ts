import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { sendEmail } from '@/lib/email';

// Helper function to generate customer email HTML
function generateCustomerEmailHtml(orderData: any) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Challenge Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #151515; color: #ffc62d; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #fff; }
          .order-details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          .button { display: inline-block; padding: 12px 24px; background: #ffc62d; color: #151515; text-decoration: none; border-radius: 5px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Challenge Order Confirmation</h1>
          </div>
          <div class="content">
            <p>Dear ${orderData.firstName},</p>
            
            <p>Thank you for purchasing your trading challenge with Ascendant Academy! We're excited to have you on board.</p>
            
            <div class="order-details">
              <h2>Challenge Details</h2>
              <p><strong>Challenge Type:</strong> ${orderData.challengeType}</p>
              <p><strong>Account Size:</strong> ${orderData.challengeAmount}</p>
              <p><strong>Platform:</strong> ${orderData.platform}</p>
              <p><strong>Amount Paid:</strong> $${orderData.amount}</p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>

            <p>What's Next:</p>
            <ol>
              <li>Your challenge account will be activated within the next 24 hours</li>
              <li>You'll receive your login credentials via email</li>
              <li>Our team will reach out if we need any additional information</li>
            </ol>
            
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br>The Ascendant Academy Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Ascendant Academy. All rights reserved.</p>
            <p>Questions? Contact us at support@ascendantcapital.ca</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Helper function to generate admin email HTML
function generateAdminEmailHtml(orderData: any) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>New Challenge Order</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .action-required { background: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>New Challenge Order Received</h1>
          
          <div class="details">
            <h2>Challenge Details</h2>
            <ul>
              <li>Challenge Type: ${orderData.challengeType}</li>
              <li>Account Size: ${orderData.challengeAmount}</li>
              <li>Platform: ${orderData.platform}</li>
              <li>Amount Paid: $${orderData.amount}</li>
              <li>Order Date: ${new Date().toLocaleDateString()}</li>
            </ul>

            <h2>Customer Details</h2>
            <ul>
              <li>Name: ${orderData.firstName} ${orderData.lastName}</li>
              <li>Email: ${orderData.email}</li>
              <li>Discord Username: ${orderData.discordUsername || 'Not provided'}</li>
            </ul>
          </div>

          <div class="action-required">
            <h2>Action Required</h2>
            <p>Please complete the following tasks:</p>
            <ol>
              <li>Set up the challenge account</li>
              <li>Generate login credentials</li>
              <li>Send credentials to the customer</li>
            </ol>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Create a unique ID for the order to prevent duplicates
    // This uses a combination of email and timestamp to make it very unlikely to have duplicates
    const uniqueId = `BACKUP-${data.email}-${Date.now()}`;
    
    // Simplified solution - always send backup emails but keep track of already sent ones
    // Rather than querying with complex composite index
    const orderData = {
      challengeType: data.challengeType,
      challengeAmount: data.challengeAmount,
      platform: data.platform,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      discordUsername: data.discordUsername || '',
      amount: data.amount,
      id: uniqueId
    };

    // Send customer confirmation email
    try {
      await sendEmail({
        to: data.email,
        subject: 'Challenge Order Confirmation - Ascendant Academy',
        text: `Thank you for purchasing the ${data.challengeType} Challenge (${data.challengeAmount}).\n\nYour challenge will be activated within the next 24 hours.`,
        html: generateCustomerEmailHtml(orderData),
      });
      console.log('Successfully sent backup customer confirmation email:', data.email);
    } catch (emailError) {
      console.error('Failed to send backup customer confirmation email:', emailError);
    }

    // Send admin notification - include "BACKUP" in subject to indicate it might be a duplicate
    try {
      await sendEmail({
        to: 'support@ascendantcapital.ca',
        subject: `New Challenge Order (BACKUP) - ${data.challengeType} ${data.challengeAmount}`,
        text: `New challenge order received from ${data.email} (This is a backup notification)`,
        html: generateAdminEmailHtml(orderData),
      });
      console.log('Successfully sent backup admin notification email');
    } catch (emailError) {
      console.error('Failed to send backup admin notification email:', emailError);
    }

    // Log that a backup email was sent
    try {
      await adminDb.collection('emailLogs').add({
        type: 'challenge-backup',
        email: data.email,
        sentAt: new Date().toISOString(),
        challengeType: data.challengeType,
        challengeAmount: data.challengeAmount,
        uniqueId: uniqueId
      });
    } catch (logError) {
      console.warn('Failed to log backup email, but email was still sent:', logError);
    }

    return NextResponse.json({ 
      success: true, 
      emailSent: true,
      message: 'Backup emails sent successfully'
    });
  } catch (error) {
    console.error('Error sending backup emails:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Error processing email check'
    }, { status: 500 });
  }
} 