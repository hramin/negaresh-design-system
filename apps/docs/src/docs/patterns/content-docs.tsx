import {
  ArticlePage,
  BlogFeed,
  ContentBlocks,
  ContentCard,
  ExpertDirectory,
  ExpertProfile,
  Poll,
  ReviewQueue,
  WriterWorkspace,
} from '@negaresh/patterns';
import {
  sampleArticleAuthor,
  sampleAuthors,
  sampleContentBlocks,
  sampleContentCards,
  sampleExperts,
  sampleFeaturedSlides,
  samplePollOptions,
  sampleReviewQueue,
  sampleWriterDocs,
} from '@negaresh/patterns/fixtures';
import { Stack } from '@negaresh/react';
import type { ComponentDoc } from '../types.ts';
import { State } from '../ui.tsx';
import pStyles from './patterns.module.css';

export const contentEditorialDoc: ComponentDoc = {
  slug: 'content-editorial',
  title: 'مجله و محتوا · خوراک، کارت‌های ۴گانه، بلوک‌ها، مقاله و نظرسنجی',
  components: ['ContentCard', 'BlogFeed', 'ContentBlocks', 'ArticlePage', 'Poll'],
  summary:
    'خوراک مجله با اسلایدر برگزیده (حداکثر ۵ مورد)، ۴ نوع کارت محتوا، رندرر ساختاریافتهٔ ۱۱ نوع بلوک، صفحهٔ کامل مقاله و نظرسنجی با یادداشت متخصص.',
  status: 'review',
  products: ['N'],
  Example: () => (
    <BlogFeed
      featured={sampleFeaturedSlides}
      authors={sampleAuthors}
      items={sampleContentCards}
      hasMore
      onLoadMore={() => {}}
    />
  ),
  Gallery: () => (
    <div className={pStyles.stack}>
      <State label="۴ نوع کارت محتوا (مقاله، یادداشت، نقل‌قول، نظرسنجی)">
        <div className={pStyles.gridTwo}>
          {sampleContentCards.map((item) => (
            <ContentCard key={`gal-${item.id}`} item={item} />
          ))}
        </div>
      </State>
      <State label="نظرسنجی بسته‌شده با درصدها و یادداشت متخصص">
        <Poll
          question="مهم‌ترین معیار شما در انتخاب نرم‌افزار روان‌سنجی چیست؟"
          options={samplePollOptions}
          status="closed"
          expertNote="ارائهٔ گزارش آرام در کنار هنجار ایرانی بالاترین امتیاز متخصصان را داشته است."
        />
      </State>
      <State label="صفحهٔ مقاله با مشخصات نویسنده، فهرست بخش‌ها و ContentBlocks">
        <ArticlePage
          title="چگونه نتایج آزمون‌های نوجوانان را با زبان آرام گزارش کنیم؟"
          summary="مرور اصول طراحی گزارش‌های دوگانه (حرفه‌ای و آرام) برای کاهش اضطراب خانواده و افزایش همکاری درمانی."
          category="روان‌سنجی بالینی"
          author={sampleArticleAuthor}
          coAuthors={['دکتر محمدرضا کریمی']}
          reviewedBy="کمیتهٔ علمی نگرش"
          publishedAt="2026-11-15T09:00:00Z"
          updatedAt="2026-11-21T11:00:00Z"
          readingMinutes={7}
          shareUrl="https://negaresh.ir/mag/calm-adolescent-reports"
          blocks={sampleContentBlocks}
          disclaimer="مطالب این مقاله صرفاً جنبهٔ آموزشی و راهنمای تخصصی دارد و جایگزین ارزیابی بالینی حضوری نیست."
          related={sampleContentCards.slice(0, 2)}
        />
      </State>
      <State label="بلوک‌های محتوا (CalloutBox ۴گانه)">
        <Stack gap="3">
          <ContentBlocks
            blocks={[
              { id: 'c1', type: 'callout-box', kind: 'note', text: 'یادداشت راهنما برای خواننده.' },
              { id: 'c2', type: 'callout-box', kind: 'tip', text: 'نکتهٔ کاربردی هنگام اجرای آزمون.' },
              { id: 'c3', type: 'callout-box', kind: 'warning', text: 'توجه به محرمانگی داده‌های نوجوان.' },
              { id: 'c4', type: 'callout-box', kind: 'important', text: 'مورد مهم بالینی نیازمند ارجاع.' },
            ]}
          />
        </Stack>
      </State>
    </div>
  ),
  usage: {
    do: [
      'در `BlogFeed` حداکثر ۵ اسلاید برگزیده قرار دهید و هرگز حرکت خودکار را در حالت `prefers-reduced-motion` فعال نکنید.',
      'تولید محتوای بلوکی را از طریق JSON ساختاریافته به `ContentBlocks` بسپارید (Q-04).',
    ],
    dont: [
      'در کارت نقل‌قول از قاب تزئینی یا نشانگر لوزی استفاده نکنید (D-77).',
      'بخش دیدگاه وبلاگ اضافه نکنید (در D-01/Q-06 خارج از دامنه است).',
    ],
  },
  api: [
    {
      name: 'ContentCard',
      props: [
        { name: 'item', type: 'ArticleCardData | PostCardData | QuoteCardData | PollCardData', description: 'دادهٔ متمایز ۴ نوع کارت.' },
      ],
    },
    {
      name: 'BlogFeed',
      props: [
        { name: 'featured', type: 'FeaturedSlide[]', description: 'تا ۵ اسلاید برگزیده.' },
        { name: 'authors', type: 'FeedAuthor[]', description: 'نوار نویسندگان.' },
        { name: 'items', type: 'ContentCardItem[]', description: 'خوراک ترکیبی مطالب.' },
      ],
    },
    {
      name: 'ContentBlocks',
      props: [
        { name: 'blocks', type: 'ContentBlock[]', description: 'آرایهٔ بلوک‌های JSON ساختاریافته (۱۱ نوع).' },
      ],
    },
    {
      name: 'Poll',
      props: [
        { name: 'mode', type: "'single' | 'multiple'", default: "'single'", description: 'تک‌انتخابی یا چندانتخابی.' },
        { name: 'status', type: "'open' | 'closed'", default: "'open'", description: 'باز یا بسته‌بودن نظرسنجی.' },
        { name: 'expertNote', type: 'string', description: 'توضیح تخصصی پس از رأی‌دهی.' },
      ],
    },
  ],
  keyboard: [
    { keys: 'Tab / Enter', action: 'جابه‌جایی میان اسلایدهای برگزیده، فیلترها و ثبت رأی در نظرسنجی' },
  ],
  a11y: [
    'دکمه‌های ناوبری اسلایدر و نقطه‌های شاخص دارای حداقل اندازهٔ ۴۴×۴۴ پیکسل و `aria-pressed` هستند.',
    'نتیجهٔ ثبت رأی در `Poll` از طریق ناحیهٔ زندهٔ `role="status"` اعلام می‌شود.',
  ],
  rtl: [
    'آیکون‌های جهت‌دار اسلایدر (`iconArrowStart` / `iconArrowEnd`) در RTL به‌طور خودکار آینه می‌شوند.',
    'نوار حاشیهٔ نقل‌قول و بلوک `ContentCallout` با `border-inline-start` تنظیم شده است.',
  ],
};

