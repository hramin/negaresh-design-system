import type { ReactNode, Ref, RefObject } from 'react';
import {
  Dialog as RacDialog,
  Heading as RacHeading,
  OverlayArrow as RacOverlayArrow,
  Popover as RacPopover,
} from 'react-aria-components';
import { DialogTrigger, type DialogTriggerProps } from '../Dialog/Dialog.tsx';
import { cx } from '../internal/cx.ts';
import styles from './Popover.module.css';

export type PopoverPlacement =
  | 'top'
  | 'top start'
  | 'top end'
  | 'bottom'
  | 'bottom start'
  | 'bottom end'
  | 'start'
  | 'start top'
  | 'start bottom'
  | 'end'
  | 'end top'
  | 'end bottom';

export type PopoverTriggerProps = DialogTriggerProps;

/** Convenience trigger alias for opening a `Popover` from a pressable control. */
export const PopoverTrigger = DialogTrigger;

export interface PopoverProps {
  /** Logical placement relative to the trigger (RTL-aware). Default `'bottom'`. */
  placement?: PopoverPlacement | undefined;
  /** Optional directional arrow aligned to the trigger. Default `false`. */
  showArrow?: boolean | undefined;
  /** Main-axis offset in px between trigger and popover. Defaults to `12` with arrow, `8` without. */
  offset?: number | undefined;
  /** Flip to the opposite side if viewport space is insufficient. Default `true`. */
  shouldFlip?: boolean | undefined;
  /** Optional heading announced as the popover dialog's accessible name. */
  title?: ReactNode | undefined;
  /** Accessible name when `title` is omitted. */
  'aria-label'?: string | undefined;
  /** Controlled open state (when used standalone with `triggerRef`). */
  isOpen?: boolean | undefined;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean | undefined;
  /** Called when open state changes. */
  onOpenChange?: ((isOpen: boolean) => void) | undefined;
  /** Anchor element ref when rendering standalone outside `PopoverTrigger` / `DialogTrigger`. */
  triggerRef?: RefObject<Element | null> | undefined;
  /** Allow interaction with elements outside without blocking pointer events. Default `false`. */
  isNonModal?: boolean | undefined;
  /** Popover content or render function receiving `close()`. */
  children: ReactNode | ((close: () => void) => ReactNode);
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Floating content overlay anchored to a trigger, built on React Aria `Popover` + `Dialog`.
 * Carries `--nds-shadow-overlay` (D-77) and logical RTL-aware placement.
 */
export function Popover({
  placement = 'bottom',
  showArrow = false,
  offset,
  shouldFlip = true,
  title,
  'aria-label': ariaLabel,
  isOpen,
  defaultOpen,
  onOpenChange,
  triggerRef,
  isNonModal = false,
  children,
  className,
  ref,
}: PopoverProps) {
  return (
    <RacPopover
      ref={ref}
      placement={placement}
      offset={offset ?? (showArrow ? 12 : 8)}
      shouldFlip={shouldFlip}
      isNonModal={isNonModal}
      {...(isOpen !== undefined ? { isOpen } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange !== undefined ? { onOpenChange } : {})}
      {...(triggerRef !== undefined ? { triggerRef } : {})}
      data-nds="Popover"
      className={cx(styles.popover, className)}
    >
      {showArrow && (
        <RacOverlayArrow className={cx(styles.arrow)} data-nds="PopoverArrow">
          <svg
            width={12}
            height={12}
            viewBox="0 0 12 12"
            aria-hidden="true"
            className={cx(styles.arrowSvg)}
          >
            <path d="M0 0 L6 6 L12 0" />
          </svg>
        </RacOverlayArrow>
      )}
      <RacDialog
        {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
        data-nds="PopoverDialog"
        className={cx(styles.dialog)}
      >
        {({ close }) => (
          <>
            {title !== undefined && (
              <RacHeading slot="title" level={3} className={cx(styles.title)}>
                {title}
              </RacHeading>
            )}
            {typeof children === 'function' ? children(close) : children}
          </>
        )}
      </RacDialog>
    </RacPopover>
  );
}
