// 間取り図 SVG レンダラ
// 1単位 = 1 メートル。

const TATAMI_SQM = 1.62; // 関東基準
const PIXEL_PER_M = 26;

const ROOM_COLORS = {
  entry: "#e9dec2",
  corridor: "#f3ecdb",
  living: "#fbf3df",
  dining: "#fbf3df",
  kitchen: "#f0e2cd",
  bedroom: "#e6d7be",
  bath: "#cfdde3",
  wc: "#c2d2db",
  work: "#dac9b3",
  garden: "#cad8b9",
  japanese: "#ead9b6",
  closet: "#c7b596",
};

const ROOM_HATCH = {
  garden: "garden",
  japanese: "tatami",
};

const ROOM_LABEL = {
  entry: "玄",
  corridor: "廊",
  living: "L",
  dining: "D",
  kitchen: "K",
  bedroom: "寝",
  bath: "浴",
  wc: "WC",
  work: "書",
  garden: "庭",
  japanese: "和",
  closet: "押",
};

export function calcGeometry(home) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const r of home.rooms) {
    if (r.x < minX) minX = r.x;
    if (r.y < minY) minY = r.y;
    if (r.x + r.w > maxX) maxX = r.x + r.w;
    if (r.y + r.h > maxY) maxY = r.y + r.h;
  }
  const width = maxX - minX;
  const height = maxY - minY;
  return { minX, minY, maxX, maxY, width, height };
}

export function roomTatami(room) {
  return Math.round((room.w * room.h) / TATAMI_SQM * 10) / 10;
}

export function roomSqm(room) {
  return room.w * room.h;
}

export function totalSqm(home) {
  let total = 0;
  for (const r of home.rooms) {
    if (r.type === "garden") continue;
    total += roomSqm(r);
  }
  return Math.round(total * 10) / 10;
}

/**
 * Render a home as an SVG string.
 * @param {object} home
 * @param {object} options - { selected: id, scale: number, showLabels: bool }
 */
