// ikitsugi content script — breathing dot injected into every page via Shadow DOM.
// Self-contained: no ES module imports (MV3 content scripts can't easily import).

(() => {
  if (window.__ikitsugiInstalled) return;
  window.__ikitsugiInstalled = true;

  // ---- breathing patterns (mirror of src/modules/breath.js) ----
  const PATTERNS = {
    box:  { inhale: 4, hold_in: 4, exhale: 4, hold_out: 4 },
    r478: { inhale: 4, hold_in: 7, exhale: 8, hold_out: 0 },
    f448: { inhale: 4, hold_in: 4, exhale: 8, hold_out: 0 },
  };
  const PATTERN_LABEL = { box: "ボックス", r478: "4-7-8", f448: "4-4-8" };
  const PHASE_LABEL = { inhale: "吸う", hold_in: "止める", exhale: "吐く", hold_out: "止める" };
  const COLOR_AMBER = [245, 200, 74];
  const COLOR_BLUE = [130, 192, 255];

  const cycleLength = (p) => p.inhale + p.hold_in + p.exhale + p.hold_out;
  function phaseAt(p, t) {
    const len = cycleLength(p);
    if (len <= 0) return "inhale";
    let x = t % len;
    if (x < 0) x += len;
    if (x < p.inhale) return "inhale";
    if (x < p.inhale + p.hold_in) return "hold_in";
    if (x < p.inhale + p.hold_in + p.exhale) return "exhale";
    return "hold_out";
  }
  function phaseProgress(p, t) {
    const len = cycleLength(p);
    if (len <= 0) return 0;
    let x = t % len;
    if (x < 0) x += len;
    const ph = phaseAt(p, t);
    if (ph === "inhale") return p.inhale ? x / p.inhale : 0;
    if (ph === "hold_in") return p.hold_in ? (x - p.inhale) / p.hold_in : 0;
    if (ph === "exhale") return p.exhale ? (x - p.inhale - p.hold_in) / p.exhale : 0;
    return p.hold_out ? (x - p.inhale - p.hold_in - p.exhale) / p.hold_out : 0;
  }
  function fullnessAt(p, t) {
    const ph = phaseAt(p, t);
    const pr = phaseProgress(p, t);
    if (ph === "inhale") return pr;
    if (ph === "hold_in") return 1;
    if (ph === "exhale") return 1 - pr;
    return 0;
  }
  function colorAt(p, t) {
    const ph = phaseAt(p, t);
    const pr = phaseProgress(p, t);
    let mix;
    if (ph === "inhale") mix = pr;
    else if (ph === "hold_in") mix = 1;
    else if (ph === "exhale") mix = 1 - pr;
    else mix = 0;
    const r = Math.round(COLOR_BLUE[0] + (COLOR_AMBER[0] - COLOR_BLUE[0]) * mix);
    const g = Math.round(COLOR_BLUE[1] + (COLOR_AMBER[1] - COLOR_BLUE[1]) * mix);
    const b = Math.round(COLOR_BLUE[2] + (COLOR_AMBER[2] - COLOR_BLUE[2]) * mix);
    return `rgb(${r}, ${g}, ${b})`;
  }

  // ---- default settings ----
  const DEFAULTS = {
    pattern: "f448",
    enabled: true,
    position: "bottom-right",
    dot_size: 28,
    hide_on_fullscreen: true,
    hide_on_video: true,
    show_label: false,
  };

  let settings = { ...DEFAULTS };
  let sessionStart = null;        // null = idle dot; number = active 60s session start time (ms)
  const SESSION_DURATION_MS = 60_000;
  let lastSessionCycles = 0;

  // ---- shadow root host ----
  const host = document.createElement("div");
  host.id = "ikitsugi-host";
  host.style.cssText =
    "position:fixed;z-index:2147483647;pointer-events:none;inset:0;width:0;height:0;";
  (document.documentElement || document.body).appendChild(host);
  const shadow = host.attachShadow({ mode: "closed" });

  const STYLE = `
    :host { all: initial; }
    .root {
      position: fixed;
      pointer-events: none;
      transition: opacity 280ms ease;
      opacity: 1;
    }
    .root.hidden { opacity: 0; }
    .root.bottom-right { right: 16px; bottom: 16px; }
    .root.bottom-left  { left: 16px;  bottom: 16px; }
    .root.top-right    { right: 16px; top: 16px; }
    .root.top-left     { left: 16px;  top: 16px; }

    .dot {
      pointer-events: auto;
      cursor: pointer;
      display: grid;
      place-items: center;
      border-radius: 50%;
      transition: width 240ms ease, height 240ms ease, box-shadow 240ms ease;
      backdrop-filter: blur(6px);
      background: rgba(10, 14, 26, 0.55);
      border: 1px solid rgba(255,255,255,0.08);
    }

    .pulse {
      width: 70%;
      height: 70%;
      border-radius: 50%;
      box-shadow: 0 0 24px rgba(245, 200, 74, 0.25);
      transition: background-color 200ms linear;
    }

    .label {
      position: absolute;
      bottom: calc(100% + 6px);
      left: 50%;
      transform: translateX(-50%);
      font: 600 11px/1 -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic UI", system-ui, sans-serif;
      color: #f1ead2;
      background: rgba(10, 14, 26, 0.85);
      padding: 4px 8px;
      border-radius: 999px;
      white-space: nowrap;
      pointer-events: none;
      letter-spacing: 0.04em;
      opacity: 0.85;
    }

    .session {
      pointer-events: auto;
      width: 220px;
      height: 220px;
      display: grid;
      grid-template-rows: 1fr auto auto;
      gap: 4px;
      padding: 18px;
      box-sizing: border-box;
      border-radius: 28px;
      background: rgba(10, 14, 26, 0.92);
      color: #f1ead2;
      backdrop-filter: blur(14px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.45);
      border: 1px solid rgba(255,255,255,0.06);
      font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic UI", system-ui, sans-serif;
    }
    .session .visual {
      position: relative;
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
    }
    .session .ring {
      width: 60%;
      height: 60%;
      border-radius: 50%;
      transition: background-color 200ms linear, transform 200ms linear;
      box-shadow: 0 0 32px rgba(245, 200, 74, 0.35);
    }
    .session .phase {
      position: absolute;
      font-size: 14px;
      letter-spacing: 0.2em;
      color: rgba(241, 234, 210, 0.9);
    }
    .session .meta {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: rgba(241, 234, 210, 0.6);
      letter-spacing: 0.06em;
    }
    .session .bar {
      height: 3px;
      width: 100%;
      background: rgba(255,255,255,0.06);
      border-radius: 999px;
      overflow: hidden;
    }
    .session .bar > i {
      display: block;
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #82c0ff, #f5c84a);
      transition: width 200ms linear;
    }
    .session .close {
      position: absolute;
      top: 8px;
      right: 10px;
      width: 22px;
      height: 22px;
      border: 0;
      background: transparent;
      color: rgba(241, 234, 210, 0.5);
      cursor: pointer;
      font-size: 14px;
      border-radius: 50%;
    }
    .session .close:hover { color: #f1ead2; background: rgba(255,255,255,0.06); }
  `;

  const styleEl = document.createElement("style");
  styleEl.textContent = STYLE;
  shadow.appendChild(styleEl);

  const root = document.createElement("div");
  root.className = `root ${DEFAULTS.position}`;
  shadow.appendChild(root);

  // dot view
  const dotEl = document.createElement("div");
  dotEl.className = "dot";
  const pulseEl = document.createElement("div");
  pulseEl.className = "pulse";
  const labelEl = document.createElement("div");
  labelEl.className = "label";
  dotEl.appendChild(pulseEl);
  dotEl.appendChild(labelEl);

  // session view
  const sessionEl = document.createElement("div");
  sessionEl.className = "session";
  sessionEl.innerHTML = `
    <button class="close" type="button" aria-label="閉じる">✕</button>
    <div class="visual">
      <div class="ring"></div>
      <div class="phase">吸う</div>
    </div>
    <div class="meta"><span class="left">パターン</span><span class="right">残り 60秒</span></div>
    <div class="bar"><i></i></div>
  `;
  const sessRing = sessionEl.querySelector(".ring");
  const sessPhase = sessionEl.querySelector(".phase");
  const sessLeft = sessionEl.querySelector(".meta .left");
  const sessRight = sessionEl.querySelector(".meta .right");
  const sessBar = sessionEl.querySelector(".bar > i");
  const sessClose = sessionEl.querySelector(".close");

  root.appendChild(dotEl);

  // ---- interactions ----
  dotEl.addEventListener("click", startSession);
  sessClose.addEventListener("click", endSession);

  function startSession() {
    if (sessionStart !== null) return;
    sessionStart = performance.now();
    lastSessionCycles = 0;
    root.replaceChild(sessionEl, dotEl);
    sessLeft.textContent = `パターン ${PATTERN_LABEL[settings.pattern] ?? settings.pattern}`;
  }
  function endSession() {
    if (sessionStart === null) return;
    const elapsedMs = performance.now() - sessionStart;
    const duration_sec = Math.min(SESSION_DURATION_MS, elapsedMs) / 1000;
    const cycles = lastSessionCycles;
    sessionStart = null;
    if (duration_sec >= 10 && cycles >= 1) {
      try {
        chrome.runtime.sendMessage({
          type: "ikitsugi:session-complete",
          duration_sec,
          cycles,
        });
      } catch (e) { /* extension reloaded */ }
    }
    root.replaceChild(dotEl, sessionEl);
  }

  // ---- visibility (fullscreen, video, hidden tab) ----
  function isFullscreen() {
    return !!document.fullscreenElement;
  }
  function isLargeVideoPlaying() {
    const vids = document.querySelectorAll("video");
    for (const v of vids) {
      if (v.paused || v.ended) continue;
      const r = v.getBoundingClientRect();
      if (r.width >= window.innerWidth * 0.6 && r.height >= window.innerHeight * 0.6) return true;
    }
    return false;
  }
  function updateVisibility() {
    if (!settings.enabled) {
      root.classList.add("hidden");
      return;
    }
    if (document.hidden) {
      root.classList.add("hidden");
      return;
    }
    if (settings.hide_on_fullscreen && isFullscreen()) {
      root.classList.add("hidden");
      return;
    }
    if (settings.hide_on_video && isLargeVideoPlaying()) {
      root.classList.add("hidden");
      return;
    }
    root.classList.remove("hidden");
  }
  document.addEventListener("fullscreenchange", updateVisibility);
  document.addEventListener("visibilitychange", updateVisibility);
  setInterval(updateVisibility, 1500);

  // ---- apply settings ----
  function applySettings(s) {
    settings = { ...DEFAULTS, ...s };
    root.classList.remove("bottom-right", "bottom-left", "top-right", "top-left");
    root.classList.add(settings.position);
    const sz = Math.max(18, Math.min(48, Number(settings.dot_size) || 28));
    dotEl.style.width = `${sz}px`;
    dotEl.style.height = `${sz}px`;
    labelEl.style.display = settings.show_label ? "" : "none";
    updateVisibility();
  }

  // ---- load settings, listen for updates ----
  try {
    chrome.storage.local.get("ikitsugi/settings", (res) => {
      applySettings(res?.["ikitsugi/settings"] ?? {});
    });
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "local") return;
      if (changes["ikitsugi/settings"]) {
        applySettings(changes["ikitsugi/settings"].newValue ?? {});
      }
    });
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg?.type === "ikitsugi:start-session") startSession();
    });
  } catch (e) {
    applySettings({});
  }

  // ---- render loop ----
  const t0 = performance.now() / 1000;
  function frame() {
    const now = performance.now() / 1000;
    const t = now - t0;
    const p = PATTERNS[settings.pattern] ?? PATTERNS.f448;
    const fullness = fullnessAt(p, t);
    const color = colorAt(p, t);
    const phase = phaseAt(p, t);

    // idle dot
    const baseScale = 0.55 + 0.45 * fullness; // pulse from ~55% to 100%
    pulseEl.style.transform = `scale(${baseScale.toFixed(3)})`;
    pulseEl.style.background = color;
    if (settings.show_label) {
      labelEl.textContent = PHASE_LABEL[phase];
    }

    // session view
    if (sessionStart !== null) {
      const elapsedMs = performance.now() - sessionStart;
      const remaining = Math.max(0, SESSION_DURATION_MS - elapsedMs);
      const t2 = elapsedMs / 1000;
      const p2 = PATTERNS[settings.pattern] ?? PATTERNS.f448;
      const f2 = fullnessAt(p2, t2);
      const c2 = colorAt(p2, t2);
      const ph2 = phaseAt(p2, t2);
      lastSessionCycles = Math.floor(t2 / Math.max(0.001, cycleLength(p2)));
      const s = 0.5 + 0.5 * f2;
      sessRing.style.transform = `scale(${s.toFixed(3)})`;
      sessRing.style.background = c2;
      sessPhase.textContent = PHASE_LABEL[ph2];
      sessRight.textContent = `残り ${Math.ceil(remaining / 1000)}秒`;
      sessBar.style.width = `${(elapsedMs / SESSION_DURATION_MS) * 100}%`;
      if (remaining <= 0) endSession();
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
