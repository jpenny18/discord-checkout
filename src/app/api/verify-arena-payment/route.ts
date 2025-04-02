import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const { paymentIntentId } = await request.json();

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      try {
        // Use adminDb to query and update Firestore
        const querySnapshot = await adminDb
          .collection('arenaEntries')
          .where('paymentIntentId', '==', paymentIntentId)
          .get();

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          await adminDb
            .collection('arenaEntries')
            .doc(doc.id)
            .update({
              status: 'completed',
              completedAt: new Date(),
            });
        }
      } catch (error) {
        console.error('Firebase query error:', error);
        // Still return success as payment was completed
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Payment not completed' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
} 