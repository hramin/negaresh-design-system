import { NumberField, Stack, Text } from '@negaresh/react';
import { formatNumber } from '@negaresh/utils';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './fields.module.css';

function Example() {
  const [seats, setSeats] = useState<number>(12);
  const [discount, setDiscount] = useState<number>(0.15);

  return (
    <div className={styles.example} data-interactive="number-field">
      <Stack gap="5">
        <NumberField
          label="ظرفیت کارگاه"
          description="عدد فارسی، عربی یا لاتین وارد کنید؛ با دکمه‌های + و − یا کلیدهای جهت‌دار نیز قابل تغییر است."
          suffix="نفر"
          value={seats}
          onChange={setSeats}
          minValue={1}
          maxValue={50}
          step={1}
        />
        <NumberField
          label="درصد تخفیف سازمانی"
          value={discount}
          onChange={setDiscount}
          minValue={0}
          maxValue={0.5}
          step={0.05}
          formatOptions={{ style: 'percent' }}
        />
        <Text size="sm" tone="muted" className={styles.output}>
          مقدار فعلی: {Number.isNaN(seats) ? 'خالی' : `${formatNumber(seats)} نفر`} · تخفیف:{' '}
          {Number.isNaN(discount) ? '—' : new Intl.NumberFormat('fa-IR', { style: 'percent' }).format(discount)}
        </Text>
      </Stack>
    </div>
  );
}

