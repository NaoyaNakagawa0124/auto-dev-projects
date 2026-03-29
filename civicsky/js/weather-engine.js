/**
 * CivicSky Weather Engine
 * Renders animated weather scenes on a canvas based on regulatory intensity (0-100).
 *
 * Weather states:
 *   0-20:  Clear (sunny, blue sky)
 *  21-40:  Partly Cloudy (a few clouds drift by)
 *  41-60:  Cloudy (overcast, grey tones)
 *  61-80:  Rainy (rain drops, darker sky)
 *  81-100: Stormy (lightning flashes, heavy rain, dark sky)
 */

// Make classes available globally (and for Node.js test environment)
(function (exports) {
  'use strict';

  const WEATHER_STATES = {
    CLEAR: 'clear',
    PARTLY_CLOUDY: 'partly_cloudy',
    CLOUDY: 'cloudy',
    RAINY: 'rainy',
    STORMY: 'stormy'
  };

  function intensityToState(intensity) {
    if (intensity <= 20) return WEATHER_STATES.CLEAR;
    if (intensity <= 40) return WEATHER_STATES.PARTLY_CLOUDY;
    if (intensity <= 60) return WEATHER_STATES.CLOUDY;
    if (intensity <= 80) return WEATHER_STATES.RAINY;
    return WEATHER_STATES.STORMY;
  }

  function intensityToLabel(intensity) {
    if (intensity <= 20) return 'Clear skies — smooth regulatory sailing';
    if (intensity <= 40) return 'Partly cloudy — a few changes on the horizon';
    if (intensity <= 60) return 'Overcast — moderate regulatory activity';
    if (intensity <= 80) return 'Rainy — significant policy changes underway';
    return 'Stormy — major regulatory shifts incoming';
  }

  function intensityToEmoji(intensity) {
    if (intensity <= 20) return '\u2600\uFE0F';
    if (intensity <= 40) return '\u26C5';
    if (intensity <= 60) return '\u2601\uFE0F';
    if (intensity <= 80) return '\uD83C\uDF27\uFE0F';
    return '\u26C8\uFE0F';
  }

  function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 8) return 'dawn';
    if (hour >= 8 && hour < 17) return 'day';
    if (hour >= 17 && hour < 20) return 'dusk';
    return 'night';
  }

  const SKY_COLORS = {
    day: {
      clear:         { top: '#1e88e5', bottom: '#90caf9' },
      partly_cloudy: { top: '#42a5f5', bottom: '#bbdefb' },
      cloudy:        { top: '#78909c', bottom: '#b0bec5' },
      rainy:         { top: '#546e7a', bottom: '#78909c' },
      stormy:        { top: '#263238', bottom: '#455a64' }
    },
    dawn: {
      clear:         { top: '#ff7043', bottom: '#ffcc80' },
      partly_cloudy: { top: '#ef6c00', bottom: '#ffab91' },
      cloudy:        { top: '#8d6e63', bottom: '#bcaaa4' },
      rainy:         { top: '#6d4c41', bottom: '#8d6e63' },
      stormy:        { top: '#3e2723', bottom: '#5d4037' }
    },
    dusk: {
      clear:         { top: '#7b1fa2', bottom: '#f48fb1' },
      partly_cloudy: { top: '#6a1b9a', bottom: '#ce93d8' },
      cloudy:        { top: '#4a148c', bottom: '#7b1fa2' },
      rainy:         { top: '#311b92', bottom: '#5c6bc0' },
      stormy:        { top: '#1a0033', bottom: '#311b92' }
    },
    night: {
      clear:         { top: '#0d1b2a', bottom: '#1b2838' },
      partly_cloudy: { top: '#0d1b2a', bottom: '#1e3a5f' },
      cloudy:        { top: '#0a1628', bottom: '#1b2838' },
      rainy:         { top: '#070f1a', bottom: '#0d1b2a' },
      stormy:        { top: '#050a12', bottom: '#070f1a' }
    }
  };

  class Cloud {
    constructor(canvas, speed) {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height * 0.4;
      this.width = 120 + Math.random() * 160;
      this.height = 40 + Math.random() * 40;
      this.speed = speed * (0.3 + Math.random() * 0.7);
      this.opacity = 0.3 + Math.random() * 0.5;
      this.canvasWidth = canvas.width;
    }

    update() {
      this.x += this.speed;
      if (this.x > this.canvasWidth + this.width) {
        this.x = -this.width;
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      const cx = this.x + this.width / 2;
      const cy = this.y + this.height / 2;
      ctx.ellipse(cx, cy, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      // Add smaller overlapping ellipses for fluffy look
      ctx.ellipse(cx - this.width * 0.25, cy - this.height * 0.15, this.width * 0.3, this.height * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.ellipse(cx + this.width * 0.2, cy - this.height * 0.1, this.width * 0.25, this.height * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Raindrop {
    constructor(canvas) {
      this.reset(canvas);
    }

    reset(canvas) {
      this.x = Math.random() * canvas.width;
      this.y = -10;
      this.length = 10 + Math.random() * 20;
      this.speed = 8 + Math.random() * 12;
      this.opacity = 0.2 + Math.random() * 0.4;
      this.canvasHeight = canvas.height;
      this.canvasWidth = canvas.width;
    }

    update(canvas) {
      this.y += this.speed;
      if (this.y > this.canvasHeight) {
        this.reset(canvas);
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.strokeStyle = '#b0bec5';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + 1, this.y + this.length);
      ctx.stroke();
      ctx.restore();
    }
  }

  class Star {
    constructor(canvas) {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height * 0.6;
      this.size = 0.5 + Math.random() * 1.5;
      this.twinkleSpeed = 0.02 + Math.random() * 0.03;
      this.twinkleOffset = Math.random() * Math.PI * 2;
      this.brightness = 0.3 + Math.random() * 0.7;
    }

    draw(ctx, frame) {
      const alpha = this.brightness * (0.5 + 0.5 * Math.sin(frame * this.twinkleSpeed + this.twinkleOffset));
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class WeatherEngine {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.intensity = 0;
      this.targetIntensity = 0;
      this.clouds = [];
      this.raindrops = [];
      this.stars = [];
      this.frame = 0;
      this.lightningFlash = 0;
      this.running = false;

      this._resize();
      this._initStars();
    }

    _resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    _initStars() {
      this.stars = [];
      for (let i = 0; i < 80; i++) {
        this.stars.push(new Star(this.canvas));
      }
    }

    _ensureClouds() {
      const state = intensityToState(this.intensity);
      let target = 0;
      if (state === WEATHER_STATES.PARTLY_CLOUDY) target = 4;
      else if (state === WEATHER_STATES.CLOUDY) target = 7;
      else if (state === WEATHER_STATES.RAINY) target = 10;
      else if (state === WEATHER_STATES.STORMY) target = 12;

      while (this.clouds.length < target) {
        this.clouds.push(new Cloud(this.canvas, 0.3 + this.intensity / 200));
      }
      while (this.clouds.length > target) {
        this.clouds.pop();
      }
    }

    _ensureRain() {
      const state = intensityToState(this.intensity);
      let target = 0;
      if (state === WEATHER_STATES.RAINY) target = 100;
      else if (state === WEATHER_STATES.STORMY) target = 250;

      while (this.raindrops.length < target) {
        this.raindrops.push(new Raindrop(this.canvas));
      }
      while (this.raindrops.length > target) {
        this.raindrops.pop();
      }
    }

    setIntensity(value) {
      this.targetIntensity = Math.max(0, Math.min(100, value));
    }

    _drawSky() {
      const tod = getTimeOfDay();
      const state = intensityToState(this.intensity);
      const colors = SKY_COLORS[tod][state];

      const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
      gradient.addColorStop(0, colors.top);
      gradient.addColorStop(1, colors.bottom);
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    _drawSun() {
      const tod = getTimeOfDay();
      if (tod === 'night') return;
      if (this.intensity > 60) return;

      const opacity = Math.max(0, 1 - this.intensity / 60);
      const cx = this.canvas.width * 0.8;
      const cy = this.canvas.height * 0.15;
      const radius = 50;

      this.ctx.save();
      this.ctx.globalAlpha = opacity * 0.3;
      const glow = this.ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius * 3);
      glow.addColorStop(0, '#fff9c4');
      glow.addColorStop(1, 'transparent');
      this.ctx.fillStyle = glow;
      this.ctx.fillRect(cx - radius * 3, cy - radius * 3, radius * 6, radius * 6);

      this.ctx.globalAlpha = opacity;
      this.ctx.fillStyle = '#fff9c4';
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    _drawLightning() {
      if (intensityToState(this.intensity) !== WEATHER_STATES.STORMY) return;
      if (this.lightningFlash > 0) {
        this.ctx.save();
        this.ctx.globalAlpha = this.lightningFlash;
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        this.lightningFlash -= 0.05;
      } else if (Math.random() < 0.005) {
        this.lightningFlash = 0.6 + Math.random() * 0.4;
      }
    }

    _render() {
      if (!this.running) return;

      // Smooth transition
      this.intensity += (this.targetIntensity - this.intensity) * 0.02;

      this._ensureClouds();
      this._ensureRain();

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this._drawSky();
      this._drawSun();

      // Stars (night only)
      if (getTimeOfDay() === 'night' && this.intensity < 60) {
        const starOpacity = 1 - this.intensity / 60;
        this.ctx.save();
        this.ctx.globalAlpha = starOpacity;
        this.stars.forEach(s => s.draw(this.ctx, this.frame));
        this.ctx.restore();
      }

      // Clouds
      this.clouds.forEach(c => {
        c.update();
        c.draw(this.ctx);
      });

      // Rain
      this.raindrops.forEach(r => {
        r.update(this.canvas);
        r.draw(this.ctx);
      });

      this._drawLightning();

      this.frame++;
      requestAnimationFrame(() => this._render());
    }

    start() {
      this.running = true;
      window.addEventListener('resize', () => {
        this._resize();
        this._initStars();
      });
      this._render();
    }

    stop() {
      this.running = false;
    }
  }

  // Export
  exports.WEATHER_STATES = WEATHER_STATES;
  exports.WeatherEngine = WeatherEngine;
  exports.intensityToState = intensityToState;
  exports.intensityToLabel = intensityToLabel;
  exports.intensityToEmoji = intensityToEmoji;
  exports.getTimeOfDay = getTimeOfDay;

})(typeof window !== 'undefined' ? window : module.exports);
