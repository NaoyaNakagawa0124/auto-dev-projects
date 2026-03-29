// Floor plan editor and renderer
import { ROOM_TYPES } from './mystery.js';

const GRID_SIZE = 60;
const GRID_COLS = 8;
const GRID_ROWS = 6;

export class FloorPlan {
  constructor() {
    this.rooms = [];
    this.nextId = 1;
  }

  addRoom(gridX, gridY, type, width = 2, height = 2) {
    // Validate bounds
    if (gridX < 0 || gridY < 0 || gridX + width > GRID_COLS || gridY + height > GRID_ROWS) return null;
    // Check overlap
    if (this.hasOverlap(gridX, gridY, width, height)) return null;

    const room = {
      id: `room_${this.nextId++}`,
      type,
      x: gridX,
      y: gridY,
      w: width,
      h: height,
    };
    this.rooms.push(room);
    return room;
  }

  removeRoom(id) {
    this.rooms = this.rooms.filter(r => r.id !== id);
  }

  hasOverlap(x, y, w, h, excludeId = null) {
    return this.rooms.some(r => {
      if (r.id === excludeId) return false;
      return !(x + w <= r.x || x >= r.x + r.w || y + h <= r.y || y >= r.y + r.h);
    });
  }

  getRoomAt(gridX, gridY) {
    return this.rooms.find(r =>
      gridX >= r.x && gridX < r.x + r.w &&
      gridY >= r.y && gridY < r.y + r.h
    );
  }

  getRoomCount() { return this.rooms.length; }

  clear() {
    this.rooms = [];
    this.nextId = 1;
  }

  toJSON() {
    return JSON.stringify(this.rooms);
  }

  fromJSON(json) {
    try {
      this.rooms = JSON.parse(json);
      this.nextId = this.rooms.length > 0
        ? Math.max(...this.rooms.map(r => parseInt(r.id.split('_')[1]) || 0)) + 1
        : 1;
      return true;
    } catch { return false; }
  }
}

export function drawFloorPlan(ctx, floorPlan, offsetX, offsetY, options = {}) {
  const { highlightRoom, crimeScene, clueRooms, mode } = options;
  const w = GRID_COLS * GRID_SIZE;
  const h = GRID_ROWS * GRID_SIZE;

  // Background
  ctx.fillStyle = '#0c0c1e';
  ctx.fillRect(offsetX, offsetY, w, h);

  // Grid
  ctx.strokeStyle = 'rgba(60, 60, 100, 0.3)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= GRID_COLS; x++) {
    ctx.beginPath();
    ctx.moveTo(offsetX + x * GRID_SIZE, offsetY);
    ctx.lineTo(offsetX + x * GRID_SIZE, offsetY + h);
    ctx.stroke();
  }
  for (let y = 0; y <= GRID_ROWS; y++) {
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY + y * GRID_SIZE);
    ctx.lineTo(offsetX + w, offsetY + y * GRID_SIZE);
    ctx.stroke();
  }

  // Rooms
  floorPlan.rooms.forEach(room => {
    const rx = offsetX + room.x * GRID_SIZE;
    const ry = offsetY + room.y * GRID_SIZE;
    const rw = room.w * GRID_SIZE;
    const rh = room.h * GRID_SIZE;
    const roomType = ROOM_TYPES.find(rt => rt.id === room.type);
    const color = roomType ? roomType.color : '#666';

    // Room fill
    ctx.fillStyle = color + '80'; // semi-transparent
    ctx.fillRect(rx + 1, ry + 1, rw - 2, rh - 2);

    // Highlight
    if (highlightRoom === room.id) {
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 3;
      ctx.strokeRect(rx, ry, rw, rh);
    }

    // Crime scene marker
    if (crimeScene === room.id && mode === 'investigate') {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.15)';
      ctx.fillRect(rx + 1, ry + 1, rw - 2, rh - 2);
      ctx.strokeStyle = '#ff4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(rx + 2, ry + 2, rw - 4, rh - 4);
      ctx.setLineDash([]);
    }

    // Clue indicator
    if (clueRooms && clueRooms.includes(room.id)) {
      ctx.fillStyle = '#ffd700';
      ctx.font = '14px sans-serif';
      ctx.fillText('🔍', rx + rw - 22, ry + 18);
    }

    // Room border
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(rx + 1, ry + 1, rw - 2, rh - 2);

    // Room label
    const emoji = roomType ? roomType.emoji : '?';
    const name = roomType ? roomType.name : room.type;
    ctx.fillStyle = '#e0e0e0';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(emoji, rx + rw / 2, ry + rh / 2 - 4);
    ctx.font = '11px Noto Sans JP, sans-serif';
    ctx.fillText(name, rx + rw / 2, ry + rh / 2 + 14);
    ctx.textAlign = 'left';
  });

  // Blueprint border
  ctx.strokeStyle = 'rgba(100, 140, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.strokeRect(offsetX - 1, offsetY - 1, w + 2, h + 2);
}

export function gridFromPixel(px, py, offsetX, offsetY) {
  return {
    x: Math.floor((px - offsetX) / GRID_SIZE),
    y: Math.floor((py - offsetY) / GRID_SIZE),
  };
}

export { GRID_SIZE, GRID_COLS, GRID_ROWS };
