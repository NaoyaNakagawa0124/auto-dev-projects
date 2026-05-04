import init, { Mado } from "./pkg/mado.js";
import { WINDOWS } from "./data/windows.js";

const STORAGE_KEY = "mado.journal.v1";
const LAST_SCENE_KEY = "mado.last.v1";

const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");
const phrasesEl = document.getElementById("phrases");
const journalEl = document.getElementById("journal");
const journalList = document.getElementById("journal-list");
const journalEmpty = document.getElementById("journal-empty");
const journalCount = document.getElementById("journal-count");
const audioBtn = document.getElementById("audio-toggle");
const toastEl = document.getElementById("toast");

let mado = null;
let sceneIdx = 0;
let raf = null;
let lastT = 0;
let dpr = Math.max(1, window.devicePixelRatio || 1);
let cssW = 0, cssH = 0;
let starField = null; // generated once for night scene

// Per-scene caches (set on each loadScene)
let cachedGrad = null;
let cachedHeights = null;
let cachedLayers = 3;
let cachedPoints = 64;
let cachedKind = 0;

// Audio
let audioCtx = null;
let audioGain = null;
let audioSource = null;
let audioOn = false;
let audioBufferCache = new Map(); // sceneIdx -> AudioBuffer

// Journal
function loadJournal() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}
function saveJournal(j) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(j));
}

// ─── Scene selection ────────────────────────────────────
function pickInitialScene() {
  const last = parseInt(localStorage.getItem(LAST_SCENE_KEY) || "-1", 10);
  if (Number.isInteger(last) && last >= 0 && last < WINDOWS.length) {
    return (last + 1) % WINDOWS.length;
  }
  // Deterministic by date so the very first visit feels curated
  const d = new Date();
  const seed = d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate();
  return seed % WINDOWS.length;
}

