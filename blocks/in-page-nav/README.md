# in-page-nav

oneAZ **Links / In-Page Nav**: a vertical list of links with a left accent bar. Top-level items are bold Magenta; nested items are indented and prefixed with an em-dash.

## Authoring (Document Authoring)

Model: `collection`. One cell holding a bulleted list of links. Indent a bullet to make it a sub-item.

| In-Page Nav |
|---|
| • [Section one](#section-one)<br>&nbsp;&nbsp;◦ [Sub-item](#sub-item)<br>• [Section two](#section-two) |

- Only the first list in the block is used.
- A link whose page path matches the current page renders in Graphite (the current location). Same-page `#anchor` links are never marked current.

## Supported variations

| Option | Effect |
|---|---|
| `gold` | Gold accent bar instead of Magenta, e.g. `In-Page Nav (gold)` |

## Source mapping

Built from the oneAZ design spec. No matching variant was detected on the source site.
