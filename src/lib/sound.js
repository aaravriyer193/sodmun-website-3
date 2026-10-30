/* ------------------------------------------------------------------
   Tiny synthesized sound kit (no audio files).
   Sound is on by default and the score starts as the page opens. Where
   the browser holds audio back until the visitor interacts, it starts on
   their first tap, click or key press. The header toggle mutes it.
------------------------------------------------------------------- */

const KEY = 'sodmun-sound';
let ctx = null;
let master = null;
let noise = null;
const listeners = new Set();

let enabled = true;
try { enabled = localStorage.getItem(KEY) !== 'off'; } catch (e) { /* storage blocked */ }

function boot() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.9;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14;
  master.connect(comp).connect(ctx.destination);
  noise = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return ctx;
}

export const sound = {
  get on() { return enabled; },
  set(on) {
    enabled = on;
    try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch (e) { /* ignore */ }
    if (on) { boot(); ctx && ctx.resume(); }
    listeners.forEach((fn) => fn(on));
  },
  /** Call from a click/keydown handler so the context can start. */
  unlock() { if (enabled && boot()) { ctx.resume(); music.start(); } },
  /**
   * Start the score straight away. If the browser keeps the context
   * suspended until a user gesture, resume it on the first one.
   */
  autoplay() {
    if (enabled && boot()) { ctx.resume(); music.start(); }
    const EVENTS = ['pointerdown', 'touchend', 'click', 'keydown'];
    const tryUnlock = () => {
      sound.unlock();
      if (!ctx || ctx.state === 'running' || !enabled) EVENTS.forEach((e) => window.removeEventListener(e, tryUnlock, true));
    };
    EVENTS.forEach((e) => window.addEventListener(e, tryUnlock, true));
  },
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },

  /** A dry paper/shutter tap. `k` 0..1 brightens the tone as frames speed up. */
  tap(k = 0, gain = 1) {
    if (!enabled || !boot() || ctx.state !== 'running') return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noise;
    src.playbackRate.value = 0.9 + Math.random() * 0.25;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1800 + k * 2600 + Math.random() * 400;
    bp.Q.value = 1.4;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.55 * gain, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
    src.connect(bp).connect(g).connect(master);
    src.start(t, Math.random() * 0.4, 0.06);
    // a little body
    const o = ctx.createOscillator();
    const og = ctx.createGain();
    o.frequency.setValueAtTime(220 + k * 180, t);
    o.frequency.exponentialRampToValueAtTime(90, t + 0.04);
    og.gain.setValueAtTime(0.18 * gain, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    o.connect(og).connect(master);
    o.start(t);
    o.stop(t + 0.06);
  },

  /** Deep cinematic hit for the logo reveal / gavel. */
  boom(gain = 1) {
    if (!enabled || !boot() || ctx.state !== 'running') return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(110, t);
    o.frequency.exponentialRampToValueAtTime(34, t + 1.2);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.9 * gain, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.6);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + 1.7);
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(3000, t);
    lp.frequency.exponentialRampToValueAtTime(200, t + 0.4);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.5 * gain, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    src.connect(lp).connect(ng).connect(master);
    src.start(t);
  },

  /** Wooden gavel knock. */
  knock() {
    if (!enabled || !boot() || ctx.state !== 'running') return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const og = ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(520, t);
    o.frequency.exponentialRampToValueAtTime(140, t + 0.08);
    og.gain.setValueAtTime(0.8, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    o.connect(og).connect(master);
    o.start(t);
    o.stop(t + 0.2);
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1200;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.6, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    src.connect(bp).connect(g).connect(master);
    src.start(t);
    this.boom(0.5);
  },

  /** Soft tick for UI (countdown flips). */
  tick() {
    if (!enabled || !boot() || ctx.state !== 'running') return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 3500;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
    src.connect(hp).connect(g).connect(master);
    src.start(t, Math.random() * 0.4, 0.03);
  },
};

/* ------------------------------------------------------------------
   Score: a heroic loop in D minor, synthesised live (no audio files).
   8 bars: Dm Bb F C | Dm Bb Gm A — strings, low strings, a driving
   ostinato, taiko on 1 and 3, and a brass melody from the second pass.
------------------------------------------------------------------- */
const BPM = 84;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const midi = (m) => 440 * 2 ** ((m - 69) / 12);
const CHORDS = [
  [50, 53, 57, 62], [46, 50, 53, 58], [48, 53, 57, 60], [48, 52, 55, 60],
  [50, 53, 57, 62], [46, 50, 53, 58], [50, 55, 58, 62], [45, 49, 52, 57],
];
const ROOTS = [38, 34, 41, 36, 38, 34, 31, 33];
const MELODY = [
  [[69, 1], [74, 1], [76, 1], [77, 1]],
  [[77, 3], [74, 1]],
  [[72, 1.5], [69, 0.5], [72, 1], [77, 1]],
  [[76, 4]],
  [[69, 1], [74, 1], [77, 1], [81, 1]],
  [[82, 2], [81, 1], [77, 1]],
  [[79, 2], [82, 1], [74, 1]],
  [[73, 2], [76, 1], [81, 1]],
];
const OSTINATO = [0, 0, 7, 0, 12, 0, 7, 0];

