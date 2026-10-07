import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Calendar as CalIcon, 
  Sparkles, Droplets, Heart 
} from 'lucide-react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isToday, parseISO 
} from 'date-fns';

export default function CalendarView({ logs, cycleStatus, predictions, onSelectDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Build calendar matrix
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  // Pre-calculate predicted dates set for fast lookup
  const predictedPeriodDays = new Set();
  const ovulationDays = new Set();
  const fertileDays = new Set();

  if (predictions && predictions.length > 0) {
    predictions.forEach(p => {
      // Period days
      let pStart = new Date(p.periodStart + 'T00:00:00');
      for (let i = 0; i < p.periodLength; i++) {
        const dStr = format(addDays(pStart, i), 'yyyy-MM-dd');
        predictedPeriodDays.add(dStr);
      }

      // Ovulation
      ovulationDays.add(p.ovulationDate);

      // Fertile window
      let fStart = new Date(p.fertileWindowStart + 'T00:00:00');
      let fEnd = new Date(p.fertileWindowEnd + 'T00:00:00');
      let curr = fStart;
      while (curr <= fEnd) {
        fertileDays.add(format(curr, 'yyyy-MM-dd'));
        curr = addDays(curr, 1);
      }
    });
  }

  return (
    <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md rounded-3xl p-5 border border-rose-100 dark:border-stone-800 shadow-sm">
      {/* Month Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <CalIcon className="w-5 h-5 text-rose-500" />
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Tap any day to view or record logs
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 rounded-2xl p-1">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-2.5 py-1 text-xs font-semibold rounded-xl hover:bg-white dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((wd, i) => (
          <div key={i} className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider py-1">
            {wd}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, index) => {
          const dateStr = format(d, 'yyyy-MM-dd');
          const isCurrentMonth = isSameMonth(d, monthStart);
          const isCurrentDay = isToday(d);
          const dayLog = logs?.[dateStr];

          // State classifications
          const hasActualFlow = dayLog && dayLog.flow && dayLog.flow !== 'none';
          const isPredictedPeriod = predictedPeriodDays.has(dateStr);
          const isOvulation = ovulationDays.has(dateStr);
          const isFertile = fertileDays.has(dateStr);
          const hasSymptoms = dayLog && ((dayLog.symptoms && dayLog.symptoms.length > 0) || (dayLog.moods && dayLog.moods.length > 0));

          let bgClass = 'bg-stone-50/50 dark:bg-stone-800/40 text-stone-700 dark:text-stone-300';
          let borderClass = 'border-transparent';

          if (hasActualFlow) {
            bgClass = 'bg-rose-500 text-white font-bold shadow-sm shadow-rose-500/30';
          } else if (isPredictedPeriod) {
            bgClass = 'bg-rose-100/70 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-dashed border-rose-300 dark:border-rose-800';
          } else if (isOvulation) {
            bgClass = 'bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border border-purple-400 font-semibold';
          } else if (isFertile) {
            bgClass = 'bg-purple-50/80 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300';
          }

          if (isCurrentDay) {
            borderClass = 'ring-2 ring-rose-500 ring-offset-2 dark:ring-offset-stone-900';
          }

          if (!isCurrentMonth) {
            bgClass = 'text-stone-300 dark:text-stone-600 bg-transparent';
          }

          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectDate(dateStr)}
              className={`relative h-14 rounded-2xl p-1 flex flex-col items-center justify-between transition-all ${bgClass} ${borderClass}`}
            >
              <span className={`text-xs font-semibold ${isCurrentDay && !hasActualFlow ? 'text-rose-600 dark:text-rose-400 font-bold' : ''}`}>
                {format(d, 'd')}
              </span>

              {/* Day markers / indicators */}
              <div className="flex items-center gap-0.5 mt-auto">
                {hasActualFlow && (
                  <Droplets className="w-3 h-3 fill-white text-white" />
                )}
                {isOvulation && !hasActualFlow && (
                  <span className="text-[10px]">✨</span>
                )}
                {dayLog?.sexualActivity && (
                  <Heart className="w-2.5 h-2.5 fill-pink-400 text-pink-400" />
                )}
                {hasSymptoms && !hasActualFlow && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-rose-100/60 dark:border-stone-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-stone-600 dark:text-stone-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-rose-500"></span>
          <span>Logged Period</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-rose-100 border border-dashed border-rose-400"></span>
          <span>Predicted Period</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-purple-100 border border-purple-400"></span>
          <span>Ovulation Day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-purple-50 border border-purple-200"></span>
          <span>Fertile Window</span>
        </div>
      </div>
    </div>
  );
}
