import { Heading, Stack, Text } from '@negaresh/react';
import { createFileRoute } from '@tanstack/react-router';
import styles from '../../components/Page.module.css';
import { ASSESSMENT_CATALOG } from '../../docs/catalog.ts';
import { CatalogIndexTable } from '../../docs/CatalogIndexTable.tsx';

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
      <CatalogIndexTable
        items={ASSESSMENT_CATALOG}
        routeTo="/assessment/$slug"
        tableLabel="جدول کامپوننت‌های کیت ارزیابی"
      />
    </article>
  );
}
