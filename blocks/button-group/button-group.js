/**
 * button-group — groups 2+ buttons with left/right/center alignment.
 * Layout is handled by CSS in styles/styles.css (.button-group + .align-*).
 * This decorator normalizes authored content: it unwraps the button-wrapper
 * paragraphs EDS creates so the buttons become direct flex children, and
 * carries any alignment option class through from the block's classList.
 */
export default function decorate(block) {
  // Move each decorated button up to be a direct child of the group.
  block.querySelectorAll(':scope p.button-wrapper').forEach((p) => {
    const a = p.querySelector('a.button');
    if (a) p.replaceWith(a);
  });
  // Alignment options authored as classes (align-left/right/center) already
  // sit on the block element; nothing else to do — CSS does the layout.
}
