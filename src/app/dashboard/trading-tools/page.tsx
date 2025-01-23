'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline';

interface TradingStats {
  winRate: number;
  totalTrades: number;
  averageWinSize: number;
  currentDrawdown: number;
  lastTradeDate: Date | null;
}

export default function TradingToolsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<TradingStats>({
    winRate: 0,
    totalTrades: 0,
    averageWinSize: 0,
    currentDrawdown: 0,
    lastTradeDate: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement Firebase fetch for trading stats
    setLoading(false);
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
      {/* Header */}
      <div className="rounded-lg bg-[#111111] p-6">
        <h1 className="text-2xl font-bold text-white">Trading Journal & Tools</h1>
        <p className="mt-2 text-gray-400">
          Track your performance and access trading tools
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Win Rate */}
        <div className="rounded-lg bg-[#111111] p-6 shadow-[0_0_20px_rgba(17,17,17,0.5)]">
          <div className="flex items-center">
            <div className="rounded-md bg-green-500 bg-opacity-10 p-3">
              <ChartBarIcon className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Win Rate</p>
              <p className="mt-1 text-xl font-semibold text-white">
                {stats.winRate}%
              </p>
            </div>
          </div>
        </div>

        {/* Total Trades */}
        <div className="rounded-lg bg-[#111111] p-6 shadow-[0_0_20px_rgba(17,17,17,0.5)]">
          <div className="flex items-center">
            <div className="rounded-md bg-blue-500 bg-opacity-10 p-3">
              <ArrowTrendingUpIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Trades</p>
              <p className="mt-1 text-xl font-semibold text-white">
                {stats.totalTrades}
              </p>
            </div>
          </div>
        </div>

        {/* Average Win */}
        <div className="rounded-lg bg-[#111111] p-6 shadow-[0_0_20px_rgba(17,17,17,0.5)]">
          <div className="flex items-center">
            <div className="rounded-md bg-[#ffc62d] bg-opacity-10 p-3">
              <ScaleIcon className="h-6 w-6 text-[#ffc62d]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Average Win</p>
              <p className="mt-1 text-xl font-semibold text-white">
                ${stats.averageWinSize}
              </p>
            </div>
          </div>
        </div>

        {/* Current Drawdown */}
        <div className="rounded-lg bg-[#111111] p-6 shadow-[0_0_20px_rgba(17,17,17,0.5)]">
          <div className="flex items-center">
            <div className="rounded-md bg-red-500 bg-opacity-10 p-3">
              <ClockIcon className="h-6 w-6 text-red-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Current Drawdown</p>
              <p className="mt-1 text-xl font-semibold text-white">
                {stats.currentDrawdown}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Trade Journal Entry */}
      <div className="rounded-lg bg-[#111111] p-6 shadow-[0_0_20px_rgba(17,17,17,0.5)]">
        <h2 className="text-xl font-semibold mb-4">Quick Trade Entry</h2>
        {/* TODO: Implement trade entry form */}
      </div>

      {/* Recent Trades */}
      <div className="rounded-lg bg-[#111111] p-6 shadow-[0_0_20px_rgba(17,17,17,0.5)]">
        <h2 className="text-xl font-semibold mb-4">Recent Trades</h2>
        {/* TODO: Implement recent trades list */}
      </div>

      {/* Trading Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Position Size Calculator */}
        <div className="rounded-lg bg-[#111111] p-6 shadow-[0_0_20px_rgba(17,17,17,0.5)]">
          <h3 className="text-lg font-semibold mb-2">Position Size Calculator</h3>
          <p className="text-gray-400 text-sm mb-4">Calculate optimal position sizes based on your risk parameters</p>
          {/* TODO: Implement calculator */}
        </div>

        {/* Risk Management */}
        <div className="rounded-lg bg-[#111111] p-6 shadow-[0_0_20px_rgba(17,17,17,0.5)]">
          <h3 className="text-lg font-semibold mb-2">Risk Management</h3>
          <p className="text-gray-400 text-sm mb-4">Track your daily risk limits and exposure</p>
          {/* TODO: Implement risk management tools */}
        </div>

        {/* Trade Analytics */}
        <div className="rounded-lg bg-[#111111] p-6 shadow-[0_0_20px_rgba(17,17,17,0.5)]">
          <h3 className="text-lg font-semibold mb-2">Trade Analytics</h3>
          <p className="text-gray-400 text-sm mb-4">Analyze your trading performance and patterns</p>
          {/* TODO: Implement analytics */}
        </div>
      </div>
    </div>
  );
} 