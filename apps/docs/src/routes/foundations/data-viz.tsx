import { Badge, Heading, Inline, Section, Stack, Surface, Text } from '@negaresh/react';
import { createFileRoute, Link } from '@tanstack/react-router';
import styles from '../../components/Page.module.css';
import { TableWrap } from '../../components/TableWrap.tsx';
import { cssTokens } from '../../lib/tokens.ts';
import fStyles from './foundations.module.css';

export const Route = createFileRoute('/foundations/data-viz')({
  head: () => ({ meta: [{ title: 'بصری‌سازی داده · دیزاین سیستم نگرش' }] }),
  component: DataVizFoundationPage,
});

const CHART_TYPES = [
  {
    slug: 'interval-bar',
    name: 'نمودار بازه‌ای (IntervalBar)',
    use: 'نمایش نمرهٔ روان‌سنجی همراه با بازهٔ اطمینان و باند هنجار',
    note: 'نمودار امضای NDS؛ افقی با محور عددی سازگار با RTL',
  },
  {
    slug: 'profile-line',
    name: 'نمودار نیمرخ خطی (ProfileLine)',
    use: 'نیمرخ چندمقیاسی مانند MMPI (نمرات T)',
    note: 'خطوط مرجع ۵۰ / ۶۵ / ۷۰، جداکنندهٔ بخش‌ها، نقاط قابل فوکوس',
  },
  {
    slug: 'bar',
    name: 'نمودار ستونی / میله‌ای (Bar)',
    use: 'مقایسهٔ دسته‌ها و فروش',
    note: 'برچسب مستقیم فارسی و هاشور SVG امن برای چاپ سیاه‌وسفید',
  },
  {
    slug: 'radar',
    name: 'نمودار رادار (Radar)',
    use: 'صرفاً نمای حرفه‌ای و مروری (D-67)',
    note: 'همیشه همراه با جدول دادهٔ قابل مشاهده و بدون نشانگر لوزی',
  },
  {
    slug: 'gauge',
    name: 'نمودار عقربه‌ای / کمانی (Gauge)',
    use: 'یک شاخص کل در بازهٔ کران‌دار',
    note: 'عدد فارسی همراه با واژهٔ الزامی بازه',
  },
  {
    slug: 'sparkline',
    name: 'خط روند فشرده (Sparkline)',
    use: 'روند کوتاه درون کاشی آمار (StatTile)',
    note: 'بدون محور؛ دارای خلاصهٔ متنی برای صفحه‌خوان',
  },
] as const;

const VIZ_LABELS: Record<string, string> = {
  '--nds-viz-1': 'سری ۱ · سبزآبی',
  '--nds-viz-2': 'سری ۲ · اُخرایی',
  '--nds-viz-3': 'سری ۳ · سنگی',
  '--nds-viz-4': 'سری ۴ · سفالی',
  '--nds-viz-5': 'سری ۵ · ارغوانی',
  '--nds-viz-6': 'سری ۶ · مریم‌گلی',
  '--nds-viz-ref': 'خط مرجع (میانگین و آستانه)',
  '--nds-viz-band': 'باند محدودهٔ هنجار',
  '--nds-viz-grid': 'خطوط شبکهٔ کم‌رنگ',
};

