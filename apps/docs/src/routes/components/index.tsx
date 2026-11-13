import { Heading, Stack, Text } from '@negaresh/react';
import { createFileRoute, Link } from '@tanstack/react-router';
import styles from '../../components/Page.module.css';
import { TableWrap } from '../../components/TableWrap.tsx';
import { COMPONENT_DOCS } from '../../docs/registry.tsx';
import { PRODUCT_NAMES, STATUS_NAMES } from '../../docs/labels.ts';

export const Route = createFileRoute('/components/')({
  head: () => ({ meta: [{ title: 'کامپوننت‌ها · دیزاین سیستم نگرش' }] }),
  component: ComponentsIndex,
});

function ComponentsIndex() {
  return (
    <article className={styles.page}>
      <Stack gap="3">
        <Heading level={1}>کامپوننت‌ها</Heading>
        <Text as="p" size="lg" tone="muted" leading="text" measure>
          ساخته‌شده روی React Aria Components با ماژول‌های CSS در لایه‌های آبشاری. هر صفحه همهٔ حالت‌ها،
          ویژگی‌ها، نقشهٔ کیبورد و نکته‌های راست‌به‌چپ را دارد.
        </Text>
      </Stack>
      <TableWrap label="جدول کامپوننت‌ها">
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">صفحه</th>
              <th scope="col">کامپوننت‌ها</th>
              <th scope="col">وضعیت</th>
              <th scope="col">محصولات</th>
            </tr>
          </thead>
          <tbody>
            {COMPONENT_DOCS.map((d) => (
              <tr key={d.slug}>
                <th scope="row">
                  <Link to="/components/$slug" params={{ slug: d.slug }} className={styles.link}>
                    {d.title}
                  </Link>
                </th>
                <td>
                  <span className={styles.codeWrap}>{d.components.join(', ')}</span>
                </td>
                <td>{STATUS_NAMES[d.status]}</td>
                <td>{d.products.map((p) => PRODUCT_NAMES[p]).join('، ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>
    </article>
  );
}
