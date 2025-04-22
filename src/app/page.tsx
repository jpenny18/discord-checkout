'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useParallax } from 'react-scroll-parallax';
import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";
import { TypeAnimation } from 'react-type-animation';
import Tilt from 'react-parallax-tilt';
import { plans } from '@/config/plans';
import ParallaxWrapper from './ParallaxWrapper';
import { Menu, X } from 'lucide-react';
import PlatinumToggle from '@/components/PlatinumToggle';
import DottedGlobe from '@/components/DottedGlobe';
import styles from '@/styles/home.module.css';
import { PlanFeature } from '@/types/index';

// Add WebGL type definitions
interface WebGLContextAttributes {
  alpha?: boolean;
  depth?: boolean;
  stencil?: boolean;
  antialias?: boolean;
  premultipliedAlpha?: boolean;
  preserveDrawingBuffer?: boolean;
  powerPreference?: 'default' | 'high-performance' | 'low-power';
}

interface WebGLRenderingContext extends WebGLRenderingContextBase {}
interface WebGL2RenderingContext extends WebGLRenderingContextBase {}

// WebGL detection utility
const checkWebGLSupport = () => {
  if (typeof window === 'undefined') return false;
  
  try {
    const canvas = document.createElement('canvas');
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;

    // Try to get WebGL context, with fallbacks
    gl = canvas.getContext('webgl2') as WebGL2RenderingContext;
    if (!gl) {
      gl = canvas.getContext('webgl') as WebGLRenderingContext;
    }
    if (!gl) {
      gl = canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    }

    if (!gl) return false;
               
    // Additional checks for iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isIOS && isSafari) {
      try {
        // Safe type assertion since we've already checked gl is not null
        const webGLContext = gl as WebGLRenderingContext;
        const maxTextureSize = webGLContext.getParameter(webGLContext.MAX_TEXTURE_SIZE);
        if (!maxTextureSize || maxTextureSize < 4096) {
          return false;
        }
      } catch (e) {
        return false;
      }
    }
    
    return true;
  } catch (e) {
    return false;
  }
};

// Fallback components
const FallbackParticles = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black">
      <div className="absolute inset-0 opacity-30" 
           style={{ 
             backgroundImage: 'radial-gradient(circle at center, #ffc62d 1px, transparent 1px)', 
             backgroundSize: '50px 50px' 
           }} 
      />
    </div>
  </div>
);

const FallbackGlobe = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <div className="absolute inset-0 bg-[#ffc62d]/5 rounded-lg" />
    <div className="relative">
      <Image
        src="/images/logo.png"
        alt="Ascendant Logo"
        width={64}
        height={64}
        className="rounded-full animate-pulse"
      />
      <div className="absolute -inset-4 bg-[#ffc62d]/10 rounded-full animate-ping" />
    </div>
  </div>
);

// Conditionally import components based on WebGL support
const Particles = dynamic(() => {
  if (!checkWebGLSupport()) {
    return Promise.resolve(FallbackParticles);
  }
  return import("react-tsparticles").then((mod) => mod.default);
}, {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />
});

// Always use fallback for Globe
const Globe = dynamic(() => Promise.resolve(FallbackGlobe), {
  ssr: false,
  loading: () => (
    <div className="w-64 h-64 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#ffc62d] border-t-transparent rounded-full animate-spin" />
    </div>
  )
});

const tradingInstruments = [
  { 
    name: 'FOREX',
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        <path d="M8 11h3v7M16 11h-3v7M12 7V5M12 19v-2M8 7h8" />
      </svg>
    )
  },
  {
    name: 'METALS',
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3L4 9v6l8 6 8-6V9l-8-6zM4 9l8 6 8-6M12 21V15" />
      </svg>
    )
  },
  {
    name: 'COMMODITIES',
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3v3M3 12h3M21 12h-3M12 21v-3M5.636 5.636l2.122 2.122M18.364 5.636l-2.122 2.122M18.364 18.364l-2.122-2.122M5.636 18.364l2.122-2.122" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  },
  {
    name: 'INDICES',
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 3v18h18M7 17l4-8 4 4 6-9" />
      </svg>
    )
  },
  {
    name: 'STOCKS',
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 3v18h18M9 17l3-7 3 5 3-8 3 4" />
      </svg>
    )
  },
  {
    name: 'CRYPTO',
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 8h6M9 16h6M12 3v3M12 18v3M6.5 6.5l2 2M15.5 15.5l2 2M3 12h3M18 12h3M6.5 17.5l2-2M15.5 8.5l2-2" />
        <circle cx="12" cy="12" r="6" />
      </svg>
    )
  }
];

