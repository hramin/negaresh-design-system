import { Heading, Stack, Text } from '@negaresh/react';
import { createFileRoute, Link } from '@tanstack/react-router';
import styles from '../../components/Page.module.css';
import { TableWrap } from '../../components/TableWrap.tsx';
import { CHART_DOCS } from '../../docs/charts/registry.tsx';
import { PRODUCT_NAMES, STATUS_NAMES } from '../../docs/labels.ts';

export const Route = createFileRoute('/charts/')({
  head: () => ({ meta: [{ title: 'نمودارها · دیزاین سیستم نگرش' }] }),
  component: ChartsIndex,
});

function ChartsIndex() {
  return (
    <article className={styles.page}>
      <Stack gap="3">
        <Heading level={1}>نمودارها (@negaresh/charts)</Heading>
        <Text as="p" size="lg" tone="muted" leading="text" measure>
          نمودارهای SVG سرورمحور بر پایهٔ d3-scale و d3-shape بدون وابستگی به DOM؛ خوانا با
          جاوااسکریپت غیرفعال، همراه با جدول جایگزین، ارقام فارسی و الگوهای مناسب چاپ سیاه‌وسفید.
        </Text>
      </Stack>
      <TableWrap label="جدول نمودارها">
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
            {CHART_DOCS.map((d) => (
              <tr key={d.slug}>
                <th scope="row">
                  <Link to="/charts/$slug" params={{ slug: d.slug }} className={styles.link}>
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
