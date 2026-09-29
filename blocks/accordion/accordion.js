/**
 * accordion — oneAZ Accordion component.
 * Each authored row is a two-cell pair: [title, content]. The title becomes a
 * button that toggles its content panel open/closed. A chevron on the right
 * flips when expanded. Multiple items may be open independently.
 *
 * Uses <details>/<summary> semantics for built-in accessibility and keyboard support.
 */
export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';

  rows.forEach((row) => {
    const cells = [...row.children];
    const titleCell = cells[0];
    const contentCell = cells[1];
    if (!titleCell) return;

    const item = document.createElement('details');
    item.className = 'accordion-item';

    const summary = document.createElement('summary');
    summary.className = 'accordion-item-title';
    // Preserve authored title markup (text or inline formatting).
    while (titleCell.firstChild) summary.append(titleCell.firstChild);

    const body = document.createElement('div');
    body.className = 'accordion-item-body';
    if (contentCell) {
      while (contentCell.firstChild) body.append(contentCell.firstChild);
    }

    item.append(summary, body);
    block.append(item);
  });
}
