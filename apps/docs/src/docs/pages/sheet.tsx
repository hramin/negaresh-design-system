import { iconMenu } from '@negaresh/icons';
import {
  Button,
  DialogTrigger,
  Drawer,
  IconButton,
  Inline,
  LogoSlot,
  Sheet,
  SheetTrigger,
  Stack,
  Text,
  TopBar,
  TopBarBrand,
  TopBarNav,
  TopBarNavLink,
} from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './overlays.module.css';

function Example() {
  const [selectedNav, setSelectedNav] = useState('فعال‌سازی');

  return (
    <div className={styles.wide} data-interactive="sheet">
      <Stack gap="4">
        <Inline gap="2">
          <SheetTrigger>
            <Button variant="primary">کشوی ابتدای سطر (start)</Button>
            <Sheet
              side="start"
              size="md"
              title="فیلتر فهرست سریال‌ها"
              description="نتایج را بر اساس محصول و وضعیت محدود کنید."
              footer={(close) => (
                <>
                  <Button variant="secondary" onPress={close}>
                    پاک کردن
                  </Button>
                  <Button variant="primary" onPress={close}>
                    اعمال فیلتر
                  </Button>
                </>
              )}
            >
              <Text as="p" size="sm" leading="text">
                در دسکتاپ از لبهٔ راست (ابتدای سطر در فارسی) باز می‌شود و در موبایل زیر ۹۰۰ پیکسل
                به برگهٔ پایینی تبدیل می‌گردد.
              </Text>
            </Sheet>
          </SheetTrigger>

          <SheetTrigger>
            <Button variant="secondary">کشوی انتهای سطر (end)</Button>
            <Drawer side="end" size="sm" title="جزئیات سریع">
              <Text as="p" size="sm" leading="text">
                کشوی جانبی از لبهٔ چپ (انتهای سطر در RTL) برای نمایش جزئیات تکمیلی رکورد.
              </Text>
            </Drawer>
          </SheetTrigger>

          <SheetTrigger>
            <Button variant="ghost">برگهٔ پایینی (bottom)</Button>
            <Sheet side="bottom" title="انتخاب اقدام">
              <Text as="p" size="sm" leading="text">
                در همهٔ عرض‌ها از پایین صفحه باز می‌شود.
              </Text>
            </Sheet>
          </SheetTrigger>
        </Inline>

        <div className={styles.topBarFrame} data-interactive="topbar-sheet">
          <TopBar
            as="div"
            sticky={false}
            brand={
              <TopBarBrand href="#sheet-home" aria-label="رجیستری نگارش برتر">
                <LogoSlot name="نگارش برتر" product="رجیستری" />
              </TopBarBrand>
            }
            nav={
              <TopBarNav aria-label="ناوبری نمونهٔ کشو">
                <TopBarNavLink href="#activate" isCurrent={selectedNav === 'فعال‌سازی'}>
                  فعال‌سازی
                </TopBarNavLink>
                <TopBarNavLink href="#mine" isCurrent={selectedNav === 'فعال‌سازی‌های من'}>
                  فعال‌سازی‌های من
                </TopBarNavLink>
                <TopBarNavLink href="#support" isCurrent={selectedNav === 'پشتیبانی'}>
                  پشتیبانی
                </TopBarNavLink>
              </TopBarNav>
            }
            mobileMenu={
              <DialogTrigger>
                <IconButton icon={iconMenu} aria-label="باز کردن منوی ناوبری موبایل" />
                <Sheet side="start" title="بخش‌های رجیستری">
                  {(close) => (
                    <nav aria-label="ناوبری کشوی موبایل" className={styles.drawerNav}>
                      {(['فعال‌سازی', 'فعال‌سازی‌های من', 'پشتیبانی'] as const).map((item) => (
                        <TopBarNavLink
                          key={item}
                          href={`#${item}`}
                          isCurrent={selectedNav === item}
                          onPress={() => {
                            setSelectedNav(item);
                            close();
                          }}
                        >
                          {item}
                        </TopBarNavLink>
                      ))}
                    </nav>
                  )}
                </Sheet>
              </DialogTrigger>
            }
          />
        </div>
        <Text size="sm" tone="muted" className={styles.output}>
          بخش فعال در نمونهٔ نوار بالایی: {selectedNav}
        </Text>
      </Stack>
    </div>
  );
}

