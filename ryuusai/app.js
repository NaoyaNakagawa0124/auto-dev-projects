/**
 * 流彩 (Ryuusai) — Main Application
 * Digital Suminagashi Art Generator
 */

// ===== Configuration =====
const GRID_SIZE = 128;
const CANVAS_BG_ALPHA = 255;

// ===== State =====
let fluid;
let currentPalette = 'wabi';
let selectedColorIdx = 0;
let brushSize = 5;
let flowStrength = 5;
let gallery;
let isAutoMode = false;
let autoTimer = null;
let hasInteracted = false;
let pixelBuffer;
let canvasW, canvasH;
let scaleX, scaleY;

// Washi paper texture
let washiPattern = null;

// ===== p5.js Setup =====
function setup() {
  const container = document.getElementById('canvas-wrapper');
  canvasW = container.offsetWidth;
  canvasH = container.offsetHeight;

  const canvas = createCanvas(canvasW, canvasH);
  canvas.parent('canvas-wrapper');
  pixelDensity(1);

  fluid = new FluidSolver(GRID_SIZE);
  scaleX = canvasW / GRID_SIZE;
  scaleY = canvasH / GRID_SIZE;

  pixelBuffer = createImage(GRID_SIZE, GRID_SIZE);

  gallery = new GalleryManager();

  // Generate washi texture
  generateWashiTexture();

  // Initialize UI
  initUI();

  // Prevent context menu on canvas
  canvas.elt.addEventListener('contextmenu', e => e.preventDefault());
}

function generateWashiTexture() {
  washiPattern = createGraphics(canvasW, canvasH);
  washiPattern.loadPixels();
  for (let i = 0; i < washiPattern.pixels.length; i += 4) {
    const noise = random(-8, 8);
    washiPattern.pixels[i] = 128 + noise;
    washiPattern.pixels[i + 1] = 128 + noise;
    washiPattern.pixels[i + 2] = 128 + noise;
    washiPattern.pixels[i + 3] = 15; // Very subtle
  }
  washiPattern.updatePixels();
}

// ===== p5.js Draw Loop =====
function draw() {
  // Step the simulation
  fluid.step();

  // Auto mode: periodically add ink and gentle forces
  if (isAutoMode && frameCount % 30 === 0) {
    autoDropInk();
  }

  // Render
  renderFluid();
}

function renderFluid() {
  const N = GRID_SIZE;
  const palette = getPalette(currentPalette);

  // Parse background color
  const bg = hexToRgb(palette.background);

  pixelBuffer.loadPixels();

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const idx = fluid.IX(i + 1, j + 1);
      const pIdx = (j * N + i) * 4;

      const dr = fluid.densityR[idx];
      const dg = fluid.densityG[idx];
      const db = fluid.densityB[idx];
      const da = fluid.densityA[idx];

      // Clamp alpha
      const alpha = Math.min(1.0, da);

      // Blend ink over background
      pixelBuffer.pixels[pIdx]     = Math.floor(bg.r * (1 - alpha) + dr * 255 * alpha);
      pixelBuffer.pixels[pIdx + 1] = Math.floor(bg.g * (1 - alpha) + dg * 255 * alpha);
      pixelBuffer.pixels[pIdx + 2] = Math.floor(bg.b * (1 - alpha) + db * 255 * alpha);
      pixelBuffer.pixels[pIdx + 3] = CANVAS_BG_ALPHA;
    }
  }

  pixelBuffer.updatePixels();

  // Draw scaled up
  image(pixelBuffer, 0, 0, canvasW, canvasH);

  // Overlay washi texture
  if (washiPattern) {
    image(washiPattern, 0, 0);
  }
}

// ===== Interaction =====
function mouseDragged() {
  if (mouseY < 0 || mouseY > canvasH) return;
  if (!hasInteracted) hideHint();

  const x = Math.floor(mouseX / scaleX);
  const y = Math.floor(mouseY / scaleY);
  const px = Math.floor(pmouseX / scaleX);
  const py = Math.floor(pmouseY / scaleY);

  if (x < 1 || x > GRID_SIZE || y < 1 || y > GRID_SIZE) return;

  // Add velocity based on mouse movement
  const strength = flowStrength * 0.5;
  fluid.addVelocity(x, y, (x - px) * strength, (y - py) * strength);

  return false; // Prevent default
}

function mousePressed() {
  if (mouseY < 0 || mouseY > canvasH) return;
  if (mouseButton !== LEFT) return;
  if (!hasInteracted) hideHint();

  const x = Math.floor(mouseX / scaleX);
  const y = Math.floor(mouseY / scaleY);

  if (x < 1 || x > GRID_SIZE || y < 1 || y > GRID_SIZE) return;

  dropInkAtPosition(x, y);

  // Visual ripple effect
  showRipple(mouseX, mouseY);
}

