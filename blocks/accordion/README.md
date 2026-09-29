# accordion

oneAZ **Accordion**: collapsible sections. Each item has a Magenta title with a chevron that flips when the item is open. Items open and close independently.

## Authoring (Document Authoring)

Model: `collection`. One row per item, two cells: the title, then the content.

| Accordion | |
|---|---|
| Accordion title | **The most inspiring heading**<br>Body text, lists, links… |
| Another title | Content for the second item |

- The first cell becomes the clickable title. Keep it short and plain.
- The second cell can hold any rich content. A heading in it renders in Mulberry.
- A row without a second cell produces an item with an empty panel.

## Supported variations

None.

## Behavior

Renders as native `<details>`/`<summary>`, so keyboard and screen-reader support comes from the browser. All items start closed.

## Source mapping

Built from the oneAZ design spec. The catalog's accordion variant `v_4ecd3661fdd5` (4 pages) is a candidate match, not yet confirmed. See `metadata.json`.
