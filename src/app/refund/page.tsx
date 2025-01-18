'use client';

import Link from 'next/link';

export default function RefundPage() {
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

        <h1 className="text-3xl md:text-4xl font-bold mb-8">Refund & Dispute Policy</h1>
        
        <div className="space-y-6 text-gray-300">
          <section className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">200% Guarantee</h2>
            <p>For Challenger and Hero plans, we offer our exclusive 200% guarantee. If our trades don't double your subscription fee by the end of your paid period, we'll refund your subscription plus an additional 100%. This guarantee is subject to active participation in our program and following our trading guidelines. Please note: This applies to trades you didn't take as well not only the ones you did.</p>
          </section>

          <section className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">Refund Process</h2>
            <p>We do not offer refunds for any reason. Unless it falls under our 200% guarantee - To request a refund, please contact our support team through Discord with your order details and reason for the refund. Refund requests are processed within 5-7 business days. For credit card payments, refunds will be issued to the original payment method. For crypto payments, refunds will be processed in the same cryptocurrency at the current market rate.</p>
          </section>

          <section className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">Eligibility</h2>
            <p>Refund request for the 200% guarantee claims, these must be submitted within 1 day of your subscription period ending, with documented proof of following our trading program, trades you took and didn't take and the realizd loss of the trades called out.</p>
          </section>

          <section className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">Dispute Resolution</h2>
            <p>If you have any disputes regarding charges or services, please contact our support team first. We aim to resolve all issues amicably. For credit card disputes, please allow us 48 hours to respond before initiating a chargeback with your bank.</p>
          </section>

          <section className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">Cancellation</h2>
            <p>You may cancel your subscription at any time through your dashboard or by contacting support. Cancellations will take effect at the end of your current billing period. No partial refunds are provided for unused portions of your subscription period.</p>
          </section>
        </div>
      </div>
    </div>
  );
} 