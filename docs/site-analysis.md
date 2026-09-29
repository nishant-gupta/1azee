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

| Template | Pages | What it is | Representative page | Locale spread |
|---|---:|---|---|---|
| **content-landing** | 48 | Hero + stacked sections. Homepage, products index, all therapy-area pages | `/en/startseite.html` | DE 13 · EN 11 · FR 11 · IT 12 · root 1 |
| **product-detail** | 33 | Hero + alternating text/media sections | `/de/startseite/produkte/trixeo/aerosphere-technologie.html` | DE 8 · FR 25 |
| **resource-detail** | 25 | Single-column document/resource page; also contact pages | `/de/startseite/contact-us.html` | DE 19 · EN 2 · FR 2 · IT 2 |
| **campaign-subpage** | 8 | See the pATTRns interior: hero + stacked feature blocks | `/de/.../see-the-pattrns/about-amylodosis-attr.html` | DE 4 · FR 2 · IT 2 |
| **campaign-landing** | 6 | See the pATTRns entry: hero + a few intro blocks | `/de/.../see-the-pattrns/home.html` | DE 1 · FR 2 · IT 3 |
| **product-overview** | 1 | Products index with tabs + a card grid | `/fr/startseite/produkte.html` | FR 1 |
| **campaign-landing-alt** | 1 | Variant of campaign-landing | `/fr/.../see-the-pattrns/home.html` | FR 1 |

### 3.1 Template grouping caveats: verify before migrating those templates

The automatic grouping looks at page structure only. In three places it probably split pages that authors would consider the same page type:

1. **Trixeo resource documents are split by language.** The 17 DE documents were grouped as *resource-detail*, while the 17 FR translations of the same documents were grouped as *product-detail*. Either the DE and FR builds really differ, or the grouping is noisy. Compare one DE/FR pair before building parsers for either template.
2. **The products index is split.** DE, EN, and IT `/produkte.html` sit in *content-landing*, but FR `/produkte.html` became its own *product-overview* template (the only page detected with tabs). Check whether the other locales also have tabs that failed to render during analysis.
3. **campaign-landing-alt** is a single FR page. It is most likely a variant of *campaign-landing*, not a separate template.

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
| breadcrumbs | 1 | 1 | Global |
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
| `accordion` | ✅ Built | oneAZ design; native `<details>` |
| `in-page-nav` | ✅ Built | oneAZ "Links" component |
| `button-group` | ✅ Built | oneAZ button groups |
| `hero`, `cards`, `columns`, `fragment` | Boilerplate | Available, not re-styled beyond the design tokens |
| `header`, `footer` | ✅ Migrated | Full 4-level megamenu (70 items); mobile drawer |
| `tabs` | ❌ Not built | Needed for the products index |
| `form` | ❌ Not built | Contact page. Consider AEM Forms tooling |
| `breadcrumbs` | ❌ Not built | Global. Could be generated from the page path |

---

## 5. Cross-site patterns and risks

1. **Cross-locale links.** The English megamenu links to **German** product pages (for example Wainzua, Trixeo, and Fasenra under `/de/...`) because EN/IT versions don't exist. The migration keeps these links as they are. Decide whether they should stay, be hidden, or point elsewhere.
2. **Uneven locale coverage.** Trixeo (25 pages) exists only in DE/FR; the campaign has no EN version. Plan migration waves per locale, not per template.
3. **Bot protection.** The source sits behind CloudFront bot protection (direct `curl` gets a 403). Imports use a saved browser snapshot, and assets must be fetched through a browser session.
4. **Personalization widgets.** "Your Speciality" / "Your Interests" only render for logged-in HCPs. They import as empty headings and need a decision (drop them, or rebuild them behind login).
5. **AEM Sites component markup.** Content is built from `cmp-teaser`, `cmp-container`, and `aem-GridColumn` wrappers. Importer selectors are keyed to classes such as `.teaser--home-hero` and `.container--3-column-wrap`. Selectors must be re-checked for each template.
6. **Regulatory content.** Every page carries a revision code (for example `Revision date 05/2026 CH-12812`) and the "healthcare professionals in Switzerland only" notice. Both must survive migration verbatim.
7. **Login-gated area.** A Login button exists; anything behind it is out of scope for this analysis.

---

## 6. Design system (oneAZ) applied

- **Tokens** from the oneAZ Figma spec are in `styles/styles.css`: the standard palette plus the AstraZeneca brand override, the responsive type scale (breakpoints at 768 and 1440 px), and the 4px spacing scale.
- **Fonts:** Lexia (headings, Regular only; bold is synthesized by the browser) and Inter (body; Regular, Medium, Bold).
- **Components:** Buttons (Primary, Secondary, Tertiary, Link, Icon-only; Medium and Small sizes; group alignment), Links / In-Page Nav, Accordion.
- **Open design question:** H4 size. The spec table says 26px and the rendered preview shows 36px. 26px is used until design confirms.

---

## 7. Open issues

| # | Issue | Impact | Status |
|---|---|---|---|
| 1 | **Images broken on the live site.** Only page HTML was uploaded to DA, not the media files, so every image on published pages is `about:error`. This includes the header/footer logo, the homepage hero, the 3 therapy cards, and the product image. | High: visible on every published page | **Open.** Upload media to DA and re-publish |
| 2 | `section-metadata` renders as visible "style / dark" text. The vendored `aem.js` in this project does not process section metadata. | Medium: visible on the homepage | Open. Fix in `scripts/scripts.js` (not `aem.js`) |
| 3 | Homepage metadata image URL is malformed (`https://content/dam/...`) | Low: social preview image | Open. Importer fix |
| 4 | Importer completeness score is 32% | None: false alarm. The metric counts cookie banner, megamenu, and footer text that is deliberately stripped | Known |
| 5 | Sidekick Library panel is not visible in the DA editor | Authors can't browse blocks yet | Needs the Library plugin enabled in the project config at tools.aem.live |
| 6 | Template grouping ambiguities (Section 3.1) | Could cause duplicate parsers | Verify before migrating those templates |
| 7 | `tabs`, `form`, `breadcrumbs` blocks not built | Blocks the products index and contact pages | Pending |

---

## 8. Recommended next steps

1. **Fix live images (issue 1).** This is a prerequisite for anything else looking right.
2. Fix the section-metadata rendering (issue 2).
3. Resolve the template caveats in Section 3.1, then migrate **content-landing** across all 4 locales. At 48 pages it gives the widest coverage, and all of its blocks already exist.
4. Build `tabs`, then migrate the products index. Decide how to handle the contact form.
5. Migrate Trixeo (*product-detail* + *resource-detail*, DE/FR, ~50 pages).
6. Migrate the See the pATTRns campaign (DE/FR/IT, 15 pages).
7. Decide on cross-locale links and personalization widgets (Section 5).

---

## 9. Where the data lives

| Artifact | Path |
|---|---|
| Visual report (page screenshots grouped by template) | `catalog/template-catalog-report-bundle.zip` → `template-catalog-report.html` |
| Template catalog | `catalog/template-catalog.json` |
| Block catalog | `catalog/block-catalog.json` |
| URL inventory / grouping | `catalog/urls-all.json`, `catalog/urls-grouped.json` |
| Full-site import templates | `tools/importer/page-templates.full-catalog.json` |
| Homepage page analysis | `migration-work/authoring-analysis.json`, `migration-work/page-structure.json` |
| Block library (DA) | `/tools/sidekick/library.json`, `/block-library/blocks.json` |
