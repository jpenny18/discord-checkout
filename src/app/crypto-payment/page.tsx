'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import QRCode from 'qrcode.react';

interface CryptoPrice {
  BTC: number;
  USDT: number;
}

function CryptoPaymentContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const amount = Number(searchParams.get('amount'));
  const plan = searchParams.get('plan');
  const firstName = searchParams.get('firstName');
  const lastName = searchParams.get('lastName');
  const email = searchParams.get('email');
  const discordUsername = searchParams.get('discordUsername');

  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice>({ BTC: 0, USDT: 1 });
  const [cryptoAmount, setCryptoAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPriceUpdating, setIsPriceUpdating] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const walletAddresses = {
    BTC: process.env.NEXT_PUBLIC_WALLET_BTC,
    USDT: process.env.NEXT_PUBLIC_WALLET_ADDRESS
  };

  useEffect(() => {
    // Create order and start monitoring when page loads
    const createOrder = async () => {
      try {
        // Check if we already have an orderId in the URL
        const existingOrderId = searchParams.get('orderId');
        if (existingOrderId) {
          setOrderId(existingOrderId);
          startMonitoring(existingOrderId);
          return;
        }

        const response = await fetch('/api/create-crypto-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            userData: {
              firstName,
              lastName,
              email,
              discordUsername,
              selectedPlan: {
                id: plan,
                name: plan,
                duration: plan === 'cadet' ? 'month' : plan === 'challenger' ? '4 months' : 'year'
              }
            },
            cryptoType: type,
          }),
        });

        const data = await response.json();
        if (data.success) {
          setOrderId(data.orderId);
          startMonitoring(data.orderId);
        }
      } catch (error) {
        console.error('Error creating order:', error);
      }
    };

    if (type && amount && plan && firstName && lastName && email && discordUsername) {
      createOrder();
    }
  }, [type, amount, plan, firstName, lastName, email, discordUsername]);

  const startMonitoring = async (newOrderId: string) => {
    try {
      const response = await fetch('/api/monitor-crypto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          amount: cryptoAmount,
          walletAddress: walletAddresses[type as keyof typeof walletAddresses],
          orderId: newOrderId,
        }),
      });

      const data = await response.json();
      if (data.success && data.redirect) {
        window.location.href = data.redirect;
      }
    } catch (error) {
      console.error('Error monitoring payment:', error);
    }
  };

  useEffect(() => {
    // Fetch initial crypto prices
    fetchCryptoPrices(true);

    // Set up interval to fetch prices every 30 seconds
    const interval = setInterval(() => fetchCryptoPrices(false), 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Calculate crypto amount whenever prices update
    if (type && amount) {
      const price = cryptoPrices[type as keyof CryptoPrice];
      if (price) {
        setCryptoAmount(amount / price);
      }
    }
  }, [cryptoPrices, type, amount]);

  const fetchCryptoPrices = async (isInitial: boolean) => {
    try {
      if (!isInitial) setIsPriceUpdating(true);
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether&vs_currencies=usd&api_key=${process.env.NEXT_PUBLIC_CRYPTO_API_KEY}`
      );
      const data = await response.json();
      setCryptoPrices({
        BTC: data.bitcoin.usd,
        USDT: data.tether.usd
      });
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
    } finally {
      if (isInitial) setIsLoading(false);
      if (!isInitial) setIsPriceUpdating(false);
    }
  };

  const walletAddress = type ? walletAddresses[type as keyof typeof walletAddresses] || '' : '';
  
  // Create QR code value with amount
  const qrValue = type === 'BTC' 
    ? `bitcoin:${walletAddress}?amount=${cryptoAmount.toFixed(8)}`
    : `tron:${walletAddress}?token=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t&amount=${cryptoAmount.toFixed(2)}`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ffc62d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-xl mx-auto p-8">
        <div className="flex justify-center mb-8">
          <Image
            src="/images/logo.png"
            alt="Ascendant Academy Logo"
            width={80}
            height={80}
            className="rounded-full"
            priority
          />
        </div>

        <div className="bg-[#111111] border border-[#ffc62d] rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Pay with {type}
          </h1>
          <h2 className="text-xs font-bold mb-6 text-center text-[#ffc62d]">
            Only send the correct asset to the respective address otherwise it will be lost forever (BTC,TRC20)
          </h2>

          <div className="space-y-6">
            <div className="flex justify-center">
              {walletAddress && (
                <div className="bg-white p-4 rounded">
                  <QRCode
                    value={qrValue}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-black p-4 rounded border border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Amount Due (USD):</span>
                  <span className="font-bold">${amount}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Current {type} Price:</span>
                  <div className="flex items-center">
                    <span className="font-bold">${cryptoPrices[type as keyof CryptoPrice]}</span>
                    {isPriceUpdating && (
                      <div className="w-4 h-4 border-2 border-[#ffc62d] border-t-transparent rounded-full animate-spin ml-2"></div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Amount Due ({type}):</span>
                  <span className="font-bold">{cryptoAmount.toFixed(type === 'BTC' ? 8 : 2)}</span>
                </div>
              </div>

              <div className="bg-black p-4 rounded border border-gray-700">
                <p className="text-sm text-gray-400 mb-2">Send exactly:</p>
                <div className="flex items-center justify-between gap-2 bg-[#111111] p-3 rounded">
                  <span className="font-mono text-sm break-all">{cryptoAmount.toFixed(type === 'BTC' ? 8 : 2)} {type}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(cryptoAmount.toFixed(type === 'BTC' ? 8 : 2))}
                    className="text-[#ffc62d] hover:text-[#e5b228] transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-sm text-gray-400 mt-4 mb-2">To address:</p>
                <div className="flex items-center justify-between gap-2 bg-[#111111] p-3 rounded">
                  <span className="font-mono text-sm break-all">{walletAddress}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(walletAddress || '')}
                    className="text-[#ffc62d] hover:text-[#e5b228] transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-gray-400">
              <p>Please note that the {type} amount may change due to price fluctuations.</p>
              <p>The payment will be confirmed automatically once received.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CryptoPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ffc62d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading payment details...</p>
        </div>
      </div>
    }>
      <CryptoPaymentContent />
    </Suspense>
  );
} 