export const numberFieldDoc: ComponentDoc = {
  slug: 'number-field',
  title: 'فیلد عددی',
  components: ['NumberField'],
  base: 'NumberField, Group, Input, Button',
  summary:
    'ورودی عددی دسترس‌پذیر با نمایش ارقام فارسی و tabular-nums، پذیرش هم‌زمان ارقام فارسی، عربی و لاتین، دکمه‌های گام‌بردار ۴۴ پیکسلی و قالب‌بندی Intl.NumberFormat.',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="انواع و قالب‌بندی">
        <State label="پایه با پسوند">
          <NumberField
            className={styles.field}
            label="تعداد نسخه"
            suffix="نسخه"
            defaultValue={12}
            minValue={1}
            maxValue={100}
          />
        </State>
        <State label="جداکنندهٔ هزارگان و تومان">
          <NumberField
            className={styles.field}
            label="سقف خرید ماهانه"
            suffix="تومان"
            defaultValue={250000}
            step={50000}
          />
        </State>
        <State label="درصد (formatOptions)">
          <NumberField
            className={styles.field}
            label="نرخ تخفیف"
            defaultValue={0.2}
            minValue={0}
            maxValue={1}
            step={0.05}
            formatOptions={{ style: 'percent' }}
          />
        </State>
        <State label="بدون دکمهٔ گام‌بردار">
          <NumberField
            className={styles.field}
            label="سال تأسیس مرکز"
            defaultValue={1398}
            hideStepper
            formatOptions={{ useGrouping: false }}
          />
        </State>
      </GalleryRow>
      <GalleryRow title="حالت‌ها و اندازه‌ها">
        <State label="خطادار">
          <NumberField
            className={styles.field}
            label="حداقل شرکت‌کننده"
            defaultValue={0}
            minValue={1}
            isInvalid
            errorMessage="تعداد شرکت‌کنندگان باید دست‌کم ۱ نفر باشد."
          />
        </State>
        <State label="در حال بررسی">
          <NumberField className={styles.field} label="موجودی انبار" defaultValue={8} isPending />
        </State>
        <State label="فقط‌خواندنی و غیرفعال">
          <Stack gap="3">
            <NumberField
              className={styles.field}
              label="فقط‌خواندنی"
              defaultValue={24}
              isReadOnly
            />
            <NumberField
              className={styles.field}
              label="غیرفعال"
              defaultValue={10}
              isDisabled
            />
          </Stack>
        </State>
        <State label="اندازه‌ها">
          <Stack gap="3">
            <NumberField className={styles.field} label="کوچک" size="sm" defaultValue={5} />
            <NumberField className={styles.field} label="متوسط" defaultValue={10} />
            <NumberField className={styles.field} label="بزرگ" size="lg" defaultValue={20} />
          </Stack>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای مقادیر عددی دارای کمینه، بیشینه، گام یا واحد مشخص (تعداد، ظرفیت، مبلغ، درصد) از NumberField استفاده کنید.',
      'واحد شمارش را با suffix (مانند «نفر» یا «تومان») کنار ورودی بنویسید تا کاربر مجبور به تایپ واحد نباشد.',
    ],
    dont: [
      'برای شماره‌های شناسه‌ای که عملیات عددی ندارند (کد ملی، تلفن، کد پستی، کد سیستم) از NumberField استفاده نکنید؛ PhoneField یا CodeField مناسب‌تر است.',
      'در مقادیر پیوسته که حس مقایسهٔ نسبی مهم‌تر از عدد دقیق است، Slider را ترجیح دهید.',
    ],
  },
  api: [
    {
      name: 'NumberField',
      props: [
        { name: 'label', type: 'ReactNode', description: 'برچسب دیدنی و الزامی فیلد.' },
        { name: 'value / defaultValue', type: 'number', description: 'مقدار عددی کنترل‌شده یا اولیه.' },
        { name: 'onChange', type: '(value: number) => void', description: 'در تغییر یا ثبت عدد فراخوانی می‌شود.' },
        { name: 'minValue / maxValue / step', type: 'number', description: 'محدودهٔ مجاز و اندازهٔ گام.' },
        {
          name: 'formatOptions',
          type: 'Intl.NumberFormatOptions',
          description: 'تنظیمات قالب‌بندی مانند درصد یا غیرفعال‌سازی جداکننده.',
        },
        { name: 'prefix / suffix', type: 'ReactNode', description: 'پیشوند یا پسوند واحد (مانند «تومان» یا «نفر»).' },
        { name: 'hideStepper', type: 'boolean', default: 'false', description: 'پنهان کردن دکمه‌های + و −.' },
        { name: 'description / errorMessage', type: 'ReactNode', description: 'متن راهنما و پیام خطا.' },
        {
          name: 'isRequired / isDisabled / isReadOnly / isInvalid / isPending',
          type: 'boolean',
          description: 'وضعیت‌های الزامی، غیرفعال، فقط‌خواندنی، خطادار و در حال انجام.',
        },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'ارتفاع کنترل (حداقل ۴۴ پیکسل).' },
        { name: 'className / ref', type: 'string / Ref<HTMLInputElement>', description: '—' },
      ],
    },
  ],
  keyboard: [
    { keys: '↑ / ↓', action: 'افزایش یا کاهش یک گام (step)' },
    { keys: 'PageUp / PageDown', action: 'افزایش یا کاهش با گام بزرگ‌تر' },
    { keys: 'Home / End', action: 'پرش به کمینه (minValue) یا بیشینه (maxValue)' },
    { keys: 'Enter / Tab', action: 'ثبت عدد و یکسان‌سازی نمایش به ارقام فارسی' },
  ],
  a11y: [
    'دکمه‌های افزایش و کاهش با برچسب فارسی («افزایش …» و «کاهش …») و هدف لمسی دست‌کم ۴۴×۴۴ پیکسل ساخته می‌شوند.',
    'پیام خطا با نقش alert اعلام می‌شود و با تغییر مقدار یا اصلاح خطا بدون پرش چیدمان پنهان می‌گردد.',
    'اعداد با tabular-nums نمایش داده می‌شوند تا هنگام گام برداشتن عرض عدد نلرزد.',
  ],
  rtl: [
    'ارقام فارسی، عربی و لاتین هنگام تایپ پذیرفته می‌شوند و هنگام ثبت یا خروج از فیلد به نمایش یکدست فارسی تبدیل می‌شوند.',
    'چیدمان دکمه‌های کاهش، ورودی و افزایش با ویژگی‌های منطقی CSS در راست‌به‌چپ تراز می‌ماند.',
  ],
};
