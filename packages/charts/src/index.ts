// Cascade layer order must be imported first so @layer nds.components always sorts predictably.
import './layers.css';

export {
  Bar,
  type BarCategory,
  type BarOrientation,
  type BarProps,
  type BarSeries,
  buildBarLegend,
  buildBarTable,
} from './Bar/index.ts';
export {
  ChartFrame,
  type ChartFrameProps,
  type ChartFrameState,
  type ChartLegendItem,
  type ChartTableColumn,
  type ChartTableData,
  type ChartTableMode,
  type ChartTableRow,
} from './ChartFrame/index.ts';
export { buildGaugeTable, Gauge, type GaugeProps } from './Gauge/index.ts';
export {
  buildIntervalBarTable,
  IntervalBar,
  type IntervalBarItem,
  type IntervalBarProps,
} from './IntervalBar/index.ts';
export type { MarkerShape } from './internal/markers.tsx';
export type {
  ChartDirection,
  ChartMode,
  ChartSeverity,
  VizToneIndex,
} from './internal/scale.ts';
export {
  ChartMessagesProvider,
  type ChartMessagesProviderProps,
  useChartMessages,
} from './messages/context.tsx';
export type { ChartMessages } from './messages/types.ts';
export {
  Band,
  type BandProps,
  type BandSpec,
  type BandTone,
  ReferenceLine,
  type ReferenceLineProps,
  type ReferenceLineSpec,
  type ReferenceLineStyle,
  type ReferenceLineTone,
} from './primitives/index.ts';
export {
  buildProfileLineLegend,
  buildProfileLineTable,
  ProfileLine,
  type ProfileLineCategory,
  type ProfileLineDivider,
  type ProfileLineProps,
  type ProfileLineSeries,
} from './ProfileLine/index.ts';
export {
  buildRadarLegend,
  buildRadarTable,
  Radar,
  type RadarAxis,
  type RadarProps,
  type RadarSeries,
} from './Radar/index.ts';
export {
  Sparkline,
  type SparklineProps,
  type SparklineSize,
  type SparklineTone,
} from './Sparkline/index.ts';
