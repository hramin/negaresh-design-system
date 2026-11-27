import { iconDownload, iconEdit, iconTrash } from '@negaresh/icons';
import { BulkActionBar, Button, Inline, Stack, Text } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './data-display.module.css';

function Example() {
  const [selectedCount, setSelectedCount] = useState(3);
  const [status, setStatus] = useState<string>('');

  return (
    <div className={styles.wide} data-interactive="bulk-action-bar">
      <Stack gap="3">
        <Inline gap="2">
          <Button
            variant="secondary"
            size="sm"
            onPress={() => setSelectedCount((c) => Math.min(12, c + 1))}
          >
            افزودن یک ردیف
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => {
              setSelectedCount(3);
              setStatus('');
            }}
          >
            بازنشانی به ۳ مورد
          </Button>
        </Inline>

        <BulkActionBar
          selectedCount={selectedCount}
          totalCount={12}
          onSelectAll={() => {
            setSelectedCount(12);
            setStatus('همهٔ ۱۲ مورد انتخاب شدند.');
          }}
          onClearSelection={() => {
            setSelectedCount(0);
            setStatus('انتخاب لغو شد.');
          }}
        >
          <Button
            variant="secondary"
            size="sm"
            iconStart={iconEdit}
            onPress={() => setStatus('پنجرهٔ تغییر سقف گروهی باز شد.')}
          >
            تغییر سقف
          </Button>
          <Button
            variant="secondary"
            size="sm"
            iconStart={iconDownload}
            onPress={() => setStatus('خروجی CSV آماده شد.')}
          >
            خروجی CSV
          </Button>
          <Button
            variant="danger"
            size="sm"
            iconStart={iconTrash}
            onPress={() => setStatus('تأییدیهٔ ابطال گروهی درخواست شد.')}
          >
            ابطال انتخاب‌شده‌ها
          </Button>
        </BulkActionBar>

        {status && (
          <Text size="xs" tone="muted" className={styles.output}>
            {status}
          </Text>
        )}
      </Stack>
    </div>
  );
}

export const bulkActionBarDoc: ComponentDoc = {
  slug: 'bulk-action-bar',
  title: 'نوار اقدام‌های گروهی (BulkActionBar)',
  components: ['BulkActionBar'],
  base: 'React Aria Toolbar',
  summary:
    'نوار زمینه‌ای بر پایهٔ React Aria Toolbar که پس از انتخاب ردیف‌ها در جدول یا فهرست ظاهر می‌شود، شمارش فارسی موارد انتخاب‌شده را اعلام می‌کند و اقدام‌های گروهی و لغو انتخاب را در یک توقف Tab در دسترس قرار می‌دهد.',
  status: 'approved',
  products: ['R', 'N', 'T'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="انتخاب جزئی (با گزینهٔ انتخاب همه)">
        <State label="selectedCount = 3 · totalCount = 12">
          <div className={styles.wide}>
            <BulkActionBar
              selectedCount={3}
              totalCount={12}
              onSelectAll={() => undefined}
              onClearSelection={() => undefined}
            >
              <Button variant="secondary" size="sm" iconStart={iconEdit}>
                تغییر سقف
              </Button>
              <Button variant="secondary" size="sm" iconStart={iconDownload}>
                خروجی CSV
              </Button>
              <Button variant="danger" size="sm" iconStart={iconTrash}>
                ابطال
              </Button>
            </BulkActionBar>
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="همه انتخاب‌شده (بدون دکمهٔ انتخاب همه)">
        <State label="selectedCount = 12 · totalCount = 12">
          <div className={styles.wide}>
            <BulkActionBar
              selectedCount={12}
              totalCount={12}
              onSelectAll={() => undefined}
              onClearSelection={() => undefined}
            >
              <Button variant="secondary" size="sm" iconStart={iconDownload}>
                خروجی کامل
              </Button>
            </BulkActionBar>
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'BulkActionBar را درست بالای DataTable یا GridList بگذارید تا تنها هنگام وجود انتخاب ظاهر شود.',
      'برای اقدام‌های مخرب (مانند ابطال گروهی سریال‌ها) از AlertDialog جهت تأیید استفاده کنید.',
      'همیشه onClearSelection را متصل کنید تا کاربر با یک کلیک یا صفحه‌کلید انتخاب را پاک کند.',
    ],
    dont: [
      'اقدام‌های غیرمرتبط با ردیف‌های انتخاب‌شده (مانند «ساخت مورد جدید») را درون BulkActionBar قرار ندهید.',
    ],
  },
  keyboard: [
    { keys: 'Tab', action: 'ورود به نوار اقدام‌های گروهی با یک توقف Tab.' },
    { keys: 'ArrowLeft / ArrowRight', action: 'حرکت بین دکمه‌های اقدام در جهت راست‌به‌چپ.' },
    { keys: 'Enter / Space', action: 'اجرای اقدام متمرکز یا لغو انتخاب.' },
  ],
  a11y: [
    'شمارندهٔ موارد انتخاب‌شده درون role="status" با aria-live="polite" اعلام می‌شود.',
    'سطح انتخاب‌شده از توکن‌های معنایی --nds-bg-selected و حاشیهٔ --nds-accent-default بدون سایهٔ استراحت (D-77) بهره می‌برد.',
  ],
  rtl: [
    'جهت‌یابی کلیدهای پیکان در React Aria Toolbar به طور خودکار با dir="rtl" منطبق است.',
  ],
};
