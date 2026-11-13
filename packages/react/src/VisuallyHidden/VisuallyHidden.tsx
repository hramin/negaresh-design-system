import type { ElementType, ReactNode } from 'react';
import { cx } from '../internal/cx.ts';
import styles from './VisuallyHidden.module.css';

export interface VisuallyHiddenProps {
  as?: ElementType;
  id?: string | undefined;
  children: ReactNode;
}

/** Hidden on screen, read by assistive technology. */
export function VisuallyHidden({ as: As = 'span', id, children }: VisuallyHiddenProps) {
  return (
    <As id={id} data-nds="VisuallyHidden" className={cx(styles.hidden)}>
      {children}
    </As>
  );
}
