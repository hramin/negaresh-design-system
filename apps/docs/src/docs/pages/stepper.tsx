import { Button, ButtonGroup, Section, Stack, Stepper, Surface } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './navigation.module.css';

const CHECKOUT_STEPS = [
  { id: 'cart', title: 'بررسی سبد خرید', description: 'تأیید کالاها و اعمال کد تخفیف.' },
  { id: 'shipping', title: 'نشانی و زمان ارسال', description: 'انتخاب آدرس تحویل.' },
  { id: 'payment', title: 'پرداخت اینترنتی', description: 'انتخاب درگاه و تکمیل سفارش.' },
];

function Example() {
  const [step, setStep] = useState(2);

  return (
    <div className={styles.wide} data-interactive="stepper">
      <Stack gap="5">
        <Stepper
          asNav
          orientation="horizontal"
          aria-label="مراحل خرید (تعاملی)"
          currentStep={step}
          steps={CHECKOUT_STEPS.map((item, idx) => ({
            ...item,
            ...(idx + 1 < step ? { onPress: () => setStep(idx + 1) } : {}),
          }))}
        />
        <ButtonGroup>
          <Button
            variant="secondary"
            size="sm"
            isDisabled={step <= 1}
            onPress={() => setStep((s) => Math.max(1, s - 1))}
          >
            مرحلهٔ قبل
          </Button>
          <Button
            variant="primary"
            size="sm"
            isDisabled={step >= CHECKOUT_STEPS.length}
            onPress={() => setStep((s) => Math.min(CHECKOUT_STEPS.length, s + 1))}
          >
            مرحلهٔ بعد
          </Button>
        </ButtonGroup>
      </Stack>
    </div>
  );
}

export const stepperDoc: ComponentDoc = {
  slug: 'stepper',
  title: 'مراحل انجام کار (Stepper)',
  components: ['Stepper', 'StepperStep'],
  summary:
    'نشانگر مراحل خطی با حالت‌های انجام‌شده (done)، فعلی (aria-current="step") و بعدی، شماره‌گذاری فارسی (formatNumber) و دو چیدمان عمودی (راهنمای رجیستری) و افقی.',
  status: 'review',
  products: ['R', 'N', 'T'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="عمودی · راهنمای سه‌گامی رجیستری">
        <State label="vertical · currentStep=2">
          <div className={styles.narrow}>
            <Surface>
              <Section>
                <Stepper
                  orientation="vertical"
                  currentStep={2}
                  steps={[
                    {
                      id: 'open',
                      title: 'باز کردن از برنامه.',
                      description: 'دکمهٔ «فعال‌سازی آنلاین» همین صفحه را باز می‌کند.',
                      inlineDescription: true,
                    },
                    {
                      id: 'serial',
                      title: 'وارد کردن سریال.',
                      description: 'سریال روی جعبه یا در پیامک خرید است.',
                      inlineDescription: true,
                    },
                    {
                      id: 'code',
                      title: 'وارد کردن کد در برنامه.',
                      description: 'کد را کپی و در پنجرهٔ فعال‌سازی وارد کنید.',
                      inlineDescription: true,
                    },
                  ]}
                />
              </Section>
            </Surface>
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="افقی · فرایند پرداخت (زیر ۶۰۰ پیکسل عمودی می‌شود)">
        <State label="horizontal · currentStep=2">
          <div className={styles.wide}>
            <Stepper orientation="horizontal" currentStep={2} steps={CHECKOUT_STEPS} />
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای راهنمای مرحله‌ای (مانند فعال‌سازی رجیستری) از orientation="vertical" و برای ویزاردها از orientation="horizontal" استفاده کنید.',
      'برای مراحل بازگشت‌پذیر، onPress یا href بدهید تا کاربر بتواند به گام‌های انجام‌شده برگردد.',
    ],
    dont: [
      'تنها به رنگ برای تمایز مراحل تکیه نکنید؛ Stepper تیک، عدد فارسی و متن وضعیت مخفی برای صفحه‌خوان را همراه می‌کند.',
    ],
  },
  api: [
    {
      name: 'Stepper',
      props: [
        { name: 'steps', type: 'readonly StepperStepData[]', description: 'آرایهٔ مراحل با عنوان، توضیح و وضعیت.' },
        { name: 'currentStep', type: 'number', description: 'شمارهٔ مرحلهٔ جاری (از ۱) برای محاسبهٔ خودکار done/current/upcoming.' },
        { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'جهت چیدمان مراحل.' },
        { name: 'asNav', type: 'boolean', default: 'false', description: 'در صورت true بودن، فهرست را درون <nav> قرار می‌دهد.' },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab / Enter', action: 'در مراحل تعاملی (دارای href یا onPress) پیمایش و فعال‌سازی مرحله.' },
  ],
  a11y: [
    'از لیست مرتب <ol> استفاده می‌کند و مرحلهٔ جاری را با aria-current="step" نشانه‌گذاری می‌کند.',
    'وضعیت هر مرحله («انجام‌شده»، «مرحلهٔ فعلی»، «مرحلهٔ بعدی») با VisuallyHidden برای صفحه‌خوان خوانده می‌شود.',
  ],
  rtl: [
    'در جهت راست‌به‌چپ خط رابط مراحل افقی از راست به چپ پیشرفت می‌کند و شماره‌ها با formatNumber فارسی می‌شوند.',
  ],
};
