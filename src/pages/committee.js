import { start } from '../inner/common.js';
import { $, esc, ICON } from '../lib/shell.js';
import { SITE, COMMITTEES, COMMITTEE_TYPES } from '../data/data.js';

start(() => {
  const id = (new URLSearchParams(location.search).get('c') || '').toLowerCase();
  const i = Math.max(0, COMMITTEES.findIndex((c) => c.id === id));
  const c = COMMITTEES[i];
  const prev = COMMITTEES[(i - 1 + COMMITTEES.length) % COMMITTEES.length];
  const next = COMMITTEES[(i + 1) % COMMITTEES.length];
  document.title = `${c.abbr} · ${c.name} · SODMUN`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', c.about.slice(0, 155));
  const isCrisis = c.agendas.every((a) => a === 'Crisis');

  $('#c-hero').innerHTML = `
    <div class="page-hero__top"><span class="label">${COMMITTEE_TYPES[c.type]} committee</span>
      <nav class="crumbs" aria-label="Breadcrumb"><a href="committees.html">Committees</a><span>/</span><span>${esc(c.abbr)}</span></nav></div>
    <div class="cd-hero__grid">
      <div><h1 class="page-hero__title" data-chars>${esc(c.abbr)}</h1><p class="lede" data-reveal style="margin-top:24px">${esc(c.name)}</p></div>
      <i class="cd-emblem" style="-webkit-mask-image:url('assets/committees/${c.id}.png');mask-image:url('assets/committees/${c.id}.png')" role="img" aria-label="${esc(c.name)} emblem"></i>
    </div>`;

  $('#c-body').innerHTML = `
    <dl class="cd-side" data-reveal>
      <div><dt>Committee</dt><dd>${esc(c.name)}</dd></div>
      <div><dt>Focus</dt><dd>${esc(c.alt)}</dd></div>
      <div><dt>Format</dt><dd>${COMMITTEE_TYPES[c.type]}</dd></div>
    </dl>
    <div class="cd-main">
      <span class="label">${isCrisis ? 'Format' : 'Agendas'}</span>
      ${isCrisis
        ? '<p class="cd-crisis" data-reveal>A live crisis committee. Updates arrive as the committee unfolds, with no fixed agenda.</p>'
        : `<ol class="agendas">${c.agendas.map((a, k) => `<li data-reveal><span>${String(k + 1).padStart(2, '0')}</span><p>${esc(a)}</p></li>`).join('')}</ol>`}
      <span class="label">About the committee</span>
      <p class="cd-about" data-reveal>${esc(c.about)}</p>
      ${isCrisis ? '' : '<p class="muted small">Agendas shown are from SODMUN IV. SODMUN V agendas are released with the background guides.</p>'}
      <div class="btn-row" style="margin-top:32px">
        <a class="btn" href="${SITE.backgroundGuides}" target="_blank" rel="noopener"><span>Background guides</span>${ICON.out}</a>
        <a class="btn btn--ghost" href="applications.html"><span>Register</span></a>
      </div>
    </div>`;

  $('#c-pager').innerHTML = `
    <a href="committee.html?c=${prev.id}"><span class="label label--plain">Previous</span><strong>${esc(prev.abbr)}</strong></a>
    <a href="committee.html?c=${next.id}"><span class="label label--plain">Next</span><strong>${esc(next.abbr)}</strong></a>`;
});
