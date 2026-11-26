import {
  iconBell,
  iconFile,
  iconKey,
  iconReceipt,
  iconSettings,
  iconShield,
  iconUsers,
} from '@negaresh/icons';
import {
  SegmentedControl,
  SegmentedControlItem,
  SideNav,
  type SideNavGroupData,
  Stack,
  Surface,
  Section,
  Text,
} from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './navigation.module.css';

function buildGroups(activeId: string, onSelect: (id: string) => void): SideNavGroupData[] {
  return [
    {
      id: 'account',
      title: 'حساب من',
      items: [
        {
          id: 'activations',
          label: 'فعال‌سازی‌ها',
          icon: iconKey,
          badge: 4,
          isCurrent: activeId === 'activations',
          onPress: () => onSelect('activations'),
        },
        {
          id: 'orders',
          label: 'خریدها و فاکتورها',
          icon: iconReceipt,
          isCurrent: activeId === 'orders',
          onPress: () => onSelect('orders'),
        },
      ],
    },
    {
      id: 'content',
      title: 'تحریریه',
      roles: ['editor', 'admin'],
      items: [
        {
          id: 'articles',
          label: 'نوشته‌ها',
          icon: iconFile,
          badge: 12,
          isCurrent: activeId === 'articles',
          onPress: () => onSelect('articles'),
        },
      ],
    },
    {
      id: 'admin',
      title: 'مدیریت سامانه',
      roles: ['admin'],
      isCollapsible: true,
      defaultExpanded: true,
      items: [
        {
          id: 'users',
          label: 'کاربران',
          icon: iconUsers,
          badge: 128,
          isCurrent: activeId === 'users',
          onPress: () => onSelect('users'),
        },
        {
          id: 'alerts',
          label: 'هشدارها',
          icon: iconBell,
          badge: 2,
          isCurrent: activeId === 'alerts',
          onPress: () => onSelect('alerts'),
        },
        {
          id: 'settings',
          label: 'تنظیمات',
          icon: iconSettings,
          isCurrent: activeId === 'settings',
          onPress: () => onSelect('settings'),
        },
      ],
    },
  ];
}

function Example() {
  const [role, setRole] = useState<'customer' | 'editor' | 'admin'>('admin');
  const [activeId, setActiveId] = useState('activations');

  return (
    <div className={styles.wide} data-interactive="side-nav">
      <Stack gap="4">
        <SegmentedControl
          label="فیلتر نقش کاربری"
          value={role}
          onChange={(next) => {
            if (next === 'customer' || next === 'editor' || next === 'admin') {
              setRole(next);
            }
          }}
        >
          <SegmentedControlItem id="customer">مشتری</SegmentedControlItem>
          <SegmentedControlItem id="editor">نویسنده</SegmentedControlItem>
          <SegmentedControlItem id="admin">مدیر</SegmentedControlItem>
        </SegmentedControl>

        <Surface>
          <Section>
            <SideNav
              aria-label="ناوبری پنل تعاملی"
              groups={buildGroups(activeId, setActiveId)}
              userRoles={[role]}
            />
          </Section>
        </Surface>
        <Text size="xs" tone="muted" className={styles.output}>
          بخش انتخاب‌شده: {activeId}
        </Text>
      </Stack>
    </div>
  );
}

const STATIC_GROUPS: SideNavGroupData[] = [
  {
    id: 'workspace',
    title: 'رجیستری',
    items: [
      { id: 'serials', label: 'سریال‌ها', href: '#serials', icon: iconKey, badge: 24, isCurrent: true },
      { id: 'limits', label: 'سقف‌های فعال‌سازی', href: '#limits', icon: iconShield },
      { id: 'audit', label: 'گزارش ممیزی', href: '#audit', icon: iconFile, isDisabled: true },
    ],
  },
];

