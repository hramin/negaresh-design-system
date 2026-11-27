import { Badge, Button, EmptyState, Heading, Inline, SearchField, Text } from '@negaresh/react';
import { formatNumber } from '@negaresh/utils';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { type FormEvent, useEffect, useState } from 'react';
import styles from '../components/Page.module.css';
import { searchDocs } from '../lib/search.ts';
import fStyles from './foundations/foundations.module.css';

export const Route = createFileRoute('/search')({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === 'string' ? search.q : '',
  }),
  head: () => ({ meta: [{ title: 'جست‌وجو · دیزاین سیستم نگرش' }] }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const [input, setInput] = useState(q);
  const navigate = useNavigate();

  useEffect(() => {
    setInput(q);
  }, [q]);

  const activeQuery = input.trim() || q.trim();
  const results = activeQuery ? searchDocs(activeQuery, 60) : [];

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void navigate({ to: '/search', search: { q: input.trim() } });
  };

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <Inline gap="2" align="center">
          <Badge tone="accent" size="sm">
            نرمال‌سازی فارسی (ی/ي · ک/ك · نیم‌فاصله)
          </Badge>
        </Inline>
        <Heading level={1}>جست‌وجو در مستندات نگرش</Heading>
        <Text as="p" size="lg" tone="muted" leading="text" measure>
          جست‌وجو در همهٔ مبانی، توکن‌ها، کامپوننت‌ها، نمودارها، کیت ارزیابی، الگوها، محصولات،
          افزونه‌های برند و تصمیم‌های طراحی — کاملاً سازگار با رندر سرور و حالت بدون جاوااسکریپت.
        </Text>
      </header>

      <form method="get" action="/search" onSubmit={onSubmit} className={fStyles.filterRow}>
        <div className={fStyles.filterGrow}>
          <SearchField
            name="q"
            label="عبارت جست‌وجو"
            placeholder="مثلاً فعال‌سازی، DatePicker، D-93، --nds-accent، روانما…"
            value={input}
            onChange={setInput}
          />
        </div>
        <Button type="submit" variant="primary">
          جست‌وجو
        </Button>
      </form>

      <section className={styles.section} aria-labelledby="search-results-heading">
        <Heading level={2} id="search-results-heading">
          {activeQuery
            ? `نتایج برای «${activeQuery}» (${formatNumber(results.length)})`
            : 'برای جست‌وجو عبارتی وارد کنید'}
        </Heading>

        {activeQuery && results.length === 0 ? (
          <EmptyState
            title="نتیجه‌ای پیدا نشد"
            description="از املای دیگر، نام انگلیسی کامپوننت یا پیشوند --nds-* استفاده کنید."
          />
        ) : (
          <ul className={styles.cards} data-testid="ssr-search-results">
            {results.map((item) => (
              <li key={item.id} className={styles.card}>
                <div className={styles.cardRow}>
                  <Link to={item.to} className={styles.link}>
                    {item.title}
                  </Link>
                  <Badge tone="neutral" size="sm">
                    {item.category}
                  </Badge>
                </div>
                <Text size="sm" tone="muted">
                  {item.summary}
                </Text>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
