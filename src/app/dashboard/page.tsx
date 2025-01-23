'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { AcademicCapIcon, TrophyIcon } from '@heroicons/react/24/outline';

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
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-lg font-medium text-white">
          Welcome back, {userProfile?.firstName || 'Trader'}
        </h1>
        <p className="text-sm text-gray-400">
          Here's what's happening with your trading journey
        </p>
      </div>

      {/* Main Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ACI Challenge Card - Moved first for mobile display */}
        <div className="relative rounded-lg border border-[#ffc62d]/20 bg-[#111111] p-12 min-h-[480px] shadow-[0_0_45px_rgba(255,198,45,0.2)] flex flex-col justify-between order-first md:order-last">
          <div>
            <div className="absolute top-12 left-1/2 -translate-x-1/2">
              <div className="rounded-lg bg-[#1a1a1a] p-3">
                <TrophyIcon className="h-6 w-6 text-[#ffc62d]" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-8 text-center mt-16">ACI Challenge</h2>
            <p className="text-gray-400 mb-16 text-lg text-center">Trade up to $4,000,000 ACI Account</p>
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-[#ffc62d]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300 text-base">We provide you with the best funding solution</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-[#ffc62d]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300 text-base">Prove your trading skills</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-[#ffc62d]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300 text-base">Unmatched & Unrivalled scaling plan</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-16">
            <Link
              href="/dashboard/challenge"
              className="inline-block rounded-lg bg-[#ffc62d] px-8 py-4 text-base font-semibold text-black hover:bg-[#e5b228] transition-colors shadow-[0_0_25px_rgba(255,198,45,0.25)] hover:shadow-[0_0_25px_rgba(255,198,45,0.4)]"
            >
              Start ACI Challenge
            </Link>
          </div>
        </div>

        {/* Training & Signals Card */}
        <div className="relative rounded-lg border border-gray-800 bg-[#111111] p-12 min-h-[480px] shadow-[0_0_30px_rgba(17,17,17,0.7)] flex flex-col justify-between order-last md:order-first">
          <div>
            <div className="absolute top-12 left-1/2 -translate-x-1/2">
              <div className="rounded-lg bg-[#1a1a1a] p-3">
                <AcademicCapIcon className="h-6 w-6 text-[#ffc62d]" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-8 text-center mt-16">Training & Signals</h2>
            <p className="text-gray-400 mb-16 text-lg text-center">Master your skills with our expert training and real-time signals</p>
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-[#ffc62d]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300 text-base">Access to premium trading education</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-[#ffc62d]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300 text-base">Real-time trading signals</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-[#ffc62d]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300 text-base">Community support and mentorship</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-16">
            <Link
              href="/dashboard/training"
              className="inline-block rounded-lg bg-[#1a1a1a] px-8 py-4 text-base font-semibold text-white hover:bg-[#252525] transition-colors"
            >
              Start Learning
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="rounded-lg bg-[#111111] p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Lessons Completed */}
          <div className="flex items-center">
            <div className="rounded-md bg-[#ffc62d] bg-opacity-10 p-3">
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
              <p className="mt-1 text-xl font-semibold text-white">
                {stats?.totalLessonsCompleted || 0}
              </p>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="flex items-center">
            <div className="rounded-md bg-green-500 bg-opacity-10 p-3">
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
              <p className="mt-1 text-xl font-semibold text-white">
                {stats?.activeSubscription ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>

          {/* Subscription Tier */}
          <div className="flex items-center">
            <div className="rounded-md bg-purple-500 bg-opacity-10 p-3">
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
              <p className="mt-1 text-xl font-semibold text-white">
                {stats?.subscriptionTier || 'None'}
              </p>
            </div>
          </div>

          {/* Last Active */}
          <div className="flex items-center">
            <div className="rounded-md bg-blue-500 bg-opacity-10 p-3">
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
  );
} 