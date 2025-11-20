import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  DayJournal,
  TradeEntry,
  CalendarDay,
  JournalStats,
  MonthlyStats,
} from '@/types/trading-journal';

// Collection references
const JOURNALS_COLLECTION = 'tradingJournals';
const TRADES_COLLECTION = 'trades';
const SETTINGS_COLLECTION = 'tradingJournalSettings';

/**
 * User trading journal settings
 */
export interface TradingJournalSettings {
  initialBalance?: number;
  tradingDaysPerWeek?: number;
  [key: string]: any; // Allow for future settings
}

/**
 * Save user trading journal settings
 */
export async function saveTradingJournalSettings(
  userId: string,
  settings: Partial<TradingJournalSettings>
): Promise<void> {
  const settingsRef = doc(db, SETTINGS_COLLECTION, userId);
  await setDoc(settingsRef, {
    ...settings,
    updatedAt: Date.now(),
  }, { merge: true });
}

/**
 * Get user trading journal settings
 */
export async function getTradingJournalSettings(
  userId: string
): Promise<TradingJournalSettings | null> {
  const settingsRef = doc(db, SETTINGS_COLLECTION, userId);
  const settingsSnap = await getDoc(settingsRef);
  
  if (settingsSnap.exists()) {
    return settingsSnap.data() as TradingJournalSettings;
  }
  
  return null;
}

/**
 * Create or update a day's journal entry
 */
export async function saveDayJournal(
  userId: string,
  date: string,
  journalData: Partial<DayJournal>
): Promise<void> {
  const journalId = `${userId}_${date}`;
  const journalRef = doc(db, JOURNALS_COLLECTION, journalId);

  const existingJournal = await getDoc(journalRef);
  const now = Date.now();

  if (existingJournal.exists()) {
    await updateDoc(journalRef, {
      ...journalData,
      updatedAt: now,
    });
  } else {
    await setDoc(journalRef, {
      id: journalId,
      userId,
      date,
      ...journalData,
      createdAt: now,
      updatedAt: now,
    });
  }
}

/**
 * Get a specific day's journal
 */
export async function getDayJournal(
  userId: string,
  date: string
): Promise<DayJournal | null> {
  const journalId = `${userId}_${date}`;
  const journalRef = doc(db, JOURNALS_COLLECTION, journalId);
  const journalSnap = await getDoc(journalRef);

  if (journalSnap.exists()) {
    return journalSnap.data() as DayJournal;
  }

  return null;
}

/**
 * Get all journals for a user within a date range
 */
