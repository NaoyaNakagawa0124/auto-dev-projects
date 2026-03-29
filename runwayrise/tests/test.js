// RunwayRise Test Suite

// Load modules
const storyModule = require('../js/story.js');
const engineModule = require('../js/engine.js');

// Make globals available (engine.js expects CHAPTERS etc to be global)
global.CHAPTERS = storyModule.CHAPTERS;
global.ACHIEVEMENTS = storyModule.ACHIEVEMENTS;
global.WORKOUT_TYPES = storyModule.WORKOUT_TYPES;

const {
  createDefaultState, calculateXP, calculateLevel, getChapterForXP,
  isToday, isYesterday, daysBetween, logWorkout, getAchievementStats,
  getStreakStatus, getProgressToNextChapter
} = engineModule;

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, name) {
  if (condition) { passed++; }
  else { failed++; failures.push(name); console.log('  FAIL: ' + name); }
}

function assertEqual(expected, actual, name) {
  if (expected === actual) { passed++; }
  else { failed++; failures.push(name + ' (expected: ' + expected + ', got: ' + actual + ')'); console.log('  FAIL: ' + name + ' (expected: ' + expected + ', got: ' + actual + ')'); }
}

function assertGreater(a, b, name) {
  assert(a > b, name + ' (' + a + ' > ' + b + ')');
}

function assertGreaterOrEqual(a, b, name) {
  assert(a >= b, name + ' (' + a + ' >= ' + b + ')');
}

// ============ Story Data Tests ============
console.log('=== RunwayRise Test Suite ===\n');
console.log('[Story Data Tests]');

assertEqual(7, CHAPTERS.length, 'There are 7 chapters');
assertEqual(15, ACHIEVEMENTS.length, 'There are 15 achievements');
assertEqual(10, WORKOUT_TYPES.length, 'There are 10 workout types');

// Chapter structure
CHAPTERS.forEach((ch, i) => {
  assert(ch.id === i, 'Chapter ' + i + ' has correct id');
  assert(ch.title.length > 0, 'Chapter ' + i + ' has title');
  assert(ch.role.length > 0, 'Chapter ' + i + ' has role');
  assert(ch.narrative.length > 0, 'Chapter ' + i + ' has narrative');
  assert(ch.outfitEmoji.length > 0, 'Chapter ' + i + ' has outfit emoji');
  assert(ch.color.length > 0, 'Chapter ' + i + ' has color');
  assert(ch.outfit.top.length > 0, 'Chapter ' + i + ' has outfit top');
  assert(ch.outfit.bottom.length > 0, 'Chapter ' + i + ' has outfit bottom');
  assert(ch.outfit.shoes.length > 0, 'Chapter ' + i + ' has outfit shoes');
  assert(ch.outfit.accessory.length > 0, 'Chapter ' + i + ' has outfit accessory');
  assert(typeof ch.xpRequired === 'number', 'Chapter ' + i + ' has xpRequired');
});

// Chapters have increasing XP requirements
for (let i = 1; i < CHAPTERS.length; i++) {
  assert(CHAPTERS[i].xpRequired > CHAPTERS[i-1].xpRequired, 'Chapter ' + i + ' requires more XP than chapter ' + (i-1));
}

assertEqual(0, CHAPTERS[0].xpRequired, 'Chapter 0 starts at 0 XP');

// Achievement structure
ACHIEVEMENTS.forEach(ach => {
  assert(ach.id.length > 0, 'Achievement ' + ach.id + ' has id');
  assert(ach.name.length > 0, 'Achievement ' + ach.id + ' has name');
  assert(ach.description.length > 0, 'Achievement ' + ach.id + ' has description');
  assert(ach.icon.length > 0, 'Achievement ' + ach.id + ' has icon');
  assert(typeof ach.condition === 'function', 'Achievement ' + ach.id + ' has condition function');
});

// Achievement IDs are unique
const achIds = ACHIEVEMENTS.map(a => a.id);
assertEqual(achIds.length, new Set(achIds).size, 'Achievement IDs are unique');

// Workout type structure
WORKOUT_TYPES.forEach(type => {
  assert(type.id.length > 0, 'Workout type ' + type.id + ' has id');
  assert(type.name.length > 0, 'Workout type ' + type.id + ' has name');
  assert(type.icon.length > 0, 'Workout type ' + type.id + ' has icon');
  assert(type.xpPerMin > 0, 'Workout type ' + type.id + ' has positive xpPerMin');
  assert(type.flavor.length > 0, 'Workout type ' + type.id + ' has flavor text');
});

