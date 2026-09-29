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
    <div><div><picture><img src="/media-da/bd29eaf8be6f754b81bee5c8a0697af0.jpg" alt=""></picture></div></div>
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
      <div><picture><img src="/media-da/d008c3e74962f38051bd94dae1f3a50a.jpg" alt=""></picture></div>
      <div><h4>Cardiovascular, Renal and Metabolism (CVRM)</h4><p>Short description of the therapy area.</p><p><a href="#">Learn more</a></p></div>
    </div>
    <div>
      <div><picture><img src="/media-da/b86df053a0e671904b69d6f3e48d91b4.jpg" alt=""></picture></div>
      <div><h4>Respiratory &amp; Immunology</h4><p>Short description of the therapy area.</p><p><a href="#">Learn more</a></p></div>
    </div>
    <div>
      <div><picture><img src="/media-da/aa3335511b0bc42bb80d61d3f85cda09.jpg" alt=""></picture></div>
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

/* ---- In-Page Nav (Links) demo ---- */
const inPageNav = `
<div>
  <h1>Links (In-Page Nav)</h1>
  <div class="in-page-nav">
    <ul>
      <li><a href="#section-1">In-Page Nav item</a>
        <ul>
          <li><a href="#sub-1">In-Page Nav item</a></li>
          <li><a href="#sub-2">In-Page Nav item</a></li>
        </ul>
      </li>
      <li><a href="#section-2">In-Page Nav item</a>
        <ul>
          <li><a href="#sub-3">In-Page Nav item</a></li>
        </ul>
      </li>
      <li><a href="#section-3">In-Page Nav item</a></li>
    </ul>
  </div>
</div>
`;

/* ---- Accordion demo ---- */
const dcm = "One of the biggest challenges with DCM is that it's highly heterogeneous, both in its presentation and its underlying aetiology. While environmental factors, such as infections or exposure to certain toxins, are linked with DCM, genetics also play a role: up to 35% of DCM cases have an identifiable genetic cause.";
const accordion = `
<div>
  <h1>Accordion</h1>
  <div class="accordion">
    <div>
      <div>Accordion title</div>
      <div><h3>The most inspiring heading</h3><p>${dcm}</p></div>
    </div>
    <div>
      <div>Accordion title</div>
      <div><h3>The most inspiring heading</h3><p>${dcm}</p></div>
    </div>
  </div>
</div>
`;

write('buttons.plain.html', buttons);
write('in-page-nav.plain.html', inPageNav);
write('accordion.plain.html', accordion);
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

/* ---- blocks.json: per-block detail sheet for the DA Library panel ---- */
const blockDetails = [
  { name: 'Hero', path: '/block-library/hero', description: 'Full-bleed banner with a background image and a heading + intro overlay. Used at the top of landing pages.', variants: 'hero-minimal-dark-withimg', options: 'minimal-dark-withimg', baseBlock: 'hero', model: 'standalone' },
  { name: 'Cards', path: '/block-library/cards', description: 'Responsive grid of cards. Each card has an image, heading, description, and an optional list of links.', variants: 'cards-light-withimg', options: 'light-withimg', baseBlock: 'cards', model: 'collection' },
  { name: 'Columns', path: '/block-library/columns', description: 'Multi-column layout for placing content side by side. Column count follows the number of cells authored per row.', variants: '', options: '', baseBlock: 'columns', model: 'standalone' },
  { name: 'Button Group', path: '/block-library/buttons', description: 'Groups two or more buttons with left, right, or center alignment. Stacks full-width on mobile. Individual buttons are authored as formatted links (bold=Primary, italic=Secondary, bold+italic=Tertiary).', variants: 'button-group', options: 'align-left, align-right, align-center', baseBlock: 'button-group', model: 'standalone' },
  { name: 'Fragment', path: '/block-library/fragment', description: 'Embeds another authored document (a reusable content fragment) inline by its path.', variants: '', options: '', baseBlock: 'fragment', model: 'reference' },
  { name: 'In-Page Nav', path: '/block-library/in-page-nav', description: 'Links / In-Page Nav: a vertical list of anchor links with a left accent bar. Bold Magenta labels; nested sub-items indented with an em-dash prefix. The item matching the current page renders in Graphite.', variants: '', options: 'gold', baseBlock: 'in-page-nav', model: 'collection' },
  { name: 'Accordion', path: '/block-library/accordion', description: 'Collapsible sections. Each authored row is a [title, content] pair: the Magenta title toggles its content panel; a right-side chevron flips when open. Items expand independently.', variants: '', options: '', baseBlock: 'accordion', model: 'collection' },
];
write('blocks.json', JSON.stringify({
  total: blockDetails.length, offset: 0, limit: blockDetails.length, data: blockDetails, ':type': 'sheet',
}, null, 2));
