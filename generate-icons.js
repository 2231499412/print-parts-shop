const sharp = require('sharp');
const path = require('path');

const SIZE = 81;
const dir = path.join(__dirname, 'src/static/tabbar');

const normalColor = '#8B90A0';
const activeColor = '#B87333';

// Home icon SVG
function homeSVG(color) {
  return `<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40.5 12L10 38h8v28h18V48h9v18h18V38h8L40.5 12z" fill="${color}"/>
  </svg>`;
}

// Category icon SVG (4 squares grid)
function categorySVG(color) {
  return `<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="12" width="24" height="24" rx="4" fill="${color}"/>
    <rect x="45" y="12" width="24" height="24" rx="4" fill="${color}"/>
    <rect x="12" y="45" width="24" height="24" rx="4" fill="${color}"/>
    <rect x="45" y="45" width="24" height="24" rx="4" fill="${color}"/>
  </svg>`;
}

// Contact icon SVG (phone handset)
function contactSVG(color) {
  return `<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M52 47.5l-5.5 5.5c-1.5 1.5-4 2-6 1-3-1.5-6-3.5-9-6.5s-5-6-6.5-9c-1-2-.5-4.5 1-6l5.5-5.5c1-1 1-2.5 0-3.5l-8-8c-1-1-2.5-1-3.5 0l-5 5c-2 2-2.5 5-1 7.5 2 4 5 8.5 9 12.5s8.5 7 12.5 9c2.5 1.5 5.5 1 7.5-1l5-5c1-1 1-2.5 0-3.5l-8-8c-1-1-2.5-1-3.5 0z" fill="${color}"/>
  </svg>`;
}

async function generate() {
  const icons = [
    { name: 'home', fn: homeSVG },
    { name: 'category', fn: categorySVG },
    { name: 'contact', fn: contactSVG },
  ];

  for (const icon of icons) {
    // Normal
    await sharp(Buffer.from(icon.fn(normalColor)))
      .resize(SIZE, SIZE)
      .png()
      .toFile(path.join(dir, `${icon.name}.png`));
    // Active
    await sharp(Buffer.from(icon.fn(activeColor)))
      .resize(SIZE, SIZE)
      .png()
      .toFile(path.join(dir, `${icon.name}-active.png`));
    console.log(`Generated ${icon.name}.png and ${icon.name}-active.png`);
  }
}

generate().catch(console.error);
