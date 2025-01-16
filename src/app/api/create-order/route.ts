import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { userData, amount, paymentMethod, customerId, selectedPlan } = await request.json();

    // Create order in Firestore
    const orderRef = await adminDb.collection('orders').add({
      ...userData,
      amount,
      paymentMethod,
      stripeCustomerId: customerId,
      status: 'completed',
      timestamp: new Date(),
      plan: selectedPlan.name || 'Unknown Plan',
      duration: selectedPlan.duration || 'N/A',
    });

    // Send confirmation email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.warn('NEXT_PUBLIC_BASE_URL is not defined, skipping confirmation email');
    } else {
      try {
        await fetch(`${baseUrl}/api/send-confirmation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userData.email,
            name: `${userData.firstName} ${userData.lastName}`,
            orderId: orderRef.id,
            plan: selectedPlan.name || 'Unknown Plan',
            amount,
            discordUsername: userData.discordUsername,
          }),
        });
      } catch (emailError) {
        // Log the error but don't fail the order creation
        console.error('Failed to send confirmation email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      orderId: orderRef.id,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create order',
      },
      { status: 500 }
    );
  }
} 