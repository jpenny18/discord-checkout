'use client';

import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to Ascendant Academy!</h1>
          <p className="text-xl text-gray-300 mb-8">Your payment has been successfully processed.</p>
        </div>

        <div className="space-y-6">
          <div className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
            <p className="text-gray-300 mb-4">Join our Discord community to get started with your trading journey.</p>
            <Link 
              href="https://discord.gg/G9UdhV9x" 
              target="_blank"
              className="inline-block bg-[#ffc62d] hover:bg-[#e5b228] text-black font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Join Discord
            </Link>
          </div>

          <div className="bg-[#111111] p-6 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">Access Your Dashboard</h2>
            <p className="text-gray-300 mb-4">View your subscription details and access educational content.</p>
            <Link 
              href="/dashboard" 
              className="inline-block bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 