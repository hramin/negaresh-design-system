import { Checkbox, CheckboxGroup, Stack } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './fields.module.css';

const ALL_CHANNELS = ['sms', 'email', 'panel'];

function Example() {
  const [selected, setSelected] = useState<string[]>(['sms']);
  const allSelected = selected.length === ALL_CHANNELS.length;
  const isIndeterminate = selected.length > 0 && !allSelected;

  return (
    <div className={styles.example} data-interactive="checkbox">
      <Stack gap="4">
        <Checkbox
          isSelected={allSelected}
          isIndeterminate={isIndeterminate}
          onChange={(checked) => setSelected(checked ? ALL_CHANNELS : [])}
        >
          انتخاب همهٔ کانال‌های اطلاع‌رسانی
        </Checkbox>
        <CheckboxGroup
          label="کانال‌های فعال"
          description="هر زمان می‌توانید این تنظیمات را در حساب کاربری تغییر دهید."
          value={selected}
          onChange={setSelected}
        >
          <Checkbox value="sms" description="کد تأیید و هشدارهای فوری">
            پیامک
          </Checkbox>
          <Checkbox value="email" description="فاکتور و گزارش ماهانه">
            ایمیل
          </Checkbox>
          <Checkbox value="panel">اعلان داخل پنل</Checkbox>
        </CheckboxGroup>
      </Stack>
    </div>
  );
}

