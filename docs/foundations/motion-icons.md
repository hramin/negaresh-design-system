# Motion and iconography

## Motion

Motion explains change; it never decorates.

| Token | Value | Use |
| --- | --- | --- |
| `duration.instant` | 80 ms | Press feedback |
| `duration.fast` | 120 ms | Hover, colour changes |
| `duration.base` | 200 ms | Popovers, toasts, disclosure |
| `duration.slow` | 320 ms | Sheets, page-level view transitions |
| `easing.standard` | cubic-bezier(.2,.7,.2,1) | Most movement |
| `easing.enter` / `exit` | (0,0,.2,1) / (.4,0,1,1) | Appearing / leaving layers |

Rules: animate opacity and transform only; distances ≤ 8 px for UI; page transitions with the View Transitions API as progressive enhancement; everything off under `prefers-reduced-motion: reduce` (state changes still happen instantly). No looping animation except progress indicators.

## Icons

- One set, `@negaresh/icons`, drawn on a 24 grid with 2 px padding, round caps and joins, stroke 1.6 (token), `currentColor`.
- Sizes: 16 (inline, dense), 20 (default), 24 (navigation, empty states).
- Icons beside text are `aria-hidden`; icon-only buttons need an accessible name.
- Directional icons (arrows, chevrons, back, next, send, undo) carry `mirrored` and flip in RTL. Clock, check, play, media controls do not flip.
- No emoji in UI (test-platform review #6).
- Source: start from an open set with a compatible style (e.g. Lucide, ISC licence) and redraw or adjust where needed; record the licence in `packages/icons/LICENSE`.
