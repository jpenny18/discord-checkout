export interface TradeEntry {
  id: string;
  date: string; // YYYY-MM-DD
  day: string; // Day of week (e.g., "Monday")
  symbol: string;
  strategy: string;
  timeframe: string; // 1m, 5m, 15m, 30m, 1h, 4h, 1d, swing, scalp
  position: 'long' | 'short';
  riskPercent?: number; // Risk % of account
  outcome: 'win' | 'loss';
  pnl: number; // Profit/Loss in dollars (positive for win, negative for loss)
  riskRewardRatio?: number; // R:R ratio
  totalFees?: number;
  confidence?: number; // 1-10
  duration?: string; // How long the trade lasted
  notes?: string;
  confluenceChecklist?: Record<string, boolean>;
  timestamp: number;
}

export interface DayJournal {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  strategy?: string;
  trades: TradeEntry[];
  totalPnL: number;
  totalFees: number;
  tradeCount: number;
  winCount: number;
  lossCount: number;
  winRate: number;
  avgConfidence?: number;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  confluenceChecklist: ConfluenceItem[];
}

export interface ConfluenceItem {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
}

export interface MonthlyStats {
  month: string; // YYYY-MM
  totalPnL: number;
  totalFees: number;
  netPnL: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  largestWin: number;
  largestLoss: number;
  consecutiveWins: number;
  consecutiveLosses: number;
}

export interface JournalStats {
  totalPnL: number;
  totalFees: number;
  netPnL: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  expectancy: number;
  largestWin: number;
  largestLoss: number;
  bestDay: number;
  worstDay: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  averageTradesPerDay: number;
  avgConfidence?: number;
  avgRiskReward?: number;
}

export interface AccountProjection {
  currentBalance: number;
  targetBalance: number;
  avgDailyReturn: number;
  avgDailyReturnPercentage: number;
  tradingDaysPerWeek: number;
  projectionMonths: number;
  projectedData: ProjectionDataPoint[];
}

export interface ProjectionDataPoint {
  month: number;
  balance: number;
  profit: number;
  cumulativeProfit: number;
}

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  pnl: number;
  pnlPercentage: number;
  tradeCount: number;
  hasData: boolean;
  winCount?: number;
  avgRiskReward?: number;
}

