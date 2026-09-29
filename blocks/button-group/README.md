# button-group

oneAZ **button group**: two or more buttons in a row, aligned left, center, or right. On mobile (below 600px) the buttons always stack vertically at full width.

## Authoring (Document Authoring)

Model: `standalone`. One cell, one link per line. The link's formatting picks the button style:

| Formatting | Button |
|---|---|
| **bold** link | Primary (Magenta fill) |
| *italic* link | Secondary (Magenta outline) |
| ***bold italic*** link | Tertiary (Graphite outline) |
| plain link | Link (underlined text) |

| Button Group (align-center) |
|---|
| **[Get started](/…)**<br>*[Learn more](/…)*<br>[Contact us](/…) |

## Supported variations

Block options go in parentheses after the block name, comma-separated, e.g. `Button Group (align-right, small)`.

| Option | Effect |
|---|---|
| `align-left` | Left-align (default) |
| `align-center` | Center the group |
| `align-right` | Right-align the group |
| `small` | Small size for every button in the group |

## Notes

- A single bold or italic link on its own line outside this block also becomes a button (Primary, Secondary, or Tertiary). The Link and Small variants are only available inside a Button Group.
- The decorator flattens the rows and cells so the buttons become direct children of the flex row. Button styles live in `styles/styles.css`.
- Icon-only buttons have CSS (`button icon-only`) but no Document Authoring syntax yet.
