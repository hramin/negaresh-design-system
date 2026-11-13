# Patterns

Patterns are compositions of Core components for recurring product needs. They live in `@negaresh/patterns` (or `@negaresh/assessment`) and accept data and callbacks; they never fetch.

## Identity and auth (all products; Keycloak theme in P6)

| Pattern | Contents |
| --- | --- |
| PhoneSignIn | PhoneField → OTPField with 60-s resend countdown, 2-min expiry message, rate-limit and wrong-code states, CAPTCHA slot |
| PasswordSignIn, ForgotPassword | email/username + password; recovery by SMS code |
| VerifyMobile | for migrated users without a verified mobile |
| TwoFactorSetup | authenticator QR, manual key (LTR, copy), verify code |
| AccountContacts | several verified mobiles: add, verify, remove; email |

## Commerce (N, R, T)

| Pattern | Contents |
| --- | --- |
| ProductCard | image, title, edition count, Price (sale, free), wishlist toggle |
| ProductPage | gallery, title, editions (ChoiceCard), price, add to cart, system requirements, FAQ, related |
| Cart, OrderSummary | lines, quantities, coupon, totals in Toman |
| Checkout | sign-in step if needed → address (physical only) → shipping → GatewayPicker → pay |
| GatewayPicker | ChoiceCards for enabled gateways in admin order |
| PaymentResult | success + tracking code (copy), cancelled, failed with retry |
| OrderDetail | state timeline, items, invoice download |
| Invoice (print) | A4, Jalali dates, Toman |
| Wishlist | — |

## Licensing (R, N account)

| Pattern | Contents |
| --- | --- |
| ActivationFlow | reference page: prefilled system code, SerialField, errors, CodeDisplay with copy, repeat-PC note, limit reached → buy +1 |
| CodeDisplay | large LTR code, copy, sent-by-SMS/email note |
| MyActivations | per serial: product, system code, date, code, resend (rate-limited) |
| LimitEditor (admin) | effective limit + source, override with reason, history |
| SerialBatchGenerator (admin) | product, quantity, preview, CSV export |
| AlertChannels (admin) | SMS, email, Telegram relay, Bale; two recipients; send test |
| AuditLog | who, what, before/after, when, IP; filters |

## Content (N)

| Pattern | Contents |
| --- | --- |
| BlogFeed | featured slider (≤5), authors strip, mixed feed, type/category/author filters, load more |
| ContentCard ×4 | Article (cover, title, summary, reading time), Post (excerpt, first image), Quote (designed card + source), Poll (vote in card) |
| ArticlePage | byline (author, title, verified, co-authors, reviewed by, dates), TOC, blocks, disclaimer, author card, related, share |
| ContentBlocks | paragraph, headings, image + caption, gallery, table, quote, FAQ, video, CalloutBox (note, tip, warning, important), ContentCallout (key takeaway, pull quote, linked card), divider |
| Poll | single/multiple, open/closed, results visibility, expert note after voting |
| ExpertDirectory | filters (specialty, mode, city), search, cards |
| ExpertProfile | header (photo, name, title, verified, specialties, modes, Book button later), intro, about, education, content tabs with type filter |
| WriterWorkspace | own content list with review status, editor shell, revisions, schedule, submit/publish |
| ReviewQueue | Editor: items, notes to author, approve / request changes |

## Courses (N)

CoursePage (syllabus, instructor, preview lessons, FAQ) · Player (video frame, speed, resume, next lesson) · LessonNav · CourseProgress (90 % rule) · MyCourses.

## Account and admin shells (R, N, T)

AccountShell (side nav → tab strip, dashboard tiles) · AdminShell (role-filtered nav, page header with actions, FilterBar + DataTable + BulkActionBar, detail page with tabs and audit) · Settings pages (sections with Save bar) · Notifications templates editor.

## Test platform (T)

Catalog (test cards, free, sale, org rate) · TestStart · AnswerFlow · Result (pro / calm) · ReportControl · Dashboard (stats, resume, ready, recent results) · Campaigns (builder, share-link panel with copy, individual links CSV, roster paste/upload, SeatMeter, participants) · OrgWallet (balance, top-up, allocate by phone, ledger) · B2B (clients, keys shown once with copy, usage).

## Ravanma (later)

Ravanma reuses Core, charts and the assessment kit with its own theme. Painted leaves, perspective maps, the traveller and illumination live in `@negaresh/brand-ravanma`; the docs site gets a "Ravanma" section when that package lands.
