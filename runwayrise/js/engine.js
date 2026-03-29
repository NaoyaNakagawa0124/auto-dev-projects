// Core game engine for RunwayRise

function createDefaultState() {
  return {
    playerName: "Designer",
    xp: 0,
    level: 1,
    chapter: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastWorkoutDate: null,
    totalWorkouts: 0,
    totalMinutes: 0,
    workoutHistory: [],
    unlockedAchievements: [],
    workoutTypesUsed: [],
    longestWorkout: 0,
    earlyWorkouts: 0,
    lateWorkouts: 0,
    createdAt: new Date().toISOString(),
    storyProgress: 0 // which narrative line they've read up to
  };
}

function calculateXP(workoutType, durationMinutes) {
  if (!workoutType || durationMinutes <= 0) return 0;

  const type = WORKOUT_TYPES.find(t => t.id === workoutType);
  if (!type) return 0;

  let xp = Math.round(type.xpPerMin * durationMinutes);

  // Bonus for longer workouts
  if (durationMinutes >= 60) xp = Math.round(xp * 1.5);
  else if (durationMinutes >= 30) xp = Math.round(xp * 1.2);

  return xp;
}

function calculateLevel(totalXP) {
  // Level formula: each level requires progressively more XP
  // Level 1: 0 XP, Level 2: 50 XP, Level 3: 150 XP, etc.
  let level = 1;
  let threshold = 0;
  let increment = 50;

  while (threshold + increment <= totalXP) {
    threshold += increment;
    level++;
    increment = Math.round(increment * 1.15);
  }

  return { level, currentThreshold: threshold, nextThreshold: threshold + increment };
}

function getChapterForXP(xp) {
  for (let i = CHAPTERS.length - 1; i >= 0; i--) {
    if (xp >= CHAPTERS[i].xpRequired) return i;
  }
  return 0;
}

function isToday(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
         d.getMonth() === now.getMonth() &&
         d.getDate() === now.getDate();
}

function isYesterday(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.getFullYear() === yesterday.getFullYear() &&
         d.getMonth() === yesterday.getMonth() &&
         d.getDate() === yesterday.getDate();
}

function daysBetween(dateStr1, dateStr2) {
  if (!dateStr1 || !dateStr2) return Infinity;
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  const diffMs = Math.abs(d2 - d1);
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function logWorkout(state, workoutTypeId, durationMinutes, timestamp) {
  if (!workoutTypeId || durationMinutes <= 0) return { state, xpGained: 0, newChapter: false, newAchievements: [] };

  const ts = timestamp || new Date().toISOString();
  const xpGained = calculateXP(workoutTypeId, durationMinutes);
  const oldChapter = state.chapter;

  // Update XP and level
  state.xp += xpGained;
  const levelInfo = calculateLevel(state.xp);
  state.level = levelInfo.level;

  // Update chapter
  state.chapter = getChapterForXP(state.xp);
  const newChapter = state.chapter > oldChapter;

  // Update streak
  const workoutDate = ts.split('T')[0];
  if (state.lastWorkoutDate) {
    const lastDate = state.lastWorkoutDate.split('T')[0];
    if (workoutDate === lastDate) {
      // Same day, streak unchanged
    } else if (daysBetween(lastDate + 'T00:00:00Z', workoutDate + 'T00:00:00Z') === 1) {
      state.currentStreak++;
    } else if (daysBetween(lastDate + 'T00:00:00Z', workoutDate + 'T00:00:00Z') > 1) {
      state.currentStreak = 1; // Streak broken
    }
  } else {
    state.currentStreak = 1;
  }

  if (state.currentStreak > state.bestStreak) {
    state.bestStreak = state.currentStreak;
  }

  state.lastWorkoutDate = ts;
  state.totalWorkouts++;
  state.totalMinutes += durationMinutes;

  // Track workout type variety
  if (!state.workoutTypesUsed.includes(workoutTypeId)) {
    state.workoutTypesUsed.push(workoutTypeId);
  }

  // Track longest workout
  if (durationMinutes > state.longestWorkout) {
    state.longestWorkout = durationMinutes;
  }

  // Track early/late workouts (use UTC hours for consistency)
  const hour = new Date(ts).getUTCHours();
  if (hour < 7) state.earlyWorkouts++;
  if (hour >= 22) state.lateWorkouts++;

  // Add to history
  state.workoutHistory.push({
    type: workoutTypeId,
    duration: durationMinutes,
    xp: xpGained,
    timestamp: ts
  });

  // Keep history manageable (last 100 workouts)
  if (state.workoutHistory.length > 100) {
    state.workoutHistory = state.workoutHistory.slice(-100);
  }

  // Check achievements
  const stats = getAchievementStats(state);
  const newAchievements = [];
  for (const achievement of ACHIEVEMENTS) {
    if (!state.unlockedAchievements.includes(achievement.id) && achievement.condition(stats)) {
      state.unlockedAchievements.push(achievement.id);
      newAchievements.push(achievement);
    }
  }

  return { state, xpGained, newChapter, newAchievements };
}

function getAchievementStats(state) {
  return {
    totalWorkouts: state.totalWorkouts,
    bestStreak: state.bestStreak,
    totalXP: state.xp,
    chapter: state.chapter,
    uniqueTypes: state.workoutTypesUsed.length,
    longestWorkout: state.longestWorkout,
    earlyWorkouts: state.earlyWorkouts,
    lateWorkouts: state.lateWorkouts
  };
}

function getStreakStatus(state) {
  if (!state.lastWorkoutDate) return { status: "none", message: "Start your journey with your first workout!" };

  const now = new Date();
  const lastDate = state.lastWorkoutDate.split('T')[0];
  const todayStr = now.toISOString().split('T')[0];

  if (lastDate === todayStr) {
    return { status: "active", message: "You worked out today! Streak: " + state.currentStreak + " days" };
  }

  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

  if (lastDate === yesterdayStr) {
    return { status: "warning", message: "Work out today to keep your " + state.currentStreak + "-day streak alive!" };
  }

  return { status: "broken", message: "Your streak was broken. Start fresh today!" };
}

function getProgressToNextChapter(state) {
  const currentChapter = CHAPTERS[state.chapter];
  const nextChapter = CHAPTERS[state.chapter + 1];

  if (!nextChapter) return { percent: 100, remaining: 0, nextTitle: null };

  const rangeTotal = nextChapter.xpRequired - currentChapter.xpRequired;
  const rangeCurrent = state.xp - currentChapter.xpRequired;
  const percent = Math.min(100, Math.round((rangeCurrent / rangeTotal) * 100));
  const remaining = nextChapter.xpRequired - state.xp;

  return { percent, remaining, nextTitle: nextChapter.title };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createDefaultState, calculateXP, calculateLevel, getChapterForXP,
    isToday, isYesterday, daysBetween, logWorkout, getAchievementStats,
    getStreakStatus, getProgressToNextChapter
  };
}
