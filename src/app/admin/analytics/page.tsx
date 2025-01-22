'use client';

import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Analytics {
  totalRevenue: number;
  activeSubscriptions: number;
  totalUsers: number;
  signalsIssued: number;
  avgSignalSuccess: number;
  topPlans: { name: string; count: number }[];
  revenueByMonth: { month: string; amount: number }[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalRevenue: 0,
    activeSubscriptions: 0,
    totalUsers: 0,
    signalsIssued: 0,
    avgSignalSuccess: 0,
    topPlans: [],
    revenueByMonth: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch users
        const usersQuery = query(collection(db, 'users'));
        const usersSnapshot = await getDocs(usersQuery);
        const totalUsers = usersSnapshot.size;
        const activeSubscriptions = usersSnapshot.docs.filter(
          doc => doc.data().subscription?.status === 'active'
        ).length;

        // Fetch orders
        const ordersQuery = query(collection(db, 'orders'));
        const ordersSnapshot = await getDocs(ordersQuery);
        const totalRevenue = ordersSnapshot.docs.reduce(
          (sum, doc) => sum + (doc.data().amount || 0),
          0
        );

        // Fetch signals
        const signalsQuery = query(collection(db, 'signals'));
        const signalsSnapshot = await getDocs(signalsQuery);
        const signalsIssued = signalsSnapshot.size;
        
        // Calculate success rate (assuming signals have a result field)
        const successfulSignals = signalsSnapshot.docs.filter(
          doc => doc.data().result && doc.data().result > 0
        ).length;
        const avgSignalSuccess = signalsIssued > 0 
          ? (successfulSignals / signalsIssued) * 100 
          : 0;

        setAnalytics({
          totalRevenue,
          activeSubscriptions,
          totalUsers,
          signalsIssued,
          avgSignalSuccess,
          topPlans: [], // To be implemented with actual data
          revenueByMonth: [] // To be implemented with actual data
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ffc62d] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400">Platform performance and metrics</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Revenue Card */}
        <div className="rounded-lg bg-[#111111] p-6">
          <h3 className="text-sm font-medium text-gray-400">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold text-white">
            ${analytics.totalRevenue.toLocaleString()}
          </p>
        </div>

        {/* Active Subscriptions Card */}
        <div className="rounded-lg bg-[#111111] p-6">
          <h3 className="text-sm font-medium text-gray-400">Active Subscriptions</h3>
          <p className="mt-2 text-3xl font-bold text-white">
            {analytics.activeSubscriptions.toLocaleString()}
          </p>
        </div>

        {/* Total Users Card */}
        <div className="rounded-lg bg-[#111111] p-6">
          <h3 className="text-sm font-medium text-gray-400">Total Users</h3>
          <p className="mt-2 text-3xl font-bold text-white">
            {analytics.totalUsers.toLocaleString()}
          </p>
        </div>

        {/* Signals Card */}
        <div className="rounded-lg bg-[#111111] p-6">
          <h3 className="text-sm font-medium text-gray-400">Signals Issued</h3>
          <p className="mt-2 text-3xl font-bold text-white">
            {analytics.signalsIssued.toLocaleString()}
          </p>
        </div>

        {/* Signal Success Rate Card */}
        <div className="rounded-lg bg-[#111111] p-6">
          <h3 className="text-sm font-medium text-gray-400">Avg. Signal Success Rate</h3>
          <p className="mt-2 text-3xl font-bold text-white">
            {analytics.avgSignalSuccess.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Additional sections for charts can be added here */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-[#111111] p-6">
          <h3 className="mb-4 text-lg font-medium text-white">Revenue Trend</h3>
          {/* Add chart component here */}
          <div className="h-64 w-full bg-gray-900 rounded-lg"></div>
        </div>

        <div className="rounded-lg bg-[#111111] p-6">
          <h3 className="mb-4 text-lg font-medium text-white">Top Plans</h3>
          {/* Add chart component here */}
          <div className="h-64 w-full bg-gray-900 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
} 