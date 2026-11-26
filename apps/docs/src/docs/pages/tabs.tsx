import { iconFile, iconSettings, iconShield, iconUsers } from '@negaresh/icons';
import { Stack, Tab, TabList, TabPanel, Tabs, Text } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './navigation.module.css';

function Example() {
  return (
    <div className={styles.block} data-interactive="tabs">
      <Stack gap="6">
        <Tabs defaultSelectedKey="overview">
          <TabList aria-label="بخش‌های پروندهٔ سریال">
            <Tab id="overview" icon={iconFile}>
              مشخصات
            </Tab>
            <Tab id="activations" icon={iconShield} badge={3}>
              فعال‌سازی‌ها
            </Tab>
            <Tab id="users" icon={iconUsers}>
              دسترسی‌ها
            </Tab>
            <Tab id="advanced" icon={iconSettings} isDisabled>
              تنظیمات قفل‌شده
            </Tab>
          </TabList>
          <TabPanel id="overview">
            <div className={styles.panelBox}>
              <Text as="p" size="sm" leading="text">
                اطلاعات پایهٔ سریال، تاریخ صدور و محصول متصل در این زبانه نمایش داده می‌شود.
              </Text>
            </div>
          </TabPanel>
          <TabPanel id="activations">
            <div className={styles.panelBox}>
              <Text as="p" size="sm" leading="text">
                ۳ رایانه با این سریال فعال شده‌اند؛ نصب دوباره روی همان رایانه سقف را مصرف نمی‌کند.
              </Text>
            </div>
          </TabPanel>
          <TabPanel id="users">
            <div className={styles.panelBox}>
              <Text as="p" size="sm" leading="text">
                فهرست کلینیک‌ها و کارشناسان مجاز به مشاهدهٔ این سریال.
              </Text>
            </div>
          </TabPanel>
          <TabPanel id="advanced">
            <div className={styles.panelBox}>
              <Text as="p" size="sm">
                تنظیمات پیشرفته.
              </Text>
            </div>
          </TabPanel>
        </Tabs>

        <Tabs orientation="vertical" defaultSelectedKey="leaf-summary">
          <TabList aria-label="بخش‌های برگ سوم روانما">
            <Tab id="leaf-summary">خلاصهٔ نیم‌رخ</Tab>
            <Tab id="leaf-scales" badge={5}>
              مقیاس‌ها
            </Tab>
            <Tab id="leaf-notes">تفسیر بالینی</Tab>
          </TabList>
          <TabPanel id="leaf-summary">
            <div className={styles.panelBox}>
              <Text as="p" size="sm" leading="text">
                نمای زبانه‌های عمودی برای برگ سوم روانما و صفحات تنظیمات چندبخشی.
              </Text>
            </div>
          </TabPanel>
          <TabPanel id="leaf-scales">
            <div className={styles.panelBox}>
              <Text as="p" size="sm" leading="text">
                پنج مقیاس اصلی با نمرهٔ تراز و باند تفسیری.
              </Text>
            </div>
          </TabPanel>
          <TabPanel id="leaf-notes">
            <div className={styles.panelBox}>
              <Text as="p" size="sm" leading="text">
                متن تفسیر متناسب با سطح خواننده (حرفه‌ای یا آرام).
              </Text>
            </div>
          </TabPanel>
        </Tabs>
      </Stack>
    </div>
  );
}

