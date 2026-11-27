import { TextArea } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import { fieldA11y, fieldKeyboard, fieldRtl } from './field-docs.ts';
import styles from './fields.module.css';

export const textAreaDoc: ComponentDoc = {
  slug: 'text-area',
  title: 'متن چندخطی',
  components: ['TextArea'],
  base: 'TextField + TextArea',
  summary:
    'برای پیام و توضیح چندخطی. ارتفاع با محتوا رشد می‌کند و شمارندهٔ فارسی، راهنما و خطا کنار متن باقی می‌مانند.',
  status: 'approved',
  products: ['R', 'N', 'T', 'V'],
  Example: () => (
    <div className={styles.example} data-interactive="text-area">
      <TextArea
        label="پیام برای پشتیبانی"
        name="message"
        description="نام نرم‌افزار و کاری را که انجام داده‌اید بنویسید."
        defaultValue="هنگام وارد کردن سریال، پیام خطا نمایش داده می‌شود."
        maxLength={500}
        showCharacterCount
      />
    </div>
  ),
  Gallery: () => (
    <>
      <GalleryRow title="محتوا و اندازه">
        <State label="خالی">
          <TextArea className={styles.field} label="توضیحات" placeholder="توضیح کوتاه بنویسید" />
        </State>
        <State label="رشد با محتوا">
          <TextArea
            className={styles.field}
            label="یادداشت"
            rows={2}
            defaultValue={
              'نام برنامه: نگارش تست هوش ۴\nنسخهٔ برنامه به‌روز است.\nهنگام وارد کردن سریال پیام خطا نمایش داده می‌شود.\nلطفاً راهنمایی کنید.'
            }
          />
        </State>
        <State label="شمارنده">
          <TextArea
            className={styles.field}
            label="خلاصه"
            defaultValue="درخواست راهنمایی"
            maxLength={80}
            showCharacterCount
          />
        </State>
      </GalleryRow>
      <GalleryRow title="حالت‌ها">
        <State label="الزامی">
          <TextArea className={styles.field} label="شرح درخواست" isRequired />
        </State>
        <State label="خطادار">
          <TextArea
            className={styles.field}
            label="شرح درخواست"
            isInvalid
            errorMessage="شرح درخواست را وارد کنید."
          />
        </State>
        <State label="غیرفعال">
          <TextArea
            className={styles.field}
            label="پاسخ"
            defaultValue="در انتظار بررسی"
            isDisabled
          />
        </State>
        <State label="فقط‌خواندنی">
          <TextArea
            className={styles.field}
            label="پیام ثبت‌شده"
            defaultValue="درخواست شما ثبت شد."
            isReadOnly
          />
        </State>
        <State label="در حال انجام">
          <TextArea className={styles.field} label="پیام" defaultValue="ذخیرهٔ پیش‌نویس" isPending />
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای پیام‌های چندخطی از TextArea استفاده کنید.',
      'محدودیت طول و دلیل آن را پیش از خطا روشن کنید.',
    ],
    dont: [
      'Enter را به ارسال ناخواستهٔ فرم تبدیل نکنید.',
      'محتوای بلند را با ارتفاع ثابت پنهان نکنید.',
    ],
  },
  keyboard: [
    ...fieldKeyboard,
    { keys: 'Enter', action: 'افزودن خط تازه؛ ارسال با دکمهٔ فرم انجام می‌شود.' },
  ],
  a11y: fieldA11y,
  rtl: fieldRtl,
};
