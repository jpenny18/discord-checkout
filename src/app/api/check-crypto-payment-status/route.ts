import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get order from Firestore using admin SDK
    const orderSnapshot = await adminDb
      .collection('orders')
      .where('id', '==', orderId)
      .get();

    if (orderSnapshot.empty) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const orderDoc = orderSnapshot.docs[0];
    const orderData = orderDoc.data();

    return NextResponse.json({
      status: orderData.status,
      orderId: orderData.id,
      amount: orderData.amount,
      metadata: orderData.metadata
    });
  } catch (error) {
    console.error('Error checking payment status:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
} 