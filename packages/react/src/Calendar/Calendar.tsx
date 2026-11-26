import { iconChevronEnd, iconChevronStart } from '@negaresh/icons';
import {
  type CalendarDate,
  createPersianCalendar,
  getTodayIsoDate,
  isPersianWeekend,
  parseIsoDate,
  TEHRAN,
  toIsoDate,
  toPersianDigits,
} from '@negaresh/utils';
import { type ReactNode, type Ref, useContext, useMemo } from 'react';
import {
  Button,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarStateContext,
  Heading,
  Calendar as RacCalendar,
  type CalendarProps as RacCalendarProps,
  RangeCalendar as RacRangeCalendar,
  type RangeCalendarProps as RacRangeCalendarProps,
  RangeCalendarStateContext,
  Text,
} from 'react-aria-components';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './Calendar.module.css';

const PERSIAN_MONTH_FMT = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  month: 'long',
  timeZone: TEHRAN,
});

function CalendarMonthHeading() {
  const calendarState = useContext(CalendarStateContext);
  const rangeState = useContext(RangeCalendarStateContext);
  const visibleStart = (calendarState ?? rangeState)?.visibleRange.start;
  if (!visibleStart) return <Heading className={cx(styles.heading)} />;
  const month = PERSIAN_MONTH_FMT.format(visibleStart.toDate(TEHRAN));
  return (
    <Heading className={cx(styles.heading)}>
      {`${month} ${toPersianDigits(visibleStart.year)}`}
    </Heading>
  );
}

/** Canonical Gregorian ISO-8601 (`YYYY-MM-DD`) date range emitted and accepted at component edges. */
export interface DateRangeValue {
  /** Range start in ISO `YYYY-MM-DD`. */
  start: string;
  /** Range end in ISO `YYYY-MM-DD`. */
  end: string;
}

interface CalendarSharedProps {
  /** Earliest selectable date in ISO `YYYY-MM-DD`. */
  minValue?: string | undefined;
  /** Latest selectable date in ISO `YYYY-MM-DD`. */
  maxValue?: string | undefined;
  /** Controlled focused date in ISO `YYYY-MM-DD`. */
  focusedValue?: string | undefined;
  /** Initial uncontrolled focused date in ISO `YYYY-MM-DD`. Defaults to Tehran today. */
  defaultFocusedValue?: string | undefined;
  /** Called with ISO `YYYY-MM-DD` when keyboard focus moves to another day. */
  onFocusChange?: ((isoDate: string) => void) | undefined;
  /** Predicate receiving ISO `YYYY-MM-DD`; returning `true` marks the day unavailable. */
  isDateUnavailable?: ((isoDate: string) => boolean) | undefined;
  /** Validation error displayed below the grid when `isInvalid` is true. */
  errorMessage?: ReactNode;
  /** Class applied only to the calendar root. */
  className?: string | undefined;
  /** Ref forwarded to the calendar root element. */
  ref?: Ref<HTMLDivElement> | undefined;
}

export interface CalendarProps
  extends CalendarSharedProps,
    Pick<
      RacCalendarProps<CalendarDate>,
      'isDisabled' | 'isReadOnly' | 'isInvalid' | 'aria-label' | 'aria-labelledby'
    > {
  /** Controlled selected date in ISO `YYYY-MM-DD` or `null`. */
  value?: string | null | undefined;
  /** Initial uncontrolled selected date in ISO `YYYY-MM-DD`. */
  defaultValue?: string | null | undefined;
  /** Called with canonical ISO `YYYY-MM-DD` when the user selects a date. */
  onChange?: ((isoDate: string) => void) | undefined;
}

export interface RangeCalendarProps
  extends CalendarSharedProps,
    Pick<
      RacRangeCalendarProps<CalendarDate>,
      | 'isDisabled'
      | 'isReadOnly'
      | 'isInvalid'
      | 'allowsNonContiguousRanges'
      | 'aria-label'
      | 'aria-labelledby'
    > {
  /** Controlled selected range (`{ start, end }` in ISO `YYYY-MM-DD`) or `null`. */
  value?: DateRangeValue | null | undefined;
  /** Initial uncontrolled selected range (`{ start, end }` in ISO `YYYY-MM-DD`). */
  defaultValue?: DateRangeValue | null | undefined;
  /** Called with canonical ISO `{ start, end }` when a range selection completes. */
  onChange?: ((range: DateRangeValue) => void) | undefined;
}

