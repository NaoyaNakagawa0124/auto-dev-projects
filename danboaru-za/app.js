import {
  BoxStore,
  placeStar,
  nearestNeighborEdges,
  catalogueName,
  SIZE_MAGNITUDE,
} from './core.js';

const STORE_KEY = 'danboaru-za.v1';

// ─── Persistence ────────────────────────────────────────
function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return BoxStore.fromJSON(JSON.parse(raw));
  } catch (_) { /* ignore corrupted */ }
  return new BoxStore();
}
function saveStore() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store.toJSON()));
  } catch (_) { /* full or denied */ }
}

const store = loadStore();
const supernovas = []; // { x, y, age, life, hue, magnitude }

// ─── DOM refs ────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const boxListEl    = $('#box-list');
const emptyHintEl  = $('#empty-hint');
const statTotal    = $('#stat-total');
const statUnopened = $('#stat-unopened');
const statMagnitude = $('#stat-magnitude');
const catNameEl    = $('#catalogue-name');
const completionEl = $('#completion');
const compCitation = $('#comp-citation');
const toastEl      = $('#toast');

// ─── Toast ──────────────────────────────────────────────
let toastTimer = 0;
function showToast(text) {
  toastEl.textContent = text;
  toastEl.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('visible'), 1800);
}

// ─── UI rendering ────────────────────────────────────────
function renderBoxList() {
  boxListEl.innerHTML = '';
  const items = [...store.boxes].sort((a, b) => {
    if (a.opened !== b.opened) return a.opened ? 1 : -1;
    return a.registeredAt - b.registeredAt;
  });
  for (const b of items) {
    const li = document.createElement('li');
    li.dataset.id = b.id;
    if (b.opened) li.classList.add('opened');
    li.innerHTML = `
      <span class="box-glyph" aria-hidden="true"></span>
      <div class="box-meta">
        <span class="box-label"></span>
        <span class="box-sub"></span>
      </div>
      <div class="box-actions"></div>
    `;
    li.querySelector('.box-label').textContent = b.label;
    li.querySelector('.box-sub').textContent =
      `${sizeLabel(b.size)} ・ ${b.opened ? '開封済み' : '未開封'}`;

    const actions = li.querySelector('.box-actions');
    if (!b.opened) {
      const open = document.createElement('button');
      open.type = 'button';
      open.className = 'btn-open';
      open.textContent = '開封';
      open.addEventListener('click', () => openBox(b.id));
      actions.appendChild(open);
    }
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'btn-remove';
    remove.textContent = '消す';
    remove.addEventListener('click', () => removeBox(b.id, b.label));
    actions.appendChild(remove);

    boxListEl.appendChild(li);
  }
  boxListEl.classList.toggle('is-empty', items.length === 0);
  emptyHintEl.style.display = items.length === 0 ? 'block' : 'none';
}

function sizeLabel(s) {
  return { small: '小', medium: '中', large: '大' }[s] ?? '中';
}

function renderStats() {
  statTotal.textContent     = String(store.total);
  statUnopened.textContent  = String(store.unopened.length);
  const avg = store.averageMagnitude();
  statMagnitude.textContent = avg == null ? '—' : avg.toFixed(2);
  catNameEl.textContent = store.total === 0 ? '未登録' : catalogueName(store.boxes);
}

// ─── Box actions ─────────────────────────────────────────
function openBox(id) {
  const box = store.boxes.find((x) => x.id === id);
  if (!box || box.opened) return;
  const star = placeStar(box.label, box.size);
  supernovas.push({
    x: star.x,
    y: star.y,
    hue: star.hue,
    magnitude: star.magnitude,
    age: 0,
    life: 1.4,
  });
  store.open(id);
  saveStore();
  renderBoxList();
  renderStats();
  showToast(`${box.label} ⟶ 超新星`);
  if (store.isClear) showCompletion();
}

function removeBox(id, label) {
  store.remove(id);
  saveStore();
  renderBoxList();
  renderStats();
  showToast(`${label} を台帳から消しました`);
}

