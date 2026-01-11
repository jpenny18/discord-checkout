'use client';

import { useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import { JournalStats } from '@/types/trading-journal';

interface JournalStatCardsProps {
  stats: JournalStats | null;
  initialBalance: number | null;
  onInitialBalanceChange: (newBalance: number) => void;
}

export default function JournalStatCards({
  stats,
  initialBalance,
  onInitialBalanceChange
}: JournalStatCardsProps) {
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [tempBalance, setTempBalance] = useState(initialBalance?.toString() || '');

  const currentBalance = initialBalance !== null ? initialBalance + (stats?.netPnL || 0) : null;

  const handleSaveBalance = () => {
    const newBalance = parseFloat(tempBalance);
    if (!isNaN(newBalance) && newBalance > 0) {
      onInitialBalanceChange(newBalance);
      setIsEditingBalance(false);
    }
  };

  const handleCancelEdit = () => {
    setTempBalance(initialBalance?.toString() || '');
    setIsEditingBalance(false);
  };

  return (
    <>
      {/* Mobile: Bento Box Layout - 2 Rows */}
      <div className="md:hidden space-y-3">
        {/* Row 1: Balance, Net P&L, Total Trades */}
        <div className="grid grid-cols-3 gap-3">
          {/* Account Balance Card */}
          <div className="rounded-lg bg-[#111111] p-3 border border-white/5 shadow-[0_0_30px_rgba(17,17,17,0.7)]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-medium text-gray-400 leading-tight">Balance</h3>
              <button
                onClick={() => setIsEditingBalance(true)}
                className="p-0.5 rounded hover:bg-white/5 transition-colors"
                title="Edit initial balance"
              >
                <PencilIcon className="w-3 h-3 text-gray-400" />
              </button>
            </div>
            
            {isEditingBalance ? (
              <div className="space-y-1.5">
                <input
                  type="number"
                  value={tempBalance}
                  onChange={(e) => setTempBalance(e.target.value)}
                  className="w-full px-2 py-1 rounded-lg bg-[#1a1a1a] border border-white/10 text-white text-xs focus:border-[#ffc62d] focus:outline-none"
                  placeholder="Balance"
                />
                <div className="flex gap-1">
                  <button
                    onClick={handleSaveBalance}
                    className="flex-1 py-1 rounded bg-[#ffc62d] text-black text-[10px] font-medium hover:bg-[#ffc62d]/90"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 py-1 rounded bg-[#1a1a1a] border border-white/10 text-white text-[10px] hover:border-white/20"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-base font-bold text-white truncate">
                  {currentBalance !== null ? `$${currentBalance.toFixed(2)}` : 'N/A'}
                </div>
                <div className="text-[9px] text-gray-400 mt-1 truncate">
                  P&L: <span className={stats && stats.netPnL >= 0 ? 'text-green-500' : 'text-red-500'}>
                    ${stats?.netPnL.toFixed(2) || '0.00'}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Net P&L Card */}
          <div className="rounded-lg bg-[#111111] p-3 border border-white/5 shadow-[0_0_30px_rgba(17,17,17,0.7)]">
            <h3 className="text-[10px] font-medium text-gray-400 mb-2 leading-tight">Net P&L</h3>
            <div className={`text-base font-bold truncate ${stats && stats.netPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${stats?.netPnL.toFixed(2) || '0.00'}
            </div>
          </div>

          {/* Total Trades Card */}
          <div className="rounded-lg bg-[#111111] p-3 border border-white/5 shadow-[0_0_30px_rgba(17,17,17,0.7)]">
            <h3 className="text-[10px] font-medium text-gray-400 mb-2 leading-tight">Total Trades</h3>
            <div className="text-base font-bold text-white">
              {stats?.totalTrades || 0}
            </div>
          </div>
        </div>

        {/* Row 2: Win %, Profit Factor */}
        <div className="grid grid-cols-2 gap-3">
          {/* Win Rate Card */}
          <div className="rounded-lg bg-[#111111] p-3 border border-white/5 shadow-[0_0_30px_rgba(17,17,17,0.7)]">
            <h3 className="text-[10px] font-medium text-gray-400 mb-2 leading-tight">Win %</h3>
            <div className="text-base font-bold text-white mb-2">
              {(stats?.winRate || 0).toFixed(1)}%
            </div>
            <div className="relative">
              {/* Circular progress indicator */}
              <svg className="w-full h-12" viewBox="0 0 100 50">
                {/* Background arc */}
                <path
                  d="M 10 45 A 35 35 0 0 1 90 45"
                  fill="none"
                  stroke="#333"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Progress arc */}
                <path
                  d="M 10 45 A 35 35 0 0 1 90 45"
                  fill="none"
                  stroke={stats && stats.winRate >= 50 ? '#22c55e' : '#ef4444'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${113 * (stats?.winRate || 0) / 100} 113`}
                  className="transition-all duration-500"
                />
              </svg>
              {/* Win/Loss counts */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[9px]">
                <span className="text-green-500">{stats?.winningTrades || 0}W</span>
                <span className="text-gray-400">{stats?.totalTrades || 0}</span>
                <span className="text-red-500">{stats?.losingTrades || 0}L</span>
              </div>
            </div>
          </div>

          {/* Profit Factor Card */}
          <div className="rounded-lg bg-[#111111] p-3 border border-white/5 shadow-[0_0_30px_rgba(17,17,17,0.7)]">
            <h3 className="text-[10px] font-medium text-gray-400 mb-2 leading-tight">Profit Factor</h3>
            <div className="text-base font-bold text-white mb-2">
              {stats?.profitFactor === Infinity 
                ? '∞' 
                : (stats?.profitFactor || 0).toFixed(2)
              }
            </div>
            <div className="flex justify-center mt-1">
              <svg className="w-16 h-16" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#333" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="8"
                  strokeDasharray={`${Math.min(251 * (stats?.profitFactor || 0) / 3, 251)} 251`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-500"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Vertical Stack */}
      <div className="hidden md:block space-y-4">
        {/* Account Balance Card */}
        <div className="rounded-lg bg-[#111111] p-4 border border-white/5 shadow-[0_0_30px_rgba(17,17,17,0.7)]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Account Balance & P&L</h3>
            <button
              onClick={() => setIsEditingBalance(true)}
              className="p-1 rounded hover:bg-white/5 transition-colors"
              title="Edit initial balance"
            >
              <PencilIcon className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          
          {isEditingBalance ? (
            <div className="space-y-2">
              <input
                type="number"
                value={tempBalance}
                onChange={(e) => setTempBalance(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-white/10 text-white focus:border-[#ffc62d] focus:outline-none"
                placeholder="Initial balance"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveBalance}
                  className="flex-1 py-1 rounded bg-[#ffc62d] text-black text-sm font-medium hover:bg-[#ffc62d]/90"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 py-1 rounded bg-[#1a1a1a] border border-white/10 text-white text-sm hover:border-white/20"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold text-white">
                {currentBalance !== null ? `$${currentBalance.toFixed(2)}` : 'N/A'}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                P&L: <span className={stats && stats.netPnL >= 0 ? 'text-green-500' : 'text-red-500'}>
                  ${stats?.netPnL.toFixed(2) || '0.00'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Net P&L Card */}
        <div className="rounded-lg bg-[#111111] p-4 border border-white/5 shadow-[0_0_30px_rgba(17,17,17,0.7)]">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Net P&L</h3>
          <div className={`text-2xl font-bold ${stats && stats.netPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${stats?.netPnL.toFixed(2) || '0.00'}
          </div>
        </div>

        {/* Total Trades Card */}
        <div className="rounded-lg bg-[#111111] p-4 border border-white/5 shadow-[0_0_30px_rgba(17,17,17,0.7)]">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total Trades</h3>
          <div className="text-2xl font-bold text-white">
            {stats?.totalTrades || 0}
          </div>
        </div>

        {/* Profit Factor Card */}
        <div className="rounded-lg bg-[#111111] p-4 border border-white/5 shadow-[0_0_30px_rgba(17,17,17,0.7)]">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Profit Factor</h3>
          <div className="text-2xl font-bold text-white">
            {stats?.profitFactor === Infinity 
              ? '∞' 
              : (stats?.profitFactor || 0).toFixed(2)
            }
          </div>
          <div className="mt-2">
            <svg className="w-full h-16" viewBox="0 0 100 60">
              <circle cx="50" cy="30" r="25" fill="none" stroke="#333" strokeWidth="8" />
              <circle
                cx="50"
                cy="30"
                r="25"
                fill="none"
                stroke="#22c55e"
                strokeWidth="8"
                strokeDasharray={`${Math.min(157 * (stats?.profitFactor || 0) / 3, 157)} 157`}
                strokeDashoffset="0"
                transform="rotate(-90 50 30)"
                className="transition-all duration-500"
              />
            </svg>
          </div>
        </div>

        {/* Win Rate Card */}
        <div className="rounded-lg bg-[#111111] p-4 border border-white/5 shadow-[0_0_30px_rgba(17,17,17,0.7)]">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Trade Win %</h3>
          <div className="text-2xl font-bold text-white mb-2">
            {(stats?.winRate || 0).toFixed(2)}%
          </div>
          <div className="relative">
            {/* Circular progress indicator */}
            <svg className="w-full h-20" viewBox="0 0 100 50">
              {/* Background arc */}
              <path
                d="M 10 45 A 35 35 0 0 1 90 45"
                fill="none"
                stroke="#333"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Progress arc */}
              <path
                d="M 10 45 A 35 35 0 0 1 90 45"
                fill="none"
                stroke={stats && stats.winRate >= 50 ? '#22c55e' : '#ef4444'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${113 * (stats?.winRate || 0) / 100} 113`}
                className="transition-all duration-500"
              />
            </svg>
            {/* Win/Loss counts */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs">
              <span className="text-green-500">{stats?.winningTrades || 0}</span>
              <span className="text-gray-400">{stats?.totalTrades || 0}</span>
              <span className="text-red-500">{stats?.losingTrades || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
