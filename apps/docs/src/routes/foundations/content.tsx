import { Badge, Heading, Inline, InlineAlert, Text } from '@negaresh/react';
import { createFileRoute } from '@tanstack/react-router';
import styles from '../../components/Page.module.css';
import { TableWrap } from '../../components/TableWrap.tsx';
import fStyles from './foundations.module.css';

export const Route = createFileRoute('/foundations/content')({
  head: () => ({ meta: [{ title: 'محتوا و لحن · دیزاین سیستم نگرش' }] }),
  component: ContentFoundationPage,
});

const VOICE_PAIRS = [
  {
    good: '«سریال را وارد کنید»',
    bad: '«لطفاً سریال محصول خریداری‌شدهٔ خود را در کادر زیر وارد نمایید»',
    why: 'کوتاه، مستقیم و بی‌تکلف',
  },
  {
    good: '«این سریال برای «نگارش تست هوش ۴» نیست.»',
    bad: '«خطا! سریال نامعتبر»',
    why: 'دلیل مشخص و کمک‌کننده به کاربر',
  },
  {
    good: '«سقف فعال‌سازی این سریال پر شده است» + دکمهٔ خرید +۱ فعال‌سازی',
    bad: '«Error 409»',
    why: 'بیان وضعیت و گام بعدی به زبان روشن فارسی',
  },
  {
    good: '«نتیجه در بازهٔ معمول است» (نمای آرام)',
    bad: '«نرمال» / «غیرطبیعی»',
    why: 'لحن غیرتشخیصی و امن برای نوجوانان و والدین',
  },
] as const;

function ContentFoundationPage() {
  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <Inline gap="2" align="center">
          <Badge tone="neutral" size="sm">
            لحن فارسی نگرش
          </Badge>
        </Inline>
        <Heading level={1}>محتوا و لحن (Content & Voice)</Heading>
        <Text as="p" size="lg" tone="muted" leading="text" measure>
          آرام، شفاف، محترمانه و دقیق — مانند یک همکار آگاه، نه فرم اداری خشک و نه متن تبلیغاتی
          هیجان‌زده.
        </Text>
      </header>

      <section className={styles.section} aria-labelledby="voice-examples">
        <Heading level={2} id="voice-examples">
          مقایسهٔ نوشتار درست و نادرست
        </Heading>
        <TableWrap label="جدول مقایسهٔ لحن" desktopOnly>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">بنویسید (انجام دهید)</th>
                <th scope="col">ننویسید (انجام ندهید)</th>
                <th scope="col">دلیل</th>
              </tr>
            </thead>
            <tbody>
              {VOICE_PAIRS.map((p) => (
                <tr key={p.good}>
                  <th scope="row">{p.good}</th>
                  <td className={styles.muted}>{p.bad}</td>
                  <td className={styles.muted}>{p.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
        <ul className={`${styles.cards} ${styles.mobileOnly}`}>
          {VOICE_PAIRS.map((p) => (
            <li key={p.good} className={styles.card}>
              <Text size="xs" tone="subtle">
                بنویسید:
              </Text>
              <Text weight="semibold">{p.good}</Text>
              <Text size="xs" tone="subtle">
                ننویسید:
              </Text>
              <Text size="sm" tone="muted">
                {p.bad}
              </Text>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="content-patterns">
        <Heading level={2} id="content-patterns">
          الگوهای متن رابط کاربری
        </Heading>
        <ul className={fStyles.bullets}>
          <li>
            <strong>عنوان‌ها و دکمه‌ها:</strong> دکمه‌ها با فعل و نتیجه شروع شوند («ساخت کد
            فعال‌سازی»، «پرداخت و دریافت کد»).
          </li>
          <li>
            <strong>خطاها:</strong> چه رخ داد + چرا (در صورت امکان) + اکنون چه کنید؛ هرگز کاربر را
            سرزنش نکنید.
          </li>
          <li>
            <strong>حالت خالی (EmptyState):</strong> توضیح دهید چه چیزی اینجا نمایش داده می‌شود و
            نخستین اقدام را ارائه دهید.
          </li>
          <li>
            <strong>تأیید اقدام مخرب:</strong> نام دقیق شیء را بیاورید («حذف کوپن «بهار۱۴۰۵»؟»).
          </li>
          <li>
            <strong>ادب و پرهیز از علامت تعجب:</strong> از خطاب «شما» استفاده کنید، از علامت تعجب
            بپرهیزید و اصطلاحات فنی (مانند نمرهٔ T و صدک) را فقط در نمای حرفه‌ای نگه دارید.
          </li>
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="psych-content">
        <Heading level={2} id="psych-content">
          محتوای روان‌شناختی و ایمنی نوجوانان
        </Heading>
        <InlineAlert tone="warning" title="نتیجه توصیف می‌کند، تشخیص نمی‌دهد">
          در تفسیر آزمون‌ها از تعبیرهای توصیفی مانند «ممکن است» و «معمولاً» استفاده کنید. در نمای
          آرام نوجوان و والدین هیچ واژهٔ هراس‌آور یا رنگ قرمز به کار نمی‌رود و همیشه مراجعه به
          متخصص دارای پروانه برای تفسیر نهایی یادآوری می‌شود.
        </InlineAlert>
      </section>
    </article>
  );
}
