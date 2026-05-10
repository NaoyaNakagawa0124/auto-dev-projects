// 焚火 — タイマーロジックのユニットテスト
// node --test tests/timer.test.mjs で実行

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  FocusTimer,
  PHASES,
  formatTime,
  FOCUS_SECONDS,
  REST_SECONDS,
} from '../timer.js';

// 仮想時計
function fakeClock(start = 0) {
  let t = start;
  return {
    now: () => t,
    advance: (ms) => { t += ms; },
  };
}

test('formatTime: 秒を mm:ss にフォーマットする', () => {
  assert.equal(formatTime(0), '00:00');
  assert.equal(formatTime(59), '00:59');
  assert.equal(formatTime(60), '01:00');
  assert.equal(formatTime(25 * 60), '25:00');
  assert.equal(formatTime(1500), '25:00');
});

test('formatTime: 負の値や小数を扱う', () => {
  assert.equal(formatTime(-10), '00:00');
  assert.equal(formatTime(59.9), '00:59');
});

test('FocusTimer: 初期状態は SLEEPING', () => {
  const timer = new FocusTimer();
  assert.equal(timer.phase, PHASES.SLEEPING);
  assert.equal(timer.cyclesCompleted, 0);
  assert.equal(timer.remaining(), 0);
});

test('FocusTimer: start() で FOCUSING に遷移する', () => {
  const clock = fakeClock(1000);
  const phaseChanges = [];
  const timer = new FocusTimer({
    now: clock.now,
    onPhaseChange: (p) => phaseChanges.push(p),
  });
  timer.start();
  assert.equal(timer.phase, PHASES.FOCUSING);
  assert.deepEqual(phaseChanges, [PHASES.FOCUSING]);
  timer.stop();
});

test('FocusTimer: remaining() は経過時間に応じて減る', () => {
  const clock = fakeClock(1000);
  const timer = new FocusTimer({ now: clock.now });
  timer.start();
  assert.equal(timer.remaining(), FOCUS_SECONDS);
  clock.advance(10_000);
  assert.equal(timer.remaining(), FOCUS_SECONDS - 10);
  clock.advance(60_000);
  assert.equal(timer.remaining(), FOCUS_SECONDS - 70);
  timer.stop();
});

test('FocusTimer: advance() で FOCUSING → RESTING、サイクルが+1', () => {
  const clock = fakeClock(0);
  const cycleEvents = [];
  const phaseChanges = [];
  const timer = new FocusTimer({
    now: clock.now,
    onPhaseChange: (p) => phaseChanges.push(p),
    onCycleComplete: (n) => cycleEvents.push(n),
  });
  timer.start();
  timer.advance();
  assert.equal(timer.phase, PHASES.RESTING);
  assert.equal(timer.cyclesCompleted, 1);
  assert.deepEqual(cycleEvents, [1]);
  assert.deepEqual(phaseChanges, [PHASES.FOCUSING, PHASES.RESTING]);
  timer.stop();
});

test('FocusTimer: RESTING の remaining() は REST_SECONDS から減る', () => {
  const clock = fakeClock(0);
  const timer = new FocusTimer({ now: clock.now });
  timer.start();
  timer.advance(); // → RESTING
  assert.equal(timer.remaining(), REST_SECONDS);
  clock.advance(60_000);
  assert.equal(timer.remaining(), REST_SECONDS - 60);
  timer.stop();
});

test('FocusTimer: RESTING で advance() すると FOCUSING に戻る（サイクル数は変わらない）', () => {
  const clock = fakeClock(0);
  const timer = new FocusTimer({ now: clock.now });
  timer.start();
  timer.advance(); // → RESTING, cycles=1
  const beforeCycles = timer.cyclesCompleted;
  timer.advance(); // → FOCUSING
  assert.equal(timer.phase, PHASES.FOCUSING);
  assert.equal(timer.cyclesCompleted, beforeCycles);
  timer.stop();
});

test('FocusTimer: stop() で SLEEPING に戻る', () => {
  const clock = fakeClock(0);
  const phaseChanges = [];
  const timer = new FocusTimer({
    now: clock.now,
    onPhaseChange: (p) => phaseChanges.push(p),
  });
  timer.start();
  timer.stop();
  assert.equal(timer.phase, PHASES.SLEEPING);
  assert.deepEqual(phaseChanges, [PHASES.FOCUSING, PHASES.SLEEPING]);
});

test('FocusTimer: 連続したサイクルがカウントされる', () => {
  const clock = fakeClock(0);
  const timer = new FocusTimer({ now: clock.now });
  timer.start();
  timer.advance(); // 1 完了 → REST
  timer.advance(); // → FOCUS
  timer.advance(); // 2 完了 → REST
  timer.advance(); // → FOCUS
  timer.advance(); // 3 完了 → REST
  assert.equal(timer.cyclesCompleted, 3);
  assert.equal(timer.phase, PHASES.RESTING);
  timer.stop();
});

test('FocusTimer: SLEEPING で start を再呼びしても遷移しない', () => {
  const clock = fakeClock(0);
  const phaseChanges = [];
  const timer = new FocusTimer({
    now: clock.now,
    onPhaseChange: (p) => phaseChanges.push(p),
  });
  timer.start();
  timer.start(); // 二回目は無視される
  timer.start();
  assert.deepEqual(phaseChanges, [PHASES.FOCUSING]);
  timer.stop();
});

test('FocusTimer: SLEEPING で advance() しても何も起きない', () => {
  const clock = fakeClock(0);
  const cycleEvents = [];
  const timer = new FocusTimer({
    now: clock.now,
    onCycleComplete: (n) => cycleEvents.push(n),
  });
  timer.advance();
  assert.equal(timer.phase, PHASES.SLEEPING);
  assert.deepEqual(cycleEvents, []);
});

test('FocusTimer: カスタムの focusSeconds / restSeconds を使える', () => {
  const clock = fakeClock(0);
  const timer = new FocusTimer({
    now: clock.now,
    focusSeconds: 5,
    restSeconds: 2,
  });
  timer.start();
  assert.equal(timer.remaining(), 5);
  clock.advance(2_000);
  assert.equal(timer.remaining(), 3);
  clock.advance(3_000);
  assert.equal(timer.remaining(), 0);
  timer.advance();
  assert.equal(timer.phase, PHASES.RESTING);
  assert.equal(timer.remaining(), 2);
  timer.stop();
});

test('FocusTimer: phaseStartedAt は遷移時にリセットされる', () => {
  const clock = fakeClock(1000);
  const timer = new FocusTimer({ now: clock.now });
  timer.start();
  assert.equal(timer.phaseStartedAt, 1000);
  clock.advance(10_000);
  timer.advance(); // → RESTING, started at 11000
  assert.equal(timer.phaseStartedAt, 11000);
  assert.equal(timer.elapsed(), 0);
  clock.advance(5_000);
  assert.equal(timer.elapsed(), 5);
  timer.stop();
});
