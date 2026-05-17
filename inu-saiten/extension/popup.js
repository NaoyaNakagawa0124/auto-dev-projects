const DOGS = [
  { id: "pochi", name: "お利口 ポチ", sub: "ボーダー コリー / 几帳面 で 厳しい" },
  { id: "maro", name: "シニア マロ", sub: "柴犬 / 達観 して 中央 値" },
  { id: "taro", name: "ヤンチャ タロウ", sub: "プードル / 全肯定 で 甘い" },
  { id: "john", name: "哲学者 ジョン", sub: "ラブラドール / 内省 的" },
];

const SETTINGS_KEY = "inu-saiten:settings";
const HISTORY_KEY = "inu-saiten:history";

function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get([SETTINGS_KEY], (res) => {
      resolve(res[SETTINGS_KEY] || { dog: "pochi", enabled: true });
    });
  });
}

function saveSettings(s) {
  chrome.storage.local.set({ [SETTINGS_KEY]: s });
}

function loadHistory() {
  return new Promise((resolve) => {
    chrome.storage.local.get([HISTORY_KEY], (res) => {
      resolve(res[HISTORY_KEY] || []);
    });
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderDogs(currentId) {
  const root = document.getElementById("dog-list");
  root.innerHTML = "";
  for (const d of DOGS) {
    const div = document.createElement("button");
    div.type = "button";
    div.className = "dog-card";
    div.dataset.dogId = d.id;
    div.dataset.selected = d.id === currentId ? "true" : "false";
    div.innerHTML = `<div class="dog-name">${escapeHtml(d.name)}</div><div class="dog-sub">${escapeHtml(d.sub)}</div>`;
    div.addEventListener("click", async () => {
      const s = await loadSettings();
      s.dog = d.id;
      saveSettings(s);
      renderDogs(d.id);
    });
    root.appendChild(div);
  }
}

function renderHistory(items) {
  const list = document.getElementById("history-list");
  list.innerHTML = "";
  if (!items.length) {
    list.innerHTML = `<li class="history-empty">まだ 採点 した レシピ は ありません。</li>`;
    return;
  }
  for (const item of items.slice(0, 10)) {
    const li = document.createElement("li");
    const star = "★".repeat(starsFromScore(item.score));
    const date = new Date(item.timestamp);
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
    li.innerHTML = `
      <div class="history-title">${escapeHtml(item.title || item.url)}</div>
      <div class="history-meta">
        <span>${dateStr}</span>
        <span class="history-score">${star}  ${item.score}</span>
      </div>`;
    list.appendChild(li);
  }
}

function starsFromScore(s) {
  if (s >= 90) return 5;
  if (s >= 75) return 4;
  if (s >= 55) return 3;
  if (s >= 35) return 2;
  return 1;
}

async function init() {
  const settings = await loadSettings();
  renderDogs(settings.dog);
  document.getElementById("toggle-enabled").checked = settings.enabled !== false;
  document.getElementById("toggle-enabled").addEventListener("change", async (e) => {
    const s = await loadSettings();
    s.enabled = e.target.checked;
    saveSettings(s);
  });
  const hist = await loadHistory();
  renderHistory(hist);
}

init();
