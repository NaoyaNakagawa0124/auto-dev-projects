// ChakraForge - Anime Energy Effect Generator
// A p5.js generative art app with narrative skill progression

// ===== TECHNIQUES =====
const TECHNIQUES = {
  flame: {
    name: "Flame",
    icon: "🔥",
    color: [255, 68, 68],
    unlockXP: 0,
    rank: "Apprentice",
    particles: {
      count: 3,
      speed: 3,
      life: 60,
      sizeRange: [4, 12],
      drift: { x: 0, y: -2 },
      colorVariance: 30,
      trail: true,
    },
  },
  lightning: {
    name: "Lightning",
    icon: "⚡",
    color: [100, 180, 255],
    unlockXP: 10,
    rank: "Initiate",
    particles: {
      count: 2,
      speed: 8,
      life: 20,
      sizeRange: [1, 3],
      drift: { x: 0, y: 0 },
      colorVariance: 40,
      trail: true,
      branching: true,
    },
  },
  void: {
    name: "Void",
    icon: "🌀",
    color: [168, 85, 247],
    unlockXP: 25,
    rank: "Adept",
    particles: {
      count: 4,
      speed: 2,
      life: 80,
      sizeRange: [3, 8],
      drift: { x: 0, y: 0 },
      colorVariance: 20,
      trail: true,
      spiral: true,
    },
  },
  sakura: {
    name: "Sakura",
    icon: "🌸",
    color: [255, 150, 180],
    unlockXP: 50,
    rank: "Sage",
    particles: {
      count: 2,
      speed: 1.5,
      life: 120,
      sizeRange: [6, 14],
      drift: { x: 0.5, y: 1 },
      colorVariance: 15,
      trail: false,
      rotation: true,
    },
  },
  cosmic: {
    name: "Cosmic",
    icon: "✨",
    color: [0, 221, 170],
    unlockXP: 80,
    rank: "Master",
    particles: {
      count: 5,
      speed: 4,
      life: 100,
      sizeRange: [2, 10],
      drift: { x: 0, y: 0 },
      colorVariance: 50,
      trail: true,
      rings: true,
    },
  },
};

const TECHNIQUE_KEYS = ["flame", "lightning", "void", "sakura", "cosmic"];
const RANKS = ["Apprentice", "Initiate", "Adept", "Sage", "Master"];

// ===== STATE =====
let particles = [];
let ambientParticles = [];
let currentTechnique = "flame";
let intensity = 50;
let paused = false;
let xp = 0;
let unlockedTechniques = ["flame"];
let shakeAmount = 0;
let effectsCreated = 0;
let lastEmitFrame = 0;

// ===== PARTICLE CLASS =====
class Particle {
  constructor(x, y, tech) {
    const cfg = TECHNIQUES[tech].particles;
    const baseColor = TECHNIQUES[tech].color;
    this.x = x;
    this.y = y;
    this.tech = tech;

    const angle = random(TWO_PI);
    const speed = random(cfg.speed * 0.5, cfg.speed) * (intensity / 50);
    this.vx = cos(angle) * speed + (cfg.drift?.x || 0);
    this.vy = sin(angle) * speed + (cfg.drift?.y || 0);

    this.life = cfg.life;
    this.maxLife = cfg.life;
    this.size = random(cfg.sizeRange[0], cfg.sizeRange[1]) * (intensity / 50);

    const v = cfg.colorVariance;
    this.r = constrain(baseColor[0] + random(-v, v), 0, 255);
    this.g = constrain(baseColor[1] + random(-v, v), 0, 255);
    this.b = constrain(baseColor[2] + random(-v, v), 0, 255);

    this.rotation = random(TWO_PI);
    this.rotSpeed = random(-0.1, 0.1);
    this.trail = cfg.trail;
    this.history = [];

    // Technique-specific
    if (cfg.branching) {
      this.branchTimer = floor(random(5, 15));
    }
    if (cfg.spiral) {
      this.spiralAngle = random(TWO_PI);
      this.spiralRadius = random(20, 60);
      this.spiralSpeed = random(0.05, 0.12);
      this.originX = x;
      this.originY = y;
    }
    if (cfg.rings) {
      this.ringPhase = random(TWO_PI);
    }
  }

  update() {
    const cfg = TECHNIQUES[this.tech].particles;

    if (this.trail && this.life > this.maxLife * 0.3) {
      this.history.push({ x: this.x, y: this.y, size: this.size, alpha: this.life / this.maxLife });
      if (this.history.length > 8) this.history.shift();
    }

    if (cfg.spiral) {
      this.spiralAngle += this.spiralSpeed;
      this.spiralRadius += 0.3;
      this.x = this.originX + cos(this.spiralAngle) * this.spiralRadius;
      this.y = this.originY + sin(this.spiralAngle) * this.spiralRadius;
    } else {
      this.x += this.vx;
      this.y += this.vy;
    }

    if (cfg.branching && this.branchTimer !== undefined) {
      this.branchTimer--;
      if (this.branchTimer <= 0) {
        this.vx = random(-cfg.speed, cfg.speed);
        this.vy = random(-cfg.speed, cfg.speed);
        this.branchTimer = floor(random(3, 10));
      }
    }

    if (cfg.rotation) {
      this.rotation += this.rotSpeed;
      this.vx += random(-0.05, 0.05);
    }

    this.life--;
    this.size *= 0.995;

    return this.life > 0;
  }

