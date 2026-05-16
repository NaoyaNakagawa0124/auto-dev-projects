import {
  newState, click, buyUpgrade, step, tryStartViral,
  autoIncomePerSec, upgradeCost, progressFraction, formatYen,
} from "./modules/game.js";

const SAVE_KEY = "fukugyou-bubble/state/v1";
const TICK_MS = 100;
const SAVE_INTERVAL_MS = 5000;

let config = null;
let state = null;
let lastTick = performance.now();
let lastSave = performance.now();
let rafId = null;
let winShown = false;

async function loadConfig() {
  const r = await fetch("./data/hustles.json");
  if (!r.ok) throw new Error("hustles.json の読み込みに失敗しました");
  return r.json();
}

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (!d.hustles || !Array.isArray(d.hustles)) return null;
    return d;
  } catch { return null; }
}

function saveState() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {}
}

function buildCard(def) {
  const card = document.createElement("article");
  card.className = "hustle-card";
  card.dataset.id = def.id;
  card.innerHTML = `
    <div class="accent" style="background: ${def.color}"></div>
    <h3><span class="emoji">${def.emoji}</span><span>${def.name_jp}</span></h3>
    <div class="meta-row">
      <span>クリック ¥${def.click_reward}</span>
      <span class="rate">¥0.0/秒</span>
    </div>
    <div class="upgrade-row">
      <span>アップグレード</span>
      <span class="count" data-count>0</span>
    </div>
    <div class="btn-row">
      <button class="btn-click" data-click>稼ぐ ¥${def.click_reward}</button>
      <button class="btn-upgrade disabled" data-upgrade>+1 (¥${formatYen(def.upgrade_base_cost)})</button>
    </div>
  `;
  card.querySelector("[data-click]").addEventListener("click", e => handleClick(def, card, e));
  card.querySelector("[data-upgrade]").addEventListener("click", () => handleUpgrade(def));
  return card;
}

function renderGrid() {
  const grid = document.getElementById("hustle-grid");
  grid.innerHTML = "";
  for (const def of config.hustles) {
    grid.appendChild(buildCard(def));
  }
}

function updateAll() {
  // HUD
  document.getElementById("hud-cash").textContent = formatYen(state.cash);
  document.getElementById("hud-income").textContent = formatYen(autoIncomePerSec(config, state)) + "/秒";
  document.getElementById("hud-clicks").textContent = state.total_clicks.toLocaleString("ja-JP");
  // Progress
  const frac = progressFraction(config, state);
  document.getElementById("progress-fill").style.width = (frac * 100).toFixed(2) + "%";
  document.getElementById("progress-label").textContent =
    `${formatYen(state.cash)} / ${formatYen(config.win_target)}`;

  // Cards
  document.querySelectorAll(".hustle-card").forEach((card, idx) => {
    const def = config.hustles[idx];
    const sh = state.hustles[idx];
    const isViral = state.viral.seconds_left > 0 && state.viral.hustle_id === def.id;
    card.classList.toggle("is-viral", isViral);

    const rateEl = card.querySelector(".rate");
    const baseRate = def.base_income * (sh.upgrades || 0);
    const effRate = baseRate * (isViral ? state.viral.multiplier : 1);
    rateEl.textContent = baseRate > 0
      ? `¥${effRate.toFixed(1)}/秒${isViral ? " ×3" : ""}`
      : "¥0/秒";

    card.querySelector("[data-count]").textContent = sh.upgrades.toString();

    const cost = upgradeCost(def.upgrade_base_cost, def.cost_growth, sh.upgrades);
    const upBtn = card.querySelector("[data-upgrade]");
    upBtn.textContent = `+1 (${formatYen(cost)})`;
    upBtn.classList.toggle("disabled", state.cash < cost);
  });

  // Viral overlay
  const overlay = document.getElementById("viral-overlay");
  if (state.viral.seconds_left > 0 && state.viral.hustle_id) {
    overlay.classList.remove("hidden");
    const def = config.hustles.find(h => h.id === state.viral.hustle_id);
    document.getElementById("viral-body").textContent = def
      ? `${def.emoji} ${def.name_jp} — ${def.viral_blurb}`
      : "ある副業がバズり中…";
    document.getElementById("viral-timer").textContent = `${Math.ceil(state.viral.seconds_left)} 秒`;
  } else {
    overlay.classList.add("hidden");
  }

  // Win
  if (state.won && !winShown) {
    winShown = true;
    const winStats = `クリック ${state.total_clicks} 回 · 経過 ${Math.floor(state.elapsed_sec / 60)} 分 ${Math.floor(state.elapsed_sec % 60)} 秒`;
    document.getElementById("win-stats").textContent = winStats;
    document.getElementById("win-overlay").classList.remove("hidden");
  }
}

function handleClick(def, card, evt) {
  if (state.won) return;
  click(config, state, def.id);
  // floating pop animation
  const isViral = state.viral.seconds_left > 0 && state.viral.hustle_id === def.id;
  const gain = def.click_reward * (isViral ? state.viral.multiplier : 1);
  const pop = document.createElement("span");
  pop.className = "pop";
  pop.textContent = "+" + formatYen(gain);
  const rect = card.getBoundingClientRect();
  const ex = evt.clientX - rect.left;
  const ey = evt.clientY - rect.top;
  pop.style.left = ex + "px";
  pop.style.top = ey + "px";
  card.appendChild(pop);
  setTimeout(() => pop.remove(), 800);
  updateAll();
}

function handleUpgrade(def) {
  if (state.won) return;
  const before = state.cash;
  const r = buyUpgrade(config, state, def.id);
  if (r !== null) {
    updateAll();
  } else {
    // visual feedback - flash card briefly
  }
}

function loop() {
  const now = performance.now();
  const delta = now - lastTick;
  lastTick = now;
  step(config, state, delta);
  // Try viral event
  if (state.time_since_last_viral >= config.viral_period_sec && state.viral.seconds_left <= 0) {
    tryStartViral(config, state, Math.random());
  }
  if (now - lastSave > SAVE_INTERVAL_MS) {
    lastSave = now;
    saveState();
  }
  updateAll();
  rafId = requestAnimationFrame(loop);
}

function startGame(loaded) {
  state = loaded || newState(config);
  winShown = state.won;
  renderGrid();
  updateAll();
  if (rafId) cancelAnimationFrame(rafId);
  lastTick = performance.now();
  lastSave = performance.now();
  rafId = requestAnimationFrame(loop);
}

async function init() {
  config = await loadConfig();
  const loaded = loadState();
  startGame(loaded);
  document.getElementById("btn-reset").addEventListener("click", () => {
    if (!confirm("本当に最初からやり直しますか？")) return;
    localStorage.removeItem(SAVE_KEY);
    document.getElementById("win-overlay").classList.add("hidden");
    startGame(null);
  });
  document.getElementById("btn-replay").addEventListener("click", () => {
    localStorage.removeItem(SAVE_KEY);
    document.getElementById("win-overlay").classList.add("hidden");
    startGame(null);
  });
  window.addEventListener("beforeunload", saveState);
}

init().catch(err => {
  console.error(err);
  document.body.innerHTML = `<div style="padding:40px; font-family: serif;">起動に失敗しました: ${err.message}</div>`;
});
