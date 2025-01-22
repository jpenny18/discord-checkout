import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase';
import { sendEmail } from '@/lib/email';
import { getFirestore } from 'firebase-admin/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const endpointSecret = process.env.STRIPE_CHALLENGE_WEBHOOK_SECRET;
const firestore = getFirestore();

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = headers();
    const sig = headersList.get('stripe-signature');

    let event: Stripe.Event;

    try {
      if (!sig || !endpointSecret) throw new Error('Missing signature or endpoint secret');
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update order status
        const orders = await firestore.collection('challengeOrders')
          .where('paymentIntentId', '==', paymentIntent.id)
          .get();

        if (!orders.empty) {
          const order = orders.docs[0];
          await order.ref.update({
            status: 'completed',
            completedAt: new Date().toISOString(),
          });

          // Send confirmation email
          const orderData = order.data();
          await sendEmail({
            to: orderData.email,
            subject: 'Your ACI Challenge Payment Confirmation',
            text: `Thank you for purchasing the ${orderData.challengeType} Challenge (${orderData.challengeAmount}).\n\nYour challenge will be activated within the next 24 hours.`,
            html: `
              <h1>Thank you for your purchase!</h1>
              <p>Your ${orderData.challengeType} Challenge (${orderData.challengeAmount}) has been confirmed.</p>
              <p>Your challenge will be activated within the next 24 hours.</p>
              <p>Platform: ${orderData.platform}</p>
              <p>Amount Paid: $${orderData.amount}</p>
            `,
          });
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        
        // Update order status
        const failedOrders = await firestore.collection('challengeOrders')
          .where('paymentIntentId', '==', failedPayment.id)
          .get();

        if (!failedOrders.empty) {
          const order = failedOrders.docs[0];
          await order.ref.update({
            status: 'failed',
            failedAt: new Date().toISOString(),
          });

          // Send failure notification
          const orderData = order.data();
          await sendEmail({
            to: orderData.email,
            subject: 'ACI Challenge Payment Failed',
            text: `Your payment for the ${orderData.challengeType} Challenge (${orderData.challengeAmount}) has failed. Please try again or contact support if you need assistance.`,
            html: `
              <h1>Payment Failed</h1>
              <p>Your payment for the ${orderData.challengeType} Challenge (${orderData.challengeAmount}) was unsuccessful.</p>
              <p>Please try again or contact our support team if you need assistance.</p>
            `,
          });
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