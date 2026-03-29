// Generative breath art renderer
// Creates beautiful visuals that respond to breathing rhythm

const PALETTE = [
  { h: 220, s: 70, l: 60 },  // Blue
  { h: 260, s: 60, l: 55 },  // Purple
  { h: 180, s: 50, l: 50 },  // Teal
  { h: 320, s: 50, l: 60 },  // Pink
  { h: 45,  s: 60, l: 55 },  // Gold
];

class Ripple {
  constructor(x, y, hue, sat, light) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = 80 + Math.random() * 120;
    this.speed = 0.3 + Math.random() * 0.5;
    this.hue = hue;
    this.sat = sat;
    this.light = light;
    this.life = 1.0;
    this.lineWidth = 1 + Math.random() * 2;
  }

  update(dt) {
    this.radius += this.speed * dt * 60;
    this.life = Math.max(0, 1 - this.radius / this.maxRadius);
  }

  draw(ctx) {
    if (this.life <= 0) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `hsla(${this.hue}, ${this.sat}%, ${this.light}%, ${this.life * 0.4})`;
    ctx.lineWidth = this.lineWidth * this.life;
    ctx.stroke();
  }

  isDead() { return this.life <= 0; }
}

class Particle {
  constructor(x, y, angle, speed, hue, sat, light) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.hue = hue;
    this.sat = sat;
    this.light = light;
    this.life = 1.0;
    this.decay = 0.003 + Math.random() * 0.005;
    this.size = 1.5 + Math.random() * 2.5;
  }

  update(dt) {
    this.x += this.vx * dt * 60;
    this.y += this.vy * dt * 60;
    this.vx *= 0.99;
    this.vy *= 0.99;
    this.life -= this.decay * dt * 60;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    ctx.fillStyle = `hsla(${this.hue}, ${this.sat}%, ${this.light}%, ${this.life * 0.6})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
    ctx.fill();
  }

  isDead() { return this.life <= 0; }
}

export class BreathArt {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ripples = [];
    this.particles = [];
    this.time = 0;
    this.colorIndex = 0;
    this.centerX = canvas.width / 2;
    this.centerY = canvas.height / 2;
  }

  resize(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;
    this.centerX = w / 2;
    this.centerY = h / 2;
  }

  update(dt, breathValue, phase) {
    this.time += dt;

    // Spawn effects based on breathing
    if (phase === 'inhale') {
      // Inhale: particles flow inward, subtle ripples
      if (Math.random() < breathValue * 0.3) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 150 + Math.random() * 200;
        const px = this.centerX + Math.cos(angle) * dist;
        const py = this.centerY + Math.sin(angle) * dist;
        const c = this._color();
        this.particles.push(new Particle(
          px, py,
          angle + Math.PI, // toward center
          0.3 + breathValue * 0.5,
          c.h, c.s, c.l
        ));
      }
    } else if (phase === 'exhale') {
      // Exhale: ripples expand outward, particles disperse
      if (Math.random() < 0.05) {
        const c = this._color();
        const ox = (Math.random() - 0.5) * 40;
        const oy = (Math.random() - 0.5) * 40;
        this.ripples.push(new Ripple(this.centerX + ox, this.centerY + oy, c.h, c.s, c.l));
      }
      if (Math.random() < (1 - breathValue) * 0.2) {
        const angle = Math.random() * Math.PI * 2;
        const c = this._color();
        this.particles.push(new Particle(
          this.centerX, this.centerY,
          angle,
          0.5 + Math.random() * 1.5,
          c.h, c.s, c.l
        ));
      }
    } else if (phase === 'hold') {
      // Hold: gentle glow
      if (Math.random() < 0.02) {
        const c = this._color();
        this.ripples.push(new Ripple(this.centerX, this.centerY, c.h, c.s, c.l + 10));
      }
    }

    // Update elements
    this.ripples.forEach(r => r.update(dt));
    this.particles.forEach(p => p.update(dt));

    // Cleanup
    this.ripples = this.ripples.filter(r => !r.isDead());
    this.particles = this.particles.filter(p => !p.isDead());

    // Cap
    if (this.particles.length > 500) this.particles.splice(0, 50);
    if (this.ripples.length > 50) this.ripples.splice(0, 10);
  }

  draw(breathValue) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Semi-transparent overlay for trail effect
    ctx.fillStyle = 'rgba(8, 6, 18, 0.04)';
    ctx.fillRect(0, 0, w, h);

    // Central breathing orb
    const orbRadius = 30 + breathValue * 50;
    const c = this._color();

    // Outer glow
    const gradient = ctx.createRadialGradient(
      this.centerX, this.centerY, orbRadius * 0.3,
      this.centerX, this.centerY, orbRadius * 2
    );
    gradient.addColorStop(0, `hsla(${c.h}, ${c.s}%, ${c.l}%, ${0.15 + breathValue * 0.1})`);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, orbRadius * 2, 0, Math.PI * 2);
    ctx.fill();

    // Orb
    ctx.fillStyle = `hsla(${c.h}, ${c.s}%, ${c.l + 10}%, ${0.3 + breathValue * 0.2})`;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, orbRadius, 0, Math.PI * 2);
    ctx.fill();

    // Inner bright core
    ctx.fillStyle = `hsla(${c.h}, ${c.s - 10}%, ${c.l + 30}%, ${0.4})`;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, orbRadius * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Draw ripples and particles
    this.ripples.forEach(r => r.draw(ctx));
    this.particles.forEach(p => p.draw(ctx));
  }

  clear() {
    const ctx = this.ctx;
    ctx.fillStyle = '#080612';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ripples = [];
    this.particles = [];
  }

  advanceColor() {
    this.colorIndex = (this.colorIndex + 1) % PALETTE.length;
  }

  _color() {
    return PALETTE[this.colorIndex];
  }
}
