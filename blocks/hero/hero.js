import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Hero: a banner with an optional background image behind a heading and short text.
 *
 * The authored content decides the layout, so authors don't pick a structure:
 * - a row or cell that holds only an image becomes the background image;
 * - an image placed in the same cell as the text is used as the background too;
 * - everything else (heading, copy, buttons) becomes the text overlay;
 * - without an image the hero is text only.
 *
 * Variant: `minimal-dark` (the oneAZ dark brand banner), authored as "Hero (Minimal Dark)".
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const imageCell = cells.find((cell) => cell.querySelector('picture') && !cell.textContent.trim());
  const picture = (imageCell || block).querySelector('picture');

  const content = document.createElement('div');
  content.className = 'hero-content';
  cells.filter((cell) => cell !== imageCell).forEach((cell) => content.append(...cell.childNodes));

  const parts = [];
  if (picture) {
    const img = picture.querySelector('img');
    const holder = picture.parentElement;
    picture.remove();
    // Drop the paragraph an inline image leaves empty.
    if (holder && holder.tagName === 'P' && !holder.textContent.trim() && !holder.children.length) holder.remove();
    const media = document.createElement('div');
    media.className = 'hero-image';
    media.append(createOptimizedPicture(img.src, img.alt, true, [{ width: '2000' }]));
    parts.push(media);
  }
  if (content.childNodes.length) parts.push(content);
  block.replaceChildren(...parts);
}
