'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { WhopCheckoutEmbed } from "@whop/checkout/react";
import { CheckCircle, ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-x-hidden">
      {/* Navigation Header */}
      <header className="relative z-50">
        <nav className="bg-slate-900 border-b border-[#232323] shadow-lg relative">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-repeat" style={{
              backgroundImage: 'radial-gradient(circle at center, #ffc62d 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }} />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffc62d]/5 via-transparent to-blue-600/10 pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/program" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">Back to Program</span>
              </Link>
              
              <div className="flex items-center space-x-2 md:space-x-3">
                <Image
                  src="/images/logo.png"
                  alt="Ascendant Academy Logo"
                  width={32}
                  height={32}
                  className="rounded-full md:w-10 md:h-10"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-sm md:text-xl text-white">ASCENDANT ACADEMY</span>
                  <span className="text-[8px] md:text-[11px] text-[#ffc62d]/75 -mt-1">ASCEND TO NEW HEIGHTS</span>
                </div>
              </div>
              
              <div className="w-24"></div>
            </div>
          </div>
        </nav>
      </header>

      {/* Checkout Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Heading */}
            <div className="text-center mb-12 md:mb-16">
              <div className="flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="ml-2 text-white text-sm font-medium">SECURE CHECKOUT</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight px-4">
                Complete Your Enrollment
              </h1>
              <p className="text-lg md:text-xl text-gray-400 w-full max-w-2xl mx-auto px-4">
                You are one step away from joining the ASCENDANT Accelerator. Complete your payment below to secure your spot.
              </p>
            </div>

            {/* Pricing Box */}
            <div className="relative bg-gradient-to-br from-black to-green-500/30 border-2 border-green-500 rounded-2xl py-4 px-6 mb-8 shadow-[0_0_15px_rgba(34,197,94,0.2)] w-full max-w-xl mx-auto">
              <div className="text-center">
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-white">
                  Today's Price: <span className="text-green-400">$1,495</span>
                </p>
              </div>
            </div>

            {/* Whop Checkout Embed */}
            <div className="w-full max-w-2xl mx-auto mb-10">
              <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-4 md:p-8">
                <WhopCheckoutEmbed 
                  planId="plan_pSmpQaJoxeHDI"
                  theme="dark"
                  hidePrice={true}
                  hideTermsAndConditions={false}
                  setupFutureUsage="off_session"
                  onComplete={(planId, receiptId) => {
                    // Redirect to success page after payment
                    window.location.href = `/success?receipt=${receiptId}`;
                  }}
                  fallback={
                    <div className="text-center py-12 bg-gray-900/50 rounded-2xl border border-gray-800">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading secure checkout...</p>
                    </div>
                  }
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="text-gray-400 text-sm">Secure Payment:</div>
              <div className="flex items-center space-x-2">
                <div className="bg-gray-800 px-2 py-1 rounded text-gray-300 text-xs font-semibold">VISA</div>
                <div className="bg-gray-800 px-2 py-1 rounded text-gray-300 text-xs font-semibold">MC</div>
                <div className="bg-gray-800 px-2 py-1 rounded text-gray-300 text-xs font-semibold">AMEX</div>
                <div className="bg-gray-800 px-2 py-1 rounded text-gray-300 text-xs font-semibold">DISCOVER</div>
              </div>
            </div>

            {/* Guarantee Section */}
            <div className="flex flex-col items-center justify-center bg-transparent border-none rounded-xl p-0 mt-8 w-full max-w-2xl mx-auto space-y-3">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-bold text-white text-center">
                  14 Day Conditional Money Back Policy
                </h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed text-center px-4">
                I know my Accelerator mentorship works. Give me an honest shot. If you meet the initial requirements of the policy within 14 days, there is literally nothing to lose and everything to gain.
              </p>
              {/* Terms Link */}
              <div className="text-center">
                <Link href="/terms" className="text-gray-500 text-sm hover:text-gray-400 transition-colors underline">
                  Terms and Conditions Apply
                </Link>
              </div>
            </div>

            {/* Security Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-12 mb-8">
              <div className="flex items-center space-x-2 text-gray-400 text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-xs">
                <CheckCircle className="w-4 h-4" />
                <span>PCI Compliant</span>
              </div>
            </div>

            {/* Support */}
            <div className="text-center mt-8">
              <p className="text-gray-500 text-sm">
                Need help? <Link href="/program#faq" className="text-blue-400 hover:text-blue-300 transition-colors">View FAQ</Link> or contact support
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Ascendant Academy. All rights reserved.</p>
          <div className="flex items-center justify-center space-x-4 mt-2">
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/refund" className="hover:text-gray-400 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

