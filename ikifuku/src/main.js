// IkiFuku - Main entry point
import { BreathingEngine, PATTERNS, PHASE_LABELS, SESSION_DURATION } from './breathing.js';
import { BreathArt } from './art.js';

const canvas = document.getElementById('art-canvas');
const titleCard = document.getElementById('title-card');
const sessionHud = document.getElementById('session-hud');
const completeCard = document.getElementById('complete-card');
const patternSelector = document.getElementById('pattern-selector');
const startBtn = document.getElementById('start-btn');
const phaseLabel = document.getElementById('phase-label');
const timerText = document.getElementById('timer-text');
const progressFill = document.getElementById('progress-fill');
const phaseFill = document.getElementById('phase-fill');
const pauseBtn = document.getElementById('pause-btn');
const statsRow = document.getElementById('stats-row');
const againBtn = document.getElementById('again-btn');
const shareBtn = document.getElementById('share-btn');

let engine = new BreathingEngine();
let art = new BreathArt(canvas);
let selectedPattern = 'relax';
let animationId = null;
let lastTime = 0;

// ===== Setup =====
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  art.resize(canvas.width, canvas.height);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Build pattern buttons
Object.entries(PATTERNS).forEach(([id, p]) => {
  const btn = document.createElement('button');
  btn.className = `pattern-btn ${id === selectedPattern ? 'selected' : ''}`;
  btn.textContent = `${p.name} — ${p.inhale}秒・${p.hold}秒・${p.exhale}秒`;
  btn.addEventListener('click', () => {
    selectedPattern = id;
    patternSelector.querySelectorAll('.pattern-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
  patternSelector.appendChild(btn);
});

// ===== State management =====
function showTitle() {
  titleCard.style.display = 'block';
  sessionHud.classList.remove('active');
  completeCard.classList.remove('show');
  art.clear();
  cancelAnimationFrame(animationId);
  animateBackground();
}

function startSession() {
  titleCard.style.display = 'none';
  sessionHud.classList.add('active');
  completeCard.classList.remove('show');

  engine.reset(selectedPattern);
  art.clear();
  engine.start();
  lastTime = performance.now();
  cancelAnimationFrame(animationId);
  gameLoop(lastTime);
}

function showComplete() {
  sessionHud.classList.remove('active');
  completeCard.classList.add('show');

  const minutes = Math.floor(SESSION_DURATION / 60);
  statsRow.innerHTML = `
    <div class="stat"><div class="stat-num">${engine.cycleCount}</div><div class="stat-lbl">呼吸サイクル</div></div>
    <div class="stat"><div class="stat-num">${minutes}</div><div class="stat-lbl">分間</div></div>
    <div class="stat"><div class="stat-num">${engine.pattern.name.split(' ')[0]}</div><div class="stat-lbl">パターン</div></div>
  `;
}

// ===== Game loop =====
function gameLoop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
  lastTime = timestamp;

  const event = engine.tick(dt);

  // Phase change → advance color
  if (event?.event === 'phaseChange') {
    art.advanceColor();
  }

  // Session complete
  if (event?.event === 'complete' || engine.isComplete) {
    showComplete();
    return;
  }

  // Update art
  art.update(dt, engine.breathValue, engine.phase);
  art.draw(engine.breathValue);

  // Update HUD
  phaseLabel.textContent = engine.phaseLabel;
  phaseLabel.className = `phase-label phase-${engine.phase}`;

  const remaining = engine.timeRemaining;
  const mins = Math.floor(remaining / 60);
  const secs = Math.floor(remaining % 60);
  timerText.textContent = `残り ${mins}:${String(secs).padStart(2, '0')}`;

  progressFill.style.width = `${engine.sessionProgress * 100}%`;

  const phaseColors = { inhale: '#69f0ae', hold: '#ffd54f', exhale: '#b388ff' };
  phaseFill.style.width = `${engine.phaseProgress * 100}%`;
  phaseFill.style.background = phaseColors[engine.phase] || '#b388ff';

  animationId = requestAnimationFrame(gameLoop);
}

// Ambient background animation (title screen)
function animateBackground() {
  art.update(0.016, 0.5 + Math.sin(Date.now() * 0.001) * 0.3, 'hold');
  art.draw(0.5);
  animationId = requestAnimationFrame(animateBackground);
}

// ===== Events =====
startBtn.addEventListener('click', startSession);

pauseBtn.addEventListener('click', () => {
  if (engine.isRunning) {
    engine.pause();
    pauseBtn.textContent = '▶ 再開';
  } else {
    engine.start();
    pauseBtn.textContent = '⏸ 一時停止';
    lastTime = performance.now();
    gameLoop(lastTime);
  }
});

againBtn.addEventListener('click', showTitle);

shareBtn.addEventListener('click', () => {
  // Save canvas as image
  canvas.toBlob(blob => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ikifuku-${Date.now()}.png`;
    a.click();
    URL.revokeObjectURL(url);
  });
});

// ===== Init =====
showTitle();
console.log('🌬️ 息吹 initialized');
