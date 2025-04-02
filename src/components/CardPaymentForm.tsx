import { useState } from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import type { UserData, Plan } from '@/types/index';

interface Props {
  onPaymentComplete: (paymentMethodId: string) => void;
  amount: number;
  userData: UserData;
  selectedPlan: Plan;
}

export default function CardPaymentForm({ onPaymentComplete, amount, userData, selectedPlan }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const cardStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#ffffff',
        '::placeholder': {
          color: '#666666',
        },
        iconColor: '#ffc62d',
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe is not properly initialized');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const cardNumber = elements.getElement(CardNumberElement);
      if (!cardNumber) {
        throw new Error('Card element not found');
      }

      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumber,
        billing_details: {
          email: userData.email,
          name: `${userData.firstName} ${userData.lastName}`,
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (!paymentMethod) {
        throw new Error('Payment method creation failed');
      }

      // Call onPaymentComplete with the payment method ID
      await onPaymentComplete(paymentMethod.id);
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      
      // Reset the card elements
      const cardNumber = elements.getElement(CardNumberElement);
      const cardExpiry = elements.getElement(CardExpiryElement);
      const cardCvc = elements.getElement(CardCvcElement);
      if (cardNumber) cardNumber.clear();
      if (cardExpiry) cardExpiry.clear();
      if (cardCvc) cardCvc.clear();
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Card Number</label>
          <div className={`p-4 bg-black border rounded transition-colors ${
            error ? 'border-red-500' : 'border-gray-700'
          }`}>
            <CardNumberElement options={cardStyle} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Expiry Date</label>
            <div className={`p-4 bg-black border rounded transition-colors ${
              error ? 'border-red-500' : 'border-gray-700'
            }`}>
              <CardExpiryElement options={cardStyle} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CVC</label>
            <div className={`p-4 bg-black border rounded transition-colors ${
              error ? 'border-red-500' : 'border-gray-700'
            }`}>
              <CardCvcElement options={cardStyle} />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full bg-[#ffc62d] text-black p-3 rounded-lg font-bold transition-all ${
          processing 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-[#e5b228] hover:scale-[1.02] active:scale-[0.98]'
        }`}
      >
        {processing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            Processing...
          </div>
        ) : (
          'Pay Now'
        )}
      </button>
    </form>
  );
} 