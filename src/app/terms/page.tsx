'use client';

import Link from 'next/link';

export default function TermsPage() {
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

        <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms and Conditions</h1>
        
        <div className="space-y-6 text-gray-300">
          <section className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">1. Subscription Terms</h2>
            <p>By subscribing to Ascendant Academy, you agree to the recurring billing terms specified in your selected plan. Subscription fees will be automatically charged to your payment method at the start of each billing period.</p>
          </section>

          <section className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">2. Service Access</h2>
            <p>Upon successful payment, you will receive access to our Discord community and educational materials as specified in your chosen plan. Access is personal and non-transferable.</p>
          </section>

          <section className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">3. Membership Rules</h2>
            <p>Members are expected to maintain professional conduct within our community. Any form of harassment, spam, or sharing of unauthorized content may result in immediate termination of membership without refund.</p>
          </section>

          <section className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">4. Disclaimer</h2>
            <p>Trading involves substantial risk. Past performance is not indicative of future results. Our educational content and trading signals are for informational purposes only and should not be considered as financial advice.</p>
          </section>

          <section className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">5. Intellectual Property</h2>
            <p>All content provided through Ascendant Academy, including but not limited to videos, documents, and trading strategies, is protected by copyright law. Sharing or redistributing this content without explicit permission is prohibited.</p>
          </section>
        </div>
      </div>
    </div>
  );
} 