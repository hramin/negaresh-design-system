import { Badge, Heading, Inline, Ltr, Section, Stack, Surface, Text } from '@negaresh/react';
import { formatNumber } from '@negaresh/utils';
import { createFileRoute, Link } from '@tanstack/react-router';
import styles from '../../components/Page.module.css';
import { BRAND_MANIFESTS } from '../../docs/brands/registry.ts';
import { CodeBlock } from '../../docs/ui.tsx';
import fStyles from '../foundations/foundations.module.css';

export const Route = createFileRoute('/brands/')({
  head: () => ({ meta: [{ title: 'افزونه‌های برند (docs.manifest.ts) · دیزاین سیستم نگرش' }] }),
  component: BrandsIndexPage,
});

const CONTRACT_SNIPPET = `export interface DocsManifest {
  brandId: string;
  packageName: string;
  themePackage: string;
  title: string;
  navGroup: string;
  summary: string;
  status: 'placeholder' | 'demo' | 'approved';
  locales: readonly string[];
  routes: readonly BrandManifestRoute[];
}`;

const STATUS_LABEL = {
  placeholder: 'جایگاه آماده (Placeholder)',
  demo: 'بستهٔ نمونه (Dummy)',
  approved: 'تأییدشده',
} as const;

function BrandsIndexPage() {
  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <Inline gap="2" align="center">
          <Badge tone="accent" size="sm">
            docs.manifest.ts
          </Badge>
          <Badge tone="neutral" size="sm">
            {formatNumber(BRAND_MANIFESTS.length)} بستهٔ ثبت‌شده
          </Badge>
        </Inline>
        <Heading level={1}>نقطهٔ توسعهٔ بسته‌های برند</Heading>
        <Text as="p" size="lg" tone="muted" leading="text" measure>
          بسته‌های برند (مانند <Ltr>@negaresh/brand-ravanma</Ltr>) بخش مستندات خود را از طریق فایل{' '}
          <code className={styles.code}>docs.manifest.ts</code> به سایت مستندات متصل می‌کنند؛ بدون
          دست‌زدن به پوستهٔ سایت و بدون ورود هیچ هنر یا تزئینی به Core یا تم شرکتی (D-77).
        </Text>
      </header>

      <section className={styles.section} aria-labelledby="registered-brands">
        <Heading level={2} id="registered-brands">
          بسته‌های ثبت‌شده
        </Heading>
        <div className={fStyles.grid2}>
          {BRAND_MANIFESTS.map((manifest) => (
            <Surface key={manifest.brandId}>
              <Section>
                <Stack gap="3">
                  <Inline gap="2" align="center" justify="between">
                    <Heading level={3}>{manifest.title}</Heading>
                    <Badge tone={manifest.status === 'demo' ? 'info' : 'neutral'} size="sm">
                      {STATUS_LABEL[manifest.status]}
                    </Badge>
                  </Inline>
                  <Inline gap="2">
                    <Badge tone="neutral" size="sm">
                      <Ltr>{manifest.packageName}</Ltr>
                    </Badge>
                    <Badge tone="neutral" size="sm">
                      <Ltr>{manifest.themePackage}</Ltr>
                    </Badge>
                  </Inline>
                  <Text size="sm" tone="muted" leading="text">
                    {manifest.summary}
                  </Text>
                  <ul className={styles.toc}>
                    {manifest.routes.map((r) => (
                      <li key={r.slug}>
                        <Link
                          to="/brands/$brand/$slug"
                          params={{ brand: manifest.brandId, slug: r.slug }}
                        >
                          {r.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Stack>
              </Section>
            </Surface>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="manifest-contract">
        <Heading level={2} id="manifest-contract">
          قرارداد TypeScript (<Ltr>DocsManifest</Ltr>)
        </Heading>
        <CodeBlock
          code={CONTRACT_SNIPPET}
          label="تعریف نوع در @negaresh/brand-ravanma/docs.manifest"
          copyLabel="کپی قرارداد"
        />
      </section>
    </article>
  );
}
