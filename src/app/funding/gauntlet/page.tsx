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
  "A Stop-loss is NOT required.",
  "Leverage for all accounts - 1:50.",
  "News trading is allowed. Except for bracketing strategies.",
  "Holding open trades overnight and over the weekend is allowed.",
  "Accounts without activity for more than 30 consecutive days will be closed/terminated without a refund.",
  "Maximum number of active accounts per trader: 5",
  "First payout 14 days after receiving a funded account, and every 2 weeks after that.",
  "The 14-day payout cycle will reset every time you have a new account scaled."
];

const scalingPlan = [
  { balance: 'Start $50k', maxLoss: '$3,000', target: '$3,000', split: '50/50*' },
  { balance: '$60k', maxLoss: '$3,600', target: '$3,600', split: '80/20' },
  { balance: '$80k', maxLoss: '$4,800', target: '$4,800', split: '80/20' },
  { balance: '$100k', maxLoss: '$6,000', target: '$6,000', split: '80/20' },
  { balance: 'Start $100k', maxLoss: '$6,000', target: '$6,000', split: '50/50*' },
  { balance: '$125k', maxLoss: '$7,500', target: '$7,500', split: '80/20' },
  { balance: '$150k', maxLoss: '$9,000', target: '$9,000', split: '80/20' },
  { balance: '$175k', maxLoss: '$10,500', target: '$10,500', split: '80/20' },
  { balance: '$200k', maxLoss: '$12,000', target: '$12,000', split: '80/20' },
  { balance: '$300k', maxLoss: '$18,000', target: '$18,000', split: '80/20' },
  { balance: 'Start $300k', maxLoss: '$18,000', target: '$18,000', split: '50/50*' },
  { balance: '$350k', maxLoss: '$21,000', target: '$21,000', split: '80/20' },
  { balance: '$400k', maxLoss: '$24,000', target: '$24,000', split: '80/20' },
  { balance: '$500k', maxLoss: '$30,000', target: '$30,000', split: '80/20' },
  { balance: '$750k', maxLoss: '$45,000', target: '$45,000', split: '80/20' },
  { balance: '$1M', maxLoss: '$60,000', target: '$60,000', split: '80/20' },
  { balance: '$1.5M', maxLoss: '$90,000', target: '$90,000', split: '80/20' },
  { balance: '$2M', maxLoss: '$120,000', target: '$120,000', split: '90/10' },
  { balance: '$2.5M', maxLoss: '$150,000', target: '$150,000', split: '100/0' },
  { balance: '$3M', maxLoss: '$180,000', target: '$180,000', split: '100/0' },
  { balance: '$3.5M', maxLoss: '$210,000', target: '$210,000', split: '100/0' },
  { balance: '$4M', maxLoss: '$240,000', target: '$240,000', split: '100/0' }
];

const accountSizes = ["$50,000", "$100,000", "$300,000"];

export default function GauntletChallengePage() {
  const [selectedSize, setSelectedSize] = useState(accountSizes[0]);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <ParallaxProvider>
      <div className="min-h-screen bg-black text-white pt-8 relative">
        {/* Particles Background */}
        <Particles
          id="gauntlet-particles"
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
                random: true,
                speed: 3,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 100,
              },
              opacity: {
                animation: {
                  enable: true,
                  speed: 1,
                  sync: false,
                  startValue: "max",
                  count: 1,
                  destroy: "none",
                },
                value: {
                  min: 0.1,
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
                GAUNTLET <span className="text-yellow-500 drop-shadow-[0_0_25px_rgba(234,179,8,0.3)]">PROGRAM</span>
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg sm:text-xl md:text-2xl text-gray-400"
              >
                PROVE YOU CAN TRADE FIRST, PAY THE REST AFTER PASSING
              </motion.h2>
            </div>

            {/* Two Column Layout for Text and Image */}
            <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
              {/* Left Column - Benefits */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="md:w-1/2 mb-8 md:mb-0"
              >
                <h3 className="text-2xl font-bold mb-6">GAUNTLET BENEFITS</h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-2">
                    <span>• </span>
                    <span>The best funding program for your buck</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>• </span>
                    <span>Scale up your account for every 6% made</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>• </span>
                    <span>Up to 100% profit share</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>• </span>
                    <span>Bonus after the first step</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>• </span>
                    <span>Unlimited time to pass</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>• </span>
                    <span>Pay the majority of the cost upon success rather than upfront</span>
                  </li>
                </ul>
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
                  src="/images/gauntlet.png"
                  alt="Gauntlet Challenge"
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
                <ChallengeMetrics type="Gauntlet" amount={selectedSize} />
              </div>

              {/* CTA Button */}
              <div className="text-center mt-8">
                <Link
                  href="/dashboard/challenge"
                  className="inline-block bg-yellow-500 text-black px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                >
                  START GAUNTLET
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
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th className="py-4 px-6 bg-yellow-500/10 text-yellow-500">Account Balance</th>
                      <th className="py-4 px-6 bg-yellow-500/10 text-yellow-500">Max Loss (6%)</th>
                      <th className="py-4 px-6 bg-yellow-500/10 text-yellow-500">Profit Target (6%)</th>
                      <th className="py-4 px-6 bg-yellow-500/10 text-yellow-500">Profit Split</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scalingPlan.map((level, index) => (
                      <tr key={index} className="border-b border-zinc-800/50 hover:border-yellow-500/50 transition-colors">
                        <td className="py-4 px-6">{level.balance}</td>
                        <td className="py-4 px-6">{level.maxLoss}</td>
                        <td className="py-4 px-6">{level.target}</td>
                        <td className="py-4 px-6">{level.split}</td>
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
                    START GAUNTLET
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
    speed: -20,
    translateY: [0, 50],
    scale: [1, 1.2],
  });

  return (
    <div ref={parallax.ref} className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent" />
    </div>
  );
} 