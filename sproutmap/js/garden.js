/**
 * SproutMap — Garden renderer (p5.js procedural plants).
 * Each food logged becomes a plant that grows from the soil.
 */
(function (exports) {
  'use strict';

  function createGardenState() {
    return {
      plants: [],
      soilY: 0,
      width: 0,
      height: 0,
    };
  }

  function addPlant(state, food, plantInfo) {
    const x = 40 + (state.plants.length * 55) % (state.width - 80);
    const row = Math.floor(state.plants.length / Math.max(1, Math.floor((state.width - 80) / 55)));
    const y = state.soilY - row * 30;
    const seed = state.plants.length * 137 + food.name.length * 31;

    state.plants.push({
      x: x + pseudoRandom(seed) * 20 - 10,
      y: y,
      type: plantInfo.type,
      color: plantInfo.color,
      food: food,
      height: 30 + pseudoRandom(seed + 1) * 40,
      width: 10 + pseudoRandom(seed + 2) * 15,
      sway: pseudoRandom(seed + 3) * 0.02,
      growProgress: 0,
    });
    return state;
  }

  function updateGarden(state, dt) {
    state.plants.forEach(p => {
      if (p.growProgress < 1) {
        p.growProgress = Math.min(1, p.growProgress + dt * 0.5);
      }
    });
    return state;
  }

  function drawGarden(p5, state, frameCount) {
    // Sky gradient
    for (let y = 0; y < state.soilY; y++) {
      const t = y / state.soilY;
      p5.stroke(p5.lerpColor(p5.color(135, 200, 235), p5.color(200, 230, 255), t));
      p5.line(0, y, state.width, y);
    }

    // Sun
    p5.noStroke();
    p5.fill(255, 230, 100, 60);
    p5.ellipse(state.width - 80, 60, 100, 100);
    p5.fill(255, 240, 150);
    p5.ellipse(state.width - 80, 60, 60, 60);

    // Soil
    p5.noStroke();
    p5.fill(80, 50, 30);
    p5.rect(0, state.soilY, state.width, state.height - state.soilY);
    p5.fill(100, 65, 35);
    p5.rect(0, state.soilY, state.width, 8);

    // Plants
    state.plants.forEach((plant, i) => {
      const progress = plant.growProgress;
      const sway = Math.sin(frameCount * plant.sway + i) * 3 * progress;
      drawPlant(p5, plant, progress, sway);
    });
  }

  function drawPlant(p5, plant, progress, sway) {
    const x = plant.x + sway;
    const baseY = plant.y;
    const h = plant.height * progress;
    const w = plant.width * progress;
    const [r, g, b] = plant.color;

    p5.push();

    switch (plant.type) {
      case 'leaf':
        // Stem
        p5.stroke(60, 130, 50);
        p5.strokeWeight(3);
        p5.line(x, baseY, x + sway * 0.5, baseY - h);
        // Leaves
        p5.noStroke();
        p5.fill(r, g, b, 200);
        for (let i = 0; i < 3; i++) {
          const ly = baseY - h * (0.4 + i * 0.2);
          const side = i % 2 === 0 ? 1 : -1;
          p5.ellipse(x + side * w * 0.6, ly, w * 0.8, w * 0.4);
        }
        p5.fill(r - 20, g + 20, b - 10);
        p5.ellipse(x, baseY - h, w, w * 0.6);
        break;

      case 'flower':
        // Stem
        p5.stroke(80, 150, 60);
        p5.strokeWeight(2);
        p5.line(x, baseY, x, baseY - h);
        // Petals
        p5.noStroke();
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2;
          const px = x + Math.cos(angle) * w * 0.5;
          const py = baseY - h + Math.sin(angle) * w * 0.5;
          p5.fill(r, g, b, 180);
          p5.ellipse(px, py, w * 0.5, w * 0.5);
        }
        // Center
        p5.fill(255, 220, 80);
        p5.ellipse(x, baseY - h, w * 0.3, w * 0.3);
        break;

      case 'wheat':
        // Stem
        p5.stroke(160, 140, 50);
        p5.strokeWeight(2);
        p5.line(x, baseY, x + sway, baseY - h);
        // Grains
        p5.noStroke();
        p5.fill(r, g, b);
        for (let i = 0; i < 6; i++) {
          const gy = baseY - h + i * 5;
          const side = i % 2 === 0 ? -1 : 1;
          p5.ellipse(x + sway + side * 4, gy, 6, 4);
        }
        break;

      case 'mushroom':
        // Stem
        p5.noStroke();
        p5.fill(220, 210, 190);
        p5.rect(x - 4, baseY - h * 0.6, 8, h * 0.6);
        // Cap
        p5.fill(r, g, b);
        p5.arc(x, baseY - h * 0.6, w * 1.5, h * 0.5, Math.PI, 0);
        // Spots
        p5.fill(255, 255, 255, 100);
        p5.ellipse(x - 5, baseY - h * 0.7, 4, 4);
        p5.ellipse(x + 6, baseY - h * 0.65, 3, 3);
        break;

      case 'daisy':
        // Stem
        p5.stroke(80, 160, 60);
        p5.strokeWeight(2);
        p5.line(x, baseY, x, baseY - h);
        // Petals (white)
        p5.noStroke();
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const px = x + Math.cos(angle) * w * 0.4;
          const py = baseY - h + Math.sin(angle) * w * 0.4;
          p5.fill(r, g, b, 200);
          p5.ellipse(px, py, w * 0.3, w * 0.3);
        }
        p5.fill(255, 220, 60);
        p5.ellipse(x, baseY - h, w * 0.25, w * 0.25);
        break;

      case 'berry':
        // Bush
        p5.noStroke();
        p5.fill(40, 120, 50);
        p5.ellipse(x, baseY - h * 0.4, w * 1.5, h * 0.8);
        // Berries
        p5.fill(r, g, b);
        for (let i = 0; i < 5; i++) {
          const bx = x + (pseudoRandom(i * 17 + plant.x) - 0.5) * w;
          const by = baseY - h * 0.4 + (pseudoRandom(i * 31 + plant.x) - 0.5) * h * 0.3;
          p5.ellipse(bx, by, 6, 6);
        }
        break;

      case 'fern':
        // Fronds
        p5.stroke(r, g, b);
        p5.strokeWeight(2);
        p5.noFill();
        for (let i = 0; i < 4; i++) {
          const angle = -Math.PI / 4 + (i / 3) * Math.PI / 2;
          const fx = x + Math.cos(angle) * w;
          const fy = baseY - h + Math.sin(angle) * h * 0.3;
          p5.bezier(x, baseY, x, baseY - h * 0.5, fx, fy, fx + sway, fy - 10);
        }
        break;
    }

    p5.pop();
  }

  function pseudoRandom(seed) {
    const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  }

  function getGardenStats(state) {
    return {
      totalPlants: state.plants.length,
      typeDistribution: state.plants.reduce((d, p) => {
        d[p.type] = (d[p.type] || 0) + 1;
        return d;
      }, {}),
    };
  }

  exports.createGardenState = createGardenState;
  exports.addPlant = addPlant;
  exports.updateGarden = updateGarden;
  exports.drawGarden = drawGarden;
  exports.getGardenStats = getGardenStats;
  exports.pseudoRandom = pseudoRandom;

})(typeof window !== 'undefined' ? window : module.exports);
