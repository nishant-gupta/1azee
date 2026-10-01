/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards (variant: light). Base: cards.
 * Source: https://www.myastrazeneca.ch/en/startseite.html (.container--3-column-wrap)
 * Catalog variant: v_5d7c92bb4412 (block-mapping.json)
 * Generated: 2026-09-23, reworked 2026-10-01 (was the cards-light-withimg fork)
 *
 * Library structure (2 columns, multiple rows):
 *   Row 1: block name
 *   Each card row: [ Image | Title (heading) + Description + CTA link list ]
 *
 * Source specifics: the container holds one `.teaser` per card. Each teaser has a
 * desktop and mobile image, an <h4 class="cmp-teaser__title"> and a
 * .cmp-teaser__description block containing paragraphs and a list of <a> links.
 */
export default function parse(element, { document }) {
  // Each card is a .teaser within the container.
  const cardEls = Array.from(element.querySelectorAll(':scope > .cmp-container > .teaser, :scope .teaser'))
    // Keep only outermost teasers (avoid nested duplicates if any).
    .filter((el, _i, arr) => !arr.some((other) => other !== el && other.contains(el)));

  const cells = [];

  cardEls.forEach((card) => {
    // Image — prefer desktop, fall back to any card image.
    const image = card.querySelector('.cmp-teaser__image-desktop img')
      || card.querySelector('.cmp-teaser__image img')
      || card.querySelector('img');

    // Text content cell: title, description, CTA links.
    const contentCell = [];

    // Look in the content area only: the mobile image link (a.cmp-teaser__title-link) also
    // matches a loose [class*="title"] and comes first in the DOM.
    const contentWrap = card.querySelector('.cmp-teaser__content') || card;
    const title = contentWrap.querySelector('.cmp-teaser__title, h1, h2, h3, h4, h5, h6');
    if (title) {
      // Unwrap the <p> AEM puts inside the title (keeps the heading level and any link).
      title.querySelectorAll('p').forEach((p) => p.replaceWith(...p.childNodes));
      contentCell.push(title);
    }

    const description = contentWrap.querySelector('.cmp-teaser__description, [class*="description"]');
    if (description) {
      contentCell.push(description);
    } else {
      // Fallback: pull loose paragraphs / links from the content wrapper.
      Array.from(contentWrap.querySelectorAll(':scope > p, :scope > a')).forEach((n) => contentCell.push(n));
    }

    // CTA (e.g. "PDF Download" on resource cards).
    const actions = contentWrap.querySelector('.cmp-teaser__action-container');
    if (actions && !contentCell.some((n) => n.contains(actions))) contentCell.push(actions);

    // Only emit a card row if it has content.
    if (image || contentCell.length) {
      cells.push([image || '', contentCell.length ? contentCell : '']);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards', variants: ['light'], cells });
  element.replaceWith(block);
}
