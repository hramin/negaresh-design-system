import {
  Badge,
  Button,
  Heading,
  Inline,
  Section,
  SegmentedControl,
  SegmentedControlItem,
  Stack,
  Surface,
  Text,
  TextField,
} from '@negaresh/react';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import styles from '../../components/Page.module.css';
import { TableWrap } from '../../components/TableWrap.tsx';
import { cssTokens } from '../../lib/tokens.ts';
import fStyles from './foundations.module.css';

export const Route = createFileRoute('/foundations/layout')({
  head: () => ({ meta: [{ title: 'چیدمان، فضا و شکل · دیزاین سیستم نگرش' }] }),
  component: LayoutFoundationPage,
});

const BREAKPOINTS = [
  { name: 'base', min: '۰ پیکسل', desc: 'موبایل: تک‌ستونه، نوار اقدام چسبان پایین، محتوای کمکی بازشو' },
  { name: 'sm', min: '۶۰۰ پیکسل', desc: 'تلفن‌های بزرگ و تبلت کوچک: فرم دوستونه مجاز است' },
  { name: 'md', min: '۹۰۰ پیکسل', desc: 'آغاز ترکیب دسکتاپ (تصمیم D-90)' },
  { name: 'lg', min: '۱۲۰۰ پیکسل', desc: 'حداکثر عرض محتوای استاندارد' },
  { name: 'xl', min: '۱۴۴۰ پیکسل', desc: 'جدول‌های گستردهٔ مدیریت و داشبوردها' },
] as const;

const TEMPLATES = [
  {
    name: 'وظیفه‌محور (Task)',
    examples: 'فعال‌سازی رجیستری، تسویه، شروع آزمون',
    desktop: 'ستون اصلی + ستون راهنما و زمینهٔ چسبان (۳۶۰px)',
    mobile: 'خلاصه در بالا، سطح فرم، راهنمای تاشو، دکمهٔ اصلی چسبان پایین',
  },
  {
    name: 'خواندنی (Reading)',
    examples: 'مقاله، تفسیر نتیجهٔ آزمون',
    desktop: 'ستون ۶۶ch + ستون جانبی فهرست مطالب یا نویسنده',
    mobile: 'تک‌ستونه با فهرست مطالب بازشو (Disclosure)',
  },
  {
    name: 'کاتالوگ (Catalog)',
    examples: 'فروشگاه، بلاگ، فهرست متخصصان',
    desktop: 'نوار فیلتر + شبکهٔ خودتنظیم کارت‌ها (حداقل ۲۶۰px)',
    mobile: 'فیلترها درون Sheet پایینی، کارت‌های ۱ تا ۲ ستونه',
  },
  {
    name: 'فضای کاری (Workspace)',
    examples: 'حساب کاربری، پنل مدیریت',
    desktop: 'ناوبری کناری ۲۴۸px + محتوای عریض',
    mobile: 'نوار بالایی + نوار زبانهٔ افقی یا کشو؛ جدول‌ها به کارت تبدیل می‌شوند',
  },
  {
    name: 'متمرکز (Focus)',
    examples: 'پاسخ‌دهی آزمون، ورود Keycloak',
    desktop: 'ستون مرکزی حداکثر ۶۴۰px با کروم حداقلی',
    mobile: 'تمام‌عرض، پیشرفت در بالا و اقدام‌ها در پایین',
  },
] as const;

