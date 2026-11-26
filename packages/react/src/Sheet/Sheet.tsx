import { iconClose } from '@negaresh/icons';
import type { ReactNode, Ref } from 'react';
import {
  Dialog as RacDialog,
  Heading as RacHeading,
  Modal as RacModal,
  ModalOverlay as RacModalOverlay,
} from 'react-aria-components';
import { IconButton } from '../Button/Button.tsx';
import { DialogTrigger, type DialogTriggerProps } from '../Dialog/Dialog.tsx';
import { cx } from '../internal/cx.ts';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './Sheet.module.css';

export type SheetSide = 'start' | 'end' | 'bottom';
export type SheetSize = 'sm' | 'md' | 'lg';
export type SheetTriggerProps = DialogTriggerProps;

/** Convenience trigger alias for opening a `Sheet` / `Drawer`. */
export const SheetTrigger = DialogTrigger;

export interface SheetProps {
  /** Heading announced as the sheet's accessible name via `aria-labelledby`. */
  title?: ReactNode | undefined;
  /** Optional subtitle below the title. */
  description?: ReactNode | undefined;
  /** Desktop dock edge: logical `start` (right in RTL), `end` (left in RTL), or `bottom`. Below 900 px all variants open as a bottom sheet. Default `'start'`. */
  side?: SheetSide | undefined;
  /** Desktop drawer width: `sm` (320 px), `md` (400 px), `lg` (560 px). Default `'md'`. */
  size?: SheetSize | undefined;
  /** Optional footer slot (actions); rendered on a sunken surface with hairline. */
  footer?: ReactNode | ((close: () => void) => ReactNode) | undefined;
  /** Show the ≥ 44 × 44 px close button in the header. Default `true`. */
  showCloseButton?: boolean | undefined;
  /** Controlled open state (when rendered standalone without `DialogTrigger` / `SheetTrigger`). */
  isOpen?: boolean | undefined;
  /** Initial uncontrolled open state. */
  defaultOpen?: boolean | undefined;
  /** Called when open state changes. */
  onOpenChange?: ((isOpen: boolean) => void) | undefined;
  /** Allow dismissing by clicking outside the sheet. Default `true`. */
  isDismissable?: boolean | undefined;
  /** Prevent dismissing with the Escape key. Default `false`. */
  isKeyboardDismissDisabled?: boolean | undefined;
  /** Accessible name when `title` is omitted. */
  'aria-label'?: string | undefined;
  /** Sheet body content or render function receiving `close()`. */
  children: ReactNode | ((close: () => void) => ReactNode);
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Slide-over drawer on desktop (`start` / `end`) and bottom sheet on mobile (`< 900 px`, D-90),
 * built on React Aria `ModalOverlay` + `Modal` + `Dialog`.
 * Composes cleanly inside `TopBar`'s `mobileMenu` slot with `DialogTrigger` + `IconButton`.
 */
export function Sheet({
  title,
  description,
  side = 'start',
  size = 'md',
  footer,
  showCloseButton = true,
  isOpen,
  defaultOpen,
  onOpenChange,
  isDismissable = true,
  isKeyboardDismissDisabled = false,
  'aria-label': ariaLabel,
  children,
  className,
  ref,
}: SheetProps) {
  const m = useNdsMessages();
  const hasHeader = title !== undefined || description !== undefined || showCloseButton;

  return (
    <RacModalOverlay
      {...(isOpen !== undefined ? { isOpen } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange !== undefined ? { onOpenChange } : {})}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      data-nds="SheetOverlay"
      data-side={side}
      className={cx(styles.overlay)}
    >
      <RacModal
        data-nds="SheetModal"
        data-side={side}
        data-size={size}
        className={cx(styles.modal, className)}
      >
        <span className={cx(styles.handle)} aria-hidden="true" />
        <RacDialog
          ref={ref}
          {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
          data-nds="Sheet"
          data-side={side}
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
                        aria-label={m.closeSheet}
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

/** Alias of `Sheet` matching the `Sheet / Drawer` inventory name. */
export const Drawer = Sheet;
export type DrawerProps = SheetProps;
