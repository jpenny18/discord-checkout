import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    
    // Create the order in Firestore
    const orderRef = await adminDb.collection('orders').add({
      ...orderData,
      paymentMethod: 'crypto',
      status: 'pending',
      timestamp: new Date(),
    });

    return NextResponse.json({
      success: true,
      orderId: orderRef.id,
    });
  } catch (error) {
    console.error('Error creating crypto order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 