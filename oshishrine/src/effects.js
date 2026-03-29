// Retro visual effects: sparkle cursor, starfield, floating hearts

export class StarField {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.stars = [];
    this.init(150);
  }

  init(count) {
    this.stars = [];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: 0.5 + Math.random() * 2,
        speed: 0.1 + Math.random() * 0.3,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.04,
      });
    }
  }

  update() {
    this.stars.forEach(s => {
      s.twinkle += s.twinkleSpeed;
      s.y += s.speed;
      if (s.y > this.canvas.height) {
        s.y = 0;
        s.x = Math.random() * this.canvas.width;
      }
    });
  }

  draw(color = '#fff') {
    const ctx = this.ctx;
    this.stars.forEach(s => {
      const alpha = 0.3 + Math.sin(s.twinkle) * 0.4;
      ctx.fillStyle = color;
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });
    ctx.globalAlpha = 1;
  }
}

export class SparkleTrail {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.sparkles = [];
    this.mouseX = 0;
    this.mouseY = 0;

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
      this.spawn(3);
    });
  }

  spawn(count) {
    for (let i = 0; i < count; i++) {
      this.sparkles.push({
        x: this.mouseX + (Math.random() - 0.5) * 20,
        y: this.mouseY + (Math.random() - 0.5) * 20,
        size: 2 + Math.random() * 4,
        life: 1.0,
        decay: 0.02 + Math.random() * 0.03,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -0.5 - Math.random() * 1,
        hue: Math.random() * 360,
      });
    }
    if (this.sparkles.length > 200) this.sparkles.splice(0, 50);
  }

  update() {
    this.sparkles.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.02; // gravity
      s.life -= s.decay;
    });
    this.sparkles = this.sparkles.filter(s => s.life > 0);
  }

  draw() {
    const ctx = this.ctx;
    this.sparkles.forEach(s => {
      ctx.fillStyle = `hsla(${s.hue}, 100%, 80%, ${s.life})`;
      // Star shape
      const sz = s.size * s.life;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.life * 2);
      ctx.fillRect(-sz/2, -1, sz, 2);
      ctx.fillRect(-1, -sz/2, 2, sz);
      ctx.restore();
    });
  }
}

export class FloatingHearts {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.hearts = [];
  }

  spawn() {
    this.hearts.push({
      x: Math.random() * this.canvas.width,
      y: this.canvas.height + 20,
      size: 10 + Math.random() * 15,
      speed: 0.3 + Math.random() * 0.7,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.03,
      wobbleAmp: 1 + Math.random() * 2,
      alpha: 0.4 + Math.random() * 0.3,
      hue: 320 + Math.random() * 40,
    });
    if (this.hearts.length > 30) this.hearts.shift();
  }

  update() {
    if (Math.random() < 0.03) this.spawn();
    this.hearts.forEach(h => {
      h.y -= h.speed;
      h.wobble += h.wobbleSpeed;
      h.x += Math.sin(h.wobble) * h.wobbleAmp;
    });
    this.hearts = this.hearts.filter(h => h.y > -30);
  }

  draw() {
    const ctx = this.ctx;
    this.hearts.forEach(h => {
      ctx.fillStyle = `hsla(${h.hue}, 80%, 65%, ${h.alpha})`;
      ctx.font = `${h.size}px sans-serif`;
      ctx.fillText('♥', h.x, h.y);
    });
  }
}
