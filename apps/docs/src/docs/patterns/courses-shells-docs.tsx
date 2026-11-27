import {
  AccountContacts,
  AccountShell,
  AdminShell,
  CoursePage,
  CoursePlayer,
  CourseProgress,
  LessonNav,
  MyCourses,
  NotificationTemplatesEditor,
  SettingsPage,
} from '@negaresh/patterns';
import {
  sampleAccountNav,
  sampleAdminNav,
  sampleBreadcrumbs,
  sampleCourseChapters,
  sampleCourseInstructor,
  sampleEnrolledCourses,
  sampleMedia,
  sampleNotificationTemplates,
  sampleShellStats,
  sampleUserMenu,
  sampleVerifiedMobiles,
} from '@negaresh/patterns/fixtures';
import { Button, Stack, Switch, Text, TextField } from '@negaresh/react';
import { useState } from 'react';
import type { ComponentDoc } from '../types.ts';
import { State } from '../ui.tsx';
import pStyles from './patterns.module.css';

function CoursePlayerExample() {
  const [activeLesson, setActiveLesson] = useState('l-2');
  const [completed, setCompleted] = useState(true);
  const flatLessons = sampleCourseChapters.flatMap((c) => c.lessons);
  const current = flatLessons.find((l) => l.id === activeLesson) ?? flatLessons[0]!;

  return (
    <CoursePlayer
      courseTitle="کارگاه جامع تفسیر بالینی MMPI-2"
      lessonTitle={current.title}
      posterSrc={sampleMedia.courseCover}
      posterAlt="پیش‌نمایش ویدیوی درس تفسیر MMPI-2"
      chapters={sampleCourseChapters}
      activeLessonId={activeLesson}
      completedLessons={completed ? 2 : 1}
      totalLessons={4}
      resumeTimestamp="۱۲:۴۰"
      isLessonCompleted={completed}
      onSelectLesson={setActiveLesson}
      onToggleComplete={setCompleted}
      onPreviousLesson={() => setActiveLesson('l-1')}
      onNextLesson={() => setActiveLesson('l-3')}
      onResume={() => {}}
    />
  );
}

