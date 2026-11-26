import { iconCopy, iconLaptop, iconTrash } from '@negaresh/icons';
import {
  Avatar,
  Badge,
  Code,
  GridList,
  GridListItem,
  Icon,
  IconButton,
  List,
  ListItem,
  Stack,
  StatusBadge,
  Text,
} from '@negaresh/react';
import { formatNumber } from '@negaresh/utils';
import { useState } from 'react';
import type { Selection } from 'react-aria-components';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './data-display.module.css';

const DEVICES = [
  { id: 'pc-1', name: 'رایانهٔ اتاق مشاوره ۱', os: 'ویندوز ۱۱ · ۲۲ آبان ۱۴۰۵', code: '882859354', active: true },
  { id: 'pc-2', name: 'رایانهٔ پذیرش کلینیک', os: 'ویندوز ۱۰ · ۱۵ آبان ۱۴۰۵', code: '419022108', active: true },
  { id: 'pc-3', name: 'لپ‌تاپ پژوهشگر', os: 'ویندوز ۱۱ · ۳ آبان ۱۴۰۵', code: '731048912', active: false },
];

function Example() {
  const [selected, setSelected] = useState<Selection>(new Set(['pc-1']));
  const [lastAction, setLastAction] = useState<string | null>(null);
  const count = selected === 'all' ? DEVICES.length : selected.size;

  return (
    <div className={styles.block} data-interactive="list">
      <Stack gap="3">
        <GridList
          aria-label="رایانه‌های فعال‌شده"
          selectionMode="multiple"
          selectedKeys={selected}
          onSelectionChange={setSelected}
        >
          {DEVICES.map((d) => (
            <GridListItem
              key={d.id}
              id={d.id}
              title={d.name}
              description={d.os}
              leading={<Icon icon={iconLaptop} size="sm" />}
              meta={
                <>
                  <Code>{d.code}</Code>
                  <StatusBadge
                    domain="serial"
                    status={d.active ? 'active' : 'revoked'}
                    size="sm"
                  />
                </>
              }
              actions={
                <IconButton
                  icon={iconCopy}
                  variant="ghost"
                  size="sm"
                  aria-label={`کپی کد ${d.name}`}
                  onPress={() => setLastAction(`کد ${d.code} آمادهٔ کپی شد.`)}
                />
              }
            />
          ))}
        </GridList>
        <Text size="xs" tone="muted" className={styles.output}>
          انتخاب‌شده: {formatNumber(count, { maximumFractionDigits: 0 })} مورد
          {lastAction ? ` · ${lastAction}` : ''}
        </Text>
      </Stack>
    </div>
  );
}

