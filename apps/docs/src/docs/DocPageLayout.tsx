import {
  Heading,
  Inline,
  Section,
  SegmentedControl,
  SegmentedControlItem,
  Stack,
  Surface,
  Text,
} from '@negaresh/react';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import styles from '../components/Page.module.css';
import { TableWrap } from '../components/TableWrap.tsx';
import { PRODUCT_NAMES, STATUS_NAMES } from './labels.ts';
import {
  buildImportSnippet,
  getAutoComponentApis,
  PROPS_GENERATOR_META,
} from './props.ts';
import type { ComponentDoc } from './types.ts';
import ui from './ui.module.css';
import { CodeBlock, List, PropsTable } from './ui.tsx';

const PLAYGROUND_SLUGS: Record<string, string> = {
  button: 'button',
  'text-field': 'text-field',
  select: 'select',
  'choice-card': 'choice-card',
  'status-badge': 'status-badge',
  'inline-alert': 'inline-alert',
  'usage-meter': 'usage-meter',
  'stat-tile': 'stat-tile',
  'interval-bar': 'interval-bar',
  'question-item': 'question-item',
  'commerce-catalog': 'product-card',
  'identity-sign-in': 'phone-signin',
};

/**
 * Shared documentation page template for `/components/$slug`, `/charts/$slug`,
 * `/assessment/$slug`, and `/patterns/$slug` (docs/docs-site.md §Page anatomy).
 */
export function DocPageLayout({
  doc,
  galleryId,
  galleryClassName,
}: {
  doc: ComponentDoc;
  galleryId: string;
  galleryClassName?: string | undefined;
}) {
  const { Example, Gallery } = doc;
  const [frame, setFrame] = useState<'desktop' | 'mobile'>('desktop');
  const autoApis = getAutoComponentApis(doc.components);
  const importSnippet = buildImportSnippet(doc.components);
  const playgroundPreset = PLAYGROUND_SLUGS[doc.slug];

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
          {doc.base && (
            <Text size="sm" tone="subtle">
              پایه در React Aria: <span className={styles.codeWrap}>{doc.base}</span>
            </Text>
          )}
        </Inline>
      </Stack>

      <section className={styles.section} aria-labelledby="example">
        <Heading level={2} id="example">
          نمونه
        </Heading>
        <div className={ui.example}>
          <div className={frame === 'mobile' ? ui.exampleMobileFrame : undefined}>
            <Example />
          </div>
        </div>
        <div className={ui.exampleFooterBar}>
          <div className={ui.frameToggleWrap}>
            <SegmentedControl
              aria-label="نمای نمونه"
              size="sm"
              value={frame}
              onChange={(k) => {
                if (k === 'desktop' || k === 'mobile') setFrame(k);
              }}
            >
              <SegmentedControlItem id="desktop">نمای دسکتاپ</SegmentedControlItem>
              <SegmentedControlItem id="mobile">قاب موبایل (۳۹۰px)</SegmentedControlItem>
            </SegmentedControl>
          </div>
          {playgroundPreset && (
            <Link
              to="/playground"
              search={{
                preset: playgroundPreset,
                canvasTheme: 'light',
                density: 'comfortable',
                dir: 'rtl',
                viewport: 'full',
              }}
              className={styles.link}
            >
              باز کردن در زمین بازی تعاملی
            </Link>
          )}
        </div>
        <CodeBlock code={importSnippet} label="نحوهٔ فراخوانی (import)" copyLabel="کپی import" />
      </section>

      <section className={styles.section} aria-labelledby="states">
        <Heading level={2} id="states">
          حالت‌ها
        </Heading>
        <div
          className={galleryClassName ? `${ui.gallery} ${galleryClassName}` : ui.gallery}
          data-gallery={galleryId}
        >
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
        <p className={ui.propsMeta}>
          استخراج خودکار از تعاریف TypeScript ({PROPS_GENERATOR_META.tsVersion}) بدون نیاز به
          ویرایش دستی (تصمیم D-93).
        </p>
        {autoApis.map((api) => (
          <PropsTable
            key={api.name}
            name={api.name}
            packageName={api.packageName}
            kind={api.kind}
            {...(api.description ? { description: api.description } : {})}
            rows={api.props}
          />
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
