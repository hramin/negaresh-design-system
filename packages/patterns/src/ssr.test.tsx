// @vitest-environment node
import { ThemeProvider } from '@negaresh/react';
import { faMessages } from '@negaresh/react/messages/fa';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  sampleAccountNav,
  sampleActivations,
  sampleAdminNav,
  sampleAlertChannels,
  sampleArticleAuthor,
  sampleAuditEntries,
  sampleAuthors,
  sampleB2BClients,
  sampleBreadcrumbs,
  sampleCampaignParticipants,
  sampleCartItems,
  sampleContentBlocks,
  sampleContentCards,
  sampleCourseChapters,
  sampleCourseInstructor,
  sampleDashboardReports,
  sampleEnrolledCourses,
  sampleExperts,
  sampleFeaturedSlides,
  sampleGateways,
  sampleInvoiceBuyer,
  sampleInvoiceSeller,
  sampleLimitHistory,
  sampleMedia,
  sampleNotificationTemplates,
  sampleOrderItems,
  sampleOrderTimeline,
  samplePollOptions,
  sampleProductEditions,
  sampleProductFaqs,
  sampleProductGallery,
  sampleProductRequirements,
  sampleProducts,
  sampleReviewQueue,
  sampleSerialProducts,
  sampleShellStats,
  sampleShippingMethods,
  sampleTestCatalog,
  sampleUserMenu,
  sampleVerifiedMobiles,
  sampleWalletLedger,
  sampleWriterDocs,
} from './fixtures/index.ts';
import {
  AccountContacts,
  AccountShell,
  ActivationFlow,
  AdminShell,
  AlertChannels,
  ArticlePage,
  AuditLog,
  B2BPanel,
  BlogFeed,
  CampaignBuilder,
  CampaignParticipants,
  Cart,
  Checkout,
  CodeDisplay,
  ContentBlocks,
  ContentCard,
  CoursePage,
  CoursePlayer,
  CourseProgress,
  ExpertDirectory,
  ExpertProfile,
  GatewayPicker,
  Invoice,
  LessonNav,
  LimitEditor,
  MyActivations,
  MyCourses,
  NotificationTemplatesEditor,
  OrderDetail,
  OrderSummary,
  OrgWallet,
  PaymentResult,
  Poll,
  Price,
  ProductCard,
  ProductPage,
  ReviewQueue,
  RosterImport,
  SeatMeter,
  SerialBatchGenerator,
  SettingsPage,
  ShareLinkPanel,
  TestCatalog,
  TestDashboard,
  Wishlist,
  WriterWorkspace,
} from './index.ts';

