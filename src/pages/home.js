import * as THREE from 'three';
import '../styles/base.css';
import '../styles/home.css';
import { boot, reveal, lenis, $, ScrollTrigger, phone } from '../lib/shell.js';
import { initIntro, FRAMES, ATLAS } from '../home/intro.js';
import { initLegacy } from '../home/legacy.js';
import { initHorizon, initTagline, initVenue, initAsk, initQuotes, initCta } from '../home/sections.js';

boot();

/* ---------------- preload ---------------- */
const gate = $('#gate');
const bar = $('.gate__bar', gate);
const count = $('.gate__count', gate);

document.body.classList.add('is-locked');
lenis?.stop();
window.scrollTo(0, 0);
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

const manager = new THREE.LoadingManager();
manager.onProgress = (_, loaded, total) => {
  const k = loaded / total;
  bar.style.setProperty('--p', k.toFixed(3));
  count.textContent = String(Math.round(k * 100)).padStart(3, '0');
};
const loader = new THREE.TextureLoader(manager);
const load = (src) => {
  const t = loader.load(src);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
};
// phones skip the 3D intro and legacy film, so they load none of their images
const textures = phone ? [] : FRAMES.map(load);
const atlas = phone ? null : load(ATLAS);
if (atlas) atlas.colorSpace = THREE.NoColorSpace;

const ready = new Promise((resolve) => {
  if (phone) { resolve(); return; }
  manager.onLoad = resolve;
  setTimeout(resolve, 12000); // never trap anyone behind a slow image
});

const enter = () => {
  gate.classList.add('is-gone');
  document.body.classList.remove('is-locked');
  lenis?.start();
  ScrollTrigger.refresh();
};

// Order matters: pinned sections must be created top to bottom.
ready.then(() => {
  if (!phone) initIntro({ textures, atlas });
  initHorizon();
  initTagline();
  if (!phone) initLegacy({ atlas });
  initVenue();
  initAsk();
  initQuotes();
  initCta();
  reveal();
  ScrollTrigger.refresh();
  setTimeout(enter, 250);
});

