// Run with: node create-icons.js
// Creates simple PNG icons for the extension
const fs = require('fs');

function createPNG(size) {
  // Create a minimal valid PNG with a colored square
  // Using raw PNG generation (no dependencies)
  const { createCanvas } = (() => {
    try { return require('canvas'); } catch(e) { return {}; }
  })();

  // Fallback: create 1x1 pixel placeholder PNGs
  // These are valid minimal PNGs
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A
  ]);

  // IHDR chunk
  const width = size;
  const height = size;
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // color type (RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  // Create image data (warm cream color)
  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0); // filter byte
    for (let x = 0; x < width; x++) {
      const cx = x - width/2;
      const cy = y - height/2;
      const dist = Math.sqrt(cx*cx + cy*cy);
      const radius = width/2 - 1;

      if (dist <= radius) {
        // Inside circle
        const ex = width*0.2, ey = height*0.28, ew = width*0.6, eh = height*0.44;
        const sealR = width * 0.12;
        const sealDist = Math.sqrt((x-width/2)**2 + (y-(ey+eh*0.35))**2);

        if (sealDist <= sealR) {
          // Wax seal (red)
          rawData.push(192, 57, 43);
        } else if (x >= ex && x <= ex+ew && y >= ey && y <= ey+eh) {
          // Envelope body (white-ish)
          rawData.push(255, 248, 240);
        } else {
          // Background (cream)
          rawData.push(245, 230, 211);
        }
      } else {
        // Outside circle (transparent via RGB trick - use matching bg)
        rawData.push(255, 255, 255);
      }
    }
  }

  const { deflateSync } = require('zlib');
  const compressed = deflateSync(Buffer.from(rawData));

  function crc32(buf) {
    let crc = 0xFFFFFFFF;
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      table[i] = c;
    }
    for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeAndData = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(typeAndData), 0);
    return Buffer.concat([len, typeAndData, crc]);
  }

  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([pngHeader, ihdrChunk, idatChunk, iendChunk]);
}

[16, 48, 128].forEach(size => {
  const png = createPNG(size);
  fs.writeFileSync(`icon${size}.png`, png);
  console.log(`Created icon${size}.png (${png.length} bytes)`);
});
