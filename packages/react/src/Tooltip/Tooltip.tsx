import type { ReactElement, Ref, RefObject } from 'react';
import {
  OverlayArrow as RacOverlayArrow,
  Tooltip as RacTooltip,
  TooltipTrigger as RacTooltipTrigger,
  type TooltipTriggerComponentProps as RacTooltipTriggerProps,
} from 'react-aria-components';
import { cx } from '../internal/cx.ts';
import styles from './Tooltip.module.css';

export type TooltipPlacement = 'top' | 'bottom' | 'start' | 'end';

export interface TooltipTriggerProps
  extends Pick<
    RacTooltipTriggerProps,
    'delay' | 'closeDelay' | 'isDisabled' | 'isOpen' | 'defaultOpen' | 'onOpenChange' | 'trigger'
  > {
  /** A focusable trigger (e.g. `Button` or `IconButton`) followed by `<Tooltip>`. */
  children: [ReactElement, ReactElement];
}

/** Shows a text-only `Tooltip` on pointer hover and keyboard focus. */
export function TooltipTrigger({ delay = 400, closeDelay = 150, ...rest }: TooltipTriggerProps) {
  return <RacTooltipTrigger delay={delay} closeDelay={closeDelay} {...rest} />;
}

export interface TooltipProps {
  /** Short, plain text only — never place essential instructions or interactive controls in a Tooltip. */
  children: string | number;
  /** Logical placement relative to the trigger (RTL-aware). Default `'top'`. */
  placement?: TooltipPlacement | undefined;
  /** Show a small inverse arrow pointing to the trigger. Default `true`. */
  showArrow?: boolean | undefined;
  /** Offset in px between trigger and tooltip. Default `8`. */
  offset?: number | undefined;
  /** Flip to the opposite side when viewport space is tight. Default `true`. */
  shouldFlip?: boolean | undefined;
  /** Controlled open state (when rendered standalone with `triggerRef`). */
  isOpen?: boolean | undefined;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean | undefined;
  /** Called when open state changes. */
  onOpenChange?: ((isOpen: boolean) => void) | undefined;
  /** Anchor element ref when used standalone outside `TooltipTrigger`. */
  triggerRef?: RefObject<Element | null> | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Text-only supplemental hint on React Aria `Tooltip`, styled with inverse tokens
 * (`--nds-bg-inverse` / `--nds-fg-inverse`, docs/foundations/color.md) and `--nds-shadow-overlay`.
 */
export function Tooltip({
  children,
  placement = 'top',
  showArrow = true,
  offset = 8,
  shouldFlip = true,
  isOpen,
  defaultOpen,
  onOpenChange,
  triggerRef,
  className,
  ref,
}: TooltipProps) {
  return (
    <RacTooltip
      ref={ref}
      placement={placement}
      offset={offset}
      shouldFlip={shouldFlip}
      {...(isOpen !== undefined ? { isOpen } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange !== undefined ? { onOpenChange } : {})}
      {...(triggerRef !== undefined ? { triggerRef } : {})}
      data-nds="Tooltip"
      className={cx(styles.tooltip, className)}
    >
      {showArrow && (
        <RacOverlayArrow className={cx(styles.arrow)} data-nds="TooltipArrow">
          <svg
            width={10}
            height={6}
            viewBox="0 0 10 6"
            aria-hidden="true"
            className={cx(styles.arrowSvg)}
          >
            <path d="M0 0 L5 5 L10 0" />
          </svg>
        </RacOverlayArrow>
      )}
      {children}
    </RacTooltip>
  );
}
