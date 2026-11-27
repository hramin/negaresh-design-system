import { iconFilter, iconRefresh } from '@negaresh/icons';
import { formatNumber } from '@negaresh/utils';
import { type ReactNode, type Ref, useState } from 'react';
import type { Key } from 'react-aria-components';
import { Badge } from '../Badge/Badge.tsx';
import { Button } from '../Button/Button.tsx';
import { cx } from '../internal/cx.ts';
import { SearchField } from '../SearchField/SearchField.tsx';
import { Sheet } from '../Sheet/Sheet.tsx';
import { Tag, TagGroup } from '../TagGroup/TagGroup.tsx';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './FilterBar.module.css';

export interface FilterChip {
  /** Unique filter identifier. */
  id: string;
  /** Filter dimension label (e.g. «وضعیت»). */
  label: string;
  /** Optional formatted active value (e.g. «فعال»). When set, renders «وضعیت: فعال». */
  value?: string | undefined;
}

export interface FilterBarProps {
  /** Controlled search query. When provided (or when `onSearchChange` is set), renders `SearchField`. */
  searchValue?: string | undefined;
  /** Initial uncontrolled search query. */
  defaultSearchValue?: string | undefined;
  /** Called as the search input changes. */
  onSearchChange?: ((value: string) => void) | undefined;
  /** Called when the user submits the search input. */
  onSearchSubmit?: ((value: string) => void) | undefined;
  /** Accessible label for the search field. Defaults to `messages.filterSearchLabel`. */
  searchLabel?: string | undefined;
  /** Placeholder text for the search field. Defaults to `messages.filterSearchPlaceholder`. */
  searchPlaceholder?: string | undefined;
  /** Show the search field even without `onSearchChange`. Default `true` when `searchValue` or `onSearchChange` is set. */
  showSearch?: boolean | undefined;
  /**
   * Filter controls (e.g. `Select`, `DateRangePicker`, `CheckboxGroup`).
   * Rendered inline on desktop (`>= 900 px`) and inside a Wave 2 `Sheet` on mobile (`< 900 px`).
   */
  filters?: ReactNode | undefined;
  /** Active filter chips rendered beneath the bar with keyboard/click removal. */
  activeFilters?: readonly FilterChip[] | undefined;
  /** Called when an individual active filter chip is removed. */
  onRemoveFilter?: ((id: string) => void) | undefined;
  /** Called when the user clicks «پاک کردن فیلترها». */
  onReset?: (() => void) | undefined;
  /** Override whether the reset action is visible (defaults to `activeFilters.length > 0 || Boolean(searchValue)`). */
  hasActiveFilters?: boolean | undefined;
  /** Title of the mobile filter `Sheet`. Defaults to `messages.filtersSheetTitle`. */
  sheetTitle?: ReactNode | undefined;
  /** Optional trailing actions aligned to the inline end (e.g. export or column controls). */
  actions?: ReactNode | undefined;
  /** Accessible label for the filter bar container. */
  'aria-label'?: string | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Search + filter controls + removable active filter chips + reset bar.
 * On desktop (`>= 900 px`) filter controls appear inline; below 900 px (D-90) they move into
 * a Wave 2 bottom `Sheet` without duplicating DOM IDs or breaking SSR parity.
 */
export function FilterBar({
  searchValue,
  defaultSearchValue,
  onSearchChange,
  onSearchSubmit,
  searchLabel,
  searchPlaceholder,
  showSearch,
  filters,
  activeFilters = [],
  onRemoveFilter,
  onReset,
  hasActiveFilters,
  sheetTitle,
  actions,
  'aria-label': ariaLabel,
  className,
  ref,
}: FilterBarProps) {
  const m = useNdsMessages();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const shouldRenderSearch =
    showSearch ??
    (searchValue !== undefined ||
      defaultSearchValue !== undefined ||
      onSearchChange !== undefined ||
      onSearchSubmit !== undefined);

  const activeCount = activeFilters.length;
  const showReset =
    onReset !== undefined &&
    (hasActiveFilters ?? (activeCount > 0 || Boolean(searchValue && searchValue.trim().length > 0)));

  const handleRemoveTags = (keys: Set<Key>) => {
    if (!onRemoveFilter) return;
    for (const key of keys) {
      onRemoveFilter(String(key));
    }
  };

  return (
    <section
      ref={ref}
      aria-label={ariaLabel ?? m.filtersButton}
      data-nds="FilterBar"
      className={cx(styles.root, className)}
    >
      <div className={cx(styles.mainRow)}>
        {shouldRenderSearch && (
          <div className={cx(styles.searchWrap)}>
            <SearchField
              label={searchLabel ?? m.filterSearchLabel}
              placeholder={searchPlaceholder ?? m.filterSearchPlaceholder}
              {...(searchValue !== undefined ? { value: searchValue } : {})}
              {...(defaultSearchValue !== undefined ? { defaultValue: defaultSearchValue } : {})}
              {...(onSearchChange !== undefined ? { onChange: onSearchChange } : {})}
              {...(onSearchSubmit !== undefined ? { onSubmit: onSearchSubmit } : {})}
            />
          </div>
        )}

        {filters !== undefined && filters !== null && (
          <>
            {/* Unmount inline filters while the mobile Sheet is open to avoid duplicate form IDs. */}
            <div className={cx(styles.desktopFilters)} data-nds-slot="desktop-filters">
              {!isSheetOpen && filters}
            </div>

            <div className={cx(styles.mobileTriggerWrap)}>
              <Button
                variant="secondary"
                iconStart={iconFilter}
                aria-label={
                  activeCount > 0
                    ? `${m.filtersButton} (${m.filtersActiveCount(activeCount)})`
                    : m.filtersButton
                }
                onPress={() => setIsSheetOpen(true)}
              >
                <span>{m.filtersButton}</span>
                {activeCount > 0 && (
                  <Badge tone="accent" size="sm" className={cx(styles.mobileCount)}>
                    {formatNumber(activeCount, { maximumFractionDigits: 0 })}
                  </Badge>
                )}
              </Button>
            </div>

            <Sheet
              isOpen={isSheetOpen}
              onOpenChange={setIsSheetOpen}
              side="end"
              title={sheetTitle ?? m.filtersSheetTitle}
              footer={(close) => (
                <div className={cx(styles.sheetFooter)}>
                  {onReset !== undefined && (
                    <Button
                      variant="ghost"
                      size="sm"
                      iconStart={iconRefresh}
                      onPress={() => {
                        onReset();
                      }}
                    >
                      {m.filtersReset}
                    </Button>
                  )}
                  <Button variant="primary" onPress={close}>
                    {m.filtersApply}
                  </Button>
                </div>
              )}
            >
              <div className={cx(styles.sheetBody)}>{filters}</div>
            </Sheet>
          </>
        )}

        {actions !== undefined && actions !== null && (
          <div className={cx(styles.actions)}>{actions}</div>
        )}
      </div>

      {(activeCount > 0 || showReset) && (
        <div className={cx(styles.chipsRow)} data-nds-slot="active-filters">
          {activeCount > 0 && (
            <TagGroup
              aria-label={m.filtersActiveGroupLabel}
              size="sm"
              className={cx(styles.chipsList)}
              {...(onRemoveFilter !== undefined ? { onRemove: handleRemoveTags } : {})}
            >
              {activeFilters.map((chip) => {
                const display = chip.value ? `${chip.label}: ${chip.value}` : chip.label;
                return (
                  <Tag key={chip.id} id={chip.id} tone="accent" textValue={display}>
                    {display}
                  </Tag>
                );
              })}
            </TagGroup>
          )}
          {showReset && (
            <Button variant="ghost" size="sm" iconStart={iconRefresh} onPress={onReset}>
              {m.filtersReset}
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
