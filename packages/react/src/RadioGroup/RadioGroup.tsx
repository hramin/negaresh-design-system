import type { ReactNode, Ref } from 'react';
import {
  FieldError,
  Label,
  RadioButton as RacRadioButton,
  RadioField as RacRadioField,
  type RadioFieldProps as RacRadioFieldProps,
  RadioGroup as RacRadioGroup,
  type RadioGroupProps as RacRadioGroupProps,
  Text,
} from 'react-aria-components';
import { cx } from '../internal/cx.ts';
import { fieldStyles, fieldValidationMessage } from '../internal/field.tsx';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './RadioGroup.module.css';

export interface RadioGroupProps
  extends Pick<
    RacRadioGroupProps,
    | 'id'
    | 'name'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'orientation'
    | 'isDisabled'
    | 'isReadOnly'
    | 'isRequired'
    | 'isInvalid'
    | 'validationBehavior'
    | 'validate'
    | 'aria-label'
    | 'aria-labelledby'
    | 'aria-describedby'
  > {
  /** Visible group label. */
  label: ReactNode;
  /** Help text associated with the group. */
  description?: ReactNode;
  /** Validation error displayed when the group is invalid. */
  errorMessage?: ReactNode;
  children: ReactNode;
  /** Class applied only to the group root. */
  className?: string | undefined;
  /** Ref forwarded to the group container. */
  ref?: Ref<HTMLDivElement> | undefined;
}

/** Accessible radio group with vertical or horizontal layout and RTL arrow-key navigation. */
export function RadioGroup({
  label,
  description,
  errorMessage,
  orientation = 'vertical',
  children,
  className,
  ref,
  ...rest
}: RadioGroupProps) {
  const messages = useNdsMessages();
  return (
    <RacRadioGroup
      {...rest}
      ref={ref}
      orientation={orientation}
      data-nds="RadioGroup"
      className={cx(styles.group, className)}
    >
      <Label className={cx(fieldStyles.label)}>{label}</Label>
      <div className={styles.items}>{children}</div>
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
    </RacRadioGroup>
  );
}

export interface RadioProps
  extends Pick<
    RacRadioFieldProps,
    'id' | 'value' | 'isDisabled' | 'aria-label' | 'aria-labelledby' | 'aria-describedby'
  > {
  /** Visible option label. */
  children: ReactNode;
  /** Optional helper text for this option. */
  description?: ReactNode;
  /** Class applied only to the radio root. */
  className?: string | undefined;
  /** Ref forwarded to the underlying native radio input. */
  ref?: Ref<HTMLInputElement> | undefined;
}

/** Individual radio option inside a RadioGroup. */
export function Radio({ children, description, className, ref, ...rest }: RadioProps) {
  return (
    <RacRadioField
      {...rest}
      inputRef={ref ?? null}
      data-nds="Radio"
      className={cx(styles.field, className)}
    >
      <RacRadioButton className={cx(styles.control)}>
        <span className={styles.circle} aria-hidden="true">
          <span className={styles.dot} />
        </span>
        <span className={styles.labelText}>{children}</span>
      </RacRadioButton>
      {description != null && (
        <Text slot="description" className={cx(styles.itemDescription)}>
          {description}
        </Text>
      )}
    </RacRadioField>
  );
}
