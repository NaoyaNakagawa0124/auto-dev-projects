// NocheCalma - Core engine (runs in browser and Node.js)

const SANCTUARY_OPEN_HOUR = 0;  // midnight
const SANCTUARY_CLOSE_HOUR = 6; // 6am

const BREATHING_PATTERNS = [
  { name: "4-7-8 Calm", steps: [{action:"Inhale",seconds:4},{action:"Hold",seconds:7},{action:"Exhale",seconds:8}], cycles: 3, description: "The classic relaxation breath. Used by parents worldwide." },
  { name: "Box Breathing", steps: [{action:"Inhale",seconds:4},{action:"Hold",seconds:4},{action:"Exhale",seconds:4},{action:"Hold",seconds:4}], cycles: 3, description: "Navy SEAL technique. Steady and grounding." },
  { name: "Moonlight Breath", steps: [{action:"Inhale",seconds:5},{action:"Hold",seconds:2},{action:"Exhale",seconds:8}], cycles: 4, description: "Inspired by the Mexican night sky. Long, slow exhales." },
  { name: "Equinox Reset", steps: [{action:"Inhale",seconds:6},{action:"Hold",seconds:3},{action:"Exhale",seconds:6},{action:"Hold",seconds:3}], cycles: 3, description: "Balance like the equinox. Equal inhale and exhale." },
  { name: "Quick Calm", steps: [{action:"Inhale",seconds:3},{action:"Exhale",seconds:6}], cycles: 5, description: "When you only have 2 minutes. Fast but effective." },
];

const GRATITUDE_PROMPTS = [
  "What small moment today made you smile?",
  "Name one thing your child did that surprised you.",
  "What part of today would you live again?",
  "Who helped you today, even in a tiny way?",
  "What sound made you feel at home today?",
  "What meal or snack did you enjoy most today?",
  "Name something your body did well today.",
  "What made you laugh, even for a second?",
  "What's one thing you're proud you handled?",
  "What are you looking forward to tomorrow?",
  "Name a comfort you're grateful for right now.",
  "What lesson did today teach you?",
  "Who would you thank if they were here?",
  "What's one beautiful thing you noticed today?",
  "Name something that went better than expected.",
  "What quiet moment did you treasure today?",
  "What part of your routine brings you peace?",
  "Name one way you showed love today.",
  "What's something you forgave yourself for today?",
  "What do you appreciate about this quiet hour?",
];

const SOUNDSCAPES = [
  { name: "Night Rain", icon: "🌧️", description: "Gentle rain on a tin roof" },
  { name: "Ocean Waves", icon: "🌊", description: "Distant waves on a Mexican beach" },
  { name: "Cricket Song", icon: "🦗", description: "A warm summer night" },
  { name: "Wind Chimes", icon: "🎐", description: "Soft chimes in a breeze" },
  { name: "Campfire", icon: "🔥", description: "Crackling embers under stars" },
  { name: "Temple Bells", icon: "🔔", description: "Distant bells at Teotihuacán" },
];

const RITUALS = [
  { id: "breathe", name: "Breathing", icon: "🌬️", duration: 3, xp: 20, description: "A guided breathing exercise" },
  { id: "gratitude", name: "Gratitude", icon: "🙏", duration: 2, xp: 15, description: "Write one thing you're grateful for" },
  { id: "release", name: "Release", icon: "🍃", duration: 2, xp: 15, description: "Write something you're letting go of" },
  { id: "soundscape", name: "Soundscape", icon: "🎵", duration: 5, xp: 25, description: "Listen to a calming soundscape" },
  { id: "intention", name: "Intention", icon: "✨", duration: 1, xp: 10, description: "Set one intention for tomorrow" },
];

function isSanctuaryOpen(hour) {
  if (typeof hour === 'undefined') hour = new Date().getHours();
  return hour >= SANCTUARY_OPEN_HOUR && hour < SANCTUARY_CLOSE_HOUR;
}

function getTimeUntilOpen(hour) {
  if (typeof hour === 'undefined') hour = new Date().getHours();
  if (isSanctuaryOpen(hour)) return 0;
  if (hour >= SANCTUARY_CLOSE_HOUR) return 24 - hour; // hours until midnight
  return 0; // shouldn't reach here if not open and hour < 6
}

