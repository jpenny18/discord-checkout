'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, TrendingUp, Shield, Users, BarChart3, BookOpen, Play, ArrowRight, Menu, X, DollarSign, Calculator, Bell, GraduationCap } from 'lucide-react';
import Footer from '@/components/Footer';

// ============================================
// ORIGINAL PAGE CODE BELOW (PRESERVED)
// ============================================

// Declare Wistia custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wistia-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'media-id'?: string;
        aspect?: string;
      };
    }
  }
}

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

export default function _OriginalHomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeCaseStudy, setActiveCaseStudy] = useState('500-flip');
  const [caseStudyImageIndex, setCaseStudyImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Main showcase tools data
  const showcaseTools = [
    {
      id: 'journal',
      name: 'Journal',
      icon: BookOpen,
      image: '/images/tools/journal-preview.png'
    },
    {
      id: 'calculator',
      name: 'Calculator',
      icon: Calculator,
      image: '/images/tools/calculator-preview.png'
    },
    {
      id: 'alerts',
      name: 'Alerts',
      icon: Bell,
      image: '/images/tools/alerts-preview.png'
    },
    {
      id: 'courses',
      name: 'Courses',
      icon: GraduationCap,
      image: '/images/tools/courses-preview.png'
    }
  ];

  // Case studies data
  type CaseStudy = {
    title: string;
    description: string;
    images: string[];
    breakdown: string;
    keyPoints: string[];
  };

  const caseStudies: Record<string, CaseStudy> = {
    '500-flip': {
      title: '$500 Account',
      description: 'See how I turned $500 into $2,500 in one month using our proven strategy',
      images: Array.from({ length: 27 }, (_, i) => `/500-flip/500-${i + 1}.png`),
      breakdown: 'This flip demonstrates the power of my personal KCZ strategy combined with strict risk management. Key trades included catching the two trades on EUR/USD on 2025.07.07 for +$720. The most important lesson: patience in waiting for A+ setups and sticking to your trading plan.',
      keyPoints: ['Sticking to trading plan', 'Allowing the trade to play out', 'Letting winners run']
    },
    '300-flip': {
      title: '$300 Account',
      description: 'See how I doubled $300 in one week using our proven strategy ',
      images: Array.from({ length: 9 }, (_, i) => `/300-flip/300-${i + 1}.png`),
      breakdown: 'Starting with just $300 requires extreme discipline. Key trades included catching two trades on EUR/USD on 2025.11.07 for +$317. The most important lesson: Focus on high quality setups to create a buffer quick',
      keyPoints: ['Focus on high quality setups', 'Create a buffer quickly', 'Stick to your trading plan']
    },
    'ftmo-challenge': {
      title: 'FTMO Challenge',
      description: 'Passing a $10k challenge in 2 trades  ',
      images: Array.from({ length: 8 }, (_, i) => `/ftmo-pass/ftmo-${i + 1}.png`),
      breakdown: 'The FTMO challenge requires a different approach - slow and steady wins the race. I used our institutional trading strategy focusing on high probability setups on the macro timeframes. This allowed me to pass the FTMO step 1 and step 2 in one trade each.',
      keyPoints: ['Prop firm specific strategies', 'Macro timeframes', 'Psychological preparation']
    }
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Wistia Player Scripts */}
      <Script src="https://fast.wistia.com/player.js" strategy="lazyOnload" />
      <Script src="https://fast.wistia.com/embed/3ymo9d7dq2.js" strategy="lazyOnload" type="module" />
      
      {/* Navigation Header */}
      <header className="relative z-50">
        {/* Main Navigation */}
        <nav className="bg-slate-900 border-b border-[#232323] shadow-lg relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-repeat" style={{
              backgroundImage: 'radial-gradient(circle at center, #ffc62d 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }} />
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffc62d]/5 via-transparent to-blue-600/10 pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center h-16">
              {/* Centered Logo - Not Clickable */}
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
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ffc62d]/5 via-transparent to-blue-600/10"></div>
        
        <div className="max-w-6xl mx-auto px-4 pt-8 pb-20 min-h-screen relative z-10 flex flex-col justify-center">
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
              className="text-center max-w-5xl mx-auto px-4"
            >
              <h1 className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                <div>
                  Learn To Become A Skilled Trader With{' '}
                  <span 
                    className="relative inline-block" 
                    style={{
                      transform: isMobile ? 'skew(-1deg) rotate(-1deg)' : 'none',
                    }}
                  >
                    <span className="relative z-10 text-black font-bold px-3 py-2 drop-shadow-sm">
                      Real Proof
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ffc62d] via-yellow-400 to-[#ffb000] shadow-md"></div>
                    <div className="absolute inset-0 bg-gradient-to-tl from-[#ffc62d]/60 via-yellow-300/40 to-[#ffb000]/50 blur-sm"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#ffc62d]/30 to-yellow-400/20 rounded-lg blur-sm"></div>
                  </span>
                </div>
              </h1>
            </motion.div>

            {/* Subtitle */}
              <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-sm sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto px-6">
                We are the only trading education platform that openly shows <strong className="text-white">verified broker statements and live trading results</strong> — 
                proving our methods work in real markets. Learn with confidence, backed by real evidence.
              </h3>
              </motion.div>

            {/* CTA Button */}
              <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              >
                <button 
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-xl sm:rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-xl border border-blue-700"
              >
                <span>⚡</span>
                <span>Join Ascendant Academy</span>
                </button>
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
              <a href="/terms" className="hover:text-gray-300 transition-colors">
                <span>Trading Involves Risk, Read Our Disclaimer</span>
              </a>
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
            <div className="relative bg-black/40 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-4 md:p-6 shadow-2xl">
              <div className="aspect-video bg-black rounded-xl overflow-hidden relative">
                {/* Wistia Video Player */}
                <style dangerouslySetInnerHTML={{
                  __html: `
                    wistia-player[media-id='3ymo9d7dq2']:not(:defined) { 
                      background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/3ymo9d7dq2/swatch'); 
                      display: block; 
                      filter: blur(5px); 
                      padding-top: 56.25%; 
                    }
                  `
                }} />
                <wistia-player 
                  media-id="3ymo9d7dq2" 
                  aspect="1.7777777777777777"
                  className="w-full h-full"
                ></wistia-player>
              </div>
            </div>
          </motion.div>
          </div>
        </section>

      {/* Case Studies Section */}
      <section id="case-studies" className="py-20 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Real Account <span className="text-blue-400">Case Studies</span>
            </h2>
          </motion.div>

          {/* Case Study Selector */}
          <div className="flex flex-wrap justify-center gap-1.5 md:gap-4 mb-12 px-2 md:px-0">
            {Object.entries(caseStudies).map(([key, study]) => (
              <button 
                key={key}
                onClick={() => {
                  setActiveCaseStudy(key);
                  setCaseStudyImageIndex(0);
                }}
                className={`px-2.5 md:px-6 py-1.5 md:py-3 rounded-full font-semibold transition-all text-[11px] md:text-base ${
                  activeCaseStudy === key
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {study.title}
              </button>
            ))}
          </div>

          {/* Active Case Study */}
          <AnimatePresence mode="wait">
                  <motion.div
              key={activeCaseStudy}
                    initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-900 rounded-2xl border border-gray-800 p-8"
            >
              <div className="grid md:grid-cols-2 gap-8">
                {/* Image Slider */}
                          <div>
                  <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-[4/3]">
                    <Image
                      src={caseStudies[activeCaseStudy].images[caseStudyImageIndex]}
                      alt={`${caseStudies[activeCaseStudy].title} - Broker Statement ${caseStudyImageIndex + 1}`}
                      fill
                      className="object-contain"
                    />
                        </div>
                  
                  {/* Image navigation */}
                  <div className="flex items-center justify-center space-x-4 mt-4">
                    <button
                      onClick={() => setCaseStudyImageIndex(Math.max(0, caseStudyImageIndex - 1))}
                      className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                      disabled={caseStudyImageIndex === 0}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-gray-400">
                      {caseStudyImageIndex + 1} / {caseStudies[activeCaseStudy].images.length}
                    </span>
                    <button
                      onClick={() => setCaseStudyImageIndex(Math.min(caseStudies[activeCaseStudy].images.length - 1, caseStudyImageIndex + 1))}
                      className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                      disabled={caseStudyImageIndex === caseStudies[activeCaseStudy].images.length - 1}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                      </div>
                    </div>

                {/* Case Study Details */}
                <div>
                  <h3 className="text-2xl font-bold mb-2">{caseStudies[activeCaseStudy].title}</h3>
                  <p className="text-gray-400 mb-6">{caseStudies[activeCaseStudy].description}</p>
                  
                  <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold mb-3 text-blue-400">Detailed Breakdown</h4>
                    <p className="text-gray-300 leading-relaxed">{caseStudies[activeCaseStudy].breakdown}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Key Learning Points</h4>
                    <ul className="space-y-2">
                      {caseStudies[activeCaseStudy].keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
              </div>
            </div>
              </div>
            </motion.div>
          </AnimatePresence>
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
                <div className="relative w-full max-w-md lg:max-w-sm mx-auto">
                  <div className="aspect-[3/4] lg:aspect-[9/16] bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl overflow-hidden relative max-w-xs mx-auto">
                    <Image
                      src="/images/founder-photo.png"
                      alt="Penny Pips - Founder"
                      fill
                      className="object-cover object-top"
                    />
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
                color: "text-blue-400",
                suffix: "+"
              },
              {
                number: "$1M+",
                targetValue: 1000000,
                label: "TURNED $5,000 INTO 7\nFIGURES",
                color: "text-blue-400",
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

      {/* Why I Started This Section */}
      <section className="py-20 px-4 bg-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: 'radial-gradient(circle at center, #3b82f6 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Why I Started <span className="text-blue-400">Ascendant Academy</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Cutting through the hype to show you what's actually possible with proper trading education
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6 text-gray-300 leading-relaxed"
            >
              <p className="text-lg">
                I started Ascendant Academy to bring trading education back to <strong className="text-white">reality</strong>. 
                No lambos. No fake promises. Just real education focused on helping you learn skills that could potentially 
                supplement your income—or even replace it over time with consistent practice and proper risk management.
              </p>
              
              <p className="text-lg">
                Here's what most educators won't show you: I trade live on <strong className="text-white">small accounts</strong> starting 
                with as little as $300. Why? Because I want to demonstrate that even modest gains like $20-$100 per day can compound 
                into something meaningful over a 20-day trading month. These aren't theoretical results—they're backed by 
                <strong className="text-white"> actual broker statements</strong> showing real profits and losses.
              </p>

              <p className="text-lg">
                The strategy is simple: Learn to trade profitably on a small account first. Once you've proven your skills, 
                you can either inject more capital or use prop firm accounts to scale the same trades. A $50 trade on a $300 account 
                becomes a $500+ trade on a $10k prop account—<strong className="text-white">same strategy, bigger scale</strong>.
              </p>
            </motion.div>

            {/* Right Side - Growth Visualization Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 md:p-8"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  Realistic Trading Results in One Month
                </h3>
                <p className="text-sm text-gray-400">20 trading days in one month</p>
              </div>
              
              <div className="space-y-4">
                {[
                  { daily: '$20', monthly: '$400' },
                  { daily: '$50', monthly: '$1,000' },
                  { daily: '$100', monthly: '$2,000' }
                ].map((example, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="flex items-center justify-center gap-2 md:gap-4"
                  >
                    <div className="text-right">
                      <div className="text-2xl md:text-3xl font-bold text-white">{example.daily}</div>
                      <div className="text-xs text-gray-400">per day</div>
                    </div>
                    <div className="text-xl md:text-2xl text-blue-400">×</div>
                    <div className="text-center">
                      <div className="text-xl md:text-2xl font-bold text-blue-400">20</div>
                      <div className="text-xs text-gray-400">days</div>
                    </div>
                    <div className="text-xl md:text-2xl text-blue-400">=</div>
                    <div className="text-left">
                      <div className="text-2xl md:text-3xl font-bold text-blue-400">{example.monthly}</div>
                      <div className="text-xs text-gray-400">per month</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  * Educational examples only. Results vary based on market conditions, skill level, and risk management. Trading involves risk of loss.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Showcase Section */}
      <section id="features" className="py-20 px-4 relative bg-slate-900">
        <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            className="text-center mb-12"
              >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything You Need In <span className="text-blue-400">One Place</span>
            </h2>
              </motion.div>
              
          {/* Tool Navigation Buttons */}
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            {showcaseTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveSlide(showcaseTools.findIndex(t => t.id === tool.id))}
                  className={`flex flex-col items-center justify-center p-2 md:p-6 rounded-xl md:rounded-2xl transition-all duration-300 min-w-[70px] md:min-w-[120px] ${
                    activeSlide === showcaseTools.findIndex(t => t.id === tool.id)
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50'
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800'
                  }`}
                >
                  <IconComponent className="w-5 h-5 md:w-10 md:h-10 mb-1 md:mb-2" />
                  <span className="text-[10px] md:text-base font-semibold">{tool.name}</span>
                </button>
              );
            })}
                  </div>

          {/* Image Container */}
                      <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
            className="relative"
          >
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                {activeSlide === 0 ? (
                  // Journal Preview with 3 images
                  <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-black">
                    <div className="flex aspect-video">
                      {/* Preview 1 - Left side (75%) */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-3/4 bg-black flex items-center justify-center p-4 border-r border-gray-800"
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src="/images/journal-preview1.png"
                            alt="Trading Journal Preview"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </motion.div>

                      {/* Right side (25%) - Stacked images */}
                      <div className="w-1/4 flex flex-col">
                        {/* Preview 2 - Top right (50% of right side) */}
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="h-1/2 bg-black flex items-center justify-center p-2 border-b border-gray-800"
                        >
                          <div className="relative w-full h-full">
                            <Image
                              src="/images/journal-preview2.png"
                              alt="Trading Journal Feature 1"
                              fill
                              className="object-contain"
                            />
                          </div>
                        </motion.div>

                        {/* Preview 3 - Bottom right (50% of right side) */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                          className="h-1/2 bg-black flex items-center justify-center p-2"
                        >
                          <div className="relative w-full h-full">
                            <Image
                              src="/images/journal-preview3.png"
                              alt="Trading Journal Feature 2"
                              fill
                              className="object-contain"
                            />
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Other tools - Calculator, Alerts, Courses
                  <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-black">
                    <div className="relative aspect-video bg-black flex items-center justify-center p-4">
                      <Image
                        src={`/images/${showcaseTools[activeSlide].id}-preview.png`}
                        alt={`${showcaseTools[activeSlide].name} Preview`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

        {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: 'radial-gradient(circle at center, #3b82f6 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Choose Your <span className="text-blue-400">Path</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Real education backed by verified results. Start building your trading skills today.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Essential Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-3xl border border-blue-500/30 overflow-hidden"
            >
              {/* Card Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent pointer-events-none"></div>
              
              <div className="relative p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Basic</h3>
                  <p className="text-blue-300/80 text-sm mb-6">Best for beginner traders</p>
                  
                  {/* Pricing */}
                  <div className="mb-2">
                    <span className="text-gray-400 text-xl">$</span>
                    <span className="text-5xl md:text-6xl font-bold text-white">9.99</span>
                    <span className="text-gray-400 text-xl ml-2">/ Month</span>
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href="https://buy.stripe.com/cNidRb1CC97wgpxd1o93y00"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-transparent border-2 border-blue-500/50 text-white py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 text-center mb-8"
                >
                  Get Started
                </a>

                {/* Features List */}
                <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white text-sm">Basic Discord Access</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white text-sm">Trading journal</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white text-sm">Trading Position Size Calculator</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white text-sm">Market analysis dashboard</span>
                  </div>
                 
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white text-sm">Daily market analysis</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white text-sm">Real trade breakdowns</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white text-sm">Weekly recap breakdowns</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white text-sm">"Getting Started" module</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-black/50 backdrop-blur-sm rounded-3xl border-2 border-blue-500/50 overflow-hidden"
            >

              {/* Card Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-blue-500/10 to-transparent pointer-events-none"></div>
              
              <div className="relative p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3">PREMIUM</h3>
                  <p className="text-blue-300/80 text-sm mb-6">Best for advanced traders</p>
                  
                  {/* Pricing */}
                  <div className="mb-2">
                    <span className="text-gray-400 text-xl">$</span>
                    <span className="text-5xl md:text-6xl font-bold text-white">99</span>
                    <span className="text-gray-400 text-xl ml-2">/ Month</span>
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href="https://buy.stripe.com/aFacN74OOgzYflt6D093y01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 text-center mb-8"
                >
                  Get Started
                </a>

                {/* Features List */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white text-sm font-semibold">Everything in Essential</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white text-sm">Premium Discord rooms</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white text-sm">Trade alerts</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white text-sm">5x/week livestreams</span>
                  </div>
                  
                 
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white text-sm">library of past livestreams</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white text-sm">Monthly "Audit My Journal" call</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white text-sm">Priority Q&A</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white text-sm">Sessions Trade Replay</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Compliance Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-xs text-gray-500 max-w-3xl mx-auto leading-relaxed">
              <strong>Educational Service Disclaimer:</strong> Ascendant Academy provides trading education, tools, and market analysis for educational purposes only. 
              We do not provide personalized investment advice, manage client funds, or guarantee trading results. 
              All trading involves risk. Past performance is not indicative of future results.
            </p>
          </motion.div>
        </div>
      </section>

        {/* Footer */}
      <Footer />
    </main>
  );
} 