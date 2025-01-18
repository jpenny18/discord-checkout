import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { db } from '../../../lib/firebase-admin';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

// This is necessary to handle raw webhook data
export const config = {
  api: {
    bodyParser: false,
  },
};

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
        
        // Store subscription data in Firebase
        await db.collection('subscriptions').doc(subscription.id).set({
          customerId: subscription.customer,
          email: (customer as Stripe.Customer).email,
          status: subscription.status,
          planId: subscription.items.data[0].price.id,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          createdAt: new Date(),
        });

        console.log('Subscription created:', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update subscription status in Firebase
        await db.collection('subscriptions').doc(subscription.id).update({
          status: 'cancelled',
          cancelledAt: new Date(),
          endDate: new Date(subscription.current_period_end * 1000)
        });

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

          // You might want to send an email to the customer here
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
          metadata: paymentIntent.metadata // This will include any custom data we attached
        });

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