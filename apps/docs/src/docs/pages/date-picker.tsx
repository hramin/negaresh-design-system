import {
  Calendar,
  DatePicker,
  DateRangePicker,
  type DateRangeValue,
  RangeCalendar,
  Stack,
  Text,
} from '@negaresh/react';
import { formatDate } from '@negaresh/utils';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './fields.module.css';

// Fixed Jalali anchor dates so visual snapshots stay deterministic:
// 2026-11-13 = جمعه ۲۲ آبان ۱۴۰۵
// 2026-11-11..2026-11-17 = ۲۰ تا ۲۶ آبان ۱۴۰۵
const ANCHOR_ISO = '2026-11-13';
const ANCHOR_UNAVAILABLE_ISO = '2026-11-14';
const ANCHOR_RANGE: DateRangeValue = { start: '2026-11-11', end: '2026-11-17' };

function Example() {
  const [date, setDate] = useState<string | null>(ANCHOR_ISO);
  const [range, setRange] = useState<DateRangeValue | null>(ANCHOR_RANGE);

  return (
    <div className={styles.example} data-interactive="date-picker">
      <Stack gap="5">
        <DatePicker
          label="تاریخ جلسهٔ ارزیابی"
          description="تقویم خورشیدی (جلالی) با شروع هفته از شنبه و منطقهٔ زمانی تهران."
          value={date}
          onChange={setDate}
          placeholderValue={ANCHOR_ISO}
          minValue="2026-10-23"
          maxValue="2026-12-21"
          isDateUnavailable={(iso) => iso === ANCHOR_UNAVAILABLE_ISO}
        />

        <DateRangePicker
          label="بازهٔ برگزاری کارگاه"
          description="تاریخ شروع و پایان را مستقیم تایپ کنید یا از تقویم بازشو برگزینید."
          value={range}
          onChange={setRange}
          placeholderValue={ANCHOR_ISO}
          minValue="2026-10-23"
          maxValue="2026-12-21"
        />

        <Text size="sm" tone="muted" className={styles.output}>
          تاریخ انتخاب‌شده: {date ? `${formatDate(`${date}T12:00:00Z`)} (${date})` : 'خالی'} · بازه:{' '}
          {range
            ? `${formatDate(`${range.start}T12:00:00Z`)} تا ${formatDate(`${range.end}T12:00:00Z`)}`
            : 'خالی'}
        </Text>
      </Stack>
    </div>
  );
}

