/**
 * 星占 (Hoshiura) — Web App
 */

// ===== Star Background =====
(function initStars() {
  const canvas = document.getElementById('stars-bg');
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const stars = Array.from({ length: 150 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.5 + 0.3,
    speed: Math.random() * 0.3 + 0.05,
    twinkle: Math.random() * Math.PI * 2,
  }));

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.twinkle += 0.02;
      const alpha = 0.3 + Math.sin(s.twinkle) * 0.3;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 200, 255, ${alpha})`;
      ctx.fill();
      s.y -= s.speed;
      if (s.y < -5) { s.y = h + 5; s.x = Math.random() * w; }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ===== State =====
let dominantColor = null;

// ===== Elements =====
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const previewContainer = document.getElementById('preview-container');
const previewCanvas = document.getElementById('preview-canvas');
const colorSwatch = document.getElementById('color-swatch');
const colorText = document.getElementById('color-text');
const btnRead = document.getElementById('btn-read');
const btnReset = document.getElementById('btn-reset');
const btnRetry = document.getElementById('btn-retry');
const uploadSection = document.getElementById('upload-section');
const fortuneSection = document.getElementById('fortune-section');

// ===== Event Listeners =====
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener('change', e => {
  if (e.target.files.length > 0) handleFile(e.target.files[0]);
});

btnRead.addEventListener('click', showFortune);
btnReset.addEventListener('click', resetUpload);
btnRetry.addEventListener('click', resetAll);

// ===== File Handling =====
function handleFile(file) {
  if (!file.type.startsWith('image/')) return;

  const img = new Image();
  img.onload = () => {
    const ctx = previewCanvas.getContext('2d');
    const maxW = 500;
    const scale = Math.min(maxW / img.width, maxW / img.height, 1);
    previewCanvas.width = img.width * scale;
    previewCanvas.height = img.height * scale;
    ctx.drawImage(img, 0, 0, previewCanvas.width, previewCanvas.height);

    // Extract dominant color
    dominantColor = extractDominantColor(ctx, previewCanvas.width, previewCanvas.height);
    const [r, g, b] = dominantColor;
    colorSwatch.style.background = `rgb(${r},${g},${b})`;
    colorText.textContent = `RGB(${r}, ${g}, ${b})`;

    dropZone.classList.add('hidden');
    previewContainer.classList.remove('hidden');
  };
  img.src = URL.createObjectURL(file);
}

function extractDominantColor(ctx, w, h) {
  const data = ctx.getImageData(0, 0, w, h).data;
  let totalR = 0, totalG = 0, totalB = 0, count = 0;

  // Sample every 4th pixel for performance
  for (let i = 0; i < data.length; i += 16) {
    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
    if (a < 128) continue; // Skip transparent
    // Weight by saturation (more colorful pixels matter more)
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    const weight = 0.5 + sat * 0.5;
    totalR += r * weight;
    totalG += g * weight;
    totalB += b * weight;
    count += weight;
  }

  if (count === 0) return [128, 128, 128];
  return [
    Math.round(totalR / count),
    Math.round(totalG / count),
    Math.round(totalB / count),
  ];
}

// ===== Fortune Display =====
function showFortune() {
  if (!dominantColor) return;

  const [r, g, b] = dominantColor;
  const constellation = findConstellation(r, g, b);
  const fortune = generateFortune(constellation, r, g, b);

  // Populate
  document.getElementById('constellation-symbol').textContent = constellation.symbol;
  document.getElementById('constellation-name').textContent = constellation.name;
  document.getElementById('constellation-period').textContent = `${constellation.period} ・ ${constellation.element}のエレメント`;

  const traitsEl = document.getElementById('constellation-traits');
  traitsEl.innerHTML = constellation.traits.map(t => `<span class="trait-tag">${t}</span>`).join('');

  document.getElementById('luck-overall').textContent = luckStars(fortune.overall);
  document.getElementById('luck-love').textContent = luckStars(fortune.love);
  document.getElementById('luck-work').textContent = luckStars(fortune.work);
  document.getElementById('luck-money').textContent = luckStars(fortune.money);
  document.getElementById('luck-health').textContent = luckStars(fortune.health);

  document.getElementById('fortune-message').textContent = fortune.message;
  document.getElementById('fortune-advice').textContent = `💡 ${fortune.advice}`;

  document.getElementById('lucky-color').textContent = fortune.luckyColor;
  document.getElementById('lucky-number').textContent = fortune.luckyNumber;
  document.getElementById('lucky-item').textContent = constellation.luckyItem;
  document.getElementById('energy-value').textContent = `${fortune.cosmicEnergy}%`;
  document.getElementById('energy-fill').style.width = `${fortune.cosmicEnergy}%`;

  uploadSection.classList.add('hidden');
  fortuneSection.classList.remove('hidden');
}

function resetUpload() {
  dominantColor = null;
  dropZone.classList.remove('hidden');
  previewContainer.classList.add('hidden');
  fileInput.value = '';
}

function resetAll() {
  resetUpload();
  fortuneSection.classList.add('hidden');
  uploadSection.classList.remove('hidden');
}
