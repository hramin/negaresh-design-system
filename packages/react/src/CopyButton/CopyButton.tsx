import { iconCheck, iconCopy } from '@negaresh/icons';
import { type ReactNode, type Ref, useEffect, useState } from 'react';
import { Button, type ButtonSize, type ButtonVariant } from '../Button/Button.tsx';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import { cx } from '../internal/cx.ts';
import styles from './CopyButton.module.css';

export interface CopyButtonProps {
  /** Text to copy: the normalised value, without spaces (localization.md). */
  value: string;
  /** Visible label. Default: the catalogue's «کپی». */
  children?: ReactNode | undefined;
  /** Accessible name when the label alone is ambiguous, e.g. «کپی کد فعال‌سازی». */
  'aria-label'?: string;
  variant?: ButtonVariant | undefined;
  size?: ButtonSize | undefined;
  fullWidth?: boolean | undefined;
  /** Called after a successful copy. */
  onCopy?: (value: string) => void;
  /** How long the success state stays, in ms. Default 1800. */
  feedbackDuration?: number;
  className?: string | undefined;
  ref?: Ref<HTMLButtonElement> | undefined;
}

type CopyState = 'idle' | 'copied' | 'failed';

/** Copies a value and announces the result in a polite live region. */
export function CopyButton({
  value,
  children,
  variant = 'secondary',
  size,
  fullWidth,
  onCopy,
  feedbackDuration = 1800,
  className,
  ref,
  ...aria
}: CopyButtonProps) {
  const m = useNdsMessages();
  const [state, setState] = useState<CopyState>('idle');

  useEffect(() => {
    if (state === 'idle') return;
    const id = setTimeout(() => setState('idle'), feedbackDuration);
    return () => clearTimeout(id);
  }, [state, feedbackDuration]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState('copied');
      onCopy?.(value);
    } catch {
      setState('failed');
    }
  };

  return (
    <>
      <Button
        {...aria}
        ref={ref}
        variant={variant}
        {...(size ? { size } : {})}
        {...(fullWidth ? { fullWidth } : {})}
        {...(className ? { className } : {})}
        iconStart={state === 'copied' ? iconCheck : iconCopy}
        onPress={() => void copy()}
      >
        <span data-nds="CopyButton" data-state={state}>
          {state === 'copied' ? m.copied : (children ?? m.copy)}
        </span>
      </Button>
      <span role="status" className={cx(styles.status)}>
        {state === 'copied' ? m.copied : state === 'failed' ? m.copyFailed : ''}
      </span>
    </>
  );
}
