'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AcademicCapIcon, TrophyIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Stats {
  totalLessonsCompleted: number;
  activeSubscription: boolean;
  subscriptionTier: string;
  lastActive: Date;
}

interface Activity {
  id: string;
  type: 'lesson_completed' | 'signal_received' | 'community_post';
  title: string;
  timestamp: Date;
  description: string;
}

export default function DashboardPage() {
  const { user, userProfile } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
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

        // For now, use placeholder data for recent activity
        setRecentActivity([
          {
            id: '1',
            type: 'lesson_completed',
            title: 'Technical Analysis Basics',
            timestamp: new Date(),
            description: 'Completed Module 1: Introduction to Technical Analysis',
          },
          {
            id: '2',
            type: 'signal_received',
            title: 'BTC/USD Trading Signal',
            timestamp: new Date(),
            description: 'New trading opportunity identified',
          },
          {
            id: '3',
            type: 'community_post',
            title: 'Market Analysis',
            timestamp: new Date(),
            description: 'Posted weekly market analysis and outlook',
          },
        ]);
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
      <div className="rounded-lg bg-[#111111] p-6">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {userProfile?.firstName || 'Trader'}
        </h1>
        <p className="mt-2 text-gray-400">
          Here's what's happening with your trading journey
        </p>
      </div>

      {/* Main Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Training & Signals Card */}
        <div className="relative rounded-lg border border-gray-800 bg-[#111111] p-8">
          <div className="absolute top-8 right-8">
            <div className="rounded-lg bg-[#1a1a1a] p-3">
              <AcademicCapIcon className="h-6 w-6 text-[#ffc62d]" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Training & Signals</h2>
          <p className="text-gray-400 mb-6">Master your skills with our expert training and real-time signals</p>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-[#ffc62d]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-300">Access to premium trading education</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-[#ffc62d]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-300">Real-time trading signals</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-[#ffc62d]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-300">Community support and mentorship</span>
            </div>
          </div>
          <div className="mt-8">
            <Link
              href="/dashboard/training"
              className="inline-block rounded-lg bg-[#1a1a1a] px-6 py-3 text-sm font-semibold text-white hover:bg-[#252525] transition-colors"
            >
              Start Learning
            </Link>
          </div>
        </div>

        {/* ACI Challenge Card */}
        <div className="relative rounded-lg border border-gray-800 bg-[#111111] p-8">
          <div className="absolute top-8 right-8">
            <div className="rounded-lg bg-[#1a1a1a] p-3">
              <TrophyIcon className="h-6 w-6 text-[#ffc62d]" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">ACI Challenge</h2>
          <p className="text-gray-400 mb-6">Trade up to $4,000,000 ACI Account</p>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-[#ffc62d]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-300">We provide you with the best funding solution</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-[#ffc62d]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-300">Prove your trading skills</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-[#ffc62d]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-300">Unmatched & Unrivalled scaling plan</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-[#ffc62d]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-300">Learn, earn & ascend to new heights!</span>
            </div>
          </div>
          <div className="mt-8">
            <Link
              href="/dashboard/challenge"
              className="inline-block rounded-lg bg-[#ffc62d] px-6 py-3 text-sm font-semibold text-black hover:bg-[#e5b228] transition-colors"
            >
              Start ACI Challenge
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-[#111111] p-6">
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
        </div>

        <div className="rounded-lg bg-[#111111] p-6">
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
        </div>

        <div className="rounded-lg bg-[#111111] p-6">
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
        </div>

        <div className="rounded-lg bg-[#111111] p-6">
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

      {/* Recent Activity */}
      <div className="rounded-lg bg-[#111111] p-6">
        <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        <div className="mt-4 space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center rounded-lg bg-gray-800 p-4"
            >
              <div
                className={`rounded-md p-2 ${
                  activity.type === 'lesson_completed'
                    ? 'bg-[#ffc62d] bg-opacity-10 text-[#ffc62d]'
                    : activity.type === 'signal_received'
                    ? 'bg-green-500 bg-opacity-10 text-green-500'
                    : 'bg-blue-500 bg-opacity-10 text-blue-500'
                }`}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      activity.type === 'lesson_completed'
                        ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                        : activity.type === 'signal_received'
                        ? 'M13 10V3L4 14h7v7l9-11h-7z'
                        : 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z'
                    }
                  />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-sm font-medium text-white">
                  {activity.title}
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  {activity.description}
                </p>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 