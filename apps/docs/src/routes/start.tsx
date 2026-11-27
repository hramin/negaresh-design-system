import { Badge, Heading, Inline, InlineAlert, Ltr, Section, Stack, Surface, Text } from '@negaresh/react';
import { createFileRoute, Link } from '@tanstack/react-router';
import styles from '../components/Page.module.css';
import { CodeBlock } from '../docs/ui.tsx';
import fStyles from './foundations/foundations.module.css';

export const Route = createFileRoute('/start')({
  head: () => ({ meta: [{ title: 'شروع کار · دیزاین سیستم نگرش' }] }),
  component: StartPage,
});

const INSTALL_SNIPPET = `pnpm add @negaresh/tokens @negaresh/theme-company @negaresh/react @negaresh/icons @negaresh/utils
# بسته‌های اختیاری بر اساس نیاز محصول:
pnpm add @negaresh/charts @negaresh/assessment @negaresh/patterns`;

const CSS_SNIPPET = `/* app.css — لایه‌های آبشاری NDS همیشه پیش از استایل اختصاصی برنامه می‌آیند (CLAUDE.md §6) */
@import "@negaresh/theme-company";

/* استایل اختصاصی محصول بیرون از لایه‌های @layer nds.* قرار می‌گیرد */`;

const ROOT_SNIPPET = `import {
  ThemeProvider,
  ReactAriaLocalizationScript,
  parseThemeChoice,
  readThemeCookie,
  serializeThemeCookie,
  themeAttribute,
} from '@negaresh/react';
import { faMessages } from '@negaresh/react/messages/fa';

// ۱) روی سرور: کوکی تم را بخوانید و data-theme را روی <html> بنشانید (بدون پرش رنگی)
const initialTheme = readThemeCookie(request.headers.get('cookie')) ?? 'system';

export function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" data-theme={themeAttribute(initialTheme)}>
      <head>
        {/* ۲) ترجمهٔ فارسی داخلی ۲۳ بستهٔ React Aria پیش از hydration (D-97) */}
        <ReactAriaLocalizationScript />
      </head>
      <body>
        <ThemeProvider
          messages={faMessages}
          defaultTheme={initialTheme}
          onThemeChange={(choice) => {
            document.cookie = serializeThemeCookie(choice);
          }}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}`;

const FORMATTING_SNIPPET = `import { formatDate, formatPrice, maskPhone, normalizeSerial } from '@negaresh/utils';
import { Code, Ltr } from '@negaresh/react';

// تاریخ جلالی با منطقهٔ زمانی تهران (هرگز منطقهٔ مرورگر)
const jalali = formatDate('2026-11-13T13:34:00Z');
// قیمت فقط به تومان با ارقام فارسی (D-26)
const price = formatPrice(490000);
// شمارهٔ ماسک‌شده برای حفظ حریم خصوصی
const phone = maskPhone('+989123456789');
// ایزوله‌سازی کدهای لاتین در متن فارسی (D-86)
const serialNode = <Code>{normalizeSerial('n25ag emv0k')}</Code>;`;

