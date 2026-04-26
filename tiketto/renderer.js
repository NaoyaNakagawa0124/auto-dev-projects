/**
 * 🎫 tiketto — Renderer Process
 */

// ===== State =====
let tickets = [];
let currentView = 'collection';
let editingId = null;
let selectedRating = 0;
let selectedColor = '#ff6b6b';

// ===== Init =====
document.addEventListener('DOMContentLoaded', async () => {
  tickets = await window.tiketto.getAll();
  renderCollection();
  initEventListeners();
});

// ===== Event Listeners =====
function initEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      switchView(view);
    });
  });

  // Add button
  document.getElementById('btn-add').addEventListener('click', openAddModal);

  // Modal
  document.getElementById('btn-close-modal').addEventListener('click', closeModal);
  document.querySelector('.modal-backdrop').addEventListener('click', closeModal);
  document.getElementById('btn-cancel').addEventListener('click', closeModal);
  document.getElementById('ticket-form').addEventListener('submit', handleFormSubmit);
  document.getElementById('btn-delete-ticket').addEventListener('click', handleDelete);

  // Star rating
  document.querySelectorAll('#f-rating .star').forEach(star => {
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.dataset.value);
      updateStars();
    });
  });

  // Color picker
  document.querySelectorAll('#f-color .color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      selectedColor = swatch.dataset.color;
      document.querySelectorAll('#f-color .color-swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
    });
  });

  // Search
  document.getElementById('search-input').addEventListener('input', renderCollection);

  // Sort
  document.getElementById('sort-select').addEventListener('change', renderCollection);

  // Export/Import
  document.getElementById('btn-export').addEventListener('click', handleExport);
  document.getElementById('btn-import').addEventListener('click', handleImport);

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

