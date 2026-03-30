/**
 * HUD (Heads-Up Display) overlay component for Neon Reader.
 * Shows character count, reading time, and scroll progress.
 */

// eslint-disable-next-line no-unused-vars
function createHud(container, charCount, readingTimeMinutes, theme) {
  const hud = document.createElement('div');
  hud.id = 'neon-reader-hud';
  hud.innerHTML = `
    <div class="neon-hud-item">
      <span class="neon-hud-label">文字数:</span>
      <span class="neon-hud-value" id="neon-hud-charcount">${charCount.toLocaleString()}</span>
    </div>
    <div class="neon-hud-item">
      <span class="neon-hud-label">読了時間:</span>
      <span class="neon-hud-value" id="neon-hud-readtime">~${readingTimeMinutes}分</span>
    </div>
    <div class="neon-hud-item">
      <span class="neon-hud-label">進捗:</span>
      <span class="neon-hud-value" id="neon-hud-progress">0%</span>
    </div>
  `;

  applyHudTheme(hud, theme);
  container.appendChild(hud);
  return hud;
}

// eslint-disable-next-line no-unused-vars
function applyHudTheme(hud, theme) {
  if (!hud) return;
  hud.style.cssText = `
    position: fixed;
    top: 16px;
    right: 16px;
    background: rgba(10, 10, 15, 0.9);
    border: 1px solid ${theme.accent};
    border-radius: 8px;
    padding: 12px 16px;
    z-index: 2147483647;
    font-family: 'Courier New', 'Source Code Pro', monospace;
    font-size: 14px;
    box-shadow: ${theme.glow}, inset 0 0 20px rgba(0,0,0,0.5);
    pointer-events: none;
    min-width: 160px;
  `;

  const labels = hud.querySelectorAll('.neon-hud-label');
  const values = hud.querySelectorAll('.neon-hud-value');

  labels.forEach((label) => {
    label.style.cssText = `
      color: ${theme.dim.replace('80', 'cc')};
      margin-right: 6px;
      font-size: 13px;
    `;
  });

  values.forEach((value) => {
    value.style.cssText = `
      color: ${theme.text};
      font-weight: bold;
      text-shadow: 0 0 6px ${theme.accent}60;
      font-size: 14px;
    `;
  });

  const items = hud.querySelectorAll('.neon-hud-item');
  items.forEach((item) => {
    item.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 3px 0;
    `;
  });
}

// eslint-disable-next-line no-unused-vars
function updateHudProgress(progressPercent) {
  const el = document.getElementById('neon-hud-progress');
  if (el) {
    el.textContent = `${Math.round(progressPercent)}%`;
  }
}
