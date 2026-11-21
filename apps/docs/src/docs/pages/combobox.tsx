import { Autocomplete, ComboBox, ComboBoxItem, Stack, Text } from '@negaresh/react';
import { useEffect, useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './fields.module.css';

interface TopicOption {
  id: string;
  label: string;
  group: string;
}

const INITIAL_TOPICS: TopicOption[] = [
  { id: 'cbt', label: 'درمان شناختی-رفتاری', group: 'درمان' },
  { id: 'act', label: 'درمان مبتنی بر پذیرش و تعهد', group: 'درمان' },
  { id: 'child', label: 'ارزیابی رشد کودک', group: 'ارزیابی' },
  { id: 'neo', label: 'آزمون شخصیت نئو', group: 'آزمون' },
];

function Example() {
  const [topics, setTopics] = useState<TopicOption[]>(INITIAL_TOPICS);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filtered, setFiltered] = useState<TopicOption[]>(INITIAL_TOPICS);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setFiltered(topics);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const timer = window.setTimeout(() => {
      setFiltered(topics.filter((t) => t.label.includes(trimmed)));
      setIsLoading(false);
    }, 180);
    return () => window.clearTimeout(timer);
  }, [query, topics]);

  return (
    <div className={styles.example} data-interactive="combobox">
      <Stack gap="4">
        <Autocomplete
          label="جست‌وجو یا افزودن موضوع"
          description="نام موضوع را تایپ کنید؛ اگر وجود نداشت می‌توانید مورد تازه بسازید."
          placeholder="مثلاً: روان‌سنجی نوجوان"
          items={filtered}
          inputValue={query}
          onInputChange={setQuery}
          value={selected}
          onChange={(key) => setSelected(key === null ? null : String(key))}
          isLoading={isLoading}
          onCreateOption={(value) => {
            const next: TopicOption = {
              id: `custom-${topics.length + 1}`,
              label: value,
              group: 'سفارشی',
            };
            setTopics((prev) => [...prev, next]);
            setSelected(next.id);
            setQuery(value);
          }}
        >
          {(item) => (
            <ComboBoxItem id={item.id} textValue={item.label} description={item.group}>
              {item.label}
            </ComboBoxItem>
          )}
        </Autocomplete>
        <Text size="sm" tone="muted">
          شناسهٔ انتخاب‌شده: {selected ?? 'هنوز انتخاب نشده'}
        </Text>
      </Stack>
    </div>
  );
}

