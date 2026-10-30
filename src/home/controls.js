/* ------------------------------------------------------------------
   Auto-play and Skip for the pinned, scroll-driven scenes.
   A scene plays by itself whenever it is on screen and the visitor
   isn't scrolling: any wheel, touch or key press hands control back,
   and it picks up again once they stop. Pause turns that off until
   Play is pressed; Skip jumps to the end.
------------------------------------------------------------------- */
import { lenis } from '../lib/shell.js';

const PLAY = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor"/></svg>';
const PAUSE = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor"/></svg>';
const SKIP = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1.5 3v10l6.5-5zM8 3v10l6.5-5z" fill="currentColor"/></svg>';

// how long the visitor must leave the page alone before auto-play resumes
const IDLE_MS = 1200;

/**
 * @param st       the scene's ScrollTrigger
 * @param stage    the pinned element the buttons sit in
 * @param seconds  how long auto-play takes for the whole scene
 * @param skipLabel e.g. 'Skip intro'
 */
export function sceneControls(st, stage, { seconds, skipLabel }) {
  const bar = document.createElement('div');
  bar.className = 'scene-ctl';
  bar.innerHTML = `
    <button type="button" class="scene-ctl__btn" data-act="play" aria-pressed="false">${PAUSE}<span>Pause</span></button>
    <button type="button" class="scene-ctl__btn" data-act="skip">${SKIP}<span>${skipLabel}</span></button>`;
  stage.append(bar);
  const [play, skip] = bar.querySelectorAll('button');

  let playing = false; // scrolling through right now
  let paused = false; // the visitor pressed Pause
  let lastInput = performance.now();

  const label = () => {
    play.setAttribute('aria-pressed', String(playing));
    play.innerHTML = paused ? `${PLAY}<span>Auto-play</span>` : `${PAUSE}<span>Pause</span>`;
  };
  const scrollTo = (y, opts) => {
    if (lenis) lenis.scrollTo(y, opts);
    else window.scrollTo({ top: y, behavior: opts.immediate ? 'auto' : 'smooth' });
  };
  const halt = () => {
    if (!playing) return;
    playing = false;
    if (lenis) lenis.scrollTo(lenis.scroll, { immediate: true });
    label();
  };
  const start = () => {
    const from = Math.max(st.start, window.scrollY);
    if (from >= st.end - 2) return;
    playing = true;
    label();
    const left = (st.end - from) / (st.end - st.start);
    scrollTo(st.end, { duration: seconds * left, easing: (t) => t, onComplete: () => { playing = false; label(); } });
  };

  // start (or resume) whenever the scene is on screen and the visitor is idle
  setInterval(() => {
    if (playing || paused || !st.isActive || document.hidden) return;
    if (document.querySelector('.gate:not(.is-gone)')) return;
    if (performance.now() - lastInput < IDLE_MS) return;
    start();
  }, 250);

  play.addEventListener('click', () => {
    paused = !paused;
    if (paused) halt();
    label();
  });
  skip.addEventListener('click', () => {
    halt();
    scrollTo(st.end + 2, { immediate: true, force: true });
  });
  // the visitor scrolling takes over
  const takeOver = (e) => {
    if (bar.contains(e.target)) return;
    lastInput = performance.now();
    halt();
  };
  ['wheel', 'touchstart', 'touchmove', 'keydown', 'pointerdown'].forEach((e) => window.addEventListener(e, takeOver, { passive: true }));
  label();
}
