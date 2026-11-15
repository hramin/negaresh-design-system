/** Space steps (docs/foundations/layout.md). */
export type SpaceStep =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '8'
  | '10'
  | '12'
  | '16'
  | '20'
  | '24';
export const space = (step: SpaceStep) => `var(--nds-space-${step})`;

/** A reference to an NDS token, e.g. `var(--nds-content-narrow)`. Raw lengths are not accepted. */
export type TokenRef = `var(--nds-${string})`;
