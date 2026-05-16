import init, {
  vignette_for,
  motif_svg,
  available_mds,
  next_md_after,
  prev_md_before,
} from "./pkg/hibi_no_mukashi.js";

const REFLECT_PREFIX = "hibi:reflect:";

const $ = (sel) => document.querySelector(sel);

let currentMd = null;       // "MM-DD"
let currentYearShown = null; // u16 (from the vignette currently displayed)

function fmtToday(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return { iso: `${y}-${m}-${d}`, jp: `${y} 年 ${parseInt(m,10)} 月 ${parseInt(d,10)} 日`, mmdd: `${m}-${d}` };
}

function mdToIso(md, year = new Date().getFullYear()) {
  return `${year}-${md.slice(0, 2)}-${md.slice(3, 5)}`;
}

function setMotif(motifId) {
  const svg = $("#vignette-motif").querySelector("svg");
  svg.innerHTML = motif_svg(motifId);
}

function showVignette(selectionObj) {
  const v = selectionObj.vignette;
  $("#vignette-year").textContent = `${v.year} 年`;
  $("#vignette-title").textContent = v.title;
  $("#vignette-body").textContent = v.body;
  setMotif(v.motif);
  const nearbyEl = $("#vignette-nearby");
  nearbyEl.hidden = !selectionObj.is_nearby;
  if (selectionObj.is_nearby) {
    nearbyEl.textContent = `(${selectionObj.requested_md.replace("-", "/")} に近い日: ${v.date_md.replace("-", "/")} の話)`;
  }
  // restore reflection if any
  const stored = localStorage.getItem(REFLECT_PREFIX + selectionObj.requested_md);
  $("#reflect-input").value = stored ?? "";
  $("#reflect-saved").hidden = true;

  currentMd = selectionObj.requested_md;
  currentYearShown = v.year;
}

function loadFor(iso) {
  try {
    const sel = vignette_for(iso);
    showVignette(sel);
  } catch (e) {
    console.warn("vignette load failed", e);
  }
}

function loadForMd(md, year = new Date().getFullYear()) {
  loadFor(mdToIso(md, year));
}

function gotoToday() {
  const today = fmtToday();
  $("#today-iso").textContent = today.jp;
  loadFor(today.iso);
}

function gotoNext() {
  if (!currentMd) return;
  const next = next_md_after(currentMd);
  if (next) loadForMd(next);
}

function gotoPrev() {
  if (!currentMd) return;
  const prev = prev_md_before(currentMd);
  if (prev) loadForMd(prev);
}

// ---- Reflections ----

let saveTimer = null;
function handleReflectInput() {
  if (!currentMd) return;
  const value = $("#reflect-input").value.trim();
  const key = REFLECT_PREFIX + currentMd;
  if (value) localStorage.setItem(key, value);
  else localStorage.removeItem(key);
  if (saveTimer) clearTimeout(saveTimer);
  $("#reflect-saved").hidden = !value;
  if (value) {
    $("#reflect-saved").textContent = "保存しました";
    saveTimer = setTimeout(() => { $("#reflect-saved").hidden = true; }, 1500);
  }
  renderJournal();
}

function renderJournal() {
  const list = $("#journal-list");
  list.innerHTML = "";
  const entries = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k || !k.startsWith(REFLECT_PREFIX)) continue;
    const md = k.slice(REFLECT_PREFIX.length);
    const body = localStorage.getItem(k);
    if (body) entries.push({ md, body });
  }
  // sort by MM-DD
  entries.sort((a, b) => (a.md < b.md ? -1 : 1));
  for (const e of entries) {
    const li = document.createElement("li");
    li.innerHTML = `<span class="jdate">${e.md.replace("-", "/")}</span><span class="jbody"></span>`;
    li.querySelector(".jbody").textContent = e.body;
    list.appendChild(li);
  }
}

function toggleJournal() {
  const j = $("#journal");
  j.hidden = !j.hidden;
  $("#journal-toggle").textContent = j.hidden ? "最近の思いを見る" : "最近の思いを閉じる";
  if (!j.hidden) renderJournal();
}

// ---- Boot ----

async function boot() {
  try {
    await init();
  } catch (e) {
    console.error("WASM init failed", e);
    document.body.innerHTML = "<p style='padding:40px'>このページは WASM に対応したブラウザでお開きください。</p>";
    return;
  }
  $("#app").classList.remove("loading");
  gotoToday();

  $("#today-btn").addEventListener("click", gotoToday);
  $("#next-btn").addEventListener("click", gotoNext);
  $("#prev-btn").addEventListener("click", gotoPrev);
  $("#reflect-input").addEventListener("input", handleReflectInput);
  $("#journal-toggle").addEventListener("click", toggleJournal);

  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT") return;
    if (e.key === "ArrowLeft")  gotoPrev();
    if (e.key === "ArrowRight") gotoNext();
    if (e.key === "h")          gotoToday();
  });
}

boot();
