import { iconBook, iconHelp } from '@negaresh/icons';
import { Accordion, AccordionItem, Disclosure, Stack, Text } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './navigation.module.css';

function Example() {
  return (
    <div className={styles.block} data-interactive="disclosure">
      <Stack gap="6">
        <Disclosure title="راهنمای دریافت کد سیستم" icon={iconHelp} variant="surface">
          <Text as="p" size="sm" leading="text">
            در نرم‌افزار ویندوزی، پنجرهٔ فعال‌سازی را باز کنید؛ کد ۹ رقمی سیستم به صورت خودکار ساخته
            و در صورت کلیک روی «فعال‌سازی آنلاین» به همین صفحه منتقل می‌شود.
          </Text>
        </Disclosure>

        <Accordion defaultExpandedKeys={['faq-1']}>
          <AccordionItem id="faq-1" title="نصب دوباره روی همان رایانه سقف را مصرف می‌کند؟">
            خیر؛ اگر همان سخت‌افزار باشد، کد فعال‌سازی قبلی بدون کم شدن از سهمیه نمایش داده می‌شود.
          </AccordionItem>
          <AccordionItem id="faq-2" title="اگر رایانه را عوض کنم چه کار کنم؟">
            در صورتی که سقف سریال پر شده باشد، می‌توانید مستقیماً یک فعال‌سازی تازه بخرید.
          </AccordionItem>
          <AccordionItem id="faq-3" title="ساعات پاسخ‌گویی پشتیبانی چه زمانی است؟">
            شنبه تا چهارشنبه از ساعت ۹ تا ۱۷ از طریق تلفن و تیکت پاسخ‌گو هستیم.
          </AccordionItem>
        </Accordion>
      </Stack>
    </div>
  );
}

export const disclosureDoc: ComponentDoc = {
  slug: 'disclosure',
  title: 'بخش بازشونده و آکاردئون (Disclosure / Accordion)',
  components: ['Disclosure', 'Accordion', 'AccordionItem'],
  summary:
    'بخش‌های بازشونده و آکاردئون ساخته‌شده روی React Aria Disclosure و DisclosureGroup برای پرسش‌های متداول (FAQ)، سرفصل دوره‌ها و راهنمای موبایل رجیستری.',
  status: 'approved',
  products: ['R', 'N', 'T', 'V'],
  base: 'React Aria Disclosure / DisclosureGroup / DisclosurePanel',
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="سرفصل دوره (چندبازشونده با متادیتا)">
        <State label="Accordion · allowsMultipleExpanded">
          <div className={styles.block}>
            <Accordion allowsMultipleExpanded defaultExpandedKeys={['m1']} variant="bordered">
              <AccordionItem id="m1" title="فصل اول: مبانی روان‌سنجی" icon={iconBook} meta="۴ درس · ۴۵ دقیقه">
                آشنایی با روایی، پایایی و هنجاریابی آزمون‌های شناختی.
              </AccordionItem>
              <AccordionItem id="m2" title="فصل دوم: اجرا و نمره‌گذاری" icon={iconBook} meta="۶ درس · ۱ ساعت">
                پروتکل اجرای استاندارد و محاسبهٔ نمره‌های تراز.
              </AccordionItem>
              <AccordionItem id="m3" title="فصل سوم: گزارش‌نویسی بالینی" icon={iconBook} meta="به‌زودی" isDisabled>
                در حال آماده‌سازی.
              </AccordionItem>
            </Accordion>
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="حالت ساده (plain) برای راهنمای موبایل رجیستری">
        <State label="Disclosure · plain · defaultExpanded">
          <div className={styles.block}>
            <Disclosure title="راهنمای فعال‌سازی" icon={iconHelp} variant="plain" defaultExpanded>
              <Text as="p" size="sm" leading="text">
                با ویژگی alwaysExpandedAbove=&quot;md&quot; در دسکتاپ همیشه باز می‌ماند و در موبایل
                زیر دکمهٔ راهنما جمع می‌شود.
              </Text>
            </Disclosure>
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای پرسش‌های متداول (تک‌بازشونده) از Accordion و برای سرفصل دوره‌ها از allowsMultipleExpanded استفاده کنید.',
      'در راهنمای کناری رجیستری alwaysExpandedAbove="md" را فعال کنید تا بدون ناهماهنگی SSR در دسکتاپ باز و در موبایل بسته باشد.',
    ],
    dont: [
      'اطلاعات خطای حیاتی یا دکمه‌های اصلی فرم را درون بخش بسته پنهان نکنید.',
    ],
  },
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'حرکت بین دکمه‌های عنوان.' },
    { keys: 'Enter / Space', action: 'باز یا بسته کردن پنل محتوا.' },
  ],
  a11y: [
    'از aria-expanded و aria-controls استاندارد React Aria Disclosure استفاده می‌کند.',
    'دکمهٔ هر بخش حداقل ۴۴ پیکسل ارتفاع لمسی دارد و چرخش پیکان از prefers-reduced-motion پیروی می‌کند.',
  ],
  rtl: [
    'متن دکمه به ابتدای سطر (راست) و متادیتا و پیکان به انتهای سطر (چپ) تراز می‌شوند.',
  ],
};
