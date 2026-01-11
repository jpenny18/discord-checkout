'use client';

import { motion } from 'framer-motion';
import { 
  BuildingLibraryIcon, 
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Partner {
  name: string;
  type: 'Broker' | 'Prop Firm' | 'Platform';
  description: string;
  myExperience: string;
  benefits: string[];
  referralCode?: string;
  referralLink: string;
  logo?: string;
  rating: number;
}

export default function PartnersPage() {
  const partners: Partner[] = [
    {
      name: 'Fusion Markets',
      type: 'Broker',
      description: 'Premium CFD broker with ultra-low spreads and institutional-grade execution',
      myExperience: "Fusion Markets has become my primary broker for retail trading. Their spreads are among the tightest I've seen, execution is lightning-fast, and their platform is rock-solid. What sets them apart is their genuine ECN model and transparent pricing structure. I've been using them consistently and they've never let me down.",
      benefits: [
        'Raw spreads from 0.0 pips',
        'Ultra-fast execution with no requotes',
        'Regulated by ASIC and VFSC',
        'No restrictions on trading strategies',
        'MT4, MT5, cTrader, and DupliTrade',
        'Excellent customer support',
        'Low minimum deposit requirements'
      ],
      referralLink: 'https://fusionmarkets.com/?refcode=104504',
      rating: 5
    },
    // Hidden partners - uncomment to show
    // {
    //   name: 'FTMO',
    //   type: 'Prop Firm',
    //   description: 'Industry-leading prop firm with transparent rules and fast payouts',
    //   myExperience: "I've personally passed multiple FTMO challenges and received consistent payouts. Their platform is transparent, rules are clear, and support is responsive. They're one of the most trusted names in prop trading.",
    //   benefits: [
    //     'Up to $200,000 in trading capital',
    //     'Up to 90% profit split',
    //     'No time limits on funded accounts',
    //     'Trade multiple accounts simultaneously',
    //     'Transparent evaluation process'
    //   ],
    //   referralLink: 'https://ftmo.com',
    //   referralCode: 'ASCENDANT10',
    //   rating: 5
    // },
    // {
    //   name: 'Trading View',
    //   type: 'Platform',
    //   description: 'Professional charting platform with advanced analysis tools',
    //   myExperience: "I've been using TradingView for over 5 years for all my chart analysis. The indicators, drawing tools, and multi-timeframe analysis are unmatched. It's an essential tool in my daily trading routine.",
    //   benefits: [
    //     'Advanced charting and technical analysis',
    //     'Real-time data for multiple markets',
    //     'Custom indicators and strategies',
    //     'Social trading community',
    //     'Alerts and notifications'
    //   ],
    //   referralLink: 'https://tradingview.com',
    //   referralCode: 'ASCENDANT',
    //   rating: 5
    // },
    // {
    //   name: 'The Funded Trader',
    //   type: 'Prop Firm',
    //   description: 'Flexible prop firm with various account sizes and rules',
    //   myExperience: "Great alternative to FTMO with more flexible rules. I've passed their challenges and appreciate their trader-friendly approach. They offer different challenge types to match your trading style.",
    //   benefits: [
    //     'Account sizes up to $600,000',
    //     '80-90% profit split',
    //     'Multiple challenge types',
    //     'Fast verification process',
    //     'Active trading community'
    //   ],
    //   referralLink: 'https://thefundedtrader.com',
    //   referralCode: 'ASCENDANT15',
    //   rating: 4.5
    // }
  ];

  return (
    <div className="min-h-screen bg-[#09090b]" style={{ '--color-white': '#ffffff' } as React.CSSProperties}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div 
              className="p-3 rounded-xl"
              style={{
                backgroundColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)',
              }}
            >
              <ShieldCheckIcon className="w-8 h-8 text-[#ffc62d]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Trusted Partners</h1>
              <p className="text-gray-400 mt-1">Brokers and platforms I personally use and recommend</p>
            </div>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border p-4 mb-8"
            style={{
              backgroundColor: 'color-mix(in oklab, var(--color-white) 3%, transparent)',
              borderColor: 'color-mix(in oklab, var(--color-white) 8%, transparent)',
            }}
          >
            <div className="flex items-start gap-3">
              <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1">Why I Only Recommend What I Use</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Every platform listed here is one I personally use or have used extensively in my own trading. 
                  I don't promote services just for commissions – these are the tools and platforms that have helped 
                  me succeed in trading, and I believe they can help you too. When you use my referral links, you 
                  often get exclusive discounts while supporting this academy.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Partners Grid */}
        <div className="space-y-6">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              className="rounded-2xl border overflow-hidden"
              style={{
                backgroundColor: 'color-mix(in oklab, var(--color-white) 3%, transparent)',
                borderColor: 'color-mix(in oklab, var(--color-white) 8%, transparent)',
                filter: 'drop-shadow(0px 0px 10px rgba(0, 0, 0, .3))'
              }}
            >
              <div className="p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-white">{partner.name}</h2>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#ffc62d]/10 text-[#ffc62d] border border-[#ffc62d]/30">
                        {partner.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(partner.rating)
                              ? 'fill-[#ffc62d] text-[#ffc62d]'
                              : i < partner.rating
                              ? 'fill-[#ffc62d]/50 text-[#ffc62d]/50'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-400 ml-2">{partner.rating}/5</span>
                    </div>
                    <p className="text-gray-400">{partner.description}</p>
                  </div>

                  {/* CTA Button - Desktop */}
                  <div className="hidden md:block flex-shrink-0">
                    <a
                      href={partner.referralLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ffc62d] text-black font-semibold hover:bg-[#e5b228] transition-all duration-300 hover:scale-105"
                    >
                      Get Started
                      <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* My Experience */}
                <div 
                  className="rounded-xl p-4 mb-6"
                  style={{
                    backgroundColor: 'color-mix(in oklab, var(--color-white) 2%, transparent)',
                    borderColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)',
                  }}
                >
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <BuildingLibraryIcon className="w-5 h-5 text-[#ffc62d]" />
                    My Experience
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed italic">
                    "{partner.myExperience}"
                  </p>
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3">Key Benefits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {partner.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Referral Code */}
                {partner.referralCode && (
                  <div 
                    className="rounded-xl p-4 mb-6"
                    style={{
                      backgroundColor: 'color-mix(in oklab, var(--color-white) 2%, transparent)',
                      borderColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)',
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Exclusive Referral Code</p>
                        <code className="text-[#ffc62d] font-mono text-lg font-bold">{partner.referralCode}</code>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(partner.referralCode || '');
                          // Optional: Add toast notification here
                        }}
                        className="px-4 py-2 rounded-lg bg-[#ffc62d]/10 text-[#ffc62d] text-sm font-medium hover:bg-[#ffc62d]/20 transition-colors"
                      >
                        Copy Code
                      </button>
                    </div>
                  </div>
                )}

                {/* CTA Button - Mobile */}
                <div className="md:hidden">
                  <a
                    href={partner.referralLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-[#ffc62d] text-black font-semibold hover:bg-[#e5b228] transition-all duration-300"
                  >
                    Get Started
                    <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-4 rounded-xl border"
          style={{
            backgroundColor: 'color-mix(in oklab, var(--color-white) 2%, transparent)',
            borderColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)',
          }}
        >
          <p className="text-gray-500 text-xs leading-relaxed">
            <strong>Disclaimer:</strong> Trading involves risk and may not be suitable for all investors. 
            The information provided is for educational purposes only and should not be considered as financial advice. 
            When you use affiliate links, I may earn a commission at no extra cost to you. All opinions expressed are 
            my own and based on my personal experience with these platforms.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
