'use client';

import Image from 'next/image';
import { Signal } from '@/types/signal';

interface SignalCardProps {
  signal: Signal;
}

export default function SignalCard({ signal }: SignalCardProps) {
  return (
    <div className="rounded-lg bg-[#111111] p-4 transition-transform hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-white">{signal.symbol}</span>
          <span
            className={`rounded px-2 py-1 text-xs font-semibold ${
              signal.type === 'LONG'
                ? 'bg-green-900/50 text-green-400'
                : 'bg-red-900/50 text-red-400'
            }`}
          >
            {signal.type}
          </span>
        </div>
        <span
          className={`rounded px-2 py-1 text-xs font-semibold ${
            signal.status === 'ACTIVE'
              ? 'bg-blue-900/50 text-blue-400'
              : signal.status === 'CLOSED'
              ? 'bg-gray-800 text-gray-400'
              : 'bg-red-900/50 text-red-400'
          }`}
        >
          {signal.status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-400">Entry</p>
          <p className="text-white">${signal.entry.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Stop Loss</p>
          <p className="text-red-400">${signal.stopLoss.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Risk</p>
          <p className="text-white">{signal.risk}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Leverage</p>
          <p className="text-white">{signal.leverage}x</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-400">Take Profit Targets</p>
        <div className="mt-2 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">TP1</span>
            <span className="text-green-400">${signal.takeProfit1.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">TP2</span>
            <span className="text-green-400">${signal.takeProfit2.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">TP3</span>
            <span className="text-green-400">${signal.takeProfit3.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {signal.result && (
        <div className="mt-4 border-t border-gray-800 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Result</span>
            <span
              className={`text-sm font-semibold ${
                signal.result.profit > 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {signal.result.profit > 0 ? '+' : ''}{signal.result.profit.toFixed(2)}%
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-gray-400">Exit Price</span>
            <span className="text-white">${signal.result.exitPrice.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="mt-4 border-t border-gray-800 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Analysis</span>
          <span className="text-sm text-gray-400">{signal.analysis.timeframe}</span>
        </div>
        <p className="mt-2 text-sm text-white">{signal.analysis.reason}</p>
        {signal.analysis.imageUrl && (
          <div className="mt-2 aspect-video relative overflow-hidden rounded">
            <Image
              src={signal.analysis.imageUrl}
              alt="Analysis Chart"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        {signal.timestamp.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    </div>
  );
} 