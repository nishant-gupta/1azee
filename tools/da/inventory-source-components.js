/* eslint-disable no-console, max-len -- tooling script; long lines are data/selectors */
/*
 * Inventories the AEM Sites components on every catalogued source page and ties each
 * catalogued block variant to the source components it is made of.
 *
 *   node tools/da/inventory-source-components.js [--refetch]
 *
 * Source pages are cached in migration-work/da-publish/src-pages/ (fetched one at a time).
 * Components are identified by their data-nc name (for example Teaser, Tabs, DynamicFormV2),
 * plus cmp-container / cmp-title / cmp-image / form-container, which carry no data-nc.
 * Every block selector in catalog/.pages/<page>/page-catalog.json is resolved in the source
 * HTML. Output: catalog/source-components.json, read by build-site-analysis.js.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { STAGE } = require('./publish-content.js');

const JSDOM_PATH = '/home/node/.excat-marketplaces/excat-marketplace/excat/tools/excatops-mcp/node_modules/jsdom';
// eslint-disable-next-line import/no-dynamic-require
const { JSDOM, VirtualConsole } = require(JSDOM_PATH);

const ROOT = process.cwd();
const CATALOG = path.join(ROOT, 'catalog');
const CACHE = path.join(STAGE, 'src-pages');
const OUT = path.join(CATALOG, 'source-components.json');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';
const CLASS_MARKERS = ['cmp-container', 'cmp-title', 'cmp-image', 'form-container'];
const CHROME = new Set(['MegaMenu', 'User', 'SearchBox', 'ExperienceFragment', 'Breadcrumb']);

const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const inc = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; };
const quiet = new VirtualConsole(); // jsdom can't parse some of the source CSS; that's irrelevant here

function fetchPage(url) {
  fs.mkdirSync(CACHE, { recursive: true });
  const file = path.join(CACHE, `${crypto.createHash('sha1').update(url).digest('hex').slice(0, 12)}.html`);
  if (process.argv.includes('--refetch') || !fs.existsSync(file) || fs.statSync(file).size < 1000) {
    const code = execFileSync('curl', ['-s', '--compressed', '-A', UA, '-o', file, '-w', '%{http_code}', url], { encoding: 'utf8' });
    if (code !== '200') throw new Error(`${url}: HTTP ${code}`);
    execFileSync('sleep', ['0.4']);
  }
  return file;
}

// Component markers found in el and its descendants.
function markersIn(el) {
  const found = new Set();
  [el, ...el.querySelectorAll('*')].forEach((n) => {
    const nc = n.getAttribute('data-nc');
    if (nc) found.add(nc);
    const cls = (n.getAttribute('class') || '').split(/\s+/);
    CLASS_MARKERS.forEach((c) => { if (cls.includes(c)) found.add(c); });
  });
  return found;
}
function stylesIn(el) {
  const s = {};
  [el, ...el.querySelectorAll('*')].forEach((n) => (n.getAttribute('class') || '').split(/\s+/).forEach((c) => {
    if (/^[a-z]+--[a-z0-9-]+$/.test(c) && !/tb-space|b-space|t-space|fixed/.test(c)) inc(s, c);
  }));
  return s;
}

const { templates } = readJson(path.join(CATALOG, 'template-catalog.json'));
const templateOf = {};
templates.forEach((t) => t.urls.forEach((u) => { templateOf[u] = t.name; }));

const components = {}; // marker -> { pages, instances, templates, outsideBlocks, outsideTemplates }
const variants = {}; // id -> { comps, styles, instances: [{ url, shot, comps }] }
let resolved = 0; let unresolved = 0;

const pagesDir = path.join(CATALOG, '.pages');
fs.readdirSync(pagesDir).sort().forEach((slug) => {
  const f = path.join(pagesDir, slug, 'page-catalog.json');
  if (!fs.existsSync(f)) return;
  const pc = readJson(f);
  const tpl = templateOf[pc.url];
  if (!tpl) return;
  const { document } = new JSDOM(fs.readFileSync(fetchPage(pc.url), 'utf8'), { virtualConsole: quiet }).window;

  // Page-level inventory.
  const pageCounts = {};
  document.querySelectorAll('[data-nc]').forEach((n) => inc(pageCounts, n.getAttribute('data-nc')));
  CLASS_MARKERS.forEach((c) => {
    const n = document.querySelectorAll(`.${c}`).length;
    if (n) pageCounts[c] = n;
  });
  Object.entries(pageCounts).forEach(([m, n]) => {
    const c = components[m] || (components[m] = {
      pages: 0, instances: 0, templates: {}, outsideBlocks: 0, outsideTemplates: {},
    });
    c.pages += 1; c.instances += n; inc(c.templates, tpl);
  });

  // Block instances -> components.
  const roots = [];
  (pc.blocks || []).forEach((b) => {
    const v = variants[b.variantId] || (variants[b.variantId] = { comps: {}, styles: {}, instances: [] });
    let el = null;
    try { el = document.querySelector(b.selector); } catch (e) { /* invalid selector */ }
    const inst = { url: pc.url, shot: b.screenshot ? path.relative(ROOT, path.join(pagesDir, slug, b.screenshot)) : null, comps: [] };
    if (el) {
      resolved += 1; roots.push(el);
      inst.comps = [...markersIn(el)].sort();
      inst.comps.forEach((c) => inc(v.comps, c));
      Object.entries(stylesIn(el)).forEach(([s, n]) => inc(v.styles, s, n));
    } else unresolved += 1;
    v.instances.push(inst);
  });

  // Source components that no catalogued block covers (outside header/footer chrome).
  document.querySelectorAll('[data-nc]').forEach((n) => {
    const nc = n.getAttribute('data-nc');
    if (CHROME.has(nc) || n.closest('header, footer, .experiencefragment')) return;
    if (roots.some((r) => r.contains(n))) return;
    components[nc].outsideBlocks += 1; inc(components[nc].outsideTemplates, tpl);
  });
});

fs.writeFileSync(OUT, `${JSON.stringify({
  generated: new Date().toISOString(), resolvedInstances: resolved, unresolvedInstances: unresolved, components, variants,
}, null, 1)}\n`);
console.log(`${Object.keys(components).length} components, ${Object.keys(variants).length} variants; ${resolved} block instances resolved, ${unresolved} not found → ${path.relative(ROOT, OUT)}`);
