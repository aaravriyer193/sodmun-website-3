#!/usr/bin/env node
/* ------------------------------------------------------------------
   SODMUN build step.

   Run it after editing js/data.js or any page body:

       node tools/build.js

   It does three things, all for SEO:
   1. Pre-renders the data-driven sections (committees, secretariat,
      partners, roles, stats, quotes, chapters) straight into the HTML,
      so crawlers see the content without running JavaScript.
   2. Rewrites every <head>: title, description, canonical, Open Graph,
      Twitter card and JSON-LD structured data.
   3. Writes sitemap.xml and robots.txt.

   Change SITE_URL below when the site moves to its final domain.
------------------------------------------------------------------- */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  SITE, COMMITTEES, COMMITTEE_TYPES, SECRETARIAT, PARTNERS,
  STATS, TESTIMONIALS, APPLICATIONS,
} from '../src/data/data.js';

const SITE_URL = 'https://sodmun.vercel.app'; // ← final domain goes here
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => readFileSync(join(ROOT, f), 'utf8');
const write = (f, s) => writeFileSync(join(ROOT, f), s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ARROW = '<svg class="arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" stroke-width="1.2"/></svg>';

/* ==================================================================
   1. Page metadata
================================================================== */
const PAGES = [
  {
    file: 'index.html', path: '/', page: 'home', og: 'home',
    title: 'SODMUN | Summit of Diplomacy Model United Nations, Dubai',
    desc: 'SODMUN is the largest teen-owned Model United Nations conference in the world: 25 committees and 700+ delegates in Dubai, UAE. Made by MUNers, for MUNers.',
    keywords: 'SODMUN, Model United Nations Dubai, MUN conference UAE, teen-owned MUN, Summit of Diplomacy, MUN Dubai, Model UN conference Middle East',
    dark: true,
  },
  {
    file: 'about.html', path: '/about', page: 'about', og: 'about', crumb: 'About',
    title: 'About SODMUN | Teen-Owned Model UN Conference in Dubai',
    desc: 'The story of Summit of Diplomacy MUN: five editions, 1,500+ delegates across SODMUN I–III, and 50,000 USD raised for solar power in rural Indian schools.',
    keywords: 'about SODMUN, teen-owned MUN, Model United Nations Dubai, student-run MUN conference, MENA MUN',
  },
  {
    file: 'secretariat.html', path: '/secretariat', page: 'secretariat', og: 'secretariat', crumb: 'Secretariat',
    title: 'Secretariat | The Team Behind SODMUN Dubai',
    desc: 'Meet the SODMUN Secretariat: the founders, Secretary-General, Under-Secretaries-General, crisis, PR, logistics and media teams who run the conference.',
    keywords: 'SODMUN secretariat, MUN secretary general, Model UN executive board Dubai, MUN organising team',
  },
  {
    file: 'committees.html', path: '/committees', page: 'committees', og: 'committees', crumb: 'Committees',
    title: '25 MUN Committees | SODMUN Dubai Model United Nations',
    desc: 'All 25 SODMUN committees: UNSC, GA1, GA2, GA4, UNHRC, WHO, UNICEF, UNEP and more, plus crisis committees like Formula 1, FIFA, INTERPOL and The Black Chamber.',
    keywords: 'MUN committees, UNSC MUN, crisis committee MUN, Model UN committees Dubai, GA1 DISEC, UNHRC, ICJ MUN',
  },
  {
    file: 'partners.html', path: '/partners', page: 'partners', og: 'partners', crumb: 'Partners',
    title: 'Partners & Sponsors | SODMUN Dubai Model United Nations',
    desc: 'The partners behind SODMUN, including Crimson Education and Proplr, and how your organisation can sponsor the largest teen-owned MUN in the world.',
    keywords: 'SODMUN partners, MUN sponsorship Dubai, sponsor a Model UN conference, student event sponsorship UAE',
  },
  {
    file: 'contact.html', path: '/contact', page: 'contact', og: 'contact', crumb: 'Contact',
    title: 'Contact SODMUN | Model UN Conference in Dubai, UAE',
    desc: 'Contact the SODMUN Secretariat about committees, school delegations, partnerships or press. Email sg.sodmun@gmail.com or message us on WhatsApp.',
    keywords: 'contact SODMUN, MUN Dubai contact, Model United Nations UAE enquiries',
  },
  {
    file: 'applications.html', path: '/applications', page: 'applications', og: 'applications', crumb: 'Applications',
    title: 'Register | SODMUN V Registration Coming Soon',
    desc: 'Registration for SODMUN V is coming soon, for delegates, school delegations and admins.',
    keywords: 'MUN registration Dubai, become a MUN delegate, MUN school delegation, MUN admin',
  },
  {
    file: '404.html', path: '/404', page: '404', og: 'home', noindex: true,
    title: 'Page not found | SODMUN',
    desc: 'That page is not on the agenda.',
  },
  {
    // One template renders all 25 committees from ?c=, so it stays out of
    // the index until the SODMUN V agendas are published and linked.
    file: 'committee.html', path: '/committee', page: 'committee', og: 'committees', noindex: true, crumb: 'Committee',
    title: 'Committee | SODMUN',
    desc: 'A SODMUN committee: agenda, format and background guides.',
    dark: true,
  },
];

/* ==================================================================
   2. Structured data
================================================================== */
const ORG = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'SODMUN',
  alternateName: 'Summit of Diplomacy Model United Nations',
  description: 'The largest teen-owned Model United Nations conference in the world, run by students in Dubai, United Arab Emirates.',
  url: `${SITE_URL}/`,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/brand/icon-512.png`, width: 512, height: 512 },
  image: `${SITE_URL}/assets/og/home.jpg`,
  email: SITE.email,
  telephone: SITE.phone,
  foundingLocation: { '@type': 'Place', name: 'Dubai, United Arab Emirates' },
  areaServed: [{ '@type': 'Place', name: 'Dubai' }, { '@type': 'Place', name: 'United Arab Emirates' }, { '@type': 'Place', name: 'MENA' }],
  sameAs: [SITE.instagram, SITE.linkedin, SITE.platform],
};

const WEBSITE = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: 'SODMUN',
  description: ORG.description,
  publisher: { '@id': ORG['@id'] },
  inLanguage: 'en',
};

const FAQ = [
  ['What is SODMUN?', 'SODMUN stands for Summit of Diplomacy Model United Nations. It is a teen-owned Model UN conference in Dubai, United Arab Emirates, run entirely by students, with more than 1,500 delegates across its first three editions.'],
  ['Where and when does SODMUN take place?', 'SODMUN takes place in Dubai, UAE, over three days. SODMUN V begins on 11 December 2026; the venue will be announced on this site and on Instagram @sod.mun.'],
  ['Who can take part in SODMUN?', 'Any secondary school student can apply, whether it is your first conference or your fiftieth. Students can apply individually or as a school delegation, and experienced MUNers can apply to chair.'],
  ['How many committees does SODMUN have?', 'SODMUN has 25 committees: traditional councils such as the Security Council, GA1, GA2, GA4, UNHRC, WHO, UNICEF and UNEP; crisis committees such as Formula 1, FIFA, INTERPOL and The Black Chamber; and specialised committees including the ICJ, ICAO and the International Press Corps.'],
  ['Do I need experience to be a SODMUN delegate?', 'No. Committees are designed for a range of experience levels, and background guides and delegate resources are published before the conference to help first-time delegates prepare.'],
  ['Does SODMUN use a conference platform?', 'Yes. Since SODMUN IV, committees run on SODMUN’s own platform at app.sodmun.com, with delegate chat, bloc messaging for points of information, an AI assistant and a speaking-list timer, so committees run paperless.'],
];

function jsonld(p) {
  const graph = [ORG, WEBSITE];
  graph.push({
    '@type': 'WebPage',
    '@id': `${SITE_URL}${p.path}#webpage`,
    url: `${SITE_URL}${p.path}`,
    name: p.title,
    description: p.desc,
    isPartOf: { '@id': WEBSITE['@id'] },
    about: { '@id': ORG['@id'] },
    primaryImageOfPage: `${SITE_URL}/assets/og/${p.og}.jpg`,
    inLanguage: 'en',
  });
  if (p.crumb) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: p.crumb, item: `${SITE_URL}${p.path}` },
      ],
    });
  }
  if (p.page === 'committees') {
    graph.push({
      '@type': 'ItemList',
      name: 'SODMUN committees',
      numberOfItems: COMMITTEES.length,
      itemListElement: COMMITTEES.map((c, i) => ({
        '@type': 'ListItem', position: i + 1, name: `${c.abbr} — ${c.name}`,
      })),
    });
  }
  if (p.page === 'secretariat') {
    graph.push({
      '@type': 'ItemList',
      name: 'SODMUN Secretariat',
      itemListElement: SECRETARIAT.flatMap((g) => g.people).map((person, i) => ({
        '@type': 'ListItem', position: i + 1,
        item: { '@type': 'Person', name: person.name, jobTitle: person.role, worksFor: { '@id': ORG['@id'] } },
      })),
    });
  }
  if (p.page === 'home' || p.page === 'applications') {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    });
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

