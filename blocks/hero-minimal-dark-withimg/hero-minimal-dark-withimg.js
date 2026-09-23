import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * hero-minimal-dark-withimg — forked hero variant.
 * A full-bleed hero with a background image behind a content overlay (heading + text).
 *
 * Authored structure (DA table): two rows — the first holds the background image,
 * the second holds the heading and supporting copy.
 */
export default function decorate(block) {
  const rows = [...block.children];

  // First row that contains only a picture becomes the background image.
  const imageRow = rows.find((row) => row.querySelector('picture') && !row.querySelector('h1, h2, h3'));
  if (imageRow) {
    imageRow.classList.add('hero-minimal-dark-withimg-image');
  }

  // Remaining row(s) form the content overlay.
  rows
    .filter((row) => row !== imageRow)
    .forEach((row) => row.classList.add('hero-minimal-dark-withimg-content'));

  // Optimize the background image.
  block.querySelectorAll('picture > img').forEach((img) => img
    .closest('picture')
    .replaceWith(createOptimizedPicture(img.src, img.alt, true, [{ width: '2000' }])));
}
