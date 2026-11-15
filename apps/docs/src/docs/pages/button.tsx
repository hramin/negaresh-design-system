import { iconArrowEnd, iconLock, iconMoon, iconTrash } from '@negaresh/icons';
import { Button, ButtonGroup, IconButton, LinkButton } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import ui from '../ui.module.css';

const VARIANTS = ['primary', 'secondary', 'ghost', 'danger'] as const;
const NAMES = { primary: 'اصلی', secondary: 'ثانویه', ghost: 'شفاف', danger: 'خطرناک' };

export const buttonDoc: ComponentDoc = {
  slug: 'button',
  title: 'دکمه',
  components: ['Button', 'LinkButton', 'IconButton'],
  base: 'Button, Link',
  summary:
    'برچسب با فعل شروع می‌شود و نتیجه را می‌گوید. در هر سطح حداکثر یک دکمهٔ اصلی. هدف لمسی همیشه دست‌کم ۴۴ پیکسل.',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  Example: () => (
    <ButtonGroup>
      <Button variant="primary" iconStart={iconLock}>
        پرداخت و ساخت کد
      </Button>
      <LinkButton href="#" variant="ghost">
        تماس با پشتیبانی
      </LinkButton>
    </ButtonGroup>
  ),
  Gallery: () => (
    <>
      <GalleryRow title="گونه‌ها — پیش‌فرض">
        {VARIANTS.map((v) => (
          <State key={v} label={v}>
            <Button variant={v} {...(v === 'danger' ? { iconStart: iconTrash } : {})}>
              {NAMES[v]}
            </Button>
          </State>
        ))}
      </GalleryRow>
      <GalleryRow title="گونه‌ها — غیرفعال">
        {VARIANTS.map((v) => (
          <State key={v} label={`${v} · isDisabled`}>
            <Button variant={v} isDisabled>
              {NAMES[v]}
            </Button>
          </State>
        ))}
      </GalleryRow>
      <GalleryRow title="در حال انجام (isPending)">
        {(['primary', 'secondary'] as const).map((v) => (
          <State key={v} label={`${v} · isPending`}>
            <Button variant={v} isPending>
              ساخت کد فعال‌سازی
            </Button>
          </State>
        ))}
      </GalleryRow>
      <GalleryRow title="اندازه‌ها">
        {(['sm', 'md', 'lg'] as const).map((s) => (
          <State key={s} label={`size="${s}" (${{ sm: '۴۰', md: '۴۸', lg: '۵۶' }[s]})`}>
            <Button variant="primary" size={s}>
              ادامه
            </Button>
          </State>
        ))}
      </GalleryRow>
      <GalleryRow title="آیکون و پیوند">
        <State label="iconEnd (قرینه در RTL)">
          <Button iconEnd={iconArrowEnd}>مرحلهٔ بعد</Button>
        </State>
        <State label="LinkButton">
          <LinkButton href="#" size="sm">
            فعال‌سازی‌های من
          </LinkButton>
        </State>
        <State label="IconButton ghost / secondary">
          <ButtonGroup>
            <IconButton icon={iconMoon} aria-label="تغییر به حالت تیره" />
            <IconButton icon={iconMoon} variant="secondary" aria-label="تغییر به حالت تیره" />
          </ButtonGroup>
        </State>
      </GalleryRow>
      <GalleryRow title="حالت‌های تعاملی (hover، pressed، focus-visible در آزمون تصویری با ماوس و کیبورد گرفته می‌شوند)">
        {(['primary', 'secondary', 'ghost'] as const).map((v) => (
          <State key={v} label={`${v} · تعاملی`}>
            <span className={ui.capture} data-interactive={v}>
              <Button variant={v}>{NAMES[v]}</Button>
            </span>
          </State>
        ))}
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      '«ساخت کد فعال‌سازی»، «پرداخت و ساخت کد»: فعل + نتیجه.',
      'برای ناوبری LinkButton، برای اقدام Button.',
      'در موبایل اقدام اصلی در نوار پایین با fullWidth.',
    ],
    dont: [
      'دو دکمهٔ اصلی در یک سطح.',
      'دکمهٔ آیکون بدون aria-label.',
      'غیرفعال کردن به‌جای توضیح؛ اگر کاری ممکن نیست، دلیلش را بنویسید.',
    ],
  },
  api: [
    {
      name: 'Button',
      props: [
        {
          name: 'variant',
          type: "'primary' | 'secondary' | 'ghost' | 'danger'",
          default: "'secondary'",
          description: 'گونهٔ دیداری.',
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          default: "'md'",
          description: '۴۰ / ۴۸ / ۵۶؛ sm هدف ۴۴ را نگه می‌دارد.',
        },
        {
          name: 'iconStart / iconEnd',
          type: 'IconDefinition',
          description: 'آیکون پیش یا پس از برچسب.',
        },
        {
          name: 'isPending',
          type: 'boolean',
          description: 'قابل فوکوس می‌ماند، فشار را نمی‌پذیرد و به صفحه‌خوان اعلام می‌شود.',
        },
        { name: 'isDisabled', type: 'boolean', description: 'غیرفعال.' },
        { name: 'fullWidth', type: 'boolean', description: 'تمام عرض (نوار اقدام موبایل).' },
        { name: 'onPress', type: '(e: PressEvent) => void', description: 'ماوس، لمس و کیبورد.' },
        {
          name: 'type',
          type: "'button' | 'submit' | 'reset'",
          default: "'button'",
          description: 'در حال انجام submit نمی‌کند.',
        },
      ],
    },
    {
      name: 'LinkButton',
      props: [
        {
          name: 'href',
          type: 'string',
          description: 'ظاهر دکمه، رفتار پیوند. بقیهٔ ویژگی‌ها مثل Button.',
        },
      ],
    },
    {
      name: 'IconButton',
      props: [
        { name: 'icon', type: 'IconDefinition', description: 'آیکون.' },
        { name: 'aria-label', type: 'string', description: 'الزامی.' },
        { name: 'variant', type: "'ghost' | 'secondary'", default: "'ghost'", description: '—' },
      ],
    },
  ],
  keyboard: [
    { keys: 'Enter / Space', action: 'اجرای دکمه' },
    { keys: 'Tab', action: 'رفتن به دکمهٔ بعدی' },
  ],
  a11y: [
    'حلقهٔ فوکوس ۲ پیکسل با فاصلهٔ ۲ روی خود دکمه (data-focus-visible).',
    'در حال انجام: aria-disabled و ProgressBar با برچسب «در حال انجام».',
    'رنگ تنها حامل معنا نیست؛ گونهٔ خطرناک آیکون و واژه دارد.',
  ],
  rtl: ['iconStart سمت راست برچسب است؛ آیکون‌های جهت‌دار قرینه می‌شوند.'],
};
