/* eslint-disable no-console */
/*
 * Publishes local content (content/**\/*.plain.html) to Document Authoring.
 *
 * For each page it:
 *   1. finds every <img>, resolves it to a real local file, uploads the file to DA
 *      under /media/, and rewrites the src to the DA content URL
 *   2. drops (and reports) any image it cannot resolve, rather than publishing a
 *      broken reference
 *   3. uploads the page, previews it, and (unless --no-live) publishes it
 *   4. verifies every image on the published page actually loads
 *
 * Usage:
 *   node tools/da/publish-content.js [--no-live] [page ...]
 *   page = content path without ".plain.html", e.g. "nav", "en/startseite".
 *   No pages = every page under content/.
 *
 * Network calls go through curl so the environment's credential injection applies.
 * Staging files are written to migration-work/da-publish/ (gitignored).
 */
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ORG = 'nishant-gupta';
const REPO = '1azee';
const BRANCH = 'main';
const ROOT = process.cwd();
const CONTENT = path.join(ROOT, 'content');
const STAGE = path.join(ROOT, 'migration-work', 'da-publish');
// Images fetched from the (bot-protected) source site that the importer didn't save.
const EXTRA_IMAGES = path.join(STAGE, 'src-images');
const DA_SOURCE = `https://admin.da.live/source/${ORG}/${REPO}`;
const DA_CONTENT = `https://content.da.live/${ORG}/${REPO}`;
const ADMIN = 'https://admin.hlx.page';
const HOST = (live) => `https://${BRANCH}--${REPO}--${ORG}.aem.${live ? 'live' : 'page'}`;
const MIME = {
  '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif',
};

fs.mkdirSync(path.join(STAGE, 'pages'), { recursive: true });
const PROBE = path.join(STAGE, 'probe');

/** Runs curl, returning { status, type, body }. Body is written to PROBE for binary safety. */
function curl(args) {
  const out = execFileSync('curl', ['-s', '-o', PROBE, '-w', '%{http_code} %{content_type}', ...args]).toString();
  const [status, type = ''] = out.split(' ');
  return { status: Number(status), type, body: () => fs.readFileSync(PROBE, 'utf8') };
}

function listPages() {
  const pages = [];
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) walk(p);
    else if (d.name.endsWith('.plain.html')) pages.push(path.relative(CONTENT, p).replace(/\.plain\.html$/, ''));
  });
  walk(fs.realpathSync(CONTENT));
  return pages.sort();
}

/** Resolves an <img src> from a content page to a local file path, or null. */
function resolveImage(src, page) {
  const candidates = [];
  if (/^https?:\/\//i.test(src)) {
    let base = '';
    try { base = path.basename(new URL(src).pathname); } catch { /* malformed */ }
    if (base) candidates.push(path.join(EXTRA_IMAGES, base));
  } else if (src.startsWith('/content/')) {
    candidates.push(path.join(ROOT, src));
  } else if (src.startsWith('/')) {
    candidates.push(path.join(CONTENT, src));
  } else {
    candidates.push(path.join(CONTENT, path.dirname(page), src), path.join(CONTENT, src));
  }
  return candidates.find((f) => fs.existsSync(f) && fs.statSync(f).isFile()) || null;
}

const uploaded = new Map(); // local file -> DA content URL

function uploadImage(file) {
  if (uploaded.has(file)) return uploaded.get(file);
  const name = path.basename(file);
  const mime = MIME[path.extname(name).toLowerCase()] || 'application/octet-stream';
  const res = curl(['-X', 'POST', '-F', `data=@${file};type=${mime}`, `${DA_SOURCE}/media/${name}`]);
  if (res.status >= 300) throw new Error(`image upload ${name} -> HTTP ${res.status}`);
  const url = `${DA_CONTENT}/media/${name}`;
  uploaded.set(file, url);
  return url;
}

/** Rewrites image references; returns { html, dropped[] }. */
function rewriteImages(html, page) {
  const dropped = [];
  let out = html.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = (tag.match(/\ssrc="([^"]*)"/i) || [])[1];
    if (!src) return tag;
    const file = resolveImage(src, page);
    if (!file) { dropped.push(src); return ''; }
    return tag.replace(/\ssrc="[^"]*"/i, ` src="${uploadImage(file)}"`);
  });
  // Clean up wrappers emptied by dropped images.
  let prev;
  do {
    prev = out;
    out = out.replace(/<picture>\s*<\/picture>/gi, '').replace(/<a\b[^>]*>\s*<\/a>/gi, '').replace(/<p>\s*<\/p>/gi, '');
  } while (out !== prev);
  return { html: out, dropped };
}

/** Checks every image on the published page loads. Returns a list of failures. */
function verifyImages(page, live) {
  const pageUrl = `${HOST(live)}/${page}`;
  const res = curl(['--compressed', `${pageUrl}.plain.html`]);
  if (res.status !== 200) return [`page ${res.status}`];
  const srcs = [...res.body().matchAll(/<img\b[^>]*\ssrc="([^"]*)"/gi)].map((m) => m[1]);
  return srcs.flatMap((src) => {
    if (src === 'about:error') return ['about:error (image not ingested)'];
    const img = curl([new URL(src, pageUrl).href]);
    return img.status === 200 && img.type.startsWith('image/') ? [] : [`${src} -> ${img.status} ${img.type}`];
  });
}

function publish(page, live) {
  const src = path.join(CONTENT, `${page}.plain.html`);
  const { html, dropped } = rewriteImages(fs.readFileSync(src, 'utf8'), page);
  const doc = path.join(STAGE, 'pages', `${page.replace(/\//g, '__')}.html`);
  fs.writeFileSync(doc, `<body><header></header><main>${html}</main><footer></footer></body>\n`);

  const up = curl(['-X', 'POST', '-F', `data=@${doc};type=text/html`, `${DA_SOURCE}/${page}.html`]);
  const pv = curl(['-X', 'POST', `${ADMIN}/preview/${ORG}/${REPO}/${BRANCH}/${page}`]);
  const lv = live ? curl(['-X', 'POST', `${ADMIN}/live/${ORG}/${REPO}/${BRANCH}/${page}`]) : { status: '-' };
  const failures = (up.status < 300 && pv.status === 200) ? verifyImages(page, live) : ['upload/preview failed'];
  return {
    page, upload: up.status, preview: pv.status, live: lv.status, dropped, failures,
  };
}

const args = process.argv.slice(2);
const live = !args.includes('--no-live');
const pages = args.filter((a) => !a.startsWith('--'));
const results = (pages.length ? pages : listPages()).map((p) => publish(p, live));

results.forEach((r) => {
  const ok = r.failures.length === 0;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${r.page}  (upload ${r.upload}, preview ${r.preview}, live ${r.live})`);
  r.dropped.forEach((d) => console.log(`       dropped unresolvable image: ${d}`));
  r.failures.forEach((f) => console.log(`       broken: ${f}`));
});
console.log(`\n${uploaded.size} image(s) uploaded to DA /media/.`);
process.exitCode = results.some((r) => r.failures.length) ? 1 : 0;
