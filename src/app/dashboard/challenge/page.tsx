'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ChallengeMetrics from '@/components/ChallengeMetrics';
import { performanceMetrics } from '@/components/ChallengeMetrics';
import Image from 'next/image';

// Define the type locally since we can't import it
type ChallengeType = 'Gauntlet' | 'Ascendant' | 'Standard';

const challengeTypes = [
  { 
    id: 'Gauntlet' as const, 
    name: 'Gauntlet Challenge', 
    amounts: ['$50,000', '$100,000', '$300,000'],
    image: '/images/gauntlet.png',
    description: 'Prove you can trade first, pay the rest after passing'
  },
  { 
    id: 'Ascendant' as const, 
    name: 'Ascendant Challenge', 
    amounts: ['$10,000', '$25,000', '$50,000'],
    image: '/images/ascendant.png',
    description: 'One step challenge, double your account every target'
  },
  { 
    id: 'Standard' as const, 
    name: 'Standard Challenge', 
    amounts: ['$10,000', '$25,000', '$50,000', '$100,000'],
    image: '/images/standard.png',
    description: 'Classic two step challenge for confident traders'
  },
];

const platforms = ['MT4', 'MT5'];

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  country?: string;
  type?: string;
  amount?: string;
  platform?: string;
  terms?: string;
}

