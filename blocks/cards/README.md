# cards

A responsive grid of cards. On this site it is used with the **Light** variant: the oneAZ light card grid for therapy areas, key figures and resource downloads.

## Authoring (Document Authoring)

Model: `collection`. One row per card. The content decides each card's layout:

- a cell that holds only an image becomes the card **image** (on top);
- every other cell is the card **body**: heading, text, links or a button;
- a card without an image is text only.

| Cards (Light) | |
|---|---|
| (image) | **Cardiovascular, Renal and Metabolism** (Heading 4)<br>Short description.<br>[Heart failure](/…) · [Diabetes](/…) |
| (image) | **Respiratory & Immunology** (Heading 4)<br>Short description.<br>[Asthma](/…) |

## Supported variations

| Variant | Authored as | Result |
|---|---|---|
| default | `Cards` | Boilerplate grid: white cards with a grey border, 4:3 images, auto-fill columns |
| `light` | `Cards (Light)` | oneAZ light cards: light surface, Mulberry titles, Magenta links, 3:2 images; 1 / 2 / 3 columns (mobile / tablet / desktop) |

The catalog also lists `icon` (2-up icon cards), `bordered` (text cards) and `product` (product cards with a hover overlay) options; they are not styled yet.

## Source mapping

Implements source variant `v_5d7c92bb4412` (the 3-up teaser grid, 46 pages) as `light`. See `metadata.json` and `tools/importer/block-mapping.json`.

The former `cards-light-withimg` block is a deprecated alias of `Cards (Light)`, kept until all pages are re-published with the new name.
