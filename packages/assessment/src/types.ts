import type {
  BandSpec,
  BarCategory,
  BarOrientation,
  BarSeries,
  ChartDirection,
  ChartMode,
  ChartSeverity,
  IntervalBarItem,
  ProfileLineCategory,
  ProfileLineDivider,
  ProfileLineSeries,
  RadarAxis,
  RadarSeries,
  ReferenceLineSpec,
} from '@negaresh/charts';
import type { ReportStatus as ReportLifecycleStatus } from '@negaresh/react';

/** Audience display mode for assessment results (`professional` clinical vs `calm` user/parent). */
export type AssessmentMode = ChartMode;

/** Semantic severity scale shared with `@negaresh/charts`. */
export type AssessmentSeverity = ChartSeverity;

/** Generic result presentation kinds from the test platform `/api/v1` contract. */
export type AssessmentResultKind = 'profile' | 'type' | 'index' | 'themes';

/** Report PDF lifecycle status aligned with `@negaresh/react` `StatusBadge` (`domain="report"`). */
export type AssessmentReportState = ReportLifecycleStatus;

/** Visual presentation variants for `QuestionItem`. */
export type QuestionVariant = 'standard' | 'likert' | 'forced-choice' | 'image';

/** Single selectable option inside `QuestionItem`. */
export interface QuestionOption {
  /** Submitted option value. */
  value: string;
  /** Visible option text. */
  label: string;
  /** Optional helper or secondary explanation for the option. */
  description?: string | undefined;
  /** Optional numeric/short badge (e.g. Likert scale step «۱»..«۷»). */
  stepLabel?: string | undefined;
  /** Optional option image (triggers image layout when present; `alt` required per WCAG 2.2 AA). */
  image?:
    | {
        src: string;
        alt: string;
      }
    | undefined;
  /** Disable this specific option. */
  isDisabled?: boolean | undefined;
}

/** Structured question definition consumed by `QuestionItem` and `AnswerPage`. */
export interface QuestionDefinition {
  /** Stable question identifier. */
  id: string;
  /** 1-based display number formatted in Persian digits. */
  number: number;
  /** Question stem rendered as the `<legend>` of the `<fieldset>`. */
  stem: string;
  /** Optional clarifying instruction displayed beneath the stem. */
  description?: string | undefined;
  /** Layout variant. Defaults to `'image'` when options have images, otherwise `'standard'`. */
  variant?: QuestionVariant | undefined;
  /** Optional grid column hint for standard 2/4/6-option layouts. */
  columns?: 1 | 2 | 3 | undefined;
  /** Start-side anchor label for Likert scales (e.g. «کاملاً مخالفم»). */
  likertStartLabel?: string | undefined;
  /** End-side anchor label for Likert scales (e.g. «کاملاً موافقم»). */
  likertEndLabel?: string | undefined;
  /** Selectable radio options (2/4/6 choices, 5/7 Likert, forced-choice pair, or image options). */
  options: readonly QuestionOption[];
  /** Whether an answer is required before advancing. Default `true`. */
  isRequired?: boolean | undefined;
}

/** Campaign entry blocker states from `docs/02-requirements.md` §4. */
export type CampaignBlockerKind =
  | 'not_on_roster'
  | 'already_taken'
  | 'seats_full'
  | 'closed'
  | 'expired';

/** Base metadata shared by every `StartForm` demographic schema field. */
interface DemographicFieldBase {
  name: string;
  label: string;
  description?: string | undefined;
  isRequired?: boolean | undefined;
  isDisabled?: boolean | undefined;
}

export interface ChoiceDemographicField extends DemographicFieldBase {
  type: 'choice';
  options: readonly { value: string; label: string; description?: string | undefined }[];
  /** Render as `radio`, `segmented` (2–5 short choices), or `select` (default for > 4 options). */
  presentation?: 'select' | 'radio' | 'segmented' | undefined;
  placeholder?: string | undefined;
}

export interface NumberDemographicField extends DemographicFieldBase {
  type: 'number';
  minValue?: number | undefined;
  maxValue?: number | undefined;
  step?: number | undefined;
  placeholder?: string | undefined;
}

