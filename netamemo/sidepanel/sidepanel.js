// sidepanel.js — Side panel logic (same as popup but with quick-add from current page)
import { CATEGORIES, RATING_LABELS, createIdea } from "../shared/data.js";
import { getIdeas, saveIdea, updateIdea, deleteIdea, getSettings, saveSettings, setIdeas } from "../shared/storage.js";
import { exportBoard, importBoard, mergeBoards } from "../shared/sharing.js";

let currentCategory = "all";
let currentSort = "newest";
let searchQuery = "";
let username = "";

document.addEventListener("DOMContentLoaded", async () => {
  await loadSettings();
  setupTabs();
  setupSearch();
  setupFilters();
  setupAddForm();
  setupShareTab();
  setupEditModal();
  setupQuickAdd();
  setupSliders();
  await renderIdeas();
});

async function loadSettings() {
  const settings = await getSettings();
  username = settings.username || "";
  document.getElementById("username-input").value = username;
  document.getElementById("username-input").addEventListener("change", async (e) => {
    username = e.target.value.trim();
    await saveSettings({ username });
  });
}

function setupTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(`tab-${tab.dataset.tab}`).classList.add("active");
      if (tab.dataset.tab === "list") renderIdeas();
      if (tab.dataset.tab === "share") renderVoteResults();
    });
  });
}

function setupSearch() {
  document.getElementById("search-input").addEventListener("input", (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderIdeas();
  });
}

function setupFilters() {
  document.querySelectorAll(".pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      currentCategory = pill.dataset.cat;
      renderIdeas();
    });
  });
  document.getElementById("sort-select").addEventListener("change", (e) => {
    currentSort = e.target.value;
    renderIdeas();
  });
}

async function renderIdeas() {
  const ideas = await getIdeas();
  let filtered = [...ideas];

  if (searchQuery) {
    filtered = filtered.filter(
      (i) =>
        i.title.toLowerCase().includes(searchQuery) ||
        i.description.toLowerCase().includes(searchQuery) ||
        (i.url && i.url.toLowerCase().includes(searchQuery))
    );
  }
  if (currentCategory !== "all") {
    filtered = filtered.filter((i) => i.category === currentCategory);
  }
  filtered = sortIdeas(filtered, currentSort);

  const list = document.getElementById("ideas-list");
  const empty = document.getElementById("empty-state");

  if (filtered.length === 0) {
    list.innerHTML = "";
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";
  list.innerHTML = filtered.map(renderIdeaCard).join("");

  list.querySelectorAll("[data-vote]").forEach((btn) => {
    btn.addEventListener("click", () => handleVote(btn.dataset.id, btn.dataset.vote));
  });
  list.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => openEditModal(btn.dataset.edit));
  });
  list.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => handleDelete(btn.dataset.delete));
  });
}

function sortIdeas(ideas, sort) {
  switch (sort) {
    case "newest": return ideas.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case "potential": return ideas.sort((a, b) => (b.ratings?.potential || 0) - (a.ratings?.potential || 0));
    case "votes": return ideas.sort((a, b) => {
      const sA = (a.votes?.up?.length || 0) - (a.votes?.down?.length || 0);
      const sB = (b.votes?.up?.length || 0) - (b.votes?.down?.length || 0);
      return sB - sA;
    });
    case "trend": return ideas.sort((a, b) => (b.ratings?.trend || 0) - (a.ratings?.trend || 0));
    default: return ideas;
  }
}