export const tabsDoc: ComponentDoc = {
  slug: 'tabs',
  title: 'زبانه‌ها (Tabs)',
  components: ['Tabs', 'TabList', 'Tab', 'TabPanel'],
  summary:
    'زبانه‌های دسترس‌پذیر ساخته‌شده روی React Aria Tabs با جهت افقی و عمودی (برگ سوم روانما)، پیمایش کیبورد راست‌به‌چپ، نشان فارسی و دو سبک underline و pill.',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  base: 'React Aria Tabs / TabList / Tab / TabPanel',
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="افقی · زیرخط (underline) و قرصی (pill)">
        <State label="horizontal · underline">
          <div className={styles.block}>
            <Tabs defaultSelectedKey="a">
              <TabList aria-label="زبانه‌های افقی زیرخط">
                <Tab id="a">فعال‌سازی</Tab>
                <Tab id="b" badge={4}>
                  تاریخچه
                </Tab>
                <Tab id="c" isDisabled>
                  بایگانی
                </Tab>
              </TabList>
              <TabPanel id="a">
                <div className={styles.panelBox}>
                  <Text size="sm">محتوای زبانهٔ فعال‌سازی.</Text>
                </div>
              </TabPanel>
              <TabPanel id="b">
                <div className={styles.panelBox}>
                  <Text size="sm">محتوای تاریخچه.</Text>
                </div>
              </TabPanel>
              <TabPanel id="c">
                <div className={styles.panelBox}>
                  <Text size="sm">محتوای بایگانی.</Text>
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </State>
        <State label="horizontal · pill">
          <div className={styles.block}>
            <Tabs variant="pill" defaultSelectedKey="pro">
              <TabList aria-label="زبانه‌های قرصی">
                <Tab id="pro">نمای حرفه‌ای</Tab>
                <Tab id="calm">نمای آرام</Tab>
              </TabList>
              <TabPanel id="pro">
                <div className={styles.panelBox}>
                  <Text size="sm">نمایش نمره‌های تراز و بازهٔ اطمینان برای متخصص.</Text>
                </div>
              </TabPanel>
              <TabPanel id="calm">
                <div className={styles.panelBox}>
                  <Text size="sm">نمایش ساده و آرام برای نوجوان و خانواده.</Text>
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="عمودی (برگ سوم روانما)">
        <State label="vertical · underline">
          <div className={styles.block}>
            <Tabs orientation="vertical" defaultSelectedKey="v1">
              <TabList aria-label="زبانه‌های عمودی">
                <Tab id="v1">بخش اول</Tab>
                <Tab id="v2" badge={2}>
                  بخش دوم
                </Tab>
                <Tab id="v3">بخش سوم</Tab>
              </TabList>
              <TabPanel id="v1">
                <div className={styles.panelBox}>
                  <Text size="sm">در عرض زیر ۶۰۰ پیکسل به صورت خودکار تک‌ستونه می‌شود.</Text>
                </div>
              </TabPanel>
              <TabPanel id="v2">
                <div className={styles.panelBox}>
                  <Text size="sm">محتوای بخش دوم.</Text>
                </div>
              </TabPanel>
              <TabPanel id="v3">
                <div className={styles.panelBox}>
                  <Text size="sm">محتوای بخش سوم.</Text>
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای نمایش نماهای هم‌موضوع در یک صفحه (بدون بارگذاری مجدد) از Tabs استفاده کنید.',
      'برای فهرست‌های تنظیمات و برگ سوم روانما orientation="vertical" را انتخاب کنید.',
    ],
    dont: [
      'برای ناوبری اصلی بین صفحات مستقل از Tabs استفاده نکنید؛ آن کار TopBar یا SideNav است.',
    ],
  },
  api: [
    {
      name: 'Tabs',
      props: [
        { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'جهت چیدمان و پیمایش کیبورد.' },
        { name: 'variant', type: "'underline' | 'pill'", default: "'underline'", description: 'سبک نمایشی زبانه‌ها (بدون سایهٔ ساکن).' },
        { name: 'selectedKey / defaultSelectedKey / onSelectionChange', type: 'Key / Key / (key: Key) => void', description: 'مدیریت کنترل‌شده یا غیرکنترل‌شدهٔ زبانهٔ فعال.' },
        { name: 'keyboardActivation', type: "'automatic' | 'manual'", default: "'automatic'", description: 'فعال‌سازی فوری با کلید جهت‌دار یا با Enter/Space.' },
      ],
    },
    {
      name: 'Tab / TabPanel',
      props: [
        { name: 'id', type: 'Key', description: 'شناسهٔ مشترک میان Tab و TabPanel متناظر.' },
        { name: 'icon / badge / isDisabled', type: 'IconDefinition / ReactNode | number / boolean', description: 'آیکن، نشان فارسی و وضعیت غیرفعال روی Tab.' },
      ],
    },
  ],
  keyboard: [
    { keys: 'ArrowLeft / ArrowRight', action: 'حرکت بین زبانه‌های افقی در راست‌به‌چپ (ArrowLeft = بعدی، ArrowRight = قبلی).' },
    { keys: 'ArrowDown / ArrowUp', action: 'حرکت بین زبانه‌های عمودی.' },
    { keys: 'Home / End', action: 'پرش به نخستین یا آخرین زبانه.' },
  ],
  a11y: [
    'نقش‌های tablist / tab / tabpanel و پیوند aria-controls / aria-labelledby توسط React Aria مدیریت می‌شود.',
    'هر زبانه حداقل ۴۴ پیکسل ارتفاع لمسی و حلقهٔ فوکوس ۲ پیکسلی دارد.',
  ],
  rtl: [
    'جهت کلیدهای چپ و راست در حالت افقی به صورت خودکار توسط I18nProvider فارسی معکوس می‌شود.',
  ],
};
