I'll help you migrate myastrazeneca.ch to AEM Edge Delivery Services. Let me clarify a couple of things to build the right plan.# AztraZeneca CH — AEM Edge Delivery Migration Plan

## Objective
Migrate **https://www.myastrazeneca.ch/** to AEM Edge Delivery Services. Starting with **template discovery** to understand the site's structure before committing to full page migration, and including **header/navigation and footer** in the overall scope.

## Approach
This is a phased migration. Phase 1 (template discovery) is the current focus and produces a site catalog that tells us how many distinct page types exist and which pages represent each. Later phases (content import, nav, footer, design, validation) execute against that catalog once we've reviewed it together.

---

## Phase 1 — Site Analysis & Template Discovery (current focus)
- [ ] Confirm project type and the correct Block Library endpoint for this project (doc / da / xwalk)
- [ ] Discover all site URLs via sitemap, with crawl fallback if no sitemap is available
- [ ] Analyze representative pages and group similar pages into page templates
- [ ] Produce a site catalog: template count, representative URL per template, and detected block variants
- [ ] Review the catalog together and decide which templates/pages to migrate

## Phase 2 — Migration Scope Decision (checkpoint)
- [ ] Present discovered templates and confirm which to migrate (all vs. subset)
- [ ] Confirm one representative URL per template to migrate first
- [ ] Identify any special pages (product/PDP, listing/PLP, forms) that may need dedicated handling

## Phase 3 — Import Infrastructure & Content Import
- [ ] Generate block parsers and page transformers for the confirmed templates
- [ ] Build and bundle the import script
- [ ] Run bulk import for the selected pages
- [ ] Preview imported pages locally and verify content completeness

## Phase 4 — Navigation & Footer
- [ ] Migrate the site header/navigation (desktop, mobile, and any megamenu behavior)
- [ ] Migrate the footer (desktop, mobile, validation)

## Phase 5 — Design & Styling
- [ ] Extract design tokens and apply site-level styling
- [ ] Style each migrated block variant to match the original

## Phase 6 — Validation
- [ ] Run post-import validation (content completeness scoring per page)
- [ ] Visual critique of migrated pages vs. the original site
- [ ] Address flagged issues and re-verify

---

## Notes & Considerations
- **Pharma content**: myastrazeneca.ch is an AstraZeneca Switzerland site — likely multilingual (DE/FR/IT) and possibly gated/regulated content. Language variants may create additional templates worth confirming during discovery.
- **Commerce/Forms plugins**: If discovery surfaces product pages, listing pages, or complex forms, dedicated commerce or forms workflows are available but not currently enabled. I can offer to enable them if needed.
- Each migrated page will get a preview link in the form `{branch}--1azee--nishant-gupta.aem.page/{path}` for review before any PR.

## Checklist (immediate next steps)
- [ ] Approve this plan (exit plan mode to begin execution)
- [ ] Run template discovery (URL discovery → page analysis → catalog)
- [ ] Reconvene to review the catalog and lock migration scope

> **Execution note:** Running discovery, analysis, and any file/script generation requires **Execute mode** — plan mode is read-only. Approve the plan to proceed.
