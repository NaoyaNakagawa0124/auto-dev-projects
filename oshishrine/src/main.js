// OshiShrine - Main entry point
import { loadShrine, saveShrine, getTheme, incrementVisitor, addGuestbookEntry, THEMES, BADGES, TITLES } from './shrine.js';
import { StarField, SparkleTrail, FloatingHearts } from './effects.js';

const canvas = document.getElementById('fx-canvas');
const ctx = canvas.getContext('2d');
const setupForm = document.getElementById('setup-form');
const shrinePage = document.getElementById('shrine-page');
const themeGrid = document.getElementById('theme-grid');
const inputName = document.getElementById('input-name');
const inputCatch = document.getElementById('input-catch');
const createBtn = document.getElementById('create-btn');
const editBtn = document.getElementById('edit-btn');

let shrine = loadShrine();
let starField, sparkleTrail, floatingHearts;
let selectedTheme = shrine.themeId;

// ===== Canvas setup =====
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ===== Effects =====
starField = new StarField(canvas);
sparkleTrail = new SparkleTrail(canvas);
floatingHearts = new FloatingHearts(canvas);

// Make sparkle trail respond to mouse on body
document.body.addEventListener('mousemove', (e) => {
  sparkleTrail.mouseX = e.clientX;
  sparkleTrail.mouseY = e.clientY;
  sparkleTrail.spawn(2);
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const theme = getTheme(selectedTheme);
  starField.update();
  starField.draw(theme.star);

  sparkleTrail.update();
  sparkleTrail.draw();

  floatingHearts.update();
  floatingHearts.draw();

  requestAnimationFrame(animate);
}
animate();

// ===== Theme selector =====
THEMES.forEach(t => {
  const btn = document.createElement('button');
  btn.className = `theme-btn ${t.id === selectedTheme ? 'selected' : ''}`;
  btn.style.background = t.primary;
  btn.title = t.name;
  btn.addEventListener('click', () => {
    selectedTheme = t.id;
    themeGrid.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    applyTheme(t);
  });
  themeGrid.appendChild(btn);
});

function applyTheme(theme) {
  document.documentElement.style.setProperty('--primary', theme.primary);
  document.documentElement.style.setProperty('--secondary', theme.secondary);
  document.documentElement.style.setProperty('--bg', theme.bg);
  document.documentElement.style.setProperty('--star-color', theme.star);
  document.body.style.background = theme.bg;
}

// ===== Show setup or shrine =====
if (shrine.oshiName) {
  showShrine();
} else {
  showSetup();
}

function showSetup() {
  setupForm.style.display = 'block';
  shrinePage.style.display = 'none';
  inputName.value = shrine.oshiName;
  inputCatch.value = shrine.catchphrase;
  applyTheme(getTheme(selectedTheme));
}

function showShrine() {
  setupForm.style.display = 'none';
  shrinePage.style.display = 'block';

  const theme = getTheme(shrine.themeId);
  selectedTheme = shrine.themeId;
  applyTheme(theme);
  incrementVisitor(shrine);

  // Title
  document.getElementById('shrine-title').textContent =
    `⛩️ ${shrine.oshiName} ${shrine.title} ⛩️`;
  document.getElementById('shrine-subtitle').textContent =
    shrine.catchphrase || `${shrine.oshiName}のファンサイトへようこそ！`;

  // Marquee
  document.getElementById('marquee-text').textContent =
    `✨✨✨ ${shrine.oshiName}は最高！！ ${shrine.catchphrase} ✨✨✨ このサイトは${shrine.oshiName}を応援する非公式ファンサイトです ✨✨✨`;

  // Badges
  const badgeRow = document.getElementById('badge-row');
  badgeRow.innerHTML = shrine.badges
    .map(id => BADGES.find(b => b.id === id)?.emoji || '')
    .join(' ');

  // Profile
  document.getElementById('profile-text').innerHTML =
    `<strong>${shrine.oshiName}</strong>は私の${shrine.title}です。<br><br>` +
    `${shrine.catchphrase ? shrine.catchphrase + '<br><br>' : ''}` +
    `このサイトは${shrine.oshiName}への愛を込めて作りました。<br>` +
    `永遠に応援し続けます！！💗💗💗`;

  // Visitor counter
  document.getElementById('visitor-num').textContent =
    String(shrine.visitorCount).padStart(6, '0');

  // Guestbook
  renderGuestbook();
}

function renderGuestbook() {
  const container = document.getElementById('guestbook-entries');
  container.innerHTML = '';
  shrine.guestbookEntries.forEach(entry => {
    const div = document.createElement('div');
    div.className = 'guestbook-entry';
    div.innerHTML = `
      <span class="name">${escapeHtml(entry.name)}</span>
      <span class="date">${entry.date}</span>
      <div class="text">${escapeHtml(entry.text)}</div>
    `;
    container.appendChild(div);
  });
}

// ===== Events =====
createBtn.addEventListener('click', () => {
  const name = inputName.value.trim();
  if (!name) { alert('推しの名前を入力してください！'); return; }

  shrine.oshiName = name;
  shrine.catchphrase = inputCatch.value.trim();
  shrine.themeId = selectedTheme;
  shrine.title = TITLES[Math.floor(Math.random() * TITLES.length)];
  saveShrine(shrine);
  showShrine();
});

editBtn.addEventListener('click', showSetup);

document.getElementById('gb-submit').addEventListener('click', () => {
  const name = document.getElementById('gb-name').value.trim();
  const text = document.getElementById('gb-text').value.trim();
  if (!text) return;

  addGuestbookEntry(shrine, name, text);
  document.getElementById('gb-name').value = '';
  document.getElementById('gb-text').value = '';
  renderGuestbook();
});

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

console.log('⛩️ 推し神社 initialized');
