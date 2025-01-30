'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useParallax } from 'react-scroll-parallax';
import { useEffect, useRef, useState, useCallback, MouseEvent as ReactMouseEvent } from 'react';
import { Menu, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";
import { TypeAnimation } from 'react-type-animation';
import Tilt from 'react-parallax-tilt';
import { useIntersectionObserver } from '@uidotdev/usehooks';

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

const benefits = [
  { title: 'BEST TRADING CONDITIONS', content: 'Trade with institutional grade conditions and lightning-fast execution.' },
  { title: 'GROWTH & PAYOUTS SIMULTANEOUSLY', content: 'Scale your account while receiving regular profit payouts.' },
  { title: 'ALL TRADING STRATEGIES ARE WELCOMED', content: 'Use any trading strategy you prefer, including EAs and algorithms.' },
  { title: 'ONE TIME FEE', content: 'Pay once and trade forever. No monthly fees or hidden costs.' },
  { title: 'STRAIGHT FORWARD FUNDING PROGRAMS', content: 'Clear objectives and transparent evaluation process.' },
  { title: 'FASTEST GROWTH PLAN EVER', content: 'Rapid scaling opportunities based on your performance.' },
];

const traderBenefits = [
  { title: 'Exclusive Discounts', description: 'Funded & Academy traders get exclusive discounts.' },
  { title: 'Multiple Accounts', description: 'You are allowed to manage up to 5 active funded accounts.' },
  { title: 'Giveaways', description: 'Funded & Academy traders get monthly giveaways.' },
  { title: 'Fast Payout Processing', description: 'Expect your earnings quickly. We are actively processing payments every day.' },
  { title: 'Simple Payout Policy', description: 'No hidden rules or qualifications to receive your payouts.' },
  { title: 'Learn & Earn', description: 'When you join our academy, gain access to our education and livestreams all while earning.' },
];

const socialLinks = [
  { href: 'https://facebook.com', icon: 'facebook', label: 'Facebook' },
  { href: 'https://instagram.com', icon: 'instagram', label: 'Instagram' },
  { href: 'https://youtube.com', icon: 'youtube', label: 'YouTube' },
  { href: 'https://discord.com', icon: 'discord', label: 'Discord' },
  { href: 'https://linkedin.com', icon: 'linkedin', label: 'LinkedIn' },
];

const statIcons = {
  monthly: (
    <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  total: (
    <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  recent: (
    <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const statistics = [
  {
    amount: 207863,
    label: 'Average Monthly Compensation to Customers Since January of 2024',
    icon: 'monthly',
    description: 'Consistent monthly payouts to our traders',
  },
  {
    amount: 5232581,
    label: 'Total Compensation to Customers Since 2022',
    icon: 'total',
    description: 'Growing total compensation year over year',
  },
  {
    amount: 575233,
    label: 'Total Compensation to Customers In The Last 90 Days',
    icon: 'recent',
    description: 'Recent performance shows our growth',
  },
];

const achievements = [
  { title: '1,000+', subtitle: 'Funded Traders' },
  { title: '100%', subtitle: 'Profit Split' },
  { title: '$4M', subtitle: 'Max Account Size' },
];

interface CountUpAnimationProps {
  end: number;
  duration?: number;
}

function CountUpAnimation({ end, duration = 2000 }: CountUpAnimationProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    const startTime = Date.now();
    const endValue = end;

    const updateCount = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(endValue * easeOutQuart);

      setCount(currentValue);

      if (progress < 1) {
        countRef.current = requestAnimationFrame(updateCount);
      }
    };

    countRef.current = requestAnimationFrame(updateCount);

    return () => {
      if (countRef.current) {
        cancelAnimationFrame(countRef.current);
      }
    };
  }, [end, duration, prefersReducedMotion]);

  return `$${count.toLocaleString()}`;
}

// Add loading state type
type LoadingState = {
  particles: boolean;
  content: boolean;
};

// Dynamically import heavy components
const Particles = dynamic(() => import("react-tsparticles"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />
});

export default function FundingContent() {
  const [expandedBenefit, setExpandedBenefit] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isInfoDropdownOpen, setIsInfoDropdownOpen] = useState(false);
  const { ref: parallaxRef } = useParallax<HTMLDivElement>({ speed: -10 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Add loading state
  const [loading, setLoading] = useState<LoadingState>({ particles: true, content: true });
  const prefersReducedMotion = useReducedMotion();

  // Update particle initialization to handle loading
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
    setLoading(prev => ({ ...prev, particles: false }));
  }, []);

  // Add content loading effect
  useEffect(() => {
    setLoading(prev => ({ ...prev, content: false }));
  }, []);

  // Modify animation configurations based on reduced motion preference
  const motionConfig = {
    transition: prefersReducedMotion 
      ? { duration: 0 }
      : { duration: 0.5, type: "spring" },
    animate: prefersReducedMotion
      ? { opacity: 1 }
      : { opacity: 1, y: 0 },
  };

  // Add mouse follow effect
  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
      }
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener('mousemove', handleMouseMove);
      return () => hero.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Smooth scroll effect
  const scrollToSection = (e: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const renderSocialIcon = (icon: string) => {
    switch (icon) {
      case 'facebook':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
          </svg>
        );
      case 'youtube':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
          </svg>
        );
      case 'discord':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
        );
      case 'linkedin':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 }); // Default values

  // Add window size effect
  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Loading Overlay */}
      {(loading.particles || loading.content) && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            {/* Spinning Border */}
            <div className="absolute w-[300px] h-[300px] border-4 border-transparent border-t-yellow-500 rounded-full animate-spin" />
            {/* Larger Logo */}
            <div className="relative w-64 h-32">
              <Image
                src="/images/ascendantmarkets.png"
                alt="Ascendant Markets"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* Add will-change hints for GPU acceleration */}
      <style jsx global>{`
        .parallax-content {
          will-change: transform;
        }
        .animate-content {
          will-change: opacity, transform;
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* Background Patterns */}
      <div className="fixed inset-0 z-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(234, 179, 8, 0.15) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(234, 179, 8, 0.15) 2%, transparent 0%)`,
          backgroundSize: '100px 100px',
        }} />
      </div>

      {/* Floating Trading Symbols */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-500/10 text-4xl font-mono"
            initial={{
              x: (i % 5) * (windowSize.width / 5),
              y: Math.floor(i / 5) * (windowSize.height / 4),
              opacity: 0,
            }}
            animate={{
              y: [null, Math.floor(i / 5) * (windowSize.height / 4) + 100],
              opacity: [0, 0.2, 0],
            }}
            transition={{
              duration: 15 + (i % 5) * 2, // Slower duration, varied by position
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
          >
            {['BTC', 'ETH', 'EUR', 'USD', 'GBP', 'JPY', 'CHF', 'CAD'][i % 8]}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div ref={contentRef} className="relative z-10">
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 relative">
            {/* Mobile Menu Button */}
            <div className="md:hidden w-10">
              <button 
                className="text-white p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <div className="relative group">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-white hover:text-yellow-500 transition-colors flex items-center space-x-1"
                >
                  <span>Funding Programs</span>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-black border border-zinc-800 rounded-md shadow-lg py-1 z-50">
                    <Link href="/funding/gauntlet" className="block px-4 py-2 text-sm text-white hover:bg-zinc-800">
                      Gauntlet Challenge
                    </Link>
                    <Link href="/funding/ascendant" className="block px-4 py-2 text-sm text-white hover:bg-zinc-800">
                      Ascendant Challenge
                    </Link>
                    <Link href="/funding/standard" className="block px-4 py-2 text-sm text-white hover:bg-zinc-800">
                      Standard Challenge
                    </Link>
                  </div>
                )}
              </div>
              <div className="relative group">
                <button 
                  onClick={() => setIsInfoDropdownOpen(!isInfoDropdownOpen)}
                  className="text-white hover:text-yellow-500 transition-colors flex items-center space-x-1"
                >
                  <span>Information</span>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {isInfoDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-black border border-zinc-800 rounded-md shadow-lg py-1 z-50">
                    <Link href="/funding/terms" className="block px-4 py-2 text-sm text-white hover:bg-zinc-800">
                      Terms & Policies
                    </Link>
                    <Link href="/funding/contact" className="block px-4 py-2 text-sm text-white hover:bg-zinc-800">
                      Contact Us
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Logo Container */}
            <div className="flex-1 flex justify-center md:justify-end md:mr-[8%]">
              <Link href="/" className="relative w-40 sm:w-52 h-8">
                <Image
                  src="/images/ascendantmarkets.png"
                  alt="Ascendant Markets"
                  fill
                  className="object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Login Button (Desktop) */}
            <div className="hidden md:flex justify-end flex-1">
              <Link href="/login" className="px-4 py-2 border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors">
                Login
              </Link>
            </div>

            {/* Mobile Spacer */}
            <div className="w-10 md:hidden"></div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-black border-t border-zinc-800">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <div className="space-y-1">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full text-left px-3 py-2 text-white hover:bg-zinc-800 rounded-md"
                  >
                    Funding Programs
                  </button>
                  {isDropdownOpen && (
                    <div className="pl-4 space-y-1">
                      <Link href="/funding/gauntlet" className="block px-3 py-2 text-sm text-white hover:bg-zinc-800 rounded-md">
                        Gauntlet Challenge
                      </Link>
                      <Link href="/funding/ascendant" className="block px-3 py-2 text-sm text-white hover:bg-zinc-800 rounded-md">
                        Ascendant Challenge
                      </Link>
                      <Link href="/funding/standard" className="block px-3 py-2 text-sm text-white hover:bg-zinc-800 rounded-md">
                        Standard Challenge
                      </Link>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <button 
                    onClick={() => setIsInfoDropdownOpen(!isInfoDropdownOpen)}
                    className="w-full text-left px-3 py-2 text-white hover:bg-zinc-800 rounded-md"
                  >
                    Information
                  </button>
                  {isInfoDropdownOpen && (
                    <div className="pl-4 space-y-1">
                      <Link href="/funding/terms" className="block px-3 py-2 text-sm text-white hover:bg-zinc-800 rounded-md">
                        Terms & Policies
                      </Link>
                      <Link href="/funding/contact" className="block px-3 py-2 text-sm text-white hover:bg-zinc-800 rounded-md">
                        Contact Us
                      </Link>
                    </div>
                  )}
                </div>
                <Link href="/login" className="block px-3 py-2 text-white hover:bg-zinc-800 rounded-md">
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Add padding to account for fixed header */}
      <div className="pt-16">
        {/* Hero Section */}
        <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden -mt-16 md:mt-0">
          <div ref={parallaxRef} className="absolute inset-0 z-0">
            <Particles
              id="tsparticles"
              init={particlesInit}
              className="absolute inset-0"
              options={{
                background: {
                  color: {
                    value: "transparent",
                  },
                },
                fpsLimit: 120,
                particles: {
                  color: {
                    value: "#EAB308",
                  },
                  links: {
                    color: "#EAB308",
                    distance: 150,
                    enable: true,
                    opacity: 0.2,
                    width: 1,
                  },
                  move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                      default: "bounce",
                    },
                    random: true,
                    speed: 1,
                    straight: false,
                  },
                  number: {
                    density: {
                      enable: true,
                      area: 800,
                      factor: 1000,
                    },
                    value: 80,
                    limit: 0,
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
                      max: 0.3
                    },
                  },
                  shape: {
                    type: "circle",
                  },
                  size: {
                    value: { min: 1, max: 3 },
                  },
                },
                detectRetina: true,
                smooth: true,
              }}
            />
            {/* Keep gradient overlay for particles */}
            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/90 to-transparent" />
          </div>

          <div className="container mx-auto px-4 z-10">
            {/* Floating Achievement Badges */}
            <div className="flex justify-center gap-8 mb-12">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.2,
                    y: {
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut"
                    }
                  }}
                  className="text-center"
                >
                  <h3 className="text-sm md:text-4xl font-bold text-yellow-500 mb-1">{achievement.title}</h3>
                  <p className="text-[8px] md:text-sm text-gray-400">{achievement.subtitle}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
              >
                <span className="block">BECOME A</span>
                <span className="block text-yellow-500">FUNDED TRADER</span>
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl md:text-2xl mb-8 h-[60px]"
              >
                <TypeAnimation
                  sequence={[
                    'Get qualified by a proprietary trading fund',
                    2000,
                    'Trade with institutional grade conditions',
                    2000,
                    'Scale your account up to $4,000,000',
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                  className="text-gray-300"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="flex justify-center"
              >
                <Link href="/dashboard/challenge" className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                  <button className="relative px-8 py-4 bg-yellow-500 text-black text-lg md:text-xl font-bold rounded-lg transition-all duration-200 ease-out hover:shadow-xl hover:shadow-yellow-500/20 hover:-translate-y-1">
                    EARN FUNDING
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Statistics Section with enhanced transition */}
        <section className="relative py-12 bg-black overflow-hidden">
          <div className="absolute inset-x-0 -top-32 h-32 bg-gradient-to-b from-transparent to-black pointer-events-none" />
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {statistics.map((stat, index) => {
                const [ref, entry] = useIntersectionObserver({
                  threshold: 0.2,
                  root: null,
                  rootMargin: "0px",
                });

                return (
                  <Tilt
                    key={index}
                    tiltMaxAngleX={5}
                    tiltMaxAngleY={5}
                    perspective={1000}
                    scale={1.02}
                    transitionSpeed={1000}
                    gyroscope={true}
                  >
                    <motion.div
                      ref={ref}
                      initial={{ opacity: 0, y: 20 }}
                      animate={entry?.isIntersecting ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: index * 0.2, duration: 0.5 }}
                      className="relative bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800/50 hover:border-yellow-500/50 transition-all group"
                    >
                      {/* Floating Icon */}
                      <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: [-5, 5, -5] }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute -top-4 -right-4 bg-black/50 rounded-lg p-3 backdrop-blur-sm border border-zinc-800/50 group-hover:border-yellow-500/50 transition-all"
                      >
                        {statIcons[stat.icon as keyof typeof statIcons]}
                      </motion.div>

                      {/* Card Content */}
                      <div className="mt-4">
                        <motion.h3
                          initial={{ opacity: 0 }}
                          animate={entry?.isIntersecting ? { opacity: 1 } : {}}
                          transition={{ delay: index * 0.3 }}
                          className="text-2xl sm:text-3xl font-bold text-yellow-500 mb-3"
                        >
                          <CountUpAnimation end={stat.amount} />
                        </motion.h3>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={entry?.isIntersecting ? { opacity: 1 } : {}}
                          transition={{ delay: index * 0.4 }}
                          className="text-sm text-gray-400 mb-2"
                        >
                          {stat.label}
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={entry?.isIntersecting ? { opacity: 1 } : {}}
                          transition={{ delay: index * 0.5 }}
                          className="text-xs text-gray-500"
                        >
                          {stat.description}
                        </motion.p>
                      </div>

                      {/* Hover Effect Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-yellow-500/0 group-hover:from-yellow-500/5 group-hover:to-yellow-500/10 rounded-xl transition-all duration-500" />
                    </motion.div>
                  </Tilt>
                );
              })}
            </div>
          </div>
        </section>

        {/* Trading Instruments */}
        <section className="py-20 bg-black/90">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {tradingInstruments.map((instrument, index) => (
                <motion.div
                  key={instrument.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="text-yellow-500/90 group-hover:text-yellow-500 transition-colors duration-300 mb-4">
                    {instrument.icon}
                  </div>
                  <h3 className="text-sm font-medium text-zinc-400 group-hover:text-yellow-500 transition-colors duration-300">
                    {instrument.name}
                  </h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Funding Programs */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16">CHOOSE YOUR FUNDING PROGRAM</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'GAUNTLET',
                  image: '/images/gauntlet.png',
                  type: 'LOW COST PROGRAM',
                  description: 'Pay upon passing',
                  feature: 'Scale your account every milestone',
                  price: '$50',
                  tier: 'STARTER',
                  color: 'from-yellow-400/20 to-yellow-600/20',
                  href: '/funding/gauntlet'
                },
                {
                  name: 'ASCENDANT',
                  image: '/images/ascendant.png',
                  type: '1-STEP PROGRAM',
                  description: 'Get paid quickly',
                  feature: 'Double your account every milestone',
                  price: '$250',
                  tier: 'PREMIUM',
                  color: 'from-yellow-400/30 to-yellow-600/30',
                  href: '/funding/ascendant'
                },
                {
                  name: 'STANDARD',
                  image: '/images/standard.png',
                  type: '2-STEP PROGRAM',
                  description: 'Pay upon passing',
                  feature: 'Scale your account every milestone',
                  price: '$100',
                  tier: 'CLASSIC',
                  color: 'from-yellow-400/20 to-yellow-600/20',
                  href: '/funding/standard'
                }
              ].map((program, index) => {
                const [ref, entry] = useIntersectionObserver({
                  threshold: 0.2,
                  root: null,
                  rootMargin: "0px",
                });

                return (
                  <Tilt
                    key={program.name}
                    tiltMaxAngleX={7}
                    tiltMaxAngleY={7}
                    perspective={1000}
                    scale={1.02}
                    transitionSpeed={1000}
                    gyroscope={true}
                  >
                    <Link href={program.href} className="block">
                      <motion.div
                        ref={ref}
                        initial={{ opacity: 0, y: 20 }}
                        animate={entry?.isIntersecting ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: index * 0.2 }}
                        className="relative group"
                      >
                        {/* Animated Border */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy" />
                        
                        {/* Card Content */}
                        <div className="relative bg-black/50 backdrop-blur-sm rounded-lg p-8 text-center border border-zinc-800/50 hover:border-yellow-500/50 transition-all h-[500px] flex flex-col">
                          {/* Tier Indicator */}
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <motion.div
                              initial={{ y: 10, opacity: 0 }}
                              animate={entry?.isIntersecting ? { y: 0, opacity: 1 } : {}}
                              transition={{ delay: index * 0.3 }}
                              className="bg-black px-4 py-1 rounded-full border border-yellow-500/50"
                            >
                              <span className="text-sm font-medium text-yellow-500">{program.tier}</span>
                            </motion.div>
                          </div>

                          {/* Background Gradient */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg`} />

                          <div className="relative z-10 flex flex-col h-full">
                            {/* Program Name and Type */}
                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={entry?.isIntersecting ? { y: 0, opacity: 1 } : {}}
                              transition={{ delay: index * 0.5 }}
                              className="mb-6"
                            >
                              <h3 className="text-2xl font-bold text-yellow-500 mb-2">{program.name}</h3>
                              <p className="text-zinc-400">{program.type}</p>
                            </motion.div>

                            {/* Program Image */}
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={entry?.isIntersecting ? { scale: 1, opacity: 1 } : {}}
                              transition={{ delay: index * 0.4 }}
                              className="relative w-32 h-32 mx-auto mb-6 flex-grow"
                            >
                              <Image
                                src={program.image}
                                alt={`${program.name} Challenge`}
                                fill
                                className="object-contain"
                              />
                            </motion.div>

                            {/* Description and Button */}
                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={entry?.isIntersecting ? { y: 0, opacity: 1 } : {}}
                              transition={{ delay: index * 0.5 }}
                              className="mt-auto"
                            >
                              <p className="mb-4">{program.description}</p>
                              <p className="text-xs text-zinc-400 mb-4 whitespace-nowrap">{program.feature}</p>
                              <div className="relative group/button bg-yellow-500 text-black px-8 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-yellow-400 hover:scale-105">
                                <span className="relative z-10">STARTING FROM {program.price}</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-lg opacity-0 group-hover/button:opacity-100 transition-opacity duration-200" />
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </Tilt>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Accordion */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16">UNBEATABLE BENEFITS AND OPPORTUNITY</h2>
            <div className="max-w-3xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="mb-4"
                >
                  <button
                    onClick={() => setExpandedBenefit(expandedBenefit === benefit.title ? null : benefit.title)}
                    className="w-full flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm border border-zinc-800/50 hover:border-yellow-500/50 transition-all rounded-lg"
                  >
                    <span className="font-medium text-yellow-500">{benefit.title}</span>
                    <span className="text-2xl text-yellow-500">{expandedBenefit === benefit.title ? '−' : '+'}</span>
                  </button>
                  {expandedBenefit === benefit.title && (
                    <div className="p-4 bg-black/30 backdrop-blur-sm border border-zinc-800/50 rounded-b-lg mt-1">
                      <p className="text-gray-400">{benefit.content}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trader Benefits */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-8 mb-8 border border-zinc-800/50">
                <h3 className="text-2xl font-bold text-yellow-500 text-center mb-2">EXCLUSIVE</h3>
                <h4 className="text-xl text-center mb-8">ASCENDANT TRADER BENEFITS</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {traderBenefits.map((benefit, index) => (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-zinc-800/50 hover:border-yellow-500/50 transition-all"
                    >
                      <div className="h-1 w-12 bg-yellow-500 mb-4" />
                      <h5 className="font-medium mb-2 text-yellow-500">{benefit.title}</h5>
                      <p className="text-sm text-gray-400">{benefit.description}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-center gap-4 mt-8">
                  <button className="bg-yellow-500 text-black px-8 py-3 rounded-full font-medium hover:bg-yellow-400 transition-colors">
                    JOIN THE ACADEMY
                  </button>
                  <button className="border border-yellow-500 text-yellow-500 px-8 py-3 rounded-full font-medium hover:bg-yellow-500/10 transition-colors">
                    BECOME FUNDED
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

        {/* Add smooth scroll buttons */}
        <div className="fixed right-6 bottom-6 z-40 flex flex-col gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 bg-black/50 backdrop-blur-sm rounded-full border border-zinc-800 hover:border-yellow-500 transition-colors"
          >
            <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        </div>

      {/* Footer with Disclosures */}
      <footer className="bg-black text-gray-400 py-16 border-t border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {/* Risk Disclosure */}
            <div className="space-y-4">
              <h3 className="text-xl text-white font-bold">RISK DISCLOSURE:</h3>
              <p className="text-sm leading-relaxed">
                This is not an investment opportunity. You do not deposit any funds for investment. We do not ask for any funds for investment. At no time do you risk your own capital. There are no promises of rewards or returns.
              </p>
            </div>

            {/* Hypothetical Performance Disclosure */}
            <div className="space-y-4">
              <h3 className="text-xl text-white font-bold">HYPOTHETICAL PERFORMANCE DISCLOSURE:</h3>
              <p className="text-sm leading-relaxed">
                Hypothetical performance results have many inherent limitations, some of which are described below. No representation is being made that any account will or is likely to achieve profits or losses similar to those shown. In fact, there are frequently sharp differences between hypothetical performance results and the actual results subsequently achieved by any particular trading program. One of the limitations of hypothetical performance results is that they are generally prepared with the benefit of hindsight. In addition, hypothetical trading does not involve financial risk, and no hypothetical trading record can completely account for the impact of financial risk of actual trading. For example, the ability to withstand losses or to adhere to a particular trading program in spite of trading losses is material points, which can also adversely affect actual trading results. There are numerous other factors related to the markets in general or to the implementation of any specific trading program, which cannot be fully accounted for in the preparation of hypothetical performance results and all of which can adversely affect trading results. Testimonials appearing on this website may not be representative of other clients or customers and are not a guarantee of future performance or success.
              </p>
            </div>

            {/* Available Instruments */}
            <div className="space-y-4">
              <h3 className="text-xl text-white font-bold">AVAILABLE INSTRUMENTS:</h3>
              <p className="text-sm leading-relaxed">
                Ascendant Markets customers are allowed to only trade Forex, indices, commodities, stocks, and crypto products. Trading of Options, and Futures are not permitted or available in our programs vendors or platforms.
              </p>
            </div>

            {/* Evaluation Disclaimer */}
            <div className="space-y-4">
              <h3 className="text-xl text-white font-bold">EVALUATION DISCLAIMER:</h3>
              <p className="text-sm leading-relaxed">
                The customer pass rate of the evaluation program was 39.93% between December 1, 2024 – Jan 1, 2025, who traded at least one evaluation and obtained a Ascendant Traders Account during this time period. The Evaluation and PA are meant to be as close to a realistic simulation of trading under actual market conditions, including commissions, to mimic real market conditions, and the evaluation is difficult to pass even for experienced traders. The event is not meant to train the customer to be better but to be a challenge to pass. The Evaluation is not suggested for individuals with little to no trading experience.
              </p>
            </div>

            {/* Customer Compensation Disclosure */}
            <div className="space-y-4">
              <h3 className="text-xl text-white font-bold">CUSTOMER COMPENSATION DISCLOSURE:</h3>
              <p className="text-sm leading-relaxed">
                All trades presented for compensation to customers should be considered hypothetical and should not be expected to be replicated in a live trading account. Ascendant Traders Accounts may represent simulated accounts or live or copied accounts. Testimonials and payouts appearing on this website may not be representative of other clients or customers and are not a guarantee of future performance or success.
              </p>
            </div>

            {/* Copyright and Social Links */}
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-zinc-800">
              <p className="text-sm mb-4 md:mb-0">© 2022-2030, Ascendant Markets LTD. All rights reserved.</p>
              <div className="flex space-x-6">
                {socialLinks.map((link) => (
                  <Link 
                    key={link.icon}
                    href={link.href} 
                    target="_blank" 
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                    aria-label={link.label}
                  >
                    {renderSocialIcon(link.icon)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
} 