import { iconCheck, iconClose } from '@negaresh/icons';
import type { ReactNode, Ref } from 'react';
import { Toolbar as RacToolbar } from 'react-aria-components';
import { Button } from '../Button/Button.tsx';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './BulkActionBar.module.css';

export interface BulkActionBarProps {
  /** Number of currently selected rows/items (formatted in Persian digits via `formatNumber`). */
  selectedCount: number;
  /** Optional total selectable items; when `selectedCount < totalCount` and `onSelectAll` is set, shows a «انتخاب همه» action. */
  totalCount?: number | undefined;
  /** Clears the current selection. */
  onClearSelection?: (() => void) | undefined;
  /** Optional handler to select all items. */
  onSelectAll?: (() => void) | undefined;
  /** Custom summary text override (defaults to `messages.bulkSelectedCount(selectedCount)`). */
  selectedLabel?: ReactNode | undefined;
  /** Keep the bar mounted even when `selectedCount === 0` (useful for static galleries). Default `false`. */
  alwaysVisible?: boolean | undefined;
  /** Accessible name for the React Aria `Toolbar`. Defaults to `messages.bulkActionsLabel`. */
  'aria-label'?: string | undefined;
  'aria-labelledby'?: string | undefined;
  /** Contextual bulk action buttons / menus rendered inside the toolbar. */
  children?: ReactNode | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Contextual selection toolbar built on React Aria `Toolbar` (single Tab stop, RTL arrow
 * navigation). Appears when items are selected, announces the Persian count politely, and
 * exposes bulk actions plus a clear-selection control.
 */
export function BulkActionBar({
  selectedCount,
  totalCount,
  onClearSelection,
  onSelectAll,
  selectedLabel,
  alwaysVisible = false,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  className,
  ref,
}: BulkActionBarProps) {
  const m = useNdsMessages();

  if (selectedCount <= 0 && !alwaysVisible) {
    return null;
  }

  const resolvedLabel = ariaLabelledBy ? undefined : (ariaLabel ?? m.bulkActionsLabel);
  const canSelectAll =
    onSelectAll !== undefined && totalCount !== undefined && selectedCount < totalCount;

  return (
    <RacToolbar
      ref={ref}
      orientation="horizontal"
      {...(resolvedLabel !== undefined ? { 'aria-label': resolvedLabel } : {})}
      {...(ariaLabelledBy !== undefined ? { 'aria-labelledby': ariaLabelledBy } : {})}
      data-nds="BulkActionBar"
      data-count={String(selectedCount)}
      className={cx(styles.bar, className)}
    >
      <div className={cx(styles.summary)}>
        <span className={cx(styles.count)} role="status" aria-live="polite" aria-atomic="true">
          <Icon icon={iconCheck} size="sm" />
          <span>{selectedLabel ?? m.bulkSelectedCount(selectedCount)}</span>
        </span>
        {canSelectAll && (
          <Button variant="ghost" size="sm" onPress={onSelectAll}>
            {m.bulkSelectAll}
          </Button>
        )}
      </div>

      <div className={cx(styles.actions)}>
        {children}
        {onClearSelection !== undefined && (
          <>
            {children !== undefined && children !== null && (
              <span className={cx(styles.divider)} aria-hidden="true" />
            )}
            <Button
              variant="ghost"
              size="sm"
              iconStart={iconClose}
              onPress={onClearSelection}
            >
              {m.bulkClearSelection}
            </Button>
          </>
        )}
      </div>
    </RacToolbar>
  );
}
