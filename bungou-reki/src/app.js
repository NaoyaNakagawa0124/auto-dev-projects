/* eslint-disable no-undef */
// 文豪暦 — フロントエンドエントリ
// Tauri が利用可能ならコマンドを使い、ブラウザ単体起動時は同等ロジックを JS で再現する

import { loadAuthors, summonsForDate, anniversariesOn, anniversariesForMonth, daysInMonth } from "./modules/calendar.js";
import { resolveBattle, opponentForSeed } from "./modules/battle.js";
import { Store } from "./modules/store.js";

const TAURI = typeof window !== "undefined" && !!window.__TAURI__;
const invoke = TAURI ? window.__TAURI__.core.invoke : null;

// ============= state =============
const state = {
  today: todayISO(),
  authors: [],
  store: null,
  deck: [],            // 対戦用デッキ (author id 配列)
  calMonth: null,      // { year, month }
  calSelectedDay: null,
};

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ============= init =============
async function init() {
  state.authors = await loadAuthors();
  state.store = new Store("bungou-reki/v1");
  await state.store.load();
  // 今日の表示
  const tDate = new Date(state.today);
  document.getElementById("today-label").textContent =
    `${tDate.getFullYear()}年 ${tDate.getMonth() + 1}月 ${tDate.getDate()}日 — 文学暦 ${state.authors.length} 名収録`;

  // 暦の初期月 = 今月
  state.calMonth = { year: tDate.getFullYear(), month: tDate.getMonth() + 1 };

  bindTabs();
  renderSummon();
  renderCollection();
  renderBattle();
  renderReading();
  renderCalendar();
}

// ============= tabs =============
function bindTabs() {
  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.screen;
      document.querySelectorAll(".tab").forEach(b => b.classList.toggle("is-active", b === btn));
      document.querySelectorAll(".screen").forEach(s => s.classList.toggle("is-active", s.id === `screen-${target}`));
      // 切り替え時にデッキ画面は再描画（XP表示等を反映）
      if (target === "collection") renderCollection();
      if (target === "battle") renderBattle();
      if (target === "reading") renderReading();
    });
  });
}

// ============= 召喚 =============
function renderSummon() {
  const wrap = document.getElementById("summon-cards");
  const subtitle = document.getElementById("summon-subtitle");
  const msg = document.getElementById("summon-message");
  wrap.innerHTML = "";
  msg.classList.add("hidden");

  const cands = summonsForDate(state.authors, state.today);

  if (cands.length === 0) {
    subtitle.textContent = "今日に縁ある文豪は見つかりませんでした…";
    return;
  }
  subtitle.textContent = `${cands.length} 名の文豪が現れています — 1 名のみ召喚できます`;

  const alreadyToday = state.store.hasRecruitedOn(state.today);

  for (const c of cands) {
    const card = renderAuthorCard(c.author, {
      annivLabel: `${c.kind === "birth" ? "誕生" : "命日"} ${c.years_ago}周年`,
      onClick: () => {
        if (alreadyToday) {
          toast("本日は既に召喚済みです", "seal");
          return;
        }
        state.store.recruit(c.author.id, state.today);
        state.store.save();
        msg.innerHTML = `<strong>${c.author.name}</strong> を蔵書に加えました。<br>「蔵書」タブで確認できます。`;
        msg.classList.remove("hidden");
        // 全カードを暗くし、選んだカードのみハイライト
        wrap.querySelectorAll(".card").forEach(el => {
          el.classList.add("is-dim");
          if (el.dataset.id === c.author.id) {
            el.classList.remove("is-dim");
            el.classList.add("is-selected");
          }
        });
        renderCollection();
        renderBattle();
      },
    });
    wrap.appendChild(card);
  }

  if (alreadyToday) {
    msg.textContent = "本日は既に召喚済みです — 明日もお越しください";
    msg.classList.remove("hidden");
    wrap.querySelectorAll(".card").forEach(el => {
      const id = el.dataset.id;
      if (state.store.collection.includes(id)) {
        el.classList.add("is-selected");
      } else {
        el.classList.add("is-dim");
      }
    });
  }
}

