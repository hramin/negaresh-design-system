import { Heading, Stack, Text } from '@negaresh/react';
import { createFileRoute, Link } from '@tanstack/react-router';
import styles from '../../components/Page.module.css';
import { TableWrap } from '../../components/TableWrap.tsx';
import { ASSESSMENT_DOCS } from '../../docs/assessment/registry.tsx';
import { PRODUCT_NAMES, STATUS_NAMES } from '../../docs/labels.ts';

export const Route = createFileRoute('/assessment/')({
  head: () => ({ meta: [{ title: 'کیت ارزیابی و آزمون · دیزاین سیستم نگرش' }] }),
  component: AssessmentIndex,
});

function AssessmentIndex() {
  return (
    <article className={styles.page}>
      <Stack gap="3">
        <Heading level={1}>کیت ارزیابی و آزمون (@negaresh/assessment)</Heading>
        <Text as="p" size="lg" tone="muted" leading="text" measure>
          مجموعهٔ کامل جریان آزمون و گزارش‌دهی بر پایهٔ `@negaresh/react` و `@negaresh/charts`:
          پرسش‌های دسترس‌پذیر، اعتبارسنجی صفحه‌به‌صفحه، فرم جمعیت‌شناختی شمسی، نمایش دوگانهٔ حرفه‌ای و
          آرام (MMPI-Teen-13 و Wellbeing-8) و چیدمان هم‌ارز چاپ A4 / PDF.
        </Text>
      </Stack>
      <TableWrap label="جدول کامپوننت‌های کیت ارزیابی">
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
            {ASSESSMENT_DOCS.map((d) => (
              <tr key={d.slug}>
                <th scope="row">
                  <Link to="/assessment/$slug" params={{ slug: d.slug }} className={styles.link}>
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
