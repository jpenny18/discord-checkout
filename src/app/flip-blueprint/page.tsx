'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Star, CheckCircle, Users, TrendingUp, DollarSign, Clock, Shield, BookOpen } from 'lucide-react';
import Footer from '@/components/Footer';
import FlipBlueprintHeader from '@/components/FlipBlueprintHeader';

// CountUpStat Component
interface CountUpStatProps {
  targetValue: number;
  prefix?: string;
  suffix?: string;
  label: string;
  color: string;
  delay: number;
}

const CountUpStat: React.FC<CountUpStatProps> = ({ targetValue, prefix = "", suffix = "", label, color, delay }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepValue = targetValue / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setCount(Math.min(Math.round(stepValue * currentStep), targetValue));
      } else {
        setCount(targetValue);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [hasAnimated, targetValue]);

  const formatNumber = (num: number) => {
    if (targetValue >= 1000000) {
      return (num / 1000000).toFixed(num >= 1000000 ? 0 : 1);
    }
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      onAnimationComplete={() => setHasAnimated(true)}
      className="text-center"
    >
      <div className={`text-4xl md:text-6xl font-bold ${color} mb-4`}>
        {prefix}{formatNumber(count)}{suffix}
      </div>
      <div className="text-sm md:text-base text-gray-400 uppercase tracking-wide whitespace-pre-line max-w-xs">
        {label}
      </div>
    </motion.div>
  );
};

