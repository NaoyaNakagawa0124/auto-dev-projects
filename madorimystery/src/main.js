// MadoriMystery - Main entry point
import { FloorPlan, drawFloorPlan, gridFromPixel, GRID_SIZE, GRID_COLS, GRID_ROWS } from './floorplan.js';
import { ROOM_TYPES, generateMystery, findClue, getFoundClues, checkAccusation } from './mystery.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const modeLabel = document.getElementById('mode-label');
const designPanel = document.getElementById('design-panel');
const investigatePanel = document.getElementById('investigate-panel');
const roomPalette = document.getElementById('room-palette');
const storyBox = document.getElementById('story-box');
const clueList = document.getElementById('clue-list');
const suspectList = document.getElementById('suspect-list');
const resultOverlay = document.getElementById('result-overlay');
const resultTitle = document.getElementById('result-title');
const resultText = document.getElementById('result-text');

let floorPlan = new FloorPlan();
let mystery = null;
let mode = 'design'; // 'design' or 'investigate'
let selectedRoomType = 'living';
let hoveredRoom = null;

const OFFSET_X = 20;
const OFFSET_Y = 20;

// ===== Room palette =====
ROOM_TYPES.forEach(rt => {
  const btn = document.createElement('button');
  btn.className = `room-btn ${rt.id === selectedRoomType ? 'selected' : ''}`;
  btn.textContent = `${rt.emoji} ${rt.name}`;
  btn.addEventListener('click', () => {
    selectedRoomType = rt.id;
    roomPalette.querySelectorAll('.room-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
  roomPalette.appendChild(btn);
});

// ===== Canvas events =====
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const px = e.clientX - rect.left;
  const py = e.clientY - rect.top;
  const grid = gridFromPixel(px, py, OFFSET_X, OFFSET_Y);

  if (mode === 'design') {
    floorPlan.addRoom(grid.x, grid.y, selectedRoomType, 2, 2);
    render();
  } else if (mode === 'investigate' && mystery) {
    const room = floorPlan.getRoomAt(grid.x, grid.y);
    if (room) {
      const clue = findClue(mystery, room.id);
      if (clue) {
        renderClues();
        render();
      }
    }
  }
});

canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  if (mode !== 'design') return;
  const rect = canvas.getBoundingClientRect();
  const grid = gridFromPixel(e.clientX - rect.left, e.clientY - rect.top, OFFSET_X, OFFSET_Y);
  const room = floorPlan.getRoomAt(grid.x, grid.y);
  if (room) {
    floorPlan.removeRoom(room.id);
    render();
  }
});

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const grid = gridFromPixel(e.clientX - rect.left, e.clientY - rect.top, OFFSET_X, OFFSET_Y);
  const room = floorPlan.getRoomAt(grid.x, grid.y);
  const newHover = room ? room.id : null;
  if (newHover !== hoveredRoom) {
    hoveredRoom = newHover;
    render();
  }
});

// ===== Buttons =====
document.getElementById('btn-generate').addEventListener('click', () => {
  if (floorPlan.getRoomCount() < 2) {
    alert('部屋を2つ以上配置してください！');
    return;
  }
  mystery = generateMystery(floorPlan.rooms);
  if (mystery) {
    mode = 'investigate';
    switchMode();
    render();
  }
});

document.getElementById('btn-clear').addEventListener('click', () => {
  floorPlan.clear();
  render();
});

document.getElementById('btn-back').addEventListener('click', () => {
  mode = 'design';
  mystery = null;
  switchMode();
  render();
});

document.getElementById('btn-result-ok').addEventListener('click', () => {
  resultOverlay.classList.remove('show');
});

function switchMode() {
  modeLabel.textContent = mode === 'design' ? '設計モード' : '捜査モード';
  modeLabel.style.borderColor = mode === 'design' ? 'var(--accent2)' : 'var(--accent)';
  modeLabel.style.color = mode === 'design' ? 'var(--accent2)' : 'var(--accent)';
  designPanel.style.display = mode === 'design' ? 'block' : 'none';
  investigatePanel.style.display = mode === 'investigate' ? 'block' : 'none';

  if (mode === 'investigate' && mystery) {
    storyBox.innerHTML = `<strong>🔍 ${mystery.title}</strong><br><br>` +
      `深夜、この間取りの家で事件が発生した。<br>` +
      `凶器: ${mystery.weapon.emoji} ${mystery.weapon.name}<br>` +
      `各部屋を調査して手がかりを集め、犯人を突き止めろ！`;

    renderClues();
    renderSuspects();
  }
}

function renderClues() {
  if (!mystery) return;
  clueList.innerHTML = '';
  mystery.clues.forEach(c => {
    const div = document.createElement('div');
    div.className = `clue-item ${c.found ? 'found' : 'hidden'}`;
    div.textContent = c.found ? `✓ ${c.name}: ${c.desc}` : `? 未発見の手がかり`;
    clueList.appendChild(div);
  });
}

function renderSuspects() {
  if (!mystery) return;
  suspectList.innerHTML = '';
  mystery.suspects.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'suspect-btn';
    btn.innerHTML = `${s.emoji} <strong>${s.name}</strong> — ${s.role}<br><small style="color:var(--text-sub)">アリバイ: ${s.alibi}</small>`;
    btn.addEventListener('click', () => accuse(s.id));
    suspectList.appendChild(btn);
  });
}

function accuse(suspectId) {
  const found = getFoundClues(mystery);
  if (found.length < 2) {
    alert('もう少し手がかりを集めてから告発してください（最低2つ）');
    return;
  }

  const correct = checkAccusation(mystery, suspectId);
  if (correct) {
    resultTitle.textContent = '🎉 事件解決！';
    resultTitle.style.color = 'var(--success)';
    resultText.textContent = mystery.solution;
  } else {
    resultTitle.textContent = '❌ 推理失敗';
    resultTitle.style.color = 'var(--accent)';
    resultText.textContent = '犯人は違うようだ... もう一度手がかりを確認してみよう。';
  }
  resultOverlay.classList.add('show');
}

// ===== Render =====
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const options = {
    highlightRoom: hoveredRoom,
    mode,
  };

  if (mystery) {
    options.crimeScene = mystery.crimeScene;
    options.clueRooms = mystery.clues.filter(c => !c.found).map(c => c.roomId);
  }

  drawFloorPlan(ctx, floorPlan, OFFSET_X, OFFSET_Y, options);

  // Instructions overlay when empty
  if (mode === 'design' && floorPlan.getRoomCount() === 0) {
    ctx.fillStyle = 'rgba(200,200,230,0.3)';
    ctx.font = '14px Noto Sans JP, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('クリックして部屋を配置してください', canvas.width / 2, canvas.height / 2);
    ctx.textAlign = 'left';
  }
}

// ===== Init =====
render();
console.log('🔍 間取りミステリー initialized');
