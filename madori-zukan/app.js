// 間取り図鑑 — エントリ
import { renderFloorplan, calcGeometry, totalSqm } from "./modules/floorplan.js";
import { Archive } from "./modules/store.js";

const state = {
  homes: [],
  archive: new Archive(),
  view: "catalog",
  selectedHome: null,
  filters: { watchedOnly: false, favoriteOnly: false, era: "" },
};

async function loadHomes() {
  const r = await fetch("./data/homes.json");
  if (!r.ok) throw new Error("物件データの読み込みに失敗");
  const d = await r.json();
  return d.homes;
}

async function init() {
  state.homes = await loadHomes();
  state.archive.load();
  bindTabs();
  bindFilters();
  bindDetailActions();
  renderCatalog();
  renderArchive();
}

function bindTabs() {
  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      const v = btn.dataset.view;
      document.querySelectorAll(".tab").forEach(b => b.classList.toggle("is-active", b === btn));
      switchView(v);
    });
  });
}

function switchView(name) {
  state.view = name;
  document.querySelectorAll(".view").forEach(s => s.hidden = true);
  const target = document.getElementById(`view-${name}`);
  if (target) target.hidden = false;
  if (name === "archive") renderArchive();
  if (name === "catalog") renderCatalog();
}

function bindFilters() {
  document.getElementById("filter-watched").addEventListener("change", e => {
    state.filters.watchedOnly = e.target.checked;
    renderCatalog();
  });
  document.getElementById("filter-favorite").addEventListener("change", e => {
    state.filters.favoriteOnly = e.target.checked;
    renderCatalog();
  });
  document.getElementById("filter-era").addEventListener("change", e => {
    state.filters.era = e.target.value;
    renderCatalog();
  });
}

function applyFilters(homes) {
  return homes.filter(h => {
    if (state.filters.watchedOnly && !state.archive.isWatched(h.id)) return false;
    if (state.filters.favoriteOnly && !state.archive.isFavorite(h.id)) return false;
    if (state.filters.era) {
      if (state.filters.era === "その他") {
        const hasEra = (h.tags ?? []).some(t => ["大正", "昭和", "平成", "令和"].includes(t));
        if (hasEra) return false;
      } else {
        if (!(h.tags ?? []).includes(state.filters.era)) return false;
      }
    }
    return true;
  });
}

function renderCatalog() {
  const grid = document.getElementById("home-grid");
  const empty = document.getElementById("home-empty");
  const list = applyFilters(state.homes);
  grid.innerHTML = "";
  if (list.length === 0) {
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");
  for (const h of list) {
    grid.appendChild(renderHomeCard(h));
  }
}

function renderHomeCard(home, mini = false) {
  const card = document.createElement("article");
  card.className = "home-card" + (mini ? " mini" : "");
  card.tabIndex = 0;

  const thumbSvg = renderFloorplan(home, { scale: 12, showAnnotations: false });
  const badges = [];
  if (state.archive.isWatched(home.id)) badges.push(`<span class="badge">✓ 観了</span>`);
  if (state.archive.isFavorite(home.id)) badges.push(`<span class="badge fav">★ お気に入り</span>`);

  card.innerHTML = `
    <div class="badges">${badges.join("")}</div>
    <div class="thumb">${thumbSvg}</div>
    <div class="body">
      <div class="title-row">
        <h3>${escapeHtml(home.title)}</h3>
        <span class="show">${escapeHtml(home.show)}</span>
      </div>
      <div class="meta-row">
        <span>${escapeHtml(home.style)}</span>
        <span>${home.total_sqm}㎡</span>
        <span>${home.rooms.length}室</span>
      </div>
      <div class="tags">
        ${(home.tags ?? []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
      </div>
    </div>
  `;
  card.addEventListener("click", () => openDetail(home.id));
  card.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openDetail(home.id); }
  });
  return card;
}

function openDetail(id) {
  const home = state.homes.find(h => h.id === id);
  if (!home) return;
  state.selectedHome = home;
  renderDetail(home);
  document.querySelectorAll(".tab").forEach(b => b.classList.remove("is-active"));
  switchView("detail");
}

