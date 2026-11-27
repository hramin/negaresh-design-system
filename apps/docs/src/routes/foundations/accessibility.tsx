import { Badge, Heading, Inline, InlineAlert, Text } from '@negaresh/react';
import { createFileRoute } from '@tanstack/react-router';
import styles from '../../components/Page.module.css';
import { TableWrap } from '../../components/TableWrap.tsx';
import fStyles from './foundations.module.css';

export const Route = createFileRoute('/foundations/accessibility')({
  head: () => ({ meta: [{ title: 'دسترس‌پذیری (WCAG 2.2 AA) · دیزاین سیستم نگرش' }] }),
  component: AccessibilityFoundationPage,
});

const CHECKLIST = [
  {
    area: 'کنتراست',
    rule: 'متن عادی ۴٫۵ به ۱ (بزرگ ۳ به ۱)؛ مرز کنترل‌ها، آیکون‌ها و نشانگرهای نمودار ۳ به ۱ — هر دو حالت روشن و تیره، تضمین‌شده توسط pnpm tokens:check.',
  },
  {
    area: 'حلقهٔ فوکوس',
    rule: 'حلقهٔ ۲ پیکسلی --nds-focus-ring با فاصلهٔ ۲ پیکسل روی خود کنترل (از جمله ورودی‌های پنهان با :has(:focus-visible) یا data-focus-visible). هرگز حذف نمی‌شود و زیر نوارهای چسبان پنهان نمی‌گردد (WCAG 2.4.11).',
  },
  {
    area: 'اندازهٔ هدف لمسی',
    rule: 'حداقل ۴۴×۴۴ پیکسل برای همهٔ عناصر تعاملی (سخت‌گیرانه‌تر از ۲۴px در WCAG 2.5.8).',
  },
  {
    area: 'کیبورد',
    rule: 'تمامی کنش‌ها با ترتیب منطقی RTL از طریق کیبورد قابل اجرا هستند؛ مدیریت roving tabindex درون ویجت‌های ترکیبی به عهدهٔ React Aria است.',
  },
  {
    area: 'نام‌گذاری و گروه‌ها',
    rule: 'هر کنترل برچسب دیدنی دارد؛ دکمه‌های آیکونی دارای aria-label الزامی هستند؛ گروه‌های پرسش و فیلد از fieldset/legend یا role="group" با برچسب بهره می‌برند.',
  },
  {
    area: 'خطاها و اعلان‌های زنده',
    rule: 'خطاهای دقیق و درون‌خطی با aria-describedby، خلاصهٔ خطا در بالای فرم‌های بلند با پرش فوکوس به نخستین فیلد خطادار، و نواحی زنده (role="status" / role="alert") برای رویدادهای ناهمگام.',
  },
  {
    area: 'حرکت و کنتراست بالا',
    rule: 'احترام کامل به prefers-reduced-motion: reduce و forced-colors: active در تمامی اجزا و نمودارها.',
  },
  {
    area: 'ورود و احراز هویت (3.3.8)',
    rule: 'هیچ آزمون شناختی در ورود وجود ندارد؛ چسباندن (paste) در فیلد کد ۶ رقمی OTP و رمز عبور آزاد است.',
  },
  {
    area: 'تصاویر و زبان',
    rule: 'ویژگی alt در کامپوننت Image از نظر تایپ الزامی است؛ سند lang="fa" و dir="rtl" دارد و جزایر لاتین با dir="ltr" ایزوله می‌شوند.',
  },
] as const;

function AccessibilityFoundationPage() {
  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <Inline gap="2" align="center">
          <Badge tone="accent" size="sm">
            WCAG 2.2 AA · D-41
          </Badge>
        </Inline>
        <Heading level={1}>دسترس‌پذیری (Accessibility)</Heading>
        <Text as="p" size="lg" tone="muted" leading="text" measure>
          معیار الزام‌آور تمام محصولات نگرش <strong>WCAG 2.2 AA</strong> است (D-41). همهٔ
          کامپوننت‌های تعاملی روی React Aria Components ساخته شده‌اند و پیام‌های داخلی آن‌ها به
          فارسی بومی‌سازی شده است (D-97).
        </Text>
      </header>

      <section className={styles.section} aria-labelledby="a11y-checklist">
        <Heading level={2} id="a11y-checklist">
          چک‌لیست الزام‌آور هر کامپوننت
        </Heading>
        <TableWrap label="جدول چک‌لیست دسترس‌پذیری" desktopOnly>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">حوزه</th>
                <th scope="col">قاعده</th>
              </tr>
            </thead>
            <tbody>
              {CHECKLIST.map((item) => (
                <tr key={item.area}>
                  <th scope="row">{item.area}</th>
                  <td className={styles.muted}>{item.rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
        <ul className={`${styles.cards} ${styles.mobileOnly}`}>
          {CHECKLIST.map((item) => (
            <li key={item.area} className={styles.card}>
              <Text weight="bold">{item.area}</Text>
              <Text size="sm" tone="muted">
                {item.rule}
              </Text>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="a11y-assessment">
        <Heading level={2} id="a11y-assessment">
          قواعد اختصاصی آزمون‌ها و نمودارها
        </Heading>
        <ul className={fStyles.bullets}>
          <li>
            هر پرسش آزمون درون <code className={styles.code}>&lt;fieldset&gt;</code> با صورت پرسش
            در <code className={styles.code}>&lt;legend&gt;</code> و گزینه‌های واقعی{' '}
            <code className={styles.code}>&lt;input type="radio"&gt;</code> رندر می‌شود.
          </li>
          <li>
            شدت و وضعیت هرگز صرفاً با رنگ منتقل نمی‌شوند؛ همیشه واژهٔ فارسی و در صورت امکان آیکون
            همراه آن می‌آید. در نمای آرام (نوجوان و والدین) هیچ رنگ رز/قرمزی به کار نمی‌رود.
          </li>
          <li>
            تمامی نمودارهای SVG در رندر سرور و بدون جاوااسکریپت خوانا هستند و دارای خلاصهٔ یک‌جمله‌ای
            و جدول دادهٔ جایگزین (<code className={styles.code}>&lt;details&gt;</code>) می‌باشند.
          </li>
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="a11y-testing">
        <Heading level={2} id="a11y-testing">
          آزمون خودکار و دستی
        </Heading>
        <InlineAlert tone="info" title="دروازهٔ CI و بازبینی دستگاه واقعی">
          در هر تغییر، Playwright همراه با <code className={styles.code}>axe-core</code> روی همهٔ
          مسیرهای سایت در دو حالت روشن/تیره و دو عرض ۱۴۴۰ و ۳۹۰ پیکسل اجرا می‌شود و باید دقیقاً صفر
          خطا داشته باشد. بازبینی دستی با NVDA/Firefox، VoiceOver/Safari iOS، TalkBack/Chrome
          Android، بزرگ‌نمایی ۲۰۰٪ و Windows High Contrast پیش از انتشار نهایی (P8/P9) ثبت می‌شود.
        </InlineAlert>
      </section>
    </article>
  );
}
