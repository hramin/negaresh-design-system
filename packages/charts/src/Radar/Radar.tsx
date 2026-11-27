import { scaleLinear } from 'd3-scale';
import { curveLinearClosed, lineRadial } from 'd3-shape';
import { type KeyboardEvent, type Ref, useRef, useState } from 'react';
import type { ChartLegendItem, ChartTableData } from '../ChartFrame/ChartFrame.tsx';
import { cx } from '../internal/cx.ts';
import { getMarkerShape, PointMarker } from '../internal/markers.tsx';
import {
  formatChartNumber,
  getSeriesDashArray,
  getVizToken,
  normalizeDomain,
  roundCoord,
  type VizToneIndex,
} from '../internal/scale.ts';
import { useChartMessages } from '../messages/context.tsx';
import type { ChartMessages } from '../messages/types.ts';
import styles from './Radar.module.css';

export interface RadarAxis {
  id: string;
  label: string;
}

export interface RadarSeries {
  id: string;
  label: string;
  /** Values aligned by index with `axes`. */
  values: readonly number[];
  toneIndex?: VizToneIndex | undefined;
}

export interface RadarProps {
  /** Radial axes (recommended 4–8 dimensions). */
  axes: readonly RadarAxis[];
  /** One to six comparison series (uses `--nds-viz-1..6`, dashes, and non-diamond markers). */
  series: readonly RadarSeries[];
  /** Radial numeric domain `[min, max]`, e.g. `[0, 100]`. */
  domain: readonly [number, number];
  /** Number of concentric reference rings. Default `4`. */
  rings?: number | undefined;
  /** Custom numeric formatter. Defaults to Persian digits via `@negaresh/utils`. */
  formatValue?: ((value: number) => string) | undefined;
  /** Accessible name for the chart. */
  ariaLabel: string;
  /** Show live detail readout bar below the SVG. Default `true`. */
  showReadout?: boolean | undefined;
  /** Optional per-chart message overrides. */
  messages?: Partial<ChartMessages> | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

const VIEW_WIDTH = 380;
const VIEW_HEIGHT = 330;
const CENTER_X = 190;
const CENTER_Y = 165;
const OUTER_RADIUS = 104;
const LABEL_RADIUS = 128;

interface VertexPoint {
  key: string;
  seriesLabel: string;
  axisLabel: string;
  value: number;
  x: number;
  y: number;
  color: string;
  seriesIndex: number;
}

/** Builds legend descriptors matching `Radar`'s colours, dash patterns, and non-diamond shapes. */
export function buildRadarLegend(series: readonly RadarSeries[]): ChartLegendItem[] {
  return series.map((s, idx) => ({
    id: s.id,
    label: s.label,
    color: getVizToken(idx, s.toneIndex),
    dashArray: getSeriesDashArray(idx),
    shape: getMarkerShape(idx),
  }));
}

/** Builds an accessible `ChartTableData` (required alongside `Radar` per data-viz.md). */
export function buildRadarTable(
  axes: readonly RadarAxis[],
  series: readonly RadarSeries[],
  options: {
    caption?: string | undefined;
    formatValue?: ((value: number) => string) | undefined;
    messages?: ChartMessages | undefined;
  } = {},
): ChartTableData {
  const fmt = options.formatValue ?? formatChartNumber;
  return {
    ...(options.caption !== undefined ? { caption: options.caption } : {}),
    columns: [
      { key: 'axis', label: options.messages?.columnScale ?? 'مقیاس' },
      ...series.map((s) => ({ key: s.id, label: s.label, align: 'numeric' as const })),
    ],
    rows: axes.map((axis, idx) => ({
      id: axis.id,
      cells: {
        axis: axis.label,
        ...Object.fromEntries(series.map((s) => [s.id, fmt(s.values[idx] ?? 0)])),
      },
    })),
  };
}

/**
 * Multi-axis SSR SVG Radar chart for professional/overview contexts (D-67).
 * Always pair with a visible data table via `<ChartFrame tableMode="visible" />`.
 */
export function Radar({
  axes,
  series,
  domain,
  rings = 4,
  formatValue = formatChartNumber,
  ariaLabel,
  showReadout = true,
  messages,
  className,
  ref,
}: RadarProps) {
  const m = useChartMessages(messages);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const pointRefs = useRef<(SVGGElement | null)[]>([]);

  const [minVal, maxVal] = normalizeDomain(domain);
  const rScale = scaleLinear<number, number>()
    .domain([minVal, maxVal])
    .range([0, OUTER_RADIUS])
    .clamp(true);

  const count = Math.max(3, axes.length);
  const angleStep = (Math.PI * 2) / count;
  const ringCount = Math.max(2, Math.floor(rings));
  const ringValues = Array.from(
    { length: ringCount },
    (_, i) => minVal + ((maxVal - minVal) * (i + 1)) / ringCount,
  );

  const radialGenerator = lineRadial<{ angle: number; radius: number }>()
    .angle((d) => d.angle)
    .radius((d) => roundCoord(d.radius))
    .curve(curveLinearClosed);

  const vertices: VertexPoint[] = [];
  const polygons = series.map((s, sIdx) => {
    const color = getVizToken(sIdx, s.toneIndex);
    const dashArray = getSeriesDashArray(sIdx);
    const data = axes.map((axis, aIdx) => {
      const val = s.values[aIdx] ?? minVal;
      const angle = aIdx * angleStep;
      const radius = rScale(val);
      const x = CENTER_X + radius * Math.sin(angle);
      const y = CENTER_Y - radius * Math.cos(angle);
      vertices.push({
        key: `${s.id}__${axis.id}`,
        seriesLabel: s.label,
        axisLabel: axis.label,
        value: val,
        x,
        y,
        color,
        seriesIndex: sIdx,
      });
      return { angle, radius };
    });
    return {
      id: s.id,
      color,
      dashArray,
      d: radialGenerator(data) ?? '',
    };
  });

  const activePoint = vertices.find((v) => v.key === activeKey);
  const readoutText = activePoint
    ? series.length > 1
      ? m.pointReadout(activePoint.seriesLabel, activePoint.axisLabel, formatValue(activePoint.value))
      : m.singlePointReadout(activePoint.axisLabel, formatValue(activePoint.value))
    : m.inspectHint;

  const handleKeyDown = (e: KeyboardEvent<SVGGElement>, idx: number) => {
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && vertices.length > 0) {
      e.preventDefault();
      const delta = e.key === 'ArrowLeft' ? 1 : -1;
      const next = (idx + delta + vertices.length) % vertices.length;
      pointRefs.current[next]?.focus();
      setActiveKey(vertices[next]?.key ?? null);
    }
  };

