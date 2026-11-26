import { iconClock } from '@negaresh/icons';
import { parseIsoTime, type Time, toIsoTime } from '@negaresh/utils';
import { type ReactNode, type Ref, useMemo } from 'react';
import {
  DateInput,
  DateSegment,
  FieldError,
  Label,
  ProgressBar,
  TimeField as RacTimeField,
  type TimeFieldProps as RacTimeFieldProps,
  Text,
} from 'react-aria-components';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { type FieldSize, fieldStyles, fieldValidationMessage } from '../internal/field.tsx';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './TimeField.module.css';

export interface TimeFieldProps
  extends Pick<
    RacTimeFieldProps<Time>,
    | 'id'
    | 'name'
    | 'granularity'
    | 'hourCycle'
    | 'isRequired'
    | 'isDisabled'
    | 'isReadOnly'
    | 'isInvalid'
    | 'validationBehavior'
    | 'aria-label'
    | 'aria-labelledby'
    | 'aria-describedby'
  > {
  /** Visible label associated with the time input. */
  label: ReactNode;
  /** Help text announced with the time field. */
  description?: ReactNode;
  /** Error displayed when validation marks the field invalid. */
  errorMessage?: ReactNode;
  /** Controlled 24-hour ISO time string (`HH:mm` or `HH:mm:ss`) or `null`. */
  value?: string | null | undefined;
  /** Initial uncontrolled 24-hour ISO time string (`HH:mm` or `HH:mm:ss`). */
  defaultValue?: string | null | undefined;
  /** Called with canonical 24-hour ISO time string (`HH:mm` or `HH:mm:ss`) or `null`. */
  onChange?: ((value: string | null) => void) | undefined;
  /** Minimum allowed 24-hour time (`HH:mm` or `HH:mm:ss`). */
  minValue?: string | undefined;
  /** Maximum allowed 24-hour time (`HH:mm` or `HH:mm:ss`). */
  maxValue?: string | undefined;
  /** Custom validator receiving canonical ISO time string (`HH:mm` / `HH:mm:ss`). */
  validate?: ((value: string | null) => string | string[] | true | null | undefined) | undefined;
  /** Read-only while pending; retains current value for form submission. */
  isPending?: boolean | undefined;
  /** Control height. Default `md`; small retains a 44 px target. */
  size?: FieldSize | undefined;
  /** Class applied only to the field root. */
  className?: string | undefined;
  /** Ref forwarded to the TimeField root container. */
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Accessible 24-hour time field built on React Aria TimeField.
 * Accepts and emits canonical 24-hour ISO time strings (`HH:mm` or `HH:mm:ss`),
 * rendering editable Persian-digit segments with tabular numerals.
 */
export function TimeField({
  label,
  description,
  errorMessage,
  value,
  defaultValue,
  onChange,
  minValue,
  maxValue,
  validate,
  granularity = 'minute',
  hourCycle = 24,
  isPending,
  isReadOnly,
  size = 'md',
  className,
  ref,
  ...rest
}: TimeFieldProps) {
  const messages = useNdsMessages();
  const includeSeconds = granularity === 'second';

  const parsedValue = useMemo(
    () => (value === undefined ? undefined : value === null ? null : parseIsoTime(value)),
    [value],
  );
  const parsedDefault = useMemo(
    () => (defaultValue == null ? undefined : (parseIsoTime(defaultValue) ?? undefined)),
    [defaultValue],
  );
  const parsedMin = useMemo(
    () => (minValue === undefined ? undefined : (parseIsoTime(minValue) ?? undefined)),
    [minValue],
  );
  const parsedMax = useMemo(
    () => (maxValue === undefined ? undefined : (parseIsoTime(maxValue) ?? undefined)),
    [maxValue],
  );

  return (
    <RacTimeField<Time>
      {...rest}
      ref={ref}
      hourCycle={hourCycle}
      granularity={granularity}
      isReadOnly={Boolean(isReadOnly || isPending)}
      {...(parsedValue !== undefined ? { value: parsedValue } : {})}
      {...(parsedDefault !== undefined ? { defaultValue: parsedDefault } : {})}
      {...(parsedMin !== undefined ? { minValue: parsedMin } : {})}
      {...(parsedMax !== undefined ? { maxValue: parsedMax } : {})}
      {...(onChange !== undefined
        ? {
            onChange: (next) => {
              onChange(next ? toIsoTime(next, includeSeconds) : null);
            },
          }
        : {})}
      {...(validate !== undefined
        ? {
            validate: (next) => validate(next ? toIsoTime(next, includeSeconds) : null),
          }
        : {})}
      data-nds="TimeField"
      data-size={size}
      data-pending={isPending ? 'true' : undefined}
      className={cx(fieldStyles.root, styles.root, className)}
    >
      <Label className={cx(fieldStyles.label)}>{label}</Label>
      <div className={styles.control}>
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
          <Icon icon={iconClock} size="sm" />
        </span>
      </div>
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
    </RacTimeField>
  );
}
