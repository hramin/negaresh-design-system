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
}
