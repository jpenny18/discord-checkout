import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase-admin';
import { sendEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Helper function to add delay between API calls to avoid rate limits
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

// Check if emails have already been sent for this order
async function emailsAlreadySent(orderId: string): Promise<boolean> {
  try {
    const emailLogsRef = adminDb.collection('emailLogs');
    const snapshot = await emailLogsRef.where('orderId', '==', orderId).limit(1).get();
    return !snapshot.empty;
  } catch (error) {
    console.warn('Error checking emailLogs, will proceed with sending emails:', error);
    return false;
  }
}

// Log that emails were sent for this order
async function logEmailsSent(orderId: string, email: string): Promise<void> {
  try {
    await adminDb.collection('emailLogs').add({
      orderId,
      email,
      sentVia: 'webhook',
      sentAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Error logging email sent status:', error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const sig = headers().get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update order status
        const orders = await adminDb.collection('challengeOrders')
          .where('paymentIntentId', '==', paymentIntent.id)
          .get();

        if (!orders.empty) {
          const order = orders.docs[0];
          const orderData = order.data();
          const orderId = order.id;
          
          // Check if order is already completed (to prevent duplicate processing)
          if (orderData.status === 'completed') {
            console.log('Order already completed, skipping webhook processing:', orderId);
            return NextResponse.json({ received: true, status: 'already_processed' });
          }
          
          // First update the order status
          await order.ref.update({
            status: 'completed',
            completedAt: new Date().toISOString(),
          });
          
          // Check if emails were already sent for this order
          const alreadySent = await emailsAlreadySent(orderId);
          if (alreadySent) {
            console.log('Emails already sent for this order, skipping:', orderId);
            return NextResponse.json({ received: true, status: 'emails_already_sent' });
          }

          // Send customer confirmation email
          try {
            await sendEmail({
              to: orderData.email,
              subject: 'Challenge Order Confirmation - Ascendant Academy',
              text: `Thank you for purchasing the ${orderData.challengeType} Challenge (${orderData.challengeAmount}).\n\nYour challenge will be activated within the next 24 hours.`,
              html: generateCustomerEmailHtml(orderData),
            });
            console.log('Successfully sent customer confirmation email for challenge order:', orderData.email);
            
            // Add a delay before sending the admin email to avoid rate limits
            await delay(1000);
            
          } catch (emailError) {
            console.error('Failed to send customer confirmation email:', emailError);
          }

          // Send admin notification
          try {
            await sendEmail({
              to: 'support@ascendantcapital.ca',
              subject: `New Challenge Order - ${orderData.challengeType} ${orderData.challengeAmount}`,
              text: `New challenge order received from ${orderData.email}`,
              html: generateAdminEmailHtml(orderData),
            });
            console.log('Successfully sent admin notification email for challenge order');
            
            // Log that emails were sent for this order
            await logEmailsSent(orderId, orderData.email);
            
          } catch (emailError) {
            console.error('Failed to send admin notification email:', emailError);
          }
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        
        // Update order status
        const failedOrders = await adminDb.collection('challengeOrders')
          .where('paymentIntentId', '==', failedPayment.id)
          .get();

        if (!failedOrders.empty) {
          const order = failedOrders.docs[0];
          const orderData = order.data();
          const orderId = order.id;
          
          // Check if order is already marked as failed (to prevent duplicate processing)
          if (orderData.status === 'failed') {
            console.log('Order already marked as failed, skipping webhook processing:', orderId);
            return NextResponse.json({ received: true, status: 'already_processed' });
          }
          
          // First update the order status
          await order.ref.update({
            status: 'failed',
            failedAt: new Date().toISOString(),
          });
          
          // Check if emails were already sent for this order
          const alreadySent = await emailsAlreadySent(orderId);
          if (alreadySent) {
            console.log('Emails already sent for this order, skipping:', orderId);
            return NextResponse.json({ received: true, status: 'emails_already_sent' });
          }

          // Send failure notification
          try {
            await sendEmail({
              to: orderData.email,
              subject: 'Challenge Order Payment Failed - Ascendant Academy',
              text: `Your payment for the ${orderData.challengeType} Challenge (${orderData.challengeAmount}) has failed. Please try again or contact support if you need assistance.`,
              html: `
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8" />
                    <title>Payment Failed</title>
                    <style>
                      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                      .alert { background: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
                      .button { display: inline-block; padding: 12px 24px; background: #ffc62d; color: #151515; text-decoration: none; border-radius: 5px; font-weight: bold; }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <h1>Payment Failed</h1>
                      <div class="alert">
                        <p>Your payment for the ${orderData.challengeType} Challenge (${orderData.challengeAmount}) was unsuccessful.</p>
                      </div>
                      <p>Please try the following:</p>
                      <ul>
                        <li>Check your payment method details</li>
                        <li>Ensure you have sufficient funds</li>
                        <li>Try again with a different payment method</li>
                      </ul>
                      <p>If you continue to experience issues, please contact our support team at support@ascendantcapital.ca</p>
                      
                      <p style="text-align: center; margin-top: 30px;">
                        <a href="/dashboard/challenge" class="button">Try Again</a>
                      </p>
                    </div>
                  </body>
                </html>
              `,
            });
            console.log('Successfully sent payment failure email:', orderData.email);
            
            // Log that emails were sent for this order
            await logEmailsSent(orderId, orderData.email);
            
          } catch (emailError) {
            console.error('Failed to send payment failure email:', emailError);
          }
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 