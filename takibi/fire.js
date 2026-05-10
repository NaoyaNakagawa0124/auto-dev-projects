// fire.js — ピクセルアートの焚火
// クラシックな "Doom fire" アルゴリズムを使い、パレットを温かみのある色に。
// 火の上昇、横揺れ、舞う火の粉、薪、淡いグロウを描画する。

const PALETTE = [
  // index 0 = transparent, 上に行くほど明るい
  [0, 0, 0, 0],          // 0 transparent
  [12, 8, 6, 255],       // 1 ほぼ黒（背景に溶ける）
  [40, 16, 8, 255],      // 2 こげ茶
  [80, 22, 10, 255],     // 3 暗い赤
  [128, 36, 14, 255],    // 4 赤
  [180, 60, 20, 255],    // 5 朱
  [220, 100, 30, 255],   // 6 燃える橙
  [240, 150, 50, 255],   // 7 明るい橙
  [250, 200, 80, 255],   // 8 黄
  [255, 230, 140, 255],  // 9 淡黄
  [255, 245, 200, 255],  // 10 ほぼ白
  [255, 255, 230, 255],  // 11 芯
];

const MAX_HEAT = PALETTE.length - 1;

// 横幅と高さは "ピクセル" 単位。低解像度ほどレトロ感が増す。
const FIRE_W = 84;
const FIRE_H = 96;

// モード別パラメータ
const MODES = {
  sleeping: { intensity: 0.15, sparkRate: 0.04, baseOffset: 6, glow: 0.18 },
  focusing: { intensity: 0.78, sparkRate: 0.45, baseOffset: 0, glow: 0.55 },
  resting:  { intensity: 1.00, sparkRate: 0.85, baseOffset: -2, glow: 0.85 },
};

export class Fire {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    // 低解像度オフスクリーン
    this.off = document.createElement('canvas');
    this.off.width = FIRE_W;
    this.off.height = FIRE_H;
    this.offCtx = this.off.getContext('2d');
    this.imageData = this.offCtx.createImageData(FIRE_W, FIRE_H);

    // ヒートグリッド（1次元配列、index = y*W + x）
    this.heat = new Uint8Array(FIRE_W * FIRE_H);
    // パーティクル（火の粉）
    this.sparks = [];
    // 強さ係数（0..1+）
    this.intensity = 0;
    this.targetIntensity = MODES.sleeping.intensity;
    this.sparkRate = MODES.sleeping.sparkRate;
    this.baseOffset = MODES.sleeping.baseOffset;
    this.glow = MODES.sleeping.glow;
    this.targetGlow = MODES.sleeping.glow;

    // 「薪をくべた」演出時の追加ブースト
    this.feedBoost = 0;

