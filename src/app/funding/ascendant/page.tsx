'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import ChallengeMetrics from '@/components/ChallengeMetrics';
import { useState, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ParallaxProvider, useParallax } from 'react-scroll-parallax';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

const rules = [
  "The profit target, maximum loss and max daily loss remain the same for the funded stages.",
  "Accounts that reach the stop-out level, which is 8% below the initial account size, will be terminated.",
  "When completing each level, traders will receive bonuses on top of their profit split.",
  "Holding open trades over the weekend is allowed.",
  "Growth up to $4M.",
  "Leverage 1:50.",
  "News trading is allowed. (except for bracket strategies around news).",
  "Assets available: FX, Metals, Indices, crypto.",
  "Platform: MT4/MT5, web and mobile version.",
  "No minimum trades or days requirements for completing level 1.",
  "Complete Level 1 immediately when reaching the profit target",
  "Maximum Active Evaluation Accounts: 5 accounts",
  "First payout 14 days after receiving a funded account, and every 2 weeks after that.",
  "The 14-day payout cycle will reset every time you have a new account scaled.",
  "Traders have all the time they need in order to pass the challenge. However, we want to know that traders are active. Therefore, inactive accounts for more than 30 consecutive days will be terminated without refund."
];

const scalingPlan10K = [
  { balance: 'Evaluation Trader LV 1', initial: '$10,000', target: '$1,000', payout: '0%', bonus: '$100' },
  { balance: 'Funded Trader LV 2', initial: '$10,000', target: '$1,000', payout: '50%', bonus: '$50' },
  { balance: 'Funded Trader LV 3', initial: '$20,000', target: '$2,000', payout: '75%', bonus: '$100' },
  { balance: 'Funded Trader LV 4', initial: '$40,000', target: '$4,000', payout: '75%', bonus: '$200' },
  { balance: 'Funded Trader LV 5', initial: '$80,000', target: '$8,000', payout: '75%', bonus: '$400' },
  { balance: 'Funded Trader LV 6', initial: '$160,000', target: '$16,000', payout: '75%', bonus: '$800' },
  { balance: 'Funded Trader LV 7', initial: '$320,000', target: '$32,000', payout: '75%', bonus: '$1,600' },
  { balance: 'Funded Trader LV 8', initial: '$640,000', target: '$64,000', payout: '80%', bonus: '$3,200' },
  { balance: 'Funded Trader LV 9', initial: '$1,280,000', target: '$128,000', payout: '80-100%', bonus: 'N/A' },
  { balance: 'Funded Trader LV 10', initial: '$4,000,000', target: 'N/A', payout: '80%', bonus: 'N/A' }
];

const scalingPlan25K = [
  { balance: 'Evaluation Trader LV 1', initial: '$25,000', target: '$2,500', payout: '0%', bonus: '$250' },
  { balance: 'Funded Trader LV 2', initial: '$25,000', target: '$2,500', payout: '50%', bonus: '$50' },
  { balance: 'Funded Trader LV 3', initial: '$50,000', target: '$5,000', payout: '75%', bonus: '$100' },
  { balance: 'Funded Trader LV 4', initial: '$100,000', target: '$10,000', payout: '75%', bonus: '$200' },
  { balance: 'Funded Trader LV 5', initial: '$200,000', target: '$20,000', payout: '75%', bonus: '$400' },
  { balance: 'Funded Trader LV 6', initial: '$400,000', target: '$40,000', payout: '75%', bonus: '$800' },
  { balance: 'Funded Trader LV 7', initial: '$800,000', target: '$80,000', payout: '80%', bonus: '$800' },
  { balance: 'Funded Trader LV 8', initial: '$1,600,000', target: '$160,000', payout: '80-100%', bonus: 'N/A' },
  { balance: 'Funded Trader LV 9', initial: '$4,000,000', target: 'N/A', payout: '80-100%', bonus: 'N/A' }
];

