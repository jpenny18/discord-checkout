'use client';

import { useState, useEffect } from 'react';
import { plans } from '../../config/plans';
import { UserData, PaymentMethod } from '../../types';
import Image from 'next/image';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CardPaymentForm from '@/components/CardPaymentForm';
import Link from 'next/link';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [isCryptoExpanded, setIsCryptoExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData>({
    email: '',
    firstName: '',
    lastName: '',
    discordUsername: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [recurringBillingAccepted, setRecurringBillingAccepted] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Add loading effect on initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handlePlanSelect = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!userData.email) errors.email = 'Email is required';
    if (!userData.firstName) errors.firstName = 'First name is required';
    if (!userData.lastName) errors.lastName = 'Last name is required';
    if (!userData.discordUsername) errors.discordUsername = 'Discord username is required';
    if (!termsAccepted) errors.terms = 'You must accept the terms and conditions';
    if (!recurringBillingAccepted) errors.recurring = 'You must accept the recurring billing terms';
    if (!selectedPlan) errors.plan = 'Please select a plan';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid = () => {
    return (
      userData.email &&
      userData.firstName &&
      userData.lastName &&
      userData.discordUsername &&
      termsAccepted &&
      recurringBillingAccepted &&
      selectedPlan
    );
  };

  const handlePaymentSelect = (method: PaymentMethod) => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (method === 'card') {
      setIsCardExpanded(!isCardExpanded);
      setIsCryptoExpanded(false);
    } else {
      setIsCryptoExpanded(!isCryptoExpanded);
      setIsCardExpanded(false);
    }
    setPaymentMethod(method);
  };

  const isCryptoAllowed = selectedPlan?.allowedPaymentMethods.includes('crypto');
  const isCryptoOnly = selectedPlan?.allowedPaymentMethods.length === 1 && selectedPlan.allowedPaymentMethods[0] === 'crypto';
  const showGuarantee = selectedPlan?.id === 'challenger' || selectedPlan?.id === 'hero';
  const finalPrice = paymentMethod === 'crypto' && selectedPlan ? selectedPlan.price * 0.5 : selectedPlan?.price;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCardPayment = async (paymentMethodId: string) => {
    if (!termsAccepted) {
      setFormErrors(prev => ({
        ...prev,
        terms: 'Please accept the terms and conditions'
      }));
      return;
    }

    if (!selectedPlan || !finalPrice) {
      setFormErrors(prev => ({
        ...prev,
        payment: 'Please select a plan first'
      }));
      return;
    }

    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId,
          amount: finalPrice,
          userData: {
            ...userData,
            selectedPlan,
            paymentMethod: 'card',
            timestamp: new Date(),
            status: 'pending'
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        window.location.href = '/success';
      } else if (data.requires_action) {
        // Handle 3D Secure if needed
        setFormErrors(prev => ({
          ...prev,
          payment: 'Additional authentication required. Please try again.'
        }));
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setFormErrors(prev => ({
        ...prev,
        payment: 'Payment failed. Please try again.'
      }));
    }
  };

  const getRecurringText = () => {
    if (!selectedPlan) return '';
    const planConfig = {
      cadet: '99/month',
      challenger: '399/4 months',
      hero: '499/year'
    }[selectedPlan.id.toLowerCase()];
    return `I agree to recurring billing of $${planConfig} until cancelled.`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ffc62d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="mb-4">
            <Image
              src="/images/logo.png"
              alt="Ascendant Academy Logo"
              width={80}
              height={80}
              className="rounded-full"
              priority
            />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Join Ascendant Academy</h1>
            <p className="text-gray-400 text-lg">Ascend to new heights</p>
          </div>
        </div>

        <div className="mb-12 h-[300px] md:h-[400px] bg-gray-900 rounded-lg">
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500">Video Sales Letter</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => handlePlanSelect(plan)}
              className={`w-[300px] mx-auto md:w-full p-6 rounded-xl bg-[#111111] border cursor-pointer transition-all hover:scale-105 ${
                selectedPlan?.id === plan.id
                  ? 'border-[#ffc62d] scale-105'
                  : 'border-gray-700'
              }`}
              style={{ transform: selectedPlan?.id === plan.id ? 'scale(1.05)' : 'scale(1)' }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-3xl font-bold mt-2">
                    ${plan.price}
                    <span className="text-sm text-gray-400">/{plan.duration}</span>
                  </p>
                </div>
                {plan.popular && (
                  <span className="bg-[#ffc62d] text-black text-xs px-2 py-1 rounded">
                    MOST POPULAR
                  </span>
                )}
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <svg
                      className="w-4 h-4 text-[#ffc62d] mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {showGuarantee && (
          <div className="text-center mb-12">
            <p className="text-[#ffc62d] text-sm font-bold">
              200% Guarantee: If our trades don't double your subscription fee by the end of your paid period, 
              we'll refund your subscription plus an additional 100%
            </p>
          </div>
        )}

        <div className="max-w-xl mx-auto mb-12">
          <h2 className="text-xl font-bold mb-6">PERSONAL INFORMATION</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Email address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={userData.email}
                onChange={handleInputChange}
                placeholder="example@gmail.com"
                className={`w-full bg-[#111111] border ${
                  formErrors.email ? 'border-red-500' : 'border-gray-700'
                } rounded px-4 py-2`}
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={userData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="w-full bg-[#111111] border border-gray-700 rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={userData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="w-full bg-[#111111] border border-gray-700 rounded px-4 py-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Discord Username
              </label>
              <input
                type="text"
                name="discordUsername"
                required
                value={userData.discordUsername}
                onChange={handleInputChange}
                placeholder="username#0000"
                className="w-full bg-[#111111] border border-gray-700 rounded px-4 py-2"
              />
            </div>
          </div>
        </div>

        <div className="max-w-xl mx-auto">
          <h2 className="text-xl font-bold mb-2">SELECT PAYMENT</h2>
          {isCryptoAllowed && (
            <p className="text-[#ffc62d] text-sm font-bold mb-4">50% discount when paid in crypto!</p>
          )}

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">
                I accept the{' '}
                <a href="#" className="underline">Terms and Conditions</a>,{' '}
                <a href="#" className="underline">Privacy Policy</a>, and{' '}
                <a href="#" className="underline">Refund/Dispute Policy</a>
              </span>
            </label>
            {formErrors.terms && (
              <p className="text-red-500 text-sm mt-1">{formErrors.terms}</p>
            )}
          </div>

          {selectedPlan && (
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={recurringBillingAccepted}
                  onChange={(e) => setRecurringBillingAccepted(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">{getRecurringText()}</span>
              </label>
              {formErrors.recurring && (
                <p className="text-red-500 text-sm mt-1">{formErrors.recurring}</p>
              )}
            </div>
          )}

          <div className="space-y-4">
            {(!isCryptoOnly) && (
              <div>
                <button
                  onClick={() => handlePaymentSelect('card')}
                  disabled={!isFormValid()}
                  className={`w-full p-4 rounded border transition-colors ${
                    !isFormValid()
                      ? 'opacity-50 cursor-not-allowed bg-gray-800 border-gray-700'
                      : isCardExpanded
                      ? 'border-[#ffc62d] bg-[#111111] rounded-b-none'
                      : 'border-gray-700 bg-[#111111] hover:border-gray-600'
                  } flex items-center justify-between`}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>Join with Credit/Debit Card</span>
                  </div>
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
                </button>

                {isCardExpanded && selectedPlan && typeof finalPrice === 'number' && (
                  <div className="border border-t-0 border-[#ffc62d] rounded-b-lg bg-[#111111] p-4">
                    <Elements stripe={stripePromise}>
                      <CardPaymentForm 
                        onPaymentComplete={handleCardPayment}
                        amount={finalPrice}
                        userData={userData}
                        selectedPlan={selectedPlan}
                      />
                    </Elements>

                    <div className="mt-4 p-4 border border-gray-700 rounded-lg bg-black">
                      <div className="flex justify-between items-center">
                        <span>Total Due:</span>
                        <span className="text-xl font-bold">
                          ${finalPrice} / {selectedPlan.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {isCryptoAllowed && (
              <div>
                <button
                  onClick={() => handlePaymentSelect('crypto')}
                  disabled={!isFormValid()}
                  className={`w-full p-4 rounded border transition-colors ${
                    !isFormValid()
                      ? 'opacity-50 cursor-not-allowed bg-gray-800 border-gray-700'
                      : isCryptoExpanded
                      ? 'border-[#ffc62d] bg-[#111111] rounded-b-none'
                      : 'border-gray-700 bg-[#111111] hover:border-gray-600'
                  } flex items-center justify-between`}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>Join with Crypto</span>
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
                  <div className="border border-t-0 border-[#ffc62d] rounded-b-lg bg-[#111111] p-4 space-y-4">
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!isFormValid()) {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          return;
                        }
                        const form = e.target as HTMLFormElement;
                        const cryptoType = form.cryptoType.value;
                        window.location.href = `/crypto-payment?type=${cryptoType}&amount=${finalPrice}&plan=${selectedPlan?.id}&firstName=${userData.firstName}&lastName=${userData.lastName}&email=${userData.email}&discordUsername=${userData.discordUsername}`;
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-2">Select Cryptocurrency</label>
                        <select 
                          name="cryptoType"
                          className="w-full bg-black border border-gray-700 rounded p-3 text-white"
                          required
                        >
                          <option value="BTC">Bitcoin (BTC)</option>
                          <option value="USDT">USDT (TRC20)</option>
                        </select>
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-[#ffc62d] text-black p-3 rounded-lg font-bold hover:bg-[#e5b228] transition-colors"
                      >
                        Continue to Payment
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 