function touchStarted() {
  if (touches.length > 0) {
    const t = touches[0];
    const container = document.getElementById('canvas-wrapper');
    const rect = container.getBoundingClientRect();

    if (t.y < rect.top || t.y > rect.bottom) return true;
    if (!hasInteracted) hideHint();

    const x = Math.floor((t.x - rect.left) / scaleX);
    const y = Math.floor((t.y - rect.top) / scaleY);

    if (x >= 1 && x <= GRID_SIZE && y >= 1 && y <= GRID_SIZE) {
      dropInkAtPosition(x, y);
      showRipple(t.x - rect.left, t.y - rect.top);
    }
  }
  return false;
}

function dropInkAtPosition(x, y) {
  const palette = getPalette(currentPalette);
  const color = palette.colors[selectedColorIdx];
  const radius = brushSize * 1.5 + 2;
  const strength = 0.15 + brushSize * 0.03;

  fluid.dropInk(x, y, radius, color.rgb[0], color.rgb[1], color.rgb[2], strength);
}

function showRipple(px, py) {
  const container = document.getElementById('canvas-container');
  const ripple = document.createElement('div');
  ripple.className = 'ink-ripple';
  ripple.style.left = px + 'px';
  ripple.style.top = py + 'px';
  container.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

function hideHint() {
  hasInteracted = true;
  const hint = document.getElementById('hint-overlay');
  if (hint) hint.classList.add('hidden');
}

// ===== Auto Mode =====
function autoDropInk() {
  const palette = getPalette(currentPalette);
  const colorIdx = Math.floor(random(palette.colors.length));
  const color = palette.colors[colorIdx];

  const x = Math.floor(random(10, GRID_SIZE - 10));
  const y = Math.floor(random(10, GRID_SIZE - 10));
  const radius = random(3, 8);

  fluid.dropInk(x, y, radius, color.rgb[0], color.rgb[1], color.rgb[2], 0.12);

  // Add gentle circular flow
  const angle = random(TWO_PI);
  const fstr = random(0.5, 2.0);
  fluid.addVelocity(x, y, cos(angle) * fstr, sin(angle) * fstr);
}

function toggleAutoMode() {
  isAutoMode = !isAutoMode;
  const btn = document.getElementById('btn-auto');
  btn.classList.toggle('active', isAutoMode);
  if (!hasInteracted) hideHint();
}

// ===== UI Initialization =====
function initUI() {
  renderSwatches();

  // Palette select
  document.getElementById('palette-select').addEventListener('change', e => {
    currentPalette = e.target.value;
    selectedColorIdx = 0;
    renderSwatches();
  });

  // Brush size
  document.getElementById('brush-size').addEventListener('input', e => {
    brushSize = parseInt(e.target.value);
  });

  // Flow strength
  document.getElementById('flow-strength').addEventListener('input', e => {
    flowStrength = parseInt(e.target.value);
  });

  // Clear
  document.getElementById('btn-clear').addEventListener('click', () => {
    fluid.reset();
  });

  // Export
  document.getElementById('btn-export').addEventListener('click', openExportModal);
  document.getElementById('btn-close-export').addEventListener('click', closeExportModal);
  document.getElementById('btn-download').addEventListener('click', downloadArt);
  document.getElementById('btn-save-gallery').addEventListener('click', saveToGallery);

  // Gallery
  document.getElementById('btn-gallery').addEventListener('click', openGalleryModal);
  document.getElementById('btn-close-gallery').addEventListener('click', closeGalleryModal);

  // Auto mode
  document.getElementById('btn-auto').addEventListener('click', toggleAutoMode);

  // Modal backdrops
  document.querySelectorAll('.modal-backdrop').forEach(el => {
    el.addEventListener('click', () => {
      closeExportModal();
      closeGalleryModal();
    });
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeExportModal();
      closeGalleryModal();
    }
    if (e.key === 'c' && !e.ctrlKey && !e.metaKey) {
      // Cycle colors
      const palette = getPalette(currentPalette);
      selectedColorIdx = (selectedColorIdx + 1) % palette.colors.length;
      renderSwatches();
    }
  });
}

function renderSwatches() {
  const container = document.getElementById('color-swatches');
  const palette = getPalette(currentPalette);
  container.innerHTML = '';

  palette.colors.forEach((color, idx) => {
    const swatch = document.createElement('div');
    swatch.className = 'swatch' + (idx === selectedColorIdx ? ' active' : '');
    swatch.style.background = color.hex;
    swatch.title = color.name;
    swatch.addEventListener('click', () => {
      selectedColorIdx = idx;
      renderSwatches();
    });
    container.appendChild(swatch);
  });
}

