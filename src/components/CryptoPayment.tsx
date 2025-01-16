import { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { CryptoPayment as CryptoPaymentType, CryptoType } from '@/types';

interface Props {
  amount: number;
  cryptoType: CryptoType;
  orderId: string;
  onSuccess: (transactionId: string) => void;
}

export default function CryptoPayment({ amount, cryptoType, orderId, onSuccess }: Props) {
  const [cryptoData, setCryptoData] = useState<CryptoPaymentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const fetchCryptoPrice = async () => {
      try {
        const walletAddress = cryptoType === 'BTC' 
          ? process.env.NEXT_PUBLIC_WALLET_BTC 
          : process.env.NEXT_PUBLIC_WALLET_ADDRESS;

        if (!walletAddress) {
          throw new Error(`Missing wallet address for ${cryptoType}`);
        }

        // Fetch price based on crypto type
        const cryptoId = cryptoType === 'BTC' ? 'bitcoin' : 'tether';
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd`
        );
        const data = await response.json();
        const cryptoPrice = data[cryptoId].usd;
        
        const cryptoAmount = amount / cryptoPrice;
        
        setCryptoData({
          amount: cryptoAmount,
          cryptoType,
          walletAddress,
          orderId,
        });
      } catch (error) {
        console.error('Error fetching crypto price:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoPrice();
  }, [amount, cryptoType, orderId]);

  // Verify transaction every 30 seconds
  useEffect(() => {
    if (!cryptoData) return;

    const verifyTransaction = async () => {
      try {
        setVerifying(true);
        const response = await fetch('/api/verify-crypto-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            orderId: cryptoData.orderId,
            cryptoType: cryptoData.cryptoType 
          }),
        });

        const data = await response.json();
        if (data.success && data.transactionId) {
          onSuccess(data.transactionId);
        }
      } catch (error) {
        console.error('Error verifying transaction:', error);
      } finally {
        setVerifying(false);
      }
    };

    const interval = setInterval(verifyTransaction, 30000);
    return () => clearInterval(interval);
  }, [cryptoData, onSuccess]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffc62d]" />
      </div>
    );
  }

  if (!cryptoData) {
    return (
      <div className="text-center text-red-500">
        Error loading crypto payment data
      </div>
    );
  }

  const qrValue = cryptoType === 'BTC' 
    ? `bitcoin:${cryptoData.walletAddress}?amount=${cryptoData.amount}`
    : cryptoData.walletAddress;

  return (
    <div className="max-w-xl mx-auto p-6 bg-[#111111] rounded-lg border border-gray-700">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">
          Send {cryptoData.amount.toFixed(8)} {cryptoData.cryptoType}
        </h3>
        <p className="text-gray-400">≈ ${amount.toFixed(2)} USD</p>
      </div>

      <div className="flex justify-center mb-6">
        <QRCode
          value={qrValue}
          size={200}
          level="H"
          includeMargin
          className="bg-white p-2 rounded"
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {cryptoType === 'BTC' ? 'BTC Address' : 'USDT Address (ERC-20)'}
          </label>
          <div className="flex">
            <input
              type="text"
              readOnly
              value={cryptoData.walletAddress}
              className="flex-1 bg-black border border-gray-700 rounded-l px-4 py-2"
            />
            <button
              onClick={() => navigator.clipboard.writeText(cryptoData.walletAddress)}
              className="bg-[#ffc62d] text-black px-4 rounded-r hover:bg-[#e5b228] transition-colors font-medium"
            >
              Copy
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Amount to Send</label>
          <div className="flex">
            <input
              type="text"
              readOnly
              value={`${cryptoData.amount.toFixed(8)} ${cryptoData.cryptoType}`}
              className="flex-1 bg-black border border-gray-700 rounded-l px-4 py-2"
            />
            <button
              onClick={() => navigator.clipboard.writeText(cryptoData.amount.toString())}
              className="bg-[#ffc62d] text-black px-4 rounded-r hover:bg-[#e5b228] transition-colors font-medium"
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-400">
        {verifying && (
          <p className="text-[#ffc62d] mb-2">Verifying your transaction...</p>
        )}
        <p>Please account for gas fees when sending.</p>
        <p className="mt-2">
          Do not close this page. Allow up to 90 seconds for your transfer to complete.
        </p>
      </div>
    </div>
  );
} 