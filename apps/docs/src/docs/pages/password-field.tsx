import { PasswordField } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import { fieldA11y, fieldApi, fieldKeyboard, fieldRtl } from './field-docs.ts';
import styles from './fields.module.css';

export const passwordFieldDoc: ComponentDoc = {
  slug: 'password-field',
  title: 'گذرواژه',
  components: ['PasswordField'],
  base: 'TextField + Button',
  summary:
    'گذرواژه با امکان نمایش یا پنهان کردن و راهنمای قدرت از برنامه. چسباندن و مدیر گذرواژه مسدود نمی‌شوند.',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  Example: () => (
    <div className={styles.example} data-interactive="password-field">
      <PasswordField
        label="گذرواژهٔ تازه"
        name="password"
        autoComplete="new-password"
        description="گذرواژه‌ای طولانی و متفاوت از حساب‌های دیگر انتخاب کنید."
        strengthHint="راهنمای قدرت گذرواژه را برنامهٔ میزبان تعیین می‌کند."
      />
    </div>
  ),
  Gallery: () => (
    <>
      <GalleryRow title="مقدار و راهنما">
        <State label="خالی">
          <PasswordField className={styles.field} label="گذرواژه" autoComplete="current-password" />
        </State>
        <State label="پرشده">
          <PasswordField
            className={styles.field}
            label="گذرواژهٔ پرشده"
            defaultValue="Negaresh-Example-2026"
          />
        </State>
        <State label="راهنمای قدرت">
          <PasswordField
            className={styles.field}
            label="گذرواژهٔ تازه"
            defaultValue="A-long-example-phrase"
            strengthHint="طول مناسب؛ از تکرار گذرواژهٔ حساب‌های دیگر خودداری کنید."
          />
        </State>
      </GalleryRow>
      <GalleryRow title="حالت‌ها">
        <State label="الزامی">
          <PasswordField className={styles.field} label="گذرواژهٔ الزامی" isRequired />
        </State>
        <State label="خطادار">
          <PasswordField
            className={styles.field}
            label="گذرواژهٔ نامعتبر"
            defaultValue="abc"
            isInvalid
            errorMessage="گذرواژه باید دست‌کم هشت نویسه داشته باشد."
          />
        </State>
        <State label="غیرفعال">
          <PasswordField className={styles.field} label="گذرواژهٔ غیرفعال" isDisabled />
        </State>
        <State label="فقط‌خواندنی">
          <PasswordField
            className={styles.field}
            label="گذرواژهٔ فقط‌خواندنی"
            defaultValue="example"
            isReadOnly
          />
        </State>
        <State label="در حال بررسی">
          <PasswordField
            className={styles.field}
            label="بررسی گذرواژه"
            defaultValue="example"
            isPending
          />
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'نوع autoComplete را متناسب با ورود یا گذرواژهٔ تازه تعیین کنید.',
      'راهنمای قدرت و خطا را مشخص و بدون سرزنش بنویسید؛ سیاست را برنامه تعیین می‌کند.',
    ],
    dont: [
      'چسباندن یا استفاده از مدیر گذرواژه را مسدود نکنید.',
      'نمایش گذرواژه را بدون اقدام کاربر فعال نکنید.',
      'از این جزء انتظار امتیازدهی یا احراز هویت سرور نداشته باشید.',
    ],
  },
  api: [
    fieldApi('PasswordField', [
      {
        name: 'strengthHint',
        type: 'ReactNode',
        description:
          'راهنمای قدرت از برنامهٔ میزبان؛ این جزء الگوریتم امتیازدهی یا کتابخانهٔ تازه ندارد.',
      },
      {
        name: 'autoComplete',
        type: "'current-password' | 'new-password'",
        description: 'نوع تکمیل خودکار؛ چسباندن و مدیر گذرواژه پشتیبانی می‌شوند.',
      },
    ]),
  ],
  keyboard: [
    ...fieldKeyboard,
    { keys: 'Enter / Space روی دکمهٔ نمایش', action: 'تغییر نمایش گذرواژه؛ مقدار ورودی حفظ می‌شود.' },
  ],
  a11y: [...fieldA11y, 'دکمهٔ نمایش/پنهان‌کردن نام فارسی روشن دارد و یک اقدام مستقل است.'],
  rtl: fieldRtl,
};
