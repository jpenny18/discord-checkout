export interface Signal {
  id: string;
  symbol: string;
  type: 'LONG' | 'SHORT';
  entry: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  takeProfit3: number;
  timestamp: Date;
  status: 'ACTIVE' | 'CLOSED' | 'STOPPED';
  result?: {
    exitPrice: number;
    profit: number;
    exitTimestamp: Date;
  };
  analysis: {
    timeframe: string;
    reason: string;
    imageUrl?: string;
  };
  risk: number;
  leverage: number;
}

export interface SignalStats {
  totalSignals: number;
  winRate: number;
  averageProfit: number;
  activeSignals: number;
} 