let bus = null;
let timer = 0;
let nextBar = 0;
let barIndex = 0;

function makeBus() {
  const out = ctx.createGain();
  out.gain.value = 0;
  const verb = ctx.createConvolver();
  const len = ctx.sampleRate * 2.8;
  const ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
  }
  verb.buffer = ir;
  const wet = ctx.createGain();
  wet.gain.value = 0.32;
  const dry = ctx.createGain();
  out.connect(dry).connect(master);
  out.connect(verb).connect(wet).connect(master);
  return out;
}

function voice(type, freq, t, dur, { gain = 0.05, attack = 0.02, release = 0.3, cutoff = 2000, detune = 0, sweep = 0 } = {}) {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.value = freq;
  o.detune.value = detune;
  const f = ctx.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.setValueAtTime(sweep ? cutoff * 0.3 : cutoff, t);
  if (sweep) f.frequency.exponentialRampToValueAtTime(cutoff, t + sweep);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + attack);
  g.gain.setValueAtTime(gain, t + Math.max(attack, dur - release));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur + release);
  o.connect(f).connect(g).connect(bus);
  o.start(t);
  o.stop(t + dur + release + 0.05);
}

function drum(t, gain = 0.4) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.frequency.setValueAtTime(90, t);
  o.frequency.exponentialRampToValueAtTime(38, t + 0.35);
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
  o.connect(g).connect(bus);
  o.start(t);
  o.stop(t + 0.65);
  const n = ctx.createBufferSource();
  n.buffer = noise;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 900;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(gain * 0.5, t);
  ng.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
  n.connect(lp).connect(ng).connect(bus);
  n.start(t, Math.random() * 0.3, 0.2);
}

function scheduleBar(t, b, pass) {
  const k = b % 8;
  // strings
  CHORDS[k].forEach((m) => [-7, 7].forEach((dt) => voice('sawtooth', midi(m), t, BAR, { gain: 0.016, attack: 0.5, release: 0.7, cutoff: 1500, detune: dt })));
  // low strings
  voice('sawtooth', midi(ROOTS[k] + 12), t, BAR, { gain: 0.05, attack: 0.08, release: 0.4, cutoff: 420 });
  voice('sine', midi(ROOTS[k]), t, BAR, { gain: 0.09, attack: 0.05, release: 0.4 });
  // ostinato, eighth notes
  OSTINATO.forEach((iv, i) => voice('triangle', midi(ROOTS[k] + 24 + iv), t + i * BEAT / 2, BEAT / 2 * 0.6, { gain: 0.045, attack: 0.005, release: 0.12, cutoff: 2600 }));
  // taiko on 1 and 3, a fill into the top of the loop
  drum(t, 0.42);
  drum(t + BEAT * 2, 0.32);
  if (k === 7) [2.5, 3, 3.25, 3.5, 3.75].forEach((bt, i) => drum(t + bt * BEAT, 0.18 + i * 0.05));
  // brass from the second pass
  if (pass > 0) {
    let at = 0;
    MELODY[k].forEach(([m, beats]) => {
      const d = beats * BEAT;
      [-5, 5].forEach((dt) => voice('sawtooth', midi(m), t + at, d * 0.92, { gain: 0.028, attack: 0.06, release: 0.25, cutoff: 2800, detune: dt, sweep: 0.18 }));
      voice('sawtooth', midi(m - 12), t + at, d * 0.92, { gain: 0.02, attack: 0.06, release: 0.25, cutoff: 1400, sweep: 0.18 });
      at += d;
    });
  }
}

function tickScore() {
  while (nextBar < ctx.currentTime + 0.4) {
    scheduleBar(nextBar, barIndex, Math.floor(barIndex / 8));
    nextBar += BAR;
    barIndex++;
  }
}

export const music = {
  start() {
    if (!enabled || !boot() || timer) return;
    ctx.resume();
    bus = bus || makeBus();
    bus.gain.cancelScheduledValues(ctx.currentTime);
    bus.gain.setTargetAtTime(0.55, ctx.currentTime, 1.2);
    nextBar = ctx.currentTime + 0.1;
    barIndex = 0;
    timer = setInterval(tickScore, 100);
    tickScore();
  },
  stop() {
    if (!timer) return;
    clearInterval(timer);
    timer = 0;
    bus.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
  },
};

// follow the sound toggle; pause with the tab
sound.subscribe((on) => (on ? music.start() : music.stop()));
document.addEventListener('visibilitychange', () => {
  if (!ctx) return;
  if (document.hidden) ctx.suspend();
  else if (enabled) ctx.resume();
});
