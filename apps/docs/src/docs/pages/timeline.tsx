import { iconKey, iconShield } from '@negaresh/icons';
import {
  ActivityList,
  Badge,
  Code,
  Ltr,
  Section,
  Stack,
  StatusBadge,
  Surface,
  Text,
  Timeline,
} from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './data-display.module.css';

const SAMPLE_ITEMS = [
  {
    id: 'act-1',
    title: 'فعال‌سازی موفق روی رایانهٔ کلینیک',
    description: 'کد فعال‌سازی تولید شد و یک ظرفیت از سقف مصرف شد.',
    timestamp: '2026-11-15T14:20:00Z',
    tone: 'success' as const,
    icon: iconKey,
    actor: 'دکتر سارا رضایی',
    badge: <StatusBadge domain="serial" status="active" size="sm" />,
    meta: (
      <>
        کد سیستم: <Code>882859354</Code>
      </>
    ),
  },
  {
    id: 'act-2',
    title: 'تکرار فعال‌سازی روی همان رایانه',
    description: 'کد قبلی بازگردانده شد و ظرفیتی کسر نشد (FR-12).',
    timestamp: '2026-11-16T09:05:00Z',
    tone: 'info' as const,
    actor: 'سامانهٔ رجیستری',
    badge: (
      <Badge tone="info" size="sm">
        بدون مصرف ظرفیت
      </Badge>
    ),
    meta: <Ltr>185.110.24.19</Ltr>,
  },
  {
    id: 'act-3',
    title: 'افزایش سقف فعال‌سازی به ۳ رایانه',
    description: 'سقف اختصاصی مشتری با دلیل «استقرار در شعبهٔ دوم» ثبت شد.',
    timestamp: '2026-11-18T11:45:00Z',
    tone: 'warning' as const,
    icon: iconShield,
    actor: 'حامد کریمی (مدیر)',
  },
];

function Example() {
  const [selectedEvent, setSelectedEvent] = useState<string>('act-1');

  return (
    <div className={styles.block} data-interactive="timeline">
      <Stack gap="4">
        <Surface>
          <Section>
            <ActivityList
              aria-label="فهرست تعاملی رویدادهای سریال"
              selectionMode="single"
              selectedKeys={[selectedEvent]}
              onSelectionChange={(keys) => {
                if (keys !== 'all') {
                  const [first] = [...keys];
                  if (first !== undefined) setSelectedEvent(String(first));
                }
              }}
              onAction={(key) => setSelectedEvent(String(key))}
              items={SAMPLE_ITEMS}
            />
          </Section>
        </Surface>
        <Text size="xs" tone="muted" className={styles.output}>
          رویداد انتخاب‌شده: <Code>{selectedEvent}</Code>
        </Text>
      </Stack>
    </div>
  );
}

