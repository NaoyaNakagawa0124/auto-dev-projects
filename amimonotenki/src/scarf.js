// Scarf pattern renderer using p5.js
import p5 from 'p5';
import { tempToColor, tempToHSL, TEMP_RANGES } from './colors.js';

let p5Instance = null;
let tempData = [];
let cityName = '';
let scarfWidth = 30; // stitches
let rowHeight = 3;
let scrollY = 0;

export function initScarf(container) {
  if (p5Instance) p5Instance.remove();

  p5Instance = new p5((p) => {
    const canvasW = 700;
    const canvasH = 550;
    const scarfX = 80;
    const scarfY = 60;
    const stitchW = 14;
    const legendX = scarfX + scarfWidth * stitchW + 40;

    p.setup = function () {
      const canvas = p.createCanvas(canvasW, canvasH);
      canvas.parent(container);
      p.colorMode(p.HSL, 360, 100, 100, 1);
      p.textFont('Noto Sans JP, sans-serif');
    };

    p.draw = function () {
      p.background(18, 30, 8);

      if (tempData.length === 0) {
        p.fill(0, 0, 60, 0.4);
        p.noStroke();
        p.textAlign(p.CENTER);
        p.textSize(16);
        p.text('都市を検索して、あなただけのマフラーを生成しよう', canvasW / 2, canvasH / 2);
        return;
      }

      // Title
      p.fill(45, 80, 70);
      p.noStroke();
      p.textAlign(p.LEFT);
      p.textSize(16);
      p.text(`🧶 ${cityName} のマフラーパターン`, scarfX, 30);

      p.textSize(11);
      p.fill(0, 0, 50, 0.5);
      p.text(`${tempData.length}日分 · ${scarfWidth}目 · スクロール: マウスホイール`, scarfX, 48);

      // Scarf pattern
      const visibleRows = Math.floor((canvasH - scarfY - 20) / rowHeight);
      const startRow = Math.floor(scrollY / rowHeight);
      const endRow = Math.min(startRow + visibleRows, tempData.length);

      // Scarf border
      p.stroke(0, 0, 30, 0.5);
      p.strokeWeight(1);
      p.noFill();
      p.rect(scarfX - 2, scarfY - 2, scarfWidth * stitchW + 4,
             Math.min(visibleRows, tempData.length - startRow) * rowHeight + 4);

      // Draw rows
      for (let i = startRow; i < endRow; i++) {
        const day = tempData[i];
        if (day.mean == null) continue;

        const hsl = tempToHSL(day.mean);
        const y = scarfY + (i - startRow) * rowHeight;

        // Main row color
        p.noStroke();
        p.fill(hsl.h, hsl.s, hsl.l);
        p.rect(scarfX, y, scarfWidth * stitchW, rowHeight);

        // Knit texture (subtle stitch pattern)
        if (rowHeight >= 3) {
          p.fill(hsl.h, hsl.s, hsl.l + 8, 0.3);
          for (let s = 0; s < scarfWidth; s += 2) {
            p.rect(scarfX + s * stitchW, y, stitchW, rowHeight / 2);
          }
        }

        // Date label (every 30 days)
        if (i % 30 === 0) {
          p.fill(0, 0, 60, 0.6);
          p.noStroke();
          p.textSize(8);
          p.textAlign(p.RIGHT);
          p.text(day.date.slice(5), scarfX - 6, y + rowHeight);
        }
      }

      // Fringe at top and bottom
      drawFringe(p, scarfX, scarfY - 8, scarfWidth * stitchW, false);
      const lastRowY = scarfY + Math.min(visibleRows, tempData.length - startRow) * rowHeight;
      drawFringe(p, scarfX, lastRowY + 2, scarfWidth * stitchW, true);

      // Legend
      drawLegend(p, legendX, scarfY);

      // Scrollbar
      if (tempData.length > visibleRows) {
        const barH = canvasH - scarfY - 20;
        const thumbH = (visibleRows / tempData.length) * barH;
        const thumbY = scarfY + (startRow / tempData.length) * barH;
        p.fill(0, 0, 30, 0.3);
        p.noStroke();
        p.rect(scarfX + scarfWidth * stitchW + 6, scarfY, 4, barH, 2);
        p.fill(0, 0, 60, 0.5);
        p.rect(scarfX + scarfWidth * stitchW + 6, thumbY, 4, thumbH, 2);
      }
    };

    p.mouseWheel = function (e) {
      if (tempData.length === 0) return;
      scrollY += e.delta * 0.5;
      const maxScroll = Math.max(0, (tempData.length - 150) * rowHeight);
      scrollY = p.constrain(scrollY, 0, maxScroll);
    };

    function drawFringe(p, x, y, w, flip) {
      p.stroke(45, 30, 60, 0.5);
      p.strokeWeight(1);
      const dir = flip ? 1 : -1;
      for (let fx = x; fx < x + w; fx += 6) {
        p.line(fx, y, fx + (Math.random() - 0.5) * 3, y + dir * (4 + Math.random() * 4));
      }
    }

    function drawLegend(p, x, y) {
      p.textAlign(p.LEFT);
      p.textSize(11);
      p.fill(0, 0, 70);
      p.noStroke();
      p.text('🌡️ 色見本', x, y);

      TEMP_RANGES.forEach((range, i) => {
        const ly = y + 18 + i * 22;
        const hex = range.color;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        // Color swatch
        p.fill(r, g, b);
        p.noStroke();
        p.rect(x, ly, 18, 16, 2);

        // Label
        p.fill(0, 0, 70);
        p.textSize(9);
        p.text(`${range.min}〜${range.max}°C`, x + 24, ly + 8);
        p.fill(0, 0, 50);
        p.text(range.yarn, x + 24, ly + 15);
      });
    }
  });
}

export function setScarfData(data, city) {
  tempData = data;
  cityName = city;
  scrollY = 0;
}

export function destroyScarf() {
  if (p5Instance) {
    p5Instance.remove();
    p5Instance = null;
  }
}
