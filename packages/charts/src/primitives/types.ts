import type { ChartMode } from '../internal/scale.ts';

export type ReferenceLineTone = 'ref' | 'accent' | 'info' | 'warning' | 'danger';
export type ReferenceLineStyle = 'dashed' | 'dotted' | 'solid';

/** Declarative specification for a reference line (norm mean, clinical cut-off, target). */
export interface ReferenceLineSpec {
  /** Data value along the numeric axis. */
  value: number;
  /** Optional short inline label (e.g. «میانگین ۵۰» or «آستانهٔ ۶۵»). */
  label?: string | undefined;
  /** Semantic tone. In `calm` mode, `'danger'` maps to `'accent'` (never rose). Default `'ref'`. */
  tone?: ReferenceLineTone | undefined;
  /** Line dash pattern for print/greyscale clarity. Default `'dashed'`. */
  lineStyle?: ReferenceLineStyle | undefined;
}

export type BandTone = 'band' | 'ok' | 'caution' | 'severe' | 'calm';

/** Declarative specification for a shaded norm or target range band. */
export interface BandSpec {
  /** Lower bound on the numeric axis. */
  from: number;
  /** Upper bound on the numeric axis. */
  to: number;
  /** Optional short label displayed inside/above the band. */
  label?: string | undefined;
  /** Semantic tone. In `calm` mode, `'severe'` maps to `'calm'` (never rose). Default `'band'`. */
  tone?: BandTone | undefined;
}

export interface ReferenceLineProps {
  /** Orientation of the reference line inside the SVG plot area. */
  orientation: 'vertical' | 'horizontal';
  /** Coordinate along the perpendicular axis (`x` for vertical, `y` for horizontal). */
  position: number;
  /** Start coordinate of the line span (`y1` for vertical, `x1` for horizontal). */
  start: number;
  /** End coordinate of the line span (`y2` for vertical, `x2` for horizontal). */
  end: number;
  /** Optional label drawn near the line start/end. */
  label?: string | undefined;
  /** Label alignment anchor. */
  labelPosition?: 'start' | 'end' | undefined;
  /** Semantic tone. Default `'ref'`. */
  tone?: ReferenceLineTone | undefined;
  /** Audience mode; prevents rose/danger styling in `'calm'` mode. Default `'professional'`. */
  mode?: ChartMode | undefined;
  /** Reading direction for inward horizontal label alignment. Default `'rtl'`. */
  dir?: 'rtl' | 'ltr' | undefined;
  /** Dash pattern. Default `'dashed'`. */
  lineStyle?: ReferenceLineStyle | undefined;
  className?: string | undefined;
}

export interface BandProps {
  /** Orientation of the shaded range band inside the SVG plot area. */
  orientation: 'vertical' | 'horizontal';
  /** First edge along the numeric axis (`x` for vertical band, `y` for horizontal band). */
  fromCoord: number;
  /** Second edge along the numeric axis. */
  toCoord: number;
  /** Perpendicular span start (`y` for vertical band, `x` for horizontal band). */
  spanStart: number;
  /** Perpendicular span end. */
  spanEnd: number;
  /** Optional short caption rendered unobtrusively inside the band. */
  label?: string | undefined;
  /** Semantic tone. Default `'band'`. */
  tone?: BandTone | undefined;
  /** Audience mode; prevents rose/danger styling in `'calm'` mode. Default `'professional'`. */
  mode?: ChartMode | undefined;
  className?: string | undefined;
}
