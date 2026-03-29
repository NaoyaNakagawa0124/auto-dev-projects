// Destruction animation engine
// Turns text into particles that dissolve beautifully

export const MODES = {
  burn:  { name: '燃やす', emoji: '🔥', baseColor: [15, 80, 55], particleColor: [30, 90, 60] },
  melt:  { name: '溶かす', emoji: '💧', baseColor: [200, 70, 55], particleColor: [210, 80, 65] },
  wind:  { name: '風に飛ばす', emoji: '🌬️', baseColor: [160, 20, 70], particleColor: [180, 30, 80] },
};

class TextParticle {
  constructor(x, y, char, hue, sat, light, mode) {
    this.x = x;
    this.y = y;
    this.char = char;
    this.hue = hue;
    this.sat = sat;
    this.light = light;
    this.mode = mode;
    this.life = 1.0;
    this.size = 14;

    switch (mode) {
      case 'burn':
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = -1 - Math.random() * 2;
        this.decay = 0.008 + Math.random() * 0.008;
        break;
      case 'melt':
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = 0.5 + Math.random() * 1.5;
        this.decay = 0.006 + Math.random() * 0.006;
        break;
      case 'wind':
        this.vx = 2 + Math.random() * 4;
        this.vy = (Math.random() - 0.5) * 1;
        this.decay = 0.005 + Math.random() * 0.008;
        break;
    }
  }

  update(dt) {
    const f = dt * 60;
    this.x += this.vx * f;
    this.y += this.vy * f;
    this.life -= this.decay * f;

    if (this.mode === 'burn') {
      this.hue = Math.max(0, this.hue - 0.5 * f);
      this.light = Math.max(20, this.light - 0.3 * f);
    } else if (this.mode === 'melt') {
      this.size *= (1 - 0.003 * f);
      this.sat = Math.max(0, this.sat - 0.3 * f);
    } else if (this.mode === 'wind') {
      this.vx *= 1.01;
      this.size *= (1 - 0.002 * f);
    }
  }

  draw(ctx) {
    if (this.life <= 0) return;
    ctx.fillStyle = `hsla(${this.hue}, ${this.sat}%, ${this.light}%, ${this.life})`;
    ctx.font = `${Math.max(2, this.size * this.life)}px Noto Sans JP, sans-serif`;
    ctx.fillText(this.char, this.x, this.y);
  }

  isDead() { return this.life <= 0; }
}

export class DestroyEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.isAnimating = false;
    this.onComplete = null;
  }

  destroy(text, mode, startX, startY) {
    const m = MODES[mode] || MODES.burn;
    this.particles = [];

    // Create particles from each character
    let x = startX;
    let y = startY;
    const lineHeight = 22;
    const charWidth = 14;

    for (const char of text) {
      if (char === '\n') {
        x = startX;
        y += lineHeight;
        continue;
      }

      const hue = m.particleColor[0] + (Math.random() - 0.5) * 20;
      const sat = m.particleColor[1];
      const light = m.particleColor[2];

      this.particles.push(new TextParticle(x, y, char, hue, sat, light, mode));

      // Extra ember/droplet particles
      for (let i = 0; i < 2; i++) {
        this.particles.push(new TextParticle(
          x + (Math.random() - 0.5) * 10,
          y + (Math.random() - 0.5) * 10,
          '·', hue + Math.random() * 30, sat, light + 10, mode
        ));
      }

      x += charWidth;
    }

    this.isAnimating = true;
  }

  update(dt) {
    if (!this.isAnimating) return;

    this.particles.forEach(p => p.update(dt));
    this.particles = this.particles.filter(p => !p.isDead());

    if (this.particles.length === 0) {
      this.isAnimating = false;
      if (this.onComplete) this.onComplete();
    }
  }

  draw() {
    const ctx = this.ctx;
    // Semi-transparent overlay for trail
    ctx.fillStyle = 'rgba(8, 6, 16, 0.06)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(p => p.draw(ctx));
  }

  clear() {
    this.ctx.fillStyle = '#080610';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles = [];
    this.isAnimating = false;
  }
}

export const PROMPTS = [
  'あなたの心の中の重荷を、ここに置いていこう',
  '手放す準備はできましたか？',
  '書いて、消して、軽くなろう',
  'この文字は、もう誰にも読まれない',
  '今日の悩みは、今日で終わり',
];

export function getRandomPrompt() {
  return PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
}

export const FAREWELL_MESSAGES = [
  'さようなら。もう考えなくていい。',
  '消えました。あなたは自由です。',
  'ガベージコレクション完了。メモリ解放。',
  '手放しました。次に進もう。',
  'その悩みは、もう存在しません。',
  'デリート完了。心が少し軽くなった。',
];

export function getRandomFarewell() {
  return FAREWELL_MESSAGES[Math.floor(Math.random() * FAREWELL_MESSAGES.length)];
}
