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
}
