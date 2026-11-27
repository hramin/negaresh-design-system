import { Badge, Code, Heading, Inline, Ltr, Stack, Text } from '@negaresh/react';
import { formatNumber } from '@negaresh/utils';
import { createFileRoute } from '@tanstack/react-router';
import styles from '../../components/Page.module.css';
import { TableWrap } from '../../components/TableWrap.tsx';
import fStyles from './foundations.module.css';

export const Route = createFileRoute('/foundations/typography')({
  head: () => ({ meta: [{ title: 'تایپوگرافی · دیزاین سیستم نگرش' }] }),
  component: TypographyFoundationPage,
});

const SCALE = [
  {
    token: '--nds-text-2xs',
    px: 12,
    use: 'نشان‌ها، فرادادهٔ جدول، درجه‌های محور نمودار',
    sample: 'فعال · ۱۴ آبان ۱۴۰۵ · ۲۴۰٬۰۰۰ تومان',
  },
  {
    token: '--nds-text-xs',
    px: 13,
    use: 'زیرنویس‌ها، راهنمای فیلد، توضیح کوتاه',
    sample: 'کد فعال‌سازی به شمارهٔ ۰۹۱۲ ••• ۴۵۶۷ نیز پیامک شد.',
  },
  {
    token: '--nds-text-sm',
    px: 14,
    use: 'متن ثانویهٔ رابط کاربری، سلول‌های جدول، برچسب فیلد',
    sample: 'شمارهٔ سریال محصول و کد سیستم را وارد کنید.',
  },
  {
    token: '--nds-text-md',
    px: 16,
    use: 'متن بدنه، ورودی‌ها و دکمه‌های استاندارد',
    sample: 'آرامش، خوانایی و دقت بالینی در خوانش متن‌های فارسی.',
  },
  {
    token: '--nds-text-lg',
    px: 18,
    use: 'عنوان سطوح و پاراگراف مقدمه در مقالات',
    sample: 'گزارش تفسیر آزمون برای والدین و نوجوان با زبان آرام',
  },
  {
    token: '--nds-text-xl',
    px: 21,
    use: 'عنوان بخش‌ها (H2)',
    sample: 'فعال‌سازی نرم‌افزارهای روان‌سنجی نگرش',
  },
  {
    token: '--nds-text-2xl',
    px: 25,
    use: 'عنوان صفحه در موبایل و اعداد کلیدی',
    sample: '۴۸۰٬۰۰۰ تومان · ۱۲ فعال‌سازی',
  },
  {
    token: '--nds-text-3xl',
    px: 32,
    use: 'عنوان صفحه در دسکتاپ (H1)',
    sample: 'دیزاین سیستم نگرش',
  },
  {
    token: '--nds-text-4xl',
    px: 40,
    use: 'تیترهای معرفی و شاخص‌های کلیدی (KPI)',
    sample: '۹۸٫۴٪ رضایت',
  },
  {
    token: '--nds-text-5xl',
    px: 50,
    use: 'فقط تیتر اصلی صفحهٔ فرود سایت نگرش',
    sample: 'نگارش برتر',
  },
] as const;

const WEIGHTS = [
  { token: '--nds-weight-regular', value: 400, use: 'متن بدنه و پاراگراف‌های خواندنی' },
  { token: '--nds-weight-medium', value: 500, use: 'برچسب‌های رابط و پیوندهای ناوبری' },
  { token: '--nds-weight-semibold', value: 600, use: 'دکمه‌ها و برچسب فیلدهای فرم' },
  { token: '--nds-weight-bold', value: 700, use: 'عنوان بخش‌ها و زیرتیترها' },
  { token: '--nds-weight-heavy', value: 800, use: 'عنوان صفحه و قیمت‌ها (وزن زیر ۴۰۰ ممنوع است)' },
] as const;

const LEADINGS = [
  {
    token: '--nds-leading-tight',
    value: '۱٫۳۵',
    use: 'عنوان‌ها و تیترهای چندخطی',
    sample: 'تحلیل نیمرخ شخصیت نوجوان با تمرکز بر تاب‌آوری و گفت‌وگوی سازنده با متخصص',
  },
  {
    token: '--nds-leading-ui',
    value: '۱٫۶',
    use: 'کنترل‌ها، برچسب‌ها و پیام‌های کوتاه رابط کاربری',
    sample: 'این سریال روی این رایانه قبلاً فعال شده و ظرفیت تازه‌ای مصرف نمی‌کند.',
  },
  {
    token: '--nds-leading-text',
    value: '۱٫۹',
    use: 'متن ممتد فارسی (مقالات، تفسیر آزمون‌ها و راهنماهای طولانی)',
    sample:
      'متن فارسی به‌سبب نقطه‌ها، کشیدگی‌ها و حروف پایین‌خط به ارتفاع خط بیشتری از متن لاتین نیاز دارد تا چشم هنگام خواندن تفسیر آزمون یا مقاله خسته نشود.',
  },
] as const;

