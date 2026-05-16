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

const els = {
  pattern: document.getElementById("pattern"),
  enabled: document.getElementById("enabled"),
  position: document.getElementById("position"),
  dot_size: document.getElementById("dot_size"),
  dot_size_val: document.getElementById("dot_size_val"),
  show_label: document.getElementById("show_label"),
  hide_on_fullscreen: document.getElementById("hide_on_fullscreen"),
  hide_on_video: document.getElementById("hide_on_video"),
  reset: document.getElementById("reset-stats"),
  saved: document.getElementById("saved"),
  statsSummary: document.getElementById("stats-summary"),
};

let current = { ...DEFAULTS };
let savedTimer = null;

function flashSaved() {
  els.saved.classList.add("on");
  if (savedTimer) clearTimeout(savedTimer);
  savedTimer = setTimeout(() => els.saved.classList.remove("on"), 1200);
}

function render() {
  els.pattern.value = current.pattern;
  els.enabled.checked = !!current.enabled;
  els.position.value = current.position;
  els.dot_size.value = current.dot_size;
  els.dot_size_val.textContent = current.dot_size;
  els.show_label.checked = !!current.show_label;
  els.hide_on_fullscreen.checked = !!current.hide_on_fullscreen;
  els.hide_on_video.checked = !!current.hide_on_video;
}

function save(patch) {
  current = { ...current, ...patch };
  chrome.storage.local.set({ [SETTINGS_KEY]: current }, flashSaved);
}

els.pattern.addEventListener("change", () => save({ pattern: els.pattern.value }));
els.enabled.addEventListener("change", () => save({ enabled: els.enabled.checked }));
els.position.addEventListener("change", () => save({ position: els.position.value }));
els.dot_size.addEventListener("input", () => {
  const v = Number(els.dot_size.value);
  els.dot_size_val.textContent = v;
  save({ dot_size: v });
});
els.show_label.addEventListener("change", () => save({ show_label: els.show_label.checked }));
els.hide_on_fullscreen.addEventListener("change", () =>
  save({ hide_on_fullscreen: els.hide_on_fullscreen.checked })
);
els.hide_on_video.addEventListener("change", () =>
  save({ hide_on_video: els.hide_on_video.checked })
);

els.reset.addEventListener("click", () => {
  if (!confirm("統計データをすべてリセットします。よろしいですか?")) return;
  chrome.storage.local.set({
    [STATS_KEY]: {
      version: 1,
      sessions: 0,
      cycles: 0,
      by_day: {},
      last_session_ts: null,
    },
  }, () => {
    flashSaved();
    refreshStatsSummary();
  });
});

function refreshStatsSummary() {
  chrome.storage.local.get(STATS_KEY, (res) => {
    const s = res?.[STATS_KEY] ?? { sessions: 0, cycles: 0 };
    els.statsSummary.textContent = `${s.sessions ?? 0} 件のセッション / ${s.cycles ?? 0} サイクル`;
  });
}

chrome.storage.local.get(SETTINGS_KEY, (res) => {
  current = { ...DEFAULTS, ...(res?.[SETTINGS_KEY] ?? {}) };
  render();
});
refreshStatsSummary();
