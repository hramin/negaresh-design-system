import { iconCheck, iconMinus } from '@negaresh/icons';
import type { ReactNode, Ref } from 'react';
import {
  CheckboxButton as RacCheckboxButton,
  CheckboxField as RacCheckboxField,
  type CheckboxFieldProps as RacCheckboxFieldProps,
  CheckboxGroup as RacCheckboxGroup,
  type CheckboxGroupProps as RacCheckboxGroupProps,
  FieldError,
  Label,
  Text,
} from 'react-aria-components';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { fieldStyles, fieldValidationMessage } from '../internal/field.tsx';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './Checkbox.module.css';

export interface CheckboxProps
  extends Pick<
    RacCheckboxFieldProps,
    | 'id'
    | 'name'
    | 'value'
    | 'isSelected'
    | 'defaultSelected'
    | 'onChange'
    | 'isIndeterminate'
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
  /** Visible checkbox label. */
  children?: ReactNode;
  /** Optional help text associated with the checkbox. */
  description?: ReactNode;
  /** Error displayed when standalone checkbox validation fails. */
  errorMessage?: ReactNode;
  /** Class applied only to the checkbox root. */
  className?: string | undefined;
  /** Ref forwarded to the underlying native checkbox input. */
  ref?: Ref<HTMLInputElement> | undefined;
}

/**
 * Accessible checkbox built on React Aria's CheckboxField + CheckboxButton.
 * Supports standalone selection, indeterminate state, and CheckboxGroup membership.
 */
export function Checkbox({
  children,
  description,
  errorMessage,
  className,
  ref,
  ...rest
}: CheckboxProps) {
  const messages = useNdsMessages();
  return (
    <RacCheckboxField
      {...rest}
      inputRef={ref ?? null}
      data-nds="Checkbox"
      className={cx(styles.field, className)}
    >
      <RacCheckboxButton className={cx(styles.control)}>
        {({ isSelected, isIndeterminate }) => (
          <>
            <span className={styles.box} aria-hidden="true">
              {isIndeterminate ? (
                <Icon icon={iconMinus} size="sm" />
              ) : isSelected ? (
                <Icon icon={iconCheck} size="sm" />
              ) : null}
            </span>
            {children != null && (
              <span className={styles.content}>
                <span className={styles.labelText}>{children}</span>
              </span>
            )}
          </>
        )}
      </RacCheckboxButton>
      {description != null && (
        <Text slot="description" className={cx(styles.itemDescription)}>
          {description}
        </Text>
      )}
      <FieldError className={cx(styles.standaloneError)}>
        {(result) => (
          <span role="alert">{errorMessage ?? fieldValidationMessage(result, messages)}</span>
        )}
      </FieldError>
    </RacCheckboxField>
  );
}

export interface CheckboxGroupProps
  extends Pick<
    RacCheckboxGroupProps,
    | 'id'
    | 'name'
    | 'value'
    | 'defaultValue'
    | 'onChange'
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
  /** Help text shared by all options in the group. */
  description?: ReactNode;
  /** Validation error associated with the group. */
  errorMessage?: ReactNode;
  /** Layout direction for the checkboxes. Default `vertical`. */
  orientation?: 'vertical' | 'horizontal' | undefined;
  children: ReactNode;
  /** Class applied only to the group root. */
  className?: string | undefined;
  /** Ref forwarded to the group container. */
  ref?: Ref<HTMLDivElement> | undefined;
}

/** Accessible group of related checkboxes with shared label, description, and validation. */
export function CheckboxGroup({
  label,
  description,
  errorMessage,
  orientation = 'vertical',
  children,
  className,
  ref,
  ...rest
}: CheckboxGroupProps) {
  const messages = useNdsMessages();
  return (
    <RacCheckboxGroup
      {...rest}
      ref={ref}
      data-nds="CheckboxGroup"
      className={cx(styles.group, className)}
    >
      <Label className={cx(fieldStyles.label)}>{label}</Label>
      <div className={styles.items} data-orientation={orientation}>
        {children}
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
    </RacCheckboxGroup>
  );
}
