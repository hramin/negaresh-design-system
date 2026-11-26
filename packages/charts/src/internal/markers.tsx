import { roundCoord } from './scale.ts';

/**
 * Non-diamond geometric marker shapes for multi-series charts (D-77 forbids diamond markers).
 * Six shapes correspond 1-to-1 with `--nds-viz-1` through `--nds-viz-6`.
 */
export type MarkerShape = 'circle' | 'square' | 'triangle-up' | 'triangle-down' | 'cross' | 'ring';

export const MARKER_SHAPES: readonly MarkerShape[] = [
  'circle',
  'square',
  'triangle-up',
  'triangle-down',
  'cross',
  'ring',
] as const;

export function getMarkerShape(index: number): MarkerShape {
  const safe = ((index % MARKER_SHAPES.length) + MARKER_SHAPES.length) % MARKER_SHAPES.length;
  return MARKER_SHAPES[safe]!;
}

export interface PointMarkerProps {
  shape: MarkerShape;
  cx: number;
  cy: number;
  radius?: number | undefined;
  color: string;
  surfaceColor?: string | undefined;
  className?: string | undefined;
}

/**
 * Renders a crisp SVG geometric point marker (never diamond per D-77) so multi-series lines
 * and radar charts remain distinguishable in greyscale and print.
 */
export function PointMarker({
  shape,
  cx,
  cy,
  radius = 4.5,
  color,
  surfaceColor = 'var(--nds-bg-surface)',
  className,
}: PointMarkerProps) {
  const x = roundCoord(cx);
  const y = roundCoord(cy);
  const r = roundCoord(radius);

  switch (shape) {
    case 'circle':
      return (
        <circle
          cx={x}
          cy={y}
          r={r}
          fill={color}
          stroke={surfaceColor}
          strokeWidth={1.5}
          className={className}
        />
      );
    case 'square': {
      const side = roundCoord(r * 1.75);
      const half = roundCoord(side / 2);
      return (
        <rect
          x={roundCoord(x - half)}
          y={roundCoord(y - half)}
          width={side}
          height={side}
          rx={1}
          fill={color}
          stroke={surfaceColor}
          strokeWidth={1.5}
          className={className}
        />
      );
    }
    case 'triangle-up': {
      const top = `${x},${roundCoord(y - r * 1.15)}`;
      const bl = `${roundCoord(x - r * 1.1)},${roundCoord(y + r * 0.9)}`;
      const br = `${roundCoord(x + r * 1.1)},${roundCoord(y + r * 0.9)}`;
      return (
        <polygon
          points={`${top} ${bl} ${br}`}
          fill={color}
          stroke={surfaceColor}
          strokeWidth={1.4}
          strokeLinejoin="round"
          className={className}
        />
      );
    }
    case 'triangle-down': {
      const bottom = `${x},${roundCoord(y + r * 1.15)}`;
      const tl = `${roundCoord(x - r * 1.1)},${roundCoord(y - r * 0.9)}`;
      const tr = `${roundCoord(x + r * 1.1)},${roundCoord(y - r * 0.9)}`;
      return (
        <polygon
          points={`${bottom} ${tl} ${tr}`}
          fill={color}
          stroke={surfaceColor}
          strokeWidth={1.4}
          strokeLinejoin="round"
          className={className}
        />
      );
    }
    case 'cross': {
      const arm = roundCoord(r * 1.05);
      return (
        <g className={className}>
          <circle cx={x} cy={y} r={roundCoord(r * 1.15)} fill={surfaceColor} />
          <path
            d={`M ${roundCoord(x - arm)} ${y} L ${roundCoord(x + arm)} ${y} M ${x} ${roundCoord(y - arm)} L ${x} ${roundCoord(y + arm)}`}
            stroke={color}
            strokeWidth={2.2}
            strokeLinecap="round"
          />
        </g>
      );
    }
    case 'ring':
      return (
        <circle
          cx={x}
          cy={y}
          r={r}
          fill={surfaceColor}
          stroke={color}
          strokeWidth={2.2}
          className={className}
        />
      );
  }
}
