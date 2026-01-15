'use client';

import { useState, useRef } from 'react';
import Script from 'next/script';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { DocumentTextIcon, ChevronDownIcon, PlayIcon, ChartBarIcon, SpeakerWaveIcon, PauseIcon } from '@heroicons/react/24/outline';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

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

export default function PennyPipsStrategyPage() {
  const [pdfError, setPdfError] = useState(false);
  const [isStrategyTextOpen, setIsStrategyTextOpen] = useState(false);
  const [isEntriesOpen, setIsEntriesOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isCaseStudiesOpen, setIsCaseStudiesOpen] = useState(false);
  const [activeCaseStudy, setActiveCaseStudy] = useState('500-flip');
  const [caseStudyImageIndex, setCaseStudyImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-[#09090b]" style={{ '--color-white': '#ffffff' } as React.CSSProperties}>
      {/* Wistia Player Scripts */}
      <Script 
        src="https://fast.wistia.com/assets/external/E-v1.js" 
        strategy="afterInteractive"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="p-3 rounded-xl"
              style={{
                backgroundColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)',
              }}
            >
              <DocumentTextIcon className="w-8 h-8 text-[#ffc62d]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">PennyPips Strategy</h1>
              <p className="text-gray-400 mt-1">Learn the KCZ Strategy & Support/Resistance entries</p>
            </div>
          </div>
        </div>

        {/* Intro Video - Floating */}
        <div className="mb-6">
          <div className="rounded-xl overflow-hidden">
            <div className="aspect-video bg-black">
              {/* Wistia Video Player - Standard Embed */}
              <div 
                className="wistia_responsive_padding w-full h-full" 
                style={{ position: 'relative' }}
              >
                <div 
                  className="wistia_responsive_wrapper" 
                  style={{ height: '100%', left: 0, position: 'absolute', top: 0, width: '100%' }}
                >
                  <div 
                    className="wistia_embed wistia_async_s6hm8f29mh videoFoam=true" 
                    style={{ height: '100%', position: 'relative', width: '100%' }}
                  >
                    <div 
                      className="wistia_swatch" 
                      style={{ 
                        height: '100%', 
                        left: 0, 
                        opacity: 0, 
                        overflow: 'hidden', 
                        position: 'absolute', 
                        top: 0, 
                        transition: 'opacity 200ms', 
                        width: '100%' 
                      }}
                    >
                      <img 
                        src="https://fast.wistia.com/embed/medias/s6hm8f29mh/swatch" 
                        style={{ filter: 'blur(5px)', height: '100%', objectFit: 'contain', width: '100%' }} 
                        alt="" 
                        aria-hidden="true" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KCZ Strategy Breakdown Accordion */}
        <div 
          className="rounded-2xl border overflow-hidden mb-6"
          style={{
            backgroundColor: 'color-mix(in oklab, var(--color-white) 3%, transparent)',
            borderColor: 'color-mix(in oklab, var(--color-white) 8%, transparent)',
            filter: 'drop-shadow(0px 0px 10px rgba(0, 0, 0, .3))'
          }}
        >
          {/* Accordion Header */}
          <button
            onClick={() => setIsStrategyTextOpen(!isStrategyTextOpen)}
            className="w-full p-6 hover:bg-white/5 transition-colors"
          >
            <div className="flex flex-col h-full">
              {/* Top 25% - Number (smaller) */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-[#ffc62d]">1</span>
                <ChevronDownIcon 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    isStrategyTextOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
              {/* Bottom 75% - Title (larger) */}
              <div className="text-left">
                <h2 className="text-xl font-bold text-white">KCZ Strategy Breakdown</h2>
              </div>
            </div>
          </button>

          {/* Accordion Content */}
          {isStrategyTextOpen && (
            <div className="border-t p-6" style={{ borderColor: 'color-mix(in oklab, var(--color-white) 8%, transparent)' }}>
              {/* Audio Player */}
              <div className="mb-6">
                <button
                  onClick={toggleAudio}
                  className="flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] w-full md:w-auto"
                  style={{
                    backgroundColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)',
                    borderColor: 'color-mix(in oklab, var(--color-white) 10%, transparent)',
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: 'color-mix(in oklab, var(--color-white) 8%, transparent)',
                    }}
                  >
                    {isPlaying ? (
                      <PauseIcon className="w-6 h-6 text-[#ffc62d]" />
                    ) : (
                      <SpeakerWaveIcon className="w-6 h-6 text-[#ffc62d]" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold text-sm">
                      {isPlaying ? 'Pause Audio Narration' : 'Listen to Strategy (Audio)'}
                    </p>
                    <p className="text-gray-400 text-xs">
                      Prefer to listen? Click to {isPlaying ? 'pause' : 'play'}
                    </p>
                  </div>
                </button>
                <audio
                  ref={audioRef}
                  src="/audiokcz.m4a"
                  onEnded={handleAudioEnd}
                  onPause={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                />
              </div>

              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-white mb-4">KCZ Strategy (Beginner-Friendly Breakdown)</h2>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              I built this strategy back in 2018, when I was first starting to trade and beginning to transition into becoming a profitable trader. At the time, I honestly didn't know much about the markets at all — yet I was still able to create a real edge. That's important, because this strategy proves you don't need advanced indicators or complex systems to trade effectively. You just need to understand price behavior.
            </p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">Core Concepts You Need to Understand</h3>
            
            <p className="text-gray-300 mb-4">Before using this strategy, you must understand a few basic market concepts. These are the foundation of everything:</p>
            
            <div className="space-y-2 mb-6 pl-4">
              <p className="text-gray-300"><strong className="text-[#ffc62d]">Support</strong> – A price level where the market tends to stop falling and bounce upward.</p>
              <p className="text-gray-300"><strong className="text-[#ffc62d]">Resistance</strong> – A price level where the market tends to stop rising and push back down.</p>
              <p className="text-gray-300"><strong className="text-[#ffc62d]">Trending Market</strong> – When price is clearly moving in one direction (up or down).</p>
              <p className="text-gray-300"><strong className="text-[#ffc62d]">Consolidation Market</strong> – When price is moving sideways and not trending.</p>
              <p className="text-gray-300"><strong className="text-[#ffc62d]">Uptrend</strong> – Higher highs and higher lows.</p>
              <p className="text-gray-300"><strong className="text-[#ffc62d]">Downtrend</strong> – Lower highs and lower lows.</p>
              <p className="text-gray-300"><strong className="text-[#ffc62d]">Market Structure</strong> (flags, breaks, retests) – Price often moves, pauses, breaks structure, then comes back to retest before continuing.</p>
            </div>

            <p className="text-white font-semibold mb-2">Simple truth: In any financial market, price only does two things:</p>
            <p className="text-gray-300 mb-6">It trends, or it consolidates.<br />There is nothing else.</p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">What Is a Key Consolidation Zone (KCZ)?</h3>
            
            <p className="text-gray-300 mb-4">When price is consolidating, it often creates what I call a Key Consolidation Zone (KCZ).</p>
            
            <p className="text-gray-300 mb-4">A KCZ is a clear area where price forms a "house":</p>
            
            <ul className="list-disc list-inside space-y-1 mb-4 pl-4">
              <li className="text-gray-300">A floor (support)</li>
              <li className="text-gray-300">A roof (resistance)</li>
            </ul>

            <p className="text-gray-300 mb-6">Price repeatedly tries to break above the roof or below the floor but fails. When this happens multiple times, that area becomes a key consolidation zone.</p>
            
            <p className="text-gray-300 mb-6">The most probable outcome when price is inside a KCZ is that it will continue bouncing between the top and bottom of the zone until a real breakout occurs.</p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">Timeframes (Very Important)</h3>
            
            <p className="text-gray-300 mb-4">This strategy works best on higher timeframes.</p>
            
            <ul className="list-disc list-inside space-y-1 mb-4 pl-4">
              <li className="text-gray-300">Higher timeframes = stronger support and resistance</li>
              <li className="text-gray-300">Lower timeframes = weaker levels and more risk</li>
            </ul>

            <p className="text-gray-300 mb-4">I personally do not mark a main KCZ top or bottom unless it is on the 1-hour timeframe or higher.</p>
            
            <p className="text-gray-300 mb-6">You can trade KCZs on smaller timeframes, and they do work — but they are riskier because price does not respect those levels as cleanly.</p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">How to Mark a Key Consolidation Zone</h3>
            
            <p className="text-gray-300 mb-4">A KCZ is formed when:</p>
            
            <ul className="list-disc list-inside space-y-1 mb-4 pl-4">
              <li className="text-gray-300">Price moves sideways</li>
              <li className="text-gray-300">Creates multiple touches on the top and bottom</li>
              <li className="text-gray-300">Fails to break out consistently</li>
            </ul>

            <p className="text-gray-300 mb-6">If price looks like it's bouncing inside a clearly defined box, that is a KCZ.</p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">KCZ Entry Models Explained</h3>
            
            <p className="text-gray-300 mb-4">There are three ways to trade a KCZ:</p>

            <h4 className="text-lg font-bold text-[#ffc62d] mt-6 mb-3">1. Regular Entry</h4>
            
            <p className="text-gray-300 mb-4">A regular entry happens when:</p>
            
            <ul className="list-disc list-inside space-y-1 mb-4 pl-4">
              <li className="text-gray-300">Price hits the top or bottom of the KCZ</li>
              <li className="text-gray-300">Price pulls away</li>
              <li className="text-gray-300">Price comes back for a retest</li>
              <li className="text-gray-300">Price starts showing signs of rejection again</li>
            </ul>

            <p className="text-gray-300 mb-4">You enter once price starts moving away from the zone after confirmation.</p>
            
            <p className="text-gray-300 mb-6"><strong className="text-white">Entry Confirmation:</strong><br />Buying: Two green candle closes in a row<br />Selling: Two red candle closes in a row</p>

            <h4 className="text-lg font-bold text-[#ffc62d] mt-6 mb-3">2. FOMO Entry</h4>
            
            <p className="text-gray-300 mb-4">A FOMO entry is more aggressive.</p>
            
            <p className="text-gray-300 mb-4">This happens when:</p>
            
            <ul className="list-disc list-inside space-y-1 mb-4 pl-4">
              <li className="text-gray-300">Price hits the top or bottom of the KCZ</li>
              <li className="text-gray-300">Starts showing signs of rejection</li>
              <li className="text-gray-300">Two Candle confirmation</li>
            </ul>

            <p className="text-gray-300 mb-4">You enter earlier before a retest is allowed to form, based purely on rejection.</p>
            
            <p className="text-gray-300 mb-4"><strong className="text-white">Confirmation (same as regular entry):</strong><br />Buying: Two green candle closes in a row<br />Selling: Two red candle closes in a row</p>
            
            <p className="text-red-400 text-sm mb-6">⚠️ This entry carries more risk, which is why it's considered a FOMO entry.</p>

            <h4 className="text-lg font-bold text-[#ffc62d] mt-6 mb-3">3. Breakout Entry</h4>
            
            <p className="text-gray-300 mb-4">The breakout entry happens when price breaks out of the KCZ — either above the top or below the bottom.</p>
            
            <p className="text-gray-300 mb-4">Important rules:</p>
            
            <ul className="list-disc list-inside space-y-1 mb-4 pl-4">
              <li className="text-gray-300">I almost never take a FOMO entry on breakouts</li>
              <li className="text-gray-300">I almost always wait for a regular entry</li>
            </ul>

            <p className="text-gray-300 mb-4"><strong className="text-white">Why?</strong></p>
            
            <p className="text-gray-300 mb-4">Because when price breaks out of a KCZ, it almost always comes back to retest the zone before continuing.</p>
            
            <p className="text-gray-300 mb-4"><strong className="text-white">Breakout Entry Process:</strong></p>
            
            <ul className="list-disc list-inside space-y-1 mb-4 pl-4">
              <li className="text-gray-300">Price breaks out of the KCZ</li>
              <li className="text-gray-300">Price comes back and retests the zone</li>
              <li className="text-gray-300">Price shows rejection in the breakout direction</li>
              <li className="text-gray-300">Two candle confirmation</li>
              <li className="text-gray-300">Enter</li>
            </ul>

            <p className="text-gray-300 mb-6"><strong className="text-white">Confirmation:</strong><br />Buying: Two green candle closes in a row<br />Selling: Two red candle closes in a row</p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">General Support & Resistance Entries</h3>
            
            <p className="text-gray-300 mb-4">Key Consolidation Zones are simply major support and resistance levels.</p>
            
            <p className="text-gray-300 mb-4">Because of that, the same exact entry rules can be applied to any support or resistance level in the market.</p>
            
            <ul className="list-disc list-inside space-y-1 mb-4 pl-4">
              <li className="text-gray-300">Higher timeframe levels (1H, 4H, Daily) = more reliable</li>
              <li className="text-gray-300">Lower timeframe levels (30m–1m) = riskier but tradable</li>
            </ul>

            <p className="text-gray-300 mb-4">If you are a scalper, you can apply:</p>
            
            <ul className="list-disc list-inside space-y-1 mb-4 pl-4">
              <li className="text-gray-300">Regular Entry</li>
              <li className="text-gray-300">FOMO Entry</li>
              <li className="text-gray-300">Breakout Entry</li>
            </ul>

            <p className="text-gray-300 mb-4">to any support or resistance level, whether it's on the daily chart or the 1-minute chart.</p>

            <p className="text-blue-400 font-medium mb-2">Just remember:</p>
            <p className="text-gray-300 mb-8">Price respects higher timeframe levels far more than lower timeframe ones.</p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">Unclean Retests:</h3>
            
            <p className="text-gray-300 mb-4">
              Unclean retests happen more often then actual touches of the marked out support and resistance levels or top/bottom of key consolidation zones. With market experience you will learn when price is rejecting, breaking through, retesting even if price isn't close to the object you have placed to mark out your support/res/top/bottom of kcz.
            </p>

            <p className="text-gray-300 mb-6">
              This is important to know since everybody will mark out their levels differently and it's not like the market takes them into consideration it's just to help us visualize the data on the chart and that's also why I don't use hard lines and use boxes so it's more of a range rather than a direct price point.
            </p>
              </div>
            </div>
          )}
        </div>

        {/* KZC Live & Backtest Video Accordion */}
        <div 
          className="rounded-2xl border overflow-hidden mb-6"
          style={{
            backgroundColor: 'color-mix(in oklab, var(--color-white) 3%, transparent)',
            borderColor: 'color-mix(in oklab, var(--color-white) 8%, transparent)',
            filter: 'drop-shadow(0px 0px 10px rgba(0, 0, 0, .3))'
          }}
        >
          {/* Accordion Header */}
          <button
            onClick={() => setIsVideoOpen(!isVideoOpen)}
            className="w-full p-6 hover:bg-white/5 transition-colors"
          >
            <div className="flex flex-col h-full">
              {/* Top 25% - Number (smaller) */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-[#ffc62d]">2</span>
                <ChevronDownIcon 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    isVideoOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
              {/* Bottom 75% - Title (larger) */}
              <div className="text-left">
                <h2 className="text-xl font-bold text-white">Live Backtested Results</h2>
              </div>
            </div>
          </button>

          {/* Accordion Content */}
          {isVideoOpen && (
            <div className="border-t" style={{ borderColor: 'color-mix(in oklab, var(--color-white) 8%, transparent)' }}>
              {/* Text Section */}
              <div className="p-6">
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed">
                    Watch real examples of the KCZ strategy in action with live trading and backtest results.
                  </p>
                </div>
              </div>

              {/* Video Section */}
              <div className="px-6 pb-6">
                <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)' }}>
                  <div className="aspect-video bg-black">
                    {/* Wistia Video Player - Standard Embed */}
                    <div 
                      className="wistia_responsive_padding w-full h-full" 
                      style={{ position: 'relative' }}
                    >
                      <div 
                        className="wistia_responsive_wrapper" 
                        style={{ height: '100%', left: 0, position: 'absolute', top: 0, width: '100%' }}
                      >
                        <div 
                          className="wistia_embed wistia_async_8c2sp2nsg1 videoFoam=true" 
                          style={{ height: '100%', position: 'relative', width: '100%' }}
                        >
                          <div 
                            className="wistia_swatch" 
                            style={{ 
                              height: '100%', 
                              left: 0, 
                              opacity: 0, 
                              overflow: 'hidden', 
                              position: 'absolute', 
                              top: 0, 
                              transition: 'opacity 200ms', 
                              width: '100%' 
                            }}
                          >
                            <img 
                              src="https://fast.wistia.com/embed/medias/8c2sp2nsg1/swatch" 
                              style={{ filter: 'blur(5px)', height: '100%', objectFit: 'contain', width: '100%' }} 
                              alt="" 
                              aria-hidden="true" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Entries PDF Accordion */}
        <div 
          className="rounded-2xl border overflow-hidden mb-6"
          style={{
            backgroundColor: 'color-mix(in oklab, var(--color-white) 3%, transparent)',
            borderColor: 'color-mix(in oklab, var(--color-white) 8%, transparent)',
            filter: 'drop-shadow(0px 0px 10px rgba(0, 0, 0, .3))'
          }}
        >
          {/* Accordion Header */}
          <button
            onClick={() => setIsEntriesOpen(!isEntriesOpen)}
            className="w-full p-6 hover:bg-white/5 transition-colors"
          >
            <div className="flex flex-col h-full">
              {/* Top 25% - Number (smaller) */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-[#ffc62d]">3</span>
                <ChevronDownIcon 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    isEntriesOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
              {/* Bottom 75% - Title (larger) */}
              <div className="text-left">
                <h2 className="text-xl font-bold text-white">Entries</h2>
              </div>
            </div>
          </button>

          {/* Accordion Content */}
          {isEntriesOpen && (
            <div className="border-t" style={{ borderColor: 'color-mix(in oklab, var(--color-white) 8%, transparent)' }}>
              {/* Text Section - Add your content here */}
              <div className="p-6">
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed">
                    This guide covers the entry criteria and rules for the KCZ Strategy. 
                    Study these entry models carefully to understand when and how to take trades.
                  </p>
                </div>
              </div>

              {/* PDF Viewer Section */}
              <div className="px-6 pb-6">
                {!pdfError ? (
                  <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)' }}>
                    <iframe
                      src="/PennyPips KCZ Strategy - Entries.pdf"
                      className="w-full h-[800px] md:h-[1000px]"
                      title="PennyPips KCZ Strategy PDF"
                      onError={() => setPdfError(true)}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[600px] p-8 text-center rounded-xl border" style={{ borderColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)' }}>
                    <DocumentTextIcon className="w-16 h-16 text-gray-600 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">PDF Not Found</h3>
                    <p className="text-gray-400 mb-4">
                      The strategy PDF could not be loaded. Please ensure the file exists at:
                    </p>
                    <code className="text-sm text-[#ffc62d] bg-black/50 px-4 py-2 rounded">
                      public/PennyPips KCZ Strategy - Entries.pdf
                    </code>
                    <p className="text-gray-500 text-sm mt-4">
                      Contact support if the issue persists.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Case Studies Accordion */}
        <div 
          className="rounded-2xl border overflow-hidden"
          style={{
            backgroundColor: 'color-mix(in oklab, var(--color-white) 3%, transparent)',
            borderColor: 'color-mix(in oklab, var(--color-white) 8%, transparent)',
            filter: 'drop-shadow(0px 0px 10px rgba(0, 0, 0, .3))'
          }}
        >
          {/* Accordion Header */}
          <button
            onClick={() => setIsCaseStudiesOpen(!isCaseStudiesOpen)}
            className="w-full p-6 hover:bg-white/5 transition-colors"
          >
            <div className="flex flex-col h-full">
              {/* Top 25% - Number (smaller) */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-[#ffc62d]">4</span>
                <ChevronDownIcon 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    isCaseStudiesOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
              {/* Bottom 75% - Title (larger) */}
              <div className="text-left">
                <h2 className="text-xl font-bold text-white">Real Account Case Studies</h2>
              </div>
            </div>
          </button>

          {/* Accordion Content */}
          {isCaseStudiesOpen && (
            <div className="border-t" style={{ borderColor: 'color-mix(in oklab, var(--color-white) 8%, transparent)' }}>
              {/* Text Section */}
              <div className="p-6">
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed">
                    See verified broker statements showing how the KCZ strategy performs in real trading conditions. 
                    These are actual results from live accounts, not simulations.
                  </p>
                </div>
              </div>

              {/* Case Studies Component */}
              <div className="px-6 pb-6">
                {/* Case Study Selector */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6">
                  {Object.entries(caseStudies).map(([key, study]) => (
                    <button 
                      key={key}
                      onClick={() => {
                        setActiveCaseStudy(key);
                        setCaseStudyImageIndex(0);
                      }}
                      className={`px-3 md:px-5 py-2 md:py-2.5 rounded-lg font-semibold transition-all text-xs md:text-sm ${
                        activeCaseStudy === key
                          ? 'bg-[#ffc62d] text-black'
                          : 'text-gray-300 hover:text-white'
                      }`}
                      style={activeCaseStudy !== key ? {
                        backgroundColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)',
                        borderColor: 'color-mix(in oklab, var(--color-white) 10%, transparent)',
                      } : {}}
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
                    className="rounded-2xl border p-6 md:p-8"
                    style={{
                      backgroundColor: 'color-mix(in oklab, var(--color-white) 2%, transparent)',
                      borderColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)',
                    }}
                  >
                    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                      {/* Image Slider */}
                      <div>
                        <div 
                          className="relative rounded-lg overflow-hidden aspect-[4/3]"
                          style={{
                            backgroundColor: 'color-mix(in oklab, var(--color-white) 3%, transparent)',
                          }}
                        >
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
                            className="p-2 rounded-lg transition-colors disabled:opacity-50"
                            style={{
                              backgroundColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)',
                            }}
                            disabled={caseStudyImageIndex === 0}
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <span className="text-sm text-gray-400">
                            {caseStudyImageIndex + 1} / {caseStudies[activeCaseStudy].images.length}
                          </span>
                          <button
                            onClick={() => setCaseStudyImageIndex(Math.min(caseStudies[activeCaseStudy].images.length - 1, caseStudyImageIndex + 1))}
                            className="p-2 rounded-lg transition-colors disabled:opacity-50"
                            style={{
                              backgroundColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)',
                            }}
                            disabled={caseStudyImageIndex === caseStudies[activeCaseStudy].images.length - 1}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Case Study Details */}
                      <div>
                        <h3 className="text-2xl font-bold mb-2 text-white">{caseStudies[activeCaseStudy].title}</h3>
                        <p className="text-gray-400 mb-6">{caseStudies[activeCaseStudy].description}</p>
                        
                        <div 
                          className="rounded-lg p-5 mb-6"
                          style={{
                            backgroundColor: 'color-mix(in oklab, var(--color-white) 3%, transparent)',
                          }}
                        >
                          <h4 className="font-semibold mb-3 text-[#ffc62d]">Detailed Breakdown</h4>
                          <p className="text-gray-300 leading-relaxed text-sm">{caseStudies[activeCaseStudy].breakdown}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3 text-white">Key Learning Points</h4>
                          <ul className="space-y-2">
                            {caseStudies[activeCaseStudy].keyPoints.map((point, idx) => (
                              <li key={idx} className="flex items-start space-x-2 text-gray-300">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
