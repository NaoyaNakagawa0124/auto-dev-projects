// WasureNote - Main
import { DestroyEngine, MODES, getRandomPrompt, getRandomFarewell } from './destroy.js';

const canvas = document.getElementById('fx-canvas');
const worryInput = document.getElementById('worry-input');
const destroyBtn = document.getElementById('destroy-btn');
const modeSelector = document.getElementById('mode-selector');
const promptEl = document.getElementById('prompt');
const farewellEl = document.getElementById('farewell');
const counterEl = document.getElementById('counter');

let selectedMode = 'burn';
let destroyCount = 0;
let engine;

// Canvas setup
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  engine.clear();
}

engine = new DestroyEngine(canvas);
resize();
window.addEventListener('resize', resize);

// Mode buttons
Object.entries(MODES).forEach(([id, m]) => {
  const btn = document.createElement('button');
  btn.className = `mode-btn ${id === selectedMode ? 'selected' : ''}`;
  btn.textContent = `${m.emoji} ${m.name}`;
  btn.addEventListener('click', () => {
    selectedMode = id;
    modeSelector.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
  modeSelector.appendChild(btn);
});

// Enable/disable destroy button
worryInput.addEventListener('input', () => {
  destroyBtn.disabled = worryInput.value.trim().length === 0;
});

// Destroy!
destroyBtn.addEventListener('click', () => {
  const text = worryInput.value.trim();
  if (!text) return;

  // Hide the card
  document.getElementById('card').style.opacity = '0';
  document.getElementById('card').style.pointerEvents = 'none';

  // Calculate start position (center of screen)
  const cx = canvas.width / 2 - (text.length * 7);
  const cy = canvas.height / 2;

  // Launch destruction
  engine.clear();
  engine.destroy(text, selectedMode, cx, cy);
  engine.onComplete = () => {
    destroyCount++;
    counterEl.textContent = `このセッションで手放したもの: ${destroyCount}`;

    // Show farewell message
    farewellEl.textContent = getRandomFarewell();
    farewellEl.classList.add('show');

    setTimeout(() => {
      farewellEl.classList.remove('show');
      // Restore card
      document.getElementById('card').style.opacity = '1';
      document.getElementById('card').style.pointerEvents = 'auto';
      worryInput.value = '';
      destroyBtn.disabled = true;
      promptEl.textContent = getRandomPrompt();
    }, 2500);
  };
});

// Animation loop
let lastTime = performance.now();
function animate(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  if (engine.isAnimating) {
    engine.update(dt);
    engine.draw();
  }

  requestAnimationFrame(animate);
}
animate(performance.now());

// Initial prompt
promptEl.textContent = getRandomPrompt();
console.log('🗑️ 忘れノート initialized — nothing is saved, by design');
