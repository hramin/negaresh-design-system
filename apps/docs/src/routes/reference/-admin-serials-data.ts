import type { SerialStatus } from '@negaresh/react';

export type LimitSource = 'serial' | 'customer' | 'product' | 'global';

export interface AdminDeviceRecord {
  id: string;
  label: string;
  os: string;
  systemCode: string;
  activationCode: string;
  activatedAt: string;
  ip: string;
  active: boolean;
}

export interface AdminTimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  tone: 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger';
  actor: string;
  badgeText?: string | undefined;
  codeMeta?: string | undefined;
  ipMeta?: string | undefined;
}

export interface AdminSerialRecord {
  serial: string;
  productId: 'iq4' | 'clinical' | 'mmpi' | 'wisc';
  productName: string;
  customerName: string;
  phone: string;
  orderCode: string;
  status: SerialStatus;
  used: number;
  limit: number;
  limitSource: LimitSource;
  createdAt: string;
  lastActivationAt: string;
  devices: readonly AdminDeviceRecord[];
  timeline: readonly AdminTimelineEvent[];
  policyBefore: string;
  policyAfter: string;
  policySummaryBefore: string;
  policySummaryAfter: string;
}

export const PRODUCT_LABELS: Record<AdminSerialRecord['productId'], string> = {
  iq4: 'نگارش تست هوش ۴',
  clinical: 'بستهٔ آزمون‌های بالینی',
  mmpi: 'تفسیر MMPI-2',
  wisc: 'مقیاس وکسلر کودکان',
};

export const LIMIT_SOURCE_LABELS: Record<LimitSource, string> = {
  serial: 'اختصاصی سریال',
  customer: 'اختصاصی مشتری',
  product: 'پیش‌فرض محصول',
  global: 'پیش‌فرض سراسری',
};

export const STATUS_LABELS: Record<SerialStatus, string> = {
  active: 'فعال',
  unused: 'استفاده‌نشده',
  limit_reached: 'سقف پر شده',
  revoked: 'باطل‌شده',
  expired: 'منقضی‌شده',
};

const DEFAULT_DEVICES: AdminDeviceRecord[] = [
  {
    id: 'dev-1',
    label: 'رایانهٔ اتاق مشاوره ۱',
    os: 'ویندوز ۱۱ نسخهٔ ۲۳H2',
    systemCode: '882859354',
    activationCode: '4417 9082 6153',
    activatedAt: '2026-11-13T13:34:00Z',
    ip: '185.110.24.19',
    active: true,
  },
  {
    id: 'dev-2',
    label: 'رایانهٔ پذیرش کلینیک',
    os: 'ویندوز ۱۰ حرفه‌ای',
    systemCode: '419022108',
    activationCode: '9104 3328 7741',
    activatedAt: '2026-11-15T08:12:00Z',
    ip: '185.110.24.22',
    active: true,
  },
];

const DEFAULT_TIMELINE: AdminTimelineEvent[] = [
  {
    id: 'ev-1',
    title: 'افزایش سقف فعال‌سازی به ۳ رایانه',
    description: 'سقف اختصاصی مشتری به درخواست کلینیک آرامش ثبت شد (FR-23).',
    timestamp: '2026-11-18T11:45:00Z',
    tone: 'warning',
    actor: 'حامد کریمی (مدیر سامانه)',
    badgeText: 'تغییر سقف',
  },
  {
    id: 'ev-2',
    title: 'تکرار فعال‌سازی روی همان رایانه',
    description: 'کد فعال‌سازی پیشین بازگردانده شد و ظرفیتی کسر نشد (FR-12).',
    timestamp: '2026-11-16T09:05:00Z',
    tone: 'info',
    actor: 'سامانهٔ خودکار رجیستری',
    badgeText: 'بدون مصرف ظرفیت',
    codeMeta: '882859354',
    ipMeta: '185.110.24.19',
  },
  {
    id: 'ev-3',
    title: 'فعال‌سازی دوم روی رایانهٔ پذیرش',
    description: 'کد جدید تولید و به شمارهٔ همراه مالک پیامک شد.',
    timestamp: '2026-11-15T08:12:00Z',
    tone: 'success',
    actor: 'دکتر سارا رضایی',
    codeMeta: '419022108',
    ipMeta: '185.110.24.22',
  },
  {
    id: 'ev-4',
    title: 'فعال‌سازی نخست از درون برنامه',
    description: 'لینک مستقیم از برنامهٔ ویندوز با پارامتر کد سیستم باز شد.',
    timestamp: '2026-11-13T13:34:00Z',
    tone: 'success',
    actor: 'دکتر سارا رضایی',
    codeMeta: '882859354',
    ipMeta: '185.110.24.19',
  },
];

