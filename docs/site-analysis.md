# myastrazeneca.ch: Site Analysis and Migration Report

**Source:** https://www.myastrazeneca.ch/  ·  **Analysis date:** 2026-09-23  ·  **Updated:** 2026-09-29
**Target:** AEM Edge Delivery Services, Document Authoring (`nishant-gupta/1azee`)

---

## 1. Summary

| Metric | Value |
|---|---|
| URLs in sitemap | 126 (127 including the root redirect) |
| Pages analyzed | 122 (96%) |
| Pages failed | 5, all dead links in the sitemap (HTTP 404) |
| Locales | 4: DE 46 · FR 45 · IT 20 · EN 16 |
| Page templates | 7 |
| Block variants detected | 37: 18 map to a known block type, 19 are default content |
| Migrated so far | English homepage (`/en/startseite`), plus global header and footer |

The site is a Swiss HCP (healthcare professional) portal built on AEM Sites. The content is mostly editorial: therapy-area overviews, one product mini-site (Trixeo), and one disease-awareness campaign ("See the pATTRns"). Most pages are made of a hero and stacked text-and-image sections. Only a few pages use interactive components (tabs, accordion, forms).

**Granular detail is in the appendices at the end:** every page per template with the block variants found on it (A), a reference screenshot per template (B), a template × block-type matrix (C), and every block variant with a screenshot, usage, and current EDS mapping (D). Use them to review and refine the template and block groupings.

---

## 2. Site structure

### 2.1 Sections by locale

| Section | DE | FR | IT | EN | Notes |
|---|---:|---:|---:|---:|---|
| Homepage | 1 | 1 | 1 | 1 | |
| Therapy areas (CVRM, R&I, Oncology) | 13 | 12 | 12 | 12 | *Acute care* exists in DE/EN only |
| See the pATTRns (ATTR amyloidosis campaign) | 5 | 5 | 5 | **0** | No English version |
| Trixeo product pages | 8 | 8 | **0** | **0** | DE and FR only |
| Trixeo resource documents | 17 | 17 | **0** | **0** | DE and FR only |
| Products index | 1 | 1 | 1 | 1 | |
| Contact | 1 | 1 | 1 | 1 | Contains a form |

All URLs follow `/{lang}/startseite/...`. German path segments (`startseite`, `therapiegebiete`, `produkte`) are used in **every** locale, including FR, IT, and EN.

### 2.2 Dead links in the sitemap (excluded)

- `/{de,en,fr,it}/startseite/therapiegebiete/onkologie/leberkrebs.html` (all 4 locales)
- `/en/startseite/therapiegebiete/onkologie/haematologie.html`

These return 404 on the live source. Some are still linked from the navigation and the homepage ("Biliary carcinoma", "Hepatocellular carcinoma", "Hematology").

---

## 3. Templates

Templates after the review in Section 3.1 (7 templates, 122 pages). Every translated page now sits in the same template as its translations.

| Template | Pages | What it is | Representative page | Locale spread |
|---|---:|---|---|---|
| **content-landing** | 49 | Homepage and therapy-area pages: optional hero, intro copy, therapy card grids, text and image sections | `/en/startseite.html` | DE 13 · EN 11 · FR 12 · IT 12 · root 1 |
| **resource-detail** | 34 | Trixeo resource document: breadcrumb, share icons, title, short paragraphs, revision code | `/de/.../trixeo/ressourcen/copd-datenblatt-de.html` | DE 17 · FR 17 |
| **product-detail** | 16 | Trixeo product page with the product sub-navigation tabs (includes the resources index) | `/de/.../produkte/trixeo/aerosphere-technologie.html` | DE 8 · FR 8 |
| **campaign-subpage** | 12 | See the pATTRns interior: campaign banner, section tabs, stat boxes, diagrams, download CTAs | `/de/.../see-the-pattrns/diagnosis.html` | DE 4 · FR 4 · IT 4 |
| **campaign-landing** | 3 | See the pATTRns home: banner, section tabs, key visual, two teaser cards, questions band | `/de/.../see-the-pattrns/home.html` | DE 1 · FR 1 · IT 1 |
| **product-overview** | 4 | Products index: hero, therapy-area tabs, product card grid, contact banner | `/de/startseite/produkte.html` | DE 1 · EN 1 · FR 1 · IT 1 |
| **contact** | 4 | Contact page: title and enquiry form | `/en/startseite/contact-us.html` | DE 1 · EN 1 · FR 1 · IT 1 |

### 3.1 Template regrouping (reviewed 2026-09-29)

The automatic grouping compares page structure only, so layout noise (a narrower content column, a failed stylesheet) split identical pages. The test used: **a page and its translations should share a template.** Before the review, 21 of 46 translated-page groups were split across templates; after it, none are. 33 pages moved:

| Pages | From | To | Why |
|---|---|---|---|
| 17 FR Trixeo resource documents | product-detail | **resource-detail** | Same layout as their DE twins; no product tab row. They only rendered in a narrower column |
| 4 products index pages | content-landing (DE/EN/IT), product-overview (FR) | **product-overview** | Same page in all locales. The FR capture was **unstyled** (CSS failed to load), which is why it stood alone |
| FR campaign home | campaign-landing-alt | **campaign-landing** | Same as DE/IT home; narrower column. *campaign-landing-alt* removed |
| FR/IT diagnosis and symptoms | campaign-landing | **campaign-subpage** | Identical to the DE interior pages |
| 4 breast cancer pages | resource-detail | **content-landing** | A therapy-area article with the card grid, like its sibling oncology pages. Its build differs: no hero, key-figures card row, stacked images |
| 4 contact pages | resource-detail | **contact** (new) | A form page, not a text document; needs a form block and its own import |

The rules and reasons are recorded in `tools/importer/template-regrouping.json` and applied with `node tools/da/apply-template-regrouping.js` (idempotent).

**Evidence.** DE document, FR document, DE product page. The documents match; only the product page has the tab row:

![Trixeo DE document, FR document, DE product page](../migration-work/da-publish/pair-trixeo-doc.jpg)

Products index in DE, EN, and FR. The FR capture is unstyled:

![Products index DE, EN, FR](../migration-work/da-publish/pair-produkte.jpg)

Campaign: DE home, DE diagnosis, FR diagnosis, FR home. Home and interior pages differ; locales don't:

![See the pATTRns home and diagnosis pages](../migration-work/da-publish/pair-campaign.jpg)

Breast cancer vs. lung cancer vs. contact (EN):

![Breast cancer, lung cancer, contact](../migration-work/da-publish/pair-brustkrebs.jpg)

**Capture-quality check:** only one page (FR `/produkte.html`) was captured unstyled. Its detected *breadcrumbs* variant and its second *hero* are artifacts of that broken capture, not real blocks.

---

## 4. Blocks

### 4.1 Detected block types (from the catalog)

| Block type | Variants | Most pages for one variant | Where it appears |
|---|---:|---:|---|
| hero | 6 | 43 | Nearly every page. Dark full-bleed banner with a background image |
| accordion | 1 | 4 | A few content pages |
| columns | 1 | 3 | Product pages |
| form | 3 | 2 | Contact pages |
| tabs | 3 | 2 | Products index (28–32 product cards) |
| cards | 1 | 1 | Text-only card row |
| breadcrumbs | 1 | 1 | Artifact of the unstyled FR products-index capture (Section 3.1). The real breadcrumb is global site chrome |
| header, footer | 1 each | global | Site chrome |

### 4.2 Default-content patterns (19 "unknown" variants)

These are AEM text/image/teaser components that the detector could not match to a named block. Most of them should be **default content** (headings, paragraphs, images, links), not blocks. The most common:

| Pattern | Pages | Likely treatment |
|---|---:|---|
| heading + text + 6 images | 46 | Therapy-area card grid. Built as `cards-light-withimg` on the homepage |
| heading + text + 2 images + list | 40 | Card with an indication link list. Same cards block |
| text + 2 images | 29 | Default content (image + copy) |
| heading + text + 1 CTA | 18 | Default content + button |
| 2 images | 17 | Default content (desktop/mobile image pair) |
| heading + text + 4 images | 13 | Default content or columns |

Many image counts come in pairs because AEM renders a desktop and a mobile image for each visual. Migration should keep **one** image per visual.

### 4.3 Block library status

| Block | Status | Notes |
|---|---|---|
| `hero-minimal-dark-withimg` | ✅ Built | Homepage hero |
| `cards-light-withimg` | ✅ Built | Therapy-area grid |
| `accordion` | ✅ Built | oneAZ design; native `<details>`. Built from the design spec, not yet checked against source variant `v_4ecd3661fdd5` (Appendix D) |
| `in-page-nav` | ✅ Built | oneAZ "Links" component. No matching variant was detected on the source site. Authored as a list inside the block cell |
| `table` | ✅ Built | Data tables, used by this report |
| `button-group` | ✅ Built | oneAZ button groups. Options `align-left` / `align-center` / `align-right` / `small`; a plain link in a group is the Link variant |
| `hero`, `cards`, `columns`, `fragment` | Boilerplate | Available, not re-styled beyond the design tokens |
| `header`, `footer` | ✅ Migrated | Full 4-level megamenu (70 items); mobile drawer |
| `tabs` | ❌ Not built | Needed for the products index |
| `form` | ❌ Not built | Contact page. Consider AEM Forms tooling |
| `breadcrumbs` | ❌ Not built | Global. Could be generated from the page path |

