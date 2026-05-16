/** Client entry: drives the SVG subway map and the day/night loop. */

import { TOPICS, TOPICS_BY_KEY, type TopicKey } from "../game/topics.ts";
import {
  addStation, createLine, extendLine, isTransferStation, removeStation,
  type Network, type Station,
} from "../game/network.ts";
import { simulateDay, applyDay } from "../game/traffic.ts";
import { nextWeather, getWeather, WEATHERS, type WeatherKey } from "../game/weather.ts";
import { RNG } from "../game/rng.ts";
import {
  newGame, advanceDay, maxActionPoints, recentHistory, type GameState,
} from "../game/game.ts";
import { loadFromLocalStorage, saveToLocalStorage } from "../game/save.ts";


const VIEW_W = 800;
const VIEW_H = 520;
const DAY_DURATION_MS = 4000;   // 4 seconds = 1 day (fast feedback)

const $ = (sel: string) => document.querySelector(sel) as HTMLElement;
const map  = document.querySelector("#map") as unknown as SVGSVGElement;
const toastEl = $("#toast");

let state: GameState = loadFromLocalStorage() ?? newGame();
let selectedStation: Station | null = null;
let connectFrom: Station | null = null;
let phase: "night" | "running" = "night";
let rng = new RNG(Date.now() & 0xffffffff);


// ---- SVG draw ----

function colorForLine(topic: TopicKey): string {
  return TOPICS_BY_KEY[topic].color;
}

function stationXY(s: Station): { x: number; y: number } {
  return { x: 40 + s.x * (VIEW_W - 80), y: 40 + s.y * (VIEW_H - 80) };
}

function drawNetwork() {
  // Clear
  while (map.firstChild) map.removeChild(map.firstChild);

  // Background grid
  const bg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  for (let i = 1; i < 10; i++) {
    const ln = document.createElementNS("http://www.w3.org/2000/svg", "line");
    ln.setAttribute("x1", String((VIEW_W / 10) * i));
    ln.setAttribute("x2", String((VIEW_W / 10) * i));
    ln.setAttribute("y1", "0");
    ln.setAttribute("y2", String(VIEW_H));
    ln.setAttribute("stroke", "#cfc4ab");
    ln.setAttribute("stroke-dasharray", "2 8");
    ln.setAttribute("stroke-width", "1");
    ln.setAttribute("opacity", "0.4");
    bg.appendChild(ln);
  }
  for (let i = 1; i < 7; i++) {
    const ln = document.createElementNS("http://www.w3.org/2000/svg", "line");
    ln.setAttribute("y1", String((VIEW_H / 7) * i));
    ln.setAttribute("y2", String((VIEW_H / 7) * i));
    ln.setAttribute("x1", "0");
    ln.setAttribute("x2", String(VIEW_W));
    ln.setAttribute("stroke", "#cfc4ab");
    ln.setAttribute("stroke-dasharray", "2 8");
    ln.setAttribute("stroke-width", "1");
    ln.setAttribute("opacity", "0.4");
    bg.appendChild(ln);
  }
  map.appendChild(bg);

  // Lines
  for (const line of state.network.lines) {
    if (line.station_ids.length < 2) continue;
    const pts = line.station_ids
      .map(id => state.network.stations.find(s => s.id === id))
      .filter((s): s is Station => !!s)
      .map(stationXY)
      .map(p => `${p.x},${p.y}`)
      .join(" ");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    path.setAttribute("points", pts);
    path.setAttribute("class", "line-path");
    path.setAttribute("stroke", colorForLine(line.topic));
    map.appendChild(path);
  }

  // Stations
  for (const s of state.network.stations) {
    const { x, y } = stationXY(s);
    const topic = TOPICS_BY_KEY[s.topic];
    const isTransfer = isTransferStation(s);

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", `translate(${x},${y})`);
    g.setAttribute("data-id", s.id);

    const r = 8 + s.vibe * 1.6;
    if (isTransfer) {
      const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      ring.setAttribute("r", String(r + 3));
      ring.setAttribute("fill", "none");
      ring.setAttribute("stroke", "#2a2520");
      ring.setAttribute("stroke-width", "2");
      g.appendChild(ring);
    }
    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("r", String(r));
    c.setAttribute("fill", "#fff");
    c.setAttribute("class", "station-circle" +
      (selectedStation && selectedStation.id === s.id ? " selected" : "") +
      (isTransfer ? " transfer" : ""));
    c.setAttribute("stroke", topic.color);
    g.appendChild(c);

    // glyph label (topic shape)
    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.setAttribute("text-anchor", "middle");
    txt.setAttribute("dy", "3");
    txt.setAttribute("font-size", "10");
    txt.setAttribute("fill", topic.color);
    txt.textContent = topic.shape;
    g.appendChild(txt);

    g.addEventListener("click", (e) => {
      e.stopPropagation();
      if (connectFrom) {
        if (connectFrom.id !== s.id) {
          // Add a line between connectFrom and s
          try {
            const sameTopic = connectFrom.topic === s.topic;
            const t: TopicKey = sameTopic ? s.topic : "shorts";
            createLine(state.network, t, [connectFrom.id, s.id]);
            saveAndRender();
            toast(`線を引いた: ${TOPICS_BY_KEY[t].name}`);
          } catch (err: any) {
            toast(err.message);
          }
        }
        connectFrom = null;
        renderHUD();
      } else {
        selectStation(s);
      }
    });
    map.appendChild(g);

    // age dim factor
    if (s.age_days > 14) {
      c.setAttribute("opacity", "0.55");
    }
  }

  // Empty-state hint
  if (state.network.stations.length === 0) {
    const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
    t.setAttribute("x", String(VIEW_W / 2));
    t.setAttribute("y", String(VIEW_H / 2));
    t.setAttribute("text-anchor", "middle");
    t.setAttribute("fill", "#7a6f5c");
    t.setAttribute("font-size", "13");
    t.setAttribute("letter-spacing", "0.16em");
    t.textContent = "「+ 駅を作る」 から始めましょう";
    map.appendChild(t);
  }
}