export const coursesDoc: ComponentDoc = {
  slug: 'courses',
  title: 'دوره‌ها · صفحهٔ دوره، پخش‌کننده، ناوبری درس و پیشرفت ۹۰٪',
  components: ['CoursePage', 'CoursePlayer', 'LessonNav', 'CourseProgress', 'MyCourses'],
  summary:
    'مجموعهٔ کامل الگوهای آموزش ویدیویی: معرفی و سرفصل دوره، پخش‌کننده با کنترل سرعت و ادامهٔ پخش، قانون تکمیل ۹۰٪ و دوره‌های من.',
  status: 'approved',
  products: ['N'],
  Example: CoursePlayerExample,
  Gallery: () => (
    <div className={pStyles.stack}>
      <State label="پیشرفت دوره (در حال گذراندن ۵۰٪ در برابر تکمیل‌شده ≥ ۹۰٪)">
        <Stack gap="4">
          <CourseProgress completedLessons={5} totalLessons={10} />
          <CourseProgress completedLessons={9} totalLessons={10} />
        </Stack>
      </State>
      <State label="صفحهٔ معرفی دوره با مدرس، پیش‌نمایش رایگان و سرفصل">
        <CoursePage
          title="کارگاه جامع تفسیر بالینی MMPI-2 و نمره‌گذاری علمی"
          summary="آموزش گام‌به‌گام ارزیابی مقیاس‌های روایی، تحلیل کدهای دونقطه‌ای و نگارش گزارش حرفه‌ای و آرام."
          coverSrc={sampleMedia.courseCover}
          coverAlt="تصویر شاخص کارگاه تفسیر بالینی MMPI-2"
          price={1_850_000}
          originalPrice={2_300_000}
          instructor={sampleCourseInstructor}
          chapters={sampleCourseChapters}
          faqs={[
            {
              id: 'cf-1',
              question: 'شرط دریافت وضعیت تکمیل دوره چیست؟',
              answer: 'با تکمیل دست‌کم ۹۰ درصد درس‌ها، وضعیت دوره به «تکمیل‌شده» تغییر می‌کند.',
            },
          ]}
          onEnroll={() => {}}
          onPreviewLesson={() => {}}
        />
      </State>
      <State label="دوره‌های من با فیلتر وضعیت و پیشرفت">
        <MyCourses items={sampleEnrolledCourses} onResumeCourse={() => {}} />
      </State>
      <State label="ناوبری سرفصل درس‌ها (`LessonNav`)">
        <LessonNav chapters={sampleCourseChapters} activeLessonId="l-2" onSelectLesson={() => {}} />
      </State>
    </div>
  ),
  usage: {
    do: [
      'قانون ۹۰ درصد تکمیل دوره را در `CourseProgress` صریحاً نمایش دهید.',
      'درس‌های قفل‌شده را علاوه بر غیرفعال‌سازی دکمه، با آیکون قفل و برچسب متنی مشخص کنید.',
    ],
    dont: [
      'برای پخش ویدیو، پلیر سنگین خارجی را وارد پکیج NDS نکنید؛ از `mediaSlot` در اپلیکیشن محصول استفاده کنید.',
    ],
  },
  a11y: [
    'درس جاری در `LessonNav` با `aria-current="page"` مشخص می‌شود و سرعت پخش از `SegmentedControl` دسترس‌پذیر استفاده می‌کند.',
  ],
  rtl: [
    'برچسب سرعت پخش (`0.75x`, `1x`, `1.25x`) در ایزولهٔ LTR و مدت‌زمان درس‌ها با ارقام فارسی نمایش داده می‌شوند.',
  ],
};

function ShellsExample() {
  const [mobiles, setMobiles] = useState([...sampleVerifiedMobiles]);
  const [isDirty, setIsDirty] = useState(true);
  const [savedNotice, setSavedNotice] = useState<string | undefined>(undefined);

  return (
    <div className={pStyles.stack}>
      <AccountContacts
        mobiles={mobiles}
        email="sara.ahmadi@negaresh.ir"
        isEmailVerified
        onAddMobile={(phone) =>
          setMobiles((prev) => [...prev, { id: `mob-${prev.length + 1}`, phone }])
        }
        onRemoveMobile={(id) => setMobiles((prev) => prev.filter((m) => m.id !== id))}
        onUpdateEmail={() => {}}
      />
      <SettingsPage
        title="تنظیمات اعلان‌ها"
        isDirty={isDirty}
        savedMessage={savedNotice}
        onSave={() => {
          setIsDirty(false);
          setSavedNotice('تنظیمات اعلان با موفقیت ذخیره شد.');
        }}
        onDiscard={() => setIsDirty(false)}
        sections={[
          {
            id: 'sec-notify',
            title: 'کانال‌های اطلاع‌رسانی حساب',
            description: 'انتخاب کنید رسید سفارش و کد فعال‌سازی از چه طریقی ارسال شود.',
            content: (
              <Stack gap="3">
                <Switch defaultSelected onChange={() => setIsDirty(true)}>
                  ارسال پیامک پس از هر فعال‌سازی موفق
                </Switch>
                <TextField
                  label="نام نمایشی در فاکتورها"
                  defaultValue="دکتر سارا احمدی"
                  onChange={() => setIsDirty(true)}
                />
              </Stack>
            ),
          },
        ]}
      />
    </div>
  );
}

