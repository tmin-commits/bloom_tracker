import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Heart, Activity, Apple, Dumbbell, 
  Moon, Calendar, Zap, Sun, ShieldCheck 
} from 'lucide-react';
import { PHASE_INSIGHTS } from '../../server/cycleMath.js';

export default function InsightsView({ cycleStatus, predictions, settings }) {
  const [selectedPhase, setSelectedPhase] = useState(cycleStatus?.phase || 'menstrual');

  const phases = [
    { id: 'menstrual', label: 'Menstrual', icon: '🌸', days: 'Days 1–5' },
    { id: 'follicular', label: 'Follicular', icon: '🌱', days: 'Days 6–12' },
    { id: 'ovulatory', label: 'Ovulatory', icon: '✨', days: 'Days 13–16' },
    { id: 'luteal', label: 'Luteal', icon: '🍂', days: 'Days 17–28' },
  ];

  const currentInfo = PHASE_INSIGHTS[selectedPhase] || PHASE_INSIGHTS.menstrual;

  return (
    <div className="space-y-6">
      {/* Cycle Statistics Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-rose-100 dark:border-stone-800 shadow-sm text-center">
          <div className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
            Cycle Length
          </div>
          <div className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 font-serif mt-1">
            {settings?.cycleLength || 28} <span className="text-xs font-sans text-stone-500">days</span>
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
            Regular & Healthy
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-rose-100 dark:border-stone-800 shadow-sm text-center">
          <div className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
            Period Duration
          </div>
          <div className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 font-serif mt-1">
            {settings?.periodLength || 5} <span className="text-xs font-sans text-stone-500">days</span>
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">
            Typical flow
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-rose-100 dark:border-stone-800 shadow-sm text-center">
          <div className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
            Next Period
          </div>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-serif mt-1">
            {cycleStatus?.daysUntilNextPeriod || 0} <span className="text-xs font-sans text-stone-500">days</span>
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">
            {cycleStatus?.nextPeriodDate || 'Upcoming'}
          </div>
        </div>
      </div>

      {/* Phase Tabs */}
      <div className="bg-white/80 dark:bg-stone-900/80 rounded-3xl p-5 border border-rose-100 dark:border-stone-800 shadow-sm">
        <h3 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100 mb-1">
          Hormonal Phase Masterclass
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
          Understand how your hormones change your energy, cravings, and mind each week
        </p>

        {/* Phase selector tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {phases.map((p) => {
            const isSelected = selectedPhase === p.id;
            const isCurrent = cycleStatus?.phase === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPhase(p.id)}
                className={`p-3 rounded-2xl border text-left transition-all relative ${
                  isSelected
                    ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 shadow-sm scale-102'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 hover:border-rose-200'
                }`}
              >
                {isCurrent && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-500 text-white">
                    You Are Here
                  </span>
                )}
                <div className="text-xl mb-1">{p.icon}</div>
                <div className="text-xs font-bold text-stone-800 dark:text-stone-200">{p.label}</div>
                <div className="text-[10px] text-stone-400">{p.days}</div>
              </button>
            );
          })}
        </div>

        {/* Active Phase Deep Dive */}
        <motion.div
          key={selectedPhase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-100/60 to-purple-100/60 dark:from-stone-800 dark:to-stone-800/80 border border-rose-200/50 dark:border-stone-700">
            <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">
              {currentInfo.title}
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 font-medium">
              {currentInfo.subtitle}
            </p>
            <p className="text-xs text-stone-700 dark:text-stone-200 mt-2 bg-white/70 dark:bg-stone-900/60 p-2.5 rounded-xl border border-stone-200/50 dark:border-stone-700">
              <strong>Body & Mood Cues:</strong> {currentInfo.feelings}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Nutrition */}
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 mb-1.5">
                <Apple className="w-4 h-4 text-amber-600" /> Cycle Syncing Nutrition
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                {currentInfo.nutritionTip}
              </p>
            </div>

            {/* Movement */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-1.5">
                <Dumbbell className="w-4 h-4 text-emerald-600" /> Optimal Workouts
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                {currentInfo.movementTip}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 6-Month Predictions Schedule */}
      {predictions && predictions.length > 0 && (
        <div className="bg-white/80 dark:bg-stone-900/80 rounded-3xl p-5 border border-rose-100 dark:border-stone-800 shadow-sm">
          <h3 className="text-base font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-rose-500" />
            Upcoming Cycle Forecast (Next 6 Months)
          </h3>
          <div className="space-y-2">
            {predictions.map((p, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-stone-800 dark:text-stone-200">
                    Cycle {idx + 1}
                  </span>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    Period: <strong className="text-rose-600 dark:text-rose-400">{p.periodStart}</strong> to {p.periodEnd}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                    Ovulation: {p.ovulationDate}
                  </div>
                  <div className="text-[10px] text-stone-400">
                    Fertile: {p.fertileWindowStart} - {p.fertileWindowEnd}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
