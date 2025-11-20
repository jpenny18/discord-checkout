'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Star, CheckCircle, Users, TrendingUp, DollarSign, Clock, Shield, BookOpen, Play } from 'lucide-react';
import Footer from '@/components/Footer';
import FlipBlueprintHeader from '@/components/FlipBlueprintHeader';

export default function IntroWebinarPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <FlipBlueprintHeader variant="main" />

      <div className="overflow-x-hidden">
        {/* Hero Section */}
        <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffc62d]/5 via-transparent to-blue-600/10"></div>
          
          <div className="max-w-7xl mx-auto px-2 sm:px-3 py-20 min-h-screen relative z-10 flex flex-col justify-center">
            {/* Top Content - Text Section */}
            <div className="text-center space-y-8 mb-16">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex justify-center"
              >
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <Play className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-white text-sm font-medium">FREE Online MasterClass</span>
                </div>
              </motion.div>

              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-center max-w-6xl mx-auto"
              >
                <h1 className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white space-y-2 sm:space-y-6">
                  <div className="sm:whitespace-nowrap">
                    Access My{' '}
                    <span 
                      className="relative inline-block overflow-hidden" 
                      style={{
                        transform: isMobile ? 'skew(-1deg) rotate(-1deg)' : 'none',
                      }}
                    >
                      <span className="relative z-10 text-black font-bold px-3 py-2 drop-shadow-sm">
                        Pro Trading Secrets
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#ffc62d] via-yellow-400 to-[#ffb000] shadow-md"></div>
                      <div className="absolute inset-0 bg-gradient-to-tl from-[#ffc62d]/60 via-yellow-300/40 to-[#ffb000]/50 blur-sm"></div>
                    </span>
                  </div>
                  <div className="text-3xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                    To Accelerate Your Journey To Financial Independence
                  </div>
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h3 className="text-sm sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-4xl mx-auto px-4 sm:px-6">
                  A Process To Teach You <span className="text-[#ffc62d] font-semibold">How To Trade From Scratch</span> With A Time-Tested Trading System
                </h3>
              </motion.div>

              {/* On-Demand Training Module */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-white/80 text-lg"
              >
                On-Demand Training Module
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex justify-center"
              >
                <Link
                  href="#access-masterclass"
                  className="bg-[#ffc62d] text-black px-8 py-4 rounded-lg text-lg font-bold hover:bg-[#ffd700] transition-all duration-300 hover:scale-105 shadow-2xl flex items-center space-x-2"
                >
                  <span>🔥 Access MasterClass</span>
                </Link>
              </motion.div>

              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-white/60 text-sm max-w-md mx-auto"
              >
                ⚠️ Trading Involves Risk, Read Our Disclaimer
              </motion.div>
            </div>
          </div>
        </section>

        {/* Skills Section - Video + Skills List */}
        <section className="py-20 bg-slate-900 overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 overflow-x-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Video Preview */}
              <div className="relative">
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Video Placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center relative">
                    <Image
                      src="/images/video-preview.jpg"
                      alt="Trading Setup Preview"
                      width={600}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-blue-600 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Skills List */}
              <div className="space-y-8 px-6 md:px-0">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">
                    Here Are The Skills You'll Unlock...
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Secret 1 */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#ffc62d] rounded-sm flex items-center justify-center mt-1">
                      <CheckCircle className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                        <span className="text-[#ffc62d]">Secret 1:</span> How To Avoid Being Part Of The 90% Of Losing Traders With "Under The Radar" Knowledge
                      </h3>
                    </div>
                  </div>

                  {/* Secret 2 */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#ffc62d] rounded-sm flex items-center justify-center mt-1">
                      <CheckCircle className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                        <span className="text-[#ffc62d]">Secret 2:</span> Concepts That Pro Traders & Investors Know That Regular People Don't
                      </h3>
                    </div>
                  </div>

                  {/* Secret 3 */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-[#ffc62d] rounded-sm flex items-center justify-center mt-1">
                      <CheckCircle className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                        <span className="text-[#ffc62d]">Secret 3:</span> How To Start With Only $500 Or Less And Grow Your Account
                      </h3>
                    </div>
                  </div>

                  {/* Bonus 1 */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-sm flex items-center justify-center mt-1">
                      <span className="text-white text-xs font-bold">🎁</span>
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                        <span className="text-red-400">BONUS 1:</span> FREE EXCLUSIVE "Getting Started" TRADING GUIDE
                      </h3>
                    </div>
                  </div>

                  {/* Bonus 2 */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-sm flex items-center justify-center mt-1">
                      <span className="text-white text-xs font-bold">🎁</span>
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                        <span className="text-red-400">BONUS 2:</span> FREE TOP 5 TRADING TOOLS DOWNLOAD
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-4 md:gap-8 opacity-60 px-4">
              <div className="text-gray-400 font-semibold text-sm md:text-base">As Seen On:</div>
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 lg:gap-8">
                <span className="text-purple-400 font-bold text-sm md:text-base lg:text-lg whitespace-nowrap">yahoo! finance</span>
                <span className="text-green-400 font-bold text-sm md:text-base lg:text-lg whitespace-nowrap">MarketWatch</span>
                <span className="text-white font-bold text-sm md:text-base lg:text-lg whitespace-nowrap">●● Medium</span>
                <span className="text-purple-400 font-bold text-sm md:text-base lg:text-lg whitespace-nowrap">yahoo! finance</span>
                <span className="text-green-400 font-bold text-sm md:text-base lg:text-lg whitespace-nowrap">MarketWatch</span>
              </div>
            </div>
          </div>
        </section>

        {/* Free Bonus Section */}
        <section id="access-masterclass" className="py-20 bg-gradient-to-br from-black via-blue-900/20 to-black relative overflow-x-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 overflow-hidden">
            <div className="absolute inset-0 bg-repeat" style={{
              backgroundImage: 'radial-gradient(circle at center, #ffc62d 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="max-w-6xl mx-auto px-4 text-center relative z-10 overflow-x-hidden">
            {/* Section Header */}
            <div className="mb-16 px-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                <span className="text-[#ffc62d]">FREE BONUS!</span> THE PRO TRADING<br className="hidden sm:block" />
                <span className="sm:hidden"> </span>TOOLS I USE TO SUCCEED!
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-2">
                <span className="text-[#ffc62d] font-semibold">Get Exclusive access</span> to the Trading Tools we use daily to make money trading. We will provide<br className="hidden md:block" />
                <span className="md:hidden"> </span>a link to download this <span className="text-[#ffc62d] font-semibold">FREE RESOURCE</span> at the end of our Webinar.
              </p>
            </div>

            {/* Bonus Features List */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-[#ffc62d] text-2xl">✅</span>
                  <h3 className="text-lg md:text-xl font-semibold text-white">Success Blueprint</h3>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-[#ffc62d] text-2xl">✅</span>
                  <h3 className="text-lg md:text-xl font-semibold text-white">Favorite Fast Route Learning Process</h3>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-[#ffc62d] text-2xl">✅</span>
                  <h3 className="text-lg md:text-xl font-semibold text-white">Best Tools & Indicators To Start</h3>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center">
              <Link
                href="#register"
                className="bg-[#ffc62d] text-black px-4 md:px-8 py-2 md:py-4 rounded-lg text-base md:text-xl font-bold hover:bg-[#ffd700] transition-all duration-300 hover:scale-105 shadow-2xl flex items-center space-x-2"
              >
                <span>🔥 Access MasterClass</span>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
