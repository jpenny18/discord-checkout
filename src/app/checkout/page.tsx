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
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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
      setIsProcessingPayment(true);
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
      
      if (data.requires_action) {
        // Handle 3D Secure authentication
        const stripe = await stripePromise;
        if (!stripe) throw new Error('Stripe not initialized');

        const { error, paymentIntent } = await stripe.confirmCardPayment(
          data.payment_intent_client_secret
        );

        if (error) {
          throw new Error(error.message);
        }

        // Verify the payment was successful
        const verifyResponse = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: data.payment_intent_id,
            subscriptionId: data.subscription_id
          }),
        });

        const verifyData = await verifyResponse.json();
        if (verifyData.success) {
          window.location.href = verifyData.redirectUrl;
        } else {
          throw new Error(verifyData.error || 'Payment verification failed');
        }
      } else if (data.success) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error(data.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setFormErrors(prev => ({
        ...prev,
        payment: error instanceof Error ? error.message : 'Payment failed. Please try again.'
      }));
    } finally {
      setIsProcessingPayment(false);
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
          <p className="text-gray-400">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {isProcessingPayment && <PaymentProcessingOverlay />}
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

        <div className="flex justify-center mb-12">
          <div className="w-full max-w-[600px] aspect-video relative">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/WH0lkXUojOA?autoplay=1&mute=1&controls=1&rel=0&showinfo=0&modestbranding=1&loop=1&playlist=WH0lkXUojOA&playsinline=1&iv_load_policy=3"
              title="Join Now"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className="relative mb-8 -mx-4 px-4 md:mx-0 md:px-0 plans-section">
          <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto pt-8 pb-8 px-4 md:px-0 md:overflow-visible md:pb-0 snap-x snap-mandatory">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => handlePlanSelect(plan)}
                className={`flex-none w-[300px] md:w-full p-6 rounded-xl bg-[#111111] border cursor-pointer transition-all hover:scale-105 snap-center ${
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
        </div>

        {showGuarantee && (
          <div className="text-center mb-12">
            <p className="text-[#ffc62d] text-sm font-bold">
              <span className="text-base md:text-sm">
                200% Guarantee: If our trades don't double your subscription fee by the end of your paid period, 
                we'll refund your subscription plus an additional 100%
              </span>
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
                <Link href="/terms" className="underline text-[#ffc62d] hover:text-[#e5b228]">Terms and Conditions</Link>,{' '}
                <Link href="/privacy" className="underline text-[#ffc62d] hover:text-[#e5b228]">Privacy Policy</Link>, and{' '}
                <Link href="/refund" className="underline text-[#ffc62d] hover:text-[#e5b228]">Refund/Dispute Policy</Link>
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
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!isFormValid()) {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          return;
                        }
                        const form = e.target as HTMLFormElement;
                        const cryptoType = form.cryptoType.value;

                        try {
                          const response = await fetch('/api/create-crypto-payment', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              amount: finalPrice,
                              userData: {
                                firstName: userData.firstName,
                                lastName: userData.lastName,
                                email: userData.email,
                                discordUsername: userData.discordUsername,
                                selectedPlan: {
                                  id: selectedPlan?.id,
                                  name: selectedPlan?.name,
                                  duration: selectedPlan?.duration
                                }
                              },
                              cryptoType,
                            }),
                          });

                          const data = await response.json();
                          if (data.success) {
                            window.location.href = `/crypto-payment?type=${cryptoType}&amount=${finalPrice}&plan=${selectedPlan?.id}&firstName=${userData.firstName}&lastName=${userData.lastName}&email=${userData.email}&discordUsername=${userData.discordUsername}&orderId=${data.orderId}`;
                          }
                        } catch (error) {
                          console.error('Error creating crypto order:', error);
                        }
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

        {/* Reviews Section */}
        <div className="max-w-7xl mx-auto mt-24 md:mt-32">
          <h2 className="text-xl md:text-3xl font-bold mb-8 text-center">See what other people are saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Review 1 */}
            <div className="bg-[#111111] rounded-lg p-4 md:p-6 hover:scale-[1.02] transition-transform">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#ffc62d] rounded-full flex items-center justify-center text-black font-bold text-lg md:text-xl">
                  M
                </div>
                <div>
                  <div className="font-medium">Michael Chen</div>
                  <div className="flex text-[#ffc62d]">
                    {"★".repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 mb-3 text-sm md:text-base">
                Started with zero trading knowledge. Within 3 months, I've learned more than I did in a year of trying to figure it out alone. The mentorship and community support are invaluable.
              </p>
              <p className="text-gray-500 text-xs md:text-sm">Written Jan 10, 2025, 2 months after purchase</p>
            </div>

            {/* Review 2 */}
            <div className="bg-[#111111] rounded-lg p-4 md:p-6 hover:scale-[1.02] transition-transform">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl">
                  S
                </div>
                <div>
                  <div className="font-medium">Sarah Williams</div>
                  <div className="flex text-[#ffc62d]">
                    {"★".repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 mb-3 text-sm md:text-base">
                The 200% guarantee caught my attention, but the quality of education kept me here. Already doubled my initial investment following their strategy.
              </p>
              <p className="text-gray-500 text-xs md:text-sm">Written Dec 28, 2024, 3 months after purchase</p>
            </div>

            {/* Review 3 */}
            <div className="bg-[#111111] rounded-lg p-4 md:p-6 hover:scale-[1.02] transition-transform">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl">
                  R
                </div>
                <div>
                  <div className="font-medium">Robert Martinez</div>
                  <div className="flex text-[#ffc62d]">
                    {"★".repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 mb-3 text-sm md:text-base">
                Finally found a trading community that delivers real value. Their risk management strategies and market analysis are top-notch.
              </p>
              <p className="text-gray-500 text-xs md:text-sm">Written Jan 15, 2025, 1 month after purchase</p>
            </div>

            {/* Review 4 */}
            <div className="bg-[#111111] rounded-lg p-4 md:p-6 hover:scale-[1.02] transition-transform lg:col-span-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl">
                  A
                </div>
                <div>
                  <div className="font-medium">Alex Thompson</div>
                  <div className="flex text-[#ffc62d]">
                    {"★".repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 mb-3 text-sm md:text-base">
                The educational content alone is worth the price. But what really sets them apart is their commitment to each member's success. The mentors are always available to answer questions and guide you through trades.
              </p>
              <p className="text-gray-500 text-xs md:text-sm">Written Jan 5, 2025, 2 months after purchase</p>
            </div>

            {/* Review 5 */}
            <div className="bg-[#111111] rounded-lg p-4 md:p-6 hover:scale-[1.02] transition-transform lg:col-span-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl">
                  J
                </div>
                <div>
                  <div className="font-medium">Jessica Lee</div>
                  <div className="flex text-[#ffc62d]">
                    {"★".repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 mb-3 text-sm md:text-base">
                Skeptical at first, but their track record speaks for itself. The live trading sessions and real-time alerts have transformed my trading approach.
              </p>
              <p className="text-gray-500 text-xs md:text-sm">Written Dec 20, 2024, 3 months after purchase</p>
            </div>
          </div>
        </div>

        {/* Who this is for & FAQ Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto mt-24 md:mt-32">
          {/* Who this is for */}
          <div className="order-2 md:order-1">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-center md:text-left">Who this is for</h2>
            <div className="space-y-4">
              <div className="bg-[#111111] rounded-lg p-6 hover:scale-[1.02] transition-transform">
                <h3 className="text-lg md:text-xl font-bold mb-3 text-center">Inconsistent Traders</h3>
                <p className="text-gray-400 text-center text-sm md:text-base">
                  There are other traders in this community who have been trading for a few months or even years but still aren't profitable.
                </p>
              </div>

              <div className="bg-[#111111] rounded-lg p-6 hover:scale-[1.02] transition-transform">
                <h3 className="text-lg md:text-xl font-bold mb-3 text-center">Semi-Advanced Traders</h3>
                <p className="text-gray-400 text-center text-sm md:text-base">
                  We have other traders who make low four figures per month but are looking to scale their trading to five figures per month.
                </p>
              </div>

              <div className="bg-[#111111] rounded-lg p-6 hover:scale-[1.02] transition-transform">
                <h3 className="text-lg md:text-xl font-bold mb-3 text-center">Veteran Traders</h3>
                <p className="text-gray-400 text-center text-sm md:text-base">
                  We also have some traders making 7 figures per year who are just here to have a good time and teach others.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="order-1 md:order-2">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-center md:text-left">Frequently asked questions</h2>
            <div className="space-y-4">
              <div className="bg-[#111111] rounded-lg hover:scale-[1.02] transition-transform">
                <button 
                  className="w-full p-4 md:p-6 text-left flex justify-between items-center"
                  onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
                >
                  <span className="text-base md:text-lg font-medium">Can I cancel my subscription anytime?</span>
                  <svg 
                    className={`w-5 h-5 md:w-6 md:h-6 transform transition-transform ${openFaq === 0 ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === 0 && (
                  <div className="px-4 md:px-6 pb-4 md:pb-6">
                    <p className="text-gray-400 text-sm md:text-base">Yes, you can cancel your subscription at any time. The cancellation will take effect at the end of your current billing period.</p>
                  </div>
                )}
              </div>

              <div className="bg-[#111111] rounded-lg hover:scale-[1.02] transition-transform">
                <button 
                  className="w-full p-4 md:p-6 text-left flex justify-between items-center"
                  onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                >
                  <span className="text-base md:text-lg font-medium">How does the 200% guarantee work?</span>
                  <svg 
                    className={`w-5 h-5 md:w-6 md:h-6 transform transition-transform ${openFaq === 1 ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === 1 && (
                  <div className="px-4 md:px-6 pb-4 md:pb-6">
                    <p className="text-gray-400 text-sm md:text-base">If our trades don't double your subscription fee by the end of your paid period, we'll refund your subscription plus an additional 100%. This applies to all trades shared, whether you took them or not.</p>
                  </div>
                )}
              </div>

            

              <div className="bg-[#111111] rounded-lg hover:scale-[1.02] transition-transform">
                <button 
                  className="w-full p-4 md:p-6 text-left flex justify-between items-center"
                  onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                >
                  <span className="text-base md:text-lg font-medium">How long until I see results?</span>
                  <svg 
                    className={`w-5 h-5 md:w-6 md:h-6 transform transition-transform ${openFaq === 3 ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === 3 && (
                  <div className="px-4 md:px-6 pb-4 md:pb-6">
                    <p className="text-gray-400 text-sm md:text-base">Results vary by individual, but most members start seeing improvements in their trading within the first month. Our focus is on sustainable, long-term success through proper education and risk management.</p>
                  </div>
                )}
              </div>

              <div className="bg-[#111111] rounded-lg hover:scale-[1.02] transition-transform">
                <button 
                  className="w-full p-4 md:p-6 text-left flex justify-between items-center"
                  onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}
                >
                  <span className="text-base md:text-lg font-medium">What if I'm completely new to trading?</span>
                  <svg 
                    className={`w-5 h-5 md:w-6 md:h-6 transform transition-transform ${openFaq === 4 ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === 4 && (
                  <div className="px-4 md:px-6 pb-4 md:pb-6">
                    <p className="text-gray-400 text-sm md:text-base">We welcome beginners! Our educational content starts from the basics and progressively builds up. You'll have access to our comprehensive learning materials and supportive community to guide you through your journey.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Back to Plans Button */}
        <div className="max-w-xl mx-auto mt-16 md:mt-24 text-center">
          <button
            onClick={() => {
              const plansSection = document.querySelector('.plans-section');
              if (plansSection) {
                plansSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-[#ffc62d] text-black px-8 py-4 rounded-lg font-bold hover:bg-[#e5b228] transition-colors hover:scale-[1.02]"
          >
            JOIN NOW
          </button>
        </div>
      </div>
    </div>
  );
} 