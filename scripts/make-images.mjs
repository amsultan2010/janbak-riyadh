// One-off: draws the favicon, touch icon and share images into public/.
// Run with `node scripts/make-images.mjs` after changing the name or colours.
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const GROUND = '#0a4b2c';
const INK = '#f5f2e7';
const out = (name) => new URL(`../public/${name}`, import.meta.url);

// a map pin on the site's green
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${GROUND}"/><path fill="${INK}" d="M32 10c-9 0-16 7-16 16 0 12 16 28 16 28s16-16 16-28c0-9-7-16-16-16zm0 22a6 6 0 1 1 0-12 6 6 0 0 1 0 12z"/></svg>`;
writeFileSync(out('favicon.svg'), icon);
await sharp(Buffer.from(icon)).resize(180, 180).png().toFile(out('apple-touch-icon.png').pathname);

// .ico holding one 32px PNG
const png = await sharp(Buffer.from(icon)).resize(32, 32).png().toBuffer();
const head = Buffer.alloc(22);
head.writeUInt16LE(1, 2);
head.writeUInt16LE(1, 4);
head.writeUInt8(32, 6);
head.writeUInt8(32, 7);
head.writeUInt16LE(1, 10);
head.writeUInt16LE(32, 12);
head.writeUInt32LE(png.length, 14);
head.writeUInt32LE(22, 18);
writeFileSync(out('favicon.ico'), Buffer.concat([head, png]));

const share = ({ lang, name, title, labels }) => {
  const rtl = lang === 'ar';
  const x = rtl ? 1120 : 80;
  const anchor = 'start'; // with direction=rtl, start is the right edge
  const font = rtl ? 'Geeza Pro, Arial' : 'Helvetica Neue, Arial';
  const cells = ['911', '997', '937']
    .map((n, i) => {
      const cx = rtl ? 1120 - i * 400 : 80 + i * 400;
      return `<text x="${cx}" y="92" font-size="76" font-weight="700" text-anchor="${anchor}" font-family="Helvetica Neue, Arial">${n}</text><text x="${cx}" y="138" font-size="30" text-anchor="${anchor}">${labels[i]}</text>`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" font-family="${font}" direction="${rtl ? 'rtl' : 'ltr'}">
    <rect width="1200" height="630" fill="${GROUND}"/>
    <rect width="1200" height="170" fill="${INK}"/>
    <g fill="${GROUND}">${cells}</g>
    <g fill="${INK}" text-anchor="${anchor}">
      <text x="${x}" y="300" font-size="44" font-weight="700">${name}</text>
      ${title.map((line, i) => `<text x="${x}" y="${420 + i * 110}" font-size="92" font-weight="700">${line}</text>`).join('')}
    </g>
  </svg>`;
};

await sharp(Buffer.from(share({ lang: 'ar', name: 'دليل الرياض', title: ['الأماكن الأساسية', 'في الرياض'], labels: ['الطوارئ', 'الإسعاف', 'استشارة صحية'] })))
  .png()
  .toFile(out('og-ar.png').pathname);
await sharp(Buffer.from(share({ lang: 'en', name: 'Riyadh Guide', title: ['Essential places', 'in Riyadh'], labels: ['Emergency', 'Ambulance', 'Health advice'] })))
  .png()
  .toFile(out('og-en.png').pathname);
console.log('images written');
