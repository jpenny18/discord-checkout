'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function TradingArenaPage() {
  const [hoverArena, setHoverArena] = useState(false);
  const [hoverTrials, setHoverTrials] = useState(false);
  
  // Tooltip visibility states
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle tooltip toggle
  const toggleTooltip = (id: string) => {
    if (activeTooltip === id) {
      setActiveTooltip(null);
    } else {
      setActiveTooltip(id);
    }
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveTooltip(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Tooltip content
  const tooltips = {
    entryFee: "The one-time payment required to enter the Trading Arena. This covers your participation for the full 30-day competition period.",
    prizePool: "Winners receive both funded trading accounts and cash prizes. First place gets a $150K funded account plus $500 cash, with additional cash prizes for runners-up.",
    duration: "The Arena runs for exactly 30 days. You'll have this time to grow your account as much as possible to compete for the prizes.",
    startingBalance: "All participants begin with the same $5,000 account balance to ensure fair competition. Your goal is to maximize this amount.",
    
    monthlyPrice: "The discounted subscription price you pay each month to maintain access to your trial account. You can cancel anytime.",
    profitTarget: "The profit amount you need to reach to qualify for a funded account. Once you hit this target, you'll be eligible for an Activation Fee.",
    maxPositionSize: "The maximum position size you're allowed to hold at any time during your trial. Exceeding this limit may result in account termination.",
    maxLossLimit: "If your account balance drops below this threshold, your trial will be automatically terminated. This is to simulate professional risk management."
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Enhanced Hero Section with Images */}
      <div className="py-12 md:py-16 relative">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full bg-[#8B0000]/20 filter blur-[100px] -translate-y-1/2 -translate-x-1/2 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full bg-[#ffc62d]/20 filter blur-[100px] -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
        
        <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row gap-8 md:gap-12 items-center relative z-10">
          {/* Arena Card */}
        <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.7, 
                type: "spring",
                stiffness: 100
              }}
              className="relative w-full md:w-1/2 group"
              onMouseEnter={() => setHoverArena(true)}
              onMouseLeave={() => setHoverArena(false)}
          onClick={() => scrollToSection('arena-section')}
        >
              <div className="aspect-[16/13.5] rounded-2xl overflow-hidden border-2 border-[#8B0000] shadow-[0_0_40px_rgba(139,0,0,0.3)] cursor-pointer relative flex flex-col">
                {/* Border glow animation */}
                <div className="absolute inset-0 border-4 border-[#8B0000]/0 rounded-2xl group-hover:border-[#8B0000]/50 transition-all duration-500"></div>
                
                {/* Image section - top 75% on desktop, 65% on mobile */}
                <div className="relative w-full h-[65%] md:h-[75%] overflow-hidden">
          <Image
            src="/images/arena.png"
            alt="Trading Arena"
            fill
                    className="object-cover object-center scale-110 group-hover:scale-125 transition-all duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  
                  {/* Overlay gradient with 50% reduced opacity */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/15 to-transparent"></div>
                </div>
                
                {/* Text section - bottom 25% on desktop, 35% on mobile */}
                <div className="relative h-[35%] md:h-[25%] bg-gradient-to-t from-black to-black/90 p-4 md:p-6 flex flex-col justify-center">
                  <motion.div
                    animate={{ y: hoverArena ? -5 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl md:text-2xl font-extrabold mb-1 md:mb-2 text-white drop-shadow-lg">
                      ARENAS
                    </h2>
                    <div className="h-1 w-24 bg-[#8B0000] mb-1 md:mb-2 rounded"></div>
                    <p className="text-white/80 text-xs md:text-sm max-w-md">
                      No rules, just one mission. Flip a $5K account as high as you can in 30 days - Cash Prizes!
                    </p>
                  </motion.div>
                </div>
              </div>
              
              {/* Animated button arrow */}
              <motion.div 
                className="absolute right-8 bottom-8 w-10 h-10 rounded-full bg-[#8B0000] flex items-center justify-center opacity-0 group-hover:opacity-100"
                animate={{ 
                  y: hoverArena ? 0 : 10,
                  opacity: hoverArena ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
        </motion.div>

            {/* Trials Card */}
        <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.7, 
                delay: 0.2,
                type: "spring",
                stiffness: 100
              }}
              className="relative w-full md:w-1/2 group"
              onMouseEnter={() => setHoverTrials(true)}
              onMouseLeave={() => setHoverTrials(false)}
          onClick={() => scrollToSection('trials-section')}
        >
              <div className="aspect-[16/13.5] rounded-2xl overflow-hidden border-2 border-[#ffc62d] shadow-[0_0_40px_rgba(255,198,45,0.2)] cursor-pointer relative flex flex-col">
                {/* Border glow animation */}
                <div className="absolute inset-0 border-4 border-[#ffc62d]/0 rounded-2xl group-hover:border-[#ffc62d]/50 transition-all duration-500"></div>
                
                {/* Image section - top 75% on desktop, 65% on mobile */}
                <div className="relative w-full h-[65%] md:h-[75%] overflow-hidden">
          <Image
            src="/images/trials.png"
            alt="Trading Trials"
            fill
                    className="object-cover object-center scale-110 group-hover:scale-125 transition-all duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  
                  {/* Overlay gradient with 50% reduced opacity */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/15 to-transparent"></div>
                </div>
                
                {/* Text section - bottom 25% on desktop, 35% on mobile */}
                <div className="relative h-[35%] md:h-[25%] bg-gradient-to-t from-black to-black/90 p-4 md:p-6 flex flex-col justify-center">
                  <motion.div
                    animate={{ y: hoverTrials ? -5 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl md:text-2xl font-extrabold mb-1 md:mb-2 text-white drop-shadow-lg">
                      TRIALS
                    </h2>
                    <div className="h-1 w-24 bg-[#ffc62d] mb-1 md:mb-2 rounded"></div>
                    <p className="text-white/80 text-xs md:text-sm max-w-md">
                      One Rule - One Step. Choose from three account sizes to start your trading trial.
                    </p>
                  </motion.div>
                </div>
              </div>
              
              {/* Animated button arrow */}
              <motion.div 
                className="absolute right-8 bottom-8 w-10 h-10 rounded-full bg-[#ffc62d] flex items-center justify-center opacity-0 group-hover:opacity-100"
                animate={{ 
                  y: hoverTrials ? 0 : 10,
                  opacity: hoverTrials ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
        </motion.div>
        </div>
      </div>

      {/* Arena Section */}
      <section id="arena-section" className="py-8 md:py-16 min-h-screen w-full overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto px-4"
        >
          <div className="bg-[#0A0A0A] rounded-2xl p-4 md:p-8 shadow-lg border border-[#1A1A1A]">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl font-bold mb-4">ARENAS</h2>
              <div className="flex items-center justify-center mb-4">
                <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-[#8B0000] rotate-45 mx-1"></div>
                <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-[#8B0000] rotate-45 mx-1"></div>
              </div>
              <h3 className="text-[0.9rem] md:text-xl font-bold mb-4">STEP INTO THE ULTIMATE TRADING BATTLE GROUND</h3>
              <p className="text-[0.5rem] md:text-sm text-gray-400">No rules, just one mission. Flip a $5K account as high as you can in 30 days. Are you ready to dominate the arena?</p>
            </div>

            <div className="flex flex-row md:flex-row gap-4">
              {/* Info Column - Sticky on mobile */}
              <div className="w-[25%] md:w-1/4 sticky top-0 bg-[#0A0A0A] z-30 py-2">
                <div className="relative h-[300px] md:h-auto md:flex md:flex-col md:justify-between md:space-y-[2.35rem] md:pt-24">
                  <div className="absolute md:relative top-[85px] md:top-auto right-0 md:right-auto flex items-center justify-end gap-1">
                    <span className="text-gray-400 text-[8px] md:text-sm whitespace-nowrap">Entry Fee</span>
                    <div 
                      className="relative group" 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTooltip('entryFee');
                      }}
                    >
                      <InformationCircleIcon className="h-4 w-4 text-gray-400 cursor-help hover:text-[#ffc62d] transition-colors" />
                      
                      {/* Mobile tooltip (click) */}
                      {activeTooltip === 'entryFee' && (
                        <div 
                          className="absolute bottom-full right-0 mb-2 w-48 md:w-64 p-3 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-xl z-50 text-xs animate-fadeIn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="text-white font-medium mb-1">Entry Fee</div>
                          <p className="text-gray-300">{tooltips.entryFee}</p>
                          <div className="absolute w-2 h-2 bg-[#1A1A1A] rotate-45 -bottom-1 right-1 border-r border-b border-[#333]"></div>
                        </div>
                      )}
                      
                      {/* Desktop tooltip (hover) - hidden on mobile */}
                      <div className="hidden md:block">
                        <div className="absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible bottom-full right-0 mb-2 w-64 p-3 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-xl z-50 transition-all duration-200 text-xs pointer-events-none">
                          <div className="text-white font-medium mb-1">Entry Fee</div>
                          <p className="text-gray-300">{tooltips.entryFee}</p>
                          <div className="absolute w-2 h-2 bg-[#1A1A1A] rotate-45 -bottom-1 right-1 border-r border-b border-[#333]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute md:relative top-[129px] md:top-auto right-0 md:right-auto flex items-center justify-end gap-1">
                    <span className="text-gray-400 text-[8px] md:text-sm whitespace-nowrap">Prize Pool</span>
                    <div 
                      className="relative group" 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTooltip('prizePool');
                      }}
                    >
                      <InformationCircleIcon className="h-4 w-4 text-gray-400 cursor-help hover:text-[#ffc62d] transition-colors" />
                      
                      {/* Mobile tooltip (click) */}
                      {activeTooltip === 'prizePool' && (
                        <div 
                          className="absolute bottom-full right-0 mb-2 w-48 md:w-64 p-3 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-xl z-50 text-xs animate-fadeIn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="text-white font-medium mb-1">Prize Pool</div>
                          <p className="text-gray-300">{tooltips.prizePool}</p>
                          <div className="absolute w-2 h-2 bg-[#1A1A1A] rotate-45 -bottom-1 right-1 border-r border-b border-[#333]"></div>
                        </div>
                      )}
                      
                      {/* Desktop tooltip (hover) - hidden on mobile */}
                      <div className="hidden md:block">
                        <div className="absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible bottom-full right-0 mb-2 w-64 p-3 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-xl z-50 transition-all duration-200 text-xs pointer-events-none">
                          <div className="text-white font-medium mb-1">Prize Pool</div>
                          <p className="text-gray-300">{tooltips.prizePool}</p>
                          <div className="absolute w-2 h-2 bg-[#1A1A1A] rotate-45 -bottom-1 right-1 border-r border-b border-[#333]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute md:relative top-[171px] md:top-auto right-0 md:right-auto flex items-center justify-end gap-1">
                    <span className="text-gray-400 text-[8px] md:text-sm whitespace-nowrap">Duration</span>
                    <div 
                      className="relative group" 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTooltip('duration');
                      }}
                    >
                      <InformationCircleIcon className="h-4 w-4 text-gray-400 cursor-help hover:text-[#ffc62d] transition-colors" />
                      
                      {/* Mobile tooltip (click) */}
                      {activeTooltip === 'duration' && (
                        <div 
                          className="absolute bottom-full right-0 mb-2 w-48 md:w-64 p-3 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-xl z-50 text-xs animate-fadeIn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="text-white font-medium mb-1">Duration</div>
                          <p className="text-gray-300">{tooltips.duration}</p>
                          <div className="absolute w-2 h-2 bg-[#1A1A1A] rotate-45 -bottom-1 right-1 border-r border-b border-[#333]"></div>
                        </div>
                      )}
                      
                      {/* Desktop tooltip (hover) - hidden on mobile */}
                      <div className="hidden md:block">
                        <div className="absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible bottom-full right-0 mb-2 w-64 p-3 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-xl z-50 transition-all duration-200 text-xs pointer-events-none">
                          <div className="text-white font-medium mb-1">Duration</div>
                          <p className="text-gray-300">{tooltips.duration}</p>
                          <div className="absolute w-2 h-2 bg-[#1A1A1A] rotate-45 -bottom-1 right-1 border-r border-b border-[#333]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute md:relative top-[215px] md:top-auto right-0 md:right-auto flex items-center justify-end gap-1">
                    <span className="text-gray-400 text-[8px] md:text-sm whitespace-nowrap">Starting Balance</span>
                    <div 
                      className="relative group" 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTooltip('startingBalance');
                      }}
                    >
                      <InformationCircleIcon className="h-4 w-4 text-gray-400 cursor-help hover:text-[#ffc62d] transition-colors" />
                      
                      {/* Mobile tooltip (click) */}
                      {activeTooltip === 'startingBalance' && (
                        <div 
                          className="absolute bottom-full right-0 mb-2 w-48 md:w-64 p-3 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-xl z-50 text-xs animate-fadeIn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="text-white font-medium mb-1">Starting Balance</div>
                          <p className="text-gray-300">{tooltips.startingBalance}</p>
                          <div className="absolute w-2 h-2 bg-[#1A1A1A] rotate-45 -bottom-1 right-1 border-r border-b border-[#333]"></div>
                        </div>
                      )}
                      
                      {/* Desktop tooltip (hover) - hidden on mobile */}
                      <div className="hidden md:block">
                        <div className="absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible bottom-full right-0 mb-2 w-64 p-3 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-xl z-50 transition-all duration-200 text-xs pointer-events-none">
                          <div className="text-white font-medium mb-1">Starting Balance</div>
                          <p className="text-gray-300">{tooltips.startingBalance}</p>
                          <div className="absolute w-2 h-2 bg-[#1A1A1A] rotate-45 -bottom-1 right-1 border-r border-b border-[#333]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arena Card and Prizes */}
              <div className="w-[80%] md:w-3/4 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:overflow-visible">
                <div className="flex gap-2 md:gap-4 min-w-max md:grid md:grid-cols-2 md:min-w-0">
                  {/* The Flip Arena Card */}
                  <div className="snap-center w-[55vw] md:w-auto shrink-0 relative bg-[#111111] rounded-xl overflow-hidden border border-[#8B0000]">
                    <div className="p-3 md:p-4 border-b border-[#1A1A1A]">
                      <div className="text-lg md:text-2xl font-bold text-[#8B0000] mb-1">The Flip Arena</div>
                      <div className="text-[10px] md:text-xs text-gray-400">No Rules. Just Flip.</div>
                    </div>
                    
                    <div className="p-3 md:p-4 bg-[#0D0D0D]">
                      <div className="text-left">
                        <span className="text-[12px] md:text-2xl font-bold">$100</span>
                        <span className="text-[10px] md:text-xs ml-1 text-gray-400">One-time Payment</span>
                      </div>
                    </div>
                    
                    <div className="p-3 md:p-4 bg-[#111111]">
                      <div className="text-left text-[12px] md:text-base">Funded Account + Cash Prizes</div>
                    </div>
                    
                    <div className="p-3 md:p-4 bg-[#0D0D0D]">
                      <div className="text-left text-[12px] md:text-base">30 Days</div>
                    </div>
                    
                    <div className="p-3 md:p-4 bg-[#111111]">
                      <div className="text-left text-[12px] md:text-base">$5,000</div>
                    </div>

                    <div className="p-3 md:p-4 border-t border-[#1A1A1A]">
                      <Link href="/dashboard/trading-arena/checkout" className="w-full bg-[#8B0000] text-white py-2 px-4 rounded font-semibold hover:bg-[#660000] transition-colors text-xs md:text-sm inline-block text-center">
                        Join Now
                      </Link>
                    </div>
                  </div>

                  {/* Prize Cards Container */}
                  <div className="snap-center w-[55vw] md:w-auto shrink-0 space-y-2">
                    <div className="bg-[#111111] p-4 md:p-6 flex items-center rounded-lg relative overflow-hidden transform hover:scale-[1.02] transition-all duration-300 shadow-[0_0_15px_rgba(139,0,0,0.3)]">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#8B0000]/20 to-transparent"></div>
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FFD700] via-[#8B0000] to-[#FFD700] animate-pulse"></div>
                      <div className="absolute 
                        left-[-10px] top-[50%] -translate-y-1/2 
                        md:left-[-20px] md:top-[50%] md:-translate-y-1/2
                        w-[120px] h-[120px] 
                        md:w-[180px] md:h-[180px] 
                        z-20"
                      >
                        <Image
                          src="/images/arena-champion.png"
                          alt="Arena Champion Badge"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="pl-20 md:pl-32 flex flex-col gap-2 w-full relative z-10">
                        <span className="font-bold text-[13px] md:text-lg whitespace-nowrap text-[#8B0000]">
                          ARENA CHAMPION
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-sm text-[#FFD700] whitespace-nowrap flex items-center gap-1">
                            <span className="text-gray-400">-</span>
                            $150K Funded
                          </span>
                          <span className="font-bold text-sm text-[#00C853] whitespace-nowrap flex items-center gap-1">
                            <span className="text-gray-400">-</span>
                            +$500 Cash
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Other prize cards remain the same */}
                    <div className="bg-[#111111] p-4 flex items-center rounded-lg relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C0C0C0]"></div>
                      <div className="pl-3 flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-[#C0C0C0] text-[12px] md:text-base">🥈</span>
                          <span className="font-bold text-[12px] md:text-base">2nd Place</span>
                        </div>
                        <span className="font-bold text-[12px] md:text-sm">$1,000 Cash</span>
                      </div>
                    </div>
                    
                    <div className="bg-[#111111] p-4 flex items-center rounded-lg relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#CD7F32]"></div>
                      <div className="pl-3 flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-[#CD7F32] text-[12px] md:text-base">🥉</span>
                          <span className="font-bold text-[12px] md:text-base">3rd Place</span>
                        </div>
                        <span className="font-bold text-[12px] md:text-sm">$750 Cash</span>
                      </div>
                    </div>
                    
                    <div className="bg-[#111111] p-4 flex items-center rounded-lg relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2A2A2A]"></div>
                      <div className="pl-3 flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-[12px] md:text-base">4</span>
                          <span className="font-bold text-[12px] md:text-base">4th Place</span>
                        </div>
                        <span className="font-bold text-[12px] md:text-sm">$500 Cash</span>
                      </div>
                    </div>
                    
                    <div className="bg-[#111111] p-4 flex items-center rounded-lg relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2A2A2A]"></div>
                      <div className="pl-3 flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-[12px] md:text-base">5</span>
                          <span className="font-bold text-[12px] md:text-base">5th Place</span>
                        </div>
                        <span className="font-bold text-[12px] md:text-sm">$250 Cash</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs md:text-sm text-gray-400 text-center mt-8">
              Arena&apos;s every single month and ends at the end of the month. Registration for the next month is open from the 1st-5th of every single month.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Trials Section */}
      <section id="trials-section" className="py-8 md:py-16 min-h-screen w-full overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-4"
        >
          <div className="bg-[#0A0A0A] rounded-2xl p-4 md:p-8 shadow-lg border border-[#1A1A1A]">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl font-bold mb-4">TRIALS</h2>
              <div className="flex items-center justify-center mb-4">
                <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-[#ffc62d] rotate-45 mx-1"></div>
                <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-[#ffc62d] rotate-45 mx-1"></div>
              </div>
              <h3 className="text-[0.9rem] md:text-xl font-bold mb-4">CHOOSE YOUR ACCOUNT SIZE</h3>
              <p className="text-[0.5rem] md:text-sm text-gray-400">ASCENDANT MARKETS offers three different Trading Trials™ account sizes so you can choose from the option that best fits your goals.</p>
            </div>

            <div className="flex flex-row md:flex-row gap-4 md:gap-8">
              {/* Info Column - Sticky on mobile */}
              <div className="w-[25%] md:w-1/4 sticky top-0 bg-[#0A0A0A] z-30 py-2">
                <div className="relative h-[300px] md:h-auto md:flex md:flex-col md:justify-between md:space-y-[2.35rem] md:pt-24">
                  <div className="absolute md:relative top-[99px] md:top-auto right-0 md:right-auto flex items-center justify-end gap-1">
                    <span className="text-gray-400 text-[8px] md:text-sm whitespace-nowrap max-w-[80px] md:max-w-none truncate md:whitespace-normal">Monthly Price</span>
                    <div 
                      className="relative group" 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTooltip('monthlyPrice');
                      }}
                    >
                      <InformationCircleIcon className="h-4 w-4 text-gray-400 cursor-help hover:text-[#ffc62d] transition-colors" />
                      
                      {/* Mobile tooltip (click) */}
                      {activeTooltip === 'monthlyPrice' && (
                        <div 
                          className="absolute bottom-full right-0 mb-2 w-48 md:w-64 p-3 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-xl z-50 text-xs animate-fadeIn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="text-white font-medium mb-1">Monthly Price</div>
                          <p className="text-gray-300">{tooltips.monthlyPrice}</p>
                          <div className="absolute w-2 h-2 bg-[#1A1A1A] rotate-45 -bottom-1 right-1 border-r border-b border-[#333]"></div>
                        </div>
                      )}
                      
                      {/* Desktop tooltip (hover) - hidden on mobile */}
                      <div className="hidden md:block">
                        <div className="absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible bottom-full right-0 mb-2 w-64 p-3 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-xl z-50 transition-all duration-200 text-xs pointer-events-none">
                          <div className="text-white font-medium mb-1">Monthly Price</div>
                          <p className="text-gray-300">{tooltips.monthlyPrice}</p>
                          <div className="absolute w-2 h-2 bg-[#1A1A1A] rotate-45 -bottom-1 right-1 border-r border-b border-[#333]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute md:relative top-[150px] md:top-auto right-0 md:right-auto flex items-center justify-end gap-1">
                    <span className="text-gray-400 text-[8px] md:text-sm whitespace-nowrap max-w-[80px] md:max-w-none truncate md:whitespace-normal">Profit Target</span>
                    <div 
                      className="relative group" 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTooltip('profitTarget');
                      }}
                    >
                      <InformationCircleIcon className="h-4 w-4 text-gray-400 cursor-help hover:text-[#ffc62d] transition-colors" />
                      
                      {/* Mobile tooltip (click) */}
                      {activeTooltip === 'profitTarget' && (
                        <div 
                          className="absolute bottom-full right-0 mb-2 w-48 md:w-64 p-3 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-xl z-50 text-xs animate-fadeIn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="text-white font-medium mb-1">Profit Target</div>
                          <p className="text-gray-300">{tooltips.profitTarget}</p>
                          <div className="absolute w-2 h-2 bg-[#1A1A1A] rotate-45 -bottom-1 right-1 border-r border-b border-[#333]"></div>
                        </div>
                      )}
                      
                      {/* Desktop tooltip (hover) - hidden on mobile */}
                      <div className="hidden md:block">
                        <div className="absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible bottom-full right-0 mb-2 w-64 p-3 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-xl z-50 transition-all duration-200 text-xs pointer-events-none">
                          <div className="text-white font-medium mb-1">Profit Target</div>
                          <p className="text-gray-300">{tooltips.profitTarget}</p>
                          <div className="absolute w-2 h-2 bg-[#1A1A1A] rotate-45 -bottom-1 right-1 border-r border-b border-[#333]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute md:relative top-[202px] md:top-auto right-0 md:right-auto flex items-center justify-end gap-1">
                    <span className="text-gray-400 text-[8px] md:text-sm whitespace-nowrap max-w-[80px] md:max-w-none truncate md:whitespace-normal">Max Position Size</span>
                    <div 
                      className="relative group" 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTooltip('maxPositionSize');
                      }}
                    >
                      <InformationCircleIcon className="h-4 w-4 text-gray-400 cursor-help hover:text-[#ffc62d] transition-colors" />
                      
                      {/* Mobile tooltip (click) */}
                      {activeTooltip === 'maxPositionSize' && (
                        <div 
                          className="absolute bottom-full right-0 mb-2 w-48 md:w-64 p-3 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-xl z-50 text-xs animate-fadeIn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="text-white font-medium mb-1">Max Position Size</div>
                          <p className="text-gray-300">{tooltips.maxPositionSize}</p>
                          <div className="absolute w-2 h-2 bg-[#1A1A1A] rotate-45 -bottom-1 right-1 border-r border-b border-[#333]"></div>
                        </div>
                      )}
                      
                      {/* Desktop tooltip (hover) - hidden on mobile */}
                      <div className="hidden md:block">
                        <div className="absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible bottom-full right-0 mb-2 w-64 p-3 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-xl z-50 transition-all duration-200 text-xs pointer-events-none">
                          <div className="text-white font-medium mb-1">Max Position Size</div>
                          <p className="text-gray-300">{tooltips.maxPositionSize}</p>
                          <div className="absolute w-2 h-2 bg-[#1A1A1A] rotate-45 -bottom-1 right-1 border-r border-b border-[#333]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute md:relative top-[254px] md:top-auto right-0 md:right-auto flex items-center justify-end gap-1">
                    <span className="text-gray-400 text-[8px] md:text-sm whitespace-nowrap max-w-[80px] md:max-w-none truncate md:whitespace-normal">Max Loss Limit</span>
                    <div 
                      className="relative group" 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTooltip('maxLossLimit');
                      }}
                    >
                      <InformationCircleIcon className="h-4 w-4 text-gray-400 cursor-help hover:text-[#ffc62d] transition-colors" />
                      
                      {/* Mobile tooltip (click) */}
                      {activeTooltip === 'maxLossLimit' && (
                        <div 
                          className="absolute bottom-full right-0 mb-2 w-48 md:w-64 p-3 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-xl z-50 text-xs animate-fadeIn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="text-white font-medium mb-1">Max Loss Limit</div>
                          <p className="text-gray-300">{tooltips.maxLossLimit}</p>
                          <div className="absolute w-2 h-2 bg-[#1A1A1A] rotate-45 -bottom-1 right-1 border-r border-b border-[#333]"></div>
                        </div>
                      )}
                      
                      {/* Desktop tooltip (hover) - hidden on mobile */}
                      <div className="hidden md:block">
                        <div className="absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible bottom-full right-0 mb-2 w-64 p-3 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-xl z-50 transition-all duration-200 text-xs pointer-events-none">
                          <div className="text-white font-medium mb-1">Max Loss Limit</div>
                          <p className="text-gray-300">{tooltips.maxLossLimit}</p>
                          <div className="absolute w-2 h-2 bg-[#1A1A1A] rotate-45 -bottom-1 right-1 border-r border-b border-[#333]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="w-[80%] md:w-3/4 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:overflow-visible">
                <div className="flex gap-2 md:gap-4 min-w-max md:grid md:grid-cols-3 md:min-w-0">
                  {[
                    {
                      size: '50K',
                      isPopular: true,
                      price: { original: '$150/mo', discounted: '$49/mo' },
                      profit: '$5,000',
                      lots: '10 lots',
                      loss: '$4,000'
                    },
                    {
                      size: '100K',
                      price: { original: '$250/mo', discounted: '$99/mo' },
                      profit: '$10,000',
                      lots: '20 lots',
                      loss: '$8,000'
                    },
                    {
                      size: '150K',
                      price: { original: '$350/mo', discounted: '$149/mo' },
                      profit: '$15,000',
                      lots: '30 lots',
                      loss: '$12,000'
                    }
                  ].map((tier, index) => (
                    <div key={index} className="snap-center w-[55vw] md:w-auto shrink-0 relative bg-[#111111] rounded-xl overflow-hidden">
                      {tier.isPopular && (
                        <div className="absolute top-0 right-0 bg-[#8B0000] text-white text-xs font-bold px-3 py-1">
                          POPULAR
                        </div>
                      )}
                      <div className="p-4 border-b border-[#1A1A1A]">
                        <div className="text-xl md:text-2xl font-bold text-[#8B0000] mb-1">{tier.size}</div>
                        <div className="text-[10px] md:text-xs text-gray-400">BUYING POWER</div>
                      </div>
                      
                      <div className="p-4 bg-[#0D0D0D]">
                        <div className="text-left">
                          <span className="line-through text-gray-400 text-[10px] md:text-sm">{tier.price.original}</span>
                          <span className="ml-2 text-[#8B0000] font-bold text-[12px] md:text-base">{tier.price.discounted}</span>
                          <span className="text-[10px] ml-1 text-gray-400">USD</span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-[#111111]">
                        <div className="text-left text-[12px] md:text-base">{tier.profit}</div>
                      </div>
                      
                      <div className="p-4 bg-[#0D0D0D]">
                        <div className="text-left text-[12px] md:text-base">{tier.lots}</div>
                      </div>
                      
                      <div className="p-4 bg-[#111111]">
                        <div className="text-left text-[12px] md:text-base">{tier.loss}</div>
                      </div>

                      <div className="p-4 border-t border-[#1A1A1A]">
                        <Link
                          href={`/dashboard/trading-arena/checkout?type=trial&size=${tier.size.toLowerCase()}`}
                          className="w-full bg-[#8B0000] text-white py-2 px-4 rounded font-semibold hover:bg-[#660000] transition-colors text-sm inline-block text-center"
                        >
                          SELECT
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xs md:text-sm text-gray-400 text-center mt-8">
              All traders pay a one-time $145 Activation Fee per Funded Account upon passing. It is the same for all account sizes.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
} 

// Add fadeIn animation to global CSS
if (typeof document !== 'undefined') {
  document.head.insertAdjacentHTML(
    'beforeend',
    `<style>
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.2s ease-out forwards;
      }
    </style>`
  );
} 