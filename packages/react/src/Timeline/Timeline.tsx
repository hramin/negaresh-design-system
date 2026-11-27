import {
  iconClock,
  iconError,
  iconInfo,
  iconSuccess,
  iconWarning,
  type IconDefinition,
} from '@negaresh/icons';
import {
  type DateInput,
  formatDate,
  formatDateTime,
  formatRelative,
} from '@negaresh/utils';
import type { ReactNode, Ref } from 'react';
import {
  GridList as RacGridList,
  GridListItem as RacGridListItem,
  type Key,
  type Selection,
} from 'react-aria-components';
import { EmptyState } from '../EmptyState/EmptyState.tsx';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { Skeleton } from '../Skeleton/Skeleton.tsx';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './Timeline.module.css';

export type TimelineTone = 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger';
export type TimelineDensity = 'comfortable' | 'compact';
export type TimelineTimestampFormat = 'datetime' | 'date' | 'relative';

export interface TimelineEntry {
  /** Stable identifier for list keys and ActivityList selection/actions. */
  id?: Key | undefined;
  /** Event headline (e.g. «فعال‌سازی جدید روی رایانه»). */
  title: ReactNode;
  /** Optional plain-Persian event detail. */
  description?: ReactNode | undefined;
  /** Event timestamp formatted in Jalali (Asia/Tehran) via `@negaresh/utils`. */
  timestamp?: DateInput | undefined;
  /** Display format for `timestamp`. Default `'datetime'`. */
  timestampFormat?: TimelineTimestampFormat | undefined;
  /** Reference time used when `timestampFormat="relative"` (for deterministic SSR/tests). */
  relativeNow?: Date | undefined;
  /** Custom formatted timestamp override when `timestamp` is omitted or pre-formatted. */
  timestampLabel?: ReactNode | undefined;
  /** Semantic tone paired with a default icon (never colour alone). Default `'neutral'`. */
  tone?: TimelineTone | undefined;
  /** Custom icon inside the timeline node marker. */
  icon?: IconDefinition | undefined;
  /** Optional actor name / avatar summary (who performed the action). */
  actor?: ReactNode | undefined;
  /** Optional status pill or badge displayed beside the title. */
  badge?: ReactNode | undefined;
  /** Optional secondary metadata (e.g. `<Code>` system code or `<Ltr>` IP address). */
  meta?: ReactNode | undefined;
  /** Optional nested detail block (e.g. `KeyValueList` or `DiffView`). */
  details?: ReactNode | undefined;
  /** Optional action buttons for this event. */
  actions?: ReactNode | undefined;
  /** Plain-text label for `ActivityList` keyboard typeahead and accessibility. */
  textValue?: string | undefined;
  /** Disables row interaction in `ActivityList`. */
  isDisabled?: boolean | undefined;
}

const DEFAULT_TONE_ICON: Record<TimelineTone, IconDefinition> = {
  neutral: iconClock,
  accent: iconClock,
  info: iconInfo,
  success: iconSuccess,
  warning: iconWarning,
  danger: iconError,
};

function toIsoDateTime(value: DateInput | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : value.toISOString();
  if (typeof value === 'number') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
  }
  if (typeof value === 'string') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : d.toISOString();
  }
  return undefined;
}

function formatTimelineTimestamp(
  timestamp: DateInput | undefined,
  format: TimelineTimestampFormat,
  relativeNow?: Date,
): string | undefined {
  if (timestamp === undefined) return undefined;
  if (format === 'date') return formatDate(timestamp);
  if (format === 'relative') return formatRelative(timestamp, relativeNow);
  return formatDateTime(timestamp);
}