function getTimeUntilClose(hour) {
  if (typeof hour === 'undefined') hour = new Date().getHours();
  if (!isSanctuaryOpen(hour)) return 0;
  return SANCTUARY_CLOSE_HOUR - hour;
}

function getBreathingDuration(pattern) {
  let total = 0;
  for (const step of pattern.steps) {
    total += step.seconds;
  }
  return total * pattern.cycles;
}

function getGratitudePrompt(dayOfYear) {
  if (typeof dayOfYear === 'undefined') {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  }
  return GRATITUDE_PROMPTS[dayOfYear % GRATITUDE_PROMPTS.length];
}

function createDefaultState() {
  return {
    energy: 0,
    maxEnergy: 100,
    totalRituals: 0,
    totalNights: 0,
    currentNight: null,
    streakNights: 0,
    bestStreak: 0,
    journalEntries: [],
    completedRituals: [],
    lastVisitDate: null,
  };
}

function startNight(state) {
  const today = new Date().toISOString().split('T')[0];
  if (state.currentNight === today) return state; // already started

  // Check streak
  if (state.lastVisitDate) {
    const last = new Date(state.lastVisitDate);
    const now = new Date(today);
    const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      state.streakNights++;
    } else if (diffDays > 1) {
      state.streakNights = 1;
    }
  } else {
    state.streakNights = 1;
  }

  if (state.streakNights > state.bestStreak) {
    state.bestStreak = state.streakNights;
  }

  state.currentNight = today;
  state.lastVisitDate = today;
  state.totalNights++;
  state.completedRituals = [];
  state.energy = Math.max(0, state.energy - 20); // Energy decays between nights
  return state;
}

function completeRitual(state, ritualId) {
  const ritual = RITUALS.find(r => r.id === ritualId);
  if (!ritual) return { state, xpGained: 0, message: "Unknown ritual." };
  if (state.completedRituals.includes(ritualId)) {
    return { state, xpGained: 0, message: "Already completed tonight." };
  }

  state.completedRituals.push(ritualId);
  state.totalRituals++;
  const xp = ritual.xp;
  state.energy = Math.min(state.maxEnergy, state.energy + xp);

  return { state, xpGained: xp, message: ritual.name + " complete. +" + xp + " energy." };
}

function addJournalEntry(state, type, text) {
  if (!text || text.trim().length === 0) return state;
  state.journalEntries.push({
    type: type,
    text: text.trim(),
    date: new Date().toISOString(),
    night: state.currentNight,
  });
  // Keep last 100 entries
  if (state.journalEntries.length > 100) {
    state.journalEntries = state.journalEntries.slice(-100);
  }
  return state;
}

function getEnergyLevel(energy) {
  if (energy >= 80) return { level: "Radiant", icon: "☀️", color: "#FFD700" };
  if (energy >= 60) return { level: "Glowing", icon: "🌟", color: "#FFA500" };
  if (energy >= 40) return { level: "Warm", icon: "🔆", color: "#FF8C00" };
  if (energy >= 20) return { level: "Dim", icon: "🌙", color: "#4169E1" };
  return { level: "Dark", icon: "🌑", color: "#2C2C54" };
}

function getNightsUntilNextMilestone(totalNights) {
  const milestones = [1, 3, 7, 14, 30, 60, 100, 200, 365];
  for (const m of milestones) {
    if (totalNights < m) return { target: m, remaining: m - totalNights };
  }
  return { target: totalNights + 1, remaining: 1 };
}

function getClosingMessage(energy) {
  if (energy >= 80) return "You're fully recharged. Rest well, warrior.";
  if (energy >= 60) return "Good energy tonight. The sunrise will be gentle.";
  if (energy >= 40) return "Every ritual counts. You showed up — that matters.";
  if (energy >= 20) return "Even a flicker of light pushes back the dark.";
  return "The sanctuary remembers you came. That's enough.";
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SANCTUARY_OPEN_HOUR, SANCTUARY_CLOSE_HOUR,
    BREATHING_PATTERNS, GRATITUDE_PROMPTS, SOUNDSCAPES, RITUALS,
    isSanctuaryOpen, getTimeUntilOpen, getTimeUntilClose,
    getBreathingDuration, getGratitudePrompt,
    createDefaultState, startNight, completeRitual, addJournalEntry,
    getEnergyLevel, getNightsUntilNextMilestone, getClosingMessage,
  };
}
