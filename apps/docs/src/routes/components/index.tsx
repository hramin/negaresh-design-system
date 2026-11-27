import { Heading, Stack, Text } from '@negaresh/react';
import { createFileRoute } from '@tanstack/react-router';
import styles from '../../components/Page.module.css';
import { COMPONENT_CATALOG } from '../../docs/catalog.ts';
import { CatalogIndexTable } from '../../docs/CatalogIndexTable.tsx';

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
          ویژگی‌های استخراج‌شده از TypeScript، نقشهٔ کیبورد و نکته‌های راست‌به‌چپ را دارد.
        </Text>
      </Stack>
      <CatalogIndexTable
        items={COMPONENT_CATALOG}
        routeTo="/components/$slug"
        tableLabel="جدول کامپوننت‌ها"
      />
    </article>
  );
}
