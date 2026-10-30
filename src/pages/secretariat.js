import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { start } from '../inner/common.js';
import { $$, phone, isTouch } from '../lib/shell.js';
import Lanyard from '../components/reactbits/Lanyard.jsx';
import { SECRETARIAT } from '../data/data.js';
import { cardFront, cardBack, strap } from '../inner/cards.js';

const everyone = Object.fromEntries(SECRETARIAT.flatMap((g) => g.people).map((p) => [p.id, p]));

start(async () => {
  if (phone || isTouch) return; // phones and tablets show each person's photo, no lanyards
  const back = await cardBack();
  const band = strap();
  // Every card hangs on its own lanyard. Each one is a WebGL canvas, and
  // browsers only allow ~16 at once, so badges hang only while near the screen.
  const live = new Map();
  const io = new IntersectionObserver((entries) => entries.forEach(async (e) => {
    const el = e.target;
    const stage = el.querySelector('.badge__stage');
    if (e.isIntersecting && !live.has(el)) {
      const host = document.createElement('div');
      host.className = 'badge__lanyard';
      stage.append(host);
      const root = createRoot(host);
      live.set(el, root);
      const front = await cardFront(everyone[el.dataset.person]);
      if (live.get(el) !== root) return;
      root.render(createElement(Lanyard, { frontImage: front, backImage: back, strapImage: band, strapColor: '#0b2116', size: 0.7, strapLength: 0.46, breeze: 0.5, intro: false }));
      el.classList.add('is-live');
    } else if (!e.isIntersecting && live.has(el)) {
      const root = live.get(el);
      live.delete(el);
      el.classList.remove('is-live');
      root.unmount();
      stage.querySelector('.badge__lanyard')?.remove();
    }
  }), { rootMargin: '120px 0px' });
  $$('.badge').forEach((b) => io.observe(b));
});
