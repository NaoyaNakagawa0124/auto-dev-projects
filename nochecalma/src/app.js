// NocheCalma - UI Controller
(function() {
  let state = null;
  let breathTimer = null;

  const storage = {
    get(key, cb) {
      try { const v = localStorage.getItem(key); cb(v ? JSON.parse(v) : undefined); }
      catch(e) { cb(undefined); }
    },
    set(key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
    }
  };

  function init() {
    storage.get('nochecalma_state', function(saved) {
      state = saved || createDefaultState();

      const hour = new Date().getHours();
      if (isSanctuaryOpen(hour)) {
        document.getElementById('gate').classList.add('hidden');
        document.getElementById('sanctuary').classList.remove('hidden');
        state = startNight(state);
        save();
        setupNav();
        setupRituals();
        setupBreathing();
        setupJournal();
        renderAll();
        startTimeCheck();
      } else {
        document.getElementById('gate').classList.remove('hidden');
        document.getElementById('sanctuary').classList.add('hidden');
        const remaining = getTimeUntilOpen(hour);
        document.getElementById('gate-countdown').textContent =
          remaining > 0 ? '~' + remaining + ' hours until the sanctuary opens.' : '';
        startTimeCheck();
      }
    });
  }

  function save() { storage.set('nochecalma_state', state); }

  function startTimeCheck() {
    setInterval(function() {
      const hour = new Date().getHours();
      const isOpen = isSanctuaryOpen(hour);
      const gateHidden = document.getElementById('gate').classList.contains('hidden');
      if (isOpen && !gateHidden) location.reload();
      if (!isOpen && gateHidden) location.reload();
    }, 60000);
  }

  function setupNav() {
    document.querySelectorAll('.nav-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('view-' + btn.dataset.view).classList.add('active');
      });
    });
  }

  function setupRituals() {
    const list = document.getElementById('ritual-list');
    RITUALS.forEach(function(ritual) {
      const card = document.createElement('div');
      card.className = 'ritual-card';
      card.dataset.id = ritual.id;
      card.innerHTML =
        '<span class="ritual-icon">' + ritual.icon + '</span>' +
        '<div class="ritual-info">' +
          '<div class="ritual-name">' + ritual.name + '</div>' +
          '<div class="ritual-desc">' + ritual.description + '</div>' +
          '<div class="ritual-meta">~' + ritual.duration + ' min · +' + ritual.xp + ' energy</div>' +
        '</div>';
      card.addEventListener('click', function() {
        if (state.completedRituals.includes(ritual.id)) return;
        if (ritual.id === 'breathe') {
          document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
          document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
          document.querySelector('[data-view="breathe"]').classList.add('active');
          document.getElementById('view-breathe').classList.add('active');
          return;
        }
        if (ritual.id === 'gratitude' || ritual.id === 'release' || ritual.id === 'intention') {
          document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
          document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
          document.querySelector('[data-view="journal"]').classList.add('active');
          document.getElementById('view-journal').classList.add('active');
          return;
        }
        // Soundscape - just complete it
        const result = completeRitual(state, ritual.id);
        state = result.state;
        save();
        renderAll();
      });
      list.appendChild(card);
    });
  }

  function setupBreathing() {
    const list = document.getElementById('breath-list');
    BREATHING_PATTERNS.forEach(function(pattern, idx) {
      const card = document.createElement('div');
      card.className = 'breath-card';
      const dur = getBreathingDuration(pattern);
      card.innerHTML = '<h3>' + pattern.name + '</h3><p>' + pattern.description + ' (' + dur + 's)</p>';
      card.addEventListener('click', function() { startBreathing(pattern); });
      list.appendChild(card);
    });
    document.getElementById('breath-stop').addEventListener('click', stopBreathing);
  }

  function startBreathing(pattern) {
    document.getElementById('breath-select').classList.add('hidden');
    document.getElementById('breath-active').classList.remove('hidden');

    let cycle = 0;
    let stepIdx = 0;
    let secondsLeft = pattern.steps[0].seconds;

    function tick() {
      const step = pattern.steps[stepIdx];
      const circle = document.getElementById('breath-circle');
      document.getElementById('breath-instruction').textContent = step.action;
      document.getElementById('breath-counter').textContent =
        'Cycle ' + (cycle + 1) + '/' + pattern.cycles + ' · ' + secondsLeft + 's';

      circle.className = 'breath-circle';
      if (step.action === 'Inhale') circle.classList.add('expand');
      else if (step.action === 'Hold') circle.classList.add('hold');

      secondsLeft--;
      if (secondsLeft < 0) {
        stepIdx++;
        if (stepIdx >= pattern.steps.length) {
          stepIdx = 0;
          cycle++;
          if (cycle >= pattern.cycles) {
            stopBreathing();
            const result = completeRitual(state, 'breathe');
            state = result.state;
            save();
            renderAll();
            return;
          }
        }
        secondsLeft = pattern.steps[stepIdx].seconds;
      }

      breathTimer = setTimeout(tick, 1000);
    }

    tick();
  }

  function stopBreathing() {
    if (breathTimer) clearTimeout(breathTimer);
    breathTimer = null;
    document.getElementById('breath-select').classList.remove('hidden');
    document.getElementById('breath-active').classList.add('hidden');
    document.getElementById('breath-circle').className = 'breath-circle';
  }

  function setupJournal() {
    document.getElementById('journal-gratitude').addEventListener('click', function() {
      const text = document.getElementById('journal-input').value;
      if (!text.trim()) return;
      state = addJournalEntry(state, 'gratitude', text);
      const result = completeRitual(state, 'gratitude');
      state = result.state;
      save();
      document.getElementById('journal-input').value = '';
      renderAll();
    });

    document.getElementById('journal-release').addEventListener('click', function() {
      const text = document.getElementById('journal-input').value;
      if (!text.trim()) return;
      state = addJournalEntry(state, 'release', text);
      const result = completeRitual(state, 'release');
      state = result.state;
      save();
      document.getElementById('journal-input').value = '';
      renderAll();
    });
  }

  function renderAll() {
    renderEnergy();
    renderRituals();
    renderJournal();
    renderStats();
    renderFooter();
  }

  function renderEnergy() {
    const info = getEnergyLevel(state.energy);
    document.getElementById('energy-icon').textContent = info.icon;
    document.getElementById('energy-bar').style.width = state.energy + '%';
    document.getElementById('energy-text').textContent = state.energy + '%';
  }

  function renderRituals() {
    document.querySelectorAll('.ritual-card').forEach(function(card) {
      if (state.completedRituals.includes(card.dataset.id)) {
        card.classList.add('done');
      } else {
        card.classList.remove('done');
      }
    });
  }

  function renderJournal() {
    const prompt = getGratitudePrompt();
    document.getElementById('journal-prompt-text').textContent = prompt;

    const list = document.getElementById('entries-list');
    list.innerHTML = '';
    const tonight = state.journalEntries.filter(e => e.night === state.currentNight);
    tonight.forEach(function(entry) {
      const div = document.createElement('div');
      div.className = 'entry';
      div.innerHTML = '<div class="entry-type">' +
        (entry.type === 'gratitude' ? '🙏 Gratitude' : '🍃 Release') +
        '</div>' + entry.text;
      list.appendChild(div);
    });
  }

  function renderStats() {
    document.getElementById('stat-nights').textContent = state.totalNights;
    document.getElementById('stat-streak').textContent = state.streakNights;
    document.getElementById('stat-rituals').textContent = state.totalRituals;
    document.getElementById('stat-entries').textContent = state.journalEntries.length;

    const milestone = getNightsUntilNextMilestone(state.totalNights);
    document.getElementById('milestone-info').textContent =
      milestone.remaining + ' night' + (milestone.remaining !== 1 ? 's' : '') +
      ' until milestone: ' + milestone.target + ' nights';

    document.getElementById('closing-message').textContent = getClosingMessage(state.energy);
  }

  function renderFooter() {
    const remaining = getTimeUntilClose(new Date().getHours());
    document.getElementById('time-remaining').textContent =
      remaining > 0 ? remaining + 'h remaining tonight' : 'Closing soon';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
