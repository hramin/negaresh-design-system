import { cx } from '../internal/cx.ts';
import { roundCoord } from '../internal/scale.ts';
import styles from './primitives.module.css';
import type { ReferenceLineProps, ReferenceLineStyle, ReferenceLineTone } from './types.ts';

function dashForStyle(style: ReferenceLineStyle): string | undefined {
  switch (style) {
    case 'dashed':
      return '5 4';
    case 'dotted':
      return '2 3';
    case 'solid':
      return undefined;
  }
}

function resolveTone(tone: ReferenceLineTone, mode: 'professional' | 'calm'): ReferenceLineTone {
  if (mode === 'calm' && tone === 'danger') return 'accent';
  return tone;
}

/**
 * SVG reference line primitive (norm mean, cut-off threshold, or target line).
 * Uses `--nds-viz-ref` by default and stays legible in greyscale via dash patterns.
 */
export function ReferenceLine({
  orientation,
  position,
  start,
  end,
  label,
  labelPosition = 'start',
  tone = 'ref',
  mode = 'professional',
  lineStyle = 'dashed',
  className,
}: ReferenceLineProps) {
  const safeTone = resolveTone(tone, mode);
  const pos = roundCoord(position);
  const s = roundCoord(start);
  const e = roundCoord(end);
  const isVertical = orientation === 'vertical';

  const x1 = isVertical ? pos : s;
  const y1 = isVertical ? s : pos;
  const x2 = isVertical ? pos : e;
  const y2 = isVertical ? e : pos;

  const labelX = isVertical ? pos : labelPosition === 'start' ? Math.max(s, e) - 4 : Math.min(s, e) + 4;
  const labelY = isVertical ? Math.min(s, e) - 6 : pos - 5;
  const textAnchor = isVertical ? 'middle' : labelPosition === 'start' ? 'end' : 'start';

  return (
    <g
      data-nds="ReferenceLine"
      data-orientation={orientation}
      data-tone={safeTone}
      className={cx(styles.refGroup, className)}
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        strokeDasharray={dashForStyle(lineStyle)}
        data-tone={safeTone}
        className={styles.refLine}
      />
      {label !== undefined && label.length > 0 && (
        <text
          x={roundCoord(labelX)}
          y={roundCoord(labelY)}
          textAnchor={textAnchor}
          data-tone={safeTone}
          className={styles.refLabel}
        >
          {label}
        </text>
      )}
    </g>
  );
}
