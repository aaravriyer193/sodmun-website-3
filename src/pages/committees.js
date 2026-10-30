import { start } from '../inner/common.js';
import { $, $$, gsap, reduceMotion } from '../lib/shell.js';

start(() => {
  const grid = $('#cgrid');
  const tabs = $('#tabs');
  const cards = $$('.ccard', grid);
  let filter = new URLSearchParams(location.search).get('type') || 'all';
  let q = '';
  const apply = () => {
    let shown = 0;
    cards.forEach((c) => {
      const ok = (filter === 'all' || c.dataset.type === filter) && (!q || c.dataset.q.includes(q));
      c.hidden = !ok;
      if (ok) shown++;
    });
    $$('.tab', tabs).forEach((t) => t.setAttribute('aria-pressed', String(t.dataset.f === filter)));
    $('#empty').hidden = shown > 0;
    if (!reduceMotion) gsap.fromTo(cards.filter((c) => !c.hidden), { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.025, duration: 0.6, ease: 'power3.out', overwrite: true });
  };
  tabs.addEventListener('click', (e) => { const t = e.target.closest('.tab'); if (t) { filter = t.dataset.f; apply(); } });
  $('#search').addEventListener('input', (e) => { q = e.target.value.trim().toLowerCase(); apply(); });
  apply();

  // emblems tilt towards the pointer
  cards.forEach((c) => {
    const em = $('.ccard__emblem', c);
    c.addEventListener('pointermove', (e) => {
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      em.style.transform = `perspective(500px) rotateY(${x * 24}deg) rotateX(${-y * 24}deg) scale(1.06)`;
    });
    c.addEventListener('pointerleave', () => { em.style.transform = ''; });
  });
});
