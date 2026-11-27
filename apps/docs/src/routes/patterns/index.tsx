import { Heading, Stack, Text } from '@negaresh/react';
import { createFileRoute, Link } from '@tanstack/react-router';
import styles from '../../components/Page.module.css';
import { TableWrap } from '../../components/TableWrap.tsx';
import { PRODUCT_NAMES, STATUS_NAMES } from '../../docs/labels.ts';
import { PATTERN_DOCS } from '../../docs/patterns/registry.tsx';

export const Route = createFileRoute('/patterns/')({
  head: () => ({ meta: [{ title: 'الگوهای محصول · دیزاین سیستم نگرش' }] }),
  component: PatternsIndex,
});

function PatternsIndex() {
  return (
    <article className={styles.page}>
      <Stack gap="3">
        <Heading level={1}>الگوهای محصول (@negaresh/patterns)</Heading>
        <Text as="p" size="lg" tone="muted" leading="text" measure>
          ترکیب‌های آماده و تکرارپذیر بر پایهٔ `@negaresh/react` و `@negaresh/utils` برای فروشگاه،
          رجیستری، مجله و متخصصان، دوره‌های آموزشی، پوسته‌های حساب و مدیریت و کارزارهای سازمانی پلتفرم
          آزمون.
        </Text>
      </Stack>
      <TableWrap label="جدول الگوهای محصول">
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">صفحه</th>
              <th scope="col">الگوها</th>
              <th scope="col">وضعیت</th>
              <th scope="col">محصولات</th>
            </tr>
          </thead>
          <tbody>
            {PATTERN_DOCS.map((d) => (
              <tr key={d.slug}>
                <th scope="row">
                  <Link to="/patterns/$slug" params={{ slug: d.slug }} className={styles.link}>
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
