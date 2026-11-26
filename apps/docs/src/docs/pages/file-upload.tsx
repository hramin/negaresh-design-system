import {
  DropZone,
  FileUpload,
  type FileUploadItem,
  Stack,
  Text,
} from '@negaresh/react';
import { toPersianDigits } from '@negaresh/utils';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './fields.module.css';

const SAMPLE_ITEMS: readonly FileUploadItem[] = [
  {
    id: 'g-1',
    name: 'serials-batch-1405.csv',
    size: 148 * 1024,
    type: 'text/csv',
    status: 'complete',
  },
  {
    id: 'g-2',
    name: 'campaign-roster.csv',
    size: 420 * 1024,
    type: 'text/csv',
    status: 'uploading',
    progress: 64,
  },
  {
    id: 'g-3',
    name: 'broken-import.txt',
    size: 18 * 1024,
    type: 'text/plain',
    status: 'error',
    error: 'ستون سریال در سطر ۳ خالی است.',
  },
];

function Example() {
  const [items, setItems] = useState<FileUploadItem[]>([
    {
      id: 'ex-1',
      name: 'serials-1405.csv',
      size: 92 * 1024,
      type: 'text/csv',
      status: 'complete',
    },
  ]);

  return (
    <div className={styles.example} data-interactive="file-upload">
      <Stack gap="4">
        <FileUpload
          id="docs-file-upload-live"
          name="serialBatch"
          label="فهرست سریال‌ها یا تصاویر"
          hint="قالب‌های مجاز: CSV، TXT، PNG، JPG · حداکثر ۲ مگابایت · تا ۳ پرونده"
          description="پرونده را بکشید و رها کنید یا با دکمهٔ زیر از دستگاه انتخاب نمایید."
          accept={['.csv', '.txt', 'text/csv', 'text/plain', 'image/png', 'image/jpeg']}
          maxFileSize={2 * 1024 * 1024}
          maxFiles={3}
          allowsMultiple
          items={items}
          onItemsChange={setItems}
        />
        <Text size="sm" tone="muted" className={styles.output}>
          تعداد پرونده‌های انتخاب‌شده: {toPersianDigits(items.length)}
        </Text>
      </Stack>
    </div>
  );
}

