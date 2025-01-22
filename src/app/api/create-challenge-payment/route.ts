import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const dynamic = 'force-dynamic';

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
    await adminDb.collection('challengeOrders').add({
      paymentIntentId: paymentIntent.id,
      amount,
      status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
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

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error creating payment' },
      { status: 500 }
    );
  }
} 