'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Users } from 'lucide-react';

interface FlipBlueprintHeaderProps {
  variant?: 'main' | 'webinar';
}

export default function FlipBlueprintHeader({ variant = 'main' }: FlipBlueprintHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Different navigation items based on variant
  const getNavigationItems = () => {
    if (variant === 'webinar') {
      return {
        leftNav: [
          { href: '/flip-blueprint', label: 'Back to Course' },
          { href: '#results', label: 'Results' }
        ],
        ctaText: 'Access MasterClass',
        ctaHref: '#access-masterclass'
      };
    } else {
      return {
        leftNav: [
          { 
            href: '#how-it-works', 
            label: 'How It Works',
            onClick: (e: React.MouseEvent) => {
              e.preventDefault();
              const element = document.getElementById('how-it-works');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }
          },
          { href: '#how-it-works', label: 'Results' }
        ],
        ctaText: 'Get Started',
        ctaHref: '/flip-blueprint/intro-webinar'
      };
    }
  };

  const navigation = getNavigationItems();

  return (
    <header className="relative z-50">
      {/* Top Banner */}
      <a 
        href="#call-booking" 
        className="block bg-blue-600 text-white py-2 hover:bg-blue-700 transition-colors"
        onClick={(e) => {
          e.preventDefault();
          const element = document.getElementById('call-booking');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        <div className="max-w-7xl mx-auto px-8 md:px-4 text-center">
          <span className="text-[9px] md:text-sm font-semibold">
            Not sure where to start? Book an Exploration Call Here &gt;
          </span>
        </div>
      </a>

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
          <div className="flex items-center justify-between h-16">
          {/* Logo */}
            <Link href="/flip-blueprint" className="flex items-center space-x-2 md:space-x-3">
            <Image
              src="/images/logo.png"
              alt="Ascendant Academy Logo"
              width={32}
              height={32}
                className="rounded-full md:w-10 md:h-10"
            />
              <div className="flex flex-col">
                <span className="font-bold text-sm md:text-xl text-white">ASCENDANT ACADEMY</span>
                <span className="text-[8px] md:text-[11px] text-[#ffc62d]/75 -mt-1">LEARN AND ASCEND TO NEW HEIGHTS</span>
              </div>
          </Link>

            {/* Desktop Navigation & CTA Button */}
            <div className="hidden lg:flex items-center space-x-6">
            {navigation.leftNav.map((item, index) => (
              <a 
                key={index}
                href={item.href} 
                className="text-gray-300 hover:text-[#ffc62d] transition-colors text-sm"
                onClick={item.onClick}
              >
                {item.label}
              </a>
            ))}
              <div className="relative group">
                <button className="text-gray-300 hover:text-[#ffc62d] transition-colors text-sm flex items-center">
                  Products
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {/* Dropdown would go here */}
              </div>
              <div className="flex items-center space-x-1 text-gray-300 hover:text-[#ffc62d] transition-colors cursor-pointer">
                <Users className="w-3 h-3" />
                <span className="text-sm">Student Login</span>
          </div>
            <Link 
              href={navigation.ctaHref} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors border border-blue-700"
            >
              {navigation.ctaText}
            </Link>
          </div>

            {/* Mobile Menu Button Only */}
            <div className="lg:hidden flex items-center space-x-2">
              <Link 
                href={navigation.ctaHref} 
                className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-blue-700 transition-colors border border-blue-700"
              >
                {navigation.ctaText}
              </Link>

          {/* Mobile Menu Button */}
          <button
                className="text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
            </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-[#232323] py-4"
          >
              <div className="flex flex-col space-y-4">
              {navigation.leftNav.map((item, index) => (
                <a 
                  key={index}
                  href={item.href} 
                  className="text-gray-300 hover:text-[#ffc62d] transition-colors text-sm"
                  onClick={item.onClick}
                >
                  {item.label}
                </a>
              ))}
              <a href="#features" className="text-gray-300 hover:text-[#ffc62d] transition-colors text-sm">
                  Products
              </a>
                <div className="flex items-center space-x-2 text-gray-300 hover:text-[#ffc62d] transition-colors">
                  <Users className="w-3 h-3" />
                  <span className="text-sm">Student Login</span>
                </div>
            </div>
          </motion.div>
        )}
        </div>
      </nav>
    </header>
  );
}
