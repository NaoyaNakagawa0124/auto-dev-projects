// src/game/topics.ts
var TOPICS = [
  { key: "cooking", name: "料理", color: "#d49a3f", shape: "○", base_views: 80 },
  { key: "gaming", name: "ゲーム", color: "#6b6f9c", shape: "□", base_views: 100 },
  { key: "vlog", name: "Vlog", color: "#c47b76", shape: "△", base_views: 60 },
  { key: "edu", name: "学び", color: "#4a7d5a", shape: "✕", base_views: 70 },
  { key: "comedy", name: "笑い", color: "#b8945b", shape: "◇", base_views: 90 },
  { key: "shorts", name: "ショート", color: "#a08abf", shape: "▽", base_views: 140 }
];
var TOPICS_BY_KEY = Object.fromEntries(TOPICS.map((t) => [t.key, t]));

// src/game/network.ts
function emptyNetwork() {
  return { stations: [], lines: [] };
}
var _idCounter = 0;
function nextId(prefix = "") {
  _idCounter += 1;
  return `${prefix}${_idCounter.toString(36)}`;
}
function resetIdCounter() {
  _idCounter = 0;
}
function addStation(net, s, opts = {}) {
  const station = {
    id: opts.id ?? nextId("s"),
    topic: s.topic,
    vibe: clampVibe(s.vibe),
    x: s.x,
    y: s.y,
    age_days: opts.age_days ?? 0,
    line_ids: []
  };
  net.stations.push(station);
  return station;
}
function removeStation(net, id) {
  const before = net.stations.length;
  net.stations = net.stations.filter((s) => s.id !== id);
  if (net.stations.length === before)
    return false;
  for (const line of net.lines) {
    line.station_ids = line.station_ids.filter((sid) => sid !== id);
  }
  const pruned_line_ids = new Set;
  net.lines = net.lines.filter((l) => {
    if (l.station_ids.length < 2) {
      pruned_line_ids.add(l.id);
      return false;
    }
    return true;
  });
  if (pruned_line_ids.size) {
    for (const s of net.stations) {
      s.line_ids = s.line_ids.filter((lid) => !pruned_line_ids.has(lid));
    }
  }
  return true;
}
function createLine(net, topic, station_ids, opts = {}) {
  if (station_ids.length < 2) {
    throw new Error("a line needs at least 2 stations");
  }
  const stations = net.stations.filter((s) => station_ids.includes(s.id));
  if (stations.length !== station_ids.length) {
    throw new Error("some station id(s) not in network");
  }
  const line = {
    id: opts.id ?? nextId("L"),
    topic,
    station_ids: [...station_ids]
  };
  net.lines.push(line);
  for (const s of stations) {
    if (!s.line_ids.includes(line.id))
      s.line_ids.push(line.id);
  }
  return line;
}
function isTransferStation(s) {
  return s.line_ids.length >= 2;
}
function clampVibe(v) {
  v = Math.floor(v);
  if (v < 1)
    return 1;
  if (v > 5)
    return 5;
  return v;
}

// src/game/weather.ts
var WEATHERS = {
  calm: {
    key: "calm",
    name: "凪",
    description: "アルゴリズムは穏やか",
    topic_multipliers: {},
    reset_ages: false
  },
  vlog_season: {
    key: "vlog_season",
    name: "Vlog 季節",
    description: "Vlog 系のトラフィックが伸びている",
    topic_multipliers: { vlog: 2 },
    reset_ages: false
  },
  gaming_chill: {
    key: "gaming_chill",
    name: "ゲーム冷気",
    description: "ゲーム系が冷え込んでいる",
    topic_multipliers: { gaming: 0.5 },
    reset_ages: false
  },
  thumb_war: {
    key: "thumb_war",
    name: "サムネ戦争",
    description: "vibe 1-2 の駅は伸びにくい",
    topic_multipliers: {},
    reset_ages: false,
    low_vibe_penalty: { max_vibe: 2, factor: 0.7 }
  },
  algo_reset: {
    key: "algo_reset",
    name: "アルゴリズム再構成",
    description: "全動画の age がリセット",
    topic_multipliers: {},
    reset_ages: true
  },
  shorts_storm: {
    key: "shorts_storm",
    name: "ショート嵐",
    description: "ショートにものすごい風が吹いている",
    topic_multipliers: { shorts: 2.2 },
    reset_ages: false
  },
  edu_renaissance: {
    key: "edu_renaissance",
    name: "学びルネサンス",
    description: "学び系が地味に伸びている",
    topic_multipliers: { edu: 1.8 },
    reset_ages: false
  }
};
var _ALL_KEYS = Object.keys(WEATHERS);
function nextWeather(_currentWeek, rng) {
  if (rng.chance(0.3))
    return WEATHERS.calm;
  const non_calm = _ALL_KEYS.filter((k) => k !== "calm");
  return WEATHERS[rng.pick(non_calm)];
}
function getWeather(key) {
  return WEATHERS[key];
}