// ===== Export =====
function openExportModal() {
  document.getElementById('export-modal').classList.remove('hidden');

  // Create preview
  const preview = document.getElementById('export-preview');
  preview.innerHTML = '';
  const img = document.createElement('img');
  const canvas = document.querySelector('#canvas-wrapper canvas');
  img.src = canvas.toDataURL('image/png');
  preview.appendChild(img);
}

function closeExportModal() {
  document.getElementById('export-modal').classList.add('hidden');
}

function downloadArt() {
  const scale = parseInt(document.getElementById('export-resolution').value);
  const bgType = document.getElementById('export-bg').value;

  const exportCanvas = createHighResCanvas(scale, bgType);

  // Trigger download
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
  link.download = `ryuusai-${timestamp}.png`;
  link.href = exportCanvas.toDataURL('image/png');
  link.click();

  closeExportModal();
}

function saveToGallery() {
  const canvas = document.querySelector('#canvas-wrapper canvas');
  // Save at lower res for gallery (to save storage)
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = 400;
  tempCanvas.height = 400;
  const ctx = tempCanvas.getContext('2d');
  ctx.drawImage(canvas, 0, 0, 400, 400);

  const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.7);
  const result = gallery.save(dataUrl, { palette: currentPalette });

  if (result) {
    closeExportModal();
    // Brief feedback
    const btn = document.getElementById('btn-save-gallery');
    btn.textContent = '保存しました！';
    setTimeout(() => { btn.textContent = 'ギャラリーに保存'; }, 1500);
  } else {
    alert('保存に失敗しました。ストレージの空き容量を確認してください。');
  }
}

function createHighResCanvas(scale, bgType) {
  const w = canvasW * scale;
  const h = canvasH * scale;
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = w;
  exportCanvas.height = h;
  const ctx = exportCanvas.getContext('2d');

  // Background
  if (bgType === 'transparent') {
    // Keep transparent
  } else if (bgType === 'black') {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);
  } else if (bgType === 'white') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
  } else {
    // Washi: warm off-white with subtle noise
    const palette = getPalette(currentPalette);
    ctx.fillStyle = palette.background;
    ctx.fillRect(0, 0, w, h);

    // Add washi fiber texture
    const imgData = ctx.getImageData(0, 0, w, h);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 10;
      imgData.data[i] = Math.max(0, Math.min(255, imgData.data[i] + noise));
      imgData.data[i + 1] = Math.max(0, Math.min(255, imgData.data[i + 1] + noise));
      imgData.data[i + 2] = Math.max(0, Math.min(255, imgData.data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);
  }

  // Draw fluid on top
  const sourceCanvas = document.querySelector('#canvas-wrapper canvas');
  ctx.drawImage(sourceCanvas, 0, 0, w, h);

  return exportCanvas;
}

// ===== Gallery =====
function openGalleryModal() {
  document.getElementById('gallery-modal').classList.remove('hidden');
  renderGallery();
}

function closeGalleryModal() {
  document.getElementById('gallery-modal').classList.add('hidden');
}

function renderGallery() {
  const items = gallery.getAll();
  const grid = document.getElementById('gallery-grid');
  const empty = document.getElementById('gallery-empty');

  grid.innerHTML = '';

  if (items.length === 0) {
    empty.classList.remove('hidden');
    grid.style.display = 'none';
    return;
  }

  empty.classList.add('hidden');
  grid.style.display = 'grid';

  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = '墨流しアート';
    el.appendChild(img);

    const actions = document.createElement('div');
    actions.className = 'gallery-item-actions';

    const date = document.createElement('span');
    date.className = 'gallery-item-date';
    date.textContent = gallery.formatDate(item.createdAt);
    actions.appendChild(date);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'gallery-item-delete';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.addEventListener('click', e => {
      e.stopPropagation();
      gallery.delete(item.id);
      renderGallery();
    });
    actions.appendChild(deleteBtn);

    el.appendChild(actions);

    // Click to download
    el.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = `ryuusai-${item.id}.jpg`;
      link.href = item.image;
      link.click();
    });

    grid.appendChild(el);
  });
}

// ===== Utility =====
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

// ===== Window Resize =====
function windowResized() {
  const container = document.getElementById('canvas-wrapper');
  canvasW = container.offsetWidth;
  canvasH = container.offsetHeight;
  resizeCanvas(canvasW, canvasH);
  scaleX = canvasW / GRID_SIZE;
  scaleY = canvasH / GRID_SIZE;

  // Regenerate washi texture for new size
  if (washiPattern) washiPattern.remove();
  generateWashiTexture();
}