export const timelineDoc: ComponentDoc = {
  slug: 'timeline',
  title: 'خط زمانی و فهرست رویدادها (Timeline · ActivityList)',
  components: ['Timeline', 'TimelineItem', 'ActivityList', 'ActivityListItem'],
  base: 'React Aria GridList (ActivityList) / Semantic <ol> (Timeline)',
  summary:
    'نمایش تاریخچهٔ فعال‌سازی‌ها، گزارش ممیزی و نسخه‌های ویرایشی با زمان‌بندی جلالی تهران، آیکون‌های وضعیت و پشتیبانی از ناوبری صفحه‌کلید در ActivityList.',
  status: 'review',
  products: ['R', 'N', 'T'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="خط زمانی ترتیبی (Timeline · تاریخچهٔ ممیزی)">
        <State label="comfortable · Jalali timestamps">
          <div className={styles.block}>
            <Surface>
              <Section>
                <Timeline aria-label="گالری خط زمانی" items={SAMPLE_ITEMS} />
              </Section>
            </Surface>
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="تراکم فشرده و حالت‌های خالی / بارگذاری">
        <State label="compact · empty · loading">
          <div className={styles.block}>
            <Stack gap="4">
              <Surface>
                <Section>
                  <Timeline
                    aria-label="خط زمانی فشرده"
                    density="compact"
                    items={SAMPLE_ITEMS.slice(0, 2)}
                  />
                </Section>
              </Surface>
              <Surface>
                <Section>
                  <Timeline aria-label="خط زمانی خالی" items={[]} />
                </Section>
              </Surface>
              <Surface>
                <Section>
                  <Timeline aria-label="خط زمانی در حال بارگذاری" isLoading loadingCount={2} />
                </Section>
              </Surface>
            </Stack>
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای تاریخچه‌های فقط‌خواندنی از Timeline (<ol>) و برای گزارش‌های قابل انتخاب یا دارای اقدام از ActivityList (GridList) استفاده کنید.',
      'تاریخ‌ها را به صورت ISO UTC در prop timestamp بدهید تا خودکار به تاریخ جلالی وقت تهران تبدیل شوند.',
      'کد سیستم و آدرس IP را درون <Code> و <Ltr> قرار دهید (D-86).',
    ],
    dont: [
      'زمان را دستی قالب‌بندی نکنید یا از منطقهٔ زمانی مرورگر استفاده نکنید.',
      'تنها با رنگ دایرهٔ خط زمانی نوع رویداد را تفکیک نکنید؛ آیکون یا برچسب متنی همراه آن بگذارید.',
    ],
  },
  api: [
    {
      name: 'Timeline',
      props: [
        { name: 'items', type: 'readonly TimelineEntry[]', description: 'آرایهٔ رویدادها (یا استفاده از فرزندان TimelineItem).' },
        { name: 'density', type: "'comfortable' | 'compact'", default: "'comfortable'", description: 'فاصلهٔ عمودی بین رویدادها.' },
        { name: 'isLoading / loadingCount', type: 'boolean / number', default: 'false / 3', description: 'حالت بارگذاری اسکلتون با aria-busy.' },
        { name: 'emptyState', type: 'ReactNode', description: 'جایگزین حالت خالی پیش‌فرض.' },
      ],
    },
    {
      name: 'ActivityList',
      props: [
        { name: 'selectionMode', type: "'none' | 'single' | 'multiple'", default: "'none'", description: 'حالت انتخاب ردیف‌ها روی React Aria GridList.' },
        { name: 'selectedKeys / onSelectionChange', type: 'Selection / (keys) => void', description: 'مدیریت انتخاب کنترل‌شده.' },
        { name: 'onAction', type: '(key: Key) => void', description: 'اقدام هنگام کلیک یا Enter روی رویداد.' },
      ],
    },
    {
      name: 'TimelineEntry / TimelineItem',
      props: [
        { name: 'title / description', type: 'ReactNode', description: 'عنوان و توضیح رویداد.' },
        { name: 'timestamp / timestampFormat', type: "DateInput / 'datetime' | 'date' | 'relative'", default: "'datetime'", description: 'قالب‌بندی خودکار جلالی در <time>.' },
        { name: 'tone / icon', type: 'TimelineTone / IconDefinition', default: "'neutral'", description: 'لحن معنایی همراه با آیکون پیش‌فرض.' },
        { name: 'actor / badge / meta / details / actions', type: 'ReactNode', description: 'کنشگر، برچسب وضعیت، فراداده و جزئیات.' },
      ],
    },
  ],
  keyboard: [
    { keys: 'ArrowDown / ArrowUp', action: 'حرکت بین رویدادهای ActivityList.' },
    { keys: 'Space / Enter', action: 'انتخاب یا اجرای اقدام ردیف در ActivityList.' },
  ],
  a11y: [
    'هر زمان‌بندی درون برچسب معنایی <time dateTime="..."> با تاریخ ISO قرار می‌گیرد.',
    'آیکون‌های خط زمانی decorative بوده و لحن رویداد در متن یا StatusBadge بیان می‌شود.',
  ],
  rtl: [
    'ریل عمودی خط زمانی در سمت آغاز سطر (راست در فارسی) با ویژگی‌های منطقی قرار می‌گیرد و کدهای لاتین ایزوله می‌مانند.',
  ],
};
