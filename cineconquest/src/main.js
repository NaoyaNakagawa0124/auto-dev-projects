// CineConquest - Main entry point
import { initGlobe, updateMarkers, addConquestBurst } from './globe.js';
import { subscribe, getStats, getConquestLevel } from './store.js';
import { renderMovieForm, renderMovieLog, renderRankings, renderChallenges, renderStats, setOnMovieAdded } from './ui.js';
import { checkAchievements } from './achievements.js';
import { getCountryByCode } from './data/countries.js';

// DOM elements
const globeContainer = document.getElementById('globe-container');
const sidePanel = document.getElementById('side-panel');
const panelTitle = document.getElementById('panel-title');
const panelContent = document.getElementById('panel-content');
const panelClose = document.getElementById('panel-close');
const addMovieBtn = document.getElementById('add-movie-btn');
const navBtns = document.querySelectorAll('.nav-btn');
const tooltip = document.getElementById('country-tooltip');
const tooltipName = document.getElementById('tooltip-name');
const tooltipFilms = document.getElementById('tooltip-films');
const tooltipLevel = document.getElementById('tooltip-level');
const achievementToast = document.getElementById('achievement-toast');
const achievementIcon = document.getElementById('achievement-icon');
const achievementText = document.getElementById('achievement-text');
const statCountries = document.getElementById('stat-countries');
const statFilms = document.getElementById('stat-films');
const statScore = document.getElementById('stat-score');
const statStreak = document.getElementById('stat-streak');

let currentView = 'globe';
let globeApi = null;

// Initialize globe
function handleCountryHover(country, x, y) {
  if (!country) {
    tooltip.classList.add('hidden');
    return;
  }

  const level = getConquestLevel(country.code);
  const stats = getStats();
  const filmCount = stats.countryFilmCounts[country.code] || 0;
  const levelNames = ['未征服', 'Lv.1 発見', 'Lv.2 探索', 'Lv.3 親交', 'Lv.4 熟知', 'Lv.5 完全征服'];

  tooltipName.textContent = country.name;
  tooltipFilms.textContent = `${filmCount}本の映画を視聴`;
  tooltipLevel.textContent = levelNames[level];
  tooltipLevel.style.color = level >= 4 ? 'var(--gold)' : level >= 2 ? 'var(--accent)' : 'var(--text-muted)';

  tooltip.style.left = `${x + 15}px`;
  tooltip.style.top = `${y - 10}px`;
  tooltip.classList.remove('hidden');
}

function handleCountryClick(country) {
  openPanel('映画を記録', () => renderMovieForm(panelContent, country.code));
}

// Initialize
globeApi = initGlobe(globeContainer, handleCountryHover, handleCountryClick);

// Update stats display
function updateStatsDisplay() {
  const stats = getStats();
  animateNumber(statCountries, stats.totalCountries);
  animateNumber(statFilms, stats.totalFilms);
  animateNumber(statScore, stats.diversityScore);
  animateNumber(statStreak, stats.streak);
}

function animateNumber(el, target) {
  const current = parseInt(el.textContent) || 0;
  if (current === target) return;

  const diff = target - current;
  const steps = Math.min(Math.abs(diff), 20);
  const increment = diff / steps;
  let step = 0;

  function tick() {
    step++;
    if (step >= steps) {
      el.textContent = target;
      return;
    }
    el.textContent = Math.round(current + increment * step);
    requestAnimationFrame(tick);
  }
  tick();
}

// Subscribe to state changes
subscribe(() => {
  updateStatsDisplay();
  updateMarkers();

  // Re-render current panel view if open
  if (!sidePanel.classList.contains('hidden')) {
    const viewRenderers = {
      log: () => renderMovieLog(panelContent),
      ranking: () => renderRankings(panelContent),
      challenge: () => renderChallenges(panelContent),
      stats: () => renderStats(panelContent),
    };
    if (viewRenderers[currentView]) {
      viewRenderers[currentView]();
    }
  }
});

// Movie added callback
setOnMovieAdded((movie, newAchievements) => {
  // Burst effect on globe
  addConquestBurst(movie.country);

  // Show achievement toast
  if (newAchievements.length > 0) {
    showAchievementToast(newAchievements[0]);
    // Queue additional achievements
    newAchievements.slice(1).forEach((a, i) => {
      setTimeout(() => showAchievementToast(a), (i + 1) * 2500);
    });
  }

  // Show success feedback
  showSuccessMessage(movie);
});

function showAchievementToast(achievement) {
  achievementIcon.textContent = achievement.icon;
  achievementText.textContent = `${achievement.name} — ${achievement.desc}`;
  achievementToast.classList.add('show');
  achievementToast.classList.remove('hidden');

  setTimeout(() => {
    achievementToast.classList.remove('show');
    setTimeout(() => achievementToast.classList.add('hidden'), 400);
  }, 2000);
}

function showSuccessMessage(movie) {
  const country = getCountryByCode(movie.country);
  const level = getConquestLevel(movie.country);
  const levelNames = ['', '発見', '探索', '親交', '熟知', '完全征服'];

  // Brief flash on the form
  const form = document.getElementById('movie-form');
  if (form) {
    const msg = document.createElement('div');
    msg.className = 'fade-in';
    msg.style.cssText = 'text-align: center; padding: 12px; margin-bottom: 12px; border-radius: var(--radius-sm); background: var(--bg-glass-light); border: 1px solid var(--success); color: var(--success);';
    msg.innerHTML = `✅ 「${movie.title}」を記録しました！<br><span style="font-size: 0.8rem; color: var(--text-secondary);">${country ? country.name : ''} — Lv.${level} ${levelNames[level]}</span>`;
    form.parentNode.insertBefore(msg, form);
    setTimeout(() => msg.remove(), 3000);
  }
}

// Panel management
function openPanel(title, renderFn) {
  panelTitle.textContent = title;
  renderFn();
  sidePanel.classList.remove('hidden');
}

function closePanel() {
  sidePanel.classList.add('hidden');
}

panelClose.addEventListener('click', closePanel);

addMovieBtn.addEventListener('click', () => {
  currentView = 'globe';
  updateNavActive('globe');
  openPanel('映画を記録', () => renderMovieForm(panelContent));
});

// Navigation
navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const view = btn.dataset.view;
    currentView = view;
    updateNavActive(view);

    const views = {
      globe: () => closePanel(),
      log: () => openPanel('視聴記録', () => renderMovieLog(panelContent)),
      ranking: () => openPanel('ランキング', () => renderRankings(panelContent)),
      challenge: () => openPanel('チャレンジ', () => renderChallenges(panelContent)),
      stats: () => openPanel('統計', () => renderStats(panelContent)),
    };

    if (views[view]) views[view]();
  });
});

function updateNavActive(view) {
  navBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
}

// Initial render
updateStatsDisplay();
updateMarkers();

// Run initial achievement check (for returning users)
checkAchievements();

console.log('🎬 CineConquest initialized');
