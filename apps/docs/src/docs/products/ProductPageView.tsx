import { Badge, Heading, Inline, Ltr, Section, Stack, Surface, Text } from '@negaresh/react';
import { Link } from '@tanstack/react-router';
import styles from '../../components/Page.module.css';
import { TableWrap } from '../../components/TableWrap.tsx';
import fStyles from '../../routes/foundations/foundations.module.css';
import type { ProductDoc } from './catalog.ts';

/** Shared product overview page linking each product's screens to approved NDS patterns. */
export function ProductPageView({ product }: { product: ProductDoc }) {
  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <Inline gap="2" align="center">
          <Badge tone={product.status === 'active' ? 'accent' : 'neutral'} size="sm">
            {product.statusLabel}
          </Badge>
          <Badge tone="neutral" size="sm">
            <Ltr>{product.englishName}</Ltr>
          </Badge>
        </Inline>
        <Heading level={1}>{product.name}</Heading>
        <Text as="p" size="lg" tone="muted" leading="text" measure>
          {product.summary}
        </Text>
      </header>

      <div data-gallery={`products-${product.slug}`}>
        <Stack gap="8">
          <div className={fStyles.grid2}>
            <Surface>
              <Section>
                <Stack gap="2">
                  <Text size="xs" weight="semibold" tone="subtle">
                    تم و توکن‌ها
                  </Text>
                  <Text size="md" weight="medium">
                    {product.theme}
                  </Text>
                </Stack>
              </Section>
            </Surface>
            <Surface>
              <Section>
                <Stack gap="2">
                  <Text size="xs" weight="semibold" tone="subtle">
                    زبان و جهت
                  </Text>
                  <Text size="md" weight="medium">
                    {product.locales}
                  </Text>
                </Stack>
              </Section>
            </Surface>
          </div>

          <section className={styles.section} aria-labelledby="product-screens">
            <Heading level={2} id="product-screens">
              صفحه‌های کلیدی و الگوهای NDS
            </Heading>
            <TableWrap label={`جدول صفحه‌های ${product.name}`} desktopOnly>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">صفحه / جریان</th>
                    <th scope="col">پوسته (Shell)</th>
                    <th scope="col">الگوها و کامپوننت‌های مرتبط</th>
                    <th scope="col">نکات اجرایی</th>
                  </tr>
                </thead>
                <tbody>
                  {product.screens.map((row) => (
                    <tr key={row.screen}>
                      <th scope="row">{row.screen}</th>
                      <td>
                        <code className={styles.codeWrap}>{row.shell}</code>
                      </td>
                      <td>
                        <Stack gap="1">
                          {row.patterns.map((p) => (
                            <Link key={p.to + p.label} to={p.to} className={styles.link}>
                              {p.label}
                            </Link>
                          ))}
                        </Stack>
                      </td>
                      <td className={styles.muted}>{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>

            <ul className={`${styles.cards} ${styles.mobileOnly}`}>
              {product.screens.map((row) => (
                <li key={row.screen} className={styles.card}>
                  <Text weight="bold">{row.screen}</Text>
                  <Text size="xs" tone="subtle">
                    پوسته: <code className={styles.codeWrap}>{row.shell}</code>
                  </Text>
                  <Text size="sm" tone="muted">
                    {row.notes}
                  </Text>
                  <Stack gap="1">
                    {row.patterns.map((p) => (
                      <Link key={p.to + p.label} to={p.to} className={styles.link}>
                        {p.label}
                      </Link>
                    ))}
                  </Stack>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section} aria-labelledby="product-constraints">
            <Heading level={2} id="product-constraints">
              الزامات ویژهٔ محصول (برگرفته از PRD)
            </Heading>
            <ul className={fStyles.bullets}>
              {product.constraints.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>
        </Stack>
      </div>

      {product.referenceLinks.length > 0 && (
        <section className={styles.section} aria-labelledby="product-refs">
          <Heading level={2} id="product-refs">
            پیش‌نمایش‌ها و مسیرهای مستقیم
          </Heading>
          <ul className={styles.toc}>
            {product.referenceLinks.map((refLink) => (
              <li key={refLink.to}>
                <Link to={refLink.to}>{refLink.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
