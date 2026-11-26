import { line } from 'd3-shape';
import { type KeyboardEvent, type Ref, useRef, useState } from 'react';
import type { ChartLegendItem, ChartTableData } from '../ChartFrame/ChartFrame.tsx';
import { cx } from '../internal/cx.ts';
import { getMarkerShape, PointMarker } from '../internal/markers.tsx';
import {
  type ChartDirection,
  type ChartMode,
  createHorizontalPointScale,
  createVerticalLinearScale,
  formatChartNumber,
  getSeriesDashArray,
  getVizToken,
  resolveTicks,
  roundCoord,
  type VizToneIndex,
} from '../internal/scale.ts';
import { useChartMessages } from '../messages/context.tsx';
import type { ChartMessages } from '../messages/types.ts';
import { Band } from '../primitives/Band.tsx';
import { ReferenceLine } from '../primitives/ReferenceLine.tsx';
import type { BandSpec, ReferenceLineSpec } from '../primitives/types.ts';
import styles from './ProfileLine.module.css';

export interface ProfileLineCategory {
  id: string;
  /** Full category / scale name used in tables and screen-reader labels. */
  label: string;
  /** Optional short label rendered on the x-axis (e.g. «L», «F», «K», «D»). */
  shortLabel?: string | undefined;
}

export interface ProfileLineSeries {
  id: string;
  label: string;
  /** Values aligned by index with `categories`; `null` creates a clean gap in the line. */
  values: readonly (number | null)[];
  /** Optional 1-based `--nds-viz-*` palette override. */
  toneIndex?: VizToneIndex | undefined;
}

export interface ProfileLineDivider {
  /** Category ID immediately preceding the vertical section divider. */
  afterCategoryId: string;
  /** Optional short section caption drawn above the divider. */
  label?: string | undefined;
}