export default function ChallengePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<ChallengeType | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    discordUsername: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleTypeSelect = (type: ChallengeType) => {
    setSelectedType(type);
    setSelectedAmount(null);
  };

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
  };

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getCurrentPrice = () => {
    if (!selectedType || !selectedAmount) return null;
    return performanceMetrics[selectedType][selectedAmount].price;
  };

  const handleProceedToPayment = () => {
    if (!isFormValid()) {
      // Show validation errors
      const errors: FormErrors = {};
      if (!formData.firstName) errors.firstName = 'First name is required';
      if (!formData.lastName) errors.lastName = 'Last name is required';
      if (!formData.email) errors.email = 'Email is required';
      if (!formData.phone) errors.phone = 'Phone number is required';
      if (!formData.country) errors.country = 'Country is required';
      if (!selectedType) errors.type = 'Please select a challenge type';
      if (!selectedAmount) errors.amount = 'Please select an amount';
      if (!selectedPlatform) errors.platform = 'Please select a platform';
      if (!termsAccepted) errors.terms = 'Please accept the terms and conditions';
      
      setFormErrors(errors);
      return;
    }
    
    // Store form data in session storage
    sessionStorage.setItem('challengeData', JSON.stringify({
      type: selectedType,
      amount: selectedAmount,
      platform: selectedPlatform,
      formData: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        discordUsername: formData.discordUsername || ''
      },
      price: getCurrentPrice()
    }));
    
    router.push('/dashboard/challenge/payment');
  };

  const isFormValid = () => {
    return (
      selectedType &&
      selectedAmount &&
      selectedPlatform &&
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.country &&
      termsAccepted
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="space-y-12">
          <h2 className="text-2xl font-semibold mb-8 text-[#ffc62d]">Challenge Details</h2>
          
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* First Card - Challenge Selection */}
          <div className="lg:col-span-3 bg-[#111111] rounded-2xl p-6 border border-gray-800">
            <div className="transform scale-[1] origin-top">
            {/* Challenge Type Selection */}
              <div className="mb-12">
              <h3 className="text-lg font-medium mb-4">Select Challenge Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {challengeTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleTypeSelect(type.id)}
                      className={`relative group w-full aspect-[16/20] rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedType === type.id
                          ? 'border-[#ffc62d] shadow-[0_0_40px_rgba(255,198,45,0.2)]'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                      {/* Border glow animation */}
                      <div className={`absolute inset-0 border-4 rounded-2xl transition-all duration-500 ${
                        selectedType === type.id 
                          ? 'border-[#ffc62d]/50'
                          : 'border-transparent group-hover:border-[#ffc62d]/20'
                      }`}></div>
                      
                      {/* Image section - top 80% */}
                      <div className="relative w-full h-[80%] overflow-hidden flex items-center justify-center">
                        <div className="relative w-[85%] h-[85%]">
                          <Image
                            src={type.image}
                            alt={type.name}
                            fill
                            className={`object-contain transition-all duration-700 ${
                              selectedType === type.id
                                ? 'scale-125'
                                : 'scale-110 group-hover:scale-125'
                            }`}
                            sizes="(max-width: 768px) 100vw, 33vw"
                            priority
                          />
                        </div>
                        
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/15 to-transparent"></div>
                      </div>
                      
                      {/* Text section - bottom 20% */}
                      <div className="relative h-[20%] bg-gradient-to-t from-black to-black/90 p-2 flex flex-col justify-center items-center text-center">
                        <div className={`transform transition-all duration-300 ${
                          selectedType === type.id
                            ? '-translate-y-1'
                            : 'group-hover:-translate-y-1'
                        }`}>
                          <h2 className="text-[0.6rem] font-bold mb-0.5 text-white drop-shadow-lg">
                    {type.name}
                          </h2>
                          <div className="h-0.5 w-12 bg-[#ffc62d] mb-0.5 rounded mx-auto"></div>
                          <p className="text-white/80 text-[0.41rem] max-w-md truncate px-1">
                            {type.description}
                          </p>
                        </div>
                      </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Selection */}
              <div className={`mb-12 ${selectedType ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <h3 className="text-lg font-medium mb-4">Select Amount</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(selectedType ? challengeTypes.find(type => type.id === selectedType)?.amounts : [])?.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`p-4 rounded-lg border ${
                      selectedAmount === amount
                        ? 'border-[#ffc62d] bg-[#ffc62d]/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Selection */}
            <div className={selectedAmount ? 'opacity-100' : 'opacity-50 pointer-events-none'}>
              <h3 className="text-lg font-medium mb-4">Select Platform</h3>
              <div className="grid grid-cols-2 gap-4 max-w-[50%]">
                {platforms.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => handlePlatformSelect(platform)}
                    className={`relative group w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedPlatform === platform
                        ? 'border-[#ffc62d] shadow-[0_0_40px_rgba(255,198,45,0.2)]'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {/* Border glow animation */}
                    <div className={`absolute inset-0 border-4 rounded-2xl transition-all duration-500 ${
                      selectedPlatform === platform 
                        ? 'border-[#ffc62d]/50'
                        : 'border-transparent group-hover:border-[#ffc62d]/20'
                    }`}></div>
                    
                    {/* Image section - top 75% */}
                    <div className="relative w-full h-[80%] overflow-hidden flex items-center justify-center">
                      <div className="relative w-full h-full">
                        <Image
                          src={`/images/${platform.toLowerCase()}.png`}
                          alt={platform}
                          fill
                          className={`object-cover transition-all duration-700 ${
                            selectedPlatform === platform
                              ? 'scale-125'
                              : 'scale-110 group-hover:scale-125'
                          }`}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority
                        />
                      </div>
                      
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/15 to-transparent"></div>
                    </div>
                    
                    {/* Text section - bottom 25% */}
                    <div className="relative h-[20%] bg-gradient-to-t from-black to-black/90 p-2 flex flex-col justify-center items-center text-center">
                      <div className={`transform transition-all duration-300 ${
                        selectedPlatform === platform
                          ? '-translate-y-1'
                          : 'group-hover:-translate-y-1'
                      }`}>
                        <h2 className="text-[0.6rem] font-bold mb-0.5 text-white drop-shadow-lg">
                          {platform}
                        </h2>
                        <div className="h-0.5 w-12 bg-[#ffc62d] rounded mx-auto"></div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          </div>

          {/* Second Card - Personal Details */}
          <div className="lg:col-span-2 bg-[#111111] rounded-2xl p-6 border border-gray-800">
            <div className="transform scale-[1] origin-top">
              <h2 className="text-2xl font-semibold mb-8">Personal Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full bg-[#1a1a1a] border ${formErrors.firstName ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3`}
              />
              {formErrors.firstName && (
                <p className="text-sm text-red-500 mt-1">{formErrors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full bg-[#1a1a1a] border ${formErrors.lastName ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3`}
              />
              {formErrors.lastName && (
                <p className="text-sm text-red-500 mt-1">{formErrors.lastName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full bg-[#1a1a1a] border ${formErrors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3`}
              />
              {formErrors.email && (
                <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full bg-[#1a1a1a] border ${formErrors.phone ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3`}
              />
              {formErrors.phone && (
                <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-2">
                Country *
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className={`w-full bg-[#1a1a1a] border ${formErrors.country ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3`}
              />
              {formErrors.country && (
                <p className="text-sm text-red-500 mt-1">{formErrors.country}</p>
              )}
            </div>

            <div>
              <label htmlFor="discordUsername" className="block text-sm font-medium mb-2">
                Discord Username
              </label>
              <input
                type="text"
                id="discordUsername"
                name="discordUsername"
                value={formData.discordUsername}
                onChange={handleInputChange}
                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg p-3"
              />
            </div>
          </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Challenge Metrics and Payment */}
        <div className="space-y-12">
        {/* Metrics Table */}
        {selectedType && selectedAmount && (
          <section>
            <h2 className="text-2xl font-semibold mb-8 text-[#ffc62d]">Challenge Metrics</h2>
            <ChallengeMetrics type={selectedType} amount={selectedAmount} />
          </section>
        )}

        {/* Terms and Payment */}
        <section>
          <div className="space-y-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className={`mr-2 ${formErrors.terms ? 'border-red-500' : ''}`}
              />
              <label htmlFor="terms">
                I agree to the Terms & Conditions and Cancellation & Refund Policy
              </label>
            </div>
            {formErrors.terms && (
              <p className="text-sm text-red-500">{formErrors.terms}</p>
            )}

            <div className="text-2xl font-bold text-center">
              Total Due: <span className="text-[#ffc62d]">${getCurrentPrice()}</span>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleProceedToPayment}
                disabled={!isFormValid()}
                className="px-8 bg-[#ffc62d] text-black py-3 rounded-lg font-semibold disabled:opacity-50 hover:bg-[#e5b228] transition-colors"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </section>
        </div>
      </div>
    </div>
  );
} 