export async function getJournalsInRange(
  userId: string,
  startDate: string,
  endDate: string
): Promise<DayJournal[]> {
  // Use simple query without orderBy to avoid index requirements
  const q = query(
    collection(db, JOURNALS_COLLECTION),
    where('userId', '==', userId)
  );

  const querySnapshot = await getDocs(q);
  const allDocs = querySnapshot.docs.map(doc => doc.data() as DayJournal);
  
  // Filter and sort in memory
  return allDocs
    .filter(journal => journal.date >= startDate && journal.date <= endDate)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Get calendar data for a specific month
 */
export async function getCalendarData(
  userId: string,
  year: number,
  month: number
): Promise<CalendarDay[]> {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

  const journals = await getJournalsInRange(userId, startDate, endDate);

  return journals.map(journal => ({
    date: journal.date,
    pnl: journal.totalPnL,
    pnlPercentage: journal.totalPnLPercentage,
    tradeCount: journal.tradeCount,
    hasData: true,
    winCount: journal.winCount,
    avgRiskReward: journal.trades && journal.trades.length > 0
      ? journal.trades
          .filter(t => t.riskRewardRatio)
          .reduce((sum, t, _, arr) => sum + (t.riskRewardRatio || 0) / arr.length, 0) || undefined
      : undefined,
  }));
}

/**
 * Add a trade to a day's journal
 */
export async function addTrade(
  userId: string,
  date: string,
  trade: Omit<TradeEntry, 'id' | 'timestamp'>
): Promise<string> {
  const tradeId = `${userId}_${date}_${Date.now()}`;
  
  // Clean up the trade data - remove undefined fields
  const cleanTrade: any = {
    id: tradeId,
    date: trade.date,
    day: trade.day,
    symbol: trade.symbol,
    strategy: trade.strategy,
    timeframe: trade.timeframe,
    position: trade.position,
    outcome: trade.outcome,
    pnl: trade.pnl,
    timestamp: Date.now(),
  };

  // Only add optional fields if they have values
  if (trade.riskPercent !== undefined) cleanTrade.riskPercent = trade.riskPercent;
  if (trade.riskRewardRatio !== undefined) cleanTrade.riskRewardRatio = trade.riskRewardRatio;
  if (trade.totalFees !== undefined) cleanTrade.totalFees = trade.totalFees;
  if (trade.confidence !== undefined) cleanTrade.confidence = trade.confidence;
  if (trade.duration) cleanTrade.duration = trade.duration;
  if (trade.notes) cleanTrade.notes = trade.notes;
  if (trade.confluenceChecklist) cleanTrade.confluenceChecklist = trade.confluenceChecklist;

  const tradeData: TradeEntry = cleanTrade;

  // Get existing journal or create new one
  let journal = await getDayJournal(userId, date);
  
  if (!journal) {
    journal = {
      id: `${userId}_${date}`,
      userId,
      date,
      trades: [],
      totalPnL: 0,
      totalFees: 0,
      tradeCount: 0,
      winCount: 0,
      lossCount: 0,
      winRate: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  // Add trade to journal
  journal.trades.push(tradeData);

  // Recalculate stats
  const stats = calculateDayStats(journal.trades);
  journal = { ...journal, ...stats };

  // Save to Firebase
  await saveDayJournal(userId, date, journal);

  return tradeId;
}

/**
 * Delete a trade from a day's journal
 */
export async function deleteTrade(
  userId: string,
  date: string,
  tradeId: string
): Promise<void> {
  const journal = await getDayJournal(userId, date);
  
  if (!journal) return;

  // Remove trade
  journal.trades = journal.trades.filter(t => t.id !== tradeId);

  // Recalculate stats
  if (journal.trades.length > 0) {
    const stats = calculateDayStats(journal.trades);
    await saveDayJournal(userId, date, { ...journal, ...stats });
  } else {
    // Delete journal if no trades left
    const journalId = `${userId}_${date}`;
    await deleteDoc(doc(db, JOURNALS_COLLECTION, journalId));
  }
}

/**
 * Calculate statistics for a day's trades
 */
function calculateDayStats(trades: TradeEntry[]) {
  const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
  const totalFees = trades.reduce((sum, t) => sum + (t.totalFees || 0), 0);
  const winningTrades = trades.filter(t => t.outcome === 'win');
  const losingTrades = trades.filter(t => t.outcome === 'loss');
  const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;

  // Calculate average confidence
  const tradesWithConfidence = trades.filter(t => t.confidence !== undefined);
  const avgConfidence = tradesWithConfidence.length > 0
    ? tradesWithConfidence.reduce((sum, t) => sum + (t.confidence || 0), 0) / tradesWithConfidence.length
    : undefined;

  return {
    trades,
    totalPnL,
    totalFees,
    tradeCount: trades.length,
    winCount: winningTrades.length,
    lossCount: losingTrades.length,
    winRate,
    avgConfidence,
    updatedAt: Date.now(),
  };
}

/**
 * Get overall statistics for a user
 */
export async function getJournalStats(
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<JournalStats> {
  const start = startDate || '2000-01-01';
  const end = endDate || '2099-12-31';

  const journals = await getJournalsInRange(userId, start, end);
  
  if (journals.length === 0) {
    return {
      totalPnL: 0,
      totalFees: 0,
      netPnL: 0,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      averageWin: 0,
      averageLoss: 0,
      profitFactor: 0,
      expectancy: 0,
      largestWin: 0,
      largestLoss: 0,
      bestDay: 0,
      worstDay: 0,
      consecutiveWins: 0,
      consecutiveLosses: 0,
      averageTradesPerDay: 0,
    };
  }

  // Aggregate all trades
  const allTrades = journals.flatMap(j => j.trades);
  const winningTrades = allTrades.filter(t => t.outcome === 'win');
  const losingTrades = allTrades.filter(t => t.outcome === 'loss');

  const totalPnL = journals.reduce((sum, j) => sum + j.totalPnL, 0);
  const totalFees = journals.reduce((sum, j) => sum + (j.totalFees || 0), 0);
  const netPnL = totalPnL - totalFees;
  
  const totalWins = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
  const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));

  const averageWin = winningTrades.length > 0 ? totalWins / winningTrades.length : 0;
  const averageLoss = losingTrades.length > 0 ? totalLosses / losingTrades.length : 0;

  const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0;
  const winRate = allTrades.length > 0 ? (winningTrades.length / allTrades.length) * 100 : 0;
  const expectancy = allTrades.length > 0 ? totalPnL / allTrades.length : 0;

  const largestWin = allTrades.length > 0 ? Math.max(...allTrades.map(t => t.pnl)) : 0;
  const largestLoss = allTrades.length > 0 ? Math.min(...allTrades.map(t => t.pnl)) : 0;

  const bestDay = journals.length > 0 ? Math.max(...journals.map(j => j.totalPnL)) : 0;
  const worstDay = journals.length > 0 ? Math.min(...journals.map(j => j.totalPnL)) : 0;

  // Calculate consecutive wins/losses
  let maxConsecutiveWins = 0;
  let maxConsecutiveLosses = 0;
  let currentWinStreak = 0;
  let currentLossStreak = 0;

  allTrades.forEach(trade => {
    if (trade.outcome === 'win') {
      currentWinStreak++;
      currentLossStreak = 0;
      maxConsecutiveWins = Math.max(maxConsecutiveWins, currentWinStreak);
    } else if (trade.outcome === 'loss') {
      currentLossStreak++;
      currentWinStreak = 0;
      maxConsecutiveLosses = Math.max(maxConsecutiveLosses, currentLossStreak);
    }
  });

  // Calculate average confidence
  const tradesWithConfidence = allTrades.filter(t => t.confidence !== undefined);
  const avgConfidence = tradesWithConfidence.length > 0
    ? tradesWithConfidence.reduce((sum, t) => sum + (t.confidence || 0), 0) / tradesWithConfidence.length
    : undefined;

  // Calculate average risk/reward
  const tradesWithRR = allTrades.filter(t => t.riskRewardRatio !== undefined);
  const avgRiskReward = tradesWithRR.length > 0
    ? tradesWithRR.reduce((sum, t) => sum + (t.riskRewardRatio || 0), 0) / tradesWithRR.length
    : undefined;

  return {
    totalPnL,
    totalFees,
    netPnL,
    totalTrades: allTrades.length,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    winRate,
    averageWin,
    averageLoss,
    profitFactor,
    expectancy,
    largestWin,
    largestLoss,
    bestDay,
    worstDay,
    consecutiveWins: maxConsecutiveWins,
    consecutiveLosses: maxConsecutiveLosses,
    averageTradesPerDay: journals.length > 0 ? allTrades.length / journals.length : 0,
    avgConfidence,
    avgRiskReward,
  };
}

/**
 * Get monthly statistics
 */
export async function getMonthlyStats(
  userId: string,
  year: number,
  month: number
): Promise<MonthlyStats> {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

  const stats = await getJournalStats(userId, startDate, endDate);

  return {
    month: `${year}-${String(month).padStart(2, '0')}`,
    totalPnL: stats.totalPnL,
    totalFees: stats.totalFees,
    netPnL: stats.netPnL,
    totalTrades: stats.totalTrades,
    winningTrades: stats.winningTrades,
    losingTrades: stats.losingTrades,
    winRate: stats.winRate,
    averageWin: stats.averageWin,
    averageLoss: stats.averageLoss,
    profitFactor: stats.profitFactor,
    largestWin: stats.largestWin,
    largestLoss: stats.largestLoss,
    consecutiveWins: stats.consecutiveWins,
    consecutiveLosses: stats.consecutiveLosses,
  };
}

