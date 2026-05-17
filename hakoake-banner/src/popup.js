// Popup — read state from chrome.storage and show current stats + recent banners.

const KEYS = {
  installedAt: "hakoake-banner:installedAt",
  visits:      "hakoake-banner:visits",
  recent:      "hakoake-banner:recent",
};

const PHASE_JP = { fresh: "搬入 直後", settling: "片付け 中", stale: "段ボール 同居", ghost: "段ボール 紀元" };

const DAY_MS = 86_400_000;
function phaseFor(d) {
  if (d <= 6)  return "fresh";
  if (d <= 29) return "settling";
  if (d <= 89) return "stale";
  return "ghost";
}
function computeStats(installedAt, visits, now) {
  const daysSinceMove = Math.max(0, Math.floor((now - installedAt) / DAY_MS));
  const boxesRemaining = Math.round(
    35 + (daysSinceMove * 0.4) - (visits * 1.7)
  );
  return { daysSinceMove, boxesRemaining, phase: phaseFor(daysSinceMove) };
}

function getAll(keys) {
  return new Promise((resolve) =>
    chrome.storage.local.get(keys, (items) => resolve(items || {})));
}
function setAll(obj) {
  return new Promise((resolve) => chrome.storage.local.set(obj, () => resolve()));
}

async function render() {
  const now = Date.now();
  const cur = await getAll([KEYS.installedAt, KEYS.visits, KEYS.recent]);
  const installedAt = Number(cur[KEYS.installedAt] || now);
  const visits = Number(cur[KEYS.visits] || 0);
  const s = computeStats(installedAt, visits, now);

  document.getElementById("days").textContent  = String(s.daysSinceMove);
  document.getElementById("boxes").textContent = String(s.boxesRemaining);
  const tag = document.getElementById("phase-tag");
  tag.textContent = PHASE_JP[s.phase];
  tag.className   = `phase-tag ${s.phase}`;

  const list = document.getElementById("recent-list");
  list.innerHTML = "";
  const recent = Array.isArray(cur[KEYS.recent]) ? cur[KEYS.recent] : [];
  if (recent.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "まだ Hacker News を 開いて いません。";
    list.appendChild(li);
    return;
  }
  for (const item of recent) {
    const li = document.createElement("li");
    const when = new Date(item.at);
    const hh = String(when.getHours()).padStart(2, "0");
    const mm = String(when.getMinutes()).padStart(2, "0");
    li.textContent = `${hh}:${mm}  ${item.text}`;
    list.appendChild(li);
  }
}

document.getElementById("reset").addEventListener("click", async () => {
  const now = Date.now();
  await setAll({
    [KEYS.installedAt]: now,
    [KEYS.visits]: 0,
    [KEYS.recent]: [],
  });
  render();
});

render();