export default function FlipBlueprintPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    handleResize(); // Set initial value
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <FlipBlueprintHeader variant="main" />

      <div>
        {/* Hero Section */}
        <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffc62d]/5 via-transparent to-blue-600/10"></div>
          
          <div className="max-w-6xl mx-auto px-4 py-20 min-h-screen relative z-10 flex flex-col justify-center">
            {/* Top Content - Text Section */}
            <div className="text-center space-y-8 mb-16">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex justify-center"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white text-sm font-medium">ASCENDANT Trading Academy</span>
                </div>
              </motion.div>

              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-center max-w-5xl mx-auto"
              >
                <h1 className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white space-y-2 sm:space-y-6">
                  <div className="sm:whitespace-nowrap">
                    We'll Help You{' '}
                                          <span 
                        className="relative inline-block" 
                        style={{
                          transform: isMobile ? 'skew(-1deg) rotate(-1deg)' : 'none',
                        }}
                      >
                        <span className="relative z-10 text-black font-bold px-3 py-2 drop-shadow-sm text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl">
                          Master Flip Trading
                      </span>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#ffc62d] via-yellow-400 to-[#ffb000] shadow-md"></div>
                        <div className="absolute inset-0 bg-gradient-to-tl from-[#ffc62d]/60 via-yellow-300/40 to-[#ffb000]/50 blur-sm"></div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#ffc62d]/30 to-yellow-400/20 rounded-lg blur-sm"></div>
                      </span>
                  </div>
                  <div className="whitespace-nowrap">In 90 Days Or Less.</div>
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                                  <h3 className="text-sm sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto px-6">
                    Our education condenses <strong className="text-blue-400">8+ years of trading experience</strong> into a
                    step-by-step, self-paced course to help you gain the skills behind account flipping.
                  </h3>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Link
                  href="/flip-blueprint/intro-webinar"
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-xl sm:rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-xl border border-blue-700"
                >
                  <span>⚡</span>
                  <span>Start Learning For Free</span>
                </Link>
              </motion.div>

              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="flex items-center justify-center space-x-2 text-gray-400 text-xs"
              >
                <div className="w-3 h-3 flex items-center justify-center">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Trading Involves Risk, Read Our Disclaimer</span>
              </motion.div>
            </div>

            {/* Bottom Content - Video Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-4xl mx-auto w-full"
            >
              {/* Video Container */}
              <div className="relative bg-black/40 backdrop-blur-sm rounded-2xl border border-[#ffc62d]/20 p-6 shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden relative">
                  {/* Video Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <div className="w-0 h-0 border-l-[16px] border-l-white border-y-8 border-y-transparent ml-1"></div>
                    </div>
                  </div>
                  
                  {/* Video Overlay Content */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
                      <h4 className="text-white font-semibold text-lg mb-2">
                        Investing Thesis & Analysis
                      </h4>
                      <p className="text-white/80 text-sm">
                        Learn the fundamentals of market analysis and develop your own trading thesis.
                      </p>
                    </div>
                  </div>

                  {/* Click for Sound Button */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full p-3 flex items-center space-x-2">
                      <div className="w-6 h-6 text-white">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </motion.div>
          </div>
        </section>

        {/* Meet the Founder Section */}
        <section className="py-20 bg-slate-900">
          
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Image (First on mobile, Left on desktop) */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative order-1 lg:order-1"
              >
                <div className="relative bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-3xl p-8 border border-blue-600/30 backdrop-blur-sm">
                  {/* Profile Image Container */}
                  <div className="relative w-full max-w-md mx-auto">
                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl overflow-hidden relative">
                      {/* Profile Image Placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 bg-blue-600/30 rounded-full flex items-center justify-center">
                          <Users className="w-16 h-16 text-blue-400" />
                        </div>
                      </div>
                      {/* You can replace this with an actual image */}
                      {/* <Image
                        src="/images/founder-photo.jpg"
                        alt="Penny Pips - Founder"
                        fill
                        className="object-cover"
                      /> */}
                    </div>
                    
                    {/* Social Proof Badge */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-black/80 backdrop-blur-sm border border-blue-600/30 rounded-full px-6 py-3 flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-300">Featured on:</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">YT</span>
                          </div>
                          <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">MW</span>
                          </div>
                          <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">MD</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Side - Content (Second on mobile, Right on desktop) */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8 order-2 lg:order-2"
              >
                {/* Header */}
                <div>
                  <div className="text-blue-400 font-semibold text-sm tracking-wide uppercase mb-2">
                    MEET THE FOUNDER
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Hi, I'm Penny Pips <span className="inline-block">👋</span>
                  </h2>
                </div>

                {/* Bio Text */}
                <div className="space-y-6 text-gray-300 leading-relaxed text-base lg:text-sm">
                  <p>
                    I started trading in 2017 while working <strong className="font-semibold">16-hour days shoveling snow</strong> with a plastic shovel for minimum wage. My bosses were even cutting hours off my checks, so despite working <strong className="font-semibold">100+ hours a week</strong>, I still couldn't cover my bills. I felt stuck, exhausted, and knew I needed another way out.
                  </p>
                  
                  <p>
                    That's when my crew lead mentioned trading. With just <strong className="font-semibold">$300</strong>, I jumped straight into a live account (never even touched demo). At first it was pure gambling, but I quickly picked up backtesting and stat-tracking before it was popular, and that completely changed the way I approached the markets.
                  </p>

                  <p>
                    Over the years, I've traded with <strong className="font-semibold">prop firms, private lenders</strong>, and even built and operated my own prop firms. This gave me a unique view into the backend analytics of thousands of traders. By studying what worked (and what didn't), I pulled the best aspects of countless strategies and combined them with my own <strong className="font-semibold">small-account experience</strong>.
                  </p>
                </div>

                {/* Achievements */}
                <div className="space-y-4 mt-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex items-start space-x-3"
                  >
                    <span className="text-blue-400 text-lg">✅</span>
                    <p className="text-gray-300 text-base lg:text-sm">
                      <strong className="font-semibold">Full-time trader and prop firm operator</strong> for the past 5 years.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex items-start space-x-3"
                  >
                    <span className="text-blue-400 text-lg">✅</span>
                    <p className="text-gray-300 text-base lg:text-sm">
                      <strong className="font-semibold">Inside knowledge</strong> of how traders succeed (and fail).
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex items-start space-x-3"
                  >
                    <span className="text-blue-400 text-lg">✅</span>
                    <p className="text-gray-300 text-base lg:text-sm">
                      Founder of <strong className="font-semibold">multiple prop firms</strong> with direct insight into trader performance.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="flex items-start space-x-3"
                  >
                    <span className="text-blue-400 text-lg">✅</span>
                    <p className="text-gray-300 text-base lg:text-sm">
                      Now sharing everything I've learned to help others <strong className="font-semibold">build trading skills</strong> and approach account growth more effectively.
                    </p>
                  </motion.div>
                </div>

                {/* Call to Action Text */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="space-y-4 pt-6"
                >
                  <p className="text-gray-300 text-base lg:text-sm">
                    If you want to learn the skills and strategies behind account growth through <strong className="font-semibold">proven, battle-tested education</strong>, you're in the right place.
                  </p>
                </motion.div>
              </motion.div>
            </div>

            {/* Stats Section */}
            <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 max-w-4xl mx-auto">
              {[
                {
                  number: "8+",
                  targetValue: 8,
                  label: "YEARS OF EXPERIENCE AS A\nFULL-TIME TRADER",
                  color: "text-[#ffc62d]",
                  suffix: "+"
                },
                {
                  number: "$1M+",
                  targetValue: 1000000,
                  label: "TURNED $5,000 INTO 7\nFIGURES",
                  color: "text-[#ffc62d]",
                  prefix: "$",
                  suffix: "M+"
                }
              ].map((stat, index) => (
                <CountUpStat
                  key={index}
                  targetValue={stat.targetValue}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  label={stat.label}
                  color={stat.color}
                  delay={index * 0.2}
                />
              ))}
                  </div>
          </div>
        </section>

        {/* Trade Results Showcase Section */}
        <section className="py-20 bg-slate-900">
          <div id="how-it-works"></div>
          <div className="max-w-7xl mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 px-6 md:px-0">
                Real Results from the <span className="text-[#ffc62d]">Flip Blueprint</span>
              </h2>
                </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {/* Large Feature Card - Trade Performance */}
            <div className="md:col-span-2 lg:col-span-2 md:row-span-2 bg-black/40 backdrop-blur-sm border border-[#232323] rounded-3xl p-8 hover:border-[#ffc62d]/30 transition-all duration-300">
                <div className="h-full flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Weekly Performance
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Actual broker statement showing strategy performance
                    </p>
            </div>
                  
                  {/* Placeholder for broker statement image */}
                  <div className="flex-1 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700/50 flex items-center justify-center min-h-[300px]">
                    <div className="text-center">
                      <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-sm">Broker Statement Screenshot</p>
                      <p className="text-[#ffc62d] font-semibold mt-2">$500 → $2,100</p>
            </div>
          </div>
                  
                  {/* Disclaimer */}
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <p className="text-xs text-gray-500 text-center">
                      Personal Results - Not Typical - For Educational Purposes Only
                    </p>
                  </div>
                </div>
                        </div>

              {/* Strategy Stats Card */}
                <div className="bg-black/40 backdrop-blur-sm border border-[#232323] rounded-3xl p-6 hover:border-[#ffc62d]/30 transition-all duration-300">
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-3">Win Rate</h4>
                    <div className="text-3xl font-bold text-[#ffc62d] mb-2">73%</div>
                    <p className="text-gray-400 text-sm">Verified over 200+ trades</p>
          </div>
                  
                  {/* Disclaimer */}
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <p className="text-xs text-gray-500 text-center">
                      Personal Results - Not Typical - For Educational Purposes Only
                    </p>
                  </div>
                </div>
                                </div>

              {/* ROI Card */}
            <div className="bg-black/40 backdrop-blur-sm border border-[#232323] rounded-3xl p-6 hover:border-[#ffc62d]/30 transition-all duration-300">
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-3">Weekly ROI</h4>
                    <div className="text-3xl font-bold text-[#ffc62d] mb-2">320%</div>
                    <p className="text-gray-400 text-sm">$500 starting balance</p>
            </div>
                  
                  {/* Disclaimer */}
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <p className="text-xs text-gray-500 text-center">
                      Personal Results - Not Typical - For Educational Purposes Only
                    </p>
                  </div>
          </div>
                          </div>

              {/* MyFXBook Verification */}
            <div className="md:col-span-2 lg:col-span-2 bg-black/40 backdrop-blur-sm border border-[#232323] rounded-3xl p-6 hover:border-[#ffc62d]/30 transition-all duration-300">
                <div className="h-full flex flex-col">
                  <div className="mb-4">
                    <h4 className="text-xl font-bold text-white mb-3">Third-Party Verification</h4>
                    <p className="text-gray-400 text-sm mb-4">MyFXBook public tracking record</p>
                  </div>
                  
                  {/* Placeholder for MyFXBook screenshot */}
                  <div className="flex-1 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700/50 flex items-center justify-center min-h-[200px]">
                    <div className="text-center">
                      <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">MyFXBook Screenshot</p>
                    </div>
                  </div>
                  
                  {/* Disclaimer */}
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <p className="text-xs text-gray-500 text-center">
                      Personal Results - Not Typical - For Educational Purposes Only
                    </p>
                  </div>
                </div>
                </div>


            </div>
            {/* Bottom CTA */}
            <div className="text-center mt-16">
              {/* Accordion for Disclaimer */}
              <div className="max-w-4xl mx-auto">
                <details className="group">
                  <summary className="cursor-pointer list-none">
                    <div className="flex items-center justify-center gap-2 text-gray-400 hover:text-gray-300 transition-colors duration-200 mb-4">
                      <span className="text-sm font-medium">Disclaimer about the performance shown</span>
                      <svg 
                        className="w-4 h-4 transition-transform duration-200 group-open:rotate-180" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </summary>
                  
                  <div className="mt-4">
                    <p className="text-gray-500 text-xs leading-relaxed mb-8 px-4 md:px-16 lg:px-24 max-w-4xl mx-auto">
                      Disclaimer: The performance results shown are from a live account with FusionMarkets and have been independently verified via MyFXBook. Past performance is not necessarily indicative of future results. Trading foreign exchange and leveraged financial products carries a high level of risk. Only "Risk Capital" should be used for trading — that is, money you can afford to lose without impacting your financial security. No representation and/or guarantee is being made that any person or account will or is likely to achieve profits or losses similar to those shown. Any and all information discussed and/or shown throughout this website is for educational and informational purposes only and should not be considered tax, legal or investment advice. This does not represent our full Disclaimer. Please read our complete disclaimer. 
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-gray-400 px-4">
                      <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm border border-gray-700/30 rounded-full px-4 py-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="whitespace-nowrap">Verified broker statements</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm border border-gray-700/30 rounded-full px-4 py-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="whitespace-nowrap">Public MyFXBook tracking</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm border border-gray-700/30 rounded-full px-4 py-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="whitespace-nowrap">Real-time performance</span>
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            </div>

            {/* Skill Levels Section */}
            <div className="mt-16">
              <div className="text-center mb-12">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Perfect for <span className="text-[#ffc62d]">All Skill Levels</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {/* Complete Beginner */}
                <div className="bg-black/40 backdrop-blur-sm border border-[#232323] rounded-2xl p-8 text-center hover:border-[#ffc62d]/30 transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-600/30">
                    <BookOpen className="w-10 h-10 text-green-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-4">Complete Beginner</h4>
                  <ul className="text-gray-400 text-sm space-y-2 text-left">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      Start with zero trading knowledge
                      </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      Learn market fundamentals first
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      Step-by-step strategy breakdown
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      Risk management basics
                    </li>
                  </ul>
                </div>

                {/* Some Experience */}
                <div className="bg-black/40 backdrop-blur-sm border border-[#ffc62d]/50 rounded-2xl p-8 text-center hover:border-[#ffc62d] transition-all duration-300 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#ffc62d] text-black px-3 py-1 rounded-full text-xs font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-[#ffc62d]/20 to-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#ffc62d]/50">
                    <TrendingUp className="w-10 h-10 text-[#ffc62d]" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-4">Some Experience</h4>
                  <ul className="text-gray-400 text-sm space-y-2 text-left">
                    <li className="flex items-start">
                      <span className="text-[#ffc62d] mr-2">•</span>
                      Refine existing trading skills
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#ffc62d] mr-2">•</span>
                      Fix common trading mistakes
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#ffc62d] mr-2">•</span>
                      Advanced entry/exit techniques
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#ffc62d] mr-2">•</span>
                      Consistency improvement methods
                    </li>
                  </ul>
                </div>

                {/* Experienced Trader */}
                <div className="bg-black/40 backdrop-blur-sm border border-[#232323] rounded-2xl p-8 text-center hover:border-[#ffc62d]/30 transition-all duration-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-600/30">
                    <DollarSign className="w-10 h-10 text-blue-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-4">Experienced Trader</h4>
                  <ul className="text-gray-400 text-sm space-y-2 text-left">
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      Scale existing profitable strategies
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      Advanced market psychology
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      Portfolio optimization techniques
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      Professional-level execution
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Message */}
              <div className="text-center mt-12">
                <div className="bg-black/20 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 max-w-3xl mx-auto">
                  <p className="text-gray-300 text-sm">
                    <strong className="text-white">No matter your current level,</strong> the Flip Blueprint provides clear, actionable steps to help you develop consistent trading skills and approach account growth more effectively.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

                  {/* Pricing Section */}
          <section className="py-20 bg-slate-900 relative overflow-hidden">
            {/* Floating Orbs Layer - Behind everything */}
            <div className="absolute inset-0 pointer-events-none opacity-0">
              <div className="relative max-w-7xl mx-auto h-full">
                {/* Middle Left Orb - Desktop */}
                <div className="absolute top-1/2 -translate-y-1/2 -left-20 w-96 h-96 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-full blur-3xl hidden md:block animate-pulse"></div>
                {/* Middle Right Orb - Desktop */}
                <div className="absolute top-1/2 -translate-y-1/2 -right-20 w-96 h-96 bg-gradient-to-br from-[#ffc62d]/30 to-yellow-500/30 rounded-full blur-3xl hidden md:block animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
            
            <div className="max-w-6xl mx-auto px-6 md:px-4 relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 max-w-4xl mx-auto px-4 md:px-8">
                  Learn The Flip Blueprint Strategy That Could Help Transform Your Trading📈
                </h2>
              </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto relative">
                  {/* Free Intro Trading MasterClass */}
                <div className="relative group">
           <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-600/30 rounded-3xl p-8 hover:border-gray-500 transition-all duration-300 hover:scale-105 relative overflow-hidden">
             {/* Background Glow Effect */}
             <div className="absolute inset-0 bg-gradient-to-br from-gray-600/10 via-transparent to-gray-800/10"></div>
             
             <div className="relative z-10">
               {/* FREE Badge */}
               <div className="mb-4">
                 <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                   FREE
                 </span>
               </div>
               
               {/* Title */}
               <div className="text-left mb-6">
                 <h3 className="text-xl font-bold text-white">Intro Trading MasterClass</h3>
               </div>

               {/* Image Placeholder */}
               <div className="mb-6">
                 <div className="w-full h-40 bg-gradient-to-br from-gray-700/40 to-gray-800/40 rounded-xl border border-gray-600/30 flex items-center justify-center">
                   <div className="text-gray-400 text-center">
                     <BookOpen className="w-10 h-10 mx-auto mb-2" />
                     <p className="text-xs">Free Training Video</p>
                   </div>
                 </div>
               </div>

               {/* Paragraph */}
               <div className="mb-6">
                 <p className="text-gray-300 text-sm">Watch a free training film where I outline a lot of the things that held me back in the beginning that I was able to figure out. This will immediately put you ahead of 99% in the world when it comes to trading and lays a proper foundation for your trading career.</p>
               </div>

               {/* CTA Button */}
               <Link
                 href="/flip-blueprint/intro-webinar"
                 className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-center block shadow-lg hover:shadow-xl text-sm"
               >
                 Start Learning For FREE
               </Link>
            </div>
           </div>
                </div>

                  {/* the flip blueprint - Featured */}
         <div className="relative group">

                      <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-3xl p-8 border border-blue-600/30 backdrop-blur-sm hover:border-blue-400 transition-all duration-300 hover:scale-105 relative overflow-hidden shadow-2xl transform lg:scale-110">
             {/* Background Glow Effect */}
             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-700/15"></div>
             
             <div className="relative z-10">
               {/* Price Badge */}
               <div className="mb-4">
                 <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                   $499
                 </span>
               </div>
               
               {/* Title */}
               <div className="text-left mb-6">
                 <h3 className="text-xl font-bold text-white">The Flip Blueprint + Private Team</h3>
          </div>

               {/* Image Placeholder */}
               <div className="mb-6">
                 <div className="w-full h-36 bg-gradient-to-br from-black/60 to-gray-900/60 rounded-xl border border-blue-600/30 flex items-center justify-center">
                   <div className="text-blue-400 text-center">
                     <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                     <p className="text-sm">Trading Dashboard Preview</p>
                   </div>
                 </div>
               </div>

               {/* Paragraph */}
               <div className="mb-6">
                 <p className="text-gray-300 text-sm">Learn everything I have taken from my 8+ years of trading and investing in a self paced, beginner to expert education process. This will also grant you trial access to our private trading team, and put you on the front line of everything we do at Ascendant Academy.</p>
               </div>

               {/* CTA Button */}
               <Link
                 href="/checkout?plan=accelerator"
                 className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 text-center block shadow-xl hover:shadow-2xl hover:scale-105"
               >
                 Learn More About The Flip Blueprint
               </Link>
             </div>
           </div>
         </div>

         {/* private team access */}
                <div className="relative group">
           <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-600/30 rounded-3xl p-8 hover:border-gray-500 transition-all duration-300 hover:scale-105 relative overflow-hidden">
             {/* Background Glow Effect */}
             <div className="absolute inset-0 bg-gradient-to-br from-gray-600/10 via-transparent to-gray-800/10"></div>
             
             <div className="relative z-10">
               {/* Price Badge */}
               <div className="mb-4">
                 <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                   $4.99
                 </span>
               </div>
               
               {/* Title */}
               <div className="text-left mb-6">
                 <h3 className="text-xl font-bold text-white">Private Team Access</h3>
               </div>

               {/* Image Placeholder */}
               <div className="mb-6">
                 <div className="w-full h-40 bg-gradient-to-br from-gray-700/40 to-gray-800/40 rounded-xl border border-gray-600/30 flex items-center justify-center">
                   <div className="text-gray-400 text-center">
                     <Users className="w-10 h-10 mx-auto mb-2" />
                     <p className="text-xs">Trading Tools Preview</p>
                   </div>
                 </div>
               </div>

               {/* Paragraph */}
               <div className="mb-6">
                 <p className="text-gray-300 text-sm">Access our private teams premium discord and all of our trading tools, intro education, indicators and templates. You can use this to follow along with videos, our discord alerts or just for your own trading.</p>
               </div>

               {/* CTA Button */}
               <Link
                 href="/checkout?plan=tools-suite"
                 className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-center block shadow-lg hover:shadow-xl text-sm"
               >
                 Join The Private Team
               </Link>
             </div>
           </div>
                </div>
            </div>


          </div>
        </section>

        {/* Performance Proof Section */}
        <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffc62d]/5 via-transparent to-blue-600/10"></div>
          
          <div className="max-w-7xl mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                <span className="text-[#ffc62d]">$1,600 Profit</span> in One Week
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
                Starting with just $500, here's the actual documented performance using the Flip Blueprint strategy
              </p>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center bg-black/40 backdrop-blur-sm border border-[#232323] rounded-2xl p-8 hover:border-[#ffc62d]/30 transition-all duration-300">
                <div className="text-4xl font-bold text-gray-300 mb-2">$500</div>
                <p className="text-gray-400">Starting Balance</p>
              </div>
              <div className="text-center bg-black/40 backdrop-blur-sm border border-[#232323] rounded-2xl p-8 hover:border-[#ffc62d]/30 transition-all duration-300">
                <div className="text-4xl font-bold text-[#ffc62d] mb-2">$2,100</div>
                <p className="text-gray-400">Ending Balance</p>
              </div>
              <div className="text-center bg-black/40 backdrop-blur-sm border border-[#232323] rounded-2xl p-8 hover:border-[#ffc62d]/30 transition-all duration-300">
                <div className="text-4xl font-bold text-[#ffc62d] mb-2">320%</div>
                <p className="text-gray-400">Return in 7 Days</p>
              </div>
            </div>

            {/* Evidence Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Broker Statement 1 */}
                <div className="bg-black/40 backdrop-blur-sm border border-[#232323] rounded-2xl p-6 hover:border-[#ffc62d]/30 transition-all duration-300">
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-white mb-2">Day 1-3 Performance</h4>
                  <p className="text-gray-400 text-sm">Broker statement screenshot</p>
                  </div>
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700/50 flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Broker Statement Image</p>
                    <p className="text-[#ffc62d] font-semibold mt-2">$500 → $950</p>
                  </div>
                  </div>
                </div>

              {/* MyFXBook Verification */}
              <div className="bg-black/40 backdrop-blur-sm border border-[#232323] rounded-2xl p-6 hover:border-[#ffc62d]/30 transition-all duration-300">
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-white mb-2">MyFXBook Tracking</h4>
                  <p className="text-gray-400 text-sm">Third-party verification</p>
            </div>
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700/50 flex items-center justify-center">
                  <div className="text-center">
                    <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">MyFXBook Screenshot</p>
                    <p className="text-[#ffc62d] font-semibold mt-2">Public Record</p>
                  </div>
                </div>
              </div>

              {/* Final Results */}
              <div className="bg-black/40 backdrop-blur-sm border border-[#232323] rounded-2xl p-6 hover:border-[#ffc62d]/30 transition-all duration-300">
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-white mb-2">Week End Results</h4>
                  <p className="text-gray-400 text-sm">Final broker statement</p>
                </div>
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700/50 flex items-center justify-center">
                  <div className="text-center">
                    <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Final Statement</p>
                    <p className="text-[#ffc62d] font-semibold mt-2">$2,100 Total</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Note */}
            <div className="text-center mt-12 bg-black/40 backdrop-blur-sm border border-[#232323] rounded-2xl p-6">
              <p className="text-gray-300 mb-4">
                <strong className="text-white">Disclaimer:</strong> These results represent specific trading performance during a particular market period. 
                Individual results may vary based on market conditions, individual skill, and risk management. 
                All evidence shown includes actual broker statements and third-party verification for transparency.
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Real broker account</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Verified statements</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Public tracking</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call Booking Section */}
        <section className="py-20 bg-slate-900">
          <div id="call-booking"></div>
          <div className="max-w-7xl mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Not sure where to start?<br />
                <span className="text-[#ffc62d]">Book a FREE Discovery Call</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
                Talk with Penny Pips directly to see if the Flip Blueprint strategy is right for you
              </p>
            </div>

            {/* Call Booking Container */}
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
                
                {/* Left Side - Call Info Card */}
              <div className="bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-blue-600/30 rounded-2xl lg:rounded-3xl p-6 lg:p-8 relative overflow-hidden">
                  {/* Background Gradient Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
                  
                  <div className="relative z-10">
                    {/* Profile Images */}
                    <div className="flex items-center mb-4 lg:mb-6">
                      <div className="flex -space-x-2 lg:-space-x-3">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-[#ffc62d] to-yellow-500 border-2 border-white flex items-center justify-center">
                          <span className="text-black font-bold text-xs lg:text-sm">PP</span>
                </div>
                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 border-2 border-white flex items-center justify-center">
                          <Users className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 lg:mb-6">
                      FREE Discovery Call
                    </h3>
                    
                    <p className="text-gray-300 text-base lg:text-lg mb-4 lg:mb-6 leading-relaxed">
                      Talk with Penny Pips directly and experienced traders who have been through the 
                      Flip Blueprint process to see if it's right for you.
                    </p>

                    <div className="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
                  
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-[#ffc62d] mt-1 flex-shrink-0" />
                        <span className="text-gray-300 text-sm lg:text-base">Account size and goal evaluation</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-[#ffc62d] mt-1 flex-shrink-0" />
                        <span className="text-gray-300 text-sm lg:text-base">Next steps recommendation</span>
                      </div>
                    </div>

                    <div className="bg-[#ffc62d]/10 rounded-xl p-3 lg:p-4 border border-[#ffc62d]/20 mb-4 lg:mb-6">
                      <p className="text-[#ffc62d] text-xs lg:text-sm">
                        <strong>This call is to see how the Flip Blueprint strategy can help you achieve your trading goals.</strong>
                      </p>
                    </div>

                    <p className="text-gray-400 text-sm lg:text-base">
                      <strong className="text-white">Schedule your call today,</strong> and we look forward to speaking with you soon!
                    </p>
                  </div>
              </div>

                {/* Right Side - Calendar Booking */}
              <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-2xl">
                  <div className="mb-4 lg:mb-6">
                    <h4 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Schedule A Call</h4>
                    <p className="text-gray-600 text-sm lg:text-base">Choose your preferred time</p>
                </div>

                  {/* Calendar Placeholder */}
                  <div className="bg-gray-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 mb-4 lg:mb-6">
                    <div className="flex items-center justify-between mb-3 lg:mb-4">
                      <button className="p-1.5 lg:p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <h5 className="text-base lg:text-lg font-semibold text-gray-900">December 2024</h5>
                      <button className="p-1.5 lg:p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 lg:gap-2 text-center text-xs lg:text-sm">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="py-1.5 lg:py-2 text-gray-500 font-medium">{day}</div>
                      ))}
                      
                      {/* Calendar Days */}
                      {Array.from({ length: 35 }, (_, i) => {
                        const day = i - 6; // Adjust for month start
                        const isCurrentMonth = day > 0 && day <= 31;
                        const isSelected = day === 15;
                        const isAvailable = isCurrentMonth && day > 10;
                        
                        return (
                          <div
                            key={i}
                            className={`
                              py-1.5 lg:py-2 text-xs lg:text-sm rounded-lg cursor-pointer transition-colors
                              ${!isCurrentMonth ? 'text-gray-300' : ''}
                              ${isSelected ? 'bg-blue-600 text-white font-semibold' : ''}
                              ${isAvailable && !isSelected ? 'hover:bg-blue-100 text-gray-900' : ''}
                              ${!isAvailable && isCurrentMonth ? 'text-gray-400 cursor-not-allowed' : ''}
                            `}
                          >
                            {isCurrentMonth ? day : ''}
                </div>
                        );
                      })}
                </div>
                  </div>

                  {/* Time Zone */}
                  <div className="mb-4 lg:mb-6">
                    <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">Time zone</label>
                    <select className="w-full p-2.5 lg:p-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base">
                      <option>GMT-06:00 America/Edmonton (MST)</option>
                      <option>GMT-05:00 America/New_York (EST)</option>
                      <option>GMT-08:00 America/Los_Angeles (PST)</option>
                    </select>
                  </div>

                  {/* Book Call Button */}
                <Link
                    href="/book-call"
                    className="w-full bg-blue-600 text-white py-3 lg:py-4 rounded-xl font-semibold text-base lg:text-lg hover:bg-blue-700 transition-colors text-center block shadow-lg hover:shadow-xl"
                >
                    Book Your FREE Call
                </Link>

                  <p className="text-gray-500 text-xs lg:text-sm text-center mt-3 lg:mt-4">
                    30-minute call • No obligations • Completely free
                  </p>
              </div>

              </div>
            </div>

            {/* Bottom Trust Indicators */}
            <div className="text-center mt-16">
              <div className="flex items-start justify-center text-sm text-gray-400 gap-2 md:gap-1 md:max-w-3xl md:mx-auto">
                <div className="flex flex-col items-center w-1/4">
                  <Shield className="w-5 h-5 text-[#ffc62d] mb-1" />
                  <span className="text-xs leading-tight text-center">100% Free consultation</span>
                </div>
                <div className="flex flex-col items-center w-1/4">
                  <Clock className="w-5 h-5 text-[#ffc62d] mb-1" />
                  <span className="text-xs leading-tight text-center">30-minute session</span>
                </div>
                <div className="flex flex-col items-center w-1/4">
                  <CheckCircle className="w-5 h-5 text-[#ffc62d] mb-1" />
                  <span className="text-xs leading-tight text-center">No pressure, no obligations</span>
                </div>
                <div className="flex flex-col items-center w-1/4">
                  <Users className="w-5 h-5 text-[#ffc62d] mb-1" />
                  <span className="text-xs leading-tight text-center">Direct access to Penny Pips</span>
                </div>
              </div>
            </div>
          </div>
        </section>


      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
