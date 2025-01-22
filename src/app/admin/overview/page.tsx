'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Stats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  activeCourses: number;
}

interface RecentActivity {
  id: string;
  type: 'signup' | 'payment' | 'course_completion';
  user: string;
  details: string;
  timestamp: Date;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    activeCourses: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users count
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const totalUsers = usersSnapshot.size;

        // Fetch active subscriptions
        const activeSubsQuery = query(
          collection(db, 'users'),
          where('subscription.status', '==', 'active')
        );
        const activeSubsSnapshot = await getDocs(activeSubsQuery);
        const activeSubscriptions = activeSubsSnapshot.size;

        // Fetch courses count
        const coursesSnapshot = await getDocs(collection(db, 'courses'));
        const activeCourses = coursesSnapshot.size;

        // Calculate total revenue (simplified version)
        const paymentsSnapshot = await getDocs(collection(db, 'payments'));
        const totalRevenue = paymentsSnapshot.docs.reduce(
          (sum, doc) => sum + (doc.data().amount || 0),
          0
        );

        setStats({
          totalUsers,
          activeSubscriptions,
          totalRevenue,
          activeCourses
        });

        // Fetch recent activity
        const recentActivityQuery = query(
          collection(db, 'activity'),
          orderBy('timestamp', 'desc'),
          limit(5)
        );
        const activitySnapshot = await getDocs(recentActivityQuery);
        const activity = activitySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as RecentActivity[];

        setRecentActivity(activity);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ffc62d] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-[#111111] p-4">
          <h3 className="text-sm font-medium text-gray-400">Total Users</h3>
          <p className="mt-2 text-3xl font-bold text-white">{stats.totalUsers}</p>
        </div>
        <div className="rounded-lg bg-[#111111] p-4">
          <h3 className="text-sm font-medium text-gray-400">Active Subscriptions</h3>
          <p className="mt-2 text-3xl font-bold text-white">{stats.activeSubscriptions}</p>
        </div>
        <div className="rounded-lg bg-[#111111] p-4">
          <h3 className="text-sm font-medium text-gray-400">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold text-white">
            ${(stats.totalRevenue / 100).toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg bg-[#111111] p-4">
          <h3 className="text-sm font-medium text-gray-400">Active Courses</h3>
          <p className="mt-2 text-3xl font-bold text-white">{stats.activeCourses}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg bg-[#111111] p-4">
        <h2 className="mb-4 text-lg font-medium text-white">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between border-b border-gray-800 pb-4 last:border-0"
            >
              <div>
                <p className="text-sm text-white">{activity.details}</p>
                <p className="text-xs text-gray-400">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </p>
              </div>
              <span className="rounded-full bg-gray-800 px-2 py-1 text-xs text-gray-300">
                {activity.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <button className="rounded-lg bg-[#111111] p-4 text-left hover:bg-gray-800">
          <h3 className="text-lg font-medium text-white">Manage Users</h3>
          <p className="mt-1 text-sm text-gray-400">
            View and manage user accounts and permissions
          </p>
        </button>
        <button className="rounded-lg bg-[#111111] p-4 text-left hover:bg-gray-800">
          <h3 className="text-lg font-medium text-white">Course Management</h3>
          <p className="mt-1 text-sm text-gray-400">
            Add or edit courses and lesson content
          </p>
        </button>
        <button className="rounded-lg bg-[#111111] p-4 text-left hover:bg-gray-800">
          <h3 className="text-lg font-medium text-white">View Analytics</h3>
          <p className="mt-1 text-sm text-gray-400">
            Check detailed platform analytics and reports
          </p>
        </button>
      </div>
    </div>
  );
} 