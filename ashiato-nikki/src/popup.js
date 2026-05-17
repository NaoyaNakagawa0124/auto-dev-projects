// Popup script. ES modules don't work in MV3 popup scripts without explicit
// `type="module"` on the <script> AND a build step — instead we inline our
// dependencies the same way we do for content scripts. The unit-tested
// versions live in src/storage.js, src/dates.js, etc.

const KEY = "ashiato-nikki:entries";

// --- inlined helpers ---
function todayIso(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function shortId() {
  const t = Date.now().toString(36);
  const r = Math.floor(Math.random() * 36 ** 6).toString(36).padStart(6, "0");
  return `${t}-${r}`;
}
function makeEntry({ url, title = "", note = "", at, id } = {}) {
  if (typeof url !== "string" || url.length === 0) throw new Error("url required");
  if (url.length > 2048) throw new Error("url too long");
  title = String(title || "").slice(0, 300);
  note  = String(note  || "").slice(0, 200);
  const atTime = at instanceof Date ? at : new Date(at || Date.now());
  return {
    id: id || shortId(), url, title, note,
    dateIso: todayIso(atTime),
    at: atTime.toISOString(),
  };
}
function isValidEntry(e) {
  return !!(e && typeof e === "object"
    && typeof e.id === "string" && e.id
    && typeof e.url === "string" && e.url
    && typeof e.title === "string"
    && typeof e.note === "string"
    && typeof e.dateIso === "string" && /^\d{4}-\d{2}-\d{2}$/.test(e.dateIso)
    && typeof e.at === "string" && !Number.isNaN(Date.parse(e.at)));
}

function getAll() {
  return new Promise((res) => chrome.storage.local.get(KEY, (items) => res(items[KEY] || [])));
}
function saveAll(entries) {
  return new Promise((res) => chrome.storage.local.set({ [KEY]: entries }, () => res()));
}

async function getCurrentTab() {
  const [tab] = await new Promise((res) =>
    chrome.tabs.query({ active: true, currentWindow: true }, res));
  return tab || null;
}

function formatTimeFromIso(iso) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

// --- UI plumbing ---
const $ = (sel) => document.querySelector(sel);

let currentTab = null;

async function refreshTodayList() {
  const all = (await getAll()).filter(isValidEntry);
  const today = todayIso();
  const todays = all.filter((e) => e.dateIso === today);
  const list = $("#entries-list");
  list.innerHTML = "";
  $("#today-count").textContent = String(todays.length);
  $("#today-label").textContent = `— ${today} の 今日 —`;
  if (todays.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "まだ 何 も 残して いません。";
    list.appendChild(li);
    return;
  }
  // Newest first; cap to most-recent 8 for the popup.
  todays.sort((a, b) => b.at.localeCompare(a.at));
  for (const e of todays.slice(0, 8)) {
    const li = document.createElement("li");
    const time = document.createElement("div");
    time.className = "entry-time";
    time.textContent = formatTimeFromIso(e.at);
    const title = document.createElement("div");
    title.className = "entry-title";
    title.textContent = e.title || e.url;
    title.title = e.url;
    li.appendChild(time);
    li.appendChild(title);
    if (e.note) {
      const note = document.createElement("div");
      note.className = "entry-note";
      note.textContent = e.note;
      li.appendChild(note);
    }
    const rm = document.createElement("button");
    rm.className = "entry-remove";
    rm.textContent = "削除";
    rm.addEventListener("click", async () => {
      const arr = (await getAll()).filter((x) => x.id !== e.id);
      await saveAll(arr);
      refreshTodayList();
    });
    li.appendChild(rm);
    list.appendChild(li);
  }
}

async function captureCurrentPage() {
  const tab = currentTab;
  if (!tab || !tab.url) {
    $("#status").textContent = "ページ 情報 が 取れません でした。";
    return;
  }
  const note = $("#note-input").value.trim();
  let entry;
  try {
    entry = makeEntry({ url: tab.url, title: tab.title || "", note });
  } catch (err) {
    $("#status").textContent = `保存 できません でした (${err.message})`;
    return;
  }
  const arr = await getAll();
  arr.unshift(entry);
  await saveAll(arr);
  $("#status").textContent = "足跡 に 残し ました。";
  $("#note-input").value = "";
  refreshTodayList();
  setTimeout(() => { $("#status").textContent = ""; }, 1800);
}

async function init() {
  currentTab = await getCurrentTab();
  if (currentTab) {
    $("#capture-title").textContent = currentTab.title || "(無題)";
    $("#capture-url").textContent   = currentTab.url   || "";
  } else {
    $("#capture-title").textContent = "(ページ 情報 を 取得 できません でした)";
    $("#add-btn").disabled = true;
  }
  await refreshTodayList();

  $("#add-btn").addEventListener("click", captureCurrentPage);
  $("#open-options").addEventListener("click", () => {
    if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
  });

  // ⌘/Ctrl + Enter to save quickly.
  $("#note-input").addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      captureCurrentPage();
    }
  });
}

init();