export interface TextDemographicField extends DemographicFieldBase {
  type: 'text';
  placeholder?: string | undefined;
  /** Set `true` for LTR identifiers such as student/employee codes or emails (D-86). */
  ltr?: boolean | undefined;
  maxLength?: number | undefined;
  autoComplete?: string | undefined;
}

export interface JalaliDateDemographicField extends DemographicFieldBase {
  type: 'jalali-date';
  /** Earliest selectable ISO `YYYY-MM-DD`. */
  minValue?: string | undefined;
  /** Latest selectable ISO `YYYY-MM-DD`. */
  maxValue?: string | undefined;
}

/** Schema-driven demographic field definition for `StartForm`. */
export type DemographicField =
  | ChoiceDemographicField
  | NumberDemographicField
  | TextDemographicField
  | JalaliDateDemographicField;

/** Values submitted by `StartForm` (ISO `YYYY-MM-DD` for Jalali date fields, `number` for numbers). */
export type StartFormValues = Record<string, string | number | null>;

/** Validity or clinical framing callout attached to an assessment result. */
export interface AssessmentValidityNotice {
  status: 'valid' | 'caution' | 'invalid';
  title: string;
  body: string;
  /** Calm-mode alternative title (no alarming clinical jargon). */
  calmTitle?: string | undefined;
  /** Calm-mode alternative explanation. */
  calmBody?: string | undefined;
  /** Optional scale codes involved (e.g. `['L', 'F', 'K']`), rendered in `<Ltr>`. */
  scaleCodes?: readonly string[] | undefined;
}

/** Single scale/dimension score row consumed by `ScoreTable`. */
export interface AssessmentScoreItem {
  id: string;
  /** Optional clinical/scale code (e.g. `Hs`, `D`, `Pt`), displayed in `<Ltr>`. */
  code?: string | undefined;
  /** Persian scale or domain title. */
  label: string;
  /** Optional section heading for grouping scales (e.g. «مقیاس‌های روایی» / «مقیاس‌های بالینی»). */
  section?: string | undefined;
  /** Optional raw score displayed alongside standardized/index score. */
  rawScore?: number | undefined;
  /** Primary numeric score (e.g. T-score or 0–100 index). */
  value: number;
  /** Optional confidence interval lower bound. */
  low?: number | undefined;
  /** Optional confidence interval upper bound. */
  high?: number | undefined;
  /** Explicit professional band label (falls back to `severityProfessional`). */
  bandLabel?: string | undefined;
  /** Explicit calm-mode band label (falls back to `severityCalm`). */
  calmBandLabel?: string | undefined;
  /** Semantic severity level (calm mode automatically omits rose/danger). */
  severity?: AssessmentSeverity | undefined;
}

/** Single interpretation section consumed by `InterpretationBlock`. */
export interface AssessmentInterpretationSection {
  id: string;
  /** Logical section group (e.g. «روایی پاسخ‌دهی»، «شاخص‌های خلقی»، «بهزیستی روانی»). */
  section: string;
  /** Optional short scale code displayed in `<Ltr>`. */
  scaleCode?: string | undefined;
  /** Clinical/professional section title. */
  title: string;
  /** Calm-mode section title (falls back to `title`). */
  calmTitle?: string | undefined;
  /** Semantic severity level. */
  severity?: AssessmentSeverity | undefined;
  /** Mark section as a validity callout block. */
  isValidity?: boolean | undefined;
  /** Professional interpretation narrative. */
  body: string;
  /** Calm-mode supportive plain-language narrative (falls back to `body`). */
  calmBody?: string | undefined;
  /** Clinical follow-up recommendations in `professional` mode. */
  recommendations?: readonly string[] | undefined;
  /** Supportive next steps in `calm` mode (falls back to `recommendations`). */
  calmRecommendations?: readonly string[] | undefined;
}

interface BaseChartSpec {
  id: string;
  title: string;
  takeaway: string;
  calmTakeaway?: string | undefined;
  sourceNote?: string | undefined;
  ariaLabel: string;
  dir?: ChartDirection | undefined;
}

