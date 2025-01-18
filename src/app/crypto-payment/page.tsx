'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import QRCode from 'qrcode.react';
import Image from 'next/image';
import Link from 'next/link';

interface CryptoPrice {
  BTC: number;
  USDT: number;
}

function CryptoPaymentContent() {
  const searchParams = useSearchParams();
  const type = searchParams?.get('type') || '';
  const amount = Number(searchParams?.get('amount')) || 0;
  const plan = searchParams?.get('plan') || '';
  const firstName = searchParams?.get('firstName') || '';
  const lastName = searchParams?.get('lastName') || '';
  const email = searchParams?.get('email') || '';
  const discordUsername = searchParams?.get('discordUsername') || '';
  const orderId = searchParams?.get('orderId') || '';

  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice>({ BTC: 0, USDT: 1 });
  const [isPriceUpdating, setIsPriceUpdating] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const walletAddresses = {
    BTC: process.env.NEXT_PUBLIC_WALLET_BTC || '',
    USDT: process.env.NEXT_PUBLIC_WALLET_ADDRESS || ''
  };

  useEffect(() => {
    const fetchCryptoPrices = async () => {
      setIsPriceUpdating(true);
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether&vs_currencies=usd&x_cg_demo_api_key=${process.env.NEXT_PUBLIC_CRYPTO_API_KEY}`);
        const data = await response.json();
        setCryptoPrices({
          BTC: data.bitcoin.usd,
          USDT: data.tether.usd
        });
      } catch (error) {
        console.error('Error fetching crypto prices:', error);
      }
      setIsPriceUpdating(false);
    };

    fetchCryptoPrices();
    const interval = setInterval(fetchCryptoPrices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (orderId) {
      const checkPayment = async () => {
        try {
          const response = await fetch('/api/monitor-crypto', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderId,
              type,
              amount: cryptoAmount,
              walletAddress: walletAddresses[type as keyof typeof walletAddresses],
            }),
          });

          const data = await response.json();
          if (data.confirmed) {
            setPaymentConfirmed(true);
            window.location.href = '/success';
          }
        } catch (error) {
          console.error('Error checking payment:', error);
        }
      };

      const interval = setInterval(checkPayment, 10000); // Check every 10 seconds
      return () => clearInterval(interval);
    }
  }, [orderId, type, walletAddresses]);

  const cryptoAmount = type === 'BTC' 
    ? amount / cryptoPrices.BTC 
    : amount;

  const qrValue = type === 'BTC' 
    ? `bitcoin:${walletAddresses.BTC}?amount=${cryptoAmount}`
    : walletAddresses.USDT;

  if (paymentConfirmed) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ffc62d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Payment confirmed! Redirecting...</p>
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
              {walletAddresses[type as keyof typeof walletAddresses] && (
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
                  <span className="font-mono text-sm break-all">{walletAddresses[type as keyof typeof walletAddresses]}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(walletAddresses[type as keyof typeof walletAddresses])}
                    className="text-[#ffc62d] hover:text-[#e5b228] transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/checkout"
            className="text-[#ffc62d] hover:text-[#e5b228] transition-colors"
          >
            ← Back to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CryptoPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#ffc62d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading payment details...</p>
          </div>
        </div>
      }
    >
      <CryptoPaymentContent />
    </Suspense>
  );
} 