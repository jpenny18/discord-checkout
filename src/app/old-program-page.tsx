'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Target, TrendingUp, BookOpen, Users, Clock, Award, Shield, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '@/components/Footer';

export default function ProgramPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeCaseStudy, setActiveCaseStudy] = useState('500-flip');
  const [caseStudyImageIndex, setCaseStudyImageIndex] = useState(0);

  const phases = [
    {
      number: 1,
      title: 'Foundations & Market Clarity',
      description: 'Build professional-level fundamentals through TradingView setup, structure reading, trend identification, and proper journaling. Master the core skills that separate successful traders from those who struggle.',
      highlight: "You will build the foundation that makes every future lesson stick."
    },
    {
      number: 2,
      title: 'Live Mentorship + Implementation',
      description: 'Transition from understanding to execution through weekly 1:1 coaching and 5x/week live sessions. We review your charts in real-time, correct mistakes, and develop your ability to execute with confidence.',
      highlight: 'This is where you develop actual skill.'
    },
    {
      number: 3,
      title: 'Trading Excellence & Long-Term Consistency',
      description: 'Build lasting consistency through performance reviews, prop firm scalability planning, and advanced market techniques. Master emotional control and develop the discipline that turns knowledge into reliable performance.',
      highlight: 'This phase turns you from someone who knows how to trade into someone who performs.'
    }
  ];

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

  const proofPoints = [
    {
      icon: TrendingUp,
      title: 'Verified Broker Statements',
      description: 'See my real broker statements and performance.'
    },
    {
      icon: Target,
      title: 'Live Trade Feed',
      description: 'Real time alerts and trade notifications.'
    },
    {
      icon: Award,
      title: 'Back-end Experience',
      description: 'I own multiple prop firms so I know exactly why traders succeed or fail.'
    }
  ];

  const faqs = [
    {
      question: 'What is the Ascendant Accelerator?',
      answer: 'This is my 8-week personalized trading mentorship where I take you from wherever you are now and turn you into a proficient standalone trader. Unlike self-paced courses that leave you guessing, I hold your hand through live sessions, show you exactly what to do and what NOT to do in real-time, give you clear checklists of trade opportunities, and provide weekly accountability. You will learn to see the charts and execute opportunities the exact same way I do -- all backed by my verified live results and broker statements. This is hands-on mentorship, not just theory.'
    },
    {
      question: 'Is this suitable for beginners?',
      answer: 'Yes -- the Accelerator is built to take you from zero to confidently reading and trading the markets in 8 weeks.'
    },
    {
      question: 'Do I need prior trading experience?',
      answer: 'No. Everything is structured step-by-step.'
    },
    {
      question: 'How do the 1:1 calls work?',
      answer: 'Your weekly coaching session is booked automatically after joining.'
    },
    {
      question: 'What if I am in another country?',
      answer: 'It works anywhere. All live sessions and calls are online.'
    },
    {
      question: 'Do I need a powerful computer?',
      answer: 'No. Any modern laptop or MacBook Air works perfectly.'
    },
    {
      question: 'What if the program is not for me?',
      answer: 'We offer a 14-Day Skill Confidence Guarantee (conditional and compliance-safe).'
    },
    {
      question: 'How many trades will I follow?',
      answer: 'This is not a signal group -- you learn the framework and execution process so you can find trades yourself.'
    }
  ];

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
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
            <div className="flex items-center justify-center h-16">
              <div className="flex items-center space-x-2 md:space-x-3 select-none cursor-default">
                <Image
                  src="/images/logo.png"
                  alt="Ascendant Academy Logo"
                  width={32}
                  height={32}
                  className="rounded-full md:w-10 md:h-10 pointer-events-none"
                  draggable={false}
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#ffc62d]/5 via-transparent to-blue-600/10"></div>
        
        <div className="max-w-6xl mx-auto px-4 pt-8 pb-20 min-h-screen relative z-10 flex flex-col justify-center">
          <div className="text-center space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center mt-8 md:mt-12"
            >
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-sm font-medium">ACCELERATOR PROGRAM</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center max-w-5xl mx-auto px-4"
            >
              <h1 className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
                Learn To Trade With a Proven System Backed by{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-black font-bold px-3 py-2 drop-shadow-sm">
                    Real Proof
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ffc62d] via-yellow-400 to-[#ffb000] shadow-md"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-[#ffc62d]/60 via-yellow-300/40 to-[#ffb000]/50 blur-sm"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#ffc62d]/30 to-yellow-400/20 rounded-lg blur-sm"></div>
                </span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-sm sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto px-6">
                I am the only trader that openly shows <strong className="text-white">verified broker statements and live trading results </strong> proving my methods work in real markets. Learn to trade with confidence, backed by real evidence.
              </h3>
            </motion.div>

            {/* Mockup Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="w-full max-w-xl mx-auto px-4"
            >
              <div className="relative w-full aspect-video">
                <Image
                  src="/mockup.png"
                  alt="Ascendant Accelerator Mentorship Program"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Link href="/program/checkout">
                <button 
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-xl sm:rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-xl border border-blue-700"
                >
                  <span>🔥</span>
                  <span>Join the ASCENDANT Accelerator</span>
                </button>
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
              <Link href="/terms" className="hover:text-gray-300 transition-colors">
                <span>Trading Involves Risk, Read Our Disclaimer</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The ASCENDANT Blueprint */}
      <section className="py-20 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              The <span className="text-blue-400">ASCENDANT Blueprint</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              A structured 8-week mentorship program that takes you from beginner to confident trader
            </p>
          </motion.div>

          <div className="space-y-12">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-900 to-black border border-blue-500/30 rounded-3xl p-8 md:p-10"
              >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Left Side - Text Content */}
                  <div>
                    {/* Phase Label */}
                    <div className="mb-4">
                      <span className="text-blue-400 text-lg font-bold">Phase {phase.number}</span>
                    </div>
                    
                    {/* Phase Title */}
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                      {phase.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-400 text-base leading-relaxed mb-6">
                      {phase.description}
                    </p>
                    
                    {/* Key Points */}
                    <div className="flex flex-wrap gap-4">
                      {phase.number === 1 && (
                        <>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-blue-400" />
                            <span className="text-white font-semibold text-sm">Focus</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-blue-400" />
                            <span className="text-white font-semibold text-sm">Strategic Mastery</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-blue-400" />
                            <span className="text-white font-semibold text-sm">Self-Paced</span>
                          </div>
                        </>
                      )}
                      {phase.number === 2 && (
                        <>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-blue-400" />
                            <span className="text-white font-semibold text-sm">Live Coaching</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-blue-400" />
                            <span className="text-white font-semibold text-sm">Real-Time Feedback</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-blue-400" />
                            <span className="text-white font-semibold text-sm">Personalized</span>
                          </div>
                        </>
                      )}
                      {phase.number === 3 && (
                        <>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-blue-400" />
                            <span className="text-white font-semibold text-sm">Consistency</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-blue-400" />
                            <span className="text-white font-semibold text-sm">Performance Reviews</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-blue-400" />
                            <span className="text-white font-semibold text-sm">Scale Ready</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Side - Image */}
                  <div className="relative">
                    <div className="relative aspect-video flex items-center justify-center">
                      <div className="relative w-full h-full">
                        <Image
                          src={`/phase${phase.number}.png`}
                          alt={`Phase ${phase.number} - ${phase.title}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Proof Section */}
      <section className="py-20 px-4 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: 'radial-gradient(circle at center, #3b82f6 1px, transparent 1px)',
            backgroundSize: '40px 40px'
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
              Real <span className="text-blue-400">Proof</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Verified results you can see
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {proofPoints.map((point, index) => {
              const IconComponent = point.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl mb-6">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{point.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{point.description}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Case Studies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Real Account <span className="text-blue-400">Case Studies</span>
              </h3>
            </div>

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
          </motion.div>
        </div>
      </section>

      {/* Direct Checkout Section */}
      <section id="checkout" className="py-20 px-4 bg-gradient-to-br from-gray-900/80 to-black/80 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: 'radial-gradient(circle at center, #3b82f6 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Main Heading */}
            <div className="text-center mb-16 py-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight px-4">
                Start Your Trading Journey<br />The Correct Way
              </h2>
              <p className="text-lg md:text-xl text-gray-400 w-full max-w-xl mx-auto px-4">
                Join the ASCENDANT Accelerator and skip the trial-and-error most traders face.
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

            {/* CTA Button */}
            <div className="text-center mb-10">
              <Link href="/program/checkout" className="block">
                <button
                  className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-xl text-base md:text-lg font-bold hover:from-blue-700 hover:to-blue-600 transition-all duration-300 hover:scale-105 shadow-2xl w-full max-w-xl"
                >
                  <span className="text-lg">⚡</span>
                  <span>Join The Accelerator Now</span>
                </button>
              </Link>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="text-gray-400 text-sm">Secure:</div>
              <div className="flex items-center space-x-2">
                <div className="bg-gray-800 px-2 py-1 rounded text-gray-300 text-xs font-semibold">VISA</div>
                <div className="bg-gray-800 px-2 py-1 rounded text-gray-300 text-xs font-semibold">MC</div>
                <div className="bg-gray-800 px-2 py-1 rounded text-gray-300 text-xs font-semibold">AMEX</div>
              </div>
            </div>

            {/* Guarantee Section */}
            <div className="flex flex-col items-center justify-center bg-transparent border-none rounded-xl p-0 mt-4 w-full max-w-xl mx-auto space-y-3">
              <h3 className="text-lg font-bold text-white text-center px-4">
                You have a <span className="underline">14 Day Conditional Money Back Policy</span>
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed text-center px-4">
                I know my Accelerator mentorship works. Give me an honest shot. If you meet the initial requirements of the policy within 14 days, there is literally nothing to lose and everything to gain.
              </p>
              {/* Terms Link */}
              <div className="text-center">
                <Link href="/terms" className="text-gray-500 text-sm hover:text-gray-400 transition-colors underline">
                  Terms and Conditions Apply
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Frequently Asked <span className="text-blue-400">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-900/50 transition-colors"
                >
                  <span className="text-lg font-semibold text-white">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-8 pb-6"
                  >
                    <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Book a Call Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-orange-400 text-sm font-semibold tracking-wider uppercase mb-4">
              SCHEDULE A CALL WITH Penny Pips
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Still Have Questions?
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
              Book a call with Penny Pips directly and get all your questions answered.
            </p>
          </motion.div>

          {/* Two Column Layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Left Side - Gradient Box */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-orange-500 rounded-3xl p-8 md:p-10 flex flex-col justify-between min-h-[400px]">
              <div>
                {/* Profile Placeholder */}
                <div className="w-20 h-20 bg-white/20 rounded-full mb-6 flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  FREE Discovery Call
                </h3>
                
                <p className="text-white/90 text-base leading-relaxed mb-6">
                  This call is to see how the ASCENDANT Accelerator can help you achieve your goals.
                </p>
                
                <p className="text-white/80 text-base leading-relaxed">
                  <span className="font-semibold text-white">Schedule your call today,</span> and I look forward to speaking to you soon!
                </p>
              </div>
            </div>

            {/* Right Side - Calendar Placeholder */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 md:p-10">
              <h3 className="text-2xl font-bold text-white mb-6">Schedule A Call</h3>
              
              {/* Calendar Placeholder */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 min-h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-base mb-2">Calendar Integration</p>
                  <p className="text-gray-500 text-sm">Booking functionality will be added here</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}

