import { iconEdit, iconMore, iconSignOut, iconTrash, iconUser } from '@negaresh/icons';
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  MenuSection,
  MenuSeparator,
  MenuTrigger,
  SubmenuTrigger,
} from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';

function AccountMenu({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <MenuTrigger {...(defaultOpen ? { defaultOpen } : {})}>
      <Button iconStart={iconUser}>حساب کاربری</Button>
      <Menu>
        <MenuSection title="حساب">
          <MenuItem id="profile" icon={iconEdit} description="نام، شماره و ایمیل">
            ویرایش نمایه
          </MenuItem>
          <SubmenuTrigger>
            <MenuItem id="theme">حالت نمایش</MenuItem>
            <Menu selectionMode="single" defaultSelectedKeys={['system']}>
              <MenuItem id="system">سیستم</MenuItem>
              <MenuItem id="light">روشن</MenuItem>
              <MenuItem id="dark">تیره</MenuItem>
            </Menu>
          </SubmenuTrigger>
        </MenuSection>
        <MenuSeparator />
        <MenuItem id="signout" icon={iconSignOut}>
          خروج
        </MenuItem>
      </Menu>
    </MenuTrigger>
  );
}

export const menuDoc: ComponentDoc = {
  slug: 'menu',
  title: 'منو',
  components: ['MenuTrigger', 'Menu', 'MenuItem', 'MenuSection', 'MenuSeparator', 'SubmenuTrigger'],
  base: 'Menu, MenuTrigger, SubmenuTrigger, Popover',
  summary:
    'فهرستی از اقدام‌ها که از یک دکمه باز می‌شود؛ با بخش، زیرمنو، توضیح، میان‌بر و انتخاب. لایهٔ شناور است و تنها جایی است که سایه دارد.',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  Example: () => <AccountMenu />,
  Gallery: () => (
    <>
      <GalleryRow title="ماشه‌ها">
        <State label="Button">
          <AccountMenu />
        </State>
        <State label="IconButton">
          <MenuTrigger>
            <IconButton icon={iconMore} aria-label="اقدام‌های بیشتر" />
            <Menu>
              <MenuItem id="edit" icon={iconEdit} shortcut="Ctrl+E">
                ویرایش
              </MenuItem>
              <MenuItem id="delete" icon={iconTrash} tone="danger">
                حذف کوپن
              </MenuItem>
              <MenuItem id="disabled" isDisabled>
                بایگانی (به‌زودی)
              </MenuItem>
            </Menu>
          </MenuTrigger>
        </State>
      </GalleryRow>
      <GalleryRow title="منوی باز (در آزمون تصویری باز می‌شود)">
        <State label="بخش، توضیح، زیرمنو، جداکننده">
          <span data-interactive="menu">
            <AccountMenu />
          </span>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'اقدام‌های ثانویهٔ یک ردیف یا حساب کاربری.',
      'اقدام خطرناک با tone="danger"، آیکون و واژهٔ روشن.',
    ],
    dont: ['ناوبری اصلی سایت در منو؛ آن نوار ناوبری است (P4).', 'بیش از دو سطح زیرمنو.'],
  },
  api: [
    {
      name: 'MenuTrigger',
      props: [
        { name: 'isOpen / defaultOpen / onOpenChange', type: '—', description: 'کنترل باز بودن.' },
      ],
    },
    {
      name: 'Menu',
      props: [
        { name: 'onAction', type: '(key: Key) => void', description: 'اجرای گزینه.' },
        {
          name: 'selectionMode',
          type: "'none' | 'single' | 'multiple'",
          default: "'none'",
          description: 'تیک کنار گزینهٔ انتخاب‌شده.',
        },
        {
          name: 'placement',
          type: "'bottom start' | …",
          default: "'bottom start'",
          description: 'جای پاپ‌اور نسبت به ماشه (منطقی).',
        },
      ],
    },
    {
      name: 'MenuItem',
      props: [
        { name: 'id', type: 'Key', description: 'کلید.' },
        { name: 'icon', type: 'IconDefinition', description: '—' },
        { name: 'description', type: 'ReactNode', description: 'خط دوم.' },
        { name: 'shortcut', type: 'string', description: 'میان‌بر لاتین، چپ‌به‌راست.' },
        { name: 'tone', type: "'default' | 'danger'", default: "'default'", description: '—' },
        { name: 'href', type: 'string', description: 'گزینهٔ پیوندی.' },
      ],
    },
    {
      name: 'MenuSection',
      props: [{ name: 'title', type: 'ReactNode', description: 'عنوان دیدنی بخش.' }],
    },
  ],
  keyboard: [
    { keys: 'Enter / Space / ↓', action: 'باز کردن منو از ماشه' },
    { keys: '↑ / ↓', action: 'گزینهٔ قبلی / بعدی' },
    { keys: '← (در فارسی)', action: 'باز کردن زیرمنو' },
    { keys: 'Esc', action: 'بستن و بازگشت فوکوس به ماشه' },
    { keys: 'حرف اول', action: 'پرش به گزینه (type-ahead)' },
  ],
  a11y: [
    'نام منو از ماشه می‌آید (aria-labelledby).',
    'دکمهٔ پنهان «Dismiss» از React Aria ترجمهٔ فارسی ندارد (یادداشت P2).',
  ],
  rtl: ['زیرمنو در سمت پایان (چپ) باز می‌شود؛ chevron قرینه است.'],
};
