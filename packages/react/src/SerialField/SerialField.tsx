import {
  formatSerial,
  isValidSerial,
  normalizeSerial,
  SERIAL_GROUPS,
  serialPattern,
} from '@negaresh/utils';
import { type Ref, useCallback, useEffect, useRef, useState } from 'react';
import { cx } from '../internal/cx.ts';
import { TextField, type TextFieldProps } from '../TextField/TextField.tsx';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './SerialField.module.css';

export interface CodeFieldProps
  extends Omit<TextFieldProps, 'type' | 'dir' | 'submissionValue' | 'data-nds' | 'onChange'> {
  /** Receives uppercase Latin digits/letters with spaces and dashes removed. */
  onChange?: TextFieldProps['onChange'];
}

export interface SerialFieldProps extends CodeFieldProps {
  /** Serial group sizes. Default `[5, 5]`; generic CodeField imposes no serial length. */
  groups?: readonly number[];
  /** Include the serial pattern hint in the description. Default true. */
  showPatternHint?: boolean;
}

function assignRef(ref: Ref<HTMLInputElement> | undefined, element: HTMLInputElement | null) {
  if (typeof ref === 'function') ref(element);
  else if (ref) ref.current = element;
}

function CodeInput({
  groups,
  showPatternHint = false,
  value,
  defaultValue = '',
  onChange,
  validate,
  description,
  autoComplete = 'off',
  spellCheck = 'false',
  className,
  ref,
  ...props
}: SerialFieldProps) {
  const messages = useNdsMessages();
  const [localValue, setLocalValue] = useState(() => normalizeSerial(defaultValue));
  const canonical = normalizeSerial(value ?? localValue);
  const display = groups ? formatSerial(canonical, groups) : canonical;
  const input = useRef<HTMLInputElement>(null);
  const caret = useRef<number | null>(null);
  const inputRef = useCallback(
    (element: HTMLInputElement | null) => {
      input.current = element;
      assignRef(ref, element);
    },
    [ref],
  );
  useEffect(() => {
    if (caret.current === null || !input.current) return;
    if (input.current.ownerDocument.activeElement === input.current) {
      const prefix = canonical.slice(0, caret.current);
      const position = groups ? formatSerial(prefix, groups).length : prefix.length;
      input.current.setSelectionRange(position, position);
    }
    caret.current = null;
  }, [canonical, groups]);

  const hint = showPatternHint && groups ? messages.serialHint(serialPattern(groups)) : null;
  return (
    <TextField
      {...props}
      data-nds={groups ? 'SerialField' : 'CodeField'}
      className={cx(styles.code, className)}
      type="text"
      dir="ltr"
      autoComplete={autoComplete}
      spellCheck={spellCheck}
      ref={inputRef}
      value={display}
      defaultValue={groups ? formatSerial(defaultValue, groups) : normalizeSerial(defaultValue)}
      submissionValue={canonical}
      description={
        hint ? (
          <>
            {description}
            {description && ' '}
            {hint}
          </>
        ) : (
          description
        )
      }
      onChange={(text) => {
        const position = input.current?.selectionStart ?? text.length;
        caret.current = normalizeSerial(text.slice(0, position)).length;
        const next = normalizeSerial(text);
        setLocalValue(next);
        onChange?.(next);
      }}
      validate={(text) => {
        const next = normalizeSerial(text);
        if (next && groups && !isValidSerial(next, groups)) return messages.serialInvalid;
        return validate?.(next);
      }}
    />
  );
}

/** Generic normalized code field; no serial-specific length or grouping restriction. */
export function CodeField(props: CodeFieldProps) {
  return <CodeInput {...props} />;
}

/** Serial field with a documented pattern, canonical submitted value and editable grouping. */
export function SerialField({
  groups = SERIAL_GROUPS,
  showPatternHint = true,
  ...props
}: SerialFieldProps) {
  return <CodeInput {...props} groups={groups} showPatternHint={showPatternHint} />;
}
