// test-server-integration.js - In-process server integration tests
import http from 'http';
import { 
  getData, 
  updateSettings, 
  saveDayLog, 
  addCareReaction, 
  markReactionRead 
} from './server/db.js';

async function run() {
  console.log('--- Testing DB and In-memory operations ---');
  
  // 1. Settings
  const updatedSettings = updateSettings({ userName: 'Emma', partnerName: 'Leo', cycleLength: 29 });
  if (updatedSettings.userName !== 'Emma') throw new Error('Settings update failed');
  console.log('✓ Settings update passed:', updatedSettings.userName, '&', updatedSettings.partnerName);

  // 2. Day Log
  const today = '2026-10-06';
  const savedLog = saveDayLog(today, {
    flow: 'heavy',
    pain: 3,
    moods: ['sensitive', 'tired'],
    symptoms: ['cramps', 'bloating'],
    notes: 'Testing integration notes',
    waterGlasses: 6,
    pillTaken: true
  });
  if (savedLog.pain !== 3 || savedLog.flow !== 'heavy') throw new Error('Log save failed');
  console.log('✓ Daily log save passed:', savedLog.flow, 'pain level:', savedLog.pain);

  // 3. Care reaction
  const reaction = addCareReaction({
    type: 'heating_pad',
    message: 'Brought you a warm heating pad!',
    sender: 'Leo'
  });
  if (!reaction.id || reaction.type !== 'heating_pad') throw new Error('Reaction failed');
  console.log('✓ Care reaction passed:', reaction.id, reaction.type);

  // 4. Persistence check
  const state = getData();
  if (state.logs[today].notes !== 'Testing integration notes') throw new Error('Persistence mismatch');
  console.log('✓ Persistence verification passed!');

  console.log('\nAll integration tests passed successfully! 🚀');
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
