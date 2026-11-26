import { iconChevronEnd, iconChevronStart } from '@negaresh/icons';
import { formatNumber } from '@negaresh/utils';
import type { ReactNode, Ref } from 'react';
import { Button as RacButton, Link as RacLink } from 'react-aria-components';
import { Button, LinkButton } from '../Button/Button.tsx';
import { Icon } from '../Icon/Icon.tsx';
import { cx } from '../internal/cx.ts';
import { useNdsMessages } from '../ThemeProvider/ThemeProvider.tsx';
import styles from './Pagination.module.css';

type PageToken = number | 'ellipsis-start' | 'ellipsis-end';

function buildPageRange(
  page: number,
  totalPages: number,
  siblingCount: number,
  boundaryCount: number,
): PageToken[] {
  const totalNumbers = boundaryCount * 2 + siblingCount * 2 + 3;
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const startPages = Array.from({ length: boundaryCount }, (_, i) => i + 1);
  const endPages = Array.from(
    { length: boundaryCount },
    (_, i) => totalPages - boundaryCount + 1 + i,
  );

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, totalPages - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    totalPages - boundaryCount - 1,
  );

  const tokens: PageToken[] = [...startPages];

  if (siblingsStart > boundaryCount + 2) {
    tokens.push('ellipsis-start');
  } else if (boundaryCount + 1 < totalPages - boundaryCount) {
    tokens.push(boundaryCount + 1);
  }

  for (let i = siblingsStart; i <= siblingsEnd; i += 1) {
    tokens.push(i);
  }

  if (siblingsEnd < totalPages - boundaryCount - 1) {
    tokens.push('ellipsis-end');
  } else if (totalPages - boundaryCount > boundaryCount) {
    tokens.push(totalPages - boundaryCount);
  }

  tokens.push(...endPages);
  return tokens;
}

export interface PaginationProps {
  /** Current 1-based page number. */
  page: number;
  /** Total number of pages (must be ≥ 1). */
  totalPages: number;
  /** Builds a server-rendered URL for a page number (enables SSR & JS-disabled navigation). */
  getPageHref?: ((page: number) => string) | undefined;
  /** Callback when the user selects a new page. */
  onPageChange?: ((page: number) => void) | undefined;
  /** Number of sibling pages around the current page. Default `1`. */
  siblingCount?: number | undefined;
  /** Number of boundary pages at start and end. Default `1`. */
  boundaryCount?: number | undefined;
  /** Show «صفحهٔ n از N» summary beside the list on desktop. Default `false`. */
  showSummary?: boolean | undefined;
  /** Accessible landmark name (defaults to `messages.paginationLabel`). */
  'aria-label'?: string | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLElement> | undefined;
}

/**
 * Server-rendered or client-controlled pagination with Persian digits (`formatNumber`),
 * logical RTL prev/next chevrons, ≥ 44 × 44 px targets, and compact mobile summary.
 */
