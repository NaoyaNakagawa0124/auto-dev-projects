// Options page — timeline of all footprints + export.

const KEY = "ashiato-nikki:entries";

function isValidEntry(e) {
  return !!(e && typeof e === "object"
    && typeof e.id === "string" && e.id
    && typeof e.url === "string" && e.url
    && typeof e.title === "string"
    && typeof e.note === "string"
    && typeof e.dateIso === "string" && /^\d{4}-\d{2}-\d{2}$/.test(e.dateIso)
    && typeof e.at === "string" && !Number.isNaN(Date.parse(e.at)));
}
function monthIsoOf(dateIso) { return dateIso.slice(0, 7); }

function groupByMonth(entries) {
  const map = new Map();
  for (const e of entries) {
    const m = monthIsoOf(e.dateIso);
    if (!map.has(m)) map.set(m, []);
    map.get(m).push(e);
  }
  return new Map([...map.entries()].sort((a, b) => b[0].localeCompare(a[0])));
}
function groupByDay(entries) {
  const map = new Map();
  for (const e of entries) {
    const d = e.dateIso;
    if (!map.has(d)) map.set(d, []);
    map.get(d).push(e);
  }
  for (const list of map.values()) list.sort((a, b) => b.at.localeCompare(a.at));
  return new Map([...map.entries()].sort((a, b) => b[0].localeCompare(a[0])));
}
function search(entries, query) {
  if (!query || !query.trim()) return entries;
  const q = query.trim().toLowerCase();
  return entries.filter((e) =>
    e.title.toLowerCase().includes(q) ||
    e.url.toLowerCase().includes(q) ||
    e.note.toLowerCase().includes(q));
}
function escapeMarkdown(s) {
  return s.replace(/\\/g, "\\\\").replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\n/g, " ");
}
function toJson(entries) { return JSON.stringify({ version: 1, entries }, null, 2); }
function toMarkdown(entries) {
  if (!entries || entries.length === 0) return "# 足跡日記\n\n(まだ 足跡 が ありません)\n";
  const out = ["# 足跡日記", ""];
  for (const [month, monthEntries] of groupByMonth(entries)) {
    out.push(`## ${month}`); out.push("");
    for (const [day, dayEntries] of groupByDay(monthEntries)) {
      out.push(`### ${day}`); out.push("");
      for (const e of dayEntries) {
        const time = e.at.slice(11, 16);
        const title = e.title || "(無題)";
        const note = e.note ? `  \n${e.note}` : "";
        out.push(`- ${time}  [${escapeMarkdown(title)}](${e.url})${note}`);
      }
      out.push("");
    }
  }
  return out.join("\n");
}

function getAll() {
  return new Promise((res) => chrome.storage.local.get(KEY, (items) => res(items[KEY] || [])));
}
function saveAll(entries) {
  return new Promise((res) => chrome.storage.local.set({ [KEY]: entries }, () => res()));
}

const $ = (sel) => document.querySelector(sel);

let allEntries = [];

function timeOf(iso) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function renderEntry(e) {
  const li = document.createElement("li");
  const time = document.createElement("span");
  time.className = "entry-time";
  time.textContent = timeOf(e.at);
  const main = document.createElement("div");
  main.className = "entry-main";
  const titleWrap = document.createElement("p");
  titleWrap.className = "entry-title";
  const a = document.createElement("a");
  a.href = e.url; a.target = "_blank"; a.rel = "noopener noreferrer";
  a.textContent = e.title || "(無題)";
  titleWrap.appendChild(a);
  const urlEl = document.createElement("div");
  urlEl.className = "entry-url";
  urlEl.textContent = e.url;
  main.appendChild(titleWrap);
  main.appendChild(urlEl);
  if (e.note) {
    const note = document.createElement("div");
    note.className = "entry-note";
    note.textContent = e.note;
    main.appendChild(note);
  }
  const rm = document.createElement("button");
  rm.className = "entry-remove";
  rm.textContent = "削除";
  rm.addEventListener("click", async () => {
    allEntries = allEntries.filter((x) => x.id !== e.id);
    await saveAll(allEntries);
    renderTimeline();
  });

  li.appendChild(time);
  li.appendChild(main);
  li.appendChild(rm);
  return li;
}

function renderTimeline() {
  const query = $("#search-box").value;
  const filtered = search(allEntries, query);
  $("#total-count").textContent = String(filtered.length);

  const host = $("#timeline");
  host.innerHTML = "";
  if (filtered.length === 0) {
    const p = document.createElement("p");
    p.className = "dim empty";
    p.textContent = query.trim()
      ? `「${query}」 に 一致 する 足跡 は ありません。`
      : "まだ 足跡 が ありません。";
    host.appendChild(p);
    return;
  }
  const months = groupByMonth(filtered);
  for (const [month, monthEntries] of months) {
    const section = document.createElement("section");
    section.className = "month";
    const h2 = document.createElement("h2");
    h2.textContent = month;
    section.appendChild(h2);
    const days = groupByDay(monthEntries);
    for (const [day, dayEntries] of days) {
      const dayDiv = document.createElement("div");
      dayDiv.className = "day";
      const h3 = document.createElement("h3");
      h3.textContent = day;
      dayDiv.appendChild(h3);
      const ul = document.createElement("ul");
      ul.className = "entry-list";
      for (const e of dayEntries) ul.appendChild(renderEntry(e));
      dayDiv.appendChild(ul);
      section.appendChild(dayDiv);
    }
    host.appendChild(section);
  }
}

function downloadBlob(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function init() {
  allEntries = (await getAll()).filter(isValidEntry);
  $("#search-box").addEventListener("input", renderTimeline);
  $("#export-json").addEventListener("click", () => {
    downloadBlob("ashiato-nikki.json", toJson(allEntries), "application/json");
  });
  $("#export-md").addEventListener("click", () => {
    downloadBlob("ashiato-nikki.md", toMarkdown(allEntries), "text/markdown");
  });
  $("#clear-all").addEventListener("click", async () => {
    if (!confirm("全部 の 足跡 を 消去 します。 元 に 戻せません。 続け ます か?")) return;
    allEntries = [];
    await saveAll([]);
    renderTimeline();
  });
  renderTimeline();
}

init();