function renderDetail(home) {
  document.getElementById("detail-title").textContent = home.title;
  document.getElementById("detail-show").textContent = `『${home.show}』より`;

  const planWrap = document.getElementById("plan-wrap");
  planWrap.innerHTML = renderFloorplan(home, { scale: 26, showAnnotations: true });

  const table = document.getElementById("detail-table");
  table.innerHTML = `
    <dt>住所</dt><dd>${escapeHtml(home.address)}</dd>
    <dt>築年</dt><dd>${escapeHtml(home.year)}</dd>
    <dt>様式</dt><dd>${escapeHtml(home.style)}</dd>
    <dt>延床面積</dt><dd>${home.total_sqm} ㎡</dd>
    <dt>部屋数</dt><dd>${home.rooms.length} 室</dd>
  `;

  document.getElementById("detail-summary").textContent = home.summary;

  const charsEl = document.getElementById("detail-characters");
  charsEl.innerHTML = (home.characters ?? []).map(c => `<li>${escapeHtml(c)}</li>`).join("");

  const scenes = home.rooms.filter(r => r.scene);
  const scenesEl = document.getElementById("detail-scenes");
  scenesEl.innerHTML = scenes.length === 0
    ? `<li class="muted">この物件にはまだ場面が紐づけられていません。</li>`
    : scenes.map(r => `
        <li>
          <span class="scene-room">${escapeHtml(r.name)} (${r.floor}F)</span>
          <span>${escapeHtml(r.scene)}</span>
        </li>
      `).join("");

  // SVG room hover - selecting
  planWrap.querySelectorAll(".room").forEach(g => {
    g.addEventListener("click", () => {
      const roomName = g.dataset.room;
      const floor = g.dataset.floor;
      planWrap.querySelectorAll(".room.is-selected").forEach(el => el.classList.remove("is-selected"));
      g.classList.add("is-selected");
      const room = home.rooms.find(r => r.name === roomName && String(r.floor) === floor);
      if (room?.scene) {
        toast(`${roomName} — ${room.scene}`);
      } else if (room) {
        toast(`${roomName} (${(room.w * room.h).toFixed(0)}㎡)`);
      }
    });
  });

  const wBtn = document.getElementById("toggle-watched");
  const fBtn = document.getElementById("toggle-favorite");
  updateDetailButtons(home);
  wBtn.onclick = () => {
    const on = state.archive.toggleWatched(home.id);
    state.archive.save();
    updateDetailButtons(home);
    toast(on ? `「${home.title}」をアーカイブに追加しました` : `観了から外しました`, on ? "accent" : "");
    renderCatalog();
  };
  fBtn.onclick = () => {
    const on = state.archive.toggleFavorite(home.id);
    state.archive.save();
    updateDetailButtons(home);
    toast(on ? `「${home.title}」をお気に入り登録` : `お気に入りを外しました`, on ? "seal" : "");
    renderCatalog();
  };
}

function updateDetailButtons(home) {
  const wBtn = document.getElementById("toggle-watched");
  const fBtn = document.getElementById("toggle-favorite");
  const watched = state.archive.isWatched(home.id);
  const fav = state.archive.isFavorite(home.id);
  wBtn.textContent = watched ? "✓ 観了済み" : "観了に追加";
  wBtn.classList.toggle("is-on", watched);
  fBtn.textContent = fav ? "★ お気に入り" : "☆ お気に入り";
  fBtn.classList.toggle("is-on", fav);
}

function bindDetailActions() {
  document.getElementById("back-btn").addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => {
      b.classList.toggle("is-active", b.dataset.view === "catalog");
    });
    switchView("catalog");
  });
}

function renderArchive() {
  const stats = state.archive.stats(state.homes);
  const cards = document.getElementById("stat-cards");
  cards.innerHTML = `
    <div class="stat-card">
      <div class="num">${stats.watched_count}</div>
      <div class="label">観了済み物件</div>
      <div class="sub">/ 全 ${stats.total_homes} 件</div>
    </div>
    <div class="stat-card">
      <div class="num">${stats.favorite_count}</div>
      <div class="label">★お気に入り</div>
    </div>
    <div class="stat-card">
      <div class="num">${stats.total_sqm}</div>
      <div class="label">記録延床面積 (㎡)</div>
      <div class="sub">≒ ${(stats.total_sqm / TATAMI).toFixed(1)} 畳</div>
    </div>
    <div class="stat-card">
      <div class="num">${Object.keys(stats.eras).length}</div>
      <div class="label">記録された時代</div>
      <div class="sub">${Object.entries(stats.eras).map(([e, n]) => `${e}:${n}`).join(" / ") || "—"}</div>
    </div>
  `;
  const grid = document.getElementById("watched-grid");
  const empty = document.getElementById("watched-empty");
  grid.innerHTML = "";
  const watched = state.homes.filter(h => state.archive.isWatched(h.id));
  if (watched.length === 0) {
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");
  for (const h of watched) {
    grid.appendChild(renderHomeCard(h, true));
  }
}

const TATAMI = 1.62;

// === utility ===
function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

let toastTimer = null;
function toast(message, variant = "") {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.className = "toast " + variant;
  el.classList.remove("hidden");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add("hidden"), 2400);
}

init().catch(err => {
  console.error(err);
  document.body.innerHTML = `<div style="padding:40px; font-family:serif;">起動に失敗しました: ${escapeHtml(err.message)}</div>`;
});
