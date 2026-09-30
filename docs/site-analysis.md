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
| Block variants detected | 37 detected, 38 after splitting the catch-all → **14 EDS blocks + default content** (Section 4). 30 remain after merging 8 duplicates; 12 of those are default content. 17 discrepancies found and **applied to the catalog** (2026-09-30) |
| Source components | 21 AEM components inventoried on all 122 pages. Everything maps to a standard EDS block except In-Page Nav and Button Group (oneAZ custom) |
| Migrated so far | English homepage (`/en/startseite`), plus global header and footer |
| **Blocker** | The 50 Trixeo pages hide their content behind a login paywall; it is not in the public HTML (issue P1) |

The site is a Swiss HCP (healthcare professional) portal built on AEM Sites. The content is mostly editorial: therapy-area overviews, one product mini-site (Trixeo), and one disease-awareness campaign ("See the pATTRns"). Most pages are made of a hero and stacked text-and-image sections. Only a few pages use interactive components (tabs, accordion, forms).

**Granular detail is in the appendices at the end:**
- **A:** every page per template, with its block variants and their EDS targets.
- **B:** a reference screenshot per template.
- **C:** template × block matrices.
- **D:** every EDS block with its status, how it renders today, and each source variant with its evidence and screenshot.
- **E:** every source AEM component and its EDS treatment, with screenshots of the components the catalog missed.

Use them to review and refine the template and block groupings.

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

**Capture-quality check:** only one page (FR `/produkte.html`) was captured unstyled. Its two extra *hero* variants are artifacts of that broken capture. Its *breadcrumbs* variant is **not** an artifact: the breadcrumb is visible on every page, and the catalog only picked it up on this capture (corrected 2026-09-29, Section 4).

**Templates without blocks:** *product-detail* and *resource-detail* (50 Trixeo pages) have no catalogued blocks at all. Anonymous visitors see only a hero, the product sub-navigation and a "Register or log in" wall. The product content is not in the public HTML, so these two templates are grouped by their public shell only (issue P1).

---

## 4. Blocks

**Mapping reviewed 2026-09-29.** The source site is built from AEM Sites components. Each one names itself in the served HTML (for example `Teaser`, `Tabs`, `DynamicFormV2`), which gives an exact inventory. All 122 pages were fetched, and each of the **430 catalogued block instances was resolved in the source HTML (430 of 430 found)**, so every variant is tied to the components it is made of. The reviewed decisions are recorded in `tools/importer/block-mapping.json` and were **applied to the catalog on 2026-09-30** by `tools/da/apply-block-mapping.js`. `catalog/block-catalog.json` now carries each variant's type, block and variant class, and the placement check passes. Appendix D has the evidence and screenshots per block and variant; Appendix E has the per-component detail.

### 4.1 Source components → EDS

The AEM components used on the site, including the component list supplied for review (✔):

| Component | ✔ | Pages | EDS equivalent | Standard EDS block | Status |
|---|:---:|---:|---|---|---|
| Container | ✔ | 122 | Section + Section Metadata; 2-/3-column wraps become Cards or Columns | not a block | ✅ section metadata applied (P7 resolved) |
| Teaser | ✔ | 101 | By style: `home-hero` → Hero; image-top in a column wrap → Cards; `text-image` → Columns; plain → default content | Hero, Cards, Columns | 🟡 Hero ✅, 3-up Cards ✅, rest to build |
| Title | ✔ | 118 | Default-content headings | - | ✅ |
| Button | ✔ | 122 | Bold / italic / bold+italic links; Button Group for alignment | custom Button Group | ✅ |
| Tab | ✔ | 4 | Tabs, one section per tab (panels hold card grids) | Tabs | ❌ |
| Text | ✔ | 122 | Default content; the `in-page-nav-hr` style → In-Page Nav | - | ✅ |
| Accordion | ✔ | 4 | Accordion | Accordion | ✅ (not yet compared with source) |
| List | ✔ | 31 | Horizontal section sub-nav (campaign, Trixeo) → In-Page Nav, horizontal option | custom In-Page Nav | ❌ horizontal option |
| Form Container | ✔ | 4 | Same element as Dynamic Form V2 | Form | ❌ |
| Dynamic Form V2 | ✔ | 4 | Form; fields and submission come from an AstraZeneca form service | Form | ❌ backend decision (P5) |
| Mega Menu | ✔ | 122 | Header, fed from `/nav` | Header | ✅ |
| Search | ✔ | 122 | Search block + query index (field already in the header) | Search | ❌ |
| Embed | ✔ | 3 | Embed with a Kaltura handler (source "Video" component) | Embed | ❌ |
| Master Content List | ✔ | 4 | **Drop**: empty for anonymous visitors (no items or config in the served HTML) | - | confirm (P9) |
| Breadcrumb | | 122 | Breadcrumbs, visible on every page | Breadcrumbs | ❌ |
| Self-certification | | 15 | HCP / patient interstitial on campaign pages → Modal | Modal | ❌ |
| Content Paywall | | 50 | **Blocked**: Trixeo content is behind login, not in public HTML | - | ⛔ (P1) |
| Social Features | | 98 | **Drop**: login-only bookmarking, empty placeholders | - | - |
| Image, Experience Fragment, User (Login) | | 122 | Default-content image (keep one rendition); nav/footer fragments; header login | - | ✅ |

### 4.2 Catalog variants → EDS blocks

The 37 detected variants (38 after the catch-all split) map to 11 EDS blocks plus default content. Button Group, Modal and Search come from components the catalog doesn't treat as blocks, which makes **14 EDS blocks** in total. All are standard EDS blocks except In-Page Nav and Button Group (oneAZ custom).

| EDS target | Standard block | Variants (after merging) | Pages | Status | Options still to build |
|---|---|---:|---:|---|---|
| Hero (`hero-minimal-dark-withimg`) | Hero | 6 (3) | 63 | ✅ built | `centered`; `campaign-banner` (image only) |
| Cards (`cards-light-withimg`) | Cards | 5 (4) | 63 | 🟡 3-up image cards built | 2-up icon cards (`icon`); bordered text cards (`bordered`); product cards with hover overlay (`product`) |
| Columns | Columns | 3 | 44 | 🟡 boilerplate only | text beside image (default); two images (`images`) |
| Tabs | Tabs | 3 (1) | 4 | ❌ | |
| Form | Form | 3 (1) | 4 | ❌ | |
| Embed | Embed | 1 | 3 | ❌ | Kaltura handler |
| Accordion | Accordion | 1 | 4 | ✅ built | compare with source |
| In-Page Nav | custom | 1 | 4 | ✅ vertical built | horizontal sub-nav (List component, 31 pages) |
| Breadcrumbs | Breadcrumbs | 1 | 122 (all) | ❌ | |
| Header, Footer | Header, Footer | 1 each | all | ✅ built | |
| Default content | no block | 12 | 28 | ✅ | centered section style (section metadata `style`). Kept as type `unknown` in the catalog, so the block generator skips them |

Many image counts come in pairs because AEM renders a desktop and a mobile image for each visual. Migration keeps **one** image per visual.

### 4.3 Discrepancies found in the catalog

17 of the 37 detected variants were flagged (⚠️ in Appendix D). **All are now applied to the catalog** (2026-09-30):

| Kind | Variants | Finding |
|---|---|---|
| Real block detected as "unknown" | `v_5d7c92bb4412`, `v_bbadaab7c4b3`, `v_5a31a8c89674` (Cards); `v_6defe37a8d19`, `v_c602950f63c9` (Columns); `v_d41301689a41` (In-Page Nav); `v_bd282072e4b6` (Embed: the video was only a poster image in the capture) | The detector only names blocks it recognises; AEM teasers in column wraps weren't recognised |
| Wrong type | `v_f90804d73a13` detected as columns → product **cards** (they sit inside the tab panels); `v_b1e664af6109` detected as hero → heading + image (default content) | |
| Catch-all | `v_37fdc84c086b` (133 uses, 40 pages) | 130 uses are text-image teasers (Columns; 50 of them sit beside a Text component). 3 uses, the same section of *About ATTR amyloidosis* in DE/FR/IT, have no teaser: **split off** as default-content variant `v_37fdc84c086b-text` |
| Duplicates | Hero `v_2ab6094d0f33` → `v_b26d6cceada2`; Cards `v_5a31a8c89674` → `v_bbadaab7c4b3`; Tabs `-1`, `-2` → `v_8ab7ece34e9a`; Form `v_c8843a7f9ec8`, `v_181661dda160` → `v_6e8c2538dd7e` | Same component and style; split by locale or layout noise. Merged by giving them the same block and class, so each group is built once |
| Capture artifacts | Hero `v_42845b3e07dd`, `v_228f16fbc166` (unstyled FR `/produkte.html`) | Merge; re-capture the page |
| Under-captured | Breadcrumbs `v_f88e29f32a0c` (found on 1 page, present on 122); List sub-nav (23 of 31 uses outside any block); Self-certification, Master Content List, Social Features, Content Paywall (not catalogued) | The catalog skips site chrome, modals and components that render empty or behind login |
| Templates with no blocks | product-detail (16), resource-detail (34) | Content is behind the login paywall (P1) |

### 4.4 Block library status

| Block | Status | Notes |
|---|---|---|
| `hero-minimal-dark-withimg` | ✅ Built | Default dark hero. Add *centered* and *campaign banner* options |
| `cards-light-withimg` | 🟡 Partly built | 3-up therapy grid. Add 2-up icon, bordered text and product (hover) options |
| `accordion` | ✅ Built | oneAZ design; native `<details>`. Not yet compared with source variant `v_4ecd3661fdd5` |
| `in-page-nav` | ✅ Built (vertical) | oneAZ "Links"; implements `v_d41301689a41`. Horizontal sub-nav option needed for the List component |
| `button-group` | ✅ Built | Options `align-left` / `align-center` / `align-right` / `small`; a plain link in a group is the Link variant |
| `table` | ✅ Built | Data tables, used by this report |
| `header`, `footer` | ✅ Migrated | Full 4-level megamenu (70 items); mobile drawer. Breadcrumbs not included yet |
| `columns` | 🟡 Boilerplate | Needs styling to the source (text beside image, two images) |
| `tabs` | ❌ Not built | Products index. Sections-based, because DA blocks can't nest cards inside tabs |
| `form` | ❌ Not built | Contact page (P5) |
| `embed` | ❌ Not built | Kaltura videos on 3 campaign pages |
| `breadcrumbs` | ❌ Not built | Every page. Generate from the page path |
| `modal` | ❌ Not built | HCP self-certification on the 15 campaign pages |
| `search` | ❌ Not built | Needs a query index |
| `hero`, `cards`, `fragment` | Boilerplate | Available; the styled variants above are used instead |

---

## 5. Cross-site patterns and risks

1. **Cross-locale links.** The English megamenu links to **German** product pages (for example Wainzua, Trixeo, and Fasenra under `/de/...`) because EN/IT versions don't exist. The migration keeps these links as they are. Decide whether they should stay, be hidden, or point elsewhere.
2. **Uneven locale coverage.** Trixeo (50 pages: 25 each in DE and FR) exists only in those two locales; the campaign has no EN version. Plan migration waves per locale, not per template.
3. **Bot protection.** The source sits behind CloudFront bot protection. During the first analysis a direct `curl` got a 403, so imports use a saved browser snapshot. On 2026-09-29 all 122 pages fetched fine with a browser user agent, one at a time; assets should still be fetched through a browser session.
4. **Personalization and login-only widgets.** "Your Speciality" / "Your Interests", the Master Content List (4 homepages) and Social Features (bookmarking, 98 pages) only render for logged-in HCPs. Anonymous visitors get empty headings or placeholders. They need a decision: drop them, or rebuild them behind login.
5. **AEM Sites component markup.** Content is built from `cmp-teaser`, `cmp-container`, and `aem-GridColumn` wrappers. Importer selectors are keyed to classes such as `.teaser--home-hero` and `.container--3-column-wrap`. Selectors must be re-checked for each template.
6. **Regulatory content.** Every page carries a revision code (for example `Revision date 05/2026 CH-12812`) and the "healthcare professionals in Switzerland only" notice. Both must survive migration verbatim.
7. **Login-gated content.** All 50 Trixeo pages (product-detail, resource-detail) show a "Register or log in" wall. The content behind it is not in the public HTML, so it can't be analysed or imported from the public site (P1).
8. **HCP self-certification.** The 15 campaign pages open with an "I am a healthcare professional / I am a patient" interstitial. It is a compliance control and must be kept (Modal).

---

