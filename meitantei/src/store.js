// Game state persistence
const STORAGE_KEY = 'meitantei_save';

const defaultState = {
  currentCase: null,
  completedCases: [],
  caseProgress: {}, // caseId -> { foundClues: [], accusation: null }
};

let state = loadState();
const listeners = new Set();

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...defaultState, ...JSON.parse(saved) };
  } catch { /* ignore */ }
  return { ...defaultState };
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

function notify() {
  listeners.forEach(fn => fn(state));
}

export function getState() { return state; }

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function startCase(caseId) {
  state.currentCase = caseId;
  if (!state.caseProgress[caseId]) {
    state.caseProgress[caseId] = { foundClues: [], accusation: null, solved: false };
  }
  saveState();
  notify();
}

export function findClue(caseId, clueId) {
  const progress = state.caseProgress[caseId];
  if (!progress) return false;
  if (progress.foundClues.includes(clueId)) return false;
  progress.foundClues.push(clueId);
  saveState();
  notify();
  return true;
}

export function getFoundClues(caseId) {
  return state.caseProgress[caseId]?.foundClues || [];
}

export function makeAccusation(caseId, suspectId) {
  const progress = state.caseProgress[caseId];
  if (!progress) return;
  progress.accusation = suspectId;
  saveState();
  notify();
}

export function markSolved(caseId) {
  const progress = state.caseProgress[caseId];
  if (progress) progress.solved = true;
  if (!state.completedCases.includes(caseId)) {
    state.completedCases.push(caseId);
  }
  state.currentCase = null;
  saveState();
  notify();
}

export function isCaseCompleted(caseId) {
  return state.completedCases.includes(caseId);
}

export function getCompletedCount() {
  return state.completedCases.length;
}

export function resetAll() {
  state = { ...defaultState, caseProgress: {}, completedCases: [] };
  saveState();
  notify();
}