// Workout type IDs are unique
const typeIds = WORKOUT_TYPES.map(t => t.id);
assertEqual(typeIds.length, new Set(typeIds).size, 'Workout type IDs are unique');

console.log('  Story data tests complete.\n');

// ============ Default State Tests ============
console.log('[Default State Tests]');

const defaultState = createDefaultState();
assertEqual(0, defaultState.xp, 'Default XP is 0');
assertEqual(1, defaultState.level, 'Default level is 1');
assertEqual(0, defaultState.chapter, 'Default chapter is 0');
assertEqual(0, defaultState.currentStreak, 'Default streak is 0');
assertEqual(0, defaultState.bestStreak, 'Default best streak is 0');
assertEqual(null, defaultState.lastWorkoutDate, 'Default no last workout');
assertEqual(0, defaultState.totalWorkouts, 'Default 0 workouts');
assertEqual(0, defaultState.totalMinutes, 'Default 0 minutes');
assert(Array.isArray(defaultState.workoutHistory), 'History is array');
assertEqual(0, defaultState.workoutHistory.length, 'History starts empty');
assert(Array.isArray(defaultState.unlockedAchievements), 'Achievements is array');
assertEqual(0, defaultState.unlockedAchievements.length, 'No achievements unlocked');
assertEqual(0, defaultState.storyProgress, 'Story progress starts at 0');

console.log('  Default state tests complete.\n');

// ============ XP Calculation Tests ============
console.log('[XP Calculation Tests]');

// Basic XP calculations
const runXP = calculateXP('run', 30);
assertEqual(72, runXP, 'Running 30min = 72 XP (2.0 * 30 * 1.2 bonus)');

const walkXP = calculateXP('walk', 15);
assertEqual(15, walkXP, 'Walking 15min = 15 XP (1.0 * 15)');

const hiitXP = calculateXP('hiit', 20);
assertEqual(60, hiitXP, 'HIIT 20min = 60 XP (3.0 * 20)');

const strengthXP = calculateXP('strength', 60);
assertEqual(225, strengthXP, 'Strength 60min = 225 XP (2.5 * 60 * 1.5 long bonus)');

const swimXP = calculateXP('swim', 45);
assertEqual(136, swimXP, 'Swimming 45min = 136 XP (round(2.5*45)=113, round(113*1.2)=136)');

// Edge cases
assertEqual(0, calculateXP(null, 30), 'Null type returns 0');
assertEqual(0, calculateXP('run', 0), '0 duration returns 0');
assertEqual(0, calculateXP('run', -5), 'Negative duration returns 0');
assertEqual(0, calculateXP('invalid', 30), 'Invalid type returns 0');

// Short workout
const shortXP = calculateXP('walk', 5);
assertEqual(5, shortXP, 'Walking 5min = 5 XP (no bonus)');

// Long workout bonus
const longRun = calculateXP('run', 60);
assertEqual(180, longRun, 'Running 60min = 180 XP (2.0 * 60 * 1.5)');

const medRun = calculateXP('run', 30);
assertEqual(72, medRun, 'Running 30min = 72 XP (2.0 * 30 * 1.2)');

console.log('  XP calculation tests complete.\n');

// ============ Level Calculation Tests ============
console.log('[Level Calculation Tests]');

const lvl0 = calculateLevel(0);
assertEqual(1, lvl0.level, 'Level 1 at 0 XP');
assertEqual(0, lvl0.currentThreshold, 'Threshold 0 at level 1');

const lvl50 = calculateLevel(50);
assertEqual(2, lvl50.level, 'Level 2 at 50 XP');

const lvl200 = calculateLevel(200);
assertGreater(lvl200.level, 2, 'Level > 2 at 200 XP');

const lvl1000 = calculateLevel(1000);
assertGreater(lvl1000.level, 5, 'Level > 5 at 1000 XP');

const lvl5000 = calculateLevel(5000);
assertGreater(lvl5000.level, 10, 'Level > 10 at 5000 XP');

// Level always increases with XP
let prevLevel = 1;
for (let xp = 0; xp <= 10000; xp += 100) {
  const l = calculateLevel(xp);
  assert(l.level >= prevLevel, 'Level never decreases at XP ' + xp);
  prevLevel = l.level;
}

