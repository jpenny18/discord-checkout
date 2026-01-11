'use client';

import {
  BookOpenIcon,
  ArrowRightIcon,
  CalculatorIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TradingToolsPage() {
  const tools = [
    {
      title: 'Trading Journal',
      description: 'Track trades, analyze performance, and project future growth',
      icon: BookOpenIcon,
      href: '/dashboard/trading-tools/journal',
      iconColor: 'text-blue-400'
    },
    {
      title: 'Position Size Calculator',
      description: 'Calculate optimal position sizes based on your risk parameters',
      icon: CalculatorIcon,
      href: '/dashboard/trading-tools/calculator',
      iconColor: 'text-[#ffc62d]'
    }
  ];

  return (
    <div className="min-h-screen bg-[#09090b]" style={{ '--color-white': '#ffffff' } as React.CSSProperties}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Trading Tools</h1>
          <p className="text-gray-400">Access your essential trading tools and resources</p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link href={tool.href}>
                  <div 
                    className="group relative h-full rounded-2xl border p-8 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                    style={{
                      backgroundColor: 'color-mix(in oklab, var(--color-white) 3%, transparent)',
                      borderColor: 'color-mix(in oklab, var(--color-white) 8%, transparent)',
                      filter: 'drop-shadow(0px 0px 10px rgba(0, 0, 0, .3))'
                    }}
                  >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full group-hover:bg-white/10 transition-all duration-500"></div>
                    
                    <div className="relative z-10">
                      {/* Icon */}
                      <div 
                        className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                        style={{
                          backgroundColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)',
                          borderColor: 'color-mix(in oklab, var(--color-white) 10%, transparent)'
                        }}
                      >
                        <Icon className={`w-8 h-8 ${tool.iconColor}`} />
                      </div>

                      {/* Content */}
                      <h2 className="text-2xl font-bold text-white mb-3">{tool.title}</h2>
                      <p className="text-gray-400 mb-6">{tool.description}</p>

                      {/* Arrow Button */}
                      <div className="flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all duration-300">
                        <span>Open Tool</span>
                        <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 