function TypographyFoundationPage() {
  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <Inline gap="2" align="center">
          <Badge tone="neutral" size="sm">
            D-19 · D-33 · D-81
          </Badge>
        </Inline>
        <Heading level={1}>تایپوگرافی</Heading>
        <Text as="p" size="lg" tone="muted" leading="text" measure>
          یک خانوادهٔ قلم یکپارچه در همهٔ محصولات: اکنون <strong>وزیرمتن متغیر</strong> (خودمیزبان،
          مجوز OFL) و پس از تهیهٔ مجوز سازمانی، <strong>ابَر پرو</strong> با تعویض تنها یک توکن (
          <code className={styles.code}>--nds-font-sans</code>). کدها از پشتهٔ هم‌عرض سیستم (
          <code className={styles.code}>--nds-font-code</code>) بهره می‌برند.
        </Text>
      </header>

      <section className={styles.section} aria-labelledby="scale">
        <Heading level={2} id="scale">
          مقیاس اندازهٔ قلم
        </Heading>
        <ul className={fStyles.specimenList}>
          {SCALE.map((row) => (
            <li key={row.token} className={fStyles.specimenRow}>
              <div className={fStyles.specimenMeta}>
                <Inline gap="2" align="center">
                  <code className={styles.code}>{row.token}</code>
                  <Badge tone="neutral" size="sm">
                    {formatNumber(row.px)} پیکسل
                  </Badge>
                </Inline>
                <Text size="xs" tone="subtle">
                  {row.use}
                </Text>
              </div>
              <p className={fStyles.typeSample} style={{ fontSize: `var(${row.token})` }}>
                {row.sample}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="weights">
        <Heading level={2} id="weights">
          وزن‌ها
        </Heading>
        <TableWrap label="جدول وزن‌های قلم">
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">توکن</th>
                <th scope="col">وزن</th>
                <th scope="col">نمونه</th>
                <th scope="col">کاربرد</th>
              </tr>
            </thead>
            <tbody>
              {WEIGHTS.map((w) => (
                <tr key={w.token}>
                  <th scope="row">
                    <code className={styles.code}>{w.token}</code>
                  </th>
                  <td>{formatNumber(w.value)}</td>
                  <td style={{ fontWeight: `var(${w.token})` }}>نگارش برتر · ۱۲۳٬۴۵۶</td>
                  <td className={styles.muted}>{w.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </section>

      <section className={styles.section} aria-labelledby="leading">
        <Heading level={2} id="leading">
          ارتفاع خط و عرض خواندن (Measure)
        </Heading>
        <div className={fStyles.grid3}>
          {LEADINGS.map((item) => (
            <div key={item.token} className={fStyles.specimenRow}>
              <div className={fStyles.specimenMeta}>
                <code className={styles.code}>{item.token}</code>
                <Badge tone="neutral" size="sm">
                  {item.value}
                </Badge>
              </div>
              <Text size="xs" tone="subtle">
                {item.use}
              </Text>
              <p style={{ lineHeight: `var(${item.token})` }}>{item.sample}</p>
            </div>
          ))}
        </div>
        <div className={fStyles.measureBox}>
          <Stack gap="2">
            <Text size="xs" weight="semibold" tone="subtle">
              سقف عرض خواندن: ۶۶ نویسه (66ch) — فرم‌ها حداکثر ۶۴۰ پیکسل
            </Text>
            <Text as="p" size="md" leading="text">
              متن‌های خواندنی در مقالات و تفسیر نتایج آزمون از سقف ۶۶ch فراتر نمی‌روند تا پرش چشم از
              پایان یک سطر به آغاز سطر بعد بدون گم‌کردن خط انجام شود.
            </Text>
          </Stack>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="persian-rules">
        <Heading level={2} id="persian-rules">
          قواعد ویژهٔ فارسی
        </Heading>
        <ul className={fStyles.bullets}>
          <li>
            <strong>نیم‌فاصله (ZWNJ):</strong> در همهٔ متن‌ها رعایت شود («فعال‌سازی»، «می‌شود»،
            «صفحهٔ»).
          </li>
          <li>
            <strong>ممنوعیت فاصلهٔ حروف و ایتالیک:</strong> هرگز به متن فارسی{' '}
            <Ltr>letter-spacing</Ltr> یا <Ltr>italic</Ltr> ندهید؛ برای تأکید از وزن قلم استفاده
            کنید. <Ltr>letter-spacing</Ltr> فقط برای کدهای لاتین مجاز است.
          </li>
          <li>
            <strong>ارقام جدولی:</strong> در جدول‌ها و شاخص‌ها از{' '}
            <Ltr>font-variant-numeric: tabular-nums</Ltr> استفاده می‌شود تا ستون اعداد تراز بماند.
          </li>
          <li>
            <strong>ایزوله‌سازی دوزبانه:</strong> کدها، سریال‌ها و عبارت‌های لاتین را درون{' '}
            <Code>{'<Ltr>'}</Code> یا <Code>{'<Code>'}</Code> بگذارید؛ نمونه:{' '}
            <Code>N25AG-EMV0K</Code>.
          </li>
        </ul>
      </section>
    </article>
  );
}
