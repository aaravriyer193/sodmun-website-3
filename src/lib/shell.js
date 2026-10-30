/* ------------------------------------------------------------------
   Shared shell: card nav, footer, smooth scroll, reveals.
------------------------------------------------------------------- */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SITE } from '../data/data.js';
import { sound } from './sound.js';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import CardNav from '../components/reactbits/CardNav.jsx';

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };

// Phones skip the 3D intro and legacy film, and show secretariat photos instead of lanyards.
export const phone = window.matchMedia('(max-width: 700px)').matches;
export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isTouch = window.matchMedia('(pointer: coarse)').matches;
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
/** Map v from [a,b] to [0,1], clamped. */
export const range = (v, a, b) => clamp((v - a) / (b - a));
export const smooth = (t) => t * t * (3 - 2 * t);

export const ICON = {
  arrow: '<svg class="arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" stroke-width="1.4"/></svg>',
  out: '<svg class="arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 12L12 4M5 4h7v7" stroke="currentColor" stroke-width="1.4"/></svg>',
  left: '<svg class="arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M15 8H2M7 3L2 8l5 5" stroke="currentColor" stroke-width="1.4"/></svg>',
  close: '<svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.4"/></svg>',
};

const here = (location.pathname.split('/').pop() || 'index').replace('.html', '').toLowerCase() || 'index';

