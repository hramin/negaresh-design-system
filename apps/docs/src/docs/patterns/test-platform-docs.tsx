import {
  B2BPanel,
  CampaignBuilder,
  CampaignParticipants,
  OrgWallet,
  RosterImport,
  SeatMeter,
  ShareLinkPanel,
  TestCatalog,
  TestDashboard,
} from '@negaresh/patterns';
import {
  sampleB2BClients,
  sampleCampaignParticipants,
  sampleDashboardReports,
  sampleTestCatalog,
  sampleWalletLedger,
} from '@negaresh/patterns/fixtures';
import { iconBook, iconCheck, iconFile } from '@negaresh/icons';
import { Stack } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { State } from '../ui.tsx';
import pStyles from './patterns.module.css';

const DASHBOARD_STATS = [
  { label: 'آزمون‌های تکمیل‌شده', value: 6, icon: iconCheck },
  { label: 'گزارش‌های آماده', value: 4, icon: iconFile },
  { label: 'آزمون نیمه‌تمام', value: 1, icon: iconBook },
];

export const testPlatformCatalogDoc: ComponentDoc = {
  slug: 'test-platform-catalog',
  title: 'پلتفرم آزمون · کاتالوگ آزمون‌ها و پیشخوان کاربر',
  components: ['TestCatalog', 'TestDashboard'],
  summary:
    'کاتالوگ آزمون‌های روان‌شناختی (رایگان، تخفیف‌دار و تعرفهٔ سازمانی) و پیشخوان کاربر با ادامهٔ آزمون نیمه‌تمام، گزارش‌های آماده و نتایج اخیر.',
  status: 'approved',
  products: ['T'],
  Example: () => <TestCatalog tests={sampleTestCatalog} onStartOrBuy={() => {}} />,
  Gallery: () => (
    <div className={pStyles.stack}>
      <State label="پیشخوان آزمون‌ها (آمار، ادامهٔ آزمون نیمه‌تمام، گزارش‌های آماده و نتایج اخیر)">
        <TestDashboard
          stats={DASHBOARD_STATS}
          unfinishedTestTitle="آزمون شخصیتی نوجوانان (MMPI-Teen-13) — صفحهٔ ۳ از ۵"
          onContinueAttempt={() => {}}
          reports={sampleDashboardReports}
        />
      </State>
    </div>
  ),
  usage: {
    do: [
      'برای جریان شروع، پاسخ‌دهی، نتیجه و وضعیت گزارش، کامپوننت‌های مصوب `@negaresh/assessment` (P5) را از طریق اسلات‌های `TestDashboard` ترکیب کنید.',
    ],
    dont: [
      'در `@negaresh/patterns` وابستگی مستقیم به `@negaresh/assessment` یا `@negaresh/charts` ایجاد نکنید (docs/03-architecture.md).',
    ],
  },
  a11y: [
    'وضعیت گزارش‌ها از `StatusBadge(domain="report")` با آیکون و واژه نمایش داده می‌شود.',
  ],
  rtl: [
    'تعداد پرسش‌ها، زمان تقریبی و تعرفهٔ تومان با ارقام فارسی قالب‌بندی می‌شوند.',
  ],
};

function TestPlatformOrgExample() {
  const [revealedKey, setRevealedKey] = useState<string | undefined>(
    'nds_live_8f3a9d20c4e1b7a6f2091c8e4d2a',
  );
  const [clients, setClients] = useState([...sampleB2BClients]);

  return (
    <div className={pStyles.stack}>
      <SeatMeter used={38} limit={50} sourceNote="سقف صندلی خریداری‌شده برای کارزار پاییز" />
      <B2BPanel
        clients={clients}
        newlyCreatedKey={revealedKey}
        onCreateKey={() => setRevealedKey('nds_live_9c12e7a4b5d8f031aa7654c21e0f')}
        onRevokeKey={(id) => setClients((prev) => prev.filter((c) => c.id !== id))}
      />
    </div>
  );
}

export const testPlatformOrgDoc: ComponentDoc = {
  slug: 'test-platform-org',
  title: 'پلتفرم آزمون · کارزار سازمانی، کیف پول و دسترسی B2B',
  components: [
    'CampaignBuilder',
    'ShareLinkPanel',
    'RosterImport',
    'SeatMeter',
    'CampaignParticipants',
    'OrgWallet',
    'B2BPanel',
  ],
  summary:
    'ساخت کارزار آزمون سازمانی، پنل پیوند اشتراک‌گذاری و خروجی CSV، ورود فهرست شرکت‌کنندگان، سهمیهٔ صندلی، کیف پول تومانی سازمان و مدیریت کلیدهای API.',
  status: 'approved',
  products: ['T'],
  Example: TestPlatformOrgExample,
  Gallery: () => (
    <div className={pStyles.stack}>
      <State label="ساخت کارزار سازمانی (`CampaignBuilder`)">
        <CampaignBuilder
          testOptions={[
            { id: 't-mmpi', label: 'MMPI-Teen-13' },
            { id: 't-wellbeing', label: 'Wellbeing-8' },
          ]}
          extraFieldOptions={[
            { id: 'grade', label: 'پایهٔ تحصیلی' },
            { id: 'department', label: 'واحد سازمانی' },
          ]}
          onCreate={() => {}}
        />
      </State>
      <State label="پیوند اشتراک‌گذاری کارزار و ورود فهرست شرکت‌کنندگان">
        <Stack gap="4">
          <ShareLinkPanel
            shareUrl="https://tests.negaresh.ir/c/fall-1405-sepehr"
            onExportIndividualCsv={() => {}}
          />
          <RosterImport
            defaultPasteText={'09121112233\n09357654321\ninvalid-row'}
            onImport={() => {}}
          />
          <CampaignParticipants
            participants={sampleCampaignParticipants}
            aria-label="وضعیت شرکت‌کنندگان کارزار (گالری)"
          />
        </Stack>
      </State>
      <State label="کیف پول سازمانی (موجودی تومان، شارژ، تخصیص با موبایل و گردش مالی)">
        <OrgWallet
          balance={2_950_000}
          ledger={sampleWalletLedger}
          onTopUp={() => {}}
          onAllocate={() => {}}
        />
      </State>
    </div>
  ),
  usage: {
    do: [
      'در `B2BPanel` کلید API جدید را فقط یک بار با هشدار واضح و دکمهٔ کپی نمایش دهید و ابطال کلید را با `AlertDialog` محافظت کنید.',
      'شماره‌های موبایل در جدول شرکت‌کنندگان را با `maskPhone` ماسک کنید.',
    ],
    dont: [
      'موجودی یا تراکنش‌های `OrgWallet` را به ریال نمایش ندهید (D-26).',
    ],
  },
  a11y: [
    'فهرست شرکت‌کنندگان و گردش مالی کیف پول از `DataTable` با تبدیل خودکار به کارت در موبایل استفاده می‌کنند.',
    'شمارش ردیف‌های معتبر و نامعتبر در `RosterImport` به‌صورت زنده و بدون اتکا به رنگ تنها نمایش داده می‌شود.',
  ],
  rtl: [
    'پیوند کارزار، کلید API و شماره‌های موبایل در `<Code>` / `<Ltr>` ایزوله شده و تاریخ‌ها به شمسی (تهران) قالب‌بندی می‌شوند.',
  ],
};
