import { Heading, Stack, Text } from '@negaresh/react';
import { createFileRoute } from '@tanstack/react-router';
import styles from '../../components/Page.module.css';
import { CHART_CATALOG } from '../../docs/catalog.ts';
import { CatalogIndexTable } from '../../docs/CatalogIndexTable.tsx';

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
      <CatalogIndexTable
        items={CHART_CATALOG}
        routeTo="/charts/$slug"
        tableLabel="جدول نمودارها"
      />
    </article>
  );
}
