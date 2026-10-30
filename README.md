# SODMUN website

The website for Summit of Diplomacy Model United Nations: a Vite site with
plain multi-page HTML, three.js scenes and a few React Bits components.

- Live: https://sodmun.vercel.app
- Content (committees, secretariat, partners, countdown date, application links): `src/data/data.js`
- Pages: the `.html` files in the root, one script each in `src/pages/`
- Styles: `src/styles/`

## Develop

```bash
npm install
npm run dev        # http://localhost:4340
```

## Build

```bash
npm run build      # runs tools/build.js, then vite build → dist/
```

`tools/build.js` pre-renders the data-driven sections into the HTML (so crawlers
see them without JavaScript) and regenerates every `<head>`, `public/sitemap.xml`,
`public/robots.txt` and `public/site.webmanifest`. Set `SITE_URL` at the top of
that file when the site moves to its final domain.

## The homepage

| Section | Where |
| --- | --- |
| Intro: archive flip-book → fly-through of the 3D lockup → liquid-metal reveal | `src/home/intro.js` |
| Countdown: rising ASCII horizon, flip clock, stickered prints (React Bits) | `src/home/Horizon.jsx`, `src/home/sections.js` |
| Legacy: one continuous shot, SODMUN I → V | `src/home/legacy.js` |
| Tagline, Why, Ask AI, quotes, CTA | `src/home/sections.js` |

Everything is scrubbed by scroll (GSAP ScrollTrigger + Lenis). Sounds are
synthesised in `src/lib/sound.js` and stay off until a visitor turns them on.

## Generated art

- `python3 tools/assets.py --people` cuts the secretariat out of their posters
  (needs `rembg` and the `u2net_human_seg` model), and builds the intro frames,
  stickers and traced logo outlines.
- `node tools/glyphs.mjs` turns Zarathustra lettering into paths for the 3D type.
- `npm run og` renders the 1200×630 share images from `tools/og.html` with headless Chromium (set `CHROMIUM_PATH` if Playwright has no browser installed).

## Credits

- Zarathustra by Lorène Ceccon (SIL Open Font License), Geist by Vercel.
- React Bits components in `src/components/reactbits/` (see the README there).

## Deploy

Vercel builds it with `npm run build` and serves `dist/` (see `vercel.json`).
