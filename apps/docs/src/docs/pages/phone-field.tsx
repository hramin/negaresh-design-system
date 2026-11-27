import { Code, PhoneField, Stack, Text } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import { fieldA11y, fieldKeyboard } from './field-docs.ts';
import styles from './fields.module.css';

function Example() {
  const [phone, setPhone] = useState('');
  return (
    <div className={styles.example} data-interactive="phone-field">
      <Stack gap="3">
        <PhoneField
          label="شمارهٔ همراه"
          name="phone"
          value={phone}
          onChange={setPhone}
          isRequired
          description="شمارهٔ همراه ایرانی را وارد کنید؛ رقم فارسی نیز پذیرفته می‌شود."
        />
        <Text size="sm" tone="muted">
          مقدار فعلی برای برنامه
        </Text>
        <Code className={styles.output}>{phone || '—'}</Code>
      </Stack>
    </div>
  );
}

export const phoneFieldDoc: ComponentDoc = {
  slug: 'phone-field',
  title: 'شمارهٔ همراه',
  components: ['PhoneField'],
  base: 'TextField + @negaresh/utils',
  summary:
    'شمارهٔ همراه ایرانی با ورودی لاتین و جهت مستقل. پیشوندها و ارقام فارسی و عربی پذیرفته می‌شوند؛ شمارهٔ کامل به قالب +989… نرمال می‌شود.',
  status: 'approved',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="ورودی‌های پذیرفته‌شده">
        <State label="خالی">
          <PhoneField className={styles.field} label="شمارهٔ همراه" placeholder="0912 123 4567" />
        </State>
        <State label="شمارهٔ محلی">
          <PhoneField className={styles.field} label="همراه محلی" defaultValue="09121234567" />
        </State>
        <State label="شمارهٔ بین‌المللی">
          <PhoneField
            className={styles.field}
            label="همراه بین‌المللی"
            defaultValue="+989121234567"
          />
        </State>
        <State label="ارقام فارسی">
          <PhoneField
            className={styles.field}
            label="همراه با ارقام فارسی"
            defaultValue="۰۹۱۲۱۲۳۴۵۶۷"
          />
        </State>
      </GalleryRow>
      <GalleryRow title="حالت‌ها">
        <State label="شمارهٔ ناتمام">
          <PhoneField
            className={styles.field}
            label="در حال ویرایش"
            defaultValue="0912"
            description="ورودی ناتمام هنگام تایپ پاک نمی‌شود."
          />
        </State>
        <State label="خطادار">
          <PhoneField
            className={styles.field}
            label="همراه نامعتبر"
            defaultValue="0912"
            isInvalid
            errorMessage="شمارهٔ همراه را کامل وارد کنید."
          />
        </State>
        <State label="فقط‌خواندنی">
          <PhoneField
            className={styles.field}
            label="همراه تأییدشده"
            defaultValue="+989121234567"
            isReadOnly
          />
        </State>
        <State label="غیرفعال">
          <PhoneField
            className={styles.field}
            label="همراه غیرفعال"
            defaultValue="09121234567"
            isDisabled
          />
        </State>
        <State label="در حال بررسی">
          <PhoneField
            className={styles.field}
            label="بررسی شماره"
            defaultValue="09121234567"
            isPending
          />
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای تلفن همراه ایرانی از این فیلد استفاده کنید؛ همهٔ قالب‌های 09، 9، +98، 0098 و 98 پذیرفته می‌شوند.',
      'شمارهٔ کامل را با normalizePhone اعتبارسنجی کنید و مقدار +989… را ذخیره کنید.',
      'در نمایش عمومی، تلفن را با maskPhone پنهان کنید.',
    ],
    dont: [
      'ورودی ناتمام را هنگام تایپ حذف نکنید.',
      'از type="number" برای شمارهٔ تلفن استفاده نکنید؛ صفر نخست باید باقی بماند.',
    ],
  },
  keyboard: fieldKeyboard,
  a11y: fieldA11y,
  rtl: [
    'خود ورودی تلفن یک جزیرهٔ LTR با ارقام لاتین است؛ برچسب و خطای فارسی RTL می‌مانند.',
    'فاصله، خط تیره و پیشوند بین‌المللی با ابزار مشترک نرمال می‌شوند.',
  ],
};