export const sideNavDoc: ComponentDoc = {
  slug: 'side-nav',
  title: 'ناوبری کناری (SideNav)',
  components: ['SideNav', 'SideNavGroup', 'SideNavItem'],
  summary:
    'منوی کناری گروه‌بندی‌شده برای پنل کاربری و مدیریت با پشتیبانی از نشان عددی فارسی، فیلتر بر اساس نقش کاربری و تبدیل خودکار به TabStrip افقی زیر ۹۰۰ پیکسل (D-90).',
  status: 'review',
  products: ['R', 'N', 'T'],
  base: 'React Aria Link + Disclosure',
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="گروه‌بندی‌شده با نشان فارسی و مورد غیرفعال (زیر ۹۰۰ پیکسل به TabStrip تبدیل می‌شود)">
        <State label="responsive · adaptToTabStrip">
          <div className={styles.block}>
            <Surface>
              <Section>
                <SideNav aria-label="ناوبری رجیستری (نمونهٔ واکنش‌گرا)" groups={STATIC_GROUPS} />
              </Section>
            </Surface>
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="فیلتر نقش کاربری (مشتری بدون بخش مدیریت)">
        <State label="userRoles=['customer']">
          <div className={styles.block}>
            <Surface>
              <Section>
                <SideNav
                  aria-label="ناوبری مشتری (نمونهٔ گالری)"
                  groups={buildGroups('activations', () => {})}
                  userRoles={['customer']}
                  adaptToTabStrip={false}
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
      'در پنل‌های چندنقشی، نقش‌های کاربر را به userRoles بدهید تا گروه‌های خالی به طور خودکار پنهان شوند.',
      'برای هر SideNav یک aria-label توصیفی و یکتا تنظیم کنید.',
      'عددهای نشان را به صورت عدد (number) بدهید تا با formatNumber به رقم فارسی تبدیل شوند.',
    ],
    dont: [
      'در زیر ۹۰۰ پیکسل دو نوار ناوبری هم‌زمان رندر نکنید؛ adaptToTabStrip این جابه‌جایی را در یک landmark واحد انجام می‌دهد.',
    ],
  },
  api: [
    {
      name: 'SideNav',
      props: [
        { name: 'groups', type: 'readonly SideNavGroupData[]', description: 'آرایهٔ گروه‌ها و پیوندها (پشتیبانی از تبدیل خودکار به TabStrip در موبایل).' },
        { name: 'userRoles', type: 'readonly string[]', description: 'نقش‌های فعال کاربر برای فیلتر کردن گروه‌ها و آیتم‌ها.' },
        { name: 'adaptToTabStrip', type: 'boolean', default: 'true', description: 'تبدیل خودکار به TabStrip افقی قابل پیمایش در عرض زیر ۹۰۰ پیکسل.' },
        { name: 'aria-label', type: 'string', default: "'منوی کناری'", description: 'نام دسترس‌پذیر landmark ناوبری.' },
      ],
    },
    {
      name: 'SideNavGroup / SideNavItem',
      props: [
        { name: 'title / isCollapsible', type: 'ReactNode / boolean', description: 'عنوان گروه و امکان باز/بسته‌شدن با Disclosure.' },
        { name: 'href / onPress', type: 'string / () => void', description: 'پیوند سروررندر یا اقدام دکمه‌ای.' },
        { name: 'isCurrent / badge / roles', type: 'boolean / ReactNode | number / string[]', description: 'صفحهٔ فعلی (aria-current=page)، نشان فارسی و نقش‌های مجاز.' },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'حرکت بین گروه‌های بازشونده و پیوندهای ناوبری.' },
    { keys: 'Enter / Space', action: 'باز کردن پیوند یا باز/بسته کردن گروه قابل جمع‌شدن.' },
  ],
  a11y: [
    'هر دو نمای دسکتاپ و موبایل زیر یک <nav> واحد قرار دارند تا landmark تکراری ساخته نشود.',
    'مورد فعال با aria-current="page" و نوار کناری مشخص می‌شود (نه رنگ تنها).',
    'ارتفاع لمسی همهٔ ردیف‌ها دست‌کم ۴۴ پیکسل است.',
  ],
  rtl: [
    'نشانگر مورد فعال روی لبهٔ ابتدای سطر (inset-inline-start) قرار می‌گیرد و در RTL سمت راست است.',
  ],
};