// ─── Render helpers ─────────────────────────────────────
function resizeCanvas() {
  const r = canvas.getBoundingClientRect();
  cssW = r.width;
  cssH = r.height;
  dpr = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = Math.floor(cssW * dpr);
  canvas.height = Math.floor(cssH * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function rgb(arr, o) { return `rgb(${arr[o]}, ${arr[o+1]}, ${arr[o+2]})`; }

function drawSky(grad) {
  const g = ctx.createLinearGradient(0, 0, 0, cssH);
  g.addColorStop(0.00, rgb(grad, 0));
  g.addColorStop(0.45, rgb(grad, 3));
  g.addColorStop(0.78, rgb(grad, 6));
  g.addColorStop(1.00, rgb(grad, 9));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, cssW, cssH);
}

function drawStarsBackdrop() {
  if (!starField) return;
  ctx.save();
  for (const s of starField) {
    const tw = 0.55 + 0.45 * Math.sin(performance.now() * 0.001 * s.tw + s.phase);
    ctx.globalAlpha = s.a * tw;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(s.x * cssW, s.y * cssH * 0.6, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawSilhouettes(heights, layers, points, colors) {
  for (let layer = 0; layer < layers; layer++) {
    ctx.fillStyle = colors[Math.min(layer, colors.length - 1)];
    ctx.beginPath();
    ctx.moveTo(0, cssH);
    for (let i = 0; i < points; i++) {
      const t = i / (points - 1);
      const h = heights[layer * points + i];
      ctx.lineTo(t * cssW, h * cssH);
    }
    ctx.lineTo(cssW, cssH);
    ctx.closePath();
    ctx.fill();
  }
}

function drawParticles(parts, kind, accent) {
  // each particle is [x, y, opacity, size]
  ctx.save();
  for (let i = 0; i < parts.length; i += 4) {
    const px = parts[i] * cssW;
    const py = parts[i+1] * cssH;
    const op = parts[i+2];
    const sz = parts[i+3] * cssW; // size relative to width
    if (op <= 0 || sz <= 0) continue;

    if (kind === 4) {
      // aurora — big soft green/cyan blob
      const gr = ctx.createRadialGradient(px, py, 0, px, py, sz * 8);
      gr.addColorStop(0, `rgba(180, 255, 200, ${0.55 * op})`);
      gr.addColorStop(0.4, `rgba(120, 220, 200, ${0.25 * op})`);
      gr.addColorStop(1, "rgba(60, 160, 180, 0)");
      ctx.fillStyle = gr;
      ctx.fillRect(px - sz * 8, py - sz * 8, sz * 16, sz * 16);
    } else if (kind === 5) {
      // firefly — warm glow
      const gr = ctx.createRadialGradient(px, py, 0, px, py, sz * 6);
      gr.addColorStop(0, `rgba(255, 210, 110, ${0.85 * op})`);
      gr.addColorStop(0.4, `rgba(255, 160, 60, ${0.35 * op})`);
      gr.addColorStop(1, "rgba(255, 130, 40, 0)");
      ctx.fillStyle = gr;
      ctx.fillRect(px - sz * 6, py - sz * 6, sz * 12, sz * 12);
    } else if (kind === 1) {
      // snow — white soft disc
      const gr = ctx.createRadialGradient(px, py, 0, px, py, sz * 1.6);
      gr.addColorStop(0, `rgba(255, 255, 255, ${op})`);
      gr.addColorStop(0.7, `rgba(220, 230, 245, ${0.4 * op})`);
      gr.addColorStop(1, "rgba(220, 230, 245, 0)");
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(px, py, sz * 1.6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // dust mote — light tinted speck
      ctx.globalAlpha = op * 0.7;
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(px, py, Math.max(0.8, sz), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function generateStarField() {
  const out = [];
  let s = 31;
  const rnd = () => { s = (s * 1103515245 + 12345) >>> 0; return (s >>> 8) / (1 << 24); };
  for (let i = 0; i < 80; i++) {
    out.push({
      x: rnd(),
      y: rnd(),
      r: 0.4 + rnd() * 1.4,
      a: 0.4 + rnd() * 0.5,
      tw: 0.6 + rnd() * 1.4,
      phase: rnd() * Math.PI * 2,
    });
  }
  return out;
}

// ─── Audio ──────────────────────────────────────────────
function ensureAudioContext() {
  if (audioCtx) return audioCtx;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  audioGain = audioCtx.createGain();
  audioGain.gain.value = 0.0;
  audioGain.connect(audioCtx.destination);
  return audioCtx;
}

async function getSceneBuffer(idx) {
  if (audioBufferCache.has(idx)) return audioBufferCache.get(idx);
  const SAMPLE_RATE = 22050;
  const SECONDS = 14;
  const samples = mado.generate_audio_for(idx, SAMPLE_RATE, SECONDS);
  const ctxRef = ensureAudioContext();
  const buf = ctxRef.createBuffer(1, samples.length, SAMPLE_RATE);
  buf.copyToChannel(samples, 0);
  audioBufferCache.set(idx, buf);
  return buf;
}

async function startAudioForScene(idx) {
  const ctxRef = ensureAudioContext();
  if (ctxRef.state === "suspended") await ctxRef.resume();
  const buf = await getSceneBuffer(idx);
  if (audioSource) {
    try { audioSource.stop(); } catch {}
    audioSource.disconnect();
  }
  audioSource = ctxRef.createBufferSource();
  audioSource.buffer = buf;
  audioSource.loop = true;
  audioSource.connect(audioGain);
  audioSource.start();
  // smooth fade-in
  const now = ctxRef.currentTime;
  audioGain.gain.cancelScheduledValues(now);
  audioGain.gain.setValueAtTime(audioGain.gain.value, now);
  audioGain.gain.linearRampToValueAtTime(0.65, now + 1.4);
}

function stopAudio() {
  if (!audioCtx || !audioGain) return;
  const now = audioCtx.currentTime;
  audioGain.gain.cancelScheduledValues(now);
  audioGain.gain.setValueAtTime(audioGain.gain.value, now);
  audioGain.gain.linearRampToValueAtTime(0.0, now + 0.6);
  setTimeout(() => {
    if (audioSource) { try { audioSource.stop(); } catch {} audioSource.disconnect(); audioSource = null; }
  }, 700);
}

function setAudioButtonState(on) {
  audioBtn.setAttribute("aria-pressed", on ? "true" : "false");
  audioBtn.setAttribute("aria-label", on ? "環境音をとめる" : "環境音をならす");
  audioBtn.querySelector(".audio-label").textContent = on ? "音をとめる" : "音をそっと";
}

async function toggleAudio() {
  audioOn = !audioOn;
  setAudioButtonState(audioOn);
  if (audioOn) {
    await startAudioForScene(sceneIdx);
  } else {
    stopAudio();
  }
}

// ─── UI rendering ───────────────────────────────────────
function renderTexts(w) {
  document.querySelectorAll("[data-bind]").forEach(el => {
    const k = el.getAttribute("data-bind");
    el.textContent = w[k] ?? "";
  });
  document.documentElement.style.setProperty("--accent", w.accentColor);
  document.title = `窓 — ${w.city}・${w.moment}`;
}

function renderPhrases(w) {
  const journal = loadJournal();
  const collectedKey = id => journal.some(j => j.key === id);

  phrasesEl.innerHTML = "";
  w.phrases.forEach((p, i) => {
    const key = `${w.id}::${i}`;
    const card = document.createElement("article");
    card.className = "phrase";
    card.innerHTML = `
      <p class="native"></p>
      <p class="roman"></p>
      <p class="meaning"></p>
      <p class="scene"></p>
      <button class="phrase-collect" type="button">
        <span></span>
      </button>
    `;
    card.querySelector(".native").textContent = p.native;
    card.querySelector(".roman").textContent = p.roman;
    card.querySelector(".meaning").textContent = p.meaning;
    card.querySelector(".scene").textContent = p.scene;

    const btn = card.querySelector(".phrase-collect");
    const lbl = btn.querySelector("span");
    const setLabel = (collected) => {
      lbl.textContent = collected ? "集めた" : "言葉を集める";
      btn.classList.toggle("collected", collected);
    };
    setLabel(collectedKey(key));
    btn.addEventListener("click", () => {
      const j = loadJournal();
      const idx = j.findIndex(x => x.key === key);
      if (idx >= 0) {
        j.splice(idx, 1);
        saveJournal(j);
        setLabel(false);
        showToast("そっと手放しました");
      } else {
        j.unshift({
          key,
          native: p.native,
          roman: p.roman,
          meaning: p.meaning,
          city: w.city,
          country: w.country,
          language: w.language,
          collectedAt: new Date().toISOString(),
        });
        saveJournal(j);
        setLabel(true);
        showToast("言葉を集めました");
      }
      updateJournalCount();
    });
    phrasesEl.appendChild(card);
  });
}

function showToast(text) {
  toastEl.textContent = text;
  toastEl.classList.add("visible");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toastEl.classList.remove("visible"), 1800);
}

function updateJournalCount() {
  const n = loadJournal().length;
  journalCount.textContent = String(n);
}

function renderJournal() {
  const j = loadJournal();
  journalList.innerHTML = "";
  if (j.length === 0) {
    journalEmpty.style.display = "block";
    return;
  }
  journalEmpty.style.display = "none";
  for (const item of j) {
    const li = document.createElement("li");
    const d = new Date(item.collectedAt);
    const date = `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")}`;
    li.innerHTML = `
      <div class="j-native"></div>
      <div class="j-meaning"></div>
      <div class="j-meta"></div>
      <button class="j-remove" type="button">手放す</button>
    `;
    li.querySelector(".j-native").textContent = item.native;
    li.querySelector(".j-meaning").textContent = item.meaning;
    li.querySelector(".j-meta").textContent = `${item.city}・${item.language}・${date}`;
    li.querySelector(".j-remove").addEventListener("click", () => {
      const cur = loadJournal();
      const i = cur.findIndex(x => x.key === item.key);
      if (i >= 0) {
        cur.splice(i, 1);
        saveJournal(cur);
        renderJournal();
        updateJournalCount();
        renderPhrases(WINDOWS[sceneIdx]);
      }
    });
    journalList.appendChild(li);
  }
}

// ─── Scene transition ───────────────────────────────────
async function loadScene(idx, { startAudio = false } = {}) {
  sceneIdx = ((idx % WINDOWS.length) + WINDOWS.length) % WINDOWS.length;
  localStorage.setItem(LAST_SCENE_KEY, String(sceneIdx));
  mado.set_scene(sceneIdx);
  cachedGrad = mado.gradient();
  cachedHeights = mado.silhouettes();
  cachedLayers = mado.silhouette_layers();
  cachedPoints = mado.silhouette_points();
  cachedKind = mado.particle_kind();
  starField = sceneIdx === 5 ? generateStarField() : null;
  const w = WINDOWS[sceneIdx];
  renderTexts(w);
  renderPhrases(w);
  if (audioOn || startAudio) {
    if (startAudio) {
      audioOn = true;
      setAudioButtonState(true);
    }
    await startAudioForScene(sceneIdx);
  }
}

// ─── Animation loop ─────────────────────────────────────
function frame(t) {
  if (!lastT) lastT = t;
  const dt = Math.min(0.05, (t - lastT) / 1000);
  lastT = t;
  mado.tick(dt);

  drawSky(cachedGrad);
  if (starField) drawStarsBackdrop();
  drawSilhouettes(cachedHeights, cachedLayers, cachedPoints, WINDOWS[sceneIdx].silhouetteColors);
  drawParticles(mado.particles(), cachedKind, WINDOWS[sceneIdx].accentColor);

  raf = requestAnimationFrame(frame);
}

// ─── Boot ───────────────────────────────────────────────
async function boot() {
  await init();
  mado = new Mado();
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  updateJournalCount();
  await loadScene(pickInitialScene());

  raf = requestAnimationFrame(frame);

  // controls
  document.getElementById("next-window").addEventListener("click", () => {
    loadScene(sceneIdx + 1);
  });
  document.getElementById("open-journal").addEventListener("click", () => {
    renderJournal();
    journalEl.setAttribute("aria-hidden", "false");
  });
  document.getElementById("close-journal").addEventListener("click", () => {
    journalEl.setAttribute("aria-hidden", "true");
  });
  journalEl.addEventListener("click", (e) => {
    if (e.target === journalEl) journalEl.setAttribute("aria-hidden", "true");
  });
  document.getElementById("journal-clear").addEventListener("click", () => {
    if (loadJournal().length === 0) return;
    saveJournal([]);
    renderJournal();
    updateJournalCount();
    renderPhrases(WINDOWS[sceneIdx]);
    showToast("すべて手放しました");
  });
  audioBtn.addEventListener("click", () => { toggleAudio(); });

  // pause loop when tab hidden, save battery
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    } else if (!raf) {
      lastT = 0;
      raf = requestAnimationFrame(frame);
    }
  });
}

boot().catch(err => {
  console.error(err);
  document.body.innerHTML = `<pre style="color:#fff;padding:30px;font-family:monospace;">窓を開けるのに失敗しました：\n${err}</pre>`;
});