export const accountAdminShellsDoc: ComponentDoc = {
  slug: 'account-admin-shells',
  title: 'پوسته‌های حساب و مدیریت · AccountShell، AdminShell، تماس‌ها و قالب اعلان',
  components: [
    'AccountShell',
    'AccountContacts',
    'AdminShell',
    'SettingsPage',
    'NotificationTemplatesEditor',
  ],
  summary:
    'پوستهٔ حساب کاربری (بازاستفاده از `AccountPill` و `UserMenu`)، مدیریت شماره‌های تأییدشده، پوستهٔ مدیریت چندنقشی، صفحهٔ تنظیمات و ویرایشگر قالب اعلان.',
  status: 'approved',
  products: ['R', 'N', 'T'],
  Example: ShellsExample,
  Gallery: () => (
    <div className={pStyles.stack}>
      <State label="پوستهٔ حساب کاربری (`AccountShell` با `UserMenu` و `SideNav` → `TabStrip`)">
        <AccountShell
          embedded
          navLabel="ناوبری حساب کاربری (گالری)"
          productLabel="حساب نگرش"
          pageTitle="پیشخوان حساب کاربری"
          pageDescription="خلاصهٔ سفارش‌ها، سریال‌های فعال و دوره‌های آموزشی شما."
          userMenu={{ ...sampleUserMenu, 'aria-label': `حساب کاربری (پوستهٔ حساب) ${sampleUserMenu.label}` }}
          navGroups={sampleAccountNav}
          stats={sampleShellStats}
        >
          <Text size="sm" tone="muted">
            محتوای بخش انتخابی حساب کاربری در این ناحیه نمایش داده می‌شود.
          </Text>
        </AccountShell>
      </State>
      <State label="پوستهٔ پنل مدیریت (`AdminShell` با فیلتر نقش و منوی کشویی موبایل)">
        <AdminShell
          embedded
          navLabel="ناوبری پنل مدیریت (گالری)"
          productLabel="مدیریت رجیستری"
          pageTitle="سقف‌های فعال‌سازی"
          pageDescription="پیکربندی و ممیزی سقف مجوزهای نرم‌افزارهای نگرش."
          breadcrumbs={sampleBreadcrumbs}
          pageActions={
            <Button variant="primary">
              صدور سریال جدید
            </Button>
          }
          userMenu={{ ...sampleUserMenu, 'aria-label': `حساب کاربری (پنل مدیریت) ${sampleUserMenu.label}` }}
          navGroups={sampleAdminNav}
          userRoles={['admin']}
        >
          <Text size="sm" tone="muted">
            جایگاه `FilterBar` + `DataTable` + `BulkActionBar` یا صفحهٔ جزئیات.
          </Text>
        </AdminShell>
      </State>
      <State label="ویرایشگر قالب‌های اعلان با متغیرها و پیش‌نمایش زنده">
        <NotificationTemplatesEditor
          templates={sampleNotificationTemplates}
          onSave={() => {}}
          onSendTest={() => {}}
        />
      </State>
    </div>
  ),
  usage: {
    do: [
      'در `AccountShell` و `AdminShell` از `UserMenu` (که خود `AccountPill` مصوب P2 را در بر دارد) استفاده کنید و هرگز قرص حساب تکراری نسازید.',
      'حذف شمارهٔ موبایل در `AccountContacts` را همیشه پشت `AlertDialog` محافظت کنید.',
    ],
    dont: [
      'در حالت تعبیه‌شده داخل صفحهٔ دیگر (`embedded={true}`) تگ `<main>` دوم تولید نکنید.',
    ],
  },
  a11y: [
    'در موبایل (`< 900px`)، `AccountShell` به `TabStrip` اسکرول‌پذیر و `AdminShell` به منوی کشویی `Sheet` تغییر چیدمان می‌دهند.',
    'نوار ذخیرهٔ `SettingsPage` وضعیت تغییرات را با `role="status"` اعلام می‌کند.',
  ],
  rtl: [
    'شماره‌های موبایل در `AccountContacts` با `maskPhone` و `<Ltr>` و متغیرهای قالب اعلان (`{{code}}`) در `<Code>` چپ‌به‌راست نمایش داده می‌شوند.',
  ],
};
