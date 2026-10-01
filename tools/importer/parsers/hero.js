/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero (variant: minimal-dark). Base: hero.
 * Source: https://www.myastrazeneca.ch/en/startseite.html (.teaser--home-hero)
 * Catalog variants: v_b26d6cceada2 (+ duplicates v_2ab6094d0f33, v_42845b3e07dd), block-mapping.json
 * Generated: 2026-09-23, reworked 2026-10-01 (was the hero-minimal-dark-withimg fork)
 *
 * Library structure (EDS Hero convention, blocks/hero/README.md): 1 column, 3 rows:
 *   Row 1: block name + variant ("Hero (minimal-dark)")
 *   Row 2: background image (optional)
 *   Row 3: title (heading) + subheading + optional call-to-action
 * The hero block lays itself out from this content (image-only cell = background).
 *
 * Source specifics: teaser with a desktop and a mobile background image, an
 * <h1 class="cmp-teaser__title"> holding one <p> per line (e.g. "Chronic obstructive" /
 * "pulmonary disease"), and a .cmp-teaser__description.
 */
export default function parse(element, { document }) {
  // Row 2 — background image: the desktop rendition, falling back to any teaser image.
  const bgImage = element.querySelector('.cmp-teaser__image-desktop img')
    || element.querySelector('.cmp-teaser__image img')
    || element.querySelector('img');

  // Row 3 — title: unwrap AEM's <p> lines, keeping each line break (joining them dropped the space).
  const sourceTitle = element.querySelector('.cmp-teaser__title, h1, h2');
  let title = null;
  if (sourceTitle) {
    title = document.createElement(/^H[1-6]$/.test(sourceTitle.tagName) ? sourceTitle.tagName : 'h1');
    const lines = [...sourceTitle.querySelectorAll(':scope > p')];
    if (lines.length) {
      lines.forEach((p, i) => {
        if (i) title.append(document.createElement('br'));
        title.append(...p.childNodes);
      });
    } else {
      title.append(...sourceTitle.childNodes);
    }
  }

  // Row 3 — subheading and call-to-action.
  const description = element.querySelector('.cmp-teaser__description');
  const ctaLinks = [...element.querySelectorAll('.cmp-teaser__action-link')];

  // Empty-block guard.
  if (!title && !description && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  if (bgImage) cells.push([bgImage]);
  const content = [title, description, ...ctaLinks].filter(Boolean);
  if (content.length) cells.push([content]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', variants: ['minimal-dark'], cells });
  element.replaceWith(block);
}