function renderAuthorCard(author, opts = {}) {
  const { annivLabel, level, xp, onClick, selected, dim } = opts;
  const card = document.createElement("div");
  card.className = "card";
  if (selected) card.classList.add("is-selected");
  if (dim) card.classList.add("is-dim");
  card.dataset.id = author.id;
  card.tabIndex = 0;
  card.style.setProperty("--accent", author.color);

  const annivHtml = annivLabel ? `<div class="anniv">${escapeHtml(annivLabel)}</div>` : "";
  const cornerHtml = author.era ? `<div class="corner">${escapeHtml(author.era)}</div>` : "";
  const levelHtml = level ? `<div class="level-badge">Lv.${level}</div>` : "";

  const stats = author.stats;
  card.innerHTML = `
    ${annivHtml}
    ${cornerHtml}
    <div class="portrait">${escapeHtml(portraitGlyph(author))}</div>
    <div class="name">${escapeHtml(author.name)}</div>
    <div class="name-en">${escapeHtml(author.name_en)}</div>
    <div class="epithet">${escapeHtml(author.epithet)}</div>
    <div class="stats">
      <div class="stat"><span class="label">文才</span><span class="val">${stats.literary}</span></div>
      <div class="stat"><span class="label">多作</span><span class="val">${stats.prolific}</span></div>
      <div class="stat"><span class="label">影響</span><span class="val">${stats.influence}</span></div>
      <div class="stat"><span class="label">寿命</span><span class="val">${stats.longevity}</span></div>
    </div>
    <div class="meta-row">
      <span>${escapeHtml(author.country)}</span>
      <span>${birthYear(author)}—${deathYear(author)}</span>
    </div>
    ${levelHtml}
  `;

  if (onClick) {
    card.addEventListener("click", onClick);
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    });
  }
  return card;
}

function portraitGlyph(a) {
  return a.name.charAt(0);
}

function birthYear(a) { return a.born?.slice(0, 4) ?? "?"; }
function deathYear(a) { return a.died ? a.died.slice(0, 4) : "現役"; }

