// popup.js — Main popup logic
import { CATEGORIES, RATING_LABELS, createIdea } from "../shared/data.js";
import { getIdeas, saveIdea, updateIdea, deleteIdea, getSettings, saveSettings, setIdeas } from "../shared/storage.js";
import { exportBoard, importBoard, mergeBoards } from "../shared/sharing.js";

// --- State ---
let currentTab = "list";
let currentCategory = "all";
let currentSort = "newest";
let searchQuery = "";
let username = "";

// --- Init ---
document.addEventListener("DOMContentLoaded", async () => {
  await loadSettings();
  setupTabs();
  setupSearch();
  setupFilters();
  setupAddForm();
  setupShareTab();
  setupEditModal();
  setupSidePanel();
  setupSliders();
  await renderIdeas();
});

// --- Settings ---
async function loadSettings() {
  const settings = await getSettings();
  username = settings.username || "";
  document.getElementById("username-input").value = username;
  document.getElementById("username-input").addEventListener("change", async (e) => {
    username = e.target.value.trim();
    await saveSettings({ username });
  });
}

// --- Tabs ---
function setupTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.tab;
      document.getElementById(`tab-${target}`).classList.add("active");
      currentTab = target;
      if (target === "list") renderIdeas();
      if (target === "share") renderVoteResults();
    });
  });
}

// --- Search ---
function setupSearch() {
  const input = document.getElementById("search-input");
  input.addEventListener("input", (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderIdeas();
  });
}

// --- Filters ---
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

