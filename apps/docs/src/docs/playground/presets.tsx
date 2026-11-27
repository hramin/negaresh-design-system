import { QuestionItem } from '@negaresh/assessment';
import { buildIntervalBarTable, ChartFrame, IntervalBar, Sparkline } from '@negaresh/charts';
import { iconCheck, iconKey, iconShield } from '@negaresh/icons';
import { PhoneSignIn } from '@negaresh/keycloak-theme';
import { sampleAuthFixtures } from '@negaresh/keycloak-theme/fixtures';
import { ProductCard } from '@negaresh/patterns';
import { sampleProducts } from '@negaresh/patterns/fixtures';
import {
  Button,
  ChoiceCard,
  InlineAlert,
  RadioGroup,
  Select,
  SelectItem,
  StatTile,
  StatusBadge,
  TextField,
  UsageMeter,
} from '@negaresh/react';
import type { ReactNode } from 'react';

export type PlaygroundControlSpec =
  | {
      type: 'select';
      key: string;
      label: string;
      options: readonly { value: string; label: string }[];
    }
  | {
      type: 'boolean';
      key: string;
      label: string;
    }
  | {
      type: 'text';
      key: string;
      label: string;
    }
  | {
      type: 'number';
      key: string;
      label: string;
      min?: number;
      max?: number;
      step?: number;
    };

export type PlaygroundValues = Record<string, string | boolean | number>;

export interface PlaygroundPreset {
  id: string;
  title: string;
  packageName:
    | '@negaresh/react'
    | '@negaresh/charts'
    | '@negaresh/assessment'
    | '@negaresh/patterns'
    | '@negaresh/keycloak-theme';
  componentName: string;
  docsTo: string;
  description: string;
  defaults: PlaygroundValues;
  controls: readonly PlaygroundControlSpec[];
  render: (values: PlaygroundValues) => ReactNode;
  code: (values: PlaygroundValues) => string;
}

const SAMPLE_INTERVAL_ITEMS = [
  { id: 'dep', label: 'خلق افسرده (D)', value: 71, low: 66, high: 76, severity: 'severe' as const },
  { id: 'anx', label: 'تنش و اضطراب (Pt)', value: 64, low: 59, high: 69, severity: 'caution' as const },
  { id: 'res', label: 'تاب‌آوری هیجانی (R)', value: 52, low: 47, high: 57, severity: 'ok' as const },
];

const SAMPLE_QUESTION_OPTIONS = [
  { value: '1', label: 'کاملاً مخالفم' },
  { value: '2', label: 'تا حدی مخالفم' },
  { value: '3', label: 'نظری ندارم' },
  { value: '4', label: 'تا حدی موافقم' },
  { value: '5', label: 'کاملاً موافقم' },
];

const STATUS_BY_DOMAIN = {
  order: 'completed',
  payment: 'paid',
  serial: 'active',
  review: 'scheduled',
  report: 'ready',
  campaign: 'active',
} as const;

