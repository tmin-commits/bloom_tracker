import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Droplets, Calendar, Flame } from 'lucide-react';

export default function CycleWheel({ cycleStatus, onOpenLogger, todayLog }) {
  const {
    cycleDay = 1,
    totalCycleDays = 28,
    periodLength = 5,
    ovulationDay = 14,
    phase = 'menstrual',
    phaseName = 'Menstrual Phase',
    daysUntilNextPeriod = 23,
    isPeriodDay = false,
    isFertile = false,
    chanceOfPregnancy = 'Low',
  } = cycleStatus || {};

  // Wheel dimensions
  const radius = 120;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = Math.min(1, Math.max(0, cycleDay / totalCycleDays));
  const strokeDashoffset = circumference - progressPercent * circumference;

  // Phase Theme colors
  const phaseStyles = {
    menstrual: {
      accent: 'from-rose-500 to-red-400',
      color: '#f43f5e',
      bgPill: 'bg-rose-100 text-rose-700 border-rose-200',
      badge: '🌸 Menstrual Phase'
    },
    follicular: {
      accent: 'from-cyan-400 to-teal-400',
      color: '#06b6d4',
      bgPill: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      badge: '🌱 Follicular Phase'
    },
    ovulatory: {
      accent: 'from-purple-500 to-pink-500',
      color: '#a855f7',
      bgPill: 'bg-purple-100 text-purple-800 border-purple-200',
      badge: '✨ Ovulatory Phase'
    },
    luteal: {
      accent: 'from-amber-400 to-rose-400',
      color: '#f59e0b',
      bgPill: 'bg-amber-100 text-amber-800 border-amber-200',
      badge: '🍂 Luteal Phase'
    }
  };

  const currentTheme = phaseStyles[phase] || phaseStyles.menstrual;

  return (
    <div className="relative flex flex-col items-center justify-center py-4">
      {/* Glow effect behind circle */}
      <div 
        className="absolute w-72 h-72 rounded-full blur-3xl opacity-30 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: currentTheme.color }}
      />

      {/* SVG Circle Visualizer */}
      <div className="relative w-72 h-72 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 280 280">
          <defs>
            <linearGradient id="wheelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="40%" stopColor="#e11d48" />
              <stop offset="80%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>

            <linearGradient id="menstrualSegment" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fda4af" />
            </linearGradient>

            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#f43f5e" floodOpacity="0.4"/>
            </filter>
          </defs>

          {/* Background Track */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-rose-100/70 dark:text-stone-800"
            fill="none"
          />

          {/* Menstrual Phase Indicator Arc Segment (Day 1 to PeriodLength) */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke="rgba(244, 63, 94, 0.3)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (periodLength / totalCycleDays) * circumference}
            fill="none"
            strokeLinecap="round"
          />

          {/* Fertile Window Arc Indicator */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke="rgba(168, 85, 247, 0.3)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (6 / totalCycleDays) * circumference}
            transform={`rotate(${( (ovulationDay - 5) / totalCycleDays ) * 360} 140 140)`}
            fill="none"
          />

          {/* Animated Active Progress Arc */}
          <motion.circle
            cx="140"
            cy="140"
            r={radius}
            stroke="url(#wheelGradient)"
            strokeWidth={strokeWidth + 2}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            fill="none"
            strokeLinecap="round"
            filter="url(#softGlow)"
          />

          {/* Glowing Indicator Head Bead */}
          {(() => {
            const angle = (progressPercent * 360 - 90) * (Math.PI / 180);
            const cx = 140 + radius * Math.cos(angle);
            const cy = 140 + radius * Math.sin(angle);
            return (
              <circle
                cx={cx}
                cy={cy}
                r="8"
                className="fill-white drop-shadow-md stroke-rose-500"
                strokeWidth="3"
              />
            );
          })()}
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <motion.span 
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border shadow-sm ${currentTheme.bgPill}`}
          >
            {currentTheme.badge}
          </motion.span>

          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-2"
          >
            <div className="text-4xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 font-serif">
              Day {cycleDay}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              of {totalCycleDays}-day cycle
            </div>
          </motion.div>

          <div className="mt-2 text-center">
            {isPeriodDay ? (
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-rose-600 dark:text-rose-400">
                <Droplets className="w-4 h-4 fill-rose-500" /> Period Day {cycleDay}
              </span>
            ) : daysUntilNextPeriod <= 0 ? (
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-rose-600 dark:text-rose-400">
                <Flame className="w-4 h-4" /> Period due today
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-sm font-medium text-stone-700 dark:text-stone-300">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                Period in <strong className="text-rose-600 dark:text-rose-400">{daysUntilNextPeriod}</strong> days
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pregnancy chance & Log Action button */}
      <div className="mt-4 flex flex-col items-center gap-2 w-full max-w-xs">
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-stone-600 dark:text-stone-300 bg-white/70 dark:bg-stone-800/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-stone-200/60 dark:border-stone-700/60 shadow-sm">
          <span>Chance of pregnancy:</span>
          <span className={`font-semibold px-2 py-0.5 rounded-full ${
            chanceOfPregnancy === 'Peak' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' :
            chanceOfPregnancy === 'High' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300' :
            chanceOfPregnancy === 'Medium-High' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
            'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
          }`}>
            {chanceOfPregnancy}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenLogger}
          className="w-full mt-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-pink-500 text-white font-semibold shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-rose-500/30 transition-all duration-200"
        >
          <Sparkles className="w-4 h-4" />
          {todayLog ? 'Edit Today’s Log & Symptoms' : '+ Log Today (Flow, Mood, Symptoms)'}
        </motion.button>
      </div>
    </div>
  );
}
