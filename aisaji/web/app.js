import { pickHand } from "../src/pickHand.js";
import { judge } from "../src/judge.js";
import { createRound } from "../src/timer.js";

const DURATION_MS = 90_000;
const CARD_SWITCH_MS = 6_000;
const HAND_SIZE = Math.ceil(DURATION_MS / CARD_SWITCH_MS); // 15 cards
const HISTORY_KEY = "aisaji:history";
const RING_CIRC = 565.48;

const $ = (sel) => document.querySelector(sel);

const app = $("#app");
let currentRound = null;
let hand = [];
let currentIndex = -1;
let leftOks = new Set();
let rightOks = new Set();
let leftTappedAt = -Infinity;
let rightTappedAt = -Infinity;

function setScreen(name) {
  app.classList.remove("screen-intro", "screen-round", "screen-result");
  app.classList.add(`screen-${name}`);
}

function vibrate(ms) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

function renderCard(idx) {
  const card = hand[idx];
  if (!card) return;
  $("#card-tile").dataset.tone = card.tone;
  $("#card-glyph").textContent = card.glyph;
  $("#card-name").textContent  = card.name;
  $("#card-kind").textContent  = card.kind === "escape" ? "逃げ道" : "";

  // Re-trigger the fade-in by removing/re-adding the animation
  const tile = $("#card-tile");
  tile.style.animation = "none";
  // force reflow
  tile.offsetHeight;
  tile.style.animation = "";

  // Reset per-card tap marks
  $("#tap-left").classList.remove("is-on");
  $("#tap-right").classList.remove("is-on");
  $("#left-mark").textContent  = "気が向く";
  $("#right-mark").textContent = "気が向く";
}

function onTapSide(side) {
  if (currentIndex < 0 || currentIndex >= hand.length) return;
  const card = hand[currentIndex];
  if (side === "left") {
    leftOks.add(card.id);
    leftTappedAt = performance.now();
    $("#tap-left").classList.add("is-on");
  } else {
    rightOks.add(card.id);
    rightTappedAt = performance.now();
    $("#tap-right").classList.add("is-on");
  }
  vibrate(15);
  // If both tapped this card within ~1.5s, flash both as a "decided" cue.
  if (Math.abs(leftTappedAt - rightTappedAt) < 1500
      && leftOks.has(card.id) && rightOks.has(card.id)) {
    vibrate([8, 40, 8]);
  }
}

function setRing(elapsedMs) {
  const ratio = Math.min(1, elapsedMs / DURATION_MS);
  $(".ring-fill").style.strokeDashoffset = String(RING_CIRC * (1 - ratio));
  $("#time-left").textContent = String(Math.max(0, Math.ceil((DURATION_MS - elapsedMs) / 1000)));
}

function startRound() {
  const seed = (Date.now() ^ Math.floor(Math.random() * 0xffff)) | 0;
  hand = pickHand(seed, HAND_SIZE);
  currentIndex = -1;
  leftOks = new Set();
  rightOks = new Set();
  leftTappedAt = -Infinity;
  rightTappedAt = -Infinity;
  setRing(0);
  setScreen("round");

  currentRound = createRound({
    durationMs: DURATION_MS,
    tickMs: 240,
    cardSwitchMs: CARD_SWITCH_MS,
    handSize: hand.length,
    onTick: (elapsed) => setRing(elapsed),
    onCardChange: (idx) => { currentIndex = idx; renderCard(idx); },
    onEnd: showResult,
  });
  currentRound.start();
}

function showResult() {
  const result = judge({
    candidates: hand,
    leftOks,
    rightOks,
    seed: (Date.now() ^ 0xb16b00b5) | 0,
  });
  if (result.kind === "decided") {
    const c = result.card;
    $("#result-card").dataset.tone = c.tone;
    $("#result-glyph").textContent = c.glyph;
    $("#result-name").textContent  = c.name;
    $("#result-message").textContent = result.message;
  } else {
    $("#result-card").dataset.tone = "escape";
    $("#result-glyph").textContent = "外";
    $("#result-name").textContent  = "今夜は 外食 で いい";
    $("#result-message").textContent = result.message;
  }
  $("#result-closer").textContent = result.closer;
  appendHistory(result);
  renderHistoryLine();
  setScreen("result");
  vibrate([10, 60, 10]);
}

function appendHistory(result) {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    arr.push({
      at: new Date().toISOString(),
      kind: result.kind,
      cardName: result.card ? result.card.name : null,
    });
    // keep last 7 entries
    while (arr.length > 7) arr.shift();
    localStorage.setItem(HISTORY_KEY, JSON.stringify(arr));
  } catch { /* localStorage disabled — ignore */ }
}

function renderHistoryLine() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return;
    const arr = JSON.parse(raw);
    if (arr.length === 0) return;
    const today = new Date().toISOString().slice(0, 10);
    const todayCount = arr.filter(h => h.at.slice(0, 10) === today).length;
    const last = arr[arr.length - 1];
    const name = last.cardName || "外食";
    $("#history-line").textContent =
      `きょう ${todayCount} 回 引きました  /  さっき は ${name}`;
  } catch { /* ignore */ }
}

function boot() {
  setScreen("intro");
  renderHistoryLine();

  $("#start-btn").addEventListener("click", startRound);
  $("#again-btn").addEventListener("click", () => setScreen("intro"));

  const leftBtn  = $("#tap-left");
  const rightBtn = $("#tap-right");
  leftBtn.addEventListener("click",  () => onTapSide("left"));
  rightBtn.addEventListener("click", () => onTapSide("right"));

  // Keyboard for desktop testing
  document.addEventListener("keydown", (e) => {
    if (!app.classList.contains("screen-round")) return;
    if (e.key === "a" || e.key === "A") onTapSide("left");
    if (e.key === "l" || e.key === "L") onTapSide("right");
  });
}

boot();
