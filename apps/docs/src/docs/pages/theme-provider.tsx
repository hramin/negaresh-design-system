import { Code, Stack, Text, useTheme } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';

function CurrentTheme() {
  const { theme } = useTheme();
  return (
    <Text>
      حالت فعلی: <Code>{theme}</Code>
    </Text>
  );
}

export const themeProviderDoc: ComponentDoc = {
  slug: 'theme-provider',
  title: 'ThemeProvider',
  components: ['ThemeProvider'],
  summary:
    'ریشهٔ هر برنامه: حالت روشن/تیره، تراکم، زبان React Aria و کاتالوگ پیام‌ها. انتخاب کاربر در کوکی می‌ماند تا رندر سرور بدون پرش باشد.',
  status: 'approved',
  products: ['R', 'N', 'T', 'V'],
  Example: () => (
    <Stack gap="2">
      <CurrentTheme />
      <Text size="sm" tone="muted">
        کلید حالت نمایش در بالای همین سایت از useTheme استفاده می‌کند.
      </Text>
    </Stack>
  ),
  Gallery: () => (
    <GalleryRow title="یک محتوا در دو حالت (data-theme روی هر ظرف)">
      {(['light', 'dark'] as const).map((t) => (
        <State key={t} label={`data-theme="${t}"`}>
          <div
            data-theme={t}
            style={{
              padding: 'var(--nds-space-4)',
              background: 'var(--nds-bg-canvas)',
              borderRadius: 'var(--nds-radius-md)',
            }}
          >
            <Text tone="default">متن اصلی</Text> <Text tone="accent">تأکید</Text>
          </div>
        </State>
      ))}
    </GalleryRow>
  ),
  usage: {
    do: [
      'کوکی nds-theme را در سرور بخوانید و data-theme را روی <html> رندر کنید (readThemeCookie، themeAttribute).',
      'faMessages را از @negaresh/react/messages/fa بدهید یا کاتالوگ خودتان را بسازید.',
    ],
    dont: ['شاخه زدن در کامپوننت‌ها بر اساس حالت؛ نام توکن‌ها در هر دو حالت یکی است.'],
  },
  a11y: [
    'I18nProvider جهت و تقویم را به همهٔ اجزای React Aria می‌دهد.',
    'رشته‌های پنهان React Aria (مانند دکمهٔ «بستن» در پاپ‌اور و پیام نگه‌داشتن منو) از طریق فرهنگ فارسی داخلی بومی‌سازی می‌شوند؛ در SSR می‌توانید ReactAriaLocalizationScript را در <head> بگذارید.',
  ],
  rtl: ['locale فارسی، جهت راست‌به‌چپ را برای کلیدهای جهت‌دار تعیین می‌کند.'],
};
