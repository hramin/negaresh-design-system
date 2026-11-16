import type { Ref } from 'react';
import {
  Input,
  TextField as RacTextField,
  type TextFieldProps as RacTextFieldProps,
} from 'react-aria-components';
import { cx } from '../internal/cx.ts';
import {
  FieldParts,
  type FieldPresentationProps,
  fieldStyles,
  useFieldValue,
} from '../internal/field.tsx';

export interface TextFieldProps
  extends FieldPresentationProps,
    Pick<
      RacTextFieldProps,
      | 'id'
      | 'name'
      | 'value'
      | 'defaultValue'
      | 'onChange'
      | 'onBlur'
      | 'onFocus'
      | 'isDisabled'
      | 'isReadOnly'
      | 'isRequired'
      | 'isInvalid'
      | 'validate'
      | 'validationBehavior'
      | 'type'
      | 'inputMode'
      | 'autoComplete'
      | 'autoFocus'
      | 'minLength'
      | 'maxLength'
      | 'pattern'
      | 'spellCheck'
      | 'form'
      | 'aria-describedby'
      | 'aria-label'
    > {
  /** Input hint; does not replace the visible label. */
  placeholder?: string | undefined;
  /** Direction of the input itself. Code and phone fields use `ltr`. */
  dir?: 'ltr' | 'rtl' | 'auto' | undefined;
  /** Ref to the actual input, for focus and selection. */
  ref?: Ref<HTMLInputElement> | undefined;
  /** Internal composition marker for specialized NDS fields. */
  'data-nds'?: string | undefined;
  /** Canonical form value for formatted specialized fields; preserves RAC's named validation. */
  submissionValue?: string | undefined;
}

/** Labelled text input on RAC, with descriptions, validation and an optional character count. */
export function TextField({
  label,
  description,
  errorMessage,
  prefix,
  suffix,
  showCharacterCount,
  isPending,
  size = 'md',
  className,
  ref,
  placeholder,
  dir,
  value,
  defaultValue,
  onChange,
  submissionValue,
  'data-nds': marker = 'TextField',
  ...rest
}: TextFieldProps) {
  const field = useFieldValue({ value, defaultValue, onChange });
  return (
    <RacTextField
      {...rest}
      value={field.value}
      {...(defaultValue !== undefined ? { defaultValue } : {})}
      onChange={field.onChange}
      isReadOnly={!!(isPending || rest.isReadOnly)}
      data-nds={marker}
      data-size={size}
      data-pending={isPending || undefined}
      aria-busy={isPending || undefined}
      className={cx(fieldStyles.root, className)}
    >
      <FieldParts
        label={label}
        description={description}
        errorMessage={errorMessage}
        prefix={prefix}
        suffix={suffix}
        showCharacterCount={showCharacterCount}
        count={field.value.length}
        maxLength={rest.maxLength}
        isPending={isPending}
      >
        <Input
          ref={ref}
          {...(placeholder !== undefined ? { placeholder } : {})}
          {...(dir !== undefined ? { dir } : {})}
          className={cx(fieldStyles.input)}
          {...(submissionValue !== undefined ? { name: '' } : {})}
        />
        {submissionValue !== undefined && rest.name && (
          <input
            type="hidden"
            name={rest.name}
            value={submissionValue}
            disabled={rest.isDisabled}
            form={rest.form}
          />
        )}
      </FieldParts>
    </RacTextField>
  );
}
