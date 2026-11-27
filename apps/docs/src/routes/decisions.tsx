import {
  Badge,
  EmptyState,
  Heading,
  Inline,
  InlineAlert,
  SearchField,
  Text,
} from '@negaresh/react';
import { formatNumber } from '@negaresh/utils';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import styles from '../components/Page.module.css';
import { TableWrap } from '../components/TableWrap.tsx';
import { DECISIONS_DATA, type DecisionRow } from '../lib/decisions.ts';
import fStyles from './foundations/foundations.module.css';

export const Route = createFileRoute('/decisions')({
  head: () => ({ meta: [{ title: 'تصمیم‌های معماری و طراحی · دیزاین سیستم نگرش' }] }),
  component: DecisionsPage,
});

function matchesQuery(q: string, ...fields: string[]): boolean {
  if (!q) return true;
  const hay = fields.join(' ').toLowerCase();
  return hay.includes(q);
}

function DecisionTable({
  id,
  title,
  rows,
}: {
  id: string;
  title: string;
  rows: readonly DecisionRow[];
}) {
  return (
    <section className={styles.section} aria-labelledby={id}>
      <Heading level={2} id={id}>
        {title} ({formatNumber(rows.length)})
      </Heading>
      <TableWrap label={title} desktopOnly>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">شماره</th>
              <th scope="col">تصمیم</th>
              <th scope="col">پیامد برای NDS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <th scope="row">
                  <code className={styles.code}>{r.id}</code>
                </th>
                <td dir="ltr" lang="en">
                  {r.decision}
                </td>
                <td className={styles.muted} dir="ltr" lang="en">
                  {r.consequence}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>
      <ul className={`${styles.cards} ${styles.mobileOnly}`}>
        {rows.map((r) => (
          <li key={r.id} className={styles.card}>
            <code className={styles.code}>{r.id}</code>
            <p dir="ltr" lang="en">
              {r.decision}
            </p>
            <p className={styles.muted} dir="ltr" lang="en">
              {r.consequence}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DecisionsPage() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const inherited = useMemo(
    () => DECISIONS_DATA.inherited.filter((r) => matchesQuery(q, r.id, r.decision, r.consequence)),
    [q],
  );
  const nds = useMemo(
    () => DECISIONS_DATA.nds.filter((r) => matchesQuery(q, r.id, r.decision, r.consequence)),
    [q],
  );
  const openQuestions = useMemo(
    () =>
      DECISIONS_DATA.openQuestions.filter((r) =>
        matchesQuery(q, r.id, r.question, r.defaultPolicy),
      ),
    [q],
  );

  const totalMatches = inherited.length + nds.length + openQuestions.length;

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <Inline gap="2" align="center">
          <Badge tone="neutral" size="sm">
            docs/01-decisions.md
          </Badge>
          <Badge tone="accent" size="sm">
            {formatNumber(DECISIONS_DATA.inherited.length + DECISIONS_DATA.nds.length)} تصمیم الزام‌آور
          </Badge>
        </Inline>
        <Heading level={1}>تصمیم‌های معماری و طراحی</Heading>
        <Text as="p" size="lg" tone="muted" leading="text" measure>
          خوانده‌شده به‌صورت مستقیم از <code className={styles.code}>docs/01-decisions.md</code> تا
          سند مرجع و سایت مستندات همواره همگام بمانند.
        </Text>
      </header>

      <div className={fStyles.filterRow}>
        <div className={fStyles.filterGrow}>
          <SearchField
            label="جست‌وجو در تصمیم‌ها و پرسش‌های باز"
            placeholder="مثلاً D-93، D-77، Toman، Keycloak، Q-01…"
            value={query}
            onChange={setQuery}
          />
        </div>
        <Badge tone="neutral" size="sm">
          {formatNumber(totalMatches)} مورد
        </Badge>
      </div>

      {totalMatches === 0 ? (
        <EmptyState
          title="تصمیمی با این عبارت یافت نشد"
          description="شمارهٔ تصمیم (مانند D-85) یا کلیدواژهٔ دیگری وارد کنید."
        />
      ) : (
        <>
          {nds.length > 0 && <DecisionTable id="nds-decisions" title="تصمیم‌های NDS" rows={nds} />}
          {inherited.length > 0 && (
            <DecisionTable
              id="inherited-decisions"
              title="تصمیم‌های ارث‌بری‌شده و همچنان الزام‌آور"
              rows={inherited}
            />
          )}
          {DECISIONS_DATA.supersededNote && !q && (
            <InlineAlert tone="info" title="تصمیم‌های جایگزین‌شده">
              <span dir="ltr" lang="en">
                {DECISIONS_DATA.supersededNote}
              </span>
            </InlineAlert>
          )}
          {openQuestions.length > 0 && (
            <section className={styles.section} aria-labelledby="open-questions">
              <Heading level={2} id="open-questions">
                پرسش‌های باز ({formatNumber(openQuestions.length)})
              </Heading>
              <TableWrap label="جدول پرسش‌های باز" desktopOnly>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">شماره</th>
                      <th scope="col">پرسش</th>
                      <th scope="col">پیش‌فرض تا زمان پاسخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openQuestions.map((row) => (
                      <tr key={row.id}>
                        <th scope="row">
                          <code className={styles.code}>{row.id}</code>
                        </th>
                        <td dir="ltr" lang="en">
                          {row.question}
                        </td>
                        <td className={styles.muted} dir="ltr" lang="en">
                          {row.defaultPolicy}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrap>
              <ul className={`${styles.cards} ${styles.mobileOnly}`}>
                {openQuestions.map((row) => (
                  <li key={row.id} className={styles.card}>
                    <code className={styles.code}>{row.id}</code>
                    <p dir="ltr" lang="en">
                      {row.question}
                    </p>
                    <p className={styles.muted} dir="ltr" lang="en">
                      {row.defaultPolicy}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </article>
  );
}