export const PLAYGROUND_PRESETS: readonly PlaygroundPreset[] = [
  {
    id: 'button',
    title: 'دکمه (Button)',
    packageName: '@negaresh/react',
    componentName: 'Button',
    docsTo: '/components/button',
    description: 'گونه‌ها، اندازه‌ها، آیکون و حالت در حال انجام روی React Aria Button.',
    defaults: {
      variant: 'primary',
      size: 'md',
      label: 'ساخت کد فعال‌سازی',
      withIcon: true,
      isPending: false,
      isDisabled: false,
      fullWidth: false,
    },
    controls: [
      {
        type: 'select',
        key: 'variant',
        label: 'گونه (variant)',
        options: [
          { value: 'primary', label: 'اصلی (primary)' },
          { value: 'secondary', label: 'ثانویه (secondary)' },
          { value: 'ghost', label: 'شفاف (ghost)' },
          { value: 'danger', label: 'خطرناک (danger)' },
        ],
      },
      {
        type: 'select',
        key: 'size',
        label: 'اندازه (size)',
        options: [
          { value: 'sm', label: 'کوچک (sm)' },
          { value: 'md', label: 'میانه (md)' },
          { value: 'lg', label: 'بزرگ (lg)' },
        ],
      },
      { type: 'text', key: 'label', label: 'برچسب دکمه' },
      { type: 'boolean', key: 'withIcon', label: 'نمایش آیکون آغاز (iconStart)' },
      { type: 'boolean', key: 'isPending', label: 'در حال انجام (isPending)' },
      { type: 'boolean', key: 'isDisabled', label: 'غیرفعال (isDisabled)' },
      { type: 'boolean', key: 'fullWidth', label: 'تمام‌عرض (fullWidth)' },
    ],
    render: (v) => (
      <Button
        variant={v.variant as 'primary' | 'secondary' | 'ghost' | 'danger'}
        size={v.size as 'sm' | 'md' | 'lg'}
        iconStart={v.withIcon ? iconCheck : undefined}
        isPending={Boolean(v.isPending)}
        isDisabled={Boolean(v.isDisabled)}
        fullWidth={Boolean(v.fullWidth)}
      >
        {String(v.label || 'ساخت کد فعال‌سازی')}
      </Button>
    ),
    code: (v) => `<Button
  variant="${v.variant}"
  size="${v.size}"${v.withIcon ? '\n  iconStart={iconCheck}' : ''}${v.isPending ? '\n  isPending' : ''}${v.isDisabled ? '\n  isDisabled' : ''}${v.fullWidth ? '\n  fullWidth' : ''}
>
  ${v.label || 'ساخت کد فعال‌سازی'}
</Button>`,
  },
  {
    id: 'text-field',
    title: 'فیلد متنی (TextField)',
    packageName: '@negaresh/react',
    componentName: 'TextField',
    docsTo: '/components/text-field',
    description: 'برچسب دیدنی، راهنما، پیام خطای متصل با aria-describedby و حالت‌های تعاملی.',
    defaults: {
      size: 'md',
      label: 'نام و نام خانوادگی',
      description: 'نام کامل برای درج در گواهی و فاکتور رسمی.',
      errorMessage: 'نام باید دست‌کم ۳ نویسه باشد.',
      isRequired: true,
      isInvalid: false,
      isDisabled: false,
      isReadOnly: false,
    },
    controls: [
      {
        type: 'select',
        key: 'size',
        label: 'اندازه (size)',
        options: [
          { value: 'sm', label: 'کوچک (sm)' },
          { value: 'md', label: 'میانه (md)' },
          { value: 'lg', label: 'بزرگ (lg)' },
        ],
      },
      { type: 'text', key: 'label', label: 'برچسب (label)' },
      { type: 'text', key: 'description', label: 'راهنما (description)' },
      { type: 'text', key: 'errorMessage', label: 'پیام خطا (errorMessage)' },
      { type: 'boolean', key: 'isRequired', label: 'الزامی (isRequired)' },
      { type: 'boolean', key: 'isInvalid', label: 'خطادار (isInvalid)' },
      { type: 'boolean', key: 'isDisabled', label: 'غیرفعال (isDisabled)' },
      { type: 'boolean', key: 'isReadOnly', label: 'فقط‌خواندنی (isReadOnly)' },
    ],
    render: (v) => (
      <TextField
        label={String(v.label)}
        description={String(v.description)}
        errorMessage={String(v.errorMessage)}
        size={v.size as 'sm' | 'md' | 'lg'}
        isRequired={Boolean(v.isRequired)}
        isInvalid={Boolean(v.isInvalid)}
        isDisabled={Boolean(v.isDisabled)}
        isReadOnly={Boolean(v.isReadOnly)}
        defaultValue="دکتر سارا احمدی"
      />
    ),
    code: (v) => `<TextField
  label="${v.label}"
  description="${v.description}"
  size="${v.size}"${v.isRequired ? '\n  isRequired' : ''}${v.isInvalid ? `\n  isInvalid\n  errorMessage="${v.errorMessage}"` : ''}${v.isDisabled ? '\n  isDisabled' : ''}${v.isReadOnly ? '\n  isReadOnly' : ''}
/>`,
  },
  {
    id: 'select',
    title: 'انتخابگر (Select)',
    packageName: '@negaresh/react',
    componentName: 'Select',
    docsTo: '/components/select',
    description: 'فهرست انتخاب کشویی با جهت‌یابی کیبورد، پیکان RTL و وضعیت خطا.',
    defaults: {
      size: 'md',
      label: 'محصول نرم‌افزاری',
      isRequired: true,
      isInvalid: false,
      isDisabled: false,
    },
    controls: [
      {
        type: 'select',
        key: 'size',
        label: 'اندازه (size)',
        options: [
          { value: 'sm', label: 'کوچک (sm)' },
          { value: 'md', label: 'میانه (md)' },
          { value: 'lg', label: 'بزرگ (lg)' },
        ],
      },
      { type: 'text', key: 'label', label: 'برچسب (label)' },
      { type: 'boolean', key: 'isRequired', label: 'الزامی (isRequired)' },
      { type: 'boolean', key: 'isInvalid', label: 'خطادار (isInvalid)' },
      { type: 'boolean', key: 'isDisabled', label: 'غیرفعال (isDisabled)' },
    ],
    render: (v) => (
      <Select
        label={String(v.label)}
        size={v.size as 'sm' | 'md' | 'lg'}
        defaultValue="iq4"
        isRequired={Boolean(v.isRequired)}
        isInvalid={Boolean(v.isInvalid)}
        errorMessage="انتخاب یک محصول الزامی است."
        isDisabled={Boolean(v.isDisabled)}
      >
        <SelectItem id="iq4">نگارش تست هوش ۴</SelectItem>
        <SelectItem id="mmpi">نرم‌افزار تفسیر MMPI-A</SelectItem>
        <SelectItem id="wechsler">مقیاس هوش وکسلر کودکان</SelectItem>
      </Select>
    ),
    code: (v) => `<Select label="${v.label}" size="${v.size}" defaultValue="iq4"${v.isRequired ? ' isRequired' : ''}${v.isInvalid ? ' isInvalid' : ''}${v.isDisabled ? ' isDisabled' : ''}>
  <SelectItem id="iq4">نگارش تست هوش ۴</SelectItem>
  <SelectItem id="mmpi">نرم‌افزار تفسیر MMPI-A</SelectItem>
</Select>`,
  },
  {
    id: 'choice-card',
    title: 'کارت انتخاب (ChoiceCard)',
    packageName: '@negaresh/react',
    componentName: 'ChoiceCard',
    docsTo: '/components/choice-card',
    description: 'گزینهٔ کارتی رادیویی یا چک‌باکس با قیمت تومانی خودکار (D-26).',
    defaults: {
      control: 'radio',
      title: 'بستهٔ کلینیک (+۳ دستگاه)',
      description: 'مناسب مراکز مشاوره با پشتیبانی اختصاصی و تاریخچهٔ ممیزی.',
      price: 690000,
      isDisabled: false,
    },
    controls: [
      {
        type: 'select',
        key: 'control',
        label: 'نوع کنترل (control)',
        options: [
          { value: 'radio', label: 'رادیویی (radio)' },
          { value: 'checkbox', label: 'چک‌باکس (checkbox)' },
        ],
      },
      { type: 'text', key: 'title', label: 'عنوان (title)' },
      { type: 'text', key: 'description', label: 'توضیح (description)' },
      { type: 'number', key: 'price', label: 'قیمت به تومان (price)', min: 0, max: 5000000, step: 50000 },
      { type: 'boolean', key: 'isDisabled', label: 'غیرفعال (isDisabled)' },
    ],
    render: (v) =>
      v.control === 'checkbox' ? (
        <ChoiceCard
          control="checkbox"
          defaultSelected
          icon={iconShield}
          title={String(v.title)}
          description={String(v.description)}
          price={Number(v.price)}
          isDisabled={Boolean(v.isDisabled)}
        />
      ) : (
        <RadioGroup label="انتخاب بستهٔ فعال‌سازی" defaultValue="clinic">
          <ChoiceCard
            control="radio"
            value="clinic"
            icon={iconKey}
            title={String(v.title)}
            description={String(v.description)}
            price={Number(v.price)}
            isDisabled={Boolean(v.isDisabled)}
          />
        </RadioGroup>
      ),
    code: (v) => `<ChoiceCard
  control="${v.control}"
  title="${v.title}"
  description="${v.description}"
  price={${v.price}}${v.isDisabled ? '\n  isDisabled' : ''}
/>`,
  },
  {
    id: 'status-badge',
    title: 'نشان وضعیت دامنه (StatusBadge)',
    packageName: '@negaresh/react',
    componentName: 'StatusBadge',
    docsTo: '/components/status-badge',
    description: 'نگاشت استاندارد واژه، رنگ و آیکون برای ۶ دامنهٔ محصولات نگرش.',
    defaults: {
      domain: 'serial',
      size: 'md',
      showIcon: true,
    },
    controls: [
      {
        type: 'select',
        key: 'domain',
        label: 'دامنه (domain)',
        options: [
          { value: 'serial', label: 'سریال (serial)' },
          { value: 'order', label: 'سفارش (order)' },
          { value: 'payment', label: 'پرداخت (payment)' },
          { value: 'review', label: 'بررسی محتوا (review)' },
          { value: 'report', label: 'گزارش آزمون (report)' },
          { value: 'campaign', label: 'کارزار (campaign)' },
        ],
      },
      {
        type: 'select',
        key: 'size',
        label: 'اندازه (size)',
        options: [
          { value: 'sm', label: 'کوچک (sm)' },
          { value: 'md', label: 'میانه (md)' },
        ],
      },
      { type: 'boolean', key: 'showIcon', label: 'نمایش آیکون (showIcon)' },
    ],
    render: (v) => {
      const domain = v.domain as keyof typeof STATUS_BY_DOMAIN;
      const size = v.size as 'sm' | 'md';
      const showIcon = Boolean(v.showIcon);
      switch (domain) {
        case 'order':
          return <StatusBadge domain="order" status="completed" size={size} showIcon={showIcon} />;
        case 'payment':
          return <StatusBadge domain="payment" status="paid" size={size} showIcon={showIcon} />;
        case 'review':
          return <StatusBadge domain="review" status="scheduled" size={size} showIcon={showIcon} />;
        case 'report':
          return <StatusBadge domain="report" status="ready" size={size} showIcon={showIcon} />;
        case 'campaign':
          return <StatusBadge domain="campaign" status="active" size={size} showIcon={showIcon} />;
        default:
          return <StatusBadge domain="serial" status="active" size={size} showIcon={showIcon} />;
      }
    },
    code: (v) => {
      const domain = v.domain as keyof typeof STATUS_BY_DOMAIN;
      return `<StatusBadge domain="${domain}" status="${STATUS_BY_DOMAIN[domain]}" size="${v.size}" showIcon={${Boolean(v.showIcon)}} />`;
    },
  },
  {
    id: 'inline-alert',
    title: 'هشدار درون‌خطی (InlineAlert)',
    packageName: '@negaresh/react',
    componentName: 'InlineAlert',
    docsTo: '/components/inline-alert',
    description: 'پیام وضعیت چهارلحنه با آیکون و واژه (هرگز رنگ به‌تنهایی).',
    defaults: {
      tone: 'info',
      title: 'بازگردانی کد فعال‌سازی قبلی',
      body: 'این سریال پیش‌تر روی همین رایانه فعال شده است؛ کد قبلی بدون مصرف ظرفیت تازه نمایش داده شد.',
    },
    controls: [
      {
        type: 'select',
        key: 'tone',
        label: 'لحن (tone)',
        options: [
          { value: 'info', label: 'اطلاع (info)' },
          { value: 'success', label: 'موفقیت (success)' },
          { value: 'warning', label: 'هشدار (warning)' },
          { value: 'danger', label: 'خطا (danger)' },
        ],
      },
      { type: 'text', key: 'title', label: 'عنوان (title)' },
      { type: 'text', key: 'body', label: 'متن پیام' },
    ],
    render: (v) => (
      <InlineAlert
        tone={v.tone as 'info' | 'success' | 'warning' | 'danger'}
        title={String(v.title)}
      >
        {String(v.body)}
      </InlineAlert>
    ),
    code: (v) => `<InlineAlert tone="${v.tone}" title="${v.title}">
  ${v.body}
</InlineAlert>`,
  },
  {
    id: 'usage-meter',
    title: 'نشانگر ظرفیت (UsageMeter)',
    packageName: '@negaresh/react',
    componentName: 'UsageMeter',
    docsTo: '/components/usage-meter',
    description: 'نشانگر قطعه‌بندی‌شدهٔ ظرفیت سریال یا صندلی کارزار همراه با منبع سقف (FR-23).',
    defaults: {
      used: 2,
      limit: 3,
      sourceNote: 'منبع سقف: پیش‌فرض محصول',
    },
    controls: [
      { type: 'number', key: 'used', label: 'مصرف‌شده (used)', min: 0, max: 10, step: 1 },
      { type: 'number', key: 'limit', label: 'سقف کل (limit)', min: 1, max: 10, step: 1 },
      { type: 'text', key: 'sourceNote', label: 'یادداشت منبع (sourceNote)' },
    ],
    render: (v) => (
      <UsageMeter
        label="ظرفیت فعال‌سازی سریال"
        used={Number(v.used)}
        limit={Math.max(1, Number(v.limit))}
        sourceNote={String(v.sourceNote)}
      />
    ),
    code: (v) => `<UsageMeter
  label="ظرفیت فعال‌سازی سریال"
  used={${v.used}}
  limit={${Math.max(1, Number(v.limit))}}
  sourceNote="${v.sourceNote}"
/>`,
  },
  {
    id: 'stat-tile',
    title: 'کاشی آمار + خط روند (StatTile + Sparkline)',
    packageName: '@negaresh/react',
    componentName: 'StatTile',
    docsTo: '/components/stat-tile',
    description: 'نمایش شاخص‌های داشبورد با ارقام فارسی جدولی، تغییر نسبی و خط روند SVG.',
    defaults: {
      label: 'فعال‌سازی‌های ماه جاری',
      value: 148,
      direction: 'up',
      showSparkline: true,
    },
    controls: [
      { type: 'text', key: 'label', label: 'عنوان شاخص' },
      { type: 'number', key: 'value', label: 'مقدار عددی', min: 0, max: 10000, step: 10 },
      {
        type: 'select',
        key: 'direction',
        label: 'جهت تغییر (delta)',
        options: [
          { value: 'up', label: 'افزایشی (up)' },
          { value: 'down', label: 'کاهشی (down)' },
          { value: 'neutral', label: 'ثابت (neutral)' },
        ],
      },
      { type: 'boolean', key: 'showSparkline', label: 'نمایش Sparkline' },
    ],
    render: (v) => (
      <StatTile
        label={String(v.label)}
        value={Number(v.value)}
        delta={{
          value: v.direction === 'neutral' ? '۰٪' : '۱۲٪',
          direction: v.direction as 'up' | 'down' | 'neutral',
          label: 'نسبت به ماه قبل',
        }}
        sparkline={
          v.showSparkline ? (
            <Sparkline
              values={[96, 108, 114, 121, 134, Number(v.value)]}
              summary="روند صعودی فعال‌سازی‌ها در ۶ هفتهٔ اخیر"
            />
          ) : undefined
        }
      />
    ),
    code: (v) => `<StatTile
  label="${v.label}"
  value={${v.value}}
  delta={{ value: '${v.direction === 'neutral' ? '۰٪' : '۱۲٪'}', direction: '${v.direction}', label: 'نسبت به ماه قبل' }}${v.showSparkline ? '\n  sparkline={<Sparkline values={[96, 108, 114, 121, 134, 148]} summary="روند صعودی ۶ هفتهٔ اخیر" />}' : ''}
/>`,
  },
  {
    id: 'interval-bar',
    title: 'نمودار بازه‌ای (@negaresh/charts · IntervalBar)',
    packageName: '@negaresh/charts',
    componentName: 'IntervalBar',
    docsTo: '/charts/interval-bar',
    description: 'نمودار SVG سرورمحور با مقایسهٔ آنی نمای حرفه‌ای و نمای آرام (بدون رنگ رز).',
    defaults: {
      mode: 'professional',
      showReadout: true,
    },
    controls: [
      {
        type: 'select',
        key: 'mode',
        label: 'نمای مخاطب (mode)',
        options: [
          { value: 'professional', label: 'حرفه‌ای · متخصص (professional)' },
          { value: 'calm', label: 'آرام · نوجوان/والدین (calm)' },
        ],
      },
      { type: 'boolean', key: 'showReadout', label: 'نمایش نوار خوانش زنده (showReadout)' },
    ],
    render: (v) => {
      const mode = v.mode as 'professional' | 'calm';
      return (
        <ChartFrame
          title="نمرات T سه مقیاس نمونه"
          takeaway={
            mode === 'calm'
              ? 'شاخص تاب‌آوری در بازهٔ معمول است؛ برای دو شاخص دیگر گفت‌وگو با مشاور پیشنهاد می‌شود.'
              : 'مقیاس D در آستانهٔ بالینی (۷۱) و Pt در ناحیهٔ توجه (۶۴) قرار دارد.'
          }
          table={buildIntervalBarTable(SAMPLE_INTERVAL_ITEMS, { mode })}
          sourceNote="هنجار نمونه · میانگین ۵۰ و انحراف معیار ۱۰"
        >
          <IntervalBar
            items={SAMPLE_INTERVAL_ITEMS}
            domain={[30, 85]}
            ticks={[30, 40, 50, 60, 70, 80]}
            bands={[{ from: 40, to: 60, label: 'بازهٔ هنجار' }]}
            referenceLines={[{ value: 50, label: 'میانگین ۵۰' }]}
            mode={mode}
            showReadout={Boolean(v.showReadout)}
            ariaLabel="نمودار بازه‌ای سه مقیاس نمونه"
          />
        </ChartFrame>
      );
    },
    code: (v) => `<ChartFrame title="نمرات T سه مقیاس نمونه" takeaway="…" table={buildIntervalBarTable(items, { mode: '${v.mode}' })}>
  <IntervalBar
    items={items}
    domain={[30, 85]}
    mode="${v.mode}"
    showReadout={${Boolean(v.showReadout)}}
    ariaLabel="نمودار بازه‌ای سه مقیاس نمونه"
  />
</ChartFrame>`,
  },
  {
    id: 'question-item',
    title: 'پرسش آزمون (@negaresh/assessment · QuestionItem)',
    packageName: '@negaresh/assessment',
    componentName: 'QuestionItem',
    docsTo: '/assessment/question-item',
    description: 'پرسش دسترس‌پذیر با fieldset/legend و رادیوهای واقعی در حالت استاندارد یا لیکرت.',
    defaults: {
      variant: 'likert',
      isInvalid: false,
      isDisabled: false,
    },
    controls: [
      {
        type: 'select',
        key: 'variant',
        label: 'چیدمان (variant)',
        options: [
          { value: 'likert', label: 'طیف لیکرت (likert)' },
          { value: 'standard', label: 'فهرست استاندارد (standard)' },
        ],
      },
      { type: 'boolean', key: 'isInvalid', label: 'حالت پاسخ‌داده‌نشده (isInvalid)' },
      { type: 'boolean', key: 'isDisabled', label: 'غیرفعال (isDisabled)' },
    ],
    render: (v) => (
      <QuestionItem
        id="pg-q1"
        number={3}
        stem="در دو هفتهٔ گذشته، هنگام روبه‌رو شدن با کارهای تازه احساس آرامش و تمرکز داشته‌ام."
        options={SAMPLE_QUESTION_OPTIONS}
        variant={v.variant as 'standard' | 'likert'}
        likertStartLabel="کاملاً مخالفم"
        likertEndLabel="کاملاً موافقم"
        isInvalid={Boolean(v.isInvalid)}
        errorMessage="برای ادامه لطفاً یکی از گزینه‌ها را انتخاب کنید."
        isDisabled={Boolean(v.isDisabled)}
      />
    ),
    code: (v) => `<QuestionItem
  number={3}
  stem="در دو هفتهٔ گذشته، هنگام روبه‌رو شدن با کارهای تازه احساس آرامش و تمرکز داشته‌ام."
  options={options}
  variant="${v.variant}"${v.isInvalid ? '\n  isInvalid\n  errorMessage="برای ادامه لطفاً یکی از گزینه‌ها را انتخاب کنید."' : ''}${v.isDisabled ? '\n  isDisabled' : ''}
/>`,
  },
  {
    id: 'product-card',
    title: 'کارت محصول (@negaresh/patterns · ProductCard)',
    packageName: '@negaresh/patterns',
    componentName: 'ProductCard',
    docsTo: '/patterns/commerce-catalog',
    description: 'کارت فروشگاه نگرش با قیمت تومانی، تخفیف، حالت رایگان و دکمهٔ علاقه‌مندی.',
    defaults: {
      title: sampleProducts[0]?.title ?? 'مجموعه نرم‌افزارهای روان‌سنجی نگرش',
      price: 490000,
      hasSale: true,
      isFree: false,
    },
    controls: [
      { type: 'text', key: 'title', label: 'عنوان محصول' },
      { type: 'number', key: 'price', label: 'قیمت فروش (تومان)', min: 0, max: 5000000, step: 50000 },
      { type: 'boolean', key: 'hasSale', label: 'نمایش قیمت خط‌خوردهٔ قبل' },
      { type: 'boolean', key: 'isFree', label: 'محصول رایگان (۰ تومان → رایگان)' },
    ],
    render: (v) => {
      const base = sampleProducts[0]!;
      const effectivePrice = v.isFree ? 0 : Number(v.price);
      return (
        <ProductCard
          product={{
            ...base,
            title: String(v.title || base.title),
            price: effectivePrice,
            originalPrice: !v.isFree && v.hasSale ? effectivePrice + 150000 : undefined,
          }}
          onAddToCart={() => {}}
          onToggleWishlist={() => {}}
        />
      );
    },
    code: (v) => {
      const p = v.isFree ? 0 : Number(v.price);
      return `<ProductCard
  product={{
    id: 'prod-1',
    title: '${v.title}',
    price: ${p},${!v.isFree && v.hasSale ? `\n    originalPrice: ${p + 150000},` : ''}
    imageSrc: '…',
    imageAlt: '${v.title}',
  }}
  onAddToCart={handleAdd}
/>`;
    },
  },
  {
    id: 'phone-signin',
    title: 'ورود با موبایل (@negaresh/keycloak-theme · PhoneSignIn)',
    packageName: '@negaresh/keycloak-theme',
    componentName: 'PhoneSignIn',
    docsTo: '/patterns/identity-sign-in',
    description: 'جریان دوقسمتی ورود با شمارهٔ موبایل و کد ۶ رقمی OTP در پوستهٔ یکپارچهٔ Keycloak.',
    defaults: {
      step: 'phone',
      rateLimited: false,
      isPending: false,
    },
    controls: [
      {
        type: 'select',
        key: 'step',
        label: 'مرحله (step)',
        options: [
          { value: 'phone', label: '۱ · ورود شماره (phone)' },
          { value: 'otp', label: '۲ · کد پیامکی (otp)' },
        ],
      },
      { type: 'boolean', key: 'rateLimited', label: 'محدودیت نرخ ارسال (rateLimited)' },
      { type: 'boolean', key: 'isPending', label: 'در حال ارسال (isPending)' },
    ],
    render: (v) => (
      <PhoneSignIn
        step={v.step as 'phone' | 'otp'}
        defaultPhone={sampleAuthFixtures.phoneDisplayInput}
        maskedPhone={sampleAuthFixtures.maskedPhone}
        resendSecondsRemaining={45}
        rateLimitedSeconds={v.rateLimited ? 90 : undefined}
        isPending={Boolean(v.isPending)}
        shellProps={{ embedded: true, productName: 'حساب یکپارچهٔ نگرش', headingLevel: 3 }}
      />
    ),
    code: (v) => `<PhoneSignIn
  step="${v.step}"
  defaultPhone="09123456789"${v.rateLimited ? '\n  rateLimitedSeconds={90}' : ''}${v.isPending ? '\n  isPending' : ''}
  shellProps={{ embedded: true, productName: 'حساب یکپارچهٔ نگرش' }}
/>`,
  },
];

export function findPlaygroundPreset(id: string | undefined): PlaygroundPreset {
  return PLAYGROUND_PRESETS.find((p) => p.id === id) ?? PLAYGROUND_PRESETS[0]!;
}

const SLUG_TO_PRESET = new Map<string, string>([
  ['button', 'button'],
  ['text-field', 'text-field'],
  ['select', 'select'],
  ['choice-card', 'choice-card'],
  ['status-badge', 'status-badge'],
  ['inline-alert', 'inline-alert'],
  ['usage-meter', 'usage-meter'],
  ['stat-tile', 'stat-tile'],
  ['interval-bar', 'interval-bar'],
  ['question-item', 'question-item'],
  ['commerce-catalog', 'product-card'],
  ['identity-sign-in', 'phone-signin'],
]);

export function playgroundPresetForSlug(slug: string): string | undefined {
  return SLUG_TO_PRESET.get(slug);
}
