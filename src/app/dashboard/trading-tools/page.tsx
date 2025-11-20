'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  ScaleIcon,
  BookOpenIcon,
  ArrowRightIcon,
  CalculatorIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface TradingStats {
  winRate: number;
  totalTrades: number;
  averageWinSize: number;
  currentDrawdown: number;
  lastTradeDate: Date | null;
}

// Position Size Calculator Component
function PositionSizeCalculator() {
  const [accountSize, setAccountSize] = useState<string>('10000');
  const [riskPercentage, setRiskPercentage] = useState<string>('1');
  const [entryPrice, setEntryPrice] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [calculationType, setCalculationType] = useState<'percentage' | 'price'>('percentage');

  const calculatePositionSize = () => {
    const account = parseFloat(accountSize);
    const risk = parseFloat(riskPercentage);
    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLoss);

    if (!account || !risk || !entry || !sl) return null;

    const riskAmount = (account * risk) / 100;
    let stopLossDistance: number;

    if (calculationType === 'percentage') {
      stopLossDistance = (entry * sl) / 100;
    } else {
      stopLossDistance = Math.abs(entry - sl);
    }

    const positionSize = riskAmount / stopLossDistance;
    const positionValue = positionSize * entry;
    const leverage = positionValue / account;

    return {
      positionSize: positionSize.toFixed(4),
      positionValue: positionValue.toFixed(2),
      riskAmount: riskAmount.toFixed(2),
      leverage: leverage.toFixed(2),
      stopLossDistance: stopLossDistance.toFixed(4),
    };
  };

  const results = calculatePositionSize();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-[#111111] p-6 md:p-8 shadow-lg border border-gray-800"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-[#ffc62d]/10 border border-[#ffc62d]/30">
          <CalculatorIcon className="w-6 h-6 text-[#ffc62d]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Position Size Calculator</h2>
          <p className="text-gray-400 text-sm">Calculate optimal position sizes based on your risk parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Input Parameters</h3>

          {/* Account Size */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Account Size ($)
            </label>
            <input
              type="number"
              value={accountSize}
              onChange={(e) => setAccountSize(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#ffc62d] transition-colors"
              placeholder="10000"
            />
          </div>

          {/* Risk Percentage */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Risk Per Trade (%)
            </label>
            <input
              type="number"
              value={riskPercentage}
              onChange={(e) => setRiskPercentage(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#ffc62d] transition-colors"
              placeholder="1"
              step="0.1"
            />
          </div>

          {/* Entry Price */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Entry Price
            </label>
            <input
              type="number"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#ffc62d] transition-colors"
              placeholder="50000"
              step="0.01"
            />
          </div>

          {/* Stop Loss Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Stop Loss Type
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setCalculationType('percentage')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  calculationType === 'percentage'
                    ? 'bg-[#ffc62d] text-black'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Percentage
              </button>
              <button
                onClick={() => setCalculationType('price')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  calculationType === 'price'
                    ? 'bg-[#ffc62d] text-black'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Price
              </button>
            </div>
          </div>

          {/* Stop Loss */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Stop Loss {calculationType === 'percentage' ? '(%)' : '(Price)'}
            </label>
            <input
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#ffc62d] transition-colors"
              placeholder={calculationType === 'percentage' ? '2' : '49000'}
              step={calculationType === 'percentage' ? '0.1' : '0.01'}
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Results</h3>

          {results ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-3"
            >
              {/* Position Size */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#ffc62d]/10 to-[#ffc62d]/5 border border-[#ffc62d]/30">
                <p className="text-sm text-gray-400 mb-1">Position Size</p>
                <p className="text-2xl font-bold text-[#ffc62d]">{results.positionSize} units</p>
              </div>

              {/* Position Value */}
              <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <p className="text-sm text-gray-400 mb-1">Position Value</p>
                <p className="text-xl font-bold text-white">${results.positionValue}</p>
              </div>

              {/* Risk Amount */}
              <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <p className="text-sm text-gray-400 mb-1">Risk Amount</p>
                <p className="text-xl font-bold text-red-400">${results.riskAmount}</p>
              </div>

              {/* Stop Loss Distance */}
              <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <p className="text-sm text-gray-400 mb-1">Stop Loss Distance</p>
                <p className="text-xl font-bold text-white">{results.stopLossDistance}</p>
              </div>

              {/* Leverage */}
              <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                <p className="text-sm text-gray-400 mb-1">Effective Leverage</p>
                <p className={`text-xl font-bold ${
                  parseFloat(results.leverage) > 10 ? 'text-red-400' : 
                  parseFloat(results.leverage) > 5 ? 'text-yellow-400' : 
                  'text-green-400'
                }`}>
                  {results.leverage}x
                </p>
              </div>

              {/* Warning for high leverage */}
              {parseFloat(results.leverage) > 10 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/30"
                >
                  <p className="text-sm text-red-400 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    High leverage detected! Consider reducing position size.
                  </p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[300px] text-gray-500">
              <div className="text-center">
                <CalculatorIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Enter all parameters to calculate position size</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
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
      <div className="rounded-lg bg-[#111111] p-6 border border-white/5 shadow-[0_0_30px_rgba(17,17,17,0.7)]">
        <h1 className="text-2xl font-bold text-white">Trading Journal & Tools</h1>
        <p className="mt-2 text-gray-400">
          Track your performance and access trading tools
        </p>
      </div>

      {/* Trading Journal Feature Card */}
      <div className="relative rounded-xl border border-[#ffc62d]/30 bg-gradient-to-br from-[#111111] to-[#0a0a0a] p-8 shadow-[0_0_45px_rgba(255,198,45,0.15)] overflow-hidden group">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#ffc62d]/5 blur-3xl group-hover:bg-[#ffc62d]/10 transition-all duration-700"></div>
        <div className="absolute -bottom-24 -left-24 w-40 h-40 rounded-full bg-[#ffc62d]/5 group-hover:bg-[#ffc62d]/10 transition-all duration-700"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ffc62d]/40 to-transparent"></div>

        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#ffc62d]/20 to-[#ff9500]/20 border border-[#ffc62d]/30">
                  <BookOpenIcon className="w-8 h-8 text-[#ffc62d]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Comprehensive Trading Journal</h2>
                  <p className="text-gray-400 mt-1">
                    Track trades, analyze performance, and project future growth
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-black/20 border border-white/5">
                  <div className="w-8 h-8 rounded-full bg-[#ffc62d]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="h-4 w-4 text-[#ffc62d]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Calendar with P&L Tracking</h3>
                    <p className="text-sm text-gray-400 mt-1">Visual calendar showing daily profits and losses</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-black/20 border border-white/5">
                  <div className="w-8 h-8 rounded-full bg-[#ffc62d]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="h-4 w-4 text-[#ffc62d]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Strategy Confluence Checklists</h3>
                    <p className="text-sm text-gray-400 mt-1">Pre-built checklists for popular trading strategies</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-black/20 border border-white/5">
                  <div className="w-8 h-8 rounded-full bg-[#ffc62d]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="h-4 w-4 text-[#ffc62d]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Automatic Calculations</h3>
                    <p className="text-sm text-gray-400 mt-1">Real-time P&L, win rate, and performance metrics</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-black/20 border border-white/5">
                  <div className="w-8 h-8 rounded-full bg-[#ffc62d]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="h-4 w-4 text-[#ffc62d]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Account Growth Projections</h3>
                    <p className="text-sm text-gray-400 mt-1">Simulate future growth based on your performance</p>
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard/trading-tools/journal"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ffc62d] to-[#ff9500] px-6 py-3 text-base font-semibold text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,198,45,0.4)] active:scale-95"
              >
                Open Trading Journal
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
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

      {/* Position Size Calculator */}
      <PositionSizeCalculator />

      {/* Trading Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Management */}
        <div className="rounded-lg bg-[#111111] p-6 shadow-[0_0_20px_rgba(17,17,17,0.5)] border border-gray-800">
          <h3 className="text-lg font-semibold mb-2">Risk Management</h3>
          <p className="text-gray-400 text-sm mb-4">Track your daily risk limits and exposure</p>
          {/* TODO: Implement risk management tools */}
        </div>

        {/* Trade Analytics */}
        <div className="rounded-lg bg-[#111111] p-6 shadow-[0_0_20px_rgba(17,17,17,0.5)] border border-gray-800">
          <h3 className="text-lg font-semibold mb-2">Trade Analytics</h3>
          <p className="text-gray-400 text-sm mb-4">Analyze your trading performance and patterns</p>
          {/* TODO: Implement analytics */}
        </div>
      </div>
    </div>
  );
} 