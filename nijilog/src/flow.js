// Generative art flow visualization using p5.js
import p5 from 'p5';
import { getState } from './store.js';
import { getMoodById, moods } from './data/moods.js';

let p5Instance = null;
let particles = [];
let flowEntries = [];
let hoverInfo = null;
let onEntryHover = null;

const MAX_PARTICLES = 800;
const PARTICLE_LIFE = 180;
const FLOW_SPEED = 0.6;

class Particle {
  constructor(x, y, hue, sat, light, streamIndex) {
    this.x = x;
    this.y = y;
    this.baseX = x;
    this.hue = hue;
    this.sat = sat;
    this.light = light;
    this.life = PARTICLE_LIFE;
    this.maxLife = PARTICLE_LIFE;
    this.size = 2 + Math.random() * 3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -FLOW_SPEED - Math.random() * 0.3;
    this.streamIndex = streamIndex;
    this.wobbleOffset = Math.random() * Math.PI * 2;
    this.wobbleSpeed = 0.02 + Math.random() * 0.02;
    this.wobbleAmp = 8 + Math.random() * 12;
  }

  update(p) {
    this.life--;
    this.y += this.vy;
    this.x = this.baseX + Math.sin(p.frameCount * this.wobbleSpeed + this.wobbleOffset) * this.wobbleAmp;
    this.x += this.vx;
  }

  draw(p) {
    const alpha = (this.life / this.maxLife);
    const fadedAlpha = alpha * alpha * 0.7;
    p.noStroke();
    p.fill(this.hue, this.sat, this.light, fadedAlpha);
    p.circle(this.x, this.y, this.size * alpha);

    // Glow effect
    p.fill(this.hue, this.sat, this.light + 20, fadedAlpha * 0.3);
    p.circle(this.x, this.y, this.size * alpha * 2.5);
  }

  isDead() {
    return this.life <= 0;
  }
}

function buildFlowEntries() {
  const state = getState();
  const entries = [...state.entries].sort((a, b) => a.date.localeCompare(b.date));

  flowEntries = entries.map((entry, i) => {
    const mood = getMoodById(entry.mood);
    return {
      date: entry.date,
      mood: entry.mood,
      text: entry.text,
      h: mood ? mood.h : 215,
      s: mood ? mood.s : 16,
      l: mood ? mood.l : 65,
      index: i,
      hasGapBefore: false,
    };
  });

  // Mark gaps
  for (let i = 1; i < flowEntries.length; i++) {
    const prev = new Date(flowEntries[i - 1].date);
    const curr = new Date(flowEntries[i].date);
    const diff = Math.round((curr - prev) / 86400000);
    if (diff > 1) {
      flowEntries[i].hasGapBefore = true;
      flowEntries[i].gapDays = diff - 1;
    }
  }
}

function sketch(p) {
  let canvasW, canvasH;

  p.setup = function () {
    canvasW = window.innerWidth;
    canvasH = window.innerHeight;
    const canvas = p.createCanvas(canvasW, canvasH);
    canvas.parent('canvas-container');
    p.colorMode(p.HSL, 360, 100, 100, 1);
    buildFlowEntries();
  };

  p.draw = function () {
    // Semi-transparent background for trails
    p.background(12, 40, 6, 0.08);

    // Spawn particles for each entry stream
    const streamWidth = Math.min(100, canvasW / (flowEntries.length + 1));
    const startX = (canvasW - streamWidth * flowEntries.length) / 2 + streamWidth / 2;

    flowEntries.forEach((entry, i) => {
      const x = startX + i * streamWidth;
      const spawnY = canvasH - 60;

      // Don't spawn if gap (creates visual break)
      if (!entry.hasGapBefore || p.frameCount % 30 < 20) {
        // Spawn rate based on whether there's a gap
        const spawnRate = entry.hasGapBefore ? 8 : 2;
        if (p.frameCount % spawnRate === 0 && particles.length < MAX_PARTICLES) {
          particles.push(new Particle(
            x + (Math.random() - 0.5) * streamWidth * 0.4,
            spawnY,
            entry.h,
            entry.s,
            entry.l,
            i
          ));
        }
      }

      // Draw gap indicator
      if (entry.hasGapBefore && i > 0) {
        const prevX = startX + (i - 1) * streamWidth;
        const gapX = (prevX + x) / 2;

        p.push();
        p.noFill();
        p.stroke(0, 0, 30, 0.3 + Math.sin(p.frameCount * 0.03) * 0.1);
        p.strokeWeight(1);
        p.drawingContext.setLineDash([3, 6]);
        p.line(gapX, canvasH * 0.15, gapX, canvasH - 80);
        p.drawingContext.setLineDash([]);
        p.pop();

        // Gap label
        p.push();
        p.fill(0, 0, 50, 0.5);
        p.noStroke();
        p.textAlign(p.CENTER);
        p.textSize(10);
        p.text(`${entry.gapDays}日`, gapX, canvasH - 40);
        p.pop();
      }

      // Draw stream label at bottom
      const mood = getMoodById(entry.mood);
      p.push();
      p.fill(entry.h, entry.s, entry.l, 0.7);
      p.noStroke();
      p.circle(x, canvasH - 30, 10);

      // Date label
      p.fill(0, 0, 60, 0.4);
      p.textAlign(p.CENTER);
      p.textSize(8);
      const shortDate = entry.date.slice(5); // MM-DD
      p.text(shortDate, x, canvasH - 14);
      p.pop();
    });

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update(p);
      particles[i].draw(p);
      if (particles[i].isDead()) {
        particles.splice(i, 1);
      }
    }

    // Draw connecting lines between consecutive streams (shows flow continuity)
    p.push();
    p.noFill();
    p.strokeWeight(0.5);
    for (let i = 1; i < flowEntries.length; i++) {
      if (!flowEntries[i].hasGapBefore) {
        const x1 = startX + (i - 1) * streamWidth;
        const x2 = startX + i * streamWidth;
        const entry = flowEntries[i];
        p.stroke(entry.h, entry.s, entry.l, 0.08 + Math.sin(p.frameCount * 0.01) * 0.03);
        p.bezier(
          x1, canvasH * 0.6,
          x1 + streamWidth * 0.3, canvasH * 0.4,
          x2 - streamWidth * 0.3, canvasH * 0.4,
          x2, canvasH * 0.6
        );
      }
    }
    p.pop();

    // If no entries, show invite message
    if (flowEntries.length === 0) {
      p.push();
      p.fill(0, 0, 70, 0.3 + Math.sin(p.frameCount * 0.02) * 0.1);
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(16);
      p.text('✦ ボタンを押して、最初の記録を始めよう', canvasW / 2, canvasH / 2);
      p.pop();

      // Ambient background particles
      if (p.frameCount % 4 === 0 && particles.length < 100) {
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        particles.push(new Particle(
          Math.random() * canvasW,
          canvasH + 10,
          randomMood.h,
          randomMood.s * 0.3,
          randomMood.l * 0.5,
          -1
        ));
      }
    }
  };

  p.windowResized = function () {
    canvasW = window.innerWidth;
    canvasH = window.innerHeight;
    p.resizeCanvas(canvasW, canvasH);
  };
}

export function initFlow() {
  if (p5Instance) {
    p5Instance.remove();
  }
  p5Instance = new p5(sketch);
}

export function refreshFlow() {
  buildFlowEntries();
  particles = [];
}

export function destroyFlow() {
  if (p5Instance) {
    p5Instance.remove();
    p5Instance = null;
  }
  particles = [];
}
