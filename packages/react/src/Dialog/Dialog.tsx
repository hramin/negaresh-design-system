import { iconClose, iconDanger, iconWarning } from '@negaresh/icons';
import type { ReactElement, ReactNode, Ref } from 'react';
import {
  Dialog as RacDialog,
  DialogTrigger as RacDialogTrigger,
  type DialogTriggerProps as RacDialogTriggerProps,
  Heading as RacHeading,
  Modal as RacModal,
  ModalOverlay as RacModalOverlay,
} from 'react-aria-components';
import { Button, IconButton } from '../Button/Button.tsx';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './Dialog.module.css';

export type DialogSize = 'sm' | 'md' | 'lg';
export type AlertDialogTone = 'default' | 'danger';

export interface DialogTriggerProps
  extends Pick<RacDialogTriggerProps, 'isOpen' | 'defaultOpen' | 'onOpenChange'> {
  /** A trigger element (such as `Button`) followed by `Dialog`, `AlertDialog`, `Sheet`, or `Popover`. */
  children: [ReactElement, ReactElement];
}

/** Pairs a pressable trigger with a modal dialog, sheet, or popover and restores focus on close. */
export function DialogTrigger(props: DialogTriggerProps) {
  return <RacDialogTrigger {...props} />;
}

export interface DialogProps {
  /** Heading announced as the dialog's accessible name via `aria-labelledby`. */
  title?: ReactNode | undefined;
  /** Optional secondary description rendered directly beneath the title. */
  description?: ReactNode | undefined;
  /** Desktop max-inline-size: `sm` (400 px), `md` (560 px), `lg` (720 px). Default `'md'`. */
  size?: DialogSize | undefined;
  /** Optional footer slot (typically actions); rendered on a sunken surface with hairline. */
  footer?: ReactNode | ((close: () => void) => ReactNode) | undefined;
  /** Show the ≥ 44 × 44 px close button in the header. Default `true`. */
  showCloseButton?: boolean | undefined;
  /** Controlled open state (use when rendering without `DialogTrigger`). */
  isOpen?: boolean | undefined;
  /** Initial uncontrolled open state (use when rendering without `DialogTrigger`). */
  defaultOpen?: boolean | undefined;
  /** Called when the dialog opens or closes. */
  onOpenChange?: ((isOpen: boolean) => void) | undefined;
  /** Allow dismissing by clicking the backdrop outside the dialog. Default `true`. */
  isDismissable?: boolean | undefined;
  /** Prevent dismissing with the Escape key. Default `false`. */
  isKeyboardDismissDisabled?: boolean | undefined;
  /** ARIA role. Default `'dialog'`. Use `AlertDialog` for confirmation/destructive prompts. */
  role?: 'dialog' | 'alertdialog' | undefined;
  /** Accessible name when `title` is omitted. */
  'aria-label'?: string | undefined;
  /** Dialog body content or render function receiving `close()`. */
  children: ReactNode | ((close: () => void) => ReactNode);
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Modal dialog built on React Aria `ModalOverlay` + `Modal` + `Dialog`.
 * Traps focus, hides background content from assistive technology, restores focus on close,
 * and transforms into a bottom sheet below 900 px (D-90).
 */
export function Dialog({
  title,
  description,
  size = 'md',
  footer,
  showCloseButton = true,
  isOpen,
  defaultOpen,
  onOpenChange,
  isDismissable = true,
  isKeyboardDismissDisabled = false,
  role = 'dialog',
  'aria-label': ariaLabel,
  children,
  className,
  ref,
}: DialogProps) {
  const m = useNdsMessages();
  const hasHeader = title !== undefined || description !== undefined || showCloseButton;

  return (
    <RacModalOverlay
      {...(isOpen !== undefined ? { isOpen } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange !== undefined ? { onOpenChange } : {})}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      data-nds="DialogOverlay"
      className={cx(styles.overlay)}
    >
      <RacModal data-nds="DialogModal" data-size={size} className={cx(styles.modal, className)}>
        <span className={cx(styles.handle)} aria-hidden="true" />
        <RacDialog
          ref={ref}
          role={role}
          {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
          data-nds="Dialog"
          className={cx(styles.dialog)}
        >
          {({ close }) => (
            <>
              {hasHeader && (
                <div className={cx(styles.header)}>
                  <div className={cx(styles.headerText)}>
                    {title !== undefined && (
                      <RacHeading slot="title" level={2} className={cx(styles.title)}>
                        {title}
                      </RacHeading>
                    )}
                    {description !== undefined && (
                      <p className={cx(styles.description)}>{description}</p>
                    )}
                  </div>
                  {showCloseButton && (
                    <div className={cx(styles.closeWrap)}>
                      <IconButton
                        icon={iconClose}
                        variant="ghost"
                        size="md"
                        aria-label={m.closeDialog}
                        onPress={close}
                      />
                    </div>
                  )}
                </div>
              )}
              <div className={cx(styles.body)}>
                {typeof children === 'function' ? children(close) : children}
              </div>
              {footer !== undefined && (
                <div className={cx(styles.footer)}>
                  {typeof footer === 'function' ? footer(close) : footer}
                </div>
              )}
            </>
          )}
        </RacDialog>
      </RacModal>
    </RacModalOverlay>
  );
}

export interface AlertDialogProps {
  /** Clear question or decision heading announced via `aria-labelledby`. */
  title: ReactNode;
  /** Explanation of consequences before confirming. */
  children: ReactNode;
  /** `default` for standard confirmation, `danger` for irreversible/destructive actions. */
  tone?: AlertDialogTone | undefined;
  /** Primary confirm button label. Defaults to `messages.confirm` («تأیید»). */
  confirmLabel?: ReactNode | undefined;
  /** Secondary cancel button label. Defaults to `messages.cancel` («انصراف»). */
  cancelLabel?: ReactNode | undefined;
  /** Show pending spinner on confirm button while an async action runs. */
  isConfirmPending?: boolean | undefined;
  /** Disable the confirm button. */
  isConfirmDisabled?: boolean | undefined;
  /** Called when the user confirms; resolves before closing if a Promise is returned. */
  onConfirm?: (() => void | Promise<void>) | undefined;
  /** Called when the user cancels. */
  onCancel?: (() => void) | undefined;
  /** Controlled open state (use when rendering without `DialogTrigger`). */
  isOpen?: boolean | undefined;
  /** Initial uncontrolled open state. */
  defaultOpen?: boolean | undefined;
  /** Called when the dialog opens or closes. */
  onOpenChange?: ((isOpen: boolean) => void) | undefined;
  /** Prevent dismissing with Escape. Default `false`. */
  isKeyboardDismissDisabled?: boolean | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Blocking confirmation / destructive prompt with `role="alertdialog"`.
 * Backdrop click dismissal is disabled by default so the user makes an explicit choice.
 * Transforms into a bottom sheet below 900 px (D-90).
 */
export function AlertDialog({
  title,
  children,
  tone = 'default',
  confirmLabel,
  cancelLabel,
  isConfirmPending = false,
  isConfirmDisabled = false,
  onConfirm,
  onCancel,
  isOpen,
  defaultOpen,
  onOpenChange,
  isKeyboardDismissDisabled = false,
  className,
  ref,
}: AlertDialogProps) {
  const m = useNdsMessages();
  const isDanger = tone === 'danger';

  const handleConfirm = async (close: () => void) => {
    if (onConfirm) {
      await onConfirm();
    }
    close();
  };

  return (
    <RacModalOverlay
      {...(isOpen !== undefined ? { isOpen } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange !== undefined ? { onOpenChange } : {})}
      isDismissable={false}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      data-nds="AlertDialogOverlay"
      className={cx(styles.overlay)}
    >
      <RacModal data-nds="AlertDialogModal" data-size="sm" className={cx(styles.modal, className)}>
        <span className={cx(styles.handle)} aria-hidden="true" />
        <RacDialog
          ref={ref}
          role="alertdialog"
          data-nds="AlertDialog"
          data-tone={tone}
          className={cx(styles.dialog)}
        >
          {({ close }) => (
            <>
              <div className={cx(styles.header)}>
                <span className={cx(styles.alertIcon)} data-tone={tone} aria-hidden="true">
                  <Icon icon={isDanger ? iconDanger : iconWarning} size="md" />
                </span>
                <div className={cx(styles.headerText)}>
                  <RacHeading slot="title" level={2} className={cx(styles.title)}>
                    {title}
                  </RacHeading>
                </div>
              </div>
              <div className={cx(styles.body)}>{children}</div>
              <div className={cx(styles.footer)}>
                <Button
                  variant="secondary"
                  onPress={() => {
                    onCancel?.();
                    close();
                  }}
                >
                  {cancelLabel ?? m.cancel}
                </Button>
                <Button
                  variant={isDanger ? 'danger' : 'primary'}
                  isPending={isConfirmPending}
                  isDisabled={isConfirmDisabled}
                  onPress={() => void handleConfirm(close)}
                >
                  {confirmLabel ?? m.confirm}
                </Button>
              </div>
            </>
          )}
        </RacDialog>
      </RacModal>
    </RacModalOverlay>
  );
}
