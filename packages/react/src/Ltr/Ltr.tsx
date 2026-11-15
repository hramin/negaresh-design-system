import { toLatinDigits } from '@negaresh/utils';
import type { ReactNode, Ref } from 'react';
import { cx } from '../internal/cx.ts';
import styles from './Ltr.module.css';

export interface LtrProps {
  /** Language of the island when it is not a code, e.g. `en` for a Latin product name. */
  lang?: string | undefined;
  className?: string | undefined;
  children?: ReactNode | undefined;
  ref?: Ref<HTMLSpanElement> | undefined;
}

/** A left-to-right island inside Persian text (URLs, emails, Latin names). Isolated so it never reorders its neighbours. */
export function Ltr({ lang, className, children, ref }: LtrProps) {
  return (
    <span ref={ref} dir="ltr" lang={lang} data-nds="Ltr" className={cx(styles.ltr, className)}>
      {children}
    </span>
  );
}

export interface CodeProps {
  /** The code. Strings are shown with Latin digits (D-86). */
  children: string | number;
  /** `inline` (inherits size) or `display` (large, for activation codes). Default `inline`. */
  size?: 'inline' | 'display';
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/** Serials, system codes, activation codes, order numbers: monospace, Latin digits, LTR. */
export function Code({ children, size = 'inline', className, ref }: CodeProps) {
  return (
    <code
      ref={ref}
      dir="ltr"
      translate="no"
      data-nds="Code"
      data-size={size}
      className={cx(styles.code, className)}
    >
      {toLatinDigits(String(children))}
    </code>
  );
}
