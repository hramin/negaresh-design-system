import { Radio, RadioGroup, Stack } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './fields.module.css';

function Example() {
  const [view, setView] = useState('pro');
  return (
    <div className={styles.example} data-interactive="radio-group">
      <RadioGroup
        label="نمای گزارش آزمون"
        description="برای مراجعان نوجوان و والدین نمای آرام پیشنهاد می‌شود."
        value={view}
        onChange={setView}
      >
        <Radio value="pro" description="نمایش نمره‌های تراز، بازه‌ها و اصطلاحات تخصصی">
          نمای حرفه‌ای
        </Radio>
        <Radio value="calm" description="بیان ساده و بدون نمودارهای پیچیده یا رنگ‌های هشداردهنده">
          نمای آرام
        </Radio>
        <Radio value="summary">خلاصهٔ یک‌صفحه‌ای</Radio>
      </RadioGroup>
    </div>
  );
}

export const radioGroupDoc: ComponentDoc = {
  slug: 'radio-group',
  title: 'گروه رادیویی',
  components: ['RadioGroup', 'Radio'],
  base: 'RadioGroup, RadioField, RadioButton',
  summary:
    'انتخاب انحصاری یک گزینه از میان چند گزینه با چیدمان عمودی یا افقی، توضیح اختصاصی هر گزینه و پیمایش کیبوردی راست‌به‌چپ.',
  status: 'approved',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="چیدمان عمودی و افقی">
        <State label="عمودی با توضیح">
          <RadioGroup
            className={styles.field}
            label="روش تحویل"
            defaultValue="courier"
            description="هزینه در مرحلهٔ بعد محاسبه می‌شود."
          >
            <Radio value="courier" description="تحویل همان روز در تهران">
              پیک شهری
            </Radio>
            <Radio value="post" description="۲ تا ۴ روز کاری در سراسر کشور">
              پست پیشتاز
            </Radio>
          </RadioGroup>
        </State>
        <State label="افقی">
          <RadioGroup label="بازهٔ تکرار" orientation="horizontal" defaultValue="monthly">
            <Radio value="weekly">هفتگی</Radio>
            <Radio value="monthly">ماهانه</Radio>
            <Radio value="yearly">سالانه</Radio>
          </RadioGroup>
        </State>
      </GalleryRow>
      <GalleryRow title="حالت‌های خطا، غیرفعال و فقط‌خواندنی">
        <State label="خطادار">
          <RadioGroup
            className={styles.field}
            label="درگاه پرداخت"
            isInvalid
            errorMessage="یکی از درگاه‌های پرداخت را انتخاب کنید."
          >
            <Radio value="a">درگاه بانکی اول</Radio>
            <Radio value="b">درگاه بانکی دوم</Radio>
          </RadioGroup>
        </State>
        <State label="غیرفعال">
          <Stack gap="3">
            <RadioGroup label="گزینهٔ غیرفعال در گروه" defaultValue="active">
              <Radio value="active">فعال</Radio>
              <Radio value="paused" isDisabled>
                متوقف‌شده
              </Radio>
            </RadioGroup>
            <RadioGroup label="گروه غیرفعال" defaultValue="x" isDisabled>
              <Radio value="x">نسخهٔ سازمانی</Radio>
              <Radio value="y">نسخهٔ فردی</Radio>
            </RadioGroup>
          </Stack>
        </State>
        <State label="فقط‌خواندنی">
          <RadioGroup label="نوع حساب" defaultValue="clinic" isReadOnly>
            <Radio value="clinic">کلینیک</Radio>
            <Radio value="personal">شخصی</Radio>
          </RadioGroup>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'زمانی که کاربر باید دقیقاً یک گزینه از ۲ تا ۶ گزینه را ببیند و مقایسه کند، از RadioGroup استفاده کنید.',
      'چیدمان افقی را فقط برای ۲ تا ۳ گزینهٔ کوتاه به کار ببرید.',
    ],
    dont: [
      'برای انتخاب چندتایی از RadioGroup استفاده نکنید؛ آن CheckboxGroup است.',
      'گزینه‌های بلند با توضیح چندخطی را افقی نچینید.',
    ],
  },
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'ورود به گزینهٔ انتخاب‌شده (یا نخستین گزینه) و خروج از گروه' },
    { keys: '↑ / ↓ (عمودی) · ← / → (افقی)', action: 'جابه‌جایی و انتخاب گزینهٔ قبلی/بعدی' },
    { keys: 'Space', action: 'انتخاب گزینهٔ دارای فوکوس' },
  ],
  a11y: [
    'از roving tabindex برای پیمایش روان کیبورد استفاده می‌شود.',
    'دایرهٔ داخلی انتخاب‌شده همراه با مرز ضخیم نشان داده می‌شود و در حالت forced-colors نیز قابل تشخیص است.',
    'پیام خطای گروه با نقش alert اعلام می‌شود و با aria-describedby به گروه وصل است.',
  ],
  rtl: [
    'در حالت افقی، کلید جهت چپ (←) به گزینهٔ بعدی و جهت راست (→) به گزینهٔ قبلی می‌رود.',
    'نشانگر رادیویی در سمت آغاز (راست) قرار دارد و توضیح با تورفتگی منطقی هم‌تراز برچسب است.',
  ],
};
