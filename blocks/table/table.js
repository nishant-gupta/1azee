/**
 * table — renders authored rows as a semantic HTML table.
 * The first row is the header row. Authors may add or omit cells; short rows are
 * padded so columns stay aligned.
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const colCount = Math.max(...rows.map((row) => row.children.length));
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  rows.forEach((row, i) => {
    const tr = document.createElement('tr');
    const cells = [...row.children];
    for (let c = 0; c < colCount; c += 1) {
      const cell = document.createElement(i === 0 ? 'th' : 'td');
      if (i === 0) cell.scope = 'col';
      const src = cells[c];
      if (src) while (src.firstChild) cell.append(src.firstChild);
      tr.append(cell);
    }
    (i === 0 ? thead : tbody).append(tr);
  });

  table.append(thead, tbody);
  const scroller = document.createElement('div');
  scroller.className = 'table-scroll';
  scroller.append(table);
  block.replaceChildren(scroller);
}
