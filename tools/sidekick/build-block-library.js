/*
 * Generates block-library demo pages (content/block-library/*.plain.html) for the
 * DA Sidekick Library. These are authoring scaffolding — copy/paste sources for authors —
 * not migrated site content. Run: node tools/sidekick/build-block-library.js
 */
const fs = require('node:fs');
const path = require('node:path');

const OUT = path.join(process.cwd(), 'content', 'block-library');
fs.mkdirSync(path.join(OUT, 'templates'), { recursive: true });

const write = (rel, html) => {
  const p = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${html.trim()}\n`);
  // eslint-disable-next-line no-console
  console.log('wrote', path.relative(process.cwd(), p));
};

/* ---- Buttons showcase (also the standalone /buttons page) ---- */
const buttons = `
<div>
  <h1>Buttons</h1>
  <p>The oneAZ button component. Author a link as <strong>bold</strong> for Primary, <em>italic</em> for Secondary, or <strong><em>bold italic</em></strong> for Tertiary. Link, Icon Only, Small, and group alignment use block classes.</p>

  <h2>Style variants</h2>
  <p><strong><a href="/en/startseite/produkte.html">Primary</a></strong></p>
  <p><em><a href="/en/startseite/produkte.html">Secondary</a></em></p>
  <p><strong><em><a href="/en/startseite/produkte.html">Tertiary</a></em></strong></p>
  <p><a class="button link" href="/en/startseite/produkte.html">Link</a></p>

  <h2>Size variants</h2>
  <p><strong><a href="/en/startseite/produkte.html">Medium (default)</a></strong></p>
  <p><a class="button primary small" href="/en/startseite/produkte.html">Small</a></p>

  <h2>Group alignment (2+ buttons; stacks full-width on mobile)</h2>
  <div class="button-group align-left">
    <a class="button primary" href="#">Button text</a>
    <a class="button secondary" href="#">Button text</a>
    <a class="button link" href="#">Button text</a>
  </div>
  <div class="button-group align-center">
    <a class="button primary" href="#">Button text</a>
    <a class="button secondary" href="#">Button text</a>
    <a class="button link" href="#">Button text</a>
  </div>
  <div class="button-group align-right">
    <a class="button link" href="#">Button text</a>
    <a class="button secondary" href="#">Button text</a>
    <a class="button primary" href="#">Button text</a>
  </div>
</div>
`;

/* ---- Hero demo ---- */
const hero = `
<div>
  <h1>Hero</h1>
  <div class="hero-minimal-dark-withimg">
    <div><div><picture><img src="/content/en/media_hero.jpg" alt=""></picture></div></div>
    <div><div><h1>Welcome to myAstraZeneca!</h1><p>Discover comprehensive information about our therapy areas and products.</p></div></div>
  </div>
</div>
`;

/* ---- Cards demo ---- */
const cards = `
<div>
  <h1>Cards</h1>
  <div class="cards-light-withimg">
    <div>
      <div><picture><img src="/content/en/media_card1.jpg" alt=""></picture></div>
      <div><h4>Cardiovascular, Renal and Metabolism (CVRM)</h4><p>Short description of the therapy area.</p><p><a href="#">Learn more</a></p></div>
    </div>
    <div>
      <div><picture><img src="/content/en/media_card2.jpg" alt=""></picture></div>
      <div><h4>Respiratory &amp; Immunology</h4><p>Short description of the therapy area.</p><p><a href="#">Learn more</a></p></div>
    </div>
    <div>
      <div><picture><img src="/content/en/media_card3.jpg" alt=""></picture></div>
      <div><h4>Oncology &amp; Hematology</h4><p>Short description of the therapy area.</p><p><a href="#">Learn more</a></p></div>
    </div>
  </div>
</div>
`;

/* ---- Columns demo ---- */
const columns = `
<div>
  <h1>Columns</h1>
  <div class="columns">
    <div>
      <div><p>Left column content.</p></div>
      <div><p>Right column content.</p></div>
    </div>
  </div>
</div>
`;

/* ---- Fragment demo ---- */
const fragment = `
<div>
  <h1>Fragment</h1>
  <div class="fragment">
    <div><div><a href="/en/fragments/example">/en/fragments/example</a></div></div>
  </div>
</div>
`;

write('buttons.plain.html', buttons);
write('hero.plain.html', hero);
write('cards.plain.html', cards);
write('columns.plain.html', columns);
write('fragment.plain.html', fragment);

/* ---- Template skeletons (structure references, one per discovered template) ---- */
const templates = {
  'content-landing': 'General landing/overview: hero, intro copy, a cards grid, and closing content.',
  'resource-detail': 'Single-column resource/document detail page: heading, body copy, optional download link.',
  'product-detail': 'Product sub-page: hero, alternating text/media sections.',
  'product-overview': 'Product index: hero, tabs, and a grid of promo cards.',
  'campaign-landing': 'Campaign landing: hero banner with a few introductory content blocks.',
  'campaign-subpage': 'Campaign interior page: hero followed by stacked content blocks.',
  'campaign-landing-alt': 'Campaign landing variant.',
};
Object.entries(templates).forEach(([name, desc]) => {
  const title = name.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
  write(`templates/${name}.plain.html`, `
<div>
  <h1>${title}</h1>
  <p>${desc}</p>
  <p><strong><a href="#">Primary CTA</a></strong></p>
</div>
`);
});
