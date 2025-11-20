'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { CalendarDay } from '@/types/trading-journal';

interface TradingCalendarProps {
  calendarData: CalendarDay[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  monthlyStats?: {
    totalPnL: number;
    totalDays: number;
    netPnL: number;
  };
}

export default function TradingCalendar({
  calendarData,
  selectedDate,
  onDateSelect,
  currentMonth,
  onMonthChange,
  monthlyStats
}: TradingCalendarProps) {
  const today = new Date().toISOString().split('T')[0];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (CalendarDay | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayData = calendarData.find(d => d.date === dateStr);
      
      days.push(dayData || {
        date: dateStr,
        pnl: 0,
        pnlPercentage: 0,
        tradeCount: 0,
        hasData: false,
      });
    }

    // Fill remaining cells to complete 42 cells (6 weeks)
    while (days.length < 42) {
      days.push(null);
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);

  // Calculate weekly stats for 6 weeks
  const getWeeklyStats = () => {
    const weeks: { weekNum: number; totalPnL: number; days: number }[] = [];
    
    for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
      let weekPnL = 0;
      let weekDays = 0;
      
      // Sum up this week's data (7 days per week)
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const day = days[weekIndex * 7 + dayIndex];
        if (day && day.hasData) {
          weekPnL += day.pnl;
          weekDays++;
        }
      }
      
      weeks.push({
        weekNum: weekIndex + 1,
        totalPnL: weekPnL,
        days: weekDays
      });
    }

    return weeks;
  };

  const weeklyStats = getWeeklyStats();

  const previousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    onMonthChange(today);
    onDateSelect(today.toISOString().split('T')[0]);
  };

  const getPnLColor = (pnl: number, hasData: boolean) => {
    if (!hasData) return '';
    if (pnl > 0) return 'bg-green-500/20 border-green-500/30';
    if (pnl < 0) return 'bg-red-500/20 border-red-500/30';
    return 'bg-gray-500/10 border-gray-500/30';
  };

  const getPnLTextColor = (pnl: number, hasData: boolean) => {
    if (!hasData) return 'text-gray-500';
    if (pnl > 0) return 'text-green-500';
    if (pnl < 0) return 'text-red-500';
    return 'text-gray-400';
  };

  const formatPnL = (pnl: number) => {
    const sign = pnl < 0 ? '-' : '+';
    if (Math.abs(pnl) >= 1000) {
      return `${sign}$${Math.abs(pnl / 1000).toFixed(1)}K`;
    }
    return `${sign}$${Math.abs(pnl).toFixed(0)}`;
  };

  return (
    <div className="rounded-lg bg-[#111111] border border-white/5 shadow-[0_0_30px_rgba(17,17,17,0.7)]">
      {/* Header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={previousMonth}
              className="p-2 rounded-lg bg-[#1a1a1a] border border-white/10 hover:border-[#ffc62d]/50 transition-all"
            >
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-white/10 hover:border-[#ffc62d]/50 transition-all text-sm font-medium text-white"
            >
              TODAY
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg bg-[#1a1a1a] border border-white/10 hover:border-[#ffc62d]/50 transition-all"
            >
              <ChevronRightIcon className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Monthly stats:</span>
            <span className={`text-lg font-bold ${monthlyStats && monthlyStats.netPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {monthlyStats ? formatPnL(monthlyStats.netPnL) : '$0'}
            </span>
            <span className="text-sm text-gray-400">{monthlyStats?.totalDays || 0} days</span>
          </div>
        </div>
      </div>

      {/* Calendar Table */}
      <div className="p-6">
        <table className="w-full table-fixed">
          <tbody>
            {/* Day Names Row */}
            <tr>
              {daysOfWeek.map(day => (
                <td key={day} className="p-1 w-[12.5%]">
                  <div className="h-12 rounded-lg bg-[#1a1a1a] flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-400">{day}</span>
                  </div>
                </td>
              ))}
              <td className="p-1 w-[12.5%]">
                {/* Empty cell for alignment */}
              </td>
            </tr>

            {/* Calendar Rows (6 weeks) */}
            {Array.from({ length: 6 }).map((_, weekIndex) => (
              <tr key={weekIndex}>
                {/* 7 Day Cards */}
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const dayData = days[weekIndex * 7 + dayIndex];
                  
                  if (!dayData) {
                    return (
                      <td key={`empty-${weekIndex}-${dayIndex}`} className="p-1">
                        <div className="h-24"></div>
                      </td>
                    );
                  }

                  const isToday = dayData.date === today;
                  const isSelected = dayData.date === selectedDate;
                  const dayNumber = parseInt(dayData.date.split('-')[2]);

                  return (
                    <td key={dayData.date} className="p-1">
                      <button
                        onClick={() => onDateSelect(dayData.date)}
                        className={`
                          w-full h-24 p-3 rounded-lg relative transition-all
                          ${dayData.hasData ? 'border-2' : 'border border-gray-700'}
                          ${getPnLColor(dayData.pnl, dayData.hasData)}
                          ${isSelected ? 'ring-2 ring-[#ffc62d] ring-offset-2 ring-offset-black' : ''}
                          ${isToday && !isSelected ? 'border-blue-500' : ''}
                          hover:scale-105
                        `}
                      >
                        {/* Day number - small, top right */}
                        <div className="absolute top-2 right-2 text-xs text-gray-500">
                          {dayNumber}
                        </div>
                        
                        {dayData.hasData ? (
                          <div className="flex flex-col items-end justify-center h-full pr-2">
                            {/* P&L - bold, middle right */}
                            <div className={`text-lg font-bold ${getPnLTextColor(dayData.pnl, dayData.hasData)}`}>
                              {formatPnL(dayData.pnl)}
                            </div>
                            
                            {/* Trade count - below P&L */}
                            <div className="text-[10px] text-gray-500 mt-1">
                              {dayData.tradeCount} trade{dayData.tradeCount !== 1 ? 's' : ''}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <span className={`text-lg ${isToday ? 'text-blue-500 font-medium' : 'text-gray-600'}`}>
                              {dayNumber}
                            </span>
                          </div>
                        )}
                      </button>
                    </td>
                  );
                })}
                
                {/* Weekly Breakdown Card */}
                <td className="p-1">
                  <div className="w-full h-24 p-3 rounded-lg bg-[#1a1a1a] border border-gray-700">
                    <div className="flex flex-col justify-center h-full">
                      <div className="text-xs font-medium text-gray-400">Week {weeklyStats[weekIndex].weekNum}</div>
                      <div className={`text-lg font-bold ${weeklyStats[weekIndex].totalPnL >= 0 ? 'text-green-500' : weeklyStats[weekIndex].totalPnL < 0 ? 'text-red-500' : 'text-gray-600'}`}>
                        {weeklyStats[weekIndex].totalPnL !== 0 ? formatPnL(weeklyStats[weekIndex].totalPnL) : '$0.00'}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {weeklyStats[weekIndex].days} {weeklyStats[weekIndex].days === 1 ? 'day' : 'days'}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}