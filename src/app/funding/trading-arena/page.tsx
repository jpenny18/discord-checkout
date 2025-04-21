'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback, useRef, useEffect } from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import { ParallaxProvider, useParallax } from 'react-scroll-parallax';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

const arenaRules = [
  "No maximum daily drawdown limit.",
  "No maximum trading days requirement.",
  "No minimum trading days requirement.",
  "Cash Prizes and Funded Account giveaways based on performance.",
  "No restrictions on trading strategies or styles.",
  "Hold positions over weekends and overnight.",
  "News trading is allowed and encouraged.",
  "Maximum 5 active accounts per trader."
];

// Tooltip content
const tooltips = {
  entryFee: "The one-time payment required to enter the Trading Arena. This covers your participation for the full 30-day competition period.",
  prizePool: "Winners receive both funded trading accounts and cash prizes. First place gets a $150K funded account plus $500 cash, with additional cash prizes for runners-up.",
  duration: "The Arena runs for exactly 30 days. You'll have this time to grow your account as much as possible to compete for the prizes.",
  startingBalance: "All participants begin with the same $5,000 account balance to ensure fair competition. Your goal is to maximize this amount.",
};

export default function TradingArenaPage() {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  // Toggle tooltip visibility
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

  return (
    <ParallaxProvider>
      {/* Custom styles for radial gradients */}
      <style jsx global>{`
        .bg-radial-gradient {
          background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.6) 100%);
        }
        
        @keyframes crimsonPulse {
          0% { opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { opacity: 0.3; }
        }
        
        .crimson-pulse {
          animation: crimsonPulse 4s infinite;
        }
      `}</style>
      
      <div className="min-h-screen bg-black text-white pt-6 relative overflow-hidden">
        {/* Add a subtle background gradient at the very top */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-0"></div>
        
        {/* Animated crimson effect in the background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[10%] bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
          
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#8B0000]/5 blur-[120px] animate-pulse" style={{ animationDuration: '10s' }}></div>
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-[#640000]/5 blur-[150px] animate-pulse" style={{ animationDuration: '15s', animationDelay: '2s' }}></div>
        </div>
        
        {/* Particles Background */}
        <Particles
          id="arena-particles"
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
                value: ["#8B0000", "#640000", "#A50000", "#B22222"],
              },
              links: {
                color: "#8B0000",
                distance: 150,
                enable: true,
                opacity: 0.2,
                width: 1,
              },
              collisions: {
                enable: true,
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
                attract: {
                  enable: true,
                  rotateX: 600,
                  rotateY: 1200
                }
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
                  max: 0.5,
                },
              },
              shape: {
                type: ["circle", "triangle"],
              },
              size: {
                value: { min: 1, max: 4 },
                animation: {
                  enable: true,
                  speed: 2,
                  minimumValue: 0.1,
                  sync: false
                }
              },
              twinkle: {
                particles: {
                  enable: true,
                  frequency: 0.05,
                  opacity: 1
                }
              }
            },
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: "repulse"
                },
                onClick: {
                  enable: true,
                  mode: "push"
                }
              },
              modes: {
                repulse: {
                  distance: 100,
                  duration: 0.4
                },
                push: {
                  quantity: 4
                }
              }
            },
            detectRetina: true,
            smooth: true,
          }}
          className="absolute inset-0 pointer-events-none z-10"
        />

        {/* Back Button */}
        <div className="container mx-auto px-4 mb-6 relative z-10">
          <Link 
            href="/funding" 
            className="inline-flex items-center text-[#8B0000] hover:text-red-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Funding Programs
          </Link>
        </div>

        {/* Logo Section - Reduced vertical spacing */}
        <div className="container mx-auto px-4 mb-10 flex flex-col items-center gap-4 relative z-10">
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

        {/* Hero Section - Enhanced with more visual effects */}
        <section className="relative py-8 overflow-visible z-10">
          <ParallaxBanner />
          
          {/* Animated crimson lines */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute left-0 top-1/3 w-full h-px bg-gradient-to-r from-transparent via-[#8B0000]/40 to-transparent opacity-70 transform -rotate-3"></div>
            <div className="absolute left-0 top-2/3 w-full h-px bg-gradient-to-r from-transparent via-[#8B0000]/30 to-transparent opacity-60 transform rotate-2"></div>
          </div>
          
          {/* Floating crimson diamond elements */}
          <div className="absolute top-1/4 left-16 w-6 h-6 border-2 border-[#8B0000]/30 rotate-45 crimson-pulse"></div>
          <div className="absolute bottom-1/4 right-20 w-8 h-8 border-2 border-[#8B0000]/20 rotate-45 crimson-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-3/4 left-1/3 w-4 h-4 border-2 border-[#8B0000]/30 rotate-45 crimson-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="container mx-auto px-4">
            {/* Main Headers - Centered */}
            <div className="text-center mb-8 md:mb-20">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 whitespace-nowrap"
              >
                TRADING <span className="relative text-[#8B0000] drop-shadow-[0_0_25px_rgba(139,0,0,0.5)]">
                  ARENA
                  <span className="absolute -inset-1 blur-md bg-[#8B0000]/20 -z-10 rounded-lg"></span>
                </span>
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-sm sm:text-xl md:text-2xl text-gray-400"
              >
                UNLEASH YOUR POTENTIAL. NO RULES, JUST FLIP.
              </motion.h2>
              
              {/* Decorative line under subtitle */}
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#8B0000] to-transparent mx-auto mt-4"></div>
            </div>

            {/* Arena Image and Benefits */}
            <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
              {/* Image */}
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
                className="order-2 md:order-1 relative w-60 h-60 md:w-80 md:h-80 mb-8 md:mb-0"
              >
                <Image
                  src="/images/arena.png"
                  alt="Trading Arena"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>

              {/* Benefits text */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="order-1 md:order-2 md:w-1/2"
              >
                <h3 className="text-xl font-bold mb-4 md:mb-6">ARENA BENEFITS</h3>
                <ul className="space-y-2 md:space-y-4 text-sm md:text-base">
                  <li className="flex items-center gap-2">
                    <span className="text-[#8B0000]">•</span>
                    <span>Compete in 30-day trading competitions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#8B0000]">•</span>
                    <span>Win cash prizes and funded trading accounts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#8B0000]">•</span>
                    <span>No rules - just maximize your P&L</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#8B0000]">•</span>
                    <span>Daily leaderboard updates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#8B0000]">•</span>
                    <span>$5,000 starting balance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#8B0000]">•</span>
                    <span>Compete against top traders globally</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Arena Section - from dashboard */}
        <section className="py-8 md:py-16 bg-black/50 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto px-4"
          >
            <div className="bg-[#0A0A0A] rounded-2xl p-4 md:p-8 shadow-lg border border-[#1A1A1A]">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-3xl font-bold mb-4">THE ARENA</h2>
                <div className="flex items-center justify-center mb-4">
                  <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-[#8B0000] rotate-45 mx-1"></div>
                  <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-[#8B0000] rotate-45 mx-1"></div>
                </div>
                <h3 className="text-[0.9rem] md:text-xl font-bold mb-4">STEP INTO THE ULTIMATE TRADING BATTLE GROUND</h3>
                <p className="text-[0.5rem] md:text-sm text-gray-400">No rules, just one mission. Flip a $5K account as high as you can in 30 days. Are you ready to dominate the arena?</p>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                {/* Info Column - Sticky on mobile */}
                <div className="w-full md:w-1/4 py-2">
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                    <div className="flex md:flex-col items-center justify-between p-4 bg-[#111111] rounded-lg">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400 text-[0.5rem] md:text-sm whitespace-nowrap">Entry Fee</span>
                        <div 
                          className="relative group cursor-help" 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTooltip('entryFee');
                          }}
                        >
                          <Info className="h-4 w-4 text-gray-400 hover:text-[#8B0000] transition-colors" />
                          
                          {/* Tooltip */}
                          {activeTooltip === 'entryFee' && (
                            <div 
                              className="absolute bottom-full right-0 mb-2 w-48 md:w-64 p-3 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-xl z-50 text-xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="text-white font-medium mb-1">Entry Fee</div>
                              <p className="text-gray-300">{tooltips.entryFee}</p>
                              <div className="absolute w-2 h-2 bg-[#1A1A1A] rotate-45 -bottom-1 right-1 border-r border-b border-[#333]"></div>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-[0.875rem] md:text-lg font-bold">$100</span>
                    </div>
                    
                    <div className="flex md:flex-col items-center justify-between p-4 bg-[#111111] rounded-lg">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400 text-[0.5rem] md:text-sm whitespace-nowrap">Prize Pool</span>
                        <div 
                          className="relative group cursor-help" 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTooltip('prizePool');
                          }}
                        >
                          <Info className="h-4 w-4 text-gray-400 hover:text-[#8B0000] transition-colors" />
                          
                          {/* Tooltip */}
                          {activeTooltip === 'prizePool' && (
                            <div 
                              className="absolute bottom-full right-0 mb-2 w-48 md:w-64 p-3 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-xl z-50 text-xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="text-white font-medium mb-1">Prize Pool</div>
                              <p className="text-gray-300">{tooltips.prizePool}</p>
                              <div className="absolute w-2 h-2 bg-[#1A1A1A] rotate-45 -bottom-1 right-1 border-r border-b border-[#333]"></div>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-[0.875rem] md:text-lg font-bold text-[#8B0000]">$3,000+</span>
                    </div>
                    
                    <div className="flex md:flex-col items-center justify-between p-4 bg-[#111111] rounded-lg">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400 text-[0.5rem] md:text-sm whitespace-nowrap">Duration</span>
                        <div 
                          className="relative group cursor-help" 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTooltip('duration');
                          }}
                        >
                          <Info className="h-4 w-4 text-gray-400 hover:text-[#8B0000] transition-colors" />
                          
                          {/* Tooltip */}
                          {activeTooltip === 'duration' && (
                            <div 
                              className="absolute bottom-full right-0 mb-2 w-48 md:w-64 p-3 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-xl z-50 text-xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="text-white font-medium mb-1">Duration</div>
                              <p className="text-gray-300">{tooltips.duration}</p>
                              <div className="absolute w-2 h-2 bg-[#1A1A1A] rotate-45 -bottom-1 right-1 border-r border-b border-[#333]"></div>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-[0.875rem] md:text-lg font-bold">30 Days</span>
                    </div>
                    
                    <div className="flex md:flex-col items-center justify-between p-4 bg-[#111111] rounded-lg">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400 text-[0.5rem] md:text-sm whitespace-nowrap">Starting Balance</span>
                        <div 
                          className="relative group cursor-help" 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTooltip('startingBalance');
                          }}
                        >
                          <Info className="h-4 w-4 text-gray-400 hover:text-[#8B0000] transition-colors" />
                          
                          {/* Tooltip */}
                          {activeTooltip === 'startingBalance' && (
                            <div 
                              className="absolute bottom-full right-0 mb-2 w-48 md:w-64 p-3 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-xl z-50 text-xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="text-white font-medium mb-1">Starting Balance</div>
                              <p className="text-gray-300">{tooltips.startingBalance}</p>
                              <div className="absolute w-2 h-2 bg-[#1A1A1A] rotate-45 -bottom-1 right-1 border-r border-b border-[#333]"></div>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-[0.875rem] md:text-lg font-bold">$5,000</span>
                    </div>
                  </div>
                </div>

                {/* Prize Cards */}
                <div className="w-full md:w-3/4 space-y-3">
                  <div className="bg-[#111111] p-4 md:p-6 flex items-center rounded-lg relative overflow-hidden transform hover:scale-[1.02] transition-all duration-300 shadow-[0_0_15px_rgba(139,0,0,0.3)]">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8B0000]/20 to-transparent"></div>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FFD700] via-[#8B0000] to-[#FFD700] animate-pulse"></div>
                    <div className="absolute left-[-10px] top-[50%] -translate-y-1/2 md:left-[-20px] md:top-[50%] md:-translate-y-1/2 w-[120px] h-[120px] md:w-[180px] md:h-[180px] z-20">
                      <Image
                        src="/images/arena-champion.png"
                        alt="Arena Champion Badge"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="pl-20 md:pl-36 flex flex-col gap-2 w-full relative z-10">
                      <span className="font-bold text-[13px] md:text-lg whitespace-nowrap text-[#8B0000]">
                        ARENA CHAMPION
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-sm text-[#FFD700] whitespace-nowrap flex items-center gap-1">
                          <span className="text-gray-400">-</span>
                          $150K Funded Account
                        </span>
                        <span className="font-bold text-sm text-[#00C853] whitespace-nowrap flex items-center gap-1">
                          <span className="text-gray-400">-</span>
                          +$500 Cash
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-[#111111] p-4 flex items-center rounded-lg relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C0C0C0]"></div>
                      <div className="pl-3 flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-[#C0C0C0] text-base">🥈</span>
                          <span className="font-bold text-base">2nd Place</span>
                        </div>
                        <span className="font-bold text-sm">$1,000 Cash</span>
                      </div>
                    </div>
                    
                    <div className="bg-[#111111] p-4 flex items-center rounded-lg relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#CD7F32]"></div>
                      <div className="pl-3 flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-[#CD7F32] text-base">🥉</span>
                          <span className="font-bold text-base">3rd Place</span>
                        </div>
                        <span className="font-bold text-sm">$750 Cash</span>
                      </div>
                    </div>
                    
                    <div className="bg-[#111111] p-4 flex items-center rounded-lg relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2A2A2A]"></div>
                      <div className="pl-3 flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-base">4</span>
                          <span className="font-bold text-base">4th Place</span>
                        </div>
                        <span className="font-bold text-sm">$500 Cash</span>
                      </div>
                    </div>
                    
                    <div className="bg-[#111111] p-4 flex items-center rounded-lg relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2A2A2A]"></div>
                      <div className="pl-3 flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-base">5</span>
                          <span className="font-bold text-base">5th Place</span>
                        </div>
                        <span className="font-bold text-sm">$250 Cash</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#111111] p-4 rounded-lg relative overflow-hidden border border-[#8B0000]/50">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      <div>
                        <h3 className="text-lg font-bold mb-1">The Flip Arena</h3>
                        <p className="text-sm text-gray-400">$100 one-time payment. 30 days. No rules. Just flip.</p>
                      </div>
                      <Link
                        href="/dashboard/login"
                        className="bg-[#8B0000] text-white px-6 py-3 rounded font-semibold hover:bg-red-900 transition-colors w-full md:w-auto text-center"
                      >
                        JOIN THE ARENA
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs md:text-sm text-gray-400 text-center mt-8">
                Arena runs every single month and ends at the end of the month. Registration for the next month is open from the 1st-25th of every single month.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Rules Section */}
        <section className="py-12 bg-black/50 relative z-10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">ARENA RULES</h2>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
              {arenaRules.map((rule, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 md:gap-3 bg-[#111111] p-3 md:p-4 rounded-lg h-auto md:h-[120px]"
                >
                  <div className="text-[#8B0000] flex-shrink-0">
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-xs md:text-sm leading-relaxed text-gray-300">{rule}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-20 bg-black relative z-10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">READY TO TEST YOUR SKILLS?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">Join the Trading Arena today and compete against the best traders globally. No rules, no limits - just pure trading skill.</p>
            <Link
              href="/dashboard/login"
              className="inline-block bg-[#8B0000] text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-800 transition-colors"
            >
              JOIN THE ARENA
            </Link>
          </div>
        </section>
      </div>
    </ParallaxProvider>
  );
}

// Parallax Banner Component - Enhanced with crimson effects
function ParallaxBanner() {
  const parallax = useParallax<HTMLDivElement>({
    speed: -20,
    translateY: [0, 50],
    scale: [1, 1.2],
  });

  return (
    <div ref={parallax.ref} className="absolute inset-0 z-0">
      {/* Subtle dark crimson gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#8B0000]/5 to-transparent" />
      
      {/* Decorative element - top left */}
      <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-[#8B0000]/5 blur-[100px] animate-pulse" />
      
      {/* Decorative element - bottom right */}
      <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-[#8B0000]/5 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Dark vignette effect */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40" />
    </div>
  );
} 