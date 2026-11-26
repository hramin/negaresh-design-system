import { scaleLinear } from 'd3-scale';
import { arc } from 'd3-shape';
import type { Ref } from 'react';
import type { ChartTableData } from '../ChartFrame/ChartFrame.tsx';
import { cx } from '../internal/cx.ts';
import {
  type ChartDirection,
  type ChartMode,
  type ChartSeverity,
  formatChartNumber,
  normalizeDomain,
  roundCoord,
  severityStrokeToken,
} from '../internal/scale.ts';
import type { ChartMessages } from '../messages/types.ts';
import type { BandSpec, BandTone, ReferenceLineSpec } from '../primitives/types.ts';
import styles from './Gauge.module.css';

export interface GaugeProps {
  /** Current index value on the bounded scale. */
  value: number;
  /** Bounded scale limits `[min, max]`, e.g. `[0, 100]`. */
  domain: readonly [number, number];
  /** Short index label shown inside the arc (e.g. «شاخص بهزیستی»). */
  label: string;
  /** Required explicit band/status word shown alongside the number (never colour alone). */
  bandWord: string;
  /** Optional semantic severity controlling the active arc and pill tone. */
  severity?: ChartSeverity | undefined;
  /** Optional segmented norm bands drawn along the semicircle track. */
  bands?: readonly BandSpec[] | undefined;
  /** Optional reference tick markers along the semicircle. */
  referenceLines?: readonly ReferenceLineSpec[] | undefined;
  /** Audience mode; never renders rose/danger in `'calm'` mode. Default `'professional'`. */
  mode?: ChartMode | undefined;
  /** Direction (`'rtl'` starts `min` at right/3 o'clock and sweeps to left/9 o'clock). Default `'rtl'`. */
  dir?: ChartDirection | undefined;
  /** Custom numeric formatter. Defaults to Persian digits via `@negaresh/utils`. */
  formatValue?: ((value: number) => string) | undefined;
  /** Optional custom accessible name (defaults to `<label>: <value> (<bandWord>)`). */
  ariaLabel?: string | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

const VIEW_WIDTH = 300;
const VIEW_HEIGHT = 176;
const CX = 150;
const CY = 142;
const INNER_R = 80;
const OUTER_R = 104;
const MID_R = (INNER_R + OUTER_R) / 2;

function safeBandTone(tone: BandTone | undefined, mode: ChartMode): BandTone {
  const t = tone ?? 'band';
  if (mode === 'calm' && t === 'severe') return 'calm';
  return t;
}

function pillTone(severity: ChartSeverity | undefined, mode: ChartMode): string {
  if (!severity) return 'neutral';
  if (mode === 'calm') return severity === 'severe' ? 'calm-highlight' : 'neutral';
  return severity;
}

/** Builds an accessible `ChartTableData` for `<ChartFrame table={...} />`. */
export function buildGaugeTable(
  label: string,
  value: number,
  domain: readonly [number, number],
  bandWord: string,
  options: {
    caption?: string | undefined;
    formatValue?: ((value: number) => string) | undefined;
    messages?: ChartMessages | undefined;
  } = {},
): ChartTableData {
  const fmt = options.formatValue ?? formatChartNumber;
  const [min, max] = normalizeDomain(domain);
  return {
    ...(options.caption !== undefined ? { caption: options.caption } : {}),
    columns: [
      { key: 'scale', label: options.messages?.columnScale ?? 'شاخص' },
      { key: 'value', label: options.messages?.columnValue ?? 'مقدار', align: 'numeric' },
      { key: 'range', label: options.messages?.columnInterval ?? 'دامنه', align: 'numeric' },
      { key: 'band', label: options.messages?.columnBand ?? 'وضعیت' },
    ],
    rows: [
      {
        id: 'gauge-value',
        cells: {
          scale: label,
          value: fmt(value),
          range: options.messages
            ? options.messages.rangeBetween(fmt(min), fmt(max))
            : `${fmt(min)} تا ${fmt(max)}`,
          band: bandWord,
        },
      },
    ],
  };
}

/**
 * Bounded single-index semicircular SSR SVG Gauge chart (`d3-shape` `arc()`).
 * Always shows both the Persian number and the explicit band word (never colour alone).
 */
export function Gauge({
  value,
  domain,
  label,
  bandWord,
  severity,
  bands,
  referenceLines,
  mode = 'professional',
  dir = 'rtl',
  formatValue = formatChartNumber,
  ariaLabel,
  className,
  ref,
}: GaugeProps) {
  const [minVal, maxVal] = normalizeDomain(domain);
  const startAngle = dir === 'rtl' ? Math.PI / 2 : -Math.PI / 2;
  const endAngle = dir === 'rtl' ? -Math.PI / 2 : Math.PI / 2;

  const angleScale = scaleLinear<number, number>()
    .domain([minVal, maxVal])
    .range([startAngle, endAngle])
    .clamp(true);

  const makeArc = (a1: number, a2: number, inner = INNER_R, outer = OUTER_R, corner = 0) =>
    arc<unknown>()
      .innerRadius(inner)
      .outerRadius(outer)
      .startAngle(Math.min(a1, a2))
      .endAngle(Math.max(a1, a2))
      .cornerRadius(corner)({}) ?? '';

  const trackD = makeArc(-Math.PI / 2, Math.PI / 2, INNER_R, OUTER_R, 4);
  const valueAngle = angleScale(value);
  const activeD = makeArc(startAngle, valueAngle, INNER_R + 2, OUTER_R - 2, 4);
  const activeColor = severityStrokeToken(severity, mode);

  const markerX = roundCoord(CX + MID_R * Math.sin(valueAngle));
  const markerY = roundCoord(CY - MID_R * Math.cos(valueAngle));

  const minX = dir === 'rtl' ? CX + MID_R : CX - MID_R;
  const maxX = dir === 'rtl' ? CX - MID_R : CX + MID_R;

  const formattedVal = formatValue(value);
  const computedAria = ariaLabel ?? `${label}: ${formattedVal} (${bandWord})`;

  return (
    <div
      ref={ref}
      data-nds="Gauge"
      data-mode={mode}
      data-dir={dir}
      className={cx(styles.root, className)}
    >
      <svg
        className={styles.svg}
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        role="img"
        aria-label={computedAria}
      >
        <title>{computedAria}</title>

        <g transform={`translate(${CX}, ${CY})`}>
          <path d={trackD} className={styles.trackArc} />

          {bands?.map((b) => {
            const tone = safeBandTone(b.tone, mode);
            const bandD = makeArc(angleScale(b.from), angleScale(b.to), INNER_R + 1, OUTER_R - 1);
            return (
              <path
                key={`band-${b.from}-${b.to}-${tone}`}
                d={bandD}
                data-tone={tone}
                className={styles.bandArc}
              />
            );
          })}

          <path d={activeD} fill={activeColor} />

          {referenceLines?.map((r) => {
            const a = angleScale(r.value);
            const x1 = roundCoord((INNER_R - 4) * Math.sin(a));
            const y1 = roundCoord(-(INNER_R - 4) * Math.cos(a));
            const x2 = roundCoord((OUTER_R + 4) * Math.sin(a));
            const y2 = roundCoord(-(OUTER_R + 4) * Math.cos(a));
            return (
              <line
                key={`ref-${r.value}-${r.label ?? ''}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={styles.refTick}
              />
            );
          })}
        </g>

        <circle
          cx={markerX}
          cy={markerY}
          r={6}
          fill={activeColor}
          stroke="var(--nds-bg-surface)"
          strokeWidth={2.5}
        />

        <text x={CX} y={CY - 22} textAnchor="middle" className={styles.valueText}>
          {formattedVal}
        </text>
        <text x={CX} y={CY - 2} textAnchor="middle" className={styles.labelText}>
          {label}
        </text>

        <text x={roundCoord(minX)} y={CY + 20} textAnchor="middle" className={styles.endLabel}>
          {formatValue(minVal)}
        </text>
        <text x={roundCoord(maxX)} y={CY + 20} textAnchor="middle" className={styles.endLabel}>
          {formatValue(maxVal)}
        </text>
      </svg>

      <span className={styles.bandPill} data-tone={pillTone(severity, mode)}>
        {bandWord}
      </span>
    </div>
  );
}
