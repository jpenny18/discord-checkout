import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase-admin';
import { sendEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const dynamic = 'force-dynamic';

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

export async function POST(request: NextRequest) {
  try {
    const { paymentMethodId, amount, metadata } = await request.json();

    if (!paymentMethodId) {
      throw new Error('Payment method ID is required');
    }

    // First, try to retrieve existing customers with this email
    const customerName = `${metadata.firstName} ${metadata.lastName}`;
    const customers = await stripe.customers.list({
      email: metadata.email,
      limit: 1,
    });

    let customer;
    if (customers.data.length > 0) {
      // Use existing customer
      customer = customers.data[0];
      
      // Check if payment method is already attached
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customer.id,
        type: 'card',
      });
      
      // If this payment method isn't attached to this customer, attach it
      if (!paymentMethods.data.find(pm => pm.id === paymentMethodId)) {
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: customer.id,
        });
      }
    } else {
      // Create new customer
      customer = await stripe.customers.create({
        payment_method: paymentMethodId,
        email: metadata.email,
        name: customerName,
      });
    }

    // Set the customer's default payment method
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      customer: customer.id,
      payment_method: paymentMethodId,
      metadata: {
        type: 'challenge',
        challengeType: metadata.challengeType,
        challengeAmount: metadata.challengeAmount,
        platform: metadata.platform,
        email: metadata.email,
        firstName: metadata.firstName,
        lastName: metadata.lastName,
        discordUsername: metadata.discordUsername || ''
      },
      confirm: true, // Confirm the payment immediately
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/challenge/success`,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    });

    // Store the challenge order in Firestore with the correct status
    const isPaymentSuccessful = paymentIntent.status === 'succeeded';
    const orderRef = await adminDb.collection('challengeOrders').add({
      paymentIntentId: paymentIntent.id,
      amount,
      status: isPaymentSuccessful ? 'completed' : 'pending',
      challengeType: metadata.challengeType,
      challengeAmount: metadata.challengeAmount,
      platform: metadata.platform,
      createdAt: new Date().toISOString(),
      email: metadata.email,
      firstName: metadata.firstName,
      lastName: metadata.lastName,
      discordUsername: metadata.discordUsername || '',
      stripeCustomerId: customer.id
    });

    // If payment is successful, send emails directly (don't rely only on webhook)
    if (isPaymentSuccessful) {
      const orderData = {
        id: orderRef.id,
        amount,
        challengeType: metadata.challengeType,
        challengeAmount: metadata.challengeAmount,
        platform: metadata.platform,
        email: metadata.email,
        firstName: metadata.firstName,
        lastName: metadata.lastName,
        discordUsername: metadata.discordUsername || '',
        stripeCustomerId: customer.id,
        paymentIntentId: paymentIntent.id
      };

      // Send customer confirmation email
      try {
        await sendEmail({
          to: metadata.email,
          subject: 'Challenge Order Confirmation - Ascendant Academy',
          text: `Thank you for purchasing the ${metadata.challengeType} Challenge (${metadata.challengeAmount}).\n\nYour challenge will be activated within the next 24 hours.`,
          html: generateCustomerEmailHtml(orderData),
        });
        console.log('Successfully sent customer confirmation email for challenge order:', metadata.email);
        
        // Add a delay before sending the admin email to avoid rate limits
        await delay(1000);
        
      } catch (emailError) {
        console.error('Failed to send customer confirmation email:', emailError);
      }

      // Send admin notification
      try {
        await sendEmail({
          to: 'support@ascendantcapital.ca',
          subject: `New Challenge Order - ${metadata.challengeType} ${metadata.challengeAmount}`,
          text: `New challenge order received from ${metadata.email}`,
          html: generateAdminEmailHtml(orderData),
        });
        console.log('Successfully sent admin notification email for challenge order');
      } catch (emailError) {
        console.error('Failed to send admin notification email:', emailError);
      }
    }

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error creating payment' },
      { status: 500 }
    );
  }
} 