## 6. Design system (oneAZ) applied

- **Tokens** from the oneAZ Figma spec are in `styles/styles.css`: the standard palette plus the AstraZeneca brand override, the responsive type scale (breakpoints at 768 and 1440 px), and the 4px spacing scale.
- **Fonts:** Lexia (headings, Regular only; bold is synthesized by the browser) and Inter (body; Regular, Medium, Bold).
- **Components:** Buttons (Primary, Secondary, Tertiary, Link, Icon-only; Medium and Small sizes; group alignment), Links / In-Page Nav, Accordion, Table. Authoring for each is documented in the block's `README.md`. Icon-only has CSS but no Document Authoring syntax yet.
- **Open design question:** H4 size. The spec table says 26px and the rendered preview shows 36px. 26px is used until design confirms.

---

## 7. Open issues and discrepancies

### 7.1 Pending

Ordered by impact. P-numbers are referenced from Section 4 and Appendices D–E.

| # | Issue / discrepancy | Impact | Needs |
|---|---|---|---|
| P1 | **Trixeo content is behind a login paywall.** The 50 product-detail and resource-detail pages show only a hero, the product sub-nav and "Register or log in". The product content is not in the public HTML, so the catalog found no blocks there and these templates are grouped by their public shell only | **Blocker** for 50 of 122 pages | Decision: an export from the current AEM, a capture made with an HCP login, or defer Trixeo. Then re-analyse both templates |
| P2 | *Resolved 2026-09-30: the reviewed block mapping is applied to the catalog (see 7.2)* | | |
| P3 | **Blocks to build:** Tabs, Form, Embed (Kaltura), Breadcrumbs, Modal (self-certification), Search; Columns styling; options for Hero (centered, campaign banner), Cards (2-up icon, bordered, product with hover) and In-Page Nav (horizontal sub-nav) | Blocks every template except the homepage wave | Build per template wave (Section 8) |
| P4 | **Breadcrumbs missing from the migrated pages.** They are visible under the header on all 122 source pages. The catalog only caught them on one capture, and the earlier report wrongly called them an artifact | Visible gap on every page | Breadcrumbs block from the page path (part of P3) |
| P5 | **Contact form backend.** Dynamic Form V2 builds its fields client-side from an AstraZeneca form service (a form id per locale) and posts there | Contact template (4 pages) | Decision: keep posting to the AZ service, or use an EDS / AEM Forms submission |
| P6 | **Tabs can't hold nested blocks in DA.** The products-index tab panels contain product card grids | Tabs design | Build tabs from sections (one section per tab) |
| P7 | *Resolved 2026-09-30: section metadata is applied and hidden (see 7.2)* | | |
| P8 | **HCP self-certification** (15 campaign pages) is a compliance control | Campaign wave | Requirements: where the "I am a patient" choice leads, and how long the choice is remembered (the source sets `data-expiry-time="120"`; the unit is unconfirmed) |
| P9 | **Login-only widgets render empty:** Master Content List (4 homepages), Social Features (98 pages), "Your Speciality" / "Your Interests" | Empty headings or placeholders if imported | Confirm drop (or rebuild behind login) |
| P10 | FR `/produkte.html` was captured unstyled (source of 2 artifact variants) | product-overview analysis | Re-capture before migrating product-overview |
| P11 | Accordion was built from the oneAZ spec and not yet compared with source variant `v_4ecd3661fdd5` | Possible visual mismatch on 4 pages | Visual critique against the source |
| P12 | Homepage metadata image URL is malformed (`https://content/dam/...`) | Low: social preview image | Importer fix |
| P13 | Sidekick Library panel is not visible in the DA editor | Authors can't browse blocks yet | Enable the Library plugin in the project config at tools.aem.live |
| P14 | Cross-locale links: the EN megamenu links to DE product pages (Section 5.1); dead sitemap links are still linked from the nav and homepage (Section 2.2) | Navigation quality | Content decision |
| P15 | Design questions: H4 size (spec 26px vs preview 36px); Icon-only button has CSS but no DA authoring syntax | Low | Design confirmation |

### 7.2 Resolved

| # | Issue | Resolution |
|---|---|---|
| 1 | Images broken on the live site: only page HTML had been uploaded to DA, so every image was `about:error` | **Fixed (2026-09-29).** Media is uploaded to DA and every image is verified on each publish. The source's own product-info image is dead (404), so it was dropped. Header/footer logos in local preview are fixed too |
| 2 | `accordion`, `in-page-nav`, `table` code was only on a feature branch | PR #1 merged to `main` |
| 2a | Wrong variant mapping: `cards-light-withimg` declared `v_f2575cbf84b3` instead of `v_5d7c92bb4412` | Fixed in `blocks/cards-light-withimg/metadata.json` |
| 5 | Importer completeness score is 32% | False alarm: the metric counts cookie banner, megamenu and footer text that is deliberately stripped |
| 7 | Template misgroupings: 21 of 46 translated-page groups split across templates | 33 pages regrouped, 0 splits remain (Section 3.1) |
| 9 | Button-group and in-page-nav demos broken live: DA strips class attributes and keeps only block tables | Demos rewritten as block tables; `button-group` supports `small` and plain links as the Link variant |
| 10 | Report and catalog fixes on unmerged branches | PRs #2–#5 merged; `main` has all code and tooling |
| 11 | Block mapping: 19 variants unmapped, and the supplied AEM component list not yet assessed | **Mapped (2026-09-29)** from source evidence: Section 4, Appendices D–E |
| P7 | `section-metadata` rendered as visible "style / dark" text wherever a page is rendered from the document (local preview, workspace view). The vendored `aem.js` `decorateSections` does not read it, so it was decorated as a missing block. Published pages were not affected: the server applies it | **Fixed (2026-09-30)** in `scripts/scripts.js` (`decorateSectionMetadata`: `style` values become section classes, other rows data attributes, the table is removed), plus a CSS guard in `styles/styles.css` that always hides `.section-metadata` |
| P2 | Catalog still had the raw detection: 17 flagged variants (wrong or "unknown" types, duplicates, artifacts, a catch-all) | **Applied (2026-09-30)** with `tools/da/apply-block-mapping.js`: 41 type/block/class changes in `catalog/block-catalog.json`, catch-all split (3 page records re-stamped), placement check passes. Backup in `migration-work/da-publish/archive/`. Re-run the script after any catalog rebuild |

---

## 8. Recommended next steps

1. **Decide how to source the Trixeo content** (P1). This decides the scope of 50 pages.
2. ~~Apply the block mapping to the catalog (P2)~~ Done 2026-09-30. Next: generate the missing block variants from the catalog (P3). The generator builds each variant's block and class as the catalog now says.
3. Add Breadcrumbs (P4); it affects every page. (Section metadata, P7, is fixed.)
4. Migrate **content-landing** across all 4 locales (49 pages): Hero ✅, 3-up Cards ✅, plus Columns styling, Accordion check (P11) and In-Page Nav. The 4 breast cancer pages need extra handling (no hero, key-figures cards).
5. Build Tabs (sections-based, P6) and the product Cards option; re-capture FR `/produkte.html` (P10); migrate **product-overview**.
6. Migrate the See the pATTRns campaign (DE/FR/IT, 15 pages): Modal for self-certification (P8), horizontal In-Page Nav, 2-up icon Cards, Kaltura Embed, campaign Hero banner.
7. Decide the contact form backend (P5) and migrate **contact** (4 pages).
8. Migrate Trixeo once P1 is resolved.
9. Content decisions: login-only widgets (P9), cross-locale and dead links (P14).

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
| **Block mapping (reviewed decisions)** | `tools/importer/block-mapping.json`: EDS target, option, class, merge, split and discrepancy per variant; treatment per source component. Applied to `catalog/block-catalog.json` by `tools/da/apply-block-mapping.js` (idempotent; `--dry-run`) |
| Source component inventory | `catalog/source-components.json`, built by `tools/da/inventory-source-components.js` (fetched source pages are cached in `migration-work/da-publish/src-pages/`) |
| Component and EDS block screenshots | `catalog/component-shots/`, taken by `tools/da/capture-component-shots.js` (source components on the live site, EDS blocks on their demo pages) |
| Migration plan and status | `.migration/plans/myastrazeneca-template-discovery.md` |

<!-- APPENDIX:START (generated by tools/da/build-site-analysis.js; do not edit by hand) -->

---

## Appendix A: Every page, by template

Each row is one analyzed page with the block variants detected on it and the EDS target each maps to (→). Look up any variant ID in Appendix D to see its screenshot and details. Use this to check whether each page really belongs in its template.

### A.1 content-landing (49 pages)

*Homepage and therapy-area pages: optional hero, intro copy, therapy card grids, text and image sections.*

