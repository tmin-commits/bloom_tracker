import React from 'react';
import { motion } from 'framer-motion';
import { Flower2, Calendar, Sparkles, Settings } from 'lucide-react';

export default function BottomNavBar({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'cycle', label: 'Today', icon: Flower2 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'insights', label: 'Insights', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/85 dark:bg-stone-900/85 backdrop-blur-xl border-t border-rose-100/80 dark:border-stone-800 px-6 py-2 pb-safe max-w-xl mx-auto shadow-lg shadow-rose-900/5">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className="relative py-1 px-3 flex flex-col items-center justify-center transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-rose-50 dark:bg-rose-950/50 rounded-2xl -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              
              <Icon 
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive 
                    ? 'text-rose-600 dark:text-rose-400 scale-110' 
                    : 'text-stone-400 dark:text-stone-500 hover:text-stone-600'
                }`} 
              />
              <span 
                className={`text-[10px] font-semibold mt-1 tracking-tight ${
                  isActive 
                    ? 'text-rose-600 dark:text-rose-400' 
                    : 'text-stone-400 dark:text-stone-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
