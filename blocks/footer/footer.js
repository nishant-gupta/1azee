/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // metadata-independent dual-fetch: /content first (localhost), then root (DA/EDS prod)
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return;
  const html = await resp.text();

  const fragment = document.createElement('div');
  fragment.innerHTML = html;

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Tag the structural sections so CSS can lay them out.
  const sections = [...footer.children];
  if (sections[0]) sections[0].classList.add('footer-brand');
  if (sections[1]) sections[1].classList.add('footer-links');
  if (sections[2]) sections[2].classList.add('footer-legal');

  block.append(footer);
}
