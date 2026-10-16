// index.js - Express server with Socket.io real-time engine
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getData,
  updateSettings,
  saveDayLog,
  addCareReaction,
  markReactionRead
} from './db.js';
import {
  calculateCycleStatus,
  generatePredictions,
  PHASE_INSIGHTS
} from './cycleMath.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Helper to construct enriched payload
function getFullPayload() {
  const data = getData();
  const cycleStatus = calculateCycleStatus(
    data.settings.lastPeriodDate,
    data.settings.cycleLength,
    data.settings.periodLength
  );
  const predictions = generatePredictions(
    data.settings.lastPeriodDate,
    data.settings.cycleLength,
    data.settings.periodLength,
    6
  );
  const phaseDetail = PHASE_INSIGHTS[cycleStatus.phase] || PHASE_INSIGHTS.menstrual;

  return {
    settings: data.settings,
    logs: data.logs,
    careReactions: data.careReactions,
    cycleStatus,
    predictions,
    phaseDetail
  };
}

// REST Endpoints
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: Date.now(),
    clientsCount: io.engine.clientsCount
  });
});

app.get('/api/state', (req, res) => {
  res.json(getFullPayload());
});

app.post('/api/settings', (req, res) => {
  const updated = updateSettings(req.body);
  const payload = getFullPayload();
  io.emit('state_update', payload);
  res.json(payload);
});

app.post('/api/sync', (req, res) => {
  const { logs, settings } = req.body;
  if (settings) updateSettings(settings);
  if (logs && typeof logs === 'object') {
    Object.entries(logs).forEach(([date, log]) => {
      saveDayLog(date, log);
    });
  }
  const payload = getFullPayload();
  io.emit('state_update', payload);
  res.json({ success: true, payload });
});

app.post('/api/logs', (req, res) => {
  const { date, log } = req.body;
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }
  const saved = saveDayLog(date, log);
  const payload = getFullPayload();
  io.emit('state_update', payload);
  io.emit('log_saved', { date, log: saved });
  res.json({ success: true, log: saved });
});

app.post('/api/care', (req, res) => {
  const { type, message, sender } = req.body;
  const reaction = addCareReaction({ type, message, sender });
  io.emit('care_received', reaction);
  res.json({ success: true, reaction });
});

app.post('/api/care/:id/read', (req, res) => {
  markReactionRead(req.params.id);
  res.json({ success: true });
});

// Socket.io Realtime Connections
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  // Send initial state on connection
  socket.emit('state_update', getFullPayload());

  socket.on('join_mode', ({ mode, name }) => {
    connectedUsers.set(socket.id, { mode, name, joinedAt: Date.now() });
    io.emit('presence_update', Array.from(connectedUsers.values()));
  });

  socket.on('log_update', ({ date, log }) => {
    saveDayLog(date, log);
    const payload = getFullPayload();
    io.emit('state_update', payload);
    socket.broadcast.emit('girlfriend_logged', { date, log });
  });

  socket.on('settings_update', (newSettings) => {
    updateSettings(newSettings);
    const payload = getFullPayload();
    io.emit('state_update', payload);
  });

  socket.on('send_care', (careData) => {
    const reaction = addCareReaction(careData);
    io.emit('care_received', reaction);
  });

  socket.on('disconnect', () => {
    connectedUsers.delete(socket.id);
    io.emit('presence_update', Array.from(connectedUsers.values()));
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

// Serve static frontend if built
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIp();
  console.log(`\n======================================================`);
  console.log(`🌸 Bloom Period Tracker is LIVE!`);
  console.log(`------------------------------------------------------`);
  console.log(`💻 Local:           http://localhost:${PORT}`);
  console.log(`📱 Mobile (Wi-Fi):   http://${ip}:${PORT}`);
  console.log(`======================================================\n`);
});
