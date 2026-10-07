import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, Settings as Gear, Calendar, User, 
  Heart, Copy, Moon, Sun, Smartphone, Share2, 
  Sparkles, ExternalLink, ShieldCheck
} from 'lucide-react';

export default function SettingsModal({ 
  isOpen = true, 
  isInline = false,
  onClose, 
  settings, 
  onSaveSettings, 
  darkMode, 
  setDarkMode,
  onSwitchToPartner
}) {
  const [userName, setUserName] = useState(settings?.userName || 'Maya');
  const [partnerName, setPartnerName] = useState(settings?.partnerName || 'Alex');
  const [lastPeriodDate, setLastPeriodDate] = useState(settings?.lastPeriodDate || '');
  const [cycleLength, setCycleLength] = useState(settings?.cycleLength || 28);
  const [periodLength, setPeriodLength] = useState(settings?.periodLength || 5);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen && !isInline) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings({
      userName,
      partnerName,
      lastPeriodDate,
      cycleLength: Number(cycleLength),
      periodLength: Number(periodLength),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
    if (onClose && !isInline) {
      setTimeout(() => onClose(), 600);
    }
  };

  const partnerPortalUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/?mode=partner` 
    : '/?mode=partner';

  const copyPartnerLink = () => {
    navigator.clipboard.writeText(partnerPortalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sharePartnerLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bloom Partner Portal',
          text: `Hey ${partnerName}! Here is our private Bloom link so you can stay in sync and see how I'm feeling today 💕`,
          url: partnerPortalUrl,
        });
      } catch (err) {
        copyPartnerLink();
      }
    } else {
      copyPartnerLink();
    }
  };

  const content = (
    <div className="w-full bg-white dark:bg-stone-900 rounded-3xl p-6 border border-rose-100 dark:border-stone-800 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-rose-100 dark:border-stone-800">
        <div>
          <h3 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Gear className="w-5 h-5 text-rose-500" /> Settings & Cycle Profile
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Personalize your cycle predictions & partner connection
          </p>
        </div>
        {onClose && !isInline && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Profile Names */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 dark:text-stone-100"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1">
              Partner's Name
            </label>
            <input
              type="text"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 dark:text-stone-100"
            />
          </div>
        </div>

        {/* First Day of Last Period */}
        <div>
          <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-rose-500" />
            First Day of Last Period
          </label>
          <input
            type="date"
            value={lastPeriodDate}
            onChange={(e) => setLastPeriodDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 dark:text-stone-100"
          />
        </div>

        {/* Cycle Length Slider */}
        <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700">
          <div className="flex justify-between text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
            <span>Cycle Length</span>
            <span className="text-rose-600 font-bold">{cycleLength} days</span>
          </div>
          <input
            type="range"
            min="21"
            max="40"
            value={cycleLength}
            onChange={(e) => setCycleLength(e.target.value)}
            className="w-full accent-rose-500"
          />
          <div className="flex justify-between text-[10px] text-stone-400 mt-1">
            <span>21 days</span>
            <span>28 days (standard)</span>
            <span>40 days</span>
          </div>
        </div>

        {/* Period Length Slider */}
        <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700">
          <div className="flex justify-between text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
            <span>Period Bleeding Duration</span>
            <span className="text-rose-600 font-bold">{periodLength} days</span>
          </div>
          <input
            type="range"
            min="2"
            max="10"
            value={periodLength}
            onChange={(e) => setPeriodLength(e.target.value)}
            className="w-full accent-rose-500"
          />
          <div className="flex justify-between text-[10px] text-stone-400 mt-1">
            <span>2 days</span>
            <span>5 days (average)</span>
            <span>10 days</span>
          </div>
        </div>

        {/* Partner Connection & Invite Link Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-rose-500/10 border border-purple-200/80 dark:border-purple-900/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500" /> Partner Sync with {partnerName}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              Live Connected
            </span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-3">
            Send this private link to {partnerName}. When opened on his phone, he gets his dedicated Partner Dashboard with care advice and instant love pings.
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={sharePartnerLink}
              className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copied ? 'Link Copied!' : 'Send Link to Him'}
            </button>

            {onSwitchToPartner && (
              <button
                type="button"
                onClick={onSwitchToPartner}
                className="py-2 px-3 rounded-xl bg-white/80 dark:bg-stone-800 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-semibold text-xs flex items-center gap-1 hover:bg-purple-50 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Preview His View
              </button>
            )}
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
          <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-2">
            {darkMode ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            Night Bloom Theme
          </span>
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 text-stone-800 dark:text-stone-200 shadow-sm"
          >
            {darkMode ? 'Dark' : 'Light'}
          </button>
        </div>

        {/* Save Preferences Button */}
        <div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm shadow-md shadow-rose-500/25 transition flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            {saveSuccess ? 'Changes Saved ✨' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );

  if (isInline) {
    return content;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          {content}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
