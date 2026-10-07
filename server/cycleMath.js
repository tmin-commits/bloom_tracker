// cycleMath.js - Comprehensive cycle calculations, phase logic & tips

/**
 * Normalizes a date to YYYY-MM-DD
 */
export function formatDate(d) {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function diffInDays(d1, d2) {
  const t1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate()).getTime();
  const t2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate()).getTime();
  return Math.round((t1 - t2) / (1000 * 60 * 60 * 24));
}

export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Calculates current cycle status based on last period start date and cycle length
 */
export function calculateCycleStatus(lastPeriodDateStr, cycleLength = 28, periodLength = 5) {
  if (!lastPeriodDateStr) {
    return {
      isValid: false,
      cycleDay: 1,
      phase: 'menstrual',
      phaseName: 'Menstrual Phase',
      daysUntilNextPeriod: 0,
      ovulationDay: 14,
      isFertile: false,
      isOvulationDay: false,
      isPeriodDay: false,
      chanceOfPregnancy: 'Low',
    };
  }

  const today = new Date();
  const lastPeriod = parseDate(lastPeriodDateStr);
  const daysSinceStart = diffInDays(today, lastPeriod);

  // If last period was in the future, handle gracefully
  if (daysSinceStart < 0) {
    return {
      isValid: true,
      cycleDay: 1,
      phase: 'follicular',
      phaseName: 'Follicular Phase',
      daysUntilNextPeriod: Math.abs(daysSinceStart),
      ovulationDay: cycleLength - 14,
      isFertile: false,
      isOvulationDay: false,
      isPeriodDay: false,
      chanceOfPregnancy: 'Low',
    };
  }

  // Calculate current cycle iteration
  const currentCycleDay = (daysSinceStart % cycleLength) + 1;
  const daysUntilNextPeriod = cycleLength - currentCycleDay + 1;
  const ovulationDay = Math.max(8, cycleLength - 14); // typically 14 days before next period

  // Phases:
  // Menstrual: Day 1 to periodLength
  // Follicular: Day (periodLength + 1) to (ovulationDay - 3)
  // Ovulatory: (ovulationDay - 2) to (ovulationDay + 1)
  // Luteal: (ovulationDay + 2) to cycleLength
  let phase = 'follicular';
  let phaseName = 'Follicular Phase';
  let isPeriodDay = false;
  let isOvulationDay = currentCycleDay === ovulationDay;
  let isFertile = false;
  let chanceOfPregnancy = 'Low';

  if (currentCycleDay <= periodLength) {
    phase = 'menstrual';
    phaseName = 'Menstrual Phase';
    isPeriodDay = true;
    chanceOfPregnancy = 'Very Low';
  } else if (currentCycleDay >= ovulationDay - 5 && currentCycleDay <= ovulationDay + 1) {
    isFertile = true;
    if (currentCycleDay === ovulationDay) {
      phase = 'ovulatory';
      phaseName = 'Ovulation Day';
      chanceOfPregnancy = 'Peak';
    } else if (currentCycleDay >= ovulationDay - 2) {
      phase = 'ovulatory';
      phaseName = 'Ovulatory Window';
      chanceOfPregnancy = 'High';
    } else {
      phase = 'follicular';
      phaseName = 'Fertile Window';
      chanceOfPregnancy = 'Medium-High';
    }
  } else if (currentCycleDay > ovulationDay + 1) {
    phase = 'luteal';
    phaseName = 'Luteal Phase';
    chanceOfPregnancy = 'Low';
  }

  return {
    isValid: true,
    cycleDay: currentCycleDay,
    totalCycleDays: cycleLength,
    periodLength,
    phase,
    phaseName,
    daysUntilNextPeriod,
    ovulationDay,
    isFertile,
    isOvulationDay,
    isPeriodDay,
    chanceOfPregnancy,
    percentComplete: Math.min(100, Math.round((currentCycleDay / cycleLength) * 100)),
    nextPeriodDate: formatDate(addDays(today, daysUntilNextPeriod - 1)),
  };
}

/**
 * Generate predictions for the next N months
 */
