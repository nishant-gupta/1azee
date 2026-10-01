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

/*
 * ---- Buttons showcase (also the standalone /buttons page) ----
 * Everything here must survive Document Authoring, which keeps only semantic markup and
 * block tables (div.block > row div > cell div). Class attributes on links or on bare
 * wrapper divs are stripped, so variants are expressed through formatting and block options.
 */
const link = (fmt, text, href = '/en/startseite/produkte.html') => {
  const a = `<a href="${href}">${text}</a>`;
  if (fmt === 'primary') return `<p><strong>${a}</strong></p>`;
  if (fmt === 'secondary') return `<p><em>${a}</em></p>`;
  if (fmt === 'tertiary') return `<p><strong><em>${a}</em></strong></p>`;
  return `<p>${a}</p>`; // plain link = Link variant inside a Button Group
};
const group = (options, items) => `
  <div class="button-group${options ? ` ${options}` : ''}">
    <div><div>${items.map(([fmt, text]) => link(fmt, text, '#')).join('')}</div></div>
  </div>`;
const buttons = `
<div>
  <h1>Buttons</h1>
  <p>The oneAZ button component. Author a link on its own line as <strong>bold</strong> for Primary, <em>italic</em> for Secondary, or <strong><em>bold italic</em></strong> for Tertiary. Inside a <strong>Button Group</strong> block, a plain link becomes the Link variant, and the block options set alignment (<code>align-left</code>, <code>align-center</code>, <code>align-right</code>) and size (<code>small</code>).</p>

  <h2>Style variants</h2>
  ${link('primary', 'Primary')}
  ${link('secondary', 'Secondary')}
  ${link('tertiary', 'Tertiary')}
  ${group('', [['link', 'Link']])}

  <h2>Size variants</h2>
  ${group('', [['primary', 'Medium (default)']])}
  ${group('small', [['primary', 'Small'], ['secondary', 'Small'], ['link', 'Small']])}

  <h2>Group alignment (2+ buttons; stacks full-width on mobile)</h2>
  ${group('align-left', [['primary', 'Button text'], ['secondary', 'Button text'], ['link', 'Button text']])}
  ${group('align-center', [['primary', 'Button text'], ['secondary', 'Button text'], ['link', 'Button text']])}
  ${group('align-right', [['link', 'Button text'], ['secondary', 'Button text'], ['primary', 'Button text']])}
</div>
`;

/* ---- Hero demo ---- */
const hero = `
<div>
  <h1>Hero</h1>
  <div class="hero minimal-dark">
    <div><div><picture><img src="/media-da/bd29eaf8be6f754b81bee5c8a0697af0.jpg" alt=""></picture></div></div>
    <div><div><h1>Welcome to myAstraZeneca!</h1><p>Discover comprehensive information about our therapy areas and products.</p></div></div>
  </div>
</div>
`;

/* ---- Cards demo ---- */
const cards = `
<div>
  <h1>Cards</h1>
  <div class="cards light">
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
    <div><div>
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
    </div></div>
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

/* ---- Table demo ---- */
const table = `
<div>
  <h1>Table</h1>
  <div class="table">
    <div><div>Product</div><div>Active substance</div><div>Therapy area</div></div>
    <div><div>Forxiga®</div><div>Dapagliflozin</div><div>Cardiovascular, Renal &amp; Metabolism</div></div>
    <div><div>Trixeo®</div><div>Formoterol/Glycopyrronium/Budesonid</div><div>Respiratory &amp; Immunology</div></div>
    <div><div>Lynparza®</div><div>Olaparib</div><div>Oncology &amp; Hematology</div></div>
  </div>
</div>
`;

write('buttons.plain.html', buttons);
write('../buttons.plain.html', buttons); // standalone /buttons showcase page
write('in-page-nav.plain.html', inPageNav);
write('accordion.plain.html', accordion);
write('table.plain.html', table);
write('hero.plain.html', hero);
write('cards.plain.html', cards);
write('columns.plain.html', columns);
write('fragment.plain.html', fragment);

/*
 * ---- Template skeletons: one per template ----
 * Names and descriptions come from the reviewed template grouping, so the library
 * cannot drift from the catalog. The representative source page is the first URL of
 * each template in the full-site import templates.
 */
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(__dirname, rel), 'utf8'));
const regrouping = readJson('../importer/template-regrouping.json');
const fullCatalog = readJson('../importer/page-templates.full-catalog.json');

const templateNames = Object.keys(regrouping.descriptions);
const titleOf = (name) => name.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
templateNames.forEach((name) => {
  const tpl = fullCatalog.templates.find((t) => t.name === name);
  const example = tpl?.urls?.[0];
  write(`templates/${name}.plain.html`, `
<div>
  <h1>${titleOf(name)}</h1>
  <p>${regrouping.descriptions[name]}</p>
  ${example ? `<p>Source example (${tpl.urls.length} pages): <a href="${example}">${example}</a></p>` : ''}
  <p><strong><a href="#">Primary CTA</a></strong></p>
