// MeiTantei - Main entry point
import { cases, getCaseById, checkSolution } from './cases.js';
import { startCase, findClue, getFoundClues, markSolved, isCaseCompleted, getCompletedCount } from './store.js';
import { drawScene, getClueAtPosition, drawClueDetail } from './renderer.js';

// DOM
const titleScreen = document.getElementById('title-screen');
const investigationScreen = document.getElementById('investigation-screen');
const caseListEl = document.getElementById('case-list');
const canvas = document.getElementById('scene-canvas');
const ctx = canvas.getContext('2d');
const hudTitle = document.getElementById('hud-title');
const hudClues = document.getElementById('hud-clues');
const cluePanel = document.getElementById('clue-panel');
const clueEmpty = document.getElementById('clue-empty');
const btnAccuse = document.getElementById('btn-accuse');
const btnBack = document.getElementById('btn-back');
const accusationModal = document.getElementById('accusation-modal');
const suspectList = document.getElementById('suspect-list');
const btnCancelAccuse = document.getElementById('btn-cancel-accuse');
const resultModal = document.getElementById('result-modal');
const resultContent = document.getElementById('result-content');

let currentCase = null;
let hoveredClue = null;
let viewingClue = null;

// ===== Title Screen =====
function renderCaseList() {
  caseListEl.innerHTML = '';
  cases.forEach(c => {
    const completed = isCaseCompleted(c.id);
    const card = document.createElement('div');
    card.className = `case-card ${completed ? 'completed' : ''} fade-in`;
    card.innerHTML = `
      <h3>${completed ? '✅ ' : ''}${c.title}</h3>
      <div class="difficulty">${c.difficulty}</div>
      <p>${c.synopsis.slice(0, 80)}...</p>
    `;
    card.addEventListener('click', () => openCase(c.id));
    caseListEl.appendChild(card);
  });

  // Stats
  const count = getCompletedCount();
  if (count > 0) {
    const stats = document.createElement('p');
    stats.style.cssText = 'margin-top: 16px; font-size: 0.8rem; color: var(--text-sub);';
    stats.textContent = `${count}/${cases.length} 事件解決済み`;
    caseListEl.appendChild(stats);
  }
}

function showTitle() {
  titleScreen.style.display = 'flex';
  investigationScreen.style.display = 'none';
  accusationModal.classList.remove('show');
  resultModal.classList.remove('show');
  currentCase = null;
  renderCaseList();
}

// ===== Investigation =====
function openCase(caseId) {
  currentCase = getCaseById(caseId);
  if (!currentCase) return;

  startCase(caseId);
  titleScreen.style.display = 'none';
  investigationScreen.style.display = 'block';

  // Setup canvas
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  hudTitle.textContent = currentCase.title;
  updateCluePanel();
  render();
}

function updateCluePanel() {
  const found = getFoundClues(currentCase.id);
  hudClues.textContent = `手がかり: ${found.length}/${currentCase.clues.length}`;

  // Update clue chips
  const chips = cluePanel.querySelectorAll('.clue-chip');
  chips.forEach(c => c.remove());

  if (found.length === 0) {
    clueEmpty.style.display = 'block';
  } else {
    clueEmpty.style.display = 'none';
    found.forEach(clueId => {
      const clue = currentCase.clues.find(c => c.id === clueId);
      if (clue) {
        const chip = document.createElement('span');
        chip.className = 'clue-chip';
        chip.textContent = `✓ ${clue.name}`;
        chip.addEventListener('click', () => {
          viewingClue = clue;
          render();
        });
        cluePanel.insertBefore(chip, clueEmpty);
      }
    });
  }
}

function render() {
  if (!currentCase) return;

  const found = getFoundClues(currentCase.id);

  if (viewingClue) {
    drawClueDetail(ctx, viewingClue, canvas.width, canvas.height);
  } else {
    drawScene(ctx, currentCase, found, hoveredClue);
  }
}

// ===== Canvas Events =====
canvas.addEventListener('mousemove', (e) => {
  if (!currentCase || viewingClue) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const clue = getClueAtPosition(currentCase, x, y);
  const newHover = clue ? clue.id : null;

  if (newHover !== hoveredClue) {
    hoveredClue = newHover;
    canvas.style.cursor = hoveredClue ? 'pointer' : 'crosshair';
    render();
  }
});

canvas.addEventListener('click', (e) => {
  if (!currentCase) return;

  if (viewingClue) {
    viewingClue = null;
    render();
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const clue = getClueAtPosition(currentCase, x, y);
  if (clue) {
    const isNew = findClue(currentCase.id, clue.id);
    viewingClue = clue;
    updateCluePanel();
    render();
  }
});

window.addEventListener('resize', () => {
  if (currentCase) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
  }
});

// ===== Accusation =====
btnAccuse.addEventListener('click', () => {
  if (!currentCase) return;
  const found = getFoundClues(currentCase.id);
  if (found.length === 0) {
    alert('まだ手がかりがありません！証拠を集めてから告発してください。');
    return;
  }

  // Build suspect list
  suspectList.innerHTML = '';
  currentCase.suspects.forEach(s => {
    const option = document.createElement('div');
    option.className = 'suspect-option';
    option.innerHTML = `
      <span class="emoji">${s.emoji}</span>
      <div>
        <div class="name">${s.name}</div>
        <div class="desc">${s.description}</div>
      </div>
    `;
    option.addEventListener('click', () => handleAccusation(s.id));
    suspectList.appendChild(option);
  });

  accusationModal.classList.add('show');
});

btnCancelAccuse.addEventListener('click', () => {
  accusationModal.classList.remove('show');
});

function handleAccusation(suspectId) {
  accusationModal.classList.remove('show');

  const found = getFoundClues(currentCase.id);
  const result = checkSolution(currentCase, suspectId, found);

  if (result.correct) {
    markSolved(currentCase.id);
    resultContent.innerHTML = `
      <h2 style="color: var(--success);">🎉 事件解決！</h2>
      <p style="color: var(--gold); font-size: 1.2rem; margin: 8px 0;">正解！</p>
      <div class="explanation">${currentCase.solution.explanation}</div>
      <button class="result-btn" id="btn-result-ok">タイトルに戻る</button>
    `;
  } else {
    let msg = '';
    if (!result.correctCulprit) {
      msg = '犯人が違います。もう一度証拠を確認してください。';
    } else {
      msg = `犯人は合っていますが、証拠が不十分です。あと${result.missingClues.length}つの手がかりが必要です。`;
    }
    resultContent.innerHTML = `
      <h2 style="color: var(--danger);">❌ 推理失敗</h2>
      <p style="color: var(--text-sub); font-size: 1rem; margin: 16px 0;">${msg}</p>
      <button class="result-btn" id="btn-result-ok">調査を続ける</button>
    `;
  }

  resultModal.classList.add('show');

  document.getElementById('btn-result-ok').addEventListener('click', () => {
    resultModal.classList.remove('show');
    if (result.correct) {
      showTitle();
    }
  });
}

// ===== Back button =====
btnBack.addEventListener('click', showTitle);

// ===== Init =====
showTitle();
console.log('🔍 名探偵 initialized');
