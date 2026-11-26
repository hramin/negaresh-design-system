import { getVizToken, type VizToneIndex } from './scale.ts';

export interface SeriesPatternSpec {
  id: string;
  color: string;
  variant: 0 | 1 | 2 | 3 | 4 | 5;
}

/** Builds deterministic pattern IDs scoped to a unique SVG prefix (React `useId()`). */
export function buildSeriesPatterns(
  prefix: string,
  series: readonly { toneIndex?: VizToneIndex | undefined }[],
): SeriesPatternSpec[] {
  return series.map((item, idx) => ({
    id: `${prefix}-pat-${idx}`,
    color: getVizToken(idx, item.toneIndex),
    variant: (idx % 6) as 0 | 1 | 2 | 3 | 4 | 5,
  }));
}

/**
 * Renders SVG `<defs>` patterns for multi-series bars so series remain distinguishable
 * in greyscale / print and high-contrast modes (data-viz.md).
 */
export function SeriesPatternDefs({ patterns }: { patterns: readonly SeriesPatternSpec[] }) {
  return (
    <defs>
      {patterns.map((p) => {
        switch (p.variant) {
          case 0:
            // Series 1: solid fill (still defined as pattern for uniform `url(#...)` usage).
            return (
              <pattern key={p.id} id={p.id} width="8" height="8" patternUnits="userSpaceOnUse">
                <rect width="8" height="8" fill={p.color} />
              </pattern>
            );
          case 1:
            // Series 2: crisp diagonal hatch over tinted fill.
            return (
              <pattern
                key={p.id}
                id={p.id}
                width="8"
                height="8"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <rect width="8" height="8" fill={p.color} fillOpacity="0.22" />
                <line x1="0" y1="0" x2="0" y2="8" stroke={p.color} strokeWidth="3.2" />
              </pattern>
            );
          case 2:
            // Series 3: dot grid over subtle fill.
            return (
              <pattern key={p.id} id={p.id} width="7" height="7" patternUnits="userSpaceOnUse">
                <rect width="7" height="7" fill={p.color} fillOpacity="0.18" />
                <circle cx="3.5" cy="3.5" r="1.7" fill={p.color} />
              </pattern>
            );
          case 3:
            // Series 4: horizontal bands.
            return (
              <pattern key={p.id} id={p.id} width="8" height="6" patternUnits="userSpaceOnUse">
                <rect width="8" height="6" fill={p.color} fillOpacity="0.2" />
                <line x1="0" y1="3" x2="8" y2="3" stroke={p.color} strokeWidth="2.4" />
              </pattern>
            );
          case 4:
            // Series 5: reverse diagonal hatch.
            return (
              <pattern
                key={p.id}
                id={p.id}
                width="8"
                height="8"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(-45)"
              >
                <rect width="8" height="8" fill={p.color} fillOpacity="0.22" />
                <line x1="0" y1="0" x2="0" y2="8" stroke={p.color} strokeWidth="3" />
              </pattern>
            );
          default:
            // Series 6: vertical stripes.
            return (
              <pattern key={p.id} id={p.id} width="6" height="8" patternUnits="userSpaceOnUse">
                <rect width="6" height="8" fill={p.color} fillOpacity="0.2" />
                <line x1="3" y1="0" x2="3" y2="8" stroke={p.color} strokeWidth="2.4" />
              </pattern>
            );
        }
      })}
    </defs>
  );
}