function renderIdeaCard(idea) {
  const cat = CATEGORIES[idea.category] || CATEGORIES.other;
  const upCount = idea.votes?.up?.length || 0;
  const downCount = idea.votes?.down?.length || 0;
  const votedUp = idea.votes?.up?.includes(username) ? "voted-up" : "";
  const votedDown = idea.votes?.down?.includes(username) ? "voted-down" : "";
  const sourceLabel = idea.source === "import" && idea.createdBy ? `${idea.createdBy} から共有` : "";
  const urlDisplay = idea.url
    ? `<a href="${escapeHtml(idea.url)}" target="_blank" rel="noopener" class="idea-url">${truncateUrl(idea.url)}</a>`
    : "";
  const descDisplay = idea.description ? `<p class="idea-desc">${escapeHtml(idea.description)}</p>` : "";

  return `
    <div class="idea-card">
      <div class="idea-title">${escapeHtml(idea.title)}</div>
      ${urlDisplay}
      ${descDisplay}
      <div class="idea-meta">
        <span class="badge" style="background:${cat.color}">${cat.emoji} ${cat.label}</span>
        ${sourceLabel ? `<span class="idea-source">${escapeHtml(sourceLabel)}</span>` : ""}
      </div>
      <div class="ratings-row">
        <div class="rating-item"><div class="rating-label">ポテンシャル</div><div class="rating-bar"><div class="rating-bar-fill" style="width:${(idea.ratings?.potential||0)*20}%;background:${RATING_LABELS.potential.color}"></div></div></div>
        <div class="rating-item"><div class="rating-label">工数</div><div class="rating-bar"><div class="rating-bar-fill" style="width:${(idea.ratings?.effort||0)*20}%;background:${RATING_LABELS.effort.color}"></div></div></div>
        <div class="rating-item"><div class="rating-label">トレンド度</div><div class="rating-bar"><div class="rating-bar-fill" style="width:${(idea.ratings?.trend||0)*20}%;background:${RATING_LABELS.trend.color}"></div></div></div>
      </div>
      <div class="idea-actions">
        <button class="vote-btn ${votedUp}" data-vote="up" data-id="${idea.id}">👍 ${upCount}</button>
        <button class="vote-btn ${votedDown}" data-vote="down" data-id="${idea.id}">👎 ${downCount}</button>
        <span class="action-spacer"></span>
        <button class="action-btn" data-edit="${idea.id}" title="編集"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
        <button class="action-btn delete" data-delete="${idea.id}" title="削除"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
      </div>
    </div>`;
}

async function handleVote(id, direction) {
  if (!username) { alert("投票するにはユーザー名を設定してください"); return; }
  const ideas = await getIdeas();
  const idea = ideas.find((i) => i.id === id);
  if (!idea) return;
  if (!idea.votes) idea.votes = { up: [], down: [] };
  if (!idea.votes.up) idea.votes.up = [];
  if (!idea.votes.down) idea.votes.down = [];

  if (direction === "up") {
    if (idea.votes.up.includes(username)) { idea.votes.up = idea.votes.up.filter(u => u !== username); }
    else { idea.votes.up.push(username); idea.votes.down = idea.votes.down.filter(u => u !== username); }
  } else {
    if (idea.votes.down.includes(username)) { idea.votes.down = idea.votes.down.filter(u => u !== username); }
    else { idea.votes.down.push(username); idea.votes.up = idea.votes.up.filter(u => u !== username); }
  }
  await updateIdea(id, { votes: idea.votes });
  renderIdeas();
}

async function handleDelete(id) {
  if (!confirm("このネタを削除しますか？")) return;
  await deleteIdea(id);
  renderIdeas();
}

function setupAddForm() {
  document.getElementById("add-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("add-title").value.trim();
    if (!title) return;
    const idea = createIdea({
      title,
      url: document.getElementById("add-url").value.trim(),
      description: document.getElementById("add-desc").value.trim(),
      category: document.getElementById("add-category").value,
      ratings: {
        potential: parseInt(document.getElementById("add-potential").value),
        effort: parseInt(document.getElementById("add-effort").value),
        trend: parseInt(document.getElementById("add-trend").value),
      },
      source: "manual",
      createdBy: username,
    });
    await saveIdea(idea);
    e.target.reset();
    document.getElementById("val-potential").textContent = "3";
    document.getElementById("val-effort").textContent = "3";
    document.getElementById("val-trend").textContent = "3";
    document.querySelector('[data-tab="list"]').click();
  });
}

function setupSliders() {
  ["potential", "effort", "trend"].forEach((key) => {
    const slider = document.getElementById(`add-${key}`);
    const display = document.getElementById(`val-${key}`);
    slider.addEventListener("input", () => { display.textContent = slider.value; });
  });
}

