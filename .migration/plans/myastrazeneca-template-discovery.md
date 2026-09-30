# AstraZeneca CH: AEM Edge Delivery Migration Plan

**Status as of 2026-09-29.** Details, evidence, and open issues: `docs/site-analysis.md` (published at `/docs/site-analysis`).

## Objective
Migrate **https://www.myastrazeneca.ch/** to AEM Edge Delivery Services (Document Authoring). Start with template discovery to understand the site's structure before committing to full page migration. Header/navigation and footer are in scope.

## Approach
Phased migration. Phase 1 produced the site catalog: templates, representative pages, block variants. Later phases run against that catalog.

---

## Phase 1: Site Analysis & Template Discovery ✅
- [x] Confirm project type: **Document Authoring (da)**
- [x] Discover all site URLs: 126 from the sitemap, 4 locales (DE 46, FR 45, IT 20, EN 16)
- [x] Analyze pages and group them into templates: 122 analyzed; 5 dead sitemap links (404) excluded
- [x] Produce the site catalog: 7 templates, 37 block variants (18 known types, 19 default-content patterns)
- [x] Review the catalog: **templates regrouped 2026-09-29.** 33 pages moved so that translated pages share a template (21 of 46 groups were split before, 0 after). Rules: `tools/importer/template-regrouping.json`

- [x] Map blocks to EDS: **reviewed 2026-09-29.** 21 source AEM components inventoried; all 430 catalogued block instances resolved in the source HTML. Result: 37 variants → 14 EDS blocks + default content (29 after merging 8 duplicates; 17 discrepancies flagged). Mapping: `tools/importer/block-mapping.json`; report Section 4, Appendices D–E
- [x] Apply the reviewed mapping to the catalog: **done 2026-09-30** (`tools/da/apply-block-mapping.js`). 41 type/block/class changes, catch-all split into a default-content variant (38 variants), duplicates merged by shared block + class; placement check passes

Templates: content-landing 49 · resource-detail 34 · product-detail 16 · campaign-subpage 12 · campaign-landing 3 · product-overview 4 · contact 4

**Blocker:** the 50 Trixeo pages (product-detail, resource-detail) hide their content behind a login paywall, so it isn't in the public HTML. Decide the source: an AEM export, a capture with an HCP login, or defer.

## Phase 2: Migration Scope Decision ✅ (first wave)
- [x] Present templates and confirm scope: **first wave = English homepage** (`/en/startseite`, content-landing)
- [x] Representative URL chosen for the first wave
- [x] Identify special pages: contact form (4 pages, *contact* template; form approach undecided); no commerce PDP/PLP

## Phase 3: Import Infrastructure & Content Import (in progress)
- [x] Parsers and transformers for content-landing (`hero-minimal-dark-withimg`, `cards-light-withimg`)
- [x] Import script built and bundled (`tools/importer/import-content-landing.js`)
- [x] English homepage imported and published (CTA imported as a Primary button)
- [x] Content published to DA with media, images verified: `tools/da/publish-content.js`
- [ ] Remaining templates and locales (see "Next")

## Phase 4: Navigation & Footer ✅
- [x] Header/navigation: 4-level megamenu (70 items), search, language switcher, login; desktop and mobile
- [x] Footer: brand block, legal and reporting link columns, revision code; desktop and mobile

## Phase 5: Design & Styling ✅ (for built components)
- [x] oneAZ design tokens (color, type scale, spacing) and brand fonts (Lexia, Inter)
- [x] Styled blocks and components: hero, cards, buttons (5 styles, 2 sizes, groups), in-page nav, accordion, table
- [ ] Build: tabs, form, embed (Kaltura), breadcrumbs, modal, search; style columns; add hero, cards and in-page-nav options (report Section 4.4)

## Phase 6: Validation (partial)
- [x] Post-import completeness check (32% score is a known false alarm: the metric counts stripped site chrome)
- [x] Live image verification of every published page
- [ ] Visual critique of migrated pages vs. the original site
- [ ] Address flagged issues and re-verify

---

## Next
The full pending list (P1–P15) is in Section 7.1 of the site analysis report.
1. Decide how to source the Trixeo content (P1).
2. Generate the missing block variants from the catalog (P3); the catalog now names each variant's block and class.
3. Fix section-metadata processing and add Breadcrumbs (every page).
4. Migrate **content-landing** across all locales (49 pages): style Columns, check Accordion against the source. The breast cancer pages need extra handling.
5. Build Tabs (sections-based) and product Cards; re-capture FR `/produkte.html`; migrate **product-overview**.
6. Migrate the See the pATTRns campaign (15 pages): Modal (self-certification), horizontal In-Page Nav, icon Cards, Kaltura Embed.
7. Decide the contact form backend; migrate **contact**. Migrate Trixeo once P1 is resolved.

## Notes & Considerations
- **Regulated content:** every page carries a revision code and the "healthcare professionals in Switzerland only" notice. Both must survive migration verbatim.
- **Uneven locales:** Trixeo exists in DE/FR only, and the campaign has no EN version. Plan migration waves per locale.
- **Cross-locale links:** the EN navigation links to DE product pages where no EN page exists.
- **Bot protection:** the source is behind CloudFront. Imports use saved snapshots, and assets are fetched through a browser session.
- Each migrated page gets a preview link `{branch}--1azee--nishant-gupta.aem.page/{path}` for review before any PR.