export const contentExpertsDoc: ComponentDoc = {
  slug: 'content-experts',
  title: 'مجله و محتوا · متخصصان، میز کار نویسنده و صف بازبینی',
  components: ['ExpertDirectory', 'ExpertProfile', 'WriterWorkspace', 'ReviewQueue'],
  summary:
    'دایرکتوری و پروفایل متخصصان با حفظ حریم خصوصی اطلاعات تماس، میز کار ۵مرحله‌ای نویسنده با مقایسهٔ نسخه‌ها و صف بازبینی تحریریه.',
  status: 'review',
  products: ['N'],
  Example: () => <ExpertDirectory experts={sampleExperts} />,
  Gallery: () => (
    <div className={pStyles.stack}>
      <State label="پروفایل متخصص با نشان تأیید، تحصیلات و آثار">
        <ExpertProfile
          expert={sampleExperts[0]!}
          about="تمرکز پژوهشی و بالینی بر ارزیابی روان‌شناختی نوجوانان، مداخلات خانواده‌محور و طراحی گزارش‌های قابل فهم برای والدین."
          education={[
            'دکتری تخصصی روان‌شناسی بالینی — دانشگاه تهران',
            'عضو سازمان نظام روان‌شناسی و مشاورهٔ ایران',
          ]}
          authoredContent={sampleContentCards.slice(0, 2)}
        />
      </State>
      <State label="میز کار نویسنده (پوستهٔ ویرایشگر، زمان‌بندی شمسی و DiffView)">
        <WriterWorkspace
          documents={sampleWriterDocs}
          onStatusAction={() => {}}
          onRestoreRevision={() => {}}
        />
      </State>
      <State label="صف بازبینی تحریریه (مقایسهٔ تغییر و یادداشت برای نویسنده)">
        <ReviewQueue
          items={sampleReviewQueue}
          onApprove={() => {}}
          onRequestChanges={() => {}}
        />
      </State>
    </div>
  ),
  usage: {
    do: [
      'اطلاعات تماس شخصی متخصصان را هرگز در `ExpertDirectory` یا `ExpertProfile` عمومی نکنید.',
      'برای جایگذاری ویرایشگر بلوکی دلخواه (مانند Tiptap در Q-04)، اسلات `editorSlot` در `WriterWorkspace` را ارسال کنید.',
    ],
    dont: [
      'ارسال درخواست اصلاح در `ReviewQueue` را بدون یادداشت راهنما برای نویسنده مجاز نکنید.',
    ],
  },
  api: [
    {
      name: 'ExpertDirectory',
      props: [
        { name: 'experts', type: 'ExpertSummary[]', description: 'فهرست متخصصان بدون اطلاعات تماس خصوصی.' },
      ],
    },
    {
      name: 'ExpertProfile',
      props: [
        { name: 'expert', type: 'ExpertSummary', description: 'اطلاعات سرصفحهٔ متخصص.' },
        { name: 'education', type: 'string[]', description: 'فهرست تحصیلات و پروانه.' },
        { name: 'authoredContent', type: 'ContentCardItem[]', description: 'مطالب تألیف‌شده در تب‌های تفکیک‌شده.' },
      ],
    },
    {
      name: 'WriterWorkspace',
      props: [
        { name: 'documents', type: 'WriterDocument[]', description: 'فهرست مطالب نویسنده با وضعیت بازبینی.' },
        { name: 'editorSlot', type: 'ReactNode', description: 'جایگاه ویرایشگر بلوکی محصول (Q-04).' },
      ],
    },
    {
      name: 'ReviewQueue',
      props: [
        { name: 'items', type: 'ReviewQueueItem[]', description: 'صف مطالب ارسالی برای بازبینی.' },
        { name: 'onApprove / onRequestChanges', type: '(id, note) => void', description: 'تأیید یا درخواست اصلاح.' },
      ],
    },
  ],
  a11y: [
    'فهرست مطالب در `WriterWorkspace` و `ReviewQueue` از دکمه‌های `aria-current="true"` با حداقل ارتفاع ۴۴ پیکسل استفاده می‌کند.',
  ],
  rtl: [
    'انتخابگر تاریخ انتشار زمان‌بندی‌شده از تقویم شمسی (`DatePicker`) و ساعت ۲۴ساعته (`TimeField`) بهره می‌برد.',
  ],
};
