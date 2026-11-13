# Accessibility

Target: **WCAG 2.2 AA** for every product (D-41). Behaviour rules from the phase-1 work (focus, links, phone numbers, states) are kept.

## Checklist every component passes

| Area | Rule |
| --- | --- |
| Contrast | Text 4.5:1 (large 3:1); UI boundaries, icons and chart marks 3:1 — both modes, enforced by `tokens:check` |
| Focus | Visible 2-px `focus.ring` with 2-px offset on the element itself (incl. hidden-input controls via `:has(:focus-visible)` or RAC `data-focus-visible`). Never removed. Not obscured by sticky bars (2.4.11): add `scroll-padding` equal to topbar and bottom bar heights |
| Target size | ≥ 44×44 px for all interactive elements (stricter than 2.5.8's 24 px, per PRDs) |
| Keyboard | Every action reachable by keyboard in a logical RTL order; roving tabindex inside composite widgets (RAC) |
| Names | Every control has a visible label; icon buttons have an accessible name; groups use fieldset/legend or `role=group` + label |
| Errors | Inline, specific, linked by `aria-describedby`; summary at top for long forms; focus moves to the first invalid field on submit |
| Status | Async results announced via live regions (toast `role=status`, errors `role=alert`); progress «صفحهٔ ۳ از ۱۳» announced on page change |
| Motion | Honour reduced motion; no flashing |
| Dragging | Every drag action has a non-drag alternative (2.5.7) |
| Auth | No cognitive tests at sign-in; allow paste in OTP and password fields (3.3.8) |
| Redundant entry | Don't ask twice for information already given in the flow (3.3.7) |
| Help | Consistent location for help/support across pages (3.2.6) |
| Images | `alt` required by type (content images); decorative images `alt=""` |
| Language | `lang="fa"`; LTR islands get `dir="ltr"`; English fragments get `lang="en"` |

## Assessment-specific

- Each question is a labelled radio group (`fieldset` + `legend` = the stem); options are real radios; focus visible on the option chip.
- Severity has a word and icon; the calm view uses plain-language bands without alarming colours.
- Charts have a text alternative (data table) and a summary sentence.
- Timed tests: none today; if added, allow extension (2.2.1).

## Testing

Automated: axe in Playwright on every docs page, light and dark, desktop and mobile. Manual per phase: keyboard pass, NVDA + Firefox, VoiceOver + Safari (iOS), TalkBack on Android, 200 % zoom, Windows high contrast.
