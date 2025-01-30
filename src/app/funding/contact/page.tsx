'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ContactPage() {
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

      {/* Contact Section */}
      <section className="relative py-12 overflow-hidden z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-5xl md:text-6xl font-bold mb-8 text-center"
            >
              CONTACT <span className="text-yellow-500 drop-shadow-[0_0_25px_rgba(234,179,8,0.3)]">US</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#111111] rounded-lg p-8 md:p-12 text-center"
            >
              <h2 className="text-xl md:text-2xl font-semibold mb-6">Need Support?</h2>
              <p className="text-gray-400 mb-8">
                Our support team is here to help you with any questions or concerns you may have.
              </p>
              
              <div className="inline-block bg-black/50 rounded-lg p-6">
                <p className="text-gray-400 mb-2">Email us at:</p>
                <a 
                  href="mailto:support@ascendantcapital.ca"
                  className="text-yellow-500 hover:text-yellow-400 transition-colors text-lg md:text-xl font-semibold"
                >
                  support@ascendantcapital.ca
                </a>
              </div>

              <p className="mt-8 text-sm text-gray-500">
                We aim to respond to all inquiries within 24 hours during business days.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
} 