function TimelineBody({
  title,
  description,
  timestamp,
  timestampFormat = 'datetime',
  relativeNow,
  timestampLabel,
  tone = 'neutral',
  icon,
  actor,
  badge,
  meta,
  details,
  actions,
}: TimelineEntry) {
  const resolvedIcon = icon ?? DEFAULT_TONE_ICON[tone];
  const formattedTime = timestampLabel ?? formatTimelineTimestamp(timestamp, timestampFormat, relativeNow);
  const iso = toIsoDateTime(timestamp);

  return (
    <>
      <div className={cx(styles.rail)} aria-hidden="true">
        <span className={cx(styles.marker)} data-tone={tone}>
          <Icon icon={resolvedIcon} size="sm" />
        </span>
        <span className={cx(styles.connector)} />
      </div>
      <div className={cx(styles.content)}>
        <div className={cx(styles.header)}>
          <div className={cx(styles.titleRow)}>
            <span className={cx(styles.title)}>{title}</span>
            {badge}
          </div>
          {formattedTime !== undefined && formattedTime !== null && (
            <time className={cx(styles.timestamp)} {...(iso ? { dateTime: iso } : {})}>
              {formattedTime}
            </time>
          )}
        </div>
        {description !== undefined && description !== null && (
          <p className={cx(styles.description)}>{description}</p>
        )}
        {(actor !== undefined || meta !== undefined) && (
          <div className={cx(styles.metaRow)}>
            {actor !== undefined && actor !== null && (
              <span className={cx(styles.actor)}>{actor}</span>
            )}
            {meta !== undefined && meta !== null && <span>{meta}</span>}
          </div>
        )}
        {details !== undefined && details !== null && (
          <div className={cx(styles.details)}>{details}</div>
        )}
        {actions !== undefined && actions !== null && (
          <div className={cx(styles.actions)}>{actions}</div>
        )}
      </div>
    </>
  );
}

export interface TimelineItemProps extends Omit<TimelineEntry, 'id' | 'textValue' | 'isDisabled'> {
  className?: string | undefined;
  ref?: Ref<HTMLLIElement> | undefined;
}

/** Single chronological event row inside `<Timeline>`. */
export function TimelineItem({ className, ref, ...entry }: TimelineItemProps) {
  return (
    <li
      ref={ref}
      data-nds="TimelineItem"
      data-tone={entry.tone ?? 'neutral'}
      className={cx(styles.item, className)}
    >
      <TimelineBody {...entry} />
    </li>
  );
}

export interface TimelineProps {
  /** Declarative array of chronological entries (alternative to `<TimelineItem>` children). */
  items?: readonly TimelineEntry[] | undefined;
  /** Vertical spacing density. Default `'comfortable'`. */
  density?: TimelineDensity | undefined;
  /** Renders loading skeleton placeholders with `aria-busy="true"`. */
  isLoading?: boolean | undefined;
  /** Number of skeleton items shown when `isLoading` is true. Default `3`. */
  loadingCount?: number | undefined;
  /** Custom empty view when `items` is empty and no children are provided. */
  emptyState?: ReactNode | undefined;
  /** Accessible label for the chronological list. Defaults to `messages.timelineLabel`. */
  'aria-label'?: string | undefined;
  'aria-labelledby'?: string | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLOListElement> | undefined;
}

/**
 * Semantic chronological `<ol>` timeline for activations, audit trails, and editorial revisions
 * with Jalali timestamps (Asia/Tehran) and tone icons (never colour alone).
 */
export function Timeline({
  items,
  density = 'comfortable',
  isLoading = false,
  loadingCount = 3,
  emptyState,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  className,
  ref,
}: TimelineProps) {
  const m = useNdsMessages();
  const resolvedLabel = ariaLabelledBy ? undefined : (ariaLabel ?? m.timelineLabel);

  if (isLoading) {
    const placeholders = Array.from({ length: Math.max(1, loadingCount) }, (_, i) => i + 1);
    return (
      <div
        role="status"
        data-nds="Timeline"
        data-loading="true"
        aria-busy="true"
        aria-label={resolvedLabel}
        className={cx(styles.loading, className)}
      >
        {placeholders.map((slot) => (
          <Skeleton key={`tl-sk-${slot}`} variant="text" lines={2} />
        ))}
      </div>
    );
  }

  const isEmpty = items !== undefined && items.length === 0 && children === undefined;
  if (isEmpty) {
    return (
      <div data-nds="Timeline" data-empty="true" className={cx(className)}>
        {emptyState ?? <EmptyState icon={iconClock} title={m.timelineEmptyTitle} size="sm" />}
      </div>
    );
  }

  return (
    <ol
      ref={ref}
      {...(resolvedLabel !== undefined ? { 'aria-label': resolvedLabel } : {})}
      {...(ariaLabelledBy !== undefined ? { 'aria-labelledby': ariaLabelledBy } : {})}
      data-nds="Timeline"
      data-density={density}
      className={cx(styles.root, className)}
    >
      {items?.map((entry, index) => (
        <TimelineItem
          key={entry.id !== undefined ? String(entry.id) : `timeline-${index}`}
          {...entry}
        />
      ))}
      {children}
    </ol>
  );
}

