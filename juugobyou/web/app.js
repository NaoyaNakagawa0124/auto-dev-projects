import init, {
  prompt,
  farewell,
  voices,
  total_prompts,
} from "./pkg/juugobyou.js";

const COUNTER_KEY = "juugobyou:counter";
const VOICE_KEY = "juugobyou:voice";

const $ = (sel) => document.querySelector(sel);

let currentVoice = "quiet";
let touchToday = 0;
let totalPrompts = 1;
let runTimers = [];

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function loadCounter() {
  try {
    const raw = localStorage.getItem(COUNTER_KEY);
    if (!raw) return 0;
    const obj = JSON.parse(raw);
    if (obj.date === todayIso()) return obj.count | 0;
    return 0;
  } catch { return 0; }
}

function saveCounter(n) {
  localStorage.setItem(COUNTER_KEY, JSON.stringify({ date: todayIso(), count: n }));
}

function renderCounter() {
  const el = $("#counter");
  if (touchToday === 0) {
    el.textContent = "きょう、 まだ・・";
  } else {
    el.textContent = `きょう、 ${touchToday} 回さわった`;
  }
}

function loadVoice() {
  return localStorage.getItem(VOICE_KEY) || "quiet";
}
function saveVoice(v) { localStorage.setItem(VOICE_KEY, v); }

function setState(s) {
  const app = $("#app");
  app.classList.remove("state-idle", "state-counting", "state-fading");
  app.classList.add(`state-${s}`);
}

function clearRunTimers() {
  for (const t of runTimers) clearTimeout(t);
  runTimers = [];
}

function startTouch() {
  if ($("#app").classList.contains("state-counting")) return;
  clearRunTimers();

  // Pick prompt deterministically: tap index = total touches today (so it cycles).
  const index = touchToday % totalPrompts;
  const line = prompt(index, currentVoice);
  $("#prompt-text").textContent = line;
  $("#farewell-text").textContent = "";

  $("#big-btn").disabled = true;
  setState("counting");

  // Re-trigger the CSS animation by toggling a class via reflow
  const fill = $(".ring-fill");
  fill.getBoundingClientRect();

  runTimers.push(setTimeout(() => {
    // Fade phase
    setState("fading");
    $("#prompt-text").textContent = "";
    $("#farewell-text").textContent = farewell(currentVoice);
    touchToday += 1;
    saveCounter(touchToday);
    renderCounter();
  }, 15_000));

  runTimers.push(setTimeout(() => {
    setState("idle");
    $("#big-btn").disabled = false;
    $("#farewell-text").textContent = "";
  }, 19_000));
}

function setVoice(v) {
  currentVoice = v;
  saveVoice(v);
  document.querySelectorAll(".voice-btn").forEach(b => {
    b.classList.toggle("on", b.dataset.voice === v);
  });
}

async function boot() {
  try {
    await init();
  } catch (e) {
    console.error("WASM init failed", e);
    document.body.innerHTML =
      "<p style='padding:40px;font-family:sans-serif'>このページは WASM に対応したブラウザで開いてください。</p>";
    return;
  }

  totalPrompts = total_prompts();
  touchToday = loadCounter();
  renderCounter();

  setVoice(loadVoice());
  setState("idle");

  $("#big-btn").addEventListener("click", startTouch);
  document.querySelectorAll(".voice-btn").forEach(b => {
    b.addEventListener("click", () => setVoice(b.dataset.voice));
  });

  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT") return;
    if (e.code === "Space" || e.key === "Enter") {
      e.preventDefault();
      if (!$("#big-btn").disabled) startTouch();
    }
  });
}

boot();
