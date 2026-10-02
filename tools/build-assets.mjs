// Studio Nathan 사이트의 그림 만들기
//   node tools/build-assets.mjs
//
// 만드는 것
//   favicon.svg · favicon.ico(16·32·48) · apple-touch-icon.png(180)   등잔 표지
//   og-image.png (1200×630)                                            카카오톡·SNS 링크 미리보기
//   assets/games/*.webp                                                 assets-src/ 의 게임 그림을 가볍게
//
// 크롬·엣지와 puppeteer-core 가 필요해요.
//   npm i -D puppeteer-core            (처음 한 번, 이 폴더에서)
//   BROWSER_PATH=브라우저 실행 파일 경로  (없으면 윈도우 엣지 기본 위치)
// 새 게임 그림을 넣으려면 assets-src/ 에 원본을 두고 아래 GAME_IMAGES 에 한 줄을 더하세요.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

// [원본, 결과, 너비] — 높이는 원본 비율대로
const GAME_IMAGES = [
  ['assets-src/starlight-cover.png', 'assets/games/starlight-cover.webp', 1200],
  ['assets-src/starlight-phone.png', 'assets/games/starlight-phone.webp', 540],
  ['assets-src/rumors-cover.jpg', 'assets/games/rumors-cover.webp', 1200],
  ['assets-src/rumors-screen.png', 'assets/games/rumors-screen.webp', 960],
];

// 등잔 (index.html 의 <symbol id="lamp"> 와 같은 그림, 64×64)
const FLAME_GRADIENT = `<linearGradient id="flame-fill" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="#ef8a2c"/><stop offset="0.55" stop-color="#f4b942"/><stop offset="1" stop-color="#ffe08a"/>
  </linearGradient>`;
const LAMP = `
    <path d="M20 9.5 21.5 14.5 26.5 16 21.5 17.5 20 22.5 18.5 17.5 13.5 16 18.5 14.5Z" fill="#ffe6a6"/>
    <path d="M55.6 37C51.6 33 52 27 56 19.5 60 27 60.4 33 56.4 37Z" fill="url(#flame-fill)"/>
    <path d="M55.9 35.6C54.2 33.2 54.5 30 56.1 26.6 57.7 30 58 33.2 56.4 35.6Z" fill="#fff4cc"/>
    <path d="M6 41C6 34.5 17 31 29 31 37 31 43 32.5 48 35L55.4 36.3C57.9 36.8 57.9 40.2 55.4 40.7L48 42C43 46.5 36 49 28 49 15 49 6 46.5 6 41Z" fill="#c0683f"/>
    <path d="M9 40.5C10 36 19 33.4 29 33.4 35 33.4 40 34.3 44 35.8" fill="none" stroke="#e39a6c" stroke-width="1.6" stroke-linecap="round" opacity=".85"/>
    <ellipse cx="25" cy="34.6" rx="6" ry="1.7" fill="#7e3b22"/>
    <path d="M10 44C17 47 37 47.5 46 42.6" fill="none" stroke="#8f4628" stroke-width="1.4" stroke-linecap="round" opacity=".55"/>
    <ellipse cx="27" cy="49.4" rx="9" ry="1.6" fill="#8f4628"/>`;

/** 밤하늘 바탕 위의 등잔 아이콘. rounded: 탭 아이콘은 둥근 네모, 홈 화면 아이콘은 꽉 찬 네모(기기가 모서리를 깎음) */
const iconSvg = ({ rounded, scale }) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <!-- Studio Nathan: 밤하늘의 등잔 -->
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1d48"/><stop offset="1" stop-color="#2c2a66"/></linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffd27a" stop-opacity="0.55"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
    ${FLAME_GRADIENT}
  </defs>
  <rect width="64" height="64" ${rounded ? 'rx="14"' : ''} fill="url(#sky)"/>
  <g transform="translate(32 32.5) scale(${scale}) translate(-32 -30.5)">
    <circle cx="56" cy="29" r="15" fill="url(#glow)"/>
    ${LAMP}
  </g>
