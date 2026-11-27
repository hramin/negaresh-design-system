import { iconTag } from '@negaresh/icons';
import { Stack, Tag, TagField, TagGroup } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { GalleryRow, State } from '../ui.tsx';
import styles from './fields.module.css';

function Example() {
  const [groupItems, setGroupItems] = useState([
    { id: 'cbt', label: 'درمان شناختی-رفتاری' },
    { id: 'child', label: 'کودک و نوجوان' },
    { id: 'assessment', label: 'روان‌سنجی' },
  ]);
  const [keywords, setKeywords] = useState<string[]>(['آزمون نئو', 'شخصیت']);

  return (
    <div className={styles.example} data-interactive="tag-group">
      <Stack gap="5">
        <TagGroup
          label="فیلترهای فعال"
          description="با دکمهٔ حذف یا کلید Delete می‌توانید هر برچسب را بردارید."
          emptyMessage="همهٔ فیلترها برداشته شدند."
          items={groupItems}
          onRemove={(keys) => setGroupItems((prev) => prev.filter((item) => !keys.has(item.id)))}
        >
          {(item) => (
            <Tag id={item.id} icon={iconTag}>
              {item.label}
            </Tag>
          )}
        </TagGroup>

        <TagField
          label="کلیدواژه‌های مقاله"
          description="با Enter یا ویرگول (،) برچسب تازه اضافه کنید؛ حداکثر ۵ برچسب."
          value={keywords}
          onChange={setKeywords}
          maxTags={5}
        />
      </Stack>
    </div>
  );
}

export const tagGroupDoc: ComponentDoc = {
  slug: 'tag-group',
  title: 'گروه برچسب و فیلد برچسب',
  components: ['TagGroup', 'Tag', 'TagField'],
  base: 'TagGroup, TagList, Tag',
  summary:
    'نمایش و مدیریت برچسب‌های انتخاب‌پذیر یا حذف‌پذیر همراه با فیلد ورود برچسب تازه؛ با کلیدهای پیمایش و برچسب‌های فارسی صفحه‌خوان.',
  status: 'approved',
  products: ['N'],
  Example,
  Gallery: () => (
    <>
      <GalleryRow title="TagGroup — حالت‌های پایه">
        <State label="حذف‌پذیر با آیکون">
          <TagGroup label="موضوعات" onRemove={() => {}}>
            <Tag id="a" icon={iconTag}>
              روان‌شناسی بالینی
            </Tag>
            <Tag id="b" tone="accent">
              پیشنهاد سردبیر
            </Tag>
            <Tag id="c" isDisabled>
              قفل‌شده
            </Tag>
          </TagGroup>
        </State>
        <State label="انتخاب‌پذیر (چندتایی)">
          <TagGroup
            label="گروه سنی"
            selectionMode="multiple"
            defaultSelectedKeys={['teen']}
          >
            <Tag id="child">کودک</Tag>
            <Tag id="teen">نوجوان</Tag>
            <Tag id="adult">بزرگسال</Tag>
          </TagGroup>
        </State>
        <State label="اندازهٔ کوچک و حالت خالی">
          <Stack gap="3">
            <TagGroup label="برچسب‌های فشرده" size="sm" onRemove={() => {}}>
              <Tag id="s1">فشرده</Tag>
              <Tag id="s2">مقاله</Tag>
            </TagGroup>
            <TagGroup label="فیلترها" emptyMessage="برچسبی انتخاب نشده است.">
              {[]}
            </TagGroup>
          </Stack>
        </State>
      </GalleryRow>
      <GalleryRow title="TagField — ورود برچسب">
        <State label="پرشده با راهنما">
          <TagField
            className={styles.field}
            label="کلیدواژه‌ها"
            defaultValue={['روان‌سنجی', 'نوجوان']}
            description="با Enter یا ویرگول برچسب اضافه کنید."
          />
        </State>
        <State label="خطادار">
          <TagField
            className={styles.field}
            label="برچسب‌های دوره"
            defaultValue={['کارگاه']}
            isInvalid
            errorMessage="حداقل دو برچسب مرتبط وارد کنید."
          />
        </State>
        <State label="غیرفعال و فقط‌خواندنی">
          <Stack gap="3">
            <TagField
              className={styles.field}
              label="برچسب‌های قفل‌شده"
              defaultValue={['تأییدشده']}
              isDisabled
            />
            <TagField
              className={styles.field}
              label="برچسب‌های ثبت‌شده"
              defaultValue={['آزمون']}
              isReadOnly
            />
          </Stack>
        </State>
      </GalleryRow>
    </>
  ),
  usage: {
    do: [
      'برای نمایش فیلترهای اعمال‌شده یا دسته‌بندی‌های قابل حذف از TagGroup استفاده کنید.',
      'برای ورود کلیدواژه‌های آزاد در پنل نویسنده یا ویرایشگر محتوا از TagField استفاده کنید.',
    ],
    dont: [
      'برای نشان وضعیت ثابت (مانند «پرداخت‌شده») از Tag استفاده نکنید؛ آن Badge یا StatusBadge است (P4).',
      'برچسب‌های طولانی چندخطی داخل TagGroup نگذارید.',
    ],
  },
  keyboard: [
    { keys: '← / → (در TagGroup)', action: 'پیمایش میان برچسب‌ها بر اساس جهت راست‌به‌چپ' },
    { keys: 'Delete / Backspace (روی Tag)', action: 'حذف برچسب دارای فوکوس' },
    { keys: 'Enter یا ، (در TagField)', action: 'افزودن برچسب تازه' },
    { keys: 'Backspace در ورودی خالی TagField', action: 'حذف آخرین برچسب افزوده‌شده' },
  ],
  a11y: [
    'دکمهٔ حذف هر برچسب از فرهنگ فارسی React Aria (@react-aria/tag) برچسب دقیق «حذف {نام برچسب}» می‌گیرد و ناحیهٔ لمسی ۴۴×۴۴ پیکسل دارد.',
    'افزودن و حذف برچسب در TagField از طریق ناحیهٔ زنده (role="status") و خطاهای تکرار/سقف از طریق role="alert" اعلام می‌شوند.',
  ],
  rtl: [
    'برچسب‌ها از راست به چپ می‌چینند، دکمهٔ بستن در سمت پایان (چپ) هر برچسب قرار می‌گیرد و ویرگول فارسی («،») همانند کامای لاتین برچسب تازه ثبت می‌کند.',
  ],
};
