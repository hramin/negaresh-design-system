import { iconBook, iconCard, iconTest } from '@negaresh/icons';
import { Select, SelectItem, SelectSection, SelectSeparator, Stack } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './fields.module.css';

function Example() {
  const [province, setProvince] = useState<string | null>('tehran');
  const [topics, setTopics] = useState<string[]>(['clinical']);

  return (
    <div className={styles.example} data-interactive="select">
      <Stack gap="5">
        <Select
          label="استان ارسال"
          description="برای تخمین زمان ارسال نسخهٔ چاپی استفاده می‌شود."
          value={province}
          onChange={(key) => setProvince(key === null ? null : String(key))}
        >
          <SelectSection title="استان‌های پرتکرار">
            <SelectItem id="tehran" icon={iconCard} description="ارسال یک‌روزه با پیک">
              تهران
            </SelectItem>
            <SelectItem id="isfahan" icon={iconBook}>
              اصفهان
            </SelectItem>
            <SelectItem id="razavi" icon={iconTest}>
              خراسان رضوی
            </SelectItem>
          </SelectSection>
          <SelectSeparator />
          <SelectItem id="fars">فارس</SelectItem>
          <SelectItem id="disabled" isDisabled>
            ارسال بین‌المللی (به‌زودی)
          </SelectItem>
        </Select>

        <Select
          label="حوزه‌های تخصصی"
          selectionMode="multiple"
          description="چند گزینه را هم‌زمان انتخاب کنید؛ بیش از دو مورد به شکل شمارش فارسی خلاصه می‌شود."
          value={topics}
          onChange={(keys) => setTopics(keys.map(String))}
        >
          <SelectItem id="clinical">روان‌شناسی بالینی</SelectItem>
          <SelectItem id="child">روان‌شناسی کودک</SelectItem>
          <SelectItem id="edu">روان‌شناسی تربیتی</SelectItem>
          <SelectItem id="org">روان‌شناسی سازمانی</SelectItem>
        </Select>
      </Stack>
    </div>
  );
}

export const selectDoc: ComponentDoc = {
  slug: 'select',
  title: 'فهرست انتخاب',
  components: ['Select', 'SelectItem', 'SelectSection', 'SelectSeparator'],
  base: 'Select, Popover, ListBox',
  summary:
    'انتخاب یک یا چند گزینه از فهرست بازشو؛ با بخش‌بندی، آیکون، توضیح، پیکان راست‌به‌چپ و پشتیبانی از اعتبارسنجی فرم.',
  status: 'approved',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="انتخاب تکی و چندتایی">
        <State label="خالی (متن راهنمای فارسی)">
          <Select className={styles.field} label="استان">
            <SelectItem id="tehran">تهران</SelectItem>
            <SelectItem id="isfahan">اصفهان</SelectItem>
          </Select>
        </State>
        <State label="انتخاب تکی">
          <Select
            className={styles.field}
            label="استان"
            defaultValue="tehran"
            description="قابل تغییر پیش از صدور فاکتور."
          >
            <SelectItem id="tehran">تهران</SelectItem>
            <SelectItem id="isfahan">اصفهان</SelectItem>
          </Select>
        </State>
        <State label="انتخاب چندتایی (۳ مورد)">
          <Select
            className={styles.field}
            label="حوزه‌های تخصصی"
            selectionMode="multiple"
            defaultValue={['clinical', 'child', 'edu']}
          >
            <SelectItem id="clinical">روان‌شناسی بالینی</SelectItem>
            <SelectItem id="child">روان‌شناسی کودک</SelectItem>
            <SelectItem id="edu">روان‌شناسی تربیتی</SelectItem>
          </Select>
        </State>
      </GalleryRow>
      <GalleryRow title="حالت‌ها و اندازه‌ها">
        <State label="غیرفعال">
          <Select className={styles.field} label="نوع کاربری" defaultValue="clinic" isDisabled>
            <SelectItem id="clinic">کلینیک</SelectItem>
          </Select>
        </State>
        <State label="خطادار">
          <Select
            className={styles.field}
            label="محصول"
            isInvalid
            errorMessage="محصول مورد نظر را انتخاب کنید."
          >
            <SelectItem id="reg">رجیستری</SelectItem>
          </Select>
        </State>
        <State label="در حال بارگذاری">
          <Select className={styles.field} label="فهرست مراکز" isPending>
            <SelectItem id="a">مرکز یک</SelectItem>
          </Select>
        </State>
        <State label="اندازه‌ها">
          <Stack gap="3">
            <Select className={styles.field} label="کوچک" size="sm" defaultValue="a">
              <SelectItem id="a">گزینهٔ کوچک</SelectItem>
            </Select>
            <Select className={styles.field} label="متوسط" defaultValue="a">
              <SelectItem id="a">گزینهٔ متوسط</SelectItem>
            </Select>
            <Select className={styles.field} label="بزرگ" size="lg" defaultValue="a">
              <SelectItem id="a">گزینهٔ بزرگ</SelectItem>
            </Select>
          </Stack>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای فهرست‌هایی با بیش از ۵ گزینه از Select استفاده کنید.',
      'در حالت چندتایی، گزینه‌ها را با نشان تیک مربعی متمایز نگه دارید تا انتخاب تنها با رنگ نباشد.',
    ],
    dont: [
      'برای ۲ تا ۵ گزینهٔ کوتاه از Select استفاده نکنید؛ SegmentedControl یا RadioGroup سریع‌تر است.',
      'فهرست‌های بسیار طولانی و جست‌وجوپذیر را در Select نگذارید؛ از ComboBox استفاده کنید.',
    ],
  },
  keyboard: [
    { keys: 'Enter / Space / ↓ / ↑', action: 'باز کردن فهرست از روی ماشه' },
    { keys: '↓ / ↑ / Home / End', action: 'حرکت میان گزینه‌ها' },
    { keys: 'Enter / Space', action: 'انتخاب یا تغییر وضعیت گزینه' },
    { keys: 'Esc', action: 'بستن فهرست و بازگشت فوکوس به ماشه' },
    { keys: 'تایپ حروف', action: 'پرش مستقیم به گزینه (type-ahead)' },
  ],
  a11y: [
    'برچسب، راهنما و پیام خطا با نقش alert به ماشهٔ انتخاب متصل‌اند.',
    'لایهٔ شناور پاپ‌اور تنها بخش دارای سایه است و دکمهٔ بستن پنهان آن با برچسب فارسی («بستن») خوانده می‌شود.',
    'در حالت در حال انجام، نشانگر ProgressBar با برچسب «در حال انجام» در دسترس صفحه‌خوان می‌ماند.',
  ],
  rtl: [
    'پیکان بازشو در سمت پایان (چپ در فارسی) قرار می‌گیرد و هنگام باز بودن می‌چرخد.',
    'در انتخاب چندتایی، گزینه‌ها با ویرگول فارسی («، ») و شمارش بیش از دو مورد با ارقام فارسی نمایش داده می‌شوند.',
  ],
};
