/**
 * YarnPal — Main App
 */
(function () {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  // Navigation
  document.querySelectorAll('nav button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('screen-' + btn.dataset.screen).classList.add('active');
    });
  });

  // ── Counter ──
  let counter = loadCounter();
  const rowEl = document.getElementById('row-count');
  const stitchEl = document.getElementById('stitch-count');

  function updateCounterUI() {
    rowEl.textContent = counter.rows;
    stitchEl.textContent = counter.stitches;
    const pct = getProgress(counter);
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('progress-label').textContent =
      counter.targetRows > 0
        ? `${counter.rows} / ${counter.targetRows} rows (${pct}%)`
        : 'Tap + to count rows';
    saveCounter(counter);
  }

  document.getElementById('row-plus').addEventListener('click', () => { incrementRows(counter); updateCounterUI(); });
  document.getElementById('row-minus').addEventListener('click', () => { decrementRows(counter); updateCounterUI(); });
  document.getElementById('stitch-plus').addEventListener('click', () => { incrementStitches(counter); updateCounterUI(); });
  document.getElementById('stitch-minus').addEventListener('click', () => { decrementStitches(counter); updateCounterUI(); });
  document.getElementById('btn-undo').addEventListener('click', () => { undoLast(counter); updateCounterUI(); });
  document.getElementById('btn-reset').addEventListener('click', () => {
    if (confirm('Reset counter to zero?')) { counter = resetCounter(counter); updateCounterUI(); }
  });

  updateCounterUI();

  // ── Projects ──
  function renderProjects() {
    const list = document.getElementById('project-list');
    const projects = loadProjects();
    if (projects.length === 0) {
      list.innerHTML = '<p style="text-align:center;color:#999;font-size:18px;padding:40px;">No projects yet.<br>Tap below to add one!</p>';
      return;
    }
    list.innerHTML = projects.map(p => `
      <div class="project-card">
        <div class="project-color" style="background:${p.yarnColor}"></div>
        <div class="project-info">
          <div class="project-name">${p.name}</div>
          <div class="project-meta">${p.needleSize} needles${p.notes ? ' &bull; ' + p.notes.slice(0, 30) : ''}</div>
        </div>
        <span class="project-status ${p.status}">${p.status}</span>
      </div>
    `).join('');
  }

  // Form
  const formOverlay = document.getElementById('project-form');
  const colorSelect = document.getElementById('form-color');
  const needleSelect = document.getElementById('form-needle');

  YARN_COLORS.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.hex;
    opt.textContent = c.name;
    opt.style.color = c.hex;
    colorSelect.appendChild(opt);
  });
  NEEDLE_SIZES.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s; opt.textContent = s;
    needleSelect.appendChild(opt);
  });

  document.getElementById('btn-add-project').addEventListener('click', () => {
    formOverlay.classList.add('open');
  });
  document.getElementById('form-cancel').addEventListener('click', () => {
    formOverlay.classList.remove('open');
  });
  document.getElementById('form-save').addEventListener('click', () => {
    const name = document.getElementById('form-name').value.trim();
    if (!name) return;
    const project = createProject(
      name,
      colorSelect.value,
      needleSelect.value,
      document.getElementById('form-notes').value.trim()
    );
    addProject(project);
    formOverlay.classList.remove('open');
    document.getElementById('form-name').value = '';
    document.getElementById('form-notes').value = '';
    renderProjects();
  });

  renderProjects();

  // ── Timer ──
  let timer = createTimer();
  const timerBtn = document.getElementById('btn-timer');
  const timerDisplay = document.getElementById('timer-display');
  const timerSessions = document.getElementById('timer-sessions');
  let timerInterval = null;

  function updateTimerUI() {
    const elapsed = getElapsed(timer);
    timerDisplay.textContent = formatTime(elapsed);
    const count = getSessionCount(timer);
    timerSessions.textContent = count > 0
      ? `${count} session${count > 1 ? 's' : ''} \u2022 ${formatTime(getTotalSessionTime(timer))} total`
      : 'Tap to start knitting';
    timerBtn.textContent = timer.running ? 'Stop' : 'Start';
    timerBtn.className = timer.running ? 'btn-timer btn-stop' : 'btn-timer btn-start';
  }

  timerBtn.addEventListener('click', () => {
    if (timer.running) {
      stopTimer(timer);
      clearInterval(timerInterval);
    } else {
      startTimer(timer);
      timerInterval = setInterval(updateTimerUI, 1000);
    }
    updateTimerUI();
  });

  document.getElementById('btn-timer-reset').addEventListener('click', () => {
    if (confirm('Reset timer?')) {
      timer = resetTimer(timer);
      clearInterval(timerInterval);
      updateTimerUI();
    }
  });

  updateTimerUI();
})();
