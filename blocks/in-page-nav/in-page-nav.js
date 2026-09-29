/**
 * in-page-nav — oneAZ Links / In-Page Nav component.
 * A vertical list of nav links with a left accent bar. Top-level items are bold;
 * nested (sub) items are indented and prefixed with an em-dash. The currently
 * active item (matching the page URL, or authored with a bold link) is highlighted.
 *
 * Authored as a (nested) list of links inside the block.
 */
function markActive(list) {
  const here = window.location.pathname.replace(/\.html$/, '');
  list.querySelectorAll('a[href]').forEach((a) => {
    const raw = a.getAttribute('href') || '';
    // Same-page anchor links (#foo) are not "active" navigation targets.
    if (raw.startsWith('#')) return;
    try {
      const target = new URL(a.href, window.location).pathname.replace(/\.html$/, '');
      if (target === here) a.closest('li')?.classList.add('in-page-nav-active');
    } catch { /* ignore malformed href */ }
  });
}

export default function decorate(block) {
  // Normalize: the block may wrap the list in cell divs — hoist the first list up.
  const list = block.querySelector('ul, ol');
  if (list) {
    block.replaceChildren(list);
    // Tag sub-lists so CSS can indent + dash-prefix nested items.
    block.querySelectorAll('li > ul, li > ol').forEach((sub) => sub.classList.add('in-page-nav-sublist'));
    markActive(block);
  }
}
