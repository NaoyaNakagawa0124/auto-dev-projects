// Pixel art renderer for the room
import { FURNITURE } from './data.js';

const PIXEL = 3; // Scale factor for pixel art
const ROOM_W = 340;
const ROOM_H = 170;

export function drawRoom(ctx, unlockedFurniture, canvasW, canvasH) {
  const offsetX = (canvasW - ROOM_W * PIXEL) / 2;
  const offsetY = (canvasH - ROOM_H * PIXEL) / 2 - 20;

  ctx.imageSmoothingEnabled = false;

  // Sky / background
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvasW, canvasH);

  // Stars
  const starSeed = 42;
  for (let i = 0; i < 30; i++) {
    const sx = ((starSeed * (i + 1) * 7) % canvasW);
    const sy = ((starSeed * (i + 1) * 13) % (canvasH * 0.4));
    const brightness = 150 + ((i * 37) % 105);
    ctx.fillStyle = `rgb(${brightness},${brightness},${brightness + 40})`;
    ctx.fillRect(sx, sy, 2, 2);
  }

  // Moon
  ctx.fillStyle = '#f0e68c';
  fillPixelCircle(ctx, canvasW - 80, 50, 20);

  // Room floor
  const floorY = offsetY + ROOM_H * PIXEL;
  ctx.fillStyle = '#4a3728';
  ctx.fillRect(offsetX, floorY, ROOM_W * PIXEL, 30 * PIXEL);

  // Floor planks
  ctx.strokeStyle = '#3a2718';
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i++) {
    const px = offsetX + i * (ROOM_W * PIXEL / 8);
    ctx.beginPath();
    ctx.moveTo(px, floorY);
    ctx.lineTo(px, floorY + 30 * PIXEL);
    ctx.stroke();
  }

  // Room walls
  ctx.fillStyle = '#2a2a4a';
  ctx.fillRect(offsetX, offsetY, ROOM_W * PIXEL, ROOM_H * PIXEL);

  // Wall pattern (subtle)
  ctx.fillStyle = '#2e2e52';
  for (let y = 0; y < ROOM_H; y += 20) {
    ctx.fillRect(offsetX, offsetY + y * PIXEL, ROOM_W * PIXEL, 2);
  }

  // Window
  const winX = offsetX + 150 * PIXEL;
  const winY = offsetY + 20 * PIXEL;
  const winW = 50 * PIXEL;
  const winH = 40 * PIXEL;
  ctx.fillStyle = '#16213e';
  ctx.fillRect(winX, winY, winW, winH);
  ctx.strokeStyle = '#5a5a8a';
  ctx.lineWidth = PIXEL * 2;
  ctx.strokeRect(winX, winY, winW, winH);
  // Window cross
  ctx.beginPath();
  ctx.moveTo(winX + winW / 2, winY);
  ctx.lineTo(winX + winW / 2, winY + winH);
  ctx.moveTo(winX, winY + winH / 2);
  ctx.lineTo(winX + winW, winY + winH / 2);
  ctx.stroke();

  // Door
  const doorX = offsetX + 300 * PIXEL;
  const doorY = offsetY + 80 * PIXEL;
  ctx.fillStyle = '#5a3a2a';
  ctx.fillRect(doorX, doorY, 30 * PIXEL, 90 * PIXEL);
  ctx.strokeStyle = '#4a2a1a';
  ctx.lineWidth = PIXEL;
  ctx.strokeRect(doorX, doorY, 30 * PIXEL, 90 * PIXEL);
  // Doorknob
  ctx.fillStyle = '#d4a017';
  ctx.fillRect(doorX + 5 * PIXEL, doorY + 45 * PIXEL, 4 * PIXEL, 4 * PIXEL);

  // Draw furniture
  for (const furnitureId of unlockedFurniture) {
    const f = FURNITURE[furnitureId];
    if (!f) continue;
    drawPixelFurniture(ctx, f, offsetX, offsetY);
  }

  // Room border
  ctx.strokeStyle = '#5a5a8a';
  ctx.lineWidth = PIXEL * 2;
  ctx.strokeRect(offsetX - PIXEL, offsetY - PIXEL,
    ROOM_W * PIXEL + PIXEL * 2, (ROOM_H + 30) * PIXEL + PIXEL * 2);
}

function drawPixelFurniture(ctx, furniture, offsetX, offsetY) {
  const x = offsetX + furniture.x * PIXEL;
  const y = offsetY + furniture.y * PIXEL;
  const w = furniture.w * PIXEL;
  const h = furniture.h * PIXEL;

  // Main body
  ctx.fillStyle = furniture.color;
  ctx.fillRect(x, y, w, h);

  // Pixel art detail - top highlight
  ctx.fillStyle = lighten(furniture.color, 30);
  ctx.fillRect(x + PIXEL, y + PIXEL, w - PIXEL * 2, PIXEL * 2);

  // Bottom shadow
  ctx.fillStyle = darken(furniture.color, 40);
  ctx.fillRect(x, y + h - PIXEL * 2, w, PIXEL * 2);

  // Outline
  ctx.strokeStyle = darken(furniture.color, 60);
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);
}

function fillPixelCircle(ctx, cx, cy, r) {
  for (let y = -r; y <= r; y += 2) {
    for (let x = -r; x <= r; x += 2) {
      if (x * x + y * y <= r * r) {
        ctx.fillRect(cx + x, cy + y, 2, 2);
      }
    }
  }
}

function lighten(hex, amount) {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount);
  return `rgb(${r},${g},${b})`;
}

function darken(hex, amount) {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount);
  return `rgb(${r},${g},${b})`;
}

export function drawLabel(ctx, text, x, y, color = '#fff', size = 12) {
  ctx.fillStyle = color;
  ctx.font = `${size}px 'Noto Sans JP', sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y);
}
