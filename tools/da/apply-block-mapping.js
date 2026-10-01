/* eslint-disable no-console, max-len -- tooling script */
/*
 * Applies the reviewed block mapping (tools/importer/block-mapping.json) to the site catalog.
 *
 *   node tools/da/apply-block-mapping.js [--dry-run]
 *
 * For every variant in catalog/block-catalog.json:
 *   - type:    the mapped EDS target (default content stays "unknown": the catalog has no
 *              default-content type, and the block generator skips "unknown" on purpose)
 *   - name:    the block directory that implements the target (for example in-page-nav)
 *   - variant: the mapping's "class" (a CSS variant class); no class = the block's default.
 *              Duplicates share name + class, which is how the catalog builds them as one.
 * A mapping "split" moves the instances that lack a source component (per
 * catalog/source-components.json) into a new variant: their page-catalog.json blocks[].variantId
 * is re-stamped and a blockVariants entry is created.
 * Never touches variant ids of existing entries or catalog/.blocks/. Idempotent; re-run after any
 * catalog rebuild, then re-run inventory-source-components.js. Backups go to
 * migration-work/da-publish/archive/.
 */
const fs = require('node:fs');
const path = require('node:path');
const { STAGE } = require('./publish-content.js');

const ROOT = process.cwd();
const CATALOG = path.join(ROOT, 'catalog');
const BC = path.join(CATALOG, 'block-catalog.json');
const PAGES = path.join(CATALOG, '.pages');
const DRY = process.argv.includes('--dry-run');
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const mapping = readJson(path.join(ROOT, 'tools', 'importer', 'block-mapping.json'));
const bcFile = readJson(BC);
const variants = bcFile['block-catalog'].blockVariants;
const source = readJson(path.join(CATALOG, 'source-components.json'));
const changes = [];
const touchedPages = {};

const pageCatalogs = {};
fs.readdirSync(PAGES).forEach((slug) => {
  const f = path.join(PAGES, slug, 'page-catalog.json');
  if (fs.existsSync(f)) pageCatalogs[slug] = { file: f, data: readJson(f) };
});
const slugOfUrl = {};
Object.entries(pageCatalogs).forEach(([slug, p]) => { slugOfUrl[p.data.url] = slug; });

// 1. Splits: move instances into a new variant.
Object.entries(mapping.variants).filter(([, m]) => m.split).forEach(([id, m]) => {
  const { id: newId, without } = m.split;
  const moved = (source.variants[id]?.instances || []).filter((i) => i.shot && !i.comps.includes(without));
  moved.forEach((i) => {
    const slug = slugOfUrl[i.url];
    const block = pageCatalogs[slug]?.data.blocks.find((b) => b.variantId === id && path.join('catalog/.pages', slug, b.screenshot) === i.shot);
    if (!block) return;
    block.variantId = newId;
    touchedPages[slug] = true;
    changes.push(`split   ${id} → ${newId}: ${i.url.replace('https://www.myastrazeneca.ch', '')} block ${block.id}`);
  });
  // (Re)build both entries' page lists and screenshots from the page catalogs.
  const usage = (vid) => Object.entries(pageCatalogs).flatMap(([slug, p]) => p.data.blocks.filter((b) => b.variantId === vid).map((b) => ({ slug, b })));
  const newUses = usage(newId);
  if (!newUses.length) return;
  if (!variants[newId]) {
    variants[newId] = {
      id: newId, name: 'unknown', type: 'unknown', canonicalModel: variants[id].canonicalModel, pagesFound: 0, description: newUses[0].b.description, screenshots: [],
    };
    changes.push(`create  ${newId} "${newUses[0].b.description}"`);
  }
  [[id, usage(id)], [newId, newUses]].forEach(([vid, uses]) => {
    const perPage = {};
    uses.forEach(({ slug, b }) => { if (!perPage[slug] && b.screenshot) perPage[slug] = `.pages/${slug}/${b.screenshot}`; });
    const shots = Object.values(perPage).sort();
    const v = variants[vid];
    if (v.pagesFound !== Object.keys(perPage).length || JSON.stringify(v.screenshots) !== JSON.stringify(shots)) {
      changes.push(`usage   ${vid}: pagesFound ${v.pagesFound} → ${Object.keys(perPage).length}, screenshots ${v.screenshots.length} → ${shots.length}`);
      v.pagesFound = Object.keys(perPage).length;
      v.screenshots = shots;
    }
  });
});

// 2. Type, block and class for every variant.
Object.entries(variants).forEach(([id, v]) => {
  const m = mapping.variants[id];
  if (!m) throw new Error(`${id} is in the catalog but not in tools/importer/block-mapping.json`);
  const t = mapping.targets[m.target];
  if (!t) throw new Error(`${id}: unknown target ${m.target}`);
  const isDefaultContent = m.target === 'default-content';
  const want = {
    type: isDefaultContent ? 'unknown' : m.target,
    name: isDefaultContent ? 'unknown' : t.block,
    variant: isDefaultContent ? undefined : m.class,
  };
  if (!isDefaultContent && !KEBAB.test(want.name)) throw new Error(`${id}: block name "${want.name}" is not a kebab slug`);
  if (want.variant && !KEBAB.test(want.variant)) throw new Error(`${id}: class "${want.variant}" is not a kebab slug`);
  ['type', 'name', 'variant'].forEach((k) => {
    if (v[k] === want[k]) return;
    changes.push(`${k.padEnd(7)} ${id} "${v.description}": ${v[k] ?? '(default)'} → ${want[k] ?? '(default)'}`);
    if (want[k] === undefined) delete v[k]; else v[k] = want[k];
  });
});
bcFile['block-catalog'].totalBlockVariants = Object.keys(variants).length;

console.log(changes.length ? changes.join('\n') : 'Catalog already matches the mapping.');
if (DRY || !changes.length) {
  if (DRY) console.log(`\n(dry run: ${changes.length} change(s), nothing written)`);
  process.exit(0);
}

// Back up, then write.
const backup = path.join(STAGE, 'archive', `catalog-before-block-mapping-${new Date().toISOString().replace(/[:.]/g, '-')}`);
fs.mkdirSync(backup, { recursive: true });
fs.copyFileSync(BC, path.join(backup, 'block-catalog.json'));
Object.keys(touchedPages).forEach((slug) => {
  fs.mkdirSync(path.join(backup, slug), { recursive: true });
  fs.copyFileSync(pageCatalogs[slug].file, path.join(backup, slug, 'page-catalog.json'));
  fs.writeFileSync(pageCatalogs[slug].file, `${JSON.stringify(pageCatalogs[slug].data, null, 2)}\n`);
});
fs.writeFileSync(BC, `${JSON.stringify(bcFile, null, 2)}\n`);
console.log(`\nWrote ${path.relative(ROOT, BC)}${Object.keys(touchedPages).length ? ` and ${Object.keys(touchedPages).length} page-catalog.json file(s)` : ''}. Backup: ${path.relative(ROOT, backup)}`);
