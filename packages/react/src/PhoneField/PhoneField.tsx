import { formatPhoneInput, normalizePhone, toLatinDigits } from '@negaresh/utils';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { TextField, type TextFieldProps } from '../TextField/TextField.tsx';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';

export interface PhoneFieldProps
  extends Omit<
    TextFieldProps,
    'type' | 'inputMode' | 'dir' | 'submissionValue' | 'data-nds' | 'onChange'
  > {
  /**
   * Complete valid input emits `+989xxxxxxxxx`; incomplete input emits the editable
   * Latin text. Keep incomplete values while editing and validate before storing.
   */
  onChange?: TextFieldProps['onChange'];
}

/** Iranian mobile input: editable partial text, canonical submission and LTR Latin digits. */
export function PhoneField({
  value,
  defaultValue = '',
  onChange,
  onBlur,
  validate,
  autoComplete = 'tel',
  ref,
  ...props
}: PhoneFieldProps) {
  const messages = useNdsMessages();
  const [editing, setEditing] = useState(() => formatPhoneInput(value ?? defaultValue));
  const emitted = useRef<string | undefined>(undefined);
  const input = useRef<HTMLInputElement>(null);
  const [selection, setSelection] = useState<[number, number] | null>(null);
  useImperativeHandle(ref, () => input.current as HTMLInputElement);
  useEffect(() => {
    if (value !== undefined && value !== emitted.current) {
      const accepted = formatPhoneInput(value);
      emitted.current = undefined;
      if (editing !== accepted) setEditing(accepted);
    }
  }, [value, editing]);
  useEffect(() => {
    if (selection && input.current?.ownerDocument.activeElement === input.current) {
      input.current?.setSelectionRange(...selection);
    }
  }, [selection]);

  return (
    <TextField
      {...props}
      data-nds="PhoneField"
      ref={input}
      type="tel"
      inputMode="tel"
      dir="ltr"
      autoComplete={autoComplete}
      value={editing}
      defaultValue={formatPhoneInput(defaultValue)}
      submissionValue={normalizePhone(editing) ?? toLatinDigits(editing)}
      onChange={(text) => {
        // Digit normalization preserves length; keep the browser's edit position.
        setSelection([
          input.current?.selectionStart ?? text.length,
          input.current?.selectionEnd ?? text.length,
        ]);
        const next = toLatinDigits(text);
        setEditing(next);
        emitted.current = normalizePhone(next) ?? next;
        onChange?.(emitted.current);
      }}
      onBlur={(event) => {
        setEditing((text) => formatPhoneInput(text));
        onBlur?.(event);
      }}
      validate={(text) => {
        const canonical = normalizePhone(text);
        if (text && !canonical) return messages.phoneInvalid;
        return validate?.(canonical ?? text);
      }}
    />
  );
}