// Next threshold always greater than current
const testLevel = calculateLevel(500);
assert(testLevel.nextThreshold > testLevel.currentThreshold, 'Next threshold > current threshold');

console.log('  Level calculation tests complete.\n');

// ============ Chapter Tests ============
console.log('[Chapter Tests]');

assertEqual(0, getChapterForXP(0), 'Chapter 0 at 0 XP');
assertEqual(0, getChapterForXP(50), 'Chapter 0 at 50 XP');
assertEqual(1, getChapterForXP(100), 'Chapter 1 at 100 XP');
assertEqual(1, getChapterForXP(349), 'Chapter 1 at 349 XP');
assertEqual(2, getChapterForXP(350), 'Chapter 2 at 350 XP');
assertEqual(3, getChapterForXP(750), 'Chapter 3 at 750 XP');
assertEqual(4, getChapterForXP(1500), 'Chapter 4 at 1500 XP');
assertEqual(5, getChapterForXP(3000), 'Chapter 5 at 3000 XP');
assertEqual(6, getChapterForXP(5000), 'Chapter 6 at 5000 XP');
assertEqual(6, getChapterForXP(99999), 'Chapter 6 at max XP');

console.log('  Chapter tests complete.\n');

// ============ Date Utility Tests ============
console.log('[Date Utility Tests]');

const now = new Date();
const todayStr = now.toISOString();
assert(isToday(todayStr), 'isToday for today');
assert(!isToday(null), 'isToday null is false');

const yesterday = new Date(now);
yesterday.setDate(yesterday.getDate() - 1);
assert(isYesterday(yesterday.toISOString()), 'isYesterday for yesterday');
assert(!isYesterday(todayStr), 'isYesterday for today is false');
assert(!isYesterday(null), 'isYesterday null is false');

assertEqual(1, daysBetween('2026-03-28T00:00:00Z', '2026-03-29T00:00:00Z'), 'Days between consecutive dates');
assertEqual(0, daysBetween('2026-03-29T00:00:00Z', '2026-03-29T00:00:00Z'), 'Days between same date');
assertEqual(7, daysBetween('2026-03-22T00:00:00Z', '2026-03-29T00:00:00Z'), 'Days between week apart');
assertEqual(Infinity, daysBetween(null, '2026-03-29T00:00:00Z'), 'Days between with null');

console.log('  Date utility tests complete.\n');

// ============ Workout Logging Tests ============
console.log('[Workout Logging Tests]');

// First workout
let s1 = createDefaultState();
let r1 = logWorkout(s1, 'run', 30, '2026-03-29T08:00:00Z');
assertEqual(72, r1.xpGained, 'First workout XP');
assertEqual(72, r1.state.xp, 'Total XP after first workout');
assertEqual(1, r1.state.totalWorkouts, 'Workout count');
assertEqual(30, r1.state.totalMinutes, 'Total minutes');
assertEqual(1, r1.state.currentStreak, 'Streak starts at 1');
assert(r1.state.workoutHistory.length === 1, 'History has 1 entry');
assert(r1.newAchievements.length > 0, 'First workout unlocks achievement');
assert(r1.state.unlockedAchievements.includes('first_workout'), 'First Stitch achievement');

// Same-day workout (streak unchanged)
let r2 = logWorkout(s1, 'yoga', 20, '2026-03-29T17:00:00Z');
assertEqual(1, r2.state.currentStreak, 'Same-day streak stays 1');
assertEqual(2, r2.state.totalWorkouts, 'Now 2 workouts');

// Next-day workout (streak increments)
let r3 = logWorkout(s1, 'strength', 45, '2026-03-30T08:00:00Z');
assertEqual(2, r3.state.currentStreak, 'Streak incremented to 2');

// Another next day
let r4 = logWorkout(s1, 'cycling', 30, '2026-03-31T10:00:00Z');
assertEqual(3, r4.state.currentStreak, 'Streak incremented to 3');
assert(r4.state.unlockedAchievements.includes('streak_3'), '3-day streak achievement');

// Streak break (skip a day)
let r5 = logWorkout(s1, 'walk', 20, '2026-04-02T10:00:00Z');
assertEqual(1, r5.state.currentStreak, 'Streak reset after gap');
assertEqual(3, r5.state.bestStreak, 'Best streak preserved');

