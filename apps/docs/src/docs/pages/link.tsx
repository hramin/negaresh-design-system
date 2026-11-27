import { Link, Stack, Text } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import ui from '../ui.module.css';

export const linkDoc: ComponentDoc = {
  slug: 'link',
  title: 'پیوند',
  components: ['Link'],
  base: 'Link',
  summary:
    'پیوند همیشه زیرخط دارد تا فقط به رنگ وابسته نباشد. پیوند بیرونی آیکون و توضیح پنهان «در زبانهٔ تازه باز می‌شود» دارد.',
  status: 'approved',
  products: ['R', 'N', 'T', 'V'],
  Example: () => (
    <Text as="p" leading="text">
      اگر همان رایانه را دوباره نصب کرده‌اید، <Link href="#">راهنمای نصب دوباره</Link> را ببینید یا
      به{' '}
      <Link href="https://negaresh.ir" external>
        سایت نگارش
      </Link>{' '}
      بروید.
    </Text>
  ),
  Gallery: () => (
    <>
      <GalleryRow title="گونه‌ها">
        <State label="inline">
          <Text>
            متن با <Link href="#">پیوند</Link>
          </Text>
        </State>
        <State label="standalone">
          <Link href="#" variant="standalone">
            مشاهدهٔ همهٔ خریدها
          </Link>
        </State>
        <State label="external">
          <Link href="https://negaresh.ir" external>
            سایت نگارش
          </Link>
        </State>
        <State label="isDisabled">
          <Link href="#" isDisabled>
            غیرفعال
          </Link>
        </State>
      </GalleryRow>
      <GalleryRow title="حالت‌های تعاملی">
        <State label="inline · تعاملی">
          <span className={ui.capture} data-interactive="link">
            <Stack>
              <Link href="#">پیوند</Link>
            </Stack>
          </span>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: ['متن پیوند مقصد را بگوید: «راهنمای نصب دوباره»، نه «اینجا».'],
    dont: ['پیوند برای اقدام (ارسال، حذف)؛ آن دکمه است.'],
  },
  keyboard: [{ keys: 'Enter', action: 'باز کردن پیوند' }],
  a11y: ['زیرخط همیشگی (WCAG 1.4.1).', 'متن «در زبانهٔ تازه باز می‌شود» از کاتالوگ پیام‌ها.'],
  rtl: ['آیکون پیوند بیرونی قرینه می‌شود.'],
};
