import type { IconDefinition } from '@negaresh/icons';
import type { ReactNode, Ref } from 'react';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import styles from './Badge.module.css';

export type BadgeTone = 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  /** Semantic tone. Default `'neutral'`. Always pair with text (never colour alone). */
  tone?: BadgeTone | undefined;
  /** Compact `sm` (2xs text, eyebrow/table) or `md` (xs text). Default `'md'`. */
  size?: BadgeSize | undefined;
  /** Decorative leading status dot (`aria-hidden`). */
  dot?: boolean | undefined;
  /** Optional leading icon (`16 px`). */
  icon?: IconDefinition | undefined;
  children: ReactNode;
  className?: string | undefined;
  ref?: Ref<HTMLSpanElement> | undefined;
}

/** Compact non-interactive status or metadata pill (`neutral`, `accent`, or status tones). */
export function Badge({
  tone = 'neutral',
  size = 'md',
  dot = false,
  icon,
  children,
  className,
  ref,
}: BadgeProps) {
  return (
    <span
      ref={ref}
      data-nds="Badge"
      data-tone={tone}
      data-size={size}
      className={cx(styles.badge, className)}
    >
      {dot && <span className={cx(styles.dot)} aria-hidden="true" />}
      {icon && (
        <span className={cx(styles.icon)} aria-hidden="true">
          <Icon icon={icon} size="sm" />
        </span>
      )}
      <span className={cx(styles.label)}>{children}</span>
    </span>
  );
}