export function Pagination({
  page,
  totalPages,
  getPageHref,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  showSummary = false,
  'aria-label': ariaLabel,
  className,
  ref,
}: PaginationProps) {
  const m = useNdsMessages();
  const safeTotal = Math.max(1, Math.floor(totalPages));
  const safePage = Math.min(safeTotal, Math.max(1, Math.floor(page)));
  const tokens = buildPageRange(safePage, safeTotal, siblingCount, boundaryCount);
  const prevDisabled = safePage <= 1;
  const nextDisabled = safePage >= safeTotal;

  const renderControl = ({
    targetPage,
    label,
    content,
    isCurrent = false,
    isDisabled = false,
    isNav = false,
  }: {
    targetPage: number;
    label: string;
    content: ReactNode;
    isCurrent?: boolean;
    isDisabled?: boolean;
    isNav?: boolean;
  }) => {
    const href = !isDisabled && !isCurrent && getPageHref ? getPageHref(targetPage) : undefined;

    if (href !== undefined) {
      return (
        <RacLink
          href={href}
          aria-label={label}
          {...(onPageChange ? { onPress: () => onPageChange(targetPage) } : {})}
          data-nds="PaginationItem"
          data-nav={isNav ? 'true' : undefined}
          className={cx(styles.control)}
        >
          {content}
        </RacLink>
      );
    }

    return (
      <RacButton
        type="button"
        aria-label={label}
        isDisabled={isDisabled}
        {...(isCurrent ? { 'aria-current': 'page' as const } : {})}
        onPress={() => {
          if (!isDisabled && !isCurrent) onPageChange?.(targetPage);
        }}
        data-nds="PaginationItem"
        data-current={isCurrent ? 'true' : undefined}
        data-nav={isNav ? 'true' : undefined}
        className={cx(styles.control)}
      >
        {content}
      </RacButton>
    );
  };

  return (
    <nav
      ref={ref}
      aria-label={ariaLabel ?? m.paginationLabel}
      data-nds="Pagination"
      className={cx(styles.nav, className)}
    >
      <ul className={cx(styles.list)}>
        <li className={cx(styles.entry)}>
          {renderControl({
            targetPage: Math.max(1, safePage - 1),
            label: m.paginationPrevious,
            isDisabled: prevDisabled,
            isNav: true,
            content: (
              <>
                <Icon icon={iconChevronStart} size="sm" />
                <span className={cx(styles.navLabel)}>{m.paginationPrevious}</span>
              </>
            ),
          })}
        </li>

        <li className={cx(styles.entry)}>
          <span className={cx(styles.mobileSummary)} aria-hidden="true">
            {m.paginationPageOf(safePage, safeTotal)}
          </span>
        </li>

        {tokens.map((token) => {
          if (token === 'ellipsis-start' || token === 'ellipsis-end') {
            return (
              <li key={token} className={cx(styles.entry, styles.pageEntry)} aria-hidden="true">
                <span className={cx(styles.ellipsis)}>…</span>
              </li>
            );
          }

          const isCurrent = token === safePage;
          return (
            <li key={token} className={cx(styles.entry, styles.pageEntry)}>
              {renderControl({
                targetPage: token,
                label: m.paginationPage(token),
                isCurrent,
                content: formatNumber(token, { maximumFractionDigits: 0 }),
              })}
            </li>
          );
        })}

        <li className={cx(styles.entry)}>
          {renderControl({
            targetPage: Math.min(safeTotal, safePage + 1),
            label: m.paginationNext,
            isDisabled: nextDisabled,
            isNav: true,
            content: (
              <>
                <span className={cx(styles.navLabel)}>{m.paginationNext}</span>
                <Icon icon={iconChevronEnd} size="sm" />
              </>
            ),
          })}
        </li>
      </ul>

      {showSummary && (
        <p className={cx(styles.summary)}>{m.paginationPageOf(safePage, safeTotal)}</p>
      )}
    </nav>
  );
}

export interface LoadMoreProps {
  /** Number of items currently shown. */
  loaded: number;
  /** Total available items. */
  total: number;
  /** Optional server-rendered URL for the next page (progressive enhancement / SSR). */
  href?: string | undefined;
  /** Client callback to load the next batch of items. */
  onLoadMore?: (() => void) | undefined;
  /** Shows pending spinner state on the action button. */
  isLoading?: boolean | undefined;
  /** Custom button label. Defaults to `messages.loadMore`. */
  label?: ReactNode | undefined;
  /** Show a subtle progress bar reflecting `loaded / total`. Default `true`. */
  showProgress?: boolean | undefined;
  className?: string | undefined;
  ref?: Ref<HTMLDivElement> | undefined;
}

/**
 * Progressive list loader with Persian count summary (`formatNumber`), optional hairline progress
 * indicator, SSR `LinkButton` fallback, and polite live-region updates.
 */
export function LoadMore({
  loaded,
  total,
  href,
  onLoadMore,
  isLoading = false,
  label,
  showProgress = true,
  className,
  ref,
}: LoadMoreProps) {
  const m = useNdsMessages();
  const safeTotal = Math.max(0, Math.floor(total));
  const safeLoaded = Math.max(0, Math.min(safeTotal, Math.floor(loaded)));
  const hasMore = safeLoaded < safeTotal;
  const percent = safeTotal > 0 ? Math.min(100, (safeLoaded / safeTotal) * 100) : 100;
  const actionLabel = label ?? m.loadMore;

  return (
    <div ref={ref} data-nds="LoadMore" className={cx(styles.loadMore, className)}>
      <p className={cx(styles.loadMoreStatus)} aria-live="polite">
        {m.loadMoreShowing(safeLoaded, safeTotal)}
      </p>
      {showProgress && safeTotal > 0 && (
        <div className={cx(styles.loadMoreTrack)} aria-hidden="true">
          <span className={cx(styles.loadMoreFill)} style={{ inlineSize: `${percent}%` }} />
        </div>
      )}
      {hasMore &&
        (href !== undefined && !onLoadMore ? (
          <LinkButton href={href} variant="secondary">
            {actionLabel}
          </LinkButton>
        ) : (
          <Button
            variant="secondary"
            isPending={isLoading}
            onPress={() => onLoadMore?.()}
          >
            {actionLabel}
          </Button>
        ))}
    </div>
  );
}
