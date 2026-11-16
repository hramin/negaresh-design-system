import { cx } from './cx.ts';
import { useState, type ReactNode } from 'react';
import {
  FieldError,
  type FieldErrorRenderProps,
  Label,
  ProgressBar,
  Text,
} from 'react-aria-components';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import type { NdsMessages } from '../messages/types.ts';
import styles from './field.module.css';

export const fieldStyles = styles;
export type FieldSize = 'sm' | 'md' | 'lg';

/** Shared presentation for NDS inputs; behavior remains with the RAC field. */
export interface FieldPresentationProps {
  /** Visible label associated with the input. */
  label: ReactNode;
  /** Help text announced when the input is focused. */
  description?: ReactNode;
  /** Error displayed when validation marks the field invalid. */
  errorMessage?: ReactNode;
  /** Content before and after the control, in logical order. */
  prefix?: ReactNode;
  suffix?: ReactNode;
  /** Display a Persian character count, optionally including the maximum. */
  showCharacterCount?: boolean | undefined;
  /** Read-only while pending; retain the current value in form submissions. */
  isPending?: boolean | undefined;
  /** Control height. Default `md`; small controls retain a 44 px target. */
  size?: FieldSize | undefined;
  /** Class applied only to the field root. */
  className?: string | undefined;
}

function validationMessage(result: FieldErrorRenderProps, messages: NdsMessages): ReactNode {
  const { validationDetails: details, validationErrors } = result;
  // Custom validators and server errors carry product-specific messages.
  if (details.customError && validationErrors.length) return validationErrors.join(' ');
  if (details.valueMissing) return messages.fieldRequired;
  if (details.typeMismatch) return messages.fieldTypeMismatch;
  if (details.tooShort) return messages.fieldTooShort;
  if (details.tooLong) return messages.fieldTooLong;
  if (details.patternMismatch) return messages.fieldPatternMismatch;
  return validationErrors.length ? validationErrors.join(' ') : messages.fieldInvalid;
}

export function FieldParts({
  label,
  description,
  errorMessage,
  prefix,
  suffix,
  showCharacterCount,
  isPending,
  count = 0,
  maxLength,
  children,
}: FieldPresentationProps & {
  count?: number | undefined;
  maxLength?: number | undefined;
  children: ReactNode;
}) {
  const messages = useNdsMessages();
  return (
    <>
      <Label className={cx(styles.label)}>{label}</Label>
      <div className={styles.control}>
        {prefix != null && <span className={styles.affix}>{prefix}</span>}
        {children}
        {suffix != null && <span className={styles.affix}>{suffix}</span>}
        {isPending && (
          <ProgressBar isIndeterminate aria-label={messages.pending} className={cx(styles.pending)}>
            <span aria-hidden="true" />
          </ProgressBar>
        )}
      </div>
      {(description != null || showCharacterCount) && (
        <Text slot="description" className={styles.description}>
          <span>{description}</span>
          {showCharacterCount && (
            <span className={styles.count}>{messages.characterCount(count, maxLength)}</span>
          )}
        </Text>
      )}
      <div className={styles.errorSlot} data-field-error-slot>
        <FieldError className={cx(styles.error)}>
          {(result) => (
            <span role="alert">{errorMessage ?? validationMessage(result, messages)}</span>
          )}
        </FieldError>
      </div>
    </>
  );
}

/** Tracks uncontrolled content for counters without changing the public string callback. */
export function useFieldValue({
  value,
  defaultValue,
  onChange,
}: {
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
}) {
  const [localValue, setLocalValue] = useState(defaultValue ?? '');
  return {
    value: value ?? localValue,
    onChange(next: string) {
      if (value === undefined) setLocalValue(next);
      onChange?.(next);
    },
  };
}
