import type { IconDefinition } from '@negaresh/icons';
import { cx } from '../internal/cx.ts';
import styles from './Icon.module.css';

export type IconSize = 'sm' | 'md' | 'lg';

export interface IconProps {
  /** An icon from `@negaresh/icons`, e.g. `iconCopy`. */
  icon: IconDefinition;
  /** 16 (inline, dense), 20 (default), 24 (navigation, empty states). Default `md`. */
  size?: IconSize;
  /**
   * Accessible name when the icon carries meaning on its own. Icons beside text
   * stay decorative (`aria-hidden`).
   */
  label?: string | undefined;
  className?: string | undefined;
}

/** SVG icon: 24 grid, token stroke, `currentColor`; directional icons flip in RTL. */
export function Icon({ icon, size = 'md', label, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      data-nds="Icon"
      data-icon={icon.name}
      data-size={size}
      data-mirrored={icon.mirrored || undefined}
      className={cx(styles.icon, className)}
      focusable="false"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: icon bodies are generated, trusted SVG shapes (@negaresh/icons tests)
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
}
