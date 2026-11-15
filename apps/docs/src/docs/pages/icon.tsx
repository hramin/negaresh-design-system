import {
  iconArrowEnd,
  iconCheck,
  iconChevronEnd,
  iconCopy,
  iconHelp,
  iconSend,
} from '@negaresh/icons';
import { Icon, Inline, Text } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';

export const iconDoc: ComponentDoc = {
  slug: 'icon',
  title: 'آیکون',
  components: ['Icon'],
  summary:
    'آیکون‌های خطی روی شبکهٔ ۲۴، ضخامت خط از توکن، رنگ از متن. آیکون‌های جهت‌دار در راست‌به‌چپ قرینه می‌شوند.',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  Example: () => (
    <Inline gap="4">
      <Icon icon={iconCopy} />
      <Icon icon={iconHelp} />
      <Icon icon={iconChevronEnd} />
      <Text size="sm" tone="muted">
        فهرست کامل در «آیکون‌ها»
      </Text>
    </Inline>
  ),
  Gallery: () => (
    <>
      <GalleryRow title="اندازه‌ها">
        {(['sm', 'md', 'lg'] as const).map((s) => (
          <State key={s} label={`${s} (${{ sm: '۱۶', md: '۲۰', lg: '۲۴' }[s]})`}>
            <Icon icon={iconCheck} size={s} />
          </State>
        ))}
      </GalleryRow>
      <GalleryRow title="قرینه در راست‌به‌چپ (mirrored)">
        <State label="chevronEnd">
          <Icon icon={iconChevronEnd} />
        </State>
        <State label="arrowEnd">
          <Icon icon={iconArrowEnd} />
        </State>
        <State label="send">
          <Icon icon={iconSend} />
        </State>
      </GalleryRow>
      <GalleryRow title="رنگ از متن">
        <State label="accent">
          <Text tone="accent">
            <Icon icon={iconCheck} />
          </Text>
        </State>
        <State label="danger">
          <Text tone="danger">
            <Icon icon={iconHelp} label="راهنما" />
          </Text>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'کنار متن تزئینی است (aria-hidden)؛ فقط وقتی تنهاست label بدهید.',
      'برای «بعدی» chevronEnd؛ در فارسی به چپ اشاره می‌کند.',
    ],
    dont: ['ایموجی در رابط.', 'رنگ یا ضخامت خط دستی.'],
  },
  api: [
    {
      name: 'Icon',
      props: [
        { name: 'icon', type: 'IconDefinition', description: 'از @negaresh/icons، مثلاً iconCopy.' },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          default: "'md'",
          description: '۱۶، ۲۰، ۲۴ پیکسل.',
        },
        {
          name: 'label',
          type: 'string',
          description: 'نام دسترس‌پذیر وقتی آیکون معنای مستقل دارد (role="img").',
        },
      ],
    },
  ],
  a11y: [
    'بدون label، aria-hidden="true" و focusable="false".',
    'آیکون تنها در دکمه را با IconButton و aria-label بسازید.',
  ],
  rtl: ['آیکون‌های mirrored با :dir(rtl) قرینه می‌شوند؛ ساعت، تیک و پخش قرینه نمی‌شوند.'],
};
