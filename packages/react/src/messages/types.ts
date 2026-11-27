/**
 * Strings that components render on their own (not passed by the app as children or
 * props). Components never hard-code them: they read the catalogue from <NdsProvider>.
 * Apps pass `faMessages` or build their own (e.g. from Paraglide).
 */
export interface NdsMessages {
  /** SkipLink text. */
  skipToContent: string;
  /** Visually hidden suffix for links that open in a new tab. */
  opensInNewTab: string;
  /** CopyButton default label and the announcement after copying. */
  copy: string;
  copied: string;
  copyFailed: string;
  /** Announced while a Button is pending, appended to its label. */
  pending: string;
  /** LogoSlot placeholder text until real logos exist (Q-02). */
  logoPlaceholder: string;
  /** Field validation messages (native browser text is not reliably Persian). */
  fieldRequired: string;
  fieldInvalid: string;
  fieldTooShort: string;
  fieldTooLong: string;
  fieldPatternMismatch: string;
  fieldTypeMismatch: string;
  /** Character counter, including the optional maximum. */
  characterCount: (count: number, maximum?: number) => string;
  searchClear: string;
  showPassword: string;
  hidePassword: string;
  serialHint: (pattern: string) => string;
  phoneInvalid: string;
  serialInvalid: string;
  errorSummaryTitle: string;
  /** Default Select placeholder when none is supplied. */
  selectPlaceholder: string;
  /** Compact summary when multiple options are selected in Select. */
  selectSelectedCount: (count: number) => string;
  /** ComboBox / Autocomplete listbox empty, loading, toggle, and create-new labels. */
  comboBoxNoResults: string;
  comboBoxLoading: string;
  comboBoxToggle: string;
  comboBoxCreateOption: (query: string) => string;
  /** TagField placeholder, live announcements, and validation errors. */
  tagFieldPlaceholder: string;
  tagAdded: (tag: string) => string;
  tagRemoved: (tag: string) => string;
  tagDuplicate: string;
  tagLimitReached: (max: number) => string;
  /** Numeric/date/time constraint validation messages. */
  fieldRangeUnderflow: string;
  fieldRangeOverflow: string;
  fieldStepMismatch: string;
  /** Default RangeSlider thumb labels and shared range separator («تا»). */
  sliderRangeStart: string;
  sliderRangeEnd: string;
  rangeSeparator: string;
  /** Jalali Calendar / DatePicker trigger and month navigation labels. */
  openCalendar: string;
  previousMonth: string;
  nextMonth: string;
  /** Accessible stepper prefixes for NumberField (SSR-safe). */
  numberIncrement: string;
  numberDecrement: string;
  /** OTPField per-slot accessible label, incomplete error, and resend countdown strings. */
  otpSlotLabel: (index: number, total: number) => string;
  otpIncomplete: (length: number) => string;
  otpResend: string;
  otpResendWait: (seconds: number) => string;
  otpResendReady: string;
  otpResent: string;
  /** FileUpload / DropZone prompt, actions, statuses, validation errors, and size formatting. */
  fileUploadDropPrompt: string;
  fileUploadChoose: string;
  fileUploadChooseMultiple: string;
  fileUploadRemove: (name: string) => string;
  fileUploadUploading: (percent?: number) => string;
  fileUploadComplete: string;
  fileUploadError: string;
  fileUploadInvalidType: (name: string, accept: string) => string;
  fileUploadTooLarge: (name: string, maxSize: string) => string;
  fileUploadTooMany: (maxFiles: number) => string;
  fileSize: (bytes: number) => string;
  /** Shared dismiss and live-region labels for alerts, banners, toasts, and loaders. */
  dismiss: string;
  dismissAlert: string;
  dismissBanner: string;
  toastRegionLabel: string;
  loading: string;
  globalLoadingLabel: string;
  /** Tone words used when an accessible status label is needed. */
  toneInfo: string;
  toneSuccess: string;
  toneWarning: string;
  toneDanger: string;
  /** UsageMeter formatted summary («۱ از ۱») and full-capacity label. */
  usageOf: (used: number, limit: number) => string;
  usageFull: string;
  /** Domain status labels for StatusBadge (order, payment, serial, review, report, campaign). */
  statusLabels: {
    order: {
      awaiting_payment: string;
      paid: string;
      processing: string;
      shipped: string;
      completed: string;
      cancelled: string;
      refunded: string;
    };
    payment: {
      pending: string;
      paid: string;
      failed: string;
      cancelled: string;
      refunded: string;
    };
    serial: {
      active: string;
      unused: string;
      limit_reached: string;
      revoked: string;
      expired: string;
    };
    review: {
      draft: string;
      submitted: string;
      changes_requested: string;
      scheduled: string;
      published: string;
      unpublished: string;
    };
    report: {
      none: string;
      pending: string;
      ready: string;
      failed: string;
      purged: string;
    };
    campaign: {
      draft: string;
      active: string;
      full: string;
      closed: string;
      expired: string;
    };
  };
  /** Preset copy for ErrorState / ErrorPage (403, 404, 410, 500, maintenance). */
  errorPresets: {
    403: { code: string; title: string; description: string; actionLabel: string };
    404: { code: string; title: string; description: string; actionLabel: string };
    410: { code: string; title: string; description: string; actionLabel: string };
    500: { code: string; title: string; description: string; actionLabel: string };
    maintenance: { code: string; title: string; description: string; actionLabel: string };
  };
  /** Overlays and standalone display primitives (P4 Wave 2). */
  closeDialog: string;
  closeSheet: string;
  confirm: string;
  cancel: string;
  contextualHelpLabel: string;
  verifiedExpert: string;
  avatarOverflow: (count: number) => string;
  avatarOverflowLabel: (count: number) => string;
  copyValue: (label: string) => string;
  /** Navigation components (P4 Wave 3). */
  sideNavLabel: string;
  tabStripLabel: string;
  breadcrumbsLabel: string;
  breadcrumbsExpand: string;
  paginationLabel: string;
  paginationPrevious: string;
  paginationNext: string;
  paginationPage: (page: number) => string;
  paginationPageOf: (page: number, total: number) => string;
  loadMore: string;
  loadMoreShowing: (loaded: number, total: number) => string;
  stepperLabel: string;
  stepCompleted: string;
  stepCurrent: string;
  stepUpcoming: string;
  userMenuLabel: string;
  userMenuRolesTitle: string;
  userMenuThemeTitle: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  signOut: string;
  footerLabel: string;
  /** Data display collections (P4 Wave 4). */
  tableColumns: string;
  tableColumnsLabel: string;
  tableDensity: string;
  tableDensityComfortable: string;
  tableDensityCompact: string;
  tableSortAscending: string;
  tableSortDescending: string;
  tableEmptyTitle: string;
  tableEmptyDescription: string;
  tableErrorTitle: string;
  tableErrorDescription: string;
  tableRetry: string;
  tableSelectAll: string;
  tableSelectRow: (label: string) => string;
  filterSearchLabel: string;
  filterSearchPlaceholder: string;
  filtersButton: string;
  filtersActiveCount: (count: number) => string;
  filtersSheetTitle: string;
  filtersApply: string;
  filtersReset: string;
  filtersActiveGroupLabel: string;
  filterRemoveChip: (label: string) => string;
  bulkActionsLabel: string;
  bulkSelectedCount: (count: number) => string;
  bulkSelectAll: string;
  bulkClearSelection: string;
  listEmptyTitle: string;
  listEmptyDescription: string;
  statDeltaUp: string;
  statDeltaDown: string;
  statDeltaNeutral: string;
  timelineLabel: string;
  timelineEmptyTitle: string;
  diffLabel: string;
  diffAdded: string;
  diffRemoved: string;
  diffUnchanged: string;
  diffModeUnified: string;
  diffModeSplit: string;
  diffSummary: (added: number, removed: number) => string;
  diffOldLine: string;
  diffNewLine: string;
  diffEmpty: string;
}
