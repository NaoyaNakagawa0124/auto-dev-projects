// timer.js — 集中/休憩サイクルの状態機械
// 副作用なしの純粋ロジック（テストしやすいように）

export const PHASES = {
  SLEEPING: 'sleeping',   // 火が消えている
  FOCUSING: 'focusing',   // 集中中
  RESTING:  'resting',    // 休憩中
};

export const FOCUS_SECONDS = 25 * 60;
export const REST_SECONDS  = 5 * 60;

export class FocusTimer {
  constructor({
    focusSeconds = FOCUS_SECONDS,
    restSeconds  = REST_SECONDS,
    onTick       = () => {},
    onPhaseChange = () => {},
    onCycleComplete = () => {},
    now = () => Date.now(),
  } = {}) {
    this.focusSeconds = focusSeconds;
    this.restSeconds  = restSeconds;
    this.onTick = onTick;
    this.onPhaseChange = onPhaseChange;
    this.onCycleComplete = onCycleComplete;
    this.now = now;

    this.phase = PHASES.SLEEPING;
    this.phaseStartedAt = 0;
    this.cyclesCompleted = 0;
    this._intervalId = null;
  }

  // 経過秒数（現在のフェーズ内）
  elapsed() {
    if (this.phase === PHASES.SLEEPING) return 0;
    return Math.floor((this.now() - this.phaseStartedAt) / 1000);
  }

  remaining() {
    if (this.phase === PHASES.FOCUSING) {
      return Math.max(0, this.focusSeconds - this.elapsed());
    }
    if (this.phase === PHASES.RESTING) {
      return Math.max(0, this.restSeconds - this.elapsed());
    }
    return 0;
  }

  start() {
    if (this.phase !== PHASES.SLEEPING) return;
    this._setPhase(PHASES.FOCUSING);
    this._startInterval();
  }

  stop() {
    this._stopInterval();
    if (this.phase !== PHASES.SLEEPING) {
      this._setPhase(PHASES.SLEEPING);
    }
  }

  // 強制的に次のフェーズへ（テスト/デバッグ用にも使える）
  advance() {
    if (this.phase === PHASES.FOCUSING) {
      this.cyclesCompleted += 1;
      this.onCycleComplete(this.cyclesCompleted);
      this._setPhase(PHASES.RESTING);
    } else if (this.phase === PHASES.RESTING) {
      this._setPhase(PHASES.FOCUSING);
    }
  }

  // 内部: フェーズ遷移
  _setPhase(next) {
    if (this.phase === next) return;
    this.phase = next;
    this.phaseStartedAt = this.now();
    this.onPhaseChange(next);
  }

  _startInterval() {
    if (this._intervalId) return;
    this._intervalId = setInterval(() => this._tick(), 250);
  }

  _stopInterval() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  _tick() {
    if (this.phase === PHASES.SLEEPING) return;
    const remaining = this.remaining();
    this.onTick({
      phase: this.phase,
      remaining,
      cycles: this.cyclesCompleted,
    });
    if (remaining === 0) {
      this.advance();
    }
  }
}

// 秒数を mm:ss にフォーマット
export function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}