export interface ProfileLineProps {
  /** Ordered scales/categories along the horizontal axis. */
  categories: readonly ProfileLineCategory[];
  /** One to six profile series (uses `--nds-viz-1..6`, distinct dashes, and non-diamond markers). */
  series: readonly ProfileLineSeries[];
  /** Vertical numeric domain `[min, max]`, e.g. `[30, 90]` for T-scores. */
  domain: readonly [number, number];
  /** Explicit Y-axis ticks (e.g. `[30, 40, 50, 65, 70, 85]`). */
  ticks?: readonly number[] | undefined;
  /** Horizontal shaded norm bands (e.g. T=40–60). */
  bands?: readonly BandSpec[] | undefined;
  /** Horizontal reference lines (e.g. T=50 mean, T=65/70 cut-offs). */
  referenceLines?: readonly ReferenceLineSpec[] | undefined;
  /** Vertical section dividers separating scale groups (e.g. validity vs clinical scales). */
  dividers?: readonly ProfileLineDivider[] | undefined;
  /** Show direct Persian value labels above points. Default `false` for multi-series, `true` for single series. */
  showValueLabels?: boolean | undefined;
  /** Audience mode; prevents rose styling in `'calm'` mode. Default `'professional'`. */
  mode?: ChartMode | undefined;
  /** Reading direction (`'rtl'` starts category 1 at the right edge). Default `'rtl'`. */
  dir?: ChartDirection | undefined;
  /** Custom numeric formatter. Defaults to Persian digits via `@negaresh/utils`. */
  formatValue?: ((value: number) => string) | undefined;
  /** Accessible name for the chart. */
  ariaLabel: string;
  /** Show live keyboard/pointer detail readout below the SVG. Default `true`. */
  showReadout?: boolean | undefined;
  /** Optional per-chart message overrides. */
  messages?: Partial<ChartMessages> | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

const VIEW_WIDTH = 560;
const VIEW_HEIGHT = 276;
const PAD_TOP = 28;
const PAD_BOTTOM = 44;
const PAD_AXIS = 44;
const PAD_EDGE = 24;

interface FlatPoint {
  key: string;
  seriesId: string;
  seriesLabel: string;
  categoryLabel: string;
  value: number;
  x: number;
  y: number;
  color: string;
  seriesIndex: number;
}

/** Builds legend descriptors matching `ProfileLine`'s colours, dash patterns, and non-diamond shapes. */
export function buildProfileLineLegend(
  series: readonly ProfileLineSeries[],
): ChartLegendItem[] {
  return series.map((s, idx) => ({
    id: s.id,
    label: s.label,
    color: getVizToken(idx, s.toneIndex),
    dashArray: getSeriesDashArray(idx),
    shape: getMarkerShape(idx),
  }));
}

/** Builds an accessible `ChartTableData` for `<ChartFrame table={...} />`. */
export function buildProfileLineTable(
  categories: readonly ProfileLineCategory[],
  series: readonly ProfileLineSeries[],
  options: {
    caption?: string | undefined;
    formatValue?: ((value: number) => string) | undefined;
    messages?: ChartMessages | undefined;
  } = {},
): ChartTableData {
  const fmt = options.formatValue ?? formatChartNumber;
  const missing = options.messages?.missingValue ?? '—';
  return {
    ...(options.caption !== undefined ? { caption: options.caption } : {}),
    columns: [
      { key: 'scale', label: options.messages?.columnScale ?? 'مقیاس' },
      ...series.map((s) => ({ key: s.id, label: s.label, align: 'numeric' as const })),
    ],
    rows: categories.map((cat, idx) => ({
      id: cat.id,
      cells: {
        scale: cat.label,
        ...Object.fromEntries(
          series.map((s) => {
            const v = s.values[idx];
            return [s.id, v !== null && v !== undefined ? fmt(v) : missing];
          }),
        ),
      },
    })),
  };
}

/**
 * MMPI-style SSR SVG scale profile line chart built on `d3-scale` and `d3-shape`.
 * Supports horizontal norm bands, labelled reference lines (50/65/70), vertical section
 * dividers, greyscale-safe dash/marker encoding, and keyboard-navigable points.
 */
export function ProfileLine({
  categories,
  series,
  domain,
  ticks,
  bands,
  referenceLines,
  dividers,
  showValueLabels,
  mode = 'professional',
  dir = 'rtl',
  formatValue = formatChartNumber,
  ariaLabel,
  showReadout = true,
  messages,
  className,
  ref,
}: ProfileLineProps) {
  const m = useChartMessages(messages);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const pointRefs = useRef<(SVGGElement | null)[]>([]);

  const leftX = dir === 'rtl' ? PAD_EDGE : PAD_AXIS;
  const rightX = dir === 'rtl' ? VIEW_WIDTH - PAD_AXIS : VIEW_WIDTH - PAD_EDGE;
  const topY = PAD_TOP;
  const bottomY = VIEW_HEIGHT - PAD_BOTTOM;

  const xScale = createHorizontalPointScale(
    categories.map((c) => c.id),
    leftX,
    rightX,
    dir,
    0.25,
  );
  const yScale = createVerticalLinearScale(domain, topY, bottomY);
  const resolvedTicks = resolveTicks(yScale, ticks, 5);
  const displayLabels = showValueLabels ?? series.length === 1;

  const lineGenerator = line<{ x: number; y: number; defined: boolean }>()
    .defined((d) => d.defined)
    .x((d) => roundCoord(d.x))
    .y((d) => roundCoord(d.y));

  const flatPoints: FlatPoint[] = [];
  const seriesPaths = series.map((s, sIdx) => {
    const color = getVizToken(sIdx, s.toneIndex);
    const dashArray = getSeriesDashArray(sIdx);
    const shape = getMarkerShape(sIdx);
    const coords = categories.map((cat, cIdx) => {
      const val = s.values[cIdx] ?? null;
      const cx = xScale(cat.id) ?? leftX;
      const cy = val !== null ? yScale(val) : bottomY;
      if (val !== null) {
        flatPoints.push({
          key: `${s.id}__${cat.id}`,
          seriesId: s.id,
          seriesLabel: s.label,
          categoryLabel: cat.label,
          value: val,
          x: cx,
          y: cy,
          color,
          seriesIndex: sIdx,
        });
      }
      return { x: cx, y: cy, defined: val !== null };
    });

    return {
      id: s.id,
      color,
      dashArray,
      shape,
      d: lineGenerator(coords) ?? '',
    };
  });

  const activePoint = flatPoints.find((p) => p.key === activeKey);
  const readoutText = activePoint
    ? series.length > 1
      ? m.pointReadout(activePoint.seriesLabel, activePoint.categoryLabel, formatValue(activePoint.value))
      : m.singlePointReadout(activePoint.categoryLabel, formatValue(activePoint.value))
    : m.inspectHint;

  const handleKeyDown = (e: KeyboardEvent<SVGGElement>, idx: number) => {
    const step =
      e.key === 'ArrowLeft'
        ? dir === 'rtl'
          ? 1
          : -1
        : e.key === 'ArrowRight'
          ? dir === 'rtl'
            ? -1
            : 1
          : 0;
    if (step !== 0 && flatPoints.length > 0) {
      e.preventDefault();
      const next = (idx + step + flatPoints.length) % flatPoints.length;
      pointRefs.current[next]?.focus();
      setActiveKey(flatPoints[next]?.key ?? null);
    }
  };

  const yAxisX = dir === 'rtl' ? rightX : leftX;
  const yLabelX = dir === 'rtl' ? rightX + 10 : leftX - 10;
  const yLabelAnchor = dir === 'rtl' ? 'end' : 'end';

  return (
    <div
      ref={ref}
      data-nds="ProfileLine"
      data-mode={mode}
      data-dir={dir}
      className={cx(styles.root, className)}
    >
      <div className={styles.svgWrap}>
        {/* biome-ignore lint/a11y/useSemanticElements: SVG chart contains interactive SVG points and cannot be a fieldset */}
        <svg
          className={styles.svg}
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          role="group"
          aria-label={ariaLabel}
        >
          <title>{ariaLabel}</title>
          {bands?.map((band) => (
            <Band
              key={`band-${band.from}-${band.to}-${band.tone ?? 'band'}-${band.label ?? ''}`}
              orientation="horizontal"
              fromCoord={yScale(band.from)}
              toCoord={yScale(band.to)}
              spanStart={leftX}
              spanEnd={rightX}
              label={band.label}
              tone={band.tone}
              mode={mode}
            />
          ))}

          {resolvedTicks.map((tick) => {
            const y = roundCoord(yScale(tick));
            return (
              <g key={`y-${tick}`}>
                <line x1={leftX} y1={y} x2={rightX} y2={y} className={styles.gridLine} />
                <text
                  x={roundCoord(yLabelX)}
                  y={roundCoord(y + 4)}
                  textAnchor={yLabelAnchor}
                  className={styles.axisText}
                >
                  {formatValue(tick)}
                </text>
              </g>
            );
          })}

          <line x1={leftX} y1={bottomY} x2={rightX} y2={bottomY} className={styles.axisLine} />
          <line x1={yAxisX} y1={topY} x2={yAxisX} y2={bottomY} className={styles.axisLine} />

          {dividers?.map((div) => {
            const idx = categories.findIndex((c) => c.id === div.afterCategoryId);
            if (idx < 0 || idx >= categories.length - 1) return null;
            const x1 = xScale(categories[idx]!.id);
            const x2 = xScale(categories[idx + 1]!.id);
            if (x1 === undefined || x2 === undefined) return null;
            const midX = roundCoord((x1 + x2) / 2);
            return (
              <g key={`div-${div.afterCategoryId}-${div.label ?? ''}`} data-nds-slot="divider">
                <line x1={midX} y1={topY} x2={midX} y2={bottomY} className={styles.dividerLine} />
                {div.label && (
                  <text x={midX} y={topY - 8} textAnchor="middle" className={styles.dividerLabel}>
                    {div.label}
                  </text>
                )}
              </g>
            );
          })}

          {referenceLines?.map((refLine) => (
            <ReferenceLine
              key={`ref-${refLine.value}-${refLine.label ?? ''}`}
              orientation="horizontal"
              position={yScale(refLine.value)}
              start={leftX}
              end={rightX}
              label={refLine.label}
              labelPosition="end"
              tone={refLine.tone}
              mode={mode}
              dir={dir}
              lineStyle={refLine.lineStyle}
            />
          ))}

          {categories.map((cat) => {
            const x = roundCoord(xScale(cat.id) ?? leftX);
            return (
              <text
                key={`cat-${cat.id}`}
                x={x}
                y={bottomY + 22}
                textAnchor="middle"
                className={styles.categoryText}
              >
                {cat.shortLabel ?? cat.label}
              </text>
            );
          })}

          {seriesPaths.map((s) => (
            <path
              key={`path-${s.id}`}
              d={s.d}
              stroke={s.color}
              strokeDasharray={s.dashArray}
              className={styles.seriesPath}
            />
          ))}

          {flatPoints.map((pt, idx) => {
            const isActive = activeKey === pt.key;
            const ptLabel =
              series.length > 1
                ? m.pointReadout(pt.seriesLabel, pt.categoryLabel, formatValue(pt.value))
                : m.singlePointReadout(pt.categoryLabel, formatValue(pt.value));
            return (
              // biome-ignore lint/a11y/useSemanticElements: SVG point marker cannot use HTML <button> inside <svg>
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
                {displayLabels && (
                  <text
                    x={roundCoord(pt.x)}
                    y={roundCoord(pt.y - 10)}
                    textAnchor="middle"
                    className={styles.valueLabel}
                  >
                    {formatValue(pt.value)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {showReadout && (
        <div className={styles.readout} role="status" aria-live="polite">
          {readoutText}
        </div>
      )}
    </div>
  );
}
