// NocheCalma Test Suite
const {
  SANCTUARY_OPEN_HOUR, SANCTUARY_CLOSE_HOUR,
  BREATHING_PATTERNS, GRATITUDE_PROMPTS, SOUNDSCAPES, RITUALS,
  isSanctuaryOpen, getTimeUntilOpen, getTimeUntilClose,
  getBreathingDuration, getGratitudePrompt,
  createDefaultState, startNight, completeRitual, addJournalEntry,
  getEnergyLevel, getNightsUntilNextMilestone, getClosingMessage,
} = require('../src/engine.js');

let passed = 0, failed = 0;
const failures = [];

function assert(cond, name) {
  if (cond) passed++;
  else { failed++; failures.push(name); console.log('  FAIL: ' + name); }
}
function assertEqual(exp, act, name) {
  if (exp === act) passed++;
  else { failed++; failures.push(`${name} (exp: ${exp}, got: ${act})`); console.log(`  FAIL: ${name} (exp: ${exp}, got: ${act})`); }
}
function assertGt(a, b, name) { assert(a > b, `${name} (${a} > ${b})`); }
function assertGte(a, b, name) { assert(a >= b, `${name} (${a} >= ${b})`); }
function assertLt(a, b, name) { assert(a < b, `${name} (${a} < ${b})`); }

console.log('=== NocheCalma Test Suite ===\n');

// ---- Time Gate Tests ----
console.log('[Time Gate Tests]');

// Midnight-6am is open
for (let h = 0; h < 6; h++) {
  assert(isSanctuaryOpen(h), `Hour ${h} is open`);
}
// 6am-midnight is closed
for (let h = 6; h < 24; h++) {
  assert(!isSanctuaryOpen(h), `Hour ${h} is closed`);
}

assertEqual(0, getTimeUntilOpen(0), 'Already open at midnight');
assertEqual(0, getTimeUntilOpen(3), 'Already open at 3am');
assertEqual(18, getTimeUntilOpen(6), '6am: 18h until open');
assertEqual(12, getTimeUntilOpen(12), 'Noon: 12h until open');
assertEqual(1, getTimeUntilOpen(23), '11pm: 1h until open');
assertEqual(6, getTimeUntilOpen(18), '6pm: 6h until open');

assertEqual(6, getTimeUntilClose(0), 'Midnight: 6h until close');
assertEqual(3, getTimeUntilClose(3), '3am: 3h until close');
assertEqual(1, getTimeUntilClose(5), '5am: 1h until close');
assertEqual(0, getTimeUntilClose(6), '6am: already closed');
assertEqual(0, getTimeUntilClose(12), 'Noon: closed');

console.log('  Time gate tests complete.\n');

// ---- Data Tests ----
console.log('[Data Tests]');

assertEqual(5, BREATHING_PATTERNS.length, '5 breathing patterns');
assertEqual(20, GRATITUDE_PROMPTS.length, '20 gratitude prompts');
assertEqual(6, SOUNDSCAPES.length, '6 soundscapes');
assertEqual(5, RITUALS.length, '5 rituals');

BREATHING_PATTERNS.forEach(p => {
  assert(p.name.length > 0, `Pattern "${p.name}" has name`);
  assert(p.steps.length > 0, `Pattern "${p.name}" has steps`);
  assert(p.cycles > 0, `Pattern "${p.name}" has cycles`);
  assert(p.description.length > 0, `Pattern "${p.name}" has description`);
  p.steps.forEach(s => {
    assert(['Inhale', 'Hold', 'Exhale'].includes(s.action), `Step action "${s.action}" is valid`);
    assertGt(s.seconds, 0, `Step has positive seconds`);
  });
});

GRATITUDE_PROMPTS.forEach((p, i) => {
  assert(p.length > 0, `Prompt ${i} not empty`);
  assert(p.endsWith('?') || p.endsWith('.'), `Prompt ${i} ends with ? or .`);
});

SOUNDSCAPES.forEach(s => {
  assert(s.name.length > 0, `Soundscape "${s.name}" has name`);
  assert(s.icon.length > 0, `Soundscape "${s.name}" has icon`);
});

