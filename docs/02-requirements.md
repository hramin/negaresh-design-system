# 02 · Requirements

Sources: *Negaresh Platform PRD* (Nov 5, 2026), *Software Registry PRD* (Nov 5, 2026), *Psychology Test Platform — Review, Feature Spec & DS Brief* (Nov 5, 2026), *Ravanma handoff 2* (Nov 13, 2026). Product documents win over older design artefacts (D-51).

## 1. Cross-product requirements

| Area | Requirement | Source |
| --- | --- | --- |
| Language | Persian only, RTL first; LTR supported for Ravanma later | Negaresh NFR, D-30 |
| Dates | Jalali on screen, Tehran time; Gregorian UTC stored | All three |
| Money | Toman on screen, integer; no unit conversion in UI | D-26 |
| Numbers | Persian digits for display; codes, phones, serials, URLs LTR with Latin digits | Negaresh NFR, Registry NFR, D-86 |
| Accessibility | WCAG 2.2 AA (PRD states 2.1 AA; 2.2 is the stricter binding decision D-41); keyboard; visible focus; 44 px targets; labelled fields; required alt text | All |
| Performance | SSR for public pages; LCP < 2.5 s on mobile (product, post, profile pages); registry usable on 3G, first load < 3 s | Negaresh, Registry |
| Theming | Yearly redesign by tokens and templates only; one system incl. Keycloak login pages | Negaresh Design NFR |
| Devices | Mobile first; registry from 360 px width | Registry NFR |
| Sign-in | One Keycloak account; phone + SMS code (6 digits, 2-min expiry, resend after 60 s, rate limits); email + password; recovery; verify mobile; 2FA for staff | Negaresh, Registry FR-01..03 |
| Privacy | Masked phones in UI where not needed in full (`+98912***4567`); experts' contact never public | Registry, Negaresh |
| Print | Test results render identically on screen and in A4 PDF (14 × 10 mm margins, embedded fonts, no JS-only content) | Test platform brief |
| Severity | Never by colour alone; two result views: professional and calm (teen/parent) | Test platform review #3 |

## 2. Shells

| Shell | Used by | Contents |
| --- | --- | --- |
| Public site | Main site, Test catalog, Registry (signed-out) | Top bar (logo slot, nav, search, account, theme), mega/simple menu, footer |
| Customer account | Main site, Registry, Test dashboard | Side nav → scrollable tab strip under 900 px; page header with actions |
| Admin | Main site (13 areas), Registry (11 pages), Test platform (14 sections), Org shell | Role-filtered side nav, dense tables, filters, inline actions, audit |
| Writer workspace | Main site (Contributor, Expert) | Content list with status, editor, revisions |
| Stripped (campaign) | Test platform | No user menu, no login offer; org label only |
| Login | Keycloak (all) | Phone, code, password, recovery, verify mobile, 2FA setup |
| Error | All | 403, 404, 410, 500, maintenance |
| Print | Test platform, invoices | A4 layout |

## 3. Requirement → component matrix

✓ = needed at launch · ○ = later phase of that product

