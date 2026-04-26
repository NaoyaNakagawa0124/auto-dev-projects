/**
 * 空間 (Kuukan) — Main Application
 */

// ===== Starfield =====
(function initStarfield() {
  const c = document.getElementById('starfield');
  const ctx = c.getContext('2d');
  let w, h;
  function resize() { w = c.width = innerWidth; h = c.height = innerHeight; }
  resize();
  addEventListener('resize', resize);

  const layers = [
    { stars: makeStars(80, 0.5, 0.1), color: '100,120,180' },
    { stars: makeStars(50, 1.0, 0.2), color: '140,160,220' },
    { stars: makeStars(20, 1.5, 0.4), color: '200,210,255' },
  ];

  function makeStars(n, maxR, speed) {
    return Array.from({ length: n }, () => ({
      x: Math.random() * 2000,
      y: Math.random() * 2000,
      r: Math.random() * maxR + 0.2,
      speed,
      twinkle: Math.random() * Math.PI * 2,
    }));
  }

  function draw() {
    ctx.fillStyle = 'rgba(5,6,15,0.15)';
    ctx.fillRect(0, 0, w, h);
    for (const layer of layers) {
      for (const s of layer.stars) {
        s.twinkle += 0.01 + Math.random() * 0.01;
        const a = 0.4 + Math.sin(s.twinkle) * 0.3;
        ctx.beginPath();
        ctx.arc(s.x % w, s.y % h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${layer.color},${a})`;
        ctx.fill();
        s.y -= s.speed;
        if (s.y < -5) { s.y = h + 5; s.x = Math.random() * w; }
      }
    }
    requestAnimationFrame(draw);
  }
  // Initial fill
  ctx.fillStyle = '#05060f';
  ctx.fillRect(0, 0, w, h);
  draw();
})();

// ===== State =====
let timerSeconds = 25 * 60;
let timerTotal = 25 * 60;
let timerRunning = false;
let timerInterval = null;
let missionsToday = parseInt(localStorage.getItem('kuukan_missions') || '0');
let focusToday = parseInt(localStorage.getItem('kuukan_focus') || '0');
let logs = JSON.parse(localStorage.getItem('kuukan_logs') || '[]');
const startTime = Date.now();

// Reset daily counters
const lastDay = localStorage.getItem('kuukan_day');
const today = new Date().toDateString();
if (lastDay !== today) {
  missionsToday = 0; focusToday = 0; logs = [];
  localStorage.setItem('kuukan_day', today);
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  updateTimerDisplay();
  updateStats();
  showTransmission();
  renderCrew();
  renderLog();
  initEvents();
  startClock();
});

function initEvents() {
  document.getElementById('btn-start').addEventListener('click', startTimer);
  document.getElementById('btn-pause').addEventListener('click', pauseTimer);
  document.getElementById('btn-reset').addEventListener('click', resetTimer);
  document.getElementById('btn-new-tx').addEventListener('click', showTransmission);
  document.getElementById('btn-clear-log').addEventListener('click', clearLog);

  document.querySelectorAll('.preset').forEach(btn => {
    btn.addEventListener('click', () => {
      if (timerRunning) return;
      document.querySelectorAll('.preset').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mins = parseInt(btn.dataset.minutes);
      timerSeconds = mins * 60;
      timerTotal = mins * 60;
      document.getElementById('timer-label').textContent =
        mins <= 15 ? `休憩ミッション（${mins}分）` : `集中ミッション（${mins}分）`;
      updateTimerDisplay();
    });
  });
}

// ===== Timer =====
function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  document.getElementById('btn-start').classList.add('hidden');
  document.getElementById('btn-pause').classList.remove('hidden');
  document.getElementById('btn-reset').classList.remove('hidden');
  document.getElementById('mission-status').textContent = '稼働中';
  document.getElementById('mission-status').className = 'status-badge active';

  addLog('🚀 ミッション発進');
  updateCrewActivity();

  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay();
    if (timerSeconds <= 0) {
      completeTimer();
    }
  }, 1000);
}

function pauseTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  document.getElementById('btn-pause').classList.add('hidden');
  document.getElementById('btn-start').classList.remove('hidden');
  document.getElementById('btn-start').textContent = '再開';
  document.getElementById('mission-status').textContent = '一時停止';
  document.getElementById('mission-status').className = 'status-badge idle';
  addLog('⏸ 一時停止');
}

function resetTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  timerSeconds = timerTotal;
  updateTimerDisplay();
  document.getElementById('btn-start').classList.remove('hidden');
  document.getElementById('btn-start').textContent = '発進';
  document.getElementById('btn-pause').classList.add('hidden');
  document.getElementById('btn-reset').classList.add('hidden');
  document.getElementById('mission-status').textContent = '待機中';
  document.getElementById('mission-status').className = 'status-badge idle';
  addLog('🔄 ミッション中断・帰還');
}

function completeTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  missionsToday++;
  focusToday += Math.round(timerTotal / 60);
  localStorage.setItem('kuukan_missions', missionsToday);
  localStorage.setItem('kuukan_focus', focusToday);

  const msg = MISSION_COMPLETE_MSGS[Math.floor(Math.random() * MISSION_COMPLETE_MSGS.length)];
  addLog(`✅ ${msg}`);

  document.getElementById('mission-status').textContent = '完了';
  document.getElementById('mission-status').className = 'status-badge done';

  // Reset for next mission
  setTimeout(() => {
    timerSeconds = timerTotal;
    updateTimerDisplay();
    document.getElementById('btn-start').classList.remove('hidden');
    document.getElementById('btn-start').textContent = '発進';
    document.getElementById('btn-pause').classList.add('hidden');
    document.getElementById('btn-reset').classList.add('hidden');
    document.getElementById('mission-status').textContent = '待機中';
    document.getElementById('mission-status').className = 'status-badge idle';
  }, 3000);

  updateStats();
  updateCrewActivity();
}

function updateTimerDisplay() {
  const m = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
  const s = (timerSeconds % 60).toString().padStart(2, '0');
  document.getElementById('timer-display').textContent = `${m}:${s}`;
}

function updateStats() {
  document.getElementById('missions-today').textContent = missionsToday;
  document.getElementById('focus-today').textContent = focusToday;
}

// ===== Transmission =====
function showTransmission() {
  const tx = TRANSMISSIONS[Math.floor(Math.random() * TRANSMISSIONS.length)];
  const msgEl = document.getElementById('tx-message');
  const advEl = document.getElementById('tx-advice');

  // Typing effect
  msgEl.textContent = '';
  advEl.textContent = '';
  let i = 0;
  const typeMsg = () => {
    if (i < tx.msg.length) {
      msgEl.textContent += tx.msg[i];
      i++;
      setTimeout(typeMsg, 30);
    } else {
      advEl.textContent = `💡 ${tx.advice}`;
    }
  };
  typeMsg();
}

// ===== Crew =====
function renderCrew() {
  // Pick 3-4 random crew members
  const count = 3 + Math.floor(Math.random() * 2);
  const shuffled = [...CREW_MEMBERS].sort(() => Math.random() - 0.5);
  const active = shuffled.slice(0, count);

  document.getElementById('crew-count').textContent = count;

  const list = document.getElementById('crew-list');
  list.innerHTML = active.map((c, i) => {
    const status = CREW_STATUSES[i % CREW_STATUSES.length];
    const task = CREW_TASKS[Math.floor(Math.random() * CREW_TASKS.length)];
    return `
      <div class="crew-member">
        <span class="crew-avatar">${c.avatar}</span>
        <div class="crew-info">
          <div class="crew-name">${c.name} <span style="color:var(--text-muted);font-size:11px">${c.role}</span></div>
          <div class="crew-task">${task}</div>
        </div>
        <span class="crew-status-dot ${status}"></span>
      </div>
    `;
  }).join('');
}

function updateCrewActivity() {
  // Randomly update crew tasks
  const tasks = document.querySelectorAll('.crew-task');
  tasks.forEach(el => {
    if (Math.random() > 0.5) {
      el.textContent = CREW_TASKS[Math.floor(Math.random() * CREW_TASKS.length)];
    }
  });
}

// ===== Mission Log =====
function addLog(text) {
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
  logs.push({ time, text });
  localStorage.setItem('kuukan_logs', JSON.stringify(logs));
  renderLog();
}

function renderLog() {
  const container = document.getElementById('mission-log');
  const empty = document.getElementById('log-empty');

  if (logs.length === 0) {
    container.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  container.innerHTML = logs.slice().reverse().map(l =>
    `<div class="log-entry"><span class="log-time">${l.time}</span><span class="log-text">${l.text}</span></div>`
  ).join('');
}

function clearLog() {
  logs = [];
  localStorage.removeItem('kuukan_logs');
  renderLog();
}

// ===== Clock & Uptime =====
function startClock() {
  function update() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const s = now.getSeconds().toString().padStart(2, '0');
    document.getElementById('station-time').textContent = `${h}:${m}:${s}`;

    const upSec = Math.floor((Date.now() - startTime) / 1000);
    const upM = Math.floor(upSec / 60);
    const upS = upSec % 60;
    document.getElementById('uptime').textContent = `稼働時間: ${upM}m ${upS}s`;
  }
  update();
  setInterval(update, 1000);
}
