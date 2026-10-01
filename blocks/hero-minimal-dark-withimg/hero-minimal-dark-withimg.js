import decorateHero from '../hero/hero.js';

/**
 * Deprecated alias: `hero-minimal-dark-withimg` is now the `hero` block with the
 * `minimal-dark` variant ("Hero (Minimal Dark)"). Kept only so pages still authored with
 * the old block name keep rendering until they are re-published; remove it afterwards.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  block.classList.add('hero', 'minimal-dark');
  decorateHero(block);
}