| # | Locale | Section | Page title | Block variants on the page | URL |
|---:|---|---|---|---|---|
| 1 | - | Homepage | Startseite \| MyAstraZeneca | `v_5d7c92bb4412` → Cards, `v_6defe37a8d19` → Columns | [/…/](https://www.myastrazeneca.ch/) |
| 2 | DE | Homepage | Startseite \| MyAstraZeneca | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_6defe37a8d19` → Columns | [/de/startseite](https://www.myastrazeneca.ch/de/startseite.html) |
| 3 | DE | Therapy area | Acute Care | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_ed6c5d348ec9` → Default content, `v_37fdc84c086b` → Columns, `v_8630772c9b24` → Default content, `v_6defe37a8d19` → Columns | [/…/therapiegebiete/cvrm/acutecare](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/acutecare.html) |
| 4 | DE | Therapy area | Chronische Niereninsuffizienz - Symptome, Diagnose und Behandlung | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_6defe37a8d19` → Columns | [/…/therapiegebiete/cvrm/chronischeniereninsuffizienz](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/chronischeniereninsuffizienz.html) |
| 5 | DE | Therapy area | Diabetes | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_6defe37a8d19` → Columns | [/…/therapiegebiete/cvrm/diabetes](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/diabetes.html) |
| 6 | DE | Therapy area | Herzinsuffizienz - Symptome, Diagnose und Behandlung | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_6defe37a8d19` → Columns | [/…/therapiegebiete/cvrm/herzinsuffizienz](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/herzinsuffizienz.html) |
| 7 | DE | Therapy area | Brustkrebs | `v_5d7c92bb4412` → Cards, `v_8630772c9b24` → Default content, `v_354e0ece5414` → Default content | [/…/therapiegebiete/onkologie/brustkrebs](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/onkologie/brustkrebs.html) |
| 8 | DE | Therapy area | Eierstockkrebs - Symptome, Diagnose und Behandlung | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_6defe37a8d19` → Columns | [/…/therapiegebiete/onkologie/eierstockkrebs](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/onkologie/eierstockkrebs.html) |
| 9 | DE | Therapy area | Hämatologie - Symptome, Diagnose und Behandlung | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_6defe37a8d19` → Columns | [/…/therapiegebiete/onkologie/haematologie](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/onkologie/haematologie.html) |
| 10 | DE | Therapy area | Lungenkrebs - Symptome, Diagnose und Behandlung | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_6defe37a8d19` → Columns | [/…/therapiegebiete/onkologie/lungenkrebs](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/onkologie/lungenkrebs.html) |
| 11 | DE | Therapy area | Prostata-Gesundheitsinformationen & Leitfaden zum Herunterladen \| MyAstraZeneca | `v_2ab6094d0f33` → Hero, `v_b25f473963c4` → Default content, `v_065eb1d0161c` → Default content, `v_cc344b0787bb` → Default content | [/…/therapiegebiete/onkologie/prostata](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/onkologie/prostata.html) |
| 12 | DE | Therapy area | Asthma - Symptome, Diagnose und Behandlung | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_6defe37a8d19` → Columns | [/…/therapiegebiete/ri/asthma](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/ri/asthma.html) |
| 13 | DE | Therapy area | COPD - Symptome, Diagnose und Behandlung | `v_b26d6cceada2` → Hero, `v_d41301689a41` → In-Page Nav, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_7edce974c28a` → Default content, `v_065eb1d0161c` → Default content, `v_4ecd3661fdd5` → Accordion | [/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/ri/copd.html) |
| 14 | DE | Therapy area | Systemischer Lupus Erythematodes - Symptome, Diagnose und Behandlung | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_6defe37a8d19` → Columns | [/…/therapiegebiete/ri/lupus](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/ri/lupus.html) |
| 15 | EN | Homepage | Home \| MyAstraZeneca | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards | [/en/startseite](https://www.myastrazeneca.ch/en/startseite.html) |
| 16 | EN | Therapy area | Acute Care | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_ed6c5d348ec9` → Default content, `v_37fdc84c086b` → Columns, `v_8630772c9b24` → Default content, `v_6defe37a8d19` → Columns | [/…/therapiegebiete/cvrm/acutecare](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/acutecare.html) |
| 17 | EN | Therapy area | Chronic Kidney Disease (CKD) - Symptoms, Diagnosis & Treatment | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns | [/…/therapiegebiete/cvrm/chronischeniereninsuffizienz](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/chronischeniereninsuffizienz.html) |
| 18 | EN | Therapy area | Diabetes | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns | [/…/therapiegebiete/cvrm/diabetes](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/diabetes.html) |
| 19 | EN | Therapy area | Heart Failure Overview: Symptoms & Treatment | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns | [/…/therapiegebiete/cvrm/herzinsuffizienz](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/herzinsuffizienz.html) |
| 20 | EN | Therapy area | Breast Cancer Overview: Causes, Symptoms & Therapy | `v_5d7c92bb4412` → Cards, `v_8630772c9b24` → Default content | [/…/therapiegebiete/onkologie/brustkrebs](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/onkologie/brustkrebs.html) |
| 21 | EN | Therapy area | Ovarian Cancer Overview: Symptoms & Treatment | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns | [/…/therapiegebiete/onkologie/eierstockkrebs](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/onkologie/eierstockkrebs.html) |
| 22 | EN | Therapy area | Lung Cancer: Symptoms, Stages & Treatment | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns | [/…/therapiegebiete/onkologie/lungenkrebs](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/onkologie/lungenkrebs.html) |
| 23 | EN | Therapy area | Asthma – Advances in Diagnosis and Care | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns | [/…/therapiegebiete/ri/asthma](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/ri/asthma.html) |
| 24 | EN | Therapy area | COPD - Symptoms, diagnosis and treatment | `v_b26d6cceada2` → Hero, `v_d41301689a41` → In-Page Nav, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_7edce974c28a` → Default content, `v_4ecd3661fdd5` → Accordion | [/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/ri/copd.html) |
| 25 | EN | Therapy area | Lupus Insights and Treatment Guidance – For HCPs | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns | [/…/therapiegebiete/ri/lupus](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/ri/lupus.html) |
| 26 | FR | Homepage | Traitements du diabète, de l’asthme, de la BPCO et du cancer \| MyAstraZeneca | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_6defe37a8d19` → Columns | [/fr/startseite](https://www.myastrazeneca.ch/fr/startseite.html) |
| 27 | FR | Therapy area | Insuffisance Rénale Chronique (IRC) Informations - MyAstrazeneca | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_6defe37a8d19` → Columns | [/…/therapiegebiete/cvrm/chronischeniereninsuffizienz](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/chronischeniereninsuffizienz.html) |
| 28 | FR | Therapy area | Symptômes, Diagnostic et Traitement du Diabète Sucré \| MyAstraZeneca | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_6defe37a8d19` → Columns | [/…/therapiegebiete/cvrm/diabetes](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/diabetes.html) |
| 29 | FR | Therapy area | Insuffisance Cardiaque : Symptômes, Diagnostic et Traitement \| MyAstraZeneca | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_6defe37a8d19` → Columns | [/…/therapiegebiete/cvrm/herzinsuffizienz](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/herzinsuffizienz.html) |
| 30 | FR | Therapy area | Cancer Du Sein – Dépistage, Tumeurs Mammaires et Traitements \| MyAstraZeneca | `v_5d7c92bb4412` → Cards, `v_8630772c9b24` → Default content | [/…/therapiegebiete/onkologie/brustkrebs](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/onkologie/brustkrebs.html) |
| 31 | FR | Therapy area | Cancer de l’Ovaire – Carcinome épithélial, symptômes & prise en charge \| MyAstraZeneca | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_6defe37a8d19` → Columns | [/…/therapiegebiete/onkologie/eierstockkrebs](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/onkologie/eierstockkrebs.html) |
| 32 | FR | Therapy area | Hématologie - Leucémie Lymphoïde Chronique, Diagnostic et Traitement \| MyAstraZeneca | `v_2ab6094d0f33` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns | [/…/therapiegebiete/onkologie/haematologie](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/onkologie/haematologie.html) |
| 33 | FR | Therapy area | Cancer du poumon: Symptômes, Diagnostic et Traitements \| MyAstraZeneca | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_6defe37a8d19` → Columns | [/…/therapiegebiete/onkologie/lungenkrebs](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/onkologie/lungenkrebs.html) |
| 34 | FR | Therapy area | Prostate: Comprendre son importance et les troubles associés \| MyAstraZeneca | `v_2ab6094d0f33` → Hero, `v_b25f473963c4` → Default content, `v_065eb1d0161c` → Default content, `v_cc344b0787bb` → Default content | [/…/therapiegebiete/onkologie/prostata](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/onkologie/prostata.html) |
| 35 | FR | Therapy area | Asthme: Symptômes, Diagnostic et Traitements \| MyAstraZeneca | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_6defe37a8d19` → Columns | [/…/therapiegebiete/ri/asthma](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/ri/asthma.html) |
| 36 | FR | Therapy area | BPCO - Symptômes, diagnostic et prise en charge | `v_b26d6cceada2` → Hero, `v_d41301689a41` → In-Page Nav, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_7edce974c28a` → Default content, `v_065eb1d0161c` → Default content, `v_4ecd3661fdd5` → Accordion | [/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/ri/copd.html) |
| 37 | FR | Therapy area | Lupus Érythémateux Systémique: Symptômes, Diagnostic et Traitement \| MyAstraZeneca | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_6defe37a8d19` → Columns | [/…/therapiegebiete/ri/lupus](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/ri/lupus.html) |
| 38 | IT | Homepage | Portale informativo per gli operatori sanitari \| MyAstraZeneca | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_6defe37a8d19` → Columns | [/it/startseite](https://www.myastrazeneca.ch/it/startseite.html) |
| 39 | IT | Therapy area | Comprendere l'insufficienza renale cronica \| AstraZeneca | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_6defe37a8d19` → Columns | [/…/therapiegebiete/cvrm/chronischeniereninsuffizienz](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/chronischeniereninsuffizienz.html) |
| 40 | IT | Therapy area | Informazioni chiave sul diabete mellito | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_6defe37a8d19` → Columns | [/…/therapiegebiete/cvrm/diabetes](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/diabetes.html) |
| 41 | IT | Therapy area | Insufficienza Cardiaca Cronica: Sintomi, Diagnosi, E Trattamento \| AstraZeneca | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_6defe37a8d19` → Columns | [/…/therapiegebiete/cvrm/herzinsuffizienz](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/herzinsuffizienz.html) |
| 42 | IT | Therapy area | Cancro Al Seno: Sintomi, Diagnosi, E Trattamento \| AstraZeneca | `v_5d7c92bb4412` → Cards, `v_8630772c9b24` → Default content | [/…/therapiegebiete/onkologie/brustkrebs](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/onkologie/brustkrebs.html) |
| 43 | IT | Therapy area | Cancro alle ovaie: Sintomi, Diagnosi, e Trattamento \| AstraZeneca | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_6defe37a8d19` → Columns | [/…/therapiegebiete/onkologie/eierstockkrebs](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/onkologie/eierstockkrebs.html) |
| 44 | IT | Therapy area | Leucemia linfocitica cronica (LLC) in ematologia: sintomi, diagnosi e trattamento \| AstraZeneca | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_6defe37a8d19` → Columns | [/…/therapiegebiete/onkologie/haematologie](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/onkologie/haematologie.html) |
| 45 | IT | Therapy area | Cancro del polmone: Sintomi, Diagnosi, e Trattamento \| AstraZeneca | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_6defe37a8d19` → Columns | [/…/therapiegebiete/onkologie/lungenkrebs](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/onkologie/lungenkrebs.html) |
| 46 | IT | Therapy area | Prostata: Comprendere la sua importanza e i disturbi associati \| MyAstraZeneca | `v_2ab6094d0f33` → Hero, `v_b25f473963c4` → Default content, `v_065eb1d0161c` → Default content, `v_cc344b0787bb` → Default content | [/…/therapiegebiete/onkologie/prostata](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/onkologie/prostata.html) |
| 47 | IT | Therapy area | Asma | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_6defe37a8d19` → Columns | [/…/therapiegebiete/ri/asthma](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/ri/asthma.html) |
| 48 | IT | Therapy area | BPCO - Sintomi, diagnosi e trattamento | `v_b26d6cceada2` → Hero, `v_d41301689a41` → In-Page Nav, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_7edce974c28a` → Default content, `v_065eb1d0161c` → Default content, `v_4ecd3661fdd5` → Accordion | [/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/ri/copd.html) |
| 49 | IT | Therapy area | Lupus | `v_b26d6cceada2` → Hero, `v_5d7c92bb4412` → Cards, `v_37fdc84c086b` → Columns, `v_6defe37a8d19` → Columns | [/…/therapiegebiete/ri/lupus](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/ri/lupus.html) |

### A.2 resource-detail (34 pages)

*Trixeo resource document page: breadcrumb, share icons, title, short paragraphs, revision code.*

| # | Locale | Section | Page title | Block variants on the page | URL |
|---:|---|---|---|---|---|
| 1 | DE | Trixeo resource doc | Dreifachtherapie und kardiopulmonale Risikofaktoren \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/3-molekuele-der-dreifachtherapie-gegen-kardiopulmonales-risiko-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/3-molekuele-der-dreifachtherapie-gegen-kardiopulmonales-risiko-de.html) |
| 2 | DE | Trixeo resource doc | TRIXEO Aerosphere® Anwendungsbroschüre \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/anwendungsbroschuere-trixeo-aerosphere-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/anwendungsbroschuere-trixeo-aerosphere-de.html) |
| 3 | DE | Trixeo resource doc | Anwendung von TRIXEO Aerosphere®, Symbicort® & Vannair® \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/anwendungskarte-trixeo-aerosphere-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/anwendungskarte-trixeo-aerosphere-de.html) |
| 4 | DE | Trixeo resource doc | Checkliste für COPD-Exazerbationen \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/checkliste-fuer-copd-exazerbationen-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/checkliste-fuer-copd-exazerbationen-de.html) |
| 5 | DE | Trixeo resource doc | COPD-Datenblatt \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/copd-datenblatt-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/copd-datenblatt-de.html) |
| 6 | DE | Trixeo resource doc | COPD und Lungenkrebs \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/copd-und-lungenkrebs-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/copd-und-lungenkrebs-de.html) |
| 7 | DE | Trixeo resource doc | Die ETHOS Studie \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/ethos-studienzusammenfassung-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/ethos-studienzusammenfassung-de.html) |
| 8 | DE | Trixeo resource doc | TRIXEO Aerosphere® Fachinformation \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/fachinformation-von-trixeo-aerosphere-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/fachinformation-von-trixeo-aerosphere-de.html) |
| 9 | DE | Trixeo resource doc | Die KRONOS Studie \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/kronos-studienzusammenfassung-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/kronos-studienzusammenfassung-de.html) |
| 10 | DE | Trixeo resource doc | COPD und kardiovaskuläre Risiken \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/lunge-und-herz-ein-unzertrennliches-duo-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/lunge-und-herz-ein-unzertrennliches-duo-de.html) |
| 11 | DE | Trixeo resource doc | Patientenposter zu COPD \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/patient-poster-copd-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/patient-poster-copd-de.html) |
| 12 | DE | Trixeo resource doc | COPD-Broschüre für Ihre Patienten \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/patientenbroschure-zur-copd-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/patientenbroschure-zur-copd-de.html) |
| 13 | DE | Trixeo resource doc | Präsentation zum COPD-Management in der Praxis \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/slide-deck-copd-now-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/slide-deck-copd-now-de.html) |
| 14 | DE | Trixeo resource doc | TRIXEO Aerosphere® Technologie im Überblick \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/slide-deck-trixeo-aerosphere-technologie-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/slide-deck-trixeo-aerosphere-technologie-de.html) |
| 15 | DE | Trixeo resource doc | Die SKOPOS-MAZI-Studie \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/studienzusammenfassung-skopos-mazi-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/studienzusammenfassung-skopos-mazi-de.html) |
| 16 | DE | Trixeo resource doc | TRIXEO Aerosphere® Limitatio und Implikationen \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/trixeo-aerosphere-factsheet-zur-limitatio-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/trixeo-aerosphere-factsheet-zur-limitatio-de.html) |
| 17 | DE | Trixeo resource doc | TRIXEO Aerosphere® Krankenkassenformular \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/trixeo-aerosphere-kranken-kassenformular-de](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen/trixeo-aerosphere-kranken-kassenformular-de.html) |
| 18 | FR | Trixeo resource doc | Trithérapie et facteurs de risque cardiopulmonaires \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/3-molekuele-der-dreifachtherapie-gegen-kardiopulmonales-risiko-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/3-molekuele-der-dreifachtherapie-gegen-kardiopulmonales-risiko-fr.html) |
| 19 | FR | Trixeo resource doc | Brochure d'utilisation de TRIXEO Aerosphere® \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/anwendungsbroschuere-trixeo-aerosphere-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/anwendungsbroschuere-trixeo-aerosphere-fr.html) |
| 20 | FR | Trixeo resource doc | Utilisation de TRIXEO Aerosphere®, Symbicort® et Vannair® \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/anwendungskarte-trixeo-aerosphere-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/anwendungskarte-trixeo-aerosphere-fr.html) |
| 21 | FR | Trixeo resource doc | Check-list pour les exacerbations de la BPCO \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/checkliste-fuer-copd-exazerbationen-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/checkliste-fuer-copd-exazerbationen-fr.html) |
| 22 | FR | Trixeo resource doc | Fiche de suivi pour la BPCO pour les patients \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/copd-datenblatt-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/copd-datenblatt-fr.html) |
| 23 | FR | Trixeo resource doc | BPCO et cancer du poumon \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/copd-und-lungenkrebs-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/copd-und-lungenkrebs-fr.html) |
| 24 | FR | Trixeo resource doc | Étude ETHOS \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/ethos-studienzusammenfassung-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/ethos-studienzusammenfassung-fr.html) |
| 25 | FR | Trixeo resource doc | Information professionnelle sur TRIXEO Aerosphere® \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/fachinformation-von-trixeo-aerosphere-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/fachinformation-von-trixeo-aerosphere-fr.html) |
| 26 | FR | Trixeo resource doc | Étude KRONOS \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/kronos-studienzusammenfassung-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/kronos-studienzusammenfassung-fr.html) |
| 27 | FR | Trixeo resource doc | BPCO et risques cardiovasculaires \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/lunge-und-herz-ein-unzertrennliches-duo-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/lunge-und-herz-ein-unzertrennliches-duo-fr.html) |
| 28 | FR | Trixeo resource doc | Poster d'information BPCO pour les patients \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/patient-poster-copd-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/patient-poster-copd-fr.html) |
| 29 | FR | Trixeo resource doc | Brochure BPCO pour vos patients \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/patientenbroschure-zur-copd-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/patientenbroschure-zur-copd-fr.html) |
| 30 | FR | Trixeo resource doc | Présentation sur la prise en charge de la BPCO en pratique \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/slide-deck-copd-now-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/slide-deck-copd-now-fr.html) |
| 31 | FR | Trixeo resource doc | Aperçu de la technologie TRIXEO Aerosphere® \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/slide-deck-trixeo-aerosphere-technologie-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/slide-deck-trixeo-aerosphere-technologie-fr.html) |
| 32 | FR | Trixeo resource doc | Étude SKOPOS-MAZI \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/studienzusammenfassung-skopos-mazi-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/studienzusammenfassung-skopos-mazi-fr.html) |
| 33 | FR | Trixeo resource doc | TRIXEO Aerosphere® : Limitatio et implications \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/trixeo-aerosphere-factsheet-zur-limitatio-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/trixeo-aerosphere-factsheet-zur-limitatio-fr.html) |
| 34 | FR | Trixeo resource doc | Prise en charge TRIXEO Aerosphere® \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen/trixeo-aerosphere-kranken-kassenformular-fr](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen/trixeo-aerosphere-kranken-kassenformular-fr.html) |

### A.3 product-detail (16 pages)

*Trixeo product page: breadcrumb, product sub-navigation tabs, title, text and media sections. Includes the resources index.*

| # | Locale | Section | Page title | Block variants on the page | URL |
|---:|---|---|---|---|---|
| 1 | DE | Trixeo product | TRIXEO Aerosphere® Technologie erklärt \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/aerosphere-technologie](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/aerosphere-technologie.html) |
| 2 | DE | Trixeo product | COPD-Management im klinischen Alltag \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/copd-management](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/copd-management.html) |
| 3 | DE | Trixeo product | TRIXEO Aerosphere® Events und Fortbildungen \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/events](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/events.html) |
| 4 | DE | Trixeo product | TRIXEO Ressourcen für medizinisches Fachpersonal \| AstraZeneca CH | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/ressourcen.html) |
| 5 | DE | Trixeo product | TRIXEO Aerosphere® Sicherheitsprofil \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/sicherheit](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/sicherheit.html) |
| 6 | DE | Trixeo product | TRIXEO Aerosphere® Succinct Statement \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/succinct-statement](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/succinct-statement.html) |
| 7 | DE | Trixeo product | TRIXEO Aerosphere® im Überblick \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/uberblick](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/uberblick.html) |
| 8 | DE | Trixeo product | Wirksamkeit von TRIXEO Aerosphere® \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/wirksamkeit](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/wirksamkeit.html) |
| 9 | FR | Trixeo product | La technologie de TRIXEO Aerosphere® expliquée \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/aerosphere-technologie](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/aerosphere-technologie.html) |
| 10 | FR | Trixeo product | La prise en charge de la BPCO \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/copd-management](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/copd-management.html) |
| 11 | FR | Trixeo product | Événements et formations de TRIXEO Aerosphere® \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/events](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/events.html) |
| 12 | FR | Trixeo product | Ressources TRIXEO pour le corps médical \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/ressourcen](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/ressourcen.html) |
| 13 | FR | Trixeo product | Profil de sécurité de TRIXEO Aerosphere® \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/sicherheit](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/sicherheit.html) |
| 14 | FR | Trixeo product | Information succincte sur TRIXEO Aerosphere® \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/succinct-statement](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/succinct-statement.html) |
| 15 | FR | Trixeo product | Aperçu TRIXEO Aerosphere® \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/uberblick](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/uberblick.html) |
| 16 | FR | Trixeo product | Efficacité de TRIXEO Aerosphere® \| MyAstraZeneca | (none: content is behind the login paywall) | [/…/produkte/trixeo/wirksamkeit](https://www.myastrazeneca.ch/fr/startseite/produkte/trixeo/wirksamkeit.html) |

### A.4 campaign-subpage (12 pages)

*See the pATTRns interior page: campaign banner, section tabs, stat boxes, diagrams, download CTAs.*

| # | Locale | Section | Page title | Block variants on the page | URL |
|---:|---|---|---|---|---|
| 1 | DE | See the pATTRns | Über ATTR Amyloidose: Verlauf & Ursachen \| See the pATTRns | `v_e4409b853477` → Hero, `v_37fdc84c086b` → Columns, `v_bbadaab7c4b3` → Cards, `v_065eb1d0161c` → Default content, `v_bd282072e4b6` → Embed (Kaltura video), `v_c602950f63c9` → Columns, `v_37fdc84c086b-text` → Default content, `v_cc344b0787bb` → Default content | [/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html) |
| 2 | DE | See the pATTRns | ATTR Amyloidose Diagnostizieren \| See the pATTRns \| Diagnose | `v_e4409b853477` → Hero, `v_065eb1d0161c` → Default content, `v_86957572c961` → Default content, `v_2bed43c59a16` → Default content, `v_bbadaab7c4b3` → Cards, `v_cc344b0787bb` → Default content | [/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html) |
| 3 | DE | See the pATTRns | Symptome der ATTR Amyloidose erkennen \| See the pATTRns | `v_e4409b853477` → Hero, `v_b1e664af6109` → Default content, `v_86957572c961` → Default content, `v_7d7a8d636759` → Default content, `v_5a31a8c89674` → Cards, `v_cc344b0787bb` → Default content | [/…/therapiegebiete/cvrm/see-the-pattrns/symptomes](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/symptomes.html) |
| 4 | DE | See the pATTRns | Behandlung der ATTR Amyloidose \| See the pATTRns \| Behandlung | `v_e4409b853477` → Hero, `v_065eb1d0161c` → Default content, `v_cc344b0787bb` → Default content | [/…/therapiegebiete/cvrm/see-the-pattrns/treatement](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/treatement.html) |
| 5 | FR | See the pATTRns | À propos de l’ATTR | `v_e4409b853477` → Hero, `v_37fdc84c086b` → Columns, `v_bbadaab7c4b3` → Cards, `v_065eb1d0161c` → Default content, `v_bd282072e4b6` → Embed (Kaltura video), `v_c602950f63c9` → Columns, `v_37fdc84c086b-text` → Default content, `v_cc344b0787bb` → Default content | [/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html) |
| 6 | FR | See the pATTRns | Diagnostic de l’ATTR | `v_e4409b853477` → Hero, `v_065eb1d0161c` → Default content, `v_86957572c961` → Default content, `v_2bed43c59a16` → Default content, `v_bbadaab7c4b3` → Cards, `v_cc344b0787bb` → Default content | [/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html) |
| 7 | FR | See the pATTRns | Symptômes de l’ATTR | `v_e4409b853477` → Hero, `v_86957572c961` → Default content, `v_f2575cbf84b3` → Cards, `v_7d7a8d636759` → Default content, `v_5a31a8c89674` → Cards, `v_bbadaab7c4b3` → Cards, `v_cc344b0787bb` → Default content | [/…/therapiegebiete/cvrm/see-the-pattrns/symptomes](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/symptomes.html) |
| 8 | FR | See the pATTRns | Traitement | `v_e4409b853477` → Hero, `v_065eb1d0161c` → Default content, `v_bbadaab7c4b3` → Cards, `v_cc344b0787bb` → Default content | [/…/therapiegebiete/cvrm/see-the-pattrns/treatement](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/treatement.html) |
| 9 | IT | See the pATTRns | L’amiloidosi ATTR | `v_e4409b853477` → Hero, `v_37fdc84c086b` → Columns, `v_bbadaab7c4b3` → Cards, `v_065eb1d0161c` → Default content, `v_bd282072e4b6` → Embed (Kaltura video), `v_c602950f63c9` → Columns, `v_37fdc84c086b-text` → Default content, `v_cc344b0787bb` → Default content | [/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html) |
| 10 | IT | See the pATTRns | Diagnosi | `v_e4409b853477` → Hero, `v_065eb1d0161c` → Default content, `v_86957572c961` → Default content, `v_2bed43c59a16` → Default content, `v_bbadaab7c4b3` → Cards, `v_cc344b0787bb` → Default content | [/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html) |
| 11 | IT | See the pATTRns | Sintomi | `v_e4409b853477` → Hero, `v_86957572c961` → Default content, `v_7d7a8d636759` → Default content, `v_5a31a8c89674` → Cards, `v_bbadaab7c4b3` → Cards, `v_cc344b0787bb` → Default content | [/…/therapiegebiete/cvrm/see-the-pattrns/symptomes](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/see-the-pattrns/symptomes.html) |
| 12 | IT | See the pATTRns | Trattamento | `v_e4409b853477` → Hero, `v_065eb1d0161c` → Default content, `v_bbadaab7c4b3` → Cards, `v_cc344b0787bb` → Default content | [/…/therapiegebiete/cvrm/see-the-pattrns/treatement](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/see-the-pattrns/treatement.html) |

### A.5 campaign-landing (3 pages)

*See the pATTRns home: campaign banner, section tabs, key visual, two teaser cards, questions band.*

| # | Locale | Section | Page title | Block variants on the page | URL |
|---:|---|---|---|---|---|
| 1 | DE | See the pATTRns | Einführung in ATTR Amyloidose \| See the pATTRns | `v_e4409b853477` → Hero, `v_7d7a8d636759` → Default content, `v_bbadaab7c4b3` → Cards, `v_cc344b0787bb` → Default content | [/…/therapiegebiete/cvrm/see-the-pattrns/home](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/home.html) |
| 2 | FR | See the pATTRns | Amylose à transthyrétine (ATTR-CM) – Diagnostic et prise en charge \| MyAstraZeneca | `v_e4409b853477` → Hero, `v_065eb1d0161c` → Default content, `v_bbadaab7c4b3` → Cards, `v_cc344b0787bb` → Default content | [/…/therapiegebiete/cvrm/see-the-pattrns/home](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/home.html) |
| 3 | IT | See the pATTRns | Home | `v_e4409b853477` → Hero, `v_065eb1d0161c` → Default content, `v_bbadaab7c4b3` → Cards, `v_cc344b0787bb` → Default content | [/…/therapiegebiete/cvrm/see-the-pattrns/home](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/see-the-pattrns/home.html) |

### A.6 product-overview (4 pages)

*Products index: hero banner, therapy-area tabs, product card grid, contact banner.*

| # | Locale | Section | Page title | Block variants on the page | URL |
|---:|---|---|---|---|---|
| 1 | DE | Products index | Produkte - MyAstraZeneca | `v_b26d6cceada2` → Hero, `v_8ab7ece34e9a` → Tabs, `v_f90804d73a13` → Cards, `v_617324728993` → Hero | [/…/produkte](https://www.myastrazeneca.ch/de/startseite/produkte.html) |
| 2 | EN | Products index | Overview of Medical Products – Therapeutic Areas | `v_b26d6cceada2` → Hero, `v_8ab7ece34e9a-1` → Tabs, `v_f90804d73a13` → Cards, `v_617324728993` → Hero | [/…/produkte](https://www.myastrazeneca.ch/en/startseite/produkte.html) |
| 3 | FR | Products index | Médicaments cardiovasculaires, rénaux et métaboliques \| MyAstraZeneca | `v_f88e29f32a0c` → Breadcrumbs, `v_42845b3e07dd` → Hero, `v_8ab7ece34e9a-2` → Tabs, `v_228f16fbc166` → Hero | [/…/produkte](https://www.myastrazeneca.ch/fr/startseite/produkte.html) |
| 4 | IT | Products index | Prodotti \| AstraZeneca | `v_b26d6cceada2` → Hero, `v_8ab7ece34e9a` → Tabs, `v_f90804d73a13` → Cards, `v_617324728993` → Hero | [/…/produkte](https://www.myastrazeneca.ch/it/startseite/produkte.html) |

### A.7 contact (4 pages)

*Contact page: title and enquiry form.*

| # | Locale | Section | Page title | Block variants on the page | URL |
|---:|---|---|---|---|---|
| 1 | DE | Contact | Kontaktieren Sie uns | `v_6e8c2538dd7e` → Form | [/…/contact-us](https://www.myastrazeneca.ch/de/startseite/contact-us.html) |
| 2 | EN | Contact | Contact us | `v_6e8c2538dd7e` → Form | [/…/contact-us](https://www.myastrazeneca.ch/en/startseite/contact-us.html) |
| 3 | FR | Contact | Contactez-nous | `v_c8843a7f9ec8` → Form | [/…/contact-us](https://www.myastrazeneca.ch/fr/startseite/contact-us.html) |
| 4 | IT | Contact | Contattaci | `v_181661dda160` → Form | [/…/contact-us](https://www.myastrazeneca.ch/it/startseite/contact-us.html) |

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

## Appendix C: Template × block matrices

### C.1 By EDS target (after the block mapping review)

Number of pages in each template that contain at least one variant mapped to that EDS block (Appendix D). Header and footer are on every page.

| Template | Pages | Hero | Cards | Columns | Tabs | Form | Embed (Kaltura video) | Accordion | In-Page Nav | Breadcrumbs | Default content |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| content-landing | 49 | 44 | 46 | 41 | · | · | · | 4 | 4 | · | 13 |
| resource-detail | 34 | · | · | · | · | · | · | · | · | · | · |
| product-detail | 16 | · | · | · | · | · | · | · | · | · | · |
| campaign-subpage | 12 | 12 | 11 | 3 | · | · | 3 | · | · | · | 12 |
| campaign-landing | 3 | 3 | 3 | · | · | · | · | · | · | · | 3 |
| product-overview | 4 | 4 | 3 | · | 4 | · | · | · | · | 1 | · |
| contact | 4 | · | · | · | · | 4 | · | · | · | · | · |

### C.2 By originally detected block type

The same count by the type the automatic detector first assigned (kept in each page's own catalog record; the corrected types are in C.1 and in `catalog/block-catalog.json`). "unknown" means content the detector could not map to a named block.

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

## Appendix D: Blocks and their variants, by EDS target

Grouped by the EDS block each catalogued variant maps to (reviewed mapping: `tools/importer/block-mapping.json`). For each block: its status, the standard block it is based on, how the EDS block renders today (where it is built), and then every source variant with its evidence and a source screenshot. "Source components" come from resolving each block instance in the source HTML (`catalog/source-components.json`). A variant marked *merge into* is a duplicate of another and needs no separate implementation.

### D.1 Header

| Field | Value |
|---|---|
| EDS block | `header` |
| Status | ✅ built |
| Standard block | Header (boilerplate) |
| Source components | Mega Menu, Experience Fragment, User (Login) |
| Catalog variants | 1 |
| Pages | every page |

**EDS rendering today** (demo page `/block-library/accordion`):

![EDS Header](../catalog/component-shots/eds-header.jpg)

#### D.1.1 `header-global`

| Field | Value |
|---|---|
| Catalog | type `header` · block `header` · default |
| Structure | header |
| Uses | every page (global) |
| EDS target | Header |

![source header-global](../catalog/.pages/_global/header.jpg)

### D.2 Footer

| Field | Value |
|---|---|
| EDS block | `footer` |
| Status | ✅ built |
| Standard block | Footer (boilerplate) |
| Source components | - |
| Catalog variants | 1 |
| Pages | every page |

**EDS rendering today** (demo page `/block-library/accordion`):

![EDS Footer](../catalog/component-shots/eds-footer.jpg)

#### D.2.1 `footer-global`

| Field | Value |
|---|---|
| Catalog | type `footer` · block `footer` · default |
| Structure | footer |
| Uses | every page (global) |
| EDS target | Footer |

![source footer-global](../catalog/.pages/_global/footer.jpg)

### D.3 Hero

| Field | Value |
|---|---|
| EDS block | `hero-minimal-dark-withimg` |
| Status | ✅ built |
| Standard block | Hero |
| Options | default · centered · campaign banner (image only) |
| Source components | Teaser |
| Catalog variants | 6 (3 after merging duplicates) |
| Pages | 63 |

**EDS rendering today** (demo page `/block-library/hero`):

![EDS Hero](../catalog/component-shots/eds-hero.jpg)

#### D.3.1 `v_b26d6cceada2`: default

| Field | Value |
|---|---|
| Catalog | type `hero` · block `hero-minimal-dark-withimg` · default |
| Structure | heading + text + 2 images |
| Source components | Teaser 43/43, Container 43/43, Image 43/43 |
| Source styles | `teaser--home-hero` |
| Uses | 43 on 43 pages |
| Templates | content-landing (40), product-overview (3) |
| EDS target | Hero (default): implemented by `hero-minimal-dark-withimg` |
| Note | Dark full-bleed hero (teaser--home-hero). Implemented |
| Example pages | [/en/startseite](https://www.myastrazeneca.ch/en/startseite.html)<br>[/…/produkte](https://www.myastrazeneca.ch/en/startseite/produkte.html)<br>[/…/therapiegebiete/cvrm/acutecare](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/acutecare.html) |

![source v_b26d6cceada2](../catalog/.pages/www_myastrazeneca_ch_en_startseite_html--3b773d1a/blocks/14d60be3.jpg)

#### D.3.2 `v_e4409b853477`: campaign banner

| Field | Value |
|---|---|
| Catalog | type `hero` · block `hero-minimal-dark-withimg` · class `campaign-banner` |
| Structure | 2 images |
| Source components | Container 17/17, Image 17/17, Teaser 15/17 |
| Source styles | `teaser--home-hero` |
| Uses | 17 on 15 pages |
| Templates | campaign-subpage (12), campaign-landing (3) |
| EDS target | Hero (campaign banner) |
| Note | See the pATTRns logo banner: image only, no text |
| Example pages | [/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/home](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/home.html) |

![source v_e4409b853477](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_cvrm_see-the-pattrns_about-amylodosis-attr_html--6b239aec/blocks/18306014.jpg)

#### D.3.3 `v_2ab6094d0f33`: default

| Field | Value |
|---|---|
| Catalog | type `hero` · block `hero-minimal-dark-withimg` · default |
| Structure | heading + text + 2 images |
| Source components | Teaser 4/4, Image 4/4 |
| Source styles | `teaser--home-hero` |
| Uses | 4 on 4 pages |
| Templates | content-landing (4) |
| EDS target | Hero (default) |
| Merge into | `v_b26d6cceada2` |
| Note | Same source style as v_b26d6cceada2 (oncology pages); split off by layout noise |
| Example pages | [/…/therapiegebiete/onkologie/prostata](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/onkologie/prostata.html)<br>[/…/therapiegebiete/onkologie/haematologie](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/onkologie/haematologie.html)<br>[/…/therapiegebiete/onkologie/prostata](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/onkologie/prostata.html) |

![source v_2ab6094d0f33](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_onkologie_prostata_html--b065b3ab/blocks/40f87f29.jpg)

#### D.3.4 `v_617324728993`: centered

| Field | Value |
|---|---|
| Catalog | type `hero` · block `hero-minimal-dark-withimg` · class `centered` |
| Structure | heading + text + 2 images |
| Source components | Teaser 3/3, Container 3/3, Image 3/3 |
| Source styles | `teaser--home-hero` `teaser--text-center` |
| Uses | 3 on 3 pages |
| Templates | product-overview (3) |
| EDS target | Hero (centered) |
| Note | teaser--home-hero with teaser--text-center (products index) |
| Example pages | [/…/produkte](https://www.myastrazeneca.ch/en/startseite/produkte.html)<br>[/…/produkte](https://www.myastrazeneca.ch/de/startseite/produkte.html)<br>[/…/produkte](https://www.myastrazeneca.ch/it/startseite/produkte.html) |

![source v_617324728993](../catalog/.pages/www_myastrazeneca_ch_en_startseite_produkte_html--96d99f3e/blocks/3f191256.jpg)

#### D.3.5 `v_228f16fbc166`: centered

| Field | Value |
|---|---|
| Catalog | type `hero` · block `hero-minimal-dark-withimg` · class `centered` |
| Structure | heading + text + 2 images |
| Source components | Teaser 1/1, Image 1/1 |
| Source styles | `teaser--home-hero` `teaser--text-center` |
| Uses | 1 on 1 pages |
| Templates | product-overview (1) |
| EDS target | Hero (centered) |
| Merge into | `v_617324728993` |
| ⚠️ Discrepancy | Artifact of the unstyled FR /produkte.html capture |
| Example pages | [/…/produkte](https://www.myastrazeneca.ch/fr/startseite/produkte.html) |

![source v_228f16fbc166](../catalog/.pages/www_myastrazeneca_ch_fr_startseite_produkte_html--ee1c829d/blocks/7f3622f1.jpg)

#### D.3.6 `v_42845b3e07dd`: default

| Field | Value |
|---|---|
| Catalog | type `hero` · block `hero-minimal-dark-withimg` · default |
| Structure | heading + text + 2 images |
| Source components | Teaser 1/1, Image 1/1 |
| Source styles | `teaser--home-hero` |
| Uses | 1 on 1 pages |
| Templates | product-overview (1) |
| EDS target | Hero (default) |
| Merge into | `v_b26d6cceada2` |
| ⚠️ Discrepancy | Artifact of the unstyled FR /produkte.html capture |
| Example pages | [/…/produkte](https://www.myastrazeneca.ch/fr/startseite/produkte.html) |

![source v_42845b3e07dd](../catalog/.pages/www_myastrazeneca_ch_fr_startseite_produkte_html--ee1c829d/blocks/2e204570.jpg)

### D.4 Cards

| Field | Value |
|---|---|
| EDS block | `cards-light-withimg` |
| Status | 🟡 partial |
| Standard block | Cards |
| Options | 3-up image cards (built) · 2-up icon cards · bordered text cards · product cards with hover overlay |
| Source components | Teaser |
| Catalog variants | 5 (4 after merging duplicates) |
| Pages | 63 |

**EDS rendering today** (demo page `/block-library/cards`):

![EDS Cards](../catalog/component-shots/eds-cards.jpg)

#### D.4.1 `v_5d7c92bb4412`: 3-up image cards

| Field | Value |
|---|---|
| Catalog | type `cards` · block `cards-light-withimg` · default |
| Structure | heading + text + 6 images |
| Source components | Container 50/50, Teaser 49/50, Image 49/50, Title 9/50, Text 5/50 |
| Source styles | `teaser--image-top-text-bottom` `teaser--text-center` `container--3-column-wrap` `teaser--title-color-core` `teaser--text-left` |
| Uses | 50 on 46 pages |
| Templates | content-landing (46) |
| EDS target | Cards (3-up image cards): implemented by `cards-light-withimg` |
| Note | Therapy-area grid (container--3-column-wrap, image-top-text-bottom). Implemented |
| ⚠️ Discrepancy | Detected as unknown |
| Example pages | [/en/startseite](https://www.myastrazeneca.ch/en/startseite.html)<br>[/…/therapiegebiete/cvrm/acutecare](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/acutecare.html)<br>[/…/therapiegebiete/cvrm/chronischeniereninsuffizienz](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/chronischeniereninsuffizienz.html) |

![source v_5d7c92bb4412](../catalog/.pages/www_myastrazeneca_ch_en_startseite_html--3b773d1a/blocks/72f39286.jpg)

#### D.4.2 `v_bbadaab7c4b3`: 2-up icon cards

| Field | Value |
|---|---|
| Catalog | type `cards` · block `cards-light-withimg` · class `icon` |
| Structure | heading + text + 4 images |
| Source components | Teaser 16/16, Container 16/16, Image 16/16 |
| Source styles | `teaser--image-top-text-bottom` `container--2-column-wrap` `container--content-center` |
| Uses | 16 on 13 pages |
| Templates | campaign-subpage (10), campaign-landing (3) |
| EDS target | Cards (2-up icon cards) |
| Note | Campaign feature cards: icon, title, text (container--2-column-wrap) |
| ⚠️ Discrepancy | Detected as unknown |
| Example pages | [/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/home](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/home.html) |

![source v_bbadaab7c4b3](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_cvrm_see-the-pattrns_about-amylodosis-attr_html--6b239aec/blocks/3f3af963.jpg)

#### D.4.3 `v_5a31a8c89674`: 2-up icon cards

| Field | Value |
|---|---|
| Catalog | type `cards` · block `cards-light-withimg` · class `icon` |
| Structure | text + 4 images |
| Source components | Teaser 3/3, Container 3/3, Image 3/3 |
| Source styles | `teaser--image-top-text-bottom` `container--2-column-wrap` |
| Uses | 3 on 3 pages |
| Templates | campaign-subpage (3) |
| EDS target | Cards (2-up icon cards) |
| Merge into | `v_bbadaab7c4b3` |
| ⚠️ Discrepancy | Detected as unknown; same as v_bbadaab7c4b3 |
| Example pages | [/…/therapiegebiete/cvrm/see-the-pattrns/symptomes](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/symptomes.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/symptomes](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/symptomes.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/symptomes](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/see-the-pattrns/symptomes.html) |

![source v_5a31a8c89674](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_cvrm_see-the-pattrns_symptomes_html--4eba725c/blocks/4f9aa4f0.jpg)

#### D.4.4 `v_f90804d73a13`: product cards

| Field | Value |
|---|---|
| Catalog | type `cards` · block `cards-light-withimg` · class `product` |
| Structure | heading + text + 2 images |
| Source components | Teaser 10/10, Image 10/10 |
| Uses | 10 on 3 pages |
| Templates | product-overview (3) |
| EDS target | Cards (product cards) |
| Note | Product card with a hover overlay (name + 'Learn more'); these sit inside the tab panels |
| ⚠️ Discrepancy | Detected as columns |
| Example pages | [/…/produkte](https://www.myastrazeneca.ch/en/startseite/produkte.html)<br>[/…/produkte](https://www.myastrazeneca.ch/de/startseite/produkte.html)<br>[/…/produkte](https://www.myastrazeneca.ch/it/startseite/produkte.html) |

![source v_f90804d73a13](../catalog/.pages/www_myastrazeneca_ch_en_startseite_produkte_html--96d99f3e/blocks/57e9dab0.jpg)

#### D.4.5 `v_f2575cbf84b3`: bordered text cards

| Field | Value |
|---|---|
| Catalog | type `cards` · block `cards-light-withimg` · class `bordered` |
| Structure | text |
| Source components | Teaser 1/1, Container 1/1 |
| Source styles | `teaser--image-top-text-bottom` `teaser--border-base` |
| Uses | 1 on 1 pages |
| Templates | campaign-subpage (1) |
| EDS target | Cards (bordered text cards) |
| Note | teaser--border-base, text only (FR symptoms page) |
| Example pages | [/…/therapiegebiete/cvrm/see-the-pattrns/symptomes](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/symptomes.html) |

![source v_f2575cbf84b3](../catalog/.pages/www_myastrazeneca_ch_fr_startseite_therapiegebiete_cvrm_see-the-pattrns_symptomes_html--91f9a284/blocks/625ecdba.jpg)

### D.5 Columns

| Field | Value |
|---|---|
| EDS block | `columns` |
| Status | 🟡 partial |
| Standard block | Columns |
| Options | text beside image · two images |
| Source components | Teaser |
| Catalog variants | 3 |
| Pages | 44 |
| Note | Boilerplate block; not yet styled to the source |

**EDS rendering today** (boilerplate demo, not yet styled):

![EDS Columns](../catalog/component-shots/eds-columns.jpg)

#### D.5.1 `v_37fdc84c086b`: text beside image

| Field | Value |
|---|---|
| Catalog | type `columns` · block `columns` · default |
| Structure | heading + text + 2 images + list |
| Source components | Teaser 130/130, Image 130/130, Container 126/130, Text 53/130, Title 15/130 |
| Source styles | `teaser--text-left` `teaser--text-image` `title--color-title-1` `teaser--title-color-core` `title--mobile-center` |
| Uses | 130 on 40 pages |
| Templates | content-landing (37), campaign-subpage (3) |
| EDS target | Columns (text beside image) |
| Note | Text-image teasers (130 of 133 instances; 50 of them sit beside a Text component) |
| ⚠️ Discrepancy | Catch-all: 3 instances (About ATTR amyloidosis, DE/FR/IT) had no teaser. Split off as v_37fdc84c086b-text |
| Example pages | [/…/therapiegebiete/cvrm/acutecare](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/acutecare.html)<br>[/…/therapiegebiete/cvrm/chronischeniereninsuffizienz](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/chronischeniereninsuffizienz.html)<br>[/…/therapiegebiete/cvrm/diabetes](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/diabetes.html) |

![source v_37fdc84c086b](../catalog/.pages/www_myastrazeneca_ch_en_startseite_therapiegebiete_cvrm_acutecare_html--d422dc19/blocks/62b4cb28.jpg)

#### D.5.2 `v_6defe37a8d19`: text beside image

| Field | Value |
|---|---|
| Catalog | type `columns` · block `columns` · default |
| Structure | text + 2 images |
| Source components | Teaser 29/29, Container 29/29, Image 29/29 |
| Source styles | `teaser--text-image` |
| Uses | 29 on 29 pages |
| Templates | content-landing (29) |
| EDS target | Columns (text beside image) |
| Note | teaser--text-image: copy and CTA beside an image (homepage 'Products' section) |
| ⚠️ Discrepancy | Detected as unknown |
| Example pages | [/…/therapiegebiete/cvrm/acutecare](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/acutecare.html)<br>[/…/](https://www.myastrazeneca.ch/)<br>[/de/startseite](https://www.myastrazeneca.ch/de/startseite.html) |

![source v_6defe37a8d19](../catalog/.pages/www_myastrazeneca_ch_en_startseite_therapiegebiete_cvrm_acutecare_html--d422dc19/blocks/c1b8293.jpg)

#### D.5.3 `v_c602950f63c9`: two images

| Field | Value |
|---|---|
| Catalog | type `columns` · block `columns` · class `images` |
| Structure | 4 images |
| Source components | Container 3/3, Image 3/3 |
| Source styles | `container--2-column-wrap` |
| Uses | 3 on 3 pages |
| Templates | campaign-subpage (3) |
| EDS target | Columns (two images) |
| Note | Two images side by side (container--2-column-wrap) |
| ⚠️ Discrepancy | Detected as unknown |
| Example pages | [/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html) |

![source v_c602950f63c9](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_cvrm_see-the-pattrns_about-amylodosis-attr_html--6b239aec/blocks/57dbdae6.jpg)

### D.6 Tabs

| Field | Value |
|---|---|
| EDS block | `tabs` |
| Status | ❌ to build |
| Standard block | Tabs |
| Source components | Tab |
| Catalog variants | 3 (1 after merging duplicates) |
| Pages | 4 |
| Note | Each tab holds a product card grid. DA blocks can't nest, so tabs must be built from sections (one section per tab) rather than one table |

**Source component on the live site** (Tab, [example page](https://www.myastrazeneca.ch/de/startseite/produkte.html)):

![source component Tab](../catalog/component-shots/src-tab.jpg)

#### D.6.1 `v_8ab7ece34e9a`

| Field | Value |
|---|---|
| Catalog | type `tabs` · block `tabs` · default |
| Structure | heading + text + 32 CTAs + 32 images + list |
| Source components | Tab 2/2, Teaser 2/2, Text 2/2, Container 2/2, Image 2/2 |
| Source styles | `teaser--image-top-text-bottom` `teaser--border-base` `text--large` `container--3-column-wrap` `tabs--sticky` |
| Uses | 2 on 2 pages |
| Templates | product-overview (2) |
| EDS target | Tabs |
| Note | Therapy-area tabs with product card grids (DE, IT) |
| Example pages | [/…/produkte](https://www.myastrazeneca.ch/de/startseite/produkte.html)<br>[/…/produkte](https://www.myastrazeneca.ch/it/startseite/produkte.html) |

![source v_8ab7ece34e9a](../catalog/.pages/www_myastrazeneca_ch_de_startseite_produkte_html--71e7356f/blocks/2f00e970.jpg)

#### D.6.2 `v_8ab7ece34e9a-1`

| Field | Value |
|---|---|
| Catalog | type `tabs` · block `tabs` · default |
| Structure | heading + text + 28 CTAs + 28 images + list |
| Source components | Tab 1/1, Teaser 1/1, Text 1/1, Container 1/1, Image 1/1 |
| Source styles | `teaser--image-top-text-bottom` `teaser--border-base` `text--large` `container--3-column-wrap` `tabs--list-items-align-left` |
| Uses | 1 on 1 pages |
| Templates | product-overview (1) |
| EDS target | Tabs |
| Merge into | `v_8ab7ece34e9a` |
| ⚠️ Discrepancy | EN copy of the same tabs (fewer products) |
| Example pages | [/…/produkte](https://www.myastrazeneca.ch/en/startseite/produkte.html) |

![source v_8ab7ece34e9a-1](../catalog/.pages/www_myastrazeneca_ch_en_startseite_produkte_html--96d99f3e/blocks/2f00e970.jpg)

#### D.6.3 `v_8ab7ece34e9a-2`

| Field | Value |
|---|---|
| Catalog | type `tabs` · block `tabs` · default |
| Structure | heading + text + 32 CTAs + 32 images + list |
| Source components | Tab 1/1, Teaser 1/1, Text 1/1, Container 1/1, Image 1/1 |
| Source styles | `teaser--image-top-text-bottom` `teaser--border-base` `text--large` `container--3-column-wrap` `tabs--list-items-align-left` |
| Uses | 1 on 1 pages |
| Templates | product-overview (1) |
| EDS target | Tabs |
| Merge into | `v_8ab7ece34e9a` |
| ⚠️ Discrepancy | FR copy of the same tabs |
| Example pages | [/…/produkte](https://www.myastrazeneca.ch/fr/startseite/produkte.html) |

![source v_8ab7ece34e9a-2](../catalog/.pages/www_myastrazeneca_ch_fr_startseite_produkte_html--ee1c829d/blocks/2f00e970.jpg)

### D.7 Form

| Field | Value |
|---|---|
| EDS block | `form` |
| Status | ❌ to build |
| Standard block | Form |
| Source components | Form Container, Dynamic Form V2 |
| Catalog variants | 3 (1 after merging duplicates) |
| Pages | 4 |
| Note | Source is Dynamic Form V2: fields are generated client-side from an AstraZeneca form service (form id per locale) and posted there. Needs a decision on the submission backend |

**Source component on the live site** (Dynamic Form V2, [example page](https://www.myastrazeneca.ch/de/startseite/contact-us.html)):

![source component Dynamic Form V2](../catalog/component-shots/src-dynamic-form-v2.jpg)

#### D.7.1 `v_6e8c2538dd7e`

| Field | Value |
|---|---|
| Catalog | type `form` · block `form` · default |
| Structure | text + 2 CTAs + list |
| Source components | Dynamic Form V2 2/2, Social Features 2/2, Container 2/2, Form Container 2/2 |
| Uses | 2 on 2 pages |
| Templates | contact (2) |
| EDS target | Form |
| Note | Contact form (DE, EN) |
| Example pages | [/…/contact-us](https://www.myastrazeneca.ch/en/startseite/contact-us.html)<br>[/…/contact-us](https://www.myastrazeneca.ch/de/startseite/contact-us.html) |

![source v_6e8c2538dd7e](../catalog/.pages/www_myastrazeneca_ch_en_startseite_contact-us_html--9f317070/blocks/6962511e.jpg)

#### D.7.2 `v_181661dda160`

| Field | Value |
|---|---|
| Catalog | type `form` · block `form` · default |
| Structure | text + 2 CTAs |
| Source components | Dynamic Form V2 1/1, Container 1/1, Form Container 1/1 |
| Uses | 1 on 1 pages |
| Templates | contact (1) |
| EDS target | Form |
| Merge into | `v_6e8c2538dd7e` |
| ⚠️ Discrepancy | IT copy of the same form |
| Example pages | [/…/contact-us](https://www.myastrazeneca.ch/it/startseite/contact-us.html) |

![source v_181661dda160](../catalog/.pages/www_myastrazeneca_ch_it_startseite_contact-us_html--ace3238e/blocks/43733ec6.jpg)

#### D.7.3 `v_c8843a7f9ec8`

| Field | Value |
|---|---|
| Catalog | type `form` · block `form` · default |
| Structure | text + 2 CTAs |
| Source components | Dynamic Form V2 1/1, Form Container 1/1 |
| Uses | 1 on 1 pages |
| Templates | contact (1) |
| EDS target | Form |
| Merge into | `v_6e8c2538dd7e` |
| ⚠️ Discrepancy | FR copy of the same form |
| Example pages | [/…/contact-us](https://www.myastrazeneca.ch/fr/startseite/contact-us.html) |

![source v_c8843a7f9ec8](../catalog/.pages/www_myastrazeneca_ch_fr_startseite_contact-us_html--cfe2c492/blocks/4651dca2.jpg)

### D.8 Embed (Kaltura video)

| Field | Value |
|---|---|
| EDS block | `embed` |
| Status | ❌ to build |
| Standard block | Embed / Video |
| Source components | Embed |
| Catalog variants | 1 |
| Pages | 3 |
| Note | The videos are Kaltura players; the standard Embed block has no Kaltura handler, so it needs a small extension |

**Source component on the live site** (Embed, [example page](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html)):

![source component Embed](../catalog/component-shots/src-embed.jpg)

#### D.8.1 `v_bd282072e4b6`

| Field | Value |
|---|---|
| Catalog | type `embed` · block `embed` · default |
| Structure | heading + image |
| Source components | Embed 3/3, Container 3/3, Title 3/3 |
| Source styles | `title--center` `title--color-title-1` |
| Uses | 3 on 3 pages |
| Templates | campaign-subpage (3) |
| EDS target | Embed (Kaltura video) |
| Note | Centered title + Kaltura video |
| ⚠️ Discrepancy | Detected as unknown ('heading + image'): the video is only a poster image in the capture |
| Example pages | [/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html) |

![source v_bd282072e4b6](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_cvrm_see-the-pattrns_about-amylodosis-attr_html--6b239aec/blocks/3f3af9c0.jpg)

### D.9 Accordion

| Field | Value |
|---|---|
| EDS block | `accordion` |
| Status | ✅ built |
| Standard block | Accordion |
| Source components | Accordion |
| Catalog variants | 1 |
| Pages | 4 |
| Note | Built from the oneAZ spec; not yet compared with the source variant |

**EDS rendering today** (demo page `/block-library/accordion`):

![EDS Accordion](../catalog/component-shots/eds-accordion.jpg)

#### D.9.1 `v_4ecd3661fdd5`

| Field | Value |
|---|---|
| Catalog | type `accordion` · block `accordion` · default |
| Structure | heading + text + 6 CTAs |
| Source components | Accordion 4/4, Text 4/4, Container 4/4 |
| Source styles | `text--small` |
| Uses | 4 on 4 pages |
| Templates | content-landing (4) |
| EDS target | Accordion |
| Note | accordion--headings-fixed-width with small-print panels |
| Example pages | [/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/ri/copd.html)<br>[/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/ri/copd.html)<br>[/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/ri/copd.html) |

![source v_4ecd3661fdd5](../catalog/.pages/www_myastrazeneca_ch_en_startseite_therapiegebiete_ri_copd_html--03db88aa/blocks/34814720.jpg)

### D.10 In-Page Nav

| Field | Value |
|---|---|
| EDS block | `in-page-nav` |
| Status | ✅ built |
| Standard block | custom (oneAZ Links) |
| Options | vertical (built) · horizontal section sub-nav (to build, from the List component) |
| Source components | Text, List |
| Catalog variants | 1 |
| Pages | 4 |

**EDS rendering today** (demo page `/block-library/in-page-nav`):

![EDS In-Page Nav](../catalog/component-shots/eds-in-page-nav.jpg)

**Source component on the live site** (List, [example page](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html)):

![source component List](../catalog/component-shots/src-list.jpg)

#### D.10.1 `v_d41301689a41`: vertical

| Field | Value |
|---|---|
| Catalog | type `in-page-nav` · block `in-page-nav` · default |
| Structure | 2 CTAs + list |
| Source components | Text 4/4, Container 4/4 |
| Source styles | `text--link-color-title-2` `text--in-page-nav-hr` |
| Uses | 4 on 4 pages |
| Templates | content-landing (4) |
| EDS target | In-Page Nav (vertical) |
| Note | Text component styled text--in-page-nav-hr: anchor list with dividers |
| ⚠️ Discrepancy | Detected as unknown |
| Example pages | [/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/ri/copd.html)<br>[/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/ri/copd.html)<br>[/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/ri/copd.html) |

![source v_d41301689a41](../catalog/.pages/www_myastrazeneca_ch_en_startseite_therapiegebiete_ri_copd_html--03db88aa/blocks/29c72514.jpg)

### D.11 Breadcrumbs

| Field | Value |
|---|---|
| EDS block | `breadcrumbs` |
| Status | ❌ to build |
| Standard block | Breadcrumbs |
| Source components | Breadcrumb |
| Catalog variants | 1 |
| Pages | 1 |
| Note | Visible on every page; generate from the page path in the header |

**Source component on the live site** (Breadcrumb, [example page](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html)):

![source component Breadcrumb](../catalog/component-shots/src-breadcrumb.jpg)

#### D.11.1 `v_f88e29f32a0c`

| Field | Value |
|---|---|
| Catalog | type `breadcrumbs` · block `breadcrumbs` · default |
| Structure | list |
| Source components | Breadcrumb 1/1 |
| Uses | 1 on 1 pages |
| Templates | product-overview (1) |
| EDS target | Breadcrumbs |
| ⚠️ Discrepancy | Only caught on the unstyled FR capture, but the breadcrumb is real and visible on every page |
| Example pages | [/…/produkte](https://www.myastrazeneca.ch/fr/startseite/produkte.html) |

![source v_f88e29f32a0c](../catalog/.pages/www_myastrazeneca_ch_fr_startseite_produkte_html--ee1c829d/blocks/62ae0a80.jpg)

### D.12 Buttons

| Field | Value |
|---|---|
| EDS block | `button-group` |
| Status | ✅ built |
| Standard block | default content + custom Button Group |
| Source components | Button |
| Catalog variants | none: mapped from source components (Appendix E) |
| Pages | 122 |

**EDS rendering today** (demo page `/buttons`):

![EDS Buttons](../catalog/component-shots/eds-button-group.jpg)

### D.13 Modal (HCP self-certification)

| Field | Value |
|---|---|
| EDS block | `modal` |
| Status | ❌ to build |
| Standard block | Modal |
| Source components | Self-certification |
| Catalog variants | none: mapped from source components (Appendix E) |
| Pages | 15 |
| Note | Show once, remember the choice; the 'patient' choice must lead away from HCP content |

**Source component on the live site** (Self-certification, [example page](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/home.html)):

![source component Self-certification](../catalog/component-shots/src-self-certification.jpg)

### D.14 Search

| Field | Value |
|---|---|
| EDS block | `search` |
| Status | ❌ to build |
| Standard block | Search |
| Source components | Search |
| Catalog variants | none: mapped from source components (Appendix E) |
| Pages | 122 |
| Note | The header has the search field; results need the Search block and a query index |

**Source component on the live site** (Search, [example page](https://www.myastrazeneca.ch/de/startseite.html)):

![source component Search](../catalog/component-shots/src-search.jpg)

### D.15 Default content

| Field | Value |
|---|---|
| EDS block | - |
| Status | - |
| Standard block | no block |
| Source components | Teaser, Title, Text, Image |
| Catalog variants | 12 |
| Pages | 28 |
| Note | Headings, paragraphs, images, links and buttons. Centering and background come from section styles |

**EDS rendering today** (demo page `/en/startseite`):

![EDS Default content](../catalog/component-shots/eds-default-content.jpg)

#### D.15.1 `v_cc344b0787bb`

| Field | Value |
|---|---|
| Catalog | type `unknown` · block (default content, not generated) |
| Structure | heading + text + 1 CTAs |
| Source components | Button 18/18, Text 18/18, Container 18/18, Title 18/18 |
| Source styles | `title--center` `title--color-title-1` `text--center` `button--center` |
| Uses | 18 on 18 pages |
| Templates | campaign-subpage (12), campaign-landing (3), content-landing (3) |
| EDS target | Default content |
| Note | Centered title + text + button (section style: centered) |
| Example pages | [/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/home](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/home.html) |

![source v_cc344b0787bb](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_cvrm_see-the-pattrns_about-amylodosis-attr_html--6b239aec/blocks/57dbda4b.jpg)

#### D.15.2 `v_065eb1d0161c`

| Field | Value |
|---|---|
| Catalog | type `unknown` · block (default content, not generated) |
| Structure | 2 images |
| Source components | Image 20/20, Container 14/20 |
| Uses | 20 on 17 pages |
| Templates | campaign-subpage (9), content-landing (6), campaign-landing (2) |
| EDS target | Default content |
| Note | One image (desktop + mobile renditions) |
| Example pages | [/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/treatement](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/treatement.html) |

![source v_065eb1d0161c](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_cvrm_see-the-pattrns_about-amylodosis-attr_html--6b239aec/blocks/3f3af9a1.jpg)

#### D.15.3 `v_8630772c9b24`

| Field | Value |
|---|---|
| Catalog | type `unknown` · block (default content, not generated) |
| Structure | image |
| Source components | Image 26/26, Container 2/26 |
| Uses | 26 on 6 pages |
| Templates | content-landing (6) |
| EDS target | Default content |
| Note | Standalone image |
| Example pages | [/…/therapiegebiete/cvrm/acutecare](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/acutecare.html)<br>[/…/therapiegebiete/onkologie/brustkrebs](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/onkologie/brustkrebs.html)<br>[/…/therapiegebiete/cvrm/acutecare](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/acutecare.html) |

![source v_8630772c9b24](../catalog/.pages/www_myastrazeneca_ch_en_startseite_therapiegebiete_cvrm_acutecare_html--d422dc19/blocks/c1b82f0.jpg)

#### D.15.4 `v_86957572c961`

| Field | Value |
|---|---|
| Catalog | type `unknown` · block (default content, not generated) |
| Structure | 1 CTAs |
| Source components | Button 6/6, Container 6/6 |
| Source styles | `button--center` |
| Uses | 6 on 6 pages |
| Templates | campaign-subpage (6) |
| EDS target | Default content |
| Note | Centered button (Button Group, align-center) |
| Example pages | [/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/symptomes](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/symptomes.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html) |

![source v_86957572c961](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_cvrm_see-the-pattrns_diagnosis_html--6940e0d5/blocks/4d4bfda9.jpg)

#### D.15.5 `v_7d7a8d636759`

| Field | Value |
|---|---|
| Catalog | type `unknown` · block (default content, not generated) |
| Structure | heading + 2 images |
| Source components | Container 4/4, Image 4/4, Title 4/4 |
| Source styles | `title--color-title-1` `title--center` |
| Uses | 4 on 4 pages |
| Templates | campaign-subpage (3), campaign-landing (1) |
| EDS target | Default content |
| Note | Title + image |
| Example pages | [/…/therapiegebiete/cvrm/see-the-pattrns/home](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/home.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/symptomes](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/symptomes.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/symptomes](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/symptomes.html) |

![source v_7d7a8d636759](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_cvrm_see-the-pattrns_home_html--7fa80632/blocks/1a20676c.jpg)

#### D.15.6 `v_7edce974c28a`

| Field | Value |
|---|---|
| Catalog | type `unknown` · block (default content, not generated) |
| Structure | heading + text + 1 CTAs |
| Source components | Button 8/8, Text 8/8, Container 8/8, Title 8/8 |
| Source styles | `title--color-title-1` `button--left` |
| Uses | 8 on 4 pages |
| Templates | content-landing (4) |
| EDS target | Default content |
| Note | Title + text + button |
| Example pages | [/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/ri/copd.html)<br>[/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/ri/copd.html)<br>[/…/therapiegebiete/ri/copd](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/ri/copd.html) |

![source v_7edce974c28a](../catalog/.pages/www_myastrazeneca_ch_en_startseite_therapiegebiete_ri_copd_html--03db88aa/blocks/f1d8370.jpg)

#### D.15.7 `v_2bed43c59a16`

| Field | Value |
|---|---|
| Catalog | type `unknown` · block (default content, not generated) |
| Structure | text + 1 CTAs |
| Source components | Button 3/3, Text 3/3, Container 3/3 |
| Source styles | `text--center` `button--center` |
| Uses | 3 on 3 pages |
| Templates | campaign-subpage (3) |
| EDS target | Default content |
| Note | Centered text + button |
| Example pages | [/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html) |

![source v_2bed43c59a16](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_cvrm_see-the-pattrns_diagnosis_html--6940e0d5/blocks/5c339a90.jpg)

#### D.15.8 `v_37fdc84c086b-text`

| Field | Value |
|---|---|
| Catalog | type `unknown` · block (default content, not generated) |
| Structure | 1 heading + 2 images + 1 paragraph block |
| Source components | Text 3/3, Container 3/3, Image 3/3, Title 3/3 |
| Source styles | `title--center` `title--color-title-1` `text--small` |
| Uses | 3 on 3 pages |
| Templates | campaign-subpage (3) |
| EDS target | Default content |
| Note | Title + text + image without a teaser (About ATTR amyloidosis, DE/FR/IT). Split from the catch-all v_37fdc84c086b (2026-09-30) |
| Example pages | [/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html)<br>[/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html) |

![source v_37fdc84c086b-text](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_cvrm_see-the-pattrns_about-amylodosis-attr_html--6b239aec/blocks/57dbda89.jpg)

#### D.15.9 `v_b25f473963c4`

| Field | Value |
|---|---|
| Catalog | type `unknown` · block (default content, not generated) |
| Structure | 1 CTAs |
| Source components | Button 3/3, Container 3/3 |
| Source styles | `button--center` |
| Uses | 3 on 3 pages |
| Templates | content-landing (3) |
| EDS target | Default content |
| Note | Centered button (Button Group, align-center) |
| Example pages | [/…/therapiegebiete/onkologie/prostata](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/onkologie/prostata.html)<br>[/…/therapiegebiete/onkologie/prostata](https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/onkologie/prostata.html)<br>[/…/therapiegebiete/onkologie/prostata](https://www.myastrazeneca.ch/it/startseite/therapiegebiete/onkologie/prostata.html) |

![source v_b25f473963c4](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_onkologie_prostata_html--b065b3ab/blocks/2d1f153b.jpg)

#### D.15.10 `v_ed6c5d348ec9`

| Field | Value |
|---|---|
| Catalog | type `unknown` · block (default content, not generated) |
| Structure | text + image |
| Source components | Text 6/6, Container 6/6, Image 6/6 |
| Source styles | `text--small` |
| Uses | 6 on 2 pages |
| Templates | content-landing (2) |
| EDS target | Default content |
| Note | Infographic image + small-print caption (text--small) |
| Example pages | [/…/therapiegebiete/cvrm/acutecare](https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/acutecare.html)<br>[/…/therapiegebiete/cvrm/acutecare](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/acutecare.html) |

![source v_ed6c5d348ec9](../catalog/.pages/www_myastrazeneca_ch_en_startseite_therapiegebiete_cvrm_acutecare_html--d422dc19/blocks/62b4caac.jpg)

#### D.15.11 `v_354e0ece5414`

| Field | Value |
|---|---|
| Catalog | type `unknown` · block (default content, not generated) |
| Structure | heading + 1 CTAs |
| Source components | Button 1/1, Container 1/1, Title 1/1 |
| Source styles | `title--center` `title--color-title-1` `button--center` |
| Uses | 1 on 1 pages |
| Templates | content-landing (1) |
| EDS target | Default content |
| Note | Centered title + button |
| Example pages | [/…/therapiegebiete/onkologie/brustkrebs](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/onkologie/brustkrebs.html) |

![source v_354e0ece5414](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_onkologie_brustkrebs_html--e6e67409/blocks/227dac8a.jpg)

#### D.15.12 `v_b1e664af6109`

| Field | Value |
|---|---|
| Catalog | type `unknown` · block (default content, not generated) |
| Structure | heading + 2 images |
| Source components | Container 1/1, Image 1/1, Title 1/1 |
| Source styles | `title--color-title-1` |
| Uses | 1 on 1 pages |
| Templates | campaign-subpage (1) |
| EDS target | Default content |
| ⚠️ Discrepancy | Detected as hero, but it is a heading plus an image |
| Example pages | [/…/therapiegebiete/cvrm/see-the-pattrns/symptomes](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/symptomes.html) |

![source v_b1e664af6109](../catalog/.pages/www_myastrazeneca_ch_de_startseite_therapiegebiete_cvrm_see-the-pattrns_symptomes_html--4eba725c/blocks/65aa2671.jpg)

---

## Appendix E: Source components (AEM) → EDS

Every AEM component on the 122 source pages, identified by its component name in the served HTML. "Outside catalog" counts instances that sit outside every catalogued block (header/footer chrome excluded). Those are content the automatic catalog did not capture. Source: `catalog/source-components.json`.

| Component | On your list | Pages | Uses | Outside catalog | EDS target | Status | Treatment |
|---|:---:|---:|---:|---:|---|---|---|
| Container | ✔ | 122 | 2372 | · | Section + Section Metadata | ✅ built | EDS section; style classes (background, spacing) become Section Metadata. The 2- and 3-column wrap containers become Cards or Columns |
| Teaser | ✔ | 101 | 581 | 105 | Hero / Cards / Columns / Default content | 🟡 partial | Split by style: teaser--home-hero → Hero; image-top-text-bottom in a column wrap → Cards; text-image → Columns; plain intro teaser → default content |
| Title | ✔ | 118 | 384 | · | Default content | - | Heading (h1–h3). title--color-title-1 is the Mulberry heading colour already in the design tokens |
| Button | ✔ | 122 | 261 | 100 | Buttons | ✅ built | Link with bold / italic / bold+italic for Primary / Secondary / Tertiary; Button Group block for alignment and grouping |
| Tab | ✔ | 4 | 4 | · | Tabs | ❌ to build | Tabs block, one section per tab (the panels contain card grids) |
| Text | ✔ | 122 | 1040 | 513 | Default content / In-Page Nav | - | Default content. The text--in-page-nav-hr style is an anchor list → In-Page Nav block; text--small is small print |
| Accordion | ✔ | 4 | 4 | · | Accordion | ✅ built | Accordion block |
| List | ✔ | 31 | 31 | 23 | In-Page Nav | ❌ to build | Horizontal section sub-navigation on campaign and Trixeo pages (Home · About ATTR · Symptoms · …, active item underlined) → horizontal In-Page Nav option |
| Form Container | ✔ | 4 | 4 | · | Form | ❌ to build | The form wrapper of Dynamic Form V2 (same element); no separate block |
| Dynamic Form V2 | ✔ | 4 | 4 | · | Form | ❌ to build | Form block; fields and submission come from the AstraZeneca form service today |
| Mega Menu | ✔ | 122 | 122 | · | Header | ✅ built | Header block fed from /nav (built: 4 levels, 70 items) |
| Search | ✔ | 122 | 122 | · | Search | ❌ to build | Search field is in the header; results page needs the Search block and a query index |
| Embed | ✔ | 3 | 3 | · | Embed (Kaltura video) | ❌ to build | The source 'Video' component (class dyamic-embed) embeds Kaltura players → Embed block with a Kaltura handler |
| Master Content List | ✔ | 4 | 4 | 4 | Drop | - | Empty for anonymous visitors: no items and no configuration in the served HTML (filled client-side, presumably for logged-in users). The visible therapy cards are separate teasers (Cards). Confirm what it shows when logged in |
| Image |  | 122 | 1322 | · | Default content | - | Image. AEM renders a desktop and a mobile rendition; keep one |
| Breadcrumb |  | 122 | 122 | · | Breadcrumbs | ❌ to build | Visible under the header on every page |
| Experience Fragment |  | 122 | 267 | · | Header | ✅ built | Header, footer and self-certification are experience fragments → nav/footer fragments (built) and a modal fragment |
| User (Login) |  | 122 | 122 | · | Header | ✅ built | Login button in the header (links out to the login service) |
| Content Paywall |  | 50 | 50 | 50 | Blocked: content not public | ⛔ blocked | "Register or log in" wall on all 50 Trixeo pages. The product content behind it is NOT in the public HTML, so it can't be migrated from the public site |
| Self-certification |  | 15 | 15 | · | Modal (HCP self-certification) | ❌ to build | "I am a healthcare professional / I am a patient" interstitial on the 15 campaign pages → Modal |
| Social Features |  | 98 | 98 | 96 | Drop | - | Login-only bookmarking; anonymous visitors get unfilled placeholders ("errorMessage requestToSignInContent") |

### E.1 Tab

4 pages (product-overview 4) → **Tabs**. Tabs block, one section per tab (the panels contain card grids). Example: [/…/produkte](https://www.myastrazeneca.ch/de/startseite/produkte.html)

![source component Tab](../catalog/component-shots/src-tab.jpg)

### E.2 List

31 pages (product-detail 16, campaign-subpage 12, campaign-landing 3) → **In-Page Nav**. Horizontal section sub-navigation on campaign and Trixeo pages (Home · About ATTR · Symptoms · …, active item underlined) → horizontal In-Page Nav option. Example: [/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html)

![source component List](../catalog/component-shots/src-list.jpg)

### E.3 Dynamic Form V2

4 pages (contact 4) → **Form**. Form block; fields and submission come from the AstraZeneca form service today. Example: [/…/contact-us](https://www.myastrazeneca.ch/de/startseite/contact-us.html)

![source component Dynamic Form V2](../catalog/component-shots/src-dynamic-form-v2.jpg)

### E.4 Search

122 pages (content-landing 49, resource-detail 34, product-detail 16, campaign-subpage 12, contact 4, product-overview 4, campaign-landing 3) → **Search**. Search field is in the header; results page needs the Search block and a query index. Example: [/de/startseite](https://www.myastrazeneca.ch/de/startseite.html)

![source component Search](../catalog/component-shots/src-search.jpg)

### E.5 Embed

3 pages (campaign-subpage 3) → **Embed (Kaltura video)**. The source 'Video' component (class dyamic-embed) embeds Kaltura players → Embed block with a Kaltura handler. Example: [/…/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html)

![source component Embed](../catalog/component-shots/src-embed.jpg)

### E.6 Breadcrumb

122 pages (content-landing 49, resource-detail 34, product-detail 16, campaign-subpage 12, contact 4, product-overview 4, campaign-landing 3) → **Breadcrumbs**. Visible under the header on every page. Example: [/…/therapiegebiete/cvrm/see-the-pattrns/diagnosis](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis.html)

![source component Breadcrumb](../catalog/component-shots/src-breadcrumb.jpg)

### E.7 Content Paywall

50 pages (resource-detail 34, product-detail 16) → **Blocked: content not public**. "Register or log in" wall on all 50 Trixeo pages. The product content behind it is NOT in the public HTML, so it can't be migrated from the public site. Example: [/…/produkte/trixeo/aerosphere-technologie](https://www.myastrazeneca.ch/de/startseite/produkte/trixeo/aerosphere-technologie.html)

![source component Content Paywall](../catalog/component-shots/src-content-paywall.jpg)

### E.8 Self-certification

15 pages (campaign-subpage 12, campaign-landing 3) → **Modal (HCP self-certification)**. "I am a healthcare professional / I am a patient" interstitial on the 15 campaign pages → Modal. Example: [/…/therapiegebiete/cvrm/see-the-pattrns/home](https://www.myastrazeneca.ch/de/startseite/therapiegebiete/cvrm/see-the-pattrns/home.html)

![source component Self-certification](../catalog/component-shots/src-self-certification.jpg)

<!-- APPENDIX:END -->
