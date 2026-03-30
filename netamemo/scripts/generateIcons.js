#!/usr/bin/env node
// scripts/generateIcons.js — Generate simple PNG icons for the extension

const fs = require("fs");
const path = require("path");

/**
 * Create a minimal valid PNG file with a solid color background and a lightbulb-ish shape.
 * Uses raw PNG construction (no canvas dependency).
 */
function createPng(size) {
  // We'll create a simple PNG with IHDR, IDAT (uncompressed), IEND
  const zlib = require("zlib");

  // Create raw pixel data (RGBA)
  const pixels = Buffer.alloc(size * size * 4);

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.4;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < r) {
        // Gradient from coral to amber
        const t = dist / r;
        // Background circle
        pixels[idx] = Math.round(255 * (1 - t * 0.3));     // R
        pixels[idx + 1] = Math.round(107 + 72 * t);         // G
        pixels[idx + 2] = Math.round(107 - 36 * t);         // B
        pixels[idx + 3] = 255;                                // A

        // Lightbulb shape (inner brighter area)
        const bulbR = r * 0.55;
        const bulbCy = cy - r * 0.1;
        const bulbDist = Math.sqrt(dx * dx + (y - bulbCy) * (y - bulbCy));
        if (bulbDist < bulbR) {
          // Bright yellow center
          pixels[idx] = 255;
          pixels[idx + 1] = 230;
          pixels[idx + 2] = 150;
          pixels[idx + 3] = 255;
        }

        // Base of bulb (small rectangle at bottom)
        if (Math.abs(dx) < r * 0.25 && y > cy + r * 0.25 && y < cy + r * 0.55) {
          pixels[idx] = 78;
          pixels[idx + 1] = 205;
          pixels[idx + 2] = 196;
          pixels[idx + 3] = 255;
        }
      } else {
        // Transparent
        pixels[idx] = 0;
        pixels[idx + 1] = 0;
        pixels[idx + 2] = 0;
        pixels[idx + 3] = 0;
      }
    }
  }

  // Build raw data for IDAT: each row has a filter byte (0 = None) + RGBA data
  const rawData = Buffer.alloc(size * (1 + size * 4));
  for (let y = 0; y < size; y++) {
    const rowOffset = y * (1 + size * 4);
    rawData[rowOffset] = 0; // filter: None
    pixels.copy(rawData, rowOffset + 1, y * size * 4, (y + 1) * size * 4);
  }

  const compressed = zlib.deflateSync(rawData);

  // Build PNG
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const typeAndData = Buffer.concat([Buffer.from(type), data]);
    const crc = crc32(typeAndData);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc >>> 0);
    return Buffer.concat([len, typeAndData, crcBuf]);
  }

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);   // width
  ihdrData.writeUInt32BE(size, 4);   // height
  ihdrData[8] = 8;                    // bit depth
  ihdrData[9] = 6;                    // color type: RGBA
  ihdrData[10] = 0;                   // compression
  ihdrData[11] = 0;                   // filter
  ihdrData[12] = 0;                   // interlace

  const ihdr = makeChunk("IHDR", ihdrData);
  const idat = makeChunk("IDAT", compressed);
  const iend = makeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

// CRC32 lookup table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Generate icons
const iconsDir = path.join(__dirname, "..", "icons");
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

[16, 48, 128].forEach((size) => {
  const png = createPng(size);
  const filePath = path.join(iconsDir, `icon${size}.png`);
  fs.writeFileSync(filePath, png);
  console.log(`Generated ${filePath} (${png.length} bytes)`);
});

console.log("Icon generation complete.");
