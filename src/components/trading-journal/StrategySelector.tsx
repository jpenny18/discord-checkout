'use client';

import { useState } from 'react';
import { TradingStrategy, ConfluenceItem } from '@/types/trading-journal';
import { CheckIcon } from '@heroicons/react/24/outline';

interface StrategySelectorProps {
  strategies: TradingStrategy[];
  selectedStrategy: TradingStrategy | null;
  onStrategySelect: (strategy: TradingStrategy) => void;
  confluenceChecklist: Record<string, boolean>;
  onConfluenceChange: (itemId: string, checked: boolean) => void;
}

export default function StrategySelector({
  strategies,
  selectedStrategy,
  onStrategySelect,
  confluenceChecklist,
  onConfluenceChange,
}: StrategySelectorProps) {
  const [showStrategyList, setShowStrategyList] = useState(!selectedStrategy);

  const getChecklistProgress = () => {
    if (!selectedStrategy) return 0;
    const total = selectedStrategy.confluenceChecklist.length;
    const checked = Object.values(confluenceChecklist).filter(Boolean).length;
    return Math.round((checked / total) * 100);
  };

  const getRequiredProgress = () => {
    if (!selectedStrategy) return 0;
    const required = selectedStrategy.confluenceChecklist.filter(item => item.required);
    if (required.length === 0) return 100;
    const checkedRequired = required.filter(item => confluenceChecklist[item.id]).length;
    return Math.round((checkedRequired / required.length) * 100);
  };

  return (
    <div className="rounded-lg bg-[#111111] p-6 border border-white/5 shadow-[0_0_30px_rgba(17,17,17,0.7)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Trading Strategy</h2>
          <p className="text-sm text-gray-400 mt-1">
            Select your strategy and confirm confluences
          </p>
        </div>
        {selectedStrategy && (
          <button
            onClick={() => setShowStrategyList(!showStrategyList)}
            className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-white/10 hover:border-[#ffc62d]/50 text-white text-sm transition-all"
          >
            Change Strategy
          </button>
        )}
      </div>

      {/* Strategy Selection */}
      {showStrategyList && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {strategies.map(strategy => (
            <button
              key={strategy.id}
              onClick={() => {
                onStrategySelect(strategy);
                setShowStrategyList(false);
              }}
              className={`
                p-4 rounded-lg border-2 transition-all text-left
                ${selectedStrategy?.id === strategy.id
                  ? 'bg-[#ffc62d]/10 border-[#ffc62d]'
                  : 'bg-[#1a1a1a] border-white/10 hover:border-[#ffc62d]/50'
                }
              `}
            >
              <h3 className="font-semibold text-white mb-2">{strategy.name}</h3>
              <p className="text-xs text-gray-400">{strategy.description}</p>
              <div className="mt-2 text-xs text-gray-500">
                {strategy.confluenceChecklist.length} confluence factors
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Confluence Checklist */}
      {selectedStrategy && !showStrategyList && (
        <div className="space-y-4">
          {/* Progress Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-[#1a1a1a] border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Overall Progress</span>
                <span className="text-sm font-semibold text-white">{getChecklistProgress()}%</span>
              </div>
              <div className="w-full h-2 bg-[#0a0a0a] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ffc62d] to-[#ff9500] transition-all duration-500"
                  style={{ width: `${getChecklistProgress()}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#1a1a1a] border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Required Items</span>
                <span className="text-sm font-semibold text-white">{getRequiredProgress()}%</span>
              </div>
              <div className="w-full h-2 bg-[#0a0a0a] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    getRequiredProgress() === 100
                      ? 'bg-gradient-to-r from-green-500 to-green-400'
                      : 'bg-gradient-to-r from-red-500 to-red-400'
                  }`}
                  style={{ width: `${getRequiredProgress()}%` }}
                />
              </div>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-3">
            {selectedStrategy.confluenceChecklist.map(item => (
              <div
                key={item.id}
                className={`
                  p-4 rounded-lg border transition-all
                  ${confluenceChecklist[item.id]
                    ? 'bg-green-500/5 border-green-500/30'
                    : 'bg-[#1a1a1a] border-white/10'
                  }
                `}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className="pt-0.5">
                    <input
                      type="checkbox"
                      checked={confluenceChecklist[item.id] || false}
                      onChange={(e) => onConfluenceChange(item.id, e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`
                        w-6 h-6 rounded border-2 flex items-center justify-center transition-all
                        ${confluenceChecklist[item.id]
                          ? 'bg-green-500 border-green-500'
                          : 'bg-[#0a0a0a] border-white/20'
                        }
                      `}
                    >
                      {confluenceChecklist[item.id] && (
                        <CheckIcon className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{item.label}</span>
                      {item.required && (
                        <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-400">
                          Required
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>

          {/* Validation Message */}
          {getRequiredProgress() < 100 && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-sm text-red-400">
                ⚠️ Please complete all required confluence factors before proceeding with trades
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

