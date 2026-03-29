// RunwayRise - Main app controller

(function() {
  let state = null;
  let selectedType = null;
  let selectedDuration = null;

  // Storage abstraction (works both in Chrome extension and standalone)
  const storage = {
    get: function(key, callback) {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get([key], function(result) { callback(result[key]); });
      } else {
        try {
          const val = localStorage.getItem(key);
          callback(val ? JSON.parse(val) : undefined);
        } catch(e) { callback(undefined); }
      }
    },
    set: function(key, value) {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        const obj = {}; obj[key] = value;
        chrome.storage.local.set(obj);
      } else {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch(e) {}
      }
    }
  };

  function init() {
    storage.get('runwayrise_state', function(saved) {
      state = saved || createDefaultState();
      setupTabs();
      setupWorkoutForm();
      renderAll();
    });
  }

  function save() {
    storage.set('runwayrise_state', state);
  }

  // --- Tab Navigation ---
  function setupTabs() {
    document.querySelectorAll('.tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
        document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
        tab.classList.add('active');
        var targetId = 'tab-' + tab.getAttribute('data-tab');
        document.getElementById(targetId).classList.add('active');
      });
    });
  }

  // --- Workout Form ---
  function setupWorkoutForm() {
    // Render workout types
    var grid = document.getElementById('workout-types');
    WORKOUT_TYPES.forEach(function(type) {
      var btn = document.createElement('button');
      btn.className = 'type-btn';
      btn.setAttribute('data-type', type.id);
      btn.innerHTML = '<span class="type-icon">' + type.icon + '</span><span class="type-name">' + type.name + '</span>';
      btn.addEventListener('click', function() {
        document.querySelectorAll('.type-btn').forEach(function(b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        selectedType = type.id;
        checkFormReady();
      });
      grid.appendChild(btn);
    });

    // Duration buttons
    document.querySelectorAll('.dur-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.dur-btn').forEach(function(b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        selectedDuration = parseInt(btn.getAttribute('data-dur'));
        document.getElementById('custom-duration').value = '';
        checkFormReady();
      });
    });

    // Custom duration
    document.getElementById('custom-duration').addEventListener('input', function() {
      document.querySelectorAll('.dur-btn').forEach(function(b) { b.classList.remove('selected'); });
      selectedDuration = parseInt(this.value) || 0;
      checkFormReady();
    });

    // Log button
    document.getElementById('log-workout').addEventListener('click', handleLogWorkout);

    // Story next line
    document.getElementById('next-line').addEventListener('click', handleNextLine);
  }

  function checkFormReady() {
    var btn = document.getElementById('log-workout');
    btn.disabled = !(selectedType && selectedDuration > 0);
  }

  function handleLogWorkout() {
    if (!selectedType || !selectedDuration || selectedDuration <= 0) return;

    var result = logWorkout(state, selectedType, selectedDuration);
    state = result.state;
    save();

    // Show result
    var type = WORKOUT_TYPES.find(function(t) { return t.id === selectedType; });
    document.getElementById('xp-gained').textContent = '+' + result.xpGained + ' XP';
    document.getElementById('workout-flavor').textContent = type ? type.flavor : '';
    document.getElementById('workout-result').classList.remove('hidden');

    // New achievements
    var achDiv = document.getElementById('new-achievements');
    achDiv.innerHTML = '';
    result.newAchievements.forEach(function(ach) {
      var alert = document.createElement('div');
      alert.className = 'achievement-alert';
      alert.textContent = ach.icon + ' Achievement Unlocked: ' + ach.name;
      achDiv.appendChild(alert);
    });

    // New chapter
    var chapterAlert = document.getElementById('new-chapter-alert');
    if (result.newChapter) {
      var ch = CHAPTERS[state.chapter];
      chapterAlert.textContent = '🎉 NEW CHAPTER: ' + ch.title + ' — ' + ch.role;
      chapterAlert.classList.remove('hidden');
      state.storyProgress = 0; // Reset story progress for new chapter
      save();
    } else {
      chapterAlert.classList.add('hidden');
    }

    // Reset form
    selectedType = null;
    selectedDuration = null;
    document.querySelectorAll('.type-btn').forEach(function(b) { b.classList.remove('selected'); });
    document.querySelectorAll('.dur-btn').forEach(function(b) { b.classList.remove('selected'); });
    document.getElementById('custom-duration').value = '';
    document.getElementById('log-workout').disabled = true;

    renderAll();
  }

  function handleNextLine() {
    var chapter = CHAPTERS[state.chapter];
    if (state.storyProgress < chapter.narrative.length - 1) {
      state.storyProgress++;
      save();
      renderStory();
    }
  }

  // --- Rendering ---
  function renderAll() {
    renderHeader();
    renderStory();
    renderWorkoutHistory();
    renderWardrobe();
    renderStats();
    renderAchievements();
  }

  function renderHeader() {
    document.getElementById('level-num').textContent = state.level;
    var chapter = CHAPTERS[state.chapter];
    var badge = document.getElementById('chapter-badge');
    badge.textContent = 'Chapter ' + (state.chapter + 1);
    badge.style.background = chapter.color;
  }

  function renderStory() {
    var chapter = CHAPTERS[state.chapter];
    document.getElementById('chapter-role').textContent = chapter.role;
    document.getElementById('outfit-emoji').textContent = chapter.outfitEmoji;

    var lineIdx = Math.min(state.storyProgress, chapter.narrative.length - 1);
    document.getElementById('narrative-text').textContent = chapter.narrative[lineIdx];

    var nextBtn = document.getElementById('next-line');
    nextBtn.style.display = (state.storyProgress < chapter.narrative.length - 1) ? 'inline-block' : 'none';

    // Chapter progress
    var progress = getProgressToNextChapter(state);
    document.getElementById('chapter-percent').textContent = progress.percent + '%';
    document.getElementById('chapter-fill').style.width = progress.percent + '%';
    if (progress.nextTitle) {
      document.getElementById('chapter-remaining').textContent = progress.remaining + ' XP to ' + progress.nextTitle;
    } else {
      document.getElementById('chapter-remaining').textContent = 'You have reached the pinnacle of fashion!';
    }

    // Streak
    var streak = getStreakStatus(state);
    var streakEl = document.getElementById('streak-status');
    streakEl.textContent = streak.message;
    streakEl.className = streak.status;
  }

  function renderWorkoutHistory() {
    var list = document.getElementById('workout-list');
    list.innerHTML = '';
    var recent = state.workoutHistory.slice(-5).reverse();
    recent.forEach(function(w) {
      var type = WORKOUT_TYPES.find(function(t) { return t.id === w.type; });
      var entry = document.createElement('div');
      entry.className = 'workout-entry';
      entry.innerHTML =
        '<span class="we-type">' + (type ? type.icon + ' ' + type.name : w.type) + '</span>' +
        '<span class="we-details">' + w.duration + 'min</span>' +
        '<span class="we-xp">+' + w.xp + ' XP</span>';
      list.appendChild(entry);
    });
    if (recent.length === 0) {
      list.innerHTML = '<div class="workout-entry"><span class="we-type">No workouts yet</span></div>';
    }
  }

  function renderWardrobe() {
    var grid = document.getElementById('wardrobe-grid');
    grid.innerHTML = '';
    CHAPTERS.forEach(function(ch, i) {
      var item = document.createElement('div');
      item.className = 'wardrobe-item';
      if (i > state.chapter) item.classList.add('locked');
      if (i === state.chapter) item.classList.add('current');
      item.innerHTML = '<span>' + ch.outfitEmoji + '</span><span class="wi-label">' + ch.title + '</span>';
      grid.appendChild(item);
    });

    // Current outfit detail
    var pieces = document.getElementById('outfit-pieces');
    pieces.innerHTML = '';
    var outfit = CHAPTERS[state.chapter].outfit;
    var slots = ['top', 'bottom', 'shoes', 'accessory'];
    slots.forEach(function(slot) {
      var piece = document.createElement('div');
      piece.className = 'outfit-piece';
      piece.innerHTML =
        '<div class="op-slot">' + slot + '</div>' +
        '<div class="op-name">' + outfit[slot] + '</div>';
      pieces.appendChild(piece);
    });
  }

  function renderStats() {
    document.getElementById('stat-xp').textContent = state.xp.toLocaleString();
    document.getElementById('stat-workouts').textContent = state.totalWorkouts;
    document.getElementById('stat-streak').textContent = state.currentStreak;
    document.getElementById('stat-best-streak').textContent = state.bestStreak;
    document.getElementById('stat-minutes').textContent = state.totalMinutes;
    document.getElementById('stat-types').textContent = state.workoutTypesUsed.length;
  }

  function renderAchievements() {
    var grid = document.getElementById('achievements-grid');
    grid.innerHTML = '';
    ACHIEVEMENTS.forEach(function(ach) {
      var item = document.createElement('div');
      item.className = 'achievement-item';
      if (!state.unlockedAchievements.includes(ach.id)) item.classList.add('locked');
      else item.classList.add('unlocked');
      item.title = ach.description;
      item.innerHTML = '<span>' + ach.icon + '</span><span class="ai-name">' + ach.name + '</span>';
      grid.appendChild(item);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
