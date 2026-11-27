import {
  type ActivationErrorKind,
  ActivationFlow,
  AlertChannels,
  AuditLog,
  CodeDisplay,
  LimitEditor,
  MyActivations,
  SerialBatchGenerator,
} from '@negaresh/patterns';
import {
  sampleActivations,
  sampleAlertChannels,
  sampleAuditEntries,
  sampleLimitHistory,
  sampleSerialProducts,
} from '@negaresh/patterns/fixtures';
import { SegmentedControl, SegmentedControlItem, Stack } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { State } from '../ui.tsx';
import pStyles from './patterns.module.css';

function ActivationExample() {
  const [scenario, setScenario] = useState<'success' | 'repeat' | ActivationErrorKind>('success');

  return (
    <div className={pStyles.stack}>
      <SegmentedControl
        label="شبیه‌سازی وضعیت فعال‌سازی"
        size="sm"
        value={scenario}
        onChange={(k) => setScenario(k as typeof scenario)}
      >
        <SegmentedControlItem id="success">موفق</SegmentedControlItem>
        <SegmentedControlItem id="repeat">رایانهٔ تکراری</SegmentedControlItem>
        <SegmentedControlItem id="unknown_serial">سریال نامعتبر</SegmentedControlItem>
        <SegmentedControlItem id="limit_reached">تکمیل ظرفیت</SegmentedControlItem>
      </SegmentedControl>

      <ActivationFlow
        productName="نرم‌افزار روان‌سنجی نگرش ۴"
        systemCode="SYS-94FA-21BC-08E1"
        defaultSerialValue="N25AG-EMV0K"
        usage={{
          used: scenario === 'limit_reached' ? 2 : 1,
          limit: 2,
          sourceNote: 'سقف پیش‌فرض محصول',
        }}
        {...(scenario === 'success' || scenario === 'repeat'
          ? {
              activationCode: 'ACT-7K9P-3M2Q-8V4X',
              isRepeatPc: scenario === 'repeat',
              sentByChannels: 'پیامک و ایمیل',
            }
          : { errorKind: scenario })}
        onSubmit={() => {}}
        onBuyExtraSlot={() => {}}
      />
    </div>
  );
}

export const licensingActivationDoc: ComponentDoc = {
  slug: 'licensing-activation',
  title: 'مجوز و رجیستری · فعال‌سازی، نمایش کد و سوابق من',
  components: ['CodeDisplay', 'ActivationFlow', 'MyActivations'],
  summary:
    'جریان فعال‌سازی رجیستری با خطاهای مشخص FR-11، یادداشت رایانهٔ تکراری بدون کسر سهمیه (FR-12)، نمایش بزرگ کد LTR و فهرست فعال‌سازی‌های کاربر.',
  status: 'review',
  products: ['R', 'N'],
  Example: ActivationExample,
  Gallery: () => (
    <div className={pStyles.stack}>
      <State label="نمایش کد فعال‌سازی + یادداشت رایانهٔ تکراری (FR-12)">
        <CodeDisplay
          code="ACT-7K9P-3M2Q-8V4X"
          isRepeatPc
          sentByChannels="پیامک و ایمیل"
        />
      </State>
      <State label="حالت تکمیل ظرفیت با اقدام خرید +۱ فعال‌سازی (FR-11)">
        <ActivationFlow
          productName="نرم‌افزار روان‌سنجی نگرش ۴"
          aria-label="جریان فعال‌سازی (تکمیل ظرفیت)"
          systemCode="SYS-94FA-21BC-08E1"
          defaultSerialValue="N25AG-EMV0K"
          errorKind="limit_reached"
          usage={{ used: 2, limit: 2, sourceNote: 'سقف اختصاصی سریال' }}
          onBuyExtraSlot={() => {}}
        />
      </State>
      <State label="فعال‌سازی‌های من (قابل ارسال مجدد و محدودیت نرخ)">
        <MyActivations records={sampleActivations} onResendCode={() => {}} />
      </State>
    </div>
  ),
  usage: {
    do: [
      'همهٔ خطاهای فعال‌سازی را به‌طور صریح تفکیک کنید (`unknown_serial`, `wrong_product`, `revoked`, `limit_reached`).',
      'در فعال‌سازی تکراری روی همان رایانه (`isRepeatPc`) صریحاً اطلاع دهید که سهمیه‌ای کسر نشده است.',
    ],
    dont: [
      'کد سیستم، سریال یا کد فعال‌سازی را با ارقام فارسی نمایش ندهید (D-86).',
    ],
  },
  api: [
    {
      name: 'CodeDisplay',
      props: [
        { name: 'code', type: 'string', description: 'کد فعال‌سازی (LTR monospace).' },
        { name: 'isRepeatPc', type: 'boolean', default: 'false', description: 'نمایش یادداشت FR-12.' },
        { name: 'sentByChannels', type: 'string', description: 'توضیح ارسال پیامک/ایمیل.' },
      ],
    },
    {
      name: 'ActivationFlow',
      props: [
        { name: 'systemCode', type: 'string', description: 'کد سیستم پیش‌پر شده از برنامهٔ ویندوز.' },
        { name: 'errorKind', type: 'ActivationErrorKind', description: 'یکی از ۴ خطای رسمی FR-11.' },
        { name: 'usage', type: '{ used, limit, sourceNote? }', description: 'سهمیهٔ فعال‌سازی و منبع سقف.' },
      ],
    },
    {
      name: 'MyActivations',
      props: [
        { name: 'records', type: 'ActivationRecord[]', description: 'فهرست فعال‌سازی‌های ثبت‌شده.' },
        { name: 'onResendCode', type: '(id) => void', description: 'ارسال مجدد کد با پشتیبانی از محدودیت نرخ.' },
      ],
    },
  ],
  a11y: [
    'خطاهای فعال‌سازی از `InlineAlert` همراه با پیوند به فیلد و دکمهٔ اقدام جایگزین استفاده می‌کنند.',
    'دکمهٔ کپی از `CopyButton` با اعلان زندهٔ موفقیت استفاده می‌کند.',
  ],
  rtl: [
    'کد سیستم، سریال و کد فعال‌سازی همیشه با `dir="ltr"` و قلم monospace لاتین رندر می‌شوند (D-86).',
  ],
};