function DataVizFoundationPage() {
  const vizTokens = cssTokens.filter((t) => t.path.startsWith('color.viz.'));

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <Inline gap="2" align="center">
          <Badge tone="neutral" size="sm">
            @negaresh/charts · SVG SSR
          </Badge>
        </Inline>
        <Heading level={1}>بصری‌سازی داده (Data Visualisation)</Heading>
        <Text as="p" size="lg" tone="muted" leading="text" measure>
          تمامی نمودارهای نگرش به‌صورت SVG خالص روی سرور رندر می‌شوند (بدون Canvas)، در حالت بدون
          جاوااسکریپت و چاپ A4 سیاه‌وسفید خوانا هستند و برای آزمون‌ها دو مقیاس شدت «حرفه‌ای» و
          «آرام» دارند.
        </Text>
      </header>

      <section className={styles.section} aria-labelledby="viz-palette">
        <Heading level={2} id="viz-palette">
          پالت رنگ نمودارها
        </Heading>
        <Text as="p" size="md" tone="muted" leading="text" measure>
          شش رنگ اصلی به ترتیب مصرف می‌شوند و هر یک دست‌کم کنتراست ۳ به ۱ روی{' '}
          <code className={styles.code}>--nds-bg-surface</code> در هر دو حالت روشن و تیره دارند.
          برای بیش از شش سری، داده‌ها را دسته‌بندی یا تفکیک (facet) کنید.
        </Text>
        <ul className={fStyles.vizGrid}>
          {vizTokens.map((t) => (
            <li key={t.path} className={fStyles.vizItem}>
              <span
                className={fStyles.vizSwatch}
                style={{ background: `var(${t.cssVar})` }}
                aria-hidden="true"
              />
              <Text size="sm" weight="semibold">
                {(t.cssVar && VIZ_LABELS[t.cssVar]) ?? t.path}
              </Text>
              <code className={styles.code}>{t.cssVar}</code>
              <Text size="xs" tone="subtle">
                روشن: <code className={styles.code}>{t.value.light}</code> · تیره:{' '}
                <code className={styles.code}>{t.value.dark}</code>
              </Text>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="viz-charts">
        <Heading level={2} id="viz-charts">
          انواع نمودارها در <code className={styles.code}>@negaresh/charts</code>
        </Heading>
        <TableWrap label="جدول انواع نمودارها">
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">نمودار</th>
                <th scope="col">کاربرد</th>
                <th scope="col">نکات</th>
              </tr>
            </thead>
            <tbody>
              {CHART_TYPES.map((c) => (
                <tr key={c.slug}>
                  <th scope="row">
                    <Link to="/charts/$slug" params={{ slug: c.slug }} className={styles.link}>
                      {c.name}
                    </Link>
                  </th>
                  <td>{c.use}</td>
                  <td className={styles.muted}>{c.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </section>

      <section className={styles.section} aria-labelledby="viz-severity">
        <Heading level={2} id="viz-severity">
          مقیاس شدت دوگانه در ارزیابی‌ها
        </Heading>
        <div className={fStyles.grid2}>
          <Surface>
            <Section>
              <Stack gap="3">
                <Heading level={3}>نمای حرفه‌ای (متخصص)</Heading>
                <Inline gap="2">
                  <Badge tone="success">در بازهٔ هنجار</Badge>
                  <Badge tone="warning">نیازمند توجه</Badge>
                  <Badge tone="danger">آستانهٔ بالینی</Badge>
                </Inline>
                <Text size="sm" tone="muted">
                  شامل نمرات T، خطوط برش ۵۰ / ۶۵ / ۷۰ و نشانگرهای وضعیت مریم‌گلی، اخرایی و گلی.
                </Text>
              </Stack>
            </Section>
          </Surface>
          <Surface>
            <Section>
              <Stack gap="3">
                <Heading level={3}>نمای آرام (آزمون‌دهنده، نوجوان، والدین)</Heading>
                <Inline gap="2">
                  <Badge tone="neutral">در بازهٔ معمول</Badge>
                  <Badge tone="neutral">کمی بالاتر از معمول</Badge>
                  <Badge tone="accent">قابل توجه · گفت‌وگو با متخصص</Badge>
                </Inline>
                <Text size="sm" tone="muted">
                  کاملاً عاری از رنگ رز/قرمز و واژگان تشخیصی هراس‌آور؛ تنها از خنثی و سبزآبی آرام
                  بهره می‌برد.
                </Text>
              </Stack>
            </Section>
          </Surface>
        </div>
      </section>
    </article>
  );
}
