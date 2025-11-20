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

  // Load overall stats
  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

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
      const stats = await getJournalStats(user.uid);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg bg-[#111111] p-6 border border-white/5 shadow-[0_0_30px_rgba(17,17,17,0.7)]">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/dashboard/trading-tools"
            className="p-2 rounded-lg bg-[#1a1a1a] border border-white/10 hover:border-[#ffc62d]/50 transition-all"
          >
            <ArrowLeftIcon className="w-5 h-5 text-white" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Trading Journal</h1>
            <p className="mt-2 text-gray-400">
              Track your trades, analyze performance, and project future growth
            </p>
          </div>
        </div>

      </div>

      {/* Show selected date info */}
      {selectedDate && (
        <div className="rounded-lg bg-[#1a1a1a] border border-[#ffc62d]/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-400">Selected Date:</span>
              <span className="ml-2 text-lg font-semibold text-white">
                {/* Add T12:00:00 to avoid timezone issues */}
                {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            {selectedDate === new Date().toISOString().split('T')[0] && (
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium">
                Today
              </span>
            )}
          </div>
        </div>
      )}

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
              netPnL: journalStats?.netPnL || 0
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

      {/* Account Projections */}
      {journalStats && journalStats.totalTrades > 0 && initialBalance !== null && (
        <AccountProjections
          currentBalance={initialBalance + journalStats.netPnL} // Use actual balance
          avgDailyReturn={journalStats.expectancy || 10} // Average $ per trade as proxy for daily
          tradingDaysPerWeek={5} // You can make this configurable
        />
      )}
    </div>
  );
}

