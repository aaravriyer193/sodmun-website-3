/* ------------------------------------------------------------------
   Lanyard badges: card faces drawn on a canvas for each person.
------------------------------------------------------------------- */
const LOGO = 'assets/brand/logo.png';
const cache = new Map();
const img = (src) => {
  if (!cache.has(src)) cache.set(src, new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; }));
  return cache.get(src);
};

const W = 800;
const H = 1125;

/** Front: the poster photo, with a name plate. */
export async function cardFront(person) {
  await document.fonts?.load('64px Zarathustra');
  const [photo, logo] = await Promise.all([img(`assets/sec/${person.id}.jpg`), img(LOGO)]);
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#e9f5ee';
  g.fillRect(0, 0, W, H);
  if (photo) {
    const s = Math.max(W / photo.width, (H - 230) / photo.height);
    g.drawImage(photo, (W - photo.width * s) / 2, 0, photo.width * s, photo.height * s);
  }
  g.fillStyle = '#050605';
  g.fillRect(0, H - 230, W, 230);
  g.fillStyle = '#e3f5ea';
  g.font = '400 64px Zarathustra, Georgia, serif';
  g.fillText(person.name, 48, H - 140, W - 200);
  g.fillStyle = '#8fd6ae';
  g.font = '400 26px "Geist Variable", sans-serif';
  g.fillText(person.role.toUpperCase(), 48, H - 82, W - 200);
  g.fillStyle = 'rgba(227,245,234,.5)';
  g.fillText('SODMUN · SECRETARIAT', 48, H - 40, W - 96);
  if (logo) drawTinted(g, logo, W - 150, H - 200, 104, '#e3f5ea');
  return c.toDataURL('image/jpeg', 0.9);
}

/** Back: the logo on pale green. */
export async function cardBack() {
  await document.fonts?.load('64px Zarathustra');
  const logo = await img(LOGO);
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#050605';
  g.fillRect(0, 0, W, H);
  if (logo) drawTinted(g, logo, W / 2 - 230, H / 2 - 300, 460, '#bfe8d0');
  g.fillStyle = '#e3f5ea';
  g.font = '400 110px Zarathustra, Georgia, serif';
  g.textAlign = 'center';
  g.fillText('SODMUN V', W / 2, H / 2 + 300);
  g.fillStyle = '#8fd6ae';
  g.font = '26px "Geist Variable", sans-serif';
  g.fillText('DUBAI · 11 · 12 · 2026', W / 2, H / 2 + 370);
  return c.toDataURL('image/jpeg', 0.9);
}

/** Strap: a woven band with the name repeated. */
export function strap() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#0b2116';
  g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = '#bfe8d0';
  g.font = '400 54px Zarathustra, Georgia, serif';
  g.textBaseline = 'middle';
  for (let x = 20; x < c.width; x += 340) g.fillText('SODMUN V ·', x, 68);
  return c.toDataURL('image/png');
}

function drawTinted(g, image, x, y, size, color) {
  const t = document.createElement('canvas');
  t.width = size;
  t.height = size;
  const tg = t.getContext('2d');
  tg.drawImage(image, 0, 0, size, size * (image.height / image.width));
  tg.globalCompositeOperation = 'source-in';
  tg.fillStyle = color;
  tg.fillRect(0, 0, size, size);
  g.drawImage(t, x, y);
}