// Chapter advancement
let s2 = createDefaultState();
let r6 = logWorkout(s2, 'hiit', 60, '2026-03-29T10:00:00Z'); // 3.0 * 60 * 1.5 = 270 XP
assertEqual(270, r6.xpGained, 'HIIT 60min XP');
assert(r6.state.chapter >= 1, 'Advanced to chapter 1+');
assert(r6.newChapter, 'New chapter flag set');

// Invalid workout
let s3 = createDefaultState();
let r7 = logWorkout(s3, null, 30);
assertEqual(0, r7.xpGained, 'Null type = 0 XP');
assertEqual(0, r7.state.totalWorkouts, 'No workout counted');

let r8 = logWorkout(s3, 'run', 0);
assertEqual(0, r8.xpGained, '0 duration = 0 XP');

// Workout type variety tracking
let s4 = createDefaultState();
logWorkout(s4, 'run', 10, '2026-03-29T10:00:00Z');
logWorkout(s4, 'yoga', 10, '2026-03-29T11:00:00Z');
logWorkout(s4, 'swim', 10, '2026-03-29T12:00:00Z');
assertEqual(3, s4.workoutTypesUsed.length, '3 unique workout types');

// Duplicate type doesn't add
logWorkout(s4, 'run', 10, '2026-03-29T13:00:00Z');
assertEqual(3, s4.workoutTypesUsed.length, 'Still 3 after duplicate');

// Longest workout tracking
let s5 = createDefaultState();
logWorkout(s5, 'run', 15, '2026-03-29T10:00:00Z');
assertEqual(15, s5.longestWorkout, 'Longest workout 15');
logWorkout(s5, 'run', 45, '2026-03-29T11:00:00Z');
assertEqual(45, s5.longestWorkout, 'Longest workout updated to 45');
logWorkout(s5, 'run', 30, '2026-03-29T12:00:00Z');
assertEqual(45, s5.longestWorkout, 'Longest workout stays 45');

// Early bird workout
let s6 = createDefaultState();
logWorkout(s6, 'run', 30, '2026-03-29T05:30:00Z');
assertEqual(1, s6.earlyWorkouts, 'Early workout counted');

// Night owl workout
logWorkout(s6, 'run', 30, '2026-03-29T23:00:00Z');
assertEqual(1, s6.lateWorkouts, 'Late workout counted');

// History capping at 100
let s7 = createDefaultState();
for (let i = 0; i < 105; i++) {
  logWorkout(s7, 'walk', 5, '2026-01-' + String(1 + (i % 28)).padStart(2, '0') + 'T10:00:00Z');
}
assert(s7.workoutHistory.length <= 100, 'History capped at 100');

console.log('  Workout logging tests complete.\n');

// ============ Achievement Tests ============
console.log('[Achievement Tests]');

// Test achievement conditions directly
const baseStats = { totalWorkouts: 0, bestStreak: 0, totalXP: 0, chapter: 0, uniqueTypes: 0, longestWorkout: 0, earlyWorkouts: 0, lateWorkouts: 0 };

assert(!ACHIEVEMENTS[0].condition(baseStats), 'first_workout not met at 0');
assert(ACHIEVEMENTS[0].condition({...baseStats, totalWorkouts: 1}), 'first_workout met at 1');

assert(!ACHIEVEMENTS[1].condition(baseStats), 'streak_3 not met at 0');
assert(ACHIEVEMENTS[1].condition({...baseStats, bestStreak: 3}), 'streak_3 met at 3');

assert(!ACHIEVEMENTS[2].condition(baseStats), 'streak_7 not met');
assert(ACHIEVEMENTS[2].condition({...baseStats, bestStreak: 7}), 'streak_7 met at 7');

assert(ACHIEVEMENTS[3].condition({...baseStats, bestStreak: 30}), 'streak_30 met at 30');
assert(ACHIEVEMENTS[7].condition({...baseStats, totalXP: 1000}), 'xp_1000 met');
assert(ACHIEVEMENTS[8].condition({...baseStats, totalXP: 5000}), 'xp_5000 met');
assert(ACHIEVEMENTS[9].condition({...baseStats, chapter: 3}), 'chapter_3 met');
assert(ACHIEVEMENTS[10].condition({...baseStats, chapter: 6}), 'chapter_6 met');
assert(ACHIEVEMENTS[11].condition({...baseStats, uniqueTypes: 5}), 'variety_5 met');
assert(ACHIEVEMENTS[12].condition({...baseStats, longestWorkout: 60}), 'long_workout met');
assert(ACHIEVEMENTS[13].condition({...baseStats, earlyWorkouts: 1}), 'early_bird met');
assert(ACHIEVEMENTS[14].condition({...baseStats, lateWorkouts: 1}), 'night_owl met');

