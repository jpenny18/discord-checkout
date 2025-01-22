'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { useRouter } from 'next/navigation';

interface ChallengeCryptoPaymentProps {
  amount: number;
  onClose: () => void;
  metadata: {
    challengeType: string;
    challengeAmount: string;
    platform: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function ChallengeCryptoPayment({ amount, onClose, metadata }: ChallengeCryptoPaymentProps) {
  const [cryptoAmount, setCryptoAmount] = useState({ btc: '0', usdt: '0' });
  const [selectedCrypto, setSelectedCrypto] = useState<'BTC' | 'USDT'>('BTC');
  const [paymentAddresses, setPaymentAddresses] = useState<{
    BTC: string;
    USDT: string;
  }>({ BTC: '', USDT: '' });
  const [orderStatus, setOrderStatus] = useState<'pending' | 'confirmed' | 'failed'>('pending');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initializeCryptoPayment = async () => {
      try {
        setIsInitializing(true);
        // Create a new crypto payment order
        const response = await fetch('/api/create-crypto-challenge-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            metadata: {
              ...metadata,
              type: 'challenge',
              paymentMethod: 'crypto'
            },
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to initialize payment');
        }

        setOrderId(data.orderId);
        setCryptoAmount({
          btc: data.btcAmount,
          usdt: data.usdtAmount,
        });
        setPaymentAddresses(data.paymentAddress);

        // Start polling for payment status
        const interval = setInterval(async () => {
          try {
            const statusResponse = await fetch(`/api/check-crypto-payment-status?orderId=${data.orderId}`);
            if (!statusResponse.ok) {
              throw new Error('Failed to check payment status');
            }
            
            const statusData = await statusResponse.json();

            if (statusData.status === 'confirmed') {
              setOrderStatus('confirmed');
              setIsProcessing(true);
              clearInterval(interval);
              
              // Store success data in session storage
              sessionStorage.setItem('paymentSuccess', JSON.stringify({
                orderId: data.orderId,
                amount: amount,
                challengeType: metadata.challengeType,
                paymentMethod: 'crypto'
              }));

              // Ensure Firebase has time to update
              await new Promise(resolve => setTimeout(resolve, 2000));
              router.push('/dashboard/challenge/success');
            } else if (statusData.status === 'failed') {
              setOrderStatus('failed');
              clearInterval(interval);
            }
          } catch (error) {
            console.error('Error checking payment status:', error);
          }
        }, 5000);

        return () => clearInterval(interval);
      } catch (error) {
        console.error('Error initializing crypto payment:', error);
        setOrderStatus('failed');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeCryptoPayment();
  }, [amount, metadata, router]);

  const handleCryptoChange = (crypto: 'BTC' | 'USDT') => {
    setSelectedCrypto(crypto);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Add payment processing overlay
  const PaymentProcessingOverlay = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] p-8 rounded-lg max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 border-4 border-[#ffc62d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h3 className="text-xl font-semibold mb-2">Processing Payment</h3>
        <p className="text-gray-400">Please do not close this window. Your payment is being processed...</p>
      </div>
    </div>
  );

  if (isInitializing) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-12 h-12 border-4 border-[#ffc62d] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentAddress = selectedCrypto === 'BTC' ? paymentAddresses.BTC : paymentAddresses.USDT;
  const currentAmount = selectedCrypto === 'BTC' ? cryptoAmount.btc : cryptoAmount.usdt;
  
  // Only include amount in QR for BTC, USDT just needs the address
  const qrValue = selectedCrypto === 'BTC'
    ? `bitcoin:${currentAddress}?amount=${currentAmount}`
    : currentAddress;

  return (
    <div className="space-y-6">
      {isProcessing && <PaymentProcessingOverlay />}
      
      <div className="text-center">
        <h3 className="text-lg font-medium text-white">Pay with Cryptocurrency</h3>
        <p className="mt-2 text-sm text-gray-400">
          Send exactly {currentAmount} {selectedCrypto} to the address below
        </p>
        <p className="mt-1 text-sm text-[#ffc62d]">25% Discount Applied</p>
        {selectedCrypto === 'USDT' && (
          <p className="mt-1 text-sm text-gray-400">
            Important: Send only TRC20 USDT to this address
          </p>
        )}
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => handleCryptoChange('BTC')}
          className={`px-4 py-2 rounded-lg ${
            selectedCrypto === 'BTC'
              ? 'bg-[#ffc62d] text-black'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          Bitcoin (BTC)
        </button>
        <button
          onClick={() => handleCryptoChange('USDT')}
          className={`px-4 py-2 rounded-lg ${
            selectedCrypto === 'USDT'
              ? 'bg-[#ffc62d] text-black'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          USDT (TRC20)
        </button>
      </div>

      <div className="flex justify-center">
        <div className="bg-white p-4 rounded-lg">
          <QRCode value={qrValue} size={200} />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-400">Payment Address:</p>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={currentAddress}
            readOnly
            className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg"
          />
          <button
            onClick={() => copyToClipboard(currentAddress)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-400">Amount to Send:</p>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={`${currentAmount} ${selectedCrypto}`}
            readOnly
            className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg"
          />
          <button
            onClick={() => copyToClipboard(currentAmount)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Copy
          </button>
        </div>
      </div>

      {orderStatus === 'confirmed' && (
        <div className="text-center text-green-500">
          Payment confirmed! Redirecting...
        </div>
      )}

      {orderStatus === 'failed' && (
        <div className="text-center text-red-500">
          Payment failed. Please try again or contact support.
        </div>
      )}

      <div className="mt-6 text-sm text-gray-400">
        <p>Important Notes:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Send only {selectedCrypto} to this address</li>
          <li>Payment will be confirmed after network confirmation</li>
          <li>This window will automatically update once payment is received</li>
        </ul>
      </div>
    </div>
  );
} 