export const fileUploadDoc: ComponentDoc = {
  slug: 'file-upload',
  title: 'بارگذاری پرونده (FileUpload / DropZone)',
  components: ['FileUpload', 'DropZone'],
  base: 'DropZone, FileTrigger, ProgressBar',
  summary:
    'منطقهٔ کشیدن و رها کردن همراه با دکمهٔ دسترس‌پذیر انتخاب پرونده، اعتبارسنجی فارسی نوع/حجم/تعداد، فهرست پرونده‌ها با دکمهٔ حذف و حالت‌های پیشرفت و خطا.',
  status: 'review',
  products: ['R', 'N', 'T'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="منطقهٔ رهاسازی و بارگذاری">
        <State label="خالی (تک‌پرونده)">
          <div className={styles.field}>
            <FileUpload
              label="درون‌ریزی سریال‌ها"
              hint="فقط CSV یا TXT · حداکثر ۵ مگابایت"
              accept={['.csv', '.txt']}
            />
          </div>
        </State>
        <State label="چندپرونده با فهرست وضعیت‌ها">
          <div className={styles.field}>
            <FileUpload
              label="پرونده‌های پیوست"
              hint="CSV، TXT یا تصویر · حداکثر ۵ پرونده"
              allowsMultiple
              defaultItems={SAMPLE_ITEMS}
            />
          </div>
        </State>
        <State label="DropZone مستقل">
          <div className={styles.field}>
            <DropZone
              aria-label="منطقهٔ رهاسازی تصویر دوره"
              prompt="تصویر شاخص را اینجا رها کنید"
              hint="PNG یا WebP · نسبت ۱۶:۹"
              accept={['image/png', 'image/webp']}
            />
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="حالت‌های خطا و غیرفعال">
        <State label="خطای اعتبارسنجی فیلد">
          <div className={styles.field}>
            <FileUpload
              label="فهرست آزمون‌دهندگان"
              hint="قالب CSV الزامی است"
              isInvalid
              errorMessage="قالب پروندهٔ «list.pdf» مجاز نیست (قالب‌های مجاز: .csv)."
            />
          </div>
        </State>
        <State label="غیرفعال">
          <div className={styles.field}>
            <FileUpload
              label="بارگذاری در انتظار مجوز"
              hint="فقط برای نقش مدیر فعال است"
              isDisabled
              defaultItems={[
                {
                  id: 'dis-1',
                  name: 'archive-1404.csv',
                  size: 64 * 1024,
                  type: 'text/csv',
                  status: 'complete',
                },
              ]}
            />
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'قالب‌های مجاز (accept) و سقف حجم (maxFileSize) را هم در ویژگی‌ها و هم در متن راهنما (hint) مشخص کنید.',
      'برای درون‌ریزی CSV سریال‌ها، فهرست آزمون‌دهندگان کمپین و رسانهٔ سایت اصلی از FileUpload استفاده کنید.',
      'همیشه برای هر پرونده دکمهٔ حذف با برچسب نام همان پرونده نگه دارید.',
    ],
    dont: [
      'بارگذاری را محدود به کشیدن و رها کردن نکنید؛ دکمهٔ FileTrigger باید همیشه با صفحه‌کلید و لمس در دسترس باشد (WCAG 2.5.7).',
      'حالت پیشرفت یا خطای پرونده را تنها با رنگ نشان ندهید؛ از درصد فارسی، آیکون و پیام صریح استفاده کنید.',
    ],
  },
  api: [
    {
      name: 'FileUpload',
      props: [
        { name: 'label', type: 'ReactNode', description: 'برچسب الزامی فیلد بارگذاری.' },
        {
          name: 'items / defaultItems / onItemsChange',
          type: 'readonly FileUploadItem[] / (items: FileUploadItem[]) => void',
          description: 'فهرست کنترل‌شده یا اولیهٔ پرونده‌ها (ساختار ساده و سازگار با SSR).',
        },
        {
          name: 'onSelectFiles / onRemove / onReject',
          type: '(files: File[]) => void / (id: string) => void / (rejections: FileRejection[]) => void',
          description: 'رویدادهای انتخاب، حذف و رد شدن پرونده‌ها همراه با کد و پیام فارسی خطا.',
        },
        {
          name: 'accept / maxFileSize / maxFiles / allowsMultiple',
          type: 'readonly string[] / number / number / boolean',
          description: 'قواعد اعتبارسنجی نوع پرونده، سقف حجم به بایت، حداکثر تعداد و انتخاب چندگانه.',
        },
        {
          name: 'prompt / hint / actionLabel / description / errorMessage',
          type: 'ReactNode',
          description: 'متن‌های راهنما و خطا؛ مقادیر پیش‌فرض از NdsMessages خوانده می‌شوند.',
        },
        {
          name: 'id / name / isDisabled / isInvalid / isRequired / className / ref',
          type: 'Field props',
          description: 'شناسهٔ دکمهٔ انتخاب (برای FormErrorSummary)، اتصال به validationErrors فرم و ویژگی‌های ریشه.',
        },
      ],
    },
    {
      name: 'DropZone',
      props: [
        {
          name: 'prompt / hint / actionLabel',
          type: 'ReactNode',
          description: 'متن دعوت به رهاسازی، راهنمای کوتاه و عنوان دکمهٔ FileTrigger.',
        },
        {
          name: 'accept / allowsMultiple / onSelectFiles',
          type: 'readonly string[] / boolean / (files: File[]) => void',
          description: 'فیلتر اولیه و بازگردانی پرونده‌های رهاشده یا انتخاب‌شده.',
        },
        {
          name: 'isDisabled / isInvalid / buttonId / aria-label / aria-labelledby',
          type: 'boolean / string',
          description: 'حالت‌های غیرفعال/خطادار و نام دسترس‌پذیر ناحیهٔ رهاسازی.',
        },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'حرکت میان ناحیهٔ DropZone، دکمهٔ «انتخاب پرونده» و دکمه‌های حذف پرونده‌ها.' },
    { keys: 'Enter / Space روی دکمهٔ انتخاب', action: 'باز کردن پنجرهٔ انتخاب پروندهٔ سیستم‌عامل (جایگزین بدون کشیدن).' },
    { keys: 'Enter / Space روی دکمهٔ حذف', action: 'حذف همان پرونده از فهرست و به‌روزرسانی وضعیت.' },
  ],
  a11y: [
    'بر پایهٔ React Aria DropZone و FileTrigger ساخته شده و همهٔ رشته‌های داخلی @react-aria/dnd از طریق faReactAriaStrings فارسی هستند (D-97).',
    'دکمهٔ انتخاب پرونده جایگزین کامل بدون کشیدن (WCAG 2.2 AA 2.5.7) با هدف لمسی ≥ ۴۴×۴۴ پیکسل است.',
    'خطاهای نوع، حجم و تعداد در role="alert" با آیکون و متن مشخص اعلام می‌شوند؛ نوار پیشرفت با React Aria ProgressBar و درصد فارسی خوانده می‌شود.',
    'نام پرونده‌ها با unicode-bidi: isolate جدا شده‌اند و دکمهٔ حذف برچسب اختصاصی «حذف پروندهٔ «…»» دارد.',
  ],
  rtl: [
    'چیدمان کارت‌های فهرست، فاصله‌ها و نوار پیشرفت با ویژگی‌های منطقی CSS در RTL و LTR کار می‌کنند.',
    'حجم پرونده‌ها با ارقام و واحدهای فارسی (بایت، کیلوبایت، مگابایت، گیگابایت) از طریق NdsMessages قالب‌بندی می‌شود.',
  ],
};