describe('@negaresh/patterns Node SSR parity', () => {
  it('renders every exported product pattern on Node without window/document access', () => {
    expect(typeof window).toBe('undefined');
    expect(typeof document).toBe('undefined');

    const html = renderToString(
      <ThemeProvider messages={faMessages}>
        <div>
          <Price amount={4_850_000} originalAmount={5_900_000} />
          <ProductCard product={sampleProducts[0]!} />
          <Wishlist items={sampleProducts.slice(0, 1)} />
          <ProductPage
            title="نگرش ۴"
            summary="نرم‌افزار روان‌سنجی"
            gallery={sampleProductGallery}
            editions={sampleProductEditions}
            systemRequirements={sampleProductRequirements}
            faqs={sampleProductFaqs}
          />
          <Cart items={sampleCartItems} />
          <OrderSummary subtotal={7_250_000} discount={450_000} />
          <GatewayPicker gateways={sampleGateways} defaultValue="behpardakht" />
          <Checkout
            items={sampleCartItems}
            gateways={sampleGateways}
            shippingMethods={sampleShippingMethods}
          />
          <PaymentResult status="success" trackingCode="BP-884920145" amount={6_800_000} />
          <OrderDetail
            orderNumber="NG-1405-4092"
            status="completed"
            createdAt="2026-11-20T08:15:00Z"
            timeline={sampleOrderTimeline}
            items={sampleOrderItems}
          />
          <Invoice
            invoiceNumber="INV-1405-0891"
            issuedAt="2026-11-20T08:19:00Z"
            seller={sampleInvoiceSeller}
            buyer={sampleInvoiceBuyer}
            items={sampleOrderItems}
          />
          <CodeDisplay code="ACT-7K9P-3M2Q-8V4X" isRepeatPc />
          <ActivationFlow
            productName="نگرش ۴"
            systemCode="SYS-94FA-21BC-08E1"
            errorKind="limit_reached"
          />
          <MyActivations records={sampleActivations} />
          <LimitEditor effectiveLimit={3} source="serial" history={sampleLimitHistory} />
          <SerialBatchGenerator products={sampleSerialProducts} />
          <AlertChannels
            channels={sampleAlertChannels}
            primaryRecipient="+989123456789"
            secondaryRecipient="ops@negaresh.ir"
          />
          <AuditLog entries={sampleAuditEntries} />
          <Poll question="سؤال" options={samplePollOptions} />
          <ContentCard item={sampleContentCards[0]!} />
          <BlogFeed
            featured={sampleFeaturedSlides}
            authors={sampleAuthors}
            items={sampleContentCards}
          />
          <ContentBlocks blocks={sampleContentBlocks} />
          <ArticlePage
            title="مقاله"
            summary="چکیده"
            category="بالینی"
            author={sampleArticleAuthor}
            publishedAt="2026-11-15T09:00:00Z"
            readingMinutes={7}
            shareUrl="https://negaresh.ir/mag/calm"
            blocks={sampleContentBlocks}
          />
          <ExpertDirectory experts={sampleExperts} />
          <ExpertProfile
            expert={sampleExperts[0]!}
            about="سوابق"
            education={['دکتری']}
            authoredContent={sampleContentCards.slice(0, 1)}
          />
          <WriterWorkspace documents={sampleWriterDocs} />
          <ReviewQueue items={sampleReviewQueue} />
          <CourseProgress completedLessons={9} totalLessons={10} />
          <LessonNav chapters={sampleCourseChapters} activeLessonId="l-1" />
          <CoursePlayer
            courseTitle="دوره"
            lessonTitle="درس ۱"
            posterSrc={sampleMedia.courseCover}
            posterAlt="پوستر"
            chapters={sampleCourseChapters}
            activeLessonId="l-1"
            completedLessons={2}
            totalLessons={4}
          />
          <CoursePage
            title="دوره"
            summary="توضیح"
            coverSrc={sampleMedia.courseCover}
            coverAlt="کاور"
            price={1_850_000}
            instructor={sampleCourseInstructor}
            chapters={sampleCourseChapters}
          />
          <MyCourses items={sampleEnrolledCourses} />
          <AccountShell
            embedded
            productLabel="حساب نگرش"
            pageTitle="پیشخوان"
            userMenu={sampleUserMenu}
            navGroups={sampleAccountNav}
            stats={sampleShellStats}
          >
            <div>محتوا</div>
          </AccountShell>
          <AccountContacts mobiles={sampleVerifiedMobiles} email="a@negaresh.ir" />
          <AdminShell
            embedded
            productLabel="مدیریت"
            pageTitle="سریال‌ها"
            breadcrumbs={sampleBreadcrumbs}
            userMenu={sampleUserMenu}
            navGroups={sampleAdminNav}
          >
            <div>جدول</div>
          </AdminShell>
          <SettingsPage title="تنظیمات" sections={[{ id: 's', title: 'بخش', content: <div /> }]} />
          <NotificationTemplatesEditor templates={sampleNotificationTemplates} />
          <TestCatalog tests={sampleTestCatalog} />
          <TestDashboard stats={sampleShellStats} reports={sampleDashboardReports} />
          <CampaignBuilder
            testOptions={[{ id: 't', label: 'آزمون' }]}
            extraFieldOptions={[{ id: 'f', label: 'فیلد' }]}
          />
          <ShareLinkPanel shareUrl="https://tests.negaresh.ir/c/demo" />
          <RosterImport />
          <SeatMeter used={10} limit={20} />
          <CampaignParticipants participants={sampleCampaignParticipants} />
          <OrgWallet balance={2_950_000} ledger={sampleWalletLedger} />
          <B2BPanel clients={sampleB2BClients} newlyCreatedKey="nds_live_1234" />
        </div>
      </ThemeProvider>,
    );

    expect(html.length).toBeGreaterThan(2000);
    expect(html).toContain('data-nds="Invoice"');
    expect(html).toContain('data-nds="ActivationFlow"');
    expect(html).toContain('data-nds="B2BPanel"');
    expect(html).toContain('تومان');
  });
});