const scalingPlan50K = [
  { balance: 'Evaluation Trader LV 1', initial: '$50,000', target: '$5,000', payout: '0%', bonus: '$250' },
  { balance: 'Funded Trader LV 2', initial: '$50,000', target: '$5,000', payout: '50%', bonus: '$50' },
  { balance: 'Funded Trader LV 3', initial: '$100,000', target: '$10,000', payout: '75%', bonus: '$200' },
  { balance: 'Funded Trader LV 4', initial: '$200,000', target: '$20,000', payout: '75%', bonus: '$400' },
  { balance: 'Funded Trader LV 5', initial: '$400,000', target: '$40,000', payout: '75%', bonus: '$800' },
  { balance: 'Funded Trader LV 6', initial: '$800,000', target: '$80,000', payout: '80%', bonus: '$1,600' },
  { balance: 'Funded Trader LV 7', initial: '$1,600,000', target: '$160,000', payout: '80-100%', bonus: 'N/A' },
  { balance: 'Funded Trader LV 8', initial: '$4,000,000', target: 'N/A', payout: '80-100%', bonus: 'N/A' }
];

const accountSizes = ["$10,000", "$25,000", "$50,000"];

export default function AscendantChallengePage() {
  const [selectedSize, setSelectedSize] = useState(accountSizes[0]);
  const [selectedPlan, setSelectedPlan] = useState<'10K' | '25K' | '50K'>('10K');

  const getCurrentPlan = () => {
    switch(selectedPlan) {
      case '10K':
        return scalingPlan10K;
      case '25K':
        return scalingPlan25K;
      case '50K':
        return scalingPlan50K;
      default:
        return scalingPlan10K;
    }
  };

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <ParallaxProvider>
      <div className="min-h-screen bg-black text-white pt-8 relative">
        {/* Particles Background */}
        <Particles
          id="ascendant-particles"
          init={particlesInit}
          options={{
            background: {
              color: {
                value: "transparent",
              },
            },
            fpsLimit: 120,
            particles: {
              color: {
                value: "#fbbf24",
              },
              links: {
                color: "#fbbf24",
                distance: 150,
                enable: true,
                opacity: 0.1,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: true,
                speed: 1.5,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 80,
              },
              opacity: {
                animation: {
                  enable: true,
                  speed: 0.5,
                  sync: false,
                  startValue: "max",
                  count: 1,
                  destroy: "none",
                },
                value: {
                  min: 0.1,
                  max: 0.2,
                },
              },
              shape: {
                type: ["circle", "triangle"],
              },
              size: {
                value: { min: 3, max: 5 },
              },
            },
            detectRetina: true,
            smooth: true,
          }}
          className="absolute inset-0 pointer-events-none"
        />

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

        {/* Hero Section */}
        <section className="relative py-12 overflow-hidden z-10">
          <ParallaxBanner />
          <div className="container mx-auto px-4">
            {/* Main Headers - Centered */}
            <div className="text-center mb-20">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4"
              >
                ASCENDANT <span className="text-yellow-500 drop-shadow-[0_0_25px_rgba(234,179,8,0.3)]">PROGRAM</span>
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-yellow-500 drop-shadow-[0_0_25px_rgba(234,179,8,0.3)]"
              >
                INSTANT FUNDING PROGRAM
              </motion.h2>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl sm:text-2xl md:text-3xl text-gray-400"
              >
                ONE STEP CHALLENGE
              </motion.h3>
            </div>

            {/* Two Column Layout for Text and Image */}
            <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
              {/* Left Column - Text */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="md:w-1/2 mb-8 md:mb-0"
              >
                <p className="text-lg sm:text-xl text-gray-300">
                  Trade our one step program with no time limits and double your account every milestone to grow your account up to <span className="text-yellow-500">$4,000,000</span>
                </p>
              </motion.div>

              {/* Right Column - Image */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ 
                  y: [0, -20, 0],
                  scale: 1,
                }}
                transition={{ 
                  y: {
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  scale: {
                    duration: 1
                  }
                }}
                className="relative w-60 h-60 md:w-80 md:h-80"
              >
                <Image
                  src="/images/ascendant.png"
                  alt="Ascendant Challenge"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Metrics Section */}
        <section className="py-12 bg-black/50 relative z-10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">CHALLENGE METRICS</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="py-4 px-6 text-yellow-500">APPLY FOR</th>
                    <th className="py-4 px-6 text-yellow-500 text-center">$10,000</th>
                    <th className="py-4 px-6 text-yellow-500 text-center">$25,000</th>
                    <th className="py-4 px-6 text-yellow-500 text-center">$50,000</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-800/50">
                    <td className="py-4 px-6">Evaluation Target</td>
                    <td className="py-4 px-6 text-center">10%</td>
                    <td className="py-4 px-6 text-center">10%</td>
                    <td className="py-4 px-6 text-center">10%</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="py-4 px-6">Max Drawdown</td>
                    <td className="py-4 px-6 text-center">8%</td>
                    <td className="py-4 px-6 text-center">8%</td>
                    <td className="py-4 px-6 text-center">8%</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="py-4 px-6">Max Daily Drawdown</td>
                    <td className="py-4 px-6 text-center">4%</td>
                    <td className="py-4 px-6 text-center">4%</td>
                    <td className="py-4 px-6 text-center">4%</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="py-4 px-6">Profit Split</td>
                    <td className="py-4 px-6 text-center">up to 100%</td>
                    <td className="py-4 px-6 text-center">up to 100%</td>
                    <td className="py-4 px-6 text-center">up to 100%</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="py-4 px-6">Time Limit</td>
                    <td className="py-4 px-6 text-center">Unlimited</td>
                    <td className="py-4 px-6 text-center">Unlimited</td>
                    <td className="py-4 px-6 text-center">Unlimited</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="py-4 px-6">Leverage</td>
                    <td className="py-4 px-6 text-center">1:50</td>
                    <td className="py-4 px-6 text-center">1:50</td>
                    <td className="py-4 px-6 text-center">1:50</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="py-4 px-6">One Time Fee</td>
                    <td className="py-4 px-6 text-center">$250</td>
                    <td className="py-4 px-6 text-center">$500</td>
                    <td className="py-4 px-6 text-center">$1000</td>
                  </tr>
                  <tr className="border-b border-zinc-800/50">
                    <td className="py-4 px-6">Bonuses</td>
                    <td className="py-4 px-6 text-center">From $15</td>
                    <td className="py-4 px-6 text-center">From $25</td>
                    <td className="py-4 px-6 text-center">From $50</td>
                  </tr>
                </tbody>
              </table>
              {/* Add CTA Button below metrics table */}
              <div className="text-center mt-8">
                <Link
                  href="/dashboard/challenge"
                  className="inline-block bg-yellow-500 text-black px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                >
                  START ASCENDANT
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Rules Section with Parallax */}
        <section className="py-12 bg-black relative z-10">
          <div className="parallax-content" style={{ transform: 'translateZ(-5px)' }}>
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">CHALLENGE RULES</h2>
              <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {rules.map((rule, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 bg-[#111111] p-4 rounded-lg h-[160px]"
                  >
                    <div className="text-yellow-500 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-gray-300 text-xs leading-relaxed">{rule}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Scaling Plan Section */}
        <section className="py-12 bg-black/50 relative z-10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">SCALING PLAN</h2>
            
            {/* Plan Size Selector */}
            <div className="flex justify-center gap-4 mb-8">
              {accountSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    setSelectedPlan(size.replace('$', '').replace(',000', 'K') as '10K' | '25K' | '50K');
                  }}
                  className={`px-6 py-2 rounded-lg transition-all ${
                    selectedSize === size
                      ? 'bg-yellow-500 text-black font-semibold'
                      : 'bg-zinc-800 text-white hover:bg-zinc-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="py-4 px-6 bg-yellow-500/10 text-yellow-500">Program Level</th>
                    <th className="py-4 px-6 bg-yellow-500/10 text-yellow-500">Initial Balance</th>
                    <th className="py-4 px-6 bg-yellow-500/10 text-yellow-500">Profit Target</th>
                    <th className="py-4 px-6 bg-yellow-500/10 text-yellow-500">Payout</th>
                    <th className="py-4 px-6 bg-yellow-500/10 text-yellow-500">Bonus</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentPlan().map((level, index) => (
                    <tr key={index} className="border-b border-zinc-800/50 hover:border-yellow-500/50 transition-colors">
                      <td className="py-4 px-6">{level.balance}</td>
                      <td className="py-4 px-6">{level.initial}</td>
                      <td className="py-4 px-6">{level.target}</td>
                      <td className="py-4 px-6">{level.payout}</td>
                      <td className="py-4 px-6">{level.bonus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Add CTA Button below scaling plan table */}
              <div className="text-center mt-12">
                <Link
                  href="/dashboard/challenge"
                  className="inline-block bg-yellow-500 text-black px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                >
                  START ASCENDANT
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ParallaxProvider>
  );
}

// Parallax Banner Component
function ParallaxBanner() {
  const parallax = useParallax<HTMLDivElement>({
    speed: -15,
    translateY: [0, 40],
    scale: [1, 1.1],
  });

  return (
    <div ref={parallax.ref} className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent" />
    </div>
  );
} 