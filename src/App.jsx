import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Calendar, Sparkles, Settings as SettingsIcon, 
  Activity, Droplets, Users, Shield, Moon, Sun, 
  Wifi, Flame, Smile, CheckCircle, ChevronRight, Layers, ArrowLeft
} from 'lucide-react';
import { 
  socket, 
  emitMode, 
  saveLogToServer, 
  saveSettingsToServer, 
  sendCareToServer, 
  fetchInitialState,
  syncAllToServer
} from './services/socket';
import CycleWheel from './components/CycleWheel';
import DailyLoggerModal from './components/DailyLoggerModal';
import CalendarView from './components/CalendarView';
import PartnerView from './components/PartnerView';
import InsightsView from './components/InsightsView';
import SettingsModal from './components/SettingsModal';
import CareNotification from './components/CareNotification';
import InstallPrompt from './components/InstallPrompt';
import BottomNavBar from './components/BottomNavBar';
import { format } from 'date-fns';

// Local storage keys that are protected from server wipes
const STORAGE_LOGS_KEY = 'bloom_saved_logs_v2';
const STORAGE_SETTINGS_KEY = 'bloom_saved_settings_v2';
const STORAGE_STATE_KEY = 'bloom_cached_state';

function getLocalLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_LOGS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveLocalLogs(logs) {
  try {
    localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(logs));
  } catch (e) {}
}

function getLocalSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveLocalSettings(settings) {
  try {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {}
}

export default function App() {
  // Determine mode from URL query parameters (e.g., ?mode=partner)
  const getInitialMode = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'partner') return 'partner';
    }
    return 'her';
  };

  const [activeMode, setActiveMode] = useState(getInitialMode);
  const [activeTab, setActiveTab] = useState('cycle');
  
  // Instant local-first initialization - NEVER waits on server to open!
  const [appState, setAppState] = useState(() => {
    try {
      const cached = localStorage.getItem(STORAGE_STATE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Ensure local protected logs take precedence
        const localLogs = getLocalLogs();
        const localSettings = getLocalSettings();
        return {
          ...parsed,
          logs: { ...(parsed.logs || {}), ...localLogs },
          settings: localSettings ? { ...(parsed.settings || {}), ...localSettings } : parsed.settings
        };
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(!appState);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isWakingServer, setIsWakingServer] = useState(false);
  
  // Modals & Popups
  const [loggerDate, setLoggerDate] = useState(null);
  const [activeCarePing, setActiveCarePing] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Today formatted
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  // Load initial state and setup sockets
  useEffect(() => {
    setIsWakingServer(true);

    fetchInitialState()
      .then(serverData => {
        setIsWakingServer(false);
        const localLogs = getLocalLogs();
        const localSettings = getLocalSettings();

        // Merge: Local logs ALWAYS survive server restarts/wipes!
        const mergedLogs = { ...(serverData.logs || {}), ...localLogs };
        const mergedSettings = localSettings 
          ? { ...(serverData.settings || {}), ...localSettings } 
          : (serverData.settings || {});

        const mergedState = {
          ...serverData,
          logs: mergedLogs,
          settings: mergedSettings
        };

        setAppState(mergedState);
        saveLocalLogs(mergedLogs);
        if (localSettings) saveLocalSettings(mergedSettings);
        localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify(mergedState));
        setLoading(false);

        // If the server restarted and lost data, re-hydrate it from her phone!
        const serverLogCount = Object.keys(serverData.logs || {}).length;
        const localLogCount = Object.keys(mergedLogs).length;
        if (localLogCount > serverLogCount || localSettings) {
          syncAllToServer({ logs: mergedLogs, settings: mergedSettings }).catch(() => {});
        }
      })
      .catch(err => {
        console.warn('Backend fetch failed, relying on local storage:', err);
        setIsWakingServer(false);
        setLoading(false);
      });

    // Sockets
    const onConnect = () => {
      setIsConnected(true);
      setIsWakingServer(false);
      emitMode(activeMode, activeMode === 'her' ? appState?.settings?.userName : appState?.settings?.partnerName);
      
      // Auto-rehydrate server on reconnect if needed
      const localLogs = getLocalLogs();
      const localSettings = getLocalSettings();
      if (Object.keys(localLogs).length > 0) {
        syncAllToServer({ logs: localLogs, settings: localSettings }).catch(() => {});
      }
    };

    const onDisconnect = () => setIsConnected(false);

    const onStateUpdate = (payload) => {
      // Don't let an empty server state wipe out local logs!
      const localLogs = getLocalLogs();
      const localSettings = getLocalSettings();
      const safeLogs = { ...(payload.logs || {}), ...localLogs };
      const safeSettings = localSettings ? { ...(payload.settings || {}), ...localSettings } : payload.settings;

      const safeState = {
        ...payload,
        logs: safeLogs,
        settings: safeSettings
      };

      setAppState(safeState);
      saveLocalLogs(safeLogs);
      localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify(safeState));
    };

    const onCareReceived = (reaction) => {
      setActiveCarePing(reaction);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('state_update', onStateUpdate);
    socket.on('care_received', onCareReceived);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('state_update', onStateUpdate);
      socket.off('care_received', onCareReceived);
    };
  }, []);

  // Update presence mode when toggling
  useEffect(() => {
    emitMode(activeMode, activeMode === 'her' ? appState?.settings?.userName : appState?.settings?.partnerName);
  }, [activeMode, appState?.settings]);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Actions
  const handleSaveLog = async (date, logData) => {
    // 1. Immediately save to phone storage (GUARANTEED NEVER LOST)
    const currentLocal = getLocalLogs();
    const updatedLogs = {
      ...currentLocal,
      [date]: { ...(currentLocal[date] || {}), ...logData, date, updatedAt: Date.now() }
    };
    saveLocalLogs(updatedLogs);

    // 2. Immediately update UI state (0ms latency!)
    if (appState) {
      const updatedState = {
        ...appState,
        logs: updatedLogs
      };
      setAppState(updatedState);
      localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify(updatedState));
    }

    // 3. Sync to server in background
    try {
      await saveLogToServer(date, logData);
    } catch (err) {
      console.warn('Server offline/waking, log saved locally and will sync on connect:', err);
    }
  };

  const handleSaveSettings = async (newSettings) => {
    saveLocalSettings(newSettings);
    if (appState) {
      const updatedState = {
        ...appState,
        settings: { ...(appState.settings || {}), ...newSettings }
      };
      setAppState(updatedState);
      localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify(updatedState));
    }
    try {
      await saveSettingsToServer(newSettings);
    } catch (err) {
      console.warn('Server offline/waking, settings saved locally:', err);
    }
  };

  const handleSendCare = async (careData) => {
    await sendCareToServer(careData);
  };

  const switchMode = (mode) => {
    setActiveMode(mode);
    const url = new URL(window.location.href);
    if (mode === 'partner') {
      url.searchParams.set('mode', 'partner');
    } else {
      url.searchParams.delete('mode');
    }
    window.history.replaceState({}, '', url.toString());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-rose-50 text-rose-500">
        <motion.div 
          animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-5xl"
        >
          🌸
        </motion.div>
        <span className="mt-4 font-serif text-lg font-semibold tracking-wide text-stone-700">
          Opening Bloom...
        </span>
      </div>
    );
  }

  const settings = appState?.settings || {};
  const cycleStatus = appState?.cycleStatus || {};
  const predictions = appState?.predictions || [];
  const phaseDetail = appState?.phaseDetail || {};
  const logs = appState?.logs || {};
  const todayLog = logs[todayStr];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-stone-950 text-stone-100' : 'bg-gradient-to-b from-rose-50/70 via-pink-50/30 to-stone-100 text-stone-800'
    }`}>
      {/* Real-time Care Notification Banner Popup (Sent by Partner) */}
      <CareNotification
        reaction={activeCarePing}
        onDismiss={() => setActiveCarePing(null)}
        onSendReply={(msg) => handleSendCare({ type: 'love_note', message: msg, sender: settings.userName || 'Her' })}
      />

      {/* Main Container */}
      <div className="max-w-xl mx-auto px-4 py-5 sm:py-7 flex flex-col min-h-screen">
        
        {/* ======================================================== */}
        {/* PARTNER MODE VIEW (When accessed via ?mode=partner)     */}
        {/* ======================================================== */}
        {activeMode === 'partner' ? (
          <div className="space-y-6 flex-1">
            {/* Partner Header */}
            <header className="flex items-center justify-between pb-3 border-b border-purple-200/50 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl p-1.5 rounded-2xl bg-white/80 dark:bg-stone-800 shadow-sm border border-purple-100 dark:border-stone-700">
                  💌
                </span>
                <div>
                  <h1 className="text-lg font-extrabold font-serif text-stone-900 dark:text-stone-100">
                    Partner Care Portal
                  </h1>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    Linked with <strong className="text-purple-600 dark:text-purple-400">{settings.userName || 'Your Girlfriend'}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => switchMode('her')}
                  className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-stone-800 border border-purple-200 text-purple-700 dark:text-purple-300 font-semibold text-xs flex items-center gap-1 hover:bg-purple-50 transition"
                  title="Switch to Her App View"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Her App
                </button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-xl bg-white/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700"
                >
                  {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-500" />}
                </button>
              </div>
            </header>

            {/* Partner Dashboard Component */}
            <PartnerView
              cycleStatus={cycleStatus}
              phaseDetail={phaseDetail}
              todayLog={todayLog}
              settings={settings}
              careReactions={appState?.careReactions || []}
              onSendCare={handleSendCare}
            />
          </div>
        ) : (
          /* ======================================================== */
          /* HER DEDICATED PERSONAL APP VIEW                          */
          /* ======================================================== */
          <div className="space-y-5 flex-1 pb-16 sm:pb-8">
            {/* Top Native Mobile Header */}
            <header className="flex items-center justify-between pt-1 pb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center text-white text-xl shadow-md shadow-rose-500/20">
                  🌸
                </div>
                <div>
                  <h1 className="text-lg font-extrabold font-serif tracking-tight text-stone-900 dark:text-stone-100">
                    Bloom
                  </h1>
                  <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                    {format(new Date(), 'EEEE, MMMM d')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                  isConnected 
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-800/60'
                    : isWakingServer
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-800/60'
                    : 'text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    isConnected ? 'bg-emerald-500 animate-pulse' : isWakingServer ? 'bg-amber-500 animate-ping' : 'bg-stone-400'
                  }`}></span>
                  <span>{isConnected ? 'Live Synced' : isWakingServer ? 'Waking Cloud...' : 'Saved on Phone'}</span>
                </span>

                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-2xl bg-white/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200/60 dark:border-stone-700 shadow-sm"
                  title="Toggle Theme"
                >
                  {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-500" />}
                </button>
              </div>
            </header>

            {/* Install to Home Screen Banner Guide */}
            <InstallPrompt />

            {/* TAB 1: TODAY (Cycle Wheel, Daily Summary, Advice) */}
            {activeTab === 'cycle' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* Circular Cycle Wheel */}
                <div className="bg-white/80 dark:bg-stone-900/80 rounded-3xl p-5 border border-rose-100 dark:border-stone-800 shadow-sm">
                  <CycleWheel
                    cycleStatus={cycleStatus}
                    todayLog={todayLog}
                    onOpenLogger={() => setLoggerDate(todayStr)}
                  />
                </div>

                {/* Today's Log Quick Summary Card */}
                {todayLog && (
                  <div className="bg-white/80 dark:bg-stone-900/80 rounded-3xl p-5 border border-rose-100 dark:border-stone-800 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        Today's Body & Mood Log
                      </h3>
                      <button
                        onClick={() => setLoggerDate(todayStr)}
                        className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                      >
                        Edit Log
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                        <span className="text-stone-400 block text-[10px]">Flow & Discomfort</span>
                        <span className="font-bold text-stone-800 dark:text-stone-200 capitalize mt-0.5 block">
                          {todayLog.flow || 'None'} Flow • Pain {todayLog.pain || 0}/5
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                        <span className="text-stone-400 block text-[10px]">Hydration & Pill</span>
                        <span className="font-bold text-stone-800 dark:text-stone-200 mt-0.5 block">
                          💧 {todayLog.waterGlasses || 0} glasses • {todayLog.pillTaken ? '💊 Taken' : '💊 Skipped'}
                        </span>
                      </div>
                    </div>

                    {todayLog.moods?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {todayLog.moods.map((m, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 rounded-full text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            {m}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Daily Phase Insight Snippet */}
                <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-stone-900 dark:to-stone-800 rounded-3xl p-5 border border-rose-200/60 dark:border-stone-700 shadow-sm flex items-start gap-3.5">
                  <span className="text-2xl mt-0.5">💡</span>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {phaseDetail.title || 'Daily Guidance'}
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                      {phaseDetail.nutritionTip || 'Stay hydrated and listen closely to your body’s signals.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: CALENDAR & FORECAST */}
            {activeTab === 'calendar' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CalendarView
                  logs={logs}
                  cycleStatus={cycleStatus}
                  predictions={predictions}
                  onSelectDate={(d) => setLoggerDate(d)}
                />
              </motion.div>
            )}

            {/* TAB 3: INSIGHTS & HORMONE MASTERCLASS */}
            {activeTab === 'insights' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <InsightsView
                  cycleStatus={cycleStatus}
                  predictions={predictions}
                  settings={settings}
                />
              </motion.div>
            )}

            {/* TAB 4: PROFILE & SETTINGS */}
            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SettingsModal
                  isInline={true}
                  settings={settings}
                  onSaveSettings={handleSaveSettings}
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  onSwitchToPartner={() => switchMode('partner')}
                />
              </motion.div>
            )}

            {/* Bottom iOS / Android Navigation Bar */}
            <BottomNavBar
              activeTab={activeTab}
              onSelectTab={(tab) => setActiveTab(tab)}
            />
          </div>
        )}
      </div>

      {/* Daily Logger Modal (when logging today or clicking any calendar date) */}
      <DailyLoggerModal
        isOpen={!!loggerDate}
        date={loggerDate || todayStr}
        initialLog={loggerDate ? logs[loggerDate] : null}
        onClose={() => setLoggerDate(null)}
        onSave={handleSaveLog}
      />
    </div>
  );
}
