import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Cards: a responsive grid, one card per authored row.
 *
 * The authored content decides each card's layout: a cell that holds only an image becomes
 * the card image, every other cell is the card body (heading, text, links). Cards without
 * an image are text-only.
 *
 * Variant: `light` (the oneAZ light card grid), authored as "Cards (Light)".
 * @param {Element} block The cards block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      const imageOnly = div.querySelector('picture') && !div.textContent.trim();
      div.className = imageOnly ? 'cards-card-image' : 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);
}
