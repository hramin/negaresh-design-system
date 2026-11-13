import type { ReactNode } from 'react';
import { cx } from '../internal/cx.ts';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './LogoSlot.module.css';

export interface LogoSlotProps {
  /** The logo artwork (brand kits, Q-02). Without it a placeholder is shown. */
  logo?: ReactNode | undefined;
  /** Company name next to the mark, e.g. «نگارش برتر». */
  name?: ReactNode | undefined;
  /** Product label after a separator, e.g. «رجیستری». Hidden on mobile. */
  product?: ReactNode | undefined;
  /** Mark size: 24, 32 (default), 48 px. */
  size?: 'sm' | 'md' | 'lg';
  className?: string | undefined;
}

/**
 * The logo area: mark + name + product, with clear space. Core defines only the slot
 * (D-14, D-37); artwork comes from brand kits. Decorative: the surrounding link names it.
 */
export function LogoSlot({ logo, name, product, size = 'md', className }: LogoSlotProps) {
  const m = useNdsMessages();
  return (
    <span data-nds="LogoSlot" data-size={size} className={cx(styles.slot, className)}>
      <span
        className={cx(styles.mark)}
        data-placeholder={logo ? undefined : true}
        aria-hidden="true"
      >
        {logo ?? m.logoPlaceholder}
      </span>
      {name && <span className={cx(styles.name)}>{name}</span>}
      {product && (
        <>
          <span className={cx(styles.separator)} aria-hidden="true" />
          <span className={cx(styles.product)}>{product}</span>
        </>
      )}
    </span>
  );
}
