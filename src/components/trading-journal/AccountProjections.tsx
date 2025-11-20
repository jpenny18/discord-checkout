'use client';

import { useState, useEffect } from 'react';
import { AccountProjection, ProjectionDataPoint } from '@/types/trading-journal';
import { ChartBarIcon } from '@heroicons/react/24/outline';

interface AccountProjectionsProps {
  currentBalance: number;
  avgDailyReturn: number; // Average daily return in dollars
  tradingDaysPerWeek: number;
}

export default function AccountProjections({
  currentBalance,
  avgDailyReturn,
  tradingDaysPerWeek,
}: AccountProjectionsProps) {
  const [targetBalance, setTargetBalance] = useState('');
  const [projectionMonths, setProjectionMonths] = useState('12');
  const [projectionData, setProjectionData] = useState<ProjectionDataPoint[]>([]);
  const [compoundingEnabled, setCompoundingEnabled] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const calculateProjection = () => {
    const months = parseInt(projectionMonths) || 12;
    const tradingDaysPerMonth = (tradingDaysPerWeek * 52) / 12;
    
    const data: ProjectionDataPoint[] = [];
    let balance = currentBalance;
    let cumulativeProfit = 0;

    for (let month = 1; month <= months; month++) {
      const daysInMonth = tradingDaysPerMonth;
      let monthProfit = 0;

      if (compoundingEnabled) {
        // Compound daily
        for (let day = 0; day < daysInMonth; day++) {
          const dailyProfit = avgDailyReturn; // Now it's dollar amount per day
          balance += dailyProfit;
          monthProfit += dailyProfit;
        }
      } else {
        // Simple interest
        monthProfit = avgDailyReturn * daysInMonth;
        balance = currentBalance + (monthProfit * month);
      }

      cumulativeProfit += monthProfit;

      data.push({
        month,
        balance: parseFloat(balance.toFixed(2)),
        profit: parseFloat(monthProfit.toFixed(2)),
        cumulativeProfit: parseFloat(cumulativeProfit.toFixed(2)),
      });
    }

    setProjectionData(data);
  };

  useEffect(() => {
    calculateProjection();
  }, [currentBalance, avgDailyReturn, tradingDaysPerWeek, projectionMonths, compoundingEnabled]);

  const getMaxBalance = () => {
    if (projectionData.length === 0) return 0;
    return Math.max(...projectionData.map(d => d.balance));
  };

  const getFinalBalance = () => {
    if (projectionData.length === 0) return 0;
    return projectionData[projectionData.length - 1].balance;
  };

  const getTotalProfit = () => {
    if (projectionData.length === 0) return 0;
    return projectionData[projectionData.length - 1].cumulativeProfit;
  };

  const getTotalROI = () => {
    if (currentBalance === 0) return 0;
    return ((getTotalProfit() / currentBalance) * 100);
  };

  const getMonthsToTarget = () => {
    if (!targetBalance) return null;
    const target = parseFloat(targetBalance);
    const month = projectionData.find(d => d.balance >= target);
    return month ? month.month : null;
  };

  return (
    <div className="rounded-lg bg-[#111111] border border-white/5 shadow-[0_0_30px_rgba(17,17,17,0.7)]">
      {/* Accordion Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-[#ffc62d]/10">
            <ChartBarIcon className="w-6 h-6 text-[#ffc62d]" />
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-bold text-white">Account Growth Projections</h2>
            <p className="text-sm text-gray-400 mt-1">
              Simulate your future account growth based on current performance
            </p>
          </div>
        </div>
        <svg
          className={`w-6 h-6 text-white transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Accordion Content */}
      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="border-t border-white/5 pt-6">
            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Target Balance (Optional)
                </label>
                <input
                  type="number"
                  value={targetBalance}
                  onChange={(e) => setTargetBalance(e.target.value)}
                  placeholder="e.g., 100000"
                  className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] border border-white/10 text-white placeholder-gray-500 focus:border-[#ffc62d] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Projection Period (Months)
                </label>
                <input
                  type="number"
                  value={projectionMonths}
                  onChange={(e) => setProjectionMonths(e.target.value)}
                  min="1"
                  max="60"
                  className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] border border-white/10 text-white focus:border-[#ffc62d] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Growth Type
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCompoundingEnabled(true)}
                    className={`
                      flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all
                      ${compoundingEnabled
                        ? 'bg-[#ffc62d] text-black'
                        : 'bg-[#1a1a1a] text-gray-400 border border-white/10'
                      }
                    `}
                  >
                    Compound
                  </button>
                  <button
                    onClick={() => setCompoundingEnabled(false)}
                    className={`
                      flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all
                      ${!compoundingEnabled
                        ? 'bg-[#ffc62d] text-black'
                        : 'bg-[#1a1a1a] text-gray-400 border border-white/10'
                      }
                    `}
                  >
                    Simple
                  </button>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-gradient-to-br from-[#ffc62d]/10 to-[#ff9500]/10 border border-[#ffc62d]/20">
                <div className="text-sm text-gray-400 mb-1">Starting Balance</div>
                <div className="text-xl font-bold text-white">
                  ${currentBalance.toFixed(2)}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20">
                <div className="text-sm text-gray-400 mb-1">Final Balance</div>
                <div className="text-xl font-bold text-green-500">
                  ${getFinalBalance().toLocaleString()}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
                <div className="text-sm text-gray-400 mb-1">Total Profit</div>
                <div className="text-xl font-bold text-blue-500">
                  ${getTotalProfit().toLocaleString()}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20">
                <div className="text-sm text-gray-400 mb-1">Total ROI</div>
                <div className="text-xl font-bold text-purple-500">
                  {getTotalROI().toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Target Achievement */}
            {targetBalance && getMonthsToTarget() && (
              <div className="p-4 rounded-lg bg-[#ffc62d]/10 border border-[#ffc62d]/30 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Time to Reach Target</div>
                    <div className="text-2xl font-bold text-[#ffc62d]">
                      {getMonthsToTarget()} months
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">Target Balance</div>
                    <div className="text-xl font-bold text-white">
                      ${parseFloat(targetBalance).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {targetBalance && !getMonthsToTarget() && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 mb-6">
                <p className="text-red-400 text-sm">
                  ⚠️ Target balance not achievable within {projectionMonths} months with current performance.
                  Try increasing the projection period or improving your average daily return.
                </p>
              </div>
            )}

            {/* Projection Chart (Simple Bar Chart) */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Growth Visualization</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {projectionData.map((data) => {
                  const percentage = (data.balance / getMaxBalance()) * 100;
                  return (
                    <div key={data.month} className="flex items-center gap-3">
                      <div className="w-16 text-sm text-gray-400">
                        Month {data.month}
                      </div>
                      <div className="flex-1 relative">
                        <div className="h-8 bg-[#1a1a1a] rounded-lg overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#ffc62d] to-[#ff9500] transition-all duration-500 flex items-center justify-end pr-3"
                            style={{ width: `${percentage}%` }}
                          >
                            {percentage > 30 && (
                              <span className="text-xs font-semibold text-black">
                                ${data.balance.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        {percentage <= 30 && (
                          <span className="absolute left-2 top-1 text-xs font-semibold text-white">
                            ${data.balance.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="w-24 text-right">
                        <span className="text-xs text-green-500">
                          +${data.profit.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Assumptions */}
            <div className="p-4 rounded-lg bg-[#1a1a1a] border border-white/5">
              <h4 className="text-sm font-semibold text-white mb-2">Projection Assumptions</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-400">
                <div>
                  <span className="text-gray-500">Avg Daily Return:</span>{' '}
                  <span className="text-white font-medium">${avgDailyReturn.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Trading Days/Week:</span>{' '}
                  <span className="text-white font-medium">{tradingDaysPerWeek}</span>
                </div>
                <div>
                  <span className="text-gray-500">Growth Type:</span>{' '}
                  <span className="text-white font-medium">
                    {compoundingEnabled ? 'Compounding' : 'Simple Interest'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                ⓘ These projections are based on your historical performance and assume consistent returns.
                Actual results may vary. Past performance does not guarantee future results.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

