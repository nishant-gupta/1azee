import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-light-withimg — forked cards variant.
 * A responsive grid of cards, each with a colored image header on top followed by a
 * body containing a title, description, and an optional list of links.
 *
 * Authored structure (DA table): one row per card. Each row's first cell that contains
 * only a picture becomes the image header; the remaining cell(s) become the card body.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-light-withimg-card-image';
      } else {
        div.className = 'cards-light-withimg-card-body';
      }
    });

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => img
    .closest('picture')
    .replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

  block.replaceChildren(ul);
}
