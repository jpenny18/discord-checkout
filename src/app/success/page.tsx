import Image from 'next/image';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-xl mx-auto p-8 text-center">
        <div className="mb-8 flex justify-center">
          <Image
            src="/images/logo.png"
            alt="Ascendant Academy Logo"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>

        <h1 className="text-4xl font-bold mb-4">Welcome to Ascendant Academy!</h1>
        <div className="bg-[#111111] border border-[#ffc62d] rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            <svg
              className="w-16 h-16 text-[#ffc62d]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
          <p className="text-gray-400 mb-6">
            Your payment has been processed successfully. You will receive a confirmation email shortly.
          </p>
          <div className="space-y-4">
            <div className="bg-black p-4 rounded border border-gray-700">
              <h3 className="font-medium mb-2">Next Steps:</h3>
              <ol className="text-left text-gray-400 space-y-2">
                <li>1. Join our Discord community</li>
                <li>2. Access the training materials/livestreams</li>
                <li>3. Login to your free 50k Challenge account</li>
                <li>4. Start earning, learning, and ascending to new heights!</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Link 
            href="https://discord.gg/your-invite-link" 
            target="_blank"
            className="block w-full bg-[#ffc62d] text-black p-4 rounded-lg font-bold hover:bg-[#e5b228] transition-colors"
          >
            Join Discord Now
          </Link>
          <Link 
            href="/dashboard" 
            className="block w-full bg-[#111111] text-white p-4 rounded-lg font-bold border border-gray-700 hover:border-gray-600 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 