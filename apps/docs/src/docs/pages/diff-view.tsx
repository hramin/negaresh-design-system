import { DiffView, type DiffMode, Stack, Text } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './data-display.module.css';

const BEFORE_ARTICLE = `آزمون هوش نگارش برای ارزیابی دقیق توانایی‌های شناختی طراحی شده است.
مدت زمان پاسخ‌گویی ۴۵ دقیقه است.
گزارش نهایی تنها در نمای تخصصی ارائه می‌شود.`;

const AFTER_ARTICLE = `آزمون هوش نگارش برای ارزیابی دقیق توانایی‌های شناختی در کلینیک‌ها طراحی شده است.
مدت زمان پاسخ‌گویی ۴۵ دقیقه است.
گزارش نهایی در دو نمای تخصصی و آرام (برای نوجوانان و والدین) ارائه می‌شود.
نسخهٔ چاپی A4 با حاشیهٔ استاندارد قابل دریافت است.`;

function Example() {
  const [mode, setMode] = useState<DiffMode>('unified');

  return (
    <div className={styles.wide} data-interactive="diff-view">
      <Stack gap="3">
        <DiffView
          title="تغییرات متن معرفی آزمون"
          beforeLabel="نسخهٔ ۳ (۱۸ آبان ۱۴۰۵)"
          afterLabel="نسخهٔ ۴ (۲۲ آبان ۱۴۰۵)"
          before={BEFORE_ARTICLE}
          after={AFTER_ARTICLE}
          mode={mode}
          onModeChange={setMode}
          allowModeToggle
        />
        <Text size="xs" tone="muted" className={styles.output}>
          نمای فعال: {mode === 'unified' ? 'یکپارچه' : 'کنار هم'}
        </Text>
      </Stack>
    </div>
  );
}

export const diffViewDoc: ComponentDoc = {
  slug: 'diff-view',
  title: 'مقایسهٔ تغییرات (DiffView)',
  components: ['DiffView', 'computeLineDiff'],
  summary:
    'مقایسهٔ نسخه‌های متنی یا پیکربندی با نمایش افزوده‌ها و حذف‌ها به کمک علامت، آیکون، برچسب‌های <ins>/<del> و رنگ‌های معنایی (هرگز رنگ به تنهایی)، با پشتیبانی از کدهای LTR.',
  status: 'review',
  products: ['N', 'R'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="نمای یکپارچه (متن فارسی با بخش‌های برجستهٔ درون‌خطی)">
        <State label="unified · inline highlights">
          <div className={styles.wide}>
            <DiffView
              title="ویرایش یادداشت ممیزی"
              beforeLabel="نسخهٔ ۱"
              afterLabel="نسخهٔ ۲"
              lines={[
                {
                  type: 'context',
                  content: 'محصول: نگارش تست هوش ۴',
                  oldLineNumber: 1,
                  newLineNumber: 1,
                },
                {
                  type: 'removed',
                  content: 'سقف مؤثر فعال‌سازی: ۱ رایانه (منبع: محصول)',
                  oldLineNumber: 2,
                  inlineSegments: [
                    { text: 'سقف مؤثر فعال‌سازی: ' },
                    { text: '۱ رایانه (منبع: محصول)', changed: true },
                  ],
                },
                {
                  type: 'added',
                  content: 'سقف مؤثر فعال‌سازی: ۳ رایانه (منبع: اختصاصی مشتری)',
                  newLineNumber: 2,
                  inlineSegments: [
                    { text: 'سقف مؤثر فعال‌سازی: ' },
                    { text: '۳ رایانه (منبع: اختصاصی مشتری)', changed: true },
                  ],
                },
              ]}
            />
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="نمای کنار هم (Split · کد و پیکربندی LTR)">
        <State label="split · isCode · LTR">
          <div className={styles.wide}>
            <DiffView
              title="تغییر سیاست سریال N25AG-EMV0K"
              beforeLabel="قبل"
              afterLabel="بعد"
              mode="split"
              isCode
              before={'serial=N25AG-EMV0K\nlimit=1\nsource=product\nstatus=active'}
              after={'serial=N25AG-EMV0K\nlimit=3\nsource=customer\nstatus=active'}
            />
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای مقایسهٔ ویرایش‌های محتوایی تحریریه و تاریخچهٔ تغییر تنظیمات مدیریتی از DiffView استفاده کنید.',
      'برای سریال‌ها، کدهای سیستم و پیکربندی‌های لاتین ویژگی isCode را فعال کنید تا ایزوله‌سازی LTR (D-86) اعمال شود.',
      'در عرض موبایل (< ۹۰۰ پیکسل) نمای کنار هم به طور خودکار روی هم چیده می‌شود تا اسکرول افقی ایجاد نشود.',
    ],
    dont: [
      'تغییرات را صرفاً با رنگ پس‌زمینه نشان ندهید؛ نشانگرهای +/− و برچسب‌های <ins>/<del> همواره حفظ می‌شوند.',
    ],
  },
  api: [
    {
      name: 'DiffView',
      props: [
        { name: 'before / after', type: 'string', description: 'متن نسخهٔ قبل و بعد برای محاسبهٔ خودکار تفاوت خطی (computeLineDiff).' },
        { name: 'lines', type: 'readonly DiffLine[]', description: 'خطوط آماده همراه با inlineSegments اختیاری برای برجسته‌سازی درون‌خطی.' },
        { name: 'beforeLabel / afterLabel', type: 'ReactNode', description: 'برچسب نسخهٔ قدیم و جدید در سرصفحه و ستون‌های Split.' },
        { name: 'mode / defaultMode / onModeChange', type: "'unified' | 'split'", default: "'unified'", description: 'نمای یکپارچه یا کنار هم (زیر ۹۰۰ پیکسل خودکار ستونی می‌شود).' },
        { name: 'allowModeToggle', type: 'boolean', default: 'false', description: 'نمایش کلید تغییر حالت یکپارچه/کنار هم در سرصفحه.' },
        { name: 'isCode / dir', type: "boolean / 'rtl' | 'ltr' | 'auto'", default: 'false', description: 'نمایش تک‌عرض چپ‌به‌راست ایزوله برای کدها و سریال‌ها.' },
        { name: 'showLineNumbers', type: 'boolean', default: 'true', description: 'نمایش ستون شمارهٔ خطوط با ارقام فارسی.' },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab / ArrowLeft / ArrowRight', action: 'تغییر بین نمای «یکپارچه» و «کنار هم» در گروه دکمه‌های سرصفحه.' },
  ],
  a11y: [
    'هر خط افزوده با <ins> و پیشوند مخفی «افزوده‌شده:» و هر خط حذف با <del> و «حذف‌شده:» علامت‌گذاری می‌شود.',
    'در حالت forced-colors، خطوط افزوده با حاشیهٔ ممتد Highlight و خطوط حذف با حاشیهٔ خط‌چین متمایز می‌مانند.',
  ],
  rtl: [
    'متن فارسی راست‌چین می‌ماند و خطوط کد با dir="ltr" و unicode-bidi: isolate نمایش داده می‌شوند.',
  ],
};
