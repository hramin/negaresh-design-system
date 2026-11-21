import { iconMenu, iconMoon, iconSignOut, iconUser } from '@negaresh/icons';
import {
  AccountPill,
  IconButton,
  LogoSlot,
  Menu,
  MenuItem,
  MenuTrigger,
  TopBar,
  TopBarBrand,
  TopBarNav,
  TopBarNavLink,
} from '@negaresh/react';
import { maskPhone } from '@negaresh/utils';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import ui from '../ui.module.css';
import chrome from './chrome.module.css';

const MASKED_PHONE = maskPhone('09121234567');

function SampleBar({
  navLabel,
  withMobileMenu = false,
  minimal = false,
  size = 'default',
}: {
  navLabel?: string;
  withMobileMenu?: boolean;
  minimal?: boolean;
  size?: 'default' | 'wide';
}) {
  return (
    <div className={chrome.previewFrame}>
      <TopBar
        as="div"
        sticky={false}
        size={size}
        mobileMenu={
          withMobileMenu ? (
            <MenuTrigger>
              <IconButton icon={iconMenu} aria-label="منوی بخش‌ها" />
              <Menu placement="bottom start">
                <MenuItem id="activate">فعال‌سازی</MenuItem>
                <MenuItem id="mine">فعال‌سازی‌های من</MenuItem>
                <MenuItem id="support">پشتیبانی</MenuItem>
              </Menu>
            </MenuTrigger>
          ) : undefined
        }
        brand={
          <TopBarBrand href="#top-bar-home" aria-label="رجیستری نگارش برتر، صفحهٔ اصلی">
            <LogoSlot name="نگارش برتر" product="رجیستری" />
          </TopBarBrand>
        }
        nav={
          !minimal && navLabel ? (
            <TopBarNav aria-label={navLabel}>
              <TopBarNavLink href="#activate" isCurrent>
                فعال‌سازی
              </TopBarNavLink>
              <TopBarNavLink href="#mine">فعال‌سازی‌های من</TopBarNavLink>
              <TopBarNavLink href="#purchases">خریدها</TopBarNavLink>
              <TopBarNavLink href="#disabled" isDisabled>
                به‌زودی
              </TopBarNavLink>
            </TopBarNav>
          ) : undefined
        }
        actions={
          <>
            <IconButton icon={iconMoon} aria-label="تغییر به حالت تیره" />
            <MenuTrigger>
              <AccountPill label={MASKED_PHONE} ltr aria-label={`حساب کاربری ${MASKED_PHONE}`} />
              <Menu placement="bottom end">
                <MenuItem id="profile" icon={iconUser}>
                  فعال‌سازی‌های من
                </MenuItem>
                <MenuItem id="signout" icon={iconSignOut}>
                  خروج
                </MenuItem>
              </Menu>
            </MenuTrigger>
          </>
        }
      />
    </div>
  );
}

