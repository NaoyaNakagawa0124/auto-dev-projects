// NijiLog - Main entry point
import { initFlow, refreshFlow } from './flow.js';
import { subscribe, getState, getStats, todayStr, getEntryByDate } from './store.js';
import { renderEntryForm, renderCalendar, renderEntryList, renderStats, setOnEntryAdded } from './ui.js';
import { getMoodById } from './data/moods.js';

// DOM
const panel = document.getElementById('panel');
const panelTitle = document.getElementById('panel-title');
const panelBody = document.getElementById('panel-body');
const panelClose = document.getElementById('panel-close');
const entryBtn = document.getElementById('entry-btn');
const navBtns = document.querySelectorAll('.nav-btn');
const streakBadge = document.getElementById('streak-badge');
const streakCount = document.getElementById('streak-count');
const toast = document.getElementById('toast');
const toastIcon = document.getElementById('toast-icon');
const toastText = document.getElementById('toast-text');

let currentView = 'flow';
let calendarMonth = todayStr().slice(0, 7); // YYYY-MM

// Initialize flow visualization
initFlow();

// ===== Panel management =====
function openPanel(title, renderFn) {
  panelTitle.textContent = title;
  renderFn();
  panel.classList.remove('hidden');
}

function closePanel() {
  panel.classList.add('hidden');
}

panelClose.addEventListener('click', closePanel);

// ===== Entry button =====
entryBtn.addEventListener('click', () => {
  currentView = 'flow';
  updateNavActive('flow');
  openPanel('今日の気持ち', () => renderEntryForm(panelBody));
});

// ===== Navigation =====
navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const view = btn.dataset.view;
    currentView = view;
    updateNavActive(view);

    const views = {
      flow: () => closePanel(),
      calendar: () => openPanel('カレンダー', renderCalendarView),
      list: () => openPanel('記録一覧', () => renderEntryList(panelBody)),
      stats: () => openPanel('統計', () => renderStats(panelBody)),
    };

    if (views[view]) views[view]();
  });
});

function updateNavActive(view) {
  navBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.view === view));
}

function renderCalendarView() {
  renderCalendar(panelBody, calendarMonth,
    (date) => {
      // Day clicked → open entry form for that date
      openPanel(formatShortDate(date), () => renderEntryForm(panelBody, date));
    },
    (newMonth) => {
      calendarMonth = newMonth;
      renderCalendarView();
    }
  );
}

// ===== Entry added callback =====
setOnEntryAdded((entry) => {
  refreshFlow();
  updateStreakBadge();

  if (entry) {
    const mood = getMoodById(entry.mood);
    showToast(mood ? mood.emoji : '✦', `${mood ? mood.name : ''}の気持ちを記録しました`);

    // Check streak milestones
    const stats = getStats();
    if (stats.streak === 3) setTimeout(() => showToast('🔥', '3日連続！流れができてきた！'), 2000);
    if (stats.streak === 7) setTimeout(() => showToast('🌈', '一週間連続！虹が伸びています！'), 2000);
    if (stats.streak === 14) setTimeout(() => showToast('✨', '2週間連続！素晴らしい！'), 2000);
    if (stats.streak === 30) setTimeout(() => showToast('👑', '30日連続！あなたは虹の王者！'), 2000);
  } else {
    showToast('🗑️', '記録を削除しました');
  }

  // Re-render current view
  refreshCurrentView();
});

// ===== State subscription =====
subscribe(() => {
  updateStreakBadge();
  refreshFlow();
});

// ===== Streak badge =====
function updateStreakBadge() {
  const stats = getStats();
  if (stats.streak > 0) {
    streakBadge.classList.remove('hidden');
    streakCount.textContent = stats.streak;
  } else {
    streakBadge.classList.add('hidden');
  }
}

// ===== Toast =====
function showToast(icon, text) {
  toastIcon.textContent = icon;
  toastText.textContent = text;
  toast.classList.remove('hidden');
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 350);
  }, 1800);
}

// ===== Helpers =====
function refreshCurrentView() {
  if (panel.classList.contains('hidden')) return;

  const refreshers = {
    calendar: renderCalendarView,
    list: () => renderEntryList(panelBody),
    stats: () => renderStats(panelBody),
  };

  if (refreshers[currentView]) refreshers[currentView]();
}

function formatShortDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}月${d.getDate()}日の気持ち`;
}

// ===== Initial state =====
updateStreakBadge();

// Show today's entry status
const todayEntry = getEntryByDate(todayStr());
if (!todayEntry) {
  // Gentle nudge after 2 seconds
  setTimeout(() => {
    showToast('✦', '今日の気持ちを記録しよう');
  }, 2000);
}

console.log('🌈 虹ログ initialized');
