import decorateCards from '../cards/cards.js';

/**
 * Deprecated alias: `cards-light-withimg` is now the `cards` block with the `light`
 * variant ("Cards (Light)"). Kept only so pages still authored with the old block name
 * keep rendering until they are re-published; remove it afterwards.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  block.classList.add('cards', 'light');
  decorateCards(block);
}
