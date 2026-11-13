/** One icon on the 24 × 24 grid, stroke-based, drawn for left-to-right. */
export interface IconDefinition {
  /** Stable name, e.g. `copy`, `chevronEnd`. */
  readonly name: string;
  /** Flip horizontally in RTL (directional icons: arrows, chevrons, send, undo…). */
  readonly mirrored: boolean;
  /** SVG child elements (paths, circles…) without the `<svg>` wrapper. Trusted, generated. */
  readonly body: string;
}
