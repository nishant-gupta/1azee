/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion. Base: accordion.
 * Source: https://www.myastrazeneca.ch/en/startseite/therapiegebiete/ri/copd.html (.accordion)
 * Catalog variant: v_4ecd3661fdd5 (block-mapping.json)
 * Generated: 2026-09-30
 *
 * Library structure (EDS Accordion convention, blocks/accordion/README.md): 2 columns;
 * row 1 = block name; each following row is one item: [ title cell | content cell ].
 *
 * Source specifics: an AEM Accordion (.cmp-accordion) whose items are an
 * <h4 class="cmp-accordion__header"> with a .cmp-accordion__title, followed by a
 * .cmp-accordion__panel holding nested AEM containers with Text / Image / Title components.
 */
export default function parse(element, { document }) {
  const items = [...element.querySelectorAll('.cmp-accordion__item')];
  const cells = [];

  items.forEach((item) => {
    const title = item.querySelector('.cmp-accordion__title') || item.querySelector('.cmp-accordion__header');
    const panel = item.querySelector('.cmp-accordion__panel');
    if (!title) return;

    // Content cell: the authorable pieces of the panel, in document order, without AEM wrappers.
    const content = panel
      ? [...panel.querySelectorAll('.cmp-text > *, .cmp-title__text, .cmp-image img, .cmp-button')]
        .filter((el, _i, arr) => !arr.some((o) => o !== el && o.contains(el)))
      : [];

    cells.push([title.textContent.replace(/\s+/g, ' ').trim(), content.length ? content : '']);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion', cells });
  element.replaceWith(block);
}