  draw() {
    const alpha = map(this.life, 0, this.maxLife, 0, 255);
    const cfg = TECHNIQUES[this.tech].particles;

    // Draw trail
    if (this.trail && this.history.length > 1) {
      noFill();
      for (let i = 0; i < this.history.length - 1; i++) {
        const h = this.history[i];
        const trailAlpha = (i / this.history.length) * alpha * 0.4;
        stroke(this.r, this.g, this.b, trailAlpha);
        strokeWeight(h.size * 0.5);
        line(this.history[i].x, this.history[i].y, this.history[i + 1].x, this.history[i + 1].y);
      }
    }

    noStroke();

    // Glow
    const glowSize = this.size * 3;
    fill(this.r, this.g, this.b, alpha * 0.1);
    ellipse(this.x, this.y, glowSize, glowSize);

    // Core
    if (cfg.rotation) {
      push();
      translate(this.x, this.y);
      rotate(this.rotation);
      fill(this.r, this.g, this.b, alpha);
      ellipse(0, 0, this.size, this.size * 1.5);
      pop();
    } else if (cfg.rings) {
      this.ringPhase += 0.05;
      fill(this.r, this.g, this.b, alpha * 0.8);
      ellipse(this.x, this.y, this.size, this.size);
      noFill();
      stroke(this.r, this.g, this.b, alpha * 0.3);
      strokeWeight(1);
      const ringSize = this.size * 2 + sin(this.ringPhase) * 10;
      ellipse(this.x, this.y, ringSize, ringSize);
    } else {
      fill(this.r, this.g, this.b, alpha);
      ellipse(this.x, this.y, this.size, this.size);
    }

    // Hot center for flame
    if (this.tech === "flame" && this.life > this.maxLife * 0.7) {
      fill(255, 255, 200, alpha * 0.6);
      ellipse(this.x, this.y, this.size * 0.4, this.size * 0.4);
    }

    // Lightning flash
    if (this.tech === "lightning" && random() < 0.1) {
      fill(255, 255, 255, 100);
      ellipse(this.x, this.y, this.size * 4, this.size * 4);
    }
  }
}

// ===== AMBIENT PARTICLE =====
class AmbientParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(1, 2.5);
    this.alpha = random(20, 60);
    this.speed = random(0.1, 0.4);
    this.angle = random(TWO_PI);
    this.pulse = random(TWO_PI);
  }

  update() {
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
    this.pulse += 0.02;

    if (this.x < -10 || this.x > width + 10 || this.y < -10 || this.y > height + 10) {
      this.reset();
    }
  }

  draw() {
    const a = this.alpha * (0.5 + 0.5 * sin(this.pulse));
    fill(255, 255, 255, a);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
  }
}

// ===== SKILL TREE =====
function loadProgress() {
  try {
    const saved = localStorage.getItem("chakraforge_progress");
    if (saved) {
      const data = JSON.parse(saved);
      xp = data.xp || 0;
      effectsCreated = data.effectsCreated || 0;
      unlockedTechniques = data.unlocked || ["flame"];
      currentTechnique = data.currentTechnique || "flame";
    }
  } catch (e) {
    // Fresh start
  }
}

function saveProgress() {
  try {
    localStorage.setItem(
      "chakraforge_progress",
      JSON.stringify({
        xp,
        effectsCreated,
        unlocked: unlockedTechniques,
        currentTechnique,
      })
    );
  } catch (e) {
    // Storage unavailable
  }
}

function addXP(amount) {
  xp += amount;
  effectsCreated++;

  // Check unlocks
  for (const key of TECHNIQUE_KEYS) {
    if (!unlockedTechniques.includes(key) && xp >= TECHNIQUES[key].unlockXP) {
      unlockedTechniques.push(key);
      showNotification(`${TECHNIQUES[key].icon} ${TECHNIQUES[key].name} Unlocked!`);
      shakeAmount = 10;
    }
  }

  saveProgress();
  updateUI();
}

function getCurrentRank() {
  let rank = "Apprentice";
  for (const key of TECHNIQUE_KEYS) {
    if (unlockedTechniques.includes(key)) {
      rank = TECHNIQUES[key].rank;
    }
  }
  return rank;
}

function getNextUnlock() {
  for (const key of TECHNIQUE_KEYS) {
    if (!unlockedTechniques.includes(key)) {
      return { key, tech: TECHNIQUES[key] };
    }
  }
  return null;
}

