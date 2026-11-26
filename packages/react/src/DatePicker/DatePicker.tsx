import { iconCalendar } from '@negaresh/icons';
import {
  type CalendarDate,
  getTodayIsoDate,
  parseIsoDate,
  toIsoDate,
} from '@negaresh/utils';
import { type ReactNode, type Ref, useMemo } from 'react';
import {
  Button,
  DateInput,
  DateSegment,
  Dialog,
  FieldError,
  Group,
  Label,
  Popover,
  type PopoverProps,
  ProgressBar,
  DatePicker as RacDatePicker,
  type DatePickerProps as RacDatePickerProps,
  DateRangePicker as RacDateRangePicker,
  type DateRangePickerProps as RacDateRangePickerProps,
  Text,
} from 'react-aria-components';
import {
  type DateRangeValue,
  PopoverCalendar,
  PopoverRangeCalendar,
} from '../Calendar/Calendar.tsx';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { type FieldSize, fieldStyles, fieldValidationMessage } from '../internal/field.tsx';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './DatePicker.module.css';

interface DatePickerBaseProps {
  /** Visible field label. */
  label: ReactNode;
  /** Help text announced with the date field. */
  description?: ReactNode;
  /** Validation error displayed when invalid. */
  errorMessage?: ReactNode;
  /** Earliest selectable date in ISO `YYYY-MM-DD`. */
  minValue?: string | undefined;
  /** Latest selectable date in ISO `YYYY-MM-DD`. */
  maxValue?: string | undefined;
  /** Placeholder Jalali calendar reference date in ISO `YYYY-MM-DD`. Defaults to Tehran today. */
  placeholderValue?: string | undefined;
  /** Predicate receiving ISO `YYYY-MM-DD`; returning `true` marks the day unavailable. */
  isDateUnavailable?: ((isoDate: string) => boolean) | undefined;
  /** Popover placement relative to the input group. Default `'bottom start'`. */
  placement?: PopoverProps['placement'] | undefined;
  /** Read-only while pending; retains current value for form submission. */
  isPending?: boolean | undefined;
  /** Control height. Default `md`; small retains a 44 px target. */
  size?: FieldSize | undefined;
  /** Class applied only to the field root. */
  className?: string | undefined;
  /** Ref forwarded to the field root container. */
  ref?: Ref<HTMLDivElement> | undefined;
}

export interface DatePickerProps
  extends DatePickerBaseProps,
    Pick<
      RacDatePickerProps<CalendarDate>,
      | 'id'
      | 'name'
      | 'isRequired'
      | 'isDisabled'
      | 'isReadOnly'
      | 'isInvalid'
      | 'shouldCloseOnSelect'
      | 'validationBehavior'
      | 'aria-label'
      | 'aria-labelledby'
      | 'aria-describedby'
    > {
  /** Controlled selected date in canonical ISO `YYYY-MM-DD` or `null`. */
  value?: string | null | undefined;
  /** Initial uncontrolled selected date in canonical ISO `YYYY-MM-DD`. */
  defaultValue?: string | null | undefined;
  /** Called with canonical ISO `YYYY-MM-DD` or `null` when cleared. */
  onChange?: ((isoDate: string | null) => void) | undefined;
  /** Custom validator receiving canonical ISO `YYYY-MM-DD` or `null`. */
  validate?: ((value: string | null) => string | string[] | true | null | undefined) | undefined;
}

export interface DateRangePickerProps
  extends DatePickerBaseProps,
    Pick<
      RacDateRangePickerProps<CalendarDate>,
      | 'id'
      | 'startName'
      | 'endName'
      | 'isRequired'
      | 'isDisabled'
      | 'isReadOnly'
      | 'isInvalid'
      | 'shouldCloseOnSelect'
      | 'allowsNonContiguousRanges'
      | 'validationBehavior'
      | 'aria-label'
      | 'aria-labelledby'
      | 'aria-describedby'
    > {
  /** Controlled selected range (`{ start, end }` in ISO `YYYY-MM-DD`) or `null`. */
  value?: DateRangeValue | null | undefined;
  /** Initial uncontrolled selected range (`{ start, end }` in ISO `YYYY-MM-DD`). */
  defaultValue?: DateRangeValue | null | undefined;
  /** Called with canonical ISO `{ start, end }` or `null`. */
  onChange?: ((range: DateRangeValue | null) => void) | undefined;
  /** Custom validator receiving canonical ISO `{ start, end }` or `null`. */
  validate?:
    | ((value: DateRangeValue | null) => string | string[] | true | null | undefined)
    | undefined;
}

