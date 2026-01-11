'use client';

import { useState } from 'react';
import { CalculatorIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PositionSizeCalculatorPage() {
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
    <div className="min-h-screen bg-[#09090b]" style={{ '--color-white': '#ffffff' } as React.CSSProperties}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/dashboard/trading-tools"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#ffc62d] transition-colors mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to Trading Tools</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="p-3 rounded-xl"
              style={{
                backgroundColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)',
              }}
            >
              <CalculatorIcon className="w-8 h-8 text-[#ffc62d]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Position Size Calculator</h1>
              <p className="text-gray-400 mt-1">Calculate optimal position sizes based on your risk parameters</p>
            </div>
          </div>
        </div>

        {/* Calculator Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border p-6 md:p-8"
          style={{
            backgroundColor: 'color-mix(in oklab, var(--color-white) 3%, transparent)',
            borderColor: 'color-mix(in oklab, var(--color-white) 8%, transparent)',
            filter: 'drop-shadow(0px 0px 10px rgba(0, 0, 0, .3))'
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#ffc62d]/50 transition-all"
                  style={{
                    backgroundColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)',
                    borderColor: 'color-mix(in oklab, var(--color-white) 10%, transparent)',
                  }}
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
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#ffc62d]/50 transition-all"
                  style={{
                    backgroundColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)',
                    borderColor: 'color-mix(in oklab, var(--color-white) 10%, transparent)',
                  }}
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
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#ffc62d]/50 transition-all"
                  style={{
                    backgroundColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)',
                    borderColor: 'color-mix(in oklab, var(--color-white) 10%, transparent)',
                  }}
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
                        : 'text-gray-400 hover:text-white'
                    }`}
                    style={calculationType !== 'percentage' ? {
                      backgroundColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)',
                    } : {}}
                  >
                    Percentage
                  </button>
                  <button
                    onClick={() => setCalculationType('price')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                      calculationType === 'price'
                        ? 'bg-[#ffc62d] text-black'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    style={calculationType !== 'price' ? {
                      backgroundColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)',
                    } : {}}
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
                  className="w-full px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#ffc62d]/50 transition-all"
                  style={{
                    backgroundColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)',
                    borderColor: 'color-mix(in oklab, var(--color-white) 10%, transparent)',
                  }}
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
                  <div 
                    className="p-4 rounded-xl border"
                    style={{
                      backgroundColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)',
                      borderColor: 'color-mix(in oklab, var(--color-white) 12%, transparent)',
                    }}
                  >
                    <p className="text-sm text-gray-400 mb-1">Position Size</p>
                    <p className="text-2xl font-bold text-[#ffc62d]">{results.positionSize} units</p>
                  </div>

                  {/* Position Value */}
                  <div 
                    className="p-4 rounded-xl border"
                    style={{
                      backgroundColor: 'color-mix(in oklab, var(--color-white) 4%, transparent)',
                      borderColor: 'color-mix(in oklab, var(--color-white) 10%, transparent)',
                    }}
                  >
                    <p className="text-sm text-gray-400 mb-1">Position Value</p>
                    <p className="text-xl font-bold text-white">${results.positionValue}</p>
                  </div>

                  {/* Risk Amount */}
                  <div 
                    className="p-4 rounded-xl border"
                    style={{
                      backgroundColor: 'color-mix(in oklab, var(--color-white) 4%, transparent)',
                      borderColor: 'color-mix(in oklab, var(--color-white) 10%, transparent)',
                    }}
                  >
                    <p className="text-sm text-gray-400 mb-1">Risk Amount</p>
                    <p className="text-xl font-bold text-red-400">${results.riskAmount}</p>
                  </div>

                  {/* Stop Loss Distance */}
                  <div 
                    className="p-4 rounded-xl border"
                    style={{
                      backgroundColor: 'color-mix(in oklab, var(--color-white) 4%, transparent)',
                      borderColor: 'color-mix(in oklab, var(--color-white) 10%, transparent)',
                    }}
                  >
                    <p className="text-sm text-gray-400 mb-1">Stop Loss Distance</p>
                    <p className="text-xl font-bold text-white">{results.stopLossDistance}</p>
                  </div>

                  {/* Leverage */}
                  <div 
                    className="p-4 rounded-xl border"
                    style={{
                      backgroundColor: 'color-mix(in oklab, var(--color-white) 4%, transparent)',
                      borderColor: 'color-mix(in oklab, var(--color-white) 10%, transparent)',
                    }}
                  >
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
                      className="p-4 rounded-xl border border-red-500/30 bg-red-500/5"
                    >
                      <p className="text-sm text-red-400 flex items-center gap-2">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        High leverage detected! Consider reducing position size.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[400px] text-gray-500">
                  <div className="text-center">
                    <CalculatorIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-sm">Enter all parameters to calculate position size</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Educational Info */}
          <div 
            className="mt-6 p-4 rounded-xl border"
            style={{
              backgroundColor: 'color-mix(in oklab, var(--color-white) 2%, transparent)',
              borderColor: 'color-mix(in oklab, var(--color-white) 5%, transparent)',
            }}
          >
            <h4 className="text-white font-semibold mb-2 text-sm">How to Use This Calculator</h4>
            <ul className="text-gray-400 text-xs space-y-1.5 leading-relaxed">
              <li>• Enter your total account size in dollars</li>
              <li>• Set your risk percentage (typically 1-2% per trade)</li>
              <li>• Input your intended entry price</li>
              <li>• Choose stop loss type (percentage from entry or absolute price)</li>
              <li>• Enter your stop loss value</li>
              <li>• The calculator will show your optimal position size and risk metrics</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