function setupShareTab() {
  document.getElementById("export-btn").addEventListener("click", async () => {
    const ideas = await getIdeas();
    if (ideas.length === 0) { alert("エクスポートするネタがありません"); return; }
    const code = exportBoard(ideas, username);
    document.getElementById("export-code").value = code;
    document.getElementById("export-result").style.display = "block";
  });
  document.getElementById("copy-btn").addEventListener("click", () => {
    navigator.clipboard.writeText(document.getElementById("export-code").value).then(() => {
      const c = document.getElementById("copy-confirm");
      c.style.display = "inline";
      setTimeout(() => (c.style.display = "none"), 2000);
    });
  });
  document.getElementById("import-btn").addEventListener("click", async () => {
    const code = document.getElementById("import-code").value.trim();
    const result = importBoard(code);
    const div = document.getElementById("import-result");
    if (!result.success) {
      div.className = "import-result error"; div.textContent = result.error; div.style.display = "block"; return;
    }
    const skipDuplicates = document.getElementById("skip-duplicates").checked;
    const existing = await getIdeas();
    const merged = mergeBoards(existing, result.ideas, skipDuplicates);
    await setIdeas(merged.ideas);
    div.className = "import-result success";
    div.innerHTML = `${result.exportedBy} さんから <strong>${merged.added}件</strong> のネタをインポートしました${merged.skipped > 0 ? `（${merged.skipped}件の重複をスキップ）` : ""}`;
    div.style.display = "block";
    document.getElementById("import-code").value = "";
  });
}

async function renderVoteResults() {
  const ideas = await getIdeas();
  const container = document.getElementById("vote-results");
  const scored = ideas
    .map((i) => ({ ...i, score: (i.votes?.up?.length||0) - (i.votes?.down?.length||0), totalVotes: (i.votes?.up?.length||0) + (i.votes?.down?.length||0) }))
    .filter((i) => i.totalVotes > 0)
    .sort((a, b) => b.score - a.score);
  if (scored.length === 0) {
    container.innerHTML = '<p class="muted">アイデアに投票すると、ここにランキングが表示されます</p>';
    return;
  }
  container.innerHTML = scored.map((idea, i) => {
    const isTop = i < 3;
    const rc = i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : "";
    return `<div class="vote-rank-item ${isTop?"top":""}"><span class="rank-num ${rc}">${i+1}</span><span class="rank-title">${escapeHtml(idea.title)}</span><span class="rank-votes">+${idea.votes?.up?.length||0} / -${idea.votes?.down?.length||0}</span></div>`;
  }).join("");
}

function setupEditModal() {
  const modal = document.getElementById("edit-modal");
  modal.querySelector(".modal-backdrop").addEventListener("click", () => (modal.style.display = "none"));
  document.getElementById("edit-cancel").addEventListener("click", () => (modal.style.display = "none"));
  document.getElementById("edit-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("edit-id").value;
    await updateIdea(id, {
      title: document.getElementById("edit-title").value.trim(),
      url: document.getElementById("edit-url").value.trim(),
      description: document.getElementById("edit-desc").value.trim(),
      category: document.getElementById("edit-category").value,
    });
    modal.style.display = "none";
    renderIdeas();
  });
}

async function openEditModal(id) {
  const ideas = await getIdeas();
  const idea = ideas.find((i) => i.id === id);
  if (!idea) return;
  document.getElementById("edit-id").value = idea.id;
  document.getElementById("edit-title").value = idea.title;
  document.getElementById("edit-url").value = idea.url || "";
  document.getElementById("edit-desc").value = idea.description || "";
  document.getElementById("edit-category").value = idea.category || "other";
  document.getElementById("edit-modal").style.display = "flex";
}

function setupQuickAdd() {
  document.getElementById("quick-add-btn").addEventListener("click", async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      let pageInfo = { title: tab.title || "", url: tab.url || "" };
      try {
        const response = await chrome.tabs.sendMessage(tab.id, { type: "EXTRACT_PAGE_INFO" });
        if (response) pageInfo = { ...pageInfo, ...response };
      } catch { /* content script may not be loaded */ }
      const idea = createIdea({
        title: pageInfo.title,
        url: pageInfo.url,
        description: pageInfo.selectedText || pageInfo.description || "",
        thumbnail: pageInfo.thumbnail || null,
        category: "other",
        source: "clip",
        createdBy: username,
      });
      await saveIdea(idea);
      renderIdeas();
      // Brief visual feedback
      const btn = document.getElementById("quick-add-btn");
      btn.textContent = "保存しました！";
      setTimeout(() => (btn.textContent = "＋ 現在のページを保存"), 1500);
    } catch (err) {
      alert("ページ情報の取得に失敗しました");
    }
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function truncateUrl(url) {
  try {
    const u = new URL(url);
    const p = u.pathname.length > 30 ? u.pathname.substring(0, 30) + "..." : u.pathname;
    return u.hostname + p;
  } catch { return url.length > 50 ? url.substring(0, 50) + "..." : url; }
}
