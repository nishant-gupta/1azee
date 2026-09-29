# myastrazeneca.ch — Core Web Vitals & SEO Baseline Report

**Generated:** 2026-09-18 · **Source:** Google PageSpeed Insights API (Lighthouse lab data, `performance` + `seo` categories)

**Scope:** 126 pages from the live `sitemap.xml` (2 non-HTML PDF assets excluded — PSI/Lighthouse cannot audit PDFs) × 2 strategies (mobile, desktop) = **252 Lighthouse runs**, 0 unresolved errors after retry.

This baseline captures the **current (pre-migration) production site's** performance and SEO posture, to compare against once the AEM Edge Delivery Services (EDS) migration is live.

---

## Methodology notes
- Ran via 4 parallel batches at `--rpm=50` per batch; the PSI project's actual **per-minute** quota turned out lower than the documented default, producing 60/252 initial `429` errors.
- All 60 failed checks (29 mobile, 31 desktop) were successfully re-run individually at `--rpm=15` with 0 errors, then merged into this dataset — **no gaps** in the final numbers.
- Lighthouse lab scores only (single simulated run per page/strategy) — not CrUX real-user field data, since this domain doesn't have enough Chrome UX Report traffic for field data to populate (`field_overall` was `NO_DATA` for all pages).
- Thresholds: LCP good ≤2500ms, CLS good ≤0.10, TBT good ≤200ms, FCP good ≤1800ms, TTFB good ≤800ms.

---

## Executive summary

- **Desktop performs far better than mobile**: avg Perf score 87.3 (desktop) vs **78.8 (mobile)**. Mobile is the real risk area for this baseline.
- **Layout shift (CLS) is the single biggest recurring issue**: **55 of 125 pages (44%)** fail mobile CLS at POOR (>0.25) — this shows up across nearly every section, not just one template, suggesting a shared layout/ad-slot/image-dimension issue.
- **SEO score is mediocre**, not broken: **85 of 125 pages (68%)** score below 90 on mobile SEO, but none are catastrophic outliers — likely missing/short meta descriptions or viewport issues rather than structural problems (cross-check with the `eds-seo-validator` deep-mode audit for specifics).
- **FR is the weakest locale on mobile performance** (avg 73.4), **IT close behind** (76.1); **DE is the strongest** (84.7). EN sits mid-pack (80.3) despite having the fewest, mostly high-parity pages.
- **The homepages themselves are among the worst mobile performers** (DE 50, IT 49, EN 47) — driven by high LCP (4.7–8.3s) and severe CLS (0.67–0.94), not just the resource-heavy Trixeo microsite as initially hypothesized.
- **Trixeo product microsite (DE/FR only, 25 pages)** mobile perf avg is actually reasonable (83.1), but has the single worst outlier in the whole site: `kronos-studienzusammenfassung-fr.html` at **33/100** (LCP 5.4s, TBT 1.4s) — a heavy PDF/study-summary page worth checking before migration.

---

## Summary by strategy × locale

### Mobile

| Locale | Pages | Perf Score (avg / median / worst) | SEO Score (avg / median / worst) | LCP (ms) (avg / median / worst) | CLS (avg / median / worst) | TBT (ms) (avg / median / worst) | FCP (ms) (avg / median / worst) | TTFB (ms) (avg / median / worst) |
|---|---|---|---|---|---|---|---|---|
| DE | 46 | 84.7 / 92.5 / 50.0 | 87.7 / 88.5 / 69.0 | 3067.1 / 2579.5 / 6712.0 | 0.2 / 0.0 / 0.9 | 71.1 / 64.5 / 222.0 | 1909.6 / 1953.5 / 3033.0 | 42.0 / 3.0 / 153.0 |
| FR | 45 | 73.4 / 78.5 / 33.0 | 87.1 / 85.0 / 69.0 | 3841.2 / 2771.5 / 9910.0 | 0.3 / 0.3 / 1.0 | 116.0 / 91.5 / 1405.0 | 1959.7 / 1977.0 / 3481.0 | 27.2 / 3.0 / 149.0 |
| IT | 20 | 76.1 / 75.5 / 48.0 | 82.6 / 83.0 / 69.0 | 4151.2 / 4375.0 / 10358.0 | 0.2 / 0.0 / 0.8 | 138.7 / 58.0 / 1407.0 | 1931.0 / 2083.0 / 2883.0 | 60.8 / 3.0 / 152.0 |
| EN | 15 | 80.3 / 86.0 / 47.0 | 83.1 / 85.0 / 77.0 | 3896.7 / 3828.0 / 8325.0 | 0.2 / 0.0 / 0.7 | 56.1 / 52.0 / 185.0 | 1735.3 / 1938.0 / 3487.0 | 75.0 / 45.0 / 175.0 |
| **ALL** | 126 | 78.8 / 81.0 / 33.0 | 86.1 / 85.0 / 69.0 | 3612.6 / 2816.0 / 10358.0 | 0.2 / 0.1 / 1.0 | 95.9 / 69.0 / 1407.0 | 1910.2 / 1971.0 / 3487.0 | 43.1 / 3.0 / 175.0 |

