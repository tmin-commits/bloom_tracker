import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  X, Check, Droplets, Heart, Smile, Sparkles, 
  Pill, Coffee, Flame, Moon, Activity, MessageSquare 
} from 'lucide-react';

const MOODS = [
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'calm', label: 'Calm & Peaceful', emoji: '😌' },
  { id: 'emotional', label: 'Emotional', emoji: '🥺' },
  { id: 'sensitive', label: 'Sensitive', emoji: '🌸' },
  { id: 'energetic', label: 'Energetic', emoji: '⚡️' },
  { id: 'tired', label: 'Exhausted', emoji: '😴' },
  { id: 'moody', label: 'Irritable', emoji: '😤' },
  { id: 'anxious', label: 'Anxious', emoji: '😰' },
  { id: 'loving', label: 'Affectionate', emoji: '🥰' },
];

const SYMPTOMS = [
  { id: 'cramps', label: 'Cramps', emoji: '⚡️' },
  { id: 'headache', label: 'Headache', emoji: '🤕' },
  { id: 'bloating', label: 'Bloating', emoji: '🎈' },
  { id: 'tender_breasts', label: 'Tender Breasts', emoji: '🌸' },
  { id: 'cravings', label: 'Cravings', emoji: '🍫' },
  { id: 'backache', label: 'Backache', emoji: '🦴' },
  { id: 'acne', label: 'Breakouts / Acne', emoji: '✨' },
  { id: 'insomnia', label: 'Trouble Sleeping', emoji: '💤' },
  { id: 'nausea', label: 'Nausea', emoji: '🤢' },
  { id: 'hot_flashes', label: 'Hot Flashes', emoji: '🌡' },
];

const FLOWS = [
  { id: 'none', label: 'No Flow', icon: '⚪️', desc: 'Clean' },
  { id: 'spotting', label: 'Spotting', icon: '💧', desc: 'A few drops' },
  { id: 'light', label: 'Light', icon: '🩸', desc: 'Mild flow' },
  { id: 'medium', label: 'Medium', icon: '🩸🩸', desc: 'Normal' },
  { id: 'heavy', label: 'Heavy', icon: '🩸🩸🩸', desc: 'Heavy flow' },
];

