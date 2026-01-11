'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import TradingCalendar from '@/components/trading-journal/TradingCalendar';
import StrategySelector from '@/components/trading-journal/StrategySelector';
import TradeEntryForm from '@/components/trading-journal/TradeEntryForm';
import AccountProjections from '@/components/trading-journal/AccountProjections';
import JournalStatCards from '@/components/trading-journal/JournalStatCards';
import { tradingStrategies } from '@/data/trading-strategies';
import {
  CalendarDay,
  TradingStrategy,
  TradeEntry,
  DayJournal,
  JournalStats,
} from '@/types/trading-journal';
import {
  getCalendarData,
  getDayJournal,
  addTrade,
  deleteTrade,
  getJournalStats,
  getTradingJournalSettings,
  saveTradingJournalSettings,
} from '@/lib/trading-journal';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function TradingJournalPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<TradingStrategy | null>(null);
  const [confluenceChecklist, setConfluenceChecklist] = useState<Record<string, boolean>>({});
  const [trades, setTrades] = useState<TradeEntry[]>([]);
  const [journalStats, setJournalStats] = useState<JournalStats | null>(null);
  const [initialBalance, setInitialBalance] = useState<number | null>(null);

  // Save initial balance when it changes
  const handleInitialBalanceChange = async (newBalance: number) => {
    if (!user) return;
    
    setInitialBalance(newBalance);
    try {
      await saveTradingJournalSettings(user.uid, { initialBalance: newBalance });
    } catch (error) {
      console.error('Error saving initial balance:', error);
    }
  };

  // Load calendar data when month changes
  useEffect(() => {
    if (user) {
      loadCalendarData();
    }
  }, [user, currentMonth]);

  // Load day journal when date is selected
  useEffect(() => {
    if (user && selectedDate) {
      loadDayJournal();
    }
  }, [user, selectedDate]);

  // Load overall stats - now filtered by current month
  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user, currentMonth]); // Added currentMonth dependency

  // Load trading journal settings
  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;
    
    try {
      const settings = await getTradingJournalSettings(user.uid);
      if (settings?.initialBalance) {
        setInitialBalance(settings.initialBalance);
      }
    } catch (error) {
      console.error('Error loading trading journal settings:', error);
    }
  };

  const loadCalendarData = async () => {
    if (!user) return;

    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const data = await getCalendarData(user.uid, year, month);
      setCalendarData(data);
    } catch (error) {
      console.error('Error loading calendar data:', error);
    }
  };

  const loadDayJournal = async () => {
    if (!user || !selectedDate) return;

    try {
      const journal = await getDayJournal(user.uid, selectedDate);
      
      if (journal) {
        setTrades(journal.trades);
        
        // Load strategy if exists
        const strategy = tradingStrategies.find(s => s.id === journal.strategy);
        if (strategy) {
          setSelectedStrategy(strategy);
          
          // Load confluence checklist from first trade if available
          if (journal.trades.length > 0 && journal.trades[0].confluenceChecklist) {
            setConfluenceChecklist(journal.trades[0].confluenceChecklist);
          }
        } else if (journal.trades.length > 0 && journal.trades[0].strategy) {
          // Try to load strategy from first trade
          const tradeStrategy = tradingStrategies.find(s => s.id === journal.trades[0].strategy);
          if (tradeStrategy) {
            setSelectedStrategy(tradeStrategy);
            if (journal.trades[0].confluenceChecklist) {
              setConfluenceChecklist(journal.trades[0].confluenceChecklist);
            }
          }
        }
      } else {
        // New day - don't clear strategy, just clear trades
        setTrades([]);
        // Keep the previously selected strategy if there is one
        if (!selectedStrategy) {
          setConfluenceChecklist({});
        }
      }
    } catch (error) {
      console.error('Error loading day journal:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!user) return;

    try {
      // Get stats for the current month only
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      
      const stats = await getJournalStats(user.uid, startDate, endDate);
      setJournalStats(stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setLoading(true);
  };

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
  };

  const handleStrategySelect = (strategy: TradingStrategy | null) => {
    setSelectedStrategy(strategy);
    
    if (!strategy) {
      setConfluenceChecklist({});
      return;
    }
    
    // Initialize confluence checklist
    const checklist: Record<string, boolean> = {};
    strategy.confluenceChecklist.forEach(item => {
      checklist[item.id] = false;
    });
    setConfluenceChecklist(checklist);
  };

  const handleConfluenceChange = (itemId: string, checked: boolean) => {
    setConfluenceChecklist(prev => ({
      ...prev,
      [itemId]: checked,
    }));
  };

  const handleAddTrade = async (trade: Omit<TradeEntry, 'id' | 'timestamp'>) => {
    if (!user || !selectedDate || !selectedStrategy) return;

    try {
      await addTrade(user.uid, selectedDate, trade);
      await loadDayJournal();
      await loadCalendarData();
      await loadStats();
    } catch (error) {
      console.error('Error adding trade:', error);
      alert('Failed to add trade. Please try again.');
    }
  };

  const handleDeleteTrade = async (tradeId: string) => {
    if (!user || !selectedDate) return;

    if (!confirm('Are you sure you want to delete this trade?')) return;

    try {
      await deleteTrade(user.uid, selectedDate, tradeId);
      await loadDayJournal();
      await loadCalendarData();
      await loadStats();
    } catch (error) {
      console.error('Error deleting trade:', error);
      alert('Failed to delete trade. Please try again.');
    }
  };

  // Auto-select today's date on initial load
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  if (!user) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Please log in to access the trading journal</p>
        </div>
      </div>
    );
  }

  const currentMonthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Header + Selected Date Combined */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 md:gap-4 mb-2 md:mb-4 border border-gray-800 rounded-lg p-2">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <Link
            href="/dashboard/trading-tools"
            className="p-2 rounded-lg border border-gray-800 hover:border-[#ffc62d]/50 transition-all"
            aria-label="Back to Trading Tools"
          >
            <ArrowLeftIcon className="w-5 h-5 text-white" />
          </Link>
          {selectedDate && (
            <span className="flex items-center flex-wrap gap-2">
              <span className="text-xs text-gray-400 md:text-sm">Selected Date:</span>
              <span className="inline-block rounded px-2 py-1 text-xs md:text-base text-[#ffc62d] font-mono tracking-wide shadow-inner border border-gray-800">
                {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                })}
              </span>
              {selectedDate === new Date().toISOString().split('T')[0] && (
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs md:text-sm font-medium">
                  Today
                </span>
              )}
            </span>
          )}
        </div>
        {/* Month Stats Indicator - Centered on mobile, right-aligned on desktop */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ffc62d]/10 border border-[#ffc62d]/30 w-full sm:w-auto justify-center sm:justify-start">
          <svg className="w-4 h-4 text-[#ffc62d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs text-[#ffc62d] font-medium whitespace-nowrap">Stats: {currentMonthName}</span>
        </div>
      </div>

      {/* Calendar and Stats Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar - 75% width */}
        <div className="lg:col-span-3">
          <TradingCalendar
            calendarData={calendarData}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
            monthlyStats={{
              totalPnL: journalStats?.totalPnL || 0,
              totalDays: calendarData.filter(d => d.hasData).length,
              netPnL: journalStats?.netPnL || 0 // This is now filtered to current month
            }}
          />
        </div>

        {/* Stats Cards - 25% width */}
        <div className="lg:col-span-1">
          <JournalStatCards
            stats={journalStats}
            initialBalance={initialBalance}
            onInitialBalanceChange={handleInitialBalanceChange}
          />
        </div>
      </div>

      {/* Step 2: Strategy Selection - Now moved inside TradeEntryForm for side-by-side layout */}

      {/* Step 3: Trade Entry and Trade Display */}
      {selectedDate && (
        <>
          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ffc62d] border-t-transparent" />
            </div>
          ) : (
            <TradeEntryForm
              trades={trades}
              onAddTrade={handleAddTrade}
              onDeleteTrade={handleDeleteTrade}
              strategy={selectedStrategy?.id || ''}
              confluenceChecklist={confluenceChecklist}
              selectedDate={selectedDate}
              selectedStrategy={selectedStrategy}
              strategies={tradingStrategies}
              onStrategySelect={handleStrategySelect}
              onConfluenceChange={handleConfluenceChange}
            />
          )}
        </>
      )}

      {/* Account Projections - Based on current month performance */}
      {journalStats && journalStats.totalTrades > 0 && initialBalance !== null && (
        <AccountProjections
          currentBalance={initialBalance + journalStats.netPnL} // Balance including current month P&L
          avgDailyReturn={journalStats.expectancy || 10} // Average $ per trade from current month
          tradingDaysPerWeek={5} // You can make this configurable
        />
      )}
    </div>
  );
}

