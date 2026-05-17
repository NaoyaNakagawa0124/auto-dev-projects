import init, {
  listChapters,
  listAllCases,
  getCase,
  submitVerdict,
  computeScore,
  causeLabel,
  causeAlibi,
} from "./pkg/hachi_kenshi.js";

const STORAGE = {
  results: "hachi-kenshi:results",
  pb: "hachi-kenshi:pb",
};

const state = {
  chapters: [],
  allCases: [],
  caseIndex: new Map(), // id -> case
  results: [],          // [{case_id, correct}]
  current: null,        // current Case object
  selectedCause: null,
  runStartMs: 0,
  rafId: null,
};

const $ = (s) => document.querySelector(s);

function showScreen(name) {
  for (const s of document.querySelectorAll(".screen")) {
    s.setAttribute("data-active", s.dataset.screen === name ? "true" : "false");
  }
  window.scrollTo({ top: 0, behavior: "instant" });
}

function loadResults() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE.results)) || [];
  } catch { return []; }
}
function saveResults(r) {
  localStorage.setItem(STORAGE.results, JSON.stringify(r));
}
function clearResults() {
  localStorage.removeItem(STORAGE.results);
  localStorage.removeItem(STORAGE.pb);
}
function loadPB() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE.pb));
  } catch { return null; }
}
function savePB(pb) {
  localStorage.setItem(STORAGE.pb, JSON.stringify(pb));
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function fmtTime(ms) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  const t = Math.floor((ms % 1000) / 100);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${t}`;
}

function fmtTimeMs(ms) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  const milli = Math.floor(ms % 1000);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(milli).padStart(3, "0")}`;
}

// ─── HOME ───

async function renderHome() {
  const board = document.getElementById("chapter-board");
  board.innerHTML = "";
  const results = state.results;
  for (const ch of state.chapters) {
    const solvedCount = ch.case_ids.filter(
      (id) => results.find((r) => r.case_id === id && r.correct)
    ).length;
    const unlocked = await chapterUnlocked(ch.id);
    const card = document.createElement("div");
    card.className = "chapter-card" + (unlocked ? "" : " locked");
    card.innerHTML = `
      <div class="chapter-card-head">
        <span class="chapter-card-label">${escapeHtml(ch.label)} 編</span>
        <span class="chapter-card-progress">${solvedCount} / ${ch.case_ids.length}</span>
      </div>
      <div class="chapter-card-cases">
        ${ch.case_ids
          .map((id) => {
            const r = results.find((x) => x.case_id === id);
            let cls = "case-tag";
            if (!unlocked) cls += " locked";
            else if (r && r.correct) cls += " solved";
            else if (r) cls += " wrong";
            return `<button class="${cls}" data-case-id="${escapeHtml(id)}" ${unlocked ? "" : "disabled"}>${escapeHtml(id.toUpperCase())}</button>`;
          })
          .join("")}
      </div>`;
    board.appendChild(card);
  }
  for (const btn of document.querySelectorAll(".case-tag")) {
    btn.addEventListener("click", () => openCase(btn.dataset.caseId));
  }

  const pb = loadPB();
  const pbEl = document.getElementById("pb-line");
  if (pb && pb.all_clear) {
    pbEl.textContent = `PB:  得点 ${pb.total_points}   時間 ${fmtTimeMs(pb.time_ms)}`;
  } else {
    pbEl.textContent = "PB:  まだ 全 検視 を 完了 して いません";
  }

  const totalSolved = results.filter((r) => r.correct).length;
  const startBtn = document.getElementById("start-btn");
  if (totalSolved >= 12) {
    startBtn.textContent = "▶  最初 から 再 検視";
  } else {
    const nextCaseId = nextUnsolvedCaseId();
    startBtn.textContent = nextCaseId
      ? `▶  事件 ${nextCaseId.toUpperCase()} を 開く`
      : "▶  最初 の 事件 を 開く";
  }
}

