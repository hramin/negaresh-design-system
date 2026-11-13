import { createFileRoute } from '@tanstack/react-router';
import type { CSSProperties } from 'react';
import { CopyButton } from '../components/CopyButton.tsx';
import { TableWrap } from '../components/TableWrap.tsx';
import styles from '../components/Page.module.css';
import { cssTokens, type TokenEntry, tsPath } from '../lib/tokens.ts';
import { formatNumber } from '@negaresh/utils';

export const Route = createFileRoute('/tokens')({
  head: () => ({ meta: [{ title: 'توکن‌ها · دیزاین سیستم نگرش' }] }),
  component: TokensPage,
});

interface Group {
  id: string;
  title: string;
  match: (t: TokenEntry) => boolean;
  sample?: (t: TokenEntry) => CSSProperties & { className: string | undefined };
}

const GROUPS: Group[] = [
  {
    id: 'color',
    title: 'رنگ‌های معنایی',
    match: (t) => t.type === 'color' && t.tier === 'semantic',
    sample: (t) => ({ className: styles.swatch, background: `var(${t.cssVar})` }),
  },
  { id: 'typography', title: 'تایپوگرافی', match: (t) => t.path.startsWith('font.') },
  {
    id: 'space',
    title: 'فاصله',
    match: (t) => t.path.startsWith('space.'),
    sample: (t) => ({ className: styles.bar, inlineSize: `var(${t.cssVar})` }),
  },
  {
    id: 'shape',
    title: 'شکل',
    match: (t) => /^(radius|border|shadow)\./.test(t.path),
    sample: (t) =>
      t.path.startsWith('radius.')
        ? { className: styles.radiusSample, borderRadius: `var(${t.cssVar})` }
        : { className: '' },
  },
  { id: 'size', title: 'اندازه و نقطه‌ی شکست', match: (t) => /^(size|breakpoint)\./.test(t.path) },
  { id: 'motion', title: 'حرکت', match: (t) => /^(duration|easing)\./.test(t.path) },
  { id: 'z', title: 'لایه (z-index)', match: (t) => t.path.startsWith('z.') },
  { id: 'component', title: 'پیش‌فرض‌های کامپوننت', match: (t) => t.tier === 'component' },
];

function TokensPage() {
  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>توکن‌ها</h1>
        <p className={styles.lead}>
          {formatNumber(cssTokens.length)} متغیر CSS که از{' '}
          <span className={styles.code}>{'tokens/**/*.tokens.json'}</span> ساخته می‌شوند. کامپوننت‌ها
          فقط توکن‌های معنایی و پیش‌فرض‌های کامپوننت را می‌خوانند؛ مقدار خام هرگز.
        </p>
        <nav aria-label="گروه‌های توکن">
          <ul className={styles.toc}>
            {GROUPS.map((g) => (
              <li key={g.id}>
                <a href={`#${g.id}`}>{g.title}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      {GROUPS.map((g) => (
        <TokenGroup key={g.id} group={g} />
      ))}
    </article>
  );
}

function TokenGroup({ group }: { group: Group }) {
  const list = cssTokens.filter(group.match);
  const modal = list.some((t) => t.modal);
  return (
    <section className={styles.section} aria-labelledby={group.id}>
      <h2 id={group.id} className={styles.h2}>
        {group.title}
      </h2>
      <TableWrap label={`جدول ${group.title}`} desktopOnly>
        <table className={styles.table}>
          <thead>
            <tr>
              {group.sample && <th scope="col">نمونه</th>}
              <th scope="col">متغیر CSS</th>
              <th scope="col">نام در TS</th>
              <th scope="col">{modal ? 'روشن' : 'مقدار'}</th>
              {modal && <th scope="col">تیره</th>}
            </tr>
          </thead>
          <tbody>
            {list.map((t) => {
              const sample = group.sample?.(t);
              const { className, ...style } = sample ?? { className: '' };
              return (
                <tr key={t.path}>
                  {group.sample && (
                    <td>{className && <span className={className} style={style} />}</td>
                  )}
                  <th scope="row">
                    <span className={styles.cellActions}>
                      <code className={styles.code}>{t.cssVar}</code>
                      <CopyButton value={`var(${t.cssVar})`} label="کپی" done="کپی شد" />
                    </span>
                  </th>
                  <td>
                    <code className={styles.code}>{tsPath(t.path)}</code>
                  </td>
                  <td>
                    <code className={styles.code}>{t.value.light}</code>
                    {t.description && (
                      <div className={styles.muted} lang="en" dir="ltr">
                        {t.description}
                      </div>
                    )}
                  </td>
                  {modal && (
                    <td>
                      <code className={styles.code}>{t.value.dark}</code>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableWrap>
      <ul className={`${styles.cards} ${styles.mobileOnly}`}>
        {list.map((t) => {
          const sample = group.sample?.(t);
          const { className, ...style } = sample ?? { className: '' };
          return (
            <li key={t.path} className={styles.card}>
              <div className={styles.cardHead}>
                {className && <span className={className} style={style} />}
                <code className={styles.code}>{t.cssVar}</code>
                <CopyButton value={`var(${t.cssVar})`} label="کپی" done="کپی شد" />
              </div>
              <div className={styles.cardRow}>
                <span className={styles.label}>نام در TS</span>
                <code className={styles.code}>{tsPath(t.path)}</code>
              </div>
              <div className={styles.cardRow}>
                <span className={styles.label}>{modal ? 'روشن' : 'مقدار'}</span>
                <code className={styles.code}>{t.value.light}</code>
              </div>
              {modal && (
                <div className={styles.cardRow}>
                  <span className={styles.label}>تیره</span>
                  <code className={styles.code}>{t.value.dark}</code>
                </div>
              )}
              {t.description && (
                <p className={styles.muted} lang="en" dir="ltr">
                  {t.description}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
