import { iconEye, iconEyeOff } from '@negaresh/icons';
import { type ReactNode, type Ref, useCallback, useEffect, useRef, useState } from 'react';
import { IconButton } from '../Button/Button.tsx';
import { TextField, type TextFieldProps } from '../TextField/TextField.tsx';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';

export interface PasswordFieldProps extends Omit<TextFieldProps, 'type' | 'suffix' | 'data-nds'> {
  /** A caller-provided strength hint; NDS does not estimate or transmit passwords. */
  strengthHint?: ReactNode;
}

function assignRef(ref: Ref<HTMLInputElement> | undefined, element: HTMLInputElement | null) {
  if (typeof ref === 'function') ref(element);
  else if (ref) ref.current = element;
}

/** Password input with a labelled reveal action, preserved selection and unrestricted paste. */
export function PasswordField({
  strengthHint,
  description,
  isDisabled,
  autoComplete = 'current-password',
  ref,
  ...props
}: PasswordFieldProps) {
  const messages = useNdsMessages();
  const [revealed, setRevealed] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const selection = useRef<[number | null, number | null] | null>(null);
  const inputRef = useCallback(
    (element: HTMLInputElement | null) => {
      input.current = element;
      assignRef(ref, element);
    },
    [ref],
  );
  useEffect(() => {
    if (
      !selection.current ||
      !input.current ||
      input.current.type !== (revealed ? 'text' : 'password')
    )
      return;
    input.current.focus();
    const [start, end] = selection.current;
    input.current.setSelectionRange(start, end);
    selection.current = null;
  }, [revealed]);

  return (
    <TextField
      {...props}
      data-nds="PasswordField"
      ref={inputRef}
      type={revealed ? 'text' : 'password'}
      autoComplete={autoComplete}
      isDisabled={!!isDisabled}
      description={
        strengthHint ? (
          <>
            {description}
            {description && ' '}
            {strengthHint}
          </>
        ) : (
          description
        )
      }
      suffix={
        <IconButton
          icon={revealed ? iconEyeOff : iconEye}
          aria-label={revealed ? messages.hidePassword : messages.showPassword}
          isDisabled={!!isDisabled}
          onPress={() => {
            selection.current = [
              input.current?.selectionStart ?? null,
              input.current?.selectionEnd ?? null,
            ];
            setRevealed((current) => !current);
          }}
        />
      }
    />
  );
}