export default function DailyLoggerModal({ isOpen, onClose, date, initialLog, onSave }) {
  const [flow, setFlow] = useState('none');
  const [pain, setPain] = useState(0);
  const [moods, setMoods] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState('');
  const [waterGlasses, setWaterGlasses] = useState(4);
  const [pillTaken, setPillTaken] = useState(false);
  const [sexualActivity, setSexualActivity] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialLog) {
      setFlow(initialLog.flow || 'none');
      setPain(initialLog.pain || 0);
      setMoods(initialLog.moods || []);
      setSymptoms(initialLog.symptoms || []);
      setNotes(initialLog.notes || '');
      setWaterGlasses(initialLog.waterGlasses || 4);
      setPillTaken(initialLog.pillTaken || false);
      setSexualActivity(initialLog.sexualActivity || false);
    } else {
      setFlow('none');
      setPain(0);
      setMoods([]);
      setSymptoms([]);
      setNotes('');
      setWaterGlasses(4);
      setPillTaken(false);
      setSexualActivity(false);
    }
  }, [initialLog, isOpen]);

  const toggleMood = (id) => {
    setMoods(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const toggleSymptom = (id) => {
    setSymptoms(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const logPayload = {
      flow,
      pain,
      moods,
      symptoms,
      notes,
      waterGlasses,
      pillTaken,
      sexualActivity
    };

    try {
      await onSave(date, logPayload);
      
      // Celebrate with sweet confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#fb7185', '#f43f5e', '#fda4af', '#fecdd3', '#c084fc']
      });

      onClose();
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-rose-100 dark:border-stone-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100/70 dark:border-stone-800 bg-rose-50/50 dark:bg-stone-900/80">
            <div>
              <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100">
                Log for {date}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Record your flow, body sensations & emotional cues
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* 1. Period Flow */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-stone-800 dark:text-stone-200 mb-2.5">
                <Droplets className="w-4 h-4 text-rose-500" />
                Period Bleeding & Flow
              </label>
              <div className="grid grid-cols-5 gap-2">
                {FLOWS.map((f) => {
                  const isSelected = flow === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFlow(f.id)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-xs font-medium transition-all ${
                        isSelected
                          ? 'border-rose-500 bg-rose-500 text-white shadow-md shadow-rose-500/25 scale-[1.03]'
                          : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/50 text-stone-700 dark:text-stone-300 hover:border-rose-300'
                      }`}
                    >
                      <span className="text-lg mb-1">{f.icon}</span>
                      <span className="font-semibold">{f.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Cramps / Pain Intensity */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-stone-800 dark:text-stone-200">
                  <Flame className="w-4 h-4 text-amber-500" />
                  Cramps & Body Pain Level
                </label>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300">
                  {pain === 0 ? 'None' : pain === 1 ? 'Mild Ache' : pain === 2 ? 'Moderate' : pain === 3 ? 'Uncomfortable' : pain === 4 ? 'Severe' : 'Intense'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setPain(lvl)}
                    className={`flex-1 py-2 rounded-xl border text-sm font-bold transition-all ${
                      pain === lvl
                        ? 'bg-rose-500 text-white border-rose-500 shadow-sm scale-105'
                        : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Moods */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-stone-800 dark:text-stone-200 mb-2">
                <Smile className="w-4 h-4 text-indigo-500" />
                Mood & Emotional State
              </label>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((m) => {
                  const isSelected = moods.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleMood(m.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold shadow-sm'
                          : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                      }`}
                    >
                      <span>{m.emoji}</span>
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Physical Symptoms */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-stone-800 dark:text-stone-200 mb-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                Physical Symptoms
              </label>
              <div className="flex flex-wrap gap-2">
                {SYMPTOMS.map((s) => {
                  const isSelected = symptoms.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleSymptom(s.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold shadow-sm'
                          : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                      }`}
                    >
                      <span>{s.emoji}</span>
                      <span>{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Water & Pills Quick Toggles */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-sky-900 dark:text-sky-300 flex items-center gap-1">
                    💧 Hydration
                  </div>
                  <div className="text-lg font-bold text-sky-700 dark:text-sky-200">
                    {waterGlasses} glasses
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
                    className="w-7 h-7 rounded-lg bg-white dark:bg-stone-800 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-stone-700 font-bold"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaterGlasses(waterGlasses + 1)}
                    className="w-7 h-7 rounded-lg bg-sky-600 text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div 
                onClick={() => setPillTaken(!pillTaken)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  pillTaken 
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800' 
                    : 'bg-stone-50/60 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    💊 Pill / Vitamin
                  </div>
                  <div className={`text-xs font-medium mt-0.5 ${pillTaken ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-stone-500'}`}>
                    {pillTaken ? 'Taken today ✨' : 'Not yet'}
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                  pillTaken ? 'bg-rose-500 border-rose-500 text-white' : 'border-stone-300 bg-white dark:bg-stone-800'
                }`}>
                  {pillTaken && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            </div>

            {/* 6. Intimacy Checkbox */}
            <div 
              onClick={() => setSexualActivity(!sexualActivity)}
              className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                sexualActivity 
                  ? 'bg-pink-50 dark:bg-pink-950/40 border-pink-300 dark:border-pink-800' 
                  : 'bg-stone-50/60 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Heart className={`w-4 h-4 ${sexualActivity ? 'text-pink-500 fill-pink-500' : 'text-stone-400'}`} />
                <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                  Intimacy / Sexual Activity
                </span>
              </div>
              <span className="text-xs font-semibold text-pink-600 dark:text-pink-400">
                {sexualActivity ? 'Logged' : 'None'}
              </span>
            </div>

            {/* 7. Personal Notes */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-stone-800 dark:text-stone-200 mb-2">
                <MessageSquare className="w-4 h-4 text-stone-400" />
                Personal Thoughts & Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="E.g., Felt super cuddly tonight, craving ramen, boyfriend gave a lovely foot rub..."
                className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 dark:text-stone-100"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-pink-500 text-white font-bold shadow-lg shadow-rose-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Check className="w-5 h-5" />
                {isSubmitting ? 'Syncing...' : 'Save & Sync Log'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
