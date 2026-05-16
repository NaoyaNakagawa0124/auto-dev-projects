// ikitsugi background service worker.
// Receives session-complete messages from content scripts and accumulates stats.

const STATS_KEY = "ikitsugi/stats";

function todayKey(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

function emptyStats() {
  return {
    version: 1,
    sessions: 0,
    cycles: 0,
    by_day: {},
    last_session_ts: null,
  };
}

function recordSession(stats, { duration_sec, cycles, ts }) {
  const t = ts || new Date().toISOString();
  const day = todayKey(new Date(t));
  stats.sessions += 1;
  stats.cycles += cycles;
  stats.last_session_ts = t;
  const d = stats.by_day[day] ?? { sessions: 0, cycles: 0, duration_sec: 0 };
  d.sessions += 1;
  d.cycles += cycles;
  d.duration_sec += duration_sec;
  stats.by_day[day] = d;
  return stats;
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type !== "ikitsugi:session-complete") return;
  chrome.storage.local.get(STATS_KEY, (res) => {
    const stats = res?.[STATS_KEY] ?? emptyStats();
    recordSession(stats, {
      duration_sec: Number(msg.duration_sec) || 0,
      cycles: Number(msg.cycles) || 0,
      ts: msg.ts,
    });
    chrome.storage.local.set({ [STATS_KEY]: stats }, () => sendResponse({ ok: true }));
  });
  return true; // keep sendResponse channel open
});

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get([STATS_KEY, "ikitsugi/settings"], (res) => {
    const patch = {};
    if (!res[STATS_KEY]) patch[STATS_KEY] = emptyStats();
    if (!res["ikitsugi/settings"]) {
      patch["ikitsugi/settings"] = {
        pattern: "f448",
        enabled: true,
        position: "bottom-right",
        dot_size: 28,
        hide_on_fullscreen: true,
        hide_on_video: true,
        show_label: false,
      };
    }
    if (Object.keys(patch).length) chrome.storage.local.set(patch);
  });
});