---

## 5. Cross-site patterns and risks

1. **Cross-locale links.** The English megamenu links to **German** product pages (for example Wainzua, Trixeo, and Fasenra under `/de/...`) because EN/IT versions don't exist. The migration keeps these links as they are. Decide whether they should stay, be hidden, or point elsewhere.
2. **Uneven locale coverage.** Trixeo (50 pages: 25 each in DE and FR) exists only in those two locales; the campaign has no EN version. Plan migration waves per locale, not per template.
3. **Bot protection.** The source sits behind CloudFront bot protection (direct `curl` gets a 403). Imports use a saved browser snapshot, and assets must be fetched through a browser session.
4. **Personalization widgets.** "Your Speciality" / "Your Interests" only render for logged-in HCPs. They import as empty headings and need a decision (drop them, or rebuild them behind login).
5. **AEM Sites component markup.** Content is built from `cmp-teaser`, `cmp-container`, and `aem-GridColumn` wrappers. Importer selectors are keyed to classes such as `.teaser--home-hero` and `.container--3-column-wrap`. Selectors must be re-checked for each template.
6. **Regulatory content.** Every page carries a revision code (for example `Revision date 05/2026 CH-12812`) and the "healthcare professionals in Switzerland only" notice. Both must survive migration verbatim.
7. **Login-gated area.** A Login button exists; anything behind it is out of scope for this analysis.

---

## 6. Design system (oneAZ) applied

- **Tokens** from the oneAZ Figma spec are in `styles/styles.css`: the standard palette plus the AstraZeneca brand override, the responsive type scale (breakpoints at 768 and 1440 px), and the 4px spacing scale.
- **Fonts:** Lexia (headings, Regular only; bold is synthesized by the browser) and Inter (body; Regular, Medium, Bold).
- **Components:** Buttons (Primary, Secondary, Tertiary, Link, Icon-only; Medium and Small sizes; group alignment), Links / In-Page Nav, Accordion, Table. Authoring for each is documented in the block's `README.md`. Icon-only has CSS but no Document Authoring syntax yet.
- **Open design question:** H4 size. The spec table says 26px and the rendered preview shows 36px. 26px is used until design confirms.

---

## 7. Open issues

| # | Issue | Impact | Status |
|---|---|---|---|
| 1 | **Images were broken on the live site.** Only page HTML had been uploaded to DA, not the media files, so every image was `about:error`. | High: visible on every published page | **Fixed (2026-09-29).** Media is now uploaded to DA and every image on the republished pages is verified, including the header/footer logos. The source's own product-info image is dead (404), so it was dropped. Separately, branch `fix-da-images` fixes header/footer logos in **local** preview only, where relative fragment paths broke on nested pages |
| 2 | `accordion`, `in-page-nav`, `table` code was only on a feature branch | High: broken demo pages | **Resolved.** PR #1 merged to `main` |
| 2a | **Wrong variant mapping:** `cards-light-withimg` declared source variant `v_f2575cbf84b3` (a text-only row on 1 page) instead of `v_5d7c92bb4412` (the 3-card image grid on 46 pages), which is what it actually implements | Medium: reuse detection would miss 46 pages | **Fixed** in `blocks/cards-light-withimg/metadata.json` |
| 3 | `section-metadata` renders as visible "style / dark" text. The vendored `aem.js` in this project does not process section metadata. | Medium: visible on the homepage | Open. Fix in `scripts/scripts.js` (not `aem.js`) |
| 4 | Homepage metadata image URL is malformed (`https://content/dam/...`) | Low: social preview image | Open. Importer fix |
| 5 | Importer completeness score is 32% | None: false alarm. The metric counts cookie banner, megamenu, and footer text that is deliberately stripped | Known |
| 6 | Sidekick Library panel is not visible in the DA editor | Authors can't browse blocks yet | Needs the Library plugin enabled in the project config at tools.aem.live |
| 7 | Template misgroupings: 21 of 46 translated-page groups split across templates | Would have caused duplicate parsers | **Resolved (2026-09-29).** 33 pages regrouped, 0 splits remain (Section 3.1) |
| 8 | `tabs`, `form`, `breadcrumbs` blocks not built | Blocks the products index and contact pages | Pending |
| 9 | **Button-group and in-page-nav demos broken live.** Document Authoring strips class attributes and keeps only block tables (`div.block > row > cell`). The demos had used bare wrapper divs and link classes, so the Link, Small, and group examples rendered as plain links | Medium: showcase and library pages misleading | **Fixed (2026-09-29).** Demos rewritten as block tables; `button-group` now supports a `small` option and plain links as the Link variant. Live rendering of groups needs branch `template-regrouping` merged |

---

## 8. Recommended next steps

1. **Review the block mappings in Appendix D.** Templates are regrouped (Section 3.1); the 19 unmapped variants still need a decision: default content, fold into an existing block, or a new block.
2. Fix the section-metadata rendering (issue 3).
3. Migrate **content-landing** across all 4 locales. At 49 pages it gives the widest coverage, and its core blocks already exist. The 4 breast cancer pages need extra handling (no hero, key-figures cards). **Re-capture FR `/produkte.html`** before migrating *product-overview*, since its current capture is unstyled.
4. Build `tabs`, then migrate the products index. Decide how to handle the contact form.
5. Migrate Trixeo (*product-detail* 16 + *resource-detail* 34, DE/FR, 50 pages). Handle *contact* (4 pages) with the form decision.
6. Migrate the See the pATTRns campaign (DE/FR/IT, 15 pages).
7. Decide on cross-locale links and personalization widgets (Section 5).

---

## 9. Where the data lives

| Artifact | Path |
|---|---|
| Visual report (page screenshots grouped by template) | `catalog/template-catalog-report-bundle.zip` → `template-catalog-report.html`. Rebuilt with the regrouped templates by `tools/da/rebuild_catalog_report.py`; the pre-regrouping bundle is archived in `migration-work/da-publish/archive/` |
| Template catalog | `catalog/template-catalog.json` |
| Block catalog | `catalog/block-catalog.json` |
| URL inventory / grouping | `catalog/urls-all.json`, `catalog/urls-grouped.json` |
| Full-site import templates | `tools/importer/page-templates.full-catalog.json` |
| Template regrouping rules (manual corrections) | `tools/importer/template-regrouping.json`, applied by `tools/da/apply-template-regrouping.js` |
| Homepage page analysis | `migration-work/authoring-analysis.json`, `migration-work/page-structure.json` |
| Block library (DA) | `/tools/sidekick/library.json`, `/block-library/blocks.json` (8 blocks, 7 templates), generated by `tools/sidekick/build-block-library.js` |
| Block authoring guides | `blocks/<block>/README.md` and `metadata.json` (source-variant mapping) |
| Migration plan and status | `.migration/plans/myastrazeneca-template-discovery.md` |

<!-- APPENDIX:START (generated by tools/da/build-site-analysis.js; do not edit by hand) -->

---

## Appendix A: Every page, by template

Each row is one analyzed page with the block variants detected on it. Look up any variant ID in Appendix D to see its screenshot and details. Use this to check whether each page really belongs in its template.

### A.1 content-landing (49 pages)

*Homepage and therapy-area pages: optional hero, intro copy, therapy card grids, text and image sections.*

