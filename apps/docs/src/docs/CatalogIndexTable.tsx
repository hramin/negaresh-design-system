import { Badge, Inline, Text } from '@negaresh/react';
import { Link } from '@tanstack/react-router';
import styles from '../components/Page.module.css';
import { TableWrap } from '../components/TableWrap.tsx';
import type { CatalogDocItem } from './catalog.ts';
import { PRODUCT_NAMES, STATUS_NAMES } from './labels.ts';

function statusTone(status: CatalogDocItem['status']): 'success' | 'info' | 'warning' | 'neutral' {
  if (status === 'approved') return 'success';
  if (status === 'review') return 'info';
  if (status === 'building') return 'warning';
  return 'neutral';
}

/** Shared responsive table + mobile stacked cards for component/chart/assessment/pattern indexes. */
export function CatalogIndexTable({
  items,
  routeTo,
  tableLabel,
  symbolColumnLabel = 'کامپوننت‌ها',
}: {
  items: readonly CatalogDocItem[];
  routeTo: '/components/$slug' | '/charts/$slug' | '/assessment/$slug' | '/patterns/$slug';
  tableLabel: string;
  symbolColumnLabel?: string;
}) {
  return (
    <>
      <TableWrap label={tableLabel} desktopOnly>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">صفحه</th>
              <th scope="col">{symbolColumnLabel}</th>
              <th scope="col">وضعیت</th>
              <th scope="col">محصولات</th>
            </tr>
          </thead>
          <tbody>
            {items.map((d) => (
              <tr key={d.slug}>
                <th scope="row">
                  <Link to={routeTo} params={{ slug: d.slug }} className={styles.link}>
                    {d.title}
                  </Link>
                </th>
                <td>
                  <span className={styles.codeWrap}>{d.components.join(', ')}</span>
                </td>
                <td>
                  <Badge tone={statusTone(d.status)} size="sm">
                    {STATUS_NAMES[d.status]}
                  </Badge>
                </td>
                <td>
                  <Inline gap="1">
                    {d.products.map((p) => (
                      <Badge key={p} tone="neutral" size="sm">
                        {PRODUCT_NAMES[p]}
                      </Badge>
                    ))}
                  </Inline>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>

      <ul className={`${styles.cards} ${styles.mobileOnly}`}>
        {items.map((d) => (
          <li key={d.slug} className={styles.card}>
            <div className={styles.cardRow}>
              <Link to={routeTo} params={{ slug: d.slug }} className={styles.link}>
                {d.title}
              </Link>
              <Badge tone={statusTone(d.status)} size="sm">
                {STATUS_NAMES[d.status]}
              </Badge>
            </div>
            <Text size="xs" tone="muted">
              <span className={styles.codeWrap}>{d.components.join(' · ')}</span>
            </Text>
            <Inline gap="1">
              {d.products.map((p) => (
                <Badge key={p} tone="neutral" size="sm">
                  {PRODUCT_NAMES[p]}
                </Badge>
              ))}
            </Inline>
          </li>
        ))}
      </ul>
    </>
  );
}
