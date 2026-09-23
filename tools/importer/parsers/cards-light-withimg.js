/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-light-withimg. Base: cards.
 * Source: https://www.myastrazeneca.ch/en/startseite.html (.container--3-column-wrap)
 * Generated: 2026-09-23
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

    const title = card.querySelector('.cmp-teaser__title, h1, h2, h3, h4, h5, h6, [class*="title"]');
    if (title) contentCell.push(title);

    const description = card.querySelector('.cmp-teaser__description, [class*="description"]');
    if (description) {
      contentCell.push(description);
    } else {
      // Fallback: pull loose paragraphs / links from the content wrapper.
      const contentWrap = card.querySelector('.cmp-teaser__content') || card;
      Array.from(contentWrap.querySelectorAll(':scope > p, :scope > a')).forEach((n) => contentCell.push(n));
    }

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

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-light-withimg', cells });
  element.replaceWith(block);
}
