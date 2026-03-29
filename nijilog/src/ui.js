// UI rendering for panels
import { moods, getMoodById } from './data/moods.js';
import { addEntry, deleteEntry, getEntryByDate, getStats, getEntriesForMonth, todayStr, getState } from './store.js';

let onEntryAdded = null;

export function setOnEntryAdded(cb) { onEntryAdded = cb; }

// ===== Entry Form =====
export function renderEntryForm(container, preselectedDate) {
  const dateStr = preselectedDate || todayStr();
  const existing = getEntryByDate(dateStr);

  container.innerHTML = `
    <div class="fade-in">
      ${existing ? `<p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 12px;">この日はすでに記録があります。上書きされます。</p>` : ''}
      <div class="form-group">
        <label>今日の気分は？</label>
        <div class="mood-grid" id="mood-grid">
          ${moods.map(m => `
            <div class="mood-option ${existing && existing.mood === m.id ? 'selected' : ''}" data-mood="${m.id}">
              <div class="mood-dot" style="background: ${m.color};"></div>
              <span class="mood-name">${m.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="form-group">
        <label for="entry-text">ひとこと（任意）</label>
        <textarea id="entry-text" placeholder="今日あったこと、感じたこと...">${existing ? escapeHtml(existing.text) : ''}</textarea>
      </div>
      <button class="btn btn-primary" id="save-entry-btn" ${existing ? '' : 'disabled'}>
        ✦ 記録する
      </button>
      ${existing ? `<button class="btn btn-danger" id="delete-entry-btn">この日の記録を削除</button>` : ''}
    </div>
  `;

  let selectedMood = existing ? existing.mood : null;
  const grid = container.querySelector('#mood-grid');
  const saveBtn = container.querySelector('#save-entry-btn');

  grid.addEventListener('click', (e) => {
    const option = e.target.closest('.mood-option');
    if (!option) return;

    grid.querySelectorAll('.mood-option').forEach(o => o.classList.remove('selected'));
    option.classList.add('selected');
    selectedMood = option.dataset.mood;
    saveBtn.disabled = false;
  });

  saveBtn.addEventListener('click', () => {
    if (!selectedMood) return;
    const text = container.querySelector('#entry-text').value.trim();
    const entry = addEntry({ date: dateStr, mood: selectedMood, text });
    if (onEntryAdded) onEntryAdded(entry);
  });

  const deleteBtn = container.querySelector('#delete-entry-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      deleteEntry(dateStr);
      if (onEntryAdded) onEntryAdded(null);
    });
  }
}

// ===== Calendar View =====
export function renderCalendar(container, yearMonth, onDayClick, onMonthChange) {
  const [year, month] = yearMonth.split('-').map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  const startDow = firstDay.getDay(); // 0=Sun

  const entries = getEntriesForMonth(yearMonth);
  const entryMap = {};
  entries.forEach(e => { entryMap[e.date] = e; });

  const today = todayStr();
  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

  const prevMonth = month === 1 ? `${year - 1}-12` : `${year}-${String(month - 1).padStart(2, '0')}`;
  const nextMonth = month === 12 ? `${year + 1}-01` : `${year}-${String(month + 1).padStart(2, '0')}`;

  container.innerHTML = `
    <div class="fade-in">
      <div class="cal-nav">
        <button id="cal-prev">◀</button>
        <span class="cal-month">${year}年 ${monthNames[month - 1]}</span>
        <button id="cal-next">▶</button>
      </div>
      <div class="calendar">
        ${dayNames.map(d => `<div class="cal-header">${d}</div>`).join('')}
        ${Array(startDow).fill('<div class="cal-day empty"></div>').join('')}
        ${Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const entry = entryMap[dateStr];
          const isToday = dateStr === today;
          const mood = entry ? getMoodById(entry.mood) : null;
          const bgStyle = mood ? `background: ${mood.color}40; border-color: ${mood.color}80;` : '';
          return `<div class="cal-day ${entry ? 'has-entry' : ''} ${isToday ? 'today' : ''}" data-date="${dateStr}" style="${bgStyle}">${day}</div>`;
        }).join('')}
      </div>
    </div>
  `;

  container.querySelector('#cal-prev').addEventListener('click', () => onMonthChange(prevMonth));
  container.querySelector('#cal-next').addEventListener('click', () => onMonthChange(nextMonth));

  container.querySelectorAll('.cal-day:not(.empty)').forEach(el => {
    el.addEventListener('click', () => onDayClick(el.dataset.date));
  });
}

