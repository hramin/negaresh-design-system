import { Stack, TextField } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import { fieldA11y, fieldKeyboard, fieldRtl } from './field-docs.ts';
import styles from './fields.module.css';

function Example() {
  const [name, setName] = useState('نگارش برتر');
  return (
    <div className={styles.example} data-interactive="text-field">
      <TextField
        label="نام سازمان"
        name="organization"
        value={name}
        onChange={setName}
        description="همین نام روی گزارش‌های شما نمایش داده می‌شود."
        maxLength={40}
        showCharacterCount
      />
    </div>
  );
}

export const textFieldDoc: ComponentDoc = {
  slug: 'text-field',
  title: 'فیلد متن',
  components: ['TextField'],
  base: 'TextField',
  summary:
    'ورودی تک‌خطی با برچسب، راهنما، خطا، پیشوند و پسوند؛ شمارندهٔ نویسه و اعتبارسنجی بدون حذف رفتار بومی ویرایش.',
  status: 'approved',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="مقدار و راهنما">
        <State label="خالی">
          <TextField className={styles.field} label="نام" placeholder="نام خود را وارد کنید" />
        </State>
        <State label="پرشده">
          <TextField
            className={styles.field}
            label="نام سازمان"
            defaultValue="نگارش برتر"
            description="نام رسمی سازمان"
          />
        </State>
        <State label="الزامی">
          <TextField className={styles.field} label="عنوان درخواست" isRequired />
        </State>
      </GalleryRow>
      <GalleryRow title="حالت‌های فیلد">
        <State label="غیرفعال">
          <TextField
            className={styles.field}
            label="شناسهٔ سازمان"
            defaultValue="ثبت نشده"
            isDisabled
          />
        </State>
        <State label="فقط‌خواندنی">
          <TextField
            className={styles.field}
            label="نام ثبت‌شده"
            defaultValue="نگارش برتر"
            isReadOnly
          />
        </State>
        <State label="خطادار">
          <TextField
            className={styles.field}
            label="نام"
            defaultValue="ن"
            isInvalid
            errorMessage="نام را کامل وارد کنید."
          />
        </State>
        <State label="در حال بررسی">
          <TextField
            className={styles.field}
            label="نام کاربری"
            defaultValue="negaresh"
            isPending
          />
        </State>
      </GalleryRow>
      <GalleryRow title="پیشوند، پسوند و شمارنده">
        <State label="prefix / suffix">
          <TextField
            className={styles.field}
            label="نام نشانی"
            prefix="@"
            suffix=".ir"
            defaultValue="negaresh"
          />
        </State>
        <State label="showCharacterCount">
          <TextField
            className={styles.field}
            label="عنوان کوتاه"
            defaultValue="درخواست تازه"
            maxLength={30}
            showCharacterCount
          />
        </State>
        <State label="اندازه‌ها">
          <Stack gap="3">
            <TextField label="کوچک" size="sm" />
            <TextField label="متوسط" />
            <TextField label="بزرگ" size="lg" />
          </Stack>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای مقدار تک‌خطی از TextField استفاده کنید؛ برچسب را حتی با وجود placeholder نگه دارید.',
      'خطا را کنار همان فیلد و با راه اصلاح بنویسید.',
    ],
    dont: [
      'placeholder را جای برچسب نگذارید.',
      'برای شمارهٔ تلفن یا سریال، منطق نرمال‌سازی را دوباره ننویسید؛ از فیلد تخصصی استفاده کنید.',
    ],
  },
  keyboard: fieldKeyboard,
  a11y: fieldA11y,
  rtl: fieldRtl,
};
