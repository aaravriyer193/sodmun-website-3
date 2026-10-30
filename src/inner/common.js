/* Shared start-up for every page except home. */
import '../styles/base.css';
import '../styles/pages.css';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { boot, reveal, gsap, ScrollTrigger, $, $$, reduceMotion } from '../lib/shell.js';
import { Horizon } from '../home/Horizon.jsx';

/** Every inner hero sits on the rising ASCII horizon, with the whole logo beside it. */
function heroHorizon() {
  const hero = $('.page-hero');
  if (!hero) return;
  const bg = document.createElement('div');
  bg.className = 'page-hero__ascii';
  bg.setAttribute('aria-hidden', 'true');
  hero.prepend(bg);
  const progress = { current: reduceMotion ? 1 : 0 };
  createRoot(bg).render(createElement(Horizon, { progress }));
  if (!reduceMotion) gsap.to(progress, { current: 1, duration: 2.6, ease: 'power2.out', delay: 0.2 });
  if (!hero.classList.contains('cd-hero')) {
    const mark = document.createElement('i');
    mark.className = 'page-hero__logo';
    mark.setAttribute('aria-hidden', 'true');
    hero.append(mark);
  }
}

export function start(init) {
  boot();
  heroHorizon();
  init && init();
  reveal();
  if (!reduceMotion) {
    gsap.to(document.documentElement, { '--spin': 120, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 1 } });
    gsap.fromTo(document.documentElement, { '--spin': -60 }, { '--spin': 0, duration: 2.4, ease: 'expo.out' });
  }
  countUps();
  ScrollTrigger.refresh();
}

/** Numbers with data-count tick up when they scroll into view. */
function countUps() {
  $$('[data-count]').forEach((el) => {
    const to = parseFloat(el.dataset.count);
    const fmt = (v) => Math.round(v).toLocaleString('en-US');
    if (reduceMotion) { el.textContent = fmt(to); return; }
    const o = { v: 0 };
    gsap.to(o, { v: to, duration: 2.2, ease: 'expo.out', onUpdate: () => { el.textContent = fmt(o.v); }, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });
}
