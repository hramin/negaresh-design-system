import { Heading, Stack, Text } from '@negaresh/react';
import { createFileRoute } from '@tanstack/react-router';
import styles from '../../components/Page.module.css';
import { PATTERN_CATALOG } from '../../docs/catalog.ts';
import { CatalogIndexTable } from '../../docs/CatalogIndexTable.tsx';

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
          رجیستری، مجله و متخصصان، دوره‌های آموزشی، پوسته‌های حساب و مدیریت، کارزارهای سازمانی پلتفرم
          آزمون و پوستهٔ ورود یکپارچهٔ Keycloak.
        </Text>
      </Stack>
      <CatalogIndexTable
        items={PATTERN_CATALOG}
        routeTo="/patterns/$slug"
        tableLabel="جدول الگوهای محصول"
        symbolColumnLabel="الگوها"
      />
    </article>
  );
}
