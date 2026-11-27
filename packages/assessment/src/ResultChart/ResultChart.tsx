import {
  Bar,
  buildBarLegend,
  buildBarTable,
  buildGaugeTable,
  buildIntervalBarTable,
  buildProfileLineLegend,
  buildProfileLineTable,
  buildRadarLegend,
  buildRadarTable,
  ChartFrame,
  type ChartFrameState,
  type ChartTableMode,
  Gauge,
  IntervalBar,
  ProfileLine,
  Radar,
  useChartMessages,
} from '@negaresh/charts';
import type { ReactNode, Ref } from 'react';
import type { AssessmentChartSpec, AssessmentMode } from '../types.ts';

export interface ResultChartProps {
  /** Discriminated `/api/v1` chart specification mapped onto `@negaresh/charts`. */
  spec: AssessmentChartSpec;
  /** Audience mode propagated to the chart and table builders. Default `'professional'`. */
  mode?: AssessmentMode | undefined;
  /** Heading level inside `ChartFrame`. Default `3`. */
  headingLevel?: 2 | 3 | 4 | 5 | 6 | undefined;
  /** Data table mode (`Radar` defaults to `'visible'` per D-67; others default to `'toggle'`). */
  tableMode?: ChartTableMode | undefined;
  /** Optional header action slot inside `ChartFrame`. */
  actions?: ReactNode | undefined;
  /** Async availability state forwarded to `ChartFrame`. Default `'ready'`. */
  state?: ChartFrameState | undefined;
  /** Retry handler when `state === 'error'`. */
  onRetry?: (() => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Declarative adapter mapping generic `/api/v1` `AssessmentChartSpec` definitions
 * (`profile-line`, `interval-bar`, `bar`, `radar`, `gauge`) to `@negaresh/charts`
 * wrapped in `<ChartFrame>` with accessible data tables, legends, and calm/professional parity.
 */
export function ResultChart({
  spec,
  mode = 'professional',
  headingLevel = 3,
  tableMode,
  actions,
  state = 'ready',
  onRetry,
  className,
  ref,
}: ResultChartProps) {
  const chartMessages = useChartMessages();
  const takeaway = mode === 'calm' && spec.calmTakeaway ? spec.calmTakeaway : spec.takeaway;

  switch (spec.type) {
    case 'profile-line': {
      const legend = buildProfileLineLegend(spec.series);
      const table = buildProfileLineTable(spec.categories, spec.series, {
        caption: spec.title,
        messages: chartMessages,
      });
      return (
        <ChartFrame
          ref={ref}
          title={spec.title}
          headingLevel={headingLevel}
          takeaway={takeaway}
          legend={spec.series.length > 1 ? legend : undefined}
          sourceNote={spec.sourceNote}
          table={table}
          tableMode={tableMode ?? 'toggle'}
          actions={actions}
          state={state}
          onRetry={onRetry}
          className={className}
        >
          <ProfileLine
            ariaLabel={spec.ariaLabel}
            categories={spec.categories}
            series={spec.series}
            domain={spec.domain}
            ticks={spec.ticks}
            bands={spec.bands}
            referenceLines={spec.referenceLines}
            dividers={spec.dividers}
            showValueLabels={spec.showValueLabels}
            mode={mode}
            dir={spec.dir}
          />
        </ChartFrame>
      );
    }

    case 'interval-bar': {
      const table = buildIntervalBarTable(spec.items, {
        mode,
        caption: spec.title,
        messages: chartMessages,
      });
      return (
        <ChartFrame
          ref={ref}
          title={spec.title}
          headingLevel={headingLevel}
          takeaway={takeaway}
          sourceNote={spec.sourceNote}
          table={table}
          tableMode={tableMode ?? 'toggle'}
          actions={actions}
          state={state}
          onRetry={onRetry}
          className={className}
        >
          <IntervalBar
            ariaLabel={spec.ariaLabel}
            items={spec.items}
            domain={spec.domain}
            ticks={spec.ticks}
            bands={spec.bands}
            referenceLines={spec.referenceLines}
            mode={mode}
            dir={spec.dir}
          />
        </ChartFrame>
      );
    }

    case 'bar': {
      const legend = buildBarLegend(spec.series);
      const table = buildBarTable(spec.categories, spec.series, {
        caption: spec.title,
        messages: chartMessages,
      });
      return (
        <ChartFrame
          ref={ref}
          title={spec.title}
          headingLevel={headingLevel}
          takeaway={takeaway}
          legend={spec.series.length > 1 ? legend : undefined}
          sourceNote={spec.sourceNote}
          table={table}
          tableMode={tableMode ?? 'toggle'}
          actions={actions}
          state={state}
          onRetry={onRetry}
          className={className}
        >
          <Bar
            ariaLabel={spec.ariaLabel}
            categories={spec.categories}
            series={spec.series}
            orientation={spec.orientation}
            domain={spec.domain}
            ticks={spec.ticks}
            bands={spec.bands}
            referenceLines={spec.referenceLines}
            showDirectLabels={spec.showDirectLabels}
            mode={mode}
            dir={spec.dir}
          />
        </ChartFrame>
      );
    }

    case 'radar': {
      const legend = buildRadarLegend(spec.series);
      const table = buildRadarTable(spec.axes, spec.series, {
        caption: spec.title,
        messages: chartMessages,
      });
      return (
        <ChartFrame
          ref={ref}
          title={spec.title}
          headingLevel={headingLevel}
          takeaway={takeaway}
          legend={legend}
          sourceNote={spec.sourceNote}
          table={table}
          tableMode={tableMode ?? 'visible'}
          actions={actions}
          state={state}
          onRetry={onRetry}
          className={className}
        >
          <Radar
            ariaLabel={spec.ariaLabel}
            axes={spec.axes}
            series={spec.series}
            domain={spec.domain}
            rings={spec.rings}
          />
        </ChartFrame>
      );
    }

    case 'gauge': {
      const resolvedBandWord =
        mode === 'calm' && spec.calmBandWord ? spec.calmBandWord : spec.bandWord;
      const table = buildGaugeTable(spec.label, spec.value, spec.domain, resolvedBandWord, {
        caption: spec.title,
        messages: chartMessages,
      });
      return (
        <ChartFrame
          ref={ref}
          title={spec.title}
          headingLevel={headingLevel}
          takeaway={takeaway}
          sourceNote={spec.sourceNote}
          table={table}
          tableMode={tableMode ?? 'toggle'}
          actions={actions}
          state={state}
          onRetry={onRetry}
          className={className}
        >
          <Gauge
            ariaLabel={spec.ariaLabel}
            value={spec.value}
            domain={spec.domain}
            label={spec.label}
            bandWord={resolvedBandWord}
            severity={spec.severity}
            bands={spec.bands}
            referenceLines={spec.referenceLines}
            mode={mode}
            dir={spec.dir}
          />
        </ChartFrame>
      );
    }
  }
}