export function generatePredictions(lastPeriodDateStr, cycleLength = 28, periodLength = 5, monthsCount = 6) {
  if (!lastPeriodDateStr) return [];

  const predictions = [];
  const start = parseDate(lastPeriodDateStr);
  const now = new Date();

  // Find start of current cycle
  const daysSince = diffInDays(now, start);
  const cyclesPassed = daysSince >= 0 ? Math.floor(daysSince / cycleLength) : 0;
  
  // Starting reference
  let currentCycleStart = addDays(start, cyclesPassed * cycleLength);

  for (let i = 0; i < monthsCount; i++) {
    const cycleStart = addDays(currentCycleStart, i * cycleLength);
    const cycleEnd = addDays(cycleStart, periodLength - 1);
    const ovulationDate = addDays(cycleStart, cycleLength - 14);
    const fertileStart = addDays(ovulationDate, -5);
    const fertileEnd = addDays(ovulationDate, 1);
    const nextStart = addDays(cycleStart, cycleLength);

    predictions.push({
      cycleIndex: i + 1,
      periodStart: formatDate(cycleStart),
      periodEnd: formatDate(cycleEnd),
      ovulationDate: formatDate(ovulationDate),
      fertileWindowStart: formatDate(fertileStart),
      fertileWindowEnd: formatDate(fertileEnd),
      nextPeriodStart: formatDate(nextStart),
      periodLength,
      cycleLength
    });
  }

  return predictions;
}

/**
 * Rich health insights & partner tips for each phase
 */
export const PHASE_INSIGHTS = {
  menstrual: {
    title: 'Menstrual Phase (Rest & Rejuvenate)',
    subtitle: 'Estrogen and progesterone are at their lowest levels.',
    color: '#f43f5e',
    bgColor: '#fff1f2',
    borderColor: '#fecdd3',
    feelings: 'You might feel more tired, reflective, and experience mild cramps or lower back tension.',
    nutritionTip: 'Nourish with warm soups, dark chocolate, magnesium, iron-rich greens, and lots of hot herbal tea.',
    movementTip: 'Gentle stretching, restorative yin yoga, slow walks, or simply resting with zero guilt.',
    partnerTips: [
      'Offer a warm heating pad or run a soothing bath for her.',
      'Stock up on her favorite comfort treats, hot cocoa, or chamomile tea.',
      'Be extra patient, give gentle back/foot massages without having to be asked.',
      'Take over dinner or heavy chores so she can curl up in warm blankets.'
    ]
  },
  follicular: {
    title: 'Follicular Phase (Energy Rising)',
    subtitle: 'Estrogen is steadily climbing, boosting serotonin and mental clarity.',
    color: '#06b6d4',
    bgColor: '#ecfeff',
    borderColor: '#a5f3fc',
    feelings: 'Your energy, optimism, and creativity are naturally peaking. Great time for new projects!',
    nutritionTip: 'Light, vibrant foods: fresh salads, fermented foods (kimchi, kefir), lean proteins, and seeds.',
    movementTip: 'Cardio, strength training, dance, and trying new adventurous fitness classes.',
    partnerTips: [
      'She is full of creative energy! Plan a fun date night, museum visit, or outdoor stroll.',
      'Compliment her glow and listen attentively to her new ideas and projects.',
      'Great time for socializing, lively discussions, and trying new things together.'
    ]
  },
  ovulatory: {
    title: 'Ovulatory Phase (Peak Radiance & Fertility)',
    subtitle: 'Luteinizing hormone (LH) and estrogen surge at peak levels.',
    color: '#8b5cf6',
    bgColor: '#f5f3ff',
    borderColor: '#ddd6fe',
    feelings: 'High confidence, vibrant libido, glowing skin, magnetic social energy, and peak verbal fluency.',
    nutritionTip: 'Antioxidant-rich berries, leafy greens, avocados, fiber to help metabolize estrogen.',
    movementTip: 'High-intensity interval workouts (HIIT), heavy weightlifting, and vigorous activities.',
    partnerTips: [
      'She feels at her most vibrant and confident! Surprise her with a romantic dinner.',
      'Tell her how stunning she looks—her natural radiance is at its monthly peak.',
      'Fertility is at its highest window right now—keep open communication about your family planning goals.'
    ]
  },
  luteal: {
    title: 'Luteal Phase (Winding Down & Cocooning)',
    subtitle: 'Progesterone rises then drops if no pregnancy occurs. PMS may surface.',
    color: '#f59e0b',
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
    feelings: 'Energy turns inward. Vulnerable to mood dips, cravings, bloating, or breast tenderness.',
    nutritionTip: 'Complex carbs (sweet potatoes, oats), pumpkin seeds, dark chocolate, and bananas for serotonin.',
    movementTip: 'Moderate pilates, slow jogging, strength workouts, and mindful journaling.',
    partnerTips: [
      'Give her emotional reassurance and plenty of warm, loving affection.',
      'Avoid bringing up stressful, heavy arguments; listen attentively without trying to "fix" everything.',
      'Keep snacks like dark chocolate, chips, or comfort meals on standby.',
      'Praise her and validate her feelings gently.'
    ]
  }
};
