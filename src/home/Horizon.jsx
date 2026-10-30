/* ------------------------------------------------------------------
   Countdown section, rendered with React Bits:
   GradientASCII (the rising horizon), SplitFlapText (the flip clock)
   and StickerPeel (stickers pinning the printed photos).
------------------------------------------------------------------- */
import { useEffect, useState } from 'react';
import GradientASCII from '../components/reactbits/GradientASCII.jsx';
import SplitFlapText from '../components/reactbits/SplitFlapText.jsx';
import StickerPeel from '../components/reactbits/StickerPeel.jsx';
import { SITE } from '../data/data.js';
import { sound } from '../lib/sound.js';

export function Horizon({ progress, shape = 'horizon' }) {
  return (
    <GradientASCII
      progress={progress}
      shape={shape}
      colors={['#010402', '#0c2e1c', '#3f9a68', '#a9dfc0', '#e6f7ee']}
      characters=" .:-=+x*#%@"
      cellSize={13}
      density={0.85}
      glow={0.35}
      flicker={0.25}
      softness={0.55}
      flow={0.6}
      speed={0.7}
      gradientOpacity={0.55}
      grain={0.06}
      clickEffect="wave"
      fontFamily={'"Geist Variable", system-ui, sans-serif'}
    />
  );
}

const TARGET = new Date(SITE.startsAt).getTime();
const parts = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
};
const pad = (n) => String(n).padStart(2, '0');
const UNITS = ['Days', 'Hours', 'Minutes', 'Seconds'];

export function Countdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
      if (document.querySelector('.horizon.is-live')) sound.tick();
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const values = parts(TARGET - now);
  const done = TARGET - now <= 0;
  return (
    <div className="countdown__row" role="timer" aria-live="off" aria-label={done ? 'SODMUN V is live' : `${values[0]} days, ${values[1]} hours, ${values[2]} minutes until SODMUN V`}>
      {values.map((v, i) => (
        <div className="countdown__unit" key={UNITS[i]}>
          <SplitFlapText
            text={pad(v)}
            padTo={2}
            charset="numeric"
            flipsPerChar={0}
            flipDuration={0.16}
            stagger={0.05}
            loop={false}
            intro
            tileColor="#0b120e"
            textColor="#e3f5ea"
            tileRadius={10}
            gap={5}
            depth={0.7}
            glare={0.25}
            fontSize="clamp(44px, 7.4vw, 112px)"
            className="countdown__flap"
          />
          <span className="countdown__label">{UNITS[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* Printed DSLR photos, each pinned by a peelable sticker. */
const PRINTS = [
  { src: 'assets/photos/podium.jpg', date: 'SODMUN 01', sticker: 'logo', cls: 'p1', rot: -8 },
  { src: 'assets/photos/award.jpg', date: 'SODMUN 02', sticker: 'gavel', cls: 'p2', rot: 6 },
  { src: 'assets/photos/atrium.jpg', date: 'SODMUN 03', sticker: 'gavel', cls: 'p3', rot: 7 },
  { src: 'assets/photos/speaker.jpg', date: 'SODMUN 04', sticker: 'logo', cls: 'p4', rot: -5 },
];

export function Prints() {
  return PRINTS.map((p, i) => (
    <figure className={`print print--${p.cls}`} key={p.cls} style={{ '--r': `${p.rot}deg` }}>
      <div className="print__paper">
        <img src={p.src} alt="" loading="lazy" />
        <span className="print__date" aria-hidden="true">{p.date}</span>
      </div>
      <div className="print__pin">
        <StickerPeel
          imageSrc={`assets/stickers/${p.sticker}.png`}
          width={p.sticker === 'logo' ? 78 : 86}
          rotate={i % 2 ? 14 : -12}
          peelDirection={i * 70}
          peelBackHoverPct={30}
          peelBackActivePct={55}
          finish={p.sticker === 'logo' ? 'holo' : 'gloss'}
          shadowIntensity={0.7}
          lightingIntensity={0.6}
          intro={false}
        />
      </div>
    </figure>
  ));
}
