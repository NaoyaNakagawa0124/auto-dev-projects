// PixelHome - New Tab Page Controller
import { TASKS, SECRETS, CATEGORIES, FURNITURE, checkSecrets } from './data.js';
import { drawRoom, drawLabel } from './renderer.js';

// Storage abstraction (works both in extension and standalone)
const storage = {
  async get(key) {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      return new Promise(r => chrome.storage.local.get(key, d => r(d[key])));
    }
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  },
  async set(key, value) {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      return new Promise(r => chrome.storage.local.set({ [key]: value }, r));
    }
    localStorage.setItem(key, JSON.stringify(value));
  }
};

let completedTasks = new Set();
let unlockedSecrets = new Set();

const canvas = document.getElementById('room-canvas');
const ctx = canvas.getContext('2d');
const taskList = document.getElementById('task-list');
const secretList = document.getElementById('secret-list');
const secretsSection = document.getElementById('secrets-section');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');

async function init() {
  const saved = await storage.get('pixelhome_data');
  if (saved) {
    completedTasks = new Set(saved.completed || []);
    unlockedSecrets = new Set(saved.secrets || []);
  }
  renderTasks();
  renderSecrets();
  renderRoom();
  updateProgress();
}

function renderTasks() {
  taskList.innerHTML = '';

  // Group by category
  const grouped = {};
  for (const task of TASKS) {
    if (!grouped[task.category]) grouped[task.category] = [];
    grouped[task.category].push(task);
  }

  for (const [catId, tasks] of Object.entries(grouped)) {
    const cat = CATEGORIES[catId];
    const section = document.createElement('div');
    section.className = 'task-category';

    const header = document.createElement('div');
    header.className = 'task-category-header';
    header.textContent = `${cat.emoji} ${cat.name}`;
    section.appendChild(header);

    for (const task of tasks) {
      const isCompleted = completedTasks.has(task.id);
      const item = document.createElement('div');
      item.className = `task-item ${isCompleted ? 'completed' : ''}`;

      const checkbox = document.createElement('div');
      checkbox.className = 'task-checkbox';
      checkbox.textContent = isCompleted ? '✓' : '';

      const name = document.createElement('span');
      name.className = 'task-name';
      name.textContent = task.name;

      const furnitureLabel = document.createElement('span');
      furnitureLabel.className = 'task-furniture';
      const f = FURNITURE[task.furniture];
      furnitureLabel.textContent = f ? `→ ${f.label}` : '';

      item.appendChild(checkbox);
      item.appendChild(name);
      item.appendChild(furnitureLabel);

      item.addEventListener('click', () => toggleTask(task.id));
      section.appendChild(item);
    }

    taskList.appendChild(section);
  }
}

function renderSecrets() {
  const secrets = checkSecrets(completedTasks.size, TASKS.length);
  unlockedSecrets = new Set(secrets);

  if (unlockedSecrets.size > 0) {
    secretsSection.classList.remove('hidden');
  }

  secretList.innerHTML = '';
  for (const secret of SECRETS) {
    const isUnlocked = unlockedSecrets.has(secret.id);
    const item = document.createElement('div');
    item.className = `secret-item ${isUnlocked ? 'unlocked' : 'locked'}`;
    item.textContent = isUnlocked
      ? `🎉 ${secret.name}`
      : `🔒 ??? (${secret.desc})`;
    secretList.appendChild(item);
  }
}

function renderRoom() {
  // Collect all unlocked furniture
  const furniture = [];
  for (const task of TASKS) {
    if (completedTasks.has(task.id)) {
      furniture.push(task.furniture);
    }
  }
  for (const secretId of unlockedSecrets) {
    furniture.push(secretId);
  }

  drawRoom(ctx, furniture, canvas.width, canvas.height);

  // Room label
  const completed = completedTasks.size;
  if (completed === 0) {
    drawLabel(ctx, 'タスクを完了して家具を増やそう！', canvas.width / 2, canvas.height - 20, 'rgba(200,200,230,0.4)', 14);
  } else if (completed >= TASKS.length) {
    drawLabel(ctx, '🎉 おめでとう！新居の完成！', canvas.width / 2, canvas.height - 20, '#ffd700', 16);
  }
}

function updateProgress() {
  const total = TASKS.length;
  const done = completedTasks.size;
  const pct = (done / total) * 100;
  progressFill.style.width = `${pct}%`;
  progressText.textContent = `${done}/${total}`;
}

async function toggleTask(taskId) {
  if (completedTasks.has(taskId)) {
    completedTasks.delete(taskId);
  } else {
    completedTasks.add(taskId);
  }

  await storage.set('pixelhome_data', {
    completed: [...completedTasks],
    secrets: [...unlockedSecrets],
  });

  renderTasks();
  renderSecrets();
  renderRoom();
  updateProgress();
}

// Init
init();