RITUALS.forEach(r => {
  assert(r.id.length > 0, `Ritual has id`);
  assert(r.name.length > 0, `Ritual "${r.id}" has name`);
  assertGt(r.duration, 0, `Ritual "${r.id}" has duration`);
  assertGt(r.xp, 0, `Ritual "${r.id}" has xp`);
});

// Ritual IDs unique
const ritualIds = RITUALS.map(r => r.id);
assertEqual(ritualIds.length, new Set(ritualIds).size, 'Ritual IDs unique');

// Soundscape names unique
const soundNames = SOUNDSCAPES.map(s => s.name);
assertEqual(soundNames.length, new Set(soundNames).size, 'Soundscape names unique');

console.log('  Data tests complete.\n');

// ---- Breathing Duration Tests ----
console.log('[Breathing Duration Tests]');

// 4-7-8: (4+7+8) * 3 = 57s
assertEqual(57, getBreathingDuration(BREATHING_PATTERNS[0]), '4-7-8 duration');

// Box: (4+4+4+4) * 3 = 48s
assertEqual(48, getBreathingDuration(BREATHING_PATTERNS[1]), 'Box duration');

// Moonlight: (5+2+8) * 4 = 60s
assertEqual(60, getBreathingDuration(BREATHING_PATTERNS[2]), 'Moonlight duration');

// Equinox: (6+3+6+3) * 3 = 54s
assertEqual(54, getBreathingDuration(BREATHING_PATTERNS[3]), 'Equinox duration');

// Quick: (3+6) * 5 = 45s
assertEqual(45, getBreathingDuration(BREATHING_PATTERNS[4]), 'Quick duration');

// All durations positive
BREATHING_PATTERNS.forEach(p => {
  assertGt(getBreathingDuration(p), 0, `${p.name} has positive duration`);
});

console.log('  Breathing duration tests complete.\n');

// ---- Gratitude Prompt Tests ----
console.log('[Gratitude Prompt Tests]');

// Deterministic based on day of year
assertEqual(GRATITUDE_PROMPTS[0], getGratitudePrompt(0), 'Day 0 prompt');
assertEqual(GRATITUDE_PROMPTS[1], getGratitudePrompt(1), 'Day 1 prompt');
assertEqual(GRATITUDE_PROMPTS[19], getGratitudePrompt(19), 'Day 19 prompt');
assertEqual(GRATITUDE_PROMPTS[0], getGratitudePrompt(20), 'Day 20 wraps to 0');
assertEqual(GRATITUDE_PROMPTS[5], getGratitudePrompt(25), 'Day 25 wraps to 5');
assertEqual(GRATITUDE_PROMPTS[5], getGratitudePrompt(365), 'Day 365 wraps');

// All prompts are strings
for (let d = 0; d < 365; d++) {
  const p = getGratitudePrompt(d);
  assert(typeof p === 'string' && p.length > 0, `Day ${d} has valid prompt`);
}

console.log('  Gratitude prompt tests complete.\n');

// ---- Default State Tests ----
console.log('[Default State Tests]');

const ds = createDefaultState();
assertEqual(0, ds.energy, 'Default energy 0');
assertEqual(100, ds.maxEnergy, 'Max energy 100');
assertEqual(0, ds.totalRituals, 'Default 0 rituals');
assertEqual(0, ds.totalNights, 'Default 0 nights');
assertEqual(null, ds.currentNight, 'Default no current night');
assertEqual(0, ds.streakNights, 'Default 0 streak');
assertEqual(0, ds.bestStreak, 'Default 0 best streak');
assert(Array.isArray(ds.journalEntries), 'Journal is array');
assertEqual(0, ds.journalEntries.length, 'Journal empty');
assert(Array.isArray(ds.completedRituals), 'Completed rituals is array');

console.log('  Default state tests complete.\n');

// ---- Night Start Tests ----
console.log('[Night Start Tests]');

let s1 = createDefaultState();
s1 = startNight(s1);
assertEqual(1, s1.totalNights, 'First night counted');
assertEqual(1, s1.streakNights, 'Streak starts at 1');
assert(s1.currentNight !== null, 'Current night set');

// Same night doesn't re-count
const night = s1.currentNight;
s1 = startNight(s1);
assertEqual(1, s1.totalNights, 'Same night not re-counted');
assertEqual(night, s1.currentNight, 'Night unchanged');