async function chapterUnlocked(chapterId) {
  // First chapter is always unlocked
  const order = state.chapters.map((c) => c.id);
  const idx = order.indexOf(chapterId);
  if (idx <= 0) return true;
  const prev = state.chapters[idx - 1];
  const solved = prev.case_ids.filter(
    (id) => state.results.find((r) => r.case_id === id && r.correct)
  ).length;
  return solved >= prev.case_ids.length;
}

function nextUnsolvedCaseId() {
  for (const ch of state.chapters) {
    for (const id of ch.case_ids) {
      const r = state.results.find((x) => x.case_id === id);
      if (!r || !r.correct) return id;
    }
  }
  return null;
}

// ─── CASE ───

async function openCase(caseId) {
  if (!state.runStartMs) state.runStartMs = performance.now();
  const c = state.caseIndex.get(caseId);
  if (!c) return;
  state.current = c;
  state.selectedCause = null;
  document.getElementById("case-num").textContent = "#" + caseId.replace(/^c/, "").padStart(2, "0");
  document.getElementById("case-chapter").textContent = chapterLabelFor(c.chapter);
  document.getElementById("case-victim").textContent = c.victim;
  document.getElementById("case-age").textContent = "享年 " + c.age;
  document.getElementById("case-found").textContent = c.found_at;
  document.getElementById("case-cond").textContent = c.conditions;

  const evList = document.getElementById("evidence-list");
  evList.innerHTML = c.evidence.map((e) => `<li>${escapeHtml(e)}</li>`).join("");

  const susList = document.getElementById("suspect-list");
  susList.innerHTML = "";
  for (const s of c.suspects) {
    const label = await causeLabel(s);
    const alibi = await causeAlibi(s);
    const li = document.createElement("li");
    li.className = "suspect-card";
    li.dataset.cause = s;
    li.dataset.selected = "false";
    li.innerHTML = `
      <input type="radio" name="suspect" value="${escapeHtml(s)}">
      <span class="suspect-name">${escapeHtml(label)}</span>
      <span class="suspect-alibi">「${escapeHtml(alibi)}」</span>`;
    li.addEventListener("click", () => selectSuspect(s));
    susList.appendChild(li);
  }
  document.getElementById("accuse-btn").disabled = true;

  showScreen("case");
  startCaseTimer();
}

function chapterLabelFor(chapterEnum) {
  // chapter is encoded as enum string like "Houseplant"
  return {
    Houseplant: "観葉 編",
    Cactus: "サボテン 編",
    Herb: "ハーブ 編",
    Succulent: "多肉 編",
  }[chapterEnum] || chapterEnum;
}

function selectSuspect(cause) {
  state.selectedCause = cause;
  for (const card of document.querySelectorAll(".suspect-card")) {
    card.dataset.selected = card.dataset.cause === cause ? "true" : "false";
  }
  document.getElementById("accuse-btn").disabled = false;
}

function startCaseTimer() {
  stopCaseTimer();
  const tick = () => {
    const elapsed = performance.now() - state.runStartMs;
    document.getElementById("case-timer").textContent = fmtTime(elapsed);
    state.rafId = requestAnimationFrame(tick);
  };
  state.rafId = requestAnimationFrame(tick);
}

function stopCaseTimer() {
  if (state.rafId) { cancelAnimationFrame(state.rafId); state.rafId = null; }
}

async function submitAccusation() {
  if (!state.current || !state.selectedCause) return;
  const v = await submitVerdict(state.current.id, state.selectedCause);
  // Update results — keep first attempt result
  const existing = state.results.find((r) => r.case_id === state.current.id);
  if (existing) {
    existing.correct = v.correct;
  } else {
    state.results.push({ case_id: state.current.id, correct: v.correct });
  }
  saveResults(state.results);

  document.getElementById("verdict-stamp").textContent = v.correct ? "起訴 認容" : "誤 起訴";
  document.getElementById("verdict-stamp").className = "verdict-stamp " + (v.correct ? "ok" : "bad");
  document.getElementById("verdict-title").textContent = v.correct
    ? "捜査 終結 — " + state.current.victim
    : "再 調査 が 必要 — " + state.current.victim;
  document.getElementById("verdict-accused").textContent = await causeLabel(v.accused);
  document.getElementById("verdict-culprit").textContent = await causeLabel(v.culprit);
  document.getElementById("verdict-explanation").textContent = v.explanation;

  showScreen("verdict");
}

