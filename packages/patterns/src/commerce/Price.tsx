import { Badge } from '@negaresh/react';
import { formatPrice } from '@negaresh/utils';
import type { ReactNode, Ref } from 'react';
import { cx } from '../internal/cx.ts';
import { usePatternMessages } from '../messages/context.tsx';
import styles from './commerce.module.css';

export type PriceSize = 'sm' | 'md' | 'lg';

export interface PriceProps {
  /** Integer amount in Toman (`0` renders «رایگان», D-26). Never convert currency units. */
  amount: number;
  /** Optional pre-discount amount in Toman; renders strikethrough and discount badge when > `amount`. */
  originalAmount?: number | undefined;
  /** Highlights organizational / B2B rate badge. */
  isOrgRate?: boolean | undefined;
  /** Optional unit suffix (e.g. «سالانه» or «هر صندلی»). */
  unit?: ReactNode | undefined;
  /** Visual size scale. Default `'md'`. */
  size?: PriceSize | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLSpanElement> | undefined;
}

/**
 * Toman-only price display reusing `@negaresh/utils` `formatPrice` (D-26).
 * Supports regular, discounted sale, free (`0` → «رایگان»), and organization rate pricing.
 */
export function Price({
  amount,
  originalAmount,
  isOrgRate = false,
  unit,
  size = 'md',
  className,
  ref,
}: PriceProps) {
  const { commerce } = usePatternMessages();
  const isFree = amount <= 0;
  const hasSale = originalAmount !== undefined && originalAmount > amount && originalAmount > 0;
  const discountPercent = hasSale ? Math.round(((originalAmount - amount) / originalAmount) * 100) : 0;

  return (
    <span
      ref={ref}
      data-nds="Price"
      data-size={size}
      data-free={isFree ? 'true' : undefined}
      className={cx(styles.price, className)}
    >
      <span className={styles.priceAmount}>{formatPrice(Math.max(0, amount))}</span>
      {unit !== undefined && <span className={styles.priceUnit}>{unit}</span>}
      {hasSale && (
        <>
          <del className={styles.priceOriginal}>{formatPrice(originalAmount)}</del>
          {discountPercent > 0 && (
            <Badge tone="success" size="sm">
              {commerce.discountBadge(discountPercent)}
            </Badge>
          )}
        </>
      )}
      {isOrgRate && (
        <Badge tone="accent" size="sm">
          {commerce.orgRateLabel}
        </Badge>
      )}
    </span>
  );
}
