// ambience.js — 焚火の環境音（Web Audio で生成、サンプル不要）
// パチパチという薪のはぜる音と、遠くの風のささやき。

export class Ambience {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.windNode = null;
    this.crackleTimer = null;
    this.running = false;
    this.targetGain = 0;
    this.intensity = 1; // 1 = focus 相当
  }

  async ensureContext() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) {
      console.warn('Web Audio not supported');
      return;
    }
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);
  }

  async start() {
    await this.ensureContext();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    if (this.running) return;
    this.running = true;
    this.targetGain = 0.18 * this.intensity;
    this.fadeTo(this.targetGain, 0.8);
    this.startWind();
    this.scheduleCrackles();
  }

  stop() {
    if (!this.ctx || !this.running) return;
    this.running = false;
    this.fadeTo(0, 0.6);
    if (this.crackleTimer) {
      clearTimeout(this.crackleTimer);
      this.crackleTimer = null;
    }
    setTimeout(() => {
      if (this.windNode && !this.running) {
        try { this.windNode.stop(); } catch (e) {}
        this.windNode = null;
      }
    }, 700);
  }

  setIntensity(v) {
    this.intensity = Math.max(0, Math.min(1.5, v));
    if (this.running) {
      this.targetGain = 0.18 * this.intensity;
      this.fadeTo(this.targetGain, 0.8);
    }
  }

  fadeTo(value, seconds) {
    if (!this.master) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(value, now + seconds);
  }

  startWind() {
    if (!this.ctx) return;
    // ピンクノイズ風の音を BiquadFilter で温めて流す
    const bufferSize = 2 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    // pink noise (Voss-McCartney 簡易版)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 420;
    lp.Q.value = 0.7;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.6;

    src.connect(lp).connect(gain).connect(this.master);
    src.start();
    this.windNode = src;

    // ゆっくりと音量を揺らす（風の強弱）
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.25;
    lfo.connect(lfoGain).connect(gain.gain);
    lfo.start();
  }

  scheduleCrackles() {
    if (!this.running) return;
    // 集中時は1〜3秒に1回程度、休憩時はもうすこし密に
    const baseInterval = 1.0 / Math.max(0.3, this.intensity); // intensity 1 → 1秒
    const next = (baseInterval + Math.random() * baseInterval * 1.5) * 1000;
    this.crackleTimer = setTimeout(() => {
      this.crackle();
      this.scheduleCrackles();
    }, next);
  }

  crackle() {
    if (!this.ctx || !this.running) return;
    // 短いノイズバースト + バンドパス → ぱちっ という弾ける音
    const now = this.ctx.currentTime;
    const duration = 0.04 + Math.random() * 0.05;
    const sampleCount = Math.floor(duration * this.ctx.sampleRate);
    const buffer = this.ctx.createBuffer(1, sampleCount, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < sampleCount; i++) {
      const t = i / sampleCount;
      // 瞬発的な減衰
      const env = Math.pow(1 - t, 3);
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;

    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 800 + Math.random() * 2400;
    bp.Q.value = 1.4 + Math.random() * 1.5;

    const g = this.ctx.createGain();
    g.gain.value = 0.5 + Math.random() * 0.5;

    src.connect(bp).connect(g).connect(this.master);
    src.start(now);
    src.stop(now + duration + 0.01);

    // 二発目をたまに
    if (Math.random() < 0.3) {
      setTimeout(() => this.running && this.crackle(), 60 + Math.random() * 120);
    }
  }
}
