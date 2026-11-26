import {
  Button,
  ButtonGroup,
  ChoiceCard,
  CopyButton,
  DatePicker,
  FieldGroup,
  FileUpload,
  type FileUploadItem,
  Form,
  FormErrorSummary,
  Heading,
  OTPField,
  PhoneField,
  RadioGroup,
  Section,
  SerialField,
  Stack,
  Surface,
  Text,
  TextField,
} from '@negaresh/react';
import { formatDate, isValidPhone, isValidSerial, normalizePhone, normalizeSerial } from '@negaresh/utils';
import { useForm } from '@tanstack/react-form';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { z } from 'zod';
import pageStyles from '../../components/Page.module.css';
import {
  toFormErrorSummaryItems,
  toNdsFieldError,
} from '../../docs/examples/tanstack-form-adapter.ts';
import styles from './tanstack-form-zod.module.css';

export const Route = createFileRoute('/guides/tanstack-form-zod')({
  head: () => ({
    meta: [{ title: 'آداپتور TanStack Form و Zod · دیزاین سیستم نگرش' }],
  }),
  component: TanStackFormZodGuide,
});

const activationRequestSchema = z.object({
  fullName: z.string().trim().min(3, 'نام و نام خانوادگی باید دست‌کم ۳ نویسه باشد.'),
  phone: z
    .string()
    .refine((value) => isValidPhone(value), {
      message: 'شمارهٔ همراه معتبر ایران را وارد کنید (مانند 09121234567).',
    }),
  serial: z
    .string()
    .refine((value) => isValidSerial(normalizeSerial(value)), {
      message: 'سریال ۱۰ نویسه‌ای را مطابق الگوی XXXXX-XXXXX وارد کنید.',
    }),
  otp: z
    .string()
    .regex(/^\d{6}$/, 'کد تأیید پیامکی باید دقیقاً ۶ رقم باشد.'),
  activationDate: z
    .string()
    .min(1, 'تاریخ شروع اعتبار را از تقویم جلالی انتخاب کنید.'),
  edition: z.enum(['single', 'clinic'], {
    error: 'یکی از بسته‌های فعال‌سازی را انتخاب کنید.',
  }),
  attachmentName: z
    .string()
    .min(1, 'پیوست پروندهٔ CSV یا تصویر فاکتور الزامی است.'),
});

type ActivationRequestValues = z.infer<typeof activationRequestSchema>;

const FIELD_ORDER = [
  'fullName',
  'phone',
  'serial',
  'otp',
  'activationDate',
  'edition',
  'attachmentName',
] as const satisfies readonly (keyof ActivationRequestValues)[];

const FIELD_IDS: Record<keyof ActivationRequestValues, string> = {
  fullName: 'tsf-fullname',
  phone: 'tsf-phone',
  serial: 'tsf-serial',
  otp: 'tsf-otp',
  activationDate: 'tsf-date',
  edition: 'tsf-edition',
  attachmentName: 'tsf-file',
};

const ADAPTER_SNIPPET = `import { Form, FormErrorSummary, PhoneField, SerialField } from '@negaresh/react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { toFormErrorSummaryItems, toNdsFieldError } from './tanstack-form-adapter';

const schema = z.object({
  phone: z.string().refine((v) => isValidPhone(v), 'شمارهٔ همراه معتبر وارد کنید.'),
  serial: z.string().refine((v) => isValidSerial(v), 'سریال را مطابق الگو وارد کنید.'),
});

const form = useForm({
  defaultValues: { phone: '', serial: '' },
  validators: { onSubmit: schema },
  onSubmit: async ({ value }) => { /* POST to product API */ },
});

// <Form validationBehavior="aria" onSubmit={(e) => { e.preventDefault(); void form.handleSubmit(); }}>
//   <FormErrorSummary errors={summaryItems} />
//   <form.Field name="phone">
//     {(field) => (
//       <PhoneField
//         id="app-phone"
//         label="شمارهٔ همراه"
//         value={field.state.value}
//         onChange={(next) => field.handleChange(next)}
//         onBlur={field.handleBlur}
//         {...toNdsFieldError(field.state.meta, { showError: submitted || field.state.meta.isTouched })}
//       />
//     )}
//   </form.Field>
// </Form>`;

