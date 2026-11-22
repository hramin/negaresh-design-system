import { iconMinus, iconPlus } from '@negaresh/icons';
import { type ReactNode, type Ref, useContext, useEffect, useRef, useState } from 'react';
import {
  Button,
  FieldError,
  Group,
  Input,
  Label,
  NumberFieldStateContext,
  NumberField as RacNumberField,
  type NumberFieldProps as RacNumberFieldProps,
  ProgressBar,
  Text,
  useLocale,
} from 'react-aria-components';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { type FieldSize, fieldStyles, fieldValidationMessage } from '../internal/field.tsx';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './NumberField.module.css';

const NON_PERSIAN_DIGIT = /[0-9\u0660-\u0669]/;
const COMMIT_KEYS = new Set([
  'Enter',
  'ArrowUp',
  'ArrowDown',
  'PageUp',
  'PageDown',
  'Home',
  'End',
]);

function PersianNumberInput({
  placeholder,
  formatOptions,
  inputRef,
}: {
  placeholder?: string | undefined;
  formatOptions?: Intl.NumberFormatOptions | undefined;
  inputRef?: Ref<HTMLInputElement> | undefined;
}) {
  const state = useContext(NumberFieldStateContext);
  const { locale } = useLocale();
  const shouldNormalize = useRef(false);
  const [normalizeTick, setNormalizeTick] = useState(0);

  const scheduleNormalize = () => {
    if (locale.startsWith('fa') && state && NON_PERSIAN_DIGIT.test(state.inputValue)) {
      shouldNormalize.current = true;
      setNormalizeTick((n) => n + 1);
    }
  };

  useEffect(() => {
    if (normalizeTick === 0 || !shouldNormalize.current || !state || !locale.startsWith('fa')) {
      return;
    }
    shouldNormalize.current = false;
    if (state.inputValue === '' || Number.isNaN(state.numberValue)) return;
    const expected = new Intl.NumberFormat(locale, formatOptions).format(state.numberValue);
    if (state.inputValue !== expected) {
      state.setInputValue(expected);
    }
  }, [normalizeTick, state, locale, formatOptions]);

  return (
    <Input
      ref={inputRef}
      {...(placeholder !== undefined ? { placeholder } : {})}
      className={cx(styles.input)}
      onBlur={scheduleNormalize}
      onKeyDown={(e) => {
        if (COMMIT_KEYS.has(e.key)) scheduleNormalize();
      }}
    />
  );
}

export interface NumberFieldProps
  extends Pick<
    RacNumberFieldProps,
    | 'id'
    | 'name'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'minValue'
    | 'maxValue'
    | 'step'
    | 'formatOptions'
    | 'isWheelDisabled'
    | 'isRequired'
    | 'isDisabled'
    | 'isReadOnly'
    | 'isInvalid'
    | 'validationBehavior'
    | 'validate'
    | 'aria-label'
    | 'aria-labelledby'
    | 'aria-describedby'
  > {
  /** Visible field label. */
  label: ReactNode;
  /** Help text announced with the input. */
  description?: ReactNode;
  /** Validation error message displayed when invalid. */
  errorMessage?: ReactNode;
  /** Optional prefix placed before the numeric input. */
  prefix?: ReactNode;
  /** Optional suffix placed after the numeric input (e.g. «تومان» or «نفر»). */
  suffix?: ReactNode;
  /** Placeholder text when empty. */
  placeholder?: string | undefined;
  /** Hide increment/decrement stepper buttons. Default `false`. */
  hideStepper?: boolean | undefined;
  /** Read-only while pending; retains current value for form submission. */
  isPending?: boolean | undefined;
  /** Control height. Default `md`; small retains a 44 px target. */
  size?: FieldSize | undefined;
  /** Class applied only to the field root. */
  className?: string | undefined;
  /** Ref forwarded to the underlying numeric input. */
  ref?: Ref<HTMLInputElement> | undefined;
}

/**
 * Accessible numeric input built on React Aria NumberField.
 * Displays Persian digits in `fa-IR` locale with tabular numerals while accepting
 * Persian, Arabic-Indic, and Latin digits as well as keyboard/button stepping.
 */
export function NumberField({
  label,
  description,
  errorMessage,
  prefix,
  suffix,
  placeholder,
  hideStepper = false,
  isPending,
  size = 'md',
  className,
  ref,
  isReadOnly,
  formatOptions,
  ...rest
}: NumberFieldProps) {
  const messages = useNdsMessages();
  return (
    <RacNumberField
      {...rest}
      {...(formatOptions !== undefined ? { formatOptions } : {})}
      isReadOnly={Boolean(isReadOnly || isPending)}
      data-nds="NumberField"
      data-size={size}
      data-pending={isPending ? 'true' : undefined}
      className={cx(fieldStyles.root, styles.root, className)}
    >
      <Label className={cx(fieldStyles.label)}>{label}</Label>
      <Group
        className={cx(styles.control)}
        data-no-stepper={hideStepper ? 'true' : undefined}
      >
        {!hideStepper && (
          <Button slot="decrement" className={cx(styles.stepper)}>
            <Icon icon={iconMinus} size="sm" />
          </Button>
        )}
        {prefix != null && <span className={fieldStyles.affix}>{prefix}</span>}
        <PersianNumberInput
          inputRef={ref}
          placeholder={placeholder}
          formatOptions={formatOptions}
        />
        {suffix != null && <span className={fieldStyles.affix}>{suffix}</span>}
        {isPending && (
          <ProgressBar
            isIndeterminate
            aria-label={messages.pending}
            className={cx(fieldStyles.pending)}
          >
            <span aria-hidden="true" />
          </ProgressBar>
        )}
        {!hideStepper && (
          <Button slot="increment" className={cx(styles.stepper)}>
            <Icon icon={iconPlus} size="sm" />
          </Button>
        )}
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
    </RacNumberField>
  );
}
