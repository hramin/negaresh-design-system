# Layout, space and shape

## Space

4-px base: `space-1` 4 · `2` 8 · `3` 12 · `4` 16 · `5` 20 · `6` 24 · `8` 32 · `10` 40 · `12` 48 · `16` 64 · `20` 80 · `24` 96.

Rhythm: related items 8–12, groups 20–24, sections 32–40, page blocks 64+. Inside a surface: 32 desktop / 20 mobile.

## Breakpoints

| Name | Min width | Composition |
| --- | --- | --- |
| base | 0 | Mobile: one column, sticky bottom action bar, collapsible secondary content |
| sm | 600 | Large phones / small tablets: two-column forms allowed |
| md | 900 | Desktop composition starts (D-90) |
| lg | 1200 | Content container max width |
| xl | 1440 | Wide admin tables, dashboards |

Prefer **container queries** inside components; page-level composition uses the breakpoints.

## Containers

`narrow` 640 (forms, auth), `default` 1200 (most pages), `wide` 1440 (admin, data). Gutters 24 desktop, 16 mobile.

## Page templates

| Template | Desktop | Mobile |
| --- | --- | --- |
| Task (registry activation, checkout, start test) | Main column + sticky side column (360) with context and help | Context row on top, task surface, help collapsed, sticky primary action |
| Reading (article, result interpretation) | 66ch column + table of contents / author side column | Single column, TOC as disclosure |
| Catalog (shop, blog, directory) | Filters bar + responsive card grid (auto-fill, min 260) | Filters in a sheet, 1–2 column cards |
| Workspace (account, admin) | Side nav 248 + content (wide) | Top bar + horizontal tab strip; tables stack into cards |
| Focus (answering a test, login) | Centered 640 column, minimal chrome | Full-width, progress on top, actions at the bottom |

## Surfaces (D-77)

A surface is `bg.surface` + 1 px `border.default` + `radius.lg`. Sections inside a surface are separated by a hairline; a footer section with actions uses `bg.sunken`. No resting shadows, no nested cards (a surface inside a surface becomes a section or a sunken block).

## Radius

`sm` 8 (chips, small controls) · `md` 12 (inputs, choice cards, alerts) · `lg` 16 (surfaces) · `xl` 24 (sheets, dialogs on mobile) · `pill` (buttons, badges, toasts). Mobile surfaces drop to `md`.

## Elevation

Only floating layers have shadow: popover, menu, combobox list, tooltip, dialog, toast — one token, `shadow.overlay`. Layering by z tokens: sticky 10 · dropdown 20 · overlay 30 · modal 40 · toast 50.

## Density

Two densities via `data-density` on a container: `comfortable` (default, 48 px controls) and `compact` (40 px controls, 12 px table cell padding) for admin tables. Touch targets stay ≥ 44 px in both.