// Achievement stats from state
let achState = createDefaultState();
achState.totalWorkouts = 5;
achState.bestStreak = 3;
achState.xp = 500;
achState.chapter = 2;
achState.workoutTypesUsed = ['run', 'yoga', 'swim'];
achState.longestWorkout = 45;
achState.earlyWorkouts = 1;
achState.lateWorkouts = 0;

const stats = getAchievementStats(achState);
assertEqual(5, stats.totalWorkouts, 'Stats totalWorkouts');
assertEqual(3, stats.bestStreak, 'Stats bestStreak');
assertEqual(500, stats.totalXP, 'Stats totalXP');
assertEqual(2, stats.chapter, 'Stats chapter');
assertEqual(3, stats.uniqueTypes, 'Stats uniqueTypes');
assertEqual(45, stats.longestWorkout, 'Stats longestWorkout');
assertEqual(1, stats.earlyWorkouts, 'Stats earlyWorkouts');
assertEqual(0, stats.lateWorkouts, 'Stats lateWorkouts');

// Achievements don't unlock twice
let s8 = createDefaultState();
let ra = logWorkout(s8, 'run', 10, '2026-03-29T10:00:00Z');
const firstAchCount = ra.newAchievements.length;
let rb = logWorkout(s8, 'run', 10, '2026-03-29T11:00:00Z');
// first_workout shouldn't unlock again
assert(!rb.newAchievements.find(a => a.id === 'first_workout'), 'first_workout not re-unlocked');

console.log('  Achievement tests complete.\n');

// ============ Streak Status Tests ============
console.log('[Streak Status Tests]');

let streakState = createDefaultState();
let ss1 = getStreakStatus(streakState);
assertEqual('none', ss1.status, 'No workout = none status');

// After workout today
logWorkout(streakState, 'run', 10);
let ss2 = getStreakStatus(streakState);
assertEqual('active', ss2.status, 'After workout today = active');

// Simulate yesterday workout
let yesterdayState = createDefaultState();
const yesterdayDate = new Date();
yesterdayDate.setDate(yesterdayDate.getDate() - 1);
yesterdayState.lastWorkoutDate = yesterdayDate.toISOString();
yesterdayState.currentStreak = 5;
let ss3 = getStreakStatus(yesterdayState);
assertEqual('warning', ss3.status, 'Yesterday workout = warning');
assert(ss3.message.includes('5'), 'Warning mentions streak count');

// Simulate old workout
let oldState = createDefaultState();
const oldDate = new Date();
oldDate.setDate(oldDate.getDate() - 5);
oldState.lastWorkoutDate = oldDate.toISOString();
let ss4 = getStreakStatus(oldState);
assertEqual('broken', ss4.status, 'Old workout = broken');

console.log('  Streak status tests complete.\n');

// ============ Progress Tests ============
console.log('[Progress Tests]');

let progressState = createDefaultState();
progressState.xp = 0;
progressState.chapter = 0;
let p1 = getProgressToNextChapter(progressState);
assertEqual(0, p1.percent, '0% progress at start');
assertEqual(100, p1.remaining, '100 XP to chapter 1');
assertEqual('The Assistant', p1.nextTitle, 'Next chapter is The Assistant');

progressState.xp = 50;
let p2 = getProgressToNextChapter(progressState);
assertEqual(50, p2.percent, '50% progress at 50 XP');
assertEqual(50, p2.remaining, '50 XP remaining');

progressState.xp = 100;
progressState.chapter = 1;
let p3 = getProgressToNextChapter(progressState);
assertEqual(0, p3.percent, '0% at chapter 1 start');
assertEqual(250, p3.remaining, '250 XP to chapter 2');

// Last chapter
progressState.xp = 5000;
progressState.chapter = 6;
let p4 = getProgressToNextChapter(progressState);
assertEqual(100, p4.percent, '100% at last chapter');
assertEqual(null, p4.nextTitle, 'No next chapter');

console.log('  Progress tests complete.\n');

// ============ Integration Tests ============
console.log('[Integration Tests]');

