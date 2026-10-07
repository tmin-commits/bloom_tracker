// db.js - Persistent JSON-backed storage for Bloom
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'bloom-data.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default initial state
const defaultState = {
  settings: {
    userName: 'Her',
    partnerName: 'Him',
    lastPeriodDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days ago as default demo
    cycleLength: 28,
    periodLength: 5,
    customTips: []
  },
  logs: {},
  careReactions: []
};

let db = null;

// Seed initial log if empty
function getInitialData() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      console.error('Error reading db file, restoring defaults:', err);
      return defaultState;
    }
  }

  // Prepopulate today's log sample for a warm initial feel
  const today = new Date().toISOString().split('T')[0];
  const initial = { ...defaultState };
  initial.logs[today] = {
    date: today,
    flow: 'light',
    pain: 1,
    moods: ['calm', 'sweet'],
    symptoms: ['bloating'],
    notes: 'Feeling cozy today! ☕️',
    waterGlasses: 4,
    pillTaken: true,
    sexualActivity: false,
    updatedAt: Date.now()
  };
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist initial data:', err);
  }
  return initial;
}

db = getInitialData();

export function getData() {
  return db;
}

export function saveData(data) {
  db = data;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database:', err);
  }
}

export function updateSettings(newSettings) {
  db.settings = { ...db.settings, ...newSettings };
  saveData(db);
  return db.settings;
}

export function saveDayLog(date, logData) {
  if (!db.logs) db.logs = {};
  db.logs[date] = {
    ...db.logs[date],
    ...logData,
    date,
    updatedAt: Date.now()
  };
  saveData(db);
  return db.logs[date];
}

export function getDayLog(date) {
  return db.logs?.[date] || null;
}

export function addCareReaction(reaction) {
  if (!db.careReactions) db.careReactions = [];
  const item = {
    id: 'care_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    type: reaction.type || 'hug',
    message: reaction.message || '',
    sender: reaction.sender || 'Partner',
    timestamp: Date.now(),
    read: false
  };
  db.careReactions.unshift(item);
  // Keep last 50 reactions
  if (db.careReactions.length > 50) {
    db.careReactions = db.careReactions.slice(0, 50);
  }
  saveData(db);
  return item;
}

export function markReactionRead(id) {
  if (!db.careReactions) return;
  const item = db.careReactions.find(r => r.id === id);
  if (item) {
    item.read = true;
    saveData(db);
  }
}
