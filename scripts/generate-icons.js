import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

// Table for CRC-32
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = data.length;
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(len, 0);

  const toCrc = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(toCrc);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function generatePng(width, height, isMaskable = false) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8 bits per channel
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Raw image data with scanline filters
  // Unfiltered: byte 0 per line = 0 (None)
  const rowStride = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowStride);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * (isMaskable ? 0.38 : 0.44);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowStride;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Deep Navy / Slate background #0f172a
      let r = 15;
      let g = 23;
      let b = 42;
      let a = 255;

      // Circle badge
      if (dist <= radius) {
        // Indian Tiranga Inspired Gradient & Emblem Shield
        const t = y / height;
        if (t < 0.35) {
          // Saffron / Amber #f59e0b
          r = 245; g = 158; b = 11;
        } else if (t < 0.65) {
          // Clean White/Silver band #ffffff
          r = 255; g = 255; b = 255;
        } else {
          // India Green #16a34a
          r = 22; g = 163; b = 74;
        }

        // Inner circular emblem with Chakra navy
        const innerDist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        if (innerDist < radius * 0.45 && innerDist > radius * 0.40) {
          r = 15; g = 23; b = 42; // Chakra ring
        } else if (innerDist <= radius * 0.40) {
          // Chakra center navy shield with golden star/ashoka accents
          r = 30; g = 58; b = 138;
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate Icons
console.log('Generating PWA compliant icons...');
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generatePng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generatePng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generatePng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePng(180, 180, false));

// Generate SVG Icon
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="saffron" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fb923c"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <linearGradient id="green" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#22c55e"/>
      <stop offset="100%" stop-color="#15803d"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <circle cx="256" cy="256" r="190" fill="#ffffff" fill-opacity="0.08"/>
  <g transform="translate(256, 256)">
    <!-- Ashoka Chakra Spokes & Circle -->
    <circle r="150" fill="none" stroke="#f59e0b" stroke-width="8" stroke-dasharray="16 8"/>
    <circle r="120" fill="#1e293b" stroke="#38bdf8" stroke-width="4"/>
    <!-- Indian Emblem Pillars / Shield -->
    <path d="M-60 -40 L0 -90 L60 -40 L60 60 L0 90 L-60 60 Z" fill="url(#saffron)" opacity="0.95"/>
    <path d="M-40 -20 L0 -60 L40 -20 L40 50 L0 70 L-40 50 Z" fill="#0f172a"/>
    <!-- Text / Emblem detail -->
    <circle cx="0" cy="5" r="18" fill="#38bdf8"/>
    <circle cx="0" cy="5" r="8" fill="#ffffff"/>
  </g>
  <!-- Tiranga Top & Bottom Accents -->
  <rect x="96" y="440" width="106" height="12" rx="6" fill="#f59e0b"/>
  <rect x="212" y="440" width="88" height="12" rx="6" fill="#ffffff"/>
  <rect x="310" y="440" width="106" height="12" rx="6" fill="#22c55e"/>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon.trim());

console.log('All icons generated successfully!');