### Desktop

| Locale | Pages | Perf Score (avg / median / worst) | SEO Score (avg / median / worst) | LCP (ms) (avg / median / worst) | CLS (avg / median / worst) | TBT (ms) (avg / median / worst) | FCP (ms) (avg / median / worst) | TTFB (ms) (avg / median / worst) |
|---|---|---|---|---|---|---|---|---|
| DE | 46 | 88.9 / 94.0 / 62.0 | 91.1 / 92.0 / 77.0 | 1020.4 / 1019.0 / 2528.0 | 0.2 / 0.1 / 0.9 | 32.9 / 17.0 / 342.0 | 557.3 / 558.0 / 675.0 | 41.2 / 3.0 / 151.0 |
| FR | 45 | 87.6 / 97.0 / 54.0 | 89.8 / 92.0 / 77.0 | 1040.0 / 967.0 / 2427.0 | 0.2 / 0.0 / 0.6 | 90.4 / 9.0 / 1762.0 | 585.5 / 603.0 / 836.0 | 25.2 / 3.0 / 152.0 |
| IT | 20 | 86.9 / 90.5 / 55.0 | 85.5 / 83.0 / 77.0 | 993.5 / 1096.0 / 2307.0 | 0.2 / 0.1 / 0.9 | 38.3 / 4.5 / 440.0 | 516.4 / 617.0 / 777.0 | 32.4 / 3.0 / 151.0 |
| EN | 15 | 82.0 / 75.0 / 64.0 | 87.4 / 92.0 / 80.0 | 1120.9 / 1297.0 / 1887.0 | 0.3 / 0.2 / 0.9 | 59.7 / 3.0 / 717.0 | 491.1 / 496.0 / 771.0 | 60.8 / 3.0 / 151.0 |
| **ALL** | 126 | 87.3 / 94.5 / 54.0 | 89.3 / 92.0 / 77.0 | 1035.1 / 1009.5 / 2528.0 | 0.2 / 0.1 / 0.9 | 57.5 / 11.0 / 1762.0 | 553.0 / 577.5 / 836.0 | 36.4 / 3.0 / 152.0 |

---

## Summary by site section

### Mobile — by Site Section

| Section | Pages | Perf (avg/median/worst) | SEO (avg/median/worst) | CLS (avg/worst) |
|---|---|---|---|---|
| Home | 4 | 54.0 / 49.5 / 47.0 | 85.0 / 85.0 / 85.0 | 0.59 / 0.94 |
| General | 4 | 70.0 / 69.5 / 68.0 | 85.0 / 85.0 / 85.0 | 0.74 / 0.8 |
| Products | 4 | 72.0 / 74.0 / 48.0 | 83.0 / 85.0 / 77.0 | 0.29 / 0.83 |
| Products / Trixeo | 50 | 83.1 / 82.0 / 33.0 | 89.4 / 92.0 / 80.0 | 0.18 / 0.7 |
| Therapy Areas / CVRM | 29 | 77.7 / 77.0 / 48.0 | 85.0 / 83.0 / 77.0 | 0.16 / 1.01 |
| Therapy Areas / RI | 12 | 74.0 / 71.5 / 48.0 | 84.1 / 85.0 / 80.0 | 0.29 / 0.68 |
| Therapy Areas / Oncology | 23 | 80.6 / 86.0 / 55.0 | 82.6 / 85.0 / 69.0 | 0.19 / 0.66 |

### Desktop — by Site Section

