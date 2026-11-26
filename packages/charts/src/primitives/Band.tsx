import { cx } from '../internal/cx.ts';
import { roundCoord } from '../internal/scale.ts';
import styles from './primitives.module.css';
import type { BandProps, BandTone } from './types.ts';

function resolveTone(tone: BandTone, mode: 'professional' | 'calm'): BandTone {
  if (mode === 'calm' && tone === 'severe') return 'calm';
  return tone;
}

/**
 * SVG shaded norm/reference range band primitive.
 * Automatically avoids rose/danger fills in `calm` mode (data-viz.md).
 */
export function Band({
  orientation,
  fromCoord,
  toCoord,
  spanStart,
  spanEnd,
  label,
  tone = 'band',
  mode = 'professional',
  className,
}: BandProps) {
  const safeTone = resolveTone(tone, mode);
  const isVertical = orientation === 'vertical';

  const x = roundCoord(isVertical ? Math.min(fromCoord, toCoord) : Math.min(spanStart, spanEnd));
  const y = roundCoord(isVertical ? Math.min(spanStart, spanEnd) : Math.min(fromCoord, toCoord));
  const width = roundCoord(isVertical ? Math.abs(toCoord - fromCoord) : Math.abs(spanEnd - spanStart));
  const height = roundCoord(isVertical ? Math.abs(spanEnd - spanStart) : Math.abs(toCoord - fromCoord));

  if (width <= 0 || height <= 0) return null;

  const labelX = roundCoord(x + width / 2);
  const labelY = roundCoord(isVertical ? y + 14 : y + 14);

  return (
    <g
      data-nds="Band"
      data-orientation={orientation}
      data-tone={safeTone}
      className={cx(styles.bandGroup, className)}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        data-tone={safeTone}
        className={styles.bandRect}
      />
      {label !== undefined && label.length > 0 && width >= 48 && height >= 18 && (
        <text x={labelX} y={labelY} textAnchor="middle" className={styles.bandLabel}>
          {label}
        </text>
      )}
    </g>
  );
}
