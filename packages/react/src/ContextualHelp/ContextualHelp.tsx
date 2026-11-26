import { iconHelp, iconInfo } from '@negaresh/icons';
import type { ReactNode, Ref } from 'react';
import { Button as RacButton } from 'react-aria-components';
import { DialogTrigger } from '../Dialog/Dialog.tsx';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { Popover, type PopoverPlacement } from '../Popover/Popover.tsx';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './ContextualHelp.module.css';

export type ContextualHelpVariant = 'info' | 'help';

export interface ContextualHelpProps {
  /** Icon variant: `'info'` (`(i)`, default) or `'help'` (`(?)`). */
  variant?: ContextualHelpVariant | undefined;
  /** Optional heading inside the help popover. */
  title?: ReactNode | undefined;
  /** Helpful explanation; may contain structured text or inline links. */
  children: ReactNode;
  /** Optional footer link (e.g. «راهنمای بیشتر»). */
  footer?: ReactNode | undefined;
  /** Logical placement relative to the trigger. Default `'bottom start'`. */
  placement?: PopoverPlacement | undefined;
  /** Accessible name for the trigger button. Defaults to `messages.contextualHelpLabel` («راهنما»). */
  'aria-label'?: string | undefined;
  /** Controlled open state. */
  isOpen?: boolean | undefined;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean | undefined;
  /** Called when open state changes. */
  onOpenChange?: ((isOpen: boolean) => void) | undefined;
  /** Disable opening the help popover. */
  isDisabled?: boolean | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLButtonElement> | undefined;
}

/**
 * Compact `(i)` / `(?)` help trigger beside field labels and section titles.
 * Composes `DialogTrigger` + `Popover` with a guaranteed ≥ 44 × 44 px hit target (WCAG 2.2 AA).
 */
export function ContextualHelp({
  variant = 'info',
  title,
  children,
  footer,
  placement = 'bottom start',
  'aria-label': ariaLabel,
  isOpen,
  defaultOpen,
  onOpenChange,
  isDisabled = false,
  className,
  ref,
}: ContextualHelpProps) {
  const m = useNdsMessages();
  const label = ariaLabel ?? m.contextualHelpLabel;

  return (
    <DialogTrigger
      {...(isOpen !== undefined ? { isOpen } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange !== undefined ? { onOpenChange } : {})}
    >
      <RacButton
        ref={ref}
        isDisabled={isDisabled}
        aria-label={label}
        data-nds="ContextualHelp"
        data-variant={variant}
        className={cx(styles.trigger, className)}
      >
        <Icon icon={variant === 'help' ? iconHelp : iconInfo} size="md" />
      </RacButton>
      <Popover
        placement={placement}
        showArrow
        title={title}
        {...(title === undefined ? { 'aria-label': label } : {})}
      >
        <div className={cx(styles.body)}>{children}</div>
        {footer !== undefined && <div className={cx(styles.footer)}>{footer}</div>}
      </Popover>
    </DialogTrigger>
  );
}