export function renderFloorplan(home, options = {}) {
  const { selectedRoom = null, scale = PIXEL_PER_M, showAnnotations = true } = options;
  const g = calcGeometry(home);
  const PAD = 2; // meters padding
  const svgW = (g.width + PAD * 2) * scale;
  const svgH = (g.height + PAD * 2) * scale;
  const offsetX = (-g.minX + PAD) * scale;
  const offsetY = (-g.minY + PAD) * scale;

  const parts = [];
  parts.push(`<svg viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg" class="floorplan-svg" role="img" aria-label="${escapeXml(home.title)} 間取り図">`);
  parts.push(renderDefs());

  // ground / paper
  parts.push(`<rect x="0" y="0" width="${svgW}" height="${svgH}" fill="#fdfbf3" />`);

  // grid (light dotted)
  parts.push(`<g class="grid">`);
  for (let i = 0; i <= g.width + PAD * 2; i++) {
    const x = i * scale;
    parts.push(`<line x1="${x}" y1="0" x2="${x}" y2="${svgH}" stroke="#e9dec2" stroke-width="0.5" stroke-dasharray="2 4" />`);
  }
  for (let i = 0; i <= g.height + PAD * 2; i++) {
    const y = i * scale;
    parts.push(`<line x1="0" y1="${y}" x2="${svgW}" y2="${y}" stroke="#e9dec2" stroke-width="0.5" stroke-dasharray="2 4" />`);
  }
  parts.push(`</g>`);

  // Group rooms by floor — draw floor label first
  const floors = [...new Set(home.rooms.map(r => r.floor))].sort();
  for (const fl of floors) {
    const floorRooms = home.rooms.filter(r => r.floor === fl);
    if (floorRooms.length === 0) continue;
    let fMinX = Infinity, fMinY = Infinity, fMaxX = -Infinity, fMaxY = -Infinity;
    for (const r of floorRooms) {
      fMinX = Math.min(fMinX, r.x);
      fMinY = Math.min(fMinY, r.y);
      fMaxX = Math.max(fMaxX, r.x + r.w);
      fMaxY = Math.max(fMaxY, r.y + r.h);
    }
    const lx = (fMinX - g.minX + PAD) * scale;
    const ly = (fMinY - g.minY + PAD) * scale - 8;
    parts.push(`<text x="${lx}" y="${ly}" class="floor-label" font-size="14" font-weight="700" fill="#5e4b32">${fl}F</text>`);
  }

  // Rooms
  for (const r of home.rooms) {
    const x = (r.x - g.minX + PAD) * scale;
    const y = (r.y - g.minY + PAD) * scale;
    const w = r.w * scale;
    const h = r.h * scale;
    const fill = ROOM_COLORS[r.type] ?? "#fbf3df";
    const isSelected = selectedRoom && selectedRoom === r.name + "@" + r.floor;
    const hatch = ROOM_HATCH[r.type];
    const fillUrl = hatch ? `url(#hatch-${hatch})` : fill;
    parts.push(`<g class="room ${isSelected ? "is-selected" : ""}" data-room="${escapeXml(r.name)}" data-floor="${r.floor}">`);
    parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="#2b3a4a" stroke-width="2" rx="1"/>`);
    if (hatch) {
      parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fillUrl}" stroke="none" pointer-events="none"/>`);
    }
    if (r.highlight) {
      parts.push(`<rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" fill="none" stroke="#c8956d" stroke-width="1.5" stroke-dasharray="3 3" pointer-events="none"/>`);
    }
    if (showAnnotations) {
      const labelGlyph = ROOM_LABEL[r.type] ?? "";
      const sizeText = `${roomSqm(r).toFixed(0)}㎡`;
      const tatami = r.type === "japanese" || r.type === "bedroom" ? `${roomTatami(r).toFixed(1)}畳` : "";
      const cx = x + w / 2;
      const cy = y + h / 2;
      parts.push(`<text x="${cx}" y="${cy - 4}" class="room-name" text-anchor="middle" font-size="${Math.min(14, w / 8)}" font-weight="700" fill="#1c1b1a">${escapeXml(r.name)}</text>`);
      const subtext = tatami ? `${sizeText} (${tatami})` : sizeText;
      parts.push(`<text x="${cx}" y="${cy + 10}" class="room-meta" text-anchor="middle" font-size="9" fill="#5e4b32">${subtext}</text>`);
      if (labelGlyph && w > 30 && h > 30) {
        parts.push(`<text x="${x + 4}" y="${y + 12}" font-size="9" fill="#a18a6a" font-weight="700">${labelGlyph}</text>`);
      }
    }
    parts.push(`</g>`);
  }

  // North arrow & scale
  if (showAnnotations) {
    const nx = svgW - 50;
    const ny = 40;
    parts.push(`<g transform="translate(${nx}, ${ny})">
      <circle cx="0" cy="0" r="18" fill="white" stroke="#2b3a4a"/>
      <path d="M 0,-14 L 5,8 L 0,3 L -5,8 Z" fill="#2b3a4a"/>
      <text x="0" y="-20" text-anchor="middle" font-size="11" fill="#2b3a4a" font-weight="700">N</text>
    </g>`);

    const sx = 20;
    const sy = svgH - 24;
    const barLen = scale * 2;
    parts.push(`<g transform="translate(${sx}, ${sy})">
      <line x1="0" y1="0" x2="${barLen}" y2="0" stroke="#2b3a4a" stroke-width="2"/>
      <line x1="0" y1="-4" x2="0" y2="4" stroke="#2b3a4a" stroke-width="2"/>
      <line x1="${barLen}" y1="-4" x2="${barLen}" y2="4" stroke="#2b3a4a" stroke-width="2"/>
      <text x="${barLen / 2}" y="-7" text-anchor="middle" font-size="10" fill="#2b3a4a">2 m</text>
    </g>`);
  }

  parts.push(`</svg>`);
  return parts.join("");
}

function renderDefs() {
  return `<defs>
    <pattern id="hatch-tatami" patternUnits="userSpaceOnUse" width="26" height="13">
      <rect width="26" height="13" fill="none"/>
      <line x1="0" y1="0" x2="0" y2="13" stroke="#caa56b" stroke-width="0.8" opacity="0.4"/>
      <line x1="13" y1="0" x2="13" y2="13" stroke="#caa56b" stroke-width="0.8" opacity="0.4"/>
    </pattern>
    <pattern id="hatch-garden" patternUnits="userSpaceOnUse" width="6" height="6">
      <rect width="6" height="6" fill="none"/>
      <circle cx="3" cy="3" r="0.6" fill="#7d8c66" opacity="0.5"/>
    </pattern>
  </defs>`;
}

function escapeXml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
