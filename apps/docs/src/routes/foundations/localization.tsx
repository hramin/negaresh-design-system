import {
  Badge,
  Code,
  Heading,
  Inline,
  KeyValueItem,
  KeyValueList,
  Ltr,
  NumberField,
  PhoneField,
  Section,
  SerialField,
  Stack,
  Surface,
  Text,
} from '@negaresh/react';
import {
  formatDate,
  formatDateNumeric,
  formatDateTime,
  formatNumber,
  formatPercent,
  formatPrice,
  formatSerial,
  formatTomanCompact,
  isValidPhone,
  isValidSerial,
  maskPhone,
  normalizePhone,
  normalizeSerial,
  toPersianDigits,
} from '@negaresh/utils';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import styles from '../../components/Page.module.css';
import { TableWrap } from '../../components/TableWrap.tsx';
import fStyles from './foundations.module.css';

export const Route = createFileRoute('/foundations/localization')({
  head: () => ({ meta: [{ title: 'بومی‌سازی و راست‌به‌چپ · دیزاین سیستم نگرش' }] }),
  component: LocalizationFoundationPage,
});

const SAMPLE_ISO = '2026-11-13T13:34:00Z';

function LocalizationFoundationPage() {
  const [price, setPrice] = useState(490000);
  const [phone, setPhone] = useState('۰۹۱۲ ۳۴۵ ۶۷۸۹');
  const [serial, setSerial] = useState('n25ag-emv0k');

  const normPhone = normalizePhone(phone);
  const phoneOk = isValidPhone(phone);
  const normSerial = normalizeSerial(serial);
  const serialOk = isValidSerial(normSerial);

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <Inline gap="2" align="center">
          <Badge tone="neutral" size="sm">
            D-26 · D-30 · D-86
          </Badge>
        </Inline>
        <Heading level={1}>بومی‌سازی، راست‌به‌چپ و قالب‌بندی فارسی</Heading>
        <Text as="p" size="lg" tone="muted" leading="text" measure>
          تمامی قالب‌بندی‌های عدد، تاریخ جلالی (منطقهٔ زمانی تهران)، تومان، شمارهٔ موبایل و سریال از
          بستهٔ <Ltr>@negaresh/utils</Ltr> انجام می‌شود؛ کامپوننت‌ها هرگز به‌صورت دستی قالب‌بندی
          نمی‌کنند.
        </Text>
      </header>

      <section className={styles.section} aria-labelledby="live-formatters">
        <Heading level={2} id="live-formatters">
          آزمون زندهٔ قالب‌بندها (<Ltr>@negaresh/utils</Ltr>)
        </Heading>
        <div className={fStyles.grid2}>
          <Surface>
            <Section>
              <Stack gap="4">
                <Heading level={3}>قیمت به تومان (D-26)</Heading>
                <NumberField
                  label="مبلغ (تومان)"
                  value={price}
                  minValue={0}
                  step={10000}
                  onChange={(v) => setPrice(Number.isFinite(v) ? v : 0)}
                />
                <KeyValueList>
                  <KeyValueItem label="formatPrice" value={formatPrice(price)} />
                  <KeyValueItem label="formatTomanCompact" value={formatTomanCompact(price)} />
                  <KeyValueItem label="مقدار صفر (رایگان)" value={formatPrice(0)} />
                  <KeyValueItem
                    label="formatPercent (۰٫۷۸)"
                    value={formatPercent(0.78)}
                  />
                </KeyValueList>
              </Stack>
            </Section>
          </Surface>

          <Surface>
            <Section>
              <Stack gap="4">
                <Heading level={3}>تاریخ جلالی · منطقهٔ زمانی تهران</Heading>
                <Text size="sm" tone="muted">
                  ورودی استاندارد UTC: <Code>{SAMPLE_ISO}</Code>
                </Text>
                <KeyValueList>
                  <KeyValueItem label="formatDate" value={formatDate(SAMPLE_ISO)} />
                  <KeyValueItem label="formatDateTime" value={formatDateTime(SAMPLE_ISO)} />
                  <KeyValueItem label="formatDateNumeric" value={formatDateNumeric(SAMPLE_ISO)} />
                  <KeyValueItem
                    label="toPersianDigits"
                    value={toPersianDigits('صفحه 3 از 13')}
                  />
                </KeyValueList>
              </Stack>
            </Section>
          </Surface>

          <Surface>
            <Section>
              <Stack gap="4">
                <Heading level={3}>شمارهٔ همراه ایران</Heading>
                <PhoneField
                  label="شمارهٔ ورودی (ارقام فارسی یا لاتین)"
                  value={phone}
                  onChange={setPhone}
                />
                <KeyValueList>
                  <KeyValueItem
                    label="وضعیت اعتبار"
                    value={
                      <Badge tone={phoneOk ? 'success' : 'warning'} size="sm">
                        {phoneOk ? 'معتبر' : 'ناقص'}
                      </Badge>
                    }
                  />
                  <KeyValueItem
                    label="normalizePhone (ذخیره‌سازی)"
                    value={<Code>{normPhone || '—'}</Code>}
                  />
                  <KeyValueItem
                    label="maskPhone (نمایش امن)"
                    value={normPhone ? maskPhone(normPhone) : '—'}
                  />
                </KeyValueList>
              </Stack>
            </Section>
          </Surface>

          <Surface>
            <Section>
              <Stack gap="4">
                <Heading level={3}>سریال و کدهای چپ‌به‌راست (D-86)</Heading>
                <SerialField
                  label="سریال ۱۰ نویسه‌ای"
                  value={serial}
                  onChange={setSerial}
                />
                <KeyValueList>
                  <KeyValueItem
                    label="وضعیت الگو"
                    value={
                      <Badge tone={serialOk ? 'success' : 'warning'} size="sm">
                        {serialOk ? 'مطابق الگو' : 'نیاز به ۱۰ نویسه'}
                      </Badge>
                    }
                  />
                  <KeyValueItem
                    label="normalizeSerial"
                    value={<Code>{normSerial || '—'}</Code>}
                  />
                  <KeyValueItem
                    label="formatSerial"
                    value={<Code>{formatSerial(serial) || '—'}</Code>}
                  />
                </KeyValueList>
              </Stack>
            </Section>
          </Surface>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="digit-policy">
        <Heading level={2} id="digit-policy">
          سیاست ارقام و جهت (D-86)
        </Heading>
        <TableWrap label="جدول سیاست ارقام فارسی و لاتین">
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">نوع محتوا</th>
                <th scope="col">ارقام و جهت</th>
                <th scope="col">نمونه</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">متن، تاریخ، قیمت، شمارش، نمره</th>
                <td>ارقام فارسی · راست‌به‌چپ</td>
                <td>{formatNumber(1240)} فعال‌سازی · {formatPrice(350000)}</td>
              </tr>
              <tr>
                <th scope="row">سریال، کد سیستم، کد فعال‌سازی، ایمیل، URL</th>
                <td>ارقام لاتین · جزیرهٔ LTR (<Code>{'<Ltr>'}</Code> / <Code>{'<Code>'}</Code>)</td>
                <td><Code>ACT-7K9P-3M2Q</Code></td>
              </tr>
              <tr>
                <th scope="row">ورودی‌های عددی و موبایل</th>
                <td>پذیرش ارقام فارسی، عربی و لاتین + نرمال‌سازی خودکار</td>
                <td><Ltr>+989123456789</Ltr></td>
              </tr>
            </tbody>
          </table>
        </TableWrap>
      </section>
    </article>
  );
}