</div>
`);
});

// Remove skeletons of templates that no longer exist.
fs.readdirSync(path.join(OUT, 'templates'))
  .filter((f) => f.endsWith('.plain.html') && !templateNames.includes(f.replace('.plain.html', '')))
  .forEach((f) => {
    fs.unlinkSync(path.join(OUT, 'templates', f));
    // eslint-disable-next-line no-console
    console.log('removed stale', path.join('content/block-library/templates', f));
  });

/* ---- Block details: drive both blocks.json and the library's blocks sheet ---- */
const blockDetails = [
  {
    name: 'Hero', path: '/block-library/hero', short: 'Full-bleed banner with background image and heading + intro overlay.', description: 'Banner with an optional background image behind a heading + intro. The layout follows the authored content (an image-only row or cell becomes the background). Variant Minimal Dark: the oneAZ dark brand banner used at the top of landing and therapy-area pages.', variants: '', options: 'minimal-dark', baseBlock: 'hero', model: 'standalone',
  },
  {
    name: 'Cards', path: '/block-library/cards', short: 'Responsive grid of cards (image, heading, description, links).', description: 'Responsive grid of cards, one per row: an image-only cell becomes the card image, other cells the body (heading, description, links). Cards without an image are text only. Variant Light: the oneAZ light card grid (therapy areas, key figures, resources), 3 columns on desktop.', variants: '', options: 'light', baseBlock: 'cards', model: 'collection',
  },
  {
    name: 'Columns', path: '/block-library/columns', short: 'Multi-column side-by-side content layout.', description: 'Multi-column layout for placing content side by side. Column count follows the number of cells authored per row.', variants: '', options: '', baseBlock: 'columns', model: 'standalone',
  },
  {
    name: 'Button Group', path: '/block-library/buttons', short: 'Aligned group of buttons; stacks full-width on mobile.', description: 'Groups two or more buttons with left, right, or center alignment. Stacks full-width on mobile. Individual buttons are authored as formatted links (bold=Primary, italic=Secondary, bold+italic=Tertiary).', variants: 'button-group', options: 'align-left, align-right, align-center', baseBlock: 'button-group', model: 'standalone',
  },
  {
    name: 'Fragment', path: '/block-library/fragment', short: 'Embeds a reusable content fragment by path.', description: 'Embeds another authored document (a reusable content fragment) inline by its path.', variants: '', options: '', baseBlock: 'fragment', model: 'reference',
  },
  {
    name: 'In-Page Nav', path: '/block-library/in-page-nav', short: 'Links / In-Page Nav: vertical anchor list with left accent bar; bold Magenta labels, em-dash sub-items.', description: 'Links / In-Page Nav: a vertical list of anchor links with a left accent bar. Bold Magenta labels; nested sub-items indented with an em-dash prefix. The item matching the current page renders in Graphite.', variants: '', options: 'gold', baseBlock: 'in-page-nav', model: 'collection',
  },
  {
    name: 'Accordion', path: '/block-library/accordion', short: 'Collapsible content sections with Magenta titles and a flip chevron.', description: 'Collapsible sections. Each authored row is a [title, content] pair: the Magenta title toggles its content panel; a right-side chevron flips when open. Items expand independently.', variants: '', options: '', baseBlock: 'accordion', model: 'collection',
  },
  {
    name: 'Table', path: '/block-library/table', short: 'Data table; the first row is the header.', description: 'Data table. The first authored row becomes the header row; short rows are padded so columns stay aligned. Scrolls horizontally on narrow screens.', variants: '', options: '', baseBlock: 'table', model: 'collection',
  },
];
write('blocks.json', JSON.stringify({
  total: blockDetails.length,
  offset: 0,
  limit: blockDetails.length,
  data: blockDetails.map(({ short, ...rest }) => rest),
  ':type': 'sheet',
}, null, 2));

/*
 * ---- DA library sheets (site config "library" tab: Templates, Icons) ----
 * Format per aem.live "Set up library": templates = key (shown) + value (template doc URL);
 * icons = key (inserted as :key:, via the config row's format ":<content>:") + value (shown)
 * + icon (preview image). One row per icons/*.svg; the previews are uploaded to DA
 * /block-library/icons/ by tools/da/publish-library.js.
 */
const DA_CONTENT = 'https://content.da.live/nishant-gupta/1azee';
const daSheet = (data) => ({
  total: data.length, offset: 0, limit: data.length, data, ':type': 'sheet',
});
write('templates.json', JSON.stringify(daSheet(templateNames.map((n) => ({
  key: titleOf(n), value: `${DA_CONTENT}/block-library/templates/${n}`,
}))), null, 2));

// Brand names keep their own spelling; everything else is derived from the file name.
const ICON_LABELS = {
  facebook: 'Facebook', instagram: 'Instagram', 'linked-in': 'LinkedIn', x: 'X (Twitter)', youtube: 'YouTube',
};
const iconLabel = (name) => ICON_LABELS[name] || name.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());
const iconNames = fs.readdirSync(path.join(process.cwd(), 'icons'))
  .filter((f) => f.endsWith('.svg')).map((f) => f.replace(/\.svg$/, '')).sort();
write('icons.json', JSON.stringify(daSheet(iconNames.map((n) => ({
  key: n, value: iconLabel(n), icon: `${DA_CONTENT}/block-library/icons/${n}.svg`,
}))), null, 2));

/* ---- Sidekick library (published to DA at /tools/sidekick/library.json) ---- */
const sheet = (data) => ({
  total: data.length, offset: 0, limit: data.length, data,
});
const libraryPath = path.join(process.cwd(), 'tools', 'sidekick', 'library.json');
fs.writeFileSync(libraryPath, `${JSON.stringify({
  blocks: sheet(blockDetails.map((b) => ({ name: b.name, path: b.path, description: b.short }))),
  templates: sheet(templateNames.map((n) => ({
    name: titleOf(n), path: `/block-library/templates/${n}`, description: regrouping.descriptions[n],
  }))),
  ':names': ['blocks', 'templates'],
  ':version': 3,
  ':type': 'multi-sheet',
}, null, 2)}\n`);
// eslint-disable-next-line no-console
console.log('wrote', path.relative(process.cwd(), libraryPath));