function selectStation(s: Station) {
  selectedStation = s;
  renderPanel();
  drawNetwork();
}

// ---- HUD ----

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";
  return n.toLocaleString();
}

function renderHUD() {
  $("#hud-subs").textContent = fmt(state.subscribers);
  $("#hud-views").textContent = fmt(state.total_views);
  $("#hud-day").textContent = `${state.day} 日目`;
  const w = getWeather(state.weather);
  $("#hud-weather").textContent = w.name;
  $("#hud-ap").textContent = `${state.action_points} / ${maxActionPoints(state)}`;
  const phaseEl = $("#hud-phase");
  if (connectFrom) {
    phaseEl.textContent = "接続先の駅をクリック…";
  } else if (phase === "running") {
    phaseEl.textContent = "視聴者が流れている…";
  } else {
    phaseEl.textContent = "夜のアクション";
  }
}

function renderPanel() {
  const detail = $("#station-detail");
  if (!selectedStation) {
    detail.className = "empty";
    detail.textContent = "駅は未選択";
    setActionAvailability(false);
    return;
  }
  const s = selectedStation;
  const topic = TOPICS_BY_KEY[s.topic];
  detail.className = "";
  detail.innerHTML = `
    <div class="row"><span class="l">話題</span>
      <span class="v b" style="color:${topic.color}">${topic.shape} ${topic.name}</span></div>
    <div class="row"><span class="l">vibe</span>
      <span class="v">${"●".repeat(s.vibe)}${"○".repeat(5 - s.vibe)}</span></div>
    <div class="row"><span class="l">経過日</span><span class="v">${s.age_days} 日</span></div>
    <div class="row"><span class="l">所属線</span>
      <span class="v">${s.line_ids.length} 線${isTransferStation(s) ? " (乗換駅)" : ""}</span></div>
  `;
  setActionAvailability(true);
}

function setActionAvailability(stationSelected: boolean) {
  const ap = state.action_points;
  ($("#btn-new") as HTMLButtonElement).disabled = ap < 1;
  ($("#btn-upgrade") as HTMLButtonElement).disabled =
    !stationSelected || ap < 1 || (selectedStation?.vibe ?? 5) >= 5;
  ($("#btn-connect") as HTMLButtonElement).disabled = !stationSelected;
  ($("#btn-delete") as HTMLButtonElement).disabled = !stationSelected;
}

