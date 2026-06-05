'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Check } from 'lucide-react';

// ─── HEADER / NAV ─────────────────────────────────────────────────────────────

function Header() {
  return (
    <header className="relative z-50 bg-black/90 backdrop-blur-md border-b border-[#FFC62D]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="w-20" />
          <div className="flex items-center justify-center">
            <Image
              src="/images/5.webp"
              alt="Ascendant Academy"
              width={200}
              height={200}
              className="rounded-full"
            />
          </div>
          <div className="w-20 flex justify-end"></div>
        </div>
      </div>
    </header>
  );
}

// ─── GOLD DIVIDER ─────────────────────────────────────────────────────────────

function GoldDivider() {
  return (
    <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FFC62D]/40 to-transparent my-2" />
  );
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-black">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#FFC62D]/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-20 sm:py-28 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black leading-[1.08] uppercase mb-6"
        >
          <span className="block text-white">WE TRANSFORM</span>
          <span className="block text-[#e42326]">UNPROFITABLE TRADERS</span>
          <span className="block">
            <span className="text-white">INTO </span>
            <span className="text-[#FFC62D]">PROP TRADERS.</span>
          </span>
        </motion.h1>
   
   

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[#FFC62D]/80 text-sm sm:text-base tracking-[0.3em] uppercase font-semibold mb-10"
        >
          AN EXCLUSIVE COMMUNITY
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <a href="#pricing">
            <button className="border border-[#FFC62D] text-[#FFC62D] px-10 py-3.5 rounded text-sm font-bold tracking-[0.2em] uppercase hover:bg-[#FFC62D]/10 hover:shadow-[0_0_30px_rgba(255,198,45,0.3)] transition-all duration-300">
              JOIN NOW
            </button>
          </a>
        </motion.div>

        {/* Down arrow */}
        <div className="flex justify-center mt-16 sm:mt-20">
          <div className="animate-arrow-bounce text-[#FFC62D]/70">
            <svg width="80" height="80" viewBox="0 0 40 40" fill="none">
              <path d="M20 8 L20 32 M10 22 L20 32 L30 22" stroke="#FFC62D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FEATURE CARD ─────────────────────────────────────────────────────────────

interface FeatureCardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

function FeatureCard({ title, description, children }: FeatureCardProps) {
  return (
    <div className="bg-black border border-[#FFC62D]/10 rounded-2xl p-7 sm:p-9 text-center hover:border-[#FFC62D]/30 hover:shadow-[0_0_40px_rgba(255,198,45,0.08)] transition-all duration-400 group">
      <h3 className="text-[#FFC62D] font-black text-xl sm:text-2xl tracking-widest uppercase mb-4">
        {title}
      </h3>
      <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
        {description}
      </p>
      {children && <div className="mt-8">{children}</div>}
    </div>
  );
}

// ─── PAYOUT CARDS CLUSTER ─────────────────────────────────────────────────────

function PayoutCluster() {
  return (
    <div className="relative flex items-center justify-center h-[280px] sm:h-[320px] w-full mt-4">
      {/* Left payout certificate */}
      <div className="absolute left-0 sm:left-4 z-10 w-[140px] sm:w-[180px] rotate-[-8deg] top-4 shadow-xl">
        <div className="bg-[#111] border border-[#FFC62D]/30 rounded-xl overflow-hidden">
          <Image
            src="/assets/payout-left.png"
            alt="Payout Certificate"
            width={180}
            height={220}
            className="object-cover w-full"
          />
        </div>
      </div>

      {/* Center challenge card */}
      <div className="relative z-20 w-[160px] sm:w-[200px] shadow-2xl">
        <div className="bg-[#111] border-2 border-[#FFC62D]/50 rounded-xl overflow-hidden animate-gold-glow">
          <Image
            src="/assets/challenge-card.png"
            alt="50K Challenge Account"
            width={200}
            height={250}
            className="object-cover w-full"
          />
        </div>
      </div>

      {/* Right payout certificate */}
      <div className="absolute right-0 sm:right-4 z-10 w-[140px] sm:w-[180px] rotate-[8deg] top-4 shadow-xl">
        <div className="bg-[#111] border border-[#FFC62D]/30 rounded-xl overflow-hidden">
          <Image
            src="/assets/payout-right.png"
            alt="Payout Certificate"
            width={180}
            height={220}
            className="object-cover w-full"
          />
        </div>
      </div>
    </div>
  );
}

// ─── WHAT YOU GET SECTION ─────────────────────────────────────────────────────

function WhatYouGetSection() {
  return (
    <section className="bg-black py-20 sm:py-28 px-4">
      <GoldDivider />
      <div className="max-w-4xl mx-auto pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-white text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight">
            HERE&apos;S WHAT YOU GET
          </h2>
          <p className="text-[#FFC62D] text-xs tracking-[0.3em] uppercase font-semibold mt-4">
            WHAT&apos;S INCLUDED IN THE ACADEMY?
          </p>
        </motion.div>
   

        <div className="flex flex-col">
          {/* Card 1 — Live Education */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <FeatureCard
              title="LIVE EDUCATION"
              description="Join Penny for personalized LIVE Zoom sessions where you can learn, ask questions, and improve your trading. All sessions are recorded so you can rewatch them anytime."
            >
              <div className="relative w-full max-w-lg mx-auto rounded-xl overflow-hidden">
                <Image
                  src="/newlandingpics/liveedu.png"
                  alt="Live Education Sessions"
                  width={600}
                  height={360}
                  className="object-cover w-full"
                />
              </div>
            </FeatureCard>
          </motion.div>

          <div className="py-12"><GoldDivider /></div>

          {/* Card 2 — Discord access */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FeatureCard
              title="ACCESS TO THE DISCORD"
              description="You'll instantly be invited to the Premium side of the Discord. This is the only way to join."
            >
              <div className="relative w-full max-w-lg mx-auto rounded-xl overflow-hidden">
                <Image
                  src="/newlandingpics/discord.png"
                  alt="Discord Community"
                  width={600}
                  height={360}
                  className="object-cover w-full"
                />
              </div>
            </FeatureCard>
          </motion.div>

          <div className="py-12"><GoldDivider /></div>

          {/* Card 3 — 50K Funded Account */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <FeatureCard
              title="50K FUNDED ACCOUNT"
              description="By joining the Discord group, you will receive access to a $50K USD evaluation account challenge."
            >
              <div className="relative w-full max-w-lg mx-auto rounded-xl overflow-hidden">
                <Image
                  src="/newlandingpics/50kacc.png"
                  alt="50K Funded Account Challenge"
                  width={600}
                  height={360}
                  className="object-cover w-full"
                />
              </div>
            </FeatureCard>
          </motion.div>

          <div className="py-12"><GoldDivider /></div>

          {/* Card 4 — Giveaways */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <FeatureCard
              title="EXCLUSIVE GIVEAWAYS / REWARDS PROGRAM"
              description="You'll be invited to private member-only rewards and giveaways, with monthly opportunities available exclusively to active students."
            />
          </motion.div>

            {/* JOIN THE GROUP CTA after 50K card */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center gap-8 py-12"
          >
            <a href="#pricing">
              <button className="border-2 border-[#FFC62D] text-[#FFC62D] px-12 sm:px-16 py-4 sm:py-5 rounded-lg text-base sm:text-lg font-black tracking-[0.2em] uppercase hover:bg-[#FFC62D]/10 hover:shadow-[0_0_60px_rgba(255,198,45,0.35)] transition-all duration-300">
                JOIN THE GROUP!
              </button>
            </a>
            <p className="text-[#FFC62D]/60 text-xs italic">Limited Spots Available</p>
            <div className="animate-arrow-bounce text-[#FFC62D]/60 mt-1">
              <svg width="64" height="64" viewBox="0 0 40 40" fill="none">
                <path d="M20 8 L20 32 M10 22 L20 32 L30 22" stroke="#FFC62D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── EVERYTHING INCLUDED ACCORDION ───────────────────────────────────────────

interface AccordionItemProps {
  label: string;
  description: string;
}

function AccordionItem({ label, description }: AccordionItemProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#FFC62D]/15">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 text-left group"
      >
        <span className="text-white text-sm sm:text-base font-semibold tracking-wide group-hover:text-[#FFC62D] transition-colors duration-200">
          {label}
        </span>
        <span className="text-[#FFC62D] ml-4 flex-shrink-0">
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-gray-400 text-sm pb-4 pr-8 leading-relaxed">
              {description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const leftItems: AccordionItemProps[] = [
  { label: 'Trading Live Room', description: 'Join live trading sessions with experienced traders and watch real-time setups unfold.' },
  { label: 'Psychology Videos', description: 'Master the mental game of trading with curated psychology content designed to build discipline.' },
  { label: 'Weekly QNA / Weekend Development', description: 'Participate in weekly Q&A sessions and weekend development calls to sharpen your edge.' },
  { label: 'Community Chat', description: 'Engage with fellow traders in our active community chat, share ideas, and stay motivated.' },
  { label: 'Exclusive Chat Rooms', description: 'Access members-only channels for premium signals, advanced strategies, and direct interaction with mentors.' },
  { label: 'Access To Courses', description: 'Unlock a growing library of structured trading courses covering everything from basics to advanced strategies.' },
];

const rightItems: AccordionItemProps[] = [
  { label: 'LiveStreams', description: 'Watch live market analysis sessions streamed directly in the community, available to replay anytime.' },
  { label: 'Feedback / QNA', description: 'Get direct feedback on your trades and strategies from mentors during dedicated Q&A sessions.' },
  { label: 'Member Exclusive Giveaways', description: 'Participate in exclusive giveaways reserved only for active community members.' },
  { label: 'EOD Markups', description: 'Receive end-of-day markup breakdowns showing key levels, setups, and what to watch tomorrow.' },
  { label: 'Weekly Outlooks', description: 'Receive weekly market outlooks covering major pairs and instruments to plan your trading week.' },
  { label: 'Recorded Live Sessions', description: 'Every live session is recorded so you never miss a lesson, no matter your schedule.' },
];

function EverythingIncludedSection() {
  return (
    <section className="bg-black py-20 sm:py-28 px-4">
      <GoldDivider />
      <div className="max-w-5xl mx-auto pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-white text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight">
            EVERYTHING INCLUDED
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-16"
        >
          <div>
            {leftItems.map((item) => (
              <AccordionItem key={item.label} label={item.label} description={item.description} />
            ))}
          </div>
          <div>
            {rightItems.map((item) => (
              <AccordionItem key={item.label} label={item.label} description={item.description} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="bg-black py-20 sm:py-28 px-4">
      <GoldDivider />
      <div className="max-w-4xl mx-auto pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-white text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight">
            PRICING
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 items-stretch">

          {/* Card 1 — Ascendant Academy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex"
          >
            <div className="flex-1 bg-[#0a0a0a] border border-white/12 rounded-2xl p-8 sm:p-10 flex flex-col text-center hover:border-white/25 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] transition-all duration-400">

              {/* Title */}
              <p className="text-white font-black text-lg sm:text-xl tracking-widest uppercase mb-1">
                ASCENDANT ACADEMY
              </p>
              <p className="text-gray-500 text-xs mb-7">Best for new & growing traders</p>

              {/* Price */}
              <div className="flex items-start justify-center gap-1 mb-8">
                <span className="text-gray-400 text-lg font-bold mt-2">$</span>
                <span className="text-6xl sm:text-7xl font-black text-white leading-none">10</span>
                <span className="text-gray-500 text-sm self-end mb-2">/ Month</span>
              </div>

              {/* CTA */}
              <a
                href="https://whop.com/ascendant-trading/ascendant-academy-join/"
                target="_blank"
                rel="noopener noreferrer"
                className="block mb-8"
              >
                <button className="w-full py-4 rounded-xl font-bold text-sm tracking-[0.15em] uppercase border border-white/30 text-white hover:bg-white/8 hover:border-white/50 transition-all duration-300">
                  JOIN NOW
                </button>
              </a>

              {/* Features */}
              <ul className="flex flex-col gap-4 text-left">
                {[
                  'Live trading sessions with PennyPips',
                  'Free beginner trading course',
                  'Community Discord access',
                  'Daily market recaps & recordings',
                  'Trade tracker & analytics dashboard',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-400">
                    <Check size={14} className="text-gray-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Card 2 — Platinum Access */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex"
          >
            <div className="flex-1 relative bg-[#0a0a0a] border-2 border-[#FFC62D]/50 rounded-2xl p-8 sm:p-10 flex flex-col text-center shadow-[0_0_50px_rgba(255,198,45,0.12)] hover:shadow-[0_0_80px_rgba(255,198,45,0.25)] transition-all duration-400">

             

              {/* Title */}
              <p className="text-[#FFC62D] font-black text-lg sm:text-xl tracking-widest uppercase mb-1 mt-1">
                PLATINUM ACCESS
              </p>
              <p className="text-gray-500 text-xs mb-7">For serious traders</p>

              {/* Price */}
              <div className="flex items-start justify-center gap-1 mb-8">
                <span className="text-[#FFC62D]/70 text-lg font-bold mt-2">$</span>
                <span className="text-6xl sm:text-7xl font-black text-[#FFC62D] leading-none">100</span>
                <span className="text-gray-500 text-sm self-end mb-2">/ Month</span>
              </div>

              {/* CTA */}
              <a
                href="https://whop.com/ascendant-trading/ascendantplatjoin/"
                target="_blank"
                rel="noopener noreferrer"
                className="block mb-8"
              >
                <button className="w-full py-4 rounded-xl font-black text-sm tracking-[0.15em] uppercase bg-[#FFC62D] text-black hover:bg-[#FFD966] hover:shadow-[0_0_40px_rgba(255,198,45,0.55)] transition-all duration-300">
                  JOIN PLATINUM
                </button>
              </a>

              {/* Features */}
              <ul className="flex flex-col gap-4 text-left">
                {[
                  'Everything in Ascendant Academy',
                  'FREE $50K challenge account',
                  'Weekly elite roundtable with Penny',
                  'Private Platinum Discord sections',
                  'Priority support & direct access',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-300">
                    <Check size={14} className="text-[#FFC62D] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <p className="text-[#FFC62D]/50 text-xs mt-6 italic">
                $50K challenge included.
              </p>
         
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// ─── FAQ SECTION ──────────────────────────────────────────────────────────────

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#FFC62D]/15">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-5 text-left group"
      >
        <span className="text-white text-sm sm:text-base font-semibold pr-6 group-hover:text-[#FFC62D] transition-colors duration-200">
          {question}
        </span>
        <span className="text-[#FFC62D] flex-shrink-0">
          {open ? <Minus size={18} /> : <Plus size={18} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="faq-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-gray-400 text-sm pb-5 leading-relaxed pr-8">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const faqs: FAQItemProps[] = [
  {
    question: 'Is the academy suitable for beginners?',
    answer:
      "Absolutely. The academy is designed for traders at all levels. Whether you're brand new to the markets or looking to refine your strategy, our live sessions and course material will meet you where you are.",
  },
  {
    question: 'Am I locked into a payment duration?',
    answer:
      'No. Our monthly plan gives you full flexibility with no long-term commitment. You can choose to upgrade to annual for better value at any time.',
  },
  {
    question: 'I work full-time, is this suitable for me?',
    answer:
      'Yes. All live sessions are recorded and available to rewatch at any time. You can learn at your own pace and fit the academy around your schedule.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      "Yes. Monthly subscribers can cancel at any time without penalty. Simply cancel before your next billing date and you won't be charged again.",
  },
  {
    question: 'Do you have any incentives if I refer a friend?',
    answer:
      'Yes! We have an exclusive rewards program for members who refer friends. Details are available inside the community after you join.',
  },
  {
    question: 'What form of payments are accepted?',
    answer:
      'We accept all major credit and debit cards, as well as select cryptocurrency payment methods. All transactions are processed securely.',
  },
  {
    question: 'Do you offer a guarantee?',
    answer:
      'We are confident in the value we provide. Please refer to our refund policy for full details on our satisfaction terms.',
  },
  {
    question: "I've spent thousands on courses and didn't learn anything. How are you different?",
    answer:
      'Unlike pre-recorded course packs, our academy focuses on live, interactive education. You get real-time feedback, live trading rooms, and a community of traders all growing together — not just a folder of videos.',
  },
  {
    question: 'Do I actually get a challenge when I sign up?',
    answer:
      'Yes. Every member gets access to a $50K funded account evaluation challenge as part of their membership. Annual members receive access to a $500K evaluation challenge.',
  },
];

function FAQSection() {
  return (
    <section className="bg-black py-20 sm:py-28 px-4">
      <GoldDivider />
      <div className="max-w-3xl mx-auto pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-white text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight">
            FAQS
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {faqs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── LANDING FOOTER ───────────────────────────────────────────────────────────

function LandingFooter() {
  const tickerText = 'MARKET ROBBERS 💰';
  const tickerItems = Array(12).fill(tickerText);

  return (
    <footer className="bg-gradient-to-b from-[#0a0800] via-[#0d0a00] to-[#000000]">
      {/* Ticker bar at top of footer */}
      <div className="border-t border-[#FFC62D]/30 border-b border-b-[#FFC62D]/10 overflow-hidden py-2.5">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span
              key={i}
              className="text-[#FFC62D] font-bold text-xs tracking-[0.2em] mx-10 uppercase"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="px-4 pt-12 pb-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/images/5.webp"
              alt="Ascendant Academy"
              width={200}
              height={200}
              className="rounded-full"
            />
          </div>

          <GoldDivider />

          {/* Disclaimer */}
          <p className="mt-8 text-gray-500 text-xs leading-relaxed max-w-2xl mx-auto">
            GENERAL DISCLAIMER: This site and its products are for educational purposes only and should
            not be considered financial advice. Trading involves risk and past performance is not
            indicative of future results.
          </p>

          {/* Copyright */}
          <p className="mt-4 text-gray-600 text-xs">
            Copyright {new Date().getFullYear()} Ascendant Academy LTD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function NewLandingPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <HeroSection />
      <WhatYouGetSection />
      {/* <EverythingIncludedSection /> */}
      {/* <FAQSection /> */}
      <PricingSection />
      <LandingFooter />
    </main>
  );
}