// Energy decay between nights
let s2 = createDefaultState();
s2.energy = 80;
s2.lastVisitDate = '2026-03-28';
s2.currentNight = '2026-03-28';
// Force new night
s2.currentNight = null;
s2 = startNight(s2);
assertEqual(60, s2.energy, 'Energy decays by 20 between nights');

// Energy doesn't go below 0
let s3 = createDefaultState();
s3.energy = 10;
s3.currentNight = null;
s3 = startNight(s3);
assertEqual(0, s3.energy, 'Energy floors at 0');

console.log('  Night start tests complete.\n');

// ---- Ritual Tests ----
console.log('[Ritual Tests]');

let s4 = createDefaultState();
s4 = startNight(s4);

// Complete breathe ritual
let r1 = completeRitual(s4, 'breathe');
assertEqual(20, r1.xpGained, 'Breathe gives 20 energy');
assertEqual(20, s4.energy, 'Energy at 20');
assertEqual(1, s4.totalRituals, '1 ritual completed');
assert(s4.completedRituals.includes('breathe'), 'Breathe marked done');

// Can't complete same ritual twice
let r2 = completeRitual(s4, 'breathe');
assertEqual(0, r2.xpGained, 'No double completion');
assertEqual(1, s4.totalRituals, 'Still 1 ritual');

// Complete gratitude
let r3 = completeRitual(s4, 'gratitude');
assertEqual(15, r3.xpGained, 'Gratitude gives 15');
assertEqual(35, s4.energy, 'Energy at 35');
assertEqual(2, s4.totalRituals, '2 rituals');

// Complete all rituals
completeRitual(s4, 'release');
completeRitual(s4, 'soundscape');
completeRitual(s4, 'intention');
assertEqual(85, s4.energy, 'All rituals = 85 energy');
assertEqual(5, s4.totalRituals, '5 rituals');

// Energy caps at 100
s4.energy = 95;
let r4 = completeRitual(createDefaultState(), 'soundscape');
// Need fresh state for this
let s5 = createDefaultState();
s5.energy = 95;
s5 = startNight(s5);
// After startNight, energy decays to 75
assertEqual(75, s5.energy, 'Energy after decay');
let r5 = completeRitual(s5, 'soundscape');
assertEqual(100, s5.energy, 'Energy capped at 100');

// Unknown ritual
let r6 = completeRitual(s5, 'nonexistent');
assertEqual(0, r6.xpGained, 'Unknown ritual = 0');

console.log('  Ritual tests complete.\n');

// ---- Journal Tests ----
console.log('[Journal Tests]');

let s6 = createDefaultState();
s6 = startNight(s6);

s6 = addJournalEntry(s6, 'gratitude', 'My kid smiled at me today');
assertEqual(1, s6.journalEntries.length, '1 journal entry');
assertEqual('gratitude', s6.journalEntries[0].type, 'Entry type');
assertEqual('My kid smiled at me today', s6.journalEntries[0].text, 'Entry text');
assert(s6.journalEntries[0].date.length > 0, 'Entry has date');

s6 = addJournalEntry(s6, 'release', 'I let go of the guilt about screen time');
assertEqual(2, s6.journalEntries.length, '2 entries');

// Empty text ignored
s6 = addJournalEntry(s6, 'gratitude', '');
assertEqual(2, s6.journalEntries.length, 'Empty text ignored');

s6 = addJournalEntry(s6, 'gratitude', '   ');
assertEqual(2, s6.journalEntries.length, 'Whitespace text ignored');

// Journal caps at 100
let s7 = createDefaultState();
for (let i = 0; i < 105; i++) {
  s7 = addJournalEntry(s7, 'gratitude', 'Entry ' + i);
}
assertGte(s7.journalEntries.length, 100, 'Journal length <= 100 after 105 entries');
assertEqual(100, s7.journalEntries.length, 'Journal capped at 100');

console.log('  Journal tests complete.\n');

// ---- Energy Level Tests ----
console.log('[Energy Level Tests]');

