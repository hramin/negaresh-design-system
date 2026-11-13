import { Separator } from 'react-aria-components';
import { cx } from '../internal/cx.ts';
import styles from './Divider.module.css';

export interface DividerProps {
  /** Default `horizontal`. */
  orientation?: 'horizontal' | 'vertical';
  /** `default` hairline or `strong` (visible dividers, tracks). */
  tone?: 'default' | 'strong';
  className?: string | undefined;
}

/** A hairline separator (React Aria `Separator`, role="separator"). */
export function Divider({ orientation = 'horizontal', tone = 'default', className }: DividerProps) {
  return (
    <Separator
      orientation={orientation}
      data-nds="Divider"
      data-tone={tone}
      className={cx(styles.divider, className)}
    />
  );
}
