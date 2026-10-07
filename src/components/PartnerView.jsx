import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Heart, Sparkles, Coffee, Flame, ShieldAlert, 
  Send, Smile, Droplets, Moon, CheckCircle2, MessageCircleHeart, Info
} from 'lucide-react';

const CARE_ACTIONS = [
  { id: 'hug', label: 'Big Warm Hug', icon: '🤗', msg: 'Sent you a giant, cozy, warm hug!' },
  { id: 'heating_pad', label: 'Heating Pad', icon: '🔥', msg: 'Delivered a toasty warm heating pad for your cramps.' },
  { id: 'tea', label: 'Hot Herbal Tea', icon: '☕️', msg: 'Brewed you a soothing cup of chamomile honey tea.' },
  { id: 'chocolate', label: 'Dark Chocolate', icon: '🍫', msg: 'Sent some rich dark chocolate for sweet serotonin!' },
  { id: 'flower', label: 'Fresh Flowers', icon: '💐', msg: 'Sent a virtual bouquet of your favorite flowers.' },
  { id: 'love_note', label: 'Sweet Kiss', icon: '💋', msg: 'Sending lots of loving kisses and endless cuddles.' },
];

export default function PartnerView({ 
  cycleStatus, 
  phaseDetail, 
  todayLog, 
  settings, 
  onSendCare, 
  careReactions = [] 
}) {
  const [customMsg, setCustomMsg] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const girlfriendName = settings?.userName || 'Your Girlfriend';
  const partnerName = settings?.partnerName || 'You';

  const handleSendQuickCare = async (action) => {
    await onSendCare({
      type: action.id,
      message: action.msg,
      sender: partnerName
    });

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#a855f7', '#ec4899', '#f43f5e']
    });

    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 2500);
  };

  const handleSendCustomNote = async (e) => {
    e.preventDefault();
    if (!customMsg.trim()) return;

    await onSendCare({
      type: 'custom',
      message: customMsg.trim(),
      sender: partnerName
    });

    setCustomMsg('');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Real-time Hero Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-rose-500/10 border border-purple-200/60 dark:border-purple-900/40 backdrop-blur-md shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-wide uppercase text-purple-700 dark:text-purple-300">
              Live Partner Sync Active
            </span>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-white/80 dark:bg-stone-800 font-medium text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
            For {partnerName} & {girlfriendName}
          </span>
        </div>

        <div className="mt-4">
          <h2 className="text-2xl font-extrabold font-serif text-stone-900 dark:text-stone-100">
            How {girlfriendName} is feeling right now
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
            Currently in her <strong className="text-rose-600 dark:text-rose-400">{cycleStatus?.phaseName || 'Cycle'}</strong> (Day {cycleStatus?.cycleDay || 1})
          </p>
        </div>

        {/* Today's Vital Signs & Mood */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          {/* Flow status */}
          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-stone-800/80 border border-rose-100 dark:border-stone-700">
            <div className="text-xs text-stone-500 dark:text-stone-400 font-medium flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-rose-500" /> Bleeding Flow
            </div>
            <div className="text-base font-bold text-stone-800 dark:text-stone-100 capitalize mt-1">
              {todayLog?.flow && todayLog.flow !== 'none' ? `${todayLog.flow} Flow` : 'No bleeding'}
            </div>
          </div>

          {/* Cramps level */}
          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-stone-800/80 border border-rose-100 dark:border-stone-700">
            <div className="text-xs text-stone-500 dark:text-stone-400 font-medium flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Cramps / Pain
            </div>
            <div className="text-base font-bold text-stone-800 dark:text-stone-100 mt-1 flex items-center gap-2">
              <span>{todayLog?.pain !== undefined ? `Level ${todayLog.pain}/5` : '0/5 (Comfortable)'}</span>
              {todayLog?.pain >= 3 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold">
                  Needs TLC ❤️
                </span>
              )}
            </div>
          </div>

          {/* Pill / Water */}
          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-stone-800/80 border border-rose-100 dark:border-stone-700">
            <div className="text-xs text-stone-500 dark:text-stone-400 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Pill & Hydration
            </div>
            <div className="text-base font-bold text-stone-800 dark:text-stone-100 mt-1">
              {todayLog?.pillTaken ? '💊 Pill taken' : 'Pill not yet'} • 💧 {todayLog?.waterGlasses || 0} gl
            </div>
          </div>
        </div>

        {/* Symptoms & Mood tags logged today */}
        {todayLog && (todayLog.moods?.length > 0 || todayLog.symptoms?.length > 0) && (
          <div className="mt-4 pt-4 border-t border-purple-200/40 dark:border-stone-700 space-y-2">
            {todayLog.moods?.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 mr-1">Mood:</span>
                {todayLog.moods.map((m, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100/80 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                    {m}
                  </span>
                ))}
              </div>
            )}
            {todayLog.symptoms?.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 mr-1">Symptoms:</span>
                {todayLog.symptoms.map((s, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100/80 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {todayLog?.notes && (
          <div className="mt-3 p-3 rounded-xl bg-white/60 dark:bg-stone-800/60 text-xs italic text-stone-600 dark:text-stone-300 border border-purple-100 dark:border-stone-700">
            "{todayLog.notes}"
          </div>
        )}
      </motion.div>

      {/* Actionable Care Protocol Guide for Partner */}
      <div className="bg-white/80 dark:bg-stone-900/80 rounded-3xl p-6 border border-rose-100 dark:border-stone-800 shadow-sm">
        <h3 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          How to Support Her Today
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 mb-4">
          Specific guidance tailored to her body’s exact hormones & logged discomforts
        </p>

        <div className="space-y-3">
          {phaseDetail?.partnerTips?.map((tip, idx) => (
            <div 
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50/50 dark:bg-stone-800/40 border border-rose-100/80 dark:border-stone-800"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                {idx + 1}
              </span>
              <p className="text-sm font-medium text-stone-700 dark:text-stone-200 leading-relaxed">
                {tip}
              </p>
            </div>
          ))}

          {/* Dynamic rule: if cramps >= 3 */}
          {todayLog?.pain >= 3 && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 dark:text-amber-200">
                <strong>Special Care Alert:</strong> Her cramps are noticeable today. Bring her hot ginger/chamomile tea, set up a warm heating pad, and draw a warm bath if she likes. Avoid stressful discussions.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Send Real-time Care & Love Actions */}
      <div className="bg-white/80 dark:bg-stone-900/80 rounded-3xl p-6 border border-rose-100 dark:border-stone-800 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Send Instant Comfort & Love
          </h3>
          {sentSuccess && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-pulse">
              <CheckCircle2 className="w-4 h-4" /> Delivered to her screen!
            </span>
          )}
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
          Tap any button to send an instant real-time pop-up notification directly to her device!
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {CARE_ACTIONS.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSendQuickCare(item)}
              className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800/60 hover:border-purple-300 hover:bg-purple-50/50 dark:hover:bg-purple-950/40 text-left transition-all flex flex-col items-start gap-1"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200">{item.label}</span>
              <span className="text-[11px] text-stone-400 line-clamp-1">{item.msg}</span>
            </motion.button>
          ))}
        </div>

        {/* Custom Love Note */}
        <form onSubmit={handleSendCustomNote} className="mt-4 flex gap-2">
          <input
            type="text"
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            placeholder="Write a sweet custom note (e.g. 'Picking up your favorite ramen on my way home!')..."
            className="flex-1 px-4 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 dark:text-stone-100"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/25 transition"
          >
            <Send className="w-3.5 h-3.5" /> Send
          </button>
        </form>
      </div>

      {/* Recent Care History */}
      {careReactions.length > 0 && (
        <div className="bg-white/80 dark:bg-stone-900/80 rounded-3xl p-6 border border-rose-100 dark:border-stone-800 shadow-sm">
          <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2 mb-3">
            <MessageCircleHeart className="w-4 h-4 text-pink-500" />
            Recent Care Pings Sent
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {careReactions.slice(0, 5).map((r) => (
              <div 
                key={r.id} 
                className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span>{r.type === 'hug' ? '🤗' : r.type === 'tea' ? '☕️' : r.type === 'heating_pad' ? '🔥' : r.type === 'chocolate' ? '🍫' : r.type === 'flower' ? '💐' : '💌'}</span>
                  <span className="font-medium text-stone-700 dark:text-stone-300">{r.message}</span>
                </div>
                <span className="text-[10px] text-stone-400">
                  {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