export const checkboxDoc: ComponentDoc = {
  slug: 'checkbox',
  title: 'چک‌باکس و گروه چک‌باکس',
  components: ['Checkbox', 'CheckboxGroup'],
  base: 'CheckboxField, CheckboxButton, CheckboxGroup',
  summary:
    'انتخاب مستقل یا چندگانه با پشتیبانی از حالت نیمه‌انتخاب‌شده (indeterminate)، توضیح هر گزینه، چیدمان عمودی/افقی و اعتبارسنجی گروهی.',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="حالت‌های Checkbox">
        <State label="انتخاب‌نشده">
          <Checkbox>قوانین استفاده را می‌پذیرم</Checkbox>
        </State>
        <State label="انتخاب‌شده">
          <Checkbox defaultSelected>دریافت گزارش ماهانه</Checkbox>
        </State>
        <State label="نیمه‌انتخاب‌شده (indeterminate)">
          <Checkbox isIndeterminate>انتخاب همهٔ موارد</Checkbox>
        </State>
        <State label="با توضیح">
          <Checkbox defaultSelected description="فقط پیام‌های امنیتی و فعال‌سازی ارسال می‌شود.">
            هشدارهای امنیتی
          </Checkbox>
        </State>
      </GalleryRow>
      <GalleryRow title="غیرفعال، فقط‌خواندنی و خطادار">
        <State label="غیرفعال">
          <Stack gap="2">
            <Checkbox isDisabled>گزینهٔ غیرفعال</Checkbox>
            <Checkbox isDisabled defaultSelected>
              انتخاب‌شدهٔ غیرفعال
            </Checkbox>
          </Stack>
        </State>
        <State label="فقط‌خواندنی">
          <Checkbox isReadOnly defaultSelected>
            ثبت ممیزی فعال است
          </Checkbox>
        </State>
        <State label="خطای تکی">
          <Checkbox isInvalid errorMessage="پذیرش قوانین برای ادامه الزامی است.">
            قوانین استفاده را می‌پذیرم
          </Checkbox>
        </State>
      </GalleryRow>
      <GalleryRow title="CheckboxGroup">
        <State label="عمودی با خطا">
          <CheckboxGroup
            className={styles.field}
            label="دسترسی‌های نقش"
            description="دست‌کم یک دسترسی انتخاب کنید."
            isInvalid
            errorMessage="انتخاب یک دسترسی الزامی است."
          >
            <Checkbox value="read">مشاهده</Checkbox>
            <Checkbox value="edit">ویرایش</Checkbox>
          </CheckboxGroup>
        </State>
        <State label="افقی">
          <CheckboxGroup label="وضعیت سفارش" orientation="horizontal" defaultValue={['paid']}>
            <Checkbox value="pending">در انتظار</Checkbox>
            <Checkbox value="paid">پرداخت‌شده</Checkbox>
            <Checkbox value="shipped">ارسال‌شده</Checkbox>
          </CheckboxGroup>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای انتخاب صفر، یک یا چند گزینهٔ مستقل از Checkbox و CheckboxGroup استفاده کنید.',
      'در انتخاب سرستون جدول‌ها یا گروه‌های تو در تو، حالت نیمه‌انتخاب را با isIndeterminate نشان دهید.',
    ],
    dont: [
      'برای تنظیماتی که فوراً و بدون دکمهٔ ذخیره اعمال می‌شوند از Checkbox استفاده نکنید؛ از Switch استفاده کنید.',
      'برای انتخاب یک گزینه از میان چند مورد انحصاری، RadioGroup به کار ببرید.',
    ],
  },
  api: [
    {
      name: 'Checkbox',
      props: [
        { name: 'children', type: 'ReactNode', description: 'برچسب دیدنی چک‌باکس.' },
        { name: 'description', type: 'ReactNode', description: 'توضیح تکمیلی متصل به ورودی.' },
        { name: 'isSelected / defaultSelected', type: 'boolean', description: 'کنترل‌شده / اولیه.' },
        { name: 'onChange', type: '(isSelected: boolean) => void', description: '—' },
        { name: 'isIndeterminate', type: 'boolean', description: 'حالت نیمه‌انتخاب‌شده (خط تیره).' },
        { name: 'value / name', type: 'string', description: 'مقدار در CheckboxGroup یا فرم.' },
        {
          name: 'isDisabled / isReadOnly / isRequired / isInvalid',
          type: 'boolean',
          description: 'حالت‌های کنترلی و اعتبارسنجی.',
        },
        { name: 'errorMessage', type: 'ReactNode', description: 'خطای چک‌باکس تکی.' },
        { name: 'className / ref', type: 'string / Ref<HTMLInputElement>', description: '—' },
      ],
    },
    {
      name: 'CheckboxGroup',
      props: [
        { name: 'label', type: 'ReactNode', description: 'برچسب گروه.' },
        { name: 'value / defaultValue', type: 'string[]', description: 'مقادیر انتخاب‌شده.' },
        { name: 'onChange', type: '(value: string[]) => void', description: '—' },
        {
          name: 'orientation',
          type: "'vertical' | 'horizontal'",
          default: "'vertical'",
          description: 'چیدمان گزینه‌ها.',
        },
        { name: 'description / errorMessage', type: 'ReactNode', description: 'راهنما و خطای گروه.' },
        {
          name: 'isRequired / isDisabled / isReadOnly / isInvalid',
          type: 'boolean',
          description: '—',
        },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'حرکت میان چک‌باکس‌ها' },
    { keys: 'Space', action: 'تغییر وضعیت انتخاب چک‌باکس دارای فوکوس' },
  ],
  a11y: [
    'هر ردیف چک‌باکس دست‌کم ۴۴ پیکسل ارتفاع لمسی دارد و حلقهٔ فوکوس روی خود کادر چک‌باکس دیده می‌شود.',
    'حالت انتخاب با آیکون تیک و حالت نیمه‌انتخاب با خط تیره مشخص می‌شود (نه فقط رنگ).',
    'توضیح هر گزینه و خطای گروه با aria-describedby و نقش alert به ورودی متصل می‌شوند.',
  ],
  rtl: [
    'کادر چک‌باکس در سمت آغاز (راست) قرار می‌گیرد و توضیح زیرین با تورفتگی منطقی (padding-inline-start) هم‌تراز متن برچسب است.',
  ],
};