// ─── Completion ──────────────────────────────────────────
function showCompletion() {
  const now = new Date();
  const stamp = `Logged ${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} · DBZ Catalogue`;
  compCitation.textContent = stamp;
  completionEl.setAttribute('aria-hidden', 'false');
}
$('#completion-close').addEventListener('click', () => {
  completionEl.setAttribute('aria-hidden', 'true');
});

// ─── Form / Reset ────────────────────────────────────────
$('#add-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = $('#label-input');
  const size = document.querySelector('input[name="size"]:checked')?.value ?? 'medium';
  const label = input.value.trim();
  if (!label) return;
  if (store.boxes.some((b) => b.label === label && !b.opened)) {
    showToast('同じ名前の星がもうあります');
    return;
  }
  store.add({ label, size });
  saveStore();
  input.value = '';
  renderBoxList();
  renderStats();
  showToast(`${label} を星に登録`);
});

$('#reset-all').addEventListener('click', () => {
  if (store.total === 0) return;
  if (!confirm('台帳の星をすべて消去します。よろしいですか？')) return;
  store.reset();
  saveStore();
  renderBoxList();
  renderStats();
  showToast('夜空を初期化しました');
});

// ─── p5 sky ──────────────────────────────────────────────
let bgStars = [];

function initBgStars(w, h) {
  bgStars = [];
  let s = 31337;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return (s >>> 8) / (1 << 24);
  };
  const count = Math.max(80, Math.min(260, Math.floor((w * h) / 8000)));
  for (let i = 0; i < count; i++) {
    bgStars.push({
      x: rnd(),
      y: rnd(),
      r: 0.3 + rnd() * 1.0,
      a: 0.18 + rnd() * 0.5,
      tw: 0.3 + rnd() * 1.5,
      ph: rnd() * Math.PI * 2,
    });
  }
}

new p5((p) => {
  let lastTime = 0;

  p.setup = () => {
    const c = p.createCanvas(p.windowWidth, p.windowHeight);
    c.parent('sky');
    p.pixelDensity(Math.min(2, window.devicePixelRatio || 1));
    initBgStars(p.width, p.height);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    initBgStars(p.width, p.height);
  };

  p.draw = () => {
    const now = p.millis() / 1000;
    const dt = lastTime ? Math.min(0.05, now - lastTime) : 0.016;
    lastTime = now;

    drawBackground(p);
    drawBgStars(p, now);

    const visible = store.unopened;
    const stars = visible.map((b) => ({ box: b, ...placeStar(b.label, b.size) }));
    drawConstellationLines(p, stars);
    for (const s of stars) drawStar(p, s, now);

    // supernovas
    for (let i = supernovas.length - 1; i >= 0; i--) {
      const sn = supernovas[i];
      sn.age += dt;
      drawSupernova(p, sn);
      if (sn.age >= sn.life) supernovas.splice(i, 1);
    }
  };

  p.mousePressed = () => {
    const visible = store.unopened;
    if (visible.length === 0) return;
    let closest = null;
    let bestD2 = 32 * 32;
    for (const b of visible) {
      const star = placeStar(b.label, b.size);
      const sx = star.x * p.width;
      const sy = star.y * p.height;
      const dx = p.mouseX - sx;
      const dy = p.mouseY - sy;
      const d2 = dx * dx + dy * dy;
      if (d2 < bestD2) { bestD2 = d2; closest = b; }
    }
    if (closest) openBox(closest.id);
  };
});

function drawBackground(p) {
  // dark gradient with subtle nebula
  const c = p.drawingContext;
  const grad = c.createLinearGradient(0, 0, 0, p.height);
  grad.addColorStop(0.00, '#08081a');
  grad.addColorStop(0.55, '#0a0d22');
  grad.addColorStop(1.00, '#04050f');
  c.fillStyle = grad;
  c.fillRect(0, 0, p.width, p.height);

  // soft nebula brushstroke
  const nebula = c.createRadialGradient(
    p.width * 0.18, p.height * 0.30, 10,
    p.width * 0.18, p.height * 0.30, p.width * 0.55,
  );
  nebula.addColorStop(0, 'rgba(120, 100, 220, 0.18)');
  nebula.addColorStop(0.4, 'rgba(80, 60, 180, 0.07)');
  nebula.addColorStop(1, 'rgba(0, 0, 0, 0)');
  c.fillStyle = nebula;
  c.fillRect(0, 0, p.width, p.height);

  const nebula2 = c.createRadialGradient(
    p.width * 0.78, p.height * 0.78, 10,
    p.width * 0.78, p.height * 0.78, p.width * 0.45,
  );
  nebula2.addColorStop(0, 'rgba(200, 110, 90, 0.10)');
  nebula2.addColorStop(1, 'rgba(0, 0, 0, 0)');
  c.fillStyle = nebula2;
  c.fillRect(0, 0, p.width, p.height);
}

