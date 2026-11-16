import { Code, SearchField, Stack, Text } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import { fieldA11y, fieldApi, fieldKeyboard, fieldRtl } from './field-docs.ts';
import styles from './fields.module.css';

function Example() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  return (
    <div className={styles.example} data-interactive="search-field">
      <Stack gap="3">
        <SearchField
          label="جست‌وجوی مستندات"
          name="query"
          value={query}
          onChange={setQuery}
          onSubmit={setSubmitted}
          onClear={() => setSubmitted('')}
          shortcutHint={<Code>Ctrl K</Code>}
          description="عبارت را وارد کنید و Enter بزنید؛ راهنمای میان‌بر به‌تنهایی میان‌بر سراسری نمی‌سازد."
        />
        <Text as="p" size="sm" tone="muted">
          عبارت ارسال‌شده:{' '}
          <output aria-label="عبارت ارسال‌شده">{submitted || 'هنوز عبارتی ارسال نشده است.'}</output>
        </Text>
      </Stack>
    </div>
  );
}

export const searchFieldDoc: ComponentDoc = {
  slug: 'search-field',
  title: 'جست‌وجو',
  components: ['SearchField'],
  base: 'SearchField',
  summary:
    'ورودی جست‌وجو با پاک‌کردن، ارسال با Enter و راهنمای اختیاری میان‌بر. مقدار جست‌وجو و نتیجهٔ ارسال از هم مستقل‌اند.',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="جست‌وجو و پاک‌کردن">
        <State label="خالی">
          <SearchField className={styles.field} label="جست‌وجو" placeholder="عنوان یا کلیدواژه" />
        </State>
        <State label="پرشده و دکمهٔ پاک‌کردن">
          <SearchField className={styles.field} label="جست‌وجوی پرشده" defaultValue="آزمون هوش" />
        </State>
        <State label="راهنمای میان‌بر">
          <SearchField
            className={styles.field}
            label="جست‌وجوی مستندات"
            shortcutHint={<Code>Ctrl K</Code>}
          />
        </State>
      </GalleryRow>
      <GalleryRow title="حالت‌ها">
        <State label="الزامی">
          <SearchField className={styles.field} label="عبارت الزامی" isRequired />
        </State>
        <State label="خطادار">
          <SearchField
            className={styles.field}
            label="عبارت نامعتبر"
            defaultValue="ا"
            isInvalid
            errorMessage="دست‌کم دو نویسه وارد کنید."
          />
        </State>
        <State label="غیرفعال">
          <SearchField
            className={styles.field}
            label="جست‌وجوی غیرفعال"
            defaultValue="گزارش"
            isDisabled
          />
        </State>
        <State label="فقط‌خواندنی">
          <SearchField
            className={styles.field}
            label="جست‌وجوی ثابت"
            defaultValue="آزمون"
            isReadOnly
          />
        </State>
        <State label="در حال جست‌وجو">
          <SearchField
            className={styles.field}
            label="بررسی جست‌وجو"
            defaultValue="نگرش"
            isPending
          />
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'نام حوزهٔ جست‌وجو را در برچسب بگویید.',
      'نتیجه، خطا و حالت خالیِ درخواست جست‌وجو را در برنامه مدیریت کنید.',
    ],
    dont: [
      'پاک‌کردن را به دکمه‌ای بدون نام قابل‌فهم تبدیل نکنید.',
      'نمایش راهنمای میان‌بر را معادل ثبت خودکار میان‌بر سراسری ندانید.',
    ],
  },
  api: [
    fieldApi('SearchField', [
      { name: 'onSubmit', type: '(value: string) => void', description: 'ارسال عبارت با Enter.' },
      {
        name: 'onClear',
        type: '() => void',
        description: 'پس از پاک‌کردن با دکمه یا رفتار بومی React Aria.',
      },
      {
        name: 'shortcutHint',
        type: 'ReactNode',
        description: 'راهنمای میان‌بر؛ ثبت میان‌بر سراسری مسئولیت برنامه است.',
      },
    ]),
  ],
  keyboard: [
    ...fieldKeyboard,
    { keys: 'Enter', action: 'ارسال عبارت جست‌وجو.' },
    { keys: 'Escape', action: 'پاک‌کردن عبارت مطابق رفتار React Aria.' },
  ],
  a11y: [...fieldA11y, 'دکمهٔ پاک‌کردن نام فارسی دارد؛ فقط هنگام وجود مقدار نمایش داده می‌شود.'],
  rtl: fieldRtl,
};
