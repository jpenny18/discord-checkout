'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Signal {
  id: string;
  symbol: string;
  type: 'long' | 'short';
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

export default function SignalsPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all');

  useEffect(() => {
    const signalsQuery = query(
      collection(db, 'signals'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(signalsQuery, (snapshot) => {
      const signalsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      })) as Signal[];
      setSignals(signalsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredSignals = signals.filter(signal => {
    if (filter === 'all') return true;
    return signal.status === filter;
  });

  const stats = {
    total: signals.length,
    active: signals.filter(s => s.status === 'active').length,
    wins: signals.filter(s => s.result === 'win').length,
    winRate: signals.length > 0 
      ? ((signals.filter(s => s.result === 'win').length / signals.filter(s => s.result).length) * 100).toFixed(1)
      : '0.0'
  };

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
        <h1 className="text-2xl font-bold text-white">Trading Signals</h1>
        <p className="text-gray-400">View and track trading signals</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#111111] p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-400">Total Signals</h3>
          <p className="mt-2 text-3xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-[#111111] p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-400">Active Signals</h3>
          <p className="mt-2 text-3xl font-bold text-white">{stats.active}</p>
        </div>
        <div className="bg-[#111111] p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-400">Winning Trades</h3>
          <p className="mt-2 text-3xl font-bold text-white">{stats.wins}</p>
        </div>
        <div className="bg-[#111111] p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-400">Win Rate</h3>
          <p className="mt-2 text-3xl font-bold text-white">{stats.winRate}%</p>
        </div>
      </div>

      <div className="flex space-x-4">
        {(['all', 'active', 'closed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === status
                ? 'bg-[#ffc62d] text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSignals.map((signal) => (
          <div
            key={signal.id}
            className="bg-[#111111] p-6 rounded-lg space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-white">{signal.symbol}</h3>
                <p className="text-sm text-gray-400">
                  {signal.type.toUpperCase()} @ {signal.entry}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  signal.status === 'active'
                    ? 'bg-green-900 text-green-200'
                    : signal.result === 'win'
                    ? 'bg-[#ffc62d] text-black'
                    : signal.result === 'loss'
                    ? 'bg-red-900 text-red-200'
                    : 'bg-gray-800 text-gray-300'
                }`}
              >
                {signal.result ? signal.result.toUpperCase() : signal.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-300">
                <span className="font-medium">Stop Loss:</span> {signal.stopLoss}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-medium">Take Profit:</span> {signal.takeProfit1} / {signal.takeProfit2} / {signal.takeProfit3}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-medium">Risk:</span> {signal.risk}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-medium">Analysis:</span> {signal.analysis}
              </p>
            </div>

            <div className="text-xs text-gray-400">
              {signal.timestamp.toLocaleDateString()} at {signal.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 