// ===== Entry List =====
export function renderEntryList(container) {
  const stats = getStats();
  const entries = stats.entries; // already reversed (newest first)

  if (entries.length === 0) {
    container.innerHTML = `
      <div class="empty-state fade-in">
        <p>📝</p>
        <p>まだ記録がありません</p>
        <p style="margin-top: 4px;">✦ ボタンから最初の気持ちを記録しよう</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="fade-in">
      <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 12px;">${entries.length}件の記録</p>
      ${entries.map(e => {
        const mood = getMoodById(e.mood);
        return `
          <div class="entry-item">
            <div class="entry-color-dot" style="background: ${mood ? mood.color : '#94a3b8'};"></div>
            <div class="entry-content">
              <div class="entry-date">${formatDate(e.date)}</div>
              <div class="entry-mood" style="color: ${mood ? mood.color : 'var(--text)'};">${mood ? mood.emoji : ''} ${mood ? mood.name : e.mood}</div>
              ${e.text ? `<div class="entry-text">${escapeHtml(e.text)}</div>` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ===== Stats View =====
export function renderStats(container) {
  const stats = getStats();
  const state = getState();

  // Sort moods by count
  const moodEntries = Object.entries(stats.moodCounts).sort((a, b) => b[1] - a[1]);
  const maxMoodCount = moodEntries.length > 0 ? moodEntries[0][1] : 1;

  container.innerHTML = `
    <div class="fade-in">
      <!-- Key numbers -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;">
        <div class="stats-card">
          <div class="stats-big">${stats.totalEntries}</div>
          <div class="stats-label">総記録数</div>
        </div>
        <div class="stats-card">
          <div class="stats-big" style="color: var(--mood-energy);">${stats.streak}</div>
          <div class="stats-label">現在の連続日数</div>
        </div>
        <div class="stats-card">
          <div class="stats-big" style="color: var(--mood-joy);">${stats.longestStreak}</div>
          <div class="stats-label">最長連続記録</div>
        </div>
        <div class="stats-card">
          <div class="stats-big" style="color: var(--mood-calm);">${stats.gaps.length}</div>
          <div class="stats-label">途切れた回数</div>
        </div>
      </div>

      <!-- Mood distribution -->
      <div class="stats-card">
        <h3>🎨 気分の分布</h3>
        ${moodEntries.length === 0 ? '<p style="color: var(--text-muted); font-size: 0.78rem;">データなし</p>' :
          moodEntries.map(([id, count]) => {
            const mood = getMoodById(id);
            return `
              <div class="mood-bar-row">
                <span class="mood-bar-name">${mood ? mood.emoji + ' ' + mood.name : id}</span>
                <div class="mood-bar-track">
                  <div class="mood-bar-fill" style="width: ${(count / maxMoodCount) * 100}%; background: ${mood ? mood.color : 'var(--accent)'};"></div>
                </div>
                <span class="mood-bar-count">${count}</span>
              </div>
            `;
          }).join('')
        }
      </div>

      <!-- Motivation -->
      <div class="stats-card" style="text-align: center;">
        <h3 style="margin-bottom: 6px;">💬 メッセージ</h3>
        <p style="font-size: 0.85rem; color: var(--text);">${getMotivation(stats)}</p>
      </div>
    </div>
  `;
}

function getMotivation(stats) {
  if (stats.totalEntries === 0) return 'さあ、最初の一歩を踏み出そう！';
  if (stats.streak >= 30) return '30日連続！あなたの虹は壮大な芸術作品です 🌈';
  if (stats.streak >= 14) return '2週間連続！美しい流れが続いています ✨';
  if (stats.streak >= 7) return '一週間連続！素晴らしいリズムです 🎵';
  if (stats.streak >= 3) return '連続記録が伸びています。この調子！💪';
  if (stats.streak >= 1) return '今日も記録できましたね。流れを途切れさせないで 🌊';
  if (stats.gaps.length > 3) return '途切れても大丈夫。また今日から始めよう 🌱';
  return '新しい色を加えて、虹を育てよう 🎨';
}

// Helpers
function formatDate(dateStr) {
  const d = new Date(dateStr);
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}（${days[d.getDay()]}）`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
