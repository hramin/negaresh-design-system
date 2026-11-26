import { Heading, Inline, Section, Stack, Surface, Text } from '@negaresh/react';
import { createFileRoute, notFound } from '@tanstack/react-router';
import styles from '../../components/Page.module.css';
import { TableWrap } from '../../components/TableWrap.tsx';
import { findChartDoc } from '../../docs/charts/registry.tsx';
import { PRODUCT_NAMES, STATUS_NAMES } from '../../docs/labels.ts';
import { List, PropsTable } from '../../docs/ui.tsx';
import ui from '../../docs/ui.module.css';

export const Route = createFileRoute('/charts/$slug')({
  loader: ({ params }) => {
    const doc = findChartDoc(params.slug);
    if (!doc) throw notFound();
    return { slug: doc.slug, title: doc.title };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.title ?? ''} · دیزاین سیستم نگرش` }],
  }),
  component: ChartPage,
});

function ChartPage() {
  const { slug } = Route.useLoaderData();
  const doc = findChartDoc(slug);
  if (!doc) return null;
  const { Example, Gallery } = doc;
  return (
    <article className={styles.page}>
      <Stack gap="3">
        <Heading level={1}>{doc.title}</Heading>
        <Text as="p" size="lg" tone="muted" leading="text" measure>
          {doc.summary}
        </Text>
        <Inline gap="4">
          <Text size="sm" tone="subtle">
            وضعیت: {STATUS_NAMES[doc.status]}
          </Text>
          <Text size="sm" tone="subtle">
            محصولات: {doc.products.map((p) => PRODUCT_NAMES[p]).join('، ')}
          </Text>
          <Text size="sm" tone="subtle">
            <span className={styles.codeWrap}>{doc.components.join(' · ')}</span>
          </Text>
        </Inline>
      </Stack>

      <section className={styles.section} aria-labelledby="example">
        <Heading level={2} id="example">
          نمونه
        </Heading>
        <div className={ui.example}>
          <Example />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="states">
        <Heading level={2} id="states">
          حالت‌ها
        </Heading>
        <div className={ui.gallery} data-gallery={`chart-${doc.slug}`}>
          <Gallery />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="usage">
        <Heading level={2} id="usage">
          کاربرد
        </Heading>
        <div className={ui.doDont}>
          <Surface aria-labelledby="usage-do">
            <Section>
              <Stack gap="3">
                <Heading level={3} id="usage-do">
                  انجام دهید
                </Heading>
                <List items={doc.usage.do} />
              </Stack>
            </Section>
          </Surface>
          <Surface aria-labelledby="usage-dont">
            <Section>
              <Stack gap="3">
                <Heading level={3} id="usage-dont">
                  انجام ندهید
                </Heading>
                <List items={doc.usage.dont} />
              </Stack>
            </Section>
          </Surface>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="props">
        <Heading level={2} id="props">
          ویژگی‌ها
        </Heading>
        {doc.api.map((a) => (
          <PropsTable key={a.name} name={a.name} rows={a.props} />
        ))}
      </section>

      <section className={styles.section} aria-labelledby="a11y">
        <Heading level={2} id="a11y">
          دسترس‌پذیری
        </Heading>
        {doc.keyboard && (
          <TableWrap label="نقشهٔ کیبورد">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">کلید</th>
                  <th scope="col">کار</th>
                </tr>
              </thead>
              <tbody>
                {doc.keyboard.map((k) => (
                  <tr key={k.keys}>
                    <th scope="row">{k.keys}</th>
                    <td>{k.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        )}
        <List items={doc.a11y} />
      </section>

      <section className={styles.section} aria-labelledby="rtl">
        <Heading level={2} id="rtl">
          راست‌به‌چپ و بومی‌سازی
        </Heading>
        <List items={doc.rtl} />
      </section>
    </article>
  );
}
