/* ------------------------------------------------------------------
   Share cards (1200×630) for every page, in the site's own look.
   Renders tools/og.html in headless Chromium and writes
   public/assets/og/<name>.jpg.   npm run og
   Set CHROMIUM_PATH if Playwright's browser isn't installed.
------------------------------------------------------------------- */
import { chromium } from 'playwright-core';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync } from 'node:fs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'public/assets/og');

const CARDS = [
  { name: 'home', kicker: 'SODMUN V', title: 'The <em>largest</em><br>teen-owned<br>MUN.', photo: 'assets/photos/committee-room.jpg', cap: 'SODMUN IV', rot: 5 },
  { name: 'about', kicker: 'About SODMUN', title: 'By MUNers,<br><em>for</em> MUNers.', photo: 'assets/photos/atrium.jpg', cap: 'The atrium', rot: -4 },
  { name: 'secretariat', kicker: 'Secretariat', title: 'The people<br>behind <em>SODMUN</em>.', long: true, photo: 'assets/photos/podium.jpg', cap: 'At the podium', rot: 5 },
  { name: 'committees', kicker: 'Committees', title: '<em>Twenty-five</em><br>committees.', photo: 'assets/photos/laptops.jpg', cap: 'In session', rot: -5 },
  { name: 'partners', kicker: 'Partners', title: 'With thanks<br>to our <em>partners</em>.', long: true, photo: 'assets/photos/speaker.jpg', cap: 'Keynote', rot: 4 },
  { name: 'contact', kicker: 'Contact', title: 'Get in<br><em>touch</em>.', photo: 'assets/photos/hall.jpg', cap: 'The hall', rot: -4 },
  { name: 'applications', kicker: 'Register · SODMUN V', title: 'Coming<br><em>soon</em>.', photo: 'assets/photos/award.jpg', cap: 'Awards', rot: 5 },
];

mkdirSync(out, { recursive: true });
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const [i, card] of CARDS.entries()) {
  await page.goto(pathToFileURL(join(root, 'tools/og.html')).href);
  await page.evaluate((c) => window.render(c), { ...card, seed: i + 1 });
  await page.screenshot({ path: join(out, `${card.name}.jpg`), type: 'jpeg', quality: 88 });
  console.log(`og/${card.name}.jpg`);
}
await browser.close();
