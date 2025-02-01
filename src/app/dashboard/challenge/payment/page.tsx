'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CardPaymentForm from '@/components/CardPaymentForm';
import ChallengeCryptoPayment from '@/components/ChallengeCryptoPayment';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface ChallengeData {
  type: string;
  amount: string;
  platform: string;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    discordUsername?: string;
  };
  price: string;
}

const validateChallengeData = (data: ChallengeData | null): boolean => {
  if (!data) return false;
  
  // Required fields
  const requiredFields = [
    data.type,
    data.amount,
    data.platform,
    data.price,
    data.formData.firstName,
    data.formData.lastName,
    data.formData.email,
    data.formData.phone,
    data.formData.country
  ];
  
  return requiredFields.every(field => field && field.trim() !== '');
};

export default function PaymentPage() {
  const router = useRouter();
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto' | null>(null);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [isCryptoExpanded, setIsCryptoExpanded] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem('challengeData');
    if (!storedData) {
      router.push('/dashboard/challenge');
      return;
    }
    
    const parsedData = JSON.parse(storedData);
    if (!validateChallengeData(parsedData)) {
      router.push('/dashboard/challenge');
      return;
    }
    
    setChallengeData(parsedData);
  }, [router]);

  const getCryptoPrice = () => {
    if (!challengeData?.price) return 0;
    return Math.round(Number(challengeData.price) * 0.75); // 25% discount
  };

  const handlePaymentSelect = (method: 'card' | 'crypto') => {
    if (method === 'card') {
      setIsCardExpanded(!isCardExpanded);
      setIsCryptoExpanded(false);
    } else {
      setIsCryptoExpanded(!isCryptoExpanded);
      setIsCardExpanded(false);
    }
    setPaymentMethod(method);
  };

  if (!challengeData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ffc62d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      {isProcessingPayment && <PaymentProcessingOverlay />}
      {/* Order Overview */}
      <div className="max-w-3xl mx-auto bg-[#1a1a1a] rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Order Overview</h2>
        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b border-gray-700">
            <span>Order number</span>
            <span>{Math.floor(Math.random() * 10000000)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-700">
            <span>Account Size</span>
            <span>{challengeData.amount}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-700">
            <span>Account Type</span>
            <span>{challengeData.type}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-700">
            <span>Platform</span>
            <span>{challengeData.platform}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-700">
            <span>Trading Account Currency</span>
            <span>USD</span>
          </div>
          <div className="flex justify-between py-2 text-xl font-semibold">
            <span>To be paid</span>
            <span>${challengeData.price}</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
        <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
        
        {/* Card Payment Button */}
        <div className="space-y-4">
          <div>
            <button
              onClick={() => handlePaymentSelect('card')}
              className={`w-full p-4 rounded border transition-colors ${
                isCardExpanded
                  ? 'border-[#ffc62d] bg-[#111111] rounded-b-none'
                  : 'border-gray-700 bg-[#111111] hover:border-gray-600'
              } flex items-center justify-between`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Pay with Credit/Debit Card</span>
              </div>
              <div className="flex items-center gap-4">
                <svg
                  className={`w-6 h-6 transform transition-transform ${
                    isCardExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            {isCardExpanded && (
              <div className="border border-t-0 border-[#ffc62d] rounded-b-lg bg-[#111111] p-4">
          <Elements stripe={stripePromise}>
            <CardPaymentForm
                    onPaymentComplete={async (paymentMethodId: string) => {
                      try {
                        setIsProcessingPayment(true);
                        setFormErrors({});

                        // Create a payment intent
                        const response = await fetch('/api/create-challenge-payment', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            paymentMethodId,
                            amount: Number(challengeData.price),
                            metadata: {
                              type: 'challenge',
                challengeType: challengeData.type,
                challengeAmount: challengeData.amount,
                platform: challengeData.platform,
                              ...challengeData.formData,
                              paymentMethod: 'card'
                            }
                          }),
                        });

                        if (!response.ok) {
                          const errorData = await response.json();
                          throw new Error(errorData.error || 'Payment failed');
                        }

                        const result = await response.json();

                        // Initialize payment using the client secret
                        const stripe = await stripePromise;
                        if (!stripe) throw new Error('Stripe not initialized');

                        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
                          result.clientSecret
                        );

                        if (confirmError) {
                          throw new Error(confirmError.message);
                        }

                        if (!paymentIntent) {
                          throw new Error('No payment intent returned');
                        }

                        // Handle different payment intent statuses
                        switch (paymentIntent.status) {
                          case 'succeeded':
                            // Store success data in session storage for the success page
                            sessionStorage.setItem('paymentSuccess', JSON.stringify({
                              orderId: paymentIntent.id,
                              amount: challengeData.price,
                              challengeType: challengeData.type,
                              paymentMethod: 'card'
                            }));
                            
                            // Ensure Firebase has time to update
                            await new Promise(resolve => setTimeout(resolve, 2000));
                            router.push('/dashboard/challenge/success');
                            break;
                            
                          case 'requires_action':
                          case 'requires_confirmation':
                            // Handle 3D Secure authentication if needed
                            const { error: authError } = await stripe.confirmCardPayment(result.clientSecret);
                            if (authError) {
                              throw new Error('Authentication failed: ' + authError.message);
                            }
                            // After successful authentication, redirect to success
                            router.push('/dashboard/challenge/success');
                            break;
                            
                          default:
                            throw new Error(`Payment status: ${paymentIntent.status}`);
                        }
                      } catch (error) {
                        console.error('Payment error:', error);
                        setFormErrors(prev => ({
                          ...prev,
                          payment: error instanceof Error ? error.message : 'Payment processing failed. Please try again.'
                        }));
                        setIsProcessingPayment(false);
                      }
                    }}
                    amount={Number(challengeData.price)}
                    userData={{
                      firstName: challengeData.formData.firstName,
                      lastName: challengeData.formData.lastName,
                      email: challengeData.formData.email,
                      discordUsername: challengeData.formData.discordUsername || ''
                    }}
                    selectedPlan={{
                      id: 'challenge',
                      name: `${challengeData.type} ${challengeData.amount}`,
                      price: Number(challengeData.price),
                      duration: 'one-time',
                      features: [],
                      popular: false,
                      allowedPaymentMethods: ['card', 'crypto']
              }}
            />
          </Elements>

                {formErrors.payment && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
                    <p className="text-red-500 text-sm">{formErrors.payment}</p>
        </div>
      )}

                <div className="mt-4 p-4 border border-gray-700 rounded-lg bg-black">
                  <div className="flex justify-between items-center">
                    <span>Total Due:</span>
                    <span className="text-xl font-bold">
                      ${challengeData.price}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Crypto Payment Button */}
          <div>
            <button
              onClick={() => handlePaymentSelect('crypto')}
              className={`w-full p-4 rounded border transition-colors ${
                isCryptoExpanded
                  ? 'border-[#ffc62d] bg-[#111111] rounded-b-none'
                  : 'border-gray-700 bg-[#111111] hover:border-gray-600'
              } flex items-center justify-between`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M9 8h6m-6 4h6m-6 4h6m-3-4h3m-6 0h3m-3-4h3m-6 4h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Pay with Crypto (25% off)</span>
              </div>
              <svg
                className={`w-6 h-6 transform transition-transform ${
                  isCryptoExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isCryptoExpanded && (
              <div className="border border-t-0 border-[#ffc62d] rounded-b-lg bg-[#111111] p-4">
          <ChallengeCryptoPayment
            amount={getCryptoPrice()}
                  onClose={() => setIsCryptoExpanded(false)}
            metadata={{
              challengeType: challengeData.type,
              challengeAmount: challengeData.amount,
              platform: challengeData.platform,
                    ...challengeData.formData
            }}
          />
        </div>
      )}
          </div>
        </div>
      </div>
    </div>
  );
} 