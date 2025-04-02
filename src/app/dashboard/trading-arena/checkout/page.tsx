'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CardPaymentForm from '@/components/CardPaymentForm';
import { ShieldCheck, Lock, CreditCard } from 'lucide-react';
import type { UserData, Plan } from '@/types/index';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type ArenaType = 'arena' | 'trial';

const arenaTypes = [
  {
    id: 'arena' as const,
    name: 'The Flip Arena',
    description: 'No rules, just flip. 30 days to grow your account.',
    price: 100,
    startingBalance: '$5,000',
    isSubscription: false
  },
  {
    id: 'trial' as const,
    name: 'Arena Trial',
    description: 'Test your skills with our trial accounts.',
    isSubscription: true
  }
];

const trialSizes = [
  {
    id: '50k',
    name: '50K Account',
    price: 49,
    startingBalance: '$50,000'
  },
  {
    id: '100k',
    name: '100K Account',
    price: 99,
    startingBalance: '$100,000'
  },
  {
    id: '150k',
    name: '150K Account',
    price: 149,
    startingBalance: '$150,000'
  }
];

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  country?: string;
  type?: string;
  platform?: string;
  accountSize?: string;
  terms?: string;
}

export default function ArenaCheckoutPage() {
  const router = useRouter();
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const typeParam = searchParams.get('type');
  const sizeParam = searchParams.get('size');

  const [selectedType, setSelectedType] = useState<ArenaType | null>(
    typeParam === 'trial' ? 'trial' : null
  );
  const [selectedAccountSize, setSelectedAccountSize] = useState<string | null>(
    sizeParam ? sizeParam : null
  );
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleTypeSelect = (type: ArenaType) => {
    setSelectedType(type);
    setSelectedAccountSize(null);
  };

  const handleAccountSizeSelect = (sizeId: string) => {
    setSelectedAccountSize(sizeId);
  };

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getCurrentPrice = () => {
    if (!selectedType) return 0;
    if (selectedType === 'trial') {
      const size = selectedAccountSize?.replace('k', '');
      if (!size) return 0;
      return Number(size) === 50 ? 49 : Number(size) === 100 ? 99 : 149;
    }
    return 100;
  };

  const handleCardPayment = async (paymentMethodId: string) => {
    if (!isFormValid()) {
      return;
    }

    try {
      setIsProcessingPayment(true);

      const isSubscription = selectedType === 'trial';
      const endpoint = '/api/create-arena-payment';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId,
          amount: getCurrentPrice(),
          isSubscription,
          userData: {
            ...formData,
            selectedType,
            accountSize: selectedAccountSize,
            platform: selectedPlatform,
            timestamp: new Date(),
            status: 'pending'
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Payment failed');
      }

      // Initialize payment using the client secret
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not initialized');

      if (result.requires_action) {
        const { error: confirmError } = await stripe.confirmCardPayment(
          result.payment_intent_client_secret
        );

        if (confirmError) {
          throw new Error(confirmError.message || 'Payment confirmation failed');
        }
      }

      // Payment successful, redirect to success page
      if (typeof window !== 'undefined') {
        // First try router.push
        try {
          await router.push('/dashboard/trading-arena/checkout/success');
        } catch (error) {
          console.error('Router push failed, using window.location:', error);
          // Fallback to window.location
          window.location.href = '/dashboard/trading-arena/checkout/success';
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      setFormErrors(prev => ({
        ...prev,
        payment: error instanceof Error ? error.message : 'Payment processing failed'
      }));
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const isFormValid = () => {
    const errors: FormErrors = {};
    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.phone) errors.phone = 'Phone number is required';
    if (!formData.country) errors.country = 'Country is required';
    if (!selectedType) errors.type = 'Please select an arena type';
    if (selectedType === 'trial' && !selectedAccountSize) errors.accountSize = 'Please select an account size';
    if (!selectedPlatform) errors.platform = 'Please select a platform';
    if (!termsAccepted) errors.terms = 'Please accept the terms and conditions';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Loading Overlay */}
      {isProcessingPayment && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#111111] p-8 rounded-2xl border border-[#8B0000] shadow-2xl flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#8B0000] border-t-transparent rounded-full animate-spin" />
            <p className="text-lg font-semibold text-white">Processing Payment...</p>
            <p className="text-sm text-gray-400">Please do not close this window</p>
          </div>
        </div>
      )}
      <div className="space-y-12">
        {/* Arena Selection Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-8 text-[#ffc62d]">Arena Details</h2>
          
          <div className="space-y-8">
            {/* Arena Type Selection */}
            <div>
              <h3 className="text-lg font-medium mb-4">Select Arena Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {arenaTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleTypeSelect(type.id)}
                    className={`p-6 rounded-lg border ${
                      selectedType === type.id
                        ? 'border-[#8B0000] bg-[#8B0000]/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-lg font-semibold mb-2">{type.name}</div>
                    <div className="text-sm text-gray-400 mb-4">{type.description}</div>
                    {!type.isSubscription && (
                      <div className="flex justify-between items-center">
                        <div className="text-[#ffc62d]">${type.price}</div>
                        <div className="text-sm text-gray-400">{type.startingBalance}</div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Account Size Selection for Trials */}
            {selectedType === 'trial' && (
              <div>
                <h3 className="text-lg font-medium mb-4">Select Account Size</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {trialSizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => handleAccountSizeSelect(size.id)}
                      className={`p-6 rounded-lg border ${
                        selectedAccountSize === size.id
                          ? 'border-[#8B0000] bg-[#8B0000]/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-lg font-semibold mb-2">{size.name}</div>
                      <div className="flex justify-between items-center">
                        <div className="text-[#ffc62d]">${size.price}/mo</div>
                        <div className="text-sm text-gray-400">{size.startingBalance}</div>
                      </div>
                    </button>
                  ))}
                </div>
                {formErrors.accountSize && (
                  <p className="mt-2 text-sm text-red-500">{formErrors.accountSize}</p>
                )}
              </div>
            )}

            {/* Platform Selection */}
            <div className={selectedType && (selectedType === 'arena' || selectedAccountSize) ? 'opacity-100' : 'opacity-50 pointer-events-none'}>
              <h3 className="text-lg font-medium mb-4">Select Platform</h3>
              <div className="grid grid-cols-2 gap-4">
                {['MT4', 'MT5'].map((platform) => (
                  <button
                    key={platform}
                    onClick={() => handlePlatformSelect(platform)}
                    className={`p-4 rounded-lg border ${
                      selectedPlatform === platform
                        ? 'border-[#8B0000] bg-[#8B0000]/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            {/* Personal Information Form */}
            <div className={selectedPlatform ? 'opacity-100' : 'opacity-50 pointer-events-none'}>
              <h3 className="text-lg font-medium mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-[#1A1A1A] border border-gray-700 rounded-lg"
                    placeholder="Enter your first name"
                  />
                  {formErrors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-[#1A1A1A] border border-gray-700 rounded-lg"
                    placeholder="Enter your last name"
                  />
                  {formErrors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.lastName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-[#1A1A1A] border border-gray-700 rounded-lg"
                    placeholder="Enter your email"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-[#1A1A1A] border border-gray-700 rounded-lg"
                    placeholder="Enter your phone number"
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-[#1A1A1A] border border-gray-700 rounded-lg"
                    placeholder="Enter your country"
                  />
                  {formErrors.country && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.country}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Security Badges */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-800">
              <div className="flex flex-col items-center text-center">
                <ShieldCheck className="w-8 h-8 text-[#ffc62d] mb-2" />
                <div className="text-sm font-medium">Secure Checkout</div>
                <div className="text-xs text-gray-400">256-bit SSL encryption</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <Lock className="w-8 h-8 text-[#ffc62d] mb-2" />
                <div className="text-sm font-medium">Data Protection</div>
                <div className="text-xs text-gray-400">PCI DSS Compliant</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <CreditCard className="w-8 h-8 text-[#ffc62d] mb-2" />
                <div className="text-sm font-medium">Secure Payments</div>
                <div className="text-xs text-gray-400">Powered by Stripe</div>
              </div>
            </div>

            {/* Terms and Payment */}
            <div className={formData.email ? 'opacity-100' : 'opacity-50 pointer-events-none'}>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">
                    I accept the terms and conditions
                    {selectedType === 'trial' && ' and agree to monthly billing'}
                  </span>
                </label>
                {formErrors.terms && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.terms}</p>
                )}
              </div>

              {termsAccepted && (
                <div className="mt-8">
                  <Elements stripe={stripePromise}>
                    <CardPaymentForm
                      onPaymentComplete={handleCardPayment}
                      amount={getCurrentPrice()}
                      userData={{
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        discordUsername: '',
                        phone: formData.phone,
                        country: formData.country,
                      }}
                      selectedPlan={{
                        id: selectedType || 'arena',
                        name: selectedType === 'trial' ? `Trading Arena Trial (${selectedAccountSize || ''}k)` : 'Trading Arena',
                        price: getCurrentPrice(),
                        priceDisplay: selectedType === 'trial' 
                          ? {
                              amount: `$${getCurrentPrice()}`,
                              period: 'per month',
                              toString: () => `$${getCurrentPrice()} per month`
                            }
                          : {
                              amount: `$${getCurrentPrice()}`,
                              period: 'one-time',
                              toString: () => `$${getCurrentPrice()} one-time`
                            },
                        duration: selectedType === 'trial' ? 'monthly' : 'one-time',
                        features: [],
                        popular: false,
                        allowedPaymentMethods: ['card']
                      }}
                    />
                  </Elements>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 