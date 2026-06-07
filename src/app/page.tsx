'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Footer from '@/components/Footer';

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const stats = [
    { value: '300+', label: 'Active Traders' },
    { value: '150k+', label: 'Trades Journaled' },
    { value: '200+', label: 'Lessons Available' },
    { value: '100%', label: 'Free Access' }
  ];

  return (
    <main className="min-h-screen bg-[#09090b] text-white overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ffc62d]/5 rounded-full blur-[150px]" 
             style={{ transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)` }} />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px]"
             style={{ transform: `translate(${-mousePosition.x * 0.02}px, ${-mousePosition.y * 0.02}px)` }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-500/3 rounded-full blur-[180px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b" style={{
        borderColor: 'color-mix(in oklab, var(--color-white) 8%, transparent)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Empty div for left spacing, can be hidden on mobile if needed */}
            <div className="w-12 sm:w-20" />
            
            {/* Centered Logo */}
            <div className="flex-1 flex justify-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/logo.png"
                  alt="Ascendant Academy"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </Link>
            </div>
            
            {/* "Sign In" button now on right */}
            <div className="flex justify-end">
              <Link href="/auth">
                <button className="bg-gradient-to-r from-[#ffc62d] to-[#ffb700] text-black px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold hover:shadow-[0_0_30px_rgba(255,198,45,0.4)] transition-all duration-200 text-sm sm:text-base">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border backdrop-blur-sm"
              style={{
                backgroundColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)',
                borderColor: 'color-mix(in oklab, var(--color-white) 10%, transparent)'
              }}
            >
              <Sparkles className="w-4 h-4 text-[#ffc62d]" />
              <span className="text-sm text-gray-300">Free Trading Education Platform</span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight px-4">
              <span className="block bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Ascend to
              </span>
              <span className="block bg-gradient-to-r from-[#ffc62d] via-[#ffb700] to-[#ffc62d] bg-clip-text text-transparent mt-2">
                New Heights
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Our free trading education platform has all the tools you need to succeed
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 px-4"
            >
              <Link href="/auth?tab=register">
                <button className="w-full sm:w-auto bg-gradient-to-r from-[#ffc62d] to-[#ffb700] text-black px-8 py-4 rounded-lg font-semibold hover:shadow-[0_0_40px_rgba(255,198,45,0.5)] transition-all duration-200 flex items-center justify-center space-x-2 text-base sm:text-lg group">
                  <span>Start Learning Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              {/* "Sign In" button removed from hero */}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto pt-8 sm:pt-12 px-4"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#ffc62d] to-[#ffb700] bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        {/* Hidden: Scroll Indicator */}
      </section>
      
      {/* Footer */}
      <Footer />
    </main>
  );
}