function LicensingAdminExample() {
  const [channels, setChannels] = useState([...sampleAlertChannels]);
  return (
    <AlertChannels
      channels={channels}
      primaryRecipient="+989123456789"
      secondaryRecipient="ops@negaresh.ir"
      onToggleChannel={(id, enabled) =>
        setChannels((prev) => prev.map((c) => (c.id === id ? { ...c, enabled } : c)))
      }
      onEndpointChange={(id, endpoint) =>
        setChannels((prev) => prev.map((c) => (c.id === id ? { ...c, endpoint } : c)))
      }
      onSendTest={() => {}}
    />
  );
}

export const licensingAdminDoc: ComponentDoc = {
  slug: 'licensing-admin',
  title: 'مجوز و رجیستری · سقف‌ها، تولید سریال، هشدارها و ممیزی',
  components: ['LimitEditor', 'SerialBatchGenerator', 'AlertChannels', 'AuditLog'],
  summary:
    'الگوهای مدیریتی رجیستری: ویرایشگر سقف با نمایش منبع FR-23، تولید دسته‌ای سریال با خروجی CSV، کانال‌های هشدار و گزارش ممیزی.',
  status: 'review',
  products: ['R'],
  Example: LicensingAdminExample,
  Gallery: () => (
    <div className={pStyles.stack}>
      <State label="ویرایشگر سقف فعال‌سازی با منبع سقف (FR-23) و تاریخچه">
        <LimitEditor
          effectiveLimit={3}
          source="serial"
          history={sampleLimitHistory}
          onSaveOverride={() => {}}
          onResetOverride={() => {}}
        />
      </State>
      <State label="تولید دسته‌ای سریال با پیش‌نمایش و خروجی CSV">
        <SerialBatchGenerator products={sampleSerialProducts} onExportCsv={() => {}} />
      </State>
      <State label="گزارش ممیزی با فیلتر، نشانی IP و نمایش تغییرات (DiffView)">
        <AuditLog entries={sampleAuditEntries} aria-label="گزارش ممیزی گالری" />
      </State>
      <State label="کانال‌های هشدار (پیامک، ایمیل، تلگرام، بله)">
        <Stack gap="3">
          <AlertChannels
            aria-label="کانال‌های ارسال هشدار (گالری)"
            channels={sampleAlertChannels}
            primaryRecipient="+989123456789"
            secondaryRecipient="ops@negaresh.ir"
          />
        </Stack>
      </State>
    </div>
  ),
  usage: {
    do: [
      'در `LimitEditor` همیشه منبع سقف مؤثر (`serial`, `customer`, `product`, `global`) را در کنار عدد نمایش دهید (FR-23).',
      'ثبت تغییر سقف را منوط به وارد کردن دلیل کنید تا گزارش ممیزی کامل بماند.',
    ],
    dont: [
      'نشانی IP و شناسهٔ سریال را بدون ایزوله‌سازی `<Code>` نمایش ندهید.',
    ],
  },
  api: [
    {
      name: 'LimitEditor',
      props: [
        { name: 'effectiveLimit', type: 'number', description: 'سقف مؤثر فعلی.' },
        { name: 'source', type: "'serial' | 'customer' | 'product' | 'global'", description: 'منبع سقف مؤثر (FR-23).' },
        { name: 'history', type: 'TimelineEntry[]', description: 'تاریخچهٔ تغییرات سقف.' },
      ],
    },
    {
      name: 'SerialBatchGenerator',
      props: [
        { name: 'products', type: 'SerialProductOption[]', description: 'فهرست محصولات برای صدور سریال.' },
        { name: 'onExportCsv', type: '(serials) => void', description: 'خروجی CSV از سریال‌های پیش‌نمایش.' },
      ],
    },
    {
      name: 'AlertChannels',
      props: [
        { name: 'channels', type: 'AlertChannelConfig[]', description: 'تنظیمات پیامک، ایمیل، تلگرام و بله.' },
        { name: 'primaryRecipient / secondaryRecipient', type: 'string', description: 'دو گیرندهٔ هشدار.' },
      ],
    },
    {
      name: 'AuditLog',
      props: [
        { name: 'entries', type: 'AuditLogEntry[]', description: 'فهرست رویدادهای ممیزی همراه با before/after.' },
      ],
    },
  ],
  a11y: [
    'جدول ممیزی در عرض زیر ۹۰۰ پیکسل به کارت‌های خوانا تبدیل می‌شود و مقایسهٔ تغییرات با `DiffView` دسترس‌پذیر باز می‌شود.',
  ],
  rtl: [
    'تمام زمان‌های ممیزی به شمسی (تهران) و نشانی‌های IP و سریال‌ها به چپ‌به‌راست لاتین نمایش داده می‌شوند.',
  ],
};
