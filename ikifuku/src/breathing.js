// Breathing cycle engine
// 4-7-8 breathing technique: inhale 4s, hold 7s, exhale 8s

export const PATTERNS = {
  'relax': { name: 'リラックス (4-7-8)', inhale: 4, hold: 7, exhale: 8 },
  'balance': { name: 'バランス (4-4-4)', inhale: 4, hold: 4, exhale: 4 },
  'energize': { name: 'エナジー (4-2-6)', inhale: 4, hold: 2, exhale: 6 },
  'calm': { name: 'カーム (5-5-5)', inhale: 5, hold: 5, exhale: 5 },
};

export const PHASES = { INHALE: 'inhale', HOLD: 'hold', EXHALE: 'exhale' };

export const PHASE_LABELS = {
  inhale: '吸う',
  hold: '止める',
  exhale: '吐く',
};

export const SESSION_DURATION = 5 * 60; // 5 minutes in seconds

export class BreathingEngine {
  constructor(patternId = 'relax') {
    this.pattern = PATTERNS[patternId] || PATTERNS.relax;
    this.phase = PHASES.INHALE;
    this.phaseTime = 0;     // Time elapsed in current phase
    this.totalTime = 0;     // Total session time
    this.cycleCount = 0;    // Completed breath cycles
    this.isRunning = false;
    this.isComplete = false;
  }

  get phaseDuration() {
    return this.pattern[this.phase];
  }

  get cycleDuration() {
    return this.pattern.inhale + this.pattern.hold + this.pattern.exhale;
  }

  get phaseProgress() {
    return Math.min(this.phaseTime / this.phaseDuration, 1.0);
  }

  get sessionProgress() {
    return Math.min(this.totalTime / SESSION_DURATION, 1.0);
  }

  get phaseLabel() {
    return PHASE_LABELS[this.phase];
  }

  get timeRemaining() {
    return Math.max(0, SESSION_DURATION - this.totalTime);
  }

  // Returns a 0-1 "breath value" where 0 = empty lungs, 1 = full lungs
  get breathValue() {
    const p = this.phaseProgress;
    switch (this.phase) {
      case PHASES.INHALE: return p;           // 0 → 1
      case PHASES.HOLD:   return 1.0;         // stays at 1
      case PHASES.EXHALE: return 1.0 - p;     // 1 → 0
      default: return 0;
    }
  }

  start() {
    this.isRunning = true;
  }

  pause() {
    this.isRunning = false;
  }

  reset(patternId) {
    if (patternId) this.pattern = PATTERNS[patternId] || PATTERNS.relax;
    this.phase = PHASES.INHALE;
    this.phaseTime = 0;
    this.totalTime = 0;
    this.cycleCount = 0;
    this.isRunning = false;
    this.isComplete = false;
  }

  tick(dt) {
    if (!this.isRunning || this.isComplete) return null;

    this.phaseTime += dt;
    this.totalTime += dt;

    // Check session complete
    if (this.totalTime >= SESSION_DURATION) {
      this.isComplete = true;
      this.isRunning = false;
      return { event: 'complete', cycles: this.cycleCount };
    }

    // Check phase transition
    if (this.phaseTime >= this.phaseDuration) {
      this.phaseTime -= this.phaseDuration;
      const prevPhase = this.phase;

      switch (this.phase) {
        case PHASES.INHALE:
          this.phase = PHASES.HOLD;
          break;
        case PHASES.HOLD:
          this.phase = PHASES.EXHALE;
          break;
        case PHASES.EXHALE:
          this.phase = PHASES.INHALE;
          this.cycleCount++;
          break;
      }

      return { event: 'phaseChange', from: prevPhase, to: this.phase, cycle: this.cycleCount };
    }

    return null;
  }
}
