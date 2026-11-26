# Components

Status: `planned` → `building` → `review` → `approved`. P2 components are `approved` following owner confirmation on 16 Nov 2026 (P2 follow-up on 21 Nov 2026), all P3 components are `approved` following owner confirmation (Waves 1–2 on 21 Nov 2026; Waves 3–4 on 25 Nov 2026), P4 Waves 1–2 (Feedback and status, Overlays, and standalone Display primitives) are `approved` following owner confirmation on 25 Nov 2026, and P4 Wave 3 (Navigation) is `approved` following owner confirmation on 26 Nov 2026; docs pages are under `/components/<name>` on the NDS site. Products: R = Registry, N = Negaresh main site, T = Test platform, V = Ravanma. Phase = build phase (see `phases/`).

Every component documents: anatomy, props, all applicable states (default, hover, focus-visible, pressed, disabled, loading, invalid, empty, read-only), keyboard map, ARIA notes, RTL notes, do/don't, and a mobile example.

## Foundation primitives — `@negaresh/react` (P2)

| Component | Base | Variants / notes | Products | Status |
| --- | --- | --- | --- | --- |
| ThemeProvider | — | Sets `data-theme`, density, locale (RAC `I18nProvider locale="fa-IR-u-ca-persian"`), reads theme cookie | all | approved |
| Stack, Inline, Grid, Container | — | Logical gaps; Grid auto-fill min width | all | approved |
| Surface, Section | — | Surface `default`/`plain`; Section `default`/`sunken` footer; no shadow | all | approved |
| Divider | `Separator` | horizontal / vertical | all | approved |
| Text, Heading | — | size, weight, tone tokens only | all | approved |
| Ltr, Code | — | LTR isolate; monospace + Latin digits | all | approved |
| VisuallyHidden, SkipLink | — | — | all | approved |
| Icon | — | size 16/20/24, `mirrored` | all | approved |
| LogoSlot | — | sizes, clear space, product label | all | approved |

## Actions (P2)

| Component | Base | Variants | Products | Status |
| --- | --- | --- | --- | --- |
| Button, LinkButton | `Button`, `Link` | primary, secondary, ghost, danger; sm/md/lg; icon start/end; `isPending`; `fullWidth` | all | approved |
| IconButton | `Button` | ghost, secondary; required `aria-label` | all | approved |
| Link | `Link` | inline, standalone, external (icon + sr text) | all | approved |
| ButtonGroup, Toolbar | `Toolbar` | — | all | approved |
| ToggleButton, ToggleButtonGroup | `ToggleButton(Group)` | — | N, T | approved |
| CopyButton | `Button` + clipboard | success feedback via toast/live region | R, N, T | approved |
| Menu, MenuTrigger | `Menu` | with sections, submenus, shortcuts | all | approved |

## Inputs (P3)

| Component | Base | Notes | Products | Status |
| --- | --- | --- | --- | --- |
| TextField | `TextField` | label, description, error, prefix/suffix, character count | all | approved |
| TextArea | `TextField` multiline | auto-grow | all | approved |
| NumberField | `NumberField` | Persian display, Latin input accepted | all | approved |
| SearchField | `SearchField` | clear, shortcut hint | all | approved |
| PhoneField | `TextField` + utils | normalises to +989…; LTR | all | approved |
| SerialField / CodeField | `TextField` + utils | LTR monospace; pattern hint; normalise | R, N, T | approved |
| OTPField | `TextField` ×6 pattern | paste, auto-advance, `autocomplete="one-time-code"`, resend countdown | all | approved |
| PasswordField | `TextField` | show/hide, strength hint | all | approved |
| Select | `Select` | single, multiple; RTL arrow | all | approved |
| ComboBox / Autocomplete | `ComboBox` | async, create-new | N, T | approved |
| Checkbox, CheckboxGroup | `Checkbox(Group)` | indeterminate | all | approved |
| RadioGroup | `RadioGroup` | vertical, horizontal | all | approved |
| ChoiceCard (radio/checkbox card) | `Radio`/`Checkbox` | with description, icon, price | R, N, T | approved |
| SegmentedControl | `ToggleButtonGroup` | 2–5 options (from Ravanma v3) | N, T, V | approved |
| Switch | `Switch` | — | all | approved |
| Slider, RangeSlider | `Slider` | Persian ticks | T, V | approved |
| DatePicker (Jalali), DateRangePicker, Calendar | `DatePicker` + `PersianCalendar` | Saturday start; min/max; Tehran tz | R, N, T | approved |
| TimeField | `TimeField` | 24 h | N | approved |
| FileUpload, DropZone | `FileTrigger`, `DropZone` | CSV/TXT, images; progress; errors | R, N, T | approved |
| TagGroup / TagField | `TagGroup` | removable tags | N | approved |
| Form, FieldGroup, FormErrorSummary | `Form` | server errors mapping | all | approved |

## Feedback and status (P4)

