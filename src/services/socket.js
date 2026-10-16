// socket.js - Socket.IO client setup with auto-reconnect
import { io } from 'socket.io-client';

// Connect to current origin in production/proxy or localhost:3001 in dev
const URL = window.location.hostname === 'localhost' && window.location.port === '5173'
  ? 'http://localhost:3001'
  : '/';

export const socket = io(URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  transports: ['websocket', 'polling']
});

export function emitMode(mode, name) {
  if (socket.connected) {
    socket.emit('join_mode', { mode, name });
  }
}

export function saveLogToServer(date, log) {
  return fetch('/api/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, log })
  }).then(r => r.json());
}

export function saveSettingsToServer(settings) {
  return fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  }).then(r => r.json());
}

export function sendCareToServer(careData) {
  return fetch('/api/care', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(careData)
  }).then(r => r.json());
}

export function fetchInitialState() {
  return fetch('/api/state').then(r => r.json());
}

export function syncAllToServer(payload) {
  return fetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(r => r.json());
}
