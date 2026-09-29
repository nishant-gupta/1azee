# myastrazeneca.ch — Deep SEO Audit

**Generated:** 2026-09-21 · **Method:** Playwright Chromium, full 68/80-item checklist (`eds-seo-validator` deep mode) · **Scope:** 127 HTML pages from `sitemap.xml` (2 PDF assets under `/content/dam/` excluded — not applicable to HTML checks)

This is a pre-migration baseline of the **current production site**, not an EDS comparison — no EDS target exists yet for this domain.

---

## Methodology notes — read before the findings below

1. **The site has aggressive bot-protection.** Plain, unheadered requests 403 (confirmed at the very start of this engagement). Playwright's real browser UA gets through for full page navigation — most per-page checks below are reliable — but this skill's separate **site-level** checks (robots.txt, custom 404, HTTP→HTTPS, www consistency) appear to use a plainer request that also got 403'd here, producing a false "robots.txt: MISSING" result. **Robots.txt does exist** — confirmed directly earlier in this engagement (`curl` with a browser User-Agent returned the real file: `Disallow` rules for the 4 locale login/registration pages, plus `Sitemap: https://www.myastrazeneca.ch/sitemap.xml`). Treat §4.4, §4.5, §5.1, §5.2, §8.4 below as **not usable from this run** — re-verify manually rather than trusting the "missing/failed" result.
2. **11 of 127 pages (9%) came back non-200 (7×403, 4×404) — likely the audit's own crawl load tripping the site's WAF, not confirmed broken pages.** Running 4 batches × 3 concurrent Playwright sessions hit the site with up to 12 simultaneous real-browser requests. Spot-checking those same 11 URLs individually and sequentially *after* the crawl still returned 403 for all of them, including the homepage (`en/startseite.html`) — which had returned a clean 200 on the very first probe before the crawl started. That's consistent with a temporary rate-limit/IP block, not a real outage. **Recommended**: re-run a spot-check on those 11 URLs after a cooldown period before treating them as genuine 404s/403s — see the list in §0 below. The one exception: `onkologie/leberkrebs.html` 404'd in **all four locales** (de/fr/it/en) rather than 403'ing like the others — worth prioritizing a manual check on that one specifically, since a consistent 404 pattern (vs. the WAF's 403 pattern) is more likely to be a real broken link.

---

## 0. Pages not reachable during this run (11 / 127)

| URL | Status | Likely cause |
|---|---|---|
| `de/startseite/therapiegebiete/onkologie/leberkrebs.html` | 404 | Possibly real — 404, not 403 (see note above) |
| `fr/startseite/therapiegebiete/onkologie/leberkrebs.html` | 404 | Possibly real |
| `it/startseite/therapiegebiete/onkologie/leberkrebs.html` | 404 | Possibly real |
| `en/startseite/therapiegebiete/onkologie/leberkrebs.html` | 404 | Possibly real |
| `fr/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html` | 403 | Likely WAF/rate-limit |
| `fr/startseite/therapiegebiete/ri/lupus.html` | 403 | Likely WAF/rate-limit |
| `it/startseite/therapiegebiete/onkologie/eierstockkrebs.html` | 403 | Likely WAF/rate-limit |
| `it/startseite/produkte.html` | 403 | Likely WAF/rate-limit |
| `it/startseite/contact-us.html` | 403 | Likely WAF/rate-limit |
| `en/startseite.html` | 403 | Likely WAF/rate-limit (confirmed 200 on initial probe) |
| `en/startseite/therapiegebiete/cvrm/chronischeniereninsuffizienz.html` | 403 | Likely WAF/rate-limit |

All findings below are computed only from the **116 pages that loaded successfully** (200).

---

## 1. Executive summary