  return (
    <div ref={ref} data-nds="Radar" className={cx(styles.root, className)}>
      {/* biome-ignore lint/a11y/useSemanticElements: SVG radar contains interactive vertices and cannot be a fieldset */}
      <svg
        className={styles.svg}
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        role="group"
        aria-label={ariaLabel}
      >
        <title>{ariaLabel}</title>

        {ringValues.map((rv) => {
          const r = roundCoord(rScale(rv));
          const ringPath =
            radialGenerator(axes.map((_, i) => ({ angle: i * angleStep, radius: r }))) ?? '';
          return (
            <g key={`ring-${rv}`}>
              <path
                d={ringPath}
                transform={`translate(${CENTER_X}, ${CENTER_Y})`}
                className={styles.ring}
              />
              <text
                x={CENTER_X}
                y={roundCoord(CENTER_Y - r - 3)}
                textAnchor="middle"
                className={styles.ringLabel}
              >
                {formatValue(rv)}
              </text>
            </g>
          );
        })}

        {axes.map((axis, idx) => {
          const angle = idx * angleStep;
          const sin = Math.sin(angle);
          const cos = Math.cos(angle);
          const x2 = roundCoord(CENTER_X + OUTER_RADIUS * sin);
          const y2 = roundCoord(CENTER_Y - OUTER_RADIUS * cos);
          const lx = roundCoord(CENTER_X + LABEL_RADIUS * sin);
          const ly = roundCoord(CENTER_Y - LABEL_RADIUS * cos + 4);
          return (
            <g key={`axis-${axis.id}`}>
              <line x1={CENTER_X} y1={CENTER_Y} x2={x2} y2={y2} className={styles.spoke} />
              <text x={lx} y={ly} textAnchor="middle" className={styles.axisLabel}>
                {axis.label}
              </text>
            </g>
          );
        })}

        {polygons.map((poly) => (
          <path
            key={`poly-${poly.id}`}
            d={poly.d}
            transform={`translate(${CENTER_X}, ${CENTER_Y})`}
            fill={poly.color}
            stroke={poly.color}
            strokeDasharray={poly.dashArray}
            className={styles.seriesArea}
          />
        ))}

        {vertices.map((pt, idx) => {
          const isActive = activeKey === pt.key;
          const ptLabel =
            series.length > 1
              ? m.pointReadout(pt.seriesLabel, pt.axisLabel, formatValue(pt.value))
              : m.singlePointReadout(pt.axisLabel, formatValue(pt.value));
          return (
            // biome-ignore lint/a11y/useSemanticElements: SVG vertex trigger cannot use HTML <button> inside <svg>
            <g
              key={pt.key}
              ref={(el) => {
                pointRefs.current[idx] = el;
              }}
              role="button"
              tabIndex={0}
              aria-label={ptLabel}
              data-active={isActive || undefined}
              className={styles.pointTrigger}
              onFocus={() => setActiveKey(pt.key)}
              onMouseEnter={() => setActiveKey(pt.key)}
              onClick={() => setActiveKey(pt.key)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
            >
              <circle cx={roundCoord(pt.x)} cy={roundCoord(pt.y)} r={12} fill="transparent" />
              <circle cx={roundCoord(pt.x)} cy={roundCoord(pt.y)} r={8.5} className={styles.focusHalo} />
              <PointMarker
                shape={getMarkerShape(pt.seriesIndex)}
                cx={pt.x}
                cy={pt.y}
                radius={4.5}
                color={pt.color}
              />
            </g>
          );
        })}
      </svg>

      {showReadout && (
        <div className={styles.readout} role="status" aria-live="polite">
          {readoutText}
        </div>
      )}
    </div>
  );
}