export const comboBoxDoc: ComponentDoc = {
  slug: 'combobox',
  title: 'فیلد جست‌وجو و انتخاب',
  components: ['ComboBox', 'Autocomplete', 'ComboBoxItem', 'ComboBoxSection', 'ComboBoxSeparator'],
  base: 'ComboBox, Popover, ListBox',
  summary:
    'ورودی متنی همراه با فهرست پیشنهادی پالایش‌پذیر؛ مناسب فهرست‌های بلند، بارگذاری ناهم‌زمان (async) و ساخت گزینهٔ تازه.',
  status: 'review',
  products: ['N', 'T'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="حالت‌های ورودی">
        <State label="خالی">
          <ComboBox
            className={styles.field}
            label="آزمون روان‌شناختی"
            placeholder="نام آزمون را بنویسید"
          >
            <ComboBoxItem id="neo">آزمون نئو</ComboBoxItem>
            <ComboBoxItem id="beck">افسردگی بک</ComboBoxItem>
          </ComboBox>
        </State>
        <State label="انتخاب‌شده">
          <ComboBox
            className={styles.field}
            label="آزمون روان‌شناختی"
            defaultValue="neo"
            defaultInputValue="آزمون نئو"
            description="نام یا کد آزمون را جست‌وجو کنید."
          >
            <ComboBoxItem id="neo">آزمون نئو</ComboBoxItem>
            <ComboBoxItem id="beck">افسردگی بک</ComboBoxItem>
          </ComboBox>
        </State>
        <State label="در حال بارگذاری (async)">
          <ComboBox
            className={styles.field}
            label="جست‌وجوی متخصص"
            defaultInputValue="دکتر"
            items={[] as TopicOption[]}
            isLoading
          >
            {(item) => <ComboBoxItem id={item.id}>{item.label}</ComboBoxItem>}
          </ComboBox>
        </State>
      </GalleryRow>
      <GalleryRow title="حالت‌های خطا و قفل">
        <State label="خطادار">
          <ComboBox
            className={styles.field}
            label="دسته‌بندی مقاله"
            isInvalid
            errorMessage="یک دسته‌بندی معتبر انتخاب کنید."
          >
            <ComboBoxItem id="a">روان‌شناسی کودک</ComboBoxItem>
          </ComboBox>
        </State>
        <State label="غیرفعال">
          <ComboBox
            className={styles.field}
            label="سازمان"
            defaultInputValue="مرکز مشاورهٔ نگرش"
            isDisabled
          >
            <ComboBoxItem id="org">مرکز مشاورهٔ نگرش</ComboBoxItem>
          </ComboBox>
        </State>
        <State label="فقط‌خواندنی">
          <ComboBox
            className={styles.field}
            label="آزمون ثبت‌شده"
            defaultInputValue="آزمون نئو"
            isReadOnly
          >
            <ComboBoxItem id="neo">آزمون نئو</ComboBoxItem>
          </ComboBox>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای فهرست‌های بلند، جست‌وجوی ناهم‌زمان سرور یا افزودن برچسب/موضوع تازه از ComboBox (یا نام جایگزین Autocomplete) استفاده کنید.',
      'در جست‌وجوی ناهم‌زمان همیشه isLoading و پیام خالی مشخص نشان دهید.',
    ],
    dont: [
      'برای فهرست کوتاه بدون نیاز به تایپ از ComboBox استفاده نکنید؛ Select ساده‌تر است.',
      'گزینهٔ ساخت مورد تازه را بدون بررسی تکرار به کاربر نشان ندهید.',
    ],
  },
  api: [
    {
      name: 'ComboBox / Autocomplete',
      props: [
        { name: 'label', type: 'ReactNode', description: 'برچسب دیدنی و الزامی.' },
        { name: 'items / defaultItems', type: 'Iterable<T>', description: 'گزینه‌های پویا یا اولیه.' },
        {
          name: 'inputValue / defaultInputValue / onInputChange',
          type: 'string / (value: string) => void',
          description: 'متن جست‌وجو برای پالایش سمت کاربر یا سرور.',
        },
        { name: 'value / defaultValue / onChange', type: 'Key | null', description: 'کلید انتخاب‌شده.' },
        {
          name: 'isLoading / isPending',
          type: 'boolean',
          description: 'نشانگر بارگذاری ناهم‌زمان و حالت در حال انجام.',
        },
        {
          name: 'emptyMessage',
          type: 'ReactNode',
          default: '«موردی یافت نشد»',
          description: 'پیام هنگام نبودن نتیجه.',
        },
        {
          name: 'onCreateOption / createOptionLabel',
          type: '(query: string) => void',
          description: 'فعال‌سازی گزینهٔ ساخت مورد تازه در انتهای فهرست.',
        },
        { name: 'allowsCustomValue', type: 'boolean', description: 'پذیرش مقدار خارج از فهرست.' },
        {
          name: 'menuTrigger',
          type: "'input' | 'focus' | 'manual'",
          default: "'input'",
          description: 'زمان باز شدن فهرست پیشنهادها.',
        },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'اندازهٔ فیلد.' },
        { name: 'className / ref', type: 'string / Ref<HTMLInputElement>', description: '—' },
      ],
    },
    {
      name: 'ComboBoxItem',
      props: [
        { name: 'id', type: 'Key', description: 'کلید یکتای گزینه.' },
        { name: 'textValue', type: 'string', description: 'متن برای جست‌وجو و پر کردن ورودی.' },
        { name: 'icon / description / isDisabled', type: '—', description: '—' },
      ],
    },
  ],
  keyboard: [
    { keys: 'تایپ متن', action: 'باز کردن فهرست و پالایش پیشنهادها' },
    { keys: '↓ / ↑', action: 'حرکت میان پیشنهادها و گزینهٔ ساخت مورد تازه' },
    { keys: 'Enter', action: 'انتخاب گزینهٔ فعال یا اجرای ساخت مورد تازه' },
    { keys: 'Esc', action: 'بستن فهرست پیشنهادها' },
  ],
  a11y: [
    'اعلان تعداد گزینه‌ها، فوکوس گروه و انتخاب گزینه از فرهنگ فارسی React Aria (@react-aria/combobox) خوانده می‌شوند.',
    'حالت بارگذاری و پیام خالی با نقش status و خطای اعتبارسنجی با نقش alert اعلام می‌شوند.',
    'دکمهٔ باز و بسته کردن فهرست هدف لمسی ۴۴×۴۴ پیکسل دارد.',
  ],
  rtl: [
    'ورودی فارسی راست‌به‌چپ است و دکمهٔ بازشو در سمت پایان (چپ) قرار می‌گیرد.',
    'برچسب پیش‌فرض ساخت مورد تازه به شکل «افزودن «…»» با گیومهٔ فارسی قالب‌بندی می‌شود.',
  ],
};
