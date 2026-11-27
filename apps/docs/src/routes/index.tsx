import { Badge, Heading, Inline, Section, Stack, Surface, Text } from '@negaresh/react';
import { formatNumber } from '@negaresh/utils';
import { createFileRoute, Link } from '@tanstack/react-router';
import styles from '../components/Page.module.css';
import { TableWrap } from '../components/TableWrap.tsx';
import { ALL_CATALOG_DOCS } from '../docs/catalog.ts';
import { PRODUCTS_CATALOG } from '../docs/products/catalog.ts';
import { PROPS_GENERATOR_META } from '../docs/props.ts';
import { MILESTONE_RELEASES } from '../lib/changelog.ts';
import { cssTokens } from '../lib/tokens.ts';
import fStyles from './foundations/foundations.module.css';

export const Route = createFileRoute('/')({
  component: Overview,
});

const PRINCIPLES = [
  {
    title: 'آرام (Calm)',
    body: 'بوم خنثای گرم در روز، جوهری آرام در شب، یک رنگ تأکید سبزآبی و پرهیز از شلوغی؛ به‌ویژه در خواندن نتایج روان‌شناختی توسط نوجوانان.',
  },
  {
    title: 'قابل اعتماد (Trustworthy)',
    body: 'سلسله‌مراتب روشن، فارسی ساده، حالت‌های صادقانه و دقت بالینی در نمایش داده‌ها.',
  },
  {
    title: 'مدرن و کمینه (D-77)',
    body: 'جداسازی سطوح با تن، فاصله و حداکثر یک خط مویی؛ بدون سایهٔ ثابت و بدون قاب تزئینی.',
  },
  {
    title: 'بهینه و واکنش‌گرا (D-90)',
    body: 'دسکتاپ تمام‌عرض در کارهای مدیریتی، متن ۶۶ch در خواندن و ترکیب مستقل موبایل زیر ۹۰۰ پیکسل.',
  },
] as const;

function Overview() {
  const latest = MILESTONE_RELEASES.slice(0, 3);
  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <Inline gap="2" align="center">
          <Badge tone="accent" size="sm">
            {formatNumber(ALL_CATALOG_DOCS.length)} صفحهٔ مستندات
          </Badge>
          <Badge tone="neutral" size="sm">
            {formatNumber(PROPS_GENERATOR_META.totalSymbols)} کامپوننت و الگو (TS 6.0)
          </Badge>
          <Badge tone="neutral" size="sm">
            {formatNumber(cssTokens.length)} متغیر CSS
          </Badge>
        </Inline>
        <Heading level={1}>دیزاین سیستم نگرش</Heading>
        <Text as="p" size="lg" tone="muted" leading="text" measure>
          یک مجموعهٔ یکپارچه از توکن، کامپوننت، نمودار، کیت ارزیابی، الگو و پوستهٔ ورود برای
          همهٔ محصولات نگرش: فارسی و راست‌به‌چپ از پایه، حالت روشن و تیره از نسخهٔ اول و
          دسترس‌پذیری در سطح WCAG 2.2 AA.
        </Text>
      </header>

      <section className={styles.section} aria-labelledby="start">
        <Heading level={2} id="start">
          از کجا شروع کنیم
        </Heading>
        <ul className={styles.toc}>
          <li>
            <Link to="/start">شروع کار و نصب</Link>
          </li>
          <li>
            <Link to="/foundations/color">مبانی رنگ</Link>
          </li>
          <li>
            <Link to="/tokens">همهٔ توکن‌ها</Link>
          </li>
          <li>
            <Link to="/components">کامپوننت‌ها</Link>
          </li>
          <li>
            <Link to="/patterns">الگوهای محصول</Link>
          </li>
          <li>
            <Link to="/brands">افزونه‌های برند (docs.manifest.ts)</Link>
          </li>
          <li>
            <Link to="/decisions">تصمیم‌های طراحی</Link>
          </li>
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="principles">
        <Heading level={2} id="principles">
          اصول طراحی نگرش
        </Heading>
        <div className={fStyles.grid2}>
          {PRINCIPLES.map((p) => (
            <Surface key={p.title}>
              <Section>
                <Stack gap="2">
                  <Heading level={3}>{p.title}</Heading>
                  <Text size="sm" tone="muted" leading="text">
                    {p.body}
                  </Text>
                </Stack>
              </Section>
            </Surface>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="products">
        <Heading level={2} id="products">
          محصولات
        </Heading>
        <TableWrap label="جدول محصولات" desktopOnly>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">محصول</th>
                <th scope="col">وضعیت و پوشش NDS</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS_CATALOG.map((p) => (
                <tr key={p.slug}>
                  <th scope="row">
                    <Link to={`/products/${p.slug}`} className={styles.link}>
                      {p.name}
                    </Link>
                  </th>
                  <td className={styles.muted}>{p.statusLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
        <ul className={`${styles.cards} ${styles.mobileOnly}`}>
          {PRODUCTS_CATALOG.map((p) => (
            <li key={p.slug} className={styles.card}>
              <Link to={`/products/${p.slug}`} className={styles.link}>
                {p.name}
              </Link>
              <Text size="sm" tone="muted">
                {p.statusLabel}
              </Text>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="latest">
        <Inline gap="3" align="center" justify="between">
          <Heading level={2} id="latest">
            آخرین تغییرات تأییدشده
          </Heading>
          <Link to="/changelog" className={styles.link}>
            مشاهدهٔ کامل تاریخچهٔ تغییرات
          </Link>
        </Inline>
        <div className={fStyles.grid3}>
          {latest.map((item) => (
            <Surface key={item.phase}>
              <Section>
                <Stack gap="2">
                  <Inline gap="2" align="center" justify="between">
                    <Badge tone="accent" size="sm">
                      {item.phase}
                    </Badge>
                    <Text size="xs" tone="subtle">
                      {item.dateJalali}
                    </Text>
                  </Inline>
                  <Heading level={3}>{item.title}</Heading>
                  <Text size="sm" tone="muted">
                    {item.highlights[0]}
                  </Text>
                </Stack>
              </Section>
            </Surface>
          ))}
        </div>
      </section>
    </article>
  );
}
