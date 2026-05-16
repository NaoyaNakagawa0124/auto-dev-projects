import init, { Engine } from "./pkg/ryogae_kan.js";

const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

let engine = null;
let lastTick = performance.now();
let rafId = null;

const HIGH_KEY = "ryogae-kan/high/v1";

function loadHigh() {
  try {
    const raw = localStorage.getItem(HIGH_KEY);
    if (!raw) return { high_score: 0, high_streak: 0 };
    return JSON.parse(raw);
  } catch { return { high_score: 0, high_streak: 0 }; }
}

function saveHigh(state) {
  try {
    localStorage.setItem(HIGH_KEY, JSON.stringify({
      high_score: state.high_score, high_streak: state.high_streak,
    }));
  } catch {}
}

function switchScreen(id) {
  $$(".screen").forEach(s => s.classList.toggle("is-active", s.id === id));
}

async function boot() {
  await init();
  const seed = BigInt(Date.now()) ^ (BigInt(Math.floor(Math.random() * 1e9)) << 21n);
  engine = new Engine(seed);

  const high = loadHigh();
  $("#hud-high").textContent = String(high.high_streak ?? 0);

  $("#btn-start").addEventListener("click", startGame);
  $("#btn-retry").addEventListener("click", startGame);
  $("#btn-home").addEventListener("click", () => switchScreen("screen-title"));

  $$(".judge-btn").forEach(b => {
    b.addEventListener("click", () => answer(parseInt(b.dataset.choice, 10)));
  });
  document.addEventListener("keydown", e => {
    if (e.repeat) return;
    if ($("#screen-game").classList.contains("is-active") && !$("#overlay-reveal").classList.contains("hidden")) {
      return;
    }
    if (!$("#screen-game").classList.contains("is-active")) return;
    if (e.key === "1") answer(0);
    else if (e.key === "2") answer(1);
    else if (e.key === "3") answer(2);
  });
}

function startGame() {
  const json = engine.start();
  const state = JSON.parse(json);
  renderState(state);
  switchScreen("screen-game");
  $("#overlay-reveal").classList.add("hidden");
  lastTick = performance.now();
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(loop);
}

function loop(now) {
  const delta = now - lastTick;
  lastTick = now;
  const json = engine.tick(delta);
  const state = JSON.parse(json);
  renderState(state);
  if (state.status === "game_over") {
    cancelAnimationFrame(rafId);
    saveHigh(state);
    showGameOver(state, "時間切れ");
    return;
  }
  rafId = requestAnimationFrame(loop);
}

function answer(choice) {
  if (!engine) return;
  const json = engine.answer(choice);
  const state = JSON.parse(json);
  saveHigh(state);
  showReveal(state, () => {
    if (state.status === "game_over") {
      cancelAnimationFrame(rafId);
      showGameOver(state, state.last_correct === false ? "判定ミス" : "時間切れ");
    } else {
      renderState(state);
      lastTick = performance.now();
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(loop);
    }
  });
}

function renderState(state) {
  const r = state.round;
  if (!r) return;
  $("#hud-streak").textContent = String(state.streak);
  $("#hud-score").textContent = String(state.score);
  $("#hud-high").textContent = String(state.high_streak);

  $("#round-flag").textContent = r.currency_flag;
  $("#round-code").textContent = r.currency_code;
  $("#round-currency-name").textContent = r.currency_name;
  $("#item-emoji").textContent = r.item_emoji;
  $("#item-name").textContent = r.item_name_jp;
  $("#price-symbol").textContent = r.currency_symbol;
  $("#price-amount").textContent = formatPrice(r.price_display, r.currency_code);

  // timer
  const frac = Math.max(0, Math.min(1, state.time_remaining_ms / r.time_limit_ms));
  const circumference = 2 * Math.PI * 44;
  $("#timer-arc").setAttribute("stroke-dashoffset", String(circumference * (1 - frac)));
  $("#timer-text").textContent = (state.time_remaining_ms / 1000).toFixed(1);
}

function formatPrice(value, code) {
  // VND/IDR/KRW often huge, use thousands separator
  return Math.round(value).toLocaleString("ja-JP");
}

function showReveal(state, onClose) {
  cancelAnimationFrame(rafId);
  const r = state.round;
  const ov = $("#overlay-reveal");
  const card = $("#reveal-card");
  const verdict = $("#reveal-verdict");
  const correct = state.last_correct === true;
  verdict.textContent = correct ? "正解" : "不正解";
  verdict.className = "reveal-verdict " + (correct ? "correct" : "wrong");
  if (!correct) card.classList.add("shake"); else card.classList.remove("shake");

  $("#reveal-foreign").textContent = `${r.currency_symbol}${formatPrice(r.price_display, r.currency_code)}`;
  $("#reveal-jpy").textContent = `¥${Math.round(r.price_jpy).toLocaleString("ja-JP")}`;
  $("#reveal-ref").textContent = `¥${Math.round(r.item_jpy_ref).toLocaleString("ja-JP")}`;
  $("#reveal-correct").textContent = verdictLabel(r.correct);

  ov.classList.remove("hidden");
  setTimeout(() => {
    ov.classList.add("hidden");
    card.classList.remove("shake");
    onClose();
  }, correct ? 700 : 1500);
}

function verdictLabel(v) {
  switch (v) {
    case "cheap": return "安い";
    case "fair": return "妥当";
    case "expensive": return "高い";
    default: return v;
  }
}

function showGameOver(state, reason) {
  switchScreen("screen-over");
  $("#over-reason").textContent = reason;
  $("#over-streak").textContent = String(state.streak);
  $("#over-score").textContent = String(state.score);
  $("#over-high-streak").textContent = String(state.high_streak);
  $("#over-high-score").textContent = String(state.high_score);
}

boot().catch(err => {
  console.error(err);
  document.body.innerHTML = `<div style="padding:40px; font-family: serif;">起動に失敗しました: ${err.message}</div>`;
});
