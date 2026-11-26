import {
  KeyValueItem,
  KeyValueList,
  Section,
  StatusBadge,
  Surface,
  Text,
} from '@negaresh/react';
import { formatDate, formatToman, maskPhone } from '@negaresh/utils';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './overlays.module.css';

const SAMPLE_DATE = formatDate('2026-11-15');
const MASKED_PHONE = maskPhone('09123456789');

function Example() {
  const [copiedNote, setCopiedNote] = useState<string | null>(null);

  return (
    <div className={styles.block} data-interactive="key-value-list">
      <Surface>
        <Section>
          <KeyValueList aria-label="جزئیات سریال انتخاب‌شده">
            <KeyValueItem
              label="شمارهٔ سریال"
              value="NGR-4920-8814-AB12"
              code
              copyValue="NGR49208814AB12"
              onCopy={() => setCopiedNote('شمارهٔ سریال کپی شد.')}
            />
            <KeyValueItem
              label="کد فعال‌سازی"
              value="ACT-7712-9034-Z8K1"
              code
              copyValue="ACT77129034Z8K1"
              onCopy={() => setCopiedNote('کد فعال‌سازی کپی شد.')}
            />
            <KeyValueItem label="شمارهٔ همراه مالک" value={MASKED_PHONE} ltr />
            <KeyValueItem label="وضعیت" value={<StatusBadge domain="serial" status="active" />} />
            <KeyValueItem label="تاریخ صدور" value={SAMPLE_DATE} />
            <KeyValueItem label="مبلغ سفارش" value={formatToman(490000)} />
          </KeyValueList>
          {copiedNote && (
            <Text size="xs" tone="muted" className={styles.output}>
              {copiedNote}
            </Text>
          )}
        </Section>
      </Surface>
    </div>
  );
}

export const keyValueListDoc: ComponentDoc = {
  slug: 'key-value-list',
  title: 'فهرست کلید و مقدار (KeyValueList)',
  components: ['KeyValueList', 'KeyValueItem'],
  summary:
    'فهرست معنایی <dl> برای نمایش جفت‌های برچسب/مقدار با ایزوله‌سازی خودکار مقادیر چپ‌به‌راست و کدها (D-86) و ردیف‌های قابل کپی با استفادهٔ مجدد از CopyButton.',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="چیدمان افقی (پیش‌فرض · زیر ۶۰۰ پیکسل ستونی می‌شود)">
        <State label="horizontal · divided">
          <div className={styles.block}>
            <Surface>
              <Section>
                <KeyValueList>
                  <KeyValueItem
                    label="کد پیگیری"
                    value="PAY-1405-8821"
                    code
                    copyValue="PAY14058821"
                  />
                  <KeyValueItem label="ایمیل پشتیبانی" value="support@negaresh.ir" ltr />
                  <KeyValueItem label="مبلغ" value={formatToman(250000)} />
                </KeyValueList>
              </Section>
            </Surface>
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="چیدمان ستونی و تراکم فشرده">
        <State label="stacked · compact">
          <div className={styles.cardFrame}>
            <Surface>
              <Section>
                <KeyValueList
                  layout="stacked"
                  density="compact"
                  items={[
                    { id: 'order', label: 'شمارهٔ سفارش', value: 'ORD-90421', code: true },
                    { id: 'phone', label: 'شمارهٔ همراه', value: MASKED_PHONE, ltr: true },
                    { id: 'date', label: 'تاریخ ثبت', value: SAMPLE_DATE },
                  ]}
                />
              </Section>
            </Surface>
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای صفحهٔ جزئیات سریال، خلاصهٔ سفارش و مشخصات پروفایل از KeyValueList استفاده کنید.',
      'برای سریال، کد فعال‌سازی و شمارهٔ سفارش ویژگی code و برای شمارهٔ همراه، ایمیل و نشانی وب ویژگی ltr را فعال کنید (D-86).',
      'در ردیف‌های قابل کپی، مقدار نرمال‌شده (بدون فاصله) را به copyValue بدهید.',
    ],
    dont: [
      'برای مقایسهٔ چند رکورد هم‌ساختار از KeyValueList استفاده نکنید؛ آن کار DataTable است.',
    ],
  },
  api: [
    {
      name: 'KeyValueList',
      props: [
        { name: 'layout', type: "'horizontal' | 'stacked'", default: "'horizontal'", description: 'افقی دو‌ستونه (ستونی در عرض باریک) یا همیشه ستونی.' },
        { name: 'divided', type: 'boolean', default: 'true', description: 'خط جداکنندهٔ مویی بین ردیف‌ها.' },
        { name: 'density', type: "'comfortable' | 'compact'", default: "'comfortable'", description: 'تراکم عمودی ردیف‌ها.' },
        { name: 'items', type: 'readonly KeyValueEntry[]', description: 'آرایهٔ اختیاری به جای فرزندان KeyValueItem.' },
      ],
    },
    {
      name: 'KeyValueItem',
      props: [
        { name: 'label / value', type: 'ReactNode', description: 'برچسب (<dt>) و مقدار (<dd>).' },
        { name: 'ltr', type: 'boolean', default: 'false', description: 'ایزوله‌سازی چپ‌به‌راست با Ltr.' },
        { name: 'code', type: 'boolean', default: 'false', description: 'نمایش کد تک‌عرض چپ‌به‌راست با Code.' },
        { name: 'copyValue', type: 'string', description: 'افزودن CopyButton برای کپی مقدار نرمال‌شده.' },
        { name: 'copyLabel', type: 'string', description: 'نام دسترس‌پذیر سفارشی دکمهٔ کپی (پیش‌فرض: «کپی <برچسب>»).' },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab', action: 'حرکت بین دکمه‌های کپی در ردیف‌های قابل کپی.' },
    { keys: 'Enter / Space', action: 'کپی مقدار و اعلام «کپی شد» در ناحیهٔ زنده.' },
  ],
  a11y: [
    'از ساختار استاندارد HTML5 <dl> / <div> / <dt> / <dd> استفاده می‌کند.',
    'هر ردیف قابل کپی نام دسترس‌پذیر یکتا («کپی شمارهٔ سریال») و اعلام زندهٔ CopyButton دارد.',
  ],
  rtl: [
    'مقادیر کد و شماره با <Code> و <Ltr> ایزوله می‌شوند تا کاراکترهای لاتین و خط تیره در متن فارسی به هم نریزند.',
  ],
};