export const datePickerDoc: ComponentDoc = {
  slug: 'date-picker',
  title: 'تقویم و انتخابگر تاریخ جلالی',
  components: ['DatePicker', 'DateRangePicker', 'Calendar', 'RangeCalendar'],
  base: 'DatePicker, DateRangePicker, Calendar, RangeCalendar, PersianCalendar',
  summary:
    'انتخابگر تاریخ و بازهٔ تاریخ خورشیدی (جلالی) با شروع هفته از شنبه، مشخص‌سازی جمعه، منطقهٔ زمانی تهران، پیمایش کامل صفحه‌کلید راست‌به‌چپ و قرارداد ISO-8601 در لبهٔ API.',
  status: 'review',
  products: ['R', 'N', 'T'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="انتخابگر تاریخ و بازهٔ تاریخ">
        <State label="تاریخ انتخاب‌شده">
          <DatePicker
            className={styles.field}
            label="تاریخ تولد"
            defaultValue={ANCHOR_ISO}
            description="قالب خورشیدی (سال/ماه/روز)"
          />
        </State>
        <State label="خالی (متن راهنما)">
          <DatePicker
            className={styles.field}
            label="تاریخ مراجعه"
            placeholderValue={ANCHOR_ISO}
          />
        </State>
        <State label="انتخابگر بازهٔ تاریخ">
          <DateRangePicker
            className={styles.field}
            label="بازهٔ گزارش"
            defaultValue={ANCHOR_RANGE}
          />
        </State>
      </GalleryRow>
      <GalleryRow title="حالت‌ها و اندازه‌ها">
        <State label="خطادار">
          <DatePicker
            className={styles.field}
            label="تاریخ انقضا"
            placeholderValue={ANCHOR_ISO}
            isInvalid
            errorMessage="لطفاً یک تاریخ معتبر در بازهٔ مجاز انتخاب کنید."
          />
        </State>
        <State label="در حال بررسی">
          <DatePicker
            className={styles.field}
            label="بررسی ظرفیت"
            defaultValue={ANCHOR_ISO}
            isPending
          />
        </State>
        <State label="فقط‌خواندنی و غیرفعال">
          <Stack gap="3">
            <DatePicker
              className={styles.field}
              label="فقط‌خواندنی"
              defaultValue={ANCHOR_ISO}
              isReadOnly
            />
            <DatePicker
              className={styles.field}
              label="غیرفعال"
              defaultValue={ANCHOR_ISO}
              isDisabled
            />
          </Stack>
        </State>
        <State label="اندازه‌ها">
          <Stack gap="3">
            <DatePicker
              className={styles.field}
              label="کوچک"
              size="sm"
              defaultValue={ANCHOR_ISO}
            />
            <DatePicker className={styles.field} label="متوسط" defaultValue={ANCHOR_ISO} />
            <DatePicker
              className={styles.field}
              label="بزرگ"
              size="lg"
              defaultValue={ANCHOR_ISO}
            />
          </Stack>
        </State>
      </GalleryRow>
      <GalleryRow title="تقویم جلالی درون‌صفحه‌ای (تکی و بازه‌ای)">
        <State label="تقویم تکی (روز ناموجود ۲۳ آبان)">
          <Calendar
            aria-label="تقویم نمونه"
            defaultValue={ANCHOR_ISO}
            minValue="2026-10-25"
            maxValue="2026-11-20"
            isDateUnavailable={(iso) => iso === ANCHOR_UNAVAILABLE_ISO}
          />
        </State>
        <State label="تقویم بازه‌ای (۲۰ تا ۲۶ آبان ۱۴۰۵)">
          <RangeCalendar aria-label="تقویم بازه‌ای نمونه" defaultValue={ANCHOR_RANGE} />
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'همیشه مقادیر را به شکل استاندارد میلادی ISO-8601 (YYYY-MM-DD) در API و پایگاه‌داده ذخیره و ارسال کنید؛ تبدیل به جلالی تنها در لبهٔ رابط کاربری انجام می‌شود.',
      'برای تاریخ‌های غیرقابل رزرو (مانند روزهای تکمیل‌ظرفیت) از isDateUnavailable استفاده کنید تا همچنان با صفحه‌کلید قابل فوکوس و خوانا بمانند.',
    ],
    dont: [
      'رشته‌های تاریخ جلالی مانند «1405/08/22» را به value یا minValue ندهید؛ این مؤلفه‌ها تنها رشتهٔ استاندارد ISO-8601 می‌پذیرند.',
      'منطقهٔ زمانی مرورگر را برای محاسبهٔ «امروز» فرض نکنید؛ پیش‌فرض سامانه منطقهٔ زمانی تهران (Asia/Tehran) است.',
    ],
  },
  api: [
    {
      name: 'DatePicker',
      props: [
        { name: 'label', type: 'ReactNode', description: 'برچسب دیدنی و الزامی فیلد.' },
        { name: 'value / defaultValue', type: 'string | null', description: 'تاریخ استاندارد ISO-8601 (YYYY-MM-DD).' },
        { name: 'onChange', type: '(isoDate: string | null) => void', description: 'تاریخ انتخاب‌شده را به قالب ISO برمی‌گرداند.' },
        { name: 'minValue / maxValue', type: 'string', description: 'کمینه و بیشینهٔ مجاز (ISO YYYY-MM-DD).' },
        {
          name: 'placeholderValue',
          type: 'string',
          default: 'امروز به وقت تهران',
          description: 'تاریخ مرجع نمایش تقویم هنگام خالی بودن فیلد.',
        },
        { name: 'isDateUnavailable', type: '(isoDate: string) => boolean', description: 'روزهای غیرقابل انتخاب با خط‌خوردگی خوانا.' },
        { name: 'description / errorMessage', type: 'ReactNode', description: 'متن راهنما و خطای اعتبارسنجی.' },
        { name: 'isRequired / isDisabled / isReadOnly / isInvalid / isPending', type: 'boolean', description: 'وضعیت‌های فرم.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'اندازهٔ فیلد.' },
        { name: 'placement', type: "PopoverProps['placement']", default: "'bottom start'", description: 'جهت باز شدن پاپ‌اور تقویم.' },
      ],
    },
    {
      name: 'DateRangePicker',
      props: [
        { name: 'value / defaultValue', type: 'DateRangeValue | null', description: 'بازهٔ `{ start, end }` به قالب ISO-8601.' },
        { name: 'onChange', type: '(range: DateRangeValue | null) => void', description: 'اعلام تغییر بازه.' },
        { name: 'startName / endName', type: 'string', description: 'نام فیلدهای فرم برای تاریخ شروع و پایان.' },
        { name: 'allowsNonContiguousRanges', type: 'boolean', description: 'اجازهٔ عبور بازه از روزهای ناموجود.' },
      ],
    },
    {
      name: 'Calendar / RangeCalendar',
      props: [
        { name: 'value / defaultValue / onChange', type: 'string | DateRangeValue', description: 'مقدار و رویداد تغییر به قالب ISO-8601.' },
        { name: 'focusedValue / defaultFocusedValue / onFocusChange', type: 'string', description: 'مدیریت تاریخ دارای فوکوس در شبکه.' },
        { name: 'minValue / maxValue / isDateUnavailable', type: 'string / predicate', description: 'محدودیت‌های انتخاب روز.' },
        { name: 'isDisabled / isReadOnly / isInvalid / errorMessage', type: 'boolean / ReactNode', description: '—' },
      ],
    },
  ],
  keyboard: [
    { keys: '↑ / ↓ (روی بخش‌های ورودی)', action: 'افزایش یا کاهش سال، ماه یا روز' },
    { keys: '← / → (روی بخش‌های ورودی)', action: 'جابه‌جایی میان بخش‌های سال، ماه و روز' },
    { keys: 'Enter / Space (روی دکمهٔ تقویم)', action: 'باز کردن پاپ‌اور تقویم جلالی و انتقال فوکوس به شبکه' },
    { keys: '← / → (در شبکهٔ تقویم RTL)', action: 'حرکت به روز بعد (←) و روز قبل (→)' },
    { keys: '↑ / ↓ (در شبکهٔ تقویم)', action: 'حرکت به هفتهٔ قبل و بعد' },
    { keys: 'Home / End', action: 'پرش به ابتدای هفته (شنبه) و پایان هفته (جمعه)' },
    { keys: 'PageUp / PageDown', action: 'جابه‌جایی به ماه جلالی قبل و بعد (با Shift: سال قبل و بعد)' },
    { keys: 'Enter / Space', action: 'انتخاب روز یا تکمیل بازهٔ انتخاب‌شده' },
    { keys: 'Esc', action: 'بستن پاپ‌اور تقویم و بازگرداندن فوکوس به دکمهٔ تقویم' },
  ],
  a11y: [
    'هر خانهٔ تقویم حداقل ۴۴×۴۴ پیکسل است و با برچسب کامل فارسی شامل نام روز هفته، ماه و سال جلالی برای صفحه‌خوان خوانده می‌شود.',
    'روز جاری با خط مرزی، وزن پررنگ و نقطه مشخص می‌شود (نه صرفاً با رنگ) و روزهای ناموجود با خط‌خوردگی و کنتراست دست‌کم ۴٫۵:۱ خوانا و فوکوس‌پذیر می‌مانند.',
    'پاپ‌اور تقویم تنها عنصر دارای سایه است و دکمهٔ بستن پنهان آن به فارسی («بستن») بومی‌سازی شده است.',
  ],
  rtl: [
    'هفته از شنبه (ش) در راست آغاز شده و به جمعه (ج) در چپ ختم می‌شود؛ جمعه‌ها با نشانگر پایان هفته متمایزند.',
    'سرستون ماه به ترتیب طبیعی فارسی («آبان ۱۴۰۵») نمایش داده می‌شود و جهت فلش‌های «ماه قبل» و «ماه بعد» در RTL آینه‌ای است.',
    'گوشه‌های گرد سر و ته بازه در RangeCalendar با ویژگی‌های منطقی (border-start-start-radius و …) تنظیم شده‌اند.',
  ],
};
