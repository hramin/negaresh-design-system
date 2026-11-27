# Components

Status: `planned` → `building` → `review` → `approved`. P2 components are `approved` following owner confirmation on 16 Nov 2026 (P2 follow-up on 21 Nov 2026), all P3 components are `approved` following owner confirmation (Waves 1–2 on 21 Nov 2026; Waves 3–4 on 25 Nov 2026), all P4 components are `approved` following owner confirmation (Waves 1–2 on 25 Nov 2026; Waves 3–4 on 26 Nov 2026), and all P5 components (`@negaresh/charts` Wave 1 and `@negaresh/assessment` Wave 2) are `approved` following owner confirmation on 26 Nov 2026; docs pages are under `/components/<name>`, `/charts/<name>`, and `/assessment/<name>` on the NDS site. Products: R = Registry, N = Negaresh main site, T = Test platform, V = Ravanma. Phase = build phase (see `phases/`).

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
| DataTable | `Table` | sort, select, sticky header, column visibility, density, stacks to cards on mobile, empty/loading/error | R, N, T | approved |
| FilterBar | — | search + filters + chips + reset; filters move to Sheet on mobile | R, N, T | approved |
| BulkActionBar | `Toolbar` | appears on selection | R, N, T | approved |
| KeyValueList | — | label/value, LTR values, copyable | all | approved |
| StatTile, StatGroup | — | value, delta, sparkline | R, N, T | approved |
| Timeline / ActivityList | `GridList` | activations, audit, revisions | R, N, T | approved |
| DiffView | — | revision compare | N | approved |
| Avatar, AvatarGroup | — | image, initials | N, T | approved |
| VerifiedBadge | Badge | expert licence | N | approved |
| Card (generic) | — | media, body, footer; link card | all | approved |
| List, GridList | `GridList` | selectable rows | all | approved |
| Image | — | ratio, sizes, lazy; alt required prop | all | approved |

## Charts — `@negaresh/charts` (P5)

| Component | Base | Notes | Products | Status |
| --- | --- | --- | --- | --- |
| ChartFrame | — | `<figure>` with title, one-sentence takeaway, legend, source/norm note, loading/empty/error states, and native JS-free `<details>` data table alternative (`/charts/chart-frame`) | T, V, N, R | approved |
| ReferenceLine, Band | — | Reusable SSR SVG norm bands and dashed/dotted reference lines; automatically suppress rose/danger in `calm` mode (`/charts/chart-frame`) | T, V, N, R | approved |
| IntervalBar | `d3-scale` | Signature horizontal score + confidence interval bar with norm bands, cut-offs, `professional` and `calm` severity scales, mobile container-query stacking (`/charts/interval-bar`) | T, V | approved |
| ProfileLine | `d3-scale`, `d3-shape` | MMPI-style scale profile line with 50/65/70 reference lines, 40–60 norm band, vertical section dividers, non-diamond markers, keyboard-focusable points (`/charts/profile-line`) | T, V, N | approved |
| Bar | `d3-scale` | Vertical and horizontal categorical comparison bars, direct Persian value labels, greyscale-safe SVG `<pattern>` fills for multi-series (`/charts/bar`) | R, N, T, V | approved |
| Radar | `d3-scale`, `d3-shape` | Multi-axis professional/overview radar (D-67) with non-diamond vertex markers, always paired with visible data table (`/charts/radar`) | T, V | approved |
| Gauge | `d3-scale`, `d3-shape` | Bounded semicircular single-index arc gauge with Persian number + required band word, segmented bands, `professional` and `calm` modes (`/charts/gauge`) | T, V, N | approved |
| Sparkline | `d3-scale`, `d3-shape` | Axis-free compact inline trend SVG with required text summary, slots directly into `StatTile` (`/charts/sparkline`) | R, N, T | approved |

## Assessment kit — `@negaresh/assessment` (P5)

| Component | Base | Notes | Products | Status |
| --- | --- | --- | --- | --- |
| QuestionItem | `fieldset` + `legend` + RAC `RadioGroup` | Stem as `<legend>`, real `<input type="radio">` option chips; 2/4/6 choices, Likert (5/7), forced choice, image options with required `alt` (`/assessment/question-item`) | T, V | approved |
| AnswerPage | `QuestionItem` + `AnswerProgress` + `FormErrorSummary` | `n` questions per page, per-page required validation, unanswered summary with direct jump-to-radio focus, RTL page navigation (`/assessment/answer-flow`) | T, V | approved |
| AnswerProgress | `ProgressBar` | «صفحهٔ n از N» + determinate bar, polite `role="status"` live announcement on page change (`/assessment/answer-flow`) | T, V | approved |
| StartForm | `TextField`, `NumberField`, `Select`/`RadioGroup`, Jalali `DatePicker` | Schema-driven demographics (`choice`, `number`, `text`, `jalali-date`), campaign blocker states (`not_on_roster`, `already_taken`, `seats_full`, `closed`, `expired`), error summary (`/assessment/start-resume`) | T, V | approved |
| ResumeOrRestart | `ProgressBar`, `KeyValueList`, `AlertDialog` | One unfinished attempt per test; Jalali last-saved & expiry timestamps; destructive restart guarded by `AlertDialog` (`/assessment/start-resume`) | T, V | approved |
| ResultSummary | `Badge`, `InlineAlert`, `Code` | Headline, `profile`/`type`/`index`/`themes` kinds, Jalali completion metadata, validity callout; `professional` and `calm` (zero rose/danger) modes (`/assessment/result-overview`) | T, V | approved |
| ScoreTable | `Badge`, `Code` | Grouped scale rows with Persian tabular digits, optional raw score & confidence interval, severity word + icon; `professional` and `calm` (zero rose/danger) modes (`/assessment/result-overview`) | T, V | approved |
| InterpretationBlock | `Badge`, `Code` | Interpretation sections grouped by section, validity, and severity with recommendations; `professional` and `calm` (zero rose/danger) variants (`/assessment/interpretation-block`) | T, V | approved |
| ResultChart | `@negaresh/charts` `ChartFrame` | Declarative `/api/v1` chart spec adapter (`profile-line`, `interval-bar`, `bar`, `radar`, `gauge`) with automatic table/legend builders and `calm`/`professional` propagation (`/assessment/result-overview`) | T, V | approved |
| ReportStatus | `StatusBadge(domain="report")`, `Spinner`, `InlineAlert` | All 5 report lifecycle states (`none`, `pending`, `ready`, `failed`, `purged`) with Jalali retention timestamps, download/print actions, and retry (`/assessment/report-status`) | T, V | approved |
| PrintLayout (A4) | `@page` A4 (14 × 10 mm) + `LogoSlot` | Header, charts, score table, interpretation, confidentiality footer; `break-inside: avoid`, automatic light-paper print fidelity, Playwright A4 PDF & screen-vs-print parity (`/assessment/print-layout`, `/reference/assessment-report`) | T, N, V | approved |
| SubmittedPage | `Icon`, `Code` | Stripped campaign completion confirmation («می‌توانید این صفحه را ببندید»), Jalali submission timestamp, LTR tracking code (`/assessment/report-status`) | T, V | approved |

## Patterns — `@negaresh/patterns` (P6)

See `patterns.md`.
