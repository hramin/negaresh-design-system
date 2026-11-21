import { useCallback, useEffect, useImperativeHandle, useRef, type Ref } from 'react';
import { TextArea as RacTextArea, TextField as RacTextField } from 'react-aria-components';
import { cx } from '../internal/cx.ts';
import { FieldParts, fieldStyles, useFieldValue } from '../internal/field.tsx';
import type { TextFieldProps } from '../TextField/TextField.tsx';

export interface TextAreaProps
  extends Omit<TextFieldProps, 'type' | 'pattern' | 'ref' | 'submissionValue'> {
  /** Minimum visible lines, including when the value is empty. Default `3`. */
  rows?: number | undefined;
  /** Grow and shrink with content and available width. Default `true`. */
  autoGrow?: boolean | undefined;
  /** Ref to the actual textarea. */
  ref?: Ref<HTMLTextAreaElement> | undefined;
}

/** Multi-line RAC text field with token-based typography and content-driven row sizing. */
export function TextArea({
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
  rows = 3,
  autoGrow = true,
  'data-nds': marker = 'TextArea',
  ...rest
}: TextAreaProps) {
  const field = useFieldValue({ value, defaultValue, onChange });
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLTextAreaElement);
  const resize = useCallback(() => {
    const input = inputRef.current;
    if (!input || !autoGrow) return;
    input.rows = Math.max(1, rows);
    const computed = getComputedStyle(input);
    const lineHeight = Number.parseFloat(computed.lineHeight);
    if (!(lineHeight > 0)) return;
    const padding =
      (Number.parseFloat(computed.paddingBlockStart) || 0) +
      (Number.parseFloat(computed.paddingBlockEnd) || 0);
    input.rows = Math.max(1, rows, Math.ceil((input.scrollHeight - padding) / lineHeight));
  }, [rows, autoGrow]);
  useEffect(() => {
    // Re-measure only after the latest controlled value has reached the DOM.
    if (inputRef.current?.value === field.value) resize();
  }, [resize, field.value]);
  useEffect(() => {
    if (!autoGrow || typeof ResizeObserver === 'undefined' || !inputRef.current) return;
    const observer = new ResizeObserver(resize);
    observer.observe(inputRef.current);
    return () => observer.disconnect();
  }, [autoGrow, resize]);
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
        <RacTextArea
          ref={inputRef}
          rows={Math.max(1, rows)}
          placeholder={placeholder}
          dir={dir}
          className={cx(fieldStyles.input, fieldStyles.textarea)}
        />
      </FieldParts>
    </RacTextField>
  );
}
