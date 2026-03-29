// OshiMap Frontend
import init, { OshiMapState } from '../pkg/oshimap.js';

let state;
const canvas = document.getElementById('map-canvas');
const ctx = canvas.getContext('2d');
const STORAGE_KEY = 'oshimap_events';

async function main() {
  await init();
  state = new OshiMapState();

  // Load saved events
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) state.load_events(saved);

  setupUI();
  render();
}

function setupUI() {
  // Populate prefecture select
  const prefs = JSON.parse(state.get_prefectures_json());
  const select = document.getElementById('pref-select');
  prefs.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.code;
    opt.textContent = `${p.name} (${p.region})`;
    select.appendChild(opt);
  });

  // Add event button
  document.getElementById('add-btn').addEventListener('click', () => {
    const title = document.getElementById('event-title').value.trim();
    if (!title) { alert('イベント名を入力してください'); return; }

    const event = {
      id: Date.now().toString(36),
      prefecture_code: parseInt(document.getElementById('pref-select').value),
      title,
      date: document.getElementById('event-date').value || new Date().toISOString().slice(0, 10),
      event_type: document.getElementById('event-type').value,
      note: document.getElementById('event-note').value.trim(),
    };

    state.add_event(JSON.stringify(event));
    save();
    render();
    document.getElementById('event-title').value = '';
    document.getElementById('event-note').value = '';
  });
}

function save() {
  localStorage.setItem(STORAGE_KEY, state.export_events());
}

function render() {
  renderMap();
  renderStats();
  renderEventList();
}

function renderMap() {
  const w = canvas.width, h = canvas.height;
  ctx.fillStyle = '#060612';
  ctx.fillRect(0, 0, w, h);

  const prefs = JSON.parse(state.get_prefectures_json());
  const events = JSON.parse(state.get_events_json());
  const visited = new Set(events.map(e => e.prefecture_code));

  // Project coordinates to canvas
  const project = (lat, lng) => ({
    x: (lng - 128) * (w / 18),
    y: (46 - lat) * (h / 22),
  });

  // Draw route lines
  const route = JSON.parse(state.get_route_json());
  ctx.strokeStyle = 'rgba(255, 105, 180, 0.3)';
  ctx.lineWidth = 2;
  route.forEach(seg => {
    const from = prefs.find(p => p.code === seg.from_code);
    const to = prefs.find(p => p.code === seg.to_code);
    if (from && to) {
      const p1 = project(from.lat, from.lng);
      const p2 = project(to.lat, to.lng);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  });

  // Draw prefectures
  prefs.forEach(pref => {
    const pos = project(pref.lat, pref.lng);
    const isVisited = visited.has(pref.code);
    const eventCount = events.filter(e => e.prefecture_code === pref.code).length;

    // Dot
    const radius = isVisited ? 5 + Math.min(eventCount, 5) * 2 : 4;
    ctx.fillStyle = isVisited ? '#ff69b4' : 'rgba(100,100,150,0.4)';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Glow for visited
    if (isVisited) {
      ctx.fillStyle = 'rgba(255,105,180,0.15)';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius + 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Label
    ctx.fillStyle = isVisited ? '#fff' : 'rgba(150,150,180,0.5)';
    ctx.font = isVisited ? 'bold 9px Noto Sans JP' : '8px Noto Sans JP';
    ctx.textAlign = 'center';
    ctx.fillText(pref.name, pos.x, pos.y + radius + 12);

    // Event count badge
    if (eventCount > 1) {
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText(`×${eventCount}`, pos.x + radius + 4, pos.y - 2);
    }
  });

  // Title overlay
  ctx.fillStyle = 'rgba(255,105,180,0.7)';
  ctx.font = 'bold 14px Noto Sans JP';
  ctx.textAlign = 'left';
  ctx.fillText('推しマップ', 10, 20);
}

function renderStats() {
  const stats = JSON.parse(state.get_stats_json());
  document.getElementById('stat-events').textContent = `${stats.total_events}イベント`;
  document.getElementById('stat-prefectures').textContent = `${stats.visited_prefectures}都道府県`;
  document.getElementById('stat-coverage').textContent = `${stats.coverage_percent}%征服`;
  document.getElementById('stat-distance').textContent = `${stats.total_distance_km}km`;
}

function renderEventList() {
  const events = JSON.parse(state.get_events_json());
  const prefs = JSON.parse(state.get_prefectures_json());
  const list = document.getElementById('event-list');
  list.innerHTML = '';

  const typeEmoji = { concert: '🎵', event: '🎪', pilgrimage: '⛩️', other: '📝' };

  events.sort((a, b) => b.date.localeCompare(a.date)).forEach(e => {
    const pref = prefs.find(p => p.code === e.prefecture_code);
    const div = document.createElement('div');
    div.className = 'event-item';
    div.innerHTML = `
      <div class="info">
        <span class="pref">${pref ? pref.name : ''}</span> ${typeEmoji[e.event_type] || ''} ${e.title}
        <div class="date">${e.date}${e.note ? ' — ' + e.note : ''}</div>
      </div>
      <button class="del" data-id="${e.id}">✕</button>
    `;
    div.querySelector('.del').addEventListener('click', () => {
      state.remove_event(e.id);
      save();
      render();
    });
    list.appendChild(div);
  });

  if (events.length === 0) {
    list.innerHTML = '<p style="color: var(--text-sub); font-size: 0.8rem; text-align: center; padding: 16px;">まだイベントがありません。追加してみよう！</p>';
  }
}

main();
