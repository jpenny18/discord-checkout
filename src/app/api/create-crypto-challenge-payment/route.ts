import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { v4 as uuidv4 } from 'uuid';

const WALLET_ADDRESSES = {
  BTC: process.env.NEXT_PUBLIC_WALLET_BTC!,
  USDT: process.env.NEXT_PUBLIC_WALLET_ADDRESS!
};

export async function POST(request: Request) {
  try {
    const { amount, metadata } = await request.json();

    if (!amount || !metadata) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch current crypto prices
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether&vs_currencies=usd&x_cg_demo_api_key=${process.env.NEXT_PUBLIC_CRYPTO_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch crypto prices');
    }
    
    const priceData = await response.json();

    const btcPrice = priceData.bitcoin.usd;
    const usdtPrice = priceData.tether.usd;

    // Calculate crypto amounts (amount is already discounted)
    const btcAmount = (amount / btcPrice).toFixed(8);
    const usdtAmount = (amount / usdtPrice).toFixed(2);

    // Generate order ID
    const orderId = uuidv4();

    // Create order in Firestore using admin SDK
    await adminDb.collection('orders').add({
      id: orderId,
      amount: amount, // Already discounted amount
      btcAmount,
      usdtAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
      metadata: {
        ...metadata,
        paymentMethod: 'crypto',
        originalAmount: amount / 0.75 // Store the original amount before discount
      }
    });

    return NextResponse.json({
      orderId,
      btcAmount,
      usdtAmount,
      paymentAddress: {
        BTC: WALLET_ADDRESSES.BTC,
        USDT: WALLET_ADDRESSES.USDT
      },
      status: 'pending'
    });
  } catch (error) {
    console.error('Error creating crypto payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
} 