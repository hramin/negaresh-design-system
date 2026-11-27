import { Badge, Heading, Inline, Ltr, Section, Stack, Surface, Text } from '@negaresh/react';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import styles from '../../components/Page.module.css';
import { findBrandRoute } from '../../docs/brands/registry.ts';
import { CodeBlock } from '../../docs/ui.tsx';
import fStyles from '../foundations/foundations.module.css';

export const Route = createFileRoute('/brands/$brand/$slug')({
  loader: ({ params }) => {
    const match = findBrandRoute(params.brand, params.slug);
    if (!match) throw notFound();
    return {
      brand: params.brand,
      slug: params.slug,
      title: `${match.route.title} · ${match.manifest.title}`,
    };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.title ?? 'افزونهٔ برند'} · دیزاین سیستم نگرش` }],
  }),
  component: BrandManifestRoutePage,
});

const STATUS_LABEL = {
  placeholder: 'جایگاه آماده (Placeholder)',
  demo: 'بستهٔ نمونه (Dummy)',
  approved: 'تأییدشده',
} as const;

function BrandManifestRoutePage() {
  const { brand, slug } = Route.useLoaderData();
  const match = findBrandRoute(brand, slug);
  if (!match) return null;
  const { manifest, route } = match;

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <Inline gap="2" align="center">
          <Badge tone={manifest.status === 'demo' ? 'info' : 'neutral'} size="sm">
            {STATUS_LABEL[manifest.status]}
          </Badge>
          <Badge tone="neutral" size="sm">
            <Ltr>{manifest.packageName}</Ltr>
          </Badge>
          <Badge tone="neutral" size="sm">
            زبان‌ها: <Ltr>{manifest.locales.join(', ')}</Ltr>
          </Badge>
        </Inline>
        <Heading level={1}>{route.title}</Heading>
        <Text as="p" size="lg" tone="muted" leading="text" measure>
          {route.summary}
        </Text>
      </header>

      <div data-gallery={`brand-${manifest.brandId}`}>
        <Stack gap="6">
          {route.sections.map((section) => (
            <section
              key={section.id}
              className={styles.section}
              aria-labelledby={`sec-${section.id}`}
            >
              <Surface>
                <Section>
                  <Stack gap="3">
                    <Heading level={2} id={`sec-${section.id}`}>
                      {section.heading}
                    </Heading>
                    <Text as="p" size="md" tone="muted" leading="text" measure>
                      {section.body}
                    </Text>
                    {section.bullets && section.bullets.length > 0 && (
                      <ul className={fStyles.bullets}>
                        {section.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    )}
                    {section.code && (
                      <CodeBlock
                        code={section.code.snippet}
                        label={section.code.label}
                        copyLabel="کپی کد"
                      />
                    )}
                  </Stack>
                </Section>
              </Surface>
            </section>
          ))}
        </Stack>
      </div>

      {route.relatedLinks && route.relatedLinks.length > 0 && (
        <section className={styles.section} aria-labelledby="brand-related">
          <Heading level={2} id="brand-related">
            مسیرهای مرتبط
          </Heading>
          <ul className={styles.toc}>
            {route.relatedLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
