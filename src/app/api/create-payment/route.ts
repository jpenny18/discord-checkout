import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { adminDb } from '@/lib/firebase-admin';

const PLAN_CONFIGS = {
  cadet: {
    amount: 99 * 100, // $99 in cents
    interval: 'month' as const,
    intervalCount: 1
  },
  challenger: {
    amount: 399 * 100, // $399 in cents
    interval: 'month' as const,
    intervalCount: 4
  },
  hero: {
    amount: 499 * 100, // $499 in cents
    interval: 'year' as const,
    intervalCount: 1
  }
} as const;

type PlanId = keyof typeof PLAN_CONFIGS;

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { paymentMethodId, amount, userData } = await request.json();

    if (!userData.selectedPlan) {
      throw new Error('No plan selected');
    }

    // First, try to retrieve existing customers with this email
    const customerName = `${userData.firstName} ${userData.lastName}`;
    const customers = await stripe.customers.list({
      email: userData.email,
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
        email: userData.email,
        name: customerName,
      });
    }

    // Set the customer's default payment method
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    const planId = userData.selectedPlan.id.toLowerCase() as PlanId;
    const planConfig = PLAN_CONFIGS[planId];
    if (!planConfig) {
      throw new Error('Invalid plan selected');
    }

    // Create or get price for the plan
    const priceId = await createOrRetrievePrice(planId, planConfig);

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { 
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription'
      },
      off_session: true,
      metadata: {
        plan: userData.selectedPlan.name || 'Unknown Plan',
        duration: userData.selectedPlan.duration || 'N/A',
        discordUsername: userData.discordUsername || 'N/A',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName
      },
      expand: ['latest_invoice.payment_intent'],
    });

    const invoice = subscription.latest_invoice as any;
    const paymentIntent = invoice.payment_intent;

    if (!paymentIntent) {
      throw new Error('No payment intent found');
    }

    // Confirm the payment intent immediately
    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method: paymentMethodId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    });

    if (confirmedPaymentIntent.status === 'requires_action') {
      return NextResponse.json({
        success: false,
        requires_action: true,
        payment_intent_client_secret: confirmedPaymentIntent.client_secret,
        payment_intent_id: confirmedPaymentIntent.id,
        subscription_id: subscription.id
      });
    }

    if (confirmedPaymentIntent.status === 'succeeded') {
      // Create order in Firestore
      const orderRef = await adminDb.collection('orders').add({
        ...userData,
        amount: planConfig.amount / 100,
        paymentMethod: 'card',
        stripeCustomerId: customer.id,
        stripeSubscriptionId: subscription.id,
        stripePaymentIntentId: confirmedPaymentIntent.id,
        status: 'completed',
        timestamp: new Date(),
        plan: userData.selectedPlan.name || 'Unknown Plan',
        duration: userData.selectedPlan.duration || 'N/A',
        isRecurring: true,
        billingInterval: planConfig.interval,
        billingIntervalCount: planConfig.intervalCount
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
              email: userData.email,
              name: customerName,
              orderId: orderRef.id,
              plan: userData.selectedPlan.name || 'Unknown Plan',
              amount: planConfig.amount / 100,
              discordUsername: userData.discordUsername,
              isRecurring: true,
              billingInterval: planConfig.interval,
              billingIntervalCount: planConfig.intervalCount
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
    }

    throw new Error(`Payment failed with status: ${confirmedPaymentIntent.status}`);

  } catch (error: any) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Payment failed',
        code: error.code,
      },
      { status: 500 }
    );
  }
}

async function createOrRetrievePrice(planId: string, config: typeof PLAN_CONFIGS[PlanId]) {
  // First, try to find an existing price
  const prices = await stripe.prices.list({
    lookup_keys: [planId],
    active: true,
    limit: 1,
  });

  if (prices.data.length > 0) {
    return prices.data[0].id;
  }

  // If no price exists, create a new one
  const price = await stripe.prices.create({
    unit_amount: config.amount,
    currency: 'usd',
    recurring: {
      interval: config.interval,
      interval_count: config.intervalCount,
    },
    product_data: {
      name: `Ascendant Academy ${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
    },
    lookup_key: planId,
  });

  return price.id;
} 