assertEqual('Dark', getEnergyLevel(0).level, '0 = Dark');
assertEqual('Dark', getEnergyLevel(19).level, '19 = Dark');
assertEqual('Dim', getEnergyLevel(20).level, '20 = Dim');
assertEqual('Warm', getEnergyLevel(40).level, '40 = Warm');
assertEqual('Glowing', getEnergyLevel(60).level, '60 = Glowing');
assertEqual('Radiant', getEnergyLevel(80).level, '80 = Radiant');
assertEqual('Radiant', getEnergyLevel(100).level, '100 = Radiant');

// All levels have icons and colors
for (let e = 0; e <= 100; e += 10) {
  const info = getEnergyLevel(e);
  assert(info.icon.length > 0, `Energy ${e} has icon`);
  assert(info.color.length > 0, `Energy ${e} has color`);
  assert(info.level.length > 0, `Energy ${e} has level`);
}

console.log('  Energy level tests complete.\n');

// ---- Milestone Tests ----
console.log('[Milestone Tests]');

assertEqual(1, getNightsUntilNextMilestone(0).target, '0 nights -> target 1');
assertEqual(1, getNightsUntilNextMilestone(0).remaining, '0 nights -> 1 remaining');
assertEqual(3, getNightsUntilNextMilestone(1).target, '1 night -> target 3');
assertEqual(2, getNightsUntilNextMilestone(1).remaining, '1 night -> 2 remaining');
assertEqual(7, getNightsUntilNextMilestone(3).target, '3 nights -> target 7');
assertEqual(14, getNightsUntilNextMilestone(7).target, '7 nights -> target 14');
assertEqual(30, getNightsUntilNextMilestone(14).target, '14 -> target 30');
assertEqual(60, getNightsUntilNextMilestone(30).target, '30 -> target 60');
assertEqual(100, getNightsUntilNextMilestone(60).target, '60 -> target 100');
assertEqual(200, getNightsUntilNextMilestone(100).target, '100 -> target 200');
assertEqual(365, getNightsUntilNextMilestone(200).target, '200 -> target 365');

console.log('  Milestone tests complete.\n');

// ---- Closing Message Tests ----
console.log('[Closing Message Tests]');

assert(getClosingMessage(0).length > 0, 'Message at 0');
assert(getClosingMessage(20).length > 0, 'Message at 20');
assert(getClosingMessage(40).length > 0, 'Message at 40');
assert(getClosingMessage(60).length > 0, 'Message at 60');
assert(getClosingMessage(80).length > 0, 'Message at 80');
assert(getClosingMessage(100).length > 0, 'Message at 100');

// Different messages for different levels
assert(getClosingMessage(0) !== getClosingMessage(80), 'Different messages for different energy');

console.log('  Closing message tests complete.\n');

// ---- Integration Tests ----
console.log('[Integration Tests]');

// Full night simulation
let full = createDefaultState();
full = startNight(full);

// Complete all rituals
RITUALS.forEach(r => {
  completeRitual(full, r.id);
});

// Add journal entries
full = addJournalEntry(full, 'gratitude', 'Test gratitude');
full = addJournalEntry(full, 'release', 'Test release');

assertEqual(5, full.totalRituals, 'Integration: 5 rituals');
assertEqual(85, full.energy, 'Integration: 85 energy');
assertEqual(2, full.journalEntries.length, 'Integration: 2 journal entries');
assertEqual(1, full.totalNights, 'Integration: 1 night');
assertEqual('Radiant', getEnergyLevel(full.energy).level, 'Integration: Radiant energy');

// Multi-night simulation
let multi = createDefaultState();
for (let night = 0; night < 7; night++) {
  multi.currentNight = null; // force new night
  multi.lastVisitDate = `2026-03-${20 + night}`;
  multi = startNight(multi);
  RITUALS.forEach(r => {
    multi.completedRituals = []; // Reset for each night
    completeRitual(multi, r.id);
  });
}

assertGte(multi.totalNights, 7, 'Integration: 7+ nights');
assertGt(multi.totalRituals, 0, 'Integration: rituals accumulated');

console.log('  Integration tests complete.\n');

// ============ Results ============
console.log('================================');
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log('================================');
if (failures.length > 0) {
  console.log('\nFailures:');
  failures.forEach(f => console.log('  - ' + f));
}
process.exit(failed > 0 ? 1 : 0);
