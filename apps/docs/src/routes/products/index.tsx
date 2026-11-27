import { Badge, Heading, Inline, Ltr, Section, Stack, Surface, Text } from '@negaresh/react';
import { createFileRoute, Link } from '@tanstack/react-router';
import styles from '../../components/Page.module.css';
import { PRODUCTS_CATALOG } from '../../docs/products/catalog.ts';
import fStyles from '../foundations/foundations.module.css';

export const Route = createFileRoute('/products/')({
  head: () => ({ meta: [{ title: 'محصولات · دیزاین سیستم نگرش' }] }),
  component: ProductsIndexPage,
});

function ProductsIndexPage() {
  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <Heading level={1}>محصولات روی دیزاین سیستم نگرش</Heading>
        <Text as="p" size="lg" tone="muted" leading="text" measure>
          چهار محصول وب نگرش با یک ورود یکپارچه (Keycloak) و یک مجموعهٔ مشترک از توکن‌ها،
          کامپوننت‌ها و الگوها ساخته می‌شوند؛ هر صفحهٔ محصول نگاشت صفحه‌ها به الگوهای مصوب NDS را
          نشان می‌دهد.
        </Text>
      </header>

      <div className={fStyles.grid2}>
        {PRODUCTS_CATALOG.map((product) => (
          <Surface key={product.slug}>
            <Section>
              <Stack gap="3">
                <Inline gap="2" align="center" justify="between">
                  <Heading level={2}>{product.name}</Heading>
                  <Badge tone={product.status === 'active' ? 'accent' : 'neutral'} size="sm">
                    <Ltr>{product.englishName}</Ltr>
                  </Badge>
                </Inline>
                <Text size="sm" tone="muted" leading="text">
                  {product.summary}
                </Text>
                <Text size="xs" tone="subtle">
                  {product.statusLabel}
                </Text>
                <Link to={`/products/${product.slug}`} className={styles.link}>
                  مشاهدهٔ صفحه‌ها و الگوهای {product.name}
                </Link>
              </Stack>
            </Section>
          </Surface>
        ))}
      </div>
    </article>
  );
}
