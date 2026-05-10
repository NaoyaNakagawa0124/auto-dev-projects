// app.js — エントリーポイント。焚火・音・タイマー・UIを束ねる。

import { Fire } from './fire.js';
import { Ambience } from './ambience.js';
import { FocusTimer, PHASES, formatTime, FOCUS_SECONDS, REST_SECONDS } from './timer.js';

const STORAGE_KEY = 'takibi.state.v1';

// ---- 状態の読み書き（同じ日のサイクル数を保持） ----
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: todayKey(), cycles: 0 };
    const parsed = JSON.parse(raw);
    if (parsed.date !== todayKey()) return { date: todayKey(), cycles: 0 };
    return parsed;
  } catch (e) {
    return { date: todayKey(), cycles: 0 };
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    /* ignore */
  }
}

// ---- DOM ----
const els = {
  app: document.getElementById('app'),
  canvas: document.getElementById('fire'),
  phaseLabel: document.getElementById('phase-label'),
  timeDisplay: document.getElementById('time-display'),
  btnFire: document.getElementById('btn-fire'),
  btnSound: document.getElementById('btn-sound'),
  cycleCount: document.getElementById('cycle-count'),
  hint: document.getElementById('hint'),
};

const PHASE_TEXT = {
  [PHASES.SLEEPING]: '焚火は眠っています',
  [PHASES.FOCUSING]: '集中の時間',
  [PHASES.RESTING]:  '焚火のそばで一息',
};

const HINT_TEXT = {
  [PHASES.SLEEPING]: 'タップで焚火を灯します。集中25分・休憩5分の静かなサイクル。',
  [PHASES.FOCUSING]: '深呼吸して、目の前のことに戻りましょう。',
  [PHASES.RESTING]:  '肩の力を抜いて、火を眺めるだけでいい。',
};

const FIRE_LABEL = {
  on:  '火を消す',
  off: '火を灯す',
};

const SOUND_LABEL = {
  on:  '音を止める',
  off: '音を聞く',
};

// ---- 初期化 ----
const state = loadState();
const fire = new Fire(els.canvas);
const ambience = new Ambience();
let soundOn = false;

const timer = new FocusTimer({
  onTick: ({ remaining, phase }) => {
    els.timeDisplay.textContent = formatTime(remaining);
  },
  onPhaseChange: (next) => {
    applyPhaseUI(next);
    fire.setMode(next);
    if (soundOn) {
      ambience.setIntensity(next === PHASES.RESTING ? 1.2 : 1.0);
    }
  },
  onCycleComplete: (cycles) => {
    state.cycles = cycles;
    saveState(state);
    els.cycleCount.textContent = String(cycles);
    fire.feed();
  },
});

// state 復元（過去サイクル数のみ。タイマーは sleeping から始める）
timer.cyclesCompleted = state.cycles;
els.cycleCount.textContent = String(state.cycles);

fire.start();
applyPhaseUI(PHASES.SLEEPING);

// ---- UI 更新 ----
function applyPhaseUI(phase) {
  els.app.classList.remove('sleeping', 'focusing', 'resting');
  els.app.classList.add(phase);
  els.phaseLabel.textContent = PHASE_TEXT[phase];
  els.hint.textContent = HINT_TEXT[phase];
  if (phase === PHASES.SLEEPING) {
    els.timeDisplay.textContent = '--:--';
    els.btnFire.querySelector('.btn-label').textContent = FIRE_LABEL.off;
  } else {
    els.btnFire.querySelector('.btn-label').textContent = FIRE_LABEL.on;
  }
}

// ---- ボタン ----
els.btnFire.addEventListener('click', async () => {
  if (timer.phase === PHASES.SLEEPING) {
    timer.start();
    // 初回タップで音声コンテキストを起こす（ON時のみ）
    if (soundOn) await ambience.start();
  } else {
    timer.stop();
    fire.setMode(PHASES.SLEEPING);
    ambience.stop();
    els.btnSound.setAttribute('aria-pressed', 'false');
    soundOn = false;
    els.btnSound.querySelector('.btn-label').textContent = SOUND_LABEL.off;
  }
});

els.btnSound.addEventListener('click', async () => {
  soundOn = !soundOn;
  els.btnSound.setAttribute('aria-pressed', String(soundOn));
  els.btnSound.querySelector('.btn-label').textContent = soundOn ? SOUND_LABEL.on : SOUND_LABEL.off;
  if (soundOn) {
    await ambience.start();
    ambience.setIntensity(timer.phase === PHASES.RESTING ? 1.2 : 1.0);
  } else {
    ambience.stop();
  }
});

// ---- ページ非表示時は音を止める（バッテリー配慮） ----
document.addEventListener('visibilitychange', () => {
  if (document.hidden && soundOn) {
    ambience.stop();
  } else if (!document.hidden && soundOn) {
    ambience.start();
  }
});

// ---- Service Worker 登録 ----
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {
      /* ignore in dev */
    });
  });
}
