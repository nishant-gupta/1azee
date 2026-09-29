# OneAZ Design Tokens

Extracted from the OneAZ Figma foundation files. Source of truth for typography and color tokens across the OneAZ brand.

---

# Typography

Extracted from the OneAZ Figma typography spec (two source tables: the responsive type-scale spreadsheet, and a rendered type-scale preview).

---

## Font families

| Family | Usage |
|---|---|
| **Lexia** | Headers/heading text |
| **Inter** | Body text |

## Font weights

| Weight | Usage |
|---|---|
| Regular | Paragraphs, helper text, articles |
| Medium | Button text, labels, CTA text, some headings |
| Bold | Best for H1 headings or hero sections |
| Italic | Paragraphs, helper text, articles |
| Medium Italic | Best for H1 headings or hero sections |
| Bold Italic | Best for H1 headings or hero sections |

## Breakpoints

| Column | Viewport width |
|---|---|
| Desktop | 1440px |
| Tablet | 768px |
| Mobile | 375px |

## Type scale (responsive)

All values in px. Source: the responsive spec table (per-breakpoint Desktop/Tablet/Mobile columns) — treated as authoritative over the rendered preview, which only shows a single (desktop) size per style. See the H4 discrepancy noted below.

| Style | Property | Desktop | Tablet | Mobile |
|---|---|---|---|---|
| **H1** | font-size | 56 | 56 | 36 |
| | line-height | 60 | 60 | 40 |
| | paragraph-spacing | 60 | 60 | 40 |
| **H2** | font-size | 46 | 46 | 36 |
| | line-height | 50 | 50 | 40 |
| | paragraph-spacing | 50 | 50 | 40 |
| **H3** | font-size | 36 | 26 | 26 |
| | line-height | 40 | 40 | 34 |
| | paragraph-spacing | 40 | 40 | 34 |
| **H4** | font-size | 26 | 26 | 26 |
| | line-height | 34 | 34 | 34 |
| | paragraph-spacing | 34 | 34 | 34 |
| **H5** | font-size | 24 | 19 | 19 |
| | line-height | 28 | 28 | 28 |
| | paragraph-spacing | 28 | 28 | 28 |
| **H6** | font-size | 14 | 14 | 14 |
| | line-height | 16 | 16 | 16 |
| | paragraph-spacing | 16 | 16 | 16 |
| **Body** | font-size | 16 | 16 | 16 |
| | line-height | 24 | 24 | 24 |
| | paragraph-spacing | 24 | 24 | 24 |
| **Body-Large** | font-size | 18 | 18 | 18 |
| | line-height | 28 | 28 | 28 |
| | paragraph-spacing | 28 | 28 | 28 |
| **Link** | font-size | 16 | 16 | 16 |
| | line-height | 24 | 24 | 24 |
| | paragraph-spacing | 24 | 24 | 24 |
| **Details** | font-size | 12 | 12 | 12 |
| | line-height | 16 | 16 | 16 |
| | paragraph-spacing | 16 | 16 | 16 |

**Pattern worth noting**: every style's Tablet (768px) value equals either its Desktop (1440px) or its Mobile (375px) value — never a distinct third number. So although this is authored as a 3-tier system, it collapses to just **2 real value-changes** across the 1440→375 range: H1/H2/H3(line-height+spacing)/H6/Body/Body-Large/Link/Details hold their Desktop value all the way down to 768px and only drop at 375px; H3(font-size) and H5(font-size) drop earlier — already at their Mobile value by 768px, with Desktop (1440px) as the sole outlier.

---

## Discrepancy to confirm with design

The rendered type-scale preview (second source image) shows **H4 as 36px / 40px / 40px** (font-size/line-height/paragraph-spacing), visually identical to H3 in that same preview. The responsive spec table (first source image) instead lists **H4 as 26px / 34px / 34px** — smaller than H3, as expected for a descending scale. These two sources disagree on H4 specifically; every other style matches between the two sources (accounting for the second image only showing a single desktop-ish size, not the full responsive breakdown).

**This doc uses the spec table's values (26/34/34)** since it's the more detailed, structured source and its progression (H1 > H2 > H3 > H4 > H5 > H6) is internally consistent, whereas the preview's H3=H4 duplication looks like a copy/paste artifact in that Figma frame. **Flag this to design for confirmation before treating either as final.**

---

# Colors

Extracted from the OneAZ Figma color foundation ("Standard Palette" plus the AstraZeneca product-brand override — the same Figma frame also defines 14 other per-product-brand palettes, e.g. Bevespi, Fasenra, Fluenz, Forxiga, Imfinzi, Lokelma, Lynparza, Symbicort, Tagrisso, Tezspire, Trixeo, Truqap, Wainua, Calquence, each following the same Background/Text/Button-Primary/Button-Secondary structure — those remain out of scope for this pass).

Each token maps to a named color-ramp reference (e.g. `Platinum-3`), not a hex value — the Figma export only exposes the ramp name + shade number, not the resolved hex. Pull exact hex/OKLCH values from Figma's variables panel directly before implementing these as CSS custom properties.

## Background

| Token | Color reference | hex code |
|---|---|---|
| `--background-supporting-1` | Platinum-3 | #EBEFEE |
| `--background-supporting-2` | White | #FFFFFF |

## Text

| Token | Color reference | Hex Code |
|---|---|---|
| `--text-body-1` | Graphite-12 | #3C4242 |
| `--text-body-2` | White | #D8DFDE |
| `--text-label-1` | Graphite-9 | #8D8F8F |
| `--text-label-2` | Graphite-10 | #656969 |
| `--text-placeholder-1` | Graphite-8 | #B2B4B4 |
| `--text-warning` | Magenta-11 | #D0006F |