function CalendarChrome({ errorMessage }: { errorMessage?: ReactNode }) {
  const messages = useNdsMessages();
  return (
    <>
      <div className={styles.header}>
        <Button
          slot="previous"
          aria-label={messages.previousMonth}
          className={cx(styles.navButton)}
        >
          <Icon icon={iconChevronStart} size="sm" />
        </Button>
        <CalendarMonthHeading />
        <Button
          slot="next"
          aria-label={messages.nextMonth}
          className={cx(styles.navButton)}
        >
          <Icon icon={iconChevronEnd} size="sm" />
        </Button>
      </div>
      <CalendarGrid weekdayStyle="narrow" className={cx(styles.grid)}>
        <CalendarGridHeader>
          {(day) => (
            <CalendarHeaderCell className={cx(styles.headerCell)}>{day}</CalendarHeaderCell>
          )}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => (
            <CalendarCell
              date={date}
              className={cx(styles.cell)}
              data-weekend={isPersianWeekend(date) ? 'true' : undefined}
            />
          )}
        </CalendarGridBody>
      </CalendarGrid>
      {errorMessage != null && (
        <Text slot="errorMessage" className={cx(styles.error)}>
          <span role="alert">{errorMessage}</span>
        </Text>
      )}
    </>
  );
}

/**
 * Internal Jalali calendar wired to `DatePicker`'s `CalendarContext` inside popovers.
 * @internal
 */
export function PopoverCalendar() {
  return (
    <RacCalendar<CalendarDate>
      createCalendar={createPersianCalendar}
      firstDayOfWeek="sat"
      data-nds="Calendar"
      data-in-popover="true"
      className={cx(styles.root)}
    >
      <CalendarChrome />
    </RacCalendar>
  );
}

/**
 * Internal Jalali range calendar wired to `DateRangePicker`'s `RangeCalendarContext` inside popovers.
 * @internal
 */
export function PopoverRangeCalendar() {
  return (
    <RacRangeCalendar<CalendarDate>
      createCalendar={createPersianCalendar}
      firstDayOfWeek="sat"
      data-nds="RangeCalendar"
      data-range="true"
      data-in-popover="true"
      className={cx(styles.root)}
    >
      <CalendarChrome />
    </RacRangeCalendar>
  );
}

/**
 * Jalali (Solar Hijri) single-date calendar built on React Aria Calendar.
 * Weeks start on Saturday (`ش`) with Friday (`ج`) marked as the weekend, Persian digits
 * with tabular numerals, and canonical Gregorian ISO-8601 (`YYYY-MM-DD`) values at the API edge.
 */
