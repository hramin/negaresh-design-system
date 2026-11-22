import { Stack, Text, TimeField } from '@negaresh/react';
import { toPersianDigits } from '@negaresh/utils';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './fields.module.css';

function Example() {
  const [startTime, setStartTime] = useState<string | null>('14:30');
  const [exactTime, setExactTime] = useState<string | null>('09:15:30');

  return (
    <div className={styles.example} data-interactive="time-field">
      <Stack gap="5">
        <TimeField
          label="ساعت شروع جلسه"
          description="قالب ۲۴ ساعته به وقت تهران؛ با کلیدهای بالا/پایین یا تایپ مستقیم عدد تنظیم می‌شود."
          value={startTime}
          onChange={setStartTime}
          minValue="08:00"
          maxValue="20:00"
        />

        <TimeField
          label="زمان ثبت دقیق (با ثانیه)"
          granularity="second"
          value={exactTime}
          onChange={setExactTime}
        />

        <Text size="sm" tone="muted" className={styles.output}>
          ساعت جلسه: {startTime ? toPersianDigits(startTime) : 'خالی'} · ثبت دقیق:{' '}
          {exactTime ? toPersianDigits(exactTime) : 'خالی'}
        </Text>
      </Stack>
    </div>
  );
}

export const timeFieldDoc: ComponentDoc = {
  slug: 'time-field',
  title: 'فیلد زمان',
  components: ['TimeField'],
  base: 'TimeField, DateInput, DateSegment',
  summary:
    'ورودی زمان ۲۴ ساعته با بخش‌های مجزای ساعت، دقیقه (و در صورت نیاز ثانیه)، ارقام فارسی tabular-nums، پیمایش صفحه‌کلید و قرارداد استاندارد HH:mm.',
  status: 'review',
  products: ['N'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="قالب ۲۴ ساعته">
        <State label="مقدار پیش‌فرض (ساعت و دقیقه)">
          <TimeField
            className={styles.field}
            label="ساعت نوبت"
            defaultValue="17:04"
            description="قالب ۲۴ ساعته"
          />
        </State>
        <State label="خالی">
          <TimeField className={styles.field} label="ساعت پایان" />
        </State>
        <State label="دقت ثانیه">
          <TimeField
            className={styles.field}
            label="زمان ثبت رخداد"
            defaultValue="09:05:12"
            granularity="second"
          />
        </State>
      </GalleryRow>
      <GalleryRow title="حالت‌ها و اندازه‌ها">
        <State label="خطادار">
          <TimeField
            className={styles.field}
            label="ساعت تماس"
            defaultValue="22:30"
            minValue="09:00"
            maxValue="18:00"
            isInvalid
            errorMessage="ساعت تماس باید میان ۰۹:۰۰ تا ۱۸:۰۰ باشد."
          />
        </State>
        <State label="در حال بررسی">
          <TimeField className={styles.field} label="بررسی تداخل" defaultValue="11:00" isPending />
        </State>
        <State label="فقط‌خواندنی و غیرفعال">
          <Stack gap="3">
            <TimeField
              className={styles.field}
              label="فقط‌خواندنی"
              defaultValue="10:30"
              isReadOnly
            />
            <TimeField
              className={styles.field}
              label="غیرفعال"
              defaultValue="16:00"
              isDisabled
            />
          </Stack>
        </State>
        <State label="اندازه‌ها">
          <Stack gap="3">
            <TimeField className={styles.field} label="کوچک" size="sm" defaultValue="09:00" />
            <TimeField className={styles.field} label="متوسط" defaultValue="14:30" />
            <TimeField className={styles.field} label="بزرگ" size="lg" defaultValue="18:45" />
          </Stack>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'به‌طور پیش‌فرض از قالب ۲۴ ساعته (hourCycle={24}) استفاده کنید تا با استاندارد زمان در فارسی و ایران هماهنگ باشد.',
      'مقادیر را به شکل استاندارد HH:mm یا HH:mm:ss ذخیره و ارسال کنید.',
    ],
    dont: [
      'برای انتخاب یک بازهٔ زمانی طولانی همراه با تاریخ از چند TimeField جداگانه استفاده نکنید؛ آن را در کنار DatePicker قرار دهید.',
    ],
  },
  api: [
    {
      name: 'TimeField',
      props: [
        { name: 'label', type: 'ReactNode', description: 'برچسب دیدنی و الزامی فیلد.' },
        { name: 'value / defaultValue', type: 'string | null', description: 'زمان ۲۴ ساعته به قالب HH:mm یا HH:mm:ss.' },
        { name: 'onChange', type: '(value: string | null) => void', description: 'مقدار استاندارد HH:mm (یا HH:mm:ss) برمی‌گرداند.' },
        { name: 'minValue / maxValue', type: 'string', description: 'کمینه و بیشینهٔ مجاز زمانی.' },
        {
          name: 'granularity',
          type: "'hour' | 'minute' | 'second'",
          default: "'minute'",
          description: 'دقت نمایش بخش‌های زمان.',
        },
        { name: 'hourCycle', type: '12 | 24', default: '24', description: 'چرخهٔ ساعتی (پیش‌فرض ۲۴ ساعته).' },
        { name: 'description / errorMessage', type: 'ReactNode', description: 'متن راهنما و پیام خطا.' },
        {
          name: 'isRequired / isDisabled / isReadOnly / isInvalid / isPending',
          type: 'boolean',
          description: 'وضعیت‌های فرم.',
        },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'ارتفاع کنترل.' },
        { name: 'className / ref', type: 'string / Ref<HTMLDivElement>', description: '—' },
      ],
    },
  ],
  keyboard: [
    { keys: '↑ / ↓', action: 'افزایش یا کاهش بخش فعال (ساعت، دقیقه یا ثانیه)' },
    { keys: '← / →', action: 'جابه‌جایی میان بخش‌های ساعت، دقیقه و ثانیه' },
    { keys: 'تایپ ارقام ۰ تا ۹', action: 'ورود مستقیم مقدار و پرش خودکار به بخش بعدی' },
    { keys: 'Backspace', action: 'پاک کردن بخش فعال' },
  ],
  a11y: [
    'هر بخش زمانی نقش spinbutton با برچسب بومی فارسی («ساعت»، «دقیقه»، «ثانیه») و محدودهٔ عددی دارد.',
    'بخش دارای فوکوس با پس‌زمینهٔ تأکیدی و حلقهٔ فوکوس واضح مشخص می‌شود و در forced-colors نیز خوانا می‌ماند.',
    'خطاهای محدوده و اعتبارسنجی با نقش alert اعلام می‌شوند.',
  ],
  rtl: [
    'بخش‌های عددی ساعت:دقیقه برای خوانش طبیعی زمان به‌صورت چپ‌به‌راست (۱۷:۰۴) در سمت آغاز فیلد تراز می‌شوند و آیکون ساعت در سمت پایان (چپ) قرار می‌گیرد.',
    'تمام ارقام با فونت فارسی و tabular-nums نمایش داده می‌شوند.',
  ],
};