| Component | Base | Notes | Products | Status |
| --- | --- | --- | --- | --- |
| InlineAlert | — | info, success, warning, danger; title, actions | all | approved |
| Banner | — | page-level, dismissible | all | approved |
| Toast, ToastRegion | `UNSTABLE_Toast*` (wrapped behind owned NDS API) | queue, actions, `role=status` | all | approved |
| Badge | — | neutral, accent, status; dot | all | approved |
| StatusBadge | Badge | domain maps: order, payment, serial, review, report, campaign | all | approved |
| ProgressBar, Meter | `ProgressBar`, `Meter` | determinate, indeterminate | all | approved |
| UsageMeter | `Meter` | segmented slots, source note, full state | R, T | approved |
| Spinner, GlobalLoadingBar | — | — | all | approved |
| Skeleton | — | text, block, table rows | all | approved |
| EmptyState | — | icon, title, text, action | all | approved |
| ErrorState / ErrorPage | — | 403, 404, 410, 500, maintenance | all | approved |

## Overlays (P4)

| Component | Base | Notes | Products | Status |
| --- | --- | --- | --- | --- |
| Dialog, AlertDialog | `Modal`, `Dialog` | sizes; becomes bottom sheet below 900 px | all | approved |
| Sheet / Drawer | `Modal` | side (desktop), bottom (mobile) | all | approved |
| Popover | `Popover` | — | all | approved |
| Tooltip | `Tooltip` | text only; never essential info | all | approved |
| ContextualHelp | `DialogTrigger` + Popover | (i) help next to labels | all | approved |

## Navigation (P4)

| Component | Base | Notes | Products | Status |
| --- | --- | --- | --- | --- |
| TopBar, TopBarBrand, TopBarNav, TopBarNavLink | `Link` | logo slot, nav links, actions, optional `mobileMenu` slot (pulled forward in P2 follow-up; `Sheet` mobile drawer integrates in P4) | all | approved |
| AccountPill | `Button` | masked phone / display name + avatar trigger for `TopBar`; required `aria-label`; 44 px mobile target (pulled forward in P2 follow-up; reused by P4 `UserMenu` and P6 `AccountShell`) | all | approved |
| SideNav | `Link` + `Disclosure` | groups, badges, role-filtered; → TabStrip under 900 | R, N, T | approved |
| TabStrip (mobile nav) | `Link` / `Button` | scrollable | R, N, T | approved |
| Tabs | `Tabs` | horizontal, vertical (Ravanma leaf 3) | all | approved |
| Breadcrumbs | `Breadcrumbs` | collapse middle | N, T | approved |
| Pagination, LoadMore | `Link` / `Button` | server-rendered links | all | approved |
| Stepper | — | steps with done/current, `aria-current=step` | R, N, T | approved |
| Disclosure, Accordion | `Disclosure(Group)` | FAQ, syllabus | all | approved |
| UserMenu | `MenuTrigger` | composes `AccountPill` + `Menu`; adds roles and theme toggle | all | approved |
| Footer | — | link groups, legal | N, T | approved |

## Data display (P4)

| Component | Base | Notes | Products | Status |
| --- | --- | --- | --- | --- |
| DataTable | `Table` | sort, select, sticky header, column visibility, density, stacks to cards on mobile, empty/loading/error | R, N, T | planned |
| FilterBar | — | search + filters + chips + reset; filters move to Sheet on mobile | R, N, T | planned |
| BulkActionBar | `Toolbar` | appears on selection | R, N, T | planned |
| KeyValueList | — | label/value, LTR values, copyable | all | approved |
| StatTile, StatGroup | — | value, delta, sparkline | R, N, T | planned |
| Timeline / ActivityList | `GridList` | activations, audit, revisions | R, N, T | planned |
| DiffView | — | revision compare | N | planned |
| Avatar, AvatarGroup | — | image, initials | N, T | approved |
| VerifiedBadge | Badge | expert licence | N | approved |
| Card (generic) | — | media, body, footer; link card | all | approved |
| List, GridList | `GridList` | selectable rows | all | planned |
| Image | — | ratio, sizes, lazy; alt required prop | all | approved |

## Charts — `@negaresh/charts` (P5)

IntervalBar · ProfileLine · Bar · Radar · Gauge · Sparkline · ChartFrame (title, takeaway, legend, table alternative) · ReferenceLine · Band. Products: T, V, N (reports), R (admin dashboard).

## Assessment kit — `@negaresh/assessment` (P5)

| Component | Notes |
| --- | --- |
| QuestionItem | stem as legend, options as radio group; 2/4/6, Likert (5/7), forced choice; image options |
| AnswerPage | n questions per page, validation per page, unanswered summary |
| AnswerProgress | «صفحهٔ n از N» + bar, announced |
| StartForm | demographics from schema (choice, number, text, Jalali date) |
| ResumeOrRestart | one unfinished attempt per test |
| ResultSummary | headline, type/profile/index |
| ScoreTable | items with value, band, severity word |
| InterpretationBlock | by section and severity; pro and calm variants |
| ResultChart | chart spec → charts package |
| ReportStatus | none, pending, ready, failed, purged; retry |
| PrintLayout (A4) | header, chart, table, interpretation, footer note; 14 × 10 mm margins |
| SubmittedPage | campaign "you can close this page" |

## Patterns — `@negaresh/patterns` (P6)

See `patterns.md`.
