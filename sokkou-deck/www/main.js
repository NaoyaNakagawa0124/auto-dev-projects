import init, {
  listDecks,
  getDeck,
  startRun,
  submitAnswer,
  computeResult,
  formatTime,
  formatDelta,
  consistencyTarget,
} from "./pkg/sokkou_deck.js";

const STORAGE_KEYS = {
  pb: "sokkou-deck:pb",
  settings: "sokkou-deck:settings",
};

const MODE_CANONICAL = {
  "any%": "AnyPercent",
  "100%": "HundredPercent",
  "consistency": "Consistency",
};

const state = {
  decks: [],
  selectedDeckId: null,
  selectedMode: "any%",
  currentDeck: null,
  run: null,
  totalCards: 0,
  rafId: null,
  startedWallMs: 0,
  pbForCurrent: null,
};

const $ = (sel) => document.querySelector(sel);
const screens = {
  home: () => document.querySelector('[data-screen="home"]'),
  run: () => document.querySelector('[data-screen="run"]'),
  result: () => document.querySelector('[data-screen="result"]'),
};

function showScreen(name) {
  for (const key of Object.keys(screens)) {
    screens[key]().setAttribute("data-active", key === name ? "true" : "false");
  }
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.settings);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveSettings(s) {
  try {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(s));
  } catch {}
}

function loadAllPBs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.pb);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveAllPBs(pbs) {
  try {
    localStorage.setItem(STORAGE_KEYS.pb, JSON.stringify(pbs));
  } catch {}
}

function pbKey(deckId, mode) {
  return `${deckId}::${mode}`;
}

function getPB(deckId, mode) {
  const all = loadAllPBs();
  return all[pbKey(deckId, mode)] || null;
}

function setPB(deckId, mode, pb) {
  const all = loadAllPBs();
  all[pbKey(deckId, mode)] = pb;
  saveAllPBs(all);
}

function clearAllPBs() {
  localStorage.removeItem(STORAGE_KEYS.pb);
}

// ─── Home ───

function renderDeckList() {
  const list = document.getElementById("deck-list");
  list.innerHTML = "";
  for (const deck of state.decks) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "deck-card";
    btn.dataset.deckId = deck.id;
    btn.dataset.selected = state.selectedDeckId === deck.id ? "true" : "false";
    btn.innerHTML = `
      <div class="deck-card-name">${escapeHtml(deck.name)}</div>
      <div class="deck-card-desc">${escapeHtml(deck.description)}</div>
      <div class="deck-card-count">${deck.card_count}</div>
    `;
    btn.addEventListener("click", () => selectDeck(deck.id));
    list.appendChild(btn);
  }
}

function selectDeck(id) {
  state.selectedDeckId = id;
  for (const el of document.querySelectorAll(".deck-card")) {
    el.dataset.selected = el.dataset.deckId === id ? "true" : "false";
  }
  document.getElementById("start-btn").disabled = false;
  const s = loadSettings();
  s.lastDeck = id;
  saveSettings(s);
}

function selectMode(mode) {
  state.selectedMode = mode;
  const radio = document.querySelector(`input[name="mode"][value="${mode}"]`);
  if (radio) radio.checked = true;
  const s = loadSettings();
  s.lastMode = mode;
  saveSettings(s);
}

// ─── Run ───

async function startRunFlow() {
  if (!state.selectedDeckId) return;
  const deckJs = await getDeck(state.selectedDeckId);
  state.currentDeck = deckJs;
  state.pbForCurrent = getPB(state.selectedDeckId, state.selectedMode);

  const target =
    state.selectedMode === "consistency"
      ? consistencyTarget(deckJs.cards.length)
      : deckJs.cards.length;
  state.totalCards = target;

  state.startedWallMs = performance.now();
  state.run = await startRun(state.selectedDeckId, state.selectedMode, 0);

  $("#run-deck-name").textContent = deckJs.name;
  $("#run-mode").textContent = state.selectedMode;
  $("#pb-display").textContent = state.pbForCurrent
    ? formatTime(state.pbForCurrent.total_ms)
    : "--:--.---";
  $("#pb-delta").textContent = "";
  $("#pb-delta").className = "stat-delta";

  document.getElementById("splits-list").innerHTML = "";
  document.getElementById("card-feedback").className = "card-feedback";
  document.getElementById("card-feedback").textContent = "";
  document.getElementById("answer-input").value = "";

  showScreen("run");
  renderCurrentCard();
  startTimer();
  document.getElementById("answer-input").focus();
}

