/* eslint-disable */
/* global WebImporter */
/**
 * Parser for in-page-nav. Base: custom (oneAZ Links / In-Page Nav).
 * Source: https://www.myastrazeneca.ch/en/startseite/therapiegebiete/ri/copd.html (.text--in-page-nav-hr)
 * Catalog variant: v_d41301689a41 (block-mapping.json)
 * Generated: 2026-09-30
 *
 * Library structure (blocks/in-page-nav/README.md): row 1 = block name, row 2 = one cell
 * holding a bulleted list of links (a nested list = sub-items).
 *
 * Source specifics: an AEM Text component styled text--in-page-nav-hr holding a <ul> of
 * <b><a href="#id"> links. The #ids belong to AEM containers that don't survive import, so
 * each link is re-pointed at the id EDS generates for the first heading of its target
 * section (heading text, lower-cased, spaces to hyphens, punctuation dropped).
 */
function headingId(text) {
  return text.toLowerCase().trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');
}

export default function parse(element, { document }) {
  const list = element.querySelector('ul, ol');
  if (!list) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const headings = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')];
  list.querySelectorAll('a[href^="#"]').forEach((a) => {
    const target = document.getElementById(a.getAttribute('href').slice(1));
    if (!target) return;
    // First heading inside the target, or the first one after it.
    const heading = headings.find((h) => target.contains(h))
      || headings.find((h) => target.compareDocumentPosition(h) & 4);
    if (heading && heading.textContent.trim()) a.setAttribute('href', `#${headingId(heading.textContent)}`);
  });

  // The source bolds every link; the block styles its own labels.
  list.querySelectorAll('b, strong').forEach((b) => b.replaceWith(...b.childNodes));

  const block = WebImporter.Blocks.createBlock(document, { name: 'in-page-nav', cells: [[list]] });
  element.replaceWith(block);
}