export const listDoc: ComponentDoc = {
  slug: 'list',
  title: 'فهرست انتخاب‌پذیر (List · GridList)',
  components: ['GridList', 'GridListItem', 'List', 'ListItem'],
  base: 'React Aria GridList',
  summary:
    'فهرست ردیف‌های انتخاب‌پذیر روی React Aria GridList با ناوبری کامل صفحه‌کلید، اسلات‌های آیکون/آواتار، فراداده و دکمه‌های اقدام، همراه با حالت‌های خالی و بارگذاری.',
  status: 'review',
  products: ['R', 'N', 'T', 'V'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="انتخاب چندتایی با آیکون و اقدام ردیف">
        <State label="multiple selection · comfortable">
          <div className={styles.block}>
            <GridList
              aria-label="گالری فهرست چندانتخابی"
              selectionMode="multiple"
              defaultSelectedKeys={['dev-1']}
            >
              <GridListItem
                id="dev-1"
                title="رایانهٔ اتاق تست ۱"
                description="ویندوز ۱۱ · آخرین اتصال ۲ ساعت پیش"
                leading={<Icon icon={iconLaptop} size="sm" />}
                meta={<Code>882859354</Code>}
                actions={
                  <IconButton
                    icon={iconTrash}
                    variant="ghost"
                    size="sm"
                    aria-label="حذف رایانهٔ ۱"
                  />
                }
              />
              <GridListItem
                id="dev-2"
                title="رایانهٔ اتاق تست ۲"
                description="ویندوز ۱۰ · غیرفعال"
                leading={<Icon icon={iconLaptop} size="sm" />}
                meta={<Badge tone="neutral" size="sm">غیرفعال</Badge>}
                isDisabled
              />
            </GridList>
          </div>
        </State>
      </GalleryRow>
      <GalleryRow title="تراکم فشرده (اعضای سازمان) و حالت خالی / بارگذاری">
        <State label="compact · empty · loading">
          <div className={styles.block}>
            <Stack gap="4">
              <List aria-label="اعضای کلینیک" density="compact">
                <ListItem
                  id="u1"
                  title="دکتر سارا رضایی"
                  description="روان‌شناس بالینی"
                  leading={<Avatar name="سارا رضایی" size="sm" />}
                  meta={<Badge tone="accent" size="sm">مدیر</Badge>}
                />
                <ListItem
                  id="u2"
                  title="مهدی نادری"
                  description="آزمون‌گر"
                  leading={<Avatar name="مهدی نادری" size="sm" />}
                />
              </List>
              <List aria-label="فهرست خالی" items={[]}>
                {() => null}
              </List>
              <List aria-label="فهرست در حال بارگذاری" isLoading loadingCount={2}>
                {null}
              </List>
            </Stack>
          </div>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای فهرست‌های تک‌ستونه با امکان انتخاب، ناوبری با جهت‌نماها یا اقدام درون ردیف (مانند دستگاه‌های فعال یا اعضای سازمان) از GridList / List استفاده کنید.',
      'کدهای سیستم و سریال را در اسلات meta درون <Code> بگذارید.',
      'هر دکمهٔ اقدام درون ردیف حداقل هدف لمسی ۴۴×۴۴ پیکسل داشته باشد.',
    ],
    dont: [
      'برای داده‌های چندستونه که نیاز به مرتب‌سازی و مقایسهٔ ستونی دارند از List استفاده نکنید؛ از DataTable بهره ببرید.',
    ],
  },
  api: [
    {
      name: 'GridList / List',
      props: [
        { name: 'selectionMode', type: "'none' | 'single' | 'multiple'", default: "'none'", description: 'فعال‌سازی انتخاب تکی یا چندتایی با چک‌باکس داخلی.' },
        { name: 'selectedKeys / defaultSelectedKeys / onSelectionChange', type: 'Selection', description: 'مدیریت کلیدهای انتخاب‌شده.' },
        { name: 'onAction', type: '(key: Key) => void', description: 'اقدام هنگام فعال‌سازی ردیف.' },
        { name: 'density', type: "'comfortable' | 'compact'", default: "'comfortable'", description: 'تراکم عمودی ردیف‌ها.' },
        { name: 'divided / bordered', type: 'boolean', default: 'true / true', description: 'جداکنندهٔ مویی بین ردیف‌ها و قاب سطح بیرونی.' },
        { name: 'isLoading / emptyState', type: 'boolean / ReactNode', description: 'حالت بارگذاری اسکلتون و نمای خالی.' },
      ],
    },
    {
      name: 'GridListItem / ListItem',
      props: [
        { name: 'id', type: 'Key', description: 'شناسهٔ یکتای ردیف.' },
        { name: 'title / description', type: 'ReactNode', description: 'عنوان و توضیح ردیف.' },
        { name: 'leading / meta / actions', type: 'ReactNode', description: 'اسلات‌های آیکون/آواتار، فراداده و اقدام‌های انتهای سطر.' },
        { name: 'isDisabled / href / onAction', type: 'boolean / string / () => void', description: 'غیرفعال‌سازی یا ناوبری ردیف.' },
      ],
    },
  ],
  keyboard: [
    { keys: 'ArrowDown / ArrowUp', action: 'حرکت بین ردیف‌ها با roving tabindex.' },
    { keys: 'Space', action: 'تغییر وضعیت انتخاب ردیف.' },
    { keys: 'Enter', action: 'اجرای اقدام یا پیوند ردیف.' },
    { keys: 'Tab', action: 'حرکت به دکمه‌های اقدام داخل ردیف متمرکز.' },
  ],
  a11y: [
    'بر پایهٔ React Aria GridList ساخته شده و برچسب‌های خوانشگر فارسی (@react-aria/grid و @react-aria/gridlist) را از D-97 به کار می‌برد.',
    'چک‌باکس انتخاب ردیف هدف لمسی ۴۴×۴۴ پیکسل و حلقهٔ تمرکز واضح دارد.',
  ],
  rtl: [
    'چک‌باکس و اسلات leading در آغاز سطر (راست) و meta/actions در پایان سطر (چپ) چیده می‌شوند و در موبایل بدون سرریز خط‌شکنی می‌کنند.',
  ],
};
