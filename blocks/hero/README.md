# hero

A banner with an optional background image behind a heading and a short intro. On this site it is used with the **Minimal Dark** variant: the oneAZ dark brand banner at the top of landing and therapy-area pages.

## Authoring (Document Authoring)

Model: `standalone`. The content decides the layout:

- a row (or cell) that holds only an image becomes the **background image**;
- an image in the same cell as the text is used as the background too;
- everything else (heading, copy, buttons) is the **text overlay**;
- without an image the hero is text only.

| Hero (Minimal Dark) |
|---|
| (background image) |
| **Welcome to myAstraZeneca!** (Heading 1)<br>Discover comprehensive information about our therapy areas and products. |

Use one Heading 1 and a short paragraph.

## Supported variations

| Variant | Authored as | Result |
|---|---|---|
| default | `Hero` | Image background, white heading (boilerplate look) |
| `minimal-dark` | `Hero (Minimal Dark)` | oneAZ dark brand banner: Mulberry surface, light heading and copy, larger intro text |

The catalog also lists `centered` and `campaign-banner` options (products index, See the pATTRns); they are not styled yet.

## Source mapping

Implements source variant `v_b26d6cceada2` (dark home hero, 43 pages) and its duplicates as `minimal-dark`. See `metadata.json` and `tools/importer/block-mapping.json`.

This variant replaced the former `hero-minimal-dark-withimg` block (removed 2026-10-01 after all pages were re-published as "Hero (Minimal Dark)").
