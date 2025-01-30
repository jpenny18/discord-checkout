'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type TabType = 'terms' | 'privacy' | 'refund';

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('terms');

  const tabContent = {
    terms: (
      <div className="prose prose-invert max-w-none">
        <h2 className="text-xl font-semibold mb-4">Terms of Service</h2>
        <p className="text-gray-400 mb-4">Last updated: March 15, 2024</p>
        <div className="space-y-4 text-sm text-gray-300">
          <p>
            These Terms of Service ("Terms") govern your access to and use of Ascendant Markets' services, including our website, trading platform, and related services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.
          </p>
          <h3 className="text-lg font-semibold text-white">1. Eligibility</h3>
          <p>
            You must be at least 18 years old and capable of forming a binding contract to use our Services. By using our Services, you represent and warrant that you meet these requirements.
          </p>
          <h3 className="text-lg font-semibold text-white">2. Trading Risks</h3>
          <p>
            Trading foreign exchange (forex) and other financial instruments carries substantial risks, including the possible loss of your entire investment. You should carefully consider whether such trading is suitable for you in light of your circumstances and financial resources.
          </p>
          <h3 className="text-lg font-semibold text-white">3. Account Registration</h3>
          <p>
            To access certain features of our Services, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </p>
          <h3 className="text-lg font-semibold text-white">4. Prohibited Activities</h3>
          <p>
            You agree not to engage in any of the following prohibited activities: (1) copying, distributing, or disclosing any part of the Services; (2) using any automated system to access the Services; (3) transmitting any viruses or other code that may harm our Services; (4) attempting to interfere with or compromise the system integrity or security.
          </p>
          <h3 className="text-lg font-semibold text-white">5. Termination</h3>
          <p>
            We reserve the right to terminate or suspend your access to our Services at any time, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.
          </p>
        </div>
      </div>
    ),
    privacy: (
      <div className="prose prose-invert max-w-none">
        <h2 className="text-xl font-semibold mb-4">Privacy Policy</h2>
        <p className="text-gray-400 mb-4">Last updated: March 15, 2024</p>
        <div className="space-y-4 text-sm text-gray-300">
          <p>
            Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Services.
          </p>
          <h3 className="text-lg font-semibold text-white">1. Information We Collect</h3>
          <p>
            We collect information that you provide directly to us, including but not limited to: name, email address, phone number, date of birth, and financial information necessary for trading activities.
          </p>
          <h3 className="text-lg font-semibold text-white">2. How We Use Your Information</h3>
          <p>
            We use the information we collect to: provide and maintain our Services, process your transactions, communicate with you, and comply with legal obligations.
          </p>
          <h3 className="text-lg font-semibold text-white">3. Information Sharing</h3>
          <p>
            We do not sell your personal information. We may share your information with third-party service providers who assist us in operating our Services, conducting our business, or servicing you.
          </p>
          <h3 className="text-lg font-semibold text-white">4. Data Security</h3>
          <p>
            We implement appropriate technical and organizational measures to maintain the security of your personal information, but remember that no method of transmission over the Internet is 100% secure.
          </p>
          <h3 className="text-lg font-semibold text-white">5. Your Rights</h3>
          <p>
            You have the right to access, correct, or delete your personal information. Contact us at support@ascendantcapital.ca to exercise these rights.
          </p>
        </div>
      </div>
    ),
    refund: (
      <div className="prose prose-invert max-w-none">
        <h2 className="text-xl font-semibold mb-4">Refund and Dispute Policy</h2>
        <p className="text-gray-400 mb-4">Last updated: March 15, 2024</p>
        <div className="space-y-4 text-sm text-gray-300">
          <p>
            This policy outlines our procedures for handling refunds and disputes related to our Services.
          </p>
          <h3 className="text-lg font-semibold text-white">1. Refund Eligibility</h3>
          <p>
            Due to the nature of our Services, all sales are final and non-refundable once the challenge has been started. However, we may consider refunds in exceptional circumstances on a case-by-case basis.
          </p>
          <h3 className="text-lg font-semibold text-white">2. Refund Process</h3>
          <p>
            If you believe you are eligible for a refund, please contact our support team at support@ascendantcapital.ca within 24 hours of your purchase. Include your order number and detailed explanation for the refund request.
          </p>
          <h3 className="text-lg font-semibold text-white">3. Dispute Resolution</h3>
          <p>
            If you have a dispute regarding our Services, please contact our support team first. We aim to resolve all disputes amicably through direct communication.
          </p>
          <h3 className="text-lg font-semibold text-white">4. Processing Time</h3>
          <p>
            If a refund is approved, it will be processed within 5-10 business days. The time it takes for the refund to appear in your account depends on your payment method and financial institution.
          </p>
          <h3 className="text-lg font-semibold text-white">5. Exceptions</h3>
          <p>
            We reserve the right to make exceptions to this policy at our sole discretion. Any exceptions made will not constitute a waiver of our right to enforce this policy in other cases.
          </p>
        </div>
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 mb-8 relative z-10">
        <Link 
          href="/funding" 
          className="inline-flex items-center text-yellow-500 hover:text-yellow-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Funding Programs
        </Link>
      </div>

      {/* Logo */}
      <div className="container mx-auto px-4 mb-12 flex justify-center relative z-10">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="relative w-52 h-8"
        >
          <Image
            src="/images/ascendantmarkets.png"
            alt="Ascendant Markets"
            fill
            className="object-contain"
            priority
          />
        </motion.div>
      </div>

      {/* Terms Section */}
      <section className="relative py-12 overflow-hidden z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-5xl md:text-6xl font-bold mb-12 text-center"
            >
              LEGAL <span className="text-yellow-500 drop-shadow-[0_0_25px_rgba(234,179,8,0.3)]">INFORMATION</span>
            </motion.h1>

            {/* Tabs */}
            <div className="flex flex-col sm:flex-row justify-center gap-2 mb-8">
              <button
                onClick={() => setActiveTab('terms')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'terms'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-[#111111] text-white hover:bg-zinc-800'
                }`}
              >
                Terms of Service
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'privacy'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-[#111111] text-white hover:bg-zinc-800'
                }`}
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setActiveTab('refund')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'refund'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-[#111111] text-white hover:bg-zinc-800'
                }`}
              >
                Refund & Disputes
              </button>
            </div>

            {/* Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#111111] rounded-lg p-8 md:p-12"
            >
              {tabContent[activeTab]}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
} 