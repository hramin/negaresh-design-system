import { type ReactNode, type Ref, useId } from 'react';
import { cx } from '../internal/cx.ts';
import styles from './FieldGroup.module.css';

export interface FieldGroupProps {
  /** Visible group name, rendered as a fieldset legend. */
  label: ReactNode;
  /** Instructions shared by the fields in this group. */
  description?: ReactNode;
  /** A specific error associated with the group. */
  errorMessage?: ReactNode;
  /** Defaults to true when an error message is supplied. */
  isInvalid?: boolean | undefined;
  /** Disables the group's native form controls. */
  isDisabled?: boolean | undefined;
  name?: string | undefined;
  id?: string | undefined;
  children: ReactNode;
  className?: string | undefined;
  ref?: Ref<HTMLFieldSetElement> | undefined;
}

/** A semantically labelled group; native fieldset disabling is preserved. */
export function FieldGroup({
  label,
  description,
  errorMessage,
  isInvalid,
  isDisabled,
  name,
  id,
  children,
  className,
  ref,
}: FieldGroupProps) {
  const generatedId = useId();
  const descriptionId = `${generatedId}-description`;
  const errorId = `${generatedId}-error`;
  const invalid = isInvalid ?? !!errorMessage;
  const describedBy =
    [description && descriptionId, invalid && errorMessage && errorId].filter(Boolean).join(' ') ||
    undefined;
  return (
    <fieldset
      ref={ref}
      id={id}
      name={name}
      disabled={isDisabled}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      data-nds="FieldGroup"
      data-invalid={invalid || undefined}
      className={cx(styles.group, className)}
    >
      <legend className={styles.legend}>{label}</legend>
      {description && (
        <p id={descriptionId} className={styles.description}>
          {description}
        </p>
      )}
      <div className={styles.fields}>{children}</div>
      {invalid && errorMessage && (
        <p id={errorId} role="alert" className={styles.error}>
          {errorMessage}
        </p>
      )}
    </fieldset>
  );
}
