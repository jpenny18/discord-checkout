import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

const TRON_API_KEY = process.env.NEXT_PUBLIC_TRONGRID_API_KEY;
const TRON_API_URL = 'https://api.trongrid.io';

export async function POST(request: Request) {
  try {
    const { type, amount, walletAddress, orderId } = await request.json();

    if (type === 'BTC') {
      // Use HTTP polling for BTC instead of WebSocket
      const checkBTCTransaction = async () => {
        try {
          const response = await fetch(
            `https://blockchain.info/address/${walletAddress}?format=json`
          );
          const data = await response.json();
          
          if (data.txs && data.txs[0]) {
            const tx = data.txs[0];
            const outputs = tx.out.filter((output: any) => output.addr === walletAddress);
            const receivedAmount = outputs.reduce((acc: number, output: any) => {
              return acc + (output.value / 100000000); // Convert satoshis to BTC
            }, 0);

            if (Math.abs(receivedAmount - amount) < 0.00001) {
              await adminDb.collection('orders').doc(orderId).update({
                status: 'completed',
                transactionHash: tx.hash
              });
              return NextResponse.json({ success: true, redirect: '/success' });
            }
          }
          
          // Continue polling if no matching transaction found
          setTimeout(checkBTCTransaction, 10000); // Check every 10 seconds
        } catch (error) {
          console.error('Error checking BTC transaction:', error);
          setTimeout(checkBTCTransaction, 10000); // Retry on error
        }
      };

      checkBTCTransaction();
      return NextResponse.json({ success: true, message: 'Monitoring BTC transaction' });
    } else if (type === 'USDT') {
      // Poll for USDT (TRC20) transactions
      const checkTronTransaction = async () => {
        try {
          const response = await fetch(
            `${TRON_API_URL}/v1/accounts/${walletAddress}/transactions/trc20?limit=1`,
            {
              headers: {
                'TRON-PRO-API-KEY': TRON_API_KEY || ''
              }
            }
          );
          const data = await response.json();
          
          if (data.data && data.data[0]) {
            const tx = data.data[0];
            const receivedAmount = Number(tx.value) / 1e6; // Convert from smallest unit
            
            if (Math.abs(receivedAmount - amount) < 0.01) { // Allow small difference
              await adminDb.collection('orders').doc(orderId).update({
                status: 'completed',
                transactionHash: tx.transaction_id
              });
              return NextResponse.json({ success: true, redirect: '/success' });
            }
          }
          
          // Continue polling if no matching transaction found
          setTimeout(checkTronTransaction, 10000); // Check every 10 seconds
        } catch (error) {
          console.error('Error checking TRON transaction:', error);
          setTimeout(checkTronTransaction, 10000); // Retry on error
        }
      };

      checkTronTransaction();
      return NextResponse.json({ success: true, message: 'Monitoring USDT transaction' });
    }

    return NextResponse.json({ success: false, error: 'Invalid crypto type' });
  } catch (error) {
    console.error('Error monitoring crypto payment:', error);
    return NextResponse.json({ success: false, error: 'Failed to monitor payment' });
  }
} 