| Component / pattern | Registry | Main site | Test platform | Ravanma |
| --- | --- | --- | --- | --- |
| Button, IconButton, Link, ButtonGroup | ✓ | ✓ | ✓ | ✓ |
| TextField, NumberField, TextArea, Select, ComboBox, SearchField | ✓ | ✓ | ✓ | ✓ |
| PhoneField (normalises 0/98/0098, Persian/Arabic digits) | ✓ | ✓ | ✓ | ✓ |
| CodeField / SerialField (LTR, normalise case, dashes, spaces) | ✓ | ✓ (serials in account) | ○ (B2B keys) | — |
| OTPField (6 digits, resend countdown) | ✓ | ✓ | ✓ | ✓ |
| JalaliDatePicker, DateRangePicker | ✓ admin | ✓ (schedule, coupons) | ✓ (birth date, campaign expiry) | ○ |
| Checkbox, RadioGroup, Switch, ChoiceCard, SegmentedControl | ✓ | ✓ | ✓ | ✓ |
| FileUpload / DropZone (CSV, images) | ✓ (serial import) | ✓ (media) | ✓ (roster CSV) | — |
| CopyField / CopyButton | ✓ | ✓ (serials) | ✓ (share links, keys) | — |
| CodeDisplay (large activation code) | ✓ | — | — | — |
| UsageMeter (slots used / limit + source) | ✓ | — | ✓ (seats) | — |
| Price (Toman, sale, free), PriceTag | ✓ | ✓ | ✓ | ○ |
| GatewayPicker, PaymentResult | ✓ | ✓ | ✓ | ○ |
| ProductCard, ProductGallery, EditionPicker | — | ✓ | ✓ (test card) | — |
| Cart, CouponField, OrderSummary, AddressForm | — | ✓ | — | — |
| Invoice (print) | — | ✓ | ○ | — |
| DataTable (sort, select, stack on mobile), Pagination, LoadMore | ✓ | ✓ | ✓ | — |
| FilterBar, Toolbar, BulkActions | ✓ | ✓ | ✓ | — |
| KeyValueList, StatTile, Sparkline | ✓ | ✓ | ✓ | — |
| StatusBadge (order, serial, review, report, payment) | ✓ | ✓ | ✓ | — |
| Timeline / History (activations, revisions, audit) | ✓ | ✓ | ✓ | — |
| DiffView (revision compare) | — | ✓ | — | — |
| Tabs, Disclosure/Accordion, Breadcrumbs, Stepper | ✓ | ✓ | ✓ | ✓ |
| Dialog, AlertDialog, Drawer/Sheet, Popover, Menu, Tooltip | ✓ | ✓ | ✓ | ✓ |
| Toast, Banner, InlineAlert, EmptyState, Skeleton, ProgressBar, Spinner, GlobalLoadingBar | ✓ | ✓ | ✓ | ✓ |
| Avatar, AvatarGroup, VerifiedBadge | — | ✓ | ✓ (org members) | — |
| ExpertCard, ExpertProfileHeader, Byline, AuthorCard | — | ✓ | — | — |
| ContentCard ×4 (article, post, quote, poll), FeaturedSlider | — | ✓ | — | — |
| Content blocks renderer (paragraph, headings, image, gallery, table, quote, FAQ, video, CalloutBox ×4, ContentCallout ×3, divider) | — | ✓ | ○ (knowledge base) | ○ |
| TableOfContents, ReadingTime, ShareButtons | — | ✓ | — | — |
| Poll (vote + results) | — | ✓ | — | — |
| CourseSyllabus, VideoPlayer frame, LessonNav, CourseProgress | — | ✓ | — | — |
| QuestionItem (labelled radio group; 2/4/6 options, Likert, forced choice) | — | — | ✓ | ✓ |
| AnswerProgress (page n of N, announced) | — | — | ✓ | ✓ |
| StartForm (demographics from schema) | — | — | ✓ | ✓ |
| ResultSummary, ScoreTable with bands, IntervalBar, InterpretationBlock | — | — | ✓ | ✓ |
| Charts: line, bar, radar, gauge, reference lines, dividers | — | ○ (reports) | ✓ | ✓ |
| ReportStatus (none, pending, ready, failed, purged) | — | — | ✓ | ○ |
| A4 PrintLayout | — | ✓ invoices | ✓ | ○ |
| CampaignBuilder, ShareLinkPanel, RosterImport, SeatMeter, WalletLedger | — | — | ✓ | — |
| SerialBatchGenerator, LimitEditor (effective limit + source), AlertChannelSettings | ✓ | — | — | — |
| ReviewQueue, PublishControls (5-state flow, schedule) | — | ✓ | — | — |
| SideNav, TopBar, UserMenu, PageHeader, LogoSlot, Footer | ✓ | ✓ | ✓ | ✓ |
| ErrorPage (403/404/410/500/maintenance) | ✓ | ✓ | ✓ | ✓ |

## 4. Content and state rules from the documents

- Registry activation errors are specific: unknown serial, wrong product, revoked, limit reached (FR-11).
- Same serial + same system code returns the earlier code without using a slot — the UI must say so (FR-12, J2).
- Effective limit always shows its source: serial, customer, product or global (FR-23).
- Payment return: success with tracking code, cancelled, failed (Test platform, Negaresh).
- Order states: awaiting payment → paid → fulfilled (processing → shipped) → completed; cancelled; refunded.
- Content review flow: draft → submitted → changes requested → scheduled → published (+ unpublished). Revisions compare and restore.
- Report status: none, pending, ready, failed, purged (180 days).
- Campaign start: identifier + extra fields; not on roster; already taken; seats full; closed/expired link.
- Every list has an empty state; every async area has loading and error states.
