'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { AcademicCapIcon, TrophyIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';

interface Stats {
  totalLessonsCompleted: number;
  activeSubscription: boolean;
  subscriptionTier: string;
  lastActive: string;
}

export default function DashboardPage() {
  const { user, userProfile } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Fetch user stats
        const statsDoc = await getDoc(doc(db, 'userStats', user.uid));
        if (statsDoc.exists()) {
          setStats(statsDoc.data() as Stats);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ffc62d] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-10 relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-radial from-[#ffc62d]/10 to-transparent opacity-30 blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 left-0 w-1/4 h-1/4 bg-gradient-radial from-[#8B0000]/10 to-transparent opacity-30 blur-3xl -z-10"></div>
      
      {/* Animated lines */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ffc62d]/20 to-transparent transform -rotate-1"></div>
        <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#8B0000]/20 to-transparent transform rotate-1"></div>
      </div>

      {/* Welcome Section */}
      <div className="relative backdrop-blur-sm bg-black/20 rounded-xl p-6 border border-white/5">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-b from-[#ffc62d]/20 to-transparent blur-2xl"></div>
        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
          Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ffc62d] to-[#ff9500]">{userProfile?.firstName || 'Trader'}</span>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-1"></div>
        </h1>
        <p className="text-sm text-gray-400 mt-1 md:mt-2 max-w-xl">
          Here's what's happening with your trading journey. Explore your options below to continue your path to success.
        </p>
      </div>

      {/* Main Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ACI Challenge Card */}
        <div className="relative rounded-xl border border-[#ffc62d]/30 bg-gradient-to-br from-[#111111] to-[#0a0a0a] p-8 md:p-10 min-h-[480px] shadow-[0_0_45px_rgba(255,198,45,0.15)] flex flex-col justify-between overflow-hidden group order-first md:order-last">
          {/* Card decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#ffc62d]/5 blur-3xl group-hover:bg-[#ffc62d]/10 transition-all duration-700"></div>
          <div className="absolute -bottom-24 -left-24 w-40 h-40 rounded-full bg-[#ffc62d]/5 group-hover:bg-[#ffc62d]/10 transition-all duration-700"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ffc62d]/40 to-transparent"></div>
          
          <div className="relative z-10">
            <div className="mb-10 flex justify-center">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#252525] to-[#1a1a1a] flex items-center justify-center shadow-lg relative">
                <TrophyIcon className="h-8 w-8 text-[#ffc62d]" />
                <div className="absolute inset-0 rounded-xl border border-[#ffc62d]/20"></div>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">ACI Challenge</h2>
            <p className="text-gray-400 mb-8 text-center text-lg">Trade up to $4,000,000 ACI Account</p>
            <div className="space-y-5">
              <div className="flex items-center gap-3 group/item p-3 rounded-lg hover:bg-black/30 transition-all">
                <div className="w-8 h-8 rounded-full bg-[#ffc62d]/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#ffc62d]/20 transition-all">
                  <svg className="h-4 w-4 text-[#ffc62d]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                </div>
                <span className="text-gray-300 text-base">We provide you with the best funding solution</span>
              </div>
              <div className="flex items-center gap-3 group/item p-3 rounded-lg hover:bg-black/30 transition-all">
                <div className="w-8 h-8 rounded-full bg-[#ffc62d]/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#ffc62d]/20 transition-all">
                  <svg className="h-4 w-4 text-[#ffc62d]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                </div>
                <span className="text-gray-300 text-base">Prove your trading skills</span>
              </div>
              <div className="flex items-center gap-3 group/item p-3 rounded-lg hover:bg-black/30 transition-all">
                <div className="w-8 h-8 rounded-full bg-[#ffc62d]/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#ffc62d]/20 transition-all">
                  <svg className="h-4 w-4 text-[#ffc62d]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                </div>
                <span className="text-gray-300 text-base">Unmatched & Unrivalled scaling plan</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center relative z-10 mt-8">
            <Link
              href="/dashboard/challenge"
              className="inline-block rounded-xl bg-gradient-to-r from-[#ffc62d] to-[#ff9500] px-8 py-4 text-base font-semibold text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,198,45,0.4)] active:scale-95"
            >
              Start ACI Challenge
            </Link>
          </div>
        </div>

        {/* Training & Signals Card */}
        <div className="relative rounded-xl border border-gray-800/80 bg-gradient-to-br from-[#111111] to-[#0a0a0a] p-8 md:p-10 min-h-[480px] shadow-[0_0_30px_rgba(17,17,17,0.7)] flex flex-col justify-between overflow-hidden group order-last md:order-first">
          {/* Card decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/10 transition-all duration-700"></div>
          <div className="absolute -bottom-24 -left-24 w-40 h-40 rounded-full bg-blue-500/5 group-hover:bg-blue-500/10 transition-all duration-700"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          
          <div className="relative z-10">
            <div className="mb-10 flex justify-center">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#252525] to-[#1a1a1a] flex items-center justify-center shadow-lg relative">
                <AcademicCapIcon className="h-8 w-8 text-[#ffc62d]" />
                <div className="absolute inset-0 rounded-xl border border-white/10"></div>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">Training & Signals</h2>
            <p className="text-gray-400 mb-8 text-center text-lg">Master your skills with our expert training</p>
            <div className="space-y-5">
              <div className="flex items-center gap-3 group/item p-3 rounded-lg hover:bg-black/30 transition-all">
                <div className="w-8 h-8 rounded-full bg-[#ffc62d]/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#ffc62d]/20 transition-all">
                  <svg className="h-4 w-4 text-[#ffc62d]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                </div>
                <span className="text-gray-300 text-base">Access to premium trading education</span>
              </div>
              <div className="flex items-center gap-3 group/item p-3 rounded-lg hover:bg-black/30 transition-all">
                <div className="w-8 h-8 rounded-full bg-[#ffc62d]/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#ffc62d]/20 transition-all">
                  <svg className="h-4 w-4 text-[#ffc62d]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                </div>
                <span className="text-gray-300 text-base">Real-time trading signals</span>
              </div>
              <div className="flex items-center gap-3 group/item p-3 rounded-lg hover:bg-black/30 transition-all">
                <div className="w-8 h-8 rounded-full bg-[#ffc62d]/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#ffc62d]/20 transition-all">
                  <svg className="h-4 w-4 text-[#ffc62d]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                </div>
                <span className="text-gray-300 text-base">Community support and mentorship</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center relative z-10 mt-8">
            <Link
              href="/dashboard/training"
              className="inline-block rounded-xl bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a] border border-white/10 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95"
            >
              Start Learning
            </Link>
          </div>
        </div>
      </div>

      {/* Trading Arena Card - Full width */}
      <div className="relative rounded-xl border border-[#8B0000]/30 bg-gradient-to-br from-[#111111] to-[#0a0a0a] p-8 md:p-10 min-h-[400px] shadow-[0_0_45px_rgba(139,0,0,0.2)] overflow-hidden group">
        {/* Card decorative elements */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-[#8B0000]/5 blur-3xl group-hover:bg-[#8B0000]/10 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#8B0000]/5 blur-3xl group-hover:bg-[#8B0000]/10 transition-all duration-700"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8B0000]/40 to-transparent"></div>
        
        {/* Animated lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#8B0000]/20 to-transparent transform rotate-[0.5deg]"></div>
          <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#8B0000]/10 to-transparent transform -rotate-[0.5deg]"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div>
            <div className="mb-10 flex justify-center md:justify-start">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#252525] to-[#1a1a1a] flex items-center justify-center shadow-lg relative">
                <BuildingLibraryIcon className="h-8 w-8 text-[#8B0000]" />
                <div className="absolute inset-0 rounded-xl border border-[#8B0000]/20"></div>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center md:text-left">
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#8B0000] to-[#a50000]">TRADING ARENA</span>
            </h2>
            <p className="text-gray-400 mb-8 text-lg text-center md:text-left">Compete against top traders. Win prizes and funded accounts.</p>
            <div className="space-y-5">
              <div className="flex items-center gap-3 group/item p-3 rounded-lg hover:bg-black/30 transition-all">
                <div className="w-8 h-8 rounded-full bg-[#8B0000]/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#8B0000]/20 transition-all">
                  <svg className="h-4 w-4 text-[#8B0000]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                </div>
                <span className="text-gray-300 text-base">No rules - just maximize your P&L</span>
              </div>
              <div className="flex items-center gap-3 group/item p-3 rounded-lg hover:bg-black/30 transition-all">
                <div className="w-8 h-8 rounded-full bg-[#8B0000]/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#8B0000]/20 transition-all">
                  <svg className="h-4 w-4 text-[#8B0000]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                </div>
                <span className="text-gray-300 text-base">30-day trading competitions</span>
              </div>
              <div className="flex items-center gap-3 group/item p-3 rounded-lg hover:bg-black/30 transition-all">
                <div className="w-8 h-8 rounded-full bg-[#8B0000]/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#8B0000]/20 transition-all">
                  <svg className="h-4 w-4 text-[#8B0000]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                </div>
                <span className="text-gray-300 text-base">$5,000 starting balance</span>
              </div>
            </div>
            <div className="mt-8 text-center md:text-left">
              <Link
                href="/dashboard/trading-arena"
                className="inline-block rounded-xl bg-gradient-to-r from-[#8B0000] to-[#650000] px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(139,0,0,0.4)] active:scale-95"
              >
                Enter The Arena
              </Link>
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="text-2xl font-bold text-white mb-6 text-center md:text-left">
              <span className="text-[#8B0000]">Prize</span> Breakdown
            </h3>
            {/* First Place */}
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#1a1a1a] hover:border-[#FFD700]/30 flex justify-between items-center shadow-md transition-all group/item">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#FFD700]/10 flex items-center justify-center text-[#FFD700] font-bold">1</div>
                <span className="text-white font-semibold">Arena Champion</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[#FFD700] font-semibold text-sm md:text-base">$150K Funded Account</span>
                <span className="text-green-500 text-xs md:text-sm">+$500 Cash</span>
              </div>
            </div>
            
            {/* Second Place */}
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#1a1a1a] hover:border-[#C0C0C0]/30 flex justify-between items-center shadow-md transition-all group/item">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#C0C0C0]/10 flex items-center justify-center text-[#C0C0C0] font-bold">2</div>
                <span className="text-white font-semibold">Runner Up</span>
              </div>
              <div>
                <span className="text-[#C0C0C0] font-semibold text-sm md:text-base">$1,000 Cash</span>
              </div>
            </div>
            
            {/* Third Place */}
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#1a1a1a] hover:border-[#CD7F32]/30 flex justify-between items-center shadow-md transition-all group/item">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#CD7F32]/10 flex items-center justify-center text-[#CD7F32] font-bold">3</div>
                <span className="text-white font-semibold">Bronze Winner</span>
              </div>
              <div>
                <span className="text-[#CD7F32] font-semibold text-sm md:text-base">$750 Cash</span>
              </div>
            </div>
            
            {/* 4th and 5th */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#1a1a1a] hover:border-gray-700/50 shadow-md transition-all flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 font-bold text-sm">4</div>
                  <span className="text-white font-medium text-sm">Fourth Place</span>
                </div>
                <div className="text-gray-300 font-semibold">$500</div>
              </div>
              <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#1a1a1a] hover:border-gray-700/50 shadow-md transition-all flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 font-bold text-sm">5</div>
                  <span className="text-white font-medium text-sm">Fifth Place</span>
                </div>
                <div className="text-gray-300 font-semibold">$250</div>
              </div>
            </div>
            
            <div className="mt-2 py-3 px-4 rounded-lg bg-[#1a1a1a]/50 border border-[#1a1a1a] text-gray-400 text-sm text-center flex items-center justify-center space-x-3">
              <span className="inline-block px-2 py-1 bg-[#8B0000]/10 rounded text-[#8B0000] text-xs font-medium">$100 Entry</span>
              <span>•</span>
              <span>Monthly Competition</span>
              <span>•</span>
              <span>No Trading Rules</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="rounded-xl bg-gradient-to-br from-[#111111] to-[#0a0a0a] p-8 border border-white/5 shadow-lg relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
        
        {/* Stats title */}
        <div className="mb-6 relative z-10">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            Your <span className="text-[#ffc62d]">Stats</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ffc62d] animate-pulse"></span>
          </h3>
          <div className="h-px w-16 bg-gradient-to-r from-[#ffc62d] to-transparent mt-2"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {/* Lessons Completed */}
          <div className="p-5 bg-black/20 backdrop-blur-sm rounded-xl border border-white/5 hover:border-white/10 transition-all group">
          <div className="flex items-center">
              <div className="rounded-lg bg-[#ffc62d]/10 group-hover:bg-[#ffc62d]/15 p-3 transition-all">
              <svg
                className="h-6 w-6 text-[#ffc62d]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">
                Lessons Completed
              </p>
                <p className="mt-1 text-xl font-semibold text-white flex items-end gap-1">
                {stats?.totalLessonsCompleted || 0}
                  <span className="text-xs text-[#ffc62d]/70">lessons</span>
              </p>
              </div>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="p-5 bg-black/20 backdrop-blur-sm rounded-xl border border-white/5 hover:border-white/10 transition-all group">
          <div className="flex items-center">
              <div className="rounded-lg bg-green-500/10 group-hover:bg-green-500/15 p-3 transition-all">
              <svg
                className="h-6 w-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">
                Subscription Status
              </p>
                <p className="mt-1 text-xl font-semibold flex items-center gap-2">
                  <span className={stats?.activeSubscription ? 'text-green-500' : 'text-red-500'}>
                {stats?.activeSubscription ? 'Active' : 'Inactive'}
                  </span>
                  {stats?.activeSubscription && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Tier */}
          <div className="p-5 bg-black/20 backdrop-blur-sm rounded-xl border border-white/5 hover:border-white/10 transition-all group">
          <div className="flex items-center">
              <div className="rounded-lg bg-purple-500/10 group-hover:bg-purple-500/15 p-3 transition-all">
              <svg
                className="h-6 w-6 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">
                Subscription Tier
              </p>
                <p className="mt-1 text-xl font-semibold text-purple-400">
                {stats?.subscriptionTier || 'None'}
              </p>
              </div>
            </div>
          </div>

          {/* Last Active */}
          <div className="p-5 bg-black/20 backdrop-blur-sm rounded-xl border border-white/5 hover:border-white/10 transition-all group">
          <div className="flex items-center">
              <div className="rounded-lg bg-blue-500/10 group-hover:bg-blue-500/15 p-3 transition-all">
              <svg
                className="h-6 w-6 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Last Active</p>
              <p className="mt-1 text-xl font-semibold text-white">
                {stats?.lastActive
                  ? new Date(stats.lastActive).toLocaleDateString()
                  : 'Never'}
              </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 