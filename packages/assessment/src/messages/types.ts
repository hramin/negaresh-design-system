/**
 * Typed string catalogue for `@negaresh/assessment` (D-94).
 * Assessment components never hard-code visible Persian strings; they read from
 * `AssessmentMessagesProvider` (defaulting to `faAssessmentMessages`) or an optional
 * per-component `messages` prop.
 */
export interface AssessmentMessages {
  /** Question number badge prefix («پرسش ۳»). */
  questionNumber: (n: string) => string;
  /** Accessible required indicator suffix for a question stem. */
  requiredLabel: string;
  /** Default validation error for an unanswered required question. */
  unansweredError: string;
  /** Summary heading when one or more questions on the current page are unanswered. */
  unansweredSummaryTitle: (count: string) => string;
  /** Individual unanswered item link label inside FormErrorSummary. */
  unansweredSummaryItem: (questionNumber: string, stemPreview: string) => string;
  /** Page progress label («صفحهٔ ۳ از ۱۳»). */
  pageProgress: (current: string, total: string) => string;
  /** Screen-reader live announcement when the page changes. */
  pageProgressAnnouncement: (current: string, total: string, answered?: string, totalQuestions?: string) => string;
  /** Answered count helper («۱۲ از ۴۰ پرسش پاسخ داده شده»). */
  answeredCount: (answered: string, total: string) => string;
  /** Navigation button labels inside AnswerPage. */
  previousPage: string;
  nextPage: string;
  submitAnswers: string;
  submittingAnswers: string;
  /** Optional saved-draft indicator label. */
  draftSaved: string;

  /** StartForm defaults. */
  startFormSubmit: string;
  startFormErrorSummaryTitle: string;
  fieldRequiredError: (label: string) => string;
  fieldRangeError: (label: string, min?: string, max?: string) => string;
  campaignBlockers: {
    not_on_roster: { title: string; body: string };
    already_taken: { title: string; body: string };
    seats_full: { title: string; body: string };
    closed: { title: string; body: string };
    expired: { title: string; body: string };
  };

  /** ResumeOrRestart labels. */
  resumeTitle: string;
  resumeDescription: string;
  resumeLastSavedLabel: string;
  resumeProgressLabel: string;
  resumeExpiresLabel: string;
  resumeAction: string;
  restartAction: string;
  restartConfirmTitle: string;
  restartConfirmBody: string;
  restartConfirmAction: string;
  restartCancelAction: string;

  /** Result audience modes & severity labels (docs/foundations/data-viz.md). */
  modeBadge: {
    professional: string;
    calm: string;
  };
  resultKindLabel: {
    profile: string;
    type: string;
    index: string;
    themes: string;
  };
  severityProfessional: {
    ok: string;
    caution: string;
    severe: string;
  };
  severityCalm: {
    ok: string;
    caution: string;
    severe: string;
  };
  completedAtLabel: string;
  attemptCodeLabel: string;
  takerLabel: string;
  validityLabel: string;
  calmValidityLabel: string;
  calmSupportNote: string;

  /** ScoreTable columns and labels. */
  scoreTableCaption: string;
  scoreColumnScale: string;
  scoreColumnCode: string;
  scoreColumnRaw: string;
  scoreColumnValue: string;
  scoreColumnInterval: string;
  scoreColumnBand: string;
  scoreRangeBetween: (low: string, high: string) => string;
  scoreMissing: string;

  /** InterpretationBlock labels. */
  interpretationHeading: string;
  interpretationRecommendations: string;
  interpretationCalmRecommendations: string;
  interpretationEmpty: string;

  /** ReportStatus states (docs/02-requirements.md §4). */
  reportStatusTitle: string;
  reportDescriptions: {
    none: string;
    pending: string;
    ready: string;
    failed: string;
    purged: string;
  };
  reportGeneratedAtLabel: string;
  reportRetentionLabel: string;
  reportGenerateAction: string;
  reportDownloadAction: string;
  reportPrintAction: string;
  reportRetryAction: string;

  /** PrintLayout (A4) labels. */
  printReportLabel: string;
  printIssuedAtLabel: string;
  printReferenceIdLabel: string;
  printAudienceLabel: string;
  printConfidentialNote: string;

  /** SubmittedPage (campaign) labels. */
  submittedDefaultTitle: string;
  submittedDefaultBody: string;
  submittedCanCloseNote: string;
  submittedAtLabel: string;
  submittedTrackingCodeLabel: string;
}