function parseRange(range: DateRangeValue | null | undefined) {
  if (range == null) return undefined;
  const start = parseIsoDate(range.start);
  const end = parseIsoDate(range.end);
  if (!start || !end) return undefined;
  return { start, end };
}

/**
 * Jalali (Solar Hijri) date picker built on React Aria DatePicker.
 * Combines editable Persian-digit segments (`YYYY/MM/DD`) with a Jalali calendar popover
 * (Saturday start, Friday weekend) while accepting and emitting canonical ISO-8601 (`YYYY-MM-DD`).
 */
export function DatePicker({
  label,
  description,
  errorMessage,
  value,
  defaultValue,
  onChange,
  minValue,
  maxValue,
  placeholderValue,
  isDateUnavailable,
  validate,
  placement = 'bottom start',
  isPending,
  isReadOnly,
  size = 'md',
  className,
  ref,
  ...rest
}: DatePickerProps) {
  const messages = useNdsMessages();

  const parsedValue = useMemo(
    () => (value === undefined ? undefined : value === null ? null : parseIsoDate(value)),
    [value],
  );
  const parsedDefault = useMemo(
    () => (defaultValue == null ? undefined : (parseIsoDate(defaultValue) ?? undefined)),
    [defaultValue],
  );
  const parsedMin = useMemo(
    () => (minValue === undefined ? undefined : (parseIsoDate(minValue) ?? undefined)),
    [minValue],
  );
  const parsedMax = useMemo(
    () => (maxValue === undefined ? undefined : (parseIsoDate(maxValue) ?? undefined)),
    [maxValue],
  );
  const parsedPlaceholder = useMemo(
    () => parseIsoDate(placeholderValue ?? getTodayIsoDate()) ?? undefined,
    [placeholderValue],
  );

  return (
    <RacDatePicker<CalendarDate>
      {...rest}
      ref={ref}
      granularity="day"
      isReadOnly={Boolean(isReadOnly || isPending)}
      {...(parsedValue !== undefined ? { value: parsedValue } : {})}
      {...(parsedDefault !== undefined ? { defaultValue: parsedDefault } : {})}
      {...(parsedMin !== undefined ? { minValue: parsedMin } : {})}
      {...(parsedMax !== undefined ? { maxValue: parsedMax } : {})}
      {...(parsedPlaceholder !== undefined ? { placeholderValue: parsedPlaceholder } : {})}
      {...(onChange !== undefined
        ? { onChange: (next) => onChange(next ? toIsoDate(next) : null) }
        : {})}
      {...(isDateUnavailable !== undefined
        ? { isDateUnavailable: (date) => isDateUnavailable(toIsoDate(date as CalendarDate)) }
        : {})}
      {...(validate !== undefined
        ? { validate: (next) => validate(next ? toIsoDate(next) : null) }
        : {})}
      data-nds="DatePicker"
      data-size={size}
      data-pending={isPending ? 'true' : undefined}
      className={cx(fieldStyles.root, styles.root, className)}
    >
      <Label className={cx(fieldStyles.label)}>{label}</Label>
      <Group className={cx(styles.control)}>
        <DateInput className={cx(styles.segments)}>
          {(segment) => <DateSegment segment={segment} className={cx(styles.segment)} />}
        </DateInput>
        <span className={styles.end}>
          {isPending && (
            <ProgressBar
              isIndeterminate
              aria-label={messages.pending}
              className={cx(fieldStyles.pending)}
            >
              <span aria-hidden="true" />
            </ProgressBar>
          )}
          <Button
            aria-label={messages.openCalendar}
            className={cx(styles.trigger)}
          >
            <Icon icon={iconCalendar} size="sm" />
          </Button>
        </span>
      </Group>
      {description != null && (
        <Text slot="description" className={cx(fieldStyles.description)}>
          {description}
        </Text>
      )}
      <div className={fieldStyles.errorSlot} data-field-error-slot>
        <FieldError className={cx(fieldStyles.error)}>
          {(result) => (
            <span role="alert">{errorMessage ?? fieldValidationMessage(result, messages)}</span>
          )}
        </FieldError>
      </div>
      <Popover
        placement={placement}
        offset={6}
        data-nds="DatePickerPopover"
        className={cx(styles.popover)}
      >
        <Dialog className={cx(styles.dialog)}>
          <PopoverCalendar />
        </Dialog>
      </Popover>
    </RacDatePicker>
  );
}