</svg>
`;
const FAVICON = iconSvg({ rounded: true, scale: 0.94 });
const TOUCH_ICON = iconSvg({ rounded: false, scale: 0.8 });

/** 링크 미리보기 1200×630 */
function ogHtml() {
  const dataUri = (file, type) => `data:${type};base64,${readFileSync(ROOT + file).toString('base64')}`;
  // 별은 매번 같은 자리에 (씨앗이 있는 난수)
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const stars = Array.from({ length: 90 }, () => {
    const r = rand() < 0.15 ? 1.6 : rand() < 0.5 ? 1.1 : 0.8;
    return `<circle cx="${(rand() * 1200).toFixed(1)}" cy="${(rand() * 630).toFixed(1)}" r="${r}" fill="${rand() < 0.3 ? '#ffe6a6' : '#ffffff'}" opacity="${(0.35 + rand() * 0.55).toFixed(2)}"/>`;
  }).join('');
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,500&family=Gowun+Batang:wght@400;700&display=block">
<style>
  * { box-sizing: border-box; margin: 0 }
  body { width: 1200px; height: 630px; overflow: hidden; background: linear-gradient(180deg, #15183a, #24285c); color: #f3eadb; font-family: 'Gowun Batang', serif }
  .stars { position: absolute; inset: 0 }
  /* 불꽃(등잔 그림의 56, 28 자리)을 가운데 두고 번지는 빛 */
  .glow { position: absolute; left: 166px; top: -2px; width: 560px; height: 560px;
          background: radial-gradient(circle, rgba(255, 210, 120, .36) 0%, rgba(244, 185, 66, .1) 35%, transparent 65%) }
  .lamp { position: absolute; left: 70px; top: 90px; width: 430px; height: 430px; filter: drop-shadow(0 22px 34px rgba(0,0,0,.5)) }
  .copy { position: absolute; left: 545px; top: 0; bottom: 0; right: 50px; display: flex; flex-direction: column; justify-content: center }
  .eyebrow { font: 600 21px 'Cormorant Garamond', serif; letter-spacing: .28em; text-transform: uppercase; color: #f4b942 }
  h1 { margin-top: 6px; font: 600 92px/1.05 'Cormorant Garamond', serif; letter-spacing: .01em; white-space: nowrap }
  .tag { margin-top: 18px; font-size: 36px; font-weight: 700; color: #f3eadb }
  .games { display: flex; gap: 18px; margin-top: 36px }
  .game { display: grid; gap: 8px; font-size: 19px; color: #bdb5d4 }
  .game img { width: 250px; height: 131px; object-fit: cover; border-radius: 12px; border: 1px solid rgba(255,255,255,.12); box-shadow: 0 16px 30px -16px rgba(0,0,0,.7) }
  .url { position: absolute; left: 112px; bottom: 44px; font: 500 italic 24px 'Cormorant Garamond', serif; letter-spacing: .08em; color: rgba(189,181,212,.75) }
</style></head><body>
  <svg class="stars" viewBox="0 0 1200 630">${stars}</svg>
  <div class="glow"></div>
  <svg class="lamp" viewBox="0 0 64 64"><defs>${FLAME_GRADIENT}</defs>${LAMP}</svg>
  <div class="copy">
    <p class="eyebrow">Christian Indie Game Studio</p>
    <h1>Studio Nathan</h1>
    <p class="tag">이야기 하나로, 마음에 닿는 게임</p>
    <div class="games">
      <div class="game"><img src="${dataUri('assets-src/starlight-cover.png', 'image/png')}">별빛 찻집</div>
      <div class="game"><img src="${dataUri('assets-src/rumors-cover.jpg', 'image/jpeg')}">루머스 AD 33</div>
    </div>
  </div>
  <p class="url">rluvu2.github.io</p>
</body></html>`;
}

/** PNG 여러 장을 .ico 하나로 묶는다 (PNG 를 그대로 담는 ICO 형식) */
function packIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, png }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map(({ png }) => png)]);
}

writeFileSync(`${ROOT}favicon.svg`, FAVICON);
console.log('SVG → favicon.svg');

let puppeteer;
try {
  puppeteer = (await import(process.env.PUPPETEER_CORE ? pathToFileURL(process.env.PUPPETEER_CORE).href : 'puppeteer-core')).default;
} catch {
  console.log('나머지 그림은 건너뛰었어요. `npm i -D puppeteer-core` 를 한 번 실행한 뒤 다시 실행해 주세요.');
  process.exit(0);
}
const browser = await puppeteer.launch({
  executablePath: process.env.BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: true,
});
const page = await browser.newPage();

/** SVG 를 size×size PNG 로 (작은 크기도 벡터 그대로 그려 또렷하게) */
async function renderSvg(svg, size) {
  await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
  const sized = svg.replace('width="64" height="64"', `width="${size}" height="${size}"`);
  await page.setContent(`<!doctype html><html><body style="margin:0;background:transparent"><style>svg{display:block}</style>${sized}</body></html>`);
  return Buffer.from(await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } }));
}

const icoImages = [];
for (const size of [16, 32, 48]) icoImages.push({ size, png: await renderSvg(FAVICON, size) });
writeFileSync(`${ROOT}favicon.ico`, packIco(icoImages));
console.log('ICO (16·32·48px) → favicon.ico');
writeFileSync(`${ROOT}apple-touch-icon.png`, await renderSvg(TOUCH_ICON, 180));
console.log('PNG 180 → apple-touch-icon.png');

await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.setContent(ogHtml(), { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: `${ROOT}og-image.png`, clip: { x: 0, y: 0, width: 1200, height: 630 } });
console.log('PNG 1200×630 → og-image.png');

await page.setContent('<!doctype html><html><body></body></html>');
for (const [from, to, width] of GAME_IMAGES) {
  const type = from.endsWith('.jpg') ? 'image/jpeg' : 'image/png';
  const src = `data:${type};base64,${readFileSync(ROOT + from).toString('base64')}`;
  const webp = await page.evaluate(
    async (src, width) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      const height = Math.round((img.naturalHeight * width) / img.naturalWidth);
      const canvas = Object.assign(document.createElement('canvas'), { width, height });
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);
      return { data: canvas.toDataURL('image/webp', 0.84).split(',')[1], height };
    },
    src,
    width,
  );
  const buffer = Buffer.from(webp.data, 'base64');
  writeFileSync(ROOT + to, buffer);
  console.log(`WebP ${width}×${webp.height} (${Math.round(buffer.length / 1024)}KB) → ${to}`);
}
await browser.close();
