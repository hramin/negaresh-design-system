import { formatNumber } from '@negaresh/utils';
import { type ReactNode, type Ref, useId } from 'react';
import {
  Label,
  Slider as RacSlider,
  SliderFill,
  SliderOutput,
  type SliderProps as RacSliderProps,
  SliderThumb,
  SliderTrack,
} from 'react-aria-components';
import { cx } from '../internal/cx.ts';
import { fieldStyles } from '../internal/field.tsx';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './Slider.module.css';

interface SliderBaseProps
  extends Pick<
    RacSliderProps<number | number[]>,
    | 'id'
    | 'minValue'
    | 'maxValue'
    | 'step'
    | 'orientation'
    | 'formatOptions'
    | 'isDisabled'
    | 'aria-label'
    | 'aria-labelledby'
  > {
  /** Visible label associated with the slider. */
  label?: ReactNode;
  /** Optional help text beneath the slider. */
  description?: ReactNode;
  /** Show formatted Persian current value(s) next to the label. Default `true`. */
  showValue?: boolean | undefined;
  /** Custom value formatter (defaults to Persian `Intl.NumberFormat` via `formatOptions`). */
  formatValue?: ((value: number) => string) | undefined;
  /** Numeric tick positions displayed with Persian digits along the horizontal track. */
  ticks?: readonly number[] | undefined;
  /** Custom tick label formatter (defaults to Persian `formatNumber`). */
  formatTick?: ((value: number) => string) | undefined;
  /** Class applied only to the slider root. */
  className?: string | undefined;
  /** Ref forwarded to the slider root container. */
  ref?: Ref<HTMLDivElement> | undefined;
}

export interface SliderProps extends SliderBaseProps {
  /** Controlled numeric value. */
  value?: number | undefined;
  /** Initial uncontrolled numeric value. */
  defaultValue?: number | undefined;
  /** Called continuously while dragging or stepping. */
  onChange?: ((value: number) => void) | undefined;
  /** Called once when the user finishes adjusting the thumb. */
  onChangeEnd?: ((value: number) => void) | undefined;
  /** Form field name for the slider thumb input. */
  name?: string | undefined;
}

export interface RangeSliderProps extends SliderBaseProps {
  /** Controlled `[start, end]` numeric tuple. */
  value?: [number, number] | undefined;
  /** Initial uncontrolled `[start, end]` tuple. */
  defaultValue?: [number, number] | undefined;
  /** Called continuously as either thumb moves. */
  onChange?: ((value: [number, number]) => void) | undefined;
  /** Called once when the user finishes adjusting either thumb. */
  onChangeEnd?: ((value: [number, number]) => void) | undefined;
  /** Accessible names for `[start, end]` thumbs. Defaults to localized Persian labels. */
  thumbLabels?: [string, string] | undefined;
  /** Form field names for the start and end thumb inputs. */
  startName?: string | undefined;
  endName?: string | undefined;
}

function SliderTicks({
  ticks,
  minValue,
  maxValue,
  formatTick,
  formatOptions,
}: {
  ticks: readonly number[];
  minValue: number;
  maxValue: number;
  formatTick?: ((value: number) => string) | undefined;
  formatOptions?: Intl.NumberFormatOptions | undefined;
}) {
  const span = maxValue - minValue;
  if (span <= 0 || ticks.length === 0) return null;
  return (
    <div className={styles.ticks} aria-hidden="true">
      {ticks.map((tick) => {
        const pct = Math.min(100, Math.max(0, ((tick - minValue) / span) * 100));
        const align = pct <= 0 ? 'start' : pct >= 100 ? 'end' : 'center';
        const label = formatTick
          ? formatTick(tick)
          : formatOptions
            ? new Intl.NumberFormat('fa-IR', formatOptions).format(tick)
            : formatNumber(tick);
        return (
          <span
            key={tick}
            className={styles.tick}
            data-align={align}
            style={{ insetInlineStart: `${pct}%` }}
          >
            <span className={styles.tickMark} />
            <span>{label}</span>
          </span>
        );
      })}
    </div>
  );
}

/**
 * Single-value slider built on React Aria Slider with RTL track fill,
 * 44 px thumb touch targets, and optional Persian numeric ticks.
 */