export const topBarDoc: ComponentDoc = {
  slug: 'top-bar',
  title: 'نوار بالایی',
  components: ['TopBar', 'TopBarBrand', 'TopBarNav', 'TopBarNavLink'],
  base: 'Link',
  summary:
    'نوار بالای صفحه با جای لوگو، پیوندهای ناوبری اصلی، جای دکمهٔ منوی موبایل و اقدام‌های پایانی. با خط مویی و پس‌زمینهٔ نیمه‌شفاف از صفحه جدا می‌شود و سایهٔ ثابت ندارد (D-77).',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  Example: () => <SampleBar navLabel="نمونهٔ زندهٔ ناوبری" withMobileMenu />,
  Gallery: () => (
    <>
      <GalleryRow title="ترکیب استاندارد (صفحهٔ مرجع)">
        <div className={chrome.fullRow}>
          <State label="جای لوگو، پیوند فعال/عادی/غیرفعال، اقدام‌ها (ناوبری زیر ۹۰۰ پیکسل پنهان می‌شود)">
            <SampleBar navLabel="گالری نوار استاندارد" />
          </State>
        </div>
      </GalleryRow>
      <GalleryRow title="با جای منوی موبایل">
        <div className={chrome.fullRow}>
          <State label="دکمهٔ mobileMenu زیر ۹۰۰ پیکسل ظاهر می‌شود">
            <SampleBar navLabel="گالری نوار با منوی موبایل" withMobileMenu />
          </State>
        </div>
      </GalleryRow>
      <GalleryRow title="حداقل (جریان‌های متمرکز)">
        <div className={chrome.fullRow}>
          <State label="فقط برند و اقدام‌ها">
            <SampleBar minimal />
          </State>
        </div>
      </GalleryRow>
      <GalleryRow title="حالت‌های پیوند ناوبری (hover و focus-visible در آزمون تصویری گرفته می‌شوند)">
        <State label="عادی · تعاملی">
          <span className={ui.capture} data-interactive="top-bar-link">
            <TopBarNavLink href="#interactive">فعال‌سازی‌های من</TopBarNavLink>
          </span>
        </State>
        <State label="صفحهٔ فعلی">
          <TopBarNavLink href="#current" isCurrent>
            فعال‌سازی
          </TopBarNavLink>
        </State>
        <State label="غیرفعال">
          <TopBarNavLink href="#disabled" isDisabled>
            به‌زودی
          </TopBarNavLink>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای هر TopBarNav نام معنادار با aria-label بگذارید و صفحهٔ فعلی را با isCurrent مشخص کنید.',
      'در سطح صفحه از پیش‌فرض as="header" و sticky استفاده کنید تا نشانهٔ banner ساخته شود.',
      'لوگو را داخل TopBarBrand قرار دهید تا حلقهٔ فوکوس و نام دسترس‌پذیر داشته باشد.',
    ],
    dont: [
      'چیدن بیش از ۵ پیوند اصلی در نوار؛ ناوبری‌های چندسطحی به SideNav یا TabStrip (P4) می‌روند.',
      'افزودن سایهٔ ثابت یا نوار دوم چسبان زیر نوار بالایی.',
    ],
  },
  api: [
    {
      name: 'TopBar',
      props: [
        {
          name: 'brand',
          type: 'ReactNode',
          description: 'جای برند در ابتدای سطر (TopBarBrand + LogoSlot).',
        },
        { name: 'nav', type: 'ReactNode', description: 'ناوبری اصلی (TopBarNav).' },
        {
          name: 'actions',
          type: 'ReactNode',
          description: 'اقدام‌های انتهای سطر (تغییر حالت، AccountPill).',
        },
        {
          name: 'mobileMenu',
          type: 'ReactNode',
          description: 'دکمهٔ منوی موبایل؛ فقط زیر ۹۰۰ پیکسل دیده می‌شود.',
        },
        {
          name: 'size',
          type: "'default' | 'wide'",
          default: "'default'",
          description: 'عرض ظرف درونی (۱۲۰۰ یا ۱۴۴۰ پیکسل).',
        },
        { name: 'sticky', type: 'boolean', default: 'true', description: 'چسبان در بالای نما.' },
        {
          name: 'as',
          type: "'header' | 'div'",
          default: "'header'",
          description: 'برچسب ریشه؛ برای پیش‌نمایش‌های توکار از div استفاده کنید.',
        },
      ],
    },
    {
      name: 'TopBarBrand',
      props: [
        { name: 'href', type: 'string', description: 'نشانی صفحهٔ اصلی.' },
        { name: 'aria-label', type: 'string', description: 'نام دسترس‌پذیر پیوند برند.' },
        { name: 'children', type: 'ReactNode', description: 'معمولاً LogoSlot.' },
      ],
    },
    {
      name: 'TopBarNav',
      props: [
        { name: 'aria-label', type: 'string', description: 'الزامی؛ نام نشانهٔ ناوبری.' },
        {
          name: 'hideOnMobile',
          type: 'boolean',
          default: 'true',
          description: 'پنهان کردن زیر ۹۰۰ پیکسل (D-90).',
        },
      ],
    },
    {
      name: 'TopBarNavLink',
      props: [
        { name: 'href', type: 'string', description: 'مقصد پیوند.' },
        {
          name: 'isCurrent',
          type: 'boolean',
          default: 'false',
          description: 'تنظیم aria-current="page" و حالت صفحهٔ فعال.',
        },
        {
          name: 'isDisabled',
          type: 'boolean',
          default: 'false',
          description: 'غیرفعال کردن پیوند.',
        },
        { name: 'onPress', type: '(e) => void', description: 'رویداد انتخاب.' },
      ],
    },
  ],
  keyboard: [
    {
      keys: 'Tab / Shift+Tab',
      action: 'حرکت بین برند، پیوندهای ناوبری و اقدام‌ها به ترتیب راست‌به‌چپ',
    },
    { keys: 'Enter', action: 'باز کردن پیوند برند یا پیوند ناوبری' },
  ],
  a11y: [
    'عنصر ریشهٔ <header> نشانهٔ banner و TopBarNav نشانهٔ navigation با برچسب یکتا می‌سازد.',
    'پیوند فعال با aria-current="page" و تغییر پس‌زمینه (و خط دور در کنتراست بالا) مشخص می‌شود.',
    'ارتفاع هدف هر پیوند دست‌کم ۴۴ پیکسل است و حلقهٔ فوکوس ۲ پیکسلی روی خود عنصر نمایش داده می‌شود.',
  ],
  rtl: [
    'ترتیب اجزا از راست به چپ: (منوی موبایل در نمایش باریک) ← برند ← پیوندها ← اقدام‌های پایانی با margin-inline-start: auto.',
    'زیر ۹۰۰ پیکسل، برچسب محصول در LogoSlot و پیوندهای TopBarNav پنهان می‌شوند تا ترکیب موبایل خلوت بماند.',
  ],
};
