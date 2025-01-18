import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { db } from '../../../lib/firebase-admin';
import sgMail from '@sendgrid/mail';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// This is necessary to handle raw webhook data
export const config = {
  api: {
    bodyParser: false,
  },
};

async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.SENDGRID_API_KEY) return;
  
  try {
    await sgMail.send({
      to,
      from: 'support@ascendantcapital.ca', // Updated sender email
      subject,
      html,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const signature = req.headers['stripe-signature']!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const rawBody = await buffer(req);

  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );

    console.log('Processing webhook event:', event.type);

    switch (event.type) {
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        const customerEmail = (customer as Stripe.Customer).email;
        
        // Store subscription data in Firebase
        await db.collection('subscriptions').doc(subscription.id).set({
          customerId: subscription.customer,
          email: customerEmail,
          status: subscription.status,
          planId: subscription.items.data[0].price.id,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          createdAt: new Date(),
        });

        // Send welcome email
        if (customerEmail) {
          await sendEmail(
            customerEmail,
            'Welcome to Ascendant Academy!',
            `
            <h1>Welcome to Ascendant Academy!</h1>
            <p>Your subscription has been successfully activated.</p>
            <p>You'll receive instructions for accessing our Discord community shortly.</p>
            <p>If you have any questions, please don't hesitate to reach out to our support team.</p>
            `
          );
        }

        console.log('Subscription created:', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        const customerEmail = (customer as Stripe.Customer).email;
        
        // Update subscription status in Firebase
        await db.collection('subscriptions').doc(subscription.id).update({
          status: 'cancelled',
          cancelledAt: new Date(),
          endDate: new Date(subscription.current_period_end * 1000)
        });

        // Send cancellation email
        if (customerEmail) {
          await sendEmail(
            customerEmail,
            'Subscription Cancelled - Ascendant Academy',
            `
            <h1>Subscription Cancelled</h1>
            <p>Your subscription has been cancelled as requested.</p>
            <p>You'll continue to have access until the end of your current billing period.</p>
            <p>We hope to see you back soon!</p>
            `
          );
        }

        console.log('Subscription cancelled:', subscription.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Update subscription status and log failed payment
        if (invoice.subscription) {
          await db.collection('subscriptions').doc(invoice.subscription as string).update({
            status: 'past_due',
            lastFailedPayment: {
              date: new Date(),
              amount: invoice.amount_due,
              error: 'Payment failed'
            }
          });

          // Send failed payment email
          if (invoice.customer_email) {
            await sendEmail(
              invoice.customer_email,
              'Payment Failed - Action Required',
              `
              <h1>Payment Failed</h1>
              <p>We were unable to process your payment for Ascendant Academy.</p>
              <p>Please update your payment method to maintain access to our services.</p>
              <p>Amount due: $${(invoice.amount_due / 100).toFixed(2)}</p>
              <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard">Update Payment Method</a></p>
              `
            );
          }

          console.log('Payment failed for subscription:', invoice.subscription);
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Log successful payment
        await db.collection('payments').add({
          paymentIntentId: paymentIntent.id,
          customerId: paymentIntent.customer,
          amount: paymentIntent.amount,
          status: 'succeeded',
          createdAt: new Date(),
          metadata: paymentIntent.metadata
        });

        // Send payment confirmation email
        if (paymentIntent.receipt_email) {
          await sendEmail(
            paymentIntent.receipt_email,
            'Payment Confirmation - Ascendant Academy',
            `
            <h1>Payment Confirmation</h1>
            <p>We've received your payment of $${(paymentIntent.amount / 100).toFixed(2)}.</p>
            <p>Thank you for your continued membership with Ascendant Academy!</p>
            `
          );
        }

        console.log('Payment succeeded:', paymentIntent.id);
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    // Return a 200 response to acknowledge receipt of the webhook
    res.json({ received: true });

  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
}