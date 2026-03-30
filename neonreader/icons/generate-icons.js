/**
 * Generate simple neon-colored PNG icons for the extension.
 * Creates a dark background with a neon "N" letter.
 *
 * Usage: node icons/generate-icons.js
 *
 * This generates minimal valid PNG files without external dependencies.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPng(size) {
  const neonGreen = [0, 255, 65];
  const darkBg = [10, 10, 15];
  const darkBorder = [0, 80, 32];

  // Create pixel data (RGBA)
  const pixels = [];
  const center = size / 2;
  const letterSize = Math.floor(size * 0.6);
  const letterStart = Math.floor((size - letterSize) / 2);
  const letterEnd = letterStart + letterSize;
  const strokeWidth = Math.max(2, Math.floor(size * 0.12));

  for (let y = 0; y < size; y++) {
    pixels.push(0); // Filter byte for PNG row
    for (let x = 0; x < size; x++) {
      // Check if pixel is part of the "N" letter
      const inLetterArea = x >= letterStart && x < letterEnd && y >= letterStart && y < letterEnd;

      // Relative position within letter area
      const lx = x - letterStart;
      const ly = y - letterStart;

      let isLetter = false;
      if (inLetterArea) {
        // Left vertical stroke
        if (lx < strokeWidth) isLetter = true;
        // Right vertical stroke
        if (lx >= letterSize - strokeWidth) isLetter = true;
        // Diagonal stroke
        const diagX = Math.floor((ly / letterSize) * (letterSize - strokeWidth));
        if (lx >= diagX && lx < diagX + strokeWidth) isLetter = true;
      }

      // Circle border/glow
      const dist = Math.sqrt((x - center) ** 2 + (y - center) ** 2);
      const radius = size * 0.42;
      const isBorder = dist >= radius - 1 && dist <= radius + 1;

      if (isLetter) {
        pixels.push(neonGreen[0], neonGreen[1], neonGreen[2], 255);
      } else if (isBorder) {
        pixels.push(darkBorder[0], darkBorder[1], darkBorder[2], 255);
      } else {
        pixels.push(darkBg[0], darkBg[1], darkBg[2], 255);
      }
    }
  }

  return encodePng(size, size, Buffer.from(pixels));
}

function encodePng(width, height, rawData) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type (RGBA)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = createChunk('IHDR', ihdrData);

  // IDAT chunk (compressed pixel data)
  const compressed = zlib.deflateSync(rawData, { level: 9 });
  const idat = createChunk('IDAT', compressed);

  // IEND chunk
  const iend = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuffer, data]);

  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcData), 0);

  return Buffer.concat([length, typeBuffer, data, crc]);
}

// CRC32 implementation for PNG
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      if (crc & 1) {
        crc = (crc >>> 1) ^ 0xedb88320;
      } else {
        crc = crc >>> 1;
      }
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Generate icons
const sizes = [16, 48, 128];
const iconsDir = path.join(__dirname);

for (const size of sizes) {
  const png = createPng(size);
  const filePath = path.join(iconsDir, `icon${size}.png`);
  fs.writeFileSync(filePath, png);
  console.log(`生成完了: icon${size}.png (${png.length} bytes)`);
}

console.log('全アイコン生成完了！');