export const sheetDoc: ComponentDoc = {
  slug: 'sheet',
  title: 'کشو و برگهٔ لغزنده (Sheet / Drawer)',
  components: ['Sheet', 'Drawer', 'SheetTrigger'],
  base: 'ModalOverlay, Modal, Dialog, DialogTrigger',
  summary:
    'پنل کشویی کنار صفحه در دسکتاپ با جایگذاری منطقی (start / end) و برگهٔ پایینی در موبایل (زیر ۹۰۰ پیکسل). به سادگی در جایگاه mobileMenu نوار بالایی (TopBar) ترکیب می‌شود.',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="جهت‌های منطقی و اندازه‌ها">
        <State label="لبهٔ شروع (start · sm)">
          <SheetTrigger>
            <Button size="sm">کشوی start</Button>
            <Sheet side="start" size="sm" title="منوی بخش‌ها">
              محتوای کشوی باریک در سمت راست در حالت فارسی.
            </Sheet>
          </SheetTrigger>
        </State>
        <State label="لبهٔ پایان (end · md)">
          <SheetTrigger>
            <Button size="sm">کشوی end</Button>
            <Sheet side="end" size="md" title="فیلترهای پیشرفته">
              محتوای کشوی میانه در سمت چپ در حالت فارسی.
            </Sheet>
          </SheetTrigger>
        </State>
        <State label="پایین صفحه (bottom)">
          <SheetTrigger>
            <Button size="sm">برگهٔ bottom</Button>
            <Sheet side="bottom" title="گزینه‌های اشتراک‌گذاری">
              برگهٔ لغزنده از پایین نما.
            </Sheet>
          </SheetTrigger>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای فیلترهای کاتالوگ در موبایل، جزئیات جانبی رکوردها و منوی ناوبری موبایل داخل TopBar (جایگاه mobileMenu) استفاده کنید.',
      'همیشه عنوان روشن برای کشو مشخص کنید تا نام دسترس‌پذیر دیالوگ به درستی خوانده شود.',
    ],
    dont: [
      'برای هشدارهای مسدودکنندهٔ مخرب از Sheet استفاده نکنید؛ این کار بر عهدهٔ AlertDialog است.',
      'از جهت فیزیکی چپ/راست در API استفاده نکنید؛ همیشه start یا end را برگزینید.',
    ],
  },
  api: [
    {
      name: 'Sheet / Drawer',
      props: [
        { name: 'side', type: "'start' | 'end' | 'bottom'", default: "'start'", description: 'لبهٔ منطقی در دسکتاپ؛ زیر ۹۰۰ پیکسل همیشه bottom sheet.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'عرض کشو در دسکتاپ (۳۲۰، ۴۰۰ یا ۵۶۰ پیکسل).' },
        { name: 'title / description', type: 'ReactNode', description: 'عنوان و توضیح بالای کشو.' },
        { name: 'footer', type: 'ReactNode | ((close) => ReactNode)', description: 'بخش اقدام‌های پایین با پس‌زمینهٔ فرورفته.' },
        { name: 'showCloseButton', type: 'boolean', default: 'true', description: 'دکمهٔ بستن کشو با هدف لمسی ۴۴×۴۴ پیکسل.' },
        { name: 'isDismissable', type: 'boolean', default: 'true', description: 'امکان بستن با کلیک بیرون کشو.' },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab / Shift+Tab', action: 'حرکت درون تلهٔ فوکوس کشو.' },
    { keys: 'Escape', action: 'بستن کشو و بازگرداندن فوکوس به دکمهٔ محرک.' },
  ],
  a11y: [
    'ساخته‌شده روی ModalOverlay و Dialog با تلهٔ فوکوس، پنهان‌سازی پس‌زمینه برای صفحه‌خوان و بازگشت فوکوس.',
    'لایهٔ z-index برابر با --nds-z-modal (۴۰) است تا همیشه بالاتر از TopBar چسبان (--nds-z-sticky = ۱۰) قرار گیرد.',
    'دکمهٔ بستن دارای برچسب بومی «بستن کشو» و اندازهٔ لمسی حداقل ۴۴×۴۴ پیکسل است.',
  ],
  rtl: [
    'در چیدمان راست‌به‌چپ، side="start" از لبهٔ راست و side="end" از لبهٔ چپ وارد می‌شود و جهت انیمیشن با :dir(rtl) هماهنگ است.',
    'زیر ۹۰۰ پیکسل، هر سه مقدار side به برگهٔ پایینی یکپارچه تبدیل می‌شوند تا دسترسی با یک دست ساده بماند.',
  ],
};
