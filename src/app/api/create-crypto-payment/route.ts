import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { amount, userData, cryptoType } = await request.json();

    // Create an order with pending status
    const orderRef = await adminDb.collection('orders').add({
      ...userData,
      amount,
      paymentMethod: 'crypto',
      cryptoType, // 'USDT' or 'BTC'
      status: 'pending',
      timestamp: new Date(),
      walletAddress: cryptoType === 'BTC' 
        ? process.env.NEXT_PUBLIC_WALLET_BTC 
        : process.env.NEXT_PUBLIC_WALLET_ADDRESS,
    });

    return NextResponse.json({
      success: true,
      orderId: orderRef.id,
      walletAddress: cryptoType === 'BTC' 
        ? process.env.NEXT_PUBLIC_WALLET_BTC 
        : process.env.NEXT_PUBLIC_WALLET_ADDRESS,
    });
  } catch (error) {
    console.error('Crypto payment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create crypto payment' },
      { status: 500 }
    );
  }
} 