// ===== UI =====
function buildTechBar() {
  const bar = document.getElementById("technique-bar");
  bar.innerHTML = "";

  TECHNIQUE_KEYS.forEach((key, i) => {
    const tech = TECHNIQUES[key];
    const btn = document.createElement("div");
    btn.className = "tech-btn";
    btn.style.setProperty("--tech-color", `rgb(${tech.color.join(",")})`);

    if (!unlockedTechniques.includes(key)) {
      btn.classList.add("locked");
      btn.innerHTML = `<span class="icon">🔒</span><span class="key">${i + 1}</span>`;
    } else {
      if (key === currentTechnique) btn.classList.add("active");
      btn.innerHTML = `<span class="icon">${tech.icon}</span><span class="key">${i + 1}</span>`;
      btn.addEventListener("click", () => {
        currentTechnique = key;
        updateUI();
        saveProgress();
      });
    }

    bar.appendChild(btn);
  });
}

function updateUI() {
  buildTechBar();

  document.getElementById("rank-display").textContent = getCurrentRank();
  document.getElementById("intensity-value").textContent = intensity;

  const next = getNextUnlock();
  const xpBarFill = document.getElementById("xp-bar-fill");
  const xpLabel = document.getElementById("xp-label");

  if (next) {
    const prevUnlock = TECHNIQUE_KEYS.indexOf(next.key) > 0
      ? TECHNIQUES[TECHNIQUE_KEYS[TECHNIQUE_KEYS.indexOf(next.key) - 1]].unlockXP
      : 0;
    const progress = ((xp - prevUnlock) / (next.tech.unlockXP - prevUnlock)) * 100;
    xpBarFill.style.width = `${constrain(progress, 0, 100)}%`;
    xpLabel.textContent = `${xp} / ${next.tech.unlockXP} XP → ${next.tech.name}`;
  } else {
    xpBarFill.style.width = "100%";
    xpLabel.textContent = `${xp} XP — All Techniques Mastered`;
  }
}

function showNotification(text) {
  const el = document.getElementById("notification");
  el.textContent = text;
  el.classList.remove("show");
  void el.offsetWidth; // Trigger reflow
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2500);
}

// ===== P5.JS LIFECYCLE =====
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB, 255);
  loadProgress();

  // Create ambient particles
  for (let i = 0; i < 50; i++) {
    ambientParticles.push(new AmbientParticle());
  }

  updateUI();
}

function draw() {
  // Screen shake
  if (shakeAmount > 0) {
    translate(random(-shakeAmount, shakeAmount), random(-shakeAmount, shakeAmount));
    shakeAmount *= 0.9;
    if (shakeAmount < 0.5) shakeAmount = 0;
  }

  // Fade background (creates trail effect)
  background(10, 10, 15, 40);

  // Ambient particles
  for (const ap of ambientParticles) {
    ap.update();
    ap.draw();
  }

  if (paused) return;

  // Emit particles at mouse
  if (mouseIsPressed && mouseX > 0 && mouseY > 0) {
    const cfg = TECHNIQUES[currentTechnique].particles;
    const count = ceil(cfg.count * (intensity / 50));

    for (let i = 0; i < count; i++) {
      particles.push(new Particle(mouseX, mouseY, currentTechnique));
    }

    // XP accrual (throttled)
    if (frameCount - lastEmitFrame > 30) {
      addXP(1);
      lastEmitFrame = frameCount;
    }
  }

  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    if (!particles[i].update()) {
      particles.splice(i, 1);
    } else {
      particles[i].draw();
    }
  }

  // Cap particles for performance
  if (particles.length > 2000) {
    particles.splice(0, particles.length - 2000);
  }
}

function keyPressed() {
  // Number keys for techniques
  if (key >= "1" && key <= "5") {
    const idx = parseInt(key) - 1;
    const techKey = TECHNIQUE_KEYS[idx];
    if (unlockedTechniques.includes(techKey)) {
      currentTechnique = techKey;
      updateUI();
      saveProgress();
    }
  }

  // Space to pause
  if (key === " ") {
    paused = !paused;
    if (paused) {
      showNotification("⏸ Paused");
    }
    return false; // prevent scroll
  }

  // S to save
  if (key === "s" || key === "S") {
    saveCanvas("chakraforge_" + currentTechnique + "_" + Date.now(), "png");
    showNotification("📸 Saved!");
  }

  // R to reset
  if (key === "r" || key === "R") {
    xp = 0;
    effectsCreated = 0;
    unlockedTechniques = ["flame"];
    currentTechnique = "flame";
    particles = [];
    saveProgress();
    updateUI();
    showNotification("🔄 Reset");
  }
}

function mouseWheel(event) {
  intensity = constrain(intensity - event.delta * 0.1, 10, 100);
  document.getElementById("intensity-value").textContent = Math.round(intensity);
  return false; // prevent page scroll
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