// ============= 蔵書 =============
function renderCollection() {
  const grid = document.getElementById("collection-grid");
  const empty = document.getElementById("collection-empty");
  grid.innerHTML = "";
  if (state.store.collection.length === 0) {
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  const items = state.store.collection
    .map(id => state.authors.find(a => a.id === id))
    .filter(Boolean)
    .sort((a, b) => state.store.levelFor(b.id) - state.store.levelFor(a.id));

  for (const a of items) {
    const level = state.store.levelFor(a.id);
    const card = renderAuthorCard(a, { level });
    grid.appendChild(card);
  }
}

// ============= 対戦 =============
function renderBattle() {
  const slotsEl = document.getElementById("deck-slots");
  const pickerEl = document.getElementById("deck-picker");
  const countEl = document.getElementById("deck-count");
  const startBtn = document.getElementById("start-battle");
  const stage = document.getElementById("battle-stage");

  slotsEl.innerHTML = "";
  const axes = ["文才", "多作", "影響"];
  for (let i = 0; i < 3; i++) {
    const slot = document.createElement("div");
    slot.className = "deck-slot" + (state.deck[i] ? " filled" : "");
    const axisTag = `<span class="axis-tag">${axes[i]}</span>`;
    if (state.deck[i]) {
      const a = state.authors.find(x => x.id === state.deck[i]);
      slot.innerHTML = `
        ${axisTag}
        <div class="mini-portrait" style="background:${a.color}">${escapeHtml(portraitGlyph(a))}</div>
        <div class="mini-name">${escapeHtml(a.name)}</div>
        <div class="meta">${axes[i]}: ${a.stats[axisToKey(i)]}</div>
      `;
      slot.addEventListener("click", () => {
        state.deck[i] = null;
        state.deck = state.deck.filter(Boolean);
        renderBattle();
      });
    } else {
      slot.innerHTML = `${axisTag}<div class="placeholder">空</div>`;
    }
    slotsEl.appendChild(slot);
  }
  countEl.textContent = `${state.deck.length} / 3`;
  startBtn.disabled = state.deck.length !== 3;
  startBtn.onclick = () => startBattle();

  pickerEl.innerHTML = "";
  if (state.store.collection.length === 0) {
    pickerEl.innerHTML = `<p class="empty-note" style="margin:14px 0;">先に蔵書を増やしましょう。「召喚」タブから一人選んでください。</p>`;
  } else {
    for (const id of state.store.collection) {
      const a = state.authors.find(x => x.id === id);
      if (!a) continue;
      const inDeck = state.deck.includes(id);
      const card = renderAuthorCard(a, {
        level: state.store.levelFor(id),
        selected: inDeck,
        dim: inDeck,
        onClick: () => {
          if (inDeck) return;
          if (state.deck.length >= 3) {
            toast("デッキは 3 枚までです", "seal");
            return;
          }
          state.deck.push(id);
          renderBattle();
        },
      });
      pickerEl.appendChild(card);
    }
  }

  if (!stage.dataset.hasResult) {
    stage.innerHTML = `<p class="muted center">デッキを 3 枚編成して「対戦開始」を押してください。</p>`;
  }
}

function axisToKey(i) {
  return ["literary", "prolific", "influence"][i];
}

function startBattle() {
  const stage = document.getElementById("battle-stage");
  const playerDeck = state.deck.map(id => state.authors.find(a => a.id === id));
  const seed = dateSeed(state.today);
  const opponent = opponentForSeed(state.authors, seed, state.deck);
  const result = resolveBattle(playerDeck, opponent);

  // XP付与: 勝ったカード +20XP、勝利時はさらに +20XP
  for (const id of result.xp_targets) {
    state.store.addXp(id, 20);
  }
  if (result.player_won) {
    for (const id of state.deck) state.store.addXp(id, 10);
  }
  state.store.logBattle({
    date: state.today,
    player_won: result.player_won,
    player_wins: result.player_wins,
    opponent_wins: result.opponent_wins,
    xp_gained: result.xp_gained,
  });
  state.store.save();

  stage.dataset.hasResult = "1";
  stage.innerHTML = `
    <h3 style="margin:0 0 12px;">対戦結果</h3>
    <div class="battle-rounds">
      ${result.rounds.map(r => renderRoundHtml(r)).join("")}
    </div>
    <div class="battle-result ${result.player_won ? "win" : ""}">
      ${result.player_won ? `🌸 勝利！ ${result.player_wins} - ${result.opponent_wins}` : `挑戦失敗 ${result.player_wins} - ${result.opponent_wins}`}
      ${result.xp_gained > 0 ? `<br><span style="font-size:13px;">+${result.xp_gained} XP — 勝ったカードに XP を付与</span>` : ""}
    </div>
    <p style="text-align:center; margin-top:14px;"><button class="btn-ghost" id="rematch">もう一度組み直す</button></p>
  `;
  stage.querySelector("#rematch").addEventListener("click", () => {
    state.deck = [];
    delete stage.dataset.hasResult;
    renderBattle();
  });
  renderCollection();
  toast(result.player_won ? `勝利！+${result.xp_gained} XP` : "敗北… また挑もう", result.player_won ? "win" : "");
}

function renderRoundHtml(r) {
  const pc = r.player_card;
  const oc = r.opponent_card;
  const winClass = r.outcome === "win" ? "win" : r.outcome === "loss" ? "loss" : "";
  return `
    <div class="round-row ${winClass}">
      <div class="side">
        <div class="round-portrait" style="background:${pc.color}">${escapeHtml(portraitGlyph(pc))}</div>
        <div>
          <div class="round-name">${escapeHtml(pc.name)}</div>
          <div class="meta">${r.axis_label}<span class="round-value">${r.player_value}</span></div>
        </div>
      </div>
      <div class="vs">vs</div>
      <div class="side opp">
        <div class="round-portrait" style="background:${oc.color}">${escapeHtml(portraitGlyph(oc))}</div>
        <div>
          <div class="round-name">${escapeHtml(oc.name)}</div>
          <div class="meta"><span class="round-value">${r.opponent_value}</span>${r.axis_label}</div>
        </div>
      </div>
    </div>
  `;
}

function dateSeed(iso) {
  // 文字列を数値ハッシュへ変換 (32bit)
  let h = 2166136261;
  for (let i = 0; i < iso.length; i++) {
    h ^= iso.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return BigInt(h >>> 0);
}

// ============= 読書 =============
function renderReading() {
  const select = document.getElementById("reading-author");
  const list = document.getElementById("reading-list");
  const empty = document.getElementById("reading-empty");
  const form = document.getElementById("reading-form");

  // 選択肢を蔵書から作成
  const collection = state.store.collection
    .map(id => state.authors.find(a => a.id === id))
    .filter(Boolean);
  if (collection.length === 0) {
    select.innerHTML = `<option value="">先に「召喚」で蔵書を増やしてください</option>`;
    select.disabled = true;
  } else {
    select.disabled = false;
    select.innerHTML = collection.map(a => `<option value="${a.id}">${escapeHtml(a.name)}</option>`).join("");
  }

  form.onsubmit = e => {
    e.preventDefault();
    const author_id = select.value;
    const title = document.getElementById("reading-title").value.trim();
    const pages = parseInt(document.getElementById("reading-pages").value, 10);
    if (!author_id) { toast("作家を選んでください", "seal"); return; }
    if (!title) { toast("書名を入力してください", "seal"); return; }
    if (!pages || pages < 1) { toast("ページ数は 1 以上で", "seal"); return; }
    const xp = state.store.logReading(author_id, title, pages, state.today);
    state.store.save();
    document.getElementById("reading-title").value = "";
    toast(`+${xp} XP — ${title} を記録しました`, "win");
    renderReading();
    renderCollection();
  };

  const recent = [...state.store.reading].reverse();
  list.innerHTML = "";
  if (recent.length === 0) {
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");
  for (const r of recent.slice(0, 20)) {
    const a = state.authors.find(x => x.id === r.author_id);
    if (!a) continue;
    const li = document.createElement("li");
    li.innerHTML = `
      <span><span class="title">${escapeHtml(r.title)}</span> <span class="meta">— ${escapeHtml(a.name)}</span></span>
      <span class="meta">${escapeHtml(r.date)} · ${r.pages}p · +${Math.max(5, Math.floor(r.pages / 4))}XP</span>
    `;
    list.appendChild(li);
  }
}

// ============= 暦 =============
function renderCalendar() {
  const { year, month } = state.calMonth;
  document.getElementById("cal-title").textContent = `${year}年 ${month}月の文学暦`;
  const grid = document.getElementById("calendar-grid");
  grid.innerHTML = "";

  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  for (const w of weekdays) {
    const el = document.createElement("div");
    el.className = "weekday";
    el.textContent = w;
    grid.appendChild(el);
  }

  const counts = anniversariesForMonth(state.authors, year, month);
  const firstDow = new Date(year, month - 1, 1).getDay();
  const days = daysInMonth(year, month);
  const todayY = new Date(state.today).getFullYear();
  const todayM = new Date(state.today).getMonth() + 1;
  const todayD = new Date(state.today).getDate();

  for (let i = 0; i < firstDow; i++) {
    const blank = document.createElement("div");
    blank.className = "cal-cell is-blank";
    grid.appendChild(blank);
  }

  for (let d = 1; d <= days; d++) {
    const cell = document.createElement("div");
    cell.className = "cal-cell";
    if (counts[d - 1] > 0) cell.classList.add("has-event");
    if (year === todayY && month === todayM && d === todayD) cell.classList.add("is-today");
    if (state.calSelectedDay === d) cell.classList.add("is-selected");
    cell.innerHTML = `
      <span class="day">${d}</span>
      ${counts[d - 1] > 0 ? `<span class="count">${counts[d - 1]}名</span>` : ""}
    `;
    cell.addEventListener("click", () => {
      state.calSelectedDay = d;
      renderCalendar();
    });
    grid.appendChild(cell);
  }

  // 詳細
  const detail = document.getElementById("calendar-detail");
  if (state.calSelectedDay) {
    const mmdd = `${String(month).padStart(2, "0")}-${String(state.calSelectedDay).padStart(2, "0")}`;
    const events = anniversariesOn(state.authors, year, mmdd);
    detail.classList.remove("hidden");
    detail.innerHTML = `
      <h3>${month}月 ${state.calSelectedDay}日の文学暦</h3>
      ${events.length === 0
        ? `<p class="muted">この日の出来事は記録されていません。</p>`
        : `<ul>${events.map(e => `
            <li class="kind-${e.kind}">
              <strong>${escapeHtml(e.author.name)}</strong>
              <span class="meta"> — ${e.kind === "birth" ? "誕生" : "命日"} ${e.year}年 (${e.years_ago}年前)</span>
              <div class="meta" style="margin-top:4px;">${escapeHtml(e.author.epithet)} · ${escapeHtml(e.author.country)} · 代表作: ${escapeHtml(e.author.works.slice(0, 2).join("、"))}</div>
            </li>`).join("")}</ul>`
      }
    `;
  } else {
    detail.classList.add("hidden");
  }

  document.getElementById("cal-prev").onclick = () => {
    let { year: y, month: m } = state.calMonth;
    m--; if (m < 1) { m = 12; y--; }
    state.calMonth = { year: y, month: m };
    state.calSelectedDay = null;
    renderCalendar();
  };
  document.getElementById("cal-next").onclick = () => {
    let { year: y, month: m } = state.calMonth;
    m++; if (m > 12) { m = 1; y++; }
    state.calMonth = { year: y, month: m };
    state.calSelectedDay = null;
    renderCalendar();
  };
}

// ============= utility =============
function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

let toastTimer = null;
function toast(message, variant = "") {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.className = "toast " + variant;
  el.classList.remove("hidden");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.add("hidden");
  }, 2400);
}

init().catch(err => {
  console.error(err);
  document.body.innerHTML = `<div style="padding:40px; font-family:serif;">起動に失敗しました: ${escapeHtml(err.message)}</div>`;
});