/**
 * Jalali (Solar Hijri) date range picker built on React Aria DateRangePicker.
 * Pairs start and end Persian-digit date inputs (separated by «تا») with a Jalali
 * RangeCalendar popover, emitting canonical ISO-8601 `{ start, end }`.
 */
export function DateRangePicker({
  label,
  description,
  errorMessage,
  value,
  defaultValue,
  onChange,
  minValue,
  maxValue,
  placeholderValue,
  isDateUnavailable,
  validate,
  placement = 'bottom start',
  isPending,
  isReadOnly,
  size = 'md',
  className,
  ref,
  ...rest
}: DateRangePickerProps) {
  const messages = useNdsMessages();

  const parsedValue = useMemo(
    () => (value === undefined ? undefined : value === null ? null : (parseRange(value) ?? null)),
    [value],
  );
  const parsedDefault = useMemo(() => parseRange(defaultValue), [defaultValue]);
  const parsedMin = useMemo(
    () => (minValue === undefined ? undefined : (parseIsoDate(minValue) ?? undefined)),
    [minValue],
  );
  const parsedMax = useMemo(
    () => (maxValue === undefined ? undefined : (parseIsoDate(maxValue) ?? undefined)),
    [maxValue],
  );
  const parsedPlaceholder = useMemo(
    () => parseIsoDate(placeholderValue ?? getTodayIsoDate()) ?? undefined,
    [placeholderValue],
  );

  return (
    <RacDateRangePicker<CalendarDate>
      {...rest}
      ref={ref}
      granularity="day"
      isReadOnly={Boolean(isReadOnly || isPending)}
      {...(parsedValue !== undefined ? { value: parsedValue } : {})}
      {...(parsedDefault !== undefined ? { defaultValue: parsedDefault } : {})}
      {...(parsedMin !== undefined ? { minValue: parsedMin } : {})}
      {...(parsedMax !== undefined ? { maxValue: parsedMax } : {})}
      {...(parsedPlaceholder !== undefined ? { placeholderValue: parsedPlaceholder } : {})}
      {...(onChange !== undefined
        ? {
            onChange: (next) =>
              onChange(
                next ? { start: toIsoDate(next.start), end: toIsoDate(next.end) } : null,
              ),
          }
        : {})}
      {...(isDateUnavailable !== undefined
        ? { isDateUnavailable: (date) => isDateUnavailable(toIsoDate(date as CalendarDate)) }
        : {})}
      {...(validate !== undefined
        ? {
            validate: (next) =>
              validate(
                next ? { start: toIsoDate(next.start), end: toIsoDate(next.end) } : null,
              ),
          }
        : {})}
      data-nds="DateRangePicker"
      data-size={size}
      data-pending={isPending ? 'true' : undefined}
      className={cx(fieldStyles.root, styles.root, className)}
    >
      <Label className={cx(fieldStyles.label)}>{label}</Label>
      <Group className={cx(styles.control)}>
        <div className={styles.rangeInputs}>
          <DateInput slot="start" className={cx(styles.rangeSegments)}>
            {(segment) => <DateSegment segment={segment} className={cx(styles.segment)} />}
          </DateInput>
          <span className={styles.separator} aria-hidden="true">
            {messages.rangeSeparator}
          </span>
          <DateInput slot="end" className={cx(styles.rangeSegments)}>
            {(segment) => <DateSegment segment={segment} className={cx(styles.segment)} />}
          </DateInput>
        </div>
        <span className={styles.end}>
          {isPending && (
            <ProgressBar
              isIndeterminate
              aria-label={messages.pending}
              className={cx(fieldStyles.pending)}
            >
              <span aria-hidden="true" />
            </ProgressBar>
          )}
          <Button
            aria-label={messages.openCalendar}
            className={cx(styles.trigger)}
          >
            <Icon icon={iconCalendar} size="sm" />
          </Button>
        </span>
      </Group>
      {description != null && (
        <Text slot="description" className={cx(fieldStyles.description)}>
          {description}
        </Text>
      )}
      <div className={fieldStyles.errorSlot} data-field-error-slot>
        <FieldError className={cx(fieldStyles.error)}>
          {(result) => (
            <span role="alert">{errorMessage ?? fieldValidationMessage(result, messages)}</span>
          )}
        </FieldError>
      </div>
      <Popover
        placement={placement}
        offset={6}
        data-nds="DateRangePickerPopover"
        className={cx(styles.popover)}
      >
        <Dialog className={cx(styles.dialog)}>
          <PopoverRangeCalendar />
        </Dialog>
      </Popover>
    </RacDateRangePicker>
  );
}
