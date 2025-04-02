import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase/firestore';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const { paymentMethodId, amount, userData, isSubscription } = await request.json();

    // If this is a subscription request, handle it here
    if (isSubscription) {
      // Create a customer
      const customer = await stripe.customers.create({
        payment_method: paymentMethodId,
        email: userData.email,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      // Create or get product
      const product = await stripe.products.create({
        name: `${userData.accountSize} Trading Arena Trial`,
      });

      // Create a subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: amount * 100, // Convert to cents
              recurring: {
                interval: 'month',
              },
              product: product.id,
            },
          },
        ],
        payment_settings: {
          payment_method_types: ['card'],
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
      });

      // Get the client secret
      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

      // Store the entry in Firebase using adminDb
      const arenaEntry = {
        ...userData,
        customerId: customer.id,
        subscriptionId: subscription.id,
        paymentIntentId: paymentIntent.id,
        amount,
        status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
        timestamp: new Date(), // Use JavaScript Date for admin SDK
      };

      try {
        // Use adminDb instead of client db for server components
        await adminDb.collection('arenaEntries').add(arenaEntry);
      } catch (error) {
        console.error('Firebase error:', error);
        // Don't throw here, as payment is already processed
      }

      // Check if payment requires additional action
      if (paymentIntent.status === 'requires_action') {
        return NextResponse.json({
          requires_action: true,
          payment_intent_client_secret: paymentIntent.client_secret,
          payment_intent_id: paymentIntent.id,
          subscription_id: subscription.id,
        });
      }

      // Payment successful
      return NextResponse.json({
        success: true,
        payment_intent_id: paymentIntent.id,
        subscription_id: subscription.id,
      });
    }

    // Handle one-time payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/trading-arena/checkout/success`,
    });

    // Store the entry in Firebase using adminDb
    const arenaEntry = {
      ...userData,
      paymentIntentId: paymentIntent.id,
      amount,
      status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
      timestamp: new Date(), // Use JavaScript Date for admin SDK
    };

    try {
      // Use adminDb instead of client db for server components
      await adminDb.collection('arenaEntries').add(arenaEntry);
    } catch (error) {
      console.error('Firebase error:', error);
      // Don't throw here, as payment is already processed
    }

    // Check if payment requires additional action
    if (paymentIntent.status === 'requires_action') {
      return NextResponse.json({
        requires_action: true,
        payment_intent_client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
      });
    }

    // Payment successful
    return NextResponse.json({
      success: true,
      payment_intent_id: paymentIntent.id,
    });

  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment failed' },
      { status: 500 }
    );
  }
} 