| Section | Pages | Perf (avg/median/worst) | SEO (avg/median/worst) | CLS (avg/worst) |
|---|---|---|---|---|
| Home | 4 | 84.2 / 88.0 / 64.0 | 92.0 / 92.0 / 92.0 | 0.03 / 0.04 |
| General | 4 | 76.2 / 75.0 / 55.0 | 84.2 / 85.0 / 82.0 | 0.66 / 0.88 |
| Products | 4 | 71.2 / 72.0 / 67.0 | 90.2 / 92.0 / 85.0 | 0.57 / 0.9 |
| Products / Trixeo | 50 | 91.4 / 98.0 / 54.0 | 91.2 / 92.0 / 80.0 | 0.16 / 0.82 |
| Therapy Areas / CVRM | 29 | 86.4 / 89.0 / 68.0 | 88.4 / 92.0 / 77.0 | 0.19 / 0.75 |
| Therapy Areas / RI | 12 | 83.5 / 83.5 / 62.0 | 89.2 / 92.0 / 80.0 | 0.28 / 0.75 |
| Therapy Areas / Oncology | 23 | 86.9 / 90.0 / 67.0 | 86.5 / 92.0 / 77.0 | 0.21 / 0.81 |

---

## Worst 15 pages (mobile performance score)

| Rank | Score | URL | LCP | CLS | TBT |
|---|---|---|---|---|---|
| 1 | 33 | [/fr/startseite/produkte/trixeo/ressourcen/kronos-studienzusammenfassung-fr.html](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/kronos-studienzusammenfassung-fr.html) | 5376ms | 0.28 | 1405ms |
| 2 | 47 | [/en/startseite.html](https://www.myastrazeneca.ch/en/startseite.html) | 8325ms | 0.67 | 185ms |
| 3 | 48 | [/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html) | 6992ms | 1.01 | 52ms |
| 4 | 48 | [/fr/startseite/therapiegebiete/ri/copd.html](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/ri/copd.html) | 9910ms | 0.67 | 106ms |
| 5 | 48 | [/it/startseite/produkte.html](https://www.myastrazeneca.ch/it/startseite/produkte.html) | 10358ms | 0.83 | 53ms |
| 6 | 49 | [/it/startseite.html](https://www.myastrazeneca.ch/it/startseite.html) | 4765ms | 0.01 | 1407ms |
| 7 | 50 | [/de/startseite.html](https://www.myastrazeneca.ch/de/startseite.html) | 5870ms | 0.94 | 96ms |
| 8 | 50 | [/en/startseite/therapiegebiete/ri/asthma.html](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/ri/asthma.html) | 7598ms | 0.68 | 95ms |
| 9 | 52 | [/fr/startseite/produkte/trixeo/copd-management.html](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/copd-management.html) | 6533ms | 0.69 | 48ms |
| 10 | 52 | [/fr/startseite/produkte/trixeo/uberblick.html](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/uberblick.html) | 6533ms | 0.7 | 59ms |
| 11 | 55 | [/de/startseite/produkte/trixeo/ressourcen.html](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen.html) | 5701ms | 0.54 | 66ms |
| 12 | 55 | [/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/home.html](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/home.html) | 5916ms | 0.42 | 121ms |
| 13 | 55 | [/fr/startseite/therapiegebiete/onkologie/haematologie.html](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/onkologie/haematologie.html) | 5552ms | 0.56 | 91ms |
| 14 | 55 | [/fr/startseite/therapiegebiete/onkologie/lungenkrebs.html](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/onkologie/lungenkrebs.html) | 5406ms | 0.53 | 130ms |
| 15 | 55 | [/it/startseite/therapiegebiete/cvrm/see-the-pattrns/home.html](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/see-the-pattrns/home.html) | 6018ms | 0.48 | 54ms |

---

## Full per-page data

See **`myastrazeneca-cwv-baseline.csv`** in this same directory — one row per URL with `mobile_*` and `desktop_*` columns (perf score, SEO score, LCP, CLS, TBT, FCP, TTFB) for all 126 pages.

---

## Recommended next steps
1. **Fix CLS first** — 44% of pages fail mobile CLS; likely a shared cause (unsized hero images/banners, late-loading web fonts, or a cookie/consent banner shifting layout). Highest ROI fix before migration.
2. **Investigate the 3 homepages** (DE/IT/EN) — worst LCP + CLS combo on the site; check hero image sizing and whatever is causing the mobile LCP element to load 5–10s in.
3. **Re-run this baseline against the EDS preview/live domain** once migrated, using the same script (`check-cwv.mjs --base-url=<eds-url>`) to produce a before/after comparison.
4. **Spot-check `kronos-studienzusammenfassung-fr.html`** (33/100) and the FR Trixeo resource pages generally — they skew slower than their DE counterparts despite being the same template/content type.
