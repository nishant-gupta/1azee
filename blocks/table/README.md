# table

Data table. The first authored row becomes the header row; every following row is a body row.

## Authoring (Document Authoring)

Model: `collection`. One row per table row, one cell per column. In Document Authoring any table is a block, so put **Table** in the first row as the block name.

| Table | | |
|---|---|---|
| Product | Active substance | Therapy area |
| Forxiga® | Dapagliflozin | CVRM |
| Lynparza® | Olaparib | Oncology |

- Rows with fewer cells are padded so columns stay aligned.
- Cells may contain rich text and links.

## Supported variations

None.

## Behavior

Renders a semantic `<table>` with `<thead>`/`<tbody>` and column-scoped headers. The table scrolls horizontally on narrow screens. Body rows are zebra-striped with the oneAZ table tokens.