function renderCurrentCard() {
  const card = state.currentDeck.cards[state.run.current_index];
  if (!card) return;
  document.getElementById("card-prompt").textContent = card.prompt;
  document.getElementById("card-counter").textContent =
    `${String(state.run.current_index + 1).padStart(2, "0")} / ${String(state.totalCards).padStart(2, "0")}`;
}

function startTimer() {
  const tick = () => {
    const elapsed = performance.now() - state.startedWallMs;
    const withPenalty = elapsed + state.run.penalty_ms;
    document.getElementById("timer").textContent = formatTime(withPenalty);

    if (state.pbForCurrent) {
      const delta = withPenalty - state.pbForCurrent.total_ms;
      const d = document.getElementById("pb-delta");
      d.textContent = formatDelta(Math.round(delta));
      d.className = "stat-delta " + (delta < 0 ? "ahead" : "behind");
    }

    if (state.run && state.run.status === "InProgress") {
      state.rafId = requestAnimationFrame(tick);
    }
  };
  state.rafId = requestAnimationFrame(tick);
}

function stopTimer() {
  if (state.rafId) {
    cancelAnimationFrame(state.rafId);
    state.rafId = null;
  }
}

async function handleAnswerSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("answer-input");
  const answer = input.value;
  if (!answer.trim()) return;
  const elapsed = performance.now() - state.startedWallMs;

  const response = await submitAnswer(state.run, answer, elapsed);
  state.run = response.run;
  const outcome = response.outcome;

  appendSplit();
  showFeedback(outcome);

  if (outcome === "penalty") {
    const frame = document.querySelector(".card-frame");
    frame.classList.add("shaking");
    setTimeout(() => frame.classList.remove("shaking"), 250);
    input.value = "";
    input.select();
    return;
  }

  if (outcome === "finished" || outcome === "failed") {
    stopTimer();
    setTimeout(() => showResult(outcome), 200);
    return;
  }

  input.value = "";
  renderCurrentCard();
}

function appendSplit() {
  const list = document.getElementById("splits-list");
  const splits = state.run.splits;
  const last = splits[splits.length - 1];
  const idx = splits.length;
  const card = state.currentDeck.cards.find((c) => c.id === last.card_id);
  const cardLabel = card ? card.prompt : last.card_id;
  const li = document.createElement("li");
  li.innerHTML = `
    <span class="split-idx">${String(idx).padStart(2, "0")}</span>
    <span class="split-card">${escapeHtml(cardLabel)}</span>
    <span class="split-time ${last.correct ? "ok" : "miss"}">${formatTime(last.time_ms)}</span>
  `;
  list.appendChild(li);
  list.scrollTop = list.scrollHeight;
}

function showFeedback(outcome) {
  const fb = document.getElementById("card-feedback");
  const last = state.run.splits[state.run.splits.length - 1];
  if (outcome === "penalty") {
    fb.textContent = `不正解  · +5.000 ペナルティ  · 正解: ${currentCardAnswerDisplay()}`;
    fb.className = "card-feedback miss";
  } else if (outcome === "failed") {
    fb.textContent = `不正解  · ラン 終了  · 正解: ${currentCardAnswerDisplay()}`;
    fb.className = "card-feedback miss";
  } else if (last && last.correct) {
    fb.textContent = `正解  · 区間 ${formatDelta(last.delta_ms)} ms`;
    fb.className = "card-feedback ok";
  } else {
    fb.textContent = `区間 ${formatDelta(last.delta_ms)} ms`;
    fb.className = "card-feedback";
  }
}

function currentCardAnswerDisplay() {
  const card = state.currentDeck.cards[state.run.current_index];
  if (!card) return "";
  return card.answers.join(" / ");
}

// ─── Result ───