    this.running = false;
    this.lastTime = 0;
    this.sizePx = { w: 0, h: 0 };
    this.handleResize = this.handleResize.bind(this);
    this.tick = this.tick.bind(this);
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  handleResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
    this.sizePx = { w, h };
  }

  setMode(mode) {
    const m = MODES[mode] || MODES.sleeping;
    this.targetIntensity = m.intensity;
    this.sparkRate = m.sparkRate;
    this.baseOffset = m.baseOffset;
    this.targetGlow = m.glow;
  }

  // 集中サイクル完了時の演出: 一瞬だけ火が大きくなる
  feed() {
    this.feedBoost = 1.0;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
  }

  tick(now) {
    if (!this.running) return;
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;

    // intensity / glow を補間
    this.intensity += (this.targetIntensity - this.intensity) * Math.min(1, dt * 1.2);
    this.glow += (this.targetGlow - this.glow) * Math.min(1, dt * 1.2);
    this.feedBoost *= Math.pow(0.4, dt); // 1.5秒くらいで減衰

    this.updateFire();
    this.updateSparks(dt);
    this.render();

    requestAnimationFrame(this.tick);
  }

  updateFire() {
    const heat = this.heat;
    const w = FIRE_W;
    const h = FIRE_H;

    // 底辺の最大値（火の元）
    const baseY = h - 1 - Math.max(0, this.baseOffset);
    const intensity = Math.min(1.5, this.intensity + this.feedBoost * 0.6);

    // 底辺ラインに熱を投入（中心付近を強く、端は弱く）
    for (let x = 0; x < w; x++) {
      // 中心からの距離で減衰
      const cx = w / 2;
      const dist = Math.abs(x - cx) / (w / 2);
      const falloff = Math.max(0, 1 - dist * 1.4);
      // 揺らぎ
      const flicker = 0.8 + Math.random() * 0.4;
      const value = Math.floor(MAX_HEAT * intensity * falloff * flicker);
      const idx = baseY * w + x;
      heat[idx] = Math.max(heat[idx], Math.min(MAX_HEAT, value));
    }

    // Doom fire 上方向への拡散
    for (let y = baseY; y > 0; y--) {
      for (let x = 0; x < w; x++) {
        const srcIdx = y * w + x;
        const src = heat[srcIdx];
        if (src === 0) continue;
        // 横揺れ（-1..+1）と冷却（0..2）
        const wind = (Math.random() * 3) | 0; // 0,1,2
        const dx = wind - 1;
        const cool = (Math.random() * 2.4) | 0; // 0,1,2
        const dst = (y - 1) * w + Math.max(0, Math.min(w - 1, x + dx));
        const next = Math.max(0, src - cool);
        if (heat[dst] < next) heat[dst] = next;
      }
    }

    // 上端を冷ます
    for (let x = 0; x < w; x++) {
      const idx = x;
      heat[idx] = Math.max(0, heat[idx] - 1);
    }

    // 火の粉スポーン
    if (Math.random() < this.sparkRate) {
      const sx = (FIRE_W / 2) + (Math.random() - 0.5) * (FIRE_W * 0.4);
      const sy = baseY - 4 - Math.random() * 6;
      this.sparks.push({
        x: sx,
        y: sy,
        vx: (Math.random() - 0.5) * 6,
        vy: -8 - Math.random() * 14,
        life: 1.0,
        size: Math.random() < 0.3 ? 2 : 1,
      });
    }
  }

  updateSparks(dt) {
    const sparks = this.sparks;
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.vy += 4 * dt; // ふわっと減速
      s.vx *= Math.pow(0.4, dt);
      s.life -= dt * 0.55;
      if (s.life <= 0 || s.y < 0) sparks.splice(i, 1);
    }
  }

  render() {
    // パレットマップしてイメージデータに書き込み
    const data = this.imageData.data;
    const heat = this.heat;
    for (let i = 0; i < heat.length; i++) {
      const c = PALETTE[Math.min(MAX_HEAT, heat[i])];
      const j = i * 4;
      data[j] = c[0];
      data[j + 1] = c[1];
      data[j + 2] = c[2];
      data[j + 3] = c[3];
    }
    this.offCtx.putImageData(this.imageData, 0, 0);

    // 薪を描く（低解像度キャンバスに上書き）
    this.drawLogs();

    // 火の粉を描く
    this.drawSparks();

    // メインキャンバスへ
    const ctx = this.ctx;
    const { w: dw, h: dh } = this.sizePx;
    ctx.clearRect(0, 0, dw, dh);

    // 背景の温かいグロウ
    if (this.glow > 0.01) {
      const cx = dw / 2;
      const cy = dh * 0.74;
      const r = Math.min(dw, dh) * 0.7;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      const a = this.glow * 0.45;
      g.addColorStop(0, `rgba(255, 130, 50, ${a.toFixed(3)})`);
      g.addColorStop(0.4, `rgba(180, 60, 20, ${(a * 0.4).toFixed(3)})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, dw, dh);
    }

    // 焚火本体: 縦横比を保って配置（画面下寄り）
    const scale = Math.min(dw / FIRE_W, dh / FIRE_H) * 0.55;
    const drawW = FIRE_W * scale;
    const drawH = FIRE_H * scale;
    const drawX = (dw - drawW) / 2;
    const drawY = dh * 0.78 - drawH;

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.off, drawX, drawY, drawW, drawH);
  }

  drawLogs() {
    // 薪 — 横向きの2本のピクセル長方形
    const ctx = this.offCtx;
    const baseY = FIRE_H - Math.max(0, this.baseOffset) - 1;
    // 後ろの薪
    ctx.fillStyle = '#3a2418';
    ctx.fillRect(FIRE_W / 2 - 24, baseY - 4, 48, 4);
    ctx.fillStyle = '#5a3622';
    ctx.fillRect(FIRE_W / 2 - 22, baseY - 4, 44, 1);
    // 上の小枝
    ctx.fillStyle = '#2a1810';
    ctx.fillRect(FIRE_W / 2 - 18, baseY - 6, 36, 2);
    ctx.fillStyle = '#4a2c1a';
    ctx.fillRect(FIRE_W / 2 - 16, baseY - 6, 32, 1);
    // 灰の山
    ctx.fillStyle = '#1a1410';
    ctx.fillRect(FIRE_W / 2 - 28, baseY, 56, 1);
  }

  drawSparks() {
    const ctx = this.offCtx;
    for (const s of this.sparks) {
      const alpha = Math.max(0, Math.min(1, s.life));
      // パレットから明るい色を選ぶ
      const c = alpha > 0.6 ? '255,230,140' : '220,100,30';
      ctx.fillStyle = `rgba(${c}, ${alpha.toFixed(2)})`;
      ctx.fillRect(s.x | 0, s.y | 0, s.size, s.size);
    }
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this.handleResize);
  }
}