// src/game/rng.ts
class RNG {
  state;
  constructor(seed) {
    let s = BigInt(seed);
    if (s === 0n)
      s = 1n;
    this.state = s;
  }
  next() {
    let x = this.state;
    x ^= x >> 12n;
    x ^= x << 25n;
    x ^= x >> 27n;
    this.state = x;
    const result = x * 2685821657736338717n & 0xFFFFFFFFFFFFFFFFn;
    return Number(result) / 18446744073709552000;
  }
  int(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  pick(arr) {
    return arr[this.int(0, arr.length - 1)];
  }
  chance(p) {
    return this.next() < p;
  }
}

// src/game/traffic.ts
function ageDecay(age_days) {
  return 1 / (1 + age_days * 0.18);
}
function vibeMultiplier(vibe) {
  const table = [0, 0.4, 0.7, 1, 1.4, 2];
  return table[Math.max(1, Math.min(5, vibe))];
}
function lineBonus(s, net) {
  let bonus = 1;
  for (const lid of s.line_ids) {
    const line = net.lines.find((l) => l.id === lid);
    if (!line)
      continue;
    if (line.topic === s.topic)
      bonus += 0.3;
    else
      bonus += 0.1;
  }
  if (isTransferStation(s))
    bonus += 0.5;
  return bonus;
}
function weatherMultiplier(s, w) {
  let m = w.topic_multipliers[s.topic] ?? 1;
  if (w.low_vibe_penalty && s.vibe <= w.low_vibe_penalty.max_vibe) {
    m *= w.low_vibe_penalty.factor;
  }
  return m;
}
function simulateDay(net, weather) {
  const per_station = {};
  const ages_after = {};
  let total_views = 0;
  for (const s of net.stations) {
    const base = TOPICS_BY_KEY[s.topic].base_views;
    const v = base * vibeMultiplier(s.vibe) * ageDecay(s.age_days) * lineBonus(s, net) * weatherMultiplier(s, weather);
    const views = Math.max(0, Math.round(v));
    per_station[s.id] = views;
    total_views += views;
    ages_after[s.id] = weather.reset_ages ? 0 : s.age_days + 1;
  }
  let subs = Math.floor(total_views / 200);
  const transfer_count = net.stations.filter(isTransferStation).length;
  subs += transfer_count * 5;
  return {
    views: total_views,
    per_station,
    subscribers_delta: subs,
    ages_after
  };
}
function applyDay(net, result) {
  for (const s of net.stations) {
    if (result.ages_after[s.id] !== undefined) {
      s.age_days = result.ages_after[s.id];
    }
  }
}

// src/game/game.ts
function newGame() {
  resetIdCounter();
  return {
    network: emptyNetwork(),
    day: 1,
    week: 1,
    subscribers: 100,
    total_views: 0,
    action_points: 3,
    weather: "calm",
    unlocked: { shorts_line: false, series_line: false, collab: false },
    history: []
  };
}
function maxActionPoints(state) {
  if (state.subscribers >= 1e5)
    return 6;
  if (state.subscribers >= 1e4)
    return 5;
  if (state.subscribers >= 1000)
    return 4;
  return 3;
}
function advanceDay(state, rng) {
  const weather = getWeather(state.weather);
  const result = simulateDay(state.network, weather);
  applyDay(state.network, result);
  const next = {
    ...state,
    day: state.day + 1,
    total_views: state.total_views + result.views,
    subscribers: state.subscribers + result.subscribers_delta,
    action_points: maxActionPoints(state),
    history: [
      ...state.history,
      { day: state.day, views: result.views, subs: result.subscribers_delta, weather: state.weather }
    ]
  };
  next.action_points = maxActionPoints(next);
  if (next.day % 7 === 0) {
    next.week += 1;
    next.weather = nextWeather(next.week, rng).key;
  }
  next.unlocked = { ...state.unlocked };
  if (next.subscribers >= 1000)
    next.unlocked.shorts_line = true;
  if (next.subscribers >= 1e4)
    next.unlocked.series_line = true;
  if (next.subscribers >= 1e5)
    next.unlocked.collab = true;
  return next;
}
function recentHistory(state, n = 7) {
  return [...state.history].slice(-n).reverse();
}

// src/game/save.ts
var SAVE_KEY = "chika-channel:save:v1";
function serialize(state) {
  return JSON.stringify(state);
}
function deserialize(raw) {
  if (!raw)
    return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null)
      return null;
    if (!("network" in parsed) || !("day" in parsed) || !("subscribers" in parsed)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
function loadFromLocalStorage() {
  if (typeof localStorage === "undefined")
    return null;
  return deserialize(localStorage.getItem(SAVE_KEY));
}
function saveToLocalStorage(state) {
  if (typeof localStorage === "undefined")
    return;
  localStorage.setItem(SAVE_KEY, serialize(state));
}

// src/client/app.ts
var VIEW_W = 800;
var VIEW_H = 520;
var DAY_DURATION_MS = 4000;
var $ = (sel) => document.querySelector(sel);
var map = document.querySelector("#map");
var toastEl = $("#toast");
var state = loadFromLocalStorage() ?? newGame();
var selectedStation = null;
var connectFrom = null;
var phase = "night";
var rng = new RNG(Date.now() & 4294967295);
function colorForLine(topic) {
  return TOPICS_BY_KEY[topic].color;
}
function stationXY(s) {
  return { x: 40 + s.x * (VIEW_W - 80), y: 40 + s.y * (VIEW_H - 80) };
}
function drawNetwork() {
  while (map.firstChild)
    map.removeChild(map.firstChild);
  const bg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  for (let i = 1;i < 10; i++) {
    const ln = document.createElementNS("http://www.w3.org/2000/svg", "line");
    ln.setAttribute("x1", String(VIEW_W / 10 * i));
    ln.setAttribute("x2", String(VIEW_W / 10 * i));
    ln.setAttribute("y1", "0");
    ln.setAttribute("y2", String(VIEW_H));
    ln.setAttribute("stroke", "#cfc4ab");
    ln.setAttribute("stroke-dasharray", "2 8");
    ln.setAttribute("stroke-width", "1");
    ln.setAttribute("opacity", "0.4");
    bg.appendChild(ln);
  }
  for (let i = 1;i < 7; i++) {
    const ln = document.createElementNS("http://www.w3.org/2000/svg", "line");
    ln.setAttribute("y1", String(VIEW_H / 7 * i));
    ln.setAttribute("y2", String(VIEW_H / 7 * i));
    ln.setAttribute("x1", "0");
    ln.setAttribute("x2", String(VIEW_W));
    ln.setAttribute("stroke", "#cfc4ab");
    ln.setAttribute("stroke-dasharray", "2 8");
    ln.setAttribute("stroke-width", "1");
    ln.setAttribute("opacity", "0.4");
    bg.appendChild(ln);
  }
  map.appendChild(bg);
  for (const line of state.network.lines) {
    if (line.station_ids.length < 2)
      continue;
    const pts = line.station_ids.map((id) => state.network.stations.find((s) => s.id === id)).filter((s) => !!s).map(stationXY).map((p) => `${p.x},${p.y}`).join(" ");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    path.setAttribute("points", pts);
    path.setAttribute("class", "line-path");
    path.setAttribute("stroke", colorForLine(line.topic));
    map.appendChild(path);
  }
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
    c.setAttribute("class", "station-circle" + (selectedStation && selectedStation.id === s.id ? " selected" : "") + (isTransfer ? " transfer" : ""));
    c.setAttribute("stroke", topic.color);
    g.appendChild(c);
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
          try {
            const sameTopic = connectFrom.topic === s.topic;
            const t = sameTopic ? s.topic : "shorts";
            createLine(state.network, t, [connectFrom.id, s.id]);
            saveAndRender();
            toast(`線を引いた: ${TOPICS_BY_KEY[t].name}`);
          } catch (err) {
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
    if (s.age_days > 14) {
      c.setAttribute("opacity", "0.55");
    }
  }
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
function selectStation(s) {
  selectedStation = s;
  renderPanel();
  drawNetwork();
}
function fmt(n) {
  if (n >= 1e6)
    return (n / 1e6).toFixed(2) + "M";
  if (n >= 1000)
    return (n / 1000).toFixed(1) + "k";
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
function setActionAvailability(stationSelected) {
  const ap = state.action_points;
  $("#btn-new").disabled = ap < 1;
  $("#btn-upgrade").disabled = !stationSelected || ap < 1 || (selectedStation?.vibe ?? 5) >= 5;
  $("#btn-connect").disabled = !stationSelected;
  $("#btn-delete").disabled = !stationSelected;
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
var toastTimer;
function toast(msg, durationMs = 1600) {
  toastEl.textContent = msg;
  toastEl.classList.add("on");
  if (toastTimer)
    window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastEl.classList.remove("on"), durationMs);
}
function handleNewStation() {
  if (state.action_points < 1) {
    toast("AP が足りない");
    return;
  }
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
  if (!selectedStation || state.action_points < 1)
    return;
  if (selectedStation.vibe >= 5)
    return;
  selectedStation.vibe = Math.min(5, selectedStation.vibe + 1);
  state.action_points -= 1;
  saveAndRender();
  toast(`vibe → ${selectedStation.vibe}`);
}
function handleConnect() {
  if (!selectedStation)
    return;
  connectFrom = selectedStation;
  renderHUD();
  toast("接続先の駅をクリックしてください");
}
function handleDelete() {
  if (!selectedStation)
    return;
  removeStation(state.network, selectedStation.id);
  selectedStation = null;
  saveAndRender();
  toast("駅を消した");
}
function pickRandomTopic() {
  const pool = ["cooking", "gaming", "vlog", "edu", "comedy"];
  if (state.unlocked.shorts_line)
    pool.push("shorts");
  return pool[Math.floor(Math.random() * pool.length)];
}
async function runDay() {
  if (phase === "running")
    return;
  if (state.network.stations.length === 0) {
    toast("最初の駅を作ってから");
    return;
  }
  phase = "running";
  renderHUD();
  $("#btn-next-day").disabled = true;
  const before = state;
  const newState = advanceDay(before, rng);
  const startSubs = before.subscribers;
  const startViews = before.total_views;
  const deltaSubs = newState.subscribers - startSubs;
  const deltaViews = newState.total_views - startViews;
  const t0 = performance.now();
  await new Promise((resolve) => {
    function step() {
      const t = Math.min(1, (performance.now() - t0) / DAY_DURATION_MS);
      const eased = 1 - (1 - t) * (1 - t);
      $("#hud-subs").textContent = fmt(Math.round(startSubs + deltaSubs * eased));
      $("#hud-views").textContent = fmt(Math.round(startViews + deltaViews * eased));
      if (t < 1)
        requestAnimationFrame(step);
      else
        resolve();
    }
    step();
  });
  state = newState;
  phase = "night";
  selectedStation = null;
  saveAndRender();
  $("#btn-next-day").disabled = false;
  if (newState.day % 7 === 1 && newState.day > 1) {
    toast(`今週の天候: ${getWeather(newState.weather).name}`);
  }
  if (newState.unlocked.shorts_line && !before.unlocked.shorts_line) {
    toast("\uD83C\uDF89 ショート線 解放 (1k 登録者)", 2400);
  }
  if (newState.unlocked.series_line && !before.unlocked.series_line) {
    toast("\uD83C\uDF89 シリーズ線 解放 (10k 登録者)", 2400);
  }
  if (newState.unlocked.collab && !before.unlocked.collab) {
    toast("\uD83C\uDF89 コラボ駅 解放 (100k 登録者)", 2400);
  }
}
function init() {
  $("#btn-new").addEventListener("click", handleNewStation);
  $("#btn-upgrade").addEventListener("click", handleUpgrade);
  $("#btn-connect").addEventListener("click", handleConnect);
  $("#btn-delete").addEventListener("click", handleDelete);
  $("#btn-next-day").addEventListener("click", () => {
    runDay();
  });
  $("#btn-reset").addEventListener("click", () => {
    if (confirm("チャンネルを最初から作り直しますか?")) {
      state = newGame();
      selectedStation = null;
      connectFrom = null;
      saveAndRender();
      toast("新しいチャンネルです");
    }
  });
  map.addEventListener("click", () => {
    if (connectFrom) {
      connectFrom = null;
      renderHUD();
      return;
    }
    selectedStation = null;
    renderPanel();
    drawNetwork();
  });
  render();
}
init();