/* ---------------- header / footer ---------------- */
function renderShell() {
  // Card nav (React Bits): a hamburger at every width that opens into cards
  const header = document.createElement('header');
  header.className = 'header';
  header.innerHTML = `
    <div class="header__nav"></div>
    <button class="sound" type="button" aria-pressed="false"><span class="sound__bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="sound__label">Sound</span></button>`;
  const skip = document.createElement('a');
  skip.className = 'skip';
  skip.href = '#main';
  skip.textContent = 'Skip to content';
  document.body.prepend(skip, header);

  const items = [
    { label: 'Conference', description: 'Who we are and what you will debate.', bgColor: '#0d1611', textColor: '#e3f5ea',
      links: [{ label: 'About', href: 'about.html' }, { label: 'Secretariat', href: 'secretariat.html' }, { label: 'Committees', href: 'committees.html' }] },
    { label: 'Take part', description: 'Delegates, chairs, schools and partners.', bgColor: '#122119', textColor: '#e3f5ea',
      links: [{ label: 'Register', href: 'applications.html' }, { label: 'Partners', href: 'partners.html' }, { label: 'Platform', href: SITE.platform }] },
    { label: 'Contact', description: 'The Secretariat reads every message.', bgColor: '#183024', textColor: '#e3f5ea',
      links: [{ label: 'Contact page', href: 'contact.html' }, { label: 'Email', href: `mailto:${SITE.email}` }, { label: 'Instagram', href: SITE.instagram }] },
  ];
  const logo = createElement('span', { className: 'brand' }, createElement('span', { className: 'brand__mark', 'aria-hidden': true }), createElement('span', null, 'SODMUN'));
  createRoot($('.header__nav', header)).render(createElement(CardNav, {
    logo, logoAlt: 'SODMUN home', logoHref: 'index.html', items,
    cta: { label: 'Register', href: 'applications.html' },
    theme: 'dark', surface: 'glass', accentColor: '#e3f5ea', maxWidth: 860, cardHeight: 196,
    onOpenChange: (open) => { open ? lenis?.stop() : lenis?.start(); document.documentElement.classList.toggle('menu-open', open); },
  }));

  // sound toggle
  const sbtn = $('.sound', header);
  const syncSound = (on) => { sbtn.classList.toggle('is-on', on); sbtn.setAttribute('aria-pressed', String(on)); sbtn.setAttribute('aria-label', on ? 'Turn sound off' : 'Turn sound on'); };
  sbtn.addEventListener('click', () => sound.set(!sound.on));
  sound.subscribe(syncSound);
  syncSound(sound.on);
  // the score plays from the start (or from the first tap, where the browser insists)
  sound.autoplay();

  // footer
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="wrap">
      <div class="footer__top">
        <div class="footer__lead">
          <span class="label">Summit of Diplomacy</span>
          <p>The largest teen-owned Model United Nations in the world. Made by MUNers, for MUNers, in Dubai.</p>
        </div>
        <div><h4>Conference</h4><ul>
          <li><a href="about.html">About</a></li>
          <li><a href="secretariat.html">Secretariat</a></li>
          <li><a href="committees.html">Committees</a></li>
          <li><a href="partners.html">Partners</a></li>
        </ul></div>
        <div><h4>Take part</h4><ul>
          <li><a href="applications.html">Register</a></li>
          <li><a href="${SITE.platform}" target="_blank" rel="noopener">Platform</a></li>
          <li><a href="${SITE.backgroundGuides}" target="_blank" rel="noopener">Background guides</a></li>
          <li><a href="${SITE.delegateResources}" target="_blank" rel="noopener">Delegate resources</a></li>
        </ul></div>
        <div><h4>Contact</h4><ul>
          <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
          <li><a href="${SITE.phoneHref}">${SITE.phone}</a></li>
          <li><a href="${SITE.instagram}" target="_blank" rel="noopener">Instagram</a></li>
          <li><a href="${SITE.linkedin}" target="_blank" rel="noopener">LinkedIn</a></li>
        </ul></div>
      </div>
      <div class="footer__meta">
        <span>© ${new Date().getFullYear()} Summit of Diplomacy MUN · Dubai, UAE</span>
        <span>Made by Aarav Iyer &amp; Aya Aladdin, with the Secretariat</span>
      </div>
    </div>
    <div class="footer__sign" aria-hidden="true"><i class="footer__logo"></i><span class="footer__word" data-chars>SODMUN</span></div>`;
  document.body.append(footer);
  return header;
}

/* ---------------- smooth scroll ---------------- */
export let lenis = null;
function initScroll() {
  if (reduceMotion) return;
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  // in-page anchors
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    const el = document.querySelector(a.getAttribute('href'));
    if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: 0, duration: 1.6 }); }
  });
}

/* ---------------- header state ---------------- */
function initHeader(header) {
  let last = 0;
  const update = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 20);
    const open = document.documentElement.classList.contains('menu-open');
    if (!open) {
      if (y > 300 && y > last + 4) header.classList.add('is-hidden');
      else if (y < last - 4) header.classList.remove('is-hidden');
    }
    last = y;
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
  return update;
}

/* ---------------- text splitting ---------------- */
export function splitChars(el) {
  if (el.dataset.splitDone) return [...el.querySelectorAll('.char')];
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(document.createTextNode(part)); return; }
          const word = document.createElement('span');
          word.style.display = 'inline-block';
          word.style.whiteSpace = 'nowrap';
          [...part].forEach((ch) => {
            const c = document.createElement('span');
            c.className = 'char';
            c.textContent = ch;
            word.append(c);
          });
          frag.append(word);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
    });
  };
  el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
  walk(el);
  el.dataset.splitDone = '1';
  [...el.children].forEach((c) => c.setAttribute('aria-hidden', 'true'));
  return [...el.querySelectorAll('.char')];
}

export function splitLines(el) {
  if (el.dataset.splitDone) return [...el.querySelectorAll('.split-line > span')];
  const parts = el.innerHTML.split(/<br\s*\/?>/i);
  el.innerHTML = parts.map((p) => `<span class="split-line"><span>${p.trim()}</span></span>`).join('');
  el.dataset.splitDone = '1';
  return [...el.querySelectorAll('.split-line > span')];
}

/* ---------------- reveals ---------------- */
let io;
export function reveal(root = document) {
  // headings: [data-split] = lines rise; [data-chars] = letters rise
  $$('[data-split]', root).forEach((el) => {
    if (el.dataset.revealed) return;
    el.dataset.revealed = '1';
    const lines = splitLines(el);
    if (reduceMotion) return;
    gsap.set(lines, { yPercent: 110 });
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => gsap.to(lines, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.09, delay: parseFloat(el.dataset.delay || 0) }),
    });
  });
  $$('[data-chars]', root).forEach((el) => {
    if (el.dataset.revealed || el.closest('.footer')) return;
    el.dataset.revealed = '1';
    const chars = splitChars(el);
    if (reduceMotion) return;
    gsap.set(chars, { yPercent: 105, rotate: 4 });
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(chars, { yPercent: 0, rotate: 0, duration: 1.2, ease: 'expo.out', stagger: 0.025, delay: parseFloat(el.dataset.delay || 0) }),
    });
  });
  const els = $$('[data-reveal]', root);
  if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
  io = io || new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    io.unobserve(e.target);
  }), { rootMargin: '0px 0px -6% 0px', threshold: 0.1 });
  els.forEach((el) => io.observe(el));
}

/** Words fade from soft grey to ink as the block scrolls through. */
export function scrubWords(el, { start = 'top 80%', end = 'bottom 45%' } = {}) {
  const words = [];
  const walk = (node) => [...node.childNodes].forEach((n) => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach((p) => {
        if (!p) return;
        if (/^\s+$/.test(p)) return frag.append(p);
        const w = document.createElement('span');
        w.className = 'w';
        w.textContent = p;
        words.push(w);
        frag.append(w);
      });
      n.replaceWith(frag);
    } else if (n.nodeType === 1) {
      // [data-word] elements (like inline icons) light up as a single word
      if (n.hasAttribute('data-word')) words.push(n);
      else walk(n);
    }
  });
  walk(el);
  if (reduceMotion) return;
  gsap.fromTo(words, { opacity: 0.14 }, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start, end, scrub: true } });
}

function footerSign() {
  const word = $('.footer__word');
  const logo = $('.footer__logo');
  if (!word) return;
  const chars = splitChars(word);
  if (reduceMotion) { gsap.set(chars, { yPercent: 0 }); return; }
  gsap.set(chars, { yPercent: 105 });
  gsap.set(logo, { rotate: -200, scale: 0.4, opacity: 0 });
  // plays once the bottom of the footer comes into view
  ScrollTrigger.create({
    trigger: word, start: 'top bottom', once: true,
    onEnter: () => {
      gsap.to(chars, { yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.06 });
      gsap.to(logo, { rotate: 0, scale: 1, opacity: 1, duration: 1.8, ease: 'expo.out' });
    },
  });
}

/* ---------------- modal ---------------- */
export function modal({ html, className = '', onClose } = {}) {
  const m = document.createElement('div');
  m.className = 'modal ' + className;
  m.setAttribute('role', 'dialog');
  m.setAttribute('aria-modal', 'true');
  m.innerHTML = `<div class="modal__box"><button class="modal__close" type="button" aria-label="Close">Close ${ICON.close}</button>${html}</div>`;
  document.body.append(m);
  lenis?.stop();
  document.body.classList.add('is-locked');
  const prev = document.activeElement;
  requestAnimationFrame(() => requestAnimationFrame(() => m.classList.add('is-open')));
  const close = () => {
    m.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    lenis?.start();
    window.removeEventListener('keydown', onKey);
    onClose && onClose();
    setTimeout(() => { m.remove(); prev?.focus?.(); }, 500);
  };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  window.addEventListener('keydown', onKey);
  m.addEventListener('click', (e) => { if (e.target === m || e.target.closest('.modal__close')) close(); });
  setTimeout(() => m.querySelector('.modal__close').focus(), 60);
  return { el: m, close };
}

/* ---------------- boot ---------------- */
export function boot() {
  // every page opens at the top (unless the link points at a section)
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const toTop = () => {
    if (location.hash) return;
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
    // also bring the top into view when the site is shown inside another
    // page's frame (previews), whose own scroll would otherwise carry over
    document.documentElement.scrollIntoView({ block: 'start' });
  };
  toTop();
  window.addEventListener('pageshow', toTop);
  const header = renderShell();
  initScroll();
  const updateHeader = initHeader(header);
  ScrollTrigger.addEventListener('refresh', updateHeader);
  footerSign();
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => { ScrollTrigger.refresh(); requestAnimationFrame(toTop); });
  return { header };
}