export function Calendar({
  value,
  defaultValue,
  onChange,
  minValue,
  maxValue,
  focusedValue,
  defaultFocusedValue,
  onFocusChange,
  isDateUnavailable,
  errorMessage,
  className,
  ref,
  ...rest
}: CalendarProps) {
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
  const parsedFocused = useMemo(
    () => (focusedValue === undefined ? undefined : (parseIsoDate(focusedValue) ?? undefined)),
    [focusedValue],
  );
  const parsedDefaultFocused = useMemo(() => {
    if (defaultFocusedValue !== undefined) return parseIsoDate(defaultFocusedValue) ?? undefined;
    if (focusedValue === undefined && value == null && defaultValue == null) {
      return parseIsoDate(getTodayIsoDate()) ?? undefined;
    }
    return undefined;
  }, [defaultFocusedValue, focusedValue, value, defaultValue]);

  return (
    <RacCalendar<CalendarDate>
      {...rest}
      ref={ref}
      createCalendar={createPersianCalendar}
      firstDayOfWeek="sat"
      {...(parsedValue !== undefined ? { value: parsedValue } : {})}
      {...(parsedDefault !== undefined ? { defaultValue: parsedDefault } : {})}
      {...(parsedMin !== undefined ? { minValue: parsedMin } : {})}
      {...(parsedMax !== undefined ? { maxValue: parsedMax } : {})}
      {...(parsedFocused !== undefined ? { focusedValue: parsedFocused } : {})}
      {...(parsedDefaultFocused !== undefined
        ? { defaultFocusedValue: parsedDefaultFocused }
        : {})}
      {...(onChange !== undefined
        ? { onChange: (next) => onChange(toIsoDate(next)) }
        : {})}
      {...(onFocusChange !== undefined
        ? { onFocusChange: (next) => onFocusChange(toIsoDate(next)) }
        : {})}
      {...(isDateUnavailable !== undefined
        ? { isDateUnavailable: (date) => isDateUnavailable(toIsoDate(date as CalendarDate)) }
        : {})}
      data-nds="Calendar"
      className={cx(styles.root, className)}
    >
      <CalendarChrome errorMessage={errorMessage} />
    </RacCalendar>
  );
}

function parseRange(range: DateRangeValue | null | undefined) {
  if (range == null) return undefined;
  const start = parseIsoDate(range.start);
  const end = parseIsoDate(range.end);
  if (!start || !end) return undefined;
  return { start, end };
}

/**
 * Jalali (Solar Hijri) date-range calendar built on React Aria RangeCalendar.
 * Uses logical start/end range caps for RTL, Saturday-first weeks, Friday weekends,
 * and canonical Gregorian ISO-8601 (`{ start, end }`) values at the API edge.
 */
export function RangeCalendar({
  value,
  defaultValue,
  onChange,
  minValue,
  maxValue,
  focusedValue,
  defaultFocusedValue,
  onFocusChange,
  isDateUnavailable,
  errorMessage,
  className,
  ref,
  ...rest
}: RangeCalendarProps) {
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
  const parsedFocused = useMemo(
    () => (focusedValue === undefined ? undefined : (parseIsoDate(focusedValue) ?? undefined)),
    [focusedValue],
  );
  const parsedDefaultFocused = useMemo(() => {
    if (defaultFocusedValue !== undefined) return parseIsoDate(defaultFocusedValue) ?? undefined;
    if (focusedValue === undefined && value == null && defaultValue == null) {
      return parseIsoDate(getTodayIsoDate()) ?? undefined;
    }
    return undefined;
  }, [defaultFocusedValue, focusedValue, value, defaultValue]);

  return (
    <RacRangeCalendar<CalendarDate>
      {...rest}
      ref={ref}
      createCalendar={createPersianCalendar}
      firstDayOfWeek="sat"
      {...(parsedValue !== undefined ? { value: parsedValue } : {})}
      {...(parsedDefault !== undefined ? { defaultValue: parsedDefault } : {})}
      {...(parsedMin !== undefined ? { minValue: parsedMin } : {})}
      {...(parsedMax !== undefined ? { maxValue: parsedMax } : {})}
      {...(parsedFocused !== undefined ? { focusedValue: parsedFocused } : {})}
      {...(parsedDefaultFocused !== undefined
        ? { defaultFocusedValue: parsedDefaultFocused }
        : {})}
      {...(onChange !== undefined
        ? {
            onChange: (next) =>
              onChange({ start: toIsoDate(next.start), end: toIsoDate(next.end) }),
          }
        : {})}
      {...(onFocusChange !== undefined
        ? { onFocusChange: (next) => onFocusChange(toIsoDate(next)) }
        : {})}
      {...(isDateUnavailable !== undefined
        ? { isDateUnavailable: (date) => isDateUnavailable(toIsoDate(date as CalendarDate)) }
        : {})}
      data-nds="RangeCalendar"
      data-range="true"
      className={cx(styles.root, className)}
    >
      <CalendarChrome errorMessage={errorMessage} />
    </RacRangeCalendar>
  );
}