function renderHistory() {
  const el = $("#history");
  el.innerHTML = "";
  const items = recentHistory(state, 7);
  if (items.length === 0) {
    const li = document.createElement("li");
    li.innerHTML = `<span class="views">まだ何も起きていない</span>`;
    el.appendChild(li);
    return;
  }
  for (const h of items) {
    const wn = getWeather(h.weather).name;
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="wkey">${h.day}日</span>
      <span class="views">${fmt(h.views)} 再生</span>
      <span class="delta">+${h.subs}</span>
      <span class="wkey">${wn}</span>
    `;
    el.appendChild(li);
  }
}

function render() {
  drawNetwork();
  renderHUD();
  renderPanel();
  renderHistory();
}

function saveAndRender() {
  saveToLocalStorage(state);
  render();
}

// ---- Toast ----

let toastTimer: number | undefined;
function toast(msg: string, durationMs = 1600) {
  toastEl.textContent = msg;
  toastEl.classList.add("on");
  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastEl.classList.remove("on"), durationMs);
}

// ---- Actions ----

function handleNewStation() {
  if (state.action_points < 1) { toast("AP が足りない"); return; }
  // Place near center, slight jitter
  const x = 0.3 + Math.random() * 0.4;
  const y = 0.3 + Math.random() * 0.4;
  const topic = pickRandomTopic();
  const newStation = addStation(state.network, { topic, vibe: 2, x, y });
  state.action_points -= 1;
  selectedStation = newStation;
  saveAndRender();
  toast(`+ 駅: ${TOPICS_BY_KEY[topic].name}`);
}

function handleUpgrade() {
  if (!selectedStation || state.action_points < 1) return;
  if (selectedStation.vibe >= 5) return;
  selectedStation.vibe = Math.min(5, selectedStation.vibe + 1);
  state.action_points -= 1;
  saveAndRender();
  toast(`vibe → ${selectedStation.vibe}`);
}

function handleConnect() {
  if (!selectedStation) return;
  connectFrom = selectedStation;
  renderHUD();
  toast("接続先の駅をクリックしてください");
}

function handleDelete() {
  if (!selectedStation) return;
  removeStation(state.network, selectedStation.id);
  selectedStation = null;
  saveAndRender();
  toast("駅を消した");
}

function pickRandomTopic(): TopicKey {
  const pool: TopicKey[] = ["cooking", "gaming", "vlog", "edu", "comedy"];
  if (state.unlocked.shorts_line) pool.push("shorts");
  return pool[Math.floor(Math.random() * pool.length)]!;
}

// ---- Day loop ----

async function runDay() {
  if (phase === "running") return;
  if (state.network.stations.length === 0) {
    toast("最初の駅を作ってから");
    return;
  }
  phase = "running";
  renderHUD();
  ($("#btn-next-day") as HTMLButtonElement).disabled = true;

  // animate: views tick up smoothly over DAY_DURATION_MS
  const before = state;
  const newState = advanceDay(before, rng);
  const startSubs = before.subscribers;
  const startViews = before.total_views;
  const deltaSubs = newState.subscribers - startSubs;
  const deltaViews = newState.total_views - startViews;

  const t0 = performance.now();
  await new Promise<void>(resolve => {
    function step() {
      const t = Math.min(1, (performance.now() - t0) / DAY_DURATION_MS);
      // ease-out
      const eased = 1 - (1 - t) * (1 - t);
      $("#hud-subs").textContent = fmt(Math.round(startSubs + deltaSubs * eased));
      $("#hud-views").textContent = fmt(Math.round(startViews + deltaViews * eased));
      if (t < 1) requestAnimationFrame(step);
      else resolve();
    }
    step();
  });

  state = newState;
  phase = "night";
  selectedStation = null;
  saveAndRender();
  ($("#btn-next-day") as HTMLButtonElement).disabled = false;

  // Notify on weather change
  if (newState.day % 7 === 1 && newState.day > 1) {
    toast(`今週の天候: ${getWeather(newState.weather).name}`);
  }
  // Notify on unlock
  if (newState.unlocked.shorts_line && !before.unlocked.shorts_line) {
    toast("🎉 ショート線 解放 (1k 登録者)", 2400);
  }
  if (newState.unlocked.series_line && !before.unlocked.series_line) {
    toast("🎉 シリーズ線 解放 (10k 登録者)", 2400);
  }
  if (newState.unlocked.collab && !before.unlocked.collab) {
    toast("🎉 コラボ駅 解放 (100k 登録者)", 2400);
  }
}

// ---- Wire up ----

function init() {
  $("#btn-new").addEventListener("click", handleNewStation);
  $("#btn-upgrade").addEventListener("click", handleUpgrade);
  $("#btn-connect").addEventListener("click", handleConnect);
  $("#btn-delete").addEventListener("click", handleDelete);
  $("#btn-next-day").addEventListener("click", () => { runDay(); });
  $("#btn-reset").addEventListener("click", () => {
    if (confirm("チャンネルを最初から作り直しますか?")) {
      state = newGame();
      selectedStation = null;
      connectFrom = null;
      saveAndRender();
      toast("新しいチャンネルです");
    }
  });

  // SVG click background → deselect
  map.addEventListener("click", () => {
    if (connectFrom) { connectFrom = null; renderHUD(); return; }
    selectedStation = null;
    renderPanel();
    drawNetwork();
  });

  render();
}

init();
