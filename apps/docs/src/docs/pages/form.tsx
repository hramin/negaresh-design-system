import {
  Button,
  FieldGroup,
  Form,
  FormErrorSummary,
  Stack,
  Text,
  TextField,
} from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './fields.module.css';

function Example() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  return (
    <div className={styles.example} data-interactive="form">
      <Form
        aria-label="درخواست آزمایشی"
        validationErrors={errors}
        onSubmit={(event) => {
          event.preventDefault();
          setErrors({ email: 'این نشانی قبلاً ثبت شده است؛ نشانی دیگری وارد کنید.' });
        }}
        onReset={() => setErrors({})}
      >
        <Stack gap="5">
          <FormErrorSummary
            errors={errors.email ? [{ id: 'wave1-email', message: errors.email }] : []}
          />
          <FieldGroup
            label="اطلاعات درخواست"
            description="این نمونه به سرور متصل نیست؛ پس از ارسال معتبر، یک خطای سرور را نمایش می‌دهد."
          >
            <Stack gap="4">
              <TextField
                id="wave1-name"
                label="نام درخواست‌کننده"
                name="name"
                isRequired
                autoComplete="name"
              />
              <TextField
                id="wave1-email"
                label="ایمیل"
                name="email"
                type="email"
                dir="ltr"
                isRequired
                autoComplete="email"
                description="برای دریافت پاسخ درخواست."
              />
            </Stack>
          </FieldGroup>
          <Stack gap="3">
            <Button variant="primary" type="submit">
              ثبت درخواست آزمایشی
            </Button>
            <Button type="reset">پاک کردن فرم</Button>
          </Stack>
        </Stack>
      </Form>
    </div>
  );
}

