'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <div className="flex items-center mb-8">
          <Link 
            href="/checkout"
            className="flex items-center text-[#ffc62d] hover:text-[#e5b228] transition-colors"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Checkout
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-300">
          <section className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">1. Data Collection</h2>
            <p>We collect and process personal information necessary for providing our services, including email addresses, names, and Discord usernames. Your payment information is securely processed by our payment providers (Stripe and cryptocurrency transactions).</p>
          </section>

          <section className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">2. Data Usage</h2>
            <p>Your information is used to provide access to our services, process payments, send important updates, and maintain our community standards. We never sell your personal information to third parties.</p>
          </section>

          <section className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">3. Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information. All payment processing is handled through secure, encrypted connections by our trusted payment providers.</p>
          </section>

          <section className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">4. Cookies & Tracking</h2>
            <p>We use essential cookies to maintain your session and preferences. We may use analytics tools to improve our services, but we do not use tracking cookies for marketing purposes.</p>
          </section>

          <section className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">5. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. Contact us through Discord or email to exercise these rights or raise any privacy concerns.</p>
          </section>
        </div>
      </div>
    </div>
  );
} 