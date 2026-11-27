import {
  iconBell,
  iconFile,
  iconKey,
  iconReceipt,
  iconSettings,
  iconShield,
} from '@negaresh/icons';
import { Stack, TabStrip, type TabStripItemData, TabStripItem, Text } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './navigation.module.css';

const ITEMS: TabStripItemData[] = [
  { id: 'overview', label: 'نمای کلی', icon: iconFile },
  { id: 'activations', label: 'فعال‌سازی‌ها', icon: iconKey, badge: 4 },
  { id: 'orders', label: 'سفارش‌ها', icon: iconReceipt, badge: 2 },
  { id: 'alerts', label: 'هشدارها', icon: iconBell, badge: 1 },
  { id: 'security', label: 'امنیت حساب', icon: iconShield },
  { id: 'settings', label: 'تنظیمات', icon: iconSettings },
];

function Example() {
  const [selected, setSelected] = useState<string>('activations');
  const activeLabel = ITEMS.find((i) => i.id === selected)?.label ?? '';

  return (
    <div className={styles.block} data-interactive="tab-strip">
      <Stack gap="3">
        <TabStrip
          aria-label="ناوبری بخش‌های حساب (تعاملی)"
          items={ITEMS}
          selectedKey={selected}
          onSelect={(k) => setSelected(String(k))}
        />
        <Text size="xs" tone="muted" className={styles.output}>
          بخش فعال: {activeLabel}
        </Text>
      </Stack>
    </div>
  );
}

export const tabStripDoc: ComponentDoc = {
  slug: 'tab-strip',
  title: 'نوار زبانهٔ پیمایشی (TabStrip)',
  components: ['TabStrip', 'TabStripItem'],
  summary:
    'نوار ناوبری افقی قابل پیمایش برای نمای موبایل (زیر ۹۰۰ پیکسل) با پشتیبانی از پیوندهای سروررندر، نشان فارسی و هدف لمسی ۴۴ پیکسلی بدون ایجاد اسکرول افقی صفحه.',
  status: 'approved',
  products: ['R', 'N', 'T'],
  base: 'React Aria Link / Button',
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="پیوندهای ناوبری با آیکن، نشان عددی فارسی و آیتم غیرفعال">
        <State label="links · RTL scrollable">
          <div className={styles.block}>
            <TabStrip aria-label="نمونهٔ پیوندهای ناوبری">
              <TabStripItem href="#a" icon={iconKey} isCurrent badge={3}>
                فعال‌سازی‌ها
              </TabStripItem>
              <TabStripItem href="#b" icon={iconReceipt}>
                خریدها
              </TabStripItem>
              <TabStripItem href="#c" icon={iconBell} badge={12}>
                اعلان‌ها
              </TabStripItem>
              <TabStripItem href="#d" icon={iconShield} isDisabled>
                گزارش ممیزی
              </TabStripItem>
            </TabStrip>
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای پیمایش بخش‌های هم‌سطح در پنل مشتری و مدیریت روی موبایل استفاده کنید.',
      'وقتی داخل SideNav قرار می‌گیرد از as="div" استفاده کنید تا landmark تکراری نسازد.',
    ],
    dont: [
      'برای تعویض پنل‌های محتوا در یک صفحه بدون تغییر مسیر، از Tabs استفاده کنید نه TabStrip.',
    ],
  },
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'حرکت بین پیوندها و دکمه‌های نوار.' },
    { keys: 'Enter / Space', action: 'باز کردن بخش انتخاب‌شده.' },
  ],
  a11y: [
    'مورد فعال با aria-current="page" و خط زیرین برجسته می‌شود.',
    'ارتفاع همهٔ آیتم‌ها دست‌کم ۴۴ پیکسل است و با اسکرول داخلی از سرریز صفحه جلوگیری می‌کند.',
  ],
  rtl: [
    'پیمایش افقی از راست به چپ با overflow-inline و scroll-snap-type: inline proximity کار می‌کند.',
  ],
};
