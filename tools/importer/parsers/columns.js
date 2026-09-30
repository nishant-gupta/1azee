/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns. Base: columns.
 * Source: https://www.myastrazeneca.ch/en/startseite/therapiegebiete/cvrm/acutecare.html
 * Catalog variants: v_37fdc84c086b, v_6defe37a8d19 (text beside image; block-mapping.json)
 * Generated: 2026-09-30
 *
 * Library structure (EDS Columns convention): row 1 = block name; each following row has
 * one cell per column, same number of columns in every row, no nested blocks.
 * Here: a single row of 2 columns, [ text | image ] or [ image | text ], following the
 * visual order on the source page.
 *
 * Source specifics: an AEM text-image teaser (.cmp-teaser) with a desktop and a mobile
 * image, an optional <h4 class="cmp-teaser__title"> (its text wrapped in a <p>), a
 * .cmp-teaser__description and an optional CTA (.cmp-teaser__action-container).
 * teaser--text-image puts the text first; without it the image comes first.
 */
export default function parse(element, { document }) {
  const teaser = element.querySelector('.cmp-teaser') || element;

  // Image column — the desktop rendition. A teaser with only a mobile rendition shows no
  // image on desktop (e.g. "Useful product information" on most therapy pages, whose mobile
  // image is also 404 on the source), so it gets no image column.
  const image = teaser.querySelector('.cmp-teaser__image-desktop img')
    || (!teaser.querySelector('.cmp-teaser__image-mobile') && teaser.querySelector('img'))
    || null;

  // Text column — title, description, CTA.
  const text = [];
  const title = teaser.querySelector('.cmp-teaser__title');
  if (title) {
    // Unwrap the <p> AEM puts inside the title, keeping the heading level.
    const heading = document.createElement(/^H[1-6]$/.test(title.tagName) ? title.tagName : 'h3');
    heading.innerHTML = title.querySelector('p') ? title.querySelector('p').innerHTML : title.innerHTML;
    text.push(heading);
  }
  const description = teaser.querySelector('.cmp-teaser__description');
  if (description) text.push(...Array.from(description.childNodes));
  const actions = teaser.querySelector('.cmp-teaser__action-container');
  if (actions) text.push(actions);

  // Empty-block guard.
  if (!text.length && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }
  // Nothing to put beside the text: keep it as default content, not a one-column block.
  // (Move the nodes out first; they live inside the element being removed.)
  if (!image) {
    text.forEach((node) => element.before(node));
    element.remove();
    return;
  }

  const textFirst = element.classList.contains('teaser--text-image');
  const cells = [textFirst ? [text, image || ''] : [image || '', text]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
