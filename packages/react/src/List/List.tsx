import { iconSearch } from '@negaresh/icons';
import type { ReactNode, Ref } from 'react';
import {
  GridList as RacGridList,
  GridListItem as RacGridListItem,
  type Key,
  type Selection,
} from 'react-aria-components';
import { EmptyState } from '../EmptyState/EmptyState.tsx';
import { cx } from '../internal/cx.ts';
import { SelectionCheckbox } from '../internal/SelectionCheckbox.tsx';
import { Skeleton } from '../Skeleton/Skeleton.tsx';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './List.module.css';

export type ListDensity = 'comfortable' | 'compact';

export interface GridListItemProps {
  /** Unique key within the list. */
  id: Key;
  /** Plain-text label for keyboard typeahead and screen readers. Defaults to string `title` or `children`. */
  textValue?: string | undefined;
  /** Primary row headline (alternative to arbitrary `children`). */
  title?: ReactNode | undefined;
  /** Secondary line beneath the headline. */
  description?: ReactNode | undefined;
  /** Leading visual slot (e.g. `Avatar` or `Icon`). */
  leading?: ReactNode | undefined;
  /** Trailing metadata slot (e.g. `StatusBadge`, date, or `<Code>`). */
  meta?: ReactNode | undefined;
  /** Trailing interactive controls (e.g. `IconButton`, `CopyButton`, or `MenuTrigger`). */
  actions?: ReactNode | undefined;
  /** Optional navigation href when clicking/activating the row. */
  href?: string | undefined;
  /** Optional callback triggered on row click / Enter. */
  onAction?: (() => void) | undefined;
  /** Disables row selection and actions. */
  isDisabled?: boolean | undefined;
  /** Custom row body when `title` is not used. */
  children?: ReactNode | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/** Selectable, keyboard-navigable row inside `<GridList>` / `<List>`. */
export function GridListItem({
  id,
  textValue,
  title,
  description,
  leading,
  meta,
  actions,
  href,
  onAction,
  isDisabled,
  children,
  className,
  ref,
}: GridListItemProps) {
  const resolvedTextValue =
    textValue ??
    (typeof title === 'string'
      ? title
      : typeof children === 'string'
        ? children
        : String(id));

  return (
    <RacGridListItem
      ref={ref}
      id={id}
      textValue={resolvedTextValue}
      {...(href !== undefined ? { href } : {})}
      {...(onAction !== undefined ? { onAction } : {})}
      {...(isDisabled !== undefined ? { isDisabled } : {})}
      data-nds="GridListItem"
      data-allows-action={onAction !== undefined || href !== undefined ? 'true' : undefined}
      className={cx(styles.item, className)}
    >
      {({ selectionMode }) => (
        <>
          {selectionMode !== 'none' && <SelectionCheckbox />}
          {leading !== undefined && leading !== null && (
            <span className={cx(styles.leading)}>{leading}</span>
          )}
          <div className={cx(styles.body)}>
            {title !== undefined && title !== null && (
              <span className={cx(styles.title)}>{title}</span>
            )}
            {description !== undefined && description !== null && (
              <span className={cx(styles.description)}>{description}</span>
            )}
            {children}
          </div>
          {meta !== undefined && meta !== null && (
            <div className={cx(styles.meta)}>{meta}</div>
          )}
          {actions !== undefined && actions !== null && (
            <div className={cx(styles.actions)}>{actions}</div>
          )}
        </>
      )}
    </RacGridListItem>
  );
}

export interface GridListProps<T extends object = object> {
  /** Dynamic data items when using a children render function. */
  items?: Iterable<T> | undefined;
  /** Row selection mode (`none`, `single`, or `multiple`). Default `'none'`. */
  selectionMode?: 'none' | 'single' | 'multiple' | undefined;
  /** How clicking interacts with selection (`toggle` or `replace`). Default `'toggle'`. */
  selectionBehavior?: 'toggle' | 'replace' | undefined;
  selectedKeys?: 'all' | Iterable<Key> | undefined;
  defaultSelectedKeys?: 'all' | Iterable<Key> | undefined;
  onSelectionChange?: ((keys: Selection) => void) | undefined;
  disabledKeys?: Iterable<Key> | undefined;
  /** Called when a row is activated via click or Enter. */
  onAction?: ((key: Key) => void) | undefined;
  /** Vertical row spacing. Default `'comfortable'`. */
  density?: ListDensity | undefined;
  /** Hairline dividers between rows. Default `true`. */
  divided?: boolean | undefined;
  /** Outer hairline surface border. Default `true`. */
  bordered?: boolean | undefined;
  /** Renders skeleton placeholder rows with `aria-busy="true"`. */
  isLoading?: boolean | undefined;
  /** Number of skeleton rows when `isLoading` is true. Default `3`. */
  loadingCount?: number | undefined;
  /** Custom empty view when the collection has zero items. */
  emptyState?: ReactNode | undefined;
  /** Accessible name for the list. */
  'aria-label'?: string | undefined;
  'aria-labelledby'?: string | undefined;
  children: ReactNode | ((item: T) => ReactNode);
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Keyboard-navigable collection list built on React Aria `GridList` supporting single/multiple
 * row selection, row actions, trailing controls, loading skeletons, and empty states.
 */
export function GridList<T extends object = object>({
  items,
  selectionMode = 'none',
  selectionBehavior = 'toggle',
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  disabledKeys,
  onAction,
  density = 'comfortable',
  divided = true,
  bordered = true,
  isLoading = false,
  loadingCount = 3,
  emptyState,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  className,
  ref,
}: GridListProps<T>) {
  const m = useNdsMessages();

  if (isLoading) {
    const placeholders = Array.from({ length: Math.max(1, loadingCount) }, (_, i) => i + 1);
    return (
      <div
        role="status"
        data-nds="GridList"
        data-loading="true"
        data-bordered={bordered ? 'true' : 'false'}
        aria-busy="true"
        {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
        className={cx(styles.list, styles.loading, className)}
      >
        {placeholders.map((slot) => (
          <Skeleton key={`list-sk-${slot}`} variant="text" lines={2} />
        ))}
      </div>
    );
  }

  const renderEmpty = () =>
    emptyState ?? (
      <EmptyState
        icon={iconSearch}
        title={m.listEmptyTitle}
        description={m.listEmptyDescription}
        size="sm"
      />
    );

  return (
    <RacGridList
      ref={ref}
      {...(items !== undefined ? { items } : {})}
      selectionMode={selectionMode}
      selectionBehavior={selectionBehavior}
      {...(selectedKeys !== undefined ? { selectedKeys } : {})}
      {...(defaultSelectedKeys !== undefined ? { defaultSelectedKeys } : {})}
      {...(onSelectionChange !== undefined ? { onSelectionChange } : {})}
      {...(disabledKeys !== undefined ? { disabledKeys } : {})}
      {...(onAction !== undefined ? { onAction } : {})}
      {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
      {...(ariaLabelledBy !== undefined ? { 'aria-labelledby': ariaLabelledBy } : {})}
      renderEmptyState={renderEmpty}
      data-nds="GridList"
      data-density={density}
      data-divided={divided ? 'true' : 'false'}
      data-bordered={bordered ? 'true' : 'false'}
      className={cx(styles.list, className)}
    >
      {children}
    </RacGridList>
  );
}

export type ListProps<T extends object = object> = GridListProps<T>;
export type ListItemProps = GridListItemProps;

/** Ergonomic alias for `<GridList>` (docs/components.md: `List, GridList`). */
export const List = GridList;

/** Ergonomic alias for `<GridListItem>`. */
export const ListItem = GridListItem;
