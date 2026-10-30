/* ------------------------------------------------------------------
   Home: countdown, tagline, why, ask AI, quotes, CTA.
------------------------------------------------------------------- */
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap, ScrollTrigger, $, $$, reduceMotion, isTouch, phone, scrubWords, ICON } from '../lib/shell.js';
import { metalBlob } from '../lib/blob.js';
import { Horizon, Countdown, Prints } from './Horizon.jsx';

/* ---------------- horizon + countdown ---------------- */
export function initHorizon() {
  const section = $('#countdown');
  const progress = { current: reduceMotion ? 1 : 0 };
  createRoot($('#ascii')).render(createElement(Horizon, { progress }));
  createRoot($('#flip')).render(createElement(Countdown));
  const prints = $('#prints');
  if (!isTouch || window.innerWidth > 700) createRoot(prints).render(createElement(Prints));

  const content = $('.horizon__content', section);
  if (reduceMotion) return;
  // On phones there is no intro, so this opens the page: show it straight
  // away and let the horizon rise as the page loads.
  if (phone) {
    gsap.to(progress, { current: 1, duration: 2.6, ease: 'power2.out', delay: 0.3 });
    gsap.fromTo(content.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.9, ease: 'power3.out', delay: 0.3 });
    section.classList.add('is-live');
    return;
  }

  // the horizon climbs as the section arrives…
  ScrollTrigger.create({
    trigger: section, start: 'top bottom', end: 'top top', scrub: true,
    onUpdate: (st) => { progress.current = st.progress * 0.6; },
  });
  gsap.fromTo('#ascii', { yPercent: 28 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'top top', scrub: true } });

  // …and finishes rising while the section is pinned
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section, start: 'top top', end: () => `+=${window.innerHeight * 1.3}`, pin: '.horizon__stage', scrub: true,
      onUpdate: (st) => { progress.current = 0.6 + st.progress * 0.4; },
      onToggle: (st) => section.classList.toggle('is-live', st.isActive),
    },
  });
  tl.fromTo(content.children, { y: 60, opacity: 0, filter: 'blur(8px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.08, duration: 0.5, ease: 'power3.out' }, 0);
  // the prints slide in from the edges, settling into a slight tilt
  requestAnimationFrame(() => {
    $$('.print', prints).forEach((el, i) => {
      const fromLeft = el.getBoundingClientRect().left < window.innerWidth / 2;
      tl.fromTo(el, { x: fromLeft ? '-60vw' : '60vw', rotate: (fromLeft ? -30 : 30), opacity: 0 }, { x: 0, rotate: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0.05 + i * 0.07);
    });
  });
  tl.to({}, { duration: 0.4 });
}

/* ---------------- tagline: words light up as it scrolls through ---------------- */
export function initTagline() {
  scrubWords($('.tagline__text'), { start: 'top 85%', end: 'bottom 40%' });
}

/* ---------------- venue: Dubai clock ---------------- */
export function initVenue() {
  // The Google Maps embed works on the site itself. Inside another page's
  // frame (like a preview host) embeds are usually blocked, so show a
  // glowing ASCII marker there instead of an empty frame.
  if (window.self !== window.top) {
    const frame = $('.venue__map iframe');
    const marker = document.createElement('div');
    marker.className = 'venue__ascii';
    marker.setAttribute('aria-hidden', 'true');
    frame.replaceWith(marker);
    createRoot(marker).render(createElement(Horizon, { progress: { current: 1 }, shape: 'eclipse' }));
  }
  const el = $('#dxb-time');
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const tick = () => { el.textContent = `${fmt.format(new Date())} GST`; };
  tick();
  setInterval(tick, 1000);
}

/* ---------------- ask AI ---------------- */
const AIS = [
  { name: 'ChatGPT', url: (q) => `https://chatgpt.com/?q=${q}` },
  { name: 'Claude', url: (q) => `https://claude.ai/new?q=${q}` },
  { name: 'Perplexity', url: (q) => `https://www.perplexity.ai/search/new?q=${q}` },
  { name: 'Gemini', url: (q) => `https://gemini.google.com/app?prompt=${q}` },
];
export function initAsk() {
  const ask = $('#ask-q');
  $('#ais').innerHTML = AIS.map((a, i) => `<a class="ai-btn" data-ai="${i}" href="#" target="_blank" rel="noopener">${a.name} ${ICON.out}</a>`).join('');
  const sync = () => {
    const q = encodeURIComponent(ask.value.trim() || 'Tell me about Summit of Diplomacy MUN (sodmun.com)');
    $$('.ai-btn').forEach((b) => { b.href = AIS[+b.dataset.ai].url(q); });
  };
  ask.addEventListener('input', sync);
  $$('.chip').forEach((c) => c.addEventListener('click', () => {
    // type the new question out
    const text = c.dataset.q;
    let i = 0;
    clearInterval(ask._t);
    ask._t = setInterval(() => { ask.value = text.slice(0, (i += 3)); if (i >= text.length) { clearInterval(ask._t); sync(); } }, 16);
    $$('.chip').forEach((x) => x.setAttribute('aria-pressed', String(x === c)));
  }));
  sync();
}

/* ---------------- quotes ---------------- */
export function initQuotes() {
  $$('.quote blockquote').forEach((q) => scrubWords(q, { start: 'top 85%', end: 'bottom 55%' }));
}

/* ---------------- CTA: a drop of liquid metal ---------------- */
export function initCta() {
  metalBlob($('.cta__gl'), { trigger: $('.cta'), dark: true });
}
