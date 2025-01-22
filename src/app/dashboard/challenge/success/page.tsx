'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ChallengeData {
  type: string;
  amount: string;
  platform: string;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    [key: string]: string;
  };
  price: string;
}

export default function SuccessPage() {
  const router = useRouter();
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedData = sessionStorage.getItem('challengeData');
    if (!storedData) {
      // Instead of redirecting immediately, show a loading state
      setIsLoading(false);
      return;
    }

    // Parse the data and set it in state
    setChallengeData(JSON.parse(storedData));
    setIsLoading(false);

    // Clear the stored data after a delay
    const timer = setTimeout(() => {
      sessionStorage.removeItem('challengeData');
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

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

  if (!challengeData) {
    return (
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <div className="mx-auto w-16 h-16 bg-[#ffc62d]/10 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-[#ffc62d]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold mb-2">Payment Successful</h1>
            <p className="text-gray-400">
              Your payment has been processed successfully.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-[#ffc62d] text-black py-3 rounded-lg font-semibold"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push('/dashboard/challenge')}
              className="w-full bg-transparent border border-[#ffc62d] text-[#ffc62d] py-3 rounded-lg font-semibold"
            >
              Start Another Challenge
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-[#ffc62d]/10 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-[#ffc62d]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold mb-2">The order has been received</h1>
          <p className="text-gray-400">
            We will start processing your {challengeData.type} Challenge as soon as possible. 
            Your login credentials will be emailed to you as soon as possible.
          </p>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg p-6 mb-8">
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
              <span>Amount Paid</span>
              <span>${challengeData.price}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-[#ffc62d] text-black py-3 rounded-lg font-semibold"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => router.push('/dashboard/challenge')}
            className="w-full bg-transparent border border-[#ffc62d] text-[#ffc62d] py-3 rounded-lg font-semibold"
          >
            Start Another Challenge
          </button>
        </div>
      </div>
    </div>
  );
} 