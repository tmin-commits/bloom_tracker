// test-endpoints.js - Automated tests for backend API & calculations
import http from 'http';
import { calculateCycleStatus, generatePredictions, PHASE_INSIGHTS } from './server/cycleMath.js';

console.log('--- Testing Cycle Math ---');
// Test with today's date minus 5 days
const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const status = calculateCycleStatus(fiveDaysAgo, 28, 5);
console.log('Cycle Day:', status.cycleDay);
console.log('Phase:', status.phaseName);
console.log('Days until next:', status.daysUntilNextPeriod);
console.log('Fertile:', status.isFertile);
if (status.cycleDay !== 6) throw new Error(`Expected cycle day 6, got ${status.cycleDay}`);

const predictions = generatePredictions('2026-10-01', 28, 5, 3);
console.log('Generated predictions count:', predictions.length);
if (predictions.length !== 3) throw new Error('Expected 3 predictions');

console.log('Testing Phase Insights:');
console.log('Menstrual title:', PHASE_INSIGHTS.menstrual.title);
console.log('Partner tips count:', PHASE_INSIGHTS.menstrual.partnerTips.length);

console.log('\nAll cycle calculation unit tests PASSED! ✨');