| # | Locale | Section | Page title | Block variants on the page | URL |
|---:|---|---|---|---|---|
| 1 | - | Homepage | Startseite \| MyAstraZeneca | unknown `v_5d7c92bb4412`, unknown `v_6defe37a8d19` | [/…/](https://www.myastrazeneca.ch/) |
| 2 | DE | Homepage | Startseite \| MyAstraZeneca | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_6defe37a8d19` | [/de/startseite](https://www.myastrazeneca.ch/de/startseite.html) |
| 3 | DE | Therapy area | Acute Care | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_ed6c5d348ec9`, unknown `v_37fdc84c086b`, unknown `v_8630772c9b24`, unknown `v_6defe37a8d19` | [/…/therapiegebiete/cvrm/acutecare](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/acutecare.html) |
| 4 | DE | Therapy area | Chronische Niereninsuffizienz - Symptome, Diagnose und Behandlung | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_6defe37a8d19` | [/…/therapiegebiete/cvrm/chronischeniereninsuffizienz](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/chronischeniereninsuffizienz.html) |
| 5 | DE | Therapy area | Diabetes | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_6defe37a8d19` | [/…/therapiegebiete/cvrm/diabetes](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/diabetes.html) |
| 6 | DE | Therapy area | Herzinsuffizienz - Symptome, Diagnose und Behandlung | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_6defe37a8d19` | [/…/therapiegebiete/cvrm/herzinsuffizienz](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/herzinsuffizienz.html) |
| 7 | DE | Therapy area | Brustkrebs | unknown `v_5d7c92bb4412`, unknown `v_8630772c9b24`, unknown `v_354e0ece5414` | [/…/therapiegebiete/onkologie/brustkrebs](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/onkologie/brustkrebs.html) |
| 8 | DE | Therapy area | Eierstockkrebs - Symptome, Diagnose und Behandlung | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_6defe37a8d19` | [/…/therapiegebiete/onkologie/eierstockkrebs](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/onkologie/eierstockkrebs.html) |
| 9 | DE | Therapy area | Hämatologie - Symptome, Diagnose und Behandlung | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_6defe37a8d19` | [/…/therapiegebiete/onkologie/haematologie](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/onkologie/haematologie.html) |
| 10 | DE | Therapy area | Lungenkrebs - Symptome, Diagnose und Behandlung | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_6defe37a8d19` | [/…/therapiegebiete/onkologie/lungenkrebs](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/onkologie/lungenkrebs.html) |
| 11 | DE | Therapy area | Prostata-Gesundheitsinformationen & Leitfaden zum Herunterladen \| MyAstraZeneca | hero `v_2ab6094d0f33`, unknown `v_b25f473963c4`, unknown `v_065eb1d0161c`, unknown `v_cc344b0787bb` | [/…/therapiegebiete/onkologie/prostata](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/onkologie/prostata.html) |
| 12 | DE | Therapy area | Asthma - Symptome, Diagnose und Behandlung | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_6defe37a8d19` | [/…/therapiegebiete/ri/asthma](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/ri/asthma.html) |
| 13 | DE | Therapy area | COPD - Symptome, Diagnose und Behandlung | hero `v_b26d6cceada2`, unknown `v_d41301689a41`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_7edce974c28a`, unknown `v_065eb1d0161c`, accordion `v_4ecd3661fdd5` | [/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/ri/copd.html) |
| 14 | DE | Therapy area | Systemischer Lupus Erythematodes - Symptome, Diagnose und Behandlung | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_6defe37a8d19` | [/…/therapiegebiete/ri/lupus](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/ri/lupus.html) |
| 15 | EN | Homepage | Home \| MyAstraZeneca | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412` | [/en/startseite](https://www.myastrazeneca.ch/en/startseite.html) |
| 16 | EN | Therapy area | Acute Care | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_ed6c5d348ec9`, unknown `v_37fdc84c086b`, unknown `v_8630772c9b24`, unknown `v_6defe37a8d19` | [/…/therapiegebiete/cvrm/acutecare](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/acutecare.html) |
| 17 | EN | Therapy area | Chronic Kidney Disease (CKD) - Symptoms, Diagnosis & Treatment | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b` | [/…/therapiegebiete/cvrm/chronischeniereninsuffizienz](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/chronischeniereninsuffizienz.html) |
| 18 | EN | Therapy area | Diabetes | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b` | [/…/therapiegebiete/cvrm/diabetes](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/diabetes.html) |
| 19 | EN | Therapy area | Heart Failure Overview: Symptoms & Treatment | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b` | [/…/therapiegebiete/cvrm/herzinsuffizienz](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/herzinsuffizienz.html) |
| 20 | EN | Therapy area | Breast Cancer Overview: Causes, Symptoms & Therapy | unknown `v_5d7c92bb4412`, unknown `v_8630772c9b24` | [/…/therapiegebiete/onkologie/brustkrebs](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/onkologie/brustkrebs.html) |
| 21 | EN | Therapy area | Ovarian Cancer Overview: Symptoms & Treatment | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b` | [/…/therapiegebiete/onkologie/eierstockkrebs](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/onkologie/eierstockkrebs.html) |
| 22 | EN | Therapy area | Lung Cancer: Symptoms, Stages & Treatment | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b` | [/…/therapiegebiete/onkologie/lungenkrebs](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/onkologie/lungenkrebs.html) |
| 23 | EN | Therapy area | Asthma – Advances in Diagnosis and Care | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b` | [/…/therapiegebiete/ri/asthma](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/ri/asthma.html) |
| 24 | EN | Therapy area | COPD - Symptoms, diagnosis and treatment | hero `v_b26d6cceada2`, unknown `v_d41301689a41`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_7edce974c28a`, accordion `v_4ecd3661fdd5` | [/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/ri/copd.html) |
| 25 | EN | Therapy area | Lupus Insights and Treatment Guidance – For HCPs | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b` | [/…/therapiegebiete/ri/lupus](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/ri/lupus.html) |
| 26 | FR | Homepage | Traitements du diabète, de l’asthme, de la BPCO et du cancer \| MyAstraZeneca | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_6defe37a8d19` | [/fr/startseite](https://www.myastrazeneca.ch/fr/startseite.html) |
| 27 | FR | Therapy area | Insuffisance Rénale Chronique (IRC) Informations - MyAstrazeneca | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_6defe37a8d19` | [/…/therapiegebiete/cvrm/chronischeniereninsuffizienz](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/chronischeniereninsuffizienz.html) |
| 28 | FR | Therapy area | Symptômes, Diagnostic et Traitement du Diabète Sucré \| MyAstraZeneca | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_6defe37a8d19` | [/…/therapiegebiete/cvrm/diabetes](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/diabetes.html) |
| 29 | FR | Therapy area | Insuffisance Cardiaque : Symptômes, Diagnostic et Traitement \| MyAstraZeneca | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_6defe37a8d19` | [/…/therapiegebiete/cvrm/herzinsuffizienz](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/herzinsuffizienz.html) |
| 30 | FR | Therapy area | Cancer Du Sein – Dépistage, Tumeurs Mammaires et Traitements \| MyAstraZeneca | unknown `v_5d7c92bb4412`, unknown `v_8630772c9b24` | [/…/therapiegebiete/onkologie/brustkrebs](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/onkologie/brustkrebs.html) |
| 31 | FR | Therapy area | Cancer de l’Ovaire – Carcinome épithélial, symptômes & prise en charge \| MyAstraZeneca | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_6defe37a8d19` | [/…/therapiegebiete/onkologie/eierstockkrebs](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/onkologie/eierstockkrebs.html) |
| 32 | FR | Therapy area | Hématologie - Leucémie Lymphoïde Chronique, Diagnostic et Traitement \| MyAstraZeneca | hero `v_2ab6094d0f33`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b` | [/…/therapiegebiete/onkologie/haematologie](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/onkologie/haematologie.html) |
| 33 | FR | Therapy area | Cancer du poumon: Symptômes, Diagnostic et Traitements \| MyAstraZeneca | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_6defe37a8d19` | [/…/therapiegebiete/onkologie/lungenkrebs](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/onkologie/lungenkrebs.html) |
| 34 | FR | Therapy area | Prostate: Comprendre son importance et les troubles associés \| MyAstraZeneca | hero `v_2ab6094d0f33`, unknown `v_b25f473963c4`, unknown `v_065eb1d0161c`, unknown `v_cc344b0787bb` | [/…/therapiegebiete/onkologie/prostata](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/onkologie/prostata.html) |
| 35 | FR | Therapy area | Asthme: Symptômes, Diagnostic et Traitements \| MyAstraZeneca | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_6defe37a8d19` | [/…/therapiegebiete/ri/asthma](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/ri/asthma.html) |
| 36 | FR | Therapy area | BPCO - Symptômes, diagnostic et prise en charge | hero `v_b26d6cceada2`, unknown `v_d41301689a41`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_7edce974c28a`, unknown `v_065eb1d0161c`, accordion `v_4ecd3661fdd5` | [/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/ri/copd.html) |
| 37 | FR | Therapy area | Lupus Érythémateux Systémique: Symptômes, Diagnostic et Traitement \| MyAstraZeneca | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_6defe37a8d19` | [/…/therapiegebiete/ri/lupus](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/ri/lupus.html) |
| 38 | IT | Homepage | Portale informativo per gli operatori sanitari \| MyAstraZeneca | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_6defe37a8d19` | [/it/startseite](https://www.myastrazeneca.ch/it/startseite.html) |
| 39 | IT | Therapy area | Comprendere l'insufficienza renale cronica \| AstraZeneca | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_6defe37a8d19` | [/…/therapiegebiete/cvrm/chronischeniereninsuffizienz](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/chronischeniereninsuffizienz.html) |
| 40 | IT | Therapy area | Informazioni chiave sul diabete mellito | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_6defe37a8d19` | [/…/therapiegebiete/cvrm/diabetes](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/diabetes.html) |
| 41 | IT | Therapy area | Insufficienza Cardiaca Cronica: Sintomi, Diagnosi, E Trattamento \| AstraZeneca | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_6defe37a8d19` | [/…/therapiegebiete/cvrm/herzinsuffizienz](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/herzinsuffizienz.html) |
| 42 | IT | Therapy area | Cancro Al Seno: Sintomi, Diagnosi, E Trattamento \| AstraZeneca | unknown `v_5d7c92bb4412`, unknown `v_8630772c9b24` | [/…/therapiegebiete/onkologie/brustkrebs](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/onkologie/brustkrebs.html) |
| 43 | IT | Therapy area | Cancro alle ovaie: Sintomi, Diagnosi, e Trattamento \| AstraZeneca | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_6defe37a8d19` | [/…/therapiegebiete/onkologie/eierstockkrebs](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/onkologie/eierstockkrebs.html) |
| 44 | IT | Therapy area | Leucemia linfocitica cronica (LLC) in ematologia: sintomi, diagnosi e trattamento \| AstraZeneca | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_6defe37a8d19` | [/…/therapiegebiete/onkologie/haematologie](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/onkologie/haematologie.html) |
| 45 | IT | Therapy area | Cancro del polmone: Sintomi, Diagnosi, e Trattamento \| AstraZeneca | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_6defe37a8d19` | [/…/therapiegebiete/onkologie/lungenkrebs](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/onkologie/lungenkrebs.html) |
| 46 | IT | Therapy area | Prostata: Comprendere la sua importanza e i disturbi associati \| MyAstraZeneca | hero `v_2ab6094d0f33`, unknown `v_b25f473963c4`, unknown `v_065eb1d0161c`, unknown `v_cc344b0787bb` | [/…/therapiegebiete/onkologie/prostata](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/onkologie/prostata.html) |
| 47 | IT | Therapy area | Asma | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_6defe37a8d19` | [/…/therapiegebiete/ri/asthma](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/ri/asthma.html) |
| 48 | IT | Therapy area | BPCO - Sintomi, diagnosi e trattamento | hero `v_b26d6cceada2`, unknown `v_d41301689a41`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_7edce974c28a`, unknown `v_065eb1d0161c`, accordion `v_4ecd3661fdd5` | [/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/ri/copd.html) |
| 49 | IT | Therapy area | Lupus | hero `v_b26d6cceada2`, unknown `v_5d7c92bb4412`, unknown `v_37fdc84c086b`, unknown `v_6defe37a8d19` | [/…/therapiegebiete/ri/lupus](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/ri/lupus.html) |

### A.2 resource-detail (34 pages)

*Trixeo resource document page: breadcrumb, share icons, title, short paragraphs, revision code.*

| # | Locale | Section | Page title | Block variants on the page | URL |
|---:|---|---|---|---|---|
| 1 | DE | Trixeo resource doc | Dreifachtherapie und kardiopulmonale Risikofaktoren \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/3-molekuele-der-dreifachtherapie-gegen-kardiopulmonales-risiko-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/3-molekuele-der-dreifachtherapie-gegen-kardiopulmonales-risiko-de.html) |
| 2 | DE | Trixeo resource doc | TRIXEO Aerosphere® Anwendungsbroschüre \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/anwendungsbroschuere-trixeo-aerosphere-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/anwendungsbroschuere-trixeo-aerosphere-de.html) |
| 3 | DE | Trixeo resource doc | Anwendung von TRIXEO Aerosphere®, Symbicort® & Vannair® \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/anwendungskarte-trixeo-aerosphere-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/anwendungskarte-trixeo-aerosphere-de.html) |
| 4 | DE | Trixeo resource doc | Checkliste für COPD-Exazerbationen \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/checkliste-fuer-copd-exazerbationen-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/checkliste-fuer-copd-exazerbationen-de.html) |
| 5 | DE | Trixeo resource doc | COPD-Datenblatt \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/copd-datenblatt-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/copd-datenblatt-de.html) |
| 6 | DE | Trixeo resource doc | COPD und Lungenkrebs \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/copd-und-lungenkrebs-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/copd-und-lungenkrebs-de.html) |
| 7 | DE | Trixeo resource doc | Die ETHOS Studie \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/ethos-studienzusammenfassung-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/ethos-studienzusammenfassung-de.html) |
| 8 | DE | Trixeo resource doc | TRIXEO Aerosphere® Fachinformation \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/fachinformation-von-trixeo-aerosphere-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/fachinformation-von-trixeo-aerosphere-de.html) |
| 9 | DE | Trixeo resource doc | Die KRONOS Studie \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/kronos-studienzusammenfassung-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/kronos-studienzusammenfassung-de.html) |
| 10 | DE | Trixeo resource doc | COPD und kardiovaskuläre Risiken \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/lunge-und-herz-ein-unzertrennliches-duo-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/lunge-und-herz-ein-unzertrennliches-duo-de.html) |
| 11 | DE | Trixeo resource doc | Patientenposter zu COPD \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/patient-poster-copd-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/patient-poster-copd-de.html) |
| 12 | DE | Trixeo resource doc | COPD-Broschüre für Ihre Patienten \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/patientenbroschure-zur-copd-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/patientenbroschure-zur-copd-de.html) |
| 13 | DE | Trixeo resource doc | Präsentation zum COPD-Management in der Praxis \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/slide-deck-copd-now-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/slide-deck-copd-now-de.html) |
| 14 | DE | Trixeo resource doc | TRIXEO Aerosphere® Technologie im Überblick \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/slide-deck-trixeo-aerosphere-technologie-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/slide-deck-trixeo-aerosphere-technologie-de.html) |
| 15 | DE | Trixeo resource doc | Die SKOPOS-MAZI-Studie \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/studienzusammenfassung-skopos-mazi-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/studienzusammenfassung-skopos-mazi-de.html) |
| 16 | DE | Trixeo resource doc | TRIXEO Aerosphere® Limitatio und Implikationen \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/trixeo-aerosphere-factsheet-zur-limitatio-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/trixeo-aerosphere-factsheet-zur-limitatio-de.html) |
| 17 | DE | Trixeo resource doc | TRIXEO Aerosphere® Krankenkassenformular \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/trixeo-aerosphere-kranken-kassenformular-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/trixeo-aerosphere-kranken-kassenformular-de.html) |
| 18 | FR | Trixeo resource doc | Trithérapie et facteurs de risque cardiopulmonaires \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/3-molekuele-der-dreifachtherapie-gegen-kardiopulmonales-risiko-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/3-molekuele-der-dreifachtherapie-gegen-kardiopulmonales-risiko-fr.html) |
| 19 | FR | Trixeo resource doc | Brochure d'utilisation de TRIXEO Aerosphere® \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/anwendungsbroschuere-trixeo-aerosphere-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/anwendungsbroschuere-trixeo-aerosphere-fr.html) |
| 20 | FR | Trixeo resource doc | Utilisation de TRIXEO Aerosphere®, Symbicort® et Vannair® \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/anwendungskarte-trixeo-aerosphere-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/anwendungskarte-trixeo-aerosphere-fr.html) |
| 21 | FR | Trixeo resource doc | Check-list pour les exacerbations de la BPCO \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/checkliste-fuer-copd-exazerbationen-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/checkliste-fuer-copd-exazerbationen-fr.html) |
| 22 | FR | Trixeo resource doc | Fiche de suivi pour la BPCO pour les patients \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/copd-datenblatt-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/copd-datenblatt-fr.html) |
| 23 | FR | Trixeo resource doc | BPCO et cancer du poumon \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/copd-und-lungenkrebs-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/copd-und-lungenkrebs-fr.html) |
| 24 | FR | Trixeo resource doc | Étude ETHOS \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/ethos-studienzusammenfassung-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/ethos-studienzusammenfassung-fr.html) |
| 25 | FR | Trixeo resource doc | Information professionnelle sur TRIXEO Aerosphere® \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/fachinformation-von-trixeo-aerosphere-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/fachinformation-von-trixeo-aerosphere-fr.html) |
| 26 | FR | Trixeo resource doc | Étude KRONOS \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/kronos-studienzusammenfassung-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/kronos-studienzusammenfassung-fr.html) |
| 27 | FR | Trixeo resource doc | BPCO et risques cardiovasculaires \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/lunge-und-herz-ein-unzertrennliches-duo-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/lunge-und-herz-ein-unzertrennliches-duo-fr.html) |
| 28 | FR | Trixeo resource doc | Poster d'information BPCO pour les patients \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/patient-poster-copd-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/patient-poster-copd-fr.html) |
| 29 | FR | Trixeo resource doc | Brochure BPCO pour vos patients \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/patientenbroschure-zur-copd-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/patientenbroschure-zur-copd-fr.html) |
| 30 | FR | Trixeo resource doc | Présentation sur la prise en charge de la BPCO en pratique \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/slide-deck-copd-now-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/slide-deck-copd-now-fr.html) |
| 31 | FR | Trixeo resource doc | Aperçu de la technologie TRIXEO Aerosphere® \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/slide-deck-trixeo-aerosphere-technologie-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/slide-deck-trixeo-aerosphere-technologie-fr.html) |
| 32 | FR | Trixeo resource doc | Étude SKOPOS-MAZI \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/studienzusammenfassung-skopos-mazi-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/studienzusammenfassung-skopos-mazi-fr.html) |
| 33 | FR | Trixeo resource doc | TRIXEO Aerosphere® : Limitatio et implications \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/trixeo-aerosphere-factsheet-zur-limitatio-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/trixeo-aerosphere-factsheet-zur-limitatio-fr.html) |
| 34 | FR | Trixeo resource doc | Prise en charge TRIXEO Aerosphere® \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen/trixeo-aerosphere-kranken-kassenformular-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/trixeo-aerosphere-kranken-kassenformular-fr.html) |

### A.3 product-detail (16 pages)

*Trixeo product page: breadcrumb, product sub-navigation tabs, title, text and media sections. Includes the resources index.*

| # | Locale | Section | Page title | Block variants on the page | URL |
|---:|---|---|---|---|---|
| 1 | DE | Trixeo product | TRIXEO Aerosphere® Technologie erklärt \| MyAstraZeneca | (none) | [/…/produkte/trixeo/aerosphere-technologie](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/aerosphere-technologie.html) |
| 2 | DE | Trixeo product | COPD-Management im klinischen Alltag \| MyAstraZeneca | (none) | [/…/produkte/trixeo/copd-management](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/copd-management.html) |
| 3 | DE | Trixeo product | TRIXEO Aerosphere® Events und Fortbildungen \| MyAstraZeneca | (none) | [/…/produkte/trixeo/events](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/events.html) |
| 4 | DE | Trixeo product | TRIXEO Ressourcen für medizinisches Fachpersonal \| AstraZeneca CH | (none) | [/…/produkte/trixeo/ressourcen](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen.html) |
| 5 | DE | Trixeo product | TRIXEO Aerosphere® Sicherheitsprofil \| MyAstraZeneca | (none) | [/…/produkte/trixeo/sicherheit](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/sicherheit.html) |
| 6 | DE | Trixeo product | TRIXEO Aerosphere® Succinct Statement \| MyAstraZeneca | (none) | [/…/produkte/trixeo/succinct-statement](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/succinct-statement.html) |
| 7 | DE | Trixeo product | TRIXEO Aerosphere® im Überblick \| MyAstraZeneca | (none) | [/…/produkte/trixeo/uberblick](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/uberblick.html) |
| 8 | DE | Trixeo product | Wirksamkeit von TRIXEO Aerosphere® \| MyAstraZeneca | (none) | [/…/produkte/trixeo/wirksamkeit](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/wirksamkeit.html) |
| 9 | FR | Trixeo product | La technologie de TRIXEO Aerosphere® expliquée \| MyAstraZeneca | (none) | [/…/produkte/trixeo/aerosphere-technologie](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/aerosphere-technologie.html) |
| 10 | FR | Trixeo product | La prise en charge de la BPCO \| MyAstraZeneca | (none) | [/…/produkte/trixeo/copd-management](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/copd-management.html) |
| 11 | FR | Trixeo product | Événements et formations de TRIXEO Aerosphere® \| MyAstraZeneca | (none) | [/…/produkte/trixeo/events](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/events.html) |
| 12 | FR | Trixeo product | Ressources TRIXEO pour le corps médical \| MyAstraZeneca | (none) | [/…/produkte/trixeo/ressourcen](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen.html) |
| 13 | FR | Trixeo product | Profil de sécurité de TRIXEO Aerosphere® \| MyAstraZeneca | (none) | [/…/produkte/trixeo/sicherheit](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/sicherheit.html) |
| 14 | FR | Trixeo product | Information succincte sur TRIXEO Aerosphere® \| MyAstraZeneca | (none) | [/…/produkte/trixeo/succinct-statement](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/succinct-statement.html) |
| 15 | FR | Trixeo product | Aperçu TRIXEO Aerosphere® \| MyAstraZeneca | (none) | [/…/produkte/trixeo/uberblick](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/uberblick.html) |
| 16 | FR | Trixeo product | Efficacité de TRIXEO Aerosphere® \| MyAstraZeneca | (none) | [/…/produkte/trixeo/wirksamkeit](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/wirksamkeit.html) |

### A.4 campaign-subpage (12 pages)

*See the pATTRns interior page: campaign banner, section tabs, stat boxes, diagrams, download CTAs.*

| # | Locale | Section | Page title | Block variants on the page | URL |
|---:|---|---|---|---|---|
| 1 | DE | See the pATTRns | Über ATTR Amyloidose: Verlauf & Ursachen \| See the pATTRns | hero `v_e4409b853477`, unknown `v_37fdc84c086b`, unknown `v_bbadaab7c4b3`, unknown `v_065eb1d0161c`, unknown `v_bd282072e4b6`, unknown `v_c602950f63c9`, unknown `v_cc344b0787bb` | [/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html) |
| 2 | DE | See the pATTRns | ATTR Amyloidose Diagnostizieren \| See the pATTRns \| Diagnose | hero `v_e4409b853477`, unknown `v_065eb1d0161c`, unknown `v_86957572c961`, unknown `v_2bed43c59a16`, unknown `v_bbadaab7c4b3`, unknown `v_cc344b0787bb` | [/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html) |
| 3 | DE | See the pATTRns | Symptome der ATTR Amyloidose erkennen \| See the pATTRns | hero `v_e4409b853477`, hero `v_b1e664af6109`, unknown `v_86957572c961`, unknown `v_7d7a8d636759`, unknown `v_5a31a8c89674`, unknown `v_cc344b0787bb` | [/…/therapiegebiete/cvrm/see-the-pattrns/symptomes](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/symptomes.html) |
| 4 | DE | See the pATTRns | Behandlung der ATTR Amyloidose \| See the pATTRns \| Behandlung | hero `v_e4409b853477`, unknown `v_065eb1d0161c`, unknown `v_cc344b0787bb` | [/…/therapiegebiete/cvrm/see-the-pattrns/treatement](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/treatement.html) |
| 5 | FR | See the pATTRns | À propos de l’ATTR | hero `v_e4409b853477`, unknown `v_37fdc84c086b`, unknown `v_bbadaab7c4b3`, unknown `v_065eb1d0161c`, unknown `v_bd282072e4b6`, unknown `v_c602950f63c9`, unknown `v_cc344b0787bb` | [/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html) |
| 6 | FR | See the pATTRns | Diagnostic de l’ATTR | hero `v_e4409b853477`, unknown `v_065eb1d0161c`, unknown `v_86957572c961`, unknown `v_2bed43c59a16`, unknown `v_bbadaab7c4b3`, unknown `v_cc344b0787bb` | [/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html) |
| 7 | FR | See the pATTRns | Symptômes de l’ATTR | hero `v_e4409b853477`, unknown `v_86957572c961`, cards `v_f2575cbf84b3`, unknown `v_7d7a8d636759`, unknown `v_5a31a8c89674`, unknown `v_bbadaab7c4b3`, unknown `v_cc344b0787bb` | [/…/therapiegebiete/cvrm/see-the-pattrns/symptomes](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/symptomes.html) |
| 8 | FR | See the pATTRns | Traitement | hero `v_e4409b853477`, unknown `v_065eb1d0161c`, unknown `v_bbadaab7c4b3`, unknown `v_cc344b0787bb` | [/…/therapiegebiete/cvrm/see-the-pattrns/treatement](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/treatement.html) |
| 9 | IT | See the pATTRns | L’amiloidosi ATTR | hero `v_e4409b853477`, unknown `v_37fdc84c086b`, unknown `v_bbadaab7c4b3`, unknown `v_065eb1d0161c`, unknown `v_bd282072e4b6`, unknown `v_c602950f63c9`, unknown `v_cc344b0787bb` | [/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html) |
| 10 | IT | See the pATTRns | Diagnosi | hero `v_e4409b853477`, unknown `v_065eb1d0161c`, unknown `v_86957572c961`, unknown `v_2bed43c59a16`, unknown `v_bbadaab7c4b3`, unknown `v_cc344b0787bb` | [/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html) |
| 11 | IT | See the pATTRns | Sintomi | hero `v_e4409b853477`, unknown `v_86957572c961`, unknown `v_7d7a8d636759`, unknown `v_5a31a8c89674`, unknown `v_bbadaab7c4b3`, unknown `v_cc344b0787bb` | [/…/therapiegebiete/cvrm/see-the-pattrns/symptomes](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/see-the-pattrns/symptomes.html) |
| 12 | IT | See the pATTRns | Trattamento | hero `v_e4409b853477`, unknown `v_065eb1d0161c`, unknown `v_bbadaab7c4b3`, unknown `v_cc344b0787bb` | [/…/therapiegebiete/cvrm/see-the-pattrns/treatement](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/see-the-pattrns/treatement.html) |

### A.5 campaign-landing (3 pages)

*See the pATTRns home: campaign banner, section tabs, key visual, two teaser cards, questions band.*

| # | Locale | Section | Page title | Block variants on the page | URL |
|---:|---|---|---|---|---|
| 1 | DE | See the pATTRns | Einführung in ATTR Amyloidose \| See the pATTRns | hero `v_e4409b853477`, unknown `v_7d7a8d636759`, unknown `v_bbadaab7c4b3`, unknown `v_cc344b0787bb` | [/…/therapiegebiete/cvrm/see-the-pattrns/home](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/home.html) |
| 2 | FR | See the pATTRns | Amylose à transthyrétine (ATTR-CM) – Diagnostic et prise en charge \| MyAstraZeneca | hero `v_e4409b853477`, unknown `v_065eb1d0161c`, unknown `v_bbadaab7c4b3`, unknown `v_cc344b0787bb` | [/…/therapiegebiete/cvrm/see-the-pattrns/home](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/home.html) |
| 3 | IT | See the pATTRns | Home | hero `v_e4409b853477`, unknown `v_065eb1d0161c`, unknown `v_bbadaab7c4b3`, unknown `v_cc344b0787bb` | [/…/therapiegebiete/cvrm/see-the-pattrns/home](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/see-the-pattrns/home.html) |

### A.6 product-overview (4 pages)

*Products index: hero banner, therapy-area tabs, product card grid, contact banner.*

| # | Locale | Section | Page title | Block variants on the page | URL |
|---:|---|---|---|---|---|
| 1 | DE | Products index | Produkte - MyAstraZeneca | hero `v_b26d6cceada2`, tabs `v_8ab7ece34e9a`, columns `v_f90804d73a13`, unknown `v_617324728993` | [/…/produkte](https://www.myastrazeneca.ch/de/startseite/produkte.html) |
| 2 | EN | Products index | Overview of Medical Products – Therapeutic Areas | hero `v_b26d6cceada2`, tabs `v_8ab7ece34e9a-1`, columns `v_f90804d73a13`, unknown `v_617324728993` | [/…/produkte](https://www.myastrazeneca.ch/en/startseite/produkte.html) |
| 3 | FR | Products index | Médicaments cardiovasculaires, rénaux et métaboliques \| MyAstraZeneca | breadcrumbs `v_f88e29f32a0c`, hero `v_42845b3e07dd`, tabs `v_8ab7ece34e9a-2`, hero `v_228f16fbc166` | [/…/produkte](https://www.myastrazeneca.ch/fr/startseite/produkte.html) |
| 4 | IT | Products index | Prodotti \| AstraZeneca | hero `v_b26d6cceada2`, tabs `v_8ab7ece34e9a`, columns `v_f90804d73a13`, unknown `v_617324728993` | [/…/produkte](https://www.myastrazeneca.ch/it/startseite/produkte.html) |

### A.7 contact (4 pages)

*Contact page: title and enquiry form.*

| # | Locale | Section | Page title | Block variants on the page | URL |
|---:|---|---|---|---|---|
| 1 | DE | Contact | Kontaktieren Sie uns | form `v_6e8c2538dd7e` | [/…/contact-us](https://www.myastrazeneca.ch/de/startseite/contact-us.html) |
| 2 | EN | Contact | Contact us | form `v_6e8c2538dd7e` | [/…/contact-us](https://www.myastrazeneca.ch/en/startseite/contact-us.html) |
| 3 | FR | Contact | Contactez-nous | form `v_c8843a7f9ec8` | [/…/contact-us](https://www.myastrazeneca.ch/fr/startseite/contact-us.html) |
| 4 | IT | Contact | Contattaci | form `v_181661dda160` | [/…/contact-us](https://www.myastrazeneca.ch/it/startseite/contact-us.html) |

### A.8 Excluded pages (failed analysis)

| # | Locale | URL | Reason |
|---:|---|---|---|
| 1 | DE | [/…/therapiegebiete/onkologie/leberkrebs](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/onkologie/leberkrebs.html) | HTTP 404 on the source site |
| 2 | EN | [/…/therapiegebiete/onkologie/haematologie](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/onkologie/haematologie.html) | HTTP 404 on the source site |
| 3 | EN | [/…/therapiegebiete/onkologie/leberkrebs](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/onkologie/leberkrebs.html) | HTTP 404 on the source site |
| 4 | FR | [/…/therapiegebiete/onkologie/leberkrebs](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/onkologie/leberkrebs.html) | HTTP 404 on the source site |
| 5 | IT | [/…/therapiegebiete/onkologie/leberkrebs](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/onkologie/leberkrebs.html) | HTTP 404 on the source site |

---

## Appendix B: Template reference screenshots

Top of each template's first page (full-page captures are cropped to the upper part of the page).

### B.1 content-landing

Page: [/…/](https://www.myastrazeneca.ch/)

![content-landing: Startseite \| MyAstraZeneca](../catalog/.pages/www_myastrazeneca_ch--c9b7217c/full-page.jpg)

### B.2 resource-detail

Page: [/…/produkte/trixeo/ressourcen/3-molekuele-der-dreifachtherapie-gegen-kardiopulmonales-risiko-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/3-molekuele-der-dreifachtherapie-gegen-kardiopulmonales-risiko-de.html)

![resource-detail: Dreifachtherapie und kardiopulmonale Risikofaktoren \| MyAstraZeneca](../catalog/.pages/www_myastrazeneca_ch_de_startseite_produkte_trixeo_ressourcen_3-molekuele-der-dreifachtherapie-gegen-kardiopulmonales-risiko-de_html--afe3575e/full-page.jpg)

### B.3 product-detail

Page: [/…/produkte/trixeo/aerosphere-technologie](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/aerosphere-technologie.html)

![product-detail: TRIXEO Aerosphere® Technologie erklärt \| MyAstraZeneca](../catalog/.pages/www_myastrazeneca_ch_de_startseite_produkte_trixeo_aerosphere-technologie_html--4979dd00/full-page.jpg)

### B.4 campaign-subpage

Page: [/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html)

![campaign-subpage: Über ATTR Amyloidose: Verlauf & Ursachen \| See the pATTRns](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_cvrm_see-the-pattrns_about-amylodosis-attr_html--6b239aec/full-page.jpg)

### B.5 campaign-landing

Page: [/…/therapiegebiete/cvrm/see-the-pattrns/home](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/home.html)

![campaign-landing: Einführung in ATTR Amyloidose \| See the pATTRns](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_cvrm_see-the-pattrns_home_html--7fa80632/full-page.jpg)

### B.6 product-overview

Page: [/…/produkte](https://www.myastrazeneca.ch/de/startseite/produkte.html)

![product-overview: Produkte - MyAstraZeneca](../catalog/.pages/www_myastrazeneca_ch_de_startseite_produkte_html--71e7356f/full-page.jpg)

### B.7 contact

Page: [/…/contact-us](https://www.myastrazeneca.ch/de/startseite/contact-us.html)

![contact: Kontaktieren Sie uns](../catalog/.pages/www_myastrazeneca_ch_de_startseite_contact-us_html--8cd7913a/full-page.jpg)

---

## Appendix C: Template × block type matrix

Number of pages in each template that contain at least one block of that type. "unknown" means content the detector could not map to a named block (mostly default content).

| Template | Pages | hero | cards | columns | accordion | tabs | form | breadcrumbs | unknown |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| content-landing | 49 | 44 | · | · | 4 | · | · | · | 49 |
| resource-detail | 34 | · | · | · | · | · | · | · | · |
| product-detail | 16 | · | · | · | · | · | · | · | · |
| campaign-subpage | 12 | 12 | 1 | · | · | · | · | · | 12 |
| campaign-landing | 3 | 3 | · | · | · | · | · | · | 3 |
| product-overview | 4 | 4 | · | 3 | · | 4 | · | 1 | 3 |
| contact | 4 | · | · | · | · | · | 4 | · | · |

---

## Appendix D: Block variant catalog

One entry per detected variant: its structure, how many pages use it, which templates it appears in, which EDS block implements it today (from each block's `metadata.json`), and an example screenshot. Variants with no EDS block are candidates for default content or a new block.

### D.1 header: `header-global`

| Field | Value |
|---|---|
| Detected type | header |
| Structure | Block variant: header |
| Pages using it | every page (global) |
| Templates | all |
| EDS block today | `header` (global) |

![header header-global](../catalog/.pages/_global/header.jpg)

### D.2 footer: `footer-global`

| Field | Value |
|---|---|
| Detected type | footer |
| Structure | Block variant: footer |
| Pages using it | every page (global) |
| Templates | all |
| EDS block today | `footer` (global) |

![footer footer-global](../catalog/.pages/_global/footer.jpg)

### D.3 hero: `v_b26d6cceada2`

| Field | Value |
|---|---|
| Detected type | hero |
| Structure | heading + text + 2 images |
| Pages using it | 43 |
| Templates | content-landing (40), product-overview (3) |
| EDS block today | `hero-minimal-dark-withimg` |
| Example pages | [/en/startseite](https://www.myastrazeneca.ch/en/startseite.html)<br>[/…/produkte](https://www.myastrazeneca.ch/en/startseite/produkte.html)<br>[/…/therapiegebiete/cvrm/acutecare](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/acutecare.html) |

![hero v_b26d6cceada2](../catalog/.pages/www_myastrazeneca_ch_en_startseite_html--3b773d1a/blocks/14d60be3.jpg)

### D.4 hero: `v_e4409b853477`

| Field | Value |
|---|---|
| Detected type | hero |
| Structure | 2 images |
| Pages using it | 15 |
| Templates | campaign-subpage (12), campaign-landing (3) |
| EDS block today | none yet |
| Example pages | [/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/home](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/home.html) |

![hero v_e4409b853477](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_cvrm_see-the-pattrns_about-amylodosis-attr_html--6b239aec/blocks/18306014.jpg)

### D.5 hero: `v_2ab6094d0f33`

| Field | Value |
|---|---|
| Detected type | hero |
| Structure | heading + text + 2 images |
| Pages using it | 4 |
| Templates | content-landing (4) |
| EDS block today | none yet |
| Example pages | [/…/therapiegebiete/onkologie/prostata](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/onkologie/prostata.html)<br>[/…/therapiegebiete/onkologie/haematologie](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/onkologie/haematologie.html)<br>[/…/therapiegebiete/onkologie/prostata](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/onkologie/prostata.html) |

![hero v_2ab6094d0f33](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_onkologie_prostata_html--b065b3ab/blocks/40f87f29.jpg)

### D.6 hero: `v_228f16fbc166`

| Field | Value |
|---|---|
| Detected type | hero |
| Structure | heading + text + 2 images |
| Pages using it | 1 |
| Templates | product-overview (1) |
| EDS block today | none yet |
| Example pages | [/…/produkte](https://www.myastrazeneca.ch/fr/startseite/produkte.html) |

![hero v_228f16fbc166](../catalog/.pages/www_myastrazeneca_ch_fr_startseite_produkte_html--ee1c829d/blocks/7f3622f1.jpg)

### D.7 hero: `v_42845b3e07dd`

| Field | Value |
|---|---|
| Detected type | hero |
| Structure | heading + text + 2 images |
| Pages using it | 1 |
| Templates | product-overview (1) |
| EDS block today | none yet |
| Example pages | [/…/produkte](https://www.myastrazeneca.ch/fr/startseite/produkte.html) |

![hero v_42845b3e07dd](../catalog/.pages/www_myastrazeneca_ch_fr_startseite_produkte_html--ee1c829d/blocks/2e204570.jpg)

### D.8 hero: `v_b1e664af6109`

| Field | Value |
|---|---|
| Detected type | hero |
| Structure | heading + 2 images |
| Pages using it | 1 |
| Templates | campaign-subpage (1) |
| EDS block today | none yet |
| Example pages | [/…/therapiegebiete/cvrm/see-the-pattrns/symptomes](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/symptomes.html) |

![hero v_b1e664af6109](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_cvrm_see-the-pattrns_symptomes_html--4eba725c/blocks/65aa2671.jpg)

### D.9 cards: `v_f2575cbf84b3`

| Field | Value |
|---|---|
| Detected type | cards |
| Structure | text |
| Pages using it | 1 |
| Templates | campaign-subpage (1) |
| EDS block today | none yet |
| Example pages | [/…/therapiegebiete/cvrm/see-the-pattrns/symptomes](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/symptomes.html) |

![cards v_f2575cbf84b3](../catalog/.pages/www_myastrazeneca_ch_fr_startseite_therapiegebiete_cvrm_see-the-pattrns_symptomes_html--91f9a284/blocks/625ecdba.jpg)

### D.10 columns: `v_f90804d73a13`

| Field | Value |
|---|---|
| Detected type | columns |
| Structure | heading + text + 2 images |
| Pages using it | 3 |
| Templates | product-overview (3) |
| EDS block today | none yet |
| Example pages | [/…/produkte](https://www.myastrazeneca.ch/en/startseite/produkte.html)<br>[/…/produkte](https://www.myastrazeneca.ch/de/startseite/produkte.html)<br>[/…/produkte](https://www.myastrazeneca.ch/it/startseite/produkte.html) |

![columns v_f90804d73a13](../catalog/.pages/www_myastrazeneca_ch_en_startseite_produkte_html--96d99f3e/blocks/57e9dab0.jpg)

### D.11 accordion: `v_4ecd3661fdd5`

| Field | Value |
|---|---|
| Detected type | accordion |
| Structure | heading + text + 6 CTAs |
| Pages using it | 4 |
| Templates | content-landing (4) |
| EDS block today | none yet |
| Example pages | [/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/ri/copd.html)<br>[/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/ri/copd.html)<br>[/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/ri/copd.html) |

![accordion v_4ecd3661fdd5](../catalog/.pages/www_myastrazeneca_ch_en_startseite_therapiegebiete_ri_copd_html--03db88aa/blocks/34814720.jpg)

### D.12 tabs: `v_8ab7ece34e9a`

| Field | Value |
|---|---|
| Detected type | tabs |
| Structure | heading + text + 32 CTAs + 32 images + list |
| Pages using it | 2 |
| Templates | product-overview (2) |
| EDS block today | none yet |
| Example pages | [/…/produkte](https://www.myastrazeneca.ch/de/startseite/produkte.html)<br>[/…/produkte](https://www.myastrazeneca.ch/it/startseite/produkte.html) |

![tabs v_8ab7ece34e9a](../catalog/.pages/www_myastrazeneca_ch_de_startseite_produkte_html--71e7356f/blocks/2f00e970.jpg)

### D.13 tabs: `v_8ab7ece34e9a-1`

| Field | Value |
|---|---|
| Detected type | tabs |
| Structure | heading + text + 28 CTAs + 28 images + list |
| Pages using it | 1 |
| Templates | product-overview (1) |
| EDS block today | none yet |
| Example pages | [/…/produkte](https://www.myastrazeneca.ch/en/startseite/produkte.html) |

![tabs v_8ab7ece34e9a-1](../catalog/.pages/www_myastrazeneca_ch_en_startseite_produkte_html--96d99f3e/blocks/2f00e970.jpg)

### D.14 tabs: `v_8ab7ece34e9a-2`

| Field | Value |
|---|---|
| Detected type | tabs |
| Structure | heading + text + 32 CTAs + 32 images + list |
| Pages using it | 1 |
| Templates | product-overview (1) |
| EDS block today | none yet |
| Example pages | [/…/produkte](https://www.myastrazeneca.ch/fr/startseite/produkte.html) |

![tabs v_8ab7ece34e9a-2](../catalog/.pages/www_myastrazeneca_ch_fr_startseite_produkte_html--ee1c829d/blocks/2f00e970.jpg)

### D.15 form: `v_6e8c2538dd7e`

| Field | Value |
|---|---|
| Detected type | form |
| Structure | text + 2 CTAs + list |
| Pages using it | 2 |
| Templates | contact (2) |
| EDS block today | none yet |
| Example pages | [/…/contact-us](https://www.myastrazeneca.ch/en/startseite/contact-us.html)<br>[/…/contact-us](https://www.myastrazeneca.ch/de/startseite/contact-us.html) |

![form v_6e8c2538dd7e](../catalog/.pages/www_myastrazeneca_ch_en_startseite_contact-us_html--9f317070/blocks/6962511e.jpg)

### D.16 form: `v_181661dda160`

| Field | Value |
|---|---|
| Detected type | form |
| Structure | text + 2 CTAs |
| Pages using it | 1 |
| Templates | contact (1) |
| EDS block today | none yet |
| Example pages | [/…/contact-us](https://www.myastrazeneca.ch/it/startseite/contact-us.html) |

![form v_181661dda160](../catalog/.pages/www_myastrazeneca_ch_it_startseite_contact-us_html--ace3238e/blocks/43733ec6.jpg)

### D.17 form: `v_c8843a7f9ec8`

| Field | Value |
|---|---|
| Detected type | form |
| Structure | text + 2 CTAs |
| Pages using it | 1 |
| Templates | contact (1) |
| EDS block today | none yet |
| Example pages | [/…/contact-us](https://www.myastrazeneca.ch/fr/startseite/contact-us.html) |

![form v_c8843a7f9ec8](../catalog/.pages/www_myastrazeneca_ch_fr_startseite_contact-us_html--cfe2c492/blocks/4651dca2.jpg)

### D.18 breadcrumbs: `v_f88e29f32a0c`

| Field | Value |
|---|---|
| Detected type | breadcrumbs |
| Structure | list |
| Pages using it | 1 |
| Templates | product-overview (1) |
| EDS block today | none yet |
| Example pages | [/…/produkte](https://www.myastrazeneca.ch/fr/startseite/produkte.html) |

![breadcrumbs v_f88e29f32a0c](../catalog/.pages/www_myastrazeneca_ch_fr_startseite_produkte_html--ee1c829d/blocks/62ae0a80.jpg)

### D.19 unknown: `v_37fdc84c086b`

| Field | Value |
|---|---|
| Detected type | unknown |
| Structure | heading + text + 2 images + list |
| Pages using it | 40 |
| Templates | content-landing (37), campaign-subpage (3) |
| EDS block today | none yet |
| Example pages | [/…/therapiegebiete/cvrm/acutecare](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/acutecare.html)<br>[/…/therapiegebiete/cvrm/chronischeniereninsuffizienz](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/chronischeniereninsuffizienz.html)<br>[/…/therapiegebiete/cvrm/diabetes](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/diabetes.html) |

![unknown v_37fdc84c086b](../catalog/.pages/www_myastrazeneca_ch_en_startseite_therapiegebiete_cvrm_acutecare_html--d422dc19/blocks/62b4cb28.jpg)

### D.20 unknown: `v_5d7c92bb4412`

| Field | Value |
|---|---|
| Detected type | unknown |
| Structure | heading + text + 6 images |
| Pages using it | 46 |
| Templates | content-landing (46) |
| EDS block today | `cards-light-withimg` |
| Example pages | [/en/startseite](https://www.myastrazeneca.ch/en/startseite.html)<br>[/…/therapiegebiete/cvrm/acutecare](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/acutecare.html)<br>[/…/therapiegebiete/cvrm/chronischeniereninsuffizienz](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/chronischeniereninsuffizienz.html) |

![unknown v_5d7c92bb4412](../catalog/.pages/www_myastrazeneca_ch_en_startseite_html--3b773d1a/blocks/72f39286.jpg)

### D.21 unknown: `v_6defe37a8d19`

| Field | Value |
|---|---|
| Detected type | unknown |
| Structure | text + 2 images |
| Pages using it | 29 |
| Templates | content-landing (29) |
| EDS block today | none yet |
| Example pages | [/…/therapiegebiete/cvrm/acutecare](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/acutecare.html)<br>[/…/](https://www.myastrazeneca.ch/)<br>[/de/startseite](https://www.myastrazeneca.ch/de/startseite.html) |

![unknown v_6defe37a8d19](../catalog/.pages/www_myastrazeneca_ch_en_startseite_therapiegebiete_cvrm_acutecare_html--d422dc19/blocks/c1b8293.jpg)

### D.22 unknown: `v_8630772c9b24`

| Field | Value |
|---|---|
| Detected type | unknown |
| Structure | image |
| Pages using it | 6 |
| Templates | content-landing (6) |
| EDS block today | none yet |
| Example pages | [/…/therapiegebiete/cvrm/acutecare](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/acutecare.html)<br>[/…/therapiegebiete/onkologie/brustkrebs](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/onkologie/brustkrebs.html)<br>[/…/therapiegebiete/cvrm/acutecare](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/acutecare.html) |

![unknown v_8630772c9b24](../catalog/.pages/www_myastrazeneca_ch_en_startseite_therapiegebiete_cvrm_acutecare_html--d422dc19/blocks/c1b82f0.jpg)

### D.23 unknown: `v_065eb1d0161c`

| Field | Value |
|---|---|
| Detected type | unknown |
| Structure | 2 images |
| Pages using it | 17 |
| Templates | campaign-subpage (9), content-landing (6), campaign-landing (2) |
| EDS block today | none yet |
| Example pages | [/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/treatement](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/treatement.html) |

![unknown v_065eb1d0161c](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_cvrm_see-the-pattrns_about-amylodosis-attr_html--6b239aec/blocks/3f3af9a1.jpg)

### D.24 unknown: `v_cc344b0787bb`

| Field | Value |
|---|---|
| Detected type | unknown |
| Structure | heading + text + 1 CTAs |
| Pages using it | 18 |
| Templates | campaign-subpage (12), campaign-landing (3), content-landing (3) |
| EDS block today | none yet |
| Example pages | [/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/home](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/home.html) |

![unknown v_cc344b0787bb](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_cvrm_see-the-pattrns_about-amylodosis-attr_html--6b239aec/blocks/57dbda4b.jpg)

### D.25 unknown: `v_bbadaab7c4b3`

| Field | Value |
|---|---|
| Detected type | unknown |
| Structure | heading + text + 4 images |
| Pages using it | 13 |
| Templates | campaign-subpage (10), campaign-landing (3) |
| EDS block today | none yet |
| Example pages | [/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/home](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/home.html) |

![unknown v_bbadaab7c4b3](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_cvrm_see-the-pattrns_about-amylodosis-attr_html--6b239aec/blocks/3f3af963.jpg)

### D.26 unknown: `v_7edce974c28a`

| Field | Value |
|---|---|
| Detected type | unknown |
| Structure | heading + text + 1 CTAs |
| Pages using it | 4 |
| Templates | content-landing (4) |
| EDS block today | none yet |
| Example pages | [/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/ri/copd.html)<br>[/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/ri/copd.html)<br>[/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/ri/copd.html) |

![unknown v_7edce974c28a](../catalog/.pages/www_myastrazeneca_ch_en_startseite_therapiegebiete_ri_copd_html--03db88aa/blocks/f1d8370.jpg)

### D.27 unknown: `v_86957572c961`

| Field | Value |
|---|---|
| Detected type | unknown |
| Structure | 1 CTAs |
| Pages using it | 6 |
| Templates | campaign-subpage (6) |
| EDS block today | none yet |
| Example pages | [/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/symptomes](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/symptomes.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html) |

![unknown v_86957572c961](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_cvrm_see-the-pattrns_diagnosis_html--6940e0d5/blocks/4d4bfda9.jpg)

### D.28 unknown: `v_ed6c5d348ec9`

| Field | Value |
|---|---|
| Detected type | unknown |
| Structure | text + image |
| Pages using it | 2 |
| Templates | content-landing (2) |
| EDS block today | none yet |
| Example pages | [/…/therapiegebiete/cvrm/acutecare](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/acutecare.html)<br>[/…/therapiegebiete/cvrm/acutecare](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/acutecare.html) |

![unknown v_ed6c5d348ec9](../catalog/.pages/www_myastrazeneca_ch_en_startseite_therapiegebiete_cvrm_acutecare_html--d422dc19/blocks/62b4caac.jpg)

### D.29 unknown: `v_7d7a8d636759`

| Field | Value |
|---|---|
| Detected type | unknown |
| Structure | heading + 2 images |
| Pages using it | 4 |
| Templates | campaign-subpage (3), campaign-landing (1) |
| EDS block today | none yet |
| Example pages | [/…/therapiegebiete/cvrm/see-the-pattrns/home](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/home.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/symptomes](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/symptomes.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/symptomes](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/symptomes.html) |

![unknown v_7d7a8d636759](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_cvrm_see-the-pattrns_home_html--7fa80632/blocks/1a20676c.jpg)

### D.30 unknown: `v_d41301689a41`

| Field | Value |
|---|---|
| Detected type | unknown |
| Structure | 2 CTAs + list |
| Pages using it | 4 |
| Templates | content-landing (4) |
| EDS block today | none yet |
| Example pages | [/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/ri/copd.html)<br>[/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/ri/copd.html)<br>[/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/ri/copd.html) |

![unknown v_d41301689a41](../catalog/.pages/www_myastrazeneca_ch_en_startseite_therapiegebiete_ri_copd_html--03db88aa/blocks/29c72514.jpg)

### D.31 unknown: `v_2bed43c59a16`

| Field | Value |
|---|---|
| Detected type | unknown |
| Structure | text + 1 CTAs |
| Pages using it | 3 |
| Templates | campaign-subpage (3) |
| EDS block today | none yet |
| Example pages | [/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html) |

![unknown v_2bed43c59a16](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_cvrm_see-the-pattrns_diagnosis_html--6940e0d5/blocks/5c339a90.jpg)

### D.32 unknown: `v_5a31a8c89674`

| Field | Value |
|---|---|
| Detected type | unknown |
| Structure | text + 4 images |
| Pages using it | 3 |
| Templates | campaign-subpage (3) |
| EDS block today | none yet |
| Example pages | [/…/therapiegebiete/cvrm/see-the-pattrns/symptomes](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/symptomes.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/symptomes](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/symptomes.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/symptomes](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/see-the-pattrns/symptomes.html) |

![unknown v_5a31a8c89674](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_cvrm_see-the-pattrns_symptomes_html--4eba725c/blocks/4f9aa4f0.jpg)

### D.33 unknown: `v_617324728993`

| Field | Value |
|---|---|
| Detected type | unknown |
| Structure | heading + text + 2 images |
| Pages using it | 3 |
| Templates | product-overview (3) |
| EDS block today | none yet |
| Example pages | [/…/produkte](https://www.myastrazeneca.ch/en/startseite/produkte.html)<br>[/…/produkte](https://www.myastrazeneca.ch/de/startseite/produkte.html)<br>[/…/produkte](https://www.myastrazeneca.ch/it/startseite/produkte.html) |

![unknown v_617324728993](../catalog/.pages/www_myastrazeneca_ch_en_startseite_produkte_html--96d99f3e/blocks/3f191256.jpg)

### D.34 unknown: `v_b25f473963c4`

| Field | Value |
|---|---|
| Detected type | unknown |
| Structure | 1 CTAs |
| Pages using it | 3 |
| Templates | content-landing (3) |
| EDS block today | none yet |
| Example pages | [/…/therapiegebiete/onkologie/prostata](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/onkologie/prostata.html)<br>[/…/therapiegebiete/onkologie/prostata](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/onkologie/prostata.html)<br>[/…/therapiegebiete/onkologie/prostata](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/onkologie/prostata.html) |

![unknown v_b25f473963c4](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_onkologie_prostata_html--b065b3ab/blocks/2d1f153b.jpg)

### D.35 unknown: `v_bd282072e4b6`

| Field | Value |
|---|---|
| Detected type | unknown |
| Structure | heading + image |
| Pages using it | 3 |
| Templates | campaign-subpage (3) |
| EDS block today | none yet |
| Example pages | [/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html) |

![unknown v_bd282072e4b6](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_cvrm_see-the-pattrns_about-amylodosis-attr_html--6b239aec/blocks/3f3af9c0.jpg)

### D.36 unknown: `v_c602950f63c9`

| Field | Value |
|---|---|
| Detected type | unknown |
| Structure | 4 images |
| Pages using it | 3 |
| Templates | campaign-subpage (3) |
| EDS block today | none yet |
| Example pages | [/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html) |

![unknown v_c602950f63c9](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_cvrm_see-the-pattrns_about-amylodosis-attr_html--6b239aec/blocks/57dbdae6.jpg)

### D.37 unknown: `v_354e0ece5414`

| Field | Value |
|---|---|
| Detected type | unknown |
| Structure | heading + 1 CTAs |
| Pages using it | 1 |
| Templates | content-landing (1) |
| EDS block today | none yet |
| Example pages | [/…/therapiegebiete/onkologie/brustkrebs](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/onkologie/brustkrebs.html) |

![unknown v_354e0ece5414](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_onkologie_brustkrebs_html--e6e67409/blocks/227dac8a.jpg)

<!-- APPENDIX:END -->
