import { type ReactNode, type Ref, useCallback, useEffect, useReducer, useRef } from 'react';
import { Form as RacForm, type FormProps as RacFormProps } from 'react-aria-components';
import { cx } from '../internal/cx.ts';
import styles from './Form.module.css';

export interface FormProps
  extends Pick<
    RacFormProps,
    | 'id'
    | 'aria-label'
    | 'aria-labelledby'
    | 'aria-describedby'
    | 'action'
    | 'method'
    | 'encType'
    | 'target'
    | 'validationBehavior'
    | 'validationErrors'
    | 'onSubmit'
    | 'onReset'
    | 'onInvalid'
  > {
  children: ReactNode;
  /** Additional class on the form root. */
  className?: string | undefined;
  /** The native form element, for reset or programmatic submission. */
  ref?: Ref<HTMLFormElement> | undefined;
}

/**
 * Accessible form with React Aria's named validation errors. Native constraint
 * validation is the default. In `aria` mode the application owns submission and
 * validation; errors rendered after a submission focus the first invalid input.
 */
export function Form({
  children,
  className,
  ref,
  onSubmit,
  onReset,
  validationErrors,
  ...rest
}: FormProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const focusAfterSubmit = useRef(false);
  const [submission, recordSubmission] = useReducer((count: number) => count + 1, 0);
  const setRef = useCallback(
    (element: HTMLFormElement | null) => {
      formRef.current = element;
      if (typeof ref === 'function') return ref(element);
      if (ref) ref.current = element;
    },
    [ref],
  );

  useEffect(() => {
    if (!submission || !focusAfterSubmit.current) return;
    // Native invalid submissions are handled by the browser before onSubmit.
    // This covers app/server errors added in response to a submitted form.
    const controls = formRef.current?.querySelectorAll<HTMLElement>(
      'input:not([type="hidden"]):not(:disabled), textarea:not(:disabled), select:not(:disabled), [role="combobox"]:not([aria-disabled="true"]), [role="spinbutton"]:not([aria-disabled="true"])',
    );
    const invalid = Array.from(controls ?? []).find(
      (control) =>
        control.getAttribute('aria-invalid') === 'true' ||
        ('name' in control &&
          typeof control.name === 'string' &&
          !!validationErrors?.[control.name]?.length),
    );
    if (invalid) {
      focusAfterSubmit.current = false;
      invalid.focus();
    }
  }, [submission, validationErrors]);

  return (
    <RacForm
      {...rest}
      ref={setRef}
      data-nds="Form"
      className={cx(styles.form, className)}
      {...(validationErrors !== undefined ? { validationErrors } : {})}
      onSubmit={(event) => {
        focusAfterSubmit.current = true;
        recordSubmission();
        onSubmit?.(event);
      }}
      onReset={(event) => {
        focusAfterSubmit.current = false;
        onReset?.(event);
      }}
    >
      {children}
    </RacForm>
  );
}
