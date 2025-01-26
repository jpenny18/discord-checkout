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
  "Accounts without trading activity for more than 30 consecutive days will get expired/terminated without refund. The counter starts from registration day.",
  "Leverage 1:100",
  "A profitable day is a day on which the closed positions made a positive profit* of at least 0.5% of the initial balance *The positive profit is calculated as follows: Minimum(Midnight Balance, Midnight Equity) - Previous Day Balance",
  "Daily loss is 6% of the starting equity of the initial balance.",
  "When completing Step 1, traders will have the option to skip step two and activate their funded account with another purchase of the challenge fee. (Ex. A trader passes the first step of an 100k account they can choose to go on to step two or skip step two and go onto a funded account with a 450$ activation fee).",
  "When completing Step 2, traders will receive a withdrawable refund to their trading account. The amount refunded will reflect only the amount paid by the user, excluding discounts.",
  "Holding trades overnight and over the weekend is allowed",
  "Holding open trades over news is allowed. Executing orders 2 minutes before until 2 minutes after high-impact news news is also allowed.",
  "Assets available: FX, Metals, Indices Oil and Crypto.",
  "Platform: MT4/MT5.",
  "Profit split: 80% to 100%. + monthly fixed payout.",
  "Maximum number of active accounts per trader: 5",
  "Scaling up to $500,000",
  "Traders can request payouts at any point, regardless of the 10% growth target.",
  "First payout 14 days after receiving a funded account, and every 2 weeks after that.",
  "The 14-day payout cycle will reset every time you have a new account scaled."
];

const scalingPlan = [
  { balance: 'Start $10k', maxLoss: '$1,000', target: '$1,000', split: '50/50*' },
  { balance: '$15k', maxLoss: '$1,500', target: '$1,500', split: '80/20' },
  { balance: '$20k', maxLoss: '$2,000', target: '$2,000', split: '80/20' },
  { balance: '$25k', maxLoss: '$2,500', target: '$2,500', split: '80/20' },
  { balance: 'Start $25k', maxLoss: '$2,500', target: '$2,500', split: '50/50*' },
  { balance: '$35k', maxLoss: '$3,500', target: '$3,500', split: '80/20' },
  { balance: '$45k', maxLoss: '$4,500', target: '$4,500', split: '80/20' },
  { balance: 'Start $50k', maxLoss: '$5,000', target: '$5,000', split: '50/50*' },
  { balance: '$60k', maxLoss: '$6,000', target: '$6,000', split: '80/20' },
  { balance: '$70k', maxLoss: '$7,000', target: '$7,000', split: '80/20' },
  { balance: '$80k', maxLoss: '$8,000', target: '$8,000', split: '80/20' },
  { balance: 'Start $100k', maxLoss: '$10,000', target: '$10,000', split: '50/50' },
  { balance: '$125,000', maxLoss: '$12,500', target: '$12,500', split: '80/20' },
  { balance: '$150,000', maxLoss: '$15,000', target: '$15,000', split: '80/20' },
  { balance: '$175,000', maxLoss: '$17,500', target: '$17,500', split: '85/15' },
  { balance: '$200,000', maxLoss: '$20,000', target: '$20,000', split: '85/15' },
  { balance: '$300,000', maxLoss: '$30,000', target: '$30,000', split: '90/10' },
  { balance: '$400,000', maxLoss: '$40,000', target: '$40,000', split: '100/0' },
  { balance: '$500,000', maxLoss: '-', target: '-', split: '100/0' }
];

const accountSizes = ["$10,000", "$25,000", "$50,000", "$100,000"];

export default function StandardChallengePage() {
  const [selectedSize, setSelectedSize] = useState(accountSizes[0]);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <ParallaxProvider>
      <div className="min-h-screen bg-black text-white pt-8 relative">
        {/* Particles Background */}
        <Particles
          id="standard-particles"
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
              move: {
                direction: "top",
                enable: true,
                outModes: {
                  default: "out",
                },
                random: false,
                speed: 0.8,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 50,
              },
              opacity: {
                animation: {
                  enable: true,
                  speed: 0.3,
                  sync: false,
                  startValue: "max",
                  count: 1,
                  destroy: "none",
                },
                value: {
                  min: 0.15,
                  max: 0.3,
                },
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 2, max: 4 },
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

        {/* Logo and Challenge Image */}
        <div className="container mx-auto px-4 mb-12 flex flex-col items-center gap-8 relative z-10">
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
                STANDARD <span className="text-yellow-500 drop-shadow-[0_0_25px_rgba(234,179,8,0.3)]">PROGRAM</span>
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl md:text-2xl text-gray-400"
              >
                HIGH-RISK-HIGH-REWARD PROGRAM FOR CONFIDENT TRADERS
              </motion.h2>
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
                  Enjoy our standard 2 Step challenge and unlock our <span className="text-yellow-500">High-Risk-High-Reward</span> scaling plan!
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
                  src="/images/standard.png"
                  alt="Standard Challenge"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Rest of the sections with parallax effects */}
        <section className="py-12 bg-black/50 relative z-10">
          <div className="parallax-content" style={{ transform: 'translateZ(-10px)' }}>
            {/* Metrics Section Content */}
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">CHALLENGE METRICS</h2>
              
              {/* Account Size Selector */}
              <div className="flex justify-center gap-4 mb-8">
                {accountSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
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

              {/* Metrics Display */}
              <div className="bg-[#111111] rounded-lg p-6 max-w-4xl mx-auto">
                <ChallengeMetrics type="Standard" amount={selectedSize} />
              </div>

              {/* CTA Button */}
              <div className="text-center mt-8">
                <Link
                  href="/dashboard/challenge"
                  className="inline-block bg-yellow-500 text-black px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                >
                  START STANDARD
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

        {/* Scaling Plan Section with Parallax */}
        <section className="py-12 bg-black/50 relative z-10">
          <div className="parallax-content" style={{ transform: 'translateZ(-8px)' }}>
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">SCALING PLAN</h2>
              <div className="max-w-5xl mx-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#111111]">
                      <th className="px-6 py-4 text-left text-yellow-500">Account Balance</th>
                      <th className="px-6 py-4 text-left text-yellow-500">Max Loss (10%)</th>
                      <th className="px-6 py-4 text-left text-yellow-500">Profit Target (10%)</th>
                      <th className="px-6 py-4 text-left text-yellow-500">Profit Split</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {scalingPlan.map((level, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-[#111111]/50"
                      >
                        <td className="px-6 py-4">{level.balance}</td>
                        <td className="px-6 py-4">{level.maxLoss}</td>
                        <td className="px-6 py-4">{level.target}</td>
                        <td className="px-6 py-4">{level.split}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {/* Add CTA Button below scaling plan table */}
                <div className="text-center mt-12">
                  <Link
                    href="/dashboard/challenge"
                    className="inline-block bg-yellow-500 text-black px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                  >
                    START STANDARD
                  </Link>
                </div>
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
    speed: -10,
    translateY: [0, 30],
    scale: [1, 1.05],
  });

  return (
    <div ref={parallax.ref} className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent" />
    </div>
  );
} 