export function Slider({
  label,
  description,
  showValue = true,
  formatValue,
  ticks,
  formatTick,
  minValue = 0,
  maxValue = 100,
  step = 1,
  orientation = 'horizontal',
  formatOptions,
  value,
  defaultValue,
  onChange,
  onChangeEnd,
  name,
  className,
  ref,
  ...rest
}: SliderProps) {
  const descriptionId = useId();
  return (
    <RacSlider<number>
      {...rest}
      ref={ref}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      orientation={orientation}
      {...(formatOptions !== undefined ? { formatOptions } : {})}
      {...(value !== undefined ? { value } : {})}
      {...(defaultValue !== undefined ? { defaultValue } : {})}
      {...(onChange !== undefined ? { onChange } : {})}
      {...(onChangeEnd !== undefined ? { onChangeEnd } : {})}
      data-nds="Slider"
      className={cx(styles.root, className)}
    >
      {(label != null || showValue) && (
        <div className={styles.header}>
          {label != null && <Label className={cx(fieldStyles.label)}>{label}</Label>}
          {showValue && (
            <SliderOutput className={cx(styles.output)}>
              {({ state }) => {
                const raw = state.values[0];
                if (raw === undefined) return '';
                return formatValue ? formatValue(raw) : state.getThumbValueLabel(0);
              }}
            </SliderOutput>
          )}
        </div>
      )}
      <SliderTrack className={cx(styles.track)}>
        <div className={styles.rail}>
          <SliderFill className={cx(styles.fill)} />
        </div>
        <SliderThumb
          index={0}
          {...(name !== undefined ? { name } : {})}
          {...(description != null ? { 'aria-describedby': descriptionId } : {})}
          className={cx(styles.thumb)}
        />
      </SliderTrack>
      {orientation === 'horizontal' && ticks != null && ticks.length > 0 && (
        <SliderTicks
          ticks={ticks}
          minValue={minValue}
          maxValue={maxValue}
          formatTick={formatTick}
          formatOptions={formatOptions}
        />
      )}
      {description != null && (
        <span id={descriptionId} className={fieldStyles.description}>
          {description}
        </span>
      )}
    </RacSlider>
  );
}

/**
 * Dual-thumb range slider built on React Aria Slider with RTL fill,
 * Persian range output («از … تا …»), and optional Persian numeric ticks.
 */
export function RangeSlider({
  label,
  description,
  showValue = true,
  formatValue,
  ticks,
  formatTick,
  minValue = 0,
  maxValue = 100,
  step = 1,
  orientation = 'horizontal',
  formatOptions,
  value,
  defaultValue,
  onChange,
  onChangeEnd,
  thumbLabels,
  startName,
  endName,
  className,
  ref,
  ...rest
}: RangeSliderProps) {
  const messages = useNdsMessages();
  const descriptionId = useId();
  const resolvedLabels: [string, string] = thumbLabels ?? [
    messages.sliderRangeStart,
    messages.sliderRangeEnd,
  ];
  const resolvedDefault = defaultValue ?? [minValue, maxValue];

  return (
    <RacSlider<number[]>
      {...rest}
      ref={ref}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      orientation={orientation}
      {...(formatOptions !== undefined ? { formatOptions } : {})}
      {...(value !== undefined ? { value } : { defaultValue: resolvedDefault })}
      {...(onChange !== undefined
        ? {
            onChange: (next) => {
              if (next.length >= 2 && next[0] !== undefined && next[1] !== undefined) {
                onChange([next[0], next[1]]);
              }
            },
          }
        : {})}
      {...(onChangeEnd !== undefined
        ? {
            onChangeEnd: (next) => {
              if (next.length >= 2 && next[0] !== undefined && next[1] !== undefined) {
                onChangeEnd([next[0], next[1]]);
              }
            },
          }
        : {})}
      data-nds="RangeSlider"
      className={cx(styles.root, className)}
    >
      {(label != null || showValue) && (
        <div className={styles.header}>
          {label != null && <Label className={cx(fieldStyles.label)}>{label}</Label>}
          {showValue && (
            <SliderOutput className={cx(styles.output)}>
              {({ state }) => {
                const start = state.values[0];
                const end = state.values[1];
                if (start === undefined || end === undefined) return '';
                const startText = formatValue ? formatValue(start) : state.getThumbValueLabel(0);
                const endText = formatValue ? formatValue(end) : state.getThumbValueLabel(1);
                return `${startText} ${messages.rangeSeparator} ${endText}`;
              }}
            </SliderOutput>
          )}
        </div>
      )}
      <SliderTrack className={cx(styles.track)}>
        <div className={styles.rail}>
          <SliderFill className={cx(styles.fill)} />
        </div>
        <SliderThumb
          index={0}
          aria-label={resolvedLabels[0]}
          {...(startName !== undefined ? { name: startName } : {})}
          {...(description != null ? { 'aria-describedby': descriptionId } : {})}
          className={cx(styles.thumb)}
        />
        <SliderThumb
          index={1}
          aria-label={resolvedLabels[1]}
          {...(endName !== undefined ? { name: endName } : {})}
          {...(description != null ? { 'aria-describedby': descriptionId } : {})}
          className={cx(styles.thumb)}
        />
      </SliderTrack>
      {orientation === 'horizontal' && ticks != null && ticks.length > 0 && (
        <SliderTicks
          ticks={ticks}
          minValue={minValue}
          maxValue={maxValue}
          formatTick={formatTick}
          formatOptions={formatOptions}
        />
      )}
      {description != null && (
        <span id={descriptionId} className={fieldStyles.description}>
          {description}
        </span>
      )}
    </RacSlider>
  );
}
