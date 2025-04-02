'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function ArenaSuccessPage() {
  useEffect(() => {
    // Clear any stored form data
    sessionStorage.removeItem('arenaData');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-[#111111] p-8 rounded-2xl border border-[#8B0000] shadow-2xl"
      >
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <Image
              src="/images/arena-champion.png"
              alt="Success"
              fill
              className="object-contain"
            />
          </div>
          
          <h2 className="text-2xl font-bold mb-4 text-[#ffc62d]">Welcome to the Arena!</h2>
          
          <p className="text-gray-400 mb-8">
            Your payment has been processed successfully. Get ready to showcase your trading skills!
          </p>

          <div className="space-y-4">
            <Link
              href="/dashboard/trading-arena"
              className="block w-full py-3 px-4 bg-[#8B0000] text-white rounded-lg font-semibold hover:bg-[#660000] transition-colors"
            >
              Return to Arena
            </Link>
            
            <Link
              href="/dashboard"
              className="block w-full py-3 px-4 bg-[#1A1A1A] text-white rounded-lg font-semibold hover:bg-[#222222] transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 