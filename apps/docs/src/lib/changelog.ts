export interface ChangesetEntry {
  id: string;
  packages: { name: string; bump: string }[];
  summary: string;
}

export interface PackageChangelogEntry {
  packageName: string;
  content: string;
}

export interface MilestoneRelease {
  phase: string;
  title: string;
  dateJalali: string;
  dateGregorian: string;
  status: 'approved' | 'active';
  packages: string[];
  highlights: string[];
}

const rawChangesets = import.meta.glob('../../../../.changeset/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const rawPackageChangelogs = import.meta.glob('../../../../packages/*/CHANGELOG.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/** Parses a Changesets markdown file with YAML frontmatter. */
export function parseChangesetMarkdown(id: string, raw: string): ChangesetEntry | null {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;
  const frontmatter = match[1] ?? '';
  const summary = (match[2] ?? '').trim();
  const packages: { name: string; bump: string }[] = [];
  for (const line of frontmatter.split(/\r?\n/)) {
    const m = line.match(/^['"]?([^'":]+)['"]?\s*:\s*(major|minor|patch)\s*$/);
    if (m?.[1] && m[2]) {
      packages.push({ name: m[1].trim(), bump: m[2].trim() });
    }
  }
  return { id, packages, summary };
}

export function loadPendingChangesets(): ChangesetEntry[] {
  const entries: ChangesetEntry[] = [];
  for (const [filePath, raw] of Object.entries(rawChangesets)) {
    const fileName = filePath.split('/').pop() ?? '';
    if (fileName.toLowerCase() === 'readme.md') continue;
    const id = fileName.replace(/\.md$/, '');
    const parsed = parseChangesetMarkdown(id, raw);
    if (parsed) entries.push(parsed);
  }
  return entries.sort((a, b) => a.id.localeCompare(b.id));
}

export function loadPackageChangelogs(): PackageChangelogEntry[] {
  return Object.entries(rawPackageChangelogs)
    .map(([filePath, content]) => {
      const parts = filePath.split('/');
      const pkgDir = parts[parts.length - 2] ?? 'unknown';
      return { packageName: `@negaresh/${pkgDir}`, content: content.trim() };
    })
    .sort((a, b) => a.packageName.localeCompare(b.packageName));
}

/** Approved phase-by-phase NDS milestone history (pre-v1 lock; P9 locks semver publication). */
export const MILESTONE_RELEASES: readonly MilestoneRelease[] = [
  {
    phase: 'P6',
    title: 'الگوهای محصول و پوستهٔ ورود Keycloak',
    dateJalali: '۶ آذر ۱۴۰۵',
    dateGregorian: '2026-11-27',
    status: 'approved',
    packages: ['@negaresh/patterns', '@negaresh/keycloak-theme'],
    highlights: [
      '۴۵ الگوی محصولی در ۶ دامنه (فروشگاه، رجیستری، مجله و متخصصان، دوره‌ها، پوسته‌های حساب و مدیریت، کارزارهای سازمانی و کیف پول آزمون).',
      'پوستهٔ یکپارچهٔ Keycloak 26+ با Keycloakify 11.16.4 (ورود با موبایل و کد ۶ رقمی، رمز عبور، بازیابی پیامکی، تأیید موبایل، احراز دومرحله‌ای TOTP و صفحه‌های خطا/اطلاع).',
      'بستهٔ JAR ساخته‌شده (`negaresh-keycloak-theme.jar`) و راستی‌آزمایی‌شده روی کانتینر زندهٔ Keycloak 26.1.',
    ],
  },
  {
    phase: 'P5',
    title: 'نمودارهای SVG و کیت ارزیابی و آزمون',
    dateJalali: '۵ آذر ۱۴۰۵',
    dateGregorian: '2026-11-26',
    status: 'approved',
    packages: ['@negaresh/charts', '@negaresh/assessment'],
    highlights: [
      '۹ جزء نمودار SVG سرورمحور (`ChartFrame`, `IntervalBar`, `ProfileLine`, `Bar`, `Radar`, `Gauge`, `Sparkline`, `ReferenceLine`, `Band`) خوانا بدون جاوااسکریپت و همراه با جدول جایگزین.',
      '۱۲ جزء کیت ارزیابی (`QuestionItem`, `AnswerPage`, `AnswerProgress`, `StartForm`, `ResumeOrRestart`, `ResultSummary`, `ScoreTable`, `InterpretationBlock`, `ResultChart`, `ReportStatus`, `PrintLayout`, `SubmittedPage`).',
      'نمایش دوگانهٔ حرفه‌ای و آرام (بدون رنگ رز در نمای آرام) و هم‌ارزی کامل صفحه و PDF قطع A4 (`0.000%` اختلاف بصری).',
    ],
  },
  {
    phase: 'P4',
    title: 'بازخورد، لایه‌های شناور، ناوبری و نمایش داده',
    dateJalali: '۵ آذر ۱۴۰۵',
    dateGregorian: '2026-11-26',
    status: 'approved',
    packages: ['@negaresh/react'],
    highlights: [
      'اجزای بازخورد و وضعیت (`InlineAlert`, `Banner`, `Toast`, `Badge`, `StatusBadge`, `ProgressBar`, `Meter`, `UsageMeter`, `Spinner`, `GlobalLoadingBar`, `Skeleton`, `EmptyState`, `ErrorPage`).',
      'لایه‌های شناور دسترس‌پذیر (`Dialog`, `AlertDialog`, `Sheet`, `Popover`, `Tooltip`, `ContextualHelp`) با تبدیل خودکار به برگهٔ پایینی زیر ۹۰۰ پیکسل.',
      'ناوبری و نمایش داده (`SideNav`, `TabStrip`, `Tabs`, `Breadcrumbs`, `Pagination`, `Stepper`, `Disclosure`, `Accordion`, `UserMenu`, `Footer`, `DataTable`, `FilterBar`, `BulkActionBar`, `KeyValueList`, `StatTile`, `Timeline`, `DiffView`, `Avatar`, `VerifiedBadge`, `Card`, `List`, `Image`).',
    ],
  },
  {
    phase: 'P3',
    title: 'فیلدهای ورودی و فرم‌های فارسی',
    dateJalali: '۴ آذر ۱۴۰۵',
    dateGregorian: '2026-11-25',
    status: 'approved',
    packages: ['@negaresh/react'],
    highlights: [
      'فیلدهای بومی ایران: `PhoneField` (+989…)، `SerialField` / `CodeField` (چپ‌به‌راست)، `OTPField` (۶ رقم با چسباندن و شمارش معکوس)، `DatePicker` و `Calendar` جلالی (`PersianCalendar`, منطقهٔ زمانی تهران).',
      'ورودی‌های پایه و انتخابگرها: `TextField`, `TextArea`, `NumberField`, `SearchField`, `PasswordField`, `Select`, `ComboBox`, `Checkbox`, `RadioGroup`, `ChoiceCard`, `SegmentedControl`, `Switch`, `Slider`, `TimeField`, `FileUpload`, `DropZone`, `TagGroup`, `Form`, `FieldGroup`, `FormErrorSummary`.',
      'راهنمای زندهٔ آداپتور `@tanstack/react-form` و `zod` در `/guides/tanstack-form-zod`.',
    ],
  },
  {
    phase: 'P2',
    title: 'مبانی، کنش‌ها، آیکون‌ها و هم‌ارزی صفحهٔ مرجع',
    dateJalali: '۲۵ آبان ۱۴۰۵',
    dateGregorian: '2026-11-16',
    status: 'approved',
    packages: ['@negaresh/react', '@negaresh/icons'],
    highlights: [
      'اجزای پایه (`ThemeProvider`, `Stack`, `Inline`, `Grid`, `Container`, `Surface`, `Section`, `Divider`, `Text`, `Heading`, `Ltr`, `Code`, `VisuallyHidden`, `SkipLink`, `Icon`, `LogoSlot`) و کنش‌ها (`Button`, `LinkButton`, `IconButton`, `Link`, `ButtonGroup`, `Toolbar`, `ToggleButton`, `CopyButton`, `Menu`, `TopBar`, `AccountPill`).',
      'مجموعهٔ ۷۶ آیکون خطی در `@negaresh/icons` با پرچم `mirrored` برای قرینه‌سازی RTL (D-95) و بومی‌سازی کامل ۲۳ بستهٔ React Aria به فارسی (D-97).',
      'بازسازی صفحهٔ مرجع فعال‌سازی رجیستری با هم‌ارزی پیکسلی ۱۲/۱۲.',
    ],
  },
  {
    phase: 'P1',
    title: 'اسکلت مونوپو، توکن‌های DTCG و ابزارهای فارسی',
    dateJalali: '۲۳ آبان ۱۴۰۵',
    dateGregorian: '2026-11-14',
    status: 'approved',
    packages: ['@negaresh/tokens', '@negaresh/theme-company', '@negaresh/utils'],
    highlights: [
      '۱۱۸ متغیر CSS ساخته‌شده از DTCG 2025.10 با Style Dictionary v5 و آزمون خودکار ۵۶ جفت کنتراست در دو حالت روشن و تیره.',
      'بستهٔ `@negaresh/utils` با پوشش آزمون ≥ ۹۵٪ برای ارقام فارسی، تاریخ جلالی (تهران)، تومان (D-26)، شمارهٔ موبایل و سریال.',
      'پایهٔ سایت مستندات TanStack Start، پایپ‌لاین CI و کانتینر پایهٔ Playwright (`v1.65.0-noble`, D-96).',
    ],
  },
];
