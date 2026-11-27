import { iconChart, iconFile } from '@negaresh/icons';
import { ToggleButton, ToggleButtonGroup } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';

export const toggleButtonDoc: ComponentDoc = {
  slug: 'toggle-button',
  title: 'دکمهٔ دوحالته',
  components: ['ToggleButton', 'ToggleButtonGroup'],
  base: 'ToggleButton, ToggleButtonGroup',
  summary:
    'دکمه‌ای که روشن یا خاموش می‌ماند، یا گروهی که یک یا چند گزینه را انتخاب می‌کند؛ حالت انتخاب با رنگ زمینه، مرز و وزن نشان داده می‌شود.',
  status: 'approved',
  products: ['N', 'T'],
  Example: () => (
    <ToggleButtonGroup aria-label="نمای نتیجه" defaultSelectedKeys={['pro']}>
      <ToggleButton id="pro" iconStart={iconChart}>
        نمای حرفه‌ای
      </ToggleButton>
      <ToggleButton id="calm" iconStart={iconFile}>
        نمای آرام
      </ToggleButton>
    </ToggleButtonGroup>
  ),
  Gallery: () => (
    <>
      <GalleryRow title="ToggleButton">
        <State label="خاموش">
          <ToggleButton>نمایش جزئیات</ToggleButton>
        </State>
        <State label="روشن">
          <ToggleButton defaultSelected>نمایش جزئیات</ToggleButton>
        </State>
        <State label="غیرفعال">
          <ToggleButton isDisabled>نمایش جزئیات</ToggleButton>
        </State>
        <State label='size="sm"'>
          <ToggleButton size="sm" defaultSelected>
            فشرده
          </ToggleButton>
        </State>
      </GalleryRow>
      <GalleryRow title="ToggleButtonGroup">
        <State label="انتخاب تکی">
          <ToggleButtonGroup aria-label="بازه" defaultSelectedKeys={['month']}>
            <ToggleButton id="week">هفته</ToggleButton>
            <ToggleButton id="month">ماه</ToggleButton>
            <ToggleButton id="year">سال</ToggleButton>
          </ToggleButtonGroup>
        </State>
        <State label="انتخاب چندتایی + غیرفعال">
          <ToggleButtonGroup
            aria-label="فیلتر"
            selectionMode="multiple"
            defaultSelectedKeys={['a', 'b']}
          >
            <ToggleButton id="a">کودک</ToggleButton>
            <ToggleButton id="b">نوجوان</ToggleButton>
            <ToggleButton id="c" isDisabled>
              بزرگسال
            </ToggleButton>
          </ToggleButtonGroup>
        </State>
        <State label="عمودی">
          <ToggleButtonGroup
            aria-label="چیدمان"
            orientation="vertical"
            defaultSelectedKeys={['list']}
          >
            <ToggleButton id="list">فهرست</ToggleButton>
            <ToggleButton id="grid">شبکه</ToggleButton>
          </ToggleButtonGroup>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: ['۲ تا ۵ گزینهٔ کوتاه؛ بیشتر از آن Select (P3).'],
    dont: ['ToggleButton برای اقدامی که فوراً اجرا می‌شود؛ آن Button است.'],
  },
  keyboard: [
    { keys: 'Space / Enter', action: 'تغییر حالت' },
    { keys: '← / →', action: 'گزینهٔ بعدی / قبلی در گروه' },
  ],
  a11y: ['گروه تکی نقش radiogroup دارد و برای همین نیاز به aria-label دارد.'],
  rtl: ['ترتیب گزینه‌ها از راست؛ پیمایش با کلید جهت بر اساس RTL.'],
};
