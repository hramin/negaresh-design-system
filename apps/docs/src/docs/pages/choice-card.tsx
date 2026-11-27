import { iconBook, iconCard, iconKey, iconPrint } from '@negaresh/icons';
import { CheckboxGroup, ChoiceCard, RadioGroup, Stack } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './fields.module.css';

function Example() {
  const [plan, setPlan] = useState('clinic');
  const [addons, setAddons] = useState<string[]>(['extra-slot']);

  return (
    <div className={styles.example} data-interactive="choice-card">
      <Stack gap="6">
        <RadioGroup
          label="انتخاب نسخهٔ بسته"
          description="تمامی قیمت‌ها به تومان است."
          value={plan}
          onChange={setPlan}
        >
          <ChoiceCard
            value="starter"
            icon={iconBook}
            title="نسخهٔ آشنایی"
            description="مناسب بررسی نمونهٔ گزارش‌ها و آشنایی با محیط آزمون"
            price={0}
          />
          <ChoiceCard
            value="clinic"
            icon={iconCard}
            title="نسخهٔ کلینیک"
            badge="پیشنهادی"
            description="تفسیر کامل، چاپ استاندارد A4 و بایگانی مراجعان"
            price={350000}
          />
        </RadioGroup>

        <CheckboxGroup
          label="امکانات همراه"
          description="در صورت نیاز می‌توانید بیش از یک مورد اضافه کنید."
          value={addons}
          onChange={setAddons}
        >
          <ChoiceCard
            control="checkbox"
            value="extra-slot"
            icon={iconKey}
            title="یک فعال‌سازی اضافه"
            description="افزایش سقف فعال‌سازی سریال روی سیستم تازه"
            price={120000}
          />
          <ChoiceCard
            control="checkbox"
            value="print-brand"
            icon={iconPrint}
            title="سربرگ اختصاصی چاپ"
            description="نمایش نام و نشانی مرکز در گزارش‌های چاپی"
            price={90000}
          />
        </CheckboxGroup>
      </Stack>
    </div>
  );
}

export const choiceCardDoc: ComponentDoc = {
  slug: 'choice-card',
  title: 'کارت انتخاب',
  components: ['ChoiceCard'],
  base: 'RadioField / CheckboxField',
  summary:
    'کارت انتخاب‌پذیر بر پایهٔ رادیو یا چک‌باکس با عنوان، توضیح، آیکون، برچسب کوتاه و قیمت تومانی؛ بدون سایهٔ ایستا.',
  status: 'approved',
  products: ['R', 'N', 'T'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="حالت رادیویی (داخل RadioGroup)">
        <State label="انتخاب‌شده، رایگان و تومانی">
          <div className={styles.example}>
            <RadioGroup label="طرح اشتراک" defaultValue="pro">
              <ChoiceCard
                value="free"
                icon={iconBook}
                title="نسخهٔ پایه"
                description="دسترسی محدود به آزمون‌های نمونه"
                price={0}
              />
              <ChoiceCard
                value="pro"
                icon={iconCard}
                title="نسخهٔ حرفه‌ای"
                badge="پیشنهادی"
                description="دسترسی کامل به گزارش‌های تخصصی و چاپ A4"
                price={480000}
              />
              <ChoiceCard
                value="enterprise"
                icon={iconKey}
                title="نسخهٔ سازمانی"
                description="به‌زودی برای مراکز چندشعبه‌ای"
                price={1200000}
                isDisabled
              />
            </RadioGroup>
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="حالت چک‌باکسی و خطادار">
        <State label="چندانتخابی (CheckboxGroup)">
          <div className={styles.example}>
            <CheckboxGroup
              label="افزونه‌های سفارش"
              defaultValue={['slot']}
              isInvalid
              errorMessage="حداقل یک افزونهٔ سازگار با بسته را انتخاب کنید."
            >
              <ChoiceCard
                control="checkbox"
                value="slot"
                icon={iconKey}
                title="یک فعال‌سازی اضافه"
                description="قابل استفاده روی دستگاه دوم"
                price={120000}
              />
              <ChoiceCard
                control="checkbox"
                value="print"
                icon={iconPrint}
                title="نسخهٔ چاپی دفترچه"
                description="ارسال پستی همراه سفارش"
                price={85000}
              />
            </CheckboxGroup>
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای انتخاب بسته‌ها، درگاه‌های پرداخت، ویرایش‌های محصول یا افزونه‌هایی که توضیح و قیمت دارند از ChoiceCard استفاده کنید.',
      'قیمت عددی را مستقیم به عنوان number بدهید تا با formatPrice به تومان فارسی (یا «رایگان») قالب‌بندی شود.',
    ],
    dont: [
      'برای گزینه‌های سادهٔ تک‌خطی بدون توضیح و قیمت از ChoiceCard استفاده نکنید؛ Radio یا Checkbox سبک‌تر است.',
      'تبدیل ریال/تومان را داخل کامپوننت انجام ندهید؛ واحد نمایش همیشه تومان است (D-26).',
    ],
  },
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'ورود به کارت انتخاب‌شده یا جابه‌جایی میان کارت‌های چک‌باکسی' },
    { keys: '↑ / ↓', action: 'تغییر انتخاب در حالت رادیویی' },
    { keys: 'Space', action: 'انتخاب یا لغو انتخاب کارت در حالت چک‌باکسی' },
  ],
  a11y: [
    'تمام سطح کارت نقش برچسب ورودی بومی (radio/checkbox) را دارد و حلقهٔ فوکوس روی پیرامون کارت ظاهر می‌شود.',
    'حالت انتخاب تنها با رنگ نیست؛ نشانگر رادیویی/چک‌باکسی، رنگ زمینهٔ انتخاب و مرز هم‌زمان تغییر می‌کنند.',
    'سایهٔ ایستا وجود ندارد (D-77) و در حالت forced-colors نیز مرز و نشانگر انتخاب مشخص می‌مانند.',
  ],
  rtl: [
    'نشانگر و آیکون در سمت آغاز (راست)، متن در میانه و قیمت تومانی با ارقام هم‌عرض (tabular-nums) در سمت پایان (چپ) چیده می‌شوند.',
    'در عرض‌های موبایل (۳۹۰ پیکسل)، محتوا بدون ایجاد اسکرول افقی می‌شکند و خوانا می‌ماند.',
  ],
};
