/* eslint-disable no-console, max-len -- tooling script; long lines are data/selectors */
/*
 * Screenshots for the block mapping in the site-analysis report.
 *
 *   node tools/da/capture-component-shots.js [--host=https://<branch>--1azee--nishant-gupta.aem.page]
 *
 * - src-<component>.jpg: source components listed with a "shot" in tools/importer/block-mapping.json
 *   (mostly components the catalog did not capture), taken on www.myastrazeneca.ch.
 * - eds-<target>.jpg: how each built EDS block renders, taken from its demo page on --host
 *   (default: main preview).
 * Output: catalog/component-shots/. Existing files are overwritten.
 */
const fs = require('node:fs');
const path = require('node:path');

const PLAYWRIGHT = '/home/node/.excat-marketplaces/excat-marketplace/edge-delivery-services/skills/scrape-webpage/scripts/node_modules/playwright';
// eslint-disable-next-line import/no-dynamic-require
const { chromium } = require(PLAYWRIGHT);

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'catalog', 'component-shots');
const hostArg = process.argv.find((a) => a.startsWith('--host='));
const HOST = hostArg ? hostArg.slice(7) : 'https://main--1azee--nishant-gupta.aem.page';
const mapping = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/importer/block-mapping.json'), 'utf8'));
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Hide the cookie-consent panel so it doesn't cover the component.
const HIDE_CONSENT = `
  [id*="cookiereports" i], [class*="cookiereports" i], [id*="cr-panel" i], [class*="cr-panel" i],
  [id*="onetrust" i], iframe[src*="cookiereports"] { display: none !important; }`;

async function shoot(page, url, selector, file, {
  keepModal = false, click = null, type = null, withSel = null,
} = {}) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.addStyleTag({ content: HIDE_CONSENT });
  if (!keepModal) {
    // Accept the HCP self-certification if it is showing, so it doesn't cover the page.
    const cont = page.locator('.cmp-selfcertification__continue').first();
    if (await cont.isVisible().catch(() => false)) await cont.click().catch(() => {});
    await page.addStyleTag({ content: '.cmp-selfcertification { display: none !important; }' });
  }
  await page.waitForTimeout(1200);
  // Components that only open on interaction (for example the search box).
  if (click) await page.locator(click).first().click();
  if (type) { await page.keyboard.type(type, { delay: 80 }); await page.waitForTimeout(2500); }
  const el = page.locator(selector).first();
  await el.scrollIntoViewIfNeeded({ timeout: 15000 });
  await page.waitForTimeout(800);
  const box = await el.boundingBox();
  if (!box || box.height < 5) throw new Error(`${selector} not visible on ${url}`);
  if (withSel) {
    // Also include a second element positioned outside the first (for example the search results dropdown).
    const extra = await page.locator(withSel).first().boundingBox();
    if (!extra) throw new Error(`${withSel} not visible on ${url}`);
    const x = Math.min(box.x, extra.x); const y = Math.min(box.y, extra.y);
    const clip = {
      x, y, width: Math.max(box.x + box.width, extra.x + extra.width) - x, height: Math.max(box.y + box.height, extra.y + extra.height) - y,
    };
    await page.screenshot({
      path: file, type: 'jpeg', quality: 80, clip,
    });
    return `${Math.round(clip.width)}×${Math.round(clip.height)}`;
  }
  await el.screenshot({ path: file, type: 'jpeg', quality: 80 });
  return `${Math.round(box.width)}×${Math.round(box.height)}`;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const results = [];
  const run = async (label, fn) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'de-CH' });
    const page = await context.newPage();
    try { results.push(`ok   ${label} ${await fn(page)}`); } catch (e) { results.push(`FAIL ${label}: ${String(e.message).split('\n')[0]}`); }
    await context.close();
  };

  const jobs = [];
  mapping.components.filter((c) => c.shot).forEach((c) => {
    jobs.push([`src ${c.name}`, (page) => shoot(page, c.shot.url, c.shot.selector, path.join(OUT, `src-${slug(c.name)}.jpg`), {
      keepModal: c.marker === 'Selfcertification', click: c.shot.click, type: c.shot.type, withSel: c.shot.with,
    })]);
  });
  Object.entries(mapping.targets).filter(([, t]) => t.demo && t.status !== 'to build').forEach(([key, t]) => {
    jobs.push([`eds ${key}`, (page) => shoot(page, `${HOST}${t.demo.path}`, t.demo.selector, path.join(OUT, `eds-${key}.jpg`))]);
  });
  // One at a time: gentle on the source site.
  await jobs.reduce((chain, [label, fn]) => chain.then(() => run(label, fn)), Promise.resolve());
  await browser.close();
  console.log(results.join('\n'));
  if (results.some((r) => r.startsWith('FAIL'))) process.exitCode = 1;
})();