// ===== Views =====
function switchView(view) {
  currentView = view;
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.nav-btn[data-view="${view}"]`).classList.add('active');
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`view-${view}`).classList.add('active');

  const titles = { collection: 'コレクション', stats: '統計', timeline: 'タイムライン' };
  document.getElementById('view-title').textContent = titles[view];

  if (view === 'stats') renderStats();
  if (view === 'timeline') renderTimeline();
  if (view === 'collection') renderCollection();
}

// ===== Collection View =====
function renderCollection() {
  const grid = document.getElementById('ticket-grid');
  const empty = document.getElementById('empty-state');
  const search = document.getElementById('search-input').value.toLowerCase();
  const sort = document.getElementById('sort-select').value;

  let filtered = tickets.filter(t => {
    if (!search) return true;
    return (t.artist || '').toLowerCase().includes(search) ||
           (t.venue || '').toLowerCase().includes(search) ||
           (t.tour || '').toLowerCase().includes(search);
  });

  filtered = sortTickets(filtered, sort);

  document.getElementById('ticket-count').textContent = `${tickets.length}枚`;

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');
  grid.innerHTML = filtered.map(t => renderTicketCard(t)).join('');

  // Attach click events
  grid.querySelectorAll('.ticket-card').forEach(card => {
    card.addEventListener('click', () => openEditModal(card.dataset.id));
  });
}

function renderTicketCard(t) {
  const d = new Date(t.date);
  const month = d.toLocaleDateString('ja-JP', { month: 'short' });
  const day = d.getDate();
  const year = d.getFullYear();
  const stars = t.rating ? '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating) : '';
  const color = t.color || '#58a6ff';

  return `
    <div class="ticket-card" data-id="${t.id}">
      <div class="ticket-color-bar" style="background:${color}"></div>
      <div class="ticket-body">
        <div class="ticket-artist">${esc(t.artist)}</div>
        <div class="ticket-tour">${esc(t.tour || '')}</div>
        <div class="ticket-details">
          <span class="ticket-detail">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${esc(t.venue)}
          </span>
          ${t.seat ? `<span class="ticket-detail">💺 ${esc(t.seat)}</span>` : ''}
          ${stars ? `<span class="ticket-stars">${stars}</span>` : ''}
        </div>
      </div>
      <div class="ticket-stub">
        <span class="stub-month">${month}</span>
        <span class="stub-day">${day}</span>
        <span class="stub-year">${year}</span>
      </div>
    </div>
  `;
}

function sortTickets(list, sort) {
  const sorted = [...list];
  switch (sort) {
    case 'date-desc': return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    case 'date-asc': return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    case 'artist': return sorted.sort((a, b) => (a.artist || '').localeCompare(b.artist || ''));
    case 'venue': return sorted.sort((a, b) => (a.venue || '').localeCompare(b.venue || ''));
    default: return sorted;
  }
}

// ===== Stats View =====
function renderStats() {
  const container = document.getElementById('stats-container');
  if (tickets.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">📊</div><h2>まだデータがありません</h2></div>';
    return;
  }

  const totalShows = tickets.length;
  const artists = countBy(tickets, 'artist');
  const venues = countBy(tickets, 'venue');
  const years = countBy(tickets, t => new Date(t.date).getFullYear());
  const months = monthHeatmap(tickets);
  const avgRating = tickets.filter(t => t.rating).reduce((s, t) => s + t.rating, 0) / (tickets.filter(t => t.rating).length || 1);

  const topArtists = Object.entries(artists).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topVenues = Object.entries(venues).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxArtist = topArtists[0]?.[1] || 1;
  const maxVenue = topVenues[0]?.[1] || 1;

  container.innerHTML = `
    <div class="stat-card">
      <h3>総参戦数</h3>
      <span class="stat-value">${totalShows}</span><span class="stat-unit">公演</span>
    </div>
    <div class="stat-card">
      <h3>アーティスト数</h3>
      <span class="stat-value">${Object.keys(artists).length}</span><span class="stat-unit">組</span>
    </div>
    <div class="stat-card">
      <h3>会場数</h3>
      <span class="stat-value">${Object.keys(venues).length}</span><span class="stat-unit">箇所</span>
    </div>
    <div class="stat-card">
      <h3>平均評価</h3>
      <span class="stat-value">${avgRating.toFixed(1)}</span><span class="stat-unit">/ 5</span>
    </div>
    <div class="stat-card">
      <h3>🎤 よく行くアーティスト</h3>
      <ul class="stat-list">
        ${topArtists.map(([name, count]) => `
          <li>
            <span>${esc(name)}</span>
            <div class="stat-bar-container">
              <div class="stat-bar" style="width:${(count/maxArtist)*80}px"></div>
              <span class="stat-count">${count}</span>
            </div>
          </li>
        `).join('')}
      </ul>
    </div>
    <div class="stat-card">
      <h3>🏟️ よく行く会場</h3>
      <ul class="stat-list">
        ${topVenues.map(([name, count]) => `
          <li>
            <span>${esc(name)}</span>
            <div class="stat-bar-container">
              <div class="stat-bar" style="width:${(count/maxVenue)*80}px"></div>
              <span class="stat-count">${count}</span>
            </div>
          </li>
        `).join('')}
      </ul>
    </div>
    <div class="stat-card" style="grid-column: span 2">
      <h3>📅 月別ヒートマップ（今年）</h3>
      <div class="heatmap">
        ${months.map((count, i) => `
          <div>
            <div class="heatmap-cell" data-count="${Math.min(count, 5)}" title="${i+1}月: ${count}公演"></div>
            <div class="heatmap-label">${i+1}月</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function countBy(arr, keyOrFn) {
  const counts = {};
  for (const item of arr) {
    const key = typeof keyOrFn === 'function' ? keyOrFn(item) : item[keyOrFn];
    if (key) counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function monthHeatmap(arr) {
  const year = new Date().getFullYear();
  const months = new Array(12).fill(0);
  for (const t of arr) {
    const d = new Date(t.date);
    if (d.getFullYear() === year) {
      months[d.getMonth()]++;
    }
  }
  return months;
}

// ===== Timeline View =====
function renderTimeline() {
  const container = document.getElementById('timeline-container');
  if (tickets.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">⏱️</div><h2>まだデータがありません</h2></div>';
    return;
  }

  const sorted = [...tickets].sort((a, b) => new Date(b.date) - new Date(a.date));
  const byYear = {};
  for (const t of sorted) {
    const year = new Date(t.date).getFullYear();
    if (!byYear[year]) byYear[year] = [];
    byYear[year].push(t);
  }

  let html = '';
  for (const [year, items] of Object.entries(byYear).sort((a, b) => b[0] - a[0])) {
    html += `<div class="timeline-year">${year}年</div>`;
    for (const t of items) {
      const d = new Date(t.date);
      const dateStr = `${d.getMonth()+1}/${d.getDate()}`;
      const stars = t.rating ? ' ★'.repeat(t.rating) : '';
      html += `
        <div class="timeline-item">
          <div class="timeline-date">${dateStr}</div>
          <div class="timeline-info">
            <h4>${esc(t.artist)}${stars}</h4>
            <p>${esc(t.venue)}${t.tour ? ' — ' + esc(t.tour) : ''}</p>
          </div>
        </div>
      `;
    }
  }

  container.innerHTML = html;
}

// ===== Modal =====
function openAddModal() {
  editingId = null;
  selectedRating = 0;
  selectedColor = '#ff6b6b';
  document.getElementById('modal-title').textContent = 'チケット追加';
  document.getElementById('ticket-form').reset();
  document.getElementById('f-id').value = '';
  document.getElementById('f-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('btn-delete-ticket').classList.add('hidden');
  updateStars();
  updateColorPicker();
  document.getElementById('modal').classList.remove('hidden');
  document.getElementById('f-artist').focus();
}

function openEditModal(id) {
  const ticket = tickets.find(t => t.id === id);
  if (!ticket) return;

  editingId = id;
  selectedRating = ticket.rating || 0;
  selectedColor = ticket.color || '#ff6b6b';
  document.getElementById('modal-title').textContent = 'チケット編集';
  document.getElementById('f-id').value = id;
  document.getElementById('f-artist').value = ticket.artist || '';
  document.getElementById('f-tour').value = ticket.tour || '';
  document.getElementById('f-venue').value = ticket.venue || '';
  document.getElementById('f-date').value = ticket.date || '';
  document.getElementById('f-seat').value = ticket.seat || '';
  document.getElementById('f-number').value = ticket.number || '';
  document.getElementById('f-memo').value = ticket.memo || '';
  document.getElementById('btn-delete-ticket').classList.remove('hidden');
  updateStars();
  updateColorPicker();
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  editingId = null;
}

function updateStars() {
  document.querySelectorAll('#f-rating .star').forEach(star => {
    star.classList.toggle('active', parseInt(star.dataset.value) <= selectedRating);
  });
}

function updateColorPicker() {
  document.querySelectorAll('#f-color .color-swatch').forEach(s => {
    s.classList.toggle('active', s.dataset.color === selectedColor);
  });
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const data = {
    artist: document.getElementById('f-artist').value.trim(),
    tour: document.getElementById('f-tour').value.trim(),
    venue: document.getElementById('f-venue').value.trim(),
    date: document.getElementById('f-date').value,
    seat: document.getElementById('f-seat').value.trim(),
    number: document.getElementById('f-number').value.trim(),
    memo: document.getElementById('f-memo').value.trim(),
    rating: selectedRating,
    color: selectedColor,
  };

  if (editingId) {
    data.id = editingId;
    const updated = await window.tiketto.update(data);
    if (updated) {
      const idx = tickets.findIndex(t => t.id === editingId);
      if (idx >= 0) tickets[idx] = updated;
    }
  } else {
    const added = await window.tiketto.add(data);
    tickets.push(added);
  }

  closeModal();
  renderCollection();
}

async function handleDelete() {
  if (!editingId) return;
  if (!confirm('このチケットを削除しますか？')) return;

  await window.tiketto.delete(editingId);
  tickets = tickets.filter(t => t.id !== editingId);
  closeModal();
  renderCollection();
}

// ===== Export / Import =====
async function handleExport() {
  const json = await window.tiketto.exportData();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tiketto-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

async function handleImport() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const result = await window.tiketto.importData(text);
    if (result.success) {
      tickets = await window.tiketto.getAll();
      renderCollection();
      alert(`${result.count}件のチケットを読み込みました`);
    } else {
      alert(`エラー: ${result.error}`);
    }
  };
  input.click();
}

// ===== Utility =====
function esc(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