async function showResult(outcome) {
  const pb = state.pbForCurrent;
  const pbJs = pb ? pb : null;
  const result = await computeResult(state.run, pbJs);

  // Persist PB for any% / consistency on success, 100% on success
  if (state.run.status === "Finished") {
    const splitTimes = state.run.splits.map((s) => s.time_ms);
    if (!pb || result.is_new_pb) {
      setPB(state.selectedDeckId, state.selectedMode, {
        deck_id: state.selectedDeckId,
        mode: MODE_CANONICAL[state.selectedMode] || state.selectedMode,
        total_ms: result.total_ms,
        split_times: splitTimes,
        achieved_at_iso: new Date().toISOString(),
      });
    }
  }

  const banner = document.getElementById("result-pb-banner");
  if (state.run.status === "Failed") {
    banner.textContent = "RUN 終了 · あと もう 1 回";
    banner.className = "pb-banner no-pb";
  } else if (!pb) {
    banner.textContent = "★ 初回 タイム を 記録";
    banner.className = "pb-banner new-pb";
  } else if (result.is_new_pb) {
    banner.textContent = "★★ NEW PB ★★";
    banner.className = "pb-banner new-pb";
  } else {
    banner.textContent = "RUN COMPLETE";
    banner.className = "pb-banner no-pb";
  }

  document.getElementById("result-total").textContent = formatTime(result.total_ms);

  const deltaEl = document.getElementById("result-delta");
  if (result.pb_total_delta !== null && result.pb_total_delta !== undefined) {
    const sign = result.pb_total_delta < 0 ? "ahead" : result.pb_total_delta > 0 ? "behind" : "neutral";
    deltaEl.textContent = formatDelta(result.pb_total_delta);
    deltaEl.className = `time-value delta ${sign}`;
  } else {
    deltaEl.textContent = "—";
    deltaEl.className = "time-value delta neutral";
  }

  const accuracy = result.total_count
    ? Math.round((result.correct_count / result.total_count) * 100)
    : 0;
  document.getElementById("result-accuracy").textContent =
    `${result.correct_count} / ${result.total_count}  (${accuracy}%)`;

  const tbody = document.getElementById("frame-data-body");
  tbody.innerHTML = "";
  result.annotated_splits.forEach((s, i) => {
    const card = state.currentDeck.cards.find((c) => c.id === s.card_id);
    const cardLabel = card ? card.prompt : s.card_id;
    const judgeClass = s.correct ? "ok" : "miss";
    const judgeText = s.correct ? "正解" : "不正解";
    let deltaCell = "—";
    let deltaClass = "neutral";
    if (s.pb_delta !== null && s.pb_delta !== undefined) {
      deltaCell = formatDelta(s.pb_delta);
      deltaClass = s.pb_delta < 0 ? "ahead" : s.pb_delta > 0 ? "behind" : "neutral";
    }
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${String(i + 1).padStart(2, "0")}</td>
      <td>${escapeHtml(cardLabel)}</td>
      <td>${escapeHtml(s.answer_given)}</td>
      <td class="judge ${judgeClass}">${judgeText}</td>
      <td class="num">${formatTime(s.delta_ms)}</td>
      <td class="num delta ${deltaClass}">${deltaCell}</td>
    `;
    tbody.appendChild(tr);
  });

  showScreen("result");
}

// ─── Helpers ───

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ─── Boot ───

async function main() {
  await init();
  state.decks = await listDecks();

  // restore settings
  const settings = loadSettings();
  if (settings.lastMode) selectMode(settings.lastMode);

  renderDeckList();

  if (settings.lastDeck && state.decks.find((d) => d.id === settings.lastDeck)) {
    selectDeck(settings.lastDeck);
  }

  for (const r of document.querySelectorAll('input[name="mode"]')) {
    r.addEventListener("change", () => selectMode(r.value));
  }

  document.getElementById("start-btn").addEventListener("click", startRunFlow);
  document.getElementById("reset-pb-btn").addEventListener("click", () => {
    if (confirm("全 デッキ の PB を 削除 します。 よろしい です か?")) {
      clearAllPBs();
      alert("PB を 削除 しました。");
    }
  });

  document.getElementById("answer-form").addEventListener("submit", handleAnswerSubmit);
  document.getElementById("abort-btn").addEventListener("click", () => {
    stopTimer();
    showScreen("home");
  });

  document.getElementById("retry-btn").addEventListener("click", () => {
    startRunFlow();
  });
  document.getElementById("back-home-btn").addEventListener("click", () => {
    showScreen("home");
    renderDeckList();
  });

  // Enter on home starts the run
  document.addEventListener("keydown", (e) => {
    const home = screens.home();
    if (home.getAttribute("data-active") === "true" && e.key === "Enter") {
      if (state.selectedDeckId) {
        e.preventDefault();
        startRunFlow();
      }
    }
  });
}

main().catch((err) => {
  console.error("起動 失敗", err);
  document.body.innerHTML =
    `<pre style="padding: 28px; color: #ff4a5e;">起動 失敗: ${escapeHtml(String(err))}</pre>`;
});
