import type { ReactNode, Ref } from 'react';
import { Toolbar as RacToolbar } from 'react-aria-components';
import { cx } from '../internal/cx.ts';
import styles from './ButtonGroup.module.css';

export interface ButtonGroupProps {
  /** `start` (default), `end` or `between` along the inline axis. */
  justify?: 'start' | 'end' | 'between';
  /** Stack buttons full-width below 600 px (mobile footers). */
  stackOnMobile?: boolean | undefined;
  className?: string | undefined;
  children: ReactNode;
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Lays out related actions with consistent spacing (e.g. a surface footer).
 * Not a composite widget: each button stays in the Tab order. Use Toolbar for arrow-key navigation.
 */
export function ButtonGroup({
  justify = 'start',
  stackOnMobile,
  className,
  children,
  ref,
}: ButtonGroupProps) {
  return (
    <div
      ref={ref}
      data-nds="ButtonGroup"
      data-justify={justify}
      data-stack={stackOnMobile || undefined}
      className={cx(styles.group, className)}
    >
      {children}
    </div>
  );
}

export interface ToolbarProps {
  /** Accessible name, e.g. «قالب‌بندی». */
  'aria-label'?: string;
  'aria-labelledby'?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string | undefined;
  children: ReactNode;
  ref?: Ref<HTMLDivElement> | undefined;
}

/** A set of controls reached with one Tab stop and arrow keys (React Aria `Toolbar`, RTL-aware). */
export function Toolbar({
  orientation = 'horizontal',
  className,
  children,
  ref,
  ...aria
}: ToolbarProps) {
  return (
    <RacToolbar
      {...aria}
      ref={ref}
      orientation={orientation}
      data-nds="Toolbar"
      className={cx(styles.toolbar, className)}
    >
      {children}
    </RacToolbar>
  );
}