function drawBgStars(p, now) {
  const c = p.drawingContext;
  c.fillStyle = 'rgba(255, 250, 235, 1)';
  for (const s of bgStars) {
    const tw = 0.55 + 0.45 * Math.sin(now * s.tw + s.ph);
    c.globalAlpha = s.a * tw;
    c.beginPath();
    c.arc(s.x * p.width, s.y * p.height, s.r, 0, Math.PI * 2);
    c.fill();
  }
  c.globalAlpha = 1;
}

function drawConstellationLines(p, stars) {
  if (stars.length < 2) return;
  const edges = nearestNeighborEdges(stars, 2);
  const c = p.drawingContext;
  c.strokeStyle = 'rgba(252, 228, 168, 0.22)';
  c.lineWidth = 0.8;
  c.beginPath();
  for (const [a, b] of edges) {
    const sa = stars[a], sb = stars[b];
    c.moveTo(sa.x * p.width, sa.y * p.height);
    c.lineTo(sb.x * p.width, sb.y * p.height);
  }
  c.stroke();
}

function drawStar(p, s, now) {
  const c = p.drawingContext;
  const cx = s.x * p.width;
  const cy = s.y * p.height;
  const tw = 0.6 + 0.4 * Math.sin(now * s.twinkle + s.phase);
  const baseR = 2.2 + 2.4 * s.magnitude;
  const r = baseR * tw;
  const halo = r * 4.5;

  // halo
  const grad = c.createRadialGradient(cx, cy, 0, cx, cy, halo);
  grad.addColorStop(0, `hsla(${s.hue}, 80%, 78%, ${0.55 * tw})`);
  grad.addColorStop(0.4, `hsla(${s.hue}, 80%, 65%, ${0.20 * tw})`);
  grad.addColorStop(1, `hsla(${s.hue}, 80%, 60%, 0)`);
  c.fillStyle = grad;
  c.beginPath();
  c.arc(cx, cy, halo, 0, Math.PI * 2);
  c.fill();

  // core
  c.fillStyle = `hsla(${s.hue}, 60%, 95%, 1)`;
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.fill();
}

function drawSupernova(p, sn) {
  const c = p.drawingContext;
  const cx = sn.x * p.width;
  const cy = sn.y * p.height;
  const t = sn.age / sn.life;        // 0..1
  const ease = 1 - Math.pow(1 - t, 2);
  const ringR = (8 + 220 * ease) * (0.7 + 0.3 * sn.magnitude);
  const flashAlpha = (1 - t) * (1 - t) * 0.85;
  const ringAlpha = (1 - t) * 0.55;

  // outward shock ring
  c.strokeStyle = `hsla(${sn.hue}, 90%, 78%, ${ringAlpha})`;
  c.lineWidth = 1 + 4 * (1 - t);
  c.beginPath();
  c.arc(cx, cy, ringR, 0, Math.PI * 2);
  c.stroke();

  // bright core flash
  const flashR = 18 + 36 * (1 - t);
  const grad = c.createRadialGradient(cx, cy, 0, cx, cy, flashR);
  grad.addColorStop(0, `hsla(${sn.hue}, 100%, 95%, ${flashAlpha})`);
  grad.addColorStop(0.4, `hsla(${sn.hue}, 90%, 70%, ${flashAlpha * 0.6})`);
  grad.addColorStop(1, `hsla(${sn.hue}, 90%, 60%, 0)`);
  c.fillStyle = grad;
  c.beginPath();
  c.arc(cx, cy, flashR, 0, Math.PI * 2);
  c.fill();
}

// ─── Initial render ──────────────────────────────────────
renderBoxList();
renderStats();