function LayoutFoundationPage() {
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const spaceTokens = cssTokens.filter((t) => t.path.startsWith('space.'));
  const radiusTokens = cssTokens.filter((t) => t.path.startsWith('radius.'));
  const zTokens = cssTokens.filter((t) => t.path.startsWith('z.'));

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <Inline gap="2" align="center">
          <Badge tone="neutral" size="sm">
            D-77 · D-90
          </Badge>
        </Inline>
        <Heading level={1}>چیدمان، فضا و شکل</Heading>
        <Text as="p" size="lg" tone="muted" leading="text" measure>
          پایهٔ فاصله ۴ پیکسل، شکست موبایل زیر ۹۰۰ پیکسل، تفکیک سطوح با تن رنگی و خط مویی بدون سایهٔ
          ثابت (D-77)، و تراکم دوگانه برای فرم‌های عمومی و جدول‌های مدیریت.
        </Text>
      </header>

      <section className={styles.section} aria-labelledby="space">
        <Heading level={2} id="space">
          مقیاس فاصله (پایهٔ ۴ پیکسل)
        </Heading>
        <TableWrap label="جدول توکن‌های فاصله">
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">توکن</th>
                <th scope="col">مقدار</th>
                <th scope="col">نمایش بصری</th>
              </tr>
            </thead>
            <tbody>
              {spaceTokens.map((t) => (
                <tr key={t.path}>
                  <th scope="row">
                    <code className={styles.code}>{t.cssVar}</code>
                  </th>
                  <td>
                    <code className={styles.code}>{t.value.light}</code>
                  </td>
                  <td>
                    <span className={styles.bar} style={{ inlineSize: `var(${t.cssVar})` }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </section>

      <section className={styles.section} aria-labelledby="breakpoints">
        <Heading level={2} id="breakpoints">
          نقاط شکست و کانتینرها
        </Heading>
        <TableWrap label="جدول نقاط شکست">
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">نام</th>
                <th scope="col">حداقل عرض</th>
                <th scope="col">ترکیب صفحه</th>
              </tr>
            </thead>
            <tbody>
              {BREAKPOINTS.map((b) => (
                <tr key={b.name}>
                  <th scope="row">
                    <code className={styles.code}>{b.name}</code>
                  </th>
                  <td>{b.min}</td>
                  <td className={styles.muted}>{b.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </section>

      <section className={styles.section} aria-labelledby="templates">
        <Heading level={2} id="templates">
          پنج الگوی چیدمان صفحه
        </Heading>
        <TableWrap label="جدول الگوهای صفحه" desktopOnly>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">الگو</th>
                <th scope="col">نمونهٔ کاربرد</th>
                <th scope="col">دسکتاپ (≥ ۹۰۰px)</th>
                <th scope="col">موبایل (&lt; ۹۰۰px)</th>
              </tr>
            </thead>
            <tbody>
              {TEMPLATES.map((t) => (
                <tr key={t.name}>
                  <th scope="row">{t.name}</th>
                  <td className={styles.muted}>{t.examples}</td>
                  <td>{t.desktop}</td>
                  <td>{t.mobile}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
        <ul className={`${styles.cards} ${styles.mobileOnly}`}>
          {TEMPLATES.map((t) => (
            <li key={t.name} className={styles.card}>
              <Text weight="bold">{t.name}</Text>
              <Text size="xs" tone="subtle">
                {t.examples}
              </Text>
              <Text size="sm">دسکتاپ: {t.desktop}</Text>
              <Text size="sm" tone="muted">
                موبایل: {t.mobile}
              </Text>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="surfaces">
        <Heading level={2} id="surfaces">
          سطوح، گردی گوشه و لایه‌ها (Elevation)
        </Heading>
        <div className={fStyles.surfacePreview}>
          <Surface>
            <Section>
              <Stack gap="2">
                <Heading level={3}>سطح استاندارد (Surface)</Heading>
                <Text size="sm" tone="muted">
                  پس‌زمینهٔ <code className={styles.code}>--nds-bg-surface</code> + یک خط مویی{' '}
                  <code className={styles.code}>--nds-border-default</code> بدون سایهٔ ثابت (D-77).
                </Text>
              </Stack>
            </Section>
            <Section tone="sunken">
              <Inline gap="3" align="center" justify="between">
                <Text size="xs" tone="subtle">
                  بخش پایین (sunken) برای نوار اقدام‌ها
                </Text>
                <Button variant="primary" size="sm">
                  ثبت تغییرات
                </Button>
              </Inline>
            </Section>
          </Surface>
        </div>

        <div className={fStyles.grid2}>
          <TableWrap label="جدول گردی گوشه‌ها">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">نمونه</th>
                  <th scope="col">توکن</th>
                  <th scope="col">مقدار</th>
                </tr>
              </thead>
              <tbody>
                {radiusTokens.map((t) => (
                  <tr key={t.path}>
                    <td>
                      <span
                        className={styles.radiusSample}
                        style={{ borderRadius: `var(${t.cssVar})` }}
                      />
                    </td>
                    <th scope="row">
                      <code className={styles.code}>{t.cssVar}</code>
                    </th>
                    <td>
                      <code className={styles.code}>{t.value.light}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>

          <TableWrap label="جدول لایه‌های z-index">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">توکن</th>
                  <th scope="col">مقدار</th>
                </tr>
              </thead>
              <tbody>
                {zTokens.map((t) => (
                  <tr key={t.path}>
                    <th scope="row">
                      <code className={styles.code}>{t.cssVar}</code>
                    </th>
                    <td>
                      <code className={styles.code}>{t.value.light}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="density">
        <Heading level={2} id="density">
          تراکم نمایش (Density)
        </Heading>
        <Text as="p" size="md" tone="muted" leading="text" measure>
          با ویژگی <code className={styles.code}>data-density</code> روی کانتینر می‌توان حالت{' '}
          <code className={styles.code}>comfortable</code> (پیش‌فرض ۴۸px) یا{' '}
          <code className={styles.code}>compact</code> (۴۰px برای جدول‌های مدیریت) را فعال کرد؛ هدف
          لمسی در هر دو حالت حداقل ۴۴×۴۴ پیکسل باقی می‌ماند.
        </Text>
        <div className={fStyles.densitySample} data-density={density}>
          <SegmentedControl
            label="حالت تراکم نمونه"
            size="sm"
            value={density}
            onChange={(k) => {
              if (k === 'comfortable' || k === 'compact') setDensity(k);
            }}
          >
            <SegmentedControlItem id="comfortable">راحت (comfortable)</SegmentedControlItem>
            <SegmentedControlItem id="compact">فشرده (compact)</SegmentedControlItem>
          </SegmentedControl>
          <Inline gap="3" align="end">
            <TextField label="جست‌وجوی سریال" placeholder="N25AG-EMV0K" />
            <Button variant="primary">اعمال فیلتر</Button>
          </Inline>
        </div>
      </section>
    </article>
  );
}
