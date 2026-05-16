const SETTINGS_KEY = "ikitsugi/settings";
const STATS_KEY = "ikitsugi/stats";

const DEFAULTS = {
  pattern: "f448",
  enabled: true,
  position: "bottom-right",
  dot_size: 28,
  hide_on_fullscreen: true,
  hide_on_video: true,
  show_label: false,
};

function todayKey(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

function streak(stats, now = new Date()) {
  let day = new Date(now);
  let s = 0;
  while (true) {
    const k = day.toISOString().slice(0, 10);
    const d = stats.by_day?.[k];
    if (!d || d.sessions === 0) break;
    s += 1;
    day.setUTCDate(day.getUTCDate() - 1);
  }
  return s;
}

const $patterns = document.getElementById("patterns");
const $enabled = document.getElementById("enabled");
const $now = document.getElementById("now");
const $numToday = document.getElementById("num-today");
const $numStreak = document.getElementById("num-streak");
const $totalCycles = document.getElementById("total-cycles");
const $openOptions = document.getElementById("open-options");

let current = { ...DEFAULTS };

function renderPatterns() {
  for (const btn of $patterns.querySelectorAll("button")) {
    btn.classList.toggle("on", btn.dataset.p === current.pattern);
  }
}
function renderEnabled() {
  $enabled.checked = !!current.enabled;
}

function renderStats(stats) {
  const k = todayKey();
  const today = stats.by_day?.[k]?.sessions ?? 0;
  $numToday.textContent = String(today);
  $numStreak.textContent = String(streak(stats));
  $totalCycles.textContent = `合計 ${stats.cycles ?? 0} サイクル`;
}

function save(patch) {
  current = { ...current, ...patch };
  chrome.storage.local.set({ [SETTINGS_KEY]: current });
  renderPatterns();
  renderEnabled();
}

$patterns.addEventListener("click", (e) => {
  const t = e.target.closest("button");
  if (!t) return;
  save({ pattern: t.dataset.p });
});

$enabled.addEventListener("change", () => save({ enabled: $enabled.checked }));

$now.addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, { type: "ikitsugi:start-session" });
      window.close();
    }
  } catch (e) {
    /* tab closed or no permission */
  }
});

$openOptions.addEventListener("click", (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

chrome.storage.local.get([SETTINGS_KEY, STATS_KEY], (res) => {
  current = { ...DEFAULTS, ...(res?.[SETTINGS_KEY] ?? {}) };
  renderPatterns();
  renderEnabled();
  renderStats(res?.[STATS_KEY] ?? { sessions: 0, cycles: 0, by_day: {} });
});
