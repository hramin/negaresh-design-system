import { Avatar, AvatarGroup, Inline, Stack } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './overlays.module.css';

const PORTRAIT_TEAL =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="%23dcecea"/><circle cx="48" cy="36" r="16" fill="%231d6b66"/><path d="M20 84c4-18 16-26 28-26s24 8 28 26" fill="%231d6b66"/></svg>';

const PORTRAIT_SAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="%23e7f0e6"/><circle cx="48" cy="36" r="16" fill="%23355c34"/><path d="M20 84c4-18 16-26 28-26s24 8 28 26" fill="%23355c34"/></svg>';

function Example() {
  return (
    <div className={styles.block} data-interactive="avatar">
      <Stack gap="4">
        <Inline gap="3">
          <Avatar src={PORTRAIT_TEAL} name="دکتر سارا رضایی" size="lg" />
          <Avatar name="دکتر آرش نادری" tone="accent" size="lg" />
          <Avatar name="مریم کاظمی" tone="success" size="lg" />
          <Avatar alt="کاربر مهمان" size="lg" />
        </Inline>
        <AvatarGroup max={4} size="md" aria-label="اعضای کارگروه تخصصی">
          <Avatar src={PORTRAIT_TEAL} name="دکتر سارا رضایی" />
          <Avatar src={PORTRAIT_SAGE} name="دکتر مریم کاظمی" />
          <Avatar name="آرش نادری" tone="accent" />
          <Avatar name="نیلوفر امینی" tone="info" />
          <Avatar name="کاوه شریفی" />
          <Avatar name="الهام حسینی" />
          <Avatar name="پویا مرادی" />
        </AvatarGroup>
      </Stack>
    </div>
  );
}

export const avatarDoc: ComponentDoc = {
  slug: 'avatar',
  title: 'تصویر نمایه (Avatar / AvatarGroup)',
  components: ['Avatar', 'AvatarGroup'],
  summary:
    'نمایش تصویر نمایه با جایگزین خودکار حروف اول نام فارسی (بدون چسبندگی حروف)، جایگزین آیکون کاربر و گروه هم‌پوشان با شمارندهٔ فارسی سرریز (formatNumber).',
  status: 'review',
  products: ['N', 'T'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="اندازه‌ها">
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
          <State key={size} label={size}>
            <Avatar name="سارا رضایی" size={size} tone="accent" />
          </State>
        ))}
      </GalleryRow>
      <GalleryRow title="حالت‌ها و لحن‌ها">
        <State label="تصویر">
          <Avatar src={PORTRAIT_TEAL} name="دکتر سارا رضایی" />
        </State>
        <State label="حروف اول خنثی">
          <Avatar name="دکتر مریم کاظمی" tone="neutral" />
        </State>
        <State label="لحن تاکیدی (accent)">
          <Avatar name="آرش نادری" tone="accent" />
        </State>
        <State label="لحن اطلاع (info)">
          <Avatar name="نیلوفر امینی" tone="info" />
        </State>
        <State label="لحن موفق (success)">
          <Avatar name="کاوه شریفی" tone="success" />
        </State>
        <State label="جایگزین آیکون">
          <Avatar alt="حساب بدون نام" />
        </State>
      </GalleryRow>
      <GalleryRow title="گروه نمایه‌ها (AvatarGroup)">
        <State label="حداکثر ۳ مورد + سرریز فارسی">
          <AvatarGroup max={3} aria-label="پژوهشگران همکار">
            <Avatar src={PORTRAIT_TEAL} name="سارا رضایی" />
            <Avatar name="آرش نادری" tone="accent" />
            <Avatar src={PORTRAIT_SAGE} name="مریم کاظمی" />
            <Avatar name="نیلوفر امینی" />
            <Avatar name="کاوه شریفی" />
            <Avatar name="پویا مرادی" />
          </AvatarGroup>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'همیشه name را بدهید تا در نبود تصویر یا خطای بارگذاری، حروف اول فارسی و نام دسترس‌پذیر ساخته شود.',
      'اگر نام شخص در کنار Avatar به صورت متن خوانا آمده است، alt="" بگذارید تا صفحه‌خوان نام را دو بار نخواند.',
    ],
    dont: [
      'حروف فارسی را بدون فاصله کنار هم نگذارید؛ Avatar به طور خودکار بین دو حرف فارسی فاصله می‌گذارد تا به واژهٔ ناخواسته نچسبند.',
    ],
  },
  api: [
    {
      name: 'Avatar',
      props: [
        { name: 'src', type: 'string', description: 'نشانی تصویر نمایه؛ در خطای بارگذاری به حروف اول برمی‌گردد.' },
        { name: 'name', type: 'string', description: 'نام کامل برای استخراج حروف اول و alt پیش‌فرض.' },
        { name: 'alt', type: 'string', description: 'متن جایگزین؛ برای حالت تزئینی کنار نام، alt="" بدهید.' },
        { name: 'initials', type: 'string', description: 'جایگزین دستی برای حروف اول.' },
        { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'قطر نمایه (۲۴ تا ۶۴ پیکسل).' },
        { name: 'tone', type: "'neutral' | 'accent' | 'info' | 'success'", default: "'neutral'", description: 'لحن پس‌زمینه در حالت حروف اول.' },
      ],
    },
    {
      name: 'AvatarGroup',
      props: [
        { name: 'max', type: 'number', description: 'حداکثر تعداد نمایه‌های آشکار پیش از نشان سرریز.' },
        { name: 'total', type: 'number', description: 'شمار کل اعضا در صورت ارسال زیرمجموعه.' },
        { name: 'size', type: 'AvatarSize', default: "'md'", description: 'اندازهٔ هماهنگ همهٔ اعضا و شمارنده.' },
        { name: 'aria-label', type: 'string', description: 'نام دسترس‌پذیر گروه.' },
      ],
    },
  ],
  a11y: [
    'نشان سرریز دارای برچسب خوانا برای صفحه‌خوان («۳ نفر دیگر») است و عدد نمایشی با formatNumber به ارقام فارسی تبدیل می‌شود.',
    'عنوان‌های رایج فارسی مانند «دکتر» هنگام استخراج حروف اول نادیده گرفته می‌شوند.',
  ],
  rtl: [
    'هم‌پوشانی در AvatarGroup با margin-inline-start منفی انجام می‌شود و در فارسی از راست به چپ چیده می‌شود.',
    'شمارندهٔ +۳ در جزیرهٔ LTR ایزوله می‌شود تا علامت + و رقم فارسی جابه‌جا نشوند.',
  ],
};
