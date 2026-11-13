# Data visualisation

## Palette

`viz.1` teal · `viz.2` ochre · `viz.3` slate · `viz.4` clay · `viz.5` mauve · `viz.6` sage. Each ≥ 3:1 against `bg.surface` in both modes (see contrast report). Use in order; beyond six series, group or facet instead of adding colours.

Supporting: `viz.ref` (reference lines: norm mean, cut-offs), `viz.band` (normal range band), `viz.grid` (gridlines, kept faint).

## Chart types in NDS

| Chart | Use | Notes |
| --- | --- | --- |
| Interval bar | One score with confidence interval and norm bands (from Ravanma v3) | The signature chart of the system; horizontal, RTL-aware axis |
| Profile line | MMPI-style scale profiles (T-scores) | Reference lines at 50/65/70, labelled; points focusable |
| Bar | Category comparisons, sales | Direct labels instead of legends where possible |
| Radar | Only in professional/overview contexts (Ravanma D-67) | Always paired with a table |
| Gauge | Single index on a bounded scale | Show the number and the band word |
| Sparkline | Trends in stat tiles | No axes; summary in text |

## Severity in assessments

Two scales, chosen by audience:

| Professional view | Calm view (taker, parent) |
| --- | --- |
| ok · caution · severe with status tokens (sage/ochre/rose), T-scores, cut-off lines | «در بازهٔ معمول» · «کمی بالاتر/پایین‌تر از معمول» · «قابل توجه؛ گفت‌وگو با متخصص پیشنهاد می‌شود», neutral and teal tones, no rose |

## Rules

- Axis direction follows the reading direction for categorical axes; numeric scales keep low→high from start to end side and are labelled.
- Every chart: title, one-sentence takeaway, data table alternative, source/norm note.
- No 3D, no gradients, no dual axes.
- Print: charts use the same SVG; colours remain distinguishable in greyscale via pattern or direct labels.
