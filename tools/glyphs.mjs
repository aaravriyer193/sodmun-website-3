/* Turns words set in Zarathustra into SVG path data for the 3D type.
   node tools/glyphs.mjs  →  src/data/type-paths.json */
import opentype from 'opentype.js';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const buf = readFileSync(join(ROOT, 'tools/fonts/zarathustra-v01.otf'));
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const SIZE = 100;
const words = { sodmun: 'SODMUN', v: 'V', five: 'SODMUN V' };
const out = {};
for (const [k, w] of Object.entries(words)) {
  const p = font.getPath(w, 0, 0, SIZE);
  // flip to y-up so three.js can extrude it directly
  p.commands.forEach((c) => { ['y', 'y1', 'y2'].forEach((k) => { if (k in c) c[k] = -c[k]; }); });
  const bb = p.getBoundingBox();
  out[k] = { d: p.toPathData(2), box: [bb.x1, bb.y1, bb.x2, bb.y2] };
}
// one path per letter of the lockup, sharing the word's coordinate space
const flip = (path) => { path.commands.forEach((c) => { ['y', 'y1', 'y2'].forEach((k) => { if (k in c) c[k] = -c[k]; }); }); return path; };
out.letters = font.getPaths('SODMUN V', 0, 0, SIZE).map(flip).map((p) => ({ d: p.toPathData(2), box: (({ x1, y1, x2, y2 }) => [x1, y1, x2, y2])(p.getBoundingBox()) })).filter((l) => l.d);
writeFileSync(join(ROOT, 'src/data/type-paths.json'), JSON.stringify(out));
console.log(out.letters.map((l) => l.box.map(Math.round)));