export interface ActivityListItemProps extends TimelineEntry {
  /** Required unique key within `<ActivityList>`. */
  id: Key;
  /** Optional link target when the row navigates to a detail page. */
  href?: string | undefined;
  /** Optional action callback triggered on row click / Enter. */
  onAction?: (() => void) | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/** Keyboard-navigable interactive activity row inside `<ActivityList>` (React Aria `GridListItem`). */
export function ActivityListItem({
  id,
  href,
  onAction,
  isDisabled,
  textValue,
  className,
  ref,
  ...entry
}: ActivityListItemProps) {
  const resolvedTextValue =
    textValue ?? (typeof entry.title === 'string' ? entry.title : String(id));

  return (
    <RacGridListItem
      ref={ref}
      id={id}
      textValue={resolvedTextValue}
      {...(href !== undefined ? { href } : {})}
      {...(onAction !== undefined ? { onAction } : {})}
      {...(isDisabled !== undefined ? { isDisabled } : {})}
      data-nds="ActivityListItem"
      data-tone={entry.tone ?? 'neutral'}
      className={cx(styles.item, styles.itemInteractive, className)}
    >
      <TimelineBody {...entry} />
    </RacGridListItem>
  );
}

export interface ActivityListProps {
  /** Declarative list of activity entries (alternative to `<ActivityListItem>` children). */
  items?: readonly (TimelineEntry & { id: Key; href?: string | undefined })[] | undefined;
  /** Row selection mode. Default `'none'`. */
  selectionMode?: 'none' | 'single' | 'multiple' | undefined;
  selectedKeys?: 'all' | Iterable<Key> | undefined;
  defaultSelectedKeys?: 'all' | Iterable<Key> | undefined;
  onSelectionChange?: ((keys: Selection) => void) | undefined;
  disabledKeys?: Iterable<Key> | undefined;
  /** Called when an item is activated (click or Enter). */
  onAction?: ((key: Key) => void) | undefined;
  density?: TimelineDensity | undefined;
  isLoading?: boolean | undefined;
  loadingCount?: number | undefined;
  emptyState?: ReactNode | undefined;
  'aria-label'?: string | undefined;
  'aria-labelledby'?: string | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Interactive activity feed built on React Aria `GridList` for audit logs, activation feeds,
 * and revision lists requiring keyboard arrow navigation, selection, or row actions.
 */
export function ActivityList({
  items,
  selectionMode = 'none',
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  disabledKeys,
  onAction,
  density = 'comfortable',
  isLoading = false,
  loadingCount = 3,
  emptyState,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  className,
  ref,
}: ActivityListProps) {
  const m = useNdsMessages();
  const resolvedLabel = ariaLabelledBy ? undefined : (ariaLabel ?? m.timelineLabel);

  if (isLoading) {
    const placeholders = Array.from({ length: Math.max(1, loadingCount) }, (_, i) => i + 1);
    return (
      <div
        role="status"
        data-nds="ActivityList"
        data-loading="true"
        aria-busy="true"
        aria-label={resolvedLabel}
        className={cx(styles.loading, className)}
      >
        {placeholders.map((slot) => (
          <Skeleton key={`al-sk-${slot}`} variant="text" lines={2} />
        ))}
      </div>
    );
  }

  const renderEmpty = () =>
    emptyState ?? <EmptyState icon={iconClock} title={m.timelineEmptyTitle} size="sm" />;

  return (
    <RacGridList
      ref={ref}
      selectionMode={selectionMode}
      {...(selectedKeys !== undefined ? { selectedKeys } : {})}
      {...(defaultSelectedKeys !== undefined ? { defaultSelectedKeys } : {})}
      {...(onSelectionChange !== undefined ? { onSelectionChange } : {})}
      {...(disabledKeys !== undefined ? { disabledKeys } : {})}
      {...(onAction !== undefined ? { onAction } : {})}
      {...(resolvedLabel !== undefined ? { 'aria-label': resolvedLabel } : {})}
      {...(ariaLabelledBy !== undefined ? { 'aria-labelledby': ariaLabelledBy } : {})}
      renderEmptyState={renderEmpty}
      data-nds="ActivityList"
      data-density={density}
      className={cx(styles.root, className)}
    >
      {items
        ? items.map((entry) => <ActivityListItem key={String(entry.id)} {...entry} />)
        : children}
    </RacGridList>
  );
}
