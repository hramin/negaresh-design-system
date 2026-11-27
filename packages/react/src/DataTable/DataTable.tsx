import {
  iconArrowDown,
  iconArrowUp,
  iconEye,
  iconSearch,
  iconSort,
} from '@negaresh/icons';
import { type ReactNode, type Ref, useMemo, useState } from 'react';
import {
  Cell as RacCell,
  Column as RacColumn,
  type Key,
  Row as RacRow,
  type Selection,
  type SortDescriptor,
  Table as RacTable,
  TableBody as RacTableBody,
  TableHeader as RacTableHeader,
} from 'react-aria-components';
import { Button } from '../Button/Button.tsx';
import { EmptyState } from '../EmptyState/EmptyState.tsx';
import { ErrorState } from '../ErrorPage/ErrorPage.tsx';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { SelectionCheckbox } from '../internal/SelectionCheckbox.tsx';
import { Menu, MenuItem, MenuTrigger } from '../Menu/Menu.tsx';
import { Skeleton } from '../Skeleton/Skeleton.tsx';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import { ToggleButton, ToggleButtonGroup } from '../ToggleButton/ToggleButton.tsx';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden.tsx';
import styles from './DataTable.module.css';

export type DataTableDensity = 'comfortable' | 'compact';
export type DataTableSortDescriptor = SortDescriptor;
export type DataTableSelection = Selection;

export interface DataTableColumn<T> {
  /** Unique stable column identifier. */
  id: string;
  /** Visible column header label. */
  header: ReactNode;
  /** Plain-text label for column-visibility menu & accessibility when `header` is not a string. */
  label?: string | undefined;
  /** Renders cell content for a row. */
  cell: (row: T) => ReactNode;
  /** Enables sorting on this column via React Aria `Column.allowsSorting`. */
  allowsSorting?: boolean | undefined;
  /** Optional comparable value for built-in client-side sorting when `onSortChange` is uncontrolled. */
  sortValue?: ((row: T) => string | number) | undefined;
  /** Marks this column as the ARIA row header (`isRowHeader`). Defaults to the first visible column. */
  isRowHeader?: boolean | undefined;
  /** Logical inline text alignment (`start`, `end`, `center`). Default `'start'`. */
  align?: 'start' | 'end' | 'center' | undefined;
  /** Allow hiding this column in the column-visibility menu. Default `true`. */
  hideable?: boolean | undefined;
  /** Hide this column initially when uncontrolled. Default `false`. */
  defaultHidden?: boolean | undefined;
  /** Hide this column inside stacked mobile cards (< 900 px). Default `false`. */
  mobileHidden?: boolean | undefined;
  /** Style this cell as the emphasized primary row on mobile cards. */
  mobilePrimary?: boolean | undefined;
  /** Optional plain-text value for cell typeahead. */
  textValue?: ((row: T) => string) | undefined;
}

