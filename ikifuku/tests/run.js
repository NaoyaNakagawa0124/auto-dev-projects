// IkiFuku Test Suite
import { BreathingEngine, PATTERNS, PHASES, PHASE_LABELS, SESSION_DURATION } from '../src/breathing.js';

let total = 0, passed = 0, failed = 0;
function describe(n, fn) { console.log(`\n  \x1b[1m${n}\x1b[0m`); fn(); }
function it(n, fn) { total++; try { fn(); passed++; console.log(`    \x1b[32m✓\x1b[0m ${n}`); } catch(e) { failed++; console.log(`    \x1b[31m✗\x1b[0m ${n}\n      \x1b[31m${e.message}\x1b[0m`); } }
function assert(c, m) { if (!c) throw new Error(m || 'Failed'); }
function eq(a, b, m) { if (a !== b) throw new Error(m || `Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); }

console.log('\n\x1b[1m🌬️ IkiFuku Test Suite\x1b[0m');

describe('Patterns', () => {
  it('should have 4 patterns', () => eq(Object.keys(PATTERNS).length, 4));
  it('should have relax pattern', () => assert(PATTERNS.relax));
  it('should have Japanese names', () => {
    Object.values(PATTERNS).forEach(p => assert(p.name.length > 0));
  });
  it('should have positive durations', () => {
    Object.values(PATTERNS).forEach(p => {
      assert(p.inhale > 0 && p.hold > 0 && p.exhale > 0);
    });
  });
  it('relax should be 4-7-8', () => {
    eq(PATTERNS.relax.inhale, 4);
    eq(PATTERNS.relax.hold, 7);
    eq(PATTERNS.relax.exhale, 8);
  });
});

describe('Phase Labels', () => {
  it('should have 3 labels', () => eq(Object.keys(PHASE_LABELS).length, 3));
  it('inhale should be 吸う', () => eq(PHASE_LABELS.inhale, '吸う'));
  it('hold should be 止める', () => eq(PHASE_LABELS.hold, '止める'));
  it('exhale should be 吐く', () => eq(PHASE_LABELS.exhale, '吐く'));
});

describe('Session Duration', () => {
  it('should be 5 minutes (300 seconds)', () => eq(SESSION_DURATION, 300));
});

describe('BreathingEngine - Init', () => {
  it('should start in inhale phase', () => {
    const e = new BreathingEngine();
    eq(e.phase, 'inhale');
  });
  it('should start not running', () => {
    const e = new BreathingEngine();
    eq(e.isRunning, false);
  });
  it('should start not complete', () => {
    const e = new BreathingEngine();
    eq(e.isComplete, false);
  });
  it('should have 0 cycle count', () => {
    const e = new BreathingEngine();
    eq(e.cycleCount, 0);
  });
  it('should use relax pattern by default', () => {
    const e = new BreathingEngine();
    eq(e.pattern.inhale, 4);
  });
  it('should accept custom pattern', () => {
    const e = new BreathingEngine('balance');
    eq(e.pattern.inhale, 4);
    eq(e.pattern.hold, 4);
  });
});

describe('BreathingEngine - Properties', () => {
  const e = new BreathingEngine('relax');
  it('phaseDuration should be inhale time initially', () => eq(e.phaseDuration, 4));
  it('cycleDuration should be sum of all phases', () => eq(e.cycleDuration, 19));
  it('phaseProgress should be 0 initially', () => eq(e.phaseProgress, 0));
  it('sessionProgress should be 0 initially', () => eq(e.sessionProgress, 0));
  it('breathValue should be 0 at start (empty lungs)', () => eq(e.breathValue, 0));
  it('timeRemaining should be SESSION_DURATION', () => eq(e.timeRemaining, SESSION_DURATION));
  it('phaseLabel should be 吸う', () => eq(e.phaseLabel, '吸う'));
});

describe('BreathingEngine - Tick', () => {
  it('should not tick when not running', () => {
    const e = new BreathingEngine();
    const result = e.tick(1);
    eq(result, null);
    eq(e.totalTime, 0);
  });
  it('should advance time when running', () => {
    const e = new BreathingEngine();
    e.start();
    e.tick(1);
    assert(e.totalTime > 0);
    assert(e.phaseTime > 0);
  });
  it('should transition from inhale to hold', () => {
    const e = new BreathingEngine('balance'); // 4-4-4
    e.start();
    const result = e.tick(4.1); // Past inhale duration
    assert(result !== null);
    eq(result.event, 'phaseChange');
    eq(result.from, 'inhale');
    eq(result.to, 'hold');
    eq(e.phase, 'hold');
  });
  it('should transition through full cycle', () => {
    const e = new BreathingEngine('balance'); // 4-4-4, cycle = 12s
    e.start();
    e.tick(4.1); // inhale → hold
    e.tick(4.1); // hold → exhale
    const result = e.tick(4.1); // exhale → inhale
    eq(result.to, 'inhale');
    eq(e.cycleCount, 1);
  });
  it('should complete after SESSION_DURATION', () => {
    const e = new BreathingEngine('balance');
    e.start();
    const result = e.tick(SESSION_DURATION + 1);
    assert(result !== null);
    eq(result.event, 'complete');
    assert(e.isComplete);
    assert(!e.isRunning);
  });
});

describe('BreathingEngine - breathValue', () => {
  it('should increase during inhale', () => {
    const e = new BreathingEngine('balance'); // 4-4-4
    e.start();
    e.tick(2); // half of inhale
    assert(e.breathValue > 0 && e.breathValue < 1, `breathValue: ${e.breathValue}`);
  });
  it('should be 1 during hold', () => {
    const e = new BreathingEngine('balance');
    e.start();
    e.tick(4.1); // transition to hold
    eq(e.breathValue, 1);
  });
  it('should decrease during exhale', () => {
    const e = new BreathingEngine('balance');
    e.start();
    e.tick(4.1); // → hold
    e.tick(4.1); // → exhale
    e.tick(2);   // midway exhale
    assert(e.breathValue > 0 && e.breathValue < 1);
  });
});

describe('BreathingEngine - Controls', () => {
  it('start should set isRunning', () => {
    const e = new BreathingEngine();
    e.start();
    assert(e.isRunning);
  });
  it('pause should clear isRunning', () => {
    const e = new BreathingEngine();
    e.start();
    e.pause();
    assert(!e.isRunning);
  });
  it('reset should restore initial state', () => {
    const e = new BreathingEngine();
    e.start();
    e.tick(10);
    e.reset();
    eq(e.totalTime, 0);
    eq(e.phase, 'inhale');
    eq(e.cycleCount, 0);
    assert(!e.isRunning);
  });
  it('reset with pattern should change pattern', () => {
    const e = new BreathingEngine('relax');
    e.reset('energize');
    eq(e.pattern.inhale, 4);
    eq(e.pattern.hold, 2);
    eq(e.pattern.exhale, 6);
  });
});

describe('BreathingEngine - Session Progress', () => {
  it('should be 0 at start', () => {
    const e = new BreathingEngine();
    eq(e.sessionProgress, 0);
  });
  it('should be ~0.5 at half time', () => {
    const e = new BreathingEngine();
    e.start();
    e.tick(SESSION_DURATION / 2);
    const p = e.sessionProgress;
    assert(p > 0.45 && p < 0.55, `progress: ${p}`);
  });
  it('should be capped at 1', () => {
    const e = new BreathingEngine();
    e.start();
    e.tick(SESSION_DURATION + 100);
    assert(e.sessionProgress <= 1);
  });
});

// Summary
console.log('\n' + '─'.repeat(50));
console.log(`\x1b[1m  Results: ${passed}/${total} passed\x1b[0m`);
if (failed > 0) { console.log(`  \x1b[31m${failed} failed\x1b[0m`); process.exit(1); }
else { console.log('  \x1b[32mAll tests passed! 🌬️\x1b[0m'); }
console.log('');
