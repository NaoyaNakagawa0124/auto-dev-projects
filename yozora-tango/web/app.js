import { GameSession, closerFor } from "../src/game.js";
import { CONSTELLATIONS } from "../src/constellations.js";

const SESSION_MS = 5 * 60 * 1000;
const COLLECTION_KEY = "yozora-tango:collection";

const $ = (sel) => document.querySelector(sel);
const app = $("#app");

let session = null;
let sessionStart = 0;
let tickerId = null;
let sketch = null;

function setScreen(name) {
  app.classList.remove("screen-intro", "screen-round", "screen-result");
  app.classList.add(`screen-${name}`);
}

// ----- Collection (localStorage) -----
function loadCollection() {
  try {
    const raw = localStorage.getItem(COLLECTION_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}
function saveCollection(c) {
  try { localStorage.setItem(COLLECTION_KEY, JSON.stringify(c)); } catch { /* ignore */ }
}
function recordCompletion(constellationIds) {
  const c = loadCollection();
  for (const id of constellationIds) {
    c[id] = (c[id] || 0) + 1;
  }
  saveCollection(c);
}
function renderCollection() {
  const c = loadCollection();
  const grid = $("#collection-grid");
  grid.innerHTML = "";
  for (const cn of CONSTELLATIONS) {
    const tile = document.createElement("div");
    tile.className = "collection-tile";
    const count = c[cn.id] || 0;
    tile.innerHTML = `<div>${cn.jp}</div><div class="count">${count}</div>`;
    grid.appendChild(tile);
  }
}

// ----- p5.js sketch -----
function startSketch() {
  const host = document.getElementById("canvas-host");
  host.innerHTML = "";

  const sketchFn = (p) => {
    let backgroundStars = [];
    let canvasW = 480;
    let canvasH = 480;

    p.setup = () => {
      const rect = host.getBoundingClientRect();
      canvasW = Math.floor(rect.width);
      canvasH = Math.floor(rect.height) || canvasW;
      const c = p.createCanvas(canvasW, canvasH);
      c.parent(host);
      // background stars
      for (let i = 0; i < 60; i++) {
        backgroundStars.push({
          x: Math.random() * canvasW,
          y: Math.random() * canvasH,
          r: 0.4 + Math.random() * 1.4,
          tw: Math.random() * Math.PI * 2,
        });
      }
    };

    p.windowResized = () => {
      const rect = host.getBoundingClientRect();
      canvasW = Math.floor(rect.width);
      canvasH = Math.floor(rect.height) || canvasW;
      p.resizeCanvas(canvasW, canvasH);
    };

    p.draw = () => {
      p.background(26, 34, 56);          // --night
      // twinkling background
      p.noStroke();
      for (const s of backgroundStars) {
        const a = 100 + 60 * Math.sin(p.frameCount * 0.05 + s.tw);
        p.fill(255, 255, 255, a);
        p.ellipse(s.x, s.y, s.r * 2, s.r * 2);
      }
      drawConstellation(p);
    };

    function drawConstellation(p) {
      if (!session) return;
      const c = session.currentConstellation();
      if (!c) return;
      const ref = CONSTELLATIONS.find(cc => cc.id === c.id);
      if (!ref) return;
      const margin = canvasW * 0.10;
      const W = canvasW - margin * 2;
      const H = canvasH - margin * 2;

      // edges first (only those touching a lit star get colored)
      for (const [a, b] of ref.edges) {
        const lit = a < c.filled && b < c.filled;
        const dim = a < c.filled || b < c.filled;
        if (lit) {
          p.stroke(212, 184, 122, 200);  // --lamp-2
          p.strokeWeight(1.4);
        } else if (dim) {
          p.stroke(255, 210, 138, 70);
          p.strokeWeight(0.8);
        } else {
          p.stroke(255, 255, 255, 18);
          p.strokeWeight(0.6);
        }
        const pa = ref.points[a], pb = ref.points[b];
        p.line(margin + pa.x * W, margin + pa.y * H,
               margin + pb.x * W, margin + pb.y * H);
      }
      // points
      ref.points.forEach((pt, i) => {
        const lit = i < c.filled;
        const cx = margin + pt.x * W;
        const cy = margin + pt.y * H;
        if (lit) {
          // glow halo
          for (let r = 14; r >= 4; r -= 2) {
            p.noStroke();
            p.fill(255, 210, 138, 18);
            p.ellipse(cx, cy, r * 2, r * 2);
          }
          p.fill(255, 210, 138, 230);
          p.noStroke();
          p.ellipse(cx, cy, 8, 8);
        } else {
          p.noStroke();
          p.fill(150, 165, 200, 130);
          p.ellipse(cx, cy, 4, 4);
        }
      });
      // constellation name (faint)
      p.fill(212, 184, 122, 160);
      p.noStroke();
      p.textSize(11);
      p.textAlign(p.CENTER, p.TOP);
      p.text(c.jp, canvasW / 2, 10);
    }
  };

  sketch = new p5(sketchFn);
}
function stopSketch() {
  if (sketch) { sketch.remove(); sketch = null; }
}

// ----- Round flow -----
function renderCard() {
  if (!session) return;
  const card = session.currentCard();
  if (!card) return;
  $("#card-hint").textContent = card.hint;
  $("#card-en").textContent   = card.en;
  $("#card-jp").textContent   = card.jp;
  $("#hud-done").textContent  = String(session.completedConstellations().length);
}

function tick() {
  const elapsed = Date.now() - sessionStart;
  const remaining = Math.max(0, SESSION_MS - elapsed);
  const m = Math.floor(remaining / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  $("#hud-time").textContent = `${m}:${s.toString().padStart(2, "0")}`;
  if (remaining <= 0 || session.isFinished()) {
    finishRound();
  }
}

function startRound() {
  const seed = (Date.now() ^ Math.floor(Math.random() * 0xffff)) | 0;
  session = new GameSession(seed);
  sessionStart = Date.now();
  setScreen("round");
  renderCard();
  startSketch();
  if (tickerId) clearInterval(tickerId);
  tickerId = setInterval(tick, 250);
  tick();
}

function handleHit() {
  if (!session) return;
  const res = session.hit();
  renderCard();
  if (res.result === "finished") finishRound();
}
function handleMiss() {
  if (!session) return;
  const res = session.miss();
  renderCard();
  if (res.result === "finished") finishRound();
}

function finishRound() {
  if (tickerId) { clearInterval(tickerId); tickerId = null; }
  stopSketch();
  const sum = session.summary();
  recordCompletion(sum.completed.map(c => c.id));
  const completedText = sum.completed.length
    ? sum.completed.map(c => c.jp).join("、 ")
    : "今夜 は 集まりません でした";
  $("#result-summary").innerHTML = `
    <div><span class="num">${sum.completed.length}</span> の 星座 が 完成 しました。</div>
    <div>${completedText}</div>
    <div class="dim">思い出せた: ${sum.hits} 件  /  見送り: ${sum.misses} 件</div>
  `;
  $("#result-closer").textContent = closerFor(sum, sum.hits | sum.misses);
  setScreen("result");
}

// ----- Boot -----
function boot() {
  setScreen("intro");
  renderCollection();
  $("#start-btn").addEventListener("click", startRound);
  $("#again-btn").addEventListener("click", () => {
    setScreen("intro");
    renderCollection();
  });
  $("#hit-btn").addEventListener("click", handleHit);
  $("#miss-btn").addEventListener("click", handleMiss);

  document.addEventListener("keydown", (e) => {
    if (!app.classList.contains("screen-round")) return;
    if (e.key === "j" || e.key === "ArrowLeft") handleMiss();
    if (e.key === "k" || e.key === "ArrowRight" || e.key === " ") {
      e.preventDefault();
      handleHit();
    }
  });
}

// Wait for p5 to be present before booting.
if (window.p5) {
  boot();
} else {
  window.addEventListener("load", boot);
}