const stats = [
  {
    title: 'Community',
    description: 'Join our traders in our active community, sharing insights and strategies.',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    title: 'Success Rate',
    description: 'Our members achieve consistent profitability within 6 months.',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  {
    title: 'Support',
    description: '24/7 access to expert mentors and real-time trading support.',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  }
];

// Add this before the HomeContent function
const globeConfig = {
  pointsData: Array.from({ length: 1000 }, () => ({
    lat: (Math.random() - 0.5) * 180,
    lng: (Math.random() - 0.5) * 360,
    size: Math.random() * 2
  })),
  globeImageUrl: '',
  backgroundColor: 'rgba(0,0,0,0)',
  pointColor: () => '#ffc62d',
  pointAltitude: 0,
  pointRadius: 0.25,
  atmosphereColor: '#ffc62d',
  atmosphereAltitude: 0.1,
  globeMaterial: {
    transparent: true,
    opacity: 0.1
  }
};

function HomeContent() {
  const [loading, setLoading] = useState({ particles: true, content: true });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { ref: parallaxRef } = useParallax<HTMLDivElement>({ speed: -10 });

  const particlesInit = useCallback(async (engine: Engine) => {
    if (checkWebGLSupport()) {
    await loadSlim(engine);
    }
    setLoading(prev => ({ ...prev, particles: false }));
  }, []);

  useEffect(() => {
    setLoading(prev => ({ ...prev, content: false }));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const motionConfig = {
    transition: prefersReducedMotion 
      ? { duration: 0 }
      : { duration: 0.5, type: "spring" },
    animate: prefersReducedMotion
      ? { opacity: 1 }
      : { opacity: 1, y: 0 },
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <nav className={`max-w-2xl mx-auto px-3 py-2 my-2 bg-black/80 backdrop-blur-sm border border-[#232323] shadow-lg ${isMobileMenuOpen ? 'rounded-2xl' : 'rounded-full'} transition-all duration-300`}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/logo.png"
                alt="Ascendant Academy Logo"
                width={28}
                height={28}
                className="rounded-full"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 mx-auto">
              <button 
                onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                ABOUT
              </button>
              <button 
                onClick={() => document.getElementById('bento')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                FEATURES
              </button>
              <button 
                onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                REVIEWS
              </button>
              <button 
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                PRICING
              </button>
              <button 
                onClick={() => document.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                FAQS
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 md:relative md:right-0 absolute right-1/2 transform translate-x-1/2">
              <Link 
                href="/funding" 
                className="bg-white/10 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-white/20 transition-colors inline-flex items-center"
              >
                EARN FUNDING
              </Link>
              <Link 
                href="/checkout" 
                className="bg-[#ffc62d] text-black px-3 py-1 rounded-lg text-xs font-semibold hover:bg-[#ffd700] transition-colors inline-flex items-center"
              >
                SIGN UP
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={14}
                  height={14}
                  className="ml-1 rounded-full"
                />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-2"
              >
                <div className="flex flex-col space-y-2 py-2">
                  <button 
                    onClick={() => {
                      const element = document.getElementById('stats');
                      setIsMobileMenuOpen(false);
                      setTimeout(() => {
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    ABOUT
                  </button>
                  <button 
                    onClick={() => {
                      const element = document.getElementById('bento');
                      setIsMobileMenuOpen(false);
                      setTimeout(() => {
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    FEATURES
                  </button>
                  <button 
                    onClick={() => {
                      const element = document.getElementById('reviews');
                      setIsMobileMenuOpen(false);
                      setTimeout(() => {
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    REVIEWS
                  </button>
                  <button 
                    onClick={() => {
                      const element = document.getElementById('pricing');
                      setIsMobileMenuOpen(false);
                      setTimeout(() => {
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    PRICING
                  </button>
                  <button 
                    onClick={() => {
                      const element = document.getElementById('faqs');
                      setIsMobileMenuOpen(false);
                      setTimeout(() => {
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    FAQS
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Add padding to account for fixed header */}
      <div className="pt-12">
        {/* Hero Section with Particles */}
        <div id="about" ref={parallaxRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
              fullScreen: false,
              fpsLimit: 60,
              particles: {
                number: { value: 100, density: { enable: true, value_area: 800 } },
                color: { value: "#ffc62d" },
                shape: { type: "circle" },
                opacity: {
                  value: 0.3,
                  random: true,
                  animation: {
                    enable: true,
                    speed: 1,
                    minimumValue: 0.1,
                    sync: false
                  }
                },
                size: {
                  value: 4,
                  random: true,
                  animation: {
                    enable: true,
                    speed: 2,
                    minimumValue: 0.5,
                    sync: false
                  }
                },
                links: {
                  enable: true,
                  distance: 150,
                  color: "#ffc62d",
                  opacity: 0.2,
                  width: 1.5
                },
                move: {
                  enable: true,
                  speed: 1.2,
                  direction: "none",
                  random: true,
                  straight: false,
                  outModes: { default: "out" },
                  attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                  }
                }
              },
              interactivity: {
                detectsOn: "canvas",
                events: {
                  onHover: {
                    enable: true,
                    mode: "grab"
                  },
                  onClick: {
                    enable: true,
                    mode: "push"
                  },
                  resize: true
                },
                modes: {
                  grab: {
                    distance: 140,
                    links: {
                      opacity: 0.5
                    }
                  },
                  push: {
                    quantity: 4
                  }
                }
              },
              detectRetina: true
            }}
            className="absolute inset-0"
          />

          <div className="relative z-10 text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
                LEARN, EARN, AND
                <br />
                <span className="text-[#ffc62d]">ASCEND TO NEW HEIGHTS</span>
              </h1>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-sm md:text-xl text-gray-300 mb-12 max-w-4xl mx-auto"
              >
                <TypeAnimation
                  sequence={[
                    'Join our thriving community and gain access to expert guidance, exclusive insights, cutting-edge research, and the support you need to succeed.',
                    1000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={0}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex justify-center gap-4"
              >
                <Link 
                  href="/checkout"
                  className="bg-[#ffc62d] text-black px-4 md:px-8 py-2 md:py-3 rounded-lg text-xs md:text-base font-semibold hover:bg-[#ffd700] transition-all duration-300 hover:scale-105 inline-block"
                >
                  JOIN THE COMMUNITY
                </Link>
                <Link 
                  href="/funding"
                  className="border border-[#ffc62d] text-[#ffc62d] px-4 md:px-8 py-2 md:py-3 rounded-lg text-xs md:text-base font-semibold hover:bg-[#ffc62d]/10 transition-all duration-300 hover:scale-105 inline-block"
                >
                  EARN FUNDING
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <section className="py-20 bg-black">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-[#0A0A0A] p-4 rounded-lg border border-transparent hover:border-[#ffc62d] relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[#ffc62d]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="text-[#ffc62d] mb-2">{stat.icon}</div>
                    <h3 className="text-lg font-bold mb-1.5 group-hover:text-[#ffc62d] transition-colors duration-300">{stat.title}</h3>
                    <p className="text-gray-400 text-xs leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{stat.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Bento Box Grid Section */}
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* First Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="col-span-1"
              >
                <PlatinumToggle />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="col-span-1"
              >
                <div className="flex flex-col items-center p-8 border border-[#232323] rounded-2xl bg-black relative overflow-hidden">
                  {/* Noise Background */}
                  <div className="absolute inset-0 opacity-50 pointer-events-none">
                    <div className="absolute inset-0 bg-repeat bg-noise opacity-20" />
                  </div>

                  <div className="w-full relative space-y-8">
                    {/* Chat Section */}
                    <div className="bg-black p-6 rounded-lg border border-[#232323]">
                      <motion.div 
                        className="space-y-4"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                          visible: {
                            transition: {
                              staggerChildren: 0.8
                            }
                          }
                        }}
                      >
                        <motion.div 
                          className="flex items-start gap-3 justify-end"
                          variants={{
                            hidden: { opacity: 0, x: 20 },
                            visible: { 
                              opacity: 1, 
                              x: 0,
                              transition: {
                                duration: 0.5,
                                ease: "easeOut"
                              }
                            }
                          }}
                        >
                          <div className="flex-1 text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <span className="text-sm font-medium">Miles Reed</span>
                            </div>
                            <p className="text-gray-400 text-sm mt-1">How do I place a buy order?</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center text-xs">M</div>
                        </motion.div>

                        <motion.div 
                          className="flex items-start gap-3"
                          variants={{
                            hidden: { opacity: 0, x: -20 },
                            visible: { 
                              opacity: 1, 
                              x: 0,
                              transition: {
                                duration: 0.5,
                                ease: "easeOut"
                              }
                            }
                          }}
                        >
                          <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center text-xs">S</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Stellar | Moderator</span>
                            </div>
                            <motion.p 
                              className="text-gray-400 text-sm mt-1"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.6, duration: 0.5 }}
                            >
                              Hey Miles! We have a great guide<br /> that breaks down everything, <br />here is the link for you!
                            </motion.p>
                          </div>
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Title and Description */}
                    <div className="text-center p-6 border border-[#232323] rounded-lg bg-black">
                      <h2 className="text-3xl font-bold mb-4 tracking-tight uppercase">
                        Supportive Community
                      </h2>
                      <p className="text-gray-400 text-base leading-relaxed">
                        Connect with like-minded individuals, share experiences, and learn from others in our thriving community.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Second Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="col-span-1"
              >
                <div className="flex flex-col items-center p-8 border border-[#232323] rounded-2xl bg-black relative overflow-hidden">
                  {/* Noise Background */}
                  <div className="absolute inset-0 opacity-50 pointer-events-none">
                    <div className="absolute inset-0 bg-repeat bg-noise opacity-20" />
                  </div>

                  <div className="w-full relative space-y-8">
                    {/* Icons Grid Section */}
                    <div className="bg-black p-6 rounded-lg border border-[#232323]">
                      <div className="grid grid-cols-3 gap-4">
                        {tradingInstruments.slice(0, 6).map((instrument, index) => (
                          <motion.div
                            key={instrument.name}
                            className="flex flex-col items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              duration: 0.5,
                              delay: index * 0.2,
                              repeat: Infinity,
                              repeatType: "reverse",
                              repeatDelay: 2
                            }}
                          >
                            <div className="text-yellow-500/90 group-hover:text-yellow-500 transition-colors duration-300">
                              {instrument.icon}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Title and Description */}
                    <div className="text-center p-6 border border-[#232323] rounded-lg bg-black">
                      <h2 className="text-3xl font-bold mb-4 tracking-tight uppercase">
                        Expert Guidance
                      </h2>
                      <p className="text-gray-400 text-base leading-relaxed">
                        Learn from our experienced traders and mentors, who can provide personalized coaching and guidance.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Track Record Component */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="col-span-1"
              >
                <div className="flex flex-col items-center p-8 border border-[#232323] rounded-2xl bg-black relative overflow-hidden">
                  {/* Noise Background */}
                  <div className="absolute inset-0 opacity-50 pointer-events-none">
                    <div className="absolute inset-0 bg-repeat bg-noise opacity-20" />
                  </div>

                  <div className="w-full relative space-y-8">
                    {/* Globe Section */}
                    <div className="bg-black p-3 rounded-lg border border-[#232323] relative overflow-hidden h-[250px] flex items-center justify-center">
                      <Globe />
                    </div>

                    {/* Title and Description */}
                    <div className="text-center p-6 border border-[#232323] rounded-lg bg-black">
                      <h2 className="text-3xl font-bold mb-4 tracking-tight uppercase">
                        Track Record of Success
                      </h2>
                      <p className="text-gray-400 text-base leading-relaxed">
                        Join thousands of successful traders who have achieved their financial goals with our proven system.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="reviews" className="py-20 bg-black overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-center mb-16"
            >
              WHAT THE COMMUNITY IS SAYING
            </motion.h2>

            <div className="relative max-w-[800px] mx-auto">
              {/* Gradient Overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-[15%] bg-gradient-to-r from-black to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-[15%] bg-gradient-to-l from-black to-transparent z-10" />

              {/* Navigation Arrows */}
              <button 
                onClick={() => {
                  const container = document.getElementById('reviews-container');
                  if (container) {
                    container.scrollBy({ left: -300, behavior: 'smooth' });
                  }
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={() => {
                  const container = document.getElementById('reviews-container');
                  if (container) {
                    container.scrollBy({ left: 300, behavior: 'smooth' });
                  }
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Reviews Container */}
              <div 
                id="reviews-container"
                className="flex gap-6 overflow-x-hidden scroll-smooth px-4"
              >
                {[
                  {
                    name: "Alex Thompson",
                    avatar: "AT",
                    rating: 5,
                    text: "This community has transformed my trading journey. The daily market insights and educational content are invaluable. The mentors are always available to help, and the weekly strategy sessions have dramatically improved my success rate. Couldn't recommend it enough!"
                  },
                  {
                    name: "Sarah Chen",
                    avatar: "SC",
                    rating: 5,
                    text: "I've been part of many trading communities, but none compare to this one. The level of analysis and support is exceptional. From day one, I felt welcomed and supported. The moderators are incredibly knowledgeable and always ready to help explain complex concepts."
                  },
                  {
                    name: "Marcus Williams",
                    avatar: "MW",
                    rating: 5,
                    text: "The educational resources here are top-tier. I've learned more in 3 months than I did in a year of self-study. The community is supportive, and the mentors truly care about your success. The technical analysis provided has helped me spot opportunities I would have missed."
                  },
                  {
                    name: "Emma Rodriguez",
                    avatar: "ER",
                    rating: 5,
                    text: "Finding this community was a game-changer for my trading career. The real-time market updates and professional guidance have helped me develop a consistent trading strategy. The support from both mentors and fellow traders is incredible."
                  }
                ].map((review, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="min-w-[280px] max-w-[280px] flex-shrink-0"
                  >
                    <div className="p-6 bg-[#0A0A0A] rounded-2xl border border-[#232323] relative group overflow-hidden h-full">
                      {/* Noise Background */}
                      <div className="absolute inset-0 opacity-50 pointer-events-none">
                        <div className="absolute inset-0 bg-repeat bg-noise opacity-20" />
                      </div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 rounded-full bg-[#232323] flex items-center justify-center text-[#ffc62d] font-medium text-sm">
                            {review.avatar}
                          </div>
                          <div>
                            <h3 className="font-semibold text-base">{review.name}</h3>
                            <div className="flex gap-1 text-[#ffc62d]">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-400 leading-relaxed text-sm">{review.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mobile text size adjustments */}
        <style jsx global>{`
          @media (max-width: 768px) {
            h1.text-4xl {
              font-size: 1.5rem;
            }
            h2.text-4xl, h2.text-3xl {
              font-size: 1.25rem;
            }
            p.text-xl, p.text-lg {
              font-size: 0.875rem;
            }
            .section-description {
              font-size: 0.75rem;
            }
            .pricing-container {
              padding-left: 1.5rem;
              padding-right: 1.5rem;
            }
          }

          @keyframes glowingBorder {
            0% {
              box-shadow: 0 -50% 20px -15px #ffc62d, 0 0 0 2px #ffc62d;
              filter: brightness(1.2);
            }
            25% {
              box-shadow: 50% 0 20px -15px #ffc62d, 0 0 0 2px #ffc62d;
              filter: brightness(1);
            }
            50% {
              box-shadow: 0 50% 20px -15px #ffc62d, 0 0 0 2px #ffc62d;
              filter: brightness(1.2);
            }
            75% {
              box-shadow: -50% 0 20px -15px #ffc62d, 0 0 0 2px #ffc62d;
              filter: brightness(1);
            }
            100% {
              box-shadow: 0 -50% 20px -15px #ffc62d, 0 0 0 2px #ffc62d;
              filter: brightness(1.2);
            }
          }

          .platinum-card {
            animation: glowingBorder 4s infinite;
            position: relative;
            overflow: visible !important;
          }

          .platinum-card::before {
            content: '';
            position: absolute;
            inset: -2px;
            border-radius: inherit;
            padding: 2px;
            background: linear-gradient(to right, transparent, #ffc62d, transparent);
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
          }
        `}</style>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className={`text-3xl font-bold mb-4 ${styles.mobileHeading}`}>FIND YOUR FIT</h2>
              <p className={`text-sm text-gray-400 ${styles.mobileDescription}`}>
                Whether you're looking for a vibrant community of like-minded individuals or ready to begin
                your career as a full-time day trader, we've got you covered.
              </p>
            </motion.div>

            <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto ${styles.pricingContainer}`}>
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className={`
                    relative overflow-hidden rounded-2xl
                    ${plan.popular ? 'md:scale-110 z-10 platinum-card' : ''}
                    ${plan.popular ? 'bg-gradient-to-b from-[#111111] to-[#111111] border-2 border-[#ffc62d]' : 'bg-black border border-[#232323]'}
                    ${plan.popular ? styles.popularCard : ''}
                  `}
                  style={plan.popular ? {
                    background: 'linear-gradient(180deg, rgba(255, 198, 45, 0.05) 0%, rgba(17, 17, 17, 1) 100%)'
                  } : {}}
                >
                  {/* Noise Background */}
                  <div className="absolute inset-0 opacity-50 pointer-events-none">
                    <div className="absolute inset-0 bg-repeat bg-noise opacity-20" />
                  </div>

                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute top-0 right-0 mt-3 mr-3">
                      <span className="bg-[#ffc62d] text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="p-6 relative z-10">
                    <div className="text-center mb-6">
                      <h3 className={`text-base font-semibold mb-3 tracking-wide ${plan.popular ? 'text-lg' : ''}`}>{plan.name}</h3>
                      <div className="flex flex-col items-center justify-center">
                        {typeof plan.priceDisplay === 'string' ? (
                          <span className={`font-bold ${plan.popular ? 'text-4xl' : 'text-3xl'}`}>{plan.priceDisplay}</span>
                        ) : (
                          <div className="flex flex-col items-center">
                            <span className={`font-bold ${plan.popular ? 'text-4xl' : 'text-3xl'}`}>{plan.priceDisplay.amount}</span>
                            <span className="text-sm text-gray-400">{plan.priceDisplay.period}</span>
                          </div>
                        )}
                        {plan.billingNote && (
                          <span className="text-gray-400 text-xs mt-1">{plan.billingNote}</span>
                        )}
                      </div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature: PlanFeature, featureIndex: number): JSX.Element => (
                        <li key={featureIndex} className={`flex items-start text-xs text-gray-300 ${!feature.included ? 'opacity-50' : ''}`}>
                          {feature.included ? (
                            <svg className="w-4 h-4 text-[#ffc62d] mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          <span className={!feature.included ? 'text-gray-500' : ''}>{feature.name}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/checkout"
                      className={`
                        block text-center py-1.5 px-4 rounded-lg font-semibold transition-all duration-300 text-xs
                        ${plan.popular
                          ? 'bg-[#ffc62d] text-black hover:bg-[#ffd700] hover:scale-105'
                          : 'bg-white/10 hover:bg-white/20'
                        }
                      `}
                    >
                      GET STARTED
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faqs" className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-4">Still considering?</h2>
              <p className="text-sm text-gray-400">
              All insights into our expertise provided in easily digestible nuggets. No question too big or small - ask away!
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              {[
                {
                  question: "What is Ascendant Academy?",
                  answer: "Ascendant Academy is a comprehensive trading education platform and community designed to help traders of all levels succeed in the financial markets."
                },
                {
                  question: "How do I get started?",
                  answer: "Simply choose your membership plan and complete the registration process. Once you're in, you'll have immediate access to our community, educational resources, and trading tools."
                },
                {
                  question: "What's included in the membership?",
                  answer: "Members get access to our exclusive trading community, educational content, live trading sessions, market analysis, mentorship opportunities, exclusive trading tools, and most importantly our very own funding solutions."
                },
                {
                  question: "Can I cancel my subscription?",
                  answer: "Yes, you can cancel your subscription at any time. If you cancel, you'll continue to have access until the end of your current billing period."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="mb-6"
                >
                  <div className="rounded-xl border border-[#232323] overflow-hidden transition-all duration-300 hover:border-[#ffc62d] group">
                    <details className="group/details">
                      <summary className="flex items-center justify-between gap-3 px-6 py-4 cursor-pointer list-none text-[#ffc62d] hover:text-[#ffd700] transition-colors">
                        <span className="font-medium">{faq.question}</span>
                        <span className="transition-transform duration-300 group-open/details:rotate-45">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      </summary>
                      <div className="px-6 py-4 text-gray-400">
                        {faq.answer}
                      </div>
                    </details>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-32 bg-black relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                JOIN ASCENDANT TODAY
              </h2>
              <p className="text-sm text-gray-400 max-w-xl mx-auto">
                Got questions? Let's get you moving.
              </p>
              <div>
                <Link
                  href="/checkout"
                  className="inline-flex items-center px-8 py-3 border border-[#232323] rounded-lg text-base font-semibold hover:bg-white/5 transition-colors"
                >
                  ASCEND TO NEW HEIGHTS
                  <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={20}
                    height={20}
                    className="ml-2 -mr-1 rounded-full"
                  />
                </Link>
              </div>
            </motion.div>
          </div>
          
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-transparent opacity-80"></div>
        </section>

        {/* Footer */}
        <footer className="py-16 bg-black relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/images/logo.png"
                    alt="Ascendant Logo"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="font-bold text-xl">ASCENDANT</span>
                </div>
                <p className="text-gray-400 text-sm">
                  © 2025 Ascendant Academy LTD. All Rights Reserved.
                </p>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Trading is highly volatile and inherently risky. All information provided on this site is for educational and informational purposes only and should not be considered financial advice. Past performance is not indicative of future results, and individual outcomes may vary. Always conduct your own research, consider your financial situation, and consult with a professional advisor before making any investment decisions. Ascendant assumes no responsibility for any losses or gains resulting from the use of this content.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-4">NAVIGATION</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })}
                    className="block text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    About
                  </button>
                  <button 
                    onClick={() => document.getElementById('bento')?.scrollIntoView({ behavior: 'smooth' })}
                    className="block text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Features
                  </button>
                  <button 
                    onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                    className="block text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Reviews
                  </button>
                  <button 
                    onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                    className="block text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Pricing
                  </button>
                  <button 
                    onClick={() => document.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth' })}
                    className="block text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    FAQs
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-4">STAY CONNECTED</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.151 18.939c-.203.271-.428.393-.677.393-.141 0-.281-.03-.419-.089l-4.71-2.715c-.548-.315-.848-.903-.848-1.528v-5.5c0-.626.3-1.213.848-1.528l4.71-2.715c.138-.059.278-.089.419-.089.249 0 .474.121.677.393.203.271.305.545.305.823v10.732c0 .278-.102.552-.305.823z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.151 18.939c-.203.271-.428.393-.677.393-.141 0-.281-.03-.419-.089l-4.71-2.715c-.548-.315-.848-.903-.848-1.528v-5.5c0-.626.3-1.213.848-1.528l4.71-2.715c.138-.059.278-.089.419-.089.249 0 .474.121.677.393.203.271.305.545.305.823v10.732c0 .278-.102.552-.305.823z"/>
                    </svg>
                  </a>
                </div>
                <div className="mt-4 space-x-4 text-sm">
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms & Conditions
                  </Link>
                  <span className="text-gray-600">|</span>
                  <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

export default function HomePage() {
  return (
    <ParallaxWrapper>
      <HomeContent />
    </ParallaxWrapper>
  );
} 