// --- Render Ideas ---
async function renderIdeas() {
  const ideas = await getIdeas();
  let filtered = [...ideas];

  // Search
  if (searchQuery) {
    filtered = filtered.filter(
      (i) =>
        i.title.toLowerCase().includes(searchQuery) ||
        i.description.toLowerCase().includes(searchQuery) ||
        (i.url && i.url.toLowerCase().includes(searchQuery))
    );
  }

  // Category filter
  if (currentCategory !== "all") {
    filtered = filtered.filter((i) => i.category === currentCategory);
  }

  // Sort
  filtered = sortIdeas(filtered, currentSort);

  const list = document.getElementById("ideas-list");
  const empty = document.getElementById("empty-state");

  if (filtered.length === 0) {
    list.innerHTML = "";
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";
  list.innerHTML = filtered.map((idea) => renderIdeaCard(idea)).join("");

  // Attach event listeners
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
    case "newest":
      return ideas.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case "potential":
      return ideas.sort((a, b) => (b.ratings?.potential || 0) - (a.ratings?.potential || 0));
    case "votes":
      return ideas.sort((a, b) => {
        const scoreA = (a.votes?.up?.length || 0) - (a.votes?.down?.length || 0);
        const scoreB = (b.votes?.up?.length || 0) - (b.votes?.down?.length || 0);
        return scoreB - scoreA;
      });
    case "trend":
      return ideas.sort((a, b) => (b.ratings?.trend || 0) - (a.ratings?.trend || 0));
    default:
      return ideas;
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
    ? `<a href="${escapeHtml(idea.url)}" target="_blank" rel="noopener" class="idea-url" title="${escapeHtml(idea.url)}">${truncateUrl(idea.url)}</a>`
    : "";

  const descDisplay = idea.description
    ? `<p class="idea-desc">${escapeHtml(idea.description)}</p>`
    : "";

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
        <div class="rating-item">
          <div class="rating-label">ポテンシャル</div>
          <div class="rating-bar"><div class="rating-bar-fill" style="width:${(idea.ratings?.potential || 0) * 20}%;background:${RATING_LABELS.potential.color}"></div></div>
        </div>
        <div class="rating-item">
          <div class="rating-label">工数</div>
          <div class="rating-bar"><div class="rating-bar-fill" style="width:${(idea.ratings?.effort || 0) * 20}%;background:${RATING_LABELS.effort.color}"></div></div>
        </div>
        <div class="rating-item">
          <div class="rating-label">トレンド度</div>
          <div class="rating-bar"><div class="rating-bar-fill" style="width:${(idea.ratings?.trend || 0) * 20}%;background:${RATING_LABELS.trend.color}"></div></div>
        </div>
      </div>
      <div class="idea-actions">
        <button class="vote-btn ${votedUp}" data-vote="up" data-id="${idea.id}">👍 ${upCount}</button>
        <button class="vote-btn ${votedDown}" data-vote="down" data-id="${idea.id}">👎 ${downCount}</button>
        <span class="action-spacer"></span>
        <button class="action-btn" data-edit="${idea.id}" title="編集">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="action-btn delete" data-delete="${idea.id}" title="削除">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
        </button>
      </div>
    </div>
  `;
}

// --- Votes ---
async function handleVote(id, direction) {
  if (!username) {
    alert("投票するにはユーザー名を設定してください");
    return;
  }
  const ideas = await getIdeas();
  const idea = ideas.find((i) => i.id === id);
  if (!idea) return;

  if (!idea.votes) idea.votes = { up: [], down: [] };
  if (!idea.votes.up) idea.votes.up = [];
  if (!idea.votes.down) idea.votes.down = [];

  if (direction === "up") {
    if (idea.votes.up.includes(username)) {
      idea.votes.up = idea.votes.up.filter((u) => u !== username);
    } else {
      idea.votes.up.push(username);
      idea.votes.down = idea.votes.down.filter((u) => u !== username);
    }
  } else {
    if (idea.votes.down.includes(username)) {
      idea.votes.down = idea.votes.down.filter((u) => u !== username);
    } else {
      idea.votes.down.push(username);
      idea.votes.up = idea.votes.up.filter((u) => u !== username);
    }
  }
  await updateIdea(id, { votes: idea.votes });
  renderIdeas();
}

// --- Delete ---
async function handleDelete(id) {
  if (!confirm("このネタを削除しますか？")) return;
  await deleteIdea(id);
  renderIdeas();
}

// --- Add Form ---
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
    // Reset slider displays
    document.getElementById("val-potential").textContent = "3";
    document.getElementById("val-effort").textContent = "3";
    document.getElementById("val-trend").textContent = "3";
    // Switch to list tab
    document.querySelector('[data-tab="list"]').click();
  });
}

function setupSliders() {
  ["potential", "effort", "trend"].forEach((key) => {
    const slider = document.getElementById(`add-${key}`);
    const display = document.getElementById(`val-${key}`);
    slider.addEventListener("input", () => {
      display.textContent = slider.value;
    });
  });
}

// --- Share Tab ---
function setupShareTab() {
  // Export
  document.getElementById("export-btn").addEventListener("click", async () => {
    const ideas = await getIdeas();
    if (ideas.length === 0) {
      alert("エクスポートするネタがありません");
      return;
    }
    const code = exportBoard(ideas, username);
    document.getElementById("export-code").value = code;
    document.getElementById("export-result").style.display = "block";
  });

  document.getElementById("copy-btn").addEventListener("click", () => {
    const code = document.getElementById("export-code").value;
    navigator.clipboard.writeText(code).then(() => {
      const confirm = document.getElementById("copy-confirm");
      confirm.style.display = "inline";
      setTimeout(() => (confirm.style.display = "none"), 2000);
    });
  });

  // Import
  document.getElementById("import-btn").addEventListener("click", async () => {
    const code = document.getElementById("import-code").value.trim();
    const result = importBoard(code);
    const resultDiv = document.getElementById("import-result");

    if (!result.success) {
      resultDiv.className = "import-result error";
      resultDiv.textContent = result.error;
      resultDiv.style.display = "block";
      return;
    }

    const skipDuplicates = document.getElementById("skip-duplicates").checked;
    const existing = await getIdeas();
    const merged = mergeBoards(existing, result.ideas, skipDuplicates);
    await setIdeas(merged.ideas);

    resultDiv.className = "import-result success";
    resultDiv.innerHTML = `${result.exportedBy} さんから <strong>${merged.added}件</strong> のネタをインポートしました${merged.skipped > 0 ? `（${merged.skipped}件の重複をスキップ）` : ""}`;
    resultDiv.style.display = "block";
    document.getElementById("import-code").value = "";
  });
}

// --- Vote Results ---
async function renderVoteResults() {
  const ideas = await getIdeas();
  const container = document.getElementById("vote-results");

  const scored = ideas
    .map((idea) => ({
      ...idea,
      score: (idea.votes?.up?.length || 0) - (idea.votes?.down?.length || 0),
      totalVotes: (idea.votes?.up?.length || 0) + (idea.votes?.down?.length || 0),
    }))
    .filter((i) => i.totalVotes > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    container.innerHTML = '<p class="muted">アイデアに投票すると、ここにランキングが表示されます</p>';
    return;
  }

  container.innerHTML = scored
    .map((idea, i) => {
      const isTop = i < 3;
      const rankClass = i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : "";
      return `
        <div class="vote-rank-item ${isTop ? "top" : ""}">
          <span class="rank-num ${rankClass}">${i + 1}</span>
          <span class="rank-title">${escapeHtml(idea.title)}</span>
          <span class="rank-votes">+${idea.votes?.up?.length || 0} / -${idea.votes?.down?.length || 0}</span>
        </div>
      `;
    })
    .join("");
}

// --- Edit Modal ---
function setupEditModal() {
  const modal = document.getElementById("edit-modal");
  const backdrop = modal.querySelector(".modal-backdrop");
  const cancelBtn = document.getElementById("edit-cancel");
  const form = document.getElementById("edit-form");

  backdrop.addEventListener("click", () => (modal.style.display = "none"));
  cancelBtn.addEventListener("click", () => (modal.style.display = "none"));

  form.addEventListener("submit", async (e) => {
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

// --- Side Panel ---
function setupSidePanel() {
  document.getElementById("sidePanel-btn").addEventListener("click", async () => {
    try {
      // In MV3, we need to use chrome.sidePanel API
      if (chrome.sidePanel && chrome.sidePanel.open) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        await chrome.sidePanel.open({ windowId: tab.windowId });
      }
    } catch {
      // Side panel may not be supported
    }
  });
}

// --- Helpers ---
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function truncateUrl(url) {
  try {
    const u = new URL(url);
    const path = u.pathname.length > 30 ? u.pathname.substring(0, 30) + "..." : u.pathname;
    return u.hostname + path;
  } catch {
    return url.length > 50 ? url.substring(0, 50) + "..." : url;
  }
}