/* ==================================================================
   3. <head>
================================================================== */
function head(p) {
  const url = `${SITE_URL}${p.path === '/' ? '/' : p.path}`;
  const img = `${SITE_URL}/assets/og/${p.og}.jpg`;
  // Each page has one entry module; Vite bundles its CSS and JS.
  const extra = `  <script type="module" src="/src/pages/${p.page}.js"></script>\n`;

  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(p.title)}</title>
  <meta name="description" content="${esc(p.desc)}">
${p.keywords ? `  <meta name="keywords" content="${esc(p.keywords)}">\n` : ''}  <link rel="canonical" href="${url}">
  <meta name="robots" content="${p.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}">
  <meta name="theme-color" content="#050605">
  <meta name="color-scheme" content="dark">
  <meta name="author" content="SODMUN">
  <meta name="geo.region" content="AE-DU">
  <meta name="geo.placename" content="Dubai">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="SODMUN">
  <meta property="og:locale" content="en_US">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(p.title)}">
  <meta property="og:description" content="${esc(p.desc)}">
  <meta property="og:image" content="${img}">
  <meta property="og:image:secure_url" content="${img}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(p.title)}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(p.title)}">
  <meta name="twitter:description" content="${esc(p.desc)}">
  <meta name="twitter:image" content="${img}">
  <meta name="twitter:image:alt" content="${esc(p.title)}">

  <link rel="icon" type="image/png" sizes="32x32" href="assets/brand/favicon-32.png">
  <link rel="icon" href="favicon.ico" sizes="any">
  <link rel="apple-touch-icon" href="assets/brand/apple-touch-icon.png">
  <link rel="manifest" href="site.webmanifest">
  <link rel="sitemap" type="application/xml" href="sitemap.xml">
  <style>html,body{background:#050605;color:#f1f3f1}</style>

  <script type="application/ld+json">${jsonld(p)}</script>
${extra}</head>`;
}

/* ==================================================================
   4. Pre-rendered sections
================================================================== */
const personCard = (person, i = 0) => `
  <button class="person" type="button" data-person="${person.id}" data-reveal style="--d:${((i % 4) * 0.05).toFixed(2)}s">
    <span class="person__img"><img src="assets/sec/${person.id}.jpg" alt="${esc(person.name)}, ${esc(person.role)} at SODMUN" loading="lazy" width="640" height="800"></span>
    <span class="person__name">${esc(person.name)}</span>
    <span class="person__role">${esc(person.role)}</span>
  </button>`;

// On the Secretariat page each person hangs on a lanyard; the photo is the fallback.
const badge = (person) => `
  <article class="badge" data-person="${person.id}">
    <div class="badge__stage"><img class="badge__fallback" src="assets/sec/${person.id}.jpg" alt="${esc(person.name)}, ${esc(person.role)} at SODMUN" loading="lazy" width="640" height="800"></div>
    <h3 class="badge__name">${esc(person.name)}</h3>
    <p class="badge__role">${esc(person.role)}</p>
  </article>`;

const SECTIONS = {
  quotes: () => TESTIMONIALS.map((t) => `
    <figure class="quote">
      <blockquote>${esc(t.quote)}</blockquote>
      <figcaption><strong>${esc(t.name)}</strong><span>${esc(t.role)}</span></figcaption>
    </figure>`).join(''),

  founders: () => SECRETARIAT[0].people.map(personCard).join(''),

  groups: () => SECRETARIAT.map((g, gi) => `
    <section class="group" aria-labelledby="g${gi}">
      <div class="group__head">
        <span class="group__n">${String(gi + 1).padStart(2, '0')}</span>
        <h2 id="g${gi}" data-split>${esc(g.group)}</h2>
        <span class="label label--plain">${g.people.length} ${g.people.length === 1 ? 'member' : 'members'}</span>
      </div>
      <div class="group__grid">${g.people.map(badge).join('')}</div>
    </section>`).join(''),

  tabs: () => {
    const counts = { all: COMMITTEES.length };
    COMMITTEES.forEach((c) => { counts[c.type] = (counts[c.type] || 0) + 1; });
    return [['all', 'All'], ...Object.entries(COMMITTEE_TYPES)].map(([k, v], i) =>
      `<button class="tab" type="button" data-f="${k}" aria-pressed="${i === 0}">${v} <small>${counts[k]}</small></button>`).join('');
  },

  cgrid: () => COMMITTEES.map((c, i) => `
    <a class="ccard" href="committee.html?c=${c.id}" data-type="${c.type}" data-q="${esc((c.abbr + ' ' + c.name + ' ' + c.alt).toLowerCase())}" style="--i:${i}">
      <span class="ccard__top"><span>${String(i + 1).padStart(2, '0')}</span><span>${COMMITTEE_TYPES[c.type]}</span></span>
      <i class="ccard__emblem" style="-webkit-mask-image:url('assets/committees/${c.id}.png');mask-image:url('assets/committees/${c.id}.png')" role="img" aria-label="${esc(c.name)} emblem"></i>
      <span class="ccard__abbr">${esc(c.abbr)}</span>
      <span class="ccard__name">${esc(c.name)}</span>
    </a>`).join(''),

  plist: () => PARTNERS.map((p, i) => `
    <a class="prow" href="${p.url}" target="_blank" rel="noopener" data-reveal>
      <span class="prow__n">${String(i + 1).padStart(2, '0')}</span>
      <span class="prow__name">${esc(p.name)}</span>
      <span class="prow__tier">${esc(p.tier)}</span>
      <span class="prow__blurb">${esc(p.blurb)}</span>
      <span class="prow__go" aria-hidden="true">${ARROW}</span>
    </a>`).join(''),

  roles: () => APPLICATIONS.map((r, i) => `
    <article class="role" data-reveal style="--d:${((i % 3) * 0.06).toFixed(2)}s">
      <div class="role__top"><span class="label label--plain">${esc(r.kicker)}</span><span class="role__status"><i></i>${r.url ? 'Open' : 'Coming soon'}</span></div>
      <h2>${esc(r.title)}</h2>
      <p>${esc(r.text)}</p>
      ${r.url ? `<a class="btn btn--sm" href="${r.url}" target="_blank" rel="noopener"><span>Apply</span>${ARROW}</a>` : ''}
    </article>`).join(''),

  faq: () => `
    <div class="head"><span class="label">Questions</span><h2 class="h2" data-split>Frequently<br>asked.</h2></div>
    <div class="faq">
      ${FAQ.map(([q, a]) => `<details class="faq__item" data-reveal><summary><span>${esc(q)}</span><i aria-hidden="true"></i></summary><p>${esc(a)}</p></details>`).join('')}
    </div>`,
};

/* ==================================================================
   5. Run
================================================================== */
let built = 0;
for (const p of PAGES) {
  let html = read(p.file);
  html = html.replace(/<head>[\s\S]*?<\/head>/, () => head(p));
  for (const [name, render] of Object.entries(SECTIONS)) {
    const re = new RegExp(`<!--gen:${name}-->[\\s\\S]*?<!--/gen:${name}-->`);
    if (re.test(html)) html = html.replace(re, `<!--gen:${name}-->${render()}<!--/gen:${name}-->`);
  }
  write(p.file, html);
  built++;
}

/* sitemap + robots */
const urls = PAGES.filter((p) => !p.noindex).map((p) => ({ loc: `${SITE_URL}${p.path}`, pri: p.path === '/' ? '1.0' : '0.8' }));
const today = new Date().toISOString().slice(0, 10);
write('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u.pri}</priority>
  </url>`).join('\n')}
</urlset>
`);

// The committee template and the 404 page carry a noindex meta tag, so they
// are crawlable (crawlers must read the page to see the noindex) but unlisted.
write('public/robots.txt', `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`);

write('public/site.webmanifest', JSON.stringify({
  name: 'SODMUN · Summit of Diplomacy Model United Nations',
  short_name: 'SODMUN',
  description: ORG.description,
  start_url: '/',
  display: 'standalone',
  background_color: '#050605',
  theme_color: '#050605',
  icons: [
    { src: 'assets/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: 'assets/brand/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  ],
}, null, 2));

console.log(`built ${built} pages · ${urls.length} sitemap urls · ${COMMITTEES.length} committees · ${SECRETARIAT.flatMap((g) => g.people).length} people`);
