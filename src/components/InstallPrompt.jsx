import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share, PlusSquare, X, Smartphone, Sparkles } from 'lucide-react';

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode (installed)
    const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    const isDismissed = localStorage.getItem('bloom_install_dismissed');

    // Show prompt if not standalone and not dismissed
    if (!isStandalone && !isDismissed) {
      // Delay showing by 2 seconds so it feels natural
      const timer = setTimeout(() => setShowPrompt(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('bloom_install_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-purple-500/10 border border-rose-200/80 dark:border-rose-900/50 backdrop-blur-md relative shadow-sm"
      >
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-lg shadow-sm">
            🌸
          </div>
          <div className="flex-1 pr-4">
            <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1">
              Add Bloom to Home Screen
            </h4>
            <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-tight mt-0.5">
              Use it like a real app without browser bars! In Safari, tap <strong className="inline-flex items-center gap-0.5"><Share className="w-3 h-3 text-rose-500 inline" /> Share</strong> then <strong className="inline-flex items-center gap-0.5"><PlusSquare className="w-3 h-3 text-rose-500 inline" /> Add to Home Screen</strong>.
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
