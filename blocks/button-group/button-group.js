/**
 * button-group — groups 2+ buttons with left/right/center alignment.
 * Layout is handled by CSS in styles/styles.css (.button-group + .align-*).
 *
 * Authored as a block table whose cells hold one link per paragraph:
 *   bold link = Primary, italic = Secondary, bold+italic = Tertiary (see decorateButtons
 *   in scripts.js), and a plain link = Link variant.
 * Block options: align-left | align-right | align-center, small.
 *
 * The decorator flattens the rows/cells so the buttons become direct flex children.
 */
export default function decorate(block) {
  const small = block.classList.contains('small');
  const links = [...block.querySelectorAll('a[href]')];
  links.forEach((a) => {
    // Formatted links were already turned into buttons; a plain link is the Link variant.
    if (!a.classList.contains('button')) a.classList.add('button', 'link');
    if (small) a.classList.add('small');
  });
  block.replaceChildren(...links);
}