export interface ProfileLineChartSpec extends BaseChartSpec {
  type: 'profile-line';
  categories: readonly ProfileLineCategory[];
  series: readonly ProfileLineSeries[];
  domain: readonly [number, number];
  ticks?: readonly number[] | undefined;
  bands?: readonly BandSpec[] | undefined;
  referenceLines?: readonly ReferenceLineSpec[] | undefined;
  dividers?: readonly ProfileLineDivider[] | undefined;
  showValueLabels?: boolean | undefined;
}

export interface IntervalBarChartSpec extends BaseChartSpec {
  type: 'interval-bar';
  items: readonly IntervalBarItem[];
  domain: readonly [number, number];
  ticks?: readonly number[] | undefined;
  bands?: readonly BandSpec[] | undefined;
  referenceLines?: readonly ReferenceLineSpec[] | undefined;
}

export interface BarChartSpec extends BaseChartSpec {
  type: 'bar';
  categories: readonly BarCategory[];
  series: readonly BarSeries[];
  orientation?: BarOrientation | undefined;
  domain?: readonly [number, number] | undefined;
  ticks?: readonly number[] | undefined;
  bands?: readonly BandSpec[] | undefined;
  referenceLines?: readonly ReferenceLineSpec[] | undefined;
  showDirectLabels?: boolean | undefined;
}

export interface RadarChartSpec extends BaseChartSpec {
  type: 'radar';
  axes: readonly RadarAxis[];
  series: readonly RadarSeries[];
  domain: readonly [number, number];
  rings?: number | undefined;
}

export interface GaugeChartSpec extends BaseChartSpec {
  type: 'gauge';
  value: number;
  domain: readonly [number, number];
  label: string;
  bandWord: string;
  calmBandWord?: string | undefined;
  severity?: AssessmentSeverity | undefined;
  bands?: readonly BandSpec[] | undefined;
  referenceLines?: readonly ReferenceLineSpec[] | undefined;
}

/** Discriminated `/api/v1` chart spec mapped onto `@negaresh/charts` by `ResultChart`. */
export type AssessmentChartSpec =
  | ProfileLineChartSpec
  | IntervalBarChartSpec
  | BarChartSpec
  | RadarChartSpec
  | GaugeChartSpec;

/** Complete `/api/v1` assessment result contract consumed by result & print components. */
export interface AssessmentResult {
  id: string;
  attemptCode: string;
  testCode: string;
  testTitle: string;
  kind: AssessmentResultKind;
  /** ISO-8601 UTC timestamp formatted in Jalali (Tehran tz) by `@negaresh/utils`. */
  completedAt: string;
  takerName?: string | undefined;
  organizationName?: string | undefined;
  /** Summary headline in `professional` mode. */
  headline: string;
  /** Supportive summary headline in `calm` mode. */
  calmHeadline: string;
  /** Primary indicator word/code (e.g. «الگوی ۲-۷ (D–Pt)» or «شاخص ۷۲ از ۱۰۰»). */
  primaryBadge: string;
  /** Calm-mode primary indicator word. */
  calmPrimaryBadge: string;
  /** Overall numeric index for `kind === 'index'`. */
  indexScore?: number | undefined;
  indexDomain?: readonly [number, number] | undefined;
  /** Optional summary theme chips for `kind === 'themes'` or overview highlights. */
  themes?: readonly string[] | undefined;
  /** Optional overall severity of the headline summary. */
  overallSeverity?: AssessmentSeverity | undefined;
  /** Optional validity/clinical notice callout. */
  validity?: AssessmentValidityNotice | undefined;
  /** Ordered chart specs rendered by `ResultChart`. */
  charts: readonly AssessmentChartSpec[];
  /** Structured scale/dimension scores rendered by `ScoreTable`. */
  scores: readonly AssessmentScoreItem[];
  /** Structured narrative sections rendered by `InterpretationBlock`. */
  interpretations: readonly AssessmentInterpretationSection[];
  /** Norm & psychometric source note. */
  normNote: string;
  /** Clinical/confidentiality footer note for `professional` mode. */
  disclaimer: string;
  /** Supportive footer note for `calm` mode. */
  calmDisclaimer: string;
}
