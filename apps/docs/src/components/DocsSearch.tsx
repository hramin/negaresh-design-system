import { iconSearch } from '@negaresh/icons';
import { Badge, Dialog, EmptyState, Icon, SearchField, Text } from '@negaresh/react';
import { formatNumber } from '@negaresh/utils';
import { Link, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { m } from '../lib/messages.ts';
import type { SearchResult } from '../lib/search.ts';
import styles from './DocsSearch.module.css';
import pageStyles from './Page.module.css';

const QUICK_SUGGESTIONS = ['فعال‌سازی', 'DatePicker', 'IntervalBar', 'D-93', '--nds-accent', 'روانما'] as const;

/**
 * Topbar Persian search trigger + Ctrl+K / ⌘K accessible Dialog.
 * Dynamically imports the search index on first open so initial route loads stay lean.
 */
export function DocsSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchFn, setSearchFn] = useState<((q: string, limit?: number) => SearchResult[]) | null>(
    null,
  );
  const navigate = useNavigate();

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen || searchFn) return;
    let cancelled = false;
    void import('../lib/search.ts').then((mod) => {
      if (!cancelled) setSearchFn(() => mod.searchDocs);
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen, searchFn]);

  useEffect(() => {
    if (!searchFn || !query.trim()) {
      setResults([]);
      setActiveIndex(0);
      return;
    }
    setResults(searchFn(query, 20));
    setActiveIndex(0);
  }, [query, searchFn]);

  const goToResult = useCallback(
    (item: SearchResult) => {
      setIsOpen(false);
      setQuery('');
      void navigate({ to: item.to });
    },
    [navigate],
  );

  useEffect(() => {
    if (!isOpen || results.length === 0) return;
    const onArrow = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((prev) => (prev + 1) % results.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
      }
    };
    window.addEventListener('keydown', onArrow);
    return () => window.removeEventListener('keydown', onArrow);
  }, [isOpen, results.length]);

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        aria-label={m.search.triggerLabel}
        aria-keyshortcuts="Control+K Meta+K"
        data-testid="docs-search-trigger"
        onClick={openModal}
      >
        <Icon icon={iconSearch} size="sm" />
        <span className={styles.triggerLabel}>جست‌وجو…</span>
        <kbd className={styles.kbd} dir="ltr">
          {m.search.shortcutHint}
        </kbd>
      </button>

      <Dialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={m.search.dialogTitle}
        size="lg"
      >
        <div className={styles.dialogBody}>
          <SearchField
            label={m.search.triggerLabel}
            placeholder={m.search.placeholder}
            value={query}
            onChange={setQuery}
            onSubmit={() => {
              const target = results[activeIndex];
              if (target) goToResult(target);
            }}
            autoFocus
          />

          <div className={styles.statusRow}>
            <span role="status" aria-live="polite" data-testid="docs-search-status">
              {query.trim()
                ? results.length > 0
                  ? `${formatNumber(results.length)} نتیجه پیدا شد`
                  : m.search.noResultsTitle
                : 'عبارت فارسی یا نام انگلیسی کامپوننت، توکن یا تصمیم را وارد کنید.'}
            </span>
            <Link
              to="/search"
              search={{ q: query.trim() }}
              className={pageStyles.link}
              onClick={() => setIsOpen(false)}
            >
              {m.search.allResultsLink}
            </Link>
          </div>

          {!query.trim() ? (
            <div>
              <Text as="p" size="xs" tone="subtle">
                پیشنهادهای سریع:
              </Text>
              <ul className={styles.quickGrid}>
                {QUICK_SUGGESTIONS.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      className={styles.quickChip}
                      onClick={() => setQuery(s)}
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : results.length === 0 ? (
            <EmptyState title={m.search.noResultsTitle} description={m.search.noResultsBody} />
          ) : (
            <ul className={styles.resultsList} aria-label="نتایج جست‌وجو" data-testid="docs-search-results">
              {results.map((item, idx) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={styles.resultItem}
                    data-active={idx === activeIndex ? 'true' : 'false'}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => goToResult(item)}
                  >
                    <div className={styles.resultHead}>
                      <span className={styles.resultTitle}>{item.title}</span>
                      <Badge tone="neutral" size="sm">
                        {item.category}
                      </Badge>
                    </div>
                    <span className={styles.resultSummary}>{item.summary}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Dialog>
    </>
  );
}
