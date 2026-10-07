import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, X, Sparkles, Send } from 'lucide-react';

export default function CareNotification({ reaction, onDismiss, onSendReply }) {
  if (!reaction) return null;

  useEffect(() => {
    // Burst gentle rose confetti when a care gift arrives!
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.2 },
      colors: ['#f43f5e', '#ec4899', '#d946ef', '#fbcfe8']
    });

    const timer = setTimeout(() => {
      onDismiss();
    }, 8000);
    return () => clearTimeout(timer);
  }, [reaction]);

  const icons = {
    hug: '🤗',
    heating_pad: '🔥',
    tea: '☕️',
    chocolate: '🍫',
    flower: '💐',
    love_note: '💋',
    custom: '💌'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md p-4 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white shadow-2xl shadow-rose-500/40 border border-white/20 flex flex-col gap-2"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 rounded-2xl bg-white/20 backdrop-blur-md">
              {icons[reaction.type] || '💖'}
            </span>
            <div>
              <div className="text-[11px] font-bold tracking-wider uppercase opacity-90 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Love Ping from {reaction.sender || 'Him'}
              </div>
              <div className="text-base font-extrabold font-serif">
                {reaction.message || 'Sent you love and comfort!'}
              </div>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick kiss reply */}
        <div className="flex items-center justify-end gap-2 pt-1 border-t border-white/15">
          <button
            onClick={() => {
              onSendReply && onSendReply('🥰 Sent back a big sweet kiss!');
              onDismiss();
            }}
            className="px-3 py-1 rounded-xl bg-white/25 hover:bg-white/35 text-white text-xs font-bold transition flex items-center gap-1"
          >
            Send Kiss Back 💋
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