function StartPage() {
  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <Inline gap="2" align="center">
          <Badge tone="accent" size="sm">
            راهنمای راه‌اندازی
          </Badge>
          <Badge tone="neutral" size="sm">
            React 19 · TanStack Start · SSR
          </Badge>
        </Inline>
        <Heading level={1}>شروع کار با دیزاین سیستم نگرش</Heading>
        <Text as="p" size="lg" tone="muted" leading="text" measure>
          چگونه بسته‌های <Ltr>@negaresh/*</Ltr> را در یک برنامهٔ محصولی نصب، پیکربندی و بدون پرش
          تم در رندر سرور (SSR) اجرا کنیم.
        </Text>
      </header>

      <section className={styles.section} aria-labelledby="step-install">
        <Heading level={2} id="step-install">
          ۱. نصب بسته‌ها
        </Heading>
        <Text as="p" size="md" tone="muted" leading="text" measure>
          تمامی بسته‌ها به‌صورت ESM خالص، با TypeScript سخت‌گیرانه و ایمن برای رندر سرور منتشر
          می‌شوند و هیچ وابستگی به فریم‌ورک مسیریابی خاصی ندارند.
        </Text>
        <CodeBlock code={INSTALL_SNIPPET} label="نصب با pnpm" copyLabel="کپی دستور نصب" />
      </section>

      <section className={styles.section} aria-labelledby="step-css">
        <Heading level={2} id="step-css">
          ۲. فونت خودمیزبان و لایه‌های CSS
        </Heading>
        <Text as="p" size="md" tone="muted" leading="text" measure>
          بستهٔ <code className={styles.code}>@negaresh/theme-company</code> به‌طور یکجا متغیرهای
          توکن (<code className={styles.code}>company.css</code>)، فونت زیرمجموعه‌شدهٔ{' '}
          <strong>وزیرمتن</strong> (بدون نیاز به CDN خارجی) و ترتیب لایه‌های{' '}
          <code className={styles.codeWrap}>
            @layer nds.reset, nds.foundation, nds.components, nds.patterns, nds.utilities
          </code>{' '}
          را بارگذاری می‌کند.
        </Text>
        <CodeBlock code={CSS_SNIPPET} label="وارد کردن پوسته در CSS اصلی" copyLabel="کپی CSS" />
      </section>

      <section className={styles.section} aria-labelledby="step-provider">
        <Heading level={2} id="step-provider">
          ۳. <Ltr>ThemeProvider</Ltr>، کوکی تم SSR و بومی‌سازی React Aria
        </Heading>
        <Text as="p" size="md" tone="muted" leading="text" measure>
          برای جلوگیری از پرش حالت روشن/تیره در نخستین رندر، مقدار کوکی{' '}
          <code className={styles.code}>nds-theme</code> را روی سرور بخوانید و همان را روی{' '}
          <code className={styles.code}>data-theme</code> تگ <code className={styles.code}>html</code>{' '}
          و ویژگی <code className={styles.code}>defaultTheme</code> در{' '}
          <code className={styles.code}>ThemeProvider</code> بگذارید.
        </Text>
        <CodeBlock
          code={ROOT_SNIPPET}
          label="سند ریشه (SSR + ThemeProvider + D-97)"
          copyLabel="کپی نمونهٔ ریشه"
        />
        <InlineAlert tone="info" title="پیام‌های فارسی کامپوننت‌ها (D-94 و D-97)">
          کامپوننت‌های NDS هیچ رشتهٔ ثابت فارسی درون کد ندارند. مجموعهٔ{' '}
          <code className={styles.code}>faMessages</code> از{' '}
          <code className={styles.code}>@negaresh/react/messages/fa</code> آمادهٔ استفاده است و
          تگ <code className={styles.code}>ReactAriaLocalizationScript</code> پیام‌های صفحه‌خوان ۲۳
          بستهٔ داخلی React Aria را پیش از hydration به فارسی تنظیم می‌کند.
        </InlineAlert>
      </section>

      <section className={styles.section} aria-labelledby="step-utils">
        <Heading level={2} id="step-utils">
          ۴. قالب‌بندی اعداد، تاریخ جلالی، تومان و کدهای لاتین
        </Heading>
        <Text as="p" size="md" tone="muted" leading="text" measure>
          هرگز تاریخ، تومان، شمارهٔ موبایل یا سریال را به‌صورت دستی قالب‌بندی نکنید؛ همهٔ توابع
          تست‌شده در <code className={styles.code}>@negaresh/utils</code> هستند.
        </Text>
        <CodeBlock code={FORMATTING_SNIPPET} label="نمونهٔ @negaresh/utils" copyLabel="کپی نمونه" />
      </section>

      <section className={styles.section} aria-labelledby="next-links">
        <Heading level={2} id="next-links">
          گام‌های بعدی
        </Heading>
        <div className={fStyles.grid3}>
          <Surface>
            <Section>
              <Stack gap="2">
                <Heading level={3}>توکن‌ها و رنگ</Heading>
                <Text size="sm" tone="muted">
                  ۱۱۸ متغیر CSS با کنتراست تضمینی در روشن و تیره.
                </Text>
                <Link to="/tokens" className={styles.link}>
                  مشاهدهٔ همهٔ توکن‌ها
                </Link>
              </Stack>
            </Section>
          </Surface>
          <Surface>
            <Section>
              <Stack gap="2">
                <Heading level={3}>آداپتور فرم</Heading>
                <Text size="sm" tone="muted">
                  الگوی اتصال فیلدهای NDS به TanStack Form و Zod v4.
                </Text>
                <Link to="/guides/tanstack-form-zod" className={styles.link}>
                  مشاهدهٔ راهنمای فرم
                </Link>
              </Stack>
            </Section>
          </Surface>
          <Surface>
            <Section>
              <Stack gap="2">
                <Heading level={3}>الگوها و کامپوننت‌ها</Heading>
                <Text size="sm" tone="muted">
                  مرور کاتالوگ کامل اجزای تاییدشده به تفکیک محصول.
                </Text>
                <Link to="/components" className={styles.link}>
                  فهرست کامپوننت‌ها
                </Link>
              </Stack>
            </Section>
          </Surface>
        </div>
      </section>
    </article>
  );
}