function TanStackFormZodGuide() {
  const [submittedValues, setSubmittedValues] = useState<ActivationRequestValues | null>(null);
  const [serverErrors, setServerErrors] = useState<
    Partial<Record<keyof ActivationRequestValues, string>>
  >({});
  const [files, setFiles] = useState<FileUploadItem[]>([]);

  const form = useForm({
    defaultValues: {
      fullName: '',
      phone: '',
      serial: '',
      otp: '',
      activationDate: '2026-11-13',
      edition: 'single' as 'single' | 'clinic',
      attachmentName: '',
    } satisfies ActivationRequestValues,
    validators: {
      onSubmit: activationRequestSchema,
    },
    onSubmit: async ({ value }) => {
      setServerErrors({});
      setSubmittedValues(value);
    },
  });

  return (
    <article className={pageStyles.page}>
      <Stack gap="3">
        <Heading level={1}>آداپتور TanStack Form و Zod</Heading>
        <Text as="p" size="lg" tone="muted" leading="text" measure>
          بستهٔ <code className={pageStyles.codeWrap}>@negaresh/react</code> هیچ وابستگی زمان اجرا به
          کتابخانهٔ فرم یا اعتبارسنجی ندارد (D-80، سند پشته). برنامه‌های محصول می‌توانند{' '}
          <code className={pageStyles.codeWrap}>@tanstack/react-form</code> و{' '}
          <code className={pageStyles.codeWrap}>zod</code> را با یک آداپتور کوچک به فیلدهای NDS،{' '}
          <code className={pageStyles.codeWrap}>Form</code>،{' '}
          <code className={pageStyles.codeWrap}>FieldGroup</code> و{' '}
          <code className={pageStyles.codeWrap}>FormErrorSummary</code> متصل کنند.
        </Text>
      </Stack>

      <section className={pageStyles.section} aria-labelledby="tsf-demo-heading">
        <Heading level={2} id="tsf-demo-heading">
          نمونهٔ زنده با اعتبارسنجی فارسی Zod
        </Heading>
        <Text as="p" size="sm" tone="muted" measure>
          فرم زیر همهٔ فیلدهای کلیدی P3 را در کنار هم با اعتبارسنجی Standard Schema در Zod v4 و
          فوکوس خودکار نخستین فیلد خطادار در <code className={pageStyles.codeWrap}>Form</code> نشان
          می‌دهد. برای آزمایش خطای فارسی و خلاصهٔ پیونددار، فرم را خالی ارسال کنید.
        </Text>

        <Surface data-gallery="tanstack-form-zod" data-interactive="tanstack-form-zod">
          <Form
            aria-label="نمونهٔ اتصال TanStack Form و Zod"
            validationBehavior="aria"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmittedValues(null);
              void form.handleSubmit();
            }}
            onReset={() => {
              form.reset();
              setFiles([]);
              setServerErrors({});
              setSubmittedValues(null);
            }}
          >
            <Section>
              <Stack gap="6">
                <form.Subscribe
                  selector={(state) => ({
                    submissionAttempts: state.submissionAttempts,
                    fieldMeta: state.fieldMeta,
                  })}
                >
                  {({ submissionAttempts, fieldMeta }) => {
                    const summaryErrors =
                      submissionAttempts > 0 || Object.keys(serverErrors).length > 0
                        ? toFormErrorSummaryItems(FIELD_ORDER, FIELD_IDS, fieldMeta, serverErrors)
                        : [];
                    return <FormErrorSummary errors={summaryErrors} />;
                  }}
                </form.Subscribe>

                <FieldGroup
                  label="مشخصات متقاضی و کد تأیید"
                  description="شمارهٔ همراه، سریال و کد پیامکی به شکل خودکار به ارقام لاتین استاندارد تبدیل می‌شوند."
                >
                  <Stack gap="4">
                    <div className={styles.gridTwo}>
                      <form.Field name="fullName">
                        {(field) => (
                          <form.Subscribe selector={(s) => s.submissionAttempts > 0}>
                            {(hasSubmitted) => {
                              const err = toNdsFieldError(field.state.meta, {
                                showError: hasSubmitted || field.state.meta.isTouched,
                                serverError: serverErrors.fullName,
                              });
                              return (
                                <TextField
                                  id={FIELD_IDS.fullName}
                                  name="fullName"
                                  label="نام و نام خانوادگی"
                                  placeholder="مثلاً سارا احمدی"
                                  value={field.state.value}
                                  onChange={(next) => field.handleChange(next)}
                                  onBlur={field.handleBlur}
                                  isRequired
                                  isInvalid={err.isInvalid}
                                  errorMessage={err.errorMessage}
                                />
                              );
                            }}
                          </form.Subscribe>
                        )}
                      </form.Field>

                      <form.Field name="phone">
                        {(field) => (
                          <form.Subscribe selector={(s) => s.submissionAttempts > 0}>
                            {(hasSubmitted) => {
                              const err = toNdsFieldError(field.state.meta, {
                                showError: hasSubmitted || field.state.meta.isTouched,
                                serverError: serverErrors.phone,
                              });
                              return (
                                <PhoneField
                                  id={FIELD_IDS.phone}
                                  name="phone"
                                  label="شمارهٔ همراه"
                                  value={field.state.value}
                                  onChange={(next) => field.handleChange(next)}
                                  onBlur={field.handleBlur}
                                  isRequired
                                  isInvalid={err.isInvalid}
                                  errorMessage={err.errorMessage}
                                />
                              );
                            }}
                          </form.Subscribe>
                        )}
                      </form.Field>
                    </div>

                    <div className={styles.gridTwo}>
                      <form.Field name="serial">
                        {(field) => (
                          <form.Subscribe selector={(s) => s.submissionAttempts > 0}>
                            {(hasSubmitted) => {
                              const err = toNdsFieldError(field.state.meta, {
                                showError: hasSubmitted || field.state.meta.isTouched,
                                serverError: serverErrors.serial,
                              });
                              return (
                                <SerialField
                                  id={FIELD_IDS.serial}
                                  name="serial"
                                  label="سریال محصول"
                                  value={field.state.value}
                                  onChange={(next) => field.handleChange(next)}
                                  onBlur={field.handleBlur}
                                  isRequired
                                  isInvalid={err.isInvalid}
                                  errorMessage={err.errorMessage}
                                />
                              );
                            }}
                          </form.Subscribe>
                        )}
                      </form.Field>

                      <form.Field name="activationDate">
                        {(field) => (
                          <form.Subscribe selector={(s) => s.submissionAttempts > 0}>
                            {(hasSubmitted) => {
                              const err = toNdsFieldError(field.state.meta, {
                                showError: hasSubmitted || field.state.meta.isTouched,
                                serverError: serverErrors.activationDate,
                              });
                              return (
                                <DatePicker
                                  id={FIELD_IDS.activationDate}
                                  name="activationDate"
                                  label="تاریخ شروع اعتبار (جلالی)"
                                  value={field.state.value || null}
                                  onChange={(next) => field.handleChange(next ?? '')}
                                  isRequired
                                  isInvalid={err.isInvalid}
                                  errorMessage={err.errorMessage}
                                />
                              );
                            }}
                          </form.Subscribe>
                        )}
                      </form.Field>
                    </div>

                    <form.Field name="otp">
                      {(field) => (
                        <form.Subscribe selector={(s) => s.submissionAttempts > 0}>
                          {(hasSubmitted) => {
                            const err = toNdsFieldError(field.state.meta, {
                              showError: hasSubmitted || field.state.meta.isTouched,
                              serverError: serverErrors.otp,
                            });
                            return (
                              <OTPField
                                id={FIELD_IDS.otp}
                                name="otp"
                                label="کد تأیید پیامکی"
                                description="کد ۶ رقمی نمونه (مثلاً ۴۸۲۹۱۶) را تایپ یا جای‌گذاری کنید."
                                value={field.state.value}
                                onChange={(next) => field.handleChange(next)}
                                isRequired
                                isInvalid={err.isInvalid}
                                errorMessage={err.errorMessage}
                              />
                            );
                          }}
                        </form.Subscribe>
                      )}
                    </form.Field>
                  </Stack>
                </FieldGroup>

                <FieldGroup label="بسته و پیوست">
                  <Stack gap="5">
                    <form.Field name="edition">
                      {(field) => (
                        <RadioGroup
                          id={FIELD_IDS.edition}
                          name="edition"
                          label="نوع مجوز"
                          value={field.state.value}
                          onChange={(next) => {
                            if (next === 'single' || next === 'clinic') field.handleChange(next);
                          }}
                        >
                          <div className={styles.choices}>
                            <ChoiceCard
                              value="single"
                              title="مجوز تک‌کاربره"
                              description="فعال‌سازی روی یک رایانهٔ شخصی"
                              price={95000}
                            />
                            <ChoiceCard
                              value="clinic"
                              title="مجوز کلینیک"
                              description="تا ۵ رایانه همراه با گزارش تجمیعی"
                              price={390000}
                            />
                          </div>
                        </RadioGroup>
                      )}
                    </form.Field>

                    <form.Field name="attachmentName">
                      {(field) => (
                        <form.Subscribe selector={(s) => s.submissionAttempts > 0}>
                          {(hasSubmitted) => {
                            const err = toNdsFieldError(field.state.meta, {
                              showError: hasSubmitted || field.state.meta.isTouched,
                              serverError: serverErrors.attachmentName,
                            });
                            return (
                              <FileUpload
                                id={FIELD_IDS.attachmentName}
                                name="attachmentName"
                                label="پیوست فاکتور یا فهرست سریال"
                                hint="قالب‌های مجاز: CSV، TXT، PNG · حداکثر ۲ مگابایت"
                                accept={['.csv', '.txt', 'text/csv', 'text/plain', 'image/png']}
                                maxFileSize={2 * 1024 * 1024}
                                items={files}
                                onItemsChange={(nextItems) => {
                                  setFiles(nextItems);
                                  field.handleChange(nextItems[0]?.name ?? '');
                                }}
                                isRequired
                                isInvalid={err.isInvalid}
                                errorMessage={err.errorMessage}
                              />
                            );
                          }}
                        </form.Subscribe>
                      )}
                    </form.Field>
                  </Stack>
                </FieldGroup>

                {submittedValues && (
                  <div className={styles.resultBox} role="status" data-testid="tsf-success">
                    <Stack gap="2">
                      <Text as="p" size="sm" className={styles.resultTitle}>
                        درخواست با موفقیت اعتبارسنجی شد
                      </Text>
                      <Text as="p" size="sm">
                        متقاضی: {submittedValues.fullName} · تلفن:{' '}
                        <span dir="ltr">{normalizePhone(submittedValues.phone)}</span> · سریال:{' '}
                        <span dir="ltr">{normalizeSerial(submittedValues.serial)}</span> · تاریخ
                        شروع: {formatDate(submittedValues.activationDate)} · پیوست:{' '}
                        <span dir="ltr">{submittedValues.attachmentName}</span>
                      </Text>
                    </Stack>
                  </div>
                )}
              </Stack>
            </Section>

            <Section tone="sunken">
              <ButtonGroup>
                <Button variant="primary" type="submit">
                  بررسی و ثبت درخواست
                </Button>
                <Button type="reset" variant="secondary">
                  بازنشانی فرم
                </Button>
              </ButtonGroup>
            </Section>
          </Form>
        </Surface>
      </section>

      <section className={pageStyles.section} aria-labelledby="tsf-pattern-heading">
        <Heading level={2} id="tsf-pattern-heading">
          الگوی پیشنهادی اتصال در برنامه‌های محصول
        </Heading>
        <Surface>
          <Section>
            <div className={styles.codeCard}>
              <div className={styles.codeHeader}>
                <Text size="sm" weight="semibold">
                  نمونهٔ اتصال TanStack Form + Zod به فیلدهای NDS
                </Text>
                <CopyButton value={ADAPTER_SNIPPET} size="sm" aria-label="کپی کد آداپتور">
                  کپی کد
                </CopyButton>
              </div>
              <pre className={styles.codeBlock}>
                <code>{ADAPTER_SNIPPET}</code>
              </pre>
            </div>
          </Section>
        </Surface>
      </section>
    </article>
  );
}