- **0 of 116 loaded pages pass clean.** Every single page has at least one issue; average **16.4 issues/page** (median 17, worst 23).
- **Social sharing is essentially unconfigured site-wide**: `og:type`, `og:site_name`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:site` are missing on **116/116** pages; `og:title`/`og:description` missing on 115/116. The existing `og:image` reference is present but returns HTTP 403 on every page it was checked (same WAF issue, or the image path itself is genuinely inaccessible — worth a direct check). **This is the single highest-leverage fix** — one shared template/metadata block would resolve ~9 of the top-10 issues at once.
- **Structured data is minimal**: only a generic `Article` schema was found (51 pages), and **`BreadcrumbList` is missing on all 116 non-homepage-eligible pages**. No `Organization`/`WebSite`/`MedicalWebPage` schema detected anywhere — a real gap for a pharma/health content site where structured data helps AI/SERP feature eligibility.
- **Accessibility is a widespread gap, not a few isolated pages**: 400 of 1,398 images (29%) site-wide are missing `alt` text, and 240 buttons across the site are missing accessible labels. 113/116 pages have a skipped heading level (mostly H2→H4).
- **Layout stability (CLS) is poor almost everywhere**: 77/116 pages fail the CLS≤0.1 threshold, averaging **0.354** — 3.5× the passing threshold. IT (0.378) and EN (0.474) are worse than DE/FR.
- **Metadata length is inconsistent rather than absent**: title/description exist almost everywhere but frequently fall outside the recommended length windows (54 pages with too-short titles, 35 too-long; description too-short/too-long on 30/21).
- **51 pages carry a `keywords` meta tag** that should be removed (deprecated, no SEO value, minor crawl-budget noise) and **51 pages have a `robots` meta of `noarchive`**, which is worth confirming is intentional — it doesn't block indexing but may be an unintended leftover from a CMS default.

---

## 2. Core Web Vitals (lab, Playwright-measured) by locale

| Locale | Pages | TTFB avg | FCP avg | LCP avg | CLS avg |
|---|---|---|---|---|---|
| DE | 46 | 718ms ✅ | 824ms ✅ | 1237ms ✅ | **0.345** ❌ |
| FR | 42 | 739ms ✅ | 800ms ✅ | 1180ms ✅ | **0.321** ❌ |
| IT | 16 | **1026ms** ❌ | **1084ms** ❌ | **1763ms** ❌ | **0.378** ❌ |
| EN | 12 | **1018ms** ❌ | **1194ms** ❌ | **1946ms** ❌ | **0.474** ❌ |
| **ALL** | 116 | 799ms | 889ms | 1362ms | **0.354** |

Thresholds: TTFB ≤800ms, FCP ≤1800ms, LCP ≤2500ms, CLS ≤0.1.

- **TTFB/FCP/LCP are fine on average for DE/FR** but noticeably worse for **IT and EN** — both smaller-page-count locales, consistent with less caching/optimization attention on lower-traffic locales.
- **CLS fails everywhere, badly** — this is the one metric no locale passes even on average. 77/116 pages exceed the 0.1 threshold. This matches the pattern from the earlier CWV baseline audit (`myastrazeneca-cwv-baseline.md`) — CLS was flagged there too as the most widespread issue, so this is a confirmed, persistent site-wide layout-stability problem, not new.

---

## 3. Top 20 most common issues (across 116 loaded pages)

| Count | Issue |
|---|---|
| 116 | Missing `BreadcrumbList` schema (non-homepage) |
| 116 | `og:image` not accessible (HTTP error) |
| 116 | Missing `og:type` |
| 116 | Missing `og:site_name` |
| 116 | Missing `twitter:card` |
| 116 | Missing `twitter:title` |
| 116 | Missing `twitter:description` |
| 116 | Missing `twitter:image` |
| 116 | Missing `twitter:site` handle |
| 116 | Button(s) missing accessible label |
| 115 | Missing `og:title` |
| 115 | Missing `og:description` |
| 113 | Image(s) missing `alt` attribute |
| 113 | Heading hierarchy skipped a level (mostly H2→H4) |
| 77 | CLS exceeds 0.1 |
| 54 | Title too short (<50 chars) |
| 51 | `keywords` meta tag present (deprecated, should be removed) |
| 51 | `robots` meta `noarchive` present |
| 38 | Image link(s) without alt text |
| 38 | TTFB exceeds 800ms |
| 35 | Title too long (>60 chars) |
| 30 | Description too short (<140 chars) |
| 21 | Description too long (>160 chars) |
| 20 | Multiple H1s on one page |
| 11 | LCP exceeds 2500ms |

---

## 4. Top 15 worst pages (by issue count)

| Issues | Page |
|---|---|
| 23 | `fr/…/therapiegebiete/ri/copd.html` |
| 23 | `en/…/therapiegebiete/ri/copd.html` |
| 22 | `de/…/therapiegebiete/cvrm/chronischeniereninsuffizienz.html` |
| 22 | `de/…/therapiegebiete/cvrm/acutecare.html` |
| 22 | `it/…/therapiegebiete/ri/copd.html` |
| 21 | `de/…/therapiegebiete/ri/copd.html` |
| 21 | `en/…/therapiegebiete/cvrm/acutecare.html` |
| 21 | `en/…/therapiegebiete/cvrm/diabetes.html` |
| 21 | `en/…/produkte.html` |
| 20 | `fr/…/therapiegebiete/ri/asthma.html` |
| 20 | `fr/…/therapiegebiete/onkologie/eierstockkrebs.html` |
| 20 | `fr/…/produkte.html` |
| 20 | `it/…/therapiegebiete/cvrm/see-the-pattrns/home.html` |
| 20 | `it/…/therapiegebiete/ri/lupus.html` |
| 20 | `it/…/therapiegebiete/ri/asthma.html` |

Notably, **`ri/copd.html` is the worst page in 3 of the 4 locales** (fr, en, it) — worth checking whether it shares a template/component that's uniquely broken, rather than 3 independent issues.

---

## 5. Structural checks

| Check | Result |
|---|---|
| Canonical tag present | ✅ 116/116 (100%) |
| Favicon present | ✅ 116/116 (100%) |
| H1 count = 1 | 93/116 — **20 pages have 2 H1s**, 3 pages have **0 H1s** |
| Heading hierarchy (no skipped levels) | ❌ Only 3/116 pass |
| JSON-LD structured data | Only `Article` (51 pages) — no `Organization`, `WebSite`, or health-specific schema found anywhere |
| Images missing `alt` | 400 of 1,398 images (29%) |
| Buttons missing accessible label | 240 total instances across the site |

---

## 6. Site-level checks — unreliable this run, needs manual re-verification

The skill's site-level checks (robots.txt, custom 404, HTTP→HTTPS redirect, www consistency) all returned 403 during this run — almost certainly the same bot-protection blocking a non-browser request pattern, not real findings:

| Check | Tool result | Actual status (verified separately, see Methodology note) |
|---|---|---|
| robots.txt present | ✗ "MISSING" | **Exists** — confirmed via manual fetch: `Disallow` on the 4 locale login/registration pages, `Sitemap:` directive present |
| Sitemap referenced in robots.txt | ✗ "missing" | **Present** — same fetch confirmed `Sitemap: https://www.myastrazeneca.ch/sitemap.xml` |
| Custom 404 page | ✗ "got 403" | Not verified this run — re-check manually |
| HTTP→HTTPS redirect | ? "403" | Not verified this run — re-check manually |
| www/non-www consistency | ? "403" | Not verified this run — re-check manually |

