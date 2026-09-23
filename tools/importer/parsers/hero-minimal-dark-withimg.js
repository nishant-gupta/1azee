/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-minimal-dark-withimg. Base: hero.
 * Source: https://www.myastrazeneca.ch/en/startseite.html (.teaser--home-hero)
 * Generated: 2026-09-23
 *
 * Library structure (1 column, 3 rows):
 *   Row 1: block name
 *   Row 2: Background Image (optional)
 *   Row 3: Title (heading) + Subheading + optional CTA
 *
 * Source specifics: teaser markup with a desktop and mobile background image,
 * an <h1 class="cmp-teaser__title"> (wrapping the title in a <p>) and a
 * .cmp-teaser__description block. Falls back to generic selectors for variation.
 */
export default function parse(element, { document }) {
  // Background image — prefer the desktop variant, fall back to any teaser image.
  const bgImage = element.querySelector('.cmp-teaser__image-desktop img')
    || element.querySelector('.cmp-teaser__image img')
    || element.querySelector('img[class*="background"], img[class*="hero-bg"]')
    || element.querySelector('img');

  // Title — the source wraps the heading text in a <p> inside the <h1>.
  const title = element.querySelector('.cmp-teaser__title, h1, h2, [class*="title"]');

  // Subheading / description text.
  const description = element.querySelector('.cmp-teaser__description, p.hero-description, [class*="description"], [class*="subtitle"]');

  // Optional CTA links (none in the current source, but support the variation).
  const ctaLinks = Array.from(element.querySelectorAll('.cmp-teaser__action-link, a.cta, a.button, .cmp-teaser__content a'));

  // Empty-block guard.
  if (!title && !description && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (optional).
  if (bgImage) cells.push([bgImage]);

  // Row 3: title + subheading + CTA, all in a single cell (1-column block).
  const contentCell = [];
  if (title) contentCell.push(title);
  if (description) contentCell.push(description);
  contentCell.push(...ctaLinks);
  if (contentCell.length) cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-minimal-dark-withimg', cells });
  element.replaceWith(block);
}
