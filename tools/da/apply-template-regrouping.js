/* eslint-disable no-console */
/*
 * Applies tools/importer/template-regrouping.json to the template catalogs:
 *   catalog/template-catalog.json                  (analysis catalog; drives the report)
 *   tools/importer/page-templates.full-catalog.json (full-site import templates)
 *
 * Idempotent: running it twice changes nothing. Templates emptied by the rules are removed;
 * templates named by a rule but missing are created. Prints every move.
 * When anything moved, it also rebuilds the catalog's visual report
 * (catalog/template-catalog-report-bundle.zip) via tools/da/rebuild_catalog_report.py.
 *   node tools/da/apply-template-regrouping.js [--dry-run]
 *
 * Re-run this after any catalog rebuild (site catalog / apply_naming.py regenerates
 * template-catalog.json from the raw clustering and would drop these corrections).
 */
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = process.cwd();
const RULES = path.join(ROOT, 'tools/importer/template-regrouping.json');
const TARGETS = ['catalog/template-catalog.json', 'tools/importer/page-templates.full-catalog.json'];
const dryRun = process.argv.includes('--dry-run');

const config = JSON.parse(fs.readFileSync(RULES, 'utf8'));
const rules = config.rules.map((r) => ({ ...r, re: new RegExp(r.match) }));
const targetFor = (url) => {
  const { pathname } = new URL(url);
  return rules.find((r) => r.re.test(pathname))?.template;
};

function regroup(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const byName = Object.fromEntries(data.templates.map((t) => [t.name, t]));
  const moves = [];

  data.templates.forEach((t) => {
    t.urls = t.urls.filter((u) => {
      const to = targetFor(u);
      if (!to || to === t.name) return true;
      moves.push({ url: u, from: t.name, to });
      return false;
    });
  });
  moves.forEach(({ url, to }) => {
    if (!byName[to]) {
      byName[to] = { name: to, description: '', urls: [] };
      if ('blocks' in data.templates[0]) Object.assign(byName[to], { blocks: [], coverageGaps: [] });
      data.templates.push(byName[to]);
    }
    if (!byName[to].urls.includes(url)) byName[to].urls.push(url);
  });

  const removed = data.templates.filter((t) => t.urls.length === 0).map((t) => t.name);
  data.templates = data.templates.filter((t) => t.urls.length > 0);
  data.templates.forEach((t) => {
    t.urls.sort();
    if (config.descriptions[t.name]) t.description = config.descriptions[t.name];
  });
  if (!dryRun) fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  return {
    moves, removed, counts: data.templates.map((t) => `${t.name} ${t.urls.length}`),
  };
}

let moved = 0;
TARGETS.forEach((rel) => {
  const res = regroup(path.join(ROOT, rel));
  moved += res.moves.length;
  console.log(`\n${dryRun ? '[dry run] ' : ''}${rel}: ${res.moves.length} page(s) moved`);
  const tally = {};
  res.moves.forEach((m) => { const k = `${m.from} -> ${m.to}`; tally[k] = (tally[k] || 0) + 1; });
  Object.entries(tally).forEach(([k, n]) => console.log(`  ${String(n).padStart(3)}  ${k}`));
  if (res.removed.length) console.log(`  removed empty: ${res.removed.join(', ')}`);
  console.log(`  now: ${res.counts.join(' | ')}`);
});

if (moved && !dryRun) {
  console.log('\nRebuilding the catalog visual report...');
  execFileSync('python3', [path.join(ROOT, 'tools/da/rebuild_catalog_report.py')], {
    stdio: 'inherit', env: { ...process.env, TMPDIR: path.join(ROOT, 'migration-work/da-publish') },
  });
}
