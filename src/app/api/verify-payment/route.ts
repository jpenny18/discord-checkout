import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { adminDb } from '@/lib/firebase-admin';
import type { Stripe } from 'stripe';

export async function POST(request: Request) {
  try {
    const { paymentIntentId, subscriptionId } = await request.json();

    if (!paymentIntentId) {
      throw new Error('Payment intent ID is required');
    }

    // Retrieve the payment intent and subscription
    const [paymentIntent, subscription] = await Promise.all([
      stripe.paymentIntents.retrieve(paymentIntentId, {
        expand: ['customer']
      }),
      subscriptionId ? stripe.subscriptions.retrieve(subscriptionId) : null
    ]);

    if (paymentIntent.status !== 'succeeded') {
      throw new Error(`Payment failed with status: ${paymentIntent.status}`);
    }

    // Create order in Firestore
    const orderRef = await adminDb.collection('orders').add({
      amount: paymentIntent.amount / 100,
      paymentMethod: 'card',
      stripeCustomerId: paymentIntent.customer,
      stripePaymentIntentId: paymentIntent.id,
      stripeSubscriptionId: subscription?.id || null,
      status: 'completed',
      timestamp: new Date(),
      plan: paymentIntent.metadata.plan || 'Unknown Plan',
      duration: paymentIntent.metadata.duration || 'N/A',
      discordUsername: paymentIntent.metadata.discordUsername || 'N/A',
      isRecurring: !!subscription,
      billingInterval: subscription?.items.data[0]?.price.recurring?.interval || null,
      billingIntervalCount: subscription?.items.data[0]?.price.recurring?.interval_count || null,
      email: paymentIntent.metadata.email || '',
      firstName: paymentIntent.metadata.firstName || '',
      lastName: paymentIntent.metadata.lastName || '',
    });

    // Send confirmation email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (baseUrl) {
      try {
        await fetch(`${baseUrl}/api/send-confirmation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: paymentIntent.metadata.email,
            name: `${paymentIntent.metadata.firstName} ${paymentIntent.metadata.lastName}`,
            orderId: orderRef.id,
            plan: paymentIntent.metadata.plan || 'Unknown Plan',
            amount: paymentIntent.amount / 100,
            discordUsername: paymentIntent.metadata.discordUsername,
            isRecurring: !!subscription,
            billingInterval: subscription?.items.data[0]?.price.recurring?.interval,
            billingIntervalCount: subscription?.items.data[0]?.price.recurring?.interval_count
          }),
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      orderId: orderRef.id,
      redirectUrl: '/success'
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Payment verification failed',
      },
      { status: 500 }
    );
  }
} 