export interface DataTableProps<T> {
  /** Column definitions. */
  columns: readonly DataTableColumn<T>[];
  /** Row data items. */
  rows: readonly T[];
  /** Extracts a unique stable React Aria `Key` from each row. */
  getRowKey: (row: T) => Key;
  /** Extracts plain-text row summary for screen readers & typeahead. */
  getRowTextValue?: ((row: T) => string) | undefined;
  /** Accessible name for the table (required unless `aria-labelledby` is provided). */
  'aria-label'?: string | undefined;
  'aria-labelledby'?: string | undefined;
  /** Row selection mode (`none`, `single`, `multiple`). Default `'none'`. */
  selectionMode?: 'none' | 'single' | 'multiple' | undefined;
  /** How clicking interacts with selection (`toggle` or `replace`). Default `'toggle'`. */
  selectionBehavior?: 'toggle' | 'replace' | undefined;
  selectedKeys?: Selection | undefined;
  defaultSelectedKeys?: Selection | undefined;
  onSelectionChange?: ((keys: Selection) => void) | undefined;
  disabledKeys?: Iterable<Key> | undefined;
  /** Called when a row is activated via click or Enter. */
  onRowAction?: ((key: Key) => void) | undefined;
  /** Controlled sort descriptor. */
  sortDescriptor?: SortDescriptor | undefined;
  /** Initial uncontrolled sort descriptor. */
  defaultSortDescriptor?: SortDescriptor | undefined;
  /** Called when a sortable column header is activated. */
  onSortChange?: ((descriptor: SortDescriptor) => void) | undefined;
  /** Sticks the header row to the top of the scrollable container on desktop. Default `false`. */
  stickyHeader?: boolean | undefined;
  /** Controlled row density (`comfortable` or `compact`). */
  density?: DataTableDensity | undefined;
  /** Initial uncontrolled density. Default `'comfortable'`. */
  defaultDensity?: DataTableDensity | undefined;
  onDensityChange?: ((density: DataTableDensity) => void) | undefined;
  /** Show the built-in comfortable/compact density toggle in the utility toolbar. Default `false`. */
  showDensityToggle?: boolean | undefined;
  /** Show the built-in column visibility menu in the utility toolbar. Default `false`. */
  enableColumnVisibility?: boolean | undefined;
  /** Controlled set of visible column IDs. */
  visibleColumns?: Iterable<string> | undefined;
  /** Initial uncontrolled visible column IDs (defaults to all columns without `defaultHidden`). */
  defaultVisibleColumns?: Iterable<string> | undefined;
  onVisibleColumnsChange?: ((visible: Set<string>) => void) | undefined;
  /** Stack rows into calm hairline cards below 900 px (D-90). Default `true`. */
  mobileCards?: boolean | undefined;
  /** Renders Wave 1 `Skeleton` (`variant="table"`) with `aria-busy="true"`. */
  isLoading?: boolean | undefined;
  /** Number of skeleton placeholder rows when `isLoading` is true. Default `5`. */
  loadingRows?: number | undefined;
  /** Renders Wave 1 `ErrorState` when set (`true` uses localized default description). */
  error?: ReactNode | boolean | undefined;
  /** Retry handler wired to the `ErrorState` primary button. */
  onRetry?: (() => void) | undefined;
  /** Custom Wave 1 `EmptyState` override when `rows` is empty. */
  emptyState?: ReactNode | undefined;
  /** Optional leading toolbar controls beside column/density controls. */
  toolbarStart?: ReactNode | undefined;
  /** Optional trailing toolbar controls. */
  toolbarEnd?: ReactNode | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

const PERSIAN_COLLATOR = new Intl.Collator('fa-IR', { numeric: true, sensitivity: 'base' });

/**
 * Accessible data table built on React Aria `Table`, supporting sorting, single/multiple row
 * selection, sticky header, column visibility toggle, comfortable/compact density, Wave 1
 * loading/empty/error states, and SSR-safe stacked mobile cards below 900 px (D-90).
 */
export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  getRowTextValue,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  selectionMode = 'none',
  selectionBehavior = 'toggle',
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  disabledKeys,
  onRowAction,
  sortDescriptor,
  defaultSortDescriptor,
  onSortChange,
  stickyHeader = false,
  density,
  defaultDensity = 'comfortable',
  onDensityChange,
  showDensityToggle = false,
  enableColumnVisibility = false,
  visibleColumns,
  defaultVisibleColumns,
  onVisibleColumnsChange,
  mobileCards = true,
  isLoading = false,
  loadingRows = 5,
  error,
  onRetry,
  emptyState,
  toolbarStart,
  toolbarEnd,
  className,
  ref,
}: DataTableProps<T>) {
  const m = useNdsMessages();

  const [uncontrolledDensity, setUncontrolledDensity] = useState<DataTableDensity>(defaultDensity);
  const activeDensity = density ?? uncontrolledDensity;

  const [uncontrolledSort, setUncontrolledSort] = useState<SortDescriptor | undefined>(
    defaultSortDescriptor,
  );
  const activeSort = sortDescriptor !== undefined ? sortDescriptor : uncontrolledSort;

  const [uncontrolledVisible, setUncontrolledVisible] = useState<Set<string>>(() => {
    if (defaultVisibleColumns !== undefined) return new Set(defaultVisibleColumns);
    return new Set(columns.filter((c) => !c.defaultHidden).map((c) => c.id));
  });
  const activeVisibleSet = useMemo(
    () => (visibleColumns !== undefined ? new Set(visibleColumns) : uncontrolledVisible),
    [visibleColumns, uncontrolledVisible],
  );

  const displayedColumns = useMemo(() => {
    const filtered = columns.filter((col) => col.hideable === false || activeVisibleSet.has(col.id));
    return filtered.length > 0 ? filtered : columns.slice(0, 1);
  }, [columns, activeVisibleSet]);

  const hasExplicitRowHeader = displayedColumns.some((c) => c.isRowHeader);

  const sortedRows = useMemo(() => {
    if (!activeSort?.column || onSortChange) return rows;
    const col = columns.find((c) => c.id === String(activeSort.column));
    if (!col?.sortValue) return rows;
    const getVal = col.sortValue;
    const dir = activeSort.direction === 'descending' ? -1 : 1;
    return [...rows].sort((a, b) => {
      const av = getVal(a);
      const bv = getVal(b);
      if (typeof av === 'number' && typeof bv === 'number') {
        return (av - bv) * dir;
      }
      return PERSIAN_COLLATOR.compare(String(av), String(bv)) * dir;
    });
  }, [rows, activeSort, columns, onSortChange]);

  const handleSortChange = (next: SortDescriptor) => {
    if (sortDescriptor === undefined) setUncontrolledSort(next);
    onSortChange?.(next);
  };

  const handleDensityChange = (next: DataTableDensity) => {
    if (density === undefined) setUncontrolledDensity(next);
    onDensityChange?.(next);
  };

  const handleVisibleColumnsSelection = (keys: Selection) => {
    let next: Set<string>;
    if (keys === 'all') {
      next = new Set(columns.map((c) => c.id));
    } else {
      next = new Set([...keys].map(String));
    }
    for (const col of columns) {
      if (col.hideable === false) next.add(col.id);
    }
    if (next.size === 0 && columns[0]) {
      next.add(columns[0].id);
    }
    if (visibleColumns === undefined) setUncontrolledVisible(next);
    onVisibleColumnsChange?.(next);
  };

  const disabledColumnMenuKeys = useMemo(() => {
    const locked = new Set<string>();
    for (const col of columns) {
      if (col.hideable === false) locked.add(col.id);
    }
    if (displayedColumns.length === 1 && displayedColumns[0]) {
      locked.add(displayedColumns[0].id);
    }
    return locked;
  }, [columns, displayedColumns]);

  const hasToolbar =
    enableColumnVisibility || showDensityToggle || toolbarStart !== undefined || toolbarEnd !== undefined;

  const hasSelectionColumn = selectionMode !== 'none';
  const showError = Boolean(error);

  return (
    <div
      ref={ref}
      data-nds="DataTable"
      data-density={activeDensity}
      className={cx(styles.root, className)}
    >
      {hasToolbar && (
        <div className={cx(styles.toolbar)} data-nds-slot="table-toolbar">
          {toolbarStart !== undefined && (
            <div className={cx(styles.toolbarStart)}>{toolbarStart}</div>
          )}
          <div className={cx(styles.toolbarEnd)}>
            {showDensityToggle && (
              <ToggleButtonGroup
                aria-label={m.tableDensity}
                selectedKeys={[activeDensity]}
                disallowEmptySelection
                onSelectionChange={(keys) => {
                  const [selected] = [...keys];
                  if (selected === 'comfortable' || selected === 'compact') {
                    handleDensityChange(selected);
                  }
                }}
              >
                <ToggleButton id="comfortable" size="sm">
                  {m.tableDensityComfortable}
                </ToggleButton>
                <ToggleButton id="compact" size="sm">
                  {m.tableDensityCompact}
                </ToggleButton>
              </ToggleButtonGroup>
            )}

            {enableColumnVisibility && (
              <MenuTrigger>
                <Button variant="secondary" size="sm" iconStart={iconEye}>
                  {m.tableColumns}
                </Button>
                <Menu
                  aria-label={m.tableColumnsLabel}
                  selectionMode="multiple"
                  selectedKeys={new Set(displayedColumns.map((c) => c.id))}
                  disabledKeys={disabledColumnMenuKeys}
                  onSelectionChange={handleVisibleColumnsSelection}
                >
                  {columns.map((col) => {
                    const label =
                      col.label ?? (typeof col.header === 'string' ? col.header : col.id);
                    return (
                      <MenuItem key={col.id} id={col.id} textValue={label}>
                        {label}
                      </MenuItem>
                    );
                  })}
                </Menu>
              </MenuTrigger>
            )}
            {toolbarEnd}
          </div>
        </div>
      )}

      <div
        className={cx(styles.surface)}
        data-mobile-cards={mobileCards && !isLoading && !showError && sortedRows.length > 0 ? 'true' : 'false'}
      >
        {isLoading ? (
          <div className={cx(styles.stateBox)} aria-busy="true">
            <VisuallyHidden>
              <span role="status">{m.loading}</span>
            </VisuallyHidden>
            <Skeleton
              variant="table"
              rows={loadingRows}
              columns={Math.max(2, displayedColumns.length)}
            />
          </div>
        ) : showError ? (
          <div className={cx(styles.stateBox)}>
            <ErrorState
              status={500}
              code={false}
              headingLevel={3}
              title={m.tableErrorTitle}
              description={
                error === true
                  ? m.tableErrorDescription
                  : error
              }
              {...(onRetry !== undefined ? { onAction: onRetry, actionLabel: m.tableRetry } : {})}
            />
          </div>
        ) : sortedRows.length === 0 ? (
          <div className={cx(styles.stateBox)}>
            {emptyState ?? (
              <EmptyState
                icon={iconSearch}
                title={m.tableEmptyTitle}
                description={m.tableEmptyDescription}
                headingLevel={3}
                size="sm"
              />
            )}
          </div>
        ) : (
          <div
            className={cx(styles.scrollWrap)}
            data-sticky={stickyHeader ? 'true' : undefined}
            data-mobile-cards={mobileCards ? 'true' : 'false'}
          >
            <RacTable
              {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
              {...(ariaLabelledBy !== undefined ? { 'aria-labelledby': ariaLabelledBy } : {})}
              selectionMode={selectionMode}
              selectionBehavior={selectionBehavior}
              {...(selectedKeys !== undefined ? { selectedKeys } : {})}
              {...(defaultSelectedKeys !== undefined ? { defaultSelectedKeys } : {})}
              {...(onSelectionChange !== undefined ? { onSelectionChange } : {})}
              {...(disabledKeys !== undefined ? { disabledKeys } : {})}
              {...(onRowAction !== undefined ? { onRowAction } : {})}
              {...(activeSort !== undefined ? { sortDescriptor: activeSort } : {})}
              onSortChange={handleSortChange}
              data-mobile-cards={mobileCards ? 'true' : 'false'}
              className={cx(styles.table)}
            >
              <RacTableHeader className={cx(styles.thead)}>
                {hasSelectionColumn && (
                  <RacColumn id="__nds_selection__" className={cx(styles.th, styles.selectionCol)}>
                    {selectionMode === 'multiple' ? (
                      <SelectionCheckbox />
                    ) : (
                      <span className={cx(styles.srOnly)}>{m.tableSelectAll}</span>
                    )}
                  </RacColumn>
                )}
                {displayedColumns.map((col, colIndex) => (
                  <RacColumn
                    key={col.id}
                    id={col.id}
                    isRowHeader={col.isRowHeader ?? (!hasExplicitRowHeader && colIndex === 0)}
                    allowsSorting={Boolean(col.allowsSorting)}
                    data-align={col.align ?? 'start'}
                    className={cx(styles.th)}
                  >
                    {({ allowsSorting, sortDirection }) => (
                      <span className={cx(styles.thInner)}>
                        <span>{col.header}</span>
                        {allowsSorting && (
                          <span className={cx(styles.sortIcon)} aria-hidden="true">
                            <Icon
                              icon={
                                sortDirection === 'ascending'
                                  ? iconArrowUp
                                  : sortDirection === 'descending'
                                    ? iconArrowDown
                                    : iconSort
                              }
                              size="sm"
                            />
                          </span>
                        )}
                      </span>
                    )}
                  </RacColumn>
                ))}
              </RacTableHeader>

              <RacTableBody className={cx(styles.tbody)}>
                {sortedRows.map((row) => {
                  const rowKey = getRowKey(row);
                  const rowText = getRowTextValue ? getRowTextValue(row) : String(rowKey);
                  return (
                    <RacRow
                      key={String(rowKey)}
                      id={rowKey}
                      textValue={rowText}
                      className={cx(styles.row)}
                    >
                      {hasSelectionColumn && (
                        <RacCell className={cx(styles.td, styles.selectionCell)}>
                          <SelectionCheckbox />
                        </RacCell>
                      )}
                      {displayedColumns.map((col, colIndex) => {
                        const isPrimary =
                          col.mobilePrimary ?? (col.isRowHeader || (!hasExplicitRowHeader && colIndex === 0));
                        return (
                          <RacCell
                            key={col.id}
                            {...(col.textValue ? { textValue: col.textValue(row) } : {})}
                            data-align={col.align ?? 'start'}
                            data-mobile-hidden={col.mobileHidden ? 'true' : undefined}
                            data-primary={isPrimary ? 'true' : undefined}
                            className={cx(styles.td)}
                          >
                            <span className={cx(styles.mobileLabel)} aria-hidden="true">
                              {col.header}
                            </span>
                            <span className={cx(styles.cellContent)}>{col.cell(row)}</span>
                          </RacCell>
                        );
                      })}
                    </RacRow>
                  );
                })}
              </RacTableBody>
            </RacTable>
          </div>
        )}
      </div>
    </div>
  );
}
