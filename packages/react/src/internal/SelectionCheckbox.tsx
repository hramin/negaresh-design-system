import { iconCheck, iconMinus } from '@negaresh/icons';
import { Checkbox as RacCheckbox } from 'react-aria-components';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from './cx.ts';
import styles from './SelectionCheckbox.module.css';

export interface SelectionCheckboxProps {
  /** Optional explicit accessible label override (React Aria supplies localized defaults via `slot="selection"`). */
  'aria-label'?: string | undefined;
  className?: string | undefined;
}

/**
 * Internal React Aria `slot="selection"` checkbox shared by `DataTable` and `GridList`.
 * Keeps a ≥ 44 × 44 px touch target and matches `Checkbox` semantic styling.
 */
export function SelectionCheckbox({ 'aria-label': ariaLabel, className }: SelectionCheckboxProps) {
  return (
    <RacCheckbox
      slot="selection"
      {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
      data-nds="SelectionCheckbox"
      className={cx(styles.control, className)}
    >
      {({ isSelected, isIndeterminate }) => (
        <span className={cx(styles.box)} aria-hidden="true">
          {isIndeterminate ? (
            <Icon icon={iconMinus} size="sm" />
          ) : isSelected ? (
            <Icon icon={iconCheck} size="sm" />
          ) : null}
        </span>
      )}
    </RacCheckbox>
  );
}
