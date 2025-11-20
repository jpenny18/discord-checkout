'use client';

import { useState } from 'react';
import { TrashIcon, CheckIcon } from '@heroicons/react/24/outline';
import { TradeEntry, TradingStrategy } from '@/types/trading-journal';

interface TradeEntryFormProps {
  trades: TradeEntry[];
  onAddTrade: (trade: Omit<TradeEntry, 'id' | 'timestamp'>) => void;
  onDeleteTrade: (tradeId: string) => void;
  strategy: string;
  confluenceChecklist: { [key: string]: boolean };
  selectedDate: string;
  selectedStrategy: TradingStrategy | null;
  strategies: TradingStrategy[];
  onStrategySelect: (strategy: TradingStrategy | null) => void;
  onConfluenceChange: (itemId: string, checked: boolean) => void;
}

const TIMEFRAMES = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', 'Swing', 'Scalp'];

// Modal component for trade added confirmation
const TradeAddedModal = ({ isOpen, isLoading }: { isOpen: boolean; isLoading: boolean }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-lg bg-[#111111] border border-white/10 p-8 text-center shadow-xl">
        {isLoading ? (
          <>
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-[#ffc62d] border-t-transparent" />
            <p className="text-lg text-white">Adding trade...</p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
              <CheckIcon className="h-8 w-8 text-white" />
            </div>
            <p className="text-lg font-semibold text-white">Trade Added!</p>
          </>
        )}
      </div>
    </div>
  );
};

export default function TradeEntryForm({ 
  trades, 
  onAddTrade, 
  onDeleteTrade,
  strategy,
  confluenceChecklist,
  selectedDate,
  selectedStrategy,
  strategies,
  onStrategySelect,
  onConfluenceChange,
}: TradeEntryFormProps) {
  const getDayName = (dateString: string) => {
    const date = new Date(dateString + 'T12:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [symbol, setSymbol] = useState('');
  const [timeframe, setTimeframe] = useState('Scalp');
  const [position, setPosition] = useState<'long' | 'short'>('long');
  const [outcome, setOutcome] = useState<'win' | 'loss'>('win');
  const [pnl, setPnl] = useState('');
  const [riskPercent, setRiskPercent] = useState('');
  const [riskRewardRatio, setRiskRewardRatio] = useState('');
  const [feesInput, setFeesInput] = useState('');
  const [confidence, setConfidence] = useState(5);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddTrade = async () => {
    if (!symbol || !pnl) {
      alert('Please fill in Symbol and P&L');
      return;
    }

    const pnlValue = parseFloat(pnl);
    if (isNaN(pnlValue)) {
      alert('Please enter a valid P&L number');
      return;
    }

    // Show loading modal
    setShowModal(true);
    setIsLoading(true);

    // Auto-adjust P&L sign based on outcome
    const adjustedPnl = outcome === 'win' ? Math.abs(pnlValue) : -Math.abs(pnlValue);

    const trade: Omit<TradeEntry, 'id' | 'timestamp'> = {
      date: selectedDate,
      day: getDayName(selectedDate),
      symbol: symbol.toUpperCase(),
      strategy,
      timeframe,
      position,
      outcome,
      pnl: adjustedPnl,
      confluenceChecklist,
    };

    // Add optional fields only if they have values
    if (riskPercent) trade.riskPercent = parseFloat(riskPercent);
    if (riskRewardRatio) trade.riskRewardRatio = parseFloat(riskRewardRatio);
    if (feesInput) trade.totalFees = parseFloat(feesInput);
    if (confidence) trade.confidence = confidence;
    if (duration) trade.duration = duration;
    if (notes) trade.notes = notes;

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onAddTrade(trade);

    // Show success message
    setIsLoading(false);
    setTimeout(() => {
      setShowModal(false);
    }, 1500);

    // Reset form
    setSymbol('');
    setPnl('');
    setRiskPercent('');
    setRiskRewardRatio('');
    setFeesInput('');
    setConfidence(5);
    setDuration('');
    setNotes('');
  };

  // Calculate statistics
  const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const totalFees = trades.reduce((sum, trade) => sum + (trade.totalFees || 0), 0);
  const netPnL = totalPnL - totalFees;
  const winningTrades = trades.filter(t => t.outcome === 'win');
  const losingTrades = trades.filter(t => t.outcome === 'loss');
  const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;
  const averageWin = winningTrades.length > 0
    ? winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length
    : 0;
  const averageLoss = losingTrades.length > 0
    ? Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0)) / losingTrades.length
    : 0;
  const largestWin = trades.length > 0 ? Math.max(...trades.map(t => t.pnl)) : 0;
  const largestLoss = trades.length > 0 ? Math.min(...trades.map(t => t.pnl)) : 0;

  const avgConfidence = trades.filter(t => t.confidence).length > 0
    ? trades.filter(t => t.confidence).reduce((sum, t) => sum + (t.confidence || 0), 0) / trades.filter(t => t.confidence).length
    : 0;
  
  // Calculate average risk percentage
  const avgRiskPercent = trades.filter(t => t.riskPercent).length > 0
    ? trades.filter(t => t.riskPercent).reduce((sum, t) => sum + (t.riskPercent || 0), 0) / trades.filter(t => t.riskPercent).length
    : 0;
  
  // Calculate average risk reward ratio
  const avgRR = trades.filter(t => t.riskRewardRatio).length > 0
    ? trades.filter(t => t.riskRewardRatio).reduce((sum, t) => sum + (t.riskRewardRatio || 0), 0) / trades.filter(t => t.riskRewardRatio).length
    : 0;
  
  // Calculate profit factor
  const totalWins = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
  const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));
  const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0;

  const getChecklistProgress = () => {
    if (!selectedStrategy) return 0;
    const total = selectedStrategy.confluenceChecklist.length;
    const checked = Object.values(confluenceChecklist).filter(Boolean).length;
    return total > 0 ? (checked / total) * 100 : 0;
  };

  const getRequiredProgress = () => {
    if (!selectedStrategy) return 0;
    const required = selectedStrategy.confluenceChecklist.filter(item => item.required);
    const requiredChecked = required.filter(item => confluenceChecklist[item.id]).length;
    return required.length > 0 ? (requiredChecked / required.length) * 100 : 0;
  };

  return (
    <>
      <TradeAddedModal isOpen={showModal} isLoading={isLoading} />
      
      <div className="space-y-6">
        {/* Strategy and Trade Entry Form - Side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side: Strategy Selection */}
          <div className="rounded-lg bg-[#111111] border border-white/5 shadow-[0_0_30px_rgba(17,17,17,0.7)]">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">Trading Strategy</h2>
            </div>

            <div className="p-6">
              {/* Strategy Selector */}
              <div className="space-y-3 mb-6">
                <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider">Select Strategy</label>
                <select
                  value={selectedStrategy?.id || ''}
                  onChange={(e) => {
                    const strategy = strategies.find(s => s.id === e.target.value) || null;
                    onStrategySelect(strategy);
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 text-white focus:border-[#ffc62d] focus:outline-none transition-all"
                >
                  <option value="">Choose a trading strategy...</option>
                  {strategies.map(strat => (
                    <option key={strat.id} value={strat.id}>
                      {strat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Strategy Details */}
              {selectedStrategy && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-[#0a0a0a] border border-white/5">
                    <p className="text-sm text-gray-300 leading-relaxed">{selectedStrategy.description}</p>
                  </div>

                  {/* Confluence Checklist */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        Confluence Checklist
                      </h3>
                      <span className="text-xs text-gray-500">
                        {Object.values(confluenceChecklist).filter(Boolean).length} / {selectedStrategy.confluenceChecklist.length} checked
                      </span>
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">Overall Progress</span>
                          <span className="text-gray-400">{Math.round(getChecklistProgress())}%</span>
                        </div>
                        <div className="h-2 bg-[#0a0a0a] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#ffc62d] transition-all duration-300"
                            style={{ width: `${getChecklistProgress()}%` }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">Required Items</span>
                          <span className={`font-medium ${getRequiredProgress() === 100 ? 'text-green-400' : 'text-red-400'}`}>
                            {Math.round(getRequiredProgress())}%
                          </span>
                        </div>
                        <div className="h-2 bg-[#0a0a0a] rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              getRequiredProgress() === 100 ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${getRequiredProgress()}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Checklist Items */}
                    <div className="space-y-2">
                      {selectedStrategy.confluenceChecklist.map(item => (
                        <div
                          key={item.id}
                          className={`
                            p-3 rounded-lg border transition-all
                            ${confluenceChecklist[item.id]
                              ? 'bg-green-500/5 border-green-500/20'
                              : 'bg-[#0a0a0a] border-white/5'
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
                                  w-4 h-4 rounded border-2 flex items-center justify-center transition-all
                                  ${confluenceChecklist[item.id]
                                    ? 'bg-green-500 border-green-500'
                                    : 'bg-[#111111] border-white/20'
                                  }
                                `}
                              >
                                {confluenceChecklist[item.id] && (
                                  <CheckIcon className="w-3 h-3 text-white" />
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-white">{item.label}</span>
                                {item.required && (
                                  <span className="px-1.5 py-0.5 bg-red-500/20 border border-red-500/30 rounded text-[10px] font-medium text-red-400">
                                    REQ
                                  </span>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.description}</p>
                              )}
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Trade Entry Form */}
          <div className="rounded-lg bg-[#111111] border border-white/5 shadow-[0_0_30px_rgba(17,17,17,0.7)]">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">Add Trade Entry</h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-[#0a0a0a] border border-white/5">
                  {/* Date (Auto-populated) */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      value={selectedDate}
                      disabled
                      className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-white/10 text-gray-400 cursor-not-allowed text-sm"
                    />
                  </div>

                  {/* Day (Auto-populated) */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Day
                    </label>
                    <input
                      type="text"
                      value={getDayName(selectedDate)}
                      disabled
                      className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-white/10 text-gray-400 cursor-not-allowed text-sm"
                    />
                  </div>

                  {/* Strategy (Auto-populated) */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Strategy
                    </label>
                    <input
                      type="text"
                      value={strategy}
                      disabled
                      className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-white/10 text-gray-400 cursor-not-allowed text-sm"
                    />
                  </div>

                  {/* Market/Symbol */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Market / Symbol
                    </label>
                    <input
                      type="text"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-white/10 text-white placeholder-gray-500 focus:border-[#ffc62d] focus:outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Trade Details Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Trade Details</h3>
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-[#0a0a0a] border border-white/5">
                  {/* Timeframe */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Timeframe
                    </label>
                    <select
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-white/10 text-white focus:border-[#ffc62d] focus:outline-none transition-all text-sm">
                      {TIMEFRAMES.map(tf => (
                        <option key={tf} value={tf}>{tf}</option>
                      ))}
                    </select>
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Position
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPosition('long')}
                        className={`
                          flex-1 py-2 rounded-lg font-medium transition-all text-sm
                          ${position === 'long'
                            ? 'bg-green-500 text-white'
                            : 'bg-[#111111] text-gray-400 border border-white/10 hover:border-green-500/50'
                          }
                        `}
                      >
                        Long
                      </button>
                      <button
                        onClick={() => setPosition('short')}
                        className={`
                          flex-1 py-2 rounded-lg font-medium transition-all text-sm
                          ${position === 'short'
                            ? 'bg-red-500 text-white'
                            : 'bg-[#111111] text-gray-400 border border-white/10 hover:border-red-500/50'
                          }
                        `}
                      >
                        Short
                      </button>
                    </div>
                  </div>

                  {/* Outcome */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Outcome
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setOutcome('win')}
                        className={`
                          flex-1 py-2 rounded-lg font-medium transition-all text-sm
                          ${outcome === 'win'
                            ? 'bg-green-500 text-white'
                            : 'bg-[#111111] text-gray-400 border border-white/10 hover:border-green-500/50'
                          }
                        `}
                      >
                        ✓ Win
                      </button>
                      <button
                        onClick={() => setOutcome('loss')}
                        className={`
                          flex-1 py-2 rounded-lg font-medium transition-all text-sm
                          ${outcome === 'loss'
                            ? 'bg-red-500 text-white'
                            : 'bg-[#111111] text-gray-400 border border-white/10 hover:border-red-500/50'
                          }
                        `}
                      >
                        ✗ Loss
                      </button>
                    </div>
                  </div>

                  {/* P&L */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      P&L ($)
                    </label>
                    <div className="relative">
                      <span className={`
                        absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium
                        ${outcome === 'win' ? 'text-green-500' : 'text-red-500'}
                      `}>
                        $
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        value={pnl}
                        onChange={(e) => setPnl(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#111111] border border-white/10 text-white placeholder-gray-500 focus:border-[#ffc62d] focus:outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Management Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Risk Management</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-lg bg-[#0a0a0a] border border-white/5">
                  {/* Risk % */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Risk %
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={riskPercent}
                      onChange={(e) => setRiskPercent(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-white/10 text-white placeholder-gray-500 focus:border-[#ffc62d] focus:outline-none transition-all text-sm"
                    />
                  </div>

                  {/* Risk:Reward */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      R:R Ratio
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={riskRewardRatio}
                      onChange={(e) => setRiskRewardRatio(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-white/10 text-white placeholder-gray-500 focus:border-[#ffc62d] focus:outline-none transition-all text-sm"
                    />
                  </div>

                  {/* Total Fees */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Fees ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={feesInput}
                      onChange={(e) => setFeesInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-white/10 text-white placeholder-gray-500 focus:border-[#ffc62d] focus:outline-none transition-all text-sm"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-white/10 text-white placeholder-gray-500 focus:border-[#ffc62d] focus:outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Confidence & Notes Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Analysis</h3>
                <div className="space-y-4 p-4 rounded-lg bg-[#0a0a0a] border border-white/5">
                  {/* Confidence Slider */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">
                      Confidence Level: {confidence}/10
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">1</span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={confidence}
                        onChange={(e) => setConfidence(parseInt(e.target.value))}
                        className="flex-1 h-2 bg-[#111111] rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #ffc62d 0%, #ffc62d ${confidence * 10}%, #111111 ${confidence * 10}%, #111111 100%)`
                        }}
                      />
                      <span className="text-xs text-gray-500">10</span>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Trade Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Enter any observations or learnings..."
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-white/10 text-white placeholder-gray-500 focus:border-[#ffc62d] focus:outline-none transition-all resize-none text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Add Trade Button */}
              <button
                onClick={handleAddTrade}
                disabled={!selectedStrategy}
                className={`
                  w-full py-3 rounded-lg font-medium transition-all
                  ${selectedStrategy
                    ? 'bg-[#ffc62d] text-black hover:bg-[#ffc62d]/90'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {selectedStrategy ? 'Add Trade' : 'Select a Strategy First'}
              </button>
            </div>
          </div>
        </div>

      {/* Combined Card: Trade List and Statistics */}
      <div className="rounded-lg bg-[#111111] p-6 border border-white/5 shadow-[0_0_30px_rgba(17,17,17,0.7)]">
        {/* Trade List */}
        {trades.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Trade Entries ({trades.length})</h3>
            
            {/* Table Container */}
            <div className="overflow-x-auto scrollbar-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 px-2">#</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 px-2">Symbol</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 px-2">Timeframe</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 px-2">Position</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 px-2">Outcome</th>
                    <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 px-2">P&L</th>
                    <th className="text-center text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 px-2">Risk %</th>
                    <th className="text-center text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 px-2">R:R</th>
                    <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 px-2">Fees</th>
                    <th className="text-center text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 px-2">Confidence</th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 px-2">Duration</th>
                    <th className="text-center text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {trades.map((trade, index) => (
                    <tr 
                      key={trade.id}
                      className="hover:bg-white/5 transition-all"
                    >
                      <td className="py-3 px-2 text-sm font-semibold text-white">
                        {index + 1}
                      </td>
                      <td className="py-3 px-2 text-sm font-medium text-white">
                        {trade.symbol}
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-300">
                        {trade.timeframe}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`
                          px-2 py-0.5 rounded text-xs font-medium
                          ${trade.position === 'long'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                          }
                        `}>
                          {trade.position.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`
                          px-2 py-0.5 rounded text-xs font-medium
                          ${trade.outcome === 'win'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                          }
                        `}>
                          {trade.outcome === 'win' ? 'WIN' : 'LOSS'}
                        </span>
                      </td>
                      <td className={`
                        py-3 px-2 text-sm font-semibold text-right
                        ${trade.outcome === 'win' ? 'text-green-500' : 'text-red-500'}
                      `}>
                        ${trade.pnl.toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-sm text-center text-gray-300">
                        {trade.riskPercent ? `${trade.riskPercent}%` : '-'}
                      </td>
                      <td className="py-3 px-2 text-sm text-center text-gray-300">
                        {trade.riskRewardRatio ? `1:${trade.riskRewardRatio}` : '-'}
                      </td>
                      <td className="py-3 px-2 text-sm text-right text-gray-300">
                        {trade.totalFees ? `$${trade.totalFees.toFixed(2)}` : '-'}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {trade.confidence ? (
                          <div className="flex items-center justify-center gap-1">
                            <div className="w-16 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gray-500 transition-all"
                                style={{ width: `${(trade.confidence / 10) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400 font-medium">{trade.confidence}</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-300">
                        {trade.duration || '-'}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <button
                          onClick={() => onDeleteTrade(trade.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all"
                        >
                          <TrashIcon className="w-4 h-4 text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Notes Section - Display separately below table */}
            {trades.some(trade => trade.notes) && (
              <div className="mt-4 space-y-2">
                {trades.map((trade, index) => 
                  trade.notes ? (
                    <div key={trade.id} className="p-3 rounded-lg bg-[#1a1a1a] border border-white/5">
                      <span className="text-xs font-medium text-gray-400">Trade #{index + 1} Notes:</span>
                      <p className="text-sm text-gray-300 mt-1">{trade.notes}</p>
                    </div>
                  ) : null
                )}
              </div>
            )}
          </div>
        )}

        {/* Statistics in same card */}
        <div className={trades.length > 0 ? 'pt-6 border-t border-white/5' : ''}>
          <h3 className="text-xl font-bold text-white mb-4">Today's Statistics</h3>
          
          {/* Statistics Table */}
          <div className="overflow-x-auto scrollbar-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 px-2">Trades</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 px-2">Wins</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 px-2">Losses</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 px-2">Win Rate</th>
                  <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 px-2">Total P&L</th>
                  <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 px-2">Total Fees</th>
                  <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 px-2">Net P&L</th>
                  <th className="text-center text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 px-2">Avg Risk %</th>
                  <th className="text-center text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 px-2">Avg R:R</th>
                  <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 px-2">Avg Win</th>
                  <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 px-2">Avg Loss</th>
                  <th className="text-center text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 px-2">Avg Conf.</th>
                  <th className="text-center text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 px-2">P. Factor</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-[#1a1a1a]">
                  <td className="py-3 px-2 text-sm text-gray-300">
                    {trades.length}
                  </td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-sm font-medium">
                      {winningTrades.length}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-sm font-medium">
                      {losingTrades.length}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-300">
                    {winRate.toFixed(1)}%
                  </td>
                  <td className="py-3 px-2 text-sm text-right text-gray-300">
                    ${totalPnL.toFixed(2)}
                  </td>
                  <td className="py-3 px-2 text-sm text-right text-gray-300">
                    ${totalFees.toFixed(2)}
                  </td>
                  <td className={`py-3 px-2 text-sm font-bold text-right ${netPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${netPnL.toFixed(2)}
                  </td>
                  <td className="py-3 px-2 text-sm text-center text-gray-300">
                    {avgRiskPercent > 0 ? `${avgRiskPercent.toFixed(2)}%` : '-'}
                  </td>
                  <td className="py-3 px-2 text-sm text-center text-gray-300">
                    {avgRR > 0 ? `1:${avgRR.toFixed(2)}` : '-'}
                  </td>
                  <td className="py-3 px-2 text-sm text-right text-gray-300">
                    ${averageWin.toFixed(2)}
                  </td>
                  <td className="py-3 px-2 text-sm text-right text-gray-300">
                    ${Math.abs(averageLoss).toFixed(2)}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {avgConfidence > 0 ? (
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-16 h-2 bg-[#111111] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gray-500 transition-all"
                            style={{ width: `${(avgConfidence / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-300">{avgConfidence.toFixed(1)}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="text-sm text-gray-300">
                      {profitFactor.toFixed(2)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
    </div>
    </div>
    </>
  );
}