## Button / Tertiary

| Token | Color reference | Hex Code |
|---|---|---|
| `--button-tertiary-background` | White | #D8DFDE |
| `--button-tertiary-border` | Graphite-12 | #3C4242 |
| `--button-tertiary-text` | Graphite-12 |  #3C4242 |

## Table

| Token | Color reference | Hex Code |
|---|---|---|
| `--table-header` | Platinum-5 | #D8DFDE |
| `--table-row-bg-1` | White | #FFFFFF |
| `--table-row-bg-2` | Platinum-3 | #EBEFEE |
| `--table-highlight` | Mulberry-5 | #F6CEE7 |
| `--table-tabs-on` | Magenta-11 | #D0006F | 
| `--table-tabs-off` | Platinum-3 | #EBEFEE |
| `--table-background-1` | Platinum-7 | #C4CFCD |

## Forms

| Token | Color reference | Hex Code |
|---|---|---|
| `--forms-border-1` | Platinum-3 | #EBEFEE |
| `--forms-border-2` | Platinum-5 | #D8DFDE |
| `--forms-border-3` | Graphite-6 | #D8DADA |
| `--forms-border-4` | Graphite-12 | #3C4242 |
| `--forms-border-5` | White | #FFFFFF |
| `--forms-border-6` | Magenta-11 | #D0006F | 
| `--forms-border-7` | Graphite-8 | #B2B4B4 |
| `--forms-border-8` | Graphite-10 | #656969 |

## Pop-up

| Token | Color reference | Hex Code |
|---|---|---|
| `--popup-backdrop` | Graphite-12 | #3C4242 |

## Icon

| Token | Color reference | Hex Code |
|---|---|---|
| `--icon-light` | White | #FFFFFF |
| `--icon-dark` | Graphite-12 | #3C4242 |

## Inpage


| Token | Color reference | hex Code |
|---|---|---|
| `--inpage-text-1` | Magenta-8 | #E366A9 |

**Pattern worth noting**: `Graphite-12` (`#3C4242`) is reused across six different roles (`text-body-1`, `button-tertiary-border`, `button-tertiary-text`, `forms-border-4`, `popup-backdrop`, `icon-dark`) and `Magenta-11` (`#D0006F`) across three (`text-warning`, `table-tabs-on`, `forms-border-6`) — both consistently the same hex everywhere they appear, confirming these ramp+shade names are true shared primitives rather than independently-picked colors per role.

---

## AstraZeneca (Brand Override)

Extracted from the OneAZ Figma color foundation — the AstraZeneca product-brand palette, overriding the Standard Palette above wherever an AstraZeneca-branded surface is rendered. Same four groups as every other brand palette in that frame: Background, Text, Button/Primary, Button/Secondary.

### Background

| Token | Color reference | Hex Code |
|---|---|---|
| `--background-core-1` | Mulberry-12 | #830051 |
| `--background-core-2` | Mulberry-13 | #4F0031 |
| `--background-core-3` | Magenta-11 | #D0006F |
| `--background-secondary-1` | Gold-10 | #F0AB00 |
| `--background-secondary-2` | Platinum-8 | #9DB0AC |
| `--background-secondary-3` | Graphite-12 | #3C4242 |

### Text

| Token | Color reference | Hex Code |
|---|---|---|
| `--text-title-1` | Mulberry-12 | #830051 |
| `--text-title-2` | Magenta-11 | #D0006F |
| `--text-interaction` | Magenta-11 | #D0006F |

### Button / Primary

| Token | Color reference | Hex Code |
|---|---|---|
| `--button-primary-background` | Magenta-11 | #D0006F |
| `--button-primary-border` | Magenta-11 | #D0006F |
| `--button-primary-text` | White | #FFFFFF |

### Button / Secondary

| Token | Color reference | Hex Code |
|---|---|---|
| `--button-secondary-background` | White | #FFFFFF |
| `--button-secondary-border` | Magenta-11 | #D0006F |
| `--button-secondary-text` | Magenta-11 | #D0006F |

---

# Spacing

Source: "oneAZ Design System v3.2" Figma page, Foundation/Spacing. Described in-source as "a comprehensive spacing system proportional to a 4px scale" — mostly true (every value is a multiple of 4 except `xxx-sm`, a 2px half-step at the bottom of the scale for the tightest hairline-level gaps).

| Token | Size |
|---|---|
| `none` | 0px |
| `xxx-sm` | 2px |
| `xx-sm` | 4px |
| `x-sm` | 8px |
| `sm` | 12px |
| `md` | 16px |
| `big` | 20px |
| `x-big` | 24px |
| `xx-big` | 28px |
| `xxx-big` | 32px |
| `lg` | 40px |
| `x-lg` | 48px |
| `xx-lg` | 64px |
| `xxx-lg` | 80px |
| `huge` | 96px |
| `x-huge` | 128px |
| `xx-huge` | 160px |
| `xxx-huge` | 192px |

**Naming note**: the scale isn't a single monotonic `sm→lg` progression — it runs `sm` (4 steps) → `big` (4 steps) → `lg` (4 steps) → `huge` (4 steps), i.e. four separate size "families" of four steps each, rather than one continuous `xxx-sm…xxx-lg` run. Worth keeping in mind when mapping these to spacing utility classes so the naming doesn't get flattened/misread as a single linear scale.