export const ADMIN_SERIALS: readonly AdminSerialRecord[] = [
  {
    serial: 'N25AG-EMV0K',
    productId: 'iq4',
    productName: PRODUCT_LABELS.iq4,
    customerName: 'دکتر سارا رضایی',
    phone: '09123456789',
    orderCode: 'ORD-1405-8821',
    status: 'active',
    used: 2,
    limit: 3,
    limitSource: 'customer',
    createdAt: '2026-11-01T07:30:00Z',
    lastActivationAt: '2026-11-18T11:45:00Z',
    devices: DEFAULT_DEVICES,
    timeline: DEFAULT_TIMELINE,
    policyBefore: 'serial=N25AG-EMV0K\nlimit=1\nsource=product\nallow_repeat_pc=true\nstatus=active',
    policyAfter:
      'serial=N25AG-EMV0K\nlimit=3\nsource=customer\nallow_repeat_pc=true\nreason=clinic_second_room\nstatus=active',
    policySummaryBefore: 'نسخهٔ ۱ (۱۸ آبان ۱۴۰۵)',
    policySummaryAfter: 'نسخهٔ ۲ (۲۷ آبان ۱۴۰۵)',
  },
  {
    serial: 'N25BG-9K1LP',
    productId: 'clinical',
    productName: PRODUCT_LABELS.clinical,
    customerName: 'کلینیک آرامش تهران',
    phone: '09351122334',
    orderCode: 'ORD-1405-8790',
    status: 'limit_reached',
    used: 2,
    limit: 2,
    limitSource: 'product',
    createdAt: '2026-10-28T10:10:00Z',
    lastActivationAt: '2026-11-17T15:20:00Z',
    devices: DEFAULT_DEVICES,
    timeline: DEFAULT_TIMELINE.slice(1),
    policyBefore: 'serial=N25BG-9K1LP\nlimit=2\nsource=product\nstatus=active',
    policyAfter: 'serial=N25BG-9K1LP\nlimit=2\nsource=product\nstatus=limit_reached',
    policySummaryBefore: 'نسخهٔ ۱',
    policySummaryAfter: 'نسخهٔ ۲',
  },
  {
    serial: 'N25CR-4M7QX',
    productId: 'mmpi',
    productName: PRODUCT_LABELS.mmpi,
    customerName: 'دکتر امیرحسین مرادی',
    phone: '09198765432',
    orderCode: 'ORD-1405-8754',
    status: 'unused',
    used: 0,
    limit: 1,
    limitSource: 'global',
    createdAt: '2026-11-16T06:40:00Z',
    lastActivationAt: '2026-11-16T06:40:00Z',
    devices: [],
    timeline: [
      {
        id: 'cr-1',
        title: 'صدور سریال در دستهٔ آبان',
        description: 'سریال پس از پرداخت موفق سفارش به حساب مشتری اختصاص یافت.',
        timestamp: '2026-11-16T06:40:00Z',
        tone: 'neutral',
        actor: 'سامانهٔ فروش نگرش',
      },
    ],
    policyBefore: 'serial=N25CR-4M7QX\nlimit=1\nsource=global\nstatus=unused',
    policyAfter: 'serial=N25CR-4M7QX\nlimit=1\nsource=global\nstatus=unused',
    policySummaryBefore: 'نسخهٔ ۱',
    policySummaryAfter: 'نسخهٔ ۱',
  },
  {
    serial: 'N25DT-8W2ZN',
    productId: 'iq4',
    productName: PRODUCT_LABELS.iq4,
    customerName: 'مرکز مشاورهٔ مهر',
    phone: '09127778899',
    orderCode: 'ORD-1405-8612',
    status: 'revoked',
    used: 1,
    limit: 1,
    limitSource: 'serial',
    createdAt: '2026-10-12T09:00:00Z',
    lastActivationAt: '2026-11-05T12:15:00Z',
    devices: [DEFAULT_DEVICES[0]!],
    timeline: [
      {
        id: 'dt-1',
        title: 'ابطال سریال به درخواست پشتیبانی',
        description: 'به دلیل بازگشت وجه سفارش، سریال غیرفعال شد.',
        timestamp: '2026-11-05T12:15:00Z',
        tone: 'danger',
        actor: 'حامد کریمی (مدیر سامانه)',
        badgeText: 'باطل‌شده',
      },
    ],
    policyBefore: 'serial=N25DT-8W2ZN\nlimit=1\nsource=serial\nstatus=active',
    policyAfter: 'serial=N25DT-8W2ZN\nlimit=1\nsource=serial\nstatus=revoked\nreason=order_refunded',
    policySummaryBefore: 'نسخهٔ ۱',
    policySummaryAfter: 'نسخهٔ ۲',
  },
  {
    serial: 'N25EF-3P9VB',
    productId: 'wisc',
    productName: PRODUCT_LABELS.wisc,
    customerName: 'دکتر مریم کاظمی',
    phone: '09134561290',
    orderCode: 'ORD-1405-8599',
    status: 'active',
    used: 1,
    limit: 2,
    limitSource: 'product',
    createdAt: '2026-10-20T11:30:00Z',
    lastActivationAt: '2026-11-14T16:40:00Z',
    devices: [DEFAULT_DEVICES[0]!],
    timeline: DEFAULT_TIMELINE.slice(2),
    policyBefore: 'serial=N25EF-3P9VB\nlimit=1\nsource=global\nstatus=active',
    policyAfter: 'serial=N25EF-3P9VB\nlimit=2\nsource=product\nstatus=active',
    policySummaryBefore: 'نسخهٔ ۱',
    policySummaryAfter: 'نسخهٔ ۲',
  },
  {
    serial: 'N25GH-6T4YD',
    productId: 'clinical',
    productName: PRODUCT_LABELS.clinical,
    customerName: 'پژوهشکدهٔ علوم رفتاری',
    phone: '09128810023',
    orderCode: 'ORD-1405-8501',
    status: 'active',
    used: 4,
    limit: 5,
    limitSource: 'serial',
    createdAt: '2026-10-05T08:00:00Z',
    lastActivationAt: '2026-11-17T09:50:00Z',
    devices: DEFAULT_DEVICES,
    timeline: DEFAULT_TIMELINE,
    policyBefore: 'serial=N25GH-6T4YD\nlimit=2\nsource=product\nstatus=active',
    policyAfter: 'serial=N25GH-6T4YD\nlimit=5\nsource=serial\nstatus=active',
    policySummaryBefore: 'نسخهٔ ۱',
    policySummaryAfter: 'نسخهٔ ۲',
  },
  {
    serial: 'N25JK-2L8WR',
    productId: 'mmpi',
    productName: PRODUCT_LABELS.mmpi,
    customerName: 'دکتر نیما شریفی',
    phone: '09172234455',
    orderCode: 'ORD-1405-8440',
    status: 'limit_reached',
    used: 1,
    limit: 1,
    limitSource: 'global',
    createdAt: '2026-09-29T10:15:00Z',
    lastActivationAt: '2026-11-11T14:05:00Z',
    devices: [DEFAULT_DEVICES[0]!],
    timeline: DEFAULT_TIMELINE.slice(2),
    policyBefore: 'serial=N25JK-2L8WR\nlimit=1\nsource=global\nstatus=active',
    policyAfter: 'serial=N25JK-2L8WR\nlimit=1\nsource=global\nstatus=limit_reached',
    policySummaryBefore: 'نسخهٔ ۱',
    policySummaryAfter: 'نسخهٔ ۲',
  },
  {
    serial: 'N25LM-5N1CF',
    productId: 'wisc',
    productName: PRODUCT_LABELS.wisc,
    customerName: 'کلینیک کودک فردا',
    phone: '09153349981',
    orderCode: 'ORD-1405-8410',
    status: 'active',
    used: 1,
    limit: 3,
    limitSource: 'customer',
    createdAt: '2026-10-02T07:45:00Z',
    lastActivationAt: '2026-11-12T10:30:00Z',
    devices: [DEFAULT_DEVICES[0]!],
    timeline: DEFAULT_TIMELINE.slice(1),
    policyBefore: 'serial=N25LM-5N1CF\nlimit=2\nsource=product\nstatus=active',
    policyAfter: 'serial=N25LM-5N1CF\nlimit=3\nsource=customer\nstatus=active',
    policySummaryBefore: 'نسخهٔ ۱',
    policySummaryAfter: 'نسخهٔ ۲',
  },
  {
    serial: 'N25NP-7Q3HG',
    productId: 'iq4',
    productName: PRODUCT_LABELS.iq4,
    customerName: 'دکتر الهام فرهادی',
    phone: '09126654321',
    orderCode: 'ORD-1405-8302',
    status: 'expired',
    used: 1,
    limit: 1,
    limitSource: 'product',
    createdAt: '2025-10-10T08:00:00Z',
    lastActivationAt: '2026-08-20T13:00:00Z',
    devices: [DEFAULT_DEVICES[0]!],
    timeline: DEFAULT_TIMELINE.slice(3),
    policyBefore: 'serial=N25NP-7Q3HG\nlimit=1\nsource=product\nstatus=active',
    policyAfter: 'serial=N25NP-7Q3HG\nlimit=1\nsource=product\nstatus=expired',
    policySummaryBefore: 'نسخهٔ ۱',
    policySummaryAfter: 'نسخهٔ ۲',
  },
  {
    serial: 'N25QR-1V6MK',
    productId: 'clinical',
    productName: PRODUCT_LABELS.clinical,
    customerName: 'مرکز سلامت روان سپهر',
    phone: '09119987766',
    orderCode: 'ORD-1405-8277',
    status: 'active',
    used: 2,
    limit: 4,
    limitSource: 'customer',
    createdAt: '2026-10-18T12:00:00Z',
    lastActivationAt: '2026-11-16T17:10:00Z',
    devices: DEFAULT_DEVICES,
    timeline: DEFAULT_TIMELINE,
    policyBefore: 'serial=N25QR-1V6MK\nlimit=2\nsource=product\nstatus=active',
    policyAfter: 'serial=N25QR-1V6MK\nlimit=4\nsource=customer\nstatus=active',
    policySummaryBefore: 'نسخهٔ ۱',
    policySummaryAfter: 'نسخهٔ ۲',
  },
];

export function findAdminSerial(serial: string): AdminSerialRecord | undefined {
  const normalized = serial.trim().toUpperCase();
  return ADMIN_SERIALS.find((item) => item.serial.toUpperCase() === normalized);
}