---

## 7. Recommended priority order

1. **Fix the shared OG/Twitter metadata template** — one change resolves 9 of the top-10 site-wide issues (~115 pages each). Highest leverage item in this whole audit.
2. **Investigate CLS** — 77/116 pages fail, averaging 3.5× the threshold; this is also flagged in the earlier CWV baseline, so it's a known, unaddressed, persistent issue.
3. **Add `BreadcrumbList` (and consider `Organization`/`MedicalWebPage`) structured data** — currently zero coverage beyond a generic `Article` tag.
4. **Accessibility sweep**: 400 images without `alt`, 240 buttons without labels, 113 pages with a skipped heading level — likely concentrated in a handful of shared components (cards, buttons) rather than 113 independent authoring mistakes; worth checking the component templates first.
5. **Confirm/clear the `en/startseite.html` and other WAF-blocked URLs** with a cooldown re-check, and specifically verify `onkologie/leberkrebs.html` (404 in all 4 locales) as a probable genuine broken link.
6. **Metadata length cleanup** (titles/descriptions outside recommended ranges) and **remove the deprecated `keywords` meta tag** (51 pages) — lower urgency, easy fixes.
7. **Re-run the site-level checks manually** (robots.txt already confirmed fine; custom 404 / HTTPS redirect / www consistency still unverified).

---

## Files

- `myastrazeneca-seo-deep-audit.html` — full interactive report (all 127 pages, per-page issue breakdown, sortable)
- Raw per-batch CSVs available on request if deeper per-page slicing is needed
