'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRole } from '@/contexts/RoleContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Alert {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  tradeType: 'scalp' | 'swing';
  entry: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  takeProfit3: number;
  risk: string;
  analysis: string;
  timestamp: Date;
  status: 'active' | 'closed';
  result?: 'win' | 'loss';
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all');
  const { canAccessSignals, role } = useRole();

  useEffect(() => {
    const alertsQuery = query(
      collection(db, 'signals'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(alertsQuery, (snapshot) => {
      const alertsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      })) as Alert[];
      setAlerts(alertsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    return alert.status === filter;
  });

  const stats = {
    total: alerts.length,
    active: alerts.filter(s => s.status === 'active').length,
    wins: alerts.filter(s => s.result === 'win').length,
    winRate: alerts.length > 0 
      ? ((alerts.filter(s => s.result === 'win').length / alerts.filter(s => s.result).length) * 100).toFixed(1)
      : '0.0'
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 rounded-full border-4 border-[#ffc62d] border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3 mb-6"
      >
        <div className="w-10 h-10 rounded-xl bg-[#ffc62d] flex items-center justify-center">
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Trading Alerts</h1>
        </div>
      </motion.div>

      {/* Stats, Filter & Alerts Wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-xl bg-[#111111] p-4 md:p-6 border border-gray-800 space-y-6"
      >
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[
            { label: 'Total Alerts', value: stats.total },
            { label: 'Active', value: stats.active },
            { label: 'Winners', value: stats.wins },
            { label: 'Win Rate', value: `${stats.winRate}%` }
          ].map((stat, idx) => (
            <div key={stat.label} className="text-center">
              <p className="text-xs md:text-sm text-gray-400 mb-1">{stat.label}</p>
              <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800"></div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {(['all', 'active', 'closed'] as const).map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                filter === status
                  ? 'bg-[#ffc62d] text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800"></div>

        {/* Alerts Grid */}
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {filteredAlerts.map((alert, idx) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative"
            >
              <div className="relative bg-[#111111] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#ffc62d]/50 transition-all duration-300 shadow-lg shadow-black/50">
                {/* Blur overlay for non-paying members */}
                {!canAccessSignals && alert.status === 'active' && (
                  <div className="absolute inset-0 backdrop-blur-xl bg-black/70 z-10 flex flex-col items-center justify-center p-6 text-center rounded-2xl">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="space-y-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-[#ffc62d] flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        Premium Alert
                      </h3>
                      <p className="text-sm text-gray-300">
                        Upgrade to unlock active trading alerts
                      </p>
                      <Link
                        href="/dashboard/challenge"
                        className="inline-block px-6 py-3 bg-[#ffc62d] text-black rounded-xl font-semibold hover:bg-[#ffc62d]/90 transition-colors"
                      >
                        Upgrade Now
                      </Link>
                    </motion.div>
                  </div>
                )}

                <div className="relative z-0 p-5 md:p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold text-white">{alert.symbol}</h3>
                        <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-gray-800 text-gray-300 border border-gray-700">
                          {alert.tradeType.toUpperCase()}
                        </span>
                      </div>
                      <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg font-semibold text-sm ${
                        alert.type === 'long'
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        <span>{alert.type === 'long' ? '📈' : '📉'}</span>
                        <span>{alert.type.toUpperCase()}</span>
                        <span className="text-white">@</span>
                        <span className="font-mono">{alert.entry}</span>
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      alert.status === 'active'
                        ? 'bg-green-500 text-white'
                        : alert.result === 'win'
                        ? 'bg-[#ffc62d] text-black'
                        : alert.result === 'loss'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {alert.result ? alert.result.toUpperCase() : alert.status.toUpperCase()}
                    </div>
                  </div>

                  {/* Price Targets */}
                  <div className="space-y-3">
                    {/* Stop Loss */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-800/50 border border-gray-700">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center">
                          <span className="text-sm">🛑</span>
                        </div>
                        <span className="text-xs font-medium text-gray-400">Stop Loss</span>
                      </div>
                      <span className="text-sm font-bold text-white font-mono">{alert.stopLoss}</span>
                    </div>

                    {/* Take Profits */}
                    <div className="space-y-2">
                      {[
                        { label: 'TP1', value: alert.takeProfit1 },
                        { label: 'TP2', value: alert.takeProfit2 },
                        { label: 'TP3', value: alert.takeProfit3 }
                      ].map((tp, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-800/50 border border-gray-700">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded bg-gray-700 flex items-center justify-center">
                              <span className="text-xs font-bold text-gray-300">{i + 1}</span>
                            </div>
                            <span className="text-xs font-medium text-gray-400">{tp.label}</span>
                          </div>
                          <span className="text-sm font-bold text-white font-mono">{tp.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risk & Analysis */}
                  <div className="space-y-3 pt-3 border-t border-gray-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-400">Risk Level</span>
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        alert.risk === 'low' 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : alert.risk === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {alert.risk?.toUpperCase()}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-800/50 border border-gray-700">
                      <p className="text-xs text-gray-300 leading-relaxed">{alert.analysis}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{new Date(alert.timestamp).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredAlerts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 px-4"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Alerts Found</h3>
            <p className="text-gray-400 text-center max-w-md">
              {filter === 'active' ? 'No active alerts at the moment. Check back soon!' : 
               filter === 'closed' ? 'No closed alerts yet.' : 
               'No alerts available.'}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 