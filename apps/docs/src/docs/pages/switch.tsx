import { Stack, Switch, Text } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './fields.module.css';

function Example() {
  const [autoSend, setAutoSend] = useState(true);
  return (
    <div className={styles.example} data-interactive="switch">
      <Stack gap="3">
        <Switch
          isSelected={autoSend}
          onChange={setAutoSend}
          description="پس از پایان آزمون، لینک گزارش به‌صورت خودکار برای مراجع ارسال می‌شود."
        >
          ارسال خودکار گزارش
        </Switch>
        <Text size="sm" tone="muted">
          وضعیت فعلی: {autoSend ? 'روشن' : 'خاموش'}
        </Text>
      </Stack>
    </div>
  );
}

export const switchDoc: ComponentDoc = {
  slug: 'switch',
  title: 'کلید دووضعیتی',
  components: ['Switch'],
  base: 'SwitchField, SwitchButton',
  summary:
    'کلید روشن/خاموش برای تنظیمات دوتایی با اعمال فوری؛ همراه با توضیح اختیاری، حرکت راست‌به‌چپ دستگیره و احترام به کاهش حرکت.',
  status: 'approved',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="وضعیت‌های پایه">
        <State label="خاموش">
          <Switch>اطلاع‌رسانی پیامکی</Switch>
        </State>
        <State label="روشن">
          <Switch defaultSelected>اطلاع‌رسانی پیامکی</Switch>
        </State>
        <State label="با توضیح">
          <Switch defaultSelected description="تنها برای ورودهای تازه از دستگاه ناشناس.">
            هشدار ورود تازه
          </Switch>
        </State>
      </GalleryRow>
      <GalleryRow title="غیرفعال و فقط‌خواندنی">
        <State label="غیرفعال خاموش">
          <Switch isDisabled>گزارش خودکار</Switch>
        </State>
        <State label="غیرفعال روشن">
          <Switch isDisabled defaultSelected>
            ثبت رخداد امنیتی
          </Switch>
        </State>
        <State label="فقط‌خواندنی">
          <Switch isReadOnly defaultSelected>
            قفل سازمانی فعال است
          </Switch>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای تنظیمات دوتایی که بلافاصله روشن یا خاموش می‌شوند (مانند اعلان‌ها یا دسترسی یک ویژگی) از Switch استفاده کنید.',
      'برچسب را طوری بنویسید که بدون نیاز به واژهٔ «فعال/غیرفعال» معنای روشن بودن آن روشن باشد.',
    ],
    dont: [
      'در فرم‌هایی که نیازمند دکمهٔ «ثبت» هستند (مانند پذیرش قوانین) از Switch استفاده نکنید؛ Checkbox مناسب‌تر است.',
    ],
  },
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'جابه‌جایی فوکوس روی کلید' },
    { keys: 'Space / Enter', action: 'تغییر وضعیت روشن و خاموش' },
  ],
  a11y: [
    'نقش بومی switch را اعلام می‌کند و ردیف آن دست‌کم ۴۴ پیکسل ارتفاع لمسی دارد.',
    'حلقهٔ فوکوس روی ریل کلید دیده می‌شود و در حالت forced-colors نیز ریل و دستگیره متمایز می‌مانند.',
    'در prefers-reduced-motion: reduce جابه‌جایی دستگیره بدون انیمیشن انجام می‌شود.',
  ],
  rtl: [
    'ریل کلید در سمت آغاز (راست) قرار دارد و با روشن شدن، دستگیره به سمت پایان (چپ در فارسی و راست در انگلیسی) حرکت می‌کند.',
  ],
};
