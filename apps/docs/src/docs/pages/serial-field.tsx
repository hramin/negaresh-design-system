import { Code, CodeField, SerialField, Stack, Text } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import { fieldA11y, fieldApi, fieldKeyboard } from './field-docs.ts';
import styles from './fields.module.css';

function Example() {
  const [serial, setSerial] = useState('N25AGEMV0K');
  return (
    <div className={styles.example} data-interactive="serial-field">
      <Stack gap="3">
        <SerialField
          label="سریال نرم‌افزار"
          name="serial"
          value={serial}
          onChange={setSerial}
          isRequired
        />
        <Text size="sm" tone="muted">
          مقدار نرمال‌شده برای ذخیره و کپی
        </Text>
        <Code className={styles.output}>{serial || '—'}</Code>
        <CodeField
          label="کد سیستم"
          name="systemCode"
          defaultValue="882859354"
          isReadOnly
          description="کدی که برنامه از رایانه دریافت می‌کند؛ محدودیت سریال ۵–۵ ندارد."
        />
      </Stack>
    </div>
  );
}

export const serialFieldDoc: ComponentDoc = {
  slug: 'serial-field',
  title: 'سریال و کد',
  components: ['SerialField', 'CodeField'],
  base: 'TextField + @negaresh/utils',
  summary:
    'سریال با حروف بزرگ و الگوی ۵–۵ نمایش داده می‌شود؛ مقدار ذخیره‌شده فاصله و خط تیره ندارد. CodeField برای کدهای عمومی بدون محدودیت طول سریال است.',
  status: 'review',
  products: ['R', 'N', 'T'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="سریال و الگو">
        <State label="خالی">
          <SerialField className={styles.field} label="سریال" />
        </State>
        <State label="پرشده">
          <SerialField
            className={styles.field}
            label="سریال خریداری‌شده"
            defaultValue="n25ag emv0k"
          />
        </State>
        <State label="الزامی">
          <SerialField className={styles.field} label="سریال الزامی" isRequired />
        </State>
        <State label="الگوی اختصاصی">
          <SerialField
            className={styles.field}
            label="سریال سازمان"
            groups={[4, 4, 4]}
            defaultValue="ABCD1234EFGH"
          />
        </State>
      </GalleryRow>
      <GalleryRow title="حالت‌ها">
        <State label="خطادار">
          <SerialField
            className={styles.field}
            label="سریال نامعتبر"
            defaultValue="N25AG"
            isInvalid
            errorMessage="سریال را کامل، مطابق الگو وارد کنید."
          />
        </State>
        <State label="فقط‌خواندنی">
          <SerialField
            className={styles.field}
            label="سریال ثبت‌شده"
            defaultValue="N25AGEMV0K"
            isReadOnly
          />
        </State>
        <State label="غیرفعال">
          <SerialField
            className={styles.field}
            label="سریال غیرفعال"
            defaultValue="N25AGEMV0K"
            isDisabled
          />
        </State>
        <State label="در حال بررسی">
          <SerialField
            className={styles.field}
            label="بررسی سریال"
            defaultValue="N25AGEMV0K"
            isPending
          />
        </State>
      </GalleryRow>
      <GalleryRow title="کد عمومی">
        <State label="کد سیستم">
          <CodeField
            className={styles.field}
            label="کد سیستم"
            defaultValue="882859354"
            isReadOnly
          />
        </State>
        <State label="کد با ارقام فارسی">
          <CodeField className={styles.field} label="کد پیگیری" defaultValue="۱۲۳۴۵۶۷۸۹" />
        </State>
        <State label="کد خطادار">
          <CodeField
            className={styles.field}
            label="کد فعال‌سازی"
            defaultValue="123"
            isInvalid
            errorMessage="کد فعال‌سازی را کامل وارد کنید."
          />
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای سریال محصول از SerialField و برای کد عمومی از CodeField استفاده کنید.',
      'راهنمای الگو را نزدیک ورودی نگه دارید؛ مقایسه و کپی با مقدار نرمال‌شده انجام می‌شود.',
    ],
    dont: [
      'کاراکترهای شبیه O و 0 را بی‌خبر جایگزین نکنید.',
      'الگوی ۵–۵ سریال را به کد سیستم یا کد پیگیری تحمیل نکنید.',
      'متن اضافی را پنهانی قطع نکنید؛ خطای مشخص نشان دهید.',
    ],
  },
  api: [
    fieldApi('SerialField', [
      {
        name: 'groups',
        type: 'readonly number[]',
        default: '[5, 5]',
        description: 'طول گروه‌های سریال برای نمایش و اعتبارسنجی.',
      },
      {
        name: 'showPatternHint',
        type: 'boolean',
        default: 'true',
        description: 'نمایش راهنمای الگوی سریال.',
      },
      {
        name: 'onChange',
        type: '(value: string) => void',
        description: 'مقدار نرمال‌شده با حروف بزرگ، ارقام لاتین و بدون فاصله/خط تیره.',
      },
    ]),
    fieldApi('CodeField', [
      {
        name: 'value / onChange',
        type: 'string / (value: string) => void',
        description: 'نرمال‌سازی مشترک کد؛ بدون اجبار الگوی ۵–۵ یا طول سریال.',
      },
    ]),
  ],
  keyboard: fieldKeyboard,
  a11y: fieldA11y,
  rtl: [
    'ورودی و مقدار کد LTR و لاتین‌اند و با قلم کد نمایش داده می‌شوند.',
    'جای نشانگر و انتخاب متن هنگام ویرایش میانی و چسباندن حفظ می‌شود.',
  ],
};