async function goToNextCase() {
  const total = state.allCases.length;
  const solvedCount = state.results.filter((r) => r.correct).length;
  if (state.results.length >= total) {
    await showComplete();
    return;
  }
  const nextId = nextUnsolvedCaseId();
  if (!nextId) {
    await showComplete();
    return;
  }
  // Ensure chapter is unlocked, else go home
  const ch = state.chapters.find((c) => c.case_ids.includes(nextId));
  if (ch && !(await chapterUnlocked(ch.id))) {
    await renderHome();
    showScreen("home");
    return;
  }
  openCase(nextId);
}

// ─── COMPLETE ───

async function showComplete() {
  stopCaseTimer();
  const totalMs = performance.now() - state.runStartMs;
  const report = await computeScore(state.results, totalMs);
  document.getElementById("score-correct").textContent =
    `${report.correct_count} / ${report.total_cases}`;
  document.getElementById("score-wrong").textContent = report.wrong_count;
  document.getElementById("score-time").textContent = fmtTimeMs(totalMs);
  document.getElementById("score-total").textContent = report.total_points + " 点";
  document.getElementById("score-base").textContent = report.base_points;
  document.getElementById("score-chapter").textContent = report.chapter_bonus;
  document.getElementById("score-clear").textContent = report.clear_bonus;
  document.getElementById("score-timebonus").textContent = report.time_bonus;

  const banner = document.getElementById("pb-banner");
  const pb = loadPB();
  if (report.all_clear) {
    if (!pb || report.total_points > pb.total_points || (report.total_points === pb.total_points && totalMs < pb.time_ms)) {
      savePB({ total_points: report.total_points, time_ms: totalMs, all_clear: true });
      banner.textContent = "★★  NEW PB  ★★";
      banner.className = "pb-banner new-pb";
    } else {
      banner.textContent = "PB に は 届か ず";
      banner.className = "pb-banner no-pb";
    }
  } else {
    banner.textContent = "全 事件 を 解いた とき に PB が 確定 します";
    banner.className = "pb-banner no-pb";
  }
  showScreen("complete");
}

// ─── BOOT ───

async function main() {
  await init();
  state.chapters = await listChapters();
  state.allCases = await listAllCases();
  state.caseIndex = new Map(state.allCases.map((c) => [c.id, c]));
  state.results = loadResults();

  await renderHome();
  showScreen("home");

  document.getElementById("start-btn").addEventListener("click", async () => {
    const totalSolved = state.results.filter((r) => r.correct).length;
    if (totalSolved >= state.allCases.length) {
      state.results = [];
      saveResults(state.results);
      state.runStartMs = 0;
      await renderHome();
    }
    state.runStartMs = performance.now();
    const id = nextUnsolvedCaseId() || state.allCases[0].id;
    openCase(id);
  });

  document.getElementById("reset-btn").addEventListener("click", async () => {
    if (confirm("進捗 と PB を リセット します。 よろしい です か?")) {
      clearResults();
      state.results = [];
      state.runStartMs = 0;
      await renderHome();
    }
  });

  document.getElementById("accuse-btn").addEventListener("click", submitAccusation);
  document.getElementById("back-home-btn").addEventListener("click", async () => {
    stopCaseTimer();
    await renderHome();
    showScreen("home");
  });
  document.getElementById("back-home-btn-2").addEventListener("click", async () => {
    await renderHome();
    showScreen("home");
  });

  document.getElementById("next-case-btn").addEventListener("click", goToNextCase);

  document.getElementById("retry-btn").addEventListener("click", async () => {
    state.results = [];
    saveResults(state.results);
    state.runStartMs = performance.now();
    await renderHome();
    openCase(state.allCases[0].id);
  });
}

main().catch((err) => {
  console.error("起動 失敗", err);
  document.body.innerHTML =
    `<pre style="padding: 24px; color: #8c2c2c; background: #f4ebd9;">起動 失敗: ${escapeHtml(String(err))}</pre>`;
});