export const formDoc: ComponentDoc = {
  slug: 'form',
  title: 'فرم و خطاهای آن',
  components: ['Form', 'FieldGroup', 'FormErrorSummary'],
  base: 'Form, fieldset / legend',
  summary:
    'فرم با اعتبارسنجی بومی یا مدیریت‌شده، گروه معنایی فیلدها، خطاهای نام‌گذاری‌شدهٔ سرور و خلاصه‌ای با پیوند به ورودی خطادار.',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="گروه‌های فرم">
        <State label="گروه با راهنما">
          <div className={styles.field}>
            <FieldGroup label="اطلاعات حساب" description="نامی که در حساب نمایش داده می‌شود.">
              <TextField label="نام نمایشی" defaultValue="نگارش برتر" />
            </FieldGroup>
          </div>
        </State>
        <State label="گروه غیرفعال">
          <div className={styles.field}>
            <FieldGroup label="در انتظار دسترسی" isDisabled>
              <TextField label="عنوان" defaultValue="درخواست" />
            </FieldGroup>
          </div>
        </State>
        <State label="گروه خطادار">
          <div className={styles.field}>
            <FieldGroup
              label="اطلاعات تکمیلی"
              isInvalid
              errorMessage="یکی از روش‌های ارتباط را کامل کنید."
            >
              <TextField label="شمارهٔ داخلی" />
            </FieldGroup>
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="خطای سرور و خلاصه">
        <State label="validationErrors با نام فیلد">
          <div className={styles.field}>
            <Form
              aria-label="فرم خطای سرور"
              validationErrors={{ galleryEmail: 'این ایمیل در حساب دیگری ثبت شده است.' }}
            >
              <TextField
                id="wave1-gallery-email"
                name="galleryEmail"
                type="email"
                dir="ltr"
                label="ایمیل ثبت‌شده"
                defaultValue="example@negaresh.ir"
              />
            </Form>
          </div>
        </State>
        <State label="خلاصهٔ پیونددار">
          <div className={styles.field}>
            <Stack gap="4">
              <FormErrorSummary
                errors={[{ id: 'wave1-summary-name', message: 'نام سازمان را کامل وارد کنید.' }]}
              />
              <TextField
                id="wave1-summary-name"
                label="نام سازمان"
                defaultValue="ن"
                isInvalid
                errorMessage="نام سازمان را کامل وارد کنید."
              />
            </Stack>
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="ارسال و وضعیت">
        <State label="اعتبارسنجی بومی">
          <div className={styles.field}>
            <Form aria-label="نمونهٔ اعتبارسنجی بومی">
              <Stack gap="3">
                <TextField label="عنوان الزامی" isRequired />
                <Button type="submit">بررسی عنوان</Button>
              </Stack>
            </Form>
          </div>
        </State>
        <State label="در حال انجام">
          <div className={styles.field}>
            <Stack gap="3">
              <TextField label="نام در حال بررسی" defaultValue="نگارش برتر" isPending />
              <Button isPending variant="primary">
                ثبت درخواست
              </Button>
              <Text size="sm" tone="muted">
                از ارسال تکراری جلوگیری می‌شود.
              </Text>
            </Stack>
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای خطای سرور، کلید خطا را برابر name همان فیلد قرار دهید.',
      'در فرم بلند، خلاصه را در بالا و خطای مشخص را کنار هر فیلد نگه دارید.',
      'با اعتبارسنجی مدیریت‌شده، isInvalid و errorMessage را روی فیلد تنظیم کنید؛ فرم پس از ارسال نخستین ورودی خطادار را فوکوس می‌کند.',
    ],
    dont: [
      'خطا را فقط با رنگ یا پیام کلی «نامعتبر» نشان ندهید.',
      'خلاصه را به جای خطای کنار فیلد نگذارید.',
      'اعتبارسنجی مرورگر را جایگزین اعتبارسنجی سرور ندانید.',
    ],
  },
  api: [
    {
      name: 'Form',
      props: [
        {
          name: 'validationErrors',
          type: 'Record<string, string | string[]>',
          description:
            'خطای سرور بر اساس name فیلد؛ در رفتار native، ویرایش پس از خروج از فیلد یا ارسال دوباره ارزیابی می‌شود.',
        },
        {
          name: 'validationBehavior',
          type: "'native' | 'aria'",
          default: "'native'",
          description: 'native ارسال نامعتبر را متوقف می‌کند؛ aria برای اعتبارسنجی مدیریت‌شده است.',
        },
        {
          name: 'onSubmit / onReset / onInvalid',
          type: '(event: FormEvent<HTMLFormElement>) => void',
          description:
            'رویدادهای ارسال، بازنشانی و نامعتبرشدن؛ برای درخواست سفارشی از preventDefault استفاده کنید.',
        },
        {
          name: 'action / method / encType / target',
          type: 'HTML form attributes',
          description: 'ویژگی‌های استاندارد ارسال فرم؛ بدون وابستگی به کلاینت API محصول.',
        },
        {
          name: 'className / ref',
          type: 'string / Ref<HTMLFormElement>',
          description: 'کلاس ریشه و دسترسی به فرم واقعی.',
        },
      ],
    },
    {
      name: 'FieldGroup',
      props: [
        {
          name: 'label',
          type: 'ReactNode',
          description: 'عنوان الزامی گروه؛ با legend روی fieldset.',
        },
        {
          name: 'description / errorMessage / isInvalid',
          type: 'ReactNode / ReactNode / boolean',
          description: 'راهنما و خطای مرتبط با گروه.',
        },
        {
          name: 'isDisabled',
          type: 'boolean',
          description: 'غیرفعال‌کردن فیلدهای گروه با رفتار بومی fieldset.',
        },
        {
          name: 'children / name / id / className / ref',
          type: 'ReactNode / string / string / string / Ref<HTMLFieldSetElement>',
          description: 'محتوا و ویژگی‌های ریشهٔ معنایی گروه.',
        },
      ],
    },
    {
      name: 'FormErrorSummary',
      props: [
        {
          name: 'errors',
          type: 'readonly {id: string; message: ReactNode}[]',
          description: 'هر شناسه به ورودی واقعی اشاره می‌کند؛ فهرست خالی چیزی رندر نمی‌کند.',
        },
        {
          name: 'title',
          type: 'ReactNode',
          default: 'messages.errorSummaryTitle',
          description: 'عنوان فارسی؛ مقدار پیش‌فرض از کاتالوگ پیام‌ها می‌آید.',
        },
        {
          name: 'id / className / ref',
          type: 'string / string / Ref<HTMLDivElement>',
          description: 'ویژگی‌های ریشهٔ خلاصه.',
        },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'حرکت منطقی میان فیلدها، پیوندهای خطا و دکمه‌های فرم.' },
    {
      keys: 'Enter روی ارسال',
      action: 'اعتبارسنجی بومی و فوکوس نخستین فیلد نامعتبر، یا ارسال فرم معتبر.',
    },
    { keys: 'Enter روی پیوند خطا', action: 'فوکوس ورودی متناظر با شناسهٔ مقصد.' },
  ],
  a11y: [
    'گروه‌ها fieldset و legend دارند و خطای گروه با aria-describedby مرتبط می‌شود.',
    'خطاهای تک‌فیلد به همان ورودی متصل‌اند؛ خلاصه با پیوند نام‌دار دسترسی سریع می‌دهد.',
    'در رفتار native، مرورگر و React Aria نخستین فیلد نامعتبر را فوکوس می‌کنند؛ Form خطاهای برنامه و سرور را پس از ارسال، حتی با پاسخ دیرتر، یک بار فوکوس می‌کند.',
  ],
  rtl: [
    'ترتیب خواندن و ناوبری فرم RTL است؛ ایمیل و کدها در ورودی‌های LTR مستقل قرار می‌گیرند.',
    'خلاصهٔ خطا و گروه‌ها از فاصله‌های منطقی و توکن‌های مشترک استفاده می‌کنند.',
  ],
};
