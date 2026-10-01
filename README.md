# myAstraZeneca CH on AEM Edge Delivery Services

Migration of **https://www.myastrazeneca.ch/** (AstraZeneca Switzerland's portal for healthcare professionals) to AEM Edge Delivery Services, authored in **Document Authoring** (`nishant-gupta/1azee`). Styling follows the **oneAZ** design system.

## Environments
- Preview: https://main--1azee--nishant-gupta.aem.page/
- Live: https://main--1azee--nishant-gupta.aem.live/
- Site analysis report: https://main--1azee--nishant-gupta.aem.live/docs/site-analysis (source: `docs/site-analysis.md`)
- Migration plan and status: `.migration/plans/myastrazeneca-template-discovery.md`

## Templates

7 page templates cover the 122 source pages (details and per-page lists in the site analysis report):

| Template | Pages | What it is |
|---|---:|---|
| content-landing | 49 | Homepage and therapy-area pages |
| resource-detail | 34 | Trixeo resource documents (DE/FR) |
| product-detail | 16 | Trixeo product pages with product tabs (DE/FR) |
| campaign-subpage | 12 | See the pATTRns interior pages |
| campaign-landing | 3 | See the pATTRns home |
| product-overview | 4 | Products index |
| contact | 4 | Contact form |

## Blocks

Each block with an authoring guide has a `README.md` in its folder; `metadata.json` records the source variant it implements. The reviewed mapping of every source component and catalog variant to an EDS block (including blocks still to build: tabs, form, embed, breadcrumbs, modal, search) is in `tools/importer/block-mapping.json`, and is explained in Section 4 of the site analysis report.

| Block | Purpose |
|---|---|
| `header`, `footer` | Global navigation (4-level megamenu, search, language switcher) and footer, loaded from `/nav` and `/footer` |
| `hero` | Banner with a background image; layout follows the authored content. Variant `minimal-dark` (`Hero (Minimal Dark)`) is the oneAZ dark hero used on the site. `hero-minimal-dark-withimg` is a deprecated alias of it |
| `cards-light-withimg` | Therapy-area card grid |
| `accordion` | oneAZ collapsible sections |
| `in-page-nav` | oneAZ Links / In-Page Nav |
| `button-group` | oneAZ button groups (buttons themselves are styled in `styles/styles.css`) |
| `table` | Data tables |
| `cards`, `columns`, `fragment` | Boilerplate blocks |

Design tokens (color, type scale, spacing) are in `styles/styles.css`; fonts in `styles/fonts.css` and `fonts/`.

## Migration tooling

Not served (`tools/da/*` is in `.hlxignore`). Run from the repo root.

| Command | What it does |
|---|---|
| `node tools/da/publish-content.js [page …]` | Uploads pages to Document Authoring with their images, previews, publishes, and verifies that every image loads |
| `node tools/da/inventory-source-components.js` | Inventories the AEM components on every source page and ties each catalogued block variant to them (`catalog/source-components.json`) |
| `node tools/da/apply-block-mapping.js [--dry-run]` | Applies `tools/importer/block-mapping.json` to `catalog/block-catalog.json` (type, block, variant class; splits). Re-run after any catalog rebuild |
| `node tools/da/capture-component-shots.js` | Screenshots source components and the built EDS blocks for the report (`catalog/component-shots/`) |
| `node tools/da/build-site-analysis.js --publish` | Regenerates the report appendices from `catalog/` and `tools/importer/block-mapping.json`, and publishes `/docs/site-analysis` |
| `node tools/da/apply-template-regrouping.js` | Applies the reviewed template grouping (`tools/importer/template-regrouping.json`) to the catalogs and rebuilds the catalog report. Re-run it after any catalog rebuild |
| `node tools/sidekick/build-block-library.js` | Regenerates the Sidekick block library: demo pages, `blocks.json`, `library.json`, and the DA library sheets `templates.json` and `icons.json` (one row per `icons/*.svg`) |
| `node tools/da/publish-library.js` | Uploads the DA library sheets and the icon previews (`/block-library/icons/`) to Document Authoring and verifies them. Run after adding or renaming icons |

The block library (`/tools/sidekick/library.json`, `/block-library/…`) is Document Authoring content. Publish it with `publish-content.js` after regenerating it.

Pages are imported with the importer in `tools/importer/`: parsers, transformers, and `import-content-landing.js`.

## Documentation

Before using the aem-boilerplate, we recommand you to go through the documentation on https://www.aem.live/docs/ and more specifically:
1. [Developer Tutorial](https://www.aem.live/developer/tutorial)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `aem-boilerplate` template
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `1azee` directory in your favorite IDE and start coding :)
