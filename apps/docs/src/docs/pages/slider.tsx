import { RangeSlider, Slider, Stack, Text } from '@negaresh/react';
import { formatNumber, formatToman } from '@negaresh/utils';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './fields.module.css';

function Example() {
  const [score, setScore] = useState<number>(60);
  const [priceRange, setPriceRange] = useState<[number, number]>([200000, 700000]);

  return (
    <div className={styles.example} data-interactive="slider">
      <Stack gap="6">
        <Slider
          label="آستانهٔ اطمینان آزمون"
          description="با کلیدهای چپ و راست یا کشیدن دستگیره مقدار را تنظیم کنید."
          value={score}
          onChange={setScore}
          minValue={0}
          maxValue={100}
          step={5}
          ticks={[0, 25, 50, 75, 100]}
          formatValue={(v) => `${formatNumber(v)}٪`}
          formatTick={(v) => `${formatNumber(v)}٪`}
        />

        <RangeSlider
          label="بازهٔ بودجهٔ کارگاه"
          value={priceRange}
          onChange={setPriceRange}
          minValue={100000}
          maxValue={1000000}
          step={50000}
          ticks={[100000, 400000, 700000, 1000000]}
          formatValue={(v) => formatToman(v)}
          formatTick={(v) => `${formatNumber(v / 1000)} هزار`}
        />

        <Text size="sm" tone="muted" className={styles.output}>
          آستانه: {formatNumber(score)}٪ · بازه: {formatToman(priceRange[0])} تا{' '}
          {formatToman(priceRange[1])}
        </Text>
      </Stack>
    </div>
  );
}

export const sliderDoc: ComponentDoc = {
  slug: 'slider',
  title: 'لغزنده و لغزندهٔ بازه‌ای',
  components: ['Slider', 'RangeSlider'],
  base: 'Slider, SliderTrack, SliderThumb, SliderOutput',
  summary:
    'انتخاب مقدار تکی یا بازه‌ای روی محور پیوسته یا گام‌بندی‌شده؛ با خط‌کش ارقام فارسی، خروجی زندهٔ tabular-nums، جهت راست‌به‌چپ و هدف لمسی ۴۴ پیکسلی.',
  status: 'review',
  products: ['T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="لغزندهٔ تکی و بازه‌ای">
        <State label="تکی با درجه‌بندی فارسی">
          <Slider
            className={styles.field}
            label="حجم صدا"
            defaultValue={65}
            ticks={[0, 25, 50, 75, 100]}
            formatValue={(v) => `${formatNumber(v)}٪`}
          />
        </State>
        <State label="بازه‌ای دو دستگیره">
          <RangeSlider
            className={styles.field}
            label="بازهٔ سنی مراجعان"
            defaultValue={[18, 45]}
            minValue={10}
            maxValue={70}
            step={1}
            ticks={[10, 30, 50, 70]}
            formatValue={(v) => `${formatNumber(v)} سال`}
          />
        </State>
      </GalleryRow>
      <GalleryRow title="حالت‌ها و جهت عمودی">
        <State label="غیرفعال">
          <Slider
            className={styles.field}
            label="حد ثابت سیستم"
            defaultValue={40}
            ticks={[0, 50, 100]}
            isDisabled
          />
        </State>
        <State label="بدون نمایش خروجی">
          <Slider
            className={styles.field}
            label="شدت فیلتر"
            defaultValue={30}
            showValue={false}
          />
        </State>
        <State label="عمودی">
          <Slider
            label="تراز عمودی"
            orientation="vertical"
            defaultValue={70}
            minValue={0}
            maxValue={100}
          />
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای فیلترهای بازه‌ای (قیمت، سن، امتیاز) و تنظیمات تدریجی که مقایسهٔ دیداری نسبت به کل بازه مهم است از Slider یا RangeSlider استفاده کنید.',
      'تعداد درجه‌های ticks را محدود (۳ تا ۵ نقطه) نگه دارید تا در نمایش موبایل هم‌پوشانی رخ ندهد.',
    ],
    dont: [
      'برای ورود عدد دقیق مانند مبلغ فاکتور یا ظرفیت دقیق از Slider استفاده نکنید؛ NumberField دقیق‌تر و سریع‌تر است.',
    ],
  },
  api: [
    {
      name: 'Slider',
      props: [
        { name: 'label', type: 'ReactNode', description: 'برچسب دیدنی لغزنده.' },
        { name: 'value / defaultValue', type: 'number', description: 'مقدار کنترل‌شده یا اولیه.' },
        { name: 'onChange / onChangeEnd', type: '(value: number) => void', description: 'اعلام تغییر زنده یا پایان کشیدن.' },
        { name: 'minValue / maxValue / step', type: 'number', default: '0 / 100 / 1', description: 'کمینه، بیشینه و گام.' },
        { name: 'ticks', type: 'readonly number[]', description: 'مقادیر خط‌کش فارسی زیر ریل.' },
        { name: 'formatValue / formatTick', type: '(value: number) => string', description: 'قالب‌بندی سفارشی خروجی یا خط‌کش.' },
        { name: 'showValue', type: 'boolean', default: 'true', description: 'نمایش مقدار زنده در بالای ریل.' },
        { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'جهت افقی یا عمودی.' },
        { name: 'isDisabled', type: 'boolean', description: 'غیرفعال کردن لغزنده.' },
        { name: 'className / ref', type: 'string / Ref<HTMLDivElement>', description: '—' },
      ],
    },
    {
      name: 'RangeSlider',
      props: [
        { name: 'value / defaultValue', type: '[number, number]', description: 'بازهٔ کنترل‌شده یا اولیه [کمینه، بیشینه].' },
        { name: 'onChange / onChangeEnd', type: '(value: [number, number]) => void', description: 'اعلام تغییر بازه.' },
        {
          name: 'thumbLabels',
          type: '[string, string]',
          default: "['حد پایین', 'حد بالا']",
          description: 'برچسب دسترس‌پذیر هر دو دستگیره برای صفحه‌خوان.',
        },
        { name: 'startName / endName', type: 'string', description: 'نام فیلدهای ارسال فرم برای دو سر بازه.' },
      ],
    },
  ],
  keyboard: [
    { keys: '← / ↑', action: 'در چیدمان راست‌به‌چپ: افزایش مقدار به اندازهٔ یک گام' },
    { keys: '→ / ↓', action: 'در چیدمان راست‌به‌چپ: کاهش مقدار به اندازهٔ یک گام' },
    { keys: 'PageUp / PageDown', action: 'تغییر با گام بزرگ‌تر' },
    { keys: 'Home / End', action: 'پرش به کمینه یا بیشینهٔ بازه' },
    { keys: 'Tab', action: 'جابه‌جایی میان دستگیرهٔ اول و دوم در RangeSlider' },
  ],
  a11y: [
    'هر دستگیره با نقش بومی slider، ویژگی‌های aria-valuemin/max/now و هدف لمسی ۴۴×۴۴ پیکسل کار می‌کند.',
    'در RangeSlider هر دو دستگیره به‌طور پیش‌فرض برچسب فارسی («حد پایین» و «حد بالا») دارند.',
    'در حالت forced-colors ریل، بخش پرشده و حلقهٔ فوکوس با رنگ‌های سیستم متمایز می‌مانند.',
  ],
  rtl: [
    'ریل افقی با ویژگی‌های منطقی از راست (کمینه) به چپ (بیشینه) پر می‌شود و جهت کلیدهای ← و → با RTL هماهنگ است.',
    'خروجی بازه‌ای با واژهٔ فارسی «تا» و ارقام فارسی با tabular-nums نمایش داده می‌شود.',
  ],
};