// Full playthrough simulation
let fullState = createDefaultState();
let totalXPEarned = 0;
let chaptersReached = new Set([0]);
let achievementsUnlocked = [];

// Simulate 30 days of workouts
for (let day = 1; day <= 30; day++) {
  const date = '2026-03-' + String(day).padStart(2, '0') + 'T08:00:00Z';
  const types = ['run', 'strength', 'yoga', 'cycling', 'swim', 'dance', 'hiit', 'stretch', 'sports', 'walk'];
  const type = types[(day - 1) % types.length];
  const duration = 20 + (day % 4) * 10; // 20-50 min

  const result = logWorkout(fullState, type, duration, date);
  totalXPEarned += result.xpGained;
  chaptersReached.add(fullState.chapter);
  achievementsUnlocked = achievementsUnlocked.concat(result.newAchievements.map(a => a.id));
}

assertGreater(totalXPEarned, 0, 'Integration: earned XP');
assertEqual(30, fullState.totalWorkouts, 'Integration: 30 workouts');
assertEqual(30, fullState.currentStreak, 'Integration: 30-day streak');
assertEqual(30, fullState.bestStreak, 'Integration: best streak 30');
assert(chaptersReached.size > 1, 'Integration: reached multiple chapters');
assertGreater(achievementsUnlocked.length, 3, 'Integration: multiple achievements');

// Verify specific achievements
assert(achievementsUnlocked.includes('first_workout'), 'Integration: first_workout');
assert(achievementsUnlocked.includes('streak_3'), 'Integration: streak_3');
assert(achievementsUnlocked.includes('streak_7'), 'Integration: streak_7');
assert(achievementsUnlocked.includes('streak_30'), 'Integration: streak_30');
assert(achievementsUnlocked.includes('workouts_10'), 'Integration: workouts_10');

// Verify all workout types used
assertEqual(10, fullState.workoutTypesUsed.length, 'Integration: all 10 types used');
assert(achievementsUnlocked.includes('variety_5'), 'Integration: variety_5 achieved');

// Verify level progression
assertGreater(fullState.level, 5, 'Integration: level > 5 after 30 workouts');

// XP matches individual calculations
assertEqual(fullState.xp, totalXPEarned, 'Integration: XP totals match');

// Story data integrity
const currentChapter = CHAPTERS[fullState.chapter];
assert(fullState.xp >= currentChapter.xpRequired, 'Integration: XP meets chapter requirement');

// Progress calculation consistency
const progress = getProgressToNextChapter(fullState);
assert(progress.percent >= 0 && progress.percent <= 100, 'Integration: progress is valid percentage');

console.log('  Integration tests complete.\n');

// ============ Edge Case Tests ============
console.log('[Edge Case Tests]');

// All workout types produce valid XP
WORKOUT_TYPES.forEach(type => {
  const xp = calculateXP(type.id, 10);
  assertGreater(xp, 0, 'XP > 0 for ' + type.id + ' at 10min');
});

// Chapter transitions at exact boundaries
CHAPTERS.forEach((ch, i) => {
  if (i > 0) {
    assertEqual(i, getChapterForXP(ch.xpRequired), 'Chapter ' + i + ' at exact boundary ' + ch.xpRequired);
    assertEqual(i - 1, getChapterForXP(ch.xpRequired - 1), 'Chapter ' + (i-1) + ' at ' + (ch.xpRequired - 1));
  }
});

// Very large XP
assertEqual(6, getChapterForXP(1000000), 'Max chapter at huge XP');
const hugeLvl = calculateLevel(1000000);
assertGreater(hugeLvl.level, 50, 'High level at huge XP');

// Multiple workouts same timestamp
let sameTimeState = createDefaultState();
logWorkout(sameTimeState, 'run', 10, '2026-03-29T10:00:00Z');
logWorkout(sameTimeState, 'yoga', 10, '2026-03-29T10:00:00Z');
assertEqual(2, sameTimeState.totalWorkouts, 'Two workouts at same time counted');

console.log('  Edge case tests complete.\n');

// ============ Results ============
console.log('================================');
console.log('  Results: ' + passed + ' passed, ' + failed + ' failed');
console.log('================================');
if (failures.length > 0) {
  console.log('\nFailures:');
  failures.forEach(f => console.log('  - ' + f));
}
process.exit